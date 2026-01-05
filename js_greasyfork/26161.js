// ==UserScript==
// @name        4chan (You)
// @namespace   https://greasyfork.org/en/users/90893-leoutlookingman
// @description Adds back the (You) to your 4chan post replies
// @include     https://boards.4chan.org/*
// @include     http://boards.4chan.org/*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/26161/4chan%20%28You%29.user.js
// @updateURL https://update.greasyfork.org/scripts/26161/4chan%20%28You%29.meta.js
// ==/UserScript==

function addYou(){
  var yous = document.querySelectorAll('.quotelink.ql-tracked:not(.you)')
  yous.forEach(function(you){
    var _you_ = document.createTextNode(" (You)")
    you.appendChild(_you_);
    // add custom CSS class for (You)'d posts so we don't add (You) twice
    you.className = you.className + ' you'
  });
}

// wait for extension to finish loading (first run)
document.addEventListener('4chanParsingDone', addYou);
// do again after live thread update
document.addEventListener('4chanThreadUpdated', addYou);