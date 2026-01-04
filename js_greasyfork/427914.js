// ==UserScript==
// @name         2025华医公需课: 人工智能赋能
// @namespace    http://tampermonkey.net/
// @version      1.10
// @description  2025年公需课：<<人工智能赋能制造业高质量发展>> 自动听课和自动考试脚本.听完公需课后，有“待考试”的视频， 要手动点一下， 或让它自动再刷一轮。华医的其它课程可以自动听课，但没有自动考试.
// @author       han2ee
// @include        http://cme*.91huayi.com/*
// @include        https://cme*.91huayi.com/*
// @include        https://dk.91huayi.com/*
// @include        https://sdnew.91huayi.com/*
// @run-at        document-start
// @grant   GM_xmlhttpRequest
// @grant   GM.setValue
// @grant   GM.getValue
// @grant unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/427914/2025%E5%8D%8E%E5%8C%BB%E5%85%AC%E9%9C%80%E8%AF%BE%3A%20%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD%E8%B5%8B%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/427914/2025%E5%8D%8E%E5%8C%BB%E5%85%AC%E9%9C%80%E8%AF%BE%3A%20%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD%E8%B5%8B%E8%83%BD.meta.js
// ==/UserScript==


(function() {
    'use strict';
    const DK_HOST = "dk.91huayi.com";
    var courseInterID = 0;
    let first = true;
    // save the alert
    var _alert =window.alert;
    // ignore the alert
    function overrideSelectNativeJS_Functions () {
        window.alert = function alert (message) {
            console.log (message);
            return true;
        }
    }
    (function (funcToRun) {
        var D = document;
        var scriptNode = D.createElement ('script');
        scriptNode.type = "text/javascript";
        scriptNode.textContent = '(' + funcToRun.toString() + ')()';
        var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
        targ.appendChild (scriptNode);
    })(overrideSelectNativeJS_Functions);
    const requestAsync = function(url, data) {
        // console.log(data);
        return new Promise((resolve, reject) => {
            var reportAJAX_Error = (rspObj) => {
                console.error (`Request error: ${data}`);
                reject(`Request => Error ${data}  RES ${rspObj.status}!  ${rspObj.statusText}`);
            }

            var processJSON_Response = (rspObj) => {
                if (rspObj.status != 200 && rspObj.status != 304) {
                    reportAJAX_Error (rspObj);
                } else {
                    resolve(rspObj.responseText);
                }
            };
            GM_xmlhttpRequest ( {
                method:         "GET",
                url:            url,
                timeout: 6000,
                headers: {
                    "Referer": document.location.href,
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                //data:           data,
                responseType:   "text/html",
                onload:         processJSON_Response,
                onabort:        reportAJAX_Error,
                onerror:        reportAJAX_Error,
                ontimeout:      reportAJAX_Error
            });
        });
    }

    const getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return typeof sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
        return false;
    };

    const findFirstLesson = function(studyImgArr) {
        if (studyImgArr) {
            for (let i = 0; i < studyImgArr.length; i++) {
                if (studyImgArr[i].src.endsWith("anniu_01a.gif")) {
                    return i;
                }
            }
        }
        return -1;
    }
    const nextLesson = async function(cwid) {
        await wait(10 * 1000);
        let cid = await GM.getValue('cid');
        console.log("CID", cid);
        let hrefs = await GM.getValue(cid);
        for (let i = 0; i < hrefs.length - 1; i++) {
            if (hrefs[i].indexOf(cwid) != -1) {
                window.location.href = hrefs[i + 1];
            }
        }
    }

    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

    function isPromise(obj) {
        return !!obj && ((typeof obj === 'object' && typeof obj.then === 'function') || (typeof obj === 'function' && typeof obj().then === 'function'));
    }
    /**
     * Wait Resource.
     *
     * @param {Function} resourceFn pred function to check resource
     * @param {Object} options
     * @returns Promise
     */
    function waitResource(resourceFn, options) {
        var optionsRes = Object.assign(
            {
                interval: 3000,
                max: 10
            },
            options
        );
        var current = 0;
        return new Promise((resolve, reject) => {
            var timer = setInterval(() => {
                if (isPromise(resourceFn)) {
                    resourceFn().then(res => {
                        if(res) {
                            clearInterval(timer);
                            resolve();
                        }
                    });
                } else if (resourceFn()) {
                    clearInterval(timer);
                    resolve();
                }
                current++;
                if (current >= optionsRes.max) {
                    clearInterval(timer);
                    reject('Time out');
                }
            }, optionsRes.interval);
            });
    }

    const ANSWER_DICT = {
        // 2025年公需课：人工智能赋能制造业高质量发展
        '3b1a3ece-f378-4d36-9986-b16b00e6fdb6': ['f165a244-4e02-48d0-a215-b169012b5f80', '574d2df2-f95a-460f-98ba-b169012b5f80', '815bd9c0-8e80-41f5-a062-b169012b5f80', '69e04f4d-24ef-4686-a5ba-b169012b5f80'],
        '7fbab5de-4e67-4d4b-aaf7-098a43e8e30a': ['993a118f-6a82-4082-a0be-b2de0123bc4e'],
        '40b14fef-94c3-4419-9f9b-0ddb344269fe': ['7abfd10d-9f89-4b25-a1a4-b2de0123bc4e'],
        '1b971e45-91d4-481b-a298-600a46e4d939': ['992e9534-b9b1-40d3-999f-b2de0123bc4e'],
        '98e208bb-cf1e-4007-8383-a62f1a275baa': ['3d90c11b-8c7e-4243-8fe3-b2de0123bc4e'],
        '41bb8eb6-f9ab-4334-8ffb-afe774553a29': ['be8d2f3b-18ca-4e2d-9cf5-b2de0123bc4e'],
        '2181ef9f-ecff-42c5-ac1c-d1bcb4a5dada': ['523dd57f-9625-4e1d-889c-b2de0123bc4e'],
        '2bdd5e1e-3dc8-47f9-b5f9-e981cf579fbb': ['508c2c1a-47c4-4745-8be5-b2de0123bc4e'], // 7
        '9733fd30-8fe3-4b1a-bb6f-0675c710688d': ['8f5abcff-b899-4b8e-893b-b2de0123bc4e', 'c8ff5245-2131-4b7a-a328-b2de0123bc4e', '558448c5-16a1-49ea-bb89-b2de0123bc4e'], // m1
        'aa0c955d-2e72-42fa-a361-0c26807c4a85': ['749c0bfc-2c69-422f-8905-b2de0123bc4e', '5f13d0cc-96d0-4d9f-a9d8-b2de0123bc4e', '23d7c809-8690-4b67-b830-b2de0123bc4e'], // m2
        '5e9eef61-745f-4c00-9f89-2299ee15f8aa': ['74347e29-9393-436e-af7b-b2de0123bc4e', '14a0ca69-5f88-4964-ad47-b2de0123bc4e', 'a087caa7-819a-4f9d-8122-b2de0123bc4e', 'd82cb471-faf4-4974-a624-b2de0123bc4e'],
        '9dc5c848-1d7f-435f-a877-38a107dd1e4a': ['f67010c5-f1b7-45ec-9d4f-b2de0123bc4e', '35aba541-740e-4703-b799-b2de0123bc4e', '35a29775-e485-4f02-a865-b2de0123bc4e', 'c123d5a5-2a3c-46fc-a154-b2de0123bc4e'],
        '6f458aed-a1be-47d0-97a6-6c6600e5817c': ['8ecd3d85-31d6-4b96-9ae3-b2de0123bc4e', '92b02267-e298-4f8d-9320-b2de0123bc4e', 'ac98c99d-bf47-47fb-902a-b2de0123bc4e'],
        '1c6a241b-14a5-4543-9130-8c9d5e2364b3': ['50b13d55-1c33-4460-a57a-b2de0123bc4e', '16579acf-b8b4-4356-84b0-b2de0123bc4e'],
        '35b60d7f-edef-4652-a174-1b9c55b87ca4': ['Y'],
        '76c1906f-0b80-49a3-bef6-6ed84bf24a7b': ['N'],
        'bb767e22-a663-4372-ba5b-8bcc76c17c73': ['Y'],
        '156113fc-c13c-4afc-a51d-b87a2452cff6': ['Y'],
        '429eaf80-6aa5-4804-93dd-c8c65dbb861c': ['Y'],
        'be005110-d22b-401e-a50f-cffcdd8f4eae': ['Y'],
        '49c3c8f9-5d47-40b3-b01d-ec76e1f810b8': ['N'],
    };

    // intercept alert window
    if (getUrlParameter('cwid') ||　getUrlParameter('cid')) {
        let alrtScope;
        if (typeof unsafeWindow === "undefined") {
            alrtScope = window;
        } else {
            alrtScope = unsafeWindow;
        }
        alrtScope.alert = function (str) {
            console.log ("Greasemonkey intercepted alert: ", str);
        };
    }
    if (window.top !== window.self) {
        return;
    }
    // 单个课程页面
    if (window.location.host !== DK_HOST && window.location.pathname == '/course_ware/course_ware_polyv.aspx') {
        console.log("单个课程页面");
        /*
        // 修改播放器init参数 倍速：'speed': true  可拖动'ban_seek': false
        let scriptIndex = 0;
        new MutationObserver(function(mutations) {
            // check at least two H1 exist using the extremely fast getElementsByTagName
            // which is faster than enumerating all the added nodes in mutations
            let scriptList = document.getElementsByTagName('script');
            if (scriptList.length > 10) {
                this.disconnect(); // disconnect the observer
            }
            for (; scriptIndex < scriptList.length; scriptIndex++) {
                let scriptEle = scriptList[scriptIndex];
                if (scriptEle.innerHTML && scriptEle.innerHTML.indexOf("'speed': false")) {
                    scriptEle.innerHTML = scriptEle.innerHTML.replace("'speed': false", "'speed': true").replace("'ban_seek': banSeek", "'ban_seek': false");
                    console.log("REPLACE");
                    this.disconnect();
                    break;
                }
            }
        }).observe(document, {childList: true, subtree: true});
        */
        // 拦截first,不让加载视频中间的问题
        let inter = setInterval(function() {
            try {
                if (first &&　typeof player !== "undefined") {
                    first = false;
                    console.log("FIRST:", first);
                    player.sendQuestion = function(data) {};
                    clearInterval(inter);
                }
            } catch (err) {
                console.log(err);
            }
        }, 10);
        let initRateFlag = true;
        let lastTime = 0;
        courseInterID = setInterval(async function() {
            if (first) { // mare sure the player.sendQuestion is empty function
                console.log("sendQuestion should be empty function");
                return;
            }

            if (typeof closeProcessbarTip === "function") { // close the warning
                closeProcessbarTip();
            }
            if (!$("#jrks")[0].getAttribute('disabled')) { // finish lesson
                let cwid = getUrlParameter('cwid');
                if (ANSWER_DICT[cwid]) {
                    try {
                        let examHref = $("#jrks")[0].href;
                        if (examHref && examHref.indexOf("exam.aspx") != -1) {
                            let content = await requestAsync(examHref, {});
                            if (content.indexOf("请进行课件观看学习完成后再进行考试") != -1) {
                                window.location.reload(); // 重听
                                clearInterval(courseInterID);
                            } else {
                                window.location = $("#jrks")[0].href; // 跳到考试
                                clearInterval(courseInterID);
                            }
                        }
                    } catch (err) {
                        console.error(err);
                    }
                } else { // jump to next
                    await nextLesson(cwid);
                    clearInterval(courseInterID);
                }
            }
            await GM.setValue("curCWID", getUrlParameter('cwid'));

            // Resume video
            let curTime = player.j2s_getCurrentTime();
            if (curTime === lastTime && curTime < player.j2s_getDuration()) {
                console.log(curTime, "try to resume");
                // resume
                player.j2s_setVolume(0); // avoid the "user didn't interact with doc" error
                player.j2s_resumeVideo();
                console.log("resume successfully");
            }
            lastTime = curTime;

            if (initRateFlag) {
                let rate = await GM.getValue('rate', 1);
                if (player) {
                    player.changeRate(rate);
                    initRateFlag = false;
                }
            } else {
                await GM.setValue('rate', player.currentRate);
            }
        }, 3000);
    }

    if (window.location.pathname == '/pages/noplay.aspx') {
        setTimeout(async function() {
            let cwid = await GM.getValue("curCWID");
            window.location.href = "/course_ware/course_ware.aspx?cwid=" + cwid;
            // document.querySelector(".yes").click();
        }, 5000);
    }
    // 考试页面
    if (window.location.pathname == '/pages/exam.aspx') {
        setTimeout(async function() {
            await waitResource(() => !!document.querySelector("#btn_submit"));
            let cwid = getUrlParameter('cwid');
            console.log("CWID:", cwid);
            let answer = ANSWER_DICT[cwid];
            if (answer) {
                for (let item of answer) {
                    if (item.startsWith('gvQuestion')){
                        $('#' + item).click();
                    } else {
                        $(`[value=${item}]`).click();
                    }
                    await wait(200);
                }
                $('#btn_submit').click();
            }
        }, 3000);
    }

    if (window.location.pathname == '/ExamInterface/ComputerExamIndex') {
        setInterval(async function() {
            let qid = $('.dd_01').attr('questionid');
            let answer = ANSWER_DICT[qid];
            if (answer) {
                for (let item of answer) {
                    if (item.startsWith('gvQuestion')){
                        $('#' + item).click();
                    } else {
                        $(`[value=${item}]`).click();
                    }
                    await wait(500);
                }

                if ($('#btnNext') && $('#btnNext').css('display') != 'none') {
                    $('#btnNext').click();
                } else {
                    $('.submitExam').click();
                    await wait(500);
                    $('#subPaper').click();
                }
            }
        }, 5 * 1000);
    }
    // 考试结果页面
    if (window.location.pathname == '/pages/exam_result.aspx') {
        setTimeout(async function() {
            let cwid = getUrlParameter('cwid');
            await nextLesson(cwid);
        }, 3000);
    }
    // 目录页面
    if (window.location.pathname == '/pages/course.aspx') {
        console.log("目录面");
        let interId = setInterval(async function() {
            let hrefs = document.querySelectorAll(".course h3 a");
            let vals = [];
            for (let i = 0; i < hrefs.length; i++) {
                // if (hrefs[i].children[0].src.endsWith("anniu_01a.gif")) {
                vals.push(hrefs[i].href);
                // }
            }
            // console.log(vals);
            let cid = getUrlParameter('cid')
            await GM.setValue(cid, vals);
            await GM.setValue('cid', cid);
            console.log("Course list have been set.");
            clearInterval(interId);
        }, 3000);
    }

    // 医师定期考核目录页面
    if (window.location.pathname == '/course_ware/course_ware_list.aspx') {
        console.log("目录面");
        let interId = setInterval(async function() {
            // find the first course to learn
            let eles = document.querySelectorAll(".xx"); //.nextElementSibling.click()
            if (eles.length === 0) {
                eles = document.querySelectorAll(".wx");
            }
            if (eles.length > 0) {
                eles[0].nextElementSibling.click();
                clearInterval(interId);
            }
        }, 3000);
    }

    // 医师定期考核单个课程页面
    if (window.location.host === DK_HOST && window.location.pathname == '/course_ware/course_ware_polyv.aspx') {
        console.log("单个课程页面");
        // 拦截first,不让加载视频中间的问题
        let inter = setInterval(function() {
            try {
                if (first &&　typeof player !== "undefined") {
                    first = false;
                    console.log("FIRST:", first);
                    player.sendQuestion = function(data) {};
                    clearInterval(inter);
                }
            } catch (err) {
                console.log(err);
            }
        }, 10);
        let initRateFlag = true;
        let lastTime = 0;
        courseInterID = setInterval(async function() {
            if (first) { // mare sure the player.sendQuestion is empty function
                console.log("sendQuestion should be empty function");
                return;
            }

            if (typeof closeProcessbarTip === "function") { // close the warning
                closeProcessbarTip();
            }

            // Resume video
            let curTime = player.j2s_getCurrentTime();
            if (curTime === lastTime && curTime < player.j2s_getDuration()) {
                console.log(curTime, "try to resume");
                // resume
                player.j2s_setVolume(0); // avoid the "user didn't interact with doc" error
                player.j2s_resumeVideo();
                console.log("resume successfully");
            }
            lastTime = curTime;

            if (initRateFlag) {
                let rate = await GM.getValue('rate', 1);
                if (player) {
                    player.changeRate(rate);
                    initRateFlag = false;
                }
            } else {
                await GM.setValue('rate', player.currentRate);
            }
        }, 3000);
    }
})();