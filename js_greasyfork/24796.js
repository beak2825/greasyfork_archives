// ==UserScript==
// @name        GA threads authorName
// @namespace   glav.su
// @description Добавляет имя автора в заглавный пост на страницах тредов форума "Глобальная авантюра".
// @include     http://glav.su/*/threads/*
// @include     https://glav.su/*/threads/*
// @version     1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/24796/GA%20threads%20authorName.user.js
// @updateURL https://update.greasyfork.org/scripts/24796/GA%20threads%20authorName.meta.js
// ==/UserScript==
var m_id, mch, a_tm = $("div.lContent").find("a")[0];
if( mch = a_tm.toString().match(/https*?:\/\/glav\.su\/forum\/.+?\/(\d+?)-message\/#message\d+/) ){
	m_id = mch[1];
	$.ajax({
		url: mch[0],
		dataType: 'html',
		success: function(data){
			var dt = data.toString().replace(/[\n\r]/mg, '');
			mch = dt.match(new RegExp('<td id="forumMessagesListMessage'+m_id+'AuthorName" class="fItem forumMessagesListMessageAuthorName">.*?(<a.*?<\/a>)')) 
				|| dt.match(new RegExp('<td id="forumMessagesListMessage'+m_id+'Author" class="fItem forumMessagesListDeletedMessageAuthor">.*?(<a.*?<\/a>)'));
			if( mch ){
				$(a_tm).before(mch[1]+'&nbsp;&nbsp;');
			}
		}
	});
}