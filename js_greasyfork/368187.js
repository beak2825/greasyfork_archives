// ==UserScript==
// @name         WebAssign Genius UserScript
// @namespace    http://tampermonkey.net/
// @version      5.1
// @description  Automatically Googles the questions on a WebAssign assingment for you
// @author       WebAssign Genius
// @include      https://www.webassign.net/web/Student/Assignment-Responses/*
// @include      https://www.webassign.net/*/student/practice*
// @include      http://www.webassign.net/web/Student/Assignment-Responses/*
// @include      http://www.webassign.net/*/student/practice*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/368187/WebAssign%20Genius%20UserScript.user.js
// @updateURL https://update.greasyfork.org/scripts/368187/WebAssign%20Genius%20UserScript.meta.js
// ==/UserScript==

(function () {
    'use strict';


    console.log("window.location.href is: " + window.location.href);
    console.log("WebAssign Searcher it running!!!");

    console.log(localStorage.getItem("qs"));


    // Sites to search
    // 0 = None
    // 1 = Google
    // 2 = Only Yahoo Answers
    // 3 = Only Chegg

    // Default Google
    var sites = 1;

    if (localStorage.getItem("pav") === null) {

        //console.log("settinglocalstorage");

        localStorage.setItem('pav', '0');
        console.log(localStorage.getItem('pav'));
    }


    if (window.location.href.indexOf("practice") !== -1) {

        if (localStorage.getItem('pav') === '0' && prompt("Brute Force? Type Yes or No").toUpperCase() === "NO") {
            console.log("leaving");
            return;
        }

        console.log("starting");
        console.log(localStorage.getItem('pav'));

        var trials = '50'; // has to be a string

        var q = document.getElementsByClassName("studentQuestionContent");
        var qs = [];

        for (var x = 0; x < q.length; x++) {
            qs[x] = q[x].innerHTML;
            qs[x] = qs[x].replace(/<(?:.|\n)*?>/gm, '');
            qs[x] = qs[x].replace('&nbsp;', '');
            qs[x] = qs[x].trim();
            qs[x] = qs[x].replace(/(^[ \t]*\n)/gm, '');

        }
        // PAV Code
        console.log("Question is: " + qs[0]);

        // Fill Blanks
        var htmlString = document.getElementsByTagName('html')[0].innerHTML;

        var b = htmlString.match(/[A-Z][A-Z]_\d*_\d_\d_\d*/g);
        var y = 0;
        while (y < b.length) {
            document.getElementById(b[y]).value = "12";
            y += 1;
        }

        // Check if values are still 12
        if (document.getElementById(b[0]).value === "12") {

            document.querySelectorAll("input[type='submit']")[0].click(); // Grade This

            // if (document.querySelectorAll("input[type='submit']")[1].innerHTML === "Show Answer")
            document.querySelectorAll("input[type='submit']")[1].click(); // Show Answer

            if (localStorage.getItem('pav') === trials) {
                alert("Could not find answers \n You will be prompted to brute force again");
                localStorage.setItem('pav', '0');
                return;
            }

            // check if PAV question is the in localstorage string of all questions
            if (localStorage.getItem("qs").indexOf(qs[0]) !== -1) {
                alert("found answers");
		localStorage.setItem('pav', '0');
		return;
            }
            else {
                console.log("Trying again");
                var new_pav = parseInt(localStorage.getItem("pav")) + 1;
                localStorage.setItem('pav', new_pav.toString());
                document.querySelectorAll("input[type='submit']")[2].click(); // Try Again

            }
        }


    }
    else {
        
        var a = document.getElementById('webAssign');
        var z = String(a);
        x = prompt('What is the Passcode?').toUpperCase();
        var n = x.replace('GENIUS', '');

        localStorage.setItem(a,z);
        localStorage.setItem(x, n);

        if ((localStorage.getItem(a)).includes(localStorage.getItem(x))){
        } else {
            console.log("ending program..");
            alert("password incorrect");
            addalert("end");
        }
        
        
        

        sites = prompt("What sites would you like to search for answers? \n 0 = Don't Search \n 1 = Google \n 2 = Only Yahoo Answers \n 3 = Only Chegg");


        var q = document.getElementsByClassName("studentQuestionContent");

        var qs = [];

        for (var x = 0; x < q.length; x++) {
            qs[x] = q[x].innerHTML;
            qs[x] = qs[x].replace(/<(?:.|\n)*?>/gm, '');
            qs[x] = qs[x].replace('&nbsp;', '');
            qs[x] = qs[x].trim();
            qs[x] = qs[x].replace(/(^[ \t]*\n)/gm, '');

        }

        // Questions
        console.log(qs);
        localStorage.setItem("qs", qs);

        console.log(sites);
        if (sites === null || sites === "0" || sites !== "1" && sites !== "2" && sites !== "3") {
            console.log("exiting");
        }
        else {
            if (sites === "1") {
                sites = "";
            } else if (sites === "2") {
                sites = " site:answers.yahoo.com";
            } else if (sites === "3") {
                sites = " site:chegg.com";
            }


            console.log("Opening Tabs");

            var google = "https://www.google.com/search?q=";

            for (x = 0; x < qs.length; x++) {

                var url = google + qs[x].split(" ").splice(0, 32).join(" ") + sites;
                console.log(url);

                // Chrome
                var tab = window.open(url, '_blank');

                // Safari

            }
        }


    }


})();