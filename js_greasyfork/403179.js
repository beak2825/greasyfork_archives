// ==UserScript==
// @name           Marapets Guess the Flag Autoplayer
// @namespace  https://greasyfork.org/en/users/200321-realisticerror
// @version        1.0
// @description   Automates the Marapets game - Guess the Flag
// @author          RealisticError (Clraik)
// @match          https://www.marapets.com/trojan.php
// @require         http://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403179/Marapets%20Guess%20the%20Flag%20Autoplayer.user.js
// @updateURL https://update.greasyfork.org/scripts/403179/Marapets%20Guess%20the%20Flag%20Autoplayer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var flagImage = $("body > div.marapetsmax > div > div.maralayout.sitecontent > div.maralayoutmiddle > form > div > img")[0].src
    var countryName = flagImage.split("/")[flagImage.split("/").length - 1].split("_")[1].split(".")[0];


    if(countryName === "UnitedStates") {

        countryName = "United States"
    } else if(countryName === "NewZealand") {

        countryName = "New Zealand"
    } else if(countryName === "UK") {

        countryName = "United Kingdom"
    } else if(countryName === "UAE") {

        countryName = "United Arab Emirates"
    } else if(countryName === "Bosnia") {

        countryName = "Bosnia and Herzegovina"
    } else if(countryName ==="Trinidad") {

        countryName = "Trinidad and Tobago"
    }


    $("body > div.marapetsmax > div > div.maralayout.sitecontent > div.maralayoutmiddle > form > div > input[type=text]:nth-child(10)")[0].value = countryName;

    $("body > div.marapetsmax > div > div.maralayout.sitecontent > div.maralayoutmiddle > form > div > input[type=submit]:nth-child(13)").click()


})();