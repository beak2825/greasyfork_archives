// ==UserScript==
// @name            [ALL] Links Open EXTERNAL in NEW BACKGROUND Tab
// @author
// @description     Open EXTERNAL links in NEW BACKGROUND tab.
// @downloadURL
// @grant           GM_openInTab
// @homepageURL     https://bitbucket.org/INSMODSCUM/userscripts-scripts/src
// @icon
// @include         http*://*
// @namespace       insmodscum 
// @require
// @run-at          document-start
// @updateURL
// @version         1.0
// @downloadURL https://update.greasyfork.org/scripts/20697/%5BALL%5D%20Links%20Open%20EXTERNAL%20in%20NEW%20BACKGROUND%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/20697/%5BALL%5D%20Links%20Open%20EXTERNAL%20in%20NEW%20BACKGROUND%20Tab.meta.js
// ==/UserScript==

// source: http://userscripts-mirror.org/scripts/review/42130

function getDomain(url) {
    var parts  = url.split('//');
    var domain = parts[1];
    if(domain.indexOf('/')) {
        var p  = domain.split('/');
        domain = p[0];
    }
    if(domain.indexOf(':')) {
        var d  = domain.split(':');
        domain = d[0];
    }
    return domain;
}

function TabOpener(a) {
    var clickHandler = function(e) {
        GM_openInTab(a.href, true);
        e.preventDefault();
    };
    a.addEventListener('click', clickHandler, false);
}

var as = document.getElementsByTagName('a');
for (var i = 0, a; a = as[i]; i++) {
    if (a.hasAttribute('href') && !a.href.match(/^javascript:/i) && (a.href.indexOf(getDomain(document.URL)) < 0) ) {
        new TabOpener(a);
    }
}

// // code below does not work. treats subdomains as "external" (e.g. stuff.slashdot.org is external)

// // ==UserScript==
// // @name        Open external link in new tab
// // @version     0.1.3
// // @namespace   eight04.blogspot.com
// // @description This script will open any external link in new tab. Support dynamic content
// // @include     http*
// // @grant        none
// // ==/UserScript==

// "use strict";

// function getAnchor(element) {
    // while (element && element.nodeName != "A") {
        // element = element.parentNode;
    // }
    // return element;
// }

// document.addEventListener("click", function(e){
    // var anchor = getAnchor(e.target);
    // if (!anchor || anchor.target || anchor.protocol == "javascript:" || e.isTrusted === false || !anchor.offsetParent || (e.isTrusted == null && !e.detail)) {
        // return;
    // }
    // if (anchor.hostname != location.hostname) {
        // anchor.target = "_blank";
    // }
// });