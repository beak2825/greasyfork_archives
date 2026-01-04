// ==UserScript==
// @name         IRCCloud Delete All Fileuploads
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a 'delete all' button in the file uploads view.
// @author       Daniel Baldes
// @match        https://www.irccloud.com/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/392848/IRCCloud%20Delete%20All%20Fileuploads.user.js
// @updateURL https://update.greasyfork.org/scripts/392848/IRCCloud%20Delete%20All%20Fileuploads.meta.js
// ==/UserScript==


(function($) {
    'use strict';

    var btnadded = false;

    function addDeleteAll(node) {
        if (!btnadded) {
          var fupload = document.getElementById('filesOverlayContents');
          if (fupload) {
              console.log("add delete all button");
              fupload.insertAdjacentHTML( 'afterbegin', '<button type="button" id="dabtn" class="delete" style="float:right"><span>Delete All</span></button>');
              var dabtn = document.getElementById('dabtn');
              dabtn.addEventListener("click", function() {
                  var filedivs = document.getElementById('filesList').getElementsByClassName('file');
                  var i;
                  for (i = 0; i < filedivs.length; ++i) {
                      var filediv = filedivs[i];

                      var events = $._data(filediv, "events");
                      var handler = events.click[1].handler;
                      var dbutton = filediv.getElementsByClassName('delete')[0];
                      var e = {};
                      e.preventDefault = function() {};
                      e.currentTarget = dbutton;

                      handler(e);
                  }
                  var deleteAllButton = $(dabtn);
                  var progressInterval = setInterval(function() {
                      var count = 0;
                      for (i = 0; i < filedivs.length; ++i) {
                          var filediv = filedivs[i];
                          var dbutton = filediv.getElementsByClassName('delete')[0];
                          if (!dbutton.disabled) {
                              filediv.setAttribute("style", "display:none");
                              ++count;
                          }
                      }
                      var remaining = filedivs.length - count;
                      deleteAllButton.html("<span>Deleting... " + remaining + "</span>");
                      deleteAllButton.addSpin();
                      if (remaining <= 0) {
                          clearInterval(progressInterval);
                          deleteAllButton.removeSpin();
                          deleteAllButton.html("<span>Delete All</span>");
                      }
                  }, 500);
              });
              btnadded = true;
          }
        }
    };

    addDeleteAll(document.body);

})(unsafeWindow.$);
