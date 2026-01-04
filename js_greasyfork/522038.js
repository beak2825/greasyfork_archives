// ==UserScript==
// @name         mydealz Manager
// @namespace    http://tampermonkey.net/
// @version      1.17.1
// @description  Deals gezielt ausblenden mittels X Button, Filtern nach Händlern und Wörtern im Titel. Teure und kalte Deals ausblenden.
// @author       Flo (https://www.mydealz.de/profile/Basics0119) (https://github.com/9jS2PL5T) & Moritz Baumeister (https://www.mydealz.de/profile/BobBaumeister) (https://github.com/grapefruit89)
// @license      MIT
// @match        https://www.mydealz.de/*
// @match        https://www.preisjaeger.at/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mydealz.de
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/522038/mydealz%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/522038/mydealz%20Manager.meta.js
// ==/UserScript==

// Versions-Änderungen
// 2025-12-04 - v1.17.1
// ADD: Debug-System mit granularen Flags für gezielte Fehlersuche (userBlocking, backup, priceFilter, hideMatchingMerchantNames, criticalErrors, performance.*)
// ADD: Kritisches Error-Monitoring - Warnt automatisch wenn DOM-Selektoren fehlschlagen (z.B. nach mydealz HTML-Änderungen)
// FIX: Benutzerfilter - Blockierte User wurden nicht geprüft (processArticles() hatte keine Überprüfung von blockedUsers)
// FIX: Benutzerfilter - Nutzt jetzt robuste Multi-Selektor-Strategie (data-md-author > Span-Text > userLink) mit Case-insensitive Matching
// FIX: Backup - blockedUsers wurde nicht gesichert (fehlte im Backup-Objekt)
// FIX: Mehrfache Leerzeichen und Non-Breaking-Spaces (\u00A0) im Titel werden korrekt normalisiert und gefiltert
// FIX: Apostroph-Varianten (', ', `) werden zu Standard-Apostroph normalisiert
// CHANGE: Heiße Deals - Wert lässt sich nun mit Enter-Taste übernehmen

//#region --- 1. Initialisierung und Grundeinstellungen ---

// ===== Debug-Konfiguration =====
// Zentraler Debug-Toggle - bei Bedarf auf true setzen
const DEBUG = {
    hideMatchingMerchantNames: false,  // Debug-Logs für Händlernamen-Feature
    priceFilter: false,                // Debug-Logs für Preis-Filter
    userBlocking: false,                // Debug-Logs für User-Blocking
    backup: false,                      // Debug-Logs für Backup/Restore
    criticalErrors: false,              // Warnt bei fehlgeschlagenen Selektoren

    // Performance Monitoring (granular)
    performance: {
        enabled: false,              // Master-Toggle für alle Performance-Logs
        observer: false,             // MutationObserver Callbacks
        processing: false,           // processArticles() Durchläufe
        filtering: false,            // Filter-Operationen (Wort/Händler/Preis)
        caching: false,              // Cache-Hits/Misses
        domManipulation: false,      // DOM-Updates (Titel, Verstecken)
        timing: false,               // Detaillierte Timing-Messungen
        summary: false,               // Performance-Zusammenfassung (empfohlen)
    },
};

// Initial Debug Check
if (DEBUG.performance.enabled || DEBUG.userBlocking || DEBUG.backup || DEBUG.hideMatchingMerchantNames || DEBUG.priceFilter || DEBUG.criticalErrors) {
    console.log('[MDM] Script loaded, DEBUG flags:', DEBUG);
}

// ===== Performance-Tracking-System =====
class PerformanceTracker {
    constructor() {
        this.metrics = {
            observer: { calls: 0, totalTime: 0, lastCall: null },
            processArticles: { calls: 0, totalTime: 0, articlesProcessed: 0, lastCall: null },
            filtering: {
                wordFilter: { calls: 0, totalTime: 0, hits: 0 },
                merchantFilter: { calls: 0, totalTime: 0, hits: 0 },
                priceFilter: { calls: 0, totalTime: 0, hits: 0 },
            },
            caching: { hits: 0, misses: 0, size: 0 },
            domUpdates: { titleChanges: 0, hideActions: 0, showActions: 0 },
        };
        this.timers = new Map();
        // Batch-Tracking für aggregierte Logs
        this.currentBatch = {
            caching: { hits: 0, misses: 0, dealIds: { hits: [], misses: [] } },
            domUpdates: { hidden: 0, shown: 0, titleChanges: 0 },
            filtering: { wordMatches: 0, priceExceeded: 0 }
        };
    }

    // Starte einen Timer
    start(label) {
        if (!DEBUG.performance.enabled) return;
        this.timers.set(label, performance.now());
    }

    // Beende einen Timer und gib die Dauer zurück
    end(label) {
        if (!DEBUG.performance.enabled) return 0;
        const startTime = this.timers.get(label);
        if (!startTime) return 0;
        const duration = performance.now() - startTime;
        this.timers.delete(label);
        return duration;
    }

    // Logge eine Metrik
    log(category, subcategory, data = {}) {
        if (!DEBUG.performance.enabled) return;

        const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
        const logData = {
            time: timestamp,
            category,
            subcategory,
            ...data
        };

        // Kategorie-spezifisches Logging
        if (DEBUG.performance[category]) {
            console.log(`[Performance ${timestamp}] ${category}/${subcategory}:`, logData);
        }
    }

    // Aktualisiere Metriken
    update(path, value) {
        const keys = path.split('.');
        let current = this.metrics;
        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]];
        }
        const lastKey = keys[keys.length - 1];
        if (typeof current[lastKey] === 'number') {
            current[lastKey] += value;
        } else {
            current[lastKey] = value;
        }
    }

    // Zeige Performance-Zusammenfassung
    showSummary() {
        if (!DEBUG.performance.enabled || !DEBUG.performance.summary) return;

        console.group('📊 Performance Summary - mydealz Manager');

        // Observer Stats
        const obs = this.metrics.observer;
        if (obs.calls > 0) {
            console.log('🔍 Observer:', {
                calls: obs.calls,
                avgTime: `${(obs.totalTime / obs.calls).toFixed(2)}ms`,
                totalTime: `${obs.totalTime.toFixed(2)}ms`,
            });
        }

        // Processing Stats
        const proc = this.metrics.processArticles;
        if (proc.calls > 0) {
            console.log('⚙️ Article Processing:', {
                runs: proc.calls,
                articlesProcessed: proc.articlesProcessed,
                avgArticlesPerRun: (proc.articlesProcessed / proc.calls).toFixed(1),
                avgTime: `${(proc.totalTime / proc.calls).toFixed(2)}ms`,
                totalTime: `${proc.totalTime.toFixed(2)}ms`,
            });
        }

        // Filter Stats
        const filters = this.metrics.filtering;
        console.log('🔎 Filtering:', {
            wordFilter: {
                calls: filters.wordFilter.calls,
                hits: filters.wordFilter.hits,
                hitRate: filters.wordFilter.calls > 0
                    ? `${((filters.wordFilter.hits / filters.wordFilter.calls) * 100).toFixed(1)}%`
                    : '0%',
                avgTime: filters.wordFilter.calls > 0
                    ? `${(filters.wordFilter.totalTime / filters.wordFilter.calls).toFixed(3)}ms`
                    : '0ms'
            },
            merchantFilter: {
                calls: filters.merchantFilter.calls,
                hits: filters.merchantFilter.hits,
                hitRate: filters.merchantFilter.calls > 0
                    ? `${((filters.merchantFilter.hits / filters.merchantFilter.calls) * 100).toFixed(1)}%`
                    : '0%'
            },
            priceFilter: {
                calls: filters.priceFilter.calls,
                hits: filters.priceFilter.hits,
                hitRate: filters.priceFilter.calls > 0
                    ? `${((filters.priceFilter.hits / filters.priceFilter.calls) * 100).toFixed(1)}%`
                    : '0%'
            }
        });

        // Cache Stats
        const cache = this.metrics.caching;
        const cacheTotal = cache.hits + cache.misses;
        if (cacheTotal > 0) {
            console.log('💾 Cache:', {
                hits: cache.hits,
                misses: cache.misses,
                hitRate: `${((cache.hits / cacheTotal) * 100).toFixed(1)}%`,
                size: cache.size,
            });
        }

        // DOM Updates
        const dom = this.metrics.domUpdates;
        console.log('🎨 DOM Updates:', {
            titleChanges: dom.titleChanges,
            hidden: dom.hideActions,
            shown: dom.showActions,
        });

        console.groupEnd();
    }

    // Setze Metriken zurück
    reset() {
        this.metrics = {
            observer: { calls: 0, totalTime: 0, lastCall: null },
            processArticles: { calls: 0, totalTime: 0, articlesProcessed: 0, lastCall: null },
            filtering: {
                wordFilter: { calls: 0, totalTime: 0, hits: 0 },
                merchantFilter: { calls: 0, totalTime: 0, hits: 0 },
                priceFilter: { calls: 0, totalTime: 0, hits: 0 },
            },
            caching: { hits: 0, misses: 0, size: 0 },
            domUpdates: { titleChanges: 0, hideActions: 0, showActions: 0 },
        };
        this.timers.clear();
        console.log('[Performance] ♻️ Metrics reset');
    }

    // Batch-Tracking Methoden
    resetBatch() {
        this.currentBatch = {
            caching: { hits: 0, misses: 0, dealIds: { hits: [], misses: [] } },
            domUpdates: { hidden: 0, shown: 0, titleChanges: 0 },
            filtering: { wordMatches: 0, priceExceeded: 0 }
        };
    }

    logBatch() {
        if (!DEBUG.performance.enabled) return;
        const timestamp = new Date().toISOString().split('T')[1].split('.')[0];

        // Cache Batch Log
        if (DEBUG.performance.caching && (this.currentBatch.caching.hits > 0 || this.currentBatch.caching.misses > 0)) {
            console.log(`[Performance ${timestamp}] caching/batch:`, {
                hits: this.currentBatch.caching.hits,
                misses: this.currentBatch.caching.misses,
                hitRate: `${((this.currentBatch.caching.hits / (this.currentBatch.caching.hits + this.currentBatch.caching.misses)) * 100).toFixed(1)}%`,
                sampleHits: this.currentBatch.caching.dealIds.hits.slice(0, 3),
                sampleMisses: this.currentBatch.caching.dealIds.misses.slice(0, 3)
            });
        }

        // DOM Updates Batch Log
        if (DEBUG.performance.domManipulation && (this.currentBatch.domUpdates.hidden > 0 || this.currentBatch.domUpdates.shown > 0 || this.currentBatch.domUpdates.titleChanges > 0)) {
            console.log(`[Performance ${timestamp}] domManipulation/batch:`, {
                hidden: this.currentBatch.domUpdates.hidden,
                shown: this.currentBatch.domUpdates.shown,
                titleChanges: this.currentBatch.domUpdates.titleChanges
            });
        }

        // Filtering Batch Log
        if (DEBUG.performance.filtering && (this.currentBatch.filtering.wordMatches > 0 || this.currentBatch.filtering.priceExceeded > 0)) {
            console.log(`[Performance ${timestamp}] filtering/batch:`, {
                wordMatches: this.currentBatch.filtering.wordMatches,
                priceExceeded: this.currentBatch.filtering.priceExceeded
            });
        }

        this.resetBatch();
    }
}

// Globale Performance-Tracker-Instanz
const perfTracker = new PerformanceTracker();

// Performance-Summary alle 30 Sekunden (wenn enabled)
if (DEBUG.performance.enabled && DEBUG.performance.summary) {
    setInterval(() => {
        perfTracker.showSummary();
        // Optional: Metriken nach jeder Summary zurücksetzen
        // perfTracker.reset();
    }, 30000);
}

// === Performance-Helper-Funktionen ===
// Manuelles Abrufen der Performance-Summary über Console
(function() {
    'use strict';

    // Definiere Performance-API am globalen window-Objekt
    const api = {
        summary: () => perfTracker.showSummary(),
        reset: () => perfTracker.reset(),
        enable: () => {
            DEBUG.performance.enabled = false;
            console.log('✅ Performance-Tracking aktiviert');
        },
        disable: () => {
            DEBUG.performance.enabled = false;
            console.log('❌ Performance-Tracking deaktiviert');
        },
        enableAll: () => {
            Object.keys(DEBUG.performance).forEach(key => {
                if (typeof DEBUG.performance[key] === 'boolean') {
                    DEBUG.performance[key] = true;
                }
            });
            console.log('✅ Alle Performance-Logs aktiviert');
        },
        disableAll: () => {
            Object.keys(DEBUG.performance).forEach(key => {
                if (typeof DEBUG.performance[key] === 'boolean') {
                    DEBUG.performance[key] = false;
                }
            });
            console.log('❌ Alle Performance-Logs deaktiviert');
        },
        get config() {
            return DEBUG.performance;
        },
        // Hilfsfunktion zum Aktivieren spezifischer Kategorien
        enableCategory: (category) => {
            if (DEBUG.performance.hasOwnProperty(category)) {
                DEBUG.performance[category] = true;
                console.log(`✅ ${category} aktiviert`);
            } else {
                console.warn(`❌ Kategorie "${category}" nicht gefunden`);
            }
        },
        // Zeige verfügbare Kategorien
        categories: () => {
            console.log('📋 Verfügbare Performance-Kategorien:');
            Object.keys(DEBUG.performance).forEach(key => {
                console.log(`  - ${key}: ${DEBUG.performance[key]}`);
            });
        }
    };

    // Setze am globalen window-Objekt
    if (typeof unsafeWindow !== 'undefined') {
        unsafeWindow.mdmPerformance = api;
    } else {
        window.mdmPerformance = api;
    }

    if (DEBUG.performance.enabled) {
        console.log('📊 Performance-Tracking verfügbar: window.mdmPerformance');
        console.log('   Befehle: .enable(), .disable(), .summary(), .reset(), .categories()');
    }
})();

// ===== Konstanten und Konfiguration =====
// --- Storage Keys ---
const VERSION_PREFIX = 'mdm_version_';
const HIDDEN_DEALS_KEY = 'hiddenDeals';
const HIDE_COLD_DEALS_KEY = 'hideColdDeals';
const MAX_PRICE_KEY = 'maxPrice';
const PREFERRED_SORT_KEY = 'mydealz_preferred_sort';
const PREFERRED_TIMEFRAME_KEY = 'mydealz_preferred_timeframe';
const LAST_VERSION_KEY = 'mdm_last_version';
const CHANGELOG_URL = 'https://greasyfork.org/de/scripts/522038-mydealz-manager/versions';
const UPDATE_NOTICE_SHOWN_KEY = 'mdm_update_notice_shown';

// --- Selektoren ---
const ARTICLE_SELECTOR = '.thread--deal, .thread--type--list';
const MERCHANT_PAGE_SELECTOR = '.merchant-banner';

const FEED_CONTAINER_SELECTORS = [
    '[data-t="threadList"]',
    '.threadList',
    '.thread-list',
    '.itemList',
    '#content'
];

// Text Normalisierung Map für Sonderzeichen
const CHAR_NORMALIZATION_MAP = {
    'ä': 'a', 'á': 'a', 'à': 'a', 'â': 'a', 'ã': 'a',
    'ö': 'o', 'ó': 'o', 'ò': 'o', 'ô': 'o', 'õ': 'o',
    'ü': 'u', 'ú': 'u', 'ù': 'u', 'û': 'u',
    'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
    'í': 'i', 'ì': 'i', 'î': 'i', 'ï': 'i',
    'ý': 'y', 'ÿ': 'y',
    'ñ': 'n',
    'ß': 'ss'
};

function normalizeForSearch(text) {
    if (!text) return '';

    // Zu Lowercase konvertieren
    let normalized = text.toLowerCase();

    // Non-breaking Spaces und andere unsichtbare Zeichen zu normalen Spaces konvertieren
    // Dies behandelt &nbsp; (\u00A0) und andere Unicode-Leerzeichen
    normalized = normalized.replace(/[\u00A0\u202F\u2000-\u200B\u205F\u3000]/g, ' ');

    // Alle Apostroph-Varianten zu normalem Apostroph konvertieren
    // ' (U+2018 Left Single Quotation), ' (U+2019 Right Single Quotation), ` (U+0060 Grave Accent)
    normalized = normalized.replace(/[\u2018\u2019\u0060]/g, "'");

    // Sonderzeichen normalisieren
    normalized = normalized.split('').map(char => CHAR_NORMALIZATION_MAP[char] || char).join('');

    // Unicode normalisieren (NFD) und dann alle diakritischen Zeichen entfernen
    normalized = normalized.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // Mehrfache Leerzeichen zu einem Leerzeichen reduzieren
    normalized = normalized.replace(/\s+/g, ' ').trim();

    return normalized;
}

function findDealContainer() {
    for (const selector of FEED_CONTAINER_SELECTORS) {
        const element = document.querySelector(selector);
        if (element) return element;
    }

    const firstArticle = document.querySelector(ARTICLE_SELECTOR);
    return firstArticle?.parentElement ?? null;
}

function isDealNode(node) {
    if (!node) return false;

    if (node.nodeType === 1) { // ELEMENT_NODE
        if (node.matches?.(ARTICLE_SELECTOR)) return true;
        if (node.querySelector?.(ARTICLE_SELECTOR)) return true;
    }

    if (node.nodeType === 11) { // DOCUMENT_FRAGMENT_NODE
        return !!node.querySelector?.(ARTICLE_SELECTOR);
    }

    return false;
}

function mutationsAffectDeals(mutations) {

    // Schnelle Prüfung ohne Array-Konvertierung
    for (const mutation of mutations) {
        if (mutation.type !== 'childList') continue;

        // Direkte NodeList/HTMLCollection Prüfung
        if (mutation.addedNodes.length) {
            for (const node of mutation.addedNodes) {
                if (isDealNode(node)) {
                    return true;
                }
            }
        }

        if (mutation.removedNodes.length) {
            for (const node of mutation.removedNodes) {
                if (isDealNode(node)) {
                    return true;
                }
            }
        }

        // Effiziente Target-Prüfung
        const target = mutation.target;
        if (target?.closest?.(ARTICLE_SELECTOR)) {
            return true;
        }
    }

    return false;
}

const observerTargets = new WeakMap();

function observeDealMutations(observerInstance) {
    // Suche primär nach dem Deal-Container
    const target = findDealContainer();
    if (!target) return;

    const currentTarget = observerTargets.get(observerInstance);
    if (currentTarget === target) return;

    // Beobachter nur neu verbinden wenn nötig
    observerInstance.disconnect();
    observerInstance.observe(target, {
        childList: true,
        subtree: true
    });
    observerTargets.set(observerInstance, target);
}

// --- System/Performance Konstanten ---
const CLEANUP_TIME = 30000;
const IS_TOUCH_DEVICE = ('ontouchstart' in window) ||
      (navigator.maxTouchPoints > 0) ||
      (navigator.msMaxTouchPoints > 0);

let excludeWordCache = [];

let excludeMerchantsCache = {
    ids: new Set(),
    normalizedNames: new Set()
};

function rebuildExcludeMerchantCache(merchants) {
    const list = Array.isArray(merchants) ? merchants : [];

    excludeMerchantsCache.ids = new Set(
        list
            .map(merchant => merchant?.id)
            .filter(id => id !== undefined && id !== null)
            .map(id => String(id))
    );

    excludeMerchantsCache.normalizedNames = new Set(
        list
            .map(merchant => normalizeForSearch(merchant?.name || ''))
            .filter(Boolean)
    );
}

function getArticleMerchantInfo(article) {
    if (!article) {
        return { merchantId: null, merchantName: null };
    }

    const ids = new Set();
    const dataset = article.dataset || {};
    ['merchantId', 'threadMerchantId', 'merchantid', 'threadmerchantid'].forEach(key => {
        if (dataset[key]) {
            ids.add(dataset[key]);
        }
    });

    ['data-merchant-id', 'data-thread-merchant-id', 'data-thread-merchantid'].forEach(attr => {
        const value = article.getAttribute?.(attr);
        if (value) {
            ids.add(value);
        }
    });

    const merchantLink = article.querySelector?.('a[data-t="merchantLink"]') || null;
    if (merchantLink) {
        const linkDataset = merchantLink.dataset || {};
        ['merchantId', 'merchantid', 'tMerchantId', 'tmerchantid'].forEach(key => {
            if (linkDataset[key]) {
                ids.add(linkDataset[key]);
            }
        });

        const href = merchantLink.getAttribute('href') || '';
        const match = href.match(/merchant-id=(\d+)/i);
        if (match) {
            ids.add(match[1]);
        }
    }

    const merchantName = merchantLink?.textContent?.trim() ||
        article.querySelector?.('.color--text-TranslucentSecondary.size--all-xs span:last-child')?.textContent?.trim() ||
        null;

    const merchantId = ids.size ? String(Array.from(ids)[0]).trim() : null;

    return {
        merchantId: merchantId || null,
        merchantName: merchantName || null
    };
}

function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function createExcludeWordEntry(word) {
    if (typeof word !== 'string' || !word.trim()) return null;

    const normalized = normalizeForSearch(word);
    if (!normalized) return null;

    if (normalized.startsWith('[') && normalized.endsWith(']')) {
        return {
            original: word,
            type: 'bracket',
            normalized,
            matcher: title => title.includes(normalized)
        };
    }

    if (normalized.includes('+')) {
        return {
            original: word,
            type: 'plus',
            normalized,
            matcher: title => title.includes(normalized)
        };
    }

    if (normalized.includes(' ') || normalized.includes('-')) {
        const parts = normalized.split(' ').filter(Boolean);
        const firstWord = parts[0] || normalized;
        const firstWordRegex = new RegExp(`\\b${escapeRegex(firstWord)}\\b`, 'i');
        return {
            original: word,
            type: 'phrase',
            normalized,
            firstWordRegex,
            matcher: title => {
                if (firstWordRegex && !firstWordRegex.test(title)) {
                    return false;
                }
                return title.includes(normalized);
            }
        };
    }

    const regex = new RegExp(`\\b${escapeRegex(normalized)}\\b`, 'i');
    return {
        original: word,
        type: 'simple',
        normalized,
        regex,
        matcher: title => regex.test(title)
    };
}

function rebuildExcludeWordCache(words) {
    const list = Array.isArray(words) ? words : [];
    excludeWordCache = list
        .map(createExcludeWordEntry)
        .filter(Boolean);
}

