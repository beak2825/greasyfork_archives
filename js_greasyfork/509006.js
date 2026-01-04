// ==UserScript==
// @name 鸿蒙字体
// @namespace 鸿蒙字体
// @version  2.0
// @description 在网页中使用华为鸿蒙字体
// @author LWF
// @license MIT
// @grant none
// @match *://*/*
// @exclude *://fanqienovel.com/reader/*
// @exclude *://*.android.google.cn/*
// @exclude *://www.bilibili.com/*
// @exclude *://search.bilibili.com/*
// @exclude *://account.bilibili.com/*
// @exclude *://developer.huawei.com/*
// @exclude *://ai.qaqgpt.com/*
// @exclude *://zifh.com/*
// @exclude *://m3.material.io/*
// @exclude *://www.mdui.org/*
// @exclude *://blog.xiaoqianlan.com/*
// @icon https://article.biliimg.com/bfs/new_dyn/629e3eaa7c24411035bbd9e055f376883461567821646211.jpg
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/509006/%E9%B8%BF%E8%92%99%E5%AD%97%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/509006/%E9%B8%BF%E8%92%99%E5%AD%97%E4%BD%93.meta.js
// ==/UserScript==

(function() {
    // 创建一个 <style> 元素
    const css = document.createElement('style');
    
    // 为 <style> 元素设置 CSS 内容，导入外部字体，并强制所有元素使用 HarmonyOS_Medium 字体
    css.innerHTML = "@import url('https://s1.hdslb.com/bfs/static/jinkela/long/font/regular.css');*{font-family:HarmonyOS_Regular!important;}";
    
    // 将 <style> 元素添加到页面的 <head> 部分
    document.head.appendChild(css);
})();