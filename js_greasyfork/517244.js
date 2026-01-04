(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.parseMultipartData = {}));
})(this, (function (exports) { 'use strict';

    function process(part) {
        // will transform this object:
        // { header: 'Content-Disposition: form-data; name="uploads[]"; filename="A.txt"',
        // info: 'Content-Type: text/plain',
        // part: 'AAAABBBB' }
        // into this one:
        // { filename: 'A.txt', type: 'text/plain', data: <Buffer 41 41 41 41 42 42 42 42> }
        const obj = function (str) {
            const k = str.split('=');
            const a = k[0].trim();
            const b = JSON.parse(k[1].trim());
            const o = {};
            Object.defineProperty(o, a, {
                value: b,
                writable: true,
                enumerable: true,
                configurable: true
            });
            return o;
        };
        const header = part.contentDispositionHeader.split(';');
        const filenameData = header[2];
        let input = {};
        if (filenameData) {
            input = obj(filenameData);
            const contentType = part.contentTypeHeader.split(':')[1].trim();
            Object.defineProperty(input, 'type', {
                value: contentType,
                writable: true,
                enumerable: true,
                configurable: true
            });
        }
        // always process the name field
        Object.defineProperty(input, 'name', {
            value: header[1].split('=')[1].replace(/"/g, ''),
            writable: true,
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(input, 'data', {
            value: new Uint8Array(part.part),
            writable: true,
            enumerable: true,
            configurable: true
        });
        return input;
    }

    const ParsingState = (ParsingState => {
        ParsingState[(ParsingState.INIT = 0)] = 'INIT';
        ParsingState[(ParsingState.READING_HEADERS = 1)] = 'READING_HEADERS';
        ParsingState[(ParsingState.READING_DATA = 2)] = 'READING_DATA';
        ParsingState[(ParsingState.READING_PART_SEPARATOR = 3)] = 'READING_PART_SEPARATOR';
        return ParsingState;
    })({});

    function parse(multipartBodyBuffer, boundary) {
        let lastline = '';
        let contentDispositionHeader = '';
        let contentTypeHeader = '';
        let state = ParsingState.INIT;
        let buffer = [];
        const allParts = [];
        let currentPartHeaders = [];
        for (let i = 0; i < multipartBodyBuffer.length; i++) {
            const oneByte = multipartBodyBuffer[i];
            const prevByte = i > 0 ? multipartBodyBuffer[i - 1] : null;
            // 0x0a => \n
            // 0x0d => \r
            const newLineDetected = oneByte === 0x0a && prevByte === 0x0d;
            const newLineChar = oneByte === 0x0a || oneByte === 0x0d;
            if (!newLineChar) lastline += String.fromCharCode(oneByte);
            if (ParsingState.INIT === state && newLineDetected) {
                // searching for boundary
                if ('--' + boundary === lastline) {
                    state = ParsingState.READING_HEADERS; // found boundary. start reading headers
                }
                lastline = '';
            } else if (ParsingState.READING_HEADERS === state && newLineDetected) {
                // parsing headers. Headers are separated by an empty line from the content. Stop reading headers when the line is empty
                if (lastline.length) {
                    currentPartHeaders.push(lastline);
                } else {
                    // found empty line. search for the headers we want and set the values
                    for (const h of currentPartHeaders) {
                        if (h.toLowerCase().startsWith('content-disposition:')) {
                            contentDispositionHeader = h;
                        } else if (h.toLowerCase().startsWith('content-type:')) {
                            contentTypeHeader = h;
                        }
                    }
                    state = ParsingState.READING_DATA;
                    buffer = [];
                }
                lastline = '';
            } else if (ParsingState.READING_DATA === state) {
                // parsing data
                if (lastline.length > boundary.length + 4) {
                    lastline = ''; // mem save
                }
                if ('--' + boundary === lastline) {
                    const j = buffer.length - lastline.length;
                    const part = buffer.slice(0, j - 1);
                    allParts.push(process({
                        contentDispositionHeader,
                        contentTypeHeader,
                        part
                    }));
                    buffer = [];
                    currentPartHeaders = [];
                    lastline = '';
                    state = ParsingState.READING_PART_SEPARATOR;
                    contentDispositionHeader = '';
                    contentTypeHeader = '';
                } else {
                    buffer.push(oneByte);
                }
                if (newLineDetected) {
                    lastline = '';
                }
            } else if (ParsingState.READING_PART_SEPARATOR === state) {
                if (newLineDetected) {
                    state = ParsingState.READING_HEADERS;
                }
            }
        }
        return allParts;
    }
    //  read the boundary from the content-type header sent by the http client
    //  this value may be similar to:
    //  'multipart/form-data; boundary=----WebKitFormBoundaryvm5A9tzU1ONaGP5B',
    function getBoundary(header) {
        const items = header.split(';');
        if (items) {
            for (let i = 0; i < items.length; i++) {
                const item = new String(items[i]).trim();
                if (item.indexOf('boundary') >= 0) {
                    const k = item.split('=');
                    return new String(k[1]).trim().replace(/^["']|["']$/g, '');
                }
            }
        }
        return '';
    }
    exports.getBoundary = getBoundary;
    exports.parse = parse;
}));