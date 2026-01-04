// ==UserScript==
// @name         甘肃公交建-党校（教育学院）-代刷vx:shuake345
// @namespace    代刷vx:shuake345
// @version      0.1
// @description  自动看课程|自动切换课程|代刷vx:shuake345
// @author       代刷vx:shuake345
// @match        *://gjjj.21tb.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506452/%E7%94%98%E8%82%83%E5%85%AC%E4%BA%A4%E5%BB%BA-%E5%85%9A%E6%A0%A1%EF%BC%88%E6%95%99%E8%82%B2%E5%AD%A6%E9%99%A2%EF%BC%89-%E4%BB%A3%E5%88%B7vx%3Ashuake345.user.js
// @updateURL https://update.greasyfork.org/scripts/506452/%E7%94%98%E8%82%83%E5%85%AC%E4%BA%A4%E5%BB%BA-%E5%85%9A%E6%A0%A1%EF%BC%88%E6%95%99%E8%82%B2%E5%AD%A6%E9%99%A2%EF%BC%89-%E4%BB%A3%E5%88%B7vx%3Ashuake345.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function sx(){window.location.reload()}

    document.addEventListener("visibilitychange", function() {
        console.log(document.visibilityState);
        if(document.visibilityState == "hidden") {
        } else if (document.visibilityState == "visible") {
            if(document.URL.search('index.parserForEdu.do')>1 ){
                setTimeout(sx,201)}}});

    function ks(){
        if(document.getElementsByClassName('only-one-btn elpui-layer-btn0').length>0){
            document.getElementsByClassName('only-one-btn elpui-layer-btn0')[0].click()
            window.close();
        }
        else if(document.getElementsByClassName('btn-item cursor').length>0){
            document.getElementsByClassName('btn-item cursor')[2].click()
            clearInterval(ks1)
        }
    }
    var ks1=setInterval(ks,3000)

    function zy(){
        var ZYKC=document.getElementsByClassName('done-txt')
        if(document.URL.search('index.parserForEdu.do')>0){
            for (var i = 0; i < ZYKC.length; i++) {
                if(ZYKC[i].innerText=='已选'){
                    ZYKC[i].click()
                    break;
                }
            }
            }

    }
    setTimeout(zy,6000)

    function ye2(){
        if(document.URL.search('course.courseInfo.do')>1 ){
        document.querySelector("#goStudyBtn").click()
        }
    }
    setTimeout(ye2,5620)
  })();