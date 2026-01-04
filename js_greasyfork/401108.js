// ==UserScript==
// @name        PornHub translation character count
// @namespace   Violentmonkey Scripts
// @match       https://de.pornhub.com/view_video.php
// @grant       none
// @version     1.0
// @author      disguised_monkey
// @description 16.4.2020, 19:19:45
// @downloadURL https://update.greasyfork.org/scripts/401108/PornHub%20translation%20character%20count.user.js
// @updateURL https://update.greasyfork.org/scripts/401108/PornHub%20translation%20character%20count.meta.js
// ==/UserScript==
console.log("Hi there, I will count your translation length today.");

// I tried t ostore text between closing and re-opening the translation pane; but some script clears the input field _after_ the click event has run
var text_entered = "";
// install this listener, as soon as the translation area comes into view
function install_translation_length_counter() {
  var submitButtonText = document.getElementById("suggestTranslationSubmit").textContent;
  var pornhubOrange = document.getElementById("suggestTranslationSubmit").style.backgroundColor
  document.getElementById("suggestTranslationInput").addEventListener("input", evt => {
    text_entered = document.getElementById("suggestTranslationInput").value;
    console.log("text="+text_entered);
    var nchars = text_entered.length;
    document.getElementById("suggestTranslationSubmit").textContent = submitButtonText + " ("+nchars+")";
    if (nchars > 75) {
      document.getElementById("suggestTranslationSubmit").style.backgroundColor = "red"
    } else {
      document.getElementById("suggestTranslationSubmit").style.backgroundColor = pornhubOrange;
    }
  });
}

// install only once
var installed = false;
document.getElementsByClassName("suggestTranslationToggleBtn")[0].addEventListener("click", click_evt => {
  if ( !installed ) {
    console.log("translation started");
    install_translation_length_counter();
    installed = true;
  }
})