// ==UserScript==
// @name         AK CTSC EVERYDAY
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在题目内部把显示改成黑的
// @author       You
// @match        https://www.luogu.com.cn/problem/*
// @match        https://www.luogu.com.cn/problem/*?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427357/AK%20CTSC%20EVERYDAY.user.js
// @updateURL https://update.greasyfork.org/scripts/427357/AK%20CTSC%20EVERYDAY.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(()=>{

    var question=document.querySelectorAll("span[data-v-263e39b8=\"\"]");
    for(let i1 in question){
    //obj[item].innerHTML="<span data-v-263e39b8=\"\" style=\"color: rgb(191, 191, 191);\">\n    暂无评定\n  </span>";     //灰题
    //obj[item].innerHTML="<span data-v-263e39b8=\"\" style=\"color: rgb(14, 29, 105);\">\n    NOI/NOI+/CTSC\n  </span>"; //黑题
    question[i1].innerHTML="<span data-v-263e39b8=\"\" style=\"color: rgb(0, 0, 0);\">\n    Acc Big Mouth\n  </span>";
    }

        //<span data-v-6eed723a="" data-v-cc11993e="" class="wrapper">

    },1000)
    // Your code here...
})();