// --- Feature Flags ---
const FEATURES = {
    hideMatchingMerchantNames: 'hideMatchingMerchantNames',
    hideShareButtons: 'hideShareButtons',
    rememberSort: 'rememberSort'
};

// ===== Instanzerkennung und Cleanup =====
(function detectMultipleInstances() {
    const currentVersion = GM_info.script.version;
    const now = Date.now();

    try {
        // Setze Marker für diese Version
        const myKey = VERSION_PREFIX + currentVersion;
        localStorage.setItem(myKey, now.toString());

        // Prüfe auf alle aktiven Versionen
        const activeVersions = new Set();
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (!key?.startsWith(VERSION_PREFIX)) continue;

            const version = key.replace(VERSION_PREFIX, '');
            const timestamp = parseInt(localStorage.getItem(key) || '0');

            if ((now - timestamp) < CLEANUP_TIME) {
                activeVersions.add(version);
            }
        }

        if (activeVersions.size > 1) {
            const warningMsg = `⚠️ Warnung: Es wurden mehrere Versionen des mydealz Managers gefunden!\n\nAktive Versionen:\n${Array.from(activeVersions).join('\n')}\n\nBitte deaktiviere alle Versionen bis auf eine in deinem Script-Manager.`;
            alert(warningMsg);
        }
    } catch (e) {
        console.error('Error in instance detection:', e);
    }
})();

(function notifyOnUpdate() {
    const currentVersion = GM_info?.script?.version ?? 'unbekannt';

    try {
        const previousGMVersion = GM_getValue(LAST_VERSION_KEY, null);
        const previousLSVersion = localStorage.getItem(LAST_VERSION_KEY);
        const previousVersion = previousGMVersion || previousLSVersion;

        // Wenn es keine vorherige Version gibt oder sich die Version geändert hat
        if (!previousVersion || previousVersion !== currentVersion) {
            // Setze Flag dass Update-Hinweis angezeigt werden soll
            GM_setValue(UPDATE_NOTICE_SHOWN_KEY, false);
        }

        GM_setValue(LAST_VERSION_KEY, currentVersion);
        localStorage.setItem(LAST_VERSION_KEY, currentVersion);
    } catch (error) {
        console.error('Update-Check konnte nicht ausgeführt werden:', error);
    }
})();

// Cleanup beim Entladen der Seite
window.addEventListener('unload', () => {
    try {
        localStorage.removeItem(VERSION_PREFIX + GM_info.script.version);
    } catch (e) {
        // Ignoriere Fehler beim Cleanup
    }
});

// ===== UI-Ressourcen =====
// --- Font Awesome Einbindung ---
const fontAwesomeLink = document.createElement('link');
fontAwesomeLink.rel = 'stylesheet';
fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
document.head.appendChild(fontAwesomeLink);

// --- Style Elemente ---
const preventAutoCloseStyle = document.createElement('style');
preventAutoCloseStyle.textContent = ``;
document.head.appendChild(preventAutoCloseStyle);

const managerHideStyle = document.createElement('style');
managerHideStyle.textContent = `.mydealz-manager-hidden, article[data-hidden-by-mydealz-manager="true"] { display: none !important; }`;
document.head.appendChild(managerHideStyle);

// ===== UI-Konfiguration =====
// --- Titel-Speicher ---
const ORIGINAL_TITLES = new Map();

// ===== Observer-Konfiguration =====
let processingScheduled = false;

const observer = new MutationObserver(throttle((mutations) => {
    perfTracker.start('observer');
    perfTracker.update('observer.calls', 1);

    if (DEBUG.performance.observer) {
        perfTracker.log('observer', 'triggered', {
            mutationCount: mutations.length,
            types: mutations.map(m => m.type).join(', ')
        });
    }

    // Schnelle Vorprüfung auf relevante Änderungen
    if (!mutations.some(m => m.type === 'childList')) {
        const duration = perfTracker.end('observer');
        if (DEBUG.performance.observer) {
            perfTracker.log('observer', 'skipped-no-childList', { duration: `${duration.toFixed(2)}ms` });
        }
        return;
    }

    observeDealMutations(observer);
    if (!mutationsAffectDeals(mutations)) {
        const duration = perfTracker.end('observer');
        if (DEBUG.performance.observer) {
            perfTracker.log('observer', 'skipped-no-deals', { duration: `${duration.toFixed(2)}ms` });
        }
        return;
    }

    // Verhindere doppelte Verarbeitung
    if (processingScheduled) {
        const duration = perfTracker.end('observer');
        if (DEBUG.performance.observer) {
            perfTracker.log('observer', 'skipped-already-scheduled', { duration: `${duration.toFixed(2)}ms` });
        }
        return;
    }

    processingScheduled = true;

    // Verzögerte Verarbeitung um mehrere Änderungen zu bündeln
    requestAnimationFrame(() => {
        processArticles();
        addSettingsButton();
        addHideButtons();

        processingScheduled = false;

        const duration = perfTracker.end('observer');
        perfTracker.update('observer.totalTime', duration);

        if (DEBUG.performance.observer) {
            perfTracker.log('observer', 'completed', { duration: `${duration.toFixed(2)}ms` });
        }
    });
}, 1500, { leading: true, trailing: true }));

// ===== UI-Zustand =====
// --- Hauptfenster ---
let isSettingsOpen = false;
let activeSubUI = null;
let dealThatOpenedSettings = null;

// --- UI-Elemente ---
let settingsDiv = null;
let merchantListDiv = null;
let wordsListDiv = null;
let blockedUsersDiv = null;
let uiClickOutsideHandler = null;

// ===== Filter-Zustand =====
// --- Ausschlusslisten ---
let excludeWords = [];
let excludeMerchantIDs = [];
let hiddenDeals = [];

// --- Filter-Einstellungen ---
let hideColdDeals = localStorage.getItem(HIDE_COLD_DEALS_KEY) === 'true';
let maxPrice = parseFloat(localStorage.getItem(MAX_PRICE_KEY)) || 0;

// ===== Temporäre Daten =====
// --- Vorschläge ---
let suggestedWords = [];
let suggestionClickHandler = null;

// ===== Menü-Commands =====
// --- Command IDs ---
let menuCommandId;
let restoreCommandId;

// --- Feature-Flags ---
let hideMatchingMerchantNames = GM_getValue('hideMatchingMerchantNames', false);
localStorage.setItem('hideMatchingMerchantNames', hideMatchingMerchantNames.toString());
let hideShareButtons = GM_getValue('hideShareButtons', false);
localStorage.setItem('hideShareButtons', hideShareButtons.toString());

// --- Temporäre Listen ---
let recentHiddenDeals = [];
//#endregion




//#region --- 2. Hilfsfunktionen (Utility Functions) ---
// ===== HTML & Text Verarbeitung =====
// HTML dekodieren
function decodeHtml(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
}

// Regex-Sonderzeichen escapen
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ===== Performance Optimierung =====
// Funktion zur Begrenzung der Ausführungshäufigkeit (Throttling)
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
                return false;
            }, limit);
        }
    }
}

// Liefert Theme-spezifische Farben basierend auf aktuellem Theme
function getThemeColors() {
    // Theme-Erkennung inline
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const htmlElement = document.documentElement;
    const bodyElement = document.body;

    const isDark =
          htmlElement.classList.contains('dark') ||
          bodyElement.classList.contains('dark') ||
          htmlElement.getAttribute('data-theme') === 'dark' ||
          document.querySelector('html[data-theme="dark"]') !== null ||
          (prefersDark && !htmlElement.classList.contains('light'));

    // Direkt die entsprechenden Farben zurückgeben
    return isDark ? THEME_COLORS.dark : THEME_COLORS.light;
}

// === Text-Analyse ===
// Wörter aus Deal-Titel extrahieren
function getWordsFromTitle(deal) {
    const titleElement = deal.querySelector('.thread-title a');
    if (!titleElement) return [];

    const rawTitle = titleElement.querySelector('a')?.getAttribute('title') || titleElement.innerText || '';

    const keepWords = ['von', 'der', 'die', 'das', 'bei', 'mit', 'und', 'oder', 'auf', 'für', 'durch', 'bis', 'ab'];
    const ignoreWords = [
        'Euro', 'EUR', 'VSK', '€', 'VGP', 'cent', 'Cent',
        'o.', // oder
        'z.B.', 'z.b.', // zum Beispiel
        'inkl.', // inklusive
        'max.', // maximal
        'min.', // minimal
        'ca.', // circa
        'vs.', // versus
        'eff.', // effektiv
        'mtl.', // monatlich
        'bzw.', // beziehungsweise
        'evtl.', // eventuell
        'uvm.', // und vieles mehr
        'etc.', // et cetera
        'zzgl.', // zuzüglich
        'Nr.', 'nr.', // Nummer
        'St.', 'st.', // Stück
        'usw.', // und so weiter
        'u.a.', // unter anderem
        'u.U.', // unter Umständen
        'ggf.', // gegebenenfalls
        'p.', // pro/per
    ];
    const ignoreChars = ['&', '+', '!', '-', '/', '%', '–'];
    const units = ['MB/s', 'GB/s', 'KB/s', 'Mbit/s', 'Gbit/s', 'Kbit/s'];
    const priceContextWords = ['effektiv'];
    const specialBrands = ['RTL+'];

    const isDate = (word) => {
        return /^\d{1,2}[.,]\d{1,2}(?:[.,]\d{2,4})?$/.test(word);
    };

    const isPriceContext = (word) => {
        if (!priceContextWords.includes(word.toLowerCase())) return false;
        // Prüfe ob im Titel ein Preis vorkommt
        const hasPricePattern = /\d+(?:[.,]\d{2})?(?:€|EUR|Euro)/i;
        return hasPricePattern.test(rawTitle);
    };

    const isPrice = (word) => {
        return /^~?\d+(?:[.,]\d{2})?(?:€|EUR)?$/.test(word) ||
            /^\d+(?:[.,]\d{2})?(?:\s*cent|\s*Cent)$/i.test(word);
    };

    const isPercentage = (word) => {
        return /^\d+\s*%?$/.test(word) && rawTitle.includes('%');
    };

    const cleanWord = (word) => {
        // Check for special brands first
        if (specialBrands.includes(word)) {
            return word;
        }

        // Rest of the existing cleanWord function
        if (units.some(unit => word.includes(unit))) {
            const cleanedWord = word.trim();
            return cleanedWord.replace(/[,;:!?.]+$/, '');
        }

        return word
            .trim()
            .replace(/^[^a-zA-Z0-9äöüÄÖÜß]+|[^a-zA-Z0-9äöüÄÖÜß]+$/g, '')
            .replace(/^[&+!%–]+$/, '')
            .replace(/[-,]+$/, '');
    };

    const shouldKeepWord = (word) => {
        const lowerWord = word.toLowerCase();

        if (!word || word.length === 0) return false;
        if (ignoreChars.includes(word)) return false;
        if (ignoreWords.some(ignore => ignore.toLowerCase() === lowerWord)) return false;
        if (isDate(word)) return false;
        if (isPrice(word)) return false;
        if (isPercentage(word)) return false;
        if (isPriceContext(word)) return false;

        // Behalte spezielle Wörter
        if (keepWords.includes(lowerWord)) return true;
        if (units.some(unit => word === unit)) return true;

        return true;
    };

    const splitTitle = (title) => {
        // Temporär Einheiten und Abkürzungen schützen
        let tempTitle = title;
        const replacements = new Map();

        // Erst die Einheiten schützen
        units.forEach((unit, index) => {
            const placeholder = `__UNIT${index}__`;
            while (tempTitle.includes(unit)) {
                tempTitle = tempTitle.replace(unit, placeholder);
                replacements.set(placeholder, unit);
            }
        });

        // Dann die Abkürzungen schützen (z.B. "o." als ganzes Wort)
        ignoreWords.forEach((word, index) => {
            if (word.includes('.')) {
                const placeholder = `__ABBR${index}__`;
                // Verbesserte Regex für Abkürzungen, die auch Zahlen berücksichtigt
                const regex = new RegExp(`\\b${word.replace('.', '\\.')}\\s*(?=\\d|\\s|$)`, 'g');
                while (regex.test(tempTitle)) {
                    tempTitle = tempTitle.replace(regex, (match) => {
                        const replacement = ' '; // Ersetze Abkürzung durch Leerzeichen
                        return replacement;
                    });
                }
            }
        });

        // Split und Platzhalter wiederherstellen
        return tempTitle
            .split(/[\s\/]+/)
            .map(word => {
            replacements.forEach((original, placeholder) => {
                if (word.includes(placeholder)) {
                    word = word.replace(placeholder, original);
                }
            });
            return word;
        })
            .filter(word => word.length > 0); // Entferne leere Strings
    };

    return splitTitle(rawTitle)
        .map(cleanWord)
        .filter(shouldKeepWord)
        .filter((word, index, self) => self.indexOf(word) === index);
}

//#endregion




//#region --- 3. Datenverwaltung ---
// ===== Einstellungen laden/speichern =====
// Laden aller gespeicherten Einstellungen
function loadSettings() {
    // Lade Wortfilter und Händlerfilter
    excludeWords = loadExcludeWords();
	rebuildExcludeWordCache(excludeWords);
    const merchantsData = loadExcludeMerchants();
    excludeMerchantIDs = merchantsData.map(m => m.id);
    rebuildExcludeMerchantCache(merchantsData);

    // Lade Preisfilter
    maxPrice = parseFloat(GM_getValue('maxPrice', 0)) || 0;

    // Lade UI-Einstellungen
    hideColdDeals = GM_getValue('hideColdDeals', false);

    hideMatchingMerchantNames = GM_getValue('hideMatchingMerchantNames', false);
    localStorage.setItem('hideMatchingMerchantNames', hideMatchingMerchantNames.toString());
    window.hideMatchingMerchantNames = hideMatchingMerchantNames;

    // Lade Share Button Einstellung
    hideShareButtons = GM_getValue('hideShareButtons', false);
    localStorage.setItem('hideShareButtons', hideShareButtons.toString());
    window.hideShareButtons = hideShareButtons;

    // Lade versteckte Deals
    hiddenDeals = GM_getValue('hiddenDeals', []);

    // Lade Sortierungsspeicher-Einstellung
    window.rememberSort = GM_getValue('rememberSort', true);
    localStorage.setItem('rememberSort', window.rememberSort.toString());

}

const combinedObserver = new MutationObserver(throttle((mutations) => {
    observeDealMutations(combinedObserver);
    if (!mutationsAffectDeals(mutations)) return;

    processArticles();
    addSettingsButton();
    addHideButtons();

}, 250));

// Observer starten
observeDealMutations(combinedObserver);

// Storage-Synchronisation zwischen GM und localStorage
async function syncStorage() {
    // Prüfe ob Migration bereits durchgeführt wurde
    const migrationComplete = GM_getValue('migrationComplete', false);

    // Lese Daten aus beiden Speichern
    const gmExcludeWords = GM_getValue('excludeWords', null);
    const gmExcludeMerchants = GM_getValue('excludeMerchantsData', null);
    const gmHiddenDeals = GM_getValue('hiddenDeals', null);
    const gmHideColdDeals = GM_getValue('hideColdDeals', null);
    const gmMaxPrice = GM_getValue('maxPrice', null);

    const lsExcludeWords = JSON.parse(localStorage.getItem('excludeWords') || 'null');
    const lsExcludeMerchants = JSON.parse(localStorage.getItem('excludeMerchantsData') || 'null');
    const lsHiddenDeals = JSON.parse(localStorage.getItem('hiddenDeals') || 'null');
    const lsHideColdDeals = localStorage.getItem('hideColdDeals') || 'null';
    const lsMaxPrice = localStorage.getItem('maxPrice') || 'null';

    let migrationPerformed = false;

    // Migriere Wörter
    const effectiveWords = gmExcludeWords || lsExcludeWords || [];
    if (effectiveWords.length > 0) {
        GM_setValue('excludeWords', effectiveWords);
        localStorage.setItem('excludeWords', JSON.stringify(effectiveWords));
        excludeWords = effectiveWords;
		rebuildExcludeWordCache(excludeWords);
        migrationPerformed = true;
    }

    // Migriere Händler
    const effectiveMerchants = gmExcludeMerchants || lsExcludeMerchants || [];
    if (effectiveMerchants.length > 0) {
        GM_setValue('excludeMerchantsData', effectiveMerchants);
        excludeMerchantIDs = effectiveMerchants.map(m => m.id);
        GM_setValue('excludeMerchantIDs', excludeMerchantIDs);
        localStorage.setItem('excludeMerchantsData', JSON.stringify(effectiveMerchants));
        rebuildExcludeMerchantCache(effectiveMerchants);
        migrationPerformed = true;
    }

    // Migriere versteckte Deals
    const effectiveHiddenDeals = gmHiddenDeals || lsHiddenDeals || [];
    if (effectiveHiddenDeals.length > 0) {
        GM_setValue('hiddenDeals', effectiveHiddenDeals);
        localStorage.setItem('hiddenDeals', JSON.stringify(effectiveHiddenDeals));
        hiddenDeals = effectiveHiddenDeals;
        migrationPerformed = true;
    }

    // Migriere Einstellungen
    if (!migrationComplete) {
        if (gmHideColdDeals !== null || lsHideColdDeals !== 'null') {
            const effectiveHideColdDeals = gmHideColdDeals ?? (lsHideColdDeals === 'true');
            GM_setValue('hideColdDeals', effectiveHideColdDeals);
            localStorage.setItem('hideColdDeals', effectiveHideColdDeals.toString());
            hideColdDeals = effectiveHideColdDeals;
            migrationPerformed = true;
        }

        if (gmMaxPrice !== null || lsMaxPrice !== 'null') {
            const effectiveMaxPrice = gmMaxPrice || lsMaxPrice;
            GM_setValue('maxPrice', effectiveMaxPrice);
            localStorage.setItem('maxPrice', effectiveMaxPrice);
            maxPrice = parseFloat(effectiveMaxPrice);
            migrationPerformed = true;
        }

        // rememberSort
        const gmRememberSort = GM_getValue('rememberSort', null);
        const lsRememberSort = localStorage.getItem('rememberSort') === 'true';
        const effectiveRememberSort = gmRememberSort !== null ? gmRememberSort : lsRememberSort;
        GM_setValue('rememberSort', effectiveRememberSort);
        localStorage.setItem('rememberSort', effectiveRememberSort.toString());
        window.rememberSort = effectiveRememberSort;

        // hideMatchingMerchantNames
        const gmHideMatchingMerchantNames = GM_getValue('hideMatchingMerchantNames', null);
        const lsHideMatchingMerchantNames = localStorage.getItem('hideMatchingMerchantNames') === 'true';
        const effectiveHideMatchingMerchantNames = gmHideMatchingMerchantNames !== null ?
              gmHideMatchingMerchantNames : lsHideMatchingMerchantNames;
        GM_setValue('hideMatchingMerchantNames', effectiveHideMatchingMerchantNames);
        localStorage.setItem('hideMatchingMerchantNames', effectiveHideMatchingMerchantNames.toString());
        window.hideMatchingMerchantNames = effectiveHideMatchingMerchantNames;

        // hideShareButtons
        const gmHideShareButtons = GM_getValue('hideShareButtons', null);
        const lsHideShareButtons = localStorage.getItem('hideShareButtons') === 'true';
        const effectiveHideShareButtons = gmHideShareButtons !== null ?
              gmHideShareButtons : lsHideShareButtons;
        GM_setValue('hideShareButtons', effectiveHideShareButtons);
        localStorage.setItem('hideShareButtons', effectiveHideShareButtons.toString());
        window.hideShareButtons = effectiveHideShareButtons;

        migrationPerformed = true;
    }

    // Markiere Migration als abgeschlossen nur wenn tatsächlich Daten migriert wurden
    if (migrationPerformed) {
        GM_setValue('migrationComplete', true);
    }
}

// ===== Wortfilter-Verwaltung =====
// Speichern von Wortfiltern
function saveExcludeWords(words) {
    // Normalisiere Groß-/Kleinschreibung und entferne Duplikate
    const normalizedWords = words.reduce((acc, word) => {
        const lowerWord = word.toLowerCase();
        const exists = acc.some(w => w.toLowerCase() === lowerWord);
        if (!exists) {
            acc.push(word);
        }
        return acc;
    }, []);

    excludeWords = normalizedWords;
    rebuildExcludeWordCache(excludeWords);

    // Cache leeren wenn Filter sich ändern
    processedDealsCache.clear();

    GM_setValue('excludeWords', normalizedWords);
    localStorage.setItem('excludeWords', JSON.stringify(normalizedWords));
}

// Laden von Wortfiltern
function loadExcludeWords() {
    // Load from GM storage
    const gmWords = GM_getValue('excludeWords', []);

    // Load from localStorage
    let lsWords = [];
    try {
        lsWords = JSON.parse(localStorage.getItem('excludeWords') || '[]');
    } catch (e) {
    }

    // Show final result
    const result = gmWords.length > 0 ? gmWords : lsWords;

    return result;
}

// ===== Deal-Verwaltung =====
// Speichern ausgeblendeter Deals
function saveHiddenDeals() {
    GM_setValue('hiddenDeals', hiddenDeals);
    localStorage.setItem('hiddenDeals', JSON.stringify(hiddenDeals));
}

// ===== Händler-Verwaltung =====
// Speichern von Händlerfiltern
function saveExcludeMerchants(merchantsData) {
    const validMerchants = merchantsData.filter(m =>
                                                m && typeof m.id !== 'undefined' && m.id !== null &&
                                                typeof m.name !== 'undefined' && m.name !== null
                                               );
    const ids = validMerchants.map(m => m.id);

    GM_setValue('excludeMerchantIDs', ids);
    GM_setValue('excludeMerchantsData', validMerchants);
    localStorage.setItem('excludeMerchantsData', JSON.stringify(validMerchants));

    // Cache leeren wenn Händler-Filter sich ändern
    processedDealsCache.clear();

    excludeMerchantIDs = ids;
    rebuildExcludeMerchantCache(validMerchants);
}

// Laden von Händlerfiltern
function loadExcludeMerchants() {
    const merchantsData = GM_getValue('excludeMerchantsData', []);
    const legacyIds = GM_getValue('excludeMerchantIDs', []);

    // Filter out invalid entries
    const validMerchants = merchantsData.filter(m =>
                                                m &&
                                                typeof m.id !== 'undefined' &&
                                                m.id !== null &&
                                                typeof m.name !== 'undefined' &&
                                                m.name !== null
                                               );

    // Convert legacy IDs if needed
    if (validMerchants.length === 0 && legacyIds.length > 0) {
        return legacyIds
            .filter(id => id && typeof id !== 'undefined')
            .map(id => ({ id, name: id }));
    }

    return validMerchants;
}

