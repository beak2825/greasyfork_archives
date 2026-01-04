// ==UserScript==
// @name         中国烟草
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @match        http://mooc.ctt.cn/zxy-student-web/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374497/%E4%B8%AD%E5%9B%BD%E7%83%9F%E8%8D%89.user.js
// @updateURL https://update.greasyfork.org/scripts/374497/%E4%B8%AD%E5%9B%BD%E7%83%9F%E8%8D%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.courses = [];
    window.studies = {};
    var getCourse = function(status){
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `http://mooc.ctt.cn/zxy-student/api/course/list/querySelfCoursePage?_page=1&_pageSize=12&status=${status}`,
                success: function(r){
                    courses = (courses || []).concat(r.items.map(s => s.courseId));
                    courses = Array.from(new Set(courses));
                    resolve(courses);
                },
                error: function(r){
                    console.log(r);
                    reject(r);
                }
            });
        });
    };

    var getStudy = function(courseId){
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `http://mooc.ctt.cn/zxy-student/api/course/detail/study-list?id=${courseId}`,
                success: function(r){
                    let result = r.filter(s => s.finishStatus != 2).map(s => [s.scormId, s.finishStatus]);
                    if(result[0]){
                        let ori = (studies[courseId] || []);
                        studies[courseId] = ori.map(s => s[0]).indexOf(result[0][0]) == -1 ? ori.concat(result) : ori;
                        Object.keys(studies).filter(k => studies[k].length == 0).forEach(k => delete studies[k]);
                    }
                    resolve(studies);
                },
                error: function(r){
                    console.log(r);
                    reject(r);
                }
            });
        });
    };

    var check = function(courseId, studieId){//TODO
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `http://mooc.ctt.cn/zxy-student/api/course/detail/study-list?id=${courseId}`,
                success: function(r){
                    studies[courseId][1] = r.filter(s => s.scormId == studieId)[0].finishStatus;
                    resolve(studies[courseId]);
                },
                error: function(r){
                    console.log(r);
                    reject(r);
                }
            });
        });
    };

    var getHistoryId = function(courseId, scormId){
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `http://mooc.ctt.cn/zxy-student/api/scorm/study/start-time`,
                type: "POST",
                data: {
                    "scormId": scormId,
                    "courseId": courseId
                },
                success: function(r){
                    studies[courseId].filter(s => s[0] == scormId)[2][0] = r;
                    resolve(r);
                },
                error: function(r){
                    console.log(r);
                    reject(r);
                }
            });
        });
    };

    window.study = function(){
        Object.keys(studies).forEach(c => {
            var courseId = c;
            studies[c].forEach(s => {
                var scormId = s[0];
                $("body").prepend(`<iframe onload="window.scrollDown(this);" class="autostudy" src="http://mooc.ctt.cn/zxy-student-web/#resource/course/player-nt/${courseId}/${scormId}">`);
            });
        });
    };

    window.scrollDown = function(frame){
        let thisWindow = frame.contentWindow;
        let check = thisWindow.setInterval(function(){
            let pdfContainer = thisWindow.document.getElementsByClassName("pdf-view");
            let videoContainer = thisWindow.document.getElementsByName("playIframe");
            let docContainer = thisWindow.document.getElementById("v54playIframe");

            if(pdfContainer.length + videoContainer.length > 0 || docContainer){
                thisWindow.clearInterval(check);
                let subWindow;

                let checkSub = thisWindow.setInterval(function(){
                    if(pdfContainer.length > 0){
                        subWindow = pdfContainer[0].contentWindow;
                    }else if(docContainer){
                        subWindow = docContainer.contentWindow;
                    }else{
                        subWindow = videoContainer[0].contentWindow;
                    }

                    if(subWindow){
                        thisWindow.clearInterval(checkSub);
                        $(subWindow.document.head).append("<style>video{position:absolute !important;left:-1000px !important;top:-400px !important;height:200px !important}</style>");
                        let finalCheck = subWindow.setInterval(function(){
                            let pdf = subWindow.document.getElementById("viewer");
                            let video = subWindow.document.getElementsByTagName("video");
                            let doc = subWindow.document.getElementById("scormIframe");
                            if(pdf && pdf.innerHTML.length > 0){
                                subWindow.clearInterval(finalCheck);
                                console.log("Scroll PDF");
                                subWindow.document.getElementById("viewerContainer").scroll(0,10000000);
                            }

                            if(video.length > 0){
                                subWindow.clearInterval(finalCheck);
                                console.log("Video");
                                console.log(video[0]);
                            }

                            if(doc && doc.contentWindow){
                                subWindow.clearInterval(finalCheck);
                                console.log("Scroll DOC");
                                doc.contentWindow.document.body.scroll(0,10000000);
                            }
                        }, 1000);
                    }
                }, 1000);
            }
            console.log("Checking");
        }, 1000);
    };

    var report = function(historyId){
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `http://mooc.ctt.cn/zxy-manage/intervalHandler`,
                type: "POST",
                data: {
                    "method": "interval",
                    "historyId": historyId,
                    "isPause": false
                },
                success: function(r){
                    resolve(r);
                },
                error: function(r){
                    console.log(r);
                    reject(r);
                }
            });
        });
    };

    window.getAllStudies = function(){
        getCourse(1).then(() => getCourse(3).then(() => courses.forEach(c => getStudy(c))));
    };
})();