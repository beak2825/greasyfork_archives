// ==UserScript==
// @name         archive.org - MS-DOS Games Collection repositories
// @namespace    https://archive.org/details/softwarelibrary_msdos_games?tab=collection
// @description  Detects and redirects to the source repositories of streamable-only MS-DOS games from archive.org collection
// @icon         http://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Internet_Archive_logo_and_wordmark.png/240px-Internet_Archive_logo_and_wordmark.png
// @author       ner0
// @copyright    2019, ner0 (https://openuserjs.org/users/ner0)
// @license      MIT
// @version      0.2
// @supportURL   https://openuserjs.org/scripts/ner0/archive.org_-_MS-DOS_Games_Collection_repositories/issues
// @grant        none
// @require      https://code.jquery.com/jquery-1.10.2.min.js
//
// @include      *://archive.org/details/msdos*
// @downloadURL https://update.greasyfork.org/scripts/426835/archiveorg%20-%20MS-DOS%20Games%20Collection%20repositories.user.js
// @updateURL https://update.greasyfork.org/scripts/426835/archiveorg%20-%20MS-DOS%20Games%20Collection%20repositories.meta.js
// ==/UserScript==

if (window.location.href.indexOf(document.domain + "/details/msdos") > -1) {
  var scripts = document.querySelectorAll("script");
  for (var i = 0; i < scripts.length; i++) {
    var emuLoader = "" + scripts[i].text;
    if (emuLoader.indexOf("AJS.emulate_setup") != -1) {
      emuLoader = emuLoader.substring(emuLoader.indexOf("\/"));
      emuLoader = emuLoader.replace("\\", "");
      emuLoader = emuLoader.substring(0, emuLoader.indexOf("?"));

      var response = "";
      $.ajax({
        type: "GET",
        url: "https://" + document.domain + emuLoader,
        async: false,
        success: function (text) {
          response = text;
          response = response.substring(response.indexOf("https"));
          response = response.substring(0, response.indexOf(")"));
          /*
          console.log("Download repository: " + response);
          window.open(response, "_blank");
          */
          if (confirm("Browse this game's repository?")) {
            window.location.href = response;
          }
        }
      });
    }
  }
}
