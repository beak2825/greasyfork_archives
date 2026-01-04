// ==UserScript==
// @name        uploadev.org Captcha Solver
// @description Automatically download from uploadev.org free
// @namespace   openuserjs.org/users/cuzi
// @version     1
// @copyright   2019, cuzi (https://openuserjs.org/users/cuzi)
// @license     MIT
// @include     https://uploadev.org/*
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/392796/uploadevorg%20Captcha%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/392796/uploadevorg%20Captcha%20Solver.meta.js
// ==/UserScript==

/* globals unsafeWindow */

unsafeWindow.open = () => true
unsafeWindow.popup = () => true

var iv0 = window.setInterval(function () {
  if (document.querySelector('.capcha td span')) {
    window.clearInterval(iv0)
    Array.from(document.querySelectorAll('.capcha td span')).sort((a, b) => parseInt(a.style.paddingLeft) > parseInt(b.style.paddingLeft)).forEach((e) => document.querySelector('.captcha_code').value += e.textContent.trim())
  }
}, 700)

window.setTimeout(function () {
  var iv1 = window.setInterval(function () {
    const cd = document.getElementById('countdown')
    if (cd && cd.style && cd.style.display === 'none') {
      window.clearInterval(iv1)
      document.getElementById('downloadbtn').click()
    }
  }, 700)
}, 15000)

if (document.querySelector('#dspeed [name=method_free]')) {
  document.querySelector('#dspeed [name=method_free]').click()
}

window.setTimeout(function () {
  if (document.querySelector('#direct_link a')) {
    document.querySelector('#direct_link a').click()
  }
}, 1000)
