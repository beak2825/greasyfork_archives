// ==UserScript==
// @name         renren-adblock-201511
// @namespace    https://github.com/summivox
// @version      0.4
// @description  block some renren ads
// @author       summivox
// @match        *://*.renren.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13633/renren-adblock-201511.user.js
// @updateURL https://update.greasyfork.org/scripts/13633/renren-adblock-201511.meta.js
// ==/UserScript==

document.head.appendChild(document.createElement('style')).innerHTML = ""
+ "*[class^='advert'],[class^='huati'],#huatiBox,#recommendArea{display: none !important;}"
+ ".share-item-footer{height: auto !important;}"
+ ".a-feed[data-source-id]{display: none !important;}"
;