// ===== Preis-Verwaltung =====
// Speichern des Maximalpreises
function saveMaxPrice(price) {

    // Convert to number if it's a string
    if (typeof price === 'string') {
        price = parseFloat(price.replace(',', '.')) || 0;
    }

    GM_setValue('maxPrice', price);
    localStorage.setItem('maxPrice', price.toString());
    maxPrice = price;
}
//#endregion




//#region --- 4. UI-System ---
// ===== Basis UI-Funktionen =====

// Container, Styles, Theme
function initUIContainers() {
    settingsDiv = document.createElement('div');
    merchantListDiv = document.createElement('div');
    wordsListDiv = document.createElement('div');
    blockedUsersDiv = document.createElement('div');
}

function updateUITheme() {
    const colors = getThemeColors();

    [settingsDiv, merchantListDiv, wordsListDiv].forEach(div => {
        if (div?.parentNode) {
            div.style.background = colors.background;
            div.style.border = `1px solid ${colors.border}`;
            div.style.color = colors.text;

            // Update all buttons and inputs
            div.querySelectorAll('button:not([id*="close"])').forEach(btn => {
                btn.style.background = colors.buttonBg;
                btn.style.border = `1px solid ${colors.buttonBorder}`;
                btn.style.color = colors.text;
            });

            div.querySelectorAll('input').forEach(input => {
                input.style.background = colors.inputBg;
                input.style.border = `1px solid ${colors.border}`;
                input.style.color = colors.text;
            });
        }
    });
}

// === UI-Komponenten ===
// --- Dialog-Erstellung ---
function createSettingsUI() {

    // UI erstellen
    if (isSettingsOpen) {
        return;
    }
    isSettingsOpen = true;

    // Lade versteckte Deals neu
    hiddenDeals = GM_getValue('hiddenDeals', []);

    // Initialize containers
    initUIContainers();

    const colors = getThemeColors();

    // Get merchant info from current deal
    let merchantName = null;
    let showMerchantButton = false;
    let userButtonHTML = '';

    settingsDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 300px;
        height: 300px;
        max-width: 90vw;
        max-height: 90vh;
        background: ${colors.background};
        border: 1px solid ${colors.border};
        border-radius: 5px;
        padding: 8px 15px;
        z-index: 1000;
        color: ${colors.text};
        display: flex;
        flex-direction: column;
    `;

    if (dealThatOpenedSettings) {
        // Merchant Info
        const merchantLink = dealThatOpenedSettings.querySelector('a[data-t="merchantLink"]');
        if (merchantLink) {
            merchantName = merchantLink.textContent.trim();
            showMerchantButton = true;
        }

        // User Info
        const userSpan = dealThatOpenedSettings.querySelector('.overflow--ellipsis.size--all-xs.size--fromW3-s');
        const userName = userSpan?.textContent.match(/Veröffentlicht von\s+(\S+)/)?.[1];

        if (userName) {
            userButtonHTML = `
                <button id="hideUserDealsButton" style="
                	display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px;
                    background: ${colors.buttonBg};
                    border: 1px solid ${colors.buttonBorder};
                    border-radius: 3px;
                    color: ${colors.text};
                    cursor: pointer;
                    width: 100%;
                ">
                    <i class="fas fa-user-slash"></i> <span style="font-weight: bold">${userName}</span>
                </button>
            `;
        }
    }

    // Header
    const header = document.createElement('div');
    header.className = 'accordion-header'; // Klasse für Drag-Funktionalität
    header.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        flex-shrink: 0;
        cursor: move; // Cursor für Drag-Anzeige
        padding: 10px;
        user-select: none;
        background: ${colors.background};
        border-bottom: 1px solid ${colors.border};
    `;

    // Scrollbarer Content-Container
    const contentContainer = document.createElement('div');
    contentContainer.style.cssText = `
        flex-grow: 1;
        overflow-y: auto;
        margin-right: -5px;
        padding-right: 5px;
        margin-bottom: 5px;
        max-height: calc(300px - 60px);
        touch-action: pan-y;
        -webkit-overflow-scrolling: touch;
    `;
    contentContainer.id = 'mdm-settings-content'; // ID hinzufügen für einfacheres Debugging

    const updateNoticeShown = GM_getValue(UPDATE_NOTICE_SHOWN_KEY, true);
    const currentVersion = GM_info?.script?.version ?? 'unbekannt';

    if (!updateNoticeShown) {
        // Hintergrundfarbe abhängig vom Theme (nutze die vorhandene Theme-Erkennung)
        const themeColors = getThemeColors();
        const isDarkTheme = themeColors === THEME_COLORS.dark;
        const updateBgColor = isDarkTheme ? '#2d5a3a' : '#e9f6ec';

        const updateNotice = document.createElement('div');
        updateNotice.style.cssText = `
            margin: 0 0 8px 0;
            padding: 10px;
            background: ${updateBgColor};
            border: 1px solid #32cb5c;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 14px;
            width: 100%;
            box-sizing: border-box;
            cursor: default;
        `;

        updateNotice.innerHTML = `
            <span style="flex-grow: 1; cursor: default;">
                mydealz Manager wurde auf Version ${currentVersion} aktualisiert
            </span>
            <div style="display: flex; align-items: center; gap: 10px;">
                <button id="mdmChangelogBtn" class="button button--type-primary button--mode-default" style="
                    padding: 4px 8px;
                    font-size: 12px;
                    background: #32cb5c;
                    border: 1px solid #32cb5c;
                    border-radius: 4px;
                    color: white;
                    cursor: pointer;
                ">Changelog</button>
                <button id="mdmCloseUpdateBtn" style="
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 4px;
                    display: flex;
                    align-items: center;
                "><i class="fas fa-times"></i></button>
            </div>
        `;

        // Füge Notice zum Content-Container hinzu
        contentContainer.insertBefore(updateNotice, contentContainer.firstChild);

        // Event Handler für Buttons
        const changelogBtn = updateNotice.querySelector('#mdmChangelogBtn');
        const closeUpdateBtn = updateNotice.querySelector('#mdmCloseUpdateBtn');

        if (changelogBtn) {
            changelogBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Verhindere Event-Propagation
                window.open(CHANGELOG_URL, '_blank', 'noopener');
                GM_setValue(UPDATE_NOTICE_SHOWN_KEY, true);
                updateNotice.remove();
            });
        }

        if (closeUpdateBtn) {
            closeUpdateBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Verhindere Event-Propagation
                GM_setValue(UPDATE_NOTICE_SHOWN_KEY, true);
                updateNotice.remove();
            });
        }
    }

    // Accordion-Sektionen definieren und hinzufügen
    const sections = {
        quickActions: createAccordionSection('Schnellaktionen', 'bolt'),
        filter: createAccordionSection('Filter', 'filter'),
        features: createAccordionSection('Funktionen', 'toggle-on'),
        backup: createAccordionSection('Backup', 'save')
    };

    // Quick Actions Section (standardmäßig offen)
    sections.quickActions.content.innerHTML = `
    <div class="section-content" style="display: flex; flex-direction: column; gap: 6px;">
        <!-- Word Input - mit nativer mydealz Suchfeld-Optik -->
        <div style="margin-bottom: 6px;">
            <div style="display: flex; align-items: center; gap: 4px;">
                <div class="search-box" style="
                    flex: 1;
                    position: relative;
                    display: flex;
                    align-items: center;
                    background: ${colors.inputBg};
                    border: 1px solid ${colors.border};
                    border-radius: 8px;
                    padding: 0 8px;
                    height: 36px;
                    transition: all 0.2s ease;
                    overflow: hidden;
                ">
                    <input id="newWordInput"
                        autocomplete="off"
                        ${IS_TOUCH_DEVICE ? 'readonly' : ''}
                        placeholder="Neues Wort..."
                        title="Deals mit hier eingetragenen Wörtern im Titel werden ausgeblendet."
                        style="...">
                </div>
                ${IS_TOUCH_DEVICE ? `
                    <button id="enableKeyboardButton" style="
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 8px;
                        background: ${colors.buttonBg};
                        border: 1px solid ${colors.buttonBorder};
                        border-radius: 3px;
                        color: ${colors.text};
                        cursor: pointer;
                    ">
                        <i class="fas fa-keyboard"></i>
                    </button>
                ` : ''}
                <button id="addWordButton" style="...">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        </div>

            ${showMerchantButton ? `
                <div style="display: flex; align-items: center;">
                    <button id="hideMerchantButton" style="
                        width: 100%;
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        padding: 0;
                        background: none;
                        border: none;
                        color: ${colors.text};
                        cursor: pointer;
                    " title="Blendet alle aktuellen und zukünftigen Deals dieses Händlers aus">
                        <i class="fas fa-store-slash"></i>
                        <span>${merchantName}</span>
                    </button>
                </div>
            ` : ''}

            <!-- Button zum Ausblenden von User-Deals -->
            ${dealThatOpenedSettings ? (() => {
                const userSpan = dealThatOpenedSettings.querySelector('.color--text-TranslucentSecondary.overflow--wrap-off span.overflow--ellipsis');
                const userName = userSpan?.textContent.match(/Veröffentlicht von\s+(\S+)/)?.[1];

                return userName ? `
                    <div style="display: flex; align-items: center;">
                        <button id="hideUserDealsButton" style="
                            width: 100%;
                            display: flex;
                            align-items: center;
                            gap: 12px;
                            padding: 0;
                            background: none;
                            border: none;
                            color: ${colors.text};
                            cursor: pointer;
                        " title="Blendet alle aktuellen und zukünftigen Deals dieses Benutzers aus">
                            <i class="fas fa-user-slash"></i>
                            <span>${userName}</span>
                        </button>
                    </div>
                ` : '';
            })() : ''}

        </div>
    `;

    // Filter Section
    sections.filter.content.innerHTML = `
        <div class="section-content" style="display: flex; flex-direction: column; gap: 6px;">
            <button id="showWordsListButton" class="menu-button">
                <i class="fas fa-list"></i> Wortfilter verwalten
            </button>

            <!-- Separator -->
            <div style="height: 1px; background: ${colors.border}; opacity: 0.3; margin: 4px 0;"></div>

            <button id="showMerchantListButton" class="menu-button">
                <i class="fas fa-store"></i> Händlerfilter verwalten
            </button>

            <!-- Separator -->
            <div style="height: 1px; background: ${colors.border}; opacity: 0.3; margin: 4px 0;"></div>

            <!-- Button für Benutzerfilter -->
            <button id="showBlockedUsersButton" class="menu-button">
                <i class="fas fa-user-slash"></i> Benutzerfilter verwalten
            </button>

            <!-- Separator -->
            <div style="height: 1px; background: ${colors.border}; opacity: 0.3; margin: 4px 0;"></div>

            <div class="toggle-option" style="display: flex; justify-content: space-between; align-items: center;">
                <span style="display: flex; align-items: center; cursor: help;" title="Deals unter 0° werden ausgeblendet">
                    Kalte Deals
                </span>
                <button type="button" id="hideColdDeals" class="eye-toggle" style="...">
                    <i class="fas ${hideColdDeals ? 'fa-eye-slash' : 'fa-eye'}"></i>
                </button>
            </div>

            <!-- Separator -->
            <div style="height: 1px; background: ${colors.border}; opacity: 0.3; margin: 4px 0;"></div>

            <div style="display: flex; align-items: center; gap: 10px;">
                <label style="flex-grow: 1; cursor: help;" title="Deals über diesem Preis werden ausgeblendet">
                    Teure Deals
                </label>
                <input
                    type="text"
                    inputmode="decimal"
                    pattern="[0-9]*[.,]?[0-9]*"
                    id="settingsMaxPrice"
                    value="${maxPrice.toLocaleString('de-DE', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2
                    })}"
                    placeholder="€"
                    style="
                        width: 80px;
                        padding: 4px 8px;
                        text-align: right;
                        background: ${colors.inputBg};
                        border: 1px solid ${colors.border};
                        border-radius: 3px;
                        color: ${colors.text};
                    "
                >
            </div>
        </div>
    `;

    // Features Section
    sections.features.content.innerHTML = `
        <div class="section-content" style="display: flex; flex-direction: column; gap: 6px;">
            ${document.querySelector('[data-t="shareBtn"]') ? `
                <div class="toggle-option" style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="display: flex; align-items: center; cursor: help;" title="Blendet den Teilen Button in jedem Deal in der Übersicht aus">
                        Teilen Button
                    </span>
                    <button type="button" id="hideShareButtons" class="eye-toggle" style="
                        background: none;
                        border: none;
                        cursor: pointer;
                        font-size: 18px;
                        color: ${colors.text};
                        width: 30px;
                        height: 30px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    ">
                        <i class="fas ${window.hideShareButtons ? 'fa-eye-slash' : 'fa-eye'}"
                        aria-label="${window.hideShareButtons ? 'Share Buttons versteckt' : 'Share Buttons sichtbar'}"></i>
                    </button>
                </div>

                <!-- Separator -->
                <div style="height: 1px; background: ${colors.border}; opacity: 0.3; margin: 6px 0;"></div>
            ` : ''}

            <div class="toggle-option" style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                position: relative;
            ">

            </div>

            <div class="toggle-option" style="display: flex; justify-content: space-between; align-items: center;">
                <span style="display: flex; align-items: center; cursor: help;" title="Gibt es zu dem Deal einen hinterlegten Händler und befindet sich der Name des Händlers im Titel, so wird dieser Name aus dem Titel ausgeblendet.">
                    Händler im Titel
                </span>
                <button type="button" id="hideMatchingMerchantNames" class="eye-toggle" style="
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 18px;
                    color: ${colors.text};
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">
                    <i class="fas ${window.hideMatchingMerchantNames ? 'fa-eye-slash' : 'fa-eye'}"
                    aria-label="${window.hideMatchingMerchantNames ? 'Händlernamen versteckt' : 'Händlernamen sichtbar'}"></i>
                </button>
            </div>

            <!-- Separator -->
            <div style="height: 1px; background: ${colors.border}; opacity: 0.3; margin: 6px 0;"></div>

            <!-- Toggle-Option für Speicherun der Sucheinstellungen -->
            <div class="toggle-option" style="display: flex; justify-content: space-between; align-items: center;">
                <span style="display: flex; align-items: center; cursor: help;" title="Mit dieser Funktion werden die Werte für 'Sortieren' und 'Datumsbereich' gespeichert und bei zukünftigen Suchen sofort angewandt.">
                    Sucheinstellungen speichern
                </span>
                <button type="button" id="rememberSort" class="toggle-switch" style="
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 18px;
                    color: ${colors.text};
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">
                    <i class="fas ${window.rememberSort ? 'fa-toggle-on' : 'fa-toggle-off'}"
                    aria-label="${window.rememberSort ? 'Sortierung wird gespeichert' : 'Sortierung wird nicht gespeichert'}"></i>
                </button>
            </div>
        </div>
    `;

    // Backup Section
    sections.backup.content.innerHTML = `
        <div class="section-content" style="display: flex; flex-direction: column; gap: 6px;">
            <button id="backupDataButton" class="menu-button">
                <i class="fas fa-download"></i> Backup erstellen
            </button>

            <!-- Separator -->
            <div style="height: 1px; background: ${colors.border}; opacity: 0.3; margin: 4px 0;"></div>

            <button id="restoreDataButton" class="menu-button">
                <i class="fas fa-upload"></i> Backup wiederherstellen
            </button>
            <input type="file"
                id="restoreFileInput"
                accept=".json"
                style="display: none;">
        </div>
    `;

    // Add sections to container
    Object.values(sections).forEach(({section}) => {
        contentContainer.appendChild(section);
    });

    // Erste Sektion automatisch öffnen und andere schließen
    Object.values(sections).forEach(({section}, index) => {
        const header = section.querySelector('.accordion-header');
        const content = section.querySelector('.accordion-content');
        const icon = header.querySelector('.fa-chevron-down');

        if (index === 0) { // Schnellaktionen
            content.style.display = 'block';
            icon.style.transform = 'rotate(180deg)';
        } else {
            content.style.display = 'none';
            icon.style.transform = '';
        }
    });

    // Footer mit fixem Schließen-Button - weniger Abstand zum Content
    const footer = document.createElement('div');
    footer.style.cssText = `
        margin-top: 2px;
        flex-shrink: 0;
        display: flex;
        justify-content: center;
    `;

    footer.innerHTML = `
        <button id="closeSettingsButton" class="button button--type-secondary button--mode-default button--shape-circle">
            <span>Schließen</span>
        </button>
    `;

    // Zusammenbau der UI
    settingsDiv.appendChild(header);
    settingsDiv.appendChild(contentContainer);
    settingsDiv.appendChild(footer);
    document.body.appendChild(settingsDiv);

    // Sammle alle Cleanup-Funktionen
    const cleanupFunctions = [];

    // Füge Draggable Cleanup hinzu
    const cleanupDraggable = makeDraggable(settingsDiv);
    if (cleanupDraggable) cleanupFunctions.push(cleanupDraggable);

    // Erweitere die Hauptcleanup-Funktion einmalig
    const oldCleanup = cleanup;
    cleanup = () => {
        // Führe alle registrierten Cleanup-Funktionen aus
        cleanupFunctions.forEach(fn => fn());
        // Führe original Cleanup aus
        oldCleanup();
    };

    // Nach dem Hinzufügen zum DOM den Button anpassen
    document.getElementById('closeSettingsButton').style.cssText = `
        padding: 8px 16px;
        display: inline-block;
        width: auto;
        min-width: 100px;
        text-align: center;
    `;

    // Event-Listener für den Sortierung Button:
    document.getElementById('rememberSort')?.addEventListener('click', async (e) => {
        // Toggle state
        const newState = !window.rememberSort;
        window.rememberSort = newState;
        GM_setValue('rememberSort', newState);
        localStorage.setItem('rememberSort', newState.toString());

        // Wenn Feature deaktiviert wurde, gespeicherte Sortierung entfernen
        if (!newState && localStorage.getItem(PREFERRED_SORT_KEY)) {
            localStorage.removeItem(PREFERRED_SORT_KEY);
        }

        // Update icon
        const icon = e.currentTarget.querySelector('i');
        if (icon) {
            icon.className = `fas ${newState ? 'fa-toggle-on' : 'fa-toggle-off'}`;
            icon.setAttribute('aria-label', newState ? 'Sortierung wird gespeichert' : 'Sortierung wird nicht gespeichert');
        }
    });

    // Accordion section styling - reduce padding and margins
    const accordionSectionStyle = document.createElement('style');
    accordionSectionStyle.textContent = `
        .accordion-section {
            margin-bottom: 4px;
        }
        .accordion-header {
            font-size: 18px;
            font-weight: bold;
            padding: 6px 8px !important;
            color: var(--primary-color, #24a300) !important;
        }
        .accordion-content {
            padding: 6px 8px !important;
        }
    `;
    document.head.appendChild(accordionSectionStyle);

    // Backup/Restore Buttons korrekt referenzieren
    const backupButton = document.getElementById('backupDataButton');
    const restoreButton = document.getElementById('restoreDataButton');
    const restoreFileInput = document.getElementById('restoreFileInput');

    // Event Listener für den versteckten Datei-Input
    if (restoreFileInput) {
        restoreFileInput.addEventListener('change', (e) => {
            restoreData(e);
        });
    }

    if (backupButton) {
        backupButton.addEventListener('click', () => {
            console.log('[MDM] Backup button clicked');
            backupData();
        });
    }

    if (restoreButton) {
        restoreButton.addEventListener('click', () => {
            if (restoreFileInput) {
                restoreFileInput.click();
            } else {
            }
        });
    }

    // Add Word Button
    const addWordButton = document.getElementById('addWordButton');
    if (addWordButton) {
        addWordButton.addEventListener('click', () => {
            const newWordInput = document.getElementById('newWordInput');
            const newWord = newWordInput.value.trim();

            // Lade aktuelle Wörter neu um sicherzustellen dass wir die komplette Liste haben
            excludeWords = loadExcludeWords();

            // Prüfe ob das Wort (unabhängig von Groß-/Kleinschreibung) bereits existiert
            const wordExists = excludeWords.some(word => word.toLowerCase() === newWord.toLowerCase());

            if (newWord && !wordExists) {
                excludeWords.unshift(newWord); // Füge neues Wort zur bestehenden Liste hinzu
                saveExcludeWords(excludeWords);
                newWordInput.value = '';
                processArticles();
                cleanup();

                suggestedWords = [];
                const suggestionList = document.getElementById('wordSuggestionList');
                if (suggestionList) {
                    suggestionList.remove();
                }
            } else if (wordExists) {
                // Erstelle und zeige Fehlermeldung
                const errorMsg = document.createElement('div');
                errorMsg.style.cssText = `
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    padding: 8px;
                    margin-top: 4px;
                    background: #ffebee;
                    color: #c62828;
                    border: 1px solid #ef9a9a;
                    border-radius: 3px;
                    font-size: 12px;
                    z-index: 1003;
                `;
                errorMsg.textContent = `"${newWord}" ist bereits in der Liste vorhanden.`;

                // Füge Fehlermeldung zum Input-Container hinzu
                const inputContainer = newWordInput.parentElement;
                inputContainer.style.position = 'relative';
                inputContainer.appendChild(errorMsg);

                // Entferne Fehlermeldung nach 3 Sekunden
                setTimeout(() => {
                    errorMsg.remove();
                }, 3000);

                // Selektiere den Text im Input für einfaches Überschreiben
                newWordInput.select();
            }
        });
    }

    // Enable Keyboard Button (für Touch-Geräte)
    const enableKeyboardButton = document.getElementById('enableKeyboardButton');
    if (enableKeyboardButton) {
        enableKeyboardButton.addEventListener('click', () => {
            const newWordInput = document.getElementById('newWordInput');
            if (newWordInput) {
                newWordInput.readOnly = false;
                newWordInput.focus();
            }
        });
    }

    // Hide Merchant Button
    const hideMerchantButton = document.getElementById('hideMerchantButton');
    if (hideMerchantButton && showMerchantButton) {
        hideMerchantButton.addEventListener('click', () => {
            if (!dealThatOpenedSettings) return;

            const merchantLink = dealThatOpenedSettings.querySelector('a[href*="merchant-id="]');
            if (!merchantLink) return;

            const merchantIDMatch = merchantLink.getAttribute('href').match(/merchant-id=(\d+)/);
            if (!merchantIDMatch) return;

            const merchantID = merchantIDMatch[1];
            const merchantName = dealThatOpenedSettings.querySelector('a[data-t="merchantLink"]').textContent.trim();

            const merchantsData = loadExcludeMerchants();
            if (!merchantsData.some(m => m.id === merchantID)) {
                merchantsData.unshift({ id: merchantID, name: merchantName });
                saveExcludeMerchants(merchantsData);
                processArticles();
                cleanup(); // Close settings UI

                // Aktualisiere Listen wenn UI offen
                if (activeSubUI === 'merchant') {
                    updateActiveLists();
                }
            }
        });
    }

    // Event Listener für den Button zum Ausblenden von User-Deals
    const hideUserDealsButton = document.getElementById('hideUserDealsButton');
    console.log('[MDM] hideUserDealsButton found:', !!hideUserDealsButton, 'dealThatOpenedSettings:', dealThatOpenedSettings?.id);
    if (hideUserDealsButton) {
        hideUserDealsButton.addEventListener('click', () => {
            console.log('[MDM] hideUserDealsButton clicked');
            if (dealThatOpenedSettings) {
                handleUserBlock(dealThatOpenedSettings);
                cleanup();
            } else {
                console.log('[MDM] No dealThatOpenedSettings available');
            }
        });
    }

    // Show Words List Button
    const showWordsListButton = document.getElementById('showWordsListButton');
    if (showWordsListButton) {
        showWordsListButton.addEventListener('click', () => {
            if (switchSubUI('words')) {
                createExcludeWordsUI();
            }
        });
    }

    // Show Merchant List Button
    const showMerchantListButton = document.getElementById('showMerchantListButton');
    if (showMerchantListButton) {
        showMerchantListButton.addEventListener('click', () => {
            if (switchSubUI('merchant')) {
                createMerchantListUI();
            }
        });
    }

    // Button für Blockierte Benutzer:
    const showBlockedUsersButton = document.getElementById('showBlockedUsersButton');
    if (showBlockedUsersButton) {
        showBlockedUsersButton.addEventListener('click', () => {
            if (switchSubUI('users')) {
                createBlockedUsersUI();
            }
        });
    }

    // Add event listeners only if newWordInput exists
    const newWordInput = document.getElementById('newWordInput');
    if (newWordInput) {
        // Enter Key Handler für das Eingabefeld
        newWordInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const word = newWordInput.value.trim();
                if (word && word.length > 0) {
                    // Add to excludeWords if not already in the list
                    if (!excludeWords.includes(word)) {
                        excludeWords.push(word);
                        saveExcludeWords(excludeWords);
                        processArticles();
                    }

                    // Clear the input field
                    newWordInput.value = '';
                    // Close suggestion list
                    document.getElementById('wordSuggestionList')?.remove();
                }
            }
        });

        // Unified focus handler
        newWordInput.addEventListener('focus', () => {
            // Get fresh words from current deal if none exist
            if (suggestedWords.length === 0) {
                suggestedWords = getWordsFromTitle(dealThatOpenedSettings);
            }

            // Always show suggestion list if words exist
            if (suggestedWords.length > 0) {
                updateSuggestionList();
            }
        }, { once: false }); // Allow multiple focus events
    }

    // Click Outside Handler anpassen
    createSuggestionClickHandler();

    // Cleanup bei UI-Schließung
    document.getElementById('closeSettingsButton').addEventListener('click', () => {
        document.removeEventListener('click', suggestionClickHandler);
        cleanup();
    });

    // Add cleanup to window unload
    window.addEventListener('unload', cleanup);

    const maxPriceInput = document.getElementById('settingsMaxPrice'); // Korrekter ID
    if (maxPriceInput) {
        // Focus-Handler hinzufügen, der den Inhalt markiert
        maxPriceInput.addEventListener('focus', () => {
            maxPriceInput.select();
        });

        // Formatierer für die Eingabe
        const formatPrice = (value) => {
            let cleaned = value.replace(/[^\d.,]/g, '');
            const parts = cleaned.split(',');

            // Begrenze Nachkommastellen auf 2
            if (parts.length > 1) {
                parts[1] = parts[1].slice(0, 2); // Maximal 2 Stellen nach dem Komma
                cleaned = parts[0] + ',' + parts[1];
            }

            if (parts.length > 2) {
                cleaned = parts.slice(0, -1).join('') + ',' + parts.slice(-1)[0].slice(0, 2);
            }

            if (parts.length === 2) {
                const intPart = parts[0].replace(/\./g, '');
                return Number(intPart).toLocaleString('de-DE') + ',' + parts[1];
            } else {
                const intPart = cleaned.replace(/\./g, '');
                return Number(intPart).toLocaleString('de-DE');
            }
        };

        // Input-Handler hinzufügen für die Live-Formatierung
        maxPriceInput.addEventListener('input', (e) => {
            e.stopPropagation();
            e.target.value = formatPrice(e.target.value);
        });

        // Beim Verlassen des Feldes den Wert speichern
        maxPriceInput.addEventListener('blur', (e) => {
            const value = e.target.value;
            const numStr = value.replace(/\./g, '').replace(',', '.');
            const numericValue = parseFloat(numStr);

            if (!isNaN(numericValue) && numericValue >= 0) {
                const oldValue = maxPrice;
                saveMaxPrice(numericValue);

                // Auch filtern wenn Wert gleich blieb (z.B. bei Enter ohne Änderung)
                if (oldValue === numericValue) {
                    processArticles();
                }
            }
        });

        // Enter-Taste zum Übernehmen
        maxPriceInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                maxPriceInput.blur(); // Triggert blur-Event, das den Wert speichert
            }
        });

        // Behandlung für Touch-Geräte
        if (IS_TOUCH_DEVICE) {
            maxPriceInput.addEventListener('focus', () => {
                // Öffnet die numerische Tastatur auf Touch-Geräten
                maxPriceInput.setAttribute('inputmode', 'decimal');

                // Markiert den Text für einfaches Überschreiben
                maxPriceInput.select();
            });
        }
    }

    // Get initial word suggestions
    suggestedWords = dealThatOpenedSettings ? getWordsFromTitle(dealThatOpenedSettings) : [];

    // Event-Listener für die "Zurück"-Buttons bei kürzlich ausgeblendeten Deals
    document.querySelector('.restore-deal-button')?.addEventListener('click', (e) => {
        const dealId = e.currentTarget.dataset.dealId;

        // Deal aus hiddenDeals entfernen
        hiddenDeals = hiddenDeals.filter(id => id !== dealId);
        saveHiddenDeals();

        // UI aktualisieren
        document.getElementById('lastHiddenDealSection').style.display = 'none';

        // Finde den wiederhergestellten Deal
        const restoredDeal = document.getElementById(dealId);
        if (restoredDeal) {
            // Hide-Button Container zurücksetzen
            const hideButtonContainer = restoredDeal.querySelector('.cept-vote-temp div');
            if (hideButtonContainer) {
                hideButtonContainer.style.display = 'none';
            }
        }

        // Deals neu verarbeiten
        processArticles();
    });

    // Setup ClickOutsideHandler für das Settings-UI
    setupClickOutsideHandler();

    document.getElementById('hideShareButtons')?.addEventListener('click', async (e) => {
        // Toggle state
        const newState = !window.hideShareButtons;
        window.hideShareButtons = newState;
        GM_setValue('hideShareButtons', newState);
        localStorage.setItem('hideShareButtons', newState.toString());

        // Update icon
        const icon = e.currentTarget.querySelector('i');
        if (icon) {
            icon.className = newState ? 'fas fa-eye-slash' : 'fas fa-eye';
            icon.setAttribute('aria-label', newState ? 'Share Buttons versteckt' : 'Share Buttons sichtbar');
        }

        // Update visibility
        updateShareButtonsVisibility(newState);

        await Promise.resolve();
        processArticles();
    });

    document.getElementById('hideMatchingMerchantNames')?.addEventListener('click', async (e) => {
        // Toggle state
        const newState = !window.hideMatchingMerchantNames;
        window.hideMatchingMerchantNames = newState;
        GM_setValue('hideMatchingMerchantNames', newState);
        localStorage.setItem('hideMatchingMerchantNames', newState.toString());

        // Update icon
        const icon = e.currentTarget.querySelector('i');
        if (icon) {
            icon.className = `fas ${newState ? 'fa-eye-slash' : 'fa-eye'}`;
            icon.setAttribute('aria-label', newState ? 'Händlernamen versteckt' : 'Händlernamen sichtbar');
        }

        // Update visibility
        await Promise.resolve();
        processArticles();
    });

    document.getElementById('hideColdDeals')?.addEventListener('click', async (e) => {
        // Toggle state
        hideColdDeals = !hideColdDeals;

        // Save to storage
        GM_setValue('hideColdDeals', hideColdDeals);
        localStorage.setItem(HIDE_COLD_DEALS_KEY, hideColdDeals.toString());

        // Update icon
        const icon = e.currentTarget.querySelector('i');
        if (icon) {
            icon.className = `fas ${hideColdDeals ? 'fa-eye-slash' : 'fa-eye'}`;
            icon.setAttribute('aria-label', hideColdDeals ? 'Kalte Deals versteckt' : 'Kalte Deals sichtbar');
        }

        // Reprocess articles to apply the change
        await Promise.resolve();
        processArticles();
    });
}

