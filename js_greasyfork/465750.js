// ==UserScript==
// @name         WaniKani Please Check Spelling
// @namespace    http://www.wanikani.com
// @version      0.4.1
// @description  Plural-accepting no-misspelling script (No Cigar)
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
// @homepage     https://greasyfork.org/en/scripts/465750-wanikani-please-check-spelling
// @supportURL   https://community.wanikani.com/t/userscript-plz-check-spelling-no-cigar-but-accept-plural-and-no-space-variants/61763
// @source       https://github.com/patarapolw/wanikani-userscript/blob/master/userscripts/plz-check-spelling.user.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465750/WaniKani%20Please%20Check%20Spelling.user.js
// @updateURL https://update.greasyfork.org/scripts/465750/WaniKani%20Please%20Check%20Spelling.meta.js
// ==/UserScript==

// @ts-check
/// <reference path="./types/answer-checker.d.ts" />
(function () {
  'use strict';

  /**
   * !No cigar section
   * @see https://community.wanikani.com/t/userscript-plz-check-spelling-no-cigar-but-accept-plural-and-no-space-variants/61763
   * @see https://community.wanikani.com/t/userscript-prevent-your-answer-was-a-bit-off-answers-from-being-accepted-aka-close-but-no-cigar/7134
   */
  window.modAnswerChecker.register((e, tryCheck) => {
    if (isWrongAnswer) {
      return {
        action: 'fail',
        message: null,
      };
    }

    if (e.questionType !== 'reading') {
      const result = tryCheck(e);
      if (isForcedAccept) return result;

      console.log(result, e);

      if (
        result.action === 'pass' &&
        result.message?.type === 'itemInfoException'
      ) {
        const { meanings = [], auxiliary_meanings = [] } = e.item;
        const { userSynonyms = [] } = e;

        const re = new RegExp(
          `^\\W*(${[
            ...meanings,
            ...userSynonyms,
            ...auxiliary_meanings
              .filter((m) => m.type === 'whitelist')
              .map((m) => m.meaning),
          ]
            .map((m) => {
              m = m.toLocaleLowerCase();

              const tokens = m.split(/\W+/g);
              const isVerb = tokens[0] === 'to';

              const out = [];

              tokens.map((t, i) => {
                let ed = '\\W*';

                if (
                  ['to', 'in', 'on', 'at', 'of', 'and', 'with', 'be'].includes(
                    t,
                  )
                ) {
                  ed = '\\W+';
                } else if (['something', 'a', 'an', 'the'].includes(t)) {
                  t = `(${t})?`;
                } else {
                  t = makePlural(t);
                }

                out.push(t);
                if (i < tokens.length - 1) {
                  out.push(ed);
                }
              });
              return out.join('');
            })
            .join('|')})\\W*$`,
          'i',
        );
        console.log(re);

        if (!re.test(e.response.toLocaleLowerCase().trim())) {
          return {
            action: 'retry',
            message: {
              text: 'Close, but no cigar! Please try again',
              type: 'answerException',
            },
          };
        }
      }
    }

    return null;
  });

  /**
   *
   * @param {string} s
   * @returns
   */
  function makePlural(s) {
    if (s.length > 2) {
      const yPlural = ['y', 'ys', 'ies'];
      for (const p of yPlural) {
        if (s.endsWith(p)) {
          return s.substring(0, s.length - p.length) + `(${yPlural.join('|')})`;
        }
      }

      const sPlural = ['s', 'es'];
      for (const p of sPlural) {
        if (s.endsWith(p)) {
          return s.substring(0, s.length - p.length) + `(${p})?`;
        }
      }

      return s + `(${sPlural.join('|')})?`;
    }

    return s;
  }

  /** @type {HTMLInputElement | null} */
  let inputContainer = null;
  let qType = '';
  let isWrongAnswer = false;
  let isForcedAccept = false;

  addEventListener('willShowNextQuestion', (e) => {
    // @ts-ignore
    const { questionType } = e.detail;
    qType = questionType;

    isWrongAnswer = false;

    if (!inputContainer) {
      inputContainer = document.querySelector('input[name="user-response"]');
      if (inputContainer) {
        const el = inputContainer;
        el.addEventListener('keydown', (ev) => {
          if (el.getAttribute('enabled') !== 'true') return;
          if (ev.key === 'Escape' || ev.code === 'Escape') {
            // https://community.wanikani.com/t/userscript-i-dont-know-button/7231
            const msg =
              qType === 'reading'
                ? 'えええーさっぱりわからないいいい'
                : 'Aargh! What does that even mean? (╯°□°)╯︵ ┻━┻';

            if (el.value === msg) {
              el.value = '';
              isWrongAnswer = false;
            } else {
              el.value = msg;
              isWrongAnswer = true;
            }

            // manual submit
          } else if (ev.key === 'Enter') {
            isForcedAccept = ev.shiftKey || ev.ctrlKey;
          } else if (ev.code.startsWith('Key')) {
            isWrongAnswer = false;
          }
        });
      }
    }
  });
})();
