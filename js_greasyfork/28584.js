// ==UserScript==
// @name         AM_hwm_fast_links
// @namespace    AlaMote
// @version      0.2
// @description  Быстрые ссылки под текущее зеркало.
// @author       AlaMote
// @homepage     https://greasyfork.org/ru/scripts/28587-am-hwm-roulette
// @include      http://*heroeswm.ru/*
// @include      *178.248.235.15/*
// @include      *209.200.152.144/*
// @include      http://*lordswm.com/*
// @icon         http://www.hwm-img.totalh.net/favicon.png
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/28584/AM_hwm_fast_links.user.js
// @updateURL https://update.greasyfork.org/scripts/28584/AM_hwm_fast_links.meta.js
// ==/UserScript==

(function (window, undefined) {
    var links = $(".pi");
    for (var i = 0; i < links.length; i++) {
        var link = links[i].attributes.href.value.split("/");
        if (link.length < 3)
            continue;
        link[2] = links[i].baseURI.split("/")[2];
        var res_link = link.join("/");
        var outerHTML = links[i].outerHTML.split("\"");
        outerHTML[1] = res_link;
        links[i].outerHTML = outerHTML.join("\"");
    }

    links = $("td");
    for (i = 0; i < links.length; i++) {
        if (links[i].innerHTML.indexOf("www.heroeswm.ru") != -1) {
            links[i].innerHTML.replace("/www.heroeswm.ru/gi", location.host);
        }
    }
})(window);






