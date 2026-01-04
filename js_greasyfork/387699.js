// ==UserScript==
// @name         Lore Free 书籍上传助手
// @description  允许用户在 Lore Free 上传页面手动粘贴豆瓣链接；豆瓣书籍搜索页面增加复制链接按钮
// @author       Exuanbo
// @version      0.1
// @icon         https://ebook.lorefree.com/favicon.ico
// @match        https://ebook.lorefree.com/upload
// @match        https://book.douban.com/subject_search*
// @grant        none
// @namespace    Exuanbo
// @downloadURL https://update.greasyfork.org/scripts/387699/Lore%20Free%20%E4%B9%A6%E7%B1%8D%E4%B8%8A%E4%BC%A0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/387699/Lore%20Free%20%E4%B9%A6%E7%B1%8D%E4%B8%8A%E4%BC%A0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    if (/lorefree.com/.test(location.host)) {
        const urlForm = document.getElementById('url');
        urlForm.placeholder = '请点击之后使用键盘快捷键粘贴链接'

        urlForm.addEventListener('paste', (e) => {
            e.preventDefault()
            let dbUrl = e.clipboardData.getData('text/plain').match(/https\:\/\/book\.douban\.com\/subject\/(\d+)\//);
            if (dbUrl !== null) {
            copyLink(dbUrl[1])
            }
        })
    }

    if (/douban.com/.test(location.host)) {
        const titles = document.getElementsByClassName('title');
        const titleTexts = document.getElementsByClassName('title-text');

        for (let i = 0; i < 16; i ++) {
            let btnDiv = document.createElement('div');
            let btn = document.createElement('button');
            btn.appendChild(document.createTextNode('复制url'))

            let copyHelper = document.createElement('span');
            copyHelper.appendChild(document.createTextNode('复制成功！'))
            copyHelper.style = 'display:none'

            btnDiv.appendChild(btn)
            btnDiv.appendChild(copyHelper)
            titles[i].appendChild(btnDiv)

            let url = titleTexts[i].href;
            btn.onclick = () => {
                let dbidText = document.createElement('input');
                document.body.appendChild(dbidText)
                dbidText.value = url
                dbidText.select()
                document.execCommand('copy')
                document.body.removeChild(dbidText)
                copyHelper.style = 'display:block'
            }
        }
    }
})()