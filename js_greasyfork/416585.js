// ==UserScript==
// @name         Userstyles.org Redirect to USOArchive
// @namespace    Freeplay
// @version      1.0.2
// @description  Redirects userstyle.org userstyle pages to USOArchive instead
// @author       Freeplay (https://freeplay.codeberg.page/)
// @include      *userstyles.org/styles/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/416585/Userstylesorg%20Redirect%20to%20USOArchive.user.js
// @updateURL https://update.greasyfork.org/scripts/416585/Userstylesorg%20Redirect%20to%20USOArchive.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const styleID = window.location.pathname.split('/')[2];
    document.location.href = "https://33kk.github.io/uso-archive/?style=" + styleID;
})();