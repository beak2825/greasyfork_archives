// ==UserScript==
// @name         Spotify Automatic facebook login
// @description  Automatically log in to Spotify web with your facebook account, no need to click the multiple login buttons anymore
// @namespace    cuzi
// @icon         https://www.google.com/s2/favicons?sz=128&domain=spotify.com
// @version      15
// @grant        GM.setValue
// @grant        GM.getValue
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @match        https://open.spotify.com/*
// @match        https://accounts.spotify.com/*
// @match        https://www.facebook.com/login.php*
// @match        https://www.facebook.com/checkpoint/*
// @downloadURL https://update.greasyfork.org/scripts/372277/Spotify%20Automatic%20facebook%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/372277/Spotify%20Automatic%20facebook%20login.meta.js
// ==/UserScript==

/* global GM */
/* jshint asi: true, esversion: 8 */

'use strict'

let stopFlag = false
let iv

function stop () {
  // Stop script execution
  stopFlag = true
  clearInterval(iv)
}

async function login () {
  if (stopFlag) return

  if (document.querySelector('button[title~="Upgrade"]')) {
    document.querySelector('button[title~="Upgrade"]').style.display = 'none'
  }

  if (document.querySelector('#main .dialog h1') && document.querySelector('#main .dialog h1').innerHTML.indexOf('An error occurred') !== -1) {
    // An error occurred. Something went wrong. Try reloading the page.  --> Logout and then reload
    fetch('https://open.spotify.com/logout')
      .then(function (response) {
        return response.json()
      })
      .then(function (myJson) {
        if (myJson && myJson.success) {
          window.location.reload(true)
        } else {
          document.location.href = 'https://open.spotify.com/logout'
        }
      })
    return stop()
  }

  let button = document.querySelector('[data-testid="login-button"]')
  if (button) {
    button.click()
  }

  button = document.querySelector('button#has-account')
  if (button) {
    button.click()
  }

  button = document.querySelector('#onetrust-accept-btn-handler')
  if (button) {
    button.click()
  }

  button = document.querySelector('[data-testid="facebook-login"]')
  if (button) {
    button.click()
  }

  button = document.querySelector('.btn-facebook')
  if (button) {
    button.click()
  }

  button = document.querySelector('.navBar-signupPrompt button.btn-black')
  if (button) {
    button.click()
  }

  const buttons = document.querySelectorAll('.Root__main-view header button,.Root__top-bar header button')
  buttons.forEach(function (b) {
    if (b.textContent.toLowerCase().indexOf('log in') !== -1) {
      b.click()
    }
  })

  if (document.querySelector('#login-screen')) {
    await GM.setValue('userscript_auto_redirect', document.location.href)
  }

  if (document.location.href.indexOf('login?continue=') !== -1) {
    await GM.setValue('userscript_auto_redirect', document.location.href)
  }

  if (document.location.href === 'https://accounts.spotify.com/en/status') {
    const url = await GM.getValue('userscript_auto_redirect', false)
    if (url) {
      await GM.setValue('userscript_auto_redirect', false)
      document.location.href = url
      return stop()
    }
  }
}

function facebook () {
  let button = document.querySelector('[data-cookiebanner="accept_only_essential_button"]')
  if (button) {
    button.click()
  }

  if (document.querySelector('input#pass') && document.querySelector('input#pass').value) {
    button = document.querySelector('#loginbutton')
    if (button) {
      button.click()
    }
  }

  // Don't save browser
  if (document.querySelector('input[value=dont_save]')) {
    document.querySelector('input[value=dont_save]').checked = true
  }
}

if (document.location.href.startsWith('https://www.facebook.com/')) {
  facebook()
  window.setTimeout(facebook, 2000)
} else {
  login()
  window.setTimeout(login, 500)
  window.setTimeout(login, 1000)
  iv = window.setInterval(login, 3000)
}
