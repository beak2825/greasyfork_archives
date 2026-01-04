// ==UserScript==
// @name         Smiledirect
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Redirects any URL starting with www.amazon to smile.amazon
// @author       Nico Freiermuth
// @include      https://www.amazon.tld/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382969/Smiledirect.user.js
// @updateURL https://update.greasyfork.org/scripts/382969/Smiledirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var smile = "https://smile"
    //Get URL
	var url = window.location.href
    //Removes https://www
    var short_url = url.slice(11)
    //Joins smile and short_url
    var smile_url = smile.concat(short_url)
    //Reload new url
    window.location.replace(smile_url)
})();