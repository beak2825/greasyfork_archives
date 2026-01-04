// ==UserScript==
// @name         Skribbl AutoGuesser
// @name:zh-CN   Skribbl 自动猜词器
// @name:zh-TW   Skribbl 自動猜詞器
// @name:hi      Skribbl स्वतः अनुमान स्क्रिप्ट
// @name:es      Skribbl Adivinador Automático
// @namespace    http://tampermonkey.net/
// @version      1.15
// @description  Automatically suggests guesses in Skribbl.io. Fast, easy, and effective.
// @description:zh-CN 自动在 Skribbl.io 中猜词，快速、简单、有效。
// @description:zh-TW 自動在 Skribbl.io 中猜詞，快速、簡單、有效。
// @description:hi Skribbl.io में शब्दों का अनुमान लगाने वाली तेज़ और आसान स्क्रिप्ट।
// @description:es Adivina palabras automáticamente en Skribbl.io de forma rápida y sencilla.
// @author       Zach Kosove
// @supportURL   https://github.com/zkisaboss/reorderedwordlist
// @match        https://skribbl.io/*
// @icon         https://skribbl.io/favicon.png
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @compatible   chrome
// @compatible   firefox
// @compatible   opera
// @compatible   safari
// @compatible   edge
// @downloadURL https://update.greasyfork.org/scripts/503563/Skribbl%20AutoGuesser.user.js
// @updateURL https://update.greasyfork.org/scripts/503563/Skribbl%20AutoGuesser.meta.js
// ==/UserScript==

(function() {
"use strict";

const autoGuessLastWord = true;


function createUI() {
    document.body.insertAdjacentHTML('beforeend', `
        <div id="bottom-ui">
            <div id="settings-shelf" class="section">
                <button id="remaining-guesses" class="ui-btn">Remaining Guesses: 0</button>
                <button id="auto-guess" class="ui-btn">Auto Guess: OFF</button>
                <button id="export-answers" class="ui-btn">Export Answers</button>
                <button id="get-special" class="ui-btn ui-btn-secondary">Secret</button>
            </div>
            <div id="guess-shelf" class="section"></div>
            <style>
                #bottom-ui {
                    position: fixed;
                    bottom: 0;
                    width: 100%;
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(200, 200, 255, 0.15));
                    backdrop-filter: blur(30px) saturate(180%);
                    border-top-left-radius: 24px;
                    border-top-right-radius: 24px;
                    box-shadow: 0 -12px 30px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.5);
                    flex-direction: column;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                    transition: transform 0.15s cubic-bezier(0.4, 0, 1, 1);
                }
                .hidden { transform: translateY(100%); transition: transform 0.15s; }
                .section { display: flex; gap: 12px; padding: 14px 24px; overflow-x: auto; }
                .ui-btn {
                    flex: 0 0 auto;
                    font-size: 15px;
                    font-weight: 500;
                    padding: 10px 18px;
                    border: 0.5px solid rgba(255, 255, 255, 0.25);
                    border-radius: 14px;
                    background: linear-gradient(135deg, rgba(120, 120, 255, 0.5), rgba(100, 100, 230, 0.35));
                    color: #ffffff;
                    cursor: pointer;
                    box-shadow: 0 0 10px rgba(120, 120, 255, 0.5);
                    transition: background 0.3s, transform 0.2s, box-shadow 0.3s;
                }
                .ui-btn:hover { background: linear-gradient(135deg, rgba(140, 140, 255, 0.7), rgba(120, 120, 255, 0.6)); }
                .ui-btn:active { transform: scale(0.97); }
                .ui-btn-secondary { background: linear-gradient(135deg, rgba(255, 120, 255, 0.5), rgba(200, 100, 230, 0.35)); }
                .ui-btn-secondary:hover { background: linear-gradient(135deg, rgba(255, 140, 255, 0.7), rgba(220, 120, 240, 0.6)); }
            </style>
        </div>
    `);

    const ui = document.getElementById("bottom-ui");
    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowDown") ui.classList.add("hidden");
        if (e.key === "ArrowUp") ui.classList.remove("hidden");
    });

}

createUI();


const correctAnswers = GM_getValue("correctAnswers", []);

async function fetchWords(url) {
    const response = await fetch(url);
    if (!response.ok) return [];

    const text = await response.text();
    return text.split('\n').filter(word => word !== '');
}

async function fetchAndStoreLatestWordlist() {
    const words = await fetchWords("https://raw.githubusercontent.com/zkisaboss/reorderedwordlist/main/wordlist_test.txt");

    const correctSet = new Set(correctAnswers);

    words.forEach(word => {
        if (!correctSet.has(word)) correctAnswers.push(word);
    });

    GM_setValue("correctAnswers", correctAnswers);
}

fetchAndStoreLatestWordlist();


let myUsername = '';

