// ==UserScript==
// @name        NodeBB Print & Save
// @description Export full topics from any NodeBB forum to PDF and HTML
// @namespace   https://www.octt.eu.org/
// @match       *://*/*
// @run-at      context-menu
// @grant       GM_registerMenuCommand
// @version     1.0.0
// @author      OctoSpacc
// @license     GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/521610/NodeBB%20Print%20%20Save.user.js
// @updateURL https://update.greasyfork.org/scripts/521610/NodeBB%20Print%20%20Save.meta.js
// ==/UserScript==

GM_registerMenuCommand('Open NodeBB Print & Save', async function(){

const PAGEITEMS = 20;

const urlTokens = location.href.split('/topic/');
const apiUrl = (urlTokens[0] + '/api');

if (document.documentElement.innerHTML.search('/nodebb.min.js?') === -1 || urlTokens.length < 2) {
	alert(`Current page (${location.href}) doesn't appear to be a topic on a NodeBB site. Please open a topic page and retry.`);
	return;
}

const backgroundColor = getComputedStyle(document.body).backgroundColor;
const mainContentEl = document.querySelector('main > div#content');

const overlayEl = document.body.appendChild(Object.assign(document.createElement('div'), { style: `
display: block;
position: absolute;
visibility: visible;
z-index: 9999999;
width: 100%;
left: 0;
top: 0;
background-color: ${backgroundColor};
`, innerHTML: `
<div style="
position: sticky;
top: 0;
z-index: 9;
padding: 1em;
text-align: right;
background-color: ${backgroundColor};
">
	<p style="position: absolute;">${document.title}</p>
	<div style="position: relative; z-index: 1;">
		<button name="print" onclick="print();">🖨️ Print/PDF</button>
		<button name="html">📄️ Download HTML</button>
		<button name="close">❌️ Close</button>
	</div>
</div>
<div class="topic"><ul class="${mainContentEl.querySelector('ul.posts.timeline').className}">Loading...</ul></div>
` }));

const timelineEl = overlayEl.querySelector('ul.posts.timeline');
overlayEl.querySelector('button[name="html"]').onclick = () => {
	for (const el of document.querySelectorAll('[href]')) {
		el.href = el.href;
	}
	Object.assign(document.createElement('a'), {
		href: 'data:text/html;utf8,' + encodeURIComponent(document.doctype + document.documentElement.outerHTML),
		download: `${document.title}.html`,
	}).click();
};
overlayEl.querySelector('button[name="close"]').onclick = (event) => {
	event.target.parentElement.parentElement.parentElement.remove();
	mainContentEl.hidden = false;
	mainContentEl.style = null;
};

mainContentEl.hidden = true;
mainContentEl.style = 'display: none !important;';

const topicUrl = ('/topic/' + urlTokens[1].split('/').slice(0, -1).join('/') + '/');

const postTemplateEl = Object.assign(document.createElement('li'), {
	innerHTML: mainContentEl.querySelector('ul.posts.timeline > li[component="post"]').innerHTML,
});
postTemplateEl.dataset.component = 'post';
const propicStyle = postTemplateEl.querySelector('a[href] > .avatar[component="user/picture"]').getAttribute('style');

const posts = [];
const postIds = {};
let postsHtml = '';
let topic = {};

for (var index=1; index<=(topic.postcount || PAGEITEMS); index+=PAGEITEMS) {
	const response = await fetch(apiUrl + topicUrl + index);
	topic = await response.json();
	topic.posts.forEach(post => {
		if (postIds[post.pid]) {
			return;
		}
		posts.push(post);
		postIds[post.pid] = true;
		timelineEl.innerHTML += `<br />${post.pid}`;
	});
}

posts.forEach(post => {
	postTemplateEl.querySelector('.timeago[datetime]').innerHTML = post.timestampISO;
	postTemplateEl.querySelector('a[href][data-username][data-uid]').innerHTML = post.user.username;
	postTemplateEl.querySelector('a[href] > .avatar[component="user/picture"]').parentElement.innerHTML = (post.user.picture
		? `<img class="avatar" component="user/picture" style="${propicStyle}" src="${post.user.picture}"/>`
		: `<span class="avatar" component="user/picture" style="${propicStyle} background-color: ${post.user['icon:bgColor']};">${post.user['icon:text']}</span>`
	);
	postTemplateEl.querySelector('div.content[component="post/content"]').innerHTML = post.content;
	postTemplateEl.querySelector('[component="post/vote-count"][data-votes]').innerHTML = (post.upvotes - post.downvotes);
	postsHtml += postTemplateEl.outerHTML;
});

timelineEl.innerHTML = postsHtml;

});