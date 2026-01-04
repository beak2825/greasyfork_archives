// ==UserScript==
// @name          YouTube Rounded Style
// @author        Redi
// @version       1.0.51
// @description   A simple rounded corner style for youtube.
// @include       https://www.youtube.com/*
// @license       MIT License
// @grant         GM_addStyle
// @run-at        document-start
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @namespace https://greasyfork.org/users/955267
// @downloadURL https://update.greasyfork.org/scripts/450842/YouTube%20Rounded%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/450842/YouTube%20Rounded%20Style.meta.js
// ==/UserScript==


// ==============================================================================
// MIT License

// Copyright (c) 2022 Redi

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
// ==============================================================================


// Cascade Style Sheets
GM_addStyle 
( `
    @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css");


    /* ============================================================================== */
    /* Video Thumbnail */
    /* ============================================================================== */
    img.yt-img-shadow 
    {
        border-radius: 9px !important;
    }

    ytd-thumbnail #thumbnail.ytd-thumbnail 
    {
        background-color: #181818 !important;
    }

    ytd-thumbnail-overlay-resume-playback-renderer:nth-child(1) /* Video Watched Bar */
    {
        right: 44px;
        left: 9px;
        z-index: 0;
        margin-bottom: 9px;
        border-radius: 50px;
    }

    ytd-thumbnail-overlay-resume-playback-renderer.style-scope.ytd-thumbnail 
    {
        right: 44px;
        left: 9px;
        z-index: 0;
        margin-bottom: 9px;
        border-radius: 50px;
    }

    #progress.ytd-thumbnail-overlay-resume-playback-renderer 
    {
        border-radius: 50px;
    }    

    ytd-thumbnail-overlay-time-status-renderer /* Video Duration */
    {
        background-color: rgb(0 0 0 / 35%) !important;
        border-radius: 5px !important;
    }

    ytd-toggle-button-renderer.style-compact-gray[is-paper-button] 
    {
        border-radius: 4px;
    }


    /* ============================================================================== */
    /* Video Playlist */
    /* ============================================================================== */
    ytd-thumbnail-overlay-bottom-panel-renderer 
    {
        border-radius: 0px 0px 8px 8px;
    }

    ytd-thumbnail-overlay-hover-text-renderer 
    {
        transition: 0.2s;
        border-radius: 7px;
    }

    ytd-thumbnail[now-playing] ytd-thumbnail-overlay-now-playing-renderer.ytd-thumbnail 
    {
        opacity: 1;
        pointer-events: auto;
        border-radius: 7px;
    }


    /* ============================================================================== */
    /* Recommended Genres */
    /* ============================================================================== */
    ytd-feed-filter-chip-bar-renderer 
    {
        --ytd-rich-grid-chips-bar-top: 66px !important;
        --ytd-rich-grid-chips-bar-width: 86% !important;
        justify-content: center !important;
        margin-left: 10px;
    }
    
        #chips-wrapper.ytd-feed-filter-chip-bar-renderer 
    {
        border: 1px solid var(--yt-spec-10-percent-layer);
        border-radius: 10px;
    }
  
        #left-arrow-button.ytd-feed-filter-chip-bar-renderer, #right-arrow-button.ytd-feed-filter-chip-bar-renderer 
    {
        border-radius: 10px;
    }

    yt-chip-cloud-chip-renderer[chip-style=STYLE_DEFAULT], yt-chip-cloud-chip-renderer[chip-style=STYLE_HOME_FILTER], yt-chip-cloud-chip-renderer[chip-style=STYLE_REFRESH_TO_NOVEL_CHIP] 
    {
        border: 0px solid var(--yt-spec-10-percent-layer) !important;
    }


    /* ============================================================================== */
    /* YouTube Menu */
    /* ============================================================================== */
    #guide-content.ytd-app 
    {
        margin-left: 10px;
        margin-top: 10px;
        margin-bottom: 10px;
        border-radius: 10px;
        border: 1px solid var(--yt-spec-10-percent-layer);
        width: 97%;
    }

    ytd-guide-entry-renderer[active] 
    {
        border-radius: 7px;
        width: 85%;
        margin-left: 10px;
    }

    tp-yt-paper-item:focus, .tp-yt-paper-item.tp-yt-paper-item:focus 
    {
        position: static !important;
    }

    #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer:active 
    {
        background-color: #383838;
    }

    #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer:hover
    {
        background-color: rgb(66 66 66 / 10%) !important;
        margin-left: 10px;
    }

    #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer 
    {
        width: 85%;
        border-radius: 7px;
        margin-top: 5px;
        transition: .2s;
    }

    ytd-mini-guide-entry-renderer 
    {
        margin-left: 4px;
        transition: .2s;
    }

    ytd-mini-guide-renderer.ytd-app 
    {
        margin-left: 10px;
        margin-top: 10px;
        margin-bottom: 10px;
        border-radius: 7px;
        border: 1px solid var(--yt-spec-10-percent-layer);
    }

    ytd-mini-guide-entry-renderer:hover, ytd-mini-guide-entry-renderer:focus 
    {
        border-radius: 7px;
        margin-left: 4px;
        margin-right: 4px;
        margin-bottom: 4px;
    }

    a.ytd-mini-guide-entry-renderer 
    {
        padding: 13px 0px 4px !important;
        margin-left: -4px;
    }

    /* ============================================================================== */
    /* Youtube Upload Button */
    /* ============================================================================== */
    button#button[aria-label="Create"] 
    {
        width: 0;
        padding: 12px;
    }

    button#button[aria-label="Create"]:before 
    {
      content: "\\e09a";
      font-size: 19px;
      color: white;
      display: block;
      font-family: FontAwesome;
      font-weight: 200;
      margin-left: -7.8px;
    }


    /* ============================================================================== */
    /* YouTube Notifications */
    /* ============================================================================== */
    #contentWrapper.tp-yt-iron-dropdown > * 
    {
        border-radius: 10px;
        border-top: 1px solid var(--yt-spec-10-percent-layer);
    }

    /* ============================================================================== */
    /* Search */
    /* ============================================================================== */
    #container.ytd-searchbox 
    {
        border: 0px solid var(--ytd-searchbox-legacy-border-color) !important;
        border-radius: 6px !important;
        margin-right: 10px;
    }

    #container.ytd-searchbox > [slot=search-input] input 
    {
        margin-left: 5px !important;
    }

    #search-icon-legacy.ytd-searchbox 
    {
        border-radius: 6px !important;
        width: 70px;
    }


    /* ============================================================================== */
    /* Youtube Country */
    /* ============================================================================== */
        #country-code.ytd-topbar-logo-renderer 
    {
        color: transparent !important;
    }

    /* ============================================================================== */
    /* Youtube Video*/
    /* ============================================================================== */
    .html5-video-player .video-click-tracking, .html5-video-player .video-stream 
    {
        border-radius: 12px;
    }

    .ytp-chrome-bottom 
    {
        border-radius: 10;
    }
    
    
    /* ============================================================================== */
    /* Youtube Bar */
    /* ============================================================================== */
    .ytp-progress-list 
    {
        border-radius: 10px;
    }

    .ytp-progress-linear-live-buffer, .ytp-ad-progress, .ytp-load-progress, .ytp-play-progress
    {
        border-radius: 10px;
    }
  

    /* ============================================================================== */
    /* Youtube Subscribe Button */
    /* ============================================================================== */
    tp-yt-paper-button.ytd-subscribe-button-renderer 
    {
        background-color: #c000 !important;
        border: 2px red solid;
        border-radius: 7px !important;
    }

    tp-yt-paper-button.ytd-subscribe-button-renderer[subscribed] 
    {
        background-color: #262626 !important;
        color: #fff;
        border: 2px solid #262626;
    }


    /* ============================================================================== */
    /* Youtube Join Button */
    /* ============================================================================== */
    ytd-button-renderer.style-suggestive[is-paper-button] tp-yt-paper-button.ytd-button-renderer 
    {
        border: 2px solid var(--yt-spec-call-to-action) !important;
        border-radius: 7px;
    }


    /* ============================================================================== */
    /* Youtube Notification Button */
    /* ============================================================================== */
    ytd-subscription-notification-toggle-button-renderer #button.ytd-subscription-notification-toggle-button-renderer 
    {
      background-color: #262626 !important;
      border-radius: 7px;
      margin-left: 8px;
    }

    ytd-menu-popup-renderer 
    {
        border-radius: 10px !important;
    }


    /* ============================================================================== */
    /* Youtube Title Header */
    /* ============================================================================== */
    ytd-video-primary-info-renderer 
    {
        background: #111 !important;
        margin-top: 20px;
        border-radius: 10px 10px 0px 0px;
    }

    .title.ytd-video-primary-info-renderer 
    {
        margin-left: 20px;
    }

    #info.ytd-video-primary-info-renderer 
    {
        margin-left: 20px;
        margin-right: 20px;
    }

    .super-title-icon.ytd-video-primary-info-renderer 
    {
        margin-left: 17px !important;
        margin-right: -17px !important;
    }


    /* ============================================================================== */
    /* Youtube Description */
    /* ============================================================================== */
    ytd-video-secondary-info-renderer 
    {
        background: #111 !important;
        margin-bottom: -24px !important;
        margin-bottom: -4px !important;
        border-bottom: 0px solid var(--yt-spec-10-percent-layer) !important;
        border-radius: 0px 0px 10px 10px;
    }
  
    .super-title.ytd-video-primary-info-renderer 
    {
        margin-left: 20px !important;
    }
    
    #top-row.ytd-video-secondary-info-renderer 
    {
        margin-left: 20px !important;
        margin-right: 20px !important;
    }

    /* ============================================================================== */
    /* Youtube Comment Section */
    /* ============================================================================== */
    #title.ytd-comments-header-renderer 
    {
        margin-left: 20px !important;
        margin-top: 16px !important;
    }

    ytd-comment-simplebox-renderer
    {
        margin-left: 20px !important;
        margin-bottom: 16px !important;
        margin-right: 20px !important;
    }

    ytd-comments-header-renderer 
    {
        background: #111 !important;
    }

    #footer.ytd-commentbox 
    {
        margin-top: 10px !important;
    }

    ytd-button-renderer.style-primary[disabled][is-paper-button] 
    {
        border-radius: 5px !important;
        transition: .2s;
    }
    
    ytd-button-renderer.style-primary[is-paper-button] 
    {
        border-radius: 5px !important;
        transition: .2s;
    }

    #sections:nth-child(2) 
    {
        background-color: #111 !important;
        border-radius: 10px;
    }

    ytd-comment-thread-renderer 
    {
        margin-left: 20px;
        margin-right: 20px;
    }


    /* ============================================================================== */
    /* Video Mini Playlist */
    /* ============================================================================== */
    #container.ytd-playlist-panel-renderer 
    {
        border-radius: 10px;
    }
    
    ytd-playlist-panel-renderer[collapsible] .header.ytd-playlist-panel-renderer 
    {
        border-radius: 10px 10px 0px 0px;
    }

    .playlist-items.ytd-playlist-panel-renderer 
    {
        border-radius: 10px;
    }

    ytd-playlist-panel-video-renderer[selected][watch-color-update] 
    {
        background-color: rgb(0 0 0) !important;
        border-radius: 10px;
        margin-top: 10px;
        margin-left: 10px;
        margin-right: 5px;
        margin-bottom: 10px;
    }

    ytd-playlist-panel-video-renderer 
    {
        margin: 10px;
        border-radius: 10px;
        transition: .2s;
        padding: 9px 0px 3px 0px !important;
    }

    ytd-playlist-panel-video-renderer[watch-color-update]:hover:not(.dragging)
    {
        background-color: rgb(32 32 32) !important;
    }

    ytd-thumbnail-overlay-side-panel-renderer 
    {
        border-radius: 0px 10px 10px 0px !important;
    }

    img#img[width="94"] 
    {
        border-radius: 10px 0px 0px 10px !important;
    }

    /* Youtube Premium Overlay */
    img#img[src="https://www.gstatic.com/youtube/img/promos/growth/6ad5a99c727579634bc3e2fb67562a2621170bdd11578967392667be5a05c5e4_384x384.png"] 
    {
        border-radius: 10px;
    }

    tp-yt-paper-dialog 
    {
        border-radius: 10px;
    }


    /* ============================================================================== */
    /* Miniplayer */
    /* ============================================================================== */
    .video.ytd-miniplayer 
    {
        background-color: #00000000 !important;
    }

    .html5-video-player.ytp-player-minimized:not(.ended-mode):not(.cued-mode):not(.unstarted-mode) 
    {
        overflow: visible;
    }

    #content.ytd-rich-item-renderer ytd-post-renderer.ytd-rich-item-renderer, #content.ytd-rich-item-renderer ytd-shared-post-renderer.ytd-rich-item-renderer 
    {
        border-radius: 10px !important;
    }

    #player-container.ytd-miniplayer 
    {
        border-radius: 15px;
    }

    #movie_player
    {
         border-radius: 14px;
    }

    .html5-video-player .video-stream 
    {
        border-radius: 14px 14px 0px 0px !important;
    }

    ytd-miniplayer.ytd-app[active] 
    {
        border-radius: 14px !important;
    }

    #card.ytd-miniplayer 
    {
        border-radius: 15px;
    }

    .ytp-miniplayer-scrim 
    {
        border-radius: 14px;
    }

    .ytp-miniplayer-close-button 
    {        
        transition: .2s;
        margin-top: 5px;
        margin-right: 5px;
        border-radius: 30px;
    }

    .ytp-miniplayer-close-button:hover
    {        
        background-color: #11111175;
        border-radius: 30px;
    }

    .ytp-miniplayer-expand-watch-page-button.ytp-miniplayer-button-top-left 
    {
        transition: .2s;
        margin-left: 5px;
        margin-top: 5px;
        border-radius: 30px;
    }

    .ytp-miniplayer-expand-watch-page-button.ytp-miniplayer-button-top-left:hover
    {        
        background-color: #11111175;
        border-radius: 30px;
    }


    /* ============================================================================== */
    /* Premiere / Live Chat Notification */
    /* ============================================================================== */
    .ytp-autohide .ytp-offline-slate-bar, .ytp-hide-controls .ytp-offline-slate-bar 
    {
        border-radius: 9px !important;
    }

    yt-live-chat-header-renderer 
    {
        border-radius: 10px 10px 0px 0px;
    }

    ytd-live-chat-frame 
    {
        border: 0px solid var(--yt-spec-10-percent-layer) !important;
        border-radius: 10px;
    }

    #show-hide-button.ytd-live-chat-frame>ytd-toggle-button-renderer.ytd-live-chat-frame 
    {
        margin-top: -1px;
    }

    #item-scroller.animated.yt-live-chat-item-list-renderer #items.yt-live-chat-item-list-renderer 
    {
        background: #111;
    }

    #show-hide-button.ytd-live-chat-frame>ytd-toggle-button-renderer.ytd-live-chat-frame 
    {
        border-radius: 10px;
        transition: .2s;
    } 

    tp-yt-paper-button#button[aria-pressed="true"] 
    {
        border-radius: 0px 0px 10px 10px !important;
        border-top: 1px solid var(--yt-spec-10-percent-layer);
        background-color: #202020 !important;
    }

    tp-yt-paper-button#button[aria-pressed="false"] 
    {
        border-radius: 10px;
        border-top: 0px solid var(--yt-spec-10-percent-layer);        
    }

    #card.yt-live-chat-viewer-engagement-message-renderer 
    {
        background-color: #1c1c1c !important;
        border-radius: 8px !important;
    }

    #menu.yt-live-chat-text-message-renderer 
    {
        background: #111 !important;
    }
    
    .sbsb_a 
    {
        /*background: #111 !important;*/
        border-radius: 10px;
        margin-top: 10px;
        margin-right: 10px;
    }

    .sbpqs_a 
    {
        /*color: #ffffff !important;*/
    }    

    .sbdd_b 
    {
        background: #fff0 !important;
        border: 0px solid #2a2a2a00 !important;
        border-top-color: #d9d9d900 !important;
        box-shadow: 0 2px 4pxrgba(0,0,0,0.2) !important;
        -webkit-box-shadow: 0 2px 4px rgb(0 0 0 / 0%) !important;
    }


    /* ============================================================================== */
    /* Community Chat */
    /* ============================================================================== */
    ytd-page-manager>*.ytd-page-manager 
    {
        background: #181818 !important;
    }

    ytd-backstage-post-thread-renderer 
    {
        border-radius: 10px;
    }

    ytd-section-list-renderer:not([hide-bottom-separator]):not([page-subtype=history]):not([page-subtype=memberships-and-purchases]):not([page-subtype=ypc-offers]) #contents.ytd-section-list-renderer>*.ytd-section-list-renderer:not(:last-child):not(ytd-page-introduction-renderer):not([item-dismissed]).ytd-section-list-renderer:not([has-destination-shelf-renderer]).ytd-section-list-renderer:not(ytd-minor-moment-header-renderer) 
    {
        border-bottom: 0px solid var(--yt-spec-10-percent-layer) !important;
    }

    ytd-comments-header-renderer:nth-child(1)
    {
        border-radius: 10px;
    }

` );

/* JS */
function GM_addStyle(cssStr) 
{
    var D               = document;
    var newNode         = D.createElement ('style');
    newNode.textContent = cssStr;

    var targ    = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    targ.appendChild (newNode);
    
}

(function()
{
  'use strict';
  
  // ==============================================================================
  // Change Youtube Search Placeholder
  // ==============================================================================
  document.addEventListener('yt-navigate-finish', () => 
    {
        setTimeout(() => 
        {
            document.querySelector('input#search').placeholder = 'Search something...';
        }, 200);
    }); 
  
}) ();