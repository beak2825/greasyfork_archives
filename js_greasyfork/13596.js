// ==UserScript==
// @name        Tweetdeck starry, not hearty
// @namespace   rudicron
// @description Sets Tweetdeck back to using stars for favorites.
// @include     https://tweetdeck.twitter.com/*
// @version     1.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13596/Tweetdeck%20starry%2C%20not%20hearty.user.js
// @updateURL https://update.greasyfork.org/scripts/13596/Tweetdeck%20starry%2C%20not%20hearty.meta.js
// ==/UserScript==


var observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (mutation.type === 'attributes' && mutation.attributeName === 'class' && mutation.target.getAttribute('class') === 'hearty') {
      mutation.target.setAttribute('class', 'starry'); // change the class name instead of dropping the class; just in case.
      this.disconnect(); // we're done looking for attribute changes once we've found the change to hearty.
    }
  });
});

var obsconf = { attributes: true };

var bod = document.body;
if (bod.getAttribute('class') === 'hearty' ) {
  bod.setAttribute('class', 'starry'); // do this in case the page loads before Greasemonkey does.
}

observer.observe(bod, obsconf);

