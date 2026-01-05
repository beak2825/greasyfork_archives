// ==UserScript==
// @name         Auto ezproxy redirection
// @namespace    org.jixun
// @version      0.1
// @description  Automatically gain access for resources subscripted by your organisation via ezproxy.
// @author       Jixun
// @include      *
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/15874/Auto%20ezproxy%20redirection.user.js
// @updateURL https://update.greasyfork.org/scripts/15874/Auto%20ezproxy%20redirection.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // In case of emergency:
    // debugger;

    // Default configs.
    // e.g. eebo.chadwyck.com, dl.acm.org
    var redirHosts = [];
    var yourDomain = GM_getValue('proxy.host', '');
    reloadHosts();

    // Register command
    if (redirHosts.indexOf(location.hostname) == -1) {
        if (location.hostname.indexOf('.exproxy.') == -1) {
            GM_registerMenuCommand('[ezproxy] Add ' + location.hostname + ' to ezproxy list.', addCurrentHost, 'z');
        }

        GM_registerMenuCommand('[ezproxy] Change domain', changeDomain, 'd');
    } else if (yourDomain) {
        // Redirect
        doRedirect();
    } else {
        GM_registerMenuCommand('[ezproxy] Setup domain', changeDomain, 'd');
    }
    GM_registerMenuCommand('[ezproxy] Reset Everything', resetScript, 'r');

    function reloadHosts () {
        try {
            redirHosts = JSON.parse(GM_getValue('site.hosts', '[]'));
        } catch (e) {
            GM_setValue('site.hosts', '[]');
            alert('Host list corrupted, reset to default empty list.');
            redirHosts = [];
        }
    }

    function addCurrentHost () {
        if (!yourDomain) {
            if (!changeDomain())
                return ;
        }

        reloadHosts();
        if (redirHosts.indexOf(location.hostname) == -1) {
            redirHosts.push(location.hostname);
            GM_setValue('site.hosts', JSON.stringify(redirHosts));
        }

        doRedirect();
    }

    function doRedirect () {
        location.hostname += '.ezproxy.' + yourDomain;
    }

    function changeDomain () {
        yourDomain = prompt('Please enter your new ezproxy domain, format as example shown below:', yourDomain || 'university.ac.uk');
        GM_setValue('proxy.host', yourDomain);
        return !!yourDomain;
    }

    function resetScript () {
        GM_setValue('site.hosts', '[]');
        GM_setValue('proxy.host', '');
    }
})();