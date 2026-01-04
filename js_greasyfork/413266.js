// ==UserScript==
// @name         FuckAlibabaTrack 删除阿里巴巴集团下网站的跟踪参数
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  删除阿里巴巴集团下网站的跟踪参数
// @author       junbaor
// @match        *.aliyun.com/*
// @match        *.taobao.com/*
// @match        *.tmall.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413266/FuckAlibabaTrack%20%E5%88%A0%E9%99%A4%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E9%9B%86%E5%9B%A2%E4%B8%8B%E7%BD%91%E7%AB%99%E7%9A%84%E8%B7%9F%E8%B8%AA%E5%8F%82%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/413266/FuckAlibabaTrack%20%E5%88%A0%E9%99%A4%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E9%9B%86%E5%9B%A2%E4%B8%8B%E7%BD%91%E7%AB%99%E7%9A%84%E8%B7%9F%E8%B8%AA%E5%8F%82%E6%95%B0.meta.js
// ==/UserScript==
(function () {
    'use strict';

    function removeParam(url, paramName) {
        var indexParamStart = url.indexOf("?");
        var indexParamEnd = url.indexOf("#");

        var queryString;
        var anchorString = "";
        if (indexParamEnd < 0) {
            queryString = url.substring(indexParamStart);
        } else {
            queryString = url.substring(indexParamStart, indexParamEnd);
            anchorString = url.substring(indexParamEnd)
        }

        var resultUrl = doRemoveParam(queryString, paramName);
        return url.substring(0, indexParamStart) + resultUrl + anchorString;
    }

    function doRemoveParam(url, paramName) {
        var firstCase = url.indexOf("?" + paramName + "=");
        var noFirstCase = url.indexOf("&" + paramName + "=");

        // 需要替换的参数不是第一个参数
        if (noFirstCase >= 0) {
            var before = url.substring(0, noFirstCase);
            var after = url.substring(noFirstCase);
            var i = after.indexOf("&", 2);
            return before + after.substring(i);
        } else if (firstCase >= 0) {
            // 需要替换的参数是第一个参数
            var i2 = url.indexOf("&");
            if (i2 < 0) {
                return "";
            }
            var substring = url.substring(i2);

            if (substring.startsWith("&")) {
                return "?" + substring.substring(1);
            }
            return substring;
        }
        // 不包含想要替换的参数直接返回
        return url;
    }

    var locationUrl = window.location.href;
    var params = ["spm", "acm", "scm", "ali_trackid", "clk1", "upsid", "bxsign"];
    for (var i = 0; i < params.length; i++) {
        locationUrl = removeParam(locationUrl, params[i]);
    }
    console.log("替换后的最终地址：" + locationUrl);
    history.replaceState(history.state, history.title, locationUrl);
})();