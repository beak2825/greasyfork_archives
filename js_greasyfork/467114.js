// ==UserScript==
// @name         YouTube Selected-Text search.
// @namespace    http://tampermonkey.net/
// @version      0.1
// @grant        GM_registerMenuCommand
// @description  Search the selected text on YouTube.
// @author       ftk789
// @include      https://*
// @include      http://*
// @icon         https://cdn-icons-png.flaticon.com/512/1384/1384060.png
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/467114/YouTube%20Selected-Text%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/467114/YouTube%20Selected-Text%20search.meta.js
// ==/UserScript==

// Chrome has the ability to search the highlighted text on Google when right-clicking a highlighted text, Have you ever wanted to add another option for that but for YouTube?

// Instructions:
//   highlight text on any page, and press CTRL + Y to search the Highlighted text on YouTube.

(function() {
  'use strict';

    (function() {
    'use strict';
    function onAltQ() {
     if (event.defaultPrevented ||
        /(input|textarea)/i.test(document.activeElement.nodeName)) {
        return;
      }
    searchYouTubeForSelectedText()
    }
        // Here: By pressing CTRL + Y , it instantly opens a new tab searching on YouTube what you highlighted.
        // You can change if you want something other than CTRL or another key instead of Y, You'll have to head to Use https://keycode.info/ To get the KeyCode and replace it with the current one.
    function onKeydown(evt) {
        // Use https://keycode.info/ to get keys
        if (evt.ctrlKey && evt.keyCode == 89) {
            onAltQ();
        }
    }
    document.addEventListener('keydown', onKeydown, true);
})();



  function searchYouTubeForSelectedText() {
    let selectedText = getSelection()
      .toString()
      .trim()
      .replace(/ /g, '+');
    if (selectedText) {
        window.open("https://www.youtube.com/results?search_query=" + selectedText, '_blank');
        // The comment under this comment is when you want to open the page on the current active page instead of opening a new tab.
    //GM_openInTab("https://www.youtube.com/results?search_query=" + selectedText, "active")
    }
  }

 // Register a button on the Tampermonkey menu.
GM_registerMenuCommand("Search on Youtube", () => {


    if (event.defaultPrevented ||
        /(input|textarea)/i.test(document.activeElement.nodeName)) {
        return;
      }
    searchYouTubeForSelectedText()

});

})();