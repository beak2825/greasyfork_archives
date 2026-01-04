// ==UserScript==
// @name         New Userscript BIT
// @namespace    hhttps://bitnyx.com/
// @version      0.1.1
// @description  try to take over the world!
// @author       You
// @match        https://bitnyx.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386804/New%20Userscript%20BIT.user.js
// @updateURL https://update.greasyfork.org/scripts/386804/New%20Userscript%20BIT.meta.js
// ==/UserScript==

var botRunning = false;
var intervalBot;

$(document).ready(function() {
    var tempo = 0;
    var tempomin = 0;
  
  	console.log('Iniciando...');

    intervalBot = setInterval(function() {
        if (!botRunning) {
            tempo++;
            if (tempo == 30) {
                tempo = 0;
                tempomin++;
                console.log('Passou ' + tempomin + ' minuto');
            }
            if (document.getElementById('timer') === null) {
                tempomin = 0;
                tempo = 0;
                botRunning = true;
                initBOT();
            }
        }
    }, 1000);
});

function initBOT(){
  console.log('Clicando...');
  document.getElementById('claim-button').click();
  
  var checkTimer = setInterval(function(){
    if (document.getElementById('timer') !== null){
      botRunning = false;
    }
  },1000)
}