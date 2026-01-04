// ==UserScript==
// @name         Twitch, I don't like change
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Undo the nasty parts of the new twitch layout
// @author       Viper-7
// @match        https://www.twitch.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390527/Twitch%2C%20I%20don%27t%20like%20change.user.js
// @updateURL https://update.greasyfork.org/scripts/390527/Twitch%2C%20I%20don%27t%20like%20change.meta.js
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

(function() {
    'use strict';
    addGlobalStyle('html .tw-c-text-alt-2 { color: #898395 !important; }');
    addGlobalStyle('html .tw-semibold { font-weight: 400 !important; }');
    addGlobalStyle('html .tw-c-text-alt { color: #b8b5c0 !important; }');
    addGlobalStyle('html section.chat-room { background-color: rgb(15,14,17) !important; }');
    addGlobalStyle('html div.channel-root__right-column { background-color: #232127 !important; }');
    addGlobalStyle('html .tw-c-text-base { color: #dad8de !important; }');
    addGlobalStyle('html .top-nav__menu { background-color: #4b367c !important; }');
    addGlobalStyle('html .tw-root--theme-dark body { background-color: #0f0e11 !important; }');
    addGlobalStyle('a, abbr, acronym, address, applet, article, aside, audio, b, big, blockquote, body, canvas, caption, center, cite, code, dd, del, details, dfn, div, dl, dt, em, embed, fieldset, figcaption, figure, footer, form, h1, h2, h3, h4, h5, h6, header, hgroup, html, i, iframe, img, ins, kbd, label, legend, li, mark, menu, nav, object, ol, output, p, pre, q, ruby, s, samp, section, small, span, strike, strong, sub, summary, sup, table, tbody, td, tfoot, th, thead, time, tr, tt, u, ul, var, video { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif !important; }');
    addGlobalStyle('html .tw-font-size-4 { font-size: 1.4rem !important; font-weight: 400 !important; color: #b19dd8 !important; }');
    addGlobalStyle('html .tw-input { background-color: #232127 !important; }');
})();