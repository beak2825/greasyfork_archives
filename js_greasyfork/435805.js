// ==UserScript==
// @name         我的京训钉自动播放
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  www.bjjnts.cn auto play next video
// @author       hezhengang
// @match        https://www.bjjnts.cn/study/video*
// @icon         https://avatar.csdnimg.cn/B/8/D/3_myqqgame_1566452584.jpg
// @grant        none
// @license       myself
// @include      *://*.bjjnts.cn/*
// @downloadURL https://update.greasyfork.org/scripts/435805/%E6%88%91%E7%9A%84%E4%BA%AC%E8%AE%AD%E9%92%89%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/435805/%E6%88%91%E7%9A%84%E4%BA%AC%E8%AE%AD%E9%92%89%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var AOP = {
        hostUrl: "https://www.bjjnts.cn",
        un_finish_list:[],
        isPlay:false,
        init: function(){
            console.log("init页面加载完毕");
            this.checkPlay();
        },
        goToNext:function(){
            console.log("未完成的课程", this.un_finish_list.length);
            if (this.un_finish_list.length >0){
                var nextURL = this.un_finish_list[0].urlAdress; //获取未播放的列表的下一个地址
                console.log("goToNext",nextURL);
                window.location.href = nextURL;
            }
        },
        checkPlay:function(){
            var that = this;
            var checkTimer = window.setInterval(function(){
                if (that.un_finish_list.length == 0 ){
                    that.autoPalyVideo(); //重新执行代码
                }else{
                    window.clearInterval(checkTimer);
                }
            },3000);

            window.setInterval(function(){
                var btnGoOn = document.getElementsByClassName("ant-btn-primary");
                if(btnGoOn && btnGoOn.length>0){
                    btnGoOn[0].click();
                }
            },5000);
        },
        goToPlay:function(){
            var that = this;
            if(this.isPlay){
                console.log("播放开始了.......");
                return false;
            }
            var playBtn = document.getElementsByClassName("prism-big-play-btn");
            if(playBtn && playBtn.length>0){
                //播放按钮
                playBtn[0].click();
                var videoTag = document.getElementById("J_prismPlayer").childNodes[0];
                videoTag.addEventListener('play',function(){
                    console.log('视频开始播放*****');
                    that.isPlay = true;
                });
                videoTag.addEventListener('ended', function () {
                    console.log('视频已经播放完成');
                    that.goToNext();
                }, false);
            }
        },
        getUrlKey:function(url){
            var newUrlKey={};
            if(url.indexOf("?") != -1){
                var params ={};
                var urlAddress = url.split("?");
                var datas = urlAddress[1].split("&");
                for (var i=0;i<datas.length;i++) {
                    var pair = datas[i].split("=");
                    params[pair[0]] = pair[1];
                }
                var classId = params.class_id,courseId = params.course_id,unitId = params.unit_id;
                var uniqueKey = classId+"_"+courseId+"_"+unitId;
                var newUrl = urlAddress[0]+"?class_id="+classId+"&course_id="+courseId+"&unit_id="+unitId
                newUrlKey = {  urlKey: uniqueKey, urlAdress: newUrl};
            }
            return newUrlKey;
        },
        getTimeStr:function(){
            return new Date().getTime();
        },
        autoPalyVideo:function(){
            var all_course = {},that = this;
            var course_list = document.getElementsByClassName("units_wrap_box___1ncip") ||[];
            console.log("获取课程=", course_list.length);
            if (course_list.length>0){
                for (var index = 0; index<course_list.length;index++){
                    var linkTag = course_list[index];
                    var hrefRecord = this.getUrlKey(linkTag.href),urlKey = hrefRecord.urlKey;
                    var spanTag = linkTag.querySelector(".study_success_svg___jPGAq");
                    if (spanTag) {
                        console.log("**********************");
                        hrefRecord.isPlayEnd = true;
                    } else {
                        hrefRecord.isPlayEnd = false;
                        that.un_finish_list.push(hrefRecord);
                    }
                    all_course[urlKey] =  hrefRecord;
                };
            }
            var currentUrlKey = this.getUrlKey(window.location.href).urlKey;
            console.log("未播放的课程",this.un_finish_list);
            var current_course = all_course[currentUrlKey];
            if(!current_course){
                console.error("没有匹配课程");
                return ;
            }
            var play_status = current_course.isPlayEnd;
            console.log("当前视频的播放状态", play_status);
            if (!play_status) {
                console.log("goToPlay",currentUrlKey);
                that.goToPlay();
            } else {
                that.goToNext();
            }
        }
    };
    AOP.init();
})();