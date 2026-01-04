// ==UserScript==
// @name        MVLC Amazon Links
// @namespace   https://greasyfork.org
// @description Adds links to search for books in the Merrimack Valley Library Consortium in Massachusetts
// @include     https://www.amazon.com/*
// @include     http://www.amazon.com/*
// @version     1.0
// @downloadURL https://update.greasyfork.org/scripts/376486/MVLC%20Amazon%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/376486/MVLC%20Amazon%20Links.meta.js
// ==/UserScript==
var loc=jQuery('#productTitle')[0];
var name=loc.textContent;
jQuery("<p><a target='_blank' href='https://mvlc.ent.sirsi.net/client/en_US/andover/search/results?qu="+encodeURIComponent(name)+"&te='>Find at Library</a></p>").appendTo(loc.parentNode.parentNode);