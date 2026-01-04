// ==UserScript==
// @name         bloxd.io PlayTime
// @namespace    http://tampermonkey
// @version      2.5
// @description  Muestra el tiempo transcurrido en bloxd.io.
// @match        https://bloxd.io/*
// @author       Nunte Gamer
// @grant        GM_addStyle
// @license      MT
// @downloadURL https://update.greasyfork.org/scripts/463737/bloxdio%20PlayTime.user.js
// @updateURL https://update.greasyfork.org/scripts/463737/bloxdio%20PlayTime.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    var startTime = localStorage.getItem('bloxdStartTime');
    if (!startTime) {
        startTime = Date.now();
        localStorage.setItem('bloxdStartTime', startTime);
    }
    var div = document.createElement('div');
    div.style.position = 'fixed';
    div.style.top = '10px';
    div.style.right = '10px';
    div.style.padding = '10px';
    div.style.backgroundColor = 'rgba(31, 139, 195, 0.9)';
    div.style.color = 'white';
    div.style.borderRadius = '10px';
    div.style.border = '1px solid black';
    div.style.zIndex = '9999';
    document.body.appendChild(div);
 
    var intervalId;
    var timeDiff = localStorage.getItem('bloxdTimeDiff');
    if (timeDiff) {
        startTime -= timeDiff;
        intervalId = setInterval(updateTime, 1000);
    } else {
        intervalId = setInterval(updateTime, 1000);
    }
 
    window.addEventListener('beforeunload', function() {
        clearInterval(intervalId);
        localStorage.setItem('bloxdTimeDiff', Date.now() - startTime);
    });
 
    window.addEventListener('load', function() {
        startTime = Date.now() - localStorage.getItem('bloxdTimeDiff');
        intervalId = setInterval(updateTime, 1000);
    });
 
    function updateTime() {
        var timeDiff = Date.now() - startTime;
        var hours = Math.floor(timeDiff / 3600000);
        var minutes = Math.floor((timeDiff % 3600000) / 60000);
        var seconds = Math.floor((timeDiff % 60000) / 1000);
        div.innerText = 'Tiempo en la página: ' + hours + 'h ' + minutes + 'm ' + seconds + 's';
    }
// Crea un elemento de texto en la esquina inferior izquierda de la pantalla
const textElement = document.createElement('div');
textElement.style.position = 'fixed';
textElement.style.bottom = '0';
textElement.style.left = '0';
textElement.style.color = 'blue';
textElement.style.fontSize = '14px';
textElement.style.padding = '10px';
textElement.style.backgroundColor = 'white';
textElement.style.borderTopRightRadius = '10px';
textElement.style.zIndex = '99999'; // coloca el elemento en la capa delantera
textElement.innerText = 'Timer script by Nunte Gamer';

// Añade el enlace a Twitter
const linkElement = document.createElement('a');
linkElement.href = 'https://twitter.com/GamerNunte';
linkElement.style.color = 'inherit';
linkElement.appendChild(textElement);

// Añade el elemento al cuerpo de la página
document.body.appendChild(linkElement);
})();