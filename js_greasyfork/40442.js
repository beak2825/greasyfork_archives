// ==UserScript==
// @name			什么值得买 编辑器增强 in
// @namespace		http://tampermonkey.net/
// @version			0.51
// @description		编辑器 拖拽图片上传 粘贴图片上传
// @author			cuteribs
// @match			https://post.smzdm.com/tougao*
// @match			https://post.smzdm.com/edit/*
// @match			https://test.smzdm.com/p/*/submit*
// @match			https://test.smzdm.com/p/*/edit/*
// @grant			GM.xmlHttpRequest
// @icon 			https://www.smzdm.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/40442/%E4%BB%80%E4%B9%88%E5%80%BC%E5%BE%97%E4%B9%B0%20%E7%BC%96%E8%BE%91%E5%99%A8%E5%A2%9E%E5%BC%BA%20in.user.js
// @updateURL https://update.greasyfork.org/scripts/40442/%E4%BB%80%E4%B9%88%E5%80%BC%E5%BE%97%E4%B9%B0%20%E7%BC%96%E8%BE%91%E5%99%A8%E5%A2%9E%E5%BC%BA%20in.meta.js
// ==/UserScript==

(function () {
	let applyStyle = ($uDocument) => {
		let globalCss = `
		.edui-header .edit_Tit .xilie_input {
			width: 100%;
		}
		`;
		let editorCss = `
		body.view h2 {
			font-size: 23px;
			padding-top: 34px;
			margin: -34px 0 16px;
			padding-bottom: 5px;
			border-bottom: solid 1px #aaa;
		}
		body.view h3 {
			font-size: 19px;
			text-shadow: 1px 2px #ccc;
			margin: 0 0 16px;
		}
		body.view p {
			color: #333;
			line-height: 24px;
			padding: 0;
			margin: 0 0 20px;
		}
		body.view p img {
			max-width: 600px;
			margin: 10px;
			background-color: #fff;
			box-shadow: 0px 0px 5px 1px rgba(0,0,0,.5);
			transition: all 0.3s cubic-bezier(.25,.8,.25,1);
		}
		body.view p img.face {
			padding: 0;
			margin: 0;
			background-color: unset;
			box-shadow: unset;
		}
		body.view blockquote {
			padding: 10px 15px;
		}
		body.view blockquote p {
			color: #999;
		}
		`;

		$('<style type="text/css"></style>').html(globalCss).appendTo($('head'));
		$('<style type="text/css"></style>').html(editorCss).appendTo($uDocument.find('head'));
	};

	let downloadImage = (url) => {
		let dfd = $.Deferred();
		let mimeType;

		switch (url.substr(url.lastIndexOf('.'))) {
			case '.jpg':
				mimeType = 'image/jpg';
				break;
			case '.gif':
				mimeType = 'image/gif';
				break;
			default:
				mimeType = 'image/png';
				break;
		}

		GM.xmlHttpRequest({
			url: url,
			method: 'GET',
			responseType: 'blob',
			onload: res => dfd.resolve(new Blob([res.response], {
				type: mimeType
			}))
		});

		return dfd.promise();
	};

	let uploadImage = (blob, index, dfd) => {
		let uploadUrl;
		let id = $('#id').val();

		if (editorId == 'report_desc') {
			uploadUrl = `https://test.smzdm.com/public/ue_editor/pic_manage?act=uploadImg&type=probreport&uid=${''}&osid=${id}`;
		} else {
			uploadUrl = `https://post.smzdm.com/ajax_res?action=uploadImg&id=${id}&uid=&key=D7326DC2462053A1334080DA5490537C`;
		}

		if (!blob.name) {
			blob.name = 'image.png';
			blob.lastModifiedDate = new Date();
		}

		let data = new FormData();
		data.append('id', `WU_FILE_${index || 0}`);
		data.append('name', blob.name);
		data.append('type', blob.type);
		data.append('lastModifiedDate', blob.lastModifiedDate);
		data.append('size', blob.size);
		data.append('imgFile', blob, blob.name);

		$.ajax({
			url: uploadUrl,
			method: 'POST',
			data: data,
			processData: false,
			contentType: false,
			dataType: 'json'
		}).done(result => {
			if (result && result.error == 0) {
				let $img = $('<img>').attr('src', result.url.substr(result.url.indexOf(':') + 1));
				dfd.resolve($('<p>').append($img));
			}
		});
	};

	let uploadImages = (files, target) => {
		var dfds = [];

		for (var i = 0; i < files.length; i++) {
			var dfd = $.Deferred();
			uploadImage(files[i], i, dfd);
			dfds.push(dfd.promise());
		}

		insertContent(dfds, target);
	};

	let transferImage = (index, url) => {
		let dfd = $.Deferred();

		GM.xmlHttpRequest({
			method: 'GET',
			url: url,
			responseType: 'blob',
			onload: xhr => {
				let blob = new Blob([xhr.response], {
					type: 'image/png'
				});
				uploadImage(blob, index, dfd);
			}
		});

		return dfd.promise();
	};

	let insertContent = (dfds, target) => {
		$.when(...dfds).done((...$ps) => {
			switch (target.tagName) {
				case 'H2':
				case 'H3':
				case 'P':
					let $last = $(target);

					$.each($ps, (i, $p) => {
						$p.insertAfter($last);
						$last = $p;
					});

					break;
				default:
					let $target = $(target);

					$.each($ps, (i, $p) => {
						$target.append($p);
					});

					break;
			}
		});
	};

	let processYoudao = (html, target) => {
		let $html = $(html);
		let dfds = [];

		$.each($html, (i, el) => {
			if (el.tagName != 'DIV') {
				return;
			}

			let $line = $(el);
			let type = $line.attr('yne-bulb-block');

			switch (type) {
				case 'image':
					let url = $line.children('img').attr('src');
					dfds.push(transferImage(i, url));
					break;
				case 'heading':
					let fontSize = $line.children('span').css('font-size');
					let element = fontSize == '20px' ? '<h2>' : (fontSize == '16px' ? '<h3>' : '<p>');
					dfds.push($.Deferred().resolve($(element).text($line.text())));
					break;
				case 'paragraph':
					let $p = $('<p>');

					$.each($line[0].childNodes, (i, node) => {
						if (node.nodeType == 3) {
							$p.append(node.textContent);
						} else if (node.nodeType == 1) {
							if (node.tagName == 'SPAN') {
								if (node.style['font-weight'] == 'bold') {
									$p.append($('<strong>').text(node.textContent));
								} else {
									$p.append(node.textContent);
								}
							} else if (node.tagName == 'A') {
								$p.append($('<a>').attr('href', node.href).text(node.textContent));
							}
						}
					});

					if ($p.text().trim()) {
						dfds.push($.Deferred().resolve($p));
					}

					break;
			}
		});

		insertContent(dfds, target);
	};

	let transferData = (target, data) => {
		let files = data.files;

		if (data.files.length > 0) {
			uploadImages(data.files, target);
		} else {
			if (data.items.length == 1 && data.items[0].type == 'text/plain') {
				data.items[0].getAsString(s => $(target).append(s));
				return;
			}

			let dataItem = $.grep(data.items, i => i.type == 'text/uri-list')[0];

			if (dataItem) {
				dataItem.getAsString(s => downloadImage(s).done(blob => uploadImages(target, [blob])));
				return;
			}

			let htmlItem = $.grep(data.items, i => i.type == 'text/html')[0];

			if (htmlItem) {
				let textItem = $.grep(data.items, i => i.type == 'text/plain')[0];
				let isYoudao = false;
				htmlItem.getAsString(s => {
					if (s.indexOf('yne-bulb-block') > -1) {
						processYoudao(s, target);
						isYoudao = true;
					}
				});

				textItem.getAsString(s => {
					if (!isYoudao) {
						switch (target.tagName) {
							case 'H2':
							case 'H3':
							case 'P':
								$('<p>').text(s).insertAfter($(target));
								break;
							default:
								$(target).append($('<p>').text(s));
								break;
						}
					}
				});
			}
		}
	};

	let editorId = (location.host == 'test.smzdm.com') ? 'report_desc' : 'yuanchuang';

	UE.getEditor(editorId).ready(() => {
		let $uEditor = $('#ueditor_0');
		let $uDocument = $($uEditor[0].contentWindow.document);
		applyStyle($uDocument);
		let target = $uDocument.find('body.view')[0];

		$uDocument.on('dragstart', e => e.preventDefault());
		$uDocument.on('dragover', e => e.preventDefault());

		$uDocument.on('drop', e => {
			e.preventDefault();

			switch (e.target.tagName) {
				case 'H2':
				case 'H3':
				case 'P':
					target = e.target;
					break;
			}

			transferData(target, e.originalEvent.dataTransfer);
		});

		$uDocument.on('paste', e => {
			e.preventDefault();

			switch (e.target.tagName) {
				case 'H2':
				case 'H3':
				case 'P':
					target = e.target;
					break;
			}

			transferData(target, e.originalEvent.clipboardData);
		});
	});
})();