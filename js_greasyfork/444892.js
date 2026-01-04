// ==UserScript==
// @name         Execute Script
// @namespace    http://tampermonkey.net/
// @version      0.4
// @license      MIT
// @description  Runs booking functions at given urls
// @author       Me
// @match        https://topup.chch.ox.ac.uk/BlockBook.aspx?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ox.ac.uk
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/444892/Execute%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/444892/Execute%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function bookFormal() {

        document.getElementById("lstSession").value = "D"

        document.getElementById("lstSitting").value = 2

        document.getElementById("ContentPlaceHolder1_chkSun").checked = true
        document.getElementById("ContentPlaceHolder1_chkMon").checked = true
        document.getElementById("ContentPlaceHolder1_ChkTue").checked = true
        document.getElementById("ContentPlaceHolder1_chkWed").checked = true
        document.getElementById("ContentPlaceHolder1_chkThurs").checked = true
        document.getElementById("ContentPlaceHolder1_chkFri").checked = true
        document.getElementById("ContentPlaceHolder1_chkSat").checked = true

        //document.getElementById("ContentPlaceHolder1_lstDietary_2").checked = true

        //document.getElementById("ContentPlaceHolder1_txtDietaryInfo").innerHTML = "I don't care if it's free, take the gluten out the damn bread"

        document.getElementById("ContentPlaceHolder1_btnBlockBook").click()

    }

    function bookInformal() {

        document.getElementById("lstSession").value = "D"

        document.getElementById("lstSitting").value = 1

        document.getElementById("ContentPlaceHolder1_chkSun").checked = true
        document.getElementById("ContentPlaceHolder1_chkMon").checked = true
        document.getElementById("ContentPlaceHolder1_ChkTue").checked = true
        document.getElementById("ContentPlaceHolder1_chkWed").checked = true
        document.getElementById("ContentPlaceHolder1_chkThurs").checked = true
        document.getElementById("ContentPlaceHolder1_chkFri").checked = true
        document.getElementById("ContentPlaceHolder1_chkSat").checked = true

        //document.getElementById("ContentPlaceHolder1_lstDietary_2").checked = true

        //document.getElementById("ContentPlaceHolder1_txtDietaryInfo").innerHTML = "I don't care if it's free, take the gluten out the damn bread"

        document.getElementById("ContentPlaceHolder1_btnBlockBook").click()

    }

    if (window.location.href == "https://topup.chch.ox.ac.uk/BlockBook.aspx?autobook=formal") {
        bookFormal()
    }

    if (window.location.href == "https://topup.chch.ox.ac.uk/BlockBook.aspx?autobook=informal") {
        bookInformal()
    }

})();