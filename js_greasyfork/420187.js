// ==UserScript==
// @name         [GMT] New forum posts indicator
// @namespace    https://greasyfork.org/users/321857-anakunda
// @version      1.03.0
// @author       Anakunda
// @copyright    2020, Anakunda (https://greasyfork.org/users/321857-anakunda)
// @license      GPL-3.0-or-later
// @match        https://*/forums.php?action=viewthread&threadid=*
// @match        https://*/forums.php?page=*&action=viewthread&threadid=*
// @connect      *
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://openuserjs.org/src/libs/Anakunda/libLocks.min.js
// @require      https://openuserjs.org/src/libs/Anakunda/gazelleApiLib.min.js
// @description  Indicate a forum thread has received new post(s) while idling on any thread page
// @downloadURL https://update.greasyfork.org/scripts/420187/%5BGMT%5D%20New%20forum%20posts%20indicator.user.js
// @updateURL https://update.greasyfork.org/scripts/420187/%5BGMT%5D%20New%20forum%20posts%20indicator.meta.js
// ==/UserScript==

'use strict';

const postBody = document.getElementById('quickpost');
if (postBody == null) throw 'Post body missing';
const replyControls = document.body.querySelector('form#quickpostform > div.preview_submit');
if (replyControls == null) throw 'Reply controls missing';
const urlParams = new URLSearchParams(document.location.search);
const threadId = parseInt(urlParams.get('threadid'));
if (!(threadId > 0)) throw 'Thread Id missing';
const page = parseInt(urlParams.get('page')) || 1;
const getThread = (page = 9999999) => queryAjaxAPI('forum', { type: 'viewthread', threadid: threadId, page: page });
const interval = GM_getValue('check_interval', 15), snapshot = getThread();
let newPostsIndicator = null, activeTimer;
const checkPosts = () => snapshot.then(snapshot => getThread(snapshot.pages).then(function(response) {
	if (response.pages <= snapshot.pages && response.posts.length <= snapshot.posts.length) return;
	clearInterval(activeTimer);
	activeTimer = undefined;
	if (!newPostsIndicator) {
		(newPostsIndicator = document.createElement('SPAN')).style = 'margin-left: 3em; color: darkorange;';
		replyControls.append(newPostsIndicator);
	} else newPostsIndicator.innerHTML = '';
	const link = document.createElement('A'), onLastPage = page >= snapshot.pages;
	if (response.pages > page && !(onLastPage && response.posts.length > snapshot.posts.length)) {
		link.href = '/forums.php';
		link.search = new URLSearchParams({
			action: 'viewthread',
			threadid: response.threadId,
			page: onLastPage ? page + 1 : response.pages,
		});
		link.textContent = `go to ${onLastPage ? 'next' : 'last'} page`;
	} else {
		link.href = '#';
		link.onclick = function(evt) {
			document.location.reload();
			return false;
		};
		link.textContent = 'refresh page';
	}
	newPostsIndicator.append('This thread received new post(s) [', link, ']');
}));

postBody.onfocus = function(evt) {
	if (activeTimer != undefined || newPostsIndicator) return;
	activeTimer = setInterval(checkPosts, interval * 1000);
	checkPosts();
};
postBody.onblur = function(evt) {
	if (activeTimer != undefined) clearInterval(activeTimer); else return;
	activeTimer = undefined;
};
