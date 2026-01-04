// ==UserScript==
// @name                bilibili关闭"检测到您的页面展示可能受到浏览器插件影响"
// @name:zh-CN          bilibili关闭"检测到您的页面展示可能受到浏览器插件影响"
// @name:zh-TW          bilibili關閉"檢測到您的頁面展示可能受到瀏覽器插件影響"
// @name:zh-HK          bilibili關閉"檢測到您的頁面展示可能受到瀏覽器插件影響"
// @description         关闭烦人的 "检测到您的页面展示可能受到浏览器插件影响，建议您将当前页面加入插件白名单，以保障您的浏览体验～"
// @description:zh-CN   关闭烦人的 "检测到您的页面展示可能受到浏览器插件影响，建议您将当前页面加入插件白名单，以保障您的浏览体验～"
// @description:zh-TW   關閉煩人的 "檢測到您的頁面展示可能受到瀏覽器插件影響，建議您將當前頁面加入插件白名單，以保障您的瀏覽體驗～"
// @description:zh-HK   關閉煩人的 "檢測到您的頁面展示可能受到瀏覽器插件影響，建議您將當前頁面加入插件白名單，以保障您的瀏覽體驗～"
// @namespace           https://github.com/linkwanggo
// @version             1.0.6
// @author              linkwanggo
// @copyright           2023, linkwanggo (https://github.com/linkwanggo)
// @match               *://www.bilibili.com/*
// @exclude             *://www.bilibili.com/correspond/*
// @icon                https://www.bilibili.com//favicon.ico
// @compatible          chrome
// @compatible          firefox
// @compatible          edge
// @license             MIT
// @run-at              document-end
// @downloadURL https://update.greasyfork.org/scripts/458274/bilibili%E5%85%B3%E9%97%AD%22%E6%A3%80%E6%B5%8B%E5%88%B0%E6%82%A8%E7%9A%84%E9%A1%B5%E9%9D%A2%E5%B1%95%E7%A4%BA%E5%8F%AF%E8%83%BD%E5%8F%97%E5%88%B0%E6%B5%8F%E8%A7%88%E5%99%A8%E6%8F%92%E4%BB%B6%E5%BD%B1%E5%93%8D%22.user.js
// @updateURL https://update.greasyfork.org/scripts/458274/bilibili%E5%85%B3%E9%97%AD%22%E6%A3%80%E6%B5%8B%E5%88%B0%E6%82%A8%E7%9A%84%E9%A1%B5%E9%9D%A2%E5%B1%95%E7%A4%BA%E5%8F%AF%E8%83%BD%E5%8F%97%E5%88%B0%E6%B5%8F%E8%A7%88%E5%99%A8%E6%8F%92%E4%BB%B6%E5%BD%B1%E5%93%8D%22.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector('.adblock-tips img')?.click()
    // 如果你看到了源码，也欢迎你来用一用我的另一个脚本:
    // 在YouTube的评论、标题、简介上添加一个翻译按钮 && 直播重播聊天实时翻译
    // https://greasyfork.org/zh-CN/scripts/456108-youtube%E8%AF%84%E8%AE%BA%E7%BF%BB%E8%AF%91%E6%8C%89%E9%92%AE
})();