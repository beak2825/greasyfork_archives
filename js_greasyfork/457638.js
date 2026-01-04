// ==UserScript==
// @name         Bazos darkmode blue
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  UwU
// @author       Lixidixy
// @match        https://*.bazos.cz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bazos.cz
// @grant        none
// @license MIT  i don't care.
// @downloadURL https://update.greasyfork.org/scripts/457638/Bazos%20darkmode%20blue.user.js
// @updateURL https://update.greasyfork.org/scripts/457638/Bazos%20darkmode%20blue.meta.js
// ==/UserScript==

document.body.style.backgroundColor = "#202135";
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
listahElement.style.backgroundColor = '#333347';
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

// Set the background color of each element to #9964D7
eelements.forEach(function(eelement) {
eelement.style.backgroundColor = '#9964D7';
});
}, 0);
setTimeout(() => {
const inzeratyElements = document.querySelectorAll('.inzeraty.inzeratyflex');

inzeratyElements.forEach(inzeratyElement => {
inzeratyElement.style.backgroundColor = '#4B4B66';
inzeratyElement.style.borderRadius = '10px';
inzeratyElement.style.margin = '5px';
});
}, 0);
setTimeout(() => {
const listainzeratElements = document.querySelectorAll('.listainzerat.inzeratyflex');

listainzeratElements.forEach(listainzeratElement => {
listainzeratElement.style.backgroundColor = '#333347';
});
}, 0);
setTimeout(() => {
const barvalevaElements = document.querySelectorAll('.barvaleva');

barvalevaElements.forEach(barvalevaElement => {
barvalevaElement.style.backgroundColor = '#333347';
});
}, 0);
setTimeout(() => {
const cislaElements = document.querySelectorAll('.cisla');

cislaElements.forEach(cislaElement => {
cislaElement.style.backgroundColor = '#9964D7';
});
}, 0);
setTimeout(() => {
const pageDotsElements = document.querySelectorAll('.flickity-page-dots');

pageDotsElements.forEach(pageDotsElement => {
pageDotsElement.style.backgroundColor = '#333347';
});
}, 0);
setTimeout(() => {
const obrazekflithumbElements = document.querySelectorAll('.obrazekflithumb');

obrazekflithumbElements.forEach(obrazekflithumbElement => {
obrazekflithumbElement.style.borderRadius = '5px';
obrazekflithumbElement.style.border = '2px solid #333347';
});
}, 0);
setTimeout(() => {
document.getElementsByClassName("nadpismenu")[0].style.backgroundColor = "#9964D7";
document.getElementsByClassName("listainzerat")[1].style.backgroundColor = "#9964D7";
document.getElementsByClassName("teldetail")[0].style.backgroundColor = "#FF3100";
}, 0);
setInterval(function(){
document.getElementsByClassName("listainzerat")[1].style.backgroundColor = "#9964D7";
document.getElementById("agentbutton").style.backgroundColor = "#333347";
document.getElementById("agentbutton").style.color = "white";
}, 500);
setTimeout(() => {
document.getElementsByClassName("oranzovy")[0].style.backgroundColor = "#333347";
}, 0);