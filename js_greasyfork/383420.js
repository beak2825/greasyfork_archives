// ==UserScript==
// @name         YouTube Uploads Sorter Button
// @namespace    http://tampermonkey.net/
// @version      0.16.0
// @description  Adds a button to a YouTube channel's videos page which sorts recent uploads by views
// @author       Lex
// @match        *://*.youtube.com/@*
// @match        *://*.youtube.com/*/featured
// @match        *://*.youtube.com/*/videos
// @exclude-match *://*.youtube.com/watch
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383420/YouTube%20Uploads%20Sorter%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/383420/YouTube%20Uploads%20Sorter%20Button.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    function addButton() {
        if (!document.getElementById("sortViewButton")) {
            const chip = document.createElement("button")
            chip.id = "sortViewButton"
            chip.addEventListener("click", sortByViews)
            Object.assign(chip.style, {border: "none", borderRadius: "8px", padding: "8px 15px", marginLeft: "1em", cursor: "pointer"})
            const container = document.querySelector("#chips-wrapper iron-selector")
            container.append(chip)
            chip.textContent = "Sort by Views"
        }
    }

    function parseViewNumber(str) {
      /* Parses 405K, 1.5M etc */
      let multiplier = 1;
      if (str.endsWith("K")) {
        multiplier = 1000;
      } else if (str.endsWith("M")) {
        multiplier = 1000000;
      }
      return parseFloat(str) * multiplier;
    }

    function getViewsShort(e) {
      // viewsText = "405K views"
      const viewsText = e.querySelector(".inline-metadata-item").textContent;
      const viewsStr = viewsText.split(" ")[0];
      return parseViewNumber(viewsStr);
    }

    function getViewsVideo(e) {
      const viewsTitle = e.querySelector('a#video-title-link').getAttribute("aria-label");
      //console.log(`Found title: ${viewsTitle}`);
      if (viewsTitle.search(/No views$/) > -1) // video has no views yet
          return 0;
      else {
          const views = parseInt(/([\d,]+) views( - play Short)?$/.exec(viewsTitle)[1].replace(/,/g, ""));
          return views;
      }
    }

    function getViews(e) {
        // Try to get the views of a regular video, and if that fails try to get views as a Short
        try {
          return getViewsVideo(e);
        } catch(err) {
          try {
            return getViewsShort(e);
          } catch(err) {
            return 0;
          }
        }
    }

    function sortByViews() {
        console.log("Sorting...");
        const items = document.querySelectorAll("ytd-rich-item-renderer");
        console.log(`Found ${items.length} videos on the page.`);
        //console.log(items);
        //console.log(getViews(items[0]));

        // Array of each parent for a given index.
        // e.g. if there are 4 videos in the first row container, the first 4 indexes are that first row
        const parents = [...items].map(e => e.parentNode);
        //console.log(parents);
        const sorted = [...items].sort(function(a, b) {
            return getViews(b) - getViews(a);
        });
        const infiniteScrollItem = document.getElementsByTagName("ytd-continuation-item-renderer")[0]
        if (infiniteScrollItem)
          infiniteScrollItem.parentNode.removeChild(infiniteScrollItem)
        for (let item of sorted) {
          // Remove item from its parent and append it to the ordered parent
          const parent = parents.shift();
          //console.log("Parent: ", parent);
          //console.log("Removing", item, "from its parent");
          item.parentNode.removeChild(item);
          parent.append(item);
        }
        if (infiniteScrollItem)
          sorted[sorted.length - 1].parentNode.append(infiniteScrollItem)
    }

    function waitForLoad(query, callback) {
        if (document.querySelector(query)) {
            callback();
        } else {
            setTimeout(waitForLoad.bind(null, query, callback), 100);
        }
    }

    waitForLoad("#chips-wrapper", addButton);
})();
