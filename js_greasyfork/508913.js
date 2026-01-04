// ==UserScript==
// @name         Neopets SSW Always Use Identical Match
// @namespace    neopets.com
// @version      1.0
// @description  Set SSW to always use "Identical to my phrase" option
// @author       darknstormy
// @match        http://www.neopets.com/*
// @match        https://www.neopets.com/*
// @match        https://neopets.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/508913/Neopets%20SSW%20Always%20Use%20Identical%20Match.user.js
// @updateURL https://update.greasyfork.org/scripts/508913/Neopets%20SSW%20Always%20Use%20Identical%20Match.meta.js
// ==/UserScript==


var d = document

var sswCriteria = d.getElementById("ssw-criteria")

if (sswCriteria) {
    sswCriteria.value = 'exact'
}