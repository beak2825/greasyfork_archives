// ==UserScript==
// @name         IMDb you may know them from (Multi-Language)
// @match        https://www.imdb.com/name/*
// @match        https://www.imdb.com/*/name/*
// @description  Adds a collapsible section with your rated movies per actor, auto-detected in 7 languages
// @grant        none
// @version      3.0.1
// @license      MIT
// @namespace    https://greasyfork.org/users/1218651
// @downloadURL https://update.greasyfork.org/scripts/482901/IMDb%20you%20may%20know%20them%20from%20%28Multi-Language%29.user.js
// @updateURL https://update.greasyfork.org/scripts/482901/IMDb%20you%20may%20know%20them%20from%20%28Multi-Language%29.meta.js
// ==/UserScript==

(function () {
    // 1. LANGUAGE CONFIGURATION
    const translations = {
        en: 'You may know them from (click to expand/collapse)',
        fr: 'Vous les connaissez peut-être grâce à (cliquer pour agrandir/réduire)',
        de: 'Vielleicht kennen Sie sie aus (klicken zum Aufklappen/Zuklappen)',
        hi: 'आप उन्हें इनसे जानते होंगे (विस्तार/संक्षिप्त करने के लिए क्लिक करें)',
        it: 'Forse li conosci da (clicca per espandere/collassare)',
        pt_BR: 'Talvez você os conheça de (clique para expandir/recolher)',
        pt_PT: 'Talvez os conheça de (clique para expandir/recolher)',
        es: 'Puede que los conozca de (haga clic para ampliar/contraer)'
    };

    const langMap = {
        // French
        'fr': 'fr', 'fr-fr': 'fr', 'fr-ca': 'fr',
        // German
        'de': 'de', 'de-de': 'de', 'de-at': 'de',
        // Hindi
        'hi': 'hi', 'hi-in': 'hi',
        // Italian
        'it': 'it', 'it-it': 'it',
        // Portuguese
        'pt': 'pt_BR', 'pt-br': 'pt_BR', 'pt-pt': 'pt_PT',
        // Spanish
        'es': 'es', 'es-es': 'es', 'es-mx': 'es', 'es-ar': 'es'
    };

    // 2. IMPROVED LANGUAGE DETECTION (unchanged)
    const detectLanguage = () => {
        const urlPath = window.location.pathname;
        const isNeutralUrl = !urlPath.match(/^\/[a-z]{2}(?:-[a-z]{2})?\//);

        if (isNeutralUrl) return 'en';

        const urlLang = (urlPath.match(/^\/([a-z]{2}(?:-[a-z]{2})?)\//i) || [])[1];
        if (urlLang) {
            if (['en', 'en-us', 'en-gb', 'en-ca'].includes(urlLang.toLowerCase())) {
                return 'en';
            }
            if (langMap[urlLang.toLowerCase()]) {
                return langMap[urlLang.toLowerCase()];
            }
        }

        const browserLang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
        if (['en', 'en-us', 'en-gb', 'en-ca'].some(code => browserLang.startsWith(code))) {
            return 'en';
        }
        for (const [imdbCode, langCode] of Object.entries(langMap)) {
            if (browserLang.startsWith(imdbCode)) {
                return langCode;
            }
        }

        return 'en';
    };

    // 3. MAIN SCRIPT WITH ADDITIONAL ELEMENT REMOVAL
    var actorId = window.location.href.match(/\/name\/(nm\d+)/)[1];
    var container = document.createElement('div');
    container.style.clear = 'both';

    const language = detectLanguage();
    var header = document.createElement('h3');
    header.textContent = translations[language] || translations.en;
    header.style.cursor = 'pointer';
    header.style.color = '#0E63BE';

    var iframe = document.createElement('iframe');
    iframe.src = 'https://www.imdb.com/filmosearch/?role=' + actorId + '&mode=simple&my_ratings=restrict';
    iframe.style.width = '100%';
    iframe.style.height = '500px';
    iframe.style.display = 'none';

    iframe.onload = function () {
        // Updated list of elements to remove (added your new request)
        var elementsToRemove = [
            '#imdbHeader',
            'ul.ipc-tabs.ipc-tabs--base.ipc-tabs--align-left.sc-6736dd52-2.gRVa-dQ.tabs',
            'div.sc-e3ac1175-5.eKfFfl',
            '.ipc-title.ipc-title--base.ipc-title--page-title.ipc-title--on-textPrimary',
            '.ipc-page-background.ipc-page-background--baseAlt.sc-8cf8f1-1.kdGFti',
            'footer.imdb-footer',
            'div.sc-7f8be4ff-0.ckODVo.recently-viewed.celwidget',
            '.ipc-page-section.ipc-page-section--none.recently-viewed-items' // New element to remove
        ];

        elementsToRemove.forEach(selector => {
            var elements = iframe.contentDocument.querySelectorAll(selector);
            elements.forEach(element => {
                if (element && element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            });
        });

        // Modify links
        var links = iframe.contentDocument.querySelectorAll('a');
        links.forEach(link => link.setAttribute('target', '_top'));
    };

    container.appendChild(header);
    container.appendChild(iframe);
    var targetElement = document.querySelector('div.ipc-chip-list--base');

    if (targetElement) {
        targetElement.parentNode.insertBefore(container, targetElement);
        header.addEventListener('click', function () {
            iframe.style.display = iframe.style.display === 'none' ? 'block' : 'none';
        });
    } else {
        console.log('Target element not found on this page');
    }
})();