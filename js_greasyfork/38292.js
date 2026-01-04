// ==UserScript==
// @name         Trello Improved
// @description  Hide card badges for watching, comments and description. Add background to all card badges. Wider windows/card details.
// @author       Skilling
// @version      0.2.7
// @match        https://trello.com/*
// @grant        none
// @namespace    https://greasyfork.org/users/169956
// @downloadURL https://update.greasyfork.org/scripts/38292/Trello%20Improved.user.js
// @updateURL https://update.greasyfork.org/scripts/38292/Trello%20Improved.meta.js
// ==/UserScript==

(function() {
  'use strict';

  $(`
    <style>
      * {
        -webkit-font-smoothing: antialiased;
      }

      .list-wrapper {
        width: 280px;
      }
      .list-wrapper.mod-add {
        width: auto;
      }

      .body-card-label-text .card-label.mod-card-front {
        font-size: 11px;
        min-width: 20px;
        padding: 0 3px;
      }

      .badges .badge[title="You are watching this card."],
      .badges .badge[title="You are subscribed to this card."],
      .badges .badge[title="This card has a description."],
      .badges .badge[title="Comments"],
      .badges .badge[title="Attachments"],
      .badges .badge[title="Trello attachments"],
      .badges .badge .icon-sm {
        display: none;
      }

      .badges .badge {
        background-color: #eee;
        border-radius: 3px;
        padding: 0 2px;
        margin-top: 10px;
        min-width: 12px;
        min-height: 16px;
        text-align: center;
      }
      .badges .badge .badge-text {
        font-size: 11px;
        font-weight: bold;
      }
      .badges .custom-field-front-badges .badge {
        padding-left: 2px;
      }
      .badges .badge .icon-sm {
        width: 18px;
        margin-top: 1px;
      }
      .badges .custom-field-front-badges .badge .icon-sm {
        display: none;
      }
      .badges .badge.is-due-soon {
        background-color: #f2d600;
        color: #fff;
      }
      .badges .badge.is-unread-notification,
      .badges .badge.is-due-now {
        background-color: #eb5a46;
        color: #fff;
      }
      .badges .badge.is-due-past {
        background-color: #ec9488;
        color: #fff;
      }
      .badges .badge.is-due-complete,
      .badges .badge.is-complete {
        background-color: #61bd4f;
        color: #fff;
      }

      .badges .badge.field-color-green  { background-color: #61bd4f; }
      .badges .badge.field-color-yellow { background-color: #f2d600; }
      .badges .badge.field-color-orange { background-color: #ffab4a; }
      .badges .badge.field-color-red    { background-color: #eb5a46; }
      .badges .badge.field-color-purple { background-color: #c377e0; }
      .badges .badge.field-color-blue   { background-color: #0079bf; }
      .badges .badge.field-color-sky    { background-color: #00c2e0; }
      .badges .badge.field-color-lime   { background-color: #51e898; }
      .badges .badge.field-color-pink   { background-color: #ff80ce; }
      .badges .badge.field-color-black  { background-color: #4d4d4d; }
      .badges .badge.field-color-none   { background-color: #b6bbbf; }

      .window {
        width: 1000px;
      }
      .window-main-col {
        width: 780px;
      }

      .card-detail-item-header-edit {
        float: right;
      }
      
      .canonical-card > div {
        width: 280px;
      }
      .canonical-card > div > a {
        font-size: 11px;
      }
      .canonical-card > div > a > div:nth-child(1) > span {
        font-size: 11px;
        height: 14px;
        min-width: 20px;
        padding: 0 3px;
      }
      .canonical-card > div > a > div:nth-child(3),
      .canonical-card > div > a > div:nth-child(4) {
        display: none;
      }
    </style>
  `).appendTo('head');

  var tweakCardBadge = function(badge) {
    var value = badge.innerHTML.split(': ');

    if (value[1]) {
      badge.innerHTML = value[1];
    }
  };

  setInterval(function() {
    document.querySelectorAll('.custom-field-front-badges .badge .badge-text').forEach(tweakCardBadge);
  }, 500);
})();