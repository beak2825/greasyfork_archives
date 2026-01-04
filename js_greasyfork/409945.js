// ==UserScript==
// @name        Wuxiaworld Auto Chapter Loader
// @namespace   https://greasyfork.org/users/281093
// @match       https://www.wuxiaworld.com/novel/*/*chapter*
// @grant       none
// @version     1.0
// @author      Bell
// @license     MIT
// @copyright   2020, Bell
// @description Dynamically loads the next chapter once you reach the end of the current chapter
// @downloadURL https://update.greasyfork.org/scripts/409945/Wuxiaworld%20Auto%20Chapter%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/409945/Wuxiaworld%20Auto%20Chapter%20Loader.meta.js
// ==/UserScript==
/* jshint esversion: 8 */

const options = {
	removeFootnotes: true,
	maxExpandedChapters: 2
};

const title = document.querySelector('#chapter-outer > div.caption.clearfix').cloneNode(true);
const chapterOuter = document.querySelector('#chapter-outer');

let chapter = {
	data: window.CHAPTER,
	textNode: document.querySelector('#chapter-content')
};

let loading = false;
const loadedChapters = [
	{
		text: chapter.textNode,
		title: chapterOuter.querySelector('div.caption')
	}
];

(function init() {
	removeFootnotes(chapter.textNode);
	chapterOuter.lastElementChild.remove();
	document.querySelector('#comments').style.display = 'none';
	document.addEventListener('scroll', scrollLoad);
	window.addEventListener('popstate', scrollToTitle);

	if ('scrollRestoration' in history) {
		history.scrollRestoration = 'manual';
	}

})();

function scrollToTitle(e) {
	e.preventDefault();
	const chapterTitle = chapterOuter.querySelector(`#${e.state}`);

	if (!chapterTitle) {
		location.reload();
		return;
	}

	chapterTitle.scrollIntoView({ behavior: 'smooth' });
}

function removeFootnotes(ch) {
	if (!options.removeFootnotes) return;
	const HTMLcollection = ch.querySelectorAll('[id~=footnote]');
	if (!HTMLcollection.length) return;
	HTMLcollection.forEach(el => el.remove());
}

async function loadNextChapter() {
	loading = true;
	const nextChapter = chapter.data.nextChapter;

	const latestURL = nextChapter;
	chapter = await getChapter(nextChapter);
	const chapterText = chapter.textNode;

	setFontSize(chapterText);
	removeFootnotes(chapterText);
	if (isLoggedIn()) bookmark(chapter.data.id);

	const titleNode = title.cloneNode(true);
	const titleText = chapter.data.name;

	titleNode.querySelector('h4').textContent = titleText;

	document.title = titleText;
	chapterOuter.append(titleNode, chapterText);
	titleNode.id = chapter.data.slug;
	loadedChapters.push({ text: chapterText, title: titleNode });

	window.history.pushState(titleNode.id, titleText, latestURL);

	loading = false;
}

async function getChapter(link) {
	const regex = /(?:var|let|const)\s+CHAPTER\s*=\s*([^;|<]+)/;
	const response = await fetch(link);
	const pageText = await response.text();
	const data = JSON.parse(regex.exec(pageText)[1]);

	const html = document.createElement('html');
	html.innerHTML = pageText;

	const text = html.querySelector('#chapter-content');
	return { data: data, textNode: text };
}

function setFontSize(chapterContent) {
	if (!window.localStorage) return;
	const fontSize = parseFloat(localStorage.getItem('fontsize'));

	if (isNaN(fontSize)) return;
	chapterContent.style.fontSize = `${fontSize}px`;
}

function scrollLoad() {
	const rect = chapter.textNode.getBoundingClientRect();
	if (rect.height + rect.y < screen.height && !loading) {
		loadNextChapter();
		hideOld();
	}
}

function hideOld() {
	if (loadedChapters.length < options.maxExpandedChapters) return;

	const topChapter = loadedChapters[0];
	collapseChapter(topChapter);
	topChapter.title.onclick = () => { toggleChapter(topChapter); };
	topChapter.title.style.cursor = 'pointer';
	topChapter.title.style.userSelect = 'none';
	loadedChapters.shift();
}

function collapseChapter(ch) {
	ch.text.remove();
	const icon = ch.title.querySelector('div:nth-child(3) > img');
	icon.src = 'data:image/png;base64,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';
}

function expandChapter(ch) {
	chapterOuter.insertBefore(ch.text, ch.title.nextSibling);
	const icon = ch.title.querySelector('div:nth-child(3) > img');
	icon.src = 'data:image/png;base64,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';
}

function toggleChapter(ch) {
	function isRemoved() {
		return !document.body.contains(ch.text);
	}
	if (isRemoved()) expandChapter(ch);
	else collapseChapter(ch);
}

async function bookmark(id) {
	await fetch('https://www.wuxiaworld.com/api/user/bookmark', {
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ chapterId: id })
	});
}

function isLoggedIn() {
	return document.querySelector('#notifications-list') !== null;
}