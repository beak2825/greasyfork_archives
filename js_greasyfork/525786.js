// ==UserScript==
// @name         Generals Custom Map Fix
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  Rapes fucking matt and his family
// @author       SaveGeneralsIO <save_generalsio@yopmail.net>
// @match        https://generals.io/maps/*
// @grant        none
// @license      WTFPL
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/525786/Generals%20Custom%20Map%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/525786/Generals%20Custom%20Map%20Fix.meta.js
// ==/UserScript==

(function() {
  "use strict";

  const original = "/maps/";
  const hack = "/maps/profiles/";

  // /map/map-name

  if (!location.pathname.startsWith(hack)) {
    location.pathname = hack + location.pathname.substring(original.length);
  }

  // /map/profiles/map-name

  const originalOpen = XMLHttpRequest.prototype.open;

  XMLHttpRequest.prototype.open = function(method, url) {
    const modifiedUrl = url.replace("?name=profiles%2F", "?name=");
    originalOpen.apply(this, [method, modifiedUrl]);
  };
})();
