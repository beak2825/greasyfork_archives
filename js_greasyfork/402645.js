// ==UserScript==
// @name         美和易思MOOT|十一
// @namespace    fooor.cn
// @version      11.1
// @description 美和易思MOOT去鼠标检测,快进，倍速，自动下一章|十一
// @author       十一
// @match        *://*.51moot.net/server_hall_2/server_hall_2/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402645/%E7%BE%8E%E5%92%8C%E6%98%93%E6%80%9DMOOT%7C%E5%8D%81%E4%B8%80.user.js
// @updateURL https://update.greasyfork.org/scripts/402645/%E7%BE%8E%E5%92%8C%E6%98%93%E6%80%9DMOOT%7C%E5%8D%81%E4%B8%80.meta.js
// ==/UserScript==
(function () {
    'use strict';
    var speed = 0;//倍速开关  3：默认1倍速；2：1.2倍速；1：1.5倍速；0：2倍速

    console.log("本脚本出生于2018-9-10，功能原创，请勿盗版！")
    $.ajax({
        type: "get",
        url: window.location.href,
        success: function (response) {
            var pattern = /polyvPlayer([\s\S]*)w/;
            if (!pattern.test(response)){
                return;
            }
            player.destroy();
            //$('.pv-video-player').remove();
            console.log('执行');
            var arr = pattern.exec(response);
            var jsText = arr[0].slice(0,arr[0].length-6)
            jsText = `var player = ${jsText}`
            var js =  jsText.replace('ban_seek_by_limit_time','off').replace('false','[2, 1.5, 1.2]');
            eval(js);
        },

    });


    var html = `
        <div style="position: absolute;top:20px;right: 100px; background-color: black;color:#fff;">
        <label style="color:#fff"><input type="checkbox" id="autoplay"  onclick="autopalyclick()"  />自动播放</label>
        </div>
        <script>
        if (localStorage.getItem("autoplay") ==='true'){
            $("#autoplay").prop("checked","trure")
         }else{
            $("#autoplay").prop("checked",false)
         }
        function autopalyclick(){

            if  (!$('#autoplay').is(":checked")){
                localStorage.setItem("autoplay",'false');

            }else{
                localStorage.setItem("autoplay",'true');
            }

        };
    </script>
    `;

    $('body').append(html);
    $('.tipText').text('小提示：可以随意拖拽~ 但是拖拽不能使进度100%,倍速功能可以100%');
    window.s2j_onPlayStart = function(){
         $(`.pv-rate-select div:eq(${speed})`).click();
    }
    window.s2j_onPlayOver =function(){
        if (localStorage.getItem("autoplay") !=='true'){
            return
        }
        if ($('.active').next().length>0) {
            $('.active').next().click()
        }else{
            $('.active').parents('.vedio-play-conts-left-chapter').next().children('.vedio-play-conts-left-chapter-list').children().children()[0].click()
        }
    }
    window.s2j_onReadyPlay =function(){
       player.j2s_resumeVideo()
    }
    window.s2j_onPlayerInitOver=function(){
        player.j2s_setVolume(0)
    }
    window.onblur = null;
})();

