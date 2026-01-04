// ==UserScript==
// @name            translate to/from Jaron's alphabet
// @namespace       http://jaronsteele.com/
// @description     Highlight the text you want to translate and then right click it and select tampermonkey
// @version         0.1
// @author          Toxin_X
// @include         *
// @grant           none
// @run-at          context-menu
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521181/translate%20tofrom%20Jaron%27s%20alphabet.user.js
// @updateURL https://update.greasyfork.org/scripts/521181/translate%20tofrom%20Jaron%27s%20alphabet.meta.js
// ==/UserScript==





(function() {
    const alphabet = {
            'A': 'ᝀ', 'B': 'ᮘ', 'C': '𒑛', 'D': 'Δ', 'E': '⟡', 'F': 'ʃ',
            'G': 'Ӷ', 'H': '𐋣', 'I': '𓄠', 'J': 'ᛡ', 'K': 'ᛯ', 'L': '𓏶',
            'M': 'ꤻ', 'N': '⎍', 'O': '⧉', 'P': 'Ӌ', 'Q': '𖭦', 'R': '𓂇',
            'S': 'ꥁ', 'T': '⋉', 'U': 'ᝎ', 'V': '⋌', 'W': 'ᝆ', 'X': '𖭿',
            'Y': 'ᝉ', 'Z': '𒓻',
            '!': '𓋎', '?': '꛷',
            '0': '႐', '1': '𐪊', '2': '߂', '3': '᮳', '4': '𞣊', '5': '᮵',
            '6': '߆', '7': '𐄍', '8': '୮', '9': '୯'
        };

        const reverseAlphabet = Object.fromEntries(
            Object.entries(alphabet).map(([key, value]) => [value, key])
        );

        const englishText = document.getElementById('englishText');
        const customText = document.getElementById('customText');

        function translateToCustom(text) {
            return Array.from(text).map(char => {
                const upperChar = char.toUpperCase();
                return alphabet[upperChar] || char;
            }).join('');
        }

        function translateToEnglish(text) {
            return Array.from(text).map(char => reverseAlphabet[char] || char).join('');
        };
    var msg = "English: " + translateToEnglish(window.getSelection().toString()) + "\nJaron:" + translateToCustom(window.getSelection().toString());
    alert(msg);
})();

