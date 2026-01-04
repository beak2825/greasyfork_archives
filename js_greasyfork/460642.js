// ==UserScript==
// @name         Jinxin Util Button
// @namespace    https://gitee.com/jinxin11112/tampermonkey
// @version      0.1.2
// @description  界面按钮工具类
// @author       jinxin
// @icon         https://picss.sunbangyan.cn/2024/02/11/a19cea286d366718e1358c1060c7c04e.jpeg
// @grant        none
// @license MIT
// ==/UserScript==

let fontAwesome = document.createElement('link');
fontAwesome.type = 'text/css';
fontAwesome.rel = 'stylesheet';
fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
document.head.appendChild(fontAwesome);

function addDownloadButton(buttonFun) {
    let button = document.createElement('i');
    let icon = document.createElement('i');
    icon.className = 'fa-solid fa-download';
    button.appendChild(icon)
    button.title = '下载';
    // noinspection JSValidateTypes
    button.style = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            display: flex;
            flex-direction: column;
            align-items: end;
            z-index: 999;
            cursor:pointer;
        `;
    button.addEventListener('click', buttonFun);
    (document.body || document.documentElement).appendChild(button);
}
