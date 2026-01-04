// ==UserScript==
// @name         师加网多主题自动切换/课程自动播放
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  师加网,多主题课程自动切换播放!自动判断未完成课程!
// @author       JCB
// @match        http://nlts.teacherplus.cn/project/course/*
// @match        http://nlts.teacherplus.cn/learning/course/*
// @match        http://nlts.teacherplus.cn/learning/task*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438308/%E5%B8%88%E5%8A%A0%E7%BD%91%E5%A4%9A%E4%B8%BB%E9%A2%98%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E8%AF%BE%E7%A8%8B%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/438308/%E5%B8%88%E5%8A%A0%E7%BD%91%E5%A4%9A%E4%B8%BB%E9%A2%98%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E8%AF%BE%E7%A8%8B%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var currenthref=location.href;
    //1.主题切换
    if(currenthref && currenthref.startsWith("http://nlts.teacherplus.cn/project/course/")){
        //课程主题列表
        var themeList=$("tr");
        //setInterval(function() {
        //},10000)
        for(var i=0;i<themeList.length;i++){
            var trList = themeList[i].children;
            if(trList[3].innerText.trim()=="100.00%"){
                continue;
            }
            //alert(i+1+","+trList[4].firstElementChild.href);
            location.href=trList[4].firstElementChild.href;
            break;
        }
    }
    //2.进入课程播放页面
    if(currenthref && currenthref.startsWith("http://nlts.teacherplus.cn/learning/course/")){
        //课程列表
        var taskList = $(".task");
        for(var j=0;j<taskList.length;j++){
            var titList = taskList[0].firstElementChild.children;
            if(titList[0].title=="完成")continue;
            location.href=titList[4].firstElementChild.href;
            break;
        }
    }
    //3.自动播放课程
    if(currenthref && currenthref.startsWith("http://nlts.teacherplus.cn/learning/task")){
        //主题中的视频列表
        var ahref = $("a[href^='/learning/task']");
        var index = 0;
        setInterval(function() {
            //左下角按键(播放/暂停/重播)
            var playbutton = $('.vjs-control-bar :button')[0];
            //播放完成后的弹窗确认键
            var confirmbutton = $('.modal-footer :button')[0];
            if(confirmbutton){
                confirmbutton.click();
            }
            if(playbutton.title=="Play"){
                playbutton.click();
                return;
            }else if(playbutton.title=="Replay"){
                for(var i=0;i<ahref.length;i++){
                    if(ahref[i]==currenthref){
                        index=i+1;
                        break;
                    }
                }
                if(index<ahref.length) {
                    location.href=ahref[index].href;
                }else{
                    location.href=$("a[href^='/project/course']")[0].href;
                }
            }
        }, 5000);
        //查看进度按钮
        function css(css) {
            var myStyle = document.createElement('style');
            myStyle.textContent = css;
            var doc = document.head || document.documentElement;
            doc.appendChild(myStyle);
        }
        css(`#zuihuitao {cursor:pointer; position:fixed; top:100px; left:0px; width:0px; z-index:2147483647; font-size:12px; text-align:left;}
			#zuihuitao .logo { position: absolute;right: 0; width: 1.375rem;padding: 10px 2px;text-align: center;color: #fff;cursor: auto;user-select: none;border-radius: 0 4px 4px 0;transform: translate3d(100%, 5%, 0);background: deepskyblue;}
			.add{background-color:#FE2E64;}`);

        var html = $(`<div id='zuihuitao'>
		    <div class='item_text'>
		        <div class="logo"><a id="m">查看进度</a></div>
				</div>`);
        $("body").append(html);
        $("#m").bind("click", () => {
            window.open($("a[href^='/learning/course']")[0].href);
        });
    }
})();