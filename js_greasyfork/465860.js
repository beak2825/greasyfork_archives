// ==UserScript==
// @name         e Youtube Homepage Auto Click "New to you" May 2023
// @description  Emulate mouse click on the "New to you" button
// @namespace    ytnewtoyou
// @version      1
// @match        https://www.youtube.com/
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license      public domain
// @downloadURL https://update.greasyfork.org/scripts/465860/e%20Youtube%20Homepage%20Auto%20Click%20%22New%20to%20you%22%20May%202023.user.js
// @updateURL https://update.greasyfork.org/scripts/465860/e%20Youtube%20Homepage%20Auto%20Click%20%22New%20to%20you%22%20May%202023.meta.js
// ==/UserScript==
(function() {
console.log(`${GM.info.script.name} run`)
var failsafe=0
var cl=_=>{
  var c=document.querySelector('#chips')
  var r=document.querySelector('#right-arrow')
  if(c&&r){
    //c.style.transform=`translateX(${c.parentNode.offsetWidth-c.offsetWidth}px)`
    if(failsafe<20 && r.checkVisibility()){
      failsafe++
      r.querySelector('button').click()
      setTimeout(cl,10)
    }
    if(!r.checkVisibility()) c.querySelector('[title="New to you"]').click()
  }else setTimeout(cl,500)
}
cl()
})()