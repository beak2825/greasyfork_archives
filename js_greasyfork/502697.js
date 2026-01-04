// ==UserScript==
// @name         第一会所另存文本
// @namespace    http://tampermonkey.net/
// @version      2024-08-06
// @description  在右上角添加一个连接另存文本
// @author       undefined
// @match        *://sis001.com/forum/thread-*.html
// @match        *://sis001.com/forum/viewthread.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sis001.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502697/%E7%AC%AC%E4%B8%80%E4%BC%9A%E6%89%80%E5%8F%A6%E5%AD%98%E6%96%87%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/502697/%E7%AC%AC%E4%B8%80%E4%BC%9A%E6%89%80%E5%8F%A6%E5%AD%98%E6%96%87%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function downloadTxt() {
        const {content, fileName} = getContent()
        let link = document.createElement('a');
        const blob = new Blob([content], { type: 'text/plain' });
        link.href = URL.createObjectURL(blob);
        if (!fileName) {
            fileName = document.title + '.txt';
        }
        link.download = fileName
        document.body.prepend(link);
        link.innerText = "下载页面";
        link.display = "flex";
        link.style.float = "right";
        link.style.position = "fixed";
        link.style.zIndex = 9999;
        link.style.color = "red";
        link.style.flex = 1;
    }

    function getContent() {
        let content = '';
        let postAuthor = "";

        const box = document.querySelectorAll("div.mainbox.viewthread");
        for (let i = 0; i<box.length; i++) {
            const level = box[i]
            const author = level.querySelector("td.postauthor>cite>a").textContent
            if(0 === i) {
                postAuthor = author
            }
            if (author !== postAuthor) {
                break
            }
            level.querySelectorAll(".t_msgfont.noSelect").forEach(e=>{
                content += e.innerText
            })

        }


        content = content.replace(/\n(?=[^\s])/g, '');
        let fileName
        try {
            fileName = getTextWithoutChildren(document.querySelector("#wrapper > div:nth-child(1) > form h1")).replace(/\s/g,'')
        } catch(e) {

        }
        if (!fileName) {
            fileName = document.title
        }
        fileName += '.txt'
        return {content,fileName}
    }

    function getTextWithoutChildren(element) {
        let childNodes = element.childNodes;
        let text = '';

        for (let i = 0; i < childNodes.length; i++) {
            let node = childNodes[i];
            if (node.nodeType === Node.TEXT_NODE) {
                text += node.nodeValue;
            }
        }

        return text.trim();
    }

    window.addEventListener('load',downloadTxt)

    // Your code here...
})();