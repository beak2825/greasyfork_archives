// ==UserScript==
// @name        MRAS Mobile Reactor advanced script
// @description Представься, мразь! (с)
// @author      Rus-Ivan
// @namespace   m.joyreactor.cc
// @version     1.3.1
// @include     *://m.joyreactor.cc/*
// @include     *://m.reactor.cc/*
// @require     https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM.xmlHttpRequest
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       unsafeWindow
// @connect     m.joyreactor.cc
// @connect     joyreactor.cc
// @connect     reactor.cc
// @icon        http://joyreactor.cc/favicon.ico
// @run-at      document-end
// @license     MIT
// @copyright   2018, Rus-Ivan (https://github.com/Rus-Ivan)
// @downloadURL https://update.greasyfork.org/scripts/37992/MRAS%20Mobile%20Reactor%20advanced%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/37992/MRAS%20Mobile%20Reactor%20advanced%20script.meta.js
// ==/UserScript==

/*
========================
 Для чего?
 Облегчает просмотр постов на m.joyreactor.cc
 Часто сижу на m.joyreactor.cc и приходится
 1. открывать пост, чтобы
	+ посмотреть гифку
	+ почитать комментарии
 2. открывать пост на основном хосте, чтобы
	+ добавить в избранное
	+ оценить комментарий
========================
 Что делает этот скрипт?
 1. при нажатии на кнопку/ссылку "Комментарии":
	+ открывает комментарии
	+ делает картинки/гифки/гиф-видео кликабельными (прим., чтобы загрузить гифки/гиф-видео, кликните на постер)
	+ показывает панель управления гиф-видео
 2. есть кнопка "Добавить в избранное"
 3. возможность оценивать комментарии
 ========================
 Дополнительные плюшки:
 1. убирает редиректы с ссылок
 2. сохраняет избранные посты в базе данных
 ========================
 P.S. Этот скрипт я писал чисто для личного пользования,
 если людям он покажется полезным, то могу добавить в него
 какие-нибудь дополнительные плюшки
*/
function consoleLog(){window['console']['log'].apply(this, arguments);}
consoleLog("====== start " + GM.info.script.name + " v" + GM.info.script.version + "\n" + GM.info.script.description);
var DEBUG = false;
var FAVKEY = 'favorite-key';
(async function(){
	'use strict';
	try{
	var uWindow = unsafeWindow;
	consoleLog("window: ", uWindow);
	var userFavorite = await GM.getValue( FAVKEY, "[]" );
	userFavorite = JSON.parse(userFavorite);
	var syncInProgress = false;
	startSync();
	removeRedirect();
	makeVotableComments();
	activateComments();
	activateFavorite();
	addNewStyle();
	consoleLog("======== end " + GM.info.script.name + " v" + GM.info.script.version);
	function startSync()
	{
		var html = '<div class="user-info-content" style="margin: 5px;">' +
		'<div id="user_id">user_id := ' + uWindow.user_id + '</div>' + 
		'<div id="token">token := ' + uWindow.token + '</div>' +
		'<div id="sync_fav">favorite sync</div></div>';
		makePopup({
			html: html,
			attr: {
				id: 'user-info',
				'class': 'popup-window',
			},
			'next': {
				html: '<div><span style="padding: 0 2px;"><<</span></div>',
				attr: {
					id: 'user-info-button',
					'class': 'popup-window',
				},
				'event': {
					type: 'click',
					handler: function(event){
						this.style.display = 'none';
					},
				},
				'next': {
					attr: {
						id: 'user-info',
					},
				},
			},
			'event': {
				type: 'click',
				handler: function(event){
					var t = event.target,
						that = this;
					that.style.zIndex = 15;
					setTimeout(function(){that.style.display = 'none';}, 200);
					if(t.id == 'sync_fav' )
						syncFavorite();
				},
			},
		});
		syncFavorite();
	}
	async function syncFavorite()
	{
		try{
		if( syncInProgress )
			return;
		var user_name = uWindow.user_name || getUserName();
		consoleLog("user_name: ", user_name);
		if( !user_name )
			return;
		var url = 'http://joyreactor.cc/user/' + user_name + '/favorite',
			el = $('#sync_fav');
		var lastPage = await GM.getValue('sync-favorite', -1);
		lastPage = parseInt(lastPage, 10);
		if( lastPage > 0 )
			url += '/' + lastPage;
		el.setAttribute('data-last-page', lastPage);
		el.setAttribute('title', url);
		el.setAttribute('data-user-favorite', url);
		el.setAttribute('data-user-name', user_name);
		el.innerHTML = 'favorite sync: ' + user_name + ' [' + lastPage + ']';
		uWindow.user_name = user_name;
		var syncComplete = await GM.getValue('sync-complete', false);
		el.addEventListener('click', function(event){
			if( event.ctrlKey )
				window.open(this.getAttribute('data-user-favorite'));
		}, false);
		if( syncComplete )
		{
			el.parentNode.click();
			return;
		}
		syncInProgress = true;
		GM.xmlHttpRequest({
			url: url,
			method: 'GET',
			Referer: 'http://joyreactor.cc',
			context: {'url': url, count: 1, maxCount: 20},
			onload: ajaxFavorite,
		});
		}catch(e){console.error(e);}
	}
	async function ajaxFavorite(xhr)
	{
		try{
		if( xhr.status != 200 )
		{
			console.error("Error: xhr.status = ", xhr.status, xhr.statusText);
			console.error("xhr: ", xhr);
			return;
		}
		var doc = document.implementation.createHTMLDocument(""),
			cntx = xhr.context, res;
		doc.documentElement.innerHTML = xhr.response;
		res = addPostsToFavorite(doc);
		saveFavoriteStorage();
		var page = getLocation(cntx.url, 'pathname').match(/\/[^\/]*$/)[0],
			next_url = null;
		page = /\d+/.test(page) ? parseInt(page.match(/\d+/)[0], 10) : -1;
		consoleLog("--------------");
		consoleLog("favorite page: ", page);
		consoleLog("iter: ", cntx.count, "/", cntx.maxCount);
		consoleLog("added: ", res);
		var sync_fav = $('#sync_fav'),
			usr_name = sync_fav.getAttribute('data-user-name');
		sync_fav.innerHTML = 'favorite sync: ' + usr_name + ' [' + page + ']';
		if( page > 0 )
			await GM.setValue('sync-favorite', page);
		next_url = $('.next', doc);
		if( (res == 0 && page == 1) || cntx.count >= cntx.maxCount || !next_url )
		{
			if( page == 1 && res == 0 )
			{
				sync_fav.click();
				GM.setValue('sync-complete', true);
			}
			syncInProgress = false;
			return;
		}
		next_url = 'http://joyreactor.cc' + next_url.pathname;
		setTimeout(function(){
			GM.xmlHttpRequest({
				url: next_url,
				method: 'GET',
				Referer: 'http://joyreactor.cc',
				context: {url: next_url, count: cntx.count + 1, maxCount: cntx.maxCount},
				onload: ajaxFavorite,
			});
		}, 2000 + getRandom(500, 1000) + getRandom(500, 900));
		}catch(e){console.error(e);}
	}
	function getRandom( min, max )
	{
		return Math.floor(Math.random() * (max - min) + min);
	}
	function addPostsToFavorite(doc)
	{
		doc = doc || document;
		var posts = $$('.postContainer', doc), count = 0;
		for( var i = 0, post_id; i < posts.length; ++i )
		{
			post_id = posts[i].id.slice(13);
			if( !isFavorite(post_id) )
			{
				++count;
				addToFavoriteStorage(post_id);
			}
		}
		return count;
	}
	function getUserName()
	{
		var spans = $$('span');
		for( var i = 0, len = spans.length, span; i < len; ++i )
		{
			span = spans[i];
			if( span.innerHTML.toString().indexOf('Привет') != -1 )
				return span.innerHTML.replace(/Привет\,/i, '').trim().replace(/\s/g, '+');
		}
		return null;
	}
	function removeRedirect( doc )
	{
		var links = $$('a', doc), link;
		consoleLog("links.length := ", links.length);
		for( var i = 0, len = links.length; i < len; ++i )
		{
			link = links[i];
			if( link['hostname'].indexOf('reactor') != -1 && link['pathname'].indexOf('redirect') != -1 )
				link.href = decodeURIComponent(link.search.slice(5));
		}
	}
	function makeVotableComments( doc )
	{
		var commentList = $$('.comment_rating'),
			voteHTML = '<div class="vote-plus" title="голосовать за"></div><div class="vote-minus" title="голосовать против"></div>';
		consoleLog("commentList.length := ", commentList.length);
		for( var i = 0, len = commentList.length, commentRating; i < len; ++i )
		{
			commentRating = commentList[i];
			if( !commentRating.querySelector('.vote-plus') )
				commentRating.innerHTML += voteHTML;
			if( !commentRating.classList.contains('comment-vote-active') )
			{
				commentRating.addEventListener('click', handleCommentVoteEvent, false);
				commentRating.classList.add('comment-vote-active');
			}
		}
	}
	function handleCommentVoteEvent(event)
	{
		var t = event.target, act;
		if( t.classList.contains('vote-plus') )
			act = 'plus';
		else if( t.classList.contains('vote-minus') )
			act = 'minus';
		if( !act )
			return;
		var commentId = t.parentNode.getAttribute('comment_id'),
			data = 'token=' + uWindow.token;
		GM.xmlHttpRequest({
			url: 'http://joyreactor.cc/comment_vote/add/' + commentId + '/' + act + '?' + data,
			method: 'GET',
			context: {'commentId': commentId, 'act': act},
			headers: {
				'X-Requested-With': 'XMLHttpRequest',
				'Referer': 'http://joyreactor.cc' + window.location.pathname,
			},
			onload: function(xhr){
				try{
				var cntx = xhr.context,
					regEx =	/\-?\d+(\.\d+)?/,
					commentR = $('[comment_id="' + cntx.commentId + '"]'),
					html = commentR.innerHTML,
					voteChangeAct = (cntx.act == 'plus' ? 'minus': 'plus');
				commentR.innerHTML = html.replace( regEx, xhr.responseText.match(regEx)[0] );
				if( !$('.vote-change', commentR) )
					$('.vote-' + voteChangeAct, commentR).classList.add('vote-change');
				if( DEBUG )
				{
					consoleLog("comment vote [" + act + "]");
					consoleLog("xhr.status: ", xhr.status, xhr.statusText);
					consoleLog("xhr.response: ", xhr.response);
				}
				}catch(e){console.error(e);}
			},
		});
	}
	function activateFavorite()
	{
		// начало создания кнопки "Добавить в избранное"
		var postList = $$('.postContainer');
		consoleLog("postList.length := ", postList.length);
		for( var i = 0, len = postList.length; i < len; ++i )
			makeFavorite( postList[i] );
	}
	function makeFavorite( postContainer )
	{
		var postId, postRating, fav;
		postRating = $('.post_rating', postContainer);
		if( !postRating )
			return;
		postId = postContainer.id.match(/\d+/)[0];
		fav = document.createElement('div');
		fav.setAttribute('class', 'favorite_link');
		fav.setAttribute('data-post-id', postId);
		fav.setAttribute('title', 'Добавить в избранное');
		postRating.parentNode.insertBefore( fav, postRating );
		fav.addEventListener('click', handleFavoriteEvent, false);
		//consoleLog("post_rating: ", postRating, postRating.innerHTML.toString().trim());
		if( isFavorite(postId) )
			fav.classList.add('favorite');
	}
	function handleFavoriteEvent(event)
	{
		var t = this,
			token = uWindow.token,
			data = 'token=' + token + '&rand=' + Math.floor(1e4*Math.random()),
			postId = t.getAttribute('data-post-id'),
			act = 'create', url;
		if( t.classList.contains('favorite') )
			act = 'delete';
		url = 'http://joyreactor.cc/favorite/' + act + '/' + postId + '?' + data;
		// отправка xml-http запроса на создание/удаление [из] избранного
		GM.xmlHttpRequest({
			url: url,
			method: 'GET',
			context: {'t': t, 'token': token, 'data': data, 'act': act, 'postId': postId, 'url': url},
			headers: {
				'X-Requested-With': 'XMLHttpRequest',
				'Referer': 'http://joyreactor.cc/post/' + postId,
			},
			onload: function(xhr){
				var cntx = xhr.context;
				if( cntx.t.classList.contains('favorite') )
				{
					cntx.t.classList.remove('favorite');
					cntx.t.setAttribute('title', 'Добавить в избранное');
					removeFromFavoriteStorage(cntx.postId);
				}else{
					cntx.t.classList.add('favorite');
					cntx.t.setAttribute('title', 'Удалить из избранного');
					addToFavoriteStorage(cntx.postId);
				}
				saveFavoriteStorage();
				if( DEBUG )
				{
					consoleLog("-------------");
					consoleLog("favorite[" + cntx.act + "] post-id: ", cntx.postId);
					consoleLog("xhr.status  : ", xhr.status, xhr.statusText);
					consoleLog("xhr.response: ", xhr.response);
					consoleLog("token: ", cntx.token);
					consoleLog("data : ", cntx.data);
					consoleLog("url  : ", cntx.url);
				}
			},
		});
	}
	function activateComments()
	{
		// начало создания кнопки "Комментарии"
		var links = $$('.article .comments > a');
		for( var i = 0, len = links.length; i < len; ++i )
			links[i].addEventListener('click', handleCommentListEvent, false);
	}
	function handleCommentListEvent(event)
	{
		try{
		// если зажать Ctrl, то ссылка откроется как обычно (в новом окне)
		if( event.ctrlKey )
			return;
		// простой click на ссылку
		event.preventDefault();
		var t = event.target, ufoot, commentList;
		if( t.tagName !== 'A' )
		{
			console.error("[handleCommentListEvent] invalid link: ", t);
			return;
		}
		ufoot = t.parentNode.parentNode;
		commentList = $('.comment_list_post', ufoot);
		if( commentList && t.classList.contains('comment-list-opened') )
		{
			// если комментарии были открыты - то скрыть их
			t.classList.remove('comment-list-opened');
			commentList.style.display = 'none';
			return;
		}
		else if( commentList )
		{
			// если комментарии были скрыты (см. выше), то показать их
			commentList.style.display = 'block';
			t.classList.add('comment-list-opened');
		}
		// загружает комментарии, делает картинки кликабельными
		openCommentList( t );
		}catch(e){console.error(e);}
	}
	function openCommentList( link )
	{
		if( !link || link.tagName !== 'A' )
		{
			console.error("[openCommentList] invalid link: ", link);
			return;
		}
		GM.xmlHttpRequest({
			url: link.href,
			method: 'GET',
			context: {
				'link': link, 
			},
			onload: setCommentList,
		});
	}
	function setCommentList( xhr )
	{
		try{
		if( xhr.status != 200 )
		{
			console.error("[setComments] xhr.status: ", xhr.status, xhr.statusText );
			return;
		}
		var doc = document.implementation.createHTMLDocument("");
		doc.documentElement.innerHTML = xhr.response;
		removeRedirect(doc);
		var xhrCommentList = $('.comment_list_post', doc),
			ufoot = xhr.context.link.parentNode.parentNode,
			commentList = $('.comment_list_post', ufoot);
		var xhrImageList = $$('.image', doc),
			imageList = $$('.image', ufoot.parentNode);
		// создает комментарии
		if( commentList )
			commentList.innerHTML = xhrCommentList.innerHTML;
		else
			ufoot.appendChild(xhrCommentList);
		makeVotableComments();
		xhr.context.link.classList.add('comment-list-opened');
		// создает кликабельную картинку в ленте на m.joyreactor.cc
		// если это гифка/гиф-видео, то для ее загрузки нужно кликнуть на постер
		for( var i = 0, xhrImg, img; i < imageList.length && i < xhrImageList.length; ++i )
		{
			xhrImg = xhrImageList[i];
			img = imageList[i];
			if( $('iframe', xhrImg) )
				continue;
			else if( $('.video_gif_holder', xhrImg) )
			{
				// код для гифок/видео-гифок
				$('a.attribute_preview', img).addEventListener('click',
					makeGifImageHandler(xhrImg, img), false);
			}else
				img.innerHTML = xhrImg.innerHTML;
		}
		}catch(err){console.error(err);}
	}
	function makeGifImageHandler( elm, img )
	{
		var video = $('video', elm);
		if( video )
			$('img', img).src = decodeURIComponent(video.getAttribute('poster'));
		function handler(event)
		{
			try{
			if( event.ctrlKey )
				return;
			event.preventDefault();
			if( video )
				video.setAttribute('controls', '');
			this.parentNode.innerHTML = elm.innerHTML;
			}catch(e){console.error(e);}
		}
		return handler;
	}
	async function saveFavoriteStorage()
	{
		GM.setValue( FAVKEY, JSON.stringify(userFavorite) );
	}
	function addToFavoriteStorage( postId )
	{
		if( userFavorite.indexOf(postId) == -1 )
			userFavorite.push(postId);
	}
	function removeFromFavoriteStorage( postId )
	{
		var idx = userFavorite.indexOf(postId);
		if( idx != -1 )
			userFavorite.splice(idx, 1);
	}
	function isFavorite( postId )
	{
		return userFavorite.indexOf(postId) != -1;
	}
	function addStyle( cssClass, id )
	{
		var style = document.createElement('style');
		style.type = 'text/css';
		style.innerHTML = cssClass;
		if( id !== undefined )
			style.setAttribute('id', id);
		var head = document.head || $('head');
		return head.appendChild(style);
	}
	function addNewStyle()
	{
		addGifStyle('video-gif-css');
		addFavoriteStyle('favorite-css');
		addCommentVoteStyle('comment-css');
		//addDarkStyle();
		//addDarkPopupStyle();
		addLightPopupStyle();
	}
	function addGifStyle( id )
	{
		addStyle(`
			.video_gif_source:hover {
				opacity: 1;
			}
			.video_gif_source[href*=".gif"] {
				display: none !important;
			}
			.video_gif_source {
				display: inline-block !important;
				opacity: 0.6;
				background: rgba(204, 204, 204, 0.6);
			}
		`, id );
	}
	function addFavoriteStyle( id )
	{
		var starN = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQfiAR0CNzizynofAAACcklEQVRIx52V30tTcRTAP3e7UKKGb5L0IOZssoEKI3oouUoZaT+g/gFfeglECiJoazub+AOKehCCkGTiW2APgS8heEsRqaA9bDS8KobJ3oS08kHd7WG67Y7uzXnezq/POd9z7v1+wVGkSqqcI1RnN2+AbqcAxbH+eXRAk0/H7SDMGBDm+rE6kABzaiPsLXNJvthFuRzrj4c2QhuME7YPsgXE2uhSRwDUEbpibWUDsmEmQusAoXUmsuEyAbEWuhnOq8N0x1rKAmTDTMpafpxrTNr1ULJGqaKRJnzcwGtxDJGWKCmWWJZfxQ5FTro8WY/iMT148HCaHVYweCfxEnQvN/FwlgoyGBiKYRouI2soksTL0qFJNYI/FNN+aaYyeGavUK6JtCJdvFXuR8YoW6J3zRfcdusr2iJx7af+ubx0ucczbslMTmmXrWh/WdX7ZUvaAdwA+nftA6879vWFI6Y/NCNck/k8APT1zlnzVYeqzx0hPWg+cl2NLOY096F5dqNzxnypVer6f84epd91JZyfmLvgms1o7xnVTugfHdJD9HE58rVgsXzKkiBKj2MDPUQlUWwo/RcaSDkCUjRYDaUAn+IIUFL4nAF+ko4dJPE7AKSGOtURoCapkxr7DvxsBjNFwIBMy7QECpZghk1rDxaA4iscYKBZpphnlVXmZWqguXAIxWcLMA8AUi/x/QTbeKVP+vCyvZ+QuNTnAKY9AL+SHKyVUdJUu1ulN3epyZr0ulupJi2jg7VKyRitV5rP/LP7lAUulj4kT75xRwIM7a6gWxdZ9DI9r9j6zSKPRbffgmgMceFU5YOdf7oHznEEOZjFgfwFS4LW7qbwLDkAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTgtMDEtMjlUMDI6NTU6NTYrMDE6MDB5Men4AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE4LTAxLTI5VDAyOjU1OjU2KzAxOjAwCGxRRAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAASUVORK5CYII=";
		var starF = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAulBMVEUAAAD//wD54Ab//wD54AX54Qb//wD54AX54Ab54AX44gf54AX44AP24wn54QX14AD74gT64AX54Qb54AT54AX54AX54AT54AX/5AD54AX/3wD53wX/2wD54AX/6gD43wX/5gD64AX/4wD54Qb/2wD54Ab63wX64AX64QX63wX54Ab/4wD54AX44AP53wX53wb63wX54AT64QX//wD44AX44AX44AT/3wD64AX53wT54QT/2AD54AUAAAAv4GzOAAAAPHRSTlMAA1oC1lYB01LPTsxKG8kZPWKHrNH1fPMTzhDKDsYMwgq9CbkHtDdjj7rmEtBL2lhp42UEletyCJSyfw1tcXAwAAAAAWJLR0QAiAUdSAAAAAlwSFlzAAAN1wAADdcBQiibeAAAAAd0SU1FB+IBHBc1JtmiIwAAAAD/SURBVDjLfZLnFoIwDEbrQnGiguJgiFtQcK+8/3PJ8kgi7feryb3ntMkpYziFAhOnWBTzUrlcEgoVgIqIS1WAqiQQahCmJhDkSJD5vA5x6lyhkQgNHm9Cmmb+BK32V2i38CQdpdvrqxpkoqn9XlfpRHQgD4GboTxg+ggEGemMjSd8PhlHl0wNHjemySNNK59b5ncMe5bHZ/ZvUGf+z+dOdhWLJeXLBd6jTgWdLHpFhRUR1lRYE2FDhQ0RtlTYEmFHhR3mbtr29nsvPbpIUOLewQ8/iuQf4kJBQhB2jqdzUpxPx7AMkHCB6+3+K++3KzyQ8Hy98aPeryeqbfaXtPUB5yBig3vwmkMAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTgtMDEtMjhUMjM6NTM6MzgrMDE6MDBw72fcAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE4LTAxLTI4VDIzOjUzOjM4KzAxOjAwAbLfYAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAASUVORK5CYII=";
		addStyle(`
			.favorite_link {
				background: url(${starN});
				cursor: pointer;
				display: inline-block;
				width: 32px;
				height: 32px;
				vertical-align: middle;
				margin: 12px 16px 0 0;
				float: right;
			}
			.post_rating {
				margin-right: 16px;
			}
			.favorite_link:hover {
				background: url(${starF});
				transform: scale(1.4);
			}
			div.favorite {
				background: url(${starF});
			}
			div.favorite:hover {
				background: url(${starN});
				transform: scale(1.4);
			}
		`, id );
	}
	function addCommentVoteStyle( id )
	{
		addStyle(`
			span.comment_rating div.vote-plus {
				background-position: 0 -120px;
			}
			span.comment_rating div.vote-minus {
				background-position: -40px -120px;
			}
			.comment_rating div.vote-plus,
			.comment_rating div.vote-minus {
				width: 30px;
				height: 30px;
				line-height: 30px;
				margin: 0 0 0 3px;
				background: url(http://img0.joyreactor.cc/images/icon_smiles.png) no-repeat 0 -120px;
				cursor: pointer;
				display: inline-block;
				vertical-align: middle;
				/*transform: scale(0.75);*/
			}
			div.vote-change {
				opacity: 0.5;
			}
		`, id);
	}
	function addDarkStyle( id )
	{
		addStyle(`
		a ,
		div.uhead_nick a {
			color: #b1cbf7 !important;
		}
		a:hover ,
		div.uhead_nick a:hover {
			color: #d1ebf7 !important;
		}
		.post_content span {
			color: #d2d2d2 !important;*/
			/*background-color: #626f61 !important;*/
			/*color: #f6f7b9 !important;*/
		}
		.submenuitem a, .article .comments a {
			color: #FAF68C !important;
			/*text-shadow: 0 1px 1px #c04e03 !important;*/
		}
		.taglist a {
			color: #d2d2d2 !important;
		}
		.m_pagination a {
			color: #f8c010 !important;
		}
		.m_pagination a:hover {
			color: #F44336 !important;
		}
		`, id);
	}
	function addDarkPopupStyle( id )
	{
		addStyle(`
		.popup-window {
			position: fixed;
			top: 10px;
			right: 20px;
			background-color: #272727;
			color: #d0d0d0;
			text-align: center;
			z-index: 10;
			font-size: 14px;
			cursor: pointer;
			border-radius: 5px;
			border-color: #d0d0d0;
			border-style: solid;
			border-width: thin;
		}
		`, id);
	}
	function addLightPopupStyle( id )
	{
		addStyle(`
		.popup-window {
			position: fixed;
			top: 10px;
			right: 20px;
			background-color: #d78917;
			color: #faf68c;
			text-shadow: 0 1px 1px #c04e03;
			text-align: center;
			font-size: 14px;
			z-index: 10;
			/*cursor: pointer;*/
			border-radius: 5px;
			border-color: #c04e03;
			border-style: solid;
			border-width: thin;
		}
		.user-info-content {
			margin: 5px;
		}
		#sync_fav ,
		#user-info-button {
			cursor: pointer;
		}
		#sync_fav:hover {
			color: #ffffd6;
		}
		`, id);
	}
	function $( str, doc )
	{
		doc = doc || document;
		return doc.querySelector(str);
	}
	function $$( str, doc )
	{
		doc = doc || document;
		return doc.querySelectorAll(str);
	}
	function makePopup( prop )
	{
		if( !prop )
			return null;
		var wnd = $('#' + prop.attr.id);
		if( wnd )
		{
			wnd.style.display = 'block';
			return wnd;
		}
		wnd = document.createElement('div');
		for( var key in prop.attr )
			wnd.setAttribute( key, prop.attr[key] );
		wnd.innerHTML = prop.html || '';
		$('body').appendChild(wnd);
		var f = prop.event,
			n = prop.next,
			callback = function(event){
				f.handler.call(this, event);
				makePopup(n);
			};
		if( f )
			wnd.addEventListener(f.type, callback, false);
		return wnd;
	}
	function hide( str, doc )
	{
		var el = $(str, doc);
		if( el )
			el.style.display = 'none';
	}
	function show( str, doc )
	{
		var el = $(str, doc);
		if( el )
			el.style.display = 'block';
	}
	function getLocation( href, prop )
	{
		if( !href )
			return null;
		var a = document.createElement('a');
		a.href = href;
		return a[prop];
	}
	}catch(e){console.error(e);}
})();