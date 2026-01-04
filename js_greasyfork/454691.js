// ==UserScript==
// @name      PWA Everything
// @author    FlechazoPh    GitHub@FlechazoPh https://github.com/FlechazoPh/PWAEverthing
// @version   1.0.1
// @match     *://*/*
// @grant     none
// @run-at    document-idle
// @noframes
// @license MIT
// @description     一键网页支持PWA插件
// @namespace https://greasyfork.org/users/982390
// @downloadURL https://update.greasyfork.org/scripts/454691/PWA%20Everything.user.js
// @updateURL https://update.greasyfork.org/scripts/454691/PWA%20Everything.meta.js
// ==/UserScript==

let webManifest = {
  "name": "",
  "short_name": "",
  "theme_color": "#ff0000",
  "background_color": "#ff0000",
  "display": "standalone"
};

let manifestElem = document.createElement('link');
manifestElem.setAttribute('rel', 'manifest');
manifestElem.setAttribute('href', 'data:application/manifest+json;base64,' + btoa(JSON.stringify(webManifest)));
document.head.prepend(manifestElem);