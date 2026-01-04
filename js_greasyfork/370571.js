// ==UserScript==
// @name         Erepublik party people
// @namespace https://greasyfork.org/users/2402
// @version      0.2
// @description  try to take over the world!
// @author       You
// @include      https://www.erepublik.com/**/main/party-members/*
// @connect      docs.google.com
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/370571/Erepublik%20party%20people.user.js
// @updateURL https://update.greasyfork.org/scripts/370571/Erepublik%20party%20people.meta.js
// ==/UserScript==

var $ = jQuery;

function collect() {
    var party = $('h1').text();
    $('.avatarholder a').each(function () {
        var link = $(this).attr('href'),
            nick = $(this).attr('title'),
            formData = new FormData();
        formData.append('entry.1857157948', party);
        formData.append('entry.103357408', link);
        formData.append('entry.558662381', nick);
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://docs.google.com/forms/d/e/1FAIpQLSdfUFj3swW5iz7ss4udCepV9ce5A2--fTNWOg4Ae4xe9WV2sg/formResponse",
            data: formData,
        });

    })
}
(function() {
    'use strict';
    $("h1").after("<button id='collect'>Сканирай</button><br>\n");
    $("#collect").click(function () {
        collect();
    })

})();