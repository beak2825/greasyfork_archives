// ==UserScript==
// @name         Reddit unPreview
// @version      0.1
// @description  forward your from preview.redd.it to i.redd.it
// @author       HACKER3000
// @match        https://preview.redd.it/*
// @grant        none
// @namespace https://greasyfork.org/users/176965
// @downloadURL https://update.greasyfork.org/scripts/424230/Reddit%20unPreview.user.js
// @updateURL https://update.greasyfork.org/scripts/424230/Reddit%20unPreview.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url=document.URL
    var patt = new RegExp("https://preview.redd.it/(.*?.{3})\\?.*");
    var img = patt.exec(url);
    var dest = "https://i.redd.it/";
    dest += img[1];
    window.location.replace(dest);
})();