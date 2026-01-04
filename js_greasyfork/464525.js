// ==UserScript==
// @name 心理健康教育教师视频网站刷课神器
// @description 用于心理健康教育教师视频网站刷课时
// @namespace Violentmonkey Scripts
// @match http://zjxlypzx.sunplus.wang/study/stydy*
// @grant none
// @version 1.0.1
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464525/%E5%BF%83%E7%90%86%E5%81%A5%E5%BA%B7%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E8%A7%86%E9%A2%91%E7%BD%91%E7%AB%99%E5%88%B7%E8%AF%BE%E7%A5%9E%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/464525/%E5%BF%83%E7%90%86%E5%81%A5%E5%BA%B7%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E8%A7%86%E9%A2%91%E7%BD%91%E7%AB%99%E5%88%B7%E8%AF%BE%E7%A5%9E%E5%99%A8.meta.js
// ==/UserScript==

function cateAnylyze(endTime,lockTime) {
    request('/WebAPI/study/timeSync', 'post', {
        SubjectID: pid,
        CoursePID: courseid,
        ChapterID: cid,
        EndTime: endTime,
        // LookTime: videoPtime
        LookTime: lockTime
    }).then(res => {
        if (res.ResultCode == 1) {
            console.log('已完成当前课时')
        }
    })
}

let finishTime = 0;
timer = setInterval(() => {
    let totalTime = courseList[0].ChapterTime
    let startTime = courseList[0].Time
    let lockTime = 15;

    if (totalTime == startTime && finishTime == 0){
        console.log("视频完成状态")
        clearInterval(timer)
        return
    }

    if (startTime + finishTime >= totalTime){
        startTime = totalTime;
        cateAnylyze(startTime,lockTime)
    }else {
        cateAnylyze(startTime + finishTime,lockTime)
    }

    if (startTime == totalTime){
        finishTime = 0
        clearInterval(timer)
        alert("视频查看完成")
        console.log('视频查看完成'+finishTime)
    }else {
        finishTime += lockTime
        console.log('时长增加'+finishTime)
    }
}, 100);

