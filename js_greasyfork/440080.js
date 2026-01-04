// ==UserScript==
// @name         TieBa Remove Ad
// @namespace    http://tampermonkey.net/
// @version      0.13
// @description  Title is description
// @author       You
// @match        https://tieba.baidu.com/*
// @icon         https://tb3.bdstatic.com/public/icon/favicon-v2.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440080/TieBa%20Remove%20Ad.user.js
// @updateURL https://update.greasyfork.org/scripts/440080/TieBa%20Remove%20Ad.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const ads = {
        parent: '.label_text',
        direct: '.app_download_box,#tb_nav [data-tab-],.fengchao-wrap,#fixed_bar,.fengchao-wrap-feed,#aside-ad,[data-po],[data-field="{}"]'
    }
    cleanUp();
    let k = 0
    let ticker = setInterval(function () {
        cleanUp();
        if (k > 20)
            clearInterval(ticker);
    }, 400);
    function cleanUp() {
        deleteAllNodes()
        let parentAd = document.querySelectorAll(ads.parent);
        if (parentAd.length > 0) {
            for (let ad of parentAd)
                deleteNode(ad.parentNode);
        }
        deleteAllNodes(ads.direct);
        // vip
        deleteNode('pagelet_encourage-celebrity/pagelet/celebrity', 'id');
        k++;
    }

    function deleteAllNodes(target) {
        let ads = typeof target === 'object' ? target : document.querySelectorAll(target);
        if (ads.length > 0)
            for (let ad of ads)
                ad.remove();
    }

    function deleteNode(target, type = 'query') {
        let ad = typeof target === 'object' ? target : type === 'id' ? document.getElementById(target) : document.querySelector(target);
        ad.remove();
    }
})();