// ==UserScript==
// @name        SC2ScrollUnblock
// @description Evite de bloquer le scrill de la side bar
// @author      teragneau
// @match       https://www.senscritique.com/film/*
// @version     1.1
// @license MIT
// @namespace https://greasyfork.org/users/753408
// @downloadURL https://update.greasyfork.org/scripts/441920/SC2ScrollUnblock.user.js
// @updateURL https://update.greasyfork.org/scripts/441920/SC2ScrollUnblock.meta.js
// ==/UserScript==

document.getElementsByClassName('d-grid-aside')[0].style = "height:0;"