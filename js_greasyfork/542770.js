// ==UserScript==
// @name         dowload from  lurl&myppt automatically 
// @name:zh-CN   从lurl&myppt自动下载
// @name:zh-TW   從lurl&myppt自動下載
// @namespace    org.jw23.dcardtools
// @version      1.0.3
// @description  It will download the media from lurl and myppt automatically
// @description:zh-TW 從lurl和mypppt自動下載媒體
// @description:zh-CN 从lurl和myppt自动下载媒体
// @author       jw23
// @match        https://lurl.cc/*
// @match        https://iiil.io/*
// @match        https://myppt.cc/*
// @match        https://mork.ro/*
// @match        https://risu.io/*
// @match        https://cat.85xvideo.com/*
// @run-at       document-start
// @grant        GM_download
// @grant        GM.xmlHttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @connect      lurl.cc
// @connect      *.lurl.cc
// @connect      risu.io
// @connect      85xvideo.com
// @connect      mork.ro
// @connect      myppt.cc
// @connect      *.myppt.cc
// @license     CC BY-NC 
// @downloadURL https://update.greasyfork.org/scripts/542770/dowload%20from%20%20lurlmyppt%20automatically.user.js
// @updateURL https://update.greasyfork.org/scripts/542770/dowload%20from%20%20lurlmyppt%20automatically.meta.js
// ==/UserScript==

// type: image? video?


const urlGuards = [
    {
        guard: (url) => {
            return url && /lurl\.cc\/\d+/.test(url)
        },
        extractFilename: (url) => {
            let splices = url.split('/')
            let [last] = splices.slice(-1)
            return last
        }
    },

    {
        guard: (url) => {
            return url && /myppt\.cc\/\d+/.test(url)
        },
        extractFilename: (url) => {
            let splices = url.split('/')
            let [last] = splices.slice(-1)
            return last
        }
    },
    {
        guard: (url) => {
            return url && url.indexOf('storage') !== -1
        },
        extractFilename: (url) => {
            let splices = url.split('/')
            let [last] = splices.slice(-1)
            return last
        }
    },
    {
        guard: (url) => {
            return true
        },
        extractFilename: (url) => {
            let pureUrl = url.split('?')[0]
            let splices = pureUrl.split('/')
            let [last] = splices.slice(-1)
            return last
        }
    }
];
const pwdRules = [
    {
        urlGuard: url => url.indexOf('lurl.cc') != -1,
        cssSelector: 'div.col-sm-12  span.login_span',
        extractRegx: /\d{4}-(\d{2})-(\d{2})/,
        join: (month, year) => `${month}${year}`,
        inputSelector: 'input#password'
    },
    {
        urlGuard: url => url.indexOf('myppt.cc') != -1,
        cssSelector: 'div.col-sm-12  span.login_span',
        extractRegx: /\d{4}-(\d{2})-(\d{2})/,
        join: (month, year) => `${month}${year}`,
        inputSelector: 'input#pasahaicsword'
    },
    {
        urlGuard: url => url.indexOf('mork.ro') != -1,
        cssSelector: '#passwordVerifyForm>h3:first-of-type',
        extractRegx: /\d{4}-(\d{2})-(\d{2})/,
        join: (month, year) => `${month}${year}`,
        inputSelector: 'input#id_pass_key'
    },

];
const videoGuards = [
    {
        urlGuard: (url) => {
            return url.startsWith('https://lurl.cc/')
        },
        videoSelector: '.vjs-tech source',
        extractFilename: (url) => {
            let splices = url.split('/')
            let [last] = splices.slice(-1)
            return last
        }
    },
    {
        urlGuard: (url) => {
            return url.startsWith('https://myppt.cc/')
        },
        videoSelector: '.vjs-tech source',
        extractFilename: (url) => {
            let splices = url.split('/')
            let [last] = splices.slice(-1)
            return last
        }
    },
    {
        urlGuard: (url) => {
            return url.startsWith('https://cat.85xvideo.com')
        },
        videoSelector: '#video source',
        extractFilename: (url) => {
            let splices = url.split('/')
            let [last] = splices.slice(-1)
            return last
        }
    },
    // if match failed, execute default action
    {
        urlGuard: (url) => {
            return true
        },
        videoSelector: 'video source',
        extractFilename: (url) => {
            let pureUrl = url.split('?')[0]
            let splices = pureUrl.split('/')
            let [last] = splices.slice(-1)
            return last
        }
    },

]
let oldFetch = unsafeWindow.fetch;
function hookFetch(...args) {
    return oldFetch(...args).then(resp => {
        for (let guard of urlGuards) {
            if (guard.guard(args[0])) {
                window.dispatchEvent(new CustomEvent('download_media', {
                    detail: {
                        url: args[0],
                        filename: guard.extractFilename(args[0])
                    }
                }))
            }
            return resp;
        }
    })
}


