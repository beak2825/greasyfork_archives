// ==UserScript==
// @name         Github PR name formatting.
// @namespace    https://central.tri.be/
// @version      0.1
// @description  Format Github PR Links same as Github does.
// @author       Crisoforo Gaspar Hernandez
// @match        https://central.tri.be/issues/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391263/Github%20PR%20name%20formatting.user.js
// @updateURL https://update.greasyfork.org/scripts/391263/Github%20PR%20name%20formatting.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var links = Array.prototype.slice.call( document.querySelectorAll('.linkified') );

  links.forEach(function(node) {
    node.innerText = node.innerText.replace('https://github.com/moderntribe/', '').replace('/pull/', '#');
  });

})();