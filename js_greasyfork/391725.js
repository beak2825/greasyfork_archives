// ==UserScript==
// @name         RandomSelector[Typing-tube]
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  RealTimeCombatting埋め込み 曲に迷ったとき用
// @author       Spacia(の)
// @match        https://typing-tube.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391725/RandomSelector%5BTyping-tube%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/391725/RandomSelector%5BTyping-tube%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(() =>{
        var parent = document.querySelector("#RTCRoomIdleScene > div:nth-child(3)");

        var button = document.createElement("input");
        button.setAttribute("type","file");
        button.setAttribute("accept",".txt");
        button.setAttribute("value", "曲をランダムセレクト");
        parent.appendChild(button);
        button.addEventListener("change", (event) =>{
            var _file = event.target.files[0];
            if(_file){
                var fr = new FileReader();
                fr.onload = function(e) {
                    var ids = fr.result.split('\n');
                    var  id = ids[Math.floor(Math.random() * ids.length)];
                    window.open('https://typing-tube.net/movie/show/' + id,"_self");
                }
                fr.readAsText(_file);
            }
        });
    }, 5000);
    // Your code here...
})();