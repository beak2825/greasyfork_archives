// ==UserScript==
// @name        hcs64 last post
// @description Automatically jump to the last post in the HCS forum.
// @namespace   jimbo1qaz
// @include     *://hcs64.com/mboard/*
// @version     1
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/20514/hcs64%20last%20post.user.js
// @updateURL https://update.greasyfork.org/scripts/20514/hcs64%20last%20post.meta.js
// ==/UserScript==
// @run-at      document-start
// @run-at      document-end
// @run-at      document-idle


if (document.URL.contains('lastpage')) {
	let posts = document.getElementsByClassName('postlist')[0].children;
	posts[posts.length - 2].scrollIntoView();
}