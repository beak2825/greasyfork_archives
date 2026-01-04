// ==UserScript==
// @name           GreasyFork Script Numbers figuccio
// @namespace      https://greasyfork.org/users/237458
// @version        0.2
// @description    Aggiunge numeri accanto agli script GreasyFork nelle pagine utente.
// @author         figuccio
// @match          *://greasyfork.org/*/users/*
// @match          https://greasyfork.org/*
// @match          https://sleazyfork.org/*
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/527032/GreasyFork%20Script%20Numbers%20figuccio.user.js
// @updateURL https://update.greasyfork.org/scripts/527032/GreasyFork%20Script%20Numbers%20figuccio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //Funzione 1: Stile ed evidenziazione degli script utente
    function applyStylesAndHighlight() {
        const page = +new URLSearchParams(document.location.search).get('page') || 1;
        const q = `<style>
            #browse-script-list{counter-reset: section ${(page-1)*50};}
            .ad-entry{height:0;overflow:hidden;}
            #browse-script-list li{position:relative}
            .Finn{background:gold;}
            .ad-entry{display:none}
            #browse-script-list li:after{
                counter-increment: section;
                content:counter(section);
                font:bold 20px/30px Arial;
                background:red;
                color:green;
                position:absolute;
                bottom:8px;
                right:15px
            }
        </style>`;
        document.documentElement.insertAdjacentHTML('afterbegin', q);

        const a = document.querySelector(".user-profile-link a")?.href; // Utilizzare il concatenamento facoltativo
        if (a) { // Procedere solo se a è definito
            document.querySelectorAll("#browse-script-list li").forEach(function(i) {
                const b = i.querySelector("dd.script-list-author a");
                if (b && b.href === a) {
                    i.className = 'Finn';
                }
            });
        }
    }

    //Funzione 2: Aggiungere la numerazione all'elenco degli script utente nelle pagine utente
    function addNumberingToUserScripts() {
        if (window.location.href.includes("/users/")) {
            const scriptList = document.querySelectorAll('.script-list > li');

            if (scriptList) {
                scriptList.forEach((script, index) => {
                    const numberSpan = document.createElement('span');
                    numberSpan.style.marginRight = '5px';
                    numberSpan.style.fontWeight = 'bold';
                    numberSpan.style.background = 'red';
                    numberSpan.style.color = 'green';
                    numberSpan.textContent = `${index + 1}`;
                    script.insertBefore(numberSpan, script.firstChild);
                });
            }
        }
    }

    // Chiama entrambe le funzioni
    applyStylesAndHighlight();
    addNumberingToUserScripts();

})();
