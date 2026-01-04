// ==UserScript==
// @name         Seterra for speedrunners
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Doesn't change the game mechanics, only visual stuff
// @author       Carus (feat. GPT-3)
// @license      MIT
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470846/Seterra%20for%20speedrunners.user.js
// @updateURL https://update.greasyfork.org/scripts/470846/Seterra%20for%20speedrunners.meta.js
// ==/UserScript==

// ALL LINES COMMENTED WITH "⚠ ⚠ ⚠" must be adjusted depending on your setup

(function() {
  'use strict';
// ------------------------------- Add mean time by question counter -------------------------------

  // Convert time to ms
  function tempsTexteToMillisecondes(tempsTexte) {
    var parties = tempsTexte.split(':');
    var minutes = parseInt(parties[0]);
    var secondes = parseFloat(parties[1].replace(',', '.'));

    var tempsEnMillisecondes = minutes * 60000 + secondes * 1000;
    return tempsEnMillisecondes;
  }

  // Execute when target div appears
  function executerScriptQuandPresent() {
    // Check if "score-modal_scoreModal__rtmEE" is present
    var scoreModalDiv = document.querySelector('.score-modal_scoreModal__rtmEE');
    if (scoreModalDiv && !scoreModalDiv.dataset.executed) {
      // Prevent infinite loop
      scoreModalDiv.dataset.executed = true;

      // Collect all divs with class = "label_sizeXLarge__N1iE_"
      var divsCibles = document.querySelectorAll('.label_sizeXLarge__N1iE_');

      // Collect time in text in the second div
      var tempsTexte = divsCibles[1].textContent;

      // Convert time into ms
      var tempsEnMillisecondes = tempsTexteToMillisecondes(tempsTexte);

      // Count questions
      var nombreDivs = document.querySelectorAll('li.area-list_listItem__SVHpB').length;

      // Divide time by the number of questions
      var tempsMoyenSecondes = tempsEnMillisecondes / 1000 / nombreDivs;

      // Create new div
      var nouveauDiv = document.createElement('div');

      // Add class to the new div (not useful at the moment)
      nouveauDiv.className = 'meantime';

      // Write mean time by question in s.ms format
      nouveauDiv.textContent = "t/q : " + tempsMoyenSecondes.toFixed(3);

      // Select the results pannel div "initial-score-view_result__b0EVM"
      var resultatDiv = document.querySelector('.initial-score-view_result__b0EVM');
      // Append the new div to the results
      resultatDiv.appendChild(nouveauDiv);
    }
  }

  // Create mutation observer
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        executerScriptQuandPresent();
      }
    });
  });

  // Observation options
  var options = {
    childList: true,
    subtree: true
  };

  // Select node
  var bodyNode = document.body;

  // Observe node with options
  observer.observe(bodyNode, options);

// ------------------------------- Remove "Click on" -------------------------------

function supprimerPremiereLigne() {
  // Select div "game-tooltip_tooltip__iJM_6"
  const tooltipDiv = document.querySelector('.game-tooltip_tooltip__iJM_6');

  // Check if div has text
  if (tooltipDiv && tooltipDiv.firstChild && tooltipDiv.firstChild.nodeType === Node.TEXT_NODE) {
    // Get text
    const textePremiereLigne = tooltipDiv.firstChild.textContent;

    // Check if div starts with "Click on"
    if (textePremiereLigne.startsWith('Click on')) { // Replace "Click on" on this line with the translation in your language and keep the single quotation marks ⚠ ⚠ ⚠
      // Remove "Click on"
      tooltipDiv.firstChild.remove();
    }
  }
}

// Execute every second
setInterval(supprimerPremiereLigne, 1000);

// ------------------------------- Change appearance -------------------------------

function modifyCSS(element, properties) {
  for (const property in properties) {
    element.style[property] = properties[property];
  }
}

// Select css classes
function modifyDivs() {
  const tooltipDiv = document.querySelector('.game-tooltip_tooltip__iJM_6');
  const labelBoxDiv = document.querySelector('.map-styles_labelBox__s5xsm');
  const labelVisibleDiv = document.querySelector('.label-flash_labelVisible__58deG');
  const correctFlash = document.querySelector('.correct-flash_wrapper__jONHo');
  const countryBordersDivs = document.querySelectorAll('.map-question_question__xQovH .map-question_hitbox__HqANz');

  // Cursor label
  if (tooltipDiv) {
    modifyCSS(tooltipDiv, {
      backgroundColor: 'rgba(0, 0, 0, 0)',
      color: 'yellow',
      textShadow: '2px 0 #000, -3px 0 #000, 0 3px #000, 0 -3px #000, 1px 1px #000, -1px -1px #000, 1px -1px #000, -1px 1px #000',
      position: 'fixed',
      fontSize: '1.8em',
      // Disgraceful way of changing the position of the cursor label, but it works
      marginLeft: '20%', // Depends on screen width, adjust the value ⚠ ⚠ ⚠
      marginTop: '-4%' // Depends on how much the page is scrolled, adjust the value ⚠ ⚠ ⚠
    });
  }

  // Country labels
  if (labelBoxDiv) {
    modifyCSS(labelBoxDiv, {
      display: 'none'
    });
  }
  // Country labels
  if (labelVisibleDiv) {
    modifyCSS(labelVisibleDiv, {
      display: 'none'
    });
  }

  // Correct answer flashes
  if (correctFlash) {
    modifyCSS(correctFlash, {
      display: 'none'
    });
  }

  // Country borders
  countryBordersDivs.forEach(div => {
    modifyCSS(div, {
      stroke: '#000', // Adjust the color if you have a "dark mode" browser addon of some kind ⚠ ⚠ ⚠
      strokeWidth: '1px', // Can change depending on the size of the map ⚠ ⚠ ⚠
      transition: 'fill 0s ease'
    });
  });
}

// Execute constantly as fast as possible !!!!!!
setInterval(modifyDivs, 1); // Should be capped by your browser, but increase the value if there is lag (1000 = 1 second) ⚠ ⚠ ⚠


})();

