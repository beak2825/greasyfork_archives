// ==UserScript==
// @name         WaniKani Autoplay Sentence Audio
// @namespace    polv/wanikani
// @version      0.1.1
// @description  Autoplay audio sentences (via ImmersionKit.com), with customizability (via Anki-Connect)
// @author       polv
// @match        *://www.wanikani.com/review/session*
// @match        *://www.wanikani.com/extra_study/session*
// @match        *://www.wanikani.com/lesson/session*
// @require      https://greasyfork.org/scripts/430565-wanikani-item-info-injector/code/WaniKani%20Item%20Info%20Injector.user.js?version=1057854
// @require      https://greasyfork.org/scripts/452285-ankiconnect/code/ankiconnect.js?version=1099556
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wanikani.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452286/WaniKani%20Autoplay%20Sentence%20Audio.user.js
// @updateURL https://update.greasyfork.org/scripts/452286/WaniKani%20Autoplay%20Sentence%20Audio.meta.js
// ==/UserScript==

// TODO:
// @match        *://www.wanikani.com/*vocabulary/*

// @ts-check
/// <reference path="./types/wanikani.d.ts" />
/// <reference path="./types/item-info.d.ts" />
/// <reference path="./types/ankiconnect.d.ts" />
/// <reference path="./types/immersion-kit.d.ts" />

