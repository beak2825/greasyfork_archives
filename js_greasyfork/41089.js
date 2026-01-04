// ==UserScript==
// @name         LRH京东插件
// @namespace    http://leironghua.com/
// @version      0.4
// @description  LRH京东插件.
// @author       雷荣华
// @include      *jd.com*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/41089/LRH%E4%BA%AC%E4%B8%9C%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/41089/LRH%E4%BA%AC%E4%B8%9C%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function (d) {
    'use strict';
    var t = d.createElement("script"); t.type = "text/javascript"; t.async = "async"; t.id = "_lrh_js";
    t.setAttribute("exparams", JSON.stringify({
        GMVersion: GM_info.version,
        GMScriptName: GM_info.script.name,
        GMScriptDescription: GM_info.script.description,
        GMScriptVersion: GM_info.script.version,
        GMScriptUUID: GM_info.script.uuid
    }));
    // 京东商品详情页
    if (window.location.href.indexOf("//item.jd.com/") != -1) {
        t.src = window.location.protocol + "//plugin.leironghua.com/bundles/jd.com/" + encodeURI('京东商品详情页PC');
    }

    // 京东商品详情页手机端
    if (window.location.href.indexOf("//item.m.jd.com/") != -1) {
        t.src = window.location.protocol + "//plugin.leironghua.com/bundles/jd.com/" + encodeURI('京东商品详情页M');
    }

    // 京东商品详情页手机端
    if (window.location.href.indexOf("//wqs.jd.com/pingou") != -1) {
        t.src = window.location.protocol + "//plugin.leironghua.com/bundles/jd.com/" + encodeURI('京东商品详情页pingou');
    }

    if (t.src && t.src != "") {
        t.src += "?v=" + new Date().getTime();
        d.getElementsByTagName("head")[0].appendChild(t);
    }
})(document);
