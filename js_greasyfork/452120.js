// ==UserScript==
// @name        Steam Price History Button
// @description Adds a button to steam price history near the add to cart button
// @include     https://store.steampowered.com/app/*
// @namespace   https://greasyfork.org/users/8233
// @license MIT
// @version 0.0.2
// @downloadURL https://update.greasyfork.org/scripts/452120/Steam%20Price%20History%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/452120/Steam%20Price%20History%20Button.meta.js
// ==/UserScript==

var parts = window.location.href.split('/');
if (parts.indexOf('store.steampowered.com') === 2 && parts[3] == 'app') {

  //word history in different languages
  const wordhistory = {
    'en': 'History',
    'pl': 'Historia',
    'es': 'Historia',
    'ro': 'Istorie',
    'it': 'Storia',
  };

  var backs = document.getElementsByClassName('game_purchase_action_bg');
  for (var i = 0; i < backs.length; ++i) {
    //create the link, give it proper href, one of nice steam styles via a class
    var a = document.createElement('a');
    a.href = 'https://steampricehistory.com/app/' + parts[4];
    a.className = 'btnv6_blue_hoverfade btn_medium';

    //and give the link button proper word, with fallback to english
    const word = wordhistory[document.documentElement.lang] || wordhistory['en'];
    a.innerHTML = '<span>' + word + '</span>';

    //and add it to each game buy element we can find (in case there are more cus deluxe edition, bundle, etc.)
    var con = backs[i];
    con.insertBefore(a, con.firstChild);

  }
}