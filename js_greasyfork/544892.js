// ==UserScript==
// @name         Tranimeizle - Genişlik
// @namespace    https://chat.openai.com/
// @version      1.0
// @description  Genişliği düzeltir
// @author       none
// @match        https://*tranimeizle*/*
// @grant        none
// @icon         https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://www.tranimeizle.co&size=64
// @downloadURL https://update.greasyfork.org/scripts/544892/Tranimeizle%20-%20Geni%C5%9Flik.user.js
// @updateURL https://update.greasyfork.org/scripts/544892/Tranimeizle%20-%20Geni%C5%9Flik.meta.js
// ==/UserScript==

(function () {
    'use strict';

    window.addEventListener("load", () => {
        const existingButton = document.querySelector('#theme-toggle');
        if (!existingButton) return;

        // Butonları oluştur
        const fixBtn = document.createElement('button');
        fixBtn.textContent = '🖥️ W-Fix';

        for (let btn of [fixBtn]) {
            btn.style.marginLeft = '8px';
            btn.style.padding = '4px 10px';
            btn.style.background = '#232323';
            btn.style.border = '1px solid #aaa';
            btn.style.cursor = 'pointer';
            btn.style.borderRadius = '4px';
        }

        existingButton.parentElement.appendChild(fixBtn);

        // Stil ekleyici fonksiyonu
        function addStyle(id, css) {
            let style = document.getElementById(id);
            if (!style) {
                style = document.createElement('style');
                style.id = id;
                document.head.appendChild(style);
            }
            style.textContent = css;
        }

        function removeStyle(id) {
            const style = document.getElementById(id);
            if (style) style.remove();
        }

        const LS_WIDTH = 'tranimeizle_width_fix';

        const widthCSS = `
            .container, .content, .wrapper, .site-wrapper, #main, main {
                max-width: 1200px !important;
                margin: 0 auto !important;
            }
        `;


        fixBtn.addEventListener('click', () => {
            const active = localStorage.getItem(LS_WIDTH) === 'true';
            if (active) {
                removeStyle('fix-style');
                localStorage.setItem(LS_WIDTH, 'false');
            } else {
                addStyle('fix-style', widthCSS);
                localStorage.setItem(LS_WIDTH, 'true');
            }
        });



        // Sayfa ilk yüklendiğinde uygula
        if (localStorage.getItem(LS_WIDTH) === 'true') {
            addStyle('fix-style', widthCSS);
        }
    });
})();
