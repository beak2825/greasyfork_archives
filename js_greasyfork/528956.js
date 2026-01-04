// ==UserScript==
// @name         OSS JSON Viewer Pro
// @namespace    http://your-namespace.com
// @version      5.1
// @description  专业级OSS文件查看器
// @match        *://*.aliyuncs.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528956/OSS%20JSON%20Viewer%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/528956/OSS%20JSON%20Viewer%20Pro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 立即停止原始加载
    window.stop();
    document.documentElement.innerHTML = '';

    // 创建容器
    const container = document.createElement('div');
    container.id = 'json-viewer-pro';
    document.documentElement.appendChild(container);

    // 加载动画
    container.innerHTML = `<div class="loader"></div>`;

    // 样式注入
    GM_addStyle(`
        #json-viewer-pro {
            padding: 20px;
            font-family: 'Consolas', monospace;
            background: #1e1e1e;
            color: #d4d4d4;
            min-height: 100vh;
        }
        .json-key {
            color: #9cdcfe;
            font-weight: bold;
        }
        .json-string {
            color: #ce9178;
            background: rgba(206,145,120,0.1);
            padding: 2px 4px;
            border-radius: 3px;
        }
        .json-number {
            color: #b5cea8;
            font-weight: bold;
        }
        .json-boolean {
            color: #569cd6;
            font-style: italic;
        }
        .json-null {
            color: #808080;
            font-style: italic;
        }
        .loader {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 2s linear infinite;
            margin: 20px auto;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .json-item {
            margin: 4px 0;
            padding-left: 20px;
            position: relative;
            border-left: 1px solid rgba(255,255,255,0.1);
        }
        .json-item::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            width: 12px;
            height: 100%;
            border-left: 1px solid rgba(255,255,255,0.1);
        }
        .json-item:hover {
            background: rgba(255,255,255,0.03);
        }
        .json-collapse {
            cursor: pointer;
            margin-right: 5px;
        }
        .json-collapse::after {
            content: '▼';
            font-size: 10px;
            color: #9cdcfe;
            margin-right: 5px;
        }
        .json-collapse.collapsed::after {
            content: '▶';
        }
        .json-count {
            color: #888;
            font-size: 0.9em;
            margin-left: 5px;
        }
        .json-image {
            max-width: 100%;
            max-height: 200px;
            margin: 5px 0;
            border-radius: 3px;
            box-shadow: 0 0 5px rgba(0,0,0,0.2);
        }
        .json-text {
            white-space: pre-wrap;
            background: rgba(255,255,255,0.05);
            padding: 5px;
            border-radius: 3px;
            margin: 5px 0;
        }
        .json-content {
            margin-left: 8px;
            padding-left: 12px;
            border-left: 1px dashed rgba(255,255,255,0.1);
        }
        button:hover {
            background: #1177bb !important;
        }
        button:active {
            background: #0e5389 !important;
        }
    `);

    // 获取数据
    GM_xmlhttpRequest({
        method: 'GET',
        url: location.href,
        responseType: 'arraybuffer',
        onload: (res) => {
            container.innerHTML = '';
            try {
                const decoder = new TextDecoder('utf-8');
                const jsonData = JSON.parse(decoder.decode(res.response));
                renderJSON(jsonData);
            } catch(e) {
                container.innerHTML = `<div class="error">数据解析失败: ${e.message}</div>`;
            }
        },
        onerror: (err) => {
            container.innerHTML = `<div class="error">请求失败: ${err.statusText}</div>`;
        }
    });

    function addControlButtons(container, data) {
        const buttonStyle = `
            padding: 6px 12px;
            margin-right: 10px;
            background: #0e639c;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        `;

        const buttonContainer = document.createElement('div');
        buttonContainer.style.marginBottom = '20px';

        // 复制按钮
        const copyButton = document.createElement('button');
        copyButton.textContent = '复制 JSON';
        copyButton.style.cssText = buttonStyle;
        copyButton.onclick = () => {
            navigator.clipboard.writeText(JSON.stringify(data, null, 2))
                .then(() => {
                    copyButton.textContent = '已复制!';
                    setTimeout(() => copyButton.textContent = '复制 JSON', 2000);
                })
                .catch(err => alert('复制失败: ' + err));
        };

        // 展开全部按钮
        const expandButton = document.createElement('button');
        expandButton.textContent = '展开全部';
        expandButton.style.cssText = buttonStyle;
        expandButton.onclick = () => {
            container.querySelectorAll('.json-content').forEach(content => {
                content.style.display = '';
            });
            container.querySelectorAll('.json-collapse').forEach(collapse => {
                collapse.classList.remove('collapsed');
            });
        };

        // 折叠全部按钮
        const collapseButton = document.createElement('button');
        collapseButton.textContent = '折叠全部';
        collapseButton.style.cssText = buttonStyle;
        collapseButton.onclick = () => {
            container.querySelectorAll('.json-content').forEach(content => {
                content.style.display = 'none';
            });
            container.querySelectorAll('.json-collapse').forEach(collapse => {
                collapse.classList.add('collapsed');
            });
        };

        buttonContainer.appendChild(copyButton);
        buttonContainer.appendChild(expandButton);
        buttonContainer.appendChild(collapseButton);

        return buttonContainer;
    }

    function renderJSON(data) {
        const countChildren = (obj) => {
            if (!obj || typeof obj !== 'object') return 0;
            return Object.keys(obj).length;
        };

        const render = (obj, indent = 0) => {
            if (Array.isArray(obj)) {
                return obj.map(item => {
                    if (typeof item === 'object' && item !== null) {
                        return `
                            <div class="json-item">
                                {
                                ${renderObject(item, indent + 1)}
                                }
                            </div>
                        `;
                    }
                    return `
                        <div class="json-item">
                            ${formatValue(item)}
                        </div>
                    `;
                }).join('');
            }
            return renderObject(obj, indent);
        };

        const renderObject = (obj, indent = 0) => {
            return Object.entries(obj).map(([key, value]) => {
                const indentStr = '&nbsp;'.repeat(indent * 4);
                const count = countChildren(value);

                if (typeof value === 'object' && value !== null) {
                    const isArray = Array.isArray(value);
                    return `
                        <div class="json-item" data-json='${JSON.stringify(value)}'>
                            <span class="json-collapse"></span>
                            <span class="json-key">"${key}"</span>:
                            ${isArray ?
                                `[<span class="json-count">${count} items</span>` :
                                `{<span class="json-count">${count} keys</span>`}
                            <div class="json-content">
                                ${render(value, indent + 1)}
                            </div>
                            ${isArray ? ']' : '}'},
                        </div>
                    `;
                }

                // Handle image URLs
                if (typeof value === 'string' &&
                    (value.match(/\.(jpeg|jpg|gif|png)$/) ||
                     value.startsWith('data:image/'))) {
                    return `
                        <div class="json-item">
                            <span class="json-key">"${key}"</span>:
                            <img src="${value}" class="json-image" alt="${key} image"/>
                        </div>
                    `;
                }

                // Handle multi-line text
                if (typeof value === 'string' && value.includes('\n')) {
                    return `
                        <div class="json-item">
                            <span class="json-key">"${key}"</span>:
                            <div class="json-text">${value}</div>
                        </div>
                    `;
                }

                return `
                    <div class="json-item">
                        <span class="json-key">"${key}"</span>:
                        ${formatValue(value)},
                    </div>
                `;
            }).join('');
        };

        const formatValue = (value) => {
            if (typeof value === 'string') {
                // Skip formatting if it's an image URL or multi-line text
                if (value.match(/\.(jpeg|jpg|gif|png)$/) ||
                    value.startsWith('data:image/') ||
                    value.includes('\n')) {
                    return '';
                }
                return `<span class="json-string">"${value}"</span>`;
            }
            if (typeof value === 'number') return `<span class="json-number">${value}</span>`;
            if (typeof value === 'boolean') return `<span class="json-boolean">${value}</span>`;
            if (value === null) return `<span class="json-null">null</span>`;
            return '';
        };

        container.innerHTML = '';
        container.appendChild(addControlButtons(container, data));
        const jsonContainer = document.createElement('div');
        jsonContainer.style.marginTop = '20px';
        jsonContainer.innerHTML = render(data);
        container.appendChild(jsonContainer);

        // 修改折叠功能
        document.querySelectorAll('.json-collapse').forEach(collapse => {
            collapse.addEventListener('click', function() {
                const parent = this.parentElement;
                const content = parent.querySelector('.json-content');
                const countSpan = parent.querySelector('.json-count');
                const jsonData = JSON.parse(parent.getAttribute('data-json'));
                const isArray = Array.isArray(jsonData);

                if (content.style.display === 'none') {
                    content.style.display = '';
                    countSpan.textContent = isArray ?
                        `${jsonData.length} items` :
                        `${Object.keys(jsonData).length} keys`;
                } else {
                    content.style.display = 'none';
                    countSpan.textContent = isArray ?
                        `${jsonData.length} items` :
                        `${Object.keys(jsonData).length} keys`;
                }

                this.classList.toggle('collapsed');
            });
        });
    }
})();
