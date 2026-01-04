// ==UserScript==
// @name         Maďarsko - Basketbal
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Generuje tlačítko pro Maďarské basketbaly
// @author       Michal
// @match        https://hunbasket.hu/bajnoksag-musor/x2324/hun/*
// @match        https://hunbasket.hu/bajnoksag-musor/x2324/hun_cup/*
// @match        https://hunbasket.hu/bajnoksag-musor/x2324/whun/*
// @match        https://hunbasket.hu/bajnoksag-musor/x2324/whun_cup/*
// @match        https://hunbasket.hu/bajnoksag-musor/x2324/whun_ply/*
// @match        https://hunbasket.hu/bajnoksag-musor/x2324/whun_plya/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478951/Ma%C4%8Farsko%20-%20Basketbal.user.js
// @updateURL https://update.greasyfork.org/scripts/478951/Ma%C4%8Farsko%20-%20Basketbal.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function() {
        var links = document.querySelectorAll('a[href*="hun_"], a[href*="hun_cup_"], a[href*="whun_"], a[href*="whun_cup_"], a[href*="whun_ply_"], a[href*="whun_plya_"], a[href*="hun_ply_"], a[href*="hun_plo_"]');

        for (var i = 0; i < links.length; i++) {
            var match_id = links[i].getAttribute('href').match(/hun_cup_(\d+)|whun_(\d+)|hun_(\d+)|whun_cup_(\d+)|whun_ply_(\d+)|whun_plya_(\d+)|hun_ply_(\d+)|hun_plo_(\d+)/);

            if (match_id) {
                var matchText = links[i].textContent;
                if (matchText.includes("0 - 0")) {
                    var baseUrl = "";

                    if (links[i].getAttribute('href').includes("hun_cup_")) {
                        baseUrl = "https://netcasting.webpont.com/?hun_cup_";
                    } else if (links[i].getAttribute('href').includes("whun_cup_")) {
                        baseUrl = "https://netcasting.webpont.com/?whun_cup_";
                    } else if (links[i].getAttribute('href').includes("whun_ply_")) {
                        baseUrl = "https://netcasting.webpont.com/?whun_ply_";
                    } else if (links[i].getAttribute('href').includes("whun_plya_")) {
                        baseUrl = "https://netcasting.webpont.com/?whun_plya_";
                    } else if (links[i].getAttribute('href').includes("hun_ply_")) {
                        baseUrl = "https://netcasting.webpont.com/?hun_ply_";
                    } else if (links[i].getAttribute('href').includes("hun_plo_")) {
                        baseUrl = "https://netcasting.webpont.com/?hun_plo_";
                    } else if (links[i].getAttribute('href').includes("whun_")) { 
                        baseUrl = "https://netcasting.webpont.com/?whun_"; // Opraveno pro whun_
                    } else {
                        baseUrl = "https://netcasting.webpont.com/?hun_";
                    }

                    var live_url = baseUrl + (match_id[1] || match_id[2] || match_id[3] || match_id[4] || match_id[5] || match_id[6] || match_id[7] || match_id[8]);

                    var buttonContainer = document.createElement('div');
                    buttonContainer.style.display = 'flex';
                    buttonContainer.style.flexDirection = 'column';

                    var button_1 = document.createElement('a');
                    button_1.href = live_url;
                    button_1.innerText = "Statistiky";
                    button_1.style.marginBottom = '5px';

                    var button_2 = document.createElement('a');
                    button_2.href = live_url + "/";
                    button_2.innerText = "Skóre";

                    buttonContainer.appendChild(button_1);
                    buttonContainer.appendChild(button_2);

                    links[i].textContent = "Zápas " + (match_id[1] || match_id[2] || match_id[3] || match_id[4] || match_id[5] || match_id[6] || match_id[7] || match_id[8]); 
                    links[i].setAttribute('style', 'display: inline-block; padding: 5px; margin: 5px; border: 1px solid #333; border-radius: 5px; text-align: center;');

                    var separator = document.createElement('hr');
                    separator.style.border = 'none';
                    separator.style.borderTop = '1px solid #000';
                    separator.style.margin = '5px 0';

                    links[i].appendChild(separator);
                    links[i].appendChild(buttonContainer);
                }
            }
        }
    }, 1000);
})();

