// ==UserScript==
// @name         ttsfree
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  brute force to prevent periodic server-injected anti-adblocker modal
// @author       You
// @match        https://ttsfree.com
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445139/ttsfree.user.js
// @updateURL https://update.greasyfork.org/scripts/445139/ttsfree.meta.js
// ==/UserScript==

function blockPopup () {
  setInterval(() => {
    // const node = document.querySelector('body > script:nth-child(28)')
    const node = document.querySelector('.swal2-container')
    // window.alert(node.toString())
    if (node && node.parentNode) {
      console.log('removing popup...')
      node.parentNode.removeChild(node);
    }
  }, 30)
}

(async function() {(
  document.readyState !== 'loading') ? blockPopup() : document.addEventListener('DOMContentLoaded', blockPopup);
})()