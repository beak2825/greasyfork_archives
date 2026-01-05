// ==UserScript==
// @name         Nintendo Store Canada
// @namespace    https://greasyfork.org/users/649
// @version      1.0.3
// @description  Auto redirect nintendo store to canada store
// @author       Adrien Pyke
// @match        https://store.nintendo.com/ng3/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/25423/Nintendo%20Store%20Canada.user.js
// @updateURL https://update.greasyfork.org/scripts/25423/Nintendo%20Store%20Canada.meta.js
// ==/UserScript==

(() => {
  'use strict';

  if (!location.href.match(/\/ca\//iu)) {
    if (location.href.match(/\/us\//iu)) {
      location.replace(location.href.replace(/\/us\//iu, '/ca/'));
    } else {
      location.replace(location.href.replace(/\/ng3/iu, '/ng3/ca/po'));
    }
  }
})();
