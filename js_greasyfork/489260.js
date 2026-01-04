// ==UserScript==
// @name         Stat.ink Salmon Map Shorthands
// @namespace    Eon
// @license      CC BY 4.0
// @version      1.0.0
// @description  Simple Jquery to make short names for salmon stages
// @author       @Eon
// @match        https://stat.ink/*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stat.ink
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/489260/Statink%20Salmon%20Map%20Shorthands.user.js
// @updateURL https://update.greasyfork.org/scripts/489260/Statink%20Salmon%20Map%20Shorthands.meta.js
// ==/UserScript==

$(document).ready(function() {
    $('.cell-map').each(function() {
        var currentText = $(this).text().trim();
        var shorthand = '';

        // Define shorthand versions based on current text content
        switch(currentText) {
            case 'Scorch Gorge':
                shorthand = 'ScorchG';
                break;
            case 'Eeltail Alley':
                shorthand = 'Eeltail';
                break;
            case 'Hagglefish Market':
                shorthand = 'Hagglefish';
                break;
            case 'Undertow Spillway':
                shorthand = 'Undertow';
                break;
            case 'Mincemeat Metalworks':
                shorthand = 'MMeat';
                break;
            case 'Hammerhead Bridge':
                shorthand = 'HHead';
                break;
            case 'Museum d\'Alfonsino':
                shorthand = 'Museum';
                break;
            case 'Mahi-Mahi Resort':
                shorthand = 'Mahi';
                break;
            case 'Inkblot Art Academy':
                shorthand = 'InkblotAA';
                break;
            case 'Sturgeon Shipyard':
                shorthand = 'SturgeonSY';
                break;
            case 'MakoMart':
                shorthand = 'Mako';
                break;
            case 'Wahoo World':
                shorthand = 'Wahoo';
                break;
            case 'Brinewater Springs':
                shorthand = 'Springs';
                break;
            case 'Flounder Heights':
                shorthand = 'FlounderH';
                break;
            case 'Um\'ami Ruins':
                shorthand = 'URuins';
                break;
            case 'Manta Maria':
                shorthand = 'MMaria';
                break;
            case 'Barnacle & Dime':
                shorthand = 'B&D';
                break;
            case 'Humpback Pump Track':
                shorthand = 'Humpback';
                break;
            case 'Crableg Capital':
                shorthand = 'Crableg';
                break;
            case 'Shipshape Cargo Co.':
                shorthand = 'Shipshape';
                break;
            case 'Robo ROM-en':
                shorthand = 'ROM-en';
                break;
            case 'Bluefin Depot':
                shorthand = 'Bluefin';
                break;
            case 'Marlin Airport':
                shorthand = 'Airport';
                break;
            default:
                // If no shorthand found, keep the original text
                shorthand = currentText;
        }

        // Set the shorthand text to the cell
        $(this).text(shorthand);
    });
});
