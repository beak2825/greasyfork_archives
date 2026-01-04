// ==UserScript==
// @name Flickr -  No Sign In nag v.3
// @namespace flickr.com
// @version 3.0.1
// @description Flickr using at its maximum - Remove this damn  😈 "Sign up" modal
// @author decembre
// @license unlicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.flickr.com/*
// @match https://www.flickr.com/search/*
// @match https://www.flickr.com/search/?user_id=*
// @match https://www.flickr.com/search/?text=*
// @match https://www.flickr.com/search/people/?*
// @downloadURL https://update.greasyfork.org/scripts/531568/Flickr%20-%20%20No%20Sign%20In%20nag%20v3.user.js
// @updateURL https://update.greasyfork.org/scripts/531568/Flickr%20-%20%20No%20Sign%20In%20nag%20v3.meta.js
// ==/UserScript==

(function() {
let css = "";
if (location.href.startsWith("https://www.flickr.com/search/") || location.href.startsWith("https://www.flickr.com/search/?user_id=") || location.href.startsWith("https://www.flickr.com/search/?text=")) {
  css += `
  /* Flickr -  No Sign In nag v.3 - (STANDALONE) */

  /* PB REPORT:
  https://greasyfork.org/en/scripts/531568-flickr-no-sign-in-nag/discussions/298724
  ==== */

  /* READ:
  Is this new? Trying to browse without an account but getting prompts to sign in.
  https://www.reddit.com/r/flickr/comments/1jedi5b/is_this_new_trying_to_browse_without_an_account/
  Note:
  Pressing Esc seems to make it go away, but it only stays gone until you search for something else.
  === */

  /* (new2) SUPP NAG SCREEN */
  #stacking-overlay-container:has(.fluid-modal-overlay.blur-overlay) .fluid-modal-overlay.blur-overlay {
      display: none  !important;
      visibility: hidden !important;
      z-index: -1 !important;
  }
  #stacking-overlay-container:has(.fluid-modal-overlay.blur-overlay) .fluid-modal-overlay.blur-overlay +  .fluid-modal-view.blur-overlay {
      display: none  !important;
      visibility: hidden !important;
      z-index: -1 !important;
  }

  /* (new2) SUPP NAG SCREEN - RESTAUR SCROLLBAR */
  .fluid.html-search-photos-unified-page-view.scrolling-layout:has(.gn-signed-out):has(.fluid-modal-overlay.blur-overlay) {
      overflow: auto !important;
  }


  /* (new2) TOP SEARCH - DROPDOWN CONTENT MENU */
  .fluid.html-search-photos-unified-page-view:has(.gn-signed-out) #stacking-overlay-container:has(.fluid-modal-overlay.blur-overlay)  .fluid-selection-dropdown-container.open {
      display: inline-block  !important;
      z-index: 5000000 !important;
      visibility: visible !important;
  }

  /* (new2) not working - THUMBNAILS - PB WATCH FOR 3 DOTS MENU  */

  /*.fluid.html-search-photos-unified-page-view:has(.nav-ad-container) .photo-list-photo-interaction .extra-tool.more-menu {
      pointer-events: auto !important;
  border: 1px solid red !important;
  }*/


  /* (new2) not working - PB WATCH FOR FILTERS */

  /*.fluid.html-search-photos-unified-page-view:has(.nav-ad-container) .search-filter-tools-view {
      pointer-events: auto !important;
      outline: 1px solid aqua !important;
  }
  .fluid.html-search-photos-unified-page-view:has(.nav-ad-container) .search-filter-tools-view .dropdown-link p ,
  .fluid.html-search-photos-unified-page-view:has(.nav-ad-container) .search-filter-tools-view .dropdown-link span {

      pointer-events: auto !important;
  border: 1px solid yellow !important;
  }*/





  /* (new2) BONUS - TOP SEARCH WITH ADD */
  .fluid.html-search-photos-unified-page-view:has(.gn-signed-out) .nav-ad-container.desktop-nav-ad:has(a[href^="/account/upgrade/pro?"]) + .global-nav-view.desktop-nav-ad {
      height: 0 !important;
      margin: 0 !important;
  }
  .fluid.html-search-photos-unified-page-view:has(.gn-signed-out) .search-slender-advanced-panel-view.desktop-nav-ad {
      top: 0vh;
      margin: 0vh 0 0vh 0 !important;
  border-bottom: 1px solid silver  !important;
  }
  .fluid.html-search-photos-unified-page-view:has(.gn-signed-out):has(main.fluid-centered.advanced-panel-visible) .search-slender-advanced-panel-view.desktop-nav-ad {
      top: 0vh;
      margin: 0vh 0 0vh 0 !important;
  border-bottom: 1px solid red !important;
  }
  .fluid.html-search-photos-unified-page-view:has(.gn-signed-out) .global-nav-view.desktop-nav-ad .global-nav-content {
      margin-top: 18vh !important;
  }

  /* (new2) BONUS - TOP SEARCH WITH ADD - SEARCH ADVANCED - CLOSE */
  .fluid.html-search-photos-unified-page-view:has(.gn-signed-out):has(.nav-ad-container):not(:has(main.fluid-centered.advanced-panel-visible)) .global-nav-content.fluid.sohp-mobile-navable {
      position: fixed!important;
      height: 48px;
      width: 100%;
      left: 0;
      right: 0;
      top: 0 !important;
      margin: 0 !important;
      z-index: 5000000 !important;
  border: 1px solid red !important;
  }
  .fluid.html-search-photos-unified-page-view:has(.gn-signed-out):has(.nav-ad-container):has(:not(main.fluid-centered.advanced-panel-visible)) #search-unified-content .search-container-w-sidebar-content .main.search-photos-results {
      margin-top: 1vh !important;
      padding-top: 0;
  /*border: 1px solid green !important;*/
  }

  /* CLOSE  */
  .fluid.html-search-photos-unified-page-view:has(.gn-signed-out):has(.nav-ad-container) .search-container-w-sidebar .search-container-w-sidebar-content > .view[class*="view"]:not(.search-tools-view) + .main.search-photos-results .search-photos-everyone-view {
      margin-top: 7.2vh !important;
      padding-top: 0;
  /*border: 1px solid green !important;*/
  }
  /* OPEN  */
  .fluid.html-search-photos-unified-page-view:has(.gn-signed-out):has(.nav-ad-container):has(main.fluid-centered.advanced-panel-visible) .search-container-w-sidebar .search-container-w-sidebar-content > .view[class*="view"]:not(.search-tools-view) + .main.search-photos-results .search-photos-everyone-view {
      top: 8vh !important;
      margin-top: -2vh !important;
      padding-top: 0;
  /*border: 1px solid yellow !important;*/
  }

  /* (new2) BONUS - TOP SEARCH WITH ADD - SEARCH ADVANCED - OPEN */
  .fluid.html-search-photos-unified-page-view:has(.gn-signed-out):has(.nav-ad-container):has(main.fluid-centered.advanced-panel-visible) .global-nav-content.fluid.sohp-mobile-navable {
      position: fixed !important;
      height: 48px;
      width: 100%;
      left: 0;
      right: 0;
      top: 0 !important;
      margin-top: 0 !important;
      z-index: 5000 !important;
  border-bottom: 1px solid red !important;
  }
  .fluid.html-search-photos-unified-page-view:has(.gn-signed-out):has(.nav-ad-container):has(main.fluid-centered.advanced-panel-visible) .search-slender-advanced-panel-view.desktop-nav-ad {
      width: 100%;
      left: 0;
      right: 0;
      top: 0 !important;
      margin-top: 0 !important;
      z-index: 5000 !important;
  border-top: 1px dotted silver !important;
  border-bottom: 1px dotted silver !important;
  }
  .fluid.html-search-photos-unified-page-view:has(.gn-signed-out):has(.nav-ad-container):has(main.fluid-centered.advanced-panel-visible) .global-nav-view.desktop-nav-ad + .search-subnav-slender-view.desktop-nav-ad {
      top: 0 !important;
      margin-top: 4vh !important;
  /*border: 1px dotted peru !important;*/
  }

  .fluid.html-search-photos-unified-page-view:has(.gn-signed-out):has(.nav-ad-container):has(main.fluid-centered.advanced-panel-visible) .search-slender-advanced-panel-view.desktop-nav-ad .advanced-panel .advanced-options.fluid-centered{
    align-items: flex-start;
    display: flex;
    height: 70px !important;
    justify-content: space-between;
    transition: height .4s ease-in-out;
  } 
  .fluid.html-search-photos-unified-page-view:has(.gn-signed-out):has(.nav-ad-container) .search-slender-advanced-panel-view.desktop-nav-ad .advanced-panel .advanced-options.fluid-centered > div {
      margin-top: 0px;
  }


  /* (new2) RIGHT SIDEBAR  .sidebar-column-spacer + .sidebar-content-container*/
  .fluid.html-search-photos-unified-page-view:has(.gn-signed-out):has(.nav-ad-container) .sidebar-column {
      margin: 12.3vh 0 0 0 !important;
      top: 0 !important;
      padding-bottom: 20px;
      will-change: top,bottom;

  }
  /* OPEN */
  .fluid.html-search-photos-unified-page-view:has(.gn-signed-out):has(.nav-ad-container):has(main.fluid-centered.advanced-panel-visible) .sidebar-column {
      margin: 6.3vh 0 0 0 !important;
      top: 0 !important;
      padding-bottom: 20px;
      will-change: top,bottom;

  }

  .fluid.html-search-photos-unified-page-view:has(.gn-signed-out):has(.nav-ad-container) .search-container-w-sidebar .sidebar-column > .sidebar-content-container {
      position: sticky !important;
      top: 0vh !important;
      padding: 0 0 0 0 0 !important;
      will-change: top,bottom;
  /*border: 1px solid aqua !important;*/
  }


  /* (new2) THUMBNAILS CONTAINER * - ADD IN IT (better with my BigONE */

  .fluid.html-search-photos-unified-page-view:has(.gn-signed-out):has(.nav-ad-container) .photo-list-revenue-item-view {
      display: none  !important;
  }




  `;
}
if (location.href.startsWith("https://www.flickr.com/search/people/?")) {
  css += `
  /* Search People (new2) FOR NOT LOGGED USERS */

  /* (new2) BONUS - TOP SEARCH WITH ADD - SEARCH ADVANCED - CLOSE */
  .fluid.html-search-people-page-view:has(.gn-signed-out):has(.nav-ad-container) .global-nav-content.fluid.sohp-mobile-navable {
      position: fixed!important;
      height: 48px;
      width: 100%;
      left: 0;
      right: 0;
      top: 0 !important;
      margin: 0 !important;
      z-index: 5000 !important;
  border: 1px solid red !important;
  }
  .fluid.html-search-people-page-view:has(.gn-signed-out):has(.nav-ad-container) .search-subnav-slender-view.desktop-nav-ad {
      top: 5vh;
      margin: 0vh 0 0vh 0 !important;
  border-bottom: 1px solid red !important;
  }

  /*  SIDEBAR */
  .fluid.html-search-people-page-view:has(.gn-signed-out):has(.nav-ad-container) .sidebar-column {
      margin: 6vh 0 0 0 !important;
      top: 0 !important;
      padding-bottom: 20px;
      will-change: top,bottom;
  /*border: 1px solid red !important;*/
  }
  .fluid.html-search-people-page-view:has(.gn-signed-out):has(.nav-ad-container) .search-container-w-sidebar .sidebar-column > .sidebar-content-container {
      position: sticky;
      top: 12vh !important;
      padding-bottom: 20px;
      will-change: top,bottom;
  /*border: 1px solid red !important;*/
  }
  `;
}
if ((location.hostname === "flickr.com" || location.hostname.endsWith(".flickr.com"))) {
  css += `
  /* Indicators (new3) - Inactives Functions Helper - FOR NOT LOGGED USERS */

  .fluid.html-photo-page-scrappy-view:has(.gn-signed-out) body .photo-comments.with-emoji-picker .add-comment-section .add-comment-view .comment-area .text-area-section .comment-field.no-outline,
  .fluid.html-photo-page-scrappy-view:has(.gn-signed-out) body.flickrfixrwebextension .photo-comments.with-emoji-picker .add-comment-section .add-comment-view .comment-area .text-area-section .comment-field.no-outline ,


  .fluid.html-search-photos-unified-page-view:has(.gn-signed-out) .search-sort-menu-view .dropdown-link ,
  .fluid.html-search-photos-unified-page-view:has(.gn-signed-out) .search-filter-tools-view .dropdown-link ,
  .fluid.html-search-photos-unified-page-view:has(.gn-signed-out) .extra-tools .extra-tool.more-menu ,

  html:has(.gn-signed-out) .fave-view .fave-star, 
  html:has(.gn-signed-out) .fave-view .fave-star.animated ,
  html:has(.gn-signed-out) .engagement-item.fave.last, 
  html:has(.gn-signed-out) .engagement-item.fave.no-outline ,
  html:has(.gn-signed-out) .engagement-item.fave.no-outline .engagement-icon .animated-fave-star,
  html:has(.gn-signed-out) .engagement .engagement-item.fave span ,

  html:has(.gn-signed-out) a[href^="/mail/write/?"],
  html:has(.gn-signed-out) .action-button-text.follow ,
  html:has(.gn-signed-out) .archives-link.no-outline {
    cursor: not-allowed !important;
  }


  /* PHOTO PAGE - SIGN UP MODAL */
  .fluid.html-photo-page-scrappy-view:has(.gn-signed-out) #stacking-overlay-container:has(.signup-modal-view.flickr-view-root-view) .fluid-modal-overlay {
    display: none !important;
    z-index: 0 !important;
  }
  .fluid.html-photo-page-scrappy-view:has(.gn-signed-out) #stacking-overlay-container:has(.signup-modal-view.flickr-view-root-view) .fluid-modal-overlay + .signup-modal-view {
    display: none !important;
    z-index: 0 !important;
  }
  .fluid.html-photo-page-scrappy-view:has(.gn-signed-out) #stacking-overlay-container:has(.signup-modal-view.flickr-view-root-view) .fluid-modal-overlay + .signup-modal-view .modal.html-modal.signup-modal {
    display: none !important;
    z-index: 0 !important;
  }
  `;
}
if ((location.hostname === "flickr.com" || location.hostname.endsWith(".flickr.com"))) {
  css += `
  /* SUPP PUBS / PRO ETC.. -BONUS (new3) - SOME CLEANINGS - .*/
  .main.photo-page-sidebar:has(a[href^="https://www.istockphoto.com"]) ,
  .nav-ad-container.desktop-nav-ad ,
  .nav-ad-container.desktop-nav-ad:has(.moola-wrapper) ,
  html.fluid.html-search-photos-unified-page-view .upgrade-to-pro-cta a ,
  .fluid.html-search-photos-unified-page-view:has(.gn-signed-out):has(.nav-ad-container) .search-container-w-sidebar .search-container-w-sidebar-content > .view[class*="view"]:not(.search-tools-view) ,
  .nav-menu.wide-viewport-only .gn-get-pro ,
  .gn-get-pro ,
  .feed-b:has(.moola-wrapper) ,
  .nav-ad-container.desktop-nav-ad:has(a[href^="/account/upgrade/pro?"]) ,
  .nav-ad-container.desktop-nav-ad p:has(a[href^="/account/upgrade/pro?"]) ,
  .info-content-container .feed-rail-view .feed-rail .rail-item:has(a[href^="/account/upgrade/pro?"]) ,
  .featured-toast-view.activated ,
  .search-slender-advanced-panel-view.desktop-nav-ad + #search-unified-content .photo-page-sidebar {
      display: none  !important;
  }

  .nav-ad-container.desktop-nav-ad:has(.moola-wrapper) + .global-nav-view.desktop-nav-ad {
      margin-top: 0 !important
  }
  .nav-ad-container.desktop-nav-ad:has(.moola-wrapper) + .global-nav-view.desktop-nav-ad .global-nav-content.fluid.sohp-mobile-navable {
      height: 0 !important;
      margin-top: 0 !important;
  }

  /* (new3) */
  .nav-ad-container.desktop-nav-ad:has(.moola-wrapper) + .global-nav-view.desktop-nav-ad + .fluid-explore-subnav-view .subnav-content.fluid-centered {
      top: -5vh !important;
      margin: 0vh 0 0 0 !important;
  border: 1px solid aqua !important;
  }

  .nav-ad-container.desktop-nav-ad:has(.moola-wrapper) + .global-nav-view.desktop-nav-ad .global-nav-content.fluid.sohp-mobile-navable .global-nav-container {
      background: #111; 
  }

  /* (new3) */
  .nav-ad-container.desktop-nav-ad:has(.moola-wrapper) + .global-nav-view.desktop-nav-ad + .fluid-explore-subnav-view .fluid-subnav.fixed {
      position: fixed;
      top: 0vh !important;
      z-index: 82;
  }
  `;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
