// ==UserScript==
// @name        lorify-ng
// @description Юзерскрипт для сайта linux.org.ru поддерживающий загрузку комментариев через технологию WebSocket, а так же уведомления об ответах через системные оповещения.
// @namespace   https://github.com/OpenA
// @include     https://www.linux.org.ru/*
// @include     http://www.linux.org.ru/*
// @version     2.0.7
// @grant       none
// @homepageURL https://www.linux.org.ru/forum/talks/12371302
// @icon        https://rawgit.com/OpenA/lorify-ng/master/icons/penguin-32.png
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/36272/lorify-ng.user.js
// @updateURL https://update.greasyfork.org/scripts/36272/lorify-ng.meta.js
// ==/UserScript==

const USER_SETTINGS = {
	'Realtime Loader': true,
	'CSS3 Animation' : true,
	'Delay Open Preview': 0,
	'Delay Close Preview': 800,
	'Desktop Notification': true
}

const pagesCache    = new Object;
const ResponsesMap  = new Object;
const CommentsCache = new Object;
const LoaderSTB     = _setup('div', { html: '<div class="page-loader"></div>' });
const LOR           = parseLORUrl(location.pathname);
const [,TOKEN = ''] = document.cookie.match(/CSRF_TOKEN="?([^;"]*)/);
const Timer         = {
	// clear timer by name
	clear: function(name) {
		clearTimeout(this[name]);
	},
	// set/replace timer by name
	set: function(name, func, t = 50) {
		this.clear(name);
		this[name] = setTimeout(func, USER_SETTINGS['Delay '+ name] || t);
	}
}
document.documentElement.append(
	_setup('script', { text: '('+ startRWS.toString() +')(window)', id: 'start-rws'}),
	_setup('style' , { text: `
		.newadded  { border: 1px solid #006880; }
		.msg-error { color: red; font-weight: bold; }
		.broken    { color: inherit !important; cursor: default; }
		.response-block, .response-block > a { padding: 0 3px !important; }
		.pushed { position: relative; }
		.pushed:after {
			content: attr(push);
			position: absolute;
			font-size: 12px;
			top: -6px;
			color: white;
			background: #3d96ab;
			line-height: 12px;
			padding: 3px;
			border-radius: 5px;
		}
		.deleted > .title:before {
			content: "Сообщение удалено";
			font-weight: bold;
			display: block;
		}
		.page-loader {
			border: 5px solid #f3f3f3;
			-webkit-animation: spin 1s linear infinite;
			animation: spin 1s linear infinite;
			border-top: 5px solid #555;
			border-radius: 50%;
			width: 50px;
			height: 50px;
			margin: 500px auto;
		}
		.terminate {
			animation-duration: .4s;
			position: relative;
		}
		.preview {
			animation-duration: .3s;
			position: absolute;
			z-index: 300;
			border: 1px solid grey;
		}
		.slide-down {
			max-height: 9999px;
			overflow-y: hidden;
			animation: slideDown 1.5s ease-in-out;
		}
		.slide-up {
			max-height: 0;
			overflow-y: hidden;
			animation: slideUp 1s ease-out;
		}
		
		@-webkit-keyframes slideDown { from { max-height: 0; } to { max-height: 3000px; } }
		@keyframes slideDown { from { max-height: 0; } to { max-height: 3000px; } }
		
		@-webkit-keyframes slideUp { from { max-height: 2000px; } to { max-height: 0; } }
		@keyframes slideUp { from { max-height: 2000px; } to { max-height: 0; } }
		
		@-webkit-keyframes toHide { from { opacity: 1; } to { opacity: 0; } }
		@keyframes toHide { from { opacity: 1; } to { opacity: 0; } }
		
		@-webkit-keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
		@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
		
		@-webkit-keyframes slideToShow { 0% { right: 100%; opacity: 0; } 100% { right: 0%; opacity: 1; } }
		@keyframes slideToShow { 0% { right: 100%; opacity: 0; } 100% { right: 0%; opacity: 1; } }
		
		@-webkit-keyframes slideToShow-reverse { 0% { left: 100%; opacity: 0; } 100% { left: 0%; opacity: 1; } }
		@keyframes slideToShow-reverse { 0% { left: 100%; opacity: 0; } 100% { left: 0%; opacity: 1; } }
`}));

