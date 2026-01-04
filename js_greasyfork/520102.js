// ==UserScript==
// @name        MissAvFixedPlay
// @version      2024-12-08
// @author      Jeffc
// @match       https://missav.com/*
// @description 固定播放
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/940013
// @downloadURL https://update.greasyfork.org/scripts/520102/MissAvFixedPlay.user.js
// @updateURL https://update.greasyfork.org/scripts/520102/MissAvFixedPlay.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var grow;
    var x;
    var video;

    var findGrow = setInterval(function(){
        console.log("[MissAvFixedPlay] : 查找注入DOM | 查找目标Video")
        grow = document.querySelector(".grow");
        video = document.querySelector('.player');
        if(grow && video)
        {
            clearInterval(findGrow);
            init();
        }
    },200);


    function init(){

console.log("[MissAvFixedPlay] : 注入CSS样式")

        const style = document.createElement('style');
    style.innerHTML = `
            .button-85 {
            magin-left:10px;
             padding: 5px 25px;
             font-size: 14px;
              border: none;
              outline: none;
              color: rgb(255, 255, 255);
              background: #111;
              cursor: pointer;
              position: relative;
              z-index: 0;
              border-radius: 10px;
              user-select: none;
              -webkit-user-select: none;
              touch-action: manipulation;
            }

            .button-85:before {
              content: "";
              background: linear-gradient(
                45deg,
                #ff0000,
                #ff7300,
                #fffb00,
                #48ff00,
                #00ffd5,
                #002bff,
                #7a00ff,
                #ff00c8,
                #ff0000
              );
              position: absolute;
              top: -2px;
              left: -2px;
              background-size: 400%;
              z-index: -1;
              filter: blur(5px);
              -webkit-filter: blur(5px);
              width: calc(100% + 4px);
              height: calc(100% + 4px);
              animation: glowing-button-85 20s linear infinite;
              transition: opacity 0.3s ease-in-out;
              border-radius: 10px;
            }

            @keyframes glowing-button-85 {
              0% {
                background-position: 0 0;
              }
              50% {
                background-position: 400% 0;
              }
              100% {
                background-position: 0 0;
              }
            }

            .button-85:after {
              z-index: -1;
              content: "";
              position: absolute;
              width: 100%;
              height: 100%;
              background: #222;
              left: 0;
              top: 0;
              border-radius: 10px;
            }
    `;
console.log("[MissAvFixedPlay] : 添加控制元素")
    document.head.appendChild(style);
        x = document.createElement("button");
        x.textContent="固定播放";
        x.className="FixedPlay button-85";
        x.addEventListener("click",addCustonEvent);
        document.querySelector(".grow").appendChild(x);
    }

    var fixedPlayStatus = false;
    var fixedSetInterval;

    function addCustonEvent()
    {
        if(fixedPlayStatus)
        {
              video.pause();
              clearInterval(fixedSetInterval);
        }
        else
        {
              fixedSetInterval = setInterval(() => {
                   if (video.paused || video.played.length == 0) {
                       video.play();
                   }
             }, 2000);
        }
        fixedPlayStatus = !fixedPlayStatus;

         x.textContent = fixedPlayStatus ? "取消固定" : "固定播放";
    }

})();