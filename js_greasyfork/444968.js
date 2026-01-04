// ==UserScript==
// @name         济宁专技在线辅助
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  自动播放下一个视频|自动跳过答题
// @author       jnjxjy
// @icon         data:image/png;base64,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
// @match        *://*.yxlearning.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/444968/%E6%B5%8E%E5%AE%81%E4%B8%93%E6%8A%80%E5%9C%A8%E7%BA%BF%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/444968/%E6%B5%8E%E5%AE%81%E4%B8%93%E6%8A%80%E5%9C%A8%E7%BA%BF%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function () {
    //'use strict';


/*
    //++++++++++++++++++
    // 老版的flash播放器功能区：
    // 接口说明：http://dev.polyv.net/2013/videoproduct/v-playerapi/v-playerapi-event/jsbf0001/

    function resume() {
        player.j2s_resumeVideo();
    }

    function pause() {
        player.j2s_pauseVideo();
    }

    function seek(sec) {
        player.j2s_seekVideo(sec);
    }

    function stop() {
        player.j2s_stopVideo();
    }

    function vol(v) {
        player.j2s_setVolume(v);
    }

    function nextVideo(vid) {
        player.changeVid(vid);
    }

    function hide() {
        player.j2s_hideInterAction();
    }

    function fixFuc() {
        window.s2j_onVideoPause = function () {
            console.log('触发暂停(手动触发或弹题触发)，已处理，继续播放');
            setTimeout(hide, 2000); //去掉答题弹窗
            setTimeout(resume, 3000);
        }
    }

    function toNext() {
        var text = $('li[id][class=active]')[0].innerText;
        console.log(text);
        setTimeout(function () {
            if ($('button[id][class="btn btn-primary"][style="display:inline-block"]')[0].innerText ==
                "返回课程列表") {
                console.log('课程进度完成，即将返回课程列表');
                history.back(-1);
            }
            if (text != $('li[id][class=active]')[0].innerText) {
                text = $('li[id][class=active]')[0].innerText;
                console.log(text);
            }
            if (text.match(/[0-9]+%/)[0] == "100%") {
                seek(player.j2s_getDuration() - 1);
                resume();
                console.log('视频进度完成，播放下一个视频');
            } else if (playerH5.currentTime > playerH5.duration - 9) {
                seek(0);
                setTimeout(resume, 1000);
                console.log('视频进度未完成，从头重播');
            } else {
                setTimeout(arguments.callee, 5000);
            }
        }, 5000);

    }
    //++++++++++++++++++



    //++++++++++++++++++
    //新版的Html5播放器功能区：

    function resumeH5() {
        if (playerH5.paused) {
            playerH5.play();
        }
    }

    function pauseH5() {
        if (!playerH5.paused) {
            playerH5.pause();
        }
    }

    function seekH5(sec) {
        playerH5.currentTime = sec;
    }

    function volH5(v) {
        playerH5.volume = v;
    }

    function hideH5() {
        if (document.getElementsByClassName("pv-ask-modal-wrap")[0]) {
            document.getElementsByClassName("pv-ask-modal-wrap")[0].style.display = 'none'; //去掉弹题框
        }
    }

    function fixFucH5() {
        window.s2j_onVideoPause = function () {
            console.log('触发暂停，已处理，视频进度会继续增加。');
        }
        window.onQuestionPopUp = function () {
            console.log('弹出题目，已处理。');
            hideH5();
            setTimeout(resumeH5, 1000);
        }
    }

    function toNextH5() {
        var text = $('li[id][class="clearfix active"]')[0].innerText;
        console.log(text);
        setTimeout(function () {
            if ($('button[id][class="btn btn-primary"][style="display:inline-block"]')[0].innerText ==
                "返回课程列表") {
                console.log('课程进度完成，即将返回课程列表');
                history.back(-1);
            }
            if (text != $('li[id][class="clearfix active"]')[0].innerText) {
                text = $('li[id][class="clearfix active"]')[0].innerText;
                console.log(text.match(/[0-9]+%/)[0]);
            }
            if (text.match(/[0-9]+%/)[0] == "100%") {
                seekH5(playerH5.duration - 1);
                setTimeout(resumeH5, 1000);
                console.log('视频进度完成，即将播放下一个视频');
            } else if (playerH5.currentTime > playerH5.duration - 5) {
                seekH5(0);
                setTimeout(resumeH5, 1000);
                console.log('视频进度未完成，从头重播');
            } else {
                setTimeout(arguments.callee, 3000);
            }
        }, 3000);
    }
    //++++++++++++++++++


    //++++++++++++++++++
    //主要功能区：

    function start() {
        console.log('视频播放器初始化完成');
        clearInterval(myTimer);
        //以下是针对老版的flash播放器。
        if (document.getElementsByClassName("polyvFlashObject")[0]) {
            player = document.getElementsByClassName("polyvFlashObject")[0];
            setTimeout(hide, 3000);
            setTimeout(resume, 2000); //自动播放
            console.log('切换视频后自动开始播放...');
            setTimeout(function () {
                vol(0);
            }, 3000); //静音
            setTimeout(fixFuc, 4000); //修改功能
            //setTimeout(pause,5000);//暂停视频播放,进度继续增加。
            setTimeout(toNext, 6000); //检测进度
        }

        //以下是针对新版的html5播放器，不断优化中...
        if (document.getElementsByClassName("pv-video")[0]) {
            playerH5 = document.getElementsByClassName("pv-video")[0];
            fixFucH5();
            resumeH5();
            volH5(0);
            toNextH5();
            setTimeout(hideH5, 3000);
        }
    }
*/
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
            if (!document.querySelector("#hnzjfz")){
                document.querySelector("#defaultBtn > span.title").insertAdjacentHTML('afterEnd',"<a  target = '_blank'><span id='hnzjfz' style= 'font-weight: 700;float: left;color: #ff0000;line-height: 30px;'>【济宁专技在线辅助1.0】<br>&nbsp正在运行中...</span></a>");
            }
            if (jindu.innerText != "100.00") {
                if (document.querySelector(".pv-video")) {
                    let playerH5 = document.querySelector(".pv-video");
                    playerH5.volume = 0;
                    if (playerH5.paused) {
                        playerH5.play();
                    }
                }
                let dangqian = document.querySelector(".videoLi.active");
                if (dangqian.innerText.match(/单元测试/)){
                    location.reload();
                } else if (dangqian.innerText.match(/[0-9]+%/)[0] == "100%" && document.querySelector(".pt5 [class=progress-bar]")){
                    document.querySelector(".pt5 [class=progress-bar]").parentElement.parentElement.click();
                    setTimeout("location.reload();",2000);
                }
                console.log("【济宁专技在线辅助】\n" + dangqian.innerText);
            } else {
                history.back(-1);
            }
        }
    }
    let myTimer = setInterval(enterCourse, 3000);

})();

