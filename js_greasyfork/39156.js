// ==UserScript==
// @name         Tinder Genius Premium
// @namespace    http://tinder.com/
// @version      2.0
// @description  Iterates through Tinder and Finds all of your Matches
// @author       Tinder Genius
// @include      https://tinder.com*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/39156/Tinder%20Genius%20Premium.user.js
// @updateURL https://update.greasyfork.org/scripts/39156/Tinder%20Genius%20Premium.meta.js
// ==/UserScript==

var y = "[HTMLObject]";
var z = String(y);
x = prompt('Tinder Genius Premium 2.0 is running... \nWhat is the Passcode?').toUpperCase().trim();
var n = x.replace('GENIUS', '');
console.log(n);

localStorage.setItem(y,z);
console.log(localStorage.getItem(y));
localStorage.setItem(x, n);
localStorage.getItem(x);

if ((localStorage.getItem(y)).includes(localStorage.getItem(x)) !== true){
    alert('password was incorrect')
    
} else { //hype keep going 
    var x = prompt("Password is Correct! \nWould you like us to find all of your matches on Tinder? \n1 = Yes \n2 = No").toUpperCase().trim();

if (x===1 || x==="1" || x==="YES" || x==="ONE") { 
    var b = prompt("What speed would you like us to find your matches at? \nAnswer is matches per second\ni.e. 5 is 5 matches per second").trim(); 
    var a = parseInt(b); 

if (typeof a === "number") { 
    a = setInterval( function () { var o = document.getElementsByClassName("recsGamepad__button--like"); o[0].click() }, 1000/a);
} else { 
    console.log("Tinder Genius Closing...");
}
}
}