function hookDrawImage() {
    // 1. 获取 Canvas 2D 上下文的原型
    const ctxPrototype = unsafeWindow.CanvasRenderingContext2D.prototype;

    // 2. 保存原始的 drawImage 方法
    const originalDrawImage = ctxPrototype.drawImage;

    // 3. 创建并应用我们的钩子函数
    ctxPrototype.drawImage = function (...args) {
        try {

            // 第一个参数就是被绘制的图像源
            const imageSource = args[0];
            // 检查源是否是 HTMLImageElement 并且有 src 属性
            if (imageSource && imageSource instanceof unsafeWindow.HTMLImageElement && imageSource.src) {
                const url = imageSource.src;
                // 运行你的守卫逻辑
                for (const guard of urlGuards) {
                    if (guard.guard(url)) {
                        window.dispatchEvent(new CustomEvent('download_media', {
                            detail: {
                                url: url,
                                filename: guard.extractFilename(url)
                            }
                        }))
                        break;
                    }
                }
            }
            // 如果源是另一个 Canvas，你也可以处理
            else if (imageSource && imageSource instanceof unsafeWindow.HTMLCanvasElement) {
                console.log("[Canvas 劫持] 正在绘制另一个 Canvas，无法直接获取 URL。");
            }
        } catch (err) {
            console.log("劫持过程发生了错误", err)
        } finally {
            // 4. **至关重要**: 调用原始的 drawImage 方法，否则页面无法正常显示
            return originalDrawImage.apply(this, args);
        }

    };
    console.log("Canvas.drawImage 劫持成功!");
}


function extractPwd(...pwdRules) {
    let { putMsg } = window.debugPanel
    for (let pr of pwdRules) {
        if (pr.urlGuard(document.URL)) {
            putMsg("Match the site, and run fiiling pwd")
            waitUtil(pr.inputSelector).then(ele => {
                putMsg("find the input ", ele)
                let updatedDataNode = document.querySelector(pr.cssSelector);
                let updatedData = updatedDataNode.textContent;
                let matches = pr.extractRegx.exec(updatedData)
                putMsg("find the node contains pwd, mathes", updatedData, matches)
                if (matches && matches.length > 2) {
                    putMsg(updatedData)
                    let pwd = pr.join(...matches.slice(1))
                    putMsg(ele, pwd)
                    ele.value = pwd
                }

            }).catch(err => {
                putMsg(`filling pwd failed: ${err}`)
            })
            return
        }
    }
}
function waitUtil(cssSelector) {
    return new Promise((resolve, reject) => {
        const observer = new MutationObserver((mutations, obs) => {
            const ele = document.querySelector(cssSelector);
            if (ele) {
                resolve(ele)
                obs.disconnect()
            }
        })
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
        });
        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`等待元素 "${cssSelector}" 超时`));
        }, 20000);
    })
}


function downloadFromUrl(url, filename) {
    const headers = {
        // 关键修复 #1: 添加 Referer 头，告诉服务器我们是从哪个页面来的
        'Referer': window.origin + '/',
        'Origin': window.origin,
        "sec-ch-ua": `"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"`,
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "macOS"
    };
    let updateProgress = showProgress();
    let { putMsg } = window.debugPanel;
    GM.xmlHttpRequest({
        method: 'GET',
        url: url,
        headers: headers,
        responseType: 'blob',
        onprogress: progress => {
            if (progress.lengthComputable) {
                const percent = Math.round((progress.loaded / progress.total) * 100);
                updateProgress(percent / 100)
                putMsg(`[强制模式] 正在获取数据... ${percent}%`);
            }
        },
        onload: response => {
            putMsg("[强制模式]非二进制: ", response)
            downloadFromBlob(response.response, filename)
        },
        onerror: error => {
            if (error.status === 200 && error.response) {
                putMsg(`[强制模式] 获取数据成功 (onerror fallback)`);
                downloadFromBlob(error.response, filename);
            } else {
                putMsg(`[强制模式] 获取数据失败: ${JSON.stringify(error)}`);
                const result = confirm("Whether to retry???")
                if (result) {
                    downloadFromUrl(url, filename)
                }
            }

        }
    });
}

