// ==UserScript==
// @name         compare hktvmall product price to other sites
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       TONYHOKAN
// @match        https://www.hktvmall.com/*/p/*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/377877/compare%20hktvmall%20product%20price%20to%20other%20sites.user.js
// @updateURL https://update.greasyfork.org/scripts/377877/compare%20hktvmall%20product%20price%20to%20other%20sites.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var parknshopUrl = 'http://www.parknshop.com/zh-hk/search?text=';
    var zstoreUrl = 'https://www.ztore.com/tc/search/'
    var priceComUrl = 'https://www.price.com.hk/search.php?g=A&q='
    var googleUrl = 'https://www.google.com.hk/search?q='
    var productTitle = encodeURI($('.last').html())

    $('.bottomButtons').append(genCheckButton(parknshopUrl+productTitle, 'parknshop'))
    $('.bottomButtons').append(genCheckButton(zstoreUrl+productTitle, 'zstore'))
    $('.bottomButtons').append(genCheckButton(priceComUrl+productTitle, 'price.com'))
    $('.bottomButtons').append(genCheckButton(googleUrl+productTitle + ' -site:https://www.hktvmall.com/', 'google'))

   function genOnClick(url)
    {
        // var searchUrl = 'onclick="window.location.href=\'' + targetUrl + productTitle + '\'"'
        return 'onclick="window.open(\''+url+'\', \'_blank\')"'
    }

    function genCheckButton(url, buttonString)
    {
        return '<div class="buttonWrapper"><button class="sepaButton large" ' + genOnClick(url) + '><div class="spriteWrapper"></div><span>' + buttonString + '</span></button></div>'
    }
})();




f