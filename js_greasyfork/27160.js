// ==UserScript==
// @name        flamed_gamedox_special
// @namespace   https://orbitalzero.ovh/scripts
// @description Allows to mass check a list of group names for gamedox content
// @include     https://gazellegames.net/torrents.php
// @version     0.01
// @grant       none
// @require     https://code.jquery.com/jquery-3.1.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/27160/flamed_gamedox_special.user.js
// @updateURL https://update.greasyfork.org/scripts/27160/flamed_gamedox_special.meta.js
// ==/UserScript==

function add_boxes() {
  $("#autocomplete").after("<textarea id='gamedox_check_input' placeholder='List of groups to search for. Only one per line.'></textarea>");
  $("#gamedox_check_input").after("<input type='button' id='gamedox_search' value='Search for GameDOX'>");
  $("#gamedox_check_input").after("<textarea id='gamedox_check_output' placeholder='List of groups with at least one GameDOX item.'></textarea>");
  $("#gamedox_search").click(function () {
    $(this).val("Searching...");
    search($("#gamedox_check_input").val().split("\n")).then(function (results) {
      $("#gamedox_check_output").val(results.join("\n"));
      $("#gamedox_search").val("Search for GameDOX");
    });
  });
}

function search(names) {
  return Promise.all(names.map(function (name) {
    console.log(name);
    return new Promise (function (resolve, reject) {
      var req = new XMLHttpRequest();
      req.open("GET", "/torrents.php?action=advanced&groupname=" + name + "&miscellaneous=GameDOX&gamedox=Guide&order_by=time", true);
      req.responseType = "document";
      req.onload = function () {
        if (req.response.querySelectorAll(".group").length !== 0) {
          resolve(name);
        } else {
          resolve(null);
        } 
      };
      req.send();
    });
  }));
}


(function () {
  'use strict';
  add_boxes();
})();