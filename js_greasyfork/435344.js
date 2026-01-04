// ==UserScript==
// @name         !简结 淘宝天猫优惠券领券助手-隐藏券&内部券一键领取
// @namespace    https://yd.qqvbc.com/dtk/
// @version      2.11
// @description  史上最简洁、最好用的淘宝天猫领券助手。
// @author       Joyber
// @match        https://detail.tmall.com/item.htm*
// @match        https://item.taobao.com/item.htm*
// @match        https://detail.tmall.hk/*
// @require      https://cdn.staticfile.org/jquery/2.2.4/jquery.min.js
// @require      https://cdn.staticfile.org/jquery.qrcode/1.0/jquery.qrcode.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435344/%21%E7%AE%80%E7%BB%93%20%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E4%BC%98%E6%83%A0%E5%88%B8%E9%A2%86%E5%88%B8%E5%8A%A9%E6%89%8B-%E9%9A%90%E8%97%8F%E5%88%B8%E5%86%85%E9%83%A8%E5%88%B8%E4%B8%80%E9%94%AE%E9%A2%86%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/435344/%21%E7%AE%80%E7%BB%93%20%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E4%BC%98%E6%83%A0%E5%88%B8%E9%A2%86%E5%88%B8%E5%8A%A9%E6%89%8B-%E9%9A%90%E8%97%8F%E5%88%B8%E5%86%85%E9%83%A8%E5%88%B8%E4%B8%80%E9%94%AE%E9%A2%86%E5%8F%96.meta.js
// ==/UserScript==
"use strict";
!function () {
    function loadLib(src, func) {
        var oHead = document.getElementsByTagName('HEAD').item(0);
        var oScript = document.createElement("script");
        oScript.type = "text/javascript";
        oScript.src = src;
        if (typeof func === 'function') {
            oScript.onload = function () {
                func.call(this);
                oScript.remove();
            };
        } else {
            oScript.onload = function () {
                oScript.remove();
            };
        }
        oHead.appendChild(oScript);
    }

    if (typeof jQuery != 'function') {
        loadLib("https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js?2.3", _run);
    } else {
        _run();
    }
    function _run() {
        jQuery(function () {
            // 获取参数
            function getQueryString(name) {
                var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
                var r = window.location.search.substr(1).match(reg);
                if (r != null) {
                    return unescape(r[2]);
                }
                return null;
            }

            function requireJs(type, id) {
                jQuery.ajax({
                    dataType: "jsonp",
                    type: 'get',
                    url: "https://yd.qqvbc.com/chrome/js?v=221019&callback=?",
                    data: { type: type, id: id }
                });
            }

            function tmallDetail() {
                var id = getQueryString('id');
                requireJs('tmall', id);
            }

            function taobaoDetail() {
                var id = getQueryString('id');
                requireJs('taobao', id);
            }

            var host = window.location.hostname;
            var path = window.location.pathname;

            if (host == 'detail.tmall.com' || host == 'detail.tmall.hk') {
                tmallDetail();
            }
            if (host == 'item.taobao.com') {
                taobaoDetail();
            }
        });
    }
}();