const Navigation = {
	
	pagesCount: 1,
	
	bar: _setup('div', { class: 'nav', html: `
		<a class="page-number prev" href="#prev">←</a>
		<a class="page-number next" href="#next">→</a>
	`, onclick: navBarHandle }),
	
	addToBar: function(pNumEls) {
		
		this.pagesCount = pNumEls.length - 2;
		
		var i = this.bar.children.length - 1;
		var pageLinks = '';
		
		for (; i <= this.pagesCount; i++) {
			let lp = pNumEls[i].pathname || LOR.path +'#comments';
			pageLinks += '\t\t<a id="page_'+ (i - 1) +'" class="page-number" href="'+ lp +'">'+ i +'</a>\n';
		}
		this.bar.lastElementChild.insertAdjacentHTML('beforebegin', pageLinks);
		
		if (LOR.page === 0) {
			this.bar.firstElementChild.classList.add('broken');
			this.bar.lastElementChild.href = this.bar.children['page_'+ (LOR.page + 1)].href;
		} else 
		if (LOR.page === this.pagesCount - 1) {
			this.bar.lastElementChild.classList.add('broken');
			this.bar.firstElementChild.href = this.bar.children['page_'+ (LOR.page - 1)].href;
		}
		this.bar.children['page_'+ LOR.page].className = 'page-number broken';
		
		return this.bar;
	}
}

function navBarHandle(e) {
	e.target.classList.contains('broken') && e.preventDefault();
}

_setup(window, null, {
	dblclick: () => {
		var newadded = document.querySelectorAll('.newadded');
		newadded.forEach(nwc => nwc.classList.remove('newadded'));
		Tinycon.setBubble(
			(Tinycon.index -= newadded.length)
		);
	}
});

_setup(document, null, {
	
	'DOMContentLoaded': function onDOMReady() {
		
		this.removeEventListener('DOMContentLoaded', onDOMReady);
		this.getElementById('start-rws').remove();
		
		appInit();
		
		if (!LOR.topic) {
			return;
		}
		
		Tinycon.index = 0;
		sessionStorage['rtload'] = +USER_SETTINGS['Realtime Loader'];
		
		const pagesElements = this.querySelectorAll('.messages > .nav > .page-number');
		const comments      = this.getElementById('comments');
		
		if (pagesElements.length) {
			
			let bar = Navigation.addToBar(pagesElements);
			let nav = pagesElements[0].parentNode;
			
			nav.parentNode.replaceChild(bar, nav);
			
			_setup(comments.querySelector('.nav'), { html: bar.innerHTML, onclick: navBarHandle });
		}
		pagesCache[LOR.page] = comments;
		
		addToCommentsCache( comments.querySelectorAll('.msg[id^="comment-"]') );
	},
	
	'webSocketData': onWSData
});

