// ==UserScript==
// @name         牛客网刷题隐藏题目
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  偷偷刷题，不被发现，卷死他们
// @author       Miao
// @match        https://www.nowcoder.com/practice/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/436449/%E7%89%9B%E5%AE%A2%E7%BD%91%E5%88%B7%E9%A2%98%E9%9A%90%E8%97%8F%E9%A2%98%E7%9B%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/436449/%E7%89%9B%E5%AE%A2%E7%BD%91%E5%88%B7%E9%A2%98%E9%9A%90%E8%97%8F%E9%A2%98%E7%9B%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function(){
        //隐藏题目
        if(document.getElementsByClassName("flex-auto flex-row question-title hide-txt")[0]){
              document.getElementsByClassName("flex-auto flex-row question-title hide-txt")[0].remove()
        }
        //隐藏子标题
        if(document.getElementsByClassName("section-title")){
              var arr = document.getElementsByClassName("section-title")
              for(var i = 0; i < arr.length; i++) {
                  arr[i].innerText = ''
              }
        }
        //隐藏特殊样式
        if(document.getElementsByClassName("question-sample section-content")){
              var a = document.getElementsByClassName("question-sample section-content")
              for(var j = 0; j < a.length; j++) {
                  a[j].style.backgroundColor = 'white';
              }
        }

    } ,1000)//隔5秒之后执行.应该就能解决这个问题了


})();