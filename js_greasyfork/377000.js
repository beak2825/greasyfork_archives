// ==UserScript==
// @name         Fanfiction.net: Filter and Sorter
// @namespace    https://greasyfork.org/en/users/163551-vannius
// @version      1.89
// @license      MIT
// @description  Add filters and additional sorters and "Load all pages" button to Fanfiction.net.
// @author       Vannius
// @match        https://www.fanfiction.net/*
// @exclude      /^https://www\.fanfiction\.net/s//
// @exclude      /^https://www\.fanfiction\.net/r//
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @resource     JSON https://raw.githubusercontent.com/Nellius/FanFiction-FandomData/master/json/exceptional-fandom.json
// @downloadURL https://update.greasyfork.org/scripts/377000/Fanfictionnet%3A%20Filter%20and%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/377000/Fanfictionnet%3A%20Filter%20and%20Sorter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Author Biography Setting
    const HIDE_BIO_AUTOMATICALLY = true;

    // Filter Setting
    // Options for 'gt', 'ge', 'le', 'dateRange' mode.
    // Options for chapters filters.
    // Format: [\d+(K)?] in ascending order
    const chapterOptions = ['1', '5', '10', '20', '30', '50'];
    // Options for word_count_gt and word_count_le filters.
    // Format: [\d+(K)?] in ascending order
    const wordCountOptions = ['1K', '5K', '10K', '20K', '40K', '60K', '80K', '100K', '200K', '300K'];
    // Options for reviews, favs and follows filters.
    // Format: [\d+(K)?] in ascending order
    const kudoCountOptions = ['10', '50', '100', '200', '400', '600', '800', '1K', '2K', '3K'];
    // Options for updated and published filters.
    // Format: [\d+ (hour|day|week|month|year)(s)?] in ascending order
    const dateRangeOptions = ['24 hours', '1 week', '1 month', '6 months', '1 year', '3 years', '5 years'];

    // dataId: property key of storyData defined in makeStoryData()
    // text: text for filter select dom
    // title: title for filter select dom
    // mode: used to determine how to compare selectValue and storyValue in throughFilter()
    // options: required when mode is 'gt', 'ge', 'le', 'dateRange'
    // reverse: reverse result of throughFilter()
    // condition: display filter only if filter[filterKey] has defined value
    const filterDic = {
        fandom_a: { dataId: 'fandom', text: 'Fandom A', title: "Fandom filter a", mode: 'contain' },
        crossover: { dataId: 'crossover', text: '?', title: "Crossover filter", mode: 'equal' },
        // Display only if there are crossover fanfictions
        fandom_b: { dataId: 'fandom', text: 'Fandom B', title: "Fandom filter b", mode: 'contain', condition: { filterKey: 'crossover', value: 'X' } },
        rating: { dataId: 'rating', text: 'Rating', title: "Rating filter", mode: 'equal' },
        language: { dataId: 'language', text: 'Language', title: "Language filter", mode: 'equal' },
        genre: { dataId: 'genre', text: 'Genre', title: "Genre filter", mode: 'contain' },
        not_genre: { dataId: 'genre', text: 'Not Genre', title: "Genre reverse filter", mode: 'contain', reverse: true },
        chapters_gt: { dataId: 'chapters', text: '< Chapters', title: "Chapter number greater than filter", mode: 'gt', options: chapterOptions },
        chapters_le: { dataId: 'chapters', text: 'Chapters ≤', title: "Chapter number less or equal filter", mode: 'le', options: chapterOptions },
        word_count_gt: { dataId: 'word_count', text: '< Words', title: "Word count greater than filter", mode: 'gt', options: wordCountOptions },
        word_count_le: { dataId: 'word_count', text: 'Words ≤', title: "Word count less or equal filter", mode: 'le', options: wordCountOptions },
        reviews: { dataId: 'reviews', text: 'Reviews', title: "Review count greater than or equal filter", mode: 'ge', options: kudoCountOptions },
        favs: { dataId: 'favs', text: 'Favs', title: "Fav count greater than or equal filter", mode: 'ge', options: kudoCountOptions },
        follows: { dataId: 'follows', text: 'Follows', title: "Follow count greater than or equal filter", mode: 'ge', options: kudoCountOptions },
        updated: { dataId: 'updated', text: 'Updated', title: "Updated date range filter", mode: 'dateRange', options: dateRangeOptions },
        published: { dataId: 'published', text: 'Published', title: "Published date range filter", mode: 'dateRange', options: dateRangeOptions },
        character_a: { dataId: 'character', text: 'Character A', title: "Character filter a", mode: 'contain' },
        character_b: { dataId: 'character', text: 'Character B', title: "Character filter b", mode: 'contain' },
        not_character: { dataId: 'character', text: 'Not Character', title: "Character reverse filter", mode: 'contain', reverse: true },
        relationship: { dataId: 'relationship', text: 'Relationship', title: "Relationship filter", mode: 'contain' },
        status: { dataId: 'status', text: 'Status', title: "Status filer", mode: 'equal' }
    };

    // Whether or not to sort characters of relationship in ascending order.
    // true:  [foo, bar] => [bar, foo]
    // false: [foo, bar] => [foo, bar]
    const SORT_CHARACTERS_OF_RELATIONSHIP = true;

    // Sorter Setting
    // dataId: property key of storyData defined in makeStoryData()
    // text: displayed sorter name
    // order: 'asc' or 'dsc'
    const sorterDicList = [
        { dataId: 'fandom', text: 'Category', order: 'asc' },
        { dataId: 'updated', text: 'Updated', order: 'dsc' },
        { dataId: 'published', text: 'Published', order: 'dsc' },
        { dataId: 'title', text: 'Title', order: 'asc' },
        { dataId: 'word_count', text: 'Words', order: 'dsc' },
        { dataId: 'chapters', text: 'Chapters', order: 'dsc' },
        { dataId: 'reviews', text: 'Reviews', order: 'dsc' },
        { dataId: 'favs', text: 'Favs', order: 'dsc' },
        { dataId: 'follows', text: 'Follows', order: 'dsc' },
        { dataId: 'status', text: 'Status', order: 'asc' }
    ];

    // Specify symbols to represent 'asc' and 'dsc'.
    const orderSymbol = { asc: '▲', dsc: '▼' };

    // Css Setting
    // ColorScheme definitions
    // [[backgroundColor, color]]
    const red = [
        // ['#ff1111', '#f96540', '#f4a26d', '#efcc99', 'white'].map(color => [color, getReadableColor(color, '#555')]) =>
        ['#ff1111', "#000033"], ["#f96540", "#000099"], ["#f4a26d", "#000000"], ["#efcc99", "#000000"], ["white", "#000000"]
    ];

    // const blue = makeGradualColorScheme('#11f', '#fff', 'rgb', 5, '#555');
    // const purple = makeGradualColorScheme('#cd47fd', '#e8eaf6', 'hsl', 5, '#555');
    // const gold = makeGradualColorScheme('gold', 'darkgrey', 'rgb', 5);

    // Select colorScheme
    const colorScheme = red;

    // Generate list of className for colorScheme automatically.
    const menuItemGroupClasses = ((length) => {
        let indexes = [...Array(length).keys()].map(x => x.toString());
        if (length.toString().length > 1) {
            indexes = indexes.map(x => x.padStart(length.toString().length, '0'));
        }
        return indexes.map(index => 'fas-filter-menu-item_group-' + index);
    })(colorScheme.length);

    // Generate str of colorScheme css automatically.
    const menuItemGroupCss = menuItemGroupClasses.map((groupClass, i) => {
        return '.' + groupClass +
            " { background-color: " + colorScheme[i][0] +
            "; color: " + colorScheme[i][1] + "; }";
    });

    // eslint-disable-next-line no-undef
    GM_addStyle([
        ".fas-badge { color: #555; padding-top: 8px; padding-bottom: 8px; }",
        ".fas-badge-number { color: #fff; background-color: #999; padding-right: 9px; padding-left: 9px; border-radius: 9px }",
        ".fas-badge-number:hover { background-color: #555;}",
        ".fas-progress { width: 1%; height: 10px; background-color: #4caf50; }",
        ".fas-progress-bar { width: 100%; background-color: #ccc;}",
        ".fas-loaded-page { text-decoration: line-through !important; }",
        ".fas-sorter-div { color: gray; font-size: .9em; }",
        ".fas-sorter { color: gray; }",
        ".fas-sorter:after { content: attr(data-order); }",
        ".fas-filter-menus { color: gray; font-size: .9em; }",
        ".fas-filter-menu { font-size: 1em; padding: 1px 1px; height: 23px; margin: .1em auto; }",
        ".fas-filter-exclude-menu { border-color: #777; }",
        ".fas-filter-menu_locked { background-color: #ccc; }",
        ".fas-filter-menu:disabled { border-color: #999; background-color: #999; }",
        ".fas-filter-menu-item { color: #555; }",
        ".fas-filter-menu-item_locked { font-style: oblique; }",
        ...menuItemGroupCss,
        ".fas-filter-menu-item_story-zero { background-color: #999; }"
    ].join(''));

    // Css functions
    // Color convert Functions
    function strColorToHex (strColor) {
        const ctx = document.createElement('canvas').getContext('2d');
        ctx.fillStyle = strColor;
        return ctx.fillStyle;
    };

    function hexColorToRgb (hexColor) {
        const hexColor6Digit = hexColor.length - 1 === 3
            ? hexColor[1] + hexColor[1] + hexColor[2] + hexColor[2] + hexColor[3] + hexColor[3]
            : hexColor.slice(1);
        return [0, 2, 4]
            .map(x => hexColor6Digit.slice(x, x + 2))
            .map(x => parseInt(x, 16));
    };

    function standardizeToRgb (color) {
        if (/^#[0-9a-fA-F]{3,6}$/.test(color)) {
            return hexColorToRgb(color);
        } else {
            const hexColor = strColorToHex(color);
            if (!/^black$/i.test(color) && hexColor === '#000000') {
                throw new Error(`args of standardizeToRgb, ${color} is invalid.`);
            }
            return hexColorToRgb(hexColor);
        }
    };

    function rgbToHexColor (rgb) {
        return rgb
            .map(x => x.toString(16).padStart(2, '0'))
            .reduce((p, x) => p + x, '#');
    };

    // Make graduation of background color from startColor to endColor
    // with gradationsLength steps by using colorSpace('rgb', 'hsv' or 'hsl').
    // Determine readable foregroundColor from web safe color automatically.
    // eslint-disable-next-line no-unused-vars
    function makeGradualColorScheme (
        startColor, endColor, colorSpace = 'rgb', gradationsLength = 5, defaultForegroundColor = null
    ) {
        const rgbToHsv = (rgb) => {
            const [r, g, b] = rgb.map(x => x / 255);
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const diff = max - min;

            const h = (() => {
                if (max !== min) {
                    if (max === r) {
                        return (60 * ((g - b) / diff) + 360) % 360;
                    } else if (max === g) {
                        return (60 * ((b - r) / diff) + 120) % 360;
                    } else if (max === b) {
                        return (60 * ((r - g) / diff) + 240) % 360;
                    }
                }
                return 0;
            })();
            const s = max === 0 ? 0 : diff / max * 100;
            const v = max * 100;

            return [h, s, v];
        };

        const hsvToRgb = (hsv) => {
            const [h, s, v] = [hsv[0], hsv[1] / 100, hsv[2] / 100];
            const f = (n, k = (n + h / 60) % 6) => {
                return v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
            };
            return [f(5), f(3), f(1)].map(x => Math.round(x * 255));
        };

        function hsvToHsl (hsv) {
            const [h, sHsv, v] = [hsv[0], hsv[1] / 100, hsv[2] / 100];
            const l = v - v * sHsv / 2;
            const m = Math.min(l, 1 - l);
            const sHsl = m ? (v - l) / m : 0;
            return [h, sHsl * 100, l * 100];
        };

        function hslToHsv (hsl) {
            const [h, sHsl, l] = [hsl[0], hsl[1] / 100, hsl[2] / 100];
            const v = l + sHsl * Math.min(l, 1 - l);
            const sHsv = v === 0 ? 0 : 2 - 2 * l / v;
            return [h, sHsv * 100, v * 100];
        };

        function rgbToHsl (rgb) {
            return hsvToHsl(rgbToHsv(rgb));
        }

        function hslToRgb (hsl) {
            return hsvToRgb(hslToHsv(hsl));
        }

        // Check colorSpace
        if (!['rgb', 'hsv', 'hsl'].includes(colorSpace)) {
            throw new Error(`args of makeGradualColorScheme, ${colorSpace} is invalid.`);
        }

        // Convert hex color str into int rgb array.
        const startRgb = standardizeToRgb(startColor);
        const endRgb = standardizeToRgb(endColor);

        // Make rgb arrays of gradations made in rgb or hsv color space.
        const rgbGradations = (() => {
            if (colorSpace === 'rgb') {
                // Make rgb gradations
                const rgbGradation =
                    [0, 1, 2].map(x => (endRgb[x] - startRgb[x]) / (gradationsLength - 1));
                const rgbMiddleGradationsByRgb = [...Array(gradationsLength - 1).keys()]
                    .slice(1)
                    .map(gradationStep => {
                        return startRgb
                            .map((x, i) => x + rgbGradation[i] * gradationStep)
                            .map(x => Math.round(x));
                    });
                return [startRgb, ...rgbMiddleGradationsByRgb, endRgb];
            } else if (colorSpace === 'hsv' || colorSpace === 'hsl') {
                // Convert rgb into hsv
                const startHsv = rgbToHsv(startRgb);
                const endHsv = rgbToHsv(endRgb);

                // Make hsv gradations
                const hsvGradation = (() => {
                    const hd = endHsv[0] - startHsv[0];
                    const minHd = Math.abs(hd) < Math.abs(hd - 360) ? hd : hd - 360;
                    const sd = endHsv[1] - startHsv[1];
                    const vd = endHsv[2] - startHsv[2];
                    return [minHd, sd, vd].map(x => x / (gradationsLength - 1));
                })();
                const rgbMiddleGradationsByHsv = [...Array(gradationsLength - 1).keys()]
                    .slice(1)
                    .map(gradationStep => {
                        const h = (startHsv[0] + hsvGradation[0] * gradationStep + 360) % 360;
                        const s = startHsv[1] + hsvGradation[1] * gradationStep;
                        const v = startHsv[2] + hsvGradation[2] * gradationStep;
                        return [h, s, v].map(x => Math.round(x));
                    }).map(x => hsvToRgb(x));
                return [startRgb, ...rgbMiddleGradationsByHsv, endRgb];
            } else if (colorSpace === 'hsl') {
                // Convert rgb into hsl
                const startHsl = rgbToHsl(startRgb);
                const endHsl = rgbToHsl(endRgb);

                // Make hsl gradations
                const hslGradation = (() => {
                    const hd = endHsl[0] - startHsl[0];
                    const minHd = Math.abs(hd) < Math.abs(hd - 360) ? hd : hd - 360;
                    const sd = endHsl[1] - startHsl[1];
                    const ld = endHsl[2] - startHsl[2];
                    return [minHd, sd, ld].map(x => x / (gradationsLength - 1));
                })();
                const rgbMiddleGradationsByHsl = [...Array(gradationsLength - 1).keys()]
                    .slice(1)
                    .map(gradationStep => {
                        const h = (startHsl[0] + hslGradation[0] * gradationStep + 360) % 360;
                        const s = startHsl[1] + hslGradation[1] * gradationStep;
                        const l = startHsl[2] + hslGradation[2] * gradationStep;
                        return [h, s, l].map(x => Math.round(x));
                    }).map(x => hslToRgb(x));
                return [startRgb, ...rgbMiddleGradationsByHsl, endRgb];
            }
        })();

        const hexGradations = rgbGradations.map(rgb => rgbToHexColor(rgb));

        // Make readable pairs of backgroundColor and foregroundColor.
        const hexGradualColorSchemes = hexGradations.map(backgroundHex => {
            return [
                backgroundHex,
                getReadableColor(backgroundHex, defaultForegroundColor)
            ];
        });

        return hexGradualColorSchemes;
    };

    // Get readable color by comparing backgroundColor and possible foregroundColor
    // according to contrast ratio and hue difference of backgroundColor and foregroundColor.
    // Return defaultForegroundColor if it is contrastRatio > 4.5 (WCAG 2 AA Compliant).
    // Otherwise return WCAG 2 AA Compliant color with highest hueDiff.
    function getReadableColor (backgroundColor, defaultForegroundColor = null) {
        const backgroundRgb = standardizeToRgb(backgroundColor);

        // Get contrast ratio and hue difference of two colors
        const getColorContrast = (rgb1, rgb2) => {
            const table = [rgb1, rgb2];

            // https://www.w3.org/TR/WCAG20/#contrast-ratiodef
            const lWeight = [0.2126, 0.7152, 0.0722];
            const relativeLuminances = table
                .map(rgb => rgb.map(x => x / 255))
                .map(rgb => rgb.map(x => {
                    if (x <= 0.03928) {
                        return x / 12.92;
                    } else {
                        return ((x + 0.055) / 1.055) ** 2.4;
                    }
                })).map(rgb => rgb.map((x, i) => x * lWeight[i]).reduce((p, x) => p + x))
                .sort((a, b) => b - a);
            const contrastRatio = (relativeLuminances[0] + 0.05) / (relativeLuminances[1] + 0.05);

            // https://www.w3.org/TR/AERT/#color-contrast
            const hueDiff =
                [0, 1, 2].map(i => Math.abs(rgb1[i] - rgb2[i])).reduce((p, x) => p + x);
            const yFilter = [0.299, 0.587, 0.114];
            const brightnessDiff = Math.abs(
                table.map(rgb => rgb.map((x, i) => x * yFilter[i]).reduce((p, x) => p + x))
                    .reduce((p, x) => p - x)
            );

            const contrastRatioThresholdAA = 4.5;
            const contrastRatioThresholdAAA = 7;
            const hueThreshold = 500;
            const brightnessThreshold = 125;

            return {
                'contrastRatio': contrastRatio,
                'contrastComplianceAA': contrastRatio >= contrastRatioThresholdAA,
                'contrastComplianceAAA': contrastRatio >= contrastRatioThresholdAAA,
                'hueDiff': hueDiff,
                'hueDiffCompliance': hueDiff >= hueThreshold,
                'brightnessDiff': brightnessDiff,
                'brightnessDiffCompliance': brightnessDiff >= brightnessThreshold
            };
        };

        // Return defaultForegroundColor if it is readable
        if (defaultForegroundColor) {
            const defaultForegroundRgb = standardizeToRgb(defaultForegroundColor);
            const defaultColorContrast = getColorContrast(defaultForegroundRgb, backgroundRgb);
            if (defaultColorContrast.readable) {
                return defaultForegroundColor;
            }
        }

        // Generate web safe color
        const rgbValues = [...Array(6).keys()].map(x => x * 255 / 5);
        const foregroundRgbs = rgbValues
            .map(r => rgbValues.map(g => rgbValues.map(b => [r, g, b])))
            .reduce((p, x) => p.concat(x), [])
            .reduce((p, x) => p.concat(x), []);

        // Calculate each colorContrast of foregroundRgb and backgroundRgb
        const colorContrasts = foregroundRgbs
            .map(foregroundRgb => getColorContrast(foregroundRgb, backgroundRgb));

        // Find index of WCAG 2 AA Compliant color with highest hueDiff.
        colorContrasts.forEach((x, i) => {
            x.index = i;
        });

        let sortedColorContrasts = colorContrasts
            .filter(x => x.contrastComplianceAA)
            .sort((a, b) => b.hueDiff - a.hueDiff);
        if (sortedColorContrasts.length === 0) {
            sortedColorContrasts = colorContrasts.sort((a, b) => b.contrastRatio - a.contrastRatio);
        }

        // Return readable foreground hexColor
        return rgbToHexColor(foregroundRgbs[sortedColorContrasts[0].index]);
    };

    // Regex functions
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Escaping
    function escapeRegExp (string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }

    // Main
    // Check standard of filterDic
    const defaultFilterDataKeys = ['dataId', 'text', 'title', 'mode', 'options', 'reverse', 'condition'];
    const modesRequireOptions = ['gt', 'ge', 'le', 'dateRange'];
    const filterDicUpToStandard = Object.keys(filterDic)
        .map(filterKey => {
            const filterData = filterDic[filterKey];
            const everyKeyUpToStandard = Object.keys(filterData)
                .map(filterDataKey => {
                    const keyUpToStandard = defaultFilterDataKeys.includes(filterDataKey);
                    if (!keyUpToStandard) {
                        console.log(`${filterKey} filter: '${filterDataKey}' is an irregular key.`);
                    }
                    return keyUpToStandard;
                }).every(x => x);

            const modeRequirementUpToStandard =
                modesRequireOptions.includes(filterData.mode) ? 'options' in filterData : true;
            if (!modeRequirementUpToStandard) {
                console.log(`${filterKey} filter: '${filterData.mode}' mode filter requires to specify options.`);
            }
            return everyKeyUpToStandard && modeRequirementUpToStandard;
        }).every(x => x);
    if (!filterDicUpToStandard) {
        console.log("filterDic isn't up to standard.");
        return;
    }

    const setDatasetToZListTag = (x) => {
        // .filter_placeholder don't have children.
        // https://greasyfork.org/ja/scripts/13486-fanfiction-net-unwanted-result-filter
        if (x.firstElementChild) {
            const zPadtop2Tag = x.getElementsByClassName('z-padtop2')[0];
            const rawText = zPadtop2Tag.textContent;
            const dataText = rawText.replace(/ - Complete$/, '');
            const matches =
                dataText.match(/^(Crossover - )?(.+ - )?Rated: ([^ ]+) - ([^ ]+)( - [^ ]+)? - Chapters: (\d+) - Words: ([\d,]+)( - Reviews: [\d,]+)?( - Favs: [\d,]+)?( - Follows: [\d,]+)? ?(- Updated: [^-]+)?(- Published: [^-]+)?(- .*)?$/);

            // These dataset are defined in author page.
            if (!x.dataset.story_id) {
                // FicLab add .ficlab-save tag at the place of first child of .z-list tag.
                // https://www.ficlab.com/
                const titleTag = x.getElementsByClassName('stitle')[0];
                const url = new URL(titleTag.href);
                x.dataset.storyid = url.pathname.split('/')[2];
                x.dataset.title = titleTag.textContent;
                x.dataset.category = matches[2] ? matches[2].replace(/ - $/g, '') : '';
                x.dataset.chapters = matches[6].replace(/[^\d]/g, '');
                x.dataset.wordcount = matches[7].replace(/[^\d]/g, '');
                x.dataset.ratingtimes = matches[8] ? matches[8].replace(/[^\d]/g, '') : 0;
                const xutimes = zPadtop2Tag.getElementsByTagName('span');
                x.dataset.datesubmit = xutimes[xutimes.length - 1].dataset.xutime;
                x.dataset.dateupdate = xutimes.length === 2
                    ? xutimes[0].dataset.xutime : x.dataset.datesubmit;
                x.dataset.statusid = / - Complete$/.test(rawText) ? 2 : 1;
            }

            // Set following dataset for makeStoryData.
            x.dataset.crossover = matches[2] ? (matches[1] ? 1 : 0) : '';
            x.dataset.rating = matches[3];
            x.dataset.language = matches[4];
            x.dataset.favtimes = matches[9] ? matches[9].replace(/[^\d]/g, '') : 0;
            x.dataset.followtimes = matches[10] ? matches[10].replace(/[^\d]/g, '') : 0;

            const genreList = [
                'Adventure', 'Angst', 'Crime', 'Drama', 'Family', 'Fantasy',
                'Friendship', 'General', 'Horror', 'Humor', 'Hurt/Comfort',
                'Mystery', 'Parody', 'Poetry', 'Romance', 'Sci-Fi', 'Spiritual',
                'Supernatural', 'Suspense', 'Tragedy', 'Western'
            ];
            x.dataset.genre = matches[5]
                ? genreList.filter(genre => matches[5].includes(genre)) : '';

            x.dataset.character = '';
            x.dataset.relationship = '';
            if (matches[13]) {
                const bracketMatches = matches[13].match(/\[[^\]]+\]/g);
                if (bracketMatches) {
                    const relationship = [];
                    for (let bracketMatch of bracketMatches) {
                        // [foo, bar] => [bar, foo]
                        if (SORT_CHARACTERS_OF_RELATIONSHIP) {
                            const sortedCharacters = bracketMatch
                                .split(/\[|\]|, /)
                                .map(x => x.trim())
                                .filter(x => x)
                                .sort()
                                .join(', ');
                            relationship.push('[' + sortedCharacters + ']');
                        // [foo, bar] => [foo, bar]
                        } else {
                            relationship.push(bracketMatch);
                        }
                    }
                    if (relationship.length) {
                        x.dataset.relationship = relationship;
                    }
                }
                x.dataset.character =
                    matches[13].slice(2).split(/\[|\]|, /).map(x => x.trim()).filter(x => x);
            }
        }
    };

    const getFandomData = () => {
        const aTags = [...document.getElementById('content_wrapper_inner').children]
            .filter(element => element.tagName === 'A');

        if (aTags.length === 1) {
            const fandom = aTags[0].nextElementSibling.nextSibling.textContent.trim();
            return { category: fandom, crossover: 0 };
        } else {
            const crossoverFandom = aTags
                .filter(aTag => /\/crossovers\/[^/]+\/\d+\//.test(aTag.href))
                .map(aTag => aTag.textContent)
                .join(' & ');
            return { category: crossoverFandom, crossover: 1 };
        }
    };

    async function loadAllPages () {
        const badge = document.getElementById('l_' + this.tabId);
        const btn = badge.getElementsByClassName('fas-load-button')[0];
        btn.disabled = true;

        // get zListTags from urls
        const getZListTags = async (url) => {
            // eslint-disable-next-line no-undef
            const res = await fetch(url);
            const text = await res.text();
            // eslint-disable-next-line no-undef
            const parsedDoc = new DOMParser().parseFromString(text, "text/html");
            return parsedDoc.getElementsByClassName('z-list');
        };

        // Add progress bar
        const progressBar = document.createElement('div');
        progressBar.classList.add('fas-progress-bar');
        const progress = document.createElement('div');
        progress.classList.add('fas-progress');
        progress.style.width = 1 / (this.urls.length + 1) * 100 + '%';

        progressBar.appendChild(progress);
        badge.parentElement.insertBefore(progressBar, badge.nextElementSibling);

        // Set Dataset to zListTag
        const loadedZListTags = [];
        const fandomData = getFandomData();
        for (let i = 0; i < this.urls.length; i++) {
            if (i !== 0) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            const zListTags = await getZListTags(this.urls[i]);
            [...zListTags].forEach(x => {
                setDatasetToZListTag(x);
                if (!x.dataset.category && !x.dataset.crossover) {
                    x.dataset.category = fandomData.category;
                    x.dataset.crossover = fandomData.crossover;
                }
                loadedZListTags.push(x);
            });
            progress.style.width = (i + 2) / (this.urls.length + 1) * 100 + '%';
        }

        // Set storyid to .filter_placeholder tags.
        // https://greasyfork.org/ja/scripts/13486-fanfiction-net-unwanted-result-filter
        for (let i = 0; i < loadedZListTags.length - 1; i++) {
            if (!loadedZListTags[i].dataset.storyid && loadedZListTags[i + 1].dataset.storyid) {
                loadedZListTags[i].dataset.storyid = loadedZListTags[i + 1].dataset.storyid;
                i++;
            }
        }

        // Add loaded zListTags to #id + '_inside'
        const inside = document.getElementById(this.tabId + '_inside');
        loadedZListTags.forEach(x => {
            inside.appendChild(x);
        });

        // Render page links in the strikethrough style.
        const aTags = document.querySelectorAll('#l_cs > a, #content_wrapper_inner > center > a');
        [...aTags].forEach(aTag => {
            aTag.classList.add('fas-loaded-page');
        });

        // Reset filter
        const clearTag =
            document.getElementsByClassName('fas-filter-menus')[0].lastElementChild;
        clearTag.click();
    };

    // Restructure elements for community, search and browse pages
    // and add "Load all pages" button
    if (/www\.fanfiction\.net\/community\//.test(window.location.href)) {
        // Restructure elements of community page.
        const zListTags = document.getElementsByClassName('z-list');
        if (zListTags.length <= 1) {
            return;
        }

        const newTabInside = document.createElement('div');
        newTabInside.id = 'cs_inside';
        [...zListTags].forEach(x => {
            newTabInside.appendChild(x);
        });

        const newTab = document.createElement('div');
        newTab.id = 'cs';
        newTab.appendChild(document.createElement('br'));
        newTab.appendChild(newTabInside);

        const scriptTag = document.querySelector('#content_wrapper_inner script');
        scriptTag.parentElement.insertBefore(newTab, scriptTag);

        // Make cs badge which contain number of community stories,
        // page information and "Load all pages" button
        const badge = document.createElement('div');
        badge.id = 'l_' + newTab.id;
        badge.align = 'center';
        badge.classList.add('fas-badge');

        const badgeSpan = document.createElement('span');
        badgeSpan.classList.add('fas-badge-number');
        badgeSpan.textContent = [...zListTags]
            .filter(zListTag => !zListTag.classList.contains('filter_placeholder'))
            .length;
        badge.appendChild(document.createTextNode('Community Stories: '));
        badge.appendChild(badgeSpan);

        const pager = document.querySelector('#content_wrapper_inner center');
        if (pager) {
            badge.appendChild(document.createTextNode(' / '));
            pager.childNodes.forEach(x => {
                badge.appendChild(x.cloneNode(true));
            });
        }

        // When community page has plural pages, add "Load all pages" button
        const aTags = pager ? pager.getElementsByTagName('a') : [];
        if (aTags.length) {
            const loadBtn = document.createElement('button');
            loadBtn.appendChild(document.createTextNode("Load all pages"));
            loadBtn.disabled = false;
            loadBtn.classList.add('fas-load-button');

            const currentUrlSplits = window.location.href.split('/');
            const startCurrentUrl = currentUrlSplits.slice(0, 8).join('/');
            const current = parseInt(currentUrlSplits[8]);
            const endCurrentUrl = currentUrlSplits.slice(9).join('/');
            const last = [...aTags]
                .map(x => parseInt(x.href.split('/')[8]))
                .reduce((p, x) => p > x ? p : x, current);
            const urls = [...Array(last).keys()]
                .map(x => x + 1)
                .filter(x => x !== current)
                .map(x => [startCurrentUrl, x, endCurrentUrl].join('/'));

            // Add click event
            loadBtn.addEventListener('click', {
                urls: urls, tabId: 'cs', handleEvent: loadAllPages
            });
            badge.appendChild(document.createTextNode(' '));
            badge.appendChild(loadBtn);
        }

        scriptTag.parentElement.insertBefore(badge, newTab);
    } else if (
        /www\.fanfiction\.net\/search\//.test(window.location.href) &&
        /&type=story/.test(window.location.search)
    ) {
        // Restructure elements of search page.
        const divTags = document.querySelectorAll('#content_wrapper_inner > div');
        const zListTags = document.getElementsByClassName('z-list');
        if (divTags.length < 2 || zListTags.length <= 1) {
            return;
        }

        const newTabInside = document.createElement('div');
        newTabInside.id = 'ss_inside';
        newTabInside.appendChild(divTags[0]);
        newTabInside.appendChild(divTags[1]);

        const newTab = document.createElement('div');
        newTab.id = 'ss';
        newTab.appendChild(document.createElement('br'));
        newTab.appendChild(newTabInside);
        divTags[2].parentElement.insertBefore(newTab, divTags[2]);

        // Reshape center tag to ss badge which contain number of searched stories,
        // page information and "Load all pages" button
        const badge = document.getElementsByTagName('center')[0];
        badge.id = 'l_' + newTab.id;
        badge.classList.add('fas-badge');

        const badgeSpan = document.createElement('span');
        badgeSpan.classList.add('fas-badge-number');
        badgeSpan.textContent = [...zListTags]
            .filter(zListTag => !zListTag.classList.contains('filter_placeholder'))
            .length;

        const fragment = document.createDocumentFragment();
        fragment.appendChild(document.createTextNode('Searched Stories: '));
        fragment.appendChild(badgeSpan);
        fragment.appendChild(document.createTextNode(' / '));
        badge.insertBefore(fragment, badge.firstChild);

        // When search page has plural pages, add "Load all pages" button
        const aTags = badge.getElementsByTagName('a');
        if (aTags.length) {
            const loadBtn = document.createElement('button');
            loadBtn.appendChild(document.createTextNode("Load all pages"));
            loadBtn.disabled = false;
            loadBtn.classList.add('fas-load-button');

            const currentPageMatch = window.location.search.match(/&ppage=(\d+)/);
            const current = currentPageMatch ? parseInt(currentPageMatch[1]) : 1;
            const last = [...aTags]
                .map(aTag => aTag.href.match(/&ppage=(\d+)/))
                .map(matches => parseInt(matches[1]))
                .reduce((p, x) => p > x ? p : x, current);

            const urls = [...Array(last).keys()]
                .map(x => x + 1)
                .filter(x => x !== current)
                .map(x => aTags[0].href.replace(/&ppage=\d+/, "&ppage=" + x));

            // Add click event
            loadBtn.addEventListener('click', {
                urls: urls, tabId: 'ss', handleEvent: loadAllPages
            });
            const fragment = document.createDocumentFragment();
            fragment.appendChild(document.createTextNode(' '));
            fragment.appendChild(loadBtn);
            badge.appendChild(fragment);
        }
    } else if (document.getElementById('filters')) {
        // Restructure elements of browse page.
        const zListTags = document.getElementsByClassName('z-list');
        if (zListTags.length <= 1) {
            return;
        }

        const newTabInside = document.createElement('div');
        newTabInside.id = 'bs_inside';
        [...zListTags].forEach(x => {
            newTabInside.appendChild(x);
        });

        const newTab = document.createElement('div');
        newTab.id = 'bs';
        newTab.appendChild(document.createElement('br'));
        newTab.appendChild(newTabInside);

        const centerTags = [...document.getElementsByTagName('center')]
            .filter(centerTag => centerTag.getElementsByTagName('a').length);
        if (centerTags.length) {
            centerTags[0].parentElement.insertBefore(newTab, centerTags[1]);
        } else {
            const scriptTag = document.querySelector('#content_wrapper_inner script');
            scriptTag.parentElement.insertBefore(newTab, scriptTag);
        }

        // Reshape center tag to bs badge which contain number of browse stories,
        // page information and "Load all pages" button
        const badge = centerTags.length ? centerTags[0] : document.createElement('center');
        badge.id = 'l_' + newTab.id;
        badge.classList.add('fas-badge');

        const badgeSpan = document.createElement('span');
        badgeSpan.classList.add('fas-badge-number');
        badgeSpan.textContent = [...zListTags]
            .filter(zListTag => !zListTag.classList.contains('filter_placeholder'))
            .length;

        const fragment = document.createDocumentFragment();
        fragment.appendChild(document.createTextNode('Browse Stories: '));
        fragment.appendChild(badgeSpan);
        if (!centerTags.length) {
            badge.insertBefore(fragment, badge.firstChild);
            newTab.parentElement.insertBefore(badge, newTab);
        } else {
            fragment.appendChild(document.createTextNode(' / '));
            badge.insertBefore(fragment, badge.firstChild);
        }

        // When search page has plural pages, add "Load all pages" button
        const aTags = badge.getElementsByTagName('a');
        if (aTags.length) {
            const loadBtn = document.createElement('button');
            loadBtn.appendChild(document.createTextNode("Load all pages"));
            loadBtn.disabled = false;
            loadBtn.classList.add('fas-load-button');

            const currentPageMatch = window.location.search.match(/&p=(\d+)/);
            const current = currentPageMatch ? parseInt(currentPageMatch[1]) : 1;
            const last = [...aTags]
                .map(aTag => aTag.href.match(/&p=(\d+)/))
                .map(matches => parseInt(matches[1]))
                .reduce((p, x) => p > x ? p : x, current);

            const urls = [...Array(last).keys()]
                .map(x => x + 1)
                .filter(x => x !== current)
                .map(x => aTags[0].href.replace(/&p=\d+/, "&p=" + x));

            // Add click event
            loadBtn.addEventListener('click', {
                urls: urls, tabId: 'bs', handleEvent: loadAllPages
            });
            const fragment = document.createDocumentFragment();
            fragment.appendChild(document.createTextNode(' '));
            fragment.appendChild(loadBtn);
            badge.appendChild(fragment);
        }
    } else if (/www\.fanfiction\.net\/u\//.test(window.location.href)) {
        // Hide author biography automatically
        if (HIDE_BIO_AUTOMATICALLY) {
            const bioTag = document.getElementById('bio_text');
            if (bioTag && bioTag.textContent === "hide bio") {
                bioTag.click();
            }
        }
    }

    // Add filters and sorters
    for (let tabId of ['st', 'fs', 'cs', 'ss', 'bs']) {
        // Initiation
        const tab = document.getElementById(tabId);
        const tabInside = document.getElementById(tabId + '_inside');

        // Is there a need to add sorters and filters?
        const moreThanOneStories = tabInside && tabInside.getElementsByClassName('z-list').length >= 2;
        if (!moreThanOneStories) {
            continue;
        }

        // Data-set initiation
        const zListTags = tabInside.getElementsByClassName('z-list');
        [...zListTags].forEach(x => {
            setDatasetToZListTag(x);
        });
        const datasetIncludeCategory = [...zListTags].some(x => x.dataset.category);
        if (!datasetIncludeCategory) {
            const fandomData = getFandomData();
            [...zListTags].forEach(x => {
                x.dataset.category = fandomData.category;
                x.dataset.crossover = fandomData.crossover;
            });
        }

        // Set storyid to .filter_placeholder tags.
        // https://greasyfork.org/ja/scripts/13486-fanfiction-net-unwanted-result-filter
        for (let i = 0; i < zListTags.length - 1; i++) {
            if (!zListTags[i].dataset.storyid && zListTags[i + 1].dataset.storyid) {
                zListTags[i].dataset.storyid = zListTags[i + 1].dataset.storyid;
                i++;
            }
        }

        // Sorter functions
        const makeSorterFunctionBy = (dataId, order = 'asc') => {
            const sorterFunctionBy = (a, b) => {
                const aData = makeStoryData(a);
                const bData = makeStoryData(b);
                if (aData[dataId] < bData[dataId]) {
                    return order === 'asc' ? -1 : 1;
                } else if (aData[dataId] > bData[dataId]) {
                    return order === 'asc' ? 1 : -1;
                } else {
                    if (dataId !== 'title') {
                        const sortByTitle = makeSorterFunctionBy('title');
                        return sortByTitle(a, b);
                    } else {
                        return 0;
                    }
                }
            };
            return sorterFunctionBy;
        };

        const makeSorterTag = (sorterDic) => {
            const sorterId = sorterDic.dataId;
            const sorterText = sorterDic.text;
            const firstOrder = sorterDic.order;
            const sorterSpan = document.createElement('span');
            sorterSpan.textContent = sorterText;
            sorterSpan.classList.add('fas-sorter');
            sorterSpan.dataset.order = '';
            sorterSpan.addEventListener('click', (e) => {
                const sortedWithFirstOrder = e.target.dataset.order === orderSymbol[firstOrder];
                const sorterTags = document.getElementsByClassName('fas-sorter');
                [...sorterTags].forEach(sorterTag => {
                    sorterTag.dataset.order = '';
                });
                const [secondOrder] = ['asc', 'dsc'].filter(x => x !== firstOrder);
                const nextOrder = sortedWithFirstOrder ? secondOrder : firstOrder;
                e.target.dataset.order = orderSymbol[nextOrder];
                const sortBySorterId = makeSorterFunctionBy(sorterId, nextOrder);
                // .filter_placeholder is added by
                // https://greasyfork.org/ja/scripts/13486-fanfiction-net-unwanted-result-filter
                const zListTags = tabInside.querySelectorAll('div.z-list:not(.filter_placeholder)');
                const placeHolderTags = tabInside.getElementsByClassName('filter_placeholder');
                const fragment = document.createDocumentFragment();
                [...zListTags]
                    .sort(sortBySorterId)
                    .forEach(x => {
                        if (placeHolderTags.length) {
                            [...placeHolderTags]
                                .filter(p => x.dataset.storyid === p.dataset.storyid)
                                .forEach(p => fragment.appendChild(p));
                        }
                        fragment.appendChild(x);
                    });
                tabInside.appendChild(fragment);
            });
            return sorterSpan;
        };

        // Make sorters
        // Remove original sorter span in author page.
        if (['st', 'fs'].includes(tabId)) {
            while (tab.firstElementChild.firstChild) {
                tab.firstElementChild.removeChild(tab.firstElementChild.firstChild);
            }
        }

        // Append sorters
        const fragment = document.createDocumentFragment();
        fragment.appendChild(document.createTextNode('Sort: '));
        sorterDicList.forEach(sorterDic => {
            const sorterSpan = makeSorterTag(sorterDic);
            fragment.appendChild(sorterSpan);
            fragment.appendChild(document.createTextNode(' . '));
        });
        if (['st', 'fs'].includes(tabId)) {
            tab.firstElementChild.appendChild(fragment);
        } else if (['cs', 'ss', 'bs'].includes(tabId)) {
            const sorterTag = document.createElement('div');
            sorterTag.classList.add('fas-sorter-div');
            sorterTag.appendChild(fragment);
            tab.insertBefore(sorterTag, tab.firstElementChild);
        }

        // Filter functions

        // List of exceptional fandoms contain ' & '
        // eslint-disable-next-line no-undef
        const resourceText = GM_getResourceText('JSON');
        const exceptionalFandomList = resourceText ? JSON.parse(resourceText).fandoms : [];

        // Make story data from .zList tag.
        const makeStoryData = (zList) => {
            const storyData = {};
            storyData.story_id = parseInt(zList.dataset.storyid);

            // .zList.filter_placeholder tag have only dataset.storyid.
            // https://greasyfork.org/ja/scripts/13486-fanfiction-net-unwanted-result-filter
            if (zList.dataset.title) {
                storyData.title = zList.dataset.title;
                storyData.crossover = parseInt(zList.dataset.crossover) ? 'X' : '=';
                const rawFandom = zList.dataset.category;
                if (storyData.crossover === 'X') {
                    const splitFandoms = rawFandom.split(' & ');
                    if (splitFandoms.length === 2) {
                        storyData.fandom = splitFandoms.sort();
                    } else {
                        storyData.fandom = [];

                        for (let fandom of exceptionalFandomList) {
                            const escapedFandom = escapeRegExp(fandom);
                            const fandomRegex =
                                new RegExp('^' + escapedFandom + " & (.+)$|^(.+) & " + escapedFandom + '$', '');
                            const matches = rawFandom.match(fandomRegex);
                            if (matches) {
                                const fandom2 = matches[1] || matches[2];
                                storyData.fandom = [fandom, fandom2].sort();
                                break;
                            }
                        }
                        if (!storyData.fandom.length) {
                            storyData.fandom = [rawFandom];
                        }
                    }
                } else {
                    storyData.fandom = [rawFandom];
                }
                storyData.rating = zList.dataset.rating;
                storyData.language = zList.dataset.language;
                storyData.genre = zList.dataset.genre
                    ? zList.dataset.genre.split(',') : [];
                storyData.chapters = parseInt(zList.dataset.chapters);
                storyData.word_count = parseInt(zList.dataset.wordcount);
                storyData.reviews = parseInt(zList.dataset.ratingtimes);
                storyData.favs = parseInt(zList.dataset.favtimes);
                storyData.follows = parseInt(zList.dataset.followtimes);
                storyData.published = parseInt(zList.dataset.datesubmit);
                storyData.updated = parseInt(zList.dataset.dateupdate);
                storyData.character = zList.dataset.character
                    ? zList.dataset.character.split(',') : [];
                storyData.relationship = zList.dataset.relationship
                    ? zList.dataset.relationship.match(/\[[^\]]+\]/g) : [];
                storyData.status =
                    parseInt(zList.dataset.statusid) === 1 ? 'In-Progress' : 'Complete';
            }
            return storyData;
        };

        const timeStrToInt = (timeStr) => {
            const hour = 3600;
            const day = hour * 24;
            const week = hour * 24 * 7;
            const month = week * 4;
            const year = month * 12;

            const matches = timeStr
                .replace(/hour(s)?/, hour.toString())
                .replace(/day(s)?/, day.toString())
                .replace(/week(s)?/, week.toString())
                .replace(/month(s)?/, month.toString())
                .replace(/year(s)?/, year.toString())
                .match(/\d+/g);

            return matches ? parseInt(matches[0]) * parseInt(matches[1]) : null;
        };

        // Judge if a story with storyValue passes through filter with selectValue.
        const throughFilter = (storyValue, selectValue, filterKey) => {
            if (selectValue === 'default') {
                return true;
            } else {
                const filterMode = filterDic[filterKey].mode;
                const resultByFilterMode = (() => {
                    if (filterMode === 'equal') {
                        return storyValue === selectValue;
                    } else if (filterMode === 'contain') {
                        return storyValue.includes(selectValue);
                    } else if (filterMode === 'dateRange') {
                        const now = Math.floor(Date.now() / 1000);
                        const intRange = timeStrToInt(selectValue);
                        return intRange === null || now - storyValue <= intRange;
                    } else if (['gt', 'ge', 'le'].includes) {
                        const execResult = /\d+/.exec(selectValue.replace(/K/, '000'));
                        const intSelectValue = execResult ? parseInt(execResult[0]) : null;
                        if (filterMode === 'gt') {
                            return storyValue > intSelectValue;
                        } else if (filterMode === 'ge') {
                            return storyValue >= intSelectValue;
                        } else if (filterMode === 'le') {
                            return intSelectValue === null || storyValue <= intSelectValue;
                        }
                    }
                })();
                return filterDic[filterKey].reverse ? !resultByFilterMode : resultByFilterMode;
            }
        };

        const makeStoryDic = () => {
            const selectFilterDic = {};
            Object.keys(filterDic).forEach(filterKey => {
                const selectId = tabId + '_' + filterKey + '_select';
                const selectTag = document.getElementById(selectId);
                selectFilterDic[filterKey] = selectTag ? selectTag.value : null;
            });

            const storyDic = {};
            const zListTags = tabInside.getElementsByClassName('z-list');
            [...zListTags].forEach(x => {
                const storyData = makeStoryData(x);
                const id = storyData.story_id;
                storyDic[id] = storyDic[id] || {};

                // .filter_placeholder is added by
                // https://greasyfork.org/ja/scripts/13486-fanfiction-net-unwanted-result-filter
                if (x.classList.contains('filter_placeholder')) {
                    storyDic[id].placeHolder = x;
                } else {
                    storyDic[id].dom = x;
                    Object.keys(filterDic).forEach(filterKey => {
                        const dataId = filterDic[filterKey].dataId;
                        storyDic[id][filterKey] = storyData[dataId];
                    });

                    storyDic[id].filterStatus = {};
                    Object.keys(selectFilterDic).forEach(filterKey => {
                        if (selectFilterDic[filterKey] === null) {
                            storyDic[id].filterStatus[filterKey] = true; // Initialization
                        } else {
                            const filterFlag =
                                throughFilter(storyDic[id][filterKey], selectFilterDic[filterKey], filterKey);
                            storyDic[id].filterStatus[filterKey] = filterFlag;
                        }
                    });
                }
            });
            return storyDic;
        };

        const changeStoryDisplay = (story) => {
            // If a story passes through every filter
            story.displayFlag = Object.keys(story.filterStatus).every(x => story.filterStatus[x]);

            // .filter_placeholder is added by
            // https://greasyfork.org/ja/scripts/13486-fanfiction-net-unwanted-result-filter
            if (story.placeHolder) {
                story.placeHolder.style.display = story.displayFlag ? '' : 'none';
            } else {
                story.dom.style.display = story.displayFlag ? '' : 'none';
            }
        };

        const makeAlternatelyFilteredStoryIds = (storyDic, alternateOptionValue, filterKey) => {
            return Object.keys(storyDic)
                .filter(x => {
                    const filterStatus = { ...storyDic[x].filterStatus };
                    filterStatus[filterKey] =
                        throughFilter(storyDic[x][filterKey], alternateOptionValue, filterKey);
                    return Object.keys(filterStatus).every(x => filterStatus[x]);
                }).sort();
        };

        // Collect all filter doms at once by making selectDic
        const makeSelectDic = () => {
            const selectDic = {};
            Object.keys(filterDic).forEach(filterKey => {
                const selectTag = document.getElementById(tabId + '_' + filterKey + '_select');
                selectDic[filterKey] = {};
                selectDic[filterKey].dom = selectTag;
                selectDic[filterKey].value = selectDic[filterKey].dom.value;
                selectDic[filterKey].displayed = selectDic[filterKey].dom.style.display === '';
                selectDic[filterKey].disabled = selectDic[filterKey].dom.hasAttribute('disabled');
                selectDic[filterKey].accessible =
                    selectDic[filterKey].displayed && !selectDic[filterKey].disabled;
                selectDic[filterKey].optionDic = {};
                if (selectDic[filterKey].accessible) {
                    const optionTags = selectTag.getElementsByTagName('option');
                    [...optionTags].forEach(optionTag => {
                        selectDic[filterKey].optionDic[optionTag.value] = { dom: optionTag };
                    });
                }
            });

            return selectDic;
        };

        // generateCombinations([1, 2, 3], 2) => [[1, 2], [1, 3], [2, 3]]
        const generateCombinations = (xs, count, previous = []) => {
            if (count === 0) {
                return [previous];
            } else {
                return xs.reduce((acc, c, i) => {
                    const nxs = xs.filter((_, j) => j > i);
                    return [...acc, ...generateCombinations(nxs, count - 1, [...previous, c])];
                }, []);
            }
        };

        // Apply selectKey filter with selectValue to all stories.
        const filterStories = (selectKey, selectValue) => {
            const storyDic = makeStoryDic();
            // Change display of each story.
            Object.keys(storyDic).forEach(x => {
                storyDic[x].filterStatus[selectKey] =
                    throughFilter(storyDic[x][selectKey], selectValue, selectKey);
                changeStoryDisplay(storyDic[x]);
            });

            // Hide useless options.
            const selectDic = makeSelectDic();
            Object.keys(selectDic)
                .filter(filterKey => selectDic[filterKey].accessible)
                .forEach(filterKey => {
                    const optionDic = selectDic[filterKey].optionDic;

                    // By changing to one of usableOptionValues, display of stories would change.
                    // Excluded options can't change display of stories.
                    const usableOptionValues = (() => {
                        // Make usableStoryValues from alternately filtered stories
                        // by neutralizing each filter.
                        const usableStoryValues = Object.keys(storyDic)
                            .filter(x => {
                                const filterStatus = { ...storyDic[x].filterStatus };
                                filterStatus[filterKey] = true;
                                return Object.keys(filterStatus).every(x => filterStatus[x]);
                            }).map(x => storyDic[x][filterKey])
                            .reduce((p, x) => p.concat(x), [])
                            .filter((x, i, self) => self.indexOf(x) === i)
                            .sort((a, b) => a - b);

                        // Remove redundant options when filter mode is 'gt', 'ge', 'le', or 'dateRange'
                        const filterMode = filterDic[filterKey].mode;
                        if (['gt', 'ge', 'le', 'dateRange'].includes(filterMode)) {
                            const reverse = (filterDic[filterKey].reverse);
                            const sufficientOptionValues = usableStoryValues.map(storyValue => {
                                const optionValues = Object.keys(optionDic).filter(x => x !== 'default');
                                const throughOptionValues = optionValues
                                    .filter(optionValue => {
                                        const result = throughFilter(storyValue, optionValue, filterKey);
                                        return reverse ? !result : result;
                                    });
                                if (filterMode === 'gt' || filterMode === 'ge') {
                                    return throughOptionValues[throughOptionValues.length - 1];
                                } else if (filterMode === 'le' || filterMode === 'dateRange') {
                                    return throughOptionValues[0];
                                }
                            }).filter((x, i, self) => self.indexOf(x) === i);
                            return sufficientOptionValues;
                        } else {
                            return usableStoryValues;
                        }
                    })();

                    // Add/remove hidden attribute to options.
                    Object.keys(optionDic).forEach(optionValue => {
                        // usableOptionValues don't include 'default'.
                        const usable =
                            optionValue === 'default' ? true : usableOptionValues.includes(optionValue);
                        optionDic[optionValue].usable = usable;
                        if (!usable) {
                            optionDic[optionValue].dom.setAttribute('hidden', '');
                        } else {
                            optionDic[optionValue].dom.removeAttribute('hidden');
                        }
                    });
                });

            // Hide same value when filterKey uses same dataId.
            Object.keys(filterDic)
                .filter(filterKey => selectDic[filterKey].accessible)
                .filter(filterKey => !filterDic[filterKey].options)
                .forEach(filterKey => {
                    const filterKeysBySameDataId = Object.keys(filterDic)
                        .filter(x => selectDic[x].accessible)
                        .filter(x => x !== filterKey)
                        .filter(x => filterDic[x].dataId === filterDic[filterKey].dataId);

                    if (filterKeysBySameDataId.length) {
                        filterKeysBySameDataId
                            .filter(x => !filterDic[x].reverse)
                            .filter(x => selectDic[x].value !== 'default')
                            .forEach(x => {
                                const sameValue = selectDic[x].value;
                                selectDic[filterKey].optionDic[sameValue].dom.setAttribute('hidden', '');
                                selectDic[filterKey].optionDic[sameValue].usable = false;
                            });
                    }
                });

            const filteredStoryIds = Object.keys(storyDic)
                .filter(x => storyDic[x].displayFlag)
                .sort();

            // Add/remove
            // .fas-filter-menu_locked, .fas-filter-menu-item_locked and menuItemGroupClasses.
            Object.keys(selectDic)
                .filter(filterKey => selectDic[filterKey].accessible)
                .forEach(filterKey => {
                    const optionDic = selectDic[filterKey].optionDic;

                    // Remove
                    // .fas-filter-menu_locked and .fas-filter-menu-item_locked and menuItemGroupClasses.
                    selectDic[filterKey].dom.classList.remove('fas-filter-menu_locked');
                    Object.keys(optionDic).forEach(x => {
                        optionDic[x].dom.classList.remove(
                            'fas-filter-menu-item_locked',
                            ...menuItemGroupClasses,
                            'fas-filter-menu-item_story-zero'
                        );
                    });

                    // Add .fas-filter-menu-item_locked to each option tag
                    // when alternatelyFilteredStoryIds are equal to filteredStoryIds.
                    const optionsLocked = Object.keys(optionDic)
                        .filter(optionValue => optionDic[optionValue].usable)
                        .map(optionValue => {
                            const alternatelyFilteredStoryIds =
                                makeAlternatelyFilteredStoryIds(storyDic, optionValue, filterKey);
                            optionDic[optionValue].storyNumber = alternatelyFilteredStoryIds.length;
                            if (filterDic[filterKey].reverse && alternatelyFilteredStoryIds.length === 0) {
                                optionDic[optionValue].dom.classList.add('fas-filter-menu-item_story-zero');
                            }

                            const idsEqualFlag =
                                JSON.stringify(filteredStoryIds) === JSON.stringify(alternatelyFilteredStoryIds);
                            if (idsEqualFlag) {
                                optionDic[optionValue].dom.classList.add('fas-filter-menu-item_locked');
                            }
                            return idsEqualFlag;
                        }).every(x => x);

                    if (optionsLocked) {
                        // Add .fas-filter-menu_locked to select tag
                        // when every alternatelyFilteredStoryIds are equal to filteredStoryIds.
                        selectDic[filterKey].dom.classList.add('fas-filter-menu_locked');
                    } else if (menuItemGroupClasses.length) {
                        // Highlight options by filter result by adding menuItemGroupClasses

                        // Remove menuItemGroupClasses
                        Object.keys(optionDic).forEach(optionValue => {
                            optionDic[optionValue].dom.classList.remove(...menuItemGroupClasses);
                        });

                        // Unique storyNumber in dsc order
                        const filterResults = Object.keys(optionDic)
                            .filter(optionValue => optionDic[optionValue].usable)
                            .map(optionValue => optionDic[optionValue].storyNumber)
                            .filter((x, i, self) => self.indexOf(x) === i)
                            .sort((a, b) => b - a);

                        // Generate combinations of filterResults
                        // which is divided into menuItemGroupClasses.length groups.
                        const dividedResultsCombinations = (() => {
                            if (filterResults.length <= menuItemGroupClasses.length) {
                                // There is no need to divide filterResults.
                                return [filterResults.map(x => [x])];
                            } else {
                                // Generate combinations of divideIndexes.
                                // Divide filterResults by using divideIndexesCombination.
                                const middleIndexes = [...Array(filterResults.length).keys()].slice(1);
                                return generateCombinations(middleIndexes, menuItemGroupClasses.length - 1)
                                    .map(middleIndexesCombination => {
                                        const divideIndexes = [0, ...middleIndexesCombination, filterResults.length];
                                        const dividedResultsCombination = [];
                                        divideIndexes.reduce((p, x) => {
                                            dividedResultsCombination.push(filterResults.slice(p, x));
                                            return x;
                                        });
                                        return dividedResultsCombination;
                                    });
                            }
                        })();

                        // Jenks Natural Breaks.
                        // For each dividedResultsCombination,
                        // calculate sum of squared deviations for class means(SDCM).
                        // dividedResultsCombination with minimum SDCM score is the best match.
                        const minIndex = (() => {
                            if (dividedResultsCombinations.length === 1) {
                                return 0;
                            } else {
                                return dividedResultsCombinations.map(dividedResultsCombination => {
                                    return dividedResultsCombination.map(dividedResults => {
                                        const classMean =
                                            dividedResults.reduce((p, x) => p + x) / dividedResults.length;
                                        return dividedResults.map(x => (x - classMean) ** 2).reduce((p, x) => p + x);
                                    }).reduce((p, x) => p + x);
                                }).reduce((iMin, x, i, self) => x < self[iMin] ? i : iMin, 0);
                            }
                        })();

                        // Add menuItemGroupClasses according to dividedResultsCombinations[minIndex]
                        Object.keys(optionDic)
                            .filter(optionValue => optionDic[optionValue].usable)
                            .forEach(optionValue => {
                                const dividedResultsIndex = dividedResultsCombinations[minIndex]
                                    .findIndex(dividedResults =>
                                        dividedResults.includes(optionDic[optionValue].storyNumber)
                                    );
                                optionDic[optionValue].dom.classList.add(menuItemGroupClasses[dividedResultsIndex]);
                            });
                    }
                });

            // Change badge's story number.
            const badge = document.getElementById('l_' + tabId).firstElementChild;
            const displayedStoryNumber =
                [...Object.keys(storyDic).filter(x => storyDic[x].displayFlag)].length;
            badge.textContent = displayedStoryNumber;
        };

        // Append filter Div
        const appendFilterDiv = () => {
            // Make filterDiv
            const filterDiv = document.createElement('div');
            filterDiv.classList.add('fas-filter-menus');
            filterDiv.appendChild(document.createTextNode('Filter: '));

            // Make initialStoryDic from initial state of stories.
            const initialStoryDic = makeStoryDic();
            const initialStoryIds = Object.keys(initialStoryDic).sort();

            // Log initial attributes and classList for clear feature.
            const initialSelectDic = {};

            const makeSelectTag = (filterKey, defaultText) => {
                const selectTag = document.createElement('select');
                selectTag.id = tabId + '_' + filterKey + '_select';
                selectTag.title = filterDic[filterKey].title;
                selectTag.classList.add('fas-filter-menu');
                if (filterDic[filterKey].reverse) {
                    selectTag.classList.add('fas-filter-exclude-menu');
                }

                // Make optionValues from filterKey values of
                // each story, wordCountOptions, kudoCountOptions or dateRangeOptions.
                const optionValues = (() => {
                    const storyValues = Object.keys(initialStoryDic)
                        .map(x => initialStoryDic[x][filterKey])
                        .reduce((p, x) => p.concat(x), [])
                        .filter((x, i, self) => self.indexOf(x) === i)
                        .sort();

                    const filterMode = filterDic[filterKey].mode;
                    if (filterKey === 'rating') {
                        const orderedOptions = ['K', 'K+', 'T', 'M'];
                        return orderedOptions.filter(x => storyValues.includes(x));
                    } else if (['gt', 'ge', 'le', 'dateRange'].includes(filterMode)) {
                        const allOptionValues = (() => {
                            if (filterMode === 'gt') {
                                return ['0'].concat(filterDic[filterKey].options)
                                    .map(x => x + ' <');
                            } else if (filterMode === 'ge') {
                                return ['0'].concat(filterDic[filterKey].options)
                                    .map(x => x + ' ≤');
                            } else if (filterMode === 'le') {
                                return filterDic[filterKey].options.concat(['∞'])
                                    .map(x => '≤ ' + x);
                            } else if (filterMode === 'dateRange') {
                                return filterDic[filterKey].options.concat(['∞'])
                                    .map(x => 'With in ' + x);
                            }
                        })();

                        // Remove redundant options
                        // when filter mode is 'gt', 'ge', 'le', or 'dateRange'
                        const reverse = (filterDic[filterKey].reverse);
                        const sufficientOptionValues = storyValues.map(storyValue => {
                            const throughOptionValues = allOptionValues
                                .filter(optionValue => {
                                    const result = throughFilter(storyValue, optionValue, filterKey);
                                    return reverse ? !result : result;
                                });
                            if (filterMode === 'gt' || filterMode === 'ge') {
                                return throughOptionValues[throughOptionValues.length - 1];
                            } else if (filterMode === 'le' || filterMode === 'dateRange') {
                                return throughOptionValues[0];
                            }
                        }).filter((x, i, self) => self.indexOf(x) === i);

                        // "return sufficientOptionValues;" would disturb order of options.
                        return allOptionValues.filter(x => sufficientOptionValues.includes(x));
                    } else {
                        return storyValues;
                    }
                })();

                initialSelectDic[filterKey] = {};
                initialSelectDic[filterKey].initialOptionDic = {};
                const initialOptionDic = initialSelectDic[filterKey].initialOptionDic;

                // Add .fas-filter-menu-item_locked to each option tag
                // when alternatelyFilteredStoryIds are equal to initialStoryIds.
                const initialOptionLocked = ['default', ...optionValues].map(optionValue => {
                    initialOptionDic[optionValue] = {};

                    const option = document.createElement('option');
                    option.textContent = optionValue === 'default' ? defaultText : optionValue;
                    option.value = optionValue;
                    option.classList.add('fas-filter-menu-item');

                    const alternatelyFilteredStoryIds =
                        makeAlternatelyFilteredStoryIds(initialStoryDic, optionValue, filterKey);
                    initialOptionDic[optionValue].storyNumber = alternatelyFilteredStoryIds.length;
                    if (filterDic[filterKey].reverse && alternatelyFilteredStoryIds.length === 0) {
                        option.classList.add('fas-filter-menu-item_story-zero');
                    }

                    const idsEqualFlag =
                        JSON.stringify(initialStoryIds) === JSON.stringify(alternatelyFilteredStoryIds);
                    if (idsEqualFlag) {
                        option.classList.add('fas-filter-menu-item_locked');
                    }
                    selectTag.appendChild(option);

                    return idsEqualFlag;
                }).every(x => x);

                const optionTags = selectTag.getElementsByTagName('option');
                if (initialOptionLocked) {
                    // When every alternatelyFilteredStoryIds are equal to initialStoryIds,
                    if (optionTags.length === 1) {
                        // if every story have no filter value, don't display filter.
                        selectTag.style.display = 'none';
                    } else if (optionTags.length === 2) {
                        // if every stories has same value, disable filter.
                        selectTag.value = optionTags[1].value;
                        selectTag.setAttribute('disabled', '');
                    } else {
                        // else, add .fas-filter-menu_locked.
                        selectTag.classList.add('fas-filter-menu_locked');
                    }
                } else if (menuItemGroupClasses.length) {
                    // Highlight options by filter result by adding menuItemGroupClasses

                    // Unique storyNumber in dsc order
                    const filterResults = Object.keys(initialOptionDic)
                        .map(optionValue => initialOptionDic[optionValue].storyNumber)
                        .filter((x, i, self) => self.indexOf(x) === i)
                        .sort((a, b) => b - a);

                    // Generate combinations of filterResults
                    // which is divided into menuItemGroupClasses.length groups.
                    const dividedResultsCombinations = (() => {
                        if (filterResults.length <= menuItemGroupClasses.length) {
                            // There is no need to divide filterResults.
                            return [filterResults.map(x => [x])];
                        } else {
                            // Generate combinations of divideIndexes.
                            // Divide filterResults by using divideIndexesCombination.
                            const middleIndexes = [...Array(filterResults.length).keys()].slice(1);
                            return generateCombinations(middleIndexes, menuItemGroupClasses.length - 1)
                                .map(middleIndexesCombination => {
                                    const divideIndexes =
                                        [0, ...middleIndexesCombination, filterResults.length];
                                    const dividedResultsCombination = [];
                                    divideIndexes.reduce((p, x) => {
                                        dividedResultsCombination.push(filterResults.slice(p, x));
                                        return x;
                                    });
                                    return dividedResultsCombination;
                                });
                        }
                    })();

                    // Jenks Natural Breaks.
                    // For each dividedResultsCombination,
                    // calculate sum of squared deviations for class means(SDCM).
                    // dividedResultsCombination with minimum SDCM score is the best match.
                    const minIndex = (() => {
                        if (dividedResultsCombinations.length === 1) {
                            return 0;
                        } else {
                            return dividedResultsCombinations.map(dividedResultsCombination => {
                                return dividedResultsCombination.map(dividedResults => {
                                    const classMean =
                                        dividedResults.reduce((p, x) => p + x) / dividedResults.length;
                                    return dividedResults
                                        .map(x => (x - classMean) ** 2)
                                        .reduce((p, x) => p + x);
                                }).reduce((p, x) => p + x);
                            }).reduce((iMin, x, i, self) => x < self[iMin] ? i : iMin, 0);
                        }
                    })();

                    // Add menuItemGroupClasses according to dividedResultsCombinations[minIndex]
                    Object.keys(initialOptionDic)
                        .forEach(optionValue => {
                            const dividedResultsIndex = dividedResultsCombinations[minIndex]
                                .findIndex(dividedResults => {
                                    return dividedResults.includes(
                                        initialOptionDic[optionValue].storyNumber
                                    );
                                });
                            [...optionTags]
                                .filter(x => x.value === optionValue)
                                .forEach(x => {
                                    x.classList.add(menuItemGroupClasses[dividedResultsIndex]);
                                });
                        });
                }

                // Log initial classList
                initialSelectDic[filterKey].initialMenuClassName = selectTag.className;
                [...optionTags].forEach(optionTag => {
                    initialOptionDic[optionTag.value].initialItemClassName = optionTag.className;
                });

                // Change display of stories by selected filter value.
                selectTag.addEventListener('change', (e) => {
                    filterStories(filterKey, selectTag.value);
                });
                return selectTag;
            };

            // Make and append filters
            Object.keys(filterDic).forEach(filterKey => {
                const filterTag = makeSelectTag(filterKey, filterDic[filterKey].text);
                filterDiv.appendChild(filterTag);
                filterDiv.appendChild(document.createTextNode(' '));
            });

            // Don't display filter which doesn't meet a filterDic[filterKey].condition
            Object.keys(filterDic)
                .filter(filterKey => filterDic[filterKey].condition)
                .forEach(filterKey => {
                    const condition = filterDic[filterKey].condition;
                    const conditionInitialOptions =
                        Object.keys(initialSelectDic[condition.filterKey].initialOptionDic);
                    if (!conditionInitialOptions.includes(condition.value)) {
                        const selectTag = [...filterDiv.children]
                            .find(selectTag => selectTag.id === tabId + '_' + filterKey + '_select');
                        selectTag.style.display = 'none';
                    }
                });

            // Add Clear button:
            // Clear filter settings and revert attributes and class according to initialSelectDic.
            // Make new filterDiv when "Load all pages" button is clicked.
            const clear = document.createElement('span');
            clear.textContent = 'Clear';
            clear.title = "Reset filter values to default";
            clear.className = 'gray';
            clear.addEventListener('click', (e) => {
                const selectDic = makeSelectDic();
                const changed = Object.keys(selectDic)
                    .filter(filterKey => selectDic[filterKey].accessible)
                    .map(filterKey => selectDic[filterKey].value !== 'default')
                    .some(x => x);
                const zListTags = [...tabInside.getElementsByClassName('z-list')]
                    .filter(zListTag => !zListTag.classList.contains('filtered'));
                const allPageLoaded = zListTags.length !== initialStoryIds.length;

                // Is there a need to run clear feature?
                if (changed) {
                    Object.keys(selectDic)
                        .filter(filterKey => selectDic[filterKey].accessible)
                        .forEach(filterKey => {
                            // Clear each filter
                            if (selectDic[filterKey].value !== 'default') {
                                selectDic[filterKey].dom.value = 'default';
                            }

                            // Revert attributes and class of select tag according to initialSelectDic.
                            const initialMenuClassName = initialSelectDic[filterKey].initialMenuClassName;
                            if (selectDic[filterKey].dom.className !== initialMenuClassName) {
                                selectDic[filterKey].dom.className = initialMenuClassName;
                            }

                            // Revert attributes and class of option tag according to optionDic.
                            const optionDic = selectDic[filterKey].optionDic;
                            const initialOptionDic = initialSelectDic[filterKey].initialOptionDic;
                            Object.keys(optionDic).forEach(optionValue => {
                                const initialItemClassName =
                                    initialOptionDic[optionValue].initialItemClassName;

                                if (optionDic[optionValue].dom.hasAttribute('hidden')) {
                                    optionDic[optionValue].dom.removeAttribute('hidden');
                                }
                                if (optionDic[optionValue].dom.className !== initialItemClassName) {
                                    optionDic[optionValue].dom.className = initialItemClassName;
                                }
                            });
                        });
                }

                if (changed || allPageLoaded) {
                    // Change display of stories to initial state.
                    zListTags
                        .filter(zListTag => zListTag.style.display === 'none')
                        .forEach(x => {
                            x.style.display = '';
                        });

                    // Change story number to initial state.
                    const badge = document.getElementById('l_' + tabId).firstElementChild;
                    badge.textContent = zListTags.length;
                }

                // When "Load all pages" button is clicked,
                // remove old filterDiv and add new filterDiv.
                if (allPageLoaded) {
                    tab.removeChild(tab.firstElementChild);
                    appendFilterDiv();
                }
            });
            filterDiv.appendChild(clear);

            // Append filterDiv
            tab.insertBefore(filterDiv, tab.firstChild);
        };

        // Append filters
        appendFilterDiv();
    }
})();
