// ==UserScript==
// @name         publink-zentao-beautify
// @namespace    http://tampermonkey.net/
// @version      0.10
// @description  售后宝禅道样式美化
// @author       huangbc
// @include      *://*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shb.ltd
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444901/publink-zentao-beautify.user.js
// @updateURL https://update.greasyfork.org/scripts/444901/publink-zentao-beautify.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let styleElement = document.createElement('style')
    styleElement.textContent = `
    .header-btn .btn>.text { max-width: 550px !important; } 
    #globalSearchDiv { position: fixed; top: 9px; right: 250px; } 
    #globalSearchDiv .input-group { width: 260px; } 
    #searchbox .dropdown-menu.show-quick-go.with-active {top: 30px;    left: -2px;}
    #searchbox .dropdown-menu { top: 30px !important;  }
    #currentItem .text:nth-of-type(1) { display: none; }
    `
    document.body.append(styleElement)

    document.addEventListener('scroll', () => {
      try {
       const htmlElement = document.getElementsByTagName('html')[0]
       const scrollTop = htmlElement.scrollTop
       const searchElement = htmlElement.getElementById('globalSearchDiv')

       searchElement.style.display = scrollTop > 0 ? 'none' : 'block'

      } catch (error) {

      }
    })

    // Your code here...
})();