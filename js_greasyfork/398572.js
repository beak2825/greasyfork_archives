// ==UserScript==
// @name         精简必应搜索(Bing)的右侧边栏，只保留「相关搜索」和「相关英文搜索」
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  精简必应搜索(Bing)的右侧边栏
// @author       prettykernel
// @match        https://cn.bing.com/search?q=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398572/%E7%B2%BE%E7%AE%80%E5%BF%85%E5%BA%94%E6%90%9C%E7%B4%A2%28Bing%29%E7%9A%84%E5%8F%B3%E4%BE%A7%E8%BE%B9%E6%A0%8F%EF%BC%8C%E5%8F%AA%E4%BF%9D%E7%95%99%E3%80%8C%E7%9B%B8%E5%85%B3%E6%90%9C%E7%B4%A2%E3%80%8D%E5%92%8C%E3%80%8C%E7%9B%B8%E5%85%B3%E8%8B%B1%E6%96%87%E6%90%9C%E7%B4%A2%E3%80%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/398572/%E7%B2%BE%E7%AE%80%E5%BF%85%E5%BA%94%E6%90%9C%E7%B4%A2%28Bing%29%E7%9A%84%E5%8F%B3%E4%BE%A7%E8%BE%B9%E6%A0%8F%EF%BC%8C%E5%8F%AA%E4%BF%9D%E7%95%99%E3%80%8C%E7%9B%B8%E5%85%B3%E6%90%9C%E7%B4%A2%E3%80%8D%E5%92%8C%E3%80%8C%E7%9B%B8%E5%85%B3%E8%8B%B1%E6%96%87%E6%90%9C%E7%B4%A2%E3%80%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    for (const e of document.querySelectorAll('.b_ans')) {
        const textContent = e.getElementsByTagName('h2')[0] && String(e.getElementsByTagName('h2')[0].textContent)
        if (textContent !== '相关搜索' && textContent !== '相关英文搜索') {
            e.remove()
        }
    }
})();