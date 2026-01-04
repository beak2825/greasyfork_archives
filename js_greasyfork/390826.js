// ==UserScript==
// @name           Auto-Espande Google Search Tools
// @description    Mostra il menu Strumenti di ricerca nei risultati di ricerca di Google
// @namespace      https://greasyfork.org/users/237458
// @author         figuccio
// @version        27.5
// @match          https://*.google.com/*
// @match          https://*.google.it/*
// @match          https://*.google.fr/*
// @match          https://*.google.es/*
// @match          https://*.google.de/*
// @exclude        https://drive.google.com/*
// @require        https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require        http://code.jquery.com/jquery-latest.js
// @require        https://code.jquery.com/ui/1.13.2/jquery-ui.js
// @grant          GM_addStyle
// @grant          GM_setValue
// @grant          GM_getValue
// @run-at         document-end
// @grant          GM_registerMenuCommand
// @icon           https://www.google.com/favicon.ico
// @noframes
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/390826/Auto-Espande%20Google%20Search%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/390826/Auto-Espande%20Google%20Search%20Tools.meta.js
// ==/UserScript==
(function() {
'use strict';
    //scorrimento continuo pagine
 console.log('goo goo');
    window.onscroll = function() {
    var doc = document.documentElement;
    var current = doc.scrollTop + window.innerHeight;
    var height = doc.offsetHeight;

    if (current === height) {
        console.log('In fondo alla pagina');
        var nextButton = document.getElementById('pnnext');
        if (nextButton) {
            nextButton.click();
        } else {
            console.log('Nessun pulsante per la pagina successiva trovato.');
        }
    }
};
//////////////////////////////////////////////////////////////////////accetta cookie 2025
    const SCRIPT_NAME = "GoogleCookieConsentRemover";
    const DEBUG = true; // Set to false to reduce console output

    function log(message) {
        if (DEBUG) {
            console.log(`[${SCRIPT_NAME}] ${message}`);
        }
    }

    function warn(message) {
        console.warn(`[${SCRIPT_NAME}] ${message}`);
    }

    function error(err, context = "") {
        console.error(`[${SCRIPT_NAME}] Error ${context}:`, err);
    }

    // XPaths for common light DOM structures
    const XPATHS = [
        // English
        '//button[.//span[contains(text(),"Reject all")]]', // YouTube new structure (if in light DOM)
        '//button[.//div[contains(text(),"Reject all")]]',
        '//button[contains(., "Reject all")]',
        '//input[@type="submit" and contains(@value,"Reject all")]',
        // Dutch ("Alles afwijzen")
        '//button[.//span[contains(text(),"Alles afwijzen")]]',
        '//button[.//div[contains(text(),"Alles afwijzen")]]',
        '//button[contains(., "Alles afwijzen")]',
        '//input[@type="submit" and contains(@value,"Alles afwijzen")]',
        // German ("Alle ablehnen")
        '//button[.//span[contains(text(),"Alle ablehnen")]]',
        '//button[.//div[contains(text(),"Alle ablehnen")]]',
        '//button[contains(., "Alle ablehnen")]',
        '//input[@type="submit" and contains(@value,"Alle ablehnen")]',
        // French ("Tout refuser")
        '//button[.//span[contains(text(),"Tout refuser")]]',
        '//button[.//div[contains(text(),"Tout refuser")]]',
        '//button[contains(., "Tout refuser")]',
        '//input[@type="submit" and contains(@value,"Tout refuser")]',
        // Spanish ("Rechazar todo")
        '//button[.//span[contains(text(),"Rechazar todo")]]',
        '//button[.//div[contains(text(),"Rechazar todo")]]',
        '//button[contains(., "Rechazar todo")]',
        '//input[@type="submit" and contains(@value,"Rechazar todo")]',
        // Italian ("Rifiuta tutto")
        '//button[.//span[contains(text(),"Rifiuta tutto")]]',
        '//button[.//div[contains(text(),"Rifiuta tutto")]]',
        '//button[contains(., "Rifiuta tutto")]',
        '//input[@type="submit" and contains(@value,"Rifiuta tutto")]',
        // Generic form-based fallback
        '//form[contains(@action, "consent") or contains(@action, "reject")]/button[not(@jsname) or @jsname="LgbsSe" or @jsname="ZUkOIc"]',
        '//form[contains(@action, "consent") or contains(@action, "reject")]//button[translate(normalize-space(.), "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz") = "reject all"]',
        // YouTube specific aria-labels (usually for tp-yt-paper-button or button)
        // Note: The deep search below is better for aria-labels in Shadow DOM
        '//button[contains(translate(@aria-label, "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "reject all")]',
        '//tp-yt-paper-button[contains(translate(@aria-label, "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "reject all")]',
    ];

    // Keywords for deep search (aria-label or text content)
    // Order by likely prevalence or specificity.
    const DEEP_SEARCH_KEYWORDS = [
        "Reject the use of cookies and other data for the purposes described", // Exact YouTube aria-label
        "Reject all", "Alles afwijzen", "Alle ablehnen", "Tout refuser", "Rechazar todo", "Rifiuta tutto"
    ];


    let isHandled = false;
    let observer = null;
    let observerTimeoutId = null;
    let periodicCheckIntervalId = null;
    let periodicCheckMasterTimeoutId = null;

    const OBSERVER_MAX_DURATION_MS = 30000;
    const PERIODIC_CHECK_INTERVAL_MS = 1000;
    const PERIODIC_CHECK_DURATION_MS = 10000;

    function cleanup(reason) {
        log(`Cleanup called. Reason: ${reason}`);
        if (periodicCheckIntervalId) { clearInterval(periodicCheckIntervalId); periodicCheckIntervalId = null; log("Periodic check interval cleared."); }
        if (periodicCheckMasterTimeoutId) { clearTimeout(periodicCheckMasterTimeoutId); periodicCheckMasterTimeoutId = null; log("Periodic check master timeout cleared."); }
        if (observer) { observer.disconnect(); observer = null; log("MutationObserver disconnected."); }
        if (observerTimeoutId) { clearTimeout(observerTimeoutId); observerTimeoutId = null; log("MutationObserver master timeout cleared."); }
    }

    function deepQuerySelectorAll(selector, rootNode = document.documentElement) {
        const results = [];
        const elementsToSearchIn = [rootNode];

        while (elementsToSearchIn.length > 0) {
            const currentElement = elementsToSearchIn.shift();
            if (!currentElement || typeof currentElement.querySelectorAll !== 'function') {
                continue;
            }

            // Search in the light DOM of the current element
            results.push(...Array.from(currentElement.querySelectorAll(selector)));

            // Search in the shadow DOM of all children of currentElement
            const shadowHosts = currentElement.querySelectorAll('*');
            for (const host of shadowHosts) {
                if (host.shadowRoot) {

                    results.push(...Array.from(host.shadowRoot.querySelectorAll(selector)));
                    elementsToSearchIn.push(host.shadowRoot); // Also queue the shadowRoot for deeper traversal of its children's shadowRoots
                }
            }
        }
        return results;
    }

    function attemptClickOnElement(element, foundByType) {
        log(`Found potential button by ${foundByType}. Details: Tag=${element.tagName}, Text="${element.textContent?.trim().substring(0, 50)}", Aria="${element.getAttribute('aria-label')?.substring(0, 50)}"`);

        const style = window.getComputedStyle(element);
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0' || element.disabled || element.getAttribute('aria-hidden') === 'true') {
            log(`Button seems non-interactable (display: ${style.display}, visibility: ${style.visibility}, opacity: ${style.opacity}, disabled: ${element.disabled}, aria-hidden: ${element.getAttribute('aria-hidden')}). Skipping.`);
            return false;
        }

        try {
            log("Attempting to click the button...");
            element.click();
            log(`Button clicked successfully (found by ${foundByType}).`);
            return true;
        } catch (e) {
            error(e, `while clicking button found by ${foundByType}`);
            return false;
        }
    }


    function findAndClickButtonOnly() {
        log("findAndClickButtonOnly: Searching for consent button...");

        // Phase 1: XPath search (primarily for Light DOM, faster)
        log("Phase 1: XPath search (Light DOM).");
        for (const xpath of XPATHS) {
            let buttonNode = null;
            try {
                buttonNode = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            } catch (e) {
                error(e, `while evaluating XPath: ${xpath}`);
                continue;
            }
            if (buttonNode && (buttonNode instanceof HTMLElement)) {
                if (attemptClickOnElement(buttonNode, `XPath: ${xpath}`)) return true;
            }
        }
        log("Phase 1: XPath search did not find a clickable button.");

        // Phase 2: Deep search (piercing Shadow DOMs)
        log("Phase 2: Deep search (Shadow DOM piercing).");
        const clickableElementSelectors = 'button, input[type="submit"], tp-yt-paper-button'; // Common clickable elements
        let allPotentialClickableElements = [];
        try {
            allPotentialClickableElements = deepQuerySelectorAll(clickableElementSelectors);
        } catch (e) {
            error(e, "during deepQuerySelectorAll execution");
            return false; // Critical failure in deep search
        }

        log(`Deep search found ${allPotentialClickableElements.length} potential elements using selector: "${clickableElementSelectors}".`);

        for (const element of allPotentialClickableElements) {
            // 1. Check ARIA label
            const ariaLabel = element.getAttribute('aria-label');
            if (ariaLabel) {
                for (const keyword of DEEP_SEARCH_KEYWORDS) {
                    if (ariaLabel.toLowerCase().includes(keyword.toLowerCase())) {
                        if (attemptClickOnElement(element, `Deep search - ARIA label ("${ariaLabel.substring(0,50)}") matching keyword "${keyword}"`)) return true;
                        // Don't break here, element might also match text or a more specific aria keyword
                    }
                }
            }

            // 2. Check Text Content (or value for inputs)
            let textContent = "";
            const tagName = element.tagName.toLowerCase();

            if (tagName === 'input') {
                textContent = element.value || "";
            } else { // For <button> or <tp-yt-paper-button>
                // Standard way to get text for tp-yt-paper-button label
                const paperButtonLabel = element.querySelector('#text, #label'); // #text is common in yt-formatted-string inside paper-button
                if (paperButtonLabel && paperButtonLabel.textContent) {
                    textContent = paperButtonLabel.textContent.trim();
                } else if (element.textContent) { // General text content
                     textContent = element.textContent.trim();
                }
                // For specific YouTube buttons, text is in a nested span
                const ytButtonSpan = element.querySelector('span.yt-core-attributed-string, .button-renderer span, .yt-spec-button-shape-next__button-text-content span');
                if (ytButtonSpan && ytButtonSpan.textContent && ytButtonSpan.textContent.trim().length > (textContent.length / 2) ) { // Prefer specific span if its text is substantial
                    textContent = ytButtonSpan.textContent.trim();
                }
            }

            if (textContent) {
                for (const keyword of DEEP_SEARCH_KEYWORDS) {
                    if (textContent.toLowerCase().includes(keyword.toLowerCase())) { // Using includes for partial matches like "Reject all cookies"
                        if (attemptClickOnElement(element, `Deep search - Text ("${textContent.substring(0,50)}") matching keyword "${keyword}"`)) return true;
                    }
                }
            }
        }
        log("Phase 2: Deep search did not find a clickable button.");
        log("No suitable consent button found after all search phases.");
        return false;
    }

    function attemptToHandleConsent(triggerSource) {
        if (isHandled) return true;
        log(`Attempting to handle consent (triggered by: ${triggerSource}).`);
        if (findAndClickButtonOnly()) {
            isHandled = true;
            cleanup(`Consent handled (source: ${triggerSource})`);
            log(`Consent successfully handled by ${triggerSource}. All checks stopped.`);
            return true;
        }
        return false;
    }

    // --- Main Execution ---
    log("Script started.");

    const MAIN_CONSENT_PAGE_HOST_REGEX = /^(www|consent)\.(google|youtube)\./i;
    const GENERAL_GOOGLE_YOUTUBE_HOST_REGEX = /(\.google\.|\.youtube\.)/i;
    const isLikelyFullConsentPage = MAIN_CONSENT_PAGE_HOST_REGEX.test(window.location.hostname);
    const isAnyGoogleYouTubeDomain = GENERAL_GOOGLE_YOUTUBE_HOST_REGEX.test(window.location.hostname);
    const pathMightHaveConsentPopup = /\/(consent|watch|results|search|embed|$)/i.test(window.location.pathname); // Includes root "/"
    const isRootPath = window.location.pathname === "/";

    if (isAnyGoogleYouTubeDomain && !isLikelyFullConsentPage && !pathMightHaveConsentPopup && !isRootPath) {
        log(`Current page (${window.location.href}) is a Google/YouTube domain but unlikely for full consent. Performing a single quick check.`);
        if (attemptToHandleConsent("initial check on less-likely page")) {
            log("Consent dialog handled on less-likely page type.");
        } else {
            log("No consent dialog found on less-likely page type. Script will now exit for this page.");
        }
        return;
    }

    if (attemptToHandleConsent("initial synchronous check")) {
        log("Dialog handled on initial synchronous check. Script finished.");
        return;
    }

    if (!isHandled) {
        log(`Starting periodic checks every ${PERIODIC_CHECK_INTERVAL_MS / 1000}s for up to ${PERIODIC_CHECK_DURATION_MS / 1000}s.`);
        periodicCheckIntervalId = setInterval(() => {
            if (isHandled || document.hidden) {
                if (document.hidden && !isHandled) log("Tab is hidden, skipping periodic check's attemptToHandleConsent.");
                return;
            }
            attemptToHandleConsent("periodic check");
        }, PERIODIC_CHECK_INTERVAL_MS);

        periodicCheckMasterTimeoutId = setTimeout(() => {
            if (periodicCheckIntervalId) {
                clearInterval(periodicCheckIntervalId); periodicCheckIntervalId = null;
                log("Periodic checks completed their duration without success.");
            }
        }, PERIODIC_CHECK_DURATION_MS);
    }

    if (!isHandled) {
        log("Setting up MutationObserver.");
        observer = new MutationObserver((mutationsList, obs) => {
            if (isHandled) {
                obs.disconnect(); observer = null;
                log("MutationObserver: Consent already handled. Disconnecting self.");
                return;
            }
            log(`DOM changes detected by MutationObserver. Mutations: ${mutationsList.length}`);
            let potentiallyRelevantChange = false;
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    potentiallyRelevantChange = true; break;
                }
                if (mutation.type === 'attributes') { // Sometimes dialog appears by changing attributes
                    potentiallyRelevantChange = true; break;
                }
            }
            if (!potentiallyRelevantChange) return;
            attemptToHandleConsent("MutationObserver");
        });

        observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true });
        log("MutationObserver started. Waiting for DOM changes or observer timeout.");

        observerTimeoutId = setTimeout(() => {
            if (!isHandled) {
                warn(`MutationObserver timed out after ${OBSERVER_MAX_DURATION_MS / 1000}s.`);
                cleanup(`Max observation duration reached for observer.`);
            }
        }, OBSERVER_MAX_DURATION_MS);
    }
    log("Initial setup complete. Waiting for consent dialog or timeouts.");

    //////////////////////////////////////////////////////////////
    // Funzione per cercare e cliccare sull'elemento tema scuro on
    function clickOnDarkTheme() {
        const elements = document.querySelectorAll('*');
        elements.forEach(element => {
            if (element.textContent.includes('Tema scuro:disattivato')) {
                element.click();
            }
        });
    }

    // Esegui la funzione al caricamento della pagina
    window.addEventListener('load', clickOnDarkTheme);
