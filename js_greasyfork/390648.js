// ==UserScript==
// @name          Links to tweets for SkyScraperCity
// @name:pl       Linki do tweetów w SkyScraperCity
// @description   Adds clickable links to quoted tweets.  Useful if you block 3rd party content.
// @description:pl Dodaje klikalne linki do tweetów.  Przydatne kiedy blokujesz zawartość witryn trzecich.
// @version       1
// @author        me
// @namespace     https://github.com/skalee/ssc-grease
// @license       CC0
// @homepageURL   https://github.com/skalee/ssc-grease
// @supportURL    https://www.skyscrapercity.com/showthread.php?t=2017475
// @grant    none
// @include       https://www.skyscrapercity.com/showthread.php?*
// @include       https://www.skyscrapercity.com/showpost.php?*
// @downloadURL https://update.greasyfork.org/scripts/390648/Links%20to%20tweets%20for%20SkyScraperCity.user.js
// @updateURL https://update.greasyfork.org/scripts/390648/Links%20to%20tweets%20for%20SkyScraperCity.meta.js
// ==/UserScript==

document.querySelectorAll("blockquote.twitter-tweet").forEach(function(tweet) {
  var tweetLink = tweet.querySelector("a[href]")
  var clonedLink = tweetLink.cloneNode()
  clonedLink.target = "_blank"
  clonedLink.innerText = "tweet"
  var wrapperElement = document.createElement("p")
  wrapperElement.append("(")
  wrapperElement.append(clonedLink)
  wrapperElement.append(")")
  tweet.parentElement.insertBefore(wrapperElement, tweet.nextSibling)
})
