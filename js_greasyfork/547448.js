// ==UserScript==
// @name         中小学智慧教育平台助手
// @namespace    http://tampermonkey.net/
// @version      2.3.1
// @description  提取 iframe 中 PDF，支持下载与 ConvertAPI 转换为 PPTX（Bearer 授权、多部分上传），
//               带进度与日志；禁止页面全屏；美化浮动按钮；支持 API Key 配置与日志区打开。仅在顶层页面运行。
// @match        https://*.smartedu.cn/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @connect      r3-ndr-private.ykt.cbern.com.cn
// @connect      v2.convertapi.com
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/547448/%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/547448/%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ========= 配置（默认空，建议通过「设置 API」输入并保存） =========
    const DEFAULT_BEARER_TOKEN = ''; // 保留，但不要把真实 token 写死在这里
    const CONVERT_API_URL = 'https://v2.convertapi.com/convert/pdf/to/pptx';
    // ================================================================

    // ======= 简易样式 =======
    GM_addStyle(`
    .edu-helper-wrapper { position: fixed; bottom: 20px; right: 20px; z-index: 2147483647; font-family: Arial, sans-serif; }
    .edu-helper-mainbtn { background: rgba(70,130,180,0.85); color:#fff; border:none; border-radius:50%; width:50px; height:50px; cursor:pointer; box-shadow:0 2px 8px rgba(0,0,0,0.25); }
    .edu-helper-panel { display:none; margin-top:10px; background: #fff; border:1px solid #ddd; border-radius:8px; padding:10px; min-width:260px; max-height:360px; overflow:auto; box-shadow:0 2px 10px rgba(0,0,0,0.12); }
    .edu-helper-row { margin-bottom:8px; }
    .edu-helper-btn { padding:6px 8px; margin-right:6px; border:none; border-radius:4px; cursor:pointer; color:#fff; }
    .edu-helper-download { background: rgba(70,130,180,0.95); }
    .edu-helper-convert { background: rgba(34,139,34,0.95); }
    .edu-helper-ctrl { display:flex; gap:6px; margin-top:6px; }
    .edu-helper-logbox { position: fixed; left: 20px; bottom: 20px; width: 420px; max-height: 320px; overflow-y: auto; background: rgba(255,255,255,0.85); color: #fff; padding:10px; border-radius:8px; z-index:2147483647; display:none; font-size:12px; }
    .edu-helper-small { font-size:12px; color:#666; margin-left:6px; }
    .edu-helper-input { width: 160px; padding:4px; border:1px solid #ccc; border-radius:4px; }
  `);

    // ======= 日志功能 =======
    function ensureLogBox() {
        let lb = document.getElementById('edu-helper-logbox');
        if (!lb) {
            lb = document.createElement('div');
            lb.id = 'edu-helper-logbox';
            lb.className = 'edu-helper-logbox';
            lb.innerHTML = '<div style="font-weight:600;margin-bottom:6px;">📋 助手日志 <span id="edu-log-close" style="float:right;cursor:pointer">关闭</span></div><div id="edu-helper-log-content"></div>';
            document.body.appendChild(lb);
            document.getElementById('edu-log-close').onclick = () => { lb.style.display = 'none'; };
        }
        return lb;
    }

    function appendLog(msg) {
        const lb = ensureLogBox();
        const box = document.getElementById('edu-helper-log-content');
        const time = new Date().toLocaleTimeString();
        const line = document.createElement('div');
        line.textContent = `[${time}] ${msg}`;
        box.appendChild(line);
        box.scrollTop = box.scrollHeight;
        console.log('[助手]', msg);
    }

    // ======= 禁止全屏（保留原有实现） =======
    function disableFullscreen() {
        if (Element.prototype.requestFullscreen) Element.prototype.requestFullscreen = () => console.log('阻止 requestFullscreen');
        if (Element.prototype.webkitRequestFullscreen) Element.prototype.webkitRequestFullscreen = () => console.log('阻止 webkitRequestFullscreen');
        if (Element.prototype.mozRequestFullScreen) Element.prototype.mozRequestFullScreen = () => console.log('阻止 mozRequestFullScreen');
        if (Element.prototype.msRequestFullscreen) Element.prototype.msRequestFullscreen = () => console.log('阻止 msRequestFullscreen');

        window.addEventListener('keydown', e => {
            if (e.key === 'F11') {
                e.preventDefault();
                appendLog('阻止 F11 全屏');
            }
        });

        function exitFs() {
            if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
                if (document.exitFullscreen) document.exitFullscreen();
                else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
                else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
                else if (document.msExitFullscreen) document.msExitFullscreen();
                appendLog('强制退出全屏');
            }
        }
        setInterval(exitFs, 1000);
    }
    disableFullscreen();

    // ======= 提取 iframe 中的 pdf 和 header（不改动） =======
    function extractPDFinfoFromIframe(iframe) {
        const src = iframe.getAttribute('src');
        if (!src) return null;
        const hashIndex = src.indexOf('#'); if (hashIndex === -1) return null;
        const hash = src.slice(hashIndex + 1);
        const pdfMatch = hash.match(/pdf=([^&]+)/);
        const headerMatch = hash.match(/header=([^&]+)/);
        if (!pdfMatch) return null;
        const pdfUrl = decodeURIComponent(pdfMatch[1]);
        let headers = {};
        if (headerMatch) {
            try { headers = JSON.parse(decodeURIComponent(headerMatch[1])); } catch (e) { console.warn('解析 iframe header 失败', e); }
        }
        return { pdfUrl, headers };
    }

    // ======= 下载 PDF（保留） =======
    function downloadPDF(url, headers = {}, filename = 'file.pdf') {
        appendLog(`开始下载 PDF: ${url}`);
        GM_xmlhttpRequest({
            method: 'GET',
            url,
            headers,
            responseType: 'blob',
            onload(res) {
                try {
                    const blob = res.response;
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(blob);
                    a.download = filename;
                    a.click();
                    URL.revokeObjectURL(a.href);
                    appendLog(`PDF 已下载：${filename}`);
                } catch (e) {
                    console.error(e);
                    appendLog(`PDF 下载失败：${e.message}`);
                    alert('PDF下载失败，请查看控制台或日志');
                }
            },
            onerror(err) {
                console.error(err);
                appendLog('PDF下载请求出错');
                alert('PDF下载请求出错，请查看控制台或日志');
            }
        });
    }

    // ======= 辅助：获取存储的 Bearer token（优先使用用户配置） =======
    function getStoredToken() {
        const t = GM_getValue('convertapi_token', '');
        if (t && t.length > 0) return t;
        return DEFAULT_BEARER_TOKEN || '';
    }

    // ======= 工具：fetch PDF Blob（保留） =======
    function fetchPdfBlob(pdfUrl, headers = {}) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: pdfUrl,
                headers,
                responseType: 'blob',
                onload: res => resolve(res.response),
                onerror: err => reject(err)
            });
        });
    }

    // ======= 工具：构建 multipart body（保留） =======
    function buildMultipartBody(fileBlob, fileFieldName = 'File', fileName = 'file.pdf', extraFields = { StoreFile: 'true' }) {
        const boundary = '----TamperBoundary' + Date.now().toString(36);
        const CRLF = '\r\n';
        const parts = [];

        for (const k in extraFields) {
            parts.push(`--${boundary}${CRLF}`);
            parts.push(`Content-Disposition: form-data; name="${k}"${CRLF}${CRLF}`);
            parts.push(`${extraFields[k]}${CRLF}`);
        }

        parts.push(`--${boundary}${CRLF}`);
        parts.push(`Content-Disposition: form-data; name="${fileFieldName}"; filename="${fileName}"${CRLF}`);
        parts.push(`Content-Type: application/pdf${CRLF}${CRLF}`);
        parts.push(fileBlob);
        parts.push(CRLF);
        parts.push(`--${boundary}--${CRLF}`);

        return { body: new Blob(parts), boundary };
    }

    function downloadBlob(blob, filename) {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.click();
        URL.revokeObjectURL(a.href);
    }

    // ======= 调用 ConvertAPI（使用存储或默认 token） =======
    async function pdfToPptViaConvertAPI(pdfUrl, headers = {}, outFilename = 'converted.pptx', statusBtn = null) {
        const token = getStoredToken();
        if (!token) {
            alert('未设置 ConvertAPI Bearer token，请点击「设置 API」输入并保存。');
            return;
        }

        try {
            if (statusBtn) statusBtn.textContent = '⏳ 获取 PDF...';
            appendLog(`开始 ConvertAPI 转换：${pdfUrl}`);

            const pdfBlob = await fetchPdfBlob(pdfUrl, headers);
            appendLog(`已获取 PDF Blob，大小 ${pdfBlob.size} bytes`);

            if (statusBtn) statusBtn.textContent = '⏳ 上传到 ConvertAPI...';
            const { body, boundary } = buildMultipartBody(pdfBlob, 'File', outFilename.replace('.pptx', '.pdf'));

            GM_xmlhttpRequest({
                method: 'POST',
                url: CONVERT_API_URL,
                data: body,
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'multipart/form-data; boundary=' + boundary
                },
                onprogress(e) {
                    if (statusBtn && e.lengthComputable) {
                        const pct = Math.round((e.loaded / e.total) * 100);
                        statusBtn.textContent = `⬆️ 上传 ${pct}%`;
                    }
                },
                onload(res) {
                    appendLog(`ConvertAPI 返回状态 ${res.status}`);
                    if (res.status >= 200 && res.status < 300) {
                        let data = null;
                        try { data = JSON.parse(res.responseText); } catch (e) { /* ignore */ }

                        if (data && data.Files && data.Files[0] && data.Files[0].Url) {
                            const downloadUrl = data.Files[0].Url;
                            appendLog(`转换成功，文件 URL：${downloadUrl}`);
                            if (statusBtn) statusBtn.textContent = '⬇️ 服务器生成，开始下载...';

                            GM_xmlhttpRequest({
                                method: 'GET',
                                url: downloadUrl,
                                responseType: 'blob',
                                onprogress(evt) {
                                    if (statusBtn && evt.lengthComputable) {
                                        const pct = Math.round((evt.loaded / evt.total) * 100);
                                        statusBtn.textContent = `⬇️ 下载 ${pct}%`;
                                    }
                                },
                                onload(r2) {
                                    downloadBlob(r2.response, outFilename);
                                    appendLog(`PPTX 已下载：${outFilename}`);
                                    if (statusBtn) { statusBtn.textContent = '✅ 完成'; setTimeout(() => statusBtn.textContent = '转换 PPT', 1500); }
                                },
                                onerror(err2) {
                                    console.error('下载 ConvertAPI 结果失败：', err2);
                                    appendLog('下载 ConvertAPI 结果失败');
                                    if (statusBtn) { statusBtn.textContent = '❌ 下载失败'; setTimeout(() => statusBtn.textContent = '转换 PPT', 1500); }
                                }
                            });
                        } else {
                            console.warn('ConvertAPI 返回没有 Files URL', res.responseText);
                            appendLog('ConvertAPI 返回无文件 URL（控制台查看原始响应）');
                            if (statusBtn) { statusBtn.textContent = '❌ 返回异常'; setTimeout(() => statusBtn.textContent = '转换 PPT', 1500); }
                        }
                    } else {
                        console.error('ConvertAPI 返回错误', res);
                        appendLog(`ConvertAPI 返回错误：HTTP ${res.status}`);
                        if (statusBtn) { statusBtn.textContent = '❌ 请求失败'; setTimeout(() => statusBtn.textContent = '转换 PPT', 1500); }
                    }
                },
                onerror(err) {
                    console.error('POST 到 ConvertAPI 出错：', err);
                    appendLog('POST 到 ConvertAPI 出错，详见控制台');
                    if (statusBtn) { statusBtn.textContent = '❌ 请求出错'; setTimeout(() => statusBtn.textContent = '转换 PPT', 1500); }
                }
            });

        } catch (err) {
            console.error('pdfToPptViaConvertAPI 异常：', err);
            appendLog(`转换异常：${err.message || err}`);
            if (statusBtn) { statusBtn.textContent = '❌ 异常'; setTimeout(() => statusBtn.textContent = '转换 PPT', 1500); }
            alert('转换失败（详情查看日志或控制台）');
        }
    }

    // ======= UI：扫描 iframe，生成浮动工具（保留原行为，但加入设置与日志按钮） =======
    function scanForPdfIframes() {
        const iframes = document.querySelectorAll('iframe');
        const infos = [];
        iframes.forEach(f => {
            const info = extractPDFinfoFromIframe(f);
            if (info) infos.push(info);
        });
        return infos;
    }

    function createFloatingUI(pdfInfos) {
        if (document.getElementById('edu-helper-wrapper')) return; // 避免重复创建

        const wrapper = document.createElement('div');
        wrapper.id = 'edu-helper-wrapper';
        wrapper.className = 'edu-helper-wrapper';

        const mainBtn = document.createElement('button');
        mainBtn.className = 'edu-helper-mainbtn';
        mainBtn.title = 'PDF 工具';
        mainBtn.textContent = '📄';

        const panel = document.createElement('div');
        panel.className = 'edu-helper-panel';

        // top control: API 设置 & 日志开关
        const ctrl = document.createElement('div');
        ctrl.className = 'edu-helper-row';
        ctrl.innerHTML = `
      <button id="edu-set-api" class="edu-helper-btn" style="background:#f39c12;color:#fff">设置 API</button>
      <button id="edu-toggle-log" class="edu-helper-btn" style="background:#34495e;color:#fff">打开日志</button>
      <span class="edu-helper-small" id="edu-token-mask"></span>
    `;
        panel.appendChild(ctrl);

        // list area
        const listArea = document.createElement('div');
        listArea.id = 'edu-list-area';
        panel.appendChild(listArea);

        // fill list
        if (pdfInfos.length === 0) {
            listArea.innerText = '未检测到 PDF iframe';
        } else {
            pdfInfos.forEach((info, idx) => {
                const row = document.createElement('div');
                row.className = 'edu-helper-row';

                const title = document.createElement('div');
                title.textContent = `PDF ${idx + 1}`;
                title.style.fontSize = '13px';
                row.appendChild(title);

                const btnDownload = document.createElement('button');
                btnDownload.textContent = '下载 PDF';
                btnDownload.className = 'edu-helper-btn edu-helper-download';
                btnDownload.onclick = () => downloadPDF(info.pdfUrl, info.headers, `pdf_${idx + 1}.pdf`);
                row.appendChild(btnDownload);

                const btnPpt = document.createElement('button');
                btnPpt.textContent = '转换 PPT';
                btnPpt.className = 'edu-helper-btn edu-helper-convert';
                btnPpt.onclick = () => pdfToPptViaConvertAPI(info.pdfUrl, info.headers, `pdf_${idx + 1}.pptx`, btnPpt);
                row.appendChild(btnPpt);

                panel.appendChild(row);
            });
        }

        // attach
        wrapper.appendChild(mainBtn);
        wrapper.appendChild(panel);
        document.body.appendChild(wrapper);

        // show/hide panel
        mainBtn.onclick = () => {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        };

        // 设置 API 按钮行为
        document.getElementById('edu-set-api').onclick = () => {
            const current = GM_getValue('convertapi_token', '');
            const input = prompt('请输入 ConvertAPI Bearer token（不会明文保存到共享区域，仅保存在本地 Tampermonkey）：', current);
            if (input !== null) {
                GM_setValue('convertapi_token', input);
                appendLog('已保存 ConvertAPI token（已隐藏显示）');
                updateTokenMask();
            }
        };

        // 日志开关
        document.getElementById('edu-toggle-log').onclick = () => {
            const lb = ensureLogBox();
            lb.style.display = lb.style.display === 'none' ? 'block' : 'none';
        };

        // 显示已保存 token（遮掩）
        function updateTokenMask() {
            const maskEl = document.getElementById('edu-token-mask');
            const token = GM_getValue('convertapi_token', '');
            if (!token) maskEl.textContent = '(未设置 API)';
            else maskEl.textContent = '(已设置 API，长度 ' + token.length + ')';
        }
        updateTokenMask();
    }

    // ======= 动态监听并启动 UI（只在顶层页面） =======
    if (window.top === window.self) {
        const mo = new MutationObserver(() => {
            const infos = scanForPdfIframes();
            if (infos.length > 0) {
                mo.disconnect();
                createFloatingUI(infos);
                appendLog('检测到 PDF iframe 并创建工具 UI');
            }
        });
        mo.observe(document.body, { childList: true, subtree: true });
    }

})();
