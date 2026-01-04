// ==UserScript==
// @name         Shodan.io
// @namespace    http://tampermonkey.net/
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @version      1.6
// @description  Make shodan.io links into FTP links, open in new tab
// @author       Mwen
// @match        https://www.shodan.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391458/Shodanio.user.js
// @updateURL https://update.greasyfork.org/scripts/391458/Shodanio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var thisIP, ftpLink, thisLink;

    $(".ip").each(function()
    {
        var links = $(this).find('a');

        if(links.length > 1)
        {
          thisLink = $(this).find('a').eq(1);
          thisIP = thisLink.attr('href');
          ftpLink = thisIP.replace("/host/", "");
          ftpLink = "ftp://" + ftpLink;
          thisLink.attr("target", "_blank");
          thisLink.attr("href", ftpLink);
          thisLink.attr("onClick", "strikeThrough();");
        }
        else
        {
          thisLink = $(this).find('a').eq(0);
          thisIP = thisLink.attr('href');
          ftpLink = thisIP.replace("/host/", "");
          ftpLink = "ftp://" + ftpLink;
          thisLink.attr("target", "_blank");
          thisLink.attr("href", ftpLink);
          thisLink.attr("onClick", "strikeThrough();");
        }

        console.log(ftpLink)
    });
})();

window.strikeThrough = strikeThrough;

function strikeThrough(){
    $(this).attr("style", "text-decoration: line-through");
}