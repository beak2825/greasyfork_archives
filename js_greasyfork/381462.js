// ==UserScript==
// @name         Goatlings: Training Center Auto-Fighter
// @version      0.3
// @description  Bot that auto-fights the Training Baddy of choice.
// @author       twitter.com/RotomDex
// @namespace    https://greasyfork.org/users/248719
// @match        http://www.goatlings.com
// @match        http://www.goatlings.com/*
// @downloadURL https://update.greasyfork.org/scripts/381462/Goatlings%3A%20Training%20Center%20Auto-Fighter.user.js
// @updateURL https://update.greasyfork.org/scripts/381462/Goatlings%3A%20Training%20Center%20Auto-Fighter.meta.js
// ==/UserScript==

var challenger = 3;
/* Training Baddy Cheat Sheet
1 = 1-10 Apostrophe Training Baddy
2 = 11-20 Cootie Training Baddy
3 = 21-30 Spring Bunny Training Baddy
4 = 31-40 Trileaf Clover Training Baddy
5 = 41-50 Heatwave Training Baddy */

var timeoutID;
var DelayMin = 500;
var DelayMax = 1500;
var url = document.URL;

//Low HP defined as anything from 1-49 (sans 10, 20, 30, 40...)
var lowHealth = new RegExp('^[1-4]?[1-9]\/');

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
var equipment = ["Hero Sword", "Fire Axe", "Fire Blade", "Ice Sword"];

//Picking challenger
if(url === 'http://www.goatlings.com/battle/train_challengers'){
    setTimeout (function() {document.getElementsByTagName('form')[challenger].submit();}, (Math.round(Math.random() * (DelayMax - DelayMin)) + DelayMin));}

//Battle in progress
if (url === 'http://www.goatlings.com/battle/thebattle'){
    var youWin = content.indexOf("YOU WIN! CLICK HERE TO CONTINUE")!==-1;
    var noWeapon = content.indexOf("You have no items equipped to your Goatling.")!==-1;
    if (youWin){
        setTimeout (function() {location.href = "http://www.goatlings.com/battle/over";}, (Math.round(Math.random() * (DelayMax - DelayMin)) + DelayMin));}
    else {
        if (!noWeapon) {
            setTimeout (function() {location.href = "http://www.goatlings.com/battle/attack/"+weapon;}, (Math.round(Math.random() * (DelayMax - DelayMin)) + DelayMin));}
        else {
            alert("Equip a new weapon, fool.");
            setTimeout (function() {location.href = "http://www.goatlings.com/inventory";}, DelayMin);}}}

//Battle over
var HPValue = document.getElementsByClassName('HP');
if (url === 'http://www.goatlings.com/battle/over'){
    for(var i = 0; i < HPValue.length; i++){
        if(lowHealth.test(HPValue[i].innerHTML)){
            setTimeout (function() {location.href = "http://www.goatlings.com/fountain";}, 50);}}
    setTimeout (function() {document.getElementsByTagName('form')[1].submit();}, (Math.round(Math.random() * (DelayMax - DelayMin)) + DelayMin));}

//Going to heal
if(url === 'http://www.goatlings.com/fountain'){
    var healt = content.indexOf("[NOTICE] - You have healed all your pets.")!==-1;
    if (!healt){
        setTimeout (function() {document.getElementsByTagName('form')[1].submit();}, (Math.round(Math.random() * (DelayMax - DelayMin)) + DelayMin));}
    else {
        setTimeout (function() {location.href = "http://www.goatlings.com/battle/train_challengers";}, DelayMin);}}

//Tried to start a battle when there already is one
var alreadyBattle = content.indexOf("ERROR: You are already in a battle! Click here to continue.")!==-1;
if (alreadyBattle){
    setTimeout (function() {location.href = "http://www.goatlings.com/battle/thebattle";}, (Math.round(Math.random() * (DelayMax - DelayMin)) + DelayMin));}

//Pet too hungry to battle
var Hungry = content.indexOf("Your Goatling is too hungry to battle")!==-1;
if (Hungry){
    setTimeout (function() {location.href = "http://www.goatlings.com/inventory";}, DelayMin);
    alert("Feed pet");}

//Pet too sad to battle
var Unhappy = content.indexOf("Your Goatling is too unhappy to battle")!==-1;
if (Unhappy){
    setTimeout (function() {location.href = "http://www.goatlings.com/inventory";}, DelayMin);
    alert("Give pet toy");}