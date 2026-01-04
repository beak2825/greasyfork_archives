// ==UserScript==
// @name         图片自动上传脚本(自托管图床）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在nodeseek.com的论坛中自动上传图片到图床并插入Markdown链接
// @author       -
// @match        https://www.nodeseek.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/487671/%E5%9B%BE%E7%89%87%E8%87%AA%E5%8A%A8%E4%B8%8A%E4%BC%A0%E8%84%9A%E6%9C%AC%28%E8%87%AA%E6%89%98%E7%AE%A1%E5%9B%BE%E5%BA%8A%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/487671/%E5%9B%BE%E7%89%87%E8%87%AA%E5%8A%A8%E4%B8%8A%E4%BC%A0%E8%84%9A%E6%9C%AC%28%E8%87%AA%E6%89%98%E7%AE%A1%E5%9B%BE%E5%BA%8A%EF%BC%89.meta.js
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
                url: 'https://image.redwind.top/api/v1/upload',
                headers: {
                    'Authorization': 'Bearer 1|ft3uYucjvFUmiYz57TijDPnFwAPZCf2dTt3CQKiw',
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