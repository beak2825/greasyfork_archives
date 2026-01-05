// ==UserScript==
// @name         AudioBlocks
// @namespace    http://kmcdeals.com
// @version      1
// @description  DOWNLOAD ALL THE THINGS
// @author       Kmc
// @match        *://www.audioblocks.com/stock-audio/*
// @downloadURL https://update.greasyfork.org/scripts/10334/AudioBlocks.user.js
// @updateURL https://update.greasyfork.org/scripts/10334/AudioBlocks.meta.js
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

addGlobalStyle("#uneddit{position: fixed; bottom: 0px; right: 0px; z-index: 9999999; background-color: #fafbfc; border-color: black; outline: 0px; border-width: 0px; border-top-width: 1px; border-left-width: 1px; border-top-left-radius: 5px;}");

var link = document.querySelector('meta[property="og:audio"').content;
link = link.replace(/"/g, "");

document.getElementsByTagName("html")[0].innerHTML += "<a href = '" + link +"' download><input id='uneddit' type='button' value='Download'></a>"