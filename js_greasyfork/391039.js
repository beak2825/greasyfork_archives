// ==UserScript==
// @name         [DEAD AND OBSELETE] ExHentai Search Plus Tag (Results page)
// @namespace    https://exhentai.org/
// @version      0.3
// @description  Doesn't work anymore, delete it.  For much better alternative check "Add button on exhentai searchbox" along with "Add button on exhentai searchbox from tag button"
// @author       miwoj
// @match        https://exhentai.org/?f_search*
// @match        https://exhentai.org/watched?f_search*
// @match        https://exhentai.org/tag*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391039/%5BDEAD%20AND%20OBSELETE%5D%20ExHentai%20Search%20Plus%20Tag%20%28Results%20page%29.user.js
// @updateURL https://update.greasyfork.org/scripts/391039/%5BDEAD%20AND%20OBSELETE%5D%20ExHentai%20Search%20Plus%20Tag%20%28Results%20page%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var sort = document.getElementsByClassName("nopm")[1];


    /* LINK LIST START */

    /* LINK TEMPLATE, copy, paste, uncomment, replace "Name" with any custom name, replace "searched_tag" with your tag  */
    /*
    var linkName = document.createElement('a');
    var linkNameText = document.createTextNode("+link text");
    linkName.appendChild(linkNameText);
    linkName.href = fixUrl(document.URL,"searched_tag");
    linkName.style.fontSize = "12px";
    linkName.style.padding = "0px 10px";
    linkName.style.color = "#2eac01";
    sort.appendChild (linkName);
    */

    var linkEnglish = document.createElement('a');
    var linkEnglishText = document.createTextNode("+english");
    linkEnglish.appendChild(linkEnglishText);
    linkEnglish.href = fixUrl(document.URL,"english");
    linkEnglish.style.fontSize = "12px";
    linkEnglish.style.padding = "0px 10px";
    linkEnglish.style.color = "#2eac01";
    sort.appendChild (linkEnglish);

    var linkAnal = document.createElement('a');
    var linkAnalText = document.createTextNode("+anal");
    linkAnal.appendChild(linkAnalText);
    linkAnal.href = fixUrl(document.URL,"anal");
    linkAnal.style.fontSize = "12px";
    linkAnal.style.padding = "0px 10px";
    linkAnal.style.color = "#D99E6A";
    sort.appendChild (linkAnal);

    var linkRape = document.createElement('a');
    var linkRapeText = document.createTextNode("+rape");
    linkRape.appendChild(linkRapeText);
    linkRape.href = fixUrl(document.URL,"rape");
    linkRape.style.fontSize = "12px";
    linkRape.style.padding = "0px 10px";
    linkRape.style.color = "#FF8438";
    sort.appendChild (linkRape);

    var linkBondage = document.createElement('a');
    var linkBondageText = document.createTextNode("+bondage");
    linkBondage.appendChild(linkBondageText);
    linkBondage.href = fixUrl(document.URL,"bondage");
    linkBondage.style.fontSize = "12px";
    linkBondage.style.padding = "0px 10px";
    linkBondage.style.color = "#B47AFF";
    sort.appendChild (linkBondage);

    /* LINK LIST END */

    function fixUrl(url, tag)
    {
        var colonCount = url.split(":").length-1;

        if (colonCount == 2)
        {
            var lastSlash = url.lastIndexOf("/");
            var end = url.substring(lastSlash+1, url.length);
            end = end.replace(":","%3A\"");
            end = "?f_search="+end+"%24\"";

            var newUrl = url.substring(0,lastSlash-3)+end+"+"+tag;

            //alert("zing "+newUrl);
            return newUrl;
        }
        return url+"+"+tag;
    }

})();