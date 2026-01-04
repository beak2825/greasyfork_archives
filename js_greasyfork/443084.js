// ==UserScript==
// @name         WK Vocab Breakdown
// @namespace    http://tampermonkey.net/
// @version      0.2.3
// @description  try to take over the world!
// @author       You
// @match        https://www.wanikani.com/*
// @match        https://preview.wanikani.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wanikani.com
// @grant        none
// @require      https://greasyfork.org/scripts/430565-wanikani-item-info-injector/code/WaniKani%20Item%20Info%20Injector.user.js?version=1285431
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443084/WK%20Vocab%20Breakdown.user.js
// @updateURL https://update.greasyfork.org/scripts/443084/WK%20Vocab%20Breakdown.meta.js
// ==/UserScript==

(async function(wkItemInfo, wkof) {
  'use strict';

  if (!wkof) {
    alert("WK Vocab Breakdown requires Wanikani Open Framework." +
          "You will now be forwarded to installation instructions.");
    window.location.href = "https://community.wanikani.com/t/" +
      "instructions-installing-wanikani-open-framework/28549";
    return;
  }

  appendStyleElem();

  wkof.include("ItemData");
  await wkof.ready("ItemData");
  const kanjiData = await wkof.ItemData.get_items({
    wk_items: {
      filters: {
        item_type: "kan",
      }
    }
  });

  wkItemInfo
    .on("lesson,lessonQuiz,review")
    .forType("vocabulary")
    .under("reading")
    .spoiling("reading")
    .appendSubsection("Reading Breakdown", createReadingBreakdown);

  wkItemInfo
    .on("lesson,lessonQuiz,review")
    .forType("vocabulary")
    .under("meaning")
    .spoiling("meaning")
    .appendSubsection("Meaning Breakdown", createMeaningBreakdown);

  function createReadingBreakdown(item) {
    console.log(item);
    const composition = getCompositionKanji(item);
    const breakdown = tryBreakdownReading(item.reading[0], item.characters, composition);

    if (breakdown.every(b => b === null)) {
      return undefined;
    }

    const parent = document.createElement("div");
    parent.classList.add("reading-breakdown__parent");

    breakdown.forEach((b, i) => {
      if (b === null) {
        return;
      }
      const container = document.createElement("div");
      container.classList.add("reading-breakdown__container")
      const titleContainer = document.createElement("div");
      titleContainer.classList.add("reading-breakdown__title");
      const kanji = document.createElement("span");
      kanji.classList.add("reading-breakdown__title-kanji");
      kanji.textContent = composition[i].characters;
      const reading = document.createElement("span");
      reading.textContent = b.reading;
      reading.classList.add("reading-breakdown__title-reading");
      titleContainer.append(kanji, reading);

      if (b.rendaku) {
        const rendakuElem = document.createElement("span");
        rendakuElem.textContent = "R";
        rendakuElem.classList.add("reading-breakdown__title-rendaku");
        rendakuElem.title = "This reading seems to rendaku";
        titleContainer.append(rendakuElem);
      }

      const mnemonic = document.createElement("div");
      mnemonic.innerHTML = parseMnemonic(composition[i].reading_mnemonic);
      mnemonic.classList.add("reading-breakdown__mnemonic");
      const hint = document.createElement("div");
      hint.innerHTML = parseMnemonic(composition[i].reading_hint);
      hint.classList.add("reading-breakdown__hint");

      container.append(titleContainer, mnemonic, hint);
      parent.append(container);
    });
    return parent;
  }

  function createMeaningBreakdown(item) {
    const composition = getCompositionKanji(item);

    const parent = document.createElement("div");
    parent.classList.add("reading-breakdown__parent");

    composition.forEach((c) => {
      const container = document.createElement("div");
      container.classList.add("reading-breakdown__container")
      const titleContainer = document.createElement("div");
      titleContainer.classList.add("reading-breakdown__title");
      const kanji = document.createElement("span");
      kanji.classList.add("reading-breakdown__title-kanji");
      kanji.textContent = c.characters;
      const meanings = c.meanings.filter(m => m.primary).map(m => m.meaning).join(", ");
      const meaning = document.createElement("span");
      meaning.textContent = meanings;
      meaning.classList.add("reading-breakdown__title-meaning");
      titleContainer.append(kanji, meaning);

      const mnemonic = document.createElement("div");
      mnemonic.innerHTML = parseMnemonic(c.meaning_mnemonic);
      mnemonic.classList.add("reading-breakdown__mnemonic");
      const hint = document.createElement("div");
      hint.innerHTML = parseMnemonic(c.meaning_hint);
      hint.classList.add("reading-breakdown__hint");

      container.append(titleContainer, mnemonic, hint);
      parent.append(container);
    });
    return parent;
  }

  function parseMnemonic(mnemonic) {
    mnemonic = mnemonic.replaceAll(/<([^/]+?)>/g, (_, contents) => `<span class="${contents}-highlight">`);
    mnemonic = mnemonic.replaceAll(/<\/[^/]+?>/g, () => `</span>`);
    return mnemonic;
  }

  function getCompositionKanji(item) {
    const composition = item.composition.map(c => c.characters);

    return kanjiData
      .map(k => k.data)
      .filter((kanji) => composition.includes(kanji.characters))
      .sort((a, b) => composition.indexOf(a.characters) - composition.indexOf(b.characters));
  }

  function tryBreakdownReading(reading, kanjiReading, kanji) {
    while (reading.length > 0 && reading[0] === kanjiReading[0]) {
      reading = reading.slice(1);
      kanjiReading = kanjiReading.slice(1);
    }

    while (reading.length > 0
           && reading[reading.length - 1] == kanjiReading[kanjiReading.length - 1]) {
      reading = reading.slice(0, reading.length - 1);
      kanjiReading = kanjiReading.slice(0, kanjiReading.length - 1);
    }

    let inFront = true;
    return kanji.map((k) => {
      const primaryReadings = k.readings
      .filter(r => r.primary)
      .map(r => r.reading);
      const readings = primaryReadings
      .filter(r => k.reading_mnemonic.includes(r));
      if (readings.length === 0) {
        readings.push(primaryReadings[0]);
      }
      const withRendaku = readings.flatMap(r => getAllRendaku(r));
      const sokuon = withRendaku.flatMap(r => getAllSokuon(r));

      let foundReading;
      if (inFront) {
        foundReading = sokuon
          .filter(r => reading.startsWith(r))
          .sort((a, b) => b.length - a.length)[0];
      } else {
        foundReading = sokuon
          .filter(r => reading.includes(r))
          .sort((a, b) => reading.indexOf(b) - reading.indexOf(a))[0];
      }

      if (foundReading) {
        reading = reading.slice(reading.indexOf(foundReading) + foundReading.length);
        inFront = true;
        return {reading: foundReading, rendaku: !readings.includes(foundReading)};
      }
      inFront = false;
      return null;
    });
  }

  function getAllRendaku(reading) {
    const rendakuable = ["かきくけこ", "さしすせそ", "たちつてと", "はひふへほ"];
    const rendakuChart = [
      ["がぎぐげご"],
      ["ざじずぜぞ"],
      ["だぢづでど"],
      ["ばびぶべぼ","ぱぴぷぺぽ"],
    ];

    const index = rendakuable.findIndex(s => s.includes(reading[0]));

    if (index === -1) {
      return [reading];
    }

    const characterIndex = rendakuable[index].indexOf(reading[0]);
    return [reading[0], ...rendakuChart[index].map(s => s[characterIndex])].map(r => r + reading.slice(1));
  }

  function getAllSokuon(reading) {
    const sokuonable = "くつ";
    if (sokuonable.includes(reading[reading.length - 1])) {
      return [reading, reading.slice(0, reading.length - 1) + "っ"];
    }
    return [reading];
  }

  function appendStyleElem() {
    const styleElem = document.createElement("style");
    styleElem.innerHTML = `
      .reading-breakdown__container {
        margin: 1em 0;
      }

      .reading-breakdown__title {
        margin-bottom: 0.5em;
      }

      .reading-breakdown__title-kanji {
        background: hsl(0, 0%, 0%, 0.1);
        padding: 0.5em;
        border-radius: 0.5em;
        margin-right: 0.5em;
      }

      .reading-breakdown__hint {
        padding: 0.5em;
        background: hsl(0, 0%, 0%, 0.1);
        border-radius: 0.5em;
      }

      .reading-breakdown__title-rendaku {
        background: hsl(240, 50%, 50%, 0.5);
        border-radius: 0.5em;
        font-size: 0.8em;
        display: inline-block;
        width: 2em;
        height: 2em;
        line-height: 2em;
        vertical-align: middle;
        text-align: center;
        margin-left: 1em;
        cursor: default;
        color: white;
      }
    `;
    document.head.append(styleElem);
  }
})(window.wkItemInfo, window.wkof);