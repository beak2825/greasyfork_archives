// ==UserScript==
// @name         WaniKani Multiple Answer Input (2023)
// @namespace    http://www.wanikani.com
// @version      2.2.0
// @description  Input multiple readings/meanings into Wanikani
// @author       polv
// @match        https://www.wanikani.com/*
// @match        https://preview.wanikani.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wanikani.com
// @license      MIT
// @require      https://greasyfork.org/scripts/470201-wanikani-answer-checker/code/WaniKani%20Answer%20Checker.js?version=1215595
// @homepage     https://greasyfork.org/en/scripts/466680-wanikani-multiple-answer-input-2023
// @supportURL   https://community.wanikani.com/t/userscript-multiple-input-answer-2023/61931
// @source       https://github.com/patarapolw/wanikani-userscript/blob/master/userscripts/mulitple-answer.user.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466680/WaniKani%20Multiple%20Answer%20Input%20%282023%29.user.js
// @updateURL https://update.greasyfork.org/scripts/466680/WaniKani%20Multiple%20Answer%20Input%20%282023%29.meta.js
// ==/UserScript==

// @ts-check
/// <reference path="./types/answer-checker.d.ts" />
(function () {
  'use strict';

  window.modAnswerChecker.register((e, tryCheck) => {
    const splitter = e.questionType === 'reading' ? /・/g : /(?:;|\/)/g;
    const isKanjiReading =
      e.item.subject_category === 'Kanji' && e.questionType === 'reading';

    /** @type {Record<string, Evaluation[]>} */
    const evalActionMap = {};

    for (const subResponse of e.response.split(splitter)) {
      let response = subResponse.trim();
      if (!response) continue;

      const result = tryCheck({ ...e, response });

      const sect = evalActionMap[result.action] || [];
      sect.push(result);
      evalActionMap[result.action] = sect;
    }

    for (const actionType of ['fail', 'retry', 'pass']) {
      if (evalActionMap[actionType]) {
        const result =
          evalActionMap[actionType].find((r) => r.message) ||
          evalActionMap[actionType][0];

        if (actionType === 'retry' && isKanjiReading && evalActionMap['pass']) {
          result.action = 'pass';
        }

        return result;
      }
    }

    return null;
  });
})();
