// ==UserScript==
// @name         李想主义的原来题目
// @namespace   https://github.com/mefengl
// @version      1.0
// @description  看理想你坏事做尽，画蛇添足另起什么标题
// @author       mefengl
// @match        https://mp.weixin.qq.com/s?__biz=MzA3MDM3NjE5NQ==*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mp.weixin.qq.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450436/%E6%9D%8E%E6%83%B3%E4%B8%BB%E4%B9%89%E7%9A%84%E5%8E%9F%E6%9D%A5%E9%A2%98%E7%9B%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/450436/%E6%9D%8E%E6%83%B3%E4%B8%BB%E4%B9%89%E7%9A%84%E5%8E%9F%E6%9D%A5%E9%A2%98%E7%9B%AE.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    await new Promise(r => setTimeout(r, 100));
    const section_and_p = [];
    section_and_p.push(...document.body.getElementsByTagName('section'))
    section_and_p.push(...document.body.getElementsByTagName('p'))

    for (let i = section_and_p.length-1; i>=0; --i) {
        const text_i_want = section_and_p[i].innerText;
        if(/本文原.*?《(.*?)》/.test(text_i_want)){
            const title_i_want = /本文原.*?《(.*?)》/.exec(text_i_want)[1];
                // 修复文章标题
            document.getElementsByTagName('h1')[0].innerText = title_i_want
            // 修复浏览器标题，有些奇怪的脚本会恢复标题，所以重复设置
            setInterval(()=>{document.title = title_i_want},200)
            break;
        }
    }

})();