//////////////////////////////////////////////////////////////////////
/////////////////////disattiva SafeSearch giugno 2024
 var url = new URL(window.location.href);
  var params = url.searchParams;

  // Controlla se il parametro 'safe' è già impostato su 'off'
  if (params.get('safe') !== 'off') {
    params.set('safe', 'off');
    window.location.replace(url.toString());
  }
   /////////////////////////////////////////
  // Controlla se il parametro 'newwindows' è già impostato su '1'
  if (params.get('newwindow') !== '1') {
    params.set('newwindow', '1');
    window.location.replace(url.toString());
  }
     //30 risultati per pagina ottobre 2025 non funziona piu
//   if (params.get('num') !== '30') {
 //   params.set('num', '30');
 //   window.location.replace(url.toString());
//  }
//////////////////////////
//popup accedi a google (invasivo)settembre 2023
GM_addStyle(".nD2EKb{display:none!important;}");
//Filtro alcuni  risultati potrebbero essere espliciti click automatico su ignora
setTimeout(function(){document.querySelector("#appbar > div.zNFAfd > div > div.zRHtD > div.O6QT3d > div > div").click();},1000);//8marzo 2023

GM_addStyle("#result-stats{display:none!important;}");/* Circa 261.000.000 risultati (0,61 secondi) nascosto */

