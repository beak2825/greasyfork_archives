// ==UserScript==
// @namespace     https://openuserjs.org/users/cuzi
// @name          Quora.com (mobile) hide 'View in app' overlay
// @description   Remove the "View in app" overlay on quora.com in mobile browsers
// @copyright     2019, cuzi (https://openuserjs.org/users/cuzi)
// @license       MIT
// @version       3
// @include       https://quora.com/*
// @include       https://*.quora.com/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/391873/Quoracom%20%28mobile%29%20hide%20%27View%20in%20app%27%20overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/391873/Quoracom%20%28mobile%29%20hide%20%27View%20in%20app%27%20overlay.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author cuzi
// ==/OpenUserJS==

function remove(query) {
  const e = document.querySelector(query)
  if (e) e.remove()
}

const removeOverlayIV = window.setInterval(function () {
  remove('.OpenInAppBanner')
  let e
  if (document.querySelector('.ZapdosWallWrapper.show .ViewInAppLink')) {
    remove('.ZapdosWallWrapper.show')
    clearInterval(removeOverlayIV)
  }
  e = document.querySelector('.q-absolute.qu-bg--blue')
  if (e && e.textContent.indexOf('App') !== -1) {
    e.remove()
    clearInterval(removeOverlayIV)
  }

}, 2000)

const removeSignupOverlayIV = window.setInterval(function () {
  remove('.OpenInAppBanner')
  let e = document.querySelector('.new_signup_dialog')
  if (e) {
    e.parentNode.remove()
  }
  e = document.getElementById('page_wrapper')
  if (e) {
    e.style.filter = "blur(0px)"
  }
  e = document.body
  if (e) {
    e.classList.remove('signup_wall_prevent_scroll')
  }

 e = document.querySelector('.modal_signup_dialog')
 if (e) {
   while(e.parentNode!= document.body) {
     e = e.parentNode
   }
   e.remove()
 }


}, 1000)
