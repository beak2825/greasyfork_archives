// ==UserScript==
// @name         Cyrillic Transliterator (Russian)
// @description  Transliterates Russian cyrillic characters to latin characters on any webpage (Czech version).
// @version      2.3
// @author       w4t3r1ily
// @match        *://*/*
// @include      *
// @grant        none
// @icon         https://opu.peklo.biz/p/23/05/13/1684010167-8264b.jpg
// @namespace    https://greasyfork.org/users/905173
// @downloadURL https://update.greasyfork.org/scripts/467111/Cyrillic%20Transliterator%20%28Russian%29.user.js
// @updateURL https://update.greasyfork.org/scripts/467111/Cyrillic%20Transliterator%20%28Russian%29.meta.js
// ==/UserScript==

(function() {

       //Custom rules
       var customMap = {
        'ЪЕ': 'Je',
        'ъе': 'je',
        'ЪЁ': 'Jo',
        'ъё': 'jo',
        'ЪЮ': 'Ju',
        'ъю': 'ju',
        'ЪЯ': 'Ja',
        'ъя': 'ja',

     };

    // Custom rules for begining of words
var additionalCustomMap = {
    'Е': 'Je',
    'е': 'je',
    'Ё': 'Jo',
    'ё': 'jo',
    'Ю': 'Ju',
    'ю': 'ju',
    'Я': 'Ja',
    'я': 'ja',
};


        //Normal transliteration
        var map = {
        'A': 'A',
        'a': 'a',
        'Б': 'B',
        'б': 'b',
        'В': 'V',
        'в': 'v',
        'Г': 'G',
        'г': 'g',
        'Д': 'D',
        'д': 'd',
        'Е': 'E',
        'е': 'e',
        'Ё': 'Ë',
        'ё': 'ë',
        'Ж': 'Ž',
        'ж': 'ž',
        'З': 'Z',
        'з': 'z',
        'И': 'I',
        'и': 'i',
        'Й': 'J',
        'й': 'j',
        'К': 'K',
        'к': 'k',
        'Л': 'L',
        'л': 'l',
        'М': 'M',
        'м': 'm',
        'Н': 'N',
        'н': 'n',
        'О': 'O',
        'о': 'o',
        'П': 'P',
        'п': 'p',
        'Р': 'R',
        'р': 'r',
        'С': 'S',
        'с': 's',
        'Т': 'T',
        'т': 't',
        'У': 'U',
        'у': 'u',
        'Ф': 'F',
        'ф': 'f',
        'Х': 'Ch',
        'х': 'ch',
        'Ц': 'C',
        'ц': 'c',
        'Ч': 'Č',
        'ч': 'č',
        'Ш': 'Š',
        'ш': 'š',
        'Щ': 'Ŝ',
        'щ': 'ŝ',
        'Ъ': 'ʺ',
        'ъ': 'ʺ',
        'Ы': 'Y',
        'ы': 'y',
        'Ь': 'ʹ',
        'ь': 'ʹ',
        'Я': 'Â',
        'я': 'â',
        'Э': 'È',
        'э': 'è',
        'Ю': 'Û',
        'ю': 'û',

       //Archaic symbols
        'І':'Ì',
        'і':'ì',
        'Ѣ':'Ě',
        'ѣ':'ě',
        'Ѳ':'F̀',
        'ѳ':'f̀',
        'Ѵ':'Ỳ',
        'ѵ':'ỳ',
    };



// Merge the customMap, additionalCustomMap, and map objects
map = Object.assign({}, customMap, additionalCustomMap, map);

function replaceText(node) {
    var value = node.nodeValue;
    var newValue = '';
    var i = 0;

    while (i < value.length) {
        var char = value.charAt(i);
        var nextChar = value.charAt(i + 1);
        var combined = char + nextChar;

        // Check if the current character is a space or a punctuation mark
        var isBeginning = i === 0 || value.charAt(i - 1).match(/\s|[^\p{L}\p{N}]/u);

        if (isBeginning && (combined in additionalCustomMap)) {
            newValue += additionalCustomMap[combined];
            i += 2;
        } else if (isBeginning && (char in additionalCustomMap)) {
            newValue += additionalCustomMap[char];
            i++;
        } else if (combined in map) {
            newValue += map[combined];
            i += 2;
        } else if (char in map) {
            newValue += map[char];
            i++;
        } else {
            newValue += char;
            i++;
        }
    }

    node.nodeValue = newValue;
}









        function replaceCyrillic() {
            var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
            var node;
            while (node = walker.nextNode()) {
                replaceText(node);
            }
        }

        function createToggleButton() {
            var button = document.createElement('button');
            button.innerHTML = 'Transliterate (rus)';
               button.className = 'cyr-tr-button'; // Set the class name to "tr-cyr-button"
            button.style.position = 'fixed';
            button.style.bottom = '20px';
            button.style.right = '20px';
            button.onclick = toggleTransliteration;
            document.body.appendChild(button);
        }

        function toggleTransliteration() {
            isTransliterationEnabled = !isTransliterationEnabled;
            if (isTransliterationEnabled) {
                replaceCyrillic();
            } else {
                location.reload();
            }
        }

        var isTransliterationEnabled = false;
        var cyrillicRegex = /[\u0400-\u04FF]/;

        if (cyrillicRegex.test(document.body.innerHTML)) {
            createToggleButton();
        }
    })();