// ==UserScript==
// @name        Cookie Clicker
// @namespace   Cookie Cliker Scripts
// @match       https://orteil.dashnet.org/cookieclicker/
// @grant       none
// @version     1.2
// @author      Artem_8086
// @description 14.07.2020, 15:54:24
// @downloadURL https://update.greasyfork.org/scripts/407102/Cookie%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/407102/Cookie%20Clicker.meta.js
// ==/UserScript==


(function() {

  var cookie = document.getElementById('bigCookie')
  var shimers = document.getElementById('shimmers')

  var timer = null
  window.enableBot = function() {
    console.log('Clicker Bot enabled!')
    timer = setInterval(function() {
      cookie.click()
      for (var i=0, shimer; shimer=shimers.children[i]; i++) {
        shimer.click()
      }
    },0)
  }

  window.disableBot = function() {
    console.log('Clicker Bot disabled!')
    if (timer != null) {
      clearInterval(timer)
      timer = null
    }
  }

  setTimeout(enableBot, 1000)

})()