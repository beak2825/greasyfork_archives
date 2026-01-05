// ==UserScript==
// @name		xXpwnpwnpwnXx bild
// @namespace	EPW9Im6jRouiZMgu
// @author		LemonIllusion
// @version		1.2
// @match		https://www.facebook.com/groups/284759138378602*
// @match		http://www.facebook.com/groups/284759138378602*
// @description	Byter ut bilden på xXpwnpwnpwnXx till en snyggare
// @downloadURL https://update.greasyfork.org/scripts/5203/xXpwnpwnpwnXx%20bild.user.js
// @updateURL https://update.greasyfork.org/scripts/5203/xXpwnpwnpwnXx%20bild.meta.js
// ==/UserScript==

var imgTag = document.getElementsByClassName("coverPhotoImg")[0];
imgTag.setAttribute("src", "http://i.imgur.com/qRxznro.jpg");