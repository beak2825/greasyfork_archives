// ==UserScript==
// @name        Speed up video
// @namespace   Phạm Doãn Hiếu ||| FB: https://www.facebook.com/100010921898385 || neucodethi@gmail.com
// @author      DHieu
// @copyright   DHieu
// @homepage    https://htstar.online
// @supportURL  
// @icon        https://i.imgur.com/6SaS8VR.png
// @description Speed up video youtube, facebook
// @contributionURL 
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_openInTab
// @grant       GM_registerMenuCommand
// @include     http://*
// @include     https://*
// @version     1.0.1
// @change-log  Update fb single video
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/394782/Speed%20up%20video.user.js
// @updateURL https://update.greasyfork.org/scripts/394782/Speed%20up%20video.meta.js
// ==/UserScript==

function speed_up(){	
  let videoArr = document.querySelectorAll('video');
  for(let i=0; i<videoArr.length; i++)
    {
	videoArr[i].playbackRate=3;
    }

}

var i = 1;
run();
function run () {
speed_up();
    setTimeout(function () {
      speed_up();
      console.log("chay speed up lan" +i)
        i++;
        if (i <2) {
            run();
        }
    }, 5000)
}