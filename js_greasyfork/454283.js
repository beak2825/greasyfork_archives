// ==UserScript==
// @name         telegra.ph 图片地址导出
// @namespace    https://telegra.ph
// @version      0.1
// @description  一键导出图片列表中所有URL到TXT文件，方便导入下载器批量下载
// @author       You
// @match        *://telegra.ph/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454283/telegraph%20%E5%9B%BE%E7%89%87%E5%9C%B0%E5%9D%80%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/454283/telegraph%20%E5%9B%BE%E7%89%87%E5%9C%B0%E5%9D%80%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var box = document.querySelector('header address')
    var ele = document.createElement('button')
    ele.style.marginLeft = '10px'
    ele.innerHTML = '导出图片地址'
    box.appendChild(ele)
    ele.addEventListener('click', function () {
        var imgs = document.querySelectorAll('.ql-editor img')
        var html = ''
        imgs.forEach(img => {
            html += img.src + '\n'
        })
        var blob = new Blob([html])
        var ele = document.createElement('a')
        ele.href = URL.createObjectURL(blob)
        ele.download = `${document.title}.txt`
        ele.click()
    })
})()