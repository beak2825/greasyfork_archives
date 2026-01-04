// ==UserScript==
// @name         Intro skipper
// @version      0.2
// @description  try to take over the world!
// @author       lolamtisch@gmail.com
// @license      Creative Commons; http://creativecommons.org/licenses/by/4.0/
// @supportURL   https://discord.gg/cTH4yaw
// @include      *
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @namespace https://greasyfork.org/users/92233
// @downloadURL https://update.greasyfork.org/scripts/33779/Intro%20skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/33779/Intro%20skipper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var five = GM_getValue(document.domain, 0);
    var map = {};
    var timeout = 0;
    onkeydown = onkeyup = function(e){
        e = e || event;
        map[e.keyCode] = e.type == 'keydown';
        console.log(map);
        if (map[17] && map[39]) {
            videoJump(80);
        }
        if (map[17] && map[37]) {
            videoJump(-80);
        }
        if(five){
            if (map[39]) {
                videoJump(5);
            }
            if (map[37]) {
                videoJump(-5);
            }
        }
        if (map[17] && map[53] && !timeout) {
            map = {};
            if(five){
                five = 0;
            }else{
                five = 1;
            }

            var message = "5 second skip "+ ((five) ? "activated" : "deactivated") +" for "+document.domain;
            try{
                GM_notification(message);
            }catch(e){
                alert(message);
            }
            GM_setValue(document.domain, five);
            timeout = 1;
            setTimeout(function(){
                timeout = 0;
            }, 1000);
        }
    }

    function videoJump(time){
        var videos = document.getElementsByTagName("video");
        for (var i=0;i<videos.length;i++){
            var video = videos[i];
            video.currentTime = parseInt(video.currentTime) + time;
        }
    }
})();