// ==UserScript==
// @name           Enable User Scalability
// @namespace      http://example.com
// @description    Enables user scalability on web pages by setting user-scalable to yes
// @version        0.1
// @license        MIT
// @include        *
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/471920/Enable%20User%20Scalability.user.js
// @updateURL https://update.greasyfork.org/scripts/471920/Enable%20User%20Scalability.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var metaTag = document.querySelector('meta[name="viewport"]');
  if (metaTag) {
    metaTag.setAttribute('content', 'width=device-width, initial-scale=1, user-scalable=yes, maximum-scale=10');
  }
})();
