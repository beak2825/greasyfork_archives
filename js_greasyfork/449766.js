// ==UserScript==
// @name        安庆市党史方志数字资源平台 研究学习
// @namespace   lincong1987
// @match       http://data.aqdsw.cn/*
// @grant       GM_xmlhttpRequest
// @grant       GM_notification
// @grant       GM_download
// @grant       GM_setClipboard
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_listValues
// @grant       GM_addValueChangeListener
// @grant       GM_removeValueChangeListener
// @grant       GM_getResourceText
// @grant       GM_getResourceURL
// @version     1.2
// @author      lincong1987
// @require     https://unpkg.com/jquery@3.6.0/dist/jquery.min.js
// @require     https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js
// @require     https://unpkg.com/downloadjs@1.4.7/download.js
// @require     https://unpkg.com/localforage@1.10.0/dist/localforage.js
// @description 方便本地化研究学习
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/449766/%E5%AE%89%E5%BA%86%E5%B8%82%E5%85%9A%E5%8F%B2%E6%96%B9%E5%BF%97%E6%95%B0%E5%AD%97%E8%B5%84%E6%BA%90%E5%B9%B3%E5%8F%B0%20%E7%A0%94%E7%A9%B6%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/449766/%E5%AE%89%E5%BA%86%E5%B8%82%E5%85%9A%E5%8F%B2%E6%96%B9%E5%BF%97%E6%95%B0%E5%AD%97%E8%B5%84%E6%BA%90%E5%B9%B3%E5%8F%B0%20%E7%A0%94%E7%A9%B6%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==
/* globals $ waitForKeyElements */

// http://www.hangzhouds.org.cn/HangzhouBook/list.aspx

// http://www.hangzhouds.org.cn/cn/BookLibrary/info.aspx?itemid=177

// http://www.hangzhouds.org.cn/cn/AncientBooks/list.aspx
/// asda dsas

