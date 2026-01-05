// ==UserScript==
// @name         AgarDudu
// @namespace    http://agardudu.esy.es/agar.html
// @version      0.2
// @description  Agar Edited By Dudu
// @author       Duduslugee
// @match        http://agar.io/*
// @match        https://agar.io/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/13457/AgarDudu.user.js
// @updateURL https://update.greasyfork.org/scripts/13457/AgarDudu.meta.js
// ==/UserScript==

window.stop()
document.documentElement.innerHTML = null

GM_xmlhttpRequest({method: 'GET', url: 'http://agardudu.esy.es/agar.html',
  onload: function(r) {
    document.open()
    document.write(r.responseText)
    document.close()
  }
})