function onWSData({ detail }) {
	// Get an HTML containing the comment
	fetch(detail.path +'?cid='+ detail[0] +'&skipdeleted=true', { credentials: 'same-origin' }).then(
		response => {
			if (response.ok) {
				const { page } = parseLORUrl(response.url);
				const  topic   = document.getElementById('topic-'+ LOR.topic);
				response.text().then(html => {
					
					const comms = getCommentsContent(html);
					
					comms.querySelectorAll('a[itemprop="replyToUrl"]').forEach(a => { a.onclick = toggleForm });
					
					if (page in pagesCache) {
					
						let parent = pagesCache[page];
						
						parent.querySelectorAll('.msg[id^="comment-"]').forEach(msg => {
							if (msg.id in comms.children) {
								var cand = comms.children[msg.id],
								    sign = cand.querySelector('.sign_more > time');
								if (sign && sign.dateTime !== (msg['last_modifed'] || {}).dateTime) {
									msg['last_modifed']    = sign;
									msg['edit_comment']    = cand.querySelector('.reply a[href^="/edit_comment"]');
									msg['response_block'] && cand.querySelector('.reply > ul')
										.appendChild(msg['response_block']);
									
									_setup(cand.querySelector('a[itemprop="replyToUrl"]'), { onclick: toggleForm })
									
									for (var R = msg.children.length; 0 < (R--);) {
										parent.replaceChild(cand.children[R], parent.children[R]);
									}
								} else if (msg['edit_comment']) {
									msg['edit_comment'].hidden = !cand.querySelector('.reply a[href^="/edit_comment"]');
								}
							} else {
								_setup(msg, { id: undefined, class: 'msg deleted' });
							}
						});
						
						for (var i = 0, arr = []; i < detail.length; i++) {
						
							let comment = _setup(comms.children['comment-'+ detail[i]], { class: 'msg newadded' });
							
							if (!comment) {
								detail.splice(0, i);
								onWSData({ detail });
								break;
							}
							arr.push( parent.appendChild(comment) );
						}
						Tinycon.index += i;
						if (LOR.page !== page) {
							let push = i + (
								Number ( Navigation.bar.children['page_'+ page].getAttribute('push') ) || 0
							);
							
							_setup(      Navigation.bar.children['page_'+ page], { class: 'page-number pushed', push: push });
							_setup( parent.querySelector('.nav > #page_'+ page), { class: 'page-number pushed', push: push });
						}
						addToCommentsCache( arr );
					} else {
						pagesCache[page] = comms;
						let nav = comms.querySelector('.nav');
						let bar = Navigation.addToBar(nav.children);
						let msg = comms.querySelectorAll('.msg[id^="comment-"]');
						
						bar.children['page_'+ page].setAttribute('push', msg.length);
						bar.children['page_'+ page].classList.add('pushed');
						if (!bar.parentNode) {
							let rt = document.getElementById('realtime');
							rt.parentNode.insertBefore(bar, rt.nextSibling);
							pagesCache[LOR.page].insertBefore(_setup(bar.cloneNode(true), { onclick: navBarHandle }),
								pagesCache[LOR.page].firstElementChild.nextSibling);
						} else {
							_setup(pagesCache[LOR.page].querySelector('.nav'), {
								html: bar.innerHTML, onclick: navBarHandle });
						}
						addToCommentsCache( msg );
						Tinycon.index += msg.length;
					}
					Tinycon.setBubble(Tinycon.index);
					history.replaceState(null, document.title, location.pathname);
				});
			} else {
				
			}
		});
}

function startRWS(win) {
	if ('WebSocket' in win || 'MozWebSocket' in win && (win.WebSocket = MozWebSocket)) {
		var timer, detail = new Array(0);
		Object.defineProperty(win, 'startRealtimeWS', {
			value: function(topic, path, cid, wss) {
				var wS = new WebSocket(wss +'ws'),
				    qA = false;
				wS.onmessage = function(e) {
					detail.push( (cid = e.data) );
					clearTimeout( timer );
					timer = setTimeout(function() {
						var realtime = document.getElementById('realtime');
						if (sessionStorage['rtload'] == '1') {
							detail.path = path;
							document.dispatchEvent(
								new CustomEvent('webSocketData', { detail })
							);
							detail = new Array(0);
							realtime.style.display = 'none';
						} else {
							realtime.innerHTML = 'Был добавлен новый комментарий.\n<a href="'+
								path + '?cid=' + cid +'">Обновить.</a>';
							realtime.style.display = null;
						}
					}, 2e3);
				}
				wS.onopen = function(e) {
					wS.send(topic + (cid == 0 ? '' : ' '+ cid));
				}
				wS.onclose = function(e) {
					setTimeout(function() {
						startRealtimeWS(topic, path, cid, wss)
					}, 5e3);
				}
			}
		});
	}
}

function addToCommentsCache(els) {
	
	for (var i = 0; i < els.length; i++) {
		
		let el  = els[i],
			cid = el.id.replace('comment-', '');
		
		el['last_modifed'] = el.querySelector('.sign_more > time');
		el['edit_comment'] = el.querySelector('.reply a[href^="/edit_comment"]');
		
		addPreviewHandler(
			(CommentsCache[cid] = el)
		);
		
		let acid = el.querySelector('.title > a[href*="cid="]');
		
		if (acid) {
			// Extract reply comment ID from the 'search' string
			let num = acid.search.match(/cid=(\d+)/)[1];
			let url = el.ownerDocument.evaluate('//*[@class="reply"]/ul/li/a[contains(text(), "Ссылка")]/@href',el,null,2,null);
			// Write special attributes
			_setup(acid, { class: 'link-pref', cid: num });
			// Create new response-map for this comment
			if (!(num in ResponsesMap)) {
				ResponsesMap[num] = new Array(0);
			}
			ResponsesMap[num].push({
				text: (el.querySelector('a[itemprop="creator"]') || { textContent: 'anonymous' }).textContent,
				href: url.stringValue,
				cid : cid
			});
		}
	}
	
	for (var cid in ResponsesMap) {
		if ( cid in CommentsCache ) {
			
			let comment = CommentsCache[cid];
			
			if(!comment['response_block']) {
				comment['response_block'] = comment.querySelector('.reply > ul')
				.appendChild( _setup('li', { class: 'response-block', text: 'Ответы:' }) );
			}
			
			ResponsesMap[cid].forEach(attrs => {
				attrs['class' ] = 'link-pref';
				attrs['search'] = '?cid='+ attrs.cid;
				comment['response_block'].appendChild( _setup('a', attrs) );
			});
			
			delete ResponsesMap[cid];
		}
	}
}

