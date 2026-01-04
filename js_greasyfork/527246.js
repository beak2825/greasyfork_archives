// ==UserScript==
// @name        YouTube MP3
// @namespace   Violentmonkey Scripts
// @match       https://pokeheroes.com/beach*
// @grant       none
// @version     1.0.0
// @author      -
// @description Auto fish
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/527246/YouTube%20MP3.user.js
// @updateURL https://update.greasyfork.org/scripts/527246/YouTube%20MP3.meta.js
// ==/UserScript==

(function(){
  'use strict';

    let on = false

    const btn = $(`<button style="position: absolute; top: 0; right: -35%">${on}</button>`)
    $(btn).on('click', () => {
      on = !on
      event.target.innerText = on
    })
    $('.throwRodButton').parent().append(btn)

    setInterval(()=>{
      if (on === true && $('.throwRodButton').css('display') != 'none') {
        throwRod();
      }

      if ($('.catchalert').css('display') != 'none') {
        $('.pullRodBackButton:eq(0)').click()
      }
    }, 1000)

    setInterval(()=>{
      if ($('.blackfish').css('opacity') == 1 && $('.blackfish').css('display') === 'block') {
        pullRod();
      }

      if ($('.catchInterface').css('display') != 'none') {
        $('.catchInterface').hide();
      }
    }, 100)
})()