function makeDraggable(element) {
    // Don't make draggable on touch devices
    if (IS_TOUCH_DEVICE) return;

    let isDragging = false;
    let offsetX = 0, offsetY = 0;
    let wasMoved = false;

    // Header für Drag-Funktionalität
    const header = element.querySelector('.accordion-header:first-child');
    if (!header) return;

    header.style.cursor = 'move';
    header.style.userSelect = 'none';

    const startDrag = (e) => {
        // Nur bei linker Maustaste
        if (e.button !== 0) return;

        isDragging = true;
        const rect = element.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        // Initial position setzen wenn noch nicht verschoben
        if (!wasMoved) {
            element.style.left = rect.left + 'px';
            element.style.top = rect.top + 'px';
            element.style.transform = 'none';
            element.style.right = 'auto';
            element.style.bottom = 'auto';
            wasMoved = true;
        }

        // Prevent text selection during drag
        document.body.style.userSelect = 'none';
    };

    const drag = (e) => {
        if (!isDragging) return;

        const newLeft = e.clientX - offsetX;
        const newTop = e.clientY - offsetY;

        const rect = element.getBoundingClientRect();
        const maxX = window.innerWidth - rect.width;
        const maxY = window.innerHeight - rect.height;

        // Hauptfenster Position aktualisieren
        const finalLeft = Math.min(Math.max(0, newLeft), maxX);
        const finalTop = Math.min(Math.max(0, newTop), maxY);

        element.style.left = finalLeft + 'px';
        element.style.top = finalTop + 'px';

        // Direkt die Sub-UIs aktualisieren
        const settingsRect = element.getBoundingClientRect();
        [
            wordsListDiv,
            merchantListDiv,
            blockedUsersDiv,
            document.getElementById('wordSuggestionList')
        ].forEach(ui => {
            if (ui?.parentNode) {
                ui.style.position = 'fixed';
                ui.style.top = `${settingsRect.top}px`;
                ui.style.left = `${settingsRect.right + 10}px`;
            }
        });
    };

    const stopDrag = () => {
        if (!isDragging) return;

        isDragging = false;
        document.body.style.userSelect = '';

        // Position speichern
        const rect = element.getBoundingClientRect();
        GM_setValue('mdmSettingsPos', JSON.stringify({
            left: rect.left,
            top: rect.top,
            wasMoved: true
        }));

        // Finale Position der Sub-UIs aktualisieren
        const settingsRect = element.getBoundingClientRect();
        [
            wordsListDiv,
            merchantListDiv,
            blockedUsersDiv,
            document.getElementById('wordSuggestionList')
        ].forEach(ui => {
            if (ui?.parentNode) {
                ui.style.position = 'fixed';
                ui.style.top = `${settingsRect.top}px`;
                ui.style.left = `${settingsRect.right + 10}px`;
            }
        });
    };

    header.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);

    // Gespeicherte Position wiederherstellen
    const savedPos = GM_getValue('mdmSettingsPos');
    if (savedPos) {
        try {
            const pos = JSON.parse(savedPos);
            if (pos.wasMoved) {
                wasMoved = true;
                element.style.left = pos.left + 'px';
                element.style.top = pos.top + 'px';
                element.style.transform = 'none';
                element.style.right = 'auto';
                element.style.bottom = 'auto';

                // Auch die Sub-UIs an die gespeicherte Position anpassen
                const settingsRect = element.getBoundingClientRect();
                [
                    wordsListDiv,
                    merchantListDiv,
                    blockedUsersDiv,
                    document.getElementById('wordSuggestionList')
                ].forEach(ui => {
                    if (ui?.parentNode) {
                        ui.style.position = 'fixed';
                        ui.style.top = `${settingsRect.top}px`;
                        ui.style.left = `${settingsRect.right + 10}px`;
                    }
                });
            }
        } catch (e) {
            console.error('Error restoring settings position:', e);
        }
    }

    // Cleanup-Funktion zurückgeben
    return () => {
        header.removeEventListener('mousedown', startDrag);
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stopDrag);
    };
}

// Accordion-Sektion erstellen
function createAccordionSection(title, iconName) {
    const section = document.createElement('div');
    section.className = 'accordion-section';
    const colors = getThemeColors();

    section.innerHTML = `
        <div class="accordion-header" style="
            display: flex;
            align-items: center;
            padding: 10px;
            cursor: pointer;
            user-select: none;
            background: ${colors.background};
            border-bottom: 1px solid ${colors.border};
            position: relative;
            z-index: 1;
        ">
            <i class="fas fa-${iconName}" style="margin-right: 10px;"></i>
            <span>${title}</span>
            <i class="fas fa-chevron-down" style="margin-left: auto; transition: transform 0.3s"></i>
        </div>
        <div class="accordion-content" style="
            display: none;
            padding: 10px;
            position: relative;
            z-index: 0;
            border-bottom: 1px solid ${colors.border};
        ">
            <div class="accordion-inner" style="
                display: flex;
                flex-direction: column;
                gap: 12px;
            ">
            </div>
        </div>
    `;


    // Hole Referenzen
    const header = section.querySelector('.accordion-header');
    const content = section.querySelector('.accordion-content');

    header.onclick = () => {
        // Schließe alle anderen Sektionen
        document.querySelectorAll('.accordion-section').forEach(otherSection => {
            if (otherSection !== section) {
                const otherContent = otherSection.querySelector('.accordion-content');
                const otherIcon = otherSection.querySelector('.fa-chevron-down');
                if (otherContent) {
                    otherContent.style.display = 'none';
                }
                if (otherIcon) {
                    otherIcon.style.transform = '';
                }
            }
        });

        // Öffne/Schließe aktuelle Sektion
        const isOpen = content.style.display === 'block';
        content.style.display = isOpen ? 'none' : 'block';
        header.querySelector('.fa-chevron-down').style.transform = isOpen ? '' : 'rotate(180deg)';
    };

    return {
        section,
        content: section.querySelector('.accordion-inner')
    };
}

