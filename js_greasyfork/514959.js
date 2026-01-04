// ==UserScript==
// @name         Jisho.org Frequency
// @copyright    Copyright 2024 neko.py (MIT License)
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      2024-10-31
// @description  Inject frequency info into Jisho results.
// @author       neko.py
// @match        https://jisho.org/search/*
// @match        https://jisho.org/word/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jisho.org
// @resource     JPDB https://jpdb.us-lax-1.linodeobjects.com/term_meta_bank_1.json#md5=081b2805526cfae61269fd88ddd02962
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @sandbox      DOM
// @downloadURL https://update.greasyfork.org/scripts/514959/Jishoorg%20Frequency.user.js
// @updateURL https://update.greasyfork.org/scripts/514959/Jishoorg%20Frequency.meta.js
// ==/UserScript==

const __license__ = `
MIT License

Copyright (c) 2024 neko.py

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;

const prepDB = async (db) => {
    'use strict';

    let count = 0;
    let newDb = [];
    for (const entry of db) {
        const info = entry[2];
        if (undefined === info) {
            continue;
        }

        if (info.hasOwnProperty("value")) { // we're a kana entry
            let babu = [];
            babu[entry[0]] = info.displayValue;
            newDb[entry[0]] = babu;
        } else { // non-kana
            const kanji = entry[0];
            const reading = info.reading;
            if (!newDb.hasOwnProperty(kanji)) {
                newDb[kanji] = [];
            }

            if (!newDb[kanji].hasOwnProperty(reading)) {
                newDb[kanji][reading] = info.frequency.displayValue;
            } else {
                newDb[kanji][reading] += ", " + info.frequency.displayValue;
            }


        }
        count++;
    }

    //console.info(count);
    return newDb;
};

(async function() {
    'use strict';

    GM_addStyle(`
    .freq-div {
         color: #e100ff;
         font-size: 18px;
    }
    `);


    const data = GM_getResourceText("JPDB");
    const db = JSON.parse(data);

    console.info("JPDB Loaded");
    const dbres = await prepDB(db);

    console.info("JPDB Ready!");

    const blok = document.getElementsByClassName("exact_block")[0];

    let divs = undefined;
    try {
        divs = blok.getElementsByClassName("concept_light-wrapper");
    } catch {
        divs = document.getElementsByClassName("concept_light-wrapper");
    }

    for (const div of divs) {
        const daWord = div.getElementsByClassName("text")[0].textContent.trim();
        if (!dbres.hasOwnProperty(daWord)) {
            console.warn("Missing: " + daWord);
            continue;
        }

        const furis = div.getElementsByClassName("kanji"); // misleading class name. This is the furigana
        let reading = daWord;
        if (furis.length > 0) {
            reading = "";
            for (const furi of furis) {
                reading += furi.textContent.trim().replaceAll(" ", "");
            }
        }

        if (!dbres[daWord].hasOwnProperty(reading)) {
            console.warn("Missing Reading: " + daWord + " : " + reading);
            continue;
        }

        const freq = dbres[daWord][reading];

        const tempDiv = document.createElement("div");
        tempDiv.classList.add("freq-div");
        tempDiv.textContent = "Freq: " + freq;
        div.insertAdjacentElement("afterend", tempDiv);
    }



})();