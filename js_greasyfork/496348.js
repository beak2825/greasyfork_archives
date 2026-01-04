// ==UserScript==
// @name         Translate Japanese Tweets
// @namespace    http://tampermonkey.net/
// @version      2025-02-02-2
// @description  Translates Japanese tweets automatically
// @author       You
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        GM.xmlHttpRequest
// @connect      translate.googleapis.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496348/Translate%20Japanese%20Tweets.user.js
// @updateURL https://update.greasyfork.org/scripts/496348/Translate%20Japanese%20Tweets.meta.js
// ==/UserScript==

const translationQueue = [];
const translatedElementSet = new Set();

const GOOGLE_API_REQUEST_INTERVAL = 300;
const DOM_QUERY_INTERVAL = 500;


function containsJapaneseCharacters(text) {
    const regex = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/;
    return text.match(regex) != null;
}

function translateTextGoogleTranslate(text, callback) {
    // Who doesn't love themselves a free API with no keys or nothing
    GM.xmlHttpRequest({
        method: "GET",
        url: `https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&sl=ja&tl=en&q=${encodeURIComponent(text)}`,
        headers: {
            "User-Agent": "Mozilla/5.0",
            "Accept": "text/xml"
        },
        onload: function(response) {
            callback(JSON.parse(response.responseText));
        }
    });
}

function translateElement(el) {
    // Get the text from Tweet
    let text = "";
    el.querySelectorAll("span:not([aria-hidden='true']), img").forEach(x => {
        if (x.tagName === "IMG") {
            text += x.getAttribute("alt");
        } else {
          let newText = x.textContent.trim();
          text += newText;
        }
    });

    if (!containsJapaneseCharacters(text)) {
        return;
    }

    // Twitter clamps tweets longer than 10 lines, which we can easily exceed
    // with translated tweets. So, bypass it
    el.style["-webkit-line-clamp"] = 1000;

    // Send to translation queue
    translationQueue.push({
        text: text,
        callback: res => {
            if (res === null || res[0] === null) {
                console.error("Whoops, just got ratelimited!");
                return;
            }

            let translation = "";
            // res[0] has items containing the translated lines
            res[0].forEach(x => translation += x[0]);

            // Split by new lines, or the lines that we purposefully added
            // I should probably use a newline character other than \n,
            // as I found it to be not that consistent throught some tweets
            let translationSplit = translation.split(/(\\n|\n|\\ n|\\ N)+/);
            translation = "";

            translationSplit.forEach(x => {
                x = x.trim();
                translation += `<span style="font-weight: bold">${x}</span><br />`
            });
            el.innerHTML += `<div style="padding: 0.5rem; margin-top: 0.5rem; border-left-style: solid !important; border-left: thick purple;">${translation}</div>`;
        }
    });
}

function tweetTranslateLoop() {
    const spanList = [...document.querySelectorAll("[data-testid='tweetText']")].reverse();

    for (const span of spanList) {
        if (translatedElementSet.has(span)) {
            continue;
        }
        translatedElementSet.add(span);
        translateElement(span);
    }
}

function tweetTranslateAPISendLoop() {
    const item = translationQueue.pop(0);
    if (!item) {
        return;
    }

    translateTextGoogleTranslate(item.text, item.callback);
}


setInterval(tweetTranslateLoop, DOM_QUERY_INTERVAL);

// Need this thing to avoid Google's ratelimiting
setInterval(tweetTranslateAPISendLoop, GOOGLE_API_REQUEST_INTERVAL);