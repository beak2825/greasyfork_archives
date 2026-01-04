// ==UserScript==
// @name         Tinder Genius II
// @namespace    http://tinder.com/
// @version      6.2
// @description  Iterates through Tinder and Finds all of your Matches
// @author       Tinder Genius
// @include      https://tinder.com*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/38909/Tinder%20Genius%20II.user.js
// @updateURL https://update.greasyfork.org/scripts/38909/Tinder%20Genius%20II.meta.js
// ==/UserScript==
alert("Running Tinder Genius 6.2");

var x = prompt("Should we tinder genius find all of your matches? \n1 = Yes \n2 = No").toUpperCase().trim(); 

if (x === "1" || x === "YES"){
a = setInterval( function () { var o = document.getElementsByClassName("recsGamepad__button--like"); o[0].click() }, 1000)
} else {
console.log("Tinder Genius Closing...")
}

