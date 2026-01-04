// ==UserScript==
// @name         日升通
// @namespace    日升通
// @version      0.8
// @description  一起学习
// @author       zusheng
// @match        *://*.chaoxing.com/mycourse/studentstudy*
// @icon         https://www.google.com/s2/favicons?domain=chaoxing.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/436442/%E6%97%A5%E5%8D%87%E9%80%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/436442/%E6%97%A5%E5%8D%87%E9%80%9A.meta.js
// ==/UserScript==
(function () {
    'use strict';

    window.alert = () => {
        console.error('alert被拦截!')
        return false
    }

    // 未完成的列表
    const undoneList = []

    /**
         * 查找是否有未完成的章节
         */
    function findUndoneList() {
        document.querySelectorAll(".chapter #coursetree ul li .posCatalog_level ul li").forEach(item => {
            if (item.querySelector('.prevTips') && item.querySelector('.prevTips').classList?.length > 0) {
                let content = item.querySelector('.prevTips').classList.value
                let reg = new RegExp(/icon_Completed/)
                if (!reg.test(content)) undoneList.push(item)
            } else {
                undoneList.push(item)
            }
        })
        console.log('找到' + undoneList.length + '个未完成章节')
        if (undoneList.length > 0) delUndoneList()
    }

    /**
         * 正式刷课
         */
    function delUndoneList() {
        document.documentElement.querySelector('.left').addEventListener('DOMNodeInserted', run)
        // 选中目录
        console.log('@click, 切换任务')
        undoneList[0]?.querySelector('div > .posCatalog_name').click()
        // 完成一个，下一步
        function nextSteps() {
            undoneList.shift()
            if (undoneList.length > 0) {
                setTimeout(() => {
                    delUndoneList()
                }, 6 * 1000)
            }
        }

        function run() {
            if (!!document.documentElement.querySelector('#iframe')) {
                document.documentElement.querySelector('.left').removeEventListener('DOMNodeInserted', run)
                document.documentElement.querySelector('#iframe').onload = () => {
                    console.log('iframe.load')
                    // 本页iframe列表
                    // const iframeList = document.documentElement.querySelector('#iframe').contentDocument.querySelectorAll('.ans-attach-online')
                    const iframeList = document.documentElement.querySelector('#iframe').contentDocument.querySelectorAll('.wrap .ans-cc p .ans-attach-ct')
                    // DOM WORKS LI
                    const workList = document.documentElement.querySelectorAll('#prev_tab .prev_ul li')
                    // 执行完本页窗口，开始查看是否存在本章其余任务
                    if (iframeList && iframeList.length > 0) {
                        setTimeout(async () => {
                            // 完成 iframe 窗口内的任务
                            await rushWorks(iframeList)
                            // if (workList > 1) await nextWorks(workList)
                            nextSteps()
                        }, 0 * 1000)
                    } else {
                        // 下一章
                        nextSteps()
                    }
                }
            }
        }
    }

    /**
         * 执行本页任务
         */
    function rushWorks(iframeList) {
        return new Promise(resolve => {
            console.log('任务总数：', iframeList?.length)
            let i = 0
            let runFlag = false

            iframeList[0].querySelector('iframe').onload = () => run()

            setTimeout(() => {
                if (!runFlag) run()
            }, 3 * 1000)

            function run() {
                const currentIframe = iframeList[i]
                runFlag = true
                // ?.parentElement || iframeList[i]?.parentNode || null
                if (iframeList?.length > i) {
                    // DOM BUTTON
                    const pptFlag = currentIframe?.querySelector('iframe')?.contentDocument?.querySelector('#navigation #ext-gen1045')
                    // DOM VIDEO
                    const videoFlag = currentIframe?.querySelector('iframe')?.contentDocument?.querySelector('#video_html5_api')
                    // 标记是否完成
                    const complete = [...currentIframe?.classList].includes('ans-job-finished')

                    console.log('rushWorks - run：ppt?', !!pptFlag, ',video?', !!videoFlag)

                    if (!!pptFlag) {
                        console.log('当前任务(PPT)：', i + 1)
                        checkPPT(pptFlag).then(() => run())
                    } else if (!!videoFlag) {
                        if (!complete) {
                            console.log('当前任务(VIDEO)：', i + 1)
                            // const p_id = 'p_work' + (i + 1)
                            // currentIframe.setAttribute('id', p_id)
                            // location.hash = p_id
                            checkVideo(videoFlag).then(() => run())
                        } else {
                            console.log('跳过任务(VIDEO)：', i + 1)
                            i++
                            run()
                        }
                    }
                } else {
                    resolve()
                }
                i++;
            }
        })
    }

    /**
         * 检测并自动播放PPT
         * @return {Promise<unknown>}
         * @param pptFlag 下一页按钮
         */
    function checkPPT(pptFlag) {
        return new Promise(resolve => {
            let timer = setInterval(() => { // 一秒换一张PPT
                if (pptFlag?.style?.visibility === 'hidden') {
                    // 当翻到最后一页PPT时，清除定时器
                    clearInterval(timer)
                    resolve()
                } else {
                    // 下一页PPT
                    pptFlag.click()
                }
            }, 1000)
            })
    }

    /**
         * 检测并自动播放视频
         * @param videoFlag
         * @return {Promise<unknown>}
         */
    function checkVideo(videoFlag) {
        return new Promise(resolve => {
            videoFlag.muted = true
            videoFlag.preload = "auto"
            videoFlag.playbackRate = 2
            // videoFlag.controls = true
            // videoFlag.autoplay = true
            // setTimeout(() => videoFlag.play().catch(), 1000)
            // 可以播放时
            videoFlag.addEventListener('canplay', function () {
                console.log('canplay')
                videoFlag.play().catch()
                console.log('checkVideo - videoFlag：muted?', videoFlag.muted, ', preload?', videoFlag.preload, ', playbackRate?', videoFlag.playbackRate, ', pausedStatus?', videoFlag.paused)
            });
            // 视频播放结束监听
            videoFlag.addEventListener('ended', function () {
                console.log('视频播放结束')
                resolve()
            });
            // waiting
            let waitTimer = null
            videoFlag.addEventListener('waiting', function () {
                console.log('waiting')
                videoFlag.pause()
                if (waitTimer) clearTimeout(waitTimer)
                waitTimer = setTimeout(() => {
                    videoFlag.play()
                }, 3000)
            });
            // 视频出错监听
            let playTimer = null
            videoFlag.addEventListener('error', function () {
                console.log('视频播放错误， 即将重新开始')
                if (playTimer) clearTimeout(playTimer)
                resolve()
            })
            //
            if (videoFlag.paused) {
                setTimeout(() => {
                    videoFlag.play().catch()
                    console.log('checkVideo - videoFlag：muted?', videoFlag.muted, ', preload?', videoFlag.preload, ', playbackRate?', videoFlag.playbackRate, ', pausedStatus?', videoFlag.paused)
                }, 1000)
            }
        })
    }

    /**
         * 执行本章下一个任务
         * @return {Promise<unknown>}
         * @param workList
         */
    function nextWorks(workList) {
        return new Promise(resolve => {
            let i = 1
            run()

            function run() {
                if (workList.length >= i) {
                    const currentBtn = workList[i]
                    currentBtn.click()
                    setTimeout(async () => {
                        await rushWorks()
                        i++
                        run()
                    }, 1000 * 5)
                } else {
                    resolve()
                }
            }
        })
    }

    window.addEventListener('load', function () {
        findUndoneList()
    });

    // 开始查找
    // setTimeout(() => findUndoneList(), 5 * 1000)

})();