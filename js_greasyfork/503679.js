// ==UserScript==
// @name         Agario Macros
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Agar.io macro: W = Auto Eject Mass, T = x16 splits, Q = Double split
// @author       Maroc Agar
// @match        https://agar.io/*
// @run-at       document-end
// @grant        none
// @icon         https://i.imgur.com/AAlWAp8.png
// @downloadURL https://update.greasyfork.org/scripts/503679/Agario%20Macros.user.js
// @updateURL https://update.greasyfork.org/scripts/503679/Agario%20Macros.meta.js
// ==/UserScript==

window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

var EjectDown = false;
var speed = 25; //in ms

// Here is the keys and the number assigned, make sure to replace the number for the key you want to use.

//A = "65", B = "66", C = "67", D = "68", E = "69", F = "70", G = "71", H = "72", I = "73", J = "74", K = "75", L = "76", M = "77", N = "78", O = "79", P = "80", Q = "81", R = "82", S = "83", T = "84", U = "85", V = "86", W = "87", X = "88", Y = "89", Z = "90"

function keydown(event) {
    if (event.keyCode == 87 && !EjectDown) { // Macro Feed "W"
        EjectDown = true;
        setTimeout(eject, speed);
    }
    if (event.keyCode == 81 || event.keyCode == 50) { // Double "Q"
        split();
        setTimeout(split, speed);
    }
    if (event.keyCode == 84) { // X16 splits "T"
        split();
        setTimeout(split, speed);
        setTimeout(split, speed*2);
        setTimeout(split, speed*3);
    }
    if (event.keyCode == 83) { // Stop movement "S"
        var X = window.innerWidth / 2;
        var Y = window.innerHeight / 2;
        $("canvas").trigger($.Event("mousemove", { clientX: X, clientY: Y }));
    }
}

function keyup(event) {
    if (event.keyCode == 87) { // W
        EjectDown = false;
    }
}

function eject() {
    if (EjectDown) {
        triggerKeyEvent(87); // W
        setTimeout(eject, speed);
    }
}

function split() {
    triggerKeyEvent(32); // Space
}

function triggerKeyEvent(keyCode) {
    $("body").trigger($.Event("keydown", { keyCode }));
    $("body").trigger($.Event("keyup", { keyCode }));
}

// This text is only informative, changing it does not modify the keys.
function removeDefaultText() {
    var instructions = document.getElementById("instructions");
    if (instructions) {
        instructions.innerHTML = `<center><div style='font-weight: bold; font-size: 16px;'>Key Bindings:</div></center>
            <center><div style='margin-top: 10px; padding: 15px; background-color: white; border-radius: 15px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);'>
                <div>Press <b style='font-size: 18px;'>W</b> to Auto Eject Mass (Hold)</div>
                <div>Press <b style='font-size: 18px;'>Q</b> to Double Split</div>
                <div>Press <b style='font-size: 18px;'>T</b> to split x16</div>
            </div></center>`;
    }
}

function removeElement(selector) {
    var element = document.querySelector(selector);
    if (element) {
        element.style.display = "none";
    }
}

function removeFooterElements() {
    removeElement('.tosBox.left');
    removeElement('.tosBox.right');
    removeElement('.bubble');
    removeElement('.agario-promo');
    removeElement('.promo-badge-container');
}

// Remove an element by its id
function removeElementById(id) {
    var element = document.getElementById(id);
    if (element) {
        element.remove();
    }
}

removeElementById("agar-io_970x90");
removeElementById("socialButtons");

function customizeMainUI() {
    var mainUIOffers = document.getElementById('mainui-offers');
    if (mainUIOffers) {
        var titleElement = mainUIOffers.querySelector('.title');
        if (titleElement) {
            titleElement.textContent = 'FREE COINS';
        }
    }
}

var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        removeFooterElements();
        customizeMainUI();
    });
});

var config = { childList: true, subtree: true, attributes: true };
observer.observe(document.body, config);

window.addEventListener('load', function() {
    removeDefaultText();
    removeFooterElements();
    customizeMainUI();
    removeElementById();

    var style = document.createElement('style');
        style.innerHTML = `
            :root {
                --bottom-banner-height: 1px !important;
            }

            #background,
            canvas {
                height: calc(100% - var(--bottom-banner-height)) !important;
            }

            .btn-play[data-v-0733aa78] {
                position: relative;
                top: 25px;
                color: #fff !important;
                background-color: #2a61d7 !important;
                border-color: #2a61d7 !important;
                width: 243px;
                height: 34px;
                font-size: 20px;
                line-height: 1.5;
            }

            .mini .potion-slot-animation[data-v-55506716] {
                top: 24% !important;
                position: absolute !important;
                width: 100% !important;
                height: 175% !important;
                transform-origin: center !important;
                z-index: 1 !important;
                overflow: hidden !important;
            }
            .potion-slot-button.green[data-v-55506716] {
            }
            .party-join[data-v-3152cd5c], .party-play[data-v-3152cd5c] {
                background-color: #2a61d7 !important;
                border-color: #2a61d7 !important;
                width: 77px;
            }
            .free-coins-button > button[data-v-1791274a] {
                width: 285px;
                height: 45px;
                display: block;
                color: #fff;
                background-color: #54c800;
                border-color: #54c800;
                font-size: 14px;
                font-weight: 700;
                line-height: 1.42857143;
                text-align: center;
                white-space: nowrap;
                touch-action: manipulation;
                cursor: pointer;
                user-select: none;
                background-image: none;
                border: 1px solid transparent;
                border-radius: 4px;
                padding-left: 40px;

            }
            .party-create[data-v-3152cd5c], .party-copy[data-v-3152cd5c] {
                background-color: #00d3ff !important;
                border-color: #00d3ff !important;
                width: 68px;
            }
        `;
        document.head.appendChild(style);
    });