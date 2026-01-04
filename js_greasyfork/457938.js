// ==UserScript==
// @name          YouTube Dismissible Banner Remover
// @namespace     http://youtube.com
// @description   Removes the dismissible banner from YouTube
// @author        jflow
// @match         https://*.youtube.com/*
// @version       1
// @run-at        document-idle
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/457938/YouTube%20Dismissible%20Banner%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/457938/YouTube%20Dismissible%20Banner%20Remover.meta.js
// ==/UserScript==


// This removes it by class. There are two classes for the div that holds the banner
// ".style-scope" and ".ytd-statement-banner-renderer". I narrowed it to just the 2nd
// one in order to be more specific but it may need to include both or just the first
// one. Will have to wait until the next banner shows up to be sure. If it needs to be
// both, it will look like this:

// const elements = document.querySelectorAll('.style-scope.ytd-statement-banner-renderer');
//for (const element of elements) {
//    element.remove();
//}

// if it only needs the first one, just change it to '.style-scope'

const elements = document.querySelectorAll('.ytd-statement-banner-renderer');
for (const element of elements) {
    element.remove();
}