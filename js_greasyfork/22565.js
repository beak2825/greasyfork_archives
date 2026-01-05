// ==UserScript==
// @name         BetterNestCamView
// @namespace    http://executechlabs.com
// @version      0.2
// @description  try to take over the world!
// @author       justintevya
// @match        https://home.nest.com/home/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22565/BetterNestCamView.user.js
// @updateURL https://update.greasyfork.org/scripts/22565/BetterNestCamView.meta.js
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

 addGlobalStyle('.sidebar-content .space-wrapper { max-width: 100% !important; }');
 addGlobalStyle('.sidebar-content li.space-item { position: static !important; }');
 addGlobalStyle('.sidebar-container { top: -25rem !important; }');
 addGlobalStyle('.navbar { height: 6rem !important; }');