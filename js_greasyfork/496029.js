// ==UserScript==
// @name         NodeSeek自动上传图片到微信api并插入md链接
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  用的是ns大佬发的api接口
// @author       kingis和GPT
// @match        https://www.nodeseek.com/*
// @license MIT
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/496029/NodeSeek%E8%87%AA%E5%8A%A8%E4%B8%8A%E4%BC%A0%E5%9B%BE%E7%89%87%E5%88%B0%E5%BE%AE%E4%BF%A1api%E5%B9%B6%E6%8F%92%E5%85%A5md%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/496029/NodeSeek%E8%87%AA%E5%8A%A8%E4%B8%8A%E4%BC%A0%E5%9B%BE%E7%89%87%E5%88%B0%E5%BE%AE%E4%BF%A1api%E5%B9%B6%E6%8F%92%E5%85%A5md%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('paste', function(event) {
        handlePaste(event);
    });

    function handlePaste(event) {
        var items = (event.clipboardData || event.originalEvent.clipboardData).items;
        var imageFiles = [];

        for (var i = 0; i < items.length; i++) {
            if (items[i].kind === 'file' && items[i].type.indexOf('image/') !== -1) {
                var blob = items[i].getAsFile();
                imageFiles.push(blob);
            }
        }

        if (imageFiles.length > 0) {
            event.preventDefault();
            for (var j = 0; j < imageFiles.length; j++) {
                var formData = new FormData();
                formData.append('media', imageFiles[j]);
                uploadToImageHost(formData);
            }
        }
    }

    function uploadToImageHost(formData) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://openai.weixin.qq.com/weixinh5/webapp/h774yvzC2xlB4bIgGfX2stc4kvC85J/cos/upload',
            data: formData,
            onload: function(response) {
                var jsonResponse = JSON.parse(response.responseText);
                if (response.status === 200 && jsonResponse && jsonResponse.url) {
                    insertToEditor('![image](' + jsonResponse.url + ')');
                } else {
                    showErrorPopup('图片上传成功，但未获取到Markdown链接');
                }
            },
            onerror: function(response) {
                showErrorPopup('图片上传遇到错误，请检查网络或稍后重试。');
            }
        });
    }

    function insertToEditor(markdownLink) {
        var codeMirrorElement = document.querySelector('.CodeMirror');
        if (codeMirrorElement) {
            var codeMirrorInstance = codeMirrorElement.CodeMirror;
            if (codeMirrorInstance) {
                var cursor = codeMirrorInstance.getCursor();
                codeMirrorInstance.replaceRange(markdownLink + '\n', cursor);
            }
        }
    }

    function showErrorPopup(errorMessage) {
        var popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.right = '20px';
        popup.style.bottom = '20px';
        popup.style.backgroundColor = 'red';
        popup.style.color = 'white';
        popup.style.padding = '10px';
        popup.style.borderRadius = '5px';
        popup.style.zIndex = '10000';
        popup.textContent = errorMessage;

        var closeButton = document.createElement('button');
        closeButton.textContent = 'X';
        closeButton.style.marginLeft = '10px';
        closeButton.style.color = 'white';
        closeButton.style.backgroundColor = 'transparent';
        closeButton.style.border = 'none';
        closeButton.onclick = function() {
            popup.remove();
        };

        popup.appendChild(closeButton);
        document.body.appendChild(popup);
        setTimeout(function() {
            if (popup) {
                popup.remove();
            }
        }, 5000);
    }
})();