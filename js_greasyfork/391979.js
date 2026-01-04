// ==UserScript==
// @name         ParseUtil
// @namespace    hoehleg.userscripts.private
// @version      0.2
// @description  Utility methods for DOM and string parsing
// @author       Gerrit Höhle
// @grant        GM_xmlhttpRequest
// ==/UserScript==

/* jshint esnext: true */
const ParseUtil = {
    getPageAsync: (url, onSuccess, onError = () => {}) => {
        return GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: (resp) => {
                resp.html = new DOMParser().parseFromString(resp.responseText || "", 'text/html');
                switch (resp.status) {
                    case 200:
                    case 304:
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

    parseInt: (str, maxIntPlaces = 1, fallbackValue = null) => {
        let regex = "\\d";
        if (maxIntPlaces > 1) {
            regex += "{1," + maxIntPlaces + "}";
        }
        return ParseUtil.parseIntWithRegex(str, new RegExp(regex), fallbackValue);
    },

    parseFloat: (str, maxIntPlaces = 1, maxDecPlaces = 0, fallbackValue = null) => {
        let regex = "\\d";
        if (maxIntPlaces > 1) {
            regex += "{1," + maxIntPlaces + "}";
        }
        if (maxDecPlaces > 0) {
            regex += "\\s?[,\.]?\\s?\\d{0," + maxDecPlaces + "}";
        }
        return ParseUtil.parseFloatWithRegex(str, new RegExp(regex), fallbackValue);
    },

    parseIntWithRegex: (str, regex, fallbackValue = null) => {
        const match = ParseUtil.parseStrWithRegex(str, regex);
        const value = parseInt(match);
        return Number.isNaN(value) ? fallbackValue : value;
    },

    parseFloatWithRegex: (str, regex, fallbackValue = null) => {
        const match = ParseUtil.parseStrWithRegex(str, regex, "").replace(",",".");
        const value = parseFloat(match);
        return Number.isNaN(value) ? fallbackValue : value;
    },

    parseStrWithRegex: (str, regex, fallbackValue = null) => {
        const match = regex.exec(str || "");
        return (match && match.length >= 1) ? match[0] : fallbackValue;
    }
};