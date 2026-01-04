// ==UserScript==
// @name         Make TrueLeft Readable
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  AS is an idiot and refuses to use a reasonable theme on the site. Use this userscript to avoid eye strain :)
// @author       Sasha Koshka
// @match        https://trueleft.createaforum.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418716/Make%20TrueLeft%20Readable.user.js
// @updateURL https://update.greasyfork.org/scripts/418716/Make%20TrueLeft%20Readable.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    addGlobalStyle("body{max-width: 800px; background:none; background-color: #222222; color: #CCCCCC}");
    addGlobalStyle("img.bbc_img, div.post iframe{max-width:100% !important}");
    addGlobalStyle("#header, #header *, #header div.frame, div.cat_bar, #footer_section, #footer_section div.frame, #display_jump_to, div.windowbg, div.windowbg2, tbody *{background:none; background-color: #222222; color: #CCCCCC; box-shadow:none !important}");

    addGlobalStyle("#display_jump_to, #main_menu, #upper_section, #top_section{border:none}");

    addGlobalStyle("#content_section, div.buttonlist{background-color: #222222}");
    addGlobalStyle("div.buttonlist{background-color: #222222}");
    addGlobalStyle("a, div.cat_bar *{color: #CCCCCC !important}");

    addGlobalStyle("div.buttonlist *{color: #CCCCCC; background-color:#222222; background:0 !important}");

    addGlobalStyle("div.description, .icon1, .windowbg, tbody, .lastpost, .subject, td.windowbg2, tr.windowbg2, div.roundframe, div.title_bar, h4.titlebg {background:none; border:none; color:#CCCCCC !important}");

    addGlobalStyle("span.upperframe, span.upperframe span, span.lowerframe, span.lowerframe span {background:none; border:none; color:#CCCCCC !important}");
})();