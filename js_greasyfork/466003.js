// ==UserScript==
// @name         e Youtube Channel Page Auto Click "Video" and "Latest" Oct 2023
// @description  Emulate mouse click on buttons
// @namespace    ytchannellatest
// @version      3
// @match        *://*.youtube.com/*
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license      public domain
// @downloadURL https://update.greasyfork.org/scripts/466003/e%20Youtube%20Channel%20Page%20Auto%20Click%20%22Video%22%20and%20%22Latest%22%20Oct%202023.user.js
// @updateURL https://update.greasyfork.org/scripts/466003/e%20Youtube%20Channel%20Page%20Auto%20Click%20%22Video%22%20and%20%22Latest%22%20Oct%202023.meta.js
// ==/UserScript==
(function() {
console.log(`${GM.info.script.name} run`)
//
var c1,c2
var xpathclick=s=>{
  var x=document.evaluate(s, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
  if(x){x.click();return true}
}
var tc=_=>{
  [...document.querySelectorAll('a[href*="@"]:not(.ptc)')].map(y=>{
    y.classList.add('ptc')
    if(!~y.textContent.indexOf('Home'))
      y.addEventListener('click',_=>{
        c1=true
        c2=true
      })
  })
  if(document.querySelector('#channel-handle')
     && ~document.URL.indexOf(document.querySelector('#channel-handle').textContent)
  ){
    if(c1&&xpathclick('.//tp-yt-paper-tab//*[contains(@class, "tab-title") and contains(.,"Videos")] | .//yt-tab-shape//*[contains(.,"Videos")]')) c1=false
    if(c2&&xpathclick('.//*[@page-subtype="channels"]//yt-chip-cloud-chip-renderer[contains(.,"Latest")]')) c2=false
  }
  setTimeout(tc,500)
}
tc()
})()