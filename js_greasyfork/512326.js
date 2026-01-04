// ==UserScript==
// @name         医院线上学习平台学习助手
// @namespace    https://yinr.cc/
// @version      0.5.0
// @description  zryhyy 线上学习平台学习助手
// @author       Yinr
// @license      MIT
// @match        https://crbzryy.haoyisheng.com/*
// @icon         https://crbzryy.haoyisheng.com/static/images/favicon.ico
// @require      https://update.greasyfork.org/scripts/458769/1147575/Yinr-libs.js
// @run-at       document-idle
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/512326/%E5%8C%BB%E9%99%A2%E7%BA%BF%E4%B8%8A%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/512326/%E5%8C%BB%E9%99%A2%E7%BA%BF%E4%B8%8A%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

/* global YinrLibs */

(function() {
    'use strict';
    const PAGE_HASH_PREFIX = '#/courseDetials/'
    const TEST_HASH_PREFIX = '#/courseExam'
    const DONE_CLASS = 'auto-helper'
    const VIDEO_SELECTOR = 'video'
    const VIDEO_DEFAULT_SELECTOR = `${VIDEO_SELECTOR}:not(.${DONE_CLASS})`
    const SIGN_IN_SELECTOR = 'div.popup-unm:not([style^="display: none"]) span.icon-qd'
    const SIGN_IN_DEFAULT_SELECTOR = `${SIGN_IN_SELECTOR}:not(.${DONE_CLASS})`
    const AUTO_JUMP_SELECTOR = 'span#ccH5jumpInto > b'

    /** @type {{[optKey: string]: {key: string, default?: any}}} */
    const cfgOpt = {
        fastplayRate: { key: 'FASTPLAY_RATE', default: 1 },
        autoMute: { key: 'AUTO_MUTE', default: false },
    }
    const cfg = new YinrLibs.Config(cfgOpt)

    const inCoursePage = () => {
        return document.location.hash.startsWith(PAGE_HASH_PREFIX)
    }
    const inTestPage = () => {
        return document.location.hash.startsWith(TEST_HASH_PREFIX)
    }

    /** @returns {HTMLVideoElement} */
    const getVideo = () => {
        return document.querySelector(VIDEO_SELECTOR)
    }

    /**
     * @param {string} btnID 按钮ID
     * @param {string} btnText 按钮显示文字
     * @param {Function} callback 回调函数
     */
    const generateBtn = (btnID, btnText, callback) => {
        if (document.querySelector(`#${btnID}`)) return
        const el = document.querySelector("#app div.de-test > div.de-btns")
        const btn = document.createElement('span')
        btn.id = btnID
        btn.innerText = `【${btnText}】`
        btn.style.cursor = 'pointer'
        btn.onclick = () => {callback()}
        el.append(btn)
    }

    // 课程导航
    const getCourseList = () => {
        /** @type {{type: 'TEST'|'LEARN', el: HTMLAnchorElement}[]} */
        const courseList = []
        /** @type {NodeListOf<HTMLAnchorElement>} */
        const courseLi = document.querySelectorAll('ul.kx-list>li')
        courseLi.forEach(el => {
            const btns = el.querySelectorAll('a.el-button')
            btns.forEach(btn => {
                if (btn.textContent.includes('考试')) courseList.push({ type: 'TEST', el: btn })
                if (btn.textContent.includes('立即学习')) courseList.push({ type: 'LEARN', el: btn })
            })
        })
        return courseList
    }
    const gotoNextCourse = () => {
        const courseList = getCourseList()
        const next = courseList.find(el => el.type === 'LEARN')
        if (next) {
            console.log('进入下一课')
            next.el.click()
        } else {console.log('没有未学习课程')}
    }
    const generateNextCourseBtn = () => generateBtn('auto-helper-next-course', '继续学习', gotoNextCourse)
    const gotoTest = () => {
        const courseList = getCourseList()
        const test = courseList.find(el => el.type === 'TEST')
        if (test) {
            console.log('进入考试')
            test.el.click()
        } else {console.log('没有待考试课程')}
    }
    const generateTestBtn = () => generateBtn('auto-helper-test', '进入考试', gotoTest)

    // 手动快进

    const jumpSeconds = (sec = 60) => {
        const vid = getVideo()
        const total = vid.duration
        if (total - vid.currentTime <= 30) {
            vid.currentTime = total
        } else {
            vid.currentTime = vid.currentTime + sec
        }
    }
    const generateJumpBtn = () => generateBtn('auto-helper-jump', '快进一分钟', jumpSeconds)

    // 直接结束

    const justEnd = () => {
        const vid = getVideo()
        vid.play()
        vid.currentTime = vid.duration
    }
    const generateEndBtn = () => generateBtn('auto-helper-end', '快进到结束', justEnd)

    // 自动静音

    const autoMute = () => {
        if (cfg.getValue(cfgOpt.autoMute.key, false)) {
            console.log('自动静音')
            const vid = getVideo()
            vid.defaultMuted = true
            vid.muted = true
            vid.volume = 0
        }
    }

    const setVideoRate = (rate = undefined) => {
        console.log('设置倍速')
        if (rate === undefined) rate = cfg.getValue(cfgOpt.fastplayRate.key, 1)
        const vid = getVideo()
        vid.defaultPlaybackRate = rate
        vid.playbackRate = rate
    }

    // 自动播放

    const fastPlay = async (rate = undefined) => {
        const vid = getVideo()
        vid.classList.add(DONE_CLASS)
        const endedEvent = () => {
            window.addEventListener('beforeunload', (e) => {
                e.preventDefault()
                e.returnValue = '' // Chrome requires returnValue to be set.
                // window.close()
            })
            vid.removeEventListener('ended', endedEvent)
            GM_notification({
                text: 'Play Finished',
                title: document.title,
            })
            gotoNextCourse()
        }
        vid.addEventListener('ended', endedEvent)
        vid.addEventListener('pause', async () => {
            await YinrLibs.sleep(1000)
            vid.play()
            setVideoRate()
            autoMute()
        })
        await YinrLibs.sleep(300)
        vid.play()
        await YinrLibs.sleep(300)
        setVideoRate()
        autoMute()
        // generateJumpBtn()
        // generateEndBtn()
        generateNextCourseBtn()
        generateTestBtn()
    }
    YinrLibs.launchObserver({
        parentNode: document,
        selector: VIDEO_DEFAULT_SELECTOR,
        successCallback: () => {
            if(!inCoursePage()) return
            console.log('自动开始倍速播放')
            fastPlay()
        },
        stopWhenSuccess: false,
    })

    // 自动签到

    const signIn = async () => {
        console.log('准备自动签到')
        /** @type {HTMLSpanElement} */
        const el = document.querySelector(SIGN_IN_SELECTOR)
        el.classList.add(DONE_CLASS)
        await YinrLibs.sleep(500)
        el.click()
        fastPlay()
    }
    YinrLibs.launchObserver({
        parentNode: document,
        selector: SIGN_IN_DEFAULT_SELECTOR,
        successCallback: () => {
            if(!inCoursePage()) return
            signIn()
        },
        stopWhenSuccess: false,
    })

    // 自动继续播放

    const autoJump = () => {
        const el = document.querySelector(AUTO_JUMP_SELECTOR)
        if (el.previousElementSibling.textContent == '00:00') {
            // el.parentElement.remove()
        } else {
            console.log('自动继续学习')
            el.click()
            autoMute()
        }
    }
    YinrLibs.launchObserver({
        parentNode: document,
        selector: AUTO_JUMP_SELECTOR,
        successCallback: () => {
            if(!inCoursePage()) return
            autoJump()
        },
        stopWhenSuccess: false,
    })

    // 考试相关
    const getTestInfo = async () => {
        const siteid = sessionStorage.getItem('siteId')
        const token = sessionStorage.getItem('token')
        const cWareId = document.location.hash.match(/cWareId=([\d]+)/)[1]
        const itemId = document.location.hash.match(/itemId=([\d]+)/)[1]
        const res = await fetch(`https://yktapi.haoyisheng.com/zuul/api/customer/px/course/findQuestionsByWareId?cWareId=${cWareId}&itemId=${itemId}`, {
            "headers": { siteid, token },
        }).then(res => res.json());
        return res
    }
    /**
     * @returns {string[]}
     */
    const parseAnswer = (data) => {
        return data.map(i => i.rightAnswer)
    }
    const getAnswer = async () => {
        const data = await getTestInfo()
        const answer = parseAnswer(data.data)
        console.log(answer)
        return answer
    }
    /**
     * @param {string} char 
     * @returns {number}
     */
    const getAnswerId = (char) => char.charCodeAt() - 'A'.charCodeAt()
    const autoTest = async () => {
        const answer = await getAnswer()
        console.log(answer)
        const answerContainer = document.getElementById('auto-helper-test-answer')
        answerContainer.innerText = answer.join(', ')
        const item = document.querySelectorAll('ul.exam-list>li')
        for (let i = 0; i < item.length; i++) {
            const thisAnswer = answer[i]
            const thisItem = item[i]
            if (thisAnswer.length > 1) {
                // 多选
                /** @type {HTMLInputElement[]} */
                const checkboxs = thisItem.querySelectorAll('input[type=checkbox]')
                const options = thisAnswer.split('')
                const optIdx = options.map(i => getAnswerId(i))
                for (let o = 0; o < options.length; o++) {
                    const option = options[o]
                    checkboxs[getAnswerId(option)].click()
                }
            } else {
                // 单选
                const radios = thisItem.querySelectorAll('input[type=radio]')
                radios[getAnswerId(thisAnswer)].click()
            }
        }
    }
    const appendTestBtn = () => {
        if (document.getElementById('auto-helper-test-answer')) return
        console.log('添加自动答题')
        const container = document.querySelector('div.exam-tit')
        const p = document.createElement('p')
        const action = document.createElement('span')
        action.innerText = '【自动答题】'
        action.addEventListener('click', autoTest)
        action.style.cursor = 'pointer'
        p.appendChild(action)
        const answer = document.createElement('span')
        answer.id = 'auto-helper-test-answer'
        p.appendChild(answer)
        container.appendChild(p)
    }
    YinrLibs.launchObserver({
        parentNode: document,
        selector: 'div.exam-tit',
        successCallback: () => {
            if(!inTestPage()) return
            appendTestBtn()
        },
        stopWhenSuccess: false,
    })

    // 创建设置菜单

    const setPlaybackRate = () => {
        const oldRate = cfg.getValue(cfgOpt.fastplayRate.key)
        const rate = parseFloat(prompt('设置播放倍速', oldRate))
        if (rate && rate != oldRate) {
            cfg.setValue(cfgOpt.fastplayRate.key, rate)
        }
    }
    GM_registerMenuCommand('设置播放倍速', setPlaybackRate)
    const setAutoMute = () => {
        const autoMute = confirm('是否自动静音？')
        cfg.setValue(cfgOpt.autoMute.key, autoMute)
    }
    GM_registerMenuCommand('设置自动静音', setAutoMute)
    GM_registerMenuCommand('快进一分', () => jumpSeconds())
    GM_registerMenuCommand('播放结束', justEnd)

    GM_registerMenuCommand('开始下一课', gotoNextCourse)
    GM_registerMenuCommand('开始考试', gotoTest)
    GM_registerMenuCommand('自动答题', autoTest)

    // 功能导出

    unsafeWindow.ZRYYHelper = {
        get inCoursePage() {return inCoursePage()},
        get video() {return getVideo()},
        autoMute,
        fastPlay,
        signIn,
        jumpSeconds,
        justEnd,
        getAnswer,
        config: cfg,
        settings: {
            setPlaybackRate,
            setAutoMute,
        },
        getCourseList,
        gotoNextCourse,
        gotoTest,
        autoTest,
    }
})();