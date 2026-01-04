// ==UserScript==
// @name         次元链接自动打卡
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  登录次元链接后自动打卡
// @author       clam314
// @include      https://cylink.*
// @icon         https://www.google.com/s2/favicons?domain=cylink.me
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430269/%E6%AC%A1%E5%85%83%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E6%89%93%E5%8D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/430269/%E6%AC%A1%E5%85%83%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E6%89%93%E5%8D%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var clickTask = setInterval(signIn,2000)
    function signIn(){
        var btnA = document.querySelector('#checkin-div  a')
        if(btnA != null){
            var text = btnA.innerText
            if(text.indexOf("明日再来")){
                window.clearInterval(clickTask)
                console.log('已经打卡')
            }else{
                var btn = document.querySelector('#checkin-div')
                if(btn != null){
                    btn.click()
                    console.log('打卡成功~')
                }
            }
        }
    }
})();