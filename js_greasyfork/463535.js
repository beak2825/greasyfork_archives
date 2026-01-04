// ==UserScript==
// @name         MooMoo.io Item counter by Nuro
// @description  Made by Nuro
// @author       Nuro
// @match        *://*.moomoo.io/*
// @require      https://greasyfork.org/scripts/456235-moomoo-js/code/MooMoojs.js?version=1159501
// @run-at       document-start
// ==/UserScript==

const MooMoo = (function MooMooJS_beta() {})[69]

const styles = {
    position: "absolute",
    top: "0",
    paddingLeft: "5px",
    fontSize: "2em",
    color: "#fff"
};

MooMoo.onGameLoad = () => {
    initializeActionBar()
}

function initializeActionBar() {
    'use strict';
    const actionBarItems = document.getElementsByClassName("actionBarItem");

    for (let i = 0; i < actionBarItems.length; i++) {
        if (i >= 19 && i <= 38) {
            const divElement = createActionBarItem(i);
            appendActionBarItem(divElement, i);
        }
    }

    function createActionBarItem(index) {
        const divElement = document.createElement("div");
        divElement.setAttribute("id", `actionBarItemnum${index}`);
        applyStyles(divElement, styles);
        divElement.innerHTML = "0";
        return divElement;
    }

    function applyStyles(element, styles) {
        for (const style in styles) {
            element.style[style] = styles[style];
        }
    }

    function appendActionBarItem(divElement, index) {
        const parentElement = document.getElementById(`actionBarItem${index}`);
        parentElement.appendChild(divElement);
    }

    function getElementById(id) {
        return document.getElementById(id);
    }

    MooMoo.addEventListener("14", function (event) {
        const value = event[1];
        const indicesByEventType = {
            1: [19, 20, 21],
            2: [22, 23, 24, 25],
            3: [26, 27, 28],
            4: [29],
            5: [31],
            6: [32],
            7: [33],
            8: [34],
            9: [35],
            10: [36],
            11: [30],
            12: [37],
            13: [38]
        };
        const updateActionBarItem = index => {
            document.getElementById(`actionBarItemnum${index}`).innerHTML = value;
        };
        const indices = indicesByEventType[event[0]];
        indices.forEach(updateActionBarItem);
    });
}
