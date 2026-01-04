// ==UserScript==
// @name          Trello Air Date
// @include       http://trello.com/*
// @include       https://trello.com/*
// @grant         GM_addStyle
// @description:en Sweet Trello
// @version 0.0.2.20180324191458
// @namespace https://greasyfork.org/users/176399
// @description Sweet Trello
// @downloadURL https://update.greasyfork.org/scripts/39894/Trello%20Air%20Date.user.js
// @updateURL https://update.greasyfork.org/scripts/39894/Trello%20Air%20Date.meta.js
// ==/UserScript==

GM_addStyle ( `
.js-card-detail-due-date h3.card-detail-item-header {
  visibility: hidden;
  }

.js-card-detail-due-date h3.card-detail-item-header:before {
  visibility: visible;
  content: 'Air Date';
  }

a.button-link.js-add-due-date {
  text-indent: -9999px;
  }

a.button-link.js-add-due-date span {
  text-indent: 9999px;
  padding-left: 3px;
  }

a.button-link.js-add-due-date span:after {
  content: ' Air Date';
  font: 14px Helvetica Neue,Arial,Helvetica,sans-serif;
  font-weight: bold;
  color: #444;
  padding-left: 4px;
  }

a.button-link.js-add-due-date:active span:after {
  color: #fff;
  }

.list-card-title {
  font-weight: 600;
  color: rgb(0, 0, 0);
}

` );