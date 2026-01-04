// ==UserScript==
// @namespace         https://greasyfork.org/en/users/395499-shiroetsuki

// @name              yamitranslationsdarkmode
// @name:en           Yami Translations Dark Mode

// @author            Shiro Tsuki 

// @description       Themes the entire site to be dark mode。
// @description:en    Themes the entire site to be dark mode.

// @description       https://github.com/ShiroETsuki/Dark-Mode-Script-Machine
// @homepageURL       https://github.com/ShiroETsuki/Dark-Mode-Script-Machine/blob/master/user.js
// @supportURL        Shiro-Tsuki#7172 -Discord

// @version           1.0

// @match             https://www.yamitranslations.com/*
// @match             https://discordapp.com/widget?*
// @match             https://www.blogger.com/*

// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/392062/yamitranslationsdarkmode.user.js
// @updateURL https://update.greasyfork.org/scripts/392062/yamitranslationsdarkmode.meta.js
// ==/UserScript==

//function to overwrite existing CSS
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

//Variable Callouts for each HTML element. 
addGlobalStyle('body {color: #ffffff !important; background: #000000 !important; }')
addGlobalStyle('a:visited {color: #7ed7fd !important;}')
addGlobalStyle('a:link {color: #e779fa !important;}')
addGlobalStyle('p.comment-content{color: #c047c2 !important;}') //wordpress comment body color
addGlobalStyle('.Header h1 a, h1, ::placeholder{color: #e925d1bf !important;}')
addGlobalStyle('h2 {color: #af1c9d !important;}')
addGlobalStyle('h3.post-title.entry-title, h3{color: #c047c2 !important;}')
addGlobalStyle('h4{color: #fd3993 !important;}')
addGlobalStyle('span{color: #c28ec8 !important;}') //all span attributes (also affects discord widget)
addGlobalStyle('#menu, .bottom{background: #252525 !important;}') //top and bottom menu colors
addGlobalStyle('.widget-theme-light .widgetBody-1YvOmj, .widget-theme-light .widgetFooter-1l6LHW {background-color:#202225 !important;}') //changes discord to dark theme on site.
addGlobalStyle('.postCommentButtonHolder {background-color: #202225;}')
addGlobalStyle('#allHolder {background-color: #202225 !important;}')
addGlobalStyle('.tabz-content {background-color: #141414 !important;}')
addGlobalStyle('.tabz-links a, ul.dropdown li, .dropit .dropit-submenu{background-color: #373737 !important;}')