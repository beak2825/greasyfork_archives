// ==UserScript==
// @name Ylilauta 'Last own post'-button
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @grant none
// @version 0.1
// @locale en
// @description Scroll to your last own post in the thread.
// @downloadURL https://update.greasyfork.org/scripts/40514/Ylilauta%20%27Last%20own%20post%27-button.user.js
// @updateURL https://update.greasyfork.org/scripts/40514/Ylilauta%20%27Last%20own%20post%27-button.meta.js
// ==/UserScript==

const buttonsRight = document.querySelector('.buttons_right')
if (buttonsRight) {
  var btn = document.createElement('button')
  btn.innerText = 'Last own post'
  btn.className = 'linkbutton'
  btn.onclick = () => {
    const posts = document.querySelectorAll('div.own_post')
    posts[posts.length-1].scrollIntoView(true)
  }
  buttonsRight.insertBefore(btn, buttonsRight.firstChild)
}