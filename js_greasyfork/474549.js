// ==UserScript==

// #region Info

// @namespace   https://greasyfork.org/en/users/1123632-93akkord
// @exclude     *
// @author      Michael Barros (https://greasyfork.org/en/users/1123632-93akkord)
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuNvyMY98AAA5DSURBVGhDtVr5T1zXGeVviPJDq/bHNq2ZN8MyrGEx4C2JY6tqo+SXRGoVKYqqSlXaqFUjNUlTRXWUWE5iXC/YmNWAjdmXGRgDNruNYciwG4aBYR0wY+x4AWbe1/PdN282PwO21HGO333bfed893zfve85Efx7q6zrpd9UDX32er295bDZ2f6GeVbgdZMT4G1Q2+zwbWfbD6F9SGydvu1s+0GcU3HAh5B2fTgc7QeALLSzGmfbM4GsRuwD+8RWOZaB84y06smW/RUTnx7MMb0kyB860/jT1xrvjO+3LFGWZZmymhcps3kB4C3vL9E+XzsT7UzLImU0LVEGjqVb5gFscVy0cV9a0wKlmucFXjUvUopZ2ed2MpCE/cRwmOYpqWGREoGERmwbcaxxnuJxPN60II7FNywIxKFtNK1Qaq19ZG92608iDtYO5WSBRNa1ZcpgQEQGxDCYNO/vBQTJHZAGpEIckw1HcpMiIBmEkkxLfiSCEBPUQrwpgDiIMjYuUYxpmWLNAO5NLx/PicismZrLsLhE9DMF+TABwN4wolpIw4ikgmTKjgIwCir55xKAyPsEGCGAkVA1MRuRWe9wZzSv+CzyNIRdAC3SwUiFfVJgHy3yDFVAcPS1SAcjOPpxIM8CYnkLEXEQEFcz5Y7IUgXARsLjKnGArbOb6DPYOikgqUWeoWUhLdKM4MirApi8H75RSKix7yxAi6wWhIAw0sF4UQFK9BeUyAcJ4DxIqMYI7K+3uzObXX7iDBH5XZIX3od9tEgzBHGAq08S9lXyuxGgkg8XwO0Y3B9fBQH7ICDDJ2C3CasiDYme6kteLfIMvwAQEsCx5xPA20VBWkWMELAMAWyhBghAFRKR1yC5HRQBin20yDMCApg0C9i9hQICAuQDgIAKhxtVaNK9F+S1CD4LPFmlgdTufL/w3LVfbW8nwCgEzLyoALXmaxNXoQgAOPLPIUAAbVWA6vtQAZwDYgSmnluAv2Q28RJh+wROMgeIP5cAgAUYcSycPCewP4l3OwK7tQ1DjbwgzFuI1CKrBZW4gkDV0RYwqQhI36UAts12FUfF/1uACiEgYwcBXGlEtQmxzdOkVTB5tR1sGy2ywQi3DkOLdDB8AqZ2ELCMycoF8iwCiauuebD/qtlFqajHDEGaI++LfrKPeDLO8Qgkm+boVZBKQvVIwHGxkGNhPtJCBKCQ5y28j+MxAFecuIYlHzAL7yRA+B1E0zFJHb3uoqNtynkeAbFo45nX5KTqmfv0w+ojKpx0UXLDrCiZwXVeRB4l9JOBVbLefUgDdx/RG/UOsfYPnH+WAJDEvTF4L/hL3yIN4l6+/6jJIcizMDGRZWAtxETTEWWOdBomNcUu8/Rep5Mey0SbRPRp7xyi5xTR57qeXDdLI2uPCaepY85FUUUDlFg/I84FC0isX6DjtmXy4rot4LXLt8hYOY3VpM8+PgEKEGGQM6LN5IWIeid9YV0Uz9nEX0eqhshYNYXzeNkRAuocbl7PpGEU0ppgB0EeD4fyCxNruE35tcy4yFDSBxs4QRJvULUzNIyICAFOF0m5PaQrGaSEBuQIHpwMCFJ1c/Q1CPDPAxws7SF98QAZq+/4vK++dYE87BYHESwgxjwHu6CMVjvo84EFkmUvbeFhh8ut4DFEUTXTEIAyml7rcLM1uDSqEH6uddD4+gYJhsD61hal5neQvnQIr34zlIQOhlYf+gXoLnSRruA2RV8aJIwq7aufpfRGPKTGTl/1z4lOPMCB4i4I6KOokn5KqR7DtTOUiWuT6+cFcUY8bJTR6KDfWpy0t2qE/tXH92ME8bAjLOCSjfZcGaPYKyPuiFQI4MkoFTf6yaODd6/N0hMZj8RNMv7y4s/HljGKzMPDy2yUUDFOw34By6Q/30VSwS26MOKkex6Z3F6ZTlqn5JjSH+ir27O4DhEUAjrJUNhLHzQN0+qml9bRwa3V+5RZOYJknaFUiM8bWxV98PXr2I6sPRAC0KQ3Lw+QoXgQAoZJX2LVFpCAhDw94hKPnFt/IPc55mXCEJqmFkm62CmISgU3aWjlR3QrU+fsMkWfa6Fsq528uI5RPmz3Rp+7Lu+52EvHeibFdTwC+ws76L2afnI/AT0Exu5+KB8qaJP1Rf1kuDJEZ8dWxHUcuU3gsdcr9jlQqoCoYivpcG2IABF5QCQhhn3kHicoiFinvMeuDcgIKN19vEnJBbBAQQ9F5naSzXWfA0NdM4t0vGcMyc53EJlGZ7zRZ8xe6WIHRV7spv90T4jrtkDoT9W95EI/TMZ1/0f5SH6rR3+xiyIL+yi1tJ/WNjhTvDSwuCof/G/lVkZ29Vbr9Dx3GyRgkKTwEVAFcPK+Y3HAPmwamf5Y2e19M9dCG2wjJtAE5XndpDvfTkOude6X7m8wITwDD+hyLHhjTpm8ugsdZMB1Ul4PHWMBOIf/aH1DifzKoyf0O5CXzt/AaPaQVHSLPjSNKpbFk/9ce1OWTlso8vQ1+mfrkDiuCtAjz0IF8MTE0cfCK7HBSdlDKFu4YxOkznUOyd/esNH9TcQXHVSMz5H+QjtJOTdo2HVPYeX78UAX2ablyJxWIdKQ30sScKxLGQH/D/c43A8oLbcdOYXrim+LxP779SnRHY/B0bJ20uXewEi30+cdd8RtqgAJ1U4qH0YyswCU0RSUUfY/z5BJSCKb+yFGUYzaU7/5xxuUgI6lnOs0vBwQ8ACjwKI9wD/aRklf2ENRhUquHOtWCPCIPsQIsJWYZOvsKkXhfNQlK2zRTx9fGxfHeb54pwLFIh8lN6+XvujkHFIEHLliJQmFgUdACEiBgGSenCCAZ8K3mh2wC5OXaXzprrdzet7TMb3gsc6tIA0Uj79fP0i6nDayCQEyTbrW5H0ny7Ym7q7jTpnWUF3erkC1KLqJfMEIqAJA4PdFTVv5N0fZjejLS9+hQhlAngW8c7WPNvgp6OWbW1MkIS+kgn46dtMu4sTC3kQZVQQgSEJArd0tpn/YJ75+jk7YlElnCx0dPGP26I5XyhKQ8F29d+0Jz8lEpaNOMpxtoUEIYEkd9gV5z7d19HbhNe/DTXgcKifcP1JKaS9s1OXPAa7j+842yTHf18jWxRXWQI/wnA8tmJiK+siIwjDkWhMjeW/TQ6dQ1U72zdLqI8xH6IAFvHEVFajUBgFjsBIEvFrjcCci+rywiqudxprlEXOkkZV78p7sGvr1KQvtQTL9KtuMMqpMKAsPNsh45poQwKW2bXaJ9KfMpMu20Il2m5dtxOSq7asUndtLxzkHcIAtcCDvOhlON9ORglavSGiInQfBQ1d6hNh3r/TK95BvXDp5xGTctIX5iIsp93u4oh8jgAQun8CkOsgCZhQBsM/euikqGJjyFg9MeP5ad9OrQ4XQ53aRgcscqs77Vb1ykXXSkzcw6dmfd0P+un3YW2S94/mybcgbhZzQc0U53SSf7B7xXMJ1BcDh8pvyH6r75IKBO558XJuc3ylK6x4Ugg9rur3FuKbIOuX5pGVYjobn9+R10eGCZk9J/4Snd8blvYrzH1V0eopwfyHa6aWw1eWxYAEOWMj3RRjrm1isM3TnWlEmQQYPYg9HFcLLXFEuYBI710bS2TYyMGG0BXLacR4Jh4SMhGAujXq+5hy2EC/BGhKukc53wNPoB8mtB6IwexvOtWOL80WwGy8xYCUpF8/F9bqTzbLhdIvvOddxXTdyhf0P+6gCkqodbl4RipUh1iOxdQ4ylo+L5NEjicQMiQQzFN0WFUWX302RIKsTwHyALR/n83ydHlsdCwFRHSch9wHouCJha8BCzoA6rkcp5L6lQvQL6EtwHMlpgL/1l/g4RBbwvXwfAghxhhL4//II6Zjf1Tt8vTsisdoOAYFXPv4Gn9CAlSAWayhTYuXI4AdzpeCaLUgIoHpcwnEug6WDAYCcAYgqsQE/iGOiLyZ9GRNhmQ9oS1hX6QDDZZRFkNNzdbk8inYopCsgLcDRHyd9BQSUQUAS1tQJsI8qIBjGOqdIGAkkWL0gBiIKuA1ygmQo9BzFcDBxkNQzySBwOZTKgwmGgqOtQro6IWBA9PUVkwEB7H8tAQLICz1EcESVIeaIMnFt8gYghDiiKyDIKwKkYAgBiKoGeYEwARx5Ju8XkLyTAMCIty8DD7mPlBZxRjh5cY+IPCMo6oDwMrfZElrEVfjJB4iHCAjPAUbgFS8AI146+MHhAjjpGE8LCCUdTpyhLwN5lERN4oAg7o98KPkQAeo/pG0nIN48T3F1sBMeHC5AFaW2BUT0txOAZBUCQkkHI9j3OwrQJB0E9VuNERUqumyEohFhRihpIMwuKoIjL5J2F4mrZRuByiky4MU+uszmjkjAi3GwAIWo8nUgFPx9RkE8EjsKQ294UQHC99rW2ck2AhCgDwjgEQiNsraAoM98EByDnIjiqvLCAkKJq9jJNgLBAuIr7G7lQxIT931Q2iWi6+ZBCGR4rmCUhdb5ENLCNtsTV8kHl8pQgHiFHQKmIWAaAoYDApgQR3i7j6laMNY78YINYiAvITe0BajkdxP57cj7UAkRVXYIGIWFKibmOPoxjfzNMfDdcdeA9aKR2KJec2V5SsAosLvIP5s8A6SFALQrAVgo5pLVGRF9sTc3FgKYPP/jmSbJnYCciMVkJ10FEV+F4TWNUmmeTV7Ab5tgsloICJCqsV/lwOr0xvmIX/zt2M+ji/sn+csv/6OBMgrPCb6PRcBO+gpE0i9gB/IMLIt3K0ACDLBOFPwfe773zi8/Ov4z8X+svPLBNy8bjtd8GZXbbonJ7+18EURf7OrRn2m16k+1WA3Zptv6E3WD0vfm29KJepv03dPQAZHfY3uywSadbNwWOgGTLTK72Rp9utUifVP571c++OzliIiIiP8B4VfIttF+iOkAAAAASUVORK5CYII=

// #endregion Info

// ==UserLibrary==

// @name        akkd-common
// @description Common functions
// @copyright   2022+, Michael Barros (https://greasyfork.org/en/users/1123632-93akkord)
// @license     CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
// @license     GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0.txt
// @version     0.0.20

// ==/UserScript==

// ==/UserLibrary==

// ==OpenUserJS==

// @author      93Akkord

// ==/OpenUserJS==

/// <reference path='C:/Users/mbarros/Documents/DevProjects/Web/Tampermonkey/Palantir/@types/__fullReferencePaths__.js' />

/*

# akkd-common

A collection of commonly used classes and functions.

## Required requires:

- https://code.jquery.com/jquery-3.2.1.min.js
- https://greasyfork.org/scripts/474546-loglevel/code/loglevel.js

*/

// #region Events

// Setup location change events
/**
 *
 * Example usage:
 * ```javascript
 * window.addEventListener('popstate', () => {
 *     window.dispatchEvent(new Event('locationchange'));
 * });
 */
(() => {
    class LocationChangeEvent extends Event {
        constructor(type, prevUrl, newUrl) {
            super(type);

            this.prevUrl = prevUrl;
            this.newUrl = newUrl;
        }
    }

    let prevUrl = document.location.href;
    let oldPushState = history.pushState;

    history.pushState = function pushState() {
        let ret = oldPushState.apply(this, arguments);
        let newUrl = document.location.href;

        window.dispatchEvent(new LocationChangeEvent('pushstate', prevUrl, newUrl));
        window.dispatchEvent(new LocationChangeEvent('locationchange', prevUrl, newUrl));

        prevUrl = newUrl;

        return ret;
    };

    let oldReplaceState = history.replaceState;

    history.replaceState = function replaceState() {
        let ret = oldReplaceState.apply(this, arguments);
        let newUrl = document.location.href;

        window.dispatchEvent(new LocationChangeEvent('replacestate', prevUrl, newUrl));
        window.dispatchEvent(new LocationChangeEvent('locationchange', prevUrl, newUrl));

        prevUrl = newUrl;

        return ret;
    };

    window.addEventListener('popstate', () => {
        let newUrl = document.location.href;

        window.dispatchEvent(new LocationChangeEvent('locationchange', prevUrl, newUrl));

        prevUrl = newUrl;
    });
})();

// #endregion Events

// #region Helper Classes

class Logger {
    /**
     * Creates an instance of Logger.
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @param {Window} _window
     * @param {string | null} devTag
     * @memberof Logger
     */
    constructor(_window = null, devTag = null) {
        /**
         * @type {Window}
         * @private
         */
        this.window = _window || getWindow();

        /** @type {string | null} */
        this.devTag = devTag;

        /** @type {string[]} */
        this._additionalTags = [];
    }

    /**
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @type {string[]}
     * @public
     * @memberof Logger
     */
    get additionalTags() {
        return this._additionalTags;
    }

    /**
     *
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @param {string[]} value
     * @memberof Logger
     */
    set additionalTags(value) {
        if (getType(value) != 'array') {
            value = [value];
        }

        this._additionalTags = value;
    }

    /** @type {string} */
    get label() {
        return [].concat([this.devTag], this.additionalTags).join(' ');
    }

    /** @type {(...data: any[]) => void} */
    get log() {
        if (this.devTag) {
            return console.log.bind(console, `${this.label}`);
        } else {
            return console.log.bind(console);
        }
    }

    /** @type {(...data: any[]) => void} */
    get info() {
        if (this.devTag) {
            return console.info.bind(console, `${this.label}`);
        } else {
            return console.info.bind(console);
        }
    }

    /** @type {(...data: any[]) => void} */
    get error() {
        if (this.devTag) {
            return console.error.bind(console, `${this.label}`);
        } else {
            return console.error.bind(console);
        }
    }

    /** @type {(...data: any[]) => void} */
    get debug() {
        if (this.devTag) {
            return console.debug.bind(console, `${this.label}`);
        } else {
            return console.debug.bind(console);
        }
    }

    /** @type {(...data: any[]) => void} */
    get warn() {
        if (this.devTag) {
            return console.warn.bind(console, `${this.label}`);
        } else {
            return console.warn.bind(console);
        }
    }

