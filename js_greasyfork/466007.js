// ==UserScript==
// @name         s Disable YouTube Channel / User Home Page Video AutoPlay 2024 May
// @namespace    DisableYouTubeChannelUserHomePageVideoAutoPlayFork
// @version      3
// @description  Disable the video autoplay at YouTube channel/user home page
// @match        *://*.youtube.com/*
// @grant        none
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license      Public domain
// @downloadURL https://update.greasyfork.org/scripts/466007/s%20Disable%20YouTube%20Channel%20%20User%20Home%20Page%20Video%20AutoPlay%202024%20May.user.js
// @updateURL https://update.greasyfork.org/scripts/466007/s%20Disable%20YouTube%20Channel%20%20User%20Home%20Page%20Video%20AutoPlay%202024%20May.meta.js
// ==/UserScript==

(() => {
  console.log(`${GM.info.script.name} run`)
  var u
  var r=_=>{
    var v=document.location.href.match(/:\/\/[^\/]+\/(((c(hannel)?|u(ser)?)\/)|@)[^\/]+(\/(about|featured)?)?(\?|$)/)
    if(u!==v){
      u=v
      ;[...document.querySelectorAll(`video`)].map(x=>{
        x.pause()
        x.volume=0
        debugger
      })
    }
    setTimeout(r,500)
  }
  r()
})();