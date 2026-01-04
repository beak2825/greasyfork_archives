// ==UserScript==
// @name         Indeed AggOps
// @version      0.1
// @description  None
// @author       Tehapollo
// @include      /^https://(www\.mturkcontent|s3\.amazonaws)\.com/
// @require      https://code.jquery.com/jquery-latest.min.js
// @namespace    http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/403755/Indeed%20AggOps.user.js
// @updateURL https://update.greasyfork.org/scripts/403755/Indeed%20AggOps.meta.js
// ==/UserScript==
(function() {

    if ($("li:contains('You have been provided with a company name and the country in which they operate.')").length) {
        var company = $("td:contains('Company Name:')").next().html();
        var address = $("td:contains('Company Country:')").next().html();
        var formatted = company.split("&amp;").join('and').split("'").join('');
        var TargetLink = "https://www.bing.com/search?q="
       
        $("td:contains('Company Name:')").next().html("<a href='https://www.google.com/search?q=" + formatted + "' target='_blank'>" + company + "</a>");
        $("td:contains('Company Country:')").next().html("<a href='https://www.google.com/search?q=" + formatted + ' ' + address + "' target='_blank'>" + company + ' ' + address + "</a>");

    }

})();