    /**
     * Maybe use later?
     *
     * @memberof Logger
     */
    _setupFunctions() {
        let self = this;
        let funcs = ['log', 'info', 'error', 'debug', 'warn'];

        for (let i = 0; i < funcs.length; i++) {
            let func = funcs[i];

            self[func] = function () {
                let args = [...arguments];

                if (self.devTag) args.unshift(self.label);

                self.window.console.debug.bind(self.window.console, ...args);
            };
        }
    }
}

class Base64 {
    static keyStr = 'ABCDEFGHIJKLMNOP' + 'QRSTUVWXYZabcdef' + 'ghijklmnopqrstuv' + 'wxyz0123456789+/' + '=';

    /**
     *
     *
     * @static
     * @param {string} input
     * @returns {string}
     * @memberof Base64
     */
    static encode(input) {
        input = escape(input);

        let output = '';

        let chr1;
        let chr2;
        let chr3 = '';

        let enc1;
        let enc2;
        let enc3;
        let enc4 = '';

        let i = 0;

        do {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output + Base64.keyStr.charAt(enc1) + Base64.keyStr.charAt(enc2) + Base64.keyStr.charAt(enc3) + Base64.keyStr.charAt(enc4);
            chr1 = chr2 = chr3 = '';
            enc1 = enc2 = enc3 = enc4 = '';
        } while (i < input.length);

        return output;
    }

    /**
     *
     *
     * @static
     * @param {string} input
     * @returns {string}
     * @memberof Base64
     */
    static decode(input) {
        let output = '';

        let chr1;
        let chr2;
        let chr3 = '';

        let enc1;
        let enc2;
        let enc3;
        let enc4 = '';

        let i = 0;

        let base64test = /[^A-Za-z0-9\+\/\=]/g;

        if (base64test.exec(input)) {
            throw new Error(`There were invalid base64 characters in the input text. Valid base64 characters are: ['A-Z', 'a-z', '0-9,' '+', '/', '=']`);
        }

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');

        do {
            enc1 = Base64.keyStr.indexOf(input.charAt(i++));
            enc2 = Base64.keyStr.indexOf(input.charAt(i++));
            enc3 = Base64.keyStr.indexOf(input.charAt(i++));
            enc4 = Base64.keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) output = output + String.fromCharCode(chr2);

            if (enc4 != 64) output = output + String.fromCharCode(chr3);

            chr1 = chr2 = chr3 = '';
            enc1 = enc2 = enc3 = enc4 = '';
        } while (i < input.length);

        return unescape(output);
    }
}

class MultiRegExp {
    constructor(baseRegExp) {
        const { regexp, groupIndexMapper, previousGroupsForGroup } = this._fillGroups(baseRegExp);

        this.regexp = regexp;
        this.groupIndexMapper = groupIndexMapper;
        this.previousGroupsForGroup = previousGroupsForGroup;
    }

    execForAllGroups(str, includeFullMatch) {
        let matches = RegExp.prototype.exec.call(this.regexp, str);

        if (!matches) return matches;

        let firstIndex = matches.index;
        let indexMapper = includeFullMatch
            ? Object.assign(
                  {
                      0: 0,
                  },
                  this.groupIndexMapper
              )
            : this.groupIndexMapper;
        let previousGroups = includeFullMatch
            ? Object.assign(
                  {
                      0: [],
                  },
                  this.previousGroupsForGroup
              )
            : this.previousGroupsForGroup;

        let res = Object.keys(indexMapper).map((group) => {
            let mapped = indexMapper[group];
            let match = matches[mapped];
            let start = firstIndex + previousGroups[group].reduce((sum, i) => sum + (matches[i] ? matches[i].length : 0), 0);
            let end = start + (matches[mapped] ? matches[mapped].length : 0);
            let lineColumnStart = LineColumnFinder(str).fromIndex(start);
            let lineColumnEnd = LineColumnFinder(str).fromIndex(end - 1);

            return {
                match,
                start,
                end,
                startLineNumber: lineColumnStart.line,
                startColumnNumber: lineColumnStart.col,
                endLineNumber: lineColumnEnd.line,
                endColumnNumber: lineColumnEnd.col,
            };
        });

        return res;
    }

    execForGroup(string, group) {
        const matches = RegExp.prototype.exec.call(this.regexp, string);

        if (!matches) return matches;

        const firstIndex = matches.index;

        const mapped = group == 0 ? 0 : this.groupIndexMapper[group];
        const previousGroups = group == 0 ? [] : this.previousGroupsForGroup[group];

        let r = {
            match: matches[mapped],
            start: firstIndex + previousGroups.reduce((sum, i) => sum + (matches[i] ? matches[i].length : 0), 0),
        };

        r.end = r.start + (matches[mapped] ? matches[mapped].length : 0);

        return r;
    }

    /**
     * Adds brackets before and after a part of string
     * @param str string the hole regex string
     * @param start int marks the position where ( should be inserted
     * @param end int marks the position where ) should be inserted
     * @param groupsAdded int defines the offset to the original string because of inserted brackets
     * @return {string}
     */
    _addGroupToRegexString(str, start, end, groupsAdded) {
        start += groupsAdded * 2;
        end += groupsAdded * 2;

        return str.substring(0, start) + '(' + str.substring(start, end + 1) + ')' + str.substring(end + 1);
    }

    /**
     * converts the given regex to a regex where all not captured string are going to be captured
     * it along sides generates a mapper which maps the original group index to the shifted group offset and
     * generates a list of groups indexes (including new generated capturing groups)
     * which have been closed before a given group index (unshifted)
     *
     * Example:
     * regexp: /a(?: )bc(def(ghi)xyz)/g => /(a(?: )bc)((def)(ghi)(xyz))/g
     * groupIndexMapper: {'1': 2, '2', 4}
     * previousGroupsForGroup: {'1': [1], '2': [1, 3]}
     *
     * @param regex RegExp
     * @return {{regexp: RegExp, groupIndexMapper: {}, previousGroupsForGroup: {}}}
     */
    _fillGroups(regex) {
        let regexString;
        let modifier;

        if (regex.source && regex.flags) {
            regexString = regex.source;
            modifier = regex.flags;
        } else {
            regexString = regex.toString();
            modifier = regexString.substring(regexString.lastIndexOf(regexString[0]) + 1); // sometimes order matters ;)
            regexString = regexString.substr(1, regex.toString().lastIndexOf(regexString[0]) - 1);
        }

        // regexp is greedy so it should match (? before ( right?
        // brackets may be not quoted by \
        // closing bracket may look like: ), )+, )+?, ){1,}?, ){1,1111}?
        const tester = /(\\\()|(\\\))|(\(\?)|(\()|(\)(?:\{\d+,?\d*}|[*+?])?\??)/g;

        let modifiedRegex = regexString;

        let lastGroupStartPosition = -1;
        let lastGroupEndPosition = -1;
        let lastNonGroupStartPosition = -1;
        let lastNonGroupEndPosition = -1;
        let groupsAdded = 0;
        let groupCount = 0;
        let matchArr;
        const nonGroupPositions = [];
        const groupPositions = [];
        const groupNumber = [];
        let currentLengthIndexes = [];
        const groupIndexMapper = {};
        const previousGroupsForGroup = {};

        while ((matchArr = tester.exec(regexString)) !== null) {
            if (matchArr[1] || matchArr[2]) {
                // ignore escaped brackets \(, \)
            }

            if (matchArr[3]) {
                // non capturing group (?
                let index = matchArr.index + matchArr[0].length - 1;

                lastNonGroupStartPosition = index;
                nonGroupPositions.push(index);
            } else if (matchArr[4]) {
                // capturing group (
                let index = matchArr.index + matchArr[0].length - 1;
                let lastGroupPosition = Math.max(lastGroupStartPosition, lastGroupEndPosition);

                // if a (? is found add ) before it
                if (lastNonGroupStartPosition > lastGroupPosition) {
                    // check if between ) of capturing group lies a non capturing group
                    if (lastGroupPosition < lastNonGroupEndPosition) {
                        // add groups for x1 and x2 on (?:()x1)x2(?:...
                        if (lastNonGroupEndPosition - 1 - (lastGroupPosition + 1) > 0) {
                            modifiedRegex = this._addGroupToRegexString(modifiedRegex, lastGroupPosition + 1, lastNonGroupEndPosition - 1, groupsAdded);
                            groupsAdded++;
                            lastGroupEndPosition = lastNonGroupEndPosition - 1; // imaginary position as it is not in regex but modifiedRegex
                            currentLengthIndexes.push(groupCount + groupsAdded);
                        }

                        if (lastNonGroupStartPosition - 1 - (lastNonGroupEndPosition + 1) > 0) {
                            modifiedRegex = this._addGroupToRegexString(modifiedRegex, lastNonGroupEndPosition + 1, lastNonGroupStartPosition - 2, groupsAdded);
                            groupsAdded++;
                            lastGroupEndPosition = lastNonGroupStartPosition - 1; // imaginary position as it is not in regex but modifiedRegex
                            currentLengthIndexes.push(groupCount + groupsAdded);
                        }
                    } else {
                        modifiedRegex = this._addGroupToRegexString(modifiedRegex, lastGroupPosition + 1, lastNonGroupStartPosition - 2, groupsAdded);
                        groupsAdded++;
                        lastGroupEndPosition = lastNonGroupStartPosition - 1; // imaginary position as it is not in regex but modifiedRegex
                        currentLengthIndexes.push(groupCount + groupsAdded);
                    }

                    // if necessary also add group between (? and opening bracket
                    if (index > lastNonGroupStartPosition + 2) {
                        modifiedRegex = this._addGroupToRegexString(modifiedRegex, lastNonGroupStartPosition + 2, index - 1, groupsAdded);
                        groupsAdded++;
                        lastGroupEndPosition = index - 1; // imaginary position as it is not in regex but modifiedRegex
                        currentLengthIndexes.push(groupCount + groupsAdded);
                    }
                } else if (lastGroupPosition < index - 1) {
                    modifiedRegex = this._addGroupToRegexString(modifiedRegex, lastGroupPosition + 1, index - 1, groupsAdded);
                    groupsAdded++;
                    lastGroupEndPosition = index - 1; // imaginary position as it is not in regex but modifiedRegex
                    currentLengthIndexes.push(groupCount + groupsAdded);
                }

                groupCount++;
                lastGroupStartPosition = index;
                groupPositions.push(index);
                groupNumber.push(groupCount + groupsAdded);
                groupIndexMapper[groupCount] = groupCount + groupsAdded;
                previousGroupsForGroup[groupCount] = currentLengthIndexes.slice();
            } else if (matchArr[5]) {
                // closing bracket ), )+, )+?, ){1,}?, ){1,1111}?
                let index = matchArr.index + matchArr[0].length - 1;

                if ((groupPositions.length && !nonGroupPositions.length) || groupPositions[groupPositions.length - 1] > nonGroupPositions[nonGroupPositions.length - 1]) {
                    if (lastGroupStartPosition < lastGroupEndPosition && lastGroupEndPosition < index - 1) {
                        modifiedRegex = this._addGroupToRegexString(modifiedRegex, lastGroupEndPosition + 1, index - 1, groupsAdded);
                        groupsAdded++;

                        //lastGroupEndPosition = index - 1; will be set anyway
                        currentLengthIndexes.push(groupCount + groupsAdded);
                    }

                    groupPositions.pop();
                    lastGroupEndPosition = index;

                    let toPush = groupNumber.pop();
                    currentLengthIndexes.push(toPush);
                    currentLengthIndexes = currentLengthIndexes.filter((index) => index <= toPush);
                } else if (nonGroupPositions.length) {
                    nonGroupPositions.pop();
                    lastNonGroupEndPosition = index;
                }
            }
        }

        return {
            regexp: new RegExp(modifiedRegex, modifier),
            groupIndexMapper,
            previousGroupsForGroup,
        };
    }
}

class MoveableElement {
    /**
     * Creates an instance of MoveableElement.
     * @param {HTMLElement} element
     * @param {boolean} requireKeyDown
     * @memberof MoveableElement
     */
    constructor(element, requireKeyDown) {
        this.element = element;
        this.requireKeyDown = requireKeyDown || false;
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);

        this.moving = false;
        this.keyPressed = false;
        this.originalCursor = getStyle(this.element, 'cursor');

        this.setupEvents();
    }

    setupEvents() {
        if (!document.body) {
            setTimeout(() => {
                this.setupEvents();
            }, 250);
        } else {
            document.body.addEventListener('keydown', (ev) => {
                if (ev.which == '17') {
                    this.keyPressed = true;
                }
            });

            document.body.addEventListener('keyup', (ev) => {
                this.keyPressed = false;
            });
        }
    }

    /**
     *
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @param {MouseEvent} ev
     * @memberof MoveableElement
     */
    handleMouseDown(ev) {
        if (this.keyPressed || !this.requireKeyDown) {
            ev.preventDefault();

            this.element.style.cursor = 'move';

            this.changePointerEvents('none');

            document.body.removeEventListener('mouseup', this.handleMouseUp);
            document.body.addEventListener('mouseup', this.handleMouseUp);

            document.body.removeEventListener('mousemove', this.handleMouseMove);
            document.body.removeEventListener('mouseleave', this.handleMouseUp);

            document.body.addEventListener('mousemove', this.handleMouseMove);
            document.body.addEventListener('mouseleave', this.handleMouseUp);

            try {
                document.querySelectorAll('iframe')[0].style.pointerEvents = 'none';
            } catch (error) {}
        }
    }

    changePointerEvents(value) {
        for (let i = 0; i < this.element.children.length; i++) {
            const child = this.element.children[i];

            child.style.pointerEvents = value;
        }
    }

    /**
     *
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @param {MouseEvent} ev
     * @memberof MoveableElement
     */
    handleMouseUp(ev) {
        this.moving = false;
        this.element.style.cursor = this.originalCursor;
        this.changePointerEvents('auto');

        document.body.removeEventListener('mouseup', this.handleMouseUp);
        document.body.removeEventListener('mousemove', this.handleMouseMove);
        document.body.removeEventListener('mouseleave', this.handleMouseUp);

        try {
            document.querySelectorAll('iframe')[0].style.pointerEvents = '';
        } catch (error) {}
    }

    /**
     *
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @param {MouseEvent} ev
     * @memberof MoveableElement
     */
    handleMouseMove(ev) {
        this.moving = true;

        let top = ev.clientY - getStyle(this.element, 'height') / 2;
        let bottom = ev.clientX - getStyle(this.element, 'width') / 2;

        this.element.style.top = `${top}px`;
        this.element.style.left = `${bottom}px`;
    }

    padCoord(coord) {
        return coord.toString().padStart(5, ' ');
    }

    init() {
        this.element.addEventListener('mousedown', this.handleMouseDown);
    }
}

class CurrentLine {
    /**
     * @typedef ILineInfo
     * @prop {string} method
     * @prop {number} line
     * @prop {string} file
     * @prop {string} filename
     */

    /**
     * Returns a single item
     *
     * @param {number} [level] Useful to return levels up on the stack. If not informed, the first (0, zero index) element of the stack will be returned
     * @returns {ILineInfo}
     */
    get(level = 0) {
        const stack = getStack();
        const i = Math.min(level + 1, stack.length - 1);
        const item = stack[i];
        const result = CurrentLine.parse(item);

        return result;
    }

    /**
     * Returns all stack
     *
     * @returns {ILineInfo[]}
     */
    all() {
        const stack = getStack();
        const result = [];

        for (let i = 1; i < stack.length; i++) {
            const item = stack[i];

            result.push(CurrentLine.parse(item));
        }

        return result;
    }

    /**
     *
     *
     * @param {NodeJS.CallSite} item
     * @returns {ILineInfo}
     */
    static parse(item) {
        const result = {
            method: item.getMethodName() || item.getFunctionName(),
            line: item.getLineNumber(),
            file: item.getFileName() || item.getScriptNameOrSourceURL(),
        };

        result.filename = result.file ? result.file.replace(/^.*\/|\\/gm, '').replace(/\.\w+$/gm, '') : null;

        return result;
    }
}

