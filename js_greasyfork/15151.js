// ==UserScript==
// @name        Collapsable Diffs and Linked Branches (GitHub)
// @namespace   https://github.com/chriskim06/userscripts
// @description Adds a toggle to collapse diffs in GitHub's pull request and commit diff interfaces
// @match       https://github.com/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @require     https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=19641
// @version     1.5.6
// @downloadURL https://update.greasyfork.org/scripts/15151/Collapsable%20Diffs%20and%20Linked%20Branches%20%28GitHub%29.user.js
// @updateURL https://update.greasyfork.org/scripts/15151/Collapsable%20Diffs%20and%20Linked%20Branches%20%28GitHub%29.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

$(function() {

  waitForKeyElements('#files div[id^="diff-"] .file-header > .file-actions > button', addDiffCollapseButtons);
  waitForKeyElements('.pr-review-tools > .diffbar-item:nth-child(1)', addCollapseAllButton);
  waitForKeyElements('#partial-discussion-header .commit-ref', makeLinks);

  function addDiffCollapseButtons(jNode) {
    // Add the event handler if its not already bound to the arrow
    if (jNode.length) {
      var events = $.data(jNode.get(0), 'events');
      if (!events || !events.click) {
        jNode.on('click', function() {
          // Set the collapse all button text
          var collapseAllButton = $('#diff-collapse-button');
          if (collapseAllButton.length) {
            var state = ($('#diff-collapse-button').attr('data-toggle-state') === 'expanded');
            collapseAllButton.attr('data-toggle-state', state ? 'collapsed' : 'expanded');
            collapseAllButton.text(state ? 'Show All' : 'Fold All');
          }
        });
      }
    }
  }

  function addCollapseAllButton(jNode) {
    // Add a Show/Fold All button if its not there
    if (!$('#diff-collapse-button').length) {
      var blobs = $('#files').find('div[id^="diff-"]').children('.data.highlight.blob-wrapper, .data.highlight.empty, .render-wrapper, .js-file-content');
      jNode.after(
        '<div class="diffbar-item">' +
          '<button id="diff-collapse-button"' +
            'class="btn btn-sm btn-outline BtnGroup-item" style="width: 75px"' +
            'data-toggle-state="' + (blobs.is(':visible') ? 'expanded' : 'collapsed') + '">' +
            (blobs.is(':visible') ? 'Fold All' : 'Show All') +
          '</button>' +
        '</div>'
      );
      $('#diff-collapse-button').on('click', function() {
        // Toggle the visibility of all diffs
        var state = ($(this).attr('data-toggle-state') === 'expanded');
        $('#files div[id^="diff-"] > .file-header > .file-actions > button[aria-expanded="' + state + '"]').click();
        $(this).attr('data-toggle-state', state ? 'collapsed' : 'expanded');
        $(this).text((state) ? 'Show All' : 'Fold All');
      });
    }
  }

  function makeLinks(jNode) {
    if (!jNode.children(':first-child').is('a')) {
      // Turn the branches being compared into links if they aren't already
      var url = window.location.href.match(/(https:\/\/github\.com\/)[A-Za-z0-9_-]+(\/[A-Za-z0-9_-]+)/);
      if (url) {
        var branch = jNode.contents().text();
        if (!branch.includes(':')) {
          jNode.contents().wrapAll('<a href="' + url[0] + '/tree/' + branch + '"></a>');
        } else {
          jNode.contents().wrapAll('<a href="' + url[1] + branch.replace(':', url[2] + '/tree/') + '"></a>');
        }
      }
    }
  }

});