function addPreviewHandler(comment) {
	
	comment.addEventListener('mouseover', function(e) {
		switch (e.target.classList[0]) {
			case 'link-pref':
				Timer.clear('Close Preview');
				Timer.set('Open Preview', () => showPreview(e));
				e.preventDefault();
		}
	});
	
	comment.addEventListener('mouseout', function(e) {
		switch (e.target.classList[0]) {
			case 'link-pref':
				Timer.clear('Open Preview');
		}
	});
	
	comment.addEventListener('click', function(e) {
		switch (e.target.classList[0]) {
			case 'link-pref':
				let view = document.getElementById('comment-'+ e.target.getAttribute('cid'));
				if (view) {
					view.scrollIntoView({ block: 'start', behavior: 'smooth' });
					e.preventDefault();
				}
		}
	});
}

function getCommentsContent(html) {
	// Create new DOM tree
	const old = document.getElementById('topic-'+ LOR.topic);
	const doc = new DOMParser().parseFromString(html, 'text/html'),
	    topic = doc.getElementById('topic-'+ LOR.topic),
	    comms = doc.getElementById('comments');
	// Remove banner scripts
	comms.querySelectorAll('script').forEach(s => s.remove());
	// Replace topic if modifed
	if (old.textContent !== topic.textContent) {
		tpc.parentNode.replaceChild(topic, old);
		topic_memories_form_setup(0, true, LOR.topic, TOKEN);
		topic_memories_form_setup(0, false, LOR.topic, TOKEN);
		_setup(topic.querySelector('a[href="comment-message.jsp?topic='+ LOR.topic +'"]'), { onclick: toggleForm })
	}
	return comms;
}

function showPreview(e) {
	
	// Get comment's ID from custom attribute 
	var commentID = e.target.getAttribute('cid'),
	    commentEl;

	// Let's reduce an amount of GET requests
	// by searching a cache of comments first
	if (commentID in CommentsCache) {
		commentEl = document.getElementById('preview-'+ commentID);
		if (!commentEl) {
			// Without the 'clone' call we'll just move the original comment
			commentEl = CommentsCache[commentID].cloneNode(
				(e.isNew = true)
			);
		}
	} else {
		// Add Loading Process stub
		commentEl = _setup('article', { class: 'msg preview', text: 'Загрузка...'});
		// Get an HTML containing the comment
		fetch(e.target.href, { credentials: 'same-origin' }).then(
			response => {
				if (response.ok) {
					const { page } = parseLORUrl(response.url);
					response.text().then(html => {
						pagesCache[page] = getCommentsContent(html);
						
						addToCommentsCache(
							pagesCache[page].querySelectorAll('.msg[id^="comment-"]')
						);
						
						if (commentEl.parentNode) {
							commentEl.remove();
							showCommentInternal(
								pagesCache[page].children['comment-'+ commentID].cloneNode((e.isNew = true)),
								commentID,
								e
							);
						}
					})
				} else {
					commentEl.textContent = response.status +' '+ response.statusText;
					commentEl.classList.add('msg-error');
				}
			});
	}
	showCommentInternal(
		commentEl,
		commentID,
		e
	);
}

const openPreviews = document.getElementsByClassName('preview');

function removePreviews(comment) {
	var c = openPreviews.length - 1;
	while (openPreviews[c] !== comment) {
		openPreviews[c--].remove();
	}
}

