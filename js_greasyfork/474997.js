// ==UserScript==
// @name         WaniKani to Anki
// @namespace    http://tampermonkey.net/
// @version      4.5
// @description  Build an easy to copy summary to copy vocabulary direclty from WaniKani to Anki
// @author       vbomedeiros
// @match        https://www.wanikani.com/vocabulary/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wanikani.com
// @grant        none
// @license      MIT
// @require     https://greasyfork.org/scripts/430565-wanikani-item-info-injector/code/WaniKani%20Item%20Info%20Injector.user.js?version=1326536

// @downloadURL https://update.greasyfork.org/scripts/474997/WaniKani%20to%20Anki.user.js
// @updateURL https://update.greasyfork.org/scripts/474997/WaniKani%20to%20Anki.meta.js
// ==/UserScript==

;(function() {
    //'use strict';

    addWanikaniToAnkiSection();

    function addWanikaniToAnkiSection() {
        console.log('WaniKani to Anki: notified!');
        const section = loadWanikaniToAnkiSection();
        const pagenav = document.querySelector(".page-nav");

        if (!pagenav) {
            console.log('WaniKani to Anki: no page nav');
            throw "Could not find pagenav";
        }
        console.log('WaniKani to Anki: rendering');
        pagenav.insertAdjacentElement("afterend", section);
    }

    function loadWanikaniToAnkiSection() {
        const section = document.createElement("section");
        section.classList.add("subject-section");

        const ankiTitle = document.createElement("h2");
        ankiTitle.classList.add("subject-section__title");
        ankiTitle.textContent = "For anki import: ";
        section.insertAdjacentElement("beforeend", ankiTitle);

        const copyToClipboardContent = document.createElement("section");
        copyToClipboardContent.classList.add("subject-section__subsection");
        section.insertAdjacentElement("beforeend", copyToClipboardContent);

        const copyToClipboard = document.createElement("button");
        copyToClipboard.textContent = "Copy to clipboard";

        copyToClipboard.onclick = function() {
            // console.log("Called");

            if (window.getSelection) {
                if (window.getSelection().empty) { // Chrome
                    window.getSelection().empty();
                } else if (window.getSelection().removeAllRanges) { // Firefox
                    window.getSelection().removeAllRanges();
                }
            } else if (document.selection) { // IE?
                document.selection.empty();
            }

            if (document.selection) {
                let range = document.body.createTextRange();
                range.moveToElementText(document.getElementById("ankiImportSection"));
                range.select().createTextRange();
                document.execCommand("copy");
            } else if (window.getSelection) {
                let range = document.createRange();
                range.selectNode(document.getElementById("ankiImportSection"));
                window.getSelection().addRange(range);
                document.execCommand("copy");
            }
        }
        copyToClipboardContent.insertAdjacentElement("beforeend", copyToClipboard);


        const ankiContent = document.createElement("section");
        ankiContent.classList.add("subject-section__subsection");
        ankiContent.id = "ankiImportSection";
        section.insertAdjacentElement("beforeend", ankiContent);

        function cloneElements(elementsToCopy, initialString) {
            const firstElement = elementsToCopy[0].cloneNode(true);
            if (initialString) {
                firstElement.insertAdjacentText("afterbegin", initialString);
            }
            ankiContent.insertAdjacentElement("beforeend", firstElement);

            for (let i = 1; i < elementsToCopy.length; i++) {
                ankiContent.insertAdjacentElement("beforeend", elementsToCopy[i].cloneNode(true));
            }
        }

        const vocabulary = document.querySelector(".page-header__prefix .subject-character__characters-text").textContent;
        const vocabularyMeaning = document.querySelector(".page-header__title-text").textContent;
        const vocabularyReading = "、" + document.querySelector(".reading-with-audio__reading").textContent;

        const meaningSections = document.querySelectorAll(".subject-section__meanings");

        let vocabularyType = "";
        let vocabularyAlternatives = "";
        for (let i = 0; i < meaningSections.length; i++) {
            const meaningTitle = meaningSections[i].querySelector(".subject-section__meanings-title").textContent;
            if (meaningTitle == "Word Type") {
                vocabularyType = "、" + meaningSections[i].querySelector(".subject-section__meanings-items").textContent
                vocabularyType = vocabularyType.replace(/, /g, "、");
                vocabularyType = vocabularyType.replace(/godan verb/g, "五段");
                vocabularyType = vocabularyType.replace(/ichidan verb/g, "一段");
                vocabularyType = vocabularyType.replace(/、intransitive verb/g, "、自動史");
                vocabularyType = vocabularyType.replace(/、transitive verb/g, "、他動詞");
            }
            if (meaningTitle == "Alternatives" || meaningTitle == "Alternative") {
                vocabularyAlternatives = ", " + meaningSections[i].querySelector(".subject-section__meanings-items").textContent;
            }
        }

        const vocabularyLevel = "、" + document.querySelector(".subject-page-header__level").textContent;

        cloneElements(
            document.querySelectorAll(
                ".subject-section--meaning .subject-section__subsection p.subject-section__text"
            ),
            vocabulary + "（" + vocabularyMeaning + vocabularyAlternatives + vocabularyReading + vocabularyType + vocabularyLevel + "）："
        )

        ankiContent.insertAdjacentElement("beforeend", document.createElement("br"));
        cloneElements(
            document.querySelectorAll(
                ".subject-section--reading .subject-section__subsection p.subject-section__text"
            )
        );

        const kanjis = document.querySelectorAll(
            "#section-components a.subject-character--kanji"
        );

        function cloneHint(hintText) {
            if (hintText) {
                ankiContent.insertAdjacentElement("beforeend", document.createElement("br"));
                const hintParagraph = document.createElement("p");
                hintParagraph.classList.add("subject-section__text");
                hintParagraph.textContent = "Hint: " + hintText.textContent;
                ankiContent.insertAdjacentElement("beforeend", hintParagraph);
            }
        }

        for (let i = 0; i < kanjis.length; i++) {
            const kanjiLink = kanjis[i];
            // console.log(kanjiLink.href);

            let kanjiIFrame = document.createElement("iframe");
            kanjiIFrame.src = kanjiLink.href;
            document.querySelector(".site-content-container").insertAdjacentElement("afterend", kanjiIFrame);

            setTimeout(function(kIframe){
                ankiContent.insertAdjacentElement("beforeend", document.createElement("br"));

                const meaningSections = kIframe.contentWindow.document.querySelectorAll(".subject-section__meanings");
                let kanjiMeaningAlternatives = "";
                for (let i = 0; i < meaningSections.length; i++) {
                    const meaningTitle = meaningSections[i].querySelector(".subject-section__meanings-title").textContent;
                    if (meaningTitle == "Alternatives" || meaningTitle == "Alternative") {
                        kanjiMeaningAlternatives = ", " + meaningSections[i].querySelector(".subject-section__meanings-items").textContent;
                    }
                }

                cloneElements(
                    kIframe.contentWindow.document.querySelectorAll(
                        ".subject-section--meaning .subject-section__subsection p.subject-section__text"
                    ),
                    kIframe.contentWindow.document.querySelector(".page-header__prefix .subject-character__characters-text").textContent
                    + "（"
                    + kIframe.contentWindow.document.querySelector(".page-header__title-text").textContent
                    + kanjiMeaningAlternatives
                    + "、"
                    + kIframe.contentWindow.document.querySelector(".subject-page-header__level").textContent
                    + "）："
                );

                cloneHint(kIframe.contentWindow.document.querySelector(
                    ".subject-section--meaning .subject-hint__text"
                ));

                ankiContent.insertAdjacentElement("beforeend", document.createElement("br"));
                cloneElements(
                    kIframe.contentWindow.document.querySelectorAll(
                        ".subject-section--reading .subject-section__subsection p.subject-section__text"
                    )
                );

                cloneHint(kIframe.contentWindow.document.querySelector(
                    ".subject-section--reading .subject-hint__text"
                ));

                // Inline all the styles:
                const marks = ankiContent.querySelectorAll('mark');

                marks.forEach(mark => {
                    const title = mark.getAttribute('title');
                    const span = document.createElement('span');

                    switch (title) {
                        case 'Vocabulary':
                            span.style.color = '#fff';
                            span.style.backgroundColor = '#aa00ff';
                            break;
                        case 'Kanji':
                            span.style.color = '#fff';
                            span.style.backgroundColor = '#ff00aa';
                            break;
                        case 'Radical':
                            span.style.color = '#fff';
                            span.style.backgroundColor = '#00aaff';
                            break;
                        case 'Reading':
                            span.style.color = '#fff';
                            span.style.backgroundColor = '#555555';
                            break;
                        default:
                            break;
                    }

                    span.innerHTML = mark.innerHTML;
                    mark.parentNode.replaceChild(span, mark);
                });

            },1000 + 1000*i, kanjiIFrame);
        }
        return section;
    }

})();