// ==UserScript==
// @name         菜鸟工具Markdown编辑器 制作长图专用 支持自定义长图CSS
// @namespace    https://no5972.moe/
// @version      0.1
// @description  菜鸟工具Markdown编辑器 制作长图专用 支持自定义长图CSS（暂时只支持从源码编辑CSS）
// @author       You
// @match        https://c.runoob.com/front-end/712/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=runoob.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478308/%E8%8F%9C%E9%B8%9F%E5%B7%A5%E5%85%B7Markdown%E7%BC%96%E8%BE%91%E5%99%A8%20%E5%88%B6%E4%BD%9C%E9%95%BF%E5%9B%BE%E4%B8%93%E7%94%A8%20%E6%94%AF%E6%8C%81%E8%87%AA%E5%AE%9A%E4%B9%89%E9%95%BF%E5%9B%BECSS.user.js
// @updateURL https://update.greasyfork.org/scripts/478308/%E8%8F%9C%E9%B8%9F%E5%B7%A5%E5%85%B7Markdown%E7%BC%96%E8%BE%91%E5%99%A8%20%E5%88%B6%E4%BD%9C%E9%95%BF%E5%9B%BE%E4%B8%93%E7%94%A8%20%E6%94%AF%E6%8C%81%E8%87%AA%E5%AE%9A%E4%B9%89%E9%95%BF%E5%9B%BECSS.meta.js
// ==/UserScript==

const styleContent =
`
    /* 在此放置自定义CSS样式，可参考Typora等软件的 */
    body { background-color: #e8f6f3; color: #333; margin: 0; margin-inline: 0; padding: 50px; }
`;

function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

function downloadFile(url,name){
    var a = document.createElement("a") //新建一个a链接
    a.setAttribute("href",url) // a链接的url为图片的url
    a.setAttribute("download",name)
    a.setAttribute("target","_blank")
    let clickEvent = document.createEvent("MouseEvents");
    clickEvent.initEvent("click", true, true);
    a.dispatchEvent(clickEvent);
}

// 73so.com
function downloadFileByBase64(base64,name){
    var myBlob = dataURLtoBlob(base64);
    var myUrl = URL.createObjectURL(myBlob); //创建图片的临时url
    downloadFile(myUrl,name)
}

(function() {
    'use strict';
    const styleSheet = document.createElement('style');

    // 8:4 布局
    document.querySelectorAll(".col-md-6")[0].classList.replace('col-md-6', 'col-md-8');
    document.querySelectorAll(".col-md-6")[0].classList.replace('col-md-6', 'col-md-4');

    // 输入内容高度自适应
    document.querySelectorAll('.CodeMirror')[0].style.height = 'max-content';

    document.querySelectorAll(".CodeMirror-code")[0].addEventListener('DOMSubtreeModified', function () {
        // 输出内容高度自适应
        document.querySelectorAll('#iframeResult')[0].style.height = document.querySelectorAll('#iframeResult')[0].contentWindow.document.body.scrollHeight + "px";

        // 设置自定义样式
        document.querySelectorAll('#iframeResult')[0].contentWindow.document.head.textContent = "";
        document.querySelectorAll('#iframeResult')[0].contentWindow.document.head.appendChild(styleSheet);
        styleSheet.textContent = styleContent;
    });

    // 添加导出功能
    document.querySelectorAll('.form-inline')[1].innerHTML += `<button type="button" class="btn btn-outline-success ml-1" data-toggle="0" data-target="#myModal">导出图片</button>`;
    var snapshotJS = document.createElement("script")
    snapshotJS.src = "https://cdn.bootcdn.net/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
    document.head.appendChild(snapshotJS);
    document.querySelectorAll('.btn-outline-success')[0].onclick = function () {
        console.log('开始导出');
        console.log(html2canvas);
        html2canvas(document.querySelectorAll('#iframeResult')[0].contentWindow.document.body).then(function(canvas) {
            // console.log(canvas.toDataURL());
            var name = new Date().getTime(); //自定义图片名称
            downloadFileByBase64(canvas.toDataURL(), name);
        });
    };
    // Your code here...
})();