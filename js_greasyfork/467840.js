// ==UserScript==
// @name         No more youtube shorts
// @version      1.0
// @namespace    https://gist.github.com/gursantsingh/99c476857e3f8ccb941c4c45390d9e89
// @description  Remove youtube shorts Links, Videos and Feeds
// @author       kgursant
// @match        https://*.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467840/No%20more%20youtube%20shorts.user.js
// @updateURL https://update.greasyfork.org/scripts/467840/No%20more%20youtube%20shorts.meta.js
// ==/UserScript==

window.addEventListener(
  "load",
  function () {
    (function () {
      "use strict";

      function removeShortsLinks() {
        var count = 0;
        //Remove Shorts Link
        document.querySelectorAll('a[title="Shorts"]').forEach((t) => {
          const elem = t.closest("ytd-guide-entry-renderer");
          if (elem) {
            elem.remove();
            count++;
          }
        });
        if (count) console.log("Removed " + count + " shorts-Links");
      }

      function removeShortsVideos() {
        //Remove Shorts in search
        var count = 0;
        document.querySelectorAll('a[href^="/shorts/"]').forEach((t) => {
          const elem = t.closest("ytd-video-renderer");
          if (elem) {
            elem.remove();
          }
        });
        if (count) console.log("Removed " + count + " shorts-Videos");
      }

      //Remove shorts feed
      function removeShortsFeed() {
        let count = 0;

        document
          .querySelectorAll(
            'ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]'
          )
          .forEach((t) => {
            if (t) {
              count++;
              const elem = t.closest("ytd-grid-video-renderer");

              if (elem) {
                elem.remove();
              }
            }
          });

        if (count) {
          console.log("Removed " + count + " shorts");
        }
      }
      //Remove shorts link when collapsed
      function removeShortsButton() {
        var count = 0;
        //Remove Shorts Button
        document.querySelectorAll('a[title="Shorts"]').forEach((t) => {
          const elem = t.closest("ytd-mini-guide-entry-renderer");
          if (elem) {
            elem.remove();
            count++;
          }
        });
        if (count) console.log("Removed " + count + " shorts-Links");
      }
      function removeShortsShelf() {
        var count = 0;
        //Remove Shorts Shelf
        document
          .querySelectorAll("ytd-rich-grid-slim-media[is-short]")
          .forEach((t) => {
            const elem = t.closest("ytd-rich-shelf-renderer");
            if (elem) {
              elem.remove();
              count++;
            }
          });
        if (count) console.log("Removed " + count + " shorts-Shelfs");
      }
      //Remove shorts shelf in /watch?v=* urls
      function removeShortsSection() {
        var count = 0;
        //Remove Shorts Shelf
        document
          .querySelectorAll(
            'yt-horizontal-list-renderer[class="style-scope ytd-reel-shelf-renderer"]'
          )
          .forEach((t) => {
            const elem = t.closest("ytd-reel-shelf-renderer");
            if (elem) {
              elem.remove();
              count++;
            }
          });
        if (count) console.log("Removed " + count + " shorts-Sections");
      }
      //Redirect /shorts/* urls to /watch?v=*
      function redirectToWatch() {
        if (window.location.href.indexOf("youtube.com/shorts") > -1) {
          window.location.replace(
            window.location.toString().replace("/shorts/", "/watch?v=")
          );
        }
      }
      function removeShorts() {
        removeShortsLinks();
        removeShortsVideos();
        removeShortsFeed();
        removeShortsButton();
        removeShortsShelf();
        removeShortsSection();
        redirectToWatch();
      }

      const observer = new MutationObserver(removeShorts);
      observer.observe(document.querySelector("#page-manager"), {
        childList: true,
        subtree: true,
      });
    })();
  },
  false
);