// ==UserScript==
// @name         AF Team Name Borders
// @namespace    http://tampermonkey.net/
// @version      2025-06-23
// @description  adds team names to the borders of attacks, defenses, and characters
// @author       three
// @match        *://artfight.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=artfight.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543217/AF%20Team%20Name%20Borders.user.js
// @updateURL https://update.greasyfork.org/scripts/543217/AF%20Team%20Name%20Borders.meta.js
// ==/UserScript==

const teamsJSON = JSON.parse('{"Fossils":"#ba8c25","Crystals":"#d35e88","Seafoam":"#51b083","Stardust": "#877feb","Vampires":"#e6466c","Werewolves":"#498cad","Wither":"#a86b8b","Bloom":"#98a54e","Steampunk":"#bb6726","Cyberpunk":"#bf54e2","Sugar":"#53d1ba","Spice":"#fbac76","Dream":"#ffc6db","Nightmare":"#c04847","Tea":"#c0e68e","Coffee":"#967061","Sun":"#eebf0d","Moon":"#8798e6","Magic":"#673ab7","Technology":"#8bc34a"}');
const themeLink = document.getElementsByTagName("link")[1].href;
var siteTheme;
console.log(themeLink.includes("all-dark"));
if (themeLink.includes("all-dark")){
    siteTheme = "#222";
} else {
    siteTheme = "#fff";
}

function RGBToHex(rbg) {
    let x, hex = "";
    let cols = rbg.split(",");
    cols[0] = cols[0].slice(4);
    cols[2] = cols[2].slice(0,-1);

    for (x=0;x<3;x++){
        //console.log(cols[x]);
        if (Number(cols[x]).toString(16) == 0) {
            hex = hex + "00";
        }
        else if (Number(cols[x]).toString(16).length < 2) {
            hex = hex + 0 + Number(cols[x]).toString(16);
            console.log("new hex is " + hex);
        }
        else {
        hex = hex + Number(cols[x]).toString(16);
        }
    }
    //console.log("new hex is " + hex);
    return hex;
}

function addTextBorders() {

    let thumbs = document.getElementsByClassName("thumb-attack");

    for (let x=0;x<thumbs.length;x++){
        let teamName = "Spectator";
        let teamCol = RGBToHex(document.getElementsByClassName("thumb-attack")[x].parentNode.style.borderColor);
        //console.log(document.getElementsByClassName("thumb-attack")[x].parentNode.style.borderColor);

        for (var i in teamsJSON){
            //console.log(teamsJSON[i] + "teamcol=" + teamCol);
            if (teamsJSON[i] == "#" + teamCol){
                teamName = i;
                break;
            }
        }

        document.getElementsByClassName("thumb-attack")[x].outerHTML = document.getElementsByClassName("thumb-attack")[x].outerHTML + '<h5 style="position:relative;float:bottom;top:-28px;left:18px;margin-bottom:-18px;color:#' + teamCol + ';z-index:998;font-weight:bold;letter-spacing:1pt;font-variant: small-caps;font-style:italic;-webkit-text-stroke: 4px ' + siteTheme + '">' + teamName + '</h5>';
        document.getElementsByClassName("thumb-attack")[x].outerHTML = document.getElementsByClassName("thumb-attack")[x].outerHTML + '<h5 style="position:relative;float:bottom;top:-24px;left:18px;margin-bottom:-18px;color:#' + teamCol + ';z-index:999;font-weight:bold;letter-spacing:1pt;font-variant: small-caps;font-style:italic;">' + teamName + '</h5>';
    }
}

addTextBorders();

