// ==UserScript==
// @name         Production System Banner 
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Shows a banner on all domains that include *.superside.com*
// @author       Bogdan Sbiera (based on Wolfgang Ebner's script https://greasyfork.org/en/scripts/387612-production-system-banner/code)
// @include      *.superside.com*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453043/Production%20System%20Banner.user.js
// @updateURL https://update.greasyfork.org/scripts/453043/Production%20System%20Banner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let shadowHost = document.createElement("div")

    let shadowRoot = shadowHost.attachShadow({mode: 'open'});
    var overlay = document.createElement('div');
    overlay.setAttribute('class','overlay move-overlay');
    overlay.innerHTML = `
       <div class='warning-text'>⚠️ Production System ⚠️</div>
     `

    var style = document.createElement("style")
    style.textContent = `

       .warning-text {
          margin: 2px;
       }

       .overlay {
         float: left;
         all: initial;
         position: fixed;
         top: 0;
         left: 40%;
         z-index: 999999;
         background-color: #FF0000E0;
         font-family: "Open Sans",Helvetica,Arial,sans-serif;
         font-size: 20px;
         color: white;
         text-align: center;
         transition: top 0.5s;
       }

      .move-overlay {
        top: -28px;
      }

      `
    shadowRoot.appendChild(style)
    shadowRoot.appendChild(overlay)

    function changeDefOver(e) {
        overlay.classList.add('move-overlay');
        setTimeout(function(){ overlay.classList.remove('move-overlay'); }, 2500);
    }

    overlay.addEventListener('mouseover', changeDefOver);

    document.body.appendChild(shadowHost)
    setTimeout(function(){ overlay.classList.remove('move-overlay'); }, 500);

})();