// ==UserScript==
// @name         Volejbal - Dataproject - víkendová příprava
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Vytváří proklik do detailů zápasů s podporou prostředního tlačítka myši bez změny focusu, použití auxclick
// @author       MK
// @match        https://*.dataproject.com/CompetitionMatches.aspx*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dataproject.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458725/Volejbal%20-%20Dataproject%20-%20v%C3%ADkendov%C3%A1%20p%C5%99%C3%ADprava.user.js
// @updateURL https://update.greasyfork.org/scripts/458725/Volejbal%20-%20Dataproject%20-%20v%C3%ADkendov%C3%A1%20p%C5%99%C3%ADprava.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const link = document.location.href;
    let firstPartOfLiveUrl = link.match(/.*com\//);

    const a = document.querySelectorAll('p.Calendar_p_TextRow');

    for (let i = 0; i < a.length; i++) {
        let onclickAttr = a[i].getAttribute('onclick');
        if (onclickAttr) {
            let id = onclickAttr.match(/[0-9]+/);

            a[i].removeAttribute('onclick');

            a[i].addEventListener('auxclick', function(event) {
                if (event.button === 1) {  // Kontrola, zda šlo o prostřední tlačítko
                    event.preventDefault();  // Zabráníme výchozímu chování
                    const url = firstPartOfLiveUrl + "Livescore_Adv.aspx?ID=" + id;
                    window.open(url, '_blank', 'noopener,noreferrer');  // Otevře odkaz na pozadí
                }
            });

            a[i].addEventListener('click', function(event) {
                if (event.button === 0) {  // Levé tlačítko
                    const url = firstPartOfLiveUrl + "Livescore_Adv.aspx?ID=" + id;
                    window.location.href = url;  // Přesměrování na detail zápasu
                }
            });
        }
    }
})();