const downloadFromBlob = (() => {
    const filenameMap = new Map();
    return (blob, filename) => {
        if (filenameMap.has(filename)) {
            return;
        }
        filenameMap.set(filename, true);

        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
    };
})();

/**
 * 使用闭包创建一个 showProgress 函数.
 * 这样可以拥有一个私有的 nextTopPosition 变量, 用于在多次调用之间保持状态.
 */
const showProgress = (() => {

    // 这个变量存在于闭包中, 不会污染全局作用域, 并且在多次调用之间保持它的值.
    let nextTopPosition = 10; // 第一个进度条的初始top值

    const BAR_HEIGHT = 8; // 进度条的高度
    const PADDING_BETWEEN_BARS = 6; // 进度条之间的垂直间距

    // IIFE返回的这个函数才是我们最终使用的 showProgress 函数
    return function () {
        // --- 这部分是每次调用时实际执行的代码 ---

        const progressContainer = document.createElement('div');
        progressContainer.style.position = 'fixed';
        // 使用闭包中保存的 nextTopPosition 变量
        progressContainer.style.top = `${nextTopPosition}px`;
        progressContainer.style.right = '10px';
        progressContainer.style.width = '250px';
        progressContainer.style.height = `${BAR_HEIGHT}px`;
        progressContainer.style.backgroundColor = '#e0e0e0';
        progressContainer.style.borderRadius = '5px';
        progressContainer.style.overflow = 'hidden';
        progressContainer.style.zIndex = '999999';
        progressContainer.style.transition = 'opacity 0.5s ease-out';

        const progressBar = document.createElement('div');
        progressBar.style.width = '0%';
        progressBar.style.height = '100%';
        progressBar.style.backgroundColor = '#4CAF50';
        progressBar.style.borderRadius = '5px';
        progressBar.style.transition = 'width 0.2s ease-in-out';

        progressContainer.appendChild(progressBar);
        document.body.appendChild(progressContainer);

        // 为下一次调用 showProgress 更新 top 值
        // 这个操作会直接修改闭包中的 nextTopPosition
        nextTopPosition += BAR_HEIGHT + PADDING_BETWEEN_BARS;

        /**
         * 设置进度.
         * @param {number} progress - 0 到 1 之间的小数.
         */
        const setProgress = (progress) => {
            // 注意：你原始代码中的 `initTop += (height + 6)` 被移除了
            // 因为位置应该在创建时就固定, 而不是在更新进度时改变

            const clampedProgress = Math.max(0, Math.min(1, progress));
            progressBar.style.width = `${clampedProgress * 100}%`;

            // 当进度完成时，自动淡出并移除
            if (clampedProgress >= 1) {
                setTimeout(() => {
                    progressContainer.style.opacity = '0';
                    setTimeout(() => {
                        progressContainer.remove();
                    }, 500); // 匹配 transition 的时间
                }, 300); // 延迟一会再消失
            }
        };

        // 返回进度设置函数
        return setProgress;
    };
})();
/**
         * Displays and manages a debug panel in the bottom-left corner of the page.
         * @returns {{putMsg: function(any): void}} An object containing the putMsg method.
         */
