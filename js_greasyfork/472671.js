// ==UserScript==
// @name         redirect terraria fandom wiki to wiki.gg
// @namespace    https://blog.miigon.net
// @version      0.1
// @license      public domain
// @description  as the name suggests, redirect terraria fandom wiki page to the same page on wiki.gg
// @author       Miigon
// @match        https://terraria.fandom.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fandom.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472671/redirect%20terraria%20fandom%20wiki%20to%20wikigg.user.js
// @updateURL https://update.greasyfork.org/scripts/472671/redirect%20terraria%20fandom%20wiki%20to%20wikigg.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.location.href = window.location.href.replace("terraria.fandom.com", "terraria.wiki.gg")
})();