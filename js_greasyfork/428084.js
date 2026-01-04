"use strict";
// ==UserScript==
// @name         就業指導
// @namespace    [url=mailto:moriartylimitter@outlook.com]moriartylimitter@outlook.com[/url]
// @version      0.0.3
// @description  自動播放視頻
// @author       Brush-JIM
// @match        *://dgut.wnssedu.com/course/newcourse/watch.htm*
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @connect      polyv.net
// @downloadURL https://update.greasyfork.org/scripts/428084/%E5%B0%B1%E6%A5%AD%E6%8C%87%E5%B0%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/428084/%E5%B0%B1%E6%A5%AD%E6%8C%87%E5%B0%8E.meta.js
// ==/UserScript==
// 屏蔽輸出
// @ts-ignore
unsafeWindow.console.log = function () { };
// @ts-ignore
var Answer = [];
// @ts-ignore
// unsafeWindow.Answer=Answer;
var VID = "";
// 獲取答案
var sI = setInterval(function () {
    // @ts-ignore
    if (unsafeWindow.g_video && unsafeWindow.g_video.strVideoInfo) {
        clearInterval(sI);
        // @ts-ignore
        var vid = JSON.parse(unsafeWindow.g_video.strVideoInfo).strVid;
        VID = vid;
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://v.polyv.net/uc/exam/get?vid=" + vid + "&callback=jsonp",
            onload: function (xml) {
                var data = xml.responseText;
                data = data.slice(6, data.length - 2);
                var arrayData = JSON.parse(data);
                // @ts-ignore
                $(arrayData).each(function (index, data) {
                    var choices = JSON.parse(data.choices);
                    var rightAnswer = {
                        title: data.question,
                        choices: choices
                    };
                    Answer.push(rightAnswer);
                });
                VideoPlay();
                setInterval(ReLoad, 1000);
            }
        });
    }
}, 1000);
// 答題
function AnswerQuestion() {
    var ask = $(".pv-ask-modal");
    if (ask.length == 0)
        return;
    // @ts-ignore
    Answer.some(function (data) {
        if ($("h3", ask).text().indexOf(data.title) != -1) {
            // @ts-ignore
            data.choices.some(function (key, index) {
                if (key.right_answer === 1) {
                    // @ts-ignore
                    if ($(".pv-ask-form input").get(index).checked == false) {
                        // @ts-ignore 
                        $($(".pv-ask-form input").get(index)).trigger("click");
                    }
                }
                else {
                    // @ts-ignore
                    if ($(".pv-ask-form input").get(index).checked == true) {
                        // @ts-ignore 
                        $($(".pv-ask-form input").get(index)).trigger("click");
                    }
                }
            });
            $("[data-type='pvSubmit']").trigger("click");
            $("[data-type='close']").click();
            return true;
        }
    });
}
// 視頻播放
function VideoPlay() {
    $("video").each(function () {
        // @ts-ignore
        if (this.muted === false) {
            $(".pv-volumebtn").click();
            // @ts-ignore
            this.muted = true;
        }
        // @ts-ignore
        if (this.paused === true) {
            // @ts-ignore
            if (this.ended === true) {
                var next = $(".chapter_list li[class='active']").next();
                if (next.length === 0) {
                    $(".course_back_info").trigger("click");
                }
                else {
                    $("a", next).click();
                }
            }
            else {
                if ($(".pv-ask-modal").length != 0) {
                    AnswerQuestion();
                }
                // @ts-ignore
                this.play();
            }
        }
    });
    setTimeout(VideoPlay, 1000);
}
// 點擊關閉元素
setInterval(function () {
    if ($("[data-type='close']").length != 0) {
        $("[data-type='close']").click();
    }
}, 500);
// 加載新題目答案
function ReLoad() {
    // @ts-ignore
    var vid = JSON.parse(unsafeWindow.g_video.strVideoInfo).strVid;
    if (vid !== VID) {
        VID = vid;
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://v.polyv.net/uc/exam/get?vid=" + vid + "&callback=jsonp",
            onload: function (xml) {
                var data = xml.responseText;
                data = data.slice(6, data.length - 2);
                var arrayData = JSON.parse(data);
                // @ts-ignore
                $(arrayData).each(function (index, data) {
                    var choices = JSON.parse(data.choices);
                    var rightAnswer = {
                        title: data.question,
                        choices: choices
                    };
                    Answer.push(rightAnswer);
                });
            }
        });
    }
}
// 隱藏視頻
$("<style type=\"text/css\">video {visibility: hidden !important;}</style>").appendTo("head");
