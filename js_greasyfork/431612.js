// ==UserScript==
// @name         wof-haresclub
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  白兔自动大转盘抽奖
// @author       source
// @match        https://club.hares.top/wof.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431612/wof-haresclub.user.js
// @updateURL https://update.greasyfork.org/scripts/431612/wof-haresclub.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //参与奖统计
    var participationAwardTimes=parseInt(localStorage.getItem('participationAwardTimes'))
    if (!participationAwardTimes){ participationAwardTimes=0; }
    //六等奖统计
    var sixthPrizeTimes=parseInt(localStorage.getItem('sixthPrizeTimes'))
    if(!sixthPrizeTimes){ sixthPrizeTimes=0; }
    //五等奖统计
    var fifthPrizeTimes=parseInt(localStorage.getItem('fifthPrizeTimes'))
    if(!fifthPrizeTimes){ fifthPrizeTimes=0; }
    //四等奖统计
    var fourthPrizeTimes=parseInt(localStorage.getItem('fourthPrizeTimes'))
    if(!fourthPrizeTimes){ fourthPrizeTimes=0; }
    //三等奖统计
    var thirdPrizeTimes=parseInt(localStorage.getItem('thirdPrizeTimes'))
    if(!thirdPrizeTimes){ thirdPrizeTimes=0; }
    //二等奖统计
    var secondPrizeTimes=parseInt(localStorage.getItem('secondPrizeTimes'))
    if(!secondPrizeTimes){ secondPrizeTimes=0; }
    //一等奖统计
    var firthPrizeTimes=parseInt(localStorage.getItem('firthPrizeTimes'))
    if(!firthPrizeTimes){ firthPrizeTimes=0; }
    //抽奖总次数
    var clicks=parseInt(localStorage.getItem('clicks'))
    if(!clicks){ clicks=0; }

    window.alert = function(mesg){
        //中奖结果统计
        if(mesg.indexOf('【参与奖】')==0){ participationAwardTimes++; }
        if(mesg.indexOf('【六等奖】')==0){ sixthPrizeTimes++; }
        if(mesg.indexOf('【五等奖】')==0){ fifthPrizeTimes++; }
        if(mesg.indexOf('【四等奖】')==0){ fourthPrizeTimes++; }
        if(mesg.indexOf('【三等奖】')==0){ thirdPrizeTimes++; }
        if(mesg.indexOf('【二等奖】')==0){ secondPrizeTimes++; }
        if(mesg.indexOf('【一等奖】')==0){ firthPrizeTimes++; }
        //抽奖次数
        clicks++;
        //保存中奖数据
        localStorage.setItem('participationAwardTimes', participationAwardTimes);
        localStorage.setItem('sixthPrizeTimes', sixthPrizeTimes);
        localStorage.setItem('fifthPrizeTimes', fifthPrizeTimes);
        localStorage.setItem('fourthPrizeTimes', fourthPrizeTimes);
        localStorage.setItem('thirdPrizeTimes', thirdPrizeTimes);
        localStorage.setItem('secondPrizeTimes', secondPrizeTimes);
        localStorage.setItem('firthPrizeTimes', firthPrizeTimes);
        localStorage.setItem('clicks', clicks);
        //输出到 console
        var restClick=parseInt(parseInt($('b')[0].innerText.substr(7).replaceAll(',',''))/2000)
        console.log('本次抽奖结果: %s，累计抽奖次数: %d，还可以抽奖次数: %d', mesg, clicks, restClick);
        console.log('谢谢参与次数: %d', participationAwardTimes);
        console.log('已中六等奖次数: %d', sixthPrizeTimes);
        console.log('已中五等奖次数: %d', fifthPrizeTimes);
        console.log('已中四等奖次数: %d', fourthPrizeTimes);
        console.log('已中三等奖次数: %d', thirdPrizeTimes);
        console.log('已中二等奖次数: %d', secondPrizeTimes);
        console.log('已中一等奖次数: %d', firthPrizeTimes);
    };

    var wait = ms => new Promise(resolve => setTimeout(resolve, ms))
    wait(5000).then(() => { $('#inner').click(); });
})();
