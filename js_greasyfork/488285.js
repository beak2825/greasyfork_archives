// ==UserScript==
// @name        Wageningse Overhaul
// @namespace   https://tampermonkey.net/
// @version     0.1
// @description Changes the header logo, page width, and paragraph width of a website
// @author      You
// @match       https://wageningse-methode.nl/*
// @match       http://wm.math4allview.appspot.com/*
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/488285/Wageningse%20Overhaul.user.js
// @updateURL https://update.greasyfork.org/scripts/488285/Wageningse%20Overhaul.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function removeElement() {
    const targetElement = document.getElementById("vo-content-logo-container");
    if (targetElement) {
      targetElement.parentNode.removeChild(targetElement);
    }
  }

  const bodyStyles = `
  body{
  color: #000;
  background-color: #6f6f6f;
  }
  `;

  const marginStyles = `
  .margin-left-1{
  background-color: #006d6f;}

  .exercise .exercise-heading{
  background-color: #00201f;
  }
  `;

  // Define the styles for the logo class
  const logoStyles = `
    .logo {
      background-image: url("https://pbs.twimg.com/profile_images/1205101554317037568/8L5tWh1r_400x400.jpg") !important;
      height: 170px;
    }

    .logo-header-div{
      background-image: url('https://i.imgur.com/1YCG71o.png');
    }
  `;

  // Define the styles for the pageDiv class
  const pageDivStyles = `
    .pageDiv {
      width: calc(100vw - 200px);
    }


  `;

  // Define the styles for various paragraph classes
  const paragraphStyles = `
    .theory p,
    .theory-important p,
    .intermezzo p,
    .example p,
    .remark p,
    .exercise p,
    .summary p {
      width: calc(100vw - 300px);
    }
  `;

    // Define the styles for menuDiv
const menuDivStyles = `
  .menuDiv {
    position: fixed; /* Make menuDiv fixed relative to viewport */
    top: 5px; /* Maintain the top position */
    right: 0; /* Position it at the right edge of the window */
  }

  .menuDiv-inner {
    position: inherit; /* Inherit position from parent */
    right: 8px; /* Adjust position relative to parent */
    left: unset;
  }
`;

    const headingDivStyles = `
    .headingDiv {
      width: calc(100vw - 200px);
    }
    .container_12 .grid_6 {
    width: unset;
}
  `;

    window.addEventListener("load", removeElement);

  // Inject the CSS rules into the page
  GM_addStyle(logoStyles);
  GM_addStyle(pageDivStyles);
  GM_addStyle(paragraphStyles);
  GM_addStyle(menuDivStyles);
  GM_addStyle(headingDivStyles);
  GM_addStyle(bodyStyles);
  GM_addStyle(marginStyles);
})();
