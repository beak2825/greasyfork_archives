// ==UserScript==
// @name         Auto scroll to button in elsfile
// @namespace    https://greasyfork.org/en/users/158832
// @version      0.1
// @description  Auto scroll to button in elsfile.
// @author       Riztard
// @match        *elsfile.org/*
// @include      *elsfile.org/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/390849/Auto%20scroll%20to%20button%20in%20elsfile.user.js
// @updateURL https://update.greasyfork.org/scripts/390849/Auto%20scroll%20to%20button%20in%20elsfile.meta.js
// ==/UserScript==

setTimeout(function () {
  $('html,body').animate({
    scrollTop: document.body.scrollHeight
  }, "fast");

}, 500); 
