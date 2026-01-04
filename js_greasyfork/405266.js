// ==UserScript==
// @name        Rock Paper Shotgun (RPS) - Fix YouTube Videos
// @match       https://www.rockpapershotgun.com/*
// @grant       none
// @version     1.0
// @author      SminkyBazzA
// @description A bodge to get rid of those grey squares, turns out you don't _need_ to enable tracking cookies. Who knew?!
// @license MIT
// @copyright 2020, SminkyBazzA
// @namespace https://greasyfork.org/users/589124
// @downloadURL https://update.greasyfork.org/scripts/405266/Rock%20Paper%20Shotgun%20%28RPS%29%20-%20Fix%20YouTube%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/405266/Rock%20Paper%20Shotgun%20%28RPS%29%20-%20Fix%20YouTube%20Videos.meta.js
// ==/UserScript==

function replace_iframe(element, url) {
  // use cookie-less domain, ignore any querystring params (TODO: allow timestamp?)
  var new_url = '//www.youtube-nocookie.com'+url.pathname

  
  var new_iframe = document.createElement('iframe')
  
  // these seem to work, might need more for mobile support?
  new_iframe.setAttribute('src', new_url)
  new_iframe.setAttribute('allowfullscreen', '')
  new_iframe.setAttribute('width', '100%')
  new_iframe.setAttribute('height', '100%')
  
  // clear the junk out of the wrapper and put the clean iframe in
  var parent = element.parentNode
  parent.innerHTML = ''
  parent.appendChild(new_iframe)
}

// wait a moment after the page is ready before swapping any iframes loading from YouTube
(function () {
  setTimeout(function () {
    document.querySelectorAll('.embed-wrapper iframe').forEach((element) => {
      var url = new URL(element.dataset.src)
      if (url.hostname == 'www.youtube.com') { replace_iframe(element, url) }
      
    })
  }, 1000);
})();