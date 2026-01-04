// ==UserScript==
// @name         FnP - Advanced Filtering System
// @namespace    FnPAFS
// @version      3.3.2
// @license      MIT
// @description  Modern and Advanced Filtering System
// @author       jkillas
// @match        https://fearnopeer.com/*
// @exclude      https://*/torrents?bookmarked*
// @exclude      https://*/torrents?uploader*
// @grant        GM_getValue
// @grant        GM_setValue
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fearnopeer.com
// @downloadURL https://update.greasyfork.org/scripts/522341/FnP%20-%20Advanced%20Filtering%20System.user.js
// @updateURL https://update.greasyfork.org/scripts/522341/FnP%20-%20Advanced%20Filtering%20System.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEBUG = {
        log: (context, data) => {
            console.log(`[Filter Debug][${context}]`, data);
        }
    };

    // Filter configurations
    const CATEGORIES = [
        { value: 1, name: 'Movies', urlParam: 'categoryIds', urlValue: '1' },
        { value: 2, name: 'TV', urlParam: 'categoryIds', urlValue: '2' },
        { value: 3, name: 'Music', urlParam: 'categoryIds', urlValue: '3' },
        { value: 6, name: 'Anime', urlParam: 'categoryIds', urlValue: '6' },
        { value: 4, name: 'Games', urlParam: 'categoryIds', urlValue: '4' },
        { value: 5, name: 'Apps', urlParam: 'categoryIds', urlValue: '5' },
        { value: 9, name: 'Sport', urlParam: 'categoryIds', urlValue: '9' },
        { value: 11, name: 'Assorted', urlParam: 'categoryIds', urlValue: '11' }
    ];

    const TYPES = [
        { value: 1, name: 'Full Disc', urlParam: 'typeIds', urlValue: '1' },
        { value: 2, name: 'Remux', urlParam: 'typeIds', urlValue: '2' },
        { value: 3, name: 'Encode', urlParam: 'typeIds', urlValue: '3' },
        { value: 4, name: 'WEB-DL', urlParam: 'typeIds', urlValue: '4' },
        { value: 5, name: 'WEBRip', urlParam: 'typeIds', urlValue: '5' },
        { value: 6, name: 'HDTV', urlParam: 'typeIds', urlValue: '6' },
        { value: 7, name: 'FLAC', urlParam: 'typeIds', urlValue: '7' },
        { value: 11, name: 'MP3', urlParam: 'typeIds', urlValue: '11' },
        { value: 12, name: 'Mac', urlParam: 'typeIds', urlValue: '12' },
        { value: 13, name: 'Windows', urlParam: 'typeIds', urlValue: '13' },
        { value: 17, name: 'Console', urlParam: 'typeIds', urlValue: '17' },
        { value: 14, name: 'AudioBooks', urlParam: 'typeIds', urlValue: '14' },
        { value: 15, name: 'Books', urlParam: 'typeIds', urlValue: '15' },
        { value: 16, name: 'Misc', urlParam: 'typeIds', urlValue: '16' }
    ];

    const RESOLUTIONS = [
        { value: 1, name: '4320p', urlParam: 'resolutionIds', urlValue: '1', icon: '🎬' },
        { value: 2, name: '2160p', urlParam: 'resolutionIds', urlValue: '2', icon: '🎬' },
        { value: 3, name: '1080p', urlParam: 'resolutionIds', urlValue: '3', icon: '🎬' },
        { value: 11, name: '1080i', urlParam: 'resolutionIds', urlValue: '11', icon: '🎬' },
        { value: 5, name: '720p', urlParam: 'resolutionIds', urlValue: '5', icon: '🎬' },
        { value: 6, name: '576p', urlParam: 'resolutionIds', urlValue: '6', icon: '🎬' },
        { value: 15, name: '576i', urlParam: 'resolutionIds', urlValue: '15', icon: '🎬' },
        { value: 8, name: '480p', urlParam: 'resolutionIds', urlValue: '8', icon: '🎬' },
        { value: 14, name: '480i', urlParam: 'resolutionIds', urlValue: '14', icon: '🎬' },
        { value: 10, name: 'Other', urlParam: 'resolutionIds', urlValue: '10', icon: '🎬' }
    ];

    const GENRES = [
        { value: 28, name: 'Action', urlParam: 'genreIds', urlValue: '28', icon: '💥' },
        { value: 10759, name: 'Action & Adventure', urlParam: 'genreIds', urlValue: '10759', icon: '🏹' },
        { value: 12, name: 'Adventure', urlParam: 'genreIds', urlValue: '12', icon: '🗺️' },
        { value: 16, name: 'Animation', urlParam: 'genreIds', urlValue: '16', icon: '🎨' },
        { value: 35, name: 'Comedy', urlParam: 'genreIds', urlValue: '35', icon: '😂' },
        { value: 80, name: 'Crime', urlParam: 'genreIds', urlValue: '80', icon: '🚔' },
        { value: 99, name: 'Documentary', urlParam: 'genreIds', urlValue: '99', icon: '📽️' },
        { value: 18, name: 'Drama', urlParam: 'genreIds', urlValue: '18', icon: '🎭' },
        { value: 10751, name: 'Family', urlParam: 'genreIds', urlValue: '10751', icon: '👨‍👩‍👧‍👦' },
        { value: 14, name: 'Fantasy', urlParam: 'genreIds', urlValue: '14', icon: '🦄' },
        { value: 36, name: 'History', urlParam: 'genreIds', urlValue: '36', icon: '📚' },
        { value: 27, name: 'Horror', urlParam: 'genreIds', urlValue: '27', icon: '👻' },
        { value: 10762, name: 'Kids', urlParam: 'genreIds', urlValue: '10762', icon: '🧒' },
        { value: 10402, name: 'Music', urlParam: 'genreIds', urlValue: '10402', icon: '🎵' },
        { value: 9648, name: 'Mystery', urlParam: 'genreIds', urlValue: '9648', icon: '🔍' },
        { value: 10763, name: 'News', urlParam: 'genreIds', urlValue: '10763', icon: '📰' },
        { value: 10764, name: 'Reality', urlParam: 'genreIds', urlValue: '10764', icon: '📺' },
        { value: 10749, name: 'Romance', urlParam: 'genreIds', urlValue: '10749', icon: '💗' },
        { value: 10765, name: 'Sci-Fi & Fantasy', urlParam: 'genreIds', urlValue: '10765', icon: '🚀' },
        { value: 878, name: 'Science Fiction', urlParam: 'genreIds', urlValue: '878', icon: '👽' },
        { value: 10766, name: 'Soap', urlParam: 'genreIds', urlValue: '10766', icon: '📺' },
        { value: 10767, name: 'Talk', urlParam: 'genreIds', urlValue: '10767', icon: '🗣️' },
        { value: 53, name: 'Thriller', urlParam: 'genreIds', urlValue: '53', icon: '😱' },
        { value: 10770, name: 'TV Movie', urlParam: 'genreIds', urlValue: '10770', icon: '🎬' },
        { value: 10752, name: 'War', urlParam: 'genreIds', urlValue: '10752', icon: '⚔️' },
        { value: 10768, name: 'War & Politics', urlParam: 'genreIds', urlValue: '10768', icon: '🏛️' },
        { value: 37, name: 'Western', urlParam: 'genreIds', urlValue: '37', icon: '🤠' }
    ];

    const TAGS = [
        { value: 'internal', name: 'Internal', urlParam: 'internal', icon: '🔒' },
        { value: 'personalRelease', name: 'Personal Release', urlParam: 'personalRelease', icon: '👤' },
        { value: 'trumpable', name: 'Trumpable', urlParam: 'trumpable', icon: '🔄' },
        { value: 'stream', name: 'Stream Optimized', urlParam: 'stream', icon: '🌐' },
        { value: 'sd', name: 'SD Content', urlParam: 'sd', icon: '🎞️' },
        { value: 'highspeed', name: 'High Speeds', urlParam: 'highspeed', icon: '⚡' },
        { value: 'bookmarked', name: 'Bookmarked', urlParam: 'bookmarked', icon: '🏷️' },
        { value: 'wished', name: 'Wished', urlParam: 'wished', icon: '⭐' }
    ];

    const HEALTH = [
        { value: 'alive', name: 'Alive', urlParam: 'alive', icon: '💚', color: '#4CAF50' },
        { value: 'dying', name: 'Dying', urlParam: 'dying', icon: '💛', color: '#FFC107' },
        { value: 'dead', name: 'Dead', urlParam: 'dead', icon: '❤️', color: '#F44336' },
        { value: 'graveyard', name: 'Graveyard', urlParam: 'graveyard', icon: '💔', color: '#795548' }
    ];

    const HISTORY = [
        { value: 'notDownloaded', name: 'Not Downloaded', urlParam: 'notDownloaded', icon: '🆕' },
        { value: 'downloaded', name: 'Downloaded', urlParam: 'downloaded', icon: '☑️' },
        { value: 'seeding', name: 'Seeding', urlParam: 'seeding', icon: '📤' },
        { value: 'leeching', name: 'Leeching', urlParam: 'leeching', icon: '⬇️' },
        { value: 'incomplete', name: 'Incomplete', urlParam: 'incomplete', icon: '❌' }
    ];

    const FEATURES = [
        {
            value: 'resolutionHighlighter',
            name: 'Resolution Highlighter',
            urlParam: 'features',
            urlValue: 'resolutionHighlighter',
            icon: '🎯',
            description: 'Highlight video resolutions with expandable badges'
        }
    ];

    const PRIMARY_LANGUAGE = [
        { value: 'af', name: 'Afrikaans', icon: '🇿🇦', urlParam: 'primaryLanguageNames', urlValue: 'af' },
        { value: 'am', name: 'Amharic', icon: '🇪🇹', urlParam: 'primaryLanguageNames', urlValue: 'am' },
        { value: 'ar', name: 'Arabic', icon: '🇸🇦', urlParam: 'primaryLanguageNames', urlValue: 'ar' },
        { value: 'as', name: 'Assamese', icon: '🇮🇳', urlParam: 'primaryLanguageNames', urlValue: 'as' },
        { value: 'az', name: 'Azerbaijani', icon: '🇦🇿', urlParam: 'primaryLanguageNames', urlValue: 'az' },
        { value: 'bg', name: 'Bulgarian', icon: '🇧🇬', urlParam: 'primaryLanguageNames', urlValue: 'bg' },
        { value: 'bn', name: 'Bengali', icon: '🇧🇩', urlParam: 'primaryLanguageNames', urlValue: 'bn' },
        { value: 'bo', name: 'Tibetan', icon: '🏳️', urlParam: 'primaryLanguageNames', urlValue: 'bo' },
        { value: 'bs', name: 'Bosnian', icon: '🇧🇦', urlParam: 'primaryLanguageNames', urlValue: 'bs' },
        { value: 'ca', name: 'Catalan', icon: '🏴󠁥󠁳󠁣󠁴󠁿', urlParam: 'primaryLanguageNames', urlValue: 'ca' },
        { value: 'cn', name: 'Chinese', icon: '🇨🇳', urlParam: 'primaryLanguageNames', urlValue: 'cn' },
        { value: 'cs', name: 'Czech', icon: '🇨🇿', urlParam: 'primaryLanguageNames', urlValue: 'cs' },
        { value: 'da', name: 'Danish', icon: '🇩🇰', urlParam: 'primaryLanguageNames', urlValue: 'da' },
        { value: 'de', name: 'German', icon: '🇩🇪', urlParam: 'primaryLanguageNames', urlValue: 'de' },
        { value: 'dz', name: 'Dzongkha', icon: '🇧🇹', urlParam: 'primaryLanguageNames', urlValue: 'dz' },
        { value: 'el', name: 'Greek', icon: '🇬🇷', urlParam: 'primaryLanguageNames', urlValue: 'el' },
        { value: 'en', name: 'English', icon: '🇬🇧', urlParam: 'primaryLanguageNames', urlValue: 'en' },
        { value: 'eo', name: 'Esperanto', icon: '🌍', urlParam: 'primaryLanguageNames', urlValue: 'eo' },
        { value: 'es', name: 'Spanish', icon: '🇪🇸', urlParam: 'primaryLanguageNames', urlValue: 'es' },
        { value: 'et', name: 'Estonian', icon: '🇪🇪', urlParam: 'primaryLanguageNames', urlValue: 'et' },
        { value: 'eu', name: 'Basque', icon: '🏴', urlParam: 'primaryLanguageNames', urlValue: 'eu' },
        { value: 'fa', name: 'Persian', icon: '🇮🇷', urlParam: 'primaryLanguageNames', urlValue: 'fa' },
        { value: 'fi', name: 'Finnish', icon: '🇫🇮', urlParam: 'primaryLanguageNames', urlValue: 'fi' },
        { value: 'fr', name: 'French', icon: '🇫🇷', urlParam: 'primaryLanguageNames', urlValue: 'fr' },
        { value: 'ga', name: 'Irish', icon: '🇮🇪', urlParam: 'primaryLanguageNames', urlValue: 'ga' },
        { value: 'gl', name: 'Galician', icon: '🏴', urlParam: 'primaryLanguageNames', urlValue: 'gl' },
        { value: 'gu', name: 'Gujarati', icon: '🇮🇳', urlParam: 'primaryLanguageNames', urlValue: 'gu' },
        { value: 'he', name: 'Hebrew', icon: '🇮🇱', urlParam: 'primaryLanguageNames', urlValue: 'he' },
        { value: 'hi', name: 'Hindi', icon: '🇮🇳', urlParam: 'primaryLanguageNames', urlValue: 'hi' },
        { value: 'hr', name: 'Croatian', icon: '🇭🇷', urlParam: 'primaryLanguageNames', urlValue: 'hr' },
        { value: 'hu', name: 'Hungarian', icon: '🇭🇺', urlParam: 'primaryLanguageNames', urlValue: 'hu' },
        { value: 'hy', name: 'Armenian', icon: '🇦🇲', urlParam: 'primaryLanguageNames', urlValue: 'hy' },
        { value: 'id', name: 'Indonesian', icon: '🇮🇩', urlParam: 'primaryLanguageNames', urlValue: 'id' },
        { value: 'is', name: 'Icelandic', icon: '🇮🇸', urlParam: 'primaryLanguageNames', urlValue: 'is' },
        { value: 'it', name: 'Italian', icon: '🇮🇹', urlParam: 'primaryLanguageNames', urlValue: 'it' },
        { value: 'ja', name: 'Japanese', icon: '🇯🇵', urlParam: 'primaryLanguageNames', urlValue: 'ja' },
        { value: 'ka', name: 'Georgian', icon: '🇬🇪', urlParam: 'primaryLanguageNames', urlValue: 'ka' },
        { value: 'kk', name: 'Kazakh', icon: '🇰🇿', urlParam: 'primaryLanguageNames', urlValue: 'kk' },
        { value: 'km', name: 'Khmer', icon: '🇰🇭', urlParam: 'primaryLanguageNames', urlValue: 'km' },
        { value: 'kn', name: 'Kannada', icon: '🇮🇳', urlParam: 'primaryLanguageNames', urlValue: 'kn' },
        { value: 'ko', name: 'Korean', icon: '🇰🇷', urlParam: 'primaryLanguageNames', urlValue: 'ko' },
        { value: 'ku', name: 'Kurdish', icon: '🏳️', urlParam: 'primaryLanguageNames', urlValue: 'ku' },
        { value: 'ky', name: 'Kyrgyz', icon: '🇰🇬', urlParam: 'primaryLanguageNames', urlValue: 'ky' },
        { value: 'la', name: 'Latin', icon: '🏛️', urlParam: 'primaryLanguageNames', urlValue: 'la' },
        { value: 'lt', name: 'Lithuanian', icon: '🇱🇹', urlParam: 'primaryLanguageNames', urlValue: 'lt' },
        { value: 'lv', name: 'Latvian', icon: '🇱🇻', urlParam: 'primaryLanguageNames', urlValue: 'lv' },
        { value: 'mk', name: 'Macedonian', icon: '🇲🇰', urlParam: 'primaryLanguageNames', urlValue: 'mk' },
        { value: 'ml', name: 'Malayalam', icon: '🇮🇳', urlParam: 'primaryLanguageNames', urlValue: 'ml' },
        { value: 'mn', name: 'Mongolian', icon: '🇲🇳', urlParam: 'primaryLanguageNames', urlValue: 'mn' },
        { value: 'mr', name: 'Marathi', icon: '🇮🇳', urlParam: 'primaryLanguageNames', urlValue: 'mr' },
        { value: 'ms', name: 'Malay', icon: '🇲🇾', urlParam: 'primaryLanguageNames', urlValue: 'ms' },
        { value: 'mt', name: 'Maltese', icon: '🇲🇹', urlParam: 'primaryLanguageNames', urlValue: 'mt' },
        { value: 'nb', name: 'Norwegian Bokmål', icon: '🇳🇴', urlParam: 'primaryLanguageNames', urlValue: 'nb' },
        { value: 'ne', name: 'Nepali', icon: '🇳🇵', urlParam: 'primaryLanguageNames', urlValue: 'ne' },
        { value: 'nl', name: 'Dutch', icon: '🇳🇱', urlParam: 'primaryLanguageNames', urlValue: 'nl' },
        { value: 'no', name: 'Norwegian', icon: '🇳🇴', urlParam: 'primaryLanguageNames', urlValue: 'no' },
        { value: 'pa', name: 'Punjabi', icon: '🇮🇳', urlParam: 'primaryLanguageNames', urlValue: 'pa' },
        { value: 'pl', name: 'Polish', icon: '🇵🇱', urlParam: 'primaryLanguageNames', urlValue: 'pl' },
        { value: 'pt', name: 'Portuguese', icon: '🇵🇹', urlParam: 'primaryLanguageNames', urlValue: 'pt' },
        { value: 'ro', name: 'Romanian', icon: '🇷🇴', urlParam: 'primaryLanguageNames', urlValue: 'ro' },
        { value: 'ru', name: 'Russian', icon: '🇷🇺', urlParam: 'primaryLanguageNames', urlValue: 'ru' },
        { value: 'sk', name: 'Slovak', icon: '🇸🇰', urlParam: 'primaryLanguageNames', urlValue: 'sk' },
        { value: 'sl', name: 'Slovenian', icon: '🇸🇮', urlParam: 'primaryLanguageNames', urlValue: 'sl' },
        { value: 'sq', name: 'Albanian', icon: '🇦🇱', urlParam: 'primaryLanguageNames', urlValue: 'sq' },
        { value: 'sr', name: 'Serbian', icon: '🇷🇸', urlParam: 'primaryLanguageNames', urlValue: 'sr' },
        { value: 'sv', name: 'Swedish', icon: '🇸🇪', urlParam: 'primaryLanguageNames', urlValue: 'sv' },
        { value: 'ta', name: 'Tamil', icon: '🇮🇳', urlParam: 'primaryLanguageNames', urlValue: 'ta' },
        { value: 'te', name: 'Telugu', icon: '🇮🇳', urlParam: 'primaryLanguageNames', urlValue: 'te' },
        { value: 'tg', name: 'Tajik', icon: '🇹🇯', urlParam: 'primaryLanguageNames', urlValue: 'tg' },
        { value: 'th', name: 'Thai', icon: '🇹🇭', urlParam: 'primaryLanguageNames', urlValue: 'th' },
        { value: 'tl', name: 'Tagalog', icon: '🇵🇭', urlParam: 'primaryLanguageNames', urlValue: 'tl' },
        { value: 'tr', name: 'Turkish', icon: '🇹🇷', urlParam: 'primaryLanguageNames', urlValue: 'tr' },
        { value: 'uk', name: 'Ukrainian', icon: '🇺🇦', urlParam: 'primaryLanguageNames', urlValue: 'uk' },
        { value: 'ur', name: 'Urdu', icon: '🇵🇰', urlParam: 'primaryLanguageNames', urlValue: 'ur' },
        { value: 'vi', name: 'Vietnamese', icon: '🇻🇳', urlParam: 'primaryLanguageNames', urlValue: 'vi' },
        { value: 'zh', name: 'Chinese', icon: '🇨🇳', urlParam: 'primaryLanguageNames', urlValue: 'zh' }
    ];

    const SORT_OPTIONS = [
        { id: 'created_at', label: 'Upload Date', icon: '📅' },
        { id: 'size', label: 'Size', icon: '💾' },
        { id: 'seeders', label: 'Seeders', icon: '⬆️' },
        { id: 'leechers', label: 'Leechers', icon: '⬇️' },
        { id: 'name', label: 'Name', icon: '📝' },
        { id: 'times_completed', label: 'Times Completed', icon: '✅' }
    ];

    const BUFF = {
        FREELEECH: [
            { value: 0, name: '0% Freeleech', urlParam: 'free', urlValue: '0', icon: '0️⃣' },
            { value: 25, name: '25% Freeleech', urlParam: 'free', urlValue: '25', icon: '2️⃣' },
            { value: 50, name: '50% Freeleech', urlParam: 'free', urlValue: '50', icon: '5️⃣' },
            { value: 75, name: '75% Freeleech', urlParam: 'free', urlValue: '75', icon: '7️⃣' },
            { value: 100, name: '100% Freeleech', urlParam: 'free', urlValue: '100', icon: '💯' }
        ],
        SPECIAL: [
            { value: 'doubleup', name: 'Double Upload', urlParam: 'doubleup', icon: '2️⃣' },
            { value: 'featured', name: 'Featured', urlParam: 'featured', icon: '⭐' },
            { value: 'refundable', name: 'Refundable', urlParam: 'refundable', icon: '💰' }
        ]
    };

    // Visual Organization Layer - Groups existing filters into visual categories
    const FILTER_GROUPS = {
        'Content Filters': {
            id: 'content',
            icon: '📁',
            description: 'Basic content type and format filters',
            sections: [
                {
                    id: 'media',
                    name: 'Categories',
                    icon: '🎬',
                    description: 'Content categories',
                    filterKey: 'categoryIds',
                    filterArray: 'CATEGORIES', // Reference to existing CATEGORIES array
                    expanded: true // Default expanded state
                },
                {
                    id: 'types',
                    name: 'Types',
                    icon: '📼',
                    description: 'Content format types',
                    filterKey: 'typeIds',
                    filterArray: 'TYPES', // Reference to existing TYPES array
                    expanded: true
                },
                {
                    id: 'resolution',
                    name: 'Resolution',
                    icon: '📏',
                    description: 'Video resolutions',
                    filterKey: 'resolutionIds',
                    filterArray: 'RESOLUTIONS', // Reference to existing RESOLUTIONS array
                    expanded: true
                }
            ]
        },
        'Metadata Filters': {
            id: 'metadata',
            icon: '🏷️',
            description: 'Additional content information filters',
            sections: [
                {
                    id: 'genres',
                    name: 'Genres',
                    icon: '🎭',
                    description: 'Content genres',
                    filterKey: 'genreIds',
                    filterArray: 'GENRES',
                    expanded: false
                },
                {
                    id: 'tags',
                    name: 'Tags',
                    icon: '🏷️',
                    description: 'Special tags',
                    filterKey: 'tags',
                    filterArray: 'TAGS',
                    expanded: false
                },
                {
                    id: 'primaryLanguage',
                    name: 'Primary Language',
                    icon: '🌐',
                    description: 'Filter by content language',
                    filterKey: 'primaryLanguageNames',
                    filterArray: 'PRIMARY_LANGUAGE',
                    expanded: false
                }
            ]
        },
        'Status Filters': {
            id: 'status',
            icon: '📊',
            description: 'Content status and health filters',
            sections: [
                {
                    id: 'health',
                    name: 'Health',
                    icon: '❤️',
                    description: 'Torrent health status',
                    filterKey: 'health',
                    filterArray: 'HEALTH',
                    expanded: false
                },
                {
                    id: 'history',
                    name: 'History',
                    icon: '📚',
                    description: 'Download history status',
                    filterKey: 'history',
                    filterArray: 'HISTORY',
                    expanded: false
                },
                {
                    id: 'freeleech',
                    name: 'Freeleech',
                    icon: '🎁',
                    description: 'Freeleech status',
                    filterKey: 'free',
                    filterArray: 'BUFF.FREELEECH',
                    expanded: false
                },
                {
                    id: 'special',
                    name: 'Special',
                    icon: '⭐',
                    description: 'Special status',
                    filterKey: 'special',
                    filterArray: 'BUFF.SPECIAL',
                    expanded: false
                }
            ]
        },
        'Feature Settings': {
            id: 'features',
            icon: '⚙️',
            description: 'Enable or disable userscript features',
            sections: [
                {
                    id: 'displayFeatures',
                    name: 'Display Features',
                    icon: '🎨',
                    description: 'Visual enhancement features',
                    filterKey: 'features',
                    filterArray: 'FEATURES',
                    expanded: true
                }
            ]
        }
    };

    const COMMON_FILTER_SETS = {
        'TV Shows 1080p': {
            icon: '📺',
            arrayFilters: {
                categoryIds: ['2'],
                resolutionIds: ['3'],
                typeIds: ['2', '3', '4']
            },
            booleanFilters: ['alive'],
            timestamp: new Date().toISOString()
        },
        'Movies 1080p': {
            icon: '🎬',
            arrayFilters: {
                categoryIds: ['1'],
                resolutionIds: ['3'],
                typeIds: ['2', '3', '4']
            },
            booleanFilters: ['alive'],
            timestamp: new Date().toISOString()
        },
        'TV Shows 2160p': {
            icon: '📺',
            arrayFilters: {
                categoryIds: ['2'],
                resolutionIds: ['2'],
                typeIds: ['2', '3', '4']
            },
            booleanFilters: ['alive'],
            timestamp: new Date().toISOString()
        },
        'Movies 2160p': {
            icon: '🎬',
            arrayFilters: {
                categoryIds: ['1'],
                resolutionIds: ['2'],
                typeIds: ['2', '3', '4']
            },
            booleanFilters: ['alive'],
            timestamp: new Date().toISOString()
        },
        'Full Disc Content': {
            icon: '💿',
            arrayFilters: {
                categoryIds: ['1', '2'],
                typeIds: ['1']
            },
            booleanFilters: ['alive'],
            timestamp: new Date().toISOString()
        },
        'Anime HD': {
            icon: '🍜',
            arrayFilters: {
                categoryIds: ['6'],
                resolutionIds: ['2', '3'],
                typeIds: ['2', '3', '4']
            },
            booleanFilters: ['alive'],
            timestamp: new Date().toISOString()
        },
        'FLAC Music': {
            icon: '🎵',
            arrayFilters: {
                categoryIds: ['3'],
                typeIds: ['7']
            },
            booleanFilters: ['alive'],
            timestamp: new Date().toISOString()
        }
    };

    const STYLES = `
.filter-container {
    position: fixed;
    top: 50%;
    left: 49%;
    transform: translate(-50%,-50%);
    width: 1100px;
    height: 650px;
    background-color: #ffffff;
    display: flex;
    z-index: 9999;
    border-radius: 12px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.12);
    transition: opacity .3s ease;
}

.filter-modal {
    display: flex;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #f8fafc;
}

.language-code {
    font-size: 12px;
    color: #6b7280;
}

.filter-option .filter-label {
    display: flex;
    align-items: center;
    gap: 8px;
}

.filter-option .filter-icon {
    font-size: 16px;
}

.confirm-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.12);
    z-index: 10002;
    width: 90%;
    max-width: 400px;
    padding: 24px;
}

.confirm-modal-header {
    margin-bottom: 16px;
}

.confirm-modal-title {
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 8px;
}

.confirm-modal-message {
    color: #6b7280;
    font-size: 14px;
    line-height: 1.5;
}

.confirm-modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid #e5e7eb;
}

.confirm-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.4);
    z-index: 10001;
    backdrop-filter: blur(2px);
}

.filter-details-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.12);
    z-index: 10001;
    width: 90%;
    max-width: 600px;
    padding: 24px;
}

.filter-details-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid #e5e7eb;
}

.filter-details-title {
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
}

.filter-details-content {
    max-height: 60vh;
    overflow-y: auto;
}

.filter-details-group {
    margin-bottom: 16px;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    border: 1px solid #e5e7eb;
    padding: 10px;
}

.filter-details-group-header {
    font-weight: 500;
    color: #4b5563;
    margin-bottom: 15px;
    display: flex;
}

.filter-details-filters {
    display: block !important;
}

.filter-count-link {
    color: #4f46e5;
    text-decoration: none;
    font-weight: 500;
    cursor: pointer;
}

.filter-count-link:hover {
    color: #4338ca;
    text-decoration: underline;
}

.filter-sidebar {
    width: 280px;
    min-width: 280px;
    height: 100%;
    background: #ffffff;
    border-right: 1px solid #e5e7eb;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    padding: 20px;
}

.filter-search {
    margin-bottom: 24px;
    position: relative;
}

.filter-search input {
    width: 100%;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 14px;
    color: #1f2937;
    background: #f9fafb;
    transition: all .2s ease;
    padding: 10px 16px 10px 40px;
}

.filter-search input:focus {
    outline: none;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
    border-color: #6366f1;
}

.filter-search::before {
    content: '';
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%236B7280" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>') no-repeat;
    opacity: 0.5;
}

.filter-notification {
    position: fixed;
    bottom: 24px;
    right: 24px;
    border-radius: 8px;
    background: #1f2937;
    color: white;
    font-size: 14px;
    z-index: 10000;
    animation: notification-slide-in .3s ease;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    padding: 12px 24px;
}

.filter-notification.success {
    background: #059669;
}

.filter-notification.error {
    background: #dc2626;
}

.filter-notification.fade-out {
    animation: notification-slide-out .3s ease forwards;
}

to {
    transform: translateX(100%);
    opacity: 0;
    stroke-dashoffset: 0;
}

.filter-groups {
    margin-bottom: 20px;
}

.category-button, .group-button {
    display: flex;
    align-items: center;
    width: 100%;
    text-align: left;
    border: none;
    background: none;
    cursor: pointer;
    border-radius: 8px;
    color: #4b5563;
    font-weight: 500;
    transition: all .2s ease;
    position: relative;
    margin: 2px 0;
    padding: 12px 16px;
}

.group-button::before {
    content: '';
    position: absolute;
    left: -34px;
    top: 53%;
    transform: translateY(-50%);
    width: 25px;
    height: 4px;
    border-radius: 20px;
    transition: all .2s ease;
}

.group-button[data-group-id="content"]::before {
    background-color: #3b82f6;
    box-shadow: 0 0 0 2px #e0f2fe;
}

.group-button[data-group-id="content"]:hover::before, .group-button[data-group-id="content"].active::before {
    box-shadow: 0 0 0 2px #bae6fd;
}

.group-button[data-group-id="metadata"]::before {
    background-color: #22c55e;
    box-shadow: 0 0 0 2px #dcfce7;
}

.group-button[data-group-id="metadata"]:hover::before, .group-button[data-group-id="metadata"].active::before {
    box-shadow: 0 0 0 2px #bbf7d0;
}

.group-button[data-group-id="status"]::before {
    background-color: #ef4444;
    box-shadow: 0 0 0 2px #fee2e2;
}

.group-button[data-group-id="status"]:hover::before, .group-button[data-group-id="status"].active::before {
    box-shadow: 0 0 0 2px #fecaca;
}

.category-button:hover, .group-button:hover {
    background-color: #f3f4f6;
    color: #1f2937;
}

.category-button.active, .group-button.active {
    background-color: #eef2ff;
    color: #4f46e5;
}

.category-button .icon, .group-icon {
    margin-right: 12px;
    font-size: 18px;
}

.filter-actions {
    margin-top: auto;
    border-top: 1px solid #e5e7eb;
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: -20px;
    padding: 16px;
}

.action-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    border: 1px solid #e5e7eb;
    background: #ffffff;
    cursor: pointer;
    color: #4b5563;
    border-radius: 8px;
    font-weight: 500;
    font-size: 14px;
    transition: all .2s ease;
    text-align: center;
    padding: 10px 16px;
}

.action-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
}

.action-button:focus {
    outline: 2px solid #e0e7ff;
    outline-offset: 2px;
}

.action-button:focus:not(:focus-visible) {
    outline: none;
}

#selectAllBtn {
    background: #fff;
    color: #4b5563;
    border: 1px solid #e5e7eb;
}

#selectAllBtn:active {
    background: #3730a3;
    transform: translateY(1px);
}

#clearAllBtn {
    background: #ffffff;
    color: #4b5563;
    border: 1px solid #e5e7eb;
}

#selectAllBtn::before {
    content: '✓';
    margin-right: 8px;
    font-size: 14px;
}

#clearAllBtn::before {
    content: '×';
    margin-right: 8px;
    font-size: 16px;
}

.action-button:hover {
    background: #f3f4f6;
    color: #1f2937;
}

.filter-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    background: #ffffff;
}

.active-filters {
    background: #ffffff;
    border-bottom: 1px solid #e5e7eb;
    flex-shrink: 0;
}

.active-filters-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f8fafc;
    height: 60.1px;
    padding: 16px 24px;
}

.active-filters-summary {
    display: flex;
    align-items: center;
    gap: 16px;
}

.filter-count {
    color: #6b7280;
    font-size: 14px;
}

.filter-count.has-filters {
    color: #1f2937;
    font-weight: 600;
}

.toggle-filters {
    background: none;
    border: none;
    color: #4f46e5;
    font-size: 14px;
    cursor: pointer;
    border-radius: 6px;
    font-weight: 500;
    transition: all .2s ease;
    padding: 6px 12px;
}

.toggle-filters:hover {
    background: #eef2ff;
}

.active-filters-content {
    border-top: 1px solid #e5e7eb;
    max-height: 200px;
    overflow-y: auto;
    background: #ffffff;
    padding: 16px 24px;
}

.active-filters-wrapper {
    display: block;
}

.filter-tag[data-group="content"] {
    background-color: #f0f9ff;
    border-color: #e0f2fe;
}

.filter-tag[data-group="metadata"] {
    background-color: #f0fdf4;
    border-color: #dcfce7;
}

.filter-tag[data-group="status"] {
    background-color: #fef2f2;
    border-color: #fee2e2;
}

.filter-tag[data-group="content"]:hover {
    background-color: #e0f2fe;
    border-color: #bae6fd;
}

.filter-tag[data-group="metadata"]:hover {
    background-color: #dcfce7;
    border-color: #bbf7d0;
}

.filter-tag[data-group="status"]:hover {
    background-color: #fee2e2;
    border-color: #fecaca;
}

.filter-tag:hover {
    background: #e5e7eb;
}

.remove-filter {
    border: none;
    background: none;
    cursor: pointer;
    margin-left: 6px;
    color: #6b7280;
    transition: color .2s ease;
    display: flex;
    align-items: center;
    padding: 0 4px;
}

.filter-tag::before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin-right: 8px;
}

.filter-tag[data-group="content"]::before {
    background-color: #3b82f6;
}

.filter-tag[data-group="metadata"]::before {
    background-color: #22c55e;
}

.filter-tag[data-group="status"]::before {
    background-color: #ef4444;
}

.save-modal {
    min-width: 500px !important;
    max-width: 500px !important;
    height: 600px;
    display: flex;
    flex-direction: column;
}

.save-modal-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 0 !important;
}

.save-modal-content h3 {
    font-size: 20px;
    color: #1f2937;
    border-bottom: 1px solid #e5e7eb;
    margin: 0;
    padding: 5px;
}

.save-modal, .import-modal {
    position: fixed;
    top: 50%;
    left: 53%;
    transform: translate(-50%,-50%);
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.12);
    z-index: 10000;
    min-width: 400px;
    padding: 24px;
}

.save-modal-content, .import-modal-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.saved-filters-list {
    max-height: 300px;
    overflow-y: auto;
    overflow: scroll;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    margin-bottom: -16px;
    padding: 8px;
}

.saved-filter-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #e5e7eb;
    transition: all .2s ease;
    padding: 16px;
}

.saved-filter-info {
    flex: 1;
}

.saved-filter-name {
    font-weight: 500;
    color: #1f2937;
    font-size: 15px;
    margin-bottom: 6px;
}

.saved-filter-meta {
    font-size: 13px;
    color: #6b7280;
}

.no-saved-filters {
    text-align: center;
    color: #6b7280;
    font-style: italic;
    padding: 24px;
}

.save-new-filter {
    display: flex;
    gap: 8px;
    margin-top: 0;
    margin-bottom: 5px;
}

.save-new-filter input {
    font-size: 14px;
    flex: 1;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    transition: all .2s ease;
    padding: 10px 16px;
}

.save-new-filter input:focus {
    box-shadow: 0 0 0 3px rgba(79,70,229,0.1);
    outline: none;
    border-color: #4f46e5;
}

.save-modal-footer {
    border-top: 1px solid #e5e7eb;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    margin-top: auto;
    flex-shrink: 0;
    gap: 8px;
    padding: 16px;
}

#importCode {
    width: 100%;
    min-height: 100px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-family: monospace;
    resize: vertical;
    padding: 8px;
}

#cancelSaveBtn {
    width: 100%;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all .2s ease;
    border: 1px solid #e5e7eb;
    background: #fff;
    color: #4b5563;
    padding: 8px 16px;
}

.import-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
}

.modal-button.secondary {
    border: 1px solid #e5e7eb;
    background: #f3f4f6;
    color: #4b5563;
    border-color: #e5e7eb;
}

.modal-button.secondary:hover {
    background: #e5e7eb;
    color: #1f2937;
}

.collapse-button {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 32px;
    height: 32px;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    color: #6b7280;
    font-size: 18px;
    cursor: pointer;
    transition: all .2s ease;
    position: relative;
    padding: 0;
}

.collapse-button::before {
    content: '';
    display: block;
    width: 10px;
    height: 10px;
    border-right: 2px solid currentColor;
    border-bottom: 2px solid currentColor;
    transform: rotate(45deg) translateY(-2px);
    transition: transform .2s ease;
}

.collapse-button.expanded::before {
    transform: rotate(-135deg) translateY(-2px);
}

.collapse-button:hover {
    background: #f9fafb;
    color: #4b5563;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    border-color: #d1d5db;
}

.collapse-button:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(79,70,229,0.1);
    border-color: #4f46e5;
}

.collapse-button span {
    display: none;
}

.filter-sections {
    flex: 1;
    overflow-y: auto;
    background: #f8fafc;
    padding: 24px;
}

.filter-section {
    margin-bottom: 20px;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    border: 1px solid #e5e7eb;
    transition: all .2s ease;
}

.filter-section:hover {
    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    border-bottom: 1px solid transparent;
    transition: all .2s ease;
    user-select: none;
    padding: 16px 20px;
}

.section-title {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
}

.section-icon {
    font-size: 18px;
}

.section-count {
    font-size: 13px;
    color: #6b7280;
    margin-left: 8px;
}

.section-content {
    display: grid;
    grid-template-columns: repeat(3,1fr);
    gap: 12px;
    background: #ffffff;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
    transition: all .3s ease;
    padding: 16px 20px;
}

.section-content.hidden {
    display: block !important;
    max-height: 0;
    overflow: hidden;
    padding-top: 0;
    padding-bottom: 0;
    border-bottom: none;
    opacity: 0;
}

.section-content:not(.hidden) {
    max-height: 2000px;
    opacity: 1;
}

.filter-option {
    display: flex;
    align-items: center;
    cursor: pointer;
    border-radius: 6px;
    transition: all .2s ease;
    gap: 12px;
    padding: 8px 12px;
}

.filter-option:hover {
    background: #f3f4f6;
}

.filter-option input[type="checkbox"] {
    width: 16px;
    height: 16px;
    border-radius: 4px;
    border: 2px solid #d1d5db;
    transition: all .2s ease;
    flex-shrink: 0;
}

.filter-option input[type="checkbox"]:checked {
    background-color: #4f46e5;
    border-color: #4f46e5;
}

.filter-label {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #4b5563;
    font-size: 14px;
    flex: 1;
}

.filter-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    font-size: 16px;
}

.filter-option[data-health="alive"] .filter-icon {
    color: #4caf50;
}

.filter-option[data-health="dying"] .filter-icon {
    color: #ffc107;
}

.filter-option[data-health="dead"] .filter-icon {
    color: #f44336;
}

.filter-option[data-health="graveyard"] .filter-icon {
    color: #795548;
}

.filter-tag {
    display: inline-flex;
    align-items: center;
    border-radius: 4px;
    font-size: 12px;
    color: #6b7280;
    background: #f3f4f6;
    margin-left: auto;
    margin-bottom: 3px;
    transition: all .2s ease;
    border: 1px solid transparent;
    padding: 2px 6px;
}

.filter-count-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    border-radius: 10px;
    background: #e0e7ff;
    color: #4f46e5;
    font-size: 12px;
    font-weight: 500;
    margin-left: auto;
    padding: 0 6px;
}

.modal-footer {
    border-top: 1px solid #e5e7eb;
    background: #ffffff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
}

.modal-button {
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all .2s ease;
    border: 1px solid transparent;
    padding: 8px 16px;
}

.modal-button.primary {
    background: #4f46e5;
    color: white;
    border-color: #4338ca;
}

.modal-button.cancel {
    background: white;
    color: #4b5563;
    border-color: #e5e7eb;
}

.modal-button.save {
    background: #4f46e5;
    border: 1px solid #4f46e5;
    color: #ffffff;
}

.modal-button.loading {
    position: relative;
    pointer-events: none;
    opacity: 0.7;
}

.modal-button.loading:after {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    top: 50%;
    left: 50%;
    border: 2px solid transparent;
    border-top-color: currentColor;
    border-right-color: currentColor;
    border-radius: 50%;
    animation: button-loading .6s linear infinite;
    margin: -8px 0 0 -8px;
}

.hidden {
    display: none !important;
}

.clear-all-button {
    border: none;
    background: none;
    cursor: pointer;
    color: #6b7280;
    font-size: 13px;
    border-radius: 6px;
    transition: all .2s ease;
    padding: 6px 12px;
}

.clear-all-button:hover {
    background: #fee2e2;
    color: #ef4444;
}

::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 4px;
    border: 2px solid #f1f1f1;
}

.filter-prompt {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    background: #000000e3;
    border-radius: 12px;
    font-size: 24px;
    letter-spacing: .5px;
    font-weight: 600;
    z-index: 10000;
    transition: all .3s ease;
    opacity: 0;
    color: #fff;
    text-shadow: 0 0 10px rgba(255,255,255,0.3);
    box-shadow: 0 0 20px rgba(0,0,0,0.5);
    padding: 20px 32px;
}

.filter-prompt.visible {
    opacity: 1;
    transform: translate(-50%,-50%) scale(1);
}

.filter-prompt.hidden {
    display: none;
    transform: translate(-50%,-50%) scale(0.95);
}

.filter-set-tabs {
    display: flex;
    border-bottom: 1px solid #e5e7eb;
    margin-bottom: 0;
    background: #f8fafc;
    gap: 8px;
    flex-shrink: 0;
}

.filter-set-tab {
    border: none;
    background: none;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    color: #6b7280;
    position: relative;
    transition: all .2s ease;
    border-radius: 8px 8px 0 0;
    width: 100% !important;
    padding: 12px 24px;
}

.filter-set-tab:hover {
    color: #4f46e5;
    background: #f3f4f6;
}

.filter-set-tab.active {
    color: #4f46e5;
    background: #eef2ff;
}

.filter-set-tab.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background: #4f46e5;
}

.filter-set-content {
    flex: 1;
    display: none;
    overflow-y: auto;
    padding: 16px;
}

.filter-set-content.active {
    display: flex;
    flex-direction: column;
}

.common-filter-item {
    position: relative;
    display: block;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    transition: all .2s ease;
    margin-bottom: 10px;
    padding: 16px;
}

.common-filter-item:hover {
    background: #f8fafc;
    box-shadow: 0 4px 6px -1px rgb(7970229/0.1);
    border-color: #4f46e5;
}

.common-filter-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.common-filter-name {
    color: #1f2937;
    margin-bottom: 4px;
    font-weight: 600;
    font-size: 15px;
    width: 230px;
}

.common-filter-description {
    color: #6b7280;
    font-size: 13px;
    line-height: 1.5;
}

.common-filter-actions {
    position: absolute;
    top: 16px;
    right: 16px;
    margin-top: 0;
    z-index: 1;
}

.common-filter-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
    width: 260px;
}

.common-filter-icon {
    font-size: 20px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #eef2ff;
    border-radius: 8px;
}

.common-filter-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 8px;
}

.common-filter-tag {
    font-size: 12px;
    background: #f3f4f6;
    color: #4b5563;
    border-radius: 4px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
}

.load-common-filter-btn {
    background: #eef2ff;
    color: #4f46e5;
    border: 1px solid #4f46e5;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    transition: all .2s ease;
    white-space: nowrap;
    cursor: pointer;
    padding: 6px 12px;
}

.load-common-filter-btn:hover {
    background: #4f46e5;
    color: #ffffff;
}

.api-input-group {
    align-items: center;
    margin-bottom: 16px;
}

.api-input {
    flex: 1;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-size: 14px;
    outline: none;
    transition: border-color .2s;
    width: 270px !important;
    padding: 8px 43px 8px 15px;
}

.api-input:focus {
    box-shadow: 0 0 0 2px rgba(79,70,229,0.1);
    border-color: #4f46e5;
}

.api-toggle-visibility {
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    margin-left: -40px;
    padding: 4px;
}

.api-toggle-visibility:hover {
    color: #374151;
}

.api-verify-button {
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all .2s;
    margin-left: 8px;
    padding: 8px 12px;
}

.api-verify-button.verify {
    background: #4f46e5;
    color: white;
}

.api-verify-button.verified {
    background: #22c55e;
    color: white;
}

.api-verify-button.try-again {
    background: #eab308;
    color: white;
}

.api-verify-button.try-again:hover {
    background: #d97706;
}

.api-verify-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.api-status {
    font-size: 13px;
    margin-top: 8px;
}

.api-status.success {
    color: #22c55e;
}

.api-status.pending {
    color: #6b7280;
}

.api-config-container {
    width: max-content;
}

.api-sidepanel {
    position: absolute;
    top: 0;
    right: -60px;
    height: 100%;
    background: #ffffff;
    box-shadow: 2px 0 5px rgba(0,0,0,0.05);
    display: flex;
    flex-direction: column;
    transition: all .2s ease;
    z-index: 9998;
    border-radius: 0 12px 12px 0;
}

.api-sidepanel.compact {
    width: 60px;
    border-left: 1px solid #e5e7eb;
}

.api-status-indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    position: relative;
    margin: 25px auto;
}

.api-status-indicator::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    animation: pulse 2s infinite;
}

.api-status-indicator.connected {
    background: #22c55e;
}

.api-status-indicator.connected::after {
    background: rgba(34,197,94,0.4);
}

.api-status-indicator.disconnected {
    background: #ef4444;
}

.api-status-indicator.disconnected::after {
    background: rgba(239,68,68,0.4);
}

.api-expand-button {
    position: absolute;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    background: #ffffff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all .2s ease;
    z-index: 9999;
    padding: 0;
}

.api-expand-button svg {
    width: 16px;
    height: 16px;
    transform: rotate(180deg);
    transition: transform .3s ease;
}

.api-sidepanel.expanded .api-expand-button svg {
    transform: rotate(0deg);
}

.api-expanded-panel {
    position: absolute;
    top: 0;
    right: -20px;
    width: var(--panel-width, 450px);
    height: 100%;
    background: #ffffff;
    box-shadow: -2px 0 10px rgba(0,0,0,0.1);
    transition: width 0.3s ease-in-out;
    visibility: hidden;
    opacity: 0;
    display: flex;
    flex-direction: column;
}

.api-sidepanel.expanded .api-expanded-panel {
    right: 60px;
    visibility: visible;
    opacity: 1;
}

.api-tabs {
    display: flex;
    border-bottom: 1px solid #e5e7eb;
    background: #f8fafc;
    padding: 0 16px;
}

.api-tab {
    color: #6b7280;
    font-weight: 500;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: all .2s ease;
    padding: 16px 24px;
}

.api-tab.active {
    color: #4f46e5;
    border-bottom-color: #4f46e5;
}

.api-tab-content {
    display: none;
    height: calc(100%-49px);
    overflow: hidden;
    flex-direction: column;
}

.api-tab-content.active {
    display: flex;
}

.api-not-connected {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
    color: #6b7280;
    gap: 16px;
    padding: 24px;
}

.api-warning-icon {
    font-size: 48px;
}

.api-not-connected h3 {
    color: #1f2937;
    font-size: 18px;
    font-weight: 600;
    margin: 0;
}

.api-not-connected p {
    color: #6b7280;
    font-size: 14px;
    line-height: 1.5;
    max-width: 300px;
    margin: 0;
}

/* Tab-specific panel widths */
.api-expanded-panel[data-active-tab="results"] {
    --panel-width: 900px;
}

.api-expanded-panel[data-active-tab="stats"],
.api-expanded-panel[data-active-tab="profile"] {
    --panel-width: 450px;
}

/* Responsive breakpoints */
@media (max-width: 1200px) {
    .api-expanded-panel[data-active-tab="results"] {
        --panel-width: 700px;
    }
    .api-results-list {
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    }
}



100% {
    transform: scale(1);
    opacity: 0;
}

50% {
    transform: scale(1.5);
    opacity: 0.5;
}

.api-sidepanel .user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid #e5e7eb;
    transition: all .2s ease;
    margin: 16px auto;
}

.api-results-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #6b7280;
    text-align: center;
    padding: 24px;
}

.api-sidepanel .user-avatar:hover {
    transform: scale(1.05);
    border-color: #4f46e5;
}

.api-sidepanel .user-avatar.disconnected {
    opacity: 0.5;
    cursor: not-allowed;
}

.api-results-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 24px;
    border-bottom: 1px solid #e5e7eb;
    background: #ffffff;
    position: sticky;
    top: 0;
    z-index: 10;
}

/* Left section with total count */
.results-count {
    flex: 1;
    min-width: 200px;
    align-items: baseline;
}

.results-count h3 {
    margin: 0;
    font-size: 1.4rem;
    color: #6b7280;
    font-weight: 500;
}

.sort-info {
  font-size: 1.2rem;
  color: #bbb;
}

.results-actions {
    justify-content: flex-end;
    flex: 1;
    min-width: 200px;
}

.pagination-controls {
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: center;
    flex: 2;
}

.pagination-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: 1px solid #e5e7eb;
    background: #ffffff;
    border-radius: 6px;
    color: #4b5563;
    cursor: pointer;
    transition: all 0.2s ease;
}

.pagination-button:hover:not(:disabled) {
    background: #f9fafb;
    border-color: #d1d5db;
    color: #1f2937;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.pagination-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.pagination-numbers {
    display: flex;
    align-items: center;
    gap: 4px;
}

.pagination-number {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 32px;
    height: 32px;
    border: 1px solid #e5e7eb;
    background: #ffffff;
    border-radius: 6px;
    color: #4b5563;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    padding: 0 8px;
}

.pagination-number:hover:not(:disabled) {
    background: #f9fafb;
    border-color: #d1d5db;
    color: #1f2937;
}

.pagination-number.active {
    background: #4f46e5;
    border-color: #4338ca;
    color: #ffffff;
}

.pagination-ellipsis {
    color: #6b7280;
    padding: 0 4px;
}

.sort-button {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    color: #4b5563;
    font-size: 1.1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.sort-button:hover {
    background: #f9fafb;
    border-color: #d1d5db;
    color: #1f2937;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.sort-button svg {
    width: 16px;
    height: 16px;
}

.api-results-list {
    overflow-y: auto;
    max-height: calc(100vh-200px);
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 24px;
    padding: 24px;
    background: #2a60a50f;
}

.result-main {
    min-width: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
}

.result-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
    flex-direction: column;
    gap: 8px;
}

.result-quick-stats {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
    -ms-overflow-style: none;
    white-space: nowrap;
    position: relative;
    padding-bottom: 4px;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    mask-image: linear-gradient(to right,
        black calc(100% - 24px),
        transparent 100%
    );
    -webkit-mask-image: linear-gradient(to right,
        black calc(100% - 24px),
        transparent 100%
    );
}

.result-quick-stats::-webkit-scrollbar {
    height: 4px;
    background: transparent;
}

.result-quick-stats::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
}

.result-quick-stats::-webkit-scrollbar-track {
    background: transparent;
}

.result-quick-stats:not(:hover)::-webkit-scrollbar-thumb {
    background: transparent;
}

.quick-stat {
    flex-shrink: 0;
    font-weight: 500;
    white-space: nowrap;
    font-size: 0.9rem;
    padding: 4px 8px;
    border-radius: 4px;
    transition: transform 0.2s ease;
}

.quick-stat.size {
    background: #eff6ff;
    color: #2563eb;
    padding: 4px 8px;
    border-radius: 4px;
    font-weight: 500;
    font-size: 0.9rem;
    display: inline-flex;
    align-items: center;
    gap: 4px;
}

.quick-stat.size:hover {
    background: #dbeafe;
}

/* Health Status */
.quick-stat.health-alive {
    color: #059669;
    outline: 1px solid #ecfdf5;
    box-shadow: 2px 2px #eee;
}

.quick-stat.health-dying {
    color: #d97706;
    outline: 1px solid #fef3c7;
    box-shadow: 2px 2px #eee;
}

.quick-stat.health-dead {
    color: #dc2626;
    outline: 1px solid #fee2e2;
    box-shadow: 2px 2px #eee;
}

.quick-stat.health-graveyard {
    color: #6b7280;
    outline: 1px solid #f3f4f6;
    box-shadow: 2px 2px #eee;
}

/* History Status */
.quick-stat.history-not-downloaded {
    color: #4f46e5;
    outline: 1px solid #eef2ff;
    box-shadow: 2px 2px #eee;
}

.quick-stat.history-downloaded {
    color: #16a34a;
    outline: 1px solid #f0fdf4;
    box-shadow: 2px 2px #eee;
}

.quick-stat.history-seeding {
    color: #059669;
    outline: 1px solid #ecfdf5;
    box-shadow: 2px 2px #eee;
}

.quick-stat.history-leeching {
    color: #d97706;
    outline: 1px solid #fef3c7;
    box-shadow: 2px 2px #eee;
}

.quick-stat.history-incomplete {
    color: #dc2626;
    outline: 1px solid #fee2e2;
    box-shadow: 2px 2px #eee;
}

/* Freeleech Status */
.quick-stat.freeleech {
    color: #dc2626;
    outline: 1px solid #fef2f2;
    box-shadow: 2px 2px #eee;
}

/* Special Status */
.quick-stat.special-doubleup {
    color: #4f46e5;
    outline: 1px solid #eef2ff;
    box-shadow: 2px 2px #eee;
}

.quick-stat.special-featured {
    color: #c026d3;
    outline: 1px solid #fdf4ff;
    box-shadow: 2px 2px #eee;
}

.quick-stat.special-refundable {
    color: #16a34a;
    outline: 1px solid #f0fdf4;
    box-shadow: 2px 2px #eee;
}

/* Animation for scroll indicator */
@keyframes scrollPulse {
    0% { transform: translateX(0); }
    50% { transform: translateX(2px); }
    100% { transform: translateX(0); }
}

/* JavaScript-added class */
.result-quick-stats.scrollable {
    cursor: grab;
}

.result-quick-stats.scrollable:active {
    cursor: grabbing;
}

.result-quick-stats.grabbing * {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
}

/* Quick Tags (Metadata) Styles */
.result-quick-tags {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-top: 8px;
    flex-wrap: wrap;
}

.quick-tag {
    padding: 4px 8px;
    border-radius: 4px;
    font-weight: 500;
    font-size: 0.9rem;
}

/* Tag styles */
.quick-tag.tag-internal {
    color: #0284c7;
    outline: 1px solid #e0f2fe;
    box-shadow: 2px 2px #eee;
}

.quick-tag.tag-personal {
    color: #c026d3;
    outline: 1px solid #fdf4ff;
    box-shadow: 2px 2px #eee;
}

.quick-tag.tag-trumpable {
    color: #ea580c;
    outline: 1px solid #fff7ed;
    box-shadow: 2px 2px #eee;
}

.quick-tag.tag-stream {
    color: #16a34a;
    outline: 1px solid #f0fdf4;
    box-shadow: 2px 2px #eee;
}

.quick-tag.tag-highspeed {
    color: #4f46e5;
    outline: 1px solid #eef2ff;
    box-shadow: 2px 2px #eee;
}

.quick-tag.tag-bookmarked {
    color: #dc2626;
    outline: 1px solid #fef2f2;
    box-shadow: 2px 2px #eee;
}

.quick-tag.tag-wished {
    color: #c026d3;
    outline: 1px solid #fdf4ff;
    box-shadow: 2px 2px #eee;
}

.result-poster {
    flex-shrink: 0;
    position: relative;
    width: 160px;
    height: 240px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    margin-bottom: 8px;
}

.poster-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.featured-badge {
    position: absolute;
    top: 8px;
    left: 8px;
    background: rgba(0,0,0,0.75);
    color: #ffd700;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    padding: 4px 8px;
}

.result-stats {
    min-width: 120px;
    flex-direction: column;
    align-items: flex-end;
    display: flex;
    gap: 16px;
    color: #6b7280;
    font-size: 13px;
}

.result-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 16px;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin: 8px 0;
}

.result-tag {
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 13px;
    font-weight: 500;
}

.result-tag.category {
    background: #eef2ff;
    color: #4f46e5;
}

.result-tag.resolution {
    background: #f0fdf4;
    color: #059669;
}

.result-tag.type {
    background: #fef3c7;
    color: #d97706;
}

.result-tag.featured {
    background: #fdf4ff;
    color: #c026d3;
}

.result-tag.doubleup {
    background: #eff6ff;
    color: #3b82f6;
}

.result-details {
    align-items: center;
    margin-top: auto;
    padding-top: 12px;
    border-top: 1px solid #e5e7eb;
    display: flex;
    justify-content: flex-end;
}

.peer-stats {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    padding: 4px;
}

.peer-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    flex: 1;
}

.api-expanded-panel.visible {
    max-height: 100%;
    overflow: hidden;
}

.loading, .api-error, .no-api-results {
    text-align: center;
    color: #6b7280;
    padding: 24px;
}

.profile-header {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 32px 24px;
    margin-bottom: 24px;
    border-radius: 12px;
    overflow: hidden;
    background: #ffffff;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.profile-header::before {
    overflow: hidden;
}

.profile-header:hover::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 200%;
    height: 200%;
    background: linear-gradient(
        45deg,
        transparent 45%,
        rgba(255, 255, 255, 0.1) 48%,
        rgba(255, 255, 255, 0.2) 50%,
        rgba(255, 255, 255, 0.1) 52%,
        transparent 55%
    );
    animation: shine 3s infinite;
    z-index: 2;
}

.profile-header::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
        radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.2) 0%, transparent 8%),
        radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.2) 0%, transparent 8%);
    background-size: 60px 60px;
    z-index: 2;
}

.profile-avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 4px solid rgba(255, 255, 255, 0.8);
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
    position: relative;
    z-index: 3;
    transition: all 0.3s ease;
}

.profile-avatar:hover {
    transform: scale(1.05);
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2);
}

.profile-username {
    font-size: 1.75rem;
    font-weight: 700;
    color: #1f2937;
    margin: 8px 0 0;
    position: relative;
    z-index: 3;
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.profile-rank {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 1.3rem;
    font-weight: 600;
    padding: 6px 16px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.9);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1),
                0 0 0 1px rgba(0, 0, 0, 0.05);
    position: relative;
    z-index: 3;
    transition: all 0.3s ease;
}

.profile-rank i {
    font-size: 0.9em;
    transition: transform 0.3s ease;
}

.profile-rank:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1),
                0 0 0 1px rgba(0, 0, 0, 0.05);
}

.profile-rank:hover i {
    transform: scale(1.1) rotate(5deg);
}


@keyframes gradientAnimation {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}

.profile-header.animated::before {
    background: linear-gradient(
        135deg,
        rgba(99, 102, 241, 0.1) 0%,
        rgba(168, 85, 247, 0.1) 35%,
        rgba(236, 72, 153, 0.1) 100%
    );
    background-size: 400% 400%;
    animation: gradientAnimation 15s ease infinite;
}

@keyframes shine {
    0% {
        transform: translateX(-100%) translateY(-100%) rotate(45deg);
    }
    100% {
        transform: translateX(100%) translateY(100%) rotate(45deg);
    }
}

/* Enhanced header spacing */
.profile-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 24px;
    background: #ffffff;
    border-radius: 8px;
    margin-bottom: 16px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.profile-username {
    font-size: 1.8rem;
    font-weight: 600;
    color: #1f2937;
    margin: 8px 0 0;
}

.stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    cursor: help;
}

.stat-item:hover {
    transform: translateY(-1px);
    transition: transform 0.2s ease;
}

.stat-item .stat-label {
    color: #6b7280;
    font-size: 0.95rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 500;
    margin-bottom: 4px;
}

.stat-label {
  font-size: 1.3rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  color: #888181;
}

.stat-item .stat-value {
    font-weight: 700;
    font-size: 1.25rem;
}

/* Seeder stats */
.stat-item.seeders.healthy .stat-value {
    color: #10b981;
}

.stat-item.seeders.dead .stat-value {
    color: #ef4444;
}

/* Leecher stats */
.stat-item.leechers .stat-value {
    color: #f59e0b;
}

/* Completed stats */
.stat-item.completed .stat-value {
    color: #6366f1;
}

.peer-stat.leechers .stat-value {
    color: #4b5563;
}

.download-button {
  display: flex;
  align-items: center;
  padding: 6px 18px;
  background: #ffffff;
  color: #1e3a8a;
  border: 1px solid #1e3a8a;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.3rem;
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.download-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 0%;
    height: 100%;
    background: #1e3a8a;
    transition: all 0.3s ease;
    z-index: -1;
}

.download-button:hover {
    color: #ffffff;
}

.download-button:hover::before {
    width: 100%;
}

.download-button:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(79, 70, 229, 0.2);
}

.stat-value {
    color: #1f2937;
    font-size: 1.7rem;
    font-weight: 600;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
    padding: 16px;
}

.stat-card {
    transition: all 0.2s ease;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    text-align: center;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    border: 1px solid #e5e7eb;
    text-decoration: none;
    cursor: pointer;
}

.stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    border-color: #d1d5db;
    background-color: #f9fafb;
}

.stat-card:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

/* Specific colors for different stats */
.stat-card:nth-child(1) .stat-value { /* Upload */
    color: #059669;
}

.stat-card:nth-child(2) .stat-value { /* Download */
    color: #dc2626;
}

.stat-card:nth-child(3) .stat-value { /* Ratio */
    color: #6366f1;
}

.stat-card:nth-child(4) .stat-value { /* Buffer */
    color: #0891b2;
}

.stat-card:nth-child(5) .stat-value { /* Bonus Points */
    color: #d97706;
}

.stat-card:nth-child(6) .stat-value { /* Active Torrents */
    color: #7c3aed;
}

.stat-card:nth-child(7) .stat-value { /* Leeching */
    color: #e11d48;
}

.stat-card:nth-child(8) .stat-value { /* FL Tokens */
    color: #fbbf24;
}


.animate-line {
    animation: dash 1.5s ease-in-out forwards;
}

.profile-container {
    height: 100%;
    overflow-y: auto;
    background: #f8fafc;
    padding: 16px;
}

.user-stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px,1fr));
    gap: 16px;
    margin-top: 16px;
}

.api-results-header h3 {
    color: #1f2937;
    margin: 0;
}

.no-api-results {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    color: #6b7280;
    text-align: center;
    font-size: 14px;
}

.poster-placeholder {
    width: 150px;
    height: 225px;
    background: #f3f4f6;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    font-size: 48px;
}

.api-results-list::-webkit-scrollbar-track {
    background: #f1f1f1;
}

.loading-spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid #ffffff;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin .8s linear infinite;
    margin-right: 8px;
    vertical-align: middle;
}
.loading-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    color: #6b7280;
    gap: 1rem;
}

.loading-indicator .loading-spinner {
    width: 1.5rem;
    height: 1.5rem;
    border: 2px solid #e5e7eb;
    border-top-color: #4f46e5;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}
@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.peer-stat .stat-label {
    font-size: 12px;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: .05em;
}

.peer-stat .stat-value {
    font-size: 18px;
    font-weight: 600;
}

.language-name, .action-button svg {
    margin-right: 8px;
}

#selectAllBtn:hover, #clearAllBtn:hover {
    background: #f9fafb;
    color: #1f2937;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    border-color: #d1d5db;
}

#clearAllBtn:active, .collapse-button:active {
    background: #f3f4f6;
    transform: translateY(1px);
}

.remove-filter:hover, .api-status.error {
    color: #ef4444;
}

h3, .section-name {
    font-weight: 600;
    color: #1f2937;
}

.saved-filter-item:last-child, .stat-item:last-child {
    border-bottom: none;
}

.saved-filter-item:hover, .section-header:hover {
    background: #f8fafc;
}

.saved-filter-actions, .modal-footer-left, .modal-footer-right, .results-actions {
    display: flex;
    gap: 8px;
}

#cancelSaveBtn:hover, .modal-button.cancel:hover {
    background: #f9fafb;
    color: #1f2937;
}

.modal-button.primary:hover, .modal-button.save:hover, .api-verify-button.verify:hover {
    background: #4338ca;
}

.filter-sidebar::-webkit-scrollbar, .filter-sections::-webkit-scrollbar, .section-content::-webkit-scrollbar, .active-filters-content::-webkit-scrollbar, .filter-set-content::-webkit-scrollbar, .api-results-list::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track, .filter-set-content::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover, .filter-set-content::-webkit-scrollbar-thumb:hover, .api-results-list::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
}

.filter-set-content::-webkit-scrollbar-thumb, .api-results-list::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 4px;
}

.api-config-section, .profile-stats {
    padding: 16px;
}

.api-expand-button:hover {
    background: #f9fafb;
    border-color: #d1d5db;
}

.api-expand-button:hover svg, .api-tab:hover {
    color: #4f46e5;
}

.quick-stat.freeleech, .result-tag.freeleech {
    color: #dc2626;
    outline: 1px solid #fef2f2;
    box-shadow: 2px 2px #eee;
}

.peer-stat.seeders.healthy .stat-value, .stat-item.seeders {
    color: #059669;
}

.peer-stat.seeders.dead .stat-value, .stat-item.leechers {
    color: #dc2626;
}

.title-link {
    color: #1f2937;
    text-decoration: none;
    transition: color 0.2s ease;
}

.title-link:hover {
    color: #4f46e5;
}

.poster-container {
    display: flex;
    flex-direction: column;
    min-width: 160px;
    width: 100%;
    aspect-ratio: 2/3;
    position: relative;
    overflow: hidden;
}

.result-tag.genres {
    background: #fdf4ff;
    color: #c026d3;
}

.quick-stat.freeleech {
    color: #dc2626;
    outline: 1px solid #fef2f2;
    box-shadow: 2px 2px #eee;
}

.peer-stat.seeders.healthy .stat-value {
    color: #059669;
}

.peer-stat.seeders.dead .stat-value {
    color: #dc2626;
}

.api-result-item {
    display: flex;
    flex-direction: column;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    overflow: hidden;
    height: auto;
    min-height: 340px;
}

.api-result-item:hover {
    transform: translateY(-4px);
    border-color: #cbd5e1;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
}

.result-top-section {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 12px 16px;
    border-bottom: 1px solid #e5e7eb;
    position: relative;
    min-height: 45px;
    max-height: 52px;
}

.top-section-left {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 0;
    flex: 1;
}

.top-section-right {
    flex-shrink: 0;
    font-size: 0.9rem;
    color: #6b7280;
    font-weight: 500;
    white-space: nowrap;
    margin-left: 16px;
    position: relative;
    z-index: 2;
}

.scroll-indicator {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    width: 24px;
    height: 24px;
    background: #ffffff;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6b7280;
    opacity: 0;
    transition: opacity 0.2s ease;
    pointer-events: none;
    z-index: 3;
}
.result-quick-stats.has-overflow:hover + .scroll-indicator {
    opacity: 1;
}

.file-info {
    color: #6b7280;
}

.stats-info {
    display: flex;
    gap: 12px;
    color: #6b7280;
}

.result-content-section {
    display: flex;
    padding: 16px;
    flex: 1;
    min-height: 240px;
    height: auto;
}

.poster-container {
    width: 130px;
    min-width: 130px;
    margin-right: 16px;
    display: flex;
    flex-direction: column;
}

.result-poster {
    width: 100%;
    height: 195px;
    position: relative;
    overflow: hidden;
    border-radius: 8px;
}

.poster-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.content-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 0;
    overflow: hidden;
}

.result-title {
    font-size: 1.7rem;
    font-weight: 600;
    line-height: 1.3;
    margin-bottom: 4px;
    color: #1e3a8a;
    flex: 1;
    word-wrap: break-word;
    overflow-wrap: break-word;
}

.result-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: auto;
}

.torrent-stats {
    display: flex;
    gap: 15px;
}

.result-footer {
    height: 54px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
    border-top: 1px solid #e5e7eb;
    flex-shrink: 0;
}

.uploader-info {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9rem;
    color: #6b7280;
}

.footer-actions {
    display: flex;
    align-items: center;
    gap: 12px;
}

.info-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1px solid #d5d3d3;
  background: transparent;
  color: #6b7280;
  font-size: 1.2rem;
  font-weight: 600;
  font-family: serif;
  cursor: pointer;
  transition: all 0.2s ease;
  font-style: italic;
}

.info-button:hover {
    border-color: #6366f1;
    color: #6366f1;
    background: #eef2ff;
}

.sort-menu {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 4px;
    width: 200px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border: 1px solid #e5e7eb;
    z-index: 1000;
    opacity: 0;
    transform: translateY(-10px);
    transition: opacity 0.3s ease, transform 0.3s ease;
    pointer-events: none;
}

.sort-menu.visible {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
}

.sort-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px;
    cursor: pointer;
    transition: background 0.2s ease;
}

.sort-option:hover {
    background: #f3f4f6;
}

.sort-option-left {
    display: flex;
    align-items: center;
    gap: 8px;
}

.sort-option.active {
    background: #f3f4f6;
    font-weight: 500;
}

.sort-icon {
    font-size: 14px;
    width: 16px;
    text-align: center;
}

.sort-label {
    font-size: 14px;
    color: #374151;
}

.sort-direction {
    color: #6b7280;
}

.search-close {
    padding: 8px;
    border: none;
    background: none;
    color: #6b7280;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.2s ease;
}

.search-close:hover {
    background: #f3f4f6;
    color: #1f2937;
}

/* Animation for search results */
.search-results {
   margin-top: 16px;
   opacity: 0;
   transform: translateY(10px);
   transition: all 0.3s ease;
}

.search-results.active {
   opacity: 1;
   transform: translateY(0);
}

/* Search Trigger Button */
.search-trigger-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 33px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    background: #ffffff;
    color: #4b5563;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-right: 8px;
}

.search-trigger-button:hover {
    background: #f9fafb;
    border-color: #d1d5db;
    color: #1f2937;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

/* Search Overlay and Modal */
.search-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    z-index: 9999;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
}

.search-overlay.active {
    opacity: 1;
    visibility: visible;
}

.search-modal {
    width: 90%;
    max-width: 600px;
    height: 350px; /* Fixed height */
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    margin-top: 80px;
    transform: translateY(-20px);
    transition: all 0.3s ease;
}

.search-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 24px;
}

.search-overlay.active .search-modal {
    transform: translateY(0);
}

/* Search Input Container */
.search-input-container {
    flex-shrink: 0; /* Prevent input from shrinking */
    position: relative;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
}

.search-input {
    width: 100%;
    height: 56px;
    padding: 0 56px 0 24px;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    font-size: 18px;
    color: #1f2937;
    background: #ffffff;
    transition: all 0.2s ease;
}

.search-input:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
}

.search-input::placeholder {
    color: #9ca3af;
}

.search-case-toggle {
    display: flex;
    align-items: center;
    margin-left: 16px;
}

.search-close {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    border: none;
    background: none;
    color: #6b7280;
    padding: 8px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.search-close:hover {
    background: #f3f4f6;
    color: #1f2937;
}

.search-options {
    flex-shrink: 0; /* Prevent options from shrinking */
    margin-bottom: 16px;
}

.search-tips {
    flex: 1;
    overflow-y: auto;
    padding: 16px 0 0;
    border-top: 1px solid #e5e7eb;
    color: #6b7280;
    -ms-overflow-style: none;  /* Hide scrollbar IE and Edge */
    scrollbar-width: none;  /* Hide scrollbar Firefox */
}

.search-tips::-webkit-scrollbar {
    width: 6px;
    display: none;
}

.search-tips::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
}

.search-tips::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 3px;
    border: 1px solid #f1f5f9;
}

.search-tips::-webkit-scrollbar-thumb:hover {
    background-color: #94a3b8;
}

/* Animation for search modal */
.search-overlay.active .search-modal {
    transform: translateY(0);
    opacity: 1;
}

.search-overlay {
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(4px);
}

.tip {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 13px;
    line-height: 1.4;
}

.tip-key {
    padding: 2px 6px;
    background: #f3f4f6;
    border-radius: 4px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 12px;
    color: #4b5563;
    white-space: nowrap;
}

.tips-header {
    font-size: 14px;
    font-weight: 600;
    color: #4b5563;
    margin: 0 0 12px;
}

.tips-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
}

.tip-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.tip-group h5 {
    font-size: 13px;
    font-weight: 600;
    color: #4b5563;
    margin: 0;
}

.tip:hover {
    color: #4f46e5;
}

.tip:hover .tip-key {
    background: #eef2ff;
    color: #4f46e5;
}

.case-toggle {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    user-select: none;
    padding: 8px;
    border-radius: 8px;
    transition: all 0.2s ease;
}

.case-toggle:hover {
    background: #f9fafb;
}

.case-toggle input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
}

.toggle-label {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  margin-right: 8px;
  font-weight: 600;
  color: #6b7280;
  transition: all 0.2s ease;
  font-size: 14px;
  padding-left: 8px;
}

.case-toggle input:checked {
    background: #4f46e5;
    color: white;
}

.case-toggle input:checked + .toggle-track {
    background: #4f46e5;
}

.case-toggle input:checked + .toggle-track .toggle-indicator {
    left: 24px;
    color: #4f46e5;
}

.toggle-description {
    font-size: 14px;
    color: #6b7280;
}

.toggle-track {
    position: relative;
    display: flex;
    align-items: center;
    width: 48px;
    height: 28px;
    background: #e5e7eb;
    border-radius: 14px;
    transition: all 0.2s ease;
}

.toggle-indicator {
    position: absolute;
    left: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    font-size: 12px;
    font-weight: 600;
    color: #6b7280;
    transition: all 0.2s ease;
}

.case-toggle input:checked:hover + .toggle-label {
    background: #4338ca;
}

@media (max-width: 640px) {
    .tips-grid {
        grid-template-columns: 1fr;
        gap: 16px;
    }

    .search-modal {
        height: 350px;
        margin-top: 40px;
    }

    .search-content {
        padding: 16px;
    }
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .api-result-item {
        height: auto;
    }

    .result-content-section {
        flex-direction: column;
        height: auto;
        min-height: unset;
    }

    .poster-container {
        width: 100%;
        height: 280px;
        margin-bottom: 16px;
    }

    .result-poster {
        height: 100%;
    }

    .content-main {
        width: 100%;
    }

    .pagination-controls {
        gap: 4px;
    }

    .pagination-number {
        min-width: 28px;
        height: 28px;
        font-size: 13px;
    }

    .pagination-button {
        width: 28px;
        height: 28px;
    }

    .api-results-header {
        flex-direction: column;
        gap: 16px;
        padding: 12px;
    }

    .results-count, .pagination-controls, .results-actions {
        width: 100%;
        justify-content: center;
    }

    .pagination-button, .pagination-number {
        min-width: 28px;
        height: 28px;
        font-size: 13px;
    }

    .sort-button {
        width: 100%;
        justify-content: center;
    }
}

/* Hide scrollbars while maintaining functionality */
::-webkit-scrollbar {
   width: 0 !important;
   height: 0 !important;
}

.filter-sidebar,
.filter-sections,
.section-content,
.active-filters-content,
.filter-set-content,
.api-results-list,
.result-quick-stats {
   scrollbar-width: none !important;
   -ms-overflow-style: none !important;
}

.filter-sidebar::-webkit-scrollbar,
.filter-sections::-webkit-scrollbar,
.section-content::-webkit-scrollbar,
.active-filters-content::-webkit-scrollbar,
.filter-set-content::-webkit-scrollbar,
.api-results-list::-webkit-scrollbar,
.result-quick-stats::-webkit-scrollbar {
   display: none !important;
}
.saved-filters-list {
    scrollbar-width: none !important;
    -ms-overflow-style: none !important;
}

.saved-filters-list::-webkit-scrollbar {
    width: 0 !important;
    height: 0 !important;
    display: none !important;
}
.filter-set-content.active,
.saved-filters-list {
    overflow: auto;
}

`;

    // Group all filters for easier management
    const ALL_FILTERS = {
        categories: CATEGORIES,
        types: TYPES,
        resolutions: RESOLUTIONS,
        genres: GENRES,
        tags: TAGS,
        health: HEALTH,
        history: HISTORY,
        freeleech: BUFF.FREELEECH,
        special: BUFF.SPECIAL
    };

    class SortMenu {
        setupDocumentClickHandler() {
            this.handleDocumentClick = (e) => {
                if (this.visible) {
                    const isClickOnMenu = e.target.closest('.sort-menu');
                    const isClickOnButton = e.target.closest('.sort-button');
                    const isClickInModal = e.target.closest('.filter-modal');

                    // If click is outside menu and button, and inside the modal
                    if (!isClickOnMenu && !isClickOnButton && isClickInModal) {
                        console.log('Valid outside click detected');
                        e.stopPropagation();
                        this.hideMenu();
                    }
                }
            };

            // Use capture phase to handle click before other handlers
            document.addEventListener('click', this.handleDocumentClick, true);
        }

        constructor(filterUI) {
            this.filterUI = filterUI;
            this.currentSort = this.loadSortState() || {
                field: 'created_at',
                direction: 'desc'
            };
            this.menu = null;
            this.visible = false;

            // Setup handlers after a short delay to ensure DOM is ready
            setTimeout(() => {
                this.setupSortButton();
                this.setupDocumentClickHandler();
            }, 0);
        }

        // Add methods to save and load sort state
        saveSortState() {
            localStorage.setItem('fnp_sort_state', JSON.stringify(this.currentSort));
        }

        loadSortState() {
            const saved = localStorage.getItem('fnp_sort_state');
            return saved ? JSON.parse(saved) : null;
        }

        handleSort(sortId) {
            console.log('handleSort called with:', sortId);
            console.log('Current sort state before:', this.currentSort);

            // If clicking the same field, toggle direction
            if (this.currentSort.field === sortId) {
                console.log('Same field clicked, toggling direction');
                this.currentSort.direction = this.currentSort.direction === 'desc' ? 'asc' : 'desc';
            } else {
                console.log('New field clicked, setting to desc');
                this.currentSort.field = sortId;
                this.currentSort.direction = 'desc';
            }

            console.log('New sort state:', this.currentSort);

            // Save the new sort state
            this.saveSortState();

            // Update the UI
            this.hideMenu();

            // Always trigger API search when sort is clicked
            if (this.filterUI) {
                console.log('Applying sort:', this.currentSort);
                this.filterUI.applySort(this.currentSort);
            }
        }

        setupSortButton(button = null) {
            const sortBtn = button || document.querySelector('.sort-button');
            if (!sortBtn) return;

            sortBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                this.toggleMenu();
            });

            this.sortButton = sortBtn;
        }

        createMenu() {
            const menu = document.createElement('div');
            menu.className = 'sort-menu';

            // Prevent clicks on menu from closing it
            menu.addEventListener('click', (e) => {
                e.stopPropagation();
            });

            menu.innerHTML = SORT_OPTIONS.map(option => {
                const isActive = this.currentSort.field === option.id;
                return `
            <div class="sort-option ${isActive ? 'active' : ''}"
                 data-sort-id="${option.id}"
                 data-current-direction="${isActive ? this.currentSort.direction : ''}">
                <div class="sort-option-left">
                    <span class="sort-icon">${option.icon}</span>
                    <span class="sort-label">${option.label}</span>
                </div>
                ${isActive ? `
                    <span class="sort-direction">
                        ${this.currentSort.direction === 'desc' ?
                    `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M11 5h10M11 9h7M11 13h4M3 17l3 3 3-3M6 18V4"/>
                            </svg>` :
                `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M11 19h10M11 15h7M11 11h4M3 7l3-3 3 3M6 6v14"/>
                            </svg>`
            }
                    </span>
                ` : ''}
            </div>
        `;
            }).join('');

            // Add click handlers for options
            menu.querySelectorAll('.sort-option').forEach(option => {
                option.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const sortId = option.dataset.sortId;
                    this.handleSort(sortId);
                });
            });

            return menu;
        }

        handleSort(sortId) {
            console.log('handleSort called with:', sortId);
            console.log('Current sort state:', this.currentSort);

            // Track previous sort state for comparison
            const previousSort = { ...this.currentSort };
            console.log('Previous sort state:', previousSort);

            // If clicking the same field, toggle direction
            if (this.currentSort.field === sortId) {
                console.log('Same field clicked, toggling direction');
                this.currentSort.direction = this.currentSort.direction === 'desc' ? 'asc' : 'desc';
            } else {
                console.log('New field clicked, setting to desc');
                this.currentSort.field = sortId;
                this.currentSort.direction = 'desc';
            }

            console.log('New sort state:', this.currentSort);

            // Update the UI
            this.hideMenu();

            // Update the sort button icon immediately
            if (this.sortButton) {
                const svgIcon = this.currentSort.direction === 'desc' ?
                      `<path d="M11 5h10M11 9h7M11 13h4M3 17l3 3 3-3M6 18V4"/>` :
                `<path d="M11 19h10M11 15h7M11 11h4M3 7l3-3 3 3M6 6v14"/>`;

                this.sortButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg"
                 width="16"
                 height="16"
                 viewBox="0 0 24 24"
                 fill="none"
                 stroke="currentColor"
                 stroke-width="2"
                 stroke-linecap="round"
                 stroke-linejoin="round">
                ${svgIcon}
            </svg>
            Sort
        `;
            }

            // Always trigger API search when sort is clicked
            if (this.filterUI) {
                console.log('Applying sort:', this.currentSort);
                this.filterUI.applySort(this.currentSort);
            }
        }

        toggleMenu() {
            if (this.visible) {
                this.hideMenu();
            } else {
                this.showMenu();
            }
        }

        showMenu() {
            if (!this.menu) {
                this.menu = this.createMenu();
                if (this.sortButton) {
                    this.sortButton.parentNode.appendChild(this.menu);
                    requestAnimationFrame(() => {
                        this.visible = true;
                        this.menu.classList.add('visible');
                    });
                }
            }
        }

        hideMenu() {
            if (this.menu) {
                this.visible = false;
                this.menu.classList.remove('visible');

                setTimeout(() => {
                    if (this.menu && this.menu.parentNode) {
                        this.menu.parentNode.removeChild(this.menu);
                    }
                    this.menu = null;
                }, 300);
            }
        }
    }

    class ChartUtils {
        constructor(container) {
            this.container = container;
            this.tooltip = this.createTooltip();
        }

        createTooltip() {
            const tooltip = document.createElement('div');
            tooltip.className = 'chart-tooltip';
            tooltip.style.opacity = '0';
            document.body.appendChild(tooltip);
            return tooltip;
        }

        showTooltip(text, x, y) {
            this.tooltip.textContent = text;
            this.tooltip.style.left = `${x}px`;
            this.tooltip.style.top = `${y}px`;
            this.tooltip.style.opacity = '1';
        }

        hideTooltip() {
            this.tooltip.style.opacity = '0';
        }

        formatSpeed(speed) {
            return `${speed.toFixed(2)} MB/s`;
        }

        createSpeedChart(data, width = 300, height = 200) {
            const margin = { top: 20, right: 20, bottom: 30, left: 50 };
            const innerWidth = width - margin.left - margin.right;
            const innerHeight = height - margin.top - margin.bottom;

            // Find min/max values
            const maxSpeed = Math.max(...data.map(d => Math.max(d.up, d.down)));

            // Scale functions
            const xScale = (index) => (index * innerWidth) / (data.length - 1);
            const yScale = (value) => innerHeight - (value * innerHeight / maxSpeed);

            // Create upload and download paths
            const upPath = data.map((d, i) =>
                                    `${i === 0 ? 'M' : 'L'} ${xScale(i) + margin.left} ${yScale(d.up) + margin.top}`
                                   ).join(' ');

            const downPath = data.map((d, i) =>
                                      `${i === 0 ? 'M' : 'L'} ${xScale(i) + margin.left} ${yScale(d.down) + margin.top}`
                                     ).join(' ');

            return `
            <svg width="${width}" height="${height}" class="speed-chart">
                <!-- Grid lines -->
                ${this.createGridLines(innerWidth, innerHeight, margin, maxSpeed)}

                <!-- Upload line -->
                <path
                    d="${upPath}"
                    stroke="#4f46e5"
                    stroke-width="2"
                    fill="none"
                    class="animate-line"
                    stroke-dasharray="1000"
                    stroke-dashoffset="1000"
                />

                <!-- Download line -->
                <path
                    d="${downPath}"
                    stroke="#22c55e"
                    stroke-width="2"
                    fill="none"
                    class="animate-line"
                    stroke-dasharray="1000"
                    stroke-dashoffset="1000"
                />

                <!-- Data points -->
                ${data.map((d, i) => `
                    <!-- Upload point -->
                    <circle
                        class="chart-point"
                        cx="${xScale(i) + margin.left}"
                        cy="${yScale(d.up) + margin.top}"
                        r="4"
                        fill="#4f46e5"
                        data-value="${this.formatSpeed(d.up)}"
                        data-type="Upload"
                        data-index="${i}"
                    />
                    <!-- Download point -->
                    <circle
                        class="chart-point"
                        cx="${xScale(i) + margin.left}"
                        cy="${yScale(d.down) + margin.top}"
                        r="4"
                        fill="#22c55e"
                        data-value="${this.formatSpeed(d.down)}"
                        data-type="Download"
                        data-index="${i}"
                    />
                `).join('')}

                <!-- Axes -->
                ${this.createAxes(innerWidth, innerHeight, margin, maxSpeed)}

                <!-- Legend -->
                ${this.createLegend(margin.left, margin.top)}
            </svg>
        `;
        }

        createDistributionChart(data, width = 250, height = 250) {
            const radius = Math.min(width, height) / 2 - 20;
            const centerX = width / 2;
            const centerY = height / 2;

            const total = data.reduce((sum, d) => sum + d.value, 0);
            let startAngle = 0;

            const segments = data.map((d, i) => {
                const percentage = d.value / total;
                const angle = percentage * 2 * Math.PI;
                const segment = this.createDonutSegment(
                    centerX,
                    centerY,
                    radius,
                    radius * 0.6,
                    startAngle,
                    startAngle + angle
                );
                startAngle += angle;
                return {
                    path: segment,
                    data: d,
                    percentage
                };
            });

            return `
            <svg width="${width}" height="${height}" class="distribution-chart">
                ${segments.map((segment, i) => `
                    <g class="chart-segment"
                       data-label="${segment.data.label}"
                       data-value="${this.formatBytes(segment.data.value)}"
                       data-percentage="${(segment.percentage * 100).toFixed(1)}%">
                        <path
                            d="${segment.path}"
                            fill="${segment.data.color}"
                            stroke="white"
                            stroke-width="1"
                        />
                    </g>
                `).join('')}

                <!-- Center text -->
                <text
                    x="${centerX}"
                    y="${centerY}"
                    text-anchor="middle"
                    font-size="14"
                    fill="#6b7280"
                >Total</text>
                <text
                    x="${centerX}"
                    y="${centerY + 20}"
                    text-anchor="middle"
                    font-size="16"
                    font-weight="bold"
                    fill="#1f2937"
                >${this.formatBytes(total)}</text>
            </svg>
        `;
        }

        // Initialize chart interactivity
        initializeChartEvents() {
            // Speed chart points
            const points = this.container.querySelectorAll('.chart-point');
            points.forEach(point => {
                point.addEventListener('mouseenter', (e) => {
                    const rect = point.getBoundingClientRect();
                    const text = `${e.target.dataset.type}: ${e.target.dataset.value}`;
                    this.showTooltip(text, rect.left, rect.top);
                });

                point.addEventListener('mouseleave', () => {
                    this.hideTooltip();
                });
            });

            // Distribution segments
            const segments = this.container.querySelectorAll('.chart-segment');
            segments.forEach(segment => {
                segment.addEventListener('mouseenter', (e) => {
                    const rect = segment.getBoundingClientRect();
                    const text = `${e.target.dataset.label}: ${e.target.dataset.value} (${e.target.dataset.percentage})`;
                    this.showTooltip(text, rect.left + rect.width/2, rect.top);
                });

                segment.addEventListener('mouseleave', () => {
                    this.hideTooltip();
                });
            });
        }
    }

    class ApiManager {
        constructor() {
            this.API_KEY_STORAGE = 'fnp_api_key';
            this.BASE_URL = window.location.protocol + '//' + window.location.host + '/api';
            console.log('[ApiManager] Initialized with BASE_URL:', this.BASE_URL);
        }

        async getUserStats() {
            console.log('[ApiManager] Getting User Stats');
            const apiKey = this.getApiKey();

            if (!apiKey) {
                console.log('No API key available');
                return null;
            }

            try {
                const url = `${this.BASE_URL}/users/me?api_token=${apiKey}`;
                console.log('Fetching user stats from:', url);

                const response = await fetch(url, {
                    headers: { 'Accept': 'application/json' },
                    credentials: 'same-origin',
                    mode: 'same-origin'
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const data = await response.json();
                console.log('User stats received:', data); // Let's see what data we get
                return data;
            } catch (error) {
                console.error('Error fetching user stats:', error);
                return null;
            }
        }

        setApiKey(apiKey) {
            console.log('[ApiManager] Setting API key:', apiKey?.substring(0, 5) + '...');
            try {
                GM_setValue(this.API_KEY_STORAGE, apiKey);
                console.log('[ApiManager] API key saved successfully');
                return true;
            } catch (error) {
                console.error('[ApiManager] Error saving API key:', error);
                return false;
            }
        }

        getApiKey() {
            try {
                const key = GM_getValue(this.API_KEY_STORAGE, null);
                console.log('[ApiManager] Retrieved API key:', key ? key.substring(0, 5) + '...' : 'none');
                return key;
            } catch (error) {
                console.error('[ApiManager] Error retrieving API key:', error);
                return null;
            }
        }

        clearApiKey() {
            console.log('[ApiManager] Clearing API key');
            try {
                GM_deleteValue(this.API_KEY_STORAGE);
                console.log('[ApiManager] API key cleared successfully');
                return true;
            } catch (error) {
                console.error('[ApiManager] Error clearing API key:', error);
                return false;
            }
        }

        async validateApiKey(apiKey) {
            console.group('[ApiManager] Validating API Key');
            console.log('Starting validation for key:', apiKey?.substring(0, 5) + '...');

            try {
                // Using the proven working method from our tests
                const url = `${this.BASE_URL}/torrents?api_token=${apiKey}`;
                console.log('Making request to:', url);

                const response = await fetch(url, {
                    headers: {
                        'Accept': 'application/json'
                    },
                    credentials: 'same-origin',
                    mode: 'same-origin'
                });

                console.log('Response status:', response.status);
                console.log('Response headers:', Object.fromEntries(response.headers.entries()));

                if (response.ok) {
                    try {
                        // Try to parse response for debugging
                        const text = await response.text();
                        console.log('Raw response:', text.substring(0, 100) + '...');
                        JSON.parse(text); // Verify it's valid JSON
                        console.log('Validation successful');
                        console.groupEnd();
                        return { valid: true };
                    } catch (parseError) {
                        console.error('Response parse error:', parseError);
                        console.groupEnd();
                        return { valid: false, error: 'Invalid response format' };
                    }
                } else {
                    console.log('Response not OK');
                    const errorText = await response.text();
                    console.log('Error response:', errorText);
                    console.groupEnd();
                    return { valid: false, error: `HTTP ${response.status}` };
                }
            } catch (error) {
                console.error('Validation error:', error);
                console.groupEnd();
                return {
                    valid: false,
                    error: error.message
                };
            }
        }

        async getUserStats() {
            console.group('[ApiManager] Getting User Stats');
            const apiKey = this.getApiKey();

            if (!apiKey) {
                console.log('No API key available');
                console.groupEnd();
                return null;
            }

            try {
                const url = `${this.BASE_URL}/users/me?api_token=${apiKey}`;
                console.log('Fetching user stats from:', url);

                const response = await fetch(url, {
                    headers: {
                        'Accept': 'application/json'
                    },
                    credentials: 'same-origin',
                    mode: 'same-origin'
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const data = await response.json();
                console.log('User stats received:', data);
                console.groupEnd();
                return data;
            } catch (error) {
                console.error('Error fetching user stats:', error);
                console.groupEnd();
                return null;
            }
        }
    }

    class SearchParser {
        parse(searchText) {
            console.group('Search Parser');
            console.log('Input search text:', searchText);

            const terms = {
                include: [],
                exclude: [],
                either: []
            };

            let currentPhrase = '';
            let inQuotes = false;
            let currentQuote = null;
            let buffer = '';
            let isExclude = false;
            let isEither = false;
            let leadingHyphens = 0;

            const processTerm = (term, forceExclude = false) => {
                if (!term) return;
                term = term.trim();

                console.log('Processing term:', {
                    term,
                    isExclude: forceExclude || isExclude,
                    isEither,
                    leadingHyphens,
                    inQuotes
                });

                // Split term by "/" if not in quotes and not already an either term
                if (!inQuotes && !isEither && term.includes('/')) {
                    const splitTerms = term.split('/').filter(t => t.length > 0);
                    console.log('Split terms by "/":', splitTerms);

                    splitTerms.forEach((t, index) => {
                        // First term is normal include, rest are either terms
                        if (index === 0 && !term.startsWith('/')) {
                            console.log(`Adding first term "${t}" to include terms`);
                            terms.include.push(t);
                        } else {
                            console.log(`Adding split term "${t}" to either terms`);
                            terms.either.push(t);
                        }
                    });
                    return;
                }

                // Handle normal term processing
                if (forceExclude || isExclude) {
                    console.log(`Adding "${term}" to exclude terms (preserved format)`);
                    terms.exclude.push(term);
                } else if (isEither) {
                    console.log(`Adding "${term}" to either terms`);
                    terms.either.push(term);
                } else if (term.startsWith('+')) {
                    console.log(`Adding "${term.slice(1)}" to include terms`);
                    terms.include.push(term.slice(1));
                } else {
                    console.log(`Adding "${term}" to include terms`);
                    terms.include.push(term);
                }

                // Reset flags after processing
                isExclude = false;
                isEither = false;
                leadingHyphens = 0;
            };

            for (let i = 0; i < searchText.length; i++) {
                const char = searchText[i];
                const nextChar = searchText[i + 1];

                // Handle exclusion operator at start of term
                if (char === '-' && !inQuotes && buffer === '') {
                    isExclude = true;
                    continue;
                }

                // Handle either operator at start of term
                if (char === '/' && !inQuotes && buffer === '') {
                    isEither = true;
                    continue;
                }

                // Handle quotes
                if ((char === '"' || char === "'") && (!inQuotes || char === currentQuote)) {
                    if (inQuotes) {
                        console.log('Ending quoted phrase:', buffer);
                        processTerm(buffer);
                        buffer = '';
                        inQuotes = false;
                        currentQuote = null;
                    } else {
                        console.log('Starting quoted phrase');
                        if (buffer) processTerm(buffer);
                        buffer = '';
                        inQuotes = true;
                        currentQuote = char;
                    }
                    continue;
                }

                // Handle spaces outside quotes
                if (char === ' ' && !inQuotes) {
                    if (buffer) {
                        console.log('Processing buffer at space:', buffer);
                        processTerm(buffer);
                    }
                    buffer = '';
                    continue;
                }

                // Add character to buffer
                buffer += char;
                console.log('Current buffer:', buffer);
            }

            // Process any remaining buffer
            if (buffer) {
                console.log('Processing remaining buffer:', buffer);
                processTerm(buffer);
            }

            console.log('Final parsed terms:', terms);
            console.groupEnd();
            return terms;
        }
    }


    // Core filter functionality
    class FilterManager {
        constructor() {
            // Initialize base filters first
            this.arrayFilters = {
                categoryIds: new Set(),
                typeIds: new Set(),
                resolutionIds: new Set(),
                genreIds: new Set(),
                free: new Set(),
                primaryLanguageNames: new Set()
            };


            this.booleanFilters = new Set();
            this.TORRENTS_PAGE = 'https://fearnopeer.com/torrents';
            this.activeGroup = 'content';
            this.featuresState = this.loadFeaturesState();
            this.USER_PROFILE_STORAGE = 'fnp_user_profile';
            this.USER_AVATAR_STORAGE = 'fnp_user_avatar';

            // Initialize user profile data
            this.userProfile = this.loadUserProfile();
            this.extractAndSaveUserAvatar();

            // Initialize API Manager
            this.apiManager = new ApiManager();

            // Initialize savedFilters with empty object if loading fails
            this.savedFilters = {};
            try {
                const saved = localStorage.getItem('fnp_saved_filters');
                if (saved) {
                    this.savedFilters = JSON.parse(saved);
                }
            } catch (error) {
                console.error('Error loading saved filters:', error);
            }

            // Initialize expanded sections
            this.expandedSections = new Set(
                Object.values(FILTER_GROUPS)
                .flatMap(group => group.sections)
                .filter(section => section.expanded)
                .map(section => section.id)
            );

            this.savedFilters = this.loadSavedFilters();
            DEBUG.log('Saved Filters Initialized', this.savedFilters);

            // Initialize filters if on torrents page
            if (this.isFearnopeerTorrentsPage()) {
                this.initializeFilters();
            }
        }

        processSearchOperators(data, searchParams) {
            console.group('Processing Search Operators');

            const isCaseSensitive = searchParams.caseSensitive === 'true';

            const filteredResults = data.filter(item => {
                const name = isCaseSensitive ? item.attributes.name : item.attributes.name.toLowerCase();

                const searchTerm = searchParams['keywords[]'];
                const excludeTerms = Array.isArray(searchParams['exclude[]'])
                ? searchParams['exclude[]']
                : [searchParams['exclude[]']];

                const searchValue = typeof searchTerm === 'string'
                ? (isCaseSensitive ? searchTerm : searchTerm.toLowerCase())
                : null;

                const excludeValues = excludeTerms
                .filter(term => term != null)
                .map(term => {
                    if (typeof term !== 'string') {
                        console.log('Non-string exclude term:', term);
                        return null;
                    }
                    return isCaseSensitive ? term : term.toLowerCase();
                })
                .filter(term => term != null);

                const includesSearchTerm = !searchValue || name.includes(searchValue);
                const excludesAllTerms = excludeValues.every(excludeValue =>
                                                             !excludeValue || !name.includes(excludeValue)
                                                            );

                return includesSearchTerm && excludesAllTerms;
            });

            console.log('Search operators processed:', {
                originalCount: data.length,
                filteredCount: filteredResults.length
            });
            console.groupEnd();

            return filteredResults;
        }

        async fetchFilteredTorrents(page = 1, perPage = 100, sort = { field: 'created_at', direction: 'desc' }, searchParams = {}) {
            console.group('API Request Formation');
            console.log('Current filters:', this.arrayFilters);
            console.log('Page:', page);
            console.log('PerPage:', perPage);
            console.log('Sort:', sort);
            console.log('Search params:', searchParams);

            try {
                // Convert name parameter to keywords[] if present
                if (searchParams.name) {
                    searchParams['keywords[]'] = searchParams.name;
                    delete searchParams.name;
                    console.log('Converted search params:', searchParams);
                }

                const apiKey = this.apiManager.getApiKey();
                if (!apiKey) {
                    console.error('No API key configured');
                    return { success: false, error: 'No API key configured' };
                }

                // Parameter mapping for filters
                const parameterMapping = {
                    categoryIds: 'categories[]',
                    typeIds: 'types[]',
                    resolutionIds: 'resolutions[]',
                    genreIds: 'genres[]',
                    free: 'free[]',
                    primaryLanguageNames: 'language[]'
                };

                // Search-specific handling
                if (searchParams['keywords[]'] || searchParams['exclude[]']) {
                    const params = new URLSearchParams();
                    params.append('api_token', apiKey);
                    params.append('tmdb', '1');
                    params.append('page', page.toString());
                    params.append('perPage', perPage.toString());
                    params.append('sortField', sort.field);
                    params.append('sortDirection', sort.direction);

                    if (searchParams['keywords[]']) {
                        params.append('name', searchParams['keywords[]']);
                    }

                    // Add array filters with mapping
                    Object.entries(this.arrayFilters).forEach(([key, values]) => {
                        if (values.size > 0) {
                            const mappedParam = parameterMapping[key];
                            if (mappedParam) {
                                Array.from(values).forEach(value => {
                                    console.log(`Adding parameter: ${mappedParam} = ${value}`);
                                    params.append(mappedParam, value);
                                });
                            }
                        }
                    });

                    // Add boolean filters
                    this.booleanFilters.forEach(filter => {
                        params.append(filter, 'true');
                    });

                    const url = `${this.apiManager.BASE_URL}/torrents/filter?${params.toString()}`;
                    console.log('Making search request:', url);

                    const response = await fetch(url, {
                        headers: { 'Accept': 'application/json' },
                        credentials: 'same-origin',
                        mode: 'same-origin'
                    });

                    if (!response.ok) throw new Error(`HTTP ${response.status}`);

                    const data = await response.json();
                    console.log('Raw API response data:', data);
                    if (!data.data || !Array.isArray(data.data)) {
                        throw new Error('Invalid API response format');
                    }

                    // Process operators on the results
                    const filteredResults = this.processSearchOperators(data.data, searchParams);

                    // Return with original API metadata
                    return {
                        success: true,
                        results: {
                            data: filteredResults,
                            meta: data.meta
                        },
                        meta: data.meta
                    };
                }

                // Regular non-search request handling
                const params = new URLSearchParams();
                params.append('api_token', apiKey);
                params.append('tmdb', '1');
                params.append('page', page.toString());
                params.append('perPage', perPage.toString());
                params.append('sortField', sort.field);
                params.append('sortDirection', sort.direction);

                // Add array filters with mapping
                Object.entries(this.arrayFilters).forEach(([key, values]) => {
                    if (values.size > 0) {
                        const mappedParam = parameterMapping[key];
                        if (mappedParam) {
                            Array.from(values).forEach(value => {
                                console.log(`Adding parameter: ${mappedParam} = ${value}`);
                                params.append(mappedParam, value);
                            });
                        }
                    }
                });

                // Add boolean filters
                this.booleanFilters.forEach(filter => {
                    params.append(filter, 'true');
                });

                const url = `${this.apiManager.BASE_URL}/torrents/filter?${params.toString()}`;
                console.log('Making regular request:', url);

                const response = await fetch(url, {
                    headers: { 'Accept': 'application/json' },
                    credentials: 'same-origin',
                    mode: 'same-origin'
                });

                if (!response.ok) throw new Error(`HTTP ${response.status}`);

                const data = await response.json();
                return {
                    success: true,
                    results: data,
                    meta: {
                        current_page: page,
                        per_page: perPage,
                        total: data.meta?.total || data.data.length,
                        last_page: data.meta?.last_page || Math.ceil(data.data.length / perPage),
                        from: ((page - 1) * perPage) + 1,
                        to: ((page - 1) * perPage) + data.data.length
                    }
                };

            } catch (error) {
                console.error('API request failed:', error);
                return { success: false, error: error.message };
            } finally {
                console.groupEnd();
            }
        }

        validateCategoryValue(value) {
            // Ensure the value matches a valid category
            const category = CATEGORIES.find(cat =>
                                             cat.value.toString() === value.toString() ||
                                             cat.urlValue === value.toString()
                                            );

            if (category) {
                // Always use the urlValue for API requests
                return category.urlValue;
            }
        }



        // Convert internal filters to API format
        convertFiltersToApiFormat() {
            const apiFilters = {};

            // Convert array filters
            if (this.arrayFilters.categoryIds.size > 0) {
                apiFilters.categories = Array.from(this.arrayFilters.categoryIds);
            }
            if (this.arrayFilters.typeIds.size > 0) {
                apiFilters.types = Array.from(this.arrayFilters.typeIds);
            }
            if (this.arrayFilters.resolutionIds.size > 0) {
                apiFilters.resolutions = Array.from(this.arrayFilters.resolutionIds);
            }
            if (this.arrayFilters.genreIds.size > 0) {
                apiFilters.genres = Array.from(this.arrayFilters.genreIds);
            }

            // Convert boolean filters
            const booleanMappings = {
                'alive': 'alive',
                'dying': 'dying',
                'dead': 'dead',
                'internal': 'internal',
                'stream': 'stream',
                'featured': 'featured',
                'doubleup': 'doubleup',
                'freeleech': 'free'
            };

            this.booleanFilters.forEach(filter => {
                if (booleanMappings[filter]) {
                    apiFilters[booleanMappings[filter]] = true;
                }
            });

            // Add default sorting
            apiFilters.sortField = 'created_at';
            apiFilters.sortDirection = 'desc';

            return apiFilters;
        }

        // Build URL parameters for API request
        buildApiParams(filters) {
            const params = new URLSearchParams();
            params.append('api_token', this.apiManager.getApiKey());

            // Handle array parameters with [] notation
            const arrayParams = {
                categories: 'categories[]',
                types: 'types[]',
                resolutions: 'resolutions[]',
                genres: 'genres[]'
            };

            Object.entries(arrayParams).forEach(([key, paramName]) => {
                if (filters[key]?.length) {
                    filters[key].forEach(value => params.append(paramName, value));
                }
            });

            // Handle boolean and other parameters
            Object.entries(filters).forEach(([key, value]) => {
                if (!arrayParams[key]) { // Skip array params as they're already handled
                    if (typeof value === 'boolean') {
                        params.append(key, value ? 'true' : 'false');
                    } else if (value !== undefined && value !== null) {
                        params.append(key, value.toString());
                    }
                }
            });

            return params;
        }

        // Process API results into a usable format
        processApiResults(data) {
            return data.data.map(item => ({
                id: item.id,
                name: item.attributes.name,
                category: item.attributes.category,
                type: item.attributes.type,
                resolution: item.attributes.resolution,
                size: item.attributes.size,
                seeders: item.attributes.seeders,
                leechers: item.attributes.leechers,
                year: item.attributes.release_year,
                free: item.attributes.free,
                featured: item.attributes.featured,
                doubleup: item.attributes.doubleup,
                internal: item.attributes.internal
            }));
        }

        extractAndSaveUserAvatar() {
            const profileImage = document.querySelector('.top-nav__profile-image');
            if (profileImage) {
                const avatarUrl = profileImage.src;
                if (avatarUrl) {
                    try {
                        localStorage.setItem(this.USER_AVATAR_STORAGE, avatarUrl);
                        console.log('User avatar URL saved:', avatarUrl);
                        return avatarUrl;
                    } catch (error) {
                        console.error('Error saving user avatar URL:', error);
                    }
                }
            }
            return null;
        }

        getUserAvatar() {
            return localStorage.getItem(this.USER_AVATAR_STORAGE);
        }

        loadUserProfile() {
            try {
                const savedProfile = localStorage.getItem(this.USER_PROFILE_STORAGE);
                return savedProfile ? JSON.parse(savedProfile) : null;
            } catch (error) {
                console.error('Error loading user profile:', error);
                return null;
            }
        }

        saveUserProfile(profileData) {
            try {
                localStorage.setItem(this.USER_PROFILE_STORAGE, JSON.stringify(profileData));
                this.userProfile = profileData;
                return true;
            } catch (error) {
                console.error('Error saving user profile:', error);
                return false;
            }
        }

        loadFeaturesState() {
            try {
                const savedState = localStorage.getItem('fnp_features_state');
                if (!savedState) {
                    // Set default state if none exists
                    const defaultState = {
                        resolutionHighlighter: true // Default to enabled
                    };
                    localStorage.setItem('fnp_features_state', JSON.stringify(defaultState));
                    return defaultState;
                }
                return JSON.parse(savedState);
            } catch (e) {
                console.error('Error loading features state:', e);
                return { resolutionHighlighter: true };
            }
        }

        saveFeaturesState() {
            try {
                localStorage.setItem('fnp_features_state', JSON.stringify(this.featuresState));
            } catch (e) {
                console.error('Error saving features state:', e);
            }
        }

        toggleFeature(featureId, enabled) {
            console.log('Toggling feature:', featureId, enabled);
            this.featuresState[featureId] = enabled;
            this.saveFeaturesState();

            // Handle Resolution Highlighter specifically
            if (featureId === 'resolutionHighlighter') {
                if (enabled) {
                    window.dispatchEvent(new CustomEvent('enableResolutionHighlighter'));
                } else {
                    window.dispatchEvent(new CustomEvent('disableResolutionHighlighter'));
                }
            }
        }

        enableResolutionHighlighter() {
            // Remove data-processed attributes to allow reprocessing
            document.querySelectorAll('.torrent-search--grouped__name a[data-processed]')
                .forEach(el => el.removeAttribute('data-processed'));

            // Dispatch event to notify Resolution Highlighter
            window.dispatchEvent(new CustomEvent('enableResolutionHighlighter'));
        }

        disableResolutionHighlighter() {
            // Remove all resolution badges
            document.querySelectorAll('.resolution-badge').forEach(badge => {
                const title = badge.closest('.torrent-search--grouped__name a');
                if (title) {
                    title.removeAttribute('data-processed');
                }
                badge.remove();
            });

            // Dispatch event to notify Resolution Highlighter
            window.dispatchEvent(new CustomEvent('disableResolutionHighlighter'));
        }

        isFeatureEnabled(featureId) {
            return this.featuresState[featureId] || false;
        }

        // Add method to toggle language
        toggleLanguage(langCode) {
            if (this.arrayFilters.primaryLanguageNames.has(langCode)) {
                this.arrayFilters.primaryLanguageNames.delete(langCode);
            } else {
                this.arrayFilters.primaryLanguageNames.add(langCode);
            }

            // Save state and update URL
            this.saveState();
            this.updateURL();
        }

        getSerializableArrayFilters() {
            const serializable = {};
            Object.entries(this.arrayFilters).forEach(([key, set]) => {
                serializable[key] = Array.from(set);
            });
            return serializable;
        }

        initializeFilters() {
            DEBUG.log('Initializing Filters');

            // First check URL parameters
            const hasUrlFilters = this.loadFiltersFromURL();
            DEBUG.log('URL Filters Check', { hasUrlFilters });

            // If no URL filters, try to load saved state and apply it
            if (!hasUrlFilters && this.loadSavedState()) {
                DEBUG.log('Loaded Saved State, Applying Filters');

                // Generate URL with saved filters
                const newURL = this.getFilterURL();
                DEBUG.log('Redirecting to', { newURL });

                // Only redirect if the URL is different
                if (newURL !== window.location.href) {
                    window.location.href = newURL;
                }
            }
        }


        // Save current filter state
        saveState() {
            DEBUG.log('Saving State - Current Filters', this.getSerializableArrayFilters());

            const state = {
                arrayFilters: this.getSerializableArrayFilters(),
                booleanFilters: Array.from(this.booleanFilters),
                timestamp: new Date().toISOString()
            };

            // Check if there are any filters to save
            const hasFilters = Object.values(state.arrayFilters).some(arr => arr.length > 0) ||
                  state.booleanFilters.length > 0;

            if (hasFilters) {
                try {
                    const stateString = JSON.stringify(state);
                    localStorage.setItem('fnp_filter_state', stateString);
                    DEBUG.log('State Saved Successfully', state);
                    return true;
                } catch (error) {
                    console.error('Error saving state:', error);
                    return false;
                }
            } else {
                DEBUG.log('No Filters to Save', state);
                localStorage.removeItem('fnp_filter_state');
                return false;
            }
        }

        // Load saved filter state
        loadSavedState() {
            DEBUG.log('Loading Saved State');

            try {
                const savedStateString = localStorage.getItem('fnp_filter_state');
                if (!savedStateString) {
                    DEBUG.log('No Saved State Found');
                    return false;
                }

                const savedState = JSON.parse(savedStateString);
                DEBUG.log('Found Saved State', savedState);

                // Validate saved state
                if (!savedState.arrayFilters || !savedState.timestamp) {
                    DEBUG.log('Invalid Saved State');
                    return false;
                }

                // Clear current filters
                Object.keys(this.arrayFilters).forEach(key => {
                    this.arrayFilters[key].clear();
                });
                this.booleanFilters.clear();

                // Restore array filters
                let hasFilters = false;
                Object.entries(savedState.arrayFilters).forEach(([key, values]) => {
                    if (this.arrayFilters.hasOwnProperty(key) && Array.isArray(values)) {
                        this.arrayFilters[key] = new Set(values);
                        if (values.length > 0) hasFilters = true;
                        DEBUG.log(`Restored ${key}`, Array.from(this.arrayFilters[key]));
                    }
                });

                // Restore boolean filters
                if (Array.isArray(savedState.booleanFilters)) {
                    this.booleanFilters = new Set(savedState.booleanFilters);
                    if (savedState.booleanFilters.length > 0) hasFilters = true;
                    DEBUG.log('Restored Boolean Filters', Array.from(this.booleanFilters));
                }

                DEBUG.log('State Restored Successfully', {
                    hasFilters,
                    arrayFilters: this.getSerializableArrayFilters(),
                    booleanFilters: Array.from(this.booleanFilters)
                });

                return hasFilters;
            } catch (error) {
                console.error('Error loading saved state:', error);
                return false;
            }
        }

        // Add this new method to check current state
        logCurrentState() {
            DEBUG.log('Current State', {
                arrayFilters: Object.fromEntries(
                    Object.entries(this.arrayFilters).map(([key, set]) => [key, Array.from(set)])
                ),
                booleanFilters: Array.from(this.booleanFilters)
            });
        }

        // URL Utilities
        getFilterURL() {
            DEBUG.log('Generating Filter URL');

            const params = new URLSearchParams();

            // Preserve view parameter
            const currentParams = new URLSearchParams(window.location.search);
            const viewParam = currentParams.get('view');
            if (viewParam) {
                params.append('view', viewParam);
            }

            // Add array parameters
            Object.entries(this.arrayFilters).forEach(([key, valueSet]) => {
                let index = 0;
                valueSet.forEach(value => {
                    params.append(`${key}[${index}]`, value);
                    index++;
                });
            });

            // Add boolean parameters
            this.booleanFilters.forEach(key => {
                params.append(key, 'true');
            });

            const newURL = `${this.TORRENTS_PAGE}?${params.toString()}`;
            DEBUG.log('Generated URL', { newURL, params: params.toString() });
            return newURL;
        }

        // Load saved filters from localStorage
        loadSavedFilters() {
            try {
                const saved = localStorage.getItem('fnp_saved_filters');
                DEBUG.log('Loading Saved Filters', { savedData: saved });
                return saved ? JSON.parse(saved) : {};
            } catch (error) {
                console.error('Error loading saved filters:', error);
                return {};
            }
        }

        // Save current filters with a name
        saveCurrentFilters(name) {
            try {
                const currentState = {
                    arrayFilters: {},
                    booleanFilters: Array.from(this.booleanFilters),
                    timestamp: new Date().toISOString()
                };

                // Convert Sets to Arrays for storage
                Object.entries(this.arrayFilters).forEach(([key, value]) => {
                    currentState.arrayFilters[key] = Array.from(value);
                });

                this.savedFilters[name] = currentState;
                localStorage.setItem('fnp_saved_filters', JSON.stringify(this.savedFilters));

                return true;
            } catch (error) {
                console.error('Error saving filters:', error);
                return false;
            }
        }

        // Load a saved filter set
        loadSavedFilter(name) {
            try {
                const savedState = this.savedFilters[name];
                if (!savedState) return false;

                // Clear current filters
                this.clearFilters();

                // Restore array filters
                Object.entries(savedState.arrayFilters).forEach(([key, values]) => {
                    this.arrayFilters[key] = new Set(values);
                });

                // Restore boolean filters
                this.booleanFilters = new Set(savedState.booleanFilters);

                this.updateURL();
                return true;
            } catch (error) {
                console.error('Error loading saved filter:', error);
                return false;
            }
        }

        // Delete a saved filter set
        deleteSavedFilter(name) {
            try {
                delete this.savedFilters[name];
                localStorage.setItem('fnp_saved_filters', JSON.stringify(this.savedFilters));
                return true;
            } catch (error) {
                console.error('Error deleting saved filter:', error);
                return false;
            }
        }

        // Get all saved filters
        getSavedFilters() {
            DEBUG.log('Getting Saved Filters', this.savedFilters);

            if (!this.savedFilters || typeof this.savedFilters !== 'object') {
                DEBUG.log('No Valid Saved Filters Found');
                return [];
            }

            return Object.entries(this.savedFilters).map(([name, data]) => ({
                name,
                timestamp: data.timestamp || new Date().toISOString(),
                filterCount: this.countFilters(data),
                filters: data // Include full filter data for details view
            }));
        }

        // Helper method to count filters
        countFilters(data) {
            let count = 0;
            if (data.arrayFilters) {
                count += Object.values(data.arrayFilters)
                    .reduce((total, arr) => total + (Array.isArray(arr) ? arr.length : 0), 0);
            }
            if (Array.isArray(data.booleanFilters)) {
                count += data.booleanFilters.length;
            }
            return count;
        }

        // Export current filters as a shareable string
        exportFilters() {
            try {
                const state = {
                    arrayFilters: {},
                    booleanFilters: Array.from(this.booleanFilters)
                };

                Object.entries(this.arrayFilters).forEach(([key, value]) => {
                    state.arrayFilters[key] = Array.from(value);
                });

                return btoa(JSON.stringify(state));
            } catch (error) {
                console.error('Error exporting filters:', error);
                return null;
            }
        }

        // Import filters from a shared string
        importFilters(encodedState) {
            try {
                const state = JSON.parse(atob(encodedState));

                // Clear current filters
                this.clearFilters();

                // Restore array filters
                Object.entries(state.arrayFilters).forEach(([key, values]) => {
                    this.arrayFilters[key] = new Set(values);
                });

                // Restore boolean filters
                this.booleanFilters = new Set(state.booleanFilters);

                this.updateURL();
                return true;
            } catch (error) {
                console.error('Error importing filters:', error);
                return false;
            }
        }

        // New method to handle all sections in a group
        getGroupSectionIds(groupId) {
            const group = Object.values(FILTER_GROUPS).find(g => g.id === groupId);
            if (!group) return [];
            return group.sections.map(section => section.id);
        }

        // New method to select all filters in a group
        selectAllInGroup(groupId) {
            const sectionIds = this.getGroupSectionIds(groupId);
            sectionIds.forEach(sectionId => {
                this.selectAllInSection(sectionId);
            });
            this.updateURL();
        }

        // New method to clear all filters in a group
        clearAllInGroup(groupId) {
            const sectionIds = this.getGroupSectionIds(groupId);
            sectionIds.forEach(sectionId => {
                this.clearSection(sectionId);
            });
            this.updateURL();
        }

        // Helper function to safely get filter array by reference
        getFilterArray(arrayRef) {
            // If it's already an array, return it
            if (Array.isArray(arrayRef)) return arrayRef;

            // If it's a string reference to our filter arrays
            switch(arrayRef) {
                case 'CATEGORIES':
                    return CATEGORIES;
                case 'TYPES':
                    return TYPES;
                case 'RESOLUTIONS':
                    return RESOLUTIONS;
                case 'GENRES':
                    return GENRES;
                case 'TAGS':
                    return TAGS;
                case 'HEALTH':
                    return HEALTH;
                case 'HISTORY':
                    return HISTORY;
                case 'BUFF.FREELEECH':
                    return BUFF.FREELEECH;
                case 'BUFF.SPECIAL':
                    return BUFF.SPECIAL;
                case 'PRIMARY_LANGUAGE':
                    return PRIMARY_LANGUAGE;
                case 'FEATURES':
                    return FEATURES;
                default:
                    console.warn(`Filter array ${arrayRef} not found`);
                    return [];
            }
        }

        // New methods that use getFilterArray
        getGroupFilters(groupId) {
            const group = Object.values(FILTER_GROUPS).find(g => g.id === groupId);
            if (!group) return [];

            return group.sections.flatMap(section => {
                const filterArray = this.getFilterArray(section.filterArray);
                return {
                    sectionId: section.id,
                    filters: filterArray
                };
            });
        }

        getSectionSelectedCount(sectionId) {
            const section = Object.values(FILTER_GROUPS)
            .flatMap(group => group.sections)
            .find(s => s.id === sectionId);

            if (!section) return 0;

            // Special handling for freeleech
            if (section.id === 'freeleech') {
                return this.arrayFilters.free.size;
            }

            // Handle other boolean filter sections
            if (['tags', 'health', 'history', 'special'].includes(section.id)) {
                const filterArray = this.getFilterArray(section.filterArray);
                return filterArray.filter(filter =>
                                          this.booleanFilters.has(filter.urlParam)
                                         ).length;
            }

            // For array filters
            const filterKey = section.filterKey;
            if (this.arrayFilters.hasOwnProperty(filterKey)) {
                return this.arrayFilters[filterKey].size;
            }

            return 0;
        }

        // Get total selected filters in a group
        getGroupSelectedCount(groupId) {
            const group = Object.values(FILTER_GROUPS).find(g => g.id === groupId);
            if (!group) return 0;

            return group.sections.reduce((total, section) =>
                                         total + this.getSectionSelectedCount(section.id), 0);
        }

        // Toggle section expanded state
        toggleSection(sectionId) {
            if (this.expandedSections.has(sectionId)) {
                this.expandedSections.delete(sectionId);
            } else {
                this.expandedSections.add(sectionId);
            }
        }

        isSectionExpanded(sectionId) {
            return this.expandedSections.has(sectionId);
        }

        // Set active filter group
        setActiveGroup(groupId) {
            this.activeGroup = groupId;
        }

        // Get currently active group
        getActiveGroup() {
            return this.activeGroup;
        }

        // Get all groups
        getGroups() {
            return Object.entries(FILTER_GROUPS).map(([name, group]) => ({
                name,
                id: group.id,
                icon: group.icon,
                description: group.description,
                selectedCount: this.getGroupSelectedCount(group.id)
            }));
        }

        // Get all sections for a group
        getGroupSections(groupId) {
            const group = Object.values(FILTER_GROUPS).find(g => g.id === groupId);
            if (!group) return [];

            return group.sections.map(section => ({
                id: section.id,
                name: section.name,
                icon: section.icon,
                description: section.description,
                expanded: this.isSectionExpanded(section.id),
                selectedCount: this.getSectionSelectedCount(section.id),
                summary: this.getSectionSummary(section.id),
                filters: this.getFilterArray(section.filterArray)
            }));
        }

        getSectionSummary(sectionId) {
            const section = Object.values(FILTER_GROUPS)
            .flatMap(group => group.sections)
            .find(s => s.id === sectionId);

            if (!section) return '';

            const filterArray = this.getFilterArray(section.filterArray);
            const selectedFilters = [];

            // Special handling for freeleech
            if (section.id === 'freeleech') {
                filterArray.forEach(filter => {
                    if (this.arrayFilters.free.has(filter.value.toString())) {
                        selectedFilters.push(filter.name);
                    }
                });
            }
            // Handle other boolean filter sections
            else if (['tags', 'health', 'history', 'special'].includes(section.id)) {
                filterArray.forEach(filter => {
                    if (this.booleanFilters.has(filter.urlParam)) {
                        selectedFilters.push(filter.name);
                    }
                });
            } else {
                // Handle array filters
                if (this.arrayFilters.hasOwnProperty(section.filterKey)) {
                    for (const value of this.arrayFilters[section.filterKey]) {
                        const filter = filterArray.find(f => f.value?.toString() === value);
                        if (filter) selectedFilters.push(filter.name);
                    }
                }
            }

            return selectedFilters.join(', ');
        }

        // Get active filters summary for display
        getActiveFiltersSummary() {
            const summary = [];

            Object.values(FILTER_GROUPS).forEach(group => {
                group.sections.forEach(section => {
                    const filterArray = this.getFilterArray(section.filterArray);
                    const sectionSummary = this.getSectionSummary(section.id);

                    if (sectionSummary) {
                        summary.push({
                            groupId: group.id,
                            sectionId: section.id,
                            sectionName: section.name,
                            filters: sectionSummary.split(', ').map(name => {
                                const filter = filterArray.find(f => f.name === name);
                                return {
                                    name,
                                    value: filter?.value || filter?.urlParam,
                                    icon: section.icon
                                };
                            })
                        });
                    }
                });
            });

            return summary;
        }

        // Search through filters
        searchFilters(query) {
            if (!query) return [];

            const results = [];
            const searchTerm = query.toLowerCase();

            Object.entries(FILTER_GROUPS).forEach(([groupName, group]) => {
                group.sections.forEach(section => {
                    const filterArray = this.getFilterArray(section.filterArray);
                    const matches = filterArray.filter(filter =>
                                                       filter.name.toLowerCase().includes(searchTerm)
                                                      );

                    if (matches.length > 0) {
                        results.push({
                            groupName,
                            groupId: group.id,
                            sectionName: section.name,
                            sectionId: section.id,
                            matches: matches.map(filter => ({
                                ...filter,
                                active: this.isFilterActive(section.id, filter.value || filter.urlParam)
                            }))
                        });
                    }
                });
            });

            return results;
        }

        // Select all filters in a section
        selectAllInSection(sectionId) {
            const section = Object.values(FILTER_GROUPS)
            .flatMap(group => group.sections)
            .find(s => s.id === sectionId);

            if (!section) return;

            console.log('Selecting all in section:', sectionId);

            const filterArray = this.getFilterArray(section.filterArray);

            filterArray.forEach(filter => {
                // Special handling for freeleech
                if (section.id === 'freeleech') {
                    const value = filter.value.toString();
                    console.log('Adding freeleech value:', value);
                    this.arrayFilters.free.add(value);
                    return;
                }

                // Handle other boolean filter sections
                if (['tags', 'health', 'history', 'special'].includes(section.id)) {
                    this.booleanFilters.add(filter.urlParam);
                    return;
                }

                // For array filters
                const filterKey = section.filterKey;
                if (this.arrayFilters.hasOwnProperty(filterKey)) {
                    this.arrayFilters[filterKey].add(filter.value.toString());
                }
            });
            this.updateURL();
        }

        // Clear all filters in a section
        clearSection(sectionId) {
            const section = Object.values(FILTER_GROUPS)
            .flatMap(group => group.sections)
            .find(s => s.id === sectionId);

            if (!section) return;

            // Special handling for freeleech
            if (section.id === 'freeleech') {
                this.arrayFilters.free.clear();
                return;
            }

            // Handle other boolean filter sections
            if (['tags', 'health', 'history', 'special'].includes(section.id)) {
                const filterArray = this.getFilterArray(section.filterArray);
                filterArray.forEach(filter => {
                    this.booleanFilters.delete(filter.urlParam);
                });
                return;
            }

            // For array filters
            const filterKey = section.filterKey;
            if (this.arrayFilters.hasOwnProperty(filterKey)) {
                this.arrayFilters[filterKey].clear();
            }
        }


        loadFiltersFromURL() {
            const params = new URLSearchParams(window.location.search);
            let hasFilters = false;

            // Clear existing filters
            Object.keys(this.arrayFilters).forEach(key => {
                this.arrayFilters[key].clear();
            });
            this.booleanFilters.clear();

            // Load all parameters
            for (const [key, value] of params.entries()) {
                // Skip the view parameter
                if (key === 'view') continue;

                // Handle array-style parameters
                const baseKey = key.replace(/\[\d+\]$/, '');
                if (this.arrayFilters.hasOwnProperty(baseKey)) {
                    this.arrayFilters[baseKey].add(value);
                    hasFilters = true;
                }
                // Handle boolean parameters
                else if (this.isBooleanParameter(key)) {
                    if (value === 'true') {
                        this.booleanFilters.add(key);
                        hasFilters = true;
                    }
                }
            }

            return hasFilters;
        }


        updateURL() {
            if (!this.isFearnopeerTorrentsPage()) {
                return;
            }

            const params = new URLSearchParams();

            // Preserve view parameter if it exists
            const currentParams = new URLSearchParams(window.location.search);
            const viewParam = currentParams.get('view');
            if (viewParam) {
                params.append('view', viewParam);
            }

            // Add array-style parameters with indices
            Object.entries(this.arrayFilters).forEach(([key, valueSet]) => {
                let index = 0;
                valueSet.forEach(value => {
                    params.append(`${key}[${index}]`, value);
                    index++;
                });
            });

            // Add boolean parameters
            this.booleanFilters.forEach(key => {
                params.append(key, 'true');
            });

            const newURL = `${this.TORRENTS_PAGE}?${params.toString()}`;

            // Return URL without dispatching events that might cause errors
            return newURL;
        }

        async applyFilters() {
            if (!this.isFearnopeerTorrentsPage()) return;

            // Save current state
            this.saveState();

            // Generate and navigate to new URL with filters
            const newURL = this.updateURL();
            if (newURL !== window.location.href) {
                window.location.href = newURL;
            }
        }

        // Toggle filter with section context
        toggleSectionFilter(sectionId, value) {

            // Add at the start of the method
            console.group('Category Filter Toggle');
            console.log('Section:', sectionId);
            console.log('Value:', value);
            console.log('Current array filters:', this.getSerializableArrayFilters());

            const section = Object.values(FILTER_GROUPS)
            .flatMap(group => group.sections)
            .find(s => s.id === sectionId);

            if (!section) return;

            // Special handling for features
            if (section.id === 'displayFeatures') {
                const isEnabled = !this.isFeatureEnabled(value);
                this.toggleFeature(value, isEnabled);
                return;
            }

            // Track the change
            DEBUG.log('Toggle Filter Before', {
                sectionId,
                value,
                currentState: this.getSerializableArrayFilters()
            });

            if (section.id === 'freeleech') {
                if (this.arrayFilters.free.has(value.toString())) {
                    this.arrayFilters.free.delete(value.toString());
                } else {
                    this.arrayFilters.free.add(value.toString());
                }
            } else if (['tags', 'health', 'history', 'special'].includes(section.id)) {
                if (this.booleanFilters.has(value)) {
                    this.booleanFilters.delete(value);
                } else {
                    this.booleanFilters.add(value);
                }
            } else {
                const filterKey = section.filterKey;
                if (this.arrayFilters.hasOwnProperty(filterKey)) {
                    if (this.arrayFilters[filterKey].has(value.toString())) {
                        this.arrayFilters[filterKey].delete(value.toString());
                    } else {
                        this.arrayFilters[filterKey].add(value.toString());
                    }
                }
            }

            DEBUG.log('Toggle Filter After', {
                sectionId,
                value,
                newState: this.getSerializableArrayFilters()
            });

            console.log('Updated array filters:', this.getSerializableArrayFilters());
            console.groupEnd();
        }

        toggleFilter(filterType, filter) {
            if (!this.isFearnopeerTorrentsPage()) {
                console.log('Filter functionality only available on torrents page');
                return;
            }

            const key = filter.urlParam;
            const value = filter.value?.toString() || filter.urlParam;

            console.log('toggleFilter:', { key, value }); // Add debugging

            // Handle array-style filters
            if (this.arrayFilters.hasOwnProperty(key)) {
                if (this.isArrayFilterActive(key, value)) {
                    console.log('Removing filter:', key, value);
                    this.arrayFilters[key].delete(value);
                } else {
                    console.log('Adding filter:', key, value);
                    this.arrayFilters[key].add(value);
                }
            }
            // Handle boolean filters
            else if (this.isBooleanParameter(key)) {
                if (this.isBooleanFilterActive(key)) {
                    this.booleanFilters.delete(key);
                } else {
                    this.booleanFilters.add(key);
                }
            }

            this.updateURL();
        }

        addFilter(key, value) {
            if (key !== 'view') { // Prevent manually adding view parameter
                this.activeFilters.set(key, value);
                this.updateURL();
            }
        }

        removeFilter(key, value) {
            if (key !== 'view') { // Prevent removing view parameter
                this.activeFilters.delete(key);
                this.updateURL();
            }
        }

        // Check if a filter is active
        isFilterActive(sectionId, value) {
            const section = Object.values(FILTER_GROUPS)
            .flatMap(group => group.sections)
            .find(s => s.id === sectionId);

            if (!section) return false;

            // Handle features differently
            if (section.id === 'displayFeatures') {
                return this.isFeatureEnabled(value);
            }

            // Special handling for freeleech
            if (section.id === 'freeleech') {
                return this.arrayFilters.free.has(value.toString());
            }

            // Handle other boolean filter sections
            if (['tags', 'health', 'history', 'special'].includes(section.id)) {
                return this.booleanFilters.has(value);
            }

            // For array filters
            const filterKey = section.filterKey;
            if (this.arrayFilters.hasOwnProperty(filterKey)) {
                return this.arrayFilters[filterKey].has(value.toString());
            }

            return false;
        }

        isArrayFilterActive(key, value) {
            return this.arrayFilters[key]?.has(value?.toString());
        }

        isBooleanFilterActive(key) {
            return this.booleanFilters.has(key);
        }

        isBooleanParameter(key) {
            // Check if the parameter is a tag value
            return TAGS.some(tag => tag.urlParam === key) ||
                HEALTH.some(status => status.urlParam === key) ||
                HISTORY.some(status => status.urlParam === key) ||
                BUFF.SPECIAL.some(special => special.urlParam === key);
        }

        clearFilters() {
            Object.keys(this.arrayFilters).forEach(key => {
                this.arrayFilters[key].clear();
            });
            this.booleanFilters.clear();
            localStorage.removeItem('fnp_filter_state');
        }

        getActiveFilters() {
            const filters = {};
            // Get array filters
            Object.entries(this.arrayFilters).forEach(([key, valueSet]) => {
                filters[key] = Array.from(valueSet);
            });

            // Get boolean filters
            this.booleanFilters.forEach(key => {
                filters[key] = true;
            });

            return filters;
        }

        isFearnopeerTorrentsPage() {
            try {
                const url = new URL(window.location.href);
                return url.pathname === '/torrents' ||
                    url.pathname === '/torrents/' ||
                    (url.pathname === '/torrents' && url.search.length > 0);
            } catch (e) {
                console.error('URL parsing error:', e);
                return false;
            }
        }
    }

    class FilterTrigger {
        constructor(filterUI) {
            this.filterUI = filterUI;
            this.buffer = '';
            this.promptElement = null;
            this.timeoutId = null;
            this.canTrigger = false;
            this.fKeyPressTime = null;
            this.fKeyHoldDuration = 500;
            this.init();
        }

        init() {
            // Create prompt element
            this.createPrompt();
            this.setupKeyListener();
        }

        setupKeyListener() {
            // Handle key press
            document.addEventListener('keydown', (e) => {

                // Check for Enter key when trigger is active
                if (e.key === 'Enter' && this.canTrigger) {
                    e.preventDefault();
                    this.hidePrompt();
                    if (this.filterUI) {
                        this.filterUI.show();
                    }
                    return;
                }

                // Start timing when F is pressed
                if (e.key.toLowerCase() === 'f' && !this.fKeyPressTime) {
                    this.fKeyPressTime = Date.now();
                }
            });

            // Handle key release
            document.addEventListener('keyup', (e) => {
                if (e.key.toLowerCase() === 'f') {
                    const holdDuration = Date.now() - this.fKeyPressTime;

                    if (holdDuration >= this.fKeyHoldDuration) {
                        this.showPrompt();
                    }

                    // Reset the press time
                    this.fKeyPressTime = null;
                }
            });
        }

        createPrompt() {
            this.promptElement = document.createElement('div');
            this.promptElement.className = 'filter-prompt hidden';
            this.promptElement.textContent = '⚡ Press [ENTER] to open the system';
            document.body.appendChild(this.promptElement);
        }



        showPrompt() {
            if (this.timeoutId) {
                clearTimeout(this.timeoutId);
            }

            if (this.promptElement) {
                this.promptElement.classList.remove('hidden');
                requestAnimationFrame(() => {
                    this.promptElement.classList.add('visible');
                });
            }

            this.canTrigger = true;

            this.timeoutId = setTimeout(() => {
                this.hidePrompt();
            }, 1500);
        }

        hidePrompt() {
            if (this.promptElement) {
                this.promptElement.classList.remove('visible');
                setTimeout(() => {
                    this.promptElement.classList.add('hidden');
                }, 300);
            }
            this.canTrigger = false;
            this.timeoutId = null;
        }
    }

    class FilterUI {
        constructor(filterManager) {
            console.log('FilterUI constructor called');
            this.filterManager = filterManager;
            this.container = null;
            this.saveModalVisible = false;
            this.sidebarExpanded = false;
            this.rankMapping = this.initializeRankMapping();
            this.userStats = this.scrapeUserStats();
            this.sortMenu = new SortMenu(this);
            this.currentSearchState = null;
            this.init();
        }

        init() {
            console.log('FilterUI init called');
            // Create container first
            this.container = this.createContainer();
            // Add it to document body
            document.body.appendChild(this.container);

            // Add styles
            const styleSheet = document.createElement('style');
            styleSheet.textContent = STYLES;
            document.head.appendChild(styleSheet);

            // Add the sidepanel to the filter modal
            const filterModal = this.container.querySelector('.filter-modal');
            if (filterModal) {
                console.log('Found filter modal, adding sidepanel');
                filterModal.insertAdjacentHTML('beforeend', this.getApiSidepanelTemplate());
            }

            // Setup event listeners
            this.setupEventListeners();
        }

        renderSearchPagination(meta) {
            console.group('Render Search Pagination');
            console.log('Pagination meta:', meta);

            // Calculate total pages based on our filtered results
            const totalPages = Math.ceil(meta.total / meta.per_page);
            const currentPage = meta.current_page;

            // Generate pagination HTML
            const paginationHTML = `
<div class="pagination-controls">
            <button class="pagination-button"
                    ${currentPage === 1 ? 'disabled' : ''}
                    data-action="prev">
                <span class="pagination-icon">«</span>
            </button>

            <div class="pagination-numbers">
                ${this.generateSearchPaginationNumbers(currentPage, totalPages)}
            </div>

            <button class="pagination-button"
                    ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}
                    data-action="next">
                <span class="pagination-icon">»</span>
            </button>
        </div>`;

            console.log('Current page:', currentPage, 'Total pages:', totalPages);
            console.groupEnd();
            return paginationHTML;
        }

        // Update the generateSearchPaginationNumbers method
        generateSearchPaginationNumbers(currentPage, totalPages) {
            console.log('Generating search page numbers:', { currentPage, totalPages });

            // Ensure we have valid numbers
            currentPage = parseInt(currentPage) || 1;
            // If totalPages is NaN, default to currentPage + 1 to ensure "next" works
            totalPages = parseInt(totalPages) || (currentPage + 1);

            let pages = [];
            const maxVisible = 5;

            if (totalPages <= maxVisible) {
                // Show all pages if total is less than max visible
                for (let i = 1; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                // Always show first page
                pages.push(1);

                let start = Math.max(2, currentPage - 1);
                let end = Math.min(totalPages - 1, currentPage + 1);

                // Add ellipsis if needed before middle pages
                if (start > 2) {
                    pages.push('...');
                }

                // Add middle pages
                for (let i = start; i <= end; i++) {
                    pages.push(i);
                }

                // Add ellipsis if needed before last page
                if (end < totalPages - 1) {
                    pages.push('...');
                }

                // Add last page if we have more than one page
                if (totalPages > 1) {
                    pages.push(totalPages);
                }
            }

            return pages.map(page => {
                if (page === '...') {
                    return '<span class="pagination-ellipsis">...</span>';
                }
                return `
            <button class="pagination-number ${page === currentPage ? 'active' : ''}"
                    ${page === currentPage ? 'disabled' : ''}
                    data-page="${page}">
                ${page}
            </button>
        `;
            }).join('');
        }

        setupSearchFunctionality() {
            console.log('Setting up search functionality');

            const searchBtn = this.container.querySelector('.search-trigger-button');
            const searchOverlay = this.container.querySelector('.search-overlay');
            const searchInput = this.container.querySelector('.search-input');
            const closeBtn = this.container.querySelector('.search-close');

            if (!searchBtn || !searchOverlay || !searchInput || !closeBtn) {
                console.error('Search elements not found');
                return;
            }

            // Show search modal
            searchBtn.addEventListener('click', () => {
                searchOverlay.classList.remove('hidden');
                requestAnimationFrame(() => {
                    searchOverlay.classList.add('active');
                    searchInput.focus();
                });
            });

            // Handle enter key in search input
            searchInput.addEventListener('keypress', async (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const searchTerm = searchInput.value.trim();

                    if (searchTerm) {
                        console.log('Processing search term:', searchTerm);

                        try {
                            // Process search with term
                            const results = await this.filterResults(searchTerm);
                            if (results.success && results.results) { // Add this check
                                this.renderApiResults(results);
                            }

                            if (results.success) {
                                // Hide search modal
                                searchOverlay.classList.remove('active');
                                setTimeout(() => {
                                    searchOverlay.classList.add('hidden');
                                }, 300);

                                // Switch to results tab if needed
                                const resultsTab = this.container.querySelector('[data-tab="results"]');
                                if (resultsTab) resultsTab.click();

                                // Render results
                                this.renderApiResults(results);

                                // Setup pagination listeners
                                const resultsContent = this.container.querySelector('[data-tab-content="results"]');
                                if (resultsContent) {
                                    this.setupPaginationListeners(resultsContent);
                                }
                            }
                        } catch (error) {
                            console.error('Search error:', error);
                            this.showNotification('Error performing search: ' + error.message, 'error');
                        }
                    }
                }
            });

            // × button handler (clears state and refreshes results)
            closeBtn.addEventListener('click', async () => {
                console.log('Search close button clicked');

                // Clear search state
                this.clearSearchState();

                // Hide modal
                searchOverlay.classList.remove('active');
                setTimeout(() => {
                    searchOverlay.classList.add('hidden');
                }, 300);

                // Reset to default results
                try {
                    const results = await this.filterManager.fetchFilteredTorrents(
                        1, 50,
                        { field: 'created_at', direction: 'desc' }
                    );

                    if (results.success) {
                        this.renderApiResults(results);
                    }
                } catch (error) {
                    console.error('Error refreshing results:', error);
                    this.showNotification('Error refreshing results', 'error');
                }
            });

            // Modal close without clearing state (Escape key)
            searchOverlay.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.hideSearchModal();
                }
            });

            // Modal close without clearing state (outside click)
            searchOverlay.addEventListener('click', (e) => {
                if (e.target === searchOverlay) {
                    this.hideSearchModal();
                }
            });

        }

        async filterResults(searchTerm, page = 1) {
            console.group('Search Process');
            console.log('Search request:', { searchTerm, page });

            try {
                // Initialize new search state if it's a new search
                if (!this.currentSearchState || this.currentSearchState.searchTerm !== searchTerm) {
                    console.log('New search initiated:', searchTerm);

                    // Make initial API request
                    const response = await this.filterManager.fetchFilteredTorrents(
                        1, // Always start with page 1 for new search
                        100, // Get maximum results per request
                        this.sortMenu?.currentSort || { field: 'created_at', direction: 'desc' },
                        { name: searchTerm }
                    );

                    if (!response.success) {
                        throw new Error(response.error || 'API request failed');
                    }

                    // Initialize state with first batch
                    this.currentSearchState = {
                        searchTerm,
                        lastProcessedApiPage: 1,
                        lastApiResults: response.results.data,
                        hasMoreApiResults: response.results.data.length === 100,
                        totalResults: response.results.meta.total || response.results.data.length,
                        totalPages: Math.ceil((response.results.meta.total || response.results.data.length) / 50),
                        sort: this.sortMenu?.currentSort || { field: 'created_at', direction: 'desc' }
                    };
                }

                // Calculate pagination indices
                const startIndex = (page - 1) * 50;
                const endIndex = startIndex + 50;

                return {
                    success: true,
                    results: {
                        data: this.currentSearchState.lastApiResults.slice(startIndex, endIndex),
                        meta: {
                            current_page: page,
                            per_page: 50,
                            total: this.currentSearchState.totalResults,
                            from: startIndex + 1,
                            to: Math.min(endIndex, this.currentSearchState.totalResults),
                            last_page: Math.ceil(this.currentSearchState.totalResults / 50)
                        }
                    }
                };

            } catch (error) {
                console.error('Search error:', error);
                return { success: false, error: error.message };
            } finally {
                console.groupEnd();
            }
        }

        async fetchMoreResults() {
            const nextPage = this.currentSearchState.lastProcessedApiPage + 1;
            const response = await this.filterManager.fetchFilteredTorrents(
                nextPage,
                100,
                this.currentSearchState.sort,
                { name: this.currentSearchState.searchTerm }
            );

            if (!response.success) {
                this.currentSearchState.hasMoreApiResults = false;
                return [];
            }

            this.currentSearchState.lastProcessedApiPage = nextPage;
            this.currentSearchState.hasMoreApiResults = response.results.data.length === 100;

            return response.results.data;
        }

        filterClientSide(results) {
            const { parsedTerms, caseSensitive } = this.currentSearchState;
            console.log('Filtering batch:', { resultsCount: results.length, terms: parsedTerms });

            return results.filter(item => {
                const name = caseSensitive ?
                      item.attributes.name :
                item.attributes.name.toLowerCase();

                // Include terms (with word boundary check)
                const includesAll = parsedTerms.include.every(term => {
                    const searchTerm = caseSensitive ? term : term.toLowerCase();

                    // If term is in quotes, do exact match
                    if (term.startsWith('"') && term.endsWith('"')) {
                        const exactTerm = term.slice(1, -1);
                        return name.includes(exactTerm);
                    }

                    // Otherwise do word boundary match
                    const regex = new RegExp(`\\b${searchTerm}\\b`, caseSensitive ? '' : 'i');
                    return regex.test(name);
                });

                // Rest of the filtering logic stays the same...
                const excludesAll = parsedTerms.exclude.every(term => {
                    const searchTerm = caseSensitive ? term : term.toLowerCase();
                    return !name.includes(searchTerm);
                });

                const matchesEither = parsedTerms.either.length === 0 ||
                      parsedTerms.either.some(term => {
                          const searchTerm = caseSensitive ? term : term.toLowerCase();
                          return name.includes(searchTerm);
                      });

                return includesAll && excludesAll && matchesEither;
            });
        }

        handleSidepanelState(expanded) {
            const sidepanel = this.container.querySelector('.api-sidepanel');
            if (!sidepanel) return;

            this.sidebarExpanded = expanded;
            sidepanel.classList.toggle('expanded', expanded);

            if (!expanded) {
                const expandedPanel = sidepanel.querySelector('.api-expanded-panel');
                if (expandedPanel) {
                    expandedPanel.dataset.activeTab = '';
                }
            }
        }

        async applySort({ field, direction }) {
            console.log('applySort called with:', { field, direction });

            const resultsContainer = this.container.querySelector('[data-tab-content="results"]');
            const sortButton = resultsContainer?.querySelector('.sort-button');
            const originalButtonHtml = sortButton?.innerHTML;

            try {
                // Update sort menu state first
                if (this.sortMenu) {
                    this.sortMenu.currentSort = { field, direction };
                    this.sortMenu.saveSortState();
                }

                if (sortButton) {
                    sortButton.disabled = true;
                    sortButton.innerHTML = '<span class="loading-spinner"></span> Sorting...';
                }

                const results = await this.filterManager.fetchFilteredTorrents(1, 50, { field, direction });

                // Switch to results tab
                const resultsTab = this.container.querySelector('[data-tab="results"]');
                if (resultsTab) resultsTab.click();

                // Render the new results
                this.renderApiResults(results);

                this.showNotification(`Sorted by ${this.getSortLabel(field)} ${direction === 'desc' ? '(Descending)' : '(Ascending)'}`);

            } catch (error) {
                console.error('Sort error:', error);
                this.showNotification('Error applying sort: ' + error.message, 'error');

                if (sortButton && originalButtonHtml) {
                    sortButton.disabled = false;
                    sortButton.innerHTML = originalButtonHtml;
                }
            }
        }

        // Helper method to get user-friendly sort field names
        getSortLabel(field) {
            const labels = {
                'created_at': 'Upload Date',
                'size': 'Size',
                'seeders': 'Seeders',
                'leechers': 'Leechers',
                'name': 'Name',
                'times_completed': 'Times Completed'
            };
            return labels[field] || field;
        }

        initializeRankMapping() {
            return [
                { icon: 'fa-times-circle', title: 'Pruned', color: '#575757' },
                { icon: 'fa-ban', title: 'Banned', color: '#575757' },
                { icon: 'fa-pause-circle', title: 'Disabled', color: '#575757' },
                { icon: 'fa-question-circle', title: 'Guest', color: '#575757' },
                { icon: 'fa-question-circle', title: 'Validating', color: '#575757' },
                { icon: 'fa-android', title: 'Validating#2', color: '#575757' },
                { icon: 'fa-times', title: 'Leech', color: '#575757' },
                { icon: 'fa-user', title: 'User', color: '#615550' },
                { icon: 'fa-power-off', title: 'PowerUser', color: '#c79948' },
                { icon: 'fa-battery-full', title: 'SuperUser', color: '#815496' },
                { icon: 'fa-bolt', title: 'ExtremeUser', color: '#933443' },
                { icon: 'fa-rocket', title: 'InsaneUser', color: '#af3720' },
                { icon: 'fa-medal', title: 'Veteran', color: '#2f6a6c' },
                { icon: 'fa-seedling', title: 'Seeder', color: '#e77e22' },
                { icon: 'fa-hand-holding-seedling', title: 'Archivist', color: '#B32D77' },
                { icon: 'fa-pen', title: 'Editor', color: '#6aab7c' },
                { icon: 'fa-upload', title: 'Uploader', color: '#228B22' },
                { icon: 'fa-star', title: 'V.I.P.', color: '#ce5b64' },
                { icon: 'fa-crown', title: 'V.I.P. Uploader', color: '#259c25' },
                { icon: 'fa-star', title: 'V.I.P.2', color: '#00abff' },
                { icon: 'fa-puzzle-piece', title: 'Encoders', color: '#a0b684' },
                { icon: 'fa-user-bounty-hunter', title: 'Mod', color: '#b4c5e4' },
                { icon: 'fa-robot-astromech', title: 'IRC Boss', color: '#0083c0' },
                { icon: 'fa-user-tie', title: 'Admin', color: '#186335' },
                { icon: 'fa-jedi', title: 'Jedi', color: '#2779ff' },
                { icon: 'fa-superpowers', title: 'The Chosen One', color: '#ffd700' },
                { icon: 'fa-moon', title: 'Operator', color: '#EABCBC' },
                { icon: 'fa-user-robot', title: 'Bot', color: '#829ca9' }
            ];
        }

        scrapeUserRank() {
            try {
                const userElement = document.querySelector('.top-nav__username i[class*="fa-"]');
                if (!userElement) return { title: 'User', color: '#615550', icon: 'fa-user' };

                // Get the Font Awesome class
                const iconClass = Array.from(userElement.classList)
                .find(className => className.startsWith('fa-'));

                if (!iconClass) return { title: 'User', color: '#615550', icon: 'fa-user' };

                // Find matching rank
                const rank = this.rankMapping.find(r => r.icon === iconClass);

                // Get the color from the parent span if available
                const colorSpan = userElement.closest('span[style*="color"]');
                const color = colorSpan ?
                      colorSpan.style.color || rank?.color :
                rank?.color;

                console.log('Scraped rank:', {
                    icon: iconClass,
                    title: rank?.title,
                    color: color
                });

                return rank || { title: 'User', color: '#615550', icon: 'fa-user' };
            } catch (error) {
                console.error('Error scraping user rank:', error);
                return { title: 'User', color: '#615550', icon: 'fa-user' };
            }
        }

        scrapeUserStats() {
            const stats = {
                upload: { value: '0 B', url: '#', title: 'Upload' },
                download: { value: '0 B', url: '#', title: 'Download' },
                seeding: { value: '0', url: '#', title: 'Seeding' },
                leeching: { value: '0', url: '#', title: 'Leeching' },
                buffer: { value: '0 B', url: '#', title: 'Buffer' },
                bonusPoints: { value: '0', url: '#', title: 'Bonus Points' },
                ratio: { value: '0', url: '#', title: 'Ratio' },
                tokens: { value: '0', url: '#', title: 'FL Tokens' },
                rank: this.scrapeUserRank()
            };

            try {
                // Helper function to clean text content
                const cleanText = (element) => {
                    return element?.textContent
                        ?.replace(/\s+/g, ' ')
                        ?.trim()
                        ?.split('arrow-up')
                        ?.pop()
                        ?.split('arrow-down')
                        ?.pop()
                        ?.split('upload')
                        ?.pop()
                        ?.split('download')
                        ?.pop()
                        ?.split('exchange')
                        ?.pop()
                        ?.split('coins')
                        ?.pop()
                        ?.split('sync-alt')
                        ?.pop()
                        ?.split('star')
                        ?.pop()
                        ?.trim() || '0';
                };

                // Helper function to get stat info
                const getStat = (selector) => {
                    const element = document.querySelector(selector);
                    const link = element?.querySelector('a');
                    return {
                        value: cleanText(element),
                        url: link?.href || '#',
                        title: element?.getAttribute('title') || ''
                    };
                };

                // Scrape all stats
                stats.upload = getStat('.ratio-bar__uploaded');
                stats.download = getStat('.ratio-bar__downloaded');
                stats.seeding = getStat('.ratio-bar__seeding');
                stats.leeching = getStat('.ratio-bar__leeching');
                stats.buffer = getStat('.ratio-bar__buffer');
                stats.bonusPoints = getStat('.ratio-bar__points');
                stats.ratio = getStat('.ratio-bar__ratio');
                stats.tokens = getStat('.ratio-bar__tokens');

                console.log('Scraped user stats:', stats);
                return stats;
            } catch (error) {
                console.error('Error scraping user stats:', error);
                return stats;
            }
        }

        getHealthTag(attr) {
            // Define the threshold as a constant
            const NEW_TORRENT_THRESHOLD = 2; // hours

            // Check if torrent is less than threshold hours old
            const uploadTime = new Date(attr.created_at).getTime();
            const now = new Date().getTime();
            const hoursSinceUpload = (now - uploadTime) / (1000 * 60 * 60);

            // Skip health check for new torrents
            if (hoursSinceUpload < NEW_TORRENT_THRESHOLD) {
                return '';
            }

            // Get active filters
            const booleanFilters = this.filterManager.booleanFilters;

            // When filtering, use API's definition
            if (booleanFilters.has('alive')) {
                return `<span class="quick-stat health-alive" title="Active">💚 Active</span>`;
            }

            // Not filtering - show actual status based on data
            if (attr.seeders === 0 && attr.leechers === 0 && attr.times_completed === 0) {
                return `<span class="quick-stat health-graveyard" title="Graveyard">🖤 Graveyard</span>`;
            }
            if (attr.seeders === 0) {
                return `<span class="quick-stat health-dead" title="Dead">❤️ Dead</span>`;
            }
            if (attr.seeders === 1 && attr.times_completed >= 3) {
                return `<span class="quick-stat health-dying" title="Dying">💛 Dying</span>`;
            }
            // If it has seeders but doesn't meet dying conditions, it's alive
            return `<span class="quick-stat health-alive" title="Active">💚 Active</span>`;
        }


        getSpecialTags(attr) {
            const tags = [];
            if (attr.double_upload) tags.push(`<span class="quick-stat special-doubleup" title="Double Upload">2️⃣ 2x UP</span>`);
            if (attr.featured) tags.push(`<span class="quick-stat special-featured" title="Featured">⭐ Featured</span>`);
            if (attr.refundable) tags.push(`<span class="quick-stat special-refundable" title="Refundable">💰 Refundable</span>`);
            return tags.join('');
        }

        getMetadataTags(attr) {
            // Get all currently active filter properties
            const activeFilters = this.filterManager.booleanFilters;
            const tags = [];

            // Define properties to check and their corresponding tags
            const properties = [
                // Properties that can come from both filters and attributes
                { name: 'highspeed', class: 'tag-highspeed', icon: '⚡', text: 'High Speed',
                 active: activeFilters.has('highspeed') || attr.highspeed === true },
                { name: 'stream', class: 'tag-stream', icon: '🌊', text: 'Stream',
                 active: activeFilters.has('stream') || attr.stream === true },
                // Properties that only come from attributes
                { name: 'personal_release', class: 'tag-personal', icon: '👤', text: 'Personal',
                 active: attr.personal_release === true },
                { name: 'internal', class: 'tag-internal', icon: '🏠', text: 'Internal',
                 active: attr.internal === true }
            ];

            // Generate tags for all active properties
            properties.forEach(prop => {
                if (prop.active) {
                    tags.push(`<span class="quick-tag ${prop.class}" title="${prop.text}">${prop.icon} ${prop.text}</span>`);
                }
            });
            return tags.join('');
        }

        setupApiSearchButton(button) {
            const apiSearchHandler = async () => {
                const apiKey = this.filterManager.apiManager.getApiKey();
                if (!apiKey) {
                    this.showNotification('Please configure your API key first', 'error');
                    return;
                }

                button.disabled = true;
                const originalText = button.textContent;
                button.innerHTML = '<span class="loading-spinner"></span> Searching...';

                try {
                    const params = new URLSearchParams();
                    params.append('api_token', apiKey);

                    const currentFilters = this.filterManager.getActiveFilters();

                    if (currentFilters.categoryIds?.length) {
                        currentFilters.categoryIds.forEach(id => params.append('categories[]', id));
                    }
                    if (currentFilters.typeIds?.length) {
                        currentFilters.typeIds.forEach(id => params.append('types[]', id));
                    }
                    if (currentFilters.resolutionIds?.length) {
                        currentFilters.resolutionIds.forEach(id => params.append('resolutions[]', id));
                    }
                    if (currentFilters.genreIds?.length) {
                        currentFilters.genreIds.forEach(id => params.append('genres[]', id));
                    }

                    const booleanFilters = [
                        // Health Status
                        'alive', 'dying', 'dead', 'graveyard',

                        // History Status
                        'notDownloaded', 'downloaded', 'seeding', 'leeching', 'incomplete',

                        // Special Status
                        'doubleup', 'featured', 'refundable',

                        // Metadata Tags
                        'internal', 'personalRelease', 'trumpable', 'stream', 'sd', 'highspeed',

                        // Additional Tags
                        'bookmarked', 'wished'
                    ];
                    booleanFilters.forEach(filter => {
                        if (currentFilters[filter]) {
                            params.append(filter, 'true');
                        }
                    });

                    params.append('perPage', '25');
                    params.append('sortField', 'created_at');
                    params.append('sortDirection', 'desc');

                    const response = await fetch(`${this.filterManager.apiManager.BASE_URL}/torrents/filter?${params.toString()}`, {
                        headers: { 'Accept': 'application/json' },
                        credentials: 'same-origin',
                        mode: 'same-origin'
                    });

                    if (!response.ok) throw new Error(`HTTP ${response.status}`);

                    const data = await response.json();
                    const resultsTab = this.container.querySelector('[data-tab="results"]');
                    if (resultsTab) resultsTab.click();
                    this.renderApiResults(data.data);
                    this.hide();

                } catch (error) {
                    console.error('API search error:', error);
                    this.showNotification('Error performing search: ' + error.message, 'error');
                } finally {
                    button.disabled = false;
                    button.textContent = originalText;
                }
            };

            button.removeEventListener('click', apiSearchHandler);
            button.addEventListener('click', apiSearchHandler);
        }

        formatSize(bytes) {
            const units = ['B', 'KB', 'MB', 'GB', 'TB'];
            if (bytes === 0) return '0 B';
            const i = Math.floor(Math.log(bytes) / Math.log(1024));
            const size = (bytes / Math.pow(1024, i)).toFixed(2);
            return `${size} ${units[i]}`;
        }

        setupPosterFallbacks() {
            document.querySelectorAll('.poster-needs-fallback').forEach(img => {
                const categoryIcon = img.dataset.categoryIcon;

                img.addEventListener('error', function() {
                    const placeholder = document.createElement('div');
                    placeholder.className = 'poster-placeholder';
                    placeholder.style.cssText = 'display:flex;align-items:center;justify-content:center;background:#f3f4f6;font-size:48px;width:100%;height:100%;';
                    placeholder.textContent = categoryIcon;

                    if (this.parentElement) {
                        this.parentElement.replaceChild(placeholder, this);
                    }
                });

                // Remove the class so we don't set up listeners multiple times
                img.classList.remove('poster-needs-fallback');
            });
        }

        setupPaginationListeners(container) {
            console.group('Setting up pagination listeners');
            console.log('Setting up pagination with search state:', !!this.currentSearchState);

            // Handle direct page number clicks
            container.querySelectorAll('.pagination-number').forEach(button => {
                button.addEventListener('click', async (e) => {
                    if (!button.classList.contains('active')) {
                        const page = parseInt(button.dataset.page || button.textContent);
                        if (!isNaN(page)) {
                            console.log('Page button clicked:', page);
                            e.stopPropagation();
                            await this.loadPage(page);
                        }
                    }
                });
            });

            // Handle prev/next buttons differently based on context
            if (this.currentSearchState) {
                const prevButton = container.querySelector('.pagination-button[data-action="prev"]');
                const nextButton = container.querySelector('.pagination-button[data-action="next"]');

                if (prevButton) {
                    prevButton.addEventListener('click', async (e) => {
                        if (!prevButton.disabled) {
                            e.stopPropagation();
                            const currentPage = this.getCurrentPage();
                            console.log('Previous button clicked, current page:', currentPage);
                            await this.loadPage(currentPage - 1);
                        }
                    });
                }

                if (nextButton) {
                    nextButton.addEventListener('click', async (e) => {
                        if (!nextButton.disabled) {
                            e.stopPropagation();
                            const currentPage = this.getCurrentPage();
                            console.log('Next button clicked, current page:', currentPage);
                            await this.loadPage(currentPage + 1);
                        }
                    });
                }
            } else {
                // Regular API pagination - uses first/last child
                const prevButton = container.querySelector('.pagination-button:first-child');
                const nextButton = container.querySelector('.pagination-button:last-child');

                if (prevButton) {
                    prevButton.addEventListener('click', async (e) => {
                        if (!prevButton.disabled) {
                            e.stopPropagation();
                            const meta = this.getCurrentPageMeta();
                            await this.loadPage(meta.current_page - 1);
                        }
                    });
                }

                if (nextButton) {
                    nextButton.addEventListener('click', async (e) => {
                        if (!nextButton.disabled) {
                            e.stopPropagation();
                            const meta = this.getCurrentPageMeta();
                            await this.loadPage(meta.current_page + 1);
                        }
                    });
                }
            }

            console.groupEnd();
        }

        getCurrentPage() {
            const activePageButton = this.container.querySelector('.pagination-number.active');
            return activePageButton ? parseInt(activePageButton.dataset.page) : 1;
        }

        getCurrentPageMeta() {
            const resultsContainer = this.container.querySelector('[data-tab-content="results"]');
            const countText = resultsContainer?.querySelector('.results-count h3')?.textContent;
            if (countText) {
                const match = countText.match(/Showing (\d+) of (\d+)/);
                if (match) {
                    return {
                        current_page: Math.ceil(parseInt(match[1]) / 50),
                        per_page: 50,
                        total: parseInt(match[2])
                    };
                }
            }
            return { current_page: 1, per_page: 50, total: 0 };
        }


        async renderApiResults(results) {
            console.group('Rendering API Results');
            console.log('Initial results:', results);

            const normalizedResults = this.normalizeApiResponse(results);
            console.log('Normalized results:', normalizedResults);

            const data = normalizedResults.results.data;
            const meta = normalizedResults.results.meta;
            console.log('Data to render:', {
                totalItems: data?.length || 0,
                firstItem: data?.[0],
                meta: meta
            });

            const resultsContainer = this.container.querySelector('[data-tab-content="results"]');
            if (!resultsContainer) return;

            if (!data || !data.length) {
                console.log('No data to display');
                resultsContainer.innerHTML = `
            <div class="no-api-results">
                <p>No results found</p>
            </div>
        `;
                return;
            }

            if (results.error) {
                resultsContainer.innerHTML = `
            <div class="api-error">
                <p>Error loading results: ${results.error}</p>
                <p>Please try again later.</p>
            </div>
        `;
                return;
            }

            const expandedPanel = this.container.querySelector('.api-expanded-panel');
            if (expandedPanel) {
                expandedPanel.dataset.activeTab = 'results';
            }

            // Calculate total pages based on available data
            const hasMorePages = data.length >= meta.per_page;
            const totalPages = hasMorePages ? meta.current_page + 1 : meta.current_page;

            // Get current sort state
            const sortInfo = this.sortMenu?.currentSort;
            const sortDirection = sortInfo?.direction || 'desc';

            const searchButtonHTML = `
<button class="search-trigger-button">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
</button>

<div class="search-overlay hidden">
    <div class="search-modal">
        <div class="search-content">
            <div class="search-input-container">
                <input type="text"
                       class="search-input"
                       placeholder="Search torrents..."
                       autocomplete="off">
                <button class="search-close">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>

            <div class="search-options">
                <label class="case-toggle">
                    <input type="checkbox" id="caseSensitiveSearch">
                    <span class="toggle-track">
                        <span class="toggle-indicator">Aa</span>
                    </span>
                    <span class="toggle-label">Case Sensitive</span>
                </label>
            </div>

<div class="search-tips">
    <h4 class="tips-header">Search Tips</h4>
    <div class="tips-grid">
        <!-- Basic Search -->
        <div class="tip-group">
            <h5>Basic Search</h5>
            <div class="tip"><span class="tip-key">word</span> search for word</div>
            <div class="tip"><span class="tip-key">"exact phrase"</span> exact phrase match</div>
            <div class="tip"><span class="tip-key">2160p movie</span> multiple terms</div>
        </div>

        <!-- Exclusions -->
        <div class="tip-group">
            <h5>Exclusions</h5>
            <div class="tip"><span class="tip-key">-word</span> exclude word</div>
            <div class="tip"><span class="tip-key">-"exact phrase"</span> exclude exact phrase</div>
            <div class="tip"><span class="tip-key">movie -cam</span> include movie, exclude cam</div>
        </div>

        <!-- Either/Or -->
        <div class="tip-group">
            <h5>Either/Or Search</h5>
            <div class="tip"><span class="tip-key">/HDR /DV</span> match HDR or Dolby Vision</div>
            <div class="tip"><span class="tip-key">movie /x265 /x264</span> movie with either codec</div>
            <div class="tip"><span class="tip-key">/remux /encode</span> find either type</div>
        </div>

        <!-- Case Sensitivity -->
        <div class="tip-group">
            <h5>Case Sensitivity</h5>
            <div class="tip">Toggle affects all search types:</div>
            <div class="tip"><span class="tip-key">/HDR</span> matches only "HDR" when on</div>
            <div class="tip"><span class="tip-key">-WEB</span> excludes only "WEB" when on</div>
            <div class="tip"><span class="tip-key">"BluRay"</span> exact case when on</div>
        </div>
    </div>
</div>
        </div>
    </div>
</div>`;

            const getPosterContent = (attr, meta) => {
                // 1. If we have meta.poster (TMDB/IMDB), use it
                if (meta.poster) {
                    return `<img src="${meta.poster.replace('w92', 'w500')}"
                         alt="Poster"
                         class="poster-img"/>`;
                }

                // 2. For all other cases, try local poster
                const torrentId = attr.details_link.split('/').pop();
                const localPosterUrl = `https://fearnopeer.com/files/img/torrent-cover_${torrentId}.jpg`;
                const categoryIcons = {
                    'Movies': '🎬',
                    'TV': '📺',
                    'Music': '🎵',
                    'Games': '🎮',
                    'Apps': '📱',
                    'Anime': '🍜',
                    'Sport': '⚽',
                    'Assorted': '📦'
                };
                const categoryIcon = categoryIcons[attr.category] || '📁';

                return `
            <img src="${localPosterUrl}"
                 data-torrent-id="${torrentId}"
                 data-category-icon="${categoryIcon}"
                 alt="Poster"
                 class="poster-img poster-needs-fallback"/>
        `;
            };

            resultsContainer.innerHTML = `
    <div class="api-results-header">
        <div class="results-count">
    <h3>Showing ${meta.from} of ${meta.to} results</h3>
    ${this.currentSearchState ? `
        <div class="search-info">
            Search: "${this.currentSearchState.searchTerm}"
            ${this.currentSearchState.caseSensitive ? '(Case Sensitive)' : ''}
        </div>
    ` : ''}
    ${sortInfo ? `
        <div class="sort-info">
            Sorted by ${this.getSortLabel(sortInfo.field)}
            ${sortInfo.direction === 'desc' ? '(Descending)' : '(Ascending)'}
        </div>
    ` : ''}
</div>

 <div class="pagination-controls">
    ${this.currentSearchState ?
                this.renderSearchPagination(meta) :
            `<button class="pagination-button" ${meta.current_page === 1 ? 'disabled' : ''}>
            <span class="pagination-icon">«</span>
        </button>
        <div class="pagination-numbers">
            ${this.generatePaginationNumbers(meta.current_page, totalPages)}
        </div>
        <button class="pagination-button" ${meta.current_page === totalPages ? 'disabled' : ''}>
            <span class="pagination-icon">»</span>
        </button>`
        }
</div>

        <div class="results-actions">
            ${searchButtonHTML}
            <button class="sort-button">
                <svg xmlns="http://www.w3.org/2000/svg"
                     width="16"
                     height="16"
                     viewBox="0 0 24 24"
                     fill="none"
                     stroke="currentColor"
                     stroke-width="2"
                     stroke-linecap="round"
                     stroke-linejoin="round"
                >
                    <path d="M11 ${sortInfo?.direction === 'desc' ? '5' : '19'}h10M11 ${sortInfo?.direction === 'desc' ? '9' : '15'}h7M11 ${sortInfo?.direction === 'desc' ? '13' : '11'}h4M3 ${sortInfo?.direction === 'desc' ? '17' : '7'}l3 ${sortInfo?.direction === 'desc' ? '3' : '-3'} 3 ${sortInfo?.direction === 'desc' ? '-3' : '3'}M6 ${sortInfo?.direction === 'desc' ? '18V4' : '6v14'}"/>
                </svg>
                Sort
            </button>
        </div>
    </div>

    <div class="api-results-list">
${data.map((item, index) => {
                const attr = item.attributes || item;
                // Now index is defined because we're passing it as a parameter to map
                console.log(`Processing item ${index}:`, {
                    category: attr.category,
                    name: attr.name,
                    type: attr.type
                });
                const meta = attr?.meta || {};
                const torrentId = attr.details_link.split('/').pop();
                const downloadLink = `https://fearnopeer.com/torrents/download/${torrentId}`;

                return `
                <div class="api-result-item">
                    <div class="result-top-section">
                        <div class="top-section-left">
                            <div class="result-quick-stats">
                                ${this.getHealthTag(attr)}
                                ${this.getMetadataTags(attr)}
                                ${attr.freeleech !== "0%" ? `
                                    <span class="quick-stat freeleech" title="Freeleech">
                                        🎁 ${attr.freeleech}
                                    </span>
                                ` : ''}
                                ${this.getSpecialTags(attr)}
                            </div>
                            <div class="scroll-indicator">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M9 18l6-6-6-6"/>
                                </svg>
                            </div>
                        </div>
                        <div class="top-section-right">
                            <span class="quick-stat size" title="Size">
                                💾 ${this.formatSize(attr.size)}
                            </span>
                        </div>
                    </div>

                    <div class="result-content-section">
                        <div class="poster-container">
                            <div class="result-poster">
                                ${getPosterContent(attr, meta)}
                                ${attr.featured ? `<div class="featured-badge">⭐ Featured</div>` : ''}
                            </div>
                        </div>
                        <div class="content-main">
                            <div class="result-title">
                                <a href="${attr.details_link}" class="title-link">${attr.name}</a>
                            </div>

                            <div class="result-meta">
                                ${attr.rating ? `<span class="result-tag rating">${attr.rating}</span>` : ''}
                                <span class="result-tag category">${attr.category}</span>
                                ${attr.resolution ? `<span class="result-tag resolution">${attr.resolution}</span>` : ''}
                                <span class="result-tag type">${attr.type}</span>
                                ${meta.genres ? `<span class="result-tag genres">${meta.genres}</span>` : ''}
                            </div>
                        </div>
                    </div>

                    <div class="result-footer">
                        <div class="torrent-stats">
                            <div class="stat-item seeders ${attr.seeders > 0 ? 'healthy' : 'dead'}">
                                <span class="stat-label">Seeders</span>
                                <span class="stat-value">${attr.seeders}</span>
                            </div>
                            <div class="stat-item leechers">
                                <span class="stat-label">Leechers</span>
                                <span class="stat-value">${attr.leechers}</span>
                            </div>
                            <div class="stat-item completed">
                                <span class="stat-label">Completed</span>
                                <span class="stat-value">${attr.times_completed || 0}</span>
                            </div>
                        </div>
                        <div class="footer-actions">
                            <button class="info-button" title="More Information">
                                i
                            </button>
                            <a href="${downloadLink}" class="download-button">
                                Download
                            </a>
                        </div>
                    </div>
                </div>
            `;
            }).join('')}
                   </div>
                   `;



            // Setup fallbacks for poster images
            this.setupPosterFallbacks();

            // Initialize search functionality after rendering
            this.setupSearchFunctionality();

            console.groupEnd();

            const initializeScrollBehavior = () => {
                document.querySelectorAll('.result-quick-stats').forEach(container => {
                    // Check if content overflows
                    const hasOverflow = container.scrollWidth > container.clientWidth;
                    if (hasOverflow) {
                        container.classList.add('has-overflow', 'scrollable');

                        let isDown = false;
                        let startX;
                        let scrollLeft;

                        container.addEventListener('mousedown', (e) => {
                            // Prevent text selection
                            e.preventDefault();

                            isDown = true;
                            container.classList.add('grabbing');
                            startX = e.pageX - container.offsetLeft;
                            scrollLeft = container.scrollLeft;
                        });

                        container.addEventListener('mouseleave', () => {
                            isDown = false;
                            container.classList.remove('grabbing');
                        });

                        container.addEventListener('mouseup', () => {
                            isDown = false;
                            container.classList.remove('grabbing');
                        });

                        container.addEventListener('mousemove', (e) => {
                            if (!isDown) return;

                            // Prevent text selection during drag
                            e.preventDefault();

                            const x = e.pageX - container.offsetLeft;
                            const walk = (x - startX) * 2;
                            container.scrollLeft = scrollLeft - walk;
                        });

                        // Prevent text selection on double click
                        container.addEventListener('selectstart', (e) => {
                            if (isDown) {
                                e.preventDefault();
                            }
                        });

                        // Add keyboard navigation
                        container.addEventListener('keydown', (e) => {
                            if (e.key === 'ArrowLeft') {
                                container.scrollLeft -= 50;
                            } else if (e.key === 'ArrowRight') {
                                container.scrollLeft += 50;
                            }
                        });

                        // Optional: Add touch events for mobile
                        container.addEventListener('touchstart', (e) => {
                            isDown = true;
                            container.classList.add('grabbing');
                            startX = e.touches[0].pageX - container.offsetLeft;
                            scrollLeft = container.scrollLeft;
                        }, { passive: true });

                        container.addEventListener('touchend', () => {
                            isDown = false;
                            container.classList.remove('grabbing');
                        });

                        container.addEventListener('touchmove', (e) => {
                            if (!isDown) return;

                            const x = e.touches[0].pageX - container.offsetLeft;
                            const walk = (x - startX) * 2;
                            container.scrollLeft = scrollLeft - walk;
                        }, { passive: true });
                    }
                });
            };

            // Event Listeners for Pagination
            const container = resultsContainer;

            // Sort button handler
            const sortButton = container.querySelector('.sort-button');
            if (sortButton) {
                // Remove any existing click listeners
                const newSortButton = sortButton.cloneNode(true);
                sortButton.parentNode.replaceChild(newSortButton, sortButton);

                // Initialize new SortMenu instance for this button
                const sortMenu = new SortMenu(this);
                sortMenu.setupSortButton(newSortButton);
            }

            // Add click handlers for info buttons
            container.querySelectorAll('.info-button').forEach(button => {
                button.addEventListener('click', (e) => {
                    const resultItem = e.target.closest('.api-result-item');
                    if (resultItem) {
                        console.log('Info clicked for item:', resultItem);
                        // Implement info modal display
                    }
                });
            });

            // Handle any poster load errors
            container.querySelectorAll('.poster-img').forEach(img => {
                img.addEventListener('error', (e) => {
                    const poster = e.target.closest('.result-poster');
                    if (poster) {
                        poster.innerHTML = '<div class="poster-placeholder"></div>';
                    }
                });
            });
            initializeScrollBehavior();
        }

        normalizeApiResponse(response) {
            console.group('API Response Normalization');
            console.log('Raw response:', response);

            // If the response already has the expected structure, return it
            if (response.success && response.results?.data) {
                console.log('Using existing structure:', response);
                return response;
            }

            // If we have a direct data array
            if (Array.isArray(response.data)) {
                let normalized = {
                    success: true,
                    results: {
                        data: response.data,
                        meta: response.meta || {
                            current_page: 1,
                            per_page: 50,
                            total: response.data.length,
                            from: 1,
                            to: response.data.length,
                            last_page: Math.ceil(response.data.length / 50)
                        }
                    }
                };
                console.log('Normalized from data array:', normalized);
                return normalized;
            }

            // If we have a nested structure
            if (response.results && Array.isArray(response.results.data)) {
                let normalized = {
                    success: true,
                    results: response.results,
                    meta: response.meta
                };
                console.log('Normalized from nested structure:', normalized);
                return normalized;
            }

            // If we have a direct results object
            if (response.results && Array.isArray(response.results)) {
                let normalized = {
                    success: true,
                    results: {
                        data: response.results,
                        meta: response.meta || {
                            current_page: 1,
                            per_page: 50,
                            total: response.results.length,
                            from: 1,
                            to: response.results.length,
                            last_page: Math.ceil(response.results.length / 50)
                        }
                    }
                };
                console.log('Normalized from direct results:', normalized);
                return normalized;
            }
            console.error('Failed to normalize response:', response);
            console.groupEnd();
            throw new Error('Unrecognized API response structure');
        }

        async loadPage(page) {
            console.group('Loading Page');
            const resultsContainer = this.container.querySelector('[data-tab-content="results"]');

            try {
                if (resultsContainer) {
                    resultsContainer.innerHTML = `<div class="loading-indicator">
                <span class="loading-spinner"></span>Loading results...
            </div>`;
                }

                let results;

                if (this.currentSearchState) {
                    console.log('Loading search page:', {
                        requestedPage: page,
                        searchTerm: this.currentSearchState.searchTerm
                    });

                    // Get new search results for the page
                    results = await this.filterManager.fetchFilteredTorrents(
                        page,
                        50,
                        this.currentSearchState.sort,
                        {
                            name: this.currentSearchState.searchTerm,
                            caseSensitive: false
                        }
                    );
                } else {
                    // Regular API pagination
                    console.log('Loading regular API results page:', page);
                    results = await this.filterManager.fetchFilteredTorrents(
                        page,
                        50,
                        this.sortMenu?.currentSort || { field: 'created_at', direction: 'desc' }
                    );
                }

                if (results?.success) {
                    console.log('Rendering page:', {
                        page: results.results.meta.current_page,
                        total: results.results.meta.total,
                        resultsCount: results.results.data.length
                    });
                    this.renderApiResults(results);

                    const resultsContent = this.container.querySelector('[data-tab-content="results"]');
                    if (resultsContent) {
                        this.setupPaginationListeners(resultsContent);
                    }
                } else {
                    throw new Error(results?.error || 'Failed to load results');
                }

            } catch (error) {
                console.error('Error loading page:', error);
                if (resultsContainer) {
                    resultsContainer.innerHTML = `<div class="api-error">
                <p>Error loading results: ${error.message}</p>
            </div>`;
                }
                this.showNotification('Error loading results: ' + error.message, 'error');
            }

            console.groupEnd();
        }

        // Enhanced clearSearchState method
        clearSearchState() {
            console.group('Clear Search State');
            console.log('Clearing search state and resetting results');

            // Clear search state
            this.currentSearchState = null;

            // Clear search input
            const searchInput = this.container.querySelector('.search-input');
            if (searchInput) {
                searchInput.value = '';
                console.log('Search input cleared');
            }

            // Reset case sensitivity toggle
            const caseToggle = document.getElementById('caseSensitiveSearch');
            if (caseToggle) {
                caseToggle.checked = false;
                console.log('Case sensitivity reset');
            }

            // Reset to default sort
            if (this.sortMenu) {
                this.sortMenu.currentSort = { field: 'created_at', direction: 'desc' };
                this.sortMenu.saveSortState();
                console.log('Sort reset to default');
            }

            console.groupEnd();
        }

        // Separate method for just hiding the modal (no state clearing)
        hideSearchModal() {
            const searchOverlay = this.container.querySelector('.search-overlay');
            if (searchOverlay) {
                searchOverlay.classList.remove('active');
                setTimeout(() => {
                    searchOverlay.classList.add('hidden');
                }, 300);
            }
        }

        // Helper method to get correct meta information
        getPageMeta(results, page) {
            const itemsPerPage = 50;
            const maxResults = 100;

            // If results has meta information, use it
            if (results.meta) {
                return results.meta;
            }

            // Otherwise, calculate meta information
            const totalItems = Math.min(results.length, maxResults);
            const totalPages = Math.ceil(totalItems / itemsPerPage);

            return {
                current_page: page,
                per_page: itemsPerPage,
                total: totalItems,
                total_pages: totalPages,
                from: ((page - 1) * itemsPerPage) + 1,
                to: Math.min(page * itemsPerPage, totalItems)
            };
        }

        generatePaginationNumbers(currentPage, totalPages) {
            let pages = [];
            const maxVisible = 5;
            console.log('Generating page numbers:', { currentPage, totalPages });

            if (totalPages <= maxVisible) {
                // Show all pages if total is less than max visible
                for (let i = 1; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                // Always show first page
                pages.push(1);

                // Calculate start and end points for visible page numbers
                let start = Math.max(2, currentPage - Math.floor(maxVisible / 2));
                let end = Math.min(totalPages - 1, start + maxVisible - 3);

                // Adjust start if end is maxed out
                start = Math.max(2, Math.min(start, totalPages - maxVisible + 2));

                // Add ellipsis after first page if needed
                if (start > 2) {
                    pages.push('...');
                }

                // Add middle pages
                for (let i = start; i <= end; i++) {
                    pages.push(i);
                }

                // Add ellipsis before last page if needed
                if (end < totalPages - 1) {
                    pages.push('...');
                }

                // Always show last page
                if (totalPages > 1) {
                    pages.push(totalPages);
                }
            }

            // Render page numbers with consistent data attributes for event handling
            return pages.map(page => {
                if (page === '...') {
                    return '<span class="pagination-ellipsis">...</span>';
                }

                return `
            <button class="pagination-number ${page === currentPage ? 'active' : ''}"
                    ${page === currentPage ? 'disabled' : ''}
                    data-page="${page}"
                    title="Go to page ${page}"
                    aria-label="Page ${page}"
                    aria-current="${page === currentPage ? 'true' : 'false'}">
                ${page}
            </button>
        `;
            }).join('');
        }

        renderProfileTab() {
            console.log('Rendering profile tab with stats:', this.userStats);
            const container = document.querySelector('[data-tab-content="profile"]');
            if (!container) {
                console.error('Profile container not found');
                return;
            }

            container.innerHTML = `
                        <div class="profile-container">
                            <div class="profile-header animated">
                                <img src="${this.filterManager.getUserAvatar()}"
            class="profile-avatar"
            alt="User Avatar">
                <div class="profile-username">jkillas</div>
            <div class="profile-rank" style="color: ${this.userStats.rank.color}">
                <i class="fas ${this.userStats.rank.icon}"></i>
            ${this.userStats.rank.title}
            </div>
            </div>

            <div class="stats-grid">
                <a href="${this.userStats.upload.url}" class="stat-card" title="${this.userStats.upload.title}">
                    <div class="stat-label">Upload</div>
            <div class="stat-value">${this.userStats.upload.value}</div>
            </a>
            <a href="${this.userStats.download.url}" class="stat-card" title="${this.userStats.download.title}">
                <div class="stat-label">Download</div>
            <div class="stat-value">${this.userStats.download.value}</div>
            </a>
            <a href="${this.userStats.ratio.url}" class="stat-card" title="${this.userStats.ratio.title}">
                <div class="stat-label">Ratio</div>
            <div class="stat-value">${this.userStats.ratio.value}</div>
            </a>
            <a href="${this.userStats.buffer.url}" class="stat-card" title="${this.userStats.buffer.title}">
                <div class="stat-label">Buffer</div>
            <div class="stat-value">${this.userStats.buffer.value}</div>
            </a>
            <a href="${this.userStats.bonusPoints.url}" class="stat-card" title="${this.userStats.bonusPoints.title}">
                <div class="stat-label">Bonus Points</div>
            <div class="stat-value">${this.userStats.bonusPoints.value}</div>
            </a>
            <a href="${this.userStats.seeding.url}" class="stat-card" title="${this.userStats.seeding.title}">
                <div class="stat-label">Active Torrents</div>
            <div class="stat-value">${this.userStats.seeding.value}</div>
            </a>
            <a href="${this.userStats.leeching.url}" class="stat-card" title="${this.userStats.leeching.title}">
                <div class="stat-label">Leeching</div>
            <div class="stat-value">${this.userStats.leeching.value}</div>
            </a>
            <a href="${this.userStats.tokens.url}" class="stat-card" title="${this.userStats.tokens.title}">
                <div class="stat-label">FL Tokens</div>
            <div class="stat-value">${this.userStats.tokens.value}</div>
            </a>
            </div>
            </div>
            `;
        }


        getApiSidepanelTemplate() {
            const avatarUrl = this.filterManager.getUserAvatar();
            const avatarHtml = avatarUrl ? `
                <img src="${avatarUrl}"
            class="user-avatar"
            id="userAvatarBtn"
            title="View Profile"
            alt="User Avatar">
                ` : '';
            console.log('Getting API sidepanel template');
            const template = `
                <div class="api-sidepanel compact">
                    <!-- Status Indicator -->
                    <div class="api-status-indicator disconnected" title="API Status"></div>
            ${avatarHtml}

            <!-- Expand Button -->
            <button type="button" class="api-expand-button" title="Expand API Panel">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                        </svg>
            </button>

            <!-- Expanded Panel -->
            <div class="api-expanded-panel">
                <!-- Tabs -->
                <div class="api-tabs">
                    <div class="api-tab active" data-tab="results">API Results</div>
            <div class="api-tab" data-tab="stats">Stats</div>
            <div class="api-tab" data-tab="profile">Profile</div>
            </div>

            <!-- Tab Content -->
            <div class="api-tab-content active" data-tab-content="results">
                <!-- Results content here -->
                </div>
            <div class="api-tab-content" data-tab-content="stats">
                <!-- Stats content here -->
                </div>
            <div class="api-tab-content" data-tab-content="profile">
                <!-- Profile content will be rendered here -->
                </div>
            </div>
            </div>
            `;
            console.log('Template created');
            return template;
        }





        showConfirmation(title, message, onConfirm, onCancel = null) {
            const overlay = document.createElement('div');
            overlay.className = 'confirm-modal-overlay';

            const modal = document.createElement('div');
            modal.className = 'confirm-modal';

            modal.innerHTML = `
                <div class="confirm-modal-header">
                    <h3 class="confirm-modal-title">${title}</h3>
            <p class="confirm-modal-message">${message}</p>
            </div>
            <div class="confirm-modal-actions">
                <button class="modal-button cancel" id="cancelBtn">Cancel</button>
            <button class="modal-button primary" id="confirmBtn">Delete</button>
            </div>
            `;

            const closeModal = () => {
                overlay.remove();
                modal.remove();
            };

            // Event listeners
            modal.querySelector('#confirmBtn').addEventListener('click', () => {
                closeModal();
                onConfirm();
            });

            modal.querySelector('#cancelBtn').addEventListener('click', () => {
                closeModal();
                if (onCancel) onCancel();
            });

            overlay.addEventListener('click', closeModal);
            modal.addEventListener('click', e => e.stopPropagation());

            document.body.appendChild(overlay);
            document.body.appendChild(modal);
        }

        renderCommonFilterSets() {
            const commonFiltersList = this.container.querySelector('.common-filters-list');
            if (!commonFiltersList) return;

            commonFiltersList.innerHTML = Object.entries(COMMON_FILTER_SETS)
                .map(([name, filterSet]) => `
                <div class="common-filter-item">
                    <div class="common-filter-info">
                        <div class="common-filter-header">
                            <div class="common-filter-icon">${filterSet.icon}</div>
            <div class="common-filter-name">${name}</div>
            </div>
            <div class="common-filter-description">
                ${this.getFilterSetDescription(filterSet)}
            </div>
            <div class="common-filter-tags">
                ${this.getFilterSetTags(filterSet)}
            </div>
            </div>
            <div class="common-filter-actions">
                <button class="load-common-filter-btn"
            data-filter-name="${encodeURIComponent(name)}">
                Load Filter Set
                    </button>
            </div>
            </div>
            `)
                .join('');

            // Add event listeners for the load buttons
            commonFiltersList.querySelectorAll('.load-common-filter-btn').forEach(button => {
                button.addEventListener('click', () => {
                    const filterName = decodeURIComponent(button.dataset.filterName);
                    const filterSet = COMMON_FILTER_SETS[filterName];
                    if (filterSet) {
                        this.loadCommonFilterSet(filterSet);
                        this.hideSaveModal();
                        this.showNotification(`Loaded common filter set: ${filterName}`);
                    }
                });
            });
        }

        getFilterSetTags(filterSet) {
            const tags = [];

            // Add resolution tags
            filterSet.arrayFilters.resolutionIds?.forEach(id => {
                const resolution = RESOLUTIONS.find(r => r.value.toString() === id);
                if (resolution) {
                    tags.push(`<span class="common-filter-tag">
                        <span class="tag-icon">🎬</span> ${resolution.name}
            </span>`);
                }
            });

            // Add type tags
            filterSet.arrayFilters.typeIds?.forEach(id => {
                const type = TYPES.find(t => t.value.toString() === id);
                if (type) {
                    tags.push(`<span class="common-filter-tag">
                    <span class="tag-icon">📼</span> ${type.name}
                </span>`);
                }
            });

            // Add boolean filter tags
            filterSet.booleanFilters?.forEach(filter => {
                if (filter === 'alive') {
                    tags.push(`<span class="common-filter-tag">
                    <span class="tag-icon">💚</span> Active Only
                </span>`);
                }
            });

            return tags.join('');
        }

        getFilterSetDescription(filterSet) {
            const descriptions = [];

            // Add category descriptions
            if (filterSet.arrayFilters.categoryIds?.length > 0) {
                const categories = filterSet.arrayFilters.categoryIds
                .map(id => CATEGORIES.find(c => c.value.toString() === id)?.name)
                .filter(Boolean);
                if (categories.length) descriptions.push(categories.join(', '));
            }

            // Add resolution descriptions
            if (filterSet.arrayFilters.resolutionIds?.length > 0) {
                const resolutions = filterSet.arrayFilters.resolutionIds
                .map(id => RESOLUTIONS.find(r => r.value.toString() === id)?.name)
                .filter(Boolean);
                if (resolutions.length) descriptions.push(resolutions.join(', '));
            }

            // Add type descriptions
            if (filterSet.arrayFilters.typeIds?.length > 0) {
                const types = filterSet.arrayFilters.typeIds
                .map(id => TYPES.find(t => t.value.toString() === id)?.name)
                .filter(Boolean);
                if (types.length) descriptions.push(types.join(', '));
            }

            return descriptions.join(' • ');
        }

        loadCommonFilterSet(filterSet) {
            // Clear current filters
            this.filterManager.clearFilters();

            // Load array filters
            Object.entries(filterSet.arrayFilters).forEach(([key, values]) => {
                this.filterManager.arrayFilters[key] = new Set(values);
            });

            // Load boolean filters
            this.filterManager.booleanFilters = new Set(filterSet.booleanFilters);

            // Update UI
            this.render();
        }

        // Helper method to get appropriate icons for filters
        getFilterIcon(sectionId, filter) {
            // Your existing getFilterIcon implementation
            switch(sectionId) {
                case 'media':
                    return {
                        'Movies': '🎬',
                        'TV': '📺',
                        'Music': '🎵',
                        'Anime': '🍜',
                        'Games': '🎮',
                        'Apps': '📱',
                        'Sport': '⚽',
                        'Assorted': '📦'
                    }[filter.name] || '📁';

                case 'types':
                    return {
                        'Full Disc': '💿',
                        'Remux': '🔄',
                        'Encode': '🎯',
                        'WEB-DL': '🌐',
                        'WEBRip': '🔗',
                        'HDTV': '📺',
                        'FLAC': '🎵',
                        'MP3': '🎧',
                        'Mac': '🍎',
                        'Windows': '🪟',
                        'Console': '🎮',
                        'AudioBooks': '🎧',
                        'Books': '📚',
                        'Misc': '📦'
                    }[filter.name] || '📁';

                case 'resolution':
                    return {
                        '4320p': '🎥',
                        '2160p': '🎥',
                        '1080p': '🎥',
                        '1080i': '🎥',
                        '720p': '🎥',
                        '576p': '🎥',
                        '576i': '🎥',
                        '480p': '🎥',
                        '480i': '🎥',
                        'Other': '🎥'
                    }[filter.name] || '🎥';

                case 'health':
                    return {
                        'Alive': '💚',
                        'Dying': '💛',
                        'Dead': '❤️',
                        'Graveyard': '🖤'
                    }[filter.name] || '❓';

                case 'history':
                    return {
                        'Not Downloaded': '🆕',
                        'Downloaded': '☑️',
                        'Seeding': '⬆️',
                        'Leeching': '⬇️',
                        'Incomplete': '❌'
                    }[filter.name] || '📁';

                case 'freeleech':
                    return filter.icon || '🎁';

                case 'special':
                    return {
                        'Double Upload': '2️⃣',
                        'Featured': '⭐',
                        'Refundable': '💰'
                    }[filter.name] || '⭐';

                default:
                    return filter.icon || '📁';
            }
        }

        getFilterExtra(sectionId, filter) {
            switch(sectionId) {
                case 'freeleech':
                    return `<span class="filter-tag">${filter.value}%</span>`;
                case 'health':
                    return `<span class="filter-tag ${filter.value}">${filter.value}</span>`;
                default:
                    return '';
            }
        }

        createContainer() {
            const container = document.createElement('div');
            container.className = 'filter-container hidden';
            container.innerHTML = `
       <div class="filter-modal">
            <div class="filter-sidebar">
                <div class="filter-search">
                    <input type="text" id="filterSearch" placeholder="Search filters...">
                </div>
                <div id="filterGroups" class="filter-groups">
                    <!-- Groups will be rendered here -->
                </div>
                <div class="filter-actions">
                    <button class="action-button" id="selectAllBtn">Select All</button>
                    <button class="action-button" id="clearAllBtn">Clear All</button>
                </div>
            </div>
            <div class="filter-content">
                <div id="activeFilters" class="active-filters">
                    <!-- Active filters will be rendered here -->
                </div>
                <div id="filterSections" class="filter-sections">
                    <!-- Sections will be rendered here -->
                </div>
