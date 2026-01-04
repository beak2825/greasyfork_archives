// ==UserScript==
// @name         Dwitter Tweaks
// @namespace    https://greasyfork.org/en/users/8615-joeytwiddle
// @version      0.1.4
// @description  Tweak Dwitter with extreme dark theme
// @author       joeytwiddle
// @license      ISC
// @match        https://beta.dwitter.net/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/403741/Dwitter%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/403741/Dwitter%20Tweaks.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // In theory I like the dark background.
  // But in practice is causes my retinas to open, which then get overwhelmed by the bright white of the default canvas!
  // So a somewhat lighter dark theme can help to keep my eyes prepared.

  const hue = 210;
  const sat = 30;

  // 6, 11, 8
  // 9, 13, 11
  // 13, 19, 11

  GM_addStyle(`
    /*
    :root {
      --pageBackgroundColor: #0b0b0b;
      --mainBackgroundColor: #1b1b1b;
    }
    */
    .App {
      background: hsl(${hue}, ${sat}%, 11%) !important;
    }
    .App > header, .card {
      background: hsl(${hue}, ${sat}%, 20%);
    }
    /* Code textarea */
    .card .mb-3+div,
    input.form-control, input.form-control[readonly],
    /* "Theme challenge of the month" */
    .card.text-center.mb-3.px-3 > div {
      background: hsl(${hue}, ${sat}%, 15%) !important;
    }
    input.form-control, input.form-control[readonly] {
      border: 0;
    }
    /* Inside the comment box, use a nice dull blue for the button */
    .card > form > div > div > .btn-secondary,
    .card > form > div > div > .btn-secondary.disabled,
    .card > form > div > div > .btn-secondary:disabled,
    .card > form > div > div > .btn-primary,
    .card > form > div > div > .btn-primary.disabled,
    .card > form > div > div > .btn-primary:disabled,
    /* And also for the awesomed Awesome button */
    .btn-primary {
      background-color: hsl(211, 70%, 24%);
      border-color: hsl(211, 70%, 24%);
    }
    .shadow-primary {
      box-shadow: none !important;
    }
  `);
})();
