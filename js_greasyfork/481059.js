// ==UserScript==
// @name         正保会计网校（原中华会计网校）继续教育刷课
// @description  已破解API,无需答题,支持多开
// @version      0.3
// @author       ChenZihan
// @match        https://jxjy.chinaacc.com/courseware/*
// @exclude      https://jxjy.chinaacc.com/courseware/index
// @grant        none
// @license      Apache License, Version 2.0
// @namespace https://greasyfork.org/users/737513
// @downloadURL https://update.greasyfork.org/scripts/481059/%E6%AD%A3%E4%BF%9D%E4%BC%9A%E8%AE%A1%E7%BD%91%E6%A0%A1%EF%BC%88%E5%8E%9F%E4%B8%AD%E5%8D%8E%E4%BC%9A%E8%AE%A1%E7%BD%91%E6%A0%A1%EF%BC%89%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/481059/%E6%AD%A3%E4%BF%9D%E4%BC%9A%E8%AE%A1%E7%BD%91%E6%A0%A1%EF%BC%88%E5%8E%9F%E4%B8%AD%E5%8D%8E%E4%BC%9A%E8%AE%A1%E7%BD%91%E6%A0%A1%EF%BC%89%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==
(function () {
    'use strict';

    async function getServerTime(url) {
        var result;
        await $.ajax({
            url: url, type: 'post', success: (res) => {
                result = res
            }
        })
        return result;
    }
    async function postMD5(innerTime, serverOffsetTime) {

        const videoModel = require('h5/videoModel');
        const videoCtrl = require('h5/videoCtrl');
        const stats = require('h5/h5StatApi');
        const vEvents = require('h5/h5EventApi');
        const md5 = require('h5/md5');

        // Properties
        var videoID = videoModel.getVideoInfo().videoRefID;
        var userID = videoModel.getPlayStatus().userID;
        var studyID = videoModel.getVideoInfo().studyID;
        var courseID = videoModel.getVideoInfo().courseID;
        var playTime = stats.getCurrentTime();
        var postTimeKey = videoModel.getPlayerOpts().postTimeKey;

        // Urls
        var basePath = videoModel.getInterfaces().BASE_PATH;
        var postDataUrl = videoModel.getInterfaces().POST_TIMING_DATA_URL;
        var getSysTimeUrl = videoModel.getInterfaces().getServerTimeUrl;
        var sysTimeUrl = basePath + getSysTimeUrl;

        // Get server time
        var serverTime;
        await getServerTime(sysTimeUrl).then(res => {
            serverTime = res - serverOffsetTime
        });
        var hs = parseInt(serverTime)

        // console.log("videoID", videoID)
        // console.log("playTime", playTime)
        // console.log(videoID, userID, studyID, courseID, playTime, postTimeKey)
        // console.log("postTimeKey: ", postTimeKey)
        // console.log("hs: ", hs)

        // Concat
        var keyStr = videoID.toString() + playTime.toString() + innerTime.toString() + postTimeKey + hs;
        // Get hex MD5
        var keyMd5Str = hex_md5(keyStr);
        // console.log("Final:", keyStr, keyMd5Str)

        $.ajax({
            url: basePath + postDataUrl,
            dataType: 'json', async: true, type: 'post',
            data: {
                videoID: videoID,
                studyID: studyID,
                userID: userID,
                courseID: courseID,
                key: keyMd5Str,
                hs: hs,
                playTime: playTime,
                innerTime: innerTime,
                isEnded: 0
            },
            success: (result) => { console.log("Success: ", result); },
            error: (result) => { console.log("Failed: ", result); }
        })
    }


    function secMin(totalSeconds) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        function padTo2Digits(num) {
            return num.toString().padStart(2, '0');
        }
        const result = `${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
        return result;
    }

    function getVideoTime(videoTime) {
        var total = Number(videoTime.split(':')[0]) * 60 + Number(videoTime.split(':')[1])
        return total
    }

    var times = 0;
    var videoTotalSeconds = null;
    function studySchedule(innerTime, serverOffsetTime, leftTime) {

        if (leftTime != null && leftTime != '') { videoTotalSeconds = getVideoTime(leftTime); }
        else {
            console.log(`❗️等待获取总时长`);
            if (document.getElementsByClassName("vplay vmPlay").length != 0) {
                document.getElementsByClassName("vplay vmPlay")[0].click()
            }
            var iterval = setInterval(() => {
                var videoTime = document.getElementsByClassName("timeNum")[0].innerHTML.split('/')[1]
                videoTotalSeconds = getVideoTime(videoTime)
                leftTime = videoTime
                if (videoTotalSeconds != 0) {
                    clearInterval(iterval);
                    startSchedule();
                    if (document.getElementsByClassName("vplay vmPause").length != 0) {
                        document.getElementsByClassName("vplay vmPause")[0].click()
                    }
                }
            }, 100);
        }

        function startSchedule() {
            console.log(`✅已配置Schedule ${leftTime}后切换至下一个视频`);
            var schedule = setInterval(() => {
                console.log("-----------------------------");
                times++;
                var totalSeconds = times * innerTime;
                postMD5(innerTime, serverOffsetTime);
                console.log(`🔴第${times}次添加学习时长👀 ${totalSeconds}/${videoTotalSeconds}`);
                console.log(`总添加时长: ${secMin(totalSeconds)}`);
                console.log("-----------------------------");

                if (document.getElementsByClassName("vplay vmPause").length != 0) {
                    document.getElementsByClassName("vplay vmPause")[0].click()
                }

                if (totalSeconds > videoTotalSeconds && videoTotalSeconds != 0) {
                    // console.log("❗️已停止添加学习时长");
                    // clearInterval(schedule);
                    // location.reload();
                    console.log("❗️时长添加完毕，3秒后切换至下一个视频");
                    setTimeout(() => {
                        document.getElementsByClassName("vmFront")[0].click()
                    }, 3000);
                }
            }, innerTime * 1000 - 5000);
        }
    }

    console.log(`💿等待页面加载完成`);
    setTimeout(() => {
        studySchedule(20, 1000, "")
    }, 3000);

})();

