// ==UserScript==
// @name         中南林自动评教
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  中南林一键一伯分自动评教，解放双手
// @author       You
// @match        http://jwgl.csuft.edu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csuft.edu.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467548/%E4%B8%AD%E5%8D%97%E6%9E%97%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/467548/%E4%B8%AD%E5%8D%97%E6%9E%97%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

            setTimeout(function () {
        let q = document.querySelectorAll("td > a");
    console.log(q.length);
        let i = 0;
        for(let j of q){
            //j.click()
        }

    }, 1000);
    // Your code here...
        setTimeout(function () {
        let q = document.querySelectorAll("input[type='radio']");
    console.log(q.length);
        let i = 0;
        for(let j of q){
        //console.log(j);
            if(i%5 == 0){

                j.setAttribute("checked","checked");
            }
            i++;
        }
        let t = document.querySelector("textarea");
        t.value = "教师是个幽默风趣的人字数补丁暂无建议字数补丁字数补丁字数补丁字数补丁字数补丁字数补丁字数补丁字数补丁字数补丁字数补丁字数补丁字数补丁字数补丁字数补丁字数补丁字数补丁字数补丁字数补丁";
        let btn = document.getElementById("tj");
        btn.click();

    }, 1000);
})();