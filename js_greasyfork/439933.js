// ==UserScript==
// @name         Flickr2commons redirector
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  redirect flickr to flickr2commons
// @author       Anderson Green
// @include      /^https:(\/\/|\/\/www\.)flickr\.com\/photos\/.*$/
// @grant        none
// @run-at document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/439933/Flickr2commons%20redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/439933/Flickr2commons%20redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //alert("It works!");
    window.location = "https://flickr2commons.toolforge.org/#/photo/"+window.location.href.split("/")[5];
    // Your code here...
})();