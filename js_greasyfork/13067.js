// ==UserScript==
// @name         Simkl inline tagging and memo taking
// @namespace    http://dannywhittaker.com
// @version      0.1
// @description  Adds inline-memos to Simkl for quick tagging
// @author       You
// @match        https://simkl.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13067/Simkl%20inline%20tagging%20and%20memo%20taking.user.js
// @updateURL https://update.greasyfork.org/scripts/13067/Simkl%20inline%20tagging%20and%20memo%20taking.meta.js
// ==/UserScript==

$(document).ready(function () {
	var userId, loaded = false, userData = {};
	
	function refreshData() {
		var animeUrl;
		
		userId = /\/(\d+)\//.exec($('#SimklHeaderMenuProfile').find('a').attr('href'))[1];
		
		if (userId) {
			animeUrl = '/' + userId + '/anime/';
			
			$.ajax({
				url: animeUrl
			}).done(function (obj) {
				var doc = $(obj), results, i, mapped = {};
				
				results = doc.find('.SimklTVMyTableTR').map(function () {
					return {
						id: /\/(\d+)\//.exec($(this).find('.SimklTVMyTableTRTitle a').attr('href'))[1],
						memo: $(this).find('.SimklTVMyTableTRMemo').text().replace(/\+ Add/, '')
					};
				});
				
				for (i = 0; i < results.length; i++) {
					mapped[results[i].id] = results[i];
				}
				
				userData = mapped;
				loaded = true
			});
		}
	}
	
	function refreshUi() {
		var currentAnimeId, userAnime, originalDiv, newObj;
	
		function setMemo() {
			var val = $(this).val();
			
			$.ajax({
				url: '/ajax/full/my_list.php',
				type: 'POST',
				data: {
					action: 'editTag',
					id: currentAnimeId,
					text: val
				}
			}).fail(function () {
				console.error(arguments);
				alert('Failed to save memo');
			});
		}
	
		if (loaded) {
			currentAnimeId = /\/anime\/(\d+)\//.exec(window.location.href)[1];
			
			if (currentAnimeId) {
				userAnime = userData[currentAnimeId];
				
				if (userAnime) {
					originalDiv = $('.SimklTVBtnBigAddToWatchListDiv').parent();
					
					if (originalDiv && originalDiv.length && !originalDiv.next('.js-zallist-inline-memo-wrap').length) {
						newObj = $('<textarea style="display: block; width: 100%; height: 80px; padding: 0; border: none; box-sizing: border-box; margin-top: 1em; background-color: rgba(255, 255, 255, 0.8); resize: vertical;" class="js-zallist-inline-memo-wrap"></textarea>');
						newObj.val(userAnime.memo);
						newObj.change(setMemo);
						newObj.insertAfter(originalDiv);
					}
				}
			}
		}
	}
	
	window.setInterval(refreshData, 60 * 1000);
	window.setInterval(refreshUi, 1 * 1000);
	
	refreshData();
});