function showCommentInternal(commentElement, commentID, e) {
	// From makaba
	const hoveredLink = e.target;
	const parentBlock = document.getElementById('comments');
	
	const { left, top, right, bottom } = hoveredLink.getBoundingClientRect();
	
	const visibleWidth  = innerWidth  / 2;
	const visibleHeight = innerHeight * 0.75;
	const offsetX       = pageXOffset + left + hoveredLink.offsetWidth / 2;
	const offsetY       = pageYOffset + bottom + 10;
	
	let postproc = () => {
		
		commentElement.style['left'] = Math.max(
			offsetX - (
				left < visibleWidth
				     ? 0
				     : commentElement.offsetWidth)
				, 5) + 'px';
		
		commentElement.style['top'] = pageYOffset + (
			top < visibleHeight
			    ? bottom + 10
			    : top - commentElement.offsetHeight - 10)
			+'px';
			
		if (!USER_SETTINGS['CSS3 Animation'])
			commentElement.style['animation-name'] = null;
	};
	
	if (e.isNew) {
		
		commentElement.setAttribute(
			'style',
				'animation-name: toShow; '+
				// There are no limitations for the 'z-index' in the CSS standard,
				// so it depends on the browser. Let's just set it to 300
				'max-width:'+ parentBlock.offsetWidth +
				'px; left: '+
				( left < visibleWidth
				       ? offsetX
				       : offsetX - visibleWidth ) +
				'px; top: '+
				( top < visibleHeight
				      ? offsetY
				      : 0 ) +'px;'
		);
		
		// Avoid duplicated IDs when the original comment was found on the same page
		commentElement.id = 'preview-'+ commentID;
		commentElement.classList.add('preview');
	
		// If this comment contains link to another comment,
		// set the 'mouseover' hook to that 'a' tag
		addPreviewHandler( commentElement );
		
		commentElement.addEventListener('animationstart', postproc, true);
	} else {
		commentElement.style['animation-name'] = null;
		postproc();
	}
	commentElement.onmouseleave = () => {
		// remove all preview's
		Timer.set('Close Preview', removePreviews)
	};
	commentElement.onmouseenter = () => {
		// remove all preview's after this one
		Timer.set('Close Preview', () => removePreviews(commentElement));
	};
	hoveredLink.onmouseleave = () => {
		// remove this preview
		Timer.set('Close Preview', () => commentElement.remove());
	};
	// Note that we append the comment to the '#comments' tag,
	// not the document's body
	// This is because we want to save the background-color and other styles
	// which can be customized by userscripts and themes
	parentBlock.appendChild(commentElement);
}

function _setup(el, _Attrs, _Events) {
	if (el) {
		if (typeof el === 'string') {
			el = document.createElement(el);
		}
		if (_Attrs) {
			for (var key in _Attrs) {
				_Attrs[key] === undefined ? el.removeAttribute(key) :
				key === 'html' ? el.innerHTML   = _Attrs[key] :
				key === 'text' ? el.textContent = _Attrs[key] :
				key in el    && (el[key]        = _Attrs[key] ) == _Attrs[key]
				             &&  el[key]       == _Attrs[key] || el.setAttribute(key, _Attrs[key]);
			}
		}
		if (_Events) {
			if ('remove' in _Events) {
				for (var type in _Events['remove']) {
					if (_Events['remove'][type].forEach) {
						_Events['remove'][type].forEach(function(fn) {
							el.removeEventListener(type, fn, false);
						});
					} else {
						el.removeEventListener(type, _Events['remove'][type], false);
					}
				}
				delete _Events['remove'];
			}
			for (var type in _Events) {
				el.addEventListener(type, _Events[type], false);
			}
		}
	}
	return el;
}

function parseLORUrl(uri) {
	const out = new Object;
	var m = uri.match(/^(?:https?:\/\/www\.linux\.org\.ru)?(\/\w+\/(?!archive)\w+\/(\d+))(?:\/page(\d+))?/);
	if (m) {
		out.path  = m[1];
		out.topic = m[2];
		out.page  = Number(m[3]) || 0;
	}
	return out;
}

function toggleForm(e) {
	const form = document.forms['commentForm'], parent = form.parentNode;
	const [, topic, replyto = 0 ] = this.href.match(/jsp\?topic=(\d+)(?:&replyto=(\d+))?$/);
	if (!form.elements['csrf'].value) {
		form.elements['csrf'].value = TOKEN;
	}
	if (form.elements['replyto'].value != replyto) {
		parent.style['display'] = 'none';
	}
	if (parent.style['display'] == 'none') {
		parent.className = 'slide-down';
		parent.addEventListener('animationend', function(e, _) {
			_setup(parent, { class: _ }, { remove: { animationend: arguments.callee }});
			form.elements['msg'].focus();
		});
		this.parentNode.parentNode.parentNode.parentNode.appendChild(parent).style['display'] = null;
		form.elements['replyto'].value = replyto;
		form.elements[ 'topic' ].value = topic;
	} else {
		parent.className = 'slide-up';
		parent.addEventListener('animationend', function(e, _) {
			_setup(this, { class: _, style: 'display: none;'}, { remove: { animationend: arguments.callee }});
		});
	}
	e.preventDefault();
}