function findUsername() {
    const target = document.querySelector(".players-list");
    if (!target) return;

    const observer = new MutationObserver(() => {
        myUsername = document.querySelector(".me").textContent.replace(" (You)", '')
        observer.disconnect();
    });

    observer.observe(target, { childList: true });
}

findUsername();


function observeDrawingTurn() {
    const target = document.querySelector(".words");
    if (!target) return;

    const observer = new MutationObserver(() => {
        target.childNodes.forEach(word => {
            const text = word.textContent.toLowerCase();

            if (!correctAnswers.includes(text)) {
                correctAnswers.push(text);
                GM_setValue("correctAnswers", correctAnswers);
            }
        });
    });

    observer.observe(target, { childList: true });
}

observeDrawingTurn();


const remainingButton = document.getElementById("remaining-guesses");

const guessShelf = document.getElementById("guess-shelf");

let possibleWords = [];

const input = document.querySelector('#game-chat input[data-translate="placeholder"]');

function renderGuesses(words) {
    guessShelf.innerHTML = '';
    remainingButton.textContent = `Remaining Guesses: ${possibleWords.length}`;

    words.forEach(word => {
        const button = Object.assign(document.createElement("button"), {
            className: "ui-btn",
            textContent: word,
            onclick: () => {
                input.value = word;
                input.closest("form").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
            }
        });
        guessShelf.appendChild(button);
    });
};

function generateGuesses() {
    if (possibleWords.length === 1 && autoGuessLastWord) {
        input.value = possibleWords.shift();
        input.closest("form").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    }
    const pattern = input.value.toLowerCase().trim();
    const words = possibleWords.filter(word => word.startsWith(pattern));
    renderGuesses(words);
}

function observeInput() {
    input.addEventListener("input", generateGuesses);

    input.addEventListener("keydown", ({ key }) => {
        if (key === "Enter") {
            input.value = guessShelf.firstElementChild?.innerText ?? input.value;
            input.closest("form").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
        }
    });
}

observeInput();


function storeAnswer(word) {
    word = word.toLowerCase();

    const i = correctAnswers.indexOf(word);
    if (i < 0) {
        correctAnswers.push(word);
    } else {
        const j = (i - 1) & ~((i - 1) >> 31); // same as (i == 0 ? i : i - 1) but cooler
        const tmp = correctAnswers[i];
        correctAnswers[i] = correctAnswers[j];
        correctAnswers[j] = tmp;
    }

    GM_setValue("correctAnswers", correctAnswers);
    return [];
}

function filterHints(inputWords) {
    const hints = Array.from(document.querySelectorAll(".hints .hint"));
    const combined = hints.map(hint => hint.textContent === '_' ? "[a-z]" : hint.textContent).join('');

    if (hints.every(hint => hint.classList.contains("uncover"))) {
        return storeAnswer(combined);
    }

    const regex = new RegExp(`^${combined}$`, 'i');
    return inputWords.filter(word => regex.test(word));
}

function observeHints() {
    const target = document.querySelector(".hints .container");
    if (!target) return;

    const observer = new MutationObserver(() => {
        possibleWords = filterHints(possibleWords);
        generateGuesses();
    });

    observer.observe(target, { childList: true, subtree: true });
}

observeHints();


//  Levenshtein: O(n⋅m) time, O(n⋅m) space
//  https://youtu.be/Dd_NgYVOdLk
/*
function levenshteinDistance(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            matrix[i][j] = Math.min(
                matrix[i - 1][j]     + 1,
                matrix[i][j - 1]     + 1,
                matrix[i - 1][j - 1] + (b[i - 1] !== a[j - 1])
            );
        }
    }
    return matrix[b.length][a.length];
}
*/

