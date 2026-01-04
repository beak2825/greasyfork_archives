// ==UserScript==
// @name         DeepSeek 对话导出器 优化版(Optimized version of dialogue exporter)
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  1. 优化了旧版UI,现在不在阻挡视野 2. 针对ds缓冲机制进行了优化，现在无需 重新登陆/继续对话 也可以导出对话
// @author       口吃者
// @match        https://chat.deepseek.com/a/chat/s/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deepseek.com
// @require      https://update.greasyfork.org/scripts/498507/1398070/sweetalert2.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/525805/DeepSeek%20%E5%AF%B9%E8%AF%9D%E5%AF%BC%E5%87%BA%E5%99%A8%20%E4%BC%98%E5%8C%96%E7%89%88%28Optimized%20version%20of%20dialogue%20exporter%29.user.js
// @updateURL https://update.greasyfork.org/scripts/525805/DeepSeek%20%E5%AF%B9%E8%AF%9D%E5%AF%BC%E5%87%BA%E5%99%A8%20%E4%BC%98%E5%8C%96%E7%89%88%28Optimized%20version%20of%20dialogue%20exporter%29.meta.js
// ==/UserScript==
var comment_params = { "chat_session_id": '' };
var headersAuthorization = '';
class DsExportTool {
    constructor(sessionId = '', jsonData = '', markdownData = '') {
        this.sessionId = sessionId;  
        this.jsonData = jsonData; 
        this.markdownData = markdownData;
    }

    // 导出JSON文件方法
    exportDsJsonData() { 
        if (!this.jsonData) {
            console.error('No JSON data to export');
            return;
        }
        let outputData;
        if (typeof this.jsonData === 'string') {
            // 如果数据是字符串，尝试解析为对象（确保有效性）
            try {
                outputData = JSON.parse(this.jsonData);
            } catch (e) {
                console.error('Invalid JSON string:', e);
                return;
            }
        } else {
            // 如果已经是对象/数组，直接使用
            outputData = this.jsonData;
        }

        // 生成格式化的JSON（仅需一次序列化）
        const jsonString = JSON.stringify(outputData, null, 2);

        // 创建JSON类型Blob（修正MIME类型）
        const blob = new Blob([jsonString], {
            type: 'application/json;charset=utf-8'
        });

        // 生成带时间戳和会话ID的文件名（示例：chat_export_12345_20230815.json）
        const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const filename = `chat_export_${this.sessionId || 'unknown'}_${timestamp}.json`;

        // 创建下载链接
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = filename;
        anchor.style.display = 'none';

        // 触发下载
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);
    }

    // 新增 Markdown 导出方法
    exportDsMarkdownData() { // 注意方法名驼峰式命名
        if (!this.markdownData) {
            console.error('No Markdown data to export');
            return;
        }

        // 创建标准 Markdown Blob（指定 MIME 类型）
        const blob = new Blob([this.markdownData], {
            type: 'text/markdown;charset=utf-8' // 或使用 text/plain
        });

        // 生成带时间戳的文件名（示例：chat_history_12345_20230815.md）
        const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const filename = `chat_history_${this.sessionId || 'unknown'}_${timestamp}.md`;

        // 创建并触发下载链接
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = filename;
        anchor.style.display = 'none';

        document.body.appendChild(anchor);
        anchor.click();

        // 清理资源
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);
    }
}
const dsExportTool = new DsExportTool();
(function () {
    'use strict';


    const originalOpen = XMLHttpRequest.prototype.open;

    const authorizationParamsReady = new Promise((resolve) => {
        // 保存原始 open 方法
        const originalOpen = XMLHttpRequest.prototype.open;
        // 保存原始 send 方法（关键！）
        const originalSend = XMLHttpRequest.prototype.send;
        // 保存原始 setRequestHeader 方法
        const originalSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

        // 重写 setRequestHeader 以捕获请求头
        XMLHttpRequest.prototype.setRequestHeader = function (name, value) {
            this._requestHeaders = this._requestHeaders || {};
            this._requestHeaders[name.toLowerCase()] = value;
            originalSetRequestHeader.apply(this, arguments);
        };

        // 重写 open 方法
        XMLHttpRequest.prototype.open = function (method, url) {
            // 先调用原始 open（确保兼容性）
            originalOpen.apply(this, arguments);

            // 仅监听目标 URL
            if (['chat/history_messages'].some(substring => url.includes(substring))) {
                // 重写 send 方法以在请求发送时捕获 Authorization
                const _this = this;
                this.send = function (body) {
                    // 从缓存的请求头中获取 Authorization
                    const authHeader = _this._requestHeaders?.authorization;
                    if (authHeader) {
                        headersAuthorization = authHeader;
                        // 监听请求完成
                        _this.addEventListener('readystatechange', function () {
                            if (this.readyState === 4 && this.status === 200) {
                                resolve({ authorization: authHeader });
                            }
                        });
                    }
                    // 调用原始 send
                    originalSend.call(this, body);
                };
            }
        };
    });

    window.addEventListener('load', addPanel);
})();

