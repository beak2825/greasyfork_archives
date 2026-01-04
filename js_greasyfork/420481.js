// ==UserScript==
// @name         Netgamers.it - Embed-a-lot!
// @namespace    Netgamers.it
// @version      1.1.1
// @description  Convert YT preview in YT embedded video.
// @author       Crius
// @match        http*://*netgamers.it/showthread.php*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/420481/Netgamersit%20-%20Embed-a-lot%21.user.js
// @updateURL https://update.greasyfork.org/scripts/420481/Netgamersit%20-%20Embed-a-lot%21.meta.js
// ==/UserScript==

/* eslint-env jquery */

// MAIN

$(document).ready(() => {
    $('[id*="ytVideo"]').each(function() {
        console.log('Detected YT Video:', $(this).attr('title'));
        $(this).html('<iframe width="560" height="315" src="https://www.youtube.com/embed/'+ $(this).attr('title') +'" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>');
    });
});