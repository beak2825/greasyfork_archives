// ==UserScript==
// @name        Char replacer 
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.0
// @author      -
// @description 16.08.2020, 16:39:22
// @downloadURL https://update.greasyfork.org/scripts/408880/Char%20replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/408880/Char%20replacer.meta.js
// ==/UserScript==

var charsChange = {
    а: "о",
    о: "а",
    б: "п",
    п: "б",
    в: "ф",
    ф: "в",
    г: "к",
    к: "г",
    д: "т",
    т: "д",
    е: "э",
    э: "е",
    щ: "ж",
    ш: "щ",
    ж: "ш",
    з: "с",
    с: "з",
    и: "ы",
    ы: "и",
    л: "р",
    р: "л",
    м: "н",
    н: "м",
    у: "ю",
    ю: "у",
    я: "а"
}

onkeydown = function (e) {
    if (e.target.tagName != 'INPUT' && e.target.tagName != 'TEXTAREA') return
    if (Math.random() > .1) return
    var char
    if (charsChange[e.key]) char = charsChange[e.key]
    else return
    e.preventDefault()
    e.target.value += char
}