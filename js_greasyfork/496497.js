// ==UserScript==
// @name         jpdb.io with KanjiVG
// @description  Use KanjiVG images instead of jpdb.io ones
// @match        https://jpdb.io/*
// @license      MIT
// @grant        GM_xmlhttpRequest
// @version      0.0.6
// @namespace https://greasyfork.org/users/1309172
// @downloadURL https://update.greasyfork.org/scripts/496497/jpdbio%20with%20KanjiVG.user.js
// @updateURL https://update.greasyfork.org/scripts/496497/jpdbio%20with%20KanjiVG.meta.js
// ==/UserScript==

const log = console.log

function loadSvg() {
    if (!KanjiChar) {
        return;
    }
    if (NewSvg) {
        return;
    }

    const kanjiUnicodeHex = KanjiChar.charCodeAt(0).toString(16).toLowerCase().padStart(5, '0');
    const url = `https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/${kanjiUnicodeHex}.svg`;

    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: function (response) {
            if (response.status != 200) {
                console.log(`KanjiVG: ${xhr.status}: ${xhr.statusText}`);
                return;
            }

            const svg = response.responseXML.getElementsByTagName("svg")[0];
            svg.style.width = "300px";
            svg.style.height = "300px";

            const strokeNumbers = svg.getElementById(`kvg:StrokeNumbers_${kanjiUnicodeHex}`);
            strokeNumbers.style.fontSize = "6px";

            // if dark theme
            if (document.firstElementChild.classList.contains("dark-mode")) {
                svg.getElementById(`kvg:StrokePaths_${kanjiUnicodeHex}`).style.stroke = "#aaaaaa";
                strokeNumbers.style.fill = "#666666";
            }

            log("Loaded")
            NewSvg = svg;
            Replaced = replaceSvg();
        }
    });
}

function replaceSvg() {
    if (Replaced) {
        return true;
    }

    const kanjiElement = document.querySelector('a.kanji.plain');
    if (!kanjiElement) {
        return false;
    }

    if (!NewSvg) {
        return false;
    }

    kanjiElement.firstChild.replaceWith(NewSvg);
    log("Replaced")
    return true;
}

function getKanjiFromPage() {
    const uri = location.href.split("/")[3]

    if (uri === "review#a") {
        const cardType = document.querySelector("body > div.container.bugfix > div > div.review-hidden > div > div.kind");
        if (cardType && (cardType.textContent !== "Kanji" && cardType.textContent !== "Component")) {
            return null;
        }

        const linkWithKanji = document.querySelector("head > link[rel='prefetch']");
        if (!linkWithKanji) {
            return null;
        }
        return linkWithKanji.getAttribute("href")[15];
    }

    const kanjiElement = document.querySelector('a.kanji.plain');
    if (!kanjiElement) {
        return null;
    }
    return kanjiElement.getAttribute("href").split("/")[2][0];
}

const KanjiChar = getKanjiFromPage();
let NewSvg = null;
let Replaced = false;
loadSvg();

let observer = new MutationObserver(() => {
    if (Replaced) {
      observer.disconnect();
      return;
    }
    loadSvg();
    Replaced = replaceSvg();
});

observer.observe(document.body, {
     childList: true,
     subtree: true,
});
