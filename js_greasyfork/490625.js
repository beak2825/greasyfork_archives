// ==UserScript==
// @name          Show Password on ctrl+alt+ArrowRight
// @namespace    http://tampermonkey.net/
// @include       *
// @description	  Show Password when ctrl alt ArrowRight on password field
// @author        Hussain7Abbas
// @license       free
// @version       1.0.1
// @downloadURL https://update.greasyfork.org/scripts/490625/Show%20Password%20on%20ctrl%2Balt%2BArrowRight.user.js
// @updateURL https://update.greasyfork.org/scripts/490625/Show%20Password%20on%20ctrl%2Balt%2BArrowRight.meta.js
// ==/UserScript==


// This script written based on this script: https://greasyfork.org/en/scripts/32-show-password-onmouseover/code

window.setTimeout(function() {
  var passFields = document.querySelectorAll("input[type='password']");
  if (!passFields.length) return;
  for (var i = 0; i < passFields.length; i++) {
    passFields[i].addEventListener("keydown", function(e) {
        if(e.ctrlKey && e.altKey && e.key === "ArrowRight"){
            if (this.type === "text"){
               this.type = "password";
            }else{
                this.type = "text";
            }
        }
    }, false);
  }
}, 1000);