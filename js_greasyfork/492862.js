// ==UserScript==
// @name         Bing creator downloads
// @namespace    http://tampermonkey.net/
// @version      2025-02-22
// @description  add a button to bing.com of image creator to download all 4 images on current page.
// @author       chibimiku
// @match        https://www.bing.com/images/create*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        none
// @require      https://s4.zstatic.net/ajax/libs/jszip/3.10.1/jszip.min.js
// @require      https://s4.zstatic.net/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/492862/Bing%20creator%20downloads.user.js
// @updateURL https://update.greasyfork.org/scripts/492862/Bing%20creator%20downloads.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
       // 创建解析文本函数
    const downloadBtnMaster = '.dspl_flx'

    function packageAndDownload() {
        //设置选择器
        const imgSelector = '#giric a:not(.linkBtn)'; //适配单张和多张图片 //241029更新适配新界面，獲取a下面的href //250222 移除多選擇的linkbtn
        const textSelector = "#sb_form_q";

        const zip = new JSZip();
        const folder = zip.folder('下载内容');

        // 提取文本内容并添加到zip
        const textContent = document.querySelector(textSelector).value;
        folder.file('content.txt', textContent);

        const images = document.querySelectorAll(imgSelector);
        const imageCount = images.length;

        // 创建进度条
        function createProgressBar(index) {
            const bar = document.createElement('progress');
            bar.max = 100;
            bar.value = 0;
            bar.id = 'progress_' + index;
            document.body.appendChild(bar);
            return bar;
        }

        // 遍历图片，处理下载及显示进度条
        const imagePromises = Array.from(images).map((img, index) => {
            //const imgSrc = img.getAttribute('src').split("?")[0]; //去掉缩略图参数
            const imgSrc = "https://th.bing.com/th/id/" + img.href.split("thId=")[1].split("&")[0];
            const progressBar = createProgressBar(index);

            return fetch(imgSrc)
                .then(response => {
                    const reader = response.body.getReader();
                    const contentLength = +response.headers.get('Content-Length');
                    let receivedLength = 0;

                    // 创建chunks数组用于保存下载的二进制部分（chunks）
                    let chunks = [];

                    return reader.read().then(function processChunk({done, value}) {
                        if (done) {
                            // 将chunks合并为单个的二进制blob
                            const blob = new Blob(chunks);
                            folder.file(`image${index}.jpg`, blob, {binary: true}); // 使用binary标记通知JSZip
                            progressBar.remove();
                            return;
                        }

                        chunks.push(value);
                        receivedLength += value.length;
                        progressBar.value = Math.ceil(receivedLength / contentLength * 100);

                        return reader.read().then(processChunk);
                    });
                })
                .catch(() => progressBar.value = 0); // 出错时将进度设为0
        });

        Promise.all(imagePromises).then(() => {
            zip.generateAsync({ type: 'blob' })
            .then(content => {
                const timestamp = Date.now();
                saveAs(content, `bing下载内容-${imageCount}-${timestamp}.zip`);
            });
        });
    }

    // 按钮和事件监听
    const myButton = document.createElement('a');
    myButton.setAttribute("class", "gil_n_btn"); //设置样式让他们和附近的按钮保持差不多的情形
    myButton.setAttribute("style", "margin-left:30px;");
    myButton.innerText = '打包下载内容';

    myButton.addEventListener('click', packageAndDownload);

    const myButtonBox = document.createElement('div');
    myButtonBox.appendChild(myButton);

    let ssbtn = document.querySelector(downloadBtnMaster);
    ssbtn.appendChild(myButtonBox);
    //document.body.appendChild(button);

})();