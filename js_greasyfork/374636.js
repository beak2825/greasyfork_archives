// ==UserScript==
// @name			Trakt TPB Link
// @namespace		https://greasyfork.org/en/users/7864-curtis-gibby
// @description		Add link on Trakt movie pages to search that title on The Pirate Bay
// @version			1.0
// @include        https://trakt.tv/shows/*
// @include        https://trakt.tv/movies/*
// @downloadURL https://update.greasyfork.org/scripts/374636/Trakt%20TPB%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/374636/Trakt%20TPB%20Link.meta.js
// ==/UserScript==

var title = document.querySelectorAll("a.btn-checkin")[0].getAttribute('data-top-title');
var link = document.createElement('a');
link.href = 'https://thepiratebay.org/search/' + title + '/0/7/0';
link.setAttribute('target','_blank');
link.innerHTML = '<img src="https://thepiratebay.org/favicon.ico" alt="Search TPB" style="width: 16px; height: 16px;"/>';
link.style.position = 'absolute';
link.style.top = '55px';
link.style.left = '5px';
document.body.appendChild(link);
