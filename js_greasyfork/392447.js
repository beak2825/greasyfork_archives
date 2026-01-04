// ==UserScript==
// @name         NeuMOOC
// @version      0.19-2020-05-26
// @description  do other things that more valuable
// @author       You
// @match        mooc.neumooc.com/course/play/*
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/392447/NeuMOOC.user.js
// @updateURL https://update.greasyfork.org/scripts/392447/NeuMOOC.meta.js
// ==/UserScript==

(function () {
    var rush = false,
        labels = $("span.label"),
        threads = 5,
        videos = [],
        tests = [],
        totalElem = $("h2")[0],
        doneTime = 0, fullTime = 0;
    console.log("Happy Mooc");

    function formatTime(time) {
        Number.prototype.padLeft = function (total, pad) {
            return (Array(total).join(pad || 0) + this).slice(-total);
        };
        var min = parseInt(time / 60);
        var sec = time % 60;
        return min.padLeft(2, 0) + ":" + sec.padLeft(2, 0);
    }

    function freshTime() {
        totalElem.innerText = "目录" + doneTime + "/" + fullTime;
    }

    function doTime(endTime, data, finishFunc, statElem) {
        statElem.innerText = formatTime(data.endSecond) + "/" + formatTime(endTime);
        let i = setInterval(() => {
            data.endSecond += 30;
            if ((data.endSecond + 30) > endTime) {
                window.clearInterval(i);
                finishFunc((endTime - data.endSecond) * 1000);
                return;
            }
            statElem.innerText = formatTime(data.endSecond) + "/" + formatTime(endTime);
            doneTime += 30;
            freshTime();
            $.post("//www.neumooc.com/course/play/updatePlayInfo", data)
        }, 30000)
    }

    function startRush(e) {
        e.stopPropagation();
        e.preventDefault();
        for (var i = 0; i < threads; i++) {
            finishVideo(videos.pop())
        }
        //doTest(tests.pop())
    }

    function doTest(a) {
        initTest4Self(a.data.testId, '2');
        let i = setInterval(() => {
            if ($(".ui-popup").length === 1) {
                window.clearInterval(i);
                setTimeout(() => {
                    $(".ui-dialog_art-title")[0].innerText = a.data.title + " - 测试";
                    $(".ui-dialog_art-button")[0].addEventListener("click", () => {
                        setTimeout(() => {
                            doTest(tests.pop())
                        }, 500)
                    });
                }, 500);
            }
        }, 100);
    }

    function initVideo(labels, i) {
        var a = labels[i].firstElementChild,
            statElem = a.firstElementChild;
        a.onclick = startRush;
        a.data = {};
        a.data.courseId = a.href.split("courseId=")[1].split("&")[0];
        a.data.outlineId = a.href.split("outlineId=")[1].split("#")[0];
        a.data.title = labels[i].parentElement.previousElementSibling.innerText;
        //获取已观看时间
        $.post("/course/play/getOutlineInfoAjax",
            "outlineId=" + a.data.outlineId + "&courseId=" + a.data.courseId,
            (data) => {
                a.data.doneTime = parseInt(data.RET_OBJ.viewVideoTime);
                if (data.RET_OBJ.lowestScore !== "100") a.data.isTested = false;
                //获取视频信息
                $.get(a.href, (data) => {
                    var newDocument = (new DOMParser()).parseFromString(data, 'text/html');
                    a.data.resId = newDocument.getElementById("fResId").value;
                    a.data.entityId = newDocument.getElementById("fResId").value;
                    //a.data.testId = newDocument.getElementsByClassName("seq_html")[0].id.substring(4);
                    if (i < labels.length - 1) initVideo(labels, i + 1);
                    //获取视频时间、ID
                    $.post("/course/play/getOutlineResInfo",
                        "resId=" + a.data.resId + "&resType=1&outlineId="
                        + a.data.outlineId + "&courseId=" + a.data.courseId + "&entityId="
                        + a.data.entityId, (data) => {
                            a.data.fullTime = parseInt(data.resInfo.videoSecond) + 1;
                            a.data.videoId = data.resInfo.videoId;
                            if (isNaN(a.data.doneTime)) {
                                a.data.doneTime = 0
                            }
                            doneTime += a.data.doneTime;
                            fullTime += a.data.fullTime;
                            freshTime();
                            statElem.innerText = formatTime(a.data.doneTime) + "/" + formatTime(a.data.fullTime)
                            if (a.data.doneTime >= a.data.fullTime) {
                                a.parentElement.className = "label bg-color-green"
                            } else {
                                a.parentElement.className = "label bg-color-orange";
                                videos.push(a)
                            }
                        })
                })
            })

    }

    function finishVideo(a) {
        if (a === undefined) return;
        let startTime = parseInt(a.data.doneTime / 30) * 30;
        a.parentElement.className = "label bg-color-blue";
        $.post("/course/play/addPlayInfo",
            "videoId=" + a.data.videoId + "&startSecond=0&courseId="
            + a.data.courseId + "&outlineId=" + a.data.outlineId, (data) => {
                if (data.isOut !== "out") {
                    if (data.uvId != null) {
                        a.data.uvId = data.uvId;
                    }
                } else {
                    window.location.href = getContextPath() + "/login";
                }
                setTimeout(() => {
                    doTime(a.data.fullTime, {
                        uvId: a.data.uvId,
                        videoId: a.data.videoId,
                        endSecond: startTime,
                        completeFlag: ""
                    }, (endTime) => {
                        setTimeout(() => {
                            $.post("/course/play/updatePlayInfo",
                                "uvId=" + a.data.uvId + "&videoId=" + a.data.videoId + "&endSecond=" + a.data.fullTime
                                + "&completeFlag=complete", () => {
                                    doneTime += endTime / 1000;
                                    freshTime();
                                    a.firstElementChild.innerText = "已完成";
                                    a.parentElement.className = "label bg-color-green"
                                });
                            finishVideo(videos.pop())
                        }, endTime);
                    }, a.firstElementChild);
                }, parseInt(Math.random() * 30000))
            })
    }

    //initVideo(labels, 0);
    document.onkeydown = e => {
        let sel = e.keyCode - 61,
            sels = document.querySelector("#testQuesForm").querySelectorAll("input");
        if (e.keyCode !== 83){
            sels[sel].checked = !sels[sel].checked;
        }
        if (e.keyCode === 83 || sels[sel].type === "radio") {
            if (document.querySelector(".btn-group.btn-group-sm").lastElementChild.className.includes("active")) {
                submitTestConfirm()
            } else {
                updateTestQues('next','')
            }
        }
    }
    // var s = showTest;
    //     showTest = async (a, b, resId) => {
    //         s(a, b, resId)
    //         let u = document.URL.substring(document.URL.indexOf("courseId")),
    //             log = document.querySelector(".margin-top-20.text-left"),
    //             k = u.indexOf("#");
    //         if (k !== -1) {
    //             u = u.substring(0, k)
    //         }
    //         console.log(k)
    //         console.log(resId)
    //         log.innerText += "\n准备暴力答题..."
    //         let resp = await fetch("http://mooc.neumooc.com/course/play/getOutlineResInfo", {
    //             headers: {
    //                 "X-Requested-With": "XMLHttpRequest",
    //                 "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    //             },
    //             method: "POST",
    //             body: u + "&resType=2&sourceFlag=TEST_ING&resId=" + resId
    //         }).then(r=>r.json())
    //         console.log(resp)
    //     }
    // $("#chapterList")[0].style = undefined;
})
();