;(function () {
	var rpc = {
		domain: 'http://localhost',
		port: 16800,
		token: '',
		dir: '/Users/lincong/Downloads/d3/',
	}
	var download_rpc_clicked = false
	var components_css = '' + '<style>' +
		'.message-bg{position:fixed;float:right;right:0;top:2%;z-index:10001;}' +
		'.message{margin-bottom:15px;padding:4px 12px;width:300px;display:flex;margin-top:-70px;opacity:0;}' +
		'.message-danger{background-color:#ffdddd;border-left:6px solid #FB544E;}' +
		'.message-success{background-color:#ddffdd;border-left:6px solid #56D100;}' +
		'.message-info{background-color:#e7f3fe;border-left:6px solid #0284FE;}' +
		'.message-warning{background-color:#ffffcc;border-left:6px solid #FFB500;}' +
		'.message-context{font-size:21px;word-wrap:break-word;word-break:break-all;}' +
		'.message_box_btn{text-align:right;}.message_box_btn button{margin:0 5px;}' +
		'#biz_config_rpc_form {margin: 10px 0; display:none;border:1px solid' +
		' #cfc0a5;' +
		'     padding:12px;background:linear-gradient(0deg,#f4e4c1,#f5f1e5);border-radius:4px;box-shadow:0 0 4px 0px #ffd683;color:#473010;text-shadow:0 0 1px white;}' +
		'.biz_get_rpc_pdf__actions { margin: 8px auto; text-align: center; border:1px solid' +
		' #cfc0a5;' +
		' padding:4px;background:linear-gradient(0deg,#f4e4c1,#f5f1e5);border-radius:4px;box-shadow:0 0 4px 0px #ffd683;color:#473010;text-shadow:0 0 1px white;}' +
		'.biz_config_rpc_form__header{ text-align: center }' +
		'.biz_config_rpc_form__header span a{ text-decoration: underline;  }' +
		'.biz_config_rpc_form__header h3{    margin: 0px 0 6px 0; font-size:' +
		' 18px; font-weight: bold}' +
		'.biz_config_rpc_form__item{ display:flex;justify-content:center;margin: 6px 0px 6px 0px}' +
		'.biz_config_rpc_form__item__label{    display:inline-block;width:100px;text-align:right;margin-right:10px;}' +
		'.biz_config_rpc_form__item__input{width:300px;padding:4px' +
		' 8px;border:1px solid #b79e75;border-radius:4px;box-shadow:0 0 4px #ebc886;}' +
		'' + '.download-process{ margin: 8px auto; padding: 8px; border: 1px' +
		' solid #BFBFBF; border-radius: 4px;' + ' }' +
		'.download-process .download-process__title{ text-align: center;' +
		' font-size:16px; ' + ' }' +
		'.download-process .download-process__title' +
		' .download-process__title__ok{color: #56D100}' +
		'.download-process .download-process__title' +
		' .download-process__title__total{color: #313C47}' + '' +
		'.download-process .download-process__bar{margin: 12px 12px 0px' +
		' 12px; text-align: left;}' +
		'.download-process .download-process__bar .download-process__block' +
		' {position:relative; color: #fff;padding: 4px 4px 4px' +
		' 4px;min-width: 24px; border-radius:' + ' 4px;\n' +
		'       height: 12px; line-height: 12px;' +
		'    display: inline-block;\n' + '    text-align: center;\n' +
		'    border: 1px solid #fff;\n' +
		'    background: #0284FE;box-shadow: 0' + ' 0 2px #0284FE;\n' +
		'    margin: 0 4px 20px 0;\n' + '    font-size: 12px;\n' + '}' +
		'.download-process .download-process__bar' +
		' .download-process__block .process__bar {' + 'display: none;\n' +
		'    content: "";\n' + '    position: absolute;\n' +
		'    height: 4px;\n' + '    width: 0%;\n' + '    left: 0;\n' +
		'    background: #56D100;\n' + '    border-radius: 2px;\n' +
		'    bottom: -8px;\n' + '    margin: 0 0px;\n' +
		'box-shadow: inset 0 0 1px 0px white;' + '}' +
		'.download-process .download-process__bar' +
		' .download-process__block.ok {background: #56D100; box-shadow: 0' +
		' 0 2px #56D100;}' + '.download-process .download-process__bar' +
		' .download-process__block.pedding {background: #FFB500; box-shadow:' +
		' 0' + ' 0 2px #FFB500;}' +
		
		'' + '.download-process .download-process__bar' +
		' .download-process__block .process__fastdown{' +
		' background-image:' +
		' url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjYwODEzNDg4NTkwIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI0NjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTcwNCAzNDEuMzMzMzMzaDY0YTY0IDY0IDAgMCAxIDY0IDY0djM2Mi42NjY2NjdhNjQgNjQgMCAwIDEtNjQgNjRIMjU2YTY0IDY0IDAgMCAxLTY0LTY0VjQwNS4zMzMzMzNhNjQgNjQgMCAwIDEgNjQtNjRoNjR2NjRoLTY0djM2Mi42NjY2NjdoNTEyVjQwNS4zMzMzMzNoLTY0di02NHogbS0xNTQuNzk0NjY3LTIxMi4yNjY2NjZsMC4wNDI2NjcgMzQ3LjQ1NiA3NC4wMDUzMzMtNzQuMDI2NjY3IDQ1LjIyNjY2NyA0NS4yNDgtMTUwLjgyNjY2NyAxNTAuODQ4LTE1MC44NDgtMTUwLjgyNjY2NyA0NS4yNDgtNDUuMjY5MzMzIDczLjE3MzMzNCA3My4xNzMzMzNWMTI5LjA2NjY2N2g2NHoiIHAtaWQ9IjI0NjIiIGRhdGEtc3BtLWFuY2hvci1pZD0iYTMxM3guNzc4MTA2OS4wLmkxIiBjbGFzcz0ic2VsZWN0ZWQiIGZpbGw9IiNmZmZmZmYiPjwvcGF0aD48L3N2Zz4=");' +
		'height: 12px;\n' +
		'    width: 12px;\n' +
		'    background-size: 100% 100%;\n' +
		'    display: inline-block;\n' +
		'    vertical-align: middle; margin-left: 4px;' +
		'' +
		'}' +
		
		'.download-process .download-process__bar' +
		' .download-process__block.process {background: #8E9BFA; box-shadow:' +
		' 0' + ' 0 2px #8E9BFA;}' +
		
		'.download-process .download-process__bar' +
		' .download-process__block.error {background: #FB544E; box-shadow: 0' +
		' 0 2px #FB544E;}' +
		
		'.download-process .download-process__bar' +
		' .download-process__block.ok  .process__bar  {display: block;' +
		' width: 100%}' +
		'.download-process .download-process__bar .download-process__block.pedding  .process__bar  {' +
		'display: block;' + '}' +
		'.download-process .download-process__bar .download-process__block.process  .process__bar  {}' +
		'.download-process .download-process__bar .download-process__block.error  .process__bar  {}' +
		'' +
		'.download-process .download-process__bar .download-process__block' +
		' .process__task{' + 'display: none;\n' + '    content: "";\n' +
		'    position: absolute;\n' + '    height: 0px;\n' +
		'    width: 0px;\n' + '    left: 50%;\n' + '    border-radius: 2px;\n' +
		'    top: -8px;\n' + '    margin: 0 0px;\n' +
		'    transform: translateX(-50%);' +
		'    border-top: 6px solid #FB544E;\n' +
		'    border-left: 6px solid #0000;\n' +
		'    border-right: 6px solid #0000;' + '}' +
		
		'.download-process .download-process__bar' +
		' .download-process__block.task{' +
		'border: 2px solid #FB544E;\n' +
		'    padding: 3px;' +
		'}' +
		
		'.download-process .download-process__bar' +
		' .download-process__block.task .process__task{' + 'display: none' +
		'}' +
		
		'.download-process .download-process__bar .download-process__block' +
		' .process__task__progress {' +
		'position: absolute; transform: scale(0.8); font-size: 12px;' +
		'bottom: -11px;  ' +
		'display: block;' +
		'color: #084b10;\n' +
		'    width: 100%;\n' +
		'    left: 0;\n' +
		'    text-shadow: 1px 1px 1px white;\n' +
		'    font-weight: bold;' +
		'}' +
		'.download-process .download-process__bar' +
		' .download-process__block.ok' +
		' .process__task__progress {display: block}' +
		'.download-process .download-process__bar' +
		' .download-process__block.pedding' +
		' .process__task__progress {display: block}' +
		
		'.biz_range_wrapper { display: inline-block; width: 360px; margin: 0' +
		' 12px' + ' \n' + '    ;vertical-align: middle;}' +
		'.biz_range { display: inline-block; width: 180px; }' +
		'#biz_start{    }' + '#biz_end{    }' + '' + '' + '</style>'
	var components_html = '' + '<div class="message-bg"></div>' +
		'<div id="message_box" style="opacity:0;display:none;position:fixed;inset:0px;top:0px;left:0px;width:100%;height:100%;background:rgba(0,0,0,0.7);animation-name:settings-bg;animation-duration:0.3s;z-index:10000;cursor:default;">' +
		'<div style="position:absolute;background:rgb(255,255,255);border-radius:10px;padding:20px;top:50%;left:50%;width:400px;transform:translate(-50%,-50%);cursor:default;">' +
		'<span style="font-size:20px"><b>提示：</b></span>' +
		'<div id="message_box_context" style="margin:2% 0;">...</div><br/><br/>' +
		'<div class="message_box_btn">' +
		'<button class="setting-button ant-btn ant-btn-primary" name="affirm">确定</button>' +
		'<button class="setting-button  ant-btn" name="cancel">取消</button></div>' +
		'</div></div>'
	var id = 0
	var antd_css = '<style>' +
		'.ant-btn{line-height:1.499;vertical-align:middle;position:relative;display:inline-block;font-weight:400;white-space:nowrap;text-align:center;background-image:none;box-shadow:0 2px 0 rgb(0 0 0 / 2%);cursor:pointer;transition:all .3s cubic-bezier(.645,.045,.355,1);-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;touch-action:manipulation;height:32px;padding:0 15px;font-size:14px;border-radius:4px;color:#000000a6;background-color:#fff;border:1px solid #d9d9d9}\n' +
		'.ant-btn:before{position:absolute;top:-1px;right:-1px;bottom:-1px;left:-1px;z-index:1;display:none;background:#fff;border-radius:inherit;opacity:.35;transition:opacity .2s;content:"";pointer-events:none}\n' +
		'.ant-btn-primary{color:#fff;background-color:#0284FE;border-color:#0284FE;text-shadow:0 -1px 0 rgb(0 0 0 / 12%);box-shadow:0 2px 0 rgb(0 0 0 / 5%)}' +
		'.ant-btn-danger{color:#fff;background-color:#FB544E;border-color:#FB544E;text-shadow:0 -1px 0 rgb(0 0 0 / 12%);box-shadow:0 2px 0 rgb(0 0 0 / 5%)}' +
		'</style>'
	
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
	// Scroll 滚动条
	utils.Scroll = {
		show: show_scroll,
		hide: hide_scroll,
	}
	
	function messageBox (ctx, type) {
		if (type === 'confirm') {
			$('div.message_box_btn button[name="cancel"]').show()
		} else if (type === 'alert') {
			$('div.message_box_btn button[name="cancel"]').hide()
		}
		if (ctx.html) {
			$('div#message_box_context').
				html('<div style="font-size:18px">'.concat(ctx.html, '</div>'))
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
	
	function show_scroll () {
		if ($('div#my_config').is(':hidden') &&
			$('div#message_box').is(':hidden')) {
			$('body').css('overflow', 'auto')
		}
	}
	
	function hide_scroll () {
		$('body').css('overflow', 'hidden')
	}
	
	function download_rpc (url, filename, type) {
		
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
				'token:'.concat(rpc.token), [location.origin + url], {
					dir: rpc.dir,
					out: filename + '.' + getType(url),
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
	
	$('body').append(components_html + components_css + antd_css)
	$('.menu').
		after(
			'<div class="biz_get_rpc_pdf__actions" id="biz_get_rpc_pdf__actions">' +
			'<div class="biz_range_wrapper">' +
			'<div class="biz_range">开始页:<input type="range" list="biz_start_marks" id="biz_start"' +
			' name="volume"\n' + '         min="1" max="1" step="1"  />' + '' +
			'<datalist id="biz_start_marks">\n' + '</datalist>' + '<span' +
			' id="biz_start_num">1</span></div>' +
			'<div class="biz_range">结束页:<input type="range"' +
			' list="biz_end_marks" id="biz_end"' + ' name="volume"\n' +
			'         min="1" max="20" step="1" />' + '' +
			'<datalist id="biz_end_marks">\n' + '</datalist>' + '<span' +
			' id="biz_end_num">1</span></div></div>' + '' + '' +
			'<span class="task_info"></span>' + '' + '' + '' +
			'<button' +
			' id=\'biz_download_rpc_pdf\' class=\'ant-btn' +
			' ant-btn-primary\' style="margin-right: 8px">点击下载学习</button> ' +
			'<button' +
			' id=\'biz_download_stop_pdf\' class=\'ant-btn' +
			' ant-btn-danger\' style="margin-right: 8px">停止</button>' +
			'<button' + ' id=\'biz_config_rpc_pdf\'' + ' class=\'ant-btn' +
			' \' style="margin-right: 8px">配置</button> ' + ' <button' +
			' id=\'biz_clear_cache_pdf\' class=\'ant-btn' +
			' ant-btn-primary\'>清除缓存</button></div>' +
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
			' ant-btn-primary\'>保存</button></div>' + '</div>' + '' + '')
	
	var $title = $('.page-nav > dl > dt')
	var filename = $title.text().replace(' 在线阅读', '')
	if (filename) {
		utils.Message.info('获取文件名成功 - ' + filename)
	}
	var $links = $('li[data-url*=\'.pdf\']')
	
	var globalPdfDoc = null
	var taskStop = false
	var tempPage = 0
	
	// pdf子册 数组
	var pdfs = []
	
	var pdfs_total_pages = 0
	
	// pdf map   {url: pdf}
	var pdfMap = {}
	
	// 下载任务 [pageIndex...]
	var taskPdfs = []
	var taskPdfsMap = {}
	
	$links.each(function (i, n) {
		var pdf = {
			status: '',
			filename: $(n).text(),
			url: $(n).attr('data-url'),
			page: i + 1,
			index: i,
		}
		
		pdfs.push(pdf)
		taskPdfs.push(pdf.page)
		taskPdfsMap[i + 1] = pdf
		pdfMap[pdf.url] = pdf
	})
	
	pdfs_total_pages = pdfs.length
	
	var store = localforage.createInstance({
		name: location.host + location.pathname,
	})
	
	$('#biz_config_rpc_form').
		after(
			'<div id=\'downloadProcess\' class=\'download-process\'>' + '' +
			'<div class=\'download-process__title\'> ' +
			'   <span class="download-process__taskname"></span> ' +
			'   进度' + ' ' +
			'   <span class=\'download-process__title__ok\'>--</span>/' +
			'   <span class=\'download-process__title__total\'>--</span>' +
			'   (<span class=\'download-process__title__percent\'>0%</span>)' +
			'   </span>' +
			'<div class=\'download-process__bar\'>' + (function () {
				return pdfs.map((pdf, i) => {
					var page = i + 1
					return '<span id="pdf_' + page + '" index="' + i + '" page="' +
						page + '" title="' + pdf.filename +
						'" class="download-process__block task">' + (i + 1) + ' ' +
						pdf.filename + '<a class="process__fastdown" page="' +
						page + '"' +
						' href="javascript:;"' +
						'></a>' +
						'<span class="process__bar"></span>' +
						'<span class="process__task"></span>' +
						'<span class="process__task__progress"></span>' +
						'</span>'
				}).join('')
			})() + '</div></div>')
	
	function setPercent (page) {
		
		var total = taskPdfs.length
		var index = taskPdfs.indexOf(page)
		
		$('.download-process__title__percent').
			text(parseFloat(((index + 1) / total) * 100).toFixed(2) +
				'%')
	}
	
	function setOKPage (num) {
		$('.download-process__title__ok').text(num)
	}
	
	function setProcessStatus (page, status) {
		$('#pdf_' + page).removeClass('pedding process ok error').
			addClass(status)
	}
	
	function setProcess (page, width) {
		$('#pdf_' + page + ' .process__bar').width(width)
		$('#pdf_' + page + ' .process__task__progress').text(width)
	}
	
	function setTasks (start, end) {
		$('.download-process__block').removeClass('task')
		$('.download-process__block').each(function (n, i) {
			var $this = $(this)
			var page = $this.attr('page')
			if (page >= start && page <= end) {
				$this.addClass('task')
			}
		})
		
		taskPdfs = pdfs.filter(function (value, index, array) {
			return value.page >= start && value.page <= end
		}).map(function (value, index, array) {
			return value.page
		})
		
		taskPdfsMap = {}
		taskPdfs.map(function (page) {
			taskPdfsMap[page] = getPdfByPage(page)
		})
		
		//$('.task_info').text()
		
		var targetFilename = getTaskFilename()
		$('.download-process__taskname').
			html(
				'《' + targetFilename + '》  ' + ' <br>任务共 ' + (end - start + 1) +
				'页')
		
		$('.download-process__title__total').text(taskPdfs.length)
		//console.log(taskPdfs, taskPdfsMap)
	}
	
	function getPdfByPage (page) {
		return pdfs.find(function (value) {
			return value.page === page
		})
	}
	
	function setPdfByPage (page, key, value) {
		var index = pdfs.findIndex(function (value) {
			return value.page === page
		})
		
		pdfs[index][key] = value
	}
	
	function checkCache (page) {
		
		var pdf = getPdfByPage(page)
		
		return new Promise((resolve, reject) => {
			store.getItem(pdf.url).then(function (ab) {
				
				if (ab) {
					resolve(ab)
				} else {
					
					GM_xmlhttpRequest({
						url: pdf.url,
						responseType: 'arraybuffer',
						onprogress (evt) {
							setProcess(page,
								Math.round(evt.loaded / evt.total * 100) + '%')
						},
						onloadstart () {
						},
						onloadend () {
						},
						onload (res) {
							store.setItem(pdf.url, res.response).
								then(function (ab) {
									resolve(ab)
								})
						},
					})

//					fetch(pdfs[index].url).then(function (res) {
//						setProcessStatus(index, 'process')
//						res.arrayBuffer().then(function (ab) {
//							store.setItem(pdfs[index].url, ab).
//								then(function (ab) {
//									resolve(ab)
//								})
//
//						})
//					})
					
				}
				
			}).catch(function (err) {
				console.log(err)
			})
			
		})
		
	}
	
	function fetchPdf (page) {
		
		if (taskStop === true) {
			tempPage = page
			return
		}
		
		setProcessStatus(page, 'pedding')
		
		checkCache(page).then(function (ab) {
			
			window.PDFLib.PDFDocument.load(ab).then(function (pdfDoc) {
				
				var pages = pdfDoc.getPages()

//				var curr = pdfs.reduce((pre, cur) => {
//					return pre + cur.pages
//				}, 0)
				
				var indices = pdfDoc.getPageIndices()
				
				globalPdfDoc.copyPages(pdfDoc, indices).
					then(function (currPages) {
						currPages.forEach(function (page) {
							globalPdfDoc.addPage(page)
						})
						
						var pdf = getPdfByPage(page)
						
						setPdfByPage(page, 'status', 'ok')
						setPdfByPage(page, 'pages', pages.length)
						
						setOKPage(page)
						setProcessStatus(page, 'ok')
						setPercent(page)
						setProcess(page, '100%')
						
						utils.Message.info(
							'文件下载成功' + pdf.filename + ' 共' + pages.length + '页')
						
						store.setItem('detail_' + pdf.url, {
							indices: indices,
							pages: pages.length,
						})
						
						if (taskPdfsMap[page + 1]) {
							fetchPdf(page + 1)
						} else {
							
							startDownload()
						}
					})
				
			})
			
		}).catch(function () {
			setProcessStatus(page, 'error')
			if (taskPdfsMap[page + 1]) {
				fetchPdf(page + 1)
			} else {
				startDownload()
			}
		})
	}
	
	function getTaskFilename () {
		var targetFilename = filename
		
		if (taskPdfs.length === 1 && pdfs.length === 1) {
		
		}
		
		if (taskPdfs.length === 1 && pdfs.length !== 1) {
			targetFilename = filename + ' (' + taskPdfs[0] + ')' + ''
		}
		
		if (taskPdfs.length !== pdfs.length && taskPdfs.length !== 1) {
			var start = taskPdfs[0]
			var end = taskPdfs[taskPdfs.length - 1]
			//	targetFilename = filename.replace(/.pdf$/, '')
			targetFilename = filename + ' (' + start + '-' + end + ')' + ''
		}
		
		return targetFilename
	}
	
	function startDownload () {
		
		var targetFilename = getTaskFilename()
		
		utils.Message.info(targetFilename + ' 开始合并PDF')
		globalPdfDoc.save().then(function (pdfBytes) {
			
			download(pdfBytes, targetFilename+'.pdf', 'application/pdf')
			
			utils.Message.info(targetFilename + ' 下载成功！')
		})
		
	}
	
	function startFetch () {
		var startPage = tempPage || taskPdfs[0]
		taskStop = false
		tempPage = 0
		fetchPdf(startPage)
	}
	
	function fetchPdfAndDownload () {
		window.PDFLib.PDFDocument.create().then(function (inst) {
			globalPdfDoc = inst
			startFetch()
		})
	}
	
	function stopPdfAndDownload () {
		taskStop = true
		utils.Message.info('已停止')
		//	$('#biz_download_stop_pdf').text('继续')
	}
	
	$('#biz_download_rpc_pdf').on('click', function (e) {
		//download_rpc(url, filename, 'post')
		utils.Message.info('开始下载')
		fetchPdfAndDownload()
		
	})
	
	$('#biz_download_stop_pdf').on('click', function (e) {
		//download_rpc(url, filename, 'post')
		stopPdfAndDownload()
	})
	
	$('#biz_config_rpc_pdf').on('click', function (e) {
		$('#biz_config_rpc_form').toggle()
	})
	
	$('#biz_config_rpc_form__save').on('click', function (e) {
		setConfig()
	})
	
	$('#biz_clear_cache_pdf').on('click', function (e) {
		store.clear(function () {
			utils.Message.info('缓存已清除！')
		})
	})
	
	var $biz_start = $('#biz_start')
	var $biz_start_num = $('#biz_start_num')
	var $biz_end = $('#biz_end')
	var $biz_end_num = $('#biz_end_num')
	var $biz_start_marks = $('#biz_start_marks')
	var $biz_end_marks = $('#biz_end_marks')
	
	$biz_start.attr('max', pdfs.length).on('mousemove', function (e) {
		var min = parseInt($(this).val(), 10)
		$biz_start_num.text(min)
		$biz_end.attr('min', min)
		$biz_end.attr('max', pdfs.length)
		var options = []
		for (var i = 0; i <= (pdfs.length - min); i++) {
			options.push('<option value="' + (i + 1 + min) + '"></option>')
		}
		$biz_end_marks.empty().append(options.join(''))
		
		setTasks(min, parseInt($biz_end.val(), 10))
	})
	
	$biz_start_marks.append(pdfs.map(function (n, i) {
		return '<option value="' + (i + 1) + '"></option>'
	}))
	
	$biz_end_num.text(pdfs.length)
	$biz_end.attr('max', pdfs.length).
		val(pdfs.length).
		//		on('mousemove', function (e) {
		//			console.log($(this).val())
		//		}).
		on('mousemove', function (e) {
			
			var max = parseInt($(this).val(), 10)
			
			$biz_end_num.text(max)
			$biz_start.attr('max', max)
			
			var options = []
			for (var i = 0; i <= max; i++) {
				options.push('<option value="' + (i + 1) + '"></option>')
			}
			$biz_start_marks.empty().append(options.join(''))
			
			setTasks(parseInt($biz_start.val(), 10), max)
		})
	
	$biz_end_marks.append(pdfs.map(function (n, i) {
		return '<option value="' + (i + 1) + '"></option>'
	}))
	
	$('.download-process__bar').on('click', '.process__fastdown', function (e) {
		var page = $(this).attr('page')
		checkCache(parseInt(page, 10)).then(function (ab) {
			var targetFilename = filename + '(' + page + ')'
			download(ab, targetFilename+'.pdf', 'application/pdf')
			utils.Message.info(targetFilename + ' 下载成功！')
		})
		
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
		utils.Message.info('保存成功！')
	}

//	(() => {
//		setTimeout(() => {
//			let blobOrDataUrl = GM_xmlhttpRequest({
//				url: pdfs[3].url,
//				responseType: 'arraybuffer',
//				onprogress(evt){
//					Math.round(evt.loaded / evt.total * 100) + "%";
//				},
//				onloadstart(){},
//				onloadend(){},
//				onload(){},
//			})
//			debugger
//
//		}, 2000)
//
//	})()
	
})()