function addPanel() {
    function genButton(text, foo, id, fooParams = {}) {
        let b = document.createElement('button');
        b.textContent = text;
        b.style.verticalAlign = 'inherit';
        // 使用箭头函数创建闭包来保存 fooParams 并传递给 foo
        b.addEventListener('click', () => {
            foo.call(b, ...Object.values(fooParams)); // 使用 call 方法确保 this 指向按钮对象
        });
        if (id) { b.id = id };
        return b;
    }

    function changeRangeDynamics() {
        const value = parseInt(this.value, 10);
        const roundedValue = Math.ceil(value / 10) * 10;

        targetAmountGlobal = roundedValue;
        // 只能通过 DOM 方法改变
        document.querySelector('#swal-range > output').textContent = roundedValue;
    }

    async function openPanelFunc() {
        let isLoadEnd = false;
        const { value: formValues } = await Swal.fire({
            title: "选择导出类型",
            showCancelButton: true,
            cancelButtonText: '取消',
            confirmButtonText: '确定',
            //class="swal2-range" swalalert框架可能会对其有特殊处理，导致其内标签的id声明失效
            html: `
              <div class="swal2-radio">
              <input type="radio" id="option1" name="options" value="option1" checked>
              <label for="option1"><span class="swal2-label" checked>Json</span></label>
              <input type="radio" id="option2" name="options" value="option2">
              <label for="option2"><span class="swal2-label">Markdown</span></label>
            </div>
            `,
            focusConfirm: false,
            didOpen: () => {
                // const swalRange = document.querySelector('#swal-range input');
                // swalRange.addEventListener('input', changeRangeDynamics);
                document.querySelector('.swal2-radio > input[type=radio]:nth-child(1)').checked = true;
            },
            willClose: () => {
                // 在关闭前清除事件监听器以防止内存泄漏
                // const swalRange = document.querySelector('#swal-range input');
                // swalRange.removeEventListener('input', changeRangeDynamics);
            },
            preConfirm: () => {
                return [
                    document.querySelector('.swal2-radio>input[name="options"]:checked').value
                ];
            }
        });
        if (formValues) {
            dsExportOption = formValues[0];
            exportDsByOption(dsExportOption);
        }
    }

    let myButton = genButton('DsExport', openPanelFunc, 'DsExport');
    document.body.appendChild(myButton);

    var css_text = `
        #DsExport {
            position: fixed;
            color: rgb(211, 67, 235);
            top: 70%;
            left: -20px;/* 初始状态下左半部分隐藏 */
            transform: translateY(-50%);
            z-index: 1000; /* 确保按钮在最前面 */
            padding: 10px 24px;
            border-radius: 5px;
            cursor: pointer;
            border: 0;
            background-color: white;
            box-shadow: rgb(0 0 0 / 5%) 0 0 8px;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            font-size: 9px;
            transition: all 0.5s ease;
        }
        #DsExport:hover {
            left: 0%; /* 鼠标悬停时完整显示 */
            letter-spacing: 3px;
            background-image: linear-gradient(to top, #fad0c4 0%, #fad0c4 1%, #ffd1ff 100%);
            box-shadow: rgba(211, 67, 235, 0.7) 0px 7px 29px 0px; /* 更柔和的紫色阴影，带透明度 */
        }
        
        #DsExport:active {
            letter-spacing: 3px;
            background-image: linear-gradient(to top, #fad0c4 0%, #fad0c4 1%, #ffd1ff 100%);
            box-shadow: rgba(211, 67, 235, 0.5) 0px 0px 0px 0px; /* 活动状态下的阴影，保持一致性 */
            transition: 100ms;
        }
    `
    GMaddStyle(css_text);
}
function getFinalCommentUrl(params) {
    // 指定参数的顺序
    const orderKeys = ["chat_session_id"];

    // 按照指定顺序构建参数列表
    const orderedParams = orderKeys
        .filter(key => params.hasOwnProperty(key))
        .map(key => key === 'pagination_str'
            ? `${key}=${encodeURIComponent(params[key])}`
            : `${key}=${params[key]}`);

    // 构建新的URL
    const newUrl = 'https://chat.deepseek.com/api/v0/chat/history_messages?' + orderedParams.join('&');

    return newUrl;
}

