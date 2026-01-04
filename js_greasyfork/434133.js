// ==UserScript==
// @name         Jira Condensed
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @author       Bartosz Petrynski
// @description  Makes Jira board more condensed
// @include      https://*.atlassian.net/jira/software/c/projects/*
// @icon         https://www.google.com/s2/favicons?domain=bitbucket.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434133/Jira%20Condensed.user.js
// @updateURL https://update.greasyfork.org/scripts/434133/Jira%20Condensed.meta.js
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

addGlobalStyle('#ghx-header {margin-bottom: 0px !important;}');

addGlobalStyle('.adg3 #ghx-header {padding: 0px 0 0px 0 !important;}');

addGlobalStyle('.jkaXwY {margin: 0px 0px 0px 36px !important;}');

addGlobalStyle('.adg3 .ghx-column-headers .ghx-column {padding: 0px 10px !important;}');

addGlobalStyle('#ghx-swimlane-header-stalker {display: none !important;}');

addGlobalStyle('#ghx-quick-filters { display: flex');

addGlobalStyle('#ghx-quick-filters .fnn7p0-0.ghyPuo li { margin-top: 4px');



// addGlobalStyle('#jira-frontend > div > div > div.css-8rawpz{ --topNavigationHeight: 40px !important;}');

// addGlobalStyle('#ak-jira-navigation {height: 40px !important;}');


