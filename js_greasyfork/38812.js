// ==UserScript==
// @name         PChome search enhancement
// @namespace    https://wiki.gslin.org/wiki/PChomeSearchEnhancement
// @version      0.20180912.0
// @description  Ignore non-buyable items in PChome search page.
// @author       Gea-Suan Lin <darkkiller@gmail.com>
// @license      MIT
// @match        https://ecshweb.pchome.com.tw/search/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38812/PChome%20search%20enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/38812/PChome%20search%20enhancement.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let sheet = document.createElement('style');
    sheet.innerHTML = '.nonbuyable {opacity:0.33;}';
    document.getElementsByTagName('head')[0].appendChild(sheet);

    // Add three buttons inside #FilterBar.
    let toolbar = document.createElement('span');
    toolbar.innerHTML = '<button id="btn_grey">Grey</button> <button id="btn_hide">Hide</button> <button id="btn_disable">Disable</button>';
    let el = document.querySelector('.Cm_N .bar_spinbtn');
    if (!el) {
        return;
    }
    el.appendChild(toolbar);

    document.getElementById('btn_grey').addEventListener('click', function(){
        sheet.innerHTML = '.nonbuyable {opacity:0.33;}';
    });

    document.getElementById('btn_hide').addEventListener('click', function(){
        sheet.innerHTML = '.nonbuyable {display:none;}';
    });

    document.getElementById('btn_disable').addEventListener('click', function(){
        sheet.innerHTML = '';
    });

    let content = document.getElementById('CONTENT');
    let selector = '.col3f:has(li.orderNotyet), .col3f:has(li.orderReplenish), .col3f:has(li.soldOut)';

    let ob = new window.MutationObserver(function(el){
        window.jQuery(selector, el.target).addClass('nonbuyable');
    });

    ob.observe(content, {
        childList: true,
        subtree: true,
    });

    window.jQuery(selector).addClass('nonbuyable');
})();