/**
 *
 *
 * @returns {NodeJS.CallSite[]}
 */
function getStack() {
    const orig = Error.prepareStackTrace;

    Error.prepareStackTrace = function (_, stack) {
        return stack;
    };

    const err = new Error();

    Error.captureStackTrace(err, arguments.callee);

    const stack = err.stack;

    Error.prepareStackTrace = orig;

    return stack;
}

class ProgressTimer {
    /**
     * Creates an instance of ProgressTimer.
     * @param {number} total
     * @memberof ProgressTimer
     */
    constructor(total) {
        this.startTime;
        this.total = total;
        this.loaded = 0;
        this.estimatedFinishDt = '';
        this.progressMessage = '';
    }

    /**
     *
     *
     * @memberof ProgressTimer
     */
    start() {
        this.startTime = new Date();
    }

    /**
     *
     *
     * @param {number} loaded
     * @param {string} msg
     * @memberof ProgressTimer
     */
    updateProgress(loaded, msg) {
        this.loaded = loaded;

        this.progress = `${((this.loaded * 100) / this.total).toFixed(2)}%`;
        this.timeRemaining = this._estimatedTimeRemaining(this.startTime, this.loaded, this.total);
        this.downloaded = `${this.loaded}/${this.total}`;
        this.completionTime = `${this._dateToISOLikeButLocal(this.estimatedFinishDt)}`;
        this.totalRuntime = `${this._ms2Timestamp(this.timeTaken)}`;

        this.updateProgressMessage(msg);
        this.printProgress();
    }

    /**
     *
     *
     * @param {string} msg
     * @memberof ProgressTimer
     */
    updateProgressMessage(msg) {
        let msgLines = [];

        msgLines.push(`      completed: ${this.progress}`);
        msgLines.push(`     downloaded: ${this.downloaded}`);
        msgLines.push(`  total runtime: ${this.totalRuntime}`);
        msgLines.push(` time remaining: ${this.timeRemaining}`);
        msgLines.push(`completion time: ${this.completionTime}`);

        if (msg) {
            msgLines.push(msg);
        }

        this.progressMessage = msgLines.join('\n');
    }

    /**
     *
     *
     * @memberof ProgressTimer
     */
    printProgress() {
        console.clear();
        console.debug(this.progressMessage);
    }

    /**
     *
     *
     * @param {Date} startTime
     * @param {number} itemsProcessed
     * @param {number} totalItems
     * @returns {string}
     * @memberof ProgressTimer
     */
    _estimatedTimeRemaining(startTime, itemsProcessed, totalItems) {
        // if (itemsProcessed == 0) {
        //     return '';
        // }

        let currentTime = new Date();
        this.timeTaken = currentTime - startTime;
        this.timeLeft = itemsProcessed == 0 ? this.timeTaken * (totalItems - itemsProcessed) : (this.timeTaken / itemsProcessed) * (totalItems - itemsProcessed);
        this.estimatedFinishDt = new Date(currentTime.getTime() + this.timeLeft);

        return this._ms2Timestamp(this.timeLeft);
    }

    /**
     *
     *
     * @param {number} ms
     * @returns {string}
     * @memberof ProgressTimer
     */
    _ms2Timestamp(ms) {
        // 1- Convert to seconds:
        let seconds = ms / 1000;

        // 2- Extract hours:
        let hours = parseInt(seconds / 3600); // 3,600 seconds in 1 hour
        seconds = seconds % 3600; // seconds remaining after extracting hours

        // 3- Extract minutes:
        let minutes = parseInt(seconds / 60); // 60 seconds in 1 minute

        // 4- Keep only seconds not extracted to minutes:
        seconds = seconds % 60;

        let parts = seconds.toString().split('.');

        seconds = parseInt(parts[0]);
        let milliseconds = parts.length > 1 ? parts[1].substring(0, 3).padEnd(3, 0) : '000';

        hours = hours.toString().padStart(2, '0');
        minutes = minutes.toString().padStart(2, '0');
        seconds = seconds.toString().padStart(2, '0');

        return `${hours}:${minutes}:${seconds}.${milliseconds}`; // hours + ':' + minutes + ':' + seconds;
    }

    /**
     *
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @param {Date} date
     * @returns {string}
     * @memberof ProgressTimer
     */
    _dateToISOLikeButLocal(date) {
        let offsetMs = date.getTimezoneOffset() * 60 * 1000;
        let msLocal = date.getTime() - offsetMs;
        let dateLocal = new Date(msLocal);
        let iso = dateLocal.toISOString();
        let isoLocal = iso.slice(0, 19);

        return isoLocal.replace(/T/g, ' ');
    }
}

class Benchmark {
    constructor({ logger, printResults } = {}) {
        this.namedPerformances = {};
        this.defaultName = 'default';
        this.logger = logger;
        this.printResults = printResults == undefined ? (this.logger ? true : false) : printResults;
    }

    /**
     *
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @param {string=} name
     * @memberof Benchmark
     */
    start(name) {
        name = name || this.defaultName;

        this.namedPerformances[name] = {
            startAt: this._hrtime(),
        };
    }

    /**
     *
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @param {string=} name
     * @memberof Benchmark
     */
    stop(name) {
        name = name || this.defaultName;

        const startAt = this.namedPerformances[name] && this.namedPerformances[name].startAt;

        if (!startAt) throw new Error(`Namespace: ${name} doesnt exist`);

        const diff = this._hrtime(startAt);
        const time = diff[0] * 1e3 + diff[1] * 1e-6;
        const words = this.getWords(diff);
        const preciseWords = this.getPreciseWords(diff);
        const verboseWords = this.getVerboseWords(diff);
        const verboseAbbrWords = this.getVerboseAbbrWords(diff);

        if (this.printResults) {
            let output = name != 'default' ? `[${name}] execution time:` : `execution time:`;

            this.logger(output, time); // words
        }

        return {
            name,
            time,
            words,
            preciseWords,
            verboseWords,
            verboseAbbrWords,
            diff,
        };
    }

    /**
     *
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @param {T} func
     * @param {{name: string, measure: boolean}=} { name, measure }
     * @returns {T}
     * @memberof Benchmark
     * @template T
     */
    wrapFunc(func, { name, measure = true } = {}) {
        name = this._getFuncName(func, name);

        let self = this;

        wrappedFunc.measure = measure;
        wrappedFunc.benchmark = {
            name,
            results: {
                runs: [],
                avg: null,
                min: null,
                max: null,
                total: null,
                times: null,
                runCount: 0,
            },
            reset: function () {
                this.results.runs = [];
                this.results.avg = null;
                this.results.min = null;
                this.results.max = null;
                this.results.total = null;
                this.results.times = null;
                this.results.runCount = 0;
            },
            printResults: function (logger = console.debug) {
                let output = this.name != 'default' ? `[${this.name}] execution summary:` : `execution summary:`;

                let times = wrappedFunc.benchmark.results.runs.map((run) => {
                    return run.time;
                });

                wrappedFunc.benchmark.results.times = times;
                wrappedFunc.benchmark.results.avg = self._getAvgTime(times);
                wrappedFunc.benchmark.results.total = self._getSumTime(times);
                wrappedFunc.benchmark.results.min = Math.min(...times);
                wrappedFunc.benchmark.results.max = Math.max(...times);

                logger(output, `times: ${this.results.runCount}    total: ${self.getWords(this.results.total)}    min: ${self.getWords(this.results.min)}    max: ${self.getWords(this.results.max)}    avg: ${self.getWords(this.results.avg)}    total: ${self.getWords(this.results.total)}`);
            },
        };

        function wrappedFunc() {
            if (wrappedFunc.measure) {
                self.start(name);
            }

            let res = func(...arguments);

            if (wrappedFunc.measure) {
                wrappedFunc.benchmark.results.runCount++;

                wrappedFunc.benchmark.results.runs.push(self.stop(name));
            }

            return res;
        }

        return this._defineWrappedFuncProperties(wrappedFunc, name);
    }

    /**
     *
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @param {T} func
     * @param {{name: string, measure: boolean}=} { name, measure }
     * @returns {T}
     * @memberof Benchmark
     * @template T
     */
    wrapAsyncFunc(func, { name, measure = true } = {}) {
        name = this._getFuncName(func, name);

        let self = this;

        wrappedFunc.measure = measure;
        wrappedFunc.benchmark = {
            name,
            results: {
                runs: [],
                avg: null,
                min: null,
                max: null,
                total: null,
                times: null,
                runCount: 0,
            },
            reset: function () {
                this.results.runs = [];
                this.results.avg = null;
                this.results.min = null;
                this.results.max = null;
                this.results.total = null;
                this.results.times = null;
                this.results.runCount = 0;
            },
            printResults: function (logger = console.debug) {
                let output = this.name != 'default' ? `[${this.name}] execution summary:` : `execution summary:`;

                let times = wrappedFunc.benchmark.results.runs.map((run) => {
                    return run.time;
                });

                wrappedFunc.benchmark.results.times = times;
                wrappedFunc.benchmark.results.avg = self._getAvgTime(times);
                wrappedFunc.benchmark.results.total = self._getSumTime(times);
                wrappedFunc.benchmark.results.min = Math.min(...times);
                wrappedFunc.benchmark.results.max = Math.max(...times);

                logger(output, `times: ${this.results.runCount}    total: ${self.getWords(this.results.total)}    min: ${self.getWords(this.results.min)}    max: ${self.getWords(this.results.max)}    avg: ${self.getWords(this.results.avg)}    total: ${self.getWords(this.results.total)}`);
            },
        };

        async function wrappedFunc() {
            if (wrappedFunc.measure) {
                self.start(name);
            }

            let res = await func(...arguments);

            if (wrappedFunc.measure) {
                wrappedFunc.benchmark.results.runCount++;

                wrappedFunc.benchmark.results.runs.push(self.stop(name));
            }

            return res;
        }

        return this._defineWrappedFuncProperties(wrappedFunc, name);
    }

    getWords(diff) {
        let ms = typeof diff === 'number' ? diff : this._hrtime2Ms(diff);
        
        return this._msToHms(ms);

        // return this._prettyHrtime(diff);
    }

    getPreciseWords(diff) {
        return this._prettyHrtime(diff, { precise: true });
    }

    getVerboseWords(diff) {
        return this._prettyHrtime(diff, { verbose: true });
    }

    getVerboseAbbrWords(diff) {
        return this._prettyHrtime(diff, { verbose: true, verboseAbbrv: true, precise: true });
    }

    _msToHms(ms) {        
        // Extract days
        let days = Math.floor(ms / (86400 * 1000));
        ms %= (86400 * 1000);
        
        // Extract hours
        let hours = Math.floor(ms / (3600 * 1000));
        ms %= (3600 * 1000);
        
        // Extract minutes
        let minutes = Math.floor(ms / (60 * 1000));
        ms = ms % (60 * 1000);

        // Extract seconds
        let seconds = Math.floor(ms / 1000);
        ms = ms % 1000;

        let result = [];
        
        if (days > 0) {
            result.push(`${days} day${days === 1 ? '' : 's'}`);
        }
        
        if (hours > 0) {
            result.push(`${hours} hr${hours === 1 ? '' : 's'}`);
        }
        
        if (minutes > 0) {
            result.push(`${minutes} min${minutes === 1 ? '' : 's'}`);
        }
        
        if (seconds > 0) {
            result.push(`${seconds} sec${seconds === 1 ? '' : 's'}`);
        }

        if (ms > 0) {
            result.push(`${ms} ms`);
        }

        return result.join(', ');
    }

    /**
     *
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @param {number[][]} times
     * @returns {number}
     */
    _getAvgTime(times) {
        return this._getSumTime(times) / times.length;
    }

    /**
     *
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @param {number[][]} times
     * @returns {number}
     */
    _getSumTime(times) {
        return times.reduce((a, b) => a + b);
    }

    /**
     *
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @param {number} ms
     * @returns {number[][]}
     * @memberof Benchmark
     */
    _ms2Hrtime(ms) {
        let seconds = Math.round(ms / 1000);
        let nanoSeconds = Math.round(ms * 1000000 - seconds * 1000000 * 1000);

        return [seconds, nanoSeconds];
    }

    /**
     *
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @param {[number, number]} hrtime
     * @returns {number}
     * @memberof Benchmark
     */
    _hrtime2Ms(hrtime) {
        return hrtime[0] * 1000 + hrtime[1] / 1000000;
    }

    /**
     *
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @param {T} func
     * @param {string=} name
     * @returns {T}
     * @memberof Benchmark
     * @template T
     */
    _getFuncName(func, name) {
        return name ? name : 'name' in func && func.name.trim() !== '' ? func.name : '[wrapped.func]';
    }

    /**
     *
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @param {Function} wrappedFunc
     * @param {string} name
     * @returns {Function}
     * @memberof Benchmark
     */
    _defineWrappedFuncProperties(wrappedFunc, name) {
        Object.defineProperty(wrappedFunc, 'name', {
            value: name,
            writable: false,
            configurable: false,
            enumerable: false,
        });

        Object.defineProperty(wrappedFunc, 'toString', {
            value: () => func.toString(),
            writable: false,
            configurable: false,
            enumerable: false,
        });

        return wrappedFunc;
    }

    /**
     *
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @param {[number, number]=} time
     * @returns {[number, number]}
     * @memberof Benchmark
     */
    _hrtime(time) {
        if (typeof process !== 'undefined') return process.hrtime(time);

        var performance = typeof performance !== 'undefined' ? performance : {};
        let performanceNow = performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow || (() => new Date().getTime());

        let clocktime = performanceNow.call(performance) * 1e-3;
        let seconds = Math.floor(clocktime);
        let nanoseconds = Math.floor((clocktime % 1) * 1e9);

        if (time) {
            seconds = seconds - time[0];
            nanoseconds = nanoseconds - time[1];

            if (nanoseconds < 0) {
                seconds--;
                nanoseconds += 1e9;
            }
        }

        return [seconds, nanoseconds];
    }

    /**
     *
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @param {[number, number]=} time
     * @param {{verbose: boolean; verboseAbbrv: boolean; precise: boolean}} { verbose = false, verboseAbbrv = false, precise = false }
     * @returns {string}
     * @memberof Benchmark
     */
    _prettyHrtime(time, { verbose = false, verboseAbbrv = false, precise = false } = {}) {
        let i, spot, sourceAtStep, valAtStep, decimals, strAtStep, results, totalSeconds;

        let minimalDesc = ['h', 'min', 's', 'ms', 'μs', 'ns'];
        let verboseDesc = !verboseAbbrv ? ['hour', 'minute', 'second', 'millisecond', 'microsecond', 'nanosecond'] : minimalDesc;
        let convert = [60 * 60, 60, 1, 1e6, 1e3, 1];

        if (typeof time === 'number') {
            time = this._ms2Hrtime(time);
        }

        if (!Array.isArray(time) || time.length !== 2) return '';

        if (typeof time[0] !== 'number' || typeof time[1] !== 'number') return '';

        // normalize source array due to changes in node v5.4+
        if (time[1] < 0) {
            totalSeconds = time[0] + time[1] / 1e9;
            time[0] = parseInt(totalSeconds);
            time[1] = parseFloat((totalSeconds % 1).toPrecision(9)) * 1e9;
        }

        results = '';

        for (i = 0; i < 6; i++) {
            // grabbing first or second spot in source array
            spot = i < 3 ? 0 : 1;
            sourceAtStep = time[spot];

            if (i !== 3 && i !== 0) {
                // trim off previous portions
                sourceAtStep = sourceAtStep % convert[i - 1];
            }

            if (i === 2) {
                // get partial seconds from other portion of the array
                sourceAtStep += time[1] / 1e9;
            }

            // val at this unit
            valAtStep = sourceAtStep / convert[i];

            if (valAtStep >= 1) {
                if (verbose) {
                    // deal in whole units, subsequent laps will get the decimal portion
                    valAtStep = Math.floor(valAtStep);
                }

                if (!precise) {
                    // don't fling too many decimals
                    decimals = valAtStep >= 10 ? 0 : 2;
                    strAtStep = valAtStep.toFixed(decimals);
                } else {
                    strAtStep = valAtStep.toString();
                }

                if (strAtStep.indexOf('.') > -1 && strAtStep[strAtStep.length - 1] === '0') {
                    // remove trailing zeros
                    strAtStep = strAtStep.replace(/\.?0+$/, '');
                }

                if (results) {
                    // append space if we have a previous value
                    results += ' ';
                }

                // append the value
                results += strAtStep;

                // append units
                if (verbose) {
                    results += verboseAbbrv ? `${verboseDesc[i]}` : ` ${verboseDesc[i]}`;

                    if (!verboseAbbrv && strAtStep !== '1') {
                        results += 's';
                    }
                } else {
                    results += ` ${minimalDesc[i]}`;
                }

                if (!verbose) {
                    // verbose gets as many groups as necessary, the rest get only one
                    break;
                }
            }
        }

        return results;
    }
}

