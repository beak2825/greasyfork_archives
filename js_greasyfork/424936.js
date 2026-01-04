// ==UserScript==
// @name           YouTube link redirect remover
// @name:de        YouTube Link redirect Entferner
// @description    replaces the url from youtube.com/redirect links to the actual target
// @description:de Ersetzt die URL von youtube.com/redirect links zur wirklichen Zieladresse
// @version        0.2
// @match          https://www.youtube.com/*
// @grant          none
// @namespace      https://greasyfork.org/users/94906
// @license        WTFPL
// @downloadURL https://update.greasyfork.org/scripts/424936/YouTube%20link%20redirect%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/424936/YouTube%20link%20redirect%20remover.meta.js
// ==/UserScript==

(function() {
  'use strict';
  console.log("YT LINK REDIRECT REMOVER LOADED");
  //console.log("Language:" + document.getElementsByTagName("html")[0].getAttribute("lang"));
  function editAnchorTag() {
    for (var i = 0; i < document.links.length; i++) {
      if (document.links[i].href.indexOf('youtube.com/redirect') < 0)
        continue;
      var urlParams = new URLSearchParams(document.links[i].href);

      if(urlParams.get('q') != null){
        document.links[i].href = urlParams.get('q');
      }
      console.log(document.links[i].href);
    }
  }
  editAnchorTag();
  //document.addEventListener('click', editAnchorTag);
  //document.addEventListener('yt-page-data-updated', editAnchorTag);
  document.addEventListener('yt-navigate-finish', editAnchorTag);
  setInterval(editAnchorTag, 500);
})();