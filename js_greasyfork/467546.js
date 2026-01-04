// ==UserScript==
// @name         湖师大自动评教
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  点击对应老师直接确认分数就可以，默认一伯分
// @author       You
// @match        https://jwglnew.hunnu.edu.cn/eams/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hunnu.edu.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467546/%E6%B9%96%E5%B8%88%E5%A4%A7%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/467546/%E6%B9%96%E5%B8%88%E5%A4%A7%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    //console.log("ENTER");
    setTimeout(function () {
        let q = document.querySelectorAll(".option-radio");
    //console.log(q.length);
        let i = 0;
        for(let j of q){
        //console.log(j);
            if(i%4 == 0){

                j.setAttribute("checked","checked");
            }
            i++;
        }
        let t = document.querySelector("textarea");
        t.value = "暂无建议";
        let btn = document.getElementById("sub");
        btn.click();
    }, 1000);

    //console.log("SUC");
})();