// ==UserScript==
// @name Diaspora reply button
// @description A script to add 'reply' links to comments on default Diaspora* (desktop) website interfaces, which will insert the current comment's author's handle in the new comment textarea.
// @author Filip H.F. "FiXato" Slagter 
// @version  5
// @include  /^https:\/\/(www\.)?(plu|joindia)spora\.com/
// @run-at      document-idle
// @grant    none
// @namespace https://github.com/FiXato
// @downloadURL https://update.greasyfork.org/scripts/377687/Diaspora%20reply%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/377687/Diaspora%20reply%20button.meta.js
// ==/UserScript==
// esversion: 6
// Latest version at: https://gist.github.com/FiXato/fed7eca2e044705a3c14253bf2184335

window.debugUserScript=false;
function consoleDebug() {
  if (window.debugUserScript) {
  	return console.log.apply(null, arguments);
  }
}

// Function by Dmitriy Kubyshkin and copied (with minor variable name modifications) from https://www.everythingfrontend.com/posts/insert-text-into-textarea-at-cursor-position.html
function insertAtCursor(textarea_element, textToInsert) {
  const isSuccess = document.execCommand("insertText", false, textToInsert);

  // Firefox (non-standard method)
  if (!isSuccess && typeof textarea_element.setRangeText === "function") {
    const start = textarea_element.selectionStart;
    textarea_element.setRangeText(textToInsert);
    // update cursor to be at the end of insertion
    textarea_element.selectionStart = textarea_element.selectionEnd = start + textToInsert.length;

    // Notify any possible listeners of the change
    const e = document.createEvent("UIEvent");
    e.initEvent("input", true, false);
    textarea_element.dispatchEvent(e);
  }
}

function get_hovercard_data(profile_url, link_element, callback_fn) {
  consoleDebug('getting hovercard data for profile link: ', profile_url);
  var request = new XMLHttpRequest();
  request.open('GET', profile_url + '/hovercard.json', true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      var data = JSON.parse(request.responseText);
      consoleDebug("hovercard JSON: ", request.responseText);
      consoleDebug("hovercard data: ", data);
      callback_fn(data['diaspora_id'], link_element);
    } else {
      consoleDebug("Unsupported HTTP status while retrieving hovercard data: ", request.status, request.responseText);
    }
  };

  request.onerror = function() {
    // There was a connection error of some sort
     consoleDebug("Request error while retrieving hovercard data: ", request.status, request.responseText);
  };

  request.send();
}


function insert_handle_in_comment(handle, link_element) {
  var new_comment_box = link_element.closest('.comment_stream').querySelector('.new-comment .comment-box');
  consoleDebug("Inserting handle at ", handle, new_comment_box);
  insertAtCursor(new_comment_box, '@{' + handle + '}');
  new_comment_box.focus();
}

function add_reply_link(comment_element) {
  consoleDebug("Comment: ", comment_element);
  consoleDebug(comment_element.dataset);
  if (comment_element.dataset.profile_link) {
    consoleDebug('Comment already has a profile link: ', comment_element.dataset.profile_link, comment_element);
    return;
  }
  else {
    consoleDebug("No profile link");
    comment_element.dataset.profile_link = comment_element.querySelector('.author-name')['href'];
    consoleDebug('Profile link added to comment: ', comment_element.dataset.profile_link, comment_element);
  }
	var reply_link = document.createElement('a');
  var new_comment_form = comment_element.closest('.comment_stream').querySelector('form.new-comment');
  consoleDebug("new comment form: ", comment_element, new_comment_form);
  reply_link['href'] = '#' + new_comment_form['id'];
  reply_link.appendChild(document.createTextNode("reply"));
  reply_link.dataset.profile_link = comment_element.dataset.profile_link;
  consoleDebug('Reply Link: ', reply_link);
  reply_link.addEventListener('click', function (e) {
    if (!this.dataset.handle) {
      consoleDebug('Could not find handle in dataset. Requesting from hovercard url', this);
      data = get_hovercard_data(this.dataset.profile_link, this, insert_handle_in_comment);
    }
    else {
      insert_handle_in_comment(this.dataset.handle, this);
    }
	});
  consoleDebug('Reply Link with event listener: ', reply_link);

  var control_icons = comment_element.querySelector('.control-icons');
  consoleDebug('control-icons: ', control_icons);
	control_icons.appendChild(reply_link);
}


window.mainContainerQueryPath = "#main-stream > div, #profile_container .row, #container";

function process_comments() {
 	var comments = document.querySelectorAll('.comment_stream .comments .comment');
  if (comments) {
    consoleDebug(comments.length);
    consoleDebug("Adding reply link to comments: ", comments);
    comments.forEach(comment_element => add_reply_link(comment_element));
  }
  else {
    consoleDebug("Could not find comments");
  }
}

(function() {
  'use strict';
  
  var stream = document.querySelector(window.mainContainerQueryPath);
  var callback = function(mutationRecords) {
    consoleDebug("mutationRecords callback");
    stream = document.querySelector(window.mainContainerQueryPath);

    mutationRecords.forEach(function(mutationRecord) {
      if (mutationRecord && mutationRecord.type && mutationRecord.type == "childList") {
        if (mutationRecord.target) {
          if (!mutationRecord.target.className.includes('timeago')) {
        		consoleDebug(mutationRecord);
            if(mutationRecord.target.className && mutationRecord.target.className.includes('comments')) {
            	process_comments();
          	}
          }
        }
        if (mutationRecord.previousSibling && mutationRecord.previousSibling.className && mutationRecord.previousSibling.className.includes('stream-element') && mutationRecord.previousSibling.className.includes('loaded')) {
          consoleDebug("Calling process_comments()");
          process_comments();
      	}
      }
		});
  }
  if( stream ) {
    new MutationObserver(callback).observe(stream, {
      attributes: true,
      attributeOldValue: true,
      childList: true,
      subtree: true
    })
  }
})();