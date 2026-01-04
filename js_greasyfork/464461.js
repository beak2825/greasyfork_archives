// ==UserScript==
// @name                BMTranslator-UIModify
// @name:zh-CN          BMTranslator-综合界面优化
// @namespace           https://github.com/TitanRGB
// @version             1.1
// @description         Self-use UI modify for Bing Microsoft Translator.
// @description:zh-CN   自用微软翻译界面美化。
// @author              https://github.com/TitanRGB
// @icon                data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAjpQTFRFAAAAA3mUA3mUA3mUA3mUA3mUA3mUBHmVA3mUA3mUA3mUA3mUA3mUA3mUA3mUA3mUA3mUA3mUA3mUA3mUA3mUA3mUA3mUA3mUA3mUBHmUA3mUA3mUA3mUA3mUA3mUA3mUA3mUA3mUA3mUA3mUA3mUA3mUA3mUA3mUBHmUA3mUA3mUA3mUA3mUA3mUA3mUA3mUA3mUA3mUA3mUA3mUA3mUA3mUBHmUA3mUA3mUA3mUA3mUA3mUA3mUA3mUA3mUA3mUA3mUA3mUA3mUA3mUA3mUA3mUA3mUA3mUA3mUA3mUA3mUA3mUA3mUBHmUA3mUA3mUA3mUA3mUA3mUA3mUA3mUA3mUA3mUA3mUA3mUA3mUA3mUBHmUA3mUA3mUBHmUA3mUA3mUA3mUA3mUA3mUA3mUA3mUA3mUA3mUA3mUA3mUBHmUaWll81Mlp19Ig2VaM3l4P5lRV6Y1gbwGgbwGA3mUA3mUA3mUjmRU81MlXnhfdLUVgbwGgbwGA3mUA3mUA3mUA3mUA3mUA3mUA3mUA3mUA3mUA3mUA3mUA3mUNHWFa3BytmhZbm9xV3J5J3uDUptOobsHobsHA3mUA3mUA3mUBJDDBaLoBabwBaLoBaDkI42bzq4k/7oI/7oIA3mUBZTKBabwKJCc5LMX/7oI/7oIA3mUBJTMA3mUBaHnA3mUA3mUA3mUA3mUA3mUA3mUBabwA3mUA3mUA3mUA3mUA3mUA3mUQaCh+LgMBabwBabwVaym/7oI/7oI/7oIEQgvhAAAAL50Uk5TAAANJjAvHgk1t/OhC3LV/v/9xEpI6I6c8v/kZQI/0MA0+GwBUub60fzc6/dUQPl6A1zZYycdLpDx6iRuoN0JWPS9Bgd0wZNmaE7tUwTI4k3C+3nIiwWm3xDUUJfsn5CFSbZfKEeVq77MgOS5iMb////KiHMsO7D//////9gb2Ao3Eqz2vB9PmFn/z3jI///XeGVgmvD/897y///23rwc///////YjfMPpRii6fzSLpQMQ11tYVGX64TkZcvkwPQwMAcAAAHkSURBVHicY2CgEmBkYmZhZWNHFeTg5OLmAbOYePn4BYBAUEgYSV5EFCgkBmKxikuApCWBWEpaBiotIysHEpQHMhWkwNohahSVlMHyyiqqIAE1aQYGHnUQS0NVUwusTlsHrEBXCsTR0zdgYDAEsYyMTUzNzC1ATEsToLwVWJe2NVCewQZosi0LI5BlZ+8AcoijE4MzN0he1QVsnSuQ6cYI8ay7IpDD7+Hs6QCkvbx9wKK+QLYHzOm8gkCen38AkAwMgnooGMgJUYaqCA0DmR2uByQ4I6Bi8kB7I01hocMSCPWxYhRMKBrEjYmNi09wAnG5oQoSnWEKZGGhxC+UBLQpGRJqiimIME8VgIM0OwaGdDArIwKhQCYzC64iOycnNy8vL7+gsAgIimFKQktKjcu0QQrKK8CgsqoaBGpQYj9ZnoAChto6AgpkxLErqG9QaISoiMeqwK6p2aGlFcxyxKqgDRRE7UD/O3cAE15nV3d3T29vX/8EEJgIUjAJnDLkJ7c7TgEypk6bPn3GzJmzZs8BgbkgBfMcBJDA/AVgsHDRYhBYAnbaUmQFy7AoWJ4mCJcPXoFFAcPKVash0mvWrluPTQEDw4aNmzZv3rK1VYYBqmDbdlQFCLBjJxjs2r0HBPZiKsAEAKMfwYitwIU/AAAAAElFTkSuQmCC
// @match               http*://*.bing.com/translator
// @match               http*://*.bing.com/translator*
// @license             MPL-2.0
// @license^            Mozilla Public License 2.0
// @charset		        UTF-8
// @homepageURL         https://github.com/SynRGB/BMTranslator-UIModify
// @contributionURL     https://github.com/SynRGB/BMTranslator-UIModify
// @copyright           Copyright © 2022-PRESENT, TitanRGB (https://github.com/TitanRGB)
// @downloadURL https://update.greasyfork.org/scripts/464461/BMTranslator-UIModify.user.js
// @updateURL https://update.greasyfork.org/scripts/464461/BMTranslator-UIModify.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var headerSrchBoxElement = document.querySelector("#theader > div > div.bcSrchBox");
    if (headerSrchBoxElement) {
        headerSrchBoxElement.remove();
    }

    var headerID = document.querySelector("#id_l");
    if (headerID) {
        headerID.remove();
    }

    var headerElement = document.querySelector("body > ul");
    if (headerElement) {
        headerElement.remove();
    }

    var elementToRemove = document.getElementById("tta_phrasebook");
    if (elementToRemove) {
        elementToRemove.remove();
    }

    var mslogoElement = document.querySelector("#mslogo");
    if (mslogoElement) {
        mslogoElement.style.marginTop = "-30px";
    }

    var ttaInputTaElement = document.querySelector("#tta_input_ta");
    var ttaOutputTaElement = document.querySelector("#tta_output_ta");
    if (ttaInputTaElement) {
        ttaInputTaElement.style.fontSize = "16px";
        ttaInputTaElement.classList.remove("auto-size");
    }
    if (ttaOutputTaElement) {
        ttaOutputTaElement.style.fontSize = "16px";
        ttaOutputTaElement.classList.remove("auto-size");
    }

    document.addEventListener('copy', function(e) {
        var selectedText = window.getSelection().toString();
        e.clipboardData.setData('text/plain', selectedText);
        e.preventDefault();
    });
})();

console.log("JS script BMTranslator-UIModify (BMTranslator-综合界面优化) loaded. See more details at https://github.com/SynRGB/BMTranslator-UIModify");