class ArrayStat {
    /**
     * Creates an instance of ArrayStat.
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @param {number[]} array
     * @memberof ArrayStat
     */
    constructor(array) {
        this.array = array;
    }

    _getCloned() {
        return this.array.slice(0);
    }

    min() {
        return Math.min.apply(null, this.array);
    }

    max() {
        return Math.max.apply(null, this.array);
    }

    range() {
        return this.max(this.array) - this.min(this.array);
    }

    midrange() {
        return this.range(this.array) / 2;
    }

    sum(array) {
        array = array || this.array;

        let total = 0;

        for (let i = 0, l = array.length; i < l; i++) total += array[i];

        return total;
    }

    mean(array) {
        array = array || this.array;

        return this.sum(array) / array.length;
    }

    median() {
        let array = this._getCloned();

        array.sort(function (a, b) {
            return a - b;
        });

        let mid = array.length / 2;

        return mid % 1 ? array[mid - 0.5] : (array[mid - 1] + array[mid]) / 2;
    }

    modes() {
        if (!this.array.length) return [];

        let modeMap = {};
        let maxCount = 0;
        let modes = [];

        this.array.forEach(function (val) {
            if (!modeMap[val]) modeMap[val] = 1;
            else modeMap[val]++;

            if (modeMap[val] > maxCount) {
                modes = [val];
                maxCount = modeMap[val];
            } else if (modeMap[val] === maxCount) {
                modes.push(val);

                maxCount = modeMap[val];
            }
        });

        return modes;
    }

    letiance() {
        let mean = this.mean();

        return this.mean(
            this._getCloned().map(function (num) {
                return Math.pow(num - mean, 2);
            })
        );
    }

    standardDeviation() {
        return Math.sqrt(this.letiance());
    }

    meanAbsoluteDeviation() {
        let mean = this.mean();

        return this.mean(
            this._getCloned().map(function (num) {
                return Math.abs(num - mean);
            })
        );
    }

    zScores() {
        let mean = this.mean();
        let standardDeviation = this.standardDeviation();

        return this._getCloned().map(function (num) {
            return (num - mean) / standardDeviation;
        });
    }

    withinStd(val, stdev) {
        let low = this.mean() - stdev * this.standardDeviation(); // x.deviation;
        let hi = this.mean() + stdev * this.standardDeviation(); // x.deviation;
        let res = val > low && val < hi;

        console.log(`val: ${val.toString().padEnd(5, ' ')}    mean: ${this.mean()}    stdev: ${this.standardDeviation()}    hi: ${hi}    low: ${low}    res: ${res}`);

        return res;
    }
}

memoizeClass(ArrayStat);

let LineColumnFinder = (function LineColumnFinder() {
    let isArray = Array.isArray;
    let isObject = (val) => val != null && typeof val === 'object' && Array.isArray(val) === false;
    let slice = Array.prototype.slice;

    /**
     * Finder for index and line-column from given string.
     *
     * You can call this without `new` operator as it returns an instance anyway.
     *
     * @class
     * @param {string} str - A string to be parsed.
     * @param {Object|number} [options] - Options.
     *     This can be an index in the string for shorthand of `lineColumn(str, index)`.
     * @param {number} [options.origin=1] - The origin value of line and column.
     */
    function LineColumnFinder(str, options) {
        if (!(this instanceof LineColumnFinder)) {
            if (typeof options === 'number') {
                return new LineColumnFinder(str).fromIndex(options);
            }

            return new LineColumnFinder(str, options);
        }

        this.str = str || '';
        this.lineToIndex = buildLineToIndex(this.str);

        options = options || {};

        this.origin = typeof options.origin === 'undefined' ? 1 : options.origin;
    }

    /**
     * Find line and column from index in the string.
     *
     * @param  {number} index - Index in the string. (0-origin)
     * @return {Object|null}
     *     Found line number and column number in object `{ line: X, col: Y }`.
     *     If the given index is out of range, it returns `null`.
     */
    LineColumnFinder.prototype.fromIndex = function (index) {
        if (index < 0 || index >= this.str.length || isNaN(index)) {
            return null;
        }

        let line = findLowerIndexInRangeArray(index, this.lineToIndex);

        return {
            line: line + this.origin,
            col: index - this.lineToIndex[line] + this.origin,
        };
    };

    /**
     * Find index from line and column in the string.
     *
     * @param  {number|Object|Array} line - Line number in the string.
     *     This can be an Object of `{ line: X, col: Y }`, or
     *     an Array of `[line, col]`.
     * @param  {number} [column] - Column number in the string.
     *     This must be omitted or undefined when Object or Array is given
     *     to the first argument.
     * @return {number}
     *     Found index in the string. (always 0-origin)
     *     If the given line or column is out of range, it returns `-1`.
     */
    LineColumnFinder.prototype.toIndex = function (line, column) {
        if (typeof column === 'undefined') {
            if (isArray(line) && line.length >= 2) {
                return this.toIndex(line[0], line[1]);
            }

            if (isObject(line) && 'line' in line && ('col' in line || 'column' in line)) {
                return this.toIndex(line.line, 'col' in line ? line.col : line.column);
            }

            return -1;
        }

        if (isNaN(line) || isNaN(column)) {
            return -1;
        }

        line -= this.origin;
        column -= this.origin;

        if (line >= 0 && column >= 0 && line < this.lineToIndex.length) {
            let lineIndex = this.lineToIndex[line];
            let nextIndex = line === this.lineToIndex.length - 1 ? this.str.length : this.lineToIndex[line + 1];

            if (column < nextIndex - lineIndex) {
                return lineIndex + column;
            }
        }

        return -1;
    };

    /**
     * Build an array of indexes of each line from a string.
     *
     * @private
     * @param   str {string}  An input string.
     * @return  {number[]}    Built array of indexes. The key is line number.
     */
    function buildLineToIndex(str) {
        let lines = str.split('\n');
        let lineToIndex = new Array(lines.length);
        let index = 0;

        for (let i = 0, l = lines.length; i < l; i++) {
            lineToIndex[i] = index;
            index += lines[i].length + /* "\n".length */ 1;
        }

        return lineToIndex;
    }

    /**
     * Find a lower-bound index of a value in a sorted array of ranges.
     *
     * Assume `arr = [0, 5, 10, 15, 20]` and
     * this returns `1` for `value = 7` (5 <= value < 10),
     * and returns `3` for `value = 18` (15 <= value < 20).
     *
     * @private
     * @param  arr   {number[]} An array of values representing ranges.
     * @param  value {number}   A value to be searched.
     * @return {number} Found index. If not found `-1`.
     */
    function findLowerIndexInRangeArray(value, arr) {
        if (value >= arr[arr.length - 1]) {
            return arr.length - 1;
        }

        let min = 0,
            max = arr.length - 2,
            mid;

        while (min < max) {
            mid = min + ((max - min) >> 1);

            if (value < arr[mid]) {
                max = mid - 1;
            } else if (value >= arr[mid + 1]) {
                min = mid + 1;
            } else {
                // value >= arr[mid] && value < arr[mid + 1]
                min = mid;
                break;
            }
        }

        return min;
    }

    return LineColumnFinder;
})();

class CustomContextMenu {
    /**
     * Example menuItems
     *
     * ```javascript
     * let menuItems = [
     *    {
     *        type: 'item',
     *        label: 'Test1',
     *        onClick: () => {
     *            alert('test1');
     *        },
     *    },
     *    {
     *        type: 'item',
     *        label: 'Test2',
     *        onClick: () => {
     *            console.debug('test2');
     *        },
     *    },
     *    {
     *        type: 'break',
     *    },
     *    {
     *        type: 'item',
     *        label: 'Test3',
     *        onClick: () => {
     *            console.debug('test3');
     *        },
     *    },
     * ];
     *   ```
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @param {HTMLElement} elemToAttachTo
     * @param {*} menuItems
     * @memberof CustomContextMenu
     */
    constructor(elemToAttachTo, menuItems, onContextMenu) {
        this.elem = elemToAttachTo;
        this.menuItems = menuItems;
        this.menu = null;
        this.onContextMenu = onContextMenu;

        this._createMenu();
        this._setupEvents();

        this.hide = debounce(this.hide.bind(this), 500, true);
    }

    /**
     *
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @param {number} top
     * @param {number} left
     * @memberof CustomContextMenu
     */
    show(top, left) {
        document.body.appendChild(this.menu);

        this.menu.style.display = 'block';

        this.menu.style.top = `${top}px`;
        this.menu.style.left = `${left}px`;

        this.menu.setAttribute('tabindex', '0');
        this.menu.focus();
    }

    hide() {
        this.menu.style.display = 'none';

        if (document.body.contains(this.menu)) {
            this.menu.remove();
        }
    }

    _setupEvents() {
        this.elem.addEventListener('contextmenu', (ev) => {
            ev.preventDefault();

            if (this.onContextMenu) {
                this.onContextMenu(ev);
            }

            this.show(ev.pageY, ev.pageX);
        });

        document.addEventListener('click', (ev) => {
            if (document.body.contains(this.menu) && !this._isHover(this.menu)) {
                this.hide();
            }
        });

        window.addEventListener('blur', (ev) => {
            this.hide();
        });

        this.menu.addEventListener('blur', (ev) => {
            this.hide();
        });
    }

    _createMenu() {
        this.menu = this._createMenuContainer();

        for (let i = 0; i < this.menuItems.length; i++) {
            let itemConfig = this.menuItems[i];

            switch (itemConfig.type) {
                case 'item':
                    this.menu.appendChild(this._createItem(itemConfig));

                    break;

                case 'break':
                    this.menu.appendChild(this._createBreak());

                    break;

                default:
                    break;
            }
        }

        // document.body.appendChild(this.menu);
    }

    /**
     *
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @returns {HTMLElement}
     * @memberof CustomContextMenu
     */
    _createMenuContainer() {
        let html = `<div class="context" hidden></div>`;

        let elem = this._createElementsFromHTML(html);

        return elem;
    }

    /**
     *
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @param {*} itemConfig
     * @returns {HTMLElement}
     * @memberof CustomContextMenu
     */
    _createItem(itemConfig) {
        let html = `<div class="context_item">
    <div class="inner_item">
        ${itemConfig.label}
    </div>
</div>`;

        let elem = this._createElementsFromHTML(html);

        if (itemConfig.id) {
            elem.id = itemConfig.id;
        }

        if (itemConfig.onClick) {
            elem.addEventListener('click', (ev) => {
                itemConfig.onClick(ev);

                this.hide();
            });
        }

        return elem;
    }

    /**
     *
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @returns {HTMLElement}
     * @memberof CustomContextMenu
     */
    _createBreak() {
        let html = `<div class="context_hr"></div>`;

        let elem = this._createElementsFromHTML(html);

        return elem;
    }

    /**
     *
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @param {string} htmlStr
     * @returns {HTMLElement}
     */
    _createElementsFromHTML(htmlStr) {
        let div = document.createElement('div');

        div.innerHTML = htmlStr.trim();

        return div.firstChild;
    }

    _isHover(elem) {
        return elem.parentElement.querySelector(':hover') === elem;
    }
}

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @class LocalStorageEx
 */
class LocalStorageEx {
    /**
     * Creates an instance of LocalStorageEx.
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @memberof LocalStorageEx
     */
    constructor() {
        this.__storage = localStorage;
    }

    /**
     *
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @readonly
     * @memberof LocalStorageEx
     */
    get UNDEFINED_SAVED_VALUE() {
        return '__** undefined **__';
    }

    /**
     *
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @readonly
     * @memberof LocalStorageEx
     */
    get size() {
        let total = 0;

        for (let x in this.__storage) {
            // Value is multiplied by 2 due to data being stored in `utf-16` format, which requires twice the space.
            let amount = this.__storage[x].length * 2;

            if (!isNaN(amount) && this.__storage.hasOwnProperty(x)) {
                total += amount;
            }
        }

        return total;
    }

    /**
     * Determine if browser supports local storage.
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @returns {boolean}
     * @memberof LocalStorageEx
     */
    isSupported() {
        return typeof Storage !== 'undefined';
    }

    /**
     * Check if key exists in local storage.
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @param {*} key
     * @returns {boolean}
     * @memberof LocalStorageEx
     */
    has(key) {
        if (typeof key === 'object') {
            key = JSON.stringify(key);
        }

        return this.__storage.hasOwnProperty(key);
    }

    /**
     * Retrieve an object from local storage.
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @param {*} key
     * @param {*} [defaultValue=null]
     * @returns {*}
     * @memberof LocalStorageEx
     */
    get(key, defaultValue = null) {
        if (typeof key === 'object') {
            key = JSON.stringify(key);
        }

        if (!this.has(key)) {
            return defaultValue;
        }

        let item = this.__storage.getItem(key);

        try {
            if (item === '__** undefined **__') {
                return undefined;
            } else {
                return JSON.parse(item);
            }
        } catch (error) {
            return item;
        }
    }

    /**
     * Save some value to local storage.
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @param {string} key
     * @param {*} value
     * @returns {void}
     * @memberof LocalStorageEx
     */
    set(key, value) {
        if (typeof key === 'object') {
            key = JSON.stringify(key);
        }

        if (value === undefined) {
            value = this.UNDEFINED_SAVED_VALUE;
        } else if (typeof value === 'object') {
            value = JSON.stringify(value);
        }

        this.__storage.setItem(key, value);
    }

    /**
     * Remove element from local storage.
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @param {*} key
     * @returns {void}
     * @memberof LocalStorageEx
     */
    remove(key) {
        if (typeof key === 'object') {
            key = JSON.stringify(key);
        }

        this.__storage.removeItem(key);
    }

    toString() {
        return JSON.parse(JSON.stringify(this.__storage));
    }
}

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @class SessionStorageEx
 * @extends {LocalStorageEx}
 */
class SessionStorageEx extends LocalStorageEx {
    /**
     * Creates an instance of SessionStorageEx.
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @memberof SessionStorageEx
     */
    constructor() {
        super();

        this.__storage = sessionStorage;
    }
}

class IgnoreCaseMap extends Map {
    /**
     *
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @param {string} key
     * @param {*} value
     * @returns {this}
     * @memberof IgnoreCaseMap
     */
    set(key, value) {
        return super.set(key.toLocaleLowerCase(), value);
    }

    /**
     *
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @param {string} key
     * @returns {*}
     * @memberof IgnoreCaseMap
     */
    get(key) {
        return super.get(key.toLocaleLowerCase());
    }
}

// #endregion Helper Classes

// #region Helper Functions

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @param {string} name
 * @param {{logLevel: log.LogLevelDesc, tag: string}} logLevel
 * @return {log.Logger}
 */
