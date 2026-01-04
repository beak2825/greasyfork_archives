// ==UserScript==
// @name         修復中華電信自學網站中鍵開啟連結的問題
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Replace href="#" with URL from window.open in onclick attribute
// @author       You
// @match        https://elearning.cht.com.tw/chtilearn/rwd/home.jsp*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542606/%E4%BF%AE%E5%BE%A9%E4%B8%AD%E8%8F%AF%E9%9B%BB%E4%BF%A1%E8%87%AA%E5%AD%B8%E7%B6%B2%E7%AB%99%E4%B8%AD%E9%8D%B5%E9%96%8B%E5%95%9F%E9%80%A3%E7%B5%90%E7%9A%84%E5%95%8F%E9%A1%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/542606/%E4%BF%AE%E5%BE%A9%E4%B8%AD%E8%8F%AF%E9%9B%BB%E4%BF%A1%E8%87%AA%E5%AD%B8%E7%B6%B2%E7%AB%99%E4%B8%AD%E9%8D%B5%E9%96%8B%E5%95%9F%E9%80%A3%E7%B5%90%E7%9A%84%E5%95%8F%E9%A1%8C.meta.js
// ==/UserScript==

// 以下由ChatGPT-4o產生

(function() {
    'use strict';

    // 遍歷所有 <a> 標籤
    document.querySelectorAll('a').forEach(function(link) {
        // 確認 onclick 屬性存在並匹配特定格式
        if (link.getAttribute('onclick')) {
            let onclickAttr = link.getAttribute('onclick');
            let match = onclickAttr.match(/window\.open\('([^']+)'\)/);

            if (match && link.getAttribute('href') === '#') {
                // 將 href 替換成匹配到的 URL
                link.setAttribute('href', match[1]);
                // 刪除 onclick 屬性以避免重複行為
                link.removeAttribute('onclick');
            }
        }
    });
})();
