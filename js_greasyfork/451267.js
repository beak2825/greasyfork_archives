// ==UserScript==
// @name     koszykPGG - bez blura
// @namespace sssaasss
// @description Skrypt ukrywa blura na stronie PGG
// @license MIT
// @version  1.01
// @grant    none
// @include  *sklep.pgg.pl*
// @namespace https://greasyfork.org/users/952625
// @downloadURL https://update.greasyfork.org/scripts/451267/koszykPGG%20-%20bez%20blura.user.js
// @updateURL https://update.greasyfork.org/scripts/451267/koszykPGG%20-%20bez%20blura.meta.js
// ==/UserScript==
(function(){'use strict';
	document.body.innerHTML = document.body.innerHTML.replace(/blur(5px);/g, '');
	document.getElementById("main").style.filter="none";
	document.getElementById("main").style.webkitFilter="none";
    document.getElementById("al-t").style.display="none";
})()
