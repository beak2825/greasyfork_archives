// ==UserScript==
// @name        WhichFaceIsReal Score Keeper
// @namespace   Violentmonkey Scripts
// @namespace2  https://github.com/deltabravozulu/usefulUserScripts
// @match       *://www.whichfaceisreal.com/*
// @grant       none
// @version     4.20.69
// @author      DeltaBravoZulu
// @description Test your human identification skills! This script keeps score for you on whichfaceisreal.com since they don't have that built in
// @description 2/18/2022, 1:23:53 PM
// @run-at      document-idle
// @license     PayMe
// @downloadURL https://update.greasyfork.org/scripts/440286/WhichFaceIsReal%20Score%20Keeper.user.js
// @updateURL https://update.greasyfork.org/scripts/440286/WhichFaceIsReal%20Score%20Keeper.meta.js
// ==/UserScript==

// Make sure page loads before starting
new MutationObserver(check).observe(document, {
  childList: true,
  subtree: true
})

function check (changes, observer) {
  if (
    document.querySelector('#bs-example-navbar-collapse-1 > ul > li:nth-child(6)')
  ) {
    observer.disconnect()
    doIt()
  }
}

function doIt () {
  let cor = 0
  let incor = 0
  let correct; let corElement = document.querySelector('html>body>div>div>div>p')
  if (corElement != null) {
    correct = document.querySelector('html>body>div>div>div>p').textContent.includes('You are correct')
  } else {
    correct === false
  }
  let incorrect; let incorElement = document.querySelector('html>body>div>div>div>p')
  if (incorElement != null) {
    incorrect = document.querySelector('html>body>div>div>div>p').textContent.includes('You are incorrect')
  } else {
    incorrect === false
  }

  function corScore () {
    // Get Item from LocalStorage or correctCount === 0
    let correctCount = parseInt(localStorage.getItem('correctCount'), 10) || parseInt(0, 10)

    if (typeof correct !== 'undefined') {
      if (correct === true) {
        cor += 1
      }
    }
    if (cor > 0) {
      // Set the score to the users' current points
      correctCount = parseInt(correctCount, 10) + parseInt(cor, 10)
      // Store the score
      localStorage.setItem('correctCount', parseInt(correctCount, 10))
    }

    // Return the high score
    return correctCount
  }

  function incorScore () {
    // Get Item from LocalStorage or incorrectCount === 0
    let incorrectCount = parseInt(localStorage.getItem('incorrectCount'), 10) || parseInt(0, 10)

    if (incorrect === true) { incor += 1 }
    if (incor > 0) {
      // Set the score to the users' current points
      incorrectCount = parseInt(incorrectCount, 10) + parseInt(incor, 10)
      // Store the score
      localStorage.setItem('incorrectCount', parseInt(incorrectCount, 10))
    }

    // Return the high score
    return incorrectCount
  }

  function getScore () {
    let currentCorScore = parseInt(localStorage.getItem('correctCount'), 10)
    let currentInCorScore = parseInt(localStorage.getItem('incorrectCount'), 10)

    function nukeScore () {
      localStorage.setItem('correctCount', 0)
      localStorage.setItem('incorrectCount', 0)
      document.querySelector('#inject').remove()
      getScore()
    }
    console.log('Correct: ' + currentCorScore)
    console.log('Incorrect: ' + currentInCorScore)
    htmlInject = '<div id="inject"></div>'
    document.querySelector('body > nav').insertAdjacentHTML('afterend', htmlInject)
    scoreInject = '<div id="score"><center><span class="correct" id="correct" style="color:#137333">&nbsp;&nbsp;Correct: <strong>' + currentCorScore + '</strong></span><span>&nbsp;&#09;&nbsp;&#09;&nbsp;</span><span class="incorrect" id="incorrect" style="color:#B31412"> Incorrect: <strong>' + currentInCorScore + '</strong></span></center></div>'
    document.querySelector('#inject').insertAdjacentHTML('afterbegin', scoreInject)
    buttonInject = '<div><center><button id="resetter" style="font-size:.5em">Reset?</button></center></div>'
    document.querySelector('#score').insertAdjacentHTML('afterend', buttonInject)
    document.getElementById('resetter').addEventListener('click', nukeScore)
  }
  corScore()
  incorScore()
  getScore()
}