//pulsante Strumenti di ricerca rosso
GM_addStyle("#hdtb-tls {background:green!important;border-radius:12px;border:1px solid red!important}");
GM_addStyle(".R1QWuf {color:red!important;}");//colore scritta strumenti
GM_addStyle(".R1QWuf:hover{color:lime!important;}");//strumenti e tutti immagini ecc
GM_addStyle(".rQTE8b{background:!important;border-radius:10px;border:1px solid lime!important}");//colore bordo tutti immagini ecc
GM_addStyle("[selected] .R1QWuf{border-bottom-color:red;}");//trattino sotto tutti immagini ecc
/////////////////////////////////////strumenti sottomenu 2025
GM_addStyle('.vH6rvf{background:yellow!important;border:2px solid blue!important;}');
GM_addStyle('.rNHry{color:red!important;}');
GM_addStyle('.rNHry:hover{color:green!important;}');
GM_addStyle('.Urm71 a{color:red!important;}');
GM_addStyle('.Urm71 a:hover{color:lime!important;}');
GM_addStyle('.Wf7Nsf{background:#9900ff!important;}');
//////////////////////////////////////////////////////////
    //triangolini rossi
GM_addStyle('.M5dSnd {color:red!important;}');
GM_addStyle('.M5dSnd:hover {color:blue!important;}');
//menu colorato
GM_addStyle('.cF4V5c {color:lime!important;background:red !important;}');
GM_addStyle('.cF4V5c {border:2px solid blue!important}');//bordo blu
//no publicita correlate
GM_addStyle('#rcnt .col:nth-of-type(3) {display:none !important;}');
//Promemoria sulla privacy di Google
GM_addStyle('#cnsh,#cnso,#cnsi{display:none!important}');
//ricerche correlate
GM_addStyle('#brs {display:none!important;}');
GM_addStyle('.commercial-unit-desktop-top {display:none!important;}');
//di nuovo publicita e correlati a destra
GM_addStyle('#rhs {display:none!important;}');
GM_addStyle('.YTDezd {display:none!important;}');
//////////////////////////////////////////////////aggiunto youtube
    // Trova gli elementi div e textarea di destinazione
     //const targetDiv = document.querySelector('div.RNNXgb');
     const targetDiv = document.querySelector('#cnt > div.Fgyi2e.rZj61.caNvfd > div > div.YNk70c > div');//settembre 2025
   // const targetDiv = document.querySelector('#hdtb-tls > div');

    const searchInput = document.querySelector('textarea.gLFyf');
    //Crea un elemento pulsante
    const youtube = document.createElement('button');
    youtube.innerText = 'Youtube';

    //Applica lo stile CSS al pulsante
    youtube.style.color = 'red';
    youtube.style.padding = '10px';
    youtube.style.background = 'yellow';
    youtube.style.border = '2px solid blue';
    youtube.style.borderRadius = '8px';
    youtube.style.cursor = 'pointer';
    youtube.style.padding = '5px';
    youtube.style.marginTop ='9px';
    youtube.href = 'https://www.youtube.com/results?search_query';
    // Aggiungi event listener per l'effetto al passaggio del mouse
    youtube.addEventListener('mouseover', function () {
      this.style.color = 'lime';
    });

    // Reimposta il colore quando il mouse se ne va
    youtube.addEventListener('mouseout', function () {
      this.style.color = 'red';
    });
    //Gestisci l'evento clic sul pulsante
    youtube.addEventListener('click', function() {
        // Ottieni la query di ricerca corrente dall'area di testo
        const searchQuery = searchInput.value.trim();

        // Sostituisci gli spazi con '+'
        const modifiedQuery = searchQuery.replace(/ /g, '+');

        // Create the YouTube search URL
        const youtubeURL = `https://www.youtube.com/results?search_query=${modifiedQuery}`;

        // Open the YouTube URL in a new tab
        window.open(youtubeURL);
    });

    // Append the button to the target div
    targetDiv.appendChild(youtube);
    // Imposta l'URL come suggerimento quando passi il mouse sopra il pulsante
    youtube.addEventListener('mouseenter', function() {
        const searchQuery = searchInput.value.trim();
        const modifiedQuery = searchQuery.replace(/ /g, '+');
        const youtubeURL = `https://www.youtube.com/results?search_query=${modifiedQuery}`;
    });

    ///////////////////// Mostra il menu Strumenti di ricerca
    const interval = setInterval(() =>
    {var toolsButton = document.getElementById('hdtb-tls');

     if (toolsButton.getAttribute("aria-expanded") === "true") {

        clearInterval(interval);
        }
        else{toolsButton.click();
        }
    }, 250);
    ///////////////////////////////////////////
