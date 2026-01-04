/* eslint-disable no-multi-spaces */

// ==UserScript==
// @name               URL Encoder
// @namespace          URL-Encoder
// @version            0.2.2
// @description        URL encode and decode for non-utf8 encodings
// @author             EtherDream, PY-DNG
// @license            MIT
// ==/UserScript==

let $URL = (function () {
    const str2big5 = (function () {
        'use strict'

        let table;
        return str2big5;

        function initBig5Table() {
            // https://en.wikipedia.org/wiki/Big5
            const ranges = [
                [0xA1, 0xF9, 0x40, 0x7E],
                [0xA1, 0xF9, 0xA1, 0xFE],
            ]
            const codePoints = new Uint16Array(13973); // 13973 === (0xF9-0xA1+1)*(0x7E-0x40+1 + 0xFE-0xA1+1)
            let i = 0;

            for (const [b1Begin, b1End, b2Begin, b2End] of ranges) {
                for (let b2 = b2Begin; b2 <= b2End; b2++) {
                    for (let b1 = b1Begin; b1 <= b1End; b1++) {
                        codePoints[i++] = b2 << 8 | b1;
                    }
                }
            }
            table = {};

            const str = [...new TextDecoder('big5').decode(codePoints)];
            for (let i = 0; i < str.length; i++) {
                table[str[i].charCodeAt(0)] = codePoints[i];
            }
        }

        function str2big5(str) {
            if (!table) {
                initBig5Table();
            }

            const buf = [];

            for (let i = 0; i < str.length; i++) {
                const codePoint = str.codePointAt(i);
                const code = String.fromCodePoint(codePoint);
                i += code.length-1;

                if (codePoint < 0x80) {
                    buf.push(codePoint);
                    continue;
                }
                const big5 = table[codePoint];

                if (table.hasOwnProperty(codePoint)) {
                    const uarr = new Uint8Array(2);
                    uarr[0] = big5;
                    uarr[1] = big5 >> 8;
                    buf.push(uarr[0], uarr[1]);
                } else {
                    const encoded = str2big5(`&#${codePoint};`);
                    for (const charcode of encoded) {
                        buf.push(charcode);
                    }
                }
            }
            return buf;
        }
    }) ();

    const str2gbk = (function () {
        'use strict'

        let table;
        return str2gbk;

        function initGbkTable() {
            // https://en.wikipedia.org/wiki/GBK_(character_encoding)#Encoding
            const ranges = [
                [0xA1, 0xA9, 0xA1, 0xFE],
                [0xB0, 0xF7, 0xA1, 0xFE],
                [0x81, 0xA0, 0x40, 0xFE],
                [0xAA, 0xFE, 0x40, 0xA0],
                [0xA8, 0xA9, 0x40, 0xA0],
                [0xAA, 0xAF, 0xA1, 0xFE],
                [0xF8, 0xFE, 0xA1, 0xFE],
                [0xA1, 0xA7, 0x40, 0xA0],
            ]
            const codePoints = new Uint16Array(23940);
            let i = 0;

            for (const [b1Begin, b1End, b2Begin, b2End] of ranges) {
                for (let b2 = b2Begin; b2 <= b2End; b2++) {
                    if (b2 !== 0x7F) {
                        for (let b1 = b1Begin; b1 <= b1End; b1++) {
                            codePoints[i++] = b2 << 8 | b1;
                        }
                    }
                }
            }
            table = {}

            const str = [...new TextDecoder('gbk').decode(codePoints)];
            for (let i = 0; i < str.length; i++) {
                 table[str[i].charCodeAt(0)] = codePoints[i];
            }
        }

        function str2gbk(str, opt = {}) {
            if (!table) {
                initGbkTable();
            }

            const buf = [];

            for (let i = 0; i < str.length; i++) {
                const codePoint = str.codePointAt(i);
                const code = String.fromCodePoint(codePoint);
                i += code.length-1;

                if (codePoint < 0x80) {
                    buf.push(codePoint);
                    continue;
                }
                const gbk = table[codePoint];

                if (table.hasOwnProperty(codePoint)) {
                    const uarr = new Uint8Array(2);
                    uarr[0] = gbk;
                    uarr[1] = gbk >> 8;
                    buf.push(uarr[0], uarr[1]);
                } else if (codePoint === 8364) {
                    // 8364 == '€'.charCodeAt(0)
                    // Code Page 936 has a single-byte euro sign at 0x80
                    buf.push(0x80);
                } else {
                    const encoded = str2gbk(`&#${codePoint};`);
                    for (const charcode of encoded) {
                        buf.push(charcode);
                    }
                }
            }
            return buf;
        }
    }) ();

	const docEncoding = document.characterSet.toLowerCase();
    const encoder = {
        big5: {
            encode: str => arr2url(str2big5(str)),
            decode: url => decodeURL(url, 'big5'),
			encodeBuffer: str => arr2buf(str2big5(str))
        },
        gbk: {
            encode: str => arr2url(str2gbk(str)),
            decode: url => decodeURL(url, 'gbk'),
			encodeBuffer: str => arr2buf(str2gbk(str))
        },
		get encode() { return encoder[docEncoding].encode; },
		get decode() { return encoder[docEncoding].decode; },
		get encodeBuffer() { return encoder[docEncoding].encodeBuffer; },
    };
	return encoder;

    function arr2url(buf) {
        return buf.map(charcode => '%' + charcode.toString(16).padStart(2, '0').toUpperCase()).join('');
    }

	function arr2buf(arr) {
		return arr.reduce((buf, charcode, i) => {
            buf[i] = charcode;
            return buf;
        }, new Uint8Array(arr.length));
	}

    function decodeURL(url, encoding) {
        const arr = [];
        let inCharcode = false, charcode = '';
        for (const char of url) {
            if (inCharcode) {
                charcode += char;
                if (charcode.length === 2) {
                    arr.push(parseInt(charcode, 16));
                    inCharcode = false;
                    charcode = '';
                }
            } else if (char === '%') {
                inCharcode = true;
            } else {
                arr.push(char.charCodeAt(0));
            }
        }
        const buf = arr.reduce((buf, charcode, i) => {
            buf[i] = charcode;
            return buf;
        }, new Uint8Array(arr.length));

        return new TextDecoder(encoding).decode(buf);
    }
})();