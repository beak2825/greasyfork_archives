// ==UserScript==
// @name        Facebook dark night mode black / white - monochrome no colour
// @namespace   english
// @description Facebook dark night mode black / white  monochrome no colour
// @include     http*://*facebook.com*
// @version     1.5
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/381510/Facebook%20dark%20night%20mode%20black%20%20white%20-%20monochrome%20no%20colour.user.js
// @updateURL https://update.greasyfork.org/scripts/381510/Facebook%20dark%20night%20mode%20black%20%20white%20-%20monochrome%20no%20colour.meta.js
// ==/UserScript==

// Main - Collapse the Greasy Fork Header

var style = document.createElement('style');
style.type = 'text/css';

style.innerHTML = '          html{filter:  invert(100)grayscale(100%)contrast(110%) !important ;} html img{filter: invert(100)  !important ;}     ';

document.getElementsByTagName('head')[0].appendChild(style);
