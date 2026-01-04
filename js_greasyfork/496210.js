// ==UserScript==
// @name         JsonAds
// @namespace    http://tampermonkey.net/
// @version      2024-05-27
// @description  去除json.cn的弹层广告
// @author       You
// @match        https://www.json.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=json.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496210/JsonAds.user.js
// @updateURL https://update.greasyfork.org/scripts/496210/JsonAds.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var observer = new MutationObserver(function(mutations, observer){
        const ads = document.querySelectorAll('.adsbygoogle')
        removeGoogleAds(ads)
    })
    var el = document.body
    var options = {
        childList: true,
        subtree: true
    }
    observer.observe(el, options)
})();


let timeout
function removeGoogleAds(ads) {
    clearTimeout(timeout)
    setTimeout(() => {
        ads.forEach(ad => ad.parentElement && ad.parentElement.removeChild(ad))
    }, 100)
}