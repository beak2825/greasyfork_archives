// ==UserScript==
// @name         Theme for RocketChat
// @version      1.0
// @description  try to take over the world!
// @author       You
// @match        https://chat.thegreyraven.com/*
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/256643
// @downloadURL https://update.greasyfork.org/scripts/383206/Theme%20for%20RocketChat.user.js
// @updateURL https://update.greasyfork.org/scripts/383206/Theme%20for%20RocketChat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`

    .color-primary-font-color {
  color: #CCC!important;
}

.rc-member-list__username, .rc-member-list__counter {
  color: #CCC;
}

.role-tag {
}

.attachment-block-border, .background-info-font-color {

background-color: #008080 !important;

}

.avatar {

    border-radius: 8px;

}

.rc-header{
    border-bottom: 1px solid #008080 !important;
}

.border-component-color {
    border-color: #008080 !important;
}

.rc-old .flex-tab__result, .rc-old .page-settings .section:not(:only-child), .rc-old .page-static .content .section .section-content {
  background: none;
}

.rc-member-list__user {
  padding-left: 10px;
}

.rc-member-list__user:hover {
  background: #008080;
}


.rc-header__wrap, .rooms-list, header {
  background: #151515;
}

.sidebar-light .sidebar-item {
  color: #ccc;
}

.sidebar {

    border-right: 1px solid #313338 !important;
    -webkit-box-shadow: none !important;
    box-shadow: none !important;
    transition: all .3s ease-out;
    width: 90%;
}


header {
  margin: 0px!important;
}

.rc-button:hover {
  background-color: #00B0B0!important;
}

.message {

}

.rc-input__element {
  border: 2px solid #008080!important;
}

.rc-input__element:focus {
  border-color: #00B0B0!important;
}

.message.sequential {

}

.messages-container-wrapper, .preferences-page header, .preferences-page header__wrap, .preferences-page, footer, .directory .rc-header .rc-header__wrap, .main-content, header .rc-header {
  background-color: #202020!important;
}

.contextual-bar__header, .flex-tab .list-view, .contextual-bar__content {
  background: #252525;
}

.rc-old .code-colors {
  border-color: #63b490;
  box-shadow: 0px 0px 6px 0px #63b490;
  background-color: #63b490;
}

.sidebar-item {

    width: 90%;
    border-radius:8px;
    margin-top: 3px;
    margin-left:10px;

}

.sidebar-item--active,
.background-info-font-color {
  background-color: #008080;
  width: 90%;
  border-radius:8px;
  margin-top: 3px;
  margin-left:10px;


}

.sidebar-item:hover {

  width: 90%;
  border-radius:8px;
  margin-top: 3px;
  margin-left:10px;
  background-color: #006666;
}

.tabs {
  border-bottom: 2px solid #303030!important;
}

.tab.active {
  color: #008080;
  border-bottom-color: #008080;
}

.rc-table tbody tr:not(.table-no-click):not(.table-no-pointer):hover {
  background: #008080;
}

:root:root {
  --sidebar-background-light: #008080!important;
  --sidebar-background-light-hover: #008080!important;
  --sidebar-item-hover-background: #008080!important;
  --rooms-list-empty-text-color: #A0A0A0!important;
  --sidebar-item-text-color: #fff!important;
  --color-gray-light: #008080!important;
  --input-text-color: #CCC!important;
  --button-primary-background: #008080!important;

}

.rc-popover__content {
  padding: 5px;
  background-color: #202020;
  box-shadow: 0px 0px 8px 0px black;
}

.rc-popover__column {
  box-shadow: none;
}

.rc-header__name {
color: #008080;
text-shadow: 0px 0px 4px #008080;
}

.rc-message-box__container {
  padding: .50rem 0;
  border-radius:8px;
}

.rooms-list__type {

}

`);
})();