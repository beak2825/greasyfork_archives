// ==UserScript==
// @name         HideProgressBarOnReadWise
// @namespace    http://tampermonkey.net/
// @version      2024-04-12
// @author       You
// @description  This script can help you hide the progress bar on ReadWide
// @match        https://read.readwise.io/*
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @require https://update.greasyfork.org/scripts/383527/701631/Wait_for_key_elements.js
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/492334/HideProgressBarOnReadWise.user.js
// @updateURL https://update.greasyfork.org/scripts/492334/HideProgressBarOnReadWise.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // Your code here...

    waitForKeyElements("#root", function(){
    var progress_bar = document.evaluate("//*[@id=\"root\"]/div[1]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    progress_bar.style.visibility = "hidden";
});

})();