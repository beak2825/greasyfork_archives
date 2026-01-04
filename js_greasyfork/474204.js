// ==UserScript==
// @name         Steam OST
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Steam OST格式
// @author       You
// @match        https://store.steampowered.com/app/2550490/Sea_of_Stars__OST/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steampowered.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474204/Steam%20OST.user.js
// @updateURL https://update.greasyfork.org/scripts/474204/Steam%20OST.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function chanceOST() {
        let a = document.querySelector("div.music_album_track_listing_ctn.active");

        let b = a.querySelectorAll("div.music_album_track_ctn");

        if (b) {
            for (let i=0;i<b.length;i++){
                let cNo = b[i].querySelector("div.music_album_track_number");
                let cName = b[i].querySelector("div.music_album_track_name");
                let cTime = b[i].querySelector("div.music_album_track_duration");
                if (cNo && cName) {
                    cName.innerText = cNo.innerText+"、"+cName.innerText;
                }
                if (cNo && cTime) {
                    cNo.remove();
                    cTime.remove();
                }
            }

        }
    }

    //*************************************************************************************
    //----------------------------------------函数：右下按键样式
    //*************************************************************************************
    function addButton(innerHTML, bottom, onClick) {
        var mybutton = document.createElement("div");
        var body = document.querySelector("body");
        body.appendChild(mybutton);
        mybutton.innerHTML = innerHTML;
        mybutton.style.position = "fixed";
        mybutton.style.bottom = bottom;
        mybutton.style.right = "10px";
        mybutton.style.width = "50px";
        mybutton.style.height = "50px";
        mybutton.style.background = "black";
        mybutton.style.opacity = "0.75";
        mybutton.style.color = "white";
        mybutton.style.textAlign = "center";
        mybutton.style.lineHeight = "50px";
        mybutton.style.cursor = "pointer";
        mybutton.style.zIndex = "999999";
        // 设置点击事件
        mybutton.onclick = onClick;
    }


    //*************************************************************************************
    //----------------------------------------调用按钮
    //*************************************************************************************
    addButton("Cha", "150px", function() {
        chanceOST();
    });



})();