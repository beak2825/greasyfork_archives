// ==UserScript==
// @name         Hybrid Credit Checker
// @author       Tehapollo
// @version      1.0
// @include      https://www.gethybrid.io/workers/payments
// @require      https://code.jquery.com/jquery-latest.min.js
// @namespace    http://tampermonkey.net/
// @grant        GM_log
// @description  Checks if you're still getting credit
// @downloadURL https://update.greasyfork.org/scripts/391299/Hybrid%20Credit%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/391299/Hybrid%20Credit%20Checker.meta.js
// ==/UserScript==

(function() {
$('<input type="checkbox" id="checker" name="Checking"/><label>Credit Check <label/>').insertBefore("h2");
let CheckBoxer = localStorage.getItem('CheckBoxer') || '';
var terms = ["less than a minute ago","1 minute ago","2 minutes ago","3 minutes ago"]
var checkbox = document.getElementById("checker")
var lasthit = $(`[id="table2"] > tbody > tr > td:nth-child(2)`).next().html();
var Stopped = new SpeechSynthesisUtterance("Credit May Have Stopped, Check Page!");
checkbox.addEventListener('change', (event) => {
  if (event.target.checked) {
    localStorage.setItem('CheckBoxer', "on");
     check();
  } else {
   localStorage.setItem('CheckBoxer', "off");
  }
})
if (CheckBoxer == "on"){
    document.getElementById("checker").checked = true;
    check();
}

function check() {
if (checkbox.checked == true && !terms.includes(lasthit)){
window.speechSynthesis.speak(Stopped);
setTimeout(function() {
               location.reload(true);
            }, 1000*150);
        }
else if (checkbox.checked == true && terms.includes(lasthit)) {
setTimeout(function() {
               location.reload(true);
            }, 1000*150);
        }
}
})();