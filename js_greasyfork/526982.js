// ==UserScript==
// @name        YouTube Music
// @namespace   Violentmonkey Scripts
// @match       https://pokeheroes.com/pokemon_lite?cl_type=*
// @grant       none
// @version     1.0.25
// @author      -
// @description Interacts automatically
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/526982/YouTube%20Music.user.js
// @updateURL https://update.greasyfork.org/scripts/526982/YouTube%20Music.meta.js
// ==/UserScript==

console.clear = () => {}

(function(){

  window._core = {}

  _core.click = () => {
if ($('img[src*="staticpokeheroes.com/img/pokemon/bw_field"]').length) {
$('img[src*="staticpokeheroes.com/img/pokemon/bw_field"]').click()
}

    if ($('#egg_tab').css('display') === 'none' && $('#pkmn_tab').css('display') != 'none') {
      // POKÉMON

      if ($('.hasBerry').css('display') != 'none') {
        $('.hasBerry a').click()
      } else {
        $('#pkmn_tab input[type="submit"]').click()
      }
    } else if ($('#pkmn_tab').css('display') === 'none' && $('#egg_tab').css('display') != 'none') {
      // EGG

      $('#egg_tab input[type="submit"]').click()
    }
  }

  _core.enable = () => {
    const target = document.getElementById('interact_tab')
    const watch = new MutationObserver(function(changes){
      setTimeout(_core.click, 100)
    })
    watch.observe(target, {characterData: true, subtree: true, childList: true})
  }

  $('#greenfield').parent().prepend(`<center style="margin-bottom: 1rem"><button onclick="_core.enable(); this.remove()">Enable</button></center>`)

})()