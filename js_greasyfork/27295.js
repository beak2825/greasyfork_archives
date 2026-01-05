// ==UserScript==
// @name         ESPNCricInfo Threaded Comments
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Convert flat comments on ESPNCricInfo stories into threaded comments.
// @author       Sudhee
// @match        http://www.espncricinfo.com/*/content/story/*
// @grant        none
// @locale       en
// @downloadURL https://update.greasyfork.org/scripts/27295/ESPNCricInfo%20Threaded%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/27295/ESPNCricInfo%20Threaded%20Comments.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var once = false;
  $('.user-comments a[href=#all]').on('click', function () {
      if (once) {
          return;
      }
      console.log("Converting comments to threads!!!");
      var $comments = $('ul.container-tab.all li');
      var userNameMap = {};
      var comments = [];
      $comments.find('.user_name').each(function (idx) {
          var userName = $(this).contents().filter(function () {
              return this.nodeType == 3;
          }).text().trim();
          if (!$.isArray(userNameMap[userName])) {
              userNameMap[userName] = [];
          }
          userNameMap[userName].push(idx);
      });
      $comments.each(function (idx) {
          var $textNodes = $(this).find('p').filter(function () {
              return !!$(this).text().trim();
          });
          var comment = "";
          $textNodes.each(function () {
              comment += $(this).text().trim();
          });
          comments.push(comment);
      });
      comments.forEach(function (comment, idx) {
          $.each(userNameMap, function (userName, userCommentIdxArray) {
              var a = comment.toLowerCase().indexOf(userName.toLowerCase());
              if (a == -1 || a > 3) {
                  return;
              }
              var sourceIdx = userCommentIdxArray.filter(function (b) {
                  return b > idx;
              });
              // console.log(sourceIdx.length);
              var $reply = $comments.eq(idx);
              var $moveReply = $reply.clone();
              $moveReply.css('borderBottom', '0');
              $reply.hide();
              /* if (sourceIdx.length > 1) {
                  console.log("Reply to " + userName + " from " + userCommentIdxArray + ": " + comment + " & " + idx);
                  $.each(sourceIdx, function (j, val) {
                      console.log("Original comments: " + comments[val]);
                  });
              } */
              var $moveReplyContainer = $('<ul></ul>').html($moveReply);
              $moveReplyContainer.css({
                  'float': 'left',
                  'borderLeft': '1px solid #e8e8e8',
                  'margin': '0 0 0 30px',
                  'paddingLeft': '20px'
              });
              $comments.eq(sourceIdx[0]).append($moveReplyContainer);
              return false;
          });
      });
      // $(window).scrollTop($('div.user-comments').offset().top);
      once = true;
  });
})();