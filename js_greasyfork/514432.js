// ==UserScript==
// @name         四川专技、公需科目、四川创联、成电求实、安阳专技、宜宾专技、天津专技、内蒙古专技、巴中云上大学、巴中开放大学、暑假研修、寒假研修|python通刷
// @namespace    python脚本，只安装油猴没用，要找作者拿python
// @version      0.2.1
// @description  python刷课，考试，无需打开浏览器。后台运行，模拟正常交互。可以快刷，一小时搞定
// @author       nobodyKnow
// @match        *://edu.scjxjypx.com/*
// @match        *://edu.chinahrt.com/151/*
// @match        *://videoadmin.chinahrt.com/videoPlay/*
// @match        *://ayjxjy.com/*
// @match        *://gp.chinahrt.com/*
// @match        *://tjjxjy.chinahrt.com/*
// @match        *://pcc.uestcedu.com/*
// @match        *://bzys.jjyxt.cn/*
// @match        *://basic.smartedu.cn/*
// @grant        none
// @icon         http://r.forteacher.cn/Images/logo.png
// @license      MIT
// @antifeature  payment
 
// @downloadURL https://update.greasyfork.org/scripts/514432/%E5%9B%9B%E5%B7%9D%E4%B8%93%E6%8A%80%E3%80%81%E5%85%AC%E9%9C%80%E7%A7%91%E7%9B%AE%E3%80%81%E5%9B%9B%E5%B7%9D%E5%88%9B%E8%81%94%E3%80%81%E6%88%90%E7%94%B5%E6%B1%82%E5%AE%9E%E3%80%81%E5%AE%89%E9%98%B3%E4%B8%93%E6%8A%80%E3%80%81%E5%AE%9C%E5%AE%BE%E4%B8%93%E6%8A%80%E3%80%81%E5%A4%A9%E6%B4%A5%E4%B8%93%E6%8A%80%E3%80%81%E5%86%85%E8%92%99%E5%8F%A4%E4%B8%93%E6%8A%80%E3%80%81%E5%B7%B4%E4%B8%AD%E4%BA%91%E4%B8%8A%E5%A4%A7%E5%AD%A6%E3%80%81%E5%B7%B4%E4%B8%AD%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E3%80%81%E6%9A%91%E5%81%87%E7%A0%94%E4%BF%AE%E3%80%81%E5%AF%92%E5%81%87%E7%A0%94%E4%BF%AE%7Cpython%E9%80%9A%E5%88%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/514432/%E5%9B%9B%E5%B7%9D%E4%B8%93%E6%8A%80%E3%80%81%E5%85%AC%E9%9C%80%E7%A7%91%E7%9B%AE%E3%80%81%E5%9B%9B%E5%B7%9D%E5%88%9B%E8%81%94%E3%80%81%E6%88%90%E7%94%B5%E6%B1%82%E5%AE%9E%E3%80%81%E5%AE%89%E9%98%B3%E4%B8%93%E6%8A%80%E3%80%81%E5%AE%9C%E5%AE%BE%E4%B8%93%E6%8A%80%E3%80%81%E5%A4%A9%E6%B4%A5%E4%B8%93%E6%8A%80%E3%80%81%E5%86%85%E8%92%99%E5%8F%A4%E4%B8%93%E6%8A%80%E3%80%81%E5%B7%B4%E4%B8%AD%E4%BA%91%E4%B8%8A%E5%A4%A7%E5%AD%A6%E3%80%81%E5%B7%B4%E4%B8%AD%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E3%80%81%E6%9A%91%E5%81%87%E7%A0%94%E4%BF%AE%E3%80%81%E5%AF%92%E5%81%87%E7%A0%94%E4%BF%AE%7Cpython%E9%80%9A%E5%88%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

 
 //从这里开始


    function startVasing2(){
        if(document.querySelector('iframe').src!==""){
            window.location.replace(document.querySelector('iframe').src)
           }else if(document.URL.search('videoadmin.chinahrt.com')>0){
               document.getElementsByTagName('video')[0].playbackRate=16
           document.getElementsByTagName('video')[0].play();
            player.videoMute();
           }
        }

   
      function vasing2(){
          if(document.URL.search('web.chinahrt.com/index.html#/v_courseDetails')!==-1){
           sx()
          }
 }