async function fetchChatMessage() {
    const finalUrl = getFinalCommentUrl(comment_params);
    const response = await fetch(finalUrl, {
        headers: {
            'authorization': headersAuthorization
        },
        credentials: 'include'  // 明确指定携带cookies
    });
    return await response.json();
}
function GMaddStyle(css) {
    var myStyle = document.createElement('style');
    myStyle.textContent = css;
    var doc = document.head || document.documentElement;
    doc.appendChild(myStyle);
}
async function exportDsByOption(dsExportOption) {
    const currentUrl = window.location.href;
    const currentUrlParts = currentUrl.split('/');
    const currentUrlLastPart = currentUrlParts[currentUrlParts.length - 1];
    if (dsExportTool.sessionId != currentUrlLastPart) {
        dsExportTool.sessionId = currentUrlLastPart;
        comment_params["chat_session_id"] = dsExportTool.sessionId;
        const chatMessage = await fetchChatMessage();
        dsExportTool.markdownData = convertJsonToMd(chatMessage);
        dsExportTool.jsonData = JSON.stringify(chatMessage);
    }
    if (dsExportOption === 'option1') {
        dsExportTool.exportDsJsonData();
    } else if (dsExportOption === 'option2') {
        dsExportTool.exportDsMarkdownData();
    }
}
function convertJsonToMd(data) {
    let mdContent = [];
    const title = data.data.biz_data.chat_session.title || 'Untitled Chat';
    const totalTokens = data.data.biz_data.chat_messages.reduce((acc, msg) => acc + msg.accumulated_token_usage, 0);
    mdContent.push(`# DeepSeek - ${title} (Total Tokens: ${totalTokens})\n`);

    data.data.biz_data.chat_messages.forEach(msg => {
        const role = msg.role === 'USER' ? 'Human' : 'Assistant';
        mdContent.push(`### ${role}`);

        const timestamp = new Date(msg.inserted_at * 1000).toISOString();
        mdContent.push(`*${timestamp}*\n`);

        if (msg.files && msg.files.length > 0) {
            msg.files.forEach(file => {
                const insertTime = new Date(file.inserted_at * 1000).toISOString();
                const updateTime = new Date(file.updated_at * 1000).toISOString();
                mdContent.push(`### File Information`);
                mdContent.push(`- Name: ${file.file_name}`);
                mdContent.push(`- Size: ${file.file_size} bytes`);
                mdContent.push(`- Token Usage: ${file.token_usage}`);
                mdContent.push(`- Upload Time: ${insertTime}`);
                mdContent.push(`- Last Update: ${updateTime}\n`);
            });
        }

        let content = msg.content;

        if (msg.search_results && msg.search_results.length > 0) {
            const citations = {};
            msg.search_results.forEach((result, index) => {
                if (result.cite_index !== null) {
                    citations[result.cite_index] = result.url;
                }
            });
            content = content.replace(/\[citation:(\d+)\]/g, (match, p1) => {
                const url = citations[parseInt(p1)];
                return url ? ` [${p1}](${url})` : match;
            });
            content = content.replace(/\s+,/g, ',').replace(/\s+\./g, '.');
        }

        if (msg.thinking_content) {
            const thinkingTime = msg.thinking_elapsed_secs ? `(${msg.thinking_elapsed_secs}s)` : '';
            content += `\n\n**Thinking Process ${thinkingTime}:**\n${msg.thinking_content}`;
        }

        content = content.replace(/\$\$(.*?)\$\$/gs, (match, formula) => {
            return formula.includes('\n') ? `\n$$\n${formula}\n$$\n` : `$$${formula}$$`;
        });

        mdContent.push(content + '\n');
    });

    return mdContent.join('\n');
}
