// ==UserScript==
// @name         WME Mini ScrollBar
// @name:fr      WME Mini ScrollBar
// @namespace    https://greasyfork.org/fr/users/150543
// @version      0.0.1
// @description:fr Réduit l'épaisseur de la barre de défilement dans WME (Seulement sur Chrome)
// @description  Reduces the thickness of the scroll bar. (Only Chrome)
// @include     https://*.waze.com/*editor*
// @include     https://www.waze.com/editor*
// @include     https://www.waze.com/*/editor*
// @include     https://beta.waze.com/*/editor*
// @include     https://beta.waze.com/*/editor*
// @exclude     https://*.waze.com/user/*
// @exclude     https://*.waze.com/*/user/*
// @run-at      document-start
// @compatible  chrome
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/37572/WME%20Mini%20ScrollBar.user.js
// @updateURL https://update.greasyfork.org/scripts/37572/WME%20Mini%20ScrollBar.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const scrollbarWidth = 8,
    thumbBorderWidth = 1,
    thumbBorderColor = "rgba(255, 255, 255, 0.4)",
    scrollbarMouseOverColor = 'rgba(128, 128, 128, 0.2)',
    thumbColor = 'rgba(0, 0, 0, 0.4)',
    thumbMouseOverColor = 'rgba(0, 0, 0, 0.8)';
  let a = document.createElement('style');
  a.textContent = `
  <!--
::-webkit-scrollbar{
width: ${scrollbarWidth}px !important;
height: ${scrollbarWidth}px !important;
background:transparent;
filter: invert();
}
::-webkit-scrollbar:hover {
background: ${scrollbarMouseOverColor};
}
::-webkit-scrollbar-thumb {
border: ${thumbBorderWidth}px solid ${thumbBorderColor} !important;
background-color: ${thumbColor} !important;
z-index: 2147483647;
-webkit-border-radius: 12px;
background-clip: content-box;
}
::-webkit-scrollbar-corner {
background: rgba(255, 255, 255, 0.3);
border: 1px solid transparent
}
::-webkit-scrollbar-thumb:hover {
background-color: ${thumbMouseOverColor} !important;
}
::-webkit-scrollbar-thumb:active {
background-color: rgba(0, 0, 0, 0.6) !important
}
-->
`;
  let doc;
  if (location.origin === "file://") {
    doc = document.head || document.documentElement;
  } else {
    doc = document.body || document.documentElement;
  }
  doc.appendChild(a);
})();