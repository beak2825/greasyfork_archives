// ==UserScript==
// @name Expand Chatwork box description.
// @namespace Chatwork
// @icon data:image/png;base64,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
// @grant    GM_addStyle
// @run-at document-start
// @match *://www.chatwork.com/*
// @version 0.1.3
// @description Expand Chatwork box description
// @downloadURL https://update.greasyfork.org/scripts/376906/Expand%20Chatwork%20box%20description.user.js
// @updateURL https://update.greasyfork.org/scripts/376906/Expand%20Chatwork%20box%20description.meta.js
// ==/UserScript==


GM_addStyle(`
    .h-100 {
      height: 100% !important;
    }

    .w-100 {
      width: 100% !important;
    }

    .pr-0 {
      padding-right: 0 !important;
    }

    .pr-0 {
      overflow-y: scroll !important;
    }

    .expand-desc {
      width: 100% !important;
      padding-right: 0 !important;
      overflow-y: scroll !important;
    }
    .triangle {
      margin-top: 5px;
      margin-left: 5px;
      border-bottom: 10px solid #000000;
      border-left: 6px solid rgba(0, 0, 0, 0);
      border-right: 6px solid rgba(0, 0, 0, 0);
      content: "";
      display: inline-block;
      height: 0;
      vertical-align: top;
      width: 0;
      transform: rotate(120deg);
    }
    .rotate-180 {
      transform: rotate(180deg);
    }
`);

function expandDescriptionEl()
{
  $(function () {
    if ($('#collapse-desc-icon').length == 0) {
      $('.roomDescription__headerText').append('<span id="collapse-desc-icon" class="triangle"></span>');
    }
    
    $('.roomDescription__body').click(function () {
      $('.descriptionContents_overflow').addClass('h-100');
      $('#collapse-desc-icon').addClass('rotate-180');
    });

    $('#_RoomDescriptionArea').on('mouseout mousemove', function () {
      $('#_subContentArea').addClass('expand-desc');
    });
    
    $('.roomDescription__headerText').click(function () {
      $('#_subContentArea').toggleClass('expand-desc');
      $('.descriptionContents_overflow').toggleClass('h-100');
      $('#collapse-desc-icon').toggleClass('rotate-180');
    });
    
    $('.roomDescription__headerText').css('cursor', 'pointer');
  });
}
document.addEventListener("DOMContentLoaded", function(event) {
  expandDescriptionEl();
  setTimeout(function () {
    expandDescriptionEl();
  }, 5000);
});

