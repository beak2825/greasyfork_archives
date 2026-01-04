// ==UserScript==
// @name         Batch export answers By Chaoxing
// @namespace    https://github.com/realloon/GreasyScripts
// @version      0.1
// @description  Export all the answers on the Chaoxing homework page as a txt file.
// @author       realloon
// @match        *://mooc1.chaoxing.com/mooc2/work/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chaoxing.com
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467984/Batch%20export%20answers%20By%20Chaoxing.user.js
// @updateURL https://update.greasyfork.org/scripts/467984/Batch%20export%20answers%20By%20Chaoxing.meta.js
// ==/UserScript==

(() => {
    'use strict';

    // Your code here...
    function saveFile(fileName = 'example.txt', fileContent = 'Hello, world') {
        // 创建一个 Blob 对象
        const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });

        // 创建一个下载链接
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;

        // 模拟点击下载链接实现将文件保存到本地
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function processContent(content) {
        content = content && String(content.substr(1))
        content = content ? '\n' + content : ''
        return content
    }

    GM_registerMenuCommand("导出全部答案", ()=>{
        const markKey = document.querySelectorAll('.mark_key.clearfix')

        const answer = Array.from(markKey).map((mark, index) => {
            const [optionEl, contentEl] = mark.querySelectorAll(
                '.colorGreen.marginRight40'
            )

            const option = optionEl.innerText
            const content = processContent(contentEl && contentEl.innerText)

            return `${index + 1}. ${option}${content}\n`
        })

        const markTitleEl = document.querySelector('.mark_title')
        const markTitle = markTitleEl.innerText

        saveFile(markTitle, answer.join(''))
    })
})();