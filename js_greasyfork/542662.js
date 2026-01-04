// ==UserScript==
// @name         Discord Translator with Language Picker
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Translate highlighted text in Discord with selectable language
// @author       Meadow's Custom Script
// @match        https://discord.com/*
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/542662/Discord%20Translator%20with%20Language%20Picker.user.js
// @updateURL https://update.greasyfork.org/scripts/542662/Discord%20Translator%20with%20Language%20Picker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let selectedLang = 'en'; // Default to English

    // Language options
    const languages = {
        en: "English",
        es: "Spanish",
        fr: "French",
        de: "German",
        ru: "Russian",
        ja: "Japanese",
        ko: "Korean",
        zh: "Chinese",
        pt: "Portuguese",
        it: "Italian"
    };

    document.addEventListener('mouseup', function (e) {
        const selectedText = window.getSelection().toString().trim();
        if (!selectedText) return;

        removePopup();

        // Create translate button
        const translateBtn = document.createElement('div');
        translateBtn.id = 'translate-discord-btn';
        translateBtn.textContent = `🌐 Translate (${languages[selectedLang]})`;
        styleButton(translateBtn, e.pageX, e.pageY);
        document.body.appendChild(translateBtn);

        // Create language dropdown
        const langSelect = document.createElement('select');
        langSelect.id = 'language-selector';
        langSelect.style.position = 'absolute';
        langSelect.style.top = `${e.pageY + 30}px`;
        langSelect.style.left = `${e.pageX}px`;
        langSelect.style.zIndex = 9999;
        langSelect.style.padding = '2px';
        langSelect.style.fontSize = '13px';
        langSelect.style.borderRadius = '4px';
        langSelect.style.border = '1px solid #ccc';
        langSelect.style.background = '#ffffff';

        for (const [code, name] of Object.entries(languages)) {
            const option = document.createElement('option');
            option.value = code;
            option.textContent = name;
            if (code === selectedLang) option.selected = true;
            langSelect.appendChild(option);
        }

        document.body.appendChild(langSelect);

        langSelect.addEventListener('change', () => {
            selectedLang = langSelect.value;
            translateBtn.textContent = `🌐 Translate (${languages[selectedLang]})`;
        });

        translateBtn.addEventListener('click', () => {
            const query = encodeURIComponent(selectedText);
            GM_openInTab(`https://translate.google.com/?sl=auto&tl=${selectedLang}&text=${query}`, { active: true });
            removePopup();
        });

        // Cleanup on outside click
        document.addEventListener('click', function cleanup(ev) {
            if (ev.target !== translateBtn && ev.target !== langSelect) {
                removePopup();
                document.removeEventListener('click', cleanup);
            }
        });
    });

    function removePopup() {
        const oldBtn = document.getElementById('translate-discord-btn');
        const oldSelect = document.getElementById('language-selector');
        if (oldBtn) oldBtn.remove();
        if (oldSelect) oldSelect.remove();
    }

    function styleButton(btn, x, y) {
        btn.style.position = 'absolute';
        btn.style.top = `${y + 5}px`;
        btn.style.left = `${x + 5}px`;
        btn.style.background = '#5865F2';
        btn.style.color = 'white';
        btn.style.padding = '4px 10px';
        btn.style.borderRadius = '6px';
        btn.style.cursor = 'pointer';
        btn.style.zIndex = 9999;
        btn.style.userSelect = 'none';
        btn.style.fontFamily = 'Arial, sans-serif';
        btn.style.fontSize = '13px';
        btn.style.boxShadow = '0px 2px 6px rgba(0,0,0,0.2)';
    }
})();
