// ==UserScript==
// @name         YouTube CSS
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Adds compact CSS style for mobile and desktop site YouTube
// @author       Agreasyforkuser
// @match        https://*.youtube.com/*
// @exclude      https://*.youtube.com/tv*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/483485/YouTube%20CSS.user.js
// @updateURL https://update.greasyfork.org/scripts/483485/YouTube%20CSS.meta.js
// ==/UserScript==

var currentURL = window.location.href;


//--------------------------------------------------------------------------------------------------------------------------------
if (currentURL.startsWith("https://www.youtube.com")) {

    //Turn off animated Doodles
    //var logoSvg = '<svg viewBox="0 0 93 20" focusable="false" aria-hidden="true" style="pointer-events: none; display: inherit; width: 30%; height: 30%;"> <g fill="#FFFFFF"> <path d="M14.4848 20C14.4848 20 23.5695 20 25.8229 19.4C27.0917 19.06 28.0459 18.08 28.3808 16.87C29 14.65 29 9.98 29 9.98C29 9.98 29 5.34 28.3808 3.14C28.0459 1.9 27.0917 0.94 25.8229 0.61C23.5695 0 14.4848 0 14.4848 0C14.4848 0 5.42037 0 3.17711 0.61C1.9286 0.94 0.954148 1.9 0.59888 3.14C0 5.34 0 9.98 0 9.98C0 9.98 0 14.65 0.59888 16.87C0.954148 18.08 1.9286 19.06 3.17711 19.4C5.42037 20 14.4848 20 14.4848 20Z" fill="#FF0033"></path><path d="M19 10L11.5 5.75V14.25L19 10Z" fill="#FFFFFF"></path></g><g id="youtube-paths_yt4" fill="#FFFFFF"><path d="M37.1384 18.8999V13.4399L40.6084 2.09994H38.0184L36.6984 7.24994C36.3984 8.42994 36.1284 9.65994 35.9284 10.7999H35.7684C35.6584 9.79994 35.3384 8.48994 35.0184 7.22994L33.7384 2.09994H31.1484L34.5684 13.4399V18.8999H37.1384Z" fill="#FFFFFF"></path><path d="M44.1003 6.29994C41.0703 6.29994 40.0303 8.04994 40.0303 11.8199V13.6099C40.0303 16.9899 40.6803 19.1099 44.0403 19.1099C47.3503 19.1099 48.0603 17.0899 48.0603 13.6099V11.8199C48.0603 8.44994 47.3803 6.29994 44.1003 6.29994ZM45.3903 14.7199C45.3903 16.3599 45.1003 17.3899 44.0503 17.3899C43.0203 17.3899 42.7303 16.3499 42.7303 14.7199V10.6799C42.7303 9.27994 42.9303 8.02994 44.0503 8.02994C45.2303 8.02994 45.3903 9.34994 45.3903 10.6799V14.7199Z" fill="#FFFFFF"></path><path d="M52.2713 19.0899C53.7313 19.0899 54.6413 18.4799 55.3913 17.3799H55.5013L55.6113 18.8999H57.6012V6.53994H54.9613V16.4699C54.6812 16.9599 54.0312 17.3199 53.4212 17.3199C52.6512 17.3199 52.4113 16.7099 52.4113 15.6899V6.53994H49.7812V15.8099C49.7812 17.8199 50.3613 19.0899 52.2713 19.0899Z" fill="#FFFFFF"></path><path d="M62.8261 18.8999V4.14994H65.8661V2.09994H57.1761V4.14994H60.2161V18.8999H62.8261Z" fill="#FFFFFF"></path><path d="M67.8728 19.0899C69.3328 19.0899 70.2428 18.4799 70.9928 17.3799H71.1028L71.2128 18.8999H73.2028V6.53994H70.5628V16.4699C70.2828 16.9599 69.6328 17.3199 69.0228 17.3199C68.2528 17.3199 68.0128 16.7099 68.0128 15.6899V6.53994H65.3828V15.8099C65.3828 17.8199 65.9628 19.0899 67.8728 19.0899Z" fill="#FFFFFF"></path><path d="M80.6744 6.26994C79.3944 6.26994 78.4744 6.82994 77.8644 7.73994H77.7344C77.8144 6.53994 77.8744 5.51994 77.8744 4.70994V1.43994H75.3244L75.3144 12.1799L75.3244 18.8999H77.5444L77.7344 17.6999H77.8044C78.3944 18.5099 79.3044 19.0199 80.5144 19.0199C82.5244 19.0199 83.3844 17.2899 83.3844 13.6099V11.6999C83.3844 8.25994 82.9944 6.26994 80.6744 6.26994ZM80.7644 13.6099C80.7644 15.9099 80.4244 17.2799 79.3544 17.2799C78.8544 17.2799 78.1644 17.0399 77.8544 16.5899V9.23994C78.1244 8.53994 78.7244 8.02994 79.3944 8.02994C80.4744 8.02994 80.7644 9.33994 80.7644 11.7299V13.6099Z" fill="#FFFFFF"></path><path d="M92.6517 11.4999C92.6517 8.51994 92.3517 6.30994 88.9217 6.30994C85.6917 6.30994 84.9717 8.45994 84.9717 11.6199V13.7899C84.9717 16.8699 85.6317 19.1099 88.8417 19.1099C91.3817 19.1099 92.6917 17.8399 92.5417 15.3799L90.2917 15.2599C90.2617 16.7799 89.9117 17.3999 88.9017 17.3999C87.6317 17.3999 87.5717 16.1899 87.5717 14.3899V13.5499H92.6517V11.4999ZM88.8617 7.96994C90.0817 7.96994 90.1717 9.11994 90.1717 11.0699V12.0799H87.5717V11.0699C87.5717 9.13994 87.6517 7.96994 88.8617 7.96994Z" fill="#FFFFFF"></path></g></svg>'
    var logoSvg='';
    //Replace the doodle logo with the svg
    setTimeout(replaceDoodle, 10);
    function replaceDoodle(){document.getElementsByTagName('ytd-yoodle-renderer')[0].innerHTML = logoSvg}

    GM_addStyle(`

                  *, *:before, *:after {

                     animation:             none !important;
                     transition:            none !important;
                     perspective:           none !important;
                     backface-visibility: hidden !important;
                     will-change:           auto !important;
                     transform-style:       flat !important;
                     box-shadow:            none !important;
                     backdrop-filter:       none !important;

                  };



                  /* placeholder text in searchbar */
                  ::-moz-placeholder          {color:transparent !important}
                  ::-webkit-input-placeholder {color:transparent !important}
                  #chips-wrapper.ytd-feed-filter-chip-bar-renderer {background-color: transparent !important}
                  /* hide voice-search */
                  #voice-search-button:not(:hover) {opacity: 0 !important}

                  /* sidebar expand button */
                  #guide-button:not(:hover) {opacity: 0 !important}

                  /* logo */
                  #logo:not(:hover) {opacity:0 !important}
                  #country-code.ytd-topbar-logo-renderer {display: none !important}
                  #buttons.ytd-masthead:not(:hover) {opacity:0}



                  /* hide comment input field */
                  ytd-comment-simplebox-renderer:not(:hover) {display:none !important}


                   /* additional description info panels */
                   #clarify-box {display: none !important}
                   #middle-row.ytd-watch-metadata {display: none !important}



                  /* background of like/dislike/share/save buttons */
                  .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--tonal {background: transparent !important}
                  /* likes seperator */
                  .yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--segmented-start::after {display:none !important}
                  /* background of follow button */
                  html[dark] .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--filled {background: transparent !important; color: white !important}
                  /* hide sponsor button */
                  #sponsor-button {display: none !important}


                   /* compact feed */
                   #meta.ytd-rich-grid-media {padding:0 !important}
                   ytd-compact-video-renderer.ytd-item-section-renderer {margin: 0 !important}
                   ytd-compact-playlist-renderer.ytd-item-section-renderer {margin: 0 !important}
                   ytd-compact-video-renderer.ytd-watch-next-secondary-results-renderer:not([expansion="collapsed"]) {margin: 0 !important}
                   .style-scope.ytd-item-section-renderer {margin: 0 !important}

                   yt-chip-cloud-chip-renderer.yt-chip-cloud-renderer {margin-top: 0 !important; margin-bottom: 0 !important}
                   #contents.ytd-rich-grid-renderer {padding-top:0 !important}


                  /* surveys */
                  #survey, #attached-survey {display: none !important}


                  /* padding over video player */
                  ytd-watch-flexy[default-layout]:not([no-top-margin]):not([reduced-top-margin]) #primary.ytd-watch-flexy, ytd-watch-flexy[default-layout]:not([no-top-margin]):not([reduced-top-margin]) #secondary.ytd-watch-flexy {padding-top:0 !important}


                   /* shorts "be a member" */
                  .ytReelChannelBarViewModelReelSponsorButton {display: none !important}

                  /* show full square profile pictures, full player and thumbnails*/
                  #ytd-player,
                  #player-container,
                  .style-scope.ytd-comment-view-model,
                  .ytThumbnailViewModelLarge,
                  .ytThumbnailViewModelMedium {border-radius:0px !important}


                  /* transparent top bar */
                  #background.ytd-masthead {background: transparent !important}
                  .ytSearchboxComponentInputBox:not(:hover),     .ytSearchboxComponentSearchButton:not(:hover)     {border-color: transparent !important; background-color: rgba(255,255,255,.3)}
                  .ytSearchboxComponentInputBoxDark:not(:hover), .ytSearchboxComponentSearchButtonDark:not(:hover) {border-color: transparent !important; background-color: rgba(0,0,0,.3)}


                  /* channel logo in player corner */
                  .ytp-button.branding-img-container {display:none !important}


    `);


};

