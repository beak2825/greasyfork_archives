// ==UserScript==
// @name        RemoveNon24hResultsFromPChome
// @namespace   https://github.com/gslin/remove-non-24h-results-from-pchome
// @match       https://ecshweb.pchome.com.tw/search/*
// @grant       none
// @version     0.20201209.0
// @author      Gea-Suan Lin <gslin@gslin.org>
// @description Remove non-24h results on PChome search page.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/411923/RemoveNon24hResultsFromPChome.user.js
// @updateURL https://update.greasyfork.org/scripts/411923/RemoveNon24hResultsFromPChome.meta.js
// ==/UserScript==

(() => {
    'use strict';

    let sheet = document.createElement('style');
    sheet.innerHTML = '.result_mall {display:none;}';
    document.getElementsByTagName('head')[0].appendChild(sheet);

    let toolbar = document.createElement('span');
    toolbar.innerHTML = ' <button id="toggle_mall">Toggle mall</button>';
    let el = document.querySelector('.Cm_N .bar_spinbtn');
    if (!el) {
        return;
    }
    el.appendChild(toolbar);

    document.getElementById('toggle_mall').addEventListener('click', function(){
        if ('' === sheet.innerHTML) {
            sheet.innerHTML = '.result_mall {opacity:0.33;}';
        } else {
            sheet.innerHTML = '';
        }
    });

    let content = document.getElementById('CONTENT');
    let selector = '.col3f:has(button[_value="mall"])';

    let ob = new window.MutationObserver(function(el) {
        window.jQuery(selector, el.target).addClass('result_mall');
    });

    ob.observe(content, {
        childList: true,
        subtree: true,
    });
})();
