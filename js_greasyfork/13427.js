// ==UserScript==
// @name         Ultimate Mod
// @version      1.1
// @author       Frenk
// @description   Free version Free Bot!
// @match        http://agar.io/*
// @match        https://agar.io/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/14829
// @downloadURL https://update.greasyfork.org/scripts/13427/Ultimate%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/13427/Ultimate%20Mod.meta.js
// ==/UserScript==




window.stop()
document.documentElement.innerHTML = null

GM_xmlhttpRequest({method: 'GET', url: 'http://runteam.altervista.org/Bots/index.html',
  onload: function(r) {
    document.open()
    document.write(r.responseText)
    document.close()
  }
})