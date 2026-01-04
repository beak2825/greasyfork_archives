// ==UserScript==
// @name         打印网页标题和链接的md格式
// @namespace 	 czzonet
// @version      1.2.7
// @description  在控制台打印网页标题打印网页标题和链接的md格式
// @author       czzonet
// @include      *://*
// @exclude      *://*.eggvod.cn/*
// @connect      *
// @license      MIT License
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/411474/%E6%89%93%E5%8D%B0%E7%BD%91%E9%A1%B5%E6%A0%87%E9%A2%98%E5%92%8C%E9%93%BE%E6%8E%A5%E7%9A%84md%E6%A0%BC%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/411474/%E6%89%93%E5%8D%B0%E7%BD%91%E9%A1%B5%E6%A0%87%E9%A2%98%E5%92%8C%E9%93%BE%E6%8E%A5%E7%9A%84md%E6%A0%BC%E5%BC%8F.meta.js
// ==/UserScript==

/* 等待页面加载 */
// document.onreadystatechange = function (){
//     if(document.readyState == 'complete'){
//         console.log('['+document.title+']('+document.URL+')')
//     }
// }

// window.addEventListener('DOMContentLoaded',function (event)  {
//     console.log('DOM fully loaded and parsed');
// });
 console.log('['+document.title+']('+document.URL+')')