//---------------------------------------------------------------------------------------------------------------------------
if (currentURL.startsWith("https://m.youtube.com")) {


    GM_addStyle(`


                    *, *:before, *:after {

                       animation:             none !important;
                       transition:            none !important;
                       perspective:           none !important;
                       backface-visibility: hidden !important;
                       will-change:           auto !important;
                       transform-style:       flat !important;
                       box-shadow:            none !important;
                       backdrop-filter:       none !important;

                    };


                    /* turn off text selection in player (double-tap forwarding video on Firefox Android does select text) */
                    #player-control-overlay {
                    -webkit-touch-callout: none;
                      -webkit-user-select: none;
                       -khtml-user-select: none;
                         -moz-user-select: none;
                          -ms-user-select: none;
                              user-select: none; }

                    /* make comment text selectable */
                    .comment-text.user-text {user-select: text !important}




                    /* search info-panel */
                    ytm-info-panel-container-renderer {display: none !important}





                    /* navbar*/
                    ytm-pivot-bar-renderer {height: fit-content !important}
                   .pivot-bar-item-title   {display:none !important}
                    ytm-pivot-bar-renderer {border:none !important}
                    .yt-spec-avatar-shape__button--button-extra-small {filter: grayscale(1)}



                   /* player */
                   ytm-custom-control .player-controls-top {opacity: .4 !important}
                   ytm-custom-control .player-controls-bottom .icon-button {opacity: .8 !important}
                   /* player paused overlay */
                   #player-control-overlay.fadein .player-controls-background {background: rgba(0,0,0,.2) !important}
                   /* player controls background */
                   ytm-custom-control .player-controls-middle .modern-tap-target-ui .icon-button {background-color: rgba(0,0,0,0.15) !important}

                   /* paid content disclaimer */
                   .ytmPaidContentOverlayHost {display: none !important}

                   /* hide autoplay toggle if not active */
                   .ytm-autonav-toggle-button-container[aria-pressed="false"] {opacity: 0 !important}

                   /* player tip scrubber popup */
                   .tooltip-wrapper {display: none !important}

                   /* make more space for the video content */
                   .player-controls-pb {left: 15px !important; right: 15px !important}
                   ytm-custom-control .player-controls-bottom {left: 0 !important; right: 0 !important}
                   ytm-custom-control .player-controls-top {top: -8px !important}


                  /* muted video popup */
                  .ytp-unmute-animated .ytp-unmute-icon {border-bottom: none !important;border-radius: 50px !important;background-color: rgba(255, 255, 255, 0.4) !important}
                  .ytp-unmute-shrink .ytp-unmute-text {opacity: 0 !important}
                  .ytp-unmute-shrink .ytp-unmute-box {width: 0 !important}


                  /* dark mode above videoplayer */
                  .mobile-topbar-header[data-mode="watch"] {background-color: rgba(0,0,0,1) !important}
                  /* Logo */
                  .mobile-topbar-header[data-mode="watch"] .mobile-topbar-logo:not(:hover) {opacity: 0 !important}
                  /* search button */
                  .mobile-topbar-header[data-mode="watch"] .mobile-topbar-header-content:not(:hover) {opacity: .2 !important}


                  /* Title under player */
                  .slim-video-information-content.slim-video-information-empty-badge {padding:0 !important}
                  /* padding uploader avatar and subscribe button */
                  ytm-slim-video-metadata-section-renderer ytm-slim-owner-renderer {padding-top: 0 !important;padding-bottom: 0 !important}
                  /*.slim-owner-profile-icon {margin-right: 2px !important}*/

                  /* action buttons spacing */
                  .yt-spec-button-shape-next--size-m {padding: 0 7px !important; height: 20px !important}
                  .yt-spec-button-shape-next--size-m:not(:hover) {background: transparent !important}
                  .slim-video-action-bar-actions > .slim_video_action_bar_renderer_button, .slim-video-action-bar-actions > yt-smartimation, .slim-video-action-bar-actions > ytm-account-link-button-renderer {margin-right: 5px !important}
                  /* downvotes arent shown anyway */
                  .yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-button.yt-spec-button-shape-next--segmented-end {width: min-content !important}
                  .slim-video-action-bar-actions {padding: 3px 3px !important}


                  /* additional info panel under player */
                  ytm-clarification-renderer.item {display: none !important}

                  /* chips bar under player */
                  ytm-chip-cloud-renderer.chip-bar {background-color: transparent !important; border: none !important}
                  ytm-item-section-renderer {border: none !important}


                  /* comments panel*/
                  .engagement-panel-section-list-header {border: none !important}
                  .engagement-panel-section-list-background.draggable {background:black !important}
                  ytm-engagement-panel-section-list-renderer .item {margin:0; padding:0 !important}
                  /* comment avatars */
                  ytm-comment-renderer .ytProfileIconHost {border-radius: 0 !important}
                  /* submit comment field */
                  ytm-comments-header-renderer {display: none !important}



                  /* Shorts */
                  .logo-in-player-endpoint {opacity: 0 !important}
                  .yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--overlay-dark.yt-spec-button-shape-next--size-l.yt-spec-button-shape-next--icon-button {background: none !important}
                  .yt-subscribe-button-view-model-wiz__container {display: none !important}



    `);
}