// ==UserScript==
// @name        自动开始磁力链下载
// @namespace   wu67
// @description 鼠标选中哈希值（散列），会自动进行相应的磁力链接下载
// @include     /^https?:*/
// @author      wu67
// @icon        http://himg.baidu.com/sys/portraitl/item/da35115e?t=1460692207
// @license     MIT
// @version     1.0.4
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/25241/%E8%87%AA%E5%8A%A8%E5%BC%80%E5%A7%8B%E7%A3%81%E5%8A%9B%E9%93%BE%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/25241/%E8%87%AA%E5%8A%A8%E5%BC%80%E5%A7%8B%E7%A3%81%E5%8A%9B%E9%93%BE%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

function generateLink() {
    let textContent = window.getSelection().toString().trim();

    if (textContent.length === 40 || textContent.length === 32) {

        if (textContent.match(/^\w{40}|\w{32}/)) {
            magnetLink = "magnet:?xt=urn:btih:" + textContent;
            // console.log(magnetLink);

            // 开始下载
            autoDownload(magnetLink);

        } else {
            // 所选字符串并非HASH串
        }

    }

}

/**
 * 接受一个链接，自动开始下载
 * 建立一个a标签并设置其href属性，建立一个鼠标点击事件，让a模拟触发
 * @param link
 */
function autoDownload(link) {

    let btnDownload = document.createElement('a'),
        clickEvent = document.createEvent("MouseEvent");

    clickEvent.initEvent("click", true, false);
    btnDownload.setAttribute("href", link);

    btnDownload.dispatchEvent(clickEvent);

}

window.addEventListener("mouseup", generateLink);
