// ==UserScript==
// @name         Wordle regex solver by Sketch Engine
// @namespace    https://www.sketchengine.eu/
// @version      0.9
// @description  Helps you solve a Wordle puzzle by generating a regular expression. To look up possible solutions in a word list, Sketch Engine subscription is required (30-day free trial available, no card required).
// @author       Marek Blahuš of Lexical Computing
// @match        https://www.nytimes.com/games/wordle/index.html
// @icon         https://www.nytimes.com/games/wordle/images/NYT-Wordle-Icon-32.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445295/Wordle%20regex%20solver%20by%20Sketch%20Engine.user.js
// @updateURL https://update.greasyfork.org/scripts/445295/Wordle%20regex%20solver%20by%20Sketch%20Engine.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

var board = document.getElementsByTagName('game-app')[0].shadowRoot.getElementById('board');
board.innerHTML += '<div style="text-align: center"><a href="#" id="wordle-regex-ske-link">need help?</a></div>';
board.getElementById('wordle-regex-ske-link').addEventListener('click', wordle_regex_ske);

function wordle_regex_ske(){
  var absents='', presents='', incorrects=Array(5).fill(''), corrects=Array(5).fill('.');
  for(var d of Array.from(Array(6), (_, i) => document.querySelectorAll('game-app')[0].boardState[i] ? Array.from(Array(5), (_, j) => [document.querySelectorAll('game-app')[0].boardState[i][j], document.querySelectorAll('game-app')[0].evaluations[i][j], j]) : []).flat()) {
    switch(d[1]) {
      case "absent": if(!absents.includes(d[0])) absents += d[0]; break;
      case "present": if(!corrects.includes(d[0])) { if(!presents.includes(d[0])) presents += d[0]; if(!incorrects[d[2]].includes(d[0])) incorrects[d[2]] += d[0]; } break;
      case "correct": corrects[d[2]] = d[0]; presents = presents.replace(d[0], ''); incorrects = incorrects.map((v) => v.replace(d[0], '')); break;
      }
  }
  var regex = (absents && corrects.includes('.') ? '(?!.*'+(absents.length>1?'['+absents+']':absents)+')' : '') + (presents.split('').map((v) => '(?=.*'+v+')').join('')) + (incorrects.map((v, i) => v ? '(?!'+'.'.repeat(i)+(v.length>1?'['+v+']':v)+')' : '').join('')) + (corrects.join(''));
  if(confirm('Your regex is:\n'+regex+'\nProceed to Sketch Engine to see a word list? (Login required, free trial available.)')) window.open('https://app.sketchengine.eu/#wordlist?corpname=preloaded%2Fcoca&tab=advanced&keyword='+encodeURIComponent(regex)+'&filter=regex&wlattr=lc&wlminfreq=0&showresults=1&cols=%5B%22frq%22%5D');
}