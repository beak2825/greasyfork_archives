
// ==UserScript==
// @name         Youku Browser Full Screen
// @version      0.0.0.1
// @description  给优酷的h5播放器增加一个网页全屏按钮，得等网页加载完了才能出来。
// @include      /v.youku.com/v_show.*/
// @require      http://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @author       AkiyamaYummy
// @namespace https://greasyfork.org/users/9356
// @downloadURL https://update.greasyfork.org/scripts/39335/Youku%20Browser%20Full%20Screen.user.js
// @updateURL https://update.greasyfork.org/scripts/39335/Youku%20Browser%20Full%20Screen.meta.js
// ==/UserScript==

var player = document.getElementById("player"),body = document.getElementsByTagName("body")[0];
var playerMessage,playerFullScreenMode,playerFullScreenSwitchButton;

$(player).ready(function(){
		browserFullScreenInit();
  	$(playerFullScreenSwitchButton).click(function(){
    		browserFullScreenSwitch();
    });
});

function browserFullScreenInit() {
    playerMessage = [["fixed"],["0px"],["0px"],["100%"],["100%"],["10000"],["hidden"]];

    playerMessage[0][1] = player.style.position;
    playerMessage[1][1] = player.style.left;
    playerMessage[2][1] = player.style.top;
    playerMessage[3][1] = player.style.height;
    playerMessage[4][1] = player.style.width;
    playerMessage[5][1] = player.style.zIndex;
    playerMessage[6][1] = body.style.overflow;

    playerFullScreenMode = 1;

    playerFullScreenSwitchButton = document.createElement("div");
    playerFullScreenSwitchButton.setAttribute("class","control-icon control-fullscreen-icon");
    playerFullScreenSwitchButton.setAttribute("data-tip","网页全屏");
    document.getElementsByClassName("control-right-grid")[0].appendChild(playerFullScreenSwitchButton);
}
function browserFullScreenSwitch() {
    playerFullScreenMode = playerFullScreenMode^1;

    player.style.position = playerMessage[0][playerFullScreenMode];
    player.style.left     = playerMessage[1][playerFullScreenMode];
    player.style.top      = playerMessage[2][playerFullScreenMode];
    player.style.height   = playerMessage[3][playerFullScreenMode];
    player.style.width    = playerMessage[4][playerFullScreenMode];
    player.style.zIndex   = playerMessage[5][playerFullScreenMode];
    body.style.overflow   = playerMessage[6][playerFullScreenMode];
}