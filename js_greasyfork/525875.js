// ==UserScript==
// @name         小雅增强工具
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  支持视频及文件的智能下载工具
// @author       leng
// @match        https://whut.ai-augmented.com/app/jx-web/mycourse/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM_setClipboard
// @connect      *
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/525875/%E5%B0%8F%E9%9B%85%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/525875/%E5%B0%8F%E9%9B%85%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const CONFIG = {
        hostname: 'whut.ai-augmented.com',
        desKey: '94374647',
        desIV: '99526255'
    };

    // 新版下载函数
    function handleFetchDownload(file_url, token, file_name) {
        fetch(file_url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {

            const reader = response.body.getReader();
            let chunks = [];

            function processResult(result) {
                if (result.done) {
                    const blob = new Blob(chunks, { type: 'application/octet-stream' });
                    const downloadUrl = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = downloadUrl;
                    a.download = file_name;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(downloadUrl);
                    return;
                }
                chunks.push(result.value);
                reader.read().then(processResult);
            }
            reader.read().then(processResult);
        })
    }

    //获得GroupId
    function getGroupIdFromUrl() {
        try {
            const pathname = window.location.pathname;
            const match = pathname.match(/\/mycourse\/(\d{19})/);
            if (!match) {
                console.warn('未找到有效的课程ID');
                return null;
            }
            return match[1];
        } catch (error) {
            console.error('获取课程ID时出错:', error);
            return null;
        }
    }

    // 获取Cookie
    function getCookie() {
        // 精确匹配WT-prd-access-token
        const match = document.cookie.match(/WT-prd-access-token=([^;]+)/);

        // 调试输出
        //console.debug('Cookie匹配结果:', {
        //    rawCookie: document.cookie,
        //    matchedToken: match ? match[1] : null
        //});

        if (!match || !match[1]) {
            throw new Error('未找到有效访问令牌，请先登录');
        }
        return match[1]; // 返回不带参数名的纯token值
    }


    // 获取课程访问token
    async function getCourseAccessToken(groupId) {
        const token = getCookie();
        const url = `https://${CONFIG.hostname}/api/jx-iresource/statistics/group/visit`;

        try {
            const visitResponse = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                body: JSON.stringify({ group_id: groupId })
            });

            const visitData = await visitResponse.json();
            if (!visitData.success) return null;

            const authUrl = `https://${CONFIG.hostname}/api/jx-iresource/group/access/authorization`;
            const authResponse = await fetch(`${authUrl}?site_id=${visitData.data.site_id}&role_type=4`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const authData = await authResponse.json();
            return authData.data?.access_group_token;
        } catch (error) {
            console.error('获取访问token失败:', error);
            return null;
        }
    }

    //获得课程资源
    async function getCourseResources(groupId) {
        const token = getCookie();
        const url = `https://${CONFIG.hostname}/api/jx-iresource/resource/queryCourseResources?group_id=${groupId}`;

        try {
            let response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json; charset=utf-8'
                }
            });

            let responseData = await response.json();

            if (responseData.code === 50007) {
                const accessToken = await getCourseAccessToken(groupId);
                if (accessToken) {
                    response = await fetch(url, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json; charset=utf-8',
                            'X-Course-Access': accessToken
                        }
                    });
                responseData = await response.json();
                }
            }

            if (!responseData.success) {
                throw new Error(`获取课程资源失败: ${responseData.message}`);
            }

            return responseData.data;

        } catch (error) {
            console.error('获取课程资源出错:', error);
            return null;
        }
    }

    // DES解密实现
    function decryptFileUrl(encryptedUrl) {
        try {
            const base64Str = encryptedUrl
            .replace(/_/g, '+')
            .replace(/\*/g, '/')
            .replace(/-/g, '=');

            const key = CryptoJS.enc.Utf8.parse(CONFIG.desKey);
            const iv = CryptoJS.enc.Utf8.parse(CONFIG.desIV);

            const decrypted = CryptoJS.DES.decrypt(
                { ciphertext: CryptoJS.enc.Base64.parse(base64Str) },
                key,
                { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
            );

            return decrypted.toString(CryptoJS.enc.Utf8);
        } catch (error) {
            console.error('解密失败:', error);
            throw error;
        }
    }

    // 核心获取链接方法
    async function getDownloadUrl(quoteId) {
        const MAX_RETRIES = 3;

        for (let i = 0; i < MAX_RETRIES; i++) {
            try {
                const response = await fetch(`https://${CONFIG.hostname}/api/jx-oresource/cloud/file_url/${quoteId}`, {
                    headers: { Authorization: `Bearer ${getCookie()}` }
                });

                const data = await response.json();

                if (!data?.success) throw new Error('API响应失败');

                return data.data.is_encryption ?
                    decryptFileUrl(data.data.url) :
                    data.data.url;

            } catch (error) {
                if (i === MAX_RETRIES - 1) throw error;
                await new Promise(r => setTimeout(r, 1000));
            }
        }
    }

    // 样式常量
    const UI_STYLE = {
        button: {
            base: `position:fixed;left:10px;z-index:9999;padding:8px 16px;
                   color:white;border:none;border-radius:4px;cursor:pointer;
                   box-shadow:0 2px 5px rgba(0,0,0,0.2);transition:all 0.3s;
                   font-family:system-ui,sans-serif;`,
            copy: '#4CAF50',
            download: '#2196F3'
        },
        progress: `width:300px;background:rgba(0,0,0,0.9);border-radius:8px;
                  padding:15px;color:white;z-index:10000;backdrop-filter:blur(5px);
                  position:fixed;`, // 动态计算位置
        progressBar: `height:20px;background:#333;border-radius:10px;overflow:hidden;`,
        progressFill: `width:0%;height:100%;background:#4CAF50;
                      transition:width 0.3s ease;border-radius:10px;`
    };

    // 创建控制按钮
    function createButton(text, top, color, id) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.id = id; // 添加唯一标识
        btn.style.cssText = `${UI_STYLE.button.base}top:${top};background:${color};`;

        // 动态效果
        btn.addEventListener('mouseover', () => {
            btn.style.background = shadeColor(color, -20);
            btn.style.transform = 'translateY(-2px)';
        });
        btn.addEventListener('mouseout', () => {
            btn.style.background = color;
            btn.style.transform = 'none';
        });

        return btn;
    }

    // 颜色处理函数
    function shadeColor(hex, percent) {
        const f = parseInt(hex.slice(1), 16);
        const t = percent < 0 ? 0 : 255;
        const p = percent < 0 ? percent * -1 : percent;
        const r = f >> 16;
        const g = f >> 8 & 0x00FF;
        const b = f & 0x0000FF;
        return `#${(0x1000000 +
            (Math.round((t - r) * p) + r) * 0x10000 +
            (Math.round((t - g) * p) + g) * 0x100 +
            (Math.round((t - b) * p) + b)).toString(16).slice(1)}`;
    }

    // 进度管理器
    const ProgressManager = {
        create() {
            const container = document.createElement('div');

            // 动态定位到下载按钮下方
            const downloadBtn = document.getElementById('download-btn');
            if (downloadBtn) {
                const rect = downloadBtn.getBoundingClientRect();
                container.style.cssText = `${UI_STYLE.progress}
                    top: ${rect.bottom + 10}px;
                    left: ${rect.left}px;
                `;
            }

            const title = document.createElement('div');
            title.textContent = '🚀 下载进度';
            title.style.marginBottom = '10px';

            const barContainer = document.createElement('div');
            barContainer.style.cssText = UI_STYLE.progressBar;

            const barFill = document.createElement('div');
            barFill.style.cssText = UI_STYLE.progressFill;

            const text = document.createElement('div');
            text.style.cssText = 'margin-top:8px;font-size:12px;text-align:center;';

            barContainer.appendChild(barFill);
            container.append(title, barContainer, text);

            return {
                container,
                update(loaded, total) {
                    const percent = total > 0 ? (loaded / total * 100).toFixed(1) : '--';
                    barFill.style.width = `${percent}%`;
                    text.textContent = total > 0
                        ? `${this.formatSize(loaded)} / ${this.formatSize(total)} (${percent}%)`
                        : `正在接收数据: ${this.formatSize(loaded)}`;
                },
                remove() {
                    setTimeout(() => container.remove(), 3000); // 保留3秒显示
                },
                formatSize(bytes) {
                    if (bytes === 0) return '0 B';
                    const units = ['B', 'KB', 'MB', 'GB'];
                    const exp = Math.floor(Math.log(bytes) / Math.log(1024));
                    return `${(bytes / 1024 ** exp).toFixed(1)} ${units[exp]}`;
                }
            };
        }
    };

    // 智能文件名获取
    function getFileName() {
        const titleElement = document.querySelector('h5');
        let materialName = titleElement.title.trim();
        if (!materialName) {
            materialName = titleElement.textContent.trim();
            if (!materialName) throw new Error('课件标题元素未找到');
        }
        return materialName;
    }

    // 下载处理器
    const Downloader = {
        async start(videoUrl) {
            const progress = ProgressManager.create();
            document.body.appendChild(progress.container);

            try {
                await this.xhrDownload(videoUrl, progress);
            } catch (err) {
                progress.remove();
                this.showError('下载失败', err);
            }
        },

        // 精确下载（XHR）
        async xhrDownload(url, progress) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    responseType: 'blob',
                    onprogress: (e) => {
                        progress.update(e.loaded, e.total);
                    },
                    onload: (res) => {
                        if (res.status >= 400) return reject(new Error(res.statusText));

                        const blob = res.response;
                        const objectURL = URL.createObjectURL(blob);

                        // 使用原生下载方式
                        const a = document.createElement('a');
                        a.href = objectURL;
                        a.download = getFileName();
                        document.body.appendChild(a);
                        a.click();
                        setTimeout(() => {
                            document.body.removeChild(a);
                            URL.revokeObjectURL(objectURL);
                        }, 100);

                        progress.remove();
                        this.showSuccess('下载完成');
                        resolve();
                    },
                    onerror: reject
                });
            });
        },

        // GM下载
        async gmDownload(url, progress) {
            let lastSize = 0;
            const checkProgress = setInterval(() => {
                GM_info.getDownloadStatus((status) => {
                    if (status?.finalized) return;
                    const received = status?.received || 0;
                    progress.update(received, status?.total || 0);
                });
            }, 1000);

            return new Promise((resolve, reject) => {
                GM_download({
                    url: url,
                    name: getFileName(),
                    onload: () => {
                        clearInterval(checkProgress);
                        progress.remove();
                        this.showSuccess('下载完成');
                        resolve();
                    },
                    onerror: (err) => {
                        clearInterval(checkProgress);
                        reject(err);
                    }
                });
            });
        },

        // 降级下载
        fallbackDownload(url, progress) {
            const a = document.createElement('a');
            a.href = url;
            a.download = getFileName();
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            progress.update(0, 0);
            setTimeout(() => progress.remove(), 3000);
        },

        showSuccess(msg) {
            const toast = document.createElement('div');
            toast.textContent = `✅ ${msg}`;
            this.showToast(toast, '#4CAF50');
        },

        showError(msg, err) {
            const toast = document.createElement('div');
            toast.textContent = `❌ ${msg}: ${err?.message || err}`;
            this.showToast(toast, '#f44336');
            console.error(err);
        },

        showToast(element, color) {
            element.style.cssText = `position:fixed;top:100px;left:50%;
                transform:translateX(-50%);padding:12px 24px;color:white;
                background:${color};border-radius:4px;box-shadow:0 2px 10px rgba(0,0,0,0.2);
                animation:fadein 0.3s, fadeout 0.3s 2s;z-index:10000;`;
            document.body.appendChild(element);
            setTimeout(() => element.remove(), 2300);
        }
    };

    // 主初始化
    function init() {
        // 创建按钮
        const copyBtn = createButton('复制链接', '20px', UI_STYLE.button.copy, 'copy-btn');
        const downloadvdBtn = createButton('下载视频', '70px', UI_STYLE.button.download, 'download-btn');
        const downloadflBtn = createButton('下载文件', '70px', UI_STYLE.button.download, 'download-btn');
        const downloadigBtn = createButton('下载图片', '70px', UI_STYLE.button.download, 'download-btn');

        // 获取可用的媒体URL
        function getMediaUrl() {
            // 视频、文档、图片链接
            return document.querySelector('video[src]')?.src ||
                document.querySelector('#file_preview')?.src ||
                document.querySelector('.xy_cropper img')?.src;
        }

        // 按钮事件
        copyBtn.addEventListener('click', () => {
            const url = getMediaUrl();
            if (url) {
                try {
                    GM_setClipboard(url, 'text');
                    Downloader.showSuccess('链接已复制');
                } catch (err) {
                    Downloader.showError('复制失败', err);
                }
            } else {
                Downloader.showError('未找到资源链接', null);
            }
        });

        downloadvdBtn.addEventListener('click', () => {
            const video = document.querySelector('video[src]');
            if (video) Downloader.start(video.src);
            else Downloader.showError('未找到视频', null);
        });

        downloadigBtn.addEventListener('click', () => {
            const img = document.querySelector('.xy_cropper img');
            if (img) Downloader.start(img.src);
            else Downloader.showError('未找到图片', null);
        });

        // 按钮点击处理
        downloadflBtn.addEventListener('click', async () => {
            try {
                // 获取必要参数
                const groupId = getGroupIdFromUrl();
                const token = getCookie();
                console.log('课程ID为：',groupId);

                // 实时获取资源数据
                const resources = await getCourseResources(groupId);
                if (!resources) throw new Error('课程资源获取失败');

                // 创建名称映射
                const quoteIdMap = resources.reduce((map, item) => {
                    map[item.name.trim()] = item.quote_id;
                    return map;
                }, {});

                // 获取当前课件名称
                const materialName = getFileName();
                console.log('当前课件名称为：', materialName);

                // 匹配quoteId
                const quoteId = quoteIdMap[materialName];
                if (!quoteId) throw new Error(`未找到"${materialName}"的quoteId`);
                console.log('quoteId为:', quoteId);

                // 生成下载链接
                const url = await getDownloadUrl(quoteId);
                console.log('下载链接:', url);

                // 下载触发
                await handleFetchDownload(url, token, materialName);

                // 显示成功提示
                Downloader.showSuccess('文件下载成功');

            } catch (error) {
                console.error('%c错误:', 'color:red;', error.message);
                alert(`操作失败: ${error.message}`);
            }
        });

        // 动态显示控制
        const observer = new MutationObserver(() => {
            const hasVideo = !!document.querySelector('video[src]');
            const hasFile = !!document.querySelector('#file_preview');
            const hasImg = !!document.querySelector('.xy_cropper img');
            downloadvdBtn.style.display = hasVideo ? 'block' : 'none';
            downloadflBtn.style.display = hasFile ? 'block' : 'none';
            downloadigBtn.style.display = hasImg ? 'block' : 'none';
        });
        observer.observe(document.body, { subtree: true, childList: true });

        // 注入样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadein { from { opacity:0; } to { opacity:1; } }
            @keyframes fadeout { from { opacity:1; } to { opacity:0; } }
        `;
        document.head.appendChild(style);

        // 初始状态
        document.body.append(copyBtn, downloadvdBtn, downloadflBtn, downloadigBtn);
        downloadigBtn.style.display = 'none';
        downloadflBtn.style.display = 'none';
        downloadvdBtn.style.display = 'none';
    }

    // 启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();