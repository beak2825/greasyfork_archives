// ==UserScript==
// @name        Ignore InsideNU commenters
// @description Ignore specific users' comments to avoid obnoxious flame wars
// @namespace   com.steve
// @include     http://www.insidenu.com/*
// @version     1
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/12094/Ignore%20InsideNU%20commenters.user.js
// @updateURL https://update.greasyfork.org/scripts/12094/Ignore%20InsideNU%20commenters.meta.js
// ==/UserScript==
(function ($) {
  "use strict";
  
  // Gets a key corresponding to this author's ignore status in the greasemonkey store for this script
  function key(author) {
    return 'ignore_' + author;
  }
  
  // Sets a user's ignore status and makes their comments invisible
  function ignore (author) {
    GM_setValue(key(author), 'true');
    find_comments_by(author).each(function () { 
      handle_ignored_comment($(this), author);
    });
  }
  
  // Unsets a user's ignore status and makes their comments visible
  function unignore (author) {
    GM_deleteValue(key(author));
    find_comments_by(author).each(function () {
      handle_unignored_comment($(this), author);
    });
  }
  
  // Gets a value indicating whether the given author is ignored
  function is_ignored(author) {
    return GM_getValue(key(author), false);
  }
  
  // Returns a jquery list of DOM nodes for comments by a particular author
  function find_comments_by(author) {
    return $('.comment').filter(function () {
      return $(this).find('.poster').text() == author;
    });
  }
  
  // Given a comment and its author,
  // - ensure the comment is not visible
  // - remove any buttons related to 'ignoring' the user
  // - Add a message indicating that hte user has been ignored
  // - Add a button to unignore
  function handle_ignored_comment ($comment, author) {
    $comment.find('.title, .cbody, .sig').hide();
    $comment.find('.ignore-user').remove();
    $comment.prepend('<p class="unignore-user">You have ignored ' + author + '</p>');
    $comment.find('.user_actions').append('<a href="javascript: void(0)" class="unignore-user">Un-Ignore ' + author + '</a>');
    $comment.find('.unignore-user').click(function () { unignore(author); });
  }
  
  // Given a comment and its author, 
  // - ensure the comment is visible
  // - remove any buttons related to 'unignoring' the user
  // - add the ignore button
  function handle_unignored_comment ($comment, author) {
    $comment.find('.title, .cbody, .sig').show();
    $comment.find('.unignore-user').remove();
    $comment.find('.user_actions').append('<a href="javascript: void(0)" class="ignore-user">Ignore ' + author + '</a>');
    $comment.find('.ignore-user').click(function () { ignore(author); });
  }
  
  // Given a comment,
  // - check if it's been scanned before, if so return early if not mark scanned
  // - get the author of the comment
  // - if the author is ignored hide it and add the button to unhide
  // - if not, add the button to ignore
  function handle_comment($comment) {
    if ($comment.data('scanned')) { return; }
    $comment.data('scanned', true);
    
    var author = $comment.find('.poster').text();
    
    if (is_ignored(author)) {
      handle_ignored_comment($comment, author);
    }
    else {
      handle_unignored_comment($comment, author);
    }
  }
  
  // Scan comments as they come in
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      var nodes = Array.prototype.slice.call(mutation.addedNodes);
      nodes.filter(function (node) { return node.nodeType == Node.ELEMENT_NODE && $(node).is('.citem'); })
           .forEach(function (node) {
        handle_comment($(node).find('.comment'));
      })
    });
  });
  
  var config = { childList: true, subtree: true };
  observer.observe(document.getElementById('comments'), config);
  
  // First run: scan all comments (race conditions handled by 'scanned' data member)
  $('#comments .comment').each(function () { handle_comment($(this)); });
})(jQuery.noConflict());