// ==UserScript==
// @name        Hide all images - Reddit
// @namespace   english
// @description Hide all images - Reddit ~
// @include     http*://*reddit.com*
// @include     http*://*kbin.social*
// @version     1.2
// @run-at document-end
// @grant       GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467060/Hide%20all%20images%20-%20Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/467060/Hide%20all%20images%20-%20Reddit.meta.js
// ==/UserScript==



var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '          img, body img, html img, body div img, video{width:15px !important;height:auto !important;} div{background-size: 22px !important;}  .sp_N1ER1bkS1OC{filter:sepia(100%);} media-telemetry-observer{max-width: 30px; display: block;}         ';
document.getElementsByTagName('head')[0].appendChild(style);

  

