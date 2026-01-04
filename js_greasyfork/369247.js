// ==UserScript==
// @name         select text by middle button
// @name:zh-CN 中键选择文本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description   select the text by middle button
// @description:zh-CN   用鼠标中键选择文本
// @author       Harytfw
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369247/select%20text%20by%20middle%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/369247/select%20text%20by%20middle%20button.meta.js
// ==/UserScript==

(function() {
    'use strict';

var x1=0.0,y1=0.0;
const MIN_MOVEMENT = 10;
const se = document.getSelection();
const LEFT_BUTTON = 0,
      MIDDLE_BUTTON = 1;
const STATE_INIT = 0,
      STATE_READY = 1,
      STATE_WORKING = 2,
      STATE_FINISH = 3;
let state = STATE_INIT;

function mousedown(e) {
  if(e.button!==MIDDLE_BUTTON){
    return;
  }
  x1=e.clientX;
  y1=e.clientY;
  const range = document.caretPositionFromPoint(x1, y1);
  se.setBaseAndExtent(range.offsetNode,range.offset,range.offsetNode,range.offset);
  state = STATE_READY;
}
var x2=0.0,y2=0.0;
function mouseup(e){
  if(e.button===MIDDLE_BUTTON){
    if(state===STATE_WORKING) state=STATE_FINISH;
    else state=STATE_INIT;
  }
}
function mousemove(e){
  if(state===STATE_INIT)return;
  x2=e.clientX;
  y2=e.clientY;
  if(Math.hypot(x1-x2,y1-y2)>=MIN_MOVEMENT){
      if(state===STATE_WORKING || state===STATE_READY){
        const range = document.caretPositionFromPoint(x2, y2);
        if(se.anchorNode!== null)se.extend(range.offsetNode,range.offset);
        state=STATE_WORKING;
      }
  }
  else{
    state=STATE_READY;
  }
}
function click(e){
  if(e.button===MIDDLE_BUTTON && state==STATE_FINISH){
    e.preventDefault();
  }
  state=STATE_INIT;
}
document.addEventListener('mouseup', mouseup);
document.addEventListener('mousedown', mousedown);
document.addEventListener('mousemove', mousemove);
document.addEventListener('click', click);

})();