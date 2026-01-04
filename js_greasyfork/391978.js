// ==UserScript==
// @name         Beitrag
// @namespace    hoehleg.userscripts.private.movie-blog
// @version      0.3.2
// @description  Class representing an article from the page movie-blog.to / movie-blog.org
// @author       Gerrit Höhle
// @require      https://greasyfork.org/scripts/391608-privateproperty/code/PrivateProperty.js?version=744693
// @require      https://greasyfork.org/scripts/391854-enum/code/Enum.js?version=746956
// @require      https://greasyfork.org/scripts/391979-parseutil/code/ParseUtil.js?version=746751
// @grant        none
// ==/UserScript==

/* jshint esnext: true */
/* globals PrivateProperty, Enum, ParseUtil */
const Beitrag = (() => {

    const URL_PATH = document.location.pathname.split("/").filter(str => str.length);

	const MONTH_NAMES = [ "JANUAR", "FEBRUAR", "MÄRZ", "APRIL", "MAI", "JUNI", "JULI", "AUGUST", "SEPTEMBER" ,"OKTOBER" ,"NOVEMBER" ,"DEZEMBER" ];

	const REGEX = {
		DOKU: /\.DO[KC]U/i,
		SERIE: /\.S\d\d?(E\d\d?)?(-S\d\d?(E\d\d?)?)?\./i
	};

	const HTML_CLASSES = {
	    DATE: URL_PATH && URL_PATH[0] === "category" ? "date_x" : "date"
	};

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
            let rating = ParseUtil.parseFloat(a.textContent.toUpperCase(), 2, 1);
            if (rating === null) {
                const nextEl = a.nextSibling;
                if (nextEl && nextEl.nodeType === Node.TEXT_NODE) {
                    rating = ParseUtil.parseFloat(nextEl.textContent.toUpperCase(), 2, 1);
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
                    const hours = ParseUtil.parseFloatWithRegex(textContentUpper, /(\d{1,2}\s?[,\.]?\s?\d{0,2})\s?(H|STUNDEN|HOURS)/);
                    const minutes = ParseUtil.parseIntWithRegex(textContentUpper, /(\d{1,4})\s?(M|MIN|MINUTEN|MINUTES)/);
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
        const reMonth = MONTH_NAMES.join("|");
        const reYear = "\\d{4}";
        const reHour = "\\d{1,2}";
        const reMin = "\\d{2}";

        for (let elDatum of containerElement.getElementsByClassName(HTML_CLASSES.DATE)) {
            const match = new RegExp("(" + reDay + ")\\.\\s(" + reMonth + ")\\s(" + reYear + ")\\s(" + reHour + "):(" + reMin + ")", "i").exec(elDatum.textContent);
            if (match && match.length === 6) {
                const day = Number.parseInt(match[1]);
                const month = MONTH_NAMES.indexOf(String(match[2]).toUpperCase());
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
            const yearFourDigits = datum.getFullYear();
            const monthTwoDigits = ('00' + (datum.getMonth() + 1)).slice(-2);
            const dayTwoDigits = ('00' + datum.getDate()).slice(-2);

            const urlPath = "/" + [yearFourDigits, monthTwoDigits, dayTwoDigits].reduce((a, b) => a + "/" + b) + "/";

            for (let h1 of containerElement.getElementsByTagName("H1")) {
                for (let a of h1.getElementsByTagName("A")) {
                    if (a.href.includes(urlPath)) {
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
                    const gb = ParseUtil.parseFloatWithRegex(textContentUpper, /(\d{1,4}\s?[,\.]?\s?\d{0,3})\s?(GB|GIGABYTE)/);
                    const mb = ParseUtil.parseIntWithRegex(textContentUpper, /(\d{1,7}?)\s?(MB|MEGABYTE)/);
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

    const TYPEN = class TYP extends Enum{}.init([
        { NONE: "" },
        { FILM: "Film" },
        { SERIE: "Serie" },
        { DOKU: "Doku" },
        { WERBUNG: "Werbung" }
    ]);

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
            return _imdbId.getOrCompute(this, () => this.imdbLink === null ? "" : ParseUtil.parseStrWithRegex(this.imdbLink, /tt\d{7,8}/, ""));
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
         * @param {string} [unit]          - Unit ("B", "KB", "MB", "GB", "TB"), see DATA_SIZE_UNITS
         * @returns {number}               - value converted for specified unit
         */
        getGroesseInUnit(unit) {
            const defaultDataSize = DATA_SIZE_UNITS.get("MB");
            const targetDataSize = DATA_SIZE_UNITS.get(unit) || defaultDataSize;
            return this.groesse * (defaultDataSize.factor / targetDataSize.factor);
        }

        /**
         * Returns a formatted string of attribute "groesse" of this object
         *
         * @param {string} [unit]          - Unit ("B", "KB", "MB", "GB", "TB"), see DATA_SIZE_UNITS
         * @param {number} [decimalPlaces] - Number of fixed digits after the decimal point
         * @returns {string}               - formatted string: "value unit", e.g. "2.61 GB"
         */
        getGroesseAsText(unit, decimalPlaces) {
            if (this.groesse === 0) {
                return "";
            }

            let value = this.groesse;

            const defaultDataSize = DATA_SIZE_UNITS.get("MB");
            let dataSize = DATA_SIZE_UNITS.get(unit);

            if (!dataSize) {
                for (dataSize of Array.from(DATA_SIZE_UNITS.values()).filter(ds => ds.factor >= defaultDataSize.factor)) {
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

                if (REGEX.DOKU.test(this.linkText)) {
                    return Beitrag.TYPEN.DOKU;
                }

                if (REGEX.SERIE.test(this.linkText)) {
                    return Beitrag.TYPEN.SERIE;
                }
                return Beitrag.TYPEN.NONE;
            });
        }

        get datum() {
            return _datum.getOrCompute(this, () => computeDatum(this.divElement, null));
        }

        get datumTag() {
            return new Date((this.datum || new Date(0)).setHours(0, 0, 0, 0));
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
    }

    return Beitrag;
})();