// --- Filterlisten-Erstellung ---
// Händlerliste erstellen
function createMerchantListUI() {
    const colors = getThemeColors();
    merchantListDiv.style.cssText = `
        ${getSubUIPosition()}
        padding: 15px;
        background: ${colors.background};
        border: 1px solid ${colors.border};
        border-radius: 5px;
        width: 300px;
        color: ${colors.text};
    `;

    const currentMerchants = loadExcludeMerchants();

    const merchantListHTML = currentMerchants.map(merchant => `
        <div class="merchant-item" style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 5px;
            padding: 5px;
            background: ${colors.itemBg};
            color: ${colors.text};
            border: 1px solid ${colors.border};
            border-radius: 3px;">
            <span>${merchant.name}</span>
            <button class="delete-merchant" data-id="${merchant.id}" style="
                background: none;
                border: none;
                cursor: pointer;
                color: ${colors.text};
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;">
                <svg width="16" height="16">
                    <use xlink:href="https://www.mydealz.de/assets/img/ico_632f5.svg#trash"></use>
                </svg>
            </button>
        </div>
    `).join('');

    merchantListDiv.innerHTML = `
        <h4 style="margin-bottom: 10px;">Ausgeblendete Händler (${currentMerchants.length})</h4>
        <input type="text" id="merchantSearch" placeholder="Händler suchen..."
            style="
                width: 100%;
                padding: 5px;
                margin-bottom: 10px;
                background: ${colors.inputBg};
                border: 1px solid ${colors.border};
                color: ${colors.text};
                border-radius: 3px;">
        <div style="margin-bottom: 15px;">
            <div id="merchantList" style="
                margin-bottom: 10px;
                height: 200px;
                overflow-y: auto;
                padding-right: 5px;
                min-height: 200px;
                touch-action: pan-y;
                -webkit-overflow-scrolling: touch;">
                ${merchantListHTML}
            </div>
            <button id="clearMerchantListButton" style="
                width: 100%;
                padding: 5px 10px;
                background: ${colors.buttonBg};
                border: 1px solid ${colors.buttonBorder};
                color: ${colors.text};
                border-radius: 3px;
                cursor: pointer;
                margin-top: 10px;">
                <span style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <svg width="16" height="16">
                        <use xlink:href="https://www.mydealz.de/assets/img/ico_632f5.svg#trash"></use>
                    </svg>
                    Alle Händler entfernen
                </span>
            </button>
        </div>
        <div style="
            margin-top: 20px;
            display: flex;
            justify-content: center;
        ">
            <button id="closeMerchantListButton" class="button button--type-secondary button--mode-default button--shape-circle">
                <span>Schließen</span>
            </button>
        </div>
    `;

    // Add the div to the document body
    document.body.appendChild(merchantListDiv);
    setupClickOutsideHandler();

    // Nach dem Hinzufügen zum DOM den Button anpassen
    document.getElementById('closeMerchantListButton').style.cssText = `
        padding: 8px 16px;
        display: inline-block;
        width: auto;
        min-width: 100px;
        text-align: center;
    `;

    // Add search functionality
    const searchInput = document.getElementById('merchantSearch');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        let visibleCount = 0;
        // Hole aktuelle Händler statt die ursprüngliche Liste zu verwenden
        const currentMerchants = loadExcludeMerchants();
        const totalCount = currentMerchants.length;

        document.querySelectorAll('.merchant-item').forEach(item => {
            const merchantName = item.querySelector('span').textContent.toLowerCase();
            const isVisible = merchantName.includes(searchTerm);
            item.style.display = isVisible ? 'flex' : 'none';
            if (isVisible) visibleCount++;
        });

        // Update heading counter
        const heading = merchantListDiv.querySelector('h4');
        if (heading) {
            heading.textContent = searchTerm
                ? `Ausgeblendete Händler (${visibleCount}/${totalCount})`
                : `Ausgeblendete Händler (${totalCount})`;
        }
    });

    // Alle Händler entfernen Button
    document.getElementById('clearMerchantListButton').addEventListener('click', () => {
        if (confirm('Möchten Sie wirklich alle Händler aus der Liste entfernen?')) {
            saveExcludeMerchants([]);
            document.getElementById('merchantList').innerHTML = '';
            excludeMerchantIDs = [];
            rebuildExcludeMerchantCache([]);
            processArticles();

            // Immediately update counter in heading
            const heading = merchantListDiv.querySelector('h4');
            if (heading) {
                heading.textContent = 'Ausgeblendete Händler (0)';
            }
        }
    });

    document.querySelectorAll('.delete-merchant').forEach(button => {

        button.addEventListener('click', function(e) {
            handleMerchantDelete(e);
        });
    });

    // Update close button handlers in createMerchantListUI
    document.getElementById('closeMerchantListButton').addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event bubbling
        closeActiveSubUI();
    });
}
// Wörterliste erstellen
function createExcludeWordsUI() {
    const colors = getThemeColors();
    wordsListDiv.style.cssText = `
        ${getSubUIPosition()}
        padding: 15px;
        background: ${colors.background};
        border: 1px solid ${colors.border};
        border-radius: 5px;
        width: 300px;
        color: ${colors.text};
    `;

    const currentWords = loadExcludeWords();

    const wordsListHTML = currentWords.map(word => `
        <div class="word-item" style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 5px;
            padding: 5px;
            background: ${colors.itemBg};
            color: ${colors.text};
            border: 1px solid ${colors.border};
            border-radius: 3px;">
            <span style="word-break: break-word;">${word}</span>
            <button class="delete-word" data-word="${word}" style="
                background: none;
                border: none;
                cursor: pointer;
                color: ${colors.text};
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;">
                <svg width="16" height="16">
                    <use xlink:href="https://www.mydealz.de/assets/img/ico_632f5.svg#trash"></use>
                </svg>
            </button>
        </div>
    `).join('');

    wordsListDiv.innerHTML = `
        <h4 style="margin-bottom: 10px;">Ausgeblendete Wörter (${currentWords.length})</h4>
        <input type="text" id="wordSearch" placeholder="Wörter suchen..."
            style="
                width: 100%;
                padding: 5px;
                margin-bottom: 10px;
                background: ${colors.inputBg};
                border: 1px solid ${colors.border};
                color: ${colors.text};
                border-radius: 3px;">
        <div style="margin-bottom: 15px;">
            <div id="wordsList" style="
                margin-bottom: 10px;
                height: 200px;
                overflow-y: auto;
                padding-right: 5px;
                min-height: 200px;
                touch-action: pan-y;
                -webkit-overflow-scrolling: touch;">
                ${wordsListHTML}
            </div>
            <button id="clearWordsListButton" style="
                width: 100%;
                padding: 5px 10px;
                background: ${colors.buttonBg};
                border: 1px solid ${colors.buttonBorder};
                color: ${colors.text};
                border-radius: 3px;
                cursor: pointer;
                margin-top: 10px;">
                <span style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <svg width="16" height="16">
                        <use xlink:href="https://www.mydealz.de/assets/img/ico_632f5.svg#trash"></use>
                    </svg>
                    Alle Wörter entfernen
                </span>
            </button>
        </div>
        <div style="
            margin-top: 20px;
            display: flex;
            justify-content: center;
        ">
            <button id="closeWordsListButton" class="button button--type-secondary button--mode-default button--shape-circle">
                <span>Schließen</span>
            </button>
        </div>
    `;

    // Add the div to the document body
    document.body.appendChild(wordsListDiv);
    setupClickOutsideHandler();

    // Nach dem Hinzufügen zum DOM den Button anpassen
    document.getElementById('closeWordsListButton').style.cssText = `
        padding: 8px 16px;
        display: inline-block;
        width: auto;
        min-width: 100px;
        text-align: center;
    `;

    // Add search functionality
    const searchInput = document.getElementById('wordSearch');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        let visibleCount = 0;
        // Hole aktuelle Wörter statt die ursprüngliche Liste zu verwenden
        const currentWords = loadExcludeWords();
        const totalCount = currentWords.length;

        document.querySelectorAll('.word-item').forEach(item => {
            const word = item.querySelector('span').textContent.toLowerCase();
            const isVisible = word.includes(searchTerm);
            item.style.display = isVisible ? 'flex' : 'none';
            if (isVisible) visibleCount++;
        });

        // Update heading counter
        const heading = wordsListDiv.querySelector('h4');
        if (heading) {
            heading.textContent = searchTerm
                ? `Ausgeblendete Wörter (${visibleCount}/${totalCount})`
                : `Ausgeblendete Wörter (${totalCount})`;
        }
    });

    // Alle Wörter entfernen Button
    document.getElementById('clearWordsListButton').addEventListener('click', () => {
        if (confirm('Möchten Sie wirklich alle Wörter aus der Liste entfernen?')) {
            saveExcludeWords([]);
            document.getElementById('wordsList').innerHTML = '';
            excludeWords = [];
            processArticles();

            // Immediately update counter in heading
            const heading = wordsListDiv.querySelector('h4');
            if (heading) {
                heading.textContent = 'Ausgeblendete Wörter (0)';
            }
        }
    });

    // Add delete handlers
    document.querySelectorAll('.delete-word').forEach(button => {

        button.addEventListener('click', function(e) {
            handleWordDelete(e);
        });
    });

    // Update close button handlers in createExcludeWordsUI
    document.getElementById('closeWordsListButton').addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event bubbling
        closeActiveSubUI();
    });
    // Before adding to DOM
    document.body.appendChild(wordsListDiv);

    setupClickOutsideHandler();
}
// Blockierte Benutzer UI erstellen
function createBlockedUsersUI() {
    const colors = getThemeColors();
    blockedUsersDiv.id = 'blockedUsersDiv';
    blockedUsersDiv.style.cssText = `
        ${getSubUIPosition()}
        padding: 15px;
        background: ${colors.background};
        border: 1px solid ${colors.border};
        border-radius: 5px;
        width: 300px;
        color: ${colors.text};
    `;

    // Lade blockierte Benutzer
    const blockedUsers = GM_getValue('blockedUsers', []);
    if (DEBUG.userBlocking) {
        console.log('[MDM UserBlock] Loading blocked users UI, count:', blockedUsers.length, 'users:', blockedUsers);
    }

    const blockedUsersHTML = blockedUsers.map(user => `
        <div class="user-item" style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 5px;
            padding: 5px;
            background: ${colors.itemBg};
            color: ${colors.text};
            border: 1px solid ${colors.border};
            border-radius: 3px;">
            <span>${user}</span>
            <button class="delete-user" data-user="${user}" style="
                background: none;
                border: none;
                cursor: pointer;
                color: ${colors.text};
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;">
                <svg width="16" height="16">
                    <use xlink:href="https://www.mydealz.de/assets/img/ico_632f5.svg#trash"></use>
                </svg>
            </button>
        </div>
    `).join('');

    blockedUsersDiv.innerHTML = `
        <h4 style="margin-bottom: 10px;">Ausgeblendete Benutzer (${blockedUsers.length})</h4>
        <input type="text" id="userSearch" placeholder="Benutzer suchen..."
            style="
                width: 100%;
                padding: 5px;
                margin-bottom: 10px;
                background: ${colors.inputBg};
                border: 1px solid ${colors.border};
                color: ${colors.text};
                border-radius: 3px;">
        <div style="margin-bottom: 15px;">
            <div id="usersList" style="
                margin-bottom: 10px;
                height: 200px;
                overflow-y: auto;
                padding-right: 5px;
                min-height: 200px;
                touch-action: pan-y;
                -webkit-overflow-scrolling: touch;">
                ${blockedUsersHTML}
            </div>
            <button id="clearBlockedUsersButton" style="
                width: 100%;
                padding: 5px 10px;
                background: ${colors.buttonBg};
                border: 1px solid ${colors.buttonBorder};
                color: ${colors.text};
                border-radius: 3px;
                cursor: pointer;
                margin-top: 10px;">
                <span style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <svg width="16" height="16">
                        <use xlink:href="https://www.mydealz.de/assets/img/ico_632f5.svg#trash"></use>
                    </svg>
                    Alle Benutzer entfernen
                </span>
            </button>
        </div>
        <div style="
            margin-top: 20px;
            display: flex;
            justify-content: center;
        ">
            <button id="closeBlockedUsersButton" class="button button--type-secondary button--mode-default button--shape-circle">
                <span>Schließen</span>
            </button>
        </div>
    `;

    document.body.appendChild(blockedUsersDiv);
    setupClickOutsideHandler();

    // Nach dem Hinzufügen zum DOM den Button anpassen
    document.getElementById('closeBlockedUsersButton').style.cssText = `
        padding: 8px 16px;
        display: inline-block;
        width: auto;
        min-width: 100px;
        text-align: center;
    `;

    // Suchfunktionalität
    const searchInput = document.getElementById('userSearch');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        let visibleCount = 0;
        const totalCount = blockedUsers.length;

        document.querySelectorAll('.user-item').forEach(item => {
            const userName = item.querySelector('span').textContent.toLowerCase();
            const isVisible = userName.includes(searchTerm);
            item.style.display = isVisible ? 'flex' : 'none';
            if (isVisible) visibleCount++;
        });

        // Update heading counter
        const heading = blockedUsersDiv.querySelector('h4');
        if (heading) {
            heading.textContent = searchTerm
                ? `Ausgeblendete Benutzer (${visibleCount}/${totalCount})`
                : `Ausgeblendete Benutzer (${totalCount})`;
        }
    });

    // Alle Benutzer entfernen Button
    document.getElementById('clearBlockedUsersButton').addEventListener('click', () => {
        if (confirm('Möchten Sie wirklich alle Benutzer aus der Liste entfernen?')) {
            GM_setValue('blockedUsers', []);
            document.getElementById('usersList').innerHTML = '';
            processArticles();

            // Immediately update counter in heading
            const heading = blockedUsersDiv.querySelector('h4');
            if (heading) {
                heading.textContent = 'Ausgeblendete Benutzer (0)';
            }
        }
    });

    // Einzelne Benutzer entfernen
    document.querySelectorAll('.delete-user').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const userToDelete = button.dataset.user;
            const userItem = button.closest('.user-item');
            const blockedUsers = GM_getValue('blockedUsers', []);

            // Update blockedUsers array
            const updatedUsers = blockedUsers.filter(user => user !== userToDelete);
            GM_setValue('blockedUsers', updatedUsers);

            // Update UI
            userItem.remove();
            processArticles();

            // Update counter in heading
            const heading = blockedUsersDiv.querySelector('h4');
            if (heading) {
                heading.textContent = `Ausgeblendete Benutzer (${updatedUsers.length})`;
            }
        });
    });

    // Schließen Button
    document.getElementById('closeBlockedUsersButton').addEventListener('click', (e) => {
        e.stopPropagation();
        closeActiveSubUI();
    });
}

// === UI-Updates ===
// --- Listen & Status ---
// Liste der Händler/Wörter aktualisieren
function updateActiveLists() {
    const colors = getThemeColors();

    if (activeSubUI === 'merchant' && merchantListDiv) {
        const merchantList = document.getElementById('merchantList');
        if (merchantList) {
            const currentMerchants = loadExcludeMerchants();
            merchantList.innerHTML = currentMerchants.map(merchant => `
                <div class="merchant-item" style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 5px;
                    padding: 5px;
                    background: ${colors.itemBg};
                    color: ${colors.text};
                    border: 1px solid ${colors.border};
                    border-radius: 3px;">
                    <div style="display: flex; flex-direction: column;">
                        <span>${merchant.name}</span>
                        <span style="color: ${colors.text}; opacity: 0.7; font-size: 0.8em;">ID: ${merchant.id}</span>
                    </div>
                    <button class="delete-merchant" data-id="${merchant.id}" style="
                        background: none;
                        border: none;
                        cursor: pointer;
                        color: ${colors.text};">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `).join('');

            // Event Listener neu hinzufügen
            document.querySelectorAll('.delete-merchant').forEach(button => {

                button.addEventListener('click', function(e) {
                    handleMerchantDelete(e);
                });
            });
        }
    } else if (activeSubUI === 'words' && wordsListDiv) {
        const wordsList = document.getElementById('wordsList');
        if (wordsList) {
            const currentWords = loadExcludeWords();
            wordsList.innerHTML = currentWords.map(word => `
                <div class="word-item" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; padding: 5px; background: #f0f0f0; border-radius: 3px;">
                    <span style="word-break: break-word;">${word}</span>
                    <button class="delete-word" data-word="${word}" style="background: none; border: none; cursor: pointer; color: #666;">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `).join('');

            // Event Listener neu hinzufügen
            document.querySelectorAll('.delete-word').forEach(button => {
                button.addEventListener('click', handleWordDelete);
            });
        }
    }
}
function updateSuggestionList() {
    // Save scroll position if list exists
    const oldList = document.getElementById('wordSuggestionList');
    const scrollPosition = oldList?.scrollTop || 0;

    // Remove old list if exists
    if (oldList) oldList.remove();

    // Filter and check for words
    suggestedWords = suggestedWords.filter(word => !excludeWords.includes(word));
    if (!suggestedWords.length) return;

    const inputField = document.getElementById('newWordInput');
    const inputRect = inputField.getBoundingClientRect();
    const colors = getThemeColors();

    // Create suggestion list with fixed positioning
    const wordSuggestionList = document.createElement('div');
    wordSuggestionList.id = 'wordSuggestionList';
    wordSuggestionList.style.cssText = `
        position: fixed;
        top: ${inputRect.bottom}px;
        left: ${inputRect.left}px;
        width: ${inputRect.width}px;
        max-height: 200px;
        overflow-y: auto;
        background: ${colors.background};
        border: 1px solid ${colors.border};
        color: ${colors.text};
        border-radius: 3px;
        z-index: 1002;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        display: block;
        touch-action: pan-y;
        -webkit-overflow-scrolling: touch;
    `;

    // Add touch event handlers for mobile scrolling
    if (IS_TOUCH_DEVICE) {
        let touchStartY = 0;
        let scrollStartY = 0;

        wordSuggestionList.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].pageY;
            scrollStartY = wordSuggestionList.scrollTop;
            // Verhindern dass der Touch-Event die Liste schließt
            e.stopPropagation();
        }, { passive: true });

        wordSuggestionList.addEventListener('touchmove', (e) => {
            const touchY = e.touches[0].pageY;
            const deltaY = touchStartY - touchY;
            wordSuggestionList.scrollTop = scrollStartY + deltaY;

            // Verhindern dass die Seite scrollt während in der Liste gescrollt wird
            if (wordSuggestionList.scrollHeight > wordSuggestionList.clientHeight) {
                const isAtTop = wordSuggestionList.scrollTop === 0;
                const isAtBottom = wordSuggestionList.scrollTop + wordSuggestionList.clientHeight >= wordSuggestionList.scrollHeight;

                if ((isAtTop && deltaY < 0) || (isAtBottom && deltaY > 0)) {
                    e.preventDefault();
                }
            }
        }, { passive: false });

        wordSuggestionList.addEventListener('touchend', (e) => {
            e.stopPropagation();
        }, { passive: true });
    }

    wordSuggestionList.innerHTML = suggestedWords
        .map(word => `
            <div class="word-suggestion-item" style="padding: 10px; border-bottom: 1px solid #eee; cursor: pointer; transition: background-color 0.2s;">
                ${word}
            </div>
        `).join('');

    document.body.appendChild(wordSuggestionList);
    wordSuggestionList.scrollTop = scrollPosition;

    // Add event listeners for items
    wordSuggestionList.querySelectorAll('.word-suggestion-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.backgroundColor = colors.itemBg;
        });
        item.addEventListener('mouseleave', () => {
            item.style.backgroundColor = colors.background;
        });
        item.addEventListener('click', handleWordSelection);
    });

    // Update position on scroll/resize
    const updatePosition = () => {
        const newRect = inputField.getBoundingClientRect();
        wordSuggestionList.style.top = `${newRect.bottom}px`;
        wordSuggestionList.style.left = `${newRect.left}px`;
    };

    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    // Clean up event listeners when list is removed
    const cleanupListeners = () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
    };
}

// Share-Buttons Ein-/Ausblenden
function updateShareButtonsVisibility(hide) {
    const styleId = 'mdm-hide-share-buttons-style';
    let styleElement = document.getElementById(styleId);

    if (hide) {
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = styleId;
            styleElement.textContent = `
                button[data-t="shareBtn"] {
                    display: none !important;
                }
            `;
            document.head.appendChild(styleElement);
        }
    } else if (styleElement) {
        styleElement.remove();
    }
}

// === Event-Handler ===
// --- Click & Touch ---
// Klick-Handler außerhalb der UI
function setupClickOutsideHandler() {
    if (uiClickOutsideHandler) {
        document.removeEventListener('click', uiClickOutsideHandler);
    }

    uiClickOutsideHandler = (e) => {
        // Early exit for clicks on UI controls
        if (e.target.closest('.settings-button') ||
            e.target.closest('#showMerchantListButton') ||
            e.target.closest('#showWordsListButton')) {
            return;
        }

        // Get current UI states
        const settingsOpen = settingsDiv?.parentNode;
        const merchantsOpen = merchantListDiv?.parentNode;
        const wordsOpen = wordsListDiv?.parentNode;
        const blockedUsersOpen = blockedUsersDiv?.parentNode;

        // Check if click was outside all UIs
        const clickedOutside = (!settingsOpen || !settingsDiv.contains(e.target)) &&
              (!merchantsOpen || !merchantListDiv.contains(e.target)) &&
              (!wordsOpen || !wordsListDiv.contains(e.target)) &&
              (!blockedUsersOpen || !blockedUsersDiv.contains(e.target))

        if (clickedOutside) {
            cleanup();

            // Explicit cleanup of UI elements
            if (settingsDiv?.parentNode) settingsDiv.remove();
            if (merchantListDiv?.parentNode) merchantListDiv.remove();
            if (wordsListDiv?.parentNode) wordsListDiv.remove();
            if (blockedUsersDiv?.parentNode) blockedUsersDiv.remove();

            // Reset states
            isSettingsOpen = false;
            activeSubUI = null;

            // Remove handler
            document.removeEventListener('click', uiClickOutsideHandler);
            uiClickOutsideHandler = null;
        }
    };

    // Add with delay to prevent immediate trigger
    setTimeout(() => {
        document.addEventListener('click', uiClickOutsideHandler);
    }, 100);
}

function createSuggestionClickHandler() {
    // Remove old handler if exists
    if (suggestionClickHandler) {
        document.removeEventListener('click', suggestionClickHandler);
    }

    suggestionClickHandler = (e) => {
        const list = document.getElementById('wordSuggestionList');
        const input = document.getElementById('newWordInput');

        if (!list?.contains(e.target) && !input?.contains(e.target)) {
            list?.remove();
        }
    };

    document.addEventListener('click', suggestionClickHandler);
    return suggestionClickHandler;
}
function handleWordSelection(e) {
    e.preventDefault();
    e.stopPropagation();

    const wordSuggestionList = document.getElementById('wordSuggestionList');
    const scrollPosition = wordSuggestionList.scrollTop; // Save scroll position

    const word = e.target.textContent.trim();
    const newWordInput = document.getElementById('newWordInput');
    const currentValue = newWordInput.value.trim();

    newWordInput.value = currentValue ? `${currentValue} ${word}` : word;
    suggestedWords = suggestedWords.filter(w => w !== word);

    updateSuggestionList();
    newWordInput.focus();

    // Restore scroll position after list update
    const updatedList = document.getElementById('wordSuggestionList');
    if (updatedList) {
        updatedList.scrollTop = scrollPosition;
    }
}
function setupScrollHandling() {
    let isScrollingUI = false;
    let lastActiveUI = null;
    let touchStartY = 0;

    // Hilfsfunktion zum Prüfen ob ein Element scrollbar ist
    const isScrollable = (element) => {
        return element.scrollHeight > element.clientHeight;
    };

    // Hilfsfunktion zum Prüfen ob ein Element am Anfang/Ende des Scrollbereichs ist
    const isAtScrollLimit = (element, delta) => {
        if (delta > 0) {
            return element.scrollTop + element.clientHeight >= element.scrollHeight - 1;
        } else {
            return element.scrollTop <= 0;
        }
    };

    function handleScroll(e) {
        // Prüfe ob der Mauszeiger über einem UI-Element ist
        const isOverUI = e.target.closest('#mdm-settings-popup, #merchantListDiv, #wordsListDiv, #wordSuggestionList') ||
              settingsDiv?.contains(e.target) ||
              merchantListDiv?.contains(e.target) ||
              wordsListDiv?.contains(e.target);

        if (isOverUI) {
            // Finde das scrollbare übergeordnete Element
            const scrollableContainer = e.target.closest('#mdm-settings-content, #merchantList, #wordsList, #wordSuggestionList');

            if (scrollableContainer && isScrollable(scrollableContainer)) {
                // Nutze natives Browser-Scrolling (kein preventDefault)
                // Browser scrollt automatisch mit korrekter Geschwindigkeit

                // Nur wenn am Scroll-Limit, verhindere Seiten-Scroll
                const deltaY = e.deltaY || e.detail || -(e.wheelDelta || 0);
                if (isAtScrollLimit(scrollableContainer, deltaY)) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                // Sonst: Lass natives Scrolling zu
            } else {
                // Nicht scrollbar: verhindere Seiten-Scroll
                e.preventDefault();
                e.stopPropagation();
            }
        }
    }

    // Event-Listener für das Mausrad mit passiver Option auf false (damit preventDefault funktioniert)
    document.addEventListener('wheel', handleScroll, { passive: false });

    function handleTouchStart(e) {
        const touch = e.touches[0];
        touchStartY = touch.clientY;

        const uiElements = [
            settingsDiv,
            merchantListDiv,
            wordsListDiv,
            document.getElementById('wordSuggestionList')
        ];

        isScrollingUI = uiElements.some(el => {
            if (!el?.parentNode) return false;
            const rect = el.getBoundingClientRect();
            return touch.clientX >= rect.left &&
                touch.clientX <= rect.right &&
                touch.clientY >= rect.top &&
                touch.clientY <= rect.bottom;
        });
    }

    function handleTouchMove(e) {
        if (!isScrollingUI) return;

        const scrollableElement = e.target.closest('#mdm-settings-content, #merchantList, #wordsList');

        if (scrollableElement && isScrollable(scrollableElement)) {
            // Erlaube natives Touch-Scrolling für scrollbare Elemente
            // Prüfe ob am Anfang oder Ende des Scrollbereichs
            const touch = e.touches[0];
            const deltaY = touchStartY - touch.clientY;

            if (isAtScrollLimit(scrollableElement, deltaY)) {
                // Am Limit: Verhindere Seiten-Scroll
                e.preventDefault();
            }
            // Sonst: Lass natives Scrolling zu (kein preventDefault)
        } else {
            // Blockiere Scrollen außerhalb der Listen
            e.preventDefault();
        }
    }

    function handleMouseEnter() {
        isScrollingUI = true;
        lastActiveUI = this;
    }

    function handleMouseLeave() {
        isScrollingUI = false;
        lastActiveUI = null;
    }

    function setupUIElement(element) {
        if (!element?.parentNode) return;

        element.addEventListener('mouseenter', handleMouseEnter);
        element.addEventListener('mouseleave', handleMouseLeave);
    }

    function setupAllElements() {
        [
            settingsDiv,
            merchantListDiv,
            wordsListDiv,
            document.getElementById('wordSuggestionList')
        ].forEach(setupUIElement);
    }

    // Initial Setup
    setupAllElements();

    // Event Listener
    if (IS_TOUCH_DEVICE) {
        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
    }

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Cleanup-Funktion
    return () => {
        if (IS_TOUCH_DEVICE) {
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchmove', handleTouchMove);
        }
        document.removeEventListener('wheel', handleScroll);
        [
            settingsDiv,
            merchantListDiv,
            wordsListDiv,
            document.getElementById('wordSuggestionList')
        ].forEach(el => {
            if (el?.parentNode) {
                el.removeEventListener('mouseenter', handleMouseEnter);
                el.removeEventListener('mouseleave', handleMouseLeave);
            }
        });
        observer.disconnect();
    };
}

