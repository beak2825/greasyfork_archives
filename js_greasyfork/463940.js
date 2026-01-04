// ==UserScript==
// @name        WK Custom Review Question (KunOn+)
// @namespace   WK_KunOn
// @description Changes the text of the Review or Lesson Quiz question. Specifies ON or KUN reading for Kanji. Options to have the text in English or Japanese.
// @author      polv
// @match       *://www.wanikani.com/*
// @match       *://preview.wanikani.com/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=wanikani.com
// @homepage    https://community.wanikani.com/t/userscript-wk-custom-review-question-kunon-2023-version/61449
// @source      https://github.com/patarapolw/wanikani-userscript/blob/master/userscripts/kun-on.user.js
// @version     1.2.0
// @license     MIT
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/463940/WK%20Custom%20Review%20Question%20%28KunOn%2B%29.user.js
// @updateURL https://update.greasyfork.org/scripts/463940/WK%20Custom%20Review%20Question%20%28KunOn%2B%29.meta.js
// ==/UserScript==

// @ts-check
/// <reference path="./types/wkof.d.ts" />
(function () {
  'use strict';

  /**
   * Language options
   * English "en", Japanese "ja"
   * @type {string}
   */
  const defaultLang = 'en';

  /**
   * Whether to hide subjectType string, and rely on color instead.
   */
  const default_has_subjectType = true;

  //
  // Edit replacement string to your heart's content.
  //

  // subjectType HTML
  const enKanji = 'Kanji';
  const enRadical = 'Radical';
  const enVocab = 'Vocabulary';

  // questionType HTML
  const enMeaning = 'Meaning';
  const enName = 'Name';

  const enReading = 'Reading';

  const enOn = `ON'YOMI`;
  const enKun = `kun'yo<span style="color: white">mi</span>`;
  const enNanori = 'Nanori (^o^)';

  const jaKanji = '漢字:';
  const jaRadical = '部首:';
  const jaVocab = '単語:';

  const jaMeaning = '意味';
  const jaName = '名前';

  const jaReading = '読み方';

  const jaOn = '音読み';
  const jaKun = 'くんよ<span style="color: white">み</span>';
  const jaNanori = '名乗り (^o^)';

  /**
   * Whether to use wkof Settings dialog and ignore in-script settings
   */
  const USE_WKOF = true;

  const defaultCSS = cleanCSS(/* css */ `
  [data-kunon-subject-type="Kanji"][data-kunon-question-type] [data-kunon-reading-type="onyomi"] {
    color: yellow;
  }

  [data-kunon-subject-type="Kanji"][data-kunon-question-type] [data-kunon-reading-type="kunyomi"] {
    color: cyan;
  }

  [data-kunon-subject-type="Kanji"][data-kunon-question-type] [data-kunon-reading-type="nanori"] {
    color: bisque;
  }
  `);

  // CONSTANTS
  const SCRIPT_ID = 'WK_KunOn';
  const SEL_category = '[data-quiz-input-target="category"]';
  const SEL_questionType = '[data-quiz-input-target="questionType"]';

  let cfg = USE_WKOF ? /** @type {ScriptSettings} */ ({}) : newScriptSettings();

  /** @type {HTMLStyleElement} */
  let elStyle;
  setScriptCSS();

  /**
   *
   * @typedef {{
   *   Language: string
   *   HideSubjectType: boolean
   *   Radical: string
   *   Kanji: string
   *   Vocabulary: string
   *   Meaning: string
   *   Reading: string
   *   RadicalName: string
   *   Kunyomi: string
   *   Onyomi: string
   *   Nanori: string
   *   CSS: string
   * }} ScriptSettings
   */

  function newScriptSettings(o = /** @type {ScriptSettings} */ ({})) {
    o.Language = o.Language || defaultLang;
    o.HideSubjectType =
      typeof o.HideSubjectType !== 'undefined'
        ? o.HideSubjectType
        : !default_has_subjectType;
    o.CSS = typeof o.CSS !== 'undefined' ? o.CSS : defaultCSS;

    o.Radical = o.Language === 'ja' ? jaRadical : enRadical;
    o.Kanji = o.Language === 'ja' ? jaKanji : enKanji;
    o.Vocabulary = o.Language === 'ja' ? jaVocab : enVocab;

    o.Meaning = o.Language === 'ja' ? jaMeaning : enMeaning;
    o.Reading = o.Language === 'ja' ? jaReading : enReading;
    o.RadicalName = o.Language === 'ja' ? jaName : enName;

    o.Kunyomi = o.Language === 'ja' ? jaKun : enKun;
    o.Onyomi = o.Language === 'ja' ? jaOn : enOn;
    o.Nanori = o.Language === 'ja' ? jaNanori : enNanori;

    return o;
  }

  // @ts-ignore
  if (USE_WKOF && typeof wkof !== 'undefined') {
    /**
     * @typedef {import('./types/wkof').Core.Module
     * & import('./types/wkof').Menu
     * & import('./types/wkof').Settings
     * } TWKOF
     */

    // @ts-ignore
    const WKOF = /** @type {TWKOF} */ (wkof);
    WKOF.include('Menu,Settings');
    WKOF.ready('Menu,Settings')
      .then(() => {
        WKOF.Menu.insert_script_link({
          name: 'kunon',
          title: 'Custom Review Questions (KunOn+)',
          submenu: 'Settings',
          on_click: openSettings,
        });
      })
      .then(() => {
        return WKOF.Settings.load(SCRIPT_ID, cfg);
      })
      .then(() => {
        cfg = /** @type {any} */ (WKOF.settings[SCRIPT_ID]);
        updateSettings();
      });

    function updateSettings() {
      setScriptCSS();
      setSubjectType();
      setQuestionType();
    }

    function openSettings() {
      /** @type {JQuery<HTMLElement>} */
      let $textarea;

      const dialog = new WKOF.Settings({
        script_id: SCRIPT_ID,
        title: 'Custom Review Question (KunOn+) Settings',
        pre_open: ($) => {
          $textarea = $.find('textarea[name="CSS_textarea"]').val(
            typeof cfg.CSS !== 'undefined' ? cfg.CSS : defaultCSS,
          );
        },
        on_save: () => {
          cfg.CSS = /** @type {string} */ ($textarea.val());
          updateSettings();
        },
        content: {
          tabset: {
            type: 'tabset',
            content: {
              fieldLabels: {
                type: 'page',
                label: 'Field Names',
                content: {
                  Language: {
                    type: 'dropdown',
                    label: 'Language',
                    default: 'en',
                    content: {
                      en: 'English',
                      ja: 'Japanese',
                    },
                    on_change: function (k, v) {
                      WKOF.settings[SCRIPT_ID][k] = v;
                      newScriptSettings(
                        /** @type {any} */ (WKOF.settings[SCRIPT_ID]),
                      );
                      updateSettings();
                      dialog.refresh();
                    },
                  },
                  HideSubjectType: {
                    type: 'checkbox',
                    label: 'Hide Subject Type',
                    hover_tip: `Don't show whether it is Radical, Kanji or Vocabulary`,
                    default: !default_has_subjectType,
                  },
                  divider: {
                    type: 'divider',
                  },
                  Subject: {
                    type: 'group',
                    label: 'Subject Label',
                    content: {
                      Radical: {
                        type: 'input',
                        label: 'Radical',
                        default: enRadical,
                      },
                      Kanji: {
                        type: 'input',
                        label: 'Kanji',
                        default: enKanji,
                      },
                      Vocabulary: {
                        type: 'input',
                        label: 'Vocabulary',
                        default: enVocab,
                      },
                    },
                  },
                  QuestionType: {
                    type: 'group',
                    label: 'Question Type',
                    content: {
                      Meaning: {
                        type: 'input',
                        label: 'Meaning',
                        default: enMeaning,
                      },
                      Reading: {
                        type: 'input',
                        label: 'Reading',
                        default: enReading,
                      },
                      RadicalName: {
                        type: 'input',
                        label: 'Radical name',
                        default: enName,
                      },
                      KanjiReading: {
                        type: 'group',
                        label: 'Kanji Reading',
                        content: {
                          Kunyomi: {
                            type: 'input',
                            label: `Kun'yomi`,
                            default: enKun,
                          },
                          Onyomi: {
                            type: 'input',
                            label: `On'yomi`,
                            default: enOn,
                          },
                          Nanori: {
                            type: 'input',
                            label: 'Nanori',
                            default: enName,
                          },
                        },
                      },
                    },
                  },
                  resetLabels: {
                    type: 'button',
                    label: 'Reset Labels',
                    text: 'Reset',
                    on_click: () => {
                      newScriptSettings(
                        /** @type {any} */ (WKOF.settings[SCRIPT_ID]),
                      );
                      updateSettings();
                      dialog.refresh();
                    },
                  },
                },
              },
              cssLabel: {
                type: 'page',
                label: 'CSS',
                content: {
                  cssHTML: {
                    type: 'html',
                    html: `<textarea id="${SCRIPT_ID}_CSS_textrea" name="CSS_textarea" class="settings" style="font-family: monospace"
                    autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>`,
                  },
                  CSS: {
                    type: 'input',
                    subtype: 'hidden',
                    default: defaultCSS,
                  },
                  resetCSS: {
                    type: 'button',
                    label: 'Reset CSS',
                    text: 'Reset',
                    on_click: () => {
                      WKOF.settings[SCRIPT_ID].CSS = defaultCSS;
                      updateSettings();
                      $textarea.val(defaultCSS);
                    },
                  },
                },
              },
            },
          },
        },
      });

      dialog.open();
    }
  }

  /**
   * @type {{
   *  questionType: 'reading' | 'meaning',
   *  subject: {
   *    type: 'Radical' | 'Kanji' | 'Vocabulary',
   *    primary_reading_type?: 'onyomi' | 'kunyomi' | 'nanori'
   *  }
   * } | null}
   */
  let itemDetail = null;

  function setSubjectType() {
    if (!itemDetail) return;

    const el_category = document.querySelector(SEL_category);
    if (!el_category) return;

    el_category.setAttribute('lang', cfg.Language);
    el_category.innerHTML = `<span data-kunon-subject-type="${
      itemDetail.subject.type
    }">${
      cfg.HideSubjectType
        ? ''
        : (() => {
            switch (itemDetail.subject.type) {
              case 'Radical':
                return cfg.Radical;
              case 'Kanji':
                return cfg.Kanji;
            }
            return cfg.Vocabulary;
          })()
    }</span>`;
  }

  function setQuestionType() {
    if (!itemDetail) return;

    const el_questionType = document.querySelector(SEL_questionType);
    if (!el_questionType) return;

    const {
      questionType,
      subject: { type, primary_reading_type },
    } = itemDetail;

    el_questionType.setAttribute('lang', cfg.Language);
    el_questionType.innerHTML = `<span data-kunon-subject-type="${type}" data-kunon-question-type="${questionType}">${(() => {
      if (questionType === 'reading') {
        if (primary_reading_type) {
          return `<span data-kunon-reading-type="${primary_reading_type}">${(() => {
            switch (primary_reading_type) {
              case 'onyomi':
                return cfg.Onyomi;
              case 'kunyomi':
                return cfg.Kunyomi;
              case 'nanori':
                return cfg.Nanori;
            }
            return cfg.Reading;
          })()}</span>`;
        }
        return cfg.Reading;
      }

      if (type === 'Radical') return cfg.RadicalName;

      return cfg.Meaning;
    })()}</span>`;
  }

  window.addEventListener('willShowNextQuestion', (e) => {
    if ('detail' in e) {
      itemDetail = /** @type {any} */ (e.detail);

      const el_category = document.querySelector(SEL_category);
      const el_questionType = document.querySelector(SEL_questionType);

      if (el_category && el_questionType) {
        const obs_category = new MutationObserver(() => {
          setSubjectType();
          obs_category.disconnect();
        });
        obs_category.observe(el_category, { childList: true });

        const obs_questionType = new MutationObserver(() => {
          setQuestionType();
          obs_questionType.disconnect();
        });
        obs_questionType.observe(el_questionType, { childList: true });
      }
    }
  });

  window.addEventListener('didAnswerQuestion ', () => {
    setTimeout(() => {
      if (
        location.pathname.includes('lesson') &&
        !location.pathname.includes('quiz')
      ) {
        itemDetail = null;
      }
    }, 100);
  });

  /**
   *
   * @param {string} css
   * @returns
   */
  function cleanCSS(css) {
    const indents = [];
    const lines = css
      .trim()
      .split('\n')
      .map((ln) => {
        const m = /^ +[^ ]/.exec(ln);
        if (m) {
          const idx = m[0].length - 1;
          indents.push(idx);
        }
        return ln;
      });
    if (!indents.length) return css;
    const re = new RegExp(`^ {0,${Math.min(...indents)}}`);
    return lines.map((ln) => ln.replace(re, '')).join('\n');
  }

  function setScriptCSS() {
    const css = /* css */ `
    [data-kunon-subject-type] {
      text-transform: unset;
    }

    [data-kunon-question-type] {
      text-transform: unset;
      ${cfg.Language === 'ja' ? 'font-weight: normal;' : ''}
    }

    #wkofs_${SCRIPT_ID} textarea {
      width: 100%;
      height: 300px;
      font-family: monospace;
    }

    ${cfg.CSS}
    `;

    if (elStyle) {
      elStyle.textContent = css;
    } else {
      elStyle = document.createElement('style');
      elStyle.setAttribute('data-userscript', SCRIPT_ID);
      elStyle.append(document.createTextNode(css));
      document.head.append(elStyle);
    }
  }
})();
