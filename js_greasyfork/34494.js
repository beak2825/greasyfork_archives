// ==UserScript==
// @name         WorkPort Add Review Link
// @namespace    http://mizle.net/
// @version      0.1.1
// @description  Add review links to WorkPort Job vote.
// @author       Eai
// @match        https://econ.workport.co.jp/rsheet.php?*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/34494/WorkPort%20Add%20Review%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/34494/WorkPort%20Add%20Review%20Link.meta.js
// ==/UserScript==

// Hire ME!

(function() {
    'use strict';
    var enHyoubanIcon = "https://i.imgur.com/ed4kL7z.png";
    var jobtalkIcon = "https://i.imgur.com/zB9gR8Q.png";
    var enHyoubanBaseUrl = "https://en-hyouban.com/search/?SearchWords=";
    var jobtalkBaseUrl = "https://jobtalk.jp/company/search/keyword/";

    var span = $(".namebox h2 span");
    var url = $("img[src='images/scurl.png']").parent().attr("href").split("://")[1].split("/")[0];
    var name = $(span).text().trim().split("／")[0];

    var enHyoubanSearchUrl = enHyoubanBaseUrl+name;
    var jobtalkSearchUrl = jobtalkBaseUrl+url;
    var enHyoubanLink = `<a href="${enHyoubanSearchUrl}" target="_blank"><img src="${enHyoubanIcon}" style="height:20px"></a>`;
    var jobtalkLink = `<a href="${jobtalkSearchUrl}" target="_blank"><img src="${jobtalkIcon}" style="height:20px"></a>`;

    $(span).append(enHyoubanLink);
    $(span).append(jobtalkLink);
})();