(function() {
    'use strict';

    // Your code here...
    clearInterval(myTimer);
    function enterCourse() {
        var a = document.getElementsByTagName("BUTTON");
            for (var i = 0; i < a.length; i++) {
                if(a[i].innerHTML=="跳过")
                    a[i].click();
            }
    }
    var myTimer = setInterval(enterCourse, 3000);
})();

//#新增自动点击题库2023.05.30

(function() {
    'use strict';

    var xzt=0
    function zy(){
        var tm=document.querySelectorAll('tr>td')
     for (var i=0;i<tm.length;i++){
            if(tm[i].innerText=='未完成学习'){
            tm[i+3].querySelector('button.btn.btn-link.btn-block').click()
                //document.querySelectorAll('tr>td')[11].querySelector('button.btn.btn-link.btn-block').click()
            }
        }
    }
    setInterval(zy,5000)

    function dati(){
        var xuanxiang=document.querySelectorAll(" div > div.pv-ask-modal-wrap > div > div.pv-ask-content.pv-ask-content-noimg > div.pv-ask-right > div > div > label")
        var Tijiao=document.querySelector("div > div.pv-ask-modal-wrap > div > div.pv-ask-foot > button.pv-ask-submit")//.click()
        if(document.getElementsByClassName('ccQuestionList').length>0){
            setTimeout(datixuan,2000)
        }
        if(xuanxiang.length>0){
            if(xzt>=xuanxiang.length){xzt=0}
            xuanxiang[xzt].click()
            Tijiao.click()
                xzt++
        }
       if(document.getElementById('rightBtn')!==null){
       document.getElementById('rightBtn').click()
       }
    }
    setInterval(dati,10000)
    function setCookie(cname,cvalue,exdays){

            var d = new Date();

            d.setTime(d.getTime()+(exdays*24*60*60*1000));

            var expires = "expires="+d.toGMTString();

            document.cookie = cname+"="+cvalue+"; "+expires;
        }

        function getCookie(cname){
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for(var i=0; i<ca.length; i++) {
                var c = ca[i].trim();
                if (c.indexOf(name)==0) { return c.substring(name.length,c.length); }
            }
            return "";
        }

        function createElement(dom,domId){

            var rootElement = document.body;

            var newElement = document.createElement(dom);

            newElement.id = domId;

            var newElementHtmlContent = document.createTextNode('');

            rootElement.appendChild(newElement);

            newElement.appendChild(newElementHtmlContent);

        }

        function toast(msg,duration){

            duration=isNaN(duration)?3000:duration;

            let toastDom = document.createElement('div');

            toastDom.innerHTML = msg;

            toastDom.style.cssText='padding:2px 15px;min-height: 36px;line-height: 36px;text-align: center;transform: translate(-50%);border-radius: 4px;color: rgb(255, 255, 255);position: fixed;top: 50%;left: 50%;z-index: 9999999;background: rgb(0, 0, 0);font-size: 16px;'

            document.body.appendChild(toastDom);

            setTimeout(function() {

                var d = 0.5;

                toastDom.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';

                toastDom.style.opacity = '0';

                setTimeout(function() { document.body.removeChild(toastDom) }, d * 1000);

            }, duration);

        }
    function QT() {
		var d1 = document.getElementsByClassName('first-tab')[0];
		var img = document.createElement("img");
		img.style = "width:230px; height:230px;"
		img.src = "https://img.nuannian.com/files/images/23/0305/1677989951-1403.jpg";
		d1.appendChild(img);
	}
	setTimeout(QT, 3245)
    function datixuan(){
        var dtfu=document.getElementsByClassName('ccQuestionList')[0]
        dtfu.querySelectorAll('li>i')[0].click()
            $('#ccQuestionSubmit').click()
            $('#rightBtn').click()
        setTimeout(function (){
        dtfu.querySelectorAll('li>i')[1].click()
            $('#ccQuestionSubmit').click()
            $('#rightBtn').click()
        },2000)
        setTimeout(function (){
        dtfu.querySelectorAll('li>i')[2].click()
            $('#ccQuestionSubmit').click()
            $('#rightBtn').click()
        },4000)
        setTimeout(function (){
        dtfu.querySelectorAll('li>i')[3].click()
            $('#ccQuestionSubmit').click()
            $('#rightBtn').click()
        },6000)
    }
    // Your code here...
})();