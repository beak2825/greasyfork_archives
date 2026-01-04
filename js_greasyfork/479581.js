// ==UserScript==
// @name         【全自动】青书学堂挂课
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  青书学堂 自动播放视频 自动挂课 自动下个视频 自动下个课程
// @author       Yi
// @match        https://qingshuxuetang.com/*
// @match        https://*.qingshuxuetang.com/*
// @match        https://www.qingshuxuetang.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        None
// @downloadURL https://update.greasyfork.org/scripts/479581/%E3%80%90%E5%85%A8%E8%87%AA%E5%8A%A8%E3%80%91%E9%9D%92%E4%B9%A6%E5%AD%A6%E5%A0%82%E6%8C%82%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/479581/%E3%80%90%E5%85%A8%E8%87%AA%E5%8A%A8%E3%80%91%E9%9D%92%E4%B9%A6%E5%AD%A6%E5%A0%82%E6%8C%82%E8%AF%BE.meta.js
// ==/UserScript==


(function() {
    'use strict';
    let domain = 'https://degree.qingshuxuetang.com/'
    let url = location.href
    let host = location.host
    let isDegree = host.indexOf('degree') > -1
    if(!isDegree && url.indexOf('MyQingShu') > -1){
        showInfo('开始执行请稍后')
        setTimeout(function() {
            console.log('viewMap',viewMap)
            if(viewMap && viewMap.student && viewMap.student.data){
                window.location.href= viewMap.student.data[0].entrance
                return
            }
            showInfo('没有学校')
        }, 3000)
        return
    }
    if(!isDegree){
        console.log('不是degree页面')
        return
    }
    let symbol = null
    if(location.pathname.split('/').length >= 2){
        symbol = location.pathname.split('/')[1]
    }
    if(symbol == null){
        console.log('未找到学校')
        return
    }
    if(url.indexOf('Student/Home') > -1){
        showInfo('开始执行请稍后')
        window.location.href=`${domain}${symbol}/Student/Course/CourseList`
    }else if (url.indexOf('Course/CourseList') > -1) {
        showInfo('开始执行请稍后')
        setTimeout(function() {
            console.log('currentCourse',currentCourse)
            sessionStorage.setItem('courses',JSON.stringify(currentCourse))
            let course = getFitCourse();
            if(course){
                window.location.href=`${domain}${symbol}/Student/Course/CourseStudy?courseId=${course.courseId}&teachPlanId=${course.teachPlanId}&periodId=${course.periodId}`
                return
            }
            showInfo('没有可学习课程')
        }, 3000)
    }else if(url.indexOf('Course/CourseStudy') > -1){
        showInfo('开始执行请稍后')
         setTimeout(function() {
             console.log('coursewareMedias',coursewareMedias)
             var videos=[];
             getVideoNode(coursewareMedias,videos)
             console.log('videos',videos);
             let video = videos[0];
             let courseId = getQueryString('courseId');
             let teachPlanId = getQueryString('teachPlanId');
             let periodId = getQueryString('periodId');
             let videoMaps = {}
             videoMaps[courseId] = videos;
             sessionStorage.setItem('videos',JSON.stringify(videoMaps))
             window.location.href=`${domain}${symbol}/Student/Course/CourseShow?teachPlanId=${teachPlanId}&periodId=${periodId}&courseId=${courseId}&nodeId=${video.id}`
         }, 3000)
    }else if(url.indexOf('Course/CourseShow') > -1){
        showInfo('开始执行请稍后')
        let courseId = getQueryString('courseId');
        let nodeId = getQueryString('nodeId');
        let videoMaps = JSON.parse(sessionStorage.getItem('videos'))
        let teachPlanId = getQueryString('teachPlanId');
        let periodId = getQueryString('periodId');
        let nextVideo = getNextVideo(nodeId,videoMaps[courseId])
        setTimeout(function() {
          var video = document.getElementById("vjs_video_3_html5_api")
          //设置静音
          video.muted = true
          //视频倍速
          //video.playbackRate = 2
          //视频开始
          video.play()
          const nextUrl = `${domain}${symbol}/Student/Course/CourseShow?teachPlanId=${teachPlanId}&periodId=${periodId}&courseId=${courseId}&nodeId=${nextVideo}`
          if(video.duration < 300){
              if(nextVideo == null){
                  let courses = JSON.parse(sessionStorage.getItem('courses'))
                  let course = getNextCourse(courseId,courses)
                  if(course == null){
                      window.location.href='https://baidu.com'
                  }
                  window.location.href=`${domain}${symbol}/Student/Course/CourseStudy?courseId=${course.courseId}&teachPlanId=${course.teachPlanId}&periodId=${course.periodId}`
              }else{
                  location.replace(nextUrl);
              }
          }
          // 下一条视频
          video.addEventListener("ended",function(){
              if(nextVideo == null){
                  let courses = JSON.parse(sessionStorage.getItem('courses'))
                  let course = getNextCourse(courseId,courses)
                  if(course == null){
                      window.location.href='https://baidu.com'
                  }
                  window.location.href=`${domain}${symbol}/Student/Course/CourseStudy?courseId=${course.courseId}&teachPlanId=${course.teachPlanId}&periodId=${course.periodId}`
              }else{
                  location.replace(nextUrl);
              }
          })
        }, 5000)
        getVideoTime()

    }

    function getFitCourse(){
       for(let inx in currentCourse) {
           if(currentCourse[inx].score < 100){
               return currentCourse[inx]
           }
       }
       return null
    }

    function getNextVideo(current,videos){
        let next =null;
        Array.prototype.forEach.call(videos,function (value,index) {
            if(value.id === current && videos.length-1 > index+1){
               next = videos[index+1].id
                return false
            }
        })
        return next;
    }

    function getNextCourse(current,courses){
        let next =null;
        Array.prototype.forEach.call(courses,function (value,index) {
            if(value.courseId == current && courses.length-1 > index+1){
               next = courses[index+1]
                return false
            }
        })
        return next;
    }

    function getVideoNode(medias,videos){
       Array.prototype.forEach.call(medias,function (value,index) {
            if(value.type === 'video'){
                videos.push(value)
            }
            if(value.nodes !=null){
                getVideoNode(value.nodes,videos)
            }
        })
    }

    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    }

    let currentVideoTime =null;

    function getVideoTime() {
        setInterval(function () {
            var vid = document.getElementById("vjs_video_3_html5_api")
            var currentTime = vid.currentTime.toFixed(1);
            if(currentTime == currentVideoTime){
                console.log('视频卡住了，刷新~');
                location.reload()
            }
            currentVideoTime = currentTime;
            console.log('视频时间:', currentTime);
        }, 5000);
    }

    function showInfo(info){
        QingshuDialog.info(`【脚本信息】${info}`)
    }

})();