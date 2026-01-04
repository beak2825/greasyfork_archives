// ==UserScript==
// @name         bilingualmanga-hide-bottom-bar
// @namespace    http://tampermonkey.net/
// @version      2024-02-27
// @description  changes up-down button behavior
// @author       Niakr1s
// @match        https://bilingualmanga.org/manga/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilingualmanga.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488475/bilingualmanga-hide-bottom-bar.user.js
// @updateURL https://update.greasyfork.org/scripts/488475/bilingualmanga-hide-bottom-bar.meta.js
// ==/UserScript==

function patch_updown_button() {
    let btn = document.getElementById("updownb");
    let dash = document.getElementById('dash');

    const dash_show = () => {
        dash.style.position = 'fixed';
        dash.style.bottom = '1px';
        dash.style.display = '';
    };

    const dash_hide = () => {
        dash.style.display = 'none';
    }

    const DOWN = '🡇';
    const UP = '🡅';

    let showed = true;
    btn.textContent = DOWN;

    btn.onclick = () => {
        if (showed) {
            btn.textContent = UP;
            dash_hide();
        } else {
            btn.textContent = DOWN;
            dash_show();
        }
        showed = !showed;
    };

    btn.click();
}

function move_langbar_out_of_dash() {
    let langb = document.getElementById("langb");
    let reader = document.getElementById("reader");
    let langb_div = document.getElementById("r-opt");

    langb_div.parentElement.removeChild(langb_div);
    reader.appendChild(langb);
}

function force_float() {
    let float = document.querySelector("#slider > div:nth-child(2) > input:nth-child(1)");

    if (!float.checked) {
        float.click();
    }
    float.disabled = true;
}

function main() {
    force_float();
    patch_updown_button();
    move_langbar_out_of_dash();
}

(function() {
    addEventListener("load", setTimeout(main, 100));
})();