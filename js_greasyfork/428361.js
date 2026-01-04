// ==UserScript==
// @name        Remove title attributes
// @namespace   Violentmonkey Scripts
// @match       https://www.last.fm/music/*
// @grant       none
// @version     1.1
// @author      Lukáš Kucharczyk
// @description Removes all title attributes of all <a> tags.
// @downloadURL https://update.greasyfork.org/scripts/428361/Remove%20title%20attributes.user.js
// @updateURL https://update.greasyfork.org/scripts/428361/Remove%20title%20attributes.meta.js
// ==/UserScript==
document.querySelectorAll('a[title]').forEach((el) => {
    el.removeAttribute('title')
})