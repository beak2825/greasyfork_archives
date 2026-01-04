// ==UserScript==
// @name         Facebook hidden
// @namespace    https://terpise.com
// @version      1.1.1
// @description  Facebook change UI to Stack Overflow
// @author       terpise
// @match        https://www.facebook.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/484206/Facebook%20hidden.user.js
// @updateURL https://update.greasyfork.org/scripts/484206/Facebook%20hidden.meta.js
// ==/UserScript==

(function () {
  'use strict'
  window.onload = function () {
    //Replay favicon
    var link = document.querySelector('link[rel*=\'icon\']') || document.createElement('link')
    link.type = 'image/x-icon'
    link.rel = 'shortcut icon'
    link.href = 'https://cdn.sstatic.net/Sites/stackoverflow/Img/favicon.ico'
    document.getElementsByTagName('head')[0].appendChild(link)
    document.title = 'Stack Overflow - Where Developers Learn, Share, & Build Careers'

    //Hide images
    const style = document.createElement('style')

    //body *  color: #5b5b5b !important;
    style.innerHTML = `
        img, image{
            display: none !important;
        }
        .__fb-light-mode, .__fb-dark-mode {
          --fb-logo: #18191a !important;
          --base-blue: #5b5b5b !important;
          --primary-text: #696969 !important;
          --primary-icon: var(--primary-text);
          --secondary-icon: var(--primary-text);
          --secondary-text: var(--primary-text);
          --placeholder-text: var(--primary-text);
        }
        .xe3v8dz {
           fill: #18191a !important;
        }

        body * {
            border-color: transparent !important;
            background-color: transparent !important;
        }

        i {
            opacity: 0.2;
        }
        svg {
            opacity: 0.2;
        }
        .x14ctfv {
            color: #3b3b3c !important;
        }
    `
    document.head.appendChild(style)
  }
})()
