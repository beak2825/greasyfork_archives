// ==UserScript==
// @name         Sys Scum
// @namespace    8ch.net
// @version      0.1
// @description  just sys my shit up fam
// @author       You
// @match        http://8ch.net/*
// @match        https://8ch.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24142/Sys%20Scum.user.js
// @updateURL https://update.greasyfork.org/scripts/24142/Sys%20Scum.meta.js
// ==/UserScript==

(function() {
    'use strict';
if (document.body.innerText !== "e0001")
  return;

document.location = "https://sys.8ch.net"+document.location.pathname;

})();