//  Banded Levenshtein: O(n⋅min(m,2k+1)) time, O(m) space
//  https://www.baeldung.com/cs/levenshtein-distance-computation
function levenshteinDistance(a, b, k = 1) {
    // Ensure |a| ≤ |b| ⇒ reduce memory via symmetry of d(a,b)
    if (a.length > b.length) {
        let tmp = a;
        a = b;
        b = tmp;
    }
    let m = a.length; // |a|
    let n = b.length; // |b|

    // If |n − m| > k ⇒ d(a,b) > k (impossible within band)
    if (n - m > k) return -1;

    // === Prefix/Suffix Trimming ===
    let start = 0;
    while (start < m && a[start] === b[start]) ++start;
    let endA = m - 1, endB = n - 1;
    while (endA >= start && a[endA] == b[endB]) --endA, --endB;
    m = endA - start + 1;
    n = endB - start + 1;

    // If m′ = 0 ⇒ d(a,b) = n′  (if ≤ k [implicit])
    if (m === 0) return n;

    // === Initialization ===
    // const D0 = new Uint8Array(m + 1);
    // for (let j = 0; j <= m; j++) D0[j] = j;
    // const D = [D0, new Uint8Array(m + 1)];
    // === Allocate one contiguous block ===
    const buf = new Uint8Array((m + 1) * 2);
    // === Fixed-row views (no dynamic array object overhead) ===
    const D0 = buf.subarray(0, m + 1);
    for (let j = 0; j <= m; j++) D0[j] = j; // base insert cost
    const D1 = buf.subarray(m + 1, (m + 1) * 2);

    // === Dynamic Programming ===
    let curr, prev;
    for (let i = 1; i <= n; i++) {
        if (i & 1) { curr = D1; prev = D0; }
        else       { curr = D0; prev = D1; }

        // Band bounds ⇒ j ∈ [i−k, i+k] (clamped to [1,m] for valid indexing)
        let lo = i - k; if (lo < 1) lo = 1;
        let hi = i + k; if (hi > m) hi = m;

        // Left boundary ⇒ D(i, lo−1) = i (cost of deleting i chars)
        curr[lo - 1] = i;

        let rowMin = k + 1;
        const bᵢ = b[start + i - 1];
        for (let j = lo; j <= hi; j++) {
            const aⱼ = a[start + j - 1];
            const cost = (aⱼ == bᵢ) ? 0 : 1;
            const val = Math.min(
                curr[j - 1] + 1,   // insertion
                prev[j]     + 1,   // deletion
                prev[j - 1] + cost // substitution
            );
            curr[j] = val;
            if (val < rowMin) rowMin = val;
        }

        if (rowMin > k) return -1;
    }

    const distance = ((n & 1) ? D1 : D0)[m];
    if (distance > k) return -1;
    return distance;
}

let previousWords = [];

function handleChatMessage(messageNode) {
    const messageColor = window.getComputedStyle(messageNode).color;
    const message = messageNode.textContent;

    if (messageColor === "rgb(57, 117, 206)" && message.endsWith("is drawing now!")) {
        possibleWords = filterHints(correctAnswers);
    }

    else if (message.includes(": ")) {
        const [username, guess] = message.split(": ");
        possibleWords = possibleWords.filter(word => word !== guess);
        previousWords = possibleWords;

        if (username === myUsername) {
            possibleWords = possibleWords.filter(word => levenshteinDistance(word, guess) === -1);
        }
    }

    else if (messageColor === "rgb(226, 203, 0)" && message.endsWith("is close!")) {
        const closeWord = message.replace(" is close!", '');
        possibleWords = previousWords.filter(word => levenshteinDistance(word, closeWord) === 1);
    }

    else return;

    generateGuesses();
}

function observeChat() {
    const target = document.querySelector(".chat-content");
    if (!target) return;

    const observer = new MutationObserver(() => {
        handleChatMessage(target.lastElementChild);
    });

    observer.observe(target, { childList: true });
}

observeChat();


let autoGuessInterval;

let autoGuessing = false;

function startAutoGuessing() {
    if (!autoGuessing) return;

    autoGuessInterval = setInterval(() => {
        if (possibleWords.length > 0) {
            input.value = possibleWords.shift();
            input.closest("form").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
        }
    }, 3500);
}

startAutoGuessing();


const autoGuessButton = document.getElementById("auto-guess");

function toggleAutoGuessing() {
    autoGuessing = !autoGuessing;
    autoGuessButton.innerHTML = `Auto Guess: ${autoGuessing ? "ON" : "OFF"}`;

    if (autoGuessing) {
        startAutoGuessing();
    } else {
        clearInterval(autoGuessInterval);
        autoGuessInterval = null;
    }
}

autoGuessButton.addEventListener("click", toggleAutoGuessing);


async function exportNewWords() {
    const old = await fetchWords("https://raw.githubusercontent.com/zkisaboss/reorderedwordlist/main/wordlist.txt");
    const data = correctAnswers.filter(word => !old.includes(word));

    const anchor = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob([data.join('\n').trim()], { type: "text/plain" })),
      download: "newWords.txt"
    });

    document.body.appendChild(anchor);

    anchor.click();
    anchor.remove();
}

const exportButton = document.getElementById("export-answers");

exportButton.addEventListener("click", exportNewWords);


const secretButton = document.getElementById("get-special");

function runSecret() {
    const avatars = document.querySelectorAll(".avatar-container .avatar");

    const interval = setInterval(() => {
        let allSecretsVisible = true;

        avatars.forEach(avatar => {
            const secret = avatar.querySelector(".special");

            if (getComputedStyle(secret).display === "none") {
                avatar.click();
                allSecretsVisible = false;
            }
        });

        if (allSecretsVisible) clearInterval(interval);
    }, 15);
}

secretButton.addEventListener("click", runSecret);


function observeSecret() {
    const target = document.getElementById("home");
    if (!target) return;

    const observer = new MutationObserver(() => {
        secretButton.style.display = target.hasAttribute("style") ? "none" : "inline-block";
    });

    observer.observe(target, { attributes: true, attributeFilter: ["style"] });
}

observeSecret();
})();