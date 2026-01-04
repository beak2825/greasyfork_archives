// ==UserScript==
// @name        Github Move Checks
// @description A userscript that move checks to the top of the page
// @license     MIT
// @author      Marco Pelegrini
// @namespace   https://github.com/marcopelegrini
// @version     1.0.0
// @include     https://*github*/*
// @exclude     https://*github*/*/*.diff
// @exclude     https://*github*/*/*.patch
// @run-at      document-idle
// @grant       GM.addStyle
// @grant       GM_addStyle
// @icon        https://github.githubassets.com/pinned-octocat.svg
// @downloadURL https://update.greasyfork.org/scripts/416933/Github%20Move%20Checks.user.js
// @updateURL https://update.greasyfork.org/scripts/416933/Github%20Move%20Checks.meta.js
// ==/UserScript==

(function () {
    function moveChecks() {
       let actions = document.getElementsByClassName('discussion-timeline-actions')[0];
       actions.style.border = "none";
       document.getElementsByClassName('js-pull-discussion-timeline')[0].prepend(actions);
       document.getElementsByClassName('js-discussion js-socket-channel')[0].append(document.getElementsByClassName('timeline-comment-wrapper')[0]);
       document.getElementsByClassName('merge-pr-more-commits')[0].hidden=true;
    }

    moveChecks();
})();