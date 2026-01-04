// ==UserScript==
// @name           jirengu video hotkeys
// @description    Control + Option/Alt + ArrowRight = next video. For other configuration, see the top of source codes.
// @author         yeshiqing
// @license        MIT
// @run-at         document-idle
// @match          https://xiedaimala.com/tasks/*
// @match          https://jirengu.com/tasks/*
// @grant          none
// @version        1.1.4
// @namespace      https://github.com/yeshiqing/tampermonkey-scripts
// @icon           https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @downloadURL https://update.greasyfork.org/scripts/454346/jirengu%20video%20hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/454346/jirengu%20video%20hotkeys.meta.js
// ==/UserScript==

// ==用户可修改的配置项==
const VOLUME_ADJUST_ARROWKEY_DOWN = 4           // 左右方向键调整视频快进快退的粒度，以秒为单位。
const AUTO_FULLSCREEN = true                    // 视频是否自动全屏
const AUTO_FULLSCREEN_MODE_WEBSITESCREEN = true // 自动全屏是否采用「网页全屏」模式。若为 false，则采用「全屏」模式
const VIDEO_AUTOPLAY = true                     // 视频是否自动播放
const SHOW_VIDEO_TITLE = true                   // 浏览器标签页的标题是否显示为视频标题
const F_KEYUP_SWITCH_WEBSITESCREEN = true       // f keyup 事件是否触发切换「网页全屏」。若为 false 则事件触发时切换「全屏」。
const ESCAPE_KEYUP_PAUSE_VIDEO = true           // esc keyup 事件触发退出全屏后，是否暂停播放。若为 false 则事件触发退出全屏后，保持原有播放状态。
const VIDEO_DBLCLICK_DISABLE = true             // 是否禁用视频原有的鼠标双击事件，原有事件会切换「全屏」模式。当切换应用时会误触发双击事件，导致切换至「全屏」。
const VOLUMN_BTN_MOUSEOVER_DISABLE = true       // 是否禁用音量调节按钮的 mouseover 事件。禁用 mouseover 会使得鼠标悬浮到音量键上方时不显示音量，这样做的好处是当想精细调节进度时，滑动鼠标到进度条开头部分，不会误触发音量调节。属于个人喜好，我一般用键盘的音量键调节音量。
const CUSTOM_EVENTS_CONFIG = [
    {
        description: "Control + Option/Alt + ArrowRight = next video",
        key: "ArrowRight",                // e.key
        eventType: "keydown",
        this: window,                     // 监听哪个对象的事件，默认为 window
        modifiers: ["ctrlKey", "altKey"], // 事件监听中 ctrlKey, altKey, metaKey, shiftKey 可作为修饰键
        fn: "goToNextVideo"
    }
]
// ==/用户可修改的配置项==

// ==Config For Development==
const DEBUG_EVENT_MODE = false             // 是否开启事件调试模式
const EVENTS_DISABLE = [/*'mouseover'*/]   // 禁用所有该类型的事件。
const CMD_KEYDOWN_DISABLE = false          // 用于调试
const VIDEO_CLICK_DISABLE = false          // 用于调试。不触发源代码中与 video click 事件相关的函数，因为按快捷键前需要点击一下聚焦 video。
const LOG_VIDEO_STATUS = false
const F_KEYUP_HIJACK_AFTER = true          // 是否在原有 f keyup 事件触发后加入 hook
const ESCAPE_KEYUP_HIJACK_AFTER = true     // 是否在原有 escape keyup 事件触发后加入 hook
const HIJACK_EVENTS_CONFIG = {
    'rawEvents': {
        'keyup': [{
            'eventType': 'keyup',
            'key': 'Escape', // event.key
            'this': document, // 监听哪个对象的事件
            'fn': null, // 在原有事件处理程序之前插入 hook 的函数名
            'hijack': false, // 是否在原有事件处理程序之前插入 hook
            'fnAfter': 'pauseVideo', // 在原有事件处理程序之后插入 hook 的函数名
            'hijackAfter': ESCAPE_KEYUP_HIJACK_AFTER && ESCAPE_KEYUP_PAUSE_VIDEO, // 是否在原有事件处理程序之后插入 hook
            'disable': false         // 是否禁用原有事件处理程序
        }, {
            'eventType': 'keyup',
            'key': 'f',
            'this': document,
            'fnAfter': 'switchWebsiteScreen',
            'hijackAfter': F_KEYUP_HIJACK_AFTER && F_KEYUP_SWITCH_WEBSITESCREEN,
            'disable': true
        }],
        'keydown': [{
            'eventType': 'keydown',
            'key': 'Meta',
            'this': document,
            'disable': CMD_KEYDOWN_DISABLE
        }, {
            'eventType': 'keydown',
            'key': 'ArrowRight',
            'this': document,
            'fnAfter': 'fastForward',
            'hijackAfter': true,
            'disable': true

        }, {
            'eventType': 'keydown',
            'key': 'ArrowLeft',
            'this': document,
            'fnAfter': 'fastRewind',
            'hijackAfter': true,
            'disable': true

        }],
        'click': [{
            'eventType': 'click',
            'this': 'video',
            'disable': VIDEO_CLICK_DISABLE
        }],
        'dblclick': [{
            'eventType': 'dblclick',
            'this': 'video',
            'disable': VIDEO_DBLCLICK_DISABLE
        }],
        'mouseover': [{
            'eventType': 'mouseover',
            'this': '.vjs-volume-panel',
            'disable': VOLUMN_BTN_MOUSEOVER_DISABLE
        }]
    },
    // 自定义。与 rawEvents 有不同数据结构
    'videoEvents': {
        'eventType': ['playing', 'play', 'waiting', 'pause', 'ended', 'loadedmetadata'],
        'key': null,
        'this': 'video',
        'fn': 'setVideoStatus',
        'hijack': true,
        'disable': false
    },
}
// ==/Config For Development==


