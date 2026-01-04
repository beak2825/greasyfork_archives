// ==UserScript==
// @name         稿定图片去水印保存
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  稿定工作台图片下载
// @author       去水印无痕大师
// @match        https://*.818ps.com/*
// @match        https://*.eqxiu.com/*
// @match        https://*.chuangkit.com/*
// @match        https://bigesj.com/*
// @match        https://*.gaoding.com/*
// @match        https://*.focodesign.com/*
// @match        https://www.isheji.com/*
// @match        https://www.logosc.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=focodesign.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/479963/%E7%A8%BF%E5%AE%9A%E5%9B%BE%E7%89%87%E5%8E%BB%E6%B0%B4%E5%8D%B0%E4%BF%9D%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/479963/%E7%A8%BF%E5%AE%9A%E5%9B%BE%E7%89%87%E5%8E%BB%E6%B0%B4%E5%8D%B0%E4%BF%9D%E5%AD%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function downloadImg() {
        alert('脚本已经去不了水印了，我目前也解决不了这个问题，感谢您的使用，谢谢！')
    }

    function addTool() {
        const button = document.createElement('button')
        button.style.position = 'absolute'
        button.style.zIndex = '999'
        button.style.top = '0px'
        button.style.left = '100px'
        button.style.width = '100px'
        button.style.height = '32px'
        button.style.fontSize = '16px'
        button.style.background = '#FFC107'
        button.innerText = '已失效了'
        document.body.append(button)
        button.onclick = downloadImg
    }
    addTool()
    // Your code here...
})();