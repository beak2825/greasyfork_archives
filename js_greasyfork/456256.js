// ==UserScript==
// @name         济南专业技术
// @namespace    https://github.com/aiyu0218/user-scripts/
// @version      0.1
// @description  继续教育公需科目专业科目辅助|自动播放下一个视频|自动跳过答题|一次刷完所有已选课程
// @author       aiyu0218
// @match        *://*.ghlearning.com/*
// @match        http://221.214.69.254:9091/*
// @homepageURL  https://greasyfork.org/scripts/389705-%E6%B2%B3%E5%8D%97%E4%B8%93%E6%8A%80%E5%9C%A8%E7%BA%BF%E8%BE%85%E5%8A%A9
// @supportURL   https://github.com/aiyu0218/user-scripts
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/456256/%E6%B5%8E%E5%8D%97%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/456256/%E6%B5%8E%E5%8D%97%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF.meta.js
// ==/UserScript==

(function () {
    'use strict';
    //基于https://github.com/huangdiv/user-scripts 修改

    function enterCourse() {
        if (document.querySelector(".item-box")) {
            for (var i = 0; i < document.querySelectorAll(".item-box").length; i++) {
                if (document.querySelectorAll(".sr-only")[i * 2].innerText != "100.0%") {
                    document.querySelectorAll(".item-box")[i].click();
                    break;
                }
            }
            setTimeout(function () {
                console.log("恭喜您完成已选的所有课程！");
                clearInterval(myTimer);
                alert("恭喜您完成已选的所有课程！");
            }, 2000);
        }
        let jindu = document.querySelector("#a span[du-html=sumschedule]");
        if (jindu) {
            if (!document.querySelector("#hnzjfz")) {
                document.querySelector("#defaultBtn > span.title").insertAdjacentHTML('afterEnd', "<div style=\"font-weight:700;float:left;line-height:30px;border:1px dashed\"><a href=https://greasyfork.org/zh-CN/scripts/389705-%E6%B2%B3%E5%8D%97%E4%B8%93%E6%8A%80%E5%9C%A8%E7%BA%BF%E8%BE%85%E5%8A%A9 target=_blank><span id=hnzjfz style=color:red;border-color:red>【河南专技在线辅助3.0】</span></a><div style=font-weight:600;color:#fff;line-height:20px><input checked id=switch type=checkbox> <label for=switch><span>总开关</span></label> <input checked id=mute type=checkbox onclick='this.checked?document.querySelector(\"#speaker\")&&(document.querySelector(\"#speaker\").parentElement.click(),console.log(\"静音\")):document.querySelector(\"#unspeaker\")&&(document.querySelector(\"#unspeaker\").parentElement.click(),console.log(\"取消静音\"))'> <label for=mute><span>静音</span></label></div></div>");
            }
            if (jindu.innerText != "100.00") {
                if (document.querySelector("#bplayer-ffplayer")) {
                    //let playerH5 = document.querySelector(".pv-video");
                    // document.querySelector("#mute").checked ? playerH5.volume = 0 : null;
                    // if (playerH5.paused) {
                    //     playerH5.play();
                    // }
                    if (document.querySelector("#mute").checked) {
                        document.querySelector('#speaker') && document.querySelector('#speaker').parentElement.click();
                    } else {
                        document.querySelector('#unspeaker') && document.querySelector('#unspeaker').parentElement.click();
                    }
                    if (!document.querySelector("#stop")) {
                        document.querySelector("#play").parentElement.click();
                    }
                }
                let dangqian = document.querySelector(".videoLi.active");
                if (dangqian.innerText.match(/单元测试/)) {
                    location.reload();
                } else if (document.querySelector("button.pv-ask-skip.pv-hide")) {
                    console.info("跳过答题")
                    document.querySelector("button.pv-ask-skip.pv-hide").click();
                } else if (dangqian.innerText.match(/[0-9]+%/)[0] == "100%" && document.querySelector(".pt5 [class=progress-bar]")) {
                    console.info("下一节")
                    document.querySelector(".pt5 [class=progress-bar]").parentElement.parentElement.click();
                    setTimeout("location.reload();", 2000);
                }else if(document.querySelector(".pv-paused button.pv-playpause")){
                    console.info("打开后第一次点击播放")
                    document.querySelector(".pv-paused button.pv-playpause").click();
                }
                console.log( dangqian.innerText);
            } else {
                history.back(-1);
            }
        }
    }
    let myTimer = setInterval(enterCourse, 3000);

})();
