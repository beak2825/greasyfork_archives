// ==UserScript==
// @name         RARBG Add YouTube Trailer Link 
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Adds youtube trailer link to RARBG (if is missing)
// @author       https://github.com/michalani
// @match        https://rarbgmirror.com/torrent/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430472/RARBG%20Add%20YouTube%20Trailer%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/430472/RARBG%20Add%20YouTube%20Trailer%20Link.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var arrayOfHeaders = document.querySelectorAll(".header2")
  var notFoundTrailer = true
  function isTrailer(value) {
      if(value.innerHTML === '<a name="trailer"></a>Trailer:')
      {
          notFoundTrailer = false
      }

  }
  arrayOfHeaders.forEach(isTrailer);

  if(notFoundTrailer){
      //find torrent title
      var torrentTitle = document.getElementsByClassName("lista")[6].innerText.replace(/\./g,' ').substring(1);

      //remove last 2 words and a trailing space
      torrentTitle = torrentTitle.substring(0, torrentTitle.lastIndexOf(" "));
      torrentTitle = torrentTitle.substring(0, torrentTitle.lastIndexOf(" "));
      torrentTitle = torrentTitle.substring(0, torrentTitle.lastIndexOf(" "));

      let ytlink = "https://www.youtube.com/results?search_query=" + torrentTitle + " trailer"


      //create a section similar to div
      var youtubeSection = document.createElement("tr");
      youtubeSection.innerHTML = '<td class="header2" valign="top" align="right">Trailer</td><td class="lista"><img src="https://www.youtube.com/img/favicon.ico" height="15" width="15" border="0">&nbsp;<a href="'+ytlink+'" target="_blank" rel="nofollow noopener">'+torrentTitle+'</a></td>';
      
      //find Torrent file
      let torrentSection = document.getElementsByTagName("tr")[23];

      //insert after a HTML section new section
      function insertAfter(referenceNode, newNode) {
          referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
      }
      //insert Youtube Trailer link after that section
      insertAfter(torrentSection, youtubeSection);
}

})();