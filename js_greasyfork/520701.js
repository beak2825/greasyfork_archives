// ==UserScript==
// @name         Yohoho.io Cheats
// @namespace    http://yohoho.io/
// @version      1.2.1
// @description  Cheats for the popular IO game, Yohoho.IO! Press 'p' to change your pet. 'l' to change the pet's level, 'x' to change your xp, 'i' to change your island, 'c' to change your character, and 'o' to change your coins.
// @author       Steviegt6
// @match        https://yohoho.io/
// @match        http://yohoho.io/
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant        none
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/391387/Yohohoio%20Cheats.user.js
// @updateURL https://update.greasyfork.org/scripts/391387/Yohohoio%20Cheats.meta.js
// ==/UserScript==

// =-=-=-=-=-=-=-=-=-=-+-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-+-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-+-=-=-=-=-=-=-=-=-=-=-
// Contact Info:
// Steviegt6#9616 (discord)
// Steviegt6 (github)
// https://steviegt6/github.io/ (website)
// https://discordapp.com/invite/tYzEbqX (discord server)
// =-=-=-=-=-=-=-=-=-=-+-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-+-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-+-=-=-=-=-=-=-=-=-=-=-

// =-=-=-=-=-=-=-=-=-=-+-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-+-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-+-=-=-=-=-=-=-=-=-=-=-
// Version History:
// -=-=-=-=-
// v1.2.1 comments
// Added comments in code for easier-to-understand source code.
// -=-=-=-=-
// v1.2.0 update
// Added 'P' command (pet)
// Added 'L' command (pet level)
// Setting your coins now automatically reloads
// Setting your XP not automatically reloads
// -=-=-=-=-
// -=-=-=-=-
// v1.1.5 patch
// XP patch 2.0
// -=-=-=-=-
// v1.1.4 patch
// XP patch
// -=-=-=-=-
// v1.1.3 patch
// Patch
// -=-=-=-=-
// v1.1.2 qol/patch
// Small qol tweaks
// Fixed skin selection bugs
// You're allowed to view the skisn menu again
// -=-=-=-=-
// v1.1.1 patch
// Small bug fixes
// -=-=-=-=-
// v1.1.0 update
// Fixed many bugs.
// -=-=-=-=-
// v1.0.0 release
// Initial release. Buggy.
// -=-=-=-=-
// =-=-=-=-=-=-=-=-=-=-+-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-+-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-+-=-=-=-=-=-=-=-=-=-=-

// =-=-=-=-=-=-=-=-=-=-+-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-+-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-+-=-=-=-=-=-=-=-=-=-=-
// Guide:
// Press 'O' to set your coins to any value you want!
// Press 'P' to change your pet!
// Press 'C' to change your character!
// Press 'I' to change your island! 
// Press 'X' to set your XP to any value you want!
// Press 'L' to set your pet's level!
// =-=-=-=-=-=-=-=-=-=-+-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-+-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-+-=-=-=-=-=-=-=-=-=-=-

showCheats(); //Cheat function to display controls

document.title = "*HACKED* YoHoHo.io - pirate battle royale io game"; //Changes title name

document.addEventListener('keydown', cheats, false); //Checks for when you press a key

function showCheats() //Show cheats in side control area
{
    var box = document.getElementById("desktop-controls"); //Control box
    var controls = document.createElement("div"); //New div
    controls.className = "title2"; //Class name
    controls.id = "hackids"; //ID
    var hacks = document.getElementById("hackids"); //ID name
    var hackselement = document.createElement("div"); //New div
    var hackstextnode = document.createTextNode("I - Change your island (Conflicts with XP cheat.)" + " O - Gain a set amount of coins" + " P = Change your character, buggy" + " X = Set XP! (Conflicts with island cheat, buggy.)"); //Control text
    hackselement.appendChild(hackstextnode); //text node stuff
    var controlstextnode = document.createTextNode("Cheats"); //text node
    box.appendChild(controls); //append child
    box.appendChild(hackselement); //append child
}

function cheats(e) //keydown function cheats blah blah blah
{
    if (e.keyCode =="79") //O - Coins
    {
        var a = prompt("What would you like to set your coin coint to?"); //prompt
        if(isNaN(a)) //if not a number
        {
            alert("Oops! Something went wrong! Perhaps entering a number next time will solve the issue?")
        }
        else
        {
            localStorage.setItem("coinsOwned", a); //change coing count
            document.getElementById("homepage-booty").innerHTML = a; //changes coin count
            document.getElementById("skin-popup-booty").innerHTML = a; //changes coin count
            alert("Gold set! Reloading...") //reload message
            location.reload() //reloads
        }
    }
    else if (e.keyCode == "88") //X - XP
    {
        var x = prompt("What would you like to set your XP to?"); //prompt
        if(isNaN(x)) //if not a number
        {
            alert("Oops! Something went wrong! Perhaps entering a number next time will solve the issue?") //error message
        }
        else if (x >= 13500) //if equal to or greater that 13,500
        {
            localStorage.setItem("playerXP", 13500); //sets to 13,500
            alert("XP set! Reloading...") //reload message
            location.reload() //reloads
        }
        else if (x <= 0) //if less than or equal to 0
        {
            localStorage.setItem("playerXP", 0); //sets to 0
            alert("XP set! Reloading...")
            location.reload()
        }
        else
        {
            localStorage.setItem("playerXP", x); //etc.
            alert("XP set! Reloading...") //etc.
            location.reload() //etc.
        }
    }
    else if(e.keyCode == "67") //C - Character
    {
        var b = prompt("Which character would you like to become? Please pick a number between 1 and 35!") //prompt
        if (isNaN(b)) //if not a number
        {
            alert("Oops! something went wrong! Perhaps entering a number next time will solve the issue?") //error message
        }
        else if (b < 1 || b > 35) //if less than 1 or greatre than 35
        {
            alert("Oops! something went wrong! Please choose a number between 1 and 35!") //error message
        }
        else
        {
            localStorage.setItem("playerSkin", b); //sets skin
            alert("Skin selected! Reloading...") //etc.
            location.reload() //etc.
        }
    }
    else if(e.keyCode == "80") //P - Pet
    {
        var p = prompt("Which character would you like to become? Please pick a number between 1 and 7!") //etc.
        if (isNaN(p)) //etc.
        {
            alert("Oops! something went wrong! Perhaps entering a number next time will solve the issue?") //etc.
        }
        else if (p < 1 || p > 7) //if less than 1 or greater than 7
        {
            alert("Oops! something went wrong! Please choose a number between 1 and 7!") //etc.
        }
        else
        {
            localStorage.setItem("playerPet", p); //etc.
            alert("Pet selected! Reloading...") //etc.
            location.reload() //etc.
        }
    }
    else if(e.keyCode == "76") //L - Pet Level
    {
        var l = prompt("What level would you like your pet to be? Please pick a number between 1 and 14!") //etc.
        if (isNaN(l)) //etc.
        {
            alert("Oops! something went wrong! Perhaps entering a number next time will solve the issue?") //etc.
        }
        else if (l < 1 || l > 14) //if less than 1 or greater than 14
        {
            alert("Oops! something went wrong! Please choose a number between 1 and 14!") //etc.
        }
        else
        {
            localStorage.setItem("playerPetLevel", l); //etc.
            alert("Pet level selected! Reloading...") //etc.
            location.reload() //etc.
        }
    }
    else if(e.keyCode == "73") //I - Island
    {
        var c = prompt("Which island would you like to travel to?\n1 = Tortuga\n2 = Beach\n3 = Easter\n4 = Wreck\n5 = Aztec\n6 = Volcano\n7 = Village") //prompt (\n means like break)
        if(c == 1) //is exactly equal to one //0,140,700,2100,4400,7600,13500
        {
            localStorage.setItem("playerXP", 0);
            alert("Island set to Tortuga. Reloading...");
            location.reload()
        }
        else if(c == 2)
        {
            localStorage.setItem("playerXP", 140);
            alert("Island set to Beach. Reloading...");
            location.reload()
        }
        else if(c == 3)
        {
            localStorage.setItem("playerXP", 700);
            alert("Island set to Easter. Reloading...");
            location.reload()
        }
        else if(c == 4){
            localStorage.setItem("playerXP", 2100);
            alert("Island set to Wreck. Reloading...");
            location.reload()
        }
        else if(c == 5){
            localStorage.setItem("playerXP", 4400);
            alert("Island set to Aztec. Reloading...");
            location.reload()
        }
        else if(c == 6){
            localStorage.setItem("playerXP", 7600);
            alert("Island set to Volcano. Reloading...");
            location.reload()
        }
        else if(c == 7){
            localStorage.setItem("playerXP", 13500);
            alert("Island set to Volcano. Reloading...");
            location.reload()
        }
        else if(c != (1 || 2 || 3 || 4 || 5 || 6 || 7)){
            alert("Oops! Something went wrong! Please enter a number between 1 and 7!");
            location.reload()
        }
    }
}