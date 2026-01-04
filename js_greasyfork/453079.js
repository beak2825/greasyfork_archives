// ==UserScript==
// @name         【专业版】青书学堂挂课作业考试
// @namespace    https://github.com/lanomw
// @version      0.4
// @description   青书学堂视频自动静音播放，解放双手。支持自动播放视频、作业答案查看代刷，论文，直播，考试，需要+V luck55616
// @author       lanomw
// @match        *://*.qingshuxuetang.com/*
// @icon         https://degree.qingshuxuetang.com/resources/default/images/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453079/%E3%80%90%E4%B8%93%E4%B8%9A%E7%89%88%E3%80%91%E9%9D%92%E4%B9%A6%E5%AD%A6%E5%A0%82%E6%8C%82%E8%AF%BE%E4%BD%9C%E4%B8%9A%E8%80%83%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/453079/%E3%80%90%E4%B8%93%E4%B8%9A%E7%89%88%E3%80%91%E9%9D%92%E4%B9%A6%E5%AD%A6%E5%A0%82%E6%8C%82%E8%AF%BE%E4%BD%9C%E4%B8%9A%E8%80%83%E8%AF%95.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    setTimeout(function () {
        autoPlayVideo()
        showAnswer()
    }, 3000)
 
})();
 
// 自动播放视频
function autoPlayVideo() {
    // 非播放页面阻断执行
    if (location.href.indexOf('cw_nodeId') === -1) {
        return
    }
 
    const urlSearch = UrlSearch()
 
    // 当前id
    const cw_nodeId = `courseware-${urlSearch.cw_nodeId}`
    // 课程列表
    const lessonList = document.getElementById('lessonList').children
    // 下一个课程
    const next_cw_nodeId = getNextLession(lessonList, cw_nodeId)
 
 
    const video = document.getElementsByTagName("video")[0]
    // 静音、倍速
    video.muted = true
    // 设置倍速播放 支持以下速率: [2, 1.5, 1.2, 0.5]
    video.playbackRate = 2
    video.play()
 
    // 视频播放结束则跳转
    console.log(cw_nodeId, '---> to -->', next_cw_nodeId)
    video.addEventListener("ended", function () {
        if (next_cw_nodeId) {
            const lession = document.getElementById(next_cw_nodeId)
            lession && lession.click()
        }
    })
}
 
// 作业答案
function showAnswer() {
    // 非作业答题页面阻断执行
    if (location.href.indexOf('ExercisePaper') === -1) {
        return
    }
 
    const url = location.href.replace('ExercisePaper', 'ViewExerciseAnswer')
 
    // 窗口可能会被浏览器拦截。需要允许
    window.open(url, '_blank')
}
 
// url参数转换为对象
function UrlSearch() {
    const search = location.search.replace('?', '')
    const params = {}
    const arr = search.split('&')
    arr.forEach(item => {
        const pArr = item.split('=')
        params[pArr[0]] = pArr[1]
    })
 
    return params
}
 
// 根据当前课程id递归获取下一个课程
function getNextLession(list, cw_nodeId) {
    let nodeId = ''
    let isMatch = false
 
 
    function findLession(list) {
        for (let i = 0; i < list.length; i++) {
            const children = list[i].children
            const childElementCount = list[i].childElementCount
            if (childElementCount === 1) {
                // 下一个课程
                if (isMatch) {
                    nodeId = children[0].id
                    break
                }
 
                // 已匹配到当前课程。获取下一个课程
                if (children[0].id === cw_nodeId) {
                    isMatch = true
                    continue;
                }
            } else {
                // 递归
                findLession(children[1].children)
                if (nodeId && isMatch) {
                    break
                }
            }
        }
 
        return {nodeId, isMatch}
    }
 
    findLession(list)
 
    return nodeId
}