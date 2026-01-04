// ==UserScript==
// @name         Teetee Toolkit
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  Add more feature on teetee.eu
// @author		PassiveDot
// @license		MIT
// @include		https://www.teetee.eu/en/
// @include		https://www.teetee.eu/en/shop/*
// @include		https://www.teetee.eu/en/design/*
// @grant		GM_addStyle
// @grant		GM_download
// @require		https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @require		https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js
// @compatible	chrome
// @compatible	firefox
// @downloadURL https://update.greasyfork.org/scripts/36605/Teetee%20Toolkit.user.js
// @updateURL https://update.greasyfork.org/scripts/36605/Teetee%20Toolkit.meta.js
// ==/UserScript==
window.$=this.$=this.jQuery = jQuery.noConflict(true);
$(function() {
	'use strict';
	$('head').append('<link href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css" rel="stylesheet">');
	GM_addStyle(`
#download-btn{position: absolute;top: 25px;right: 25px;color: #fff;background-color: #286ebb;padding: 2px 16px;border-radius: 5px;transition: all 0.5s ease 0s;z-index: 1;cursor: pointer;
font: normal 14px / 32px Helvetica, Arial, "Open Sans", "Microsoft Himalaya", sans-serif}
#download-btn:hover{background-color:#2852bb}
#download-icon{background-color: #286ebb;display: inline-block;width: 15px;height: 14px;
background: transparent url(https://js2.pngtree.com/images/home/pngTree-littleIcons.png?v=4) no-repeat -80px -58px;
margin: 0px 4px 0px 0px;}
`);
	function notifySuccess(){
		toastr.success('Download successful!');
		toastr.options = {
			"closeButton": false,"debug": false,"newestOnTop": false,"progressBar": false,"positionClass": "toast-top-center","preventDuplicates": true,"onclick": null,
			"showDuration": "300","hideDuration": "1000","timeOut": "2000","extendedTimeOut": "1000","showEasing": "swing","hideEasing": "linear","showMethod": "fadeIn","hideMethod": "fadeOut"
		};
	}
	var $pngEle=$('.design.left'),$titleEle=$('h1.product'),pngUrl,title,downBtn;
	if($pngEle.length>0&&$titleEle.length>0){
		pngUrl=$pngEle.attr('style').match(/http.+png/)[0];
		title=$titleEle.text().replace(/[\\/#:*?"<>|]/g,'');
		downBtn=$('<a id="download-btn"><i id="download-icon"></i> PNG</a>');
		downBtn.on('click', function() {
			var arg={
				url: pngUrl,
				name: title+'.png',
				saveAs: false,
				onload: function(){notifySuccess();},
				onerror: function (err) {console.log('Download failed!');console.error(err);}
			};
			if (typeof GM_download!=='undefined') {
				var result=GM_download(arg);
			}
		});
		$('.box-design').before(downBtn);
	}
});