function getLogger(name, { logLevel, tag }) {
    prefix.reg(log);

    const colors = {
        TRACE: '220;86;220',
        DEBUG: '86;86;220',
        INFO: '134;134;221',
        WARN: '220;220;86',
        ERROR: '220;86;86',
    };

    /** @type {prefix.LoglevelPluginPrefixOptions} */
    let options = {
        // template: tag ? `[%t] %l [${tag}] %n:` : '[%t] %l %n:',
        levelFormatter: function (level) {
            return level.toUpperCase();
        },
        nameFormatter: function (name) {
            return name || 'root';
        },
        timestampFormatter: function (date) {
            return date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1');
        },
        format: function (level, name, timestamp) {
            let _timestamp = `\x1B[90m[${timestamp}]\x1B[m`;
            let _level = `\x1B[38;2;${colors[level.toUpperCase()]}m${level.toUpperCase()}\x1B[m`;
            let _name = `\x1B[38;2;38;177;38m${tag ? `[${tag}-` : '['}${name}]\x1B[m`;

            let _format = `${_timestamp} ${_level} ${_name}:`;

            return _format;
        },
    };

    const logger = log.getLogger(name);

    prefix.apply(logger, options);

    logger.setLevel(logLevel || 'WARN');

    return logger;
}

function pp(obj, fn) {
    fn = fn || console.log;

    fn(pformat(obj));
}

function pformat(obj, space = 4) {
    return JSON.stringify(obj, null, space);
}

function removeAllButLastStrPattern(string, token) {
    let parts = string.split(token);

    if (parts[1] === undefined) return string;
    else return parts.slice(0, -1).join('') + token + parts.slice(-1);
}

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @param {Array.<T> | Array} arr
 * @param {?function(T, T): boolean} callbackObjs
 * @return {T[]}
 * @template T
 */
function dedupeArr(arr, callbackObjs) {
    if (callbackObjs) {
        let tempArr = /** @type {[]} */ (arr).filter((value, index) => {
            return (
                index ===
                arr.findIndex((other) => {
                    return callbackObjs(value, other);
                })
            );
        });

        return tempArr;
    } else {
        return [...new Set(arr)];
    }
}

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @param {any} obj
 * @returns {boolean}
 */
function isClass(obj) {
    return typeof obj === 'function' && /^\s*class\s+/.test(obj.toString());
}

/**
 * Checks whether a variable is a class or an instance created with `new`.
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @param {*} value The variable to check.
 * @returns {boolean} `true` if the variable is a class or an instance created with `new`, `false` otherwise.
 */
function isClassOrInstance(value) {
    // prettier-ignore
    if (typeof value === 'function' &&
        value.prototype &&
        typeof value.prototype.constructor === 'function' &&
        value.prototype.constructor !== Array &&
        value.prototype.constructor !== Object) {
        return true; // It's a class
    } else if (typeof value === 'object' &&
               value.constructor &&
               typeof value.constructor === 'function' &&
               value.constructor.prototype &&
               typeof value.constructor.prototype.constructor === 'function' &&
               value.constructor !== Array &&
               value.constructor !== Object) {
        return true; // It's an instance created with new
    }

    return false;
}

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @param {*} value The variable to check.
 * @returns {boolean}
 */
function isFunction(value) {
    try {
        return typeof value == 'function';
    } catch (error) {
        return false;
    }
}

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @param {object} obj
 * @param {{ propsToExclude?: string[]; namesOnly: boolean; removeDuplicates: boolean; asObject: boolean }} [{ propsToExclude = [], namesOnly = false, removeDuplicates = true, asObject = false } = {}]
 * @returns
 */
function getObjProps(obj, { propsToExclude = [], namesOnly = false, removeDuplicates = true, asObject = false } = {}) {
    // Default
    let _propsToExclude = [
        //
        '__defineGetter__',
        '__defineSetter__',
        '__lookupSetter__',
        '__lookupGetter__',
        '__proto__',
        '__original__',

        'caller',
        'callee',
        'arguments',

        'toString',
        'valueOf',
        'constructor',
        'hasOwnProperty',
        'isPrototypeOf',
        'propertyIsEnumerable',
        'toLocaleString',
    ];

    _propsToExclude = propsToExclude && Array.isArray(propsToExclude) ? _propsToExclude.concat(propsToExclude) : _propsToExclude;

    let objHierarchy = getObjHierarchy(obj);
    let propNames = getPropNames(objHierarchy);
    let plainObj = {};
    let objKeys = [];

    /**
     *
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @param {any} obj
     * @returns {Array<any>}
     */
    function getObjHierarchy(obj) {
        let objs = [obj];

        obj = isClassOrInstance(obj) ? obj.prototype || obj.__proto__ : obj;

        do {
            objs.push(obj);
        } while ((obj = Object.getPrototypeOf(obj)));

        return objs;
    }

    /**
     *
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @param {Array<any>} objHierarchy
     * @returns {string[]}
     */
    function getPropNames(objHierarchy) {
        /** @type {string[]} */
        let propNames = [];

        for (let i = 0; i < objHierarchy.length; i++) {
            const _obj = objHierarchy[i];

            let getPropFuncs = [Object.getOwnPropertyNames, Object.getOwnPropertySymbols];

            getPropFuncs.forEach((func) => {
                let _propNames = func(_obj);

                _propNames.forEach((propName) => {
                    if (!_propsToExclude.includes(propName) && !propNames.includes(propName)) {
                        propNames.push(propName);
                    }
                });
            });
        }

        return propNames;
    }

    /**
     *
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @param {{ name: string, value: any }[]} props
     * @return {{ name: string, value: any }[]}
     */
    function dedupeProps(props) {
        function findNonNullProp(props, name) {
            let res = props.find((prop) => prop.name == name && prop.value != null);

            if (!res) {
                res = props.find((prop) => prop.name == name);
            }

            return res;
        }

        function propsContains(props, name) {
            return props.some((prop) => prop.name == name);
        }

        let newProps = [];

        for (let i = 0; i < props.length; i++) {
            const prop = props[i];

            let tempProp = findNonNullProp(props, prop.name);

            if (!propsContains(newProps, tempProp.name)) {
                newProps.push(tempProp);
            }
        }

        return newProps;
    }

    function getProps(objHierarchy, doFuncs = false) {
        /** @type {{ name: string, value: any }} */
        let props = [];

        for (let o = 0; o < objHierarchy.length; o++) {
            const _obj = objHierarchy[o];

            for (let p = 0; p < propNames.length; p++) {
                const propName = propNames[p];
                let value;

                try {
                    value = _obj[propName];
                } catch (error) {}

                if (!_propsToExclude.includes(propName)) {
                    if (asObject) {
                        if (!objKeys.includes(propName)) {
                            objKeys.push(propName);

                            plainObj[propName] = value;
                        }
                    } else {
                        props.push({
                            name: propName,
                            value: value,
                        });
                    }
                }
            }
        }

        if (!asObject) {
            if (removeDuplicates) {
                props = dedupeProps(props);
            }

            props = props.filter(function (prop, i, props) {
                let exprs = [
                    //
                    !_propsToExclude.includes(prop.name),
                    // props[i + 1] && prop.name != props[i + 1].name,
                    ...(doFuncs ? [isFunction(prop.value)] : [!isFunction(prop.value)]),
                ];

                return exprs.every(Boolean);
            });
        }

        if (asObject) {
            return plainObj;
        } else {
            return props.sort(function (a, b) {
                let aName = typeof a.name == 'symbol' ? a.name.toString() : a.name;
                let bName = typeof b.name == 'symbol' ? b.name.toString() : b.name;

                if (aName < bName) return -1;
                if (aName > bName) return 1;

                return 0;
            });
        }
    }

    let res;

    if (asObject) {
        getProps(objHierarchy, true);
        getProps(objHierarchy);

        res = plainObj;
    } else {
        res = {
            funcs: getProps(objHierarchy, true),
            props: getProps(objHierarchy),
        };

        if (namesOnly) {
            res.funcs = res.funcs.filter((func) => func.name.toString() != 'Symbol(Symbol.hasInstance)').map((func) => func.name);
            res.props = res.props.filter((prop) => prop.name.toString() != 'Symbol(Symbol.hasInstance)').map((prop) => prop.name);
        }
    }

    objHierarchy = null;

    return res;
}

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @param {Window} [_window=window]
 * @param {{ namesOnly: boolean; asObject: boolean }} [{ namesOnly = false, asObject = false } = {}]
 * @returns
 */
function getUserDefinedGlobalProps(_window = null, { namesOnly = false, asObject = false } = {}) {
    _window = _window || getWindow();

    let iframe = document.createElement('iframe');

    iframe.style.display = 'none';

    document.body.appendChild(iframe);

    let plainObj = {};
    let objKeys = [];

    function getProps(obj, doFuncs = false) {
        let props = [];
        let _obj = obj;

        let getPropFuncs = [Object.getOwnPropertyNames, Object.getOwnPropertySymbols];

        getPropFuncs.forEach((func) => {
            let propNames = func(_obj);

            for (let i = 0; i < propNames.length; i++) {
                const propName = propNames[i];
                let value;

                try {
                    value = _obj[propName];
                } catch (error) {}

                if (isNumber(propName) && value?.constructor?.name == 'Window') continue;

                if (!iframe.contentWindow.hasOwnProperty(propName)) {
                    if (asObject) {
                        if (!objKeys.includes(propName)) {
                            objKeys.push(propName);

                            plainObj[propName] = value;
                        }
                    } else {
                        props.push({
                            name: propName,
                            value: value,
                        });
                    }
                }
            }
        });

        if (!asObject) {
            props = props.filter(function (prop, i, props) {
                let propName1 = prop.name;
                let propName2 = props[i + 1] ? props[i + 1].name : undefined;
                let propValue1 = prop.value;
                let propValue2 = props[i + 1] ? props[i + 1].value : undefined;

                let exprs = [
                    //
                    // props[i + 1] && propName1 != propName2,
                    (props[i + 1] && propName1.constructor.name == 'Symbol' && propName2.constructor.name == 'Symbol' && propValue1 != propValue2) || propName1 != propName2,
                    ...(doFuncs ? [isFunction(obj[propName1])] : [!isFunction(obj[propName1])]),
                ];

                return exprs.every(Boolean);
            });
        }

        if (asObject) {
            return plainObj;
        } else {
            return props.sort(function (a, b) {
                let aName = typeof a.name == 'symbol' ? a.name.toString() : a.name;
                let bName = typeof b.name == 'symbol' ? b.name.toString() : b.name;

                if (aName < bName) return -1;
                if (aName > bName) return 1;

                return 0;
            });
        }
    }

    let res;

    if (asObject) {
        getProps(_window, true);
        getProps(_window);

        res = plainObj;
    } else {
        res = {
            funcs: getProps(_window, true),
            props: getProps(_window),
        };

        if (namesOnly) {
            res.funcs = res.funcs.filter((func) => func.name.toString() != 'Symbol(Symbol.hasInstance)').map((func) => func.name);
            res.props = res.props.filter((prop) => prop.name.toString() != 'Symbol(Symbol.hasInstance)').map((prop) => prop.name);
        }
    }

    document.body.removeChild(iframe);

    return res;
}

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @param {T} obj
 * @param {T | boolean} thisArg
 * @returns {T}
 * @template T
 */
function storeObjOriginalFuncs(obj, thisArg = true) {
    let props = getObjProps(obj);

    obj.__original__ = {};

    for (let i = 0; i < props.funcs.length; i++) {
        const func = props.funcs[i];

        if (thisArg == true) {
            obj.__original__[func.name] = func.value.bind(obj);
        } else {
            obj.__original__[func.name] = thisArg != false && thisArg != null && thisArg != undefined ? func.value.bind(thisArg) : func.value;
        }
    }

    return obj;
}

function printProps(obj, title) {
    let headerFooterBanner = '*********************************************************';

    console.log(headerFooterBanner);
    console.log(`* ${title || ''}`);
    console.log(headerFooterBanner);

    for (let key in obj) console.log(key + ': ', [obj[key]]);

    console.log(headerFooterBanner);
}

function sortObject(o, desc) {
    let sorted = {};
    let key;
    let a = [];

    for (key in o) {
        if (o.hasOwnProperty(key)) a.push(key);
    }

    if (desc) a.sort(sortDescending);
    else a.sort(sortAscending);

    for (key = 0; key < a.length; key++) sorted[a[key]] = o[a[key]];

    return sorted;
}

function sortAscending(a, b) {
    if (typeof a == 'string') {
        a = a.toLowerCase();
        b = b.toLowerCase();
    }

    if (a < b) return -1;
    else if (a > b) return 1;
    else return 0;
}

function sortDescending(a, b) {
    if (typeof a == 'string') {
        a = a.toLowerCase();
        b = b.toLowerCase();
    }

    if (a > b) return -1;
    else if (a < b) return 1;
    else return 0;
}

function getFileExtension(sFile) {
    return sFile.replace(/^(.*)(\.[^/.]+)$/, '$2');
}

/**
 * Async wait function.
 * Example:
 * (async () => {
 *     await wait(4000).then(() => {
 *         console.log(new Date().toLocaleTimeString());
 *     }).then(() => {
 *         console.log('here');
 *     });
 * })();
 *
 * @param {number} ms - Milliseconds to wait.
 * @param {boolean} [synchronous=false] - Wait synchronously.
 */
async function wait(ms, synchronous = false) {
    let _wait = (ms, synchronous) => {
        if (synchronous) {
            let start = Date.now();
            let now = start;

            while (now - start < ms) now = Date.now();
        } else {
            return new Promise((resolve) => setTimeout(resolve, ms));
        }
    };

    await _wait(ms, synchronous);
}

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @param {() => bool} condition
 * @param {{ timeout?: number; callback: () => T; conditionIsAsync: boolean; }} [{ timeout, callback, conditionIsAsync = false } = {}]
 * @returns {T}
 * @template T
 */
async function waitUntil(condition, { timeout, callback, conditionIsAsync = false } = {}) {
    timeout = timeout || -1;
    let maxTime = timeout == -1 ? 20000 : -1;
    let startTime = new Date();

    let timeRanOut = false;

    let done = (() => {
        let deferred = {};

        deferred.promise = new Promise((resolve, reject) => {
            deferred.resolve = resolve;
            deferred.reject = reject;
        });

        return deferred;
    })();

    /** @type {number} */
    let timeoutId;

    if (timeout && timeout > 0) {
        timeoutId = setTimeout(() => {
            timeRanOut = true;

            return done.reject();
        }, timeout);
    }

    let loop = async () => {
        let endTime = new Date();
        let elapsed = endTime - startTime;

        let conditionResult = conditionIsAsync ? await condition() : condition();

        if (conditionResult || timeRanOut || (maxTime != -1 && elapsed > maxTime)) {
            clearTimeout(timeoutId);

            return done.resolve(callback ? await callback() : undefined);
        }

        setTimeout(loop, 0);
    };

    setTimeout(loop, 0);

    return done.promise;
}

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @param {any} obj
 * @param {boolean} [getInherited=false]
 * @returns {string}
 */
function getType(obj, getInherited = false) {
    let _typeVar = (function (global) {
        let cache = {};

        return function (obj) {
            let key;

            // null
            if (obj == null) return 'null';

            // window/global
            if (obj == global) return 'global';

            // basic: string, boolean, number, undefined
            if (!['object', 'function'].includes((key = typeof obj))) return key;

            if (obj.constructor != undefined && obj.constructor.name != 'Object' && !getInherited) return obj.constructor.name;

            // cached. date, regexp, error, object, array, math
            // and get XXXX from [object XXXX], and cache it
            return cache[(key = {}.toString.call(obj))] || (cache[key] = key.slice(8, -1));
        };
    })(globalThis);

    return _typeVar(obj);
}

/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing.
 *
 * @param {function} func
 * @param {Number} wait
 * @param {Boolean} immediate
 * @returns
 */
function debounce(func, wait, immediate) {
    let timeout;

    return function () {
        let context = this,
            args = arguments;

        let later = function () {
            timeout = null;

            if (!immediate) func.apply(context, args);
        };

        let callNow = immediate && !timeout;

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);

        if (callNow) func.apply(context, args);
    };
}

