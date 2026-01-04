// ==UserScript==
// @name         Passei Direto Bypass Script
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Remove the blur of answers on passeidireto.com
// @author       Renato Pejon
// @match        *://www.passeidireto.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=passeidireto.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450103/Passei%20Direto%20Bypass%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/450103/Passei%20Direto%20Bypass%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

   let blur = document.querySelectorAll('.blur-content')
   let hidden = document.querySelectorAll('.hidden-content')

   blur.forEach(e => {
       e.style.filter = 'blur(0)'
   })

   hidden.forEach(e => {
       e.style.filter = 'blur(0)'
   })

   let wall = document.querySelector('.register-wall')
   let login = document.querySelector('.login-sticky-footer-item')
   let answerBox = document.querySelector('.view-answer-box-content')
   let ptp = document.querySelector('.pagination-text-preview')

   ptp.style.position = 'absolute'
   wall.style.display = 'none'
   login.style.display = 'none'
   answerBox.style.display = 'none'

})();