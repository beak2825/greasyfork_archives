// ==UserScript==
// @name         Remove Description Box on Scratch
// @namespace    Hans5958
// @version      4
// @description  Remove the instruction/notes box on Scratch (Deprecated: Use Scratch Addons instead.)
// @copyright    Hans5958
// @license      MIT
// @match        http*://scratch.mit.edu/projects/*
// @grant        none
// @homepageURL  https://github.com/Hans5958/userscripts
// @supportURL   https://github.com/Hans5958/userscripts/issues
// @downloadURL https://update.greasyfork.org/scripts/444670/Remove%20Description%20Box%20on%20Scratch.user.js
// @updateURL https://update.greasyfork.org/scripts/444670/Remove%20Description%20Box%20on%20Scratch.meta.js
// ==/UserScript==

window.onload = function() {
    var r = document.getElementsByClassName("project-textlabel")
    var x = y => " <a class='remove' onclick='var e=e=>document.getElementsByClassName(e),r=e(\"project-textlabel\"),d=e(\"description-block\");d[" + y + "].remove(),e(\"remove\")[0].hidden=!0;'>❌</a>"
    r[0].innerHTML += x(0)
    r[1].innerHTML += x(1)
}