// ==UserScript==
// @name           Panda redirect
// @namespace      Manchewable
// @author         Manchewable
// @version        1.0
// @description    Auto-redirects you to panda after a gallery has been removed
// @include        https://e-hentai.org/*
// @include        http://e-hentai.org/*
// @grant          none
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/37665/Panda%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/37665/Panda%20redirect.meta.js
// ==/UserScript==

if (document.title.search("Gallery Not Available - E-Hentai Galleries") != -1) {
    document.location = document.location.toString().replace("e-hentai", "exhentai");
}