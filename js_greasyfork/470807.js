// ==UserScript==
// @name        showComments
// @namespace   Violentmonkey Scripts
// @match       https://dtf.ru/*
// @grant       none
// @version     1.3
// @author      deli
// @description 14.07.2023, 11:14:43
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/470807/showComments.user.js
// @updateURL https://update.greasyfork.org/scripts/470807/showComments.meta.js
// ==/UserScript==

var c=0;
var intervalID=null;

function show(){
    document.querySelector('.comments__show-all').click();
    console.log('click')
    var element = document.getElementsByClassName('comments__show-all');
    if(c<10){c++}
    else{clearInterval(intervalID);}
    if (element.length <= 0){ console.log('click')}
}
window.onload = show;
document.addEventListener('click', e => {
  if (e.target.nodeName === 'A') {
    e.preventDefault()
    intervalID = setInterval(show, 1000)
  }
})
