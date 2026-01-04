// ==UserScript==
// @name         职业培训自动播放
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  厦门市职业技能培训总站自动播放下一个视频
// @author       mouc
// @include      /http?:\/\/xmaqsc\.zyk\.yxlearning\.com\/learning/.*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @run-at       document-idle
// @license      MIT License
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399347/%E8%81%8C%E4%B8%9A%E5%9F%B9%E8%AE%AD%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/399347/%E8%81%8C%E4%B8%9A%E5%9F%B9%E8%AE%AD%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const delay = 10000;//重试间隔
    let play = ()=>{
       //$('.polyvFlashObject')[0].j2s_resumeVideo();
        $($(".pv-video"))[0].play()
    };

    var interval = null;//计时器

    function start(){
        if (interval != null){
            clearInterval(interval);
            interval = null;
        }

        //每隔delay毫秒恢复播放
        interval = setInterval(() => {

        //if( $('.polyvFlashObject').length === 1 ){
        if($(".pv-video").length === 1){
            console.warn("检测到播放器, 正在重试恢复播放...")
            if ($($($(".beginstyle")[1])[0]).children()[1].innerText < 100){
                play();
            }
            else
            {
                console.warn("检测到总进度为100， 停止播放于"+ (new Date).toString());
                g_blinkid = setInterval(blinkNewMsg, 1000);
                stop();
            }
        }else{
            console.error("没有检测到播放器, " + delay + "毫秒后重试...");
        }
        }, delay);
    }

    start();

    function stop(){
        //$('.polyvFlashObject')[0].j2s_stopVideo();
        $($(".pv-video"))[0].pause()
        clearInterval(interval);
		interval = null;
    }

    //页面激活判断
var hiddenProperty = 'hidden' in document ? 'hidden' :
    'webkitHidden' in document ? 'webkitHidden' :
    'mozHidden' in document ? 'mozHidden' :
    null;
var visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
var onVisibilityChange = function(){
    if (!document[hiddenProperty]) {
        console.log('页面非激活');
    }else{
        console.log('页面激活');
    }
}
document.addEventListener(visibilityChangeEvent, onVisibilityChange);


//网站标题闪动提示
var g_blinkid = 0;
var g_blinkswitch = 0;
var g_blinktitle = document.title;
var g_onlineuser = "";
var g_sysmsg_sound = null;
var g_newmsg_sound = null;
var g_app_num = 0;
var g_appnum = 0;
var g_bappmore = false;
var g_inputtime = 0;
function blinkNewMsg()
{

 document.title = g_blinkswitch % 2==0 ? "【　　　  】 - " + g_blinktitle : "【播放完成了】 - " + g_blinktitle;
 g_blinkswitch++;

}

function stopBlinkNewMsg()
{

    if (g_blinkid)
    {
        clearInterval(g_blinkid);
        g_blinkid = 0;
        document.title = g_blinktitle;
    }
}

    // Your code here...
})();