// --- Delete-Operationen ---
function handleWordDelete(e) {
    e.preventDefault();
    e.stopPropagation();

    const deleteButton = e.target.closest('.delete-word');
    if (!deleteButton) return;

    const wordToDelete = deleteButton.dataset.word;
    const wordItem = deleteButton.closest('.word-item');

    // Update excludeWords array
    excludeWords = excludeWords.filter(word => word !== wordToDelete);
    saveExcludeWords(excludeWords);

    // Get search state and counts
    const searchInput = document.getElementById('wordSearch');
    const searchTerm = searchInput?.value.trim().toLowerCase();
    const totalItems = document.querySelectorAll('.word-item').length;

    // Calculate visible items for search
    let visibleCount = 0;
    if (searchTerm) {
        const visibleItems = Array.from(document.querySelectorAll('.word-item')).filter(item => {
            const itemWord = item.querySelector('span').textContent.toLowerCase();
            const isVisible = itemWord.includes(searchTerm) && itemWord !== wordToDelete.toLowerCase();
            return isVisible;
        });
        visibleCount = visibleItems.length;
    }

    // Remove item and update UI
    wordItem.remove();
    processArticles();

    // Update counter in heading
    const heading = wordsListDiv.querySelector('h4');
    if (heading) {
        const newTotal = totalItems - 1;
        heading.textContent = searchTerm
            ? `Ausgeblendete Wörter (${visibleCount}/${newTotal})`
            : `Ausgeblendete Wörter (${newTotal})`;
    }
}
// Händler-Löschung Handler
function handleMerchantDelete(e) {
    e.preventDefault();
    e.stopPropagation();

    const deleteButton = e.target.closest('.delete-merchant');
    if (!deleteButton) return;

    const idToDelete = deleteButton.dataset.id;
    const merchantItem = deleteButton.closest('.merchant-item');

    // Update merchants array
    const merchantsData = loadExcludeMerchants();
    const updatedMerchants = merchantsData.filter(m => m.id !== idToDelete);
    saveExcludeMerchants(updatedMerchants);

    // Get search state and counts
    const searchInput = document.getElementById('merchantSearch');
    const searchTerm = searchInput?.value.trim().toLowerCase();
    const totalItems = document.querySelectorAll('.merchant-item').length;

    // Calculate visible items for search
    let visibleCount = 0;
    if (searchTerm) {
        const visibleItems = Array.from(document.querySelectorAll('.merchant-item')).filter(item => {
            const merchantName = item.querySelector('span').textContent.toLowerCase();
            const isVisible = merchantName.includes(searchTerm) &&
                  item.querySelector('.delete-merchant').dataset.id !== idToDelete;
            return isVisible;
        });
        visibleCount = visibleItems.length;
    }

    // Remove item and update UI
    merchantItem.remove();
    processArticles();

    // Update counter in heading
    const heading = merchantListDiv.querySelector('h4');
    if (heading) {
        const newTotal = totalItems - 1;
        heading.textContent = searchTerm
            ? `Ausgeblendete Händler (${visibleCount}/${newTotal})`
            : `Ausgeblendete Händler (${newTotal})`;
    }
}

// === Layout & UI-Hilfen ===
// Sub-UI Position berechnen
function getSubUIPosition() {
    const settingsRect = settingsDiv?.getBoundingClientRect();

    if (!settingsRect) return '';

    if (IS_TOUCH_DEVICE) {
        return `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10002;
        `;
    } else {
        const gap = 10;
        return `
            position: fixed;
            top: ${settingsRect.top}px;
            left: ${settingsRect.right + gap}px;
            z-index: 10002;
        `;
    }
}

// Funktion zum Aktualisieren der Sub-UI Positionen
function updateSubUIPositions() {
    // Skip position updates on mobile
    if (IS_TOUCH_DEVICE) return;

    // Settings-UI Position ermitteln
    const settingsDiv = document.getElementById('mdm-settings-popup') || document.querySelector('[id^="mdm-settings"]');
    if (!settingsDiv) return;

    const settingsRect = settingsDiv.getBoundingClientRect();
    const subUIs = [
        document.getElementById('wordsListDiv'),
        document.getElementById('merchantListDiv')
    ];

    // Aktualisiere Position für jedes vorhandene Sub-UI
    subUIs.forEach(ui => {
        if (ui?.parentNode) {
            ui.style.position = 'fixed';
            ui.style.top = `${settingsRect.top}px`;
            ui.style.left = `${settingsRect.right + 10}px`; // 10px Abstand
            ui.style.zIndex = '10002';
        }
    });
}

// Händler zur Liste hinzufügen
function addMerchantToList(merchant, merchantList) {
    const div = document.createElement('div');
    div.className = 'merchant-item';
    div.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; padding: 5px; background: #f0f0f0; border-radius: 3px;';
    div.innerHTML = `
        <span style="font-weight: bold;">${merchant.name}</span>
        <button class="delete-merchant" data-id="${merchant.id}" style="background: none; border: none; cursor: pointer; color: #666;">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Insert at beginning of list
    merchantList.insertBefore(div, merchantList.firstChild);
}

// Helper function to manage Sub-UI states
function switchSubUI(newUI) {
    // If trying to open the same UI that's already active, close it
    if (activeSubUI === newUI) {
        closeActiveSubUI();
        return false;
    }

    // Close any active Sub-UI first
    if (activeSubUI) {
        closeActiveSubUI();
    }

    // Set new active UI
    activeSubUI = newUI;

    // Update button texts
    const merchantButton = document.getElementById('showMerchantListButton');
    const wordsButton = document.getElementById('showWordsListButton');
    const usersButton = document.getElementById('showBlockedUsersButton');

    if (merchantButton) {
        merchantButton.innerHTML = activeSubUI === 'merchant'
            ? '<i class="fas fa-times"></i> Händlerfilter schließen'
            : '<i class="fas fa-store"></i> Händlerfilter verwalten';
    }

    if (wordsButton) {
        wordsButton.innerHTML = activeSubUI === 'words'
            ? '<i class="fas fa-times"></i> Wortfilter schließen'
            : '<i class="fas fa-list"></i> Wortfilter verwalten';
    }

    if (usersButton) {
        usersButton.innerHTML = activeSubUI === 'users'
            ? '<i class="fas fa-times"></i> Benutzerfilter schließen'
            : '<i class="fas fa-user-slash"></i> Benutzerfilter verwalten';
    }

    return true;
}

function closeActiveSubUI() {
    if (activeSubUI === 'merchant') {
        merchantListDiv?.remove();
    } else if (activeSubUI === 'words') {
        wordsListDiv?.remove();
    } else if (activeSubUI === 'users') {
        blockedUsersDiv?.remove();
    }

    // Reset button texts
    const merchantButton = document.getElementById('showMerchantListButton');
    const wordsButton = document.getElementById('showWordsListButton');
    const usersButton = document.getElementById('showBlockedUsersButton');

    if (merchantButton) {
        merchantButton.innerHTML = '<i class="fas fa-store"></i> Händlerfilter verwalten';
        merchantButton.removeAttribute('data-processing');
    }

    if (wordsButton) {
        wordsButton.innerHTML = '<i class="fas fa-list"></i> Wortfilter verwalten';
    }

    if (usersButton) {
        usersButton.innerHTML = '<i class="fas fa-user-slash"></i> Benutzerfilter verwalten';
    }

    activeSubUI = null;
}

//#endregion




//#region --- 5. Deal-Verarbeitung ---
// ===== Hauptfunktionen =====

// Cache für bereits verarbeitete Deals mit maximaler Größe
const MAX_CACHE_SIZE = 500; // Max 500 Deals im Cache
const processedDealsCache = new Map();

function addToDealCache(key, value) {
    // Wenn Cache zu groß, ältesten Eintrag entfernen
    if (processedDealsCache.size >= MAX_CACHE_SIZE) {
        const firstKey = processedDealsCache.keys().next().value;
        processedDealsCache.delete(firstKey);

        if (DEBUG.performance.caching) {
            perfTracker.log('caching', 'eviction', {
                evictedKey: firstKey,
                reason: 'MAX_CACHE_SIZE reached',
                cacheSize: processedDealsCache.size
            });
        }
    }
    processedDealsCache.set(key, value);
    perfTracker.update('caching.size', processedDealsCache.size);
}

// Artikel verarbeiten und filtern
function processArticles() {
    perfTracker.start('processArticles');
    perfTracker.update('processArticles.calls', 1);
    perfTracker.resetBatch();

    // Lade blockierte Benutzer für die Filterung
    const blockedUsers = GM_getValue('blockedUsers', []);
    if (DEBUG.userBlocking) {
        console.log('[MDM UserBlock] Processing articles, blocked users:', blockedUsers);
    }

    const deals = document.querySelectorAll('article.thread--deal, article.thread--voucher');

    if (DEBUG.performance.processing) {
        perfTracker.log('processing', 'start', { dealCount: deals.length });
    }

    perfTracker.update('processArticles.articlesProcessed', deals.length);

    // Cache-Größe begrenzen wenn zu viele Einträge
    if (processedDealsCache.size > MAX_CACHE_SIZE * 1.5) {
        processedDealsCache.clear();
        if (DEBUG.performance.caching) {
            perfTracker.log('caching', 'full-clear', { reason: 'Cache exceeded 1.5x MAX_SIZE' });
        }
    }

    // Batch DOM-Updates für bessere Performance
    const dealsToHide = [];
    const dealsToShow = [];

    deals.forEach(deal => {
        const dealId = deal.getAttribute('id') || '';

        if (hiddenDeals.includes(dealId)) {
            dealsToHide.push(deal);
            return;
        }

        // Prüfe ob Deal von blockiertem Benutzer
        if (blockedUsers.length > 0) {
            // Normalisiere blockierte User zu Kleinbuchstaben für Vergleich
            const normalizedBlockedUsers = blockedUsers.map(u => u.toLowerCase());
            
            // Methode 1: data-md-author Attribut
            let username = deal.getAttribute('data-md-author');
            
            // Methode 2: User-Link
            if (!username) {
                const userLink = deal.querySelector('a[data-t="userLink"]');
                if (userLink) {
                    username = userLink.textContent.trim();
                }
            }
            
            // Methode 3: Span-Text "Veröffentlicht von"
            if (!username) {
                const userSpan = deal.querySelector('.overflow--ellipsis.size--all-xs.size--fromW3-s');
                if (userSpan) {
                    const match = userSpan.textContent.match(/Veröffentlicht von\s+(\S+)/i);
                    if (match && match[1]) {
                        username = match[1];
                    }
                }
            }
            
            if (username) {
                const normalizedUsername = username.toLowerCase();
                if (normalizedBlockedUsers.includes(normalizedUsername)) {
                    if (DEBUG.userBlocking) {
                        console.log('[MDM UserBlock] Hiding deal from blocked user:', { dealId, username: normalizedUsername });
                    }
                    dealsToHide.push(deal);
                    return;
                }
            }
        }

        // Cold Deals Prüfung ZUERST (muss hier sein wegen DOM-Timing)
        if (hideColdDeals) {
            const tempElement = deal.querySelector('.cept-vote-temp .overflow--wrap-off') ||
                               deal.querySelector('.vote-temp .overflow--wrap-off');
            if (tempElement) {
                const temperatureText = tempElement.textContent.trim();
                const temperatureMatch = temperatureText.match(/([-+]?\d+)°/);
                const temperature = temperatureMatch ? parseInt(temperatureMatch[1]) : null;

                if (temperature !== null && temperature < 0) {
                    dealsToHide.push(deal);
                    return;
                }
            }
        }

        // Händler-Prüfung ZUERST (muss hier sein wegen DOM-Timing)
        if (excludeMerchantsCache.ids.size || excludeMerchantsCache.normalizedNames.size) {
            const merchantInfo = getArticleMerchantInfo(deal);
            const { merchantId, merchantName } = merchantInfo;

            if (merchantId && excludeMerchantsCache.ids.has(String(merchantId))) {
                dealsToHide.push(deal);
                return;
            }

            const normalizedMerchantName = merchantName ? normalizeForSearch(merchantName) : '';
            if (normalizedMerchantName && excludeMerchantsCache.normalizedNames.has(normalizedMerchantName)) {
                dealsToHide.push(deal);
                return;
            }
        }

        // Cache-Prüfung: Nur neu evaluieren wenn sich Filter geändert haben
        const cacheKey = `${dealId}_${excludeWords.length}_${maxPrice}`;
        const cachedResult = processedDealsCache.get(cacheKey);

        if (cachedResult !== undefined) {
            perfTracker.update('caching.hits', 1);
            perfTracker.currentBatch.caching.hits++;
            perfTracker.currentBatch.caching.dealIds.hits.push(dealId);

            if (cachedResult) {
                dealsToHide.push(deal);
            } else {
                dealsToShow.push(deal);
            }
            return;
        }

        perfTracker.update('caching.misses', 1);
        perfTracker.currentBatch.caching.misses++;
        perfTracker.currentBatch.caching.dealIds.misses.push(dealId);

        // Nur bei neuem Deal oder geänderten Filtern evaluieren
        const shouldExclude = shouldExcludeArticle(deal);
        addToDealCache(cacheKey, shouldExclude);

        if (shouldExclude) {
            dealsToHide.push(deal);
            return;
        }

        dealsToShow.push(deal);

        if (window.hideMatchingMerchantNames) {
            const titleElement = deal.querySelector('.thread-title');
            const merchantLink = deal.querySelector('a[data-t="merchantLink"]');
            const merchantSpan = deal.querySelector('.color--text-TranslucentSecondary.size--all-xs span:last-child');

            if (!titleElement && DEBUG.criticalErrors) {
                console.warn('[MDM Critical] ⚠ hideMatchingMerchantNames: Selector ".thread-title" returned no element for deal:', dealId);
            }

            if (titleElement) {
                let merchantName = null;
                let foundVia = null;

                if (merchantLink) {
                    merchantName = merchantLink.textContent.trim();
                    foundVia = 'merchantLink';
                    if (DEBUG.hideMatchingMerchantNames) {
                        console.log('[MDM MerchantNames] ✓ Found via a[data-t="merchantLink"]:', merchantName);
                    }
                } else if (merchantSpan) {
                    merchantName = merchantSpan.textContent.trim();
                    foundVia = 'merchantSpan';
                    if (DEBUG.hideMatchingMerchantNames) {
                        console.log('[MDM MerchantNames] ✓ Found via span:', merchantName);
                    }
                } else if (DEBUG.criticalErrors) {
                    console.warn('[MDM Critical] ⚠ hideMatchingMerchantNames: Beide Selektoren fehlgeschlagen für deal:', dealId);
                    console.warn('[MDM Critical]   - a[data-t="merchantLink"]: nicht gefunden');
                    console.warn('[MDM Critical]   - .color--text-TranslucentSecondary.size--all-xs span:last-child: nicht gefunden');
                }

                if (merchantName) {
                    const titleLink = titleElement.querySelector('a');
                    if (titleLink) {
                        if (!ORIGINAL_TITLES.has(dealId)) {
                            ORIGINAL_TITLES.set(dealId, titleLink.textContent);
                        }

                        const originalTitle = ORIGINAL_TITLES.get(dealId) || titleLink.textContent;
                        const newTitle = removeMerchantNameFromTitle(originalTitle, merchantName);

                        if (originalTitle !== newTitle) {
                            titleLink.textContent = newTitle;
                            perfTracker.update('domUpdates.titleChanges', 1);
                            perfTracker.currentBatch.domUpdates.titleChanges++;
                            if (DEBUG.hideMatchingMerchantNames) {
                                console.log('[MDM MerchantNames] Title changed:', { original: originalTitle, new: newTitle, via: foundVia });
                            }
                        }
                    }
                }
            }
        } else {
            const titleLink = deal.querySelector('.thread-title a');
            if (titleLink && ORIGINAL_TITLES.has(dealId)) {
                titleLink.textContent = ORIGINAL_TITLES.get(dealId);
            }
        }
    });

    // Batch DOM-Updates: Alle auf einmal anwenden für bessere Performance
    dealsToHide.forEach(deal => hideDeal(deal));
    dealsToShow.forEach(deal => showDeal(deal));

    // Nur auf der Suchseite Sucheinstellungen verarbeiten
    if (window.location.pathname === '/search') {
        processSucheinstellungen();
    }

    const duration = perfTracker.end('processArticles');
    perfTracker.update('processArticles.totalTime', duration);

    // Log aggregierte Batch-Daten
    perfTracker.logBatch();

    if (DEBUG.performance.processing) {
        perfTracker.log('processing', 'completed', {
            duration: `${duration.toFixed(2)}ms`,
            articlesProcessed: deals.length,
            avgTimePerArticle: deals.length > 0 ? `${(duration / deals.length).toFixed(3)}ms` : '0ms',
            batchSize: { hidden: dealsToHide.length, shown: dealsToShow.length }
        });
    }
}

// ===== Filterlogik =====
// Ausschlussprüfung für Artikel
function shouldExcludeArticle(article) {

    const titleElement = article.querySelector('.thread-title');
    if (!titleElement) {
        return false;
    }

    if (maxPrice > 0) {
        perfTracker.start('priceFilter');
        perfTracker.update('filtering.priceFilter.calls', 1);

        const priceSelectors = ['.thread-price', '.text--color-greyShade'];
        let foundPrice = false;
        let checkedSelectors = [];

        for (const selector of priceSelectors) {
            const priceElement = article.querySelector(selector);
            if (!priceElement) {
                checkedSelectors.push({ selector, found: false });
                continue;
            }

            checkedSelectors.push({ selector, found: true });
            foundPrice = true;

            const priceText = priceElement.textContent.trim();

            if (DEBUG.priceFilter) {
                console.log('[MDM PriceFilter] Found price element:', { selector, text: priceText });
            }

            if (priceText.includes('%')) continue;
            if (priceText.startsWith('-')) continue;
            if (!priceText.includes('€')) continue;

            const euroFormatMatch = priceText.match(/([\d.,]+)\s*€/);
            if (euroFormatMatch) {
                let extractedPrice = euroFormatMatch[1];
                extractedPrice = extractedPrice.replace(/\./g, '');
                extractedPrice = extractedPrice.replace(',', '.');

                const priceValue = parseFloat(extractedPrice);

                if (!isNaN(priceValue) && priceValue > maxPrice) {
                    perfTracker.update('filtering.priceFilter.hits', 1);
                    perfTracker.currentBatch.filtering.priceExceeded++;

                    if (DEBUG.priceFilter) {
                        console.log('[MDM PriceFilter] Price exceeds max:', { price: priceValue, maxPrice });
                    }

                    const duration = perfTracker.end('priceFilter');
                    perfTracker.update('filtering.priceFilter.totalTime', duration);

                    return true;
                }
            }
        }

        if (!foundPrice && DEBUG.criticalErrors) {
            console.warn('[MDM Critical] ⚠ priceFilter: ALLE Preis-Selektoren fehlgeschlagen!');
            console.warn('[MDM Critical] Checked selectors:', checkedSelectors);
            console.warn('[MDM Critical] Article ID:', article.id);
        }

        const duration = perfTracker.end('priceFilter');
        perfTracker.update('filtering.priceFilter.totalTime', duration);
    }

    const rawTitle = titleElement.querySelector('a')?.getAttribute('title') || titleElement.innerText;
    const normalizedTitle = normalizeForSearch(rawTitle);

    if (!normalizedTitle) {
        return false;
    }

    if (excludeWordCache.length > 0) {
        perfTracker.start('wordFilter');
        perfTracker.update('filtering.wordFilter.calls', 1);

        let matched = false;
        for (const entry of excludeWordCache) {
            if (entry.matcher(normalizedTitle)) {
                matched = true;
                perfTracker.update('filtering.wordFilter.hits', 1);
                perfTracker.currentBatch.filtering.wordMatches++;
                break;
            }
        }

        const duration = perfTracker.end('wordFilter');
        perfTracker.update('filtering.wordFilter.totalTime', duration);

        if (matched) return true;
    }

    return false;
}

// ===== Deal-Management =====
// Deal ausblenden
function hideDeal(deal) {
    if (!deal) return;
    deal.classList.add('mydealz-manager-hidden');
    deal.style.setProperty('display', 'none', 'important');
    deal.setAttribute('data-hidden-by-mydealz-manager', 'true');

    perfTracker.update('domUpdates.hideActions', 1);
    perfTracker.currentBatch.domUpdates.hidden++;
}

function showDeal(deal) {
    if (!deal) return;
    deal.classList.remove('mydealz-manager-hidden');
    deal.style.removeProperty('display');
    deal.style.opacity = '';
    deal.setAttribute('data-hidden-by-mydealz-manager', 'false');

    perfTracker.update('domUpdates.showActions', 1);
    perfTracker.currentBatch.domUpdates.shown++;
}

// Funktion zum Speichern der Sucheinstellungen
function processSucheinstellungen() {

    // Wenn Feature deaktiviert ist, lösche gespeicherte Einstellungen
    if (!window.rememberSort) {
        // Prüfen und entfernen der gespeicherten Einstellungen
        if (localStorage.getItem(PREFERRED_SORT_KEY)) {
            localStorage.removeItem(PREFERRED_SORT_KEY);
        }
        if (localStorage.getItem(PREFERRED_TIMEFRAME_KEY)) {
            localStorage.removeItem(PREFERRED_TIMEFRAME_KEY);
        }
        return;
    }

    // Prüfen, ob wir auf einer Suchseite sind
    if (window.location.pathname.includes('/search')) {
        // Parameter aus URL auslesen
        const params = new URLSearchParams(window.location.search);
        const currentSort = params.get('sortBy');
        const currentTimeframe = params.get('time_frame');

        // Wenn Sortierung vorhanden ist, speichern
        if (currentSort) {
            localStorage.setItem(PREFERRED_SORT_KEY, currentSort);
        }

        // Wenn Zeitraum vorhanden ist, speichern
        if (currentTimeframe) {
            localStorage.setItem(PREFERRED_TIMEFRAME_KEY, currentTimeframe);
        }

        // Wenn keine Sortierung/Zeitraum gesetzt ist, aber gespeicherte Einstellungen existieren
        const savedSort = localStorage.getItem(PREFERRED_SORT_KEY);
        const savedTimeframe = localStorage.getItem(PREFERRED_TIMEFRAME_KEY);

        // NUR redirecten wenn BEIDE Parameter fehlen (frische Suche vom Formular)
        // Wenn nur einer fehlt, hat der User ihn bewusst entfernt
        if ((savedSort || savedTimeframe) &&
            !params.has('sortBy') && !params.has('time_frame')) {

            // Neue URL mit den gespeicherten Einstellungen erstellen
            let newUrl = window.location.href;
            const separator = newUrl.includes('?') ? '&' : '?';
            const additionalParams = [];

            if (savedSort) {
                additionalParams.push('sortBy=' + savedSort);
            }

            if (savedTimeframe) {
                additionalParams.push('time_frame=' + savedTimeframe);
            }

            if (additionalParams.length > 0) {
                newUrl += separator + additionalParams.join('&');
                window.location.href = newUrl;
            }
        }
    }

    // Suchformulare abfangen und anpassen
    const searchForms = document.querySelectorAll('form[action*="/search"]');
    searchForms.forEach(form => {
        // Prüfen, ob das Formular bereits verarbeitet wurde
        if (form.dataset.sortingModified === 'true') return;

        // Markieren, dass das Formular verarbeitet wurde
        form.dataset.sortingModified = 'true';

        // Event-Listener für das Absenden des Formulars hinzufügen
        form.addEventListener('submit', function(e) {
            // Nur fortfahren, wenn Feature aktiviert ist
            if (!window.rememberSort) return;

            const savedSort = localStorage.getItem(PREFERRED_SORT_KEY);
            const savedTimeframe = localStorage.getItem(PREFERRED_TIMEFRAME_KEY);

            if (savedSort || savedTimeframe) {

                // Sortierung hinzufügen
                if (savedSort) {
                    let sortByInput = form.querySelector('input[name="sortBy"]');
                    if (!sortByInput) {
                        sortByInput = document.createElement('input');
                        sortByInput.type = 'hidden';
                        sortByInput.name = 'sortBy';
                        form.appendChild(sortByInput);
                    }
                    sortByInput.value = savedSort;
                }

                // Zeitraum hinzufügen
                if (savedTimeframe) {
                    let timeframeInput = form.querySelector('input[name="time_frame"]');
                    if (!timeframeInput) {
                        timeframeInput = document.createElement('input');
                        timeframeInput.type = 'hidden';
                        timeframeInput.name = 'time_frame';
                        form.appendChild(timeframeInput);
                    }
                    timeframeInput.value = savedTimeframe;
                }
            }
        });
    });
}

// Funktion zum Ausblenden von User-Deals
function handleUserBlock(article) {
    if (DEBUG.userBlocking) {
        console.log('[MDM UserBlock] handleUserBlock called', { article: article?.id });
    }
    
    let username = null;
    let foundVia = null;
    
    // Methode 1: data-md-author Attribut (zuverlässigste Methode)
    username = article.getAttribute('data-md-author');
    if (username) {
        foundVia = 'data-md-author';
        if (DEBUG.userBlocking) {
            console.log('[MDM UserBlock] ✓ Username found via data-md-author:', username);
        }
    } else if (DEBUG.criticalErrors) {
        console.warn('[MDM Critical] ⚠ data-md-author attribute not found on article');
    }
    
    // Methode 2: Span mit "Veröffentlicht von" Text
    if (!username) {
        const userSpan = article.querySelector('.overflow--ellipsis.size--all-xs.size--fromW3-s');
        if (userSpan) {
            const match = userSpan.textContent.match(/Veröffentlicht von\s+(\S+)/i);
            if (match && match[1]) {
                username = match[1];
                foundVia = 'span-text';
                if (DEBUG.userBlocking) {
                    console.log('[MDM UserBlock] ✓ Username found via span text:', username);
                }
            } else if (DEBUG.criticalErrors) {
                console.warn('[MDM Critical] ⚠ Span found but regex did not match. Text:', userSpan.textContent);
            }
        } else if (DEBUG.criticalErrors) {
            console.warn('[MDM Critical] ⚠ Selector ".overflow--ellipsis.size--all-xs.size--fromW3-s" returned no element');
        }
    }
    
    // Methode 3: User-Link im Header
    if (!username) {
        const userLink = article.querySelector('a[data-t="userLink"]');
        if (userLink) {
            username = userLink.textContent.trim();
            foundVia = 'userLink';
            if (DEBUG.userBlocking) {
                console.log('[MDM UserBlock] ✓ Username found via userLink:', username);
            }
        } else if (DEBUG.criticalErrors) {
            console.warn('[MDM Critical] ⚠ Selector "a[data-t=\"userLink\"]" returned no element');
        }
    }
    
    if (!username) {
        console.error('[MDM Critical] ❌ ALLE Selektoren fehlgeschlagen! Kann Username nicht finden.');
        console.error('[MDM Critical] Article ID:', article.id);
        console.error('[MDM Critical] Article HTML (first 500 chars):', article.innerHTML.substring(0, 500));
        if (DEBUG.userBlocking) {
            console.log('[MDM UserBlock] Article attributes:', {
                id: article.id,
                'data-md-author': article.getAttribute('data-md-author'),
                'data-md-state': article.getAttribute('data-md-state')
            });
        }
        alert('Benutzerinformation konnte nicht gefunden werden.');
        return;
    }
    
    // Username normalisieren (Kleinbuchstaben für Vergleich)
    username = username.toLowerCase();
    if (DEBUG.userBlocking) {
        console.log('[MDM UserBlock] Normalized username:', username);
    }

    // Bestätigungsdialog
    if (!confirm(`Möchtest du wirklich alle Deals von "${username}" ausblenden?`)) {
        if (DEBUG.userBlocking) {
            console.log('[MDM UserBlock] User cancelled blocking');
        }
        return;
    }

    // Lade blockierte Benutzer
    const blockedUsers = GM_getValue('blockedUsers', []);
    if (DEBUG.userBlocking) {
        console.log('[MDM UserBlock] Current blocked users:', blockedUsers);
    }
    
    if (!blockedUsers.includes(username)) {
        blockedUsers.push(username);
        GM_setValue('blockedUsers', blockedUsers);
        if (DEBUG.userBlocking) {
            console.log('[MDM UserBlock] User added to blocklist:', username);
            console.log('[MDM UserBlock] Updated blocklist:', blockedUsers);
        }
    } else {
        if (DEBUG.userBlocking) {
            console.log('[MDM UserBlock] User already in blocklist:', username);
        }
    }

    // Aktualisiere die Anzeige
    processArticles();
    if (DEBUG.userBlocking) {
        console.log('[MDM UserBlock] processArticles called to refresh display');
    }
}

//#endregion




//#region --- 6. Initialisierung und Setup ---
function init() {
    // ===== 1. Grundeinstellungen und gespeicherte Daten laden =====
    // --- Grundeinstellungen ---
    syncStorage();
    excludeWords = loadExcludeWords();
	rebuildExcludeWordCache(excludeWords);
    loadSettings();

    // --- Deal-Listen ---
    hiddenDeals = GM_getValue('hiddenDeals', []);
    recentHiddenDeals = GM_getValue('recentHiddenDeals', []);

    // --- Sortierung merken ---
    window.rememberSort = GM_getValue('rememberSort', true);
    processSucheinstellungen();

    // ===== 2. Filter-Einstellungen =====
    // --- Preisfilter ---
    maxPrice = parseFloat(localStorage.getItem(MAX_PRICE_KEY)) || 0;

    // --- Kalte Deals ---
    hideColdDeals = localStorage.getItem(HIDE_COLD_DEALS_KEY) === 'true';

    // ===== 3. Feature-Flags und UI-Status =====

    // --- Share Buttons ---
    window.hideShareButtons = GM_getValue('hideShareButtons', false);
    localStorage.setItem('hideShareButtons', window.hideShareButtons.toString());
    updateShareButtonsVisibility(window.hideShareButtons);

    // --- Händlernamen ---
    window.hideMatchingMerchantNames = GM_getValue('hideMatchingMerchantNames', false);
    localStorage.setItem('hideMatchingMerchantNames', window.hideMatchingMerchantNames.toString());

    // ===== 5. System-Initialisierung =====

    // --- UI ---
    initializeUI();
    initObserver();

    // --- Scroll Handling (nur einmal global initialisieren) ---
    setupScrollHandling();
}

//#endregion




//#region --- 7. Backup und Wiederherstellung ---
// ===== Backup-Funktionen =====
// --- Datei-Erstellung ---
function createBackupFile(backup, deviceName) {
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    // Neues Datumsformat
    const now = new Date();
    const timestamp = now.toISOString()
    .replace('T', '_') // T durch _ ersetzen
    .split('.')[0] // Millisekunden entfernen
    .replace(/:/g, '.') // : durch . ersetzen
    .replace(/-/g, '-'); // - behalten

    a.href = url;
    a.download = `mydealz_backup_${deviceName}_${timestamp}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// --- Backup-Prozess ---
function backupData() {
    try {
        // 1. Daten laden
        const currentWords = loadExcludeWords();
        const currentMerchants = loadExcludeMerchants();
        const currentBlockedUsers = GM_getValue('blockedUsers', []);
        
        if (DEBUG.backup) {
            console.log('[MDM Backup] Creating backup with data:', {
                words: currentWords.length,
                merchants: currentMerchants.length,
                blockedUsers: currentBlockedUsers.length,
                blockedUsersList: currentBlockedUsers
            });
        }

        // 2. Backup-Objekt erstellen
        const backup = {
            excludeWords: currentWords,
            merchantsData: currentMerchants,
            blockedUsers: currentBlockedUsers,
            maxPrice: maxPrice,
            hideColdDeals: hideColdDeals
        };
        
        if (DEBUG.backup) {
            console.log('[MDM Backup] Backup object created:', backup);
        }

        // 3. Geräte-Erkennung
        let deviceType = "Desktop";
        if (IS_TOUCH_DEVICE) {
            // Überprüfe, ob es ein mobiles Gerät ist
            const userAgent = navigator.userAgent.toLowerCase();
            if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
                deviceType = "iOS";
            } else if (userAgent.includes('android')) {
                deviceType = "Android";
            } else {
                deviceType = "Tablet/Touch";
            }
        }

        // 4. Gerätenamen-Verwaltung
        const DEVICE_NAME_KEY = 'mdm_device_name';
        const customDeviceName = localStorage.getItem(DEVICE_NAME_KEY) || GM_getValue(DEVICE_NAME_KEY, '');

        // 5. Backup-Erstellung
        if (!customDeviceName) {
            // Neuen Gerätenamen abfragen
            const newName = prompt(
                "Wie möchtest du dieses Gerät nennen?\n" +
                "Dies hilft dir, Backups von verschiedenen Geräten zu unterscheiden.",
                deviceType
            );

            if (newName !== null) {
                const deviceName = newName.trim() || deviceType;
                // In beiden Speichern ablegen
                localStorage.setItem(DEVICE_NAME_KEY, deviceName);
                GM_setValue(DEVICE_NAME_KEY, deviceName);

                // Mit dem neuen Namen das Backup erstellen
                createBackupFile(backup, deviceName);
            }
        } else {
            // Mit dem vorhandenen Namen das Backup erstellen
            createBackupFile(backup, customDeviceName);
        }
    } catch (error) {
        console.error('Backup error:', error);
        alert('Fehler beim Erstellen des Backups: ' + error.message);
    }
}

// ===== Wiederherstellungs-Funktionen =====
// --- Daten-Wiederherstellung ---
function restoreData(event) {
    // 1. Datei-Validierung
    const file = event.target.files[0];
    if (!file || file.type !== 'application/json') {
        console.error('Invalid file:', file);
        alert('Bitte wählen Sie eine gültige JSON-Datei aus.');
        return;
    }

    // 2. Datei-Verarbeitung
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            // 3. Daten-Parsing
            const restoredData = JSON.parse(e.target.result);
            
            if (DEBUG.backup) {
                console.log('[MDM Restore] Restored data:', restoredData);
                console.log('[MDM Restore] Blocked users in backup:', restoredData.blockedUsers);
            }

            // 4. Aktuelle Daten laden
            const currentWords = new Set(loadExcludeWords());
            const currentMerchants = new Map(
                loadExcludeMerchants().map(m => [m.id, m])
            );
            const currentBlockedUsers = new Set(GM_getValue('blockedUsers', []));
            if (DEBUG.backup) {
                console.log('[MDM Restore] Current blocked users:', Array.from(currentBlockedUsers));
            }
            console.log('[MDM Restore] Current blocked users:', Array.from(currentBlockedUsers));

            // 5. Zähler für neue Einträge initialisieren
            const changes = {
                words: 0,
                merchants: 0,
                users: 0
            };

            // 6. Daten zusammenführen
            // --- Wörter ---
            restoredData.excludeWords.forEach(word => {
                if (!currentWords.has(word)) {
                    currentWords.add(word);
                    changes.words++;
                }
            });
            const mergedWords = Array.from(currentWords);

            // --- Händler ---
            restoredData.merchantsData.forEach(merchant => {
                if (!currentMerchants.has(merchant.id)) {
                    currentMerchants.set(merchant.id, merchant);
                    changes.merchants++;
                }
            });
            const mergedMerchants = Array.from(currentMerchants.values());

            // --- Blockierte Benutzer (falls im Backup vorhanden) ---
            if (restoredData.blockedUsers) {
                restoredData.blockedUsers.forEach(user => {
                    if (!currentBlockedUsers.has(user)) {
                        currentBlockedUsers.add(user);
                        changes.users++;
                    }
                });
            }

            // 7. Daten speichern
            // --- Wortfilter ---
            GM_setValue('excludeWords', mergedWords);
            localStorage.setItem('excludeWords', JSON.stringify(mergedWords));
            excludeWords = mergedWords;

            // --- Händlerfilter ---
            saveExcludeMerchants(mergedMerchants);

            // --- Blockierte Benutzer ---
            const mergedBlockedUsers = Array.from(currentBlockedUsers);
            GM_setValue('blockedUsers', mergedBlockedUsers);

            // --- Einstellungen ---
            if (typeof restoredData.maxPrice === 'number' && maxPrice === 0) {
                saveMaxPrice(restoredData.maxPrice);
            }

            if (typeof restoredData.hideColdDeals === 'boolean' && !hideColdDeals) {
                hideColdDeals = restoredData.hideColdDeals;
                GM_setValue('hideColdDeals', hideColdDeals);
                localStorage.setItem('hideColdDeals', hideColdDeals);
            }

            // 8. UI aktualisieren
            if (isSettingsOpen) {
                updateUITheme();
            }
            processArticles();

            // 9. Zusammenfassende Meldung erstellen
            let message = 'Backup wurde erfolgreich wiederhergestellt.\n\nNeue Einträge:';

            if (changes.words > 0) {
                message += `\n• ${changes.words} neue Wörter`;
            }
            if (changes.merchants > 0) {
                message += `\n• ${changes.merchants} neue Händler`;
            }
            if (changes.users > 0) {
                message += `\n• ${changes.users} neue blockierte Benutzer`;
            }

            if (changes.words === 0 && changes.merchants === 0 && changes.users === 0) {
                message += '\nKeine neuen Einträge gefunden.';
            }

            alert(message);

        } catch (error) {
            console.error('Restore error:', error);
            alert('Fehler beim Wiederherstellen des Backups: ' + error.message);
        }
    };

    reader.readAsText(file);
}

//#endregion




//#region --- 8. Hilfsfunktionen ---
// ===== Text-Verarbeitung =====
// --- Händlernamen-Verarbeitung ---
function removeMerchantNameFromTitle(title, merchant) {
    if (!title || !merchant) return title;

    // Normalisiere Händlernamen und hole Konfiguration
    const merchantName = merchant.toLowerCase()
                            .replace('...', '')

    // Wenn der Händlername CamelCase ist (z.B. FrankfurterRundschau, BerlinerMorgenpost)
    // erstelle eine Version mit Leerzeichen (z.B. "Frankfurter Rundschau", "Berliner Morgenpost")
    if (/^[A-Z][a-z]+(?:[A-Z][a-z]+)+$/.test(merchant)) {
        // Teile den CamelCase Namen an Großbuchstaben
        const spacedVersion = merchant.split(/(?=[A-Z])/).join(' ');

        // Prüfe ob die Version mit Leerzeichen im Titel vorkommt
        const spacedRegex = new RegExp(`\\b${spacedVersion}\\b`, 'i');
        if (title.match(spacedRegex)) {
            title = title.replace(spacedRegex, '');
            return title.trim();
        }
    }

    // NEU: Minimum Länge für Domain-basierte Entfernung
    const MIN_DOMAIN_LENGTH = 4;
    if (merchantName.includes('.')) {
        const domainWithoutExt = merchantName.split('.')[0];
        if (domainWithoutExt.length < MIN_DOMAIN_LENGTH) {
            return title;
        }
    }

    // Spezialfall für eSIM.sm - wir wollen "eSIM" nicht entfernen, da es ein Produktname ist
    if (merchantName === 'esim.sm' && title.toLowerCase().includes('auf esim')) {
        return title;
    }

    // Extrahiere den Basis-Namen aus dem Händlernamen, wenn es sich um eine Domain handelt
    let baseShopName = merchantName;
    if (merchantName.includes('-shop')) {
        baseShopName = merchantName.split('-shop')[0];
    } else if (merchantName.includes('.')) {
        // Extrahiere den Basisnamen aus Domains wie CDKeys.com -> CDKeys
        baseShopName = merchantName.split('.')[0];
    }

    // Handle special case for any merchant-related pattern in parentheses at beginning
    if (title.match(/^\([^)]+\)/i)) {
        const lowerTitle = title.toLowerCase();
        const lowerMerchant = merchantName.toLowerCase();

        // Check if merchant name is contained in the parentheses at the beginning
        if (lowerTitle.substring(0, lowerTitle.indexOf(')')).includes(lowerMerchant)) {
            // Prüfe auf Slash-Format
            if (title.match(/^\([^/]+\/[^)]+\)/i)) {
                // Behandle Slash-Format separat
                return title.replace(
                    new RegExp(`\\(${merchantName}\\s*/\\s*(.+?)\\)`, 'i'),
                    '($1)'
                );
            }
            return title.replace(/^\([^)]+\)\s*/, '');
        }
    }

    // Händler-spezifische Transformationen definieren
    const getMerchantConfig = (merchant) => {
        switch (merchant) {
            case 'Netto Marken-Discount':
                return {
                    abbreviations: ['netto md'],
                    replacements: [
                        // Entfernt "Netto Marken Discount -" nach lokaler Angabe
                        { from: /(\[\s*lokal[^\]]+\])\s*netto\s+marken[-\s]discount\s*-\s*/i, to: '$1 ' },
                        // Entfernt "bei Netto Marken-Discount gibt es"
                        { from: /\s+bei\s+netto\s+marken[-\s]discount\s+gibt\s+es\s*/i, to: ' ' },
                        // Standardfälle für Netto
                        { from: /(?<!\[.+)\s*(?:bei\s+)?netto\s+marken[-\s]discount[-\s]*/i, to: ' ' }
                    ],
                    keepBrands: []
                };
            case 'Kaufland':
                return {
                    abbreviations: [],
                    replacements: [
                        { from: /kaufland[\s-]card/i, to: 'K-Card' },
                        // Entfernt "bei Kaufland" auch in der Mitte
                        { from: /\s+bei\s+kaufland(?:\s*-\s*)/i, to: ' - ' }
                    ],
                    keepBrands: ['Card']
                };
            case 'Amazon':
                return {
                    abbreviations: [],
                    replacements: [
                        // Besonders behandelte Muster für Amazon Prime
                        { from: /\[amazon\s+prime\]/i, to: '[Prime]' },
                        { from: /\[amazon\s+(prime\s+\w+)\]/i, to: '[$1]' },
                        // Ersetze "Amazon Prime" mit "Prime" (außerhalb von Klammern)
                        { from: /\bamazon\s+prime\b/i, to: 'Prime' },
                        // Erhalte "Prime Video", "Prime Gaming" usw.
                        { from: /\bamazon\s+(prime\s+\w+)\b/i, to: '$1' }
                    ],
                    keepBrands: ['Prime']
                };
            case 'Best Secret':
                return {
                    abbreviations: ['BestSecret'],
                    replacements: [],
                    keepBrands: []
                };
            case 'TradePub.com':
                return {
                    abbreviations: ['tradepub', 'Tradepub'],
                    replacements: [
                        { from: /\s+bei\s+tradepub\.com(?:\s+|$)/i, to: ' ' },
                        { from: /^tradepub\.com:\s*/i, to: '' },
                        { from: /^\(tradepub\)\s*/i, to: '' },
                        // Neues Pattern für (Tradepub) mit Groß-/Kleinschreibung
                        { from: /^\((?:Tradepub|TRADEPUB|tradepub)\)\s*/i, to: '' }
                    ],
                    keepBrands: []
                };
            case 'Netto':
                return {
                    abbreviations: ['netto mit hund'],
                    replacements: [
                        // Entfernt "[Netto mit Hund]" Format
                        { from: /\[netto\s+mit\s+hund\]\s*/i, to: '' }
                    ],
                    keepBrands: []
                };
            case 'A.T.U':
                return {
                    abbreviations: ['atu', 'a.t.u'],
                    replacements: [
                        { from: /(Sale)\s+bei\s+(?:ATU|A\.T\.U)(\s*;\s*)(Ab)/i, to: '$1$2$3' }
                    ],
                    keepBrands: []
                };
            case 'Uber Eats':
                return {
                    abbreviations: ['ubereats'],
                    replacements: [
                        // Spezifisches Pattern für "[UberEats Member Days]" Format
                        { from: /\[UberEats\s+(Member\s+Days)\]/i, to: '[$1]' }
                    ],
                    keepBrands: ['Member Days']
                };
            case 'Steam':
                return {
                    abbreviations: [],
                    replacements: [
                        // Behandle [Steam/Something] und [Steam / Something] Format am Anfang
                        { from: /\[\s*Steam\s*\/\s*([^\]]+)\]/i, to: '[$1]' },
                        // Generische Steam-Patterns
                        { from: /\[Steam\]\s*/i, to: '' },
                        { from: /\s+auf\s+Steam$/i, to: '' },
                        { from: /\s+bei\s+Steam$/i, to: '' }
                    ],
                    keepBrands: []
                };
            case 'Zalando':
                return {
                    abbreviations: [],
                    replacements: [
                        // Spezifisches Pattern für "[Zalando Plus]" Format
                        { from: /\[Zalando\s+(Plus)\]/i, to: '[$1]' },
                        // Standardmuster
                        { from: /\[Zalando\]\s*/i, to: '' },
                        { from: /\s+bei\s+Zalando$/i, to: '' },
                        { from: /\s+auf\s+Zalando$/i, to: '' }
                    ],
                    keepBrands: ['Plus']
                };
            default:
                return { abbreviations: [], replacements: [], keepBrands: [] };
        }
    };

    const config = getMerchantConfig(merchant);

    // Führe erst spezielle Ersetzungen durch
    let result = title;
    config.replacements.forEach(({ from, to }) => {
        result = result.replace(from, to);
    });

    // Spezielle Muster für [Händler| Format]
    result = result.replace(new RegExp(`\\[${merchantName.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\|\\s*`, 'i'), '[');

    // Wenn wir einen Basis-Namen extrahiert haben, auch diesen behandeln
    if (baseShopName !== merchantName) {
        result = result.replace(new RegExp(`\\[${baseShopName.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\|\\s*`, 'i'), '[');
    }

    // Erstelle Domain-Varianten für den Händlernamen und den Basis-Namen
    const createDomainVariants = (name) => [
        `${name}.com`,
        `${name}.de`,
        `${name}.co.uk`,
        `${name}-shop.com`,
        `${name}-shop.de`
    ];

    const domainVariants = createDomainVariants(merchantName);

    // Füge auch Domain-Varianten für den Basis-Namen hinzu
    if (baseShopName !== merchantName) {
        domainVariants.push(...createDomainVariants(baseShopName));
    }

    // Entferne explizit [Domain]-Muster am Anfang des Titels
    const handleBracketedDomain = (shopName) => {
        const escapedName = shopName.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
        result = result.replace(new RegExp(`\\[${escapedName}\\.com\\]`, 'i'), '');
        result = result.replace(new RegExp(`\\[${escapedName}\\.de\\]`, 'i'), '');
        result = result.replace(new RegExp(`\\[${escapedName}\\.co\\.uk\\]`, 'i'), '');
    };

    // Wende auf beide Namen an
    handleBracketedDomain(merchantName);
    if (baseShopName !== merchantName) {
        handleBracketedDomain(baseShopName);
    }

    // Erstelle Varianten des Händlernamens
    const merchantVariants = [
        merchantName,
        merchantName.replace(/\s+/g, '-'),
        merchantName.replace(/\-/g, ' '),
        ...config.abbreviations,
        ...domainVariants
    ];

    // Den Basisnamen auch zu den Varianten hinzufügen
    if (baseShopName !== merchantName) {
        merchantVariants.push(baseShopName);
        merchantVariants.push(baseShopName.replace(/\s+/g, '-'));
        merchantVariants.push(baseShopName.replace(/\-/g, ' '));
    }

    // Und, in umgekehrter Richtung, wenn der Händlername bereits eine Domain ist
    if (merchantName.includes('.') || merchantName.includes('-shop')) {
        // Entferne TLD und mögliche Zusätze wie "-shop"
        const baseName = merchantName
            .split('.')[0] // Entferne TLD (.com, .de, etc.)
            .replace(/-shop$/, '') // Entferne mögliches "-shop" am Ende
            .replace(/[^\w\s-]/g, ''); // Entferne alle Sonderzeichen außer Bindestriche und Leerzeichen

        merchantVariants.push(baseName);
        // Füge auch Varianten mit unterschiedlicher Groß-/Kleinschreibung hinzu
        merchantVariants.push(baseName.toLowerCase());
        merchantVariants.push(baseName.toUpperCase());
    }

    // Entferne Händlernamen
    merchantVariants.forEach(variant => {
        // Spezialfall für Domain-Formate wie "target.com"
        if (variant.includes('.')) {
            // Genereller Ansatz, um "target.com" zu entfernen
            const baseDomain = variant.split('.')[0];
            const escapedBase = baseDomain.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
            const escapedVariant = variant.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');

            // Entferne "[domain.com]" Format am Anfang
            result = result.replace(new RegExp(`\\[${escapedVariant}\\]\\s*`, 'i'), '');

            // Entferne auch domänenspezifische Top-Level-Domains - das ist der Teil, der fehlt
            result = result.replace(new RegExp(`\\[${escapedBase}\\.com\\]\\s*`, 'i'), '');
            result = result.replace(new RegExp(`\\[${escapedBase}\\.de\\]\\s*`, 'i'), '');
            result = result.replace(new RegExp(`\\[${escapedBase}\\.co\\.uk\\]\\s*`, 'i'), '');

            // Spezifisches Pattern für "bei Target.com für" - umfassendere Lösung
            result = result.replace(new RegExp(`\\s+bei\\s+${escapedBase}\\.com\\s+für`, 'i'), ' für');

            // Fallback-Pattern, um alle "bei domain.tld" Formate zu entfernen
            result = result.replace(new RegExp(`\\s+bei\\s+${escapedBase}\\.[a-z.]+(?:\\s+|$)`, 'i'), ' ');
        }

        // Für Namen mit Punkten, verwende spezifischere Ersetzungsmuster
        const needsSpecialBoundary = variant.includes('.');
        const escapedVariant = variant.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
        const wordBoundaryPattern = needsSpecialBoundary ? escapedVariant : `\\b${escapedVariant}\\b`;

        if (needsSpecialBoundary) {

        } else {
            // Handle parentheses with multiple entries separated by slashes first
            const parenthesesPattern = new RegExp(
                `\\(([^/]*?\\s*)?${escapedVariant}\\s*/\\s*([^)]+)\\)`,
                'i'
            );
            if (result.match(parenthesesPattern)) {
                const match = result.match(parenthesesPattern);
                const before = match[1] ? match[1].trim() : '';
                const after = match[2].trim();
                const newContent = [before, after].filter(Boolean).join(' / ');
                result = result.replace(parenthesesPattern, `(${newContent})`);
            }

            // Standard patterns for merchant names without punctuation
            result = result
                .replace(new RegExp(`\\s+bei\\s+${wordBoundaryPattern}\\s+`, 'i'), ' ')
                .replace(new RegExp(`\\s+(?:bei\\s+)?${escapedVariant}(?:[-–]|\\s)*$`, 'i'), '')
                .replace(new RegExp(`\\s+auf\\s+${escapedVariant}$`, 'i'), '')
                .replace(new RegExp(`\\s+auf\\s+${escapedVariant}(?=\\s|$)`, 'i'), '');
        }

        result = result
            // Die restlichen Standardmuster
            .replace(new RegExp(`\\(${escapedVariant}:\\s*`, 'i'), '(')
            .replace(new RegExp(`${escapedVariant}:\\s*`, 'i'), '')

            // Händler am Anfang (mit optionalem Punkt danach)
            .replace(new RegExp(`^${escapedVariant}\\s*\\.?\\s*[-–]?\\s*`, 'i'), '')

            // FIX: Händler in eckigen Klammern mit optionalen Leerzeichen
            .replace(new RegExp(`\\[\\s*${escapedVariant}\\s*\\]\\s*`, 'i'), '')

            // Händler mit Punkt als Trenner
            .replace(new RegExp(`^${escapedVariant}\\.\\s*`, 'i'), '')
            .replace(new RegExp(`\\s+${escapedVariant}\\.\\s+`, 'i'), ' ')
            .replace(new RegExp(`\\s+${escapedVariant}\\.\\s*$`, 'i'), '')

            // Händler in Klammern mit fehlenden Klammern
            .replace(new RegExp(`^${escapedVariant}\\)\\s*`, 'i'), '')
            .replace(new RegExp(`\\(${escapedVariant}$`, 'i'), '')

            .replace(new RegExp(`\\(${escapedVariant}\\s+`, 'i'), '(');
    });

    return result.replace(/\s+/g, ' ').trim();
}

