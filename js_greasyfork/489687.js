// ==UserScript==
// @name         Website Speed Increase
// @namespace    https://github.com/DemonDucky
// @version      1.0.0
// @description  Increase Speed of Any Website
// @author       DemonDucky
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489687/Website%20Speed%20Increase.user.js
// @updateURL https://update.greasyfork.org/scripts/489687/Website%20Speed%20Increase.meta.js
// ==/UserScript==
(async function () {
  'use strict';

  const { GoogleGenerativeAI } = await import('https://esm.run/@google/generative-ai');
  const API_KEY = 'YOUR_API_KEY';

  let interval;
  let baseTitle;
  let answering = false;

  window.addEventListener('load', () => (baseTitle = document.title));

  const askGemini = function (manyAnswers = false) {
    const defaulPrompt2 = 'Answer the question without any explaination, only show me the right answer';
    const defaultPrompt =
      'I will provide you 1 question with some answers (if answers is not provided, use your own answer), your only job is to tell me what exact answer is right, no need to explain anything, if there are more than one question is correct, seperate them by | symbol';
    const multiple = `This question has multiple answers`;
    const selecting = window.getSelection().toString();
    run(defaulPrompt2 + `${manyAnswers ? ' ' + multiple : ''}` + ' ' + selecting);
  };

  doubleKeydownEvent(() => askGemini(), 'z', 'a');
  doubleKeydownEvent(() => askGemini(true), 'z', 's');
  doubleKeydownEvent(clearEvidence, 'z', 'd');

  // Access your API key (see "Set up your API key" above)
  const genAI = new GoogleGenerativeAI(API_KEY);

  async function run(prompt) {
    if (answering === true) return;
    answering = true;
    clearEvidence();
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      scrollDocumentTitle(text, 80);
    } catch (err) {
      document.title = 'Something wrong, try again';
    } finally {
      answering = false;
    }
  }

  function clearEvidence() {
    clearInterval(interval);
    document.title = baseTitle;
  }

  function doubleKeydownEvent(callback, key1, key2) {
    const keydownHandler = (e) => {
      if (e.key !== key2) return;
      callback(e);
    };

    document.addEventListener('keydown', (e) => {
      if (e.key !== key1) return;

      document.addEventListener('keydown', keydownHandler);
    });

    document.addEventListener('keyup', (e) => {
      if (e.key !== key2) return;

      document.removeEventListener('keydown', keydownHandler);
    });
  }

  function scrollDocumentTitle(title, speed) {
    let index = 0;

    interval = setInterval(() => {
      document.title = title.substring(index) + title.substring(0, index);
      index = (index + 1) % title.length;
    }, speed);
  }
})();


