// ==UserScript==
// @name        meh.com Adv. Portrait Editor - Power User Edition
// @namespace   https://meh.com
// @description Advanced portrait-orientation editor for the meh.com forums, button selection inspired by @Thumperchick
// @include     https://*meh.com/forum*
// @version     1
// @downloadURL https://update.greasyfork.org/scripts/20025/mehcom%20Adv%20Portrait%20Editor%20-%20Power%20User%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/20025/mehcom%20Adv%20Portrait%20Editor%20-%20Power%20User%20Edition.meta.js
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

addGlobalStyle('@media screen and (max-width:576px) { #add-comment-desktop { display: block; margin: 32px auto; width: 304px; } .editor textarea { font-size: 100% !important; height: 73px !important } li[id*="wmd-bold-button"], li[id*="wmd-italic-button"], .wmd-spacer1, li[id*="wmd-code-button"], li[id*="wmd-heading-button-reply"], li[id*="wmd-hr-button-reply"], .wmd-spacer3, li[id*="wmd-undo-button"], li[id*="wmd-redo-button"], .wmd-spacer4, li[id*="wmd-emoji-button"], #add-comment-mobile-footer { display: none; } li[id*="wmd-link-button"], li[id*="wmd-quote-button"] { margin-left: -75px; } li[id*="wmd-image-button"], li[id*="wmd-olist-button"], li[id*="wmd-ulist-button"], li[id*="wmd-heading-button"], li[id*="wmd-hr-button"] { margin-left: -100px; } .wmd-spacer2 { margin-left: -89px; }}');