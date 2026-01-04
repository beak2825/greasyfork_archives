// ==UserScript==
// @name         Remove Specific Elements and Change Font Size on truyenwikidich.net
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  删除特定页面上的指定元素，并将特定元素的字体大小改为32px
// @author       UNKNOWN
// @match        https://truyenwikidich.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501227/Remove%20Specific%20Elements%20and%20Change%20Font%20Size%20on%20truyenwikidichnet.user.js
// @updateURL https://update.greasyfork.org/scripts/501227/Remove%20Specific%20Elements%20and%20Change%20Font%20Size%20on%20truyenwikidichnet.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面完全加载后删除元素
    window.addEventListener('load', function() {
        // 删除第一个元素
        var element1 = document.evaluate('/html/body/main/div[2]/div[3]/div[1]/div[2]/div[1]/div[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (element1) {
            element1.remove();
        }

        // 删除第二个元素
        var element2 = document.evaluate('/html/body/div[8]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (element2) {
            element2.remove();
        }

        // 删除第三个元素
        var element3 = document.evaluate('/html/body/main/div[2]/div[3]/div[1]/div[2]/div[2]/div', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (element3) {
            element3.remove();
        }

        // 删除第四个元素
        var element4 = document.evaluate('//*[@id="fly_af5Ki"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (element4) {
            element4.remove();
        }

        // 删除第五个元素
        var element5 = document.evaluate('//*[@id="fly_juymg"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (element5) {
            element5.remove();
        }

        // 删除第六个元素
        var element6 = document.evaluate('//*[@id="tpm_inpage_wrapper"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (element6) {
            element6.remove();
        }

        // 删除第七个元素
        var element7 = document.evaluate('//*[@id="bookContentBody"]/div[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (element7) {
            element7.remove();
        }

        // 删除第八个元素
        var element8 = document.evaluate('//*[@id="tpads_mb_article_top"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (element8) {
            element8.remove();
        }

        // 删除第九个元素
        var element9 = document.evaluate('//*[@id="tpads_mb_article_01"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (element9) {
            element9.remove();
        }

        // 删除第十个元素
        var element10 = document.evaluate('//*[@id="tpads_bell_mb_container"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (element10) {
            element10.remove();
        }

        // 删除第十一个元素
        var element11 = document.evaluate('//*[@id="fly_jcaKK"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (element11) {
            element11.remove();
        }

        // 删除所有 id 以 'fly_' 开头的元素
        var allElements = document.querySelectorAll('[id^="fly_"]');
        allElements.forEach(function(el) {
            el.remove();
        });

        // 将特定元素的字体大小改为32px
        var contentElement = document.getElementById('bookContentBody');
        if (contentElement) {
            contentElement.style.fontSize = '32px';
        }
    });
})();