setInterval(vasing2,20000)
 
    setInterval(startVasing2,5000)
 
    function endVasing(){
    if(document.URL.search('web.chinahrt.com/index.html#/v_proxy')>0){
    window.close()
    }
    }
    setInterval(endVasing,11000)
 
    function sx(){
        window.location.reload()
    }
    function ss(){
    if(document.visibilityState=='visible'){
        firstjimu()
        console.log('zxjb')
    }
    }
    setInterval(ss,6000)
    window.alert = function() {}
    window.onbeforeunload = null
    window.confirm = function() {
        return true
    }
    var vasing2url = 'plan_course'
    var v2vasingurl = 'trainplan_detail'
    var Shuyurl = 'play_video'
    var Foururl='videoPlay'
 
    document.addEventListener("visibilitychange", function() {
        console.log(document.visibilityState);
        if (document.visibilityState == "hidden") {
        //yincang
        } else if (document.visibilityState == "visible") {
            if (document.URL.search(v2vasingurl) > 1 ) {
                window.location.replace(K主页)
        
            }
        }
    });
 


 
    function vvasing() {
        var KC = document.querySelectorAll("#__nuxt > div > div.body > main > div > div:nth-child(2) > div > div > div:nth-child(4) > div > div > div > div > div> div > img") //[0].href
        var KCjd = document.querySelectorAll("#__nuxt > div > div.body > main > div > div:nth-child(2) > div > div > div:nth-child(4) > div> div > div> div > span:nth-child(4) ")//[0].innerText
        for (var i = 0; i < KCjd.length; i++) {
            if (KCjd[i].innerText !== '100%') {
                KC[i].click()
                break;
            }
        }
    }
 
    function v2vasing() {
        if (document.visibilityState == "visible") {
        //yincang
        var Lookzhuangtai =document.querySelectorAll("#__nuxt > div > div.body > main > div > div > div > div > div > div > div> div > div > div > div > div> div > div > div > div:nth-child(2) > div > div > span")//[0].innerHTML
        for (var i = 0; i < Lookzhuangtai.length; i++) {
            if (Lookzhuangtai[i].innerText !== '已学完') {
                Lookzhuangtai[i].click()
                break;
            }
        }
    }
        }
 
     function firstjimu(){
           if(document.URL.search('web.chinahrt.com/index.html#/v_selected_course')!==-1){
            console.log('vx:vasing2')
             var kc1=document.querySelectorAll('div.progress-line>span')
            for (var i = 0;i < kc1.length;i++){
                if(kc1[i].innerText=="0%"){
              document.getElementsByClassName('bg pa tc')[i].click()
                break;
             }
          }
       }else if(document.URL.search('web.chinahrt.com/index.html#/v_courseDetails')!==-1){
       
           var kc2=document.querySelectorAll('a.button.fr.mt10.mr20.border-public.tc.f14.titlecolor')
           var sm= Number(kc2.length)
            for (var l = 0;l < kc2.length;l++){
                if(kc2[l].innerText.search('00:00')>0){
                    
                    kc2[l].click()
                    window.location.reload()
                    break;
             }else if (kc2.length-1==l){
                 alert('第一次找未播放课程结束，继续请加 vasing2')
             window.history.go(-1)
             }
           }
       }
    }
 
    function habit() {
        if (document.URL.search(v2vasingurl) > 2) {
            setTimeout(v2vasing, 210)
        } else if (document.URL.search(vasing2url) > 2) {
            setTimeout(vvasing, 224)
        }
    }
    setInterval(habit, 4254)
 
})();