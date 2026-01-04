// ==UserScript==
// @name         twitter 图片太占地方了
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  优化twitter图片和视频的占位问题
// @author       wuuashen
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455008/twitter%20%E5%9B%BE%E7%89%87%E5%A4%AA%E5%8D%A0%E5%9C%B0%E6%96%B9%E4%BA%86.user.js
// @updateURL https://update.greasyfork.org/scripts/455008/twitter%20%E5%9B%BE%E7%89%87%E5%A4%AA%E5%8D%A0%E5%9C%B0%E6%96%B9%E4%BA%86.meta.js
// ==/UserScript==

;(function () {
  GM_addStyle(`
  .r-1ssbvtb { width: 50% }
  `)

  let count = 0
  const callback = function (mutationsList, observer) {

    for (let mutation of mutationsList) {
      if (mutation.type === 'childList' && mutation.addedNodes.length) {

        if(
           mutation.target.getAttribute('style') !== 'height: 100%; position: absolute; width: 100%;' &&
           mutation.target.getAttribute('class') !== 'css-1dbjc4n r-1p0dtai r-1mlwlqe r-1d2f490 r-11wrixw r-61z16t r-1udh08x r-u8s1d r-zchlnj r-ipm5af r-417010'
        ) { continue }
        count ++
        // console.log(mutation.target, 'mutation', mutation.addedNodes, count)
        if(mutation.target.offsetWidth < 300) {
            mutation.target.closest('.r-1ssbvtb').style.width = 'auto'
        }
        for (const node of mutation.addedNodes) {
          const video = node.querySelector('video[aria-label="Embedded video"]')
          if(video){
              video.closest('.r-1ssbvtb').style.width = 'auto'
          }
        }
      }

    }
  }

  const observer = new MutationObserver(callback)
  const targetNode = document.querySelector('#react-root')
  observer.observe(targetNode, { childList: true, subtree: true })
})()
