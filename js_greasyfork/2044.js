// ==UserScript==
// @name        muyuge.reader.settings
// @namespace   clumsyman
// @description reform the reader settings: font-size, background-color, etc.
// @include     http://muyuge.com/*/*.html
// @include     http://muyuge.net/*/*.html
// @include     http://www.muyuge.net/*/*.html
// @version     2
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/2044/muyugereadersettings.user.js
// @updateURL https://update.greasyfork.org/scripts/2044/muyugereadersettings.meta.js
// ==/UserScript==

function setOption(dropdown, index, text, value) {
    if (dropdown.options.length <= index) {
        dropdown.add(new Option(text, value));
    } else {
        if (dropdown.options[index].text != text) {
            dropdown.options[index].text = text;
        }
        if (dropdown.options[index].value != value) {
            dropdown.options[index].value = value;
        }
    }
}

var dropdown = document.querySelector('select#fonttype');
if (dropdown) {
    dropdown.options[0].value = '';
    dropdown.options[1].value = 'inherit';
    setOption(dropdown, 2, '小号', 'small');
    setOption(dropdown, 3, '中号', 'medium');
    setOption(dropdown, 4, '大号', 'large');
}

dropdown = document.querySelector('select#bcolor');
if (dropdown) {
    dropdown.options[0].value = '';
    dropdown.options[1].value = 'inherit';
}

unsafeWindow.loadSet();
