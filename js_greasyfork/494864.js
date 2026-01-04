// ==UserScript==
// @name         Average Calculator
// @version      1.3
// @description  Calculate the average of two numbers with light/dark mode for easy use. Please use Tampermonkey to install this script.
// @match        *://*/*
// @grant        none
// @author       Codification
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @license MIT
// @namespace https://sites.google.com/view/codification-
// @downloadURL https://update.greasyfork.org/scripts/494864/Average%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/494864/Average%20Calculator.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var html = `
    <div id="average-calculator" style="position: fixed; bottom: 20px; left: 20px; background-color: #fff; border: 1px solid #ccc; border-radius: 5px; padding: 20px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
      <h2 id="calculator-title" style="margin-top: 0; color: #333;">Average Calculator</h2>
      <input type="number" id="num1" placeholder="Number 1" style="width: 100%; margin-bottom: 10px; padding: 8px; border-radius: 4px; border: 1px solid #ddd; box-sizing: border-box;">
      <input type="number" id="num2" placeholder="Number 2" style="width: 100%; margin-bottom: 10px; padding: 8px; border-radius: 4px; border: 1px solid #ddd; box-sizing: border-box;">
      <button id="calculate" style="background-color: #4CAF50; color: #fff; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;">Calculate Average</button>
      <p id="result" style="margin-top: 10px;"></p>
      <button id="dark-mode-toggle" style="position: absolute; top: 10px; right: 10px; background-color: #333; color: #fff; padding: 5px; border: none; border-radius: 50%; cursor: pointer;">🌙</button>
    </div>
  `;
  $('body').append(html);

  $('#num1, #num2').on('keydown', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      $('#calculate').click();
    }
  });

  $('#calculate').on('click', function() {
    var num1 = parseInt($('#num1').val(), 10);
    var num2 = parseInt($('#num2').val(), 10);
    if (isNaN(num1) || isNaN(num2)) {
      $('#result').html('<span style="color: #b50000;">Please enter valid numbers</span>');
    } else {
      var average = (num1 + num2) / 2;
      $('#result').html(`The average is: <span style="color: #4CAF50;">${average}</span>`);
    }
  });

  $('#dark-mode-toggle').on('click', function() {
    var calculator = $('#average-calculator');
    calculator.toggleClass('dark-mode');
    calculator.find('button').toggleClass('dark-mode-button');
    calculator.find('input').toggleClass('dark-mode-input');
    calculator.find('p').toggleClass('dark-mode-paragraph');
    var title = $('#calculator-title');

    if (calculator.hasClass('dark-mode')) {
      calculator.css('background-color', '#333');
      calculator.find('button').css('background-color', '#fff');
      calculator.find('button').css('color', '#333');
      calculator.find('input').css('background-color', '#444');
      calculator.find('input').css('color', '#fff');
      calculator.find('p').css('color', '#fff');
      title.css('color', '#fff');
      $('#dark-mode-toggle').html('☀️');
    } else {
      calculator.css('background-color', '#fff');
      calculator.find('button').css('background-color', '#4CAF50');
      calculator.find('button').css('color', '#fff');
      calculator.find('input').css('background-color', '#fff');
      calculator.find('input').css('color', '#333');
      calculator.find('p').css('color', '#333');
      title.css('color', '#333');
      $('#dark-mode-toggle').html('🌙');
    }
  });
})();
