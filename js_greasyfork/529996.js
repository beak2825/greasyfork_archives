// ==UserScript==
// @name         🥇【华医网助手】添加自动播放下一个功能
// @namespace    http://tampermonkey.net/
// @version      1.6.6
// @description  huayiwang, 华医网，自动播放，自动静音，屏蔽答题，调整视频质量为最低，当前视频播放结束自动进入下一个视频，播放结束清理无用定时器
// @author       华医网助手
// @license      AGPL License
// @match        *://*.91huayi.com/course_ware/course_ware_polyv.aspx?*
// @match        *://*.91huayi.com/pages/exam.aspx?*
// @match        *://*.91huayi.com/pages/exam_result.aspx?*
// @match        *//*.wsglw.net/train/courseware/cc?*
// @match        *://*.91huayi.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529996/%F0%9F%A5%87%E3%80%90%E5%8D%8E%E5%8C%BB%E7%BD%91%E5%8A%A9%E6%89%8B%E3%80%91%E6%B7%BB%E5%8A%A0%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E4%B8%AA%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/529996/%F0%9F%A5%87%E3%80%90%E5%8D%8E%E5%8C%BB%E7%BD%91%E5%8A%A9%E6%89%8B%E3%80%91%E6%B7%BB%E5%8A%A0%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E4%B8%AA%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(() => {
    // 非播放界面直接返回
    var urlInfos = window.location.href.split("/");
    var urlTip = urlInfos[urlInfos.length - 1].split("?")[0];
    if (urlTip != "course_ware_polyv.aspx") {
        return
    }
    addInfo();
    killQuestion();
    examherftest();
    let video = document.querySelector('video');
    window.examInterval = setInterval(() => {
        examherftest()
    }, 1000);
    window.playInterval = setInterval(() => {
        if (video.paused && !video.ended) {
            video.play();
        }
        if (window.player && window.player.getCurrentLevel() != 1) {
            window.player.changeLevel(1)
        }
        video.volume = 0;
        video.muted = true;

        // 添加视频结束检测
        if (video.ended) {
            examherftest();
        }
    }, 1000);

    function examherftest() {  //考试按钮激活状态检测
        var hreftest = document.getElementById("jrks").attributes["href"].value;
        if (hreftest != "#") { //考试按钮已激活
            // 优化自动播放下一个视频的逻辑
            const currentVideo = document.querySelector("li.lis-inside-content.active");
            if (currentVideo) {
                const nextVideo = currentVideo.nextElementSibling;
                if (nextVideo) {
                    const playButton = nextVideo.querySelector("h2");
                    if (playButton) {
                        playButton.click();
                        setTimeout(function () {
                            const confirmButton = document.evaluate("//button[contains(., '知道了')]", document, null, XPathResult.ANY_TYPE).iterateNext();
                            if (confirmButton) {
                                confirmButton.click();
                            }
                        }, 2000);
                        return;
                    }
                }
            }

            // 原有逻辑作为后备方案
            if ($('button:contains("未学习")').length > 0) {
                $('button:contains("未学习")').siblings().eq(0).click();
            } else if ($('button:contains("学习中")').length > 0) {
                $('button:contains("学习中")').siblings().eq(0).click();
            } else if ($('button:contains("待考试")').length > 0 && document.querySelector("a[id='mode']").innerText.indexOf("视频+考试") != -1) {
                $('button:contains("待考试")').siblings().eq(0).click();
            } else {
                console.log('没有找到任何按钮');
                clearInterval(examInterval);
            }
        }
    }

    function killQuestion() {
        (async function () {
            while (!window.player || !window.player.sendQuestion) {
                await sleep(20);
            };
            window.player.sendQuestion = function () {
            };
        })();
        window.killQuestionInterval = setInterval(async function () {
            try {
                if ($('.pv-ask-head').length && $('.pv-ask-head').length > 0) {
                    console.log("检测到问题对话框，尝试跳过");
                    $(".pv-ask-skip").click();
                };
            } catch (err) {
                console.log(err);
            };
            try {
                if ($('.signBtn').length && $('.signBtn').length > 0) {
                    console.log("检测到签到对话框，尝试跳过");
                    $(".signBtn").click();
                };
            } catch (err) {
                console.log(err);
            };
            try {
                if ($("button[onclick='closeProcessbarTip()']").length && $("button[onclick='closeProcessbarTip()']").length > 0 && $("div[id='div_processbar_tip']").css("display") == "block") {
                    console.log("检测到温馨提示对话框（不能拖拽），尝试跳过");
                    $("button[onclick='closeProcessbarTip()']").click();
                };
            } catch (err) {
                console.log(err);
            };
            try {
                if ($("button[class='btn_sign']").length && $("button[class='btn_sign']").length > 0) {
                    console.log("检测到温馨提示对话框（疲劳提醒），尝试跳过");
                    $("button[class='btn_sign']").click();
                };
            } catch (err) {
                console.log(err);
            };
            try {
                if ($("#floatTips") && $("#floatTips").is(":visible")) {
                    console.log("检测到二维码，尝试跳过");
                    window.closeFloatTips();
                };
            } catch (err) {
                console.log(err);
            };
            try {
                var state = document.querySelectorAll("i[id='top_play']")[0].parentNode.nextElementSibling.nextElementSibling.nextElementSibling.innerText;
                if ($('video').prop('paused') == true && state != "已完成") {
                    console.log("视频意外暂停，恢复播放");
                    $('video').get(0).play();
                    $('video').prop('volumed') = 0;
                    $('video').prop('muted') = true;
                } else if (state == "已完成") {
                    document.querySelector("video").pause();
                };
            } catch (err) {
            };
        }, 2000);
    };
