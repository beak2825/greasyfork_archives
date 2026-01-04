// ==UserScript==
// @name         Force Select
// @version      1.0
// @description  Stop sites from disabling selection of text
// @author       You
// @match        https://cds.edisonlearning.com/lessons/*
// @grant        none
// @namespace https://greasyfork.org/users/1079729
// @downloadURL https://update.greasyfork.org/scripts/466375/Force%20Select.user.js
// @updateURL https://update.greasyfork.org/scripts/466375/Force%20Select.meta.js
// ==/UserScript==

(function() {
  'use strict';

  let style = document.createElement('style');
  style.innerHTML = '*{ user-select: auto !important; }';

  document.body.appendChild(style);
})();