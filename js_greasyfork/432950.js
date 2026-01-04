// ==UserScript==
// @name     公需科目快速学习（21tb）
// @author   moxiaoying
// @version  0.1
// @require  https://cdn.bootcdn.net/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant    none
// @match    http*://*.21tb.com/els/html/courseStudyItem/courseStudyItem.learn.do?*
// @namespace https://greasyfork.org/zh-CN/users/241535-moxiaoying
// @description 二、三分屏，在线制作 三类课程加速学习
// @original-script https://greasyfork.org/zh-CN/scripts/418655-autofinishlearn
// @original-author Wei Yingchang
// @downloadURL https://update.greasyfork.org/scripts/432950/%E5%85%AC%E9%9C%80%E7%A7%91%E7%9B%AE%E5%BF%AB%E9%80%9F%E5%AD%A6%E4%B9%A0%EF%BC%8821tb%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/432950/%E5%85%AC%E9%9C%80%E7%A7%91%E7%9B%AE%E5%BF%AB%E9%80%9F%E5%AD%A6%E4%B9%A0%EF%BC%8821tb%EF%BC%89.meta.js
// ==/UserScript==

var uri;// = decodeURIComponent($("#aliPlayerFrame")[0].src);
var uriInfo;// = uri.split("/")[5].split("&");

var courseId;// = uriInfo[0];
var sourceId;// = uriInfo[2];
var providerCorpCode;// = uriInfo[1];

var chapterList;
var studyMap = new Map();

var updatePostDate;
var errorMsg = "";
const base_url = `https://cqrl.21tb.com`;

var updateCourseRecord = function (updatePostDate) {
    //uri = "http://bbg.21tb.com/tbc-rms/record/updateCourseRecord";
    console.log("updatePostDate:"+updatePostDate);
    $.ajax({
        type: "POST",
        url: `${base_url}/tbc-rms/record/updateCourseRecord`,
        data: updatePostDate,
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (d) {
            console.log("updateCourseRecord back:");
            console.log(d);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            let start = 0;
            errorMsg = 'jqXHR:' + window.JSON.stringify(jqXHR)
            errorMsg += ',textStatus:' + window.JSON.stringify(textStatus)
            errorMsg += ',errorThrown:' + window.JSON.stringify(errorThrown)
            errorMsg += ',navigator.onLine:' + navigator.onLine
            console.error(errorMsg);
        }
    })
}

