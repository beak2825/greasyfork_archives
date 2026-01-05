// ==UserScript==
// @name 		   Alex:BSCF : forum search opens in new tab
// @namespace	   http://supportforums.blackberry.com/
// @description	version 1
// @include		http://supportforums.blackberry.com/*
// @version 0.0.1.20150819230140
// @downloadURL https://update.greasyfork.org/scripts/11854/Alex%3ABSCF%20%3A%20forum%20search%20opens%20in%20new%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/11854/Alex%3ABSCF%20%3A%20forum%20search%20opens%20in%20new%20tab.meta.js
// ==/UserScript==

document.getElementById('form').target='_blank';