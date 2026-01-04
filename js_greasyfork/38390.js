// ==UserScript==
// @name         Potatoman
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  changes all images
// @author       Qyther
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38390/Potatoman.user.js
// @updateURL https://update.greasyfork.org/scripts/38390/Potatoman.meta.js
// ==/UserScript==

window.onload=()=>{
  document.addEventListener("keydown",e=>{
    if(e.keyCode===17){
      cc++;
      setTimeout(()=>{
        if(cc>0){
          cc=0;
        }
      },350);
    }
    if(cc>=2){
      toggle();
    }
  });
  var loop=setInterval(()=>{
    if(ac===1){
      if(document.getElementsByTagName("img")[cs]){
        document.getElementsByTagName("img")[cs].src="https://vignette.wikia.nocookie.net/mixels-lucky-screenshots/images/4/45/Potato_Man.png/revision/latest/scale-to-width-down/350?cb=20170527153948";
        cs++;
      }
    }else{
      cs=0;
    }
  });
};
function toggle(){
  if(ac===0){
    ac=1;
  }else{
    ac=0;
  }
}
var cs=0;
var cc=0;
var ac=0;