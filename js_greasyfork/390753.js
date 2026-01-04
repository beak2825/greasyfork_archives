// ==UserScript==
// @name         Better Movie-blog
// @namespace    hoehleg.userscripts.private
// @version      0.5.14
// @description  Browse trough the articles with left and right cursor keys
// @author       Gerrit Höhle
// @match        http://movie-blog.at/
// @match        http://movie-blog.at/page/*
// @match        http://movie-blog.at/category/*
// @match        http://movie-blog.sx/
// @match        http://movie-blog.sx/page/*
// @match        http://movie-blog.sx/category/*
// @match        http://www.movie-blog.org/
// @match        http://www.movie-blog.org/page/*
// @match        http://www.movie-blog.org/category/*
// @match        http://movie-blog.to/
// @match        http://movie-blog.to/page/*
// @match        http://movie-blog.to/category/*
// @match        http://movie-blog.tv/
// @match        http://movie-blog.tv/page/*
// @match        http://movie-blog.tv/category/*
// @match        https://movie-blog.tv/
// @match        https://movie-blog.tv/page/*
// @match        https://movie-blog.tv/category/*
// @require      https://greasyfork.org/scripts/390752-comparator/code/Comparator.js?version=744703
// @require      https://greasyfork.org/scripts/391608-privateproperty/code/PrivateProperty.js?version=744693
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/390753/Better%20Movie-blog.user.js
// @updateURL https://update.greasyfork.org/scripts/390753/Better%20Movie-blog.meta.js
// ==/UserScript==

/* jshint esversion: 6 */
/* globals Comparator, PrivateProperty */

