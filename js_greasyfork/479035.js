// ==UserScript==
// @name            观影跳过片头片尾、播放速度、全屏、自动播放下一集
// @version         1.2.1
// @description     通过按键控制跳过片头片尾、播放速度、全屏、自动播放下一集
// @author          随梦期初
// @match           *://www.ysgc1.cc/*
// @match           *://www.bytpl.com/*
// @match           *://www.ffys.vip/*
// @match           *://lnyzyw.com/*
// @grant           none
// @license         GPLv3
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/479035/%E8%A7%82%E5%BD%B1%E8%B7%B3%E8%BF%87%E7%89%87%E5%A4%B4%E7%89%87%E5%B0%BE%E3%80%81%E6%92%AD%E6%94%BE%E9%80%9F%E5%BA%A6%E3%80%81%E5%85%A8%E5%B1%8F%E3%80%81%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/479035/%E8%A7%82%E5%BD%B1%E8%B7%B3%E8%BF%87%E7%89%87%E5%A4%B4%E7%89%87%E5%B0%BE%E3%80%81%E6%92%AD%E6%94%BE%E9%80%9F%E5%BA%A6%E3%80%81%E5%85%A8%E5%B1%8F%E3%80%81%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E9%9B%86.meta.js
// ==/UserScript==


const speedArray = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 3.0]
const intervalTime = 2000

const doc_s = window.document
const dplayerContainer = "div.dplayer"
const videoEle = "div.dplayer-video-wrap > .dplayer-video-current"
const volumeBarWrap = ".dplayer-volume-bar-wrap"
const volumeBarInner = ".dplayer-volume-bar-inner"
const dplayerNotice = ".dplayer-notice"
const adEles = ["#adv_wrap_hh", "#HMcoupletDivleft", "#HMcoupletDivright"]

const skipStartStr = "skip_start",
    skipEndStr = "skip_end",
    speedStr = "speed",
    speedIndexStr = "speed_index",
    bufferStr = "buffer",
    bufferOpen = "open",
    bufferClose = "close"


let dplayer_container,
    video_ele

const config = {
    skip_start: localStorage.getItem(skipStartStr) ? parseInt(localStorage.getItem(skipStartStr)) : 0,
    skip_end: localStorage.getItem(skipEndStr) ? parseInt(localStorage.getItem(skipEndStr)) : 0,
    speed: localStorage.getItem(speedStr) ? parseFloat(localStorage.getItem(speedStr)) : 1.0,
    speed_index: localStorage.getItem(speedIndexStr) ? parseInt(localStorage.getItem(speedIndexStr)) : 9,
    buffer: localStorage.getItem(bufferStr) ? localStorage.getItem(bufferStr) : bufferClose
}

const handler = {
    get(target, prop) {
        return target[prop]
    },
    set(target, prop, value) {
        target[prop] = value

        localStorage.setItem(prop, value)

        if (prop !== speedIndexStr) {
            myPlayer.notice_event(`${prop} ${value} `)
            video_ele[`data_${prop}`] = value
        } else {
            localStorage.setItem(speedStr, speedArray[value].toString())

            target.speed = speedArray[value]
            video_ele.playbackRate = speedArray[value]
        }

        if (prop === skipEndStr) {
            myPlayer.skip_end_event()
        }
    }
}

const myPlayerConfig = new Proxy(config, handler)