function showDebugPanel(on = true) {
    if (!on) {
        let putMsg = (...msg) => {
            console.log(...msg)
        }
        window.debugPanel = { putMsg }
        return {
            putMsg: putMsg
        }
    }
    // Check if the debug panel already exists. If so, return its interface directly.
    if (document.getElementById('debug-panel-container')) {
        return window.debugPanel;
    }

    // 1. Create the HTML structure for the debug panel.
    const panelContainer = document.createElement('div');
    panelContainer.id = 'debug-panel-container';

    const panelHeader = document.createElement('div');
    panelHeader.id = 'debug-panel-header';
    panelHeader.textContent = 'Debug Panel';

    const closeButton = document.createElement('span');
    closeButton.id = 'debug-panel-close';
    closeButton.textContent = '×'; // Close button character

    const panelContent = document.createElement('div');
    panelContent.id = 'debug-panel-content';

    panelHeader.appendChild(closeButton);
    panelContainer.appendChild(panelHeader);
    panelContainer.appendChild(panelContent);

    document.body.appendChild(panelContainer);

    // 2. Add CSS styles for the debug panel.
    const style = document.createElement('style');
    style.textContent = `
                #debug-panel-container {
                    position: fixed;
                    bottom: 15px;
                    left: 15px;
                    width: 400px;
                    max-width: 90%;
                    height: 250px;
                    background-color: rgba(0, 0, 0, 0.75);
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                    color: #fff;
                    display: flex;
                    flex-direction: column;
                    font-family: monospace, sans-serif;
                    font-size: 14px;
                    z-index: 9999;
                    transition: opacity 0.3s, transform 0.3s;
                }
                #debug-panel-header {
                    padding: 8px 12px;
                    background-color: rgba(0, 0, 0, 0.4);
                    font-weight: bold;
                    cursor: move; /* Optional: reserve for future drag functionality */
                }
                #debug-panel-close {
                    float: right;
                    cursor: pointer;
                    font-size: 20px;
                    line-height: 1;
                    font-weight: bold;
                }
                #debug-panel-close:hover {
                    color: #ff5555;
                }
                #debug-panel-content {
                    padding: 10px;
                    overflow-y: auto;
                    flex-grow: 1;
                    color: #fff;
                    word-wrap: break-word; /* Ensure long strings can wrap */
                }
                .debug-message {
                    padding-bottom: 5px;
                    border-bottom: 1px solid #444;
                    margin-bottom: 5px;
                    color: #fff;
                }
                .debug-message:last-child {
                    border-bottom: none;
                }
            `;
    document.head.appendChild(style);

    // 3. Implement the core functionality.
    const putMsg = (...msg) => {
        const isScrolledToBottom = panelContent.scrollHeight - panelContent.clientHeight <= panelContent.scrollTop + 1;

        // Format the message content.
        let formattedMsg = msg.map(item => {
            if (typeof item === 'object' && item !== null) {
                return JSON.stringify(item, null, 2);
            } else {
                return item
            }
        }).join(" ")

        const time = new Date().toLocaleTimeString();
        const msgElement = document.createElement('div');
        msgElement.className = 'debug-message';
        msgElement.innerHTML = `<strong>[${time}]</strong><pre style="margin:0; white-space: pre-wrap;color:#fff;">${formattedMsg}</pre>`;

        panelContent.appendChild(msgElement);

        // If it was already scrolled to the bottom, auto-scroll to the new bottom.
        if (isScrolledToBottom) {
            panelContent.scrollTop = panelContent.scrollHeight;
        }
    };

    // Close button functionality.
    closeButton.addEventListener('click', () => {
        panelContainer.style.opacity = '0';
        panelContainer.style.transform = 'scale(0.9)';
        setTimeout(() => panelContainer.style.display = 'none', 300);
    });

    // Expose the interface to the global scope for easy access and to implement the singleton pattern.
    window.debugPanel = { putMsg };
    return window.debugPanel;
}
(function () {
    'use strict';

    window.addEventListener('download_media', event => {
        let autoDownload = GM_getValue('auto_download', true);
        if (!autoDownload) {
            console.log('The automatic download mode has been turned off')
            return
        }
        let { url, filename } = event.detail
        console.log(`收到了下载请求 ${url}, 它将会被保存为${filename}`)
        downloadFromUrl(url, filename)
    })
    hookDrawImage()

    // fetch
    unsafeWindow.fetch = hookFetch;
    document.addEventListener('DOMContentLoaded', () => {
        let on = GM_getValue('debug_mode', false);
        let autoDownload = GM_getValue('auto_download', false);
        // 2. 注册一个菜单命令
        GM_registerMenuCommand('debug mode', () => {
            // 点击菜单时，执行这里的代码

            // a. 切换 on 变量的状态 (true -> false, false -> true)
            on = !on;

            // b. 将新的状态保存到存储中，以便下次打开页面时保持该状态
            GM_setValue('debug_mode', on);

            // c. 给用户一个明确的反馈
            alert(`debug mode has changed to ：${on ? '✅ on' : '❌ off'}\n\n Please reflush the page.`);
        });
        GM_registerMenuCommand('automatic download', () => {
            autoDownload = !autoDownload
            GM_setValue('auto_download', autoDownload)
            alert(`auto-download has change to : ${autoDownload ? '✅ on' : '❌off'}`)
        })
        let { putMsg } = showDebugPanel(on)
        extractPwd(...pwdRules)
        // watch video 
        for (let guard of videoGuards) {
            if (guard.urlGuard(document.URL)) {
                waitUtil(guard.videoSelector).then(ele => {
                    putMsg("find element", ele)

                    ele && ele.src && window.dispatchEvent(new CustomEvent('download_media', {
                        detail: {
                            url: ele.src,
                            filename: guard.extractFilename(ele.src)
                        }
                    }))
                }).catch(err => {
                    putMsg(`download video ${err}`)
                })
                putMsg("match the url of the video", document.URL)
                break;
            }
        }
    })
})();