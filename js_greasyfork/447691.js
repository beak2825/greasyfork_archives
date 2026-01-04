// ==UserScript==
// @name        Scanlover - Dark Theme
// @namespace   Violentmonkey Scripts
// @match       https://scanlover.com/*
// @match       http://scanlover.com/*
// @grant       GM_addStyle
// @version     1.4.8
// @author      Angelium
// @inject-into content
// @license     MIT
// @description 9/07/2022, 4:07:28 pm
// @downloadURL https://update.greasyfork.org/scripts/447691/Scanlover%20-%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/447691/Scanlover%20-%20Dark%20Theme.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

const highlight_css = `
  /*!
    Theme: StackOverflow Dark
    Description: Dark theme as used on stackoverflow.com
    Author: stackoverflow.com
    Maintainer: @Hirse
    Website: https://github.com/StackExchange/Stacks
    License: MIT
    Updated: 2021-05-15
    Updated for @stackoverflow/stacks v0.64.0
    Code Blocks: /blob/v0.64.0/lib/css/components/_stacks-code-blocks.less
    Colors: /blob/v0.64.0/lib/css/exports/_stacks-constants-colors.less
  */

  .hljs {
    color: #ffffff!important;
    background: #1c1b1b!important;
  }

  .hljs-subst {
    color: #ffffff!important;
  }

  .hljs-comment {
    color: #999999!important;
  }

  .hljs-keyword,
  .hljs-selector-tag,
  .hljs-meta .hljs-keyword,
  .hljs-doctag,
  .hljs-section {
    color: #88aece!important;
  }

  .hljs-attr {
    color: #88aece!important;
  }

  .hljs-attribute {
    color: #c59bc1!important;
  }

  .hljs-name,
  .hljs-type,
  .hljs-number,
  .hljs-selector-id,
  .hljs-quote,
  .hljs-template-tag {
    color: #f08d49!important;
  }

  .hljs-selector-class {
    color: #88aece!important;
  }

  .hljs-string,
  .hljs-regexp,
  .hljs-symbol,
  .hljs-variable,
  .hljs-template-variable,
  .hljs-link,
  .hljs-selector-attr {
    color: #b5bd68!important;
  }

  .hljs-meta,
  .hljs-selector-pseudo {
    color: #88aece!important;
  }

  .hljs-built_in,
  .hljs-title,
  .hljs-literal {
    color: #f08d49!important;
  }

  .hljs-bullet,
  .hljs-code {
    color: #cccccc!important;
  }

  .hljs-meta .hljs-string {
    color: #b5bd68!important;
  }

  .hljs-deletion {
    color: #de7176!important;
  }

  .hljs-addition {
    color: #76c490!important;
  }

  .hljs-emphasis {
    font-style: italic;
  }

  .hljs-strong {
    font-weight: bold;
  }

  .hljs-formula,
  .hljs-operator,
  .hljs-params,
  .hljs-property,
  .hljs-punctuation,
  .hljs-tag {
    /* purposely ignored */
  }
`;

