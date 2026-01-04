// ==UserScript==
// @name         WaniKani Even Kana? (ModAnswerChecker)
// @namespace    http://www.wanikani.com
// @version      1.2.1
// @description  Check that the okurigana matches the answer
// @author       polv
// @match        https://www.wanikani.com/extra_study/session*
// @match        https://www.wanikani.com/review/session*
// @match        https://www.wanikani.com/subjects/*
// @match        https://preview.wanikani.com/extra_study/session*
// @match        https://preview.wanikani.com/review/session*
// @match        https://preview.wanikani.com/subjects/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wanikani.com
// @license      MIT
// @require      https://greasyfork.org/scripts/470201-wanikani-answer-checker/code/WaniKani%20Answer%20Checker.js?version=1215595
// @homepage     https://greasyfork.org/en/scripts/478704-wanikani-even-kana-modanswerchecker
// @supportURL   https://community.wanikani.com/t/do-you-even-kana-okurigana-matcher/8440/56
// @source       https://github.com/patarapolw/wanikani-userscript/blob/master/userscripts/even-kana.user.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478704/WaniKani%20Even%20Kana%20%28ModAnswerChecker%29.user.js
// @updateURL https://update.greasyfork.org/scripts/478704/WaniKani%20Even%20Kana%20%28ModAnswerChecker%29.meta.js
// ==/UserScript==

// @ts-check
/// <reference path="./types/answer-checker.d.ts" />
(function () {
  'use strict';

  window.modAnswerChecker.register((e) => {
    if (e.questionType === 'reading' && e.item.type === 'Vocabulary') {
      console.log(e);
      if (!matchOkurigana(e.item.characters, e.response.trim())) {
        return {
          action: 'retry',
          message: {
            text: 'Bro, Do you even Kana?',
            type: 'answerException',
          },
        };
      }
    }
    return null;
  });

  const CP_KATA_A = 'ア'.charCodeAt(0);
  const CP_HIRA_A = 'あ'.charCodeAt(0);

  /**
   * @param {string} s
   * @returns {string}
   */
  function toHiragana(s) {
    return s.replace(/\p{sc=Katakana}/gu, (c) =>
      ['ヶ'].includes(c)
        ? c
        : String.fromCharCode(c.charCodeAt(0) - CP_KATA_A + CP_HIRA_A),
    );
  }

  /**
   *
   * @param {string} key
   * @param {string} userAnswer
   * @returns {boolean}
   */
  function matchOkurigana(key, userAnswer) {
    return new RegExp(
      '^' +
        toHiragana(key.replace(/〜/g, '')).replace(
          /[^\p{sc=Hiragana}ー]+/gu,
          '.+',
        ) +
        '$',
    ).test(toHiragana(userAnswer));
  }
})();