// ... existing code ...

// 视频播放完毕时触发的事件
window.s2j_onPlayOver = function () {
    clearInterval(timerPlayMax);
    clearInterval(timerPlayingFace);
    clearInterval(timerSign);

    if (0 == 1) {
        $('#div_preview1').show();
        if (ifFullScreen == 1) {
            player.toggleFullscreen();
        }
        return;
    }

    addCourseWarePlayRecord();
    updateCourseWareProcess(2);
    delCookie("playState");
    $("#jrks").removeAttr("disabled");
    $("#jrks").removeClass("inputstyle2_2").addClass("inputstyle2");

    // 获取当前视频的索引
    var currentVideoIndex = getCurrentVideoIndex();
    if (currentVideoIndex !== -1) {
        // 获取下一个视频的链接
        var nextVideoLink = getNextVideoLink(currentVideoIndex);
        if (nextVideoLink) {
            // 跳转到下一个视频
            window.location.href = nextVideoLink;
        }
    }
}

// 获取当前视频的索引
function getCurrentVideoIndex() {
    var videoLinks = document.querySelectorAll('.lis-inside-content h2[onclick]');
    for (var i = 0; i < videoLinks.length; i++) {
        if (videoLinks[i].getAttribute('onclick').includes(cwrid)) {
            return i;
        }
    }
    return -1;
}

// 获取下一个视频的链接
function getNextVideoLink(currentIndex) {
    var videoLinks = document.querySelectorAll('.lis-inside-content h2[onclick]');
    if (currentIndex + 1 < videoLinks.length) {
        var nextVideoOnClick = videoLinks[currentIndex + 1].getAttribute('onclick');
        var nextVideoLink = nextVideoOnClick.match(/'(.*?)'/)[1];
        return nextVideoLink;
    }
    return null;
}
    function addInfo() {
        let tip = document.createElement('p');
        tip.style.fontSize = '50px';
        tip.style.color = 'red';
        tip.style.textAlign = 'center';
        tip.textContent = '添加了一个自动播放下一个视频的功能';
        document.body.appendChild(tip);
    };
})()