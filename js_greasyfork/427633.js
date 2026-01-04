// ==UserScript==
// @name          天翼云盘助手
// @description   天翼云盘大文件免客户端下载、文件夹打包下载，支持2021年6月份改版后的天翼云盘。
// @version       2.1.13
// @namespace     TyCloud_Tools
// @icon          https://z3.ax1x.com/2021/05/31/2m1BTA.png
// @author        邓小明
// @include       *//cloud.189.cn/*
// @require       https://cdn.bootcdn.net/ajax/libs/jquery/2.1.4/jquery.min.js
// @run-at        document-start
// @grant         unsafeWindow
// @grant         GM_setClipboard
// @grant         GM_log
// @downloadURL https://update.greasyfork.org/scripts/427633/%E5%A4%A9%E7%BF%BC%E4%BA%91%E7%9B%98%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/427633/%E5%A4%A9%E7%BF%BC%E4%BA%91%E7%9B%98%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
	'use strict';
	$(document).ready(function () {
		init();
	});
})();

function init() {
	var append_html = `
	<style type="text/css">
	.M_show_file_list_btn{ cursor:pointer; display:none; position: relative; left: 60px; bottom: 160px; position:fixed; z-index: 998; }
	.M_show_file_list_btn span{ position: relative; }
	.M_show_file_list_btn span::after { position: absolute; left: 0; top: 0; content: '直链'; width: 50px; height: 50px; line-height: 50px; border-radius:50%; cursor:pointer; font-size: 14px; background-color: rgba(0,0,0,0.8); background-image:linear-gradient(286deg,#4CA0FC 23%,#E02FEE 76%); opacity: .9; color: #fff; text-align:center; box-shadow: 1px 1px 10px rgba(0,0,0,0.2); animation: rotate 0.5s linear infinite; }
	.M_show_file_list_btn span::before { content: ''; height: 8px; width: 50px; background: #000; opacity: .15; border-radius: 50%; position: absolute; top: 67px; left: 0; animation: shadow 0.5s linear infinite; }
	@keyframes shadow {
		0%, 100% { transform: scaleX(1); }
		50% { transform: scaleX(1.2); }
	}
	@keyframes rotate {
		0% { transform: translateY(0); }
		25% { transform: translateY(10px); }
		50% { transform: translateY(20px) scale(1.1, 0.9); }
		75% { ransform: translateY(10px); }
		100% { transform: translateY(0); }
	}
	.M_show_file_list { background-color: rgba(0,0,0,0.65); backdrop-filter:blur(5px); width:100vw; height: 100vh; z-index: 999; left: 0px; top: 0; position:fixed; }
	.M_show_file_list ::-webkit-scrollbar { width: 10px; height: 10px; background: 0 0; cursor: pointer; }
	.M_show_file_list ::-webkit-scrollbar-thumb { background-color: rgba(0, 0, 0, 0.2); border-radius: 10px; border-color: rgba(0, 0, 0, 0); border-style: solid; border-width: 1px; background-clip: padding-box; }
	.M_show_file_list ::-webkit-scrollbar-thumb:hover{ background-color: rgba(0, 0, 0, 0.3); }
	.M_show_file_list ::-webkit-scrollbar-thumb:active{ background-color: rgba(0, 0, 0, 0.45); }
	.M_show_file_list .M_dialog{ background-color: #fff; width:80%; max-width: 600px; min-height: 300px; margin:10vh auto 0; border-radius:5px; box-shadow: 1px 3px 24px rgba(0,0,0,0.2); }
	.M_show_file_list .M_dialog .M_dialog__header{ line-height: 44px; padding:5px 10px; border-radius:5px 5px 0 0; background-color:#f1f1f1; overflow: hidden; position: relative; }
	.M_show_file_list .M_dialog h2{ font-size: 20px; color:#333; font-weight:600; }
	.M_show_file_list .M_dialog .M_dialog__close{ position: absolute; right: 14px; top: 18px; width: 24px; height: 24px; background: url("data:image/svg+xml,%3Csvg viewBox='0 0 1045 1024' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath d='M282.517333 213.376l-45.354666 45.162667L489.472 512 237.162667 765.461333l45.354666 45.162667L534.613333 557.354667l252.096 253.269333 45.354667-45.162667-252.288-253.44 252.288-253.482666-45.354667-45.162667L534.613333 466.624l-252.096-253.226667z' /%3E%3C/svg%3E") center center no-repeat; background-size: 100% auto; opacity: .6; cursor: pointer; -webkit-transition: all ease .3s; transition: all ease .3s; }
	.M_show_file_list .M_dialog .M_dialog__close:hover{ -webkit-transform:rotate(90deg); transform:rotate(90deg); opacity:.8; }
	.M_show_file_list .M_dialog__body{ clear:both; padding-bottom: 5px; }
	.M_show_file_list .M_bread_crumb{ padding:0 10px; border-bottom:1px solid #eee; }
	.M_show_file_list .M_bread_crumb span{ background-color: #637dff; color:#fff; border-radius:5px; margin:5px 10px 5px 0; line-height: 30px; padding:0px 5px; display:inline-block; cursor: pointer; }
	.M_show_file_list .M_bread_crumb span:hover{ background-color: #4e6ef2;  }
	.M_show_file_list .M_folder_list{ min-height: 150px; max-height: 300px; overflow-y: auto; background-color: #fff; }
	.M_show_file_list ul li{ border-bottom:1px dashed #eee; color: #3f85ff; font-size: 14px; line-height: 30px; padding:6px 10px; }
	.M_show_file_list ul .M_show_folder,.M_show_file_list ul .M_show_file{ cursor:pointer; display: flex; }
	.M_show_file_list ul .M_show_folder:hover,.M_show_file_list ul .M_show_file:hover{ background-color: #f8f8f8; }
	.M_show_file_list ul .M_show_folder span,.M_show_file_list ul .M_show_file span{ flex: 1; color: #3f85ff; display:inline-block; line-height: 30px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; word-break: break-all; }
	.M_show_file_list ul .M_show_folder .M_folder_down{ display:inline-block; width:28px; height: 28px; border-radius: 5px; border:1px solid #3f85ff; margin-right:5px; background: url("data:image/svg+xml,%3Csvg viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath d='M832 800v64H192v-64h640zM545.664 160l-0.032 460.8 156.704-157.12 47.616 47.68L512 750.016 274.048 511.36l47.616-47.712 156.672 157.088V160h67.328z' fill='royalblue' /%3E%3C/svg%3E") center center no-repeat; background-size: 100% auto; }
	.M_show_file_list ul .M_show_folder .M_folder_down:hover{ background-color: #3f85ff; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath d='M832 800v64H192v-64h640zM545.664 160l-0.032 460.8 156.704-157.12 47.616 47.68L512 750.016 274.048 511.36l47.616-47.712 156.672 157.088V160h67.328z' fill='white' /%3E%3C/svg%3E");  }
	.M_show_file_list ul .M_show_file i{ font-size:12px; color: #999; font-style:normal; }
	.M_show_file_list ul .M_folder_empty{ text-align:center; line-height:180px; color:#999; border:none; }
	.M_file_direct_link{ margin:5px; background-color: #f5efff; font-size:12px; line-height:26px; max-height:78px; overflow-y:auto; border-radius:5px; padding-left:5px; word-break:break-all; }
	.M_file_direct_link a{ color: #3f85ff; line-height:26px; }
	.M_toast { display:none; width: 100%; height: 100vh; left: 0px; top: 0px; position: fixed; z-index: 9999; }
	.M_toast span { display: table; line-height: 30px; padding: 5px 10px; background-color: rgba(0, 0, 0, 0.75); color: #fff; border-radius: 5px; font-size: 14px; margin: 15vh auto 0; }
	</style>
	<div class="M_show_file_list_btn" title="查看当前页文件直链"><span></span></div>
	<div class="M_show_file_list">
		<div class="M_dialog">
			<div class="M_dialog__header">
				<h2>天翼云盘助手</h2>
				<span title="关闭" class="M_dialog__close"></span>
			</div>
			<div class="M_dialog__body">
				<div class="M_bread_crumb"><span class="M_back_parent">&lt;返回上一级</span> <span class="M_folder_download">打包下载</span></div>
				<ul class="M_folder_list"></ul>
				<div class="M_file_direct_link"></div>
			</div>
		</div>
	</div>
	<div class="M_toast"><span></span></div>
	`;
	$('body').append(append_html);
	$('.M_show_file_list').hide();
	$('.M_show_file_list_btn').on('click', function () {
		$('.M_show_file_list_btn').fadeOut();
		$('.M_show_file_list').fadeIn();
	});
	$('.M_show_file_list .M_dialog__close').on('click', function () {
		$('.M_show_file_list_btn').fadeIn();
		$('.M_show_file_list').fadeOut();
		$('.M_file_direct_link').empty();
	});
	if (window.location.href.indexOf('web/share') > -1) {
		request('/api/open/share/getShareInfoByCode.action', {
			shareCode: getQueryVariable('code'),
			noCache: Math.random()
		}, 'get', res => {
			console.log('getShareInfoByCode', res);
			M_share_id = res.shareId;
		});
	}
}

