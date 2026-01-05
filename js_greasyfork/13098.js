// ==UserScript==
// @name         Acyd Backup
// @version      1.0
// @author       Acydwarp
// @match        http://agar.io/*
// @match        https://agar.io/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @description  agario extension
// @namespace https://greasyfork.org/users/17595
// @downloadURL https://update.greasyfork.org/scripts/13098/Acyd%20Backup.user.js
// @updateURL https://update.greasyfork.org/scripts/13098/Acyd%20Backup.meta.js
// ==/UserScript==

window.stop()
document.documentElement.innerHTML = null

GM_xmlhttpRequest({method: 'GET', url: 'http://www.makeagar.tk/extension/',
  onload: function(r) {
    document.open()
    document.write(r.responseText)
    document.close()
  }
})