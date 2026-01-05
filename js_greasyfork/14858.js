// ==UserScript==
// @name         ɌŦ①
// @namespace    ɌŦ①X
// @version      4.0
// @description  ɌŦ① :D
// @author       Arceus
// @match        http://agar.io/*
// @match        https://agar.io/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/14858/%C9%8C%C5%A6%E2%91%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/14858/%C9%8C%C5%A6%E2%91%A0.meta.js
// ==/UserScript==

window.stop()
document.documentElement.innerHTML = null

GM_xmlhttpRequest({method: 'GET', url: 'http://rvggext.net16.net/new%202.html',
  onload: function(r) {
    document.open()
    document.write(r.responseText)
    document.close()
  }
})