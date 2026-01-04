// ==UserScript==
// @name			DeviantArt Gallery RSS
// @version			2021.01.30
// @description		Add RSS link in DeviantArt galleries
// @match			https://www.deviantart.com/*/gallery*
// @icon			https://www.google.com/s2/favicons?domain=deviantart.com
// @author			Rainbow-Spike
// @namespace       https://greasyfork.org/users/7568
// @homepage        https://greasyfork.org/ru/users/7568-dr-yukon
// @grant			none
// @downloadURL https://update.greasyfork.org/scripts/405891/DeviantArt%20Gallery%20RSS.user.js
// @updateURL https://update.greasyfork.org/scripts/405891/DeviantArt%20Gallery%20RSS.meta.js
// ==/UserScript==

var [ a, b, c, d ] = window.location.pathname.split ( '/' );
if ( c == 'gallery' ) document.querySelector ( 'head' ).innerHTML += '<link rel="alternate" type="application/rss+xml" title="RSS" href="https://backend.deviantart.com/rss.xml?q=gallery%3A' + b + '%2F' + d + '&type=deviation">';
