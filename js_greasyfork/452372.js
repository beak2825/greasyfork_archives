// ==UserScript==
// @name         粗略统计哔哩哔哩视频总时长
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  粗略统计哔哩哔哩视频总时长123
// @author       You
// @include     https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/452372/%E7%B2%97%E7%95%A5%E7%BB%9F%E8%AE%A1%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%A7%86%E9%A2%91%E6%80%BB%E6%97%B6%E9%95%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/452372/%E7%B2%97%E7%95%A5%E7%BB%9F%E8%AE%A1%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%A7%86%E9%A2%91%E6%80%BB%E6%97%B6%E9%95%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var sum=0
    setTimeout(()=>{
        var length =document.getElementsByClassName('head-left')[0].children[1].innerText
        if(length[4]===')'){
            length=length.slice(3,5)
        }
        else if(length[5]===')'){
            length=length.slice(3,5)
        }
        else if(length[6]===')'){
            length= length.slice(3,6)
        }
        else{
            length=length.slice(3,7)
        }
        var numLength=parseInt(length)
        for(let i = 0 ; i <= numLength;i++){

            var str =document.getElementsByClassName('list-box')[0].children[i].children[0].children[0].children[1].innerText;

            // var numStr=str.slice(0,2)

            sum = parseInt(str) +sum

        }},5000)
    setTimeout(()=>{alert(sum)},5001)

    // Your code here...
})();