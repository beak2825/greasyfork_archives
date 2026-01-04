// ==UserScript==
// @name         阻止“红警之家”被拦截 红警之家 修复 正常使用
// @namespace    http://tampermonkey.net/
// @version      2024-03-26
// @description  阻止“红警之家”被拦截 红警之家 修复 正常使用 123
// @author       神紫
// @match        *://www.uc129.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490897/%E9%98%BB%E6%AD%A2%E2%80%9C%E7%BA%A2%E8%AD%A6%E4%B9%8B%E5%AE%B6%E2%80%9D%E8%A2%AB%E6%8B%A6%E6%88%AA%20%E7%BA%A2%E8%AD%A6%E4%B9%8B%E5%AE%B6%20%E4%BF%AE%E5%A4%8D%20%E6%AD%A3%E5%B8%B8%E4%BD%BF%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/490897/%E9%98%BB%E6%AD%A2%E2%80%9C%E7%BA%A2%E8%AD%A6%E4%B9%8B%E5%AE%B6%E2%80%9D%E8%A2%AB%E6%8B%A6%E6%88%AA%20%E7%BA%A2%E8%AD%A6%E4%B9%8B%E5%AE%B6%20%E4%BF%AE%E5%A4%8D%20%E6%AD%A3%E5%B8%B8%E4%BD%BF%E7%94%A8.meta.js
// ==/UserScript==

try {
    document.getElementById("ba_b").remove()
} catch {
}
try {
    document.getElementById("ba").remove()
} catch {
}
document.body.style.overflow = null