<div class="modal-footer">
    <div class="modal-footer-left">
        <button class="modal-button secondary" id="exportBtn">Export</button>
        <button class="modal-button secondary" id="importBtn">Import</button>
        <button class="modal-button secondary" id="saveBtn">Filter Set</button>
    </div>
    <div class="modal-footer-right">
        <button class="modal-button secondary" id="apiSearchBtn">Search API</button>
        <button class="modal-button primary" id="applyBtn">Apply Filters</button>
        <button class="modal-button cancel" id="cancelBtn">Cancel</button>
    </div>
</div>
            </div>
        </div>
            <!-- Save Modal -->
                        <!-- Import Modal -->
            <div class="import-modal hidden">
                <div class="import-modal-content">
                    <h3>Import Filters</h3>
                    <textarea id="importCode" placeholder="Paste filter code here"></textarea>
                    <div class="import-actions">
                        <button class="modal-button primary" id="confirmImportBtn">Import</button>
                        <button class="modal-button cancel" id="cancelImportBtn">Cancel</button>
                    </div>
                </div>
            </div>
<div class="save-modal hidden">
                <div class="save-modal-content">
                    <h3>Filter Sets</h3>
                    <div class="filter-set-tabs">
                        <button class="filter-set-tab active" data-tab="custom">Custom Filter Sets</button>
                        <button class="filter-set-tab" data-tab="common">Common Filter Sets</button>
                    </div>

                    <!-- Custom Filter Sets Tab -->
                    <div class="filter-set-content active" data-tab-content="custom">
                        <div class="saved-filters-list">
                            <!-- Custom filters will be listed here -->
                        </div>

                    </div>

                    <!-- Common Filter Sets Tab -->
                    <div class="filter-set-content" data-tab-content="common">
                        <div class="common-filters-list">
                            <!-- Common filters will be listed here -->
                        </div>
                    </div>
        <!-- Footer with Close Button -->
    <div class="save-modal-footer">
        <div class="save-new-filter" id="customSaveFilter">
            <input type="text" id="newFilterName" placeholder="Enter a name for this filter set">
            <button class="modal-button primary" id="saveNewFilterBtn">Save</button>
        </div>
        <button class="modal-button cancel" id="cancelSaveBtn">Close</button>
    </div>
