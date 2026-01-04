// ==UserScript==
// @name       [AO3 Wrangling] Turn chars in blurbs to tags landing page links
// @description what it says on the tin
// @author      Rhine
// @namespace   https://github.com/RhineCloud
// @version     1.0
// @match       http*://*archiveofourown.org/tags/*
// @match       http*://*archiveofourown.org/works?*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/446266/%5BAO3%20Wrangling%5D%20Turn%20chars%20in%20blurbs%20to%20tags%20landing%20page%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/446266/%5BAO3%20Wrangling%5D%20Turn%20chars%20in%20blurbs%20to%20tags%20landing%20page%20links.meta.js
// ==/UserScript==

(function($) {
    let tags = document.querySelectorAll('li.blurb ul.tags li.characters a.tag');
    tags.forEach(tag => tag.setAttribute('href', tag.getAttribute('href').slice(0, -6)));
})();