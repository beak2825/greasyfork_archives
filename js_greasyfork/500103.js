// ==UserScript==
// @name         🥇【华医网助手】huayiwang_完全免费_无人值守_自动播放|另有代挂_全自动_安全可靠_过人脸_全网最低价
// @namespace    http://tampermonkey.net/
// @version      1.6.7
// @description  huayiwang, 华医网，自动播放，自动静音，屏蔽答题，调整视频质量为最低，当前视频播放结束自动进入下一个视频，播放结束清理无用定时器
// @author       华医网助手
// @license      AGPL License
// @match        *://*.91huayi.com/course_ware/course_ware_polyv.aspx?*
// @match        *://*.91huayi.com/pages/exam.aspx?*
// @match        *://*.91huayi.com/pages/exam_result.aspx?*
// @match        *//*.wsglw.net/train/courseware/cc?*
// @match        *://*.91huayi.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500103/%F0%9F%A5%87%E3%80%90%E5%8D%8E%E5%8C%BB%E7%BD%91%E5%8A%A9%E6%89%8B%E3%80%91huayiwang_%E5%AE%8C%E5%85%A8%E5%85%8D%E8%B4%B9_%E6%97%A0%E4%BA%BA%E5%80%BC%E5%AE%88_%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%7C%E5%8F%A6%E6%9C%89%E4%BB%A3%E6%8C%82_%E5%85%A8%E8%87%AA%E5%8A%A8_%E5%AE%89%E5%85%A8%E5%8F%AF%E9%9D%A0_%E8%BF%87%E4%BA%BA%E8%84%B8_%E5%85%A8%E7%BD%91%E6%9C%80%E4%BD%8E%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/500103/%F0%9F%A5%87%E3%80%90%E5%8D%8E%E5%8C%BB%E7%BD%91%E5%8A%A9%E6%89%8B%E3%80%91huayiwang_%E5%AE%8C%E5%85%A8%E5%85%8D%E8%B4%B9_%E6%97%A0%E4%BA%BA%E5%80%BC%E5%AE%88_%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%7C%E5%8F%A6%E6%9C%89%E4%BB%A3%E6%8C%82_%E5%85%A8%E8%87%AA%E5%8A%A8_%E5%AE%89%E5%85%A8%E5%8F%AF%E9%9D%A0_%E8%BF%87%E4%BA%BA%E8%84%B8_%E5%85%A8%E7%BD%91%E6%9C%80%E4%BD%8E%E4%BB%B7.meta.js
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
        if (video.paused) {
            video.play();
        }
        if (window.player && window.player.getCurrentLevel() != 1) {
            window.player.changeLevel(1)
        }
        video.volume = 0;
        video.muted = true;
    }, 1000);

    function examherftest() {  //考试按钮激活状态检测
        var hreftest = document.getElementById("jrks").attributes["disabled"];
        if (!hreftest || hreftest.value != "disabled") { //考试按钮已激活
            //自动播放下一个视频的
            const targetElements = document.querySelectorAll("i[id='top_play']");
            const parentElement = targetElements[0].parentElement;
            const grandparentElement = parentElement.parentElement;

            const lis = document.querySelectorAll("li[class='lis-inside-content']");
            var index = Array.from(lis).findIndex(li => li === grandparentElement);//找出当前页面是第几个课程
            //console.log(index);
            if (index + 2 <= document.querySelectorAll("li[class='lis-inside-content']").length) {
                index += 2;
                //console.log("新的Index：" + index);
                document.querySelector("#top_body > div.video-container > div.page-container > div.page-content > ul > li:nth-child(" + index + ") > h2").click();
                setTimeout(function () {
                    document.evaluate("//button[contains(., '知道了')]", document, null, XPathResult.ANY_TYPE).iterateNext().click();
                }, 2000);
            } else {
                if ($('button:contains("未学习")').length > 0) {
                    $('button:contains("未学习")').siblings().eq(0).click();
                } else if ($('button:contains("学习中")').length > 0) {
                    $('button:contains("学习中")').siblings().eq(0).click();
                } else if ($('button:contains("待考试")').length > 0 && document.querySelector("a[id='mode']").innerText.indexOf("视频+考试") != -1) {
                    $('button:contains("待考试")').siblings().eq(0).click();
                } else {
                    console.log('没有找到任何按钮');
                    clearInterval(examInterval);
                };
            };
        };
    };

    function killQuestion() {
        (async function () {
            while (!window.player || !window.player.sendQuestion) {
                await sleep(20);
            };
            //console.log("课堂问答跳过插入");
            window.player.sendQuestion = function () {
                //console.log("播放器尝试弹出课堂问答，已屏蔽。");
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
                    console.log("检测到温馨提示对话框（不能拖拽），尝试跳过");//
                    //$("button[onclick='closeBangZhu()']").click();
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
                    //clearInterval(clockms);
                };
            } catch (err) {
                //console.log(err);
            };
        }, 2000);
    };

    function addInfo() {
        let tip = document.createElement('p');
        tip.style.fontSize = '50px';
        tip.style.color = 'red';
        tip.style.textAlign = 'center';
        tip.textContent = '有合作需求可加v: idpx1995';
        document.body.appendChild(tip);
    };
})()