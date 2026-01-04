// ==UserScript==
// @name         SDoc链接解析
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  实现 sdoc 链接后缀的数字的自动解析&跳转功能；
// @author       Dodo
// @match        *://*/*
// @connect      arc.sheincorp.cn
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540005/SDoc%E9%93%BE%E6%8E%A5%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/540005/SDoc%E9%93%BE%E6%8E%A5%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // md 先不管了，解决不了油猴多运行的问题，不影响使用
    if (window.top !== window.self || window.arcParserHasRun) {
        return;
    }
    window.arcParserHasRun = true;

    // type 映射，后续得新增 ppt/excel，等 sdoc 更新
    const FILE_TYPE_MAP = {
        1: '图表 (Diagraming)', 2: '文档 (Docs)',
        3: '导图 (Minds)',      4: '绘图 (Drawing)',
    };
    const URL_PREFIX_MAP = {
        1: 'https://arc.sheincorp.cn/diagraming/', 2: 'https://arc.sheincorp.cn/docs/',
        3: 'https://arc.sheincorp.cn/minds/',      4: 'https://arc.sheincorp.cn/drawing/',
    };
    const FALLBACK_EXCEL_PREFIX = 'https://arc.sheincorp.cn/excel/';
    // LOGO 修改为可爱的 labubu
    const LOGO_URL = 'https://pic1.imgdb.cn/item/68540ffc58cb8da5c85bf8f6.png';
    const API_DETAILED = 'https://arc.sheincorp.cn/arc-service/file/get/';
    const API_GENERAL_CHECK = 'https://arc.sheincorp.cn/arc-service/file/get_file_need_info/';

    // 通知
    function checkForNotification() {
        if (window.location.hash.startsWith('#sdoc-parser=')) {
            try {
                const params = new URLSearchParams(window.location.hash.substring(1));
                const info = {
                    name: decodeURIComponent(params.get('name')),
                    author: decodeURIComponent(params.get('author')),
                    type: decodeURIComponent(params.get('type'))
                };
                showModernAlert(info, 3500);
                if(params.get('fallback') === 'true') {
                    showCenterToast('SDoc 未区分表格/PPT 文件类型，默认使用表格模式', 2500);
                }
                history.replaceState(null, null, window.location.pathname + window.location.search);
            } catch (e) {
                console.error("SDoc Parser: Error processing notification.", e);
            }
        }
    }

    function showModernAlert(info, duration) {
        const alertContainer = document.createElement('div');
        alertContainer.id = 'arc-parser-modern-alert';
        alertContainer.innerHTML = `
            <div class="alert-header">已为你自动跳转至对应文档类型</div>
            <div class="alert-body">
                <div class="alert-icon"><img src="${LOGO_URL}" style="width: 32px; height: 32px; border-radius: 6px;" /></div>
                <div class="alert-content">
                    <div class="alert-title">${info.name}</div>
                    <div class="alert-meta">
                        <span><strong>类型:</strong> ${info.type}</span>
                        <span><strong>作者:</strong> ${info.author}</span>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(alertContainer);
        setTimeout(() => alertContainer.classList.add('visible'), 50);
        setTimeout(() => {
            alertContainer.classList.remove('visible');
            setTimeout(() => { if (document.body.contains(alertContainer)) document.body.removeChild(alertContainer); }, 500);
        }, duration);
    }

    function showCenterToast(message, duration) {
        const toast = document.createElement('div');
        toast.id = 'arc-parser-center-toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('visible'), 50);
        setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => { if(document.body.contains(toast)) document.body.removeChild(toast); }, 500);
        }, duration);
    }

    // Btn 交互
    function createButton() {
        const button = document.createElement('div');
        button.id = 'arc-parser-button';
        button.style.backgroundImage = `url(${LOGO_URL})`;
        document.body.appendChild(button);

        let startX, startY, startTop;

        const onMouseMove = (e) => {
            requestAnimationFrame(() => {
                const newTop = startTop + e.clientY - startY;
                const maxTop = window.innerHeight - button.offsetHeight - 10;
                button.style.top = `${Math.max(10, Math.min(newTop, maxTop))}px`;
            });
        };

        const onMouseUp = (e) => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            document.body.style.userSelect = '';

            const distanceMoved = Math.sqrt(Math.pow(e.clientX - startX, 2) + Math.pow(e.clientY - startY, 2));
            if (distanceMoved < 5) {
                startParsingProcess();
            }
        };

        button.addEventListener('mousedown', (e) => {
            e.preventDefault();
            startX = e.clientX;
            startY = e.clientY;
            startTop = button.offsetTop;
            document.body.style.userSelect = 'none';
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
        });
    }

    // Btn 样式
    GM_addStyle(`
        #arc-parser-button {
            position: fixed; top: 200px; right: 15px; /* 调整了与边缘的距离 */
            z-index: 99999; width: 40px; height: 40px;
            background-size: contain; background-repeat: no-repeat; background-position: center;
            border-radius: 8px; cursor: grab;
            box-shadow: 0 4px 12px rgba(0,0,0,0.25);
            transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        #arc-parser-button:hover { transform: scale(1.1); }
        #arc-parser-button:active { cursor: grabbing; }
        #arc-parser-modern-alert { position: fixed; top: 25px; right: 25px; z-index: 2147483647; background: rgba(255, 255, 255, 0.7); color: #333; border-radius: 14px; box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.15); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.2); padding: 12px 16px; opacity: 0; transform: translateX(120%); transition: all 0.5s cubic-bezier(0.1, 0.9, 0.2, 1); }
        #arc-parser-modern-alert.visible { opacity: 1; transform: translateX(0); }
        .alert-header { font-size: 13px; font-weight: 500; color: #555; padding-bottom: 8px; border-bottom: 1px solid rgba(0,0,0,0.08); margin-bottom: 8px; }
        .alert-body { display: flex; align-items: center; }
        .alert-icon { margin-right: 14px; flex-shrink: 0; }
        .alert-content .alert-title { font-size: 15px; font-weight: 600; color: #111; max-width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .alert-content .alert-meta { font-size: 12px; color: #555; margin-top: 4px; }
        .alert-content .alert-meta span { margin-right: 12px; }
        #arc-parser-center-toast { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0.9); z-index: 2147483647; background: rgba(17, 17, 17, 0.8); color: #fff; padding: 12px 22px; border-radius: 8px; font-size: 15px; font-weight: 500; opacity: 0; transition: all 0.3s cubic-bezier(0.1, 0.9, 0.2, 1); pointer-events: none; }
        #arc-parser-center-toast.visible { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    `);

    // 解析
    async function startParsingProcess() {
        let inputId = prompt("请输入文档ID（会自动解析字符串的数字部分）:", "");

        if (!inputId) { // 取消&null
            return;
        }

        const extractedId = inputId.replace(/[^0-9]/g, '');

        if (!extractedId) {
            alert("输入内容中未找到有效数字ID，请重新输入");
            return;
        }

        const trimmedId = extractedId; // 提纯数字

        // 网络请求处理
        const request = (url) => new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                responseType: "json",
                onload: resolve,
                onerror: reject,
                ontimeout: reject
            });
        });

        // 网络错误处理
        try {
            const detailedResponse = await request(`${API_DETAILED}${trimmedId}?tenantId=1`);
            const detailedData = detailedResponse?.response;

            if (detailedData?.code === "0") {
                const info = detailedData.info;
                const urlPrefix = URL_PREFIX_MAP[info.fileType];
                if (urlPrefix) {
                    const noticeParams = new URLSearchParams({
                        'sdoc-parser': 'true', name: info.name, author: info.ownerName, type: FILE_TYPE_MAP[info.fileType] || '未知'
                    });
                    GM_openInTab(`${urlPrefix}${trimmedId}#${noticeParams.toString()}`, { active: true });
                } else {
                    alert(`识别到SDoc功能更新，新的文件类型：${info.fileType}\n(文件名: ${info.name})\n\n给 domi 请一杯咖啡让更新下脚本好吗？`);
                }
            } else if (detailedData?.code === "drawio404") {
                alert("文档不存在，请检查后重新输入");
            } else if (detailedData?.code === "drawio0003") {
                 const noticeParams = new URLSearchParams({
                    'sdoc-parser': 'true', name: '无权限访问此文档', author: '请联系作者开通权限', type: '受限文件'
                });
                GM_openInTab(`${FALLBACK_EXCEL_PREFIX}${trimmedId}#${noticeParams.toString()}`, { active: true });
            }
            else {
                const generalResponse = await request(`${API_GENERAL_CHECK}${trimmedId}`);
                const generalData = generalResponse?.response;
                if (generalData?.code === "0" && generalData.info.name) {
                    const info = generalData.info;
                    const noticeParams = new URLSearchParams({
                        'sdoc-parser': 'true', name: info.name, author: info.ownerName, type: '表格 / PPT', fallback: 'true'
                    });
                    GM_openInTab(`${FALLBACK_EXCEL_PREFIX}${trimmedId}#${noticeParams.toString()}`, { active: true });
                } else {
                     alert("文档不存在，请检查后重新输入");
                }
            }
        } catch (error) {
            console.error("SDoc Parser Network Error:", error);
            alert("网络请求失败，请检查您的网络连接后重试");
        }
    }

    checkForNotification();
    createButton();

})();