/// <reference path="./types/autoplay.user.d.ts" />
(function () {
  'use strict';

  // OPTIONS
  // TODO: Use wkof's dialog

  /**
   * See https://github.com/patarapolw/wanikani-userscript/blob/master/userscripts/types/autoplay.user.d.ts for typing
   *
   * @type {ScriptOptions}
   *
   * Remove IMMERSION_KIT or ANKI key to disable lookup
   */
  const OPTS = {
    HIDE_SENTENCE_JA: true,
    HIDE_SENTENCE_EN: 'remove',
    NUMBER_OF_SENTENCES: 3,
    IMMERSION_KIT: {
      priority: [
        'Death Note',
        'Hunter x Hunter',
        "Kino's Journey",
        'Fullmetal Alchemist Brotherhood',
      ],
    },
    ANKI: false,
    LOG: {
      immersionKit: false,
    },
  };

  // SCRIPT START

  (window.unsafeWindow || window).audioAutoplay = false;

  const HTML_CLASS = 'wk-autoplay-sentence';
  const FURIGANA_FIELDS = new Set(
    OPTS.ANKI
      ? [
          ...OPTS.ANKI.searchFields.vocabulary,
          ...OPTS.ANKI.outFields.sentence.map((s) => s.ja).filter((f) => f),
        ]
      : undefined,
  );
  const ankiconnect = new AnkiConnect();

  const HIDDEN_UNTIL_HOVER_CLASS = 'hidden-until-hover';

  document.head.append(
    Object.assign(document.createElement('style'), {
      className: 'style--' + HTML_CLASS,
      innerHTML: `
    .${HTML_CLASS} .${HIDDEN_UNTIL_HOVER_CLASS}:not(:hover) {
      background-color:#ccc;
      color:#ccc;
      text-shadow:none;
    }

    .${HTML_CLASS} .audio-player {
      width: 2em;
      display: inline-block;
    }

    .${HTML_CLASS} summary {
      display: revert;
    }
    `,
    }),
  );

  /** @type {import("./types/wanikani").WKCurrent<'vocabulary'>} */
  let current;
  /** @type {ISentence[]} */
  let sentences = [];
  /** @type {HTMLElement[]} */
  const autoplayDivArray = [];

  const onNewVocabulary = async () => {
    autoplayDivArray.map((el) => el.remove());
    autoplayDivArray.splice(0, autoplayDivArray.length);

    sentences = [];

    await new Promise((resolve) => setTimeout(resolve, 50));

    let key = 'currentItem';
    if (document.URL.includes('/lesson/session')) {
      key = $.jStorage.get('l/quizActive')
        ? 'l/currentQuizItem'
        : 'l/currentLesson';
    }

    const c =
      /** @type {import("./types/wanikani").WKCurrent<'vocabulary'>} */ (
        $.jStorage.get(key)
      );

    if (!c || !('voc' in c)) {
      return;
    }

    const qType =
      key === 'currentItem' ? $.jStorage.get('questionType') : undefined;

    if (qType) {
      if (qType === 'reading') {
        // expand item info
        setTimeout(function () {
          window.addEventListener('scroll', noscroll);
          $('#option-item-info').click();
          // Remove listener to disable scroll
          setTimeout(function () {
            window.removeEventListener('scroll', noscroll);
          }, 1000);
        }, 100);
      } else {
        return;
      }
    }

    current = c;
    const { voc, kana } = current;

    if (OPTS.ANKI) {
      const { query, searchFields, outFields } = OPTS.ANKI;

      const noteIds = await ankiconnect
        .send('findNotes', {
          query: [
            query,
            `(${searchFields.vocabulary
              .map((f) => `"${f}:${voc}"`)
              .join(' OR ')})`,
            `(${kana
              .flatMap((r) => searchFields.reading.map((f) => `"${f}:${r}"`))
              .join(' OR ')})`,
          ].join(' '),
        })
        .catch((e) => {
          console.error(e);
          console.error(
            'Cannot findNotes. Did you forget to install Anki and enable Anki-Connect (https://foosoft.net/projects/anki-connect/)?',
          );
          return [];
        });

      if (noteIds.length) {
        await ankiconnect
          .send('notesInfo', { notes: noteIds })
          .then((notes) => {
            /**
             * @param {Pick<INote, 'fields'>} note
             * @param {string} fieldName
             */
            function getField(note, fieldName) {
              let { value = '' } = note.fields[fieldName] || {};

              if (FURIGANA_FIELDS.has(fieldName)) {
                value = value
                  .replace(/(\[.+?\])(.)/g, '$1 $2')
                  .replace(
                    /(^| )([^ \[]+)\[([^\]]+)\]/g,
                    '<ruby>$1<rt>$2</rt></ruby>',
                  );
              }

              return value;
            }

            const filteredNotes = notes
              .sort((n1, n2) =>
                [n1, n2]
                  .map((n1) =>
                    searchFields.vocabulary.findIndex((f) => getField(n1, f)),
                  )
                  .reduce((prev, c) => prev - c),
              )
              .filter((n) =>
                searchFields.reading
                  .flatMap((f) => getField(n, f).split('\n'))
                  .some((r) => kana.includes(r.trim())),
              );

            const n =
              filteredNotes.find((n) =>
                outFields.sentence.map((f) => getField(n, f.audio)),
              ) || filteredNotes[0];

            if (n) {
              sentences = outFields.sentence
                .map((f) => {
                  const out = {
                    id: `anki--${f.audio}`,
                    ja: f.ja ? getField(n, f.ja) : undefined,
                    en: f.en ? getField(n, f.en) : undefined,
                    audio: '',
                  };

                  const m = /\[sound\:(.+?)\]/.exec(getField(n, f.audio));
                  if (m) {
                    const filename = m[1];

                    // [sound:https://...] works in AnkiDroid
                    if (/:\/\//.exec(filename)) {
                      out.audio = m[1];
                    } else {
                      ankiconnect
                        .send('retrieveMediaFile', { filename })
                        .then((r) => {
                          let mimeType = 'audio/mpeg';
                          const ext = m[1].replace(/^.+\./, '');
                          switch (ext) {
                            default:
                              mimeType = `audio/${ext}`;
                          }

                          out.audio = `data:${mimeType};base64,${r}`;
                        });
                    }
                  }

                  return out;
                })
                .filter(
                  (s) =>
                    (OPTS.HIDE_SENTENCE_JA === 'remove' ? false : s.ja) ||
                    s.audio,
                );

              if (sentences.length) {
                appender.renew();
              }
            }
          })
          .catch((e) => {
            console.error(e);
          });
      }
    }

    const { IMMERSION_KIT } = OPTS;
    if (IMMERSION_KIT) {
      await fetch(
        `https://api.immersionkit.com/look_up_dictionary?keyword=${voc}`,
      )
        .then((r) => r.json())
        .then((r) => {
          const {
            data: [{ examples }],
          } = /** @type {ImmersionKitResult} */ (r);

          /** @type {{[type: string]: (typeof examples)} & {'': {[type: string]: (typeof examples)}}} */
          const sortedExamples = {};
          /** @type {typeof examples} */
          let remainingExamples = examples;

          for (const p of IMMERSION_KIT.priority) {
            /** @type {typeof examples} */
            const currentExamples = [];
            /** @type {typeof examples} */
            const nextRemainingExamples = [];

            for (const ex of remainingExamples) {
              if (ex.deck_name === p) {
                currentExamples.push(ex);
              } else {
                nextRemainingExamples.push(ex);
              }
            }

            sortedExamples[p] = currentExamples;
            remainingExamples = nextRemainingExamples;
          }

          sortedExamples[''] = remainingExamples.reduce((prev, c) => {
            prev[c.deck_name] = prev[c.deck_name] || [];
            prev[c.deck_name].push(c);
            return prev;
          }, {});

          if (OPTS.LOG && OPTS.LOG.immersionKit)
            (window.unsafeWindow || window).console.log(sortedExamples);

          for (const ss of [
            ...IMMERSION_KIT.priority.map((p) => sortedExamples[p]),
            Object.values(sortedExamples['']).reduce(
              (prev, c) => [...prev, ...c],
              [],
            ),
          ]) {
            for (const s of shuffleArray(ss)) {
              sentences.push({
                id: s.sentence_id,
                ja: `${s.sentence} (${s.deck_name})`,
                audio: s.sound_url,
                en: s.translation,
              });
            }
          }

          appender.renew();
        });
    }
  };

  const appender = wkItemInfo
    .on('lesson,lessonQuiz,review,extraStudy')
    .forType('vocabulary')
    .under('reading')
    .spoiling('reading')
    .appendAtTop('Autoplay Sentences', (state) => {
      if (!current) return;
      if (current.id !== state.id) return;

      const outputDiv = document.createElement('div');
      outputDiv.className = HTML_CLASS;

      /** @type {AudioPlayer | null} */
      let vocabAudioEl = null;
      if (current.aud) {
        /**
         * @type {Record<string, AudioPlayer>}
         */
        const vocabAudioEls = {};
        current.aud.map((a) => {
          const identifier = `${a.pronunciation}:${a.voice_actor_id}`;
          let audioEl = vocabAudioEls[identifier];
          if (!audioEl) {
            audioEl = createAudioPlayer('vocab', identifier);
            audioEl.span.style.display = 'none';

            vocabAudioEls[identifier] = audioEl;
          }

          const source = document.createElement('source');
          source.type = a.content_type;
          source.src = a.url;

          audioEl.audio.append(source);
        });

        const vocabAudioElArray = Object.values(vocabAudioEls);
        const n = Math.floor(vocabAudioElArray.length * Math.random());
        vocabAudioEl = vocabAudioElArray[n];
        outputDiv.append(vocabAudioEl.span);
        vocabAudioElArray.map((el, i) => (i !== n ? el.span.remove() : null));
      }

      let hasSentences = false;
      /** @type {AudioPlayer[]} */
      const sentenceAudioElArray = [];

      /**
       *
       * @param {HTMLElement} target
       * @param {ISentence[]} ss
       */
      const createSentenceSection = (target, ss) => {
        return ss.map((s) => {
          const section = document.createElement('section');
          const p = document.createElement('p');
          section.append(p);

          if (s.audio) {
            const player = createAudioPlayer('sentence', s.id);
            player.audio.src = s.audio;
            sentenceAudioElArray.push(player);
            p.append(player.span);
          }

          if (s.ja && OPTS.HIDE_SENTENCE_JA !== 'remove') {
            const span = document.createElement('span');
            if (OPTS.HIDE_SENTENCE_JA) {
              span.className = HIDDEN_UNTIL_HOVER_CLASS;
            }
            span.lang = 'ja';
            span.innerHTML = s.ja;
            p.append(span);
          }

          if (s.en && OPTS.HIDE_SENTENCE_EN !== 'remove') {
            const p = document.createElement('p');
            if (OPTS.HIDE_SENTENCE_EN) {
              p.className = HIDDEN_UNTIL_HOVER_CLASS;
            }
            p.lang = 'ja';
            p.innerHTML = s.en;
            section.append(p);
          }

          hasSentences = true;
          target.append(section);
        });
      };

      createSentenceSection(
        outputDiv,
        sentences.slice(0, OPTS.NUMBER_OF_SENTENCES),
      );

      let needAutoplay = true;

      const [a1, a2] = autoplayDivArray;

      if (a1) {
        if (a1.querySelector('audio[data-sentence]')) {
          needAutoplay = false;
        }
      }
      if (a2) {
        needAutoplay = false;
      }

      if (needAutoplay) {
        const autoplayDiv = document.createElement('div');
        autoplayDiv.style.display = 'none';

        if (!a1 && vocabAudioEl) {
          const el1 = vocabAudioEl.clone();
          el1.audio.autoplay = true;
          autoplayDiv.append(el1.span);

          const firstSent = sentenceAudioElArray[0];
          if (firstSent) {
            const el2 = firstSent.clone();
            autoplayDiv.append(el2.span);
            el1.audio.onended = () => {
              el2.audio.play();
              el1.audio.onended = null;
            };
          }
        } else {
          const firstSent = sentenceAudioElArray[0];
          if (firstSent) {
            const el2 = firstSent.clone();
            autoplayDiv.append(el2.span);

            let isAutoplaySentence = true;
            if (a1.classList.contains(AUDIO_PLAYED)) {
              const v = a1.querySelector('audio[data-vocab]');
              if (v instanceof HTMLAudioElement) {
                if (!v.classList.contains(AUDIO_PLAYED)) {
                  isAutoplaySentence = false;
                  v.onended = () => {
                    el2.audio.play();
                    v.onended = null;
                  };
                }
              }
            }

            if (isAutoplaySentence) {
              el2.audio.autoplay = true;
            }
          }
        }

        autoplayDivArray.push(autoplayDiv);
        document.body.append(autoplayDiv);
      }

      if (sentences.length > OPTS.NUMBER_OF_SENTENCES) {
        const details = document.createElement('details');

        const summary = document.createElement('summary');
        summary.innerText = 'Additional Examples';
        details.append(summary);

        createSentenceSection(
          details,
          // Trim to 25 for performance reasons
          sentences.slice(OPTS.NUMBER_OF_SENTENCES).slice(0, 25),
        );
        outputDiv.append(details);
      }

      if (outputDiv.innerHTML && hasSentences) {
        return outputDiv;
      } else {
        outputDiv.remove();
      }
    });

  // $.jStorage.listenKeyChange('*', (key, state) =>
  //   (window.unsafeWindow || window).console.log(
  //     key,
  //     state,
  //     $.jStorage.get(key),
  //   ),
  // );

  $.jStorage.listenKeyChange('questionCount', onNewVocabulary);
  $.jStorage.listenKeyChange('l/currentLesson', onNewVocabulary);
  $.jStorage.listenKeyChange('l/currentQuizItem', onNewVocabulary);
  onNewVocabulary();

  const AUDIO_IDLE = 'audio-idle';
  const AUDIO_PLAY = 'audio-play';
  const AUDIO_PLAYED = 'audio-played';

  /**
   *
   * Create an audio play using WaniKani styling
   *
   * @typedef {ReturnType<typeof createAudioPlayer>} AudioPlayer
   *
   * @param {string} idKey
   * @param {string} idValue
   */
  function createAudioPlayer(idKey, idValue) {
    const span = document.createElement('span');
    span.className = 'audio-player';
    span.setAttribute(`data-${idKey}`, idValue);

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'audio-btn';
    button.classList.add(AUDIO_IDLE);
    button.setAttribute(`data-${idKey}`, idValue);

    const audio = document.createElement('audio');
    audio.style.display = 'none';
    audio.preload = 'none';
    audio.setAttribute(`data-${idKey}`, idValue);

    button.addEventListener('click', () => {
      audio.play().then(() => {
        document
          .querySelectorAll(`[data-${idKey}="${idValue}"]`)
          .forEach((el) => {
            if (el instanceof HTMLElement) {
              el.style.pointerEvents = 'none';
              el.classList.replace(AUDIO_IDLE, AUDIO_PLAY);
            }
          });
      });
    });

    audio.addEventListener('ended', () => {
      document
        .querySelectorAll(`[data-${idKey}="${idValue}"]`)
        .forEach((el) => {
          if (el instanceof HTMLElement) {
            el.style.pointerEvents = '';
            el.classList.add(AUDIO_PLAYED);
            el.classList.replace(AUDIO_PLAY, AUDIO_IDLE);
          }
        });
    });

    span.append(button, audio);

    const oldSpan = span;

    return {
      span,
      button,
      audio,
      clone() {
        const span = /** @type {HTMLSpanElement} */ (oldSpan.cloneNode(true));
        const button =
          span.querySelector('button') || document.createElement('button');
        const audio =
          span.querySelector('audio') || document.createElement('audio');
        return { span, button, audio };
      },
    };
  }

  /**
   * Fisher-Yates (aka Knuth) Shuffle
   *
   * https://stackoverflow.com/a/2450976/9023855
   *
   * @type {<T>(arr: T[]) => T[]}
   */
  function shuffleArray(array) {
    let currentIndex = array.length;
    let randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  function noscroll() {
    window.scrollTo(0, 0);
  }
})();
