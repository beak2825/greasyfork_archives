// ==UserScript==
// @name         购物党比价助手精简版
// @description  精简的比价助手
// @namespace    https://greasyfork.org/zh-CN/scripts/373964-%E6%AF%94%E4%BB%B7%E5%8A%A9%E6%89%8B
// @version      0.4
// @author       silentmoon
// @include      http*://item.taobao.com/*
// @include      http*://s.taobao.com/*
// @include      http*://detail.tmall.com/item.htm*
// @include      http*://detail.liangxinyao.com/item.htm*
// @include      http*://chaoshi.detail.tmall.com/item.htm*
// @include      http*://item.jd.com/*
// @include      https://item.jd.hk/*
// @include      https://detail.tmall.hk/*
// @include      https://*.suning.com/*
// @grant        GM_xmlhttpRequest
// @connect      gwdang.com
// @require           https://cdn.bootcss.com/jquery/3.5.1/jquery.min.js

// @downloadURL https://update.greasyfork.org/scripts/411473/%E8%B4%AD%E7%89%A9%E5%85%9A%E6%AF%94%E4%BB%B7%E5%8A%A9%E6%89%8B%E7%B2%BE%E7%AE%80%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/411473/%E8%B4%AD%E7%89%A9%E5%85%9A%E6%AF%94%E4%BB%B7%E5%8A%A9%E6%89%8B%E7%B2%BE%E7%AE%80%E7%89%88.meta.js
// ==/UserScript==

var jq142 = jQuery.noConflict(true);
(function() {
    'use strict';

    addScript("https://browser.gwdang.com/get.js?f=/js/gwdang_extension.js");
    setTimeout(function() {
        init();

    }, 100);


    document.addEventListener('load', function(e) {

        if (e &&
            e.path &&
            e.path[0] &&
            e.path[0].src) {
            let url = e.path[0].src;

            if (url.indexOf("gwdang") >= 0 && e.path[0].localName == "script" ) {

                //console.log(url);

            }
            if (url.indexOf("prepare?permanent_id") > 0) {
                setTimeout(function() {
                    remove();

                }, 1000);

            }
        }

    }, true);


    function remove() {
        jq142("#promo_quan_btn").remove();
        jq142("#gwdang-banner-ad").remove();
        jq142(".gwd-topbar-right").remove();
        jq142("#gwd_mini_remind .minibar-btn-box").remove();
        jq142(".gwd-topbar-logo").remove();
        jq142("#b2c_compare").remove();
        jq142("#gwdang_main").css("display", "flex");

    }

    function init() {
        jq142("#gwdang_main").css("display", "none");
        jq142("#gwdang_main").css("background-color", "transparent");
    }

    function addScript(src) {
        GM_xmlhttpRequest({
            url: src,
            method: 'GET',
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cache-Control': 'public'
            },
            onload: function(data) {

                let node = document.createElement("script");

                node.innerText = data.responseText.replace(new RegExp("browser\.gwdang\.com", "gm"), "www.baidu.com")
                    .replace("e.server+\"/extension/price_towards", "\"https://browser.gwdang.com/extension/price_towards")
                    .replace("e.server+\"/brwext/dp_query_latest", "\"https://browser.gwdang.com/brwext/dp_query_latest")
                    .replace("e.server+\"/ip.php", "\"https://browser.gwdang.com/ip.php").replace("e.server+\"/ip.php", "\"https://browser.gwdang.com/ip.php")
                    .replace("e.server+\"/brwext/prepare?permanent_id=", "\"https://browser.gwdang.com/brwext/prepare?permanent_id=")
                    .replace("i.server+\"/extension/InTimePromotion", "\"https://browser.gwdang.com/extension/InTimePromotion")
                    .replace("e.server+\"/brwext/permanent_id/", "\"https://browser.gwdang.com/brwext/permanent_id/")//.replace("i.server+\"/brwext/monitor", "\"https://browser.gwdang.com/brwext/monitor")
                    .replace("e.server+\"/brwext/permanent_id", "\"https://browser.gwdang.com/brwext/permanent_id").replace("e.server+\"/brwext/permanent_id", "\"https://browser.gwdang.com/brwext/permanent_id");

                document.head.appendChild(node);
            }
        });


    }







})();