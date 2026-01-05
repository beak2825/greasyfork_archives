// ==UserScript==
// @name         将京东手机版网页转换为PC版网页
// @author       星雨燃烧
// @namespace    None
// @version      0.11
// @description  将京东手机版分享过来的网页转换为PC版网页
// @author       BloodMoshe
// @match        http://item.m.jd.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/14786/%E5%B0%86%E4%BA%AC%E4%B8%9C%E6%89%8B%E6%9C%BA%E7%89%88%E7%BD%91%E9%A1%B5%E8%BD%AC%E6%8D%A2%E4%B8%BAPC%E7%89%88%E7%BD%91%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/14786/%E5%B0%86%E4%BA%AC%E4%B8%9C%E6%89%8B%E6%9C%BA%E7%89%88%E7%BD%91%E9%A1%B5%E8%BD%AC%E6%8D%A2%E4%B8%BAPC%E7%89%88%E7%BD%91%E9%A1%B5.meta.js
// ==/UserScript==


(function(){
    if  (document.URL.match(/\d+/)>0)
    {
        location.href="http://item.jd.com/"+document.URL.match(/\d+/)+".html";
    }
    })();