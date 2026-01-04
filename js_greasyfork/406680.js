// ==UserScript==
// @name         网大自助学习
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  辅助学习，自动打开学习链接
// @author       NoBody
// @match        kc.zhixueyun.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @grant        window.close
// @grant        window.focus
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/406680/%E7%BD%91%E5%A4%A7%E8%87%AA%E5%8A%A9%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/406680/%E7%BD%91%E5%A4%A7%E8%87%AA%E5%8A%A9%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    // @require file:////Users/even/Documents/Script/op.user.js
    var chapterProgree;
    var courseSectionPprogress;
    $(document).ready(function () { //When document has loaded
        setTimeout(function () {
            // console.clear();
            var curDate = new Date();
            console.log("page reload on " + curDate.toLocaleString())
            tryReplay();
        }, 10000); //Two seconds will elapse and Code will execute.

    });


    // request intercept
    (function(open) {
        XMLHttpRequest.prototype.open = function() {
            this.addEventListener("readystatechange", function() {
                // 获取专题学习情况
                if (this.readyState === 4 && this.responseURL.indexOf("chapter-progress?courseId") !== -1) {
                    var curCourseId = "";
                    chapterProgree = JSON.parse(this.response);
                    chapterProgree.some( function (sectionProgress){
                        // if (sectionProgress['name'].indexOf("【新基建 新技术】") === -1) {
                        //     return false;
                        // }
                        return sectionProgress.courseChapterSections.some(function (course){
                            // 未完成的10类型
                            if (course['progress']['finishStatus'] !== 2 && course['progress']['sectionType'] === 10) {
                                curCourseId = course["attachmentId"]
                                return true;
                            }
                            return false;
                        })
                    })

                    // 如何和记录不同
                    console.log(curCourseId);
                    if (curCourseId !== "") {
                        window.open("https://kc.zhixueyun.com/#/study/course/detail/10&" + curCourseId, "自动学习");
                        GM_setValue("curCourseId", curCourseId);
                    }

                    setTimeout(function() {
                        var curDate = new Date();
                        window.location.reload();
                    }, 300000);
                }
                // 获取课程学习情况
                if (this.readyState === 4 && this.responseURL.indexOf("course-section-progress") !== -1) {
                    courseSectionProgree = JSON.parse(this.response);
                    var ifAllFinish = true;

                    ifAllFinish = courseSectionProgree.every(function(_course){
                        return _course['finishStatus'] == 2
                    })

                }
            }, false);
            open.apply(this, arguments);
        };
    })(XMLHttpRequest.prototype.open);


    function printHello() {
        console.log("hello");
    }

    function tryReplay() {
        if ($('button[class="vjs-play-control vjs-control vjs-button vjs-paused"]').length> 0){
            console.log($('button[class="videojs-referse-btn"]')[0]);
            ($('button[class="vjs-play-control vjs-control vjs-button vjs-paused"]')[0]).click();
        }
    }

})();