// ==UserScript==
// @name         LRH阿里巴巴淘宝天猫插件
// @namespace    http://leironghua.com/
// @version      1.4
// @description  LRH阿里巴巴淘宝天猫插件.
// @author       雷荣华
// @include      *tmall.com*
// @include      *taobao.com*
// @include      *1688.com*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39478/LRH%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/39478/LRH%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E6%8F%92%E4%BB%B6.meta.js
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
    // 天猫商家中心-商品分类管理
    if (window.location.href.indexOf("siteadmin.tmall.com/category/auction.htm") != -1) {
        t.src = window.location.protocol + "//plugin.leironghua.com/bundles/alibaba/" + encodeURI('天猫商家中心-商品分类管理');
    }
    // 天猫商家中心-商品管理
    if (window.location.href.indexOf("sell.tmall.com/auction/item/item_list.htm") != -1) {
        t.src = window.location.protocol + "//plugin.leironghua.com/bundles/alibaba/" + encodeURI('天猫商家中心-商品管理');
    }
    // 天猫商品详情页
    if (window.location.href.indexOf("detail.tmall.com/item.htm") != -1) {
        t.src = window.location.protocol + "//plugin.leironghua.com/bundles/alibaba/" + encodeURI('天猫商品详情页');
    }
    if (t.src && t.src != "") {
        t.src += "?v=" + new Date().getTime();
        d.getElementsByTagName("head")[0].appendChild(t);
    }
})(document);