// Funzione per inizializzare la finestra
function initializeWindow() {
// Crea la finestra e aggiunge il contenuto
var $ = window.jQuery;
$('body').append(`
        <div id="googleok" style="position:fixed;top:5px;left:850px;width:430px;height:auto;z-index:9999;color:lime;">
            <fieldset style="background-color:#3b3b3b;border:2px solid red;border-radius:5px;">
                <legend style="text-align:center;color:lime;">Clock</legend>
                <div style="display: flex; align-items: center;">
                    <div id="datePickerx" title="Data-ora" style="border:1px solid yellow;border-radius:5px;cursor:pointer;">
                    </div>
                    <div>
                        <label title="Cambia lingua data"   style="color:lime;display:inline-flex;cursor:pointer">
                            <input type="radio" name="options" title="Cambia lingua data" value="changeLanguage" style="cursor:pointer;">Lingua
                        </label>
                            <label title="Cambia 12/24h"    style="color:lime;display:inline-flex;cursor:pointer">
                            <input type="radio" name="options" title="Cambia 12/24h" value="toggleFormat" style="cursor:pointer;">12/24h
                        </label>
  <span class="chiudi" title="Chiudi" id="close" style="background-color:red;color:lime;border:1px solid yellow;border-radius:50%;cursor:pointer;font-size:14px;padding:3px 6px;margin-left:4px;">X</span>

                    </div>
                </div>
     </fieldset>
        </div>
    `);

// Event listener for radio button selection
$('input[name="options"]').on('change', function() {
    const selectedValue = $(this).val();
    if (selectedValue === 'changeLanguage') {
        changeLanguage();
    } else if (selectedValue === 'toggleFormat') {
        toggleFormat();
    }

    // Disable the radio buttons temporarily
    $('input[name="options"]').prop('disabled', true);

    // Re-enable the radio buttons after a short delay
    setTimeout(() => {
        $('input[name="options"]').prop('disabled', false).prop('checked', false);
    }, 300); // Milliseconds
});

        // Imposta la posizione iniziale della finestra
        let windowPosition = {
            x: 50,
            y: 50
        };

        // Carica la posizione salvata precedentemente, se disponibile
        if (GM_getValue('userscript_window_position')) {
            windowPosition = JSON.parse(GM_getValue('userscript_window_position'));
            $('#googleok').css({top: windowPosition.y, left: windowPosition.x});
        }

        // Funzione per salvare la posizione della finestra
        function saveWindowPosition() {
        const position = $('#googleok').position();
        GM_setValue('userscript_window_position', JSON.stringify({x: position.left, y: position.top}));
        }

let use12HourFormat = GM_getValue('use12HourFormat', true); // Default è il formato 24 ore true
let language = GM_getValue('language') || 'it'; // Recupera la lingua dal localStorage o usa 'it' come predefinita

const languages = {
    en: { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' },
    it: { weekday: 'short', month: '2-digit', day: '2-digit', year: 'numeric' }
};

        // Funzione per aggiornare l'ora
    function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const milliseconds = String(now.getMilliseconds()).padStart(3, "0");
    const date = now.toLocaleString(language, languages[language]); // Usa la lingua selezionata per la data
    let period = "";

    if (use12HourFormat) { // Condizione corretta per il formato 12 ore
        period = hours >= 12 ? " PM" : " AM";
        hours = hours % 12 || 12; // Converte in formato 12 ore
    }

    hours = String(hours).padStart(2, "0"); // Aggiunge lo zero iniziale per ore
    document.querySelector('#datePickerx').textContent = `${date} ${hours}:${minutes}:${seconds}:${milliseconds}${period}`;
        }

    function changeLanguage() {
    language = (language === 'it') ? 'en' : 'it'; // Alterna tra 'it' e 'en'
    GM_setValue('language', language); // Salva la lingua scelta
}

    function toggleFormat() {
    use12HourFormat = !use12HourFormat; // Alterna il formato orario
    GM_setValue('use12HourFormat', use12HourFormat); // Salva lo stato del formato
}
// Chiama la funzione di inizializzazione e avvia il timer
const intervalTime = 90; // Imposta l'intervallo di tempo
setInterval(updateClock, intervalTime);
        // Chiudi la finestra quando il pulsante di chiusura viene cliccato
          var Close=document.querySelector('#close');
          Close.addEventListener('click',provag,false);
        // Nascondi o mostra la finestra dal menu
function provag() {
var box = document.getElementById('googleok');
box.style.display = ((box.style.display!='none') ? 'none' : 'block');
}
GM_registerMenuCommand("nascondi/mostra time",provag);

        // Rendi la finestra trascinabile
        $('#googleok').draggable({
            containment: 'window',
            stop: saveWindowPosition
        });
    }
    // Chiama la funzione di inizializzazione della finestra
    initializeWindow();
})();
