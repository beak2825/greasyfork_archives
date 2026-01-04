// ==UserScript==
// @name         课程自动学习
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动课程学习
// @author       You
// @match        http://hubeigs.study.gspxonline.com/resource/index*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471770/%E8%AF%BE%E7%A8%8B%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/471770/%E8%AF%BE%E7%A8%8B%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let sec
    let res
    let playingIdx
    let video
    let playBtn
    let first = true
    let play
    let playNext = function () {
        if (playBtn.getAttribute('class') == 'prism-big-play-btn loading-center playing') {
            setTimeout(playNext, 200)
            return
        }
        playBtn.click()
        play = false
    }
    let observer = new MutationObserver(function(mutationsList, observer){
        for(let mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class' && mutation.target.getAttribute('class') === 'prism-big-play-btn loading-center pause') {
                if (video.duration - video.currentTime <= 1) {
                    console.log('play ended')
                    observer.disconnect()
                    if (playingIdx == null) {
                        for (let i = 0; i < res.length; i++) {
                            if (res[i].getAttribute('class') == 'active') {
                                playingIdx = i
                                break
                            }
                        }
                        if (playingIdx == null) {
                            playingIdx = 0
                        }
                    }
                    playingIdx++
                    for (; playingIdx < res.length; playingIdx++) {
                        if (res[playingIdx].children.length < 3) {
                            break
                        }
                        if (res[playingIdx].children[2].getAttribute('class') != 'iconfont learn-status finish') {
                            break
                        }
                    }
                    if (playingIdx >= res.length) {
                        window.alert('课程自动学习完成')
                        break
                    }
                    res[playingIdx].click()
                    play = true
                    break
                }
            }
        }
    })
    let getVideo = function () {
        let videoNew = document.getElementsByTagName('video')[0]
        let newOne = false
        if (videoNew != video) {
            newOne = true
        }
        video = videoNew
        if (video == null) {
            setTimeout(getVideo, 200)
            return
        }
        playBtn = video.nextSibling
        if (!newOne) {
            setTimeout(getVideo, 1000)
            return
        }
        console.log('video', video)
        console.log('playBtn', playBtn)

        observer.observe(playBtn, {
            attributes: true
        })
        console.log('set video')
        setTimeout(getVideo, 1000)

        if (play) {
            playNext()
        }
    }
    console.log('window loaded')
    let autoLearn = function () {
        if (sec == null || sec.length == 0) {
            sec = document.getElementsByClassName('title section-name')
        }
        if (sec == null || sec.length == 0) {
            setTimeout(autoLearn, 200)
            return
        }
        for (let i = 0; i < sec.length; i++ ) {
            if (sec[i].parentNode.children.length <= 1) {
                sec[i].click()
            }
        }
        if (first) {
            setTimeout(autoLearn, 200)
            first = false
            return
        }
        console.log('sec.length', sec.length)
        console.log('sec', sec)

        if (res == null || res.length == 0) {
            res = [...document.querySelectorAll('[id^=res_]')]
        }
        if (res == null || res.length == 0) {
            setTimeout(autoLearn, 200)
            return
        }
        res = res.sort(function(a, b) {
            return parseInt(a.getAttribute('id').substring(2)) - parseInt(b.getAttribute('id').substring(2))
        })
        console.log('res', res)

        getVideo()
    }
    setTimeout(autoLearn, 200)
})();