// ==UserScript==
// @name         大工评教
// @namespace    Forever_Like_ZJM
// @version      0.1
// @description  随便写的,先点击（“今”昔同在），再点击（“麦”向未来）。教学建议需要把最后一个字删了（不会编这段程序了）
// @author       麦穗穗
// @match        http://jxgl.dlut.edu.cn/evaluation-student-frontend/*
// @match        https://jxgl.dlut.edu.cn/evaluation-student-frontend/*
// @match        http://jxgl.dlut.edu.cn/evaluation-student-frontend/#/*
// @match        http://jxgl.dlut.edu.cn/evaluation-student-frontend/#/tSurvey/*
// @match        jxgl.dlut.edu.cn/evaluation-student-frontend/*
// @match        http://jxgl.dlut.edu.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457307/%E5%A4%A7%E5%B7%A5%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/457307/%E5%A4%A7%E5%B7%A5%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function() {
    'use strict';


    var timerVar = setInterval (function() {DoMeEverySecond (); }, 500);
function DoMeEverySecond ()
{


    window.pingjia = function() {
        let praise = ['老师很好啊', '老师教的很认真啊', '非常好的一个老师啊']

         var ans_ls_html = document.querySelectorAll('.item_in.radio');
        // 填写radio
        for (var i=0; i<ans_ls_html.length; i++) {
            var radios = ans_ls_html[i].querySelectorAll('.el-radio__input')
            if (radios.length!=0){
                radios[0].click()
            }
        }


            var radios = ans_ls_html[8].querySelectorAll('.el-radio__input')
            if (radios.length!=0){
                radios[1].click()
            }

            var radios = ans_ls_html[9].querySelectorAll('.el-radio__input')
            if (radios.length!=0){
                radios[2].click()
            }


        var b = document.getElementsByTagName("textarea")
        //填写评价
        for (let i = 0; i < b.length; ++i) {
            b[i].value = praise[Math.floor(Math.random()*(praise.length))]
        }
    }


 window.pingfen = function() {
          var ans_ls_html_score = document.querySelectorAll('.el-radio-group.weight-box');
        // 填写分数
        for (var s=0; s<ans_ls_html_score.length; s++) {
            var radios_score = ans_ls_html_score[s].querySelectorAll('.el-radio__input')
            if (radios_score.length!=0){
                radios_score[0].click()
            }
        }

    }

     function Love() {
if(document.getElementById("1433223")) {}
         else{
        let save_btn = document.getElementsByClassName('el-row')[0]
        let a_tag = document.createElement('a')
        let b_tag = document.createElement('b')
        a_tag.innerText='“今”昔同在，'
        b_tag.innerText='“麦”向未来'
        a_tag.className="u-btn u-btn-default f-fl"
        b_tag.className="u-btn u-btn-default f-f2"
        a_tag.onclick=window.pingjia
        b_tag.onclick=window.pingfen
        a_tag.id=1433223
        save_btn.parentElement.insertBefore(a_tag, save_btn)
        save_btn.parentElement.insertBefore(b_tag, save_btn)
         }
    }

    function runWhenReady(readySelector, callback) {
      var numAttempts = 0;
      var tryNow = function() {
          var elem = document.querySelector(readySelector);
          if (elem) {
              callback(elem);
          } else {
              numAttempts++;
              if (numAttempts >= 34) {
                  console.warn('Giving up after 34 attempts. Could not find: ' + readySelector);
              } else {
                  setTimeout(tryNow, 250 * Math.pow(1.1, numAttempts));
              }
          }
      };
      tryNow();
    }

    runWhenReady(".el-radio-group", Love)
}
timerVar= "";
    // Your code here..
})();