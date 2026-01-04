// ==UserScript==
// @name         MAM User Page Re-title
// @namespace    yyyzzz999
// @author       yyyzzz999
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Re-title MAM user tabs to make it easier to distinguish them from others
// @icon         https://cdn.myanonamouse.net/imagebucket/164109/UserIcon64.png
// @match        https://www.myanonamouse.net/u/*
// @supportURL   https://greasyfork.org/en/scripts/418820-mam-user-page-re-title/feedback
// @homepage     https://greasyfork.org/en/users/705546-yyyzzz999
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418820/MAM%20User%20Page%20Re-title.user.js
// @updateURL https://update.greasyfork.org/scripts/418820/MAM%20User%20Page%20Re-title.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (document.title == "My Anonamouse") {
      document.title=parseInt(window.location.href.match(/\d+$/)[0], 10); // show other_userid if no name
    } else {
      document.title=document.title.replace('Details for ', ''); // Chop characters that are usually the same
    }
})();