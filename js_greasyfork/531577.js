// ==UserScript==
// @name         [25-05-21] 青书学堂自动看课
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  自动看视频+同时获取网络资料学习积分
// @author       Hu5
// @run-at       document-start
// @match        https://degree.qingshuxuetang.com/*/Student/Course/CourseShow*
// @downloadURL https://update.greasyfork.org/scripts/531577/%5B25-05-21%5D%20%E9%9D%92%E4%B9%A6%E5%AD%A6%E5%A0%82%E8%87%AA%E5%8A%A8%E7%9C%8B%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/531577/%5B25-05-21%5D%20%E9%9D%92%E4%B9%A6%E5%AD%A6%E5%A0%82%E8%87%AA%E5%8A%A8%E7%9C%8B%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 跳过iFrame
    if (window.top !== window.self) return
    function getAllNodeId() {
        // 获取所有的课程ID
        const allElements = document.querySelectorAll('*');
        const matchingIds = [];
        for (let i = 0; i < allElements.length; i++) {
            const element = allElements[i];
            if (element.id && element.id.startsWith("courseware-kcjs_")) {
                matchingIds.push(element.id.replace("courseware-", ""));
            }
        }
        return matchingIds;
    }

    async function getEbookId() {
        // 用于获取需要的文档ID
        const courseId = (new URL(document.URL)).searchParams.get("courseId")
        const res = await fetch(`/hkd/Student/Course/CourseEbooks?order=asc&offset=0&limit=10&courseId=${courseId}`)
        const resJson = await res.json()
        console.log(`[Ebook] 成功获取网络资料`,resJson.data.data.rows)
        return resJson.data.data.rows[0].materialId
    }

    async function startEbookStudy(classId, courseId, ebookId, periodId) {
        // 开始学习 并记录 获取接口返回的记录ID
        console.log(`[Ebook] 开始学习`)
        const res = await fetch(`/hkd/Student/Course/UploadStudyRecordBegin`, {
            method: "POST",
            headers: {
                "Content-Type": 'application/json',
            },
            body: JSON.stringify({
                "classId": classId,
                "courseId": courseId,
                "contentId": ebookId,
                "contentType": 12,
                "periodId": periodId,
                "position": 0,
                "detectId": null
            })
        })
        const resJson = await res.json()
        const recordId = resJson.data
        console.log(`[Ebook] ${recordId}`)
        // 配置一个定时器 每两分钟上传学习记录
        console.log(`[Ebook] 定时上传学习记录`)
        setInterval(function() {
            fetch(`hkd/Student/Course/UploadStudyRecordContinue`, {
                method: "POST",
                headers: {
                    "Content-Type": 'application/x-www-form-urlencoded',
                },
                body: `recordId=${recordId}&end=false&position=0&timeOutConfirm=false`
            })
        }, 12e4)
        // 增加一个退出回调,页面退出就结束本次学习
        window.addEventListener("beforeunload", function() {
            const fd = new FormData();
            fd.append('recordId', recordId);
            fd.append('end', true);
            fd.append('position', 0);
            fd.append('timeOutConfirm', false);
            navigator.sendBeacon(`/hkd/Student/Course/UploadStudyRecordContinue`, fd)
        })

        return recordId
    }

    async function ebook() {
        // 获取学习积分
        const urlParams = (new URL(document.URL)).searchParams
        const classId = urlParams.get("teachPlanId")
        const courseId = urlParams.get("courseId")
        const periodId = urlParams.get("periodId")
        const ebookId = await getEbookId()
        startEbookStudy(classId, courseId, ebookId, periodId)

    }

    function playVideo(videoElm) {
        // 当前的视频ID
        const nodeId = (new URL(document.URL)).searchParams.get("nodeId")
        const kcjsIds = getAllNodeId()
        // 下一节课的ID
        const nextNodeId = kcjsIds[kcjsIds.indexOf(nodeId) + 1]

        // 自动播放
        videoElm.autoplay = true
        // 慢倍速播放凑时长
        videoElm.playbackRate = 1;
        // 开始播放
        const playHandler = setInterval(()=>{
            // 静音
            videoElm.muted = true;
            videoElm.play()
        }, 100)
        videoElm.onplaying = () => {
            clearInterval(playHandler)
        }
        // 顺便获取网络学习积分
        ebook()
        // 看完自动下一课
        videoElm.onended = () => {
            // 如果还有下一节课,继续看
            if (nextNodeId) {
                // 调用页面方法点击下一课
                CoursewareNodesManager.onMenuClick(nextNodeId)
            } else {
                // 没有就是看完了,不再继续
                console.log(`[结束] 看完了,不再继续`);
            }
        }
    }

    // 其实你播不播放视频都行
    // 只要调用这里的JS,例如 uploadStudyRecordBegin 进行学习记录的上传就行
    // https://degree.qingshuxuetang.com/resources/default/ui/lib/onlinecourse/studyRecordService.js?v=23.04.0
    async function main() {
        // 获取所有课程ID
        const videoElem = document.querySelector("video.vjs-tech")
        // 两种情况 1.页面已加载video(调试时场景) 2.尚未动态加载 均直接播放
        if (videoElem) {
            console.log(`[已有Video] 播放视频`)
            playVideo(videoElem)
        } else {
            // 播放容器
            let videoPlayer = document.querySelector("#playerContainer")

            // 监视HTML变化 以找出动态加载的video标签
            const observer = new MutationObserver(async (mutationsList, observer) => {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        // 查找视频元素
                        const videoElm = mutation.target.querySelector('video')
                        if (videoElm) {
                            // 播放视频
                            playVideo(videoElm)
                            // 找到关闭监视
                            return observer.disconnect()
                        }
                    }
                }
            }
            )
            // 存在播放容器开始监视
            if (videoPlayer) {
                observer.observe(videoPlayer, {
                    childList: true,
                    subtree: true
                });
            }
        }
        // 检测概述并跳过
        const nodeId = (new URL(document.URL)).searchParams.get("nodeId")
        if (!nodeId.indexOf(`jbxx`)) {
            console.log(`[Main] 跳过概述,直达视频`)
            const kcjsIds = getAllNodeId()
            return window.CoursewareNodesManager.onMenuClick(kcjsIds[0])

        }
        console.log(`[Main] 开始看课`)

    }

    window.addEventListener("load",main)
}
)();
