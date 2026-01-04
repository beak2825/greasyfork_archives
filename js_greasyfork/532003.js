// ==UserScript==
// @name         Mydealz Navigation
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Eingefärbtes Navigationmenü mit Links zu Feedback, Sammlung und Bookmarklets
// @author       MD928835
// @license      MIT
// @match        https://www.mydealz.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532003/Mydealz%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/532003/Mydealz%20Navigation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Konfiguration ---
    const customCSS = `
    .nav, .subNav--light { background-color: #009900 !important; transition: none !important; display: flex; align-items: center; }
    .nav a, .nav span, .nav button, .subNav--light a, .subNav--light span, .subNav--light button { color: white !important; font-weight: bold !important; }
    .nav svg, .subNav--light svg { color: white !important; fill: white !important; }
    .input-widget .search-icon { color: #009900 !important; fill: #009900 !important; }
    .input--search { background-color: white !important; color: #333 !important; }
    .nav-button.button--type-secondary, .nav button, .subNav--light button, .button--type-tag, .button--mode-flat { background-color: transparent !important; border-color: transparent !important; }
    .nav button:hover, .subNav--light button:hover, .button--type-tag:hover, .button--mode-flat:hover, .nav a:hover, .nav span:hover, .nav button:hover, .subNav--light a:hover, .subNav--light span:hover, .subNav--light button:hover { background-color: transparent !important; }
    [data-t="dealAlarms"]:hover, a[href*="deal-alarm"]:hover { background-color: transparent !important; }
    .nav-logo > span { display: none !important; }
    .nav-logo { background-image: url("https://www.mydealz.de/assets/img/logo/default-light_d4b86.svg") !important; background-repeat: no-repeat !important; background-position: center !important; background-size: contain !important; width: 195px !important; height: 60px !important; pointer-events: auto !important; cursor: pointer; flex-shrink: 0; }
    .nav-hideSearch .button--mode-brand { background-color: white !important; color: #005B94 !important; }
    .nav-hideSearch .button--mode-brand svg, .nav-hideSearch .button--mode-brand span { color: #005B94 !important; fill: #005B94 !important; }
    .threadItemCard-img .scrollBox-container:not(.carousel--isNext) { display: none !important; }

    /* --- LAYOUT FÜR NAVIGATION --- */
     header .subNav--light { height: auto !important; min-height: 40px !important; position: relative; }
    header .subNav--light .scrollBox { position: relative; }
    /* -------------------------------------------- */
    header .subNav--light .scrollBox-container {
        display: flex !important;
        flex-wrap: nowrap !important;
        align-items: stretch !important;
        justify-content: flex-start !important;
        width: 100%;
        overflow-x: auto !important;
        padding: 0 5px !important;
        margin: 0 !important;
        box-sizing: border-box;
        background-color: #009900 !important;

        /* --- Scrollbar verstecken --- */
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none;  /* Internet Explorer 10+ */
        /* --------------------------------- */
    }
    /* --- NEU: Scrollbar verstecken (WebKit) --- */
    header .subNav--light .scrollBox-container::-webkit-scrollbar {
        display: none; /* Safari and Chrome */
        width: 0;
        height: 0;
    }
    /* --------------------------------------- */

    header .subNav--light .scrollBox-item { flex-shrink: 0 !important; margin: 0 !important; padding: 0 !important; display: flex; align-items: center; }
    header .subNav--light .scrollBox-item .nav-link { display: flex !important; align-items: center !important; height: 100%; padding: 0 10px !important; white-space: nowrap !important; text-decoration: none !important; color: white !important; font-weight: bold !important; box-sizing: border-box; line-height: 1; cursor: pointer; }
    header .subNav--light .scrollBox-item .nav-link svg.icon { width: 18px; height: 18px; margin-right: 6px; flex-shrink: 0; }
    header .subNav--light .scrollBox-item:hover { background-color: transparent !important; }
    header .subNav--light .scrollBox-item .nav-link:hover { background-color: transparent !important; }
    header .subNav--light::before,
    header .subNav--light::after,
    header .subNav--light .scrollBox::before,
    header .subNav--light .scrollBox::after {
        display: none !important;
        background: none !important;
        content: none !important;
        width: 0 !important;
        z-index: -1 !important;
        pointer-events: none !important;
    }
    /* ----------------------------------------------------------------------- */


    /* --- Dropdown Menü Styles --- */
    .mydealz-dropdown-attached, .mdplus-dropdown-attached {
        position: fixed; z-index: 99999 !important; background-color: white; border-radius: 4px;
        box-shadow: 0 3px 10px rgba(0,0,0,0.2);
        padding: 8px 0; margin-top: 2px;
        min-width: 220px;
        opacity: 0;
        visibility: hidden;
        transform: translateY(-5px);
        transition: opacity 0.15s ease-in-out, transform 0.15s ease-in-out, visibility 0s linear 0.15s;
     }
    /* Sichtbarer Zustand */
    .dropdown-visible {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
        transition: opacity 0.15s ease-in-out, transform 0.15s ease-in-out, visibility 0s linear 0s;
    }
    .mydealz-dropdown-attached { width: 220px; }
    .mdplus-dropdown-attached { width: 240px; }
    .mydealz-dropdown-item, .mdplus-dropdown-item { display: block; padding: 10px 16px; color: #333 !important; text-decoration: none; white-space: nowrap; font-weight: normal !important; background-color: transparent; transition: background-color 0.1s ease; /* Hover-Transition */ }
    .mydealz-dropdown-item:hover, .mdplus-dropdown-item:hover { background-color: #f0f0f0 !important; color: #333 !important; }
    .mdplus-dropdown-item { cursor: pointer; }
    .mdplus-divider { height: 1px; margin: 8px 0; background-color: #e5e5e5; }
    .mdplus-add-item {
        color: #333 !important;
        font-weight: bold !important;
    }
    /* ----------------------------------------------------------------- */

    /* --- Mobile Ansicht (Nur Icons) --- */
    @media (max-width: 767px) {
        header .subNav--light .scrollBox-item .nav-link span {
            display: none;
        }
        header .subNav--light .scrollBox-item .nav-link svg.icon {
            margin-right: 0;
        }
         header .subNav--light .scrollBox-item .nav-link {
             padding: 0 12px !important;
         }
    }

    /* --- Modal Styles --- */
     .mdplus-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 10001; }
    .mdplus-modal-content { background-color: white; border-radius: 8px; padding: 24px; width: 500px; max-width: 90%; }
    .mdplus-modal-title { font-size: 18px; font-weight: bold; margin-bottom: 16px; color: #333; }
    .mdplus-form-group { margin-bottom: 16px; }
    .mdplus-form-label { display: block; margin-bottom: 8px; font-weight: bold; color: #555;}
    .mdplus-form-input, .mdplus-form-textarea { width: 100%; padding: 10px 12px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-size: 14px; color: #333; }
    .mdplus-form-textarea { min-height: 100px; font-family: monospace; resize: vertical; }
    .mdplus-form-error { color: red; font-size: 12px; margin-top: 4px; display: none; }
    .mdplus-modal-actions { display: flex; justify-content: flex-end; margin-top: 24px; }
    .mdplus-btn { padding: 10px 18px; border-radius: 4px; cursor: pointer; border: none; margin-left: 8px; font-weight: bold; font-size: 14px; transition: background-color 0.2s ease; }
    .mdplus-btn-cancel { background-color: #f0f0f0; color: #555; }
    .mdplus-btn-cancel:hover { background-color: #e0e0e0; }
    .mdplus-btn-save { background-color: #009900; color: white; }
    .mdplus-btn-save:hover { background-color: #007700; }
    `;

    // --- Daten ---
    const categoryTree = [ { name: "Auto & Motorrad", url: "/gruppe/auto-motorrad" }, { name: "Beauty & Gesundheit", url: "/gruppe/beauty" }, { name: "Dienstleistungen & Verträge", url: "/gruppe/dienstleistungen-vertraege" }, { name: "Elektronik", url: "/gruppe/elektronik" }, { name: "Family & Kids", url: "/gruppe/family-kids" }, { name: "Fashion & Accessoires", url: "/gruppe/fashion-accessoires" }, { name: "Gaming", url: "/gruppe/gaming" }, { name: "Garten & Baumarkt", url: "/gruppe/garten-baumarkt" }, { name: "Home & Living", url: "/gruppe/home-living" }, { name: "Kultur & Freizeit", url: "/gruppe/kultur-freizeit" }, { name: "Lebensmittel & Haushalt", url: "/gruppe/food" }, { name: "Sport & Outdoor", url: "/gruppe/sport" }, { name: "Telefon- & Internet-Verträge", url: "/gruppe/telefon-internet" }, { name: "Urlaub & Reisen", url: "/gruppe/reisen" }, { name: "Versicherung & Finanzen", url: "/gruppe/vertraege-finanzen" } ];
    const vouchers = [ { name: "Adidas", url: "/gutscheine/adidas-de" }, { name: "Amazon", url: "/gutscheine/amazon-de" }, { name: "IKEA", url: "/gutscheine/ikea-com" }, { name: "Lidl", url: "/gutscheine/lidl-de" }, { name: "Media Markt", url: "/gutscheine/mediamarkt-de" }, { name: "OTTO", url: "/gutscheine/otto-de" }, { name: "Saturn", url: "/gutscheine/saturn-de" }, { name: "Zalando", url: "/gutscheine/zalando-de" }, { name: "alle anzeigen ", url: "/gutscheine/" } ];

    // --- MD+ Funktionen ---
    function loadBookmarklets() { try { const bm = localStorage.getItem('mdplus_bookmarklets'); return bm ? JSON.parse(bm) : []; } catch (e) { console.error("[NavScript] Error loading bookmarklets:", e); return []; } }
    function saveBookmarklets(bms) { try { localStorage.setItem('mdplus_bookmarklets', JSON.stringify(bms)); } catch (e) { console.error("[NavScript] Error saving bookmarklets:", e); } }
    function addBookmarklet(title, code) { const bms = loadBookmarklets(); const idx = bms.findIndex(b => b.title === title); if (idx > -1) bms[idx] = {title, code}; else bms.push({title, code}); bms.sort((a, b) => a.title.localeCompare(b.title)); saveBookmarklets(bms); return bms; }
    function executeBookmarklet(code) { console.log("[NavScript] Attempting bookmarklet execution via script tag:", code.substring(0,100)+"..."); let finalCode = code; try { let cleanCode = code.trim().startsWith('javascript:') ? code.trim().substring(11) : code.trim(); try { const decoded = decodeURIComponent(cleanCode); cleanCode = decoded; } catch (e) { console.warn("[NavScript] Failed to decode bookmarklet code:", e); } finalCode = cleanCode; if (finalCode.startsWith('(function(){') && finalCode.endsWith('})()')) { finalCode = finalCode.substring('(function(){'.length, finalCode.length - '})()'.length); } if (finalCode.endsWith(';')) { finalCode = finalCode.slice(0, -1); } const script = document.createElement('script'); script.textContent = finalCode; document.head.appendChild(script); document.head.removeChild(script); } catch (error) { console.error('[NavScript] Bookmarklet execution error (script tag setup):', error); alert(`Bookmarklet Error (script tag setup):\n\n${error.name}: ${error.message}`); } }
    function createAddBookmarkletModal() { if (document.querySelector('.mdplus-modal')) return; const modal = document.createElement('div'); modal.className = 'mdplus-modal'; modal.innerHTML = `<div class="mdplus-modal-content"><div class="mdplus-modal-title">Bookmarklet hinzufügen</div><div class="mdplus-form-group"><label class="mdplus-form-label" for="bookmarklet-title">Titel</label><input type="text" id="bookmarklet-title" class="mdplus-form-input" placeholder="Name des Bookmarklets"></div><div class="mdplus-form-group"><label class="mdplus-form-label" for="bookmarklet-code">JavaScript-Code</label><textarea id="bookmarklet-code" class="mdplus-form-textarea" placeholder="javascript:... oder reiner JS-Code"></textarea><div id="bookmarklet-code-error" class="mdplus-form-error">Gültiger JavaScript-Code erforderlich.</div></div><div class="mdplus-modal-actions"><button class="mdplus-btn mdplus-btn-cancel">Abbrechen</button><button class="mdplus-btn mdplus-btn-save">Speichern</button></div></div>`; const titleInput = modal.querySelector('#bookmarklet-title'); const codeInput = modal.querySelector('#bookmarklet-code'); const errorElement = modal.querySelector('#bookmarklet-code-error'); modal.addEventListener('click', (e) => { if (e.target === modal) document.body.removeChild(modal); }); modal.querySelector('.mdplus-btn-cancel').addEventListener('click', () => document.body.removeChild(modal)); modal.querySelector('.mdplus-btn-save').addEventListener('click', () => { const title = titleInput.value.trim(); let code = codeInput.value.trim(); errorElement.style.display = 'none'; if (!title) { alert('Titel fehlt.'); titleInput.focus(); return; } if (!code) { alert('Code fehlt.'); codeInput.focus(); return; } if (!code.startsWith('javascript:')) code = 'javascript:' + code; if (code.length < "javascript:;".length && !code.startsWith('javascript:alert')) { errorElement.textContent = "Code zu kurz/ungültig."; errorElement.style.display = 'block'; codeInput.focus(); return; } addBookmarklet(title, code); document.body.removeChild(modal); updateMDPlusDropdown(); }); document.body.appendChild(modal); titleInput.focus(); }
    function updateMDPlusDropdown(dropdownElement) { if (!dropdownElement) { dropdownElement = dropdownCache['mdplus']; if (!dropdownElement) return; } const bms = loadBookmarklets(); dropdownElement.innerHTML = ''; if (bms.length === 0) { dropdownElement.innerHTML = '<div style="padding:10px 16px; color: #888; font-style: italic;">Keine Bookmarklets</div>'; } else { bms.forEach(bm => { const item = document.createElement('div'); item.className = 'mdplus-dropdown-item'; item.textContent = bm.title; item.title = bm.code; item.addEventListener('click', (e) => { e.stopPropagation(); executeBookmarklet(bm.code); hideDropdown(dropdownElement); }); dropdownElement.appendChild(item); }); } const divider = document.createElement('div'); divider.className = 'mdplus-divider'; dropdownElement.appendChild(divider); const addItem = document.createElement('div'); addItem.className = 'mdplus-dropdown-item mdplus-add-item'; addItem.textContent = 'Bookmarklet hinzufügen...'; addItem.addEventListener('click', (e) => { e.stopPropagation(); hideDropdown(dropdownElement); createAddBookmarkletModal(); }); dropdownElement.appendChild(addItem); }

    // --- Hauptlogik ---
    let subNavReplaced = false;
    let dropdownCache = {};
    let currentVisibleDropdown = null;
    let hideTimeout = null;

    // *** createNavItem mit title Attribut ***
    function createNavItem(text, url, iconName) {
        const item = document.createElement('div');
        item.className = 'scrollBox-item';
        const link = document.createElement('a');
        link.className = 'nav-link';
        link.href = url;
        link.innerHTML = `<svg width="18" height="18" class="icon icon--${iconName}"><use xlink:href="/assets/img/ico_f3562.svg#${iconName}"></use></svg><span>${text}</span>`;
        link.title = text; // Tooltip hinzufügen
        item.appendChild(link);
        return item;
    }
    // *** createDropdownItem mit title Attribut für den Hauptlink ***
    function createDropdownItem(text, url, iconName, dropdownKey, dropdownCssClass, items) {
        const item = document.createElement('div');
        item.className = 'scrollBox-item has-dropdown';
        item.dataset.dropdownKey = dropdownKey;
        const link = document.createElement('a');
        link.className = 'nav-link';
        link.href = url;
        link.innerHTML = `<svg width="18" height="18" class="icon icon--${iconName}"><use xlink:href="/assets/img/ico_f3562.svg#${iconName}"></use></svg><span>${text}</span>`;
        link.title = text; // Tooltip hinzufügen
        if (url === '#') link.addEventListener('click', e => e.preventDefault());
        item.appendChild(link);
        const dropdown = document.createElement('div');
        dropdown.className = dropdownCssClass + '-attached';
        dropdown.dataset.dropdownKey = dropdownKey;
        items.forEach(si => {
            const l = document.createElement('a');
            l.className = dropdownCssClass.includes('mydealz') ? 'mydealz-dropdown-item' : 'mdplus-dropdown-item';
            l.href = si.url;
            l.textContent = si.name;
            dropdown.appendChild(l);
        });
        dropdownCache[dropdownKey] = dropdown;
        return item;
    }
     // *** createMdPlusDropdownItem mit title Attribut ***
    function createMdPlusDropdownItem() {
        const dropdownKey = 'mdplus';
        const item = document.createElement('div');
        item.className = 'scrollBox-item has-dropdown nav-item-mdplus';
        item.dataset.dropdownKey = dropdownKey;
        const link = document.createElement('a');
        link.className = 'nav-link';
        link.href = "#";
        const iconName = 'bookmark';
        link.innerHTML = `<svg width="18" height="18" class="icon icon--${iconName}"><use xlink:href="/assets/img/ico_f3562.svg#${iconName}"></use></svg><span>MD+</span>`;
        link.title = "MD+"; // Tooltip hinzufügen
        link.addEventListener('click', (e) => e.preventDefault());
        item.appendChild(link);
        const dropdown = document.createElement('div');
        dropdown.className = 'mdplus-dropdown-attached';
        dropdown.dataset.dropdownKey = dropdownKey;
        dropdown.innerHTML = '<span style="padding:10px 16px; display: block; color: #888;">Lade...</span>';
        dropdownCache[dropdownKey] = dropdown;
        return item;
    }

    function showDropdown(triggerItem) {
        clearTimeout(hideTimeout);
        const key = triggerItem.dataset.dropdownKey;
        const dropdownElement = dropdownCache[key];
        if (!dropdownElement) { console.error(`[NavScript] Dropdown element not found for key: ${key}`); return; }
        if (currentVisibleDropdown && currentVisibleDropdown !== dropdownElement) { hideDropdown(currentVisibleDropdown); }
        const rect = triggerItem.getBoundingClientRect();
        dropdownElement.style.top = `${rect.bottom}px`;
        dropdownElement.style.left = `${rect.left}px`;
         const dropdownRight = rect.left + dropdownElement.offsetWidth;
        if (dropdownRight > window.innerWidth) {
            dropdownElement.style.left = `${window.innerWidth - dropdownElement.offsetWidth - 10}px`; // 10px Puffer
        }

        if (key === 'mdplus') { updateMDPlusDropdown(dropdownElement); }
        if (!dropdownElement.parentNode) { document.body.appendChild(dropdownElement); }
         requestAnimationFrame(() => {
             dropdownElement.classList.add('dropdown-visible');
        });
        currentVisibleDropdown = dropdownElement;
        if (!dropdownElement.hasAttribute('data-listeners-attached')) {
             dropdownElement.addEventListener('mouseenter', () => { clearTimeout(hideTimeout); });
             dropdownElement.addEventListener('mouseleave', () => { startHideTimeout(dropdownElement); });
             dropdownElement.setAttribute('data-listeners-attached', 'true');
        }
    }
    function hideDropdown(dropdownElement) {
        if (dropdownElement) {
            dropdownElement.classList.remove('dropdown-visible');
            if (dropdownElement.parentNode === document.body) {
                 setTimeout(() => {
                     // Nur entfernen, wenn es immer noch versteckt ist und im body hängt
                     if (!dropdownElement.classList.contains('dropdown-visible') && dropdownElement.parentNode === document.body) {
                         const currentCachedElement = dropdownCache[dropdownElement.dataset.dropdownKey];
                         if (currentCachedElement === dropdownElement) {
                            document.body.removeChild(dropdownElement);
                         }
                     }
                 }, 200); // Zeit muss länger sein als die CSS-Transition-Dauer
            }
            if (currentVisibleDropdown === dropdownElement) { currentVisibleDropdown = null; }
        }
    }
    function startHideTimeout(elementToHide = currentVisibleDropdown) {
        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => {
            hideDropdown(elementToHide);
        }, 300); // Verzögerung bevor das Dropdown verschwindet
    }

    function replaceSubNav() {
        if (subNavReplaced) return;
        // Suche nach dem potentiellen .scrollBox Wrapper UND dem .scrollBox-container darin
        const scrollBoxWrapper = document.querySelector('header .subNav--light .scrollBox');
        const subNavContainer = document.querySelector('header .subNav--light .scrollBox-container');
        const targetContainer = scrollBoxWrapper ? scrollBoxWrapper : subNavContainer?.parentNode; // Nimm den Wrapper, wenn er existiert, sonst den direkten Parent

        if (!targetContainer || targetContainer.querySelector('.scrollBox-container[data-nav-modified="true"]')) {
            //console.log("[NavScript] Target container not found or already modified.");
            return;
        }

        const originalScrollBoxContainer = targetContainer.querySelector('.scrollBox-container');
        if (!originalScrollBoxContainer) {
             console.log("[NavScript] Original scrollBox-container not found inside target.");
             return;
        }


        console.log("[NavScript] Found target container, replacing content...");
        dropdownCache = {}; // Reset cache bei Neuaufbau
        const newNav = document.createElement('div');
        newNav.className = 'scrollBox-container'; // Behält die Originalklasse für eventuelle Basisstyles bei
        newNav.dataset.navModified = 'true'; // Markierung, dass das Skript aktiv war

        // Menüpunkte
        newNav.appendChild(createDropdownItem("Kategorien", "/gruppe/", "categories", "kategorien", "mydealz-dropdown", categoryTree));
        newNav.appendChild(createDropdownItem("Gutscheine", "/gutscheine/", "voucher", "gutscheine", "mydealz-dropdown", vouchers));
        newNav.appendChild(createNavItem("Deals", "/deals-new", "tag"));
        newNav.appendChild(createNavItem("Freebies", "/gruppe/freebies?temperatureFrom=any", "gift"));
        newNav.appendChild(createNavItem("Diskussionen", "/diskussion", "comments"));
        newNav.appendChild(createNavItem("Feedback", "/feedback", "campaign"));
        newNav.appendChild(createNavItem("Sammlung", "/2035404#comments", "cake"));
        newNav.appendChild(createMdPlusDropdownItem());

        try {
            targetContainer.replaceChild(newNav, originalScrollBoxContainer);
            subNavReplaced = true; // Flag setzen
            console.log("[NavScript] Container content replaced. Attaching listeners...");

             newNav.querySelectorAll('.has-dropdown').forEach(item => {
                const dropdown = dropdownCache[item.dataset.dropdownKey];
                if (!dropdown) {
                    console.warn(`[NavScript] Dropdown element for key ${item.dataset.dropdownKey} not in cache after creation.`);
                    return;
                }
                // Mouseenter auf das Menüitem zeigt das Dropdown
                item.addEventListener('mouseenter', () => {
                    showDropdown(item);
                });
                item.addEventListener('mouseleave', () => {
                    startHideTimeout();
                });
            });
            console.log("[NavScript] Item listeners attached.");

        } catch (error) {
            console.error("[NavScript] Error during replace/listeners:", error);
            subNavReplaced = false; // Reset flag on error
        }
    }

    // --- Initialisierung und Beobachtung ---
    function initializeNavigation() {
        replaceSubNav();
    }

    // CSS nur einmal einfügen
    const styleElement = document.createElement('style');
    styleElement.id = 'mydealz-nav-custom-styles';
    if (!document.getElementById(styleElement.id)) {
        styleElement.textContent = customCSS;
        document.head.appendChild(styleElement);
        console.log("[NavScript] CSS injected.");
    }

    let observer = null;
    const parentSelector = 'header .subNav--light';

    function startObserver() {
        const parentNode = document.querySelector(parentSelector);
        if (parentNode && !observer) {
            observer = new MutationObserver((mutationsList, obs) => {
                const modifiedContainer = parentNode.querySelector('.scrollBox-container[data-nav-modified="true"]');
                if (!modifiedContainer) {
                    //console.log("[NavScript Observer] Modified container disappeared. Resetting flag and attempting re-init...");
                    subNavReplaced = false;
                    initializeNavigation();
                } else {
                   Object.values(dropdownCache).forEach(dropdown => {
                       if (dropdown.classList.contains('dropdown-visible') && !dropdown.parentNode) {
                           console.warn("[NavScript Observer] Visible dropdown detached from body. Re-attaching.");
                           // Finde das zugehörige Trigger-Item neu, um Position zu bestimmen
                           const trigger = parentNode.querySelector(`.has-dropdown[data-dropdown-key="${dropdown.dataset.dropdownKey}"]`);
                           if (trigger) {
                               const rect = trigger.getBoundingClientRect();
                               dropdown.style.top = `${rect.bottom}px`;
                               dropdown.style.left = `${rect.left}px`;
                               document.body.appendChild(dropdown);
                           } else {
                               hideDropdown(dropdown);
                           }
                       }
                   });
                }
            });
            observer.observe(parentNode, { childList: true, subtree: true });
            //console.log("[NavScript] MutationObserver started on:", parentSelector);
        } else if (!parentNode) {
            // Falls der Elterncontainer noch nicht da ist, später erneut versuchen
            //console.log("[NavScript] Parent node for observer not found, retrying...");
            setTimeout(startObserver, 500);
        }
    }

    // Startlogik
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initializeNavigation();
            startObserver();
        });
    } else {
        initializeNavigation();
        startObserver();
    }

    setTimeout(initializeNavigation, 750);
    // Evtl. noch späterer Versuch für hartnäckige Fälle
    setTimeout(initializeNavigation, 2000);


    // Listener um Dropdowns zu schließen, wenn außerhalb geklickt wird
    document.addEventListener('click', function(event) {
      if (currentVisibleDropdown && !currentVisibleDropdown.contains(event.target)) {
        let clickedOnTrigger = false;
        document.querySelectorAll('.has-dropdown').forEach(trigger => {
            if (trigger.contains(event.target)) {
                clickedOnTrigger = true;
            }
        });
        if (!clickedOnTrigger) {
            hideDropdown(currentVisibleDropdown);
        }
      }
    }, true); // Use capture phase


})();