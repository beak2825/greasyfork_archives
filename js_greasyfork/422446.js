// ==UserScript==
// @name         PassWord 56321786342137
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://moomoo.io/*
// @match        *://dev.moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();

let mouseX;
let mouseY;
var password = "thunder7";
var response;
var entryCount = 3;
var entryLimit = 5;
var error = false;
alert("Hello Human")
alert("Welcome to Tazer Mod")
alert("One of the Top Mod ")
alert(" You Better Know the Password")
alert("Or Else")
alert("Well You will Find Out")
alert("XD Put the password")
while(response != password && !error){
    if(entryCount < entryLimit){
        response = window.prompt("Put the password Nerd");
        entryCount++;
    } else {
        error = true;
    }
}

if(error){
    alert("You Better Delete This script");
} else {
    alert("Greeting AppleTacoYT or ♊⃟⃝☼ or xPlasmicc Welecome to Tazer Mod");
}