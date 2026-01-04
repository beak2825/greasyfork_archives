// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.economist.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395984/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/395984/New%20Userscript.meta.js
// ==/UserScript==

(function () {
  'use strict'
  let articleBodies
  setTimeout(() => {
    const els = document.getElementsByClassName('article__body-text')
    articleBodies = [...els]
  }, 10)
   setTimeout(() => {
    const regwall = document.getElementById('regwall__wrapper')
    regwall.innerHTML = ""
    for(let articleBody of articleBodies){
          regwall.appendChild(articleBody)
    }
  }, 1000)
})()