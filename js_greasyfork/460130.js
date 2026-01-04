// ==UserScript==
// @name        No More YT Main Page
// @match       https://www.youtube.com/*
// @version     1
// @author      EnriqueDelto
// @description Makes the Youtube Main Page inaccessible
// @grant       none
// @run-at      document-start
// @license     MIT
// @namespace https://greasyfork.org/users/1028221
// @downloadURL https://update.greasyfork.org/scripts/460130/No%20More%20YT%20Main%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/460130/No%20More%20YT%20Main%20Page.meta.js
// ==/UserScript==

if (location.pathname === '/') {
  location.pathname = '/feed/subscriptions';
}
window.addEventListener('click', e => {
  const a = e.target.closest('a');
  if (a && a.href === 'https://www.youtube.com/') {
    a.pathname = '/feed/subscriptions';
    a.className = '';
  }
}, true);