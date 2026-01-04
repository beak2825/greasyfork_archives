// ==UserScript==
// @name        Bunpro Custom Layout For Vocab Reading Reviews
// @namespace   bunpro-custom-layout-vocab-reading
// @match       https://bunpro.jp/*
// @grant       none
// @version     1.8
// @author      -
// @description 11/28/2024, 6:43:44 AM
// @run-at      document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/518788/Bunpro%20Custom%20Layout%20For%20Vocab%20Reading%20Reviews.user.js
// @updateURL https://update.greasyfork.org/scripts/518788/Bunpro%20Custom%20Layout%20For%20Vocab%20Reading%20Reviews.meta.js
// ==/UserScript==

(function() {
  'use strict';
  // Handle navigation to this page
  window.onload = observeUrlChange(setup);

  // Handle direct loading of the page
  setup();
})();


// Logging functions - Just comment out the console.debug, etc if you don't want to log
function debug(input) {
  // console.debug(input);
}

function info(input) {
  console.info(input);
}

function warn(input) {
  console.warn(input);
}

function observeUrlChange(onChange) {
  // Whole purpose of this function is to run setup() when we navigate to the review page
  let oldHref = document.location.href;
  const body = document.querySelector("body");
  const observer = new MutationObserver(mutations => {
    mutations.forEach(() => {
      if (oldHref !== document.location.href && document.location.href.toLowerCase().startsWith("https://bunpro.jp/reviews")) {
        oldHref = document.location.href;
        onChange();
      }
    });
  });
  observer.observe(body, {
    childList: true,
    subtree: true
  });
}

function setup() {
  warn("Setup called for bunpro-custom-layout-vocab-reading");

  // Setup an observer to determine whether the english sentence is hidden
  const body = document.querySelector("body");
  const observer = new MutationObserver(() => {
    debug("Changed");

    // Look for page elements
    // const metadata = document.querySelector("#quiz-metadata-element");
    const engSentenceDivs = document.querySelectorAll("#js-tour-quiz-question > div.bp-quiz-trans-wrap > div");
    const displayLocation = document.querySelector("#js-tour-quiz-question");

    // Return immediately if we can't find our elements
    if (engSentenceDivs == null || displayLocation == null) {
      debug(`engSentenceDivs: ${engSentenceDivs}\ndisplayLocation: ${displayLocation}`)
      return;
    }

    // Make sure that we are doing vocab reviews in reading mode
    if (!document.location.href.includes("reviews?only_review=vocab")) {
      return;
    }

    // Decide whether the english sentence is visible or not
    let visible = false;
    for (const engSentenceDiv of engSentenceDivs) {
      if (!engSentenceDiv.className.includes("invisible")) {
        visible = true;
        break;
      }
    }

    // Do something if the english sentence is visible/invisible
    if (visible) {
      debug("Visible!");
      // Copy the definition and pitch to the area above the good/hard buttons
      if (document.querySelector("#bunpro-custom-layout-vocab-reading") != null) {
        debug("Already created #bunpro-custom-layout-vocab-reading. Ignoring.")
        return;
      }

      const pitchAccent = document.querySelector("#js-tour-learn-details > ul > li:nth-child(1) > div > ul");
      const vocabInfo = document.querySelector("#js-rev-header > div.flex.items-start.justify-between > div > div > p.text-primary-contrast.md\\:text-primary-fg");
      const dictionaryInfo = document.querySelector("#js-struct-details > section")

      // Make sure we have at least the dictonary info
      if (dictionaryInfo == null) {
        return
      }

      debug(`pitchAccent: ${pitchAccent}\nvocabInfo:${vocabInfo}\ndictionaryInfo:${dictionaryInfo}`);

      // Create a new div and store everything in it
      var divCustom = document.createElement("div");
      divCustom.id = "bunpro-custom-layout-vocab-reading";
      divCustom.className = "flex flex-col md:flex-row md:gap-16 lg:flex-col xl:flex-row";
      divCustom.style = "scroll-margin-top: calc(53px + 2.5rem)";

      // Create a "box" to store the pitch and Noun Info
      var section = document.createElement("section");
      section.className = "border-b p-24 md:rounded md:border border-rim bg-secondary-bg flex-1";
      if (pitchAccent != null) {
        section.appendChild(pitchAccent.cloneNode(true));
      }
      if (vocabInfo != null) {
        section.appendChild(vocabInfo.cloneNode(true));
      }
      divCustom.appendChild(section);

      // Add the dictionaryInfo Box
      divCustom.appendChild(dictionaryInfo.cloneNode(true));

      // Add the entire div to the display
      displayLocation.insertAdjacentElement('afterend', divCustom);
    } else {
      debug("Not Visible!");
      // showFuriganaOnReview(false);
      // Clean Up - Remove objects that we added
      const itemAdded = document.querySelector("#bunpro-custom-layout-vocab-reading");
      if (itemAdded != null) {
        itemAdded.remove();
      }
    }
  });
  observer.observe(body, {
    childList: true,
    subtree: true
  });
}