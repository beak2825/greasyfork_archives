// ==UserScript==
// @name         Additional time Fortuna
// @namespace    http://tampermonkey.net/
// @version      v1.0.1
// @description  Vytvoří tabulku, která zobrazí add time z match widgetu
// @author       JK
// @match        https://gm.efortuna.pl/zaklady-live/*
// @match        https://gm.ifortuna.cz/sazky-live/*
// @match        https://gm.ifortuna.sk/live-stavky/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=efortuna.pl
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486327/Additional%20time%20Fortuna.user.js
// @updateURL https://update.greasyfork.org/scripts/486327/Additional%20time%20Fortuna.meta.js
// ==/UserScript==

setTimeout(function() {
    'use strict';
    // -------Styles-------
    const styleElement = document.createElement("style");

    styleElement.textContent = `
    #addTimeTable {
        color: black;
        font-size: 18px;
        border: 1px solid black;
        position: absolute;
        top: 50px;
        left: 100px;
        z-index: 999;
        background: white;
    }

    #addTimeTable th, td {
    padding: 10px;
    }

`;
    document.head.appendChild(styleElement);
    // -------End of Styles-------

    let addTime;

    function clicking() {
        document.querySelectorAll(".match-tracker")[0].click();

        setTimeout(() => {
            document.querySelectorAll(".overview")[0].click();
        }, 5000)
    }
    clicking();


    const table = document.createElement("table");
    table.id = "addTimeTable";

    document.body.appendChild(table);

    setInterval( () => {
        const injuryTime = document.querySelectorAll(".sr-lmt-clock__injury_time_min")[0];

        if (injuryTime) {addTime = injuryTime.textContent;} else addTime = "Null";

        table.innerHTML=`<tr><th>Additional Time</th><td>${addTime ? addTime : "Null"}</td></tr>`
    }, 10000)
},5000)();