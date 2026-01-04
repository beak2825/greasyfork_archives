// ==UserScript==
// @name        YouTube Volume UP
// @namespace   Violentmonkey Scripts
// @match       https://pokeheroes.com/gc_concentration*
// @grant       none
// @version     1.0.0
// @author      -
// @description Save the flips
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/527151/YouTube%20Volume%20UP.user.js
// @updateURL https://update.greasyfork.org/scripts/527151/YouTube%20Volume%20UP.meta.js
// ==/UserScript==

(function(){
  'use strict';

  let ele
  let src
  const watch = new MutationObserver((changes) => {
    ele = changes[0].addedNodes[0]
    src = changes[0].addedNodes[0].src

    $(ele).parent().parent().append(`<img src="${src}" style="position: absolute; top:0; left: 0; display: block; visibility: visible; z-index: 999; pointer-events: none" />`)
  })

  $('.back').each((index, target) => {
    watch.observe(target, {characterData: true, subtree: true, childList: true})
  })
})()