// ==UserScript==
// @name         Bing.com Customization
// @namespace    http://tampermonkey.net/
// @version      2.14
// @description  make bing.com less bloated with trash news and bad writers
// @author       Philadelphia, USA
// @match        https://www.bing.com/
// @locale       english
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36086/Bingcom%20Customization.user.js
// @updateURL https://update.greasyfork.org/scripts/36086/Bingcom%20Customization.meta.js
// ==/UserScript==

// how did i do this? https://somethingididnotknow.wordpress.com/2013/07/01/change-page-styles-with-greasemonkeytampermonkey/


function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

// remove the header links at the very top
addGlobalStyle('div#hp_sw_hdr {display: none !important;}');

// customize the search box, make it more subtle
addGlobalStyle('.b_searchboxForm, .b_searchbox { opacity: 0.55; box-shadow: none !important; }');
addGlobalStyle('.b_searchboxForm:hover, .b_searchbox:hover { opacity: 1 }');

// customize the 144px height bottom news bar on page load, nuke it.
addGlobalStyle('div#sc_md { display: none; }');
addGlobalStyle('div#hp_bottomCell { padding-top: 144px; }');

// could also customize news bar like below, but it's not as clean.
// addGlobalStyle('div#sc_md { position: relative; left: -9999px; }');

