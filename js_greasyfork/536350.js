// ==UserScript==
// @name         洛谷杂交兼容
// @namespace    http://tampermonkey.net/
// @version      v0.0.2
// @description  用于修复洛谷插件杂交后的神秘显示 bug
// @run-at       document_end
// @author       xk2013
// @license      MIT
// @match        https://www.luogu.com.cn/problem/*
// @match        https://www.luogu.com/problem/*
// @icon         https://www.luogu.com.cn/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536350/%E6%B4%9B%E8%B0%B7%E6%9D%82%E4%BA%A4%E5%85%BC%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/536350/%E6%B4%9B%E8%B0%B7%E6%9D%82%E4%BA%A4%E5%85%BC%E5%AE%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let element = document.getElementsByClassName("lfe-marked-wrap");

    for (let v of element)
    {
        let childs = v.childNodes;
        let parent = v.parentElement;
        console.log("Got Parent: ", parent);

        for (let c of childs)
        {
            parent.replaceChild(c, v);
        }
    }
})();