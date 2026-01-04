// ==UserScript==
// @name         Bluf Filmes
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove ads.
// @author       Cristhyan Kohlhase
// @match        https://www.bluf.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bluf.online
// @require      http://code.jquery.com/jquery-3.6.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/451654/Bluf%20Filmes.user.js
// @updateURL https://update.greasyfork.org/scripts/451654/Bluf%20Filmes.meta.js
// ==/UserScript==

/* global $ */

//var $ = window.jQuery;

$(document).ready(function() {
    var checkExist = setInterval(function() {
        if ($('#arlinablock').length) {
            $('#arlinablock').remove();
            $("a[dontfo]").remove();
            $("a[href='https://youradexchange.com/ad/visit.php?al=1']").remove();
            $("body").css('overflow', '');
            clearInterval(checkExist);
        }
    }, 100); // check every 100ms
});

