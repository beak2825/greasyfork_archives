// ==UserScript==
// @name         拦截 getValidForm 接口响应并展示解密信息
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       lulu
// @license      请勿乱改
// @match        *://*/*
// @grant        none
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @require      https://unpkg.com/jsoneditor@9.7.3/dist/jsoneditor.min.js
// @resource     JE_CSS https://unpkg.com/jsoneditor@9.7.3/dist/jsoneditor.min.css
// @description  用于查看表单数据提交内容，埋点上报内容
// @downloadURL https://update.greasyfork.org/scripts/539286/%E6%8B%A6%E6%88%AA%20getValidForm%20%E6%8E%A5%E5%8F%A3%E5%93%8D%E5%BA%94%E5%B9%B6%E5%B1%95%E7%A4%BA%E8%A7%A3%E5%AF%86%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/539286/%E6%8B%A6%E6%88%AA%20getValidForm%20%E6%8E%A5%E5%8F%A3%E5%93%8D%E5%BA%94%E5%B9%B6%E5%B1%95%E7%A4%BA%E8%A7%A3%E5%AF%86%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==


(function () {
    'use strict';
    const keyHex = 'RZDGeC4QvakRU2c6';
    const ivHex = 'dZpaGScHc3iPqgH8';
    let getValidFormPopupCount = 0;
    let pingPopupCount = 0;
    let allDecryptedData = [];
    let allRequestInputs = []; // 用于保存请求的入参
    let hasGetValidFormRequest = false; // 标记是否有 /api-client/form/getValidForm 请求
    let requestCount = 0; // 记录请求的数量
    let completedRequestCount = 0; // 记录已完成的请求数量
    const BLOCKED_DOMAINS_KEY = 'blocked_domains';
    const BLOCKED_PATHS_KEY = 'blocked_paths'; // 用于存储阻止的路径
    let hasGetLatestJsRequest = false; // 标记是否有 /api-client/form/getLatestJsWithRedirect 请求
    let pingRequests = []; // 存储捕获到的 ping 请求
    let noDataResponses = []; // 记录无 data 的响应
    // 添加 JSONEditor 样式
    //     const jeCss = GM_getResourceText('JE_CSS');
    //     GM_addStyle(jeCss);
    //     // 添加额外样式（若菜单位置异常）
    //     GM_addStyle(`
    // .jsoneditor-menu {
    //     position: relative !important; /* 确保菜单相对定位 */
    //     z-index: 999 !important; /* 避免被其他元素遮挡 */
    // }
    // `);
    // 添加 CSS 样式
    const style = document.createElement('style');
    style.textContent = `
      .json-object {
        color: #708;
      }
      .json-array {
        color: #267f99;
      }
      .json-key {
        color: #117700;
      }
      .json-value {
        color: #000;
      }
      .json-list {
        list-style-type: none;
        margin: 0;
        padding-left: 20px;
      }
       @keyframes fadeOut {
        0% {
            opacity: 1;
            transform: scale(1) translateY(0);
            filter: blur(0);
        }
        50% {
            opacity: 0.5;
            transform: scale(0.95) translateY(-5px);
            filter: blur(1px);
        }
        100% {
            opacity: 0;
            transform: scale(0.9) translateY(-10px);
            filter: blur(2px);
        }
    }
   .fade-out {
        animation: fadeOut 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    }
    `;
    document.head.appendChild(style);

    //     // 创建 JSONEditor
    //     function createJSONEditor() {
    //         // 创建容器
    //         const container = document.createElement('div');
    //         container.id = 'jsoneditor';
    //         container.style.position = 'fixed';
    //         container.style.top = '20px';
    //         container.style.left = '20px';
    //         container.style.width = '800px';
    //         container.style.height = '600px';
    //         container.style.zIndex = '9999';
    //         container.style.border = '1px solid #ddd';
    //         document.body.appendChild(container);

    //         // 示例 JSON 数据
    //         const initialJson = {
    //             "config": {
    //                 "api": {
    //                     "endpoint": "https://api.example.com",
    //                     "version": "v2"
    //                 },
    //                 "auth": {
    //                     "token": "your-api-token",
    //                     "expires": "2023-12-31T23:59:59Z"
    //                 }
    //             },
    //             "data": {
    //                 "users": [
    //                     { "id": 1, "name": "Alice", "role": "admin" },
    //                     { "id": 2, "name": "Bob", "role": "user" }
    //                 ],
    //                 "settings": {
    //                     "theme": "dark",
    //                     "notifications": {
    //                         "email": true,
    //                         "push": false
    //                     }
    //                 }
    //             }
    //         };

    //         // 配置选项
    //         const options = {
    //             mode: 'code',
    //             modes: [ 'code', 'form', 'view', 'text'],
    //             indentation: 2,
    //             theme: 'dark',
    //             search: true,
    //             history: true,
    //             onChangeJSON: function(updatedJson) {
    //                 console.log('JSON 已更新:', updatedJson);
    //             }
    //         };

    //         // 初始化编辑器
    //         const editor = new JSONEditor(container, options, initialJson);
    //         return editor;
    //     }

    // 页面加载后创建编辑器
    //window.addEventListener('load', createJSONEditor);





    // 检查当前域名或路径是否被阻止
    function isDomainBlocked() {
        const blockedDomains = JSON.parse(localStorage.getItem(BLOCKED_DOMAINS_KEY)) || [];
        const blockedPaths = JSON.parse(localStorage.getItem(BLOCKED_PATHS_KEY)) || [];
        const currentUrl = window.location.href;
        const currentDomain = window.location.hostname;

        if (blockedDomains.includes(currentDomain)) {
            return true;
        }

        for (let i = 0; i < blockedPaths.length; i++) {
            if (currentUrl.includes(blockedPaths[i])) {
                return true;
            }
        }

        return false;
    }

    // 阻止当前域名
    function blockCurrentDomain() {
        const blockedDomains = JSON.parse(localStorage.getItem(BLOCKED_DOMAINS_KEY)) || [];
        if (!blockedDomains.includes(window.location.hostname)) {
            blockedDomains.push(window.location.hostname);
            localStorage.setItem(BLOCKED_DOMAINS_KEY, JSON.stringify(blockedDomains));
        }
    }

    // 阻止当前域名和路径
    function blockCurrentDomainAndPath(path) {
        const blockedPaths = JSON.parse(localStorage.getItem(BLOCKED_PATHS_KEY)) || [];
        const fullPath = `${path}`;
        if (!blockedPaths.includes(fullPath)) {
            blockedPaths.push(fullPath);
            localStorage.setItem(BLOCKED_PATHS_KEY, JSON.stringify(blockedPaths));
        }
    }

    // 将十六进制字符串转换为 Uint8Array
    function hexToUint8Array(hex) {
        const array = new Uint8Array(hex.length / 2);
        for (let i = 0; i < hex.length; i += 2) {
            array[i / 2] = parseInt(hex.substr(i, 2), 16);
        }
        return array;
    }

    // AES 解密函数
    async function decryptAES(ciphertextBase64, keyHex, ivHex) {
        const keyBytes = new TextEncoder().encode(keyHex);
        const iv = new TextEncoder().encode(ivHex);
        const ciphertext = Uint8Array.from(atob(ciphertextBase64), c => c.charCodeAt(0));

        const key = await window.crypto.subtle.importKey(
            'raw',
            keyBytes,
            { name: 'AES-CBC' },
            false,
            ['decrypt']
        );

        const decryptedBuffer = await window.crypto.subtle.decrypt(
            {
                name: 'AES-CBC',
                iv: iv
            },
            key,
            ciphertext
        );

        const decryptedData = new TextDecoder().decode(decryptedBuffer);
        return decryptedData;
    }

    // 创建 toast 提示
    function showToast(message,error = false) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.position = 'fixed';
        toast.style.top = '20px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        if(error){
            toast.style.backgroundColor = 'red';
        }
        toast.style.color = 'white';
        toast.style.padding = '10px 20px';
        toast.style.borderRadius = '5px';
        toast.style.zIndex = '99999';
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease-in-out';

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '1';
        }, 100);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 2000);
    }

    // 解析请求参数
    function getRequestParams(input, init) {
        let url = typeof input === 'string' ? input : input.url;
        let params = {};

        // 处理 GET 请求的参数
        if (url.includes('?')) {
            const queryString = url.split('?')[1];
            const pairs = queryString.split('&');
            pairs.forEach(pair => {
                const [key, value] = pair.split('=');
                params[key] = decodeUrlParams(value);
            });
        }

        // 处理 POST 请求的参数
        let body;

        if (init && init.body) {
            body = init.body;
        } else if (typeof input === 'object' && input.body) {
            body = input.body;
        }
        console.log('body:',body);
        if (body) {
            if (body instanceof Blob) {
                console.log('处理POST请求的Blob类型body');
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = function () {
                        const blobText = reader.result;
                        if (typeof blobText === 'string' && blobText) {
                            const pairs = blobText.split('&');
                            pairs.forEach(pair => {
                                const [key, value] = pair.split('=');
                                params[key] = decodeUrlParams(value);
                            });
                        }
                        resolve(params);
                    };
                    reader.readAsText(body);
                });
            } else {
                try {

                    const postData = JSON.parse(body);
                    console.log('尝试将POST请求的body解析为JSON',postData);
                    Object.assign(params, postData);
                } catch (error) {
                    console.error('解析POST请求体时出错:', error);
                    // 尝试将body作为普通字符串解析
                    const bodyText = body;
                    if (typeof bodyText === 'string' && bodyText) {
                        const pairs = bodyText.split('&');
                        pairs.forEach(pair => {
                            const [key, value] = pair.split('=');
                            params[key] = decodeUrlParams(value);
                        });
                    }
                }
            }
        }

        return params;
    }
    // 创建公共的弹窗样式（改为圆角矩形）
    function createCommonPopupStyle(floatingDiv, isPingPopup = false) {
        floatingDiv.style.position = 'fixed';
        floatingDiv.style.padding = '0.8em';
        floatingDiv.style.border = '1px solid #e0e0e0';
        floatingDiv.style.borderRadius = '10px'; // 改为圆角矩形，设置合适的圆角半径
        floatingDiv.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        floatingDiv.style.zIndex = '9999';
        floatingDiv.style.width = '120px';
        floatingDiv.style.height = 'auto'; // 根据内容自动调整高度
        floatingDiv.style.boxSizing = 'border-box';
        floatingDiv.style.display = 'flex';
        floatingDiv.style.flexDirection = 'column';
        floatingDiv.style.justifyContent = 'center';
        floatingDiv.style.alignItems = 'center';
        floatingDiv.style.cursor = 'pointer';
        floatingDiv.style.transition = 'all 0.3s ease';


        // 创建关闭按钮
        const closeButton = document.createElement('span');
        closeButton.textContent = 'X';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '5px';
        closeButton.style.right = '5px';
        closeButton.style.cursor = 'pointer';
        closeButton.addEventListener('click', () => {
            floatingDiv.style.display = 'none';
        });
        floatingDiv.appendChild(closeButton);

        if (isPingPopup) {
            // 计算 ping 弹窗位置，放在浏览器右侧
            const rightOffset = 20;
            const topOffset = 20 + pingPopupCount * (120 + 30);
            floatingDiv.style.right = `${rightOffset}px`;
            floatingDiv.style.top = `${topOffset}px`;
            floatingDiv.classList.add('ping-popup');
        } else {
            // 计算原弹窗位置，放在浏览器左侧
            const leftOffset = 20;
            const topOffset = 20 + getValidFormPopupCount * (120 + 30);
            floatingDiv.style.left = `${leftOffset}px`;
            floatingDiv.style.top = `${topOffset}px`;
            floatingDiv.classList.add('popup-form');
        }

        return floatingDiv;
    }
    // 创建关闭按钮组件
    function createCloseButton(targetElement) {
        const closeButton = document.createElement('span');
        closeButton.textContent = '×';
        closeButton.style.position = 'sticky';
        closeButton.style.top = '0';
        closeButton.style.right = '3px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.color = '#666666';
        closeButton.style.fontSize = '1.2em';
        closeButton.style.fontWeight = 'bold';
        closeButton.style.padding = '0 0.2em';
        closeButton.style.borderRadius = '50%';
        closeButton.style.transition = 'background-color 0.5s ease';
        closeButton.addEventListener('mouseover', function () {
            this.style.color = 'red';
            this.style.backgroundColor = '#f0f0f0';
        });
        closeButton.addEventListener('mouseout', function () {
            this.style.color = '#666666';
            this.style.backgroundColor = 'transparent';
        });
        closeButton.addEventListener('click', function () {
            targetElement.remove();
        });
        return closeButton;
    }

    // 创建不再展示按钮组件
    function createNoShowButton() {
        const noShowButton = document.createElement('button');
        noShowButton.textContent = '不再展示';
        noShowButton.style.marginTop = '6px';
        noShowButton.style.backgroundColor = '#2cf2ba';
        noShowButton.style.color = 'black';
        noShowButton.style.border = 'none';
        noShowButton.style.borderRadius = '5px';
        noShowButton.style.padding = '6px 12px';
        noShowButton.style.cursor = 'pointer';
        noShowButton.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.1)';
        noShowButton.style.transition = 'background-color 0.3s ease';
        noShowButton.style.fontSize = '0.8em';
        noShowButton.style.textDecoration = 'line-through'; // 添加划掉效果
        noShowButton.addEventListener('click', function () {
            const choiceDiv = document.createElement('div');
            choiceDiv.style.position = 'fixed';
            choiceDiv.style.backgroundColor = 'white';
            choiceDiv.style.border = '1px solid #e0e0e0';
            choiceDiv.style.borderRadius = '10px'; // 加大圆角
            choiceDiv.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)'; // 加大阴影
            choiceDiv.style.padding = '20px';
            choiceDiv.style.zIndex = '10000';
            choiceDiv.style.left = '50%';
            choiceDiv.style.top = '50%';
            choiceDiv.style.transform = 'translate(-50%, -50%)';
            // 移除固定宽度，让弹层自适应内容宽度
            // choiceDiv.style.width = '300px';
            choiceDiv.style.display = 'flex';
            choiceDiv.style.flexDirection = 'column';
            choiceDiv.style.alignItems = 'flex-start';

            // 添加标题
            const title = document.createElement('h3');
            title.textContent = '选择阻止级别';
            title.style.margin = '0 0 10px 0';
            title.style.fontSize = '16px';
            choiceDiv.appendChild(title);

            const domainButton = document.createElement('button');
            domainButton.textContent = '阻止该域名';
            domainButton.style.marginBottom = '10px';
            domainButton.style.backgroundColor = '#007BFF';
            domainButton.style.color = 'white';
            domainButton.style.border = 'none';
            domainButton.style.borderRadius = '5px';
            domainButton.style.padding = '6px 12px';
            domainButton.style.cursor = 'pointer';
            domainButton.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.1)';
            domainButton.style.transition = 'background-color 0.3s ease';

            const domainPathButton = document.createElement('button');
            domainPathButton.textContent = '阻止域名+路径';
            domainPathButton.style.marginBottom = '10px';
            domainPathButton.style.backgroundColor = '#e0e0e0';
            domainPathButton.style.color = '#333333';
            domainPathButton.style.border = 'none';
            domainPathButton.style.borderRadius = '5px';
            domainPathButton.style.padding = '6px 12px';
            domainPathButton.style.cursor = 'pointer';
            domainPathButton.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.1)';
            domainPathButton.style.transition = 'background-color 0.3s ease';

            const pathInput = document.createElement('input');
            pathInput.type = 'text';
            pathInput.placeholder = '请输入路径';
            pathInput.style.marginTop = '5px';
            // 使用 max-width 保证输入框在小屏幕下也不会过宽
            pathInput.style.maxWidth = '100%';
            pathInput.style.padding = '8px';
            pathInput.style.border = '1px solid #ccc';
            pathInput.style.borderRadius = '5px';
            pathInput.disabled = true;
            // 获取当前网站的域名加一级路径
            const currentDomain = window.location.hostname;
            const pathname = window.location.pathname;
            const firstLevelPath = pathname.split('/')[1] || '';
            const fullPathHint = `${currentDomain}${firstLevelPath? '/' + firstLevelPath : ''}`;
            pathInput.value = fullPathHint; // 设置为默认填充值

            // 默认不展示输入框
            pathInput.style.display = 'none';

            const confirmButton = document.createElement('button');
            confirmButton.textContent = '确认';
            confirmButton.style.marginTop = '15px';
            confirmButton.style.backgroundColor = '#007BFF';
            confirmButton.style.color = 'white';
            confirmButton.style.border = 'none';
            confirmButton.style.borderRadius = '5px';
            confirmButton.style.padding = '8px 16px';
            confirmButton.style.cursor = 'pointer';
            confirmButton.style.alignSelf = 'center';

            let selectedOption = 'domain';
            domainButton.addEventListener('click', function () {
                selectedOption = 'domain';
                domainButton.style.backgroundColor = '#007BFF';
                domainButton.style.color = 'white';
                domainPathButton.style.backgroundColor = '#e0e0e0';
                domainPathButton.style.color = '#333333';
                pathInput.disabled = true;
                pathInput.style.display = 'none';
            });

            domainPathButton.addEventListener('click', function () {
                selectedOption = 'domainPath';
                domainPathButton.style.backgroundColor = '#007BFF';
                domainPathButton.style.color = 'white';
                domainButton.style.backgroundColor = '#e0e0e0';
                domainButton.style.color = '#333333';
                pathInput.disabled = false;
                pathInput.style.display = 'block';
            });

            const submitFunction = function () {
                if (selectedOption === 'domain') {
                    blockCurrentDomain();
                    showToast('已阻止当前域名');
                } else if (selectedOption === 'domainPath') {
                    const path = pathInput.value.trim();
                    if (path) {
                        blockCurrentDomainAndPath(path);
                        showToast('已阻止当前域名和路径');
                    } else {
                        showToast('请输入有效的路径');
                        return;
                    }
                }
                const allPopups = document.querySelectorAll('[style*="position: fixed"]');
                allPopups.forEach(popup => popup.remove());
                choiceDiv.remove();
            };

            confirmButton.addEventListener('click', submitFunction);
            domainButton.addEventListener('dblclick', submitFunction);
            domainPathButton.addEventListener('dblclick', submitFunction);

            choiceDiv.appendChild(domainButton);
            choiceDiv.appendChild(domainPathButton);
            choiceDiv.appendChild(pathInput);
            choiceDiv.appendChild(confirmButton);

            // 添加关闭按钮
            const closeButton = document.createElement('span');
            closeButton.textContent = '×';
            closeButton.style.position = 'absolute'; // 改为绝对定位
            closeButton.style.right = '15px';
            closeButton.style.top = '15px';
            closeButton.style.cursor = 'pointer';
            closeButton.style.color = '#666';
            closeButton.style.fontSize = '20px';
            closeButton.style.fontWeight = 'bold';
            closeButton.style.padding = '0 5px';
            closeButton.addEventListener('click', function() {
                choiceDiv.remove();
            });
            choiceDiv.appendChild(closeButton);
            document.body.appendChild(choiceDiv);
        });
        return noShowButton;
    }



    // 创建复制按钮组件
    function createCopyButton(text, content) {
        const copyButton = document.createElement('button');
        copyButton.textContent = text;
        copyButton.style.backgroundColor = '#007BFF';
        copyButton.style.color = 'white';
        copyButton.style.border = 'none';
        copyButton.style.borderRadius = '4px';
        copyButton.style.padding = '5px 10px';
        copyButton.style.cursor = 'pointer';
        copyButton.style.marginRight = '10px';
        copyButton.style.fontSize = '14px';
        copyButton.style.transition = 'background-color 0.3s ease';


        // 添加悬停效果
        copyButton.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#0056b3';
        });
        copyButton.addEventListener('mouseout', function() {
            this.style.backgroundColor = '#007BFF';
        });

        // 点击事件
        copyButton.addEventListener('click', function(e) {
            e.stopPropagation();
            navigator.clipboard.writeText(content).then(() => {
                showToast('已成功复制到剪贴板');
            }).catch((err) => {
                console.error('复制失败:', err);
                showToast('复制失败，请重试');
            });
        });

        return copyButton;
    }

    // 对对象中的值进行 URL 解码
    function decodeUrlParams(content) {
        try {
            // 仅进行URL解码，返回字符串
            return decodeURIComponent(content);
        } catch (e) {
            console.error('URL解码失败:', e);
            // 解码失败返回原始内容
            return content;
        }
    }

    // 将 JSON 数据转换为带有层级样式的 HTML，支持特定 key 标红及背景高亮
    function jsonToHtml(json, indent = 0, highlightKeys = ['sd_id','sp_uuid','formId','uuid','need_handle_sp_uuid','sp_token'], highlightType = 'key') {
        if (json && json.__parseError) {
            return `
        <div class="json-error">
            <span style="color:red">${json.message}:</span>
            <pre>${json.original}</pre>
        </div>
        `;
        }

        if (typeof json === 'object' && json !== null) {
            if (Array.isArray(json)) {
                if (json.length === 0) {
                    return '<span class="json-array">[]</span>';
                }
                const items = json.map(item => `<li>${jsonToHtml(item, indent + 1, highlightKeys, highlightType)}</li>`).join('');
                return `<span class="json-array">[<ul class="json-list">${items}</ul>]</span>`;
            } else {
                const keys = Object.keys(json);
                if (keys.length === 0) {
                    return '<span class="json-object">{}</span>';
                }
                const items = keys.map(key => {
                    const isHighlightKey = highlightKeys.includes(key);
                    const keyStyle = isHighlightKey && highlightType === 'key' ? 'color: red; font-weight: bold;' : '';
                    const keyClass = isHighlightKey && highlightType === 'key' ? 'json-key-highlight' : 'json-key';
                    const liClass = isHighlightKey && highlightType === 'background' ? 'json-highlight-bg' : '';

                    return `<li class="${liClass}">
                    <span class="${keyClass}" style="${keyStyle}">${key}</span>:
                    ${jsonToHtml(json[key], indent + 1, highlightKeys, highlightType)}
                </li>`;
                }).join('');
                return `<span class="json-object">{<ul class="json-list">${items}</ul>}</span>`;
            }
        }

        return `<span class="json-value">${JSON.stringify(json)}</span>`;
    }
    // 移除无请求弹窗的函数
    function removeNoRequestPopups() {
        const noRequestPopups = document.querySelectorAll('.no-request-popup');
        noRequestPopups.forEach(popup => {
            // 修改弹窗文案为异步加载中
            const contentSpan = popup.querySelector('span');
            if (contentSpan) {
                contentSpan.textContent = "异步加载中...";
            }
            // 添加渐变动画类名
            popup.classList.add('fade-out');
            // 等待 2 秒（动画时长）后移除元素
            setTimeout(() => {
                popup.remove();
            }, 5000);
        });
    }

    // 创建预览弹窗（支持拖拽移动，修复首次点击跳动问题）
    function createPreviewTooltip(content, title, parentButton) {
        const tooltip = document.createElement('div');
        tooltip.style.position = 'fixed';
        tooltip.style.backgroundColor = '#ffffff';
        tooltip.style.border = '1px solid #ccc';
        tooltip.style.borderRadius = '8px';
        tooltip.style.padding = '0';
        tooltip.style.zIndex = '10000';
        tooltip.style.maxWidth = '600px';
        tooltip.style.maxHeight = '80vh';
        tooltip.style.overflow = 'auto';
        tooltip.style.wordBreak = 'break-word';
        tooltip.style.display = 'none';
        tooltip.style.left = '50%';
        tooltip.style.top = '50%';
        tooltip.style.transform = 'translate(-50%, -50%)';
        tooltip.style.textAlign = 'left';
        tooltip.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        tooltip.style.fontFamily = 'Arial, sans-serif';
        tooltip.style.lineHeight = '1.5';
        tooltip.style.transition = 'opacity 0.2s ease';

        // 创建按钮容器并固定在顶部
        const buttonContainer = document.createElement('div');
        buttonContainer.style.position = 'sticky';
        buttonContainer.style.top = '0';
        buttonContainer.style.backgroundColor = '#f5f5f5';
        buttonContainer.style.padding = '10px 15px';
        buttonContainer.style.zIndex = '1';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-between';
        buttonContainer.style.alignItems = 'center';
        buttonContainer.style.borderBottom = '1px solid #e0e0e0';
        buttonContainer.style.borderRadius = '8px 8px 0 0';
        buttonContainer.style.cursor = 'grab';

        // 添加标题和复制按钮的容器
        const titleContainer = document.createElement('div');
        titleContainer.style.display = 'flex';
        titleContainer.style.alignItems = 'center';
        titleContainer.style.flexGrow = '1';

        // 添加标题
        const titleElement = document.createElement('h3');
        titleElement.textContent = title;
        titleElement.style.margin = '0';
        titleElement.style.padding = '0';
        titleElement.style.fontSize = '16px';
        titleElement.style.color = '#333';
        titleContainer.appendChild(titleElement);

        // 在标题后添加复制按钮
        const tooltipCopyButton = createCopyButton('复制', content);
        tooltipCopyButton.style.marginLeft = '10px';
        tooltipCopyButton.style.marginRight = 'auto';
        titleContainer.appendChild(tooltipCopyButton);

        buttonContainer.appendChild(titleContainer);

        // 新增关闭按钮（固定在右上角）
        const tooltipCloseButton = document.createElement('span');
        tooltipCloseButton.textContent = '×';
        tooltipCloseButton.style.cursor = 'pointer';
        tooltipCloseButton.style.color = '#666';
        tooltipCloseButton.style.fontSize = '20px';
        tooltipCloseButton.style.fontWeight = 'bold';
        tooltipCloseButton.style.padding = '0 5px';
        tooltipCloseButton.addEventListener('click', function(e) {
            e.stopPropagation();
            tooltip.style.display = 'none';
            if (parentButton) {
                parentButton.textContent = parentButton.textContent.replace('关闭', '查看');
            }
        });
        buttonContainer.appendChild(tooltipCloseButton);

        tooltip.appendChild(buttonContainer);

        // 添加内容区域
        const contentDiv = document.createElement('div');
        contentDiv.style.padding = '15px';
        contentDiv.style.backgroundColor = '#f9f9f9';
        contentDiv.style.borderRadius = '0 0 8px 8px';
        contentDiv.innerHTML = jsonToHtml(JSON.parse(content));
        tooltip.appendChild(contentDiv);

        // 添加拖拽功能
        let isDragging = false;
        let initialX, initialY;
        let startLeft, startTop;
        let originalTransform;

        // 鼠标按下事件 - 开始拖拽
        buttonContainer.addEventListener('mousedown', function(e) {
            // 确保只在标题栏区域拖拽，排除按钮
            if (e.target === tooltipCloseButton || tooltipCopyButton.contains(e.target)) {
                return;
            }

            isDragging = true;
            initialX = e.clientX;
            initialY = e.clientY;

            // 保存原始transform样式
            originalTransform = tooltip.style.transform;

            // 获取当前弹窗的实际位置（考虑transform的影响）
            const rect = tooltip.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;

            // 移除居中的transform，改用绝对定位
            tooltip.style.transform = 'none';
            tooltip.style.left = startLeft + 'px';
            tooltip.style.top = startTop + 'px';

            // 添加拖拽时的视觉反馈
            tooltip.style.opacity = '0.9';
            tooltip.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
            buttonContainer.style.cursor = 'grabbing';

            e.preventDefault();
            e.stopPropagation();
        });

        // 鼠标移动事件 - 处理拖拽
        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                e.preventDefault();

                // 计算偏移量
                const deltaX = e.clientX - initialX;
                const deltaY = e.clientY - initialY;

                // 更新弹窗位置
                tooltip.style.left = (startLeft + deltaX) + 'px';
                tooltip.style.top = (startTop + deltaY) + 'px';
            }
        });

        // 鼠标释放事件 - 结束拖拽
        document.addEventListener('mouseup', function() {
            if (isDragging) {
                isDragging = false;
                tooltip.style.opacity = '1';
                tooltip.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                buttonContainer.style.cursor = 'grab';
            }
        });

        document.body.appendChild(tooltip);
        return tooltip;
    }
    // 创建弹窗
    async function createPopup(dataArray, requestInputs, isError = false, isNoRequest = false, errorResponse = null, isPingPopup = false,isNoData = false) {
        if (isDomainBlocked()) {
            return;
        }

        if (dataArray.length === 0 && !isError && !isNoRequest) {
            const floatingDiv = document.createElement('div');
            const commonStyleDiv = createCommonPopupStyle(floatingDiv, isPingPopup);
            commonStyleDiv.style.backgroundColor = '#fff3cd'; // 浅黄色背景

            // 主提示
            const warningDiv = document.createElement('div');
            warningDiv.textContent = '无有效数据';
            warningDiv.style.fontSize = '0.5em';
            warningDiv.style.textAlign = 'center';
            warningDiv.style.fontWeight = 'bold';
            warningDiv.style.color = '#856404';
            commonStyleDiv.appendChild(warningDiv);

            // 请求参数按钮
            const requestParamsButton = document.createElement('button');
            requestParamsButton.textContent = '查看参数';
            requestParamsButton.style.padding = '6px 12px';
            requestParamsButton.style.backgroundColor = '#f0f0f0';
            requestParamsButton.style.border = '1px solid #ddd';
            requestParamsButton.style.borderRadius = '5px';
            requestParamsButton.style.textAlign = 'center';
            requestParamsButton.style.color = '#333333';
            requestParamsButton.style.fontSize = '0.8em';
            requestParamsButton.style.cursor = 'pointer';
            requestParamsButton.style.transition = 'background-color 0.3s ease';
            requestParamsButton.addEventListener('mouseover', function () {
                this.style.backgroundColor = '#e0e0e0';
            });
            requestParamsButton.addEventListener('mouseout', function () {
                this.style.backgroundColor = '#f0f0f0';
            });
            requestParamsButton.addEventListener('click', () => {
                paramTooltip.style.display = 'block';
                // 添加固定弹窗的逻辑
                if (!paramTooltip.dataset.fixed) {
                    paramTooltip.dataset.fixed = 'true';
                    requestParamsButton.textContent = '关闭参数';
                } else {
                    delete paramTooltip.dataset.fixed;
                    requestParamsButton.textContent = '查看参数';
                    paramTooltip.style.display = 'none';
                }
                paramTooltip.focus();
            });

            commonStyleDiv.appendChild(requestParamsButton);


            // 响应内容按钮
            const viewResponseButton = document.createElement('button');
            viewResponseButton.style.padding = '6px 12px';
            viewResponseButton.textContent = '响应内容';
            viewResponseButton.style.backgroundColor = '#f0f0f0';
            viewResponseButton.style.border = '1px solid #ddd';
            viewResponseButton.style.borderRadius = '5px';
            viewResponseButton.style.textAlign = 'center';
            viewResponseButton.style.color = '#333333';
            viewResponseButton.style.fontSize = '0.8em';
            viewResponseButton.style.cursor = 'pointer';
            viewResponseButton.style.transition = 'background-color 0.3s ease';
            viewResponseButton.style.marginTop = '6px';
            viewResponseButton.addEventListener('mouseover', function () {
                this.style.backgroundColor = '#e0e0e0';
            });
            viewResponseButton.addEventListener('mouseout', function () {
                this.style.backgroundColor = '#f0f0f0';
            });
            commonStyleDiv.appendChild(viewResponseButton);

            // 请求参数弹窗
            const params = await getRequestParams(requestInputs[0].input, requestInputs[0].init);
            const paramTooltip = createPreviewTooltip(
                JSON.stringify(params, null, 2),
                '请求参数'
            );
            const requestParamsTooltip = createPreviewTooltip(JSON.stringify(params, null, 2), '请求参数');
            // 响应内容弹窗
            const responseTooltip = createPreviewTooltip(
                JSON.stringify(errorResponse || '无响应内容', null, 2),
                '完整响应'
            );

            // 按钮事件绑定
            requestParamsButton.addEventListener('click', () => {
                paramTooltip.style.display = 'block';
                paramTooltip.focus();
            });

            viewResponseButton.addEventListener('click', () => {
                responseTooltip.style.display = 'block';
                // 添加固定弹窗的逻辑
                if (!responseTooltip.dataset.fixed) {
                    responseTooltip.dataset.fixed = 'true';
                    viewResponseButton.textContent = '关闭响应';
                } else {
                    delete responseTooltip.dataset.fixed;
                    viewResponseButton.textContent = '查看响应';
                    responseTooltip.style.display = 'none';
                }
                responseTooltip.focus();
            });

            viewResponseButton.addEventListener('click', () => {
                responseTooltip.style.display = 'block';
                responseTooltip.focus();
            });
            requestParamsButton.addEventListener('mouseenter', function () {
                paramTooltip.style.display = 'block';
            });

            requestParamsButton.addEventListener('mouseleave', function () {
                if (!paramTooltip.dataset.fixed) {
                    paramTooltip.style.display = 'none';
                }
            });
            viewResponseButton.addEventListener('mouseenter', function () {
                responseTooltip.style.display = 'block';
            });

            viewResponseButton.addEventListener('mouseleave', function () {
                if (!responseTooltip.dataset.fixed) {
                    responseTooltip.style.display = 'none';
                }
            });

            // 不再展示按钮
            const noShowButton = createNoShowButton();
            commonStyleDiv.appendChild(noShowButton);

            document.body.appendChild(commonStyleDiv);
            document.body.appendChild(paramTooltip);
            document.body.appendChild(responseTooltip);
            getValidFormPopupCount++;
            return;
        }
        if (isError) {
            const floatingDiv = document.createElement('div');
            const commonStyleDiv = createCommonPopupStyle(floatingDiv);
            commonStyleDiv.style.backgroundColor = 'red';
            const contentSpan = document.createElement('span');
            contentSpan.textContent = 'error';
            contentSpan.style.padding = '0 0.3em';
            contentSpan.style.textAlign = 'center';
            contentSpan.style.color = '#333333';
            contentSpan.style.fontSize = '0.5em';

            const copyErrorResponseButton = createCopyButton('复制错误响应', function () {
                const errorResponseText = JSON.stringify(errorResponse, null, 2);
                return errorResponseText;
            });
            commonStyleDiv.appendChild(copyErrorResponseButton);

            const noShowButton = createNoShowButton();
            commonStyleDiv.appendChild(noShowButton);

            document.body.appendChild(commonStyleDiv);
            getValidFormPopupCount++;
            return;
        }
        const isMoreThanThree = dataArray.length > 3;
        for (let i = 0; i < dataArray.length; i++) {
            const data = dataArray[i];
            const floatingDiv = document.createElement('div');
            const commonStyleDiv = createCommonPopupStyle(floatingDiv, isPingPopup);
            if (isMoreThanThree) {
                commonStyleDiv.style.backgroundColor = 'red';
            } else {
                commonStyleDiv.style.backgroundColor = '#f8f9fa';
            }

            // 创建请求参数按钮
            const requestParamsButton = document.createElement('button');
            requestParamsButton.textContent = '查看参数';
            requestParamsButton.style.padding = '6px 12px';
            requestParamsButton.style.backgroundColor = '#f0f0f0';
            requestParamsButton.style.border = '1px solid #ddd';
            requestParamsButton.style.borderRadius = '5px';
            requestParamsButton.style.textAlign = 'center';
            requestParamsButton.style.color = '#333333';
            requestParamsButton.style.fontSize = '0.8em';
            requestParamsButton.style.cursor = 'pointer';
            requestParamsButton.style.transition = 'background-color 0.3s ease';
            requestParamsButton.addEventListener('mouseover', function () {
                this.style.backgroundColor = '#e0e0e0';
            });
            requestParamsButton.addEventListener('mouseout', function () {
                this.style.backgroundColor = '#f0f0f0';
            });
            commonStyleDiv.appendChild(requestParamsButton);

            // 创建响应按钮
            const viewResponseButton = document.createElement('button');
            if(isPingPopup){
                viewResponseButton.textContent = '查看请求';
            }else{
                viewResponseButton.textContent = '查看响应';
            }
            viewResponseButton.style.padding = '6px 12px';
            viewResponseButton.style.backgroundColor = '#f0f0f0';
            viewResponseButton.style.border = '1px solid #ddd';
            viewResponseButton.style.borderRadius = '5px';
            viewResponseButton.style.textAlign = 'center';
            viewResponseButton.style.color = '#333333';
            viewResponseButton.style.fontSize = '0.8em';
            viewResponseButton.style.cursor = 'pointer';
            viewResponseButton.style.transition = 'background-color 0.3s ease';
            viewResponseButton.style.marginTop = '6px';
            viewResponseButton.addEventListener('mouseover', function() {
                this.style.backgroundColor = '#e0e0e0';
            });
            viewResponseButton.addEventListener('mouseout', function() {
                this.style.backgroundColor = '#f0f0f0';
            });

            commonStyleDiv.appendChild(viewResponseButton);

            // 创建响应预览弹窗
            const responseTooltip = createPreviewTooltip(data, '响应内容', viewResponseButton);

            // 查看响应按钮事件
            viewResponseButton.addEventListener('mouseenter', function() {
                responseTooltip.style.display = 'block';
            });

            viewResponseButton.addEventListener('mouseleave', function() {
                if (!responseTooltip.dataset.fixed) {
                    responseTooltip.style.display = 'none';
                }
            });

            // 点击查看响应按钮固定弹窗
            viewResponseButton.addEventListener('click', function() {
                if (responseTooltip.dataset.fixed) {
                    delete responseTooltip.dataset.fixed;
                    this.textContent = '查看响应';
                    responseTooltip.style.display = 'none';
                } else {
                    responseTooltip.dataset.fixed = 'true';
                    this.textContent = '关闭响应';
                    responseTooltip.style.display = 'block';
                }
            });



            // 创建请求参数预览弹窗

            if(requestInputs != null){

                const input = requestInputs[i].input;
                const init = requestInputs[i].init;
                let params;
                if (init && init.body instanceof Blob) {
                    params = await getRequestParams(input, init);
                } else {
                    params = getRequestParams(input, init);
                }
                const requestParamsTooltip = createPreviewTooltip(JSON.stringify(params, null, 2), '请求参数');

                // 请求参数按钮事件
                requestParamsButton.addEventListener('mouseenter', function () {
                    requestParamsTooltip.style.display = 'block';
                });

                requestParamsButton.addEventListener('mouseleave', function () {
                    if (!requestParamsTooltip.dataset.fixed) {
                        requestParamsTooltip.style.display = 'none';
                    }
                });


                // 点击请求参数按钮固定弹窗
                requestParamsButton.addEventListener('click', function () {
                    if (requestParamsTooltip.dataset.fixed) {
                        delete requestParamsTooltip.dataset.fixed;
                        requestParamsButton.textContent = '查看参数';
                        requestParamsTooltip.style.display = 'none';
                    } else {
                        requestParamsTooltip.dataset.fixed = 'true';
                        requestParamsButton.textContent = '关闭参数';
                        requestParamsTooltip.style.display = 'block';
                    }
                });
                commonStyleDiv.appendChild(requestParamsTooltip);
            }else{
                requestParamsButton.remove()
            }

            commonStyleDiv.appendChild(responseTooltip);
            const noShowButton = createNoShowButton();
            commonStyleDiv.appendChild(noShowButton);

            document.body.appendChild(commonStyleDiv);
            if (isMoreThanThree) {
                const repeatText = document.createElement('span');
                repeatText.textContent = '重复';
                repeatText.style.color = 'red';
                repeatText.style.display = 'block';
                repeatText.style.marginTop = '6px';
                commonStyleDiv.appendChild(repeatText);
            }
            if (isPingPopup) {
                pingPopupCount++;
            } else {
                getValidFormPopupCount++;
            }
        }
    }

    function removeDuplicates(responses) {
        const uniqueResponses = [];
        const seen = new Set();
        responses.forEach(response => {
            const key = JSON.stringify({ input: response.input, init: response.init, response: response.response });
            if (!seen.has(key)) {
                seen.add(key);
                uniqueResponses.push(response);
            }
        });
        return uniqueResponses;
    }


    var now = new Date();
            var dateTimeString = now.toLocaleString();
            var matchArray = dateTimeString.match(/\d+/g);
            var year = matchArray[0];
            var month = matchArray[1];
            var date = matchArray[2];
            var hour = matchArray[3];
            var minute = matchArray[4];
            var second = matchArray[5];
            var currentTime = year + month + date + hour + minute + second;

    // 监听 fetch 请求
    const allFetchPromises = [];
    const originalFetch = window.fetch;
    window.fetch = function(input, init) {

        const url = typeof input === 'string' ? input : input.url;

        if (url.includes('/api-client/form/getValidForm')) {

            if (getValidFormPopupCount >= 6) {
                const popupForms = document.querySelectorAll('.popup-form');
                popupForms.forEach(popup => popup.remove());
                getValidFormPopupCount = 0;
                showToast(`弹窗请求数量超过 6 个，已全部清除 - ${currentTime}`);
            }


            hasGetValidFormRequest = true;
            allRequestInputs.push({ input, init });
            console.info("allRequestInputs",allRequestInputs)
            requestCount++;
            const fetchPromise = originalFetch(input, init)
            .then(async response => {
                const responseClone = response.clone();

                try {
                    const responseJson = await responseClone.json();
                    console.log('接口响应内容:', responseJson);

                    if (responseJson.data) {
                        if (responseJson.code === 'SUCCESS') {
                            try {
                                const decryptedData = await decryptAES(responseJson.data, keyHex, ivHex);
                                allDecryptedData.push(JSON.stringify(JSON.parse(decryptedData), null, 2));
                            } catch (e) {
                                console.error('解密失败:', e);
                                createPopup([], allRequestInputs, true, false, JSON.stringify({
                                    error: '解密失败',
                                    status: response.status
                                },null,2));
                            }
                        } else {
                            createPopup([], allRequestInputs, true, false, responseJson);
                        }
                    } else {
                        // 记录无 data 的响应
                        createPopup([], allRequestInputs, false, false, responseJson, false, true);
                    }
                } catch (e) {
                    console.error('响应解析失败:', e);
                    createPopup([], allRequestInputs, true, false, JSON.stringify({
                        error: '响应解析失败',
                        status: response.status
                    },null,2));
                }

                completedRequestCount++;
                if (completedRequestCount === requestCount) {
                    if (allDecryptedData.length > 0) {
                        createPopup(allDecryptedData, allRequestInputs);
                    }
                }
                return response;
            });
            allFetchPromises.push(fetchPromise);
            console.info("fetchPromise",fetchPromise);
            Promise.all(allFetchPromises)
            return fetchPromise
        }
        if (url.includes('/api-client/form/saveFormInfo')) {
            return originalFetch(input, init)
                .then(async response => {
                const responseClone = response.clone();
                const responseJson = await responseClone.json();
                if (responseJson.data) {
                    if (responseJson.code === 'SUCCESS') {
                        showToast("保存表单收集信息成功")
                    } else {
                        showToast("保存表单收集信息失败!!!")
                    }
                }
                return response;
            });
        }

        return originalFetch(input, init);
    };


    // 重写 navigator.sendBeacon 方法来捕获请求
    const originalSendBeacon = navigator.sendBeacon;
    navigator.sendBeacon = function (url, data) {
        if (url.includes('/eclytics/n.gif')) {
            // 检查 ping 弹窗数量，若大于 5 个则全部清除并提示
            if (pingPopupCount >= 5) {
                const pingPopups = document.querySelectorAll('.ping-popup');
                pingPopups.forEach(popup => popup.remove());
                pingPopupCount = 0;
                showToast(`上报弹窗数量超过 5 个，已全部清除 - ${currentTime}`);
            }

            // 读取 Blob 数据
            const reader = new FileReader();
            reader.onload = function () {
                const blobText = decodeUrlParams(reader.result);
                let beaconParams = {};
                if (blobText) {
                    const pairs = blobText.split('&');
                    pairs.forEach(pair => {
                        const [key, value] = pair.split('=');
                        beaconParams[key] = decodeUrlParams(value);
                    });
                }

                const combinedParams = {...beaconParams };

                pingRequests.push({ url, data: combinedParams });
                createPopup([JSON.stringify(combinedParams, null, 2)], null, false, false, null, true, false);
            };
            reader.readAsText(data);
        }
        return originalSendBeacon.call(this, url, data);
    };
    window.addEventListener('load', function () {
        Promise.all(allFetchPromises)
            .then(() => {
            if (!hasGetValidFormRequest) {
                createPopup([], [], false, true, null, false);
            }
        })
            .catch((error) => {
            console.error('An error occurred during fetch requests:', error);
        });

    });


})();