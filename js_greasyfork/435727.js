// ==UserScript==
// @name         风之动漫去广告+优化
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  给风之动漫去广告+优化，主要是我自己看海贼王用的
// @author       WindErosion
// @match        https://manhua.fffdm.com/*
// @match        https://www.fffdm.com/
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js
// @icon         https://s3.bmp.ovh/imgs/2021/11/936852f503b6fd78.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435727/%E9%A3%8E%E4%B9%8B%E5%8A%A8%E6%BC%AB%E5%8E%BB%E5%B9%BF%E5%91%8A%2B%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/435727/%E9%A3%8E%E4%B9%8B%E5%8A%A8%E6%BC%AB%E5%8E%BB%E5%B9%BF%E5%91%8A%2B%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

let loca1 = RegExp("https://manhua.fffdm.com/*");
let loca2 = RegExp("https://www.fffdm.com/");
(function() {
    'use strict';

    if(loca1.test(location.href) || loca2.test(location.href)){
        document.head.insertAdjacentHTML('beforeend','<style>#HMRichBox,#pop_ad,#HMCOVER_ID1{display:none !important;}</style>');
        document.head.insertAdjacentHTML('beforeend','<style>#fix_top_dom{display:none !important;}</style>');
        document.head.insertAdjacentHTML('beforeend','<style>#HMimageleft,#HMimageright{display:none !important;}</style>');
        //document.head.insertAdjacentHTML('beforeend','<style>.pure-g{display:none !important;}</style>');
        document.head.insertAdjacentHTML('beforeend','<style>center{display:none !important;}</style>');
        document.head.insertAdjacentHTML('beforeend','<style>.mdc-snackbar__surface{display:none !important;}</style>');
        //$("#mdc-snackbar").hidden();
        document.head.insertAdjacentHTML('beforeend','<style>#header{position:relative !important;}</style>');
    }
})();