// ==UserScript==
// @name OPPOSans
// @namespace OPPOSans
// @version  1
// @description 在网页中使用OPPOSans
// @author LWF
// @license MIT
// @grant none
// @match *://*/*
// @exclude *://fanqienovel.com/reader/*
// @exclude *://*.android.google.cn/*
// @exclude *://ai.qaqgpt.com/*
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/512206/OPPOSans.user.js
// @updateURL https://update.greasyfork.org/scripts/512206/OPPOSans.meta.js
// ==/UserScript==

(function() {
    // 创建一个 <style> 元素
    const css = document.createElement('style');
    
    // 为 <style> 元素设置 CSS 内容，导入外部字体，并强制所有元素使用 OPPOSans 字体
    css.innerHTML = "@import url('https://www.oppo.com/etc.clientlibs/global-site/clientlibs/ui.frontend/clientlib-font-cn.min.6c9808838585702dbf33c24fc6ca0b48.css');*{font-family:OPPOSans-Medium!important;}";
    
    // 将 <style> 元素添加到页面的 <head> 部分
    document.head.appendChild(css);
})();