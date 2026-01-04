// ==UserScript==
// @name         Multi Search on Google
// @namespace    https://www.youtube.com/channel/UCt7HddEns2mcAoRTyn564Xg
// @version      2.1
// @description  Search something multiple times with different values on Google
// @author       Jakegeyer27 & Kelts360
// @match        *://www.google.com.au/*
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/39796/Multi%20Search%20on%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/39796/Multi%20Search%20on%20Google.meta.js
// ==/UserScript==

//variables
var searchbox = document.getElementById("lst-ib");
var variables = [];
var amount = null;
var num = 0;
var search = null;

function1();

function function1() {
    if (searchbox.value.includes("??")) {
        var variables = prompt("Enter variables seperated by a comma","1, 2, 3").split(", ");
        var amount = variables.length;
        window.close();
        for (num = 0; num < amount; num++) {
            var search = searchbox.value.replace("??", variables[num]);
            window.open('https://www.google.com.au/?#q=' + search);
} relay();
} else {
    relay();
}
}

//Stops the script re-running once completed
function relay() {
    relay();
}