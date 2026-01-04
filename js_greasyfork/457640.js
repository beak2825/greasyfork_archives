// ==UserScript==
// @name         Webgame valceni
// @version      2024-06-14
// @description  Tlacitko postavit stavebku
// @author       yS
// @match        *://*.webgame.cz/wg/index.php?p=valka
// @match        *://webgame.cz/wg/index.php?p=valka
// @match        *://*.webgame.cz/wg/index.php?p=valka&s=utok
// @match        *://webgame.cz/wg/index.php?p=valka&s=utok
// @match        *://*.webgame.cz/wg/index.php?p=valka&s=utok&to_id=*
// @match        *://webgame.cz/wg/index.php?p=valka&s=utok&to_id=*
// @match        *://*.webgame.cz/wg/index.php?p=valka&s=strike
// @match        *://webgame.cz/wg/index.php?p=valka&s=strike
// @icon         https://www.google.com/s2/favicons?sz=64&domain=webgame.cz
// @namespace https://greasyfork.org/users/1005892
// @downloadURL https://update.greasyfork.org/scripts/457640/Webgame%20valceni.user.js
// @updateURL https://update.greasyfork.org/scripts/457640/Webgame%20valceni.meta.js
// ==/UserScript==

"use strict";

const LINK = "index.php?p=budovy";

addButtonPostavitStavebku();

function createButtonPostavitStavebku(advised = false) {
    addValceniCss();

    const text = "Postavit stavebku ";

    let button = document.createElement("button");
    button.textContent = text;
    button.type = "button";
    button.classList.add("submit");
    button.addEventListener("click", () => {
        button.disabled = true;

        httpPostAsync(LINK, buildStavebku);

        setTimeout(() => {
            button.disabled = false;
        }, 1000);
    });

    let span = document.createElement("span");
    span.textContent = advised ? "✔" : "✖";
    button.appendChild(span);
    span.style.color = advised ? "lime" : "red";
    return button;
}

function addButtonPostavitStavebku() {
    const table = document.getElementById("war-summary");
    if (table === null) {
        return;
    }

    let column = table.rows[0].children[0];
    let dopripravit = column.children[0];

    if (dopripravit == null) {
        return;
    }

    if (dopripravit.value != "Dopřipravit armádu") {
        return;
    }

    let advised_to_build = false;

    let bonuses_table = document.getElementById("war-bonuses");
    if (bonuses_table !== null) {
        let combat_readiness = -Number(bonuses_table.rows[1].cells[1].innerText.slice(0, -1));
        if (combat_readiness == 10) {
            advised_to_build = true;
        } else if (combat_readiness > 10) {
            const left_over_readiness = (combat_readiness - 10) % 4;
            advised_to_build = left_over_readiness == 1 || left_over_readiness == 0;
        }
    }

    let button = createButtonPostavitStavebku(advised_to_build);

    column.appendChild(button);
}

function httpPostAsync(theUrl, callback) {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            callback(xmlHttp);
        }
    };
    xmlHttp.open("POST", theUrl, true); // true for asynchronous
    xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    //let params = 'doAction=build&vlgsc=&rsdsc=&comsc=&farmsc=&labsc=&fctrsc=1*&brcksc=&plntsc=&entzsc=&mlbsc=&cssc=&expKola=1'; // tovarny 1x
    let params = "doAction=build&vlgsc=&rsdsc=&comsc=&farmsc=&labsc=&fctrsc=&brcksc=&plntsc=&entzsc=&mlbsc=&cssc=1*&expKola=1"; // stavebka 1x
    xmlHttp.send(params);
}

function buildStavebku(response) {
    let responseText = response.responseText;
    let dom = new DOMParser().parseFromString(responseText, "text/html");

    let warn_element = dom.getElementsByClassName("warn")[0];
    let goodmsg_element = dom.getElementsByClassName("goodmsg")[0];

    let header = document.getElementsByTagName("h1")[0];
    let sibling = header.nextElementSibling;

    let icontent = header.parentElement;
    icontent.insertBefore(goodmsg_element, sibling);
    if (warn_element != null) {
        icontent.insertBefore(warn_element, sibling);
    }
}

function addValceniCss() {
    const styles = `button.submit:hover {
            background: #9F9F9F;
            color: #222222;
        }
        button.submit:active {
            border-top: solid 1px #2C394F;
            border-left: solid 1px #2C394F;
            border-right: solid 1px #C2D3EF;
            border-bottom: solid 1px #C2D3EF;
        }
        button.submit:disabled {
            filter: blur(0.75px);
        }
        `;
    addCss(styles);
}

function addCss(css) {
    let style = document.createElement("style");
    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }

    document.getElementsByTagName("head")[0].appendChild(style);
}
