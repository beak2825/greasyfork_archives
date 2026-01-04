// ==UserScript==
// @license     AGPL License
// @name        Netflix长按倍速脚本
// @name:en     Netflix long press to speed up
// @namespace   Violentmonkey Scripts
// @match       https://www.netflix.com/*
// @run-at      document-start
// @grant       none
// @version     1.0
// @author      n1nja88888
// @description Netflix长按右箭头倍速播放
// @description:en Netflix long press Arrow Right to speed up
// @downloadURL https://update.greasyfork.org/scripts/521251/Netflix%20long%20press%20to%20speed%20up.user.js
// @updateURL https://update.greasyfork.org/scripts/521251/Netflix%20long%20press%20to%20speed%20up.meta.js
// ==/UserScript==
'use strict'
const speed = 2
const forward = 5
console.log('n1nja88888 creates this world!')

!function () {
    //改变keydown事件监听器函数 忽略指定key
    function keydownOmit(listener, omits) {
        return (...args) => {
            if (!omits.has(args[0].key))
                listener(...args)
        }
    }
    // netflix 是keydown下的div#appaMountpoint控制
    Element.prototype._addEventListener = Element.prototype.addEventListener
    Element.prototype.addEventListener = function (type, listener, useCapture = false) {
        if (type === 'keydown')
            listener = keydownOmit(listener, new Set(['ArrowLeft', 'ArrowRight']))
        this._addEventListener(type, listener, useCapture)
    }
}()

main()

function main() {
    // 倍速定时器
    let timer = null
    //初始速度，松开按键后是恢复到初始速度
    let initSpeed = -1
    // 获取nefliex内嵌的player
    let videoPlayer = null
    let player = null
    // 判断是否加速
    let isSpeeding = false
    // 复写keydown的事件监听器
    document.addEventListener('keydown', (e) => {
        if (isCombKey(e) || isActive('input', 'textarea') || !netflix)
            return
        videoPlayer = netflix.appContext.state.playerApp.getAPI().videoPlayer
        const sessions = videoPlayer.getAllPlayerSessionIds()
        player = videoPlayer.getVideoPlayerBySessionId(sessions[sessions.length - 1])
        if (!player)
            return
        switch (e.key) {
            case 'ArrowLeft':
                player.seek(player.getCurrentTime() - forward * 1e3)
                break
            case 'ArrowRight':
                if (!timer) {
                    timer = setTimeout(() => {
                        isSpeeding = true
                        player.play()
                        initSpeed = player.getPlaybackRate()
                        player.setPlaybackRate(speed)
                    }, 0.15e3)
                }
                break
        }
    })

    document.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowRight') {
            clearTimeout(timer)
            timer = null
            if (isSpeeding) {
                isSpeeding = false
                player.setPlaybackRate(initSpeed)
            }
            else
                player.seek(player.getCurrentTime() + forward * 1e3)
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

