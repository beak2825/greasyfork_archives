// ==UserScript==
// @name         江开pdf课件下载器
// @namespace    http://xuexi.jsou.cn/
// @version      2024-05-29
// @description  为江苏开放大学pdf课件页面添加下载按钮
// @author       You
// @match        http://xuexi.jsou.cn/jxpt-web/student/activity/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jsou.cn
// @downloadURL https://update.greasyfork.org/scripts/496423/%E6%B1%9F%E5%BC%80pdf%E8%AF%BE%E4%BB%B6%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/496423/%E6%B1%9F%E5%BC%80pdf%E8%AF%BE%E4%BB%B6%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==
(function ()
 {
    'use strict';

    function download(url, filesName)
    {
        // 创建一个XMLHttpRequest对象
        var xhr = new XMLHttpRequest();

        // 设置xhr请求的responseType为blob，以获取二进制数据流
        xhr.responseType = 'blob';

        // 当xhr请求成功时执行此函数
        xhr.onload = function ()
        {
            // 获取图片的blob格式数据
            var blob = xhr.response;
            // 创建一个下载链接的标签<a>
            var downloadLink = document.createElement('a');
            // 创建一个Blob URL，并将其指定到下载链接上
            downloadLink.href = window.URL.createObjectURL(blob);
            // 文件下载时的名称
            downloadLink.download = filesName;
            // 将下载链接添加到DOM中（是隐藏的）
            downloadLink.style.display = 'none';
            document.body.appendChild(downloadLink);
            // 模拟点击下载链接来触发文件下载
            downloadLink.click();
        };

        // 执行xhr请求
        xhr.open('GET', url, true);
        xhr.send();
    }

    const tools = document.getElementsByClassName("display-head")[0];

    const downloadBotton = document.createElement("button");
    downloadBotton.innerHTML = "点我下载课件！";

    downloadBotton.onclick = () =>
    {
        const pdfView = document.getElementById("viewerIframe");
        const docSrc = pdfView.src.replace('http://zy.open.ha.cn/resource_upload/static/3rdlib/pdf.js/viewer.html#', '');
        const fileName = document.title.replace(".pdf", "");
        download(docSrc, `${fileName}.pdf`);
    };
    tools.append(downloadBotton);

    // Your code here...
})();