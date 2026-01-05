// ==UserScript==
// @name         Taguj to gówno
// @namespace    tagujto
// @version      1.0.2
// @description  Skrypt ukrywający na Mikroblogu Wykop.pl wpisy, które nie zostały otagowane.
// @author       zranoI
// @include      /^https?:\/\/.*wykop\.pl\/mikroblog.*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21826/Taguj%20to%20g%C3%B3wno.user.js
// @updateURL https://update.greasyfork.org/scripts/21826/Taguj%20to%20g%C3%B3wno.meta.js
// ==/UserScript==

$(document).ready(function() {
    $("li.iC > .dC").each(function() {
        if (/#\w+/.exec($(this).find("div.text > p").text()) === null) {
            $(this).parent().hide();
        }
    });
});