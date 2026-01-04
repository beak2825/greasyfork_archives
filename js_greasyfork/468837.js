// ==UserScript==
// @name         绍兴市继续教育
// @namespace    http://tampermonkey.net/
// @version      2.0.1
// @description  绍兴市专业技术人员继续教育，自动播放下一个，弹窗屏蔽，允许拖动
// @author       xiajie
// @match        http://220.191.224.159/*
// @match        http://jxjy.rsj.sx.gov.cn:81/*
// @icon         http://220.191.224.159/*favicon.ico
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/468837/%E7%BB%8D%E5%85%B4%E5%B8%82%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/468837/%E7%BB%8D%E5%85%B4%E5%B8%82%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    if(window.location.pathname == '/elms/web/viewScormCourse.action' || window.location.pathname == '/elms/web/viewAiccCourse.action'){
        console.log('进入课程详情');
        window.setInterval(function() {
            console.log('学习进度：'+Progress_Arr[Curr_Index]);
            var index = 0;
            for (let key in Progress_Arr) {
                if(key == Curr_Index){
                    index++;
                    console.log(index);
                    break;
                }
                index++;
            }
            if (Progress_Arr[Curr_Index] == 100 && Progress_Arr.length > index) {
                $('.chapter-list ul li').eq(index).find('a')[0].click();
            }
        },5000)

    }
    if(window.location.pathname == '/course/courseware/guochen-player-sx/index.htm'){
        console.log('进入视频播放1');
    }
    if(window.location.pathname == '/course/courseware/guochen-player-sx/content.htm'){
        console.log('进入视频播放2');
        setTimeout(function(){
            console.log(jwplayer("container").getState().toLowerCase());
            //禁音
            jwplayer("container").setMute(true);
            if (jwplayer("container").getState().toLowerCase() == "paused") {
                console.log('立即播放');
                jwplayer("container").play(true);
            }
        },3000)
        setInterval(function(){
            if (jwplayer("container").getState().toLowerCase() != "playing") {
                console.log('恢复播放');
                jwplayer("container").play(true);
            }
        },10000)
        window.focusIntervalNew = function(){
        }
        window.focusIntervalOld = function(){
        }
        window.onTime = function(e) {
            var position = e.position;
            var duration = e.duration;
            var tempLessonProgress = 0;
            var lessonStatus = "i";

            secondIndex++;

            //scorm:设置单个节点location、状态，课件的进度
            //设置完成状态,增强容错性,还剩10秒时进度设为c
            if ((duration - position) < 10) {
                lessonStatus = "c";
                //更新菜单中的状态图标
                if (g_showStatus) {
                    menuContent.$("#statusImg_" + sectionIndex).attr("src",statusImgArr[2]);
                }
            }

            //设置书签
            lessonLocation = position;
            oldLessonLocation = position;
            if (lessonLocation > maxLessonLocation) {
                maxLessonLocation = position;
            }
            p_scormObj.lessonLocation = lessonLocation + "|" + maxLessonLocation;
            p_scormObj.updateLocation();

            /******计算进度开始*******/
            var videoCount = p_courseObj.playItemListArray.length;
            //只有一个视频,按照当前时间点/视频总时长计算进度
            videoCount = 1;
            if (videoCount == 1) {
                if (Math.floor(position) == Math.floor(duration)) {	//防止进度为99%的情况发生(因为监听器最后一次执行时可能视频还未播放完成)
                    tempLessonProgress = 100;
                } else {
                    tempLessonProgress = Math.floor(position*100/duration);
                    if (tempLessonProgress > 100) {
                        tempLessonProgress = 100;
                    }
                }
                if (oldLessonProgress == 0) {
                    oldLessonProgress = tempLessonProgress;
                    lessonProgress = tempLessonProgress;
                } else {
                    if (tempLessonProgress > oldLessonProgress) {
                        oldLessonProgress = tempLessonProgress;
                        lessonProgress = tempLessonProgress;
                    }
                }

                //增强容错性,还剩10秒时进度设为100
                if ((duration - position) < 10) {
                    lessonProgress = 100;
                }
                //设置完成状态
                p_scormObj.lessonProgressForSingle = lessonProgress;
                if (secondIndex%40 ==0) {
                    p_scormObj.updateProgress();
                }
            }
            //每一分钟提交一次
            if (secondIndex%120 == 0) {
                p_scormObj.commit();
            }

            var tmp1 = document.getElementById("time");
            if (tmp1) {
                tmp1.innerHTML = "current time: " + position +
                    "<br>total time: " + duration +
                    "<br>progress: " + lessonProgress +
                    "<br>lessonLocation: " + lessonLocation;
            }
        }
    }
    if(window.location.pathname.indexOf('/play/player.htm') != -1){
        console.log('进入视频播放2');
        setTimeout(function(){
            console.log(jwplayer("container").getState().toLowerCase());
            //禁音
            jwplayer("container").setMute(true);
            if (jwplayer("container").getState().toLowerCase() == "paused") {
                console.log('立即播放');
                jwplayer("container").play(true);
            }
        },3000)
        setInterval(function(){
            if (jwplayer("container").getState().toLowerCase() != "playing") {
                console.log('恢复播放');
                jwplayer("container").play(true);
            }
        },10000)
        window.focusIntervalNew = function(){
        }
        window.focusIntervalOld = function(){
        }
        window.onTime = function(e) {
            var position = e.position;
            var duration = e.duration;
            var tempLessonProgress = 0;
            var lessonStatus = "i";

            secondIndex++;

            //监听每隔0.25秒执行，加入此处逻辑延长为每隔1秒执行下面的逻辑
            if (secondIndex%4 !=0)
            {
                return;
            } else {
                //alert("onTime:" + "current position:" + position);
            }

            //计算进度
            if (duration != 0) {
                if (Math.floor(position) == Math.floor(duration)) {	//防止进度为99%的情况发生(因为监听器最后一次执行时可能视频还未播放完成)
                    tempLessonProgress = 100;
                } else {
                    tempLessonProgress = Math.floor(position*100/duration);
                    if (tempLessonProgress > 100) {
                        tempLessonProgress = 100;
                    }
                }
                if (oldLessonProgress == 0) {
                    oldLessonProgress = tempLessonProgress;
                    lessonProgress = tempLessonProgress;
                } else {
                    if (tempLessonProgress > oldLessonProgress) {
                        oldLessonProgress = tempLessonProgress;
                        lessonProgress = tempLessonProgress;
                    }
                }
            }

            //增强容错性,还剩10秒时进度设为100
            if ((duration - position) < 10) {
                lessonProgress = 100;
            }
            //设置完成状态
            if (lessonProgress == 100) {
                lessonStatus = "c";
            }

            //设置书签
            lessonLocation = position;
            oldLessonLocation = position;
            if (lessonLocation > maxLessonLocation) {
                maxLessonLocation = position;
            }

            var tmp = document.getElementById("time");
            if (tmp) {
                tmp.innerHTML = "secondIndex:" + secondIndex + "&current time: " + position +
                    "&total time: " + duration +
                    "&progress: " + lessonProgress +
                    "&lessonLocation: " + lessonLocation +
                    "&position: " +  jwplayer("container").getPosition() +
                    "&oldPosition: " + oldPosition +
                    "&state: " + jwplayer("container").getState().toLowerCase() +
                    "&testIndex: " + testIndex;
            }
        }
    }
})();