var M_share_id  = '';
var M_folder_id = 0;
var M_folder_name = '';
var M_is_login  = 0;

(function(open) {
	unsafeWindow.XMLHttpRequest.prototype.open = function() {
		this.addEventListener('load', fun => {
			var res = fun.currentTarget;
			if (res.status == 200 && res.response) {
				var url = res.responseURL;
				let json = fun.currentTarget.response;
				if(typeof(json) == 'string'){
					json = JSON.parse($.trim(json));
				}
				if (url.indexOf('file/listFiles.action') > -1) {
					//console.log('文件列表', json);
					if (json.res_code == 0) {
						M_folder_id = (/folderId=([-0-9]+)/.exec(url))[1];
						show_file_list(json.fileListAO);
					}
				} else if (url.indexOf('getUserBriefInfo.action') > -1) {
					if(json.sessionKey){
						setCookie('sessionKey', json.sessionKey);
					}
				} else if (url.indexOf('portal/listFiles.action') > -1) {
					//只有进入页面时会加载
					M_folder_name = json.path[json.path.length - 1].fileName;
				} else if (url.indexOf('user/getUserInfoForPortal.action') > -1) {
					//console.log('是否登录', json);
					if(json.loginName){
						M_is_login = 1;
					}
				} else if (url.indexOf('share/listShareDir.action') > -1) {
					//console.log('分享列表', json);
					$('.tips-save-box').fadeOut();
					if (json.res_code == 0) {
						M_folder_id = (/shareId=([-0-9]+)/.exec(url))[1];
						show_file_list(json.fileListAO);
					}
				} else if (url.indexOf('share/getShareInfoByCode.action') > -1) {
					if(json.shareId){
						M_share_id = json.shareId;
					} else {
						M_share_id = '';
					}
					if(json.isFolder == false && json.fileSize >= 1024*1024*1024){
						var file_id = json.fileId;
						var one_download_btn = $('.file-operate>.btn-download:eq(0)');
						GM_log('getShareInfoByCode', json);
						var new_one_download_btn = one_download_btn.clone().attr('title', '直链下载').off('click').on('click', function (e) {
							get_file_download_url(file_id, M_share_id);
						});
						GM_log('new_one_download_btn', new_one_download_btn);
						one_download_btn.replaceWith(new_one_download_btn);
					}
				} else if (url.indexOf('getFileDownloadUrl.action') > -1) {
					//console.log('文件下载', json);
				} else {

				}

			}
		});
		return open.apply(this, [].slice.call(arguments));
	};
})(unsafeWindow.XMLHttpRequest.prototype.open);

