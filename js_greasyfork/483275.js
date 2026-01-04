// ==UserScript==
// @name         石家庄财经职业学院-继续教育
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  视频自动播放，快速完成
// @author       xiajie
// @match        http://edu.netdig.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=netdig.cn
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/483275/%E7%9F%B3%E5%AE%B6%E5%BA%84%E8%B4%A2%E7%BB%8F%E8%81%8C%E4%B8%9A%E5%AD%A6%E9%99%A2-%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/483275/%E7%9F%B3%E5%AE%B6%E5%BA%84%E8%B4%A2%E7%BB%8F%E8%81%8C%E4%B8%9A%E5%AD%A6%E9%99%A2-%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var courseId = parseInt($('course-keshi').attr('course-id'));
    //var periodId = parseInt($('course-keshi').attr('current'));
    var time2 = parseInt($('video')[0].duration);
    var time1 = time2;

    setTimeout(function(){
        addhtml();
    },3000)

    function addhtml(){
        var html = "<a id='learnText' style='background:red; margin-left:50px;color:#fff;font-size:16px;padding:5px;cursor:pointer;' onclick='learnCourse()'>立即学习</a>"
        $('.player-header__text').append(html);
    }

    window.learnCourse = function(){
        $('#learnText').text('学习中')
        var len = $('.ks-catalog .ks-catalog-period').length;
        for(let i=0;i<len;i++){
            setTimeout(function () {
                var obj = $('.ks-catalog .ks-catalog-period').eq(i);
                var title = obj.find('.ks-catalog-title__periodname').text();
                var periodId = obj.find('.ks-button').data('periodid');
                var progress = obj.find('.ks-catalog-title').attr('title');
                var time = time_to_sec(obj.find('.ks-catalog-title__time').text().trim());
                //console.log(progress);
                //console.log(time);
                //未学完
                if(progress.indexOf('100') == -1){
                    console.log(title);
                    //console.log(courseId,periodId,time,time);
                    learnCourse(courseId,periodId,time,time)
                }
                if(i+1 == len){
                    console.log("学习完成");
                    $('#learnText').text('学习完成');
                }
            },1500*i);//学习频率

        }
    }

    function learnCourse(courseID,periodID,time,totaltime){
        var costype = 1;
        var savetodb = 1;
        KS_Utils.getUserAppToken(function(apptoken){
            if(!apptoken){
                return
            }
            $.ajax({
                type: "get",
                url:
                "/webapi/course/SaveLearnProgress?apptoken="+apptoken+"&courseid=" +
                courseID +
                "&pid=" +
                periodID +
                "&costype=" + costype +
                "&time=" + time +
                "&totaltime=" + totaltime +
                "&savetodb=" +
                savetodb,
                async:false,
                success: function(res) {
                    console.log(res)
                }
            });
        })
    }

    function time_to_sec(time) {
        var s = '';
        var hour = 0;
        var min = 0;
        var sec= 0;
        if(time.split(':').length == 1){
            sec = time.split(':')[0];
        }
        if(time.split(':').length == 2){
            min = time.split(':')[0];
            sec = time.split(':')[1];
        }
        if(time.split(':').length == 3){
            hour = time.split(':')[0];
            min = time.split(':')[1];
            sec = time.split(':')[2];
        }

        s = Number(hour*3600) + Number(min*60) + Number(sec);

        return s;
    };

})();