// ==UserScript==
// @name         NodeSeek自动上传兰空图床并插入md链接
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在nodeseek.com的论坛中自动上传图片到图床并插入Markdown链接
// @author       我和GPT
// @match        https://www.nodeseek.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/487398/NodeSeek%E8%87%AA%E5%8A%A8%E4%B8%8A%E4%BC%A0%E5%85%B0%E7%A9%BA%E5%9B%BE%E5%BA%8A%E5%B9%B6%E6%8F%92%E5%85%A5md%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/487398/NodeSeek%E8%87%AA%E5%8A%A8%E4%B8%8A%E4%BC%A0%E5%85%B0%E7%A9%BA%E5%9B%BE%E5%BA%8A%E5%B9%B6%E6%8F%92%E5%85%A5md%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('paste', (event) => handlePaste(event));

    async function handlePaste(event) {
        const items = (event.clipboardData || event.originalEvent.clipboardData).items;
        let imageFiles = [];

        for (let item of items) {
            if (item.kind === 'file' && item.type.indexOf('image/') !== -1) {
                let blob = item.getAsFile();
                imageFiles.push(blob);
            }
        }

        if (imageFiles.length > 0) {
            event.preventDefault();
            for (let file of imageFiles) {
                let formData = new FormData();
                formData.append('file', file);
                await uploadToImageHost(formData);
            }
        }
    }

    function uploadToImageHost(formData) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://把这段文字替换为你图床域名/api/v1/upload',
                headers: {
                    'Authorization': 'Bearer 把这段文字替换为你的token',
                    'Accept': 'application/json'
                },
                data: formData,
                onload: (response) => {
                    let jsonResponse = JSON.parse(response.responseText);
                    if (response.status === 200 && jsonResponse && jsonResponse.data && jsonResponse.data.links && jsonResponse.data.links.markdown) {
                        insertToEditor(jsonResponse.data.links.markdown);
                    } else {
                        showErrorPopup('图片上传成功，但未获取到Markdown链接');
                    }
                    resolve();
                },
                onerror: (error) => {
                    showErrorPopup('图片上传遇到错误，请检查网络或稍后重试。');
                    reject(error);
                }
            });
        });
    }

    function insertToEditor(markdownLink) {
        const codeMirrorElement = document.querySelector('.CodeMirror');
        if (codeMirrorElement) {
            const codeMirrorInstance = codeMirrorElement.CodeMirror;
            if (codeMirrorInstance) {
                const cursor = codeMirrorInstance.getCursor();
                codeMirrorInstance.replaceRange(markdownLink + '\n', cursor);
            }
        }
    }

    function showErrorPopup(errorMessage) {
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.right = '20px';
        popup.style.bottom = '20px';
        popup.style.backgroundColor = 'red';
        popup.style.color = 'white';
        popup.style.padding = '10px';
        popup.style.borderRadius = '5px';
        popup.style.zIndex = '10000';
        popup.textContent = errorMessage;

        const closeButton = document.createElement('button');
        closeButton.textContent = 'X';
        closeButton.style.marginLeft = '10px';
        closeButton.style.color = 'white';
        closeButton.style.backgroundColor = 'transparent';
        closeButton.style.border = 'none';
        closeButton.onclick = () => popup.remove();

        popup.appendChild(closeButton);
        document.body.appendChild(popup);
        setTimeout(() => {
            if (popup) {
                popup.remove();
            }
        }, 5000);
    }
})();