function show_file_list(data) {
	$('.M_folder_list').empty();
	if (data.count > 0 || data.fileListSize > 0) {
		$('.M_show_file_list_btn').fadeIn();
		$.each(data.folderList, function (index, item) {
			$('.M_folder_list').append('<li class="M_show_folder" data-id="' + item.id + '"><span title="进入文件夹：' + item.name + '">' + item.name + '</span>' + (item.id > 0 ? '<i class="M_folder_down" title="打包下载：' + item.name + '"></i>' : '') + '</li>');
			var file_list_item = $('.file-list-ul .c-file-item[data-fileid=' + item.id + ']');
			var isFolder = $(this).parents('.c-file-item').data('isFolder');
			/* 替换打开客户端下载按钮 */
			var download_btn = file_list_item.find('.file-item-ope-item-download');
			var new_download_btn = download_btn.clone().attr('title', '直链下载').off('click').on('click', function (e) {
				var file_id = $(this).parents('.c-file-item').data('fileid');
				var file_name = $.trim($(this).parents('.c-file-item').find('.file-item-name-fileName').text());
				get_folder_download_url(file_id, M_share_id, file_name);
			});
			download_btn.replaceWith(new_download_btn);
		});
		$.each(data.fileList, function (index, item) {
			$('.M_folder_list').append('<li class="M_show_file file_' + item.id + '" data-id="' + item.id + '" title="点击获取直链：' + item.name + '"><span>' + item.name + '</span> <i>' + conver(item.size) + '</i></li>');
			var file_list_item = $('.file-list-ul .c-file-item[data-fileid=' + item.id + ']');
			/* 点击文件名下载 */
			file_list_item.find('.file-item-name-fileName-span').attr('title', '点击下载').off('click').on('click', function (e) {
				var file_id = $(this).parents('.c-file-item').data('fileid');
				get_file_download_url(file_id, M_share_id);
			});
			if(item.size >= 1024*1024*1024){
				/* 替换打开客户端下载按钮 */
				var download_btn = file_list_item.find('.file-item-ope-item-download');
				var new_download_btn = download_btn.clone().attr('title', '直链下载').off('click').on('click', function (e) {
					var file_id = $(this).parents('.c-file-item').data('fileid');
					get_file_download_url(file_id, M_share_id);
				});
				download_btn.replaceWith(new_download_btn);
			}
		});
		$('.M_show_folder span').off('click').on('click', function (e) {
			$('.M_folder_list li').fadeOut();
			$('.M_file_direct_link').empty();
			$('.file-list-ul .c-file-item[data-fileid=' + $(this).parent().data('id') + '] .file-item-name').trigger('click');
			$('.file-list-ul .c-file-item[data-fileid=' + $(this).parent().data('id') + '] .file-item-name-fileName-span').trigger('click');
		});
		$('.M_show_file').off('click').on('click', function (e) {
			$('.M_file_direct_link').empty();
			get_file_download_url($(this).data('id'), M_share_id, 1);
		});
		if(M_folder_id == -11){
			$('.M_folder_download').hide();
		} else {
			$('.M_folder_download').show();
			$('.M_folder_download').off('click').on('click', function () {
				get_folder_download_url(M_folder_id, M_share_id);
			});
		}
		$('.M_folder_down').off('click').on('click', function () {
			get_folder_download_url($(this).parent().data('id'), M_share_id);
		});
		/* 选择文件或文件夹 */
		$('.file-item-check').off('click').on('click', function () {
			var check_count = $('.file-item-check[value="true"]').size();
			var button_normal_btn = $('.button-group>.button-normal:eq(1)');
			button_normal_btn.removeClass('disable');
			var new_button_normal_btn = button_normal_btn.clone().off('click').on('click', function (e) {
				if(check_count == 1){
					$('.file-item-check[value="true"]').next().find('.file-item-ope-item-download').trigger('click');
					$('.file-item-check[value="true"]').next().find('.file-item-name-fileName-span').trigger('click');
				} else if(check_count > 1){
					var file_id_array = [];
					$.each($('.file-item-check[value="true"]'), function (index, item) {
						file_id_array.push($(this).parents('.c-file-item').data('fileid'));
					});
					get_folder_download_url(file_id_array.join(','), M_share_id);
				} else {}
			});
			button_normal_btn.replaceWith(new_button_normal_btn);
		});
		$('.c-file-list .ant-checkbox').off('click').on('click', function () {
			if($(this).hasClass('ant-checkbox-checked')){
				var button_normal_btn = $('.button-group>.button-normal:eq(1)');
				button_normal_btn.removeClass('disable');
				var new_button_normal_btn = button_normal_btn.clone().off('click').on('click', function (e) {
					get_folder_download_url(M_folder_id, M_share_id);
				});
				button_normal_btn.replaceWith(new_button_normal_btn);
			}
		});
	} else {
		$('.M_show_file_list_btn').fadeOut();
		$('.M_folder_list').append('<li class="M_folder_empty">当前文件夹为空</li>');
	}
	setTimeout(() => {
		$('.c-file-list>div:first>div:first>div:first>span').size() > 1 ? $('.M_back_parent').show() : $('.M_back_parent').hide();
		$('.M_folder_download').attr('title', '打包下载文件夹  : ' + $('.c-file-list>div:first>div:first>div:first>span:last').text());
	}, 10);

	$('.M_back_parent').off('click').on('click', function (e) {
		$('.M_folder_list li').fadeOut();
		$('.M_file_direct_link').empty();
		$('.c-file-list span:eq(0)').trigger('click');
	});
	if(M_is_login == 0){
		request('/api/open/user/getUserInfoForPortal.action', {}, 'get', res => {
			if(res.loginName){
				M_is_login = 1;
			}
		});
	}

}

