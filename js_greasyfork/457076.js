// ==UserScript==
// @name         Space bar shortcut
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @grant        none
// @license MIT
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/457076/Space%20bar%20shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/457076/Space%20bar%20shortcut.meta.js
// ==/UserScript==

// prevent space from scrolling down
window.addEventListener('keydown', function(e) {
  if(e.keyCode == 32 && e.target == document.body) {
    e.preventDefault();
  }
});

document.body.onkeyup = function(e) {
    // if space is pressed and text input isn't focused
    var el = document.activeElement;
    var input_selected = (el && (el.tagName.toLowerCase() == 'input' && el.type == 'text' ||
    el.tagName.toLowerCase() == 'textarea'))
    var text_elem = $("span").filter( function() { return ($(this).text() ==='Guess')} );

    if ((e.key == " " ||
        e.code == "Space" ||
        e.keyCode == 32)
        && !input_selected
        && text_elem.length == 0
       ) {
        // go to "view summary" rather than "next map"
        var vew_summarys = $("[data-qa*='close-round-result']");
        if (vew_summarys.length){
            // click the first one
            vew_summarys[0].click();
            return
        }
        // get all elements with the prefix for the primary button class
        var primary_buttons = $("[class*='button_variantPrimary_']");
        if (primary_buttons.length){
            // click the first one
            primary_buttons[0].click();
        }

    }
}