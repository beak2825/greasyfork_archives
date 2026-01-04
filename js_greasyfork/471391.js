  // ==UserScript==
    // @name        22pixx.xyz
    // @namespace   meta Scripts
    // @match       https://22pixx.xyz/ia-a/*
    // @grant       none
    // @version     1.0
    // @author      meta
    // @license     MIT
    // @description Just opens the image
// @downloadURL https://update.greasyfork.org/scripts/471391/22pixxxyz.user.js
// @updateURL https://update.greasyfork.org/scripts/471391/22pixxxyz.meta.js
    // ==/UserScript==

let noxo = href.replace('/ia-a/', '/i-a/')

window.location = noxo