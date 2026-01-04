// ==UserScript==
// @name        杭州市方志馆 PDF快速下载，方便研究学习
// @namespace   lincong1987
// @match       http://www.hangzhouds.org.cn/cn/*/list.aspx*
// @match       http://www.hangzhouds.org.cn/*/list.aspx*
// @match       http://www.hangzhouds.org.cn/*/*/list.aspx*
// @grant GM_xmlhttpRequest
// @version     1.3
// @author      lincong1987
// @require      https://static.hdslb.com/js/jquery.min.js
// @description 杭州市方志馆 PDF快速下载，方便研究学习, 在线阅读费眼睛，下载本地再阅读棒棒棒！
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/439868/%E6%9D%AD%E5%B7%9E%E5%B8%82%E6%96%B9%E5%BF%97%E9%A6%86%20PDF%E5%BF%AB%E9%80%9F%E4%B8%8B%E8%BD%BD%EF%BC%8C%E6%96%B9%E4%BE%BF%E7%A0%94%E7%A9%B6%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/439868/%E6%9D%AD%E5%B7%9E%E5%B8%82%E6%96%B9%E5%BF%97%E9%A6%86%20PDF%E5%BF%AB%E9%80%9F%E4%B8%8B%E8%BD%BD%EF%BC%8C%E6%96%B9%E4%BE%BF%E7%A0%94%E7%A9%B6%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==
/* globals $ waitForKeyElements */

// http://www.hangzhouds.org.cn/HangzhouBook/list.aspx

// http://www.hangzhouds.org.cn/cn/BookLibrary/info.aspx?itemid=177

// http://www.hangzhouds.org.cn/cn/AncientBooks/list.aspx
/// asda dsas

