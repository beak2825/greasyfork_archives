// ==UserScript==
// @name         去除文心一言水印
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  文心一言一键去除水印
// @author       Div
// @match        https://yiyan.baidu.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/462067/%E5%8E%BB%E9%99%A4%E6%96%87%E5%BF%83%E4%B8%80%E8%A8%80%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/462067/%E5%8E%BB%E9%99%A4%E6%96%87%E5%BF%83%E4%B8%80%E8%A8%80%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

'use strict';
// 创建div
const createDiv = ({ style, html, id }) => {
    let div = document.createElement("div");
    for (const key in style) {
        div.style[key] = style[key];
    }
    div.innerHTML = html;
    div.id = id;
    document.body.appendChild(div);
};
unsafeWindow.noWatermark = () => {
    let list = document.querySelector('#eb-watermark').shadowRoot.querySelectorAll('div');
    for (let i = 0; i < list.length; i++) {
        const item = list[i];
        item.style.opacity = 0.00
    }
}
createDiv({
    id: "noWatermark",
    style: {
        position: "fixed",
        bottom: "52px",
        right: "-5px",
        backgroundColor: "#eceff5",
        border: "1px solid #94a3c4",
        padding: "8px",
        borderRadius: "8px",
    },
    html: '<a style="font-weight:bold;color:#333333" href="JavaScript:noWatermark()">去除水印</a><img id="spidering_loading" src="https://media.tenor.com/wpSo-8CrXqUAAAAi/loading-loading-forever.gif" style="width:20px;height:20px;margin-left:2px;display: none"/>',
});