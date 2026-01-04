// ==UserScript==
// @name          Compact View on Ed Discussions
// @namespace     waqas
// @description   Reduces amount of space used by each post tile in the list view, by compacting each post to a single line on Ed discussion forum. Also reduces some whitespace in messages panel.
// @match         *://edstem.org/*
// @grant         GM_addStyle
// @version       0.1
// @author        Waqas Ilyas
// @homepageURL   https://github.com/waqasilyas/userscripts/tree/main/edstem
// @require       http://code.jquery.com/jquery-latest.js
// @run-at        document-start
// @licence       MIT
// jshint esversion: 6
// @downloadURL https://update.greasyfork.org/scripts/431025/Compact%20View%20on%20Ed%20Discussions.user.js
// @updateURL https://update.greasyfork.org/scripts/431025/Compact%20View%20on%20Ed%20Discussions.meta.js
// ==/UserScript==
(function() {
  'use strict';
  
  GM_addStyle(`
.split-divider-wi {
  padding-left: 0.5px;
}

.discuss-feed-thread-wi {
  padding: 2px !important;
}

.dft-body-wi {
  margin: 2px !important;
  padding: 0 5px 0 20px !important;
}

.dft-body-unseen-wi {
  font-weight: bold !important;
  padding: 0 5px 0 5px !important;
}

.dft-category-wi {
  margin: 0 2px 0 2px;
}

.dft-author-wi {
  font-size: 70% !important;
  width: 2em;
  text-align: center;
  background-color: #eee;
  padding: 0 2px 0 2px;
  margin: 0 2px 0 2px;
}

.theme-dark .dft-author-wi {
  background-color: #3f3e41 !important;
}

.discuss-show-full-wi {
  max-width: 90% !important;
}

.dft-thread-count-new-wi {
  font-size: 70% !important;
}
  `);
  
  var initialWidthSet = false;
  
  $(window).load(function() {
    var MutationObserver = window.MutationObserver;
    var myObserver       = new MutationObserver (applyUpdates);
    var obsConfig        = {
        childList: true, attributes: true,
        subtree: true,   attributeFilter: ['class']
    };

    myObserver.observe (document, obsConfig);
  });

  function applyUpdates() {
    var selector = $('.split-divider');
    if (selector.length == 0)
      // HTML of our interest not available yet
      return;
    
    selector.addClass('split-divider-wi');

    // Allow wider threads panel
    if (!initialWidthSet) {
      initialWidthSet = true;
      var threadsPanel = $('section.dif-tf-container').get(0);
      threadsPanel.parentElement.style = "flex: 0 0 650px";
    }

    // Compact post tiles in the list
    selector = $('a.discuss-feed-thread');
    if (selector.length > 0)
      selector.addClass('discuss-feed-thread-wi');

    // Hide all the footers, we will accomadate useful information into dft-body
    selector = $('a.discuss-feed-thread footer');
    if (selector.length > 0)
      selector.hide();

    // Selector for post tiles, compact even more
    var dftBodySelector = $('a.discuss-feed-thread .dft-body');
    if (dftBodySelector.length > 0)
      dftBodySelector.addClass('dft-body-wi');

    // Make changes to each tile
    dftBodySelector.each(function(i, o) {
      var dftBody = $(o);

      // Adjust padding so that unread and read posts are aligned
      var unseenIcons = dftBody.find('.dft-thread-unseen-icon');
      if (unseenIcons.length > 0)
        dftBody.addClass('dft-body-unseen-wi');
      else
        dftBody.removeClass('dft-body-unseen-wi');

      // Check if the post is from an instructor
      var footer = dftBody.parent().find('footer');
      
      // Number of new unread messages
      var newRepliesSpan = footer.find('.dft-thread-count > span.dft-thread-count-new');
      if (newRepliesSpan.length > 0) {
        console.log(newRepliesSpan.children().length);
        if (dftBody.find('.dft-thread-count-new').length == 0)
          dftBody.find('.dft-thread-title').after(`
            <span title="New Replies" class="dft-thread-count-new dft-thread-count-new-wi">
              ${newRepliesSpan.html()}
            </span>
          `);
      }

      // Author name
      var authorSpan = footer.find('.dft-foot-fill > span.dft-thread-user');

      // Handle author's role
      var roleDiv = footer.find('.dft-foot-fill > div.user-role-label');
      if (dftBody.find('span.dft-author-wi').length == 0) {
        var role = 'S';
        var roleClass = 'url-student';
        if (roleDiv.hasClass('url-admin')) {
          role = 'I';
          roleClass = 'url-admin';
        }

        // Add an author tag, with initials
        dftBody.append(`
          <span title='${authorSpan.html()}' class='dft-author-wi ${roleClass}'>
            ${authorSpan.html().split(' ').map((n) => n[0]).slice(0, 3).join('')}
          </span>
        `);
      }

      // Handle category, add a tag for it
      var catDiv = footer.find('.dft-foot-fill > .dft-thread-category-group');
      var catColor = catDiv.get(0).style.color;
      var catSpan = footer.find('.dft-foot-fill > .dft-thread-category-group > span');
      var category = catSpan.html();
      if (dftBody.find('span.dft-category-wi').length == 0)
        dftBody.append(`
          <span title='${category}'
                class='discuss-category-tag dsb-category-tag dft-category-wi'
                style='background-color: ${catColor}'></span>
        `);
      
      // Post body, reduce whitespace
      $('.discuss-show-full').addClass('discuss-show-full-wi');
    });
  }
})();