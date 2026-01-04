// ==UserScript==
// @name         Neopets: crosswords filler
// @author       Tombaugh Regio
// @version      1.1
// @description  Scrapes crossword answers from Jellyneo and fills in crossword
// @namespace    https://greasyfork.org/users/780470
// @match        https://www.jellyneo.net/?go=faerie_crossword
// @match        http://www.neopets.com/games/crossword/crossword.phtml
// @license      MIT
// @grant        GM.getValue
// @grant        GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/431662/Neopets%3A%20crosswords%20filler.user.js
// @updateURL https://update.greasyfork.org/scripts/431662/Neopets%3A%20crosswords%20filler.meta.js
// ==/UserScript==

if (/jellyneo/.test(window.location.href)) {
  const getAnswers = (column) => Array.from(column.querySelector('p').childNodes).reduce((a, b) => (b.nodeName == '#text') ? [...a, b.textContent.match(/\d{1,2}|(?<=. )\S+/g)[1]] : a, [])
  const [across, down] = document.querySelectorAll('.panel td')
  
  const ANSWERS = [...getAnswers(across), ...getAnswers(down)]

  GM.setValue('crosswordAnswers', JSON.stringify(ANSWERS))
}

if (/neopets\.com/.test(window.location.href)) {
  GM.getValue('crosswordAnswers', [])
    .then(function(response) {
      const ANSWERS = JSON.parse(response)
      
      Array.from(Array.from(document.querySelectorAll(".content tbody tr")).reverse()[0].querySelectorAll("td a")).forEach(function(question, i) {
        const clickFunction = question.onclick

        question.onclick = function() {
          document.querySelector('input[name="x_word"]').value = ANSWERS[i]
          clickFunction()
          document.querySelector('input[value="Go"]').click()
        }
      })
  })
}