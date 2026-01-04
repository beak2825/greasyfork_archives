"use strict";

// ==UserScript==
// @name         Advanced Context Sentence
// @namespace    https://openuserjs.org/users/abdullahalt
// @version      1.40
// @description  Enhance the context sentence section, highlighting kanji and adding audio
// @author       abdullahalt
// @match        https://www.wanikani.com/lesson/session
// @match        https://www.wanikani.com/review/session
// @match        https://www.wanikani.com/vocabulary/*
// @grant        none
// @require      https://unpkg.com/popper.js@1/dist/umd/popper.min.js
// @require      https://unpkg.com/tippy.js@4
// @copyright    2019, abdullahalt (https://openuserjs.org//users/abdullahalt)
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/377573/Advanced%20Context%20Sentence.user.js
// @updateURL https://update.greasyfork.org/scripts/377573/Advanced%20Context%20Sentence.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author abdullahalt
// ==/OpenUserJS==

(() => {
  //--------------------------------------------------------------------------------------------------------------//
  //-----------------------------------------------INITIALIZATION-------------------------------------------------//
  //--------------------------------------------------------------------------------------------------------------//
  const wkof = window.wkof;

  const scriptId = "AdvancedContextSentence";
  const scriptName = "Advanced Context Sentence";
  const vocabularyPage = "/vocabulary";
  const recognizedSelector = "a.recognized";
  const unrecognizedSelector = "a.unrecognized";
  const sessions = [
    {
      page: "/review/session",
      mount: "#item-info-col2",
      loading: "#loading",
      getHeader: sentences => {
        return sentences[0].previousElementSibling;
      }
    },
    {
      page: "/lesson/session",
      mount: "#supplement-voc-context-sentence",
      loading: "#loading-screen",
      getHeader: sentences => {
        return sentences[0].parentElement.previousElementSibling;
      }
    }
  ];

  let state = {
    settings: {
      recognizedKanjiColor: "#f100a1",
      unrecognizedKanjiColor: "#888888",
      recognitionLevel: "5",
      tooltip: {
        show: true,
        delay: 0,
        position: "top"
      }
    },
    kanjis: [],
    jiff: false // JLPT, Joyo and Frequency Filters
  };

  // Application start Point
  main();

  function main() {
    // we don't need to observe any changes in the vocabulary page
    if (isPage(vocabularyPage)) {
      init(() =>
        evolveContextSentence(sentences => {
          return sentences[0].previousElementSibling;
        })
      );
      return;
    }

    // Get the target for the session page to watch for changes
    const session = getSessionDependingOnPage();
    if (session) startObserving(session);
  }

  function startObserving({ mount, loading, getHeader }) {
    const loadingObservationConfiguration = {
      attributes: true,
      childList: false,
      subtree: false
    };

    const itemInfoObservationConfiguration = {
      attributes: false,
      childList: true,
      subtree: false
    };

    const observeLoading = () => {
      observeChanges({
        element: loading,
        config: loadingObservationConfiguration,
        onChange: runInit
      });
    };

    const runInit = () => {
      init(() => {
        observeSentenceChanges();
      });
    };

    const observeSentenceChanges = () => {
      observeChanges({
        element: mount,
        continuesObservation: true,
        config: itemInfoObservationConfiguration,
        onChange: () => evolve(),
        onInitObserver: () => evolve()
      });
    };

    const evolve = () => evolveContextSentence(getHeader);

    /**
     * Basically, this function will fire an observer that will
     * watch when the loading screen on the session pages (lesson and review) stops,
     * then it will fire another observer to watch for changing the sentences,
     * whenever the sentence change it will fire the evolveContextSentence over it again
     *
     * why wait for the loading screen stops? because the script slows down the animation
     * which makes a really bad user experience
     */
    observeLoading();
  }

  function init(callback) {
    createReferrer();
    createStyle();

    if (wkof) {
      wkof.include("ItemData,Settings");
      wkof
        .ready("ItemData,Settings")
        .then(loadSettings)
        .then(proccessLoadedSettings)
        .then(getKanji)
        .then(extractKanjiFromResponse)
        .then(callback);
    } else {
      console.warn(
        `${scriptName}: You are not using Wanikani Open Framework which this script utlizes to see the kanji you learned and highlights it with a different color, it also provides the settings dailog for the scrip. You can still use Advanced Context Sentence normally though`
      );
      callback();
    }
  }

  function evolveContextSentence(getHeader) {
    const sentences = document.querySelectorAll(".context-sentence-group");
    if (sentences.length === 0) return;

    if (wkof) evolveHeader(getHeader(sentences));

    sentences.forEach(sentence => {
      const japaneseSentence = sentence.querySelector('p[lang="ja"]');
      const audioButton = createAudioButton(japaneseSentence.innerHTML);
      //let advancedExampleSentence = "";
      const chars = japaneseSentence.innerHTML.split("");
      japaneseSentence.innerHTML = "";
      chars.forEach(char => {
        japaneseSentence.innerHTML =
          japaneseSentence.innerHTML + tagAndLinkKanji(char).trim();
      });

      highlightKanji();

      japaneseSentence.append(audioButton);
    });
  }

  function evolveHeader(header) {
    const settings = document.createElement("i");
    settings.setAttribute("class", "icon-gear");
    settings.setAttribute(
      "style",
      "font-size: 14px; cursor: pointer; vertical-align: middle; margin-left: 10px;"
    );
    settings.onclick = openSettings;

    if (!header.querySelector("i.icon-gear")) header.append(settings);
  }

  /**
   * To fix a weird issue that occur in the session pages(where all audios play
   * if the audio for reading the word is clicked),
   * we have to create the audio element only for the time of palying the audio
   * and remove it afterward
   * @param {*} sentence
   */
  function createAudioButton(sentence) {
    // contains audio and button as sibiling elements
    const audioContainer = document.createElement("span");

    const mpegSource = createSource("audio/mpeg", sentence);
    const oogSource = createSource("audio/oog", sentence);

    const button = document.createElement("button");
    button.setAttribute("class", "audio-btn audio-idle");

    button.onclick = () => {
      if (audioContainer.childElementCount > 1) {
        const audio = audioContainer.querySelector("audio");
        audio.pause();
        button.setAttribute("class", "audio-btn audio-idle");
        audio.remove();
        return;
      }

      const audio = document.createElement("audio");
      audio.setAttribute("display", "none");
      audio.append(mpegSource, oogSource);

      audio.onplay = () => {
        button.setAttribute("class", "audio-btn audio-play");
      };

      audio.onended = () => {
        button.setAttribute("class", "audio-btn audio-idle");
        audio.remove();
      };

      audioContainer.append(audio);
      audio.play();
    };

    audioContainer.append(button);
    return audioContainer;
  }

  function observeChanges(params) {
    const {
      element,
      config,
      onChange,
      onInitObserver = () => {},
      continuesObservation = false
    } = params;

    if (!window.MutationObserver) {
      console.warn(
        `${scriptName}: you're browser does not support MutationObserver which this script utilaizes to implement its features in /lesson/session and /review/sesson. update you're broswer or use another one if you want Advanced Context Sentence to work on them. This script is still useful on /vocabulary page though`
      );
      return;
    }

    onInitObserver();

    const target = document.querySelector(element);
    const observer = new MutationObserver(() => {
      observer.disconnect();
      onChange();
      continuesObservation && observer.observe(target, config);
    });

    observer.observe(target, config);
  }

  //--------------------------------------------------------------------------------------------------------------//
  //----------------------------------------------SETTINGS--------------------------------------------------------//
  //--------------------------------------------------------------------------------------------------------------//

  function loadSettings() {
    return wkof.Settings.load(scriptId, state.settings);
  }

  function proccessLoadedSettings() {
    state.settings = wkof.settings[scriptId];
  }

  function openSettings() {
    var config = {
      script_id: scriptId,
      title: scriptName,
      on_save: updateSettings,
      content: {
        highlightColors: {
          type: "section",
          label: "Highlights"
        },
        recognizedKanjiColor: {
          type: "color",
          label: "Recognized Kanji",
          hover_tip:
            "Kanji you should be able to recognize will be highlighted using this color",
          default: state.settings.recognizedKanjiColor
        },
        unrecognizedKanjiColor: {
          type: "color",
          label: "Unrecognized Kanji",
          hover_tip:
            "Kanji you shouldn't be able to recognize will be highlighted using this color",
          default: state.settings.unrecognizedKanjiColor
        },
        recognitionLevel: {
          type: "dropdown",
          label: "Recognition Level",
          hover_tip:
            "Any kanji with this level or higher will be highlighted with the 'Recognized Kanji' color",
          default: state.settings.recognitionLevel,
          content: {
            1: stringfySrs(1),
            2: stringfySrs(2),
            3: stringfySrs(3),
            4: stringfySrs(4),
            5: stringfySrs(5),
            6: stringfySrs(6),
            7: stringfySrs(7),
            8: stringfySrs(8),
            9: stringfySrs(9)
          }
        },
        tooltip: {
          type: "section",
          label: "Tooltip"
        },
        show: {
          type: "checkbox",
          label: "Show Tooltip",
          hover_tip:
            "Display a tooltip when hovering on kanji that will display some of its properties",
          default: state.settings.tooltip.show,
          path: "@tooltip.show"
        },
        delay: {
          type: "number",
          label: "Delay",
          hover_tip: "Delay in ms before the tooltip is shown",
          default: state.settings.tooltip.delay,
          path: "@tooltip.delay"
        },
        position: {
          type: "dropdown",
          label: "Position",
          hover_tip: "The placement of the tooltip",
          default: state.settings.tooltip.position,
          path: "@tooltip.position",
          content: {
            top: "Top",
            bottom: "Bottom",
            right: "Right",
            left: "Left"
          }
        }
      }
    };
    var dialog = new wkof.Settings(config);
    dialog.open();
  }

  // Called when the user clicks the Save button on the Settings dialog.
  function updateSettings() {
    state.settings = wkof.settings[scriptId];
    highlightKanji();
  }

  //---------------------------------------------------------------------------------------------------------------//
  //-------------------------------------------HELPER FUNCTIONS----------------------------------------------------//
  //---------------------------------------------------------------------------------------------------------------//

  function isPage(page) {
    const path = window.location.pathname;
    return path.includes(page);
  }

  function getSessionDependingOnPage() {
    let result = null;
    sessions.forEach(session => {
      if (isPage(session.page)) result = session;
    });

    return result;
  }

  function tagAndLinkKanji(char) {
    return isKanji(char) ? wrapInAnchor(char).outerHTML : char;
  }

  /**
   * Determine if the character is a Kanji, inspired by https://stackoverflow.com/a/15034560
   */
  function isKanji(char) {
    return isCommonOrUncommonKanji(char) || isRareKanji(char);
  }

  function isCommonOrUncommonKanji(char) {
    return char >= "\u4e00" && char <= "\u9faf";
  }

  function isRareKanji(char) {
    char >= "\u3400" && char <= "\u4dbf";
  }

  /**
   * Renders the link for the kanji
   * Knji pages always use https://www.wanikani.com/kanji/{kanji} where {kanji} is the kanji character
   */
  function wrapInAnchor(char) {
    const anchor = document.createElement("a");
    anchor.setAttribute("target", "_blank");
    anchor.setAttribute("class", "recognized");

    if (!wkof) {
      anchor.setAttribute("href", `https://www.wanikani.com/kanji/${char}`);
      anchor.innerText = char;
      return anchor;
    }

    const kanji = state.kanjis.find(item => item.char == char);

    anchor.setAttribute("data-srs", kanji ? kanji.srs : -1);
    anchor.setAttribute("data-kanji", char);
    anchor.setAttribute(
      "href",
      kanji ? kanji.url : `https://jisho.org/search/${char}`
    );

    anchor.innerText = char;
    return anchor;
  }

  function createTooltip(kanji) {
    if (!wkof) {
      const container = document.createElement("span");
      return container;
    }

    const container = document.createElement("div");
    container.setAttribute("class", "acs-tooltip");

    if (!kanji) {
      const span = document.createElement("span");
      span.innerText = "Wanikani doesn't have this kanji! :(";
      container.append(span);
      return container;
    }

    const onyomis = kanji.readings.filter(
      item => item.type.toLocaleLowerCase() === "onyomi"
    );
    const kunyomis = kanji.readings.filter(
      item => item.type.toLocaleLowerCase() === "kunyomi"
    );

    const onyomi = stringfyArray(onyomis, item => item.reading);
    const kunyomi = stringfyArray(kunyomis, item => item.reading);
    const meaning = stringfyArray(kanji.meanings, item => item.meaning);

    container.append(generateInfo("LV", kanji.level));

    container.append(generateInfo("EN", meaning));

    if (onyomi !== "None" && onyomi !== "")
      container.append(generateInfo("ON", onyomi));
    if (kunyomi !== "None" && kunyomi !== "")
      container.append(generateInfo("KN", kunyomi));
    container.append(generateInfo("SRS", stringfySrs(kanji.srs)));

    if (state.jiff) {
      container.append(generateInfo("JOYO", kanji.joyo));
      container.append(generateInfo("JLPT", kanji.jlpt));
      container.append(generateInfo("FREQ", kanji.frequency));
    }
    return container;
  }

  function stringfyArray(array, pathToString) {
    let stringfied = "";
    array.forEach(item => {
      stringfied = stringfied.concat(pathToString(item) + ", ");
    });
    stringfied = stringfied.substring(0, stringfied.length - 2);
    return stringfied;
  }

  function stringfySrs(srs) {
    switch (srs) {
      case -1:
        return "Locked";
      case 0:
        return "Ready To Learn";
      case 1:
        return "Apprentice 1";
      case 2:
        return "Apprentice 2";
      case 3:
        return "Apprentice 3";
      case 4:
        return "Apprentice 4";
      case 5:
        return "Guru 1";
      case 6:
        return "Guru 2";
      case 7:
        return "Master";
      case 8:
        return "Enlightened";
      case 9:
        return "Burned";
      default:
        return "";
    }
  }

  function generateInfo(title, info) {
    const container = document.createElement("div");
    const key = document.createElement("span");
    key.setAttribute("class", "acs-tooltip-header");
    const value = document.createElement("span");
    key.innerText = title;
    value.innerText = info;
    container.append(key, " ", value);
    return container;
  }

  function getKanji() {
    const filters = {
      item_type: ["kan"]
    };

    if (wkof.get_state("wkof.Kumirei.JJFFilters") === "ready") {
      state.jiff = true;
      filters.include_frequency_data = true;
      filters.include_jlpt_data = true;
      filters.include_joyo_data = true;
    } else {
      console.warn(
        `${scriptName}: You don't have Open Framework JLPT Joyo and Frequency Filters by @Kumirei installed (version 0.1.4 or later). Install the script if you want to get more information while hovering on Kanji on Context Sentences. Script URL: https://community.wanikani.com/t/userscript-open-framework-jlpt-joyo-and-frequency-filters/35096`
      );
    }

    return wkof.ItemData.get_items({
      wk_items: {
        options: {
          assignments: true
        },
        filters
      }
    });
  }

  function extractKanjiFromResponse(items) {
    const kanjis = [];

    items.forEach(item => {
      const kanji = {
        char: item.data.characters,
        readings: item.data.readings,
        level: item.data.level,
        meanings: item.data.meanings,
        url: item.data.document_url,
        srs: item.assignments ? item.assignments.srs_stage : -1,
        jlpt: item.jlpt_level,
        joyo: item.joyo_grade,
        frequency: item.frequency
      };

      kanjis.push(enhanceWithAditionalFilters(kanji, item));
    });

    state.kanjis = kanjis;
  }

  function enhanceWithAditionalFilters(kanji, item) {
    if (state.jiff) {
      kanji.jlpt = item.jlpt_level;
      kanji.joyo = item.joyo_grade;
      kanji.frequency = item.frequency;
    }
    return kanji;
  }

  function createSource(type, sentence) {
    const source = document.createElement("source");
    source.setAttribute("type", type);
    source.setAttribute(
      "src",
      `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=ja&total=1&idx=0&q=${sentence}`
    );
    return source;
  }

  function highlightKanji() {
    const rules = document.querySelector("#acs-style").sheet.cssRules;
    rules[0].style.color = state.settings.recognizedKanjiColor;
    rules[1].style.color = state.settings.unrecognizedKanjiColor;

    if (!wkof) return;

    const anchors = document.querySelectorAll(".context-sentence-group a");
    anchors.forEach(anchor => {
      const srs = anchor.getAttribute("data-srs");
      const char = anchor.getAttribute("data-kanji");

      if (srs >= state.settings.recognitionLevel)
        anchor.setAttribute("class", "recognized");
      else {
        anchor.setAttribute("class", "unrecognized");
      }

      if (anchor._tippy) anchor._tippy.destroy();
      if (state.settings.tooltip.show) {
        const kanji = state.kanjis.find(item => item.char == char);
        const tooltip = createTooltip(kanji);

        tippy(anchor, {
          content: tooltip.outerHTML,
          size: "small",
          arrow: true,
          placement: state.settings.tooltip.position,
          delay: [state.settings.tooltip.delay, 20]
        });
      }
    });
  }

  // Neccessary in order for audio to work
  function createReferrer() {
    const remRef = document.createElement("meta");
    remRef.name = "referrer";
    remRef.content = "no-referrer";
    document.querySelector("head").append(remRef);
  }

  // Styles
  function createStyle() {
    const style = document.createElement("style");
    style.setAttribute("id", "acs-style");
    style.innerHTML = `
      
      /* Kanji */
      /* It's important for this one to be the first rule*/
      ${recognizedSelector} {
        
      }
      /* It's important for this one to be the second rule*/
      ${unrecognizedSelector} {

      }

      .context-sentence-group p a {
        text-decoration: none;
      }

      .context-sentence-group p a:hover {
        text-decoration: none;
      }

      .acs-tooltip {
        text-align: left
      }

      .acs-tooltip-header {
        color: #929292
      }
    
    `;

    document.querySelector("head").append(style);
  }
})();
