// ==UserScript==
// @name         CME Study Helper
// @namespace    https://yinr.cc/
// @version      0.2.1
// @description  好医生继续教育视频学习助手
// @author       Yinr
// @license      MIT
// @match        https://www.cmechina.net/cme/study2.jsp*
// @icon         https://www.cmechina.net/favicon.ico
// @require      https://update.greasyfork.org/scripts/458769/1147575/Yinr-libs.js
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @run-at       document-start
// @grant        GM_notification
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/513036/CME%20Study%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/513036/CME%20Study%20Helper.meta.js
// ==/UserScript==

/* global YinrLibs, $ */

(function() {
    'use strict';

    const oldAlert = unsafeWindow.alert
    /** @param {string[]} args */
    unsafeWindow.alert = (...args) => {
        const text = args[0]
        if (text.includes('过程签到')) {
            GM_notification({
                text: args[0],
                title: 'CME Helper',
            })
        } else if (text.includes('当前账号有正在学习的课件，请关闭后再来学习此课件')) {
            GM_notification({
                text: args[0],
                title: 'CME Helper',
            })
            // document.location.reload()
            throw Error("Skip reload")
        } else {
            oldAlert(...args)
        }
    }
    // unsafeWindow.console.clear = () => 0
    const oldInterval = unsafeWindow.setInterval
    unsafeWindow.setInterval = (...args) => {
        if (args[0].toString().includes('console.clear()')) {
            console.log('Bad guy! Skipped!')
            console.log({arg: args, function: args[0].toString()})
        } else {
            return oldInterval(...args)
        }
    }



    /** @returns {HTMLDivElement} */
    const getStudyEl = () => {
        return $('.study_right')[0]
    }

    /** @returns {HTMLAnchorElement[]} */
    const getCourseEl = () => {
        const studyEl = getStudyEl()
        return Array.from($(studyEl).find('li[id^=li]>a[onclick]'))
    }

    /** Check Course Infomations
     * @argument {HTMLAnchorElement} el
     * @returns {{current: boolean, status: 'done'|'todo'|'test'}}
     */
    const checkCourse = (el) => {
        /** @type {HTMLLIElement} */
        const li = el.parentElement
        const current = li.classList.contains('active')
        /** @type {HTMLElement} */
        const infoEl = el.nextSibling
        /** @type {'done'|'todo'|'test'} */
        let status = 'todo'
        switch (infoEl.innerText) {
            case '考试通过':
                status = 'done'
                break;
            case '待考试':
                status = 'test'
                break;
            case '未学习':
            default:
                status = 'todo'
                break;
        }
        return {current, status}
    }

    const getCourseCurrentEl = () => {
        const courseEl = getCourseEl()
        return courseEl.find(el => checkCourse(el).current)
    }

    const getCourseCurrentStatus = () => {
        const el = getCourseCurrentEl()
        return checkCourse(el).status
    }

    const getCourseTodoEl = () => {
        const courseEl = getCourseEl()
        return courseEl.filter(el => {
            const info = checkCourse(el)
            return info.status == 'todo' && !info.current
        })
    }

    const getCourseTodoTestEl = () => {
        const courseEl = getCourseEl()
        return courseEl.filter(el => {
            const info = checkCourse(el)
            return info.status == 'test' && !info.current
        })
    }

    const getCourseFollowingEl = () => {
        const courseEl = getCourseEl()
        const curIdx = courseEl.map(el => checkCourse(el)).findIndex(el => el.current)
        return courseEl.slice(curIdx + 1)
    }

    const gotoNextCourse = () => {
        const todoCourse = getCourseFollowingEl()
        const testCourse = getCourseTodoTestEl() || getCourseTodoEl()
        if (todoCourse.length > 0) {
            GM_notification({
                text: '开始进入下一课',
                title: 'CME Helper',
            })
            todoCourse[0].click()
        } else if (testCourse.length > 0) {
            GM_notification({
                text: '准备下一课考试',
                title: 'CME Helper',
            })
            testCourse[0].click()
        } else {
            GM_notification({
                text: '当前课程已全部学完',
                title: 'CME Helper',
            })
            console.log('当前课程已全部学完')
        }
    }

    const getVideo = () => {
        return $('video')[0]
    }

    const getJsPlayer = () => {
        return unsafeWindow.cc_js_Player
    }

    const startPlay = () => {
        const video = getVideo()
        video.muted = true
        video.autoplay = true
        // video.defaultPlaybackRate = 1.5
        unsafeWindow.on_CCH5player_play()
        // video.play()
        // video.playbackRate = 1.5
        video.addEventListener('pause', startPlay)
        video.addEventListener('ended', () => {
            video.removeEventListener('pause', startPlay)
            setTimeout(() => {gotoNextCourse()}, 5000)
        })
    }

    const endCourse = () => {
        unsafeWindow.on_CCH5player_ended()
        gotoNextCourse()
    }

    const addEndBtn = () => {
        const btn = document.createElement('a')
        btn.href = '#'
        btn.classList.add('cur')
        btn.innerText = '直接结束'
        btn.addEventListener('click', () => {
            endCourse()
        })
        const container = $("div.study_right > div.s_r_bts")[0]
        container.append(btn)
    }

    unsafeWindow.addEventListener('load', () => {
        const status = getCourseCurrentStatus()
        if (status == 'todo') {
            console.log('自动开始学习')
            addEndBtn()
            startPlay()
        } else if (status == 'test') {
            console.log('准备考试')
        } else {
            gotoNextCourse()
        }
    })

    // 自动签到
    YinrLibs.launchObserver({
        parentNode: document,
        selector: 'a[onclick="readComplete()"]',
        successCallback: () => {
            $('a[onclick="readComplete()"]:visible').click()
        },
        stopWhenSuccess: false,
    })


    // 自动继续播放
    YinrLibs.launchObserver({
        parentNode: document,
        selector: '#ccH5jumpInto > b',
        successCallback: () => {
            $("#ccH5jumpInto > b").click()
        },
        stopWhenSuccess: false,
    })

    // 修复 document.querySelector
    // $(() => document.querySelector = (s) => $(s)[0])
    $(() => on_CCH5player_ready = () => {console.log('on_CCH5player_ready(Fix)');})

    unsafeWindow.CMEHelper = {
        getCourseCurrentStatus,
        startPlay,
        /** @param {number} time */
        jumpToTime(time) {getJsPlayer().jumpToTime(time)},
        jumpBuffer() {
            const player = getJsPlayer()
            player.jumpToTime(player.getDuration() - 1000)
        },
        endCourse,
        gotoNextCourse,
        gotoExam: unsafeWindow.gotoExam,
        gotoPDF: unsafeWindow.gotoPDF,
        ajaxstatus: unsafeWindow.ajaxstatus,
        raw: {
            getJsPlayer,
            getZhuge() {return unsafeWindow.zhuge}
        },
        get: {
            getStudyEl,
            getCourseEl,
            getCourseCurrentEl,
            getCourseTodoEl,
            getCourseTestEl: getCourseTodoTestEl,
            getVideo,
        },
        $,
    }
})();