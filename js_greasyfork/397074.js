// ==UserScript==
// @name            bilibili番剧区弹幕自动关闭
// @author          nine light
// @match           *://www.bilibili.com/*
// @description     自动关闭弹幕，自用
// @version         0.0.1
// @namespace https://greasyfork.org/users/451811
// @downloadURL https://update.greasyfork.org/scripts/397074/bilibili%E7%95%AA%E5%89%A7%E5%8C%BA%E5%BC%B9%E5%B9%95%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/397074/bilibili%E7%95%AA%E5%89%A7%E5%8C%BA%E5%BC%B9%E5%B9%95%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD.meta.js
// ==/UserScript==
(function(){
    // console.log("111")
    var btn, btnText;
    var myTimer = setInterval(function(){
        // console.log(2222);
        btn = document.getElementsByClassName("bui-checkbox")[0];
        console.log(btn);
        if(btn) {
            clearInterval(myTimer);
            closeBullet();
            // console.log(3333);
        }

    }, 500)
    
    function closeBullet(){
        var id = document.getElementsByClassName("v-wrap")[0];
        if(!id) {
            // if(btn.nextElementSibling.nextElementSibling.innerHTML == "关闭弹幕") {
            //     console.log(4444);
                btn.click();
            // }
    
        }
        // else if(btn.nextElementSibling.nextElementSibling.innerHTML == "开启弹幕") {
        //     btn.click();
        // }
    }
    
}());