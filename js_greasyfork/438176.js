// ==UserScript==
// @name         学在浙大PDF下载器
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  帮助下载学在浙大上一些没有开放下载的PDF文件
// @author       AnCoSONG
// @match        https://courses.zju.edu.cn/*
// @icon         https://www.google.com/s2/favicons?domain=zju.edu.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438176/%E5%AD%A6%E5%9C%A8%E6%B5%99%E5%A4%A7PDF%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/438176/%E5%AD%A6%E5%9C%A8%E6%B5%99%E5%A4%A7PDF%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function main() {
        // console.log(window.parent.document.body)
        var globalDocument = window.parent.document
        var pdfViewer = globalDocument.querySelector('#pdf-viewer')
        function downloadURL(url){
            var aEle = globalDocument.createElement('a')
            aEle.href = url
            globalDocument.body.append(aEle)
            aEle.click()
        }
        if (pdfViewer) {
            console.log('已检测到PDF Viewer')
            var src = pdfViewer.getAttribute('src')
            if (!src) {
                console.log('no src, skip')
                return
            }
            var url = decodeURIComponent(src.substr(src.indexOf('http')))
            var header = globalDocument.querySelector('.header.clearfix')
            if (header) {
                console.log('内页展示')
                var closeBtn = globalDocument.querySelectorAll('.right.close')[1]
                var aEle = globalDocument.createElement('a')
                aEle.style.position = 'absolute'
                aEle.style.top = '14px'
                aEle.style.right = '60px'
                aEle.href = url
                var iEle = globalDocument.createElement('i')
                iEle.className = 'font font-download'
                aEle.appendChild(iEle)
                header.insertBefore(aEle, closeBtn)
            } else {
                if (confirm('Do you want to download this file?')) {
                    downloadURL(url)
                }
            }
        } else {
            console.log('未检测到PDF-Viewer')
        }
    }
    if (document.readyState === 'loading') {
        console.log('loading')
        document.addEventListener('DOMContentLoaded', main)
    } else {
        console.log('ready')
        main()
    }
    /*
    window.onload = function () {
        setTimeout(main, 1500)

    }
    */
    // Your code here...
})();