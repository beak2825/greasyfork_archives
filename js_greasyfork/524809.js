// ==UserScript==
// @name         Platesmania Lookup Toolbox
// @version      1.15
// @description  Shows lookup buttons on Platesmania upload pages.
// @match        https://platesmania.com/*/add*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      opendata.rdw.nl
// @connect      motonet.fi
// @connect      trodo.it
// @connect      carbaba.co.uk
// @connect      api.ipify.org
// @license      MIT
// @namespace    https://greasyfork.org/users/976031
// @downloadURL https://update.greasyfork.org/scripts/524809/Platesmania%20Lookup%20Toolbox.user.js
// @updateURL https://update.greasyfork.org/scripts/524809/Platesmania%20Lookup%20Toolbox.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- Settings & Storage ---
    // View size can be Large or Compact (formerly "Small").
    // We support a default and per-country overrides, plus per-country hidden sites.
    const SIZE_DEFAULT_KEY = 'lookup_button_size_default';
    const SIZE_BY_COUNTRY_KEY = 'lookup_button_size_by_country'; // JSON object { code: 'Large'|'Compact' }
    const HIDDEN_SITES_BY_COUNTRY_KEY = 'lookup_hidden_sites_by_country'; // JSON object { code: [siteName, ...] }
    const DISABLE_GOOGLE_IMAGES_KEY = 'lookup_disable_google_images';
    const DISABLE_AUTOGESPOT_KEY = 'lookup_disable_autogespot';

    function getCurrentCountryCode() {
        try {
            const href = window.location.href || '';
            const m = href.match(/platesmania\.com\/([a-z]{2,4})\/add/i);
            return m ? m[1].toLowerCase() : '';
        } catch {
            return '';
        }
    }

    function readJsonFromStorage(key, fallback) {
        try {
            if (typeof GM_getValue === 'function') {
                const raw = GM_getValue(key, '');
                if (!raw) return fallback;
                try { return JSON.parse(raw); } catch {}
            } else if (typeof localStorage !== 'undefined') {
                const raw = localStorage.getItem(key);
                if (!raw) return fallback;
                try { return JSON.parse(raw); } catch {}
            }
        } catch {}
        return fallback;
    }

    function writeJsonToStorage(key, obj) {
        const raw = JSON.stringify(obj || {});
        try {
            if (typeof GM_setValue === 'function') GM_setValue(key, raw);
            else if (typeof localStorage !== 'undefined') localStorage.setItem(key, raw);
        } catch {}
    }

    function readStringFromStorage(key, fallback) {
        try {
            if (typeof GM_getValue === 'function') return GM_getValue(key, fallback);
            if (typeof localStorage !== 'undefined') return localStorage.getItem(key) || fallback;
        } catch {}
        return fallback;
    }

    function writeStringToStorage(key, val) {
        try {
            if (typeof GM_setValue === 'function') GM_setValue(key, val);
            else if (typeof localStorage !== 'undefined') localStorage.setItem(key, val);
        } catch {}
    }

    function migrateLegacySizeDefault() {
        // Migrate from old global key 'lookup_button_size_mode' if present
        const LEGACY_KEY = 'lookup_button_size_mode';
        const legacy = readStringFromStorage(LEGACY_KEY, '');
        if (legacy) {
            const normalized = legacy === 'Small' ? 'Compact' : legacy;
            writeStringToStorage(SIZE_DEFAULT_KEY, normalized);
            try { if (typeof GM_setValue === 'function') GM_setValue(LEGACY_KEY, ''); else if (localStorage) localStorage.removeItem(LEGACY_KEY); } catch {}
        }
    }

    function getDefaultSizeMode() {
        migrateLegacySizeDefault();
        const val = readStringFromStorage(SIZE_DEFAULT_KEY, 'Large');
        return val === 'Small' ? 'Compact' : (val || 'Large');
    }

    function setDefaultSizeMode(mode) {
        const normalized = mode === 'Small' ? 'Compact' : mode;
        writeStringToStorage(SIZE_DEFAULT_KEY, normalized);
    }

    function getSizeModeForCountry(code) {
        const byCountry = readJsonFromStorage(SIZE_BY_COUNTRY_KEY, {});
        const val = byCountry[code];
        if (val) return val === 'Small' ? 'Compact' : val;
        return getDefaultSizeMode();
    }

    function setSizeModeForCountry(code, mode) {
        const normalized = mode === 'Small' ? 'Compact' : mode;
        const byCountry = readJsonFromStorage(SIZE_BY_COUNTRY_KEY, {});
        byCountry[code] = normalized;
        writeJsonToStorage(SIZE_BY_COUNTRY_KEY, byCountry);
    }

    function clearAllCountrySizeOverrides() {
        writeJsonToStorage(SIZE_BY_COUNTRY_KEY, {});
    }

    function isCompactMode() {
        const code = getCurrentCountryCode();
        const mode = code ? getSizeModeForCountry(code) : getDefaultSizeMode();
        return mode === 'Compact';
    }

    function getHiddenSitesForCountry(code) {
        const data = readJsonFromStorage(HIDDEN_SITES_BY_COUNTRY_KEY, {});
        const arr = Array.isArray(data[code]) ? data[code] : [];
        return new Set(arr);
    }

    function setHiddenSitesForCountry(code, hiddenArray) {
        const data = readJsonFromStorage(HIDDEN_SITES_BY_COUNTRY_KEY, {});
        data[code] = Array.from(new Set(hiddenArray || []));
        writeJsonToStorage(HIDDEN_SITES_BY_COUNTRY_KEY, data);
    }

    function isSiteEnabledForCountry(code, siteName) {
        const hidden = getHiddenSitesForCountry(code);
        return !hidden.has(siteName);
    }

    function isGoogleImagesGloballyEnabled() {
        const v = readStringFromStorage(DISABLE_GOOGLE_IMAGES_KEY, '0');
        return String(v) !== '1';
    }
    function setGoogleImagesGloballyEnabled(enabled) {
        writeStringToStorage(DISABLE_GOOGLE_IMAGES_KEY, enabled ? '0' : '1');
    }
    function isAutogespotGloballyEnabled() {
        const v = readStringFromStorage(DISABLE_AUTOGESPOT_KEY, '0');
        return String(v) !== '1';
    }
    function setAutogespotGloballyEnabled(enabled) {
        writeStringToStorage(DISABLE_AUTOGESPOT_KEY, enabled ? '0' : '1');
    }

    // Favicon cache so we don't keep refetching once resolved
    const faviconCache = {};
    function getFaviconConfigForUrl(urlStr) {
        try {
            const u = new URL(urlStr);
            const key = u.hostname;
            const cached = faviconCache[key];
            if (cached) {
                return { key, candidates: [cached] };
            }
            const s2 = `https://www.google.com/s2/favicons?sz=64&domain=${u.hostname}`;
            const ico = `${u.origin}/favicon.ico`;
            return { key, candidates: [ico, s2] };
        } catch {
            return { key: '', candidates: [] };
        }
    }

    const lookupSites = {
        nl: [
            { name: 'Finnik', base: 'https://finnik.nl/kenteken/' },
            { name: 'Finnik (app)', base: 'https://app.finnik.nl/home/vehicle_report?license-plate-number=' },
            { name: 'Finnik (Centraal Beheer)', base: 'https://centraalbeheer.finnik.nl/kenteken/' },
            { name: 'Autoweek', base: 'https://www.autoweek.nl/kentekencheck/' },
            { name: 'voertuig.net', base: 'https://voertuig.net/kenteken/' },
            { name: 'Kentekencheck.info', base: 'https://www.kentekencheck.info/kenteken/' },
            { name: 'Kentekencheck.nu', base: 'https://www.kentekencheck.nu/kenteken/' },
            { name: 'Qenteken', base: 'https://www.qenteken.nl/kentekencheck/' },
            { name: 'RDW (Site)', base: 'https://www.rdwdata.nl/kenteken/' },
        ],
        se: [
            { name: 'car.info', base: 'https://www.car.info/?s=' },
            { name: 'biluppgifter.se', base: 'https://biluppgifter.se/fordon/' },
            { name: 'transportstyrelsen', base: 'https://fordon-fu-regnr.transportstyrelsen.se/?ts-regnr-sok=' },
        ],
        ua: [
            { name: 'carplates.app', base: 'https://ua.carplates.app/en/number/' },
            { name: 'baza-gai.com.ua', base: 'https://baza-gai.com.ua/nomer/' },
            { name: 'auto-inform.com.ua', base: 'https://auto-inform.com.ua/search/' },
        ],
        uk: [
            { name: 'checkcardetails', base: 'https://www.checkcardetails.co.uk/cardetails/' },
            { name: 'totalcarcheck', base: 'https://totalcarcheck.co.uk/FreeCheck?regno=' },
            { name: 'checkhistory', base: 'https://checkhistory.uk/vehicle/' },
            { name: 'carcheck', base: 'https://www.carcheck.co.uk/sendnudes/' },
            { name: 'carhistorycheck', base: 'https://carhistorycheck.co.uk/confirm-vehicle/?vrm=' },
            { name: 'carbaba (Site)', base: 'https://carbaba.co.uk/?reg=' },
        ],
        dk: [
            { name: 'digitalservicebog.dk', base: 'https://app.digitalservicebog.dk/search?country=dk&Registration=' },
            { name: 'esyn.dk', base: 'https://findsynsrapport.esyn.dk/result?registration=' },
        ],
        no: [{ name: 'vegvesen.no', base: 'https://www.vegvesen.no/en/vehicles/buy-and-sell/vehicle-information/check-vehicle-information/?registreringsnummer=' },
             { name: 'regnr.info', base: 'https://regnr.info/' }

            ],
        fr: [
            { name: 'immatriculation-auto.info', base: 'https://immatriculation-auto.info/vehicle/' },
            { name: 'carter-cash.com', base: 'https://www.carter-cash.com/pieces-auto/?plate=', needsHyphen: true },
        ],
        es: [
            { name: 'carter-cash.es', base: 'https://www.carter-cash.es/piezas-auto/?plate=' },
        ],
        fi: [
            { name: 'Biltema', base: 'https://www.biltema.fi/sv-fi/rekosok-bil/' },
            { name: 'Motonet (in new tab)', base: 'https://www.motonet.fi/api/vehicleInfo/registrationNumber/FI?locale=fi&registrationNumber=' },
        ],
        cz: [{ name: 'uniqa.cz', base: 'https://www.uniqa.cz/online/pojisteni-vozidla/#ecvId=' }],
        sk: [{ name: 'overenie.digital', base: 'https://overenie.digital/over/sk/ecv/' },
             { name: 'stkonline', base: 'https://www.stkonline.sk/spz/' }
            ],
        ie: [{ name: 'cartell.ie', base: 'https://www.cartell.ie/ssl/servlet/beginStarLookup?registration=' },
             { name: 'motorcheck.ie', base: 'https://www.motorcheck.ie/free-car-check/?vrm=' }
            ],
        is: [{ name: 'island.is', base: 'https://island.is/uppfletting-i-oekutaekjaskra?vq=' }],
        it: [{ name: 'carter-cash.it', base: 'https://www.carter-cash.it/ricambi-auto/?plate=' },]
    };

    const url = window.location.href;
    const isPage = (code) => url.includes(`platesmania.com/${code}/add`);
    const supportedCodes = ['nl','ua','no','dk','fr','uk','fi','pl','lt','cz','se','es', 'sk', 'us', 'ie', 'is', 'it'];

    // Platesmania US: mapping of <option value> in #drop_1 to 2-letter state codes
    const usStateValueToCode = {
        '7502': 'AL',
        '7501': 'AK',
        '7504': 'AZ',
        '7503': 'AR',
        '7505': 'CA',
        '7506': 'CO',
        '7507': 'CT',
        '7508': 'DE',
        '7551': 'DC',
        '7509': 'FL',
        '7510': 'GA',
        '7511': 'HI',
        '7513': 'ID',
        '7514': 'IL',
        '7515': 'IN',
        '7512': 'IA',
        '7516': 'KS',
        '7517': 'KY',
        '7518': 'LA',
        '7521': 'ME',
        '7520': 'MD',
        '7519': 'MA',
        '7522': 'MI',
        '7523': 'MN',
        '7525': 'MS',
        '7524': 'MO',
        '7526': 'MT',
        '7529': 'NE',
        '7533': 'NV',
        '7530': 'NH',
        '7531': 'NJ',
        '7532': 'NM',
        '7534': 'NY',
        '7527': 'NC',
        '7528': 'ND',
        '7535': 'OH',
        '7536': 'OK',
        '7537': 'OR',
        '7538': 'PA',
        '7539': 'RI',
        '7540': 'SC',
        '7541': 'SD',
        '7542': 'TN',
        '7543': 'TX',
        '7544': 'UT',
        '7546': 'VT',
        '7545': 'VA',
        '7547': 'WA',
        '7549': 'WV',
        '7548': 'WI',
        '7550': 'WY',
    };

    function getUSStateCode() {
        const sel = document.getElementById('drop_1');
        if (!sel) return '';
        const val = sel.value;
        return usStateValueToCode[val] || '';
    }

    // --- Helpers ---
    function selectedText(id) {
        const el = document.getElementById(id);
        if (!el || !el.options || el.selectedIndex < 0) return '';
        return el.options[el.selectedIndex].text;
    }

    function areFieldsFilled() {
        if (isPage('nl')) return document.getElementById('nomer').value !== '';
        if (isPage('ua')) {
            const region = document.getElementById('region1').value;
            const digits = document.getElementById('digit1').value;
            return region !== '' && digits !== '';
        }
        if (isPage('no') || isPage('dk') || isPage('se')) return document.getElementById('let').value !== '' && document.getElementById('digit').value !== '';
        if (isPage('fr')) {
            const b1 = document.getElementById('b1').value;
            const d2 = document.getElementById('digit2').value;
            const b2 = document.getElementById('b2').value;
            return b1 !== '' && d2 !== '' && b2 !== '';
        }
        if (isPage('es')) {
            const ctype = document.getElementById('ctype')?.value;
            if (!ctype) return false;
            if (ctype === '1') {
                return document.getElementById('digit1').value !== '' && document.getElementById('let').value !== '';
            }
            if (ctype === '2') {
                return selectedText('dip') !== '' && selectedText('region') !== '' && document.getElementById('digit1').value !== '';
            }
            if (ctype === '3') {
                return selectedText('region') !== '' && document.getElementById('digit1').value !== '' && document.getElementById('let').value !== '';
            }
            if (ctype === '4') {
                return selectedText('region') !== '' && document.getElementById('digit2').value !== '' && document.getElementById('let').value !== '';
            }
            if (ctype === '5') {
                return selectedText('region') !== '' && document.getElementById('digit1').value !== '' && document.getElementById('let').value !== '';
            }
            if (ctype === '7') {
                return selectedText('region') !== '' && document.getElementById('digit2').value !== '';
            }
            return false;
        }
        if (isPage('de') || isPage('ch')) return document.getElementById('digit').value !== '';
        if (isPage('us')) {
            const state = getUSStateCode();
            const plate = document.getElementById('nomer').value;
            return !!state && plate !== '';
        }
        if (isPage('pl') || isPage('uk')) {
            const nomerpl = document.getElementById('nomerpl')?.value || '';
            const dip = document.getElementById('dip')?.value || '';
            return nomerpl !== '' || dip !== '';
        }
        if (isPage('fi')) return document.getElementById('digit').value !== '';
        if (isPage('lt')) return document.getElementById('digit2').value !== '';
        if (isPage('cz')) {
            const d1 = document.getElementById('digit1').value;
            const d2 = document.getElementById('digit2').value;
            const d3 = document.getElementById('digit3').value;
            const nomer = document.getElementById('nomer').value;
            return d1 !== '' || d2 !== '' || d3 !== '' || nomer !== '';
        }


        if (isPage('sk')) {
            const digit = document.getElementById('digit').value;
            const nomerpl = document.getElementById('nomerpl').value;
            const police = document.getElementById('police').value;
            return digit !== '' || nomerpl !== '' || police !== '';
        }
        if (isPage('ie')) {
            const digit2 = document.getElementById('digit2').value;
            return digit2;
        }
        if (isPage('is')) {
            const nomer = document.getElementById('nomer').value;
            const b1 = document.getElementById('b1').value;
            return nomer !== '' || b1 !== '';
        }

        if (isPage('it')) {
            const c = document.getElementById('ctype')?.value;
            const q = (id) => document.getElementById(id)?.value || '';
            const txt = (id) => (document.getElementById(id)?.options?.[document.getElementById(id).selectedIndex]?.text || '');
            switch (c) {
                case '1': return q('b1') !== '' && q('digit1') !== '' && q('b2') !== '';
                case '2': return q('b1') !== '' && q('digit2') !== '';
                case '3': return q('b1') !== '' && q('digit2') !== '';
                case '4': return q('b1') !== '' && q('digit1') !== '' && q('b2') !== '';
                case '5': return txt('region1') !== '' && q('nomerpl1') !== '';
                case '6': return txt('region1') !== '' && q('nomerpl1') !== '';
                case '7': return txt('region1') !== '' && q('nomerpl1') !== '';
                case '8': return false; // disabled
                case '9': return txt('dipreg') !== '' && q('digit2') !== '' && q('b2') !== '';
                case '10': return q('b1') !== '' && q('digit2') !== '';
                default: return false;
            }
        }

        return false;
    }


    function buildPlateForCurrentPage() {
        if (isPage('nl')) return document.getElementById('nomer').value;

        if (isPage('ua')) {
            const region = document.getElementById('region1').value;
            const digits = document.getElementById('digit1').value;
            const b1 = document.getElementById('b1').value;
            const b2 = document.getElementById('b2').value;
            return `${region}${digits}${b1}${b2}`;
        }

        if (isPage('no') || isPage('dk') || isPage('se')) {
            const letField = document.getElementById('let').value;
            const digitField = document.getElementById('digit').value;
            return `${letField}${digitField}`;
        }

        if (isPage('fr')) {
            const b1 = document.getElementById('b1').value;
            const digit2 = document.getElementById('digit2').value;
            const b2 = document.getElementById('b2').value;
            return `${b1}${digit2}${b2}`;
        }

        if (isPage('us')) {
            const raw = document.getElementById('nomer').value || '';
            return raw.replace(/\s+/g, '');
        }

        if (isPage('es')) {
            const ctype = document.getElementById('ctype')?.value;
            const q = (id) => document.getElementById(id)?.value || '';
            if (ctype === '1') {
                return q('digit1') + q('let');
            }
            if (ctype === '2') {
                return selectedText('dip') + selectedText('region') + q('digit1');
            }
            if (ctype === '3') {
                return selectedText('region') + q('digit1') + q('let');
            }
            if (ctype === '4') {
                return selectedText('region') + q('digit2') + q('let');
            }
            if (ctype === '5') {
                return selectedText('region') + q('digit1') + q('let');
            }
            if (ctype === '7') {
                return selectedText('region') + q('digit2');
            }
            return '';
        }

        if (isPage('fi')) {
            const letField = document.getElementById('let1').value;
            const digitField = document.getElementById('digit').value;
            return `${letField}-${digitField}`;
        }

        if (isPage('uk')) {
            return (document.getElementById('nomerpl')?.value || document.getElementById('nomer')?.value || '');
        }

        if (isPage('pl')) {
            const ctype = document.getElementById('ctype')?.value;
            const q = (id) => document.getElementById(id)?.value || '';

            switch (ctype) {
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '9':
                case '10':
                case '11':
                    return selectedText('region') + q('nomerpl');

                case '6':
                case '7':
                case '8':
                    return selectedText('region') + q('b1') + q('nomerpl');

                case '12':
                    return selectedText('dip') + selectedText('region') + q('digit');

                default:
                    return '';
            }
        }


        if (isPage('lt')) {
            const b1 = document.getElementById('b1');
            const b2 = document.getElementById('b2');
            const b3 = document.getElementById('b3');
            const d1 = document.getElementById('digit1');
            const d2 = document.getElementById('digit2');
            const d3 = document.getElementById('digit3');
            const vanity = document.getElementById('nomer');
            const ctype = document.getElementById('ctype').value;
            if (ctype === '1') return b1.value + b2.value + b3.value + d2.value;
            if (ctype === '2') return d1.value + b1.value + b2.value;
            if (ctype === '3') return b1.value + b2.value + d2.value;
            if (ctype === '4') return d1.value + b1.value + b2.value + b3.value;
            if (['5','6','7','9'].includes(ctype)) return vanity.value;
            if (ctype === '8') return d3.value + b1.value + b2.value;
            return '';
        }

        if (isPage('cz')) {
            const q = (id) => document.getElementById(id)?.value || '';
            const category = q('ctype');
            const regionField = document.getElementById('region');
            const selectedRegionText = regionField.options[regionField.selectedIndex].text;
            const b1 = q('b1'), b2 = q('b2'), b3 = q('b3');
            const d1 = q('digit1'), d2 = q('digit2'), d3 = q('digit3');
            const nomer = q('nomer'), el = q('el');

            switch (category) {
                case '1': return `${b1}${selectedRegionText}${b2}${d1}`;
                case '2': return `${b1}${selectedRegionText}${d1}`;
                case '4': return `${selectedRegionText}${b2}${d1}`;
                case '5': return `${selectedRegionText}${b2}${d1}`;
                case '6': return `${selectedRegionText}${b2}${d1}`;
                case '7': return `${selectedRegionText}${b2}${d2}`;
                case '8': return `${selectedRegionText}${b2}${d2}`;
                case '9': return `${selectedRegionText}${b2}${d2}`;
                case '10': return `${selectedRegionText}${b2}${d2}`;
                case '11': return nomer;
                case '3': return nomer;
                case '12': return `${el}${b3}${d3}`;
                case '13': return `${d1}${d3}`;
                default: return '';
            }
        }
        if (isPage('sk')) {
            const ctype = document.getElementById('ctype')?.value;
            const q = (id) => document.getElementById(id)?.value || '';

            switch (ctype) {
                case '1':
                case '2':
                case '12':
                    return selectedText('region') + q('digit') + q('let2');

                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                    return selectedText('region') + q('let1') + q('digit');

                case '9':
                    return q('let2') + q('nomerpl');

                case '10':
                    return q('let1') + q('police');

                case '11':
                    return q('digit') + q('police');

                case '13':
                    return selectedText('dip') + q('police');

                default:
                    return '';
            }


        }
        if (isPage('ie')) {
            const ctype = document.getElementById('ctype')?.value;
            const q = (id) => document.getElementById(id)?.value || '';

            switch (ctype) {
                case '1':
                    return q('digit1') + selectedText('region') + q('digit2');
                case '2':
                case '3':
                    return q('let') + q('digit2')

                default:
                    return '';
            }
        }
        if (isPage('is')) {
            const ctype = document.getElementById('ctype')?.value;
            const q = (id) => document.getElementById(id)?.value || '';

            switch (ctype) {
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '9':
                    return q('nomer').replace(/\s+/g, '');
                case '8':
                    return selectedText('b1') +  selectedText('b2') +  selectedText('b3') +  selectedText('b4') +  selectedText('b5') +  selectedText('b6');
                case '10':
                    return  selectedText('region') + q('nomer').replace(/\s+/g, '');
                default:
                    return '';
            }
        }
        if (isPage('it')) {
            const c = document.getElementById('ctype')?.value;
            const q = (id) => document.getElementById(id)?.value || '';
            const txt = (id) => {
                const el = document.getElementById(id);
                if (!el || el.selectedIndex < 0 || !el.options) return '';
                return el.options[el.selectedIndex].text || '';
            };
            const joinClean = (...parts) => parts.join('').replace(/[\s-]+/g, '');
            switch (c) {
                case '1': return joinClean(q('b1'), q('digit1'), q('b2'));
                case '2': return joinClean(q('b1'), q('digit2'));
                case '3': return joinClean(q('b1'), q('digit2'));
                case '4': return joinClean(q('b1'), q('digit1'), q('b2'));
                case '5': return joinClean(txt('region1'), q('nomerpl1'));
                case '6': return joinClean(txt('region1'), q('nomerpl1'));
                case '7': return joinClean(txt('region1'), q('nomerpl1'));
                case '8': return ''; // disabled
                case '9': {
                    const dip = txt('dipreg').replace(/\s*\(.*?\)\s*/g, '');
                    return joinClean(dip, q('digit2'), q('b2'));
                }
                case '10': return joinClean(q('b1'), q('digit2'));
                default: return '';
            }
        }

        return '';
    }

    // For Google Images button we historically insert spaces between chunks on some countries.
    function buildPlateForSearchDisplay() {
        if (isPage('nl')) return document.getElementById('nomer').value;
        if (isPage('ua')) {
            const region = document.getElementById('region1').value;
            const digits = document.getElementById('digit1').value;
            const b1 = document.getElementById('b1').value;
            const b2 = document.getElementById('b2').value;
            return `${region} ${digits} ${b1}${b2}`;
        }
        if (isPage('no') || isPage('dk') || isPage('se')) {
            return document.getElementById('let').value + ' ' + document.getElementById('digit').value;
        }
        if (isPage('fr')) {
            const b1 = document.getElementById('b1').value;
            const d2 = document.getElementById('digit2').value;
            const b2 = document.getElementById('b2').value;
            return `${b1} ${d2} ${b2}`;
        }
        if (isPage('us')) {
            return (document.getElementById('nomer').value || '').replace(/\s+/g, '');
        }
        if (isPage('es')) {
            return buildPlateForCurrentPage();
        }
        if (isPage('de')) {
            const regionFieldBase = document.getElementById('region');
            const regionField = regionFieldBase.options[regionFieldBase.selectedIndex].text;
            const letField = document.getElementById('b1').value;
            const letField2 = document.getElementById('b2').value;
            const digitField = document.getElementById('digit').value;
            return `${regionField} ${letField} ${digitField}${letField2}`;
        }
        if (isPage('ch')) {
            const regionField = document.getElementById('region').value;
            const digitField = document.getElementById('digit').value;
            return `${regionField} ${digitField}`;
        }
        if (isPage('fi')) {
            return document.getElementById('let1').value + '-' + document.getElementById('digit').value;
        }
        if (isPage('pl')) {
            const regionField = document.getElementById('region');
            const selectedRegionText = regionField.options[regionField.selectedIndex].text;
            const digitField = document.getElementById('nomerpl').value;
            return selectedRegionText + ' ' + digitField;
        }
        if (isPage('uk')) {
            return (document.getElementById('nomerpl')?.value || document.getElementById('nomer')?.value || '');
        }
        if (isPage('lt') || isPage('it') || isPage('cz') || isPage('sk')) {
            return buildPlateForCurrentPage();
        }
        if (isPage('ie')) {
            const ctype = document.getElementById('ctype')?.value;
            const q = (id) => document.getElementById(id)?.value || '';

            switch (ctype) {
                case '1':
                    return q('digit1') + '-' + selectedText('region') + '-' + q('digit2');
                case '2':
                case '3':
                    return q('let') + q('digit2')

                default:
                    return '';
            }
        }
        if (isPage('is')) {
            const ctype = document.getElementById('ctype')?.value;
            const q = (id) => document.getElementById(id)?.value || '';

            switch (ctype) {
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '9':
                    return q('nomer');
                case '8':
                    return selectedText('b1') +  selectedText('b2') +  selectedText('b3') +  selectedText('b4') +  selectedText('b5') +  selectedText('b6');
                case '10':
                    return  selectedText('region') + ' ' + q('nomer').replace(/\s+/g, '');
                default:
                    return '';
            }
        }

        return '';
    }

    function frWithHyphens(s) {
        return s.replace(/^([A-Z]{2})(\d{3})([A-Z]{2})$/i, '$1-$2-$3');
    }

    function onlyYearFromDate(s) {
        if (!s) return '';
        const m = String(s).match(/(\d{4})/);
        return m ? m[1] : '';
    }

    function showFIWindow(info) {
        const existing = document.getElementById('fiFloatWin');
        if (existing) existing.remove();

        const wrap = document.createElement('div');
        wrap.id = 'fiFloatWin';
        wrap.style.position = 'fixed';
        wrap.style.top = '80px';
        wrap.style.right = '40px';
        wrap.style.zIndex = '99999';
        wrap.style.background = '#fff';
        wrap.style.border = '1px solid #ccc';
        wrap.style.borderRadius = '6px';
        wrap.style.boxShadow = '0 6px 18px rgba(0,0,0,0.18)';
        wrap.style.minWidth = '260px';
        wrap.style.maxWidth = '420px';
        wrap.style.fontFamily = 'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif';

        const header = document.createElement('div');
        header.style.padding = '10px 12px';
        header.style.borderBottom = '1px solid #eee';
        header.style.display = 'flex';
        header.style.alignItems = 'center';
        header.style.justifyContent = 'space-between';
        header.style.background = '#f8f9fa';

        const makeModel = `${info.manufacturerName || ''} ${info.model || ''}`.trim().replace(/\s+/g, ' ');
        const makeModelSpanHTML =
              `<span style="border-bottom: 1px dotted;" onclick="$('#markamodtype').val('${escAttr(makeModel)}').autocomplete('search', '${escAttr(makeModel)}'); return false;">${escHtml(makeModel)}</span>`;
        const y = onlyYearFromDate(info.registrationDate);
        const title = document.createElement('div');
        title.innerHTML = `${makeModelSpanHTML}${y ? ` (${escHtml(y)})` : ''}`;
        title.style.fontWeight = '600';

        const close = document.createElement('div');
        close.textContent = '×';
        close.title = 'Close';
        close.style.cursor = 'pointer';
        close.style.fontSize = '18px';
        close.style.lineHeight = '18px';
        close.style.marginLeft = '10px';
        close.onclick = () => wrap.remove();

        header.appendChild(title);
        header.appendChild(close);

        const body = document.createElement('div');
        body.style.padding = '10px 12px';
        body.style.fontSize = '14px';

        const rows = [
            ['Manufacturer', info.manufacturerName],
            ['Model', info.model],
            ['Type', info.type],
            ['VIN', info.VIN],
            ['Registration date', info.registrationDate],
            ['Fuel', info.fuel],
            ['Power', (info.powerKw || info.powerHp) ? `${info.powerKw ?? ''}${info.powerKw ? ' kW' : ''}${(info.powerKw && info.powerHp) ? ' / ' : ''}${info.powerHp ?? ''}${info.powerHp ? ' hp' : ''}` : ''],
        ].filter(([, v]) => v);

        for (const [label, value] of rows) {
            const row = document.createElement('div');
            row.style.display = 'flex';
            row.style.alignItems = 'center';
            row.style.margin = '6px 0';

            const text = document.createElement('div');
            text.textContent = `${label}: ${value}`;
            text.style.flex = '1 1 auto';

            const img = document.createElement('img');
            img.src = 'https://i.imgur.com/RjmoRpu.png';
            img.alt = 'Copy';
            img.title = 'Copy';
            img.style.height = '1em';
            img.style.cursor = 'pointer';
            img.style.marginLeft = '8px';
            img.onclick = () => copyToClipboard(String(value));

            row.appendChild(text);
            row.appendChild(img);
            body.appendChild(row);
        }

        wrap.appendChild(header);
        wrap.appendChild(body);
        document.body.appendChild(wrap);
        makeDraggable(wrap, header);
    }

    function showTrodoWindow(info) {
        const existing = document.getElementById('trodoFloatWin');
        if (existing) existing.remove();

        const wrap = document.createElement('div');
        wrap.id = 'trodoFloatWin';
        wrap.style.position = 'fixed';
        wrap.style.top = '80px';
        wrap.style.right = '40px';
        wrap.style.zIndex = '99999';
        wrap.style.background = '#fff';
        wrap.style.border = '1px solid #ccc';
        wrap.style.borderRadius = '6px';
        wrap.style.boxShadow = '0 6px 18px rgba(0,0,0,0.18)';
        wrap.style.minWidth = '260px';
        wrap.style.maxWidth = '420px';
        wrap.style.fontFamily = 'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif';

        const header = document.createElement('div');
        header.style.padding = '10px 12px';
        header.style.borderBottom = '1px solid #eee';
        header.style.display = 'flex';
        header.style.alignItems = 'center';
        header.style.justifyContent = 'space-between';
        header.style.background = '#f8f9fa';

        const makeModel = `${info.manufacturer || ''} ${info.model || ''}`.trim().replace(/\s+/g, ' ');
        const makeModelSpanHTML =
              `<span style="border-bottom: 1px dotted;" onclick="$('#markamodtype').val('${escAttr(makeModel)}').autocomplete('search', '${escAttr(makeModel)}'); return false;">${escHtml(makeModel)}</span>`;
        const y = info.year ? ` (${escHtml(info.year)})` : '';
        const title = document.createElement('div');
        title.innerHTML = `${makeModelSpanHTML}${y}`;
        title.style.fontWeight = '600';

        const close = document.createElement('div');
        close.textContent = '×';
        close.title = 'Close';
        close.style.cursor = 'pointer';
        close.style.fontSize = '18px';
        close.style.lineHeight = '18px';
        close.style.marginLeft = '10px';
        close.onclick = () => wrap.remove();

        header.appendChild(title);
        header.appendChild(close);

        const body = document.createElement('div');
        body.style.padding = '10px 12px';
        body.style.fontSize = '14px';

        const rows = [
            ['Manufacturer', info.manufacturer],
            ['Model', info.model],
            ['Variant', info.variant],
            ['VIN', info.vin],
            ['Year', info.year],
            ['Fuel', info.fuel],
            ['Engine', info.engine],
            ['Power', info.power],
        ].filter(([, v]) => v);

        for (const [label, value] of rows) {
            const row = document.createElement('div');
            row.style.display = 'flex';
            row.style.alignItems = 'center';
            row.style.margin = '6px 0';

            const text = document.createElement('div');
            text.textContent = `${label}: ${value}`;
            text.style.flex = '1 1 auto';

            const img = document.createElement('img');
            img.src = 'https://i.imgur.com/RjmoRpu.png';
            img.alt = 'Copy';
            img.title = 'Copy';
            img.style.height = '1em';
            img.style.cursor = 'pointer';
            img.style.marginLeft = '8px';
            img.onclick = () => copyToClipboard(String(value));

            row.appendChild(text);
            row.appendChild(img);
            body.appendChild(row);
        }

        wrap.appendChild(header);
        wrap.appendChild(body);
        document.body.appendChild(wrap);
        makeDraggable(wrap, header);
    }

    async function fetchMotonetData(fiPlateRaw) {
        const plate = String(fiPlateRaw || '').trim().toUpperCase();
        if (!plate) throw new Error('Empty plate');
        const url = `https://www.motonet.fi/api/vehicleInfo/registrationNumber/FI?locale=fi&registrationNumber=${encodeURIComponent(plate)}`;
        const data = await httpGet(url).catch(() => ({}));
        return data && typeof data === 'object' ? data : {};
    }

    async function fetchTrodoData(itPlateRaw) {
        const plate = String(itPlateRaw || '').trim().toUpperCase();
        if (!plate) throw new Error('Empty plate');
        const url = `https://www.trodo.it/rest/V1/partfinder/search/IT/${encodeURIComponent(plate)}/1`;

        try {
            const response = await new Promise((resolve, reject) => {
                if (typeof GM_xmlhttpRequest === 'function') {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url,
                        headers: { 'Accept': 'application/xml' },
                        onload: (res) => {
                            // Check for captcha response
                            if (res.responseText.includes('Just a moment...')) {
                                reject(new Error('CAPTCHA_REQUIRED'));
                                return;
                            }
                            resolve(res);
                        },
                        onerror: (e) => reject(e),
                    });
                } else {
                    fetch(url, { headers: { 'Accept': 'application/xml' } })
                        .then(r => r.text())
                        .then(text => {
                        if (text.includes('Just a moment...')) {
                            reject(new Error('CAPTCHA_REQUIRED'));
                            return;
                        }
                        resolve({ responseText: text });
                    })
                        .catch(reject);
                }
            });

            // Parse XML response
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(response.responseText, 'text/xml');

            // Extract vehicle information from the XML structure
            const values = xmlDoc.querySelectorAll('values item');
            const info = {
                manufacturer: '',
                model: '',
                variant: '',
                year: '',
                fuel: '',
                engine: '',
                power: '',
                vin: ''
            };

            // Extract VIN from attributes
            const vinAttr = xmlDoc.querySelector('attributes vin');
            if (vinAttr) {
                info.vin = vinAttr.textContent || '';
            }

            // Extract vehicle details from values
            for (const item of values) {
                const label = item.querySelector('label name MagentoFrameworkPhrasetext');
                const value = item.querySelector('value');
                const year = item.querySelector('label year');
                const yearFrom = item.querySelector('label year_from');
                const yearTo = item.querySelector('label year_to');
                const fuel = item.querySelector('label engine_fuel MagentoFrameworkPhrasetext');
                const engine = item.querySelector('label engine');
                const power = item.querySelector('label kw_ps');
                const ccm = item.querySelector('label ccm');
                const liters = item.querySelector('label liters');

                if (label && value) {
                    const labelText = label.textContent || '';
                    const valueText = value.textContent || '';

                    // Map different fields based on dropdown_id or label content
                    const dropdownId = item.querySelector('dropdown_id')?.textContent || '';

                    if (dropdownId === '1' || labelText.includes('VOLVO')) {
                        info.manufacturer = labelText;
                    } else if (dropdownId === '2' || (labelText.includes('XC') && !labelText.includes('('))) {
                        info.model = labelText;
                    } else if (dropdownId === '3' || labelText.includes('(')) {
                        info.variant = labelText;
                    }
                }

                if (yearFrom) {
                    info.year = yearFrom.textContent || '';
                }

                if (fuel) {
                    info.fuel = fuel.textContent || '';
                }

                if (engine) {
                    const engineItems = engine.querySelectorAll('item');
                    const engineNames = Array.from(engineItems).map(item => item.textContent).filter(Boolean);
                    if (engineNames.length > 0) {
                        info.engine = engineNames.join(', ');
                    }
                }

                if (power) {
                    info.power = power.textContent || '';
                }
            }

            return info;
        } catch (error) {
            if (error.message === 'CAPTCHA_REQUIRED') {
                throw new Error('CAPTCHA_REQUIRED');
            }
            throw error;
        }
    }

    // --- Utils for RDW API + Floating Window ---
    function httpGet(url) {
        return new Promise((resolve, reject) => {
            if (typeof GM_xmlhttpRequest === 'function') {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url,
                    headers: { 'Accept': 'application/json' },
                    onload: (res) => {
                        try { resolve(JSON.parse(res.responseText)); }
                        catch (e) { reject(e); }
                    },
                    onerror: (e) => reject(e),
                });
            } else {
                fetch(url).then(r => r.json()).then(resolve).catch(reject);
            }
        });
    }

    function httpPost(url, headers, data) {
        return new Promise((resolve, reject) => {
            if (typeof GM_xmlhttpRequest === 'function') {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url,
                    headers: headers,
                    data: JSON.stringify(data),
                    onload: (res) => {
                        try { resolve(JSON.parse(res.responseText)); }
                        catch (e) { reject(e); }
                    },
                    onerror: (e) => reject(e),
                });
            } else {
                fetch(url, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(data)
                }).then(r => r.json()).then(resolve).catch(reject);
            }
        });
    }

    async function getCurrentIPAddress() {
        try {
            const response = await httpGet('https://api.ipify.org?format=json');
            return response.ip || '';
        } catch {
            return '';
        }
    }

    function onlyYear(yyyymmdd) {
        if (!yyyymmdd || typeof yyyymmdd !== 'string') return 'unknown';
        if (/^\d{8}$/.test(yyyymmdd)) return yyyymmdd.slice(0,4);
        return 'unknown';
    }

    function copyToClipboard(text) {
        const doFallback = () => {
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            try { document.execCommand('copy'); } catch {}
            document.body.removeChild(ta);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).catch(doFallback);
        } else {
            doFallback();
        }
    }

    function escHtml(s) {
        return String(s).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    }
    function escAttr(s) {
        return String(s).replace(/['"]/g, (c) => ({ "'": "\\'", '"': '\\"' }[c]));
    }

    function makeDraggable(win, handle) {
        let ox=0, oy=0, dragging=false;
        handle.style.cursor = 'move';
        handle.addEventListener('mousedown', (e) => {
            dragging = true;
            ox = e.clientX - win.offsetLeft;
            oy = e.clientY - win.offsetTop;
            document.addEventListener('mousemove', move);
            document.addEventListener('mouseup', up);
            e.preventDefault();
        });
        function move(e) {
            if (!dragging) return;
            win.style.left = (e.clientX - ox) + 'px';
            win.style.top = (e.clientY - oy) + 'px';
        }
        function up() {
            dragging = false;
            document.removeEventListener('mousemove', move);
            document.removeEventListener('mouseup', up);
        }
    }

    function showRDWWindow(info) {
        const existing = document.getElementById('rdwFloatWin');
        if (existing) existing.remove();

        const wrap = document.createElement('div');
        wrap.id = 'rdwFloatWin';
        wrap.style.position = 'fixed';
        wrap.style.top = '80px';
        wrap.style.right = '40px';
        wrap.style.zIndex = '99999';
        wrap.style.background = '#fff';
        wrap.style.border = '1px solid #ccc';
        wrap.style.borderRadius = '6px';
        wrap.style.boxShadow = '0 6px 18px rgba(0,0,0,0.18)';
        wrap.style.minWidth = '260px';
        wrap.style.maxWidth = '380px';
        wrap.style.fontFamily = 'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif';

        const header = document.createElement('div');
        header.style.padding = '10px 12px';
        header.style.borderBottom = '1px solid #eee';
        header.style.display = 'flex';
        header.style.alignItems = 'center';
        header.style.justifyContent = 'space-between';
        header.style.background = '#f8f9fa';

        const makeModel = `${info.make} ${info.model}`.trim().replace(/\s+/g,' ');
        const makeModelSpanHTML =
              `<span style="border-bottom: 1px dotted;" onclick="$('#markamodtype').val('${escAttr(makeModel)}').autocomplete('search', '${escAttr(makeModel)}'); return false;">${escHtml(makeModel)}</span>`;
        const y = info.yFirst && info.yFirst !== 'unknown' ? ` (${escHtml(info.yFirst)})` : '';
        const title = document.createElement('div');
        title.innerHTML = `${makeModelSpanHTML}${y}`;
        title.style.fontWeight = '600';

        const close = document.createElement('div');
        close.textContent = '×';
        close.title = 'Close';
        close.style.cursor = 'pointer';
        close.style.fontSize = '18px';
        close.style.lineHeight = '18px';
        close.style.marginLeft = '10px';
        close.onclick = () => wrap.remove();

        header.appendChild(title);
        header.appendChild(close);

        const body = document.createElement('div');
        body.style.padding = '10px 12px';
        body.style.fontSize = '14px';

        const rows = [
            ['Make', info.make],
            ['Model', info.model],
            ['Variant', info.variant],
            ['First registration', info.yFirst],
            ['First registration in NL', info.yNL],
            ['Fuel', info.fuel],
            ['Doors', info.doors],
            ['Color', info.color],
        ];

        for (const [label, value] of rows) {
            const row = document.createElement('div');
            row.style.display = 'flex';
            row.style.alignItems = 'center';
            row.style.margin = '6px 0';

            const text = document.createElement('div');
            text.textContent = `${label}: ${value}`;
            text.style.flex = '1 1 auto';

            const img = document.createElement('img');
            img.src = 'https://i.imgur.com/RjmoRpu.png';
            img.alt = 'Copy';
            img.title = 'Copy';
            img.style.height = '1em';
            img.style.cursor = 'pointer';
            img.style.marginLeft = '8px';
            img.onclick = () => copyToClipboard(String(value));

            row.appendChild(text);
            row.appendChild(img);
            body.appendChild(row);
        }

        wrap.appendChild(header);
        wrap.appendChild(body);
        document.body.appendChild(wrap);
        makeDraggable(wrap, header);
    }

    async function fetchRDWData(kentekenRaw) {
        const plate = String(kentekenRaw || '').trim().replace(/[\s-]+/g, '').toUpperCase();
        if (!plate) throw new Error('Empty plate');

        const baseUrl = 'https://opendata.rdw.nl/resource/m9d7-ebf2.json';
        const fuelUrl = 'https://opendata.rdw.nl/resource/8ys7-d773.json';
        const qBase = `${baseUrl}?kenteken=${encodeURIComponent(plate)}`;
        const qFuel = `${fuelUrl}?kenteken=${encodeURIComponent(plate)}`;

        const [base, fuel] = await Promise.all([
            httpGet(qBase).catch(() => []),
            httpGet(qFuel).catch(() => []),
        ]);

        const primary = Array.isArray(base) && base.length ? base[0] : {};
        const fuelTypes = (Array.isArray(fuel) ? fuel : [])
        .map(x => x.brandstof_omschrijving || x.brandstof_omschrijving_ || x.brandstof || '')
        .filter(Boolean);

        const info = {
            make: primary.merk || 'unknown',
            model: primary.handelsbenaming || 'unknown',
            variant: primary.variant || 'unknown',
            yFirst: onlyYear(primary.datum_eerste_toelating),
            yNL: onlyYear(primary.datum_eerste_tenaamstelling_in_nederland),
            fuel: fuelTypes.length ? fuelTypes.join('/') : 'unknown',
            doors: primary.aantal_deuren || 'unknown',
            color: primary.eerste_kleur || 'unknown',
        };

        return info;
    }

    // Helper function to check if a field should be filtered out
    function shouldFilterField(key) {
        const filterPatterns = [
            /_btn$/i,
            /_captcha/i,
            /captcha/i,
            /^check list show data$/i,
            /^vehicle_view_more_btn$/i,
            /^vehicle_captcha_btn$/i,
            /^checkListShowData$/i,
            /^metadata$/i,
            /^internal/i,
            /^debug/i,
            /^_/i  // Fields starting with underscore
        ];
        return filterPatterns.some(pattern => pattern.test(key));
    }

    // Helper function to clean up field names for display
    function cleanFieldName(key) {
        // Remove common prefixes/suffixes
        let cleaned = String(key)
            .replace(/^vehicle_/i, '')
            .replace(/_btn$/i, '')
            .replace(/_captcha$/i, '')
            .replace(/^checkListShowData$/i, '')
            .replace(/^check list show data$/i, '');

        // Convert snake_case and camelCase to Title Case
        cleaned = cleaned
            .replace(/_/g, ' ')
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .replace(/\b\w/g, l => l.toUpperCase())
            .trim();

        // Special case mappings
        const specialCases = {
            'Mileage History': 'History',
            'Mileagehistory': 'History',
            'mileageHistory': 'History'
        };

        return specialCases[cleaned] || cleaned;
    }

    // Helper function to format values for display
    function formatValue(value) {
        if (value === null || value === undefined) return '';
        if (typeof value === 'boolean') return value ? 'Yes' : 'No';
        if (typeof value === 'object') {
            if (Array.isArray(value)) {
                return value.length > 0 ? value.join(', ') : '';
            }
            return JSON.stringify(value, null, 2);
        }
        return String(value);
    }

    // Helper function to extract plate history from data
    function extractPlateHistory(data) {
        // Map to store first occurrence of each plate: plate -> {plate, date, source}
        const plateMap = new Map();

        // Helper to add a plate with its date, keeping the earliest date if plate appears multiple times
        function addPlate(plate, date, source) {
            if (!plate || typeof plate !== 'string') return;

            const cleanPlate = plate.trim().toUpperCase().replace(/\s+/g, '');
            // Basic validation: UK plates are typically 2-10 characters (with spaces removed)
            if (cleanPlate.length < 2 || cleanPlate.length > 10 || !/^[A-Z0-9-]+$/.test(cleanPlate)) {
                return;
            }

            if (!plateMap.has(cleanPlate)) {
                // First time seeing this plate
                plateMap.set(cleanPlate, {
                    plate: cleanPlate,
                    date: date,
                    source: source
                });
            } else {
                // Plate already exists - keep the earliest date
                const existing = plateMap.get(cleanPlate);
                if (date) {
                    if (existing.date) {
                        // Both have dates - keep the earlier one
                        const existingDate = new Date(existing.date);
                        const newDate = new Date(date);
                        if (!isNaN(newDate.getTime()) && !isNaN(existingDate.getTime()) && newDate < existingDate) {
                            // New date is earlier, update it
                            existing.date = date;
                            existing.source = source;
                        }
                    } else {
                        // Existing entry has no date, use the new one
                        existing.date = date;
                        existing.source = source;
                    }
                }
                // If new date is null but existing has a date, keep the existing date
            }
        }

        // FIRST: Add plates with first registration date (original plates)
        // This ensures original plates keep their first registration date, not plate change dates
        if (data.vehicleInformation) {
            const firstRegDate = data.vehicleInformation.DateFirstRegisteredUk ||
                               data.vehicleInformation.DateFirstRegistered;

            // Current plate
            const currentPlate = data.vehicleInformation.Vrm || data.vehicleInformation.vrm;
            if (currentPlate && firstRegDate) {
                addPlate(currentPlate, firstRegDate, 'vehicleInformation');
            }

            // Previous plate (original plate)
            const prevPlate = data.vehicleInformation.PreviousVrmGb || data.vehicleInformation.previousVrmGb;
            if (prevPlate && firstRegDate) {
                addPlate(prevPlate, firstRegDate, 'vehicleInformation');
            }
        }

        // Check vehicleData for previousVrmGb with first keeper date
        if (data.vehicleData) {
            const prevPlate = data.vehicleData.previousVrmGb || data.vehicleData.PreviousVrmGb;
            if (prevPlate) {
                // Try to find earliest date from keeper changes (first keeper = original registration)
                let earliestDate = null;
                if (data.vehicleData.keeperChanged && Array.isArray(data.vehicleData.keeperChanged) && data.vehicleData.keeperChanged.length > 0) {
                    // Last item in array is usually the first keeper (oldest)
                    const firstKeeper = data.vehicleData.keeperChanged[data.vehicleData.keeperChanged.length - 1];
                    earliestDate = firstKeeper.date;
                }
                if (earliestDate) {
                    addPlate(prevPlate, earliestDate, 'vehicleData');
                }
            }
        }

        // THEN: Process plate changes
        // For "current" plates in changes, the change date is when they first appeared
        // For "previous" plates, add them but don't use the change date (they existed before)

        // Check mileageHistory array for plate changes
        if (data.mileageHistory && Array.isArray(data.mileageHistory)) {
            data.mileageHistory.forEach(entry => {
                if (entry.type === 'plate') {
                    const date = entry.date || entry.latest;
                    // For previous plate: add it but without date (it existed before this change date)
                    // If it's already in map with a date, that date will be kept (earlier)
                    if (entry.previous) {
                        addPlate(entry.previous, null, 'mileageHistory');
                    }
                    // For current plate: this is when it first appeared
                    if (entry.current) {
                        addPlate(entry.current, date, 'mileageHistory');
                    }
                }
            });
        }

        // Check plateChange array
        if (data.plateChange && Array.isArray(data.plateChange)) {
            data.plateChange.forEach(entry => {
                const date = entry.date || entry.latest;
                // Similar logic: previous existed before, current first appeared on this date
                if (entry.previous) {
                    addPlate(entry.previous, null, 'plateChange');
                }
                if (entry.current) {
                    addPlate(entry.current, date, 'plateChange');
                }
            });
        }

        // Check motlist_combine_plate_change array (combined MOT and plate change data)
        if (data.motlist_combine_plate_change && Array.isArray(data.motlist_combine_plate_change)) {
            data.motlist_combine_plate_change.forEach(entry => {
                if (entry.listtype === 'platechange') {
                    const date = entry.date || entry.latest;
                    if (entry.previous) {
                        addPlate(entry.previous, null, 'motlist_combine_plate_change');
                    }
                    if (entry.current) {
                        addPlate(entry.current, date, 'motlist_combine_plate_change');
                    }
                }
            });
        }

        // Convert map to array and sort by date
        const plateEntries = Array.from(plateMap.values());
        plateEntries.sort((a, b) => {
            if (a.date && b.date) {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
                    return dateA - dateB;
                }
            }
            if (a.date) return -1;
            if (b.date) return 1;
            return 0;
        });

        return plateEntries;
    }

    // Helper function to check if data looks like chart/graph data or tabular data
    function isChartData(data) {
        if (!data || typeof data !== 'object') return false;
        if (Array.isArray(data)) {
            // Check if it's an array of objects that could be chart/table data
            if (data.length === 0) return false;
            // If all items are objects with consistent structure, treat as table data
            const firstItem = data[0];
            if (typeof firstItem === 'object' && firstItem !== null) {
                const keys = Object.keys(firstItem);
                // If items have consistent keys, treat as table (even single item)
                if (keys.length > 0) {
                    if (data.length > 1) {
                        // Multiple items - check consistency
                        return data.every(item =>
                            typeof item === 'object' && item !== null &&
                            Object.keys(item).length === keys.length &&
                            keys.every(k => item.hasOwnProperty(k))
                        );
                    } else {
                        // Single item - check if it has chart-like properties
                        return keys.some(k =>
                            /^(x|y|date|label|value|data|series)$/i.test(k)
                        ) || (firstItem.x !== undefined || firstItem.date !== undefined || firstItem.label !== undefined);
                    }
                }
            }
        }
        // Check for common chart data structures
        return data.labels !== undefined || data.datasets !== undefined ||
               data.data !== undefined || data.series !== undefined ||
               (data.x !== undefined && data.y !== undefined);
    }

    // Helper function to create a table from chart/graph data
    function createTableFromChartData(data) {
        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.style.marginTop = '8px';
        table.style.fontSize = '11px';

        if (Array.isArray(data) && data.length > 0) {
            // Create header from first item's keys
            const firstItem = data[0];
            if (typeof firstItem === 'object' && firstItem !== null) {
                const thead = document.createElement('thead');
                const headerRow = document.createElement('tr');
                headerRow.style.background = '#f5f5f5';
                headerRow.style.borderBottom = '2px solid #ddd';

                const keys = Object.keys(firstItem);
                keys.forEach(key => {
                    const th = document.createElement('th');
                    th.textContent = cleanFieldName(key);
                    th.style.padding = '6px 8px';
                    th.style.textAlign = 'left';
                    th.style.fontWeight = '600';
                    th.style.border = '1px solid #ddd';
                    headerRow.appendChild(th);
                });
                thead.appendChild(headerRow);
                table.appendChild(thead);

                // Create body
                const tbody = document.createElement('tbody');
                data.forEach((item, idx) => {
                    const row = document.createElement('tr');
                    row.style.background = idx % 2 === 0 ? '#fff' : '#f9f9f9';
                    keys.forEach(key => {
                        const td = document.createElement('td');
                        td.textContent = formatValue(item[key]);
                        td.style.padding = '6px 8px';
                        td.style.border = '1px solid #ddd';
                        td.style.wordBreak = 'break-word';
                        row.appendChild(td);
                    });
                    tbody.appendChild(row);
                });
                table.appendChild(tbody);
            }
        } else if (data.labels && data.data) {
            // Chart.js style data
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            headerRow.style.background = '#f5f5f5';
            const th1 = document.createElement('th');
            th1.textContent = 'Label';
            th1.style.padding = '6px 8px';
            const th2 = document.createElement('th');
            th2.textContent = 'Value';
            th2.style.padding = '6px 8px';
            headerRow.appendChild(th1);
            headerRow.appendChild(th2);
            thead.appendChild(headerRow);
            table.appendChild(thead);

            const tbody = document.createElement('tbody');
            const labels = Array.isArray(data.labels) ? data.labels : [];
            const values = Array.isArray(data.data) ? data.data : [];
            const maxLen = Math.max(labels.length, values.length);
            for (let i = 0; i < maxLen; i++) {
                const row = document.createElement('tr');
                const td1 = document.createElement('td');
                td1.textContent = formatValue(labels[i] || '');
                td1.style.padding = '6px 8px';
                const td2 = document.createElement('td');
                td2.textContent = formatValue(values[i] || '');
                td2.style.padding = '6px 8px';
                row.appendChild(td1);
                row.appendChild(td2);
                tbody.appendChild(row);
            }
            table.appendChild(tbody);
        }

        return table;
    }

    // Helper function to create a collapsible section
    function createSection(title, data, isExpanded = false) {
        const section = document.createElement('div');
        section.style.marginBottom = '8px';
        section.style.border = '1px solid #e0e0e0';
        section.style.borderRadius = '4px';
        section.style.overflow = 'hidden';

        const header = document.createElement('div');
        header.style.padding = '8px 12px';
        header.style.background = '#f5f5f5';
        header.style.cursor = 'pointer';
        header.style.display = 'flex';
        header.style.alignItems = 'center';
        header.style.justifyContent = 'space-between';
        header.style.userSelect = 'none';
        header.style.fontWeight = '600';
        header.style.fontSize = '13px';
        header.style.color = '#333';

        const titleSpan = document.createElement('span');
        titleSpan.textContent = title;
        header.appendChild(titleSpan);

        const toggle = document.createElement('span');
        toggle.textContent = isExpanded ? '▼' : '▶';
        toggle.style.marginLeft = '8px';
        toggle.style.fontSize = '10px';
        toggle.style.color = '#666';
        toggle.style.flexShrink = '0';
        header.appendChild(toggle);

        const content = document.createElement('div');
        content.style.display = isExpanded ? 'block' : 'none';
        content.style.padding = '8px 12px';
        content.style.background = '#fff';
        content.style.maxHeight = '400px';
        content.style.overflowY = 'auto';

        let hasData = false;
        if (data && typeof data === 'object' && !Array.isArray(data)) {
            // Check if it's chart data
            if (isChartData(data)) {
                hasData = true;
                const table = createTableFromChartData(data);
                content.appendChild(table);
            } else {
                for (const [key, value] of Object.entries(data)) {
                    // Filter out unwanted fields
                    if (shouldFilterField(key)) continue;
                    if (value !== null && value !== undefined && value !== '') {
                        hasData = true;
                        const row = createDataRow(key, value);
                        content.appendChild(row);
                    }
                }
            }
        } else if (Array.isArray(data) && data.length > 0) {
            // Check if array looks like chart data
            if (isChartData(data)) {
                hasData = true;
                const table = createTableFromChartData(data);
                content.appendChild(table);
            } else {
                hasData = true;
                data.forEach((item, idx) => {
                    if (item && typeof item === 'object') {
                        const itemHeader = document.createElement('div');
                        itemHeader.style.fontWeight = '600';
                        itemHeader.style.marginTop = idx > 0 ? '12px' : '0';
                        itemHeader.style.marginBottom = '6px';
                        itemHeader.style.color = '#555';
                        itemHeader.textContent = `Item ${idx + 1}`;
                        content.appendChild(itemHeader);
                        for (const [key, value] of Object.entries(item)) {
                            // Filter out unwanted fields
                            if (shouldFilterField(key)) continue;
                            if (value !== null && value !== undefined && value !== '') {
                                const row = createDataRow(key, value);
                                content.appendChild(row);
                            }
                        }
                    } else {
                        const row = createDataRow(`Item ${idx + 1}`, item);
                        content.appendChild(row);
                    }
                });
            }
        } else if (data !== null && data !== undefined && data !== '') {
            hasData = true;
            const row = createDataRow('Value', data);
            content.appendChild(row);
        }

        if (!hasData) {
            const emptyMsg = document.createElement('div');
            emptyMsg.textContent = 'No data available';
            emptyMsg.style.color = '#999';
            emptyMsg.style.fontStyle = 'italic';
            content.appendChild(emptyMsg);
        }

        header.onclick = () => {
            const isNowExpanded = content.style.display !== 'none';
            content.style.display = isNowExpanded ? 'none' : 'block';
            toggle.textContent = isNowExpanded ? '▶' : '▼';
        };

        section.appendChild(header);
        section.appendChild(content);
        return section;
    }

    // Helper function to create a data row with copy functionality
    function createDataRow(label, value) {
        // Filter out unwanted fields
        if (shouldFilterField(label)) {
            return null;
        }

        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.alignItems = 'flex-start';
        row.style.margin = '6px 0';
        row.style.fontSize = '12px';
        row.style.lineHeight = '1.6';
        row.style.minHeight = '20px';

        const cleanedLabel = cleanFieldName(label);
        const labelDiv = document.createElement('div');
        labelDiv.textContent = cleanedLabel + ':';
        labelDiv.style.minWidth = '150px';
        labelDiv.style.maxWidth = '150px';
        labelDiv.style.fontWeight = '500';
        labelDiv.style.color = '#555';
        labelDiv.style.marginRight = '10px';
        labelDiv.style.flexShrink = '0';
        labelDiv.style.wordBreak = 'break-word';
        labelDiv.style.overflowWrap = 'break-word';

        const valueDiv = document.createElement('div');
        valueDiv.style.flex = '1 1 auto';
        valueDiv.style.minWidth = '0'; // Important for flexbox text wrapping
        valueDiv.style.color = '#333';
        valueDiv.style.wordBreak = 'break-word';
        valueDiv.style.overflowWrap = 'break-word';
        valueDiv.style.whiteSpace = 'pre-wrap'; // Preserve line breaks but allow wrapping

        const formattedValue = formatValue(value);
        if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
            // Check if it's chart data
            if (isChartData(value)) {
                const table = createTableFromChartData(value);
                valueDiv.appendChild(table);
            } else {
                // For nested objects, create a nested structure
                const nestedDiv = document.createElement('div');
                nestedDiv.style.paddingLeft = '10px';
                nestedDiv.style.borderLeft = '2px solid #e0e0e0';
                nestedDiv.style.marginTop = '4px';
                let hasNestedData = false;
                for (const [nestedKey, nestedValue] of Object.entries(value)) {
                    // Filter nested fields too
                    if (shouldFilterField(nestedKey)) continue;
                    if (nestedValue !== null && nestedValue !== undefined && nestedValue !== '') {
                        hasNestedData = true;
                        const nestedRow = createDataRow(nestedKey, nestedValue);
                        if (nestedRow) {
                            nestedRow.style.margin = '3px 0';
                            nestedRow.style.fontSize = '11px';
                            nestedDiv.appendChild(nestedRow);
                        }
                    }
                }
                if (hasNestedData) {
                    valueDiv.appendChild(nestedDiv);
                } else {
                    valueDiv.textContent = formattedValue;
                }
            }
        } else {
            valueDiv.textContent = formattedValue;
        }

        const copyImg = document.createElement('img');
        copyImg.src = 'https://i.imgur.com/RjmoRpu.png';
        copyImg.alt = 'Copy';
        copyImg.title = 'Copy';
        copyImg.style.height = '14px';
        copyImg.style.width = '14px';
        copyImg.style.cursor = 'pointer';
        copyImg.style.marginLeft = '8px';
        copyImg.style.flexShrink = '0';
        copyImg.style.marginTop = '2px';
        copyImg.onclick = () => copyToClipboard(formattedValue);

        row.appendChild(labelDiv);
        row.appendChild(valueDiv);
        row.appendChild(copyImg);
        return row;
    }

    function showCarbabaWindow(info) {
        const existing = document.getElementById('carbabaFloatWin');
        if (existing) existing.remove();

        const wrap = document.createElement('div');
        wrap.id = 'carbabaFloatWin';
        wrap.style.position = 'fixed';
        wrap.style.top = '80px';
        wrap.style.right = '40px';
        wrap.style.zIndex = '99999';
        wrap.style.background = '#fff';
        wrap.style.border = '1px solid #ccc';
        wrap.style.borderRadius = '6px';
        wrap.style.boxShadow = '0 6px 18px rgba(0,0,0,0.18)';
        wrap.style.minWidth = '320px';
        wrap.style.maxWidth = '600px';
        wrap.style.maxHeight = '85vh';
        wrap.style.fontFamily = 'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif';
        wrap.style.display = 'flex';
        wrap.style.flexDirection = 'column';

        const header = document.createElement('div');
        header.style.padding = '10px 12px';
        header.style.borderBottom = '1px solid #eee';
        header.style.display = 'flex';
        header.style.alignItems = 'center';
        header.style.justifyContent = 'space-between';
        header.style.background = '#f8f9fa';
        header.style.flexShrink = '0';

        // Extract make/model for title
        const data = info.fullData || {};
        const vehicleInfo = data.vehicleInformation || {};
        const smmtDetails = data.smmtDetails || {};
        const make = vehicleInfo.Make || smmtDetails.Marque || '';
        const model = vehicleInfo.Model || smmtDetails.ModelVariant || '';
        const year = vehicleInfo.YearOfManufacture || (smmtDetails.VisibilityDate ? String(new Date(smmtDetails.VisibilityDate).getFullYear()) : '') || '';

        const makeModel = `${make} ${model}`.trim().replace(/\s+/g, ' ');
        const makeModelSpanHTML = makeModel ?
              `<span style="border-bottom: 1px dotted;" onclick="$('#markamodtype').val('${escAttr(makeModel)}').autocomplete('search', '${escAttr(makeModel)}'); return false;">${escHtml(makeModel)}</span>` : '';
        const y = year ? ` (${escHtml(year)})` : '';
        const title = document.createElement('div');
        title.innerHTML = (makeModelSpanHTML || 'Carbaba Lookup') + y;
        title.style.fontWeight = '600';
        title.style.fontSize = '14px';

        const close = document.createElement('div');
        close.textContent = '×';
        close.title = 'Close';
        close.style.cursor = 'pointer';
        close.style.fontSize = '20px';
        close.style.lineHeight = '20px';
        close.style.marginLeft = '10px';
        close.style.color = '#666';
        close.onclick = () => wrap.remove();

        header.appendChild(title);
        header.appendChild(close);

        const body = document.createElement('div');
        body.style.padding = '10px 12px';
        body.style.fontSize = '13px';
        body.style.overflowY = 'auto';
        body.style.flex = '1 1 auto';

        // Display API status/message if available
        if (info.message) {
            const statusDiv = document.createElement('div');
            statusDiv.style.padding = '8px';
            statusDiv.style.marginBottom = '10px';
            statusDiv.style.background = info.status ? '#d4edda' : '#f8d7da';
            statusDiv.style.border = `1px solid ${info.status ? '#c3e6cb' : '#f5c6cb'}`;
            statusDiv.style.borderRadius = '4px';
            statusDiv.style.color = info.status ? '#155724' : '#721c24';
            statusDiv.style.fontSize = '12px';
            statusDiv.textContent = info.message;
            body.appendChild(statusDiv);
        }

        // Extract plate history first
        const plateHistory = extractPlateHistory(data);

        // Organize data into logical sections
        const sections = [];

        // Vehicle Information (most important, expanded by default)
        if (data.vehicleInformation) {
            sections.push({ title: 'Vehicle Information', data: data.vehicleInformation, expanded: true });
        }

        // Plate History (special section)
        if (plateHistory.length > 0) {
            const plateHistoryData = plateHistory.map(entry => ({
                'License Plate': entry.plate,
                'Date': entry.date ? (new Date(entry.date).toLocaleDateString() || entry.date) : 'Unknown'
            }));
            sections.push({ title: 'Plate History', data: plateHistoryData, expanded: false });
        }

        // SMMT Details
        if (data.smmtDetails) {
            sections.push({ title: 'SMMT Details', data: data.smmtDetails, expanded: false });
        }

        // Engine Details
        if (data.general && data.general.Engine) {
            sections.push({ title: 'Engine Details', data: data.general.Engine, expanded: false });
        }

        // General Information (excluding Engine which is shown separately)
        if (data.general) {
            const generalWithoutEngine = { ...data.general };
            delete generalWithoutEngine.Engine;
            if (Object.keys(generalWithoutEngine).length > 0) {
                sections.push({ title: 'General Information', data: generalWithoutEngine, expanded: false });
            }
        }

        // Performance
        if (data.performance) {
            sections.push({ title: 'Performance', data: data.performance, expanded: false });
        }

        // MOT Data
        if (data.motData || data.mot) {
            sections.push({ title: 'MOT Data', data: data.motData || data.mot, expanded: false });
        }

        // History (mileage history renamed)
        if (data.mileageHistory || data.mileagehistory || data.history) {
            const historyData = data.mileageHistory || data.mileagehistory || data.history;
            sections.push({ title: 'History', data: historyData, expanded: false });
        }

        // Tax Information
        if (data.tax || data.taxInformation) {
            sections.push({ title: 'Tax Information', data: data.tax || data.taxInformation, expanded: false });
        }

        // Insurance Group
        if (data.insuranceGroup || data.insurance) {
            sections.push({ title: 'Insurance', data: data.insuranceGroup || data.insurance, expanded: false });
        }

        // Valuation/Price Information
        if (data.valuation || data.price || data.value) {
            sections.push({ title: 'Valuation', data: data.valuation || data.price || data.value, expanded: false });
        }

        // Chart/Graph Data
        if (data.chart || data.graph || data.chartData || data.graphData) {
            const chartData = data.chart || data.graph || data.chartData || data.graphData;
            sections.push({ title: 'Chart Data', data: chartData, expanded: false });
        }

        // Additional data sections (catch-all for any other top-level keys)
        const displayedKeys = new Set([
            'vehicleInformation', 'smmtDetails', 'general', 'performance',
            'motData', 'mot', 'tax', 'taxInformation', 'insuranceGroup',
            'insurance', 'valuation', 'price', 'value', 'mileageHistory',
            'mileagehistory', 'history', 'chart', 'graph', 'chartData', 'graphData'
        ]);

        for (const [key, value] of Object.entries(data)) {
            if (!displayedKeys.has(key) && value !== null && value !== undefined) {
                // Skip if it's a filtered field
                if (shouldFilterField(key)) continue;

                const sectionTitle = cleanFieldName(key);
                sections.push({ title: sectionTitle, data: value, expanded: false });
            }
        }

        // Create sections
        if (sections.length === 0) {
            const noDataMsg = document.createElement('div');
            noDataMsg.textContent = 'No data available';
            noDataMsg.style.color = '#999';
            noDataMsg.style.fontStyle = 'italic';
            noDataMsg.style.padding = '20px';
            noDataMsg.style.textAlign = 'center';
            body.appendChild(noDataMsg);
        } else {
            sections.forEach(section => {
                const sectionElement = createSection(section.title, section.data, section.expanded);
                body.appendChild(sectionElement);
            });
        }

        wrap.appendChild(header);
        wrap.appendChild(body);
        document.body.appendChild(wrap);
        makeDraggable(wrap, header);
    }

    async function fetchCarbabaData(ukPlateRaw) {
        const plate = String(ukPlateRaw || '').trim().toUpperCase().replace(/\s+/g, '');
        if (!plate) throw new Error('Empty plate');

        // Get current IP address
        const ipAddress = await getCurrentIPAddress();

        const url = 'https://carbaba.co.uk/api/vehicle/mot/data';
        const headers = {
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0',
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'en',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            'Content-Type': 'application/json',
            'language': 'en',
            'ip-address': ipAddress,
            'platform': 'Linux',
            'browser': 'Firefox',
            'isMobile': 'no',
            'Origin': 'https://carbaba.co.uk',
            'Connection': 'keep-alive',
            'Referer': 'https://carbaba.co.uk/',
            'Cookie': 'cf_clearance=placeholder; cookieLimitSecondPage=50; isHit=true; cookieConsent=accepted; isHitSecond=true',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'DNT': '1',
            'Sec-GPC': '1',
            'Priority': 'u=0',
            'Pragma': 'no-cache',
            'Cache-Control': 'no-cache',
            'TE': 'trailers'
        };

        const payload = {
            vrm: plate,
            mileage: 8000
        };

        try {
            const response = await httpPost(url, headers, payload);

            if (!response || !response.data) {
                throw new Error('Invalid response');
            }

            // Return the full response data structure for comprehensive display
            return {
                fullData: response.data,
                status: response.status,
                code: response.code,
                message: response.message
            };
        } catch (error) {
            throw error;
        }
    }

    // --- UI Button Factory (supports Large/Small modes) ---
    function makeBtn(label, disabled, onclick, iconUrl) {
        const btn = document.createElement('button');
        btn.disabled = !!disabled;
        const compact = isCompactMode();
        if (compact) {
            btn.title = label;
            btn.style.marginBottom = '0';
            btn.style.width = '35px';
            btn.style.height = '35px';
            btn.style.backgroundColor = disabled ? '#95a5a6' : '#3498db';
            btn.style.color = '#ffffff';
            btn.style.border = 'none';
            btn.style.cursor = disabled ? 'default' : 'pointer';
            btn.style.borderRadius = '50%';
            btn.style.display = 'flex';
            btn.style.alignItems = 'center';
            btn.style.justifyContent = 'center';
            btn.style.padding = '0';
            btn.style.gap = '0';
            btn.style.position = 'relative';

            if (iconUrl) {
                const img = document.createElement('img');
                const cfg = (iconUrl && iconUrl.candidates) ? iconUrl : { key: '', candidates: (Array.isArray(iconUrl) ? iconUrl.slice() : [iconUrl]) };
                const candidates = cfg.candidates.slice();
                const tryNext = () => {
                    if (!candidates.length) { img.remove(); return; }
                    img.src = candidates.shift();
                };
                img.alt = '';
                img.style.width = '29px';
                img.style.height = '29px';
                img.style.display = 'block';
                img.style.objectFit = 'contain';
                img.style.transition = 'opacity 120ms ease-in-out';
                img.onerror = tryNext;
                img.onload = () => {
                    if (cfg.key) {
                        faviconCache[cfg.key] = img.src;
                    }
                };
                btn.appendChild(img);
                tryNext();

                // Add a hidden label that shows on hover
                const labelSpan = document.createElement('span');
                labelSpan.innerText = label;
                labelSpan.style.position = 'absolute';
                labelSpan.style.top = '4px';
                labelSpan.style.bottom = '4px';
                labelSpan.style.left = '4px';
                labelSpan.style.right = '4px';
                labelSpan.style.display = 'flex';
                labelSpan.style.alignItems = 'center';
                labelSpan.style.justifyContent = 'center';
                labelSpan.style.textAlign = 'center';
                labelSpan.style.fontSize = '12px';
                labelSpan.style.lineHeight = '1.05';
                labelSpan.style.whiteSpace = 'normal';
                labelSpan.style.overflow = 'hidden';
                labelSpan.style.wordBreak = 'break-word';
                labelSpan.style.overflowWrap = 'anywhere';
                labelSpan.style.opacity = '0';
                labelSpan.style.pointerEvents = 'none';
                labelSpan.style.transition = 'opacity 120ms ease-in-out';
                btn.appendChild(labelSpan);

                // Hover behavior: expand, hide icon, show text
                btn.addEventListener('mouseenter', () => {
                    img.style.opacity = '0';
                    labelSpan.style.opacity = '1';

                    // Auto-fit text size to keep it inside 35x35 (with 4px insets)
                    let size = 12; // start larger for readability
                    const minSize = 7;
                    labelSpan.style.fontSize = size + 'px';
                    // Iterate down until it fits or we hit min
                    // Guard against excessive loops
                    for (let i = 0; i < 20; i++) {
                        const fits = labelSpan.scrollWidth <= labelSpan.clientWidth && labelSpan.scrollHeight <= labelSpan.clientHeight;
                        if (fits || size <= minSize) break;
                        size -= 0.5;
                        labelSpan.style.fontSize = size + 'px';
                    }
                });
                btn.addEventListener('mouseleave', () => {
                    img.style.opacity = '1';
                    labelSpan.style.opacity = '0';
                });
            }
        } else {
            btn.style.marginBottom = '0';
            btn.style.width = '100%';
            btn.style.backgroundColor = disabled ? '#95a5a6' : '#3498db';
            btn.style.color = '#ffffff';
            btn.style.border = 'none';
            btn.style.cursor = disabled ? 'default' : 'pointer';
            btn.style.height = '23px';
            btn.style.borderRadius = '4px';
            btn.style.display = 'flex';
            btn.style.alignItems = 'center';
            btn.style.justifyContent = 'center';
            btn.style.gap = '6px';
            btn.style.padding = '0 8px';

            if (iconUrl) {
                const img = document.createElement('img');
                const cfg = (iconUrl && iconUrl.candidates) ? iconUrl : { key: '', candidates: (Array.isArray(iconUrl) ? iconUrl.slice() : [iconUrl]) };
                const candidates = cfg.candidates.slice();
                const tryNext = () => {
                    if (!candidates.length) { img.remove(); return; }
                    img.src = candidates.shift();
                };
                img.onerror = tryNext;
                img.onload = () => {
                    if (cfg.key) {
                        faviconCache[cfg.key] = img.src;
                    }
                };
                img.alt = '';
                img.style.maxHeight = (23 - 2) + 'px';
                img.style.display = 'inline-block';
                img.style.verticalAlign = 'middle';
                btn.appendChild(img);
                tryNext();
            }

            const span = document.createElement('span');
            span.innerText = label;
            btn.appendChild(span);
        }

        if (onclick && !disabled) btn.onclick = onclick;
        return btn;
    }

    // --- Buttons (Lookup / Google Images / Autogespot) ---
    function createOrUpdateLookupButtons() {
        const host = document.getElementById('zoomimgid');
        if (!host) return;

        // Always ensure a grid container exists (even if there are no site lookups)
        let container = document.getElementById('lookupButtonsContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'lookupButtonsContainer';
            container.style.display = 'grid';
            container.style.gap = '6px';
            host.parentNode.insertBefore(container, host);
        } else {
            container.innerHTML = '';
        }

        // Apply grid layout based on size mode
        if (isCompactMode()) {
            container.style.gridTemplateColumns = 'repeat(auto-fill, 35px)';
            container.style.justifyContent = 'center';
            container.style.justifyItems = 'center';
        } else {
            container.style.gridTemplateColumns = '1fr';
            container.style.justifyItems = '';
        }

        const fieldsOk = areFieldsFilled();
        const code = getCurrentCountryCode();
        let sites = lookupSites[code] || [];
        // Filter hidden sites for current country
        if (code) {
            const enabledSites = [];
            for (const s of sites) {
                if (isSiteEnabledForCountry(code, s.name)) enabledSites.push(s);
            }
            sites = enabledSites;
        }

        // Settings button (replaces inline radios)
        let existingControls = document.getElementById('lookupSettingsControls');
        if (existingControls) existingControls.remove();
        const controls = document.createElement('div');
        controls.id = 'lookupSettingsControls';
        controls.style.display = 'flex';
        controls.style.alignItems = 'center';
        controls.style.justifyContent = 'center';
        controls.style.margin = '4px 0 6px 0';
        const settingsBtn = document.createElement('button');
        settingsBtn.textContent = 'Settings';
        settingsBtn.style.width = "100%";
        settingsBtn.style.height = "100%";
        settingsBtn.style.flex = "1";
        settingsBtn.style.border = 'none';
        settingsBtn.style.borderRadius = '4px';
        settingsBtn.style.background = '#6c757d';
        settingsBtn.style.color = '#fff';
        settingsBtn.style.cursor = 'pointer';
        settingsBtn.onclick = openSettingsPanel;
        controls.appendChild(settingsBtn);
        container.parentNode.insertBefore(controls, container);

        // Countries with special flows
        const specialPL = isPage('pl');
        const specialLT = isPage('lt');
        const specialUS = isPage('us');
        const specialIT = isPage('it');

        if (specialPL) {
            const favicon = isCompactMode() ? getFaviconConfigForUrl('https://moj.gov.pl/') : null;
            const btn = makeBtn('Lookup', !fieldsOk, () => {
                const plateNumber = buildPlateForCurrentPage();
                const targetUrl =
                      `https://moj.gov.pl/nforms/engine/ng/index?nfWidReset=true&xFormsAppName=NormaEuro&xFormsOrigin=EXTERNAL&plateNumber=${encodeURIComponent(plateNumber)}#/search`;
                window.open(targetUrl, '_blank');
            }, isCompactMode() ? favicon : null);
            container.appendChild(btn);
            // keep going; Google/Autogespot will also append into this same container
        } else if (specialLT) {
            const favicon = isCompactMode() ? getFaviconConfigForUrl('https://www.cab.lt/') : null;
            const btn = makeBtn('Lookup', !fieldsOk, () => {
                const plateNumber = buildPlateForCurrentPage();
                let form = document.createElement('form');
                form.action = 'https://www.cab.lt/draustumo-patikra/';
                form.method = 'POST';
                form.target = '_blank';
                let inputCountry = document.createElement('input');
                inputCountry.type = 'hidden'; inputCountry.name = 'country'; inputCountry.value = 'LT';
                let inputPlate = document.createElement('input');
                inputPlate.type = 'hidden'; inputPlate.name = 'plate'; inputPlate.value = plateNumber;
                form.appendChild(inputCountry); form.appendChild(inputPlate);
                document.body.appendChild(form); form.submit(); document.body.removeChild(form);
            }, isCompactMode() ? favicon : null);
            container.appendChild(btn);
        } else if (specialUS) {
            const favClearVin = isCompactMode() ? getFaviconConfigForUrl('https://www.clearvin.com/') : null;
            const btn = makeBtn('ClearVin', !fieldsOk, () => {
                const plateRaw = document.getElementById('nomer').value || '';
                const plate = plateRaw.replace(/\s+/g, '');
                const state = getUSStateCode();
                if (!plate || !state) return;
                const targetUrl = `https://www.clearvin.com/en/payment/prepare/${encodeURIComponent(plate)}:${state}/`;
                window.open(targetUrl, '_blank');
            }, isCompactMode() ? favClearVin : null);
            container.appendChild(btn);
            const favFaxVin = isCompactMode() ? getFaviconConfigForUrl('https://www.faxvin.com/') : null;
            const btn2 = makeBtn('FaxVin', !fieldsOk, () => {
                const plateRaw = document.getElementById('nomer').value || '';
                const plate = plateRaw.replace(/\s+/g, '');
                const state = getUSStateCode();
                if (!plate || !state) return;
                const targetUrl = `https://www.faxvin.com/license-plate-lookup/result?plate=${encodeURIComponent(plate)}&state=${state}/`;
                window.open(targetUrl, '_blank');
            }, isCompactMode() ? favFaxVin : null);
            container.appendChild(btn2);
            const favTagNap = isCompactMode() ? getFaviconConfigForUrl('https://tagnap.com/') : null;
            const btn3 = makeBtn('TagNap', !fieldsOk, () => {
                const plateRaw = document.getElementById('nomer').value || '';
                const plate = plateRaw.replace(/\s+/g, '');
                const state = getUSStateCode();
                if (!plate || !state) return;
                const targetUrl = `https://tagnap.com/plates/${encodeURIComponent(plate)}-${state}/`;
                window.open(targetUrl, '_blank');
            }, isCompactMode() ? favTagNap : null);
            container.appendChild(btn3);
            const favInfoTracer = isCompactMode() ? getFaviconConfigForUrl('https://infotracer.com/') : null;
            const btn4 = makeBtn('InfoTracer', !fieldsOk, () => {
                const plateRaw = document.getElementById('nomer').value || '';
                const plate = plateRaw.replace(/\s+/g, '');
                const state = getUSStateCode();
                if (!plate || !state) return;
                const targetUrl = `https://infotracer.com/loading/?type=plate-lookup&s=rw&page=results&mercSubId=plate&state=${state}&tid=tagnap&plate=${encodeURIComponent(plate)}`;
                window.open(targetUrl, '_blank');
            }, isCompactMode() ? favInfoTracer : null);
            container.appendChild(btn4);
        } else if (specialIT) {
            // Trodo (API) button
            const trodoIcon = isCompactMode() ? getFaviconConfigForUrl('https://www.trodo.it/') : null;
            const trodoApiBtn = makeBtn('Trodo (API)', !fieldsOk, async () => {
                const plate = buildPlateForCurrentPage();
                if (!plate) return;
                trodoApiBtn.disabled = true;
                trodoApiBtn.style.opacity = '0.7';
                try {
                    const info = await fetchTrodoData(plate);
                    showTrodoWindow(info);
                } catch (e) {
                    if (e.message === 'CAPTCHA_REQUIRED') {
                        // Show captcha error message
                        const existing = document.getElementById('trodoCaptchaError');
                        if (existing) existing.remove();

                        const errorDiv = document.createElement('div');
                        errorDiv.id = 'trodoCaptchaError';
                        errorDiv.style.position = 'fixed';
                        errorDiv.style.top = '50%';
                        errorDiv.style.left = '50%';
                        errorDiv.style.transform = 'translate(-50%, -50%)';
                        errorDiv.style.zIndex = '99999';
                        errorDiv.style.background = '#fff';
                        errorDiv.style.border = '2px solid #dc3545';
                        errorDiv.style.borderRadius = '8px';
                        errorDiv.style.padding = '20px';
                        errorDiv.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
                        errorDiv.style.fontFamily = 'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif';
                        errorDiv.style.maxWidth = '400px';
                        errorDiv.style.textAlign = 'center';

                        errorDiv.innerHTML = `
                            <div style="color: #dc3545; font-size: 18px; font-weight: 600; margin-bottom: 10px;">⚠️ Captcha Required</div>
                            <div style="margin-bottom: 15px;">Cloudflare blocked the request. Please use the "Trodo (link)" button instead.</div>
                            <button onclick="this.parentElement.remove()" style="background: #dc3545; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">OK</button>
                        `;

                        document.body.appendChild(errorDiv);

                        // Auto-remove after 5 seconds
                        setTimeout(() => {
                            if (errorDiv.parentNode) {
                                errorDiv.remove();
                            }
                        }, 5000);
                    } else {
                        showTrodoWindow({
                            manufacturer: 'unknown',
                            model: 'unknown',
                            variant: 'unknown',
                            year: 'unknown',
                            fuel: 'unknown',
                            engine: 'unknown',
                            power: 'unknown',
                            vin: 'unknown',
                        });
                    }
                } finally {
                    trodoApiBtn.disabled = false;
                    trodoApiBtn.style.opacity = '1';
                }
            }, trodoIcon);
            container.appendChild(trodoApiBtn);

            // Trodo (link) button
            const trodoLinkBtn = makeBtn('Trodo (link)', !fieldsOk, () => {
                const plate = buildPlateForCurrentPage();
                if (!plate) return;
                const targetUrl = `https://www.trodo.it/rest/V1/partfinder/search/IT/${encodeURIComponent(plate)}/1`;
                window.open(targetUrl, '_blank');
            }, trodoIcon);
            container.appendChild(trodoLinkBtn);
        }

        // Standard flow: add site buttons if present
        if (sites.length === 1) {
            const only = sites[0];
            const favicon = isCompactMode() ? getFaviconConfigForUrl(only.base) : null;
            const btn = makeBtn('Lookup', !fieldsOk, () => {
                const raw = buildPlateForCurrentPage();
                if (!raw) return;
                const finalPlate = (isPage('fr') && only.needsHyphen) ? frWithHyphens(raw) : raw;
                window.open(only.base + finalPlate, '_blank');
            }, favicon);
            container.appendChild(btn);
        } else if (sites.length > 1) {
            for (const site of sites) {
                const favicon = isCompactMode() ? getFaviconConfigForUrl(site.base) : null;
                const btn = makeBtn(site.name, !fieldsOk, () => {
                    const raw = buildPlateForCurrentPage();
                    if (!raw) return;
                    const finalPlate = (isPage('fr') && site.needsHyphen) ? frWithHyphens(raw) : raw;
                    window.open(site.base + finalPlate, '_blank');
                }, favicon);
                container.appendChild(btn);
            }
        }

        // --- NL: RDW API lookup button that opens floating window ---
        if (isPage('nl')) {
            const rdwIcon = isCompactMode() ? getFaviconConfigForUrl('https://www.rdw.nl/') : null;
            const rdwBtn = makeBtn('RDW (API)', !fieldsOk, async () => {
                const plate = buildPlateForCurrentPage();
                if (!plate) return;
                rdwBtn.disabled = true;
                rdwBtn.style.opacity = '0.7';
                try {
                    const info = await fetchRDWData(plate);
                    showRDWWindow(info);
                } catch (e) {
                    showRDWWindow({
                        make: 'unknown',
                        model: 'unknown',
                        variant: 'unknown',
                        yFirst: 'unknown',
                        yNL: 'unknown',
                        fuel: 'unknown',
                        doors: 'unknown',
                        color: 'unknown',
                    });
                } finally {
                    rdwBtn.disabled = false;
                    rdwBtn.style.opacity = '1';
                }
            }, rdwIcon);
            container.appendChild(rdwBtn);
        }

        // --- FI: Motonet API lookup button that opens floating window ---
        if (isPage('fi')) {
            const fiIcon = isCompactMode() ? getFaviconConfigForUrl('https://www.motonet.fi/') : null;
            const fiBtn = makeBtn('Motonet (Direct API)', !fieldsOk, async () => {
                const plate = buildPlateForCurrentPage(); // returns "AAA-123"
                if (!plate) return;
                fiBtn.disabled = true;
                fiBtn.style.opacity = '0.7';
                try {
                    const info = await fetchMotonetData(plate);
                    showFIWindow(info && Object.keys(info).length ? info : {});
                } catch (e) {
                    showFIWindow({});
                } finally {
                    fiBtn.disabled = false;
                    fiBtn.style.opacity = '1';
                }
            }, fiIcon);
            container.appendChild(fiBtn);
        }

        // --- UK: Carbaba API lookup button that opens floating window ---
        if (isPage('uk')) {
            const carbabaIcon = isCompactMode() ? getFaviconConfigForUrl('https://carbaba.co.uk/') : null;
            const carbabaBtn = makeBtn('carbaba (API)', !fieldsOk, async () => {
                const plate = buildPlateForCurrentPage();
                if (!plate) return;
                carbabaBtn.disabled = true;
                carbabaBtn.style.opacity = '0.7';
                try {
                    const info = await fetchCarbabaData(plate);
                    showCarbabaWindow(info);
                } catch (e) {
                    showCarbabaWindow({
                        status: false,
                        code: 0,
                        message: `Error: ${e.message || 'Failed to fetch data'}`,
                        fullData: {}
                    });
                } finally {
                    carbabaBtn.disabled = false;
                    carbabaBtn.style.opacity = '1';
                }
            }, carbabaIcon);
            container.appendChild(carbabaBtn);
        }
    }

function createOrUpdateGoogleImagesButton() {
    const host = document.getElementById('zoomimgid');
    if (!host) return;

    // Respect global disable
    if (!isGoogleImagesGloballyEnabled()) {
        const existing = document.getElementById('googleImagesButton');
        if (existing) existing.remove();
        return;
    }

    let googleBtn = document.getElementById('googleImagesButton');
    if (!googleBtn) {
        googleBtn = makeBtn('Google Images', true, null, 'https://i.imgur.com/5x00UaD.png');
        googleBtn.id = 'googleImagesButton';
        const container = document.getElementById('lookupButtonsContainer');
        if (container) {
            container.appendChild(googleBtn);
        } else {
            host.parentNode.insertBefore(googleBtn, host); // fallback (shouldn’t happen now)
        }
    }

    const fieldsOk = areFieldsFilled();
    googleBtn.disabled = !fieldsOk;
    googleBtn.onclick = !fieldsOk ? null : function () {
        const plateNumber = buildPlateForSearchDisplay();
        if (!plateNumber) return;
        window.open('https://www.google.com/search?tbm=isch&q="' + plateNumber + '"', '_blank');
    };
}

function createOrUpdateAutogespotButton() {
    const host = document.getElementById('zoomimgid');
    if (!host) return;

    // Respect global disable
    if (!isAutogespotGloballyEnabled()) {
        const existing = document.getElementById('autogespotButton');
        if (existing) existing.remove();
        return;
    }

    let agBtn = document.getElementById('autogespotButton');
    if (!agBtn) {
        agBtn = makeBtn('Autogespot', true, null, 'https://i.imgur.com/X8HxriW.png');
        agBtn.id = 'autogespotButton';
        const container = document.getElementById('lookupButtonsContainer');
        if (container) {
            container.appendChild(agBtn);
        } else {
            host.parentNode.insertBefore(agBtn, host); // fallback (shouldn’t happen now)
        }
    }

    const fieldsOk = areFieldsFilled();
    agBtn.disabled = !fieldsOk;
    agBtn.style.marginBottom = '6px';
    agBtn.onclick = !fieldsOk ? null : function () {
        let plateCompact = buildPlateForCurrentPage();
        if (!plateCompact) {
            const display = buildPlateForSearchDisplay();
            plateCompact = (display || '').replace(/\s+/g, '');
        }
        if (!plateCompact) return;
        const target = `https://www.autogespot.com/spots?licenseplate=${encodeURIComponent(plateCompact)}`;
        window.open(target, '_blank');
    };
}

// --- Settings Panel UI ---
function openSettingsPanel() {
    const existing = document.getElementById('lookupSettingsPanel');
    if (existing) existing.remove();

    const code = getCurrentCountryCode();
    const wrapper = document.createElement('div');
    wrapper.id = 'lookupSettingsPanel';
    wrapper.style.position = 'fixed';
    wrapper.style.top = '80px';
    wrapper.style.right = '40px';
    wrapper.style.zIndex = '99999';
    wrapper.style.background = '#fff';
    wrapper.style.border = '1px solid #ccc';
    wrapper.style.borderRadius = '6px';
    wrapper.style.boxShadow = '0 6px 18px rgba(0,0,0,0.18)';
    wrapper.style.minWidth = '280px';
    wrapper.style.maxWidth = '380px';
    wrapper.style.fontFamily = 'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif';

    const header = document.createElement('div');
    header.style.padding = '10px 12px';
    header.style.borderBottom = '1px solid #eee';
    header.style.display = 'flex';
    header.style.alignItems = 'center';
    header.style.justifyContent = 'space-between';
    header.style.background = '#f8f9fa';

    const title = document.createElement('div');
    title.textContent = 'Lookup Toolbox Settings';
    title.style.fontWeight = '600';

    const close = document.createElement('div');
    close.textContent = '×';
    close.title = 'Close';
    close.style.cursor = 'pointer';
    close.style.fontSize = '18px';
    close.style.lineHeight = '18px';
    close.style.marginLeft = '10px';
    close.onclick = () => wrapper.remove();

    header.appendChild(title);
    header.appendChild(close);

    const body = document.createElement('div');
    body.style.padding = '10px 12px';
    body.style.fontSize = '14px';
    body.style.maxHeight = '60vh';
    body.style.overflow = 'auto';

    // View size section
    const viewSection = document.createElement('div');
    const currentMode = code ? getSizeModeForCountry(code) : getDefaultSizeMode();
    const viewTitle = document.createElement('div');
    viewTitle.textContent = 'View size';
    viewTitle.style.fontWeight = '600';
    viewTitle.style.marginBottom = '6px';
    const radiosWrap = document.createElement('div');
    radiosWrap.style.display = 'flex';
    radiosWrap.style.gap = '12px';
    const makeRadio = (label, value) => {
        const lab = document.createElement('label');
        lab.style.display = 'inline-flex'; lab.style.alignItems = 'center'; lab.style.gap = '6px';
        const input = document.createElement('input');
        input.type = 'radio'; input.name = 'ltb-view-size'; input.value = value;
        input.checked = currentMode === value;
        const span = document.createElement('span'); span.textContent = label;
        lab.appendChild(input); lab.appendChild(span);
        return lab;
    };
    radiosWrap.appendChild(makeRadio('Large', 'Large'));
    radiosWrap.appendChild(makeRadio('Compact', 'Compact'));

    const applyWrap = document.createElement('div');
    applyWrap.style.display = 'flex';
    applyWrap.style.gap = '10px';
    applyWrap.style.marginTop = '8px';
    const btnApplyCountry = document.createElement('button');
    btnApplyCountry.textContent = `Apply to ${code || 'XX'}`;
    btnApplyCountry.style.padding = '4px 8px';
    btnApplyCountry.style.border = 'none';
    btnApplyCountry.style.borderRadius = '4px';
    btnApplyCountry.style.background = '#3498db';
    btnApplyCountry.style.color = '#fff';
    btnApplyCountry.style.cursor = 'pointer';
    btnApplyCountry.onclick = () => {
        const val = (body.querySelector('input[name="ltb-view-size"]:checked') || {}).value || 'Large';
        if (code) setSizeModeForCountry(code, val);
        render();
    };
    const btnApplyAll = document.createElement('button');
    btnApplyAll.style.padding = '4px 8px';
    btnApplyAll.style.border = 'none';
    btnApplyAll.style.borderRadius = '4px';
    btnApplyAll.style.background = '#dc3545';
    btnApplyAll.style.color = '#fff';
    btnApplyAll.style.cursor = 'pointer';
    btnApplyAll.style.display = 'flex';
    btnApplyAll.style.flexDirection = 'column';
    btnApplyAll.style.alignItems = 'center';

    // main label
    const label = document.createElement('span');
    label.textContent = 'Apply to all countries';

    // smaller warning
    const warning = document.createElement('span');
    warning.textContent = '(will overwrite all custom settings!)';
    warning.style.fontSize = '0.8em';
    warning.style.opacity = '0.8';

    btnApplyAll.appendChild(label);
    btnApplyAll.appendChild(warning);

    btnApplyAll.onclick = () => {
        const val = (body.querySelector('input[name="ltb-view-size"]:checked') || {}).value || 'Large';
        setDefaultSizeMode(val);
        clearAllCountrySizeOverrides();
        render();
    };

    applyWrap.appendChild(btnApplyCountry);
    applyWrap.appendChild(btnApplyAll);


    viewSection.appendChild(viewTitle);
    viewSection.appendChild(radiosWrap);
    viewSection.appendChild(applyWrap);

    // Lookup sites section (per current country)
    const sitesSection = document.createElement('div');
    sitesSection.style.marginTop = '14px';
    const sitesTitle = document.createElement('div');
    sitesTitle.textContent = 'Lookup sites (uncheck to hide)';
    sitesTitle.style.fontWeight = '600';
    sitesTitle.style.marginBottom = '6px';
    const sitesWrap = document.createElement('div');
    sitesWrap.style.display = 'grid';
    sitesWrap.style.gridTemplateColumns = '1fr';
    sitesWrap.style.gap = '6px';
    const allSites = (lookupSites && code && lookupSites[code]) ? lookupSites[code] : [];
    const hiddenSet = code ? getHiddenSitesForCountry(code) : new Set();
    for (const site of allSites) {
        const lab = document.createElement('label');
        lab.style.display = 'flex'; lab.style.alignItems = 'center'; lab.style.gap = '8px';
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.checked = !hiddenSet.has(site.name);
        cb.addEventListener('change', () => {
            const newHidden = getHiddenSitesForCountry(code);
            if (cb.checked) {
                newHidden.delete(site.name);
            } else {
                newHidden.add(site.name);
            }
            setHiddenSitesForCountry(code, Array.from(newHidden));
            render();
        });
        const span = document.createElement('span'); span.textContent = site.name;
        lab.appendChild(cb); lab.appendChild(span);
        sitesWrap.appendChild(lab);
    }
    sitesSection.appendChild(sitesTitle);
    sitesSection.appendChild(sitesWrap);

    // Global toggles section
    const globalSection = document.createElement('div');
    globalSection.style.marginTop = '14px';
    const globalTitle = document.createElement('div');
    globalTitle.textContent = 'Other options';
    globalTitle.style.fontWeight = '600';
    globalTitle.style.marginBottom = '6px';
    const globalWrap = document.createElement('div');
    globalWrap.style.display = 'grid';
    globalWrap.style.gridTemplateColumns = '1fr';
    globalWrap.style.gap = '6px';

    const mkToggle = (label, isEnabled, onChange) => {
        const lab = document.createElement('label');
        lab.style.display = 'flex';
        lab.style.alignItems = 'center';
        lab.style.gap = '8px';
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.checked = isEnabled();
        cb.addEventListener('change', () => {
            onChange(cb.checked);
            render();
        });
        const span = document.createElement('span');
        span.textContent = label + ' (global)';
        lab.appendChild(cb); lab.appendChild(span);
        return lab;
    };

    globalWrap.appendChild(mkToggle('Show Google Images', isGoogleImagesGloballyEnabled, (checked) => setGoogleImagesGloballyEnabled(checked)));
    globalWrap.appendChild(mkToggle('Show Autogespot', isAutogespotGloballyEnabled, (checked) => setAutogespotGloballyEnabled(checked)));

    globalSection.appendChild(globalTitle);
    globalSection.appendChild(globalWrap);

    body.appendChild(viewSection);
    body.appendChild(sitesSection);
    body.appendChild(globalSection);

    wrapper.appendChild(header);
    wrapper.appendChild(body);
    document.body.appendChild(wrapper);
    try { makeDraggable(wrapper, header); } catch {}
}

// --- Initial render + live updates ---
function render() {
    createOrUpdateLookupButtons();
    createOrUpdateGoogleImagesButton();
    createOrUpdateAutogespotButton();
}

render();
setInterval(render, 1000);
})();
