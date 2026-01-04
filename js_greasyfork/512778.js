// ==UserScript==
// @name        PWAs anywhere mod without options
// @match       *://*/*
// @version     1.0.1
// @author      OctoSpacc
// @license     ISC
// @description Allow installing any webpage as a progressive web app
// @run-at      document-idle
// @namespace https://greasyfork.org/users/1381439
// @downloadURL https://update.greasyfork.org/scripts/512778/PWAs%20anywhere%20mod%20without%20options.user.js
// @updateURL https://update.greasyfork.org/scripts/512778/PWAs%20anywhere%20mod%20without%20options.meta.js
// ==/UserScript==

var originalManifest = document.querySelector('link[rel="manifest"]');

function makeManifestElem(href) {
 var manifestElem = document.createElement('link');
 manifestElem.rel = 'manifest';
 manifestElem.href = href;
 return manifestElem;
}

function removeCurrentManifest() {
 var manifestElem = document.querySelector('link[rel="manifest"]');
 if (manifestElem) {
  manifestElem.parentElement.removeChild(manifestElem);
 }
}

function createAndInjectManifest() {
 var iconElem = (document.querySelector('link[rel~="apple-touch-icon"]') || document.querySelector('link[rel~="icon"]'));
 var manifestElem = makeManifestElem('data:application/manifest+json;utf8,' + encodeURIComponent(JSON.stringify({
  name: (document.title || location.href),
  start_url: location.href,
  scope: (location.protocol + '//' + location.hostname + '/'),
  display: "standalone",
  background_color: (getComputedStyle(document.body).backgroundColor || '#000000'),
  theme_color: '#000000',
  icons: [{
   src: ((iconElem && iconElem.href) || (location.href + '/favicon.ico')),
   sizes: "any",
   purpose: "any",
  }, ],
 })));
 document.head.appendChild(manifestElem);
}

if (originalManifest) {
 removeCurrentManifest();
 createAndInjectManifest();
} else {
 createAndInjectManifest();
}