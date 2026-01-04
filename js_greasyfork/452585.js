// ==UserScript==
// @name        屏蔽芊芊精典弹窗
// @namespace   Violentmonkey Scripts
// @match     https://myqqjd.com/*
// @grant       none
// @version     1.0
// @author      -
// @description 2022/10/7 上午10:06:23
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452585/%E5%B1%8F%E8%94%BD%E8%8A%8A%E8%8A%8A%E7%B2%BE%E5%85%B8%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/452585/%E5%B1%8F%E8%94%BD%E8%8A%8A%E8%8A%8A%E7%B2%BE%E5%85%B8%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

function removeTip(){
  document.getElementsByClassName('adblock_title')[0]?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.remove()

}

setInterval(removeTip,1000)