// ==UserScript==
// @name         自动搜索微软积分-国内外通用
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  自用微软积分搜索脚本，国际版与国内版通用
// @author       青鸟丹心
// @match        https://*.bing.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/461802/%E8%87%AA%E5%8A%A8%E6%90%9C%E7%B4%A2%E5%BE%AE%E8%BD%AF%E7%A7%AF%E5%88%86-%E5%9B%BD%E5%86%85%E5%A4%96%E9%80%9A%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/461802/%E8%87%AA%E5%8A%A8%E6%90%9C%E7%B4%A2%E5%BE%AE%E8%BD%AF%E7%A7%AF%E5%88%86-%E5%9B%BD%E5%86%85%E5%A4%96%E9%80%9A%E7%94%A8.meta.js
// ==/UserScript==

const searchUrl = 'https://www.bing.com/search';
const isDesktop = window.matchMedia("(min-width: 768px)").matches;

// Check if the current URL is bing.com or cn.bing.com
if (window.location.hostname.endsWith('.bing.com')) {
    // If it is, execute the random search every 2000 milliseconds (2 seconds)
    const loopCount = isDesktop ? 50 : 30; // 根据设备类型设置循环次数
    let count = GM_getValue('searchCount', 0); // 从存储器中获取计数器初始值
    const intervalId = setInterval(function() {
        if (count >= loopCount) {
            clearInterval(intervalId); // 停止循环
            GM_deleteValue('searchCount'); // 删除计数器的值
            window.close(); // 关闭 Bing 页面
            return;
        }
        // Generate a random search query
        const search = generateRandomSearch();

        // Enter the search query into the Bing search bar
        const searchBox = document.getElementById('sb_form_q');
        searchBox.value = search;
        searchBox.dispatchEvent(new Event('input')); // 触发输入框的输入事件，以便提交表单

        // Submit the search
        const searchForm = document.getElementById('sb_form');
        searchForm.submit();

        // Increment the counter and update the value in storage
        count++;
        GM_setValue('searchCount', count);
    }, 2000);
}

function generateRandomSearch() {
    let search = '';
    // Generate a random string of 4 digits and 1 letter
    for (let i = 0; i < 4; i++) {
        search += Math.floor(Math.random() * 10);
    }
    search += String.fromCharCode(Math.floor(Math.random() * 26) + 65);
    return search;
}