const dark_css = `
  html:root {
    --accent-color: #543fd7;
    --background-color: #212a2e;
    --alternate-background-color: #263238;
    --background-hover-color: #324149;
    --text-color: #F7F8F8;
    --text-color-light: #A9ACB2;
    --link-color: #828fff;
    --masthead-text: #fff;
    --brand-color: var(--accent-color);
    --button-color: var(--brand-color);
    --button-text: #fff;
    --border-color: #ffffff1c;
    --border: 1px solid var(--border-color);
    --search-background: #151515;
  }

  .__ns__pop2top.__ns__pop2top {
    z-index: 1!important;
  }

  body, .App-content, .App::before, #drawer {
    background: var(--background-color);
    color: var(--text-color);
  }

  a {
    color: var(--link-color);
  }

  a:hover {
    text-decoration: underline;
  }

  .EventPost, .EventPost a {
    color: var(--text-color-light);
  }

  .App-content {
    border-top: 1px solid hsla(0, 0%, 100%, .08);
  }

  .App-titleControl button,
  .Header-title a,
  .PostUser h3,
  .PostUser h3 a,
  .DiscussionListItem-count,
  legend {
    color: var(--text-color)!important;
  }

  @media (max-width: 767px) {
    .App-titleControl {
      color: var(--text-color)!important;
    }

    .DiscussionListItem-count {
      background: #4d698e; // default
    }

    .unread .DiscussionListItem-count {
      background: var(--brand-color);
    }
  }

  /* Placeholder
  /* ---------------------------------------------------------- */

  .FormControl::placeholder,
  .ReplyPlaceholder {
    color: var(--text-color-light)!important;
  }

  /* Header / Nav items
  /* ---------------------------------------------------------- */

  .App-header {
    background: var(--background-color);
    border-bottom: 1px solid hsla(0, 0%, 100%, .08);
  }

  .Header-secondary .item-notifications {
    margin-right: 10px;
  }

  @media (max-width: 767px) { 
    .App-header { border-bottom: none; }

    .Header-secondary .item-notifications {
      margin: 23px 0;
    }
  }

  .Navigation-drawer.new::after {
    background: var(--brand-color);
  }

  /* Sidenav
  /* ---------------------------------------------------------- */

  .IndexPage-nav a, .sideNav a {
    color: var(--masthead-text)!important;
  }

  .sideNav .Dropdown--select .Dropdown-menu > li > a .Button-icon {
    margin-left: 0;
  }

  @media (min-width: 768px) {
    .sideNav .Dropdown--select .Dropdown-menu > .Dropdown-separator {
      display: none;
    }

    .sideNav .Dropdown--select .Dropdown-menu > li > a {
      padding: 8px 1rem 8px 1rem;
      color: #667c99;
    }
  }

  @media (min-width: 768px) and (max-width: 991px) {
    .sideNav::after {
      border-bottom: var(--border);
    }

    .sideNav .Dropdown--select .Dropdown-menu > li > a {
      padding-left: 1rem;
    }
  }

  /* Scrubber
  /* ---------------------------------------------------------- */

  .Scrubber a, .Scrubber-unread, .Scrubber a:hover, .Scrubber a:active {
    color: var(--text-color);
  }

  .Scrubber a:hover, .Scrubber a:active {
    opacity: 0.8;
  }

  .Scrubber-description {
    color: var(--text-color-light);
  }

  .Scrubber-handle {
    color: var(--text-color);
    background: transparent;
  }

  .Scrubber-bar {
    background: var(--brand-color);
  }

  .Scrubber-unread {
    background-image: none;
  }

  @media (max-width: 767px) {
    .PostStreamScrubber .Dropdown-menu {
      background: var(--alternate-background-color);
    }
  }

  /* Buttons - ok
  /* ---------------------------------------------------------- */

  button, .Button {
    color: var(--button-text);
    background: var(--button-color);
  }

  .Button:hover, .Button:focus, .Button.focus,
  .Button:active, .Button.active, .open > .Dropdown-toggle.Button,
  .Button--link:hover {
    color: var(--button-text);
    background-color: var(--button-color);
    opacity: 0.8;
  }

  .Button--primary.disabled, .Button--primary[disabled], fieldset[disabled] .Button--primary {
    background-color: var(--button-color)!important;
    opacity: 0.8!important;
  }

  .NotificationsDropdown .Dropdown-toggle.new .Button-icon,
  .NotificationsDropdown-unread.NotificationsDropdown-unread {
    color: var(--button-text);
    background: var(--button-color);
  }

  @media (max-width: 767px) {
    .App-primaryControl > .Button, .App-backControl > .Button {
      color: var(--button-text)!important;
    }
  }

  /* Discussion list
  /* ---------------------------------------------------------- */

  @media (max-width: 767px) {
    .DiscussionPage-nav {
      border-bottom: var(--border);
    }
  }

  .Hero,
  .WelcomeHero,
  .DiscussionPage-list,
  .DiscussionHero--colored, .UserHero {
    background: var(--alternate-background-color)!important;
  }

  .DiscussionListItem-relevantPosts .PostPreview,
  .DiscussionListItem-relevantPosts .PostPreview:hover {
    background: var(--alternate-background-color)!important;
    color: var(--text-color-light);
  }


  .DiscussionListItem .DiscussionListItem-relevantPosts .PostPreview,
  .DiscussionListItem:hover .DiscussionListItem-relevantPosts .PostPreview  {
    border: none;
    border-radius: 0;
  }

  .DiscussionListItem-content:active,
  .DiscussionListItem:hover,
  .DiscussionPage-list .DiscussionListItem.active {
    background: var(--background-hover-color)!important;
  }

  .DiscussionListItem button {
    background: transparent;
  }

  .WelcomeHero,
  .DiscussionListItem-title {
    color: var(--text-color);
  }

  .read .DiscussionListItem-title.DiscussionListItem-title,
  .DiscussionListItem-info {
    color: var(--text-color-light);
  }

  /* PostStream
  /* ---------------------------------------------------------- */

  .PostStream-timeGap {
    color: var(--text-color);
    border-bottom: var(--border);
    padding: 30px 20px 30px 20px;
    font-size: 20px;
    text-align: center;
  }

  .PostsUserPage-list > li,
  .PostStream-item:not(:last-child) {
    border-bottom: var(--border);
  }

  .PostsUserPage-discussion, .PostsUserPage-discussion a {
    color: var(--link-color);
  }

  .PostsUserPage-discussion a {
    text-decoration: none;
  }

  .TagLabel, .TagLabel a {
    background: var(--button-color);
    color: var(--text-color)
  }

  /* Post header, body
  /* ---------------------------------------------------------- */

  .Avatar {
    background-color: transparent;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  }

  .Post-header, .Post-header a, .Post-footer, .Post-actions, .Post-footer a, .Post-actions a, .PostMeta .Dropdown-menu {
    color: var(--text-color-light);
  }

  .Post-body a, .Post-body a, .Post-body a {
    border: none;
  }
  
  .Post-body a:hover, .Post-body a:focus, .Post-body a:active {
    text-decoration: underline!important;
    -webkit-filter: brightness(80%);
    filter: brightness(80%);
  }

  .PostMeta-number {
    color: var(--text-color);
  }

  .Post-body blockquote {
    position: relative;
    background: var(--alternate-background-color);
    padding: 1.5rem;
    border-left: 5px solid var(--accent-color);
    border-top: none;
    border-bottom: none;
    color: var(--text-color);
  }

  .Post-body a:hover, .Post-body a:focus, .Post-body a:active {
    text-decoration: none;
    border: none;
  }

  .Post-body pre {
    border-radius: .5rem;
    border: .1rem solid #545454;
    overflow: auto;
    padding: 1rem;
    background: #1c1b1b !important;
    color: var(--text-color);
  }
  
  .Post-body :not(pre) code {
    padding: .2rem .3rem;
    font-size: 90%;
    border-radius: .25rem;
    margin: 0 .2rem;
    overflow: auto;
    color: #d63384;
    word-wrap: break-word;
    background: #1c1b1b;
  }

  .Post-controls button {
    background: transparent;
  }

  /* UserCard
  /* ---------------------------------------------------------- */

  .UserCard, .UserCard .username {
    color: var(--text-color)!important;
  }

  .UserCard a {
    color: var(--link-color)!important;
  }

  .UserCard--popover {
    background: var(--alternate-background-color)!important;
  }

  /* Search
  /* ---------------------------------------------------------- */

  .Search-input {
    color: var(--text-color);
  }

  .Search input:not(:focus),
  .Search .FormControl,
  .Search .FormControl:focus,
  .Modal-body .FormControl {
    color: var(--text-color);
    background: var(--search-background);
  }

  .FormControl, .FormControl:focus,
  .Modal-body .FormControl, .Modal-body FormControl:focus {
    background: var(--search-background);
    border: none;
    color: var(--text-color)!important;
  }

  .Search-results {
    background: var(--background-color);
    color: var(--text-color);
  }

  .Search-results .Dropdown-header {
    border-top: var(--border);
    color: var(--text-color);
  }

  .Search-results .active a,
  .Search-results a:hover {
    background: var(--background-hover-color)!important;
  }

  .DiscussionSearchResult-excerpt {
    color: var(--text-color-light);
  }

  /* Composer
  /* ---------------------------------------------------------- */

  .Composer {
    background: var(--alternate-background-color);
  }

  .Composer:not(.minimized)::before {
    background: var(--background-color);
    border-bottom: 1px solid hsla(0, 0%, 100%, .08);
  }

  .Composer.minimized {
    background: var(--background-color);
    border-top: var(--border);
  }

  .ComposerBody-loading {
    background: #212a2ea3!important;
  }

  .ComposerBody-header h3,
  .normal .ComposerBody-header > li:first-child h3,
  [title="Post Reply"] .Button-icon {
    color: var(--text-color)!important;
  }

  .Composer.active,
  .Composer.fullScreen {
    background: var(--alternate-background-color)
  }

  .TextEditor-controls {
    border-top: var(--border);
  }

  textarea.Composer-flexible,
  textarea.Composer-flexible:focus {
    color: var(--text-color);
  }

  @media (max-width: 767px) {
    .item-flagrow-image-upload {
      margin-left: 10px;
    }
  }

  /* Modal
  /* ---------------------------------------------------------- */

  .SelectTagList > li.active {
    background: var(--alternate-background-color);
  }

  .TagDiscussionModal .Modal-header, .Modal-content {
    background: var(--background-color)!important;
  }
  
  .ModalManager::before {
    display: none;
  }

  .Modal-body {
    border-top: var(--border);
    background: var(--alternate-background-color);
    color: var(--text-color-light);
  }

  .TagDiscussionModal .Modal-header h3 {
    color: var(--text-color);
    padding: 0 20px 20px;
  }

  .Modal-footer,
  .PostLikesModal-list a,
  .FlagPostModal .checkbox strong,
  .helpText {
    color: var(--text-color);
  }

  /* Notification Group
  /* ---------------------------------------------------------- */

  .NotificationGroup-header,
  .NotificationList-header h4 {
    color: var(--text-color)!important;
  }

  @media (min-width: 768px) {
    .NotificationList-header {
      border-bottom: var(--border);
    }
  }

  .NotificationGroup {
    border-top: var(--border);
  }

  .unread.Notification.unread.Notification,
  .Notification:hover {
    background: var(--background-hover-color)!important;
  }

  .Notification {
    color: var(--link-color)!important;
  }

  /* PostPreview
  /* ---------------------------------------------------------- */

  .PostPreview:hover {
    background: var(--background-hover-color)!important;
  }

  .PostPreview-content .username {
    color: var(--link-color)!important;
  }

  .PostMention, .UserMention {
    color: var(--text-color);
    background: var(--brand-color)!important;
  }

  .PostMention:hover, .UserMention:hover, .PostMention:active, .UserMention:active {
    color: var(--text-color);
    background: var(--brand-color);
    opacity: 0.8;
  }

  .MentionsDropdown .PostPreview, .PostMention-preview .PostPreview, .Post-mentionedBy-preview .PostPreview {
    color: var(--text-color);
  }

  /* DropDown
  /* ---------------------------------------------------------- */

  .Dropdown-menu {
    background: var(--background-color);
  }

  .Dropdown-menu > li > a:hover, .Dropdown-menu > li > button:hover,
  .Dropdown-menu > .active > a, .Dropdown-menu > li > a:hover {
    background: var(--background-hover-color)!important;
  }

  @media (max-width: 767px) {
    .Dropdown .Dropdown-menu > .active > a, .Dropdown .Dropdown-menu > .active > button, .Dropdown .Dropdown-menu > .active > a:hover, .Dropdown .Dropdown-menu > .active > button:hover {
      background: var(--background-hover-color)!important;
    }
  }

  @media (max-width: 767px) {
    .Dropdown .Dropdown-menu > li > a, .Dropdown .Dropdown-menu > li > button {
      background: var(--background-color);
    }
  }

  .Dropdown-menu > li > a, .Dropdown-menu > li > button, .Dropdown-menu > li > span {
    color: var(--text-color);
  }

  .Dropdown-separator {
    background-color: #ffffff1c;
  }

  /* Subscription menu
  /* ---------------------------------------------------------- */

  .SubscriptionMenuItem-description {
    color: var(--text-color-light);
  }

  /* NotificationGrid
  /* ---------------------------------------------------------- */ 

  .NotificationGrid {
    background: var(--alternate-background-color);
  }

  .NotificationGrid td, .NotificationGrid th {
    border-bottom: var(--border);
    color: var(--text-color);
  }

  .NotificationGrid-checkbox.highlighted .Checkbox:not(.disabled),
  .NotificationGrid-checkbox .Checkbox:hover:not(.disabled) {
    background: var(--background-hover-color);
  }

  /* PostsUserPage
  /* ---------------------------------------------------------- */ 

  .PostsUserPage-loadMore,
  .PostsUserPage .LoadingIndicator {
    margin-top: 2rem;
  }
`;

GM_addStyle(highlight_css);
GM_addStyle(dark_css);