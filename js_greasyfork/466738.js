// ==UserScript==
// @name         Cyrillic Transliterator (ISO 9)
// @description  Transliterates Cyrillic characters to Latin characters on any webpage.
// @author       w4t3r1ily
// @version      1.9
// @match        *://*/*
// @include      *
// @grant        none
// @icon         https://opu.peklo.biz/p/23/05/13/1684010167-8264b.jpg
// @namespace https://greasyfork.org/users/905173
// @downloadURL https://update.greasyfork.org/scripts/466738/Cyrillic%20Transliterator%20%28ISO%209%29.user.js
// @updateURL https://update.greasyfork.org/scripts/466738/Cyrillic%20Transliterator%20%28ISO%209%29.meta.js
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
'г': 'g',
'Ґ': 'G̀',
'ґ': 'g̀',
'Д': 'D',
'д': 'd',
'Ѓ': 'Ǵ',
'ѓ': 'ǵ',
'Ђ': 'Đ',
'ђ': 'đ',
'Е': 'E',
'е': 'e',
'Ё': 'Ë',
'ё': 'ë',
'Є': 'Ê',
'є': 'ê',
'Ж': 'Ž',
'ж': 'ž',
'З': 'Z',
'з': 'z',
'Ѕ': 'Ẑ',
'ѕ': 'ẑ',
'И': 'I',
'и': 'i',
'І': 'Ì',
'і': 'ì',
'Ї': 'Ï',
'ї': 'ï',
'Й': 'J',
'й': 'j',
'Ј': 'J̌',
'ј': 'ǰ',
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
'Њ': 'Ň',
'њ': 'ň',
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
'Ў': 'Ŭ',
'ў': 'ŭ',
'Ф': 'F',
'ф': 'f',
'Х': 'H',
'х': 'h',
'Ц': 'C',
'ц': 'c',
'Ч': 'Č',
'ч': 'č',
'Џ': 'D̂',
'џ': 'd̂',
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
'Ѣ': 'Ě',
'ѣ': 'ě',
'Э': 'È',
'э': 'è',
'Ю': 'Û',
'ю': 'û',
'Я': 'Â',
'я': 'â',
"'": 'ʺ',
'Ѫ': 'Ǎ',
'ѫ': 'ǎ',
'Ѳ': 'F̀',
'ѳ': 'f̀',
'Ѵ': 'Ỳ',
'ѵ': 'ỳ',
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
        button.innerHTML = 'Transliterate Cyrillic (ISO 9)';
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
