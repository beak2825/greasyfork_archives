// ==UserScript==
// @name         Anti DeBlocker (ad blockers detector defeater)
// @namespace    https://greasyfork.org/
// @version      1.2
// @description  try to defeat DeBlocker, the Anti AdBlock Wordpress Plugin found here: https://deblocker.merkulov.design/
// @author       deviato
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deblocker.merkulov.design/
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/454538/Anti%20DeBlocker%20%28ad%20blockers%20detector%20defeater%29.user.js
// @updateURL https://update.greasyfork.org/scripts/454538/Anti%20DeBlocker%20%28ad%20blockers%20detector%20defeater%29.meta.js
// ==/UserScript==
var ri;
function enableSelection(e) {
  if(typeof e.onselectstart!='undefined') e.onselectstart=function() { return true; };
  else if(typeof e.style.MozUserSelect!='undefined') e.style.MozUserSelect='text';
  else if(typeof e.style.webkitUserSelect!='undefined') e.style.webkitUserSelect='text';
  else e.onmousedown=function() { return true; };
  e.style.cursor='auto';
}
function enableContextMenu() {
  document.oncontextmenu=null;
  document.body.oncontextmenu=null;
  document.ondragstart=null;
};
let h_win_disableHotKeys;
let h_mac_disableHotKeys;
function enableHotKeys() {
  window.removeEventListener('keydown',h_win_disableHotKeys);
  document.keypress=function(e) {
    if(e.ctrlKey&&(e.which==65||e.which==66||e.which==70||e.which==67||e.which==73||e.which==80||e.which==83||e.which==85||e.which==86)) {
      return true;
    }
  };
  window.removeEventListener('keydown',h_mac_disableHotKeys);
  document.keypress=function(e) {
    if(e.metaKey&&(e.which==65||e.which==66||e.which==70||e.which==67||e.which==73||e.which==80||e.which==83||e.which==85||e.which==86)) {
      return true;
    }
  };
  document.onkeydown=function(e) {
    e=e||window.event;
    if(e.keyCode==123||e.keyCode==18||(e.ctrlKey&&e.shiftKey&&e.keyCode==73)) {
      return true;
    }
  };
}

window.rmNag=function(){
  //console.log('searching...');
  var nag='';
  document.body.classList.forEach(function(i){
    if(i.endsWith('-blur')) {
        nag=i.replace('-blur','');
        document.body.classList.remove(i);
    }
    if(i.endsWith('-style-compact')) {
      nag=i.replace('-style-compact','');
      document.body.classList.remove(i);
    }
  });
  if(nag) {
    console.log('NAG Found!');
    var ng=document.querySelector("body>div."+nag+"-wrapper");
    if(ng)ng.parentNode.removeChild(ng);
    ng=document.querySelector("body>div."+nag+"-wrapping");
    if(ng)ng.parentNode.removeChild(ng);
    ng=document.querySelector("body>div."+nag+"-blackout");
    if(ng)ng.parentNode.removeChild(ng);
    //Try to reenable js blocks
    enableSelection(document.body);
    enableContextMenu();
    enableHotKeys();
    clearInterval(ri);
  }
};

(function() {
  'use strict';
  window.rmNag();
  ri=setInterval(window.rmNag,100);
  setTimeout(()=>{clearInterval(ri)},5000);
})();