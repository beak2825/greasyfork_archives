// ==UserScript==
// @name         西瓜视频播放倍速自定义，可记忆
// @namespace    765aa98d40d84afdbda7d9d7e1bcd5fa
// @version      0.5
// @description  西瓜视频倍速自定义，刷新浏览器也不会丢失之前设置的速度
// @author       tomoya
// @include      http*://*ixigua.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416902/%E8%A5%BF%E7%93%9C%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%80%8D%E9%80%9F%E8%87%AA%E5%AE%9A%E4%B9%89%EF%BC%8C%E5%8F%AF%E8%AE%B0%E5%BF%86.user.js
// @updateURL https://update.greasyfork.org/scripts/416902/%E8%A5%BF%E7%93%9C%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%80%8D%E9%80%9F%E8%87%AA%E5%AE%9A%E4%B9%89%EF%BC%8C%E5%8F%AF%E8%AE%B0%E5%BF%86.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const STORAGE_NAME = "_third_plugin_player_speed_";
    const speeds = [0.5, 1, 1.5, 2, 2.5, 3, 4, 5];

    let playerBlockDiv, videoDom, speedDiv;

    let initTimer = setInterval(function () {
        playerBlockDiv = document.querySelector("#player_default");
        videoDom = document.querySelector("video");
        if (playerBlockDiv && videoDom) {
            speedDiv = document.createElement("div");
            speedDiv.style.display = "flex";
            speedDiv.style.paddingBottom = "5px";
            let speedItemDivs = [];
            for (let i = 0; i < speeds.length; i++) {
                let speedItemDiv = document.createElement("div");
                speedItemDiv.id = "speed_" + i;
                speedItemDiv.innerText = speeds[i];
                speedItemDiv.style.width = "32px";
                speedItemDiv.style.height = "32px";
                speedItemDiv.style.textAlign = "center";
                speedItemDiv.style.lineHeight = "32px";
                speedItemDiv.style.backgroundColor = "lightgray";
                speedItemDiv.style.marginRight = "5px";
                speedItemDiv.style.color = "white";
                speedItemDiv.style.cursor = "pointer";
                speedItemDiv.style.borderRadius = "5px";
                speedItemDiv.addEventListener("click", function (e) {
                    for (let j = 0; j < speedItemDivs.length; j++) {
                        speedItemDivs[j].style.backgroundColor = "lightgray";
                    }
                    e.target.style.backgroundColor = "pink";
                    videoDom.playbackRate = parseFloat(speeds[i]);
                    localStorage.setItem(STORAGE_NAME, speeds[i]);
                })
                speedItemDivs.push(speedItemDiv);
                speedDiv.appendChild(speedItemDiv);
            }
            if (document.querySelector(".teleplayPage")) {
                speedDiv.style.paddingTop = "12px";
                speedDiv.style.paddingRight = "80px";
                speedDiv.style.paddingBottom = "0px";
                speedDiv.style.paddingLeft = "80px";
                speedDiv.style.position = "relative";
                speedDiv.style.bottom = "-10px";
                speedDiv.style.top = "12px";
            }
            playerBlockDiv.parentNode.parentNode.parentNode.parentNode.parentNode.insertBefore(speedDiv, playerBlockDiv.parentNode.parentNode.parentNode.parentNode);
            clearInterval(initTimer);
        }
    }, 200);

    let activeBtn = false;
    let initSpeedTimer = setInterval(function () {
        if (speedDiv && videoDom) {
            // init default speed
            let storageSpeed = parseFloat(localStorage.getItem(STORAGE_NAME)) || 1;
            if (!activeBtn || storageSpeed !== parseFloat(videoDom.playbackRate)) {
                let index = speeds.indexOf(storageSpeed);
                if (index >= 0) {
                    speedDiv.querySelector("#speed_" + index).click();
                } else {
                    speedDiv.querySelector("#speed_1").click();
                }
                activeBtn = true;
            }
        }
    }, 500);

})();
