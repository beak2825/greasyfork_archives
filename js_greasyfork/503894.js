// ==UserScript==
// @name        answer suggestr
// @namespace   Violentmonkey Scripts
// @match       https://www.geoguessr.com/*
// @grant       none
// @version     1.0
// @author      cosmoMP
// @license MIT 
// @description This script will suggest answers as you type them so you don't have to type those long ones manually :)  8/16/2024
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @downloadURL https://update.greasyfork.org/scripts/503894/answer%20suggestr.user.js
// @updateURL https://update.greasyfork.org/scripts/503894/answer%20suggestr.meta.js
// ==/UserScript==

const disconnect = VM.observe(document.body, () => {
  // Find the target node
  const guess_input = document.querySelector('[data-qa="typing-mode-input"]')
  if (guess_input) {
    const guess_input = document.querySelector('[data-qa="typing-mode-input"]')
    const answers_from_game = document.querySelector('[data-qa="area-list"]')
    const answers_array = answers_from_game.getAttribute('data-area-labels').split(',')

    const datalist_id = 'answer-list'
    guess_input.setAttribute('list',datalist_id)

    const answers_datalist = document.createElement("datalist")
    answers_datalist.setAttribute('id',datalist_id)
    console.log('MP')
    for (const el of answers_array){
      const new_option = document.createElement("option")
      new_option.setAttribute('value',el)
      answers_datalist.appendChild(new_option)

    }

    document.body.appendChild(answers_datalist)

    // disconnect observer
    return true;
  }
});

