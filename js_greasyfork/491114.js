// ==UserScript==
// @name         plemiona.pl easy-farmer by l3mpik
// @namespace    easy-farmer
// @version      1.0.2
// @description  Easy farmer by l3mpik
// @author       l3mpik
// @match        https://*.plemiona.pl/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=plemiona.pl
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491114/plemionapl%20easy-farmer%20by%20l3mpik.user.js
// @updateURL https://update.greasyfork.org/scripts/491114/plemionapl%20easy-farmer%20by%20l3mpik.meta.js
// ==/UserScript==

const saveSetting = (key, value) => {

    localStorage.setItem(key, value);
    window.location.href = window.location.href;
}

const getSetting = (key) => {

    return localStorage.getItem(key);
}

if (getSetting('autofarm') === null) saveSetting('autofarm', 0);

// Znajdź element #plunder_list_filters
var plunderListFilters = document.getElementById("plunder_list_filters");

// Utwórz nowy element span
var spanElement = document.createElement("span");
spanElement.style.width = "100%";
spanElement.style.float = "left";

// Utwórz nowy element input typu checkbox
var checkboxInput = document.createElement("input");
checkboxInput.type = "checkbox";
checkboxInput.id = "x_amfarm_autofarm";
checkboxInput.checked = getSetting('autofarm') == 1 ? true : false;
checkboxInput.onclick = function (event) {

    saveSetting('autofarm', event.target.checked ? 1 : 0);
};

// Utwórz nowy element label
var labelElement = document.createElement("label");
labelElement.setAttribute("for", "x_amfarm_autofarm");
labelElement.textContent = "[MOD] Autofarm";

// Dodaj input i label do elementu span
spanElement.appendChild(checkboxInput);
spanElement.appendChild(labelElement);

// Dodaj element span do #plunder_list_filters
plunderListFilters.appendChild(spanElement);

const click = (v = 'b') => {

    //
    const clickOffset = v === 'a' ? 8 : 9;
    const clicks = $("#plunder_list tr").map((index, row) => {

        if (row.children.length < 12) return null;

        let node = row.children[2];
        let className = node.className;
        let wasFull = false;

        // farm row icon is full
        if (node.children[0].src.includes("1.png")) wasFull = true;

        // Farm row button by offset A B
        node = row.children[clickOffset].children[0];
        className = node.className;

        if (node.onclick.toString().includes('false;')) return null;

        if (className.includes("farm_icon_disabled")) return null;

        return {node, wasFull};
    });

    // first full
    // clicks.sort((a, b) => !a.wasFull ? 1 : -1)

    if ($(".error").length > 0 || clicks.length == 0) {

        setTimeout(() => {

            window.location.href = window.location.href;
        }, 10000);

        return;
    }

    //
    if (clicks.length > 0) clicks[0].node.click();
}

setInterval(() => {

    if (getSetting('autofarm') == 0) return

    click('a');

}, 350)

setInterval(() => {

    if (getSetting('autofarm') == 0) return

    click('b');

}, 350)