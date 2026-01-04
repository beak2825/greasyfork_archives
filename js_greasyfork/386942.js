// ==UserScript==
// @name         Simple Cache CSS fix
// @version      0.1
// @description  Fixes CSS overflow issue for Philosophers caches.
// @author       Lemon Emperor
// @match        https://www.gaiaonline.com/inventory/view/*
// @match        https://www.gaiaonline.com/inventory
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js
// @grant        none
// @namespace https://greasyfork.org/users/313807
// @downloadURL https://update.greasyfork.org/scripts/386942/Simple%20Cache%20CSS%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/386942/Simple%20Cache%20CSS%20fix.meta.js
// ==/UserScript==

$("<style>")
    .prop("type", "text/css")
    .html("\
#gaia_content #choice_items.choice_3, #gaia_modal #choice_items.choice_3 {\
width: auto;\
margin: auto;\
flex-wrap: wrap;\
display: flex;\
align-items: center;\
justify-content: center;\
}")
    .appendTo("head");
