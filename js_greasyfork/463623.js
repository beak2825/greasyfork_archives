// ==UserScript==
// @name         Filter topics
// @license      MIT
// @namespace    http://websight.blue
// @version      1.01
// @description  Hide topics without new messages
// @author       Milan
// @match        *://*.websight.blue/threads/*
// @match        *://websight.blue
// @icon         https://lore.delivery/static/blueshi.png
// @downloadURL https://update.greasyfork.org/scripts/463623/Filter%20topics.user.js
// @updateURL https://update.greasyfork.org/scripts/463623/Filter%20topics.meta.js
// ==/UserScript==

const hideTopics = button => {
    button.innerText = "Unfilter topics";
    document.querySelectorAll("#thread-list>tbody>tr").forEach( row => {
        if(!!row.id && !!row.querySelector(".thread-unread").style.display) { row.style.display = "none"; }
    });
}

const showTopics = button => {
    button.innerText = "Filter topics";
    document.querySelectorAll("#thread-list>tbody>tr").forEach( row => {
        row.style.display = "table-row";
    });
}

let filtered = JSON.parse(localStorage.getItem("filterlock")) || false;

const placeButton = menu => {
    const button = document.createElement("a");
    button.href = "#";
    button.id = "GM-filter-button";
    button.title = "Only show updated topics";
    button.innerText = "Filter topics";
    button.addEventListener('click', () => {
        if (filtered) {
            showTopics(button);
            filtered = false;
        }
        else {
            hideTopics(button);
            filtered = true;
        }
    });

    button.addEventListener('dblclick', () => {
        if(JSON.parse(localStorage.getItem("filterlock"))) {
            localStorage.setItem("filterlock", "false");
            showTopics(button);
            menu.lastChild.remove();
        }
        else {
            localStorage.setItem("filterlock", "true");
            hideTopics(button);
            menu.append(" 🔒");
        }
    });
    menu.append(" | ");
    menu.append(button);
    if (JSON.parse(localStorage.getItem("filterlock"))) { menu.append(" 🔒"); }
    document.addEventListener('keydown', function(e) {
        if (e.key == 'o') {
            button.click();
        }
    });
}

(() => {
    'use strict';
    const buttonLocation = document.querySelector(".userbar");
    placeButton(buttonLocation);
    if (JSON.parse(localStorage.getItem("filterlock"))) {
        hideTopics(document.getElementById("GM-filter-button"));
        filtered = true;
    }
})();