const appInit = (ext => {
	
	if (ext && ext.storage) {
		ext.storage.sync.get(USER_SETTINGS, items => {
			for (let name in items) {
				USER_SETTINGS[name] = items[name];
			}
		});
		ext.storage.onChanged.addListener(items => {
			for (let name in items) {
				USER_SETTINGS[name] = items[name].newValue;
			}
			sessionStorage['rtload'] = +USER_SETTINGS['Realtime Loader'];
		});
		let port = ext.runtime.connect({ name: location.href });
		return function() {
			var main_events_count = document.getElementById('main_events_count'),
				onResponseHandler = main_events_count ? text => {
					main_events_count.textContent = text;
				} : () => void 0;
			// We can't show notification from the content script directly,
			// so let's send a corresponding message to the background script
			ext.runtime.sendMessage({ action: 'lorify-ng init' }, onResponseHandler);
			port.onMessage.addListener(onResponseHandler);
		};
	} else {
		var main_events_count,
		    sendNotify = () => void 0,
		    defaults   = Object.assign({}, USER_SETTINGS),
		    delay      = 2e4;
		    start      = () => {
				const xhr = new XMLHttpRequest;
				xhr.open('GET', location.origin +'/notifications-count', true);
				xhr.onload = function() {
					switch (this.status) {
						case 403:
							break;
						case 200:
							var text = '';
							if (this.response != '0') {
								text = '('+ this.response +')';
								if (USER_SETTINGS['Desktop Notification'] && localStorage['notes'] != this.response) {
									sendNotify( (localStorage['notes'] = this.response) );
									delay = 0;
								}
							}
							main_events_count.textContent = lorynotify.textContent = text;
						default:
							setTimeout(start, delay < 18e4 ? (delay += 2e4) : delay);
					}
				}
				xhr.send(null);
			}
			
		if (localStorage['lorify-ng']) {
			let storData = JSON.parse(localStorage.getItem('lorify-ng'));
			for (let name in storData) {
				USER_SETTINGS[name] = storData[name];
			}
		}
		
		const onValueChange = function({ target }) {
			Timer.clear('Settings on Changed');
			switch (target.type) {
				case 'checkbox':
					USER_SETTINGS[target.id] = target.checked;
					break;
				case 'number':
					USER_SETTINGS[target.id] = target.valueAsNumber >= 0 ? target.valueAsNumber : (target.value = 0);
			}
			localStorage.setItem('lorify-ng', JSON.stringify(USER_SETTINGS));
			applymsg.classList.add('apply-anim');
			Timer.set('Apply Setting MSG', () => applymsg.classList.remove('apply-anim'), 2e3);
			sessionStorage['rtload'] = +USER_SETTINGS['Realtime Loader'];
		}
		
		const loryform = _setup('form', { id: 'loryform', html: `
			<div class="tab-row">
				<span class="tab-cell">Автоподгрузка комментариев:</span>
				<span class="tab-cell" id="applymsg"><input type="checkbox" id="Realtime Loader" ${
					USER_SETTINGS['Realtime Loader'] ? 'checked' : '' }></span>
			</div>
			<div class="tab-row">
				<span class="tab-cell">Задержка появления превью:</span>
				<span class="tab-cell"><input type="number" id="Delay Open Preview" min="0" step="10" value="${
					USER_SETTINGS['Delay Open Preview'] }">
				мс
				</span>
			</div>
			<div class="tab-row">
				<span class="tab-cell">Задержка исчезания превью:</span>
				<span class="tab-cell"><input type="number" id="Delay Close Preview" min="0" step="10" value="${
					USER_SETTINGS['Delay Close Preview'] }">
				мс
				</span>
			</div>
			<div class="tab-row">
				<span class="tab-cell">Оповещения на рабочий стол:</span>
				<span class="tab-cell"><input type="checkbox" id="Desktop Notification" ${
					USER_SETTINGS['Desktop Notification'] ? 'checked' : '' }>
				</span>
			</div>
			<div class="tab-row">
				<span class="tab-cell">CSS анимация:</span>
				<span class="tab-cell"><input type="checkbox" id="CSS3 Animation" ${
					USER_SETTINGS['CSS3 Animation'] ? 'checked' : '' }>
					<input type="button" id="resetSettings" value="сброс" title="вернуть настройки по умолчанию">
				</span>
			</div>`,
				onchange: onValueChange,
				oninput: e => Timer.set('Settings on Changed', () => {
					loryform.onchange = () => { loryform.onchange = onValueChange };
					onValueChange(e)
				}, 750)
			}),
			applymsg = loryform.querySelector('#applymsg');
			loryform.elements['resetSettings'].onclick = () => {
				for (let name in defaults) {
					let inp = loryform.elements[name];
					inp[inp.type === 'checkbox' ? 'checked' : 'value'] = (USER_SETTINGS[name] = defaults[name]);
				}
				localStorage.setItem('lorify-ng', JSON.stringify(USER_SETTINGS));
				applymsg.classList.add('apply-anim');
				Timer.set('Apply Setting MSG', () => applymsg.classList.remove('apply-anim'), 2e3);
				sessionStorage['rtload'] = +USER_SETTINGS['Realtime Loader'];
			}
			const lorynotify = _setup( 'a' , { id: 'lorynotify', class: 'lory-btn', href: 'notifications' });
			const lorytoggle = _setup('div', { id: 'lorytoggle', class: 'lory-btn', html: `<style>
				#lorynotify {
					right: 60px;
					text-decoration: none;
					color: inherit;
					font: bold 1.2em "Open Sans";
				}
				#lorytoggle {
					width: 32px;
					height: 32px;
					right: 5px;
					cursor: pointer;
					opacity: .5;
					background: url(//icons.iconarchive.com/icons/icons8/christmas-flat-color/32/penguin-icon.png) center / 100%;
				}
				#loryform {
					display: table;
					min-width: 360px;
					padding: 3px 6px;
					position: fixed;
					right: 5px;
					top: 40px;
					background: #eee;
					border-radius: 5px;
				}
				#lorytoggle:hover, #lorytoggle.pinet { opacity: 1; }
				.lory-btn { position: fixed; top: 5px; }
				.tab-row  { display: table-row; font-size: 85%; color: #666; }
				.tab-cell { display: table-cell;
					position: relative;
					padding: 4px 2px;
					vertical-align: middle;
					max-width: 180px;
				}
				#resetSettings, .apply-anim:after { position: absolute; right: 0; }
				.apply-anim:after {
					content: 'Настройки сохранены.';
					-webkit-animation: apply 2s infinite;
					animation: apply 2s infinite;
					color: red;
				}
				@keyframes apply { 0% { opacity: .1; } 50% { opacity: 1; } 100% { opacity: 0; } }
				@-webkit-keyframes apply { 0% { opacity: .1; } 50% { opacity: 1; } 100% { opacity: 0; } }
			</style>`}, {
				click: () => { lorytoggle.classList.toggle('pinet') ? document.body.appendChild(loryform) : loryform.remove() }
			});
		if (Notification.permission === 'granted') {
			// Если разрешено то создаем уведомлений
			sendNotify = count => new Notification('loryfy-ng', {
				icon: '//icons.iconarchive.com/icons/icons8/christmas-flat-color/64/penguin-icon.png',
				body: 'Уведомлений: '+ count
			}).onclick = () => window.focus();
		} else
		if (Notification.permission !== 'denied') {
			Notification.requestPermission(function(permission) {
				// Если пользователь разрешил, то создаем уведомление 
				if (permission === 'granted') {
					sendNotify = count => new Notification('loryfy-ng', {
						icon: '//icons.iconarchive.com/icons/icons8/christmas-flat-color/64/penguin-icon.png',
						body: 'Уведомлений: '+ count
					}).onclick = () => window.focus();
				}
			});
		}
		return function() {
			if ( (main_events_count = document.getElementById('main_events_count')) ) {
				localStorage['notes'] = (
					lorynotify.textContent = main_events_count.textContent
				).replace(/\d+/, '$1');
				setTimeout(start, delay);
			}
			document.body.append(lorynotify, lorytoggle);
		};
	}
})(window.chrome || window.browser);
