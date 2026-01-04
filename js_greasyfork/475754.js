// ==UserScript==
// @name         Гришина рядом!
// @namespace    grishinaext
// @version      0.91
// @description  Самый близкий вам человек теперь всегда будет в радиусе 300 метров от вас :)
// @author       ProkAl
// @supportURL   https://t.me/prok_al
// @homepage     https://prokal.ru/grishinaext/
// @match        https://*/*
// @license MIT
// @icon         data:image/jpeg;base64,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
// @grant        unsafeWindow
// @run-at       document-start
// @grant        GM_info
// @grant        GM_download
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/475754/%D0%93%D1%80%D0%B8%D1%88%D0%B8%D0%BD%D0%B0%20%D1%80%D1%8F%D0%B4%D0%BE%D0%BC%21.user.js
// @updateURL https://update.greasyfork.org/scripts/475754/%D0%93%D1%80%D0%B8%D1%88%D0%B8%D0%BD%D0%B0%20%D1%80%D1%8F%D0%B4%D0%BE%D0%BC%21.meta.js
// ==/UserScript==

(function() { 'use strict';

    const imageUrl = "https://prokal.ru/grishinaext/test.png";
    /*const elements = document.querySelectorAll('div');
    const ads = Array.from(elements).filter(element => {
        const attributes = element.getAttributeNames();
        const hasAdAttribute = attributes.some(attr => element.getAttribute(attr).startsWith('ad'));



        return hasAdAttribute || hasExternalLink;
    });*/

    const links = document.querySelectorAll('a');
    const ads = Array.from(links).filter(link => {
        const href = link.getAttribute('href');
        return href && !href.startsWith(window.location.hostname);
    });


    function rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    function convertRandom () {
        const imgs = document.querySelectorAll('img');
        const img = imgs[rand(0,imgs.length)]
        img.outerHTML = `<img id="grishina" src="${imageUrl}" alt="Гришина рядом!" height="100px">`;
        return true
    }

    ads.forEach((ad) => {
        ad.innerHTML = `<img id="grishina" src="${imageUrl}" alt="Гришина рядом!" height="100px">`;

        ad.addEventListener("click", function() {
            convertRandom();
            convertRandom();
            convertRandom();
        });
    });

})();