function get_file_download_url(fileid, shareid = '', show_link = 0) {
	if(M_is_login == 0){
		toast('请登陆后操作');
		return false;
	}
	toast('天翼云盘助手 优化下载');
	request('/api/open/file/getFileDownloadUrl.action', {
		fileId: fileid,
		dt: 1,
		shareId: shareid
	}, 'get', res => {
		var fileName = $.trim($('.file-list-ul .c-file-item[data-fileid=' + fileid + '] .file-item-name-fileName-span').text());
		var fileDownloadUrl = res.fileDownloadUrl + '&fileName=' + encodeURIComponent(fileName);
		if(show_link == 1){
			$('.M_file_direct_link').html('<b>直链网址：</b><a href="' + fileDownloadUrl + '" target="_blank" title="点击下载：' + fileName + '">' + fileDownloadUrl + '</a>');
		}
		download_url(fileDownloadUrl);
	});
}

function get_folder_download_url(folderid, shareid = '', filename) {
	if(M_is_login == 0){
		toast('请登陆后操作');
		return false;
	}
	toast('天翼云盘助手 优化下载');
	var sessionKey = getCookie('sessionKey');
	var file_download_url = '/downloadMultiFiles.action?sessionKey=' + sessionKey + '&fileIdS=' + folderid + '&downloadType=' + (shareid ? 3 : 1) + '&shareId=' + shareid + (filename ? '&filename=' + encodeURIComponent(filename) + '.zip' : '');
	download_url(file_download_url);
}