var postdataPlay;
//console.log(postdataPlay);
var getStudyRecordList = function () {
    console.log("getStudyRecordList post date:" + postdataPlay);
    $.ajax({
        type: "POST",
        url: `${base_url}/tbc-rms/record/getStudyRecordList`,
        data: postdataPlay,
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (d) {
            console.log("getStudyRecordList back:");
            console.log(d.bizResult);
            let allStudyFinish = 1;
            for (let i = 0; i < d.bizResult.length; ++i) {
                let recordId = d.bizResult[i].recordId;
                console.log("recordId:"+recordId);
                let chapterId = d.bizResult[i].chapterId;
                let resourceId = d.bizResult[i].resourceId;
                let timeToFinish = d.bizResult[i].timeToFinish;
                let currentPosition = d.bizResult[i].timeToFinish;
                let currentStudyTime = Math.round(parseInt(d.bizResult[i].timeToFinish)/2);
                console.log("currentStudyTime|" + d.bizResult[i].timeToFinish + "|" + parseInt(d.bizResult[i].timeToFinish) + "|" + parseInt(d.bizResult[i].timeToFinish)/2 + "|" + Math.round(parseInt(d.bizResult[i].timeToFinish)/2));
                studyMap.set(chapterId, 1);
                updatePostDate = "{\"current_app_id\":\"\",\"recordId\": \"" + recordId + "\",\"courseId\": \"" + courseId + "\",\"sourceId\": \"" + sourceId + "\",\"providerCorpCode\": \"" + providerCorpCode + "\",\"chapterId\": \"" + chapterId + "\",\"resourceId\": \"" + resourceId + "\",\"timeToFinish\": " + timeToFinish + ",\"currentPosition\": " + currentPosition + ",\"type\": \"video\",\"currentStudyTime\": " + currentStudyTime + ",\"pageIndex\": 0}"
                console.log(updatePostDate);
                if (d.bizResult[i].confirmFinish != 1) {
                    allStudyFinish = 0;
                    updateCourseRecord(updatePostDate);
                }
            }
            if (allStudyFinish == 1) {
                console.log("all study finished!");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            let start = 0;
            errorMsg = 'jqXHR:' + window.JSON.stringify(jqXHR)
            errorMsg += ',textStatus:' + window.JSON.stringify(textStatus)
            errorMsg += ',errorThrown:' + window.JSON.stringify(errorThrown)
            errorMsg += ',navigator.onLine:' + navigator.onLine
            console.error(errorMsg);
        }
    })
}
//getStudyRecordList();

var showStudyRecordList = function () {
    console.log("getStudyRecordList post date:" + postdataPlay);
    $.ajax({
        type: "POST",
        url: `${base_url}/tbc-rms/record/getStudyRecordList`,
        data: postdataPlay,
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (d) {
            console.log("showStudyRecordList back:");
            console.log(d.bizResult);
            let allStudyFinish = 1;
            let unstudycount = 0;
            for (let i = 0; i < d.bizResult.length; ++i) {
                let recordId = d.bizResult[i].recordId;
                let chapterId = d.bizResult[i].chapterId;
                let resourceId = d.bizResult[i].resourceId;
                let timeToFinish = d.bizResult[i].timeToFinish;
                let currentPosition = d.bizResult[i].timeToFinish;
                studyMap.set(chapterId, 1);
                updatePostDate = "{\"current_app_id\":\"\",\"recordId\": \"" + recordId + "\",\"courseId\": \"" + courseId + "\",\"sourceId\": \"" + sourceId + "\",\"providerCorpCode\": \"" + providerCorpCode + "\",\"chapterId\": \"" + chapterId + "\",\"resourceId\": \"" + resourceId + "\",\"timeToFinish\": " + timeToFinish + ",\"currentPosition\": " + currentPosition + ",\"type\": \"video\",\"currentStudyTime\": 0,\"pageIndex\": 0}"
                console.log(updatePostDate);
                if (d.bizResult[i].confirmFinish != 1) {
                    allStudyFinish = 0;
                    d.bizResult[i];
                    unstudycount++;
                }
            }
            if (allStudyFinish == 1) {
                console.log("all study finished!");
                errorMsg= "";
            }else {
                errorMsg = "还有" + unstudycount + "部分内容尚未学习";
                console.log(errorMsg);
                $("#autoFinised")[0].innerText = errorMsg;
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            let start = 0;
            errorMsg = 'jqXHR:' + window.JSON.stringify(jqXHR)
            errorMsg += ',textStatus:' + window.JSON.stringify(textStatus)
            errorMsg += ',errorThrown:' + window.JSON.stringify(errorThrown)
            errorMsg += ',navigator.onLine:' + navigator.onLine
            console.error(errorMsg);
        }
    })
}
//showStudyRecordList();

var showCourseChapter = function () {
    $.ajax({
        type: "POST",
        url: `${base_url}/tbc-rms/course/showCourseChapter`,
        data: "{\"current_app_id\":\"\",\"courseId\":\"" + sourceId + "\",\"providerCorpCode\":\"" + providerCorpCode + "\"}",
        contentType: "application/json; charset=UTF-8",
        async: false,
        success: function (d) {
            console.log("showCourseChapter back:");
            console.log(d);
            chapterList = d.bizResult;
            for (let i = 0; i < chapterList.length; ++i) {
                let chapterId = chapterList[i].chapterId;
                for (let j = 0; j < chapterList[i].resourceDTOS.length; ++j) {
                    let resourceId = chapterList[i].resourceDTOS[j].resourceId;
                    let timeToFinish = chapterList[i].resourceDTOS[j].playTime;
                    if (studyMap.get(resourceId) === undefined) {
                        let updatePostDate = "{\"current_app_id\":null,\"recordId\":null,\"courseId\":\"" + courseId + "\",\"sourceId\":\"" + sourceId + "\",\"providerCorpCode\":\"" + providerCorpCode + "\",\"chapterId\":\"" + chapterId + "\",\"resourceId\":\"" + resourceId + "\",\"timeToFinish\":" + timeToFinish + ",\"currentPosition\":20,\"type\": \"video\",\"currentStudyTime\": 0,\"pageIndex\": 0}";
                        updateCourseRecord(updatePostDate);
                    }
                }
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            let start = 0;
            errorMsg = 'jqXHR:' + window.JSON.stringify(jqXHR)
            errorMsg += ',textStatus:' + window.JSON.stringify(textStatus)
            errorMsg += ',errorThrown:' + window.JSON.stringify(errorThrown)
            errorMsg += ',navigator.onLine:' + navigator.onLine
            console.error(errorMsg);
        }
    })
}
//showCourseChapter();

var initVars = function () {
    if ($("#aliPlayerFrame").length == 0) {
        $("#autoFinised")[0].innerText = "非在线学习课程";
        // $("#autoFinised")[0].disabled=true;
        return false;
    }
    uri = decodeURIComponent($("#aliPlayerFrame")[0].src);
    uriInfo = uri.split("/")[5].split("&");

    courseId = uriInfo[0];
    sourceId = uriInfo[2];
    providerCorpCode = uriInfo[1];

    postdataPlay = "{\"current_app_id\":\"\",\"courseId\":\"" + courseId + "\",\"sourceId\":\"" + sourceId + "\",\"providerCorpCode\":\"" + providerCorpCode + "\"}"
    return true;
}

var sendSelectCount = function (level, playTime, scoId) {
    try {
        // var unsafeWindow;
        var CONFIG;
        var info;
        var fromNetWorkSetting;

        if (typeof (unsafeWindow) === "undefined") {
            // var unsafeWindow = window.wrappedJSObject;
            // unsafeWindow = window.wrappedJSObject;
            CONFIG = window.CONFIG;
            info = window.info;
            fromNetWorkSetting = window.fromNetWorkSetting;
        } else {
            // unsafeWindow = window;
            CONFIG = unsafeWindow.CONFIG;
            info = unsafeWindow.info;
            fromNetWorkSetting = unsafeWindow.fromNetWorkSetting;
        }

        var sourceUrl = "html/courseStudyItem/courseStudyItem.selectResource.do";
        var vbox_server = "http://21tb-video.21tb.com";

        if (typeof (info) === "undefined") {
            window.clearInterval(interval);
            console.log("不是，二分屏，三分屏课程");
            $("#autoFinised1")[0].innerText = "非二、三分屏课程";
            $("#autoFinised1")[0].disabled = true;
            return;
        }
        var postdata = "scoId=" + scoId + "&courseId=" + info.courseId
        + "&firstLoad=" + (level == 0 ? "true" : "false")
        + "&location=" + playTime;
        var uri = CONFIG.ctx + sourceUrl + "?host=" + CONFIG.hostDomain + "&vbox_server=" + (level == 0 ? vbox_server : "") + "&fromNetWorkSetting=" + fromNetWorkSetting + "&chooseHttp=" + document.location.protocol + "&courseType=NEW_COURSE_CENTER" + "&eln_session_id=" + CONFIG.elnSessionId;
        console.log(uri);
        console.log(postdata);
        $.ajax({
            type: "POST",
            url: uri, //获取课程资源信息
            data: postdata,
            async: false,
            success: function (d) {
                console.log("sendSelectCount back:" + d.isComplete);
                if (d.isComplete === "true") {
                    console.log("scoId:" + scoId + " finished!");
                } else {
                    playTime = Math.floor(d.duraiton / 1000);
                    console.log(playTime);
                    sendSelectCount(1, playTime, scoId);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                let start = 0;
                errorMsg = 'jqXHR:' + window.JSON.stringify(jqXHR)
                errorMsg += ',textStatus:' + window.JSON.stringify(textStatus)
                errorMsg += ',errorThrown:' + window.JSON.stringify(errorThrown)
                errorMsg += ',navigator.onLine:' + navigator.onLine
                console.error(errorMsg)
            }
        })
    } catch (e) {
       let start = 0;
        console.error(e);
    }
};

function listAllCouser() {
    var info;
    if (typeof (unsafeWindow) === "undefined") {
        info = window.info;
    } else {
        info = unsafeWindow.info;
    }

    if (typeof (info) === "undefined") {
        console.log("不是，二分屏，三分屏课程");
        $("#autoFinised")[0].innerText = "非二、三分屏课程";
        // $("#autoFinised")[0].disabled = true;
        return false;
    }
    $("#autoFinised")[0].innerText = "^-^二、三分屏课程-开始自我修养进化";

    var alllen = $(".scormItem-no[data-id]").length;
    for (var index = 0; index < alllen; index++) {
        let scoId = $(".scormItem-no[data-id]")[index].getAttribute("data-id");
        console.log("scoId:" + scoId);
        sendSelectCount(0, 0, scoId);
    }
    return true;
}

$(function () {
    'use strict'
    console.log("ready!");
    // window.addEventListener('load', () => {
    addButton('快速学习点击我：支持二、三分屏，在线制作 三类课程', autoFinish);
    // try {
    // 	initVars();
    // }catch (e) {
    // 	console.error(e);
    // }

    // })

    function addButton(text, onclick, cssObj) {
        console.log("addButton" + text);
        cssObj = cssObj || {position: 'fixed', top: '90px', left: '50px', 'z-index': 3};
        let button = document.createElement('button'), btnStyle = button.style;
        button.id = "autoFinised";
        document.body.appendChild(button);
        button.innerHTML = text;
        button.onclick = onclick;
        Object.keys(cssObj).forEach(key => btnStyle[key] = cssObj[key]);
        return button;
    }

    function autoFinish(element) {
        console.log("autoFinish");
        if (!$("#autoFinised")[0].disabled) {
            $("#autoFinised")[0].disabled = true;
            var canHanlde = false;
            try {
                if (!canHanlde && initVars()) {
                    $("#autoFinised")[0].innerText = "^-^在线制作课程-开始自我修养进化";
                    console.log(courseId, sourceId, providerCorpCode, postdataPlay);
                    showStudyRecordList();
                    showCourseChapter();
                    showStudyRecordList();
                    getStudyRecordList();
                    showStudyRecordList();
                    $("#autoFinised")[0].innerText = "在线制作课程-已结束@-@";
                    canHanlde = true;
                }
                if (!canHanlde && listAllCouser()) {
                    $("#autoFinised")[0].innerText = "二、三分屏课程-已结束@-@";
                    canHanlde = true;
                }
                if(errorMsg != ""){
                    $("#autoFinised")[0].innerText = errorMsg;
                }
            } catch (e) {
                console.error(e);
            }
            if (canHanlde) {
                $("#autoFinised")[0].disabled = false;
            }else {
                $("#autoFinised1")[0].innerText = "当前不支持该课程自动学习进化orz";
            }
        }
    }

});