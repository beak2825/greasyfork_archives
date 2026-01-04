// ==UserScript==
// @name        bimi ,tvb云播,樱花广告清理
// @namespace   Violentmonkey Scripts
// @match       *://*.bimibimi.cc/*
// @match       *://*.hktvyb.com/*
// @match       *://*.imomoe.ai/*
// @grant       none
// @version     1.6
// @author      -Lucai qq:345199390
// @description 2021/2/2 下午12:58:41
// @downloadURL https://update.greasyfork.org/scripts/421029/bimi%20%2Ctvb%E4%BA%91%E6%92%AD%2C%E6%A8%B1%E8%8A%B1%E5%B9%BF%E5%91%8A%E6%B8%85%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/421029/bimi%20%2Ctvb%E4%BA%91%E6%92%AD%2C%E6%A8%B1%E8%8A%B1%E5%B9%BF%E5%91%8A%E6%B8%85%E7%90%86.meta.js
// ==/UserScript==


setTimeout(()=>{
    $("#HMcoupletDivleft").remove()
  $("#HMcoupletDivright").remove()
  $("#HMRichBox").remove()
  $(".btnclose").parent().remove()

  
  console.log("removeOver")
},500)
  
