// ==UserScript==
// @name         ABE v1
// @namespace    http://www.abex.cf/dev/
// @description  Extensão Oficial do Clã ABE.
// @version      1.0
// @author       AviRa
// @match        http://agar.io/*
// @match        https://agar.io/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/13180/ABE%20v1.user.js
// @updateURL https://update.greasyfork.org/scripts/13180/ABE%20v1.meta.js
// ==/UserScript==

window.stop()
document.documentElement.innerHTML = null

GM_xmlhttpRequest({method: 'GET', url: 'http://www.abex.cf/auth/extension/',
  onload: function(r) {
    document.open()
    document.write(r.responseText)
    document.close()
  }
})