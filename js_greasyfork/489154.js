// ==UserScript==
// @name        loop
// @namespace   Violentmonkey Scripts
// @match       https://loop.dcu.ie/mod/quiz/attempt.php
// @grant       none
// @version     1.0
// @author      Thibb1
// @license 
// @description 2/14/2024, 11:40:26 AM
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/489154/loop.user.js
// @updateURL https://update.greasyfork.org/scripts/489154/loop.meta.js
// ==/UserScript==

const model = 'gpt-3.5-turbo-instruct';
const temperature = 0.2;
const url = 'https://api.openai.com/v1/completions';

let key = GM_getValue("key", "");

if (!key) {
  key = prompt('Enter your key', 'https://beta.openai.com/account/api-keys');
  GM_setValue("key", key);
}

async function complete(prompt, max_tokens, type, el) {
  GM_xmlhttpRequest({
    method: "POST",
    url: url,
    data: JSON.stringify({
        model,
        prompt,
        max_tokens,
        temperature
    }),
    onload: function(res) {
      const json = JSON.parse(res.responseText);
      const text = json.choices[0]?.text;
      // console.log(text);
      if (type === "multichoice") {
        const choice = parseInt(text);
        if (isNaN(choice) || choice < 0 || choice >= el.length) {
          return;
        }
        el[choice].click();
      }
      if (type === "match") {
        const choice = parseInt(text);
        if (isNaN(choice) || choice < 0) {
          return;
        }
        el.value = choice;
      }
      if (type === "input") {
        el.value=text;
      }
    },
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
    }
  });
}

(function() {
  'use strict';
  window.onload = async () => {
    const forms = document.querySelectorAll('.que');
    let i = 0;
    forms.forEach((form) => {
      const question = form.querySelector('.qtext').textContent;
      let prompt = `${question}`;

      if (form.classList.contains("multichoice")) {
        const choices = form.querySelectorAll('[data-region="answer-label"]');
        const buttons = form.querySelectorAll('.answer input');
        choices.forEach((choice, idx) => {
          prompt += `\n${idx} ${choice.textContent}`;
        });
        prompt = `Answer the following with the correct number:\n${prompt}\n\nAnswer: `;
        complete(prompt, 1, "multichoice", buttons);
      }

      if (form.classList.contains("match")) {
        const choices = form.querySelectorAll('.answer tr');
        choices.forEach((choice) => {
          let subprompt = prompt + "\n" + choice.querySelector('.text').textContent
          const options = choice.querySelectorAll('option');
          const select = choice.querySelector('select');
          options.forEach((option, idx) => {
            subprompt += `\n${idx} ${option.textContent}`
          });
          subprompt = `Answer the following with the correct number:\n${subprompt}\n\nAnswer: `;
          complete(subprompt, 1, "match", select);
        });
      }

      if (form.classList.contains("numerical") || form.classList.contains("shortanswer")) {
        const input = form.querySelector('.answer input');
        prompt = `Answer the following with the correct answer:\n${prompt}\n\nAnswer: `;
        complete(prompt, 500, "input", input);
      }
    });
  }
})();