function equals(x, y) {
    if (x === y) return true;
    // if both x and y are null or undefined and exactly the same

    if (!(x instanceof Object) || !(y instanceof Object)) return false;
    // if they are not strictly equal, they both need to be Objects

    if (x.constructor !== y.constructor) return false;
    // they must have the exact same prototype chain, the closest we can do is
    // test there constructor.

    for (let p in x) {
        if (!x.hasOwnProperty(p)) continue;
        // other properties were tested using x.constructor === y.constructor

        if (!y.hasOwnProperty(p)) return false;
        // allows to compare x[ p ] and y[ p ] when set to undefined

        if (x[p] === y[p]) continue;
        // if they have the same strict value or identity then they are equal

        if (typeof x[p] !== 'object') return false;
        // Numbers, Strings, Functions, Booleans must be strictly equal

        if (!equals(x[p], y[p])) return false;
        // Objects and Arrays must be tested recursively
    }

    for (p in y) {
        if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) return false;
        // allows x[ p ] to be set to undefined
    }
    return true;
}

function isEncoded(uri) {
    uri = uri || '';

    return uri !== decodeURIComponent(uri);
}

function fullyDecodeURI(uri) {
    while (isEncoded(uri)) uri = decodeURIComponent(uri);

    return uri;
}

/**
 * Get difference in days between two dates.
 *
 * @param {Date} a
 * @param {Date} b
 * @returns
 */
function dateDiffInDays(a, b) {
    let _MS_PER_DAY = 1000 * 60 * 60 * 24;

    // Discard the time and time-zone information.
    let utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    let utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc1 - utc2) / _MS_PER_DAY);
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomFloat(min, max) {
    return Math.random() * (max - min + 1) + min;
}

function keySort(keys, desc) {
    return function (a, b) {
        let aVal = null;
        let bVal = null;

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];

            if (i == 0) {
                aVal = a[key];
                bVal = b[key];
            } else {
                aVal = aVal[key];
                bVal = bVal[key];
            }
        }
        return desc ? ~~(aVal < bVal) : ~~(aVal > bVal);
    };
}

function observe(obj, handler) {
    return new Proxy(obj, {
        get(target, key) {
            return target[key];
        },
        set(target, key, value) {
            target[key] = value;

            if (handler) handler();
        },
    });
}

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @param {Console} console
 */
function addSaveToConsole(console) {
    console.save = function (data, filename) {
        if (!data) {
            console.error('Console.save: No data');

            return;
        }

        if (!filename) filename = 'console.json';

        if (typeof data === 'object') data = JSON.stringify(data, undefined, 4);

        let blob = new Blob([data], {
            type: 'text/json',
        });
        let event = document.createEvent('MouseEvents');
        let tempElem = document.createElement('a');

        tempElem.download = filename;
        tempElem.href = window.URL.createObjectURL(blob);
        tempElem.dataset.downloadurl = ['text/json', tempElem.download, tempElem.href].join(':');

        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        tempElem.dispatchEvent(event);
    };
}

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @param {Window} _window
 * @param {string} propName
 * @param {{} | [] | any} value
 */
function setupWindowProps(_window, propName, value) {
    if (getType(value) == 'object') {
        if (typeof _window[propName] === 'undefined' || _window[propName] == null) {
            _window[propName] = {};
        }

        let keys = Object.keys(value);

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];

            if (!(/** @type {{}} */ (_window[propName].hasOwnProperty(key)))) {
                _window[propName][key] = null;
            }

            if (_window[propName][key] == null) {
                _window[propName][key] = value[key];
            }
        }
    } else {
        if (typeof _window[propName] === 'undefined' || _window[propName] == null) {
            _window[propName] = value;
        }
    }
}

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @param {{ name: string; value: any; }[]} variables
 */
function exposeGlobalVariables(variables) {
    variables.forEach((variable, index, variables) => {
        try {
            setupWindowProps(getWindow(), variable.name, variable.value);
        } catch (error) {
            logger.error(`Unable to expose variable ${variable.name} into the global scope.`);
        }
    });
}

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @param {string} str
 * @returns {string}
 */
function htmlEntitiesDecode(str) {
    return str
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"');
}

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @param {string} metaName
 * @returns {string}
 */
function getMeta(metaName) {
    const metas = document.getElementsByTagName('meta');

    for (let i = 0; i < metas.length; i++) {
        if (metas[i].getAttribute('name') === metaName) {
            return metas[i].getAttribute('content');
        }
    }

    return '';
}

/**
 *
 *
 * @returns {Window & typeof globalThis}
 */
function getWindow() {
    return globalThis.GM_info && GM_info.script.grant.includes('unsafeWindow') ? unsafeWindow : globalThis;
}

/**
 *
 *
 * @param {Window} _window
 */
function getTopWindow(_window = null) {
    _window = _window || getWindow();

    try {
        if (_window.self !== _window.top) {
            _window = getTopWindow(_window.parent);
        }
    } catch (e) {}

    return _window;
}

/**
 * Setup global error handler
 *
 * **Example:**
 * ```javascript
 * setupGlobalErrorHandler({
 *     callback: (error) => console.error('Error:', error),
 *     continuous: true,
 *     prevent_default: true,
 *     tag: '[test-global-error-handler]',
 * });
 * ```
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @param {{ callback: (error: ErrorEx) => void; continuous?: boolean; prevent_default?: boolean; tag?: string; logFunc?: (...data: any[]) => void; _window: Window; }} [{ callback, continuous = true, prevent_default = false, tag = '[akkd]', logFunc = console.error, _window = window } = {}]
 */
function setupGlobalErrorHandler({ callback, continuous = true, prevent_default = false, tag = null, logFunc = console.error, _window = window } = {}) {
    // respect existing onerror handlers
    let _onerror_original = _window.onerror;

    // install our new error handler
    _window.onerror = function (event, source, lineno, colno, error) {
        if (_onerror_original) {
            _onerror_original(event, source, lineno, colno, error);
        }

        // unset onerror to prevent loops and spamming
        let _onerror = _window.onerror;

        _window.onerror = null;

        // now deal with the error
        let errorObject = new ErrorEx(event, source, lineno, colno, error);
        let errorMessage = createErrorMessage(errorObject);

        if (tag) {
            let rgb = '38;177;38';

            tag = `\x1B[38;2;${rgb}m${tag}\x1B[m`;

            logFunc(tag, errorMessage);
        } else {
            logFunc(errorMessage);
        }

        // run callback if provided
        if (callback) {
            callback(errorObject);
        }

        // re-install this error handler again if continuous mode
        if (continuous) {
            _window.onerror = _onerror;
        }

        // true if normal error propagation should be suppressed
        // (i.e. normally console.error is logged by the browser)
        return prevent_default;
    };

    class ErrorEx {
        /**
         * Creates an instance of ErrorEx.
         * @author Michael Barros <michaelcbarros@gmail.com>
         * @param {string | Event} event
         * @param {string} source
         * @param {number} lineno
         * @param {number} colno
         * @param {Error} error
         * @memberof ErrorEx
         */
        constructor(event, source, lineno, colno, error) {
            this.name = error.name;
            this.message = error && error.message ? error.message : null;
            this.stack = error && error.stack ? error.stack : null;
            this.event = event;
            this.location = document.location.href;
            this.url = source;
            this.lineno = lineno;
            this.colno = colno;
            this.useragent = navigator.userAgent;
            this.fileName = error && error.fileName ? error.fileName : null;
            this.description = error && error.description ? error.description : null;
            this.name = error && error.name ? error.name : null;
            this.error = error;
        }
    }

    /**
     *
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @param {ErrorEx} error
     * @returns {string}
     */
    function createErrorMessage(error) {
        let name = error && error.name ? error.name : 'Error';
        let message = error && error.message ? error.message : 'Unknown error occured';
        let stack = error && error.stack ? error.stack.split('\n').splice(1).join('\n') : 'Error';

        let errorMessage = `Uncaught Global ${name}: ${message}\n${stack}`;

        return errorMessage;
    }
}

function applyCss(cssFiles) {
    /** @type {{ css: string, node?: HTMLElement }[]} */
    let cssArr = [];

    for (let i = 0; i < cssFiles.length; i++) {
        let cssStr = GM_getResourceText(cssFiles[i]);

        cssArr.push({
            css: cssStr,
        });
    }

    addStyles(cssArr);
}

function applyCss2(cssFiles) {
    /**
     *
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @param {string} cssStyleStr
     * @returns {HTMLStyleElement}
     */
    function createStyleElementFromCss(cssStyleStr) {
        let style = document.createElement('style');

        style.innerHTML = cssStyleStr.trim();

        return style;
    }

    let ranOnce = false;

    /** @type {HTMLStyleElement[]} */
    getWindow().akkd.styleElements = [];

    function removeStyleElements() {
        for (let i = 0; i < getWindow().akkd.styleElements.length; i++) {
            let styleElement = getWindow().akkd.styleElements[i];

            styleElement.remove();
        }

        getWindow().akkd.styleElements = [];
    }

    function _editStyleSheets() {
        $(document).arrive('style, link', async function () {
            if (this.tagName == 'LINK' && this.href.includes('.css')) {
                removeStyleElements();

                for (let i = 0; i < cssFiles.length; i++) {
                    let cssFile = cssFiles[i];
                    let css = GM_getResourceText(cssFile);

                    let styleElem = createStyleElementFromCss(css);

                    styleElem.id = `akkd-transform-style-${(i + 1).toString().padStart(2, '0')}`;

                    getWindow().akkd.styleElements.push(styleElem);

                    document.body.appendChild(styleElem);
                }
            }
        });

        if (!ranOnce) {
            for (let i = 0; i < cssFiles.length; i++) {
                let cssFile = cssFiles[i];
                let css = GM_getResourceText(cssFile);

                let styleElem = createStyleElementFromCss(css);

                styleElem.id = `akkd-transform-style-${(i + 1).toString().padStart(2, '0')}`;

                getWindow().akkd.styleElements.push(styleElem);

                document.body.appendChild(styleElem);
            }

            ranOnce = true;
        }
    }

    _editStyleSheets();
}

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @param {{ css: string, node?: HTMLElement }[]} cssArr
 */
let addStyles = (function () {
    /** @type {string[]} */
    const addedStyleIds = [];

    /**
     *
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @param {{ css: string, node?: HTMLElement }[]} cssArr
     * @param {{ useGM: boolean }} cssArr { useGM = true } = {}
     */
    function _addStyles(cssArr, { useGM = true } = {}) {
        /**
         *
         *
         * @author Michael Barros <michaelcbarros@gmail.com>
         * @param {string} css
         * @returns {HTMLStyleElement}
         */
        function createStyleElementFromCss(css) {
            let style = document.createElement('style');

            style.innerHTML = css.trim();

            return style;
        }

        function removeStyleElements() {
            for (let i = addedStyleIds.length - 1; i >= 0; i--) {
                /** @type {HTMLStyleElement} */
                let styleElem = document.getElementById(addedStyleIds[i]);

                if (styleElem) {
                    styleElem.remove();

                    addedStyleIds.splice(i, 1);
                }
            }
        }

        function addStyleElements() {
            for (let i = 0; i < cssArr.length; i++) {
                try {
                    const css = cssArr[i].css;
                    const node = cssArr[i].node || document.head;

                    /** @type {HTMLStyleElement} */
                    let elem = useGM ? GM_addStyle(css) : createStyleElementFromCss(css);

                    elem.id = `akkd-custom-style-${(i + 1).toString().padStart(2, '0')}`;

                    node.append(elem);

                    addedStyleIds.push(elem.id);
                } catch (error) {
                    console.error(error);
                }
            }
        }

        removeStyleElements();
        addStyleElements();

        return addedStyleIds;
    }

    return _addStyles;
})();

/**
 * Return uuid of form xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @returns {string}
 */
function uuid4() {
    let uuid = '';
    let ii;

    for (ii = 0; ii < 32; ii += 1) {
        switch (ii) {
            case 8:
            case 20:
                uuid += '-';
                uuid += ((Math.random() * 16) | 0).toString(16);

                break;

            case 12:
                uuid += '-';
                uuid += '4';

                break;

            case 16:
                uuid += '-';
                uuid += ((Math.random() * 4) | 8).toString(16);

                break;

            default:
                uuid += ((Math.random() * 16) | 0).toString(16);
        }
    }

    return uuid;
}

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @param {{} | []} obj
 * @param {string | {oldName: string, newName: string}[]} oldName
 * @param {string=} newName
 * @returns
 */
function renameProperty(obj, oldName, newName) {
    function _renameProperty(obj, oldName, newName) {
        let keys = Object.keys(obj);

        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let value = obj[key];

            if (value && typeof value == 'object') {
                obj[key] = _renameProperty(value, oldName, newName);
            }

            if (obj.hasOwnProperty(oldName)) {
                obj[newName] = obj[oldName];

                delete obj[oldName];
            }
        }

        return obj;
    }

    let renames = Array.isArray(oldName) ? oldName : [{ oldName, newName }];

    for (let i = 0; i < renames.length; i++) {
        const rename = renames[i];

        obj = _renameProperty(obj, rename.oldName, rename.newName);
    }

    return obj;
}

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @param {Promise<T>} fn
 * @param {{ retries?: number; interval?: number; maxTime?: number; throwError?: boolean; }} { retries = 3, interval = 100, maxTime = null, throwError = false }
 * @returns {Promise<T>}
 * @template T
 */
async function retry(fn, { retries = 3, interval = 100, maxTime = null, throwError = false }) {
    let start = new Date();
    let timeLapsed;

    async function _retry() {
        try {
            return await fn;
        } catch (error) {
            timeLapsed = new Date() - start;

            await wait(interval);

            if (maxTime) {
                if (timeLapsed >= maxTime) {
                    if (throwError) {
                        throw error;
                    } else {
                        return null;
                    }
                }
            } else {
                --retries;

                if (retries === 0) {
                    if (throwError) {
                        throw error;
                    } else {
                        return null;
                    }
                }
            }

            return await _retry();
        }
    }

    return await _retry();
}

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @param {string} htmlStr
 * @returns {NodeListOf<ChildNode>}
 */
function createElementsFromHTML(htmlStr) {
    let div = document.createElement('div');

    div.innerHTML = htmlStr.trim();

    return div.childNodes;
}

/**
 * Checks if a variable is a number.
 *
 * @param {*} variable - The variable to check.
 * @returns {boolean} - `true` if the variable is a number or a number represented as a string, `false` otherwise.
 */
function isNumber(variable) {
    return (typeof variable == 'string' || typeof variable == 'number') && !isNaN(variable - 0) && variable !== '';
}

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @param {string | number} val
 * @returns
 */
function parseNumberSafe(val) {
    if (isNumber(val)) {
        val = parseFloat(val);
    }

    return val;
}

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @param {number} num
 * @returns {boolean}
 */
function isInt(num) {
    return Number(num) === num && num % 1 === 0;
}

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @param {number} num
 * @returns {boolean}
 */
function isFloat(num) {
    return Number(num) === num && num % 1 !== 0;
}

/*
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @param {HTMLElement} elem
 * @param {string} prop
 * @param {Window=} _window
 * @returns {string | number | null}
 */
/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @param {HTMLElement} elem
 * @param {string} prop
 * @param {Window} [_window=getWindow()]
 * @returns {string | number | null}
 */
function getStyle(elem, prop, _window = null) {
    _window = _window || getWindow();

    let value = parseNumberSafe(
        window
            .getComputedStyle(elem, null)
            .getPropertyValue(prop)
            .replace(/^(\d+)px$/, '$1')
    );

    return value;
}

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @param {HTMLElement} beforeElem
 * @param {HTMLElement=} afterElem
 */
