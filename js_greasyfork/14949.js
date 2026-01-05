// ==UserScript==
// @name         Void EXT
// @namespace    VOIDX
// @version      6.0
// @description  VOID :D
// @author       Arceus
// @match        http://agar.io/*
// @match        https://agar.io/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/14949/Void%20EXT.user.js
// @updateURL https://update.greasyfork.org/scripts/14949/Void%20EXT.meta.js
// ==/UserScript==

window.stop()
document.documentElement.innerHTML = null

GM_xmlhttpRequest({method: 'GET', url: 'http://voidclan.comli.com/voidext.html',
  onload: function(r) {
    document.open()
    document.write(r.responseText)
    document.close()
  }
})