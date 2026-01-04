// ==UserScript==
// @name         NativShark: Kanji font styling for mobile
// @namespace    http://tampermonkey.net/
// @version      1.0.7
// @description  Changes the font sized and styling to fit on mobile
// @author       nesqi
// @include      https://*.nativshark.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521061/NativShark%3A%20Kanji%20font%20styling%20for%20mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/521061/NativShark%3A%20Kanji%20font%20styling%20for%20mobile.meta.js
// ==/UserScript==

;(function () {

    // Create a style to be injected on div elements
    var style = document.createElement('style');
    style.id = 'NesqiRubyStyling';
    style.innerHTML = `
        .nesqiFontStyle {
            --color-brand: #4182E5;
            font-weight: normal;
            font-family: "ヒラギノ角ゴ Pro W3", "Hiragino Kaku Gothic Pro", Osaka, "メイリオ", Meiryo, "ＭＳ Ｐゴシック", "MS PGothic", sans-serif;
        }
        .nesqiFontStyleColor {
            color: #4182E5;
            font-weight: normal;
            font-family: "ヒラギノ角ゴ Pro W3", "Hiragino Kaku Gothic Pro", Osaka, "メイリオ", Meiryo, "ＭＳ Ｐゴシック", "MS PGothic", sans-serif;
        }
        .nesqiFontStyleSize {
            --color-brand: #4182E5;
            font-weight: normal;
            font-family: "ヒラギノ角ゴ Pro W3", "Hiragino Kaku Gothic Pro", Osaka, "メイリオ", Meiryo, "ＭＳ Ｐゴシック", "MS PGothic", sans-serif;
            font-size: 25px;
        }
    `;
    document.getElementsByTagName('head')[0].append(style);

    function match(node) {
        // Simple match on class content.
        const substitutes = {
            'SentenceText' : 'nesqiFontStyle',
            'FlashcardSentence' : 'nesqiFontStyleSize',
            'LearningSentence' : 'nesqiFontStyle',
            'LearningTargetWord' : 'nesqiFontStyleColor',
        };
        for (const st in substitutes) {
            if (node.className.search(st) != -1) {
                return substitutes[st];
            }
        }
        // Special check for the attribute data-oct='focus-word'.
        if (node.getAttribute('data-oct') === 'focus-word') {
            return 'nesqiFontStyleColor';
        }
        return null;
    }

    function addStyleClass(node, styleName) {
        function recurse(node) {
            if (!(node instanceof HTMLElement)) {
                return;
            }
            if(node instanceof HTMLDivElement) {
                node.classList.add(styleName);
            }
            for(const n of node.childNodes) {
                recurse(n);
            }
            return;
        }
        recurse(node);
    }

    function patchSubtree(node) {
        if (!(node instanceof HTMLElement)) {
            return;
        }
        var style = match(node);
        if (style != null) {
            addStyleClass(node, style);
            return;
        }
        for(const n of node.childNodes) {
            patchSubtree(n);
        }
        return;
    }

    // Callback function to execute when mutations are observed
    const callback = (mutationList, observer) => {
        for (const mutation of mutationList) {
            if (mutation.type === "childList") {
                //console.log("A child node has been added or removed. ");
                for (const node of mutation.addedNodes) {
                    if (node instanceof Text) {
                        //console.log(node.data);
                    } else {
                        patchSubtree(node);
                    }
                }
            }
        }
    };

    // Select the node that will be observed for mutations
    const targetNode = document;

    // Options for the observer (which mutations to observe)
    const config = { attributes: false, childList: true, subtree: true };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);

})();