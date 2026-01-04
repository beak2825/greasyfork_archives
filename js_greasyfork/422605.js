// ==UserScript==
// @name        Inline image cache
// @namespace   letsgrowfast
// @description Speed up switching between tabs by storing inline images as they are encountered.
// @match       https://www.blaseball.com/*
// @version     1.0
// @license     blessing
// @grant       none
// @author      🌷
// @downloadURL https://update.greasyfork.org/scripts/422605/Inline%20image%20cache.user.js
// @updateURL https://update.greasyfork.org/scripts/422605/Inline%20image%20cache.meta.js
// ==/UserScript==

/*
At the time of writing, the Blaseball website includes 13MB of high-resolution art of snacks and decrees, stored as text inside a single huge javascript file.  Browsers don't handle parsing and displaying them well, especially firefox.  We convert them to blob URLs once, and cache them for all subsequent uses.  This reduces load times from ~1200ms (firefox) and 200-300ms (chrome, safari) to ~30ms in all browsers.
*/

function setup() {
    "use strict";
    var urlCache = new Map();
    var oldSetAttributeNS = window.SVGImageElement.prototype.setAttributeNS;
    SVGImageElement.prototype.setAttributeNS = function newSetAttributeNS(ns, attr, value) {
        var prefix = "data:img/png;base64,";
        if (ns === "http://www.w3.org/1999/xlink" && attr === "xlink:href" && value && value.length > 5000 && value.startsWith(prefix)) {
            var mappedValue = urlCache.get(value);
            if (!mappedValue) {
                mappedValue = URL.createObjectURL(dataURItoBlob(value));
                urlCache.set(value, mappedValue);
            }
          
            value = mappedValue;
        }
        oldSetAttributeNS.call(this, ns, attr, value);
    }

    // https://gist.github.com/davoclavo/4424731
    /*
    The MIT License (MIT)
    Copyright (c) 2016 David Gomez-Urquiza
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
    */
    function dataURItoBlob(dataURI) {
        // convert base64 to raw binary data held in a string
        var byteString = atob(dataURI.split(',')[1]);

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to an ArrayBuffer
        var arrayBuffer = new ArrayBuffer(byteString.length);
        var _ia = new Uint8Array(arrayBuffer);
        for (var i = 0; i < byteString.length; i++) {
            _ia[i] = byteString.charCodeAt(i);
        }

        var dataView = new DataView(arrayBuffer);
        var blob = new Blob([dataView], { type: mimeString });
        return blob;
    }
}
setup();