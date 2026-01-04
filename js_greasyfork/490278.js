// ==UserScript==
// @name         党课播放小助手
// @namespace    http://tampermonkey.net/
// @version      2024-03-20+2
// @description  让视频播放更轻松
// @author       You
// @match        http://xscdx-bigc-edu-cn.vpn1.bigc.edu.cn:8118/jjfz/play*
// @match        http://xscdx.bigc.edu.cn/jjfz/play*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bigc.edu.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490278/%E5%85%9A%E8%AF%BE%E6%92%AD%E6%94%BE%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/490278/%E5%85%9A%E8%AF%BE%E6%92%AD%E6%94%BE%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    makeCursorFreeAgain()

    window.addEventListener('load', (event) => {
        muteVideo()
        invalidateLoopPause()
        autoPlayNextVideo()
    })
})();

function makeCursorFreeAgain() {
    console.log("【功能】光标离开浏览器也不影响视频播放")
    const originalAddEventListener = EventTarget.prototype.addEventListener
    EventTarget.prototype.addEventListener = function(...args) {
        if (args.length > 0 && args[0] === 'visibilitychange') {
            return
        }
        originalAddEventListener.call(this, ...args)
    }
}

function muteVideo() {
    console.log('【功能】将视频静音')
    const videoNode = document.querySelector('video')
    videoNode.muted = true;
}

function invalidateLoopPause() {
    window.loop_pause = function() {}
    console.log('【功能】禁用视频每5分钟自动暂停')
}

function autoPlayNextVideo() {
    console.log('【功能】自动播放视频：自动继续播放 + 自动下一集')

    const videoNodeList = document.querySelectorAll('.video_lists > ul > li')
    const currentHref = location.pathname + location.search
    const matchedNode = Array.from(videoNodeList).find(videoNode => {
        const videoHref = videoNode.querySelector('a').getAttribute('href')
        return videoHref === currentHref
    });
    if (!matchedNode) {
        console.log('【异常】未在视频列表中找到当前页面')
    }

    const onVideoEnded = () => {
        console.log('当前视频播放完毕！')
        const nextVideoNode = matchedNode.nextElementSibling
        if (!nextVideoNode) {
            console.log('整个视频列表播放完毕，请开始播放下一个必修课')
            return
        }
        console.log('正在跳转至列表中的下一个视频...')
        const nextVideoLinkNode = nextVideoNode.querySelector('a')
        console.log('nextVideoLinkNode: ', nextVideoLinkNode)
        console.log('nextVideoLinkNode.innerHTML: ', nextVideoLinkNode.innerHTML)
        if (!nextVideoLinkNode) {
            console.log('找不到 nextVideoLinkNode')
            console.log('nextVideoNode.innerHTML: ', nextVideoNode.innerHTML)
        }
        nextVideoLinkNode.click()
    }

    const handleContinuePlay = () => {
        console.log('自动继续播放本集视频')
        const continuePlayButton = document.querySelector(".public_cont > div.public_btn > a.public_cancel")
        continuePlayButton.click()
    }

    const handleNormalDialog = () => {
        console.log('关闭“您需要完整观看一遍课程视频”弹窗 & 自动开始播放')
        const dismissButton = document.querySelector(".public_cont > .public_btn > .public_submit")
        dismissButton.click()

        if (window.player) {
            window.player.play()
        }
    }

    const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            // 如果变动是节点的添加
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach((node) => {
                    // 判断是否为“视频播放完毕”
                    if (node.classList.contains('public_cont') && node.textContent.includes('当前视频播放完毕！')) {
                        onVideoEnded()
                    }
                    // 判断是否弹出了“继续观看”的弹窗
                    if (node.classList.contains('public_cont') && node.textContent.includes('继续观看')) {
                        handleContinuePlay()
                    }
                    // 判断是否弹出了“您需要完整观看一遍课程视频”的弹窗
                    if (node.classList.contains('public_cont') && node.textContent.includes('您需要完整观看一遍课程视频')) {
                        handleNormalDialog()
                    }
                })
            }
        }
    })

    // 监听 body 的直接子元素的变化
    observer.observe(document.body, { childList: true, subtree: false });
}
