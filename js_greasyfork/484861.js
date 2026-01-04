// ==UserScript==
// @license           MIT
// @name              projects
// @name:en-US        projects
// @description       Cannot view other Scratch projects.
// @description:en-US Cannot view other Scratch projects.
// @match             https://scratch.mit.edu/projects/*
// @grant             GM_addStyle
// @run-at            document-start
// @version 0.0.1.20240115004256
// @namespace https://greasyfork.org/users/1248129
// @downloadURL https://update.greasyfork.org/scripts/484861/projects.user.js
// @updateURL https://update.greasyfork.org/scripts/484861/projects.meta.js
// ==/UserScript==
GM_addStyle('#view{display:none;}');
(new MutationObserver(check)).observe(document, {childList: true, subtree: true});
function check(changes, observer) {
    if(document.querySelector('.title').querySelector('form')) {
        observer.disconnect();
        GM_addStyle('#view{display:revert; display: inline-block;}');
    }
}