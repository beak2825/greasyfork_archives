// ==UserScript==
// @name         YouTube Always show progress bar | zikricaramel
// @version      0.2
// @description  Always show progress bar
// @author       Workgroups
// @match        *://www.youtube.com/*
// @namespace https://greasyfork.org/en/users/1265542-zikri-nuha
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488043/YouTube%20Always%20show%20progress%20bar%20%7C%20zikricaramel.user.js
// @updateURL https://update.greasyfork.org/scripts/488043/YouTube%20Always%20show%20progress%20bar%20%7C%20zikricaramel.meta.js
// ==/UserScript==


var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = `

.ytp-chrome-bottom{
  padding-bottom: 5px !important;
}

.ytp-autohide .ytp-chrome-bottom{
  opacity:1!important;
}
.ytp-autohide .ytp-chrome-bottom .ytp-progress-bar-container{
  opacity:0 !important;
}
.ytp-autohide .ytp-chrome-bottom .ytp-load-progress{
  opacity:0!important;
}
.ytp-autohide .ytp-chrome-bottom .ytp-chrome-controls{
  opacity:0!important;
}

.ytp-autohide .progress2{
  background-color: #aa1;
  height: 3px;
  width: 100%;
  left:0;
  transform-origin: left;
  transform: scaleX(0.0);

}
`;

document.getElementsByTagName('head')[0].appendChild(style);

var findVideoInterval = setInterval(function() {
    var ytplayer = document.querySelector(".html5-video-player:not(.addedupdateevents)");
    if (!ytplayer) {
        return;
    }
    clearInterval(findVideoInterval);
    ytplayer.className+=" addedupdateevents";
    var video = ytplayer.querySelector("video");
    var progressbar = ytplayer.querySelector(".ytp-play-progress");
    var controlbottom = ytplayer.querySelector(".ytp-chrome-bottom");
    var el1 = document.createElement('div');
    el1.innerHTML=`
     <div class='progress2'></div>
    `
    controlbottom.appendChild(el1);
    var progress2 = ytplayer.querySelector(".progress2");

    var loadbar = ytplayer.querySelector(".ytp-load-progress");
    if (!video || !progressbar || !loadbar) {
        return;
    }
    video.addEventListener("timeupdate",function() {
        var val1=video.currentTime/video.duration
        progress2.style.transform = "scaleX("+val1+")";
    });

},1000);