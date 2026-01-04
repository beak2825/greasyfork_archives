// ==UserScript==
// @name         Torn Laptop Fullscreen
// @namespace    somenamespace
// @version      0.2.1
// @description  desc
// @author       tos
// @match        *.torn.com/laptop.php*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/33959/Torn%20Laptop%20Fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/33959/Torn%20Laptop%20Fullscreen.meta.js
// ==/UserScript==

GM_addStyle(`
  .tcx-pc-nav {
    position: unset !important;
    top: unset !important;
    left: unset !important;
    right: unset !important;
    z-index: unset !important;
  }
  
  .tcx-pc-hide {
    visibility: hidden !important;
  }
`)


const pc_nav = document.querySelector('.computer-navigation')

pc_nav.classList.add('tcx-pc-nav')
const computer_wrap = document.querySelector('.computer-wrap')
const pc_viewport = computer_wrap.querySelector('.viewport')

computer_wrap.parentElement.insertBefore(pc_nav, computer_wrap)
computer_wrap.parentElement.insertBefore(pc_viewport, computer_wrap)
computer_wrap.classList.add('tcx-pc-hide')