function attachHorizontalResizer(beforeElem, afterElem) {
    let resizer = document.createElement('span');

    resizer.className = 'akkd-horz-resizer';

    beforeElem.after(resizer);

    afterElem = afterElem ? afterElem : resizer.nextElementSibling;

    // resizer.addEventListener('mousedown', init, false);

    // /**
    //  *
    //  *
    //  * @author Michael Barros <michaelcbarros@gmail.com>
    //  * @param {MouseEvent} ev
    //  */
    // function init(ev) {
    //     getWindow().addEventListener('mousemove', resize, false);
    //     getWindow().addEventListener('mouseup', stopResize, false);
    // }

    // /**
    //  *
    //  *
    //  * @author Michael Barros <michaelcbarros@gmail.com>
    //  * @param {MouseEvent} ev
    //  */
    // function resize(ev) {
    //     beforeElem.style.height = `${ev.clientY - beforeElem.offsetTop}px`;
    // }

    // /**
    //  *
    //  *
    //  * @author Michael Barros <michaelcbarros@gmail.com>
    //  * @param {MouseEvent} ev
    //  */
    // function stopResize(ev) {
    //     getWindow().removeEventListener('mousemove', resize, false);
    //     getWindow().removeEventListener('mouseup', stopResize, false);
    // }

    let prevX = -1;
    let prevY = -1;
    let dir = null;

    $(resizer).on('mousedown', function (e) {
        prevX = e.clientX;
        prevY = e.clientY;
        dir = 'n'; // $(this).attr('id');

        $(document).on('mousemove', resize);
        $(document).on('mouseup', stopResize);
    });

    /**
     *
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @param {JQuery.MouseMoveEvent<Document, undefined, Document, Document>} ev
     */
    function resize(ev) {
        if (prevX == -1) return;

        let boxX = $(afterElem).position().left;
        let boxY = $(afterElem).position().top;
        let boxW = $(afterElem).width();
        let boxH = $(afterElem).height();

        let dx = ev.clientX - prevX;
        let dy = ev.clientY - prevY;

        switch (dir) {
            case 'n':
                // north
                boxY += dy;
                boxH -= dy;

                break;

            case 's':
                // south
                boxH += dy;

                break;

            case 'w':
                // west
                boxX += dx;
                boxW -= dx;

                break;

            case 'e':
                // east
                boxW += dx;

                break;

            default:
                break;
        }

        $(afterElem).css({
            // top: boxY + 'px',
            // left: boxX + 'px',
            // width: boxW + 'px',
            height: boxH + 'px',
        });

        let lines = [
            //
            // ['newHeight', newHeight],
            ['clientY', ev.clientY],
            ['beforeElem.top', roundNumber($(beforeElem).position().top)],
            ['beforeElem.height', $(beforeElem).height()],
            '',
            ['afterElem.top', roundNumber($(afterElem).position().top)],
            ['afterElem.height', $(afterElem).height()],
        ];

        // writeDebugMsg(lines);
        console.debug([`y: ${ev.clientY}`, `b.top: ${roundNumber($(beforeElem).position().top)}`, `b.height: ${$(beforeElem).height()}`, `a.top: ${roundNumber($(afterElem).position().top)}`, `a.height: ${$(afterElem).height()}`].join('    '));

        function writeDebugMsg(lines) {
            let outputLines = ['*'.repeat(60)];

            let tags = lines.map((line) => (Array.isArray(line) ? line[0] : line));

            lines.forEach((line) => {
                if (Array.isArray(line)) {
                    // need to require lpad-align
                    // outputLines.push(`${lpadAlign(line[0], tags)}: ${line[1]}`);
                } else {
                    outputLines.push(line);
                }
            });

            outputLines.push('*'.repeat(60));

            console.debug(outputLines.join('\n'));
        }

        function roundNumber(num, places = 2) {
            return parseFloat(parseFloat(num.toString()).toFixed(places));
            // Math.round(num * 100) / 100
        }

        prevX = ev.clientX;
        prevY = ev.clientY;
    }

    /**
     *
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @param {JQuery.MouseMoveEvent<Document, undefined, Document, Document>} ev
     */
    function stopResize(ev) {
        prevX = -1;
        prevY = -1;

        $(document).off('mousemove', resize);
        $(document).off('mouseup', stopResize);
    }
}

function traceMethodCalls(obj) {
    /** @type {ProxyHandler} */
    let handler = {
        get(target, propKey, receiver) {
            if (propKey == 'isProxy') return true;

            const prop = target[propKey];

            if (typeof prop == 'undefined') return;

            if (typeof prop === 'object' && target[propKey] !== null) {
                if (!prop.isProxy) {
                    target[propKey] = new Proxy(prop, handler);

                    return target[propKey];
                } else {
                    return target[propKey];
                }
            }

            if (typeof target[propKey] == 'function') {
                const origMethod = target[propKey];

                return function (...args) {
                    let result = origMethod.apply(this, args);

                    console.log(propKey + JSON.stringify(args) + ' -> ' + JSON.stringify(result));

                    return result;
                };
            } else {
                return target[propKey];
            }
        },
    };

    return new Proxy(obj, handler);
}

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @param {HTMLElement} elem
 * @param {number} [topOffset=0]
 * @returns {boolean}
 */
function isVisible(elem, topOffset = 0) {
    /**
     * Checks if a DOM element is visible. Takes into
     * consideration its parents and overflow.
     *
     * @param {HTMLElement} el      the DOM element to check if is visible
     *
     * These params are optional that are sent in recursively,
     * you typically won't use these:
     *
     * @param {number} top       Top corner position number
     * @param {number} right     Right corner position number
     * @param {number} bottom    Bottom corner position number
     * @param {number} left      Left corner position number
     * @param {number} width     Element width number
     * @param {number} height    Element height number
     * @returns {boolean}
     */
    function _isVisible(el, top, right, bottom, left, width, height) {
        let parent = el.parentNode;
        let VISIBLE_PADDING = 2;

        if (!_elementInDocument(el)) {
            return false;
        }

        // Return true for document node
        if (9 === parent.nodeType) {
            return true;
        }

        // Return false if our element is invisible
        if ('0' === _getStyle(el, 'opacity') || 'none' === _getStyle(el, 'display') || 'hidden' === _getStyle(el, 'visibility')) {
            return false;
        }

        if ('undefined' === typeof top || 'undefined' === typeof right || 'undefined' === typeof bottom || 'undefined' === typeof left || 'undefined' === typeof width || 'undefined' === typeof height) {
            top = el.offsetTop + topOffset;
            left = el.offsetLeft;
            bottom = top + el.offsetHeight;
            right = left + el.offsetWidth;
            width = el.offsetWidth;
            height = el.offsetHeight;
        }

        // If we have a parent, let's continue:
        if (parent) {
            // Check if the parent can hide its children.
            if ('hidden' === _getStyle(parent, 'overflow') || 'scroll' === _getStyle(parent, 'overflow')) {
                // Only check if the offset is different for the parent
                if (
                    // If the target element is to the right of the parent elm
                    left + VISIBLE_PADDING > parent.offsetWidth + parent.scrollLeft ||
                    // If the target element is to the left of the parent elm
                    left + width - VISIBLE_PADDING < parent.scrollLeft ||
                    // If the target element is under the parent elm
                    top + VISIBLE_PADDING > parent.offsetHeight + parent.scrollTop ||
                    // If the target element is above the parent elm
                    top + height - VISIBLE_PADDING < parent.scrollTop
                ) {
                    // Our target element is out of bounds:
                    return false;
                }
            }
            // Add the offset parent's left/top coords to our element's offset:
            if (el.offsetParent === parent) {
                left += parent.offsetLeft;
                top += parent.offsetTop;
            }
            // Let's recursively check upwards:
            return _isVisible(parent, top, right, bottom, left, width, height);
        }

        return true;
    }

    // Cross browser method to get style properties:
    /**
     *
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @param {HTMLElement} el
     * @param {string} property
     * @returns
     */
    function _getStyle(el, property) {
        let value;

        if (window.getComputedStyle) {
            value = document.defaultView.getComputedStyle(el, null)[property];
        }

        if (el.currentStyle) {
            value = el.currentStyle[property];
        }

        return value;
    }

    /**
     *
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @param {HTMLElement} element
     * @returns {boolean}
     */
    function _elementInDocument(element) {
        while ((element = element.parentNode)) {
            if (element == document) {
                return true;
            }
        }

        return false;
    }

    return _isVisible(elem);
}

/**
 * @summary
 * High-order function that memoizes a function, by creating a scope
 * to store the result of each function call, returning the cached
 * result when the same inputs is given.
 *
 * @description
 * Memoization is an optimization technique used primarily to speed up
 * functions by storing the results of expensive function calls, and returning
 * the cached result when the same inputs occur again.
 *
 * Each time a memoized function is called, its parameters are used as keys to index the cache.
 * If the index (key) is present, then it can be returned, without executing the entire function.
 * If the index is not cached, then all the body of the function is executed, and the result is
 * added to the cache.
 *
 * @see https://www.sitepoint.com/implementing-memoization-in-javascript/
 *
 * @export
 * @param {Function} func: function to memoize
 * @returns {Function}
 */
function memoize(func) {
    const cache = {};

    function memoized(...args) {
        const key = JSON.stringify(args);

        if (key in cache) return cache[key];

        if (globalThis instanceof this.constructor) {
            return (cache[key] = func.apply(null, args));
        } else {
            return (cache[key] = func.apply(this, args));
        }
    }

    memoized.toString = () => func.toString();

    return memoized;
}

function memoizeClass(clazz, options = { toIgnore: [] }) {
    let funcs = getObjProps(clazz, { namesOnly: true }).funcs;

    for (let i = 0; i < funcs.length; i++) {
        let funcName = funcs[i];

        if (options.toIgnore.includes(funcName)) continue;

        let func = Object.getOwnPropertyDescriptor(clazz.prototype, funcName);

        let memFunc = memoize(func.value);

        Object.defineProperty(clazz.prototype, funcName, {
            get: function () {
                return memFunc;
            },
        });
    }

    let props = getObjProps(clazz, { namesOnly: true }).props;

    for (let i = 0; i < props.length; i++) {
        let propName = props[i];

        if (options.toIgnore.includes(propName)) continue;

        let prop = Object.getOwnPropertyDescriptor(clazz.prototype, propName);
        let cacheKey = `_${propName}-cache_`;

        Object.defineProperty(clazz.prototype, propName, {
            get: function () {
                return (this[cacheKey] = this[cacheKey] || prop.get.call(this));
            },
        });
    }
}

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @param {any[]} objects
 * @returns {object}
 */
function merge(...objects) {
    const isObject = (obj) => Object.prototype.toString.call(obj) == '[object Object]' && obj.constructor && obj.constructor.name == 'Object';

    let _merge = (_target, _source, _isMergingArrays) => {
        if (!isObject(_target) || !isObject(_source)) {
            return _source;
        }

        Object.keys(_source).forEach((key) => {
            const targetValue = _target[key];
            const sourceValue = _source[key];

            if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
                if (_isMergingArrays) {
                    _target[key] = targetValue.map((x, i) => (sourceValue.length <= i ? x : _merge(x, sourceValue[i], _isMergingArrays)));

                    if (sourceValue.length > targetValue.length) {
                        _target[key] = _target[key].concat(sourceValue.slice(targetValue.length));
                    }
                } else {
                    _target[key] = targetValue.concat(sourceValue);
                }
            } else if (isObject(targetValue) && isObject(sourceValue)) {
                _target[key] = _merge(Object.assign({}, targetValue), sourceValue, _isMergingArrays);
            } else {
                _target[key] = sourceValue;
            }
        });

        return _target;
    };

    const isMergingArrays = typeof objects[objects.length - 1] == 'boolean' ? objects.pop() : false;

    if (objects.length < 2) throw new Error('mergeEx: this function expects at least 2 objects to be provided');

    if (objects.some((object) => !isObject(object))) throw new Error('mergeEx: all values should be of type "object"');

    const target = objects.shift();
    let source;

    while ((source = objects.shift())) {
        _merge(target, source, isMergingArrays);
    }

    return target;
}

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @param {Window} [windowOrFrame=getTopWindow()]
 * @param {Window[]} [allFrameArray=[]]
 * @returns {Window[]}
 */
function getAllFrames(windowOrFrame = getTopWindow(), allFrameArray = []) {
    allFrameArray.push(windowOrFrame.frames);

    for (var i = 0; i < windowOrFrame.frames.length; i++) {
        getAllFrames(windowOrFrame.frames[i], allFrameArray);
    }

    return allFrameArray;
}

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @returns {boolean}
 */
function windowIsFocused() {
    let frames = getAllFrames();

    for (let i = 0; i < frames.length; i++) {
        const frame = frames[i];

        try {
            if (frame.document.hasFocus()) {
                return true;
            }
        } catch (error) {}
    }

    return false;
}

function setupWindowHasFocused() {
    let frames = getAllFrames();

    for (let i = 0; i < frames.length; i++) {
        const frame = frames[i];

        try {
            frame.hasFocus = windowIsFocused;
        } catch (error) {}
    }
}

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @param {[]} array
 * @param {any} element
 * @param {number} index
 */
function moveArrayElement(array, filter, index) {
    let item = array.filter((item) => item === filter)[0];

    if (item) {
        array = array.filter((item) => item !== filter);

        array.unshift(item);
    }

    return array;
}

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @param {HTMLElement} elem
 * @param {(elem: HTMLElement, level: number) => void} callback
 * @param {number} [level=0]
 */
function walkDom(elem, callback, level = 0) {
    let children = elem.children;

    callback(elem, level);

    for (let i = 0; i < children.length; i++) {
        /** @type {HTMLElement} */
        let child = children[i];

        walkDom(child, callback, level + 1);

        if (child.shadowRoot) {
            walkDom(child.shadowRoot, callback, level + 2);
        }
    }
}

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @param {T} obj
 * @param {(key: string | number, value: any, keyPath: string, callbackRes: { doBreak: boolean, returnValue: any | null }, obj: T) => boolean} callback
 * @template T
 * @returns {{ dottedObj: T, returnValue: any }}
 */
function walkObj(obj, callback) {
    let callbackRes = {
        doBreak: false,
        returnValue: null,
    };

    /**
     *
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @param {{}} _obj
     * @param {string[]} keyPath
     * @param {{}} newObj
     */
    function _walk(_obj, keyPath, newObj) {
        keyPath = typeof keyPath === 'undefined' ? [] : keyPath;
        newObj = typeof newObj === 'undefined' ? {} : newObj;

        for (let key in _obj) {
            if (_obj.hasOwnProperty(key)) {
                let value = _obj[key];

                keyPath.push(key);

                callback.apply(this, [key, value, keyPath.join('.'), callbackRes, obj]);

                if (typeof value === 'object' && value !== null) {
                    newObj = _walk(value, keyPath, newObj);
                } else {
                    let newKey = keyPath.join('.');

                    newObj[newKey] = value;
                }

                keyPath.pop();

                if (callbackRes.doBreak) {
                    break;
                }
            }
        }

        return newObj;
    }

    let newObj = _walk(obj);

    return {
        dottedObj: newObj,
        returnValue: callbackRes.returnValue,
    };
}

/**
 * A function to take a string written in dot notation style, and use it to
 * find a nested object property inside of an object.
 *
 * Useful in a plugin or module that accepts a JSON array of objects, but
 * you want to let the user specify where to find various bits of data
 * inside of each custom object instead of forcing a standardized
 * property list.
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @param {{}} obj
 * @param {string} dotPath
 * @returns {*}
 */
function getNestedDot(obj, dotPath) {
    let parts = dotPath.split('.');
    let length = parts.length;
    let property = obj || this;

    for (let i = 0; i < length; i++) {
        property = property[parts[i]];
    }

    return property;
}

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @param {{}} obj
 * @param {number} maxLevel
 */
