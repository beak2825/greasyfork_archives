// ==UserScript==
// @name         Cyrillic Transliterator (PI)
// @description  Transliterates Cyrillic characters to Latin characters on any webpage.
// @author       w4t3r1ily
// @version      1.6
// @match        *://*/*
// @include      *
// @grant        none
// @icon         https://opu.peklo.biz/p/23/05/13/1684010167-8264b.jpg
// @namespace    https://greasyfork.org/users/905173
// @downloadURL https://update.greasyfork.org/scripts/466840/Cyrillic%20Transliterator%20%28PI%29.user.js
// @updateURL https://update.greasyfork.org/scripts/466840/Cyrillic%20Transliterator%20%28PI%29.meta.js
// ==/UserScript==

(function() {
    var map = {
'А': 'A',
'а': 'a',
'Б': 'B',
'б': 'b',
'В': 'V',
'в': 'v',
'Г': 'G',
'г': 'ġ',
'Ґ': 'Ġ',
'ґ': 'g̀',
'Д': 'D',
'д': 'd',
'Ѓ': 'Ǵ',
'ѓ': 'ǵ',
'Ђ': 'Ď',
'ђ': 'ď',
'Е': 'E',
'е': 'e',
'Ё': 'Ë',
'ё': 'ë',
'Є': 'Je',
'є': 'je',
'Ж': 'Ž',
'ж': 'ž',
'З': 'Z',
'з': 'z',
'Ѕ': 'Dz',
'ѕ': 'dz',
'И': 'I',
'и': 'i',
'І': 'Ī',
'і': 'ī',
'Ї': 'Ji',
'ї': 'ji',
'Й': 'J',
'й': 'j',
'Ј': 'J',
'ј': 'j',
'К': 'K',
'к': 'k',
'Л': 'L',
'л': 'l',
'Љ': 'Ľ',
'љ': 'ľ',
'М': 'M',
'м': 'm',
'Н': 'N',
'н': 'n',
'Њ': 'Ń',
'њ': 'ń',
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
'Ќ': 'Ḱ',
'ќ': 'ḱ',
'Ћ': 'Ć',
'ћ': 'ć',
'У': 'U',
'у': 'u',
'Ў': 'W',
'ў': 'w',
'Ф': 'F',
'ф': 'f',
'Х': 'Ch',
'х': 'ch',
'Ц': 'C',
'ц': 'c',
'Ч': 'Č',
'ч': 'č',
'Џ': 'Ǵ',
'џ': 'ǵ',
'Ш': 'Š',
'ш': 'š',
'Щ': 'Šč',
'щ': 'šč',
'Ъ': '-',
'ъ': '-',
'Ы': 'Y',
'ы': 'y',
'Ь': 'ʹ',
'ь': 'ʹ',
'Ѣ': 'Ě',
'ѣ': 'ě',
'Э': 'È',
'э': 'è',
'Ю': 'Ju',
'ю': 'ju',
'Я': 'Ja',
'я': 'ja',
"'": '-',
'Ѫ': 'Ǎ',
'ѫ': 'ǎ',
'Ѳ': 'ḟ',
'ѳ': 'ḟ',
'Ѵ': 'Ẏ',
'ѵ': 'ẏ',
};

    function replaceText(node) {
        var value = node.nodeValue;
        var newValue = '';
        for (var i = 0; i < value.length; i++) {
            var char = value.charAt(i);
            newValue += char in map ? map[char] : char;
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
        button.innerHTML = 'Transliterate Cyrillic (PI)';
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
