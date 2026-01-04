// ==UserScript==
// @name         广东省教师继续教育信息管理平台2024
// @version      0.1
// @description  自动完成|自动答题|无题库|代刷vx:shuake345
// @author       代刷vx:shuake345
// @match        https://jsxx.gdedu.gov.cn/*
// @run-at       document-end
// @namespace https://greasyfork.org/users/1072479
// @downloadURL https://update.greasyfork.org/scripts/495517/%E5%B9%BF%E4%B8%9C%E7%9C%81%E6%95%99%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E4%BF%A1%E6%81%AF%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B02024.user.js
// @updateURL https://update.greasyfork.org/scripts/495517/%E5%B9%BF%E4%B8%9C%E7%9C%81%E6%95%99%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E4%BF%A1%E6%81%AF%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B02024.meta.js
// ==/UserScript==

(function() {
    'use strict';
function enterCourse() {
            if (document.getElementsByClassName("g-study-prompt").length) {
               console.log('进入课程');
var bofang=document.getElementsByTagName("video")[0].play()
var s =document.getElementsByClassName('g-study-prompt')[0].innerText
           
               if (document.getElementsByClassName(" mylayer-btn type1").length){
               //document.getElementsByClassName(" mylayer-btn type1")[0].click()
               goNext.call()
               }
           if(document.getElementsByClassName('btn u-main-btn').length){
              for (var i = 0; i < document.getElementsByTagName("input").length; i++) {
                if (document.getElementsByTagName("input")[i].value == "Choice0") {
                    document.getElementsByTagName("input")[i].click();
                    //console.log('输出'+i);
                    finishTest.call()
                    var otheroneB=setTimeout( xuanB,1000);
                    var otheroneC=setTimeout( xuanC,2000);
                    var otheroneD=setTimeout( xuanD,3000);
                    }
              }
            };
        }
    }

 var myTimer = setInterval(enterCourse, 6000);

    //选B
    function xuanB(){
        for (var i = 0; i < document.getElementsByTagName("input").length; i++) {
      if (document.getElementsByTagName("input")[i].value == "Choice1") {
                    document.getElementsByTagName("input")[i].click();
                    //console.log('输出'+i);
                    finishTest.call()
        }
        };
    }
     //选C
    function xuanC(){
        for (var i = 0; i < document.getElementsByTagName("input").length; i++) {
      if (document.getElementsByTagName("input")[i].value == "Choice2") {
                    document.getElementsByTagName("input")[i].click();
                    //console.log('输出'+i);
                    finishTest.call()
        }
        };
    }
     //选D
    function xuanD(){
        for (var i = 0; i < document.getElementsByTagName("input").length; i++) {
      if (document.getElementsByTagName("input")[i].value == "Choice3") {
                    document.getElementsByTagName("input")[i].click();
                    //console.log('输出'+i);
                    finishTest.call()
        }
        };
    }
    })();