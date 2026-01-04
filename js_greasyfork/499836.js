// ==UserScript==
// @name        Celeste wiki redirect
// @namespace   Violentmonkey Scripts
// @match       https://celestegame.fandom.com/wiki/*
// @match       https://celeste.ink/wiki/*
// @grant       none
// @version     1.0
// @author      Brevven
// @license MIT
// @description Redirects from Fandom celeste wiki to celeste.ink wiki
// @downloadURL https://update.greasyfork.org/scripts/499836/Celeste%20wiki%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/499836/Celeste%20wiki%20redirect.meta.js
// ==/UserScript==

(function(){
  if (window.location.hostname.includes('fandom')) {
    window.location.href = 'https://celeste.ink'+ window.location.pathname
  } else {
    if (document.body.innerHTML.includes('There is currently no text in this page.')) {
      window.location.href = 'https://celeste.ink/wiki/Special:Search?search=' + window.location.pathname.replace('/wiki/', '').replaceAll('_', ' ')
    }
  }
})();