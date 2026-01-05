// ==UserScript==
// @name         去除淘宝低同行评价的条目
// @description:en Hide Bad Reputation Taobao Items
// @namespace    https://greasyfork.org/en/users/22079-hntee
// @version      0.1
// @author       hntee
// @include     http://*.taobao.com/*
// @include     https://*.taobao.com/*
// @description 去除淘宝低同行评价的条目（屏蔽多于一个绿色的商家）
// @require      http://cdn.bootcss.com/jquery/3.0.0/jquery.min.js

// @downloadURL https://update.greasyfork.org/scripts/20570/%E5%8E%BB%E9%99%A4%E6%B7%98%E5%AE%9D%E4%BD%8E%E5%90%8C%E8%A1%8C%E8%AF%84%E4%BB%B7%E7%9A%84%E6%9D%A1%E7%9B%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/20570/%E5%8E%BB%E9%99%A4%E6%B7%98%E5%AE%9D%E4%BD%8E%E5%90%8C%E8%A1%8C%E8%AF%84%E4%BB%B7%E7%9A%84%E6%9D%A1%E7%9B%AE.meta.js
// ==/UserScript==


var debug = false;

(function() {
    'use strict';
    // Your code here...
    window.addEventListener("load", filterBad ,false);
    observeDomChange();
})();

function observeDomChange() {
    var MutationObserver = window.MutationObserver;
    var myObserver       = new MutationObserver (mutationHandler);
    var obsConfig        = {
        childList: true, attributes: true,
        subtree: true,   attributeFilter: ['mainsrp-itemlist']
    };
    myObserver.observe (document, obsConfig);
    function mutationHandler (mutationRecords) {
        filterBad();
    }
}

function filterBad() {
    var allItems = $('.dsrs');
    var badItems = $('.dsrs').filter(function() {
        return $(this).find('.lessthan').length > 1;
    });

    var removeNum = allItems.length - badItems.length;
    if (debug) console.log(removeNum + ' items ' + 'removed');

    badItems.parent().parent().parent().parent().parent().hide();
}

