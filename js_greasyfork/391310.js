// ==UserScript==
// @name         掰掰瑪倫
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://haha.gamer.com.tw/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391310/%E6%8E%B0%E6%8E%B0%E7%91%AA%E5%80%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/391310/%E6%8E%B0%E6%8E%B0%E7%91%AA%E5%80%AB.meta.js
// ==/UserScript==

var obj_1 = []
var test = 0




function 抓取對話(){
obj_1=[];
obj_1 = document.getElementsByClassName("msg-box");
test=test+1;
}

function 消失(){

    //console.log("尋找ID");
    抓取對話();

    if(obj_1.length>0){
        //console.log("抓到了");
        test = 0
        for (var i = 0; i < obj_1.length; i++) {
            //取得留言內容
            //console.log("正在第"+i+"個");
            try {
                var s = obj_1[i].getElementsByClassName("user-avatar")[0].href;
            } catch (e) { }

            //console.log(s);
            // u9032375
            if (s.indexOf("u9032375") > 0){
                console.log("發現 在第"+i+"個");
                var parentObj = obj_1[i].parentNode;
                parentObj.removeChild(obj_1[i]);
            }
        }//for
    }
}

window.setInterval(消失,500);