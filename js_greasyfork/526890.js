// ==UserScript==
// @name        YouTube NO ADS
// @namespace   Violentmonkey Scripts
// @match       https://pokeheroes.com/userprofile*
// @grant       none
// @version     1.0.0
// @author      -
// @description Generates player profile clicklist
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/526890/YouTube%20NO%20ADS.user.js
// @updateURL https://update.greasyfork.org/scripts/526890/YouTube%20NO%20ADS.meta.js
// ==/UserScript==

(function(){
  'use strict'

  let list = "https://pokeheroes.com/pokemon_lite?cl_type=custom&"
  // id[]= {ID} &

  $('a[href^="pokemon.php?id="]').each((index, data) => {
    data = /\d+/.exec(data.href)
    list += `id[]=${data}&`
  })

  $('h2:contains("Party")').parent().prepend(`<center><a href="${list}">Clicklist Link</a></center>`)
})()