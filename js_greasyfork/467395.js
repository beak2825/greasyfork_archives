// ==UserScript==
// @name         ✨去除身份信息和暂停图标
// @namespace    https://ayouth.xyz/
// @version      1.0.1
// @description  去除身份信息和暂停图标
// @author       icy
// @match        *://m.lizhiweike.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        unsafeWindow
// @run-at       document-body
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467395/%E2%9C%A8%E5%8E%BB%E9%99%A4%E8%BA%AB%E4%BB%BD%E4%BF%A1%E6%81%AF%E5%92%8C%E6%9A%82%E5%81%9C%E5%9B%BE%E6%A0%87.user.js
// @updateURL https://update.greasyfork.org/scripts/467395/%E2%9C%A8%E5%8E%BB%E9%99%A4%E8%BA%AB%E4%BB%BD%E4%BF%A1%E6%81%AF%E5%92%8C%E6%9A%82%E5%81%9C%E5%9B%BE%E6%A0%87.meta.js
// ==/UserScript==
setInterval(()=>{
document.getElementsByClassName('VideoPlay-status')[0].style.display = 'none' 
document.getElementsByClassName('copyRightHorse')[0].style.display = 'none'
document.getElementsByClassName('copy-right-text-wraper')[0].style.display = 'none'
},5000)
