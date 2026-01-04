// ==UserScript==
// @name         奇优影院去广告
// @match        *://*/*
// @description  奇优影院去广告脚本
// @version      0.7.5
// @namespace    https://ouo.top/
// @license      no
// @downloadURL https://update.greasyfork.org/scripts/474554/%E5%A5%87%E4%BC%98%E5%BD%B1%E9%99%A2%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/474554/%E5%A5%87%E4%BC%98%E5%BD%B1%E9%99%A2%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
; (function () {

  const nodeObserver = new MutationObserver(function (mutationsList) {
      console.log("mutationsList: ",mutationsList)
    for (let mutation of mutationsList) {
      if (mutation.type === "childList") {
        Array.prototype.forEach.call(mutation.addedNodes, function (node) {
            if(node && node.parentNode) {
                node.parentNode.removeChild(node)
            }
        })
      } else if (mutation.type === "attributes") {
        mutation.target.style.display = "none"
      }
    }
  })
  
    nodeObserver.observe(document.body, { childList: true })
    nodeObserver.observe(document.querySelector(".container .stui-pannel-box > div"),{attributes: true})
})()