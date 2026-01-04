// ==UserScript==
// @name          stringify-entities-umd
// @namespace     flomk.userscripts
// @version       1.0
// @description   UMD of stringify-entities
// @author        flomk
// ==/UserScript==
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.StringifyEntities = {}));
})(this, (function (exports) { 'use strict';
    var defaultSubsetRegex = /["&'<>`]/g;
    var surrogatePairsRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
    var controlCharactersRegex = (
        /[\x01-\t\v\f\x0E-\x1F\x7F\x81\x8D\x8F\x90\x9D\xA0-\uFFFF]/g
    );
    var regexEscapeRegex = /[|\\{}()[\]^$+*?.]/g;
    var subsetToRegexCache =  new WeakMap();
    function core(value, options) {
        value = value.replace(
            options.subset ? charactersToExpressionCached(options.subset) : defaultSubsetRegex,
            basic
        );
        if (options.subset || options.escapeOnly) {
            return value;
        }
        return value.replace(surrogatePairsRegex, surrogate).replace(controlCharactersRegex, basic);
        function surrogate(pair, index, all) {
            return options.format(
                (pair.charCodeAt(0) - 55296) * 1024 + pair.charCodeAt(1) - 56320 + 65536,
                all.charCodeAt(index + 2),
                options
            );
        }
        function basic(character, index, all) {
            return options.format(
                character.charCodeAt(0),
                all.charCodeAt(index + 1),
                options
            );
        }
    }
    function charactersToExpressionCached(subset) {
        let cached = subsetToRegexCache.get(subset);
        if (!cached) {
            cached = charactersToExpression(subset);
            subsetToRegexCache.set(subset, cached);
        }
        return cached;
    }
    function charactersToExpression(subset) {
        const groups = [];
        let index = -1;
        while (++index < subset.length) {
            groups.push(subset[index].replace(regexEscapeRegex, "\\$&"));
        }
        return new RegExp("(?:" + groups.join("|") + ")", "g");
    }

    var hexadecimalRegex = /[\dA-Fa-f]/;
    function toHexadecimal(code, next, omit) {
        const value = "&#x" + code.toString(16).toUpperCase();
        return omit && next && !hexadecimalRegex.test(String.fromCharCode(next)) ? value : value + ";";
    }

    var decimalRegex = /\d/;
    function toDecimal(code, next, omit) {
        const value = "&#" + String(code);
        return omit && next && !decimalRegex.test(String.fromCharCode(next)) ? value : value + ";";
    }

    var characterEntitiesLegacy = [
        "AElig",
        "AMP",
        "Aacute",
        "Acirc",
        "Agrave",
        "Aring",
        "Atilde",
        "Auml",
        "COPY",
        "Ccedil",
        "ETH",
        "Eacute",
        "Ecirc",
        "Egrave",
        "Euml",
        "GT",
        "Iacute",
        "Icirc",
        "Igrave",
        "Iuml",
        "LT",
        "Ntilde",
        "Oacute",
        "Ocirc",
        "Ograve",
        "Oslash",
        "Otilde",
        "Ouml",
        "QUOT",
        "REG",
        "THORN",
        "Uacute",
        "Ucirc",
        "Ugrave",
        "Uuml",
        "Yacute",
        "aacute",
        "acirc",
        "acute",
        "aelig",
        "agrave",
        "amp",
        "aring",
        "atilde",
        "auml",
        "brvbar",
        "ccedil",
        "cedil",
        "cent",
        "copy",
        "curren",
        "deg",
        "divide",
        "eacute",
        "ecirc",
        "egrave",
        "eth",
        "euml",
        "frac12",
        "frac14",
        "frac34",
        "gt",
        "iacute",
        "icirc",
        "iexcl",
        "igrave",
        "iquest",
        "iuml",
        "laquo",
        "lt",
        "macr",
        "micro",
        "middot",
        "nbsp",
        "not",
        "ntilde",
        "oacute",
        "ocirc",
        "ograve",
        "ordf",
        "ordm",
        "oslash",
        "otilde",
        "ouml",
        "para",
        "plusmn",
        "pound",
        "quot",
        "raquo",
        "reg",
        "sect",
        "shy",
        "sup1",
        "sup2",
        "sup3",
        "szlig",
        "thorn",
        "times",
        "uacute",
        "ucirc",
        "ugrave",
        "uml",
        "uuml",
        "yacute",
        "yen",
        "yuml"
    ];

    var characterEntitiesHtml4 = {
        nbsp: "\xA0",
        iexcl: "\xA1",
        cent: "\xA2",
        pound: "\xA3",
        curren: "\xA4",
        yen: "\xA5",
        brvbar: "\xA6",
        sect: "\xA7",
        uml: "\xA8",
        copy: "\xA9",
        ordf: "\xAA",
        laquo: "\xAB",
        not: "\xAC",
        shy: "\xAD",
        reg: "\xAE",
        macr: "\xAF",
        deg: "\xB0",
        plusmn: "\xB1",
        sup2: "\xB2",
        sup3: "\xB3",
        acute: "\xB4",
        micro: "\xB5",
        para: "\xB6",
        middot: "\xB7",
        cedil: "\xB8",
        sup1: "\xB9",
        ordm: "\xBA",
        raquo: "\xBB",
        frac14: "\xBC",
        frac12: "\xBD",
        frac34: "\xBE",
        iquest: "\xBF",
        Agrave: "\xC0",
        Aacute: "\xC1",
        Acirc: "\xC2",
        Atilde: "\xC3",
        Auml: "\xC4",
        Aring: "\xC5",
        AElig: "\xC6",
        Ccedil: "\xC7",
        Egrave: "\xC8",
        Eacute: "\xC9",
        Ecirc: "\xCA",
        Euml: "\xCB",
        Igrave: "\xCC",
        Iacute: "\xCD",
        Icirc: "\xCE",
        Iuml: "\xCF",
        ETH: "\xD0",
        Ntilde: "\xD1",
        Ograve: "\xD2",
        Oacute: "\xD3",
        Ocirc: "\xD4",
        Otilde: "\xD5",
        Ouml: "\xD6",
        times: "\xD7",
        Oslash: "\xD8",
        Ugrave: "\xD9",
        Uacute: "\xDA",
        Ucirc: "\xDB",
        Uuml: "\xDC",
        Yacute: "\xDD",
        THORN: "\xDE",
        szlig: "\xDF",
        agrave: "\xE0",
        aacute: "\xE1",
        acirc: "\xE2",
        atilde: "\xE3",
        auml: "\xE4",
        aring: "\xE5",
        aelig: "\xE6",
        ccedil: "\xE7",
        egrave: "\xE8",
        eacute: "\xE9",
        ecirc: "\xEA",
        euml: "\xEB",
        igrave: "\xEC",
        iacute: "\xED",
        icirc: "\xEE",
        iuml: "\xEF",
        eth: "\xF0",
        ntilde: "\xF1",
        ograve: "\xF2",
        oacute: "\xF3",
        ocirc: "\xF4",
        otilde: "\xF5",
        ouml: "\xF6",
        divide: "\xF7",
        oslash: "\xF8",
        ugrave: "\xF9",
        uacute: "\xFA",
        ucirc: "\xFB",
        uuml: "\xFC",
        yacute: "\xFD",
        thorn: "\xFE",
        yuml: "\xFF",
        fnof: "\u0192",
        Alpha: "\u0391",
        Beta: "\u0392",
        Gamma: "\u0393",
        Delta: "\u0394",
        Epsilon: "\u0395",
        Zeta: "\u0396",
        Eta: "\u0397",
        Theta: "\u0398",
        Iota: "\u0399",
        Kappa: "\u039A",
        Lambda: "\u039B",
        Mu: "\u039C",
        Nu: "\u039D",
        Xi: "\u039E",
        Omicron: "\u039F",
        Pi: "\u03A0",
        Rho: "\u03A1",
        Sigma: "\u03A3",
        Tau: "\u03A4",
        Upsilon: "\u03A5",
        Phi: "\u03A6",
        Chi: "\u03A7",
        Psi: "\u03A8",
        Omega: "\u03A9",
        alpha: "\u03B1",
        beta: "\u03B2",
        gamma: "\u03B3",
        delta: "\u03B4",
        epsilon: "\u03B5",
        zeta: "\u03B6",
        eta: "\u03B7",
        theta: "\u03B8",
        iota: "\u03B9",
        kappa: "\u03BA",
        lambda: "\u03BB",
        mu: "\u03BC",
        nu: "\u03BD",
        xi: "\u03BE",
        omicron: "\u03BF",
        pi: "\u03C0",
        rho: "\u03C1",
        sigmaf: "\u03C2",
        sigma: "\u03C3",
        tau: "\u03C4",
        upsilon: "\u03C5",
        phi: "\u03C6",
        chi: "\u03C7",
        psi: "\u03C8",
        omega: "\u03C9",
        thetasym: "\u03D1",
        upsih: "\u03D2",
        piv: "\u03D6",
        bull: "\u2022",
        hellip: "\u2026",
        prime: "\u2032",
        Prime: "\u2033",
        oline: "\u203E",
        frasl: "\u2044",
        weierp: "\u2118",
        image: "\u2111",
        real: "\u211C",
        trade: "\u2122",
        alefsym: "\u2135",
        larr: "\u2190",
        uarr: "\u2191",
        rarr: "\u2192",
        darr: "\u2193",
        harr: "\u2194",
        crarr: "\u21B5",
        lArr: "\u21D0",
        uArr: "\u21D1",
        rArr: "\u21D2",
        dArr: "\u21D3",
        hArr: "\u21D4",
        forall: "\u2200",
        part: "\u2202",
        exist: "\u2203",
        empty: "\u2205",
        nabla: "\u2207",
        isin: "\u2208",
        notin: "\u2209",
        ni: "\u220B",
        prod: "\u220F",
        sum: "\u2211",
        minus: "\u2212",
        lowast: "\u2217",
        radic: "\u221A",
        prop: "\u221D",
        infin: "\u221E",
        ang: "\u2220",
        and: "\u2227",
        or: "\u2228",
        cap: "\u2229",
        cup: "\u222A",
        int: "\u222B",
        there4: "\u2234",
        sim: "\u223C",
        cong: "\u2245",
        asymp: "\u2248",
        ne: "\u2260",
        equiv: "\u2261",
        le: "\u2264",
        ge: "\u2265",
        sub: "\u2282",
        sup: "\u2283",
        nsub: "\u2284",
        sube: "\u2286",
        supe: "\u2287",
        oplus: "\u2295",
        otimes: "\u2297",
        perp: "\u22A5",
        sdot: "\u22C5",
        lceil: "\u2308",
        rceil: "\u2309",
        lfloor: "\u230A",
        rfloor: "\u230B",
        lang: "\u2329",
        rang: "\u232A",
        loz: "\u25CA",
        spades: "\u2660",
        clubs: "\u2663",
        hearts: "\u2665",
        diams: "\u2666",
        quot: '"',
        amp: "&",
        lt: "<",
        gt: ">",
        OElig: "\u0152",
        oelig: "\u0153",
        Scaron: "\u0160",
        scaron: "\u0161",
        Yuml: "\u0178",
        circ: "\u02C6",
        tilde: "\u02DC",
        ensp: "\u2002",
        emsp: "\u2003",
        thinsp: "\u2009",
        zwnj: "\u200C",
        zwj: "\u200D",
        lrm: "\u200E",
        rlm: "\u200F",
        ndash: "\u2013",
        mdash: "\u2014",
        lsquo: "\u2018",
        rsquo: "\u2019",
        sbquo: "\u201A",
        ldquo: "\u201C",
        rdquo: "\u201D",
        bdquo: "\u201E",
        dagger: "\u2020",
        Dagger: "\u2021",
        permil: "\u2030",
        lsaquo: "\u2039",
        rsaquo: "\u203A",
        euro: "\u20AC"
    };

    var dangerous = [
        "cent",
        "copy",
        "divide",
        "gt",
        "lt",
        "not",
        "para",
        "times"
    ];

    var own = {}.hasOwnProperty;
    var characters = {};
    var key;
    for (key in characterEntitiesHtml4) {
        if (own.call(characterEntitiesHtml4, key)) {
            characters[characterEntitiesHtml4[key]] = key;
        }
    }
    var notAlphanumericRegex = /[^\dA-Za-z]/;
    function toNamed(code, next, omit, attribute) {
        const character = String.fromCharCode(code);
        if (own.call(characters, character)) {
            const name = characters[character];
            const value = "&" + name;
            if (omit && characterEntitiesLegacy.includes(name) && !dangerous.includes(name) && (!attribute || next && next !== 61 && notAlphanumericRegex.test(String.fromCharCode(next)))) {
                return value;
            }
            return value + ";";
        }
        return "";
    }

    function formatSmart(code, next, options) {
        let numeric = toHexadecimal(code, next, options.omitOptionalSemicolons);
        let named;
        if (options.useNamedReferences || options.useShortestReferences) {
            named = toNamed(
                code,
                next,
                options.omitOptionalSemicolons,
                options.attribute
            );
        }
        if ((options.useShortestReferences || !named) && options.useShortestReferences) {
            const decimal = toDecimal(code, next, options.omitOptionalSemicolons);
            if (decimal.length < numeric.length) {
                numeric = decimal;
            }
        }
        return named && (!options.useShortestReferences || named.length < numeric.length) ? named : numeric;
    }

    function formatBasic(code) {
        return "&#x" + code.toString(16).toUpperCase() + ";";
    }

    function stringifyEntities(value, options) {
        return core(value, Object.assign({ format: formatSmart }, options));
    }
    function stringifyEntitiesLight(value, options) {
        return core(value, Object.assign({ format: formatBasic }, options));
    }

    exports.stringifyEntities = stringifyEntities;
    exports.stringifyEntitiesLight = stringifyEntitiesLight;

}));