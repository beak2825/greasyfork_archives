// ==UserScript==
// @name         删除cn.bing.com的页脚和本体法律通知
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  删除cn.bing.com的页脚，更舒服的看壁纸！删除了回应符合本地法律的通知
// @author       Raven
// @match      *://cn.bing.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/384174/%E5%88%A0%E9%99%A4cnbingcom%E7%9A%84%E9%A1%B5%E8%84%9A%E5%92%8C%E6%9C%AC%E4%BD%93%E6%B3%95%E5%BE%8B%E9%80%9A%E7%9F%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/384174/%E5%88%A0%E9%99%A4cnbingcom%E7%9A%84%E9%A1%B5%E8%84%9A%E5%92%8C%E6%9C%AC%E4%BD%93%E6%B3%95%E5%BE%8B%E9%80%9A%E7%9F%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var idObject = document.getElementById('b_footer');//删除页脚

    if (idObject !== null)
    {
        idObject.parentNode.removeChild(idObject);
    }
    var elements = document.getElementsByClassName('b_msg');//删除通知
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);}}
)();