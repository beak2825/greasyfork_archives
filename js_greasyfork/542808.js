// ==UserScript==
// @name        Filmweb Community Rating Redirector
// @namespace   https://greasyfork.org/pl/users/636724-cml99
// @match       http*://*filmweb.pl/film/*
// @match       http*://*filmweb.pl/serial/*
// @match       http*://*filmweb.pl/tvshow/*
// @match       http*://*filmweb.pl/videogame/*
// @version     1.2.0
// @author      CML99
// @license     CC-BY-NC-SA-4.0
// @description Otwiera opinie/oceny znajomych w nowym osobnym okienku zamiast nadpisywać stronę filmu.
// @description:en  Opens user opinions and friend ratings in a new separate window instead of replacing the current movie page.
// @icon        https://www.google.com/s2/favicons?sz=64&domain=filmweb.pl
// @grant       GM_xmlhttpRequest
// @grant       GM.xmlHttpRequest
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/542808/Filmweb%20Community%20Rating%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/542808/Filmweb%20Community%20Rating%20Redirector.meta.js
// ==/UserScript==


function openInPopup(url) {
  const features = 'width=800,height=600,resizable=yes,scrollbars=yes';
  window.open(url, '_blank', features);
}


var intvRedirectCommunity = setInterval(function() {
  var communityVotes = document.querySelectorAll('a[href$="/opinie#/community/popular"]');
  if (communityVotes.length < 1) {
    return false;
  }

  clearInterval(intvRedirectCommunity);

  document.querySelectorAll('a[href$="/opinie#/community/popular"]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      openInPopup(this.href);
    });
  });
}, 5000);


var intvRedirectFriend = setInterval(function() {
  var friendVotes = document.querySelectorAll('a[href$="/opinie#/friends/votes"]');
  if (friendVotes.length < 1) {
    return false;
  }

  clearInterval(intvRedirectFriend);

  document.querySelectorAll('a[href$="/opinie#/friends/votes"]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      openInPopup(this.href);
    });
  });
}, 5000);


var intvRedirectCritic = setInterval(function() {
  var criticVotes = document.querySelectorAll('a[href$="/opinie#/critics"]');
  if (criticVotes.length < 1) {
    return false;
  }

  clearInterval(intvRedirectCritic);

  document.querySelectorAll('a[href$="/opinie#/critics"]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      openInPopup(this.href);
    });
  });
}, 5000);


var intvRedirectOpinion = setInterval(function() {
  var opinions = document.querySelectorAll('.opinionsSection .opinionBoxNew__commentLink');
  if (opinions.length < 1) {
    return false;
  }

  clearInterval(intvRedirectOpinion);

  document.querySelectorAll('.opinionsSection .opinionBoxNew__commentLink').forEach(function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      openInPopup(this.href);
    });
  });
}, 2500);


GM_addStyle ( `
  .opinionBox__comment { pointer-events: none !important; }   /* disable critic link */
` );
