// ==UserScript==
// @name         AttackLimit
// @version      1.0.0
// @author       Ikzelf
// @description  vermijd aanvalsban
// @include https://nl*.grepolis.com/game/*
// @include https://es*.grepolis.com/game/*
// @exclude forum.*.grepolis.*/*
// @exclude wiki.*.grepolis.*/*
// @grant        none
// @namespace https://greasyfork.org/users/984383
// @downloadURL https://update.greasyfork.org/scripts/477273/AttackLimit.user.js
// @updateURL https://update.greasyfork.org/scripts/477273/AttackLimit.meta.js
// ==/UserScript==

(function () {
  'use strict'

  const attackCounter = {}
  const maxAttacks = 11

  // Listen for game events
  $(document).ajaxComplete(function (e, xhr, opt) {
    var url = opt.url.split('?'), action = ''
    if (typeof (url[1]) !== 'undefined' && typeof (url[1].split(/&/)[1]) !== 'undefined') {
      action = url[0].substr(5) + '/' + url[1].split(/&/)[1].substr(7)
    }
    switch (action) {
      case '/town_info/send_units':
        addAttackSent(attackCounter)
        break
    }
  })

  $.ajaxPrefilter((opt, originalOptions, jqXHR) => {
    var url = opt.url.split('?'), action = ''
    if (typeof (url[1]) !== 'undefined' && typeof (url[1].split(/&/)[1]) !== 'undefined') {
      action = url[0].substr(5) + '/' + url[1].split(/&/)[1].substr(7)
    }
    switch (action) {
      case '/town_info/send_units':
        if (attackCounter[Game.townId] === maxAttacks) {
          alert('Je zit op teveel aanvallen idioot!!')
          jqXHR.abort()
        }
        break
    }
  })
})()

function addAttackSent (attackCounter) {
  const townId = Game.townId
  if (attackCounter[townId] === undefined) {
    attackCounter[townId] = 0
  }

  attackCounter[townId]++

  setTimeout(() => {
    attackCounter[townId]--
  }, 60 * 1000)
}
