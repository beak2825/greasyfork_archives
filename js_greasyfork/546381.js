// ==UserScript==
// @name         IYF Ad Filter
// @name:zh-CN   爱壹帆广告过滤器
// @name:zh-TW   愛壹帆廣告過濾器
// @description  Filter ads on iyf.tv
// @description:zh-CN  过滤爱壹帆上的广告
// @description:zh-TW  過濾愛壹帆上的廣告
// @version      0.3.30
// @namespace    https://github.com/dzist
// @author       Dylan Zhang
// @include      *://*.iyf.tv/*
// @include      *://*.yifan.tv/*
// @include      *://*.yfsp.tv/*
// @include      *://*.aiyifan.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=iyf.tv
// @license      MIT
// @run-at       document-end
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/546381/IYF%20Ad%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/546381/IYF%20Ad%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* utilities */
    const utils = {
        log(...args) {
            console.log(
                '%cIYF Ad Filter',
                'padding: 0 4px; background: cyan; color: #000;',
                ...args
            )
        },

        ensureCondition(condition, maxAttempts = 600 /* 10s */, failureMessage) {
            const raf = window.requestAnimationFrame

            return new Promise((resolve, reject) => {
                let attempts = 0
                const detect = () => {
                    const result = condition()
                    if (result) {
                        resolve(result)
                    } else if (attempts < maxAttempts) {
                        attempts++
                        raf(detect)
                    } else {
                        reject(new Error(failureMessage))
                    }
                }
                raf(detect)
            })
        },
        ensureElement(selector, maxAttempts = 600) {
            return utils.ensureCondition(
                () => document.querySelector(selector),
                maxAttempts,
                `Could not detect ${selector} after ${maxAttempts} attempts`
            )
        },

        getProperty(obj, ...props) {
            const stack = [obj]
            let current = obj

            for(let i = 0, len = props.length; i < len; i++) {
                const key = props[i]
                // check for undefined or null
                if (current == null) {
                    return [, stack]
                }

                const isArraySearch = Array.isArray(current) && isNaN(Number(key))
                if (isArraySearch) {
                    // if the `current` value is an array and the key is not a number,
                    // find the first item with the key inside it.
                    const foundItem = current.find(item => item && item[key])
                    if (foundItem) {
                        stack.push(foundItem)
                        current = foundItem[key]
                    } else {
                        return [, stack]
                    }
                } else {
                    current = current[key]
                    if (i < len - 1 && current) {
                        stack.push(current)
                    }
                }
            }

            return [current, stack]
        },

        emptyArray: new Proxy([], {
            set() { return true },
            get(target, prop) {
                const igoredMethods = ['push']
                return igoredMethods.includes(prop)
                    ? () => 0
                    : target[prop]
            }
        }),
    }

    /* router */
    class Router {
        constructor() {
            this.routes = new Map()
            this.beforeCbs = new Set()
            this.currentMatcher = null
            this.overrideHistory()
        }
        overrideHistory() {
            const { history } = window
            const hook = () => this.handle()
            const override = (fn) => {
                return (...args) => {
                    const result = fn.apply(history, args)
                    hook()
                    return result
                }
            }

            history.pushState = override(history.pushState)
            history.replaceState = override(history.replaceState)
            window.addEventListener('popstate', hook)
        }

        // use(path: string | () => void, cb?: () => void): Router
        use(path, cb) {
            let matcher

            if (typeof path === 'string') {
                matcher = this.getMatcher(path)
                if (!matcher) {
                    matcher = {
                        path,
                        regexp: new RegExp(`^${path}$`)
                    }
                }
                this.currentMatcher = matcher
            }
            if (typeof path === 'function') {
                cb = path
                matcher = this.currentMatcher
            }
            if (cb) {
                const cbs = this.routes.get(matcher)
                cbs
                    ? cbs.add(cb)
                    : this.routes.set(matcher, new Set([cb]))
            }

            return this
        }
        // disuse(path: string, cb?: () => void): boolean
        disuse(path, cb) {
            const matcher = this.getMatcher(path)
            if (!matcher) return true

            const cbs = this.routes.get(matcher)
            if (!cbs) return true

            if (!cb) {
                cbs.clear()
                return true
            }

            return cbs.delete(cb)
        }
        getMatcher(path) {
            return this.routes
                .keys()
                .find(m => m.path === path)
        }
        once(path, cb) {
            if (typeof path === 'string' && !cb) {
                throw new Error(
                    `It is not the path, but the corresponding function that can only be used once.` +
                    `Please specify a callback function for the path: ${path}\n` +
                    `such as once('/', () => {...})`
                )
            }

            if (typeof path === 'function') {
                cb = path
                path = this.currentMatcher?.path
                if (!path) {
                    throw new Error(
                        `Please specify the path for the callback function first:\n${cb}\n` +
                        `such as use('/') or once('/', () => {...})`
                    )
                }
            }
            const fnOnce = (...args) => {
                cb(...args)
                this.disuse(path, fnOnce)
            }

            return this.use(path, fnOnce)
        }

        before(cb) {
            this.beforeCbs.add(cb)
            return this
        }
        beforeOnce(cb) {
            const fnOnce = (...args) => {
                cb(...args)
                this.beforeCbs.delete(fnOnce)
            }
            return this.before(fnOnce)
        }

        handle(path = this.path) {
            this.beforeCbs.forEach(cb => cb())

            for(const [matcher, cbs] of this.routes) {
                if (matcher.regexp.test(path)) {
                    cbs.forEach(cb => cb())
                    break
                }
            }
        }

        get path() {
            const segments = location.pathname.split('/')
            const path = segments[1]
            return path ? `/${path}` : '/'
        }
    }

    /* shortcuts */
    class VideoShortcuts {
        // This is a singleton.
        // Ideally, private static fields/methods should be used,
        // but the public ones are required here for compatibility.
        static instance = null
        static canNew = false
        static toggleNew(value) {
            this.canNew = value
        }
        // Must be a public static method for the user to call
        static getInstance(...args) {
            if (!this.instance) {
                this.toggleNew(true)
                this.instance = new VideoShortcuts(...args)
                this.toggleNew(false)
            }
            return this.instance
        }

        constructor(player) {
            if (!VideoShortcuts.canNew) {
                throw new Error(
                    `Forbid to create an instance of the class 'VideoShortcuts' with the 'new' keyword.` +
                    `Please use its static method: 'VideoShortcuts.getInstance(arg1, arg2, ...)`
                )
            }

            this.player = player
            this.seekStep = 5
            this.volumeStep = 0.1
            this.bindEvents()
        }

        bindEvents() {
            window.addEventListener('keydown', this.handleKeyDown)
            window.addEventListener('beforeunload', this.handleBeforeUnload)
        }
        handleKeyDown = (event) => {
            if (this.isTyping || !this.player) return

            switch(event.key) {
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                    this.setPlaybackRate(parseInt(event.key))
                    break
                case 'w': // increase volume
                    this.setVolume(this.currentVolume + this.volumeStep)
                    break
                case 's': // decrease volume
                    this.setVolume(this.currentVolume - this.volumeStep)
                    break
                case 'a': // rewind
                    this.seek(this.currentTime - this.seekStep)
                    break
                case 'd': // fast forward
                    this.seek(this.currentTime + this.seekStep)
                    break
                case 'f': // fullscreen
                    this.toggleFullscreen()
                    break
            }
        }
        handleBeforeUnload = () => {
            window.removeEventListener('keydown', this.handleKeyDown)
            window.removeEventListener('beforeunload', this.handleBeforeUnload)
            this.player = null
        }

        toggleFullscreen() {
            this.player.fsAPI.toggleFullscreen()
        }

        get currentTime() {
            return this.player.currentTime
        }
        seek(time) {
            this.player.currentTime = time
        }

        get currentVolume() {
            return this.player.volume
        }
        setVolume(volume) {
            if (volume > 1) volume = 1
            if (volume < 0) volume = 0
            this.player.volume = volume
        }

        setPlaybackRate(rate) {
            this.player.playbackRate = rate
        }

        get isTyping() {
            const activeElement = document.activeElement
            return activeElement instanceof HTMLInputElement
                || activeElement instanceof HTMLTextAreaElement
                || activeElement.isContentEditable
        }
    }

    /* pages */
    const router = new Router()
    router.once('/', () => {
        const indexStyle = `
            .sliders .sec4,
            .sliders .sec4 + .separater,

            app-index app-recommended-news:has(a[href="/svideo"]),
            app-index app-classified-top-videos:has(a[href="/movie"]) > app-home-collection,
            app-index app-classified-top-videos:has(a[href="/list/short"]),
            app-index app-classified-top-videos:has(a[href="/user/watch-history"]),
            app-index div:has(> app-discovery-in-home),
            app-index .new-list {
                display: none!important;
            }
        `
        GM_addStyle(indexStyle)
    })

    router.use('/(play|watch)')
    .once(() => {
        const playStyle = `
            .video-player > div:last-child,

            .video-player vg-pause-f,
            .video-player .overlay-logo,
            .video-player .publicbox,
            .video-player .quanlity-items .use-coin-box {
                display: none!important;
            }

            .video-player .player-title {
                margin-left: 0!important;
            }

            .video-player + div.ps > div.bl {
                display: none!important;
            }

            .main div.playPageTop {
                min-height: 594px!important;
            }
        `
        GM_addStyle(playStyle)
    })
    .use(() => {
        const { log, ensureElement, getProperty, emptyArray } = utils

        Promise.all([
            ensureElement('aa-videoplayer'),
            ensureElement('vg-player'),
            ensureElement('.action-pannel i')
        ]).then(([
            aaVideoPlayerEl,
            vgPlayerEl,
            danmuBtnEl
        ]) => {
            // close danmu
            if (danmuBtnEl.classList.contains('icondanmukai')) {
                danmuBtnEl.click()
            }

            const contextKey = '__ngContext__'

            // remove the 20-second pause ads
            const [ads] = getProperty(aaVideoPlayerEl, contextKey, 'pgmp')
            if (ads) {
                ads.dataList = emptyArray
            } else {
                log(`The AD API not found`)
            }

            // shortcuts
            const [player] = getProperty(vgPlayerEl, contextKey, 'API')
            if (player) {
                VideoShortcuts.getInstance().player = player
            } else {
                log(`The Player API not found`)
            }
        })
    })

    router.once('/(list|search)', () => {
        const listStyle = `
            #filterDiv,
            .filters {
                width: 100%;
            }

            .filters +  div.ss-ctn {
                display: none!important;
            }
        `
        GM_addStyle(listStyle)
    })

    router.beforeOnce(() => {
        const commonStyle = `
            a:has(img[alt="广告"]),
            a[href="https://www.wyav.tv/"],
            i.vip-label {
                display: none!important;
            }

            .navbar .multi-top-buttons,
            .navbar app-dn-user-menu-item.top-item,
            .navbar .login-inner-box,
            .navbar .menu-item:has(a[href="https://www.wyav.tv/"]) {
                display: none!important;
            }
            .navbar .menu-pop.two-col {
                width: 160px!important;
                left: 0!important;
            }
            .navbar .my-card.none-user,
            .navbar .none-user-content {
                height: auto!important;
            }

            .login-frame-container .gg-dl {
                display: none!important;
            }
            .login-frame-container .login-frame-box.heighter,
            .login-frame-container .inner {
                width: auto!important;
                margin-left: 0px!important;
            }

            #sticky-block .inner {
                display: none!important;
            }
        `
        GM_addStyle(commonStyle)
    })

    function main() {
        router.handle()
    }

    main()
})();