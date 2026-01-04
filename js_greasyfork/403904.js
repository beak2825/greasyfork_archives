// ==UserScript==
// @name         网课工具
// @namespace    http://tampermonkey.net/
// @version      0.1
// @include     http*://demo.jlyuxin.cn:8877/dp/dp*

// @description  try to take over the world!
// @author       Lyoko
// @match        http://demo.jlyuxin.cn:8877/dp/dp-index?roomId=27c4ffd3-4bfc-4923-9e21-4ce237445d2d_3f1662e0-d2a9-4044-881d-b7c63e572b39&tableId=c58e574c-d2f9-4f14-9437-36b3d693e639&seatId=3c5001b1-c5f6-44c8-b0b0-19a0b24de45c
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403904/%E7%BD%91%E8%AF%BE%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/403904/%E7%BD%91%E8%AF%BE%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==









var time=0;
var myVar = setInterval(mytest, 2000);






function mytest() {
    'use strict';
    //window.onload;

    // Your code here...
    var i=0;
    var t =0;
    for(i=0;i<5;i++){
        var text = document.getElementById("text_"+i)
        if(text !=null){
            text.disabled="";
        }
        for(t=0;t<5;t++){
            var rd = document.getElementsByName("radio_"+i)[t]
            var ck = document.getElementsByName("checkbox_"+i)[t]
            if(rd!=null){
                rd.disabled="";
            }
            if(ck!=null){
                ck.disabled=""
            }
        }
    }
    time++;

    if(time >=5){
        clearInterval(myVar);
    }
    if(document.getElementById("dijit_Dialog_1")!=null){
        if(document.getElementById("dijit_Dialog_1").style.opacity==0){
            clearInterval(myVar);
        }
    }

}


