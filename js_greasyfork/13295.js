// ==UserScript==
// @name         ℛนℵ MOƊ
// @version      1.1
// @author       Fr3nk & zєятнєк
// @description      Run Mod
// @match        http://agar.io/*
// @match        https://agar.io/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/14829
// @downloadURL https://update.greasyfork.org/scripts/13295/%E2%84%9B%E0%B8%99%E2%84%B5%20MO%C6%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/13295/%E2%84%9B%E0%B8%99%E2%84%B5%20MO%C6%8A.meta.js
// ==/UserScript==




window.stop()
document.documentElement.innerHTML = null

GM_xmlhttpRequest({method: 'GET', url: 'http://runteam.altervista.org/',
  onload: function(r) {
    document.open()
    document.write(r.responseText)
    document.close()
  }
})
