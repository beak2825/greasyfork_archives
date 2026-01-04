// ==UserScript==
// @name         中国铁塔e学自动挂课
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  中国铁塔e学自动挂课脚本
// @license      MIT
// @author       Weene feng Modify Script from  HuangDingYun
// @match        https://elearning.chinatowercom.cn/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chinatowercom.cn
// @grant             unsafeWindow
// @grant             GM_openInTab
// @grant             GM.openInTab
// @grant             GM_getValue
// @grant             GM.getValue
// @grant             GM_setValue
// @grant             GM.setValue
// @grant             GM_xmlhttpRequest
// @grant             GM.xmlHttpRequest
// @grant             GM_registerMenuCommand
// @grant             GM_addValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/475889/%E4%B8%AD%E5%9B%BD%E9%93%81%E5%A1%94e%E5%AD%A6%E8%87%AA%E5%8A%A8%E6%8C%82%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/475889/%E4%B8%AD%E5%9B%BD%E9%93%81%E5%A1%94e%E5%AD%A6%E8%87%AA%E5%8A%A8%E6%8C%82%E8%AF%BE.meta.js
// ==/UserScript==


var $ = unsafeWindow.jQuery;

var classList = new Array();

var classList1 = new Array();

var nowCount = 0;

var divButton = '<div class="item" onclick="startAutoClass()"> <div id="startAutoPlayer" class="view"> <i class="iconfont icon-play"></i> <div class="text">自动挂课</div> </div> </div>';

var mideaButton = '<div id="clcikPlay" class="item" onclick="playMedil()"> <div id="startPlay" class="view"> <i class="iconfont icon-play"></i> <div class="text">播放</div> </div> </div>';

(function() {
    'use strict';
    setTimeout(function(){
        var url=window.location.hash
        var urlStr=url.toString()
        //增加页面功能按钮
        if(urlStr.match("/study/subject/detail/")){
            $("#D72toolbarTab").append(divButton)
        }
        //判断是否是课程页面
        if($("div.vjs-control-bar").length!=0){
            console.log("检测播放进度")
            isFinished()
        }
    },2500);

    setTimeout(function(){
        if($("button.videojs-referse-btn").length!=0){
            console.log("开始播放")
            playMedil()
        }
    },4000);
    // Your code here...
})();

unsafeWindow.startAutoClass =function (){

    $("div.item.current-hover").each(function(index,element){
        if($(this).find("i.icon-reload").length==0 && $(this)[0].firstElementChild.querySelector("span.section-type").innerText == "课程"){
             classList1.push($(this).attr("id"))
        }
    })
    console.log(classList1)
    if(classList1.length!=0){
        openClassPage2(0)
    }else{
        alert("已经完成当前课题下的全部课程！")
    }
}


GM_onMessage('_.unique.name.greetings', function(src, message) {
    console.log('[onMessage]', src, '=>', message);
    nowCount++;
    if(nowCount<classList1.length){
    openClassPage2(nowCount)
    }
})

function GM_onMessage(label, callback) {
  GM_addValueChangeListener(label, function() {
    callback.apply(undefined, arguments[2]);
  });
}

function GM_sendMessage(label) {
  GM_setValue(label, Array.from(arguments).slice(1));
}

function isFinished(){
    let timer =setTimeout(function () {
        if($("div.anew-text").length!=0&&$("div.anew-text").text()=="您已完成该课程的学习"){
             //console.log("12312313")
            GM_sendMessage('_.unique.name.greetings', window.location.href,"finished at "+new Date());
             window.close();
        }else{
        //console.log("学习中");
        isFinished()
        }
    }, 1000)
}

function openClassPage2(nowCount){
    console.log($("div#"+classList1[nowCount]))
   $("div#"+classList1[nowCount]).click();
}

unsafeWindow.playMedil = function(){
   let timer =setTimeout(function () {
       if($(".videojs-referse-btn.vjs-hidden").length==0){
           if($("button.videojs-referse-btn").length!=0){
            if($("span.vjs-control-text:contains(', opens captions settings dialog')").length!=0){
                $("span.vjs-control-text:contains(', opens captions settings dialog')").remove();
            }
         $("span.vjs-control-text").click()
        }
       }
       unsafeWindow.playMedil();
    }, 2000)
}

function play(index){
    setTimeout(function(){
        if(index<$("span.vjs-control-text").length){
            console.log(index);
            $("span.vjs-control-text").get(index).click();
            index++;
            play(index);
        }
    },2000);
}