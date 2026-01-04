// ==UserScript==
// @name               百度搜索界面优化
// @namespace          lee
// @version            1.0.4
// @description        百度搜索界面优化，清理右侧广告
// @author             lee
// @include            http*://www.baidu.com/*
// @include            http*://m.baidu.com/*
// @grant              none
// @run-at             document-start
// @license            MIT License
// @require            http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/376721/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%95%8C%E9%9D%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/376721/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%95%8C%E9%9D%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    var observer = new MutationObserver(function (records) {
        clearAD();
        reDesign();
    });
    var option = {
        'childList': true,
        'subtree': true
    };
    document.onreadystatechange = function () {
        if (document.readyState == "interactive") {
            observer.observe(document.body, option);
        }
    };

    function clearAD() {
        var mAds = document.querySelectorAll(".ec_wise_ad,.ec_youxuan_card"), i;
        for (i = 0; i < mAds.length; i++) {
            var mAd = mAds[i];
            mAd.remove();
        }
        var list = document.body.querySelectorAll("#content_left>div,#content_left>table");
        for (i = 0; i < list.length; i++) {
            var item = list[i];
            var s = item.getAttribute("style");
            if (s && /display:(table|block)\s!important/.test(s)) {
                item.remove();
            } else {
                var span = item.querySelector("div>span");
                if (span && span.innerHTML == "广告") {
                    item.remove();
                }
                [].forEach.call(item.querySelectorAll("a>span"), function (span) {
                    if (span && (span.innerHTML == "广告" || span.getAttribute("data-tuiguang"))) {
                        item.remove();
                    }
                });
            }
        }

        var eb = document.querySelectorAll("#content_right>table>tbody>tr>td>div");
        for (i = 0; i < eb.length; i++) {
            var d = eb[i];
            if (d.id != "con-ar") {
                d.remove();
            }
        }
    }

    function reDesign() {
        var right = document.body.querySelectorAll("#content_right"), i;
        for (i = 0; i < right.length; i++) {
            var mAd = right[i];
            mAd.remove();
        }
        $('#content_left').css('width', '924px');
        $('.c-container').css('width', '922px');
    }

    setTimeout(function () {
        clearAD();
        reDesign();
    }, 2000);
})();