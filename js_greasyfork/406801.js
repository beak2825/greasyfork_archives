
// ==UserScript==
// @version      1.0.2
// @author       namtt007
// @match        stake.com
// @name         redirect to claim reload page
// @namespace    namtt007
// @description  namtt007
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/406801/redirect%20to%20claim%20reload%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/406801/redirect%20to%20claim%20reload%20page.meta.js
// ==/UserScript==

function redirectToClaimReloadPage()
{
	window.location.replace = "https://stake.com/settings/general?currency=xrp&modal=vipReload";
}

setInterval(redirectToClaimReloadPage, 30000);