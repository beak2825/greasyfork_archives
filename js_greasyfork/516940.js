// ==UserScript==
// @name         Search ONLY Shaw's
// @namespace    es.jessjon.shaws.search
// @version      1.0.2024.11.11
// @description  Stop Shaw's from searching stupid reseller bullshit, and hide out of stock stuff
// @author       Jessica Jones
// @match        https://www.shaws.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shaws.com
// @license      MIT
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/516940/Search%20ONLY%20Shaw%27s.user.js
// @updateURL https://update.greasyfork.org/scripts/516940/Search%20ONLY%20Shaw%27s.meta.js
// ==/UserScript==

var form;

$(document).ready(function() {
    var forms = document.getElementsByName("search-form");
    form = forms.item(0);

    $(form).submit(function(e) {
        event.preventDefault();
        var sn = document.createElement('input');
        $(sn).attr('type','hidden'); $(sn).attr('name','sellerName');   $(sn).attr('value','Shaws');
        var av = document.createElement('input');
        $(av).attr('type','hidden'); $(av).attr('name','availability'); $(av).attr('value','true');
        form.appendChild(sn);
        form.appendChild(av);
        form.submit();
    });
});