let $utils = {
    isFunction(obj) { return typeof obj === 'function' },
    isBoolean(obj) { return typeof obj === 'boolean' },
    isString(obj) { return typeof obj === 'string' },
    isUndefined(obj) { return typeof obj === 'undefined' }
}
/**
 * 触发 hijack 和 hijackAfter 所绑定的事件
 */
let $triggerHijackEvents = {
    _simulate_keyupEscape() {
        const event = new KeyboardEvent('keyup', {
            key: "Escape",
            view: window,
            bubbles: true,
            cancelable: true
        })
        document.dispatchEvent(event)
    },
    /**
     * 是否网页全屏 
     */
    _isWebsiteScreen() {
        let elm = document.querySelector('.video-wrapper')
        return elm && elm.matches('.fullWindow')
    },
    _getVideo() {
        return document.querySelector('.vjs-tech') || document.querySelector('video')
    },
    /**
     * f keyup trigger 切换「网页全屏」
     */
    switchWebsiteScreen(event) {
        if (this._isWebsiteScreen()) {
            this._simulate_keyupEscape()
        } else {
            document.dispatchEvent(new CustomEvent("videoToggleFullWindow"))
        }
    },
    /**
     * Escape keyup trigger
     */
    pauseVideo(event) {
        if (this._isWebsiteScreen()) {
            let video = this._getVideo()
            video && video.pause()
        }
    },
    /**
     * 'videoEvents' trigger
     */
    setVideoStatus(event) {
        $hijackEventsHandler.video_status = event.type
        LOG_VIDEO_STATUS && console.log($hijackEventsHandler.video_status)
    },
    /**
     * ArrowRight keydown trigger
     */
    fastForward(event) {
        let video = this._getVideo()
        video && (video.currentTime = video.currentTime + VOLUME_ADJUST_ARROWKEY_DOWN)
    },
    /**
     * ArrowLeft keydown trigger
     */
    fastRewind(event) {
        let video = this._getVideo()
        video && (video.currentTime = video.currentTime - VOLUME_ADJUST_ARROWKEY_DOWN)
    }
}
let $hijackEventsHandler = {
    events: HIJACK_EVENTS_CONFIG,
    video_status: 'loadedmetadata', // loadedmetadata, playing, play, waiting, pause, ended
    trigger: $triggerHijackEvents,
    /**
     * 是否拦截原事件处理程序
     * @param {object} event
     * @returns {boolean}
     */
    isDisable(event) {
        let obj = $hijackEventsHandler.getEvent(event)
        if (!obj) { return false }
        let { disable } = obj

        return $utils.isBoolean(disable) ? disable : false // 默认 disable 为 false
    },
    /**
     * 在原本事件之前触发的 hook
     */
    triggerBefore(event) {
        let obj = $hijackEventsHandler.getEvent(event)
        if (!obj) { return }

        let { hijack } = obj, fn = null
        if (!$utils.isBoolean(hijack)) { hijack = false } // 默认 hijack 为 false

        hijack && $utils.isFunction(this.trigger[obj.fn]) && this.trigger[obj.fn](event)
    },
    /**
     * 在原本事件之后触发的 hook
     */
    triggerAfter(event) {
        let obj = $hijackEventsHandler.getEvent(event)
        if (!obj) { return }

        let { hijackAfter } = obj
        if (!$utils.isBoolean(hijackAfter)) { hijackAfter = false } // 默认 hijackAfter 为 false

        hijackAfter && $utils.isFunction(this.trigger[obj.fnAfter]) && this.trigger[obj.fnAfter](event)
    },
    getThis(selector) {
        if (selector instanceof Object) {
            return selector
        } else if ($utils.isString(selector)) {
            return document.querySelector(selector)
        } else if ($utils.isUndefined(selector)) {
            console.warn(`add 'this' to 'EVENTS_CONFIG' or 'window' in default`)
            return window
        }
        throw new Error(`can't find element according to the selector: '${selector}'`,)
    },
    /**
     * 获取 EVENTS_CONFIG 中的事件信息
     */
    getEvent(event) {
        let eventType = event.type
        // get from 'videoEvents'
        const videoEvents = $hijackEventsHandler.events.videoEvents
        const VIDEO_EVENTNAME = videoEvents.eventType
        if (VIDEO_EVENTNAME.includes(eventType) || event.currentTarget.tagName === 'video') {
            return videoEvents
        }

        // get from 'rawEvents'
        let arr = $hijackEventsHandler.events.rawEvents[eventType] || null
        if (arr) {
            let currentTarget = event.currentTarget
            let key = event.key
            let obj = arr.find((el, i) => {
                return $hijackEventsHandler.getThis(el['this']) === currentTarget && (el.key ? el.key === key : true)
            })
            return obj || null
        }
        return null
    }
}
let $customEventsHandler = {
    trigger: {
        // control + option/alt + arrowRight trigger
        goToNextVideo() {
            let nodeList = document.querySelectorAll('.task-name')
            let span_nextTask = nodeList[nodeList.length - 1]
            span_nextTask && span_nextTask.click()
        }
    },
    /**
     * 检测键盘按键是否匹配「触发自定义事件所需的快捷键」
     */
    checkKeycodes(e, config) {
        let { key, modifiers } = config
        if (e.key !== key) { return false }
        let trigger = true
        modifiers.forEach((modifier) => {
            (e[modifier] === false) && (trigger = false)
        })
        return trigger
    }

}
let $init = {
    setDocumentTitleToVideoTitle() {
        if (!SHOW_VIDEO_TITLE) { return }
        let ele_title = document.querySelector('.video-title') || document.querySelector('j-panel-title h1')
        ele_title && (document.title = ele_title.textContent)
    },
    videoAutoPlay() {
        if (!VIDEO_AUTOPLAY) { return }

        let ele_playButton = document.querySelector('.vjs-big-play-button')
        ele_playButton && ele_playButton.click()
        if (AUTO_FULLSCREEN) {
            if (AUTO_FULLSCREEN_MODE_WEBSITESCREEN) {
                let btn = document.querySelector('.video-js-fullwindow-button')
                btn && btn.click()
                return
            }
            let btn = document.querySelector('.vjs-fullscreen-control')
            btn && btn.click()
        }
    },
    /**
     * control + option + arrowRight = next video
     */
    createCustomHotkeys() {
        if (!Array.isArray(CUSTOM_EVENTS_CONFIG)) { return }
        CUSTOM_EVENTS_CONFIG.forEach((item) => {
            let { eventType, fn } = item
            let { checkKeycodes, trigger } = $customEventsHandler
            let eventTarget = item['this'] || window
            eventTarget.addEventListener(eventType, (e) => {
                if (checkKeycodes(e, item)) {
                    $utils.isFunction(trigger[fn]) && trigger[fn]()
                }
            })

        })
    },
    hijackOriginalHotkeys() {
        const OLD_ADD_EL = EventTarget.prototype.addEventListener
        EventTarget.prototype.addEventListener = function (eventType, fn, ...args) {
            if (EVENTS_DISABLE.includes(eventType)) {
                return
            }

            // worker inject error. `worker.addEventListener('message',fn)`
            if (this instanceof Worker) {
                OLD_ADD_EL.call(this, eventType, fn, ...args)
                return
            }

            OLD_ADD_EL.call(this, eventType, function foo(event) {
                if (DEBUG_EVENT_MODE && event.type === 'keyup' && event.key === 'Escape' /*&& event.currentTarget === document*/) {
                    debugger
                }

                $hijackEventsHandler.triggerBefore(event)
                !$hijackEventsHandler.isDisable(event) && fn.call(this, event)
                $hijackEventsHandler.triggerAfter(event)
            }, ...args)
        }
    }
}

// init
window.onload = () => {
    setTimeout(() => { // wait for xhr done
        $init.setDocumentTitleToVideoTitle()
        $init.videoAutoPlay()
    }, 2000)

    $init.createCustomHotkeys()
    $init.hijackOriginalHotkeys()
}