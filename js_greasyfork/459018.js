// ==UserScript==
// @name        BDSMLR AD Remover
// @namespace   Violentmonkey Scripts
// @match       https://*.bdsmlr.com/*
// @grant       GM_addStyle
// @version     1.1
// @author      ElonGates
// @license     MIT
// @description Not exactly the best it could be, but with other ad blocking plugins it's good
// @downloadURL https://update.greasyfork.org/scripts/459018/BDSMLR%20AD%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/459018/BDSMLR%20AD%20Remover.meta.js
// ==/UserScript==

let lastScroll = $('.infscroll:last').data('id');
$(window).scroll(runScroll)

{
  $('.products.columns-2').remove()
  $('.BDSMLR_Sidebar_ATF_Desktop_300x250').parentElement.remove()
}

let adText = "Here's an ad"

function runScroll() {
  if ($(window).scrollTop() >= ($(document).height() - $(window).height()) - 700) {
    lastScroll = $('.infscroll:last').data('id');

    let aElements = $('a')

    for (let i = 0; i < aElements.length; i++) {
      if (aElements[i].innerHTML.indexOf(adText) !== -1) {
        aElements[i].parentElement.parentElement.parentElement.parentElement.remove()
      }
    }
  }
}