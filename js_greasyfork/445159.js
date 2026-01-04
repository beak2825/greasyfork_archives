// ==UserScript==
// @name         Execute Script
// @namespace    http://tampermonkey.net/
// @version      0.7
// @license      MIT
// @description  Runs booking functions at given urls
// @author       Me
// @match        https://topup.chch.ox.ac.uk/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ox.ac.uk
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/445159/Execute%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/445159/Execute%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create button elements:
    var button1 = document.createElement("button");
    var button2 = document.createElement("button");
    button1.innerText = "Book Formal Hall";
    button2.innerText = "Book Informal Hall";

    // Append to body:
    document.body.appendChild(button1);
    document.body.appendChild(button2);

    button1.onclick = redirectFormal;
    button2.onclick = redirectInformal;

    //var date1 = document.getElementById("ContentPlaceHolder1_dateFromText").min
    //var date2 = document.getElementById("ContentPlaceHolder1_dateToText").max

    if (window.location.href == "https://topup.chch.ox.ac.uk/Main.aspx?gobackagain") {
        redirectInformal()
    }

    else if (document.getElementById("ContentPlaceHolder1_dateFromText").min == document.getElementById("ContentPlaceHolder1_dateToText").max) {
        window.location.href = "https://topup.chch.ox.ac.uk/Main.aspx?gobackagain"
    }

    else if (window.location.href == "https://topup.chch.ox.ac.uk/BlockBook.aspx?autobook=formal") {
        bookFormal()
    }

    else if (window.location.href == "https://topup.chch.ox.ac.uk/BlockBook.aspx?autobook=informal") {
        bookInformal()
    }


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

        var date1 = document.getElementById("ContentPlaceHolder1_dateFromText").min
        document.getElementById("ContentPlaceHolder1_dateFromText").value = date1

        var date2 = document.getElementById("ContentPlaceHolder1_dateToText").max
        document.getElementById("ContentPlaceHolder1_dateToText").value = date2

        //document.getElementById("ContentPlaceHolder1_lstDietary_2").checked = true

        //document.getElementById("ContentPlaceHolder1_txtDietaryInfo").innerHTML = "I don't care if it's free, take the gluten out the damn bread"

        //document.getElementById("ContentPlaceHolder1_btnBlockBook").click()
        clickButton()

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

        var date1 = document.getElementById("ContentPlaceHolder1_dateFromText").min
        document.getElementById("ContentPlaceHolder1_dateFromText").value = date1

        var date2 = document.getElementById("ContentPlaceHolder1_dateToText").max
        document.getElementById("ContentPlaceHolder1_dateToText").value = date2

        //document.getElementById("ContentPlaceHolder1_lstDietary_2").checked = true

        //document.getElementById("ContentPlaceHolder1_txtDietaryInfo").innerHTML = "I don't care if it's free, take the gluten out the damn bread"

        //document.getElementById("ContentPlaceHolder1_btnBlockBook").click()
        clickButton()

    }

    function clickButton() {

        document.getElementById("ContentPlaceHolder1_btnBlockBook").click()
    }

    function redirectInformal() {

        window.location.href = "https://topup.chch.ox.ac.uk/BlockBook.aspx?autobook=informal"

    }

    function redirectFormal() {

        window.location.href = "https://topup.chch.ox.ac.uk/BlockBook.aspx?autobook=formal"

    }

})();