// ==UserScript==
// @name         WaniKani User Synonyms++
// @namespace    http://www.wanikani.com
// @version      0.2.5
// @description  Better and Not-only User Synonyms
// @author       polv
// @match        https://www.wanikani.com/*
// @match        https://preview.wanikani.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wanikani.com
// @license      MIT
// @require      https://greasyfork.org/scripts/470201-wanikani-answer-checker/code/WaniKani%20Answer%20Checker.js?version=1215595
// @require      https://unpkg.com/dexie@3/dist/dexie.js
// @homepage     https://greasyfork.org/en/scripts/470180-wanikani-user-synonyms
// @supportURL   https://community.wanikani.com/t/userscript-user-synonyms/62481
// @source       https://github.com/patarapolw/wanikani-userscript/blob/master/userscripts/synonyms-plus.user.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470180/WaniKani%20User%20Synonyms%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/470180/WaniKani%20User%20Synonyms%2B%2B.meta.js
// ==/UserScript==

// @ts-check
/// <reference path="./types/answer-checker.d.ts" />
(function () {
  'use strict';

  const entryClazz = 'synonyms-plus';

  ///////////////////////////////////////////////////////////////////////////////////////////////////

  // @ts-ignore
  const _Dexie = /** @type {typeof import('dexie').default} */ (Dexie);
  /**
   * @typedef {{
   *   id: string;
   *   kunyomi?: string[];
   *   onyomi?: string[];
   *   nanori?: string[];
   *   aux: { questionType: string; text: string; type: AuxiliaryType; message: string }[];
   * }} EntrySynonym
   */

  class Database extends _Dexie {
    /** @type {import('dexie').Table<EntrySynonym, string>} */
    synonym;

    constructor() {
      super(entryClazz);
      this.version(1).stores({
        synonym: 'id',
      });
    }
  }

  const db = new Database();

  //////////////////////////////////////////////////////////////////////////////

  /** @type {EvaluationParam | null} */
  let answerCheckerParam = null;

  const wkSynonyms = {
    add: {
      kunyomi(r, type = /** @type {AuxiliaryType} */ ('whitelist')) {
        return this.reading(r, type, 'kunyomi');
      },
      onyomi(r, type = /** @type {AuxiliaryType} */ ('whitelist')) {
        return this.reading(r, type, 'onyomi');
      },
      nanori(r, type = /** @type {AuxiliaryType} */ ('whitelist')) {
        return this.reading(r, type, 'nanori');
      },
      reading(
        r,
        type = /** @type {AuxiliaryType} */ ('whitelist'),
        questionType = 'reading',
      ) {
        if (!wkSynonyms.entry.id) return;

        r = toHiragana(r).trim();
        if (!/^\p{sc=Hiragana}+$/u.test(r)) return;

        wkSynonyms.remove.reading(r, type, questionType);

        if (type === 'whitelist') {
          if (['kunyomi', 'onyomi', 'nanori'].includes(questionType)) {
            wkSynonyms.entry[questionType] = [
              ...(wkSynonyms.entry[questionType] || []),
              r,
            ];
          }
        }

        wkSynonyms.entry.aux.push({
          questionType,
          text: r,
          type,
          message:
            type === 'whitelist'
              ? ''
              : `Not the ${questionType} YOU are looking for`,
        });

        db.synonym.put(wkSynonyms.entry, wkSynonyms.entry.id);
        return 'added';
      },
      meaning(r, type = /** @type {AuxiliaryType} */ ('whitelist')) {
        if (!wkSynonyms.entry.id) return;

        r = r.trim();
        if (!r) return;

        wkSynonyms.remove.meaning(r);

        const questionType = 'meaning';
        wkSynonyms.entry.aux.push({
          questionType,
          text: r,
          type,
          message:
            type === 'whitelist'
              ? ''
              : `Not the ${questionType} YOU are looking for`,
        });

        db.synonym.put(wkSynonyms.entry, wkSynonyms.entry.id);
        return 'added';
      },
    },
    remove: {
      kunyomi(r) {
        return this.reading(r, null, 'kunyomi');
      },
      onyomi(r) {
        return this.reading(r, null, 'onyomi');
      },
      nanori(r) {
        return this.reading(r, null, 'nanori');
      },
      reading(r, _type, questionType) {
        if (!wkSynonyms.entry.id) return;

        r = toHiragana(r).trim();
        if (!/^\p{sc=Hiragana}+$/u.test(r)) return;

        const newAux = wkSynonyms.entry.aux.filter(
          (a) => a.questionType !== 'meaning' && a.text !== r,
        );

        let isChanged = false;

        if (['kunyomi', 'onyomi', 'nanori'].includes(questionType)) {
          if (wkSynonyms.entry[questionType]) {
            const newArr = wkSynonyms.entry[questionType].filter(
              (a) => a !== r,
            );
            if (newArr.length < wkSynonyms.entry[questionType].length) {
              wkSynonyms.entry[questionType] = newArr;
              wkSynonyms.entry.aux = newAux;
              isChanged = true;
            }
          }
        }

        if (isChanged || newAux.length < wkSynonyms.entry.aux.length) {
          wkSynonyms.entry.aux = newAux;
          db.synonym.put(wkSynonyms.entry, wkSynonyms.entry.id);
          return 'removed';
        }

        return 'not removed';
      },
      meaning(r) {
        if (!wkSynonyms.entry.id) return;

        r = r.trim();
        if (!r) return;

        const newAux = wkSynonyms.entry.aux.filter(
          (a) => a.questionType === 'meaning' && a.text !== r,
        );

        if (newAux.length < wkSynonyms.entry.aux.length) {
          wkSynonyms.entry.aux = newAux;
          db.synonym.put(wkSynonyms.entry, wkSynonyms.entry.id);
          return 'removed';
        }

        return 'not removed';
      },
    },
    entry: /** @type {EntrySynonym} */ ({
      id: '',
      aux: [],
    }),
    commit() {
      if (!this.entry.id) return;
      db.synonym.put(this.entry, this.entry.id);
    },
  };
  Object.assign(window, { wkSynonyms });

  let isFirstRender = false;

  window.modAnswerChecker.register((e, tryCheck) => {
    answerCheckerParam = e;
    e = JSON.parse(JSON.stringify(e));

    e.item.readings = e.item.readings || [];
    e.item.auxiliary_readings = e.item.auxiliary_readings || [];

    let aux = wkSynonyms.entry.aux;

    for (const kanjiReading of /** @type {('kunyomi' | 'onyomi' | 'nanori')[]} */ ([
      'kunyomi',
      'onyomi',
      'nanori',
    ])) {
      const rs = wkSynonyms.entry[kanjiReading];
      if (rs) {
        e.item[kanjiReading] = [...(e.item[kanjiReading] || []), ...rs];
        e.item.auxiliary_readings = e.item.auxiliary_readings.filter(
          (a) => !rs.includes(a.reading),
        );
      }
    }

    for (const { questionType, ...it } of aux) {
      if (questionType === 'meaning') {
        const text = normalize(it.text);

        e.item.meanings = e.item.meanings.filter((a) => normalize(a) !== text);
        e.item.auxiliary_meanings = e.item.auxiliary_meanings.filter(
          (a) => normalize(a.meaning) !== text,
        );
        e.userSynonyms = e.userSynonyms.filter((s) => normalize(s) !== text);
        e.item.auxiliary_meanings.push({ ...it, meaning: it.text });
      } else {
        if (e.item.readings) {
          e.item.readings = e.item.readings.filter((a) => a !== it.text);
        }

        if (!(e.item.type === 'Kanji' && it.type === 'whitelist')) {
          for (const kanjiReading of /** @type {('kunyomi' | 'onyomi' | 'nanori')[]} */ ([
            'kunyomi',
            'onyomi',
            'nanori',
          ])) {
            const rs = e.item[kanjiReading];
            if (rs) {
              e.item[kanjiReading] = rs.filter((a) => a !== it.text);
            }
          }

          let { auxiliary_readings = [] } = e.item;
          auxiliary_readings = auxiliary_readings.filter(
            (a) => a.reading !== it.text,
          );
          auxiliary_readings.push({ ...it, reading: it.text });
          e.item.auxiliary_readings = auxiliary_readings;
        }
      }
    }

    return tryCheck(e);
  });

  addEventListener('willShowNextQuestion', (ev) => {
    document.querySelectorAll(`.${entryClazz}`).forEach((el) => el.remove());
    answerCheckerParam = null;
    wkSynonyms.entry = {
      id: String(/** @type {any} */ (ev).detail.subject.id),
      aux: [],
    };
    isFirstRender = true;

    db.synonym.get(wkSynonyms.entry.id).then((it) => {
      if (it) {
        wkSynonyms.entry = it;
      }
    });
  });

  addEventListener('turbo:load', (ev) => {
    // @ts-ignore
    const url = ev.detail.url;
    if (!url) return;

    if (/wanikani\.com\/(radicals?|kanji|vocabulary)/.test(url)) {
      answerCheckerParam = null;
    }
  });

  const updateListing = () => {
    const frame = document.querySelector(
      'turbo-frame.user-synonyms',
    )?.parentElement;
    if (!frame?.parentElement) return;

    let divList = frame.parentElement.querySelector(`.${entryClazz}`);
    if (!divList) {
      divList = document.createElement('div');
      divList.className = entryClazz;
      frame.insertAdjacentElement('beforebegin', divList);
    }

    divList.textContent = '';

    const listing = {};

    wkSynonyms.entry.aux.map((a) => {
      const t = capitalize(a.type);
      listing[t] = listing[t] || [];
      listing[t].push(a);
    });

    for (const [k, auxs] of Object.entries(listing)) {
      const div = document.createElement('div');
      div.className = 'subject-section__meanings';
      divList.append(div);

      const h = document.createElement('h2');
      h.className = 'subject-section__meanings-title';
      h.innerText = k;
      div.append(h);

      const ul = document.createElement('ul');
      ul.className = 'user-synonyms__items';
      div.append(ul);

      for (const a of auxs) {
        const li = document.createElement('li');
        li.className = 'user-synonyms_item';
        ul.append(li);

        const span = document.createElement('span');
        span.className = 'user-synonym';
        span.innerText = a.text;
        if (a.questionType !== 'meaning') {
          span.innerText += ` (${a.questionType})`;
        }
        li.append(span);
      }
    }
  };

  let updateAux = () => {};
  addEventListener('didUpdateUserSynonyms', (ev) => {
    updateAux();
  });

  addEventListener('turbo:frame-render', (ev) => {
    // @ts-ignore
    const { fetchResponse } = ev.detail;

    if (/wanikani\.com\/subject_info\/(\d+)/.test(fetchResponse.response.url)) {
      updateListing();
      return;
    }

    const [, subject_id] =
      /wanikani\.com\/user_synonyms.*\?.*subject_id=(\d+)/.exec(
        fetchResponse.response.url,
      ) || [];

    if (!subject_id) return;

    db.synonym.get(subject_id).then((it) => {
      if (it) {
        wkSynonyms.entry = it;
        updateAux();
      }
    });

    updateAux = () => {
      updateListing();

      const elContainer = document.querySelector(
        '.user-synonyms__form_container',
      );
      if (!elContainer) return;

      const elForm = elContainer.querySelector('form.user-synonyms__form');
      if (!(elForm instanceof HTMLFormElement)) return;

      const elInput = elContainer.querySelector('input[type="text"]');
      if (!(elInput instanceof HTMLInputElement)) return;

      if (isFirstRender && answerCheckerParam?.questionType === 'meaning') {
        elInput.value = answerCheckerParam?.response || '';
      }

      elInput.autocomplete = 'off';
      elInput.onkeydown = (ev) => {
        if (ev.key === 'Escape' || ev.code === 'Escape') {
          if (elInput.value) {
            elInput.value = '';
          } else {
            return;
          }
        }

        ev.stopImmediatePropagation();
        ev.stopPropagation();
      };

      elForm.onsubmit = (ev) => {
        isFirstRender = false;

        if (elInput.value.length < 2) return;
        const signs = ['-', '*', '?', '+', ''];

        let sign = '';
        let str = elInput.value.trim();
        for (sign of signs) {
          if (str.startsWith(sign)) {
            str = str.substring(sign.length);
            break;
          }
          if (str.endsWith(sign)) {
            str = str.substring(0, str.length - sign.length);
            break;
          }
        }

        /** @type {AuxiliaryType | null} */
        let type = null;

        if (['-', '*'].includes(sign)) {
          type = 'blacklist';
        } else if (['?'].includes(sign)) {
          type = 'warn';
        } else if (['+'].includes(sign)) {
          type = 'whitelist';
        }

        let questionType = 'meaning';
        const [, readingType, reading] =
          /^(kunyomi|onyomi|nanori|reading):([\p{sc=Hiragana}\p{sc=Katakana}]+)$/iu.exec(
            str,
          ) || [];
        if (reading) {
          str = reading;
          questionType = readingType;
          type = type || 'whitelist';
        }

        if (!type) return;

        ev.preventDefault();
        setTimeout(() => {
          updateAux();
          elInput.value = '';
        });

        if (questionType === 'meaning') {
          wkSynonyms.add.meaning(str, type);
        } else {
          wkSynonyms.add.reading(str, type, readingType);
        }
      };

      let elExtraContainer = elContainer.querySelector(`.${entryClazz}`);
      if (!elExtraContainer) {
        elExtraContainer = document.createElement('div');
        elExtraContainer.className = entryClazz;
        elContainer.append(elExtraContainer);
      }
      elExtraContainer.textContent = '';

      for (const a of wkSynonyms.entry.aux) {
        let elAux = elExtraContainer.querySelector(
          `[data-${entryClazz}="${a.type}"]`,
        );
        if (!elAux) {
          elAux = document.createElement('div');
          elAux.className = 'user-synonyms__synonym-buttons';
          elAux.setAttribute(`data-${entryClazz}`, a.type);

          const h = document.createElement('h2');
          h.className =
            'wk-title wk-title--medium wk-title--underlined wk-title-custom';
          h.innerText = capitalize(a.type);

          elExtraContainer.append(h);
          elExtraContainer.append(elAux);
        }

        const btn = document.createElement('a');
        elAux.append(btn);
        btn.className = 'user-synonyms__synonym-button';

        btn.addEventListener('click', () => {
          if (a.questionType === 'meaning') {
            wkSynonyms.remove.meaning(a.text);
          } else {
            wkSynonyms.remove.reading(a.text, null, a.questionType);
          }
          updateAux();
        });

        const icon = document.createElement('i');
        btn.append(icon);
        icon.className = 'wk-icon fa-regular fa-times';

        const span = document.createElement('span');
        btn.append(span);
        span.className = 'user-synonym__button-text';
        span.innerText = a.text;
        if (a.questionType !== 'meaning') {
          span.innerText += ` (${a.questionType})`;
        }
      }

      if (!answerCheckerParam) return;

      const { item } = answerCheckerParam;
      const aux = [
        ...item.auxiliary_meanings.map(({ meaning, ...t }) => ({
          text: meaning,
          questionType: 'meaning',
          ...t,
        })),
      ];

      if (item.auxiliary_readings) {
        aux.push(
          ...item.auxiliary_readings.map(({ reading, ...t }) => ({
            text: reading,
            questionType: 'reading',
            ...t,
          })),
        );
      }

      if (aux.length) {
        elExtraContainer.append(
          (() => {
            const elDetails = document.createElement('details');

            const title = document.createElement('summary');
            elDetails.append(title);
            title.innerText = `WaniKani auxiliaries`;

            const elButtonSet = document.createElement('div');
            elDetails.append(elButtonSet);
            elButtonSet.className = 'user-synonyms__synonym-buttons';

            for (const a of aux) {
              let elAux = elDetails.querySelector(
                `[data-${entryClazz}="wk-${a.type}"]`,
              );
              if (!elAux) {
                elAux = document.createElement('div');
                elAux.className = 'user-synonyms__synonym-buttons';
                elAux.setAttribute(`data-${entryClazz}`, `wk-${a.type}`);

                const h = document.createElement('h2');
                h.className =
                  'wk-title wk-title--medium wk-title--underlined wk-title-custom';
                h.innerText = capitalize(a.type);

                elDetails.append(h);
                elDetails.append(elAux);
              }

              const span = document.createElement('span');
              elAux.append(span);
              span.className = 'user-synonym__button-text';
              span.innerText = a.text;
              if (a.questionType !== 'meaning') {
                span.innerText += ` (${a.questionType})`;
              }
            }
            return elDetails;
          })(),
        );
      }
    };

    updateAux();
  });

  /** @param {string} s */
  function capitalize(s) {
    return s.replace(
      /[a-z]+/gi,
      (p) => p[0].toLocaleUpperCase() + p.substring(1),
    );
  }

  /** @param {string} s */
  function normalize(s) {
    return s.toLocaleLowerCase().replace(/\W/g, ' ').trim();
  }

  const CP_KATA_A = 'ア'.charCodeAt(0);
  const CP_HIRA_A = 'あ'.charCodeAt(0);

  /** @param {string} s */
  function toHiragana(s) {
    return s.replace(/\p{sc=Katakana}/gu, (c) =>
      String.fromCharCode(c.charCodeAt(0) - CP_KATA_A + CP_HIRA_A),
    );
  }

  (function add_css() {
    const style = document.createElement('style');
    style.append(
      document.createTextNode(/* css */ `
      :root {
        --color-modal-mask: unset;
      }

      .wk-modal__content {
        /* top: unset;
        bottom: 0; */
        border-radius: 5px;
        box-shadow: 0 0 4px 2px gray;
      }

      .subject-section__meanings-title {
        min-width: 6em;
      }

      .user-synonyms__form_container::-webkit-scrollbar {
        display: none;
      }

      .${entryClazz} .user-synonym__button-text {
        line-height: 1.5em;
      }

      .${entryClazz} .user-synonym__button-text:not(:last-child)::after,
      .${entryClazz} .user-synonyms_item:not(:last-child)::after {
        content: ',';
        margin-right: 0.5em;
      }

      .${entryClazz} details,
      .${entryClazz} .wk-title-custom {
        margin-top: 1em;
      }

      .${entryClazz} summary {
        cursor: pointer;
      }
      `),
    );
    document.head.append(style);
  })();
})();
