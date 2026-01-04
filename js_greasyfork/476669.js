// ==UserScript==
// @name         NW Paywall
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  NW Paywall umgehen
// @author       Ralf Beckebans
// @match        https://www.nw.de/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nw.de
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476669/NW%20Paywall.user.js
// @updateURL https://update.greasyfork.org/scripts/476669/NW%20Paywall.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function nwnews() {

        // Artikel
        var script_paywall = document.querySelectorAll('script[type="application/ld+json"]')[1];
        var script_articlebody = script_paywall.innerHTML.split('"articleBody"');
        var script_url = script_articlebody[1].split('"url"');

        var inhalt_paywall_show = "";
        var inhalt_paywall = document.getElementsByClassName('paywall-overlay-rebrush-2023')[0];
        if(inhalt_paywall) {
            inhalt_paywall_show = inhalt_paywall.parentNode;
        } else {
            var inhalt_nopaywall = document.getElementsByClassName('nw-paid-content')[0];
            if(!inhalt_nopaywall) {
                var inhalt_paywall2 = document.getElementsByClassName('nw-flex nw-flex-col md:nw-flex-row')[0];
                if(inhalt_paywall2) {
                    inhalt_paywall_show = inhalt_paywall2;
                }
            }
        }
        if(inhalt_paywall_show) {
            inhalt_paywall_show.innerHTML = '<p class="em_text"><br>' + script_url[0].substring(3).replaceAll('\\n",','<br>').replaceAll('\\n','<br><br>').replaceAll('\\/','/').replaceAll('\\"','"') + '</p>';
        }

        // Footer
        if(document.getElementById('nw-paywall-footer')) {
            document.getElementById('nw-paywall-footer').remove();
        }

    }

    // DOM vollständig aufgebaut?
    if (/complete|interactive|loaded/.test(document.readyState)) {
        nwnews();
    } else {
        document.addEventListener('DOMContentLoaded', nwnews, false);
    }

})();