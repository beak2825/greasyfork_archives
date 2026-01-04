// ==UserScript==
// @name         Torrentz2.is magnet url
// @namespace    d78aw78df6a78dfa9y23789fyas7yfhb8w79ydf
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://torrentz2.is/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36893/Torrentz2is%20magnet%20url.user.js
// @updateURL https://update.greasyfork.org/scripts/36893/Torrentz2is%20magnet%20url.meta.js
// ==/UserScript==

(function() {

    var hash = window.location.href.split('/').pop();

    document.querySelectorAll('div.downurls')[0].innerHTML = '<center><br /><a href="magnet:?xt=urn:btih:'+hash+'">Download magnet</a><br /><br /></center>' + document.querySelectorAll('div.downurls')[0].innerHTML;

})();