// ==UserScript==
// @name     Steam - Auto Register Product Key
// description:en
// @version  1
// @grant    none
// @include  https://store.steampowered.com/account/registerkey?key=*
// @description Automatically accepts Steam's SSA and presses the Register button. Good for bulk key activation through https://store.steampowered.com/account/registerkey?key= - Links as provided by third party key-seller-websites.
// @namespace https://greasyfork.org/users/813705
// @downloadURL https://update.greasyfork.org/scripts/432141/Steam%20-%20Auto%20Register%20Product%20Key.user.js
// @updateURL https://update.greasyfork.org/scripts/432141/Steam%20-%20Auto%20Register%20Product%20Key.meta.js
// ==/UserScript==


while (document.getElementById("accept_ssa").checked == false)
{
	document.getElementById("accept_ssa").click();
	document.getElementById("register_btn").click();
}
