// ==UserScript==
// @name         萌娘百科黑幕转粉幕,删除线变下划线（改）
// @namespace    https://zhiyoon.cn
// @author       qrqhuang
// @version      0.4
// @description  萌娘百科黑幕转粉幕,删除线变下划线
// @license      MIT
// @match        http*://zh.moegirl.org/*
// @match        http*://mzh.moegirl.org/*
// @match        http*://zh.moegirl.org.cn/*
// @match        http*://mzh.moegirl.org.cn/*
// @note         2022-05-09 0.4 修复彩色幕处理失效问题
// @note         2021-04-07 0.3 追加彩色幕及文字模糊检测
// @note         2020-10-02 0.2 移除jquery依赖 + 适配'.org.cn' 国内站点
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/412336/%E8%90%8C%E5%A8%98%E7%99%BE%E7%A7%91%E9%BB%91%E5%B9%95%E8%BD%AC%E7%B2%89%E5%B9%95%2C%E5%88%A0%E9%99%A4%E7%BA%BF%E5%8F%98%E4%B8%8B%E5%88%92%E7%BA%BF%EF%BC%88%E6%94%B9%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/412336/%E8%90%8C%E5%A8%98%E7%99%BE%E7%A7%91%E9%BB%91%E5%B9%95%E8%BD%AC%E7%B2%89%E5%B9%95%2C%E5%88%A0%E9%99%A4%E7%BA%BF%E5%8F%98%E4%B8%8B%E5%88%92%E7%BA%BF%EF%BC%88%E6%94%B9%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    const pinkColor = '#ff99ff';
  
    //替换<s>标签效果为下划线
    GM_addStyle('s {text-decoration: underline}');

    document.querySelectorAll('.heimu').forEach(e => e.style.backgroundColor = pinkColor);
    document.querySelectorAll('.heimu a').forEach(e => e.style.backgroundColor = pinkColor);
    document.querySelectorAll('a .heimu').forEach(e => e.style.backgroundColor = pinkColor);
    document.querySelectorAll('del').forEach(e => e.style.textDecoration = 'underline');
    //彩色幕
    document.querySelectorAll(".colormu").forEach(e => {
        e.classList.remove('colormu', 'colormu-bri');
        e.style.color = ''; 
        e.style.backgroundColor = pinkColor; 
    });
    //文字模糊
    document.querySelectorAll("[style*='text-shadow:grey']").forEach(e => {
        e.style.color = ''; 
        e.style.textShadow = ''; 
        e.style.backgroundColor = pinkColor; 
    });
})();