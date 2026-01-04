// ==UserScript==
// @name         emby shortcut
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @include	     *:8096/web/index*
// @grant        none
// @require		 https://unpkg.com/hotkeys-js@3.7.3/dist/hotkeys.min.js
// @downloadURL https://update.greasyfork.org/scripts/398238/emby%20shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/398238/emby%20shortcut.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    hotkeys('enter', function() {
        var body = document.querySelector("body");
        if(document.fullscreen) document.exitFullscreen();
        else if(document.querySelector("video") != null )body.requestFullscreen();
        return false;//屏蔽其他event
    });

    hotkeys('space', function() {
        if(document.querySelector("video") != null ){
            if(document.querySelector("video").paused) document.querySelector("video").play()
            else document.querySelector("video").pause();
        }
        return false;
    });

    //方向键
    hotkeys('left,right,up,down', function (event, handler){
        event.preventDefault()
        switch (handler.key) {
            case 'right': document.querySelector(".btnOsdFastForward").click();
                break;
            case 'left': document.querySelector(".btnRewind").click();
                break;
            case 'up' : if(document.querySelector("video") != null ) document.querySelector("video").volume !== 1 ? document.querySelector("video").volume += 0.05 : 1;
                break;
            case 'down' : if(document.querySelector("video") != null ) document.querySelector("video").volume !== 0 ? document.querySelector("video").volume -= 0.05 : 1;
                break;
                //default: alert(event);
        }
    });
})();



