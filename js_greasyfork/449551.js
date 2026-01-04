// ==UserScript==
// @name         Redirect Amazon to English version
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Redirect websites to their English version
// @author       Mikhoul
// @include        https://www.amazon.*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449551/Redirect%20Amazon%20to%20English%20version.user.js
// @updateURL https://update.greasyfork.org/scripts/449551/Redirect%20Amazon%20to%20English%20version.meta.js
// ==/UserScript==

if (window.location.href.indexOf('fr_CA') > -1) {

    var url = window.location.href;
    window.location = url.replace(/fr_CA/, 'en_CA');
}


if (window.location.href.indexOf('/fr/') > -1) {

    var zurl = window.location.href;
    window.location = zurl.replace(/\/fr\//, '/en/');
}




//   var url = window.location.toString();