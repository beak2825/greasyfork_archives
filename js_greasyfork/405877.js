// ==UserScript==
// @name         Filter topics
// @namespace    http://endoftheinter.net/
// @version      1.0
// @description  Hide topics without new messages
// @author       Milan
// @match        *://boards.endoftheinter.net/topics/*
// @match        *://endoftheinter.net/main.php
// @downloadURL https://update.greasyfork.org/scripts/405877/Filter%20topics.user.js
// @updateURL https://update.greasyfork.org/scripts/405877/Filter%20topics.meta.js
// ==/UserScript==

const hideTopics = button => {
    button.innerText = "Unfilter topics";
    document.querySelectorAll(".grid tr").forEach( row => {
        if(row.children.length === 4 &&
           !row.children[2].innerText.includes("x") &&
           row.firstChild.tagName != "TH") { row.style.display = "none"; }
    });
}

const showTopics = button => {
    button.innerText = "Filter topics";
    document.querySelectorAll(".grid tr").forEach( row => {
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
}

(() => {
    'use strict';

    const buttonLocation = document.querySelector(".userbar");
    if(!buttonLocation) {
        const targetNode = document.getElementById('totm');
        const config = { attributes: false, childList: true, subtree: true };
        const callback = (mutationsList, observer) => {
            if (document.querySelector("h2")) {
                placeButton(document.querySelector("h2"));
                if (JSON.parse(localStorage.getItem("filterlock"))) {
                    hideTopics(document.getElementById("GM-filter-button"));
                    filtered = true;
                }
                observer.disconnect();
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    }
    else {
        placeButton(buttonLocation);
        if (JSON.parse(localStorage.getItem("filterlock"))) {
            hideTopics(document.getElementById("GM-filter-button"));
            filtered = true;
        }
    }
})();