function getDottedObj(obj, maxLevel = 50) {
    /**
     *
     *
     * @author Michael Barros <michaelcbarros@gmail.com>
     * @param {{}} _obj
     * @param {string[]} keyPath
     * @param {{}} newObj
     * @param {number} level
     */
    function _worker(_obj, keyPath, newObj, level = 0) {
        keyPath = typeof keyPath === 'undefined' ? [] : keyPath;
        newObj = typeof newObj === 'undefined' ? {} : newObj;

        for (let key in _obj) {
            if (_obj.hasOwnProperty(key)) {
                let value = _obj[key];

                keyPath.push(key);

                if (typeof value === 'object' && value !== null) {
                    newObj = _worker(value, keyPath, newObj, level++);
                } else {
                    let newKey = keyPath.join('.');

                    newObj[newKey] = value;
                }

                keyPath.pop();

                if (maxLevel > 0 && level >= maxLevel) {
                    break;
                }
            }
        }

        return newObj;
    }

    let dottedObj = _worker(obj);

    return dottedObj;
}

function isNode() {
    return !(typeof window !== 'undefined' && typeof window.document !== 'undefined');
}

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @returns {number}
 */
function getCurrentTimeMs() {
    if (isNode()) {
        const NS_PER_MS = 1e6;

        let time = process.hrtime();

        return time[0] * 1000 + time[1] / NS_PER_MS;
    } else {
        return performance.now();
    }
}

const intervalIDsMap = new Map();
const timeoutIDsMap = new Map();

/**
 * Schedules the repeated execution of a function (callback) with a fixed time delay between each call.
 * @param {TimerHandler} handler - A function to be executed repeatedly.
 * @param {number} [timeout] - The time, in milliseconds, between each function call. Default is 0.
 * @param {...any} [args] - Additional arguments to be passed to the function.
 * @returns {number} - An identifier representing the interval. This value can be used with clearInterval to cancel the interval.
 */
function setIntervalEx(handler, timeout, ...args) {
    if (isNode()) {
        return setInterval(handler, timeout, ...args);
    } else {
        let startTime = getCurrentTimeMs();
        let elapsedTime = 0;
        /** @type {number} */
        let intervalId;
        let intervalIdTemp;

        function loop(currentTime) {
            if (intervalIDsMap.get(intervalId)) {
                const deltaTime = currentTime - startTime;

                elapsedTime += deltaTime;

                if (elapsedTime >= timeout) {
                    handler(...args);

                    elapsedTime = 0;
                }

                startTime = currentTime;

                intervalIdTemp = window.requestAnimationFrame(loop);
            } else {
                window.cancelAnimationFrame(intervalIdTemp);
                intervalIDsMap.delete(intervalId);
            }
        }

        intervalId = window.requestAnimationFrame(loop);

        intervalIDsMap.set(intervalId, true);

        return intervalId;
    }
}

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @param {number} intervalId
 */
function clearIntervalEx(intervalId) {
    if (isNode()) {
        clearInterval(intervalId);
    } else {
        intervalIDsMap.set(intervalId, false);

        window.cancelAnimationFrame(intervalId);
    }
}

/**
 * Schedules the execution of a function (callback) after a specified time delay.
 * @param {TimerHandler} handler - A function to be executed.
 * @param {number} [timeout] - The time, in milliseconds, to wait before executing the function. Default is 0.
 * @param {...any} [args] - Additional arguments to be passed to the function.
 * @returns {number} - An identifier representing the timeout. This value can be used with clearTimeout to cancel the timeout.
 */
function setTimeoutEx(handler, timeout, ...args) {
    if (isNode()) {
        return setTimeout(handler, timeout, ...args);
    } else {
        let startTime = getCurrentTimeMs();
        /** @type {number} */
        let timeoutId;
        let timeoutIdTemp;

        function loop(currentTime) {
            if (timeoutIDsMap.get(timeoutId)) {
                const deltaTime = currentTime - startTime;

                if (deltaTime >= timeout) {
                    handler(...args);
                } else {
                    timeoutIdTemp = window.requestAnimationFrame(loop);
                }
            } else {
                window.cancelAnimationFrame(timeoutIdTemp);
                timeoutIDsMap.delete(timeoutId);
            }
        }

        timeoutId = window.requestAnimationFrame(loop);

        timeoutIDsMap.set(timeoutId, true);

        return timeoutId;
    }
}

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @param {number} timeoutId
 */
function clearTimeoutEx(timeoutId) {
    if (isNode()) {
        clearTimeout(timeoutId);
    } else {
        timeoutIDsMap.set(timeoutId, false);

        window.cancelAnimationFrame(timeoutId);
    }
}

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @param {string} attribute
 * @param {string} value
 * @param {string} elementType
 * @returns {HTMLElement[]}
 */
function findByAttributeValue(attribute, value, elementType) {
    elementType = elementType || '*';

    let all = document.getElementsByTagName(elementType);
    let foundElements = [];

    for (let i = 0; i < all.length; i++) {
        if (all[i].getAttribute(attribute).includes(value)) {
            foundElements.push(all[i]);
        }
    }

    return foundElements;
}

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @returns {number}
 */
function getLocalStorageSize() {
    let total = 0;

    for (let x in localStorage) {
        // Value is multiplied by 2 due to data being stored in `utf-16` format, which requires twice the space.
        let amount = localStorage[x].length * 2;

        if (!isNaN(amount) && localStorage.hasOwnProperty(x)) {
            total += amount;
        }
    }

    return total;
}

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @param {number} bytes
 * @param {boolean} [si=false]
 * @returns {string}
 */
function bytes2HumanReadable(bytes, si = false) {
    let thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }

    let units = si ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;

    while (true) {
        bytes = bytes / thresh;
        u++;

        if (!(Math.abs(bytes) >= thresh && u < units.length - 1)) {
            break;
        }
    }

    return bytes.toFixed(1) + ' ' + units[u];
}

async function GM_fetch(url, fetchInit = {}) {
    if (!window.GM_xmlhttpRequest) {
        console.warn('GM_xmlhttpRequest not required. Using native fetch.');

        return await fetch(url, fetchInit);
    }

    let parseHeaders = function (headersString) {
        const headers = new Headers();

        for (const line of headersString.trim().split('\n')) {
            const [key, ...valueParts] = line.split(':');

            if (key) {
                headers.set(key.trim().toLowerCase(), valueParts.join(':').trim());
            }
        }

        return headers;
    };

    const defaultFetchInit = { method: 'get' };
    const { headers, method } = { ...defaultFetchInit, ...fetchInit };
    const isStreamSupported = GM_xmlhttpRequest?.RESPONSE_TYPE_STREAM;
    const HEADERS_RECEIVED = 2;

    if (!isStreamSupported) {
        return new Promise((resolve, _reject) => {
            const blobPromise = new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    url,
                    method,
                    headers,
                    responseType: 'blob',
                    onload: async (response) => resolve(response.response),
                    onerror: reject,
                    onreadystatechange: onHeadersReceived,
                });
            });

            blobPromise.catch(_reject);

            function onHeadersReceived(gmResponse) {
                const { readyState, responseHeaders, status, statusText } = gmResponse;

                if (readyState === HEADERS_RECEIVED) {
                    const headers = parseHeaders(responseHeaders);

                    resolve({
                        headers,
                        status,
                        statusText,
                        arrayBuffer: () => blobPromise.then((blob) => blob.arrayBuffer()),
                        blob: () => blobPromise,
                        json: () => blobPromise.then((blob) => blob.text()).then((text) => JSON.parse(text)),
                        text: () => blobPromise.then((blob) => blob.text()),
                    });
                }
            }
        });
    } else {
        return new Promise((resolve, _reject) => {
            const responsePromise = new Promise((resolve, reject) => {
                void GM_xmlhttpRequest({
                    url,
                    method,
                    headers,
                    responseType: 'stream',
                    onerror: reject,
                    onreadystatechange: onHeadersReceived,
                    // onloadstart: (gmResponse) => logDebug('[onloadstart]', gmResponse), // debug
                });
            });

            responsePromise.catch(_reject);

            function onHeadersReceived(gmResponse) {
                const { readyState, responseHeaders, status, statusText, response: readableStream } = gmResponse;

                if (readyState === HEADERS_RECEIVED) {
                    const headers = parseHeaders(responseHeaders);
                    let newResp;

                    if (status === 0) {
                        newResp = new Response(readableStream, { headers /*status, statusText*/ });
                    } else {
                        newResp = new Response(readableStream, { headers, status, statusText });
                    }

                    resolve(newResp);
                }
            }
        });
    }
}

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @param {T} items
 * @param {{name: string, desc: boolean, case_sensitive: boolean}[]} columns
 * @param {{cmpFunc: any}} [{ cmpFunc = cmp }={}]
 * @returns {T}
 * @template T
 */
function multiKeySort(items, columns, { cmpFunc = null } = {}) {
    function cmp(a, b) {
        if (a < b) {
            return -1;
        } else {
            if (a > b) {
                return 1;
            } else {
                return 0;
            }
        }
    }

    cmpFunc = cmpFunc != null ? cmpFunc : cmp;

    let comparers = [];

    columns.forEach((col) => {
        let column = col.name;
        let desc = 'desc' in col ? col.desc : false;
        let case_sensitive = 'case_sensitive' in col ? col.case_sensitive : true;

        comparers.push([column, desc ? -1 : 1, case_sensitive]);
    });

    function comparer(left, right) {
        for (let i = 0; i < comparers.length; i++) {
            const column = comparers[i][0];
            const polarity = comparers[i][1];
            const case_sensitive = comparers[i][2];

            let result = 0;

            if (case_sensitive) {
                result = cmpFunc(left[column], right[column]);
            } else {
                result = cmpFunc(left[column].toLowerCase(), right[column].toLowerCase());
            }

            if (result) {
                return polarity * result;
            }
        }

        return 0;
    }

    return items.sort(comparer);
}

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @param {string} text
 * @param {string} [nodeType='div']
 * @returns {HTMLElement}
 */
function getElementByTextContent(text, nodeType = 'div') {
    let xpath = `//${nodeType}[text()='${text}']`;

    /** @type {HTMLElement} */
    let elem = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    return elem;
}

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @param {string} text
 * @param {string} [nodeType='div']
 * @returns {HTMLElement}
 */
function getElementByTextContentContains(text, nodeType = 'div') {
    let xpath = `//${nodeType}[contains(text(),'${text}')]`;

    /** @type {HTMLElement} */
    let elem = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    return elem;
}

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @param {HTMLElement} element
 * @param {(elem: HTMLElement) => void} callback
 */
function onRemove(element, callback) {
    const parent = element.parentNode;

    if (!parent) {
        throw new Error('The node must already be attached');
    }

    const observer = new MutationObserver((mutations) => {
        let removed = false;

        for (const mutation of mutations) {
            for (const node of mutation.removedNodes) {
                if (node === element) {
                    observer.disconnect();

                    callback(element);

                    removed = true;

                    break;
                }
            }

            if (removed) {
                break;
            }
        }
    });

    observer.observe(parent, {
        childList: true,
    });
}

// #endregion Helper Functions

// #region Prototype Functions

// #region Array

/**
 * Function to setup custom prototype functions for the Array class
 * (For no conflicts, Object.defineProperty must be used)
 *
 */
function setupArrayPrototypes() {
    let funcs = [
        function pushUnique(item) {
            let index = -1;

            for (let i = 0; i < this.length; i++) {
                if (equals(this[i], item)) index = i;
            }

            if (index === -1) this.push(item);
        },
    ];

    for (let i = 0; i < funcs.length; i++) {
        let func = funcs[i];

        Object.defineProperty(Array.prototype, func.name, {
            enumerable: false,
            configurable: true,
            writable: true,
            value: func,
        });
    }
}

setupArrayPrototypes();

// #endregion Array

// #endregion Prototype Functions

// #region jQuery

function setupJqueryExtendedFuncs() {
    if ('jQuery' in getWindow() || 'jQuery' in window) {
        jQuery.fn.extend({
            /**
             *
             *
             * @author Michael Barros <michaelcbarros@gmail.com>
             * @returns {boolean}
             * @this {JQuery<HTMLElement>}
             */
            exists: function exists() {
                return this.length !== 0;
            },

            /**
             *
             *
             * @author Michael Barros <michaelcbarros@gmail.com>
             * @param {() => void} callback
             * @returns {JQuery<HTMLElement>}
             * @this {JQuery<HTMLElement>}
             */
            ready: function ready(callback) {
                let cb = function cb() {
                    return setTimeout(callback, 0, jQuery);
                };

                if (document.readyState !== 'loading') {
                    cb();
                } else {
                    document.addEventListener('DOMContentLoaded', cb);
                }

                return this;
            },

            /**
             *
             *
             * @author Michael Barros <michaelcbarros@gmail.com>
             * @param {string} method
             * @param {{}} options
             * @returns {number | string | null}
             * @this {JQuery<HTMLElement>}
             */
            actual: function actual(method, options) {
                // check if the jQuery method exist
                if (!this[method]) {
                    throw '$.actual => The jQuery method "' + method + '" you called does not exist';
                }

                let defaults = {
                    absolute: false,
                    clone: false,
                    includeMargin: false,
                    display: 'block',
                };

                let configs = jQuery.extend(defaults, options);

                let $target = this.eq(0);
                let fix;
                let restore;

                if (configs.clone === true) {
                    fix = function () {
                        let style = 'position: absolute !important; top: -1000 !important; ';

                        // this is useful with css3pie
                        $target = $target.clone().attr('style', style).appendTo('body');
                    };

                    restore = function () {
                        // remove DOM element after getting the width
                        $target.remove();
                    };
                } else {
                    let tmp = [];
                    let style = '';
                    let $hidden;

                    fix = function () {
                        // get all hidden parents
                        $hidden = $target.parents().addBack().filter(':hidden');
                        style += 'visibility: hidden !important; display: ' + configs.display + ' !important; ';

                        if (configs.absolute === true) {
                            style += 'position: absolute !important; ';
                        }

                        // save the origin style props
                        // set the hidden el css to be got the actual value later
                        $hidden.each(function () {
                            // Save original style. If no style was set, attr() returns undefined
                            let $this = jQuery(this);
                            let thisStyle = $this.attr('style');

                            tmp.push(thisStyle);

                            // Retain as much of the original style as possible, if there is one
                            $this.attr('style', thisStyle ? thisStyle + ';' + style : style);
                        });
                    };

                    restore = function () {
                        // restore origin style values
                        $hidden.each(function (i) {
                            let $this = jQuery(this);
                            let _tmp = tmp[i];

                            if (_tmp === undefined) {
                                $this.removeAttr('style');
                            } else {
                                $this.attr('style', _tmp);
                            }
                        });
                    };
                }

                fix();
                // get the actual value with user specific methed
                // it can be 'width', 'height', 'outerWidth', 'innerWidth'... etc
                // configs.includeMargin only works for 'outerWidth' and 'outerHeight'
                let actual = /(outer)/.test(method) ? $target[method](configs.includeMargin) : $target[method]();

                restore();
                // IMPORTANT, this plugin only return the value of the first element
                return actual;
            },

            /**
             *
             *
             * @author Michael Barros <michaelcbarros@gmail.com>
             * @returns {DOMRect}
             * @this {JQuery<HTMLElement>}
             */
            rect: function rect() {
                return this[0].getBoundingClientRect();
            },

            /**
             *
             *
             * @author Michael Barros <michaelcbarros@gmail.com>
             * @param {number} levels
             * @returns {JQuery<HTMLElement>}
             * @this {JQuery<HTMLElement>}
             */
            parentEx: function parentEx(levels = 1) {
                let parent = this;

                for (let i = 0; i < levels; i++) {
                    if (parent.parent().length == 0) {
                        break;
                    }

                    parent = parent.parent();
                }

                return parent;
            },
        });
    }
}

setupJqueryExtendedFuncs();

// #endregion jQuery
