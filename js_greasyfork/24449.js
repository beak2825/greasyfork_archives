// ==UserScript==
// @name        Spaz's Reddit Delete
// @namespace   Reddit
// @include     http*://*.reddit.com/user/*
// @version     b1
// @description Replaces all VISIBLE comments with garbage text, then deletes the comment. Works with RES!
// custom updated version of of Spaz's original work. Updates by bgrogan
// @downloadURL https://update.greasyfork.org/scripts/24449/Spaz%27s%20Reddit%20Delete.user.js
// @updateURL https://update.greasyfork.org/scripts/24449/Spaz%27s%20Reddit%20Delete.meta.js
// ==/UserScript==

RD = unsafeWindow.RedditDelete = {};
RD.DELAY_SAVE   = 2 * 1000;
RD.DELAY_DELETE = 3 * 1000;
RD.chars      = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz><.-,+!@#$%^&*();:[]~';
RD.started    = false;

function __getRNGString(maxLength) {
  var rnum, repl_str = '';

  for (var x = 0; x < maxLength; x++){
    rnum = Math.floor(Math.random() * RD.chars.length);
    repl_str += RD.chars.charAt(rnum, 1);
  }

  return repl_str;
}

function _setupEnv() {
  if (RD.started) return;

  RD.numDel       = 0;
  RD.contentCtnr  = document.querySelector('div.content');
  RD.infoBar      = document.createElement('span');
  RD.userName     = document.querySelector('span.user > a:not(.login-required)').innerHTML;
  RD.infoBar.setAttribute('class', 'nextprev');
  RD.started      = true;
}

function _setupUI() {
  //Build DELETE-ALL Link
  var delAllLink        = document.createElement('a');
  delAllLink.innerHTML  = 'SECURE DELETE ALL COMMENTS';
  delAllLink.onclick    = _promptDeleteAll;
  delAllLink.style.cssText = "color: rgb(200, 0, 0); text-shadow: -1px 0px 6px rgba(0,0,0, 0.7);";

  //Add to infoBar!
  RD.infoBar.appendChild(delAllLink);
  RD.contentCtnr.insertBefore(RD.infoBar, RD.contentCtnr.firstChild);
}

function _promptDeleteAll() {
  var doDelete = confirm("Are you sure you want to delete all comments on the screen?\n\n"
    + "ProTip: If you want to delete ALL, use RES and use 'Never Ending Reddit' feature to show ALL comments.");

  if (!doDelete) return;

  _deleteAll();
}

function _deleteAll() {
  var modalCntr = RD.modalCntr = document.createElement('div');
  var modalMsg  = RD.modalMsg  = document.createElement('div');
  var cancelBtn  = document.createElement('button');
  modalCntr.style.cssText = ''
   + 'position: fixed; top: 0; left: 0; right: 0; bottom: 0;'
   + 'height: 100%; width: 100%; background: rgba(0,0,0,0.8);'

  modalMsg.style.cssText = ''
   + 'position: absolute; font-size: 32px; transform: translateX(-50%); top: 50%; left: 50%;'

  cancelBtn.style.cssText = ''
   + 'position: absolute; font-size: 22px;'
   + 'transform: translateX(-50%); top: 63%; left: 50%;'

  cancelBtn.innerHTML = "Cancel";
  cancelBtn.onclick = function() {
    RD.modalMsg.innerHTML = "Cancelling...";
    RD.numDel = RD.comments.length;
  };

  RD.comments = __getVisibleComments();
  RD.numDel     = 0;

  modalCntr.appendChild(modalMsg);
  modalCntr.appendChild(cancelBtn);
  document.body.appendChild(modalCntr);

  __deleteCommentIndex(0);
}

function __getVisibleComments() {
  var foundComments = [];

  var entries     = RD.contentCtnr.querySelectorAll('.entry.likes');
  var entry       = null;
  var entryAuthor = '';

  for (var idx = 0; idx < entries.length; idx++) {
    entry = entries[idx];
    entryAuthor = entry.querySelector('.author');

    if (!entryAuthor || entryAuthor.innerHTML !== RD.userName) continue;

    foundComments.push(entry);
  }

  return foundComments;
}

function __deleteCommentIndex(idx) {
  var comment = RD.comments[idx];

  __overwriteComment(comment, function(comment) {
    __deleteComment(comment, function() {
      var complete = RD.numDel >= RD.comments.length;
      if (false === complete) {
        RD.numDel++;
        __deleteCommentIndex(RD.numDel);
      } else {
        window.location.reload();
      }
    });
  });
}

function __overwriteComment(comment, callback) {
  var editLink = comment.querySelector('.edit-usertext');
  var editText, newText, saveLink;

  RD.modalMsg.innerHTML = 'Overwriting ' + (RD.numDel + 1) + ' of ' + RD.comments.length + '...';

  if (!editLink) { if (callback) callback(comment); return; }

  //Enable editing...
  editLink.click();
  editText = comment.querySelector('textarea');
  saveBtn = comment.querySelector('.usertext-buttons .save');

  //Replace Text with RNG string
  newText         = __getRNGString(editText.value.length);
  editText.value  = newText;

  //Do the save...
  saveBtn.click();
  setTimeout(function() { if (callback) callback(comment); }, RD.DELAY_SAVE);
}

function __deleteComment(comment, callback) {
  RD.modalMsg.innerHTML = 'Deleting ' + (RD.numDel + 1) + ' of ' + RD.comments.length + '...';

  var deleteLink = comment.querySelector('form.del-button .togglebutton');
  var yesLink;

  //Enable deleting...
  deleteLink.click();
  yesLink = comment.querySelector('.option.error.active a.yes');

  if (!yesLink) { if (callback) callback(); return; }

  //Delay clicking YES so the user can see it
  setTimeout(function() {
    //Do the delete...
    yesLink.click();
    setTimeout(function() { if (callback) callback(); }, RD.DELAY_DELETE);
  }, 250);
}

(function() {
  _setupEnv();
  _setupUI();
})();