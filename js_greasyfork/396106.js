// ==UserScript==
// @name         QQ飞车官方论坛视频处理工具 - 自动识别视频并以 <iframe> 方式加载
// @namespace    https://speed.qq.com
// @icon         https://speed.qq.com/favicon.ico
// @version      1.0.0
// @description  视频播放方式改为 <iframe> 加载, 避免 chomre 及 firefox 需要手动开启 flash 权限的情况(现在所有浏览器厂商普遍表示将在未来淘汰 flash, 包括 adobe); 通过加速的方式跳过片头广告
// @author       Sven
// @match        https://speed.gamebbs.qq.com/forum.php?mod=viewthread&tid=*
// @match        https://v.qq.com/txp/iframe/player.html?vid=*
// @match        https://v.qq.com/x/cover/*.html*
// @match        https://v.qq.com/x/page/*.html*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396106/QQ%E9%A3%9E%E8%BD%A6%E5%AE%98%E6%96%B9%E8%AE%BA%E5%9D%9B%E8%A7%86%E9%A2%91%E5%A4%84%E7%90%86%E5%B7%A5%E5%85%B7%20-%20%E8%87%AA%E5%8A%A8%E8%AF%86%E5%88%AB%E8%A7%86%E9%A2%91%E5%B9%B6%E4%BB%A5%20%3Ciframe%3E%20%E6%96%B9%E5%BC%8F%E5%8A%A0%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/396106/QQ%E9%A3%9E%E8%BD%A6%E5%AE%98%E6%96%B9%E8%AE%BA%E5%9D%9B%E8%A7%86%E9%A2%91%E5%A4%84%E7%90%86%E5%B7%A5%E5%85%B7%20-%20%E8%87%AA%E5%8A%A8%E8%AF%86%E5%88%AB%E8%A7%86%E9%A2%91%E5%B9%B6%E4%BB%A5%20%3Ciframe%3E%20%E6%96%B9%E5%BC%8F%E5%8A%A0%E8%BD%BD.meta.js
// ==/UserScript==

