// ==UserScript==
// @name         一键认领
// @namespace    http://tampermonkey.net/
// @version      1.2.2
// @description  一键认领,支持猫站、观众
// @license      MIT
// @author       AisukaYuki
// @match        https://pterclub.com/userdetails.php*
// @match        https://pterclub.com/getusertorrentlist.php*
// @match        https://audiences.me/usertorrentlist.php*
// @match        https://audiences.me/userdetails.php*
// @require      https://greasyfork.org/scripts/453166-jquery/code/jquery.js?version=1105525

// @icon         https://www.google.com/s2/favicons?sz=64&domain=pterclub.com
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/488304/%E4%B8%80%E9%94%AE%E8%AE%A4%E9%A2%86.user.js
// @updateURL https://update.greasyfork.org/scripts/488304/%E4%B8%80%E9%94%AE%E8%AE%A4%E9%A2%86.meta.js
// ==/UserScript==
(function() {
	'use strict';
    /* globals jQuery, $, waitForKeyElements */
	var claim_btn = $('<input>', {
		id: 'claim_btn_act',
		type: 'button',
		value: '一键认领',
		style: 'margin-Left:5px'
	});

	var currentURL = window.location.href;

	if (currentURL.includes('userdetails')) {
		$('#ka1').before(claim_btn);
	} else if (currentURL.includes('torrentlist')) {
		$('#outer p:first').after(claim_btn);
	}else {
		console.log('找不到元素');
	}


	function act_CAT() {
		var list = $('.claim-confirm');
		list.each(function() {
			var url = 'https://pterclub.com/' + $(this).data('url');
            console.log(url);
			$.get(url);
		});
	}

	function act_AUD() {
		var list = $("span:contains(认领种子)");
		list.each(function() {
            console.log($(this).attr('id'));
			var url = 'https://audiences.me/claim.php?act=add&tid=' + $(this).attr('id').match(/(\d+)/)[0];
            console.log(url);
			$.get(url);
		});
	}

	function act() {
		if (currentURL.includes("pterclub.com")) {
			act_CAT();
		} else if (currentURL.includes("audiences.me")) {
			act_AUD();
		} else {
			console.log("暂不支持该站。");
		}
	}
	claim_btn.on('click',
	function() {
		var ka1 = $('#ka1').css('display');
		if (ka1 === 'none') {
			alert('请先展开做种列表。');
		} else {
			alert('开始执行，F12打开控制台，查看网络日志，等待响应完毕。');
			act();
			alert('完成');
			location.reload();
		}
	});
})();