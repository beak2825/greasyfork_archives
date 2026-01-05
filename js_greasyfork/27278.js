(function (global, Str) {
    "use strict";

    // region [ Private Functions ]
    /**
     * Test if the specified object is an array.
     * @param obj {Array|object}
     * @returns {boolean}
     * @private
     */
    function _isArray(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }

    /**
     * Convert json string into js object.
     * @param s
     * @private
     */
    function _parseJson(s) {
        var _parser;
        if (typeof global.JSON !== 'undefined') {
            _parser = global.JSON.parse;
        }
        else if (typeof window.jQuery !== 'undefined') {
            _parser = window.jQuery.parseJSON;
        }

        if (typeof _parser === 'undefined') {
            throw 'Undefined JSON method';
        }
        return _parser(s);
    }

    // endregion

    /**
     * Check for undefined, null, zero length, blanks or s is false.
     * @param s {string|object} - string, array or object to test.
     * @returns {boolean}
     * Unit Test: http://jsfiddle.net/wao20/TGP3N/
     */
    Str.empty = function (s) {
        // s == undefined	 <= double equals is deliberate, check for null and undefined
        return !!(s == undefined
        || s.length === 0
        || Str.trim(s).length === 0
        || !s);

    };

    /**
     * Compare two strings
     * @param s1 {?string}
     * @param s2 {?string}
     * @param caseSensitive {boolean=}
     * @returns {boolean}
     */
    Str.equals = function (s1, s2, caseSensitive) {
        if (s1 == undefined || s2 == undefined) {
            return false;
        }

        if (caseSensitive) {
            return s1 == s2;
        }
        return s1.toLowerCase() == s2.toLowerCase();
    };

    /**
     * empty(), '0', '0.0', 'false' => false. Otherwise return !!s.
     *
     * @param s {?string}
     * @returns {boolean}
     */
    Str.boolVal = function (s) {
        if (Str.empty(s)) {
            return false;
        }
        s = Str.trim(s).toLowerCase();
        if (s == '0' || s == '0.0' || s == 'false') {
            return false;
        }
        return !!s;
    };

    /**
     * Escape the string to be use as a literal in regex expression.
     *
     * @param s {string|Array}
     * @returns {string|Array}
     */
    Str.regexEscape = function (s) {
        if (!s) {
            return '';
        }

        if (typeof s === 'string') {
            return s.replace(/([.?*+\^$\[\]\\(){}|\-])/g, '\\$1');
        }
        else if (_isArray(s)) {
            var result = [], i;
            for (i = 0; i < s.length; i++) {
                result.push(Str.regexEscape(s[i]));
            }
            return result;
        }
        return s;
    };

    /**
     * Tests whether the beginning of a string matches pattern.
     *
     * @param s {string}
     * @param pattern {string} - to find
     * @param caseSensitive {boolean=}
     * @return {boolean}
     */
    Str.startsWith = function (s, pattern, caseSensitive) {
        if (caseSensitive) {
            return s.indexOf(pattern) === 0;
        }
        return s.toLowerCase().indexOf(pattern.toLowerCase()) === 0;
    };

    /**
     * Test if string ends with specified pattern
     * @param s {string}
     * @param pattern {string}
     * @param caseSensitive {boolean=}
     * @returns {boolean}
     */
    Str.endsWith = function (s, pattern, caseSensitive) {
        var d = s.length - pattern.length;
        if (caseSensitive) {
            return d >= 0 && s.lastIndexOf(pattern) === d;
        }
        return d >= 0 && s.toLowerCase().lastIndexOf(pattern.toLowerCase()) === d;
    };

    /**
     * Check if the string contains a substring.
     * @param s {string}
     * @param needle {string}
     * @param caseSensitive {boolean=}
     * @return {boolean}
     */
    Str.contains = function (s, needle, caseSensitive) {
        if (Str.empty(s) || Str.empty(needle)) {
            return false;
        }
        if (caseSensitive) {
            return s.indexOf(needle) > -1;
        }
        return s.toLowerCase().indexOf(needle.toLowerCase()) > -1;
    };

    /**
     * Must contains all the element in the array.
     * @param s {string}
     * @param needles {Array|string}
     * @param caseSensitive {boolean=}
     * @return {boolean}
     */
    Str.containsAll = function (s, needles, caseSensitive) {
        var i = 0;
        if (_isArray(needles)) {
            for (i = 0; i < needles.length; i++) {
                if (!Str.contains(s, needles[i], caseSensitive)) {
                    return false;
                }
            }
            return true;
        }
        return Str.contains(s, needles, caseSensitive);
    };

    /**
     * Must contains ANY the element in the array.
     * @param s {string}
     * @param needles {Array|string}
     * @param caseSensitive {boolean=}
     * @return {boolean}
     */
    Str.containsAny = function (s, needles, caseSensitive) {
        var i;
        if (_isArray(needles)) {
            for (i = 0; i < needles.length; i++) {
                if (Str.contains(s, needles[i], caseSensitive)) {
                    return true;
                }
            }
            return false;
        }
        return Str.contains(s, needles, caseSensitive);
    };

    /**
     * Determine if the specified variable is a string
     * @param o
     * @returns {boolean}
     */
    Str.isString = function (o) {
        return typeof o === 'string';
    };

    /**
     * Trims white space from the beginning and end of a string.
     * @param s {string}
     * @param c {string=}
     * @return {string}
     */
    Str.trim = function (s, c) {
        if (!Str.isString(s)) {
            return s;
        }

        if (c == undefined || c == ' ') {
            if (String.prototype.trim) {
                return String.prototype.trim.call(s);
            }
            return s.replace(/^\s+/, '').replace(/\s+$/, '');
        }
        return Str.trimStart(Str.trimEnd(s, c), c);
    };

    /**
     * Remove chars/Str from the start of the string
     * @param s
     * @param c {string|Array=} - supports Str.trimStart(s, ['0x0', '0', 'x']);
     */
    Str.trimStart = function (s, c) {
        if (c == undefined || c == '') {
            return s.replace(/^\s+/, '');
        }

        var trims = c, regex, result;
        if (!_isArray(c)) {
            trims = [c];
        }
        trims = Str.regexEscape(trims).join('|');
        regex = '^(' + trims + '|\s)+';
        regex = new RegExp(regex, 'g');
        result = s.replace(regex, '');
        return result;
    };

    /**
     * Remove chars/Str(s) from the end of the string
     * @param s {string}
     * @param c {string|Array=} - supports Str.trimEnd(s, ['0x0', '0', 'x']);
     */
    Str.trimEnd = function (s, c) {
        if (c == undefined) {
            return s.replace(/\s+$/, '');
        }
        var trims = c, regex, result;
        if (!_isArray(c)) {
            trims = [c];
        }
        trims = Str.regexEscape(trims).join('|');
        regex = '(' + trims + '|\s)+$';
        regex = new RegExp(regex, 'g');
        result = s.replace(regex, '');
        return result;
    };

    /**
     * Extended substring, support negative index (ordinal js substr(startIndex, endIndex))
     *
     * @param s {string}
     * @param index {number} - if negative take string from the right similar to php substr()
     * @param len {number=} - number of char to take starting from the index to the right (even when index is negative)
     * @return {string}
     */
    Str.subStr = function (s, index, len) {
        if (s == undefined) {
            return '';
        }

        len = len || 0;

        if (Math.abs(index) > s.length) {
            return s;
        }

        // regular substring
        if (index > -1) {
            if (len > 0 && (index + len) < s.length) {
                return s.substring(index, index + len);
            }
            return s.substring(index);
        }

        // Negative index, take string from the right
        // Index is negative	=> subStr ('hello', -3)	=> 'llo'
        var start = s.length + index;
        if (len > 0 && (start + len) < s.length) {
            return s.substring(start, start + len);
        }
        return s.substring(start);
    };

    /**
     * Count number of occurrences of an substring.
     * @param s {string} - the big string
     * @param sub {string} - the little string you want to find.
     * @param caseSensitive {boolean=}
     * @returns {number}
     */
    Str.subCount = function (s, sub, caseSensitive) {
        sub = Str.regexEscape(sub);

        if (caseSensitive) {
            return s.split(sub).length - 1;
        }
        return s.toLowerCase().split(sub.toLowerCase()).length - 1;
    };

    /**
     * Concatenate count number of copies of s together and return result.
     * @param s {string}
     * @param count {number} - Number of times to repeat s
     * @return {string}
     */
    Str.repeat = function (s, count) {
        var result = '', i;
        for (i = 0; i < count; i++) {
            result += s;
        }
        return result;
    };

    /**
     * Pad left
     *
     * @param s {!string}
     * @param padStr {!string} - the padding
     * @param totalLength {!number} - the final length after padding
     * @return {string}
     */
    Str.padLeft = function (s, padStr, totalLength) {
        return s.length >= totalLength ? s : Str.repeat(padStr, (totalLength - s.length) / padStr.length) + s;
    };

    /**
     * Pad right
     *
     * @param s {string}
     * @param padStr {string} - the padding
     * @param totalLength {number} - the final length after padding
     * @return {string}
     */
    Str.padRight = function (s, padStr, totalLength) {
        return s.length >= totalLength ? s : s + Str.repeat(padStr, (totalLength - s.length) / padStr.length);
    };

    /**
     * Pad string based on the boolean value.
     *
     * @param s {string}
     * @param padStr {string} - the padding
     * @param totalLength {number} - the final length after padding
     * @param padRight {boolean} - pad right if true, pad left otherwise
     * @return {string}
     */
    Str.pad = function (s, padStr, totalLength, padRight) {
        if (padRight) {
            return Str.padRight(s, padStr, totalLength);
        }
        return Str.padLeft(s, padStr, totalLength);
    };

    /**
     * Strips any HTML tags from the specified string.
     * @param s {string}
     * @return {string}
     */
    Str.stripTags = function (s) {
        return s.replace(/<\/?[^>]+>/gi, '');
    };

    /**
     * escapeHTML from Prototype-1.6.0.2 -- If it's good enough for Webkit and IE, it's good enough for Gecko!
     * Converts HTML special characters to their entity equivalents.
     *
     * @param s {string}
     * @return {string}
     */
    Str.escapeHTML = function (s) {
        s = s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return s;
    };

    /**
     * unescapeHTML from Prototype-1.6.0.2 -- If it's good enough for Webkit and IE, it's good enough for Gecko!
     * Strips tags and converts the entity forms of special HTML characters to their normal form.
     *
     * @param s {string}
     * @return {string}
     */
    Str.unescapeHTML = function (s) {
        return Str.stripTags(s).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    };

    /**
     * Remove all Viet's accents and replace it with the latin based alphabet
     * @param s {string}
     * @return {string}
     */
    Str.stripViet = function (s) {
        /*
         data = data.replace(/[àáâãăạảấầẩẫậắằẳẵặ]/g, 'a');
         data = data.replace(/[òóôõơọỏốồổỗộớờởỡợ]/g, 'o');
         data = data.replace(/[èéêẹẻẽếềểễệ]/g, 'e');
         data = data.replace(/[ùúũưụủứừửữự]/g, 'u');
         data = data.replace(/[ìíĩỉị]/g, 'i');
         data = data.replace(/[ýỳỵỷỹ]/g, 'y');
         data = data.replace(/[đðĐ]/g, 'd');
         */

        if (Str.empty(s)) {
            return s;
        }

        s = s.replace(/[\u00E0\u00E1\u00E2\u00E3\u0103\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7]/g, 'a');
        s = s.replace(/[\u00F2\u00F3\u00F4\u00F5\u01A1\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3]/g, 'o');
        s = s.replace(/[\u00E8\u00E9\u00EA\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7]/g, 'e');
        s = s.replace(/[\u00F9\u00FA\u0169\u01B0\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1]/g, 'u');
        s = s.replace(/[\u00EC\u00ED\u0129\u1EC9\u1ECB]/g, 'i');
        s = s.replace(/[\u00FD\u1EF3\u1EF5\u1EF7\u1EF9]/g, 'y');
        s = s.replace(/[\u0111\u00F0\u0110]/g, 'd');

        return s;
    };

    /**
     * Use this to constructs multi lines string
     *
     * eg. Str.multiLines(true,
     *                        'hello',
     *                        'world'
     *                        );
     *                    returns: "hello\nworld"
     *
     * @param glue {string} - the separator between each line (eg. '\n', ', ' or ' ')
     * @param args {...string} - each line
     */
    Str.multiLines = function (glue, args) {
        args = Array.prototype.splice.call(arguments, 1);
        return args.join(glue);
    };

    /**
     * Try to parse the json, if valid return the object else return defaultValue
     *
     * @param s {string} - json string
     * @param defaultValue {boolean|object=} - if not specified defaultValue=false
     * @returns {boolean|object}
     */
    Str.parseJson = function (s, defaultValue) {
        defaultValue = defaultValue === undefined ? false : defaultValue;
        if (Str.empty(s)) {
            return defaultValue;
        }

        try {
            if (typeof s === 'string') {
                return _parseJson(s);
            }

            // it already an object
            return s;
        }
        catch (err) {
            return defaultValue;
        }
    };

    /**
     * Escape the attribute, make sure it doesn't break the attribute select or to be use a an attribute.
     * @param s {string} - the string
     */
    Str.escapeAttribute = function (s) {
        return s.replace(/"/g, '\\"');
    };

    /**
     * Reverse the string.
     *
     * @param s
     * @returns {*}
     */
    Str.reverse = function (s) {
        if (s) {
            return s.split('').reverse().join('');
        }
        return s;
    };

    /**
     * Get all the matched based on the specified group.
     *
     * @param s {string}
     * @param regex {RegExp}
     * @param index {Number} - the index of the match.
     * @returns {Array}
     */
    Str.matchAll = function (s, regex, index) {
        var m, result = [];
        index = index || 0;

        if (!s) {
            return [];
        }

        while (m = regex.exec(s)) {
            result.push(m[index]);
        }
        return result;
    };

    /**
     * Split the string into multiple smaller chunks.
     *
     * @param s
     * @param chunkSize
     * @returns {Array}
     */
    Str.chop = function (s, chunkSize) {
        var regex;
        if (!s) {
            return [];
        }
        regex = new RegExp('.{1,' + chunkSize + '}', 'g');
        return s.match(regex);
    };

    function _getWords(s) {
        s = s.replace(/(\w)([A-Z][a-z])/, '$1-$2');
        s = s.replace(' ', '-');
        s = s.replace('_', '-');
        s = s.replace(/-+/g, '-');

        return s.split('-')
    }

    /**
     * Convert any string to camel case.
     *
     * @param s
     */
    Str.toCamelCase = function (s) {
        var words = _getWords(s), result = '', i, word;
        for (i = 0; i < words.length; i++) {
            word = words[i];
            if (i == 0) {
                result += word.toLowerCase();
            }
            else {
                result += word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
            }
        }
        return result;
    };

    /**
     * Convert any string to title case.
     *
     * @param s
     */
    Str.toTitleCase = function (s) {
        var words = _getWords(s), result = '', i, word;
        for (i = 0; i < words.length; i++) {
            word = words[i];
            result += word.charAt(0).toUpperCase() + word.substr(1).toLowerCase() + ' ';
        }
        return Str.trimEnd(result);
    };

    /**
     * Convert any string to snake case.
     *
     * @param s
     */
    Str.toSnakeCase = function (s) {
        var words = _getWords(s), result = '', i, word;
        for (i = 0; i < words.length; i++) {
            word = words[i];
            result += word.toLowerCase() + '_';
        }
        return Str.trimEnd(result, '_');
    };

    /**
     * Convert any string to-kebab-case.
     *
     * @param s
     */
    Str.toKebabCase = function (s) {
        var words = _getWords(s), result = '', i, word;
        for (i = 0; i < words.length; i++) {
            word = words[i];
            result += word.toLowerCase() + '-';
        }
        return Str.trimEnd(result, '-');
    };

}(window, window._Str = {}));
