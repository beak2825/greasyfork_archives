// ==UserScript==
// @name         Flickr - bigger pages and next buttons
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Flickr - bigger buttons for page's number, next and previous
// @author       ClaoDD
// @match        https://www.flickr.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422357/Flickr%20-%20bigger%20pages%20and%20next%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/422357/Flickr%20-%20bigger%20pages%20and%20next%20buttons.meta.js
// ==/UserScript==

(function(){
var style = document.createElement('style'),
styleContent = document.createTextNode('.pagination-view span { min-width:80px !important; height:192px !important; padding: 0 2px !important; }');
style.appendChild(styleContent );
var caput = document.getElementsByTagName('head');
caput[0].appendChild(style);
})();