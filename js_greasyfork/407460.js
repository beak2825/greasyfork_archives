// ==UserScript==
// @name         Sciencedirect + SciHub
// @namespace    https://greasyfork.org/en/users/221281-klaufir
// @version      1.12
// @description  Adds SciHub links on Elsevier's Sciencedirect pages
// @author       klaufir
// @match        https://www.sciencedirect.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407460/Sciencedirect%20%2B%20SciHub.user.js
// @updateURL https://update.greasyfork.org/scripts/407460/Sciencedirect%20%2B%20SciHub.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var SCIHUB = 'https://sci-hub.se/';

    function addScihubLink_old(aelem) {
        var e = aelem;
        var container = document.createElement('span')
        container.style.margin = container.style.padding = '2px';
        container.style.fontSize = '2em';
        var link = document.createElement('a');
        link.href = SCIHUB + e.href;
        link.innerText='[scihub]';
        container.appendChild(link);

        e.parentNode.insertBefore(container, e);
    }

    function RewriteDoiLink(e) {
        e.href = SCIHUB + e.href;
        e.innerText='[scihub] ' + e.innerText;
        e.style.fontSize='2em';
    }


    setTimeout(function() {
        Array.from(document.getElementsByTagName('a'))
            .filter(elem => elem.href.startsWith('https://doi.org/'))
            .map(RewriteDoiLink);
    }, 1000);

})();