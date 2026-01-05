// ==UserScript==
// @name         Pixiv Easyer
// @namespace    http://
// @version      1.0
// @description  A script that makes pixiv great again
// @author       DriftKingTW(Pixiv ID:9934873)
// @match        http://www.pixiv.net/member_illust.php?mode=medium&illust_id=*
// @match        http://www.pixiv.net/member_illust.php?mode=manga&illust_id=*
// @match		 http://www.pixiv.net/member.php?id=*
// @require      http://code.jquery.com/jquery-latest.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26823/Pixiv%20Easyer.user.js
// @updateURL https://update.greasyfork.org/scripts/26823/Pixiv%20Easyer.meta.js
// ==/UserScript==

//sync test
(function() {
	'use strict';

	var bmBtn = $('.bookmark-container a');
	var favBtn = $('#favorite-button');
	var favSubmit = $('input[name="left_column"]');

	var tt = $('input[name="tt"]').val();
	var user_id = $('input[name="user_id"]').val();

	if(bmBtn.attr('class')=='add-bookmark _button'){
		bmBtn.attr('href', 'javascript: void(0);');
		bmBtn.bind('click', ajaxBookmark);
	}
	if(favBtn.attr('class')=='follow'){
		favSubmit.attr('href', 'javascript: void(0);');
		favSubmit.attr('type', 'button');
		favSubmit.bind('click', ajaxFollowUser);
	}

	function ajaxBookmark() {
		bmBtn.text('  Adding...  ');
		// get data
		var id = $('input[name="illust_id"]').val();
		// sent ajax request
		$.ajax( {
			url: 'http://www.pixiv.net/bookmark_add.php',
			type: 'POST',
			data: {
				'mode': 'add',
				'tt': tt,
				'id': id,
				'type': 'illust',
				'from_sid': '',
				'comment': '',
				'tag': '',
				'restrict': 0
			},
			success: function(response) {
				bmBtn.text('Edit Bookmark').attr({ class: 'edit-bookmark button-on',
												  href: 'http://www.pixiv.net/bookmark_add.php?type=illust&illust_id='+id });
			},
			error: function(xhr) {
				alert('ajax request failed!(((ﾟДﾟ;)))');
			}
		});
		bmBtn.unbind('click', ajaxBookmark);
	}

	function ajaxFollowUser() {
		favSubmit.val('  Adding...  ');
		// sent ajax request
		$.ajax( {
			url: 'http://www.pixiv.net/bookmark_add.php',
			type: 'POST',
			data: {
				'mode': 'add',
				'type': 'user',
				'user_id': user_id,
				'tt': tt,
				'from_sid': '',
				'restrict': 0,
				'left_column': 'OK'
			},
			success: function(response) {
				favSubmit.val('Followed');
			},
			error: function(xhr) {
				alert('ajax request failed!(((ﾟДﾟ;)))');
			}
		});
		favSubmit.unbind('click', ajaxFollowUser);
	}
})();