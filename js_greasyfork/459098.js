// ==UserScript==
// @name         AmiAmi-More
// @license      MIT
// @version      0.1
// @author       IxianNavigator
// @match        https://*.amiami.com/*
// @description  Changes the result count on AmiAmi
// @grant        none
// @run-at       document-end
// @icon         https://icons.duckduckgo.com/ip2/amiami.com.ico
// @namespace https://greasyfork.org/users/746566
// @downloadURL https://update.greasyfork.org/scripts/459098/AmiAmi-More.user.js
// @updateURL https://update.greasyfork.org/scripts/459098/AmiAmi-More.meta.js
// ==/UserScript==

(function() {
  'use strict';
  if (document.location.host === 'secure.amiami.com') {
    return;
  }

  Object.assign(XMLHttpRequest.prototype, {
    realOpen: XMLHttpRequest.prototype.open,
    open: function(method, url, ...args) {
      url = url.replace("pagemax=20", "pagemax=50");
      return this.realOpen(method, url, ...args);
    },
  });

})();