// ==UserScript==
// @name        PWAs Anywhere
// @namespace   https://www.octt.eu.org/
// @match       *://*/*
// @version     1.0.1
// @author      OctoSpacc
// @license     ISC
// @description Allow installing any webpage as a progressive web app
// @run-at      document-idle
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/490784/PWAs%20Anywhere.user.js
// @updateURL https://update.greasyfork.org/scripts/490784/PWAs%20Anywhere.meta.js
// ==/UserScript==

var originalManifest = document.querySelector('link[rel="manifest"]');

var menuEntries = {
  reinjectDefault : ['📜️ Reinject Default Manifest', reinjectOriginalManifest],
  injectCustom    : ['📃️ Force Inject Custom Manifest', removeManifestAndInjectCustom],
  reinjectCustom  : ['📃️ Force Reinject Custom Manifest', removeManifestAndInjectCustom],
  removeDefault   : ['🚮️ Remove Current Manifest (Default)', removeCurrentManifest],
  removeCustom    : ['🚮️ Remove Current Manifest (Custom)', removeCurrentManifest],
};

function clearMenu () {
  for (var entry of Object.values(menuEntries)) {
    GM_unregisterMenuCommand(entry[0]);
  }
}

function menuRegister (key) {
  var entry = menuEntries[key];
  GM_registerMenuCommand(entry[0], entry[1]);
}

function makeManifestElem (href) {
  var manifestElem = document.createElement('link');
  manifestElem.rel = 'manifest';
  manifestElem.href = href;
  return manifestElem;
}

function removeCurrentManifest () {
  var manifestElem = document.querySelector('link[rel="manifest"]');
  if (manifestElem) {
    manifestElem.parentElement.removeChild(manifestElem);
  }
  clearMenu();
  if (originalManifest) {
    menuRegister('reinjectDefault');
  }
  menuRegister('reinjectCustom');
}

function reinjectOriginalManifest () {
  document.head.appendChild(makeManifestElem(originalManifest));
  clearMenu();
  menuRegister('reinjectCustom');
  menuRegister('removeDefault');
}

function createAndInjectManifest (customIconUrl) {
  var descElem = document.querySelector('meta[name="description"]');
  var iconElem = (document.querySelector('link[rel~="apple-touch-icon"]') || document.querySelector('link[rel~="icon"]'));
  var manifestElem = makeManifestElem('data:application/manifest+json;utf8,' + encodeURIComponent(JSON.stringify({
    name: (document.title || location.href),
    description: (descElem && descElem.content),
    start_url: location.href,
    scope: location.href,
    display: "standalone",
    background_color: getComputedStyle(document.body).backgroundColor,
    lang: (document.documentElement.lang || undefined),
    icons: [
      {
        src: (customIconUrl || (iconElem && iconElem.href) || (location.href + '/favicon.ico')),
        // type: (iconElem ? (iconElem.type || 'image/png') : 'image/x-icon'),
        sizes: "any",
        purpose: "any",
      },
    ],
  })));
  document.head.appendChild(manifestElem);
  menuRegister('reinjectCustom');
  menuRegister('removeCustom');
}

function removeManifestAndInjectCustom () {
  removeCurrentManifest();
  createAndInjectManifest(prompt('Optional URL to custom icon (suggested: PNG >= 128x128)? (Will try to get one automatically if unspecified.)'));
}

if (originalManifest) {
  originalManifest = originalManifest.getAttribute('href');
  menuRegister('injectCustom');
  menuRegister('removeDefault');
} else {
  createAndInjectManifest();
}