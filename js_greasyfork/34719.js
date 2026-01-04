// ==UserScript==
// @name           feedly_tweaks
// @namespace      https://greasyfork.org/de/users/157797-lual
// @match          http*://*.feedly.com/*
// @version        1.6
// @description	   small style tweaks for feedly news reader
// @author         lual
// @grant GM_addStyle
// @grant GM_getResourceURL
// @downloadURL https://update.greasyfork.org/scripts/34719/feedly_tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/34719/feedly_tweaks.meta.js
// ==/UserScript==
// changes:        2017-11-01 publish on greasyfork
//                 2019-11-07 add styling for dark theme / bigger rowcount
//                 2019-11-07 bigger rowcount was to big ;)
//                 2022-11-10 convert deprecated @include to @match
//                 2024-01-17 fix some styles
/////////////////////////////////////////////////////////////////////////////////////////////////////////
//GM_addStyle seems to work not correct - so we have to use an alternative:
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
// don't change font-weight for read lines
addGlobalStyle('.fx .entry.u0.read .content .title { font-weight: bold !important;}');

// better visibility for current selected line
addGlobalStyle('.selected { color: #A1A1A1 !important;  background-color: #BBDCC6 !important;}');
addGlobalStyle('.theme--dark .selected { color: rgba(255, 255, 255, 0.8) !important;  background-color: #2bb24c !important;}');
addGlobalStyle('.theme--dark .fx .entry.read .title { color: rgba(255, 255, 255, 0.6);}');
addGlobalStyle('.theme--dark .fx .entry.u0 .summary { color: rgba(255, 255, 255, 0.8) !important; }');
addGlobalStyle('.theme--dark .TitleOnlyLayout--selected { background-color: BBDCC6 !important;}');


// rowcount bigger
addGlobalStyle('.LeftnavListRow__count { font-size: 0.815rem; }');
addGlobalStyle('.LeftnavListRow--selected .LeftnavListRow__count { font-size: 1.0rem; }');

// upgrade-button - yes, but not so obstrusive
addGlobalStyle('.fx .button.primary.pro, .fx button.primary.pro, .fx-button.primary.pro { background-color: #0c0b0b1a;}');
addGlobalStyle('.theme--dark .fx .button.primary.pro, .theme--dark .fx button.primary.pro, .theme--dark .fx-button.primary.pro {color: #818181; background-color: #0c0b0b1a;}');
addGlobalStyle('.TopHeaderBar__actions button {color: #818181; background-color: #0c0b0b1a;}');