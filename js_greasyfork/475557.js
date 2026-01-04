// ==UserScript==
// @name        X-Classpad VIP Hack-X - discontinued
// @namespace   Tampermonkey Scripts
// @match       https://classpad.net/*
// @grant       none
// @version     1.1 discontinued
// @author      PMHTools
// @description 18/12/2022, 19:49:52
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475557/X-Classpad%20VIP%20Hack-X%20-%20discontinued.user.js
// @updateURL https://update.greasyfork.org/scripts/475557/X-Classpad%20VIP%20Hack-X%20-%20discontinued.meta.js
// ==/UserScript==
let n = 0
const i = setInterval(() => {
  try {
    Classpad.Services.UserService.canUseManifestControlledFeature = () => true
    Classpad.Services.UserService.canUsePaidFeature = () => true
    clearInterval(i)
  } catch {}
  if (++n > 200) clearInterval(i) // after 20s its probably over
}, 100)
