// ==UserScript==
// @name         51CTO禁止自动暂停
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  针对51CTO网页失去焦点后自动暂停
// @author       You
// @match        https://saas.51cto.com/learner.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429247/51CTO%E7%A6%81%E6%AD%A2%E8%87%AA%E5%8A%A8%E6%9A%82%E5%81%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/429247/51CTO%E7%A6%81%E6%AD%A2%E8%87%AA%E5%8A%A8%E6%9A%82%E5%81%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function setTitle(text){
        document.getElementsByTagName("title")[0].innerText = text
    }
    function getTime(){
            var now = new Date()
            return now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds()
        }
    window.onload = function(){
        setInterval(function(){
            var a = document.getElementsByClassName("play icons fl")[0]
            if(a.className == "play icons fl"){
                a.click()
                setTitle(getTime())
            }
        },200)
    }
})();