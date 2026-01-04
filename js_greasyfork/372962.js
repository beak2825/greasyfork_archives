// ==UserScript==
// @name        Change Google Classroom User
// @namespace   Change Google Classroom User by C4illin
// @description Switches between /u/0 & /u/1 on google classroom automatically.
// @match       https://classroom.google.com/*
// @run-at      document-idle
// @grant       none
// @author      C4illin <hi@emrik.org>
// @oujs:author C4illin
// @version     1.2.2
// @homepageURL https://github.com/C4illin/Userscripts/tree/master/Change-Google-Classroom-User
// @license     MIT; https://opensource.org/licenses/MIT
// @copyright   2018-2021, C4illin (https://github.com/C4illin)
// @downloadURL https://update.greasyfork.org/scripts/372962/Change%20Google%20Classroom%20User.user.js
// @updateURL https://update.greasyfork.org/scripts/372962/Change%20Google%20Classroom%20User.meta.js
// ==/UserScript==

(function() {
  let refresh = setInterval(() => {
    if ((document.getElementsByClassName("Lqr2e").length != 0) && (window.location.pathname.length < 7)) {
      switchUser()
    }
    if ((document.getElementsByClassName("tCD5Mc").length != 0) && (window.location.pathname.length > 7)) {
      switchUser()
    }
  }, 350)
  
  function switchUser() {
    clearInterval(refresh)
    let time  = localStorage.getItem('gcsu-switches')
    let now = Date.now()
    if (now-time > 15000 ) {
      localStorage.setItem('gcsu-switches', now)
      let user
      if (window.location.pathname.substring(3,4) == 0) {
        user = 1
      } else {
        user = 0
      }
      let newlink = "https://classroom.google.com/u/"+ user + window.location.pathname.substring(4) + window.location.search + window.location.hash
      window.location.replace(newlink)
    }
  }
})()