(function() {
    'use strict';
    const CONFIG = {
        // number of pages to load Beitraege to one page
        PAGES_LOAD_COUNT: 2,

        // unit for row "Groesse" in beitraege table
        TABLE_BEITRAEGE_SIZE_DEFAULT_UNIT: "GB",

        // position of sidebar (below image)
        SIDEBAR_POSITION_TOP_PX : 670
    };

    const CONST = (() => {
        const URL_PATH = (() => {
            const path = document.location.pathname.split("/").filter(str => str.length > 0);
            return path === null ? [] : path;
        })();

        const DATA_SIZE_UNITS = (() => {
            const DataSize = function(factor, shortText, longText) {
                this.factor = factor;
                this.shortText = shortText;
                this.longText= longText;
                Object.freeze(this);
            };
            return [
                new DataSize(1<<0, "B", "Byte"),
                new DataSize(1<<10, "KB", "Kilobyte"),
                new DataSize(1<<20, "MB", "Megabyte"),
                new DataSize(1<<30, "GB", "Gigabyte"),
                new DataSize(1<<40, "TB", "Terabyte"),
            ].reduce((map, dataSize) => map.set(dataSize.shortText, dataSize), new Map());
        })();

      const TABLE_BEITRAEGE_HEADER_NAMES = {
            NUM: "#",
            RATING: "IMDb",
            SIZE: "Größe",
            LINK: "Link",
            DATE: "Datum",
            TYPE: "Typ",
            JAHR: "Jahr",
            DURATION: "Dauer"
        };

        const HTML_CLASSES = {
            DATE: "date",
            BEITRAG: "beitrag4",
            TABLE_BEITRAEGE_COLUMN_NUM: "col-num",
            TABLE_BEITRAEGE_COLUMN_RATING: "col-rating",
            TABLE_BEITRAEGE_COLUMN_SIZE: "col-size",
            TABLE_BEITRAEGE_COLUMN_LINK: "col-link",
            TABLE_BEITRAEGE_COLUMN_DATE: "col-date",
            TABLE_BEITRAEGE_COLUMN_TYPE: "col-type",
            TABLE_BEITRAEGE_COLUMN_JAHR: "col-jahr",
            TABLE_BEITRAEGE_COLUMN_DURATION: "col-duration",
            TABLE_ROW_HIGHLIGHTED: "row-highlighted",
            TABLE_COLUMN_SORTABLE: "sortable",
            TABLE_COLUMN_SORTED_ASC: "sorted-asc",
            TABLE_COLUMN_SORTED_DESC: "sorted-desc",
            PREVIOUS: "previous",
            NEXT: "next",
        };

        const HTML_IDS = {
            SHOW_CONTAINER: "show-container",
            BEITRAG_INFO: "beitrag-info",
            PAGE_NUMBER: "page-number",
            BEITRAG_NUMBER: "beitrag-number",
            BEITRAG_COUNT: "beitrag-count",
            FILM_DATA_IMDB_RATING: "film-data-imdb-rating",
            FILM_DATA_GROESSE: "film-data-groesse",
            FILM_DATA_DAUER: "film-data-dauer",
            BUTTON_PAGE_PREV: "btn-page-prev",
            BUTTON_PAGE_NEXT: "btn-page-next",
            BUTTON_BEITRAG_PREV: "btn-beitrag-prev",
            BUTTON_BEITRAG_NEXT: "btn-beitrag-next",
            LISTE_BEITRAEGE: "liste-beitraege",
            HEAD: "head",
            CONTENT: "content",
            TABLE_TR_NUM: "tr-num",
            SIDEBAR: "sidebar",
            CUR_BEITRAG_IMG: "cur-beitrag-img"
        };

        if (URL_PATH && URL_PATH[0] === "category") {
            Object.assign(HTML_CLASSES, {
                DATE: "date_x",
                BEITRAG : "beitrag2"
            });
            Object.assign(HTML_IDS, {
                CONTENT : "archiv"
            });
        }

        // Container
        let CSS = `
			#page {
				background-size: 98%;
				width: 100%;
				height: auto;
			}
			#${HTML_IDS.CONTENT} {
				margin: 0px 0px 0px 0px;
				padding: 0px 0px 0px 3.25%;
				width: 67.5%;
				height: 5000px
			}
			#${HTML_IDS.SIDEBAR} {
				position: absolute;
				top: ${CONFIG.SIDEBAR_POSITION_TOP_PX}px;
				right: 0px;
			}
			#${HTML_IDS.SHOW_CONTAINER} {
				position: relative;
				top: 30px;
			}
  			#${HTML_IDS.LISTE_BEITRAEGE} {
				position: relative;
				width: 100%;
			}
       `;

        // Beitrag
        CSS += `
			#${HTML_IDS.CUR_BEITRAG_IMG} {
				position: fixed;
				top: 2px;
				left: 72%;
				max-width: 400px;
				z-index: 1;
			}
			#${HTML_IDS.BEITRAG_INFO} {
				position: fixed;
				top: 2px;
				left: 80px;
			}
			.${HTML_CLASSES.BEITRAG} {
				position: relative;
				width: 100%;
                margin: 1.3em 0 0 0;
			}
			.${HTML_CLASSES.PREVIOUS}, .${HTML_CLASSES.NEXT} {
                display: inline-block;
                padding: 20;
                margin: 0;
                text-decoration: none;
                text-align: center;
                font-weight: bold;
            }
        `;

        // Table of Beitraege
        CSS += `
            #${HTML_IDS.LISTE_BEITRAEGE} > table {
				width: 100%;
                border: none;
				border-collapse: collapse;
                white-space: nowrap;
                font-size: smaller;
			}
            #${HTML_IDS.LISTE_BEITRAEGE} > table td, #${HTML_IDS.LISTE_BEITRAEGE} > table th {
                border-left: thin solid lightgray;
                border-right: thin solid lightgray;
                border-top: thin solid lightgray;
                padding: 5px 5px;
            }
            #${HTML_IDS.LISTE_BEITRAEGE} > table td:first-child, #${HTML_IDS.LISTE_BEITRAEGE} > table th:first-child {
                border-left: none;
            }

            #${HTML_IDS.LISTE_BEITRAEGE} > table td:last-child, #${HTML_IDS.LISTE_BEITRAEGE} > table th:last-child {
                border-right: none;
            }
           .${HTML_CLASSES.TABLE_ROW_HIGHLIGHTED} {
                background: rgba(255, 240, 200, 0.5);
                padding: 3px 5px;
                margin: -3px -5px;
                line-height: 1.7;
                border-radius: 3px;
           }
           .${HTML_CLASSES.TABLE_BEITRAEGE_COLUMN_NUM} {
 				width: 1em;
                max-width: 1.5em;
                text-align: right;
            }
            .${HTML_CLASSES.TABLE_BEITRAEGE_COLUMN_RATING} {
 				width: 1em;
                max-width: 3em;
                text-align: center;
            }
            .${HTML_CLASSES.TABLE_BEITRAEGE_COLUMN_JAHR} {
 				width: 1em;
                max-width: 3em;
                text-align: center;
            }
            .${HTML_CLASSES.TABLE_BEITRAEGE_COLUMN_LINK} {
 				width: auto;
 				max-width: 8em;

                text-align: left;

                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .${HTML_CLASSES.TABLE_BEITRAEGE_COLUMN_LINK} > a {
                color: black;
                letter-spacing: 1px;
            }
            .${HTML_CLASSES.TABLE_ROW_HIGHLIGHTED} .${HTML_CLASSES.TABLE_BEITRAEGE_COLUMN_LINK} > a {
                font-weight: 900;
                color: black;
                letter-spacing: 3px;
            }

            .${HTML_CLASSES.TABLE_BEITRAEGE_COLUMN_DURATION} {
 				width: 1em;
                max-width: 3.5em;
                text-align: right;
            }
            .${HTML_CLASSES.TABLE_BEITRAEGE_COLUMN_SIZE} {
                width: 1em;
                max-width: 5em;
                text-align: right;
            }
           .${HTML_CLASSES.TABLE_BEITRAEGE_COLUMN_TYPE} {
 				width: 1em;
                max-width: 5em;
                text-align: left;
            }
           .${HTML_CLASSES.TABLE_BEITRAEGE_COLUMN_DATE} {
 				width: 1em;
                max-width: 9em;
                text-align: left;
                font-size: smaller;
            }
		`;

        // table sort indicators
        CSS += `
            th.${HTML_CLASSES.TABLE_COLUMN_SORTABLE} {
                position: relative;
                cursor: pointer;
            }
            th.${HTML_CLASSES.TABLE_COLUMN_SORTABLE}::before {
                content: "\\21D5\\0020";
                position: relative;
                left: 0px;
                color: #999;
            }
            th.${HTML_CLASSES.TABLE_COLUMN_SORTABLE}:hover::before {
                color: #333;
            }
            th.${HTML_CLASSES.TABLE_COLUMN_SORTED_ASC}::before {
                content: "\\21D3\\0020";
            }
            th.${HTML_CLASSES.TABLE_COLUMN_SORTED_DESC}::before {
                content: "\\21D1\\0020";
            }
		`;

        CSS += `
            input[type="number"] {
                -webkit-appearance: textfield;
                -moz-appearance: textfield;
                appearance: textfield;
            }
            input[type=number]::-webkit-inner-spin-button,
            input[type=number]::-webkit-outer-spin-button {
                -webkit-appearance: none;
            }
		`;

        const MONTH_NAMES = ["JANUAR", "FEBRUAR", "MÄRZ", "APRIL", "MAI", "JUNI", "JULI", "AUGUST", "SEPTEMBER" ,"OKTOBER" ,"NOVEMBER" ,"DEZEMBER"];

        const REGEX = {
            DOKU: /\.DO[KC]U/i,
            SERIE: /\.S\d\d?(E\d\d?)?(-S\d\d?(E\d\d?)?)?\./i
        };

        return {
            URL_PATH: URL_PATH,
            TABLE_BEITRAEGE_HEADER_NAMES: TABLE_BEITRAEGE_HEADER_NAMES,
            HTML_CLASSES: HTML_CLASSES,
            HTML_IDS: HTML_IDS,
            CSS: CSS,
            MONTH_NAMES: MONTH_NAMES,
            DATA_SIZE_UNITS: DATA_SIZE_UNITS,
            REGEX: REGEX
         };
    })();

    const Util = (() => {
        return {
            getPageAsync: (url, onSuccess, onError = () => {}) => {
                return GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    onload: (resp) => {
                        switch (resp.status) {
                            case 200:
                            case 304:
                                resp.html = new DOMParser().parseFromString(resp.responseText, 'text/html');
                                onSuccess(resp);
                                return;
                            default:
                                onError(resp);
                                return;
                        }
                    },
                    onerror: onError
                });
            },

            createInputElement: (id, type, width, maxLength = 3, textAlign = "left") => {
                const inputElement = document.createElement("INPUT");
                inputElement.id = id;
                inputElement.type = type;
                inputElement.maxLength = maxLength;
                inputElement.style = `text-align:${textAlign};width:${width}`;
                return inputElement;
            },

            createShowContainer: () => {
                const oldContainer = document.getElementById(CONST.HTML_IDS.SHOW_CONTAINER);
                if (!oldContainer) {
                    const divHead = document.getElementById(CONST.HTML_IDS.HEAD);
                    divHead.parentNode.removeChild(divHead);

                    const divContent = document.getElementById(CONST.HTML_IDS.CONTENT);
                    divContent.innerHTML = "";

                    const newContainer = divContent.insertBefore(document.createElement("DIV"), divContent.firstChild);
                    newContainer.id = CONST.HTML_IDS.SHOW_CONTAINER;

                    const divBeitragInfo = newContainer.appendChild(document.createElement("DIV"));
                    divBeitragInfo.id = CONST.HTML_IDS.BEITRAG_INFO;

                    divBeitragInfo.appendChild(document.createTextNode("Seite: "));
                    Object.assign(divBeitragInfo.appendChild(document.createElement("BUTTON")), { innerHTML: "&#8249;", className: CONST.HTML_CLASSES.PREVIOUS, id: CONST.HTML_IDS.BUTTON_PAGE_PREV });
                    divBeitragInfo.appendChild(Util.createInputElement(CONST.HTML_IDS.PAGE_NUMBER, "number", "2em", 3, "center"));
                    Object.assign(divBeitragInfo.appendChild(document.createElement("BUTTON")), { innerHTML: "&#8250;", className: CONST.HTML_CLASSES.NEXT, id: CONST.HTML_IDS.BUTTON_PAGE_NEXT });

                    divBeitragInfo.appendChild(document.createTextNode(", Beitrag: "));
                    Object.assign(divBeitragInfo.appendChild(document.createElement("BUTTON")), { innerHTML: "&#8249;",className: CONST.HTML_CLASSES.PREVIOUS, id: CONST.HTML_IDS.BUTTON_BEITRAG_PREV });
                    divBeitragInfo.appendChild(Util.createInputElement(CONST.HTML_IDS.BEITRAG_NUMBER, "number", "2em", 2, "center"));
                    Object.assign(divBeitragInfo.appendChild(document.createElement("BUTTON")), { innerHTML: "&#8250;", className: CONST.HTML_CLASSES.NEXT, id: CONST.HTML_IDS.BUTTON_BEITRAG_NEXT });

                    divBeitragInfo.appendChild(document.createTextNode(" / "));
                    divBeitragInfo.appendChild(Util.createInputElement(CONST.HTML_IDS.BEITRAG_COUNT, "number", "2em", 2, "center")).disabled = true;

                    divBeitragInfo.appendChild(document.createTextNode(", IMDb: "));
                    divBeitragInfo.appendChild(Util.createInputElement(CONST.HTML_IDS.FILM_DATA_IMDB_RATING, "text", "3em", 4, "center")).disabled = true;

                    divBeitragInfo.appendChild(document.createTextNode(", Größe: "));
                    divBeitragInfo.appendChild(Util.createInputElement(CONST.HTML_IDS.FILM_DATA_GROESSE, "text", "7em", 9, "center")).disabled = true;

                    return true;
                } else {
                    for (let divBeitragOld of oldContainer.querySelectorAll(`DIV.${CONST.HTML_CLASSES.BEITRAG}`)) {
                        oldContainer.removeChild(divBeitragOld);
                    }
                    return false;
                }
            },

            parseInt: (str, maxIntPlaces = 1, fallbackValue = null) => {
                let regex = "\\d";
                if (maxIntPlaces > 1) {
                    regex += "{1," + maxIntPlaces + "}";
                }
                return Util.parseIntWithRegex(str, new RegExp(regex), fallbackValue);
            },

            parseFloat: (str, maxIntPlaces = 1, maxDecPlaces = 0, fallbackValue = null) => {
                let regex = "\\d";
                if (maxIntPlaces > 1) {
                    regex += "{1," + maxIntPlaces + "}";
                }
                if (maxDecPlaces > 0) {
                    regex += "\\s?[,\.]?\\s?\\d{0," + maxDecPlaces + "}";
                }
                return Util.parseFloatWithRegex(str, new RegExp(regex), fallbackValue);
            },

            parseIntWithRegex: (str, regex, fallbackValue = null) => {
                const match = Util.parseStrWithRegex(str, regex);
                const value = parseInt(match);
                return Number.isNaN(value) ? fallbackValue : value;
            },

            parseFloatWithRegex: (str, regex, fallbackValue = null) => {
                const match = Util.parseStrWithRegex(str, regex, "").replace(",",".");
                const value = parseFloat(match);
                return Number.isNaN(value) ? fallbackValue : value;
            },

            parseStrWithRegex: (str, regex, fallbackValue = null) => {
                const match = regex.exec(str || "");
                return (match && match.length >= 1) ? match[0] : fallbackValue;
            },

            monthNameToNumber: (monthName) => {
                return CONST.MONTH_NAMES.indexOf(String(monthName).toUpperCase());
            },

            createTable(data, cellAttributes = {}, headerAttributes = cellAttributes) {
                function configRow(cellElement, content, attributes) {
                    cellElement.appendChild(content instanceof Element ? content : document.createTextNode(String(content)));
                    for (let attrName of Object.keys(attributes)) {
                        cellElement[attrName] = attributes[attrName];
                    }
                }

                const table = document.createElement("TABLE");
                if (data) {
                    for (let element of data) {
                        const row = table.insertRow();

                        for (let key of Object.keys(element)) {
                            const td = row.insertCell();
                            const content = element[key];
                            const attributes = cellAttributes[key] || {};
                            configRow(td, content, attributes);
                        }
                    }

                    const thead = table.createTHead();
                    const row = thead.insertRow();

                    for (let key of Object.keys(data[0])) {
                        const th = document.createElement("TH");
                        const attributes = headerAttributes[key] || {};
                        row.appendChild(th);

                        configRow(th, key, attributes);
                    }
                }

                return table;
            },
        };
    })();

    const Beitrag = (() => {
        const computeImdbLink = (containerElement, fallbackValue = null) => {
            for (let a of Array.from(containerElement.getElementsByTagName("A"))) {
                const linkTextUpper = a.textContent.toUpperCase();
                if (linkTextUpper.includes("IMDB")) {
                    return a;
                }
            }

            for (let elStrong of containerElement.querySelectorAll("STRONG, B")) {
                if (elStrong.textContent.toUpperCase().includes("IMDB")) {
                    const nextEl = elStrong.nextSibling;
                    if (nextEl && nextEl.tagName === "A") {
                        return nextEl;
                    }
                }
            }

            return fallbackValue;
        };

        const computeImdbRating = (containerElement, fallbackValue = null) => {
            const a = computeImdbLink(containerElement);
            if (a !== null) {
                let rating = Util.parseFloat(a.textContent.toUpperCase(), 2, 1);
                if (rating === null) {
                    const nextEl = a.nextSibling;
                    if (nextEl && nextEl.nodeType === Node.TEXT_NODE) {
                        rating = Util.parseFloat(nextEl.textContent.toUpperCase(), 2, 1);
                    }
                }

                if (rating !== null) {
                    return rating;
                }
            }

            return fallbackValue;
        };

        const computeDauer = (containerElement, fallbackValue = null) => {
            for (let elStrong of containerElement.querySelectorAll("STRONG, B")) {
                if (elStrong.textContent.toUpperCase().includes("DAUER")) {
                    const nextEl = elStrong.nextSibling;
                    if (nextEl) {
                        const textContentUpper = nextEl.textContent.toUpperCase();
                        const hours = Util.parseFloatWithRegex(textContentUpper, /(\d{1,2}\s?[,\.]?\s?\d{0,2})\s?(H|STUNDEN|HOURS)/);
                        const minutes = Util.parseIntWithRegex(textContentUpper, /(\d{1,4})\s?(M|MIN|MINUTEN|MINUTES)/);
                        if (hours !== null || minutes !== null) {
                            return (hours === null ? 0 : hours * 60) + (minutes === null ? 0 : minutes);
                        }
                    }
                }
            }
            return fallbackValue;
        };

        const computeMirrors = (containerElement) => {
            return Array.from(containerElement.querySelectorAll("STRONG + A, B + A")).filter(a => {
                const strong = a.previousElementSibling;
                const strongTextContentUpper = strong.textContent.toUpperCase();
                return ["DOWNLOAD", "MIRROR"].some(str => strongTextContentUpper.includes(str));
            }).filter(a => {
                const isWerbeLink = !a.hostname || a.hostname.toUpperCase().includes("MOVIE-BLOG");
                return !isWerbeLink;
            });
        };

        const computeDatum = (containerElement, fallbackValue = null) => {
            const reDay = "\\d{1,2}";
            const reMonth = CONST.MONTH_NAMES.reduce((a, b) => a + "|" + b);
            const reYear = "\\d{4}";
            const reHour = "\\d{1,2}";
            const reMin = "\\d{2}";

            for (let elDatum of containerElement.getElementsByClassName(CONST.HTML_CLASSES.DATE)) {
                const match = new RegExp("(" + reDay + ")\\.\\s(" + reMonth + ")\\s(" + reYear + ")\\s(" + reHour + "):(" + reMin + ")", "i").exec(elDatum.textContent);
                if (match && match.length === 6) {
                    const day = Number.parseInt(match[1]);
                    const month = Util.monthNameToNumber(match[2]);
                    const year = Number.parseInt(match[3]);
                    const hour = Number.parseInt(match[4]);
                    const minute = Number.parseInt(match[5]);

                    return (new Date(year, month, day, hour, minute));
                }
            }
            return fallbackValue;
        };

        const computeLink = (containerElement, fallbackValue = null) => {
            const datum = computeDatum(containerElement);
            if (datum !== null) {
                for (let h1 of containerElement.getElementsByTagName("H1")) {
                    for (let a of h1.getElementsByTagName("A")) {
                        if (a.title && a.title.includes("Permanent Link to")) {
                            return a.cloneNode(true);
                        }
                    }
                }
            }
            return fallbackValue;
        };

        const computeGroesse = (containerElement, fallbackValue = null) => {
            for (let elStrong of containerElement.querySelectorAll("STRONG, B")) {
                if (/GR(OE|Ö)(SS|ß)E/i.test(elStrong.textContent)) {

                    const nextEl = elStrong.nextSibling;
                    if (nextEl) {
                        const textContentUpper = nextEl.textContent.toUpperCase();
                        const gb = Util.parseFloatWithRegex(textContentUpper, /(\d{1,4}\s?[,\.]?\s?\d{0,3})\s?(GB|GIGABYTE)/);
                        const mb = Util.parseIntWithRegex(textContentUpper, /(\d{1,7}?)\s?(MB|MEGABYTE)/);
                        if (gb !== null || mb !== null) {
                            return (gb === null ? 0 : gb * 1024) + (mb === null ? 0 : mb);
                        }
                    }
                }
            }

            return fallbackValue;
        };

        const computeImgElement = (containerElement, fallbackValue = null) => {
            const img = containerElement.querySelectorAll("P > IMG");
            return img.length > 0 ? img[0] : fallbackValue;
        };

        const defaultCompare = new Comparator(...[
            beitrag => [Beitrag.TYPEN.FILM, Beitrag.TYPEN.DOKU, Beitrag.TYPEN.SERIE, Beitrag.TYPEN.WERBUNG].indexOf(beitrag.typ),
            beitrag => beitrag.groesse > 25 * 1024,
            new Comparator(beitrag => beitrag.imdbRating).reverse()
        ]).compareFnc;

        const TYPEN = Object.freeze({
            FILM: "Film",
            SERIE: "Serie",
            DOKU: "Doku",
            WERBUNG: "Werbung"
        });

        // private fields
        const _divElement = new PrivateProperty();
        const _imdbLink = new PrivateProperty();
        const _imdbRating = new PrivateProperty();
        const _imdbId = new PrivateProperty();
        const _dauer = new PrivateProperty();
        const _groesse = new PrivateProperty();
        const _link = new PrivateProperty();
        const _mirrors = new PrivateProperty();
        const _imgElement = new PrivateProperty();
        const _typ = new PrivateProperty();
        const _datum = new PrivateProperty();
        const _releasedYear = new PrivateProperty();

        class Beitrag {
            constructor(divElement) {
                _divElement.set(this, divElement);
            }

            get divElement() {
                return _divElement.get(this);
            }

            get imdbLink() {
                return _imdbLink.getOrCompute(this, () => computeImdbLink(this.divElement, null));
            }

            get imdbRating() {
                return _imdbRating.getOrCompute(this, () => computeImdbRating(this.divElement, -1));
            }

            get imdbRatingAsText() {
                return this.imdbRating === -1 ? "" : this.imdbRating.toFixed(1);
            }

            get imdbId() {
                return _imdbId.getOrCompute(this, () => this.imdbLink === null ? "" : Util.parseStrWithRegex(this.imdbLink, /tt\d{7,8}/, ""));
            }

            get dauer() {
                return _dauer.getOrCompute(this, () => computeDauer(this.divElement, 0));
            }

            get dauerAsText() {
                if (this.dauer === 0) {
                    return "";
                }
                const hours = String(Math.floor(this.dauer / 60));
                const minutes = String(this.dauer % 60);
                return `${hours}:${minutes.length === 1 ? "0" + minutes : minutes}`;

            }

            get groesse() {
                return _groesse.getOrCompute(this, () => computeGroesse(this.divElement, 0));
            }

            /**
             * Returns value "groesse" of this object converted to a specified unit.
             *
             * @param {string} [unit]          - Unit ("B", "KB", "MB", "GB", "TB"), see CONST.DATA_SIZE_UNITS
             * @returns {number}               - value converted for specified unit
             */
            getGroesseInUnit(unit) {
                const defaultDataSize = CONST.DATA_SIZE_UNITS.get("MB");
                const targetDataSize = CONST.DATA_SIZE_UNITS.get(unit) || defaultDataSize;
                return this.groesse * (defaultDataSize.factor / targetDataSize.factor);
            }

            /**
             * Returns a formatted string of attribute "groesse" of this object
             *
             * @param {string} [unit]          - Unit ("B", "KB", "MB", "GB", "TB"), see CONST.DATA_SIZE_UNITS
             * @param {number} [decimalPlaces] - Number of fixed digits after the decimal point
             * @returns {string}               - formatted string: "value unit", e.g. "2.61 GB"
             */
            getGroesseAsText(unit, decimalPlaces) {
                if (this.groesse === 0) {
                    return "";
                }

                let value = this.groesse;

                const defaultDataSize = CONST.DATA_SIZE_UNITS.get("MB");
                let dataSize = CONST.DATA_SIZE_UNITS.get(unit);

                if (!dataSize) {
                    for (dataSize of Array.from(CONST.DATA_SIZE_UNITS.values()).filter(ds => ds.factor >= defaultDataSize.factor)) {
                        if (dataSize.factor > defaultDataSize.factor) {
                            value = value / 1024;
                            if (typeof decimalPlaces === "undefined") {
                                decimalPlaces = 1;
                            }
                        }

                        if (value < 1024) {
                            break;
                        }
                    }
                } else {
                    value *= (defaultDataSize.factor / dataSize.factor);
                }

                return Number(Math.round(value + 'e1') + 'e-1').toFixed(decimalPlaces || 0) + " " + dataSize.shortText;
            }

            get link() {
                return _link.getOrCompute(this, () => computeLink(this.divElement, null));
            }

            get linkText() {
                return this.link ? this.link.textContent : "";
            }

            get mirrors() {
                return _mirrors.getOrCompute(this, () => computeMirrors(this.divElement));
            }

            get imgElement() {
                return _imgElement.getOrCompute(this, () => computeImgElement(this.divElement));
            }

            get typ() {
                return _typ.getOrCompute(this, () => {
                    if (this.mirrors.length === 0 || this.linkText.toUpperCase().includes('-HELD')) {
                        return Beitrag.TYPEN.WERBUNG;
                    }

                    if (CONST.REGEX.DOKU.test(this.linkText)) {
                        return Beitrag.TYPEN.DOKU;
                    }

                    if (CONST.REGEX.SERIE.test(this.linkText)) {
                        return Beitrag.TYPEN.SERIE;
                    }
                    return "";
                });
            }

            get datum() {
                return _datum.getOrCompute(this, () => computeDatum(this.divElement, null));
            }

            get releasedYear() {
                return _releasedYear.getOrCompute(this, () => {
                    const match = /\.(\d{4})\./.exec(this.linkText);
                    if (!match || match.length <= 1) {
                        return null;
                    }
                    return parseInt(match[1]) || null;
                });
            }

            static get TYPEN() {
                return TYPEN;
            }

            static get defaultCompare() {
                return defaultCompare;
            }
        }

        return Beitrag;
    })();


    const View = (() => {
        const addBeitraegeAsync = (beitraege, fromNumOfPage, toNumOfPage, onSuccess, onError) => {
            const urlPath = document.location.href.replace('page/', '').replace('#','');
            Util.getPageAsync(fromNumOfPage == 0 ? urlPath : `${urlPath}page/${fromNumOfPage + 1}/`, resp => {

                // add Beitraege
                beitraege.push(...Array.from(resp.html.querySelectorAll(`DIV.${CONST.HTML_CLASSES.BEITRAG}`)).map(div => new Beitrag(div)));

                if (fromNumOfPage < toNumOfPage) {
                    // load further Beitraege
                    addBeitraegeAsync(beitraege, fromNumOfPage + 1, toNumOfPage, onSuccess, onError);
                    return;
                }

                // Beitreage of last page loaded successfully
                onSuccess();
            }, onError);
        };

        return class {
            constructor(numOfPage = 0, numOfBeitrag = 0, pageSteps = CONFIG.PAGES_LOAD_COUNT) {
                this.pageSteps = pageSteps;
                this.numOfPage = numOfPage;
                this.numOfBeitrag = numOfBeitrag;
                this.beitraege = [];

                this.gotoPage();
            }

            get beitragCount() {
                return this.beitraege.length;
            }

            setBrowsingEnabled(isBrowsingEnabled) {
                this.isPageLoading = !isBrowsingEnabled;
                [
                    document.getElementById(CONST.HTML_IDS.PAGE_NUMBER),
                    document.getElementById(CONST.HTML_IDS.BEITRAG_NUMBER),
                    document.getElementById(CONST.HTML_IDS.BUTTON_PAGE_PREV),
                    document.getElementById(CONST.HTML_IDS.BUTTON_PAGE_NEXT),
                    document.getElementById(CONST.HTML_IDS.BUTTON_BEITRAG_PREV),
                    document.getElementById(CONST.HTML_IDS.BUTTON_BEITRAG_NEXT),
                ].forEach(inputElement => {
                    if (inputElement) {
                        inputElement.disabled = !isBrowsingEnabled;
                    }
                });
            }

            gotoPage(numOfPage = this.numOfPage, numOfBeitrag = -1) {
                // disable page browsing
                this.setBrowsingEnabled(false);

                const onSuccess = () => {
                    if (0 <= numOfBeitrag && numOfBeitrag < this.beitragCount) {
                        this.numOfBeitrag = numOfBeitrag;
                    } else {
                        this.numOfBeitrag = (numOfPage < this.numOfPage) ? this.beitragCount - 1 : 0;
                    }
                    this.numOfPage = numOfPage;

                    // distinct for links
                    const beitraegeByLinks = new Map(this.beitraege.map(b => [ b.link.href, b ]));
                    this.beitraege = Array.from(beitraegeByLinks.values());

                    // sort Beitraege by IMDb rating
                    this.beitraege.sort((a, b) => Beitrag.defaultCompare(a, b));

                    this.showBeitrag();
                    this.showTable();
                    this.highlightTableRow();
                    this.setBrowsingEnabled(true);
                };
                const onError = resp => this.setBrowsingEnabled(true);

                // merge Beitraege of 'pageSteps' pages
                this.beitraege = [];

                let numOfPageFirst = numOfPage * this.pageSteps;
                let numOfPageLast = numOfPageFirst + this.pageSteps - 1;
                addBeitraegeAsync(this.beitraege, numOfPageFirst, numOfPageLast, onSuccess, onError);
            }

            indexOfBeitrag(beitrag) {
                return this.beitraege.indexOf(beitrag);
            }

            gotoBeitrag(numOfBeitrag = this.numOfBeitrag) {
                this.highlightTableRow(this.numOfBeitrag, false);

                this.numOfBeitrag = numOfBeitrag;
                this.showBeitrag();

                this.highlightTableRow(this.numOfBeitrag, true);
            }

            showBeitrag() {
                // get a clean show container
                const isNewShowContainer = Util.createShowContainer();

                // clone Beitrag into show container
                const beitrag = this.beitraege[this.numOfBeitrag];
                const divBeitrag = beitrag ? beitrag.divElement : null;
                if (divBeitrag) {
                    const beitragContent = document.getElementById(CONST.HTML_IDS.SHOW_CONTAINER);
                    const beitragInfo = document.getElementById(CONST.HTML_IDS.BEITRAG_INFO);

                    const inputPageNum = document.getElementById(CONST.HTML_IDS.PAGE_NUMBER);
                    inputPageNum.value = this.numOfPage + 1;
                    inputPageNum.min = 1;
                    inputPageNum.max = 9999;

                    const inputBeitragNum = document.getElementById(CONST.HTML_IDS.BEITRAG_NUMBER);
                    inputBeitragNum.value = this.numOfBeitrag + 1;
                    inputBeitragNum.min = 1;
                    inputBeitragNum.max = this.beitragCount;

                    const btnPagePrev = document.getElementById(CONST.HTML_IDS.BUTTON_PAGE_PREV);
                    const btnPageNext = document.getElementById(CONST.HTML_IDS.BUTTON_PAGE_NEXT);
                    const btnBeitragPrev = document.getElementById(CONST.HTML_IDS.BUTTON_BEITRAG_PREV);
                    const btnBeitragNext = document.getElementById(CONST.HTML_IDS.BUTTON_BEITRAG_NEXT);

                    const gotoPage = (pageNum) => {
                        if (!this.isPageLoading) {
                            this.gotoPage(Math.max(0, pageNum), 0);
                        }
                    };

                    const gotoBeitrag = (beitragNum) => {
                        if (!this.isPageLoading) {
                            beitragNum = Math.max(beitragNum, 0);
                            beitragNum = Math.min(beitragNum, this.beitragCount - 1);
                            this.gotoBeitrag(beitragNum);
                        }
                    };

                    if (isNewShowContainer) {
                        inputPageNum.addEventListener("change", () => {
                            gotoPage(parseInt(inputPageNum.value) - 1);
                        });
                        btnPagePrev.addEventListener("click", () => {
                            gotoPage(parseInt(inputPageNum.value) - 1 - 1);
                        });
                        btnPageNext.addEventListener("click", () => {
                            gotoPage(parseInt(inputPageNum.value) - 1 + 1);
                        });

                        inputBeitragNum.addEventListener("change", () => {
                            gotoBeitrag(parseInt(inputBeitragNum.value) - 1);
                        });
                        btnBeitragPrev.addEventListener("click", () => {
                            gotoBeitrag(parseInt(inputBeitragNum.value) - 1 - 1);
                        });
                        btnBeitragNext.addEventListener("click", () => {
                            gotoBeitrag(parseInt(inputBeitragNum.value) - 1 + 1);
                        });
                    }

                    document.getElementById(CONST.HTML_IDS.BEITRAG_COUNT).value = this.beitragCount;
                    document.getElementById(CONST.HTML_IDS.FILM_DATA_IMDB_RATING).value = beitrag.imdbRating;
                    document.getElementById(CONST.HTML_IDS.FILM_DATA_GROESSE).value = beitrag.getGroesseAsText();

                    // remove former image from sidebar
                    const curImage = document.getElementById(CONST.HTML_IDS.CUR_BEITRAG_IMG);
                    if (curImage !== null) {
                        curImage.parentElement.removeChild(curImage);
                    }

                    // insert image to sidebar
                    const divSidebar = document.getElementById(CONST.HTML_IDS.SIDEBAR);
                    const imgElement = beitrag.imgElement;
                    if (divSidebar && imgElement) {
                        imgElement.id = CONST.HTML_IDS.CUR_BEITRAG_IMG;
                        divSidebar.insertBefore(imgElement, divSidebar.firstChild);

                        window.onscroll = () => {
                            imgElement.style.display = ((window.pageYOffset || document.documentElement.scrollTop) < CONFIG.SIDEBAR_POSITION_TOP_PX - 175) ? 'block' : 'none';
                        };
                    }

                    return beitragContent.appendChild(divBeitrag) ? true : false;
                }
                return false;
            }

            highlightTableRow(numOfBeitrag = this.numOfBeitrag, isHighlight = true) {
                const tableRow = document.getElementById(`${CONST.HTML_IDS.TABLE_TR_NUM}_${numOfBeitrag + 1}`);
                if (tableRow) {
                    tableRow.classList[isHighlight ? "add" : "remove"](CONST.HTML_CLASSES.TABLE_ROW_HIGHLIGHTED);
                }
            }

            showTable() {
                const sortByColumn = ({containerElement, columnClass, sortFunction, defaultSortOrderAsc = true} = {}) => {
                    const curBeitrag = this.beitraege[this.numOfBeitrag];

                    if (this.sortedColumnClass !== columnClass) {
                        const thSortedPrevious = this.sortedColumnClass ? null : containerElement.querySelector(`th.${this.sortedColumnClass}`);
                        if (thSortedPrevious) {
                            thSortedPrevious.classList.remove(CONST.HTML_CLASSES.TABLE_COLUMN_SORTED_ASC, CONST.HTML_CLASSES.TABLE_COLUMN_SORTED_DESC);
                        }

                        this.beitraege.sort(sortFunction);
                        this.sortedColumnClass = columnClass;
                        this.sortOrder = defaultSortOrderAsc;
                    } else {
                        this.beitraege.reverse();
                        this.sortOrder = !this.sortOrder;
                    }

                    this.showTable();
                    this.gotoBeitrag(this.indexOfBeitrag(curBeitrag));

                    const thSort = containerElement.querySelector(`th.${this.sortedColumnClass}`);
                    if (thSort) {
                        thSort.classList.add(this.sortOrder ? CONST.HTML_CLASSES.TABLE_COLUMN_SORTED_ASC : CONST.HTML_CLASSES.TABLE_COLUMN_SORTED_DESC);
                    }
                };

                let tableDiv = document.getElementById(CONST.HTML_IDS.LISTE_BEITRAEGE);
                if (!tableDiv) {
                    const beitragInfoDiv = document.getElementById(CONST.HTML_IDS.BEITRAG_INFO);
                    const beitragContent = document.getElementById(CONST.HTML_IDS.SHOW_CONTAINER);
                    tableDiv = beitragInfoDiv.parentNode.insertBefore(document.createElement("DIV"), beitragInfoDiv);
                    tableDiv.id = CONST.HTML_IDS.LISTE_BEITRAEGE;
                } else {
                    while (tableDiv.firstChild) {
                        tableDiv.removeChild(tableDiv.firstChild);
                    }
                }

                const tableData = this.beitraege.map((beitrag, i) => ({
                    [CONST.TABLE_BEITRAEGE_HEADER_NAMES.NUM]: i + 1,
                    [CONST.TABLE_BEITRAEGE_HEADER_NAMES.RATING]: (() => {
                        const textContent = beitrag.imdbRatingAsText;
                        if (beitrag.imdbId) {
                           const link = document.createElement("A");
                            link.target = "_blank";
                            link.href = `https://www.imdb.com/title/${beitrag.imdbId}/`;
                            link.textContent = textContent;
                            return link;
                        }
                        return textContent;
                    })(),
                    [CONST.TABLE_BEITRAEGE_HEADER_NAMES.JAHR]: beitrag.releasedYear || "",
                    [CONST.TABLE_BEITRAEGE_HEADER_NAMES.LINK]: (() => {
                        if (!beitrag.link) {
                            return "";
                        }

                        const link = beitrag.link.cloneNode(true);
                        // Textformatierungen entfernen
                        while(link.firstChild) {
                            link.removeChild(link.firstChild);
                        }
                        link.textContent = beitrag.linkText;
                        return link;
                    })(),
                    [CONST.TABLE_BEITRAEGE_HEADER_NAMES.DURATION]: beitrag.dauerAsText,
                    [CONST.TABLE_BEITRAEGE_HEADER_NAMES.SIZE]: beitrag.getGroesseAsText(CONFIG.TABLE_BEITRAEGE_SIZE_DEFAULT_UNIT, 1),
                    [CONST.TABLE_BEITRAEGE_HEADER_NAMES.TYPE]: beitrag.typ,
                    [CONST.TABLE_BEITRAEGE_HEADER_NAMES.DATE]: (() => {
                        const date = beitrag.datum.toLocaleDateString(undefined, { dateStyle: "short" });
                        const time = beitrag.datum.toLocaleTimeString(undefined, { timeStyle: "short" });
                        return [ date, time ].join(" ");
                    })(),
                }));

                const thisView = this;
                const tdAttributes = {
                    [CONST.TABLE_BEITRAEGE_HEADER_NAMES.NUM]: { className: CONST.HTML_CLASSES.TABLE_BEITRAEGE_COLUMN_NUM, onmouseover: function() {
                        const lineNumber = parseInt(this.innerText);
                        if (Number.isInteger(lineNumber)) {
                            thisView.gotoBeitrag(lineNumber - 1);
                        }
                    }},
                    [CONST.TABLE_BEITRAEGE_HEADER_NAMES.RATING]: { className: CONST.HTML_CLASSES.TABLE_BEITRAEGE_COLUMN_RATING },
                    [CONST.TABLE_BEITRAEGE_HEADER_NAMES.JAHR]: { className: CONST.HTML_CLASSES.TABLE_BEITRAEGE_COLUMN_JAHR },
                    [CONST.TABLE_BEITRAEGE_HEADER_NAMES.LINK]: { className: CONST.HTML_CLASSES.TABLE_BEITRAEGE_COLUMN_LINK },
                    [CONST.TABLE_BEITRAEGE_HEADER_NAMES.DURATION]: { className: CONST.HTML_CLASSES.TABLE_BEITRAEGE_COLUMN_DURATION },
                    [CONST.TABLE_BEITRAEGE_HEADER_NAMES.SIZE]: { className: CONST.HTML_CLASSES.TABLE_BEITRAEGE_COLUMN_SIZE },
                    [CONST.TABLE_BEITRAEGE_HEADER_NAMES.TYPE]: { className: CONST.HTML_CLASSES.TABLE_BEITRAEGE_COLUMN_TYPE },
                    [CONST.TABLE_BEITRAEGE_HEADER_NAMES.DATE]: { className: CONST.HTML_CLASSES.TABLE_BEITRAEGE_COLUMN_DATE },
                };

               const thAttributes = {
                    [CONST.TABLE_BEITRAEGE_HEADER_NAMES.NUM]: {
                        onclick: () => sortByColumn({
                            containerElement: tableDiv,
                            columnClass: CONST.HTML_CLASSES.TABLE_BEITRAEGE_COLUMN_NUM,
                            sortFunction: Beitrag.defaultCompare,
                            defaultSortOrderAsc: true
                        }),
                        className: [ CONST.HTML_CLASSES.TABLE_BEITRAEGE_COLUMN_NUM, CONST.HTML_CLASSES.TABLE_COLUMN_SORTABLE ].join(" ")
                    },
                    [CONST.TABLE_BEITRAEGE_HEADER_NAMES.RATING]: {
                        onclick: () => sortByColumn({
                            containerElement: tableDiv,
                            columnClass: CONST.HTML_CLASSES.TABLE_BEITRAEGE_COLUMN_RATING,
                            sortFunction: new Comparator(beitrag => beitrag.imdbRating).reverse().compareFnc,
                            defaultSortOrderAsc: false
                        }),
                        className: [ CONST.HTML_CLASSES.TABLE_BEITRAEGE_COLUMN_RATING, CONST.HTML_CLASSES.TABLE_COLUMN_SORTABLE ].join(" ")
                    },
                    [CONST.TABLE_BEITRAEGE_HEADER_NAMES.JAHR]: {
                        onclick: () => sortByColumn({
                            containerElement: tableDiv,
                            columnClass: CONST.HTML_CLASSES.TABLE_BEITRAEGE_COLUMN_JAHR,
                            sortFunction: new Comparator(beitrag => beitrag.releasedYear).compareFnc,
                            defaultSortOrderAsc: true
                        }),
                        className: [ CONST.HTML_CLASSES.TABLE_BEITRAEGE_COLUMN_JAHR, CONST.HTML_CLASSES.TABLE_COLUMN_SORTABLE ].join(" ")
                    },
                    [CONST.TABLE_BEITRAEGE_HEADER_NAMES.LINK]: {
                        onclick: () => sortByColumn({
                            containerElement: tableDiv,
                            columnClass: CONST.HTML_CLASSES.TABLE_BEITRAEGE_COLUMN_LINK,
                            sortFunction: new Comparator(beitrag => beitrag.linkText).compareFnc,
                            defaultSortOrderAsc: true
                        }),
                        className: [ CONST.HTML_CLASSES.TABLE_BEITRAEGE_COLUMN_LINK, CONST.HTML_CLASSES.TABLE_COLUMN_SORTABLE ].join(" ")
                    },
                    [CONST.TABLE_BEITRAEGE_HEADER_NAMES.DURATION]: {
                        onclick: () => sortByColumn({
                            containerElement: tableDiv,
                            columnClass: CONST.HTML_CLASSES.TABLE_BEITRAEGE_COLUMN_DURATION,
                            sortFunction: new Comparator(beitrag => beitrag.dauer).compareFnc,
                            defaultSortOrderAsc: true
                        }),
                        className: [ CONST.HTML_CLASSES.TABLE_BEITRAEGE_COLUMN_DURATION, CONST.HTML_CLASSES.TABLE_COLUMN_SORTABLE ].join(" ")
                    },
                    [CONST.TABLE_BEITRAEGE_HEADER_NAMES.SIZE]: {
                        onclick: () => sortByColumn({
                            containerElement: tableDiv,
                            columnClass: CONST.HTML_CLASSES.TABLE_BEITRAEGE_COLUMN_SIZE,
                            sortFunction: new Comparator(beitrag => beitrag.groesse).reverse().compareFnc,
                            defaultSortOrderAsc: false
                        }),
                        className: [ CONST.HTML_CLASSES.TABLE_BEITRAEGE_COLUMN_SIZE, CONST.HTML_CLASSES.TABLE_COLUMN_SORTABLE ].join(" ")
                    },
                    [CONST.TABLE_BEITRAEGE_HEADER_NAMES.TYPE]: {
                        onclick: () => sortByColumn({
                            containerElement: tableDiv,
                            columnClass: CONST.HTML_CLASSES.TABLE_BEITRAEGE_COLUMN_TYPE,
                            sortFunction: new Comparator(beitrag => beitrag.typ).compareFnc,
                            defaultSortOrderAsc: true
                        }),
                        className: [ CONST.HTML_CLASSES.TABLE_BEITRAEGE_COLUMN_TYPE, CONST.HTML_CLASSES.TABLE_COLUMN_SORTABLE ].join(" ")
                    },
                    [CONST.TABLE_BEITRAEGE_HEADER_NAMES.DATE]: {
                        onclick: () => sortByColumn({
                            containerElement: tableDiv,
                            columnClass: CONST.HTML_CLASSES.TABLE_BEITRAEGE_COLUMN_DATE,
                            sortFunction: new Comparator(beitrag => beitrag.datum.valueOf()).compareFnc,
                            defaultSortOrderAsc: true
                        }),
                        className: [ CONST.HTML_CLASSES.TABLE_BEITRAEGE_COLUMN_DATE, CONST.HTML_CLASSES.TABLE_COLUMN_SORTABLE ].join(" ")
                    },
                };

                const table = Util.createTable(tableData, tdAttributes, thAttributes);
                for (let tr of table.getElementsByTagName("TR")) {
                    const tdNum = tr.getElementsByClassName(CONST.HTML_CLASSES.TABLE_BEITRAEGE_COLUMN_NUM);
                    const num = tdNum.length > 0 ? Util.parseInt(tdNum[0].textContent, 3) : null;
                    if (num !== null) {
                        tr.id = `${CONST.HTML_IDS.TABLE_TR_NUM}_${num}`;
                    }
                }

                tableDiv.appendChild(table);
            }
        };
    })();

    const view = new View();
	GM_addStyle(CONST.CSS);

    const browseBeitrag = function(distance) {
        if (view.isPageLoading) {
            return;
        }
        const numOfNextBeitrag = view.numOfBeitrag + distance;

        if (numOfNextBeitrag < 0) {
            if (view.numOfPage > 0) {
                view.gotoPage(view.numOfPage - 1);
            }
        } else if (numOfNextBeitrag >= view.beitragCount) {
            view.gotoPage(view.numOfPage + 1);
        } else {
            view.gotoBeitrag(numOfNextBeitrag);
        }
    };

    document.onkeydown = function (e) {
        switch (e.keyCode) {
            case 37: // key left
                browseBeitrag(-1);
                return false;
            case 39: // key right
                browseBeitrag(1);
                return false;
            case 33: // page up
                view.gotoPage(Math.max(0, view.numOfPage - 1), 0);
                return false;
            case 34: // page down
                view.gotoPage(view.numOfPage + 1, 0);
                return false;
        }
    };
})();