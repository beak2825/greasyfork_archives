// ==UserScript==
// @license      MIT
// @name         EM手稿状态助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  一键获取您提交在Editor Manager系统中的论文手稿的状态！
// @author       You
// @match        https://www.editorialmanager.com/cviu/*
// @icon         https://www.editorialmanager.com/v17.0/webresources/em_navbar_logo.png?r=23.05
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467126/EM%E6%89%8B%E7%A8%BF%E7%8A%B6%E6%80%81%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/467126/EM%E6%89%8B%E7%A8%BF%E7%8A%B6%E6%80%81%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    // 创建<link>元素
    var linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css';
    linkElement.integrity = 'sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w==';
    linkElement.crossOrigin = 'anonymous';

    // 将<link>元素添加到<head>元素中
    document.head.appendChild(linkElement);


    var btnStyleTag = document.createElement('link');
    btnStyleTag.href = 'https://cdn.jsdelivr.net/gh/Jen-Jon/CDN_Bank/srcs/buttonsstyle.css';
    btnStyleTag.rel = 'stylesheet';

    document.head.appendChild(btnStyleTag);

    // 创建父容器元素
    var parentDiv = document.createElement('div');
    parentDiv.className = 'CornerButtons';
    parentDiv.style.display = 'flex';

    // 创建子容器元素
    var childDiv = document.createElement('div');
    childDiv.className = 'CornerAnimayedFlex';

    // 创建按钮元素
    var buttonDiv = document.createElement('div');
    buttonDiv.className = 'CornerButton';
    buttonDiv.title = 'GET MANUSCRIPT INFO';

    // 创建按钮ICON
    var btnIconDiv = document.createElement('div');
    btnIconDiv.className = 'cba fas fa-hand-middle-finger';
    btnIconDiv.title = 'Button Icon';

    // 将ICON添加
    buttonDiv.appendChild(btnIconDiv);

    // 将按钮元素添加到子容器元素中
    childDiv.appendChild(buttonDiv);

    // 将子容器元素添加到父容器元素中
    parentDiv.appendChild(childDiv);


    // 添加按钮到页面
    document.body.appendChild(parentDiv);
    parentDiv.addEventListener('click', get_manuscript_info);
})();

function get_manuscript_info() {
    fetch('https://www.editorialmanager.com/cviu/auth_pendSubmissions.asp?currentpage=1')
    .then(res => res.text())
    .then(data => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');
        const theads = Array.from(doc.querySelectorAll('#datatable > thead > tr > th')).map(thead => thead.textContent).slice(1);
        const trows = Array.from(doc.querySelectorAll('#row1 > td')).map(trow => trow.textContent).slice(1);
        const len = theads.length;
        let message = '===* 手稿最新进展 *===\n\n';
        for (let idx = 0; idx < len; idx++) {
            message += theads[idx] + ': ' + trows[idx] + '\n';
        }
        alert(message);
    })
    .catch(error => {
        console.error(error);
    });
}