// ==UserScript==
// @name         pterclub-auto-wof
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  猫站大转盘自动抽奖,安装后打开猫站大转盘页面,就会自动抽奖,打开console可以看到抽奖详情
// @author       wget
// @match        https://pterclub.com/wof.php*
// @match        https://pterclub.com/dowof.php*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/422051/pterclub-auto-wof.user.js
// @updateURL https://update.greasyfork.org/scripts/422051/pterclub-auto-wof.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var lotteryTimes=parseInt(localStorage.getItem('lotteryTimes'))
    if(!lotteryTimes){
        lotteryTimes=0;
    }
    var winning1Times=parseInt(localStorage.getItem('winning1Times'))
    if(!winning1Times){
        winning1Times=0;
    }
    var winning2Times=parseInt(localStorage.getItem('winning2Times'))
    if(!winning2Times){
        winning2Times=0;
    }
    var winning3Times=parseInt(localStorage.getItem('winning3Times'))
    if(!winning3Times){
        winning3Times=0;
    }
    var winning4Times=parseInt(localStorage.getItem('winning4Times'))
    if(!winning4Times){
        winning4Times=0;
    }
    var winning5Times=parseInt(localStorage.getItem('winning5Times'))
    if(!winning5Times){
        winning5Times=0;
    }
    var winning6Times=parseInt(localStorage.getItem('winning6Times'))
    if(!winning6Times){
        winning6Times=0;
    }


    window.alert = function(message){
        lotteryTimes++;
         if(message.indexOf('一等奖')==0){
             winning1Times++;
         }
        if(message.indexOf('二等奖')==0){
             winning2Times++;
         }
        if(message.indexOf('三等奖')==0){
             winning3Times++;
         }
        if(message.indexOf('四等奖')==0){
             winning4Times++;
         }
        if(message.indexOf('五等奖')==0){
             winning5Times++;
         }
        if(message.indexOf('六等奖')==0){
             winning6Times++;
         }
         localStorage.setItem('lotteryTimes',lotteryTimes);
         localStorage.setItem('winning1Times',winning1Times);
        localStorage.setItem('winning2Times',winning2Times);
        localStorage.setItem('winning3Times',winning3Times);
        localStorage.setItem('winning4Times',winning4Times);
        localStorage.setItem('winning5Times',winning5Times);
        localStorage.setItem('winning6Times',winning6Times);

        console.log('已抽奖次数:'+lotteryTimes+',本次抽奖结果:'+message+',还可以抽奖次数:'+parseInt(parseInt($('b')[0].innerText.substr(7).replaceAll(',',''))/2000));
        console.log('已中一等奖次数:'+winning1Times);
        console.log('已中二等奖次数:'+winning2Times);
        console.log('已中三等奖次数:'+winning3Times);
        console.log('已中四等奖次数:'+winning4Times);
        console.log('已中五等奖次数:'+winning5Times);
        console.log('已中六等奖次数:'+winning6Times);
    };


     var wait = ms => new Promise(resolve => setTimeout(resolve, ms))

     if(window.location.href.indexOf('https://pterclub.com/wof.php')==0){
         wait(5000).then(() => {
                $('#inner').click();
            });
     }
})();