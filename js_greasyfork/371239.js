// ==UserScript==
// @name         Anistar Interface
// @namespace    https://greasyfork.org/users/205313
// @version      3.01
// @description  Изменяет интерфейс и убирает рекламу на сайте anistar.me
// @author       Stepiks
// @include      https://anistar.me/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371239/Anistar%20Interface.user.js
// @updateURL https://update.greasyfork.org/scripts/371239/Anistar%20Interface.meta.js
// ==/UserScript==
(function() {
    var ad_to_del = ['iframe[src*="laim.tv"]',
                     'iframe[src^="/banners"]',
                     'iframe[src^="/ad/"]',
                     'video[src^="//eboundservices.com/"]',
                     '.content-right > center',
                     'div[class^="UCOWisrw0aLVBW9otEVJiZmA"]',
                     '.news > iframe',
                     'div[class^="newclasswqasdvsdv"]',
                     'iframe[src^="https://ad.anistar.me/"]',
                     'iframe[src^="https://advmaker.su/"]',
                     '#overley-content',
                     '.roll-adbanner',
                     'script[src^="https://yt.advmaker.su/js/overroll.js"]',
                     'script[src^="https://advmaker.su/overoll/current-device.min.js"]',
                     '#MT_overroll > script',
                     'script[src^="//mxtads.com/"]'];
    document.head.insertAdjacentHTML('beforeend', '<style>.news_header .title_left > a {font-family: Arial, sans-serif !important;}.left-panel-bottom a {font-family: Arial, sans-serif !important;}</style>');
    hide_ad(ad_to_del);
    document.addEventListener("DOMContentLoaded", function() {delete_ad(ad_to_del);});
})();
function hide_ad(ad_to_del) {
    var s = '<style>';
    for (var i = 0; i < ad_to_del.length; i++) {
        if (ad_to_del[i].indexOf('script') == -1) {
            s += (ad_to_del[i] + ' {display: none !important;} ');
        }
    }
    s += '</style>';
    document.head.insertAdjacentHTML('beforeend', s);
}
function delete_ad(ad_to_del) {
    for (var i = 0; i < ad_to_del.length; i++) {
        delete_code(ad_to_del[i]);
    }
}
function delete_code(query) {
    var temp = document.querySelectorAll(query)[0];
    if (temp === undefined) {
        return;
    }
    if (temp.parentNode) {
        temp.parentNode.removeChild(temp);
    }
}