// ==UserScript==
// @name     autoFinishLearn
// @version  1.4
// @require  https://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant    none
// @match    https://bbg.21tb.com/els/html/courseStudyItem/courseStudyItem.learn.do?*
// @namespace https://greasyfork.org/users/173111
// @description 二、三分屏，在线制作 三类课程加速学习
// @downloadURL https://update.greasyfork.org/scripts/418655/autoFinishLearn.user.js
// @updateURL https://update.greasyfork.org/scripts/418655/autoFinishLearn.meta.js
// ==/UserScript==

var uri;// = decodeURIComponent($("#aliPlayerFrame")[0].src);
var uriInfo;// = uri.split("/")[5].split("&");

var courseId;// = uriInfo[0];
var sourceId;// = uriInfo[2];
var providerCorpCode;// = uriInfo[1];

var chapterList;
var studyMap = new Map();

var updatePostDate;

var updateCourseRecord = function (updatePostDate) {
    //uri = "http://bbg.21tb.com/tbc-rms/record/updateCourseRecord";
    console.log(updatePostDate);
    $.ajax({
        type: "POST",
        url: "https://bbg.21tb.com/tbc-rms/record/updateCourseRecord",
        data: updatePostDate,
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (d) {
            console.log("updateCourseRecord back:");
            console.log(d);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            start = 0;
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
        url: "https://bbg.21tb.com/tbc-rms/record/getStudyRecordList",
        data: postdataPlay,
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (d) {
            console.log("getStudyRecordList back:");
            console.log(d.bizResult);
            allStudyFinish = 1;
            for (let i = 0; i < d.bizResult.length; ++i) {
                recordId = d.bizResult[i].recordId;
                chapterId = d.bizResult[i].chapterId;
                resourceId = d.bizResult[i].resourceId;
                timeToFinish = d.bizResult[i].timeToFinish;
                currentPosition = d.bizResult[i].timeToFinish;
                studyMap.set(chapterId, 1);
                updatePostDate = "{\"current_app_id\":\"\",\"recordId\": \"" + recordId + "\",\"courseId\": \"" + courseId + "\",\"sourceId\": \"" + sourceId + "\",\"providerCorpCode\": \"" + providerCorpCode + "\",\"chapterId\": \"" + chapterId + "\",\"resourceId\": \"" + resourceId + "\",\"timeToFinish\": " + timeToFinish + ",\"currentPosition\": " + currentPosition + ",\"type\": \"video\",\"currentStudyTime\": 0,\"pageIndex\": 0}"
                console.log(updatePostDate);
                if (d.bizResult[i].confirmFinish != 1) {
                    allStudyFinish = 0;
                    // recordId = d.bizResult[i].recordId;
                    // chapterId = d.bizResult[i].chapterId;
                    // resourceId = d.bizResult[i].resourceId;
                    // timeToFinish = d.bizResult[i].timeToFinish;
                    // currentPosition = d.bizResult[i].timeToFinish;
                    // updatePostDate = "{\"current_app_id\":\"\",\"recordId\": \""+recordId+"\",\"courseId\": \""+courseId+"\",\"sourceId\": \""+sourceId+"\",\"providerCorpCode\": \""+providerCorpCode+"\",\"chapterId\": \"\",\"resourceId\": \""+resourceId+"\",\"timeToFinish\": "+timeToFinish+",\"currentPosition\": "+currentPosition+",\"type\": \"video\",\"currentStudyTime\": 0,\"pageIndex\": 0}"
                    updateCourseRecord(updatePostDate);
                }
            }
            if (allStudyFinish == 1) {
                console.log("all study finished!");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            start = 0;
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
        url: "https://bbg.21tb.com/tbc-rms/record/getStudyRecordList",
        data: postdataPlay,
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (d) {
            console.log("showStudyRecordList back:");
            console.log(d.bizResult);
            allStudyFinish = 1;
            for (let i = 0; i < d.bizResult.length; ++i) {
                recordId = d.bizResult[i].recordId;
                chapterId = d.bizResult[i].chapterId;
                resourceId = d.bizResult[i].resourceId;
                timeToFinish = d.bizResult[i].timeToFinish;
                currentPosition = d.bizResult[i].timeToFinish;
                studyMap.set(chapterId, 1);
                updatePostDate = "{\"current_app_id\":\"\",\"recordId\": \"" + recordId + "\",\"courseId\": \"" + courseId + "\",\"sourceId\": \"" + sourceId + "\",\"providerCorpCode\": \"" + providerCorpCode + "\",\"chapterId\": \"" + chapterId + "\",\"resourceId\": \"" + resourceId + "\",\"timeToFinish\": " + timeToFinish + ",\"currentPosition\": " + currentPosition + ",\"type\": \"video\",\"currentStudyTime\": 0,\"pageIndex\": 0}"
                console.log(updatePostDate);
                if (d.bizResult[i].confirmFinish != 1) {
                    allStudyFinish = 0;
                    d.bizResult[i];
                }
            }
            if (allStudyFinish == 1) {
                console.log("all study finished!");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            start = 0;
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
        url: "https://bbg.21tb.com/tbc-rms/course/showCourseChapter",
        data: "{\"current_app_id\":\"\",\"courseId\":\"" + sourceId + "\",\"providerCorpCode\":\"" + providerCorpCode + "\"}",
        contentType: "application/json; charset=UTF-8",
        async: false,
        success: function (d) {
            console.log("showCourseChapter back:");
            console.log(d);
            chapterList = d.bizResult;
            for (let i = 0; i < chapterList.length; ++i) {
                chapterId = chapterList[i].chapterId;
                for (let j = 0; j < chapterList[i].resourceDTOS.length; ++j) {
                    resourceId = chapterList[i].resourceDTOS[j].resourceId;
                    timeToFinish = chapterList[i].resourceDTOS[j].playTime;
                    // if(resourceId == "39a8d5bc278f470099ab883c1fc3053e"){
                    // let updatePostDate = "{\"current_app_id\":null,\"recordId\":null,\"courseId\":\""+courseId+"\",\"sourceId\":\""+sourceId+"\",\"providerCorpCode\":\""+providerCorpCode+"\",\"chapterId\":\""+chapterId+"\",\"resourceId\":\""+resourceId+"\",\"timeToFinish\": 300,\"currentPosition\":20,\"type\": \"video\",\"currentStudyTime\": 0,\"pageIndex\": 0}";
                    // console.log(updatePostDate);
                    // }
                    if (studyMap.get(resourceId) === undefined) {
                        let updatePostDate = "{\"current_app_id\":null,\"recordId\":null,\"courseId\":\"" + courseId + "\",\"sourceId\":\"" + sourceId + "\",\"providerCorpCode\":\"" + providerCorpCode + "\",\"chapterId\":\"" + chapterId + "\",\"resourceId\":\"" + resourceId + "\",\"timeToFinish\":" + timeToFinish + ",\"currentPosition\":20,\"type\": \"video\",\"currentStudyTime\": 0,\"pageIndex\": 0}";
                        updateCourseRecord(updatePostDate);
                    }
                }
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            start = 0;
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
                    // if (level != 0) {
                    //     start = 1;
                    //     window.clearInterval(interval);
                    //     window.location.reload();
                    // } else {
                    //     start = 1;
                    //     window.clearInterval(interval);
                    //     return;
                    // }
                } else {
                    playTime = Math.floor(d.duraiton / 1000);
                    console.log(playTime);
                    sendSelectCount(1, playTime, scoId);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                start = 0;
                errorMsg = 'jqXHR:' + window.JSON.stringify(jqXHR)
                errorMsg += ',textStatus:' + window.JSON.stringify(textStatus)
                errorMsg += ',errorThrown:' + window.JSON.stringify(errorThrown)
                errorMsg += ',navigator.onLine:' + navigator.onLine
                console.error(errorMsg)
            }
        })
    } catch (e) {
        start = 0;
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
        scoId = $(".scormItem-no[data-id]")[index].getAttribute("data-id");
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
