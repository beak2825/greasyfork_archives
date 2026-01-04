// ==UserScript==
// @name         嘿咯图床上传脚本
// @namespace    https://heilo.cn/
// @version      2.3
// @description  嘿咯图床上传脚本，支持拖拽上传，多图上传，直接返回外链地址，可以直接复制DZ论坛格式及Markdown格式在论坛发布，任何网站需要都可以使用。
// @author       ymh1147
// @homepage     https://heilo.cn/
// @match        *://*/*
// @license      AGPL-3.0-or-later
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/523120/%E5%98%BF%E5%92%AF%E5%9B%BE%E5%BA%8A%E4%B8%8A%E4%BC%A0%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/523120/%E5%98%BF%E5%92%AF%E5%9B%BE%E5%BA%8A%E4%B8%8A%E4%BC%A0%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const container = document.createElement('div');
    container.id = 'heilo-upload-container';
    container.innerHTML = `
        <div id="heilo-upload-box">
            <div id="heilo-drop-area">
                <p>点击或拖拽图片到这里上传（最多4张）</p>
                <input type="file" id="heilo-file-input" multiple accept="image/*" style="display: none;">
            </div>
            <div id="heilo-result-area"></div>
            <div id="heilo-watermark">嘿咯图床</div>
            <button id="heilo-close-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                </svg>
            </button>
            <div id="heilo-loading" style="display: none;">上传中...</div>
        </div>
        <div id="heilo-tab">图床</div> <!-- 吸附图标 -->
    `;
    document.body.appendChild(container);

    GM_addStyle(`
        #heilo-upload-container {
            position: fixed;
            top: 45px;
            right: -300px;
            z-index: 9999;
            transition: right 0.3s ease;
        }
        #heilo-upload-container:hover {
            right: 0;
        }
        #heilo-tab {
            position: fixed;
            top: 45px;
            right: 0;
            background-color: #007bff;
            color: #fff;
            padding: 5px 10px;
            border-radius: 5px 0 0 5px;
            cursor: pointer;
            z-index: 9998;
            font-size: 14px;
            box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
            transition: right 0.3s ease;
        }
        #heilo-tab:hover {
            background-color: #0056b3;
        }
        #heilo-upload-box {
            background: #fff;
            border: 2px dashed #ccc;
            padding: 20px;
            max-width: 250px;
            text-align: center;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            position: relative;
        }
        #heilo-drop-area {
            margin-bottom: 20px;
            padding: 20px;
            border: 2px dashed #aaa;
            border-radius: 10px;
            background-color: #f9f9f9;
            transition: background-color 0.3s ease;
            cursor: pointer;
        }
        #heilo-drop-area.dragover {
            background-color: #e0e0e0;
            border-color: #777;
        }
        #heilo-result-area {
            max-height: 400px;
            overflow-y: auto;
            text-align: center;
        }
        .heilo-result-item {
            margin-bottom: 20px;
            border: 1px solid #ddd;
            border-radius: 10px;
            padding: 10px;
            background-color: #fafafa;
        }
        .heilo-result-item img {
            max-width: 180px;
            height: auto;
            border-radius: 5px;
        }
        .heilo-result-item button {
            margin: 5px;
            padding: 5px 10px;
            background-color: #007bff;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            white-space: normal;
            word-wrap: break-word;
            width: 100%;
        }
        .heilo-result-item button:hover {
            background-color: #0056b3;
        }
        #heilo-close-btn {
            position: absolute;
            top: 5px;
            right: 5px;
            background: none;
            border: none;
            cursor: pointer;
            padding: 5px;
        }
        #heilo-close-btn svg {
            fill: #dc3545;
        }
        #heilo-close-btn:hover svg {
            fill: #c82333;
        }
        #heilo-watermark {
            position: absolute;
            bottom: 10px;
            right: 10px;
            color: rgba(0, 0, 0, 0.2);
            font-size: 14px;
            font-weight: bold;
            pointer-events: none;
        }
        #heilo-loading {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: #fff;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 10000;
        }
    `);

    const uploadBox = document.getElementById('heilo-upload-box');
    const closeBtn = document.getElementById('heilo-close-btn');
    const dropArea = document.getElementById('heilo-drop-area');
    const fileInput = document.getElementById('heilo-file-input');
    const resultArea = document.getElementById('heilo-result-area');
    const tab = document.getElementById('heilo-tab');
    const loading = document.getElementById('heilo-loading');
    let hideTimeout = null;

    tab.addEventListener('mouseenter', () => {
        container.style.right = '0';
        tab.style.right = '-100px';
    });

    container.addEventListener('mouseleave', () => {
        if (hideTimeout) clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => {
            container.style.right = '-300px';
            tab.style.right = '0';
        }, 5000);
    });

    container.addEventListener('mouseenter', () => {
        if (hideTimeout) clearTimeout(hideTimeout);
    });

    closeBtn.addEventListener('click', () => {
        const isConfirmed = confirm('确定要关闭上传框吗？');
        if (isConfirmed) {
            container.style.display = 'none';
        }
    });

    dropArea.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        const files = e.target.files;
        handleFiles(files);
    });

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    dropArea.addEventListener('dragenter', () => {
        dropArea.classList.add('dragover');
    });
    dropArea.addEventListener('dragleave', () => {
        dropArea.classList.remove('dragover');
    });
    dropArea.addEventListener('drop', () => {
        dropArea.classList.remove('dragover');
    });

    async function fetchImageAsBlob(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                responseType: 'blob',
                onload: (response) => {
                    if (response.status === 200) {
                        resolve(response.response);
                    } else {
                        reject(new Error('Failed to fetch image'));
                    }
                },
                onerror: () => {
                    reject(new Error('Network error while fetching image'));
                },
            });
        });
    }

    dropArea.addEventListener('drop', async (e) => {
        preventDefaults(e);
        dropArea.classList.remove('dragover');

        const files = e.dataTransfer.files;
        const items = e.dataTransfer.items;

        if (files.length > 0) {
            handleFiles(files);
        } else if (items.length > 0) {

            const imageItem = Array.from(items).find((item) => item.kind === 'string' && item.type === 'text/uri-list');

            if (imageItem) {
                imageItem.getAsString(async (url) => {
                    try {
                        const blob = await fetchImageAsBlob(url);
                        const file = new File([blob], 'image.jpg', { type: blob.type });
                        handleFiles([file]);
                    } catch (error) {
                        alert('无法获取拖拽的图片，请选择总是允许此域名或图片地址是否有效');
                    }
                });
            } else {
                alert('未检测到有效的图片拖拽操作');
            }
        }
    });

    function handleFiles(files) {
        if (files.length > 4) {
            alert('最多只能上传4张图片');
            return;
        }

        const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
        if (validFiles.length === 0) {
            alert('请选择有效的图片文件');
            return;
        }

        // 显示 Loading
        loading.style.display = 'block';

        getCsrfToken()
            .then(csrfToken => {
                uploadFiles(validFiles, csrfToken);
            })
            .catch(error => {
                alert('无法获取 CSRF Token，请刷新页面后重试');
                loading.style.display = 'none';
            });
    }

    function getCsrfToken() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://heilo.cn/',
                onload: function (response) {
                    try {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, 'text/html');
                        const csrfToken = doc.querySelector('input[name="csrf_token"]').value;
                        resolve(csrfToken);
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: function (error) {
                    reject(error);
                }
            });
        });
    }

    function uploadFiles(files, csrfToken) {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('images[]', files[i]);
        }

        formData.append('csrf_token', csrfToken);
        formData.append('upload_method', 'third_party');

        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://heilo.cn/',
            data: formData,
            headers: {
                'Referer': 'https://heilo.cn/',
                'Origin': 'https://heilo.cn/'
            },
            onload: function (response) {
                loading.style.display = 'none';
                try {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');

                    const links = Array.from(doc.querySelectorAll('button.copy-link'))
                        .map(button => button.getAttribute('data-url'))
                        .filter(link => link.includes('/images/'));

                    if (links.length > 0) {
                        displayResult(links);
                    } else {
                        alert('图片违规，请勿上传违规图片！');
                    }
                } catch (error) {
                    alert('解析响应失败');
                }
            },
            onerror: function (error) {
                loading.style.display = 'none';
                alert('上传过程中发生错误');
            }
        });
    }

    function displayResult(links) {
        resultArea.innerHTML = '';
        links.forEach(link => {
            const forumFormat = `[img]${link}[/img]`;
            const markdownFormat = `![嘿咯图床](${link})`;

            const resultItem = document.createElement('div');
            resultItem.className = 'heilo-result-item';

            const img = document.createElement('img');
            img.src = link;
            resultItem.appendChild(img);

            const buttonContainer = document.createElement('div');
            buttonContainer.style.marginTop = '10px';

            const button1 = document.createElement('button');
            button1.textContent = '复制DZ论坛格式';
            button1.onclick = () => copyToClipboard(forumFormat);
            buttonContainer.appendChild(button1);

            const button2 = document.createElement('button');
            button2.textContent = '复制MD格式';
            button2.onclick = () => copyToClipboard(markdownFormat);
            buttonContainer.appendChild(button2);

            const button3 = document.createElement('button');
            button3.textContent = '复制图片地址';
            button3.onclick = () => copyToClipboard(link);
            buttonContainer.appendChild(button3);

            resultItem.appendChild(buttonContainer);
            resultArea.appendChild(resultItem);
        });
    }

    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('已复制到剪贴板');
    }
})();