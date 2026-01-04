// ==UserScript==
// @name         任何网站双击shift回到页面顶部
// @namespace    ding
// @version      0.1
// @description  叮~
// @author       jackpapapapa
// @include        *
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mozilla.org
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/440902/%E4%BB%BB%E4%BD%95%E7%BD%91%E7%AB%99%E5%8F%8C%E5%87%BBshift%E5%9B%9E%E5%88%B0%E9%A1%B5%E9%9D%A2%E9%A1%B6%E9%83%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/440902/%E4%BB%BB%E4%BD%95%E7%BD%91%E7%AB%99%E5%8F%8C%E5%87%BBshift%E5%9B%9E%E5%88%B0%E9%A1%B5%E9%9D%A2%E9%A1%B6%E9%83%A8.meta.js
// ==/UserScript==

      ;(function () {
        let start = 0
        let end = 0
        let count = 0
        document.addEventListener("keydown", (e) => {
          if (e.shiftKey) {
            if (count === 0) start = new Date().getTime()
            count++
          }
          if (count === 2) {
            end = new Date().getTime()
            if (end - start <= 600) {
              document.scrollingElement.scrollTop = 0
            }
            count = 0
          }
        })
      })()