// ==UserScript==
// @name         bt之家附件下载
// @namespace    https://greasyfork.org/zh-CN/scripts/433576
// @version      0.1
// @description  该脚本可以一键批量下载bt之家的附件。
// @author       木羊羽
// @include      *://*btbtt*.com/*
// @icon         https://www.google.com/s2/favicons?domain=btbtt13.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/433576/bt%E4%B9%8B%E5%AE%B6%E9%99%84%E4%BB%B6%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/433576/bt%E4%B9%8B%E5%AE%B6%E9%99%84%E4%BB%B6%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

// 更新日志
// v0.1 脚本建立

(function () {

    let bolds = document.querySelectorAll('.bold');
    let i = bolds.length;
    while (i) {
        let download_button = document.createElement('button');
        download_button.textContent = ' 下载所有附件';
        download_button.style.color = '#fff';
        download_button.style.backgroundColor = '#3280fc';
        download_button.style.padding = 'inherit';
        download_button.style.fontSize = 'inherit';
        download_button.style.lineHeight = '1.53846154';
        download_button.style.textAlign = 'center';
        download_button.style.verticalAlign = 'Middle';
        download_button.style.border = '1px solid transparent';
        download_button.style.border = '1px solid transparent';
        download_button.style.borderRadius = '4px';
        download_button.style.marginLeft = '5px';
        download_button.style.cursor = 'pointer';
        download_button.className = 'download_button_' + i;
        let bold = bolds[i - 1];
        if (bold.className === 'bold') {
            bold.appendChild(download_button);
            document.querySelector(('.download_button_' + i)).onclick = download;
        }
        i -= 1
    }

    function download() {
        let href_list = []
        let i = this.parentNode.parentNode.parentNode.children.length
        while (i) {
            let a = this.parentNode.parentNode.parentNode.children[i - 2].children[0].children[0]
            let href = a.href
            let file_name = a.text

            if (href !== undefined) {
                href = href.replace('dialog', 'download')
                href_list.push(href)
                console.log(href)
                window.open(href)
            }
            i -= 2
        }
    }

})()