const myPlayer = {
    init: function () {
        clearInterval(interval)

        if (window.document.querySelector(videoEle)) {

            video_ele.autoplay = true

            if (parseInt(myPlayerConfig.skip_start) > parseInt(video_ele.currentTime)) {
                video_ele.currentTime = myPlayerConfig.skip_start
            }

            video_ele.onratechange = this.ratechange
            video_ele.oncanplay = this.can_play

            video_ele.onprogress = this.progress

            video_ele.onplay = this.play_event
            video_ele.onpause = this.pause_event
            video_ele.data_skip_end && this.skip_end_event()
        }

        doc_s.onkeydown = this.key_down

    },
    progress: function () {
        video_ele.data_buffer_end = !!(video_ele.buffered.length && video_ele.buffered.end(video_ele.buffered.length - 1) === video_ele.duration - video_ele.data_skip_end)
    },
    ratechange: function () {
        myPlayer.notice_event(`speed ${video_ele.playbackRate} `)
    },
    skip_end_event: function () {
        let interval = setInterval(function () {
            let left_duration = myPlayer.left_duration()

            if (left_duration < video_ele.data_skip_end) {
                myPlayer.next()
                // video_ele.currentTime = video_ele.duration;
                clearInterval(interval)
            } else if (video_ele.data_skip_end === 0) {
                clearInterval(interval)
            }
        }, intervalTime)
    },
    left_duration: function () {
        return video_ele.duration - video_ele.currentTime
    },
    remove_localStorage: function () {
        Object.keys(config).map(v => localStorage.removeItem(v))
        video_ele.playbackRate = 1.0
        video_ele.data_skip_start = 0
        video_ele.data_skip_end = 0
    },
    remove_ad: function () {
        for (const ele of adEles) {
            if (window.document.querySelector(ele)) {
                window.document.querySelector(ele).remove()
            } else if (window.parent.document.querySelector(ele)) {
                window.parent.document.querySelector(ele).remove()
            }
        }
    },
    key_down: function (e) {
        const tag = doc_s.activeElement.tagName.toUpperCase()
        const editable = doc_s.activeElement.getAttribute('contenteditable')
        if (tag !== 'INPUT' && tag !== 'TEXTAREA' && editable !== '' && editable !== 'true') {
            e.preventDefault()
            let speed = video_ele.playbackRate
            let speed_index = speedArray.indexOf(speed)

            switch (e.keyCode) {
                case 13:
                    dplayer_container.requestFullscreen().then(() => {})
                    break;
                case 27:
                    dplayer_container.exitFullscreen().then(() => {})
                    break;
                case 32:
                    if (e.currentTarget.querySelector(videoEle) && window.parent.length > 1) {
                        return
                    }

                    if (video_ele.paused) {
                        video_ele.play()
                    } else {
                        video_ele.pause()
                    }
                    break;
                case 37:
                    if (e.currentTarget.querySelector(videoEle)) {
                        return
                    }

                    video_ele.currentTime -= 5

                    myPlayer.notice_event("快退 5 秒")
                    break;
                case 38:
                    if (e.currentTarget.querySelector(videoEle)) {
                        return
                    }

                    myPlayer.volume_up()
                    break
                case 39:
                    if (e.currentTarget.querySelector(videoEle)) {
                        return
                    }

                    video_ele.currentTime += 5
                    myPlayer.notice_event("快进 5 秒")
                    break
                case 40:
                    if (e.currentTarget.querySelector(videoEle)) {
                        return
                    }

                    myPlayer.volume_down()
                    break
                case 66:
                    myPlayerConfig.buffer = video_ele.data_buffer === bufferClose ? bufferOpen : bufferClose

                    if (video_ele.paused && video_ele.data_buffer === bufferOpen && !video_ele.data_buffer_end) {
                        video_ele.oncanplaythrough = myPlayer.buffer_func
                        video_ele.currentTime += 1
                    } else {
                        video_ele.oncanplaythrough = () => {}
                        video_ele.data_current_time && (video_ele.currentTime = video_ele.data_current_time)
                    }
                    break;
                case 67:
                    if (speedArray.length - speed_index > 0) {
                        myPlayerConfig.speed_index = speed_index + 1
                    }
                    break;
                case 78:
                    myPlayer.next()

                    break;
                case 80:
                    myPlayer.pre()

                    break;
                case 82:
                    myPlayer.remove_localStorage()
                    myPlayer.message_box.show('reset speed and skip')
                    break;
                case 83:
                    break;
                case 84:
                    myPlayerConfig.skip_start = video_ele.currentTime
                    break;
                case 87:
                    myPlayerConfig.skip_end = myPlayer.left_duration()
                    break;
                case 88:
                    if (speed_index > 0) {
                        myPlayerConfig.speed_index = speed_index - 1
                    }
                    break;
            }
        }
        doc_s.onkeydown = () => {
        }
        setTimeout(function () {
            doc_s.onkeydown = myPlayer.key_down
        }, 200)
    },
    can_play: function () {
        video_ele.playbackRate = myPlayerConfig.speed
        video_ele.data_skip_start = myPlayerConfig.skip_start
        video_ele.data_skip_end = myPlayerConfig.skip_end
        video_ele.data_buffer = myPlayerConfig.buffer
        video_ele.data_buffer_end = false

        video_ele.oncanplay = () => {}

    },
    buffer_func: function () {
        if (video_ele.currentTime === video_ele.duration) {
            video_ele.data_buffer_end = true
        } else {
            video_ele.currentTime += 2
            if (myPlayer.left_duration() < video_ele.data_skip_end) {
                video_ele.currentTime = video_ele.data_current_time
                video_ele.data_buffer_end = true
            }
        }
    },
    pause_event: function() {
        myPlayer.remove_ad()
        video_ele.paused = true
        video_ele.data_current_time = video_ele.currentTime

        (video_ele.data_buffer === bufferClose) || video_ele.data_buffer_end || !(video_ele.oncanplaythrough = myPlayer.buffer_func) || (video_ele.currentTime += 1)
    },
    play_event: function() {
        video_ele.paused = false
        video_ele.currentTime = video_ele.data_current_time

        video_ele.oncanplaythrough = () => {}
    },
    pre: function () {
        let lc = window.parent ? window.parent.location : window.location;
        const regRes = /\d+(?=\.html$)/.exec(lc.pathname);
        if(regRes) {
            let pre_lc = lc.pathname.replace(/\d+(?=\.html$)/, Number(regRes[0]) - 1)
            if (window.parent.document.querySelector(`a[href="${pre_lc}"]`)) {
                myPlayer.notice_event('previous')
                window.parent.location.href = pre_lc
                return
            }
        }
        myPlayer.notice_event('没有上一集了')
    },
    next: function () {
        let lc = window.parent ? window.parent.location : window.location;
        const regRes = /\d+(?=\.html$)/.exec(lc.pathname);
        if(regRes) {
            let next_lc = lc.pathname.replace(/\d+(?=\.html$)/, Number(regRes[0]) + 1)
            if (window.parent.document.querySelector(`a[href="${next_lc}"]`)) {
                myPlayer.notice_event('next')
                window.parent.location.href = next_lc
                return
            }
        }
        myPlayer.notice_event('没有下一集了')
    },
    volume_up: function () {
        if (video_ele.volume < 1) {
            video_ele.volume = video_ele.volume + 0.1
        }

        myPlayer.volume_event()
    },
    volume_down: function () {
        if (video_ele.volume > 0) {
            video_ele.volume -= 0.1
        }

        myPlayer.volume_event()
    },
    volume_event: function () {
        let percentage = Math.max(video_ele.volume, 0);
        percentage = Math.min(percentage, 1)

        let formatPercentage = ''.concat((percentage * 100).toFixed(0), '%')

        dplayer_container.querySelector(volumeBarWrap).dataset.balloon = formatPercentage
        dplayer_container.querySelector(volumeBarInner).style.width = formatPercentage

        myPlayer.notice_event(`音量 ${formatPercentage}`)
    },
    notice_event: function (text, opacity=0.8, time=2000) {
        dplayer_container.querySelector(dplayerNotice).innerHTML = text
        dplayer_container.querySelector(dplayerNotice).style.opacity = opacity.toString()

        if (video_ele.timeout) {
            clearTimeout(video_ele.timeout)
        }

        video_ele.timeout = setTimeout(() => {
            dplayer_container.querySelector(dplayerNotice).style.opacity = "0"
        }, time)
    }
}

let count = 0
const interval = setInterval(function () {
    dplayer_container = window.length > 1 && window[window.length - 1].document && window[window.length - 1].document.querySelector(dplayerContainer) ? window[window.length - 1].document.querySelector(dplayerContainer) : window.document.querySelector(dplayerContainer)

    myPlayer.remove_ad()
    count++

    if (dplayer_container) {
        video_ele = dplayer_container.querySelector(videoEle)
        myPlayer.init()
    } else if (count > 20) {
        clearInterval(interval)
    }

}, 1000)

