// ==UserScript==
// @name         Warframe Fandom Redirect
// @version      0.1
// @description  Redirects from warframe.fandom.com/wiki/* to wiki.warframe.com/w/*, because nobody likes fandom
// @author       TeJay
// @license      MIT
// @match        https://warframe.fandom.com/wiki/*
// @grant        none
// @namespace https://greasyfork.org/users/1429596
// @downloadURL https://update.greasyfork.org/scripts/525462/Warframe%20Fandom%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/525462/Warframe%20Fandom%20Redirect.meta.js
// ==/UserScript==

(function() {
    var currentPath = window.location.pathname;
    var pageName = currentPath.split('/').pop();
    var redirectURL = 'https://wiki.warframe.com/w/' + pageName;
    window.location.replace(redirectURL);
})();
