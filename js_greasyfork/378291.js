// ==UserScript==
// @name         ZSH网络远程教育脚本
// @namespace    http://tampermonkey.net/
// @version      0.3.4
// @description  没什么可说的，就是幸福你我他
// @author       Wangshengsheng
// @match        *://sia.sinopec.com/secure/player/coursevideo.html?courseId=*&contrUrl=https://sia.sinopec.com*
// @match        *://*.*.learning.sinopec.com/secure/player/coursevideo.html?courseId=*&contrUrl=https://sia.sinopec.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378291/ZSH%E7%BD%91%E7%BB%9C%E8%BF%9C%E7%A8%8B%E6%95%99%E8%82%B2%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/378291/ZSH%E7%BD%91%E7%BB%9C%E8%BF%9C%E7%A8%8B%E6%95%99%E8%82%B2%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';
    alert("脚本已生效");


    $("#totalSaveBtn").after("<li id='wssBtn' style='background:#F00; color:#FFF'>一键立马学完本课</li>");
    var wssBtn = $("#wssBtn");
    wssBtn.on("click", function test() {
        alert("点击继续");
        loadChapterUnitTreeForWSS(courseId);
        // testInit( courseId ) ;
        alert("执行结束");
    });


    //格式化时间格式
    function dateFtt(fmt, date) { //author: meizz
        var o = {
            "M+": date.getMonth() + 1,     //月份
            "d+": date.getDate(),     //日
            "h+": date.getHours(),     //小时
            "m+": date.getMinutes(),     //分
            "s+": date.getSeconds(),     //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds()    //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }


    //按照该章节的多少来设置学习时长，避免章节很多若设置起始时长过大则导致数据库报错的情况
    function changeStartTimeTo(unitsLength) {
        var beishu = 8;
        if (unitsLength > 10) {
            beishu = 2;
        } else {
            beishu = 8;
        }

        var tWss = new Date();
        tWss.setTime(tWss.getTime() - 1000 * 60*60*beishu );
        var tFormatted = dateFtt("yyyy-MM-dd hh:mm:ss", tWss);
        startTime = tFormatted;
        //     alert("startTime:"+startTime +"    执行");
        console.info("startTime:" + startTime + "    执行");

        return startTime;
    }


    function testInit(courseId) {
        //第一章课时17:威尔逊法则：身教重于言教  cwId:551614166 第1小节:威尔逊法则 initCwcId：700036973
        var startTimeNew = changeStartTimeTo(5);
        startTime = startTimeNew;
        stuStatus = 3;

        updateLastStudy(courseId, 551614161  );

        initPlayerInfo(551614161 ) ;

        sendLessonTrajectory(551614161 , "attempted");

        initMp4Player(551614161 );

        saveLearningRecord(551614161 , 700036968,700036968, 'init');

        saveLearningRecord(551614154, 700036968,700036968, 'save');



    }



    //获取本课程里面的所有章节的cwId
    function loadChapterUnitTreeForWSS(courseId) {
        console.info("课程ID courseId:" + courseId);

        var firstCwId = "0";
        var theChanged = 'N';
        var formData = {};
        formData.courseId = courseId;
        formData.isIssue = 1;

        $.ajax({
            type: "POST",
            url: $cc_url + "/chapterUnitController/loadChapterUnitTreeForVideo.do",
            dataType: 'json',
            data: formData,
            xhrFields: {
                withCredentials: true
            },
            //允许跨域
            crossDomain: true,
            success: function (data, status) {
                //   console.info("status:"+status);
                //   console.info("data:"+JSON.stringify(data));   //已验证，可得到data
                //    var dataNew = JSON.stringify(data) ;

                var chapterListArr = data.responseData.chapterList;
                //console.info("chapterListArr:"+   JSON.stringify(  chapterListArr ));

                //获取章的Unit集合
                var unitsWSS = chapterListArr[0].units;
                // console.info("units:"+   JSON.stringify(  unitsWSS ));
                //  console.info("length:"+   JSON.stringify(  unitsWSS.length  ));

                //创建修改后需要存入数据库的时间
                var startTimeNew = changeStartTimeTo(unitsWSS.length);
                startTime = startTimeNew;

                //循环每一章
                $.each(unitsWSS, function (index, unit) {

                    var $cwIdTemp = unit.objectId;
                    //   alert( "index:"+index+"$cwId:"+$cwIdTemp );
                    var chapteNameWSS = unit.chapteName;

                    //获取每一章下面的每一节
                    $.ajax({
                        type: "post",
                        url: $cc_url + "/playerController/initChapterTree.do",
                        dataType: "json",
                        data: {'cwId': $cwIdTemp},
                        success: function (result) {
                            console.info("result:" + JSON.stringify(result));

                            var nodeArr = result.responseData;

                            //循环每一章下面的小节
                            $.each(nodeArr, function (i, item) {


                                updateLastStudy(courseId, $cwIdTemp  );

                                initPlayerInfo($cwIdTemp ) ;

                                sendLessonTrajectory($cwIdTemp , "attempted");

                                initMp4Player($cwIdTemp );

                                saveLearningRecord($cwIdTemp , item.id,item.id, 'init');
                                alert("学完第"+(i+1)+"小节");
                                saveLearningRecord($cwIdTemp, item.id,item.id, 'save');


                                /*
                                console.info("  initPlayerInfoForWSS($cwIdTemp)==>"+$cwIdTemp);
                                initPlayerInfoForWSS($cwIdTemp);
                                alert("stuStatus1:"+stuStatus) ;
                                console.info(" $cwIdTemp, item.id, item.id, 'init'==>"+$cwIdTemp +","+item.id+","+ item.id) ;
                                saveLearningRecord($cwIdTemp, item.id, item.id, 'init');
                                alert("stuStatus2:"+stuStatus) ;
                                saveLearningRecord($cwIdTemp, item.id, item.id, 'save');
                                */


                                //   saveLearningRecord($cwIdTemp, item.id, item.id, 'save');
                                console.info("第一章课时" + (index + 1) + ":" + chapteNameWSS + "  cwId:" + $cwIdTemp + " 第" + (i + 1) + "小节:" + item.title + " initCwcId：" + item.id);

                            });


                        }
                    });


                });


            }
        });
    }


    function initPlayerInfoForWSS(cwId_) {
        var data_ = {};
        data_.cwId = cwId_;
        $.ajax({
            type: "POST",
            url: $cc_url + "/playerController/initPlayerPage.do",
            data: data_,
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            //允许跨域
            crossDomain: true,
            success: function (result) {
                //   var Data = result.responseData;
                //   startTime = Data.initStartTime;

                //发送行为轨迹 - 开始学习
                sendLessonTrajectory(cwId_, "attempted");
                console.info("sendLessonTrajectory(cwId_, attempted);"+  cwId_  ) ;
                // cwType（1：标准课件；2：非标课件）
                // 初始化Mp4课件所需信息
                initMp4Player(cwId_);

            }
        });
    }

    //获取每章节的规定时长（暂无用）
    window.setTimeout(function () {
        var $time = $('.vjs-remaining-time-display').text();
        //   alert($time ) ;
    }, 3000);

})();

