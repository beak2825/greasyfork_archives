// ==UserScript==
// @name        hko banner remover
// @namespace   Violentmonkey Scripts
// @match       http*://www.hko.gov.hk/tc/index.html
// @match       http*://www.hko.gov.hk/sc/index.html
// @match       http*://www.hko.gov.hk/en/index.html
// @match       http*://www.weather.gov.hk/tc/index.html
// @match       http*://www.weather.gov.hk/sc/index.html
// @match       http*://www.weather.gov.hk/en/index.html
// @grant       none
// @version     1.1
// @author      -
// @description 2/19/2020, 6:12:30 PM
// @downloadURL https://update.greasyfork.org/scripts/397293/hko%20banner%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/397293/hko%20banner%20remover.meta.js
// ==/UserScript==


(function() {
    'use strict';
    try{
$('a.flex-next').remove()
$('a.flex-prev').remove()
    }catch(e) {}
})();