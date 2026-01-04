// ==UserScript==
// @name         El Nacional .CAT
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @match        http*://elnacional.cat/*
// @include      http*://*.elnacional.cat/*
// @grant        none
// @require http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/35729/El%20Nacional%20CAT.user.js
// @updateURL https://update.greasyfork.org/scripts/35729/El%20Nacional%20CAT.meta.js
// ==/UserScript==

;(function() {
  'use strict'
  setInterval(function() {
    $('.v-banners')
      .parent()
      .remove()
    $('.banner-f3').remove()
    $('.banner').remove()
    $('.banner-f1').remove()
    $('.banner-f2').remove()
    $('sas-container.sas-linear').remove()
    $('.banner-in-read').remove()
    $('div[id^=sas_]').remove()
    $('div[id^=sas-]').remove()
    $('div[id^=scr_]').remove()
    $('.hybs-slot').remove()
    $('.outbrain').remove()
  }, 1)
})()
