// ==UserScript==
// @name         qianuni.com-煤业+考试+企安e学vx:shuake345
// @namespace    shuake345
// @version      0.1
// @description  自动倍速看完视频
// @author       shuake345
// @match        https://*.qianuni.com/study/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509408/qianunicom-%E7%85%A4%E4%B8%9A%2B%E8%80%83%E8%AF%95%2B%E4%BC%81%E5%AE%89e%E5%AD%A6vx%3Ashuake345.user.js
// @updateURL https://update.greasyfork.org/scripts/509408/qianunicom-%E7%85%A4%E4%B8%9A%2B%E8%80%83%E8%AF%95%2B%E4%BC%81%E5%AE%89e%E5%AD%A6vx%3Ashuake345.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var daan=["17684998"]
    var Zyurl = 'courseDetails'
    var Cyurl = 'courseOutlineId'

    document.addEventListener("visibilitychange", function() {
        console.log(document.visibilityState);
        if (document.visibilityState == "hidden") {} else if (document.visibilityState == "visible") {
            if (document.URL.search(Zyurl) > 1) {
                setTimeout(sx, 1000)
            }
        }
    });

    function fh() {
        window.history.go(-1)
    }

    function gb() {
        window.close()
    }

    function sx() {
        window.location.reload()
    }

    function Zy() {
        if(document.querySelector('[style="color: rgb(9, 118, 254);"]')!==null){
            document.querySelector('[style="color: rgb(9, 118, 254);"]').click()
        }

    }

    function Cy() {
        if(document.getElementsByClassName('ccH5TimeTotal')[0]!==undefined){
            var alltime=document.getElementsByClassName('ccH5TimeTotal')[0].innerText.split(':')
            var allmiao
            switch (alltime.length){
                case 2:
                    allmiao = alltime[0]*60+alltime[1]-1
                    document.getElementsByTagName('video')[0].currentTime=allmiao
                    //setTimeout(back,5424)
                    break;
                case 3:
                    allmiao = alltime[0]*3600+alltime[1]*60+alltime[0]-1
                    document.getElementsByTagName('video')[0].currentTime=allmiao
                    //setTimeout(back,5424)
                    break;
                default://其他情况
            }
        }
    }

    function back(){
        document.querySelectorAll('div.back')[0].click()
    }

    function QT(){
        var d1=document.getElementsByClassName('dbs')[0];
        var img=document.createElement("img");
        img.style="width:230px; height:230px;"
        img.src="https://img.nuannian.com/files/images/23/0305/1677989951-1403.jpg";
        d1.appendChild(img);
    }
    setInterval(Cy, 5210)
    setInterval(Zy, 2210)

    function ks(){
        if(document.URL.search('exams')>1){
            var KStimu=document.querySelectorAll("div.answers-content > div > label> input")//[2].value='7945208'
            var 当前答案
            for (var i=0;i<KStimu.length;i++){//考试界面循环开始
                for (var l=0;l<timu.length;l++){//题库题目循环开始
                    if(KStimu[i].value==timu[l]){//界面题目i等于题库l题目，提取出答案l
                        //                         当前答案=daan[l]
                        var KSdaan=document.querySelectorAll('.answers-content>div')[i].querySelectorAll('label>span>div.option-content')//界面选项i答案中的3个选项进行比较
                        /*for (var m=0;m<KSdaan.length;m++){//界面选项答案m循环比较题库答案l
                            if(KSdaan[m].innerText==daan[l]){//这就是对的答案
                                KSdaan[m].click()
                                console.log(daan[l])
                                break;
                            }
                        }*/
                    }

                }
            }

        }
    }
    //setTimeout(ks,5424)

    function ksy(){
    if(document.URL.search('exams')>1){
    var x选项shuzi=document.querySelectorAll("div.answers-content > div > label> input")//[2].value='7945208'
    var duoxuan=document.querySelectorAll('[type="checkbox"]')
    var danxuan=document.querySelectorAll('[type="radio"]')
    for (var i=0;i<x选项shuzi.length;i++){
        for (var l=0;l<daan.length;l++){
    if(x选项shuzi[i].value==daan[l]){
    x选项shuzi[i].click()
    }
    }
    }

        for (var m=0;m<danxuan.length;m++){
        for (var n=0;n<daan.length;n++){
    if(danxuan[m].value==daan[n]){
    danxuan[m].click()
        break;
    }
    }
    }

    }
    }
    setTimeout(ksy,2424)
})();