function download_url(url) {
	var element = document.createElement('iframe');
	var iframe_id = 'M_iframe_' + (Math.random().toString().replace('0.', ''));
	element.setAttribute('src', url);
	element.setAttribute('id', iframe_id);
	element.style.display = 'none';
	document.body.appendChild(element);
	setTimeout('document.body.removeChild(document.getElementById("' + iframe_id + '"))', 10000);
}

function download_text(filename, text) {
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
}

function request(url, data, type = 'get', success, error = () => {}) {
	$.ajax({
		url: url,
		data: data,
		type: type,
		success: success,
		error: error,
		headers: {
			Accept: 'application/json;charset=UTF-8'
		},
		dataType: 'json',
	});
}

function toast(text, time = 1) {
	$('.M_toast span').text(text);
	$('.M_toast').show().stop().delay(time * 1000).fadeOut();
}

function conver(limit) {
	var size = '';
	if (limit < 0.1 * 1024) {
		size = limit.toFixed(2) + 'B';
	} else if (limit < 0.1 * 1024 * 1024) {
		size = (limit / 1024).toFixed(2) + 'KB';
	} else if (limit < 0.1 * 1024 * 1024 * 1024) {
		size = (limit / (1024 * 1024)).toFixed(2) + 'MB';
	} else {
		size = (limit / (1024 * 1024 * 1024)).toFixed(2) + 'GB';
	}
	var sizestr = size + '';
	var len = sizestr.indexOf('\.');
	var dec = sizestr.substr(len + 1, 2);
	if (dec == '00') {
		return sizestr.substring(0, len) + sizestr.substr(len + 3, 2);
	}
	return sizestr;
}

function setCookie(name, value) { 
	var Days = 30;
	var exp = new Date();
	exp.setTime(exp.getTime() + Days*24*60*60*1000); 
	document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString(); 
}

function getCookie(name) {
	var strcookie = document.cookie;
	var arrcookie = strcookie.split('; ');
	for (var i = 0; i < arrcookie.length; i++) {
		var arr = arrcookie[i].split('=');
		if (arr[0] == name) {
			return arr[1];
		}
	}
	return '';
}

function delCookie(name) {
	var exp = new Date(); 
	exp.setTime(exp.getTime() - 1); 
	var cval = getCookie(name); 
	if(cval != null) {
		document.cookie= name + '=' + cval + ';expires=' + exp.toGMTString();
	}
}

function getQueryVariable(variable){
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i=0;i<vars.length;i++) {
		var pair = vars[i].split("=");
		if(pair[0] == variable){
			return pair[1];
		}
	}
	return(false);
}