// ==UserScript==
// @name         移除Outlook侧边广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  移除Outlook侧边广告 自用分享 长期更新
// @author       Ziu
// @match        https://outlook.live.com/mail/*
// @icon         https://gcore.jsdelivr.net/gh/ZiuChen/ZiuChen@main/avatar.jpg
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456815/%E7%A7%BB%E9%99%A4Outlook%E4%BE%A7%E8%BE%B9%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/456815/%E7%A7%BB%E9%99%A4Outlook%E4%BE%A7%E8%BE%B9%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

const selectors = ['.GssDD'] // .GssDD为侧栏广告Box的类名 动态变化
const style = document.createElement('style')
style.innerHTML = selectors.join(',') + '{ display: none !important; }'
document.body.appendChild(style)