// ==UserScript==
// @name         Temporary fixes Material icons are not visible on Chrome
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Temporary fixes Material icons are not visible on Chrome. kubernetes, Dashboard, Material icons
// @description  https://github.com/kubernetes/dashboard/issues/3144#issuecomment-518936677
// @description  https://bugs.chromium.org/p/chromium/issues/detail?id=627143
// @homepage https://greasyfork.org/en/scripts/388258
// @author       chaosky
// @match        http://localhost:8001/api/v1/namespaces/kube-system/services/*
// @grant        GM_log
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/388258/Temporary%20fixes%20Material%20icons%20are%20not%20visible%20on%20Chrome.user.js
// @updateURL https://update.greasyfork.org/scripts/388258/Temporary%20fixes%20Material%20icons%20are%20not%20visible%20on%20Chrome.meta.js
// ==/UserScript==
/*jshint multistr: true */

(function() {
    'use strict';

    GM_addStyle(`
@font-face {
  font-family: 'Material Icons';
  font-style: normal;
  font-weight: 400;
  src: url(MaterialIcons-Regular.eot); /* For IE6-8 */
  src:
       url(static/MaterialIcons-Regular.woff2) format('woff2'),
       url(static/MaterialIcons-Regular.woff) format('woff'),
       url(static/MaterialIcons-Regular.ttf) format('truetype');
}
`);
})();