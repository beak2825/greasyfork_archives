// ==UserScript==
// @name Orari Trenitalia
// @description Copying timetables from trenitalia.it is painful. This script gives you a preformatted list of times, easier to copy&paste. It's definitely not complete, but from this scratch it's quite easy to build different detail levels. Feel free to modify it.
// @version 1.1.1
// @namespace Violentmonkey Scripts
// @match https://www.lefrecce.it/B2CWeb/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/370514/Orari%20Trenitalia.user.js
// @updateURL https://update.greasyfork.org/scripts/370514/Orari%20Trenitalia.meta.js
// ==/UserScript==

/* global jQuery */

function getOrari () {
  return jQuery('.solutionRow').map(function (i, tr) {  // parse
    return {start: jQuery('.time', tr).first().text().trim(), arrival: jQuery('.time', tr).last().text().trim()}
  }).map(function (i, trip) { // markup
    return ' * ' + trip.start + ' → ' + trip.arrival
  }).toArray().join('\n') + '\n'
}

jQuery(function ($) {
  $('#accordion .panel').prepend(jQuery('<div id="summary-orari-txt"><pre style="display: none;"/></div>'))

  var mydiv = $('#summary-orari-txt')
  console.log(mydiv)

  var btn = $('<a class="btn" id="summary-orari-txt-btn" href="#"/>"')
  btn.text('Orari da copincollare')
  btn.click(function () {
    console.log('get...')
    var msg = getOrari()
    jQuery('pre', mydiv).html(msg)
    jQuery('pre', mydiv).attr('style', 'display: block;')
  })
  mydiv.append(btn)
  console.log(btn)
})
