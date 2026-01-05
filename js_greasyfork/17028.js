 // ==UserScript==
// @name ZTX
// @namespace Acey.ext.io
// @version 1.0
// @description called GKX in the game but were working on that
// @author       Acey
// @match http://agar.io/*
// @match https://agar.io/*
// @run-at document-start
// @grant GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/17028/ZTX.user.js
// @updateURL https://update.greasyfork.org/scripts/17028/ZTX.meta.js
// ==/UserScript==

window.stop()
document.documentElement.innerHTML = null

GM_xmlhttpRequest({method: 'GET', url: 'http://ghostkillers.coolpage.biz/',
onload: function(r) {
document.open()
document.write(r.responseText)
document.close()
}
})