//http://www.hangzhouds.org.cn/PartyBook/list.aspx
;
(function () {
	
	var rpc = {
		domain: 'http://localhost',
		port: 16800,
		token: '',
		dir: '/Users/lincong/Downloads/d3/',
	}
	var utils = {
		Message: undefined,
		MessageBox: undefined,
	}
	// Message & MessageBox
	utils.Message = {
		success: function (html) {
			return message(html, 'success')
		},
		warning: function (html) {
			return message(html, 'warning')
		},
		danger: function (html) {
			return message(html, 'danger')
		},
		info: function (html) {
			return message(html, 'info')
		},
	}
	utils.MessageBox = {
		alert: function (html, affirm) {
			return messageBox({
				html: html,
				callback: {affirm: affirm},
			}, 'alert')
		},
		confirm: function (html, affirm, cancel) {
			return messageBox({
				html: html,
				callback: {
					affirm: affirm,
					cancel: cancel,
				},
			}, 'confirm')
		},
	}
	var components_css = '' +
		'<style>' +
		'.message-bg{position:fixed;float:right;right:0;top:2%;z-index:10001;}' +
		'.message{margin-bottom:15px;padding:4px 12px;width:300px;display:flex;margin-top:-70px;opacity:0;}' +
		'.message-danger{background-color:#ffdddd;border-left:6px solid #f44336;}' +
		'.message-success{background-color:#ddffdd;border-left:6px solid #4caf50;}' +
		'.message-info{background-color:#e7f3fe;border-left:6px solid #0c86de;}' +
		'.message-warning{background-color:#ffffcc;border-left:6px solid #ffeb3b;}' +
		'.message-context{font-size:21px;word-wrap:break-word;word-break:break-all;}' +
		'.message_box_btn{text-align:right;}.message_box_btn button{margin:0 5px;}' +
		'#biz_config_rpc_form {display:none;border:1px solid #cfc0a5;' +
		'    margin-top:' +
		' 12px;padding:12px;background:linear-gradient(0deg,#f4e4c1,#f5f1e5);border-radius:4px;box-shadow:0 0 4px 0px #ffd683;color:#473010;text-shadow:0 0 1px white;}' +
		'.biz_get_rpc_pdf__actions { text-align: center; border:1px solid' +
		' #cfc0a5;' +
		' padding:4px;background:linear-gradient(0deg,#f4e4c1,#f5f1e5);border-radius:4px;box-shadow:0 0 4px 0px #ffd683;color:#473010;text-shadow:0 0 1px white;}' +
		'.biz_config_rpc_form__header{ text-align: center }' +
		'.biz_config_rpc_form__header span a{ text-decoration: underline;  }' +
		'.biz_config_rpc_form__header h3{    margin: 0px 0 6px 0; font-size:' +
		' 18px; font-weight: bold}' +
		'.biz_config_rpc_form__item{ display:flex;justify-content:center;margin: 6px 0px 6px 0px}' +
		'.biz_config_rpc_form__item__label{    display:inline-block;width:100px;text-align:right;margin-right:10px;}' +
		'.biz_config_rpc_form__item__input{width:200px;padding:4px 8px;border:1px solid #b79e75;border-radius:4px;box-shadow:0 0 4px #ebc886;}' +
		'.subcolumn-content .subcolumn-content-right .book-list-content' +
		' .book-list-wrap .book-list-item {text-align: center;}' +
		'</style>'
	var components_html = '' +
		'<div class="message-bg"></div>' +
		'<div id="message_box" style="opacity:0;display:none;position:fixed;inset:0px;top:0px;left:0px;width:100%;height:100%;background:rgba(0,0,0,0.7);animation-name:settings-bg;animation-duration:0.3s;z-index:10000;cursor:default;">' +
		'<div style="position:absolute;background:rgb(255,255,255);border-radius:10px;padding:20px;top:50%;left:50%;width:400px;transform:translate(-50%,-50%);cursor:default;">' +
		'<span style="font-size:20px"><b>提示：</b></span>' +
		'<div id="message_box_context" style="margin:2% 0;">...</div><br/><br/>' +
		'<div class="message_box_btn">' +
		'<button class="setting-button ant-btn ant-btn-primary" name="affirm">确定</button>' +
		'<button class="setting-button  ant-btn" name="cancel">取消</button></div>' +
		'</div></div>'
	
	function messageBox (ctx, type) {
		if (type === 'confirm') {
			$('div.message_box_btn button[name="cancel"]').show()
		} else if (type === 'alert') {
			$('div.message_box_btn button[name="cancel"]').hide()
		}
		if (ctx.html) {
			$('div#message_box_context').
				html('<div style="font-size:18px">'.concat(ctx.html,
					'</div>'))
		} else {
			$('div#message_box_context').
				html('<div style="font-size:18px">╰(￣▽￣)╮</div>')
		}
		$('#message_box').show()
		hide_scroll()
		$('div#message_box').animate({
			'opacity': '1',
		}, 300)
		$('div.message_box_btn button[name="affirm"]')[0].onclick =
			function () {
				$('div#message_box').hide()
				show_scroll()
				if (ctx.callback && ctx.callback.affirm) {
					ctx.callback.affirm()
				}
			}
		$('div.message_box_btn button[name="cancel"]')[0].onclick =
			function () {
				$('div#message_box').hide()
				show_scroll()
				if (ctx.callback && ctx.callback.cancel) {
					ctx.callback.cancel()
				}
			}
	}
	
	var id = 0
	
	function message (html, type) {
		id += 1
		messageEnQueue(
			'<div id="message-'.concat(id, '" class="message message-').
				concat(type, '"><div class="message-context"><p><strong>').
				concat(type, '\uFF1A</strong></p><p>').
				concat(html, '</p></div></div>'), id)
		messageDeQueue(id, 3)
	}
	
	function messageEnQueue (message, id) {
		$('div.message-bg').append(message)
		$('div#message-'.concat(id)).animate({
			'margin-top': '+=70px',
			'opacity': '1',
		}, 300)
	}
	
	function messageDeQueue (id, time) {
		if (time === void 0) {
			time = 3
		}
		setTimeout(function () {
			var e = 'div#message-'.concat(id)
			$(e).animate({
				'margin-top': '-=70px',
				'opacity': '0',
			}, 300, function () {
				$(e).remove()
			})
		}, time * 1000)
	}
	
	var antd_css = '<style>' +
		'.ant-btn{line-height:1.499;position:relative;display:inline-block;font-weight:400;white-space:nowrap;text-align:center;background-image:none;box-shadow:0 2px 0 rgb(0 0 0 / 2%);cursor:pointer;transition:all .3s cubic-bezier(.645,.045,.355,1);-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;touch-action:manipulation;height:32px;padding:0 15px;font-size:14px;border-radius:4px;color:#000000a6;background-color:#fff;border:1px solid #d9d9d9}\n' +
		'.ant-btn:before{position:absolute;top:-1px;right:-1px;bottom:-1px;left:-1px;z-index:1;display:none;background:#fff;border-radius:inherit;opacity:.35;transition:opacity .2s;content:"";pointer-events:none}\n' +
		'.ant-btn-primary{color:#fff;background-color:#1890ff;border-color:#1890ff;text-shadow:0 -1px 0 rgb(0 0 0 / 12%);box-shadow:0 2px 0 rgb(0 0 0 / 5%)}' +
		'</style>'
	$('body').append(components_html + components_css + antd_css)
	// Scroll 滚动条
	utils.Scroll = {
		show: show_scroll,
		hide: hide_scroll,
	}
	
	function show_scroll () {
		if ($('div#my_config').is(':hidden') &&
			$('div#message_box').is(':hidden')) {
			$('body').css('overflow', 'auto')
		}
	}
	
	function hide_scroll () {
		$('body').css('overflow', 'hidden')
	}
	
	var download_rpc_clicked = false
	
	function download_rpc (url, filename) {
		
		function getType (file) {
			var filename = file
			var index1 = filename.lastIndexOf('.')
			var index2 = filename.length
			var type = filename.substring(index1, index2)
			return type
		}
		
		var json_rpc = {
			id: window.btoa(
				'BParse_'.concat(Date.now(), '_').concat(Math.random())),
			jsonrpc: '2.0',
			method: 'aria2.addUri',
			params: [
				'token:'.concat(rpc.token),
				[
					url.indexOf(location.origin) !== -1
						? url
						: (location.origin +
							url),
				], {
					dir: rpc.dir,
					out: (filename + '.' + getType(url)).replace('..', '.'),
					header: [
						'User-Agent: '.concat(window.navigator.userAgent),
						'Referer: '.concat(window.location.href),
					],
				},
			],
		}
		utils.Message.info('发送RPC下载请求')
		let jsonrpc = JSON.stringify(json_rpc)
		let control = GM_xmlhttpRequest({
			url: ''.concat(rpc.domain, ':').concat(rpc.port, '/jsonrpc'),
			method: 'post',
			headers: {},
			responseType: 'json',
			data: JSON.stringify(json_rpc),
			onload: function (res) {
				
				if (res && res.response && res.response.id) {
					utils.Message.success('RPC请求成功，稍后将自动下载完成')
				} else {
					utils.Message.warning('RPC请求失败')
				}
				download_rpc_clicked = false
			},
			onerror: function () {
				utils.Message.danger('RPC请求异常，请确认RPC服务配置及软件运行状态')
				download_rpc_clicked = false
			},
		})
	}
	
	let pageTotal = $('#pagetotal').val()
	
	function getBookPage (url, successCallback) {
//		GM_xmlhttpRequest({
//			header: {},
//			onload:function (){}
//
//		})
		
		$.ajax({
			type: 'get',
			dataType: 'text',
			url: url,
			success (html) {
				successCallback(html.replace(/src/g, 'data-src').
					replace(/href/g, 'datahref').
					replace(/script/g, 'textarea').
					replace(/link/g, 'meta'))
			},
			error: function (e) {
				utils.Message.danger(
					'该地址内容获取失败 - ' + url)
			},
			
		})
		
	}
	
	function get () {
	
	}
	
	function startOneKeyTask () {
	
	}
	
	function renderDownloadLinkForEveryBook () {
		
		$('.book-list-item-word').each(function () {
			
			$(this).after('<button class=\'ant-btn' +
				' biz-rpc-download-pdf-every-book\' data-bookurl="' +
				this.href +
				'">下载学习</button>')
			
		})
		
		$('.book_journal li .name a').each(function () {
			
			$(this).attr("title", $(this).attr("href").replace(/(.*)itemid=(\d+)(.*)/g, "$2")).after('<div><button' +
				' class=\'ant-btn' +
				' biz-rpc-download-pdf-every-book-2\' data-bookurl="' +
				this.href +
				'">下载学习</button></div>')
			
		})
		
	}
	
	setTimeout(function () {
		renderDownloadLinkForEveryBook()
	}, 500)
	
	$('body').on('click', '.biz-rpc-download-pdf-every-book', function (e) {
		let bookurl = $(this).data('bookurl')
		
		download_book_by_url(bookurl)
		
	})
	
	$('body').on('click', '.biz-rpc-download-pdf-every-book-2', function (e) {
		let bookurl = $(this).data('bookurl')
		
		download_book_by_url(bookurl)
		
	})
	
	function download_book_by_url (url) {
		getBookPage(url, function (html) {
			let bookData = parseBookPageHtml(html, url)
			console.log(bookData)
			download_rpc(bookData.pdfurl, bookData.filename)
			
		})
	}
	
	function parseBookPageHtml (html, url) {
		url = url || "___"
		let filename = ''
		let pdfurl = ''
		let $html = $(html)
		
		let $link = $html.find('a[datahref*=\'.pdf\']')
		if ($link.length) {
			$link.attr('href', $link.attr('datahref'))
			pdfurl = $link[0].href
			utils.Message.info(
				'获取下载链接成功 - ' + '<a href=' + pdfurl + '>' + pdfurl + '</a>')
		}
		
		
		
		var $title = $html.find('.detail-h3')
		filename = $title.text().replace(' 在线阅读', '').trim()
		
		
		//
		if (url.indexOf("www.hangzhouds.org.cn/PartyBook/info.aspx") !== -1){
			var $title = $html.find('.journal_detail .info h2')
			filename = $title.text().replace(' 在线阅读', '').trim()
		}
		
		
		utils.Message.info('获取文件名成功 - ' + filename)
		
		return {
			filename: filename,
			pdfurl: pdfurl,
		}
	}
	
	// http://www.hangzhouds.org.cn/PartyBook/list.aspx
	$('.header').after('<div class="biz_get_rpc_pdf__actions"><button' +
		' id=\'biz_config_rpc_pdf\'' +
		' class=\'ant-btn' +
		' \' style="margin-right: 8px">配置</button> ' +
		//		'<button' +
		//		' id=\'biz_download_rpc_pdf\' style="margin-right: 8px"' +
		//		' class=\'ant-btn' +
		//		' ant-btn-primary\'>点击下载全部学习</button>' +
		//		'<button' +
		//		' id=\'biz_download_rpc_pdf\' class=\'ant-btn' +
		//		' ant-btn-primary\'>点击下载本页学习</button>' +
		'</div>' +
		'<div id="biz_config_rpc_form" style="">' +
		'<div class="biz_config_rpc_form__header"><h3>rpc配置</h3></div>' +
		'<div class="biz_config_rpc_form__header"><span>*' +
		' 请根据你的实际情况来配置一下内容</span></div>' +
		'<div class="biz_config_rpc_form__header"><span>*' +
		' 建议使用<a href="https://motrix.app/">motrix</a>来管理下载</span></div>' +
		'<div class="biz_config_rpc_form__item"><span class="biz_config_rpc_form__item__label">domain:</span>' +
		' <input class="biz_config_rpc_form__item__input"' +
		' id="biz_config_rpc_form__domain" /></div>' +
		'<div class="biz_config_rpc_form__item"><span' +
		' class="biz_config_rpc_form__item__label">端口:</span>' +
		'<input class="biz_config_rpc_form__item__input"' +
		' id="biz_config_rpc_form__port" /></div>' +
		'<div class="biz_config_rpc_form__item"><span class="biz_config_rpc_form__item__label">token:</span>' +
		'<input class="biz_config_rpc_form__item__input" id="biz_config_rpc_form__token" /></div>' +
		'<div class="biz_config_rpc_form__item"><span' +
		' class="biz_config_rpc_form__item__label">保存目录:</span>' +
		'<input class="biz_config_rpc_form__item__input" id="biz_config_rpc_form__dir" /></div>' +
		'<div class="biz_config_rpc_form__item"><button' +
		' id=\'biz_config_rpc_form__save\' class=\'ant-btn' +
		' ant-btn-primary\'>保存</button></div>' +
		'</div>' +
		'' +
		'')

//	var rpc = {
//		domain: 'http://localhost',
//		port: 16800,
//		token: '',
//		dir: '/Users/lincong/Downloads/d3/',
//	}

//	if (filename) {
//		utils.Message.info('获取文件名成功 - ' + filename)
//	}
//	var $link = $('a[href*=\'.pdf\']')
//	var url = $link.attr('href')
//	if ($link.length) {
//		utils.Message.info(
//			'获取下载链接成功 - ' + '<a href=' + url + '>' + url + '</a>')
//	}
	$('#biz_download_rpc_pdf').on('click', function (e) {
		download_rpc(url, filename, 'post')
	})
	
	$('#biz_config_rpc_pdf').on('click', function (e) {
		$('#biz_config_rpc_form').toggle()
	})
	
	$('#biz_config_rpc_form__save').on('click', function (e) {
		setConfig()
	})
	
	function getConfig () {
		
		let config = {}
		let biz_config_rpc_form__config = localStorage.getItem(
			'biz_config_rpc_form__config')
		if (!biz_config_rpc_form__config) {
			localStorage.setItem('biz_config_rpc_form__config',
				JSON.stringify(rpc))
			biz_config_rpc_form__config = rpc
			config = biz_config_rpc_form__config
		} else {
			rpc = JSON.parse(biz_config_rpc_form__config)
			config = rpc
		}
		
		$('#biz_config_rpc_form__domain').val(config.domain)
		$('#biz_config_rpc_form__port').val(config.port)
		$('#biz_config_rpc_form__token').val(config.token)
		$('#biz_config_rpc_form__dir').val(config.dir)
		
	}
	
	setTimeout(function () {
		getConfig()
	}, 500)
	
	function setConfig () {
		
		let rpc_config = {
			domain: $('#biz_config_rpc_form__domain').val(),
			port: $('#biz_config_rpc_form__port').val(),
			token: $('#biz_config_rpc_form__token').val(),
			dir: $('#biz_config_rpc_form__dir').val(),
		}
		
		rpc = rpc_config
		localStorage.setItem('biz_config_rpc_form__config', JSON.stringify(rpc))
		utils.MessageBox.alert('保存成功！')
	}
	
})()
