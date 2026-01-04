// ==UserScript==
// @name         超星网课视频秒过
// @namespace    http://tampermonkey.net/
// @
// @version      0.2.1
// @description  本脚本用于超星学习通视频快速学习。
// @author       Master-cai
// @match        https://mooc1-1.chaoxing.com/mycourse/studentstudy*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397337/%E8%B6%85%E6%98%9F%E7%BD%91%E8%AF%BE%E8%A7%86%E9%A2%91%E7%A7%92%E8%BF%87.user.js
// @updateURL https://update.greasyfork.org/scripts/397337/%E8%B6%85%E6%98%9F%E7%BD%91%E8%AF%BE%E8%A7%86%E9%A2%91%E7%A7%92%E8%BF%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var rate = 1; //默认播放速度 在此修改
    var Mute = false;
    $(".tabtags").append(`<form><p style="font-size:125%; display:inline">播放速率: </p><input id="rateInput" type="text" value=${rate} name="textName" style="border: 1px solid; display:inline;" size="1"> <p style="color:red; display:inline;font-size:125%;">(最高16倍)</p> </form>`);
    $(".tabtags").append('<div><button class="button1" style="display:inline">调整速率</button> </div>');
    // $(".tabtags").append(`<div>当前播放速率: ${rate} </div>`);

    $(".button1").on('click', function() {
        rate = document.getElementById("rateInput").value;
        window.addEventListener('mouseout', function (event) {
            event.stopPropagation();
        }, true);
        document.querySelector('iframe').contentDocument.querySelector('iframe').contentDocument.querySelector('video').playbackRate=rate;
        var doc=$("#iframe").contents().find('iframe').contents();
        if(doc.find('.vjs-play-control').eq(0).text()=="播放")setTimeout("var doc=$('#iframe').contents().find('iframe').contents();doc.find('.vjs-play-control').eq(0).click();",100);

         if(doc.find('.vjs-vol-3').eq(0)!=null)doc.find('.vjs-vol-3').eq(0).click();


        var interval = setInterval(function(){
            var l = document.querySelector('iframe').contentDocument.querySelector('iframe').contentDocument.querySelectorAll("[name='ans-videoquiz-opt']");
            if (l.length != 0){
                if(l[0].value==="true"){
                    l[0].checked=true;
                }
                else{
                    l[1].checked=true;
                };
                document.querySelector('iframe').contentDocument.querySelector('iframe').contentDocument.querySelectorAll("[class='ans-videoquiz-submit']")[0].click();
                clearInterval(interval);
            };
            return;
        }, 3000);
     })

//    document.onclick=function(event){

//    };
})();