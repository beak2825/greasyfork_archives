// ==UserScript==
// @name                CoreSite Marketing
// @author              Chet Manley
// @version             0.2
// @description         CoreSite x
// @include             https://www.mturkcontent.com/*
// @require             http://code.jquery.com/jquery-latest.min.js
// @namespace x
// @downloadURL https://update.greasyfork.org/scripts/2562/CoreSite%20Marketing.user.js
// @updateURL https://update.greasyfork.org/scripts/2562/CoreSite%20Marketing.meta.js
// ==/UserScript==

$('form > p > b').append(' - <a href="https://encrypted.google.com/search?q=' + encodeURIComponent($('form > p > b').text().trim()) + '" target="_blank">Google Search</a>');