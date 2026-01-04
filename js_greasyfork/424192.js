// ==UserScript==
// @name                移除广告
// @name:CN:zh          移除广告
// @namespace           https://github.com/GuoChen-thlg
// @version             0.1.4
// @description         移除网页中的广告
// @homepage            https://greasyfork.org/zh-CN/users/750817-thlg
// @author              THLG
// @supportURL          gc.thlg@gmail.com
// @contributionURL     https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=CK755FJ9PSBZ8
// @contributionAmount  1
// @require             https://code.jquery.com/jquery-2.1.4.min.js
// @match               *://*.baidu.com/*
// @match               *://*.csdn.net/*
// @match               *://csdn.net/*
// @match               *://segmentfault.com/*
// @match               *://*.iqiyi.com/*
// @grant               none
// @run-at              document-end
// @downloadURL https://update.greasyfork.org/scripts/424192/%E7%A7%BB%E9%99%A4%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/424192/%E7%A7%BB%E9%99%A4%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
(function ($) {
    'use strict';
    jQuery.noConflict(true);
    function clearEl (c_select, p_select) {
        if (p_select) {
            $(c_select.join(',')).closest(p_select.join(',')).each((i, el) => {
                if (el) { el.remove() }
            })
        } else {
            $(c_select.join(',')).remove()
        }
    }
    function clearAds () {
        if (/\w{4,5}:\/\/(www\.)?baidu.com\/s.*/.test(location.href)) {
            clearEl([
                "[cmatchid] [class*=tuiguang]",
                ".result [class*=tuiguang]",
                "[data-click] [data-tuiguang]",
            ], [
                "[cmatchid]",
                ".result",
                "[data-click]",
            ])
        }
        if (/\w{4,5}:\/\/jingyan.baidu.com\/s.*/.test(location.href)) {
            clearEl([
                "#task-panel-wrap",
                "#fresh-share-exp-e"
            ])
        }
        if (/\w{4,5}:\/\/wenku.baidu.com\/s.*/.test(location.href)) {
            clearEl([
                "[id*=bdfs] [href*='e.baidu.com']",
            ], [
                "[id*=bdfs]",
            ])
        }
        if (/\w{4,5}:\/\/zhidao.baidu.com\/.*/.test(location.href)) {
            clearEl([
                ".list-header [class*='ec-tuiguang']",

            ], [
                ".list-header",
            ])
        }
        if (/\w{4,5}:\/\/.*csdn.net\/.*/.test(location.href)) {
            clearEl([
                "ins.adsbygoogle",
                "[id*='-ad'] iframe",
            ])
        }
        if (/\w{4,5}:\/\/.*segmentfault.*/.test(location.href)) {
            clearEl([
                "[class*='ad-']",
            ])
        }
        if (/\w{4,5}:\/\/.*iqiyi\.com.*/.test(location.href)) {
            clearEl([
                "[adid]"
            ])
            if ($('.bottom-public').is(':visible') && $('.bottom-public a.skippable-after') && $('.bottom-public a.skippable-after').length > 0) {
                $('.bottom-public a.skippable-after')[0]['click']();
            }
            if ($('.cupid-pause-max-close-btn').length > 0) {
                $('.cupid-pause-max-close-btn')[0]['click']();
            }
        }
    }
    setInterval(clearAds, 20)
})(jQuery);

