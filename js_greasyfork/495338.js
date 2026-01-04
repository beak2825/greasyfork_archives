// ==UserScript==
// @name        Aternos Anti-AdBlocker
// @namespace   SB
// @match       https://aternos.org/*
// @grant       GM_addStyle
// @version     1.1
// @author      Sertalp B. Cay
// @description 5/17/2024, 10:55:30 PM
// @run-at      document-start
// @license      MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/495338/Aternos%20Anti-AdBlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/495338/Aternos%20Anti-AdBlocker.meta.js
// ==/UserScript==

var $ = window.jQuery;

(function() {

    // 'use strict';

    GM_addStyle ( `

  ` );




//     function clone_body() {

//       let b = document.querySelector('body').cloneNode(true)
//       let c = document.querySelector("body > span")
//       c.remove()
//       setTimeout(() => {
//           document.querySelector('html').appendChild(b)
//         document.querySelector("body > span").remove()
//         document.querySelector(".body").style.display= ''
//         document.querySelector(".body").style.height = ''
//         document.querySelector(".body .header").style.display = ''
//         document.querySelector(".body .header").style.height = ''

//         let r = document.querySelector("div#crRqBrtNueYwV")
//         let v = document.querySelector(".page-content")
//         v.appendChild(r)
//         r.querySelector("div").style.height = ''
//         r.querySelector("div").style.width = ''

//       }, 100)



//     }



    // Wait for the DOM to be fully loaded
    window.addEventListener('load', () => {

      // setTimeout(clone_body, 300)
      e = document.querySelector("body")
      e.remove()
      setTimeout(() => {
          document.querySelector("html").appendChild(e)
      }, 500)
    }, false);

})();
