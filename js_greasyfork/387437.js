// ==UserScript==
// @name         MangaDex Inline Comments
// @namespace    metapone
// @version      0.2.1
// @description  Display chapter comments inside MangaDex's sidebar
// @author       metapone
// @license      GPL-2.0-only; https://opensource.org/licenses/GPL-2.0
// @homepage     https://github.com/metapone/userscript-collection
// @supportURL   https://github.com/metapone/userscript-collection/issues
// @noframes
// @match        *://mangadex.org/chapter/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/387437/MangaDex%20Inline%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/387437/MangaDex%20Inline%20Comments.meta.js
// ==/UserScript==

GM_addStyle('\
	/* Fix unable to click on scrollbar because of invisible swiping divs */\
	#right_swipe_area {\
		display: none;\
	}\
\
	/* Fix overlapping flex items */\
	.reader-controls-mode, .reader-controls-footer {\
		flex-shrink: 0 !important;\
	}\
\
	/* Fix sidebar going off-screen because of the collapser */\
	.reader-controls {\
		max-width: calc(100% - 34px);\
	}\
');

function updateSidebar() {
	let modeNode = document.querySelector('.reader-controls-mode');
	let footerNode = document.querySelector('.reader-controls-footer');
	let pageNode = document.querySelector('.reader-controls-pages');
	let oldWrapperNodes = document.querySelectorAll('.inline-comments'); // Multiple divs can show up if users switch chapter too fast

	// Clear old comments
	if (oldWrapperNodes) {
		for (let i = 0; i < oldWrapperNodes.length; i++) {
			oldWrapperNodes[i].parentNode.removeChild(oldWrapperNodes[i]);
		}
	}

	// Hide sidebar components. Comment out anything you want to keep
	modeNode.style.setProperty('display', 'none', 'important'); // Common keyboard shortcuts
	footerNode.style.setProperty('display', 'none', 'important'); // Footer credit

	// Push pagination to the bottom of the sidebar
	if (footerNode.style.display === 'none') pageNode.classList.add('mt-auto');

	addToggleCommentButton();
}

function addToggleCommentButton() {
	let oldToggleCommentNode = document.querySelector('.toggle-comments');

	/* Reset node state if already exists, else create a new node */
	if (oldToggleCommentNode) {
		oldToggleCommentNode.querySelector('#kbd_comment_usage').textContent = 'Show comments';
	} else {
		let toggleCommentNode = document.createElement('div');
		toggleCommentNode.className = 'toggle-comments cursor-pointer pt-2 pb-2 pl-2';

		/* Inner content */
		let kbNode = document.createElement('kbd');
		kbNode.innerHTML = '&nbsp;k/numpad 5';

		let whitespaceNode = document.createTextNode('\u00A0');

		let iconNode = document.createElement('span');
		iconNode.className = 'fas fa-comments fa-fw';
		iconNode.setAttribute('aria-hidden', 'true');
		iconNode.title = 'Display comments';

		let usageNode = document.createElement('span');
		usageNode.id = 'kbd_comment_usage';
		usageNode.textContent = 'Show comments';

		toggleCommentNode.appendChild(kbNode);
		toggleCommentNode.appendChild(whitespaceNode);
		toggleCommentNode.appendChild(iconNode);
		toggleCommentNode.appendChild(whitespaceNode.cloneNode(true));
		toggleCommentNode.appendChild(usageNode);
		/* END inner content */

		/* Event listener */
		toggleCommentNode.addEventListener('click', handleToggleComments);

		document.addEventListener('keydown', function (e) {
			// 12 is 5 in numpad with NumLock off
			// 101 is 5 in numpad with NumLock on
			// 75 is k
			if (e.keyCode === 12 || e.keyCode === 101 || e.keyCode === 75) handleToggleComments();
		});
		/* END event listener */

		let footerNode = document.querySelector('.reader-controls-footer');
		footerNode.parentNode.insertBefore(toggleCommentNode, footerNode);
	}
}

function handleToggleComments() {
	let textNode = document.querySelector('#kbd_comment_usage');

	toggleComments(textNode.textContent.indexOf('Hide') === -1);

	if (textNode.textContent.indexOf('Hide') === -1) {
		textNode.textContent = 'Hide comments';

		let oldWrapperNodes = document.querySelector('.inline-comments');
		if (!oldWrapperNodes) insertComments();
	} else {
		textNode.textContent = 'Show comments';
	}
}

function toggleComments(isDisplay) {
	let oldWrapperNode = document.querySelector('.inline-comments');
	if (oldWrapperNode) oldWrapperNode.style.display = !!isDisplay ? '' : 'none';
}

function insertComments() {
	let oldChapterId = lastChapterId;
	let xhr = new XMLHttpRequest();
	xhr.open('GET', '/chapter/' + lastChapterId + '/comments');
	xhr.responseType = 'document';
	xhr.addEventListener('load', function () {
		// Only display comments if user hasn't switched chapter before the request finished
		if (xhr.status !== 200 || oldChapterId !== lastChapterId) return;

		let htmlDocument = xhr.responseXML.documentElement;
		let posts = htmlDocument.querySelectorAll('table .post:not(.post-moderated)');
		let wrapperNode = document.createElement('div');

		wrapperNode.className = 'inline-comments';
		wrapperNode.style.overflow = 'auto';
		wrapperNode.style.overflowWrap = 'break-word';
		wrapperNode.style.wordWrap = 'break-word';

		for (let i = 0; i < posts.length; i++) {
			let poster = posts[i].querySelector('td:first-child span');
			let post = posts[i].querySelector('.postbody');
			let commentNode = document.createElement('div');

			if (!(i % 2)) commentNode.style.backgroundColor = 'rgba(0,0,0,.05)';
			commentNode.innerHTML = '<div style="color: #06f">' + poster.innerHTML + '</div>' + post.innerHTML;
			wrapperNode.appendChild(commentNode);
		}

		// Button to redirect to chapter thread
		let toThread = htmlDocument.querySelector('table+div');
		if (toThread) wrapperNode.appendChild(toThread);

		let footerNode = document.querySelector('.reader-controls-footer');
		footerNode.parentNode.insertBefore(wrapperNode, footerNode);

		fixSpoilerButton(wrapperNode);
	});
	xhr.send();
}

function fixSpoilerButton(post) {
	let spoilerBtns = post.querySelectorAll('.btn-spoiler');
	for (let i = 0; i < spoilerBtns.length; i++) {
		spoilerBtns[i].addEventListener('click', function () {
			this.nextElementSibling.classList.toggle('display-none');
		});
	}
}

let lastPath = '';
let lastChapterId = '';

setInterval(function () {
	if (lastPath !== location.pathname) {
		lastPath = location.pathname;
		let path = location.pathname.split('/');
		if (path.length === 4 && !isNaN(path[3]) && lastChapterId !== path[2]) {
			lastChapterId = path[2];
			updateSidebar();
		}
	}
}, 500);
