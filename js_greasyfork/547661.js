// ==UserScript==
// @name         Local Custom CDN of Bilibili (LCCB) - 修改哔哩哔哩的视频播放源 (本地版)
// @namespace    LCCB
// @license      MIT
// @version      0.1.4
// @description  修改哔哩哔哩的视频播放源 - 仅使用内置CDN列表 (修复版)
// @author       鼠鼠今天吃嘉然 & Bush2021
// @run-at       document-start
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/bangumi/play/*
// @match        https://www.bilibili.com/festival/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/547661/Local%20Custom%20CDN%20of%20Bilibili%20%28LCCB%29%20-%20%E4%BF%AE%E6%94%B9%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9A%84%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E6%BA%90%20%28%E6%9C%AC%E5%9C%B0%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547661/Local%20Custom%20CDN%20of%20Bilibili%20%28LCCB%29%20-%20%E4%BF%AE%E6%94%B9%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9A%84%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E6%BA%90%20%28%E6%9C%AC%E5%9C%B0%E7%89%88%29.meta.js
// ==/UserScript==

// 日志输出函数
const PluginName = 'LCCB'
const log = console.log.bind(console, `[${PluginName}]:`)

const defaultCdnNode = '使用默认源'
const cdnNodeStored = 'LCCB_CDN_NODE' // 修改存储键名，避免冲突

// CDN 列表
const initCdnList = [
    // 海外
    'upos-sz-mirroraliov.bilivideo.com',
    'upos-sz-mirrorawsov.bilivideo.com',
    'upos-sz-mirrorcosov.bilivideo.com',
    'upos-sz-mirrorhwov.bilivideo.com',
    'upos-sz-mirrorcf01ov.bilivideo.com',
    
    // 国内
    'upos-sz-mirrorali.bilivideo.com',
    'upos-sz-mirroralib.bilivideo.com',
    'upos-sz-mirroralio1.bilivideo.com',
    'upos-sz-mirrorbd.bilivideo.com',
    'upos-sz-mirrorcos.bilivideo.com',
    'upos-sz-mirrorcosb.bilivideo.com',
    'upos-sz-mirrorcoso1.bilivideo.com',
    'upos-sz-mirrorhw.bilivideo.com',
    'upos-sz-mirror08c.bilivideo.com',
    'upos-sz-mirror08h.bilivideo.com',
    'upos-sz-estgcos.bilivideo.com',
]

const cdnList = [defaultCdnNode, ...initCdnList]

const getCurCdnNode = () => {
    return GM_getValue(cdnNodeStored, defaultCdnNode)
}

const isCcbEnabled = () => {
    return getCurCdnNode() !== defaultCdnNode
}

const getReplacement = () => {
    const domain = getCurCdnNode()
    if (domain === defaultCdnNode) return null
    
    let url = domain
    if (url.indexOf('://') === -1) {
        url = 'https://' + url
    }
    return url.endsWith('/') ? url : `${url}/`
}

const playInfoTransformer = playInfo => {
    if (!isCcbEnabled()) return
    
    const replacement = getReplacement()
    if (!replacement) return
    
    log(`播放源已修改为: ${getCurCdnNode()}`)
    
    const urlTransformer = i => {
        const newUrl = i.base_url.replace(/https:\/\/.*?\//, replacement)
        i.baseUrl = newUrl;
        i.base_url = newUrl
    };
    
    const durlTransformer = i => {
        i.url = i.url.replace(/https:\/\/.*?\//, replacement)
    };

    if (playInfo.code !== undefined && playInfo.code !== 0) {
        log('Failed to get playInfo, message:', playInfo.message)
        return
    }

    let video_info
    if (playInfo.result) {
        video_info = playInfo.result.dash === undefined ? playInfo.result.video_info : playInfo.result
        if (!video_info?.dash) {
            if (playInfo.result.durl && playInfo.result.durls) {
                video_info = playInfo.result
            } else {
                log('Failed to get video_info, limit_play_reason:', playInfo.result.play_check?.limit_play_reason)
            }
            video_info?.durl?.forEach(durlTransformer)
            video_info?.durls?.forEach(durl => { durl.durl?.forEach(durlTransformer) })
            return
        }
    } else {
        video_info = playInfo.data
    }
    
    try {
        if (video_info.dash) {
            video_info.dash.video.forEach(urlTransformer)
            video_info.dash.audio.forEach(urlTransformer)
        } else if (video_info.durl) {
            video_info.durl.forEach(durlTransformer)
        } else if (video_info.video_info) {
            video_info.video_info.dash.video.forEach(urlTransformer)
            video_info.video_info.dash.audio.forEach(urlTransformer)
        }
    } catch (err) {
        log('ERR:', err)
    }
}

// Network Request Interceptor
const interceptNetResponse = (theWindow => {
    const interceptors = []
    const interceptNetResponse = (handler) => interceptors.push(handler)

    const handleInterceptedResponse = (response, url) => interceptors.reduce((modified, handler) => {
        const ret = handler(modified, url)
        return ret ? ret : modified
    }, response)
    
    const OriginalXMLHttpRequest = theWindow.XMLHttpRequest

    class XMLHttpRequest extends OriginalXMLHttpRequest {
        get responseText() {
            if (this.readyState !== this.DONE) return super.responseText
            return handleInterceptedResponse(super.responseText, this.responseURL)
        }
        get response() {
            if (this.readyState !== this.DONE) return super.response
            return handleInterceptedResponse(super.response, this.responseURL)
        }
    }

    theWindow.XMLHttpRequest = XMLHttpRequest

    const OriginalFetch = fetch
    theWindow.fetch = (input, init) => (!handleInterceptedResponse(null, input) ? OriginalFetch(input, init) :
            OriginalFetch(input, init).then(response =>
                new Promise((resolve) => response.text()
                    .then(text => resolve(new Response(handleInterceptedResponse(text, input), {
                        status: response.status,
                        statusText: response.statusText,
                        headers: response.headers
                    })))
                )
            )
    );

    return interceptNetResponse
})(unsafeWindow)

const waitForElm = (selectors) => new Promise(resolve => {
    const findElement = () => {
        const selArray = Array.isArray(selectors) ? selectors : [selectors];
        for (const s of selArray) {
            const ele = document.querySelector(s);
            if (ele) return ele;
        }
        return null;
    };

    let ele = findElement();
    if (ele) return resolve(ele);

    const observer = new MutationObserver(mutations => {
        let ele = findElement();
        if (ele) {
            observer.disconnect();
            resolve(ele);
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    log('waitForElm, MutationObserver started for selectors:', selectors);
})

function fromHTML(html) {
    if (!html) throw Error('html cannot be null or undefined', html)
    const template = document.createElement('template')
    template.innerHTML = html
    const result = template.content.children
    return result.length === 1 ? result[0] : result
}

(function () {
    'use strict';

    // 初始化时显示当前CDN设置
    log(`当前CDN设置: ${getCurCdnNode()}`)

    // Hook Bilibili PlayUrl Api
    interceptNetResponse((response, url) => {
        // 每次请求时重新检查CDN设置
        if (!isCcbEnabled()) return
        
        if (url.startsWith('https://api.bilibili.com/x/player/wbi/playurl') ||
            url.startsWith('https://api.bilibili.com/pgc/player/web/v2/playurl') ||
            url.startsWith('https://api.bilibili.com/x/player/playurl') ||
            url.startsWith('https://api.bilibili.com/x/player/online') ||
            url.startsWith('https://api.bilibili.com/x/player/wbi') ||
            url.startsWith('https://api.bilibili.com/pgc/player/web/playurl') ||
            url.startsWith('https://api.bilibili.com/pugv/player/web/playurl')
        ) {
            if (response === null) return true

            log('(Intercepted) playurl api response.')
            const responseText = response
            const playInfo = JSON.parse(responseText)
            playInfoTransformer(playInfo)
            return JSON.stringify(playInfo)
        }
    });

    // 响应式 window.__playinfo__
    if (unsafeWindow.__playinfo__) {
        playInfoTransformer(unsafeWindow.__playinfo__)
    } else {
        let internalPlayInfo = unsafeWindow.__playinfo__
        Object.defineProperty(unsafeWindow, '__playinfo__', {
            get: () => internalPlayInfo,
            set: v => {
                if (isCcbEnabled()) playInfoTransformer(v);
                internalPlayInfo = v
            }
        })
    }

    // 持续监听播放器状态变化，防止B站动态切换CDN
    let lastCheckTime = 0
    const monitorPlayback = () => {
        const now = Date.now()
        if (now - lastCheckTime > 5000) {
            lastCheckTime = now
            if (isCcbEnabled() && unsafeWindow.__playinfo__) {
                playInfoTransformer(unsafeWindow.__playinfo__)
            }
        }
    }
    
    setInterval(monitorPlayback, 1000)

    // 添加组件
    if (location.href.startsWith('https://www.bilibili.com/video/') ||
        location.href.startsWith('https://www.bilibili.com/bangumi/play/') ||
        location.href.startsWith('https://www.bilibili.com/festival/')) {
        
        waitForElm([
            '#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-control-wrap > div.bpx-player-control-entity > div.bpx-player-control-bottom > div.bpx-player-control-bottom-left',
            '#bilibili-player > div > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-control-wrap > div.bpx-player-control-entity > div.bpx-player-control-bottom > div.bpx-player-control-bottom-left'
        ])
        .then(settingsBar => {
            // CDN 选择下拉列表
            const cdnSelector = fromHTML(`
                <div class="bpx-player-ctrl-setting-checkbox" style="margin-left: 10px; display: flex; align-items: center;">
                    <span style="color: white; font-size: 12px; margin-right: 5px;">CDN:</span>
                    <select class="lccb-cdn-selector" style="background: #2b2b2b; color: white; border: 1px solid #444; padding: 2px 5px; border-radius: 4px; width: 150px; height: 22px; font-size: 12px;">
                        ${cdnList.map(cdn => `<option value="${cdn}"${cdn === getCurCdnNode() ? ' selected' : ''}>${cdn === defaultCdnNode ? cdn : cdn.split('.')[0]}</option>`).join('')}
                    </select>
                </div>
            `)

            const selectNode = cdnSelector.querySelector('select')
            selectNode.addEventListener('change', (e) => {
                const selectedCDN = e.target.value
                GM_setValue(cdnNodeStored, selectedCDN)
                log(`CDN已切换为: ${selectedCDN}`)
                // 延迟刷新，给用户一点反馈时间
                setTimeout(() => {
                    location.reload()
                }, 100)
            })

            settingsBar.appendChild(cdnSelector)
            log('CDN selector added, 当前选择:', getCurCdnNode())
        });
    }
})();