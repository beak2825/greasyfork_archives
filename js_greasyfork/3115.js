// ==UserScript==
// @name        mmmturkeybacon Brittany Graham Revenue
// @author      mmmturkeybacon
// @description Turns company name into a manta search link.
// @namespace   http://userscripts.org/users/523367
// @include     https://s3.amazonaws.com/mturk_bulk/hits*
// @require     http://code.jquery.com/jquery-latest.min.js
// @version     1.01
// @grant       GM_log
// @downloadURL https://update.greasyfork.org/scripts/3115/mmmturkeybacon%20Brittany%20Graham%20Revenue.user.js
// @updateURL https://update.greasyfork.org/scripts/3115/mmmturkeybacon%20Brittany%20Graham%20Revenue.meta.js
// ==/UserScript==


if ( $('strong:contains("Find the Annual revenue")').length > 0 )
{ // Brittany Graham revenue
    var company_node = $("p:contains('Company:')").children('strong');
    var zip_text = $("p:contains('Postal Code:')").children('strong').text().trim();

    var company_text = company_node.text().trim().replace("&", "%26");
    var manta_URL = "http://www.manta.com/mb?search=" + company_text + " " + zip_text;
    manta_URL = manta_URL.replace("Company: ","").replace(/[" "]/g, "+");
    company_node.html('<a href="' + manta_URL + '" target="_blank">' + company_text + '</a>');
}