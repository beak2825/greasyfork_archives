// ==UserScript==
// @name        KissAnime - Step 01
// @namespace   jpsouzasilva@@
// @include     http://kissanime.to/Anime/*
// @version     1
// @grant       none
// @description:en Kiss Anime - Step 01
// @description Kiss Anime - Step 01
// @downloadURL https://update.greasyfork.org/scripts/23472/KissAnime%20-%20Step%2001.user.js
// @updateURL https://update.greasyfork.org/scripts/23472/KissAnime%20-%20Step%2001.meta.js
// ==/UserScript==

window.onload = function () {
  document.getElementsByTagName('table')[0].outerHTML += "<input id='retriever' type='button' value='Click me fam'/>";
  document.getElementById('retriever').addEventListener('click', retrieveAllLinks, false);
  }
  
function retrieveAllLinks() {
  console.log("triggered!@");
  localStorage.clear();
  var allMyAddresses = []
  currentWindow = null;
  $('.listing tr td a').each(function () {
    allMyAddresses.push($(this)[0].href);
  }).promise().done(function() {
    console.log("all done");
    var interval = setInterval(function() {
      if (currentWindow == null || currentWindow.closed) {
        currentWindow = window.open(allMyAddresses.pop(), "_blank");
      }
      if (allMyAddresses.length == 0) {
        clearInterval(interval);
        var arraySorted = Object.keys(localStorage).sort();
        var finalAnimes = "";
        for (var i = 0; i < arraySorted.length; i++) {
          finalAnimes += arraySorted[i] + ":" + localStorage.getItem(arraySorted[i]) + "\n";
        }
        console.log(finalAnimes);
      }
    }, 1000);
  });
}