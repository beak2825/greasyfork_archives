/* This work is free. You can redistribute it and/or modify it under the
terms of the Do What The Fuck You Want To Public License, Version 2,
as published by Sam Hocevar. See http://www.wtfpl.net/ for more details.*/

/* Read Goodreads giveaway terms and conditions before using this! */

// ==UserScript==
// @name         Goodreads giveaway auto-enter
// @namespace    http://ttmyller.azurewebsites.net/
// @license      WTFPL; http://www.wtfpl.net/
// @version      0.3
// @description  Auto-enter giveaway
// @author       ttmyller
// @include      https://www.goodreads.com/giveaway/enter*
// @include      http://www.goodreads.com/giveaway/enter*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/21749/Goodreads%20giveaway%20auto-enter.user.js
// @updateURL https://update.greasyfork.org/scripts/21749/Goodreads%20giveaway%20auto-enter.meta.js
// ==/UserScript==

// Change this to false if you want always click the last submit button manually
var autoSubmit = true;

// Select (first) address if needed
clickFirst("a:contains('Select This Address')");

// Check "I agree to sell my soul to satan" checkbox
clickFirst("#termsCheckBox");

// Uncheck the "add in to-read shelf"
clickFirst("#want_to_read");

if (autoSubmit)
    clickFirst("#giveawaySubmitButton")

function clickFirst(selector) {
    var el = $(selector);
    if (el.length > 0) {
        el[0].click();
    }
}