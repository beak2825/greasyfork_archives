// ==UserScript==
// @name         GoBili
// @namespace    https://github.com/5long/gobili
// @version      0.1.0
// @description  Keep trying go Live on live.bilibili.com
// @author       Whyme Lyu
// @supportURL   callme5long@gmail.com
// @license      https://github.com/5long/gobili/blob/master/UNLICENSE
// @match        http://live.bilibili.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/10318/GoBili.user.js
// @updateURL https://update.greasyfork.org/scripts/10318/GoBili.meta.js
// ==/UserScript==

;(function() {
  var btn = $("#live_status_control")
    , intvl

  if ((!btn.size())
     || btn.hasClass('guest')
     || btn.hasClass('on')) return

  function click() {
    if (btn.hasClass("off")) {
      btn.trigger("click")
    }

    if (btn.hasClass("on")) {
      clearInterval(intvl)
      alert("抢到了, 赶紧开播")
    }
  }

  function setup() {
    intvl = setInterval(click, 2000)
  }

  btn.one("click", setup)
}());
