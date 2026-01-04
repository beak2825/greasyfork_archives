// ==UserScript==
// @name        Twitter Image Link
// @description Add a direct link for each image in a tweet after "Reply/RT/Like/DM" icons
// @icon        https://abs.twimg.com/favicons/favicon.ico
// @include     twitter.com
// @match       *://*.twitter.com/*
// @exclude     *://twitter.com/i/cards/*
// @version     1.0.1
// @grant       none
// @namespace   https://greasyfork.org/users/113252-garrison-baird
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/374923/Twitter%20Image%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/374923/Twitter%20Image%20Link.meta.js
// ==/UserScript==

function linker () {
  var divs = document.querySelectorAll('.AdaptiveMedia');
  divs.forEach(function(div) {
    var container = div.parentElement;
    var content = container.parentElement;
    if (content.querySelector('.ProfileTweet-action--extractImages')) return;

    var div_a = document.createElement('div');
    div_a.className = "ProfileTweet-action ProfileTweet-action--extractImages";
    content.querySelector('div.ProfileTweet-actionList').appendChild(div_a);

    var sources = div.querySelectorAll('img');
    sources.forEach(function(source){
      var source = source.getAttribute('src')//.replace(/\.jpg$/i, '.jpg:orig');

      var button = document.createElement('a');
      button.className = 'ProfileTweet-actionButton u-textUserColorHover';
      div_a.appendChild(button);
      var div_span = document.createElement('div');
      div_span.className = 'IconContainer js-tooltip';
      button.appendChild(div_span);
      var span = document.createElement('span');
      span.className = 'Icon Icon--medium Icon--photo';
      div_span.appendChild(span);

      button.setAttribute('href', source);
      button.setAttribute('target', '_blank');
    })
  })

}

linker();
if (window.location.host == 'tweetdeck.twitter.com') {
  setInterval(linker, 1000);
} else {
  window.addEventListener('scroll', linker);
  setInterval(linker, 5000);
}
