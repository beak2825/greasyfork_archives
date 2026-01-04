// ==UserScript==
// @name            Youtube - unstick search bar and categories buttons row 
// @description     Unsticks youtube search bar from the top, so it goes away by scrolling
// @namespace       https://greasyfork.org/en/users/758587-barn852
// @author          barn852
// @match           *://www.youtube.com/*
// @grant           none
// @version         1.0
// @grant           GM_addStyle
// @run-at          document-end 
// @downloadURL https://update.greasyfork.org/scripts/429377/Youtube%20-%20unstick%20search%20bar%20and%20categories%20buttons%20row.user.js
// @updateURL https://update.greasyfork.org/scripts/429377/Youtube%20-%20unstick%20search%20bar%20and%20categories%20buttons%20row.meta.js
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

// search bar, remove, put // in the front if you want to stick it to the top.
addGlobalStyle( `div#masthead-container.ytd-app,ytd-mini-guide-renderer.ytd-app,app-drawer#guide{position:absolute!important}`); // search bar - 

// button row
addGlobalStyle( `#chips-wrapper {position:absolute!important;top:0!important} `); 
// addGlobalStyle( `ytd-feed-filter-chip-bar-renderer {position:relative!important} `);
