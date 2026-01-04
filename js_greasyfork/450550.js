// ==UserScript==
// @name        Bypass stltoday.com paywall
// @namespace   Violentmonkey Scripts
// @match       https://*.stltoday.com/
// @grant       none
// @version     1.0
// @author      -
// @description 8/31/2022, 1:45:25 PM
// @downloadURL https://update.greasyfork.org/scripts/450550/Bypass%20stltodaycom%20paywall.user.js
// @updateURL https://update.greasyfork.org/scripts/450550/Bypass%20stltodaycom%20paywall.meta.js
// ==/UserScript==

function clean() {
  let subwall = document.querySelector('#lee-subscription-wall');
  if(subwall) {
    subwall.remove()
  }

  let regwall = document.querySelector('#lee-registration-wall');
  if(regwall) {
    regwall.remove()
  }

  let backdrop = document.querySelectorAll('.modal-backdrop');
  if(backdrop && backdrop.length > 0) {
    backdrop[0].remove();
  }

  document.querySelector('body').style.overflow="auto";
}

function evade() {
  let oldClass = "lee-article-text";
  let newClass = "free-article-text";

  var divs = document.querySelectorAll('.lee-article-text');
  if(divs.length > 0) {
    for(i = 0; i < divs.length; ++i) {
      divs[i].classList.add(newClass);
      divs[i].classList.remove(oldClass);
    }
  } else {
    setTimeout(evade, 10);
  }
}

// Document Start
var script = document.createElement('script');
script.src = `window.lee_meter_loaded = true;
window.show_dimissable_registration = true;

function defuse() {
  if(window.TNCMS && window.TNCMS.Access) {
    window.TNCMS.Access.checkAccess = function(fnSuccess, fnFailure) {
      fnSuccess({required: false});
    }
  } else {
    setTimeout(defuse, 10);
  }
}

defuse();`
(document.body || document.head || document.documentElement).appendChild(script);

setTimeout(evade, 100);
setTimeout(clean, 700);