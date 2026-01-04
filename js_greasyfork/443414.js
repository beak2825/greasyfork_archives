// ==UserScript==
// @name        gibdd_autotype
// @namespace   org.demidrol
// @match       *://гибдд.рф/check/fines
// @match       *://xn--90adear.xn--p1ai/check/fines
// @grant       GM.getValue
// @grant       GM_getValue
// @grant       GM.setValue
// @grant       GM_setValue
// @version     1.0
// @author      dmitrodem@gmail.com
// @description Автозаполнение полей для проверки штрафов
// @license     GPL
// @downloadURL https://update.greasyfork.org/scripts/443414/gibdd_autotype.user.js
// @updateURL https://update.greasyfork.org/scripts/443414/gibdd_autotype.meta.js
// ==/UserScript==


function check(changes, observer) {
  let btn = document.querySelector('a.checker');
  if (btn) {
    observer.disconnect();
    ["Regnum", "Regreg", "Stsnum"].forEach(function(fieldname) {
      GM.getValue(fieldname).then(
        function(v) {
          if (v) {
            document.querySelector("input#checkFines" + fieldname).value = v;
            console.log("Filled " + fieldname);
          }
          btn.addEventListener("click", function(e) {
            GM.setValue(fieldname, document.querySelector("input#checkFines" + fieldname).value)
                .then(v => console.log("Saved " + fieldname));          
            })
        })
    })    
  }
}

(new MutationObserver(check)).observe(document, {childList: true, subtree: true});