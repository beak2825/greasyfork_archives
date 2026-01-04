// ==UserScript==
// @name         Cyrillic Transliterator (Ukrainian)
// @description  Transliterates Ukranian cyrillic characters to latin characters on any webpage (Czech version)
// @version      2.3
// @match        *://*/*
// @include      *
// @grant        none
// @author       w4t3r1ily
// @icon         https://opu.peklo.biz/p/23/05/13/1684010167-8264b.jpg
// @namespace https://greasyfork.org/users/905173
// @downloadURL https://update.greasyfork.org/scripts/467112/Cyrillic%20Transliterator%20%28Ukrainian%29.user.js
// @updateURL https://update.greasyfork.org/scripts/467112/Cyrillic%20Transliterator%20%28Ukrainian%29.meta.js
// ==/UserScript==

   (function() {

       //Custom rules
       var customMap = {
        '’Є': 'Je',
        '’є': 'je',
        "’Ї": "Ji",
        "’ї": "ji",
        '’Ю': 'Ju',
        '’ю': 'ju',
        '’Я': 'Ja',
        '’я': 'ja',

        "'Є": 'Je',
        "'є": "je",
        "'Ї": "Ji",
        "'ї": "ji",
        "'Ю": "Ju",
        "'ю": "ju",
        "'Я": "Ja",
        "'я": "ja",

    };

    // Custom rules for begining of words
var additionalCustomMap = {
     'Є': 'Je',
    'є': 'je',
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
         'Г': 'H',
         'г': 'h',
         'Ґ': 'G',
         'ґ': 'g',
         'Д': 'D',
         'д': 'd',
         'Е': 'E',
         'е': 'e',
         'Є': 'Ê',
         'є': 'ê',
         'Ж': 'Ž',
         'ж': 'ž',
         'З': 'Z',
         'з': 'z',
         'И': 'Y',
         'и': 'y',
         'І': 'I',
         'і': 'i',
         "Ї": "Ji",
         "ї": "ji",
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
         'Щ': 'Šč',
         'щ': 'šč',
         'Ю': 'Û',
         'ю': 'û',
         'Я': 'Â',
         'я': 'â',
         'Ь': 'ʹ',
         'ь': 'ʹ',
         '’': 'ʺ',
         "'": "ʺ",
    

       //Archaic symbols
        'Ё': 'Jo',
        'ё': 'jo',
        'Ъ': '″',
        'ъ': '″',
        'Ы': 'Y',
        'ы': 'y',
        'Ѣ': 'Ě',
        'ѣ': 'ě',
        'Э': 'È',
        'э': 'è',
        'Ѳ': 'F̀',
        'ѳ': 'f̀',
        'Ѵ': 'Ỳ',
        'ѵ': 'ỳ',
        'Ѧ': 'Ę',
        'ѧ': 'ę',


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
            button.innerHTML = 'Transliterate (ukr)';
               button.className = 'cyr-tr-button'; // Set the class name to "tr-cyr-button"
            button.style.position = 'fixed';
            button.style.bottom = '40px';
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