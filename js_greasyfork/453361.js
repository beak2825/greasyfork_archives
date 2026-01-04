// ==UserScript==
// @name        HIDive Fullscreen & Mouse volume control
// @namespace    https://greasyfork.org/en/users/807108-jeremy-r
// @version      2.0
// @description  Fullscreen & Mouse volume control
// @author       JRem
// @require      https://cdn.jsdelivr.net/gh/mlcheng/js-toast@ebd3c889a1abaad615712485ce864d92aab4c7c0/toast.min.js
// @match        https://www.hidive.com/stream/*
// @grant        GM_addStyle
// @grant        GM.xmlHttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453361/HIDive%20Fullscreen%20%20Mouse%20volume%20control.user.js
// @updateURL https://update.greasyfork.org/scripts/453361/HIDive%20Fullscreen%20%20Mouse%20volume%20control.meta.js
// ==/UserScript==

// Fullscreen Video Code
window.onload = function(){
    setTimeout(function () {
        var css = '#rmpPlayer {width: calc(100vw) !important;height: calc(95vh) !important;}';
            css += '.container-fluid {padding: 0 0 0 0;margin: 0 0 0 0;max-width:calc(100vw) !important;}';
        GM_addStyle(css);
    }, 5000);
    iqwerty.toast.toast('Fullscreen added', options);
};


// Toast Vars
const options = {
      settings: {
        duration: 3000,
      },
      style: {
        main: {
          background: "black",
          color: "white",
          width: "auto",
          'max-width': '10%',
        }
      }
};

const volopts = {
      settings: {
        duration: 500,
      },
      style: {
        main: {
          background: "black",
          color: "white",
          width: "auto",
          'max-width': '10%',
        }
      }
};

// Volume Control via mouse scroll
// 1 Scroll = 5%
var stepAmount = 5;

function volChange(e){
  e.preventDefault()
  var video = document.querySelector('video')
  var curVol = video.volume;
  var direction = e.deltaY < 0;
  var actualChange = stepAmount / 100;
  if (direction) curVol += actualChange;
  else curVol -= actualChange;
  if (curVol > 1) curVol = 1;
  else if (curVol < 0) curVol = 0;
  video.volume = curVol;

  iqwerty.toast.toast(Math.floor(100 * video.volume) +"%", volopts);
}

document.getElementById("rmpPlayer").addEventListener("wheel", volChange);







