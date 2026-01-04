// ==UserScript==
// @license     AGPL License
// @name        Youtube长按倍速脚本
// @name:en     Youtube long press to speed up
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/*
// @run-at      document-start
// @grant       none
// @version     2.6
// @author      n1nja88888
// @description Youtube长按倍速，广告也能倍速/快进跳过。
// @description:en Youtube long press to speed up, also works for ads.
// @downloadURL https://update.greasyfork.org/scripts/466105/Youtube%E9%95%BF%E6%8C%89%E5%80%8D%E9%80%9F%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/466105/Youtube%E9%95%BF%E6%8C%89%E5%80%8D%E9%80%9F%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
'use strict'
const speed = 2
const forward = 5
let isSpeeding = false
console.log('n1nja88888 creates this world!')

!function () {
    //改变keydown事件监听器函数 忽略指定key
    function keydownOmit(listener, omits) {
        return (...args) => {
            if (!omits.has(args[0].key))
                listener(...args)
        }
    }
    // 对于非document级的事件监听改写，直接把改写逻辑写在改写的函数中，而不是再为指定元素添加一个新的监听器
    // 倍速屏蔽进度条的鼠标移动
    function blockMouseMovement(listener) {
        let timer = null
        return (...args) => {
            const context = document.querySelector('#movie_player')
            if (isSpeeding && (args[0].target === context || context.contains(args[0].target))) {
                if (context.style.cursor === '' || context.style.cursor === 'none')
                    context.style.cursor = 'auto'
                clearTimeout(timer)
                timer = setTimeout(() => {
                    if (isSpeeding)
                        context.style.cursor = 'none'
                }, 3e3)
            }
            else
                listener(...args)
        }
    }
    // 倍速暂停显示进度条
    function showProgressBar(listener) {
        return (...args) => {
            if (isSpeeding)
                progressBar(true)
            listener(...args)
        }
    }
    function hideProgressBar(listener) {
        return (...args) => {
            if (isSpeeding)
                progressBar()
            listener(...args)
        }
    }
    document._addEventListener = document.addEventListener
    // document中就是keydown控制快进这些
    // keyup存在暂停视频的逻辑
    document.addEventListener = function (type, listener, useCapture = false) {
        if (type === 'keypress' || type === 'keydown')
            listener = keydownOmit(listener, new Set(['ArrowLeft', 'ArrowRight', ' ']))
        else if (type === 'keyup')
            listener = keydownOmit(listener, new Set([' ']))
        this._addEventListener(type, listener, useCapture)
    }

    // 操作同上，对ELement的事件监听器也重写一遍
    Element.prototype._addEventListener = Element.prototype.addEventListener
    Element.prototype.addEventListener = function (type, listener, useCapture = false) {
        if (type === 'keypress' || type === 'keydown')
            listener = keydownOmit(listener, new Set(['ArrowLeft', 'ArrowRight', ' ']))
        else if (type === 'keyup')
            listener = keydownOmit(listener, new Set([' ']))
        else if (type === 'mousemove' || type === 'mouseleave')
            listener = blockMouseMovement(listener)
        else if (type === 'pause')
            listener = showProgressBar(listener)
        else if (type === 'play')
            listener = hideProgressBar(listener)
        this._addEventListener(type, listener, useCapture)
    }
}()

main()

async function main() {
    // 倍速定时器
    let timer = null
    //初始速度，松开按键后是恢复到初始速度
    let initSpeed = -1
    let video = null
    const speedSign = speedSignClosure()
    const forwardSign = forwardSignClosure()
    document._addEventListener('keydown', (e) => {
        if (isCombKey(e) || isActive('input', 'textarea', '#contenteditable-root'))
            return
        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault()
                video = getVideo()
                if (!video)
                    return
                video.currentTime -= forward
                forwardSign(false)
                break
            case 'ArrowRight':
                e.preventDefault()
                if (!timer) {
                    video = getVideo()
                    if (!video)
                        return
                    timer = setTimeout(() => {
                        isSpeeding = true
                        video.play()
                        initSpeed = video.playbackRate
                        video.playbackRate = speed
                        progressBar()
                        speedSign()
                    }, 0.2e3)
                }
                break
            case ' ':
                e.preventDefault() // 会阻止Youtube自带的功能，比如调用这个函数后会导致原本的视频暂停失效
                video = getVideo()
                if (!video)
                    return
                video.paused ? video.play() : video.pause()
                break
            // 短视频评论
            case 'c':
            case 'C':
                const comment = document.querySelector('#comments-button button')
                if (!!comment)
                    comment.click()
                break
        }
    })
    document._addEventListener('keyup', (e) => {
        if (e.key === 'ArrowRight'
            && !isActive('input', 'textarea', '#contenteditable-root')) {
            clearTimeout(timer)
            timer = null
            if (isSpeeding) {
                isSpeeding = false
                video.playbackRate = initSpeed
                progressBar()
                speedSign()
            }
            else {
                video.currentTime += forward
                forwardSign(true)
                const skip = document.querySelector('.ytp-skip-ad-button__text')
                if (!!skip)
                    skip.click()
            }
        }
    })
    window.addEventListener('blur', () => {
        clearTimeout(timer)
        timer = null
        if (isSpeeding) {
            isSpeeding = false
            video.playbackRate = initSpeed
            progressBar()
            speedSign()
        }
    })
}
// 判断是否是组合键
function isCombKey(e) {
    return e.ctrlKey || e.shiftkey || e.altKey || e.metaKey
}
// 判断当前页面活动元素
function isActive(...eleSet) {
    for (const ele of eleSet) {
        if (ele instanceof HTMLElement) {
            if (document.activeElement === ele)
                return true
        }
        else {
            switch (ele.charAt(0)) {
                case '.':
                    if (document.activeElement.classList.contains(ele.substring(1)))
                        return true
                    break
                case '#':
                    if (document.activeElement.id.toLowerCase() === ele.substring(1).toLowerCase())
                        return true
                    break
                default:
                    if (document.activeElement.tagName.toLowerCase() === ele.toLowerCase())
                        return true
            }
        }
    }
    return false
}
//获得有src属性的video
function getVideo() {
    for (const video of document.querySelectorAll('video')) {
        if (!!video.getAttribute('src'))
            return video
    }

    return null
}
// 显示倍速
function speedSignClosure() {
    let isModified = false
    return (isVisible = isSpeeding) => {
        const context = document.querySelector('.ytp-speedmaster-overlay')
        if (context) {
            if (!isModified) {
                context.querySelector('.ytp-speedmaster-label').textContent = speed + 'x'
                isModified = true
            }
            context.style.display = isVisible ? '' : 'none'
        }

    }
}
// 显示快进
function forwardSignClosure() {
    let timeout = null
    let isModified = false
    return isForward => {
        const context = document.querySelector('.ytp-doubletap-ui-legacy')
        if (context) {
            clearTimeout(timeout)
            const shadow = context.querySelector('.ytp-doubletap-static-circle')
            const player = document.querySelector('#ytd-player')
            const height = Math.ceil(player.offsetHeight)
            const width = Math.ceil(player.offsetWidth)
            if (!isModified) {
                context.querySelector('.ytp-doubletap-tooltip-label').textContent =
                    window.YT_I18N_FORMATTING_DURATION_TIME_SYMBOLS.SECOND.LONG
                        .replace('#', forward)
                        .match(forward > 1 ? /one\{([^}]*)\}/ : /other\{([^}]*)\}/)[1]
                shadow.style.width = '110px'
                shadow.style.height = '110px'
                isModified = true
            }
            const direction = isForward ? 'forward' : 'back'
            // 这里是计算相对位置
            if (isForward)
                shadow.style.left = .8 * width - 30 + 'px'
            else
                shadow.style.left = .1 * width - 15 + 'px'
            shadow.style.top = .5 * height + 15 + 'px'
            context.setAttribute('data-side', direction)

            context.style.display = ''
            context.classList.add('ytp-time-seeking')

            timeout = setTimeout(() => {
                context.style.display = 'none'
                context.classList.remove('ytp-time-seeking')
            }, 0.5e3)
        }
    }
}
// 隐藏进度条
function progressBar(isVisible = !isSpeeding) {
    const arr = [
        document.querySelector('.ytp-gradient-top'),
        document.querySelector('.ytp-gradient-bottom'),
        document.querySelector('.ytp-chrome-top'),
        document.querySelector('.ytp-chrome-bottom')
    ]
    const context = document.querySelector('#movie_player')
    if (isVisible) {
        arr.forEach(e => e.style.display = '')
        context.classList.remove('ytp-autohide')
        context.style.cursor = ''
    }
    else {
        arr.forEach(e => e.style.display = 'none')
        context.classList.add('ytp-autohide')
    }
}