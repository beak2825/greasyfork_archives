// ==UserScript==
// @name        resonsive
// @namespace   Violentmonkey Scripts
// @include       http://localhost*
// @include       http://127.0.0.1*
// @include       http://192.168.110.*
// @include       http://10.0.0.*
// @include     http://10.114.6.*
// @grant       GM_addStyle
// @version     0.4.7
// @author      -
// @license MIT
// @description 2021/11/18 下午3:32:59
// @downloadURL https://update.greasyfork.org/scripts/489042/resonsive.user.js
// @updateURL https://update.greasyfork.org/scripts/489042/resonsive.meta.js
// ==/UserScript==

document.addEventListener('keyup',(event)=>{
  if(event.keyCode === 188 && event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA'){
    const windowFeatures = "left=100,top=100,width=375,height=800";
    const handle = window.open(
        location.href,
        "_blank",
        windowFeatures,
    );
  }
})

if(window.outerWidth<500){
  GM_addStyle(`
::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
`)
}