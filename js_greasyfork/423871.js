// ==UserScript==
// @name         跨步软考plus
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  跨步软考去广告，文字可选
// @author       bestcondition
// @match        *://www.kuabu.xyz/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423871/%E8%B7%A8%E6%AD%A5%E8%BD%AF%E8%80%83plus.user.js
// @updateURL https://update.greasyfork.org/scripts/423871/%E8%B7%A8%E6%AD%A5%E8%BD%AF%E8%80%83plus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 下端广告取消
    // document.querySelectorAll("div.col-md-8>div")[5].style.display="none";
    // 侧边栏广告取消
    document.getElementsByClassName("col-md-4")[0].style.display="none";
    // 文字选择
    for(let i of document.getElementsByTagName('div')){
        i.style.setProperty('user-select','text','important');
    }
    // Your code here...
})();