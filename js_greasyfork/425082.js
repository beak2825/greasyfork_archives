// ==UserScript==
// @name         KOAN forever
// @namespace    https://ciffelia.com/
// @version      1.0.4
// @description  Automatically extends sessions on KOAN.
// @author       Ciffelia <mc.prince.0203@gmail.com> (https://ciffelia.com/)
// @match        https://koan.osaka-u.ac.jp/*
// @downloadURL https://update.greasyfork.org/scripts/425082/KOAN%20forever.user.js
// @updateURL https://update.greasyfork.org/scripts/425082/KOAN%20forever.meta.js
// ==/UserScript==

(() => {
  if (extendSession === undefined) {
    return
  }

  const getInterval = () => 1000 * 60 * (10 + 10 * Math.random())

  const handler = () => {
    extendSession()
    setTimeout(handler, getInterval())
  }
  setTimeout(handler, getInterval())
})()
