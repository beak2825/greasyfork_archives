// ==UserScript==
// @name         Quick Kanji Lookup
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Quickly click on Kanji in reviews to pull up their respective WaniKani page.
// @author       jhendrix
// @license MIT
// @match        https://www.wanikani.com/review/session
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459125/Quick%20Kanji%20Lookup.user.js
// @updateURL https://update.greasyfork.org/scripts/459125/Quick%20Kanji%20Lookup.meta.js
// ==/UserScript==

(function () {
    'use strict';

    window.onload = init;

    let showBorder = false;

    let linkStyle = `color:inherit;text-decoration:inherit;${showBorder ? 'border-bottom:2px dashed #FFF;' : ''}margin:0px;padding:0px;`;

    function init() {
        $.jStorage.listenKeyChange('currentItem', function (key, action) {
            let item = $.jStorage.get('currentItem');
            let itemType = item.category.toLowerCase();

            if (itemType == 'kanji') {
                injectReferences([item.characters]);
            } else if ('kanji' in item) {
                injectReferences(item.kanji.map((item) => item.kan));
            }
        });

        function injectReferences(kanjiList) {
            let span = document.getElementById('character').lastElementChild;
            let chars = span.innerText;
            let newHTML = '';

            for (let char of chars) {
                let idx = kanjiList.indexOf(char);

                if (idx !== -1) {
                    let kanji = kanjiList[idx];
                    let url = `https://www.wanikani.com/kanji/${encodeURIComponent(kanji)}`;

                    newHTML += `<a href="${url}" target="_blank;" style="${linkStyle}">${kanji}</a>`;
                } else {
                    newHTML += char;
                }
            }

            span.innerHTML = newHTML;
        }
    }
})();