// ==UserScript==
// @name         日升通
// @namespace    日升通
// @version      0.3
// @description  一起学习
// @author       zusheng
// @match        *://*.chaoxing.com/mycourse/studentstudy*
// @icon         https://www.google.com/s2/favicons?domain=chaoxing.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/436444/%E6%97%A5%E5%8D%87%E9%80%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/436444/%E6%97%A5%E5%8D%87%E9%80%9A.meta.js
// ==/UserScript==
(function () {
    'use strict';

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
        // 选中目录
        console.log('@click, 点击切换任务')
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

        setTimeout(async () => {
            // 本页iframe列表
            // const iframeList = document.documentElement.querySelector('#iframe').contentDocument.querySelectorAll('.ans-attach-online')
            const iframeList = document.documentElement.querySelector('#iframe').contentDocument.querySelectorAll('.wrap .ans-cc p')
            // DOM WORKS LI
            const workList = document.documentElement.querySelectorAll('#prev_tab .prev_ul li')
            // 执行完本页窗口，开始查看是否存在本章其余任务
            if (iframeList && iframeList.length > 0) {
                // 完成 iframe 窗口内的任务
                await rushWorks(iframeList)
                if (workList > 1) await nextWorks(workList)
                nextSteps()
            } else {
                // 下一章
                nextSteps()
            }
        }, 6 * 1000)
    }

    /**
         * 执行本页任务
         */
    function rushWorks(iframeList) {
        return new Promise(resolve => {
            let i = 0
            run()
            console.log('任务总数：', iframeList?.length)

            function run() {
                const currentIframe = iframeList[i]
                if (iframeList?.length > i) {
                    console.log('当前任务：', i + 1)
                    // DOM BUTTON
                    const pptFlag = currentIframe?.querySelector('iframe')?.contentDocument?.querySelector('#navigation #ext-gen1045')
                    // DOM VIDEO
                    const videoFlag = currentIframe?.querySelector('iframe')?.contentDocument?.querySelector('#video_html5_api')
                    // 标记是否完成
                    const complete = [...currentIframe?.querySelector('.ans-attach-ct').classList].includes('ans-job-finished')
                    if (pptFlag) {
                        checkPPT(pptFlag).then(() => run())
                    } else if (videoFlag) {
                        if (!complete) {
                            checkVideo(videoFlag).then(() => run())
                        } else {
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
            setTimeout(() => {
                // 自动播放开始
                videoFlag.muted = true
                videoFlag.preload = "auto"
                // videoFlag.controls = true
                videoFlag.autoplay = true
                videoFlag.playbackRate = 2
                videoFlag.play()
                console.log('自动播放视频')
                // 视频播放结束监听
                videoFlag.addEventListener('ended', function () {
                    console.log('视频播放结束')
                    resolve()
                });
                // 视频出错监听
                videoFlag.addEventListener('error', function () {
                    console.log('视频播放错误')
                    resolve()
                })
            }, 3000)
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

    // 开始查找
    setTimeout(() => findUndoneList(), 5 * 1000)

})();