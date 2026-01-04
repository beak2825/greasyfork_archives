// ==UserScript==
// @name         倍通答题脚本
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  无需作答，输入工号，点击提交即可
// @author       S1ow
// @match        *://ks.wjx.top/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394286/%E5%80%8D%E9%80%9A%E7%AD%94%E9%A2%98%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/394286/%E5%80%8D%E9%80%9A%E7%AD%94%E9%A2%98%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
     
     document.getElementById('submit_table').style.display=''
     for(var i=1; i<=20; i++){
        var ansList = []
        for(var j=1; j<=8; j++){
            var index = i + 1;
            var q = document.getElementById('q' + index +'_' + j)
            if(q){
                var ans = q.getAttribute('ans')
                if(ans == "1"){
                    q.checked = true
                    ansList.push(j)
                }
            }
        }
        console.log("第" + i +"题正确答案：" + ansList.toString())
     }
    // Your code here...
})();