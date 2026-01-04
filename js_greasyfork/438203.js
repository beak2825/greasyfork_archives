// ==UserScript==
// @name         AutoPlay
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  auto play video!
// @author       Confusion
// @match        http://mooc1-2.chaoxing.com/mycourse/studentstudy?*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/438203/AutoPlay.user.js
// @updateURL https://update.greasyfork.org/scripts/438203/AutoPlay.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var play_index = 1;
    var play_finish = true;

    function set_auto_play() {
        var title = window.top.document.evaluate('//*[@id="mainid"]/h1', document).iterateNext();
        var title_text = title.textContent.replace(/[\r\n\t]/g, "");

        var topWin = window.top.document.getElementById("iframe").contentWindow;
        var iframe1_element = topWin.document.evaluate('//*[@id="ext-gen1044"]/iframe', topWin.document).iterateNext();
        if (iframe1_element) {
            var status = topWin.document.evaluate('//*[@id="ext-gen1044"]', topWin.document).iterateNext();
            if (status && status.getAttribute("class").indexOf("ans-job-finished") == -1) {
                var topWin2 = iframe1_element.contentWindow;
                var video = topWin2.document.evaluate('//*[@id="video_html5_api"]', topWin2.document).iterateNext();
                if (video) {
                    video.playbackRate = 2;
                    video.muted = true;
                    video.play();
                    console.log("开始播放 " + title_text);
                    video.addEventListener('pause', function () { //暂停开始执行的函数
                        console.log("自动暂停播放");
                        if (video.ended) {
                            play_finish = true;
                            console.log("播放完成 " + title_text);
                        } else {
                            video.play();
                        }
                    });
                    return;
                }
            }
        }
        play_finish = true;
        console.log("任务跳过 " + title_text);
        return;
    }
    function play_next() {
        play_finish = false;
        var span_list = document.evaluate('//*[@id="coursetree"]/div/div/h4/a/span', document);
        for (var i = 1; i > 0; i++) {
            var element = span_list.iterateNext();
            if (!element){
                return;
            }
            if (i < play_index) {
                continue;
            }
            else {
                play_index += 1;
                setTimeout(set_auto_play, 3000);
                element.click();
                console.log('点击下一个');
                return;
            }
        };
    }
    function check() {
        console.log('状态检查');
        if (play_finish) {
            console.log('完成开始下一个');
            play_next();
        }
    }

    function find_current_and_start() {
        try{
            window.clearInterval(cheak_interval);
            console.log('清理成功');
        }catch{
            pass;
        }
        var show_status_elem = document.evaluate('//*[@id="tit5"]', document).iterateNext();
        show_status_elem.textContent = '自动学习中...';
        var span_list = document.evaluate('//*[@id="coursetree"]/div/div/h4', document);
        for (var i = 1; i > 0; i++) {
            var element = span_list.iterateNext();
            if (element.getAttribute("class") == "currents") {
                play_index = i;
                console.log('找到当前位置');
                var cheak_interval = setInterval(check, 5000);
                return;
            }
        }
    }
    window.onload = function () {
        var button = document.createElement("li"); //创建一个input对象
        var show_status = document.createElement("li"); //创建一个input对象
        button.id = "tit4";
        button.style.fontSize = "15px";
        button.textContent = "自动学习视频";
        show_status.id = "tit5";
        show_status.style.fontSize = "15px";
        show_status.style.color = "red";
        button.onclick = function (){
            find_current_and_start();
            return;
        };
        var x = document.evaluate('//*[@id="selector"]/div[1]/div[1]/ul', document).iterateNext();
        x.appendChild(button);
        x.appendChild(show_status);
    };
})();