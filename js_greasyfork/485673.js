// ==UserScript==
// @name         GC - Scratchcard Keyboard Controls
// @namespace    https://greasyfork.org/en/users/1175371
// @version      0.8
// @description  Adds keyboard controls to GC scratchcards.
// @author       sanjix
// @match        https://www.grundos.cafe/*/scratchcard/*
// @match        https://www.grundos.cafe/*/kiosk/*
// @match        https://www.grundos.cafe/*/purchase-scratchcard/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485673/GC%20-%20Scratchcard%20Keyboard%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/485673/GC%20-%20Scratchcard%20Keyboard%20Controls.meta.js
// ==/UserScript==

var spots = document.querySelectorAll('.scratchcard a, .scratchcard img[onclick], .scratchcard .ldsc_blank');
var back = document.querySelector('#scratchcard ~ .button-group button:first-child');
var cards = document.querySelector('select[name="card"]');
var select = document.querySelector('select[name="card"] option:last-child');
var goscratch = document.querySelector('input[value="Scratch!"]');
var buyscratch = document.querySelector('input[value="Yes, I will have one please"], #page_content main button.form-control');document.addEventListener("keydown", ((event) => {
    switch (event.keyCode) {
        case 97:
        case 49: //1
            {
                spots[0].click();
            }
            break;
        case 98:
        case 50: //2
            {
                spots[1].click();
            }
            break;
        case 99:
        case 51: //3
            {
                spots[2].click();
            }
            break;
        case 100:
        case 52: //4
            {
                spots[3].click();
            }
            break;
        case 101:
        case 53: //5
            {
                spots[4].click();
            }
            break;
        case 102:
        case 54: //6
            {
                spots[5].click();
            }
            break;
        case 103:
        case 55: //7
            {
                spots[6].click();
            }
            break;
        case 104:
        case 56: //8
            {
                spots[7].click();
            }
            break;
        case 105:
        case 57: //9
            {
                spots[8].click();
            }
            break;
        case 13: //enter
            {
                if (back != null) {
                    back.click();
                } else if (cards != null && !select.selected) {
                    select.selected = true;
                } else if (cards != null && select.selected) {
                    goscratch.click();
                } else if (buyscratch != null) {
                    buyscratch.click();
                }
            }
            break;
    }
}));