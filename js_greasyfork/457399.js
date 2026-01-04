// ==UserScript==
// @name         Vivaldi Forum Tweaks
// @namespace    https://greasyfork.org/en/users/197428-pathduck
// @license      MIT
// @version      2.14
// @description  CSS tweaks for Vivaldi Forums
// @author       Pathduck
// @supportURL   https://greasyfork.org/en/scripts/457399-vivaldi-forum-tweaks
// @match        https://forum.vivaldi.net/*
// @exclude      https://forum.vivaldi.net/assets/*
// @icon         https://icons.duckduckgo.com/ip2/vivaldi.net.ico
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/457399/Vivaldi%20Forum%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/457399/Vivaldi%20Forum%20Tweaks.meta.js
// ==/UserScript==

GM_addStyle(`
@media (min-width: 960px) {body {padding-top: 60px;}}
hr {margin: 5px;}
#advanced-search #results pre {max-height: 200px !important;}
#content {margin-top: 0; padding-top: 0 !important;}
#content .breadcrumb {padding-top: 0; margin-bottom: 0;}
#content .posts>li {padding: 10px 0 0;}
#logged-in-menu {margin: 3px 0;}
#menucontent>.row {height: 40px;}
#search-button {display: none;}
#search-fields, #search-form {margin-top: 0px;}
#search-form #search-fields.hidden {max-width: unset; width: 300px;}
#search-form .btn-outline-secondary {border: none;}
#vivaldi-header.header {height: 40px !important;}
.account .account-stats, .account hr, .account .profile {margin: 0 auto 5px;}
.alert {margin: 0 2px !important;}
.button:focus, .form-control:focus, .dropdown-toggle:focus, .btn:focus-visible {outline: solid !important;}
.categories .description {padding: 0;}
.categories ul, .categories li {padding: 0 !important; margin: 0 0 5px !important;}
.categories-list li.category-children-item .title a {font-weight: unset !important;}
.categories-title {margin: 0 !important;}
.categories>li .content, .category>ul>li .content {padding: 0;}
.chat-modal .modal-content.ui-resizable {width: 50vw; height: 80vh; right: 75%;}
.header .chat-list .main-avatar {margin-top: 0;}
.header .chat-list, .header .notification-list {width: 500px !important; max-height: 85vh;}
.header .chat-list .text-sm, .header .notification-list .text-sm  {font-size: .9rem !important;}
.header .chat-list button.mark-read, .header .notification-list button.mark-read {height: 100% !important;}
.navbar.navbar-vivaldi>div {min-height: unset;height: 35px;}
.tag-list h5 {margin: 5px 10px !important;}
.topic h1 {line-height: 1.1;}
.topic .post-header + br {display: none; }
.topic .post-signature p {margin: 0;}
.topic .post-signature {margin-top: 5px; margin-bottom: 0;}
.topic .post-tools>a, .topic .moderator-tools>a {padding: 0 10px;}
.topic .posts .content .img-fluid {max-width: 40vw; max-height: 40vh;}
.topic .posts .content blockquote {font-style: unset; font-size: 14px; margin: 5px; padding: 10px;}
.topic .posts .content p {margin-top: 0; margin-bottom: .5rem;}
.topic .posts .content pre.markdown-highlight {margin: unset; padding: 3px; border-radius: 15px;}
.topic .posts .content {min-height: 45px !important;}
.topic .posts .threaded-replies {margin-top: 5px; padding: 0;}
.topic .posts.timeline .timeline-event {text-align: center !important; justify-content: center !important; font-weight: bold;}
.topic .topic-header .topic-info {padding: 0;}
.topic .topic-header .topic-title > span {font-size: 1.6rem !important;}
.topic .topic-header .topic-title {margin: 5px 0 0;}
.topic .topic-header > div {gap: unset !important;}
.topic .topic-header {margin-bottom: 0 !important;}
.topic-list-header {height: 45px; padding: 5px !important;}
.topic-list-header.sticky-top {top: unset !important;}
.topics-list li.category-item .lastpost .avatar {margin: 0 10px 0 0 !important;}
.topics-list li.category-item .lastpost .permalink {padding-bottom: 2px !important;}
.topics-list li.category-item .lastpost {padding: 0 !important;}
.topics-list li.category-item .title a {font-weight: unset !important; font-size: 1.2rem !important;}
.topics-list li.category-item {padding: 0 0 20px !important;}
.topics-list li.category-item.deleted .title {text-decoration: line-through;}
.topics-list a.topic-thumbs {display: none !important;}
.userinfo #user_label {padding: 0 !important;}
.vivaldi-nav-link {line-height: 33px;}

/* Dark skin fixes */
.skin-dark blockquote {background-color: #333; border-left: 5px solid #4c70f0;}
.skin-dark code, .skin-dark pre {color: white;}
.skin-dark .alert.alert-warning {background-color: darkred;}
.skin-dark .alert.alert-info {background-color: darkslategrey;}
.skin-dark .alert-window .alert {background-color: #333;}
.skin-dark .alert-window .alert.alert-info {color: limegreen;}
.skin-dark .badge.unanswered, .skin-dark .badge.answered {filter: unset !important;}
.skin-dark .btn-group button, .skin-dark .btn-primary, .skin-dark .topic-main-buttons button {background: linear-gradient(0deg,#2a3f87 0,#4c70f0 100%);}
.skin-dark .btn-group .btn, .skin-dark button i {color: white !important;}
.skin-dark .category-children a:hover {color: #4c70f0 !important;}
.skin-dark .chats-full .active .chat-room-btn {background-color: darkslategrey !important;}
.skin-dark .composer .preview a {color: #809cff !important}
.skin-dark .dropdown-item:focus, .skin-dark .dropdown-item:hover {background-color: #3652b0;}
.skin-dark .header .notification-list .unread, .skin-dark .header .chat-list .unread  {background: darkslategrey;}
.skin-dark .label-success {background-color: green;}
.skin-dark .navbar-vivaldi {background: linear-gradient(0deg,#2a3f87 0,#4c70f0 100%) !important;}
.skin-dark .pagination>.active>a {background-color: #3652b0;}
.skin-dark .post-header a.text-uppercase.badge {color: white !important;}
.skin-dark .status.offline {color: #333;}
.skin-dark .status.online {color: forestgreen;}
.skin-dark .text-muted {color: #DDD !important;}
.skin-dark .textcomplete-dropdown .textcomplete-item.active,
.skin-dark .textcomplete-dropdown .textcomplete-item:hover {outline: solid;}
.skin-dark .textcomplete-dropdown {color: white !important; background-color: darkslategrey;}
.skin-dark .topic .posts .dropdown-menu a {color: white !important}
.skin-dark .topic .posts a {color: #809cff !important;}
.skin-dark .topic-list-header.text-bg-light {background-color: transparent !important;}
.skin-dark .topics-list .badge, .skin-dark .topic-info .badge {filter: brightness(150%);}
.skin-dark .topics-list li.category-item {border-top: unset;}
.skin-dark .topics-list li.category-item.unread .lastpost {border-color: #ddd !important;}
.skin-dark .topics-list li.category-item:not(.unread) h3.title a {opacity: 0.5;}
.skin-dark .topics-list li.category-item:not(.unread) h3.title a:hover {opacity: unset;}
.skin-dark .userinfo .nav-item:hover, .skin-dark .btn-link:hover {background-color: #303030 !important;}

/* External link warning */
a[rel^="nofollow"]::after {content:"⚠️";}
a[href*="vivaldi." i]::after {content: unset !important;}
`);