; (function () {
    /**
     * 工具模块类
     */
    class ToolkitModule {
        static playbackRate = 16
        static PAGES = {
            bbs: {
                host: 'speed.gamebbs.qq.com',
                sheets: `
                    #video_iframe_wrapper {
                        margin-bottom: 20px;
                        display: flex;
                        justify-content: center;
                    }
                    #video_iframe_wrapper > iframe {
                        width: 100%;
                        max-width: 900px;
                        height: 65vh;
                        min-height: 450px;
                        max-height: 600px;
                    }
                `
            },
            qq_video: {
                host: 'v.qq.com',
                sheets: `
                    #video_container txpdiv.txp_tipbar { display: none; }
                    .txp_recommend_content > .txp_btn.txp_btn_expand { display: none; }
                `,
                get adExists() {
                    return !!document.querySelector('.txp_ad_control:not(.txp_none)')
                }
            },
            iqiyi_video: {
                host: 'www.iqiyi.com',
                sheets: `
                    div[data-adzone] {
                        display: none;
                    }
                `,
            }
        }
        static get PAGE_TYPE() {
            for (const page in ToolkitModule.PAGES) {
                if (location.host === ToolkitModule.PAGES[page].host) return page
            }
        }
        static get PAGE_OPTIONS() {
            for (const page in ToolkitModule.PAGES) {
                if (location.host === ToolkitModule.PAGES[page].host) return ToolkitModule.PAGES[page]
            }
        }
        static get TEXT_ARTICLE() { const d = document.querySelector('.plc .pct'); return d && d.innerText }
        static get VIDEO_URL() {
            const article = ToolkitModule.TEXT_ARTICLE
            const urlMatchResult = article.match(/https:\/\/v\.qq\.com\/x\/page\/([\d\w]+).htm.*/) || article.match(/http:\/\/v\.qq\.com\/page\/.*\/([\d\w]+).htm.*/)
            const embed = document.querySelector('embed')
            return (embed && embed.src.indexOf('17173') > 0)
                ? embed.src
                : (urlMatchResult && urlMatchResult[0])
        }
        static get VIDEO_ID() {
            // console.log(ToolkitModule.VIDEO_URL)
            if (!ToolkitModule.VIDEO_URL) return
            if (ToolkitModule.VIDEO_URL.indexOf('17173') > 0) { // such as http://f.v.17173cdn.com/player_f2/MTQ0MjI1MTA.swf
                const matchResult = ToolkitModule.VIDEO_URL.match(/http:\/\/[\w\.]+17173cdn.com\/.*\/([\d\w]+)\.swf/)
                return matchResult[1]
            } else {
                const urlMatchResult = ToolkitModule.VIDEO_URL.match(/https:\/\/v\.qq\.com\/x\/page\/([\d\w]+).htm.*/) || ToolkitModule.VIDEO_URL.match(/http:\/\/v\.qq\.com\/page\/.*\/([\d\w]+).htm.*/)
                return urlMatchResult[1]
            }
        }
        static get VIDEO_IFRAME_URL() {
            if (!ToolkitModule.VIDEO_ID) return
            // console.warn(ToolkitModule.VIDEO_ID)
            return ToolkitModule.VIDEO_URL.indexOf('17173') > 0 ? `//v.17173.com/player_ifrm2/${ToolkitModule.VIDEO_ID}.html` : `https://v.qq.com/txp/iframe/player.html?vid=${ToolkitModule.VIDEO_ID}`
        }
        static get DOM_VIDEOS() {
            return document.querySelectorAll('video')
        }
        get activePages() { throw new Error('must implemention') }
        get isActive() { return this.activePages.includes(ToolkitModule.PAGE_TYPE) }
        onload() { throw new Error('must implemention') }
        /**
         * 通过重写 setTimeout 实现加速 setTimeout
         * @param {number} multiple 加速倍数
         */
        speedUpSetTimeout(multiple = 30) {
            window._setTimeout = setTimeout
            window.setTimeout = (handler, time, ...args) => {
                window._setTimeout(handler, time / multiple, ...args)
            }
        }
    }
    /**
     * 论坛视频贴载入视频的 iframe
     */
    class VideoToolkitModule extends ToolkitModule {
        activePages = ['bbs']
        constructor() { super() }
        onload(ctx) {
            ctx.log('已提取到视频, URL: ', ToolkitModule.VIDEO_IFRAME_URL)
            if (!ToolkitModule.VIDEO_IFRAME_URL) return
            const videoIframeWrapper = document.createElement('div')
            videoIframeWrapper.id = 'video_iframe_wrapper'
            const iframe = this.generateVideoDom(ToolkitModule.VIDEO_IFRAME_URL, this.iframeOnload)
            videoIframeWrapper.appendChild(iframe)
            document.querySelector('.pcb').insertBefore(videoIframeWrapper, document.querySelector('.pcb > div'))
        }
        generateVideoDom(url, onload) {
            const iframe = document.createElement('iframe')
            iframe.addEventListener('load', onload)
            iframe.id = 'video_iframe'
            iframe.setAttribute('frameBorder', '0')
            iframe.setAttribute('allowFullScreen', 'true')
            iframe.src = url
            return iframe
        }
        iframeOnload(evt) {
            console.log('iframe load', evt)
        }
    }
    /**
     * 载入页面样式
     */
    class SheetsToolkitModule extends ToolkitModule {
        activePages = ['bbs', 'qq_video']
        constructor() { super() }
        onload(ctx) {
            const sheet = document.createTextNode(ToolkitModule.PAGE_OPTIONS.sheets)
            const el = document.createElement('style')
            el.id = 'toolkit-sheets'
            el.appendChild(sheet)
            document.getElementsByTagName('head')[0].appendChild(el)
        }
    }
    /**
     * 加速跳过腾讯视频片头广告
     */
    class QQVideoADJumpToolkitModule extends ToolkitModule {
        activePages = ['qq_video']
        constructor() { super() }
        onload(ctx) {
            setInterval(() => {
                const adExists = ToolkitModule.PAGE_OPTIONS.adExists
                const videos = document.querySelectorAll('video')
                if (!adExists) {
                    // ctx.log(`[QQVideoADJump] 已加速跳过广告, enjoy`)
                    if (videos && videos.length) videos.forEach(v => v.playbackRate = 1)
                    return
                }
                for (const video of videos) {
                    video.playbackRate = ToolkitModule.playbackRate
                    ctx.log(`[QQVideoADJump] 腾讯视频过滤日志 => 视频播放加速倍率: ${video.playbackRate}; 视频状态值: ${video.status}, 正在播放广告: ${adExists}`)
                }
            }, 1000);
        }
    }
    /**
     * 工具类
     */
    class Toolkit {
        debug = true
        options = {}
        constructor(options = {}) {
            Object.assign(this.options, options)
            this.emitHook('init')
        }
        /**
         * 工具集
         */
        static modules = []
        /**
         * 注册工具模块
         */
        static use(moduleItem) {
            // 禁用未激活的模块
            if (!moduleItem.isActive) return
            Array.isArray(moduleItem) ? moduleItem.map(item => Toolkit.use(item)) : Toolkit.modules.push(moduleItem)
        }
        /**
         * 触发钩子函数
         * @param {string}} hook 钩子函数名
         */
        emitHook(hook) {
            this.log('触发钩子函数: ' + hook)
            Toolkit.modules.map(module => module[hook] && typeof module[hook] === 'function' && module[hook](this))
        }
        log(...args) {
            console.log('%c[QQ Speed BBS Toolkit] LOG: ', 'color:teal', ...args)
        }
        static delay(timeout = 200) {
            return new Promise(resolve => setTimeout(resolve, timeout))
        }
    }
    Toolkit.use(new SheetsToolkitModule())
    Toolkit.use(new VideoToolkitModule())
    Toolkit.use(new QQVideoADJumpToolkitModule())
    window._$Toolkit = new Toolkit()
    window.addEventListener('DOMContentLoaded', () => window._$Toolkit.emitHook('onload'))
})();