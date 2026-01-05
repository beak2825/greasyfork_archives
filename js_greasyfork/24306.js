// ==UserScript==
// @name         Remember BGG image size
// @namespace    http://www.stealmycode.se/
// @version      1.0
// @description  "Remember" size setting when browsing images on BoardGameGeek
// @author       https://github.com/adrianschmidt
// @match        http*://*boardgamegeek.com/image/*
// @downloadURL https://update.greasyfork.org/scripts/24306/Remember%20BGG%20image%20size.user.js
// @updateURL https://update.greasyfork.org/scripts/24306/Remember%20BGG%20image%20size.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var size = getParameterByName('size'),
        links;

    if (size) {
        links = getImageLinks();
        links.forEach(setSizeAttribute);
    }

    function getImageLinks() {
        return document.querySelectorAll('a[href*="/image/"]');
    }

    function setSizeAttribute(link) {
        if (link.href.indexOf('?') === -1 && link.href.indexOf('#') === -1) {
            link.href += '?size=' + size;
        }
    }

    function getParameterByName(name, url) {
        if (!url) {
          url = window.location.href;
        }
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
})();