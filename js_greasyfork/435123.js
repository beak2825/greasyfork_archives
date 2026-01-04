// ==UserScript==
// @name        pause all the tings 
// @namespace   kandelabr
// @match       *://*/*
// @grant       GM_registerMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_addValueChangeListener
// @run-at      context-menu
// @version     1.8
// @author      -
// @description pauses playing media in all tags
// @downloadURL https://update.greasyfork.org/scripts/435123/pause%20all%20the%20tings.user.js
// @updateURL https://update.greasyfork.org/scripts/435123/pause%20all%20the%20tings.meta.js
// ==/UserScript==
function silence(){ 
  if(GM_getValue('silence')){
    console.log('silence()');
    ['video','audio'].forEach((tag)=>{  
      console.log(tag);
      player = document.getElementsByTagName(tag)
        if(!![...player].find((e)=>e && !(e.paused && e.ended && e.muted))){
          player[0].pause() 
        }    
    })
  }
}
GM_addValueChangeListener("silence", silence);
GM_registerMenuCommand('silence',()=>{GM_setValue('silence',true)})
GM_registerMenuCommand('reset', ()=>{GM_deleteValue('silence')})