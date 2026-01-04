// ==UserScript==
// @name         arras.io | Dark Mode | BROKEN 
// @namespace    http://tampermonkey.net/
// @version      0.3.3
// @description  Reworked interface, dark and with more details. After an unknown update, the script no longer works. :(
// @author       VinnyR
// @match        https://*arras.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484698/arrasio%20%7C%20Dark%20Mode%20%7C%20BROKEN.user.js
// @updateURL https://update.greasyfork.org/scripts/484698/arrasio%20%7C%20Dark%20Mode%20%7C%20BROKEN.meta.js
// ==/UserScript==


document.getElementsByTagName('h1')[0].style.textShadow = 'White 0px 0px 7px';
document.body.style.backgroundColor = 'Black';


document.getElementById('optName').style.backgroundColor = '#1b1b1b';
document.getElementById('optName').style.color = '#8abc3f';
document.getElementById('optName').style.borderColor = '#8abc3f';
document.getElementById('optName').style.borderWidth = '2px';
document.getElementById('optName').style.textShadow = '#81AD41 0px 0px 4px';


document.getElementsByTagName('h1')[0].style.color = 'White';


document.getElementsByTagName('table')[0].style.backgroundColor = '#1b1b1b';


document.getElementById('canvas').style.backgroundColor = '#080808';


document.getElementsByClassName('startMenu')[0].style.backgroundColor = '#1b1b1b';


document.getElementById("startButton").style.borderBottom = '3px solid #62852d';
document.getElementById("startButton").style.color = 'Black';
document.getElementById("startButton").style.backgroundColor = '#8abc3f';


document.getElementById('patchNotes').style.background = '#8abc3f';
document.getElementById('patchNotes').style.borderRadius = '0px';
document.getElementById('patchNotes').style.backgroundColor = '#1b1b1b';
document.getElementById('patchNotes').style.color = '#8abc3f';


var separ = document.createElement('div');
document.getElementsByClassName('startMenu')[0].appendChild(separ);
separ.style.position = 'relative';
separ.style.left = '-369px';
separ.style.borderLeft = '4px solid #171717';


document.getElementsByClassName('serverSelector')[0].style.padding = '0px';
document.getElementsByClassName('serverSelector')[0].style.borderRadius = '5px';
document.getElementsByClassName('serverSelector')[0].style.border = '2px solid #8abc3f';


document.getElementsByClassName('shadowScroll')[0].style.backgroundColor = '#1b1b1b';
document.getElementsByClassName('shadowScroll')[0].style.background = '#1b1b1b';