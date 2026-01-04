// ==UserScript==
// @name streamango pairing - speedup
// @description speeds up the pairing process by activating the pair button (works best with my ReCaptcha Automatizer)
// @namespace Violentmonkey Scripts
// @match https://streamango.com/pair
// @grant none
// @version 0.0.1.20190621153809
// @downloadURL https://update.greasyfork.org/scripts/386651/streamango%20pairing%20-%20speedup.user.js
// @updateURL https://update.greasyfork.org/scripts/386651/streamango%20pairing%20-%20speedup.meta.js
// ==/UserScript==

var oldOnload = window.onload;

window.onload = function () {

    if (typeof oldOnload == 'function') {
       oldOnload();
    }
    var arrComposite = document.querySelectorAll('[id*="Composite"]');
  
    for (var i = 0; i < arrComposite.length; i++)
    {
      arrComposite[i].style.display = "none";
    }
  
    document.getElementById("alreadyPairedAd").style.display = "none";
    document.getElementById("submitPair").innerHTML = "Pair";
    document.getElementById("submitPair").removeAttribute("disabled");
  
} 