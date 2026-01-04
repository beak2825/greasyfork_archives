// ==UserScript==
// @name         Goatlings: Battle Center Auto-Fighter
// @version      0.41
// @description  Auto-fights the baddy of choice in the Battle Center.
// @author       twitter.com/RotomDex
// @namespace    https://greasyfork.org/users/248719
// @match        http://www.goatlings.com/
// @match        http://www.goatlings.com/*
// @match        www.goatlings.com*
// @downloadURL https://update.greasyfork.org/scripts/381463/Goatlings%3A%20Battle%20Center%20Auto-Fighter.user.js
// @updateURL https://update.greasyfork.org/scripts/381463/Goatlings%3A%20Battle%20Center%20Auto-Fighter.meta.js
// ==/UserScript==

var challenger = 5;
// Challenger Form Cheat Sheet
// 1 = Trileaf Clover Minion 3   / Spring Bunny
// 2 = Lucky Pig                 / Spring Bunny Minion 1
// 3 = Trileaf Clover            / Lucky Pig
// 4 = Trileaf Clover Minion 1   / Spring Bunny Minion 2
// 5 = Trileaf Clover Minion 2   / Spring Bunny Minion 3

var timeoutID;
var DelayMin = 500;
var DelayMax = 1500;
var url = document.URL;

// Auth Token
var urls = [], l = document.links;
for(var h = 0; h < l.length; h++){
    urls.push(l[h].href)}
var list = urls.toString();
var pos = list.indexOf("logout");
var auth1 = pos + 7;
var auth2 = pos + 39;
var token = list.slice(auth1, auth2);
// End Auth Token

//Pick Weapon
var posweapon = list.indexOf("battle/attack/");
var eweapon = posweapon + 14;
var eweapon2 = posweapon + 20;
var weapon = list.slice(eweapon, eweapon2);
//End Picking Weapon

var content = document.body.textContent || document.body.innerText;

//Starting battle
if(url === 'http://www.goatlings.com/battle/challengers'){
    setTimeout (function() {document.getElementsByTagName('form')[challenger].submit();}, (Math.round(Math.random() * (DelayMax - DelayMin)) + DelayMin));}

//In-battle
if (url === 'http://www.goatlings.com/battle/thebattle'){
    var youWin = content.indexOf("YOU WIN! CLICK HERE TO CONTINUE")!==-1;
    var noWeapon = content.indexOf("You have no items equipped to your Goatling.")!==-1;
    if (youWin){
        setTimeout (function() {location.href = "http://www.goatlings.com/battle/over";}, (Math.round(Math.random() * (DelayMax - DelayMin)) + DelayMin));}
    else {
        if (!noWeapon) {
            setTimeout (function() {location.href = "http://www.goatlings.com/battle/attack/"+weapon;}, (Math.round(Math.random() * (DelayMax - DelayMin)) + DelayMin));}
        else {
            setTimeout (function() {location.href = "http://www.goatlings.com/inventory"}, (Math.round(Math.random() * (DelayMax - DelayMin)) + DelayMin));
            alert("Equip a weapon.");}}}

//Battle over page
var lowHealth = new RegExp('^[1-3]\/');
var HPValue = document.getElementsByClassName('HP');
if (url === 'http://www.goatlings.com/battle/over'){
    for(var i = 0; i < HPValue.length; i++){
        if(lowHealth.test(HPValue[i].innerHTML)){
            setTimeout (function() {location.href = "http://www.goatlings.com/fountain";}, 5)}
    setTimeout (function() {location.href = "http://www.goatlings.com/battle/challengers";}, (Math.round(Math.random() * (DelayMax - DelayMin)) + DelayMin))}}

//Going to heal
if(url === 'http://www.goatlings.com/fountain'){
    var healt = content.indexOf("[NOTICE] - You have healed all your pets.")!==-1;
    if (!healt){
        setTimeout (function() {document.getElementsByTagName('form')[1].submit();}, (Math.round(Math.random() * (DelayMax - DelayMin)) + DelayMin));}
    else {
        setTimeout (function() {location.href = "http://www.goatlings.com/battle/challengers";}, (Math.round(Math.random() * (DelayMax - DelayMin)) + DelayMin));}}

//Attempted to start a new battle when one already exists
var alreadyBattle = content.indexOf("ERROR: You are already in a battle! Click here to continue.")!==-1;
if (alreadyBattle){
    setTimeout (function() {location.href = "http://www.goatlings.com/battle/thebattle";}, (Math.round(Math.random() * (DelayMax - DelayMin)) + DelayMin));}

//Pet too hungry to battle
var Hungry = content.indexOf("Your Goatling is too hungry to battle")!==-1;
if (Hungry){
    setTimeout (function() {location.href = "http://www.goatlings.com/inventory";}, (Math.round(Math.random() * (DelayMax - DelayMin)) + DelayMin));
    alert("Feed pet.");}

//Pet too sad to battle
var Unhappy = content.indexOf("Your Goatling is too unhappy to battle")!==-1;
if (Unhappy){
    setTimeout (function() {location.href = "http://www.goatlings.com/inventory";}, (Math.round(Math.random() * (DelayMax - DelayMin)) + DelayMin));
    alert("Play with pet.");}