// ==UserScript==
// @name         jav.guru enhancer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       Raizer
// @description This script enhance the video page to display it full width.
// @match        https://jav.guru/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453030/javguru%20enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/453030/javguru%20enhancer.meta.js
// ==/UserScript==

(function() {
'use strict';
document.getElementById("primary").classList.remove('content-area');
document.getElementsByClassName("large-screenshot")[0].style.maxHeight = "100%";
document.getElementsByClassName("widget-area sidebar is-right-sidebar")[0].style.display = "none";
})();