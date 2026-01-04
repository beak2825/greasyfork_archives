// ==UserScript==
// @name       Fullsize Youtube
// @namespace  https://greasyfork.org/en/users/11891-qon
// @author 	   Qon
// @version    1
// @compatible firefox
// @grant      none
// @include    https://www.youtube.com/watch?v=*
// @license    Simple Public License 2.0 (SimPL) https://tldrlegal.com/license/simple-public-license-2.0-%28simpl%29
// @description The Youtube player becomes as big as your screen so you don't have to toggle fullscreen mode.
// @downloadURL https://update.greasyfork.org/scripts/370617/Fullsize%20Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/370617/Fullsize%20Youtube.meta.js
// ==/UserScript==


console.log('FY started!')
var load = ()=>{
  console.log('FY: Page loaded. Starting modifications.')
  var mhc = document.querySelector('#masthead-container')
  var ptc = document.querySelector('#player-theater-container')
  var pm = document.querySelector('#page-manager')
  console.log(mhc)
  console.log(ptc)
  console.log(pm)
  if (! (mhc && ptc && pm)) {
    setTimeout(load, 500)
    return
  }

  ptc.style['max-height'] = 'calc(100vh - 0px)' // 57px pm height
  ptc.parentNode.insertBefore(mhc, ptc.nextSibling);
  mhc.style.position = 'unset'
  pm.style['margin-top'] = '0px'
  console.log('FY: I\'m done here!')
}
window.addEventListener("load",  load)