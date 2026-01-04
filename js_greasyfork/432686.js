// ==UserScript==
// @name         Nob!
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Heck you Juice1313
// @author       MYTH_doglover
// @match        https://bonk.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432686/Nob%21.user.js
// @updateURL https://update.greasyfork.org/scripts/432686/Nob%21.meta.js
// ==/UserScript==
 
 
document.getElementById('classic_mid').onmouseover = function(){
 
document.getElementById('pretty_top_name').innerHTML =
document.getElementById('pretty_top_name').innerHTML.replace(/Juice1313/g, "GudStrat Simp");
 
 
};
 
document.getElementById('roomlistjoinbutton').onclick = function(){
 
var juicebox = document.getElementsByClassName("newbonklobby_playerbox_elementcontainer").childNodes[1];
 
document.getElementById('newbonklobby').onmouseover = function(){
 
juicebox.innerHTML =
juicebox.innerHTML.replace(/Juice1313/g, "GudStrat Simp");
 
}}
 
document.getElementById('roomlistcreatecreatebutton').onclick = function(){
 
var juicebox = document.getElementsByClassName("newbonklobby_playerbox_elementcontainer").childNodes[1];
 
document.getElementById('newbonklobby').onmouseover = function(){
 
juicebox.innerHTML.replace(/Juice1313/g, "GudStrat Simp");
 
}}