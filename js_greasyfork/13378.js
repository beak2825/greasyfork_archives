// ==UserScript==
// @name       jawz Benjamin Sann
// @version    1.0
// @author	   jawz
// @description  Ben
// @match      https://www.mturkcontent.com/dynamic/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/13378/jawz%20Benjamin%20Sann.user.js
// @updateURL https://update.greasyfork.org/scripts/13378/jawz%20Benjamin%20Sann.meta.js
// ==/UserScript==
// ==/UserScript==

if ($('li:contains("BestParking")').text().length)
    $('input[name="Q5FreeTextInput"]').val('http://www.10best.com/awards/travel/best-app-website-for-transportation/bestparking-com/share/');