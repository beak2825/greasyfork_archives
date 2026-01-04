// ==UserScript==
// @name         智慧树
// @namespace    https://www.tampermonkey.net/
// @version      1.1.0
// @description  智慧树视频快速刷完，解放双手。
// @author       zhaozk
// @match        https://armystudy.zhihuishu.com/armystudy/militaryStudy?*
// @icon         http://image.zhihuishu.com/zhs_yufa_150820/able-commons/demo/201806/0c81bd49be6b4184bc4aaf1472a2fabd.png
// @require      https://unpkg.com/pxmu@1.1.0/dist/web/pxmu.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497775/%E6%99%BA%E6%85%A7%E6%A0%91.user.js
// @updateURL https://update.greasyfork.org/scripts/497775/%E6%99%BA%E6%85%A7%E6%A0%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //延时等待页面加载完成
    setTimeout(function (){
        // 获取视频播放元素
        const videoLists = document.querySelectorAll('.mi-courseContent ul li')
        if (videoLists.length) {
            getVideoMsg(videoLists)
        }
    },2000)
    // Your code here...
})();

//遍历视频列表（获取视频id/视频时间/lessonid/measureId）
async function getVideoMsg (list) {
    for (const index in list ) {
        const item = list[index]

        //获取视频id
        const videoId = $(item).attr('videoId')
        //获取lessonid
        const lessonId = $(item).attr('lessonId')
        //获取measureId
        const measureId = $(item).attr('measureId')
        // 视频观看时间
        let watchTime = 180
        // 视频结束观看时间
        let exitwatchTime = 0
        //获取视频时间
        let videoTotalTime = 0

        if (videoId && lessonId) {
            //获取视频时间
            videoTotalTime = timeToSeconds($(item).find('.mi_timeSpan').html())
            let  title = $(item).find('.mi_couseName').html()
            let itemWatchtime = $(item).find('.mi_completed').attr('span_watchtime')
            // 判断该视频是否已经播放完成
            if (!$(item).find('.mi_completed').hasClass('html_hide')) {
                continue;
            }
            //上报次数
            const count = Math.ceil(videoTotalTime/180)
            //隔180秒上报视频进度
            for (let i = 0;i < count;i++) {
                console.log('准备上报'+title)
                if(parseInt(videoTotalTime) < 180) {
                    watchTime = parseInt(videoTotalTime) + 1
                    exitwatchTime = exitwatchTime + parseInt(videoTotalTime)
                    videoTotalTime = 0
                } else {
                    exitwatchTime = exitwatchTime + 180
                }
                //上报
                await videoPlay({videoId,lessonId,measureId,watchTime,exitwatchTime,videoTotalTime,title})
                watchTime = 180
                videoTotalTime = videoTotalTime - 180
                if(parseInt(videoTotalTime) <= 0){
                    exitwatchTime = 0
                }
            }
            pxmu.success({
                msg: title+'完成！', bg: '#4CC443',
            })
        }
    }
}
// 时间转换秒
function timeToSeconds(strTime) {
    var Temp = strTime.split(':');
    var seconds = 60 * Number(Temp[0]) + Number(Temp[1]);
    return seconds;
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
//请求接口完成视频播放
function videoPlay (video) {
    const searchUrl = UrlSearch()
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            console.log('开始上报'+video.title)
            $.post('https://armystudy.zhihuishu.com/armystudy/stuRecord', {
                courseId:searchUrl.courseId, //课程id
                userId: searchUrl.userId, //用户id
                videoId:video.videoId, //视频id
                exitwatchTime:video.exitwatchTime, //播放结束时间
                lessonId:video.lessonId,
                measureId:video.measureId,
                videoNum:$("#lessonNum").html(),
                watchTime:video.watchTime //观看视频时长（180s一个循环）
            }, function (res) {
                if (video.videoTotalTime >= 0 ) {
                }
            })
            resolve()},3000)
    })


}