// ==UserScript==
// @name         NodeSeek 编辑器增强(自托管图床）
// @namespace    https://www.nodeseek.com/
// @version      0.0.5
// @description  为 NodeSeek 编辑器增加图片上传功能
// @author       TomyJan
// @match        *://www.nodeseek.com/*
// @icon         https://www.nodeseek.com/static/image/favicon/android-chrome-192x192.png
// @grant        GM_xmlhttpRequest
// @license      MPL-2.0 License
// @supportURL   https://www.nodeseek.com/post-74493-1
// @homepageURL  https://www.nodeseek.com/post-74493-1
// @downloadURL https://update.greasyfork.org/scripts/488805/NodeSeek%20%E7%BC%96%E8%BE%91%E5%99%A8%E5%A2%9E%E5%BC%BA%28%E8%87%AA%E6%89%98%E7%AE%A1%E5%9B%BE%E5%BA%8A%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/488805/NodeSeek%20%E7%BC%96%E8%BE%91%E5%99%A8%E5%A2%9E%E5%BC%BA%28%E8%87%AA%E6%89%98%E7%AE%A1%E5%9B%BE%E5%BA%8A%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const imgHost = {
        type: "LskyPro",
        url: "https://image.redwind.top",
        token: "1|ft3uYucjvFUmiYz57TijDPnFwAPZCf2dTt3CQKiw",
        storageId: null,
    };
    const mdImgName = 0;

    window.addEventListener('load', function() {
        initEditorEnhancer();
        let checkExist = setInterval(function() {
            const oldElement = document.querySelector('.toolbar-item.i-icon.i-icon-pic[title="图片"]');
            if (oldElement) {
                clearInterval(checkExist);
                const newElement = oldElement.cloneNode(true);
                oldElement.parentNode.replaceChild(newElement, oldElement);
                newElement.addEventListener('click', handleImgBtnClick);
            }
        }, 200);
    });

    function initEditorEnhancer() {
        document.addEventListener('paste', (event) => handlePasteEvt(event));
        var dropZone = document.getElementById('code-mirror-editor');
        dropZone.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.dataTransfer.dropEffect = 'copy';
        });
        dropZone.addEventListener('drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
            handleDropEvt(e);
        });
    }

    function handleImgBtnClick() {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.accept = 'image/*';
        input.onchange = e => {
            const files = e.target.files;
            if (files.length) {
                const items = [...files].map(file => ({
                    kind: 'file',
                    type: file.type,
                    getAsFile: () => file
                }));
                uploadImage(items);
            }
        };
        input.click();
    }

    function handlePasteEvt(event) {
        const items = (event.clipboardData || event.originalEvent.clipboardData).items;
        uploadImage(items);
    }

    function handleDropEvt(event) {
        let imageFiles = [];
        for (let file of event.dataTransfer.files) {
            if (/^image\//i.test(file.type)) {
                imageFiles.push(file);
            }
        }
        uploadImage(imageFiles.map(file => ({
            kind: 'file',
            type: file.type,
            getAsFile: () => file
        })));
    }

    async function uploadImage(items) {
        let imageFiles = [];
        for (let item of items) {
            if (item.kind === 'file' && /^image\//i.test(item.type)) {
                let blob = item.getAsFile();
                imageFiles.push(blob);
            }
        }
        if (imageFiles.length > 0) {
            for (let i = 0; i < imageFiles.length; i++) {
                let file = imageFiles[i];
                let formData = new FormData();
                formData.append('file', file);
                if (imgHost.storageId) formData.append('strategy_id', imgHost.storageId);
                if (imgHost.type === 'LskyPro') {
                    await uploadToLsky(formData);
                }
            }
        }
    }

    async function uploadToLsky(formData) {
        return new Promise((resolve, reject) => {
            let headers = {
                'Accept': 'application/json'
            };
            if (imgHost.token) headers['Authorization'] = `Bearer ${imgHost.token}`;
            GM_xmlhttpRequest({
                method: 'POST',
                url: `${imgHost.url}/api/v1/upload`,
                headers: headers,
                data: formData,
                onload: (rsp) => {
                    let rspJson = JSON.parse(rsp.responseText);
                    if (rspJson.status === true) {
                        const markdownLink = mdImgName === 0 ? rspJson.data.links.markdown : `![${mdImgName}](${rspJson.data.links.url})`;
                        insertToEditor(markdownLink);
                    }
                    resolve();
                },
                onerror: (error) => {
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
                codeMirrorInstance.replaceRange(`\n${markdownLink}\n`, cursor);
            }
        }
    }
})();