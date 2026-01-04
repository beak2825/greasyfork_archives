// ==UserScript==
// @name          7ktTube fixes
// @description   Fix UI of youtube.com after 7ktTube | 2016 REDUX script
// @author        MK
// @namespace     max44
// @homepage      https://greasyfork.org/en/users/309172-max44
// @match         *://*.youtube.com/*
// @match         *://*.youtu.be/*
// @icon          https://cdn.icon-icons.com/icons2/1488/PNG/512/5295-youtube-i_102568.png
// @version       1.2.21
// @license       MIT
// @require       https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @run-at        document-end
// @downloadURL https://update.greasyfork.org/scripts/443836/7ktTube%20fixes.user.js
// @updateURL https://update.greasyfork.org/scripts/443836/7ktTube%20fixes.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var css = `
  /*Overlay over thumbnail*/
  ytd-thumbnail-overlay-resume-playback-renderer:not(.foo) {
    display: block !important;
    opacity: 1 !important;
    background: rgba(0, 0, 0, 0) !important;
    transition: all 0s ease 0s !important;
    z-index: 9 !important;
  }
  /*Progress bar over thumbnail*/
  #progress.ytd-thumbnail-overlay-resume-playback-renderer:not(.foo) {
    display: block !important;
    background-color: red !important;
    opacity: 1 !important;
  }
  /*Video duration background over thumbnail*/
  ytd-thumbnail-overlay-resume-playback-renderer:hover:not(.foo) {
    height: inherit !important;
    opacity: 1 !important;
  }
  /*Video duration over thumbnail*/
  ytd-app ytd-thumbnail-overlay-time-status-renderer:not(.foo) {
    font-size: 12px !important;
    height: 12px !important;
    line-height: 12px !important;
    opacity: 1 !important;
    padding: 3px 4px !important;
  }
  /*Video duration over thumbnail*/
  #scroll-container.yt-horizontal-list-renderer ytd-thumbnail-overlay-time-status-renderer:not(.foo) {
    top: auto !important;
  }

  /*Thumbnail width in search results*/
  ytd-video-renderer[is-search] ytd-thumbnail.ytd-video-renderer {
    max-width: 240px !important;
  }

  /*Thumbnail size in playlist*/
  /*[page-subtype="playlist"] ytd-thumbnail.ytd-playlist-video-renderer, ytd-thumbnail.ytd-playlist-video-renderer img {
    height: 68px !important;
    width: 120px !important;
  }*/

  /*Youtube apps button*/
  /*ytd-topbar-menu-button-renderer:nth-last-of-type(2) yt-icon:not(.foo) {
    fill: inherit !important;
  }*/

  /*Left border around number of subscribers on channel you are not subscribed to*/
  /*#owner-sub-count.ytd-video-owner-renderer:not(.foo) {
    border-left-width: 1px !important;
  }*/
  /*Some element near subscribe button*/
  ytd-subscribe-button-renderer > yt-formatted-string#owner-sub-count[hidden] {
    display: none !important;
  }
  /*ytd-c4-tabbed-header-renderer[use-modern-style] #buttons.ytd-c4-tabbed-header-renderer {
    padding: 3px 0 !important;
  }*/
  #subscriber-count.ytd-c4-tabbed-header-renderer::before {
    content: var(subscriberCountText);
  }
  /*Height of number of subscribers*/
  #owner-sub-count.ytd-video-owner-renderer {
    max-height: unset !important;
  }

  /*Make less indent for "Download" in popup menu*/
  yt-icon.ytd-menu-service-item-download-renderer {
    margin-right: 8px !important;
  }

  /*Make height of dislike button the same as like*/
  /*div#segmented-dislike-button yt-icon-button#button {
    height: var(--yt-paper-button-height,auto) !important;
  }*/
  div#segmented-dislike-button yt-icon-button#button yt-icon {
    margin-top: 2px !important;
  }


  /*Hide "Show more" button under the list description*/
  ytd-expander.ytd-playlist-sidebar-primary-info-renderer > tp-yt-paper-button#more {
    display: none !important;
  }
  /*Fix position of "Edit playlist description" button*/
  ytd-expander.ytd-playlist-sidebar-primary-info-renderer > div > div > ytd-inline-form-renderer > ytd-button-renderer#edit-button {
    margin-top: unset !important;
  }

  /*Fix position of studio button at your own channel*/
  div#inner-header-container div#buttons > div#edit-buttons {
    margin-top: -5px !important;
    left: 70px !important;
  }
  /*Hide config button*/
  div#inner-header-container div#buttons > div#edit-buttons a[href$="editing"] tp-yt-paper-button#button {
    display: none !important;
  }
  /*Hide studio button in pop-down menu*/
  tp-yt-iron-dropdown #contentWrapper #container #items a[href*="studio.youtube.com"] {
    display: none !important;
  }

  /*Fix playlist new design - not 7ktTube*/
  /*Color of username*/
  ytd-playlist-header-renderer div.immersive-header-container yt-formatted-string#owner-text > a {
    color: unset !important;
  }
  /*Playlist description text*/
  ytd-playlist-header-renderer div.immersive-header-container div.description div#snippet span#plain-snippet-text {
    font-size: 1.2rem !important;
  }
  /*Playlist edit button*/
  ytd-playlist-header-renderer div.immersive-header-container #edit-button yt-icon {
    filter: none !important;
    opacity: 0.9 !important;
  }
  `;

  /*-------------The following fixes are no longer necessary since May 2023-------------*/
  /*Fix playlist new design - not 7ktTube*/
  /*Position of the tracks list*/
  /*ytd-browse.ytd-page-manager[rounded-container][page-subtype="playlist"] > ytd-two-column-browse-results-renderer.ytd-browse:not(.foo) {
    *margin-left: 0px !important;
    margin-right: 0px !important;
    max-width: unset !important;
    padding-left: calc(var(--ytd-rich-grid-item-max-width) + 28px) !important;
    padding-top: unset !important;
    width: 100% !important;
  }*/

  /*-------------The following fixes are no longer necessary, as Enhancer for YouTube addon fixed it in Oct 2022-------------*/
  /*Vertical alignment of player control buttons*/
  /*.ytp-button.ytp-mute-button:not(.foo)  {
    padding-top: 6px !important;
  }
  .ytp-right-controls .ytp-button:not(.foo)  {
    padding-top: 6px;
  }
  .ytp-time-display:not(.foo) {
    padding-top: 1px;
  }
  ytp-efyt-button:not(.foo)  {
    padding-top: 0px !important;
  }*/

  /*-------------The following fixes are no longer necessary, as 7ktTube author changed the relevant sections in Jul 2022-------------*/
  /*Position of subscribe button*/
  /*ytd-app #subscribe-button.ytd-video-secondary-info-renderer {
    left: 49px !important;
    top: 34px !important;
  }*/

  /*Position of dislike bar*/
  /*ytd-app #info .ryd-tooltip:not(.foo) {
    top: 15px !important;
  }
  #return-youtube-dislike-bar {
    margin-top: -2px !important;
  }*/

  /*Move top row higher*/
  /*#info #top-row.ytd-video-secondary-info-renderer {
    bottom: 15px !important;
  }*/

  /*Make info panel higher*/
  /*#info ytd-video-primary-info-renderer {
    padding-bottom: 20px !important;
  }*/

  /*Change height of 7ktTube Downloader panel*/
  /*#info-contents > div {
    margin-top: unset !important;
  }
  .ytdl-link-btn:not(.foo) {
    vertical-align: middle !important;
    margin-left: 3px !important;
    margin-right: 0px !important;
  }*/

  /*-------------The following fixes are no longer necessary, as 7ktTube author changed the relevant sections in Jun 2022-------------*/
  /*Channel name under description*/
  /*ytd-app #channel-name.ytd-video-owner-renderer:not(.foo) {
    top: auto !important;
  }*/
  /*Remove "Add to" string from "Save" button*/
  /*#text.ytd-button-renderer::after {
    content: "" !important;
  }*/
  /*Remove duplicated icon from "Save" button*/
  /*button#button.style-scope[aria-label="Save to playlist"] yt-icon.style-scope {
    background: none !important;
  }*/
  /*Remove duplicated icon from "Clip" button*/
  /*button#button.style-scope[aria-label="Clip"] yt-icon.style-scope {
    background: none !important;
  }*/
  /*Make bigger gap between computed buttons*/
  /*div#top-level-buttons-computed ytd-button-renderer.force-icon-button {
    margin-left: 10px !important;
  }*/
  /*Do not reorder computed buttons upon activation*/
  /*div#top-level-buttons-computed > ytd-toggle-button-renderer.style-default-active[is-icon-button]:not(.foo) {
    order: unset !important;
  }*/
  /*Remove duplicated dropdown menu*/
  /*div#top-level-buttons-computed yt-icon-button#button.dropdown-trigger {
    display: none !important;
  }*/
  /*Align dropdown menu*/
  /*ytd-menu-renderer yt-icon-button#button.dropdown-trigger button#button.style-scope[aria-label="More actions"] {
    padding-top: 5px !important;
  }*/

  /*-------------The following fixes are no longer necessary, as 7ktTube author changed the relevant sections in Apr 2023-------------*/
  /*Fix position of elements inside channel header*/
  /*ytd-c4-tabbed-header-renderer[use-modern-style] #inner-header-container.ytd-c4-tabbed-header-renderer {
    margin-top: unset !important;
  }
  #channel-header-container.ytd-c4-tabbed-header-renderer {
    height: 100% !important;
  }*/

  if (window.location === window.parent.location) { //Do not apply fixes for embedded video
    if (typeof GM_addStyle != 'undefined') {
      GM_addStyle(css);
    } else if (typeof PRO_addStyle != 'undefined') {
      PRO_addStyle(css);
    } else if (typeof addStyle != 'undefined') {
      addStyle(css);
    } else {
      var node = document.createElement('style');
      node.type = 'text/css';
      node.appendChild(document.createTextNode(css));
      document.documentElement.appendChild(node);
    }
  }

})();
