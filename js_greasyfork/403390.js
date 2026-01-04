// ==UserScript==
// @name         Gitlab Show Only UnResolved Threads
// @version      0.2.0
// @description  This script hide commits and resolved threads, no longer scrolling into infinite when reviewing.
// @author       Mujtaba Aldebes
// @license      MIT
// @namespace    https://github.com/SerkZex/
// @icon         https://about.gitlab.com/ico/favicon-192x192.png
// @include      /^https?:\/\/[^/]*gitlab.[^/]+\//
// @require      https://code.jquery.com/jquery-3.5.0.js
// @downloadURL https://update.greasyfork.org/scripts/403390/Gitlab%20Show%20Only%20UnResolved%20Threads.user.js
// @updateURL https://update.greasyfork.org/scripts/403390/Gitlab%20Show%20Only%20UnResolved%20Threads.meta.js
// ==/UserScript==
/* globals $ */


const State = Object.freeze({
  HIDDEN: 'HIDE_RESOLVED',
  VISIBLE: 'SHOW_RESOLVED',
});

const ButtonText = Object.freeze({
  [State.HIDDEN]: 'Show all threads',
  [State.VISIBLE]: 'Show only unresolved threads',
});

let current_state = State.VISIBLE;


// This function add a button to the gitlab interface and bind it to an action.
function show_gitlab_button() {
  var zNode = document.createElement ('div');
  zNode.innerHTML = '<button id="show_unresolved_discussions_btn" type="button" class="btn btn-default ml-sm-2">' +ButtonText[current_state]+ '</button>';
  zNode.setAttribute ('id', 'threads_visibility_container');
  zNode.setAttribute ('class', 'line-resolve-all-container full-width-mobile');
  $('.d-flex.flex-wrap.align-items-center.justify-content-lg-end').append(zNode);

  $("#show_unresolved_discussions_btn").bind( "click", function() {
    switch (current_state) {
      case State.VISIBLE:
        current_state = State.HIDDEN;
        // Hides threads in "overview" -tab
        $("#notes-list li:contains(Resolved)").hide()
        $('.timeline-entry.note.system-note.note-wrapper').hide();

        // hides threads in "changes"-tab
        $("#diffs > div.files.d-flex > div.diff-files-holder > div:not(:has(button[data-qa-selector='resolve_discussion_button']))").hide()
        var unresolved_threads = $("#diffs > div.files.d-flex > div.diff-files-holder > div:has(button[data-qa-selector='resolve_discussion_button'])").length
        if(unresolved_threads == 0){
          $("#NoUnResolvedThreadsCss").show()
        } else {
          $("#NoUnResolvedThreadsCss").hide()
        }
        break;
      case State.HIDDEN:
        current_state = State.VISIBLE;
        $("#notes-list li").each(function(){$(this).show()}) // Shows threads in "overview""-tap
        $("#diffs > div.files.d-flex > div.diff-files-holder > div").show() // Shows threads in "changes"-tap
        $("#NoUnResolvedThreadsCss").hide()
        break;
    }
    $('#show_unresolved_discussions_btn').html(ButtonText[current_state]);
  });
};


/* Code Start Here! */
setTimeout(function() {
  const commit_versio = $("span.mr-version-dropdown > a > span").text();
  $("#diffs > div.files.d-flex").prepend(`<div id="NoUnResolvedThreadsCss" style="width: 100%; display: none;"><p style="text-align:center; font-size:200%">There is no unresolved threads in this commit (${commit_versio})</p></div>`)
  show_gitlab_button();
}, 3200)