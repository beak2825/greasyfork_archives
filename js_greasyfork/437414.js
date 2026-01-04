// ==UserScript==
// @name        Better 22pixx.xyz
// @namespace   Violentmonkey Scripts
// @match       https://22pixx.xyz/x-o/*
// @grant       none
// @version     1.0
// @author      -
// @description Just open the image - 12/16/2021, 10:03:09 AM
// @downloadURL https://update.greasyfork.org/scripts/437414/Better%2022pixxxyz.user.js
// @updateURL https://update.greasyfork.org/scripts/437414/Better%2022pixxxyz.meta.js
// ==/UserScript==

let href = window.location.href
let noxo = href.replace('/x-o/', '/o/')
let jpeg = noxo.replace(/\.jpeg\.html$/, '.jpeg')
window.location = jpeg