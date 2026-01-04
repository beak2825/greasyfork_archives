// ==UserScript==
// @name         自动上传word
// @namespace    http://tampermonkey.net/
// @version      2024-09-24
// @description  将Word导出的html文件直接上传到学习通简答题页面（自动处理其中图片的上传）
// @author       盧瞳
// @match        https://mooc1.chaoxing.com/mooc-ans/mooc2/work/dowork*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chaoxing.com
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_cookie
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/513496/%E8%87%AA%E5%8A%A8%E4%B8%8A%E4%BC%A0word.user.js
// @updateURL https://update.greasyfork.org/scripts/513496/%E8%87%AA%E5%8A%A8%E4%B8%8A%E4%BC%A0word.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建文件输入框用于选择 HTML 文件
    var htmlInput = document.createElement('input');
    htmlInput.type = 'file';
    htmlInput.accept = '.htm,.html';
    htmlInput.style.display = 'none';
    document.body.appendChild(htmlInput);

    // 创建文件输入框用于选择文件夹
    var folderInput = document.createElement('input');
    folderInput.type = 'file';
    folderInput.webkitdirectory = true;
    folderInput.style.display = 'none';
    document.body.appendChild(folderInput);

    // 创建按钮用于触发文件选择
    var button = document.createElement('button');
    button.textContent = '选择并上传HTML和文件夹';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.left = '10px';
    button.style.zIndex = '1000';
    button.style.padding = '10px 20px';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    button.style.fontSize = '14px';
    document.body.appendChild(button);

    button.addEventListener('click', function() {
        htmlInput.click();
    });

    htmlInput.addEventListener('change', function(event) {
        var htmlFile = event.target.files[0];
        if (htmlFile) {
            folderInput.click();
            folderInput.addEventListener('change', function(event) {
                var folderFiles = event.target.files;
                if (folderFiles.length > 0) {
                    processHtmlAndFolder(htmlFile, folderFiles);
                }
            }, { once: true });
        }
    });

    function processHtmlAndFolder(htmlFile, folderFiles) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var arrayBuffer = e.target.result;
            var decoder = new TextDecoder('gb2312'); // 根据实际文件编码选择合适的编码
            var htmlContent = decoder.decode(arrayBuffer);
            var parser = new DOMParser();
            var doc = parser.parseFromString(htmlContent, 'text/html');
            var imgTags = doc.querySelectorAll('img');
            var fileMap = {};

            // 创建文件映射
            for (var i = 0; i < folderFiles.length; i++) {
                fileMap[folderFiles[i].name] = folderFiles[i];
            }

            // 处理每个 img 标签
            imgTags.forEach(function(img) {
                var src = img.getAttribute('src');
                var fileName = src.split('/').pop();
                var file = fileMap[fileName];
                if (file) {
                    uploadFile(file, function(url) {
                        img.setAttribute('src', url);
                    });
                }
            });

            // 输出 class="WordSection1" 元素下的子节点
            setTimeout(function() {
                var wordSection = doc.querySelector('.WordSection1');
                if (wordSection) {
                    var serializer = new XMLSerializer();
                    var childNodes = Array.from(wordSection.childNodes);
                    var content = childNodes.map(function(node) {
                        return serializer.serializeToString(node);
                    }).join('');
                    // 设置 UE 编辑器的内容
                    if (typeof editor1 !== 'undefined' && editor1.setContent) {
                        editor1.setContent(content);
                    } else {
                        console.log('UE 编辑器未定义或不支持 setContent 方法');
                    }
                } else {
                    console.log('未找到 class="WordSection1" 元素');
                }
            }, 5000); // 等待所有文件上传完成
        };
        reader.readAsArrayBuffer(htmlFile);
    }

    function uploadFile(file, callback) {
        var script = document.createElement('script');
        script.textContent = `
            (function() {
                var imageUrl = window.UEDITOR_CONFIG.imageUrl;
                window.postMessage({ type: 'imageUrl', imageUrl: imageUrl }, '*');
            })();
        `;
        document.body.appendChild(script);

        window.addEventListener('message', function(event) {
            if (!event.data.type || event.data.type !== 'imageUrl') {
                return;
            }
            var imageUrl = event.data.imageUrl;
            sendRequest(file, imageUrl, callback);
        }, { once: true });
    }

    function sendRequest(file, imageUrl, callback) {
        var formData = new FormData();
        formData.append('id', 'WU_FILE_0');
        formData.append('name', file.name);
        formData.append('type', file.type);
        formData.append('lastModifiedDate', new Date(file.lastModified).toLocaleString());
        formData.append('size', file.size);
        formData.append('upfile', file, file.name);

        GM_xmlhttpRequest({
            method: "POST",
            url: imageUrl,
            headers: {
                "Accept": "*/*",
                "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
                "Accept-Encoding": "gzip, deflate, br",
                "Referer": "https://mooc1.chaoxing.com/mooc-ans/mooc2/work/dowork?courseId=244683978&classId=102231488&cpi=269570858&workId=37010836&answerId=52941463&standardEnc=8df4f1494dd0cdf7195cc232eb6bb038&enc=7b12ff38ca0abdb0519942aae4de4719",
                "Origin": "https://mooc1.chaoxing.com",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-site",
                "Cookie": document.cookie
            },
            data: formData,
            onload: function(response) {
                var responseText = response.responseText;
                var jsonResponse = JSON.parse(responseText);
                callback(jsonResponse.url);
            },
            onerror: function(error) {
                console.error("Error:", error);
            }
        });
    }
})();