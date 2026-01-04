// ==UserScript==
// @name         DartCounter Calculator
// @namespace    http://dartcounter.net/
// @author       mrdarts180
// @version      3.0
// @license      MIT
// @description  Support maths for DartCounter score entry.
// @match        http*://app.dartcounter.net/*
// @icon         https://dartcounter.net/favicon-32x32.png
// @require      https://unpkg.com/mathjs/lib/browser/math.js
// @downloadURL https://update.greasyfork.org/scripts/486713/DartCounter%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/486713/DartCounter%20Calculator.meta.js
// ==/UserScript==

(function() {
    var observer = new MutationObserver(function(mutations) {
        var score = document.getElementsByClassName("in-game-score-field")[0];
        if (score && score.getAttribute('mutated') == null) {
            score.type = 'text';
            score.disabled = false;
            score.setAttribute('autocomplete', 'off');
            score.setAttribute('mutated', '1');
            score.removeAttribute('maxlength');
            score.removeAttribute('inputmode');

            let inputHandler = (event) => {
                event.stopPropagation();
            };
            score.addEventListener('input', inputHandler, true);

            let keydownHandler = (event) => {
                if (event.keyCode == 13) {
                    let evalScore = (str) => {
                        try {
                            return math.evaluate(str);
                        } catch(ex) {
                            return 0;
                        }
                    };

                    if (score.value && score.value.length > 0) {
                        // Evaluate value
                        score.value = evalScore(score.value);

                        // Set value
                        score.removeEventListener('input', inputHandler, true);
                        score.dispatchEvent(
                            new Event("input", { bubbles: true, cancelable: true })
                        );
                        score.addEventListener('input', inputHandler, true);

                        event.stopPropagation();

                        // Resubmit value
                        score.removeEventListener('keydown', keydownHandler, true);
                        score.dispatchEvent(
                            new KeyboardEvent('keydown', {'key': 'Enter', 'keyCode': 13})
                        );
                        score.addEventListener('keydown', keydownHandler, true);

                        return false;
                   }
                }
                // Remaping +/- keys
                else if (event.keyCode == 187 || event.keyCode == 189) {
                    score.value += event.keyCode == 187 ? "+" : "*";
                    event.cancelBubble = true;
                    event.preventDefault();
                }
                event.stopPropagation();
            };
            score.addEventListener('keydown', keydownHandler, true);
        }
    });
    observer.observe(document, {attributes: false, childList: true, characterData: false, subtree:true});

})();