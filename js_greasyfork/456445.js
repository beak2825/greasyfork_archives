// ==UserScript==
// @name         Pikabu COUB.COM preview
// @name:ru      Pikabu COUB.COM preview
// @namespace    http://pikabu.ru/
// @version      0.4
// @description  Shows COUB.COM videos on PIKABU.RU
// @description:ru  Преобразует ссылки на видео с сайта COUB.COM в полноценные превью
// @author       Rhoads
// @license      CC-BY-SA-4.0
// @match        https://pikabu.ru/*
// @icon         https://cs14.pikabu.ru/avatars/2609/m2609364-1795047659.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456445/Pikabu%20COUBCOM%20preview.user.js
// @updateURL https://update.greasyfork.org/scripts/456445/Pikabu%20COUBCOM%20preview.meta.js
// ==/UserScript==

(function(){
	'use strict';

	function enumerateComments()
	{
		document.querySelectorAll('div.comments__container > div.comment div.comment__body > div.comment__content').forEach((commentContent) => rewriteComment(commentContent));
	}

	function rewriteComment(commentContent)
	{
		//console.log(`[PIKABU - COUB PREVIEW] commentContent: ${commentContent.innerHTML}`);

		commentContent.innerHTML = commentContent.innerHTML.replace(/<a href=\"https?:\/\/coub.com\/view\/(\w+)\" target=\"_blank\" rel=\"nofollow noopener\">https?:\/\/coub.com\/view\/\w+<\/a>/, replacer);
	}

	function replacer(match, coub)
	{
		//console.log(`[PIKABU - COUB PREVIEW] match: ${match}, coub: ${coub}`);

		return `<iframe src="https://coub.com/embed/${coub}?originalSize=true&startWithHD=true" allowfullscreen frameborder="0" width="640" height="480" allow="autoplay"></iframe>`;
	}

	enumerateComments();

	// Ajax listener
	!function(send)
	{
		XMLHttpRequest.prototype.send = function(body)
		{
			//console.log(`[PIKABU - COUB PREVIEW] Request: ${body}`);

			send.call(this, body);

			if (body)
			if (body.includes('get_comments_by_ids')
				|| body.includes('get_comments_subtree')
				|| body.includes('vote'))
			{
				//console.log(`[PIKABU - COUB PREVIEW] Request get_comments: ${body}`);

				setTimeout(() => enumerateComments(), 1000);
			}
		};
	}(XMLHttpRequest.prototype.send);
})();
