// ==UserScript==
// @name Youtube Material Compact
// @namespace userstyles.world/user/qiwichupa
// @version 20240223.18.05
// @description An attempt to restore compactness to a new Material Youtube
// @author qiwichupa
// @license No License
// @grant GM_addStyle
// @run-at document-start
// @match *://*.youtube.com/*
// @match https://www.youtube.com/watch?*
// @downloadURL https://update.greasyfork.org/scripts/422288/Youtube%20Material%20Compact.user.js
// @updateURL https://update.greasyfork.org/scripts/422288/Youtube%20Material%20Compact.meta.js
// ==/UserScript==

(function() {
let css = "";
if ((location.hostname === "youtube.com" || location.hostname.endsWith(".youtube.com"))) {
  css += `
  /* MAIN MENU */
      
      /* menu item box padding*/
          ytd-guide-entry-renderer {
              padding-bottom: 2px;
          }
          paper-item.ytd-guide-entry-renderer {
              padding-left: 4px;
              padding-right: 10px;
          }
          /* purchases counter padding */
              ytd-guide-entry-renderer[line-end-style=count] .guide-entry-count.ytd-guide-entry-renderer {
                  padding-right: 2px;
              }
      
      /* menu item box height */
          #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer {
              min-height: auto;
              height: 20px;
          }
      
      /* menu item box click shadow height */
  		tp-yt-paper-item.ytd-guide-entry-renderer {
              min-height: auto;
              height: 20px;
          }

      /* subscriptions icon size */
          yt-img-shadow.ytd-guide-entry-renderer > img.yt-img-shadow {
              height: 20px;
              width: 20px;
          }
     

      /* active menu entry */
          ytd-guide-entry-renderer[active] {
              background-color: rgba(255, 255, 255, 1);
          }
          ytd-guide-entry-renderer[active] .title.ytd-guide-entry-renderer {
              background-color: rgba(255, 0, 0, 0.9);
              color: white;
                 
          }

  `;
}
if (location.href.startsWith("https://www.youtube.com/watch?")) {
  css += `
  /* VIDEO PAGE */

      
      /* left block (player + description + comments) */
          div#primary.ytd-watch-flexy{
              padding-top: 5px!important;
          }

      /* right block (chat + suggests) */
          div#secondary.ytd-watch-flexy{
              padding-top: 5px!important;
          }

      /* DROPDOWN MENU */
          .item.yt-dropdown-menu{
              zoom:0.9;
          }

      /* UNDER VIDEO BLOCK */
          /* title */
              yt-formatted-string.super-title.ytd-video-primary-info-renderer{
                  font-size: 0.9rem;
              }
          /* channel name */
              ytd-video-owner-renderer {
                  zoom: 0.85;
              }
          /* video views */
              yt-view-count-renderer[small_]{
                  font-size: 1.2rem;
              }
          /* video date */
              div#date.ytd-video-primary-info-renderer {
                  font-size: 1.2rem;
              }
          /* "like", "dislike", "share", "add to" buttons */
              /* hide button names */

                 ytd-menu-renderer.style-scope.ytd-watch-metadata ytd-button-renderer  div.cbox.yt-spec-button-shape-next--button-text-content  {
                      display: none;
                  }

              /* buttons panel size */

                  div#menu{
                      zoom: 0.7;
                  }

          /* sponsor, analytics, subscribe  buttons */
              /* zoom */
  				#sponsor-button,
  				#analytics-button,
  				#subscribe-button {
                      zoom: 0.7;
                  }
          /* stat line*/
              div#info-container.style-scope.ytd-watch-metadata{
                  margin-bottom: 6px;
              }
          /* description block */
              div#description.item.style-scope.ytd-watch-metadata{
                  margin-top: 0px;
              }
          /* description top line space */
              #top-row.ytd-video-secondary-info-renderer{
                  padding-top: 5px;
                  margin-bottom: 2px
              }
          /* description bottom line space */
              ytd-video-secondary-info-renderer.style-scope.ytd-watch-flexy{
                  padding-bottom: 5px;
                  margin-bottom: 5px;
              }
          /* description text */
              .content.ytd-video-secondary-info-renderer{
                  font-size: 1.2rem;
                  line-height: 1rem;
              }
              ytd-text-inline-expander{
                  font-size: 1.2rem;
                  line-height: 1.6rem; 
              }
          /* info box (content name/other videos) */
              ytd-metadata-row-container-renderer{
                  zoom: 0.7;
              }
              #text-container.ytd-rich-metadata-renderer > div{
                  font-size: 1.8rem;
              }
          /* items */
              div#items{
                  zoom: 0.9;
              }
              ytd-horizontal-card-list-renderer.ytd-structured-description-content-renderer:not(:first-child), ytd-metadata-row-container-renderer.ytd-structured-description-content-renderer:not(:first-child), ytd-structured-description-content-renderer[inline-structured-description] ytd-horizontal-card-list-renderer.ytd-structured-description-content-renderer, ytd-structured-description-content-renderer[inline-structured-description] ytd-error-corrections-section-renderer.ytd-structured-description-content-renderer, ytd-structured-description-content-renderer[inline-structured-description] ytd-video-description-infocards-section-renderer.ytd-structured-description-content-renderer{
                  border-top: 1px solid var(--yt-spec-10-percent-layer)
              }

          /* collapse button */
              tp-yt-paper-button#collapse{
                  margin-top: 1rem;
              }
      /* COMMENTS BLOCK*/
          /* comment counter */
              .count-text.ytd-comments-header-renderer{
                  font-size:1.4rem;
              }
              #icon-label.yt-dropdown-menu{
                  font-size:1.2rem;
                  width: 20px;
                  height: 20px;
              }
          /*comment author*/
              #author-text.yt-simple-endpoint.ytd-comment-renderer{
                  color: #128ee9;
              }
          /* comment header spacing */
              ytd-comment-thread-renderer {
                  margin-bottom: 1rem
              }
              #header.ytd-comment-renderer,
              #author-text.yt-simple-endpoint.ytd-comment-renderer {
                  margin-bottom: 0
              }
          /* comment time */
              .published-time-text.ytd-comment-renderer{
                  font-size: 1.1rem;
              }
          /* comment text*/
              #content-text.ytd-comment-renderer{
                  font-size: 1.3rem;
              }

          /* expand button */
              ytd-button-renderer#more-replies  yt-formatted-string#text{
                  font-size: 1.2rem;
                  color: #128ee9;
              }

          /* like & dislike buttons */
              ytd-comment-action-buttons-renderer yt-icon-button.ytd-toggle-button-renderer {
                  height: 2rem;
                  padding: .1rem;
              }
          /* reply button */
  			div#footer  div#buttons{
  				zoom: 0.8;
  			}
              ytd-comment-action-buttons-renderer paper-button.ytd-button-renderer {
                  padding: .2rem;
                  font-size: 1.1rem;
              }
              #creator-heart-button.ytd-creator-heart-renderer {
                  height: 1.7rem
              }
              #hearted-thumbnail.ytd-creator-heart-renderer {
                  margin: .2rem
              }
              #unhearted.ytd-creator-heart-renderer {
                  padding: 0
              }

          /* 'save to playlist' menu */
              #playlists.ytd-add-to-playlist-renderer {
                  padding: 1rem
              }
              #playlists.ytd-add-to-playlist-renderer > *.ytd-add-to-playlist-renderer:not(:last-child) {
                  margin-bottom: 0
              }
      
      /* RIGHT BLOCK*/
          /* next header */
              #upnext.ytd-compact-autoplay-renderer{
                  font-size: 1.3rem;
              }
          /* autoplay button*/
              #autoplay.ytd-compact-autoplay-renderer{
                  font-size: 1.1rem;
              }

  `;
}
if ((location.hostname === "youtube.com" || location.hostname.endsWith(".youtube.com"))) {
  css += `
  /* LIVE CHAT */
      
      /* messages width */
          yt-live-chat-text-message-renderer {
              padding: 3px 2px;
          }
      /* move reaction button to top corner */
          yt-reaction-control-panel-overlay-view-model {
              flex-direction: column;
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
