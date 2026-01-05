// ==UserScript==
// @name     	Patreon Wide Theme
// @description	Adjusts Patreon pages to show more content.
// @include  	*.patreon.com/*
// @include  	*.patreon.com/
// @version		1.25
// @run-at 		document-start
// @grant    	GM_addStyle
// @namespace https://greasyfork.org/users/33744
// @downloadURL https://update.greasyfork.org/scripts/18018/Patreon%20Wide%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/18018/Patreon%20Wide%20Theme.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle('._2CM-components-PostFeed--spacing {width: 48%;padding: 1%;float: left;} ._1CB-components-Comment--wrapper {max-height: 200px;overflow-y: auto;overflow-x: hidden;}');