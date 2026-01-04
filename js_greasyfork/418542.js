// ==UserScript==
// @name         chefkoch for minimalists
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  basically removes everything useless from the website
// @author       cabtv
// @match        https://www.chefkoch.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418542/chefkoch%20for%20minimalists.user.js
// @updateURL https://update.greasyfork.org/scripts/418542/chefkoch%20for%20minimalists.meta.js
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

    addGlobalStyle('div div img[referrerpolicy="unsafe-url"] { display: none; }'); // big ad banners everywhere
    addGlobalStyle('#vi-stories-main-container { display: none; }'); // video ad
    addGlobalStyle('.r-footer { display: none; }'); // footer
    addGlobalStyle('#recipe-comments { display: none; }'); // comments
    addGlobalStyle('div.ad { display: none; }'); // empty boxes, probably ads filtered by adblocker
    addGlobalStyle('div.rg-list, div.pi-cont { display: none; }'); // weird white space beneath comments
    addGlobalStyle('hr { display: none; }'); // useless lines
    addGlobalStyle('iframe { display: none !important; }'); // all iframes

    // remove all of sidebar right except "weitere Rezepte"
    addGlobalStyle('aside.ds-box { display: none; }'); // sidebar right
    addGlobalStyle('div.experiment-inspiration-0 aside.ds-box { display: block;}');

    // disable all ajax requests because otherwise chefkoch continues to load bullshit in the background
    XMLHttpRequest.prototype.send = function(){};

})();