// ==UserScript==
// @name         RateYourMusic Collection Randomizer
// @version      2
// @license      CC0-1.0
// @description  Add buttons to the top of all RYM collection pages which allows you to get a random album from a page or a random page of the current selected settings
// @author       https://github.com/Schwtz
// @match        https://rateyourmusic.com/collection/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rateyourmusic.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @namespace    https://greasyfork.org/users/1439067
// @downloadURL https://update.greasyfork.org/scripts/528911/RateYourMusic%20Collection%20Randomizer.user.js
// @updateURL https://update.greasyfork.org/scripts/528911/RateYourMusic%20Collection%20Randomizer.meta.js
// ==/UserScript==

//random album
var albumButton = $('<a>');
albumButton.attr('class', 'btn');
albumButton.text('random album');
$('#content').prepend(albumButton);

albumButton.click(function() {
  var albumList = $('.album');
  var albumRandom = Math.floor(Math.random() * albumList.length);
  document.location = albumList[albumRandom].href;
});


//random collection page
var collectionButton = $('<a>');
collectionButton.attr('class', 'btn');
collectionButton.text('random page');
$('#content').prepend(collectionButton);

collectionButton.click(function() {
    var navList = $('.navlinknum');
    if(navList.length > 0) {
        var lastNum = navList[navList.length - 1];
        var randomPage = Math.floor(1 + Math.random() * lastNum.text);

        var firstNav = $('.navlinknum:first')
        var navLink = firstNav[0].href
        var ogURL = navLink.slice(0, -1)

        document.location = ogURL + randomPage;
    }
});
