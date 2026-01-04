// ==UserScript==
// @name         Goatlings: Bean Grinder
// @version      0.4
// @description  im killing jesters for beans what has my life come to
// @author       twitter.com/RotomDex
// @match        http://www.goatlings.com/*
// @namespace    https://greasyfork.org/users/248719
// @downloadURL https://update.greasyfork.org/scripts/381461/Goatlings%3A%20Bean%20Grinder.user.js
// @updateURL https://update.greasyfork.org/scripts/381461/Goatlings%3A%20Bean%20Grinder.meta.js
// ==/UserScript==

var timeoutID;
var DelayMax = 1500;
var DelayMin = 500;
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

//Exploring the land for BEANS
var content = document.body.textContent || document.body.innerText;
var Explore = content.indexOf("You are currently exploring Misty Meadows 4")!==-1;
if(Explore){
    var noTurns = content.indexOf("You've run out of turns!")!==-1;
    if(noTurns){
        setTimeout (function() {location.href = "http://www.goatlings.com/explore/create/5/"+token;}, DelayMin );}
    var battleOption = content.indexOf("Would you like to battle?")!==-1;
    if (battleOption){
        var OrangeBogg = content.indexOf("Orange Bogg")!==-1;
        if(OrangeBogg){
            setTimeout (function() {location.href = "http://www.goatlings.com/explore/clearchal/16"; }, (Math.round(Math.random() * (DelayMax - DelayMin)) + DelayMin));}
        var Jestling = content.indexOf("Jestling")!==-1;
        if(Jestling){
            setTimeout (function() {location.href = "http://www.goatlings.com/explore/clearchal/56"; }, (Math.round(Math.random() * (DelayMax - DelayMin)) + DelayMin));}
        var GiantBeak = content.indexOf("War Beak")!==-1;
        if(GiantBeak){
            setTimeout (function() {location.href = "http://www.goatlings.com/explore/clearchal/17"; }, (Math.round(Math.random() * (DelayMax - DelayMin)) + DelayMin));}
        var Shamrock = content.indexOf("Shamrock")!==-1;
        if(Shamrock){
            setTimeout (function() {location.href = "http://www.goatlings.com/explore/clearchal/33"; }, (Math.round(Math.random() * (DelayMax - DelayMin)) + DelayMin));}
        var BeanBoi = content.indexOf("??? has appeared! Would you like to battle?")!==-1;
        if(BeanBoi){
            setTimeout (function() {location.href = "http://www.goatlings.com/battle/create_temp"; }, (Math.round(Math.random() * (DelayMax - DelayMin)) + DelayMin));}}
    else {
        setTimeout (function() {location.href = "http://www.goatlings.com/explore/view/play/"+token;}, (Math.round(Math.random() * (DelayMax - DelayMin)) + DelayMin));}}

//If we're not in an Explore area somehow
var notInArea = content.indexOf("ERROR: You are not in a Explore Area! Go Back")!==-1;
if (notInArea){
    setTimeout (function() {location.href = "http://www.goatlings.com/explore/create/5/"+token;}, (Math.round(Math.random() * (DelayMax - DelayMin)) + DelayMin));}

//In battle
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

//Battle Over
var lowHealth = new RegExp('^1\/');
var HPValue = document.getElementsByClassName('HP');
if (url === 'http://www.goatlings.com/battle/over'){
    for(var i = 0; i < HPValue.length; i++){
        if(lowHealth.test(HPValue[i].innerHTML)){
            setTimeout (function() {location.href = "http://www.goatlings.com/fountain";}, 50);}
        setTimeout (function() {location.href = "http://www.goatlings.com/battle/challengers";}, DelayMin);}}

//Going to heal pet
if(url === 'http://www.goatlings.com/fountain'){
    var healt = content.indexOf("[NOTICE] - You have healed all your pets.")!==-1;
    if (!healt){
        setTimeout (function() {document.getElementsByTagName('form')[1].submit();}, (Math.round(Math.random() * (DelayMax - DelayMin)) + DelayMin));}
    else {
        setTimeout (function() {location.href = "http://www.goatlings.com/explore/view";}, DelayMin);}}

//Attempted to start another battle when we're already in one
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