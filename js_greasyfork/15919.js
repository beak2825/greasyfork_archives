// ==UserScript==
// @name         Men's Health Fixer
// @namespace    http://skoshy.com
// @version      0.4
// @description  Removes ad leftovers on Men's Health's websites. Best used with uBlock Origin.
// @author       Stefan Koshy
// @match        http*://*.menshealth.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/15919/Men%27s%20Health%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/15919/Men%27s%20Health%20Fixer.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

var id = 'mensHealthFixer';

var cleanupCSS = `
  #header.leader, #header.scrolling {
    top: 0 !important;
  }

  .pinit-btn-container {
    display: none !important;
  }
  
  .pinit:hover img {
    opacity: 1 !important;
  }

  .right_rail {
    display: none !important;
  }

  .article-section, .slideshow-section {
    width: 100% !important;
  }

  /* Fix huge images in articles with full-width */
  .slideshow .bx-wrapper img {
    width: auto !important;
    margin: 0 auto;
    max-width: 100%;
    max-height: 500px;
  }
`;

addGlobalStyle(cleanupCSS, id+"CleanupCSS");

// Fixes slideshows so that the ad doesn't show and it automatically goes to the next slide

(function() {
    var nextSlideFromAdButton = document.querySelector('.ad-prev');
    nextSlideFromAdButton.href = 'javascript:';

    setInterval(function() {
        eventFire(nextSlideFromAdButton, 'click');
    }, 1000);
})();




// *****************
// Utility Functions
// *****************

function addGlobalStyle(css, cssID) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.id = cssID;
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

// Used from http://stackoverflow.com/questions/2705583/simulate-click-javascript
function eventFire(el, etype){
    if (el.fireEvent) {
        (el.fireEvent('on' + etype));
    } else {
        var evObj = document.createEvent('Events');
        evObj.initEvent(etype, true, false);
        el.dispatchEvent(evObj);
    }
}