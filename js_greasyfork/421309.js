// ==UserScript==
// @name         ふたクロ更新ボタンクリッカー
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  ふたばでの配信用に作成しました
// @author       habayuma
// @match        https://*.2chan.net/*/res/*   
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421309/%E3%81%B5%E3%81%9F%E3%82%AF%E3%83%AD%E6%9B%B4%E6%96%B0%E3%83%9C%E3%82%BF%E3%83%B3%E3%82%AF%E3%83%AA%E3%83%83%E3%82%AB%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/421309/%E3%81%B5%E3%81%9F%E3%82%AF%E3%83%AD%E6%9B%B4%E6%96%B0%E3%83%9C%E3%82%BF%E3%83%B3%E3%82%AF%E3%83%AA%E3%83%83%E3%82%AB%E3%83%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var elm = document.documentElement;
    //scrollHeight ページの高さ clientHeight ブラウザの高さ
    var bottom = elm.scrollHeight - elm.clientHeight;

    let bottomScroll = true; //強制下スクロールのON、OFF

    var intervalTime = 2000;
    setTimeout(setInterval(function(){
        document.getElementById('fvw_loading').click();
        bottom = elm.scrollHeight - elm.clientHeight;
        if (bottomScroll){
            window.scroll(0, bottom);
        }
    },intervalTime),3);

    setTimeout( function() {
        let appendButton = document.createElement("button");
        appendButton.id = "autoOnOFF";
        appendButton.type = "button";
        appendButton.textContent = "AutoScroll ON";
        document.getElementById('fvw_loading').after(appendButton);


        let onoffButton = document.getElementById("autoOnOFF");

        onoffButton.onclick = function(){
            if (bottomScroll){
                bottomScroll = false;
                onoffButton.textContent = "AutoScroll OFF";
            }else{
                bottomScroll = true;
                onoffButton.textContent = "AutoScroll ON";
            }
        }
    },2000);

})();