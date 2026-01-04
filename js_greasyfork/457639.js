// ==UserScript==
// @name         Bazos darkmode black
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  UWU
// @author       Lixidixy
// @match        https://*.bazos.cz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bazos.cz
// @grant        none
// @license MIT  i don't care
// @downloadURL https://update.greasyfork.org/scripts/457639/Bazos%20darkmode%20black.user.js
// @updateURL https://update.greasyfork.org/scripts/457639/Bazos%20darkmode%20black.meta.js
// ==/UserScript==

document.body.style.backgroundColor = "#202124";
document.querySelectorAll("*").forEach(function(element) {
element.style.color = "white";
});

const iconCells = document.querySelectorAll('.icontblcell');

iconCells.forEach(iconCell => {
iconCell.addEventListener('mouseover', () => {
iconCell.style.backgroundColor = '#797D7F';
});
iconCell.addEventListener('mouseout', () => {
iconCell.style.backgroundColor = '';
});
});

const listahElements = document.querySelectorAll('.listah');

listahElements.forEach(listahElement => {
listahElement.style.backgroundColor = '#333333';
});

const submitElements = document.querySelectorAll('[type="submit"]');

submitElements.forEach(submitElement => {
submitElement.style.backgroundColor = '#5E5E5E';
});

const elements = document.querySelectorAll('[name="cenado"], [name="cenaod"], [name="humkreis"], [name="hlokalita"], [name="rubriky"], [name="hledat"]');

elements.forEach(element => {
element.style.backgroundColor = '#A4A4A4';
});

setInterval(() => {
const actElements = document.querySelectorAll('.act');
actElements.forEach(actElement => {
actElement.style.backgroundColor = '#A4A4A4';
});

const actkatElements = document.querySelectorAll('.actkat');
actkatElements.forEach(actkatElement => {
actkatElement.style.backgroundColor = '#CECECE';
});
}, 200);

setTimeout(() => {
// Get the img element
var element = document.querySelector('img[src="/ukflag.jpg"]');

// Remove the element from the DOM
element.remove();
}, 0);

setTimeout(() => {
const imageElement = document.querySelector('img[src="https://www.bazos.cz/obrazky/bazos.svg"]');
if (imageElement) {
imageElement.parentNode.removeChild(imageElement);
}
}, 0);

setTimeout(() => {
// Get all elements with the class "pridati"
var eelements = document.querySelectorAll('.pridati');

// Set the background color of each element to #FF7600
eelements.forEach(function(eelement) {
eelement.style.backgroundColor = '#FF7600';
});
}, 0);
setTimeout(() => {
const inzeratyElements = document.querySelectorAll('.inzeraty.inzeratyflex');

inzeratyElements.forEach(inzeratyElement => {
inzeratyElement.style.backgroundColor = '#4C4C4C';
inzeratyElement.style.borderRadius = '10px';
inzeratyElement.style.margin = '5px';
});
}, 0);
setTimeout(() => {
const listainzeratElements = document.querySelectorAll('.listainzerat.inzeratyflex');

listainzeratElements.forEach(listainzeratElement => {
listainzeratElement.style.backgroundColor = '#333333';
});
}, 0);
setTimeout(() => {
const barvalevaElements = document.querySelectorAll('.barvaleva');

barvalevaElements.forEach(barvalevaElement => {
barvalevaElement.style.backgroundColor = '#333333';
});
}, 0);
setTimeout(() => {
const cislaElements = document.querySelectorAll('.cisla');

cislaElements.forEach(cislaElement => {
cislaElement.style.backgroundColor = '#FF7600';
});
}, 0);
setTimeout(() => {
const pageDotsElements = document.querySelectorAll('.flickity-page-dots');

pageDotsElements.forEach(pageDotsElement => {
pageDotsElement.style.backgroundColor = '#333333';
});
}, 0);
setTimeout(() => {
const obrazekflithumbElements = document.querySelectorAll('.obrazekflithumb');

obrazekflithumbElements.forEach(obrazekflithumbElement => {
obrazekflithumbElement.style.borderRadius = '5px';
obrazekflithumbElement.style.border = '2px solid #333333';
});
}, 0);
setTimeout(() => {
document.getElementsByClassName("listainzerat")[1].style.backgroundColor = "#FF7600";
document.getElementsByClassName("teldetail")[0].style.backgroundColor = "#FF3100";
}, 0);
setInterval(function(){
document.getElementsByClassName("listainzerat")[1].style.backgroundColor = "#FF7600";
document.getElementById("agentbutton").style.backgroundColor = "#333333";
document.getElementById("agentbutton").style.color = "white";
}, 500);
setTimeout(() => {
document.getElementsByClassName("oranzovy")[0].style.backgroundColor = "#333333";
}, 0);