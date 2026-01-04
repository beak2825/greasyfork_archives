// ==UserScript==
// @name           Narou Siori Button
// @name:ja        なろうしおりボタン
// @namespace      https://greasyfork.org/en/users/1264733
// @version        2024-08-30
// @description    Disable narou's new auto siori function and add a float siori button on page.
// @description:ja なろうの自動しおり機能を無効化、ページにフロート・しおり・ボタンを追加。
// @author         LE37
// @license        MIT
// @match          *://ncode.syosetu.com/*/*
// @match          *://novel18.syosetu.com/*/*
// @grant          none
// @require        https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/503103/Narou%20Siori%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/503103/Narou%20Siori%20Button.meta.js
// ==/UserScript==

(()=>{
	'use strict';

	// 自動しおり無効化
	// Install ublock origin or adblockplus then block narou's auto siori api below:
	// ||syosetu.com/favnovelmain/shioriupdateapi/
	// ||syosetu.com/favnovelmain18/shioriupdateapi/

	// Check current page doesn't have siori
	if (!$('.js-add_bookmark').length && !$('.js-siori').hasClass('is-active')) {
		// Create & append a float siori button
		$("body").append(`<button type="button" class="siori_btn">📌</button>`);
		const as_btn = $(".siori_btn");
		// Button style
		as_btn.css({ 'position': 'fixed', 'width': '44px', 'height': '44px', 'z-index': '9999', 'font-size': '200%', 'opacity': '50%', 'cursor': 'pointer', 'border': 'none', 'padding': 'unset', 'right': '2em', 'bottom': '2em' });

		// Check current page doesn't have siori info
		if (!$('input[name="siori_url"]').length) {
			const npath = location.host.startsWith("ncode") ? "favnovelmain/ichiupdateajax/useridfavncode" : "favnovelmain18/ichiupdateajax/xidfavncode";
			let userid;
			if ($('input[name="auto_siori"]').length) {
				userid = $('input[name="auto_siori"]').data('primary').split('_')[0];
				//console.log(userid);
			}
			const ninfo = $(".js-bookmark_updateconf_url").val();
			const novelid = ninfo.split('/')[6];
			const episode = ninfo.split('/')[8];
			const token = $('input[name="token"]').val();
			as_btn.append(`
				<input name="siori_url" type="hidden" value="https://syosetu.com/${npath}/${userid}_${novelid}/no/${episode}/?token=${token}">
			`);
		}

		// Button event
		as_btn.on('click' ,function() {
			let siori_url = $('input[name="siori_url"]').val();
			siori_url += '&callback=?';
			$.ajax({
				type:'get',
				url: siori_url,
				cache: false,
				dataType : 'jsonp',
				async:false,
				success: function(data, textStatus) {
					if (data.result == true) {
						//console.log('===V0===');
						$('.js-siori').addClass('is-active');
						// Hide siori button after success
						as_btn.css({ 'opacity': '0', 'cursor': 'auto' });
					}else{
						//console.log('===X1===');
					}
				},
				error: function(jqXHR, textStatus, errorThrown){
					//console.log('===X2===');
				}
			});
		});
	}
})();