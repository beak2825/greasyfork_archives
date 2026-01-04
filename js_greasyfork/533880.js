// ==UserScript==
// @name         Torn Racing Vehicle Name Reverter
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Changes the current Torn racing car names back to their previous real-world names.
// @author       Furms
// @match        https://www.torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533880/Torn%20Racing%20Vehicle%20Name%20Reverter.user.js
// @updateURL https://update.greasyfork.org/scripts/533880/Torn%20Racing%20Vehicle%20Name%20Reverter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const nameMap = {
        "Alpha Milano 156": "Alfa Romeo 156",
        "Bavaria M5": "BMW M5",
        "Bavaria X5": "BMW X5",
        "Bavaria Z8": "BMW Z8",
        "Bedford Nova": "Vauxhall Nova",
        "Bedford Racer": "Vauxhall Astra",
        "Chevalier CVR": "Chevrolet Corvette",
        "Chevalier CZ06": "Chevrolet Corvette Z06",
        "Coche Basurero": "Chevrolet El Camino",
        "Colina Tanprice": "Sierra Cosworth",
        "Cosmos EX": "Mazda RX-7",
        "Dart Rampager": "Dodge Charger",
        "Echo Quadrato": "Audi Quattro",
        "Echo R8": "Audi R8",
        "Echo S3": "Audi S3",
        "Echo S4": "Audi S4",
        "Edomondo ACD": "Honda Accord",
        "Edomondo IR": "Honda Integra",
        "Edomondo Localé": "Honda Civic",
        "Edomondo NSX": "Honda NSX",
        "Edomondo S2": "Honda S2000",
        "Invader H3": "Hummer H3",
        "Knight Firebrand": "Pontiac Firebird",
        "Lambrini Torobravo": "Lamborghini Gallardo",
        "Limoen Saxon": "Lotus Elise",
        "Lolo 458": "Ferrari 458",
        "Mercia SLR": "Mercedes-Benz SLR",
        "Nano Cavalier": "Nissan 350Z",
        "Nano Pioneer": "Nissan Skyline GT-R",
        "Oceania SS": "Subaru Impreza WRX STI",
        "Papani Colé": "Pagani Zonda",
        "Stormatti Casteon": "Bugatti Veyron",
        "Sturmfahrt 111": "Porsche 911",
        "Stålhög 860": "Volvo 860",
        "Tabata RM2": "Toyota MR2",
        "Trident": "Mitsubishi Lancer Evolution",
        "Tsubasa Impressor": "Subaru Impreza",
        "Volt GT": "Ford GT",
        "Volt RS": "Focus RS",
        "Veloria LFA": "Lexus LFA",
        "Weston Marlin 177": "Aston Martin 177"
    };

    function replaceNames(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            for (const [fake, real] of Object.entries(nameMap)) {
                if (node.nodeValue.includes(fake)) {
                    node.nodeValue = node.nodeValue.replaceAll(fake, real);
                }
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            for (const child of node.childNodes) {
                replaceNames(child);
            }
        }
    }

    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                replaceNames(node);
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial run
    replaceNames(document.body);
})();