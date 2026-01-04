// ==UserScript==
// @name         英华学堂刷课脚本
// @namespace    http://tampermonkey.net/
// @version      1.5.1
// @description  （已归档，仅供参考）自动播放下一集（仅在成都文理学院测试成功，其他学校没试）
// @author       LayFz
// @match        *://mooc.*
// @match        *://mooc.cdcas.com/user/*
// @grant        none
// @license    	 MIT
// @require https://update.greasyfork.org/scripts/502757/1422896/Jquery331.js
// @downloadURL https://update.greasyfork.org/scripts/473268/%E8%8B%B1%E5%8D%8E%E5%AD%A6%E5%A0%82%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/473268/%E8%8B%B1%E5%8D%8E%E5%AD%A6%E5%A0%82%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var playNext = function(){
        var localElement = $('.detmain-navlist ').parent().find('.item a').index($('a.on'));
        var sameChaperNameArray = $('.detmain-navlist ').parent().find('.item a');
        if(localElement == (sameChaperNameArray.length-1)){
            $('video')[0].onended = function(){
                 alert("Easy Easy，区区网课也敢班门弄斧！")
            }
        }else{
            setTimeout(function(){
                async : $(sameChaperNameArray[localElement+1])[0].click();
            },5000);
        }
    }
    $(document).ready(function(){
        var timer = setInterval(function(){
            if($('video').length && $('video')[0].readyState == 4){
                if($('video')[0].readyState == 4){
                    if($('video')[0].paused){
                        console.log("paused");
                        $('video')[0].play();
                    }
                    $('video')[0].onended = function(){
                        playNext();
                    }
                     $('video')[0].muted = true;
                    $('video')[0].playbackRate = 1.0;
                    $('video')[0].currentTime = 0;
                   // $('video')[0].volume = 0;
                    clearInterval(timer);
                }
            }
        },1000);
    });
})();