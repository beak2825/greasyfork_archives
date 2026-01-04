
// ==UserScript==
// @name         MovingAverage with a summary of full history [[xXx MITY DEV xXx]]
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Average Sum of all bets(Session Only + History).
// @author       MiTyDEV
// @match        https://freebitco.in/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=freebitco.in
// @grant        none
// @licence MIT

// @downloadURL https://update.greasyfork.org/scripts/470815/MovingAverage%20with%20a%20summary%20of%20full%20history%20%5B%5BxXx%20MITY%20DEV%20xXx%5D%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/470815/MovingAverage%20with%20a%20summary%20of%20full%20history%20%5B%5BxXx%20MITY%20DEV%20xXx%5D%5D.meta.js
// ==/UserScript==

//-------- READ THIS ---------//
/*

BEFORE YOU MAKE ANY BET YOU NEED A NEW ACCOUNT TO READ HISTORY PROPERLY !! 
Support my work by registering at: https://freebitco.in/?r=10071414; 

*/
var roll = 0;
var nonce = 0;

var step = 0;

var sum = 0;
var gsum = 0;
var avg = 0;
var gavg = 0;

var switcher = false;

function calculate(){
  console.clear();
  setTimeout(function(){
    document.querySelector('#double_your_btc_bet_hi_button').disabled = true;
    document.querySelector('#double_your_btc_bet_lo_button').disabled = true;
    switcher = !switcher;
    if(switcher == true){
      sum = parseFloat(sum) + roll;

      step = step + 1;
      avg = sum / step;
      $('#double_your_btc_bet_hi_button').html(avg.toFixed(0));
      gsum = parseFloat(gsum) + roll;
      localStorage.setItem('globalsum', gsum);
      gavg = gsum / nonce;
      localStorage.setItem('globalavg', gavg);
      console.log('Summary: ' + sum);
      console.log('Average: ' + avg);
      console.log('Global Summary: ' + gsum);
      console.log('Global Average: ' + gavg);

      setTimeout(function(){
        document.querySelector('#double_your_btc_bet_hi_button').disabled = false;
        document.querySelector('#double_your_btc_bet_lo_button').disabled = false;
      },2000);
    }
  },2000);
}

$("#previous_roll").on("DOMSubtreeModified", function() {
  setTimeout(function(){
    roll = parseFloat($('#previous_roll').html());
  },3000);
});

$("#next_nonce").on("DOMSubtreeModified", function() {
  calculate();
  setTimeout(function(){
    nonce = parseFloat($("#next_nonce").html());
  },3000);
});

$(document).ready(function(){
  //----------Create Support Section --------------//
  var mainPlay = document.getElementById('double_your_btc_main_container');
  var divSupport = document.createElement('div');
  divSupport.className = 'support';
  mainPlay.appendChild(divSupport);

  //----------Show Eligible Bonus --------------//
  $("#bonus_eligible_msg").css("display", "block");

  //----------Configure Local Storage --------------//
  if(localStorage.getItem('globalavg') == null){
    localStorage.setItem('globalavg', '0');
  }else{
    gavg = localStorage.getItem('globalavg');
  }

  if(localStorage.getItem('globalsum') == null){
    localStorage.setItem('globalsum', '0');
  }else{
    gsum = localStorage.getItem('globalsum');
  }
  console.log('Global Summary: ' + gsum);
  console.log('Global Average: ' + gavg);
});
