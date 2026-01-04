// ==UserScript==
// @name         Hírstart admin - extra gombok
// @namespace    http://tampermonkey.net/
// @version      1.9.2
// @description  Gyorsabb navigáció egyes esetekben, URL hívással is aktiválható funkciók; vizuális jelzés a kattintások helyén
// @author       attila.virag@centralmediacsoport.hu
// @match        https://admin.hirstart.hu/*
// @exclude      https://admin.hirstart.hu/oldalszerk*
// @exclude      https://admin.hirstart.hu/forrasadmin*
// @grant        none
// @license      hirstart.hu
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hirstart.hu
// @downloadURL https://update.greasyfork.org/scripts/528295/H%C3%ADrstart%20admin%20-%20extra%20gombok.user.js
// @updateURL https://update.greasyfork.org/scripts/528295/H%C3%ADrstart%20admin%20-%20extra%20gombok.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =========================================================================
    // KONFIGURÁCIÓ
    // =========================================================================
    const CONFIG = {
        // Időzítések (ms)
        timings: {
            clickIndicatorDuration: 300,
            shortDelay: 300,
            mediumDelay: 500,
            longDelay: 1000
        },
        // Gombok konfigurációja
        buttons: {
            rssOldalInfo: {
                text: 'rss oldal.info',
                top: '2px',
                right: '4px',
                id: 'rss-oldal-info'
            },
            nemHirdetes: {
                text: 'nem hirdetés',
                top: '2px',
                right: '84px',
                id: 'nem-hirdetes'
            }
        },
        // Gombok megjelenése
        buttonStyle: {
            position: 'fixed',
            zIndex: '1000',
            padding: '2px 4px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '3px',
            fontSize: '12px',
            fontFamily: 'system-ui'
        },
        // Click indicator beállítások
        clickIndicator: {
            size: 10,
            color: 'rgba(255, 0, 0, 0.8)',
            zIndex: '10000'
        },
        // URL ellenőrzés gyakorisága
        urlCheckInterval: 500
    };

    // =========================================================================
    // CSS SELECTOROK ÉS XPATHEK - Központi hely a törékeny selectoroknak
    // =========================================================================
    const SELECTORS = {
        rssOldalInfo: {
            firstNav: '#ext-gen299 > div > li:nth-child(5) > ul > li:nth-child(5) > div',
            secondNav: 'div > li > div[ext\\:tree-node-id="rss_partner_tree-partner-34"] > div:nth-child(1) > img.x-tree-ec-icon.x-tree-elbow-plus'
        },
        nemHirdetes: {
            firstNav: '#ext-gen299 > div > li:nth-child(6) > ul > li:nth-child(4) > div > a > span',
            rowExpander: '.x-grid3-row:nth-child(1) .x-grid3-row-expander',
            feedLink: "div.feed-link[qtip='Feed szerkesztése']",
            tabXpath: '/html/body/div[3]/div/div/div[3]/div[2]/div/div[2]/div[2]/div/div[2]/div[1]/div[1]/ul/li[2]/a[2]/em/span',
            checkboxImg: '.x-grid3-row:nth-child(1) .x-grid3-col:nth-child(1) img',
            inputXpath: '/html/body/div[34]/div[2]/div[1]/div/div/div/div/div/form/div[3]/div[1]/input'
        },
        customButton: '.custom-admin-button[data-source="extragombok"]'
    };

    // =========================================================================
    // SEGÉDFÜGGVÉNYEK - VIZUÁLIS FEEDBACK
    // =========================================================================

    /**
     * Kattintás helyén villanó pötty megjelenítése
     * @param {HTMLElement} elem - Az elem, amin a kattintást jelezzük
     */
    function showClickIndicator(elem) {
        if (!elem) return;

        try {
            const rect = elem.getBoundingClientRect();
            const dot = document.createElement('div');
            const size = CONFIG.clickIndicator.size;

            Object.assign(dot.style, {
                width: `${size}px`,
                height: `${size}px`,
                background: CONFIG.clickIndicator.color,
                borderRadius: '50%',
                position: 'fixed',
                pointerEvents: 'none',
                zIndex: CONFIG.clickIndicator.zIndex,
                left: `${rect.left + rect.width / 2 - size / 2}px`,
                top: `${rect.top + rect.height / 2 - size / 2}px`
            });

            document.body.appendChild(dot);
            setTimeout(() => dot.remove(), CONFIG.timings.clickIndicatorDuration);
        } catch (error) {
            console.error('Hiba a click indicator megjelenítésekor:', error);
        }
    }

    /**
     * Teljes egérkattintás szimulációja (mousedown, mouseup, click) + vizuális jelzés
     * @param {HTMLElement} elem - Az elem, amire kattintunk
     */
    function simulateFullClick(elem) {
        if (!elem) return;

        try {
            showClickIndicator(elem);

            const events = ['mousedown', 'mouseup', 'click'];
            events.forEach(eventType => {
                const event = new MouseEvent(eventType, {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                elem.dispatchEvent(event);
            });
        } catch (error) {
            console.error('Hiba a click szimulálásakor:', error);
        }
    }

    /**
     * Egyszerű click() metódus + vizuális jelzés
     * @param {HTMLElement} elem - Az elem, amire kattintunk
     */
    function clickWithIndicator(elem) {
        if (!elem) return;

        try {
            showClickIndicator(elem);
            elem.click();
        } catch (error) {
            console.error('Hiba a kattintáskor:', error);
        }
    }

    // =========================================================================
    // SEGÉDFÜGGVÉNYEK - DOM KEZELÉS
    // =========================================================================

    /**
     * Elem keresése selector alapján, opcionális hibaüzenettel
     * @param {string} selector - CSS selector
     * @param {string} description - Leíró szöveg a loghoz
     * @returns {HTMLElement|null}
     */
    function findElement(selector, description = 'Elem') {
        const elem = document.querySelector(selector);
        if (!elem) {
            console.log(`${description} NEM található! (selector: ${selector})`);
        }
        return elem;
    }

    /**
     * Elem keresése XPath alapján
     * @param {string} xpath - XPath kifejezés
     * @param {string} description - Leíró szöveg a loghoz
     * @returns {HTMLElement|null}
     */
    function findElementByXPath(xpath, description = 'Elem') {
        try {
            const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            const elem = result.singleNodeValue;
            if (!elem) {
                console.log(`${description} NEM található! (xpath: ${xpath})`);
            }
            return elem;
        } catch (error) {
            console.error(`Hiba az XPath keresésnél (${description}):`, error);
            return null;
        }
    }

    /**
     * Aszinkron várakozás
     * @param {number} ms - Milliszekundumok
     * @returns {Promise}
     */
    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Kattintási lánc végrehajtása - általános megoldás több lépésből álló műveletekhez
     * @param {Array} steps - Lépések tömbje: {selector, xpath, action, delay, description}
     */
    async function executeClickChain(steps) {
        for (const step of steps) {
            await wait(step.delay || CONFIG.timings.shortDelay);

            let elem = null;
            if (step.xpath) {
                elem = findElementByXPath(step.xpath, step.description);
            } else if (step.selector) {
                elem = findElement(step.selector, step.description);
            }

            if (elem) {
                console.log(`${step.description} megtalálva, művelet: ${step.action}`);

                switch (step.action) {
                    case 'click':
                        clickWithIndicator(elem);
                        break;
                    case 'fullClick':
                        simulateFullClick(elem);
                        break;
                    case 'focus':
                        elem.focus();
                        if (elem.setSelectionRange) {
                            elem.setSelectionRange(0, 0);
                        }
                        console.log('Input mező fókuszálva, kurzor az elején.');
                        break;
                    case 'custom':
                        if (step.customAction) {
                            step.customAction(elem);
                        }
                        break;
                }
            } else if (step.required !== false) {
                // Ha a lépés kötelező és nem találtuk, megszakítjuk
                console.warn(`Kötelező lépés nem sikerült: ${step.description}`);
                break;
            }
        }
    }

    // =========================================================================
    // ÜZLETI LOGIKA - RSS OLDAL.INFO
    // =========================================================================

    /**
     * RSS oldal.info funkció végrehajtása
     */
    async function handleRssOldalInfo() {
        console.log('rss oldal.info gomb megnyomva');

        const steps = [
            {
                selector: SELECTORS.rssOldalInfo.firstNav,
                action: 'click',
                delay: CONFIG.timings.shortDelay,
                description: 'RSS első navigációs elem'
            },
            {
                selector: SELECTORS.rssOldalInfo.secondNav,
                action: 'click',
                delay: CONFIG.timings.shortDelay,
                description: 'RSS második navigációs elem'
            }
        ];

        await executeClickChain(steps);
    }

    // =========================================================================
    // ÜZLETI LOGIKA - NEM HIRDETÉS
    // =========================================================================

    /**
     * Link ID beszúrása az input mezőbe, ha az URL megfelelő
     * @param {HTMLElement} inputElem - Az input mező
     */
    function insertLinkIdIfNeeded(inputElem) {
        // Javított regex: kérdőjel a news előtt
        const urlMatch = window.location.href.match(/^https:\/\/admin\.hirstart\.hu\/\?news=1&link_id=(\d+)$/);

        if (urlMatch) {
            const linkId = urlMatch[1];
            inputElem.value = `${linkId}, ${inputElem.value}`;

            if (inputElem.setSelectionRange) {
                const cursorPos = linkId.length + 2;
                inputElem.setSelectionRange(cursorPos, cursorPos);
            }

            console.log('link_id beszúrva az input elejére:', linkId);
        }
    }

    /**
     * Nem hirdetés funkció végrehajtása
     * Célja: navigálás a feed szerkesztőhöz és az űrlap megfelelő állapotba hozása
     */
    async function handleNemHirdetes() {
        console.log('nem hirdetés gomb megnyomva');

        const steps = [
            {
                selector: SELECTORS.nemHirdetes.firstNav,
                action: 'click',
                delay: CONFIG.timings.mediumDelay,
                description: 'Navigáció első elem (menu)'
            },
            {
                selector: SELECTORS.nemHirdetes.rowExpander,
                action: 'fullClick',
                delay: CONFIG.timings.mediumDelay,
                description: 'Sor kibontó elem'
            },
            {
                selector: SELECTORS.nemHirdetes.feedLink,
                action: 'click',
                delay: CONFIG.timings.longDelay,
                description: 'Feed szerkesztése link'
            },
            {
                xpath: SELECTORS.nemHirdetes.tabXpath,
                action: 'fullClick',
                delay: CONFIG.timings.longDelay,
                description: 'Tab váltás elem'
            },
            {
                selector: SELECTORS.nemHirdetes.checkboxImg,
                action: 'fullClick',
                delay: CONFIG.timings.longDelay,
                description: 'Checkbox kép elem'
            },
            {
                xpath: SELECTORS.nemHirdetes.inputXpath,
                action: 'custom',
                delay: CONFIG.timings.mediumDelay,
                description: 'Input mező',
                customAction: (elem) => {
                    elem.focus();
                    if (elem.setSelectionRange) {
                        elem.setSelectionRange(0, 0);
                    }
                    console.log('Input mező fókuszálva, kurzor az elején.');
                    insertLinkIdIfNeeded(elem);
                }
            }
        ];

        await executeClickChain(steps);
    }

    // =========================================================================
    // GOMBOK KEZELÉSE
    // =========================================================================

    /**
     * Egyedi gomb létrehozása
     * @param {Object} config - Gomb konfigurációja
     * @param {Function} clickHandler - Click eseménykezelő
     */
    function createButton(config, clickHandler) {
        const button = document.createElement('button');
        button.textContent = config.text;
        button.classList.add('custom-admin-button');
        button.setAttribute('data-source', 'extragombok');
        button.setAttribute('data-btn', config.id);

        Object.assign(button.style, CONFIG.buttonStyle, {
            top: config.top,
            right: config.right
        });

        button.addEventListener('click', clickHandler);
        document.body.appendChild(button);
    }

    /**
     * Gombok hozzáadása az oldalhoz
     */
    function addCustomButtons() {
        // RSS oldal.info gomb
        const rssButtonSelector = `${SELECTORS.customButton}[data-btn="${CONFIG.buttons.rssOldalInfo.id}"]`;
        if (!document.querySelector(rssButtonSelector)) {
            createButton(CONFIG.buttons.rssOldalInfo, handleRssOldalInfo);
        }

        // Nem hirdetés gomb
        const nemHirdetesButtonSelector = `${SELECTORS.customButton}[data-btn="${CONFIG.buttons.nemHirdetes.id}"]`;
        if (!document.querySelector(nemHirdetesButtonSelector)) {
            createButton(CONFIG.buttons.nemHirdetes, handleNemHirdetes);
        }
    }

    /**
     * Gombok eltávolítása az oldalról
     */
    function removeCustomButtons() {
        const buttons = document.querySelectorAll(SELECTORS.customButton);
        buttons.forEach(btn => btn.remove());
    }

    // =========================================================================
    // OLDAL ÁLLAPOT FIGYELÉS
    // =========================================================================

    /**
     * Ellenőrzi, hogy a "Belépés" szöveg látható-e (login oldal)
     * @returns {boolean}
     */
    function isBelépésVisible() {
        try {
            const elements = Array.from(document.querySelectorAll('body *'));
            return elements.some(el => {
                const style = window.getComputedStyle(el);
                if (style.display === 'none' || style.visibility === 'hidden' || el.offsetParent === null) {
                    return false;
                }
                return el.textContent && el.textContent.trim() === 'Belépés';
            });
        } catch (error) {
            console.error('Hiba a Belépés ellenőrzésekor:', error);
            return false;
        }
    }

    /**
     * URL és oldal állapot figyelése
     */
    function monitorPageState() {
        let currentUrl = location.href;

        setInterval(() => {
            try {
                if (location.href !== currentUrl) {
                    currentUrl = location.href;
                    console.log('URL változás történt:', currentUrl);
                }

                if (isBelépésVisible()) {
                    removeCustomButtons();
                } else {
                    addCustomButtons();
                }
            } catch (error) {
                console.error('Hiba az oldal figyelésekor:', error);
            }
        }, CONFIG.urlCheckInterval);
    }

    // =========================================================================
    // URL PARAMÉTER ALAPÚ AUTOMATIKUS AKTIVÁLÁS
    // =========================================================================

    /**
     * URL paraméter ellenőrzése és automatikus funkció aktiválás
     */
    function checkAutoActivation() {
        if (window.location.search === '?rsspartner=34') {
            console.log('rsspartner=34 paraméter észlelve, automatikus aktiválás...');
            setTimeout(() => {
                handleRssOldalInfo();
            }, CONFIG.timings.mediumDelay);
        }
    }

    // =========================================================================
    // INICIALIZÁLÁS
    // =========================================================================

    /**
     * Script inicializálása
     */
    function init() {
        console.log('Hírstart admin - extra gombok v1.9.1 betöltve');

        try {
            monitorPageState();
            checkAutoActivation();
        } catch (error) {
            console.error('Hiba az inicializáláskor:', error);
        }
    }

    // Script indítása
    init();

})();
