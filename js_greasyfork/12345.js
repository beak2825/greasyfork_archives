// ==UserScript==
// @name        Hacker News
// @namespace   com.ycombinator.news
// @include     https://news.ycombinator.com/*
// @version     2.0
// @grant       none
// @description Add a link in the top banner of [Hacker News discussion](http://news.ycombinator.com/) to its counter part at [HN Premii](http://hn.premii.com/)
// @downloadURL https://update.greasyfork.org/scripts/12345/Hacker%20News.user.js
// @updateURL https://update.greasyfork.org/scripts/12345/Hacker%20News.meta.js
// ==/UserScript==

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function readerUrl(id)
{
  var url = 'http://hn.premii.com/';
  if (id !== null && id.length > 0)
  {
    url += '#/comments/' + id;
  }
  return url;
}


var id = getParameterByName("id", window.location.href);
var readerLink = ' | <a href="' + readerUrl(id) + '">Reader</a>';
var topMenu = document.getElementsByClassName('pagetop') [0];
topMenu.innerHTML += readerLink;