function shortenMerchantName(title) {
    // Special cases for merchant names
    const replacements = {
        'Kaufland Card': 'K-Card',
        'Kaufland': '',
        // Add more special cases here if needed
    };

    let newTitle = title;
    for (const [merchant, replacement] of Object.entries(replacements)) {
        // Case insensitive replace with word boundaries
        const regex = new RegExp(`\\b${merchant}\\b`, 'i');
        newTitle = newTitle.replace(regex, replacement);
    }

    return newTitle.trim();
}

// ===== UI-Management =====
// --- Cleanup & Reset ---
function cleanup() {
    // Remove settings UI and always reset state
    if (settingsDiv?.parentNode) settingsDiv.remove();
    isSettingsOpen = false;

    // Add word suggestion list cleanup
    const suggestionList = document.getElementById('wordSuggestionList');
    if (suggestionList) {
        suggestionList.remove();
    }

    // Close all sub-UIs with state logging
    if (merchantListDiv?.parentNode) {
        merchantListDiv.remove();
    }
    if (wordsListDiv?.parentNode) {
        wordsListDiv.remove();
    }
    if (blockedUsersDiv?.parentNode) {
        blockedUsersDiv.remove();
    }

    // Reset UI states with logging
    if (activeSubUI) {
        const buttonMappings = {
            merchant: {
                id: 'showMerchantListButton',
                html: '<i class="fas fa-store"></i> Händlerfilter verwalten'
            },
            words: {
                id: 'showWordsListButton',
                html: '<i class="fas fa-list"></i> Wortfilter verwalten'
            },
            users: {
                id: 'showBlockedUsersButton',
                html: '<i class="fas fa-user-slash"></i> Benutzerfilter verwalten'
            }
        };

        const buttonConfig = buttonMappings[activeSubUI];
        if (buttonConfig) {
            const btn = document.getElementById(buttonConfig.id);
            if (btn) {
                btn.innerHTML = buttonConfig.html;
                btn.removeAttribute('data-processing');
            }
        }
    }

    activeSubUI = null;
    dealThatOpenedSettings = null; // Reset auch den aktiven Deal

    // Clean up handlers
    document.removeEventListener('click', suggestionClickHandler);
    document.removeEventListener('click', uiClickOutsideHandler);
    window.removeEventListener('unload', cleanup);
    uiClickOutsideHandler = null;

    // Reset suggestion state
    suggestedWords = [];
}

//#endregion




//#region --- 9. Theming und UI-Darstellung ---
// Farbkonstanten für Light/Dark Mode
const THEME_COLORS = {
    light: {
        background: '#ffffff',
        border: 'rgba(3,12,25,0.23)',
        text: '#333333',
        buttonBg: '#f5f5f5',
        buttonBorder: '#d0d0d0',
        inputBg: '#ffffff',
        itemBg: '#f8f8f8'
    },
    dark: {
        background: '#1d1f20',
        border: 'rgb(107, 109, 109)',
        text: '#ffffff',
        buttonBg: '#2d2d2d',
        buttonBorder: '#3d3d3d',
        inputBg: '#1d1f20',
        itemBg: '#2a2a2a'
    }
};

// Theme Observer erstellen
const themeObserver = new MutationObserver(() => {
    requestAnimationFrame(() => {
        const colors = getThemeColors();
        updateAllUIThemes(colors);
    });
});

// Observer für beide Elemente einrichten
const targetNodes = [document.documentElement, document.body];
targetNodes.forEach(node => {
    themeObserver.observe(node, {
        attributes: true,
        attributeFilter: ['class', 'data-theme']
    });
});

// System Theme Observer
const systemThemeObserver = window.matchMedia('(prefers-color-scheme: dark)');
systemThemeObserver.addEventListener('change', () => {
    requestAnimationFrame(() => {
        const colors = getThemeColors();
        updateAllUIThemes(colors);
    });
});

// Hide Button Theme Observer
const hideButtonThemeObserver = new MutationObserver(() => {
    const colors = getThemeColors();

    requestAnimationFrame(() => {
        document.querySelectorAll('.custom-hide-button').forEach(button => {
            if (button) {
                button.style.cssText = `
                    position: absolute !important;
                    left: 50% !important;
                    top: 50% !important;
                    transform: translate(-50%, -50%) !important;
                    z-index: 10002 !important;
                    background: ${colors.background} !important;
                    border: 1px solid ${colors.border} !important;
                    border-radius: 50% !important;
                    cursor: pointer !important;
                    padding: 4px !important;
                    width: 28px !important;
                    height: 28px !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    pointer-events: all !important;
                    box-shadow: none !important;
                    font-size: 12px !important;
                `;
            }
        });

        // Update settings UI wenn offen
        if (isSettingsOpen) {
            updateUITheme();
        }
    });
});

// Start observing theme changes
hideButtonThemeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
});

// Theme Update Funktionen
function updateAllUIThemes() {
    const colors = getThemeColors();

    // Update buttons
    document.querySelectorAll('.custom-hide-button').forEach(button => {
        if (button) {
            button.style.setProperty('background', colors.background, 'important');
            button.style.setProperty('border-color', colors.border, 'important');
        }
    });

    // Update open UIs
    if (isSettingsOpen || activeSubUI) {
        updateUITheme();
    }
}
//#endregion




//#region --- 10. Button-Management ---

function addSettingsButton() {
    const deals = document.querySelectorAll('article.thread--deal, article.thread--voucher');

    deals.forEach(deal => {
        if (deal.hasAttribute('data-settings-added')) return;

        const footer = deal.querySelector('.threadListCard-footer, .threadCardLayout-footer');
        if (!footer) return;

        // Create settings button
        const settingsBtn = document.createElement('button');
        settingsBtn.className = 'flex--shrink-0 button button--type-text button--mode-secondary button--square';
        settingsBtn.title = 'mydealz Manager Einstellungen';
        settingsBtn.setAttribute('data-t', 'mdmSettings');
        settingsBtn.style.cssText = `
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 6px !important;
            border: none !important;
            background: transparent !important;
            cursor: pointer !important;
            margin: 0 4px !important;
            min-width: 32px !important;
            min-height: 32px !important;
            position: relative !important;
            z-index: 2 !important;
        `;

        settingsBtn.innerHTML = `
            <span class="flex--inline boxAlign-ai--all-c">
                <svg width="20" height="20" class="icon icon--gear">
                    <use xlink:href="/assets/img/ico_707ed.svg#gear"></use>
                </svg>
            </span>
        `;

        // Insert at correct position (before comments button)
        const commentsBtn = footer.querySelector('[href*="comments"]');
        if (commentsBtn) {
            commentsBtn.parentNode.insertBefore(settingsBtn, commentsBtn);
        } else {
            footer.prepend(settingsBtn);
        }

        deal.setAttribute('data-settings-added', 'true');

        settingsBtn.onclick = (e) => {

            // Visuelles Feedback SOFORT
            e.target.style.opacity = '0.5';

            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            if (isSettingsOpen) {
                if (dealThatOpenedSettings === deal) {
                    cleanup();
                    e.target.style.opacity = '';
                } else {
                    cleanup();
                    dealThatOpenedSettings = deal;
                    createSettingsUI();
                    e.target.style.opacity = '';
                }
            } else {
                dealThatOpenedSettings = deal;
                createSettingsUI();
                e.target.style.opacity = '';
            }

            return false;
        };
    });
}

function addHideButtons() {
    const deals = document.querySelectorAll('article:not([data-button-added])');

    deals.forEach(deal => {
        if (deal.hasAttribute('data-button-added')) return;

        // Check for expired status
        const isExpired = deal.querySelector('.color--text-TranslucentSecondary .size--all-s')?.textContent.includes('Abgelaufen');

        // Get temperature container
        const voteTemp = deal.querySelector('.cept-vote-temp');
        if (!voteTemp) return;

        // Remove popover
        const popover = voteTemp.querySelector('.popover-origin');
        if (popover) popover.remove();

        // Find temperature span for expired deals
        const tempSpan = isExpired ? voteTemp.querySelector('span') : null;
        const targetElement = isExpired ? tempSpan : voteTemp;

        if (!targetElement) return;

        const hideButtonContainer = document.createElement('div');
        hideButtonContainer.style.cssText = `
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            display: none;
            z-index: 10001;
            pointer-events: none;
        `;

        const hideButton = document.createElement('button');
        hideButton.innerHTML = '❌';
        hideButton.className = 'vote-button overflow--visible custom-hide-button';
        hideButton.title = 'Deal verbergen';
        hideButton.style.cssText = `
            position: absolute !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;
            z-index: 10002 !important;
            background: ${getThemeColors().background} !important;
            border: 1px solid ${getThemeColors().border} !important;
            border-radius: 50% !important;
            cursor: pointer !important;
            padding: 4px !important;
            width: 28px !important;
            height: 28px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            pointer-events: all !important;
            box-shadow: none !important;
            font-size: 12px !important;
        `;

        // Position relative to container
        if (!targetElement.style.position) {
            targetElement.style.position = 'relative';
        }

        if (IS_TOUCH_DEVICE) {
            let buttonVisible = false;
            const dealId = deal.getAttribute('id');

            // Add scroll handler to hide button
            const scrollHandler = () => {
                if (buttonVisible) {
                    buttonVisible = false;
                    hideButtonContainer.style.display = 'none';
                } else if (hideButtonContainer.style.display === 'block') {
                }
            };

            // Add scroll listener
            window.addEventListener('scroll', scrollHandler, { passive: true });

            targetElement.addEventListener('touchstart', (e) => {
                e.preventDefault();
                e.stopPropagation();

                if (!buttonVisible) {
                    buttonVisible = true;
                    hideButtonContainer.style.display = 'block';
                } else {
                    const dealId = deal.getAttribute('id');

                    hiddenDeals.push(dealId);
                    saveHiddenDeals();
                    hideDeal(deal);
                    window.removeEventListener('scroll', scrollHandler);
                }
            }, true);

            targetElement.addEventListener('touchend', () => {
                if (!buttonVisible) {
                    hideButtonContainer.style.display = 'none';
                }
            }, true);
        } else {
            targetElement.addEventListener('mouseenter', () => {
                hideButtonContainer.style.display = 'block';
            }, true);

            targetElement.addEventListener('mouseleave', () => {
                hideButtonContainer.style.display = 'none';
            }, true);

            hideButton.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                const dealId = deal.getAttribute('id');

                hiddenDeals.push(dealId);
                saveHiddenDeals();
                hideDeal(deal);
                return false;
            };
        }

        hideButtonContainer.appendChild(hideButton);
        targetElement.appendChild(hideButtonContainer);
        deal.setAttribute('data-button-added', 'true');
    });
}

function getMerchantButtonText(merchantName) {
    return `Alle Deals von ${merchantName}`;
}

function addMerchantPageHideButton() {
    const urlParams = new URLSearchParams(window.location.search);
    const merchantId = urlParams.get('merchant-id');
    const merchantBanner = document.querySelector(MERCHANT_PAGE_SELECTOR);
    const merchantName = document.querySelector('.merchant-banner__title')?.textContent.trim();

    if (!merchantId || !merchantBanner || !merchantName) return;

    const hideButtonContainer = document.createElement('div');
    hideButtonContainer.style.cssText = `
        display: inline-flex;
        align-items: center;
        margin-left: 10px;
    `;

    const hideButton = document.createElement('button');
    hideButton.style.cssText = `
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        background: #f0f0f0;
        border: 1px solid #ccc;
        border-radius: 3px;
        cursor: pointer;
        font-size: 14px;
    `;

    const buttonText = getMerchantButtonText(merchantName);
    hideButton.innerHTML = `
        <span style="display: inline-flex; align-items: center; gap: 8px; white-space: nowrap;">
            <i class="fas fa-store-slash"></i>
            <span>${buttonText}</span>
        </span>
    `;
    hideButton.title = `${buttonText} ausblenden`;

    hideButton.addEventListener('click', () => {
        const merchantsData = loadExcludeMerchants();
        if (!merchantsData.some(m => m.id === merchantId)) {
            merchantsData.unshift({ id: merchantId, name: merchantName });
            saveExcludeMerchants(merchantsData);
            processArticles();
        }
    });

    hideButtonContainer.appendChild(hideButton);
    merchantBanner.appendChild(hideButtonContainer);
}

//#endregion




//#region --- 11. Skript-Initialisierung ---
// Initial beim Start aufrufen
registerMenuCommands();

// Start script - nach DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Aufräumen bestehender Daten beim Skriptstart
(function cleanupMerchantData() {
    const merchants = loadExcludeMerchants();
    saveExcludeMerchants(merchants);
})();

// DOM-Ready Handler
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

//#endregion




//#region --- 12. Spezialisierte Komponenten ---
function initializeUI() {
    // Initial UI Setup
    processArticles();
    addSettingsButton();
    addHideButtons();
    addMerchantPageHideButton();
}

// Observer Initialisierung
function initObserver() {
    combinedObserver.disconnect();
    observer.disconnect();

    observerTargets.delete(observer);
    observerTargets.delete(combinedObserver);

    observeDealMutations(observer);
    observeDealMutations(combinedObserver);

    requestAnimationFrame(() => {
        processArticles();
        addSettingsButton();
        addHideButtons();
    });
}

function registerMenuCommands() {
    // Alte Menüs erst abmelden
    if (menuCommandId !== undefined) {
        GM_unregisterMenuCommand(menuCommandId);
    }

    // Menüeintrag zum Öffnen der Einstellungen registrieren
    menuCommandId = GM_registerMenuCommand('mydealz Manager Einstellungen', () => {
        // Einstellungen für aktuellen Deal öffnen
        dealThatOpenedSettings = document.querySelector('article.thread--deal, article.thread--voucher');
        createSettingsUI();
    });
}

//#endregion




//#region --- 13. Dokumentation ---
/*
===================================================================================
--- Funktionsübersicht mydealz Manager ---
===================================================================================

detectMultipleInstances() - Erkennt parallele Ausführungen des Scripts (ab 1.13.x)
getThemeColors() - Liefert Theme-spezifische Farben basierend auf aktuellem Theme
processArticles() - Verarbeitet und filtert alle Deals
shouldExcludeArticle() - Prüft ob ein Deal ausgeblendet werden soll
createSettingsUI() - Erstellt das Haupteinstellungsfenster
addSettingsButton() - Fügt Einstellungs-Button zu Deals hinzu
addHideButtons() - Fügt X-Button zum Ausblenden hinzu
backupData() - Erstellt Backup der Einstellungen
restoreData() - Stellt Backup-Daten wieder her
decodeHtml() - Konvertiert HTML-Entities
cleanup() - Räumt UI-Elemente auf
syncStorage() - Synchronisiert GM und localStorage
saveExcludeWords() - Speichert Wortfilter
loadExcludeWords() - Lädt Wortfilter
saveExcludeMerchants() - Speichert Händlerfilter
loadExcludeMerchants() - Lädt Händlerfilter
saveMaxPrice() - Speichert Maximalpreis
createMerchantListUI() - Zeigt Händlerliste
createExcludeWordsUI() - Zeigt Wortfilterliste
updateActiveLists() - Aktualisiert Listen im UI
handleMerchantDelete() - Löscht Händler aus Filter
handleWordDelete() - Löscht Wort aus Filter
setupScrollHandling() - Konfiguriert Scroll-Verhalten
updateUITheme() - Aktualisiert UI-Farben
init() - Initialisiert das Script
removeMerchantNameFromTitle() - Entfernt Händlernamen aus Deal-Titeln
throttle() - Begrenzt die Ausführungshäufigkeit von Funktionen
getWordsFromTitle() - Extrahiert relevante Wörter aus Deal-Titeln
hideDeal() - Blendet einen Deal aus
initUIContainers() - Initialisiert UI-Container
updateSuggestionList() - Aktualisiert Wortvorschläge
handleWordSelection() - Verarbeitet Wortauswahl
setupClickOutsideHandler() - Konfiguriert Außenbereich-Klicks
createSuggestionClickHandler() - Erstellt Handler für Wortvorschläge
registerMenuCommands() - Registriert Script-Manager Menüeinträge
saveHiddenDeals() - Speichert ausgeblendete Deals
initializeUI() - Initialisiert Benutzeroberfläche
initObserver() - Initialisiert DOM-Beobachter
addMerchantPageHideButton() - Fügt Händler-Ausblenden-Button hinzu

===================================================================================
*/
//#endregion