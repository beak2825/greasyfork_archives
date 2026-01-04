// ==UserScript==
// @name         一键复制百度云文件名
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  用于百度云一键复制百度云文件名
// @author       codeshif
// @match        https://pan.baidu.com/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.1.1/jquery.min.js
// @require      https://cdn.bootcss.com/AlertifyJS/1.11.1/alertify.min.js
// @downloadURL https://update.greasyfork.org/scripts/369396/%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E7%99%BE%E5%BA%A6%E4%BA%91%E6%96%87%E4%BB%B6%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/369396/%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E7%99%BE%E5%BA%A6%E4%BA%91%E6%96%87%E4%BB%B6%E5%90%8D.meta.js
// ==/UserScript==

//  http://alertifyjs.com/notifier/position.html

(function() {
	'use strict';
    var styles = [
        'https://cdn.bootcss.com/AlertifyJS/1.11.1/css/alertify.min.css',
        'https://cdn.bootcss.com/AlertifyJS/1.11.1/css/themes/default.min.css'
    ];

    var partten = /\.mp4|\.avi|\.wmv|\.mkv|\.zip|\.rar|兄弟连新版|Linux视频教程/ig;

    for(var i = 0; i < styles.length; i++){
        $(['<link rel="stylesheet" type="text/css" href="',styles[i],'" />'].join('')).appendTo('head');
    }
    $('<link rel="stylesheet" type="text/css" href="https://cdn.bootcss.com/AlertifyJS/1.11.1/css/alertify.min.css" />').appendTo('head');
	var btnToolBoxHTML = '<a class="g-button" href="javascript:;" title="复制当前页文件名" style="display: inline-block;"><span class="g-button-right"><em class="icon icon-history" title="复制当前页文件名"></em><span class="text" style="width: auto;">复制文件名</span></span></a>';

	$(btnToolBoxHTML).appendTo('.tcuLAu').click(function () {

		getFileNamesFromNormalToClipboard();
		return false;
	});

	function getFileNamesFromNormalToClipboard() {

		var fileNames = $('.file-name .text a').map(function(){return $(this).text().replace(partten,'');});

		fileNames = $.map(fileNames,function(i,e){ return i;});
		fileNames = fileNames.join("\n");
        
        parseToClipboard(fileNames);
        
	}

	var btnPopupHTML = '<a class="g-button g-button-large x-button-copy" href="javascript:;" title="复制" style="float: right; padding-left: 40px;"><span class="g-button-right" style="padding-right: 40px;"><span class="text" style="width: auto;">复制</span></span></a>';

	$(document).on('click','.dialog-footer',function () {

//		if($('.dialog-footer:visible').length > 0){
		if($('.dialog-footer:visible .x-button-copy').length <= 0){
			$(btnPopupHTML).appendTo('.dialog-footer:visible').click(function () {

				var body = $(this).closest('.dialog-footer').prev();	// body
				var fileNames = body.find('.file-name .text a').map(function(){
					return $(this).text().replace(partten,'');
				});

				fileNames = $.map(fileNames,function(i,e){ return i;});
				fileNames = fileNames.join("\n");

				parseToClipboard(fileNames);

			});
		}
//		}
	});
    
    function parseToClipboard(str){
        
        $('textarea.x-textarea-copy').remove();
        var html = $('<textarea class="x-textarea-copy">'+str+'</textarea>').appendTo('body');
		html[0].select();
		html[0].setSelectionRange(0, html[0].value.length);
		document.execCommand("copy");
        alertify.set('notifier','position', 'top-center');
        alertify.success("已经复制到剪贴板");
    }


	// Your code here...
})();