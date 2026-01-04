// ==UserScript==
// @name         他趣APM-Loader
// @namespace    your-namespace
// @version      1.1
// @description  在Perfetto界面添加按钮，通过URL加载远程.pb文件
// @match        https://ui.perfetto.dev/*
// @match        *://apk.internal.taqu.cn/*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        window.close
// @connect      *
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527174/%E4%BB%96%E8%B6%A3APM-Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/527174/%E4%BB%96%E8%B6%A3APM-Loader.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const uw = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

    // 匹配所有.pb文件链接
    const pbLinks = document.querySelectorAll('a[href$=".pb"]');

    pbLinks.forEach(link => {
        // 修改链接行为：点击时在新标签页打开文件查看器
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // 示例：构造查看器URL（需替换成实际目标地址）
            const originalUrl = this.href;
            const viewerUrl = `https://ui.perfetto.dev/?taqu=${encodeURIComponent(originalUrl)}`;
            //const viewerUrl = `www.baidu.com`;

            window.open(viewerUrl, '_blank');
        });
    });

    // 等待Perfetto核心初始化完成
    const init = () => {
        // 确保perfetto对象和关键类已加载
        if (!uw.perfetto?.TraceHttpStream?.create) {
            setTimeout(init, 500);
            return;
        }

        // 劫持HTTP流创建方法
        const originalCreate = uw.perfetto.TraceHttpStream.create.bind(uw.perfetto.TraceHttpStream);
        uw.perfetto.TraceHttpStream.create = async (url) => {
            if (url.startsWith('custom:')) {
                const realUrl = url.replace('custom:', '');
                const arrayBuffer = await fetchFile(realUrl);
                return new uw.perfetto.TraceBufferStream(arrayBuffer);
            }
            return originalCreate(url);
        };

        // 添加UI按钮
        // addCustomButton();
    };

    // 自定义按钮样式
    GM_addStyle(`
        .load-taqu-button {
            background: #0078d4;
            color: white;
            border: none;
            padding: 8px 16px;
            margin-left: 10px;
            border-radius: 4px;
            cursor: pointer;
        }
        .load-taqu-button:hover {
            background: #006cbd;
        }
    `);

    // 等待Perfetto界面加载完成
    const observer = new MutationObserver(() => {
        const navSection = document.querySelector('.section-content ul');
        if (navSection && !document.querySelector('.load-taqu-button')) {
            addCustomButton(navSection);
            observer.disconnect();
        }

        // 补充解析 url 自动打开
        const urlParams = new URLSearchParams(window.location.search);
        const taquUrl = urlParams.get('taqu');
        if (taquUrl){
            loadTaQuTrace(taquUrl)
        }

    });
    observer.observe(document.body, { childList: true, subtree: true });

    // 添加自定义按钮
    function addCustomButton(navSection) {
        const li = document.createElement('li');
        li.className = 'load-taqu-button';
        li.innerHTML = `
            <a href="#" title="从服务器加载他趣pb文件">
                <i class="material-icons">cloud_download</i>
                加载他趣pb
            </a>
        `;
        li.onclick = handleButtonClick;
        navSection.appendChild(li);
    }
    // 跨域下载文件
    function fetchFile(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                responseType: 'arraybuffer',
                onload: (res) => res.status === 200 ? resolve(res.response) : reject(res.statusText),
                onerror: (err) => reject(err.statusText)
            });
        });
    }

    // 处理按钮点击
    async function handleButtonClick(e) {
        e.preventDefault();
        const url = prompt('请输入.pb文件的服务器地址:', 'http://your-server.com/trace.pb');
        if (!url) return;
        loadTaQuTrace(url)
    }

    /**
    * 加载他趣trace文件
    **/
    async function loadTaQuTrace(url){
        try{
            // 获取ArrayBuffer
            const arrayBuffer = await fetchTrace(url);
            // 转换为UI需要的Buffer格式
            const traceBuffer = new Uint8Array(arrayBuffer);
            // 调用核心加载方法
            uw.app.openTraceFromBuffer({
                title: '他趣跟踪文件',
                buffer: traceBuffer.buffer,
                fileName: `tq_trace_${Date.now()}.pb`
            });
        } catch (error) {
            alert('加载失败: ' + error.message);
        }
    }

    // 下载文件并返回Blob
//     function fetchFile(url) {
//         return new Promise((resolve, reject) => {
//             GM_xmlhttpRequest({
//                 method: 'GET',
//                 url: url,
//                 responseType: 'arraybuffer',
//                 onload: (response) => {
//                     if (response.status === 200) {
//                         const blob = new Blob([response.response], { type: 'application/octet-stream' });
//                         resolve(blob);
//                     } else {
//                         reject(new Error(`HTTP ${response.status}: ${response.statusText}`));
//                     }
//                 },
//                 onerror: (error) => reject(new Error(error.statusText))
//             });
//         });
//     }

    // 跨域获取Trace文件
    function fetchTrace(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                responseType: 'arraybuffer',
                onload: res => {
                    if (res.status === 200) resolve(res.response);
                    else reject(Error(`HTTP ${res.status}`));
                },
                onerror: err => reject(Error('网络错误')),
                ontimeout: () => reject(Error('请求超时'))
            });
        });
    }


    // 加载Blob到Perfetto
    function loadTraceIntoPerfetto(blob) {
        const blobUrl = URL.createObjectURL(blob);
        // 调用Perfetto内部方法或直接修改URL
        if (window.perfetto) {
            // 方法1: 使用Perfetto内部API（需适配版本）
            window.perfetto.UIState.getInstance().openTraceFromUrl(blobUrl);
        } else {
            // 方法2: 通过URL参数重定向
            window.location.href = `https://ui.perfetto.dev/#!/?url=${encodeURIComponent(blobUrl)}`;
        }

        // 监听窗口关闭事件释放资源（如果是新窗口）
        if (window.opener === null) {
            window.addEventListener('beforeunload', () => URL.revokeObjectURL(blobUrl));
        }
    }
    // 启动初始化
    init();
})();
