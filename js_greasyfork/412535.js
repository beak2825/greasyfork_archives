// ==UserScript==
// @name         Reddit Preview Redirect
// @version      1.0.0
// @author       needforsuv
// @description  Automatically redirect reddit preview images to full
// @match        *://preview.redd.it/*
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/692742
// @downloadURL https://update.greasyfork.org/scripts/412535/Reddit%20Preview%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/412535/Reddit%20Preview%20Redirect.meta.js
// ==/UserScript==

//put inside function to prevent possible global var weirdness
(function () {

	
// get url, excluding anything after the ?


    var fullimgReddit  = window.location.protocol + "//" + "i.redd.it" + window.location.pathname /*+ window.location.search + window.location.hash*/;
// replace url with correct/full sized one

    window.location.replace (fullimgReddit);

	
})();