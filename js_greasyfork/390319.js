// ==UserScript==
// @name         Majsoul FullScreen
// @namespace    http://tampermonkey.net/
// @version      0.18
// @description  雀魂全屏
// @author       DeQxJ00
// @match        https://game.maj-soul.net/*
// @match        https://game.maj-soul.com/*
// @match        https://majsoul.union-game.com/
// @match        https://game.mahjongsoul.com/
// @match        https://mahjongsoul.game.yo-star.com/
// @grant        none
// @license      CC BY-NC 4.0
// @downloadURL https://update.greasyfork.org/scripts/390319/Majsoul%20FullScreen.user.js
// @updateURL https://update.greasyfork.org/scripts/390319/Majsoul%20FullScreen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class Majfullscreen{
        constructor() {
            this.appendFullscreenButton();
        }
        launchFullscreen(element) {
            if(element.requestFullscreen) {
                element.requestFullscreen();
            } else if(element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if(element.msRequestFullscreen){
                element.msRequestFullscreen();
            } else if(element.webkitRequestFullscreen) {
                element.webkitRequestFullScreen();
            }
        }

        exitFullscreen() {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }

        appendFullscreenButton() {

            const b = document.createElement("button");
            b.innerText = "全屏";
            b.style.position = "absolute";
            b.style.bottom = "0px";
              if(window.helper){
                     b.style.right = "70px";
            }else{
                   b.style.right = "0px";
            }
            b.style.zIndex = 1002;
            b.addEventListener("click", () => {
                if (document.fullscreenElement) {
                    this.exitFullscreen();
                } else {
                    this.launchFullscreen(document.documentElement);
                }
            });
            document.body.appendChild(b);
            console.log("全屏按钮添加成功");
        }
    }

    window.Majfullscreen = Majfullscreen;
    window.majfullscreen = new Majfullscreen();

})();