</div>
        `;
            return container;
        }

        renderLanguageSection() {
            return `
            <div class="filter-section">
                <div class="section-header">
                    <div class="section-title">
                        <span class="section-icon">🌐</span>
                        <span class="section-name">Primary Language</span>
                        ${this.filterManager.arrayFilters.primaryLanguageNames.size > 0 ?
                `<span class="section-count">(${this.filterManager.arrayFilters.primaryLanguageNames.size} selected)</span>`
            : ''}
                    </div>
                    <button class="collapse-button ${this.filterManager.isSectionExpanded('languages') ? 'expanded' : ''}"
                            data-section-id="languages">
                        <span>${this.filterManager.isSectionExpanded('languages') ? 'Collapse' : 'Expand'}</span>
                    </button>
                </div>
                <div class="section-content ${this.filterManager.isSectionExpanded('languages') ? '' : 'hidden'}">
                    ${PRIMARY_LANGUAGE.map(lang => `
                        <label class="filter-option">
                            <input type="checkbox"
                                   value="${lang.value}"
                                   ${this.filterManager.arrayFilters.primaryLanguageNames.has(lang.value) ? 'checked' : ''}>
                            <span class="filter-label">
                                <span class="filter-icon">${lang.icon}</span>
                                <span class="language-name">${lang.name}</span>
                                <span class="language-code">(${lang.value})</span>
                            </span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
        }

        renderSavedFilters() {
            const listContainer = this.container.querySelector('.saved-filters-list');
            if (!listContainer) {
                console.log('No saved filters list container found');
                return;
            }

            const savedFilters = this.filterManager.getSavedFilters();

            // Create the filter items HTML
            const filterItemsHTML = savedFilters.length > 0
            ? savedFilters.map(filter => `
                <div class="saved-filter-item" data-filter-name="${encodeURIComponent(filter.name)}">
                    <div class="saved-filter-info">
                        <div class="saved-filter-name">${filter.name}</div>
                        <div class="saved-filter-meta">
                            <a href="javascript:void(0);"
                               class="filter-count-link"
                               data-filter-name="${encodeURIComponent(filter.name)}"
                               style="cursor: pointer;">
                                ${filter.filterCount} filters
                            </a>
                            · Saved ${new Date(filter.timestamp).toLocaleDateString()}
                        </div>
                    </div>
                    <div class="saved-filter-actions">
                        <button class="modal-button secondary load-filter-btn">Load</button>
                        <button class="modal-button cancel delete-filter-btn">Delete</button>
                    </div>
                </div>
            `).join('')
            : '<div class="no-saved-filters">No saved filters</div>';

            // Only update content if it's different
            if (listContainer.innerHTML !== filterItemsHTML) {
                listContainer.innerHTML = filterItemsHTML;
                this.setupSavedFilterEventListeners(listContainer);
            }
        }

        // Add method to handle filter set changes
        handleFilterSetChange() {
            // Re-render saved filters when changes occur
            this.renderSavedFilters();
        }

        setupSavedFilterEventListeners(container) {
            if (!container) {
                DEBUG.log('No container provided for event listeners');
                return;
            }

            DEBUG.log('Setting up saved filter event listeners');

            // Add filter count click listeners
            container.querySelectorAll('.filter-count-link').forEach(link => {
                DEBUG.log('Found filter count link', link.dataset);

                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation(); // Prevent event bubbling

                    const filterName = decodeURIComponent(e.target.dataset.filterName);
                    DEBUG.log('Filter count clicked', { filterName });

                    if (!filterName) {
                        DEBUG.log('No filter name found in dataset');
                        return;
                    }

                    if (!this.filterManager.savedFilters[filterName]) {
                        DEBUG.log('Filter set not found', { filterName });
                        return;
                    }

                    this.showFilterDetails(filterName);
                });
            });

            // Load button listeners
            container.querySelectorAll('.load-filter-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const filterItem = e.target.closest('.saved-filter-item');
                    if (!filterItem) return;

                    const filterName = decodeURIComponent(filterItem.dataset.filterName);
                    if (this.filterManager.loadSavedFilter(filterName)) {
                        this.hideSaveModal();
                        this.render();
                        this.showNotification('Filter set loaded successfully');
                    } else {
                        this.showNotification('Failed to load filter set', 'error');
                    }
                });
            });

            // Delete button listeners
            container.querySelectorAll('.delete-filter-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const filterItem = e.target.closest('.saved-filter-item');
                    if (!filterItem) return;

                    const filterName = decodeURIComponent(filterItem.dataset.filterName);

                    this.showConfirmation(
                        'Delete Filter Set',
                        `Are you sure you want to delete "${filterName}"? This action cannot be undone.`,
                        () => {
                            if (this.filterManager.deleteSavedFilter(filterName)) {
                                this.renderSavedFilters();
                                this.showNotification('Filter set deleted');
                            } else {
                                this.showNotification('Failed to delete filter set', 'error');
                            }
                        }
                    );
                });
            });
        }

        showFilterDetails(filterName) {
            DEBUG.log('Showing filter details for', filterName);

            // Create and append overlay first
            const overlay = document.createElement('div');
            overlay.className = 'filter-details-overlay';
            overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(2px);
        z-index: 10001;
    `;

            // Create modal
            const modal = document.createElement('div');
            modal.className = 'filter-details-modal';
            modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 24px;
        border-radius: 12px;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
        z-index: 10002;
        width: 90%;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
    `;

            const filterSet = this.filterManager.savedFilters[filterName];
            if (!filterSet) {
                DEBUG.log('Filter set not found', { filterName });
                return;
            }

            DEBUG.log('Filter set data', filterSet);

            // Helper function to get filter groups
            const getFilterGroups = (filterSet) => {
                const groups = [];
                const arrayFilters = filterSet.arrayFilters || {};
                const booleanFilters = filterSet.booleanFilters || [];

                // Categories
                if (arrayFilters.categoryIds?.length > 0) {
                    groups.push({
                        name: 'Categories',
                        icon: '📁',
                        group: 'content',
                        items: arrayFilters.categoryIds.map(id =>
                                                            CATEGORIES.find(c => c.value.toString() === id.toString())
                                                           ).filter(Boolean)
                    });
                }

                // Types
                if (arrayFilters.typeIds?.length > 0) {
                    groups.push({
                        name: 'Types',
                        icon: '📼',
                        group: 'content',
                        items: arrayFilters.typeIds.map(id =>
                                                        TYPES.find(t => t.value.toString() === id.toString())
                                                       ).filter(Boolean)
                    });
                }

                // Resolutions
                if (arrayFilters.resolutionIds?.length > 0) {
                    groups.push({
                        name: 'Resolutions',
                        icon: '📏',
                        group: 'content',
                        items: arrayFilters.resolutionIds.map(id =>
                                                              RESOLUTIONS.find(r => r.value.toString() === id.toString())
                                                             ).filter(Boolean)
                    });
                }

                // Genres
                if (arrayFilters.genreIds?.length > 0) {
                    groups.push({
                        name: 'Genres',
                        icon: '🎭',
                        group: 'metadata',
                        items: arrayFilters.genreIds.map(id =>
                                                         GENRES.find(g => g.value.toString() === id.toString())
                                                        ).filter(Boolean)
                    });
                }

                // Freeleech
                if (arrayFilters.free?.length > 0) {
                    groups.push({
                        name: 'Freeleech',
                        icon: '🎁',
                        group: 'status',
                        items: arrayFilters.free.map(value =>
                                                     BUFF.FREELEECH.find(f => f.value.toString() === value.toString())
                                                    ).filter(Boolean)
                    });
                }

                // Boolean filters (Tags, Health, History, Special)
                if (booleanFilters.length > 0) {
                    const tagItems = [];
                    const statusItems = [];

                    booleanFilters.forEach(key => {
                        // Check Tags
                        const tag = TAGS.find(t => t.urlParam === key);
                        if (tag) {
                            tagItems.push({ ...tag, group: 'metadata' });
                            return;
                        }

                        // Check Health
                        const health = HEALTH.find(h => h.urlParam === key);
                        if (health) {
                            statusItems.push({ ...health, group: 'status' });
                            return;
                        }

                        // Check History
                        const history = HISTORY.find(h => h.urlParam === key);
                        if (history) {
                            statusItems.push({ ...history, group: 'status' });
                            return;
                        }

                        // Check Special
                        const special = BUFF.SPECIAL.find(s => s.urlParam === key);
                        if (special) {
                            statusItems.push({ ...special, group: 'status' });
                        }
                    });

                    if (tagItems.length > 0) {
                        groups.push({
                            name: 'Tags',
                            icon: '🏷️',
                            group: 'metadata',
                            items: tagItems
                        });
                    }

                    if (statusItems.length > 0) {
                        groups.push({
                            name: 'Status',
                            icon: '📊',
                            group: 'status',
                            items: statusItems
                        });
                    }
                }

                DEBUG.log('Generated Filter Groups', groups);
                return groups;
            };

            const filterGroups = getFilterGroups(filterSet);
            DEBUG.log('Filter Groups to Display', filterGroups);

            // Create modal content
            modal.innerHTML = `
        <div class="filter-details-header" style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 16px;
            border-bottom: 1px solid #e5e7eb;
        ">
            <h3 style="
                font-size: 18px;
                font-weight: 600;
                color: #1f2937;
                margin: 0;
            ">${filterName} Filters</h3>
            <button class="modal-button cancel">Close</button>
        </div>
        <div class="filter-details-content">
            ${filterGroups.length ? filterGroups.map(group => `
                <div class="filter-details-group" style="margin-bottom: 20px;">
                    <div class="filter-details-group-header" style="
                        font-weight: 500;
                        color: #4b5563;
                        margin-bottom: 8px;
                    ">
                        <span class="filter-icon">${group.icon}</span> ${group.name}
                    </div>
                    <div class="filter-details-filters" style="
                        display: flex;
                        flex-wrap: wrap;
                        gap: 8px;
                    ">
                        ${group.items.map(item => `
                            <span class="filter-tag" data-group="${group.group}" style="
                                display: inline-flex;
                                align-items: center;
                                padding: 6px 12px;
                                border-radius: 6px;
                                font-size: 13px;
                                background-color: ${
                                          group.group === 'content' ? '#f0f9ff' :
                                          group.group === 'metadata' ? '#f0fdf4' :
                                          '#fef2f2'
                                          };
                                border: 1px solid ${
                                          group.group === 'content' ? '#e0f2fe' :
                                          group.group === 'metadata' ? '#dcfce7' :
                                          '#fee2e2'
                                          };
                            ">
                                <span class="filter-icon">${item.icon || group.icon}</span>
                                <span class="filter-name" style="margin-left: 8px;">${item.name}</span>
                            </span>
                        `).join('')}
                    </div>
                </div>
            `).join('') : '<div class="no-filters" style="text-align: center; color: #6b7280; padding: 20px;">No filters in this set</div>'}
        </div>
    `;

            // Add event listeners
            const closeBtn = modal.querySelector('.modal-button');
            closeBtn.addEventListener('click', () => {
                overlay.remove();
                modal.remove();
            });

            // Close on overlay click
            overlay.addEventListener('click', () => {
                overlay.remove();
                modal.remove();
            });

            // Prevent modal clicks from closing
            modal.addEventListener('click', (e) => {
                e.stopPropagation();
            });

            // Add to document
            document.body.appendChild(overlay);
            document.body.appendChild(modal);
        }

        exportFilters() {
            const encoded = this.filterManager.exportFilters();
            if (encoded) {
                navigator.clipboard.writeText(encoded)
                    .then(() => {
                    // Show success message
                    this.showNotification('Filter code copied to clipboard');
                })
                    .catch(err => {
                    console.error('Failed to copy to clipboard:', err);
                    // Show manual copy dialog
                    this.showExportDialog(encoded);
                });
            }
        }


        // Show notification
        showNotification(message, type = 'success') {
            const notification = document.createElement('div');
            notification.className = `filter-notification ${type}`;
            notification.textContent = message;

            document.body.appendChild(notification);

            // Remove notification after 3 seconds
            setTimeout(() => {
                notification.classList.add('fade-out');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 3000);
        }

        // Import filters
        importFilters() {
            const importCode = this.container.querySelector('#importCode');
            if (importCode && importCode.value.trim()) {
                const success = this.filterManager.importFilters(importCode.value.trim());
                if (success) {
                    this.hideImportModal();
                    this.render();
                    this.showNotification('Filters imported successfully');
                } else {
                    this.showNotification('Invalid filter code', 'error');
                }
            }
        }



        hide() {
            if (!this.container) return;

            console.group('[Hide Trace]');
            console.log('Hide method called from:', new Error().stack);

            // First remove visible class
            this.container.classList.remove('visible');

            // Reset any open modals or states
            const saveModal = this.container.querySelector('.save-modal');
            if (saveModal) {
                saveModal.classList.add('hidden');
            }

            const importModal = this.container.querySelector('.import-modal');
            if (importModal) {
                importModal.classList.add('hidden');
            }

            const sidepanel = this.container.querySelector('.api-sidepanel');
            if (sidepanel) {
                sidepanel.classList.remove('expanded');
            }

            // Wait for animation to complete before hiding container
            setTimeout(() => {
                // Add hidden class to container after animation
                this.container.classList.add('hidden');
            }, 300); // Match your CSS transition duration

            console.groupEnd();
        }

        insertIntoPage() {
            const targetElement = document.querySelector('#torrentSearchForm');
            if (targetElement) {
                targetElement.parentNode.insertBefore(this.container, targetElement.nextSibling);
                this.setupEventListeners();
            } else {
                console.warn('Target element #torrentSearchForm not found');
            }
        }



        saveNewFilter() {
            const nameInput = this.container.querySelector('#newFilterName');
            if (nameInput && nameInput.value.trim()) {
                const success = this.filterManager.saveCurrentFilters(nameInput.value.trim());
                if (success) {
                    this.renderSavedFilters();
                    nameInput.value = '';
                }
            }
        }

        setupEventListeners() {
            const searchInput = this.container.querySelector('#filterSearch');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    const results = this.filterManager.searchFilters(e.target.value);
                    this.renderSearchResults(results);
                });
            }

            // Add this new event handler for the main filter modal
            const filterModal = this.container.querySelector('.filter-modal');
            if (filterModal) {
                filterModal.addEventListener('click', (e) => {
                    // Get the clicked element
                    const clickedElement = e.target;

                    // Check what was clicked
                    const clickedModal = clickedElement === filterModal;
                    const clickedSortMenu = clickedElement.closest('.sort-menu');
                    const clickedSortButton = clickedElement.closest('.sort-button');
                    const clickedSidepanel = clickedElement.closest('.api-sidepanel');
                    const clickedExpandedPanel = clickedElement.closest('.api-expanded-panel');

                    // If clicked on modal background (not any of its children components)
                    if (clickedModal) {
                        e.stopPropagation();

                        // Handle sort menu if it's visible
                        if (this.sortMenu?.visible && !clickedSortMenu && !clickedSortButton) {
                            this.sortMenu.hideMenu();
                        }

                        // Handle expanded sidepanel
                        const sidepanel = this.container.querySelector('.api-sidepanel');
                        if (sidepanel?.classList.contains('expanded') &&
                            !clickedSidepanel &&
                            !clickedExpandedPanel) {
                            console.log('Closing sidepanel from modal click');
                            sidepanel.classList.remove('expanded');
                            this.sidebarExpanded = false;

                            // Update expanded panel data attribute
                            const expandedPanel = sidepanel.querySelector('.api-expanded-panel');
                            if (expandedPanel) {
                                expandedPanel.dataset.activeTab = '';
                            }
                        }
                    }
                });
            }

            // Also add a more direct close method
            const closeExpandedPanel = () => {
                const sidepanel = this.container.querySelector('.api-sidepanel');
                if (sidepanel && sidepanel.classList.contains('expanded')) {
                    sidepanel.classList.remove('expanded');
                    this.sidebarExpanded = false;
                    console.log('Forced sidepanel collapse');
                }
            };



            // Add escape key handler
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    // Close sort menu if it's open
                    if (this.sortMenu?.visible) {
                        this.sortMenu.hideMenu();
                    }

                    // Close sidepanel if it's expanded
                    const sidepanel = this.container.querySelector('.api-sidepanel');
                    if (sidepanel?.classList.contains('expanded')) {
                        sidepanel.classList.remove('expanded');
                        this.sidebarExpanded = false;

                        const expandedPanel = sidepanel.querySelector('.api-expanded-panel');
                        if (expandedPanel) {
                            expandedPanel.dataset.activeTab = '';
                        }
                    }

                    // Close the main filter modal
                    this.hide();
                }
            });

            // Cancel button
            const cancelBtn = this.container.querySelector('#cancelBtn');
            if (cancelBtn) {
                cancelBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.hide();
                });
            }

            const saveBtn = this.container.querySelector('#saveBtn');
            if (saveBtn) {
                saveBtn.addEventListener('click', () => this.showSaveModal());
            }

            const exportBtn = this.container.querySelector('#exportBtn');
            if (exportBtn) {
                exportBtn.addEventListener('click', () => this.exportFilters());
            }

            const importBtn = this.container.querySelector('#importBtn');
            if (importBtn) {
                importBtn.addEventListener('click', () => this.showImportModal());
            }

            const applyBtn = this.container.querySelector('#applyBtn');
            if (applyBtn) {
                applyBtn.addEventListener('click', () => {
                    DEBUG.log('Apply Button Clicked', 'Processing...');
                    this.filterManager.logCurrentState();
                    this.hide();
                    this.filterManager.applyFilters();
                });
            }

            const apiSearchBtn = this.container.querySelector('#apiSearchBtn');
            if (apiSearchBtn) {
                apiSearchBtn.addEventListener('click', async () => {
                    console.log('API search button clicked');

                    const apiKey = this.filterManager.apiManager.getApiKey();
                    if (!apiKey) {
                        console.log('No API key found');
                        this.showNotification('Please configure your API key first', 'error');
                        return;
                    }

                    // Clear the search state when using the API search button
                    this.clearSearchState();

                    apiSearchBtn.disabled = true;
                    const originalText = apiSearchBtn.textContent;
                    apiSearchBtn.innerHTML = '<span class="loading-spinner"></span> Searching...';

                    try {
                        const sidepanel = this.container.querySelector('.api-sidepanel');
                        if (sidepanel) {
                            console.log('Found sidepanel, expanding');
                            this.sidebarExpanded = true;
                            sidepanel.classList.add('expanded');
                            console.log('Panel classes after expand:', sidepanel.classList.toString());

                            // Switch to results tab
                            const tabs = sidepanel.querySelectorAll('.api-tab');
                            const contents = sidepanel.querySelectorAll('.api-tab-content');

                            tabs.forEach(tab => tab.classList.remove('active'));
                            contents.forEach(content => content.classList.remove('active'));

                            const resultsTab = sidepanel.querySelector('[data-tab="results"]');
                            const resultsContent = sidepanel.querySelector('[data-tab-content="results"]');

                            if (resultsTab && resultsContent) {
                                resultsTab.classList.add('active');
                                resultsContent.classList.add('active');
                                console.log('Activated results tab and content');

                                // Show loading state
                                resultsContent.innerHTML = `
                        <div class="loading-indicator">
                            <span class="loading-spinner"></span>
                            Loading results...
                        </div>
                    `;
                            }
                        }

                        // Make API request without search parameters
                        const results = await this.filterManager.fetchFilteredTorrents(1, 50,
                                                                                       { field: 'created_at', direction: 'desc' });

                        // Validate response structure
                        if (results.success && results.results?.data) {
                            console.log(`Got ${results.results.data.length} results from API`);
                            this.renderApiResults(results);
                            // Add pagination setup
                            const resultsContent = this.container.querySelector('[data-tab-content="results"]');
                            if (resultsContent) {
                                this.setupPaginationListeners(resultsContent);
                            }
                        } else {
                            throw new Error('Invalid response structure');
                        }

                    } catch (error) {
                        console.error('API search error:', error);
                        const resultsContent = this.container.querySelector('[data-tab-content="results"]');
                        if (resultsContent) {
                            resultsContent.innerHTML = `
                <div class="api-error">
                    <p>Error performing search: ${error.message}</p>
                    <p>Please try again later.</p>
                </div>
            `;
                        }
                        this.showNotification('Error performing search: ' + error.message, 'error');
                    } finally {
                        apiSearchBtn.disabled = false;
                        apiSearchBtn.textContent = originalText;
                    }
                });
            }



            // Save new filter
            const saveNewFilterBtn = this.container.querySelector('#saveNewFilterBtn');
            if (saveNewFilterBtn) {
                saveNewFilterBtn.addEventListener('click', () => {
                    const nameInput = this.container.querySelector('#newFilterName');
                    if (nameInput && nameInput.value.trim()) {
                        if (this.filterManager.saveCurrentFilters(nameInput.value.trim())) {
                            nameInput.value = '';
                            this.handleFilterSetChange(); // Re-render after saving
                        }
                    }
                });
            }

            const deleteHandler = (filterName) => {
                this.showConfirmation(
                    'Delete Filter Set',
                    `Are you sure you want to delete "${filterName}"?`,
                    () => {
                        if (this.filterManager.deleteSavedFilter(filterName)) {
                            this.handleFilterSetChange(); // Re-render after deleting
                            this.showNotification('Filter set deleted');
                        } else {
                            this.showNotification('Failed to delete filter set', 'error');
                        }
                    }
                );
            };

            // Load filter
            const loadHandler = (filterName) => {
                if (this.filterManager.loadSavedFilter(filterName)) {
                    this.hideSaveModal();
                    this.render();
                    this.handleFilterSetChange(); // Re-render after loading
                    this.showNotification('Filter set loaded successfully');
                } else {
                    this.showNotification('Failed to load filter set', 'error');
                }
            };

            const cancelSaveBtn = this.container.querySelector('#cancelSaveBtn');
            if (cancelSaveBtn) {
                cancelSaveBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.hideSaveModal();

                    // Reset the filter set tabs and inputs
                    const nameInput = this.container.querySelector('#newFilterName');
                    if (nameInput) {
                        nameInput.value = '';
                    }

                    // Reset to custom tab
                    const customTab = this.container.querySelector('[data-tab="custom"]');
                    if (customTab) {
                        customTab.click();
                    }
                });
            }

            const confirmImportBtn = this.container.querySelector('#confirmImportBtn');
            if (confirmImportBtn) {
                confirmImportBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.importFilters();

                    // Clear import textarea after successful import
                    const importCode = this.container.querySelector('#importCode');
                    if (importCode) {
                        importCode.value = '';
                    }
                });
            }

            const cancelImportBtn = this.container.querySelector('#cancelImportBtn');
            if (cancelImportBtn) {
                cancelImportBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.hideImportModal();

                    // Clear import textarea when canceling
                    const importCode = this.container.querySelector('#importCode');
                    if (importCode) {
                        importCode.value = '';
                    }
                });
            }

            const selectAllBtn = this.container.querySelector('#selectAllBtn');
            if (selectAllBtn) {
                selectAllBtn.addEventListener('click', () => {
                    const activeGroup = this.filterManager.getActiveGroup();
                    if (activeGroup) {
                        this.filterManager.selectAllInGroup(activeGroup);
                        this.render();
                    }
                });
            }

            const clearAllBtn = this.container.querySelector('#clearAllBtn');
            if (clearAllBtn) {
                clearAllBtn.addEventListener('click', () => {
                    const activeGroup = this.filterManager.getActiveGroup();
                    if (activeGroup) {
                        this.filterManager.clearAllInGroup(activeGroup);
                        this.render();
                    }
                });
            }

            // Escape key handler
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    if (!this.container.classList.contains('hidden')) {
                        e.preventDefault();
                        this.hide();
                    }
                }
            });


            const modalContent = this.container.querySelector('.filter-modal');
            if (modalContent) {
                modalContent.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
            }

            this.container.querySelectorAll('.filter-set-tab').forEach(tab => {
                tab.addEventListener('click', () => {
                    // Update active tab
                    this.container.querySelectorAll('.filter-set-tab').forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');

                    // Update content visibility
                    const tabId = tab.dataset.tab;
                    this.container.querySelectorAll('.filter-set-content').forEach(content => {
                        content.classList.remove('active');
                        if (content.dataset.tabContent === tabId) {
                            content.classList.add('active');
                        }
                    });

                    // Toggle save filter visibility
                    const saveFilter = this.container.querySelector('#customSaveFilter');
                    if (saveFilter) {
                        saveFilter.style.display = tabId === 'custom' ? 'flex' : 'none';
                    }

                    // Render appropriate content
                    if (tabId === 'common') {
                        this.renderCommonFilterSets();
                    } else {
                        this.renderSavedFilters();
                    }
                });
            });

            // Re-setup sidepanel listeners
            console.log('Re-setting up sidepanel listeners on show');
            this.setupApiSidepanelListeners();
        }

        validateApiResponse(response) {
            if (!response || !response.success) {
                return false;
            }

            // Check for various valid data structures
            const hasData = response.results?.data && Array.isArray(response.results.data);
            const hasDirectResults = Array.isArray(response.results);
            const hasDirectData = Array.isArray(response.data);

            return hasData || hasDirectResults || hasDirectData;
        }

        // New method to handle API sidepanel specific listeners
        setupApiSidepanelListeners() {
            console.log('Setting up API sidepanel listeners');
            const panel = this.container.querySelector('.api-sidepanel');
            if (!panel) {
                console.error('No sidepanel found');
                return;
            }
            console.log('Found sidepanel:', panel);

            // Explicitly remove old handler
            if (this.outsideClickHandler) {
                document.removeEventListener('click', this.outsideClickHandler);
            }

            // Create handler function
            this.outsideClickHandler = (e) => {
                console.log('Click event triggered', {
                    target: e.target,
                    expanded: this.sidebarExpanded,
                    inFilterContent: !!e.target.closest('.filter-content'),
                    inFilterSidebar: !!e.target.closest('.filter-sidebar'),
                    inSidepanel: !!e.target.closest('.api-sidepanel')
                });

                if (!this.sidebarExpanded) return;

                const isMainContentClick = e.target.closest('.filter-content') ||
                      e.target.closest('.filter-sidebar');

                if (isMainContentClick && !e.target.closest('.api-sidepanel')) {
                    console.log('Valid click detected, closing panel');
                    this.handleSidepanelState(false);
                }
            };

            // Bind handler
            document.addEventListener('click', this.outsideClickHandler, true);

            // Centralized state management
            this.handleSidepanelState = (expanded, activeTab = null) => {
                const sidepanel = this.container.querySelector('.api-sidepanel');
                const expandedPanel = sidepanel?.querySelector('.api-expanded-panel');

                console.log('Handling sidepanel state:', {expanded, activeTab, current: this.sidebarExpanded});

                this.sidebarExpanded = expanded;

                if (sidepanel) {
                    sidepanel.classList.toggle('expanded', expanded);
                    console.log('Updated panel classes:', sidepanel.classList.toString());
                }

                if (expandedPanel) {
                    expandedPanel.dataset.activeTab = activeTab || '';
                }
            };

            // Click outside handler
            this.handleOutsideClick = (e) => {
                console.log('Outside click handler triggered:', {
                    target: e.target,
                    targetClasses: e.target.className,
                    targetParents: [...e.target.closest('*').classList],
                    sidebarExpanded: this.sidebarExpanded,
                    isFilterContent: !!e.target.closest('.filter-content'),
                    isFilterSidebar: !!e.target.closest('.filter-sidebar'),
                    isFilterModal: !!e.target.closest('.filter-modal'),
                    isSidepanel: !!e.target.closest('.api-sidepanel'),
                    isExpandedPanel: !!e.target.closest('.api-expanded-panel'),
                    isExcluded: !!e.target.closest('.sort-menu') ||
                    !!e.target.closest('.sort-button') ||
                    !!e.target.closest('.save-modal') ||
                    !!e.target.closest('.import-modal')
                });

                if (!this.sidebarExpanded) return;

                const isFilterModalClick = e.target.closest('.filter-modal');
                const isSidepanelClick = e.target.closest('.api-sidepanel');
                const isExpandedPanelClick = e.target.closest('.api-expanded-panel');
                const isExcludedClick = e.target.closest('.sort-menu') ||
                      e.target.closest('.sort-button') ||
                      e.target.closest('.save-modal') ||
                      e.target.closest('.import-modal');

                const isMainContentClick = e.target.closest('.filter-content') ||
                      e.target.closest('.filter-sidebar');

                console.log('Click evaluation:', {
                    shouldClose: (isFilterModalClick || isMainContentClick) &&
                    !isSidepanelClick &&
                    !isExpandedPanelClick &&
                    !isExcludedClick
                });

                if ((isFilterModalClick || isMainContentClick) &&
                    !isSidepanelClick &&
                    !isExpandedPanelClick &&
                    !isExcludedClick) {
                    console.log('Closing sidepanel');
                    this.handleSidepanelState(false);
                }
            };

            document.addEventListener('click', this.handleOutsideClick);

            // Initialize results placeholder
            const resultsContent = this.container.querySelector('[data-tab-content="results"]');
            if (resultsContent) {
                resultsContent.innerHTML = `
           <div class="api-results-placeholder">
               <p>Use "Search via API" to view results here</p>
           </div>
       `;
            }

            // Avatar click handler
            const avatarBtn = this.container.querySelector('#userAvatarBtn');
            if (avatarBtn) {
                avatarBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    console.log('Avatar button clicked');
                    this.handleSidepanelState(!this.sidebarExpanded, 'profile');

                    if (this.sidebarExpanded) {
                        const profileTab = panel.querySelector('[data-tab="profile"]');
                        if (profileTab) {
                            this.switchToTab(panel, 'profile');
                            this.renderProfileTab();
                        }
                    }
                });
            }

            // Expand button handler
            const expandBtn = panel.querySelector('button.api-expand-button');
            if (expandBtn) {
                expandBtn.onclick = async (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    const newState = !this.sidebarExpanded;
                    this.handleSidepanelState(newState);

                    if (newState) {
                        const storedApiKey = this.filterManager.apiManager?.getApiKey();
                        const expandedPanel = panel.querySelector('.api-expanded-panel');

                        if (!storedApiKey && expandedPanel) {
                            const isApiConnected = await this.updateApiStatus();
                            if (!isApiConnected) {
                                expandedPanel.innerHTML = `
                           <div class="api-not-connected">
                               <div class="api-warning-icon">⚠️</div>
                               <h3>API Not Connected</h3>
                               <p>Please configure your API key in Features > API Authentication to access additional functionality.</p>
                           </div>
                       `;
                            }
                        }
                    }
                };
            }

            // Tab switching helper
            this.switchToTab = (panel, tabId) => {
                panel.querySelectorAll('.api-tab').forEach(t => t.classList.remove('active'));
                panel.querySelectorAll('.api-tab-content').forEach(c => c.classList.remove('active'));

                const targetTab = panel.querySelector(`[data-tab="${tabId}"]`);
                const targetContent = panel.querySelector(`[data-tab-content="${tabId}"]`);

                if (targetTab) targetTab.classList.add('active');
                if (targetContent) targetContent.classList.add('active');
            };

            // Tab click handlers
            panel.querySelectorAll('.api-tab').forEach(tab => {
                tab.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    if (!this.sidebarExpanded) {
                        this.handleSidepanelState(true);
                    }

                    const tabId = tab.dataset.tab;
                    this.switchToTab(panel, tabId);

                    const expandedPanel = panel.querySelector('.api-expanded-panel');
                    if (expandedPanel) {
                        expandedPanel.dataset.activeTab = tabId;
                    }

                    if (tabId === 'profile') {
                        this.renderProfileTab();
                    }
                };
            });

            // Initial setup
            this.updateApiStatus();
            console.log('Initial state:', {
                sidebarExpanded: this.sidebarExpanded,
                panelClasses: panel.classList.toString()
            });
        }

        show() {
            if (!this.container) return;

            console.log('Show method called');
            const wasVisible = this.container.classList.contains('visible');

            // Remove hidden class
            this.container.classList.remove('hidden');

            // Only render if not already visible
            if (!wasVisible) {
                this.filterManager.setActiveGroup('content');
                this.render();
                requestAnimationFrame(() => {
                    this.container.classList.add('visible');
                });
            }
        }

        showSaveModal() {
            const saveModal = this.container.querySelector('.save-modal');
            if (saveModal) {
                this.renderSavedFilters();
                this.renderCommonFilterSets();
                saveModal.classList.remove('hidden');
            }
        }

        hideSaveModal() {
            const saveModal = this.container.querySelector('.save-modal');
            if (saveModal) {
                saveModal.classList.add('hidden');
            }
        }

        showImportModal() {
            const importModal = this.container.querySelector('.import-modal');
            if (importModal) {
                importModal.classList.remove('hidden');
            }
        }

        hideImportModal() {
            const importModal = this.container.querySelector('.import-modal');
            if (importModal) {
                importModal.classList.add('hidden');
            }
        }

        toggleSidepanel() {
            console.log('Toggle sidepanel called');
            const sidepanel = this.container.querySelector('.api-sidepanel');
            if (sidepanel) {
                this.sidebarExpanded = !this.sidebarExpanded;
                console.log('New expanded state:', this.sidebarExpanded);

                if (this.sidebarExpanded) {
                    sidepanel.classList.add('expanded');
                } else {
                    sidepanel.classList.remove('expanded');
                }
                console.log('Panel classes after toggle:', sidepanel.classList.toString());
            }
        }

        // New method to handle API status updates
        async updateApiStatus() {
            const indicator = this.container.querySelector('.api-status-indicator');
            const apiKey = this.filterManager.apiManager.getApiKey();

            if (!apiKey) {
                if (indicator) {
                    indicator.classList.remove('connected');
                    indicator.classList.add('disconnected');
                    indicator.title = 'API Not Connected';
                }
                return false;
            }

            try {
                const result = await this.filterManager.apiManager.validateApiKey(apiKey);
                if (result.valid) {
                    if (indicator) {
                        indicator.classList.remove('disconnected');
                        indicator.classList.add('connected');
                        indicator.title = 'API Connected';
                    }
                    return true;
                }
                throw new Error('Invalid API key');
            } catch (error) {
                if (indicator) {
                    indicator.classList.remove('connected');
                    indicator.classList.add('disconnected');
                    indicator.title = 'API Connection Error';
                }
                return false;
            }
        }

        renderGroups() {
            console.group('[Render Trace]');
            console.log('renderGroups called from:', new Error().stack);

            const groupsContainer = this.container.querySelector('#filterGroups');
            const groups = this.filterManager.getGroups();

            // Store current active group
            const currentActiveGroup = this.filterManager.getActiveGroup();

            groupsContainer.innerHTML = groups.map(group => `
        <button
            class="group-button ${currentActiveGroup === group.id ? 'active' : ''}"
            data-group-id="${group.id}"
        >
            <span class="group-icon">${group.icon}</span>
            <span class="group-name">${group.name}</span>&nbsp;
            ${group.selectedCount > 0 ? `
                <span class="group-count">${group.selectedCount}</span>
            ` : ''}
        </button>
    `).join('');

            // Add click event listeners to group buttons
            groupsContainer.querySelectorAll('.group-button').forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    const groupId = button.dataset.groupId;
                    const currentActiveGroup = this.filterManager.getActiveGroup();

                    // Even if it's the same group, we should still process the click
                    // This allows users to return to group content view

                    // Update active class
                    groupsContainer.querySelectorAll('.group-button').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    button.classList.add('active');

                    console.log('[Render Trace] Switching to group:', groupId);

                    // Set active group and render sections
                    this.filterManager.setActiveGroup(groupId);
                    this.renderSections();
                });
            });
            console.groupEnd();
        }

        renderActiveFilters() {
            const activeFiltersContainer = this.container.querySelector('#activeFilters');
            const summary = this.filterManager.getActiveFiltersSummary();
            const totalFilters = summary.reduce((total, section) => total + section.filters.length, 0);

            // Helper function to determine filter group
            const getFilterGroup = (sectionId) => {
                for (const [groupName, group] of Object.entries(FILTER_GROUPS)) {
                    if (group.sections.some(section => section.id === sectionId)) {
                        return group.id;
                    }
                }
                return '';
            };

            // Show compact view by default with total count and expand button
            activeFiltersContainer.innerHTML = `
        <div class="active-filters-header">
            <div class="active-filters-summary">
                <span class="filter-count ${totalFilters ? 'has-filters' : ''}">
                    ${totalFilters ? `${totalFilters} filter${totalFilters > 1 ? 's' : ''} selected` : 'No filters selected'}
                </span>
                ${totalFilters > 0 ? `
                    <button class="toggle-filters" id="toggleFiltersBtn">
                        Show selected filters
                    </button>
                ` : ''}
            </div>
        </div>
        ${totalFilters > 0 ? `
            <div class="active-filters-content hidden">
                <div class="active-filters-wrapper">
                    ${summary.flatMap(section =>
                                      section.filters.map(filter => `
                            <span class="filter-tag" data-group="${getFilterGroup(section.sectionId)}">
                                <span class="filter-icon">${filter.icon}</span>
                                <span class="filter-name">${filter.name}</span>
                                <button
                                    class="remove-filter"
                                    data-section-id="${section.sectionId}"
                                    data-filter-value="${filter.value}"
                                    aria-label="Remove ${filter.name}"
                                >×</button>
                            </span>
                        `).join('')
                                     ).join('')}
                    <button class="clear-all-button" id="clearAllFiltersBtn">Clear all</button>
                </div>
            </div>
        ` : ''}
    `;

            // Add event listeners
            if (totalFilters > 0) {
                // Toggle button
                const toggleBtn = activeFiltersContainer.querySelector('#toggleFiltersBtn');
                const content = activeFiltersContainer.querySelector('.active-filters-content');

                if (toggleBtn && content) {
                    toggleBtn.addEventListener('click', () => {
                        const isHidden = content.classList.contains('hidden');
                        content.classList.toggle('hidden');
                        toggleBtn.textContent = isHidden ? 'Hide selected filters' : 'Show selected filters';
                    });
                }

                // Remove individual filters
                activeFiltersContainer.querySelectorAll('.remove-filter').forEach(button => {
                    button.addEventListener('click', () => {
                        this.filterManager.toggleSectionFilter(
                            button.dataset.sectionId,
                            button.dataset.filterValue
                        );
                        this.render();
                    });
                });

                // Clear all button
                const clearAllBtn = activeFiltersContainer.querySelector('#clearAllFiltersBtn');
                if (clearAllBtn) {
                    clearAllBtn.addEventListener('click', () => {
                        this.filterManager.clearFilters();
                        this.render();
                    });
                }
            }
        }

        renderSections() {
            console.group('[Render Trace]');
            console.log('renderSections called from:', new Error().stack);
            console.log('activeGroup:', this.filterManager.getActiveGroup());

            const sectionsContainer = this.container.querySelector('#filterSections');
            const activeGroup = this.filterManager.getActiveGroup();
            const sections = this.filterManager.getGroupSections(activeGroup);

            if (!sections.length) {
                sectionsContainer.innerHTML = '<div class="no-filters">No filters available</div>';
                return;
            }

            sectionsContainer.innerHTML = sections.map(section => `
    <div class="filter-section">
        <div class="section-header" data-section-id="${section.id}">
            <div class="section-title">
                <span class="section-icon">${section.icon}</span>
                <span class="section-name">${section.name}</span>
                ${section.selectedCount > 0 ? `
                    <span class="section-count">
                        (${section.selectedCount} selected)
                    </span>
                ` : ''}
            </div>
            <button
                class="collapse-button ${this.filterManager.isSectionExpanded(section.id) ? 'expanded' : ''}"
                data-section-id="${section.id}"
                aria-label="${this.filterManager.isSectionExpanded(section.id) ? 'Collapse section' : 'Expand section'}"
            >
                <span>${this.filterManager.isSectionExpanded(section.id) ? 'Collapse' : 'Expand'}</span>
            </button>
        </div>
        <div class="section-content ${this.filterManager.isSectionExpanded(section.id) ? '' : 'hidden'}">
            ${section.filters.map(filter => `
                <label class="filter-option"
                       ${filter.urlParam === 'health' ? `data-health="${filter.value}"` : ''}
                       ${section.id === 'freeleech' ? `data-freeleech-value="${filter.value}"` : ''}
                       title="${filter.name}">
                    <input
                        type="checkbox"
                        ${this.filterManager.isFilterActive(section.id, filter.value) ? 'checked' : ''}
                        data-section-id="${section.id}"
                        data-filter-value="${filter.value}"
                        ${section.id === 'freeleech' ? `data-freeleech="true"` : ''}
                    >
                    <span class="filter-label">
                        <span class="filter-icon">
                            ${section.id === 'freeleech' ? filter.icon : this.getFilterIcon(section.id, filter)}
                        </span>
                        ${filter.name}
                    </span>
                </label>
            `).join('')}
        </div>
    </div>
`).join('');


            // If we're in the features group, append the API Auth section
            if (activeGroup === 'features') {

                const storedApiKey = this.filterManager.apiManager?.getApiKey();
                const verifyButtonState = storedApiKey ? 'verified' : 'verify';
                const statusMessage = storedApiKey ? '✓ API key is configured' : 'No API key configured';
                const statusClass = storedApiKey ? 'success' : 'pending';

                const apiConfigSection = document.createElement('div');
                apiConfigSection.className = 'filter-section';
                apiConfigSection.innerHTML = `
        <div class="section-header" data-section-id="apiConfig">
            <div class="section-title">
                <span class="section-icon">🔌</span>
                <span class="section-name">API Authentication</span>
            </div>
            <button
                class="collapse-button ${this.filterManager.isSectionExpanded('apiConfig') ? 'expanded' : ''}"
                data-section-id="apiConfig"
                aria-label="${this.filterManager.isSectionExpanded('apiConfig') ? 'Collapse section' : 'Expand section'}"
            >
                <span>${this.filterManager.isSectionExpanded('apiConfig') ? 'Collapse' : 'Expand'}</span>
            </button>
        </div>
        <div class="section-content ${this.filterManager.isSectionExpanded('apiConfig') ? '' : 'hidden'}">
            <div class="api-config-container">
                <div class="api-input-group">
                    <input
                        type="password"
                        class="api-input"
                        id="apiKeyInput"
                        placeholder="Enter your API key"
                        value="${this.filterManager.apiManager?.getApiKey() || ''}"
                    >
                    <button class="api-toggle-visibility" id="toggleVisibilityBtn">👁️</button>
                    <button
    class="api-verify-button verify"
    id="verifyApiBtn"
>Verify</button>
                </div>
                <div class="api-status pending" id="apiStatus">
                    No API key configured
                </div>
            </div>
        </div>
    `;
                if (storedApiKey) {
                    // Verify in background without changing UI unless there's an error
                    this.filterManager.apiManager.validateApiKey(storedApiKey).then(result => {
                        const verifyBtn = sectionsContainer.querySelector('#verifyApiBtn');
                        const statusDiv = sectionsContainer.querySelector('#apiStatus');

                        if (result.valid) {
                            // Update UI for valid key
                            verifyBtn.textContent = '✓ Verified';
                            verifyBtn.className = 'api-verify-button verified';
                            statusDiv.className = 'api-status success';
                            statusDiv.textContent = '✓ API key is configured';
                            console.log('[API Debug] Stored API key validated successfully');
                        } else {
                            // Update UI for invalid key
                            verifyBtn.textContent = 'Try Again';
                            verifyBtn.className = 'api-verify-button try-again';
                            statusDiv.className = 'api-status error';
                            statusDiv.textContent = '✗ Invalid API key';
                            console.log('[API Debug] Stored API key validation failed');
                        }
                    }).catch(error => {
                        console.error('[API Debug] Error validating stored API key:', error);
                        // Update UI for error
                        const verifyBtn = sectionsContainer.querySelector('#verifyApiBtn');
                        const statusDiv = sectionsContainer.querySelector('#apiStatus');
                        verifyBtn.textContent = 'Try Again';
                        verifyBtn.className = 'api-verify-button try-again';
                        statusDiv.className = 'api-status error';
                        statusDiv.textContent = '✗ Error validating API key';
                    });
                }
                sectionsContainer.appendChild(apiConfigSection);
            }

            // Update the event listeners
            sectionsContainer.querySelectorAll('.section-header').forEach(header => {
                header.addEventListener('click', (e) => {
                    // Ignore if clicking checkbox or filter option
                    if (e.target.type === 'checkbox' || e.target.closest('.filter-option')) return;

                    const sectionId = header.dataset.sectionId;
                    const section = header.closest('.filter-section');
                    const content = section.querySelector('.section-content');
                    const button = section.querySelector('.collapse-button');
                    const isExpanded = !content.classList.contains('hidden');

                    this.filterManager.toggleSection(sectionId);

                    // Update button state
                    button.classList.toggle('expanded');
                    button.setAttribute('aria-label', isExpanded ? 'Expand section' : 'Collapse section');
                    button.querySelector('span').textContent = isExpanded ? 'Expand' : 'Collapse';

                    // Update content visibility
                    content.classList.toggle('hidden');
                });
            });

            sectionsContainer.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                checkbox.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent section collapse/expand when clicking checkbox

                    const sectionId = checkbox.dataset.sectionId;
                    const filterValue = checkbox.dataset.filterValue;
                    const isFreeleech = checkbox.dataset.freeleech === 'true';

                    // Debug logging
                    console.log('Checkbox clicked:', {
                        sectionId,
                        filterValue,
                        isFreeleech,
                        checked: checkbox.checked
                    });

                    if (isFreeleech) {
                        console.log('Freeleech value being passed:', filterValue);
                    }

                    this.filterManager.toggleSectionFilter(sectionId, filterValue);
                    this.render();
                });
            });

            // Add hover effect for filter options
            sectionsContainer.querySelectorAll('.filter-option').forEach(option => {
                option.addEventListener('mouseenter', () => {
                    option.classList.add('hover');
                });
                option.addEventListener('mouseleave', () => {
                    option.classList.remove('hover');
                });
            });

            // Add keyboard navigation
            sectionsContainer.querySelectorAll('.filter-option').forEach(option => {
                option.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        const checkbox = option.querySelector('input[type="checkbox"]');
                        checkbox.click();
                    }
                });
            });

            sectionsContainer.querySelectorAll('.filter-option').forEach(option => {
                option.setAttribute('tabindex', '0');
            });

            // Setup API configuration event listeners
            const toggleBtn = sectionsContainer.querySelector('#toggleVisibilityBtn');
            const verifyBtn = sectionsContainer.querySelector('#verifyApiBtn');
            const apiInput = sectionsContainer.querySelector('#apiKeyInput');
            const statusDiv = sectionsContainer.querySelector('#apiStatus');

            console.log('[API Debug] Found elements:', {
                toggleBtn: !!toggleBtn,
                verifyBtn: !!verifyBtn,
                apiInput: !!apiInput,
                statusDiv: !!statusDiv
            });

            if (toggleBtn && apiInput) {
                toggleBtn.addEventListener('click', () => {
                    console.log('[API Debug] Toggle visibility clicked');
                    apiInput.type = apiInput.type === 'password' ? 'text' : 'password';
                });
            }

            if (verifyBtn && apiInput && statusDiv) {
                verifyBtn.addEventListener('click', async () => {
                    const apiKey = apiInput.value.trim();
                    if (!apiKey) {
                        statusDiv.className = 'api-status error';
                        statusDiv.textContent = 'Please enter an API key';
                        return;
                    }

                    verifyBtn.disabled = true;
                    verifyBtn.textContent = 'Verifying...';
                    statusDiv.className = 'api-status pending';
                    statusDiv.textContent = 'Verifying API key...';

                    try {
                        const result = await this.filterManager.apiManager.validateApiKey(apiKey);
                        if (result.valid) {
                            this.filterManager.apiManager.setApiKey(apiKey);
                            verifyBtn.textContent = '✓ Verified';
                            verifyBtn.className = 'api-verify-button verified';
                            statusDiv.className = 'api-status success';
                            statusDiv.textContent = '✓ API key is configured';

                            // Update expanded panel content
                            const expandedPanel = this.container.querySelector('.api-expanded-panel');
                            if (expandedPanel) {
                                expandedPanel.innerHTML = `
                        <div class="api-tabs">
                            <div class="api-tab active" data-tab="filter">Filter</div>
                            <div class="api-tab" data-tab="results">Results</div>
                            <div class="api-tab" data-tab="stats">Stats</div>
                        </div>
                        <div class="api-tab-content active" data-tab-content="filter">
                            <!-- Filter content here -->
                        </div>
                        <div class="api-tab-content" data-tab-content="results">
                            <!-- Results content here -->
                        </div>
                        <div class="api-tab-content" data-tab-content="stats">
                            <!-- Stats content here -->
                        </div>
                    `;

                                // Add animation class
                                expandedPanel.classList.add('api-panel-activated');

                                // Re-initialize tab listeners
                                this.setupApiSidepanelListeners();
                            }
                        } else {
                            throw new Error('Invalid API key');
                        }
                    } catch (error) {
                        verifyBtn.textContent = 'Try Again';
                        verifyBtn.className = 'api-verify-button try-again';
                        statusDiv.className = 'api-status error';
                        statusDiv.textContent = '✗ Invalid API key';
                    }

                    verifyBtn.disabled = false;
                });
            }

            // Update any filter counters or summaries
            console.groupEnd();
        }

        renderFeatureOption(section, filter) {
            return `
        <label class="filter-option" title="${filter.name}">
            <input
                type="checkbox"
                ${this.filterManager.isFilterActive(section.id, filter.value) ? 'checked' : ''}
                data-section-id="${section.id}"
                data-filter-value="${filter.value}"
            >
            <span class="filter-label">
                <span class="filter-icon">${filter.icon}</span>
                ${filter.name}
            </span>
        </label>
    `;
        }

        setupApiEventListeners() {
            const toggleBtn = document.getElementById('toggleVisibilityBtn');
            const verifyBtn = document.getElementById('verifyApiBtn');
            const apiInput = document.getElementById('apiKeyInput');
            const statusDiv = document.getElementById('apiStatus');

            if (toggleBtn && apiInput) {
                toggleBtn.addEventListener('click', () => {
                    apiInput.type = apiInput.type === 'password' ? 'text' : 'password';
                });
            }

            if (verifyBtn && apiInput && statusDiv) {
                verifyBtn.addEventListener('click', async () => {
                    const apiKey = apiInput.value.trim();

                    if (!apiKey) {
                        statusDiv.className = 'api-status error';
                        statusDiv.textContent = 'Please enter an API key';
                        return;
                    }

                    verifyBtn.disabled = true;
                    verifyBtn.textContent = 'Verifying...';
                    statusDiv.className = 'api-status pending';
                    statusDiv.textContent = 'Verifying API key...';

                    try {
                        const result = await this.filterManager.apiManager.validateApiKey(apiKey);

                        if (result.valid) {
                            this.filterManager.apiManager.setApiKey(apiKey);
                            verifyBtn.textContent = '✓ Verified';
                            verifyBtn.className = 'api-verify-button verified';
                            statusDiv.className = 'api-status success';
                            statusDiv.textContent = '✓ API key is configured';
                        } else {
                            throw new Error('Invalid API key');
                        }
                    } catch (error) {
                        verifyBtn.textContent = 'Try Again';
                        verifyBtn.className = 'api-verify-button try-again';
                        statusDiv.className = 'api-status error';
                        statusDiv.textContent = '✗ Invalid API key';
                    }

                    verifyBtn.disabled = false;
                });
            }
        }

        render() {
            console.group('[Render Trace]');
            console.log('render called from:', new Error().stack);
            if (!this.container) return;
            this.renderGroups();
            this.renderActiveFilters();
            this.renderSections();

            console.groupEnd();
        }

        renderSearchResults(results) {
            const sectionsContainer = this.container.querySelector('#filterSections');

            if (results.length === 0) {
                sectionsContainer.innerHTML = `
                <div class="search-no-results">
                    No filters match your search
                </div>
            `;
                return;
            }

            sectionsContainer.innerHTML = results.map(result => `
            <div class="search-result-section">
                <div class="search-result-header">
                    ${result.groupName} > ${result.sectionName}
                </div>
                <div class="search-result-content">
                    ${result.matches.map(filter => `
                        <label class="filter-option">
                            <input
                                type="checkbox"
                                ${filter.active ? 'checked' : ''}
                                data-section-id="${result.sectionId}"
                                data-filter-value="${filter.value || filter.urlParam}"
                            >
                            <span class="filter-label">${filter.name}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `).join('');

            // Add event listeners for search result checkboxes
            sectionsContainer.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                checkbox.addEventListener('change', () => {
                    this.filterManager.toggleSectionFilter(
                        checkbox.dataset.sectionId,
                        checkbox.dataset.filterValue
                    );
                    this.render();
                });
            });
        }
    }

    // Initialize the UI when the page loads
    if (window.location.href.startsWith('https://fearnopeer.com/torrents')) {
        window.addEventListener('load', () => {
            const activeElement = document.activeElement;
            if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
                activeElement.blur();
            }
        });

        // Add styles first
        const styleSheet = document.createElement('style');
        styleSheet.textContent = STYLES;
        document.head.appendChild(styleSheet);

        // Initialize managers and UI
        const filterManager = new FilterManager();
        const filterUI = new FilterUI(filterManager);
        const filterTrigger = new FilterTrigger(filterUI);

        // Export for testing if needed
        window.filterManager = filterManager;
        window.filterUI = filterUI;
        window.filterTrigger = filterTrigger;
    }
})();