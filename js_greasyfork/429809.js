// ==UserScript==
// @name         Wanikani ContextFurigana
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Add furigana to the wanikani context sentences
// @author       Gorbit99
// @include      /^https://(www|preview).wanikani.com//
// @icon         https://www.google.com/s2/favicons?domain=wanikani.com
// @connect      jisho.org
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/429809/Wanikani%20ContextFurigana.user.js
// @updateURL https://update.greasyfork.org/scripts/429809/Wanikani%20ContextFurigana.meta.js
// ==/UserScript==

let userData = undefined;

let cache = {};

(async function() {
    'use strict';
    if (!wkof) {
        alert('Context+ requires Wanikani Open Framework.\nYou will now be forwarded to installation instructions.');
        window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
        return;
    }

    wkof.include('Apiv2');
    wkof.include('ItemData');
    await wkof.ready('Apiv2');
    await wkof.ready('ItemData');

    userData = (await wkof.Apiv2.fetch_endpoint("user")).data;

    updateFurigana();

    window.addEventListener("load", event => {
    });

    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    if( MutationObserver ){
      var mutationObserver = new MutationObserver(updateFurigana)

      mutationObserver.observe( document, { childList:true, subtree:true });
    }

})();

async function updateFurigana() {
    console.log("now");
    await new Promise(resolve => setTimeout(resolve, 200));;
    let contextSentences = document.querySelectorAll(".context-sentence-group > :first-child:not(.handled)");
    Promise.all([...contextSentences].map(parseContext));
}

async function parseContext(elem) {
    console.log(elem);
    let original = elem.innerText;
    elem.classList.add("handled");
    elem.innerHTML = await analyze(original);
}

async function analyze(sentence) {
    if (cache[sentence]) {
        return cache[sentence];
    }

    let body = {
        app_id: "4e43d4a80775580358fd808cc75442095521a25aa8a84b5718671db1b601d84d",
        sentence: sentence
    };
    let toSend = JSON.stringify(body);
    let response = await fetch("https://labs.goo.ne.jp/api/morph", {"method": "POST", "headers": { "Content-Type": "application/json" }, "body": toSend});
    if (response.status === 200) {
        let json = await response.json();

        let words = json.word_list.flat();

        let verbParts = [
            "動詞活用語尾",
            "動詞接尾辞"
        ];

        for (let i = 1; i < words.length; i++) {
            if (words[i - 1][1] == "動詞語幹" && verbParts.includes(words[i][1])) {
                words[i - 1][0] += words[i][0];
                words[i - 1][2] += words[i][2];
                words.splice(i, 1);
                i--;
            }
        }

        let result = await Promise.all(words.map(async word => {
            if (!hasKanji(word[0])) {
                return word[0];
            }

            let jishoResult = await makeRequest(word[0]);
            let jishoJson = JSON.parse(jishoResult.responseText);

            let jishoData = jishoJson.data;
            if (jishoData.length === 0) {
                return addFurigana(word);
            }

            let tags = jishoData[0].tags;

            if (tags.length == 0) {
                return addFurigana(word);
            }

            let wanikaniLevel = -1;
            for (let tag of tags) {
                if (tag.startsWith("wanikani")) {
                    wanikaniLevel = parseInt(tag.slice("wanikani".length));
                    break;
                }
            }

            if (wanikaniLevel === -1) {
                return addFurigana(word);
            }

            if (wanikaniLevel > userData.level) {
                return addFurigana(word);
            }

            let items = await wkof.ItemData.get_items(
                {
                    wk_items: {
                        options: {
                            assignments: true
                        },
                        filters: {
                            item_type: 'voc',
                            level: wanikaniLevel.toString()
                        }
                    }
                }
            );

            for (let item of items) {
                if (item.data.slug === jishoData.slug) {
                    if (item.assignments.unlocked_at === null) {
                        return addFurigana(word);
                    }
                    break;
                }
            }

            return word[0];
        }));

        result = result.join("");
        cache[sentence] = result;
        return result;
    } else {
        return sentence;
    }
}

function addFurigana(wordData) {
    let reading = katakanaToHiragana(wordData[2]);
    let original = wordData[0];
    let pre = "";
    let post = "";
    while (reading.length > 0 && original.slice(-1) === reading.slice(-1)) {
        post = reading.slice(-1) + post;
        reading = reading.slice(0, -1);
        original = original.slice(0, -1);
    }
    while (reading.length > 0 && original.slice(0, 1) === reading.slice(0, 1)) {
        pre += reading.slice(0, 1);
        reading = reading.slice(1);
        original = original.slice(1);
    }
    return `${pre}<ruby>${original}<rt>${reading}</rt></ruby>${post}`;
}

function katakanaToHiragana(word) {
    return [...word].map(c => {
        const katakana = "ァアィイゥウェエォオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂッツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモャヤュユョヨラリルレロヮワヰヱヲンヴヵヶ";
        const hiragana = "ぁあぃいぅうぇえぉおかがきぎくぐけげこごさざしじすずせぜそぞただちぢっつづてでとどなにぬねのはばぱひびぴふぶぷへべぺほぼぽまみむめもゃやゅゆょよらりるれろゎわゐゑをんゔゕゖ";

        let index = katakana.indexOf(c);
        return index == -1 ? c: hiragana.charAt(index);
    }).join("");
}

function hasKanji(word) {
    return word.match(/[\u4e00-\u9fbf]/g) !== null;
}

function makeRequest(keyword) {
    return new Promise(function (resolve, reject) {
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://jisho.org/api/v1/search/words?keyword=${keyword}`,
            onload: res => resolve(res),
            onerror: res => reject(res),
        });
    });
}