// ==UserScript==
// @name         华医网学习助手
// @namespace    https://yinr.cc/
// @version      0.4
// @description  自动签到
// @author       Yinr
// @license      MIT
// @icon         https://www.91huayi.com/upload/images/2019/12/3017338625.png
// @match        https://cme28.91huayi.com/course_ware/course_ware_polyv.aspx*
// @require      https://update.greasyfork.org/scripts/458769/1147575/Yinr-libs.js
// @run-at       document-start
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/516648/%E5%8D%8E%E5%8C%BB%E7%BD%91%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/516648/%E5%8D%8E%E5%8C%BB%E7%BD%91%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

/* global YinrLibs */

(function() {
    'use strict';

    const DONE_CLASS = 'hy-helper-done'

    /** 是否在课程学习界面 */
    const inCoursePage = () => document.location.pathname === '/course_ware/course_ware_polyv.aspx'

    const getPlayer = () => unsafeWindow.player
    const playerGetDuration = () => getPlayer().j2s_getDuration()
    const playerResumePlay = () => getPlayer().j2s_resumeVideo()
    const playerSeek = (t) => getPlayer().j2s_seekVideo(t)
    /** @returns {HTMLVideoElement} */
    const getVideo = () => document.querySelector('video')

    /**
     * @typedef {'未学习'|'学习中'|'待考试'|'已完成'} CourseState
     */

    /**
     * 获取课程信息
     * @returns {{el: HTMLLIElement, title: string, state: CourseState, action: HTMLElement, current: boolean}[]}
     */
    const getCourseList = () => {
        /** @type {HTMLLIElement[]} */
        const lis = Array.from(document.querySelectorAll('div.video-container div.page-content ul.lis-content li.lis-inside-content'))
        return lis.map(el => {
            const h2 = el.getElementsByTagName('h2')[0]
            const current = h2.getElementsByTagName('i').length > 0
            const title = h2.textContent.trim()
            const btn = el.getElementsByTagName('button')[0]
            const state = btn.innerText.trim()
            return {el, title, btn, state, action: h2, current}
        })
    }
    const getCurrentCourse = () => {
        const list = getCourseList()
        return list.find(c => c.current)
    }
    const gotoNextCourse = () => {
        const list = getCourseList()
        const next = list.filter(c => !c.current).find(c => c.state === '学习中' || c.state === '未学习')
        if (next) {
            next.action.click()
        } else {
            console.warn('未找到下一节未学习课程')
        }
    }

    // 自动签到
    const SIGN_IN_SELECTOR = '#video div.sign-in-menu button.btn_sign'
    const signIn = async () => {
        console.log('准备自动签到')
        /** @type {HTMLButtonElement} */
        const el = document.querySelector(SIGN_IN_SELECTOR)
        await YinrLibs.sleep(500)
        el.click()
    }
    YinrLibs.launchObserver({
        parentNode: document,
        selector: SIGN_IN_SELECTOR,
        successCallback: () => {
            if(!inCoursePage()) return
            signIn()
        },
        stopWhenSuccess: false,
    })

    // 不能拖拽自动知道
    const KNOWN_SELECTOR = '#div_processbar_tip div.login_box2 div.btn_box button'
    const known = async () => {
        /** @type {HTMLButtonElement} */
        const el = document.querySelector(KNOWN_SELECTOR)
        await YinrLibs.sleep(500)
        el.click()
    }
    YinrLibs.launchObserver({
        parentNode: document,
        selector: KNOWN_SELECTOR,
        successCallback: () => {
            if(!inCoursePage()) return
            known()
        },
        stopWhenSuccess: false,
    })

    // 播放结束自动下一课
    const playEnd = () => {
        const current = getCurrentCourse()
        if (current && current.state === '待考试') return

        console.log('准备自动进入下一课')
        const vid = getVideo()
        vid.removeEventListener('ended', playEnd)
        YinrLibs.sleep(500)
        gotoNextCourse()
    }
    YinrLibs.launchObserver({
        parentNode: document,
        selector: '#video div.pv-video-wrap video',
        successCallback: () => {
            const vid = getVideo()
            if (vid.classList.contains(DONE_CLASS)) return
            vid.classList.add(DONE_CLASS)
            vid.addEventListener('ended', playEnd)
        },
        stopWhenSuccess: false,
    })

    /** 强制完成学习 */
    const justFinishCourse = () => {
        // playerSeek(playerGetDuration())
        addCourseWarePlayRecord()
        updateCourseWareProcess(2)
    }
    GM_registerMenuCommand('强制完成学习（测试）', justFinishCourse)

    unsafeWindow.hyHelper = {
        getCourseList,
        gotoNextCourse,
        getPlayer,
        getVideo,
        justEndVideo: justFinishCourse,
        playerAction: {
            playerGetDuration,
            playerResumePlay,
            playerSeek,
        }
    }
})();