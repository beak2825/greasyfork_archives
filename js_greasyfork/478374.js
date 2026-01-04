// ==UserScript==
// @name         爱学习刷课
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  一个脚本
// @author       川~
// @match        https://edu.inspur.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=inspur.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478374/%E7%88%B1%E5%AD%A6%E4%B9%A0%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/478374/%E7%88%B1%E5%AD%A6%E4%B9%A0%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let filtrationList = []
    if (localStorage.getItem('filtrationList')) {
        filtrationList = localStorage.getItem('filtrationList').split(',')
    }
    var timea = ''
    var kkk = 0

    function getClickDom() {
        let timer
        timer = setInterval(() => {
            if (document.querySelectorAll('.card-item').length !== 0) {
                click()
                const bc = new BroadcastChannel("test_channel");
                bc.onmessage = (event) => {
                    if (event.data === 'load') {
                        location.reload()
                    }
                };
                clearInterval(timer);
            }
        }, 1000)
    }

    function click() {
        let domList = document.querySelectorAll('.card-item')
        let clickDom = null
        for (let i in domList) {
            if(!Number(i)){
                continue
            }
            let dom = domList[i]
            if (filtrationList.includes('' + i)) {
                continue
            }
            if (dom.querySelector('.detail-item').innerHTML.trim() === '学分: -') {
                let filtrationString = localStorage.getItem('filtrationList')
                localStorage.setItem('filtrationList', filtrationString + ',' + i)
                continue
            }
            if (!dom.querySelector('.status') || dom.querySelector('.status').innerHTML.trim() === '学习中') {
                clickDom = dom
                localStorage.setItem('studyIng', i)
                break
            }
        }
        if (clickDom) {
            clickDom.click()
        } else {
            document.querySelector('.anticon-right').click()
            getClickDom()
        }
    }

    function watch() {
        for (let domss of document.querySelectorAll('.sub-text')) {
            if (domss.innerHTML === '考试') {
                const bc = new BroadcastChannel("test_channel");
                bc.postMessage('load');
                let filtrationString = localStorage.getItem('filtrationList')
                localStorage.setItem('filtrationList', filtrationString + ',' + localStorage.getItem('studyIng'))
                window.close()
            }
        }
        let domList = document.querySelectorAll('.chapter-list-box')
        let index = false
        for (let dom of domList) {
            if (dom.querySelectorAll('span').length === 2) {
                if (timea === dom.querySelectorAll('span')[1].innerHTML) {
                    kkk = kkk + 1
                } else {
                    kkk = 0
                    timea = dom.querySelectorAll('span')[1].innerHTML
                }
                index = true
                if (dom.classList.length === 2) {
                    dom.click()
                }
                if (kkk === 150) {
                    dom.click()
                    kkk = 0
                }
                if (document.querySelector('.register-mask-layer') && document.querySelector('.register-mask-layer').style.display !== 'none') {
                    document.querySelector('.register-mask-layer').querySelector('img').click()
                }
                if (document.querySelector('video')) {
                    if (document.querySelector('video').paused) {
                        document.querySelector('video').muted = true
                        document.querySelector('video').play()
                        document.querySelector('video').playbackRate = 1
                    }
                }
                break
            }
        }
        if (!index) {
            const bc = new BroadcastChannel("test_channel");
            bc.postMessage('load');
            window.close()
        }

        //
    }

    console.log('ssssssfsadfasfasdfsa')
    let href = window.location.href
    if (href.startsWith('https://edu.inspur.com/#/branch-list-v')) {
        getClickDom()
    } else if (href.startsWith('https://edu.inspur.com/#/study/')) {
        let timer
        timer = setInterval(() => {
            if (document.querySelector('.tabs-cont-box')) {
                if (document.querySelector('.tabs-cont-box').querySelectorAll('.section-item').length !== 0) {
                    let ttt = setInterval(() => {
                        watch()
                    }, 1000)
                    clearInterval(timer);
                }
            } else {

            }
        }, 1000)
    }


    // Your code here...
})();