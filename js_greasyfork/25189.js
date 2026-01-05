// ==UserScript==
// @name           Selective Signature
// @version        2.0
// @description    Automatically disables your signature on all posts outside of a specific forum category
// @author         Mr Whiskey
// @include        https://hackforums.net/showthread.*
// @include        https://hackforums.net/newreply.*
// @include        https://hackforums.net/newthread.*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @namespace      http://www.fuckboygamers.club
// @downloadURL https://update.greasyfork.org/scripts/25189/Selective%20Signature.user.js
// @updateURL https://update.greasyfork.org/scripts/25189/Selective%20Signature.meta.js
// ==/UserScript==

$('input[name="postoptions[signature]"]').each(function(){ this.checked = true; }); // Disables checkmark for some reason

if($('a:contains("Instinct")').length > 0 === false) // Checks if <a> link contains "Instinct" group
   $('input[name="postoptions[signature]"]').each(function(){ this.checked = false; }); // Enables checkmark for some reason