// ==UserScript==
// @name         Jira board search
// @namespace    http://rubenmartinez.net/
// @version      0.1
// @description  try to take over the world!
// @author       Ruben Martinez
// @match        https://buongiorno.atlassian.net/secure/RapidBoard*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38944/Jira%20board%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/38944/Jira%20board%20search.meta.js
// ==/UserScript==

(function() {
    'use strict';

$("#ghx-modes-tools").prepend('<input id="jiraFilter" class="search" type="text" title="Jira Filter" placeholder="Jira Filter" autocomplete="off" >');

$('#jiraFilter').keyup(function (e) {
    if (e.keyCode === 13) { // enter starts search
      let searchString = $('#jiraFilter').val();
      jiraFilter(searchString);
    }
  });

$(document).keyup(function (e) {
    if (e.ctrlKey && e.keyCode === 83) { // ctrl+s
       $("#jiraFilter").focus();
       $("#jiraFilter").select();
    }
  });

function jiraFilter(searchString) {
  $("body").css("cursor", "wait");

  let searchStringRegex = new RegExp(searchString, "i");
  $(".ghx-summary").each( function (i, element) {
    let parent = $(this).parent();
    jiraFilterMatch(element, searchStringRegex) ? parent.show() : parent.hide();
  });

  $(".ghx-summary").promise().done( function() { $("body").css("cursor", "default"); } ); // TODO: promise doesn't seem to be working but whatever
}

function jiraFilterMatch(element, searchStringRegex) {
  return element.title.match(searchStringRegex) || (element["original-title"] && el["original-title"].match(searchStringRegex) );
}


})();