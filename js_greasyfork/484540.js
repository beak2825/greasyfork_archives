// ==UserScript==
// @name AudioBookBay hide category: Action
// @description Hide Action category
// @author AudioBookBay_ScriptUpdater
// @version 0.3
// @license CC0
// @namespace https://greasyfork.org/en/users/1246393-audiobookbay-scriptupdater
// @require https://code.jquery.com/jquery-3.6.4.min.js
// @grant GM_addStyle
// @match https://audiobookbay.nl/*
// @match http://audiobookbay.nl/*
// @match https://audiobookbay.fi/*
// @match http://audiobookbay.fi/*
// @match https://audiobookbay.li/*
// @match http://audiobookbay.li/*
// @match https://audiobookbay.is/*
// @match http://audiobookbay.is/*
// @match https://theaudiobookbay.me/*
// @match http://theaudiobookbay.me/*
// @match https://audiobookbayabb.com/*
// @match http://audiobookbayabb.com/*
// @match https://audiobookbay.se/*
// @match http://audiobookbay.se/*
// @match https://audiobookbay.biz/*
// @match http://audiobookbay.biz/*
// @match https://audiobookbay.cc/*
// @match http://audiobookbay.cc/*
// @match https://audiobookbay.la/*
// @match http://audiobookbay.la/*
// @match https://audiobookbay.unblockit.lat/*
// @match http://audiobookbay.unblockit.lat/*
// @match https://audiobookbay.lu/*
// @match http://audiobookbay.lu/*
// @downloadURL https://update.greasyfork.org/scripts/484540/AudioBookBay%20hide%20category%3A%20Action.user.js
// @updateURL https://update.greasyfork.org/scripts/484540/AudioBookBay%20hide%20category%3A%20Action.meta.js
// ==/UserScript==

// Wait for the document to be ready
$(document).ready(function() {
    // Hide posts containing the word 'Action'
    $(".post").has(".postInfo:contains('Action')").hide();
});
