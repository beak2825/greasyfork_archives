// ==UserScript==
// @name         Harmony: Enhancements
// @namespace    https://musicbrainz.org/user/chaban
// @version      1.24.0
// @tag          ai-created
// @description  Adds some convenience features, various UI and behavior settings, as well as an improved language detection to Harmony.
// @author       chaban
// @license      MIT
// @match        https://harmony.pulsewidth.org.uk/*
// @icon         https://harmony.pulsewidth.org.uk/harmony-logo.svg
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/544751/Harmony%3A%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/544751/Harmony%3A%20Enhancements.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const SCRIPT_NAME = GM_info.script.name;
    const TOOLTIP_DISPLAY_DURATION = 2000;
    const DATA_ATTRIBUTE_APPLIED = 'data-he-applied';
    const NO_LABEL = {
        name: '[no label]',
        mbid: '157afde4-4bf5-4039-8ad2-5a15acc85176',
    };
    const MBID_REGEX = /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i;

    // --- CONFIGURATION ---
    // The top-level keys of this object MUST match the function names in the `enhancements` object.
    const SETTINGS_CONFIG = {
        // Seeder Behavior
        updateProperties: {
            key: 'enhancements.seeder.updateProperties',
            label: 'Include GTIN and packaging when updating an existing release',
            description: 'When using the "Update external links in MusicBrainz" button, also include the GTIN (barcode) and set packaging to "None".',
            defaultValue: false,
            section: 'Seeder Behavior',
            type: 'checkbox',
            runAt: 'submit',
            formName: 'release-update-seeder',
        },
        cleanArtistNames: {
            key: 'enhancements.seeder.cleanArtistNames',
            label: 'Drop artist names from seed if MBID is present',
            description: 'Prevents sending the artist name to the MusicBrainz seeder if an MBID is available.',
            defaultValue: false,
            section: 'Seeder Behavior',
            type: 'checkbox',
            runAt: 'submit',
            formName: 'release-seeder',
        },
        // UI Settings
        hideDebugMessages: {
            key: 'enhancements.ui.hideDebugMessages',
            label: 'Hide debug messages on release pages',
            description: 'Hides the boxes containing debug information from Harmony, such as guessed languages and scripts.',
            defaultValue: false,
            section: 'UI Settings',
            type: 'checkbox',
            runAt: 'load',
            paths: [/^\/release(?!\/actions)/],
        },
        toggleReleaseInfo: {
            key: 'enhancements.ui.hideReleaseInfo',
            label: 'Hide Availability, Sources, and External Links sections',
            description: 'Hides the verbose and redundant release info sections.',
            defaultValue: false,
            section: 'UI Settings',
            type: 'checkbox',
            runAt: 'load',
            paths: [/^\/release(?!\/actions)/],
        },

        // Convenience Features
        addSearchLinks: {
            key: 'enhancements.ui.addSearchLinks',
            label: 'Add external search links (Qobuz, YouTube Music, etc.)',
            description: 'Adds quick search links for the release on various external sites.',
            defaultValue: false,
            section: 'Convenience Features',
            type: 'checkbox',
            runAt: 'load',
            paths: [/^\/release(?!\/actions)/],
        },
        makePermalinkCopyable: {
            key: 'enhancements.ui.copyPermalink',
            label: 'Enable copying permalink on click',
            description: 'Makes the "Permanent link to this version" clickable to copy the URL to the clipboard.',
            defaultValue: false,
            section: 'Convenience Features',
            type: 'checkbox',
            runAt: 'load',
            paths: [/^\/release(?!\/actions)/],
        },
        addClipboardButton: {
            key: 'enhancements.ui.clipboardRelookup',
            label: `Add 'Re-Lookup from Clipboard' button`,
            description: 'Adds a button to the "Release Lookup" page to redo the lookup using a supported release URL (MusicBrainz, Bandcamp, etc.) found in the clipboard.',
            defaultValue: true,
            section: 'Convenience Features',
            type: 'checkbox',
            runAt: 'load',
            paths: [/^\/$/, /^\/release(?!\/actions)/],
        },

        // Release Data
        improveReleaseTypeDetection: {
            key: 'enhancements.releaseType.enabled',
            label: 'Improve release type detection',
            description: 'Uses the technical terms list to determine if a release with multiple tracks is actually a single with multiple versions.',
            defaultValue: false,
            section: 'Release Data',
            type: 'checkbox',
            runAt: 'load',
            paths: [/^\/release(?!\/actions)/],
        },
        normalizeETI: {
            key: 'enhancements.eti.normalize',
            label: 'Normalize hyphenated extra title information (ETI)',
            description: 'Converts track titles like "Title - Remix" to "Title (Remix)" to match MusicBrainz style guidelines.',
            defaultValue: false,
            section: 'Release Data',
            type: 'checkbox',
            runAt: 'load',
            paths: [/^\/release(?!\/actions)/],
        },
        syncTrackArtist: {
            key: 'enhancements.artists.syncTrackArtist',
            label: 'Sync track artist to release artist for singles',
            description: 'For single-track releases, if the track artist credit is more detailed (i.e., has more artists) than the release artist credit, the release artist will be updated to match.',
            defaultValue: false,
            section: 'Release Data',
            type: 'checkbox',
            runAt: 'load',
            paths: [/^\/release(?!\/actions)/],
        },
        mapLabelMbids: {
            key: 'enhancements.label.mapMbids',
            label: 'Map label names to MBIDs',
            description: 'Automatically assigns a Label MBID based on a list of mappings if Harmony couldn\'t find one. Uses case-sensitive matching.<br>Format: <code>Exact Label Name=Label MBID</code> or <code>Exact Label Name=Label URL</code> (one per line).',
            defaultValue: [],
            section: 'Release Data',
            type: 'textarea',
            runAt: 'load',
            paths: [/^\/release(?!\/actions)/],
            tidy: (rawValue) => {
                const lines = Array.isArray(rawValue) ? rawValue : rawValue.split('\n');
                const cleanMap = getCleanMappings(lines, 'label');
                return Array.from(cleanMap.entries())
                    .sort((a, b) => a[0].localeCompare(b[0]))
                    .map(([name, url]) => `${name}=${url}`)
                    .join('\n');
            }
        },
        setNoLabel: {
            key: 'enhancements.label.setNoLabel',
            label: 'Set label to [no label] for self-releases',
            description: 'If a release appears to be self-released (label name is the same as the artist name), automatically set the label to the special purpose label "[no label]".',
            defaultValue: false,
            section: 'Release Data',
            type: 'checkbox',
            runAt: 'load',
            paths: [/^\/release(?!\/actions)/],
        },
        detectRemixers: {
            key: 'enhancements.releaseData.detectRemixers',
            label: 'Detect and remove remixers from track artists',
            description: 'If an artist is mentioned in the track title\'s version string (e.g. "Title (Artist X Remix)"), remove them from the track artist list.',
            defaultValue: false,
            section: 'Release Data',
            type: 'checkbox',
            runAt: 'load',
            paths: [/^\/release(?!\/actions)/],
        },
        removeBarcodeCatalogNumbers: {
            key: 'enhancements.releaseData.removeBarcodeCatalogNumbers',
            label: 'Remove catalog number if it matches the barcode',
            description: 'If a label\'s catalog number is identical to the release GTIN (barcode), remove it from the seed data and UI.',
            defaultValue: false,
            section: 'Release Data',
            type: 'checkbox',
            runAt: 'load',
            paths: [/^\/release(?!\/actions)/],
        },

        // Language Detection
        languageDetectionMode: {
            key: 'enhancements.lang.mode',
            label: 'Language Detection Mode',
            description: 'Choose how language and script should be handled.',
            defaultValue: 'browser',
            section: 'Language Detection',
            type: 'radio',
            options: [
                {
                    value: 'browser',
                    label: 'Enable browser-based detection',
                    description: 'Uses your browser\'s built-in API for a secondary language analysis, which can be more accurate than Harmony\'s default.<br>Only works in <a href="https://developer.mozilla.org/en-US/docs/Web/API/LanguageDetector#browser_compatibility" rel="noopener noreferrer">Chrome ≥138 and Opera ≥122</a> as of September 2025.'
                },
                {
                    value: 'harmony',
                    label: 'Use Harmony\'s detection only',
                    description: 'This script\'s language analysis will be completely disabled. The language and script will be whatever Harmony originally detected.'
                },
                {
                    value: 'none',
                    label: 'Disable all language detection',
                    description: 'Prevents both Harmony and this script from setting a language. The language and script fields will be removed entirely when seeding to MusicBrainz.'
                },
            ]
        },
        detectSingles: {
            key: 'enhancements.lang.detectSingles',
            label: 'Analyze single-track releases',
            description: 'By default, language detection is skipped for releases with only one track. Enable this to analyze them.',
            defaultValue: false,
            section: 'Language Detection',
            type: 'checkbox',
        },
        ignoreHarmony: {
            key: 'enhancements.lang.ignoreHarmony',
            label: `Force overwrite Harmony's guess`,
            description: 'Always replace Harmony\'s language guess result with the browser-detected result, regardless of confidence scores.',
            defaultValue: false,
            section: 'Language Detection',
            type: 'checkbox',
        },
        confidenceThreshold: {
            key: 'enhancements.lang.confidenceThreshold',
            label: 'Confidence Threshold',
            description: 'The minimum confidence level (in percent) required for the browser-detected language to be applied.',
            defaultValue: 50,
            section: 'Language Detection',
            type: 'range',
        },
        conflictThreshold: {
            key: 'enhancements.lang.conflictThreshold',
            label: 'Harmony Conflict Threshold',
            description: 'If Harmony\'s confidence is below this level, this script will overwrite its guess. Otherwise, it will not.',
            defaultValue: 90,
            section: 'Language Detection',
            type: 'range',
        },
        stopWords: {
            key: 'enhancements.lang.stopWords',
            label: 'Stop Words (one per line)',
            description: 'These common words will be ignored during language analysis to improve accuracy. Add or remove words as needed.',
            defaultValue: ['a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'bye', 'for', 'from', 'is', 'it', 'of', 'off', 'on', 'the', 'to', 'was', 'with'],
            section: 'Language Detection',
            type: 'textarea',
        },
        techTerms: {
            key: 'enhancements.lang.techTerms',
            label: 'Technical Terms (one per line, regex supported)',
            description: 'Terms that are not specific to any language (like "remix" or "live") will be removed from titles before analysis.',
            defaultValue: ['live', '(re)?mix(es)?', 'edit(ion)?', 'medley', 'version(s)?', 'instrumental', 'album', 'radio', 'single', 'vocal', 'dub', 'club', 'extended', 'original', 'acoustic', 'unplugged', 'mono', 'stereo', 'demo', '(re)?master(ed)?', 'f(ea)?t\\.?', 'spee?d up', 'slow(ed)?', 'chopped', 'screwed', '8d', 'fast'],
            section: 'Language Detection',
            type: 'textarea',
        },

        // "Headless" configs for mode-dependent modules so we can look up their paths
        runLanguageDetection: {
            paths: [/^\/release(?!\/actions)/],
        },
        updateUIAfterLanguageDisable: {
            paths: [/^\/release(?!\/actions)/],
        },
        unsetLanguageData: {
            key: 'enhancements.lang.mode',
            value: 'none',
            runAt: 'submit',
            formName: 'release-seeder',
        },

        // Internal, non-configurable features
        setupFormSubmitListener: {
            key: 'enhancements.internal.formListener',
            defaultValue: true,
            runAt: 'load',
            paths: [/^\/release(?!\/actions)/],
        },
        removeHardcodedBy: {
            key: 'enhancements.internal.removeHardcodedBy',
            defaultValue: true,
            runAt: 'load',
            paths: [/^\/release/],
        },
        debugMode: {
            key: 'enhancements.internal.debugMode',
            defaultValue: false,
        },
    };

    /**
    * A map of functions that generate the required form parameters from the release data object.
    * Each function takes the corresponding value from the release data and a setter function
    * to add key-value pairs to our desired state map.
    *
    * Simple fields can specify `paramName` directly, which maps 1:1.
    * Complex fields can provide a custom `generator` function.
    */
    const PARAMETER_GENERATORS = {
        'title': {
            cleanupPrefix: 'name',
            paramName: 'name',
        },
        'comment': {
            cleanupPrefix: 'comment',
            paramName: 'comment',
        },
        'annotation': {
            cleanupPrefix: 'annotation',
            paramName: 'annotation',
        },
        'gtin': {
            cleanupPrefix: 'barcode',
            paramName: 'barcode',
        },
        'status': {
            cleanupPrefix: 'status',
            paramName: 'status',
        },
        'packaging': {
            cleanupPrefix: 'packaging',
            paramName: 'packaging',
        },
        'script.code': {
            cleanupPrefix: 'script',
            paramName: 'script',
        },
        'types': {
            cleanupPrefix: 'type.',
            generator: (value, set) => {
                value?.forEach((type, index) => {
                    set(`type.${index}`, type);
                });
            },
        },
        'labels': {
            cleanupPrefix: 'labels.',
            generator: (value, set) => {
                const uniqueLabels = getUniqueLabels(value);

                uniqueLabels.forEach((label, index) => {
                    const prefix = `labels.${index}`;
                    set(`${prefix}.name`, label.name);
                    if (label.mbid) {
                        set(`${prefix}.mbid`, label.mbid);
                    }
                    if (label.catalogNumber) {
                        set(`${prefix}.catalog_number`, label.catalogNumber);
                    }
                });
            },
        },
        'artists': {
            cleanupPrefix: 'artist_credit.names.',
            generator: (value, set) => {
                value?.forEach((artist, index) => {
                    const prefix = `artist_credit.names.${index}`;
                    set(`${prefix}.name`, artist.name);
                    if (artist.mbid) {
                        set(`${prefix}.mbid`, artist.mbid);
                    } else {
                        set(`${prefix}.artist.name`, artist.name);
                    }
                    if (index < value.length - 1) {
                        const joinPhrase = (index === value.length - 2) ? ' & ' : ', ';
                        set(`${prefix}.join_phrase`, joinPhrase);
                    }
                });
            },
        },
        'language': {
            cleanupPrefix: 'language',
            generator: (value, set) => {
                if (value?.code) {
                    set('language', value.code);
                }
            },
        },
        'media': {
            cleanupPrefix: 'mediums.',
            generator: (value, set) => {
                value?.forEach((medium, mediumIndex) => {
                    const prefix = `mediums.${mediumIndex}`;
                    if (medium.format) {
                        set(`${prefix}.format`, medium.format);
                    }
                    if (medium.name) {
                        set(`${prefix}.name`, medium.name);
                    }
                    medium.tracklist?.forEach((track, trackIndex) => {
                        const trackPrefix = `${prefix}.track.${trackIndex}`;
                        set(`${trackPrefix}.name`, track.title);
                        set(`${trackPrefix}.number`, track.number);
                        set(`${trackPrefix}.length`, track.length);
                        if (track.recording?.mbid) {
                            set(`${trackPrefix}.recording`, track.recording.mbid);
                        }

                        track.artists?.forEach((artist, artistIndex) => {
                            const artistPrefix = `${trackPrefix}.artist_credit.names.${artistIndex}`;
                            set(`${artistPrefix}.name`, artist.name);
                            if (artist.mbid) {
                                set(`${artistPrefix}.mbid`, artist.mbid);
                            } else {
                                set(`${artistPrefix}.artist.name`, artist.name);
                            }
                            if (artistIndex < track.artists.length - 1) {
                                const joinPhrase = (artistIndex === track.artists.length - 2) ? ' & ' : ', ';
                                set(`${artistPrefix}.join_phrase`, joinPhrase);
                            }
                        });
                    });
                });
            },
        },
    };

    const ISO_639_1_TO_3_MAP = { 'aa': 'aar', 'ab': 'abk', 'ae': 'ave', 'af': 'afr', 'ak': 'aka', 'am': 'amh', 'an': 'arg', 'ar': 'ara', 'as': 'asm', 'av': 'ava', 'ay': 'aym', 'az': 'aze', 'ba': 'bak', 'be': 'bel', 'bg': 'bul', 'bi': 'bis', 'bm': 'bam', 'bn': 'ben', 'bo': 'bod', 'br': 'bre', 'bs': 'bos', 'ca': 'cat', 'ce': 'che', 'ch': 'cha', 'co': 'cos', 'cr': 'cre', 'cs': 'ces', 'cu': 'chu', 'cv': 'chv', 'cy': 'cym', 'da': 'dan', 'de': 'deu', 'dv': 'div', 'dz': 'dzo', 'ee': 'ewe', 'el': 'ell', 'en': 'eng', 'eo': 'epo', 'es': 'spa', 'et': 'est', 'eu': 'eus', 'fa': 'fas', 'ff': 'ful', 'fi': 'fin', 'fj': 'fij', 'fo': 'fao', 'fr': 'fra', 'fy': 'fry', 'ga': 'gle', 'gd': 'gla', 'gl': 'glg', 'gn': 'grn', 'gu': 'guj', 'gv': 'glv', 'ha': 'hau', 'he': 'heb', 'hi': 'hin', 'ho': 'hmo', 'hr': 'hrv', 'ht': 'hat', 'hu': 'hun', 'hy': 'hye', 'hz': 'her', 'ia': 'ina', 'id': 'ind', 'ie': 'ile', 'ig': 'ibo', 'ii': 'iii', 'ik': 'ipk', 'io': 'ido', 'is': 'isl', 'it': 'ita', 'iu': 'iku', 'ja': 'jpn', 'jv': 'jav', 'ka': 'kat', 'kg': 'kon', 'ki': 'kik', 'kj': 'kua', 'kk': 'kaz', 'kl': 'kal', 'km': 'khm', 'kn': 'kan', 'ko': 'kor', 'kr': 'kau', 'ks': 'kas', 'ku': 'kur', 'kv': 'kom', 'kw': 'cor', 'ky': 'kir', 'la': 'lat', 'lb': 'ltz', 'lg': 'lug', 'li': 'lim', 'ln': 'lin', 'lo': 'lao', 'lt': 'lit', 'lu': 'lub', 'lv': 'lav', 'mg': 'mlg', 'mh': 'mah', 'mi': 'mri', 'mk': 'mkd', 'ml': 'mal', 'mn': 'mon', 'mr': 'mar', 'ms': 'msa', 'mt': 'mlt', 'my': 'mya', 'na': 'nau', 'nb': 'nob', 'nd': 'nde', 'ne': 'nep', 'ng': 'ndo', 'nl': 'nld', 'nn': 'nno', 'no': 'nor', 'nr': 'nbl', 'nv': 'nav', 'ny': 'nya', 'oc': 'oci', 'oj': 'oji', 'om': 'orm', 'or': 'ori', 'os': 'oss', 'pa': 'pan', 'pi': 'pli', 'pl': 'pol', 'ps': 'pus', 'pt': 'por', 'qu': 'que', 'rm': 'roh', 'rn': 'run', 'ro': 'ron', 'ru': 'rus', 'rw': 'kin', 'sa': 'san', 'sc': 'srd', 'sd': 'snd', 'se': 'sme', 'sg': 'sag', 'si': 'sin', 'sk': 'slv', 'sl': 'slv', 'sm': 'smo', 'sn': 'sna', 'so': 'som', 'sq': 'sqi', 'sr': 'srp', 'ss': 'ssw', 'st': 'sot', 'su': 'sun', 'sv': 'swe', 'sw': 'swa', 'ta': 'tam', 'te': 'tel', 'tg': 'tgk', 'th': 'tha', 'ti': 'tir', 'tk': 'tuk', 'tl': 'tgl', 'tn': 'tsn', 'to': 'ton', 'tr': 'tur', 'ts': 'tso', 'tt': 'tat', 'tw': 'twi', 'ty': 'tah', 'ug': 'uig', 'uk': 'ukr', 'ur': 'urd', 'uz': 'uzb', 've': 'ven', 'vi': 'vie', 'vo': 'vol', 'wa': 'wln', 'wo': 'wol', 'xh': 'xho', 'yi': 'yid', 'yo': 'yor', 'za': 'zha', 'zh': 'zho', 'zu': 'zul' };
    const getISO639_3_Code = (code) => ISO_639_1_TO_3_MAP[code] || null;

    const AppState = {
        settings: {},
        dom: {},
        data: {
            release: undefined,
            originalRelease: null,
        },
        lang: {
            code: null,
            script: null,
            detector: null,
            apiFailed: false,
            result: null,
        },
        path: window.location.pathname,
        debug: false,
    };

    // --- UTILITY FUNCTIONS ---

    function log(message, ...args) {
        console.log(`%c[${SCRIPT_NAME}] %c${message}`, 'color: #337ab7; font-weight: bold;', 'color: unset;', ...args);
    }

    function warn(message, ...args) {
        console.warn(`%c[${SCRIPT_NAME}] %c${message}`, 'color: #f0ad4e; font-weight: bold;', 'color: unset;', ...args);
    }

    function error(message, ...args) {
        console.error(`%c[${SCRIPT_NAME}] %c${message}`, 'color: #d9534f; font-weight: bold;', 'color: unset;', ...args);
    }

    /**
    * Formats an array of artist objects into a single credit string with proper join phrases.
    * @param {Array<object>} artists - The array of artist objects, each with a `name` property.
    * @returns {string} The formatted artist credit string.
    */
    function formatArtistString(artists) {
        if (!Array.isArray(artists) || artists.length === 0) return '';
        return artists.reduce((str, artist, index) => {
            str += artist.name;
            if (index < artists.length - 1) {
                const joinPhrase = (index === artists.length - 2) ? ' & ' : ', ';
                str += joinPhrase;
            }
            return str;
        }, '');
    }

    /**
     * Filters a list of labels to ensure uniqueness based on MBID/Name and Catalog Number.
     * @param {Array<object>} labels - The array of label objects.
     * @returns {Array<object>} The filtered array of unique label objects.
     */
    function getUniqueLabels(labels) {
        if (!Array.isArray(labels)) return [];
        const seen = new Set();
        return labels.filter(label => {
            const mbid = (label.mbid || '').trim().toLowerCase();
            const name = (label.name || '').trim().toLowerCase();
            const catNo = (label.catalogNumber || '').trim().toLowerCase();

            // MusicBrainz identifies a row by (Label MBID || Label Name) + Catalog Number.
            // If either the MBID or the Name matches for the same Catalog Number, it's a dupe.
            const identity = mbid || name;
            const key = `${identity}|${catNo}`;

            if (!identity || seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }

    async function getSettings() {
        const settings = {};
        for (const config of Object.values(SETTINGS_CONFIG)) {
            settings[config.key] = await GM_getValue(config.key, config.defaultValue);
        }
        return settings;
    }

    function getReleaseDataFromJSON() {
        if (AppState.data.release !== undefined) { return AppState.data.release; }
        AppState.data.release = null;

        const { freshStateScript } = AppState.dom;
        if (!freshStateScript?.textContent) {
            warn('Could not find Fresh state JSON script tag.');
            return AppState.data.release;
        }
        try {
            const data = JSON.parse(freshStateScript.textContent);
            if (AppState.debug) {
                log('Raw data from __FRSH_STATE__ script tag:', structuredClone(data));
            }

            const releaseObj = data.v?.flat().find(prop => prop?.release)?.release;

            const trackArrays = data.v?.flat().filter(prop => prop?.tracks).map(prop => prop.tracks);

            if (!releaseObj) {
                warn('Could not find release data within Fresh state JSON.');
                return AppState.data.release;
            }

            if (trackArrays.length > 0 && Array.isArray(releaseObj.media)) {
                if (trackArrays.length === releaseObj.media.length) {
                    releaseObj.media.forEach((medium, index) => {
                        if (Array.isArray(trackArrays[index])) {
                            medium.tracklist = trackArrays[index];
                        } else {
                            warn(`Track data for medium ${index + 1} is not an array.`, trackArrays[index]);
                            medium.tracklist = [];
                        }
                    });
                } else {
                    warn(`Mismatch between number of media (${releaseObj.media.length}) and number of tracklists (${trackArrays.length}). Falling back to single tracklist assignment.`);
                    if (releaseObj.media.length > 0 && trackArrays.length > 0) {
                        releaseObj.media[0].tracklist = trackArrays.flat();
                    }
                }
            }
            if (AppState.debug) {
                log('Final processed release object:', structuredClone(releaseObj));
            }
            AppState.data.release = releaseObj;
            AppState.data.originalRelease = structuredClone(releaseObj);
            return AppState.data.release;
        } catch (e) {
            error('Failed to parse Fresh state JSON.', e);
            return AppState.data.release;
        }
    }

    /**
     * Extracts an MBID and returns a canonical MusicBrainz URL for the specific entity type.
     * @param {string} input - The string containing a UUID or URL.
     * @param {string} [entityType='mbid'] - The entity type (e.g., 'label', 'artist', 'release-group').
     */
    function normalizeMbLink(input, entityType = 'mbid') {
        if (!input || typeof input !== 'string') return null;
        const match = input.match(MBID_REGEX);
        return match ? `https://musicbrainz.org/${entityType}/${match[0].toLowerCase()}` : null;
    }

    /**
     * STRICT helper for Consumers (Runtime).
     * Processes raw lines and returns a Map of valid, clean mappings.
     * Ignores drafts/invalid lines.
     */
    function getCleanMappings(lines, entityType = 'mbid') {
        const mapping = new Map();
        if (!Array.isArray(lines)) return mapping;

        lines.forEach(line => {
            if (typeof line !== 'string') return;
            const parts = line.split('=');
            if (parts.length < 2) return;

            const key = parts[0].trim();
            const cleanUrl = normalizeMbLink(parts.slice(1).join('='), entityType);

            if (key && cleanUrl) {
                mapping.set(key, cleanUrl);
            }
        });
        return mapping;
    }

    const DebugModule = {
        _key: SETTINGS_CONFIG.debugMode.key,
        _defaultValue: SETTINGS_CONFIG.debugMode.defaultValue,

        async init() {
            AppState.debug = await GM_getValue(this._key, this._defaultValue);
            if (AppState.debug) {
                this._setupFeatures();
                log('Debug mode is ON. Per-module logs and timers will appear on page load.');
            }
            unsafeWindow.HE_setDebug = this.toggle.bind(this);
        },

        _setupFeatures() {
            unsafeWindow.HE_AppState = AppState;
            unsafeWindow.HE_enhancements = enhancements;

            // Add the indicator only if it doesn't already exist
            if (!document.getElementById('he-debug-indicator')) {
                const indicator = document.createElement('div');
                indicator.id = 'he-debug-indicator';
                indicator.title = `[${SCRIPT_NAME}] Debug Mode is ON`;
                indicator.textContent = 'DEBUG';
                document.body.appendChild(indicator);
            }
        },

        _teardownFeatures() {
            document.getElementById('he-debug-indicator')?.remove();
            delete unsafeWindow.HE_AppState;
            delete unsafeWindow.HE_enhancements;
        },

        async toggle() {
            const newState = !AppState.debug;

            await GM_setValue(this._key, newState);
            AppState.debug = newState;

            if (newState) {
                this._setupFeatures();
                log(`Debug mode has been toggled ON. Per-module logs will appear on the next page load.`);
            } else {
                this._teardownFeatures();
                log(`Debug mode has been toggled OFF.`);
            }
        },
    };

    // --- UI UTILITY FUNCTIONS ---

    const UI_UTILS = {
        /**
        * Creates an indicator span (e.g., '(overwritten)', '(removed)') with a tooltip.
        * @param {string} indicatorText - The text to display inside the parentheses (e.g., 'added').
        * @param {string} originalValue - The original value to show in the tooltip.
        * @param {object} [options] - Optional parameters.
        * @param {string} [options.type='overwritten'] - The type of indicator ('overwritten', 'removed', 'added').
        * @param {string} [options.tooltip] - A full override for the tooltip text.
        * @param {string} [options.tooltipPrefix='Original:'] - The text to prepend to the original value.
        * @param {boolean} [options.standalone=false] - If true, the span will not have a left margin.
        * @returns {HTMLSpanElement}
        */
        createIndicatorSpan: (indicatorText, originalValue, { type = 'overwritten', tooltip = '', tooltipPrefix = 'Original value:', standalone = false } = {}) => {
            const span = document.createElement('span');
            span.className = type === 'added' ? 'he-added-label' : 'he-overwritten-label';
            span.title = tooltip || `${tooltipPrefix} ${originalValue}`;
            span.textContent = `(${indicatorText})`;

            if (!standalone) {
                span.style.marginLeft = '0.5em';
            }
            return span;
        },


        /**
        * Hides debug messages whose text content includes any of the given substrings.
        * @param {string[]} substrings - An array of strings to search for in debug messages.
        */
        hideDebugMessagesByContent: (substrings) => {
            document.querySelectorAll('.message.debug').forEach(msg => {
                const text = msg.textContent;
                if (substrings.some(sub => text.includes(sub))) {
                    msg.style.display = 'none';
                }
            });
        },

        /**
        * Finds a row in the main release info table by its header label.
        * @param {string} labelText - The text of the <th> element to find (e.g., 'Labels').
        * @returns {HTMLTableRowElement | null}
        */
        findReleaseInfoRow: (labelText) => {
            return AppState.dom.releaseInfoRowsByHeader?.get(labelText) || null;
        },

        /**
        * Updates the text content of an element and appends an indicator span.
        * @param {HTMLElement} element - The DOM element to update.
        * @param {string} newText - The new text content.
        * @param {string} originalText - The original text for the tooltip.
        * @param {string} tooltipPrefix - The prefix for the tooltip title.
        */
        updateElementText: (element, newText, originalText, tooltipPrefix) => {
            if (!element) return;
            const overwrittenSpan = UI_UTILS.createIndicatorSpan('overwritten', originalText, { tooltipPrefix });
            element.textContent = newText;
            element.parentNode.insertBefore(overwrittenSpan, element.nextSibling);
        },

        /**
            * Replaces the content of the main label element with a new name and an optional MB link.
            * @param {HTMLElement} labelListElement - The <span> element containing the label (e.g., AppState.dom.mainLabelList).
            * @param {string} newLabelName - The new text for the label.
            * @param {string | null} [newMbid] - The optional MBID to link to.
            */
        updateLabelLink: (labelListElement, newLabelName, newMbid) => {
            if (!labelListElement) return;

            labelListElement.innerHTML = '';

            if (newMbid) {
                const mbIconSpan = document.createElement('span');
                mbIconSpan.className = 'musicbrainz';
                mbIconSpan.title = 'MusicBrainz';
                mbIconSpan.innerHTML = `<svg class="icon" width="18" height="18" stroke-width="1.5"><use xlink:href="/icon-sprite.svg#brand-metabrainz"></use></svg>`;

                const mbLink = document.createElement('a');
                mbLink.href = `https://musicbrainz.org/label/${newMbid}`;
                mbLink.appendChild(mbIconSpan);
                mbLink.appendChild(document.createTextNode(newLabelName));
                labelListElement.appendChild(mbLink);
            } else {
                labelListElement.appendChild(document.createTextNode(newLabelName));
            }
        },

        /**
         * Builds the HTML for a list of artists, preserving links from scraped data if available.
         * @param {object[]} artists - Array of artist objects {name, mbid?}.
         * @returns {string} - The constructed HTML string.
         */
        buildArtistCreditsHTML: (artists) => {
            const { scrapedArtistLinks } = AppState.dom;
            return artists.reduce((html, artist, index) => {
                let artistLinkHTML = `<span>${artist.name}</span>`;

                // Try to find an existing link for this artist name
                if (scrapedArtistLinks) {
                    const matchingSpans = scrapedArtistLinks.filter(data => data.name === artist.name);
                    if (matchingSpans.length > 0) {
                        const bestSpanData = matchingSpans.reduce((best, current) => {
                            return current.count > best.count ? current : best;
                        }, matchingSpans[0]);
                        artistLinkHTML = bestSpanData.html;
                    }
                }

                html += artistLinkHTML;
                if (index < artists.length - 1) {
                    const joinPhrase = (index === artists.length - 2) ? ' & ' : ', ';
                    html += joinPhrase;
                }
                return html;
            }, '');
        },

        /**
         * Updates a tracklist artist cell with new artists, adding an indicator and preserving alt-values.
         * @param {HTMLTableCellElement} cell - The table cell to update.
         * @param {object[]} newArtists - The new list of artists.
         * @param {string} oldArtistsString - The original artist string (for tooltip).
         * @param {object} [options] - Options for the indicator.
         */
        updateTrackArtistCell: (cell, newArtists, oldArtistsString, options = {}) => {
            if (!cell) return;

            const existingAltValues = cell.querySelector('ul.alt-values');
            const newHTML = UI_UTILS.buildArtistCreditsHTML(newArtists);

            cell.innerHTML = newHTML;

            const tooltipPrefix = options.tooltipPrefix || 'Original track artists:';
            const overwrittenSpan = UI_UTILS.createIndicatorSpan('overwritten', oldArtistsString, { ...options, tooltipPrefix });
            cell.appendChild(overwrittenSpan);

            if (existingAltValues) {
                cell.appendChild(document.createTextNode(' '));
                cell.appendChild(existingAltValues);
            }

            cell.setAttribute(DATA_ATTRIBUTE_APPLIED, 'true');
        },

        /**
         * Replaces the entire content of the release labels list with a single new label.
         * @param {string} newLabelName - The name of the new label.
         * @param {string} newMbid - The MBID of the new label.
         * @param {string} originalNames - The original label names to display in the tooltip.
         */
        replaceReleaseLabels: (newLabelName, newMbid, originalNames) => {
            const labelsUl = document.querySelector('ul.release-labels');
            if (!labelsUl) return;

            labelsUl.innerHTML = '';
            const li = document.createElement('li');
            const span = document.createElement('span');
            span.className = 'entity-links';
            li.appendChild(span);
            labelsUl.appendChild(li);

            UI_UTILS.updateLabelLink(span, newLabelName, newMbid);
            const indicator = UI_UTILS.createIndicatorSpan('overwritten', originalNames, {
                tooltipPrefix: 'Original labels:',
            });
            li.appendChild(indicator);
        },
    };

    /**
    * Cleans an array of titles for analysis.
    * @param {string[]} allTitles - The array of titles to clean.
    * @param {object} options - Cleaning options.
    * @param {'light' | 'deep'} options.cleanLevel - The depth of cleaning. 'light' for release type, 'deep' for language detection.
    * @returns {string[]} The cleaned array of titles.
    */
    function getCleanedTitles(allTitles, { cleanLevel = 'deep' }) {
        const techTerms = AppState.settings[SETTINGS_CONFIG.techTerms.key];
        const stopWords = new Set(AppState.settings[SETTINGS_CONFIG.stopWords.key]);
        const enclosedRegex = new RegExp(`\\s*(?:\\([^)]*\\b(${techTerms.join('|')})\\b[^)]*\\)|\\[[^\\]]*\\b(${techTerms.join('|')})\\b[^\\]]*\\])`, 'ig');
        const trailingRegex = new RegExp(`\\s+[-–]\\s+.*(?:${techTerms.map(t => `\\b${t}\\b`).join('|')}).*`, 'ig');


        // Stage 1: Initial Cleaning (remove bracketed/hyphenated technical terms)
        let cleanedTitles = allTitles.map(title =>
            title.replace(enclosedRegex, '').replace(trailingRegex, '').trim()
        ).filter(Boolean);

        // Stage 2: Contextual "Core Title" Cleaning (find a common base title)
        const titleCounts = new Map();
        cleanedTitles.forEach(title => titleCounts.set(title, (titleCounts.get(title) || 0) + 1));
        let coreTitle = null;
        let maxCount = 0;
        if (titleCounts.size > 1) {
            for (const [title, count] of titleCounts.entries()) {
                if (count > maxCount) {
                    maxCount = count;
                    coreTitle = title;
                }
            }
        }
        if (maxCount > 1 && coreTitle) {
            cleanedTitles = cleanedTitles.map(title => (title.startsWith(coreTitle) && title !== coreTitle) ? coreTitle : title);
        }

        if (cleanLevel === 'light') {
            return cleanedTitles;
        }

        // --- Deep Cleaning Stages (for language detection) ---

        // Stage 3: Stop Word Removal (from within titles)
        const stopWordsRegex = new RegExp(`\\b(${Array.from(stopWords).join('|')})\\b`, 'gi');
        let surgicallyCleanedTitles = cleanedTitles.map(title =>
            title.replace(stopWordsRegex, '').replace(/\s{2,}/g, ' ').trim()
        );

        // Stage 4: Whole Title Filtering (remove titles that are now just stop words)
        const finalFilteredTitles = surgicallyCleanedTitles.filter(title => {
            if (!title) return false;
            const normalizedTitle = title.toLowerCase().replace(/[\s.]+/g, '');
            return !stopWords.has(normalizedTitle);
        });

        // Stage 5: De-duplication & Final Selection
        const uniqueTitlesMap = new Map();
        for (const title of finalFilteredTitles) {
            const lowerCaseTitle = title.toLowerCase();
            if (!uniqueTitlesMap.has(lowerCaseTitle)) {
                uniqueTitlesMap.set(lowerCaseTitle, title);
            }
        }
        const uniqueTitles = Array.from(uniqueTitlesMap.values());
        return uniqueTitles.length > 0 ? uniqueTitles : [...new Set(allTitles)];
    }


    function showTooltip(message, type, event) {
        const tooltip = document.createElement('div');
        tooltip.textContent = message;
        tooltip.className = `he-tooltip ${type === 'success' ? 'he-tooltip-success' : 'he-tooltip-error'}`;
        document.body.appendChild(tooltip);
        tooltip.style.left = `${event.clientX - (tooltip.offsetWidth / 2)}px`;
        tooltip.style.top = `${event.clientY - tooltip.offsetHeight - 10}px`;
        setTimeout(() => { tooltip.style.opacity = '1'; }, 10);
        setTimeout(() => {
            tooltip.style.opacity = '0';
            tooltip.addEventListener('transitionend', () => tooltip.remove());
        }, TOOLTIP_DISPLAY_DURATION);
    }

    function showConfirmationModal({ title, message, confirmText = 'Confirm', cancelText = 'Cancel' }) {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.className = 'he-modal-overlay';

            const modal = document.createElement('div');
            modal.className = 'he-modal-content';

            modal.innerHTML = `
                <h3>${title}</h3>
                <p>${message}</p>
                <div class="he-modal-actions">
                    <button class="he-modal-cancel-button">${cancelText}</button>
                    <button class="he-modal-confirm-button">${confirmText}</button>
                </div>
            `;

            overlay.appendChild(modal);
            document.body.appendChild(overlay);

            const close = (value) => {
                overlay.remove();
                resolve(value);
            };

            modal.querySelector('.he-modal-confirm-button').onclick = () => close(true);
            modal.querySelector('.he-modal-cancel-button').onclick = () => close(false);
            overlay.onclick = (e) => {
                if (e.target === overlay) close(false);
            };
        });
    }

    /**
    * Finds the best position to insert a new message element in the release view.
    * It prioritizes inserting after specific known elements to group related messages.
    * @param {string[]} [priorityAnchorIds=[]] - An array of element IDs to try anchoring to first.
    * @returns {Node | null} The node *before which* the new element should be inserted.
    */
    function findInsertionAnchor(priorityAnchorIds = []) {
        const { releaseContainer } = AppState.dom;
        if (!releaseContainer) return null;

        // 1. Try to find a priority anchor if provided.
        for (const id of priorityAnchorIds) {
            const anchor = document.getElementById(id);
            if (anchor) {
                return anchor.nextSibling;
            }
        }

        // 2. Fallback to finding Harmony's own debug messages.
        const messages = releaseContainer.querySelectorAll('.message.debug');
        let langGuessMsg = null;
        let scriptGuessMsg = null;
        for (const msg of messages) {
            const text = msg.textContent;
            if (text.includes('Guessed language of the titles:')) langGuessMsg = msg;
            else if (text.includes('Detected scripts of the titles:')) scriptGuessMsg = msg;
        }

        if (langGuessMsg) return langGuessMsg.nextSibling;
        if (scriptGuessMsg) return scriptGuessMsg.nextSibling;

        // 3. Fallback for "no linguistic content" case where Harmony provides no language guess message.
        const noLettersMsg = Array.from(messages).find(msg => msg.textContent.includes('Titles contain no letters'));
        if (noLettersMsg) return noLettersMsg.nextSibling;

        // 4. Final fallback to the first message of any kind.
        return releaseContainer.querySelector('.message');
    }

    /**
    * Creates and inserts a message element into the release view.
    * @param {string} id - The ID for the new message element.
    * @param {string} message - The raw text or HTML content for the message.
    * @param {'debug' | 'info' | 'warning' | 'error'} [type='debug'] - The type of the message.
    * @param {string[]} [priorityAnchorIds=[]] - An array of element IDs to try anchoring to first.
    */
    function createAndInsertMessage(id, message, type = 'debug', priorityAnchorIds = []) {
        const { releaseContainer } = AppState.dom;
        if (!releaseContainer) return;

        document.getElementById(id)?.remove();

        const messageDiv = document.createElement('div');
        messageDiv.id = id;
        messageDiv.className = `message ${type}`;

        const iconName = type === 'debug' ? 'bug' : 'info-circle';

        // Split the message by <br> tags to handle multi-line content and format it nicely.
        const lines = message.split(/<br\s*\/?>/i);
        const messageLinesHtml = lines.map(line => `<p>${line}</p>`).join('');

        const finalContent = `
            <div class="he-message-content-wrapper">
                <div class="he-message-prefix"><b>[${SCRIPT_NAME}]</b></div>
                <div class="he-message-lines">${messageLinesHtml}</div>
            </div>`;

        messageDiv.innerHTML = `<svg class="icon" width="24" height="24" stroke-width="2"><use xlink:href="/icon-sprite.svg#${iconName}"></use></svg>
            <div>${finalContent}</div>`;

        const insertionAnchor = findInsertionAnchor(priorityAnchorIds);
        const parent = (insertionAnchor?.parentElement || releaseContainer.querySelector('.message')?.parentElement) || releaseContainer;
        parent.insertBefore(messageDiv, insertionAnchor);
    }


    // --- SETTINGS PAGE ---

    function initSettingsPage() {
        const main = AppState.dom.settingsMain;
        if (!main || main.querySelector('.he-settings-container')) return;

        const sections = Object.values(SETTINGS_CONFIG)
            .filter(config => config.section) // Filter out internal settings
            .reduce((acc, config) => {
                (acc[config.section] = acc[config.section] || []).push(config);
                return acc;
            }, {});

        const container = document.createElement('div');
        container.className = 'he-settings-container';

        for (const [name, configs] of Object.entries(sections)) {
            const header = document.createElement('div');
            header.className = 'he-settings-header';

            const h3 = document.createElement('h3');
            h3.textContent = name;
            header.appendChild(h3);

            if (name === 'Language Detection') {
                const resetButton = document.createElement('button');
                resetButton.textContent = 'Reset Language Settings';
                resetButton.className = 'he-reset-button';
                resetButton.onclick = async (e) => {
                    e.preventDefault();
                    const confirmed = await showConfirmationModal({
                        title: 'Reset Language Settings',
                        message: 'Are you sure you want to reset all language detection settings to their defaults? This cannot be undone.',
                        confirmText: 'Reset'
                    });
                    if (confirmed) {
                        await resetLanguageSettings();
                        showTooltip('Language settings have been reset.', 'success', e);
                    }
                };
                header.appendChild(resetButton);
            }

            container.appendChild(header);

            const sectionInputs = {};

            configs.forEach(config => {
                const wrap = document.createElement('div');
                wrap.className = 'row he-setting-row';

                const textContainer = document.createElement('div');
                textContainer.className = 'he-setting-text-container';

                const lbl = document.createElement('label');
                lbl.htmlFor = config.key;
                lbl.textContent = config.label;
                lbl.className = 'he-setting-label';
                textContainer.appendChild(lbl);

                let input;
                let descriptionEl;

                if (config.description) {
                    descriptionEl = document.createElement('small');
                    descriptionEl.id = `${config.key}-desc`;
                    descriptionEl.innerHTML = config.description;
                    descriptionEl.className = 'he-setting-description';
                    textContainer.appendChild(descriptionEl);
                }

                switch (config.type) {
                    case 'radio':
                        wrap.classList.add('he-setting-row-column');
                        const fieldset = document.createElement('div');
                        fieldset.className = 'he-radio-group';
                        config.options.forEach(option => {
                            const radioWrap = document.createElement('div');
                            const radioInput = document.createElement('input');
                            radioInput.type = 'radio';
                            radioInput.name = config.key;
                            radioInput.value = option.value;
                            radioInput.id = `${config.key}-${option.value}`;
                            radioInput.checked = AppState.settings[config.key] === option.value;
                            const radioLabel = document.createElement('label');
                            radioLabel.htmlFor = radioInput.id;
                            radioLabel.textContent = option.label;
                            const radioContentWrap = document.createElement('div');
                            radioContentWrap.className = 'he-radio-content';
                            radioContentWrap.append(radioLabel);
                            if (option.description) {
                                const desc = document.createElement('small');
                                desc.className = 'he-setting-description';
                                desc.innerHTML = option.description;
                                radioContentWrap.append(desc);
                            }
                            radioWrap.append(radioInput, radioContentWrap);
                            fieldset.append(radioWrap);
                        });
                        input = fieldset; // Use the fieldset for event handling
                        wrap.append(textContainer, fieldset);
                        break;
                    case 'checkbox':
                        input = document.createElement('input');
                        input.type = 'checkbox';
                        input.checked = AppState.settings[config.key];
                        input.className = 'he-checkbox';
                        wrap.append(input, textContainer);
                        break;
                    case 'range':
                        wrap.classList.add('he-setting-row-column');
                        input = document.createElement('input');
                        input.type = 'range';
                        input.min = 0;
                        input.max = 100;
                        input.value = AppState.settings[config.key];
                        const val = document.createElement('span');
                        val.textContent = ` ${AppState.settings[config.key]}%`;
                        input.addEventListener('input', () => val.textContent = ` ${input.value}%`);
                        const rangeWrap = document.createElement('div');
                        rangeWrap.className = 'he-range-wrap';
                        rangeWrap.append(input, val);
                        wrap.append(textContainer, rangeWrap);
                        break;
                    case 'textarea':
                        wrap.classList.add('he-setting-row-column');
                        const areaContainer = document.createElement('div');
                        input = document.createElement('textarea');
                        input.rows = 5;
                        input.value = Array.isArray(AppState.settings[config.key]) ? AppState.settings[config.key].join('\n') : '';
                        input.className = 'he-textarea';
                        input.spellcheck = false;
                        areaContainer.appendChild(input);
                        if (config.tidy) {
                            const tidyBtn = document.createElement('button');
                            tidyBtn.textContent = 'Tidy & Sort';
                            tidyBtn.className = 'he-tidy-button';
                            tidyBtn.title = 'Sorts alphabetically and removes duplicates/invalid lines.';
                            tidyBtn.onclick = (e) => {
                                e.preventDefault();
                                const currentVal = input.value;
                                const cleanedVal = config.tidy(currentVal);
                                input.value = cleanedVal;
                                input.dispatchEvent(new Event('change'));
                                showTooltip('List tidied and saved!', 'success', e);
                            };
                            lbl.after(tidyBtn);
                        }
                        wrap.append(textContainer, areaContainer);
                        break;
                }

                if (input) {
                    input.id = config.key;
                    sectionInputs[config.key] = input;
                    if (descriptionEl) {
                        input.setAttribute('aria-describedby', descriptionEl.id);
                    }
                    const save = () => {
                        let value;
                        if (config.type === 'checkbox') {
                            value = input.checked;
                        } else if (config.type === 'radio') {
                            const checkedRadio = input.querySelector('input[type="radio"]:checked');
                            if (checkedRadio) {
                                value = checkedRadio.value;
                            }
                        } else if (config.type === 'range') {
                            value = parseInt(input.value, 10);
                        } else if (config.type === 'textarea') {
                            value = input.value.split('\n').map(s => s.trim()).filter(Boolean);
                        }
                        GM_setValue(config.key, value);
                    };
                    input.addEventListener('change', save);
                    if (config.type === 'range' || config.type === 'textarea') {
                        input.addEventListener('input', save);
                    }
                }
                container.appendChild(wrap);
            });

            if (name === 'Language Detection') {
                const modeControl = sectionInputs[SETTINGS_CONFIG.languageDetectionMode.key];
                const dependentInputs = Object.values(sectionInputs)
                    .filter(input => input !== modeControl);
                const toggleDependentInputs = () => {
                    const modeConfig = SETTINGS_CONFIG.languageDetectionMode;
                    const checkedRadio = container.querySelector(`input[name="${modeConfig.key}"]:checked`);
                    const currentMode = checkedRadio ? checkedRadio.value : modeConfig.defaultValue;
                    const isBrowserMode = currentMode === 'browser';
                    dependentInputs.forEach(input => {
                        const row = input.closest('.he-setting-row');
                        if (row) {
                            row.style.display = isBrowserMode ? '' : 'none';
                        }
                    });
                };

                modeControl.addEventListener('change', toggleDependentInputs);
                toggleDependentInputs();
            }
        }
        main.appendChild(container);
    }

    async function resetLanguageSettings() {
        const langConfigs = Object.values(SETTINGS_CONFIG).filter(c => c.section === 'Language Detection');
        for (const config of langConfigs) {
            await GM_deleteValue(config.key);
            const input = document.getElementById(config.key);
            if (!input) continue;

            switch (config.type) {
                case 'radio': {
                    const defaultRadio = input.querySelector(`input[value="${config.defaultValue}"]`);
                    if (defaultRadio) {
                        defaultRadio.checked = true;
                    }
                    input.dispatchEvent(new Event('change'));
                    break;
                }
                case 'checkbox':
                    input.checked = config.defaultValue;
                    break;
                case 'range':
                    input.value = config.defaultValue;
                    input.nextElementSibling.textContent = ` ${config.defaultValue}%`;
                    break;
                case 'textarea':
                    input.value = config.defaultValue.join('\n');
                    break;
            }

        }
    }

    // --- ENHANCEMENT MODULES ---

    const URL_CONFIG = [
        {
            param: 'musicbrainz',
            pattern: new URLPattern({
                hostname: '{(beta|test).}?musicbrainz.(org|eu)',
                pathname: '/:type(artist|release)/:id{/:action}?'
            }),
            postProcess: (result) => (result.pathname.groups.type === 'release' ? result.pathname.groups.id : null),
        },
        {
            param: 'url',
            pattern: new URLPattern({
                hostname: '{www.}?deezer.com',
                pathname: '{/:language(\\w{2})}?/:type(album|artist|track)/:id(\\d+)'

            }),
        },
        {
            param: 'url',
            pattern: new URLPattern({
                hostname: '{geo.}?(itunes|music).apple.com',
                pathname: '/:region(\\w{2})?/:type(album|artist|song)/:slug?/{id}?:id(\\d+)'
            }),
        },
        {
            param: 'url',
            pattern: new URLPattern({
                hostname: 'open.spotify.com',
                pathname: '{/intl-:language}?/:type(artist|album|track)/:id'
            }),
        },
        {
            param: 'url',
            pattern: new URLPattern({
                hostname: '{(www|listen).}?tidal.com',
                pathname: '{/browse}?/:type(album|artist|track|video)/:id(\\d+)/*?'
            }),
        },
        {
            param: 'url',
            pattern: new URLPattern({
                hostname: ':artist.bandcamp.com',
                pathname: '/:type(album|track)/:title'
            }),
        },
        {
            param: 'url',
            pattern: new URLPattern({
                hostname: 'www.beatport.com',
                pathname: '/:language(\\w{2})?/:type(artist|label|release|track)/:slug/:id'
            }),
        },
    ].map(config => {
        if (config.param === 'url' && !config.postProcess) {
            config.postProcess = (result, url) => url;
        }
        return config;
    });

    const enhancements = {
        _copyHandler: async (event, text, name) => {
            try {
                await navigator.clipboard.writeText(text);
                showTooltip(`${name} copied!`, 'success', event);
            } catch (err) {
                error(`Failed to copy ${name}:`, err);
                showTooltip(`Failed to copy ${name}!`, 'error', event);
            }
        },

        removeHardcodedBy: () => {
            const { releaseArtistNode } = AppState.dom;
            if (releaseArtistNode && releaseArtistNode.firstChild && releaseArtistNode.firstChild.nodeType === Node.TEXT_NODE && releaseArtistNode.firstChild.textContent.trim().startsWith('by')) {
                releaseArtistNode.firstChild.textContent = releaseArtistNode.firstChild.textContent.replace(/^by\s+/, '');
            }
        },

        toggleReleaseInfo: () => {
            const terms = ['Availability', 'Sources', 'External links'];
            terms.forEach(term => {
                const row = UI_UTILS.findReleaseInfoRow(term);
                if (row) {
                    row.style.display = 'none';
                }
            });
        },

        addClipboardButton: () => {
            if (document.getElementById('he-redo-lookup-clipboard-button')) return;
            const { lookupBtn } = AppState.dom;
            const container = lookupBtn?.closest('.input-with-overlay');
            if (!container) return;

            const newBtn = document.createElement('input');
            newBtn.type = 'submit';
            newBtn.value = 'Re-Lookup from Clipboard';
            newBtn.id = 'he-redo-lookup-clipboard-button';
            newBtn.className = lookupBtn.className;

            container.parentElement.insertBefore(newBtn, container.nextSibling);

            newBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                try {
                    const text = await navigator.clipboard.readText();
                    const urlMatches = text.match(/https?:\/\/[^\s]+/g);

                    if (!urlMatches || urlMatches.length === 0) {
                        showTooltip('No URL found in clipboard!', 'error', e);
                        return;
                    }

                    const url = new URL(window.location.href);
                    if (url.pathname === '/') {
                        url.pathname = '/release';
                    }

                    let addedCount = 0;

                    for (const clipboardUrl of urlMatches) {
                        for (const config of URL_CONFIG) {
                            const result = config.pattern.exec(clipboardUrl);
                            if (result) {
                                const value = config.postProcess(result, clipboardUrl);
                                if (value) {
                                    if (config.param === 'url') {
                                        url.searchParams.append(config.param, value);
                                    } else {
                                        url.searchParams.set(config.param, value);
                                    }
                                    addedCount++;
                                    break;
                                }
                            }
                        }
                    }

                    if (addedCount > 0) {
                        window.location.href = url.toString();
                    } else {
                        showTooltip('No supported release links found in clipboard!', 'error', e);
                    }
                } catch (err) {
                    const message = err.name === 'NotAllowedError' ? 'Clipboard permission denied!' : 'Could not read clipboard!';
                    showTooltip(message, 'error', e);
                }
            });
        },

        makePermalinkCopyable: () => {
            const { permaLink } = AppState.dom;
            if (!permaLink || permaLink.hasAttribute(DATA_ATTRIBUTE_APPLIED)) return;

            permaLink.setAttribute(DATA_ATTRIBUTE_APPLIED, 'true');
            permaLink.classList.add('copyable-permalink');
            permaLink.title = 'Click to copy URL';

            permaLink.addEventListener('click', async (e) => {
                e.preventDefault();
                const url = permaLink.href;
                enhancements._copyHandler(e, url, 'Permalink');
            });
        },

        addSearchLinks: () => {
            if (document.getElementById('he-search-links')) return;

            const releaseData = getReleaseDataFromJSON();
            if (!releaseData || !releaseData.title || !releaseData.artists) return;

            const isVariousArtists = releaseData.artists.length >= 5;
            const releaseArtist = isVariousArtists ? 'Various Artists' : releaseData.artists.map(a => a.name).join(' ');
            const releaseTitle = releaseData.title;

            const encodedArtist = encodeURIComponent(releaseArtist);
            const encodedTitle = encodeURIComponent(releaseTitle);

            const searchLinks = [];

            const { regionInput } = AppState.dom;
            const currentRegion = regionInput ? regionInput.value.toLowerCase() : '';
            const defaultQbzRegion = 'us-en';
            const regionMap = new Map([
                ['ar', 'ar-es'], ['au', 'au-en'], ['at', 'at-de'], ['be', 'be-nl'], ['br', 'br-pt'],
                ['ca', 'ca-en'], ['cl', 'cl-es'], ['co', 'co-es'], ['dk', 'dk-en'], ['fi', 'fi-en'],
                ['fr', 'fr-fr'], ['de', 'de-de'], ['ie', 'ie-en'], ['it', 'it-it'], ['jp', 'jp-ja'],
                ['lu', 'lu-de'], ['mx', 'mx-es'], ['nl', 'nl-nl'], ['nz', 'nz-en'], ['no', 'no-en'],
                ['pt', 'pt-pt'], ['es', 'es-es'], ['se', 'se-en'], ['ch', 'ch-de'], ['gb', 'gb-en'],
                ['us', 'us-en'],
            ]);

            const regionKey = currentRegion.split(',').map(code => code.trim()).find(code => regionMap.has(code));
            const qbzRegion = regionMap.get(regionKey) || defaultQbzRegion;

            searchLinks.push({
                name: 'Search Qobuz',
                url: `https://www.qobuz.com/${qbzRegion}/search?q=${encodedArtist}%20${encodedTitle}&type=album`
            });

            if (releaseData.gtin) {
                const barcode = releaseData.gtin.replace(/^0+/, '');
                searchLinks.push({
                    name: 'Search YouTube Music',
                    url: `https://music.youtube.com/search?q="${encodeURIComponent(barcode)}"`
                });
            }

            searchLinks.push({
                name: 'Search Bandcamp',
                url: `https://bandcamp.com/search?q=${encodedArtist}%20${encodedTitle}&item_type=a`
            });

            searchLinks.push({
                name: 'Search Beatsource',
                url: `https://www.beatsource.com/search/releases?q=${encodedArtist}%20${encodedTitle}`
            });

            searchLinks.push({
                name: 'Search Apple Music (ISRCeam)',
                url: `https://isrceam.rinsuki.net/apple/jp/search?q=${encodedArtist}%20${encodedTitle}`
            });

            searchLinks.push({
                name: 'Search OTOTOY',
                url: `https://ototoy.jp/find/?q=${encodedArtist}%20${encodedTitle}`
            });

            searchLinks.push({
                name: 'Search mora',
                url: `https://mora.jp/search/top?keyWord=${encodedArtist}%20${encodedTitle}`
            });

            // --- Placement ---
            const { permalinkHeader } = AppState.dom;
            if (!permalinkHeader || !permalinkHeader.nextElementSibling) return;

            const container = document.createElement('div');
            container.id = 'he-search-links';
            container.style.textAlign = 'center';
            container.style.marginBottom = '1em';

            searchLinks.forEach((link, index) => {
                const anchor = document.createElement('a');
                anchor.href = link.url;
                anchor.textContent = link.name;
                anchor.target = '_blank';
                container.appendChild(anchor);

                if (index < searchLinks.length - 1) {
                    container.appendChild(document.createTextNode(' | '));
                }
            });

            permalinkHeader.nextElementSibling.append(container);
        },

        runLanguageDetection: async () => {
            if (AppState.lang.result !== null) {
                enhancements.applyLanguageDetectionResult(AppState.lang.result);
                return;
            }

            const releaseData = getReleaseDataFromJSON();
            if (!releaseData) return;

            if (releaseData.language?.code === 'zxx') {
                log('Harmony has already determined no linguistic content (zxx). Skipping language detection.');
                return;
            }

            if (!AppState.lang.detector && !AppState.lang.apiFailed) {
                if ('LanguageDetector' in window) {
                    try {
                        const nativeDetector = await window.LanguageDetector.create();
                        AppState.lang.detector = (text) => nativeDetector.detect(text);
                    } catch (error) {
                        error('LanguageDetector API failed to initialize.', error);
                        AppState.lang.apiFailed = true;
                    }
                } else {
                    warn('LanguageDetector API not available in this browser.');
                    AppState.lang.apiFailed = true;
                }
            }

            if (AppState.lang.apiFailed) {
                AppState.lang.result = { skipped: true, debugInfo: { analyzedText: 'LanguageDetector API not available or failed to load.' } };
                enhancements.applyLanguageDetectionResult(AppState.lang.result);
                return;
            }

            const { title: releaseTitle, media } = releaseData;
            const trackTitles = (media || []).flatMap(m => (Array.isArray(m.tracklist) ? m.tracklist.map(t => t.title) : []));
            const trackCount = media?.reduce((sum, m) => sum + ((Array.isArray(m.tracklist) ? m.tracklist.length : 0)), 0) || 0;

            if (trackCount === 1 && !AppState.settings[SETTINGS_CONFIG.detectSingles.key]) {
                AppState.lang.result = { skipped: true, debugInfo: { analyzedText: 'Skipped: Single track release detection is disabled.' } };
                enhancements.applyLanguageDetectionResult(AppState.lang.result);
                return;
            }

            const allTitles = [releaseTitle, ...trackTitles].filter(Boolean);
            if (allTitles.length === 0) return;

            const titlesToAnalyze = getCleanedTitles(allTitles, { cleanLevel: 'deep' });

            let textToAnalyze = titlesToAnalyze.join(' . ');
            if (titlesToAnalyze.length <= 3) {
                textToAnalyze += ' .';
            }

            if (!textToAnalyze.replaceAll(/\P{Letter}/gu, '')) {
                AppState.lang.result = { languageName: '[No linguistic content]', confidence: 100, languageCode3: 'zxx', scriptCode: null, isZxx: true, debugInfo: { allResults: [], analyzedText: textToAnalyze } };
            } else {
                const results = await AppState.lang.detector(textToAnalyze);
                if (results.length === 0) return;
                const final = results[0];
                const [langCode, scriptCode] = final.detectedLanguage.split('-');
                AppState.lang.result = {
                    languageName: new Intl.DisplayNames(['en'], { type: 'language' }).of(langCode),
                    confidence: Math.round(final.confidence * 100),
                    languageCode3: getISO639_3_Code(langCode),
                    scriptCode: scriptCode || null,
                    isZxx: false,
                    skipped: false,
                    debugInfo: { allResults: results, analyzedText: textToAnalyze }
                };
            }
            enhancements.applyLanguageDetectionResult(AppState.lang.result);
        },


        applyLanguageDetectionResult: (result) => {
            if (!result) return;
            const { releaseInfoTable } = AppState.dom;
            if (!releaseInfoTable) return;

            const { languageName, confidence, languageCode3, scriptCode, isZxx, skipped, debugInfo } = result;
            const confidenceThreshold = AppState.settings[SETTINGS_CONFIG.confidenceThreshold.key];
            const conflictThreshold = AppState.settings[SETTINGS_CONFIG.conflictThreshold.key];

            let langRow = UI_UTILS.findReleaseInfoRow('Language');
            let scriptRow = UI_UTILS.findReleaseInfoRow('Script');
            let harmonyConfidence = 0;
            let originalLang = '';
            let originalText = '';
            if (langRow) {
                originalText = langRow.querySelector('td').textContent.trim();
                originalLang = originalText.replace(/\s*\(.*\)/, '').trim();
                harmonyConfidence = parseInt((originalText.match(/\((\d+)%\sconfidence\)/) || [])[1] || '0', 10);
            }

            const shouldOverwrite = AppState.settings[SETTINGS_CONFIG.ignoreHarmony.key] || harmonyConfidence < conflictThreshold;

            // --- Build and insert the debug message ---
            let messageContent = '';
            if (skipped) {
                messageContent = debugInfo.analyzedText;
            } else {
                const b = document.createElement('b');
                b.textContent = languageName;
                messageContent = `Guessed language (LanguageDetector API): ${b.outerHTML} (${confidence}% confidence)`;
                if (scriptCode) {
                    const scriptName = new Intl.DisplayNames(['en'], { type: 'script' }).of(scriptCode);
                    messageContent += `<br>Detected script: <b>${scriptName}</b>`;
                }

                if (!shouldOverwrite && originalLang.toLowerCase() !== languageName.toLowerCase()) {
                    messageContent += ` <i>- Harmony's confidence meets the conflict threshold (${conflictThreshold}%) and force overwrite is off, no changes applied.</i>`;
                } else if (confidence < confidenceThreshold) {
                    messageContent += ` <i>- below ${confidenceThreshold}% threshold, no changes applied.</i>`;
                }

                messageContent += `<br>Analyzed block: "${debugInfo.analyzedText}"`;
            }
            createAndInsertMessage('he-language-analysis', messageContent);

            // --- Update the UI and Seeder ---
            const updateSeeder = (lang, script) => {
                if (lang) {
                    AppState.data.release.language = { code: lang };
                }

                if (script) {
                    AppState.data.release.script = { code: script };
                } else if (lang === 'zxx') {
                    AppState.data.release.script = null;
                }
            };

            if (isZxx) {
                if (langRow) {
                    langRow.querySelector('td').textContent = '[No linguistic content]';
                } else {
                    const newRow = releaseInfoTable.insertRow(scriptRow ? scriptRow.rowIndex + 1 : -1);
                    newRow.id = 'he-language-row';
                    newRow.innerHTML = `<th>Language</th><td>[No linguistic content]</td>`;
                }
                updateSeeder('zxx', null);
                return;
            }

            if (skipped || confidence < confidenceThreshold) return;

            // Update Language
            const newLangContent = `${languageName} (${confidence}% confidence)`;
            if (langRow) {
                if (shouldOverwrite) {
                    if (originalLang.toLowerCase() !== languageName.toLowerCase()) {
                        const cell = langRow.querySelector('td');
                        cell.textContent = '';
                        cell.append(newLangContent, ' ');
                        const overwrittenSpan = UI_UTILS.createIndicatorSpan('overwritten', originalText, { tooltipPrefix: "Harmony's original guess:" });
                        cell.append(overwrittenSpan);
                        cell.setAttribute(DATA_ATTRIBUTE_APPLIED, 'true');
                    }
                }
            } else {
                const newRow = releaseInfoTable.insertRow(scriptRow ? scriptRow.rowIndex + 1 : -1);
                newRow.id = 'he-language-row';
                const th = document.createElement('th');
                th.textContent = 'Language';
                const td = document.createElement('td');
                td.textContent = newLangContent;

                const addedSpan = UI_UTILS.createIndicatorSpan('added', null, {
                    type: 'added',
                    tooltip: `Added by ${SCRIPT_NAME}; value was not present.`,
                });
                td.append(' ', addedSpan);
                newRow.append(th, td);
                langRow = newRow;
            }

            // Update Script
            if (scriptCode) {
                const newScript = new Intl.DisplayNames(['en'], { type: 'script' }).of(scriptCode);
                if (scriptRow) {
                    const originalScriptText = scriptRow.querySelector('td').textContent.trim();
                    const originalScript = originalScriptText.replace(/\s*\(.*\)/, '').trim();

                    if (originalScript.toLowerCase() !== newScript.toLowerCase()) {
                        const cell = scriptRow.querySelector('td');
                        cell.textContent = '';
                        cell.append(newScript, ' ');
                        const overwrittenSpan = UI_UTILS.createIndicatorSpan('overwritten', originalScriptText, { tooltipPrefix: "Harmony's original guess:" });
                        cell.append(overwrittenSpan);
                        cell.setAttribute(DATA_ATTRIBUTE_APPLIED, 'true');
                    }
                } else {
                    const newRow = releaseInfoTable.insertRow(langRow ? langRow.rowIndex + 1 : -1);
                    const th = document.createElement('th');
                    th.textContent = 'Script';
                    const td = document.createElement('td');
                    td.textContent = newScript;

                    const addedSpan = UI_UTILS.createIndicatorSpan('added', null, {
                        type: 'added',
                        tooltip: `Added by ${SCRIPT_NAME}; value was not present.`,
                    });
                    td.append(' ', addedSpan);
                    newRow.append(th, td);
                }
            }

            updateSeeder(languageCode3, scriptCode);
        },

        improveReleaseTypeDetection: () => {
            const releaseData = getReleaseDataFromJSON();
            if (!releaseData || !releaseData.media || !releaseData.types?.[0]) {
                return;
            }

            const { title: releaseTitle, media, types } = releaseData;
            const originalType = types[0];
            let detectedType = null;
            let detectionReason = '';

            // 1. More flexible title-based detection for EPs.
            if (/\bEP\b/i.test(releaseTitle) && ['Album', 'Single'].includes(originalType)) {
                detectedType = 'EP';
                detectionReason = `Detected "EP" in release title`;
            }

            // 2. Original logic to detect singles from track titles (overrides EP detection).
            const totalTracks = media.reduce((sum, m) => sum + ((Array.isArray(m.tracklist) ? m.tracklist.length : 0)), 0);
            if (totalTracks > 1) {
                const allTitles = media.flatMap(m => (Array.isArray(m.tracklist) ? m.tracklist.map(t => t.title) : []));
                const coreTitles = getCleanedTitles(allTitles, { cleanLevel: 'light' });
                const uniqueLowerCaseTitles = new Set(coreTitles.map(title => title.toLowerCase()));
                if (uniqueLowerCaseTitles.size === 1) {
                    detectedType = 'Single';
                    detectionReason = 'All tracks appear to be versions of the same title';
                }
            }

            // 3. Apply the change if a new type was detected and it's different from the original.
            if (detectedType && detectedType !== originalType) {
                AppState.data.release.types[0] = detectedType;

                const releaseTypeRow = UI_UTILS.findReleaseInfoRow('Types');
                if (releaseTypeRow) {
                    const cell = releaseTypeRow.querySelector('td');
                    if (!cell) return;

                    const altValuesList = cell.querySelector('ul.alt-values');
                    const textNode = Array.from(cell.childNodes).find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim());

                    if (textNode) {
                        textNode.textContent = detectedType;
                        cell.insertBefore(document.createTextNode(' '), altValuesList);
                        cell.insertBefore(UI_UTILS.createIndicatorSpan('overwritten', originalType, { tooltipPrefix: "Harmony's original guess:" }), altValuesList);
                    }
                }

                const messageContent = `Changed release type from "${originalType}" to "${detectedType}". Reason: ${detectionReason}.`;
                createAndInsertMessage('he-release-type-override', messageContent, 'debug', ['he-language-analysis']);
            }
        },

        normalizeETI: () => {
            const { tracklistTitleCells, releaseTitleNode } = AppState.dom;
            const releaseData = getReleaseDataFromJSON();
            if (!releaseData?.media || releaseData.info?.sourceMap?.title !== 'Spotify') {
                return;
            }

            const providers = releaseData.info?.providers || [];
            const providerCount = providers.length;
            const regexp = /(?<title>.+?)(?:\s+?[~/-])(?![^(]*\)) (?<eti>.*)/;
            let modifications = [];

            const getCorrectedTitle = (originalTitle) => {
                if (!originalTitle) return null;
                const match = originalTitle.match(regexp);
                if (!match) return null;

                const { title, eti } = match.groups;
                const etiTrimmed = eti.trim();
                if (!etiTrimmed) return null;

                const newTitle = `${title.trim()} (${etiTrimmed})`;
                return { original: originalTitle, new: newTitle };
            };

            const findTextNode = (element, text) => {
                for (const node of element.childNodes) {
                    if (node.nodeType === Node.TEXT_NODE && node.textContent.includes(text)) {
                        return node;
                    }
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const found = findTextNode(node, text);
                        if (found) return found;
                    }
                }
                return null;
            };

            const updateTitleUI = (element, originalTitle, newTitle) => {
                if (!element) return;
                UI_UTILS.updateElementText(element, newTitle, originalTitle, 'Original title:');
            };

            // --- First Pass: Determine which titles are normalizable ---
            const normalizableTitles = new Set();
            const techTerms = AppState.settings[SETTINGS_CONFIG.techTerms.key];
            const techTermsRegex = new RegExp(`\\b(${techTerms.join('|')})\\b`, 'i');

            // Consolidate all titles and their potential UI nodes
            const titlesToScan = [
                { title: releaseData.title, node: releaseTitleNode },
                ...releaseData.media.flatMap(m => m.tracklist?.map(t => ({
                    title: t.title,
                    node: Array.from(tracklistTitleCells).find(cell => cell.textContent.includes(t.title)),
                })) || [])
            ].filter(item => item.title); // Ensure title exists

            // De-duplicate by title string, keeping the first node found
            const uniqueTitlesToScan = Array.from(new Map(titlesToScan.map(item => [item.title, item])).values());

            uniqueTitlesToScan.forEach(item => {
                const { title, node } = item;
                const match = title.match(regexp);
                if (!match) return; // Doesn't have hyphenated ETI

                // Condition A: ETI contains a known "tech term" (always safe)
                const { eti } = match.groups;
                const etiTrimmed = eti.trim();
                if (etiTrimmed && techTermsRegex.test(etiTrimmed)) {
                    normalizableTitles.add(title);
                    return; // Added, no need to check condition B
                }

                // Condition B: Multi-provider release AND a UI discrepancy is shown
                // (This is the original safeguard against false positives)
                if (providerCount > 1) {
                    if (node && node.querySelector('ul.alt-values')) {
                        normalizableTitles.add(title);
                    }
                }
            });

            // --- Second Pass: Apply corrections to normalizable titles ---
            // Correct the release title
            const releaseTitleCorrection = getCorrectedTitle(releaseData.title);
            if (releaseTitleCorrection && normalizableTitles.has(releaseTitleCorrection.original)) {
                AppState.data.release.title = releaseTitleCorrection.new;
                modifications.push(`Release title: "${releaseTitleCorrection.original}" -> "${releaseTitleCorrection.new}"`);
                updateTitleUI(releaseTitleNode, releaseTitleCorrection.original, releaseTitleCorrection.new);
            }

            // Correct each track title
            releaseData.media.forEach(medium => {
                medium.tracklist?.forEach(track => {
                    const trackTitleCorrection = getCorrectedTitle(track.title);
                    if (trackTitleCorrection && normalizableTitles.has(trackTitleCorrection.original)) {
                        track.title = trackTitleCorrection.new;
                        modifications.push(`Track ${track.number}: "${trackTitleCorrection.original}" -> "${trackTitleCorrection.new}"`);

                        const trackCell = Array.from(tracklistTitleCells)
                            .find(cell => cell.textContent.includes(trackTitleCorrection.original));
                        if (trackCell) {
                            const titleTextNode = findTextNode(trackCell, trackTitleCorrection.original);
                            if (titleTextNode) {
                                updateTitleUI(titleTextNode, trackTitleCorrection.original, trackTitleCorrection.new);
                            }
                        }
                    }
                });
            });

            if (modifications.length > 0) {
                const uniqueModifications = [...new Set(modifications)];
                const messageContent = 'Normalized hyphenated ETI style:<br>' + uniqueModifications.map(m => `- ${m}`).join('<br>');
                createAndInsertMessage('he-title-style-correction', messageContent, 'debug', ['he-artist-sync']);
            }
        },

        setNoLabel: () => {
            const releaseData = getReleaseDataFromJSON();
            if (!releaseData || !releaseData.labels?.length || !releaseData.artists?.length) {
                return;
            }

            // 1. Gather all artist names (Release Artists + Track Artists)
            const allArtists = [
                ...releaseData.artists,
                ...(releaseData.media || []).flatMap(m =>
                    (m.tracklist || []).flatMap(t => t.artists || [])
                )
            ];

            // 2. Extract unique names and sort by length (descending)
            const uniqueArtistNames = new Set();
            allArtists.forEach(artist => {
                if (artist && artist.name) {
                    uniqueArtistNames.add(artist.name.trim());
                }
            });

            const sortedArtists = Array.from(uniqueArtistNames)
                .sort((a, b) => b.length - a.length);

            const SEPARATORS_REGEX = /^(?:x|&|,|\/|-|\+|feat\.|ft\.|pres\.|presents|vs\.|vs|[\s\u200B\uFEFF])+$/i;

            // 2. Identify self-release labels
            const labelStatuses = releaseData.labels.map((originalLabel, index) => {
                const labelName = originalLabel.name.trim();
                if (!labelName || originalLabel.mbid) return { isSelf: false, originalLabel, index };

                let remainingLabel = labelName;
                for (const artistName of sortedArtists) {
                    const escapedName = artistName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const regex = new RegExp(escapedName, 'i');
                    remainingLabel = remainingLabel.replace(regex, '');
                }
                const isSelf = remainingLabel.length === 0 || SEPARATORS_REGEX.test(remainingLabel);
                return { isSelf, originalLabel, index };
            });

            const selfReleaseItems = labelStatuses.filter(s => s.isSelf);
            if (selfReleaseItems.length === 0) return;

            const allLabelsAreSelf = selfReleaseItems.length === releaseData.labels.length;
            const { labelListElements } = AppState.dom;

            // 3. Update state and UI
            if (allLabelsAreSelf && releaseData.labels.length > 1) {
                // Consolidate all to a single [no label] entry
                const originalNames = selfReleaseItems.map(s => s.originalLabel.name).join(', ');

                // Update State
                AppState.data.release.labels = [{ ...selfReleaseItems[0].originalLabel, ...NO_LABEL }];

                // Update UI
                UI_UTILS.replaceReleaseLabels(NO_LABEL.name, NO_LABEL.mbid, originalNames);
            } else {
                // Individual replacements for partial matches or single label
                selfReleaseItems.forEach(item => {
                    const { originalLabel, index } = item;
                    AppState.data.release.labels[index] = { ...originalLabel, ...NO_LABEL };

                    const labelListElement = labelListElements[index];
                    if (labelListElement) {
                        UI_UTILS.updateLabelLink(labelListElement, NO_LABEL.name, NO_LABEL.mbid);

                        const overwrittenSpan = UI_UTILS.createIndicatorSpan('overwritten', originalLabel.name, {
                            tooltipPrefix: 'Original label:',
                        });
                        if (!labelListElement.nextElementSibling || !labelListElement.nextElementSibling.classList.contains('he-overwritten-label')) {
                            labelListElement.parentNode.insertBefore(overwrittenSpan, labelListElement.nextSibling);
                        }
                    }
                });
            }
        },

        detectRemixers: () => {
            const releaseData = getReleaseDataFromJSON();
            if (!releaseData?.media) return;

            // Keywords that indicate a remix/version string
            const REMIX_KEYWORDS = ['Remix', 'Rework', 'Edit', 'Mix', 'Flip', 'Bootleg', 'Mashup', 'VIP', 'Dub'];
            const KEYWORDS_REGEX = new RegExp(`\\b(${REMIX_KEYWORDS.join('|')})\\b`, 'i');

            // Regex to find content in parentheses or brackets at the end of the title
            // Captures the content inside the brackets/parens
            const VERSION_REGEX = /(?:[([{\u3010\u300C])([^)}\]\u3011\u300D]*?)(?:[)}\]\u3011\u300D])\s*$/;

            // Separators often found around artist names in these strings
            const SEPARATORS = '[\\s&,./+()\\[\\]-]';
            const BOUNDARY_START = `(?:^|${SEPARATORS})`;
            const BOUNDARY_END = `(?:$|${SEPARATORS})`;

            const { tracklistTitleCells } = AppState.dom;
            const flattenedTracks = releaseData.media.flatMap(m => m.tracklist || []);

            const removedArtistsLog = [];
            let changesMade = false;

            flattenedTracks.forEach((track, index) => {
                const title = track.title;
                if (!title) return;

                const match = title.match(VERSION_REGEX);
                if (!match) return;

                const versionString = match[1];

                if (!KEYWORDS_REGEX.test(versionString)) return;
                if (!track.artists || track.artists.length <= 1) return;

                const keptArtists = [];
                const removedFromThisTrack = [];

                track.artists.forEach(artist => {
                    const artistName = artist.name.trim();
                    const escapedName = artistName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const nameRegex = new RegExp(`${BOUNDARY_START}${escapedName}${BOUNDARY_END}`, 'i');

                    if (nameRegex.test(versionString)) {
                        removedFromThisTrack.push(artistName);
                        changesMade = true;
                    } else {
                        keptArtists.push(artist);
                    }
                });

                if (removedFromThisTrack.length > 0) {
                    if (keptArtists.length > 0) {
                        const oldArtistsString = formatArtistString(track.artists);
                        track.artists = keptArtists;
                        removedArtistsLog.push({
                            track: track.number,
                            title: title,
                            removed: removedFromThisTrack
                        });

                        // --- UI Update ---
                        const titleCell = tracklistTitleCells[index];
                        if (titleCell) {
                            const row = titleCell.parentElement;
                            const artistCell = row.cells[2];
                            if (artistCell) {
                                UI_UTILS.updateTrackArtistCell(artistCell, keptArtists, oldArtistsString);
                            }
                        }
                    }
                }
            });

            if (changesMade && removedArtistsLog.length > 0) {
                const lines = removedArtistsLog.map(log =>
                    `Track ${log.track}: Removed <b>${log.removed.join(', ')}</b> (MATCHED: "${log.title}")`
                );
                const messageContent = `Detected and removed remixers from track artists based on title:<br>${lines.join('<br>')}`;
                createAndInsertMessage('he-remixer-detection', messageContent, 'debug', ['he-artist-sync', 'he-title-style-correction']);
            }
        },

        removeBarcodeCatalogNumbers: () => {
            const releaseData = getReleaseDataFromJSON();
            const { gtin, labels } = releaseData;

            if (!gtin || !labels || labels.length === 0) return;

            const firstLabelSpan = AppState.dom.mainLabelList;
            if (!firstLabelSpan) return;

            const labelListItems = firstLabelSpan.closest('ul')?.querySelectorAll('li');
            if (!labelListItems) return;

            let changesMade = false;
            const removedLogs = [];

            labels.forEach((label, index) => {
                const catNum = label.catalogNumber ? String(label.catalogNumber).trim() : '';
                const cleanGtin = String(gtin).trim();

                if (catNum === cleanGtin) {
                    label.catalogNumber = null;
                    changesMade = true;
                    removedLogs.push(label.name);

                    if (labelListItems[index]) {
                        const li = labelListItems[index];

                        let textNodeToReplace = null;

                        for (const node of li.childNodes) {
                            if (node.nodeType === Node.TEXT_NODE && node.textContent.includes(cleanGtin)) {
                                textNodeToReplace = node;
                                break;
                            }
                        }

                        if (textNodeToReplace) {
                            textNodeToReplace.textContent = textNodeToReplace.textContent.replace(cleanGtin, '');

                            const removedSpan = UI_UTILS.createIndicatorSpan('removed', cleanGtin, {
                                type: 'removed',
                                tooltipPrefix: 'Removed catalog number (matches barcode):',
                                standalone: true
                            });

                            const labelLinkSpan = li.querySelector('.entity-links');
                            if (labelLinkSpan) {
                                labelLinkSpan.after(removedSpan);
                                labelLinkSpan.after(' ');
                            } else {
                                li.append(removedSpan);
                            }
                        }
                    }
                }
            });

            if (changesMade) {
                const messageContent = `Removed catalog numbers that matched the barcode (${gtin}) for labels: <b>${removedLogs.join(', ')}</b>`;
                createAndInsertMessage('he-cat-barcode-match', messageContent, 'debug');
            }
        },

        mapLabelMbids: () => {
            const releaseData = getReleaseDataFromJSON();
            if (!releaseData?.labels?.length) {
                return;
            }

            const rawLines = AppState.settings[SETTINGS_CONFIG.mapLabelMbids.key];
            const labelMap = getCleanMappings(rawLines, 'label');

            if (labelMap.size === 0) return;

            const { labelListElements } = AppState.dom;

            releaseData.labels.forEach((originalLabel, index) => {
                if (originalLabel.mbid) return;

                const currentLabelName = originalLabel.name.trim();
                const matchedUrl = labelMap.get(currentLabelName);

                if (matchedUrl) {
                    const mbid = matchedUrl.split('/').pop();
                    AppState.data.release.labels[index].mbid = mbid;

                    const labelListElement = labelListElements[index];
                    if (labelListElement) {
                        UI_UTILS.updateLabelLink(labelListElement, currentLabelName, mbid);
                        const addedSpan = UI_UTILS.createIndicatorSpan('added', mbid, {
                            type: 'added',
                            tooltip: `MBID ${mbid} added via user mapping.`,
                        });
                        if (!labelListElement.nextElementSibling?.classList.contains('he-added-label')) {
                            labelListElement.parentNode.insertBefore(addedSpan, labelListElement.nextSibling);
                        }
                    }
                    const messageContent = `Mapped label "${currentLabelName}" to MBID: ${mbid}`;
                    createAndInsertMessage('he-label-map-success', messageContent, 'debug');
                }
            });
        },

        syncTrackArtist: () => {
            const releaseData = getReleaseDataFromJSON();
            if (!releaseData?.artists || !releaseData.media) return;

            const allTracks = releaseData.media.flatMap(m => m.tracklist || []);
            if (allTracks.length === 0) {
                return;
            }

            const getArtistSignature = (artists) => {
                if (!Array.isArray(artists) || artists.length === 0) return null;
                return artists.map(a => a.mbid || a.name).join('|');
            };

            const firstTrackArtists = allTracks[0].artists;
            const firstSignature = getArtistSignature(firstTrackArtists);

            if (!firstSignature) {
                return;
            }

            const allTracksHaveSameArtists = allTracks.every(track => getArtistSignature(track.artists) === firstSignature);

            if (!allTracksHaveSameArtists) {
                return;
            }

            const releaseArtists = releaseData.artists;
            const commonTrackArtists = firstTrackArtists;

            if (commonTrackArtists.length <= releaseArtists.length) {
                return;
            }

            const oldArtists = formatArtistString(releaseArtists);
            const newArtists = formatArtistString(commonTrackArtists);
            AppState.data.release.artists = commonTrackArtists;

            const { artistCreditSpan } = AppState.dom;
            if (artistCreditSpan) {
                const newCreditHTML = UI_UTILS.buildArtistCreditsHTML(commonTrackArtists);
                artistCreditSpan.innerHTML = newCreditHTML;
                const overwrittenSpan = UI_UTILS.createIndicatorSpan('overwritten', oldArtists, { tooltipPrefix: 'Original release artists:' });
                artistCreditSpan.append(overwrittenSpan);
            }
            const messageContent = `Synced more detailed track artist credit to release artist.<br><b>Before:</b> ${oldArtists}<br><b>After:</b> ${newArtists}`;
            createAndInsertMessage('he-artist-sync', messageContent, 'debug', ['he-release-type-override', 'he-language-analysis']);
        },

        cleanArtistNames: () => {
            const clean = (artists) => {
                if (!Array.isArray(artists)) return;
                artists.forEach(artist => {
                    if (artist.mbid) {
                        artist.name = null;
                    }
                });
            };
            clean(AppState.data.release.artists);
            AppState.data.release.media?.forEach(medium => {
                if (medium.tracklist) {
                    clean(medium.tracklist.flatMap(t => t.artists || []));
                }
            });
        },

        updateProperties: (form) => {
            buildSeederParameters(form, AppState.data.release, AppState.data.originalRelease, ['gtin', 'packaging']);
        },

        unsetLanguageData: () => {
            AppState.data.release.language = null;
            AppState.data.release.script = null;
        },

        updateUIAfterLanguageDisable: () => {
            UI_UTILS.hideDebugMessagesByContent([
                'Guessed language of the titles:',
                'Detected scripts of the titles:'
            ]);

            ['Language', 'Script'].forEach(label => {
                const row = UI_UTILS.findReleaseInfoRow(label);
                if (row) {
                    const cell = row.querySelector('td');
                    if (!cell) return;

                    const originalText = cell.textContent.trim();
                    const removedSpan = UI_UTILS.createIndicatorSpan('removed', originalText, {
                        type: 'removed',
                        tooltipPrefix: 'Original value:',
                        standalone: true,
                    });

                    cell.textContent = '';
                    cell.appendChild(removedSpan);
                }
            });
        },

        setupFormSubmitListener: () => {
            document.body.addEventListener('submit', (e) => {
                const form = e.target.closest('form');
                if (form && (form.getAttribute('name') === 'release-seeder' || form.getAttribute('name') === 'release-update-seeder')) {
                    handleSeederFormSubmit(e);
                }
            });
        }
    };

    /**
    * Builds or augments a seeder form with parameters from the release data.
    * This function operates in a "patch" mode by comparing the current
    * release data to the original data snapshot.
    *
    * @param {HTMLFormElement} form - The form element to modify.
    * @param {object} releaseData - The *current*, (potentially modified) release data.
    * @param {object} originalReleaseData - The *original*, unmodified release data.
    * @param {string[] | null} [paramsToBuild=null] - Optional array of parameters to build.
    */
    function buildSeederParameters(form, releaseData, originalReleaseData, paramsToBuild = null) {
        if (!releaseData) return;

        const desiredInputs = new Map();
        const set = (name, value) => {
            if (value !== undefined && value !== null) {
                desiredInputs.set(name, String(value));
            }
        };
        const getValueFromPath = (obj, path) => path.split('.').reduce((acc, part) => acc?.[part], obj);

        const pathsToBuild = new Set(paramsToBuild || []);

        if (!paramsToBuild) {
            for (const key of Object.keys(PARAMETER_GENERATORS)) {
                const newValue = getValueFromPath(releaseData, key);
                const oldValue = getValueFromPath(originalReleaseData, key);

                if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
                    pathsToBuild.add(key);
                }
            }
        }

        const generatorsToRun = [];
        for (const [key, config] of Object.entries(PARAMETER_GENERATORS)) {
            if (pathsToBuild.has(key)) {
                generatorsToRun.push([key, config]);
            }
        }

        const prefixesToClear = generatorsToRun.map(([, config]) => config.cleanupPrefix);
        form.querySelectorAll('input[type="hidden"]').forEach(input => {
            if (prefixesToClear.some(prefix => input.name.startsWith(prefix))) {
                input.remove();
            }
        });

        for (const [key, config] of generatorsToRun) {
            const value = getValueFromPath(releaseData, key);

            if ((value != null) || config.generator || config.paramName) {
                if (config.generator) {
                    config.generator(value, set);
                } else if (config.paramName) {
                    set(config.paramName, value);
                }
            }
        }

        for (const [name, value] of desiredInputs.entries()) {
            let input = form.querySelector(`input[type="hidden"][name="${name}"]`);
            if (input) {
                if (input.value !== value) {
                    input.value = value;
                }
            } else {
                input = document.createElement('input');
                input.type = 'hidden';
                input.name = name;
                input.value = value;
                form.appendChild(input);
            }
        }
    }

    // --- FORM SUBMISSION HANDLER ---

    function handleSeederFormSubmit(event) {
        event.preventDefault();
        event.stopPropagation();

        const form = event.target.closest('form');
        if (!form) {
            warn('Event target has no parent form, ignoring.');
            return;
        }
        const formName = form.getAttribute('name');

        for (const [funcName, config] of Object.entries(SETTINGS_CONFIG)) {
            if (config.runAt !== 'submit' || config.formName !== formName || !enhancements[funcName]) {
                continue;
            }
            const valueMatch = config.value ? AppState.settings[config.key] === config.value : AppState.settings[config.key];

            if (valueMatch) {
                if (AppState.debug) {
                    log(`Running submit module: ${funcName}...`);
                }
                enhancements[funcName](form);
            }
        }

        if (formName === 'release-seeder') {
            buildSeederParameters(form, AppState.data.release, AppState.data.originalRelease, null);
        }

        form.submit();
    }

    // --- INITIALIZATION AND ROUTING ---

    /** Caches DOM elements common to lookup pages. */
    function cacheMainDOM() {
        AppState.dom.lookupBtn = document.querySelector('input[type="submit"][value="Lookup"]');
    }

    /** Caches DOM elements for the release lookup page. */
    function cacheReleaseLookupPageDOM() {
        cacheMainDOM();
        AppState.dom.freshStateScript = document.querySelector('script[id^="__FRSH_STATE_"]');
        AppState.dom.releaseContainer = document.querySelector('div.release');
        AppState.dom.releaseTitleNode = document.querySelector('h2.release-title');
        AppState.dom.tracklistTitleCells = document.querySelectorAll('table.tracklist td:nth-child(2)');
        AppState.dom.releaseArtistNode = AppState.dom.releaseContainer?.querySelector('.release-artist');
        AppState.dom.artistCreditSpan = AppState.dom.releaseArtistNode?.querySelector('.artist-credit');
        AppState.dom.permalinkHeader = document.querySelector('h2.center');
        AppState.dom.permaLink = document.querySelector('p.center > a');
        AppState.dom.regionInput = document.querySelector('#region-input');
        AppState.dom.releaseInfoTable = document.querySelector('.release-info tbody');
        AppState.dom.releaseInfoRowsByHeader = new Map();
        if (AppState.dom.releaseInfoTable) {
            AppState.dom.releaseInfoTable.querySelectorAll('th').forEach(th => {
                const headerText = th.textContent.trim();
                if (headerText) {
                    AppState.dom.releaseInfoRowsByHeader.set(headerText, th.parentElement);
                }
            });
        }

        AppState.dom.mainLabelList = document.querySelector('ul.release-labels li span.entity-links');
        AppState.dom.labelListElements = document.querySelectorAll('ul.release-labels li span.entity-links');
        AppState.dom.scrapedArtistLinks = Array.from(document.querySelectorAll('.entity-links')).map(span => ({
            name: span.textContent.trim(),
            count: span.querySelectorAll('a').length,
            html: span.outerHTML,
        }));
    }

    /** Caches DOM elements for the release actions page. */
    function cacheReleaseActionsPageDOM() {
        AppState.dom.actionsHeader = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Release Actions'));
        AppState.dom.releaseArtistNode = document.querySelector('.release-artist');
    }

    /** Caches DOM elements for the settings page. */
    function cacheSettingsPageDOM() {
        AppState.dom.settingsMain = document.querySelector('main');
    }

    function applyGlobalStyles() {
        const css = `
            .release-artist::before { content: "by "; }
            .release-artist > :first-child { margin-left: 0.25em; }
            ${AppState.settings[SETTINGS_CONFIG.hideDebugMessages.key] ? '.message.debug { display: none !important; }' : ''}
            .he-overwritten-label,.he-added-label {
                font-size: 0.8em;
                font-weight: bold;
                cursor: help;
            }
            .he-overwritten-label {
                color: #d9534f;
                border-bottom: 1px dotted #d9534f;
            }
            .he-added-label {
                color: #4CAF50;
                border-bottom: 1px dotted #4CAF50;
            }
            .he-reset-button, .he-tidy-button {
                padding: 4px 8px;
                font-size: 12px;
                border-radius: 4px;
                border: 1px solid #ccc;
                cursor: pointer;
            }
            .he-tidy-button {
                float: right;
            }
            .he-tooltip {
                position: fixed;
                color: white;
                padding: 5px 10px;
                border-radius: 4px;
                font-size: 12px;
                z-index: 10002;
                opacity: 0;
                transition: opacity 0.3s;
                pointer-events: none;
                white-space: nowrap;
            }
            .he-tooltip-success { background-color: #4CAF50; }
            .he-tooltip-error { background-color: #f44336; }
            .he-modal-overlay {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background-color: rgba(0, 0, 0, 0.6); z-index: 10000;
                display: flex; align-items: center; justify-content: center;
            }
            .he-modal-content {
                background-color: var(--theme-fill); padding: 20px; border-radius: 8px;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); max-width: 400px;
                text-align: center;
            }
            .he-modal-content h3 { margin-top: 0; }
            .he-modal-actions { margin-top: 20px; }
            .he-modal-cancel-button {
                margin-right: 10px; padding: 8px 16px; border-radius: 4px;
                border: 1px solid #ccc; cursor: pointer;
            }
            .he-modal-confirm-button {
                padding: 8px 16px; border-radius: 4px; border: none;
                background-color: #f44336; color: white; cursor: pointer;
            }
            .he-modal-confirm-button:hover {
                background-color: #d32f2f;
            }
            .he-settings-container { margin-top: 2em; }
            .he-settings-header { display: flex; justify-content: space-between; align-items: center; }
            .he-setting-row { align-items: flex-start !important; }
            .he-setting-row-column { flex-direction: column; align-items: stretch !important; }
            .he-setting-text-container { flex: 1; text-align: left; }
            .he-setting-label { display: inline-block; }
            .he-setting-description { display: block; color: #666; margin-top: 4px; }
            .he-checkbox { margin-top: 4px; }
            .he-radio-group > div {
                display: flex;
                align-items: flex-start;
                margin-bottom: 0.75em;
            }
            .he-radio-group input[type="radio"] {
                margin-top: 4px;
                margin-right: 8px;
            }
            .he-radio-group .he-radio-content {
                flex: 1;
            }
            .he-range-wrap { display: flex; align-items: center; }
            .he-textarea {
                width: 100%;
                margin-top: 4px;
                color: var(--text);
                background-color: var(--input-fill);
            }
            .he-message-content-wrapper {
                display: table;
                width: 100%;
            }
            .he-message-prefix {
                display: table-cell;
                padding-right: 0.5em;
                white-space: nowrap;
                vertical-align: middle;
            }
            .he-message-lines {
                display: table-cell;
                width: 100%;
            }
            .he-message-lines > p {
                margin: 0;
                padding: 0;
            }
            #he-debug-indicator {
                position: fixed;
                bottom: 10px;
                right: 10px;
                background-color: #ffc107;
                color: #000;
                padding: 5px 10px;
                border-radius: 5px;
                font-size: 12px;
                font-weight: bold;
                font-family: monospace;
                z-index: 10001;
                cursor: help;
            }
        `;
        GM_addStyle(css);
    }

    async function runSettingsCleanup() {
        const settings = AppState.settings;

        // 1. Language Settings Migration (Legacy)
        const modeKey = SETTINGS_CONFIG.languageDetectionMode.key;
        const oldEnabledKey = 'enhancements.lang.enabled';
        const oldDisableKey = 'enhancements.lang.disableDetection';

        if (!settings[modeKey] || settings[modeKey] === 'undefined') {
            log('Running one-time migration for language settings...');
            let newMode = 'browser';

            if (settings[oldDisableKey] === true) {
                newMode = 'none';
            } else if (settings[oldEnabledKey] === false) {
                newMode = 'harmony';
            } else {
                newMode = 'browser';
            }

            log(`Migrated to new mode: '${newMode}'`);
            await GM_setValue(modeKey, newMode);
            AppState.settings[modeKey] = newMode;
            await GM_deleteValue(oldEnabledKey);
            await GM_deleteValue(oldDisableKey);
            await GM_deleteValue(`${oldEnabledKey}.backup`);
        }

        // 2. Cleanup List Defaults
        const cleanupLists = [SETTINGS_CONFIG.techTerms, SETTINGS_CONFIG.stopWords];

        const areSetsEqual = (a, b) => a.size === b.size && [...a].every(value => b.has(value));

        for (const config of cleanupLists) {
            // Use a unique symbol to detect if the key is missing/unset
            const UNSET = 'HE_UNSET_' + Math.random();
            const storedValue = await GM_getValue(config.key, UNSET);

            if (storedValue !== UNSET && Array.isArray(storedValue)) {
                const storedSet = new Set(storedValue);
                const defaultSet = new Set(config.defaultValue);

                let shouldDelete = false;

                // Check 1: Matches current default (e.g. fast/slow included)
                // This covers cases where user saved "no effective change"
                if (areSetsEqual(storedSet, defaultSet)) {
                    shouldDelete = true;
                }

                // Check 2: Matches OLD default (for techTerms only)
                // This covers users who have the old default "forked" in storage
                if (!shouldDelete && config.key === SETTINGS_CONFIG.techTerms.key) {
                    const oldDefaultSet = new Set(config.defaultValue.filter(x => !['fast', 'slow'].includes(x)));
                    if (areSetsEqual(storedSet, oldDefaultSet)) {
                        shouldDelete = true;
                    }
                }

                if (shouldDelete) {
                    await GM_deleteValue(config.key);
                    log(`Cleanup: Reset ${config.key} to default (stored value matched default).`);
                }
            }
        }
    }

    async function main() {
        AppState.settings = await getSettings();
        await runSettingsCleanup();
        await DebugModule.init();

        const { path } = AppState;
        applyGlobalStyles();

        if (path === '/') {
            cacheMainDOM();
        } else if (path.startsWith('/release') && !path.startsWith('/release/actions')) {
            cacheReleaseLookupPageDOM();
            getReleaseDataFromJSON();
        } else if (path.startsWith('/release/actions')) {
            cacheReleaseActionsPageDOM();
        } else if (path.startsWith('/settings')) {
            cacheSettingsPageDOM();
            initSettingsPage();
            return;
        }

        const loadTimeActionMap = {
            browser: 'runLanguageDetection',
            none: 'updateUIAfterLanguageDisable',
        };
        const mode = AppState.settings[SETTINGS_CONFIG.languageDetectionMode.key];
        const moduleName = loadTimeActionMap[mode];

        if (moduleName) {
            const config = SETTINGS_CONFIG[moduleName];
            const moduleFunc = enhancements[moduleName];
            if (config?.paths.some(p => p.test(AppState.path))) {
                if (AppState.debug) {
                    log(`Running mode-dependent module: ${moduleName}...`);
                    console.time(`[${SCRIPT_NAME}] ${moduleName} execution time`);
                }
                moduleFunc();
                if (AppState.debug) {
                    console.timeEnd(`[${SCRIPT_NAME}] ${moduleName} execution time`);
                }
            }
        }

        const modeDependentModules = ['runLanguageDetection', 'updateUIAfterLanguageDisable', 'unsetLanguageData'];
        for (const [funcName, config] of Object.entries(SETTINGS_CONFIG)) {
            if (modeDependentModules.includes(funcName) || !config.runAt) continue;

            if ((config.runAt ?? 'load') === 'load' && AppState.settings[config.key] && config.paths && enhancements[funcName]) {
                if (config.paths.some(p => p.test(AppState.path))) {
                    if (AppState.debug) {
                        log(`Running standard module: ${funcName}...`);
                        console.time(`[${SCRIPT_NAME}] ${funcName} execution time`);
                    }
                    enhancements[funcName]();
                    if (AppState.debug) {
                        console.timeEnd(`[${SCRIPT_NAME}] ${funcName} execution time`);
                    }
                }
            }
        }
    }

    main().catch(e => error(`An unhandled error occurred in main execution:`, e));

})();
