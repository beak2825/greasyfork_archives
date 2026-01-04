// ==UserScript==
// @name         力扣屏蔽题库难度列
// @namespace    markshawn.com
// @version      0.1
// @description  屏蔽力扣题库页的难度标签列
// @author       markshawn2020
// @match        https://leetcode.cn/problemset*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leetcode.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458169/%E5%8A%9B%E6%89%A3%E5%B1%8F%E8%94%BD%E9%A2%98%E5%BA%93%E9%9A%BE%E5%BA%A6%E5%88%97.user.js
// @updateURL https://update.greasyfork.org/scripts/458169/%E5%8A%9B%E6%89%A3%E5%B1%8F%E8%94%BD%E9%A2%98%E5%BA%93%E9%9A%BE%E5%BA%A6%E5%88%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let getLevelEles = () => document.querySelectorAll("#__next > div > div.mx-auto.mt-\\[50px\\].w-full.grow.p-4.md\\:mt-0.md\\:max-w-\\[888px\\].md\\:p-6.lg\\:max-w-screen-xl > div.grid.grid-cols-4.gap-4.md\\:grid-cols-3.lg\\:grid-cols-4.lg\\:gap-6 > div.col-span-4.z-base.md\\:col-span-2.lg\\:col-span-3 > div:nth-child(7) > div.-mx-4.md\\:mx-0 > div > div > div > div > div:nth-child(5)");
    let check = setTimeout(() => {
        let levelEles = getLevelEles();
        console.log(`checking level eles: ${levelEles.length ? "OK" : "FAILED"}`);
        if(levelEles.length) for(let e of levelEles) e.style.display = "none";
        else check();
    }, 100);

    check();

})();