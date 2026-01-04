// ==UserScript==
// @name        AWBW Sight Sparing Recolourer
// @namespace   http://tampermonkey.net/
// @version     0.1
// @description Replaces most high brightness colours with less bright colours, and replaces the background image with a solid dark colour.
// @author      LLM outputs used and tweaked by PathForger
// @match       https://awbw.amarriner.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/525579/AWBW%20Sight%20Sparing%20Recolourer.user.js
// @updateURL https://update.greasyfork.org/scripts/525579/AWBW%20Sight%20Sparing%20Recolourer.meta.js
// ==/UserScript==

// This is not going to be the cleanest script you've ever seen. Plus some inline elements are harder to interact with - so you'll still see some white. Still, should be an improvement for the eyes, overall.

function styleElements() {
  // Define color variables - names based on elements being modified. Changing these hexadecimaal values should be enough for recolour tweaking purposes.
  const borderWhiteColor = '#d7d7c0';
  const bodyBackgroundColor = '#EEEEE0';
  const bodysideBackgroundColor = '#E7E7D0';
  const leftmenuBackGroundColor = '#E7E7D0';

  $('body').css({
  'background-image': 'linear-gradient(to bottom, #222211 100%, Transparent 50%), url("../terrain/macroland250.png")'
  });

  // Style table cells with 'borderwhite' class
  $('td.borderwhite').css({
    'background-color': borderWhiteColor,
    'color': 'black', // optional - change if necessary
  });

  (function() {
  $('div#left-side-menu-container').css({ 'background': leftmenuBackGroundColor });
  })();

  (function() {
  $('div#outer').css({ 'background': bodysideBackgroundColor });
  })();

  // Style page background
  $('body').css('background-color', bodyBackgroundColor);
}

// Run the function once when script is loaded
styleElements();

// Run the function whenever a page is loaded
document.addEventListener('DOMContentLoaded', styleElements);


