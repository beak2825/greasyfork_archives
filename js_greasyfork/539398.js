// ==UserScript==
// @name        Can't page back on Roll20
// @namespace   Violentmonkey Scripts
// @match       https://app.roll20.net/editor/*
// @grant       none
// @version     1.0
// @author      JasperV
// @description 14/06/2025, 14:05:46
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539398/Can%27t%20page%20back%20on%20Roll20.user.js
// @updateURL https://update.greasyfork.org/scripts/539398/Can%27t%20page%20back%20on%20Roll20.meta.js
// ==/UserScript==


function pushEmptyEntry()
{
  history.pushState(null, null, location.href)
}

window.addEventListener('popstate', function(event)
{
 pushEmptyEntry()
})

pushEmptyEntry()

