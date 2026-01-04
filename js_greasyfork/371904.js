// ==UserScript==
// @name         트위치 클립 다운로드 단축키
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  트위치 클립 페이지에서 d 버튼을 누르면 다운로드 실행
// @author       You
// @match        *://clips.twitch.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371904/%ED%8A%B8%EC%9C%84%EC%B9%98%20%ED%81%B4%EB%A6%BD%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C%20%EB%8B%A8%EC%B6%95%ED%82%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/371904/%ED%8A%B8%EC%9C%84%EC%B9%98%20%ED%81%B4%EB%A6%BD%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C%20%EB%8B%A8%EC%B6%95%ED%82%A4.meta.js
// ==/UserScript==

(function() {
    window.getKey = function (keyStroke){
        var key = ['d'];
        if ((event.srcElement.tagName != 'INPUT') && (event.srcElement.tagName != 'TEXTAREA')) {
            isNetscape = (document.layers);
            eventChooser = (isNetscape) ? keyStroke.which : event.keyCode;
            which = String.fromCharCode(eventChooser).toLowerCase();
            for (var i in key){
                if (which == key[i]) {
                    control(key[i]);
                }
            }
        }
    };
    document.onkeypress = getKey;

    window.control = function (key){
        if(key==="d"){
            var vid = document.getElementsByTagName('video')[0].currentSrc;
            location.href = vid;
        }
    };
})();