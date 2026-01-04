// ==UserScript==
// @name            Eldarya Enhancements
// @namespace       https://gitlab.com/NatoBoram/eldarya-enhancements
// @license         GPL-3.0-or-later
// @version         1.2.19
// @author          Nato Boram
// @description     Enhances the user experience of Eldarya.
// @description:pt  Aprimora a experiência do usuário de Eldarya.
// @description:de  Verbessert die Benutzererfahrung von Eldarya.
// @description:es  Mejora la experiencia del usuario de Eldarya.
// @description:hu  Javítja az Eldarya felhasználói élményét.
// @description:it  Migliora l'esperienza utente di Eldarya.
// @description:pl  Zwiększa wrażenia użytkownika Eldaryi.
// @description:ru  Повышает удобство использования Эльдарьи.
// @description:en  Enhances the user experience of Eldarya.
// @description:fr  Améliore l'expérience utilisateur d'Eldarya.
// @icon            https://gitlab.com/NatoBoram/eldarya-enhancements/-/raw/master/images/avatar.png
// @supportURL      https://gitlab.com/NatoBoram/eldarya-enhancements/-/issues
// @contributionURL https://paypal.me/NatoBoram/5
//
// @match https://www.eldarya.com.br/*
// @match https://www.eldarya.de/*
// @match https://www.eldarya.es/*
// @match https://www.eldarya.hu/*
// @match https://www.eldarya.it/*
// @match https://www.eldarya.pl/*
// @match https://www.eldarya.ru/*
// @match https://www.eldarya.com/*
// @match https://www.eldarya.fr/*
//
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/426533/Eldarya%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/426533/Eldarya%20Enhancements.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/.pnpm/blob-util@2.0.2/node_modules/blob-util/dist/blob-util.es.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/.pnpm/blob-util@2.0.2/node_modules/blob-util/dist/blob-util.es.js ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "arrayBufferToBinaryString": () => (/* binding */ arrayBufferToBinaryString),
/* harmony export */   "arrayBufferToBlob": () => (/* binding */ arrayBufferToBlob),
/* harmony export */   "base64StringToBlob": () => (/* binding */ base64StringToBlob),
/* harmony export */   "binaryStringToArrayBuffer": () => (/* binding */ binaryStringToArrayBuffer),
/* harmony export */   "binaryStringToBlob": () => (/* binding */ binaryStringToBlob),
/* harmony export */   "blobToArrayBuffer": () => (/* binding */ blobToArrayBuffer),
/* harmony export */   "blobToBase64String": () => (/* binding */ blobToBase64String),
/* harmony export */   "blobToBinaryString": () => (/* binding */ blobToBinaryString),
/* harmony export */   "blobToDataURL": () => (/* binding */ blobToDataURL),
/* harmony export */   "canvasToBlob": () => (/* binding */ canvasToBlob),
/* harmony export */   "createBlob": () => (/* binding */ createBlob),
/* harmony export */   "createObjectURL": () => (/* binding */ createObjectURL),
/* harmony export */   "dataURLToBlob": () => (/* binding */ dataURLToBlob),
/* harmony export */   "imgSrcToBlob": () => (/* binding */ imgSrcToBlob),
/* harmony export */   "imgSrcToDataURL": () => (/* binding */ imgSrcToDataURL),
/* harmony export */   "revokeObjectURL": () => (/* binding */ revokeObjectURL)
/* harmony export */ });
// TODO: including these in blob-util.ts causes typedoc to generate docs for them,
// even with --excludePrivate ¯\_(ツ)_/¯
/** @private */
function loadImage(src, crossOrigin) {
    return new Promise(function (resolve, reject) {
        var img = new Image();
        if (crossOrigin) {
            img.crossOrigin = crossOrigin;
        }
        img.onload = function () {
            resolve(img);
        };
        img.onerror = reject;
        img.src = src;
    });
}
/** @private */
function imgToCanvas(img) {
    var canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    // copy the image contents to the canvas
    var context = canvas.getContext('2d');
    context.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
    return canvas;
}

/* global Promise, Image, Blob, FileReader, atob, btoa,
   BlobBuilder, MSBlobBuilder, MozBlobBuilder, WebKitBlobBuilder, webkitURL */
/**
 * Shim for
 * [`new Blob()`](https://developer.mozilla.org/en-US/docs/Web/API/Blob.Blob)
 * to support
 * [older browsers that use the deprecated `BlobBuilder` API](http://caniuse.com/blob).
 *
 * Example:
 *
 * ```js
 * var myBlob = blobUtil.createBlob(['hello world'], {type: 'text/plain'});
 * ```
 *
 * @param parts - content of the Blob
 * @param properties - usually `{type: myContentType}`,
 *                           you can also pass a string for the content type
 * @returns Blob
 */
function createBlob(parts, properties) {
    parts = parts || [];
    properties = properties || {};
    if (typeof properties === 'string') {
        properties = { type: properties }; // infer content type
    }
    try {
        return new Blob(parts, properties);
    }
    catch (e) {
        if (e.name !== 'TypeError') {
            throw e;
        }
        var Builder = typeof BlobBuilder !== 'undefined'
            ? BlobBuilder : typeof MSBlobBuilder !== 'undefined'
            ? MSBlobBuilder : typeof MozBlobBuilder !== 'undefined'
            ? MozBlobBuilder : WebKitBlobBuilder;
        var builder = new Builder();
        for (var i = 0; i < parts.length; i += 1) {
            builder.append(parts[i]);
        }
        return builder.getBlob(properties.type);
    }
}
/**
 * Shim for
 * [`URL.createObjectURL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL.createObjectURL)
 * to support browsers that only have the prefixed
 * `webkitURL` (e.g. Android <4.4).
 *
 * Example:
 *
 * ```js
 * var myUrl = blobUtil.createObjectURL(blob);
 * ```
 *
 * @param blob
 * @returns url
 */
function createObjectURL(blob) {
    return (typeof URL !== 'undefined' ? URL : webkitURL).createObjectURL(blob);
}
/**
 * Shim for
 * [`URL.revokeObjectURL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL.revokeObjectURL)
 * to support browsers that only have the prefixed
 * `webkitURL` (e.g. Android <4.4).
 *
 * Example:
 *
 * ```js
 * blobUtil.revokeObjectURL(myUrl);
 * ```
 *
 * @param url
 */
function revokeObjectURL(url) {
    return (typeof URL !== 'undefined' ? URL : webkitURL).revokeObjectURL(url);
}
/**
 * Convert a `Blob` to a binary string.
 *
 * Example:
 *
 * ```js
 * blobUtil.blobToBinaryString(blob).then(function (binaryString) {
 *   // success
 * }).catch(function (err) {
 *   // error
 * });
 * ```
 *
 * @param blob
 * @returns Promise that resolves with the binary string
 */
function blobToBinaryString(blob) {
    return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        var hasBinaryString = typeof reader.readAsBinaryString === 'function';
        reader.onloadend = function () {
            var result = reader.result || '';
            if (hasBinaryString) {
                return resolve(result);
            }
            resolve(arrayBufferToBinaryString(result));
        };
        reader.onerror = reject;
        if (hasBinaryString) {
            reader.readAsBinaryString(blob);
        }
        else {
            reader.readAsArrayBuffer(blob);
        }
    });
}
/**
 * Convert a base64-encoded string to a `Blob`.
 *
 * Example:
 *
 * ```js
 * var blob = blobUtil.base64StringToBlob(base64String);
 * ```
 * @param base64 - base64-encoded string
 * @param type - the content type (optional)
 * @returns Blob
 */
function base64StringToBlob(base64, type) {
    var parts = [binaryStringToArrayBuffer(atob(base64))];
    return type ? createBlob(parts, { type: type }) : createBlob(parts);
}
/**
 * Convert a binary string to a `Blob`.
 *
 * Example:
 *
 * ```js
 * var blob = blobUtil.binaryStringToBlob(binaryString);
 * ```
 *
 * @param binary - binary string
 * @param type - the content type (optional)
 * @returns Blob
 */
function binaryStringToBlob(binary, type) {
    return base64StringToBlob(btoa(binary), type);
}
/**
 * Convert a `Blob` to a binary string.
 *
 * Example:
 *
 * ```js
 * blobUtil.blobToBase64String(blob).then(function (base64String) {
 *   // success
 * }).catch(function (err) {
 *   // error
 * });
 * ```
 *
 * @param blob
 * @returns Promise that resolves with the binary string
 */
function blobToBase64String(blob) {
    return blobToBinaryString(blob).then(btoa);
}
/**
 * Convert a data URL string
 * (e.g. `'data:image/png;base64,iVBORw0KG...'`)
 * to a `Blob`.
 *
 * Example:
 *
 * ```js
 * var blob = blobUtil.dataURLToBlob(dataURL);
 * ```
 *
 * @param dataURL - dataURL-encoded string
 * @returns Blob
 */
function dataURLToBlob(dataURL) {
    var type = dataURL.match(/data:([^;]+)/)[1];
    var base64 = dataURL.replace(/^[^,]+,/, '');
    var buff = binaryStringToArrayBuffer(atob(base64));
    return createBlob([buff], { type: type });
}
/**
 * Convert a `Blob` to a data URL string
 * (e.g. `'data:image/png;base64,iVBORw0KG...'`).
 *
 * Example:
 *
 * ```js
 * var dataURL = blobUtil.blobToDataURL(blob);
 * ```
 *
 * @param blob
 * @returns Promise that resolves with the data URL string
 */
function blobToDataURL(blob) {
    return blobToBase64String(blob).then(function (base64String) {
        return 'data:' + blob.type + ';base64,' + base64String;
    });
}
/**
 * Convert an image's `src` URL to a data URL by loading the image and painting
 * it to a `canvas`.
 *
 * Note: this will coerce the image to the desired content type, and it
 * will only paint the first frame of an animated GIF.
 *
 * Examples:
 *
 * ```js
 * blobUtil.imgSrcToDataURL('http://mysite.com/img.png').then(function (dataURL) {
 *   // success
 * }).catch(function (err) {
 *   // error
 * });
 * ```
 *
 * ```js
 * blobUtil.imgSrcToDataURL('http://some-other-site.com/img.jpg', 'image/jpeg',
 *                          'Anonymous', 1.0).then(function (dataURL) {
 *   // success
 * }).catch(function (err) {
 *   // error
 * });
 * ```
 *
 * @param src - image src
 * @param type - the content type (optional, defaults to 'image/png')
 * @param crossOrigin - for CORS-enabled images, set this to
 *                                         'Anonymous' to avoid "tainted canvas" errors
 * @param quality - a number between 0 and 1 indicating image quality
 *                                     if the requested type is 'image/jpeg' or 'image/webp'
 * @returns Promise that resolves with the data URL string
 */
function imgSrcToDataURL(src, type, crossOrigin, quality) {
    type = type || 'image/png';
    return loadImage(src, crossOrigin).then(imgToCanvas).then(function (canvas) {
        return canvas.toDataURL(type, quality);
    });
}
/**
 * Convert a `canvas` to a `Blob`.
 *
 * Examples:
 *
 * ```js
 * blobUtil.canvasToBlob(canvas).then(function (blob) {
 *   // success
 * }).catch(function (err) {
 *   // error
 * });
 * ```
 *
 * Most browsers support converting a canvas to both `'image/png'` and `'image/jpeg'`. You may
 * also want to try `'image/webp'`, which will work in some browsers like Chrome (and in other browsers, will just fall back to `'image/png'`):
 *
 * ```js
 * blobUtil.canvasToBlob(canvas, 'image/webp').then(function (blob) {
 *   // success
 * }).catch(function (err) {
 *   // error
 * });
 * ```
 *
 * @param canvas - HTMLCanvasElement
 * @param type - the content type (optional, defaults to 'image/png')
 * @param quality - a number between 0 and 1 indicating image quality
 *                                     if the requested type is 'image/jpeg' or 'image/webp'
 * @returns Promise that resolves with the `Blob`
 */
function canvasToBlob(canvas, type, quality) {
    if (typeof canvas.toBlob === 'function') {
        return new Promise(function (resolve) {
            canvas.toBlob(resolve, type, quality);
        });
    }
    return Promise.resolve(dataURLToBlob(canvas.toDataURL(type, quality)));
}
/**
 * Convert an image's `src` URL to a `Blob` by loading the image and painting
 * it to a `canvas`.
 *
 * Note: this will coerce the image to the desired content type, and it
 * will only paint the first frame of an animated GIF.
 *
 * Examples:
 *
 * ```js
 * blobUtil.imgSrcToBlob('http://mysite.com/img.png').then(function (blob) {
 *   // success
 * }).catch(function (err) {
 *   // error
 * });
 * ```
 *
 * ```js
 * blobUtil.imgSrcToBlob('http://some-other-site.com/img.jpg', 'image/jpeg',
 *                          'Anonymous', 1.0).then(function (blob) {
 *   // success
 * }).catch(function (err) {
 *   // error
 * });
 * ```
 *
 * @param src - image src
 * @param type - the content type (optional, defaults to 'image/png')
 * @param crossOrigin - for CORS-enabled images, set this to
 *                                         'Anonymous' to avoid "tainted canvas" errors
 * @param quality - a number between 0 and 1 indicating image quality
 *                                     if the requested type is 'image/jpeg' or 'image/webp'
 * @returns Promise that resolves with the `Blob`
 */
function imgSrcToBlob(src, type, crossOrigin, quality) {
    type = type || 'image/png';
    return loadImage(src, crossOrigin).then(imgToCanvas).then(function (canvas) {
        return canvasToBlob(canvas, type, quality);
    });
}
/**
 * Convert an `ArrayBuffer` to a `Blob`.
 *
 * Example:
 *
 * ```js
 * var blob = blobUtil.arrayBufferToBlob(arrayBuff, 'audio/mpeg');
 * ```
 *
 * @param buffer
 * @param type - the content type (optional)
 * @returns Blob
 */
function arrayBufferToBlob(buffer, type) {
    return createBlob([buffer], type);
}
/**
 * Convert a `Blob` to an `ArrayBuffer`.
 *
 * Example:
 *
 * ```js
 * blobUtil.blobToArrayBuffer(blob).then(function (arrayBuff) {
 *   // success
 * }).catch(function (err) {
 *   // error
 * });
 * ```
 *
 * @param blob
 * @returns Promise that resolves with the `ArrayBuffer`
 */
function blobToArrayBuffer(blob) {
    return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        reader.onloadend = function () {
            var result = reader.result || new ArrayBuffer(0);
            resolve(result);
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(blob);
    });
}
/**
 * Convert an `ArrayBuffer` to a binary string.
 *
 * Example:
 *
 * ```js
 * var myString = blobUtil.arrayBufferToBinaryString(arrayBuff)
 * ```
 *
 * @param buffer - array buffer
 * @returns binary string
 */
function arrayBufferToBinaryString(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var length = bytes.byteLength;
    var i = -1;
    while (++i < length) {
        binary += String.fromCharCode(bytes[i]);
    }
    return binary;
}
/**
 * Convert a binary string to an `ArrayBuffer`.
 *
 * ```js
 * var myBuffer = blobUtil.binaryStringToArrayBuffer(binaryString)
 * ```
 *
 * @param binary - binary string
 * @returns array buffer
 */
function binaryStringToArrayBuffer(binary) {
    var length = binary.length;
    var buf = new ArrayBuffer(length);
    var arr = new Uint8Array(buf);
    var i = -1;
    while (++i < length) {
        arr[i] = binary.charCodeAt(i);
    }
    return buf;
}




/***/ }),

/***/ "./node_modules/.pnpm/hogan.js@3.0.2/node_modules/hogan.js/lib/compiler.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/.pnpm/hogan.js@3.0.2/node_modules/hogan.js/lib/compiler.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

/*
 *  Copyright 2011 Twitter, Inc.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

(function (Hogan) {
  // Setup regex  assignments
  // remove whitespace according to Mustache spec
  var rIsWhitespace = /\S/,
      rQuot = /\"/g,
      rNewline =  /\n/g,
      rCr = /\r/g,
      rSlash = /\\/g,
      rLineSep = /\u2028/,
      rParagraphSep = /\u2029/;

  Hogan.tags = {
    '#': 1, '^': 2, '<': 3, '$': 4,
    '/': 5, '!': 6, '>': 7, '=': 8, '_v': 9,
    '{': 10, '&': 11, '_t': 12
  };

  Hogan.scan = function scan(text, delimiters) {
    var len = text.length,
        IN_TEXT = 0,
        IN_TAG_TYPE = 1,
        IN_TAG = 2,
        state = IN_TEXT,
        tagType = null,
        tag = null,
        buf = '',
        tokens = [],
        seenTag = false,
        i = 0,
        lineStart = 0,
        otag = '{{',
        ctag = '}}';

    function addBuf() {
      if (buf.length > 0) {
        tokens.push({tag: '_t', text: new String(buf)});
        buf = '';
      }
    }

    function lineIsWhitespace() {
      var isAllWhitespace = true;
      for (var j = lineStart; j < tokens.length; j++) {
        isAllWhitespace =
          (Hogan.tags[tokens[j].tag] < Hogan.tags['_v']) ||
          (tokens[j].tag == '_t' && tokens[j].text.match(rIsWhitespace) === null);
        if (!isAllWhitespace) {
          return false;
        }
      }

      return isAllWhitespace;
    }

    function filterLine(haveSeenTag, noNewLine) {
      addBuf();

      if (haveSeenTag && lineIsWhitespace()) {
        for (var j = lineStart, next; j < tokens.length; j++) {
          if (tokens[j].text) {
            if ((next = tokens[j+1]) && next.tag == '>') {
              // set indent to token value
              next.indent = tokens[j].text.toString()
            }
            tokens.splice(j, 1);
          }
        }
      } else if (!noNewLine) {
        tokens.push({tag:'\n'});
      }

      seenTag = false;
      lineStart = tokens.length;
    }

    function changeDelimiters(text, index) {
      var close = '=' + ctag,
          closeIndex = text.indexOf(close, index),
          delimiters = trim(
            text.substring(text.indexOf('=', index) + 1, closeIndex)
          ).split(' ');

      otag = delimiters[0];
      ctag = delimiters[delimiters.length - 1];

      return closeIndex + close.length - 1;
    }

    if (delimiters) {
      delimiters = delimiters.split(' ');
      otag = delimiters[0];
      ctag = delimiters[1];
    }

    for (i = 0; i < len; i++) {
      if (state == IN_TEXT) {
        if (tagChange(otag, text, i)) {
          --i;
          addBuf();
          state = IN_TAG_TYPE;
        } else {
          if (text.charAt(i) == '\n') {
            filterLine(seenTag);
          } else {
            buf += text.charAt(i);
          }
        }
      } else if (state == IN_TAG_TYPE) {
        i += otag.length - 1;
        tag = Hogan.tags[text.charAt(i + 1)];
        tagType = tag ? text.charAt(i + 1) : '_v';
        if (tagType == '=') {
          i = changeDelimiters(text, i);
          state = IN_TEXT;
        } else {
          if (tag) {
            i++;
          }
          state = IN_TAG;
        }
        seenTag = i;
      } else {
        if (tagChange(ctag, text, i)) {
          tokens.push({tag: tagType, n: trim(buf), otag: otag, ctag: ctag,
                       i: (tagType == '/') ? seenTag - otag.length : i + ctag.length});
          buf = '';
          i += ctag.length - 1;
          state = IN_TEXT;
          if (tagType == '{') {
            if (ctag == '}}') {
              i++;
            } else {
              cleanTripleStache(tokens[tokens.length - 1]);
            }
          }
        } else {
          buf += text.charAt(i);
        }
      }
    }

    filterLine(seenTag, true);

    return tokens;
  }

  function cleanTripleStache(token) {
    if (token.n.substr(token.n.length - 1) === '}') {
      token.n = token.n.substring(0, token.n.length - 1);
    }
  }

  function trim(s) {
    if (s.trim) {
      return s.trim();
    }

    return s.replace(/^\s*|\s*$/g, '');
  }

  function tagChange(tag, text, index) {
    if (text.charAt(index) != tag.charAt(0)) {
      return false;
    }

    for (var i = 1, l = tag.length; i < l; i++) {
      if (text.charAt(index + i) != tag.charAt(i)) {
        return false;
      }
    }

    return true;
  }

  // the tags allowed inside super templates
  var allowedInSuper = {'_t': true, '\n': true, '$': true, '/': true};

  function buildTree(tokens, kind, stack, customTags) {
    var instructions = [],
        opener = null,
        tail = null,
        token = null;

    tail = stack[stack.length - 1];

    while (tokens.length > 0) {
      token = tokens.shift();

      if (tail && tail.tag == '<' && !(token.tag in allowedInSuper)) {
        throw new Error('Illegal content in < super tag.');
      }

      if (Hogan.tags[token.tag] <= Hogan.tags['$'] || isOpener(token, customTags)) {
        stack.push(token);
        token.nodes = buildTree(tokens, token.tag, stack, customTags);
      } else if (token.tag == '/') {
        if (stack.length === 0) {
          throw new Error('Closing tag without opener: /' + token.n);
        }
        opener = stack.pop();
        if (token.n != opener.n && !isCloser(token.n, opener.n, customTags)) {
          throw new Error('Nesting error: ' + opener.n + ' vs. ' + token.n);
        }
        opener.end = token.i;
        return instructions;
      } else if (token.tag == '\n') {
        token.last = (tokens.length == 0) || (tokens[0].tag == '\n');
      }

      instructions.push(token);
    }

    if (stack.length > 0) {
      throw new Error('missing closing tag: ' + stack.pop().n);
    }

    return instructions;
  }

  function isOpener(token, tags) {
    for (var i = 0, l = tags.length; i < l; i++) {
      if (tags[i].o == token.n) {
        token.tag = '#';
        return true;
      }
    }
  }

  function isCloser(close, open, tags) {
    for (var i = 0, l = tags.length; i < l; i++) {
      if (tags[i].c == close && tags[i].o == open) {
        return true;
      }
    }
  }

  function stringifySubstitutions(obj) {
    var items = [];
    for (var key in obj) {
      items.push('"' + esc(key) + '": function(c,p,t,i) {' + obj[key] + '}');
    }
    return "{ " + items.join(",") + " }";
  }

  function stringifyPartials(codeObj) {
    var partials = [];
    for (var key in codeObj.partials) {
      partials.push('"' + esc(key) + '":{name:"' + esc(codeObj.partials[key].name) + '", ' + stringifyPartials(codeObj.partials[key]) + "}");
    }
    return "partials: {" + partials.join(",") + "}, subs: " + stringifySubstitutions(codeObj.subs);
  }

  Hogan.stringify = function(codeObj, text, options) {
    return "{code: function (c,p,i) { " + Hogan.wrapMain(codeObj.code) + " }," + stringifyPartials(codeObj) +  "}";
  }

  var serialNo = 0;
  Hogan.generate = function(tree, text, options) {
    serialNo = 0;
    var context = { code: '', subs: {}, partials: {} };
    Hogan.walk(tree, context);

    if (options.asString) {
      return this.stringify(context, text, options);
    }

    return this.makeTemplate(context, text, options);
  }

  Hogan.wrapMain = function(code) {
    return 'var t=this;t.b(i=i||"");' + code + 'return t.fl();';
  }

  Hogan.template = Hogan.Template;

  Hogan.makeTemplate = function(codeObj, text, options) {
    var template = this.makePartials(codeObj);
    template.code = new Function('c', 'p', 'i', this.wrapMain(codeObj.code));
    return new this.template(template, text, this, options);
  }

  Hogan.makePartials = function(codeObj) {
    var key, template = {subs: {}, partials: codeObj.partials, name: codeObj.name};
    for (key in template.partials) {
      template.partials[key] = this.makePartials(template.partials[key]);
    }
    for (key in codeObj.subs) {
      template.subs[key] = new Function('c', 'p', 't', 'i', codeObj.subs[key]);
    }
    return template;
  }

  function esc(s) {
    return s.replace(rSlash, '\\\\')
            .replace(rQuot, '\\\"')
            .replace(rNewline, '\\n')
            .replace(rCr, '\\r')
            .replace(rLineSep, '\\u2028')
            .replace(rParagraphSep, '\\u2029');
  }

  function chooseMethod(s) {
    return (~s.indexOf('.')) ? 'd' : 'f';
  }

  function createPartial(node, context) {
    var prefix = "<" + (context.prefix || "");
    var sym = prefix + node.n + serialNo++;
    context.partials[sym] = {name: node.n, partials: {}};
    context.code += 't.b(t.rp("' +  esc(sym) + '",c,p,"' + (node.indent || '') + '"));';
    return sym;
  }

  Hogan.codegen = {
    '#': function(node, context) {
      context.code += 'if(t.s(t.' + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,1),' +
                      'c,p,0,' + node.i + ',' + node.end + ',"' + node.otag + " " + node.ctag + '")){' +
                      't.rs(c,p,' + 'function(c,p,t){';
      Hogan.walk(node.nodes, context);
      context.code += '});c.pop();}';
    },

    '^': function(node, context) {
      context.code += 'if(!t.s(t.' + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,1),c,p,1,0,0,"")){';
      Hogan.walk(node.nodes, context);
      context.code += '};';
    },

    '>': createPartial,
    '<': function(node, context) {
      var ctx = {partials: {}, code: '', subs: {}, inPartial: true};
      Hogan.walk(node.nodes, ctx);
      var template = context.partials[createPartial(node, context)];
      template.subs = ctx.subs;
      template.partials = ctx.partials;
    },

    '$': function(node, context) {
      var ctx = {subs: {}, code: '', partials: context.partials, prefix: node.n};
      Hogan.walk(node.nodes, ctx);
      context.subs[node.n] = ctx.code;
      if (!context.inPartial) {
        context.code += 't.sub("' + esc(node.n) + '",c,p,i);';
      }
    },

    '\n': function(node, context) {
      context.code += write('"\\n"' + (node.last ? '' : ' + i'));
    },

    '_v': function(node, context) {
      context.code += 't.b(t.v(t.' + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,0)));';
    },

    '_t': function(node, context) {
      context.code += write('"' + esc(node.text) + '"');
    },

    '{': tripleStache,

    '&': tripleStache
  }

  function tripleStache(node, context) {
    context.code += 't.b(t.t(t.' + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,0)));';
  }

  function write(s) {
    return 't.b(' + s + ');';
  }

  Hogan.walk = function(nodelist, context) {
    var func;
    for (var i = 0, l = nodelist.length; i < l; i++) {
      func = Hogan.codegen[nodelist[i].tag];
      func && func(nodelist[i], context);
    }
    return context;
  }

  Hogan.parse = function(tokens, text, options) {
    options = options || {};
    return buildTree(tokens, '', [], options.sectionTags || []);
  }

  Hogan.cache = {};

  Hogan.cacheKey = function(text, options) {
    return [text, !!options.asString, !!options.disableLambda, options.delimiters, !!options.modelGet].join('||');
  }

  Hogan.compile = function(text, options) {
    options = options || {};
    var key = Hogan.cacheKey(text, options);
    var template = this.cache[key];

    if (template) {
      var partials = template.partials;
      for (var name in partials) {
        delete partials[name].instance;
      }
      return template;
    }

    template = this.generate(this.parse(this.scan(text, options.delimiters), text, options), text, options);
    return this.cache[key] = template;
  }
})( true ? exports : 0);


/***/ }),

/***/ "./node_modules/.pnpm/hogan.js@3.0.2/node_modules/hogan.js/lib/hogan.js":
/*!******************************************************************************!*\
  !*** ./node_modules/.pnpm/hogan.js@3.0.2/node_modules/hogan.js/lib/hogan.js ***!
  \******************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 *  Copyright 2011 Twitter, Inc.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

// This file is for use with Node.js. See dist/ for browser files.

var Hogan = __webpack_require__(/*! ./compiler */ "./node_modules/.pnpm/hogan.js@3.0.2/node_modules/hogan.js/lib/compiler.js");
Hogan.Template = (__webpack_require__(/*! ./template */ "./node_modules/.pnpm/hogan.js@3.0.2/node_modules/hogan.js/lib/template.js").Template);
Hogan.template = Hogan.Template;
module.exports = Hogan;


/***/ }),

/***/ "./node_modules/.pnpm/hogan.js@3.0.2/node_modules/hogan.js/lib/template.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/.pnpm/hogan.js@3.0.2/node_modules/hogan.js/lib/template.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

/*
 *  Copyright 2011 Twitter, Inc.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

var Hogan = {};

(function (Hogan) {
  Hogan.Template = function (codeObj, text, compiler, options) {
    codeObj = codeObj || {};
    this.r = codeObj.code || this.r;
    this.c = compiler;
    this.options = options || {};
    this.text = text || '';
    this.partials = codeObj.partials || {};
    this.subs = codeObj.subs || {};
    this.buf = '';
  }

  Hogan.Template.prototype = {
    // render: replaced by generated code.
    r: function (context, partials, indent) { return ''; },

    // variable escaping
    v: hoganEscape,

    // triple stache
    t: coerceToString,

    render: function render(context, partials, indent) {
      return this.ri([context], partials || {}, indent);
    },

    // render internal -- a hook for overrides that catches partials too
    ri: function (context, partials, indent) {
      return this.r(context, partials, indent);
    },

    // ensurePartial
    ep: function(symbol, partials) {
      var partial = this.partials[symbol];

      // check to see that if we've instantiated this partial before
      var template = partials[partial.name];
      if (partial.instance && partial.base == template) {
        return partial.instance;
      }

      if (typeof template == 'string') {
        if (!this.c) {
          throw new Error("No compiler available.");
        }
        template = this.c.compile(template, this.options);
      }

      if (!template) {
        return null;
      }

      // We use this to check whether the partials dictionary has changed
      this.partials[symbol].base = template;

      if (partial.subs) {
        // Make sure we consider parent template now
        if (!partials.stackText) partials.stackText = {};
        for (key in partial.subs) {
          if (!partials.stackText[key]) {
            partials.stackText[key] = (this.activeSub !== undefined && partials.stackText[this.activeSub]) ? partials.stackText[this.activeSub] : this.text;
          }
        }
        template = createSpecializedPartial(template, partial.subs, partial.partials,
          this.stackSubs, this.stackPartials, partials.stackText);
      }
      this.partials[symbol].instance = template;

      return template;
    },

    // tries to find a partial in the current scope and render it
    rp: function(symbol, context, partials, indent) {
      var partial = this.ep(symbol, partials);
      if (!partial) {
        return '';
      }

      return partial.ri(context, partials, indent);
    },

    // render a section
    rs: function(context, partials, section) {
      var tail = context[context.length - 1];

      if (!isArray(tail)) {
        section(context, partials, this);
        return;
      }

      for (var i = 0; i < tail.length; i++) {
        context.push(tail[i]);
        section(context, partials, this);
        context.pop();
      }
    },

    // maybe start a section
    s: function(val, ctx, partials, inverted, start, end, tags) {
      var pass;

      if (isArray(val) && val.length === 0) {
        return false;
      }

      if (typeof val == 'function') {
        val = this.ms(val, ctx, partials, inverted, start, end, tags);
      }

      pass = !!val;

      if (!inverted && pass && ctx) {
        ctx.push((typeof val == 'object') ? val : ctx[ctx.length - 1]);
      }

      return pass;
    },

    // find values with dotted names
    d: function(key, ctx, partials, returnFound) {
      var found,
          names = key.split('.'),
          val = this.f(names[0], ctx, partials, returnFound),
          doModelGet = this.options.modelGet,
          cx = null;

      if (key === '.' && isArray(ctx[ctx.length - 2])) {
        val = ctx[ctx.length - 1];
      } else {
        for (var i = 1; i < names.length; i++) {
          found = findInScope(names[i], val, doModelGet);
          if (found !== undefined) {
            cx = val;
            val = found;
          } else {
            val = '';
          }
        }
      }

      if (returnFound && !val) {
        return false;
      }

      if (!returnFound && typeof val == 'function') {
        ctx.push(cx);
        val = this.mv(val, ctx, partials);
        ctx.pop();
      }

      return val;
    },

    // find values with normal names
    f: function(key, ctx, partials, returnFound) {
      var val = false,
          v = null,
          found = false,
          doModelGet = this.options.modelGet;

      for (var i = ctx.length - 1; i >= 0; i--) {
        v = ctx[i];
        val = findInScope(key, v, doModelGet);
        if (val !== undefined) {
          found = true;
          break;
        }
      }

      if (!found) {
        return (returnFound) ? false : "";
      }

      if (!returnFound && typeof val == 'function') {
        val = this.mv(val, ctx, partials);
      }

      return val;
    },

    // higher order templates
    ls: function(func, cx, partials, text, tags) {
      var oldTags = this.options.delimiters;

      this.options.delimiters = tags;
      this.b(this.ct(coerceToString(func.call(cx, text)), cx, partials));
      this.options.delimiters = oldTags;

      return false;
    },

    // compile text
    ct: function(text, cx, partials) {
      if (this.options.disableLambda) {
        throw new Error('Lambda features disabled.');
      }
      return this.c.compile(text, this.options).render(cx, partials);
    },

    // template result buffering
    b: function(s) { this.buf += s; },

    fl: function() { var r = this.buf; this.buf = ''; return r; },

    // method replace section
    ms: function(func, ctx, partials, inverted, start, end, tags) {
      var textSource,
          cx = ctx[ctx.length - 1],
          result = func.call(cx);

      if (typeof result == 'function') {
        if (inverted) {
          return true;
        } else {
          textSource = (this.activeSub && this.subsText && this.subsText[this.activeSub]) ? this.subsText[this.activeSub] : this.text;
          return this.ls(result, cx, partials, textSource.substring(start, end), tags);
        }
      }

      return result;
    },

    // method replace variable
    mv: function(func, ctx, partials) {
      var cx = ctx[ctx.length - 1];
      var result = func.call(cx);

      if (typeof result == 'function') {
        return this.ct(coerceToString(result.call(cx)), cx, partials);
      }

      return result;
    },

    sub: function(name, context, partials, indent) {
      var f = this.subs[name];
      if (f) {
        this.activeSub = name;
        f(context, partials, this, indent);
        this.activeSub = false;
      }
    }

  };

  //Find a key in an object
  function findInScope(key, scope, doModelGet) {
    var val;

    if (scope && typeof scope == 'object') {

      if (scope[key] !== undefined) {
        val = scope[key];

      // try lookup with get for backbone or similar model data
      } else if (doModelGet && scope.get && typeof scope.get == 'function') {
        val = scope.get(key);
      }
    }

    return val;
  }

  function createSpecializedPartial(instance, subs, partials, stackSubs, stackPartials, stackText) {
    function PartialTemplate() {};
    PartialTemplate.prototype = instance;
    function Substitutions() {};
    Substitutions.prototype = instance.subs;
    var key;
    var partial = new PartialTemplate();
    partial.subs = new Substitutions();
    partial.subsText = {};  //hehe. substext.
    partial.buf = '';

    stackSubs = stackSubs || {};
    partial.stackSubs = stackSubs;
    partial.subsText = stackText;
    for (key in subs) {
      if (!stackSubs[key]) stackSubs[key] = subs[key];
    }
    for (key in stackSubs) {
      partial.subs[key] = stackSubs[key];
    }

    stackPartials = stackPartials || {};
    partial.stackPartials = stackPartials;
    for (key in partials) {
      if (!stackPartials[key]) stackPartials[key] = partials[key];
    }
    for (key in stackPartials) {
      partial.partials[key] = stackPartials[key];
    }

    return partial;
  }

  var rAmp = /&/g,
      rLt = /</g,
      rGt = />/g,
      rApos = /\'/g,
      rQuot = /\"/g,
      hChars = /[&<>\"\']/;

  function coerceToString(val) {
    return String((val === null || val === undefined) ? '' : val);
  }

  function hoganEscape(str) {
    str = coerceToString(str);
    return hChars.test(str) ?
      str
        .replace(rAmp, '&amp;')
        .replace(rLt, '&lt;')
        .replace(rGt, '&gt;')
        .replace(rApos, '&#39;')
        .replace(rQuot, '&quot;') :
      str;
  }

  var isArray = Array.isArray || function(a) {
    return Object.prototype.toString.call(a) === '[object Array]';
  };

})( true ? exports : 0);


/***/ }),

/***/ "./src/templates/html/appearance_item.html":
/*!*************************************************!*\
  !*** ./src/templates/html/appearance_item.html ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var H = __webpack_require__(/*! hogan.js */ "./node_modules/.pnpm/hogan.js@3.0.2/node_modules/hogan.js/lib/hogan.js");
module.exports = function() { var T = new H.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<li");t.b("\n" + i);t.b("  id=\"appearance-item-");t.b(t.v(t.f("itemid",c,p,0)));t.b("\"");t.b("\n" + i);t.b("  class=\"appearance-item group-");t.b(t.v(t.f("group",c,p,0)));t.b("\"");t.b("\n" + i);t.b("  data-itemid=\"");t.b(t.v(t.f("itemid",c,p,0)));t.b("\"");t.b("\n" + i);t.b("  data-name=\"");t.b(t.v(t.f("name",c,p,0)));t.b("\"");t.b("\n" + i);t.b("  data-rarity=\"");t.b(t.v(t.f("rarity",c,p,0)));t.b("\"");t.b("\n" + i);t.b("  data-rarityname=\"");t.b(t.v(t.f("rarityname",c,p,0)));t.b("\"");t.b("\n" + i);t.b(">");t.b("\n" + i);t.b("  <div class=\"rarity-marker-");t.b(t.v(t.f("rarity",c,p,0)));t.b("\"></div>");t.b("\n" + i);t.b("  <img class=\"appearance-item-icon\" src=\"");t.b(t.v(t.f("icon",c,p,0)));t.b("\" />");t.b("\n" + i);t.b("</li>");t.b("\n");return t.fl(); },partials: {}, subs: {  }}, "<li\n  id=\"appearance-item-{{itemid}}\"\n  class=\"appearance-item group-{{group}}\"\n  data-itemid=\"{{itemid}}\"\n  data-name=\"{{name}}\"\n  data-rarity=\"{{rarity}}\"\n  data-rarityname=\"{{rarityname}}\"\n>\n  <div class=\"rarity-marker-{{rarity}}\"></div>\n  <img class=\"appearance-item-icon\" src=\"{{icon}}\" />\n</li>\n", H);return T; }();

/***/ }),

/***/ "./src/templates/html/appearance_items_category.html":
/*!***********************************************************!*\
  !*** ./src/templates/html/appearance_items_category.html ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var H = __webpack_require__(/*! hogan.js */ "./node_modules/.pnpm/hogan.js@3.0.2/node_modules/hogan.js/lib/hogan.js");
module.exports = function() { var T = new H.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<div");t.b("\n" + i);t.b("  id=\"ee-category\"");t.b("\n" + i);t.b("  class=\"appearance-items-category active\"");t.b("\n" + i);t.b("  data-category=\"");t.b(t.v(t.f("category",c,p,0)));t.b("\"");t.b("\n" + i);t.b("  data-categoryid=\"");t.b(t.v(t.f("categoryid",c,p,0)));t.b("\"");t.b("\n" + i);t.b(">");t.b("\n" + i);t.b("  <style>");t.b("\n" + i);t.b("    #ee-items {");t.b("\n" + i);t.b("      scrollbar-color: dark;");t.b("\n" + i);t.b("      scrollbar-width: thin;");t.b("\n" + i);t.b("    }");t.b("\n" + i);t.b("  </style>");t.b("\n" + i);t.b("  <ul");t.b("\n" + i);t.b("    class=\"appearance-items-list\"");t.b("\n" + i);t.b("    id=\"ee-items\"");t.b("\n" + i);t.b("    style=\"max-height: calc(100vh - 565px)\"");t.b("\n" + i);t.b("  >");t.b("\n" + i);t.b("    ");t.b(t.t(t.f("items",c,p,0)));t.b("\n" + i);t.b("  </ul>");t.b("\n");t.b("\n" + i);t.b("  <!-- Info -->");t.b("\n" + i);t.b("  <div id=\"ee-info\" class=\"appearance-items-info\">");t.b("\n" + i);t.b("    <div class=\"appearance-info-tips\"></div>");t.b("\n");t.b("\n" + i);t.b("    <h3 class=\"appearance-item-info-name\"></h3>");t.b("\n");t.b("\n" + i);t.b("    <div class=\"appearance-item-info-guard\"></div>");t.b("\n" + i);t.b("    <div class=\"appearance-item-info-rarity\"></div>");t.b("\n" + i);t.b("    <div class=\"appearance-item-info-buttons\">");t.b("\n" + i);t.b("      <div class=\"appearance-forward nl-button\">");t.b("\n" + i);t.b("        ");t.b(t.v(t.d("translate.appearance.buttons.forward",c,p,0)));t.b("\n" + i);t.b("      </div>");t.b("\n" + i);t.b("      <div class=\"appearance-backward nl-button\">");t.b("\n" + i);t.b("        ");t.b(t.v(t.d("translate.appearance.buttons.backward",c,p,0)));t.b("\n" + i);t.b("      </div>");t.b("\n" + i);t.b("    </div>");t.b("\n" + i);t.b("  </div>");t.b("\n" + i);t.b("</div>");t.b("\n");return t.fl(); },partials: {}, subs: {  }}, "<div\n  id=\"ee-category\"\n  class=\"appearance-items-category active\"\n  data-category=\"{{category}}\"\n  data-categoryid=\"{{categoryid}}\"\n>\n  <style>\n    #ee-items {\n      scrollbar-color: dark;\n      scrollbar-width: thin;\n    }\n  </style>\n  <ul\n    class=\"appearance-items-list\"\n    id=\"ee-items\"\n    style=\"max-height: calc(100vh - 565px)\"\n  >\n    {{{items}}}\n  </ul>\n\n  <!-- Info -->\n  <div id=\"ee-info\" class=\"appearance-items-info\">\n    <div class=\"appearance-info-tips\"></div>\n\n    <h3 class=\"appearance-item-info-name\"></h3>\n\n    <div class=\"appearance-item-info-guard\"></div>\n    <div class=\"appearance-item-info-rarity\"></div>\n    <div class=\"appearance-item-info-buttons\">\n      <div class=\"appearance-forward nl-button\">\n        {{translate.appearance.buttons.forward}}\n      </div>\n      <div class=\"appearance-backward nl-button\">\n        {{translate.appearance.buttons.backward}}\n      </div>\n    </div>\n  </div>\n</div>\n", H);return T; }();

/***/ }),

/***/ "./src/templates/html/appearance_items_group.html":
/*!********************************************************!*\
  !*** ./src/templates/html/appearance_items_group.html ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var H = __webpack_require__(/*! hogan.js */ "./node_modules/.pnpm/hogan.js@3.0.2/node_modules/hogan.js/lib/hogan.js");
module.exports = function() { var T = new H.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<div");t.b("\n" + i);t.b("  id=\"appearance-items-group-");t.b(t.v(t.f("group",c,p,0)));t.b("\"");t.b("\n" + i);t.b("  class=\"appearance-items-category\"");t.b("\n" + i);t.b("  data-categoryid=\"");t.b(t.v(t.f("categoryid",c,p,0)));t.b("\"");t.b("\n" + i);t.b("  data-category=\"");t.b(t.v(t.f("category",c,p,0)));t.b("\"");t.b("\n" + i);t.b(">");t.b("\n" + i);t.b("  <ul class=\"appearance-items-list\">");t.b("\n" + i);t.b("    ");t.b(t.t(t.f("items",c,p,0)));t.b("\n" + i);t.b("  </ul>");t.b("\n" + i);t.b("</div>");t.b("\n");return t.fl(); },partials: {}, subs: {  }}, "<div\n  id=\"appearance-items-group-{{group}}\"\n  class=\"appearance-items-category\"\n  data-categoryid=\"{{categoryid}}\"\n  data-category=\"{{category}}\"\n>\n  <ul class=\"appearance-items-list\">\n    {{{items}}}\n  </ul>\n</div>\n", H);return T; }();

/***/ }),

/***/ "./src/templates/html/auto_buy_button.html":
/*!*************************************************!*\
  !*** ./src/templates/html/auto_buy_button.html ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var H = __webpack_require__(/*! hogan.js */ "./node_modules/.pnpm/hogan.js@3.0.2/node_modules/hogan.js/lib/hogan.js");
module.exports = function() { var T = new H.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<div");t.b("\n" + i);t.b("  id=\"marketplace-itemDetail-info-autobuy\"");t.b("\n" + i);t.b("  style=\"text-align: center; margin: 20px auto\"");t.b("\n" + i);t.b(">");t.b("\n" + i);t.b("  <div class=\"nl-button\">");t.b(t.v(t.d("translate.market.add_to_wishlist.title",c,p,0)));t.b("</div>");t.b("\n" + i);t.b("</div>");t.b("\n");return t.fl(); },partials: {}, subs: {  }}, "<div\n  id=\"marketplace-itemDetail-info-autobuy\"\n  style=\"text-align: center; margin: 20px auto\"\n>\n  <div class=\"nl-button\">{{translate.market.add_to_wishlist.title}}</div>\n</div>\n", H);return T; }();

/***/ }),

/***/ "./src/templates/html/auto_buy_flavr.html":
/*!************************************************!*\
  !*** ./src/templates/html/auto_buy_flavr.html ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var H = __webpack_require__(/*! hogan.js */ "./node_modules/.pnpm/hogan.js@3.0.2/node_modules/hogan.js/lib/hogan.js");
module.exports = function() { var T = new H.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<h1>");t.b(t.v(t.d("translate.market.add_to_wishlist.title",c,p,0)));t.b("</h1>");t.b("\n" + i);t.b("<p>");t.b(t.v(t.d("translate.market.add_to_wishlist.text",c,p,0)));t.b("</p>");t.b("\n");return t.fl(); },partials: {}, subs: {  }}, "<h1>{{translate.market.add_to_wishlist.title}}</h1>\n<p>{{translate.market.add_to_wishlist.text}}</p>\n", H);return T; }();

/***/ }),

/***/ "./src/templates/html/auto_buy_flavr_mall.html":
/*!*****************************************************!*\
  !*** ./src/templates/html/auto_buy_flavr_mall.html ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var H = __webpack_require__(/*! hogan.js */ "./node_modules/.pnpm/hogan.js@3.0.2/node_modules/hogan.js/lib/hogan.js");
module.exports = function() { var T = new H.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<h1>");t.b(t.v(t.d("translate.mall.add_to_wishlist.title",c,p,0)));t.b("</h1>");t.b("\n" + i);t.b("<p>");t.b(t.v(t.d("translate.mall.add_to_wishlist.text",c,p,0)));t.b("</p>");t.b("\n" + i);t.b("<p style=\"font-size: 14px\"><em>");t.b(t.v(t.d("translate.mall.add_to_wishlist.note",c,p,0)));t.b("</em></p>");t.b("\n");return t.fl(); },partials: {}, subs: {  }}, "<h1>{{translate.mall.add_to_wishlist.title}}</h1>\n<p>{{translate.mall.add_to_wishlist.text}}</p>\n<p style=\"font-size: 14px\"><em>{{translate.mall.add_to_wishlist.note}}</em></p>\n", H);return T; }();

/***/ }),

/***/ "./src/templates/html/auto_explore_button.html":
/*!*****************************************************!*\
  !*** ./src/templates/html/auto_explore_button.html ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var H = __webpack_require__(/*! hogan.js */ "./node_modules/.pnpm/hogan.js@3.0.2/node_modules/hogan.js/lib/hogan.js");
module.exports = function() { var T = new H.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<button");t.b("\n" + i);t.b("  id=\"auto-explore-button\"");t.b("\n" + i);t.b("  class=\"nl-button ");if(t.s(t.f("active",c,p,1),c,p,0,65,71,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("active");});c.pop();}t.b("\"");t.b("\n" + i);t.b("  data-id=\"");t.b(t.v(t.f("locationId",c,p,0)));t.b("\"");t.b("\n" + i);t.b("  data-mapid=\"");t.b(t.v(t.f("regionId",c,p,0)));t.b("\"");t.b("\n" + i);t.b(">");t.b("\n" + i);t.b("  ");t.b(t.v(t.d("translate.pet.auto_explore",c,p,0)));t.b("\n" + i);t.b("</button>");t.b("\n");return t.fl(); },partials: {}, subs: {  }}, "<button\n  id=\"auto-explore-button\"\n  class=\"nl-button {{#active}}active{{/active}}\"\n  data-id=\"{{locationId}}\"\n  data-mapid=\"{{regionId}}\"\n>\n  {{translate.pet.auto_explore}}\n</button>\n", H);return T; }();

/***/ }),

/***/ "./src/templates/html/carousel_news.html":
/*!***********************************************!*\
  !*** ./src/templates/html/carousel_news.html ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var H = __webpack_require__(/*! hogan.js */ "./node_modules/.pnpm/hogan.js@3.0.2/node_modules/hogan.js/lib/hogan.js");
module.exports = function() { var T = new H.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<a");t.b("\n" + i);t.b("  id=\"");t.b(t.v(t.f("id",c,p,0)));t.b("\"");t.b("\n" + i);t.b("  class=\"carousel-news carousel-ee\"");t.b("\n" + i);t.b("  href=\"\"");t.b("\n" + i);t.b("  style=\"background-image: url(");t.b(t.v(t.f("backgroundImage",c,p,0)));t.b(")\"");t.b("\n" + i);t.b(">");t.b("\n" + i);t.b("  <div>");t.b("\n" + i);t.b("    <h4>");t.b(t.v(t.f("h4",c,p,0)));t.b("</h4>");t.b("\n" + i);t.b("    <h5>");t.b(t.v(t.f("h5",c,p,0)));t.b("</h5>");t.b("\n" + i);t.b("    <p>");t.b(t.v(t.f("p",c,p,0)));t.b("</p>");t.b("\n" + i);t.b("  </div>");t.b("\n" + i);t.b("</a>");t.b("\n");return t.fl(); },partials: {}, subs: {  }}, "<a\n  id=\"{{id}}\"\n  class=\"carousel-news carousel-ee\"\n  href=\"\"\n  style=\"background-image: url({{backgroundImage}})\"\n>\n  <div>\n    <h4>{{h4}}</h4>\n    <h5>{{h5}}</h5>\n    <p>{{p}}</p>\n  </div>\n</a>\n", H);return T; }();

/***/ }),

/***/ "./src/templates/html/change_price_flavr.html":
/*!****************************************************!*\
  !*** ./src/templates/html/change_price_flavr.html ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var H = __webpack_require__(/*! hogan.js */ "./node_modules/.pnpm/hogan.js@3.0.2/node_modules/hogan.js/lib/hogan.js");
module.exports = function() { var T = new H.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<h1>");t.b(t.v(t.d("translate.market.change_price.title",c,p,0)));t.b("</h1>");t.b("\n" + i);t.b("<p>");t.b(t.v(t.d("translate.market.change_price.text",c,p,0)));t.b("</p>");t.b("\n");return t.fl(); },partials: {}, subs: {  }}, "<h1>{{translate.market.change_price.title}}</h1>\n<p>{{translate.market.change_price.text}}</p>\n", H);return T; }();

/***/ }),

/***/ "./src/templates/html/confirm_reset_settings.html":
/*!********************************************************!*\
  !*** ./src/templates/html/confirm_reset_settings.html ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var H = __webpack_require__(/*! hogan.js */ "./node_modules/.pnpm/hogan.js@3.0.2/node_modules/hogan.js/lib/hogan.js");
module.exports = function() { var T = new H.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<h1>");t.b(t.v(t.d("translate.account.confirm_reset_title",c,p,0)));t.b("</h1>");t.b("\n" + i);t.b("<p>");t.b(t.t(t.d("translate.account.confirm_reset_content",c,p,0)));t.b("</p>");t.b("\n");return t.fl(); },partials: {}, subs: {  }}, "<h1>{{translate.account.confirm_reset_title}}</h1>\n<p>{{{translate.account.confirm_reset_content}}}</p>\n", H);return T; }();

/***/ }),

/***/ "./src/templates/html/created_outfit_flavr.html":
/*!******************************************************!*\
  !*** ./src/templates/html/created_outfit_flavr.html ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var H = __webpack_require__(/*! hogan.js */ "./node_modules/.pnpm/hogan.js@3.0.2/node_modules/hogan.js/lib/hogan.js");
module.exports = function() { var T = new H.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<h1>");t.b(t.v(t.d("translate.appearance.favourites.save_outfit.title",c,p,0)));t.b("</h1>");t.b("\n");t.b("\n" + i);t.b("<p>");t.b(t.t(t.d("translate.appearance.favourites.save_outfit.saved_locally",c,p,0)));t.b("</p>");t.b("\n");t.b("\n" + i);t.b("<br />");t.b("\n");t.b("\n" + i);t.b("<p>");t.b(t.t(t.d("translate.appearance.favourites.save_outfit.goto_account",c,p,0)));t.b("</p>");t.b("\n");t.b("\n" + i);t.b("<input");t.b("\n" + i);t.b("  id=\"choose-name\"");t.b("\n" + i);t.b("  maxlength=\"30\"");t.b("\n" + i);t.b("  minlength=\"1\"");t.b("\n" + i);t.b("  placeholder=\"");t.b(t.v(t.d("translate.appearance.favourites.save_outfit.placeholder",c,p,0)));t.b("\"");t.b("\n" + i);t.b("/>");t.b("\n");return t.fl(); },partials: {}, subs: {  }}, "<h1>{{translate.appearance.favourites.save_outfit.title}}</h1>\n\n<p>{{{translate.appearance.favourites.save_outfit.saved_locally}}}</p>\n\n<br />\n\n<p>{{{translate.appearance.favourites.save_outfit.goto_account}}}</p>\n\n<input\n  id=\"choose-name\"\n  maxlength=\"30\"\n  minlength=\"1\"\n  placeholder=\"{{translate.appearance.favourites.save_outfit.placeholder}}\"\n/>\n", H);return T; }();

/***/ }),

/***/ "./src/templates/html/exploration_history.html":
/*!*****************************************************!*\
  !*** ./src/templates/html/exploration_history.html ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var H = __webpack_require__(/*! hogan.js */ "./node_modules/.pnpm/hogan.js@3.0.2/node_modules/hogan.js/lib/hogan.js");
module.exports = function() { var T = new H.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<div id=\"history-container\" style=\"width: 100%\">");t.b("\n" + i);t.b("  <style>");t.b("\n" + i);t.b("    .history-actions {");t.b("\n" + i);t.b("      margin-bottom: 1em;");t.b("\n" + i);t.b("    }");t.b("\n");t.b("\n" + i);t.b("    #delete-history {");t.b("\n" + i);t.b("      margin-right: 1em;");t.b("\n" + i);t.b("    }");t.b("\n");t.b("\n" + i);t.b("    .help-icon {");t.b("\n" + i);t.b("      background-color: #0291f6;");t.b("\n" + i);t.b("      border-radius: 50%;");t.b("\n" + i);t.b("      box-shadow: none;");t.b("\n" + i);t.b("      color: #fff;");t.b("\n" + i);t.b("      font-size: 26px;");t.b("\n" + i);t.b("      font-weight: bold;");t.b("\n" + i);t.b("      height: 23px;");t.b("\n" + i);t.b("      line-height: 20px;");t.b("\n" + i);t.b("      padding: 0;");t.b("\n" + i);t.b("      text-align: center;");t.b("\n" + i);t.b("      width: 23px;");t.b("\n" + i);t.b("    }");t.b("\n");t.b("\n" + i);t.b("    .history-message {");t.b("\n" + i);t.b("      background-color: rgba(255, 255, 255, 0.7);");t.b("\n" + i);t.b("      border-radius: 1em;");t.b("\n" + i);t.b("      margin: 1em;");t.b("\n" + i);t.b("      padding: 1em;");t.b("\n" + i);t.b("    }");t.b("\n");t.b("\n" + i);t.b("    .history-row {");t.b("\n" + i);t.b("      display: flex;");t.b("\n" + i);t.b("      flex-wrap: wrap;");t.b("\n" + i);t.b("      height: 465px;");t.b("\n" + i);t.b("      margin-right: 1em;");t.b("\n" + i);t.b("      overflow-y: auto;");t.b("\n" + i);t.b("      scrollbar-color: dark;");t.b("\n" + i);t.b("      scrollbar-width: thin;");t.b("\n" + i);t.b("    }");t.b("\n");t.b("\n" + i);t.b("    .result-card {");t.b("\n" + i);t.b("      background-color: white;");t.b("\n" + i);t.b("      border-radius: 1em;");t.b("\n" + i);t.b("      box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.3);");t.b("\n" + i);t.b("      height: 205px;");t.b("\n" + i);t.b("      margin: 0.5em;");t.b("\n" + i);t.b("      padding: 0.5em;");t.b("\n" + i);t.b("      text-align: center;");t.b("\n" + i);t.b("      width: 128px;");t.b("\n" + i);t.b("    }");t.b("\n");t.b("\n" + i);t.b("    .result-image {");t.b("\n" + i);t.b("      background-color: white;");t.b("\n" + i);t.b("      border-radius: 1em;");t.b("\n" + i);t.b("      box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.12),");t.b("\n" + i);t.b("        0 2px 4px 2px rgba(0, 0, 0, 0.08);");t.b("\n" + i);t.b("      height: 100px;");t.b("\n" + i);t.b("      position: relative;");t.b("\n" + i);t.b("      top: -0.8em;");t.b("\n" + i);t.b("      width: 100px;");t.b("\n" + i);t.b("    }");t.b("\n");t.b("\n" + i);t.b("    .result-content-column {");t.b("\n" + i);t.b("      display: flex;");t.b("\n" + i);t.b("      flex-direction: column;");t.b("\n" + i);t.b("      height: 103px;");t.b("\n" + i);t.b("      justify-content: space-between;");t.b("\n" + i);t.b("    }");t.b("\n");t.b("\n" + i);t.b("    .result-name {");t.b("\n" + i);t.b("      -webkit-box-orient: vertical;");t.b("\n" + i);t.b("      -webkit-line-clamp: 3;");t.b("\n" + i);t.b("      color: rgb(52, 56, 111);");t.b("\n" + i);t.b("      display: -webkit-box;");t.b("\n" + i);t.b("      flex-grow: 1;");t.b("\n" + i);t.b("      font-size: 16px;");t.b("\n" + i);t.b("      font-weight: bold;");t.b("\n" + i);t.b("      margin-top: -0.2em;");t.b("\n" + i);t.b("      overflow: hidden;");t.b("\n" + i);t.b("    }");t.b("\n");t.b("\n" + i);t.b("    .result-location {");t.b("\n" + i);t.b("    }");t.b("\n");t.b("\n" + i);t.b("    .result-date {");t.b("\n" + i);t.b("      color: #fb8900;");t.b("\n" + i);t.b("      font-size: 13px;");t.b("\n" + i);t.b("      font-weight: bold;");t.b("\n" + i);t.b("    }");t.b("\n");t.b("\n" + i);t.b("    .result-icons {");t.b("\n" + i);t.b("      margin-top: 0.5em;");t.b("\n" + i);t.b("    }");t.b("\n");t.b("\n" + i);t.b("    .result-count {");t.b("\n" + i);t.b("      background: #ffffff;");t.b("\n" + i);t.b("      border-radius: 100%;");t.b("\n" + i);t.b("      border: 1px solid #00cdfb;");t.b("\n" + i);t.b("      box-sizing: border-box;");t.b("\n" + i);t.b("      color: #3ec0d7;");t.b("\n" + i);t.b("      display: inline-block;");t.b("\n" + i);t.b("      font-family: \"Alegreya Sans SC\", sans-serif;");t.b("\n" + i);t.b("      font-size: 18px;");t.b("\n" + i);t.b("      font-weight: 800;");t.b("\n" + i);t.b("      height: 29px;");t.b("\n" + i);t.b("      line-height: 27px;");t.b("\n" + i);t.b("      text-align: center;");t.b("\n" + i);t.b("      user-select: none;");t.b("\n" + i);t.b("      width: 29px;");t.b("\n" + i);t.b("    }");t.b("\n");t.b("\n" + i);t.b("    .history-tradable {");t.b("\n" + i);t.b("      background-color: #666;");t.b("\n" + i);t.b("      border-radius: 25px;");t.b("\n" + i);t.b("      border: 1px solid #b9b9b9;");t.b("\n" + i);t.b("      color: #ffffff;");t.b("\n" + i);t.b("      display: inline-block;");t.b("\n" + i);t.b("      font-family: \"Temp Menu\", serif;");t.b("\n" + i);t.b("      font-size: 13px;");t.b("\n" + i);t.b("      height: 15px;");t.b("\n" + i);t.b("      line-height: 15px;");t.b("\n" + i);t.b("      text-align: center;");t.b("\n" + i);t.b("      width: 15px;");t.b("\n" + i);t.b("    }");t.b("\n");t.b("\n" + i);t.b("    .icon-spacer {");t.b("\n" + i);t.b("      display: inline-block;");t.b("\n" + i);t.b("      width: 0.1em;");t.b("\n" + i);t.b("    }");t.b("\n" + i);t.b("  </style>");t.b("\n");t.b("\n" + i);t.b("  <div class=\"history-actions\">");t.b("\n" + i);t.b("    <button id=\"delete-history\" class=\"nl-button\">");t.b("\n" + i);t.b("      ");t.b(t.v(t.d("translate.pet.delete_history",c,p,0)));t.b("\n" + i);t.b("    </button>");t.b("\n");t.b("\n" + i);t.b("    <span class=\"tooltip\">");t.b("\n" + i);t.b("      <span class=\"nl-button help-icon\">?</span>");t.b("\n" + i);t.b("      <div class=\"tooltip-content\">");t.b("\n" + i);t.b("        <p>");t.b(t.t(t.d("translate.pet.saved_locally",c,p,0)));t.b("</p>");t.b("\n" + i);t.b("        <p>");t.b(t.t(t.d("translate.pet.goto_account",c,p,0)));t.b("</p>");t.b("\n" + i);t.b("      </div>");t.b("\n" + i);t.b("    </span>");t.b("\n" + i);t.b("  </div>");t.b("\n");t.b("\n" + i);if(!t.s(t.f("history",c,p,1),c,p,1,0,0,"")){t.b("  <p class=\"history-message\">");t.b(t.v(t.d("translate.pet.empty_history",c,p,0)));t.b("</p>");t.b("\n" + i);};t.b("\n" + i);t.b("  <div class=\"history-row\">");t.b("\n" + i);if(t.s(t.f("history",c,p,1),c,p,0,3230,3920,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("    <div class=\"result-card\">");t.b("\n" + i);t.b("      <a href=\"");t.b(t.v(t.f("web_hd",c,p,0)));t.b("\" target=\"_blank\">");t.b("\n" + i);t.b("        <img class=\"result-image\" src=\"");t.b(t.v(t.f("icon",c,p,0)));t.b("\" />");t.b("\n" + i);t.b("      </a>");t.b("\n");t.b("\n" + i);t.b("      <div class=\"result-content-column\">");t.b("\n" + i);t.b("        <div class=\"result-name\">");t.b(t.v(t.f("name",c,p,0)));t.b("</div>");t.b("\n" + i);t.b("        <div class=\"result-location\">");t.b(t.v(t.f("locationName",c,p,0)));t.b("</div>");t.b("\n" + i);t.b("        <div class=\"result-date\">");t.b(t.v(t.f("date",c,p,0)));t.b("</div>");t.b("\n");t.b("\n" + i);t.b("        <div class=\"result-icons\">");t.b("\n" + i);t.b("          ");if(t.s(t.f("count",c,p,1),c,p,0,3623,3666,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("<span class=\"result-count\">");t.b(t.v(t.f("count",c,p,0)));t.b("</span>");});c.pop();}t.b("\n" + i);if(t.s(t.f("count",c,p,1),c,p,0,3697,3776,"{{ }}")){t.rs(c,p,function(c,p,t){if(t.s(t.f("tradable",c,p,1),c,p,0,3710,3763,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("          <div class=\"icon-spacer\"></div>");t.b("\n" + i);t.b("          ");});c.pop();}});c.pop();}t.b(" ");if(t.s(t.f("tradable",c,p,1),c,p,0,3800,3863,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("<span class=\"history-tradable\"");t.b("\n" + i);t.b("            ></span");t.b("\n" + i);t.b("          >");});c.pop();}t.b("\n" + i);t.b("        </div>");t.b("\n" + i);t.b("      </div>");t.b("\n" + i);t.b("    </div>");t.b("\n" + i);});c.pop();}t.b("  </div>");t.b("\n" + i);t.b("</div>");t.b("\n");return t.fl(); },partials: {}, subs: {  }}, "<div id=\"history-container\" style=\"width: 100%\">\n  <style>\n    .history-actions {\n      margin-bottom: 1em;\n    }\n\n    #delete-history {\n      margin-right: 1em;\n    }\n\n    .help-icon {\n      background-color: #0291f6;\n      border-radius: 50%;\n      box-shadow: none;\n      color: #fff;\n      font-size: 26px;\n      font-weight: bold;\n      height: 23px;\n      line-height: 20px;\n      padding: 0;\n      text-align: center;\n      width: 23px;\n    }\n\n    .history-message {\n      background-color: rgba(255, 255, 255, 0.7);\n      border-radius: 1em;\n      margin: 1em;\n      padding: 1em;\n    }\n\n    .history-row {\n      display: flex;\n      flex-wrap: wrap;\n      height: 465px;\n      margin-right: 1em;\n      overflow-y: auto;\n      scrollbar-color: dark;\n      scrollbar-width: thin;\n    }\n\n    .result-card {\n      background-color: white;\n      border-radius: 1em;\n      box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.3);\n      height: 205px;\n      margin: 0.5em;\n      padding: 0.5em;\n      text-align: center;\n      width: 128px;\n    }\n\n    .result-image {\n      background-color: white;\n      border-radius: 1em;\n      box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.12),\n        0 2px 4px 2px rgba(0, 0, 0, 0.08);\n      height: 100px;\n      position: relative;\n      top: -0.8em;\n      width: 100px;\n    }\n\n    .result-content-column {\n      display: flex;\n      flex-direction: column;\n      height: 103px;\n      justify-content: space-between;\n    }\n\n    .result-name {\n      -webkit-box-orient: vertical;\n      -webkit-line-clamp: 3;\n      color: rgb(52, 56, 111);\n      display: -webkit-box;\n      flex-grow: 1;\n      font-size: 16px;\n      font-weight: bold;\n      margin-top: -0.2em;\n      overflow: hidden;\n    }\n\n    .result-location {\n    }\n\n    .result-date {\n      color: #fb8900;\n      font-size: 13px;\n      font-weight: bold;\n    }\n\n    .result-icons {\n      margin-top: 0.5em;\n    }\n\n    .result-count {\n      background: #ffffff;\n      border-radius: 100%;\n      border: 1px solid #00cdfb;\n      box-sizing: border-box;\n      color: #3ec0d7;\n      display: inline-block;\n      font-family: \"Alegreya Sans SC\", sans-serif;\n      font-size: 18px;\n      font-weight: 800;\n      height: 29px;\n      line-height: 27px;\n      text-align: center;\n      user-select: none;\n      width: 29px;\n    }\n\n    .history-tradable {\n      background-color: #666;\n      border-radius: 25px;\n      border: 1px solid #b9b9b9;\n      color: #ffffff;\n      display: inline-block;\n      font-family: \"Temp Menu\", serif;\n      font-size: 13px;\n      height: 15px;\n      line-height: 15px;\n      text-align: center;\n      width: 15px;\n    }\n\n    .icon-spacer {\n      display: inline-block;\n      width: 0.1em;\n    }\n  </style>\n\n  <div class=\"history-actions\">\n    <button id=\"delete-history\" class=\"nl-button\">\n      {{translate.pet.delete_history}}\n    </button>\n\n    <span class=\"tooltip\">\n      <span class=\"nl-button help-icon\">?</span>\n      <div class=\"tooltip-content\">\n        <p>{{{translate.pet.saved_locally}}}</p>\n        <p>{{{translate.pet.goto_account}}}</p>\n      </div>\n    </span>\n  </div>\n\n  {{^history}}\n  <p class=\"history-message\">{{translate.pet.empty_history}}</p>\n  {{/history}}\n\n  <div class=\"history-row\">\n    {{#history}}\n    <div class=\"result-card\">\n      <a href=\"{{web_hd}}\" target=\"_blank\">\n        <img class=\"result-image\" src=\"{{icon}}\" />\n      </a>\n\n      <div class=\"result-content-column\">\n        <div class=\"result-name\">{{name}}</div>\n        <div class=\"result-location\">{{locationName}}</div>\n        <div class=\"result-date\">{{date}}</div>\n\n        <div class=\"result-icons\">\n          {{#count}}<span class=\"result-count\">{{count}}</span>{{/count}}\n          {{#count}}{{#tradable}}\n          <div class=\"icon-spacer\"></div>\n          {{/tradable}}{{/count}} {{#tradable}}<span class=\"history-tradable\"\n            ></span\n          >{{/tradable}}\n        </div>\n      </div>\n    </div>\n    {{/history}}\n  </div>\n</div>\n", H);return T; }();

/***/ }),

/***/ "./src/templates/html/favourite_outfit_flavr.html":
/*!********************************************************!*\
  !*** ./src/templates/html/favourite_outfit_flavr.html ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var H = __webpack_require__(/*! hogan.js */ "./node_modules/.pnpm/hogan.js@3.0.2/node_modules/hogan.js/lib/hogan.js");
module.exports = function() { var T = new H.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<style>");t.b("\n" + i);t.b("  .created-outfit-popup .flavr-outer .flavr-message::after {");t.b("\n" + i);t.b("    background-image: url(");t.b(t.v(t.f("url",c,p,0)));t.b(");");t.b("\n" + i);t.b("    background-size: contain;");t.b("\n" + i);t.b("  }");t.b("\n" + i);t.b("</style>");t.b("\n");t.b("\n" + i);t.b("<h1>");t.b(t.v(t.f("name",c,p,0)));t.b("</h1>");t.b("\n");t.b("\n" + i);t.b("<p>");t.b(t.t(t.d("translate.appearance.favourites.click_outfit.saved_locally",c,p,0)));t.b("</p>");t.b("\n");t.b("\n" + i);t.b("<br />");t.b("\n");t.b("\n" + i);t.b("<p>");t.b(t.t(t.d("translate.appearance.favourites.click_outfit.goto_account",c,p,0)));t.b("</p>");t.b("\n");return t.fl(); },partials: {}, subs: {  }}, "<style>\n  .created-outfit-popup .flavr-outer .flavr-message::after {\n    background-image: url({{url}});\n    background-size: contain;\n  }\n</style>\n\n<h1>{{name}}</h1>\n\n<p>{{{translate.appearance.favourites.click_outfit.saved_locally}}}</p>\n\n<br />\n\n<p>{{{translate.appearance.favourites.click_outfit.goto_account}}}</p>\n", H);return T; }();

/***/ }),

/***/ "./src/templates/html/favourites_action.html":
/*!***************************************************!*\
  !*** ./src/templates/html/favourites_action.html ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var H = __webpack_require__(/*! hogan.js */ "./node_modules/.pnpm/hogan.js@3.0.2/node_modules/hogan.js/lib/hogan.js");
module.exports = function() { var T = new H.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<button id=\"");t.b(t.v(t.f("id",c,p,0)));t.b("\" class=\"nl-button favorites-action-ee\">");t.b(t.v(t.f("text",c,p,0)));t.b("</button>");t.b("\n");return t.fl(); },partials: {}, subs: {  }}, "<button id=\"{{id}}\" class=\"nl-button favorites-action-ee\">{{text}}</button>\n", H);return T; }();

/***/ }),

/***/ "./src/templates/html/flavr_notif/icon_message.html":
/*!**********************************************************!*\
  !*** ./src/templates/html/flavr_notif/icon_message.html ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var H = __webpack_require__(/*! hogan.js */ "./node_modules/.pnpm/hogan.js@3.0.2/node_modules/hogan.js/lib/hogan.js");
module.exports = function() { var T = new H.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<img");t.b("\n" + i);t.b("  src=\"");t.b(t.v(t.f("icon",c,p,0)));t.b("\"");t.b("\n" + i);t.b("  alt=\"");t.b(t.v(t.f("name",c,p,0)));t.b("\"");t.b("\n" + i);t.b("  height=\"21\"");t.b("\n" + i);t.b("  style=\"display: inline-block; margin: -2px auto\"");t.b("\n" + i);t.b("/>");t.b("\n" + i);t.b(t.t(t.f("message",c,p,0)));t.b("\n");return t.fl(); },partials: {}, subs: {  }}, "<img\n  src=\"{{icon}}\"\n  alt=\"{{name}}\"\n  height=\"21\"\n  style=\"display: inline-block; margin: -2px auto\"\n/>\n{{{message}}}\n", H);return T; }();

/***/ }),

/***/ "./src/templates/html/header_takeover.html":
/*!*************************************************!*\
  !*** ./src/templates/html/header_takeover.html ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var H = __webpack_require__(/*! hogan.js */ "./node_modules/.pnpm/hogan.js@3.0.2/node_modules/hogan.js/lib/hogan.js");
module.exports = function() { var T = new H.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<li");t.b("\n" + i);t.b("  id=\"header-takeover\"");t.b("\n" + i);t.b("  title=\"");t.b(t.v(t.d("translate.home.takeover",c,p,0)));t.b("\"");t.b("\n" + i);t.b("  style=\"transition: transform ease-in-out 200ms; cursor: pointer\"");t.b("\n" + i);t.b("  onMouseOver=\"this.style.transform='scale(1.3)'\"");t.b("\n" + i);t.b("  onMouseOut=\"this.style.transform='scale(1)'\"");t.b("\n" + i);t.b(">");t.b("\n" + i);t.b("  <a>");t.b("\n" + i);t.b("    <img");t.b("\n" + i);t.b("      src=\"/static/img/new-layout/home/connected/lock.png\"");t.b("\n" + i);t.b("      alt=\"");t.b(t.v(t.d("translate.home.takeover",c,p,0)));t.b("\"");t.b("\n" + i);t.b("      style=\"filter: contrast(0%) brightness(200%) ");if(!t.s(t.f("takeover",c,p,1),c,p,1,0,0,"")){t.b("opacity(0)");};t.b("\"");t.b("\n" + i);t.b("      height=\"21\"");t.b("\n" + i);t.b("    />");t.b("\n" + i);t.b("  </a>");t.b("\n" + i);t.b("</li>");t.b("\n");return t.fl(); },partials: {}, subs: {  }}, "<li\n  id=\"header-takeover\"\n  title=\"{{translate.home.takeover}}\"\n  style=\"transition: transform ease-in-out 200ms; cursor: pointer\"\n  onMouseOver=\"this.style.transform='scale(1.3)'\"\n  onMouseOut=\"this.style.transform='scale(1)'\"\n>\n  <a>\n    <img\n      src=\"/static/img/new-layout/home/connected/lock.png\"\n      alt=\"{{translate.home.takeover}}\"\n      style=\"filter: contrast(0%) brightness(200%) {{^takeover}}opacity(0){{/takeover}}\"\n      height=\"21\"\n    />\n  </a>\n</li>\n", H);return T; }();

/***/ }),

/***/ "./src/templates/html/home_content_small.html":
/*!****************************************************!*\
  !*** ./src/templates/html/home_content_small.html ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var H = __webpack_require__(/*! hogan.js */ "./node_modules/.pnpm/hogan.js@3.0.2/node_modules/hogan.js/lib/hogan.js");
module.exports = function() { var T = new H.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<a");t.b("\n" + i);t.b("  id=\"home-");t.b(t.v(t.f("id",c,p,0)));t.b("\"");t.b("\n" + i);t.b("  class=\"home-content-tile home-content-small home-content-small-ee\"");t.b("\n" + i);t.b("  href=\"");t.b(t.v(t.f("href",c,p,0)));t.b("\"");t.b("\n" + i);t.b("  style=\"background-image: url(");t.b(t.v(t.f("backgroundImage",c,p,0)));t.b(");\"");t.b("\n" + i);t.b(">");t.b("\n" + i);t.b("  <h4>");t.b(t.v(t.f("h4",c,p,0)));t.b("</h4>");t.b("\n" + i);t.b("</a>");t.b("\n");return t.fl(); },partials: {}, subs: {  }}, "<a\n  id=\"home-{{id}}\"\n  class=\"home-content-tile home-content-small home-content-small-ee\"\n  href=\"{{href}}\"\n  style=\"background-image: url({{backgroundImage}});\"\n>\n  <h4>{{h4}}</h4>\n</a>\n", H);return T; }();

/***/ }),

/***/ "./src/templates/html/main_menu.html":
/*!*******************************************!*\
  !*** ./src/templates/html/main_menu.html ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var H = __webpack_require__(/*! hogan.js */ "./node_modules/.pnpm/hogan.js@3.0.2/node_modules/hogan.js/lib/hogan.js");
module.exports = function() { var T = new H.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<li class=\"main-menu-");t.b(t.v(t.f("class",c,p,0)));t.b(" main-menu-ee\">");t.b("\n" + i);t.b("  <a href=\"");t.b(t.v(t.f("href",c,p,0)));t.b("\">");t.b(t.v(t.f("text",c,p,0)));t.b("</a>");t.b("\n" + i);t.b("</li>");t.b("\n");return t.fl(); },partials: {}, subs: {  }}, "<li class=\"main-menu-{{class}} main-menu-ee\">\n  <a href=\"{{href}}\">{{text}}</a>\n</li>\n", H);return T; }();

/***/ }),

/***/ "./src/templates/html/main_menu_purroshop.html":
/*!*****************************************************!*\
  !*** ./src/templates/html/main_menu_purroshop.html ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var H = __webpack_require__(/*! hogan.js */ "./node_modules/.pnpm/hogan.js@3.0.2/node_modules/hogan.js/lib/hogan.js");
module.exports = function() { var T = new H.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<li class=\"main-menu-purroshop\">");t.b("\n" + i);t.b("  <a href=\"/mall/purroshop\">");t.b("\n" + i);t.b("    <img");t.b("\n" + i);t.b("      height=\"20\"");t.b("\n" + i);t.b("      src=\"/assets/img/item/consumable/b647d54afd6b04353e129219810512f5.png\"");t.b("\n" + i);t.b("      style=\"vertical-align: middle\"");t.b("\n" + i);t.b("    />");t.b("\n" + i);t.b("    Purro'Shop");t.b("\n" + i);t.b("  </a>");t.b("\n" + i);t.b("</li>");t.b("\n");return t.fl(); },partials: {}, subs: {  }}, "<li class=\"main-menu-purroshop\">\n  <a href=\"/mall/purroshop\">\n    <img\n      height=\"20\"\n      src=\"/assets/img/item/consumable/b647d54afd6b04353e129219810512f5.png\"\n      style=\"vertical-align: middle\"\n    />\n    Purro'Shop\n  </a>\n</li>\n", H);return T; }();

/***/ }),

/***/ "./src/templates/html/market_history.html":
/*!************************************************!*\
  !*** ./src/templates/html/market_history.html ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var H = __webpack_require__(/*! hogan.js */ "./node_modules/.pnpm/hogan.js@3.0.2/node_modules/hogan.js/lib/hogan.js");
module.exports = function() { var T = new H.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<style>");t.b("\n" + i);t.b("  /* #marketplace-abstract-purchases and #marketplace-abstract-sales were");t.b("\n" + i);t.b("  re-written to target #purchase-history and #sale-history. */");t.b("\n");t.b("\n" + i);t.b("  #purchase-history,");t.b("\n" + i);t.b("  #sale-history {");t.b("\n" + i);t.b("    height: 600px;");t.b("\n" + i);t.b("    position: relative;");t.b("\n" + i);t.b("    width: 360px;");t.b("\n" + i);t.b("    display: inline-block;");t.b("\n" + i);t.b("    vertical-align: top;");t.b("\n" + i);t.b("  }");t.b("\n");t.b("\n" + i);t.b("  #sale-history .abstract-actions,");t.b("\n" + i);t.b("  #purchase-history .abstract-actions {");t.b("\n" + i);t.b("    position: relative;");t.b("\n" + i);t.b("    top: -40px;");t.b("\n" + i);t.b("    display: flex;");t.b("\n" + i);t.b("    flex-direction: column;");t.b("\n" + i);t.b("    justify-content: space-evenly;");t.b("\n" + i);t.b("    height: 80px;");t.b("\n" + i);t.b("  }");t.b("\n");t.b("\n" + i);t.b("  #sale-history .abstract-time,");t.b("\n" + i);t.b("  #purchase-history .abstract-time {");t.b("\n" + i);t.b("    position: static;");t.b("\n" + i);t.b("    display: inline;");t.b("\n" + i);t.b("    height: auto;");t.b("\n" + i);t.b("    color: #fb8900;");t.b("\n" + i);t.b("    font-weight: bold;");t.b("\n" + i);t.b("    font-size: 13px;");t.b("\n" + i);t.b("  }");t.b("\n");t.b("\n" + i);t.b("  #purchase-history {");t.b("\n" + i);t.b("    margin-right: 80px;");t.b("\n" + i);t.b("  }");t.b("\n");t.b("\n" + i);t.b("  #purchase-history:before {");t.b("\n" + i);t.b("    content: \"\";");t.b("\n" + i);t.b("    position: absolute;");t.b("\n" + i);t.b("    top: 120px;");t.b("\n" + i);t.b("    right: -42px;");t.b("\n" + i);t.b("    border-right: solid 2px #aaa;");t.b("\n" + i);t.b("    height: 320px;");t.b("\n" + i);t.b("  }");t.b("\n");t.b("\n" + i);t.b("  /* Custom fixes to the layout */");t.b("\n");t.b("\n" + i);t.b("  #purchase-history li {");t.b("\n" + i);t.b("    margin-left: 4px;");t.b("\n" + i);t.b("    margin-right: 4px;");t.b("\n" + i);t.b("  }");t.b("\n" + i);t.b("</style>");t.b("\n");t.b("\n" + i);t.b("<!-- Purchases -->");t.b("\n" + i);t.b("<div class=\"marketplace-abstract\" id=\"purchase-history\">");t.b("\n" + i);t.b("  <h2 class=\"section-subtitle\">");t.b("\n" + i);t.b("    ");t.b(t.v(t.d("translate.market.auctions.purchase_history",c,p,0)));t.b("\n" + i);t.b("  </h2>");t.b("\n");t.b("\n" + i);t.b("  <ul>");t.b("\n" + i);if(t.s(t.f("purchases",c,p,1),c,p,0,1248,2509,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("    <li");t.b("\n" + i);t.b("      data-itemid=\"");t.b(t.v(t.f("itemid",c,p,0)));t.b("\"");t.b("\n" + i);t.b("      class=\"marketplace-abstract marketplace-auctions-item marketplace-sales-item\"");t.b("\n" + i);t.b("    >");t.b("\n" + i);t.b("      <!-- Icon -->");t.b("\n" + i);t.b("      <div class=\"abstract-icon\">");t.b("\n" + i);t.b("        <img src=\"");t.b(t.v(t.f("icon",c,p,0)));t.b("\" />");t.b("\n" + i);t.b("      </div>");t.b("\n");t.b("\n" + i);t.b("      <!-- Prices -->");t.b("\n" + i);t.b("      <div class=\"abstract-container\">");t.b("\n" + i);t.b("        <div class=\"abstract-name\">");t.b(t.v(t.f("name",c,p,0)));t.b("</div>");t.b("\n" + i);t.b("        <div class=\"abstract-content\">");t.b("\n" + i);t.b("          <div class=\"abstract-currentPrice\">");t.b("\n" + i);t.b("            ");if(t.s(t.f("currentPrice",c,p,1),c,p,0,1702,1871,"{{ }}")){t.rs(c,p,function(c,p,t){t.b(" ");t.b(t.v(t.d("translate.market.auctions.current_price",c,p,0)));t.b("\n" + i);t.b("            <span class=\"price-item\">");t.b(t.v(t.d("currentPrice.price",c,p,0)));t.b("</span>");t.b("\n" + i);t.b("            <span class=\"maana-icon\"></span>");t.b("\n" + i);});c.pop();}t.b("            <br />");t.b("\n" + i);t.b("            ");if(t.s(t.f("buyNowPrice",c,p,1),c,p,0,1936,2104,"{{ }}")){t.rs(c,p,function(c,p,t){t.b(" ");t.b(t.v(t.d("translate.market.auctions.buy_now_price",c,p,0)));t.b("\n" + i);t.b("            <span class=\"price-item\">");t.b(t.v(t.d("buyNowPrice.price",c,p,0)));t.b("</span>");t.b("\n" + i);t.b("            <span class=\"maana-icon\"></span>");t.b("\n" + i);});c.pop();}t.b("          </div>");t.b("\n" + i);t.b("        </div>");t.b("\n" + i);t.b("      </div>");t.b("\n");t.b("\n" + i);t.b("      <!-- Actions -->");t.b("\n" + i);t.b("      <div class=\"abstract-actions\">");t.b("\n" + i);t.b("        <div class=\"abstract-time\">");t.b(t.v(t.f("date",c,p,0)));t.b("</div>");t.b("\n" + i);t.b("        <div");t.b("\n" + i);t.b("          class=\"nl-button nl-button-sm marketplace-itemDetail-cancel delete-button\"");t.b("\n" + i);t.b("          data-itemid=\"");t.b(t.v(t.f("itemid",c,p,0)));t.b("\"");t.b("\n" + i);t.b("        >");t.b("\n" + i);t.b("          ");t.b(t.v(t.d("translate.market.auctions.delete",c,p,0)));t.b("\n" + i);t.b("        </div>");t.b("\n" + i);t.b("      </div>");t.b("\n" + i);t.b("    </li>");t.b("\n" + i);});c.pop();}t.b("  </ul>");t.b("\n" + i);t.b("</div>");t.b("\n");t.b("\n" + i);t.b("<!-- Sales -->");t.b("\n" + i);t.b("<div class=\"marketplace-abstract\" id=\"sale-history\">");t.b("\n" + i);t.b("  <h2 class=\"section-subtitle\">");t.b(t.v(t.d("translate.market.auctions.sales_history",c,p,0)));t.b("</h2>");t.b("\n");t.b("\n" + i);t.b("  <ul>");t.b("\n" + i);if(t.s(t.f("sales",c,p,1),c,p,0,2710,3856,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("    <li class=\"marketplace-abstract marketplace-sales-item\">");t.b("\n" + i);t.b("      <!-- Icon -->");t.b("\n" + i);t.b("      <div class=\"abstract-icon\">");t.b("\n" + i);t.b("        <img src=\"");t.b(t.v(t.f("icon",c,p,0)));t.b("\" />");t.b("\n" + i);t.b("      </div>");t.b("\n");t.b("\n" + i);t.b("      <!-- Prices -->");t.b("\n" + i);t.b("      <div class=\"abstract-container\">");t.b("\n" + i);t.b("        <div class=\"abstract-name\">");t.b(t.v(t.f("name",c,p,0)));t.b("</div>");t.b("\n" + i);t.b("        <div class=\"abstract-content\">");t.b("\n" + i);t.b("          <div class=\"abstract-currentPrice\">");t.b("\n" + i);t.b("            ");if(t.s(t.f("currentPrice",c,p,1),c,p,0,3096,3259,"{{ }}")){t.rs(c,p,function(c,p,t){t.b(" ");t.b(t.v(t.d("translate.market.auctions.current_price",c,p,0)));t.b("\n" + i);t.b("            <span class=\"price-item\">");t.b(t.v(t.f("currentPrice",c,p,0)));t.b("</span>");t.b("\n" + i);t.b("            <span class=\"maana-icon\"></span>");t.b("\n" + i);});c.pop();}t.b("            <br />");t.b("\n" + i);t.b("            ");if(t.s(t.f("buyNowPrice",c,p,1),c,p,0,3324,3486,"{{ }}")){t.rs(c,p,function(c,p,t){t.b(" ");t.b(t.v(t.d("translate.market.auctions.buy_now_price",c,p,0)));t.b("\n" + i);t.b("            <span class=\"price-item\">");t.b(t.v(t.f("buyNowPrice",c,p,0)));t.b("</span>");t.b("\n" + i);t.b("            <span class=\"maana-icon\"></span>");t.b("\n" + i);});c.pop();}t.b("          </div>");t.b("\n" + i);t.b("        </div>");t.b("\n" + i);t.b("      </div>");t.b("\n");t.b("\n" + i);t.b("      <!-- Actions -->");t.b("\n" + i);t.b("      <div class=\"abstract-actions\">");t.b("\n" + i);t.b("        <div class=\"abstract-time\">");t.b(t.v(t.f("date",c,p,0)));t.b("</div>");t.b("\n" + i);t.b("        <div");t.b("\n" + i);t.b("          class=\"nl-button nl-button-sm marketplace-itemDetail-cancel delete-button\"");t.b("\n" + i);t.b("        >");t.b("\n" + i);t.b("          ");t.b(t.v(t.d("translate.market.auctions.delete",c,p,0)));t.b("\n" + i);t.b("        </div>");t.b("\n" + i);t.b("      </div>");t.b("\n" + i);t.b("    </li>");t.b("\n" + i);});c.pop();}t.b("  </ul>");t.b("\n" + i);t.b("</div>");t.b("\n");return t.fl(); },partials: {}, subs: {  }}, "<style>\n  /* #marketplace-abstract-purchases and #marketplace-abstract-sales were\n  re-written to target #purchase-history and #sale-history. */\n\n  #purchase-history,\n  #sale-history {\n    height: 600px;\n    position: relative;\n    width: 360px;\n    display: inline-block;\n    vertical-align: top;\n  }\n\n  #sale-history .abstract-actions,\n  #purchase-history .abstract-actions {\n    position: relative;\n    top: -40px;\n    display: flex;\n    flex-direction: column;\n    justify-content: space-evenly;\n    height: 80px;\n  }\n\n  #sale-history .abstract-time,\n  #purchase-history .abstract-time {\n    position: static;\n    display: inline;\n    height: auto;\n    color: #fb8900;\n    font-weight: bold;\n    font-size: 13px;\n  }\n\n  #purchase-history {\n    margin-right: 80px;\n  }\n\n  #purchase-history:before {\n    content: \"\";\n    position: absolute;\n    top: 120px;\n    right: -42px;\n    border-right: solid 2px #aaa;\n    height: 320px;\n  }\n\n  /* Custom fixes to the layout */\n\n  #purchase-history li {\n    margin-left: 4px;\n    margin-right: 4px;\n  }\n</style>\n\n<!-- Purchases -->\n<div class=\"marketplace-abstract\" id=\"purchase-history\">\n  <h2 class=\"section-subtitle\">\n    {{translate.market.auctions.purchase_history}}\n  </h2>\n\n  <ul>\n    {{#purchases}}\n    <li\n      data-itemid=\"{{itemid}}\"\n      class=\"marketplace-abstract marketplace-auctions-item marketplace-sales-item\"\n    >\n      <!-- Icon -->\n      <div class=\"abstract-icon\">\n        <img src=\"{{icon}}\" />\n      </div>\n\n      <!-- Prices -->\n      <div class=\"abstract-container\">\n        <div class=\"abstract-name\">{{name}}</div>\n        <div class=\"abstract-content\">\n          <div class=\"abstract-currentPrice\">\n            {{#currentPrice}} {{translate.market.auctions.current_price}}\n            <span class=\"price-item\">{{currentPrice.price}}</span>\n            <span class=\"maana-icon\"></span>\n            {{/currentPrice}}\n            <br />\n            {{#buyNowPrice}} {{translate.market.auctions.buy_now_price}}\n            <span class=\"price-item\">{{buyNowPrice.price}}</span>\n            <span class=\"maana-icon\"></span>\n            {{/buyNowPrice}}\n          </div>\n        </div>\n      </div>\n\n      <!-- Actions -->\n      <div class=\"abstract-actions\">\n        <div class=\"abstract-time\">{{date}}</div>\n        <div\n          class=\"nl-button nl-button-sm marketplace-itemDetail-cancel delete-button\"\n          data-itemid=\"{{itemid}}\"\n        >\n          {{translate.market.auctions.delete}}\n        </div>\n      </div>\n    </li>\n    {{/purchases}}\n  </ul>\n</div>\n\n<!-- Sales -->\n<div class=\"marketplace-abstract\" id=\"sale-history\">\n  <h2 class=\"section-subtitle\">{{translate.market.auctions.sales_history}}</h2>\n\n  <ul>\n    {{#sales}}\n    <li class=\"marketplace-abstract marketplace-sales-item\">\n      <!-- Icon -->\n      <div class=\"abstract-icon\">\n        <img src=\"{{icon}}\" />\n      </div>\n\n      <!-- Prices -->\n      <div class=\"abstract-container\">\n        <div class=\"abstract-name\">{{name}}</div>\n        <div class=\"abstract-content\">\n          <div class=\"abstract-currentPrice\">\n            {{#currentPrice}} {{translate.market.auctions.current_price}}\n            <span class=\"price-item\">{{currentPrice}}</span>\n            <span class=\"maana-icon\"></span>\n            {{/currentPrice}}\n            <br />\n            {{#buyNowPrice}} {{translate.market.auctions.buy_now_price}}\n            <span class=\"price-item\">{{buyNowPrice}}</span>\n            <span class=\"maana-icon\"></span>\n            {{/buyNowPrice}}\n          </div>\n        </div>\n      </div>\n\n      <!-- Actions -->\n      <div class=\"abstract-actions\">\n        <div class=\"abstract-time\">{{date}}</div>\n        <div\n          class=\"nl-button nl-button-sm marketplace-itemDetail-cancel delete-button\"\n        >\n          {{translate.market.auctions.delete}}\n        </div>\n      </div>\n    </li>\n    {{/sales}}\n  </ul>\n</div>\n", H);return T; }();

/***/ }),

/***/ "./src/templates/html/mass_mark_button.html":
/*!**************************************************!*\
  !*** ./src/templates/html/mass_mark_button.html ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var H = __webpack_require__(/*! hogan.js */ "./node_modules/.pnpm/hogan.js@3.0.2/node_modules/hogan.js/lib/hogan.js");
module.exports = function() { var T = new H.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<a");t.b("\n" + i);t.b("  id=\"mass-mark\"");t.b("\n" + i);t.b("  class=\"nl-button\"");t.b("\n" + i);t.b("  style=\"margin-right: 0.6em; margin-top: 0.6em\"");t.b("\n" + i);t.b(">");t.b("\n" + i);t.b("  <img src=\"");t.b(t.v(t.f("src",c,p,0)));t.b("\" height=\"20px\" style=\"margin: -5px 0px\" />");t.b("\n" + i);t.b("  ");t.b(t.v(t.f("textContent",c,p,0)));t.b("\n" + i);t.b("</a>");t.b("\n");return t.fl(); },partials: {}, subs: {  }}, "<a\n  id=\"mass-mark\"\n  class=\"nl-button\"\n  style=\"margin-right: 0.6em; margin-top: 0.6em\"\n>\n  <img src=\"{{src}}\" height=\"20px\" style=\"margin: -5px 0px\" />\n  {{textContent}}\n</a>\n", H);return T; }();

/***/ }),

/***/ "./src/templates/html/outfit_thumbs.html":
/*!***********************************************!*\
  !*** ./src/templates/html/outfit_thumbs.html ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var H = __webpack_require__(/*! hogan.js */ "./node_modules/.pnpm/hogan.js@3.0.2/node_modules/hogan.js/lib/hogan.js");
module.exports = function() { var T = new H.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<div id=\"ee-outfit-thumbs\">");t.b("\n" + i);t.b("  <style>");t.b("\n" + i);t.b("    #appearance-items-category-favorites .slot.ee-available-slot {");t.b("\n" + i);t.b("      background-image: url(https://gitlab.com/NatoBoram/eldarya-enhancements/-/raw/master/images/available-favorite.png);");t.b("\n" + i);t.b("      background-position: -14px -11px;");t.b("\n" + i);t.b("      background-size: 171px 244px;");t.b("\n" + i);t.b("      border-radius: 44px;");t.b("\n" + i);t.b("      box-shadow: 0 0 4px 4px rgba(255, 255, 255, 0.8);");t.b("\n" + i);t.b("    }");t.b("\n");t.b("\n" + i);t.b("    #appearance-items-category-favorites .slot.ee-available-slot::after {");t.b("\n" + i);t.b("      background: url(/static/img/new-layout/wardrobe/icon-plus.png);");t.b("\n" + i);t.b("      content: \" \";");t.b("\n" + i);t.b("      filter: drop-shadow(0 0 6px rgba(237, 12, 245, 0.9));");t.b("\n" + i);t.b("      height: 71px;");t.b("\n" + i);t.b("      left: 50%;");t.b("\n" + i);t.b("      opacity: 0;");t.b("\n" + i);t.b("      position: absolute;");t.b("\n" + i);t.b("      top: 50%;");t.b("\n" + i);t.b("      transform: translate(-50%, -50%);");t.b("\n" + i);t.b("      transition: opacity ease-in-out 100ms;");t.b("\n" + i);t.b("      width: 66px;");t.b("\n" + i);t.b("    }");t.b("\n");t.b("\n" + i);t.b("    #appearance-items-category-favorites .slot.ee-available-slot:hover::after,");t.b("\n" + i);t.b("    #appearance-items-category-favorites .slot.ee-outfit-thumb:hover p {");t.b("\n" + i);t.b("      opacity: 1;");t.b("\n" + i);t.b("    }");t.b("\n");t.b("\n" + i);t.b("    #appearance-items-category-favorites .slot.ee-outfit-thumb img {");t.b("\n" + i);t.b("      border-radius: 44px;");t.b("\n" + i);t.b("      height: 100%;");t.b("\n" + i);t.b("      width: 100%;");t.b("\n" + i);t.b("    }");t.b("\n");t.b("\n" + i);t.b("    #appearance-items-category-favorites .slot.ee-outfit-thumb p {");t.b("\n" + i);t.b("      background: rgba(0, 0, 0, 0.5);");t.b("\n" + i);t.b("      color: #fff;");t.b("\n" + i);t.b("      font-family: \"Alegreya Sans SC\", sans-serif;");t.b("\n" + i);t.b("      font-size: 22px;");t.b("\n" + i);t.b("      font-weight: 700;");t.b("\n" + i);t.b("      left: 50%;");t.b("\n" + i);t.b("      line-height: 22px;");t.b("\n" + i);t.b("      opacity: 0;");t.b("\n" + i);t.b("      padding: 12px 0;");t.b("\n" + i);t.b("      position: absolute;");t.b("\n" + i);t.b("      text-align: center;");t.b("\n" + i);t.b("      top: 50%;");t.b("\n" + i);t.b("      transform: translate(-50%, -50%);");t.b("\n" + i);t.b("      transition: opacity ease-in-out 400ms;");t.b("\n" + i);t.b("      width: 100%;");t.b("\n" + i);t.b("    }");t.b("\n" + i);t.b("  </style>");t.b("\n");t.b("\n" + i);if(t.s(t.f("outfits",c,p,1),c,p,0,1654,1790,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("  <div class=\"slot ee-outfit-thumb\" data-array-index=\"");t.b(t.v(t.f("id",c,p,0)));t.b("\">");t.b("\n" + i);t.b("    <img alt=\"");t.b(t.v(t.f("name",c,p,0)));t.b("\" src=\"");t.b(t.v(t.f("url",c,p,0)));t.b("\" />");t.b("\n" + i);t.b("    <p>");t.b(t.v(t.f("name",c,p,0)));t.b("</p>");t.b("\n" + i);t.b("  </div>");t.b("\n" + i);});c.pop();}t.b("\n" + i);t.b("  <div class=\"slot ee-available-slot\"></div>");t.b("\n" + i);t.b("</div>");t.b("\n");return t.fl(); },partials: {}, subs: {  }}, "<div id=\"ee-outfit-thumbs\">\n  <style>\n    #appearance-items-category-favorites .slot.ee-available-slot {\n      background-image: url(https://gitlab.com/NatoBoram/eldarya-enhancements/-/raw/master/images/available-favorite.png);\n      background-position: -14px -11px;\n      background-size: 171px 244px;\n      border-radius: 44px;\n      box-shadow: 0 0 4px 4px rgba(255, 255, 255, 0.8);\n    }\n\n    #appearance-items-category-favorites .slot.ee-available-slot::after {\n      background: url(/static/img/new-layout/wardrobe/icon-plus.png);\n      content: \" \";\n      filter: drop-shadow(0 0 6px rgba(237, 12, 245, 0.9));\n      height: 71px;\n      left: 50%;\n      opacity: 0;\n      position: absolute;\n      top: 50%;\n      transform: translate(-50%, -50%);\n      transition: opacity ease-in-out 100ms;\n      width: 66px;\n    }\n\n    #appearance-items-category-favorites .slot.ee-available-slot:hover::after,\n    #appearance-items-category-favorites .slot.ee-outfit-thumb:hover p {\n      opacity: 1;\n    }\n\n    #appearance-items-category-favorites .slot.ee-outfit-thumb img {\n      border-radius: 44px;\n      height: 100%;\n      width: 100%;\n    }\n\n    #appearance-items-category-favorites .slot.ee-outfit-thumb p {\n      background: rgba(0, 0, 0, 0.5);\n      color: #fff;\n      font-family: \"Alegreya Sans SC\", sans-serif;\n      font-size: 22px;\n      font-weight: 700;\n      left: 50%;\n      line-height: 22px;\n      opacity: 0;\n      padding: 12px 0;\n      position: absolute;\n      text-align: center;\n      top: 50%;\n      transform: translate(-50%, -50%);\n      transition: opacity ease-in-out 400ms;\n      width: 100%;\n    }\n  </style>\n\n  {{#outfits}}\n  <div class=\"slot ee-outfit-thumb\" data-array-index=\"{{id}}\">\n    <img alt=\"{{name}}\" src=\"{{url}}\" />\n    <p>{{name}}</p>\n  </div>\n  {{/outfits}}\n\n  <div class=\"slot ee-available-slot\"></div>\n</div>\n", H);return T; }();

/***/ }),

/***/ "./src/templates/html/profile_contact_action.html":
/*!********************************************************!*\
  !*** ./src/templates/html/profile_contact_action.html ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var H = __webpack_require__(/*! hogan.js */ "./node_modules/.pnpm/hogan.js@3.0.2/node_modules/hogan.js/lib/hogan.js");
module.exports = function() { var T = new H.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<li id=\"");t.b(t.v(t.f("id",c,p,0)));t.b("\" class=\"profile-contact-action-ee\">");t.b("\n" + i);t.b("  <span class=\"nl-button nl-button-sm\">");t.b("\n" + i);t.b("    <div class=\"action-description\">");t.b(t.v(t.f("actionDescription",c,p,0)));t.b("</div>");t.b("\n" + i);t.b("  </span>");t.b("\n" + i);t.b("</li>");t.b("\n");return t.fl(); },partials: {}, subs: {  }}, "<li id=\"{{id}}\" class=\"profile-contact-action-ee\">\n  <span class=\"nl-button nl-button-sm\">\n    <div class=\"action-description\">{{actionDescription}}</div>\n  </span>\n</li>\n", H);return T; }();

/***/ }),

/***/ "./src/templates/html/rename_favourite_outfit_flavr.html":
/*!***************************************************************!*\
  !*** ./src/templates/html/rename_favourite_outfit_flavr.html ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var H = __webpack_require__(/*! hogan.js */ "./node_modules/.pnpm/hogan.js@3.0.2/node_modules/hogan.js/lib/hogan.js");
module.exports = function() { var T = new H.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<style>");t.b("\n" + i);t.b("  .created-outfit-popup .flavr-outer .flavr-message::after {");t.b("\n" + i);t.b("    background-image: url(");t.b(t.v(t.f("url",c,p,0)));t.b(");");t.b("\n" + i);t.b("    background-size: contain;");t.b("\n" + i);t.b("  }");t.b("\n" + i);t.b("</style>");t.b("\n");t.b("\n" + i);t.b("<h1>");t.b(t.t(t.f("title",c,p,0)));t.b("</h1>");t.b("\n");t.b("\n" + i);t.b("<p>");t.b(t.t(t.d("translate.appearance.favourites.click_outfit.saved_locally",c,p,0)));t.b("</p>");t.b("\n");t.b("\n" + i);t.b("<br />");t.b("\n");t.b("\n" + i);t.b("<p>");t.b(t.t(t.d("translate.appearance.favourites.click_outfit.goto_account",c,p,0)));t.b("</p>");t.b("\n");t.b("\n" + i);t.b("<input");t.b("\n" + i);t.b("  id=\"choose-name\"");t.b("\n" + i);t.b("  maxlength=\"30\"");t.b("\n" + i);t.b("  minlength=\"1\"");t.b("\n" + i);t.b("  placeholder=\"");t.b(t.v(t.f("name",c,p,0)));t.b("\"");t.b("\n" + i);t.b("  value=\"");t.b(t.v(t.f("name",c,p,0)));t.b("\"");t.b("\n" + i);t.b("/>");t.b("\n");return t.fl(); },partials: {}, subs: {  }}, "<style>\n  .created-outfit-popup .flavr-outer .flavr-message::after {\n    background-image: url({{url}});\n    background-size: contain;\n  }\n</style>\n\n<h1>{{{title}}}</h1>\n\n<p>{{{translate.appearance.favourites.click_outfit.saved_locally}}}</p>\n\n<br />\n\n<p>{{{translate.appearance.favourites.click_outfit.goto_account}}}</p>\n\n<input\n  id=\"choose-name\"\n  maxlength=\"30\"\n  minlength=\"1\"\n  placeholder=\"{{name}}\"\n  value=\"{{name}}\"\n/>\n", H);return T; }();

/***/ }),

/***/ "./src/templates/html/settings.html":
/*!******************************************!*\
  !*** ./src/templates/html/settings.html ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var H = __webpack_require__(/*! hogan.js */ "./node_modules/.pnpm/hogan.js@3.0.2/node_modules/hogan.js/lib/hogan.js");
module.exports = function() { var T = new H.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<div class=\"account-misc-bloc account-ee-bloc bloc\">");t.b("\n" + i);t.b("  <!--");t.b("\n" + i);t.b("  <style>");t.b("\n" + i);t.b("    table {");t.b("\n" + i);t.b("      width: 100%;");t.b("\n" + i);t.b("    }");t.b("\n");t.b("\n" + i);t.b("    th {");t.b("\n" + i);t.b("      text-align: start;");t.b("\n" + i);t.b("      padding: 1em;");t.b("\n" + i);t.b("    }");t.b("\n" + i);t.b("  </style>");t.b("\n" + i);t.b("  -->");t.b("\n");t.b("\n" + i);t.b("  <!-- Settings -->");t.b("\n" + i);t.b("  <h2 class=\"section-title\">");t.b(t.v(t.d("translate.account.enhancements",c,p,0)));t.b("</h2>");t.b("\n" + i);t.b("  <ul class=\"account-misc-actions\">");t.b("\n" + i);t.b("    <li");t.b("\n" + i);t.b("      id=\"ee-debug-enabled\"");t.b("\n" + i);t.b("      class=\"nl-button nl-button-sm ");if(t.s(t.f("debug",c,p,1),c,p,0,392,398,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("active");});c.pop();}t.b("\"");t.b("\n" + i);t.b("      title=\"");t.b(t.v(t.d("translate.account.debug_tooltip",c,p,0)));t.b("\"");t.b("\n" + i);t.b("    >");t.b("\n" + i);t.b("      ");t.b(t.v(t.d("translate.account.debug",c,p,0)));t.b("\n" + i);t.b("    </li>");t.b("\n" + i);if(t.s(t.f("unlocked",c,p,1),c,p,0,527,1030,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("    <li");t.b("\n" + i);t.b("      id=\"ee-minigames-enabled\"");t.b("\n" + i);t.b("      class=\"nl-button nl-button-sm ");if(t.s(t.f("minigames",c,p,1),c,p,0,618,624,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("active");});c.pop();}t.b("\"");t.b("\n" + i);t.b("    >");t.b("\n" + i);t.b("      ");t.b(t.v(t.d("translate.account.minigames",c,p,0)));t.b("\n" + i);t.b("    </li>");t.b("\n" + i);t.b("    <li");t.b("\n" + i);t.b("      id=\"ee-explorations-enabled\"");t.b("\n" + i);t.b("      class=\"nl-button nl-button-sm ");if(t.s(t.f("explorations",c,p,1),c,p,0,790,796,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("active");});c.pop();}t.b("\"");t.b("\n" + i);t.b("    >");t.b("\n" + i);t.b("      ");t.b(t.v(t.d("translate.account.explorations",c,p,0)));t.b("\n" + i);t.b("    </li>");t.b("\n" + i);t.b("    <li");t.b("\n" + i);t.b("      id=\"ee-market-enabled\"");t.b("\n" + i);t.b("      class=\"nl-button nl-button-sm ");if(t.s(t.f("market",c,p,1),c,p,0,956,962,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("active");});c.pop();}t.b("\"");t.b("\n" + i);t.b("    >");t.b("\n" + i);t.b("      ");t.b(t.v(t.d("translate.account.market",c,p,0)));t.b("\n" + i);t.b("    </li>");t.b("\n" + i);});c.pop();}t.b("    <li id=\"ee-import\" class=\"nl-button nl-button-sm\">");t.b("\n" + i);t.b("      ");t.b(t.v(t.d("translate.account.import",c,p,0)));t.b("\n" + i);t.b("    </li>");t.b("\n" + i);t.b("    <li id=\"ee-export\" class=\"nl-button nl-button-sm\">");t.b("\n" + i);t.b("      ");t.b(t.v(t.d("translate.account.export",c,p,0)));t.b("\n" + i);t.b("    </li>");t.b("\n" + i);t.b("    <li id=\"ee-delete-explorations\" class=\"nl-button nl-button-sm\">");t.b("\n" + i);t.b("      ");t.b(t.v(t.d("translate.account.delete_explorations",c,p,0)));t.b("\n" + i);t.b("    </li>");t.b("\n" + i);t.b("    <li id=\"ee-reset\" class=\"nl-button nl-button-sm\">");t.b("\n" + i);t.b("      ");t.b(t.v(t.d("translate.account.reset",c,p,0)));t.b("\n" + i);t.b("    </li>");t.b("\n" + i);t.b("  </ul>");t.b("\n");t.b("\n" + i);t.b("  <!-- Explorations");t.b("\n" + i);t.b("  <h3 class=\"section-title\">Explorations</h3>");t.b("\n" + i);t.b("  <table>");t.b("\n" + i);t.b("    <thead>");t.b("\n" + i);t.b("      <th>Location</th>");t.b("\n" + i);t.b("      <th>Delete</th>");t.b("\n" + i);t.b("    </thead>");t.b("\n" + i);t.b("    <tbody>");t.b("\n" + i);t.b("      <td>Rock</td>");t.b("\n" + i);t.b("      <td>");t.b("\n" + i);t.b("        <div class=\"nl-button nl-button-sm\">Delete</div>");t.b("\n" + i);t.b("      </td>");t.b("\n" + i);t.b("    </tbody>");t.b("\n" + i);t.b("  </table>");t.b("\n" + i);t.b("  -->");t.b("\n" + i);t.b("</div>");t.b("\n");return t.fl(); },partials: {}, subs: {  }}, "<div class=\"account-misc-bloc account-ee-bloc bloc\">\n  <!--\n  <style>\n    table {\n      width: 100%;\n    }\n\n    th {\n      text-align: start;\n      padding: 1em;\n    }\n  </style>\n  -->\n\n  <!-- Settings -->\n  <h2 class=\"section-title\">{{translate.account.enhancements}}</h2>\n  <ul class=\"account-misc-actions\">\n    <li\n      id=\"ee-debug-enabled\"\n      class=\"nl-button nl-button-sm {{#debug}}active{{/debug}}\"\n      title=\"{{translate.account.debug_tooltip}}\"\n    >\n      {{translate.account.debug}}\n    </li>\n    {{#unlocked}}\n    <li\n      id=\"ee-minigames-enabled\"\n      class=\"nl-button nl-button-sm {{#minigames}}active{{/minigames}}\"\n    >\n      {{translate.account.minigames}}\n    </li>\n    <li\n      id=\"ee-explorations-enabled\"\n      class=\"nl-button nl-button-sm {{#explorations}}active{{/explorations}}\"\n    >\n      {{translate.account.explorations}}\n    </li>\n    <li\n      id=\"ee-market-enabled\"\n      class=\"nl-button nl-button-sm {{#market}}active{{/market}}\"\n    >\n      {{translate.account.market}}\n    </li>\n    {{/unlocked}}\n    <li id=\"ee-import\" class=\"nl-button nl-button-sm\">\n      {{translate.account.import}}\n    </li>\n    <li id=\"ee-export\" class=\"nl-button nl-button-sm\">\n      {{translate.account.export}}\n    </li>\n    <li id=\"ee-delete-explorations\" class=\"nl-button nl-button-sm\">\n      {{translate.account.delete_explorations}}\n    </li>\n    <li id=\"ee-reset\" class=\"nl-button nl-button-sm\">\n      {{translate.account.reset}}\n    </li>\n  </ul>\n\n  <!-- Explorations\n  <h3 class=\"section-title\">Explorations</h3>\n  <table>\n    <thead>\n      <th>Location</th>\n      <th>Delete</th>\n    </thead>\n    <tbody>\n      <td>Rock</td>\n      <td>\n        <div class=\"nl-button nl-button-sm\">Delete</div>\n      </td>\n    </tbody>\n  </table>\n  -->\n</div>\n", H);return T; }();

/***/ }),

/***/ "./src/templates/html/wishlist_button.html":
/*!*************************************************!*\
  !*** ./src/templates/html/wishlist_button.html ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var H = __webpack_require__(/*! hogan.js */ "./node_modules/.pnpm/hogan.js@3.0.2/node_modules/hogan.js/lib/hogan.js");
module.exports = function() { var T = new H.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<a id=\"wishlist-button\" class=\"nl-button\">");t.b("\n" + i);t.b("  ");t.b(t.v(t.d("translate.market.wishlist.title",c,p,0)));t.b("\n" + i);t.b("</a>");t.b("\n");return t.fl(); },partials: {}, subs: {  }}, "<a id=\"wishlist-button\" class=\"nl-button\">\n  {{translate.market.wishlist.title}}\n</a>\n", H);return T; }();

/***/ }),

/***/ "./src/templates/html/wishlist_settings.html":
/*!***************************************************!*\
  !*** ./src/templates/html/wishlist_settings.html ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var H = __webpack_require__(/*! hogan.js */ "./node_modules/.pnpm/hogan.js@3.0.2/node_modules/hogan.js/lib/hogan.js");
module.exports = function() { var T = new H.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<style>");t.b("\n" + i);t.b("  .reset-all {");t.b("\n" + i);t.b("    margin-bottom: 1em;");t.b("\n" + i);t.b("  }");t.b("\n");t.b("\n" + i);t.b("  table {");t.b("\n" + i);t.b("    text-align: center;");t.b("\n" + i);t.b("    width: 100%;");t.b("\n" + i);t.b("  }");t.b("\n");t.b("\n" + i);t.b("  .text-padding {");t.b("\n" + i);t.b("    padding: 0.25em;");t.b("\n" + i);t.b("  }");t.b("\n");t.b("\n" + i);t.b("  .action-picto {");t.b("\n" + i);t.b("    height: 50px;");t.b("\n" + i);t.b("    width: 50px;");t.b("\n" + i);t.b("    cursor: pointer;");t.b("\n" + i);t.b("  }");t.b("\n");t.b("\n" + i);t.b("  .action-picto:hover:not(.disabled),");t.b("\n" + i);t.b("  .edit-price:hover {");t.b("\n" + i);t.b("    animation: button-bounce 300ms linear forwards;");t.b("\n" + i);t.b("    filter: brightness(1.05) contrast(1.1);");t.b("\n" + i);t.b("  }");t.b("\n");t.b("\n" + i);t.b("  .row {");t.b("\n" + i);t.b("    display: flex;");t.b("\n" + i);t.b("    justify-content: center;");t.b("\n" + i);t.b("    align-items: center;");t.b("\n" + i);t.b("  }");t.b("\n");t.b("\n" + i);t.b("  .edit-price {");t.b("\n" + i);t.b("    cursor: pointer;");t.b("\n" + i);t.b("  }");t.b("\n");t.b("\n" + i);t.b("  img.disabled {");t.b("\n" + i);t.b("    filter: grayscale(1);");t.b("\n" + i);t.b("  }");t.b("\n");t.b("\n" + i);t.b("  .item-icon-container {");t.b("\n" + i);t.b("    display: inline-block;");t.b("\n" + i);t.b("    position: relative;");t.b("\n" + i);t.b("  }");t.b("\n");t.b("\n" + i);t.b("  .item-icon {");t.b("\n" + i);t.b("    width: 100px;");t.b("\n" + i);t.b("    height: 100px;");t.b("\n" + i);t.b("  }");t.b("\n" + i);t.b("</style>");t.b("\n");t.b("\n" + i);t.b("<button class=\"nl-button reset-all\">");t.b("\n" + i);t.b("  ");t.b(t.v(t.d("translate.market.wishlist.reset_all",c,p,0)));t.b("\n" + i);t.b("</button>");t.b("\n");t.b("\n" + i);t.b("<table>");t.b("\n" + i);t.b("  <thead>");t.b("\n" + i);t.b("    <tr>");t.b("\n" + i);t.b("      <th>");t.b(t.v(t.d("translate.market.wishlist.icon",c,p,0)));t.b("</th>");t.b("\n" + i);t.b("      <th>");t.b(t.v(t.d("translate.market.wishlist.name",c,p,0)));t.b("</th>");t.b("\n" + i);t.b("      <th>");t.b(t.v(t.d("translate.market.wishlist.price",c,p,0)));t.b("</th>");t.b("\n" + i);t.b("      <th>");t.b(t.v(t.d("translate.market.wishlist.status",c,p,0)));t.b("</th>");t.b("\n" + i);t.b("      <th>");t.b(t.v(t.d("translate.market.wishlist.actions",c,p,0)));t.b("</th>");t.b("\n" + i);t.b("    </tr>");t.b("\n" + i);t.b("  </thead>");t.b("\n" + i);t.b("  <tbody>");t.b("\n" + i);if(t.s(t.f("wishlist",c,p,1),c,p,0,1137,2657,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("    <tr class=\"marketplace-abstract\" data-icon=\"");t.b(t.v(t.f("icon",c,p,0)));t.b("\">");t.b("\n" + i);t.b("      <!-- Icon -->");t.b("\n" + i);t.b("      <td>");t.b("\n" + i);t.b("        <div class=\"item-icon-container\">");t.b("\n" + i);t.b("          <img class=\"item-icon\" src=\"");t.b(t.v(t.f("icon",c,p,0)));t.b("\" alt=\"");t.b(t.v(t.f("name",c,p,0)));t.b("\" />");t.b("\n" + i);t.b("          <div class=\"rarity-marker-");t.b(t.v(t.f("rarity",c,p,0)));t.b("\"></div>");t.b("\n" + i);t.b("        </div>");t.b("\n" + i);t.b("      </td>");t.b("\n");t.b("\n" + i);t.b("      <!-- Name -->");t.b("\n" + i);t.b("      <td class=\"text-padding\">");t.b("\n" + i);t.b("        <div class=\"abstract-name\">");t.b(t.v(t.f("name",c,p,0)));t.b("</div>");t.b("\n" + i);t.b("        <div class=\"abstract-type\">");t.b(t.v(t.f("abstractType",c,p,0)));t.b("</div>");t.b("\n" + i);t.b("      </td>");t.b("\n");t.b("\n" + i);t.b("      <!-- Price -->");t.b("\n" + i);t.b("      <td class=\"text-padding\">");t.b("\n" + i);t.b("        <div");t.b("\n" + i);t.b("          class=\"edit-price row\"");t.b("\n" + i);t.b("          title=\"");t.b(t.v(t.d("translate.market.wishlist.change_price",c,p,0)));t.b("\"");t.b("\n" + i);t.b("        >");t.b("\n" + i);t.b("          <span class=\"price-item\">");t.b(t.v(t.f("price",c,p,0)));t.b("</span>");t.b("\n" + i);t.b("          <span class=\"maana-icon\" alt=\"maanas\"></span>");t.b("\n" + i);t.b("        </div>");t.b("\n" + i);t.b("      </td>");t.b("\n");t.b("\n" + i);t.b("      <!-- Error -->");t.b("\n" + i);t.b("      <td class=\"text-padding\">");t.b("\n" + i);t.b("        <p class=\"error\">");t.b(t.v(t.f("error",c,p,0)));t.b("</p>");t.b("\n" + i);t.b("      </td>");t.b("\n");t.b("\n" + i);t.b("      <!-- Actions -->");t.b("\n" + i);t.b("      <td>");t.b("\n" + i);t.b("        <div class=\"row\">");t.b("\n" + i);t.b("          <img");t.b("\n" + i);t.b("            class=\"action-picto reset-item-status ");if(!t.s(t.f("error",c,p,1),c,p,1,0,0,"")){t.b("disabled");};t.b("\"");t.b("\n" + i);t.b("            src=\"/static/img/new-layout/wardrobe/reset-btn.png\"");t.b("\n" + i);t.b("            title=\"");t.b(t.v(t.d("translate.market.wishlist.reset_tooltip",c,p,0)));t.b("\"");t.b("\n" + i);t.b("            alt=\"");t.b(t.v(t.d("translate.market.wishlist.reset",c,p,0)));t.b("\"");t.b("\n" + i);t.b("          />");t.b("\n" + i);t.b("          <img");t.b("\n" + i);t.b("            class=\"action-picto delete-wishlist-item\"");t.b("\n" + i);t.b("            src=\"/static/img/new-layout/wardrobe/delete.png\"");t.b("\n" + i);t.b("            title=\"");t.b(t.v(t.d("translate.market.wishlist.delete_tooltip",c,p,0)));t.b("\"");t.b("\n" + i);t.b("            alt=\"");t.b(t.v(t.d("translate.market.wishlist.delete",c,p,0)));t.b("\"");t.b("\n" + i);t.b("          />");t.b("\n" + i);t.b("        </div>");t.b("\n" + i);t.b("      </td>");t.b("\n" + i);t.b("    </tr>");t.b("\n" + i);});c.pop();}t.b("  </tbody>");t.b("\n" + i);t.b("</table>");t.b("\n");return t.fl(); },partials: {}, subs: {  }}, "<style>\n  .reset-all {\n    margin-bottom: 1em;\n  }\n\n  table {\n    text-align: center;\n    width: 100%;\n  }\n\n  .text-padding {\n    padding: 0.25em;\n  }\n\n  .action-picto {\n    height: 50px;\n    width: 50px;\n    cursor: pointer;\n  }\n\n  .action-picto:hover:not(.disabled),\n  .edit-price:hover {\n    animation: button-bounce 300ms linear forwards;\n    filter: brightness(1.05) contrast(1.1);\n  }\n\n  .row {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n  }\n\n  .edit-price {\n    cursor: pointer;\n  }\n\n  img.disabled {\n    filter: grayscale(1);\n  }\n\n  .item-icon-container {\n    display: inline-block;\n    position: relative;\n  }\n\n  .item-icon {\n    width: 100px;\n    height: 100px;\n  }\n</style>\n\n<button class=\"nl-button reset-all\">\n  {{translate.market.wishlist.reset_all}}\n</button>\n\n<table>\n  <thead>\n    <tr>\n      <th>{{translate.market.wishlist.icon}}</th>\n      <th>{{translate.market.wishlist.name}}</th>\n      <th>{{translate.market.wishlist.price}}</th>\n      <th>{{translate.market.wishlist.status}}</th>\n      <th>{{translate.market.wishlist.actions}}</th>\n    </tr>\n  </thead>\n  <tbody>\n    {{#wishlist}}\n    <tr class=\"marketplace-abstract\" data-icon=\"{{icon}}\">\n      <!-- Icon -->\n      <td>\n        <div class=\"item-icon-container\">\n          <img class=\"item-icon\" src=\"{{icon}}\" alt=\"{{name}}\" />\n          <div class=\"rarity-marker-{{rarity}}\"></div>\n        </div>\n      </td>\n\n      <!-- Name -->\n      <td class=\"text-padding\">\n        <div class=\"abstract-name\">{{name}}</div>\n        <div class=\"abstract-type\">{{abstractType}}</div>\n      </td>\n\n      <!-- Price -->\n      <td class=\"text-padding\">\n        <div\n          class=\"edit-price row\"\n          title=\"{{translate.market.wishlist.change_price}}\"\n        >\n          <span class=\"price-item\">{{price}}</span>\n          <span class=\"maana-icon\" alt=\"maanas\"></span>\n        </div>\n      </td>\n\n      <!-- Error -->\n      <td class=\"text-padding\">\n        <p class=\"error\">{{error}}</p>\n      </td>\n\n      <!-- Actions -->\n      <td>\n        <div class=\"row\">\n          <img\n            class=\"action-picto reset-item-status {{^error}}disabled{{/error}}\"\n            src=\"/static/img/new-layout/wardrobe/reset-btn.png\"\n            title=\"{{translate.market.wishlist.reset_tooltip}}\"\n            alt=\"{{translate.market.wishlist.reset}}\"\n          />\n          <img\n            class=\"action-picto delete-wishlist-item\"\n            src=\"/static/img/new-layout/wardrobe/delete.png\"\n            title=\"{{translate.market.wishlist.delete_tooltip}}\"\n            alt=\"{{translate.market.wishlist.delete}}\"\n          />\n        </div>\n      </td>\n    </tr>\n    {{/wishlist}}\n  </tbody>\n</table>\n", H);return T; }();

/***/ }),

/***/ "./src/ajax/ajax_search.ts":
/*!*********************************!*\
  !*** ./src/ajax/ajax_search.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ajaxSearch": () => (/* binding */ ajaxSearch)
/* harmony export */ });
/* harmony import */ var _marketplace_enums_body_location_enum__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../marketplace/enums/body_location.enum */ "./src/marketplace/enums/body_location.enum.ts");
/* harmony import */ var _marketplace_enums_category_enum__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../marketplace/enums/category.enum */ "./src/marketplace/enums/category.enum.ts");
/* harmony import */ var _marketplace_enums_guard_enum__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../marketplace/enums/guard.enum */ "./src/marketplace/enums/guard.enum.ts");
/* harmony import */ var _marketplace_enums_rarity_enum__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../marketplace/enums/rarity.enum */ "./src/marketplace/enums/rarity.enum.ts");
/* harmony import */ var _marketplace_enums_type_enum__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../marketplace/enums/type.enum */ "./src/marketplace/enums/type.enum.ts");





async function ajaxSearch(data) {
    data = {
        ...{
            type: _marketplace_enums_type_enum__WEBPACK_IMPORTED_MODULE_4__.Type.All,
            bodyLocation: _marketplace_enums_body_location_enum__WEBPACK_IMPORTED_MODULE_0__.BodyLocation.All,
            category: _marketplace_enums_category_enum__WEBPACK_IMPORTED_MODULE_1__.CategoryNumber.all,
            rarity: _marketplace_enums_rarity_enum__WEBPACK_IMPORTED_MODULE_3__.Rarity.all,
            price: "",
            guard: _marketplace_enums_guard_enum__WEBPACK_IMPORTED_MODULE_2__.Guard.any,
            page: 1,
            name: "",
        },
        ...data,
    };
    const ITEMS_PER_PAGE = 8;
    return (await $.get("/marketplace/ajax_search", {
        ...data,
        from: (data.page - 1) * ITEMS_PER_PAGE,
        to: ITEMS_PER_PAGE,
    }));
}


/***/ }),

/***/ "./src/ajax/buy.ts":
/*!*************************!*\
  !*** ./src/ajax/buy.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "buy": () => (/* binding */ buy)
/* harmony export */ });
/* harmony import */ var _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../local_storage/local_storage */ "./src/local_storage/local_storage.ts");

async function buy(itemId) {
    return new Promise(resolve => {
        void $.post("/marketplace/buy", { id: itemId }, (json) => {
            _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_0__.LocalStorage.meta = json.meta;
            resolve(json);
            if (json.result !== "success") {
                $.flavrNotif(json.data);
                return;
            }
        }, "json");
    });
}


/***/ }),

/***/ "./src/ajax/capture_end.ts":
/*!*********************************!*\
  !*** ./src/ajax/capture_end.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "captureEnd": () => (/* binding */ captureEnd)
/* harmony export */ });
/* harmony import */ var _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../local_storage/local_storage */ "./src/local_storage/local_storage.ts");

async function captureEnd() {
    return new Promise(resolve => {
        void $.post("/pet/capture/end", (json) => {
            _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_0__.LocalStorage.meta = json.meta;
            resolve(json);
            if (json.result !== "success") {
                $.flavrNotif(json.data);
                return;
            }
        });
    });
}


/***/ }),

/***/ "./src/ajax/change_region.ts":
/*!***********************************!*\
  !*** ./src/ajax/change_region.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "changeRegion": () => (/* binding */ changeRegion)
/* harmony export */ });
/* harmony import */ var _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../local_storage/local_storage */ "./src/local_storage/local_storage.ts");

async function changeRegion(newRegionId) {
    return new Promise((resolve) => {
        void $.post("/pet/changeRegion", { newRegionId }, (json) => {
            _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_0__.LocalStorage.meta = json.meta;
            resolve(json);
            if (json.result !== "success") {
                $.flavrNotif(json.data);
                return;
            }
            currentRegion = json.data.currentRegion;
            pendingTreasureHuntLocation =
                typeof json.data.pendingTreasureHuntLocation === "undefined"
                    ? null
                    : json.data.pendingTreasureHuntLocation;
            timeLeftExploration =
                typeof json.data.timeLeftExploration === "undefined"
                    ? null
                    : json.data.timeLeftExploration;
        });
    });
}


/***/ }),

/***/ "./src/ajax/exploration_results.ts":
/*!*****************************************!*\
  !*** ./src/ajax/exploration_results.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "explorationResults": () => (/* binding */ explorationResults)
/* harmony export */ });
/* harmony import */ var _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../local_storage/local_storage */ "./src/local_storage/local_storage.ts");

async function explorationResults() {
    return new Promise((resolve) => {
        void $.post("/pet/explorationResults", (json) => {
            _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_0__.LocalStorage.meta = json.meta;
            resolve(json);
            if (json.result !== "success") {
                $.flavrNotif(json.data);
                return;
            }
        });
    });
}


/***/ }),

/***/ "./src/api/meta.ts":
/*!*************************!*\
  !*** ./src/api/meta.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PurroshopStatus": () => (/* binding */ PurroshopStatus)
/* harmony export */ });
var PurroshopStatus;
(function (PurroshopStatus) {
    PurroshopStatus["disabled"] = "disabled";
    PurroshopStatus["enabled"] = "enabled";
})(PurroshopStatus || (PurroshopStatus = {}));


/***/ }),

/***/ "./src/api/result.enum.ts":
/*!********************************!*\
  !*** ./src/api/result.enum.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Result": () => (/* binding */ Result)
/* harmony export */ });
var Result;
(function (Result) {
    Result["error"] = "error";
    Result["success"] = "success";
})(Result || (Result = {}));


/***/ }),

/***/ "./src/appearance/appearance_ui.ts":
/*!*****************************************!*\
  !*** ./src/appearance/appearance_ui.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "loadAppearanceUI": () => (/* binding */ loadAppearanceUI)
/* harmony export */ });
/* harmony import */ var _wardrobe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./wardrobe */ "./src/appearance/wardrobe.ts");

function loadAppearanceUI() {
    setupBackground();
    setupLeftPanel();
    setupRightPanel();
    if (_wardrobe__WEBPACK_IMPORTED_MODULE_0__["default"].availableItems)
        availableItems = _wardrobe__WEBPACK_IMPORTED_MODULE_0__["default"].availableItems;
    else
        _wardrobe__WEBPACK_IMPORTED_MODULE_0__["default"].availableItems = availableItems;
}
function setupBackground() {
    const background = document.querySelector("#avatar-background img");
    if (background) {
        background.style.filter = "unset";
        background.style.height = "unset";
        background.style.mask =
            "linear-gradient(to right, black 50%, transparent 100%)";
        background.style.minHeight = "100vh";
        background.style.minWidth = "50vw";
        background.style.position = "fixed";
        background.style.transform = "unset";
        background.style.width = "unset";
    }
}
function setupRightPanel() {
    const rightPanel = document.getElementById("appearance-right");
    if (rightPanel)
        rightPanel.style.paddingTop = "80px";
}
function setupLeftPanel() {
    const previewOuter = document.getElementById("appearance-preview-outer");
    if (previewOuter) {
        previewOuter.style.padding = "0px";
    }
    const preview = document.getElementById("appearance-preview");
    if (preview) {
        preview.style.left = "0";
        preview.style.position = "fixed";
        preview.style.top = "calc(50% - var(--topbar-height))";
        preview.style.transform = "translateY(-50%)";
    }
    const canvas = document.querySelector("#appearance-preview canvas");
    if (canvas) {
        canvas.style.maxHeight = "100vh";
        canvas.style.maxWidth = "50vw";
    }
}


/***/ }),

/***/ "./src/appearance/data_set.ts":
/*!************************************!*\
  !*** ./src/appearance/data_set.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "categoryContainerDataSet": () => (/* binding */ categoryContainerDataSet),
/* harmony export */   "categoryGroupDataSet": () => (/* binding */ categoryGroupDataSet),
/* harmony export */   "itemDataSet": () => (/* binding */ itemDataSet)
/* harmony export */ });
/* harmony import */ var _eldarya_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../eldarya_util */ "./src/eldarya_util.ts");

function categoryContainerDataSet(categoryContainer) {
    const { categoryid, category, categoryname } = categoryContainer.dataset;
    if (!categoryid || !category || !categoryname)
        return;
    return {
        categoryid: Number(categoryid),
        category: category,
        categoryname,
    };
}
function categoryGroupDataSet(groupItem, appearanceCategory) {
    const { itemid, group, name, rarity, rarityname } = groupItem.dataset;
    if (!itemid || !group || !name || !rarity || !rarityname)
        return;
    return {
        ...appearanceCategory,
        itemid: Number(itemid),
        group: Number(group),
        name,
        rarity,
        rarityname,
    };
}
function itemDataSet(li, appearanceGroup) {
    const { itemid, name, rarity, rarityname } = li.dataset;
    const icon = li.querySelector("img")?.src;
    if (!itemid || !name || !rarity || !rarityname || !icon)
        return;
    return {
        ...appearanceGroup,
        itemid: Number(itemid),
        name,
        rarity,
        rarityname,
        icon: (0,_eldarya_util__WEBPACK_IMPORTED_MODULE_0__.trimIcon)(icon),
    };
}


/***/ }),

/***/ "./src/appearance/dressing_experience.ts":
/*!***********************************************!*\
  !*** ./src/appearance/dressing_experience.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "loadBackground": () => (/* binding */ loadBackground),
/* harmony export */   "loadDressingExperience": () => (/* binding */ loadDressingExperience)
/* harmony export */ });
/* harmony import */ var _i18n_translate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../i18n/translate */ "./src/i18n/translate.ts");
/* harmony import */ var _ts_util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ts_util */ "./src/ts_util.ts");
/* harmony import */ var _ui_favourites__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../ui/favourites */ "./src/ui/favourites.ts");
/* harmony import */ var _appearance_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./appearance_ui */ "./src/appearance/appearance_ui.ts");
/* harmony import */ var _data_set__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./data_set */ "./src/appearance/data_set.ts");
/* harmony import */ var _enums_appearance_category_code_enum__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./enums/appearance_category_code.enum */ "./src/appearance/enums/appearance_category_code.enum.ts");
/* harmony import */ var _favourites_actions__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./favourites_actions */ "./src/appearance/favourites_actions.ts");
/* harmony import */ var _hidden__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./hidden */ "./src/appearance/hidden.ts");
/* harmony import */ var _wardrobe__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./wardrobe */ "./src/appearance/wardrobe.ts");









async function loadDressingExperience() {
    if (!location.pathname.startsWith("/player/appearance"))
        return;
    handledCategories.clear();
    loading = false;
    (0,_appearance_ui__WEBPACK_IMPORTED_MODULE_3__.loadAppearanceUI)();
    // Setup categories
    for (const li of document.querySelectorAll("#wardrobe-menu>li, #appearance-items-categories li")) {
        const { category } = li.dataset;
        if (!(0,_ts_util__WEBPACK_IMPORTED_MODULE_1__.isEnum)(category, _enums_appearance_category_code_enum__WEBPACK_IMPORTED_MODULE_5__.AppearanceCategoryCode))
            continue;
        switch (category) {
            case _enums_appearance_category_code_enum__WEBPACK_IMPORTED_MODULE_5__.AppearanceCategoryCode.background:
                li.addEventListener("click", () => document.getElementById("ee-category")?.remove());
                continue;
            case _enums_appearance_category_code_enum__WEBPACK_IMPORTED_MODULE_5__.AppearanceCategoryCode.favorites:
                li.addEventListener("click", () => {
                    document.getElementById("ee-category")?.remove();
                    void handleCategory(category);
                });
                continue;
            case _enums_appearance_category_code_enum__WEBPACK_IMPORTED_MODULE_5__.AppearanceCategoryCode.attic:
                continue;
            default:
                li.addEventListener("click", () => {
                    document
                        .getElementById("appearance-items-category-favorites")
                        ?.remove();
                    // void handleCategory(category)
                });
        }
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    // await loadBackground()
}
/**
 * Get the category container for the clicked category and load its groups
 * @returns Category container
 */
async function handleCategory(category) {
    const appearanceItems = document.querySelector("#appearance-items");
    if (!appearanceItems)
        return null;
    const oldCatContainer = document.querySelector(`#appearance-items-category-${category}`);
    if (oldCatContainer) {
        await onAppearanceItemsCategory(category, appearanceItems, oldCatContainer);
        return oldCatContainer;
    }
    return new Promise(resolve => {
        new MutationObserver((_, observer) => {
            const newCatContainer = document.querySelector(`#appearance-items-category-${category}`);
            if (!newCatContainer)
                return;
            observer.disconnect();
            void (async () => {
                await onAppearanceItemsCategory(category, appearanceItems, newCatContainer);
                resolve(newCatContainer);
            })();
        }).observe(appearanceItems, { childList: true });
    });
}
async function onAppearanceItemsCategory(category, appearanceItems, categoryContainer) {
    if (category === _enums_appearance_category_code_enum__WEBPACK_IMPORTED_MODULE_5__.AppearanceCategoryCode.favorites)
        (0,_ui_favourites__WEBPACK_IMPORTED_MODULE_2__.loadFavourites)();
    else {
        await new Promise(resolve => setTimeout(resolve, 220));
        loadEeItems(appearanceItems, categoryContainer);
        await handleGroups(categoryContainer);
    }
}
function loadEeItems(appearanceItems, categoryContainer) {
    // Get information about the current category
    const appearanceCategory = (0,_data_set__WEBPACK_IMPORTED_MODULE_4__.categoryContainerDataSet)(categoryContainer);
    if (!appearanceCategory)
        return null;
    _wardrobe__WEBPACK_IMPORTED_MODULE_8__["default"].setCategory(appearanceCategory);
    categoryContainer.classList.remove("active");
    categoryContainer.style.display = "none";
    // Setup appearance_items_category
    const template = __webpack_require__(/*! ../templates/html/appearance_items_category.html */ "./src/templates/html/appearance_items_category.html");
    document.getElementById("ee-category")?.remove();
    appearanceItems.insertAdjacentHTML("beforeend", template.render({ ...appearanceCategory, translate: _i18n_translate__WEBPACK_IMPORTED_MODULE_0__.translate }));
    const eeItems = document.querySelector("#ee-items");
    if (!eeItems)
        return null;
    eeItems.dataset.categoryid = appearanceCategory.categoryid.toString();
    eeItems.dataset.category = appearanceCategory.category;
    eeItems.dataset.categoryname = appearanceCategory.categoryname;
    return eeItems;
}
const handledCategories = new Set();
/** Load each groups synchronously and add them to a custom container. */
async function handleGroups(categoryContainer) {
    const appearanceCategory = (0,_data_set__WEBPACK_IMPORTED_MODULE_4__.categoryContainerDataSet)(categoryContainer);
    if (!appearanceCategory)
        return;
    _wardrobe__WEBPACK_IMPORTED_MODULE_8__["default"].setCategory(appearanceCategory);
    categoryContainer.classList.remove("active");
    categoryContainer.style.display = "none";
    const handled = handledCategories.has(appearanceCategory.category);
    handledCategories.add(appearanceCategory.category);
    (0,_hidden__WEBPACK_IMPORTED_MODULE_7__.loadHiddenCategory)(appearanceCategory.category);
    for (const li of categoryContainer.querySelectorAll("li.appearance-item-group")) {
        const appearanceGroup = (0,_data_set__WEBPACK_IMPORTED_MODULE_4__.categoryGroupDataSet)(li, appearanceCategory);
        if (!appearanceGroup?.group)
            break;
        _wardrobe__WEBPACK_IMPORTED_MODULE_8__["default"].setGroup(appearanceGroup);
        if (!document.querySelector(`#appearance-items-group-${appearanceGroup.group}`) &&
            !handled
        // && !loadHiddenGroup(appearanceGroup.group)
        )
            await (0,_favourites_actions__WEBPACK_IMPORTED_MODULE_6__.openGroup)(appearanceGroup.group);
        const div = document.querySelector(`#appearance-items-group-${appearanceGroup.group}`);
        if (!div)
            break;
        div.classList.remove("active");
        const script = div.querySelector("script"); // eslint-disable-next-line @typescript-eslint/no-implied-eval
        if (script)
            setTimeout(script.innerHTML, 0);
        const outerHTML = Array.from(div.querySelectorAll("li.appearance-item"))
            .map(li => {
            const appearanceItem = (0,_data_set__WEBPACK_IMPORTED_MODULE_4__.itemDataSet)(li, appearanceGroup);
            if (!appearanceItem?.icon)
                return li.outerHTML;
            li.dataset.categoryid = appearanceItem.categoryid.toString();
            li.dataset.category = appearanceItem.category;
            li.dataset.categoryname = appearanceItem.categoryname;
            li.dataset.group = appearanceItem.group.toString();
            _wardrobe__WEBPACK_IMPORTED_MODULE_8__["default"].setItem(appearanceItem);
            return li.outerHTML;
        })
            .join("\n");
        _wardrobe__WEBPACK_IMPORTED_MODULE_8__["default"].availableItems = availableItems;
        div.remove();
        const active = document.querySelector(`#wardrobe-menu li[data-category="${appearanceGroup.category}"].active`);
        if (active) {
            document
                .querySelector("#ee-items")
                ?.insertAdjacentHTML("beforeend", outerHTML);
            initializeSelectedItems();
            initializeHiddenCategories();
        }
        else if (handled)
            break;
    }
    if (!handled)
        handledCategories.delete(appearanceCategory.category);
    (0,_hidden__WEBPACK_IMPORTED_MODULE_7__.unloadHiddenCategories)();
}
let loading = false;
async function loadBackground() {
    if (loading)
        return;
    loading = true;
    let success = true;
    const categories = [
        _enums_appearance_category_code_enum__WEBPACK_IMPORTED_MODULE_5__.AppearanceCategoryCode.underwear,
        _enums_appearance_category_code_enum__WEBPACK_IMPORTED_MODULE_5__.AppearanceCategoryCode.skin,
        _enums_appearance_category_code_enum__WEBPACK_IMPORTED_MODULE_5__.AppearanceCategoryCode.tatoo,
        _enums_appearance_category_code_enum__WEBPACK_IMPORTED_MODULE_5__.AppearanceCategoryCode.mouth,
        _enums_appearance_category_code_enum__WEBPACK_IMPORTED_MODULE_5__.AppearanceCategoryCode.eye,
        _enums_appearance_category_code_enum__WEBPACK_IMPORTED_MODULE_5__.AppearanceCategoryCode.hair,
        _enums_appearance_category_code_enum__WEBPACK_IMPORTED_MODULE_5__.AppearanceCategoryCode.sock,
        _enums_appearance_category_code_enum__WEBPACK_IMPORTED_MODULE_5__.AppearanceCategoryCode.shoe,
        _enums_appearance_category_code_enum__WEBPACK_IMPORTED_MODULE_5__.AppearanceCategoryCode.pants,
        _enums_appearance_category_code_enum__WEBPACK_IMPORTED_MODULE_5__.AppearanceCategoryCode.handAccessory,
        _enums_appearance_category_code_enum__WEBPACK_IMPORTED_MODULE_5__.AppearanceCategoryCode.top,
        _enums_appearance_category_code_enum__WEBPACK_IMPORTED_MODULE_5__.AppearanceCategoryCode.coat,
        _enums_appearance_category_code_enum__WEBPACK_IMPORTED_MODULE_5__.AppearanceCategoryCode.glove,
        _enums_appearance_category_code_enum__WEBPACK_IMPORTED_MODULE_5__.AppearanceCategoryCode.necklace,
        _enums_appearance_category_code_enum__WEBPACK_IMPORTED_MODULE_5__.AppearanceCategoryCode.dress,
        _enums_appearance_category_code_enum__WEBPACK_IMPORTED_MODULE_5__.AppearanceCategoryCode.hat,
        _enums_appearance_category_code_enum__WEBPACK_IMPORTED_MODULE_5__.AppearanceCategoryCode.faceAccessory,
        _enums_appearance_category_code_enum__WEBPACK_IMPORTED_MODULE_5__.AppearanceCategoryCode.belt,
        _enums_appearance_category_code_enum__WEBPACK_IMPORTED_MODULE_5__.AppearanceCategoryCode.ambient,
    ];
    const template = __webpack_require__(/*! ../templates/html/flavr_notif/icon_message.html */ "./src/templates/html/flavr_notif/icon_message.html");
    for (const category of categories) {
        if (!location.pathname.startsWith("/player/appearance")) {
            success = false;
            break;
        }
        const active = document.querySelector(`#wardrobe-menu li[data-category="${category}"].active`);
        if (active)
            continue;
        const categoryContainer = await (0,_favourites_actions__WEBPACK_IMPORTED_MODULE_6__.openCategory)(category);
        if (!categoryContainer) {
            success = false;
            break;
        }
        let finished = false;
        setTimeout(() => {
            if (!finished)
                $.flavrNotif(template.render({
                    icon: `/static/img/mall/categories/${category}.png`,
                    message: _i18n_translate__WEBPACK_IMPORTED_MODULE_0__.translate.appearance.loading(document.querySelector(`#wardrobe-menu li[data-category="${category}"]`)?.dataset.categoryname ?? category),
                }));
        }, 1000);
        await handleGroups(categoryContainer);
        finished = true;
    }
    if (success)
        $.flavrNotif(_i18n_translate__WEBPACK_IMPORTED_MODULE_0__.translate.appearance.loaded);
    loading = false;
}


/***/ }),

/***/ "./src/appearance/enums/appearance_category_code.enum.ts":
/*!***************************************************************!*\
  !*** ./src/appearance/enums/appearance_category_code.enum.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AppearanceCategoryCode": () => (/* binding */ AppearanceCategoryCode)
/* harmony export */ });
var AppearanceCategoryCode;
(function (AppearanceCategoryCode) {
    AppearanceCategoryCode["attic"] = "attic";
    AppearanceCategoryCode["favorites"] = "favorites";
    AppearanceCategoryCode["underwear"] = "underwear";
    AppearanceCategoryCode["skin"] = "skin";
    AppearanceCategoryCode["tatoo"] = "tatoo";
    AppearanceCategoryCode["mouth"] = "mouth";
    AppearanceCategoryCode["eye"] = "eye";
    AppearanceCategoryCode["hair"] = "hair";
    AppearanceCategoryCode["sock"] = "sock";
    AppearanceCategoryCode["shoe"] = "shoe";
    AppearanceCategoryCode["pants"] = "pants";
    AppearanceCategoryCode["handAccessory"] = "handAccessory";
    AppearanceCategoryCode["top"] = "top";
    AppearanceCategoryCode["coat"] = "coat";
    AppearanceCategoryCode["glove"] = "glove";
    AppearanceCategoryCode["necklace"] = "necklace";
    AppearanceCategoryCode["dress"] = "dress";
    AppearanceCategoryCode["hat"] = "hat";
    AppearanceCategoryCode["faceAccessory"] = "faceAccessory";
    AppearanceCategoryCode["background"] = "background";
    AppearanceCategoryCode["belt"] = "belt";
    AppearanceCategoryCode["ambient"] = "ambient";
})(AppearanceCategoryCode || (AppearanceCategoryCode = {}));


/***/ }),

/***/ "./src/appearance/fake_favourites.ts":
/*!*******************************************!*\
  !*** ./src/appearance/fake_favourites.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "saveFavourite": () => (/* binding */ saveFavourite),
/* harmony export */   "showFavourite": () => (/* binding */ showFavourite),
/* harmony export */   "showRenameFavourite": () => (/* binding */ showRenameFavourite)
/* harmony export */ });
/* harmony import */ var _i18n_translate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../i18n/translate */ "./src/i18n/translate.ts");
/* harmony import */ var _indexed_db_indexed_db__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../indexed_db/indexed_db */ "./src/indexed_db/indexed_db.ts");
/* harmony import */ var _outfit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../outfit */ "./src/outfit.ts");
/* harmony import */ var _ui_favourites__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../ui/favourites */ "./src/ui/favourites.ts");
/* harmony import */ var _favourites_actions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./favourites_actions */ "./src/appearance/favourites_actions.ts");





async function saveFavourite() {
    const favourite = await showOutfit();
    if (favourite)
        await (0,_ui_favourites__WEBPACK_IMPORTED_MODULE_3__.loadFakeFavourites)();
    return favourite;
}
async function deleteFavourite(favourite) {
    await _indexed_db_indexed_db__WEBPACK_IMPORTED_MODULE_1__["default"].deleteFavouriteOutfit(favourite);
    await (0,_ui_favourites__WEBPACK_IMPORTED_MODULE_3__.loadFakeFavourites)();
}
async function showOutfit() {
    const template = __webpack_require__(/*! ../templates/html/created_outfit_flavr.html */ "./src/templates/html/created_outfit_flavr.html");
    return new Promise(resolve => $.flavr({
        content: template.render({ translate: _i18n_translate__WEBPACK_IMPORTED_MODULE_0__.translate }),
        onBuild: $container => {
            $container.addClass("new-layout-popup");
            $container.addClass("created-outfit-popup");
            const saveButton = document.querySelector('[rel="btn-save"]');
            if (!saveButton)
                return;
            document
                .querySelector("#choose-name")
                ?.addEventListener("keyup", event => {
                if (event.key === "Enter")
                    saveButton.click();
                if (document.querySelector("#choose-name")?.value)
                    saveButton.classList.remove("disabled");
                else
                    saveButton.classList.add("disabled");
            });
            saveButton.classList.add("nl-button", "nl-button-lg", "disabled");
        },
        buttons: {
            close: {
                text: "",
                style: "close",
                action: () => {
                    resolve(null);
                    return true;
                },
            },
            save: {
                text: _i18n_translate__WEBPACK_IMPORTED_MODULE_0__.translate.appearance.favourites.save_outfit.save,
                style: "default",
                action: () => {
                    const name = document.querySelector("#choose-name")?.value;
                    if (!name)
                        return false;
                    const avatar = Sacha.Avatar.avatars["#appearance-preview"];
                    if (!avatar)
                        return false;
                    const items = (0,_outfit__WEBPACK_IMPORTED_MODULE_2__.parseAvatar)(avatar);
                    void saveAction(name, items).then(resolve);
                    return true;
                },
            },
        },
    }));
}
function showFavourite(favourite) {
    const template = __webpack_require__(/*! ../templates/html/favourite_outfit_flavr.html */ "./src/templates/html/favourite_outfit_flavr.html");
    $.flavr({
        content: template.render({ ...favourite, translate: _i18n_translate__WEBPACK_IMPORTED_MODULE_0__.translate }),
        onBuild: $container => {
            $container.addClass("new-layout-popup");
            $container.addClass("created-outfit-popup");
        },
        buttons: {
            close: {
                text: "",
                style: "close",
                action: () => true,
            },
            delete: {
                text: _i18n_translate__WEBPACK_IMPORTED_MODULE_0__.translate.appearance.favourites.click_outfit["delete"],
                style: "default",
                action: () => {
                    void deleteFavourite(favourite);
                    return true;
                },
            },
            wear: {
                text: _i18n_translate__WEBPACK_IMPORTED_MODULE_0__.translate.appearance.favourites.click_outfit.wear,
                style: "default",
                action: () => {
                    const avatar = Sacha.Avatar.avatars["#appearance-preview"];
                    if (!avatar)
                        return false;
                    void (async () => (0,_favourites_actions__WEBPACK_IMPORTED_MODULE_4__.wearOutfit)(avatar, favourite.items))();
                    return true;
                },
            },
            rename: {
                text: _i18n_translate__WEBPACK_IMPORTED_MODULE_0__.translate.appearance.favourites.rename_outfit.button,
                style: "default",
                action: () => {
                    setTimeout(() => void showRenameFavourite(favourite).then(favourite => {
                        if (favourite)
                            void (0,_ui_favourites__WEBPACK_IMPORTED_MODULE_3__.loadFakeFavourites)();
                    }), 800);
                    return true;
                },
            },
        },
    });
}
async function saveAction(name, items) {
    const blob = await new Promise((resolve, reject) => {
        document
            .querySelector("#appearance-preview canvas")
            ?.toBlob(blob => {
            if (blob)
                resolve(blob);
            else
                reject("Blob doesn't exist.");
        }, "image/png", 1);
    });
    const favourite = await _indexed_db_indexed_db__WEBPACK_IMPORTED_MODULE_1__["default"].addFavouriteOutfit({ items, name, blob });
    return { ...favourite, url: URL.createObjectURL(blob) };
}
async function showRenameFavourite(favourite) {
    const template = __webpack_require__(/*! ../templates/html/rename_favourite_outfit_flavr.html */ "./src/templates/html/rename_favourite_outfit_flavr.html");
    const rendered = template.render({
        ...favourite,
        title: _i18n_translate__WEBPACK_IMPORTED_MODULE_0__.translate.appearance.favourites.rename_outfit.title(favourite.name),
        translate: _i18n_translate__WEBPACK_IMPORTED_MODULE_0__.translate,
    });
    return new Promise(resolve => {
        $.flavr({
            content: rendered,
            onBuild: $container => {
                $container.addClass("new-layout-popup");
                $container.addClass("created-outfit-popup");
                const renameButton = document.querySelector('[rel="btn-rename"]');
                if (!renameButton)
                    return;
                document
                    .querySelector("#choose-name")
                    ?.addEventListener("keyup", event => {
                    if (event.key === "Enter")
                        renameButton.click();
                    if (document.querySelector("#choose-name")?.value)
                        renameButton.classList.remove("disabled");
                    else
                        renameButton.classList.add("disabled");
                });
                renameButton.classList.add("nl-button", "nl-button-lg", "disabled");
            },
            buttons: {
                close: {
                    text: "",
                    style: "close",
                    action: () => {
                        resolve(null);
                        return true;
                    },
                },
                rename: {
                    text: _i18n_translate__WEBPACK_IMPORTED_MODULE_0__.translate.appearance.favourites.rename_outfit.button,
                    style: "default",
                    action: () => {
                        const name = document.querySelector("#choose-name")?.value;
                        if (!name)
                            return false;
                        void _indexed_db_indexed_db__WEBPACK_IMPORTED_MODULE_1__["default"].updateFavouriteOutfit({ ...favourite, name })
                            .then(resolve);
                        return true;
                    },
                },
            },
        });
    });
}


/***/ }),

/***/ "./src/appearance/favourites_actions.ts":
/*!**********************************************!*\
  !*** ./src/appearance/favourites_actions.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "exportPreview": () => (/* binding */ exportPreview),
/* harmony export */   "importOutfit": () => (/* binding */ importOutfit),
/* harmony export */   "openCategory": () => (/* binding */ openCategory),
/* harmony export */   "openGroup": () => (/* binding */ openGroup),
/* harmony export */   "wearOutfit": () => (/* binding */ wearOutfit)
/* harmony export */ });
/* harmony import */ var _i18n_translate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../i18n/translate */ "./src/i18n/translate.ts");
/* harmony import */ var _outfit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../outfit */ "./src/outfit.ts");


function exportPreview() {
    (0,_outfit__WEBPACK_IMPORTED_MODULE_1__.exportOutfit)("#appearance-preview");
}
function importOutfit() {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "application/json");
    input.click();
    input.addEventListener("input", event => {
        if (!event.target)
            return;
        const files = event.target.files;
        if (!files)
            return;
        const file = files[0];
        if (!file)
            return;
        void file.text().then(async (value) => {
            if (!value)
                return;
            const outfit = JSON.parse(value);
            const avatar = Sacha.Avatar.avatars["#appearance-preview"];
            if (!avatar)
                return;
            await wearOutfit(avatar, outfit);
        });
    });
}
function removeClothes() {
    const avatar = Sacha.Avatar.avatars["#appearance-preview"];
    if (!avatar)
        return;
    for (let i = avatar.children.length - 1; i >= 0; i--) {
        const itemRender = avatar.children[i];
        if (!itemRender)
            continue;
        const item = itemRender.getItem();
        if (Sacha.Avatar.removeItemFromAllAvatars(item)) {
            $(`#appearance-item-${item._id}`).removeClass("selected");
        }
    }
}
async function openGroup(group) {
    return new Promise((resolve) => {
        const groupContainer = document.querySelector(`#appearance-items-group-${group}`);
        if (groupContainer)
            return resolve(groupContainer);
        const avatar = Sacha.Avatar.avatars["#appearance-preview"];
        if (!avatar)
            return resolve(null);
        void $.get(`/player/openGroup/${group}`, { wornItems: avatar.getItemsToSave() }, (view) => {
            $(view).hide().appendTo("#appearance-items");
            resolve(document.querySelector(`#appearance-items-group-${group}`));
        });
    });
}
async function openCategory(category) {
    return new Promise((resolve) => {
        const categoryContainer = document.querySelector(`#appearance-items-category-${category}`);
        if (categoryContainer)
            return resolve(categoryContainer);
        void $.post(`/player/openCategory/${category}`, (view) => {
            $(view).hide().appendTo("#appearance-items");
            resolve(document.querySelector(`#appearance-items-category-${category}`));
        });
    });
}
async function wearOutfit(avatar, outfit) {
    $.flavrNotif(_i18n_translate__WEBPACK_IMPORTED_MODULE_0__.translate.appearance.favourites.importing);
    // Get all categories
    const categories = new Set();
    for (const clothing of outfit)
        if (!availableItems[clothing.id])
            categories.add(clothing.type);
    // Open all categories
    await Promise.all(Array.from(categories.values()).map(async (category) => openCategory(category)));
    // Get all groups
    const groups = new Set();
    for (const clothing of outfit)
        if (document.querySelector(`[data-group="${clothing.group}"]`) &&
            !availableItems[clothing.id])
            groups.add(clothing.group);
    // Open all groups
    await Promise.all(Array.from(groups.values()).map(async (group) => openGroup(group)));
    // Get the items from `availableItems`
    const wornItems = [];
    for (const clothing of outfit) {
        const item = availableItems[clothing.id];
        if (item)
            wornItems.push(item);
    }
    removeClothes();
    avatar.addItems(wornItems);
    initializeSelectedItems();
    initializeHiddenCategories();
    const avatarActions = document.getElementById("avatar-actions");
    if (avatarActions)
        avatarActions.style.display = "initial";
    $.flavrNotif(_i18n_translate__WEBPACK_IMPORTED_MODULE_0__.translate.appearance.favourites.imported);
}


/***/ }),

/***/ "./src/appearance/hidden.ts":
/*!**********************************!*\
  !*** ./src/appearance/hidden.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "loadHiddenCategory": () => (/* binding */ loadHiddenCategory),
/* harmony export */   "loadHiddenGroup": () => (/* binding */ loadHiddenGroup),
/* harmony export */   "unloadHiddenCategories": () => (/* binding */ unloadHiddenCategories)
/* harmony export */ });
/* harmony import */ var _wardrobe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./wardrobe */ "./src/appearance/wardrobe.ts");

function unloadHiddenCategories() {
    const hidden = document.querySelectorAll("#appearance-items .appearance-items-category:not(.active):not([data-categoryname]), #appearance-items script, body>script");
    for (const div of hidden) {
        div.remove();
    }
}
/**
 * Place the saved groups on the DOM as if it was Eldarya doing it.
 * @returns the associated `AppearanceCategory` if it's found in the wardrobe.
 */
function loadHiddenCategory(code) {
    const category = _wardrobe__WEBPACK_IMPORTED_MODULE_0__["default"].getCategories().find(c => c.category === code);
    if (!category)
        return null;
    const groups = _wardrobe__WEBPACK_IMPORTED_MODULE_0__["default"].getCategoryGroups(category.categoryid);
    const itemTemplate = __webpack_require__(/*! ../templates/html/appearance_item.html */ "./src/templates/html/appearance_item.html");
    const groupTemplate = __webpack_require__(/*! ../templates/html/appearance_items_group.html */ "./src/templates/html/appearance_items_group.html");
    document
        .querySelector("#appearance-items")
        ?.insertAdjacentHTML("beforeend", groups
        .map(group => groupTemplate.render({
        ...group,
        items: _wardrobe__WEBPACK_IMPORTED_MODULE_0__["default"].getItems(group.group)
            .map(item => itemTemplate.render(item))
            .join("\n"),
    }))
        .join("\n"));
    return category;
}
/**
 * Load the saved group on the DOM as if it was Eldarya doing it.
 * @returns the associated `AppearanceGroup` if it's found in the wardrobe.
 */
function loadHiddenGroup(id) {
    const group = _wardrobe__WEBPACK_IMPORTED_MODULE_0__["default"].getGroup(id);
    if (!group)
        return null;
    const itemTemplate = __webpack_require__(/*! ../templates/html/appearance_item.html */ "./src/templates/html/appearance_item.html");
    const groupTemplate = __webpack_require__(/*! ../templates/html/appearance_items_group.html */ "./src/templates/html/appearance_items_group.html");
    document
        .querySelector("#appearance-items")
        ?.insertAdjacentHTML("beforeend", groupTemplate.render({
        ...group,
        items: _wardrobe__WEBPACK_IMPORTED_MODULE_0__["default"].getItems(group.group)
            .map(item => itemTemplate.render(item))
            .join("\n"),
    }));
    return group;
}


/***/ }),

/***/ "./src/appearance/wardrobe.ts":
/*!************************************!*\
  !*** ./src/appearance/wardrobe.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Wardrobe {
    categories = {};
    groups = {};
    items = {};
    availableItems;
    getCategories() {
        return Object.values(this.categories);
    }
    getCategory(id) {
        return this.categories[id];
    }
    getCategoryGroups(categoryid) {
        return Object.values(this.groups).filter(group => group.categoryid === categoryid);
    }
    getGroup(id) {
        return this.groups[id];
    }
    getGroups() {
        return Object.values(this.groups);
    }
    getItem(id) {
        return this.items[id];
    }
    getItems(group) {
        return Object.values(this.items).filter(item => item.group === group);
    }
    setCategory(category) {
        this.categories[category.categoryid] = category;
    }
    setGroup(group) {
        this.groups[group.group] = group;
    }
    setItem(item) {
        this.items[item.itemid] = item;
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new Wardrobe());


/***/ }),

/***/ "./src/carousel/carousel_beemoov_annoyances.ts":
/*!*****************************************************!*\
  !*** ./src/carousel/carousel_beemoov_annoyances.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "carouselBeemoovAnnoyances": () => (/* binding */ carouselBeemoovAnnoyances)
/* harmony export */ });
/* harmony import */ var _i18n_translate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../i18n/translate */ "./src/i18n/translate.ts");

const carouselBeemoovAnnoyances = {
    backgroundImage: "https://gitlab.com/NatoBoram/eldarya-enhancements/-/raw/master/images/carousel_beemoov_annoyances.png",
    h4: _i18n_translate__WEBPACK_IMPORTED_MODULE_0__.translate.carousel.beemoov_annoyances.title,
    href: "https://gitlab.com/NatoBoram/Beemoov-Annoyances",
    id: "carousel-beemoov-annoyances",
    p: _i18n_translate__WEBPACK_IMPORTED_MODULE_0__.translate.carousel.beemoov_annoyances.subtitle,
};


/***/ }),

/***/ "./src/carousel/carousel_download_face.ts":
/*!************************************************!*\
  !*** ./src/carousel/carousel_download_face.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "carouselDownloadFace": () => (/* binding */ carouselDownloadFace)
/* harmony export */ });
/* harmony import */ var _i18n_translate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../i18n/translate */ "./src/i18n/translate.ts");

const carouselDownloadFace = {
    backgroundImage: "https://gitlab.com/NatoBoram/eldarya-enhancements/-/raw/master/images/carousel_download_face.png",
    id: "carousel-download-face",
    h4: _i18n_translate__WEBPACK_IMPORTED_MODULE_0__.translate.carousel.download_face.title,
    p: _i18n_translate__WEBPACK_IMPORTED_MODULE_0__.translate.carousel.download_face.subtitle,
};


/***/ }),

/***/ "./src/carousel/carousel_download_guardian.ts":
/*!****************************************************!*\
  !*** ./src/carousel/carousel_download_guardian.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "carouselDownloadGuardian": () => (/* binding */ carouselDownloadGuardian)
/* harmony export */ });
/* harmony import */ var _i18n_translate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../i18n/translate */ "./src/i18n/translate.ts");

const carouselDownloadGuardian = {
    backgroundImage: "https://gitlab.com/NatoBoram/eldarya-enhancements/-/raw/master/images/carousel_download_guardian.png",
    id: "carousel-download-guardian",
    h4: _i18n_translate__WEBPACK_IMPORTED_MODULE_0__.translate.carousel.download_guardian.title,
    p: _i18n_translate__WEBPACK_IMPORTED_MODULE_0__.translate.carousel.download_guardian.subtitle,
};


/***/ }),

/***/ "./src/carousel/carousel_eldarya_enhancements.ts":
/*!*******************************************************!*\
  !*** ./src/carousel/carousel_eldarya_enhancements.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "carouselEE": () => (/* binding */ carouselEE)
/* harmony export */ });
/* harmony import */ var _i18n_translate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../i18n/translate */ "./src/i18n/translate.ts");

const carouselEE = {
    backgroundImage: "https://gitlab.com/NatoBoram/eldarya-enhancements/-/raw/master/images/carousel_eldarya_enhancements.png",
    h4: _i18n_translate__WEBPACK_IMPORTED_MODULE_0__.translate.carousel.eldarya_enhancements.title,
    href: GM.info.script.namespace,
    id: "carousel-eldarya-enhancements",
    p: _i18n_translate__WEBPACK_IMPORTED_MODULE_0__.translate.carousel.eldarya_enhancements.subtitle,
};


/***/ }),

/***/ "./src/carousel/carousel_takeover.ts":
/*!*******************************************!*\
  !*** ./src/carousel/carousel_takeover.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "carouselTakeover": () => (/* binding */ carouselTakeover)
/* harmony export */ });
/* harmony import */ var _i18n_translate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../i18n/translate */ "./src/i18n/translate.ts");

const carouselTakeover = {
    backgroundImage: "https://gitlab.com/NatoBoram/eldarya-enhancements/-/raw/master/images/carousel_takeover.png",
    id: "carousel-takeover",
    h4: _i18n_translate__WEBPACK_IMPORTED_MODULE_0__.translate.carousel.takeover.title,
    p: _i18n_translate__WEBPACK_IMPORTED_MODULE_0__.translate.carousel.takeover.subtitle,
};


/***/ }),

/***/ "./src/cheat_codes.ts":
/*!****************************!*\
  !*** ./src/cheat_codes.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "loadCheatCodes": () => (/* binding */ loadCheatCodes)
/* harmony export */ });
/* harmony import */ var _console__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./console */ "./src/console.ts");
/* harmony import */ var _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./local_storage/local_storage */ "./src/local_storage/local_storage.ts");
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */


function loadCheatCodes() {
    // const cheated = window as unknown as CheatedWindow
    ;
    window.unlockEnhancements = unlockEnhancements;
    window.lockEnhancements = lockEnhancements;
}
async function unlockEnhancements() {
    _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_1__.LocalStorage.unlocked = true;
    _console__WEBPACK_IMPORTED_MODULE_0__.Console.info("Unlocked enhancements.");
    await reload();
}
async function lockEnhancements() {
    _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_1__.LocalStorage.unlocked = false;
    _console__WEBPACK_IMPORTED_MODULE_0__.Console.info("Locked enhancements.");
    await reload();
}
async function reload() {
    await new Promise(resolve => setTimeout(resolve, 1000));
    _console__WEBPACK_IMPORTED_MODULE_0__.Console.log("Reloading...");
    await new Promise(resolve => setTimeout(resolve, 1000));
    location.reload();
}


/***/ }),

/***/ "./src/console.ts":
/*!************************!*\
  !*** ./src/console.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Console": () => (/* binding */ Console)
/* harmony export */ });
/* harmony import */ var _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./local_storage/local_storage */ "./src/local_storage/local_storage.ts");

class Console {
    static console = console;
    constructor() { }
    static get debugging() {
        return _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_0__.LocalStorage.debug;
    }
    static get time() {
        return new Date().toLocaleTimeString();
    }
    static assert(value, message, ...optionalParams) {
        if (!this.debugging)
            return;
        this.console.assert(value, ...this.format(message), ...optionalParams);
    }
    static debug(message, ...optionalParams) {
        if (!this.debugging)
            return;
        this.console.debug(...this.format(message), ...optionalParams);
    }
    static error(message, ...optionalParams) {
        this.console.error(...this.format(message), ...optionalParams);
    }
    static info(message, ...optionalParams) {
        if (!this.debugging)
            return;
        this.console.info(...this.format(message), ...optionalParams);
    }
    static log(message, ...optionalParams) {
        if (!this.debugging)
            return;
        this.console.log(...this.format(message), ...optionalParams);
    }
    static warn(message, ...optionalParams) {
        this.console.warn(...this.format(message), ...optionalParams);
    }
    static format(message) {
        return [
            `%c[%c${this.time}%c]`,
            "color:#9742c2",
            "color:none",
            "color:#9742c2",
            message,
        ];
    }
}


/***/ }),

/***/ "./src/download-canvas.ts":
/*!********************************!*\
  !*** ./src/download-canvas.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "downloadAppearance": () => (/* binding */ downloadAppearance),
/* harmony export */   "downloadFace": () => (/* binding */ downloadFace),
/* harmony export */   "downloadGuardian": () => (/* binding */ downloadGuardian),
/* harmony export */   "downloadProfile": () => (/* binding */ downloadProfile),
/* harmony export */   "getName": () => (/* binding */ getName)
/* harmony export */ });
/* harmony import */ var _console__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./console */ "./src/console.ts");
/* harmony import */ var _i18n_translate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./i18n/translate */ "./src/i18n/translate.ts");


function downloadCanvas(canvas, name) {
    canvas.toBlob(blob => {
        if (!blob) {
            _console__WEBPACK_IMPORTED_MODULE_0__.Console.error("Canvas is empty");
            $.flavrNotif(_i18n_translate__WEBPACK_IMPORTED_MODULE_1__.translate.error.downloadCanvas);
            return;
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.setAttribute("href", url);
        a.setAttribute("download", `${name}.png`);
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, "image/png", 1);
}
function downloadFace() {
    const canvas = document.querySelector("#avatar-menu-container canvas");
    if (!canvas) {
        _console__WEBPACK_IMPORTED_MODULE_0__.Console.warn("Couldn't find the guardian's face.");
        return;
    }
    downloadCanvas(canvas, "face");
}
function downloadGuardian() {
    const canvas = document.querySelector("#home-avatar-player canvas");
    if (!canvas) {
        _console__WEBPACK_IMPORTED_MODULE_0__.Console.warn("Couldn't find the guardian.");
        return;
    }
    downloadCanvas(canvas, getName() ?? "guardian");
}
function downloadAppearance() {
    const canvas = document.querySelector("#appearance-preview canvas");
    if (!canvas) {
        _console__WEBPACK_IMPORTED_MODULE_0__.Console.warn("Couldn't find the guardian.");
        return;
    }
    downloadCanvas(canvas, getName() ?? "guardian");
}
function downloadProfile() {
    const canvas = document.querySelector(".playerProfileAvatar canvas");
    const title = document.querySelector("#main-section .section-title");
    if (!canvas || !title)
        return;
    downloadCanvas(canvas, title.textContent?.trim() ?? "guardian");
}
function getName() {
    return (document.querySelector("#avatar-menu-container-outer>p")?.textContent ??
        null);
}


/***/ }),

/***/ "./src/duration.ts":
/*!*************************!*\
  !*** ./src/duration.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Duration": () => (/* binding */ Duration),
/* harmony export */   "DurationUnit": () => (/* binding */ DurationUnit)
/* harmony export */ });
var DurationUnit;
(function (DurationUnit) {
    DurationUnit[DurationUnit["millisecond"] = 1] = "millisecond";
    DurationUnit[DurationUnit["second"] = 1000] = "second";
    DurationUnit[DurationUnit["minute"] = 60000] = "minute";
    DurationUnit[DurationUnit["hour"] = 3600000] = "hour";
    DurationUnit[DurationUnit["day"] = 86400000] = "day";
    DurationUnit[DurationUnit["week"] = 604800000] = "week";
    DurationUnit[DurationUnit["year"] = 31556952000] = "year";
    DurationUnit[DurationUnit["decade"] = 315569520000] = "decade";
    DurationUnit[DurationUnit["century"] = 3155695200000] = "century";
    DurationUnit[DurationUnit["millennium"] = 31556952000000] = "millennium";
    // Geologic time scale
    DurationUnit[DurationUnit["age"] = 315569520000000] = "age";
    DurationUnit[DurationUnit["subepoch"] = 3155695200000000] = "subepoch";
    DurationUnit[DurationUnit["epoch"] = 31556952000000000] = "epoch";
    DurationUnit[DurationUnit["period"] = 315569520000000000] = "period";
    DurationUnit[DurationUnit["era"] = 3155695200000000000] = "era";
    DurationUnit[DurationUnit["eon"] = 31556952000000000000] = "eon";
    // Non sequitur
    DurationUnit[DurationUnit["month"] = 2629746000] = "month";
})(DurationUnit || (DurationUnit = {}));
class Duration {
    value;
    unit;
    constructor(value, unit) {
        this.value = value;
        this.unit = unit;
    }
    divide(duration) {
        return new Duration(this.value / duration.to(this.unit).value, this.unit);
    }
    minus(duration) {
        return new Duration(this.value - duration.to(this.unit).value, this.unit);
    }
    multiply(duration) {
        return new Duration(this.value * duration.to(this.unit).value, this.unit);
    }
    plus(duration) {
        return new Duration(this.value + duration.to(this.unit).value, this.unit);
    }
    to(unit) {
        return new Duration((this.value * this.unit) / unit, unit);
    }
}


/***/ }),

/***/ "./src/eldarya/jquery.ts":
/*!*******************************!*\
  !*** ./src/eldarya/jquery.ts ***!
  \*******************************/
/***/ (() => {

"use strict";



/***/ }),

/***/ "./src/eldarya_util.ts":
/*!*****************************!*\
  !*** ./src/eldarya_util.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "trimIcon": () => (/* binding */ trimIcon)
/* harmony export */ });
function trimIcon(icon) {
    const tilde = icon.lastIndexOf("~");
    const dot = icon.lastIndexOf(".");
    if (tilde === -1 || dot === -1)
        return icon;
    return icon.substring(0, tilde) + icon.substring(dot);
}


/***/ }),

/***/ "./src/i18n/en.ts":
/*!************************!*\
  !*** ./src/i18n/en.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "en": () => (/* binding */ en)
/* harmony export */ });
const en = {
    home: {
        forum: "Forum",
        takeover: "Takeover",
    },
    takeover: {
        bought: (name, price) => `Bought <strong>${name}</strong> for <strong class="price-item">${price}</strong> <span class="maana-icon" alt="maanas"></span>.`,
        disabled: "Takeover mode disabled.",
        enabled: "Takeover mode enabled. Please do not interact with this tab.",
    },
    carousel: {
        beemoov_annoyances: {
            title: "Beemoov Annoyances",
            subtitle: "Block some of Eldarya's annoyances.",
        },
        download_face: {
            title: "Download your guardian's face!",
            subtitle: "Click here to download your guardian's face.",
        },
        download_guardian: {
            title: "Download your guardian!",
            subtitle: "Click here to download your guardian.",
        },
        eldarya_enhancements: {
            title: `${GM.info.script.name} v${GM.info.script.version}`,
            subtitle: GM.info.script.description,
        },
        takeover: {
            disable_takeover: "Disable Takeover",
            enable_takeover: "Enable Takeover",
            subtitle: "Give up this tab to perform automated actions.",
            title: "Takeover",
        },
    },
    minigames: {
        played_for: (name, maanas) => `Played <strong>${name}</strong> for <strong class="price-item">${maanas}</strong> <span class="maana-icon" alt="maanas"></span> earned.`,
        played: name => `Played <strong>${name}</strong>.`,
        playing: name => `Playing <strong>${name}</strong>...`,
    },
    appearance: {
        buttons: {
            backward: "Move back",
            forward: "Bring forward",
        },
        favourites: {
            buttons: {
                download: "Download PNG",
                export: "Export",
                import: "Import",
            },
            click_outfit: {
                delete: "Delete",
                goto_account: `To transfer your <strong>${GM.info.script.name}</strong> favourite outfits to another browser, export your settings in the <a href="/user/account" style="text-decoration: underline;">my&nbsp;account</a> page.`,
                saved_locally: `Take note that this outfit is saved in <strong>${GM.info.script.name}</strong>' settings and was not sent to Eldarya's servers.`,
                wear: "Wear",
            },
            imported: "Imported outfit!",
            importing: "Importing outfit. Please wait...",
            rename_outfit: {
                title: (name) => `Rename <strong>${name}</strong>`,
                button: "Rename",
            },
            save_outfit: {
                goto_account: `To transfer your <strong>${GM.info.script.name}</strong> favourite outfits to another browser, export your settings in the <a href="/user/account" style="text-decoration: underline;">my&nbsp;account</a> page.`,
                placeholder: "Name...",
                save: "Save",
                saved_locally: `Take note that this outfit will only be saved within <strong>${GM.info.script.name}</strong>' settings and will not be sent to Eldarya's servers.`,
                title: "Save outfit",
            },
        },
        loaded: "The wardrobe is loaded.",
        loading: (categoryname) => `Loading <strong>${categoryname}</strong>...`,
    },
    market: {
        add_to_wishlist: {
            added_to_wishlist: (name, price) => `Added <strong>${name}</strong> for <strong class="price-item">${price}</strong> <span class="maana-icon" alt="maanas"></span> to the wishlist.`,
            invalid_price: "This is not a valid price.",
            save: "Save",
            text: "How many maanas do you wish to offer to acquire this item?",
            title: "Add to wishlist",
        },
        auctions: {
            buy_now_price: "Buy now price :",
            current_price: "Current price :",
            delete: "Delete",
            purchase_history: "Purchase history",
            sales_history: "Sales history",
            date_time_format: new Intl.DateTimeFormat("en-GB", {
                minute: "2-digit",
                hour: "2-digit",
                day: "numeric",
                month: "long",
                year: "numeric",
            }),
        },
        change_price: {
            changed_price: (name, price) => `Changed <strong>${name}</strong>'s price for <strong class="price-item">${price}</strong> <span class="maana-icon" alt="maanas"></span>.`,
            invalid_price: "This is not a valid price.",
            save: "Save",
            text: "How many maanas do you wish to offer to acquire this item?",
            title: "Change price",
        },
        wishlist: {
            actions: "Actions",
            assistance: `On this page, you can organize your wishlist and check the status of your wished items. Please note that your wishlist is saved locally in <strong>${GM.info.script.name}</strong>' settings and is not sent to Eldarya's servers. To transfer your wishlist to another browser, export your settings in the <a href="/user/account" style="text-decoration: underline;">my&nbsp;account</a> page.`,
            change_price: "Change price",
            delete_tooltip: "Remove from wishlist",
            delete: "Delete",
            icon: "Icon",
            name: "Name",
            price: "Price",
            reset_all: "Reset all statuses",
            reset_tooltip: "Reset the error status",
            reset: "Reset",
            status: "Status",
            title: "Wishlist",
        },
    },
    account: {
        cancel: "Cancel",
        confirm_reset_content: `Are you sure you want to reset your <strong>${GM.info.script.name}</strong> settings? Your free saved favorite outfits, wishlist, exploration and market history, and marked exploration points will be erased. You will also need to re-enable all the desired settings.`,
        confirm_reset_title: "Erase settings",
        confirm: "Reset",
        debug_tooltip: "Enables or disables logging.",
        debug: "Debug",
        delete_explorations: "Delete all exploration points",
        enhancements: "Enhancements",
        explorations_deleted: "Your marked exploration points were deleted.",
        explorations: "Explorations",
        export: "Export settings",
        import: "Import settings",
        imported: "Imported settings!",
        market: "Market",
        minigames: "Minigames",
        reset: "Reset",
    },
    pet: {
        auto_explore: "Highlight",
        date_time_format: new Intl.DateTimeFormat("en-GB", {
            minute: "2-digit",
            hour: "2-digit",
            day: "numeric",
            month: "long",
            year: "numeric",
        }),
        delete_history: "Delete history",
        deleting_markers: "Deleting markers...",
        empty_history: "Your exploration history is empty. It will automatically fill up as your familiar finds items while exploring.",
        goto_account: `To transfer your exploration history to another browser, export your settings from the <em>my&nbsp;account</em> page.`,
        history: "History",
        mark_all: "Mark this region",
        saved_locally: `Please note that your exploration history is saved locally in <strong>${GM.info.script.name}</strong>' settings and was not sent to Eldarya's servers.`,
        unmark_all: "Unmark this region",
    },
    profile: {
        export_outfit: "Export outfit",
        download_outfit: "Download PNG",
    },
    error: {
        downloadCanvas: "There was an error while creating the image.",
        longLoading: "Eldarya is taking too long to load. Retrying in 10 seconds...",
    },
    mall: {
        add_to_wishlist: {
            title: "Add to market wishlist",
            text: "How many maanas do you wish to offer to acquire this item?",
            note: "Please note that the items added from the mall will not necessarily be available at the market.",
        },
    },
};
Object.freeze(en);


/***/ }),

/***/ "./src/i18n/fr.ts":
/*!************************!*\
  !*** ./src/i18n/fr.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fr": () => (/* binding */ fr)
/* harmony export */ });
const fr = {
    home: {
        forum: "Forum",
        takeover: "Takeover",
    },
    takeover: {
        bought: (name, price) => `Acheté <strong>${name}</strong> pour <strong class="price-item">${price}</strong> <span class="maana-icon" alt="maanas"></span>.`,
        disabled: "Takeover désactivé.",
        enabled: "Takeover activé. Évite d'intéragir avec cet onglet.",
    },
    carousel: {
        beemoov_annoyances: {
            title: "Beemoov Annoyances",
            subtitle: "Bloque certains irritants d'Eldarya.",
        },
        download_face: {
            title: "Télécharge le visage de ta gardienne!",
            subtitle: "Clique ici pour télécharger le visage de ta gardienne.",
        },
        download_guardian: {
            title: "Télécharge ta gardienne!",
            subtitle: "Clique ici pour télécharger ta gardienne.",
        },
        eldarya_enhancements: {
            title: `${GM.info.script.name} v${GM.info.script.version}`,
            subtitle: "Améliore l'expérience utilisateur d'Eldarya.",
        },
        takeover: {
            disable_takeover: "Désactive le takeover",
            enable_takeover: "Active le takeover",
            subtitle: "Laisse cet onglet performer des actions automatiques.",
            title: "Takeover",
        },
    },
    minigames: {
        played_for: (name, maanas) => `A joué à <strong>${name}</strong> pour <strong class="price-item">${maanas}</strong> <span class="maana-icon" alt="maanas"></span> gagnés.`,
        played: (name) => `A joué à <strong>${name}</strong>.`,
        playing: (name) => `Joue à <strong>${name}</strong>...`,
    },
    appearance: {
        buttons: {
            backward: "Vers l'arrière",
            forward: "Vers l'avant",
        },
        favourites: {
            buttons: {
                download: "Télécharger le PNG",
                export: "Exporter",
                import: "Importer",
            },
            click_outfit: {
                delete: "Supprimer",
                goto_account: `Pour transférer tes tenues favorites d'<strong>${GM.info.script.name}</strong> vers un autre navigateur, exporte tes paramètres à partir de la page <a href="/user/account" style="text-decoration: underline;">mon&nbsp;compte</a>.`,
                saved_locally: `Prends note que cette tenue est sauvegardée localement dans les paramètres d'<strong>${GM.info.script.name}</strong> et n'a pas été envoyée aux serveurs d'Eldarya.`,
                wear: "Porter",
            },
            imported: "Importation réussie!",
            importing: "Importation en cours...",
            rename_outfit: {
                button: "Renommer",
                title: (name) => `Renommer <strong>${name}</strong>`,
            },
            save_outfit: {
                goto_account: `Pour transférer tes tenues favorites d'<strong>${GM.info.script.name}</strong> vers un autre navigateur, exporte tes paramètres à partir de la page <a href="/user/account" style="text-decoration: underline;">mon&nbsp;compte</a>.`,
                placeholder: "Nom...",
                save: "Sauvegarder",
                saved_locally: `Prends note que cette tenue sera sauvegardée localement dans les paramètres d'<strong>${GM.info.script.name}</strong> et ne sera pas envoyée aux serveurs d'Eldarya.`,
                title: "Sauvegarder cette tenue",
            },
        },
        loaded: "Le chargement de la garde-robe est terminé.",
        loading: (categoryname) => `Chargement de <strong>${categoryname}</strong>...`,
    },
    market: {
        add_to_wishlist: {
            added_to_wishlist: (name, price) => `Ajouté <strong>${name}</strong> pour <strong class="price-item">${price}</strong> <span class="maana-icon" alt="maanas"></span> à la liste de souhaits.`,
            invalid_price: "Ce prix n'est pas valide.",
            save: "Sauvegarder",
            text: "Combien de maanas souhaites-tu offrir pour acquérir cet item?",
            title: "Ajouter à la liste de souhait",
        },
        auctions: {
            buy_now_price: "Achat immédiat :",
            current_price: "Mise actuelle :",
            delete: "Supprimer",
            purchase_history: "Historique d'achat",
            sales_history: "Historique de vente",
            date_time_format: new Intl.DateTimeFormat("fr-CA", {
                minute: "2-digit",
                hour: "2-digit",
                day: "numeric",
                month: "long",
                year: "numeric",
            }),
        },
        change_price: {
            changed_price: (name, price) => `Changé le prix de <strong>${name}</strong> pour <strong class="price-item">${price}</strong> <span class="maana-icon" alt="maanas"></span>.`,
            invalid_price: "Ce prix n'est pas valide.",
            save: "Sauvegarder",
            text: "Combien de maanas souhaites-tu offrir pour acquérir cet item?",
            title: "Changer le prix",
        },
        wishlist: {
            actions: "Actions",
            assistance: `Sur cette page, tu peux organiser ta liste de souhaits et vérifier le statut de tes articles souhaités. Prends note que ta liste de souhaits est sauvegardée localement dans les paramètres d'<strong>${GM.info.script.name}</strong> et n'est pas envoyée aux serveurs d'Eldarya. Pour transférer ta liste de souhaits vers un autre navigateur, exporte-la à partir de la page <a href="/user/account" style="text-decoration: underline;">mon&nbsp;compte</a>.`,
            change_price: "Changer le prix",
            delete_tooltip: "Retirer de la liste de souhaits",
            delete: "Supprimer",
            icon: "Icône",
            name: "Nom",
            price: "Prix",
            reset_all: "Réinitialiser tout les statuts",
            reset_tooltip: "Réinitialiser l'état d'erreur",
            reset: "Réinitialiser",
            status: "Statut",
            title: "Liste de souhaits",
        },
    },
    account: {
        cancel: "Annuler",
        confirm_reset_content: `Veux-tu vraiment réinitialiser tes paramètres d'<strong>${GM.info.script.name}</strong>? Tes tenues favorites enregistrées gratuitement, ta liste de souhait, ton historique d'exploration et du marché ainsi que tes points d'explorations marqués seront effacés. Tu devras également réactiver tous les paramètres désirés.`,
        confirm_reset_title: "Supprimer les paramètres",
        confirm: "Réinitialiser",
        debug_tooltip: "Active ou désactive la journalisation.",
        debug: "Débogage",
        delete_explorations: "Supprimer tous les points d'exploration",
        enhancements: "Améliorations",
        explorations_deleted: "Tes points d'exploration marqués ont été supprimés.",
        explorations: "Explorations",
        export: "Exporter les paramètres",
        import: "Importer les paramètres",
        imported: "Paramètres importés",
        market: "Marché",
        minigames: "Mini-jeux",
        reset: "Réinitialiser",
    },
    pet: {
        auto_explore: "Marquer",
        date_time_format: new Intl.DateTimeFormat("fr-CA", {
            minute: "2-digit",
            hour: "2-digit",
            day: "numeric",
            month: "long",
            year: "numeric",
        }),
        delete_history: "Nettoyer l'historique",
        deleting_markers: "Suppression des marqueurs...",
        empty_history: "Ton historique d'exploration est vide. Il se remplira automatiquement à mesure que ton familier trouvera des items en exploration.",
        goto_account: "Pour transférer ton historique d'explorations vers un autre navigateur, exporte tes paramètres à partir de la page <em>mon compte</em>.",
        history: "Historique",
        mark_all: "Marquer cette carte",
        saved_locally: `Prends note que ton historique d'explorations est sauvegardé localement dans les paramètres d'<strong>${GM.info.script.name}</strong> et n'a pas été envoyé aux serveurs d'Eldarya.`,
        unmark_all: "Dé-marquer cette carte",
    },
    profile: {
        export_outfit: "Exporter la tenue",
        download_outfit: "Télécharger le PNG",
    },
    error: {
        downloadCanvas: "Une erreur est survenue lors du téléchargement de l'image.",
        longLoading: "Eldarya prend trop de temps à charger. Nouvelle tentative dans 10 secondes...",
    },
    mall: {
        add_to_wishlist: {
            title: "Ajouter à la liste de souhait du marché",
            text: "Combien de maanas souhaites-tu offrir pour acquérir cet item?",
            note: "Prends note que les items ajoutés à partir de la boutique ne seront pas nécessairement disponibles au marché.",
        },
    },
};
Object.freeze(fr);


/***/ }),

/***/ "./src/i18n/translate.ts":
/*!*******************************!*\
  !*** ./src/i18n/translate.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "translate": () => (/* binding */ translate)
/* harmony export */ });
/* harmony import */ var _en__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./en */ "./src/i18n/en.ts");
/* harmony import */ var _fr__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./fr */ "./src/i18n/fr.ts");


function translation() {
    if (location.hostname.endsWith(".com.br"))
        return _en__WEBPACK_IMPORTED_MODULE_0__.en;
    if (location.hostname.endsWith(".de"))
        return _en__WEBPACK_IMPORTED_MODULE_0__.en;
    if (location.hostname.endsWith(".es"))
        return _en__WEBPACK_IMPORTED_MODULE_0__.en;
    if (location.hostname.endsWith(".hu"))
        return _en__WEBPACK_IMPORTED_MODULE_0__.en;
    if (location.hostname.endsWith(".it"))
        return _en__WEBPACK_IMPORTED_MODULE_0__.en;
    if (location.hostname.endsWith(".pl"))
        return _en__WEBPACK_IMPORTED_MODULE_0__.en;
    if (location.hostname.endsWith(".ru"))
        return _en__WEBPACK_IMPORTED_MODULE_0__.en;
    if (location.hostname.endsWith(".com"))
        return _en__WEBPACK_IMPORTED_MODULE_0__.en;
    if (location.hostname.endsWith(".fr"))
        return _fr__WEBPACK_IMPORTED_MODULE_1__.fr;
    else
        return _en__WEBPACK_IMPORTED_MODULE_0__.en;
}
const translate = translation();


/***/ }),

/***/ "./src/indexed_db/databases.enum.ts":
/*!******************************************!*\
  !*** ./src/indexed_db/databases.enum.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Databases": () => (/* binding */ Databases)
/* harmony export */ });
var Databases;
(function (Databases) {
    Databases["eldarya_enhancements"] = "eldarya_enhancements";
})(Databases || (Databases = {}));


/***/ }),

/***/ "./src/indexed_db/fields.enum.ts":
/*!***************************************!*\
  !*** ./src/indexed_db/fields.enum.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Fields": () => (/* binding */ Fields)
/* harmony export */ });
var Fields;
(function (Fields) {
    Fields["blob"] = "blob";
    Fields["id"] = "id";
    Fields["items"] = "items";
    Fields["name"] = "name";
})(Fields || (Fields = {}));


/***/ }),

/***/ "./src/indexed_db/indexed_db.ts":
/*!**************************************!*\
  !*** ./src/indexed_db/indexed_db.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _console__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../console */ "./src/console.ts");
/* harmony import */ var _databases_enum__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./databases.enum */ "./src/indexed_db/databases.enum.ts");
/* harmony import */ var _fields_enum__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./fields.enum */ "./src/indexed_db/fields.enum.ts");
/* harmony import */ var _tables_enum__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./tables.enum */ "./src/indexed_db/tables.enum.ts");




class IndexedDB {
    db;
    version = 1;
    constructor() {
        const request = indexedDB.open(_databases_enum__WEBPACK_IMPORTED_MODULE_1__.Databases.eldarya_enhancements, this.version);
        request.onsuccess = () => (this.db = request.result);
        request.onupgradeneeded = function () {
            const db = this.result;
            const objectStore = db.createObjectStore(_tables_enum__WEBPACK_IMPORTED_MODULE_3__.Tables.favourite_outfits, {
                keyPath: "id",
                autoIncrement: true,
            });
            objectStore.createIndex(_fields_enum__WEBPACK_IMPORTED_MODULE_2__.Fields.blob, "blob", { unique: false });
            objectStore.createIndex(_fields_enum__WEBPACK_IMPORTED_MODULE_2__.Fields.items, "items", { unique: false });
            objectStore.createIndex(_fields_enum__WEBPACK_IMPORTED_MODULE_2__.Fields.name, "name", { unique: false });
        };
        request.onerror = () => _console__WEBPACK_IMPORTED_MODULE_0__.Console.error("Error when opening the indexedDB", request.error);
        request.onblocked = () => _console__WEBPACK_IMPORTED_MODULE_0__.Console.error("Blocked from opening the indexedDB", request.error);
    }
    /** @returns a new `FavouriteOutfit` with the `key` property set. */
    async addFavouriteOutfit(favourite) {
        return new Promise((resolve, reject) => {
            if (!this.db)
                return reject();
            const request = this.db
                .transaction([_tables_enum__WEBPACK_IMPORTED_MODULE_3__.Tables.favourite_outfits], "readwrite")
                .objectStore(_tables_enum__WEBPACK_IMPORTED_MODULE_3__.Tables.favourite_outfits)
                .add(favourite);
            request.onsuccess = () => {
                resolve({
                    ...favourite,
                    url: URL.createObjectURL(favourite.blob),
                    id: Number(request.result),
                });
            };
        });
    }
    async updateFavouriteOutfit(favourite) {
        return new Promise((resolve, reject) => {
            if (!this.db)
                return reject();
            const request = this.db
                .transaction([_tables_enum__WEBPACK_IMPORTED_MODULE_3__.Tables.favourite_outfits], "readwrite")
                .objectStore(_tables_enum__WEBPACK_IMPORTED_MODULE_3__.Tables.favourite_outfits)
                .put(favourite);
            request.onsuccess = () => {
                resolve({
                    ...favourite,
                    id: Number(request.result),
                });
            };
        });
    }
    async clearFavouriteOutfits() {
        return new Promise((resolve, reject) => {
            if (!this.db)
                return reject();
            const request = this.db
                .transaction([_tables_enum__WEBPACK_IMPORTED_MODULE_3__.Tables.favourite_outfits], "readwrite")
                .objectStore(_tables_enum__WEBPACK_IMPORTED_MODULE_3__.Tables.favourite_outfits)
                .clear();
            request.onsuccess = () => resolve();
        });
    }
    async deleteFavouriteOutfit(favourite) {
        return new Promise((resolve, reject) => {
            if (!this.db)
                return reject();
            const request = this.db
                .transaction([_tables_enum__WEBPACK_IMPORTED_MODULE_3__.Tables.favourite_outfits], "readwrite")
                .objectStore(_tables_enum__WEBPACK_IMPORTED_MODULE_3__.Tables.favourite_outfits)
                .delete(favourite.id);
            request.onsuccess = () => {
                resolve();
                if (favourite.url)
                    URL.revokeObjectURL(favourite.url);
            };
        });
    }
    async getFavouriteOutfit(id) {
        return new Promise((resolve, reject) => {
            if (!this.db)
                return reject();
            const request = this.db
                .transaction([_tables_enum__WEBPACK_IMPORTED_MODULE_3__.Tables.favourite_outfits], "readonly")
                .objectStore(_tables_enum__WEBPACK_IMPORTED_MODULE_3__.Tables.favourite_outfits)
                .get(id);
            const favourite = request.result;
            request.onsuccess = () => resolve({ ...favourite, url: URL.createObjectURL(favourite.blob) });
        });
    }
    async getFavouriteOutfits() {
        return new Promise((resolve, reject) => {
            if (!this.db)
                return reject("No database");
            const request = this.db
                .transaction([_tables_enum__WEBPACK_IMPORTED_MODULE_3__.Tables.favourite_outfits], "readonly")
                .objectStore(_tables_enum__WEBPACK_IMPORTED_MODULE_3__.Tables.favourite_outfits)
                .getAll();
            request.onsuccess = () => resolve(request.result.map((favourite) => ({
                ...favourite,
                url: URL.createObjectURL(favourite.blob),
            })));
        });
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new IndexedDB());


/***/ }),

/***/ "./src/indexed_db/tables.enum.ts":
/*!***************************************!*\
  !*** ./src/indexed_db/tables.enum.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Tables": () => (/* binding */ Tables)
/* harmony export */ });
var Tables;
(function (Tables) {
    Tables["favourite_outfits"] = "favourite_outfits";
})(Tables || (Tables = {}));


/***/ }),

/***/ "./src/local_storage/local_storage.enum.ts":
/*!*************************************************!*\
  !*** ./src/local_storage/local_storage.enum.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LocalStorageKey": () => (/* binding */ LocalStorageKey)
/* harmony export */ });
var LocalStorageKey;
(function (LocalStorageKey) {
    LocalStorageKey["autoExploreLocations"] = "autoExploreLocations";
    LocalStorageKey["debug"] = "debug";
    LocalStorageKey["explorationHistory"] = "explorationHistory";
    LocalStorageKey["explorations"] = "explorations";
    LocalStorageKey["market"] = "market";
    LocalStorageKey["meta"] = "meta";
    LocalStorageKey["minigames"] = "minigames";
    LocalStorageKey["purchases"] = "purchases";
    LocalStorageKey["sales"] = "sales";
    LocalStorageKey["unlocked"] = "unlocked";
    LocalStorageKey["version"] = "version";
    LocalStorageKey["wishlist"] = "wishlist";
})(LocalStorageKey || (LocalStorageKey = {}));


/***/ }),

/***/ "./src/local_storage/local_storage.ts":
/*!********************************************!*\
  !*** ./src/local_storage/local_storage.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LocalStorage": () => (/* binding */ LocalStorage)
/* harmony export */ });
/* harmony import */ var blob_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! blob-util */ "./node_modules/.pnpm/blob-util@2.0.2/node_modules/blob-util/dist/blob-util.es.js");
/* harmony import */ var _indexed_db_indexed_db__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../indexed_db/indexed_db */ "./src/indexed_db/indexed_db.ts");
/* harmony import */ var _local_storage_enum__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./local_storage.enum */ "./src/local_storage/local_storage.enum.ts");



class LocalStorage {
    static localStorage = localStorage;
    constructor() { }
    static get autoExploreLocations() {
        return this.getItem(_local_storage_enum__WEBPACK_IMPORTED_MODULE_2__.LocalStorageKey.autoExploreLocations, []);
    }
    static set autoExploreLocations(locations) {
        this.setItem(_local_storage_enum__WEBPACK_IMPORTED_MODULE_2__.LocalStorageKey.autoExploreLocations, locations);
    }
    static get debug() {
        return this.getItem(_local_storage_enum__WEBPACK_IMPORTED_MODULE_2__.LocalStorageKey.debug, false);
    }
    static set debug(enabled) {
        this.setItem(_local_storage_enum__WEBPACK_IMPORTED_MODULE_2__.LocalStorageKey.debug, enabled);
    }
    static get explorationHistory() {
        return this.getItem(_local_storage_enum__WEBPACK_IMPORTED_MODULE_2__.LocalStorageKey.explorationHistory, []);
    }
    static set explorationHistory(explorationHistory) {
        this.setItem(_local_storage_enum__WEBPACK_IMPORTED_MODULE_2__.LocalStorageKey.explorationHistory, explorationHistory);
    }
    static get explorations() {
        return this.getItem(_local_storage_enum__WEBPACK_IMPORTED_MODULE_2__.LocalStorageKey.explorations, false);
    }
    static set explorations(enabled) {
        this.setItem(_local_storage_enum__WEBPACK_IMPORTED_MODULE_2__.LocalStorageKey.explorations, enabled);
    }
    static get market() {
        return this.getItem(_local_storage_enum__WEBPACK_IMPORTED_MODULE_2__.LocalStorageKey.market, false);
    }
    static set market(enabled) {
        this.setItem(_local_storage_enum__WEBPACK_IMPORTED_MODULE_2__.LocalStorageKey.market, enabled);
    }
    static get meta() {
        return this.getItem(_local_storage_enum__WEBPACK_IMPORTED_MODULE_2__.LocalStorageKey.meta, null);
    }
    static set meta(meta) {
        this.setItem(_local_storage_enum__WEBPACK_IMPORTED_MODULE_2__.LocalStorageKey.meta, meta);
    }
    static get minigames() {
        return this.getItem(_local_storage_enum__WEBPACK_IMPORTED_MODULE_2__.LocalStorageKey.minigames, false);
    }
    static set minigames(enabled) {
        this.setItem(_local_storage_enum__WEBPACK_IMPORTED_MODULE_2__.LocalStorageKey.minigames, enabled);
    }
    static get purchases() {
        return this.getItem(_local_storage_enum__WEBPACK_IMPORTED_MODULE_2__.LocalStorageKey.purchases, []);
    }
    static set purchases(entry) {
        this.setItem(_local_storage_enum__WEBPACK_IMPORTED_MODULE_2__.LocalStorageKey.purchases, entry);
    }
    static get sales() {
        return this.getItem(_local_storage_enum__WEBPACK_IMPORTED_MODULE_2__.LocalStorageKey.sales, []);
    }
    static set sales(sale) {
        this.setItem(_local_storage_enum__WEBPACK_IMPORTED_MODULE_2__.LocalStorageKey.sales, sale);
    }
    static get unlocked() {
        return this.getItem(_local_storage_enum__WEBPACK_IMPORTED_MODULE_2__.LocalStorageKey.unlocked, false);
    }
    static set unlocked(unlocked) {
        this.setItem(_local_storage_enum__WEBPACK_IMPORTED_MODULE_2__.LocalStorageKey.unlocked, unlocked);
    }
    static get version() {
        return this.getItem(_local_storage_enum__WEBPACK_IMPORTED_MODULE_2__.LocalStorageKey.version, "");
    }
    static set version(version) {
        this.setItem(_local_storage_enum__WEBPACK_IMPORTED_MODULE_2__.LocalStorageKey.version, version);
    }
    static get wishlist() {
        return this.getItem(_local_storage_enum__WEBPACK_IMPORTED_MODULE_2__.LocalStorageKey.wishlist, []);
    }
    static set wishlist(locations) {
        this.setItem(_local_storage_enum__WEBPACK_IMPORTED_MODULE_2__.LocalStorageKey.wishlist, locations);
    }
    static async getSettings() {
        return {
            autoExploreLocations: this.autoExploreLocations,
            debug: this.debug,
            explorationHistory: this.explorationHistory,
            explorations: this.explorations,
            favourites: await Promise.all((await _indexed_db_indexed_db__WEBPACK_IMPORTED_MODULE_1__["default"].getFavouriteOutfits()).map(async (favourite) => ({
                id: favourite.id,
                name: favourite.name,
                items: favourite.items,
                base64: await (0,blob_util__WEBPACK_IMPORTED_MODULE_0__.blobToBase64String)(favourite.blob),
            }))),
            market: this.market,
            minigames: this.minigames,
            unlocked: this.unlocked,
            version: this.version,
            wishlist: this.wishlist,
        };
    }
    static async setSettings(settings) {
        this.autoExploreLocations = settings.autoExploreLocations;
        this.debug = settings.debug;
        this.explorationHistory = settings.explorationHistory;
        this.explorations = settings.explorations;
        this.market = settings.market;
        this.minigames = settings.minigames;
        this.unlocked = settings.unlocked;
        this.version = settings.version;
        this.wishlist = settings.wishlist;
        await _indexed_db_indexed_db__WEBPACK_IMPORTED_MODULE_1__["default"].clearFavouriteOutfits();
        for (const favourite of settings.favourites.map(favourite => ({
            name: favourite.name,
            items: favourite.items,
            blob: (0,blob_util__WEBPACK_IMPORTED_MODULE_0__.base64StringToBlob)(favourite.base64),
        }))) {
            void _indexed_db_indexed_db__WEBPACK_IMPORTED_MODULE_1__["default"].addFavouriteOutfit(favourite);
        }
    }
    static async resetSettings() {
        this.autoExploreLocations = [];
        this.debug = false;
        this.explorationHistory = [];
        this.explorations = false;
        this.market = false;
        this.minigames = false;
        this.unlocked = false;
        this.version = "";
        this.wishlist = [];
        await _indexed_db_indexed_db__WEBPACK_IMPORTED_MODULE_1__["default"].clearFavouriteOutfits();
    }
    static getItem(key, fallback) {
        return (JSON.parse(this.localStorage.getItem(key) ?? JSON.stringify(fallback)) ?? fallback);
    }
    static setItem(key, value) {
        this.localStorage.setItem(key, JSON.stringify(value));
    }
}


/***/ }),

/***/ "./src/marketplace/enums/body_location.enum.ts":
/*!*****************************************************!*\
  !*** ./src/marketplace/enums/body_location.enum.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BodyLocation": () => (/* binding */ BodyLocation)
/* harmony export */ });
var BodyLocation;
(function (BodyLocation) {
    BodyLocation["All"] = "";
    BodyLocation[BodyLocation["Underwear"] = 1] = "Underwear";
    BodyLocation[BodyLocation["Skins"] = 2] = "Skins";
    BodyLocation[BodyLocation["Tattoos"] = 20] = "Tattoos";
    BodyLocation[BodyLocation["Mouths"] = 21] = "Mouths";
    BodyLocation[BodyLocation["Eyes"] = 3] = "Eyes";
    BodyLocation[BodyLocation["Hair"] = 4] = "Hair";
    BodyLocation[BodyLocation["Socks"] = 5] = "Socks";
    BodyLocation[BodyLocation["Shoes"] = 6] = "Shoes";
    BodyLocation[BodyLocation["Pants"] = 7] = "Pants";
    BodyLocation[BodyLocation["HandAccessories"] = 8] = "HandAccessories";
    BodyLocation[BodyLocation["Tops"] = 9] = "Tops";
    BodyLocation[BodyLocation["Coats"] = 10] = "Coats";
    BodyLocation[BodyLocation["Gloves"] = 11] = "Gloves";
    BodyLocation[BodyLocation["Necklaces"] = 12] = "Necklaces";
    BodyLocation[BodyLocation["Dresses"] = 13] = "Dresses";
    BodyLocation[BodyLocation["Hats"] = 14] = "Hats";
    BodyLocation[BodyLocation["FaceAccessories"] = 15] = "FaceAccessories";
    BodyLocation[BodyLocation["Funds"] = 16] = "Funds";
    BodyLocation[BodyLocation["Belts"] = 18] = "Belts";
    BodyLocation[BodyLocation["Atmospheres"] = 19] = "Atmospheres";
})(BodyLocation || (BodyLocation = {}));


/***/ }),

/***/ "./src/marketplace/enums/category.enum.ts":
/*!************************************************!*\
  !*** ./src/marketplace/enums/category.enum.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CategoryNumber": () => (/* binding */ CategoryNumber),
/* harmony export */   "CategoryString": () => (/* binding */ CategoryString)
/* harmony export */ });
var CategoryString;
(function (CategoryString) {
    CategoryString["all"] = "";
    CategoryString["food"] = "food";
    CategoryString["alchemy"] = "alchemy";
    CategoryString["utility"] = "utility";
    CategoryString["tame"] = "tame";
})(CategoryString || (CategoryString = {}));
var CategoryNumber;
(function (CategoryNumber) {
    CategoryNumber["all"] = "";
    CategoryNumber[CategoryNumber["food"] = 1] = "food";
    CategoryNumber["alchemy"] = "Consumable";
    CategoryNumber[CategoryNumber["utility"] = 3] = "utility";
    CategoryNumber[CategoryNumber["tame"] = 4] = "tame";
})(CategoryNumber || (CategoryNumber = {}));


/***/ }),

/***/ "./src/marketplace/enums/guard.enum.ts":
/*!*********************************************!*\
  !*** ./src/marketplace/enums/guard.enum.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Guard": () => (/* binding */ Guard)
/* harmony export */ });
var Guard;
(function (Guard) {
    Guard["any"] = "";
    Guard[Guard["light"] = 1] = "light";
    Guard[Guard["obsidian"] = 2] = "obsidian";
    Guard[Guard["absynthe"] = 3] = "absynthe";
    Guard[Guard["shadow"] = 4] = "shadow";
})(Guard || (Guard = {}));


/***/ }),

/***/ "./src/marketplace/enums/rarity.enum.ts":
/*!**********************************************!*\
  !*** ./src/marketplace/enums/rarity.enum.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Rarity": () => (/* binding */ Rarity)
/* harmony export */ });
var Rarity;
(function (Rarity) {
    Rarity["all"] = "";
    Rarity["common"] = "common";
    Rarity["rare"] = "rare";
    Rarity["epic"] = "epic";
    Rarity["legendary"] = "legendary";
    Rarity["event"] = "event";
})(Rarity || (Rarity = {}));


/***/ }),

/***/ "./src/marketplace/enums/type.enum.ts":
/*!********************************************!*\
  !*** ./src/marketplace/enums/type.enum.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Type": () => (/* binding */ Type)
/* harmony export */ });
var Type;
(function (Type) {
    Type["All"] = "";
    Type["Bag"] = "Bag";
    Type["Consumable"] = "Consumable";
    Type["EggItem"] = "EggItem";
    Type["PlayerWearableItem"] = "PlayerWearableItem";
    Type["QuestItem"] = "QuestItem";
})(Type || (Type = {}));


/***/ }),

/***/ "./src/marketplace/marketplace_handlers.ts":
/*!*************************************************!*\
  !*** ./src/marketplace/marketplace_handlers.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getItemDetails": () => (/* binding */ getItemDetails)
/* harmony export */ });
/* harmony import */ var _console__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../console */ "./src/console.ts");
/* harmony import */ var _eldarya_util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../eldarya_util */ "./src/eldarya_util.ts");
/* harmony import */ var _enums_rarity_enum__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./enums/rarity.enum */ "./src/marketplace/enums/rarity.enum.ts");



function getItemDetails(li) {
    const dataset = li.dataset;
    const name = li.querySelector(".abstract-name")?.innerText;
    const abstractType = li.querySelector(".abstract-type")?.innerText;
    const src = li.querySelector(".abstract-icon img")?.src;
    const rarity = _enums_rarity_enum__WEBPACK_IMPORTED_MODULE_2__.Rarity[(li
        .querySelector(".rarity-marker-common, .rarity-marker-rare, .rarity-marker-epic, .rarity-marker-legendary, .rarity-marker-event")
        ?.className.split("rarity-marker-")[1] ?? "")];
    const currentPrice = li.querySelector(".price-item[data-bids]")?.dataset;
    const buyNowPrice = li.querySelector(".price-item:not([data-bids])")?.dataset;
    if (!src || !name) {
        _console__WEBPACK_IMPORTED_MODULE_0__.Console.warn("Incomplete market entry", li);
        return null;
    }
    return {
        ...dataset,
        icon: (0,_eldarya_util__WEBPACK_IMPORTED_MODULE_1__.trimIcon)(src),
        rarity,
        name,
        abstractType,
        buyNowPrice,
        currentPrice,
        date: new Date(),
    };
}


/***/ }),

/***/ "./src/migrate.ts":
/*!************************!*\
  !*** ./src/migrate.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "migrate": () => (/* binding */ migrate)
/* harmony export */ });
/* harmony import */ var _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./local_storage/local_storage */ "./src/local_storage/local_storage.ts");

function migrate() {
    switch (_local_storage_local_storage__WEBPACK_IMPORTED_MODULE_0__.LocalStorage.version) {
        case GM.info.script.version:
            return;
        case "":
            installed();
            break;
        default:
            switch (GM.info.script.version) {
                case "1.2.0":
                    v1_2_0();
                    break;
                case "1.2.9":
                    v1_2_9();
                    break;
                case "1.2.10":
                    v1_2_10();
                    break;
                case "1.2.13":
                    v1_2_13();
                    break;
                default:
                    installed();
                    break;
            }
    }
    _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_0__.LocalStorage.version = GM.info.script.version;
}
function installed() {
    $.flavrNotif(`${name()} ${version()} installed!`);
}
function name() {
    return `<strong>${GM.info.script.name}</strong>`;
}
function version() {
    return `v<strong>${GM.info.script.version}</strong>`;
}
function v1_2_0() {
    _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_0__.LocalStorage.sales = [];
    $.flavrNotif(`Updated to ${version()}. Your sales history was erased.`);
}
function v1_2_9() {
    $.flavrNotif(`Updated to ${version()}. The wishlist has been improved to sort by category/type/name, but your wished items do not have a type. You can add types by re-adding the items via the market.`);
}
function v1_2_10() {
    $.flavrNotif(`Updated to ${version()}. The wishlist has been improved to sort by category/type/rarity/name, but your wished items do not have a rarity. You can add rarities by re-adding the items via the market.`);
}
function v1_2_13() {
    $.flavrNotif(`Updated to ${version()}. The enhanced dressing experience was disabled.`);
}


/***/ }),

/***/ "./src/minigames/emile.ts":
/*!********************************!*\
  !*** ./src/minigames/emile.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "playFlappy": () => (/* binding */ playFlappy),
/* harmony export */   "playHatchlings": () => (/* binding */ playHatchlings),
/* harmony export */   "playPeggle": () => (/* binding */ playPeggle)
/* harmony export */ });
/* harmony import */ var _eldarya_jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../eldarya/jquery */ "./src/eldarya/jquery.ts");
/* harmony import */ var _eldarya_jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_eldarya_jquery__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _i18n_translate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../i18n/translate */ "./src/i18n/translate.ts");
/* harmony import */ var _flappy__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./flappy */ "./src/minigames/flappy.ts");
/* harmony import */ var _hatchlings__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./hatchlings */ "./src/minigames/hatchlings.ts");
/* harmony import */ var _peggle__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./peggle */ "./src/minigames/peggle.ts");





async function playPeggle() {
    return play(_peggle__WEBPACK_IMPORTED_MODULE_4__.peggle);
}
async function playFlappy() {
    return play(_flappy__WEBPACK_IMPORTED_MODULE_2__.flappy);
}
async function playHatchlings() {
    return play(_hatchlings__WEBPACK_IMPORTED_MODULE_3__.hatchlings);
}
async function play(minigame) {
    // Disable buttons
    await new Promise(resolve => {
        const interval = setInterval(() => {
            const buttons = document.querySelectorAll(".minigames-rules .flavr-button");
            if (buttons.length) {
                clearInterval(interval);
                for (const button of buttons) {
                    button.classList.add("disabled");
                }
                resolve(true);
            }
        }, 250);
    });
    const json = await execute(minigame);
    const template = __webpack_require__(/*! ../templates/html/flavr_notif/icon_message.html */ "./src/templates/html/flavr_notif/icon_message.html");
    $.flavrNotif(template.render({
        ...minigame,
        message: _i18n_translate__WEBPACK_IMPORTED_MODULE_1__.translate.minigames.playing(minigame.name),
    }));
    const gameToken = json.data;
    const score = randomInt(minigame.scoreMin, minigame.scoreMax);
    const enc_token = xorEncode(gameToken, score.toString());
    await new Promise(resolve => setTimeout(resolve, randomInt(minigame.delayMin, minigame.delayMax)));
    await getPrizes(minigame, gameToken, score);
    await new Promise(resolve => setTimeout(resolve, randomInt(1000, 3000)));
    await send(enc_token, score, minigame.name.toLowerCase());
    await new Promise(resolve => setTimeout(resolve, randomInt(1000, 3000)));
}
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
async function execute(minigame) {
    return new Promise((resolve, reject) => {
        if (typeof Recaptcha !== "undefined") {
            Recaptcha.execute(`minigameStart${minigame.name}`, (token) => void startGame(minigame, token).then(resolve).catch(reject));
        }
        else {
            void startGame(minigame).then(resolve).catch(reject);
        }
    });
}
async function startGame(minigame, recaptchaToken) {
    return new Promise((resolve, reject) => void $.ajax({
        url: "/minigames/ajax_startGame",
        type: "post",
        dataType: "json",
        data: recaptchaToken
            ? {
                game: minigame.name.toLowerCase(),
                recaptchaToken: recaptchaToken,
            }
            : {
                game: minigame.name.toLowerCase(),
            },
        success: (json) => {
            resolve(json);
        },
        error: () => {
            reject();
        },
    }));
}
async function getPrizes(minigame, gameToken, score) {
    return new Promise((resolve) => void $.post("/minigames/ajax_getPrizes", { game: minigame.name.toLowerCase(), score: score }, (json) => {
        resolve(json);
        if (json.result === "success") {
            const template = __webpack_require__(/*! ../templates/html/flavr_notif/icon_message.html */ "./src/templates/html/flavr_notif/icon_message.html");
            $.flavrNotif(template.render({
                ...minigame,
                message: _i18n_translate__WEBPACK_IMPORTED_MODULE_1__.translate.minigames.played_for(minigame.name, json.data.maana),
            }));
        }
        else
            $.flavrNotif(json.data);
    }, "json").fail(() => setTimeout(() => {
        resolve(getPrizes(minigame, gameToken, score));
    }, randomInt(1000, 3000))));
}
/**
 * Sécurisation de l'envoi du score
 * Basé sur l'encodage XOR : http://en.wikipedia.org/wiki/XOR_cipher
 * Effectue un XOR bit à bit entre une chaine et une clé
 */
function xorEncode(str, key) {
    // Assure que les deux paramètres soient des chaines de caractère
    str = str.toString();
    key = key.toString();
    /** Encodage XOR */
    let xor = "";
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < str.length; ++i) {
        let tmp = str[i];
        for (let j = 0; j < key.length; ++j) {
            tmp = String.fromCharCode(tmp.charCodeAt(0) ^ key.charCodeAt(j));
        }
        xor += tmp;
    }
    // Renvoie le résultat en encodant les caractères spéciaux pouvant poser problème (\n par exemple)
    return encodeURIComponent(xor);
}
async function send(enc_token, score, game) {
    return new Promise(resolve => {
        if (typeof Recaptcha !== "undefined") {
            Recaptcha.execute("minigameSave" + game, (recaptchaToken) => void saveScore(enc_token, score, game, recaptchaToken).then(resolve));
        }
        else {
            void saveScore(enc_token, score, game).then(resolve);
        }
    });
}
async function saveScore(enc_token, score, game, recaptchaToken) {
    return new Promise(resolve => {
        const token = decodeURIComponent(enc_token);
        void $.ajax({
            type: "post",
            url: "/minigames/ajax_saveScore",
            data: recaptchaToken
                ? {
                    token: token,
                    score: score,
                    game: game,
                    recaptchaToken: recaptchaToken,
                }
                : {
                    token: token,
                    score: score,
                    game: game,
                },
            success: () => {
                resolve();
            },
            error: () => setTimeout(() => {
                resolve(saveScore(enc_token, score, game));
            }, randomInt(1000, 3000)),
        });
    });
}


/***/ }),

/***/ "./src/minigames/flappy.ts":
/*!*********************************!*\
  !*** ./src/minigames/flappy.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "flappy": () => (/* binding */ flappy)
/* harmony export */ });
const flappy = {
    name: "Flappy",
    scoreMin: 180,
    scoreMax: 200,
    delayMin: 60_000,
    delayMax: 70_000,
    buttonSelector: '.minigame-start [href="/minigames/bubbltemple"] .nl-button',
    icon: "/static/img/new-layout/minigames/icon_bubbletemple.png",
};


/***/ }),

/***/ "./src/minigames/hatchlings.ts":
/*!*************************************!*\
  !*** ./src/minigames/hatchlings.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "hatchlings": () => (/* binding */ hatchlings)
/* harmony export */ });
const hatchlings = {
    name: "Hatchlings",
    scoreMin: 18,
    scoreMax: 20,
    delayMin: 30_000,
    delayMax: 30_000,
    buttonSelector: '.minigame-start [href="/minigames/cocooninpick"] .nl-button',
    icon: "/static/img/new-layout/minigames/icon_coconinpick.png",
};


/***/ }),

/***/ "./src/minigames/peggle.ts":
/*!*********************************!*\
  !*** ./src/minigames/peggle.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "peggle": () => (/* binding */ peggle)
/* harmony export */ });
const peggle = {
    name: "Peggle",
    scoreMin: 9,
    scoreMax: 10,
    delayMin: 10_000,
    delayMax: 20_000,
    buttonSelector: '.minigame-start [href="/minigames/gembomb"] .nl-button',
    icon: "/static/img/new-layout/minigames/icon_gembomb.png",
};


/***/ }),

/***/ "./src/outfit.ts":
/*!***********************!*\
  !*** ./src/outfit.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "exportOutfit": () => (/* binding */ exportOutfit),
/* harmony export */   "parseAvatar": () => (/* binding */ parseAvatar)
/* harmony export */ });
function exportOutfit(selector, name = "outfit") {
    const avatar = Sacha.Avatar.avatars[selector];
    if (!avatar)
        return;
    const outfit = parseAvatar(avatar);
    const href = "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(outfit, undefined, 2));
    const a = document.createElement("a");
    a.setAttribute("href", href);
    a.setAttribute("download", `${name}.json`);
    a.click();
}
function parseAvatar(avatar) {
    return avatar.children.map(child => {
        const item = child.getItem();
        return {
            id: item._id,
            group: item._group,
            name: item._name,
            image: item._image,
            type: item._type,
            categoryId: item._categoryId,
            hiddenCategories: Object.values(item._hiddenCategories),
            animationData: item._animationData,
            locked: item._locked,
        };
    });
}


/***/ }),

/***/ "./src/pet/exploration-history.ts":
/*!****************************************!*\
  !*** ./src/pet/exploration-history.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "loadExplorationHistory": () => (/* binding */ loadExplorationHistory),
/* harmony export */   "onClickPet": () => (/* binding */ onClickPet)
/* harmony export */ });
/* harmony import */ var _console__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../console */ "./src/console.ts");
/* harmony import */ var _i18n_translate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../i18n/translate */ "./src/i18n/translate.ts");
/* harmony import */ var _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../local_storage/local_storage */ "./src/local_storage/local_storage.ts");
/* harmony import */ var _exploration_watcher__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./exploration-watcher */ "./src/pet/exploration-watcher.ts");




function loadExplorationHistory() {
    loadHistoryButton();
    (0,_exploration_watcher__WEBPACK_IMPORTED_MODULE_3__.listenTreasureHunt)();
}
function loadHistoryButton() {
    const historyButton = document.createElement("a");
    historyButton.classList.add("nl-button", "nl-button-back");
    historyButton.style.marginRight = "0.6em";
    historyButton.textContent = _i18n_translate__WEBPACK_IMPORTED_MODULE_1__.translate.pet.history;
    historyButton.addEventListener("click", onClickHistory);
    document
        .getElementById("ee-buttons-row")
        ?.insertAdjacentElement("beforeend", historyButton);
}
function onClickHistory() {
    hidePet();
    hideExploration();
    makeHistory();
    showHistory();
}
function onClickPet() {
    hideHistory();
    showPet();
}
function hidePet() {
    const nameContainer = document.getElementById("name-container");
    const infoContainer = document.getElementById("infos-container");
    const petImageContainer = document.getElementById("pet-image-container");
    if (!nameContainer || !infoContainer || !petImageContainer)
        return _console__WEBPACK_IMPORTED_MODULE_0__.Console.error("The pet display was damaged.", {
            nameContainer,
            infoContainer,
            petImageContainer,
        });
    nameContainer.style.display = "none";
    infoContainer.style.display = "none";
    petImageContainer.style.display = "none";
}
function showPet() {
    const nameContainer = document.getElementById("name-container");
    const infoContainer = document.getElementById("infos-container");
    const petImageContainer = document.getElementById("pet-image-container");
    if (!nameContainer || !infoContainer || !petImageContainer)
        return _console__WEBPACK_IMPORTED_MODULE_0__.Console.error("The pet display was damaged.", {
            nameContainer,
            infoContainer,
            petImageContainer,
        });
    nameContainer.style.display = "";
    infoContainer.style.display = "";
    petImageContainer.style.display = "";
}
function showHistory() {
    const history = document.getElementById("history-container");
    if (!history)
        return;
    history.style.display = "";
}
function hideHistory() {
    const history = document.getElementById("history-container");
    if (!history)
        return;
    history.style.display = "none";
}
function hideExploration() {
    document
        .getElementById("main-section")
        ?.classList.remove("treasure-hunt-interface-open");
}
function makeHistory() {
    document.getElementById("history-container")?.remove();
    const template = __webpack_require__(/*! ../templates/html/exploration_history.html */ "./src/templates/html/exploration_history.html");
    document.getElementById("left-container")?.insertAdjacentHTML("beforeend", template.render({
        translate: _i18n_translate__WEBPACK_IMPORTED_MODULE_1__.translate,
        history: _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_2__.LocalStorage.explorationHistory.map(history => ({
            ...history,
            date: _i18n_translate__WEBPACK_IMPORTED_MODULE_1__.translate.pet.date_time_format.format(new Date(history.date)),
            web_hd: history.icon && toWebHd(history.icon),
        })),
    }));
    document.getElementById("delete-history")?.addEventListener("click", () => {
        _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_2__.LocalStorage.explorationHistory = [];
        makeHistory();
    });
}
function toWebHd(icon) {
    return icon.replace("icon", "web_hd");
}


/***/ }),

/***/ "./src/pet/exploration-watcher.ts":
/*!****************************************!*\
  !*** ./src/pet/exploration-watcher.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "listenTreasureHunt": () => (/* binding */ listenTreasureHunt)
/* harmony export */ });
/* harmony import */ var _console__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../console */ "./src/console.ts");
/* harmony import */ var _eldarya_util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../eldarya_util */ "./src/eldarya_util.ts");
/* harmony import */ var _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../local_storage/local_storage */ "./src/local_storage/local_storage.ts");



function listenTreasureHunt() {
    const resultOverlay = document.querySelector("#treasure-hunt-result-overlay");
    if (!resultOverlay)
        return _console__WEBPACK_IMPORTED_MODULE_0__.Console.error("There is no result overlay.", resultOverlay);
    new MutationObserver(() => {
        _console__WEBPACK_IMPORTED_MODULE_0__.Console.log("Mutation in", resultOverlay);
        if (!resultOverlay.classList.contains("active"))
            return;
        const results = getResults();
        if (results.length === 0)
            return;
        _console__WEBPACK_IMPORTED_MODULE_0__.Console.log("Results:", results);
        _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_2__.LocalStorage.explorationHistory = [
            ...results,
            ..._local_storage_local_storage__WEBPACK_IMPORTED_MODULE_2__.LocalStorage.explorationHistory,
        ];
    }).observe(resultOverlay, {
        attributeFilter: ["class"],
    });
}
function getResults() {
    const locationName = document
        .querySelector("#th-again strong")
        ?.textContent?.trim();
    const now = new Date();
    return Array.from(document.querySelectorAll(".th-result")).map(result => {
        const img = result.querySelector("img.th-result-img");
        return {
            count: result.querySelector(".resource-count")?.textContent?.trim(),
            date: now,
            icon: img ? (0,_eldarya_util__WEBPACK_IMPORTED_MODULE_1__.trimIcon)(img.src) : undefined,
            locationName,
            name: result.querySelector(".tooltip-content h3")?.textContent?.trim(),
            tradable: Boolean(result.querySelector(".tradable")),
        };
    });
}


/***/ }),

/***/ "./src/pet/exploration.ts":
/*!********************************!*\
  !*** ./src/pet/exploration.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getRegion": () => (/* binding */ getRegion),
/* harmony export */   "loadMarkers": () => (/* binding */ loadMarkers),
/* harmony export */   "reloadMarkers": () => (/* binding */ reloadMarkers)
/* harmony export */ });
/* harmony import */ var _ajax_change_region__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../ajax/change_region */ "./src/ajax/change_region.ts");
/* harmony import */ var _api_result_enum__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../api/result.enum */ "./src/api/result.enum.ts");
/* harmony import */ var _console__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../console */ "./src/console.ts");
/* harmony import */ var _i18n_translate__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../i18n/translate */ "./src/i18n/translate.ts");
/* harmony import */ var _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../local_storage/local_storage */ "./src/local_storage/local_storage.ts");





function loadMarkers() {
    const autoExploreLocations = _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_4__.LocalStorage.autoExploreLocations;
    for (const div of document.querySelectorAll(".map-location[data-id]")) {
        const locationId = Number(div.getAttribute("data-id"));
        if (!locationId)
            continue;
        loadPictoMap(autoExploreLocations, div);
        div.addEventListener("click", () => new MutationObserver((_, observer) => {
            addAutoExploreButton(locationId, observer);
        }).observe(document.getElementById("map-location-preview"), {
            attributes: true,
        }));
    }
}
function reloadMarkers() {
    const autoExploreLocations = _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_4__.LocalStorage.autoExploreLocations;
    for (const div of document.querySelectorAll(".map-location[data-id]")) {
        const locationId = Number(div.getAttribute("data-id"));
        if (!locationId)
            continue;
        loadPictoMap(autoExploreLocations, div);
    }
}
function addAutoExploreButton(locationId, observer) {
    const buttonsContainer = document.querySelector("#buttons-container");
    if (!buttonsContainer)
        return;
    observer?.disconnect();
    // Parameters to be injected into the template
    const context = {
        locationId,
        active: _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_4__.LocalStorage.autoExploreLocations.some(saved => saved.location.id === locationId),
        regionId: Number(document
            .querySelector(".minimap.current[data-mapid]")
            ?.getAttribute("data-mapid")),
    };
    // Add the auto explore button
    buttonsContainer.querySelector("#auto-explore-button")?.remove();
    const autoExploreTemplate = __webpack_require__(/*! ../templates/html/auto_explore_button.html */ "./src/templates/html/auto_explore_button.html");
    buttonsContainer.insertAdjacentHTML("beforeend", autoExploreTemplate.render({ ...context, translate: _i18n_translate__WEBPACK_IMPORTED_MODULE_3__.translate }));
    // Bind `autoExplore` and `loadPictoMaps`
    buttonsContainer
        .querySelector("#auto-explore-button")
        ?.addEventListener("click", () => {
        _console__WEBPACK_IMPORTED_MODULE_2__.Console.debug("Clicked on #auto-explore-button.", context);
        void markLocation(context).then(loadPictoMaps);
    });
    void disableExplore(context);
}
async function disableExplore(context) {
    const entry = await getAutoExploreEntry(context.regionId, context.locationId);
    if (!entry)
        return;
    if (petEnergy < Number(entry.location.energyRequired))
        document.getElementById("explore-button")?.classList.add("disabled");
}
async function markLocation(context) {
    if (context.active) {
        const filteredLocations = _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_4__.LocalStorage.autoExploreLocations.filter(saved => saved.location.id !== context.locationId);
        _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_4__.LocalStorage.autoExploreLocations = filteredLocations;
        addAutoExploreButton(context.locationId);
        return;
    }
    const newAutoExplore = await getAutoExploreEntry(context.regionId, context.locationId);
    if (!newAutoExplore) {
        _console__WEBPACK_IMPORTED_MODULE_2__.Console.error(`Could not generate an auto explore entry for location #${context.locationId}.`, context);
        return;
    }
    const newLocations = _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_4__.LocalStorage.autoExploreLocations;
    newLocations.push(newAutoExplore);
    _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_4__.LocalStorage.autoExploreLocations = newLocations;
    addAutoExploreButton(context.locationId);
}
async function getAutoExploreEntry(regionId, locationId) {
    const region = await getRegion(regionId);
    if (!region) {
        _console__WEBPACK_IMPORTED_MODULE_2__.Console.error(`Could not get region #${regionId}.`);
        return null;
    }
    const location = region.locations.find(location => location.id === locationId);
    if (!location) {
        _console__WEBPACK_IMPORTED_MODULE_2__.Console.error(`Could not get location #${locationId} in ${region.name}.`, region);
        return null;
    }
    return {
        location,
        region,
    };
}
async function getRegion(id) {
    if (id.toString() === currentRegion.id)
        return currentRegion;
    const json = await (0,_ajax_change_region__WEBPACK_IMPORTED_MODULE_0__.changeRegion)(id);
    if (json.result === _api_result_enum__WEBPACK_IMPORTED_MODULE_1__.Result.success)
        return json.data.currentRegion;
    return null;
}
function loadPictoMaps() {
    const autoExploreLocations = _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_4__.LocalStorage.autoExploreLocations;
    for (const div of document.querySelectorAll(".map-location[data-id]")) {
        loadPictoMap(autoExploreLocations, div);
    }
}
function loadPictoMap(autoExploreLocations, div) {
    const mapLocation = div.getAttribute("data-id");
    if (!mapLocation)
        return;
    div.style.backgroundImage = autoExploreLocations.some(saved => saved.location.id === Number(mapLocation))
        ? "url(/static/img/new-layout/pet/icons/picto_map_explo.png)"
        : "url(/static/img/new-layout/pet/icons/picto_map.png)";
}


/***/ }),

/***/ "./src/pet/map_location_dataset.ts":
/*!*****************************************!*\
  !*** ./src/pet/map_location_dataset.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getMapLocationDataset": () => (/* binding */ getMapLocationDataset)
/* harmony export */ });
function getMapLocationDataset(div) {
    const dataset = div.dataset;
    return {
        id: Number(dataset.id),
    };
}


/***/ }),

/***/ "./src/pet/mark_context.ts":
/*!*********************************!*\
  !*** ./src/pet/mark_context.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "markAllContext": () => (/* binding */ markAllContext),
/* harmony export */   "unmarkAllContext": () => (/* binding */ unmarkAllContext)
/* harmony export */ });
/* harmony import */ var _i18n_translate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../i18n/translate */ "./src/i18n/translate.ts");

const markAllContext = {
    src: "https://gitlab.com/NatoBoram/eldarya-enhancements/-/raw/master/images/picto_map_explo.png",
    textContent: _i18n_translate__WEBPACK_IMPORTED_MODULE_0__.translate.pet.mark_all,
};
const unmarkAllContext = {
    src: "https://gitlab.com/NatoBoram/eldarya-enhancements/-/raw/master/images/picto_map.png",
    textContent: _i18n_translate__WEBPACK_IMPORTED_MODULE_0__.translate.pet.unmark_all,
};


/***/ }),

/***/ "./src/pet/mass_mark.ts":
/*!******************************!*\
  !*** ./src/pet/mass_mark.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "loadMassMark": () => (/* binding */ loadMassMark)
/* harmony export */ });
/* harmony import */ var _console__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../console */ "./src/console.ts");
/* harmony import */ var _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../local_storage/local_storage */ "./src/local_storage/local_storage.ts");
/* harmony import */ var _exploration__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./exploration */ "./src/pet/exploration.ts");
/* harmony import */ var _map_location_dataset__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./map_location_dataset */ "./src/pet/map_location_dataset.ts");
/* harmony import */ var _mark_context__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./mark_context */ "./src/pet/mark_context.ts");
/* harmony import */ var _minimap_dataset__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./minimap_dataset */ "./src/pet/minimap_dataset.ts");






function loadMassMark() {
    void setupMassMarkButton();
    handleClickMinimaps();
}
async function setupMassMarkButton() {
    document.getElementById("mass-mark")?.remove();
    const marked = hasSomeMarked();
    const template = __webpack_require__(/*! ../templates/html/mass_mark_button.html */ "./src/templates/html/mass_mark_button.html");
    const rendered = template.render(marked ? _mark_context__WEBPACK_IMPORTED_MODULE_4__.unmarkAllContext : _mark_context__WEBPACK_IMPORTED_MODULE_4__.markAllContext);
    document
        .getElementById("ee-buttons-row")
        ?.insertAdjacentHTML("beforeend", rendered);
    const id = getCurrentRegionId();
    if (!id)
        return;
    const region = await (0,_exploration__WEBPACK_IMPORTED_MODULE_2__.getRegion)(id);
    if (!region)
        return;
    const inserted = document.getElementById("mass-mark");
    inserted?.addEventListener("click", () => marked ? void unmarkRegion(region) : void markRegion(region));
}
function handleClickMinimaps() {
    for (const minimap of document.querySelectorAll(".minimap"))
        minimap.addEventListener("click", () => handleClickMinimap(minimap));
}
/** Wait for the minimap to change then reload the mass mark button */
function handleClickMinimap(div) {
    const dataset = (0,_minimap_dataset__WEBPACK_IMPORTED_MODULE_5__.getMinimapDataset)(div);
    const container = document.querySelector("#minimaps-container");
    if (!container)
        return _console__WEBPACK_IMPORTED_MODULE_0__.Console.error("Couldn't get #minimaps-container", container);
    new MutationObserver((mutations, observer) => {
        const found = mutations.find(mutation => mutation.target instanceof HTMLDivElement &&
            mutation.target.classList.contains("minimap") &&
            mutation.target.classList.contains("current") &&
            (0,_minimap_dataset__WEBPACK_IMPORTED_MODULE_5__.getMinimapDataset)(mutation.target).mapid === dataset.mapid);
        if (found) {
            observer.disconnect();
            void setupMassMarkButton();
        }
    }).observe(container, {
        attributes: true,
        subtree: true,
    });
}
function hasSomeMarked() {
    const autoExploreLocations = _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_1__.LocalStorage.autoExploreLocations;
    return Array.from(document.querySelectorAll("#map-locations-container .map-location")).some(location => {
        const dataset = (0,_map_location_dataset__WEBPACK_IMPORTED_MODULE_3__.getMapLocationDataset)(location);
        return autoExploreLocations.some(autoLocation => dataset.id === autoLocation.location.id);
    });
}
async function markRegion(region) {
    const autoExploreLocations = _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_1__.LocalStorage.autoExploreLocations;
    autoExploreLocations.push(...region.locations
        .filter(newLocation => !autoExploreLocations.find(autoLocation => autoLocation.location.id === newLocation.id))
        .map(newLocation => ({ location: newLocation, region: region })));
    _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_1__.LocalStorage.autoExploreLocations = autoExploreLocations;
    await setupMassMarkButton();
    (0,_exploration__WEBPACK_IMPORTED_MODULE_2__.reloadMarkers)();
}
async function unmarkRegion(region) {
    _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_1__.LocalStorage.autoExploreLocations = _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_1__.LocalStorage.autoExploreLocations.filter(autoLocation => !region.locations.find(location => location.id === autoLocation.location.id));
    await setupMassMarkButton();
    (0,_exploration__WEBPACK_IMPORTED_MODULE_2__.reloadMarkers)();
}
function getCurrentRegionId() {
    const div = document.querySelector(".minimap.current");
    if (!div)
        return Number(currentRegion.id);
    return Number((0,_minimap_dataset__WEBPACK_IMPORTED_MODULE_5__.getMinimapDataset)(div).mapid);
}


/***/ }),

/***/ "./src/pet/minimap_dataset.ts":
/*!************************************!*\
  !*** ./src/pet/minimap_dataset.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getMinimapDataset": () => (/* binding */ getMinimapDataset)
/* harmony export */ });
function getMinimapDataset(div) {
    return {
        mapid: Number(div.dataset.mapid),
    };
}


/***/ }),

/***/ "./src/session_storage/session_storage.enum.ts":
/*!*****************************************************!*\
  !*** ./src/session_storage/session_storage.enum.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SessionStorageKey": () => (/* binding */ SessionStorageKey)
/* harmony export */ });
var SessionStorageKey;
(function (SessionStorageKey) {
    SessionStorageKey["action"] = "action";
    SessionStorageKey["explorationsDone"] = "explorationsDone";
    SessionStorageKey["minigamesDone"] = "minigamesDone";
    SessionStorageKey["selectedLocation"] = "selectedLocation";
    SessionStorageKey["takeover"] = "takeover";
    SessionStorageKey["wishlist"] = "wishlist";
    SessionStorageKey["summerGameDone"] = "summerGameDone";
})(SessionStorageKey || (SessionStorageKey = {}));


/***/ }),

/***/ "./src/session_storage/session_storage.ts":
/*!************************************************!*\
  !*** ./src/session_storage/session_storage.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SessionStorage": () => (/* binding */ SessionStorage)
/* harmony export */ });
/* harmony import */ var _session_storage_enum__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./session_storage.enum */ "./src/session_storage/session_storage.enum.ts");

class SessionStorage {
    static sessionStorage = sessionStorage;
    constructor() { }
    static get action() {
        return this.getItem(_session_storage_enum__WEBPACK_IMPORTED_MODULE_0__.SessionStorageKey.action, null);
    }
    static set action(action) {
        this.setItem(_session_storage_enum__WEBPACK_IMPORTED_MODULE_0__.SessionStorageKey.action, action);
    }
    static get explorationsDone() {
        return this.getItem(_session_storage_enum__WEBPACK_IMPORTED_MODULE_0__.SessionStorageKey.explorationsDone, false);
    }
    static set explorationsDone(done) {
        this.setItem(_session_storage_enum__WEBPACK_IMPORTED_MODULE_0__.SessionStorageKey.explorationsDone, done);
    }
    static get minigamesDone() {
        return this.getItem(_session_storage_enum__WEBPACK_IMPORTED_MODULE_0__.SessionStorageKey.minigamesDone, false);
    }
    static set minigamesDone(done) {
        this.setItem(_session_storage_enum__WEBPACK_IMPORTED_MODULE_0__.SessionStorageKey.minigamesDone, done);
    }
    static get summerGameDone() {
        return this.getItem(_session_storage_enum__WEBPACK_IMPORTED_MODULE_0__.SessionStorageKey.summerGameDone, false);
    }
    static set summerGameDone(done) {
        this.setItem(_session_storage_enum__WEBPACK_IMPORTED_MODULE_0__.SessionStorageKey.summerGameDone, done);
    }
    static get selectedLocation() {
        return this.getItem(_session_storage_enum__WEBPACK_IMPORTED_MODULE_0__.SessionStorageKey.selectedLocation, null);
    }
    static set selectedLocation(selected) {
        this.setItem(_session_storage_enum__WEBPACK_IMPORTED_MODULE_0__.SessionStorageKey.selectedLocation, selected);
    }
    static get takeover() {
        return this.getItem(_session_storage_enum__WEBPACK_IMPORTED_MODULE_0__.SessionStorageKey.takeover, false);
    }
    static set takeover(enabled) {
        this.setItem(_session_storage_enum__WEBPACK_IMPORTED_MODULE_0__.SessionStorageKey.takeover, enabled);
    }
    static get wishlist() {
        return this.getItem(_session_storage_enum__WEBPACK_IMPORTED_MODULE_0__.SessionStorageKey.wishlist, []);
    }
    static set wishlist(wishlist) {
        this.setItem(_session_storage_enum__WEBPACK_IMPORTED_MODULE_0__.SessionStorageKey.wishlist, wishlist);
    }
    static getItem(key, fallback) {
        return (JSON.parse(this.sessionStorage.getItem(key) ?? JSON.stringify(fallback)) ?? fallback);
    }
    static setItem(key, value) {
        this.sessionStorage.setItem(key, JSON.stringify(value));
    }
}


/***/ }),

/***/ "./src/session_storage/takeover_action.enum.ts":
/*!*****************************************************!*\
  !*** ./src/session_storage/takeover_action.enum.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TakeoverAction": () => (/* binding */ TakeoverAction)
/* harmony export */ });
var TakeoverAction;
(function (TakeoverAction) {
    TakeoverAction["daily"] = "daily";
    TakeoverAction["minigames"] = "minigames";
    TakeoverAction["explorations"] = "explorations";
    TakeoverAction["auctions"] = "auctions";
    TakeoverAction["buy"] = "buy";
    // sell,
    TakeoverAction["summerGame"] = "summerGame";
    TakeoverAction["wait"] = "wait";
})(TakeoverAction || (TakeoverAction = {}));


/***/ }),

/***/ "./src/takeover/brain.ts":
/*!*******************************!*\
  !*** ./src/takeover/brain.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "loadTakeover": () => (/* binding */ loadTakeover),
/* harmony export */   "resetTakeover": () => (/* binding */ resetTakeover),
/* harmony export */   "toggleTakeover": () => (/* binding */ toggleTakeover)
/* harmony export */ });
/* harmony import */ var _console__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../console */ "./src/console.ts");
/* harmony import */ var _i18n_translate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../i18n/translate */ "./src/i18n/translate.ts");
/* harmony import */ var _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../local_storage/local_storage */ "./src/local_storage/local_storage.ts");
/* harmony import */ var _session_storage_session_storage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../session_storage/session_storage */ "./src/session_storage/session_storage.ts");
/* harmony import */ var _ui_top_bar__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../ui/top_bar */ "./src/ui/top_bar.ts");
/* harmony import */ var _classes_buy_action__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./classes/buy_action */ "./src/takeover/classes/buy_action.ts");
/* harmony import */ var _classes_daily_action__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./classes/daily_action */ "./src/takeover/classes/daily_action.ts");
/* harmony import */ var _classes_exploration_action__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./classes/exploration_action */ "./src/takeover/classes/exploration_action.ts");
/* harmony import */ var _classes_minigame_action__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./classes/minigame_action */ "./src/takeover/classes/minigame_action.ts");
/* harmony import */ var _classes_wait_action__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./classes/wait_action */ "./src/takeover/classes/wait_action.ts");










/** Automated entry point of the takeover. */
function loadTakeover() {
    if (_session_storage_session_storage__WEBPACK_IMPORTED_MODULE_3__.SessionStorage.takeover && _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_2__.LocalStorage.unlocked)
        void takeover();
}
/** Manual entry point of the takeover. */
function toggleTakeover() {
    resetTakeover();
    _session_storage_session_storage__WEBPACK_IMPORTED_MODULE_3__.SessionStorage.takeover = !_session_storage_session_storage__WEBPACK_IMPORTED_MODULE_3__.SessionStorage.takeover;
    if (!_local_storage_local_storage__WEBPACK_IMPORTED_MODULE_2__.LocalStorage.unlocked) {
        _session_storage_session_storage__WEBPACK_IMPORTED_MODULE_3__.SessionStorage.takeover = false;
        return;
    }
    (0,_ui_top_bar__WEBPACK_IMPORTED_MODULE_4__.loadTopBar)();
    if (_session_storage_session_storage__WEBPACK_IMPORTED_MODULE_3__.SessionStorage.takeover)
        $.flavrNotif(_i18n_translate__WEBPACK_IMPORTED_MODULE_1__.translate.takeover.enabled);
    else
        $.flavrNotif(_i18n_translate__WEBPACK_IMPORTED_MODULE_1__.translate.takeover.disabled);
    void takeover();
}
function resetTakeover() {
    _session_storage_session_storage__WEBPACK_IMPORTED_MODULE_3__.SessionStorage.action = null;
    _session_storage_session_storage__WEBPACK_IMPORTED_MODULE_3__.SessionStorage.explorationsDone = false;
    _session_storage_session_storage__WEBPACK_IMPORTED_MODULE_3__.SessionStorage.minigamesDone = false;
    _session_storage_session_storage__WEBPACK_IMPORTED_MODULE_3__.SessionStorage.selectedLocation = null;
    _session_storage_session_storage__WEBPACK_IMPORTED_MODULE_3__.SessionStorage.summerGameDone = false;
    _session_storage_session_storage__WEBPACK_IMPORTED_MODULE_3__.SessionStorage.wishlist = [];
}
async function takeover() {
    if (!_session_storage_session_storage__WEBPACK_IMPORTED_MODULE_3__.SessionStorage.takeover)
        return;
    if (_classes_daily_action__WEBPACK_IMPORTED_MODULE_6__["default"].condition())
        await _classes_daily_action__WEBPACK_IMPORTED_MODULE_6__["default"].perform();
    const action = actions.find(action => action.key === _session_storage_session_storage__WEBPACK_IMPORTED_MODULE_3__.SessionStorage.action);
    if (action?.condition()) {
        _console__WEBPACK_IMPORTED_MODULE_0__.Console.info("Action:", action.key);
        if (await action.perform())
            return;
    }
    changeAction();
    void takeover();
}
const actions = [
    _classes_exploration_action__WEBPACK_IMPORTED_MODULE_7__["default"],
    _classes_buy_action__WEBPACK_IMPORTED_MODULE_5__["default"],
    _classes_minigame_action__WEBPACK_IMPORTED_MODULE_8__["default"],
    _classes_wait_action__WEBPACK_IMPORTED_MODULE_9__["default"],
];
function changeAction() {
    const next = actions.findIndex(action => action.key === _session_storage_session_storage__WEBPACK_IMPORTED_MODULE_3__.SessionStorage.action) + 1;
    return (_session_storage_session_storage__WEBPACK_IMPORTED_MODULE_3__.SessionStorage.action =
        actions[next >= actions.length ? 0 : next].key);
}


/***/ }),

/***/ "./src/takeover/classes/action.ts":
/*!****************************************!*\
  !*** ./src/takeover/classes/action.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Action": () => (/* binding */ Action)
/* harmony export */ });
class Action {
}


/***/ }),

/***/ "./src/takeover/classes/buy_action.ts":
/*!********************************************!*\
  !*** ./src/takeover/classes/buy_action.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ajax_ajax_search__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../ajax/ajax_search */ "./src/ajax/ajax_search.ts");
/* harmony import */ var _ajax_buy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ajax/buy */ "./src/ajax/buy.ts");
/* harmony import */ var _console__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../console */ "./src/console.ts");
/* harmony import */ var _i18n_translate__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../i18n/translate */ "./src/i18n/translate.ts");
/* harmony import */ var _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../local_storage/local_storage */ "./src/local_storage/local_storage.ts");
/* harmony import */ var _marketplace_marketplace_handlers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../marketplace/marketplace_handlers */ "./src/marketplace/marketplace_handlers.ts");
/* harmony import */ var _session_storage_takeover_action_enum__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../session_storage/takeover_action.enum */ "./src/session_storage/takeover_action.enum.ts");
/* harmony import */ var _action__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./action */ "./src/takeover/classes/action.ts");








class BuyAction extends _action__WEBPACK_IMPORTED_MODULE_7__.Action {
    key = _session_storage_takeover_action_enum__WEBPACK_IMPORTED_MODULE_6__.TakeoverAction.buy;
    get currentMaana() {
        return Number(document.querySelector("#currency-maana")?.dataset
            .maana);
    }
    condition() {
        return _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_4__.LocalStorage.market && Boolean(_local_storage_local_storage__WEBPACK_IMPORTED_MODULE_4__.LocalStorage.wishlist.length);
    }
    async perform() {
        if (location.pathname !== "/marketplace") {
            pageLoad("/marketplace");
            return true;
        }
        const iconMessage = __webpack_require__(/*! ../../templates/html/flavr_notif/icon_message.html */ "./src/templates/html/flavr_notif/icon_message.html");
        for (const wished of _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_4__.LocalStorage.wishlist) {
            // Clothes might be a special exception. If they are, then check for
            // `wished.type === Type.PlayerWearableItem`.
            if (wished.error) {
                _console__WEBPACK_IMPORTED_MODULE_2__.Console.warn(`Skipped "${wished.name}"`, wished);
                continue;
            }
            _console__WEBPACK_IMPORTED_MODULE_2__.Console.info(`Searching for "${wished.name}"`, wished);
            /** Search in each pages until the amount of items is less than 8 */
            let amount = 8;
            forpage: for (let page = 1; amount === 8; page++) {
                let results = [];
                try {
                    results = await this.search(wished, page);
                }
                catch (e) {
                    const error = e;
                    _console__WEBPACK_IMPORTED_MODULE_2__.Console.error(`Failed to search for "${wished.name}"`, error);
                    this.setError(wished.icon, `${error.statusText}`);
                    break forpage;
                }
                amount = results.length;
                _console__WEBPACK_IMPORTED_MODULE_2__.Console.log(`Found ${amount} results`, results);
                const wanted = results.filter(result => result.icon === wished.icon &&
                    result.buyNowPrice &&
                    Number(result.buyNowPrice.price) <= wished.price &&
                    Number(result.buyNowPrice.price) <= this.currentMaana);
                for (const result of wanted) {
                    if (!(await this.buy(result)))
                        break forpage;
                    _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_4__.LocalStorage.purchases = [
                        result,
                        ..._local_storage_local_storage__WEBPACK_IMPORTED_MODULE_4__.LocalStorage.purchases.filter(purchase => purchase.itemid !== result.itemid),
                    ];
                    _console__WEBPACK_IMPORTED_MODULE_2__.Console.info(`Bought "${result.name}" for ${Number(result.buyNowPrice?.price)} maanas.`, result);
                    $.flavrNotif(iconMessage.render({
                        ...result,
                        message: _i18n_translate__WEBPACK_IMPORTED_MODULE_3__.translate.takeover.bought(result.name, Number(result.buyNowPrice?.price)),
                    }));
                }
            }
        }
        return false;
    }
    /**
     * Purchase an item from the market.
     * @returns whether the item was successfully purchased.
     */
    async buy(result) {
        const json = await (0,_ajax_buy__WEBPACK_IMPORTED_MODULE_1__.buy)(Number(result.itemid));
        _console__WEBPACK_IMPORTED_MODULE_2__.Console.error(`Failed to buy "${result.name}"`, result, json);
        if (json.result !== "success")
            this.setError(result.icon, json.data);
        return json.result === "success";
    }
    /** Search for a wished item on a specific page using the item's name. */
    async search(wished, page = 1) {
        // Put the name of the item in the filter
        const filterItemName = document.querySelector("#filter-itemName");
        if (filterItemName)
            filterItemName.value = wished.name;
        // Show the results of the search
        const marketplaceSearchItems = document.querySelector(".marketplace-search-items");
        if (!marketplaceSearchItems)
            return [];
        marketplaceSearchItems.innerHTML = await (0,_ajax_ajax_search__WEBPACK_IMPORTED_MODULE_0__.ajaxSearch)({
            name: wished.name,
            page,
        });
        return Array.from(marketplaceSearchItems.querySelectorAll(".marketplace-search-item"))
            .map(_marketplace_marketplace_handlers__WEBPACK_IMPORTED_MODULE_5__.getItemDetails)
            .filter((item) => item !== null);
    }
    /** Set the `WishedItem.error` property without reordering the wishlist. */
    setError(icon, error) {
        const wishlist = _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_4__.LocalStorage.wishlist;
        const index = wishlist.findIndex(item => item.icon === icon);
        const entry = wishlist[index];
        if (!entry)
            return;
        entry.error = error;
        _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_4__.LocalStorage.wishlist = [
            ...wishlist.slice(undefined, index),
            entry,
            ...wishlist.slice(index + 1, undefined),
        ];
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new BuyAction());


/***/ }),

/***/ "./src/takeover/classes/daily_action.ts":
/*!**********************************************!*\
  !*** ./src/takeover/classes/daily_action.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _session_storage_takeover_action_enum__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../session_storage/takeover_action.enum */ "./src/session_storage/takeover_action.enum.ts");
/* harmony import */ var _brain__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../brain */ "./src/takeover/brain.ts");
/* harmony import */ var _click__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../click */ "./src/takeover/click.ts");



class DailyAction {
    key = _session_storage_takeover_action_enum__WEBPACK_IMPORTED_MODULE_0__.TakeoverAction.daily;
    /** Checks if the daily maana gift if there. */
    condition() {
        const dailyGiftContainer = document.getElementById("daily-gift-container");
        return (!!dailyGiftContainer &&
            getComputedStyle(dailyGiftContainer).display !== "none");
    }
    /**
     * Click on the daily maana gift.
     * @returns `false`. This action does not perform meaningful actions on the
     * page.
     */
    async perform() {
        const dailyGiftContainer = document.getElementById("daily-gift-container");
        if (!dailyGiftContainer ||
            getComputedStyle(dailyGiftContainer).display === "none") {
            return false;
        }
        dailyGiftContainer.click();
        await (0,_click__WEBPACK_IMPORTED_MODULE_2__.click)(".first-connexion .flavr-button.default");
        (0,_brain__WEBPACK_IMPORTED_MODULE_1__.resetTakeover)();
        return false;
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new DailyAction());


/***/ }),

/***/ "./src/takeover/classes/exploration_action.ts":
/*!****************************************************!*\
  !*** ./src/takeover/classes/exploration_action.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ajax_capture_end__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../ajax/capture_end */ "./src/ajax/capture_end.ts");
/* harmony import */ var _ajax_change_region__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ajax/change_region */ "./src/ajax/change_region.ts");
/* harmony import */ var _ajax_exploration_results__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ajax/exploration_results */ "./src/ajax/exploration_results.ts");
/* harmony import */ var _api_result_enum__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../api/result.enum */ "./src/api/result.enum.ts");
/* harmony import */ var _console__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../console */ "./src/console.ts");
/* harmony import */ var _duration__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../duration */ "./src/duration.ts");
/* harmony import */ var _i18n_translate__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../i18n/translate */ "./src/i18n/translate.ts");
/* harmony import */ var _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../local_storage/local_storage */ "./src/local_storage/local_storage.ts");
/* harmony import */ var _session_storage_session_storage__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../session_storage/session_storage */ "./src/session_storage/session_storage.ts");
/* harmony import */ var _session_storage_takeover_action_enum__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../session_storage/takeover_action.enum */ "./src/session_storage/takeover_action.enum.ts");
/* harmony import */ var _click__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../click */ "./src/takeover/click.ts");
/* harmony import */ var _exploration_status_enum__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../exploration_status.enum */ "./src/takeover/exploration_status.enum.ts");
/* harmony import */ var _action__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./action */ "./src/takeover/classes/action.ts");













class ExplorationAction extends _action__WEBPACK_IMPORTED_MODULE_12__.Action {
    key = _session_storage_takeover_action_enum__WEBPACK_IMPORTED_MODULE_9__.TakeoverAction.explorations;
    get globals() {
        return { currentRegion, pendingTreasureHuntLocation, timeLeftExploration };
    }
    condition() {
        return (_local_storage_local_storage__WEBPACK_IMPORTED_MODULE_7__.LocalStorage.explorations &&
            !_session_storage_session_storage__WEBPACK_IMPORTED_MODULE_8__.SessionStorage.explorationsDone &&
            !!_local_storage_local_storage__WEBPACK_IMPORTED_MODULE_7__.LocalStorage.autoExploreLocations.length);
    }
    async perform() {
        if (location.pathname !== "/pet") {
            pageLoad("/pet");
            return true;
        }
        await this.openCurrentRegion();
        const status = this.getExplorationStatus();
        _console__WEBPACK_IMPORTED_MODULE_4__.Console.log("Exploration status:", _exploration_status_enum__WEBPACK_IMPORTED_MODULE_11__.ExplorationStatus[status]);
        switch (status) {
            case _exploration_status_enum__WEBPACK_IMPORTED_MODULE_11__.ExplorationStatus.idle:
                if (!(await this.startExploration()).selected)
                    _session_storage_session_storage__WEBPACK_IMPORTED_MODULE_8__.SessionStorage.explorationsDone = true;
                return false;
            case _exploration_status_enum__WEBPACK_IMPORTED_MODULE_11__.ExplorationStatus.pending:
                return (await this.waitExploration()) && this.perform();
            case _exploration_status_enum__WEBPACK_IMPORTED_MODULE_11__.ExplorationStatus.result:
                await this.endExploration();
                return this.perform();
            case _exploration_status_enum__WEBPACK_IMPORTED_MODULE_11__.ExplorationStatus.capture:
                await this.endCapture();
                return this.perform();
            default:
                return false;
        }
    }
    async openCurrentRegion() {
        if (!pendingTreasureHuntLocation)
            return null;
        return (0,_click__WEBPACK_IMPORTED_MODULE_10__.click)(`.minimap[data-mapid="${pendingTreasureHuntLocation.MapRegion_id}"]`);
    }
    async clickExplore() {
        return (0,_click__WEBPACK_IMPORTED_MODULE_10__.click)("#explore-button");
    }
    async clickLocation(selected) {
        return (0,_click__WEBPACK_IMPORTED_MODULE_10__.click)(`.map-location[data-id="${selected.location.id}"]`);
    }
    async clickRegion(selected) {
        const container = document.querySelector("#minimaps-container");
        if (!container) {
            _console__WEBPACK_IMPORTED_MODULE_4__.Console.log("Couldn't find #minimaps-container:", container);
            return null;
        }
        const div = await (0,_click__WEBPACK_IMPORTED_MODULE_10__.waitObserve)(container, `.minimap[data-mapid="${selected.region.id}"]`);
        if (!div) {
            // Clearing invalid regions is useful to remove finished events.
            const template = __webpack_require__(/*! ../../templates/html/flavr_notif/icon_message.html */ "./src/templates/html/flavr_notif/icon_message.html");
            $.flavrNotif(template.render({
                icon: "/static/img/new-layout/pet/icons/picto_map.png",
                message: _i18n_translate__WEBPACK_IMPORTED_MODULE_6__.translate.pet.deleting_markers,
            }));
            _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_7__.LocalStorage.autoExploreLocations =
                _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_7__.LocalStorage.autoExploreLocations.filter(saved => saved.region.id !== selected.region.id);
            _console__WEBPACK_IMPORTED_MODULE_4__.Console.warn("Could not find region", selected.region);
            pageLoad("/pet");
            return null;
        }
        _console__WEBPACK_IMPORTED_MODULE_4__.Console.debug("Clicking on region", div);
        await (0,_click__WEBPACK_IMPORTED_MODULE_10__.clickElement)(div);
        return div;
    }
    async clickSeason() {
        return (0,_click__WEBPACK_IMPORTED_MODULE_10__.click)("#crystal-images-container");
    }
    async endCapture() {
        try {
            void new Audio("/static/event/2021/music/sounds/mission-complete.mp3").play();
        }
        catch (e) {
            // eslint-disable-next-line no-empty
        }
        await (0,_click__WEBPACK_IMPORTED_MODULE_10__.click)("#open-capture-interface");
        await (0,_click__WEBPACK_IMPORTED_MODULE_10__.click)("#capture-button");
        await (0,_click__WEBPACK_IMPORTED_MODULE_10__.click)("#close-result");
    }
    async endExploration() {
        return (0,_click__WEBPACK_IMPORTED_MODULE_10__.click)("#close-result");
    }
    getCurrentSeason() {
        const season = Array.from(document.querySelector("body")?.classList ?? [])
            .find(c => c.startsWith("season-"))
            ?.replace("season-", "");
        if (this.isSeason(season))
            return season;
        else
            return null;
    }
    isSeason(season) {
        return ["s1", "s2"].some(s => s === season);
    }
    getExplorationStatus() {
        if (document.querySelector("#treasure-hunt-result-overlay.active #open-capture-interface") ||
            document.querySelector("#capture-interface-outer.active")) {
            return _exploration_status_enum__WEBPACK_IMPORTED_MODULE_11__.ExplorationStatus.capture;
        }
        else if (document.querySelector("#pending-map-location-data-outer.active") ||
            document.querySelector("#map-container.pending")) {
            return _exploration_status_enum__WEBPACK_IMPORTED_MODULE_11__.ExplorationStatus.pending;
        }
        else if (document.querySelector("#treasure-hunt-result-overlay.active"))
            return _exploration_status_enum__WEBPACK_IMPORTED_MODULE_11__.ExplorationStatus.result;
        return _exploration_status_enum__WEBPACK_IMPORTED_MODULE_11__.ExplorationStatus.idle;
    }
    getLowestEnergyLocation() {
        return _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_7__.LocalStorage.autoExploreLocations.reduce((lowest, place) => Number(place.location.energyRequired) <
            Number(lowest.location.energyRequired)
            ? place
            : lowest);
    }
    getSelectedLocation() {
        let selected = _session_storage_session_storage__WEBPACK_IMPORTED_MODULE_8__.SessionStorage.selectedLocation;
        if (!selected) {
            selected = this.selectLocation();
            _session_storage_session_storage__WEBPACK_IMPORTED_MODULE_8__.SessionStorage.selectedLocation = selected;
        }
        return selected;
    }
    selectLocation() {
        const affordable = _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_7__.LocalStorage.autoExploreLocations.filter(saved => Number(saved.location.energyRequired) <= petEnergy);
        const minimumEnergy = this.getLowestEnergyLocation();
        const notDeadEnd = affordable.filter(place => petEnergy - Number(place.location.energyRequired) >=
            Number(minimumEnergy.location.energyRequired));
        if (notDeadEnd.length)
            return notDeadEnd[Math.floor(Math.random() * notDeadEnd.length)] ?? null;
        const sameEnergy = affordable.filter(place => Number(place.location.energyRequired) === petEnergy);
        if (sameEnergy.length)
            return sameEnergy[Math.floor(Math.random() * sameEnergy.length)] ?? null;
        return affordable[Math.floor(Math.random() * affordable.length)] ?? null;
    }
    async startExploration() {
        const selected = this.getSelectedLocation();
        if (!selected)
            return { exploring: false, selected };
        _console__WEBPACK_IMPORTED_MODULE_4__.Console.info("Exploring", selected);
        // Go to season
        if (selected.region.season &&
            this.getCurrentSeason() !== selected.region.season) {
            await this.clickSeason();
            return { exploring: false, selected };
        }
        // Go to region
        await this.clickRegion(selected);
        // Go to location
        await this.clickLocation(selected);
        await this.clickExplore();
        _session_storage_session_storage__WEBPACK_IMPORTED_MODULE_8__.SessionStorage.selectedLocation = null;
        return { exploring: true, selected };
    }
    /**
     * Wait for up to 10 minutes.
     * @returns whether the exploration is finished.
     */
    async waitExploration(selected) {
        document
            .querySelector(`.minimap[data-mapid="${selected?.region.id ?? currentRegion.id}"]`)
            ?.click();
        let ms = 3 * _duration__WEBPACK_IMPORTED_MODULE_5__.DurationUnit.second;
        if (selected)
            ms += selected.location.timeToExplore * _duration__WEBPACK_IMPORTED_MODULE_5__.DurationUnit.minute;
        else if (timeLeftExploration && timeLeftExploration > 0)
            ms += timeLeftExploration * _duration__WEBPACK_IMPORTED_MODULE_5__.DurationUnit.second;
        else if (!pendingTreasureHuntLocation &&
            document.querySelector("#map-container.pending")) {
            const json = await (0,_ajax_exploration_results__WEBPACK_IMPORTED_MODULE_2__.explorationResults)();
            if (json.result !== _api_result_enum__WEBPACK_IMPORTED_MODULE_3__.Result.success)
                return false;
            const capture = json.data.results.find(result => result.type === "capture");
            if (!capture)
                return false;
            await (0,_ajax_capture_end__WEBPACK_IMPORTED_MODULE_0__.captureEnd)();
            // Reloading is the only possible action if the exploration finished in a
            // different region.
            _console__WEBPACK_IMPORTED_MODULE_4__.Console.error("Reloading because the exploration is in another region.", this.globals);
            await new Promise(resolve => setTimeout(resolve, _duration__WEBPACK_IMPORTED_MODULE_5__.DurationUnit.minute));
            pageLoad("/pet");
            return true;
        }
        if (ms > 10 * _duration__WEBPACK_IMPORTED_MODULE_5__.DurationUnit.minute)
            return false;
        _console__WEBPACK_IMPORTED_MODULE_4__.Console.log(`Waiting for the exploration to end in ${Math.ceil(ms / _duration__WEBPACK_IMPORTED_MODULE_5__.DurationUnit.second)} seconds...`, this.globals);
        await new Promise(resolve => setTimeout(resolve, ms));
        await (0,_ajax_change_region__WEBPACK_IMPORTED_MODULE_1__.changeRegion)(Number(selected?.region.id ?? currentRegion.id));
        if (this.getExplorationStatus() === _exploration_status_enum__WEBPACK_IMPORTED_MODULE_11__.ExplorationStatus.pending &&
            timeLeftExploration &&
            timeLeftExploration < 0) {
            _console__WEBPACK_IMPORTED_MODULE_4__.Console.info("Reloading because the timer is desynchronised.", this.globals);
            await new Promise(resolve => setTimeout(resolve, _duration__WEBPACK_IMPORTED_MODULE_5__.DurationUnit.second));
            pageLoad("/pet");
        }
        return true;
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new ExplorationAction());


/***/ }),

/***/ "./src/takeover/classes/minigame_action.ts":
/*!*************************************************!*\
  !*** ./src/takeover/classes/minigame_action.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _console__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../console */ "./src/console.ts");
/* harmony import */ var _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../local_storage/local_storage */ "./src/local_storage/local_storage.ts");
/* harmony import */ var _minigames_emile__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../minigames/emile */ "./src/minigames/emile.ts");
/* harmony import */ var _minigames_flappy__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../minigames/flappy */ "./src/minigames/flappy.ts");
/* harmony import */ var _minigames_hatchlings__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../minigames/hatchlings */ "./src/minigames/hatchlings.ts");
/* harmony import */ var _minigames_peggle__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../minigames/peggle */ "./src/minigames/peggle.ts");
/* harmony import */ var _session_storage_session_storage__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../session_storage/session_storage */ "./src/session_storage/session_storage.ts");
/* harmony import */ var _session_storage_takeover_action_enum__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../session_storage/takeover_action.enum */ "./src/session_storage/takeover_action.enum.ts");








class MinigameAction {
    key = _session_storage_takeover_action_enum__WEBPACK_IMPORTED_MODULE_7__.TakeoverAction.minigames;
    condition() {
        return _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_1__.LocalStorage.minigames && !_session_storage_session_storage__WEBPACK_IMPORTED_MODULE_6__.SessionStorage.minigamesDone;
    }
    /** Determines if the minigames should be played right now.
     * @returns whether the minigames are currently being played.
     */
    async perform() {
        switch (location.pathname) {
            case "/minigames": {
                await new Promise(resolve => setTimeout(resolve, 750));
                const playing = this.openMinigame(_minigames_peggle__WEBPACK_IMPORTED_MODULE_5__.peggle) ||
                    this.openMinigame(_minigames_flappy__WEBPACK_IMPORTED_MODULE_3__.flappy) ||
                    this.openMinigame(_minigames_hatchlings__WEBPACK_IMPORTED_MODULE_4__.hatchlings);
                if (!playing) {
                    _session_storage_session_storage__WEBPACK_IMPORTED_MODULE_6__.SessionStorage.minigamesDone = true;
                    document
                        .querySelector('.minigames-rules [rel="btn-cancel"]')
                        ?.click();
                }
                return playing;
            }
            case "/minigames/gembomb":
                await (0,_minigames_emile__WEBPACK_IMPORTED_MODULE_2__.playPeggle)();
                break;
            case "/minigames/bubbltemple":
                await (0,_minigames_emile__WEBPACK_IMPORTED_MODULE_2__.playFlappy)();
                break;
            case "/minigames/cocooninpick":
                await (0,_minigames_emile__WEBPACK_IMPORTED_MODULE_2__.playHatchlings)();
                break;
            default:
                pageLoad("/minigames");
                return true;
        }
        pageLoad("/minigames");
        return true;
    }
    /** Click on a minigame's link. @returns whether the minigame was opened. */
    openMinigame(minigame) {
        const start = document.querySelector(minigame.buttonSelector);
        _console__WEBPACK_IMPORTED_MODULE_0__.Console.debug(`${minigame.name}'s button:`, start);
        if (!start)
            return false;
        start.click();
        return true;
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new MinigameAction());


/***/ }),

/***/ "./src/takeover/classes/wait_action.ts":
/*!*********************************************!*\
  !*** ./src/takeover/classes/wait_action.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _console__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../console */ "./src/console.ts");
/* harmony import */ var _session_storage_takeover_action_enum__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../session_storage/takeover_action.enum */ "./src/session_storage/takeover_action.enum.ts");
/* harmony import */ var _action__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./action */ "./src/takeover/classes/action.ts");



class WaitAction extends _action__WEBPACK_IMPORTED_MODULE_2__.Action {
    key = _session_storage_takeover_action_enum__WEBPACK_IMPORTED_MODULE_1__.TakeoverAction.wait;
    condition() {
        return true;
    }
    async perform() {
        _console__WEBPACK_IMPORTED_MODULE_0__.Console.log(`Waiting for 10 minutes...`);
        return new Promise(resolve => setTimeout(() => resolve(false), 10 * 60 * 1000));
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new WaitAction());


/***/ }),

/***/ "./src/takeover/click.ts":
/*!*******************************!*\
  !*** ./src/takeover/click.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "click": () => (/* binding */ click),
/* harmony export */   "clickElement": () => (/* binding */ clickElement),
/* harmony export */   "wait": () => (/* binding */ wait),
/* harmony export */   "waitObserve": () => (/* binding */ waitObserve)
/* harmony export */ });
/** Click on an element after waiting for its selector, hovering it and waiting
 * for its potential animations.
 */
async function click(selector) {
    return new Promise(resolve => {
        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            if (!element)
                return;
            clearInterval(interval);
            void clickElement(element).then(() => resolve(element));
        }, 800);
    });
}
/** Click on an element after hovering it and waiting for possible
 * animations.
 */
async function clickElement(element) {
    return new Promise(resolve => {
        // Some elements don't have their click handlers ready until they're
        // hovered.
        const mouseEvent = document.createEvent("MouseEvent");
        mouseEvent.initEvent("mouseover");
        element.dispatchEvent(mouseEvent);
        setTimeout(() => {
            element.click();
            resolve();
        }, 800);
    });
}
async function wait(selector) {
    return new Promise(resolve => {
        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            if (!element)
                return;
            clearInterval(interval);
            resolve(element);
        }, 800);
    });
}
/**
 * Uses a `MutationObserver` to wait for an `HTMLElement` inside another
 * `HTMLElement`. Timeouts after 2s by default, at which point there's probably
 * a deeper problem going on.
 * @param container The container to observe and find the `HTMLElement` in
 * @param selector The argument for `container.querySelector<T>(selector)`
 * @returns The first element that is a descendant of `container` that matches
 * `selector` or `null` after the `timeout` delay.
 */
async function waitObserve(container, selector, ms = 2000) {
    const promise = new Promise(resolve => {
        const observer = new MutationObserver((_mutations, observer) => setTimeout(() => {
            const element = container.querySelector(selector);
            if (element) {
                observer.disconnect();
                resolve(element);
            }
        }, 1));
        observer.observe(container, { childList: true });
        setTimeout(() => {
            observer.disconnect();
            resolve(container.querySelector(selector));
        }, ms);
    });
    return promise;
}


/***/ }),

/***/ "./src/takeover/exploration_status.enum.ts":
/*!*************************************************!*\
  !*** ./src/takeover/exploration_status.enum.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ExplorationStatus": () => (/* binding */ ExplorationStatus)
/* harmony export */ });
var ExplorationStatus;
(function (ExplorationStatus) {
    ExplorationStatus[ExplorationStatus["idle"] = 0] = "idle";
    ExplorationStatus[ExplorationStatus["result"] = 1] = "result";
    ExplorationStatus[ExplorationStatus["capture"] = 2] = "capture";
    ExplorationStatus[ExplorationStatus["pending"] = 3] = "pending";
})(ExplorationStatus || (ExplorationStatus = {}));


/***/ }),

/***/ "./src/ts_util.ts":
/*!************************!*\
  !*** ./src/ts_util.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isEnum": () => (/* binding */ isEnum)
/* harmony export */ });
function isEnum(value, enumeration) {
    return Object.values(enumeration).includes(value);
}


/***/ }),

/***/ "./src/ui/auctions.ts":
/*!****************************!*\
  !*** ./src/ui/auctions.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "loadAuctions": () => (/* binding */ loadAuctions)
/* harmony export */ });
/* harmony import */ var _i18n_translate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../i18n/translate */ "./src/i18n/translate.ts");
/* harmony import */ var _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../local_storage/local_storage */ "./src/local_storage/local_storage.ts");


function loadAuctions() {
    if (location.pathname !== "/marketplace/auctions")
        return;
    const marketplaceActiveAuctions = document.querySelector("#marketplace-active-auctions");
    if (!marketplaceActiveAuctions)
        return;
    const layout2col = document.querySelector(".marketplace-main-container #layout-2col");
    if (layout2col)
        layout2col.style.overflowX = "visible";
    loadHistory(marketplaceActiveAuctions);
}
function loadHistory(marketplaceActiveAuctions) {
    marketplaceActiveAuctions.querySelector("style")?.remove();
    marketplaceActiveAuctions.querySelector("#purchase-history")?.remove();
    marketplaceActiveAuctions.querySelector("#sale-history")?.remove();
    const template = __webpack_require__(/*! ../templates/html/market_history.html */ "./src/templates/html/market_history.html");
    const history = {
        purchases: _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_1__.LocalStorage.purchases.map(purchase => ({
            ...purchase,
            date: _i18n_translate__WEBPACK_IMPORTED_MODULE_0__.translate.market.auctions.date_time_format.format(new Date(purchase.date)),
        })),
        sales: _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_1__.LocalStorage.sales.map(sale => ({
            ...sale,
            date: _i18n_translate__WEBPACK_IMPORTED_MODULE_0__.translate.market.auctions.date_time_format.format(new Date(sale.date)),
        })),
    };
    marketplaceActiveAuctions.insertAdjacentHTML("beforeend", template.render({ ...history, translate: _i18n_translate__WEBPACK_IMPORTED_MODULE_0__.translate }));
    for (const purchase of document.querySelectorAll("#purchase-history .marketplace-auctions-item")) {
        const itemid = purchase.dataset.itemid;
        purchase.querySelector(".delete-button")?.addEventListener("click", () => {
            _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_1__.LocalStorage.purchases = _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_1__.LocalStorage.purchases.filter(purchase => purchase.itemid !== itemid);
            loadHistory(marketplaceActiveAuctions);
        });
    }
    for (const sale of document.querySelectorAll("#sale-history .marketplace-sales-item")) {
        const icon = sale.querySelector(".abstract-icon img")?.src;
        sale.querySelector(".delete-button")?.addEventListener("click", () => {
            _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_1__.LocalStorage.sales = _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_1__.LocalStorage.sales.filter(sale => sale.icon !== icon);
            loadHistory(marketplaceActiveAuctions);
        });
    }
}


/***/ }),

/***/ "./src/ui/carousel.ts":
/*!****************************!*\
  !*** ./src/ui/carousel.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "loadCarousel": () => (/* binding */ loadCarousel)
/* harmony export */ });
/* harmony import */ var _carousel_carousel_beemoov_annoyances__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../carousel/carousel_beemoov_annoyances */ "./src/carousel/carousel_beemoov_annoyances.ts");
/* harmony import */ var _carousel_carousel_download_face__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../carousel/carousel_download_face */ "./src/carousel/carousel_download_face.ts");
/* harmony import */ var _carousel_carousel_download_guardian__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../carousel/carousel_download_guardian */ "./src/carousel/carousel_download_guardian.ts");
/* harmony import */ var _carousel_carousel_eldarya_enhancements__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../carousel/carousel_eldarya_enhancements */ "./src/carousel/carousel_eldarya_enhancements.ts");
/* harmony import */ var _carousel_carousel_takeover__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../carousel/carousel_takeover */ "./src/carousel/carousel_takeover.ts");
/* harmony import */ var _download_canvas__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../download-canvas */ "./src/download-canvas.ts");
/* harmony import */ var _i18n_translate__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../i18n/translate */ "./src/i18n/translate.ts");
/* harmony import */ var _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../local_storage/local_storage */ "./src/local_storage/local_storage.ts");
/* harmony import */ var _session_storage_session_storage__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../session_storage/session_storage */ "./src/session_storage/session_storage.ts");
/* harmony import */ var _takeover_brain__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../takeover/brain */ "./src/takeover/brain.ts");










function loadCarousel() {
    const carouselInner = document.querySelector("#carousel-inner");
    if (!carouselInner || document.querySelector(".carousel-ee")) {
        return;
    }
    // Import carousel template
    const template = __webpack_require__(/*! ../templates/html/carousel_news.html */ "./src/templates/html/carousel_news.html");
    const contexts = [
        // Intro
        _carousel_carousel_eldarya_enhancements__WEBPACK_IMPORTED_MODULE_3__.carouselEE,
        // Features
        ...((_local_storage_local_storage__WEBPACK_IMPORTED_MODULE_7__.LocalStorage.minigames ||
            _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_7__.LocalStorage.explorations ||
            _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_7__.LocalStorage.market) &&
            _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_7__.LocalStorage.unlocked
            ? [_carousel_carousel_takeover__WEBPACK_IMPORTED_MODULE_4__.carouselTakeover]
            : []),
        _carousel_carousel_download_guardian__WEBPACK_IMPORTED_MODULE_2__.carouselDownloadGuardian,
        _carousel_carousel_download_face__WEBPACK_IMPORTED_MODULE_1__.carouselDownloadFace,
        // Ads
        _carousel_carousel_beemoov_annoyances__WEBPACK_IMPORTED_MODULE_0__.carouselBeemoovAnnoyances,
    ];
    // Add entries to the carousel
    carouselInner.insertAdjacentHTML("beforeend", contexts.map(banner => template.render(banner)).join("\n"));
    // Add links
    for (const carousel of contexts) {
        if (!carousel.href)
            continue;
        const element = carouselInner.querySelector(`#${carousel.id}`);
        if (!element)
            continue;
        element.addEventListener("click", () => {
            if (element.classList.contains("active"))
                open(carousel.href, "_blank");
        });
    }
    // Add click events
    document
        .getElementById(_carousel_carousel_download_face__WEBPACK_IMPORTED_MODULE_1__.carouselDownloadFace.id)
        ?.addEventListener("click", _download_canvas__WEBPACK_IMPORTED_MODULE_5__.downloadFace);
    document
        .getElementById(_carousel_carousel_download_guardian__WEBPACK_IMPORTED_MODULE_2__.carouselDownloadGuardian.id)
        ?.addEventListener("click", _download_canvas__WEBPACK_IMPORTED_MODULE_5__.downloadGuardian);
    const takeoverAnchor = document.getElementById(_carousel_carousel_takeover__WEBPACK_IMPORTED_MODULE_4__.carouselTakeover.id);
    takeoverAnchor?.addEventListener("click", () => {
        (0,_takeover_brain__WEBPACK_IMPORTED_MODULE_9__.toggleTakeover)();
        takeoverTitle(takeoverAnchor);
    });
    if (takeoverAnchor)
        takeoverTitle(takeoverAnchor);
}
function takeoverTitle(takeoverAnchor) {
    const takeoverH4 = takeoverAnchor.querySelector("h4");
    if (takeoverH4) {
        takeoverH4.innerText = _session_storage_session_storage__WEBPACK_IMPORTED_MODULE_8__.SessionStorage.takeover
            ? _i18n_translate__WEBPACK_IMPORTED_MODULE_6__.translate.carousel.takeover.disable_takeover
            : _i18n_translate__WEBPACK_IMPORTED_MODULE_6__.translate.carousel.takeover.enable_takeover;
    }
}


/***/ }),

/***/ "./src/ui/favourites.ts":
/*!******************************!*\
  !*** ./src/ui/favourites.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "loadFakeFavourites": () => (/* binding */ loadFakeFavourites),
/* harmony export */   "loadFavourites": () => (/* binding */ loadFavourites)
/* harmony export */ });
/* harmony import */ var _appearance_fake_favourites__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../appearance/fake_favourites */ "./src/appearance/fake_favourites.ts");
/* harmony import */ var _appearance_favourites_actions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../appearance/favourites_actions */ "./src/appearance/favourites_actions.ts");
/* harmony import */ var _console__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../console */ "./src/console.ts");
/* harmony import */ var _download_canvas__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../download-canvas */ "./src/download-canvas.ts");
/* harmony import */ var _i18n_translate__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../i18n/translate */ "./src/i18n/translate.ts");
/* harmony import */ var _indexed_db_indexed_db__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../indexed_db/indexed_db */ "./src/indexed_db/indexed_db.ts");
/* harmony import */ var _takeover_click__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../takeover/click */ "./src/takeover/click.ts");







function loadFavourites() {
    if (!location.pathname.startsWith("/player/appearance/favorites"))
        return;
    loadFavouritesActions();
    void loadFakeFavourites();
}
function loadFavouritesActions() {
    const actions = document.getElementById("favorites-actions");
    if (!actions || document.querySelector(".favorites-action-ee"))
        return;
    const actionTemplate = __webpack_require__(/*! ../templates/html/favourites_action.html */ "./src/templates/html/favourites_action.html");
    const importAction = {
        id: "import-outfit",
        text: _i18n_translate__WEBPACK_IMPORTED_MODULE_4__.translate.appearance.favourites.buttons["import"],
    };
    const exportAction = {
        id: "export-outfit",
        text: _i18n_translate__WEBPACK_IMPORTED_MODULE_4__.translate.appearance.favourites.buttons["export"],
    };
    const downloadAction = {
        id: "download-outfit",
        text: _i18n_translate__WEBPACK_IMPORTED_MODULE_4__.translate.appearance.favourites.buttons.download,
    };
    actions.insertAdjacentHTML("beforeend", actionTemplate.render(importAction) +
        actionTemplate.render(exportAction) +
        actionTemplate.render(downloadAction));
    document
        .getElementById(importAction.id)
        ?.addEventListener("click", _appearance_favourites_actions__WEBPACK_IMPORTED_MODULE_1__.importOutfit);
    document
        .getElementById(exportAction.id)
        ?.addEventListener("click", _appearance_favourites_actions__WEBPACK_IMPORTED_MODULE_1__.exportPreview);
    document
        .getElementById(downloadAction.id)
        ?.addEventListener("click", _download_canvas__WEBPACK_IMPORTED_MODULE_3__.downloadAppearance);
}
async function loadFakeFavourites() {
    const appearanceItems = document.querySelector("#appearance-items");
    if (!appearanceItems) {
        _console__WEBPACK_IMPORTED_MODULE_2__.Console.error("Couldn't access #appearance-items", appearanceItems);
        return;
    }
    const thumbs = await (0,_takeover_click__WEBPACK_IMPORTED_MODULE_6__.waitObserve)(appearanceItems, "#all-outfit-thumbs .mCSB_container", 3000);
    if (!thumbs) {
        _console__WEBPACK_IMPORTED_MODULE_2__.Console.error("Couldn't access #all-outfit-thumbs", thumbs);
        return;
    }
    const template = __webpack_require__(/*! ../templates/html/outfit_thumbs.html */ "./src/templates/html/outfit_thumbs.html");
    const favourites = await _indexed_db_indexed_db__WEBPACK_IMPORTED_MODULE_5__["default"].getFavouriteOutfits();
    document.querySelector("#ee-outfit-thumbs")?.remove();
    thumbs.insertAdjacentHTML("beforeend", template.render({ outfits: favourites }));
    document
        .querySelector(".ee-available-slot")
        ?.addEventListener("click", () => void (0,_appearance_fake_favourites__WEBPACK_IMPORTED_MODULE_0__.saveFavourite)());
    for (const div of document.querySelectorAll(".ee-outfit-thumb")) {
        div.addEventListener("click", () => {
            const favourite = favourites.find(favourite => favourite.id === Number(div.dataset.arrayIndex));
            if (!favourite)
                return;
            (0,_appearance_fake_favourites__WEBPACK_IMPORTED_MODULE_0__.showFavourite)(favourite);
        });
    }
}


/***/ }),

/***/ "./src/ui/home_content.ts":
/*!********************************!*\
  !*** ./src/ui/home_content.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "loadHomeContent": () => (/* binding */ loadHomeContent)
/* harmony export */ });
/* harmony import */ var _i18n_translate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../i18n/translate */ "./src/i18n/translate.ts");

function loadHomeContent() {
    const homeContentSmalls = document.getElementById("home-content-smalls");
    if (!homeContentSmalls ||
        homeContentSmalls.querySelector(".home-content-small-ee"))
        return;
    // Remove bank
    document.getElementById("home-bank")?.remove();
    // Add forum
    const smallTemplate = __webpack_require__(/*! ../templates/html/home_content_small.html */ "./src/templates/html/home_content_small.html");
    const smallContent = {
        backgroundImage: "/assets/img/minigames/treasurehunt/a48bbc4e4849745ebe6dbcf5313eb3f0.jpg",
        h4: _i18n_translate__WEBPACK_IMPORTED_MODULE_0__.translate.home.forum,
        href: "/forum",
        id: "forum",
    };
    homeContentSmalls.insertAdjacentHTML("beforeend", smallTemplate.render(smallContent));
}


/***/ }),

/***/ "./src/ui/mall.ts":
/*!************************!*\
  !*** ./src/ui/mall.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addToWishlistFlavr": () => (/* binding */ addToWishlistFlavr),
/* harmony export */   "loadMall": () => (/* binding */ loadMall)
/* harmony export */ });
/* harmony import */ var _eldarya_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../eldarya_util */ "./src/eldarya_util.ts");
/* harmony import */ var _i18n_translate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../i18n/translate */ "./src/i18n/translate.ts");
/* harmony import */ var _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../local_storage/local_storage */ "./src/local_storage/local_storage.ts");
/* harmony import */ var _marketplace_enums_rarity_enum__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../marketplace/enums/rarity.enum */ "./src/marketplace/enums/rarity.enum.ts");




function loadMall() {
    if (!location.pathname.startsWith("/mall"))
        return;
    for (const li of document.querySelectorAll("[data-product]"))
        li.addEventListener("click", () => addWishlistButton(li));
}
function addWishlistButton(li) {
    document.querySelector("#add-to-wishlist")?.remove();
    document
        .querySelector("#mall-productDetail-info")
        ?.insertAdjacentHTML("beforeend", "<button id='add-to-wishlist' class='nl-button' style='margin: 20px auto 0; min-width: 200px;'>Add to market wishlist</button>");
    const maxQuantity = li.querySelector(".item-maxQuantity");
    const mallEntry = {
        product: JSON.parse(li.dataset.product),
        icon: (0,_eldarya_util__WEBPACK_IMPORTED_MODULE_0__.trimIcon)(li.querySelector("img.mall-product-icon").src),
        rarity: _marketplace_enums_rarity_enum__WEBPACK_IMPORTED_MODULE_3__.Rarity[(li
            .querySelector(".rarity-marker-common, .rarity-marker-rare, .rarity-marker-epic, .rarity-marker-legendary, .rarity-marker-event")
            ?.className.split("rarity-marker-")[1] ?? "")],
        maxQuantity: maxQuantity ? Number(maxQuantity.innerText) : undefined,
        abstractType: document.querySelector("#mall-menu .tooltip.active .tooltip-content")?.innerText ?? "",
    };
    document
        .querySelector("#add-to-wishlist")
        ?.addEventListener("click", () => addToWishlistFlavr(mallEntry));
}
function addToWishlistFlavr(mallEntry) {
    const template = __webpack_require__(/*! ../templates/html/auto_buy_flavr_mall.html */ "./src/templates/html/auto_buy_flavr_mall.html");
    $.flavr({
        content: template.render({ translate: _i18n_translate__WEBPACK_IMPORTED_MODULE_1__.translate }),
        buttons: {
            close: { style: "close" },
            save: {
                action: () => save(mallEntry),
            },
        },
        dialog: "prompt",
        prompt: {
            value: "",
        },
        onBuild: $container => {
            $container.addClass("new-layout-popup");
            document
                .querySelector(".flavr-prompt")
                ?.addEventListener("keyup", ({ key }) => {
                if (key !== "Enter")
                    return;
                save(mallEntry);
            });
        },
    });
}
function save(mallEntry) {
    const price = Number(document.querySelector(".flavr-prompt")?.value.trim());
    if (!price || price <= 0) {
        $.flavrNotif(_i18n_translate__WEBPACK_IMPORTED_MODULE_1__.translate.market.add_to_wishlist.invalid_price);
        return false;
    }
    const wishlist = _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_2__.LocalStorage.wishlist.filter(wishlistEntry => wishlistEntry.icon !== mallEntry.icon);
    const wished = {
        ...mallEntry,
        ...mallEntry.product,
        price,
    };
    wishlist.push(wished);
    wishlist.sort((a, b) => {
        const typeCompare = a.type.localeCompare(b.type);
        if (typeCompare !== 0)
            return typeCompare;
        const abstractTypeCompare = (a.abstractType ?? "").localeCompare(b.abstractType ?? "");
        if (abstractTypeCompare !== 0)
            return abstractTypeCompare;
        const rarityCompare = Object.keys(_marketplace_enums_rarity_enum__WEBPACK_IMPORTED_MODULE_3__.Rarity).indexOf(a.rarity ?? "") -
            Object.keys(_marketplace_enums_rarity_enum__WEBPACK_IMPORTED_MODULE_3__.Rarity).indexOf(b.rarity ?? "");
        if (rarityCompare !== 0)
            return rarityCompare;
        return a.name.localeCompare(b.name);
    });
    _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_2__.LocalStorage.wishlist = wishlist;
    const template = __webpack_require__(/*! ../templates/html/flavr_notif/icon_message.html */ "./src/templates/html/flavr_notif/icon_message.html");
    $.flavrNotif(template.render({
        ...wished,
        message: _i18n_translate__WEBPACK_IMPORTED_MODULE_1__.translate.market.add_to_wishlist.added_to_wishlist(wished.name, wished.price),
    }));
    return true;
}


/***/ }),

/***/ "./src/ui/market.ts":
/*!**************************!*\
  !*** ./src/ui/market.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "loadMarket": () => (/* binding */ loadMarket)
/* harmony export */ });
/* harmony import */ var _i18n_translate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../i18n/translate */ "./src/i18n/translate.ts");
/* harmony import */ var _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../local_storage/local_storage */ "./src/local_storage/local_storage.ts");
/* harmony import */ var _marketplace_enums_rarity_enum__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../marketplace/enums/rarity.enum */ "./src/marketplace/enums/rarity.enum.ts");
/* harmony import */ var _marketplace_marketplace_handlers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../marketplace/marketplace_handlers */ "./src/marketplace/marketplace_handlers.ts");




let marketObserver;
function loadMarket() {
    marketObserver?.disconnect();
    marketObserver = null;
    if (location.pathname !== "/marketplace")
        return;
    // `.marketplace-search-items` is the container whose HTML content is being
    // replaced on every action.
    const searchItems = document.querySelector(".marketplace-search-items");
    if (!searchItems)
        return;
    marketObserver = new MutationObserver(loadWishlist);
    marketObserver.observe(searchItems, {
        childList: true,
    });
    loadWishlist();
}
function loadWishlist() {
    for (const li of document.querySelectorAll(".marketplace-abstract")) {
        li.addEventListener("click", () => new MutationObserver((_, observer) => {
            const marketEntry = (0,_marketplace_marketplace_handlers__WEBPACK_IMPORTED_MODULE_3__.getItemDetails)(li);
            if (!marketEntry)
                return;
            addWishistButton(marketEntry, observer);
        }).observe(document.getElementById("marketplace-zoom"), {
            childList: true,
        }));
    }
}
function addWishistButton(marketEntry, observer) {
    const buttonsContainer = document.querySelector("#marketplace-itemDetail");
    if (!buttonsContainer)
        return;
    observer?.disconnect();
    hijackBuyButtons(marketEntry);
    document.getElementById("marketplace-itemDetail-info-autobuy")?.remove();
    const buttonTemplate = __webpack_require__(/*! ../templates/html/auto_buy_button.html */ "./src/templates/html/auto_buy_button.html");
    buttonsContainer.insertAdjacentHTML("beforeend", buttonTemplate.render({ translate: _i18n_translate__WEBPACK_IMPORTED_MODULE_0__.translate }));
    buttonsContainer
        .querySelector("#marketplace-itemDetail-info-autobuy")
        ?.addEventListener("click", () => addToWishlistFlavr(marketEntry));
}
function addToWishlistFlavr(marketEntry) {
    const template = __webpack_require__(/*! ../templates/html/auto_buy_flavr.html */ "./src/templates/html/auto_buy_flavr.html");
    $.flavr({
        content: template.render({ translate: _i18n_translate__WEBPACK_IMPORTED_MODULE_0__.translate }),
        buttons: {
            close: { style: "close" },
            save: {
                action: () => save(marketEntry),
            },
        },
        dialog: "prompt",
        prompt: {
            value: "",
        },
        onBuild: $container => {
            $container.addClass("new-layout-popup");
            document
                .querySelector(".flavr-prompt")
                ?.addEventListener("keyup", ({ key }) => {
                if (key !== "Enter")
                    return;
                save(marketEntry);
            });
        },
    });
}
function save(marketEntry) {
    const price = Number(document.querySelector(".flavr-prompt")?.value.trim());
    if (!price || price <= 0) {
        $.flavrNotif(_i18n_translate__WEBPACK_IMPORTED_MODULE_0__.translate.market.add_to_wishlist.invalid_price);
        return false;
    }
    const wishlist = _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_1__.LocalStorage.wishlist.filter(wishlistEntry => wishlistEntry.icon !== marketEntry.icon);
    const wished = { ...marketEntry, price };
    wishlist.push(wished);
    wishlist.sort((a, b) => {
        const typeCompare = a.type.localeCompare(b.type);
        if (typeCompare !== 0)
            return typeCompare;
        const abstractTypeCompare = (a.abstractType ?? "").localeCompare(b.abstractType ?? "");
        if (abstractTypeCompare !== 0)
            return abstractTypeCompare;
        const rarityCompare = Object.keys(_marketplace_enums_rarity_enum__WEBPACK_IMPORTED_MODULE_2__.Rarity).indexOf(a.rarity ?? "") -
            Object.keys(_marketplace_enums_rarity_enum__WEBPACK_IMPORTED_MODULE_2__.Rarity).indexOf(b.rarity ?? "");
        if (rarityCompare !== 0)
            return rarityCompare;
        return a.name.localeCompare(b.name);
    });
    _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_1__.LocalStorage.wishlist = wishlist;
    const template = __webpack_require__(/*! ../templates/html/flavr_notif/icon_message.html */ "./src/templates/html/flavr_notif/icon_message.html");
    $.flavrNotif(template.render({
        ...wished,
        message: _i18n_translate__WEBPACK_IMPORTED_MODULE_0__.translate.market.add_to_wishlist.added_to_wishlist(wished.name, wished.price),
    }));
    return true;
}
function hijackBuyButtons(marketEntry) {
    document
        .querySelector(".marketplace-itemDetail-buy")
        ?.addEventListener("click", () => {
        addPurchase(marketEntry);
    });
}
function addPurchase(marketEntry) {
    _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_1__.LocalStorage.purchases = [
        marketEntry,
        ..._local_storage_local_storage__WEBPACK_IMPORTED_MODULE_1__.LocalStorage.purchases.filter(purchase => purchase.itemid !== marketEntry.itemid),
    ];
}


/***/ }),

/***/ "./src/ui/menu.ts":
/*!************************!*\
  !*** ./src/ui/menu.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "loadMenu": () => (/* binding */ loadMenu)
/* harmony export */ });
/* harmony import */ var _i18n_translate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../i18n/translate */ "./src/i18n/translate.ts");

function loadMenu() {
    const menuInnerRight = document.getElementById("menu-inner-right");
    if (!menuInnerRight || menuInnerRight.querySelector(".main-menu-ee"))
        return;
    // Remove bank
    menuInnerRight.querySelector(".main-menu-bank")?.remove();
    // Add Forum
    const menuTemplate = __webpack_require__(/*! ../templates/html/main_menu.html */ "./src/templates/html/main_menu.html");
    const mainMenuForum = {
        class: "forum",
        href: "/forum",
        text: _i18n_translate__WEBPACK_IMPORTED_MODULE_0__.translate.home.forum,
    };
    menuInnerRight.insertAdjacentHTML("beforeend", menuTemplate.render(mainMenuForum));
}


/***/ }),

/***/ "./src/ui/pet.ts":
/*!***********************!*\
  !*** ./src/ui/pet.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "loadPet": () => (/* binding */ loadPet)
/* harmony export */ });
/* harmony import */ var _console__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../console */ "./src/console.ts");
/* harmony import */ var _pet_exploration__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../pet/exploration */ "./src/pet/exploration.ts");
/* harmony import */ var _pet_exploration_history__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../pet/exploration-history */ "./src/pet/exploration-history.ts");
/* harmony import */ var _pet_mass_mark__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../pet/mass_mark */ "./src/pet/mass_mark.ts");




let petObserver;
function loadExplorations() {
    petObserver?.disconnect();
    petObserver = null;
    /** `.page-main-container` changes background depending on the currently selected region. */
    const mainContainer = document.querySelector(".page-main-container");
    if (!mainContainer)
        return;
    petObserver = new MutationObserver(loadExplorations);
    petObserver.observe(mainContainer, {
        attributes: true,
    });
    (0,_pet_exploration__WEBPACK_IMPORTED_MODULE_1__.loadMarkers)();
}
function loadPet() {
    if (location.pathname !== "/pet")
        return;
    extendRightContainer();
    createButtonRow();
    loadExplorations();
    (0,_pet_exploration_history__WEBPACK_IMPORTED_MODULE_2__.loadExplorationHistory)();
    (0,_pet_mass_mark__WEBPACK_IMPORTED_MODULE_3__.loadMassMark)();
}
function createButtonRow() {
    const closeExplorationButton = document.querySelector("#close-treasure-hunt-interface");
    if (!closeExplorationButton)
        return _console__WEBPACK_IMPORTED_MODULE_0__.Console.error("Couldn't find #close-treasure-hunt-interface.");
    closeExplorationButton.style.display = "inline-block";
    closeExplorationButton.style.marginRight = "0.6em";
    closeExplorationButton.style.position = "relative";
    closeExplorationButton.style.right = "0";
    closeExplorationButton.style.top = "0";
    closeExplorationButton.addEventListener("click", _pet_exploration_history__WEBPACK_IMPORTED_MODULE_2__.onClickPet);
    const row = document.createElement("div");
    row.id = "ee-buttons-row";
    row.insertAdjacentElement("beforeend", closeExplorationButton);
    document
        .querySelector("#right-container-inner")
        ?.insertAdjacentElement("afterbegin", row);
}
function extendRightContainer() {
    const rightContainer = document.getElementById("right-container");
    if (!rightContainer)
        return _console__WEBPACK_IMPORTED_MODULE_0__.Console.warn("Couldn't find #right-container", rightContainer);
    rightContainer.style.height = "40em";
}


/***/ }),

/***/ "./src/ui/profile.ts":
/*!***************************!*\
  !*** ./src/ui/profile.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "loadProfile": () => (/* binding */ loadProfile)
/* harmony export */ });
/* harmony import */ var _download_canvas__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../download-canvas */ "./src/download-canvas.ts");
/* harmony import */ var _i18n_translate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../i18n/translate */ "./src/i18n/translate.ts");
/* harmony import */ var _outfit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../outfit */ "./src/outfit.ts");



function loadProfile() {
    const profileContactActions = document.getElementById("profile-contact-actions");
    if (!profileContactActions ||
        document.querySelector(".profile-contact-action-ee")) {
        return;
    }
    const template = __webpack_require__(/*! ../templates/html/profile_contact_action.html */ "./src/templates/html/profile_contact_action.html");
    const profileActionExport = {
        id: "profile-contact-action-export",
        actionDescription: _i18n_translate__WEBPACK_IMPORTED_MODULE_1__.translate.profile.export_outfit,
    };
    const profileActionDownload = {
        id: "profile-contact-action-download",
        actionDescription: _i18n_translate__WEBPACK_IMPORTED_MODULE_1__.translate.profile.download_outfit,
    };
    // Add entries
    profileContactActions.insertAdjacentHTML("beforeend", template.render(profileActionExport));
    profileContactActions.insertAdjacentHTML("beforeend", template.render(profileActionDownload));
    // Add click events
    document
        .getElementById(profileActionExport.id)
        ?.addEventListener("click", exportProfile);
    document
        .getElementById(profileActionDownload.id)
        ?.addEventListener("click", _download_canvas__WEBPACK_IMPORTED_MODULE_0__.downloadProfile);
}
function exportProfile() {
    const title = document.querySelector("#main-section .section-title");
    const keys = Object.keys(Sacha.Avatar.avatars).filter(key => key.startsWith("#playerProfileAvatar"));
    for (const key of keys) {
        (0,_outfit__WEBPACK_IMPORTED_MODULE_2__.exportOutfit)(key, title?.textContent?.trim());
    }
}


/***/ }),

/***/ "./src/ui/purro_shop.ts":
/*!******************************!*\
  !*** ./src/ui/purro_shop.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "loadPurroShop": () => (/* binding */ loadPurroShop)
/* harmony export */ });
/* harmony import */ var _api_meta__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../api/meta */ "./src/api/meta.ts");
/* harmony import */ var _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../local_storage/local_storage */ "./src/local_storage/local_storage.ts");


/** Shows a Purro'Shop button in the main menu when it's available. */
function loadPurroShop() {
    document.querySelector(".main-menu-purroshop")?.remove();
    // A bug in WebPack prevents using `LocalStorage.meta?.purroshop.status`.
    if (_local_storage_local_storage__WEBPACK_IMPORTED_MODULE_1__.LocalStorage.meta === null ||
        _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_1__.LocalStorage.meta.purroshop.status !== _api_meta__WEBPACK_IMPORTED_MODULE_0__.PurroshopStatus.enabled)
        return;
    const template = __webpack_require__(/*! ../templates/html/main_menu_purroshop.html */ "./src/templates/html/main_menu_purroshop.html");
    document
        .getElementById("menu-inner-left")
        ?.insertAdjacentHTML("afterbegin", template.render({}));
}


/***/ }),

/***/ "./src/ui/settings.ts":
/*!****************************!*\
  !*** ./src/ui/settings.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "loadSettings": () => (/* binding */ loadSettings)
/* harmony export */ });
/* harmony import */ var _download_canvas__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../download-canvas */ "./src/download-canvas.ts");
/* harmony import */ var _i18n_translate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../i18n/translate */ "./src/i18n/translate.ts");
/* harmony import */ var _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../local_storage/local_storage */ "./src/local_storage/local_storage.ts");



/** Creates the UI for the settings in the account page. */
function loadSettings() {
    const accountRight = document.querySelector("#account-right div");
    if (!accountRight || accountRight.querySelector(".account-ee-bloc"))
        return;
    const settings = {
        debug: _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_2__.LocalStorage.debug,
        explorations: _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_2__.LocalStorage.explorations,
        market: _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_2__.LocalStorage.market,
        minigames: _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_2__.LocalStorage.minigames,
        unlocked: _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_2__.LocalStorage.unlocked,
    };
    const settingsTemplate = __webpack_require__(/*! ../templates/html/settings.html */ "./src/templates/html/settings.html");
    const rendered = settingsTemplate.render({ ...settings, translate: _i18n_translate__WEBPACK_IMPORTED_MODULE_1__.translate });
    accountRight.insertAdjacentHTML("beforeend", rendered);
    document.getElementById("ee-debug-enabled")?.addEventListener("click", () => {
        _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_2__.LocalStorage.debug = !_local_storage_local_storage__WEBPACK_IMPORTED_MODULE_2__.LocalStorage.debug;
        reloadSettings();
    });
    if (_local_storage_local_storage__WEBPACK_IMPORTED_MODULE_2__.LocalStorage.unlocked) {
        document
            .getElementById("ee-minigames-enabled")
            ?.addEventListener("click", () => {
            _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_2__.LocalStorage.minigames = !_local_storage_local_storage__WEBPACK_IMPORTED_MODULE_2__.LocalStorage.minigames;
            reloadSettings();
        });
        document
            .getElementById("ee-explorations-enabled")
            ?.addEventListener("click", () => {
            _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_2__.LocalStorage.explorations = !_local_storage_local_storage__WEBPACK_IMPORTED_MODULE_2__.LocalStorage.explorations;
            reloadSettings();
        });
        document
            .getElementById("ee-market-enabled")
            ?.addEventListener("click", () => {
            _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_2__.LocalStorage.market = !_local_storage_local_storage__WEBPACK_IMPORTED_MODULE_2__.LocalStorage.market;
            reloadSettings();
        });
        document
            .getElementById("ee-delete-explorations")
            ?.addEventListener("click", () => {
            _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_2__.LocalStorage.autoExploreLocations = [];
            const template = __webpack_require__(/*! ../templates/html/flavr_notif/icon_message.html */ "./src/templates/html/flavr_notif/icon_message.html");
            const rendered = template.render({
                icon: "/static/img/new-layout/pet/icons/picto_map.png",
                message: _i18n_translate__WEBPACK_IMPORTED_MODULE_1__.translate.account.explorations_deleted,
            });
            $.flavrNotif(rendered);
        });
    }
    document
        .getElementById("ee-import")
        ?.addEventListener("click", importSettings);
    document
        .getElementById("ee-export")
        ?.addEventListener("click", () => void exportSettings());
    document
        .getElementById("ee-reset")
        ?.addEventListener("click", confirmResetSettings);
}
function reloadSettings() {
    document.querySelector(".account-ee-bloc")?.remove();
    loadSettings();
}
function importSettings() {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "application/json");
    input.click();
    input.addEventListener("input", event => {
        if (!event.target)
            return;
        const files = event.target.files;
        if (!files)
            return;
        const file = files[0];
        if (!file)
            return;
        void file.text().then(async (value) => {
            if (!value)
                return;
            const parsed = JSON.parse(value);
            await _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_2__.LocalStorage.setSettings(parsed);
            reloadSettings();
            $.flavrNotif(_i18n_translate__WEBPACK_IMPORTED_MODULE_1__.translate.account.imported);
        });
    });
}
async function exportSettings() {
    const href = "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(await _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_2__.LocalStorage.getSettings(), null, 2));
    const a = document.createElement("a");
    a.setAttribute("href", href);
    a.setAttribute("download", `${(0,_download_canvas__WEBPACK_IMPORTED_MODULE_0__.getName)() ?? "eldarya-enhancements"}-settings.json`);
    a.click();
}
function confirmResetSettings() {
    const template = __webpack_require__(/*! ../templates/html/confirm_reset_settings.html */ "./src/templates/html/confirm_reset_settings.html");
    const rendered = template.render({ translate: _i18n_translate__WEBPACK_IMPORTED_MODULE_1__.translate });
    $.flavr({
        content: rendered,
        dialog: "confirm",
        buttons: {
            close: { style: "close" },
            cancel: {
                text: _i18n_translate__WEBPACK_IMPORTED_MODULE_1__.translate.account.cancel,
                action: () => true,
            },
            confirm: {
                text: _i18n_translate__WEBPACK_IMPORTED_MODULE_1__.translate.account.confirm,
                action: () => {
                    void resetSettings();
                    return true;
                },
            },
        },
        onBuild: $container => {
            $container.addClass("new-layout-popup vacation");
        },
    });
}
async function resetSettings() {
    await _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_2__.LocalStorage.resetSettings();
    pageLoad(location.pathname);
}


/***/ }),

/***/ "./src/ui/top_bar.ts":
/*!***************************!*\
  !*** ./src/ui/top_bar.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "loadTopBar": () => (/* binding */ loadTopBar)
/* harmony export */ });
/* harmony import */ var _i18n_translate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../i18n/translate */ "./src/i18n/translate.ts");
/* harmony import */ var _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../local_storage/local_storage */ "./src/local_storage/local_storage.ts");
/* harmony import */ var _session_storage_session_storage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../session_storage/session_storage */ "./src/session_storage/session_storage.ts");
/* harmony import */ var _takeover_brain__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../takeover/brain */ "./src/takeover/brain.ts");




function loadTopBar() {
    const headerRight = document.getElementById("header-right");
    if (!headerRight)
        return;
    const headerTakeover = headerRight.querySelector("#header-takeover");
    if (headerTakeover)
        headerTakeover.remove();
    else
        loadLinks();
    if ((_local_storage_local_storage__WEBPACK_IMPORTED_MODULE_1__.LocalStorage.minigames ||
        _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_1__.LocalStorage.explorations ||
        _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_1__.LocalStorage.market) &&
        _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_1__.LocalStorage.unlocked) {
        const template = __webpack_require__(/*! ../templates/html/header_takeover.html */ "./src/templates/html/header_takeover.html");
        headerRight.insertAdjacentHTML("afterbegin", template.render({ takeover: _session_storage_session_storage__WEBPACK_IMPORTED_MODULE_2__.SessionStorage.takeover, translate: _i18n_translate__WEBPACK_IMPORTED_MODULE_0__.translate }));
        headerRight
            .querySelector("#header-takeover")
            ?.addEventListener("click", _takeover_brain__WEBPACK_IMPORTED_MODULE_3__.toggleTakeover);
    }
}
function loadLinks() {
    const headerProfile = document.getElementById("header-profile")?.firstChild;
    if (headerProfile?.textContent) {
        const a = document.createElement("a");
        a.href = "/player/profile";
        a.style.color = "var(--text-color)";
        a.style.fontFamily = '"Alegreya Sans", sans-serif';
        a.style.fontWeight = "unset";
        a.textContent = headerProfile.textContent.trim();
        const p = document.createElement("p");
        p.insertAdjacentElement("beforeend", a);
        headerProfile.replaceWith(p);
    }
    const avatarTitle = document.querySelector("#avatar-menu-container-outer>p");
    if (avatarTitle?.textContent)
        avatarTitle.innerHTML = `<a href="/player/profile" style="color: #FFFFFF; font-size: 23px; font-weight: 900; text-transform: uppercase;">${avatarTitle.textContent.trim()}</a>`;
    document
        .querySelector("#avatar-menu-container>canvas")
        ?.addEventListener("click", () => pageLoad("/player/appearance"));
}


/***/ }),

/***/ "./src/ui/wishlist.ts":
/*!****************************!*\
  !*** ./src/ui/wishlist.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "loadWishlist": () => (/* binding */ loadWishlist)
/* harmony export */ });
/* harmony import */ var _console__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../console */ "./src/console.ts");
/* harmony import */ var _i18n_translate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../i18n/translate */ "./src/i18n/translate.ts");
/* harmony import */ var _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../local_storage/local_storage */ "./src/local_storage/local_storage.ts");



function loadWishlist() {
    const marketplaceMenu = document.getElementById("marketplace-menu");
    if (!marketplaceMenu)
        return;
    if (!marketplaceMenu.querySelector("#wishlist-button")) {
        for (const a of marketplaceMenu.querySelectorAll("a")) {
            a.addEventListener("click", () => pageLoad(a.href, undefined, undefined, undefined, true));
        }
    }
    marketplaceMenu.querySelector("#wishlist-button")?.remove();
    const wishlistButtonTemplate = __webpack_require__(/*! ../templates/html/wishlist_button.html */ "./src/templates/html/wishlist_button.html");
    marketplaceMenu.insertAdjacentHTML("beforeend", wishlistButtonTemplate.render({ translate: _i18n_translate__WEBPACK_IMPORTED_MODULE_1__.translate }));
    marketplaceMenu
        .querySelector("#wishlist-button")
        ?.addEventListener("click", insertWishlist);
}
function insertWishlist() {
    // Assistance
    const assistance = document.querySelector(".marketplace-assistance");
    if (assistance)
        assistance.innerHTML = _i18n_translate__WEBPACK_IMPORTED_MODULE_1__.translate.market.wishlist.assistance;
    const button = document.querySelector("#wishlist-button");
    if (!button)
        return _console__WEBPACK_IMPORTED_MODULE_0__.Console.error("Wishlist button not found", button);
    // Menu
    document
        .querySelector("#marketplace-menu .active")
        ?.classList.remove("active");
    button.classList.add("active");
    // Filters
    const filters = document.getElementById("marketplace-filters");
    if (filters)
        filters.innerHTML = "";
    // Content
    const wishlistTemplate = __webpack_require__(/*! ../templates/html/wishlist_settings.html */ "./src/templates/html/wishlist_settings.html");
    const container = document.querySelector(".marketplace-container") ??
        document.getElementById("marketplace-active-auctions") ??
        document.getElementById("marketplace-itemsForSale");
    if (!container)
        return _console__WEBPACK_IMPORTED_MODULE_0__.Console.error("The wishlist cannot be placed", container);
    const wishlistContext = {
        wishlist: _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_2__.LocalStorage.wishlist,
    };
    container.innerHTML = wishlistTemplate.render({
        ...wishlistContext,
        translate: _i18n_translate__WEBPACK_IMPORTED_MODULE_1__.translate,
    });
    // Buttons
    for (const tr of container.querySelectorAll("tr")) {
        const icon = tr.dataset.icon;
        if (!icon)
            continue;
        // Reset status
        const reset = tr.querySelector(".reset-item-status");
        if (reset)
            reset.addEventListener("click", () => {
                resetStatus(icon);
                insertWishlist();
            });
        // Delete item from wishlist
        const deleteButton = tr.querySelector(".delete-wishlist-item");
        if (deleteButton)
            deleteButton.addEventListener("click", () => {
                deleteItem(icon);
                insertWishlist();
            });
        // Change price
        const editPrice = tr.querySelector(".edit-price");
        if (editPrice)
            editPrice.addEventListener("click", () => void changePrice(icon).then(insertWishlist));
    }
    // Reset statuses
    document.querySelector(".reset-all")?.addEventListener("click", resetStatuses);
}
function resetStatus(icon) {
    const wishlist = _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_2__.LocalStorage.wishlist;
    const index = wishlist.findIndex(item => item.icon === icon);
    const entry = wishlist[index];
    if (!entry)
        return;
    delete entry.error;
    _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_2__.LocalStorage.wishlist = [
        ...wishlist.slice(undefined, index),
        entry,
        ...wishlist.slice(index + 1, undefined),
    ];
}
function deleteItem(icon) {
    _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_2__.LocalStorage.wishlist = _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_2__.LocalStorage.wishlist.filter(item => item.icon !== icon);
}
async function changePrice(icon) {
    const template = __webpack_require__(/*! ../templates/html/change_price_flavr.html */ "./src/templates/html/change_price_flavr.html");
    const wishlist = _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_2__.LocalStorage.wishlist;
    const index = wishlist.findIndex(item => item.icon === icon);
    const entry = wishlist[index];
    if (!entry)
        return;
    return new Promise(resolve => {
        $.flavr({
            content: template.render({ translate: _i18n_translate__WEBPACK_IMPORTED_MODULE_1__.translate }),
            dialog: "prompt",
            prompt: {
                value: entry.price.toString(),
            },
            buttons: {
                close: {
                    style: "close",
                    action: () => {
                        resolve();
                        return true;
                    },
                },
                save: {
                    action: () => save(icon, resolve),
                },
            },
            onBuild: $container => {
                $container.addClass("new-layout-popup");
                document
                    .querySelector(".flavr-prompt")
                    ?.addEventListener("keyup", ({ key }) => {
                    if (key !== "Enter")
                        return;
                    save(icon, resolve);
                });
            },
        });
    });
}
function save(icon, resolve) {
    const wishlist = _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_2__.LocalStorage.wishlist;
    const index = wishlist.findIndex(item => item.icon === icon);
    const entry = wishlist[index];
    if (!entry)
        return false;
    const price = Number(document.querySelector(".flavr-prompt")?.value.trim());
    if (!price || price <= 0) {
        $.flavrNotif(_i18n_translate__WEBPACK_IMPORTED_MODULE_1__.translate.market.change_price.invalid_price);
        return false;
    }
    entry.price = price;
    _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_2__.LocalStorage.wishlist = [
        ...wishlist.slice(undefined, index),
        entry,
        ...wishlist.slice(index + 1, undefined),
    ];
    const template = __webpack_require__(/*! ../templates/html/flavr_notif/icon_message.html */ "./src/templates/html/flavr_notif/icon_message.html");
    $.flavrNotif(template.render({
        ...entry,
        message: _i18n_translate__WEBPACK_IMPORTED_MODULE_1__.translate.market.change_price.changed_price(entry.name, entry.price),
    }));
    resolve();
    return true;
}
function resetStatuses() {
    _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_2__.LocalStorage.wishlist = _local_storage_local_storage__WEBPACK_IMPORTED_MODULE_2__.LocalStorage.wishlist.map(item => {
        delete item.error;
        return item;
    });
    insertWishlist();
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _appearance_dressing_experience__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./appearance/dressing_experience */ "./src/appearance/dressing_experience.ts");
/* harmony import */ var _cheat_codes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./cheat_codes */ "./src/cheat_codes.ts");
/* harmony import */ var _console__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./console */ "./src/console.ts");
/* harmony import */ var _i18n_translate__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./i18n/translate */ "./src/i18n/translate.ts");
/* harmony import */ var _migrate__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./migrate */ "./src/migrate.ts");
/* harmony import */ var _takeover_brain__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./takeover/brain */ "./src/takeover/brain.ts");
/* harmony import */ var _ui_auctions__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./ui/auctions */ "./src/ui/auctions.ts");
/* harmony import */ var _ui_carousel__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./ui/carousel */ "./src/ui/carousel.ts");
/* harmony import */ var _ui_favourites__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./ui/favourites */ "./src/ui/favourites.ts");
/* harmony import */ var _ui_home_content__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./ui/home_content */ "./src/ui/home_content.ts");
/* harmony import */ var _ui_mall__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./ui/mall */ "./src/ui/mall.ts");
/* harmony import */ var _ui_market__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./ui/market */ "./src/ui/market.ts");
/* harmony import */ var _ui_menu__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./ui/menu */ "./src/ui/menu.ts");
/* harmony import */ var _ui_pet__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./ui/pet */ "./src/ui/pet.ts");
/* harmony import */ var _ui_profile__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./ui/profile */ "./src/ui/profile.ts");
/* harmony import */ var _ui_purro_shop__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./ui/purro_shop */ "./src/ui/purro_shop.ts");
/* harmony import */ var _ui_settings__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./ui/settings */ "./src/ui/settings.ts");
/* harmony import */ var _ui_top_bar__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./ui/top_bar */ "./src/ui/top_bar.ts");
/* harmony import */ var _ui_wishlist__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./ui/wishlist */ "./src/ui/wishlist.ts");



















// loadJS("https://unpkg.com/hogan.js/dist/template-3.0.2.min.js", true);
function load() {
    const container = document.getElementById("container");
    if (!container) {
        $.flavrNotif(_i18n_translate__WEBPACK_IMPORTED_MODULE_3__.translate.error.longLoading);
        _console__WEBPACK_IMPORTED_MODULE_2__.Console.error("#container couldn't be found:", container);
        return void setTimeout(load, 10_000);
    }
    (0,_migrate__WEBPACK_IMPORTED_MODULE_4__.migrate)();
    loadUI();
    observe();
    _console__WEBPACK_IMPORTED_MODULE_2__.Console.log(`${GM.info.script.name} v${GM.info.script.version} loaded.`);
    (0,_takeover_brain__WEBPACK_IMPORTED_MODULE_5__.loadTakeover)();
}
function loadUI() {
    (0,_ui_menu__WEBPACK_IMPORTED_MODULE_12__.loadMenu)();
    (0,_ui_carousel__WEBPACK_IMPORTED_MODULE_7__.loadCarousel)();
    (0,_ui_home_content__WEBPACK_IMPORTED_MODULE_9__.loadHomeContent)();
    (0,_ui_favourites__WEBPACK_IMPORTED_MODULE_8__.loadFavourites)();
    (0,_ui_profile__WEBPACK_IMPORTED_MODULE_14__.loadProfile)();
    (0,_ui_pet__WEBPACK_IMPORTED_MODULE_13__.loadPet)();
    (0,_ui_market__WEBPACK_IMPORTED_MODULE_11__.loadMarket)();
    (0,_ui_wishlist__WEBPACK_IMPORTED_MODULE_18__.loadWishlist)();
    (0,_ui_top_bar__WEBPACK_IMPORTED_MODULE_17__.loadTopBar)();
    (0,_ui_auctions__WEBPACK_IMPORTED_MODULE_6__.loadAuctions)();
    (0,_ui_purro_shop__WEBPACK_IMPORTED_MODULE_15__.loadPurroShop)();
    (0,_ui_mall__WEBPACK_IMPORTED_MODULE_10__.loadMall)();
    (0,_cheat_codes__WEBPACK_IMPORTED_MODULE_1__.loadCheatCodes)();
    (0,_ui_settings__WEBPACK_IMPORTED_MODULE_16__.loadSettings)();
    // Eldarya is crashing when opening groups.
    // TODO: Handle errors and stop the loading process.
    void (0,_appearance_dressing_experience__WEBPACK_IMPORTED_MODULE_0__.loadDressingExperience)();
}
function observe() {
    const container = document.getElementById("container");
    new MutationObserver(reload).observe(container, { childList: true });
}
function reload() {
    loadUI();
    (0,_takeover_brain__WEBPACK_IMPORTED_MODULE_5__.loadTakeover)();
}
_console__WEBPACK_IMPORTED_MODULE_2__.Console.log("Loading...");
if (document.readyState === "complete")
    load();
else
    window.addEventListener("load", () => load());

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxkYXJ5YS1lbmhhbmNlbWVudHMudXNlci5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzREFBc0QsbUJBQW1CO0FBQ3pFO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyxvQkFBb0I7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsb0JBQW9CO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGtCQUFrQjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0MsWUFBWTtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBLGdDQUFnQyxZQUFZO0FBQzVDO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkMsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFK1M7Ozs7Ozs7Ozs7O0FDbGIvUztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQixrQkFBa0I7O0FBRWxCO0FBQ0E7QUFDQSxxQkFBcUIsaUNBQWlDO0FBQ3REO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsOEJBQThCLG1CQUFtQjtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxzQ0FBc0MsbUJBQW1CO0FBQ3pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1IscUJBQXFCLFNBQVM7QUFDOUI7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxnQkFBZ0IsU0FBUztBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQSx1QkFBdUI7QUFDdkIscUZBQXFGO0FBQ3JGO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQjtBQUMzQiwyQkFBMkI7QUFDM0I7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxpREFBaUQ7QUFDakQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsb0NBQW9DLE9BQU87QUFDM0M7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHdCQUF3Qjs7QUFFeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHFDQUFxQyxPQUFPO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHFDQUFxQyxPQUFPO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EseURBQXlELGlCQUFpQjtBQUMxRTtBQUNBLGNBQWMseUJBQXlCO0FBQ3ZDOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QyxpR0FBaUc7QUFDMUk7QUFDQSx1QkFBdUIsMkJBQTJCO0FBQ2xEOztBQUVBO0FBQ0EsYUFBYSx5QkFBeUIsc0NBQXNDLHFDQUFxQztBQUNqSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0Isa0JBQWtCO0FBQ3RDOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsdUJBQXVCLGFBQWEsMEJBQTBCO0FBQzlEOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx5QkFBeUIsUUFBUTtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QjtBQUM3QixzRkFBc0Y7QUFDdEY7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxxR0FBcUc7QUFDckcscURBQXFEO0FBQ3JEO0FBQ0Esd0JBQXdCLEVBQUUsU0FBUztBQUNuQyxLQUFLOztBQUVMO0FBQ0EsMEdBQTBHO0FBQzFHO0FBQ0EseUJBQXlCO0FBQ3pCLEtBQUs7O0FBRUw7QUFDQTtBQUNBLGlCQUFpQixZQUFZLG9CQUFvQjtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSxpQkFBaUIsUUFBUTtBQUN6QjtBQUNBO0FBQ0E7QUFDQSw0REFBNEQ7QUFDNUQ7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0EsNkZBQTZGO0FBQzdGLEtBQUs7O0FBRUw7QUFDQTtBQUNBLEtBQUs7O0FBRUwsTUFBTTs7QUFFTjtBQUNBOztBQUVBO0FBQ0EsMkZBQTJGO0FBQzNGOztBQUVBO0FBQ0EsMkJBQTJCO0FBQzNCOztBQUVBO0FBQ0E7QUFDQSx5Q0FBeUMsT0FBTztBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLEVBQUUsS0FBOEIsYUFBYSxDQUFLOzs7Ozs7Ozs7OztBQ3RhbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxZQUFZLG1CQUFPLENBQUMsNkZBQVk7QUFDaEMsaUJBQWlCLDZIQUE4QjtBQUMvQztBQUNBOzs7Ozs7Ozs7OztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDhDQUE4QyxZQUFZOztBQUUxRDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSw4Q0FBOEM7QUFDOUMsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHNCQUFzQixpQkFBaUI7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFFBQVE7QUFDUix3QkFBd0Isa0JBQWtCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsbUNBQW1DLFFBQVE7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLHFCQUFxQixnQkFBZ0I7O0FBRXJDLHFCQUFxQixrQkFBa0IsZUFBZSxXQUFXOztBQUVqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEI7QUFDNUI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCLDJCQUEyQjtBQUMzQiwyQkFBMkI7QUFDM0IsOEJBQThCO0FBQzlCLCtCQUErQjtBQUMvQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxDQUFDLEVBQUUsS0FBOEIsYUFBYSxDQUFLOzs7Ozs7Ozs7OztBQ3BWbkQsUUFBUSxtQkFBTyxDQUFDLHdGQUFVO0FBQzFCLDhCQUE4Qix3QkFBd0IseUJBQXlCLFdBQVcsYUFBYSxXQUFXLGNBQWMsK0JBQStCLDhCQUE4QixVQUFVLGNBQWMsd0NBQXdDLDZCQUE2QixVQUFVLGNBQWMsd0JBQXdCLDhCQUE4QixVQUFVLGNBQWMsc0JBQXNCLDRCQUE0QixVQUFVLGNBQWMsd0JBQXdCLDhCQUE4QixVQUFVLGNBQWMsNEJBQTRCLGtDQUFrQyxVQUFVLGNBQWMsU0FBUyxjQUFjLHFDQUFxQyw4QkFBOEIsaUJBQWlCLGNBQWMsb0RBQW9ELDRCQUE0QixhQUFhLGNBQWMsYUFBYSxVQUFVLGdCQUFnQixhQUFhLGFBQWEsaUNBQWlDLFFBQVEsc0NBQXNDLE9BQU8sc0JBQXNCLFFBQVEsb0JBQW9CLE1BQU0sc0JBQXNCLFFBQVEsMEJBQTBCLFlBQVksc0NBQXNDLFFBQVEseURBQXlELE1BQU0sb0JBQW9CLFdBQVc7Ozs7Ozs7Ozs7QUNEanZDLFFBQVEsbUJBQU8sQ0FBQyx3RkFBVTtBQUMxQiw4QkFBOEIsd0JBQXdCLHlCQUF5QixXQUFXLGFBQWEsWUFBWSxjQUFjLDRCQUE0QixjQUFjLG9EQUFvRCxjQUFjLDBCQUEwQixnQ0FBZ0MsVUFBVSxjQUFjLDRCQUE0QixrQ0FBa0MsVUFBVSxjQUFjLFNBQVMsY0FBYyxpQkFBaUIsY0FBYyxvQkFBb0IsR0FBRyxjQUFjLGlDQUFpQyxHQUFHLGNBQWMsaUNBQWlDLEdBQUcsY0FBYyxVQUFVLEdBQUcsY0FBYyxrQkFBa0IsY0FBYyxhQUFhLGNBQWMsMkNBQTJDLGNBQWMsMkJBQTJCLGNBQWMscURBQXFELGNBQWMsV0FBVyxjQUFjLFlBQVksNkJBQTZCLGNBQWMsZUFBZSxVQUFVLGNBQWMsdUJBQXVCLGNBQWMsOERBQThELGNBQWMsc0RBQXNELFVBQVUsY0FBYyx5REFBeUQsVUFBVSxjQUFjLDREQUE0RCxjQUFjLDZEQUE2RCxjQUFjLHdEQUF3RCxjQUFjLDBEQUEwRCxjQUFjLGdCQUFnQiw0REFBNEQsY0FBYyxvQkFBb0IsY0FBYywyREFBMkQsY0FBYyxnQkFBZ0IsNkRBQTZELGNBQWMsb0JBQW9CLGNBQWMsa0JBQWtCLGNBQWMsZ0JBQWdCLGNBQWMsY0FBYyxVQUFVLGdCQUFnQixhQUFhLGFBQWEsaUdBQWlHLFVBQVUsMEJBQTBCLFlBQVksaUNBQWlDLDhCQUE4Qiw4QkFBOEIsT0FBTywwSUFBMEksUUFBUSwwWkFBMFosc0NBQXNDLCtFQUErRSx1Q0FBdUMsb0RBQW9ELFdBQVc7Ozs7Ozs7Ozs7QUNEdjdGLFFBQVEsbUJBQU8sQ0FBQyx3RkFBVTtBQUMxQiw4QkFBOEIsd0JBQXdCLHlCQUF5QixXQUFXLGFBQWEsWUFBWSxjQUFjLHNDQUFzQyw2QkFBNkIsVUFBVSxjQUFjLDZDQUE2QyxjQUFjLDRCQUE0QixrQ0FBa0MsVUFBVSxjQUFjLDBCQUEwQixnQ0FBZ0MsVUFBVSxjQUFjLFNBQVMsY0FBYyw4Q0FBOEMsY0FBYyxZQUFZLDZCQUE2QixjQUFjLGVBQWUsY0FBYyxjQUFjLFVBQVUsZ0JBQWdCLGFBQWEsYUFBYSx5Q0FBeUMsT0FBTyxpRUFBaUUsWUFBWSx3QkFBd0IsVUFBVSxzREFBc0QsUUFBUSx5QkFBeUIsV0FBVzs7Ozs7Ozs7OztBQ0R6NkIsUUFBUSxtQkFBTyxDQUFDLHdGQUFVO0FBQzFCLDhCQUE4Qix3QkFBd0IseUJBQXlCLFdBQVcsYUFBYSxZQUFZLGNBQWMsb0RBQW9ELGNBQWMsbUNBQW1DLHNCQUFzQixjQUFjLFNBQVMsY0FBYyxtQ0FBbUMsOERBQThELGNBQWMsY0FBYyxjQUFjLFVBQVUsZ0JBQWdCLGFBQWEsYUFBYSxxRkFBcUYscURBQXFELHdDQUF3QyxzQkFBc0IsV0FBVzs7Ozs7Ozs7OztBQ0RuckIsUUFBUSxtQkFBTyxDQUFDLHdGQUFVO0FBQzFCLDhCQUE4Qix3QkFBd0IseUJBQXlCLFdBQVcsYUFBYSxZQUFZLDhEQUE4RCxhQUFhLGNBQWMsV0FBVyw2REFBNkQsWUFBWSxVQUFVLGdCQUFnQixhQUFhLGFBQWEsU0FBUyx3Q0FBd0MsWUFBWSx1Q0FBdUMsWUFBWSxXQUFXOzs7Ozs7Ozs7O0FDRC9jLFFBQVEsbUJBQU8sQ0FBQyx3RkFBVTtBQUMxQiw4QkFBOEIsd0JBQXdCLHlCQUF5QixXQUFXLGFBQWEsWUFBWSw0REFBNEQsYUFBYSxjQUFjLFdBQVcsMkRBQTJELFlBQVksY0FBYyx5Q0FBeUMsMkRBQTJELGlCQUFpQixVQUFVLGdCQUFnQixhQUFhLGFBQWEsU0FBUyxzQ0FBc0MsWUFBWSxxQ0FBcUMseUNBQXlDLHFDQUFxQyxpQkFBaUIsV0FBVzs7Ozs7Ozs7OztBQ0Q3cEIsUUFBUSxtQkFBTyxDQUFDLHdGQUFVO0FBQzFCLDhCQUE4Qix3QkFBd0IseUJBQXlCLFdBQVcsYUFBYSxlQUFlLGNBQWMsb0NBQW9DLGNBQWMsNEJBQTRCLDZDQUE2QyxJQUFJLHlCQUF5QixlQUFlLEVBQUUsU0FBUyxVQUFVLGNBQWMsb0JBQW9CLGtDQUFrQyxVQUFVLGNBQWMsdUJBQXVCLGdDQUFnQyxVQUFVLGNBQWMsU0FBUyxjQUFjLFVBQVUsa0RBQWtELGNBQWMsaUJBQWlCLFVBQVUsZ0JBQWdCLGFBQWEsYUFBYSxnRUFBZ0UsU0FBUyxRQUFRLFNBQVMsa0JBQWtCLFlBQVkscUJBQXFCLFVBQVUsV0FBVyw0QkFBNEIsbUJBQW1CLFdBQVc7Ozs7Ozs7Ozs7QUNENzJCLFFBQVEsbUJBQU8sQ0FBQyx3RkFBVTtBQUMxQiw4QkFBOEIsd0JBQXdCLHlCQUF5QixXQUFXLGFBQWEsVUFBVSxjQUFjLGVBQWUsMEJBQTBCLFVBQVUsY0FBYyw2Q0FBNkMsY0FBYyxtQkFBbUIsY0FBYyx3Q0FBd0MsdUNBQXVDLFdBQVcsY0FBYyxTQUFTLGNBQWMsZUFBZSxjQUFjLGdCQUFnQiwwQkFBMEIsYUFBYSxjQUFjLGdCQUFnQiwwQkFBMEIsYUFBYSxjQUFjLGVBQWUseUJBQXlCLFlBQVksY0FBYyxnQkFBZ0IsY0FBYyxZQUFZLFVBQVUsZ0JBQWdCLGFBQWEsYUFBYSxnQkFBZ0IsSUFBSSwwRkFBMEYsaUJBQWlCLDJCQUEyQixJQUFJLGlCQUFpQixJQUFJLGdCQUFnQixHQUFHLDRCQUE0QixXQUFXOzs7Ozs7Ozs7O0FDRC84QixRQUFRLG1CQUFPLENBQUMsd0ZBQVU7QUFDMUIsOEJBQThCLHdCQUF3Qix5QkFBeUIsV0FBVyxhQUFhLFlBQVksMkRBQTJELGFBQWEsY0FBYyxXQUFXLDBEQUEwRCxZQUFZLFVBQVUsZ0JBQWdCLGFBQWEsYUFBYSxTQUFTLHFDQUFxQyxZQUFZLG9DQUFvQyxZQUFZLFdBQVc7Ozs7Ozs7Ozs7QUNEbmMsUUFBUSxtQkFBTyxDQUFDLHdGQUFVO0FBQzFCLDhCQUE4Qix3QkFBd0IseUJBQXlCLFdBQVcsYUFBYSxZQUFZLDZEQUE2RCxhQUFhLGNBQWMsV0FBVywrREFBK0QsWUFBWSxVQUFVLGdCQUFnQixhQUFhLGFBQWEsU0FBUyx1Q0FBdUMsYUFBYSwwQ0FBMEMsWUFBWSxXQUFXOzs7Ozs7Ozs7O0FDRG5kLFFBQVEsbUJBQU8sQ0FBQyx3RkFBVTtBQUMxQiw4QkFBOEIsd0JBQXdCLHlCQUF5QixXQUFXLGFBQWEsWUFBWSx5RUFBeUUsYUFBYSxVQUFVLGNBQWMsV0FBVyxpRkFBaUYsWUFBWSxVQUFVLGNBQWMsY0FBYyxVQUFVLGNBQWMsV0FBVyxnRkFBZ0YsWUFBWSxVQUFVLGNBQWMsY0FBYyxjQUFjLDRCQUE0QixjQUFjLDBCQUEwQixjQUFjLHlCQUF5QixjQUFjLHdCQUF3QiwrRUFBK0UsVUFBVSxjQUFjLFVBQVUsVUFBVSxnQkFBZ0IsYUFBYSxhQUFhLFNBQVMsbURBQW1ELGVBQWUsNERBQTRELHdCQUF3QiwyREFBMkQsK0ZBQStGLHlEQUF5RCxjQUFjLFdBQVc7Ozs7Ozs7Ozs7QUNEbnVDLFFBQVEsbUJBQU8sQ0FBQyx3RkFBVTtBQUMxQiw4QkFBOEIsd0JBQXdCLHlCQUF5QixXQUFXLGFBQWEsNERBQTRELGNBQWMsaUJBQWlCLGNBQWMsMkJBQTJCLEdBQUcsY0FBYyw4QkFBOEIsR0FBRyxjQUFjLFVBQVUsR0FBRyxVQUFVLGNBQWMsMEJBQTBCLEdBQUcsY0FBYyw2QkFBNkIsR0FBRyxjQUFjLFVBQVUsR0FBRyxVQUFVLGNBQWMscUJBQXFCLEdBQUcsY0FBYyxxQ0FBcUMsR0FBRyxjQUFjLDhCQUE4QixHQUFHLGNBQWMsNEJBQTRCLEdBQUcsY0FBYyx1QkFBdUIsR0FBRyxjQUFjLDJCQUEyQixHQUFHLGNBQWMsNkJBQTZCLEdBQUcsY0FBYyx3QkFBd0IsR0FBRyxjQUFjLDZCQUE2QixHQUFHLGNBQWMsc0JBQXNCLEdBQUcsY0FBYyw4QkFBOEIsR0FBRyxjQUFjLHVCQUF1QixHQUFHLGNBQWMsVUFBVSxHQUFHLFVBQVUsY0FBYywyQkFBMkIsR0FBRyxjQUFjLHNEQUFzRCxHQUFHLGNBQWMsOEJBQThCLEdBQUcsY0FBYyx1QkFBdUIsR0FBRyxjQUFjLHdCQUF3QixHQUFHLGNBQWMsVUFBVSxHQUFHLFVBQVUsY0FBYyx1QkFBdUIsR0FBRyxjQUFjLHlCQUF5QixHQUFHLGNBQWMsMkJBQTJCLEdBQUcsY0FBYyx5QkFBeUIsR0FBRyxjQUFjLDZCQUE2QixHQUFHLGNBQWMsNEJBQTRCLEdBQUcsY0FBYyxpQ0FBaUMsR0FBRyxjQUFjLGlDQUFpQyxHQUFHLGNBQWMsVUFBVSxHQUFHLFVBQVUsY0FBYyx1QkFBdUIsR0FBRyxjQUFjLG1DQUFtQyxHQUFHLGNBQWMsOEJBQThCLEdBQUcsY0FBYyxzREFBc0QsR0FBRyxjQUFjLHlCQUF5QixHQUFHLGNBQWMseUJBQXlCLEdBQUcsY0FBYywwQkFBMEIsR0FBRyxjQUFjLDhCQUE4QixHQUFHLGNBQWMsd0JBQXdCLEdBQUcsY0FBYyxVQUFVLEdBQUcsVUFBVSxjQUFjLHdCQUF3QixHQUFHLGNBQWMsbUNBQW1DLEdBQUcsY0FBYyw4QkFBOEIsR0FBRyxjQUFjLHdEQUF3RCxjQUFjLCtDQUErQyxHQUFHLGNBQWMseUJBQXlCLEdBQUcsY0FBYyw4QkFBOEIsR0FBRyxjQUFjLHVCQUF1QixHQUFHLGNBQWMsd0JBQXdCLEdBQUcsY0FBYyxVQUFVLEdBQUcsVUFBVSxjQUFjLGlDQUFpQyxHQUFHLGNBQWMseUJBQXlCLEdBQUcsY0FBYyxrQ0FBa0MsR0FBRyxjQUFjLHlCQUF5QixHQUFHLGNBQWMsMENBQTBDLEdBQUcsY0FBYyxVQUFVLEdBQUcsVUFBVSxjQUFjLHVCQUF1QixHQUFHLGNBQWMsd0NBQXdDLEdBQUcsY0FBYyxpQ0FBaUMsR0FBRyxjQUFjLG1DQUFtQyxHQUFHLGNBQWMsZ0NBQWdDLEdBQUcsY0FBYyx3QkFBd0IsR0FBRyxjQUFjLDJCQUEyQixHQUFHLGNBQWMsNkJBQTZCLEdBQUcsY0FBYyw4QkFBOEIsR0FBRyxjQUFjLDRCQUE0QixHQUFHLGNBQWMsVUFBVSxHQUFHLFVBQVUsY0FBYywyQkFBMkIsR0FBRyxjQUFjLFVBQVUsR0FBRyxVQUFVLGNBQWMsdUJBQXVCLEdBQUcsY0FBYywwQkFBMEIsR0FBRyxjQUFjLDJCQUEyQixHQUFHLGNBQWMsNkJBQTZCLEdBQUcsY0FBYyxVQUFVLEdBQUcsVUFBVSxjQUFjLHdCQUF3QixHQUFHLGNBQWMsNkJBQTZCLEdBQUcsY0FBYyxVQUFVLEdBQUcsVUFBVSxjQUFjLHdCQUF3QixHQUFHLGNBQWMsK0JBQStCLEdBQUcsY0FBYywrQkFBK0IsR0FBRyxjQUFjLHFDQUFxQyxHQUFHLGNBQWMsa0NBQWtDLEdBQUcsY0FBYywwQkFBMEIsR0FBRyxjQUFjLGlDQUFpQyxHQUFHLGNBQWMseURBQXlELEdBQUcsY0FBYywyQkFBMkIsR0FBRyxjQUFjLDRCQUE0QixHQUFHLGNBQWMsd0JBQXdCLEdBQUcsY0FBYyw2QkFBNkIsR0FBRyxjQUFjLDhCQUE4QixHQUFHLGNBQWMsNkJBQTZCLEdBQUcsY0FBYyx1QkFBdUIsR0FBRyxjQUFjLFVBQVUsR0FBRyxVQUFVLGNBQWMsNEJBQTRCLEdBQUcsY0FBYyxrQ0FBa0MsR0FBRyxjQUFjLCtCQUErQixHQUFHLGNBQWMscUNBQXFDLEdBQUcsY0FBYywwQkFBMEIsR0FBRyxjQUFjLGlDQUFpQyxHQUFHLGNBQWMsNkNBQTZDLEdBQUcsY0FBYywyQkFBMkIsR0FBRyxjQUFjLHdCQUF3QixHQUFHLGNBQWMsNkJBQTZCLEdBQUcsY0FBYyw4QkFBOEIsR0FBRyxjQUFjLHVCQUF1QixHQUFHLGNBQWMsVUFBVSxHQUFHLFVBQVUsY0FBYyx1QkFBdUIsR0FBRyxjQUFjLGlDQUFpQyxHQUFHLGNBQWMsd0JBQXdCLEdBQUcsY0FBYyxVQUFVLEdBQUcsY0FBYyxrQkFBa0IsVUFBVSxjQUFjLHlDQUF5QyxjQUFjLDhEQUE4RCxjQUFjLGNBQWMsb0RBQW9ELGNBQWMscUJBQXFCLFVBQVUsY0FBYyxvQ0FBb0MsY0FBYywwREFBMEQsY0FBYyw2Q0FBNkMsY0FBYyxtQkFBbUIsbURBQW1ELFlBQVksY0FBYyxtQkFBbUIsa0RBQWtELFlBQVksY0FBYyxvQkFBb0IsY0FBYyxtQkFBbUIsY0FBYyxnQkFBZ0IsVUFBVSxjQUFjLDRDQUE0Qyx1Q0FBdUMsbURBQW1ELFlBQVksZ0JBQWdCLGNBQWMscUNBQXFDLGNBQWMsa0RBQWtELElBQUkseUJBQXlCLHVDQUF1QyxjQUFjLHdCQUF3Qiw4QkFBOEIsNkJBQTZCLGNBQWMsa0RBQWtELDRCQUE0QixhQUFhLGNBQWMsa0JBQWtCLFVBQVUsY0FBYyxtREFBbUQsY0FBYywyQ0FBMkMsNEJBQTRCLGNBQWMsY0FBYywrQ0FBK0Msb0NBQW9DLGNBQWMsY0FBYywyQ0FBMkMsNEJBQTRCLGNBQWMsVUFBVSxjQUFjLDRDQUE0QyxjQUFjLGtCQUFrQixnREFBZ0QsSUFBSSx5QkFBeUIscUNBQXFDLDZCQUE2QixnQkFBZ0IsRUFBRSxTQUFTLGNBQWMsZ0RBQWdELElBQUkseUJBQXlCLG1EQUFtRCxJQUFJLHlCQUF5QixtREFBbUQsY0FBYyxtQkFBbUIsRUFBRSxVQUFVLEVBQUUsU0FBUyxTQUFTLG1EQUFtRCxJQUFJLHlCQUF5Qix3Q0FBd0MsY0FBYyw0QkFBNEIsY0FBYyxvQkFBb0IsRUFBRSxTQUFTLGNBQWMsc0JBQXNCLGNBQWMsb0JBQW9CLGNBQWMsa0JBQWtCLGVBQWUsRUFBRSxTQUFTLGdCQUFnQixjQUFjLGNBQWMsVUFBVSxnQkFBZ0IsYUFBYSxhQUFhLDBGQUEwRiwyQkFBMkIsT0FBTyx5QkFBeUIsMEJBQTBCLE9BQU8sb0JBQW9CLGtDQUFrQywyQkFBMkIseUJBQXlCLG9CQUFvQix3QkFBd0IsMEJBQTBCLHFCQUFxQiwwQkFBMEIsbUJBQW1CLDJCQUEyQixvQkFBb0IsT0FBTywwQkFBMEIsbURBQW1ELDJCQUEyQixvQkFBb0IscUJBQXFCLE9BQU8sc0JBQXNCLHNCQUFzQix3QkFBd0Isc0JBQXNCLDBCQUEwQix5QkFBeUIsOEJBQThCLDhCQUE4QixPQUFPLHNCQUFzQixnQ0FBZ0MsMkJBQTJCLG1EQUFtRCxzQkFBc0Isc0JBQXNCLHVCQUF1QiwyQkFBMkIscUJBQXFCLE9BQU8sdUJBQXVCLGdDQUFnQywyQkFBMkIsOEZBQThGLHNCQUFzQiwyQkFBMkIsb0JBQW9CLHFCQUFxQixPQUFPLGdDQUFnQyxzQkFBc0IsK0JBQStCLHNCQUFzQix1Q0FBdUMsT0FBTyxzQkFBc0IscUNBQXFDLDhCQUE4QixnQ0FBZ0MsNkJBQTZCLHFCQUFxQix3QkFBd0IsMEJBQTBCLDJCQUEyQix5QkFBeUIsT0FBTywwQkFBMEIsT0FBTyxzQkFBc0IsdUJBQXVCLHdCQUF3QiwwQkFBMEIsT0FBTyx1QkFBdUIsMEJBQTBCLE9BQU8sdUJBQXVCLDRCQUE0Qiw0QkFBNEIsa0NBQWtDLCtCQUErQix1QkFBdUIsOEJBQThCLHNEQUFzRCx3QkFBd0IseUJBQXlCLHFCQUFxQiwwQkFBMEIsMkJBQTJCLDBCQUEwQixvQkFBb0IsT0FBTywyQkFBMkIsK0JBQStCLDRCQUE0QixrQ0FBa0MsdUJBQXVCLDhCQUE4QiwwQ0FBMEMsd0JBQXdCLHFCQUFxQiwwQkFBMEIsMkJBQTJCLG9CQUFvQixPQUFPLHNCQUFzQiw4QkFBOEIscUJBQXFCLE9BQU8sbUhBQW1ILDhCQUE4QiwwSkFBMEosOEJBQThCLG9CQUFvQiw2QkFBNkIsaURBQWlELFVBQVUsbUNBQW1DLDZCQUE2QixVQUFVLFVBQVUseUNBQXlDLFVBQVUscURBQXFELFFBQVEsbUVBQW1FLE1BQU0sdUdBQXVHLE1BQU0saURBQWlELGNBQWMsNkNBQTZDLE1BQU0sNERBQTRELFFBQVEsK0JBQStCLE9BQU8sU0FBUyxRQUFRLGNBQWMsVUFBVSxXQUFXLDJEQUEyRCxhQUFhLFdBQVcsV0FBVyxxRUFBcUUsV0FBVyxrREFBa0QsVUFBVSwwQkFBMEIsV0FBVzs7Ozs7Ozs7OztBQ0RwZ1ksUUFBUSxtQkFBTyxDQUFDLHdGQUFVO0FBQzFCLDhCQUE4Qix3QkFBd0IseUJBQXlCLFdBQVcsYUFBYSxlQUFlLGNBQWMsaUVBQWlFLEdBQUcsY0FBYyxrQ0FBa0MsMkJBQTJCLE9BQU8sR0FBRyxjQUFjLGtDQUFrQyxHQUFHLGNBQWMsUUFBUSxHQUFHLGNBQWMsZ0JBQWdCLFVBQVUsY0FBYyxZQUFZLDRCQUE0QixhQUFhLFVBQVUsY0FBYyxXQUFXLGtGQUFrRixZQUFZLFVBQVUsY0FBYyxjQUFjLFVBQVUsY0FBYyxXQUFXLGlGQUFpRixZQUFZLFVBQVUsZ0JBQWdCLGFBQWEsYUFBYSx3RUFBd0UsOEJBQThCLEtBQUssRUFBRSwrQkFBK0IsS0FBSyxvQkFBb0IsTUFBTSxlQUFlLDZEQUE2RCx3QkFBd0IsNERBQTRELFlBQVksV0FBVzs7Ozs7Ozs7OztBQ0RqcEMsUUFBUSxtQkFBTyxDQUFDLHdGQUFVO0FBQzFCLDhCQUE4Qix3QkFBd0IseUJBQXlCLFdBQVcsYUFBYSxxQkFBcUIsMEJBQTBCLG1EQUFtRCw0QkFBNEIsaUJBQWlCLFVBQVUsZ0JBQWdCLGFBQWEsYUFBYSxrQkFBa0IsSUFBSSw2Q0FBNkMsTUFBTSxpQkFBaUIsV0FBVzs7Ozs7Ozs7OztBQ0QvWSxRQUFRLG1CQUFPLENBQUMsd0ZBQVU7QUFDMUIsOEJBQThCLHdCQUF3Qix5QkFBeUIsV0FBVyxhQUFhLFlBQVksY0FBYyxnQkFBZ0IsNEJBQTRCLFVBQVUsY0FBYyxnQkFBZ0IsNEJBQTRCLFVBQVUsY0FBYyx1QkFBdUIsY0FBYyxzQ0FBc0Msc0JBQXNCLGNBQWMsVUFBVSxjQUFjLCtCQUErQixVQUFVLGdCQUFnQixhQUFhLGFBQWEsbUJBQW1CLE1BQU0sY0FBYyxNQUFNLHNEQUFzRCw0QkFBNEIsVUFBVSxRQUFRLFdBQVc7Ozs7Ozs7Ozs7QUNEL25CLFFBQVEsbUJBQU8sQ0FBQyx3RkFBVTtBQUMxQiw4QkFBOEIsd0JBQXdCLHlCQUF5QixXQUFXLGFBQWEsV0FBVyxjQUFjLGdDQUFnQyxjQUFjLGtCQUFrQiwrQ0FBK0MsVUFBVSxjQUFjLHdEQUF3RCxvQkFBb0IsY0FBYywyREFBMkQsY0FBYyx3REFBd0QsY0FBYyxTQUFTLGNBQWMsYUFBYSxjQUFjLGdCQUFnQixjQUFjLG9FQUFvRSxjQUFjLG9CQUFvQiwrQ0FBK0MsVUFBVSxjQUFjLDREQUE0RCw2Q0FBNkMsb0JBQW9CLFVBQVUsY0FBYywyQkFBMkIsY0FBYyxjQUFjLGNBQWMsY0FBYyxjQUFjLGFBQWEsVUFBVSxnQkFBZ0IsYUFBYSxhQUFhLDhDQUE4Qyx5QkFBeUIsdURBQXVELDBOQUEwTix5QkFBeUIsMERBQTBELFdBQVcsWUFBWSxXQUFXLHNEQUFzRCxXQUFXOzs7Ozs7Ozs7O0FDRGxqRCxRQUFRLG1CQUFPLENBQUMsd0ZBQVU7QUFDMUIsOEJBQThCLHdCQUF3Qix5QkFBeUIsV0FBVyxhQUFhLFVBQVUsY0FBYyxvQkFBb0IsMEJBQTBCLFVBQVUsY0FBYyw4RUFBOEUsY0FBYyxpQkFBaUIsNEJBQTRCLFVBQVUsY0FBYyx3Q0FBd0MsdUNBQXVDLE9BQU8sS0FBSyxjQUFjLFNBQVMsY0FBYyxjQUFjLDBCQUEwQixhQUFhLGNBQWMsWUFBWSxVQUFVLGdCQUFnQixhQUFhLGFBQWEscUJBQXFCLElBQUksdUZBQXVGLE1BQU0sc0NBQXNDLGlCQUFpQixFQUFFLGVBQWUsSUFBSSxtQkFBbUIsV0FBVzs7Ozs7Ozs7OztBQ0R6MEIsUUFBUSxtQkFBTyxDQUFDLHdGQUFVO0FBQzFCLDhCQUE4Qix3QkFBd0IseUJBQXlCLFdBQVcsYUFBYSw4QkFBOEIsNkJBQTZCLHdCQUF3QixjQUFjLG9CQUFvQiw0QkFBNEIsV0FBVyw0QkFBNEIsWUFBWSxjQUFjLGFBQWEsVUFBVSxnQkFBZ0IsYUFBYSxhQUFhLDJCQUEyQixRQUFRLCtCQUErQixNQUFNLEtBQUssTUFBTSxtQkFBbUIsV0FBVzs7Ozs7Ozs7OztBQ0QzZSxRQUFRLG1CQUFPLENBQUMsd0ZBQVU7QUFDMUIsOEJBQThCLHdCQUF3Qix5QkFBeUIsV0FBVyxhQUFhLDBDQUEwQyxjQUFjLHNDQUFzQyxjQUFjLGdCQUFnQixjQUFjLDJCQUEyQixjQUFjLHNGQUFzRixjQUFjLDhDQUE4QyxjQUFjLGNBQWMsY0FBYyxzQkFBc0IsY0FBYyxjQUFjLGNBQWMsYUFBYSxVQUFVLGdCQUFnQixhQUFhLGFBQWEsMlFBQTJRLFdBQVc7Ozs7Ozs7Ozs7QUNENzJCLFFBQVEsbUJBQU8sQ0FBQyx3RkFBVTtBQUMxQiw4QkFBOEIsd0JBQXdCLHlCQUF5QixXQUFXLGFBQWEsZUFBZSxjQUFjLGlGQUFpRixjQUFjLHNFQUFzRSxVQUFVLGNBQWMsNEJBQTRCLGNBQWMsc0JBQXNCLEdBQUcsY0FBYyx1QkFBdUIsR0FBRyxjQUFjLDRCQUE0QixHQUFHLGNBQWMsc0JBQXNCLEdBQUcsY0FBYywrQkFBK0IsR0FBRyxjQUFjLDZCQUE2QixHQUFHLGNBQWMsUUFBUSxHQUFHLFVBQVUsY0FBYywwQ0FBMEMsY0FBYyw0Q0FBNEMsR0FBRyxjQUFjLDRCQUE0QixHQUFHLGNBQWMsb0JBQW9CLEdBQUcsY0FBYyx1QkFBdUIsR0FBRyxjQUFjLGdDQUFnQyxHQUFHLGNBQWMsdUNBQXVDLEdBQUcsY0FBYyxzQkFBc0IsR0FBRyxjQUFjLFFBQVEsR0FBRyxVQUFVLGNBQWMsdUNBQXVDLGNBQWMseUNBQXlDLEdBQUcsY0FBYywwQkFBMEIsR0FBRyxjQUFjLHlCQUF5QixHQUFHLGNBQWMsc0JBQXNCLEdBQUcsY0FBYyx3QkFBd0IsR0FBRyxjQUFjLDJCQUEyQixHQUFHLGNBQWMseUJBQXlCLEdBQUcsY0FBYyxRQUFRLEdBQUcsVUFBVSxjQUFjLDBCQUEwQixHQUFHLGNBQWMsNEJBQTRCLEdBQUcsY0FBYyxRQUFRLEdBQUcsVUFBVSxjQUFjLGlDQUFpQyxHQUFHLGNBQWMsdUJBQXVCLEdBQUcsY0FBYyw0QkFBNEIsR0FBRyxjQUFjLG9CQUFvQixHQUFHLGNBQWMsc0JBQXNCLEdBQUcsY0FBYyxzQ0FBc0MsR0FBRyxjQUFjLHVCQUF1QixHQUFHLGNBQWMsUUFBUSxHQUFHLFVBQVUsY0FBYywwQ0FBMEMsVUFBVSxjQUFjLDZCQUE2QixHQUFHLGNBQWMsMEJBQTBCLEdBQUcsY0FBYywyQkFBMkIsR0FBRyxjQUFjLFFBQVEsR0FBRyxjQUFjLGdCQUFnQixVQUFVLGNBQWMsMEJBQTBCLGNBQWMsb0VBQW9FLGNBQWMseUNBQXlDLGNBQWMsWUFBWSxrRUFBa0UsY0FBYyxlQUFlLFVBQVUsY0FBYyxjQUFjLGNBQWMsb0RBQW9ELElBQUkseUJBQXlCLGVBQWUsY0FBYyw0QkFBNEIsOEJBQThCLFVBQVUsY0FBYyw2RkFBNkYsY0FBYyxhQUFhLGNBQWMsMkJBQTJCLGNBQWMsMkNBQTJDLGNBQWMsMkJBQTJCLDRCQUE0QixhQUFhLGNBQWMsb0JBQW9CLFVBQVUsY0FBYyw2QkFBNkIsY0FBYyxnREFBZ0QsY0FBYyw2Q0FBNkMsNEJBQTRCLGNBQWMsY0FBYyxnREFBZ0QsY0FBYyx1REFBdUQsY0FBYyxvQkFBb0IsdURBQXVELElBQUkseUJBQXlCLFNBQVMsK0RBQStELGNBQWMsK0NBQStDLDBDQUEwQyxlQUFlLGNBQWMsc0RBQXNELGVBQWUsRUFBRSxTQUFTLDBCQUEwQixjQUFjLG9CQUFvQixzREFBc0QsSUFBSSx5QkFBeUIsU0FBUywrREFBK0QsY0FBYywrQ0FBK0MseUNBQXlDLGVBQWUsY0FBYyxzREFBc0QsZUFBZSxFQUFFLFNBQVMsd0JBQXdCLGNBQWMsc0JBQXNCLGNBQWMsb0JBQW9CLFVBQVUsY0FBYyw4QkFBOEIsY0FBYyw4Q0FBOEMsY0FBYyw2Q0FBNkMsNEJBQTRCLGNBQWMsY0FBYyxvQkFBb0IsY0FBYyw4RkFBOEYsY0FBYyxnQ0FBZ0MsOEJBQThCLFVBQVUsY0FBYyxpQkFBaUIsY0FBYyxrQkFBa0Isd0RBQXdELGNBQWMsc0JBQXNCLGNBQWMsb0JBQW9CLGNBQWMsaUJBQWlCLGVBQWUsRUFBRSxTQUFTLGVBQWUsY0FBYyxjQUFjLFVBQVUsY0FBYyxzQkFBc0IsY0FBYyxnRUFBZ0UsY0FBYyx5Q0FBeUMsK0RBQStELGFBQWEsVUFBVSxjQUFjLGNBQWMsY0FBYyxnREFBZ0QsSUFBSSx5QkFBeUIsc0VBQXNFLGNBQWMsMkJBQTJCLGNBQWMsMkNBQTJDLGNBQWMsMkJBQTJCLDRCQUE0QixhQUFhLGNBQWMsb0JBQW9CLFVBQVUsY0FBYyw2QkFBNkIsY0FBYyxnREFBZ0QsY0FBYyw2Q0FBNkMsNEJBQTRCLGNBQWMsY0FBYyxnREFBZ0QsY0FBYyx1REFBdUQsY0FBYyxvQkFBb0IsdURBQXVELElBQUkseUJBQXlCLFNBQVMsK0RBQStELGNBQWMsK0NBQStDLG9DQUFvQyxlQUFlLGNBQWMsc0RBQXNELGVBQWUsRUFBRSxTQUFTLDBCQUEwQixjQUFjLG9CQUFvQixzREFBc0QsSUFBSSx5QkFBeUIsU0FBUywrREFBK0QsY0FBYywrQ0FBK0MsbUNBQW1DLGVBQWUsY0FBYyxzREFBc0QsZUFBZSxFQUFFLFNBQVMsd0JBQXdCLGNBQWMsc0JBQXNCLGNBQWMsb0JBQW9CLFVBQVUsY0FBYyw4QkFBOEIsY0FBYyw4Q0FBOEMsY0FBYyw2Q0FBNkMsNEJBQTRCLGNBQWMsY0FBYyxvQkFBb0IsY0FBYyw4RkFBOEYsY0FBYyxpQkFBaUIsY0FBYyxrQkFBa0Isd0RBQXdELGNBQWMsc0JBQXNCLGNBQWMsb0JBQW9CLGNBQWMsaUJBQWlCLGVBQWUsRUFBRSxTQUFTLGVBQWUsY0FBYyxjQUFjLFVBQVUsZ0JBQWdCLGFBQWEsYUFBYSxnTUFBZ00sb0JBQW9CLHlCQUF5QixtQkFBbUIsNEJBQTRCLDBCQUEwQixLQUFLLCtFQUErRSx5QkFBeUIsaUJBQWlCLG9CQUFvQiw2QkFBNkIsb0NBQW9DLG1CQUFtQixLQUFLLHlFQUF5RSx1QkFBdUIsc0JBQXNCLG1CQUFtQixxQkFBcUIsd0JBQXdCLHNCQUFzQixLQUFLLHlCQUF5Qix5QkFBeUIsS0FBSyxnQ0FBZ0Msb0JBQW9CLHlCQUF5QixpQkFBaUIsbUJBQW1CLG1DQUFtQyxvQkFBb0IsS0FBSyxrRUFBa0UsdUJBQXVCLHdCQUF3QixLQUFLLHlJQUF5SSw0Q0FBNEMsMkJBQTJCLFlBQVksaUNBQWlDLFFBQVEsaUxBQWlMLE1BQU0sK0hBQStILE1BQU0saUhBQWlILGtCQUFrQix5Q0FBeUMsMkNBQTJDLG9CQUFvQix1RUFBdUUsZUFBZSxvQ0FBb0MsaUJBQWlCLHlDQUF5QywyQ0FBMkMsbUJBQW1CLHVFQUF1RSxjQUFjLDJKQUEySixNQUFNLHdJQUF3SSxRQUFRLDJCQUEyQixrQ0FBa0MsaURBQWlELFlBQVksa0lBQWtJLHlDQUF5Qyx1QkFBdUIsUUFBUSxpSkFBaUosTUFBTSwrSEFBK0gsTUFBTSxpSEFBaUgsa0JBQWtCLHlDQUF5QywyQ0FBMkMsY0FBYyx1RUFBdUUsZUFBZSxvQ0FBb0MsaUJBQWlCLHlDQUF5QywyQ0FBMkMsYUFBYSx1RUFBdUUsY0FBYywySkFBMkosTUFBTSxxSUFBcUksa0NBQWtDLGlEQUFpRCxRQUFRLHlCQUF5QixXQUFXOzs7Ozs7Ozs7O0FDRC9oWCxRQUFRLG1CQUFPLENBQUMsd0ZBQVU7QUFDMUIsOEJBQThCLHdCQUF3Qix5QkFBeUIsV0FBVyxhQUFhLFVBQVUsY0FBYywwQkFBMEIsY0FBYyw2QkFBNkIsY0FBYyxvQ0FBb0Msc0JBQXNCLGNBQWMsU0FBUyxjQUFjLHFCQUFxQiwyQkFBMkIsd0RBQXdELGNBQWMsVUFBVSxtQ0FBbUMsY0FBYyxZQUFZLFVBQVUsZ0JBQWdCLGFBQWEsYUFBYSxpRkFBaUYsdUNBQXVDLEtBQUssc0RBQXNELGFBQWEsY0FBYyxXQUFXOzs7Ozs7Ozs7O0FDRDN2QixRQUFRLG1CQUFPLENBQUMsd0ZBQVU7QUFDMUIsOEJBQThCLHdCQUF3Qix5QkFBeUIsV0FBVyxhQUFhLHFDQUFxQyxjQUFjLGlCQUFpQixjQUFjLHVFQUF1RSxHQUFHLGNBQWMsK0hBQStILEdBQUcsY0FBYyw0Q0FBNEMsR0FBRyxjQUFjLHdDQUF3QyxHQUFHLGNBQWMsK0JBQStCLEdBQUcsY0FBYyw0REFBNEQsR0FBRyxjQUFjLFVBQVUsR0FBRyxVQUFVLGNBQWMsOEVBQThFLEdBQUcsY0FBYywwRUFBMEUsR0FBRyxjQUFjLDBCQUEwQixHQUFHLGNBQWMsZ0VBQWdFLEdBQUcsY0FBYyx3QkFBd0IsR0FBRyxjQUFjLHFCQUFxQixHQUFHLGNBQWMsc0JBQXNCLEdBQUcsY0FBYyw4QkFBOEIsR0FBRyxjQUFjLG9CQUFvQixHQUFHLGNBQWMsNENBQTRDLEdBQUcsY0FBYyxpREFBaUQsR0FBRyxjQUFjLHVCQUF1QixHQUFHLGNBQWMsVUFBVSxHQUFHLFVBQVUsY0FBYyxzRkFBc0YsY0FBYyw2RUFBNkUsR0FBRyxjQUFjLHNCQUFzQixHQUFHLGNBQWMsVUFBVSxHQUFHLFVBQVUsY0FBYyx5RUFBeUUsR0FBRyxjQUFjLCtCQUErQixHQUFHLGNBQWMsd0JBQXdCLEdBQUcsY0FBYyx1QkFBdUIsR0FBRyxjQUFjLFVBQVUsR0FBRyxVQUFVLGNBQWMsdUVBQXVFLEdBQUcsY0FBYywwQ0FBMEMsR0FBRyxjQUFjLHVCQUF1QixHQUFHLGNBQWMseURBQXlELEdBQUcsY0FBYywyQkFBMkIsR0FBRyxjQUFjLDRCQUE0QixHQUFHLGNBQWMscUJBQXFCLEdBQUcsY0FBYyw2QkFBNkIsR0FBRyxjQUFjLHNCQUFzQixHQUFHLGNBQWMsMkJBQTJCLEdBQUcsY0FBYyw4QkFBOEIsR0FBRyxjQUFjLDhCQUE4QixHQUFHLGNBQWMsb0JBQW9CLEdBQUcsY0FBYyw0Q0FBNEMsR0FBRyxjQUFjLGlEQUFpRCxHQUFHLGNBQWMsdUJBQXVCLEdBQUcsY0FBYyxVQUFVLEdBQUcsY0FBYyxrQkFBa0IsVUFBVSxjQUFjLGtEQUFrRCxJQUFJLHlCQUF5QixpRUFBaUUsMEJBQTBCLFdBQVcsY0FBYyx1QkFBdUIsNEJBQTRCLGlCQUFpQiwyQkFBMkIsYUFBYSxjQUFjLGVBQWUsNEJBQTRCLFlBQVksY0FBYyxnQkFBZ0IsZUFBZSxFQUFFLFNBQVMsY0FBYyxzREFBc0QsY0FBYyxjQUFjLFVBQVUsZ0JBQWdCLGFBQWEsYUFBYSwrR0FBK0csNEhBQTRILHlDQUF5QyxxQ0FBcUMsNEJBQTRCLHlEQUF5RCxPQUFPLDZFQUE2RSx1RUFBdUUsdUJBQXVCLDZEQUE2RCxxQkFBcUIsa0JBQWtCLG1CQUFtQiwyQkFBMkIsaUJBQWlCLHlDQUF5Qyw4Q0FBOEMsb0JBQW9CLE9BQU8sNEpBQTRKLG1CQUFtQixPQUFPLHdFQUF3RSw0QkFBNEIscUJBQXFCLG9CQUFvQixPQUFPLHNFQUFzRSx1Q0FBdUMsb0JBQW9CLHNEQUFzRCx3QkFBd0IseUJBQXlCLGtCQUFrQiwwQkFBMEIsbUJBQW1CLHdCQUF3QiwyQkFBMkIsMkJBQTJCLGlCQUFpQix5Q0FBeUMsOENBQThDLG9CQUFvQixPQUFPLG9CQUFvQixVQUFVLDZEQUE2RCxJQUFJLHNCQUFzQixNQUFNLFdBQVcsS0FBSyxnQkFBZ0IsTUFBTSxvQkFBb0IsVUFBVSxrRUFBa0UsV0FBVzs7Ozs7Ozs7OztBQ0QxdUssUUFBUSxtQkFBTyxDQUFDLHdGQUFVO0FBQzFCLDhCQUE4Qix3QkFBd0IseUJBQXlCLFdBQVcsYUFBYSxpQkFBaUIsMEJBQTBCLCtDQUErQyxjQUFjLGlEQUFpRCxjQUFjLDhDQUE4Qyx5Q0FBeUMsY0FBYyxjQUFjLGlCQUFpQixjQUFjLGFBQWEsVUFBVSxnQkFBZ0IsYUFBYSxhQUFhLGNBQWMsSUFBSSw0SEFBNEgsbUJBQW1CLGdDQUFnQyxXQUFXOzs7Ozs7Ozs7O0FDRDdxQixRQUFRLG1CQUFPLENBQUMsd0ZBQVU7QUFDMUIsOEJBQThCLHdCQUF3Qix5QkFBeUIsV0FBVyxhQUFhLGVBQWUsY0FBYyxpRUFBaUUsR0FBRyxjQUFjLGtDQUFrQywyQkFBMkIsT0FBTyxHQUFHLGNBQWMsa0NBQWtDLEdBQUcsY0FBYyxRQUFRLEdBQUcsY0FBYyxnQkFBZ0IsVUFBVSxjQUFjLFlBQVksNkJBQTZCLGFBQWEsVUFBVSxjQUFjLFdBQVcsa0ZBQWtGLFlBQVksVUFBVSxjQUFjLGNBQWMsVUFBVSxjQUFjLFdBQVcsaUZBQWlGLFlBQVksVUFBVSxjQUFjLGNBQWMsY0FBYyw0QkFBNEIsY0FBYywwQkFBMEIsY0FBYyx5QkFBeUIsY0FBYyx3QkFBd0IsNEJBQTRCLFVBQVUsY0FBYyxrQkFBa0IsNEJBQTRCLFVBQVUsY0FBYyxVQUFVLFVBQVUsZ0JBQWdCLGFBQWEsYUFBYSx3RUFBd0UsOEJBQThCLEtBQUssRUFBRSwrQkFBK0IsS0FBSyxxQkFBcUIsUUFBUSxlQUFlLDZEQUE2RCx3QkFBd0IsNERBQTRELCtGQUErRixNQUFNLGdCQUFnQixNQUFNLGNBQWMsV0FBVzs7Ozs7Ozs7OztBQ0QzbEQsUUFBUSxtQkFBTyxDQUFDLHdGQUFVO0FBQzFCLDhCQUE4Qix3QkFBd0IseUJBQXlCLFdBQVcsYUFBYSw4REFBOEQsY0FBYyxjQUFjLGNBQWMsaUJBQWlCLGNBQWMsZ0JBQWdCLEdBQUcsY0FBYyx1QkFBdUIsR0FBRyxjQUFjLFVBQVUsR0FBRyxVQUFVLGNBQWMsYUFBYSxHQUFHLGNBQWMsNkJBQTZCLEdBQUcsY0FBYyx3QkFBd0IsR0FBRyxjQUFjLFVBQVUsR0FBRyxjQUFjLGtCQUFrQixjQUFjLGFBQWEsVUFBVSxjQUFjLDJCQUEyQixjQUFjLHNDQUFzQyxzREFBc0QsYUFBYSxjQUFjLDZDQUE2QyxjQUFjLGVBQWUsY0FBYyxxQ0FBcUMsY0FBYyw2Q0FBNkMsOENBQThDLElBQUkseUJBQXlCLGVBQWUsRUFBRSxTQUFTLFVBQVUsY0FBYyxzQkFBc0IsdURBQXVELFVBQVUsY0FBYyxhQUFhLGNBQWMsY0FBYywrQ0FBK0MsY0FBYyxpQkFBaUIsY0FBYyxrREFBa0QsSUFBSSx5QkFBeUIsZUFBZSxjQUFjLHlDQUF5QyxjQUFjLDZDQUE2QyxrREFBa0QsSUFBSSx5QkFBeUIsZUFBZSxFQUFFLFNBQVMsVUFBVSxjQUFjLGFBQWEsY0FBYyxjQUFjLG1EQUFtRCxjQUFjLGlCQUFpQixjQUFjLGVBQWUsY0FBYyw0Q0FBNEMsY0FBYyw2Q0FBNkMscURBQXFELElBQUkseUJBQXlCLGVBQWUsRUFBRSxTQUFTLFVBQVUsY0FBYyxhQUFhLGNBQWMsY0FBYyxzREFBc0QsY0FBYyxpQkFBaUIsY0FBYyxlQUFlLGNBQWMsc0NBQXNDLGNBQWMsNkNBQTZDLCtDQUErQyxJQUFJLHlCQUF5QixlQUFlLEVBQUUsU0FBUyxVQUFVLGNBQWMsYUFBYSxjQUFjLGNBQWMsZ0RBQWdELGNBQWMsaUJBQWlCLGVBQWUsRUFBRSxTQUFTLGtFQUFrRSxjQUFjLGNBQWMsZ0RBQWdELGNBQWMsaUJBQWlCLGNBQWMsa0VBQWtFLGNBQWMsY0FBYyxnREFBZ0QsY0FBYyxpQkFBaUIsY0FBYywrRUFBK0UsY0FBYyxjQUFjLDZEQUE2RCxjQUFjLGlCQUFpQixjQUFjLGlFQUFpRSxjQUFjLGNBQWMsK0NBQStDLGNBQWMsaUJBQWlCLGNBQWMsZUFBZSxVQUFVLGNBQWMsMkJBQTJCLGNBQWMsdURBQXVELGNBQWMsaUJBQWlCLGNBQWMsbUJBQW1CLGNBQWMsK0JBQStCLGNBQWMsNkJBQTZCLGNBQWMsb0JBQW9CLGNBQWMsbUJBQW1CLGNBQWMsMkJBQTJCLGNBQWMsa0JBQWtCLGNBQWMsa0VBQWtFLGNBQWMsbUJBQW1CLGNBQWMsb0JBQW9CLGNBQWMsa0JBQWtCLGNBQWMsYUFBYSxjQUFjLGNBQWMsVUFBVSxnQkFBZ0IsYUFBYSxhQUFhLHlGQUF5RixvQkFBb0IsT0FBTyxZQUFZLDBCQUEwQixxQkFBcUIsT0FBTyw0RUFBNEUsZ0NBQWdDLDZIQUE2SCxRQUFRLFFBQVEsUUFBUSxvQkFBb0IsaUNBQWlDLG1CQUFtQix5QkFBeUIsbUJBQW1CLFdBQVcscUZBQXFGLFlBQVksUUFBUSxZQUFZLG1CQUFtQiw2QkFBNkIsbUdBQW1HLGVBQWUsUUFBUSxlQUFlLG1CQUFtQixnQ0FBZ0MsNkZBQTZGLFNBQVMsUUFBUSxTQUFTLG1CQUFtQiwwQkFBMEIsbUJBQW1CLFdBQVcsc0VBQXNFLDBCQUEwQixpRkFBaUYsMEJBQTBCLDhGQUE4Rix1Q0FBdUMsZ0ZBQWdGLHlCQUF5QiwwVkFBMFYsV0FBVzs7Ozs7Ozs7OztBQ0RoekwsUUFBUSxtQkFBTyxDQUFDLHdGQUFVO0FBQzFCLDhCQUE4Qix3QkFBd0IseUJBQXlCLFdBQVcsYUFBYSxzREFBc0QsY0FBYyxVQUFVLHVEQUF1RCxjQUFjLFlBQVksVUFBVSxnQkFBZ0IsYUFBYSxhQUFhLHVEQUF1RCxpQ0FBaUMsY0FBYyxXQUFXOzs7Ozs7Ozs7O0FDRDNhLFFBQVEsbUJBQU8sQ0FBQyx3RkFBVTtBQUMxQiw4QkFBOEIsd0JBQXdCLHlCQUF5QixXQUFXLGFBQWEsZUFBZSxjQUFjLG1CQUFtQixHQUFHLGNBQWMsNEJBQTRCLEdBQUcsY0FBYyxRQUFRLEdBQUcsVUFBVSxjQUFjLGNBQWMsR0FBRyxjQUFjLDRCQUE0QixHQUFHLGNBQWMscUJBQXFCLEdBQUcsY0FBYyxRQUFRLEdBQUcsVUFBVSxjQUFjLHNCQUFzQixHQUFHLGNBQWMseUJBQXlCLEdBQUcsY0FBYyxRQUFRLEdBQUcsVUFBVSxjQUFjLHNCQUFzQixHQUFHLGNBQWMsc0JBQXNCLEdBQUcsY0FBYyxxQkFBcUIsR0FBRyxjQUFjLHlCQUF5QixHQUFHLGNBQWMsUUFBUSxHQUFHLFVBQVUsY0FBYyw2Q0FBNkMsY0FBYywwQkFBMEIsR0FBRyxjQUFjLHdEQUF3RCxHQUFHLGNBQWMsZ0RBQWdELEdBQUcsY0FBYyxRQUFRLEdBQUcsVUFBVSxjQUFjLGFBQWEsR0FBRyxjQUFjLHVCQUF1QixHQUFHLGNBQWMsaUNBQWlDLEdBQUcsY0FBYyw2QkFBNkIsR0FBRyxjQUFjLFFBQVEsR0FBRyxVQUFVLGNBQWMsb0JBQW9CLEdBQUcsY0FBYyx5QkFBeUIsR0FBRyxjQUFjLFFBQVEsR0FBRyxVQUFVLGNBQWMscUJBQXFCLEdBQUcsY0FBYyw4QkFBOEIsR0FBRyxjQUFjLFFBQVEsR0FBRyxVQUFVLGNBQWMsNkJBQTZCLEdBQUcsY0FBYywrQkFBK0IsR0FBRyxjQUFjLDRCQUE0QixHQUFHLGNBQWMsUUFBUSxHQUFHLFVBQVUsY0FBYyxtQkFBbUIsR0FBRyxjQUFjLHNCQUFzQixHQUFHLGNBQWMsdUJBQXVCLEdBQUcsY0FBYyxRQUFRLEdBQUcsY0FBYyxnQkFBZ0IsVUFBVSxjQUFjLDhDQUE4QyxjQUFjLFVBQVUsMkRBQTJELGNBQWMsaUJBQWlCLFVBQVUsY0FBYyxlQUFlLGNBQWMsaUJBQWlCLGNBQWMsZ0JBQWdCLGNBQWMsa0JBQWtCLHNEQUFzRCxhQUFhLGNBQWMsa0JBQWtCLHNEQUFzRCxhQUFhLGNBQWMsa0JBQWtCLHVEQUF1RCxhQUFhLGNBQWMsa0JBQWtCLHdEQUF3RCxhQUFhLGNBQWMsa0JBQWtCLHlEQUF5RCxhQUFhLGNBQWMsaUJBQWlCLGNBQWMsa0JBQWtCLGNBQWMsaUJBQWlCLGNBQWMsbURBQW1ELElBQUkseUJBQXlCLDJEQUEyRCw0QkFBNEIsV0FBVyxjQUFjLDJCQUEyQixjQUFjLGtCQUFrQixjQUFjLG1EQUFtRCxjQUFjLGlEQUFpRCw0QkFBNEIsaUJBQWlCLDRCQUE0QixhQUFhLGNBQWMsNkNBQTZDLDhCQUE4QixpQkFBaUIsY0FBYyxzQkFBc0IsY0FBYyxtQkFBbUIsVUFBVSxjQUFjLDJCQUEyQixjQUFjLHlDQUF5QyxjQUFjLDZDQUE2Qyw0QkFBNEIsY0FBYyxjQUFjLDZDQUE2QyxvQ0FBb0MsY0FBYyxjQUFjLG1CQUFtQixVQUFVLGNBQWMsNEJBQTRCLGNBQWMseUNBQXlDLGNBQWMsb0JBQW9CLGNBQWMsMENBQTBDLGNBQWMsMEJBQTBCLDhEQUE4RCxVQUFVLGNBQWMsaUJBQWlCLGNBQWMsNkNBQTZDLDZCQUE2QixlQUFlLGNBQWMsbUVBQW1FLGNBQWMsc0JBQXNCLGNBQWMsbUJBQW1CLFVBQVUsY0FBYyw0QkFBNEIsY0FBYyx5Q0FBeUMsY0FBYyxtQ0FBbUMsNkJBQTZCLFlBQVksY0FBYyxtQkFBbUIsVUFBVSxjQUFjLDhCQUE4QixjQUFjLGtCQUFrQixjQUFjLG1DQUFtQyxjQUFjLHNCQUFzQixjQUFjLDJEQUEyRCwwQ0FBMEMsa0JBQWtCLFVBQVUsY0FBYyx5RUFBeUUsY0FBYyw0QkFBNEIsK0RBQStELFVBQVUsY0FBYywwQkFBMEIsdURBQXVELFVBQVUsY0FBYyxvQkFBb0IsY0FBYyxzQkFBc0IsY0FBYywrREFBK0QsY0FBYyxzRUFBc0UsY0FBYyw0QkFBNEIsZ0VBQWdFLFVBQVUsY0FBYywwQkFBMEIsd0RBQXdELFVBQVUsY0FBYyxvQkFBb0IsY0FBYyxzQkFBc0IsY0FBYyxtQkFBbUIsY0FBYyxpQkFBaUIsZUFBZSxFQUFFLFNBQVMsa0JBQWtCLGNBQWMsZ0JBQWdCLFVBQVUsZ0JBQWdCLGFBQWEsYUFBYSwwQkFBMEIseUJBQXlCLEtBQUssYUFBYSx5QkFBeUIsa0JBQWtCLEtBQUsscUJBQXFCLHNCQUFzQixLQUFLLHFCQUFxQixtQkFBbUIsa0JBQWtCLHNCQUFzQixLQUFLLGdFQUFnRSxxREFBcUQsNkNBQTZDLEtBQUssWUFBWSxvQkFBb0IsOEJBQThCLDBCQUEwQixLQUFLLG1CQUFtQixzQkFBc0IsS0FBSyxvQkFBb0IsMkJBQTJCLEtBQUssNEJBQTRCLDRCQUE0Qix5QkFBeUIsS0FBSyxrQkFBa0IsbUJBQW1CLG9CQUFvQixLQUFLLDBEQUEwRCxxQ0FBcUMseURBQXlELGdDQUFnQyxtQkFBbUIsZ0NBQWdDLG1CQUFtQixpQ0FBaUMsbUJBQW1CLGtDQUFrQyxtQkFBbUIsbUNBQW1DLCtDQUErQyxXQUFXLHVEQUF1RCxNQUFNLDhIQUE4SCxNQUFNLFdBQVcsTUFBTSw4Q0FBOEMsUUFBUSx5SUFBeUksTUFBTSwrQ0FBK0MsY0FBYyxzSkFBc0osd0NBQXdDLHNEQUFzRCxPQUFPLDJMQUEyTCxPQUFPLDJKQUEySixRQUFRLFVBQVUsUUFBUSw2RkFBNkYseUNBQXlDLHdCQUF3QixpQ0FBaUMsaUxBQWlMLDBDQUEwQyx3QkFBd0Isa0NBQWtDLGdFQUFnRSxXQUFXLDhCQUE4QixXQUFXOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0R6NVE7QUFDSDtBQUNaO0FBQ0U7QUFDSjtBQUU5QyxLQUFLLFVBQVUsVUFBVSxDQUFDLElBVWhDO0lBQ0MsSUFBSSxHQUFHO1FBQ0wsR0FBRztZQUNELElBQUksRUFBRSxrRUFBUTtZQUNkLFlBQVksRUFBRSxtRkFBZ0I7WUFDOUIsUUFBUSxFQUFFLGdGQUFrQjtZQUM1QixNQUFNLEVBQUUsc0VBQVU7WUFDbEIsS0FBSyxFQUFFLEVBQUU7WUFDVCxLQUFLLEVBQUUsb0VBQVM7WUFDaEIsSUFBSSxFQUFFLENBQUM7WUFDUCxJQUFJLEVBQUUsRUFBRTtTQUNUO1FBQ0QsR0FBRyxJQUFJO0tBQ1I7SUFFRCxNQUFNLGNBQWMsR0FBRyxDQUFDO0lBQ3hCLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsMEJBQTBCLEVBQUU7UUFDOUMsR0FBRyxJQUFJO1FBQ1AsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxjQUFjO1FBQ3RDLEVBQUUsRUFBRSxjQUFjO0tBQ25CLENBQUMsQ0FBVztBQUNmLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDcEM0RDtBQUV0RCxLQUFLLFVBQVUsR0FBRyxDQUFDLE1BQWM7SUFDdEMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtRQUMzQixLQUFLLENBQUMsQ0FBQyxJQUFJLENBQ1Qsa0JBQWtCLEVBQ2xCLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUNkLENBQUMsSUFBZ0IsRUFBUSxFQUFFO1lBQ3pCLDJFQUFpQixHQUFHLElBQUksQ0FBQyxJQUFJO1lBQzdCLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFFYixJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssU0FBUyxFQUFFO2dCQUM3QixDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7Z0JBQ3ZCLE9BQU07YUFDUDtRQUNILENBQUMsRUFDRCxNQUFNLENBQ1A7SUFDSCxDQUFDLENBQUM7QUFDSixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7OztBQ2xCNEQ7QUFFdEQsS0FBSyxVQUFVLFVBQVU7SUFDOUIsT0FBTyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtRQUMzQixLQUFLLENBQUMsQ0FBQyxJQUFJLENBQ1Qsa0JBQWtCLEVBQ2xCLENBQUMsSUFBb0MsRUFBUSxFQUFFO1lBQzdDLDJFQUFpQixHQUFHLElBQUksQ0FBQyxJQUFJO1lBQzdCLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFFYixJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssU0FBUyxFQUFFO2dCQUM3QixDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7Z0JBQ3ZCLE9BQU07YUFDUDtRQUNILENBQUMsQ0FDRjtJQUNILENBQUMsQ0FBQztBQUNKLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDakI0RDtBQUV0RCxLQUFLLFVBQVUsWUFBWSxDQUNoQyxXQUFtQjtJQUVuQixPQUFPLElBQUksT0FBTyxDQUEyQixDQUFDLE9BQU8sRUFBUSxFQUFFO1FBQzdELEtBQUssQ0FBQyxDQUFDLElBQUksQ0FDVCxtQkFBbUIsRUFDbkIsRUFBRSxXQUFXLEVBQUUsRUFDZixDQUFDLElBQThCLEVBQVEsRUFBRTtZQUN2QywyRUFBaUIsR0FBRyxJQUFJLENBQUMsSUFBSTtZQUM3QixPQUFPLENBQUMsSUFBSSxDQUFDO1lBRWIsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLFNBQVMsRUFBRTtnQkFDN0IsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUN2QixPQUFNO2FBQ1A7WUFFRCxhQUFhLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhO1lBRXZDLDJCQUEyQjtnQkFDekIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLDJCQUEyQixLQUFLLFdBQVc7b0JBQzFELENBQUMsQ0FBQyxJQUFJO29CQUNOLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLDJCQUEyQjtZQUUzQyxtQkFBbUI7Z0JBQ2pCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsS0FBSyxXQUFXO29CQUNsRCxDQUFDLENBQUMsSUFBSTtvQkFDTixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxtQkFBbUI7UUFDckMsQ0FBQyxDQUNGO0lBQ0gsQ0FBQyxDQUFDO0FBQ0osQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNoQzREO0FBRXRELEtBQUssVUFBVSxrQkFBa0I7SUFHdEMsT0FBTyxJQUFJLE9BQU8sQ0FBaUMsQ0FBQyxPQUFPLEVBQVEsRUFBRTtRQUNuRSxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQ1QseUJBQXlCLEVBQ3pCLENBQUMsSUFBb0MsRUFBUSxFQUFFO1lBQzdDLDJFQUFpQixHQUFHLElBQUksQ0FBQyxJQUFJO1lBQzdCLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFFYixJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssU0FBUyxFQUFFO2dCQUM3QixDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7Z0JBQ3ZCLE9BQU07YUFDUDtRQUNILENBQUMsQ0FDRjtJQUNILENBQUMsQ0FBQztBQUNKLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7QUMyQ0QsSUFBWSxlQUdYO0FBSEQsV0FBWSxlQUFlO0lBQ3pCLHdDQUFxQjtJQUNyQixzQ0FBbUI7QUFDckIsQ0FBQyxFQUhXLGVBQWUsS0FBZixlQUFlLFFBRzFCOzs7Ozs7Ozs7Ozs7Ozs7O0FDbkVELElBQVksTUFHWDtBQUhELFdBQVksTUFBTTtJQUNoQix5QkFBZTtJQUNmLDZCQUFtQjtBQUNyQixDQUFDLEVBSFcsTUFBTSxLQUFOLE1BQU0sUUFHakI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDSGdDO0FBRTFCLFNBQVMsZ0JBQWdCO0lBQzlCLGVBQWUsRUFBRTtJQUNqQixjQUFjLEVBQUU7SUFDaEIsZUFBZSxFQUFFO0lBRWpCLElBQUksZ0VBQXVCO1FBQUUsY0FBYyxHQUFHLGdFQUF1Qjs7UUFDaEUsZ0VBQXVCLEdBQUcsY0FBYztBQUMvQyxDQUFDO0FBRUQsU0FBUyxlQUFlO0lBQ3RCLE1BQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQ3ZDLHdCQUF3QixDQUN6QjtJQUNELElBQUksVUFBVSxFQUFFO1FBQ2QsVUFBVSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsT0FBTztRQUNqQyxVQUFVLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxPQUFPO1FBQ2pDLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSTtZQUNuQix3REFBd0Q7UUFDMUQsVUFBVSxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsT0FBTztRQUNwQyxVQUFVLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxNQUFNO1FBQ2xDLFVBQVUsQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLE9BQU87UUFDbkMsVUFBVSxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsT0FBTztRQUNwQyxVQUFVLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxPQUFPO0tBQ2pDO0FBQ0gsQ0FBQztBQUVELFNBQVMsZUFBZTtJQUN0QixNQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLGtCQUFrQixDQUFDO0lBQzlELElBQUksVUFBVTtRQUFFLFVBQVUsQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLE1BQU07QUFDdEQsQ0FBQztBQUVELFNBQVMsY0FBYztJQUNyQixNQUFNLFlBQVksR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLDBCQUEwQixDQUFDO0lBQ3hFLElBQUksWUFBWSxFQUFFO1FBQ2hCLFlBQVksQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLEtBQUs7S0FDbkM7SUFFRCxNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLG9CQUFvQixDQUFDO0lBQzdELElBQUksT0FBTyxFQUFFO1FBQ1gsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsR0FBRztRQUN4QixPQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxPQUFPO1FBQ2hDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLGtDQUFrQztRQUN0RCxPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxrQkFBa0I7S0FDN0M7SUFFRCxNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUNuQyw0QkFBNEIsQ0FDN0I7SUFDRCxJQUFJLE1BQU0sRUFBRTtRQUNWLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLE9BQU87UUFDaEMsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsTUFBTTtLQUMvQjtBQUNILENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0RHlDO0FBTW5DLFNBQVMsd0JBQXdCLENBQ3RDLGlCQUFpQztJQUVqQyxNQUFNLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUUsR0FBRyxpQkFBaUIsQ0FBQyxPQUFPO0lBQ3hFLElBQUksQ0FBQyxVQUFVLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxZQUFZO1FBQUUsT0FBTTtJQUNyRCxPQUFPO1FBQ0wsVUFBVSxFQUFFLE1BQU0sQ0FBQyxVQUFVLENBQUM7UUFDOUIsUUFBUSxFQUFFLFFBQWtDO1FBQzVDLFlBQVk7S0FDYjtBQUNILENBQUM7QUFFTSxTQUFTLG9CQUFvQixDQUNsQyxTQUF3QixFQUN4QixrQkFBc0M7SUFFdEMsTUFBTSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsR0FBRyxTQUFTLENBQUMsT0FBTztJQUNyRSxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsVUFBVTtRQUFFLE9BQU07SUFDaEUsT0FBTztRQUNMLEdBQUcsa0JBQWtCO1FBQ3JCLE1BQU0sRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ3RCLEtBQUssRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ3BCLElBQUk7UUFDSixNQUFNO1FBQ04sVUFBVTtLQUNYO0FBQ0gsQ0FBQztBQUVNLFNBQVMsV0FBVyxDQUN6QixFQUFpQixFQUNqQixlQUFnQztJQUVoQyxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLEdBQUcsRUFBRSxDQUFDLE9BQU87SUFDdkQsTUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHO0lBQ3pDLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxVQUFVLElBQUksQ0FBQyxJQUFJO1FBQUUsT0FBTTtJQUUvRCxPQUFPO1FBQ0wsR0FBRyxlQUFlO1FBQ2xCLE1BQU0sRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ3RCLElBQUk7UUFDSixNQUFNO1FBQ04sVUFBVTtRQUNWLElBQUksRUFBRSx1REFBUSxDQUFDLElBQUksQ0FBQztLQUNyQjtBQUNILENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDakQ0QztBQUNWO0FBQ2M7QUFDQztBQUsvQjtBQUMyRDtBQUNoQjtBQUNPO0FBQ3BDO0FBRTFCLEtBQUssVUFBVSxzQkFBc0I7SUFDMUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLG9CQUFvQixDQUFDO1FBQUUsT0FBTTtJQUUvRCxpQkFBaUIsQ0FBQyxLQUFLLEVBQUU7SUFDekIsT0FBTyxHQUFHLEtBQUs7SUFFZixnRUFBZ0IsRUFBRTtJQUVsQixtQkFBbUI7SUFDbkIsS0FBSyxNQUFNLEVBQUUsSUFBSSxRQUFRLENBQUMsZ0JBQWdCLENBQ3hDLG9EQUFvRCxDQUNyRCxFQUFFO1FBQ0QsTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxPQUFPO1FBQy9CLElBQUksQ0FBQyxnREFBTSxDQUFDLFFBQVEsRUFBRSx3RkFBc0IsQ0FBQztZQUFFLFNBQVE7UUFFdkQsUUFBUSxRQUFRLEVBQUU7WUFDaEIsS0FBSyxtR0FBaUM7Z0JBQ3BDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQ2hDLFFBQVEsQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQ2pEO2dCQUNELFNBQVE7WUFDVixLQUFLLGtHQUFnQztnQkFDbkMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7b0JBQ2hDLFFBQVEsQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLEVBQUUsTUFBTSxFQUFFO29CQUNoRCxLQUFLLGNBQWMsQ0FBQyxRQUFRLENBQUM7Z0JBQy9CLENBQUMsQ0FBQztnQkFDRixTQUFRO1lBQ1YsS0FBSyw4RkFBNEI7Z0JBQy9CLFNBQVE7WUFDVjtnQkFDRSxFQUFFLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtvQkFDaEMsUUFBUTt5QkFDTCxjQUFjLENBQUMscUNBQXFDLENBQUM7d0JBQ3RELEVBQUUsTUFBTSxFQUFFO29CQUNaLGdDQUFnQztnQkFDbEMsQ0FBQyxDQUFDO1NBQ0w7S0FDRjtJQUVELE1BQU0sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3ZELHlCQUF5QjtBQUMzQixDQUFDO0FBRUQ7OztHQUdHO0FBQ0gsS0FBSyxVQUFVLGNBQWMsQ0FDM0IsUUFBZ0M7SUFFaEMsTUFBTSxlQUFlLEdBQ25CLFFBQVEsQ0FBQyxhQUFhLENBQWlCLG1CQUFtQixDQUFDO0lBQzdELElBQUksQ0FBQyxlQUFlO1FBQUUsT0FBTyxJQUFJO0lBRWpDLE1BQU0sZUFBZSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQzVDLDhCQUE4QixRQUFRLEVBQUUsQ0FDekM7SUFFRCxJQUFJLGVBQWUsRUFBRTtRQUNuQixNQUFNLHlCQUF5QixDQUFDLFFBQVEsRUFBRSxlQUFlLEVBQUUsZUFBZSxDQUFDO1FBQzNFLE9BQU8sZUFBZTtLQUN2QjtJQUVELE9BQU8sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7UUFDM0IsSUFBSSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsRUFBRTtZQUNuQyxNQUFNLGVBQWUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUM1Qyw4QkFBOEIsUUFBUSxFQUFFLENBQ3pDO1lBQ0QsSUFBSSxDQUFDLGVBQWU7Z0JBQUUsT0FBTTtZQUM1QixRQUFRLENBQUMsVUFBVSxFQUFFO1lBRXJCLEtBQUssQ0FBQyxLQUFLLElBQW1CLEVBQUU7Z0JBQzlCLE1BQU0seUJBQXlCLENBQzdCLFFBQVEsRUFDUixlQUFlLEVBQ2YsZUFBZSxDQUNoQjtnQkFDRCxPQUFPLENBQUMsZUFBZSxDQUFDO1lBQzFCLENBQUMsQ0FBQyxFQUFFO1FBQ04sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGVBQWUsRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQztJQUNsRCxDQUFDLENBQUM7QUFDSixDQUFDO0FBRUQsS0FBSyxVQUFVLHlCQUF5QixDQUN0QyxRQUFnQyxFQUNoQyxlQUErQixFQUMvQixpQkFBaUM7SUFFakMsSUFBSSxRQUFRLEtBQUssa0dBQWdDO1FBQUUsOERBQWMsRUFBRTtTQUM5RDtRQUNILE1BQU0sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3RELFdBQVcsQ0FBQyxlQUFlLEVBQUUsaUJBQWlCLENBQUM7UUFDL0MsTUFBTSxZQUFZLENBQUMsaUJBQWlCLENBQUM7S0FDdEM7QUFDSCxDQUFDO0FBRUQsU0FBUyxXQUFXLENBQ2xCLGVBQStCLEVBQy9CLGlCQUFpQztJQUVqQyw2Q0FBNkM7SUFDN0MsTUFBTSxrQkFBa0IsR0FBRyxtRUFBd0IsQ0FBQyxpQkFBaUIsQ0FBQztJQUN0RSxJQUFJLENBQUMsa0JBQWtCO1FBQUUsT0FBTyxJQUFJO0lBQ3BDLDZEQUFvQixDQUFDLGtCQUFrQixDQUFDO0lBQ3hDLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO0lBQzVDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTTtJQUV4QyxrQ0FBa0M7SUFDbEMsTUFBTSxRQUFRLEdBQWEsbUJBQU8sQ0FBQyw2R0FBa0QsQ0FBQztJQUN0RixRQUFRLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxFQUFFLE1BQU0sRUFBRTtJQUNoRCxlQUFlLENBQUMsa0JBQWtCLENBQ2hDLFdBQVcsRUFDWCxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxrQkFBa0IsRUFBRSxTQUFTLDBEQUFFLENBQUMsQ0FDdEQ7SUFFRCxNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFpQixXQUFXLENBQUM7SUFDbkUsSUFBSSxDQUFDLE9BQU87UUFBRSxPQUFPLElBQUk7SUFDekIsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsa0JBQWtCLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRTtJQUNyRSxPQUFPLENBQUMsT0FBTyxDQUFDLFFBQVEsR0FBRyxrQkFBa0IsQ0FBQyxRQUFRO0lBQ3RELE9BQU8sQ0FBQyxPQUFPLENBQUMsWUFBWSxHQUFHLGtCQUFrQixDQUFDLFlBQVk7SUFDOUQsT0FBTyxPQUFPO0FBQ2hCLENBQUM7QUFFRCxNQUFNLGlCQUFpQixHQUFHLElBQUksR0FBRyxFQUEwQjtBQUUzRCx5RUFBeUU7QUFDekUsS0FBSyxVQUFVLFlBQVksQ0FBQyxpQkFBaUM7SUFDM0QsTUFBTSxrQkFBa0IsR0FBRyxtRUFBd0IsQ0FBQyxpQkFBaUIsQ0FBQztJQUN0RSxJQUFJLENBQUMsa0JBQWtCO1FBQUUsT0FBTTtJQUMvQiw2REFBb0IsQ0FBQyxrQkFBa0IsQ0FBQztJQUN4QyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztJQUM1QyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU07SUFFeEMsTUFBTSxPQUFPLEdBQUcsaUJBQWlCLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQztJQUNsRSxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDO0lBRWxELDJEQUFrQixDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQztJQUMvQyxLQUFLLE1BQU0sRUFBRSxJQUFJLGlCQUFpQixDQUFDLGdCQUFnQixDQUNqRCwwQkFBMEIsQ0FDM0IsRUFBRTtRQUNELE1BQU0sZUFBZSxHQUFHLCtEQUFvQixDQUFDLEVBQUUsRUFBRSxrQkFBa0IsQ0FBQztRQUNwRSxJQUFJLENBQUMsZUFBZSxFQUFFLEtBQUs7WUFBRSxNQUFLO1FBQ2xDLDBEQUFpQixDQUFDLGVBQWUsQ0FBQztRQUVsQyxJQUNFLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FDckIsMkJBQTJCLGVBQWUsQ0FBQyxLQUFLLEVBQUUsQ0FDbkQ7WUFDRCxDQUFDLE9BQU87UUFDUiw2Q0FBNkM7O1lBRTdDLE1BQU0sOERBQVMsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDO1FBRXhDLE1BQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQ2hDLDJCQUEyQixlQUFlLENBQUMsS0FBSyxFQUFFLENBQ25EO1FBQ0QsSUFBSSxDQUFDLEdBQUc7WUFBRSxNQUFLO1FBQ2YsR0FBRyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBRTlCLE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLEVBQUMsOERBQThEO1FBQ3pHLElBQUksTUFBTTtZQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztRQUUzQyxNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUMxQixHQUFHLENBQUMsZ0JBQWdCLENBQWdCLG9CQUFvQixDQUFDLENBQzFEO2FBQ0UsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQ1IsTUFBTSxjQUFjLEdBQUcsc0RBQVcsQ0FBQyxFQUFFLEVBQUUsZUFBZSxDQUFDO1lBQ3ZELElBQUksQ0FBQyxjQUFjLEVBQUUsSUFBSTtnQkFBRSxPQUFPLEVBQUUsQ0FBQyxTQUFTO1lBRTlDLEVBQUUsQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLGNBQWMsQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFO1lBQzVELEVBQUUsQ0FBQyxPQUFPLENBQUMsUUFBUSxHQUFHLGNBQWMsQ0FBQyxRQUFRO1lBQzdDLEVBQUUsQ0FBQyxPQUFPLENBQUMsWUFBWSxHQUFHLGNBQWMsQ0FBQyxZQUFZO1lBQ3JELEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLGNBQWMsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFO1lBQ2xELHlEQUFnQixDQUFDLGNBQWMsQ0FBQztZQUVoQyxPQUFPLEVBQUUsQ0FBQyxTQUFTO1FBQ3JCLENBQUMsQ0FBQzthQUNELElBQUksQ0FBQyxJQUFJLENBQUM7UUFDYixnRUFBdUIsR0FBRyxjQUFjO1FBRXhDLEdBQUcsQ0FBQyxNQUFNLEVBQUU7UUFFWixNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUNuQyxvQ0FBb0MsZUFBZSxDQUFDLFFBQVEsV0FBVyxDQUN4RTtRQUVELElBQUksTUFBTSxFQUFFO1lBQ1YsUUFBUTtpQkFDTCxhQUFhLENBQWlCLFdBQVcsQ0FBQztnQkFDM0MsRUFBRSxrQkFBa0IsQ0FBQyxXQUFXLEVBQUUsU0FBUyxDQUFDO1lBRTlDLHVCQUF1QixFQUFFO1lBQ3pCLDBCQUEwQixFQUFFO1NBQzdCO2FBQU0sSUFBSSxPQUFPO1lBQUUsTUFBSztLQUMxQjtJQUVELElBQUksQ0FBQyxPQUFPO1FBQUUsaUJBQWlCLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQztJQUNuRSwrREFBc0IsRUFBRTtBQUMxQixDQUFDO0FBRUQsSUFBSSxPQUFPLEdBQUcsS0FBSztBQUVaLEtBQUssVUFBVSxjQUFjO0lBQ2xDLElBQUksT0FBTztRQUFFLE9BQU07SUFDbkIsT0FBTyxHQUFHLElBQUk7SUFDZCxJQUFJLE9BQU8sR0FBRyxJQUFJO0lBRWxCLE1BQU0sVUFBVSxHQUFHO1FBQ2pCLGtHQUFnQztRQUNoQyw2RkFBMkI7UUFDM0IsOEZBQTRCO1FBQzVCLDhGQUE0QjtRQUM1Qiw0RkFBMEI7UUFDMUIsNkZBQTJCO1FBQzNCLDZGQUEyQjtRQUMzQiw2RkFBMkI7UUFDM0IsOEZBQTRCO1FBQzVCLHNHQUFvQztRQUNwQyw0RkFBMEI7UUFDMUIsNkZBQTJCO1FBQzNCLDhGQUE0QjtRQUM1QixpR0FBK0I7UUFDL0IsOEZBQTRCO1FBQzVCLDRGQUEwQjtRQUMxQixzR0FBb0M7UUFDcEMsNkZBQTJCO1FBQzNCLGdHQUE4QjtLQUMvQjtJQUVELE1BQU0sUUFBUSxHQUFhLG1CQUFPLENBQUMsMkdBQWlELENBQUM7SUFFckYsS0FBSyxNQUFNLFFBQVEsSUFBSSxVQUFVLEVBQUU7UUFDakMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLG9CQUFvQixDQUFDLEVBQUU7WUFDdkQsT0FBTyxHQUFHLEtBQUs7WUFDZixNQUFLO1NBQ047UUFFRCxNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUNuQyxvQ0FBb0MsUUFBUSxXQUFXLENBQ3hEO1FBQ0QsSUFBSSxNQUFNO1lBQUUsU0FBUTtRQUVwQixNQUFNLGlCQUFpQixHQUFHLE1BQU0saUVBQVksQ0FBQyxRQUFRLENBQUM7UUFDdEQsSUFBSSxDQUFDLGlCQUFpQixFQUFFO1lBQ3RCLE9BQU8sR0FBRyxLQUFLO1lBQ2YsTUFBSztTQUNOO1FBRUQsSUFBSSxRQUFRLEdBQUcsS0FBSztRQUNwQixVQUFVLENBQUMsR0FBRyxFQUFFO1lBQ2QsSUFBSSxDQUFDLFFBQVE7Z0JBQ1gsQ0FBQyxDQUFDLFVBQVUsQ0FDVixRQUFRLENBQUMsTUFBTSxDQUFDO29CQUNkLElBQUksRUFBRSwrQkFBK0IsUUFBUSxNQUFNO29CQUNuRCxPQUFPLEVBQUUseUVBQTRCLENBQ25DLFFBQVEsQ0FBQyxhQUFhLENBQ3BCLG9DQUFvQyxRQUFRLElBQUksQ0FDakQsRUFBRSxPQUFPLENBQUMsWUFBWSxJQUFJLFFBQVEsQ0FDcEM7aUJBQ0YsQ0FBQyxDQUNIO1FBQ0wsQ0FBQyxFQUFFLElBQUksQ0FBQztRQUVSLE1BQU0sWUFBWSxDQUFDLGlCQUFpQixDQUFDO1FBQ3JDLFFBQVEsR0FBRyxJQUFJO0tBQ2hCO0lBRUQsSUFBSSxPQUFPO1FBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyx3RUFBMkIsQ0FBQztJQUN0RCxPQUFPLEdBQUcsS0FBSztBQUNqQixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDNVJELElBQVksc0JBdUJYO0FBdkJELFdBQVksc0JBQXNCO0lBQ2hDLHlDQUFlO0lBQ2YsaURBQXVCO0lBQ3ZCLGlEQUF1QjtJQUN2Qix1Q0FBYTtJQUNiLHlDQUFlO0lBQ2YseUNBQWU7SUFDZixxQ0FBVztJQUNYLHVDQUFhO0lBQ2IsdUNBQWE7SUFDYix1Q0FBYTtJQUNiLHlDQUFlO0lBQ2YseURBQStCO0lBQy9CLHFDQUFXO0lBQ1gsdUNBQWE7SUFDYix5Q0FBZTtJQUNmLCtDQUFxQjtJQUNyQix5Q0FBZTtJQUNmLHFDQUFXO0lBQ1gseURBQStCO0lBQy9CLG1EQUF5QjtJQUN6Qix1Q0FBYTtJQUNiLDZDQUFtQjtBQUNyQixDQUFDLEVBdkJXLHNCQUFzQixLQUF0QixzQkFBc0IsUUF1QmpDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3RCNEM7QUFDSTtBQUNWO0FBQ2M7QUFDSjtBQUkxQyxLQUFLLFVBQVUsYUFBYTtJQUNqQyxNQUFNLFNBQVMsR0FBRyxNQUFNLFVBQVUsRUFBRTtJQUNwQyxJQUFJLFNBQVM7UUFBRSxNQUFNLGtFQUFrQixFQUFFO0lBQ3pDLE9BQU8sU0FBUztBQUNsQixDQUFDO0FBRUQsS0FBSyxVQUFVLGVBQWUsQ0FBQyxTQUEwQjtJQUN2RCxNQUFNLG9GQUFnQyxDQUFDLFNBQVMsQ0FBQztJQUNqRCxNQUFNLGtFQUFrQixFQUFFO0FBQzVCLENBQUM7QUFFRCxLQUFLLFVBQVUsVUFBVTtJQUN2QixNQUFNLFFBQVEsR0FBYSxtQkFBTyxDQUFDLG1HQUE2QyxDQUFDO0lBRWpGLE9BQU8sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FDM0IsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUNOLE9BQU8sRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsU0FBUywwREFBRSxDQUFDO1FBQ3ZDLE9BQU8sRUFBRSxVQUFVLENBQUMsRUFBRTtZQUNwQixVQUFVLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDO1lBQ3ZDLFVBQVUsQ0FBQyxRQUFRLENBQUMsc0JBQXNCLENBQUM7WUFFM0MsTUFBTSxVQUFVLEdBQ2QsUUFBUSxDQUFDLGFBQWEsQ0FBb0Isa0JBQWtCLENBQUM7WUFDL0QsSUFBSSxDQUFDLFVBQVU7Z0JBQUUsT0FBTTtZQUV2QixRQUFRO2lCQUNMLGFBQWEsQ0FBbUIsY0FBYyxDQUFDO2dCQUNoRCxFQUFFLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsRUFBRTtnQkFDbEMsSUFBSSxLQUFLLENBQUMsR0FBRyxLQUFLLE9BQU87b0JBQUUsVUFBVSxDQUFDLEtBQUssRUFBRTtnQkFFN0MsSUFBSSxRQUFRLENBQUMsYUFBYSxDQUFtQixjQUFjLENBQUMsRUFBRSxLQUFLO29CQUNqRSxVQUFVLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7O29CQUNwQyxVQUFVLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUM7WUFDM0MsQ0FBQyxDQUFDO1lBRUosVUFBVSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLGNBQWMsRUFBRSxVQUFVLENBQUM7UUFDbkUsQ0FBQztRQUNELE9BQU8sRUFBRTtZQUNQLEtBQUssRUFBRTtnQkFDTCxJQUFJLEVBQUUsRUFBRTtnQkFDUixLQUFLLEVBQUUsT0FBTztnQkFDZCxNQUFNLEVBQUUsR0FBRyxFQUFFO29CQUNYLE9BQU8sQ0FBQyxJQUFJLENBQUM7b0JBQ2IsT0FBTyxJQUFJO2dCQUNiLENBQUM7YUFDRjtZQUNELElBQUksRUFBRTtnQkFDSixJQUFJLEVBQUUsNkZBQWdEO2dCQUN0RCxLQUFLLEVBQUUsU0FBUztnQkFDaEIsTUFBTSxFQUFFLEdBQUcsRUFBRTtvQkFDWCxNQUFNLElBQUksR0FDUixRQUFRLENBQUMsYUFBYSxDQUFtQixjQUFjLENBQUMsRUFBRSxLQUFLO29CQUNqRSxJQUFJLENBQUMsSUFBSTt3QkFBRSxPQUFPLEtBQUs7b0JBRXZCLE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLHFCQUFxQixDQUFDO29CQUMxRCxJQUFJLENBQUMsTUFBTTt3QkFBRSxPQUFPLEtBQUs7b0JBQ3pCLE1BQU0sS0FBSyxHQUFHLG9EQUFXLENBQUMsTUFBTSxDQUFDO29CQUVqQyxLQUFLLFVBQVUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztvQkFDMUMsT0FBTyxJQUFJO2dCQUNiLENBQUM7YUFDRjtTQUNGO0tBQ0YsQ0FBQyxDQUNIO0FBQ0gsQ0FBQztBQUVNLFNBQVMsYUFBYSxDQUFDLFNBQTBCO0lBQ3RELE1BQU0sUUFBUSxHQUFhLG1CQUFPLENBQUMsdUdBQStDLENBQUM7SUFFbkYsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUNOLE9BQU8sRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxTQUFTLEVBQUUsU0FBUywwREFBRSxDQUFDO1FBQ3JELE9BQU8sRUFBRSxVQUFVLENBQUMsRUFBRTtZQUNwQixVQUFVLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDO1lBQ3ZDLFVBQVUsQ0FBQyxRQUFRLENBQUMsc0JBQXNCLENBQUM7UUFDN0MsQ0FBQztRQUNELE9BQU8sRUFBRTtZQUNQLEtBQUssRUFBRTtnQkFDTCxJQUFJLEVBQUUsRUFBRTtnQkFDUixLQUFLLEVBQUUsT0FBTztnQkFDZCxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSTthQUNuQjtZQUNELE1BQU0sRUFBRTtnQkFDTixJQUFJLEVBQUUsbUdBQW1EO2dCQUN6RCxLQUFLLEVBQUUsU0FBUztnQkFDaEIsTUFBTSxFQUFFLEdBQUcsRUFBRTtvQkFDWCxLQUFLLGVBQWUsQ0FBQyxTQUFTLENBQUM7b0JBQy9CLE9BQU8sSUFBSTtnQkFDYixDQUFDO2FBQ0Y7WUFDRCxJQUFJLEVBQUU7Z0JBQ0osSUFBSSxFQUFFLDhGQUFpRDtnQkFDdkQsS0FBSyxFQUFFLFNBQVM7Z0JBQ2hCLE1BQU0sRUFBRSxHQUFHLEVBQUU7b0JBQ1gsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMscUJBQXFCLENBQUM7b0JBQzFELElBQUksQ0FBQyxNQUFNO3dCQUFFLE9BQU8sS0FBSztvQkFFekIsS0FBSyxDQUFDLEtBQUssSUFBbUIsRUFBRSxDQUM5QiwrREFBVSxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtvQkFFeEMsT0FBTyxJQUFJO2dCQUNiLENBQUM7YUFDRjtZQUNELE1BQU0sRUFBRTtnQkFDTixJQUFJLEVBQUUsaUdBQW9EO2dCQUMxRCxLQUFLLEVBQUUsU0FBUztnQkFDaEIsTUFBTSxFQUFFLEdBQUcsRUFBRTtvQkFDWCxVQUFVLENBQ1IsR0FBRyxFQUFFLENBQ0gsS0FBSyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUU7d0JBQ25ELElBQUksU0FBUzs0QkFBRSxLQUFLLGtFQUFrQixFQUFFO29CQUMxQyxDQUFDLENBQUMsRUFDSixHQUFHLENBQ0o7b0JBRUQsT0FBTyxJQUFJO2dCQUNiLENBQUM7YUFDRjtTQUNGO0tBQ0YsQ0FBQztBQUNKLENBQUM7QUFFRCxLQUFLLFVBQVUsVUFBVSxDQUN2QixJQUFZLEVBQ1osS0FBcUI7SUFFckIsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLE9BQU8sQ0FBTyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUN2RCxRQUFRO2FBQ0wsYUFBYSxDQUFvQiw0QkFBNEIsQ0FBQztZQUMvRCxFQUFFLE1BQU0sQ0FDTixJQUFJLENBQUMsRUFBRTtZQUNMLElBQUksSUFBSTtnQkFBRSxPQUFPLENBQUMsSUFBSSxDQUFDOztnQkFDbEIsTUFBTSxDQUFDLHFCQUFxQixDQUFDO1FBQ3BDLENBQUMsRUFDRCxXQUFXLEVBQ1gsQ0FBQyxDQUNGO0lBQ0wsQ0FBQyxDQUFDO0lBRUYsTUFBTSxTQUFTLEdBQUcsTUFBTSxpRkFBNkIsQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUM7SUFDNUUsT0FBTyxFQUFFLEdBQUcsU0FBUyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQ3pELENBQUM7QUFFTSxLQUFLLFVBQVUsbUJBQW1CLENBQ3ZDLFNBQTBCO0lBRTFCLE1BQU0sUUFBUSxHQUFhLG1CQUFPLENBQUMscUhBQXNELENBQUM7SUFDMUYsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQztRQUMvQixHQUFHLFNBQVM7UUFDWixLQUFLLEVBQUUsZ0dBQW1ELENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztRQUMxRSxTQUFTO0tBQ1YsQ0FBQztJQUVGLE9BQU8sSUFBSSxPQUFPLENBQXlCLE9BQU8sQ0FBQyxFQUFFO1FBQ25ELENBQUMsQ0FBQyxLQUFLLENBQUM7WUFDTixPQUFPLEVBQUUsUUFBUTtZQUNqQixPQUFPLEVBQUUsVUFBVSxDQUFDLEVBQUU7Z0JBQ3BCLFVBQVUsQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUM7Z0JBQ3ZDLFVBQVUsQ0FBQyxRQUFRLENBQUMsc0JBQXNCLENBQUM7Z0JBRTNDLE1BQU0sWUFBWSxHQUNoQixRQUFRLENBQUMsYUFBYSxDQUFvQixvQkFBb0IsQ0FBQztnQkFDakUsSUFBSSxDQUFDLFlBQVk7b0JBQUUsT0FBTTtnQkFFekIsUUFBUTtxQkFDTCxhQUFhLENBQW1CLGNBQWMsQ0FBQztvQkFDaEQsRUFBRSxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLEVBQUU7b0JBQ2xDLElBQUksS0FBSyxDQUFDLEdBQUcsS0FBSyxPQUFPO3dCQUFFLFlBQVksQ0FBQyxLQUFLLEVBQUU7b0JBRS9DLElBQUksUUFBUSxDQUFDLGFBQWEsQ0FBbUIsY0FBYyxDQUFDLEVBQUUsS0FBSzt3QkFDakUsWUFBWSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDOzt3QkFDdEMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDO2dCQUM3QyxDQUFDLENBQUM7Z0JBRUosWUFBWSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLGNBQWMsRUFBRSxVQUFVLENBQUM7WUFDckUsQ0FBQztZQUNELE9BQU8sRUFBRTtnQkFDUCxLQUFLLEVBQUU7b0JBQ0wsSUFBSSxFQUFFLEVBQUU7b0JBQ1IsS0FBSyxFQUFFLE9BQU87b0JBQ2QsTUFBTSxFQUFFLEdBQUcsRUFBRTt3QkFDWCxPQUFPLENBQUMsSUFBSSxDQUFDO3dCQUNiLE9BQU8sSUFBSTtvQkFDYixDQUFDO2lCQUNGO2dCQUNELE1BQU0sRUFBRTtvQkFDTixJQUFJLEVBQUUsaUdBQW9EO29CQUMxRCxLQUFLLEVBQUUsU0FBUztvQkFDaEIsTUFBTSxFQUFFLEdBQUcsRUFBRTt3QkFDWCxNQUFNLElBQUksR0FDUixRQUFRLENBQUMsYUFBYSxDQUFtQixjQUFjLENBQUMsRUFBRSxLQUFLO3dCQUNqRSxJQUFJLENBQUMsSUFBSTs0QkFBRSxPQUFPLEtBQUs7d0JBRXZCLEtBQUssb0ZBQ21CLENBQUMsRUFBRSxHQUFHLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQzs2QkFDN0MsSUFBSSxDQUFDLE9BQU8sQ0FBQzt3QkFFaEIsT0FBTyxJQUFJO29CQUNiLENBQUM7aUJBQ0Y7YUFDRjtTQUNGLENBQUM7SUFDSixDQUFDLENBQUM7QUFDSixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbE40QztBQUNMO0FBR2pDLFNBQVMsYUFBYTtJQUMzQixxREFBWSxDQUFDLHFCQUFxQixDQUFDO0FBQ3JDLENBQUM7QUFFTSxTQUFTLFlBQVk7SUFDMUIsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUM7SUFDN0MsS0FBSyxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDO0lBQ2xDLEtBQUssQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLGtCQUFrQixDQUFDO0lBQ2hELEtBQUssQ0FBQyxLQUFLLEVBQUU7SUFFYixLQUFLLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxFQUFFO1FBQ3RDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTTtZQUFFLE9BQU07UUFDekIsTUFBTSxLQUFLLEdBQUksS0FBSyxDQUFDLE1BQTJCLENBQUMsS0FBSztRQUN0RCxJQUFJLENBQUMsS0FBSztZQUFFLE9BQU07UUFDbEIsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNyQixJQUFJLENBQUMsSUFBSTtZQUFFLE9BQU07UUFDakIsS0FBSyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBQyxLQUFLLEVBQUMsRUFBRTtZQUNsQyxJQUFJLENBQUMsS0FBSztnQkFBRSxPQUFNO1lBRWxCLE1BQU0sTUFBTSxHQUFtQixJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztZQUNoRCxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQztZQUMxRCxJQUFJLENBQUMsTUFBTTtnQkFBRSxPQUFNO1lBRW5CLE1BQU0sVUFBVSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7UUFDbEMsQ0FBQyxDQUFDO0lBQ0osQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQUVELFNBQVMsYUFBYTtJQUNwQixNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQztJQUMxRCxJQUFJLENBQUMsTUFBTTtRQUFFLE9BQU07SUFFbkIsS0FBSyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNwRCxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUNyQyxJQUFJLENBQUMsVUFBVTtZQUFFLFNBQVE7UUFFekIsTUFBTSxJQUFJLEdBQUcsVUFBVSxDQUFDLE9BQU8sRUFBRTtRQUNqQyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDL0MsQ0FBQyxDQUFDLG9CQUFvQixJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDO1NBQzFEO0tBQ0Y7QUFDSCxDQUFDO0FBRU0sS0FBSyxVQUFVLFNBQVMsQ0FBQyxLQUFhO0lBQzNDLE9BQU8sSUFBSSxPQUFPLENBQXdCLENBQUMsT0FBTyxFQUFRLEVBQUU7UUFDMUQsTUFBTSxjQUFjLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FDM0MsMkJBQTJCLEtBQUssRUFBRSxDQUNuQztRQUNELElBQUksY0FBYztZQUFFLE9BQU8sT0FBTyxDQUFDLGNBQWMsQ0FBQztRQUVsRCxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQztRQUMxRCxJQUFJLENBQUMsTUFBTTtZQUFFLE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQztRQUVqQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQ1IscUJBQXFCLEtBQUssRUFBRSxFQUM1QixFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsY0FBYyxFQUFFLEVBQUUsRUFDdEMsQ0FBQyxJQUFZLEVBQVEsRUFBRTtZQUNyQixDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsUUFBUSxDQUFDLG1CQUFtQixDQUFDO1lBQzVDLE9BQU8sQ0FDTCxRQUFRLENBQUMsYUFBYSxDQUNwQiwyQkFBMkIsS0FBSyxFQUFFLENBQ25DLENBQ0Y7UUFDSCxDQUFDLENBQ0Y7SUFDSCxDQUFDLENBQUM7QUFDSixDQUFDO0FBRU0sS0FBSyxVQUFVLFlBQVksQ0FDaEMsUUFBZ0I7SUFFaEIsT0FBTyxJQUFJLE9BQU8sQ0FBd0IsQ0FBQyxPQUFPLEVBQVEsRUFBRTtRQUMxRCxNQUFNLGlCQUFpQixHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQzlDLDhCQUE4QixRQUFRLEVBQUUsQ0FDekM7UUFDRCxJQUFJLGlCQUFpQjtZQUFFLE9BQU8sT0FBTyxDQUFDLGlCQUFpQixDQUFDO1FBRXhELEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyx3QkFBd0IsUUFBUSxFQUFFLEVBQUUsQ0FBQyxJQUFZLEVBQVEsRUFBRTtZQUNyRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsUUFBUSxDQUFDLG1CQUFtQixDQUFDO1lBQzVDLE9BQU8sQ0FDTCxRQUFRLENBQUMsYUFBYSxDQUNwQiw4QkFBOEIsUUFBUSxFQUFFLENBQ3pDLENBQ0Y7UUFDSCxDQUFDLENBQUM7SUFDSixDQUFDLENBQUM7QUFDSixDQUFDO0FBRU0sS0FBSyxVQUFVLFVBQVUsQ0FDOUIsTUFBYyxFQUNkLE1BQXNCO0lBRXRCLENBQUMsQ0FBQyxVQUFVLENBQUMsc0ZBQXlDLENBQUM7SUFFdkQscUJBQXFCO0lBQ3JCLE1BQU0sVUFBVSxHQUFHLElBQUksR0FBRyxFQUFVO0lBQ3BDLEtBQUssTUFBTSxRQUFRLElBQUksTUFBTTtRQUMzQixJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUM7WUFBRSxVQUFVLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7SUFFakUsc0JBQXNCO0lBQ3RCLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FDZixLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUMsUUFBUSxFQUFDLEVBQUUsQ0FDbkQsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUN2QixDQUNGO0lBRUQsaUJBQWlCO0lBQ2pCLE1BQU0sTUFBTSxHQUFHLElBQUksR0FBRyxFQUFVO0lBQ2hDLEtBQUssTUFBTSxRQUFRLElBQUksTUFBTTtRQUMzQixJQUNFLFFBQVEsQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLFFBQVEsQ0FBQyxLQUFLLElBQUksQ0FBQztZQUMxRCxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO1lBRTVCLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQztJQUU5QixrQkFBa0I7SUFDbEIsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUNmLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBQyxLQUFLLEVBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUNqRTtJQUVELHNDQUFzQztJQUN0QyxNQUFNLFNBQVMsR0FBVyxFQUFFO0lBQzVCLEtBQUssTUFBTSxRQUFRLElBQUksTUFBTSxFQUFFO1FBQzdCLE1BQU0sSUFBSSxHQUFHLGNBQWMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO1FBQ3hDLElBQUksSUFBSTtZQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0tBQy9CO0lBRUQsYUFBYSxFQUFFO0lBQ2YsTUFBTSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUM7SUFDMUIsdUJBQXVCLEVBQUU7SUFDekIsMEJBQTBCLEVBQUU7SUFFNUIsTUFBTSxhQUFhLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQztJQUMvRCxJQUFJLGFBQWE7UUFBRSxhQUFhLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxTQUFTO0lBRTFELENBQUMsQ0FBQyxVQUFVLENBQUMscUZBQXdDLENBQUM7QUFDeEQsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzNJZ0M7QUFFMUIsU0FBUyxzQkFBc0I7SUFDcEMsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLGdCQUFnQixDQUN0QywySEFBMkgsQ0FDNUg7SUFDRCxLQUFLLE1BQU0sR0FBRyxJQUFJLE1BQU0sRUFBRTtRQUN4QixHQUFHLENBQUMsTUFBTSxFQUFFO0tBQ2I7QUFDSCxDQUFDO0FBRUQ7OztHQUdHO0FBQ0ksU0FBUyxrQkFBa0IsQ0FBQyxJQUFZO0lBQzdDLE1BQU0sUUFBUSxHQUFHLCtEQUFzQixFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsS0FBSyxJQUFJLENBQUM7SUFDeEUsSUFBSSxDQUFDLFFBQVE7UUFBRSxPQUFPLElBQUk7SUFFMUIsTUFBTSxNQUFNLEdBQUcsbUVBQTBCLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQztJQUM5RCxNQUFNLFlBQVksR0FBYSxtQkFBTyxDQUFDLHlGQUF3QyxDQUFDO0lBQ2hGLE1BQU0sYUFBYSxHQUFhLG1CQUFPLENBQUMsdUdBQStDLENBQUM7SUFDeEYsUUFBUTtTQUNMLGFBQWEsQ0FBaUIsbUJBQW1CLENBQUM7UUFDbkQsRUFBRSxrQkFBa0IsQ0FDbEIsV0FBVyxFQUNYLE1BQU07U0FDSCxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FDWCxhQUFhLENBQUMsTUFBTSxDQUFDO1FBQ25CLEdBQUcsS0FBSztRQUNSLEtBQUssRUFBRSwwREFDSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7YUFDckIsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUN0QyxJQUFJLENBQUMsSUFBSSxDQUFDO0tBQ2QsQ0FBQyxDQUNIO1NBQ0EsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUNkO0lBQ0gsT0FBTyxRQUFRO0FBQ2pCLENBQUM7QUFFRDs7O0dBR0c7QUFDSSxTQUFTLGVBQWUsQ0FBQyxFQUFVO0lBQ3hDLE1BQU0sS0FBSyxHQUFHLDBEQUFpQixDQUFDLEVBQUUsQ0FBQztJQUNuQyxJQUFJLENBQUMsS0FBSztRQUFFLE9BQU8sSUFBSTtJQUV2QixNQUFNLFlBQVksR0FBYSxtQkFBTyxDQUFDLHlGQUF3QyxDQUFDO0lBQ2hGLE1BQU0sYUFBYSxHQUFhLG1CQUFPLENBQUMsdUdBQStDLENBQUM7SUFDeEYsUUFBUTtTQUNMLGFBQWEsQ0FBaUIsbUJBQW1CLENBQUM7UUFDbkQsRUFBRSxrQkFBa0IsQ0FDbEIsV0FBVyxFQUNYLGFBQWEsQ0FBQyxNQUFNLENBQUM7UUFDbkIsR0FBRyxLQUFLO1FBQ1IsS0FBSyxFQUFFLDBEQUNJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQzthQUNyQixHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3RDLElBQUksQ0FBQyxJQUFJLENBQUM7S0FDZCxDQUFDLENBQ0g7SUFDSCxPQUFPLEtBQUs7QUFDZCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDOURELE1BQU0sUUFBUTtJQUNLLFVBQVUsR0FBdUMsRUFBRTtJQUVuRCxNQUFNLEdBQW9DLEVBQUU7SUFFNUMsS0FBSyxHQUFtQyxFQUFFO0lBRTNELGNBQWMsQ0FBdUI7SUFFckMsYUFBYTtRQUNYLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQ3ZDLENBQUM7SUFFRCxXQUFXLENBQUMsRUFBVTtRQUNwQixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDO0lBQzVCLENBQUM7SUFFRCxpQkFBaUIsQ0FBQyxVQUFrQjtRQUNsQyxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FDdEMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsVUFBVSxLQUFLLFVBQVUsQ0FDekM7SUFDSCxDQUFDO0lBRUQsUUFBUSxDQUFDLEVBQVU7UUFDakIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztJQUN4QixDQUFDO0lBRUQsU0FBUztRQUNQLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ25DLENBQUM7SUFFRCxPQUFPLENBQUMsRUFBVTtRQUNoQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxRQUFRLENBQUMsS0FBYTtRQUNwQixPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssS0FBSyxDQUFDO0lBQ3ZFLENBQUM7SUFFRCxXQUFXLENBQUMsUUFBNEI7UUFDdEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEdBQUcsUUFBUTtJQUNqRCxDQUFDO0lBRUQsUUFBUSxDQUFDLEtBQXNCO1FBQzdCLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUs7SUFDbEMsQ0FBQztJQUVELE9BQU8sQ0FBQyxJQUFvQjtRQUMxQixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJO0lBQ2hDLENBQUM7Q0FDRjtBQUVELGlFQUFlLElBQUksUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7OztBQ3pEZ0I7QUFHdEMsTUFBTSx5QkFBeUIsR0FBaUI7SUFDckQsZUFBZSxFQUNiLHVHQUF1RztJQUN6RyxFQUFFLEVBQUUsd0ZBQTJDO0lBQy9DLElBQUksRUFBRSxpREFBaUQ7SUFDdkQsRUFBRSxFQUFFLDZCQUE2QjtJQUNqQyxDQUFDLEVBQUUsMkZBQThDO0NBQ2xEOzs7Ozs7Ozs7Ozs7Ozs7OztBQ1Y0QztBQUd0QyxNQUFNLG9CQUFvQixHQUFpQjtJQUNoRCxlQUFlLEVBQ2Isa0dBQWtHO0lBQ3BHLEVBQUUsRUFBRSx3QkFBd0I7SUFDNUIsRUFBRSxFQUFFLG1GQUFzQztJQUMxQyxDQUFDLEVBQUUsc0ZBQXlDO0NBQzdDOzs7Ozs7Ozs7Ozs7Ozs7OztBQ1Q0QztBQUd0QyxNQUFNLHdCQUF3QixHQUFpQjtJQUNwRCxlQUFlLEVBQ2Isc0dBQXNHO0lBQ3hHLEVBQUUsRUFBRSw0QkFBNEI7SUFDaEMsRUFBRSxFQUFFLHVGQUEwQztJQUM5QyxDQUFDLEVBQUUsMEZBQTZDO0NBQ2pEOzs7Ozs7Ozs7Ozs7Ozs7OztBQ1Q0QztBQUd0QyxNQUFNLFVBQVUsR0FBaUI7SUFDdEMsZUFBZSxFQUNiLHlHQUF5RztJQUMzRyxFQUFFLEVBQUUsMEZBQTZDO0lBQ2pELElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTO0lBQzlCLEVBQUUsRUFBRSwrQkFBK0I7SUFDbkMsQ0FBQyxFQUFFLDZGQUFnRDtDQUNwRDs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNWNEM7QUFHdEMsTUFBTSxnQkFBZ0IsR0FBaUI7SUFDNUMsZUFBZSxFQUNiLDZGQUE2RjtJQUMvRixFQUFFLEVBQUUsbUJBQW1CO0lBQ3ZCLEVBQUUsRUFBRSw4RUFBaUM7SUFDckMsQ0FBQyxFQUFFLGlGQUFvQztDQUN4Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDVEQsdURBQXVEO0FBQ3ZELCtEQUErRDtBQUM1QjtBQUN5QjtBQUVyRCxTQUFTLGNBQWM7SUFDNUIscURBQXFEO0lBQ3JELENBQUM7SUFBQyxNQUFtQyxDQUFDLGtCQUFrQixHQUFHLGtCQUFrQixDQUM1RTtJQUFDLE1BQW1DLENBQUMsZ0JBQWdCLEdBQUcsZ0JBQWdCO0FBQzNFLENBQUM7QUFFRCxLQUFLLFVBQVUsa0JBQWtCO0lBQy9CLCtFQUFxQixHQUFHLElBQUk7SUFDNUIsa0RBQVksQ0FBQyx3QkFBd0IsQ0FBQztJQUN0QyxNQUFNLE1BQU0sRUFBRTtBQUNoQixDQUFDO0FBRUQsS0FBSyxVQUFVLGdCQUFnQjtJQUM3QiwrRUFBcUIsR0FBRyxLQUFLO0lBQzdCLGtEQUFZLENBQUMsc0JBQXNCLENBQUM7SUFDcEMsTUFBTSxNQUFNLEVBQUU7QUFDaEIsQ0FBQztBQUVELEtBQUssVUFBVSxNQUFNO0lBQ25CLE1BQU0sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3ZELGlEQUFXLENBQUMsY0FBYyxDQUFDO0lBQzNCLE1BQU0sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3ZELFFBQVEsQ0FBQyxNQUFNLEVBQUU7QUFDbkIsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM1QjJEO0FBRXJELE1BQU0sT0FBTztJQUNWLE1BQU0sQ0FBVSxPQUFPLEdBQUcsT0FBTztJQUV6QyxnQkFBdUIsQ0FBQztJQUVoQixNQUFNLEtBQUssU0FBUztRQUMxQixPQUFPLDRFQUFrQjtJQUMzQixDQUFDO0lBRU8sTUFBTSxLQUFLLElBQUk7UUFDckIsT0FBTyxJQUFJLElBQUksRUFBRSxDQUFDLGtCQUFrQixFQUFFO0lBQ3hDLENBQUM7SUFFRCxNQUFNLENBQUMsTUFBTSxDQUNYLEtBQWMsRUFDZCxPQUFlLEVBQ2YsR0FBRyxjQUF5QjtRQUU1QixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVM7WUFBRSxPQUFNO1FBQzNCLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUUsR0FBRyxjQUFjLENBQUM7SUFDeEUsQ0FBQztJQUVELE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBZSxFQUFFLEdBQUcsY0FBeUI7UUFDeEQsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTO1lBQUUsT0FBTTtRQUMzQixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUUsR0FBRyxjQUFjLENBQUM7SUFDaEUsQ0FBQztJQUVELE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBZSxFQUFFLEdBQUcsY0FBeUI7UUFDeEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEdBQUcsY0FBYyxDQUFDO0lBQ2hFLENBQUM7SUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQWUsRUFBRSxHQUFHLGNBQXlCO1FBQ3ZELElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUztZQUFFLE9BQU07UUFDM0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEdBQUcsY0FBYyxDQUFDO0lBQy9ELENBQUM7SUFFRCxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQWUsRUFBRSxHQUFHLGNBQXlCO1FBQ3RELElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUztZQUFFLE9BQU07UUFDM0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEdBQUcsY0FBYyxDQUFDO0lBQzlELENBQUM7SUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQWUsRUFBRSxHQUFHLGNBQXlCO1FBQ3ZELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRSxHQUFHLGNBQWMsQ0FBQztJQUMvRCxDQUFDO0lBRU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFlO1FBQ25DLE9BQU87WUFDTCxRQUFRLElBQUksQ0FBQyxJQUFJLEtBQUs7WUFDdEIsZUFBZTtZQUNmLFlBQVk7WUFDWixlQUFlO1lBQ2YsT0FBTztTQUNSO0lBQ0gsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN2RGdDO0FBQ1M7QUFFNUMsU0FBUyxjQUFjLENBQUMsTUFBeUIsRUFBRSxJQUFZO0lBQzdELE1BQU0sQ0FBQyxNQUFNLENBQ1gsSUFBSSxDQUFDLEVBQUU7UUFDTCxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ1QsbURBQWEsQ0FBQyxpQkFBaUIsQ0FBQztZQUNoQyxDQUFDLENBQUMsVUFBVSxDQUFDLDJFQUE4QixDQUFDO1lBQzVDLE9BQU07U0FDUDtRQUVELE1BQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDO1FBRXJDLE1BQU0sQ0FBQyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDO1FBQ3JDLENBQUMsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQztRQUMzQixDQUFDLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxHQUFHLElBQUksTUFBTSxDQUFDO1FBQ3pDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU07UUFFeEIsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBQzVCLENBQUMsQ0FBQyxLQUFLLEVBQUU7UUFDVCxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7UUFFNUIsR0FBRyxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUM7SUFDMUIsQ0FBQyxFQUNELFdBQVcsRUFDWCxDQUFDLENBQ0Y7QUFDSCxDQUFDO0FBRU0sU0FBUyxZQUFZO0lBQzFCLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQ25DLCtCQUErQixDQUNoQztJQUNELElBQUksQ0FBQyxNQUFNLEVBQUU7UUFDWCxrREFBWSxDQUFDLG9DQUFvQyxDQUFDO1FBQ2xELE9BQU07S0FDUDtJQUVELGNBQWMsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDO0FBQ2hDLENBQUM7QUFFTSxTQUFTLGdCQUFnQjtJQUM5QixNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUNuQyw0QkFBNEIsQ0FDN0I7SUFDRCxJQUFJLENBQUMsTUFBTSxFQUFFO1FBQ1gsa0RBQVksQ0FBQyw2QkFBNkIsQ0FBQztRQUMzQyxPQUFNO0tBQ1A7SUFFRCxjQUFjLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJLFVBQVUsQ0FBQztBQUNqRCxDQUFDO0FBRU0sU0FBUyxrQkFBa0I7SUFDaEMsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FDbkMsNEJBQTRCLENBQzdCO0lBQ0QsSUFBSSxDQUFDLE1BQU0sRUFBRTtRQUNYLGtEQUFZLENBQUMsNkJBQTZCLENBQUM7UUFDM0MsT0FBTTtLQUNQO0lBRUQsY0FBYyxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsSUFBSSxVQUFVLENBQUM7QUFDakQsQ0FBQztBQUVNLFNBQVMsZUFBZTtJQUM3QixNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUNuQyw2QkFBNkIsQ0FDOUI7SUFDRCxNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsYUFBYSxDQUNsQyw4QkFBOEIsQ0FDL0I7SUFDRCxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsS0FBSztRQUFFLE9BQU07SUFFN0IsY0FBYyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsV0FBVyxFQUFFLElBQUksRUFBRSxJQUFJLFVBQVUsQ0FBQztBQUNqRSxDQUFDO0FBRU0sU0FBUyxPQUFPO0lBQ3JCLE9BQU8sQ0FDTCxRQUFRLENBQUMsYUFBYSxDQUFDLGdDQUFnQyxDQUFDLEVBQUUsV0FBVztRQUNyRSxJQUFJLENBQ0w7QUFDSCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7OztBQ25GRCxJQUFZLFlBdUJYO0FBdkJELFdBQVksWUFBWTtJQUN0Qiw2REFBZTtJQUNmLHNEQUEyQjtJQUMzQix1REFBb0I7SUFDcEIscURBQWtCO0lBQ2xCLG9EQUFlO0lBQ2YsdURBQWM7SUFFZCx5REFBOEM7SUFDOUMsOERBQWtCO0lBQ2xCLGlFQUFxQjtJQUNyQix3RUFBeUI7SUFFekIsc0JBQXNCO0lBQ3RCLDJEQUFxQjtJQUNyQixzRUFBbUI7SUFDbkIsaUVBQXFCO0lBQ3JCLG9FQUFtQjtJQUNuQiwrREFBaUI7SUFDakIsZ0VBQWM7SUFFZCxlQUFlO0lBQ2YsMERBQWlCO0FBQ25CLENBQUMsRUF2QlcsWUFBWSxLQUFaLFlBQVksUUF1QnZCO0FBRU0sTUFBTSxRQUFRO0lBQ0U7SUFBd0I7SUFBN0MsWUFBcUIsS0FBYSxFQUFXLElBQWtCO1FBQTFDLFVBQUssR0FBTCxLQUFLLENBQVE7UUFBVyxTQUFJLEdBQUosSUFBSSxDQUFjO0lBQUcsQ0FBQztJQUVuRSxNQUFNLENBQUMsUUFBa0I7UUFDdkIsT0FBTyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQzNFLENBQUM7SUFFRCxLQUFLLENBQUMsUUFBa0I7UUFDdEIsT0FBTyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQzNFLENBQUM7SUFFRCxRQUFRLENBQUMsUUFBa0I7UUFDekIsT0FBTyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQzNFLENBQUM7SUFFRCxJQUFJLENBQUMsUUFBa0I7UUFDckIsT0FBTyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQzNFLENBQUM7SUFFRCxFQUFFLENBQUMsSUFBa0I7UUFDbkIsT0FBTyxJQUFJLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksRUFBRSxJQUFJLENBQUM7SUFDNUQsQ0FBQztDQUNGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FFL0NNLFNBQVMsUUFBUSxDQUFDLElBQVk7SUFDbkMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUM7SUFDbkMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUM7SUFDakMsSUFBSSxLQUFLLEtBQUssQ0FBQyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQztRQUFFLE9BQU8sSUFBSTtJQUUzQyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FB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QUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9lbGRhcnlhLWVuaGFuY2VtZW50cy8uL25vZGVfbW9kdWxlcy8ucG5wbS9ibG9iLXV0aWxAMi4wLjIvbm9kZV9tb2R1bGVzL2Jsb2ItdXRpbC9kaXN0L2Jsb2ItdXRpbC5lcy5qcyIsIndlYnBhY2s6Ly9lbGRhcnlhLWVuaGFuY2VtZW50cy8uL25vZGVfbW9kdWxlcy8ucG5wbS9ob2dhbi5qc0AzLjAuMi9ub2RlX21vZHVsZXMvaG9nYW4uanMvbGliL2NvbXBpbGVyLmpzIiwid2VicGFjazovL2VsZGFyeWEtZW5oYW5jZW1lbnRzLy4vbm9kZV9tb2R1bGVzLy5wbnBtL2hvZ2FuLmpzQDMuMC4yL25vZGVfbW9kdWxlcy9ob2dhbi5qcy9saWIvaG9nYW4uanMiLCJ3ZWJwYWNrOi8vZWxkYXJ5YS1lbmhhbmNlbWVudHMvLi9ub2RlX21vZHVsZXMvLnBucG0vaG9nYW4uanNAMy4wLjIvbm9kZV9tb2R1bGVzL2hvZ2FuLmpzL2xpYi90ZW1wbGF0ZS5qcyIsIndlYnBhY2s6Ly9lbGRhcnlhLWVuaGFuY2VtZW50cy8uL3NyYy90ZW1wbGF0ZXMvaHRtbC9hcHBlYXJhbmNlX2l0ZW0uaHRtbCIsIndlYnBhY2s6Ly9lbGRhcnlhLWVuaGFuY2VtZW50cy8uL3NyYy90ZW1wbGF0ZXMvaHRtbC9hcHBlYXJhbmNlX2l0ZW1zX2NhdGVnb3J5Lmh0bWwiLCJ3ZWJwYWNrOi8vZWxkYXJ5YS1lbmhhbmNlbWVudHMvLi9zcmMvdGVtcGxhdGVzL2h0bWwvYXBwZWFyYW5jZV9pdGVtc19ncm91cC5odG1sIiwid2VicGFjazovL2VsZGFyeWEtZW5oYW5jZW1lbnRzLy4vc3JjL3RlbXBsYXRlcy9odG1sL2F1dG9fYnV5X2J1dHRvbi5odG1sIiwid2VicGFjazovL2VsZGFyeWEtZW5oYW5jZW1lbnRzLy4vc3JjL3RlbXBsYXRlcy9odG1sL2F1dG9fYnV5X2ZsYXZyLmh0bWwiLCJ3ZWJwYWNrOi8vZWxkYXJ5YS1lbmhhbmNlbWVudHMvLi9zcmMvdGVtcGxhdGVzL2h0bWwvYXV0b19idXlfZmxhdnJfbWFsbC5odG1sIiwid2VicGFjazovL2VsZGFyeWEtZW5oYW5jZW1lbnRzLy4vc3JjL3RlbXBsYXRlcy9odG1sL2F1dG9fZXhwbG9yZV9idXR0b24uaHRtbCIsIndlYnBhY2s6Ly9lbGRhcnlhLWVuaGFuY2VtZW50cy8uL3NyYy90ZW1wbGF0ZXMvaHRtbC9jYXJvdXNlbF9uZXdzLmh0bWwiLCJ3ZWJwYWNrOi8vZWxkYXJ5YS1lbmhhbmNlbWVudHMvLi9zcmMvdGVtcGxhdGVzL2h0bWwvY2hhbmdlX3ByaWNlX2ZsYXZyLmh0bWwiLCJ3ZWJwYWNrOi8vZWxkYXJ5YS1lbmhhbmNlbWVudHMvLi9zcmMvdGVtcGxhdGVzL2h0bWwvY29uZmlybV9yZXNldF9zZXR0aW5ncy5odG1sIiwid2VicGFjazovL2VsZGFyeWEtZW5oYW5jZW1lbnRzLy4vc3JjL3RlbXBsYXRlcy9odG1sL2NyZWF0ZWRfb3V0Zml0X2ZsYXZyLmh0bWwiLCJ3ZWJwYWNrOi8vZWxkYXJ5YS1lbmhhbmNlbWVudHMvLi9zcmMvdGVtcGxhdGVzL2h0bWwvZXhwbG9yYXRpb25faGlzdG9yeS5odG1sIiwid2VicGFjazovL2VsZGFyeWEtZW5oYW5jZW1lbnRzLy4vc3JjL3RlbXBsYXRlcy9odG1sL2Zhdm91cml0ZV9vdXRmaXRfZmxhdnIuaHRtbCIsIndlYnBhY2s6Ly9lbGRhcnlhLWVuaGFuY2VtZW50cy8uL3NyYy90ZW1wbGF0ZXMvaHRtbC9mYXZvdXJpdGVzX2FjdGlvbi5odG1sIiwid2VicGFjazovL2VsZGFyeWEtZW5oYW5jZW1lbnRzLy4vc3JjL3RlbXBsYXRlcy9odG1sL2ZsYXZyX25vdGlmL2ljb25fbWVzc2FnZS5odG1sIiwid2VicGFjazovL2VsZGFyeWEtZW5oYW5jZW1lbnRzLy4vc3JjL3RlbXBsYXRlcy9odG1sL2hlYWRlcl90YWtlb3Zlci5odG1sIiwid2VicGFjazovL2VsZGFyeWEtZW5oYW5jZW1lbnRzLy4vc3JjL3RlbXBsYXRlcy9odG1sL2hvbWVfY29udGVudF9zbWFsbC5odG1sIiwid2VicGFjazovL2VsZGFyeWEtZW5oYW5jZW1lbnRzLy4vc3JjL3RlbXBsYXRlcy9odG1sL21haW5fbWVudS5odG1sIiwid2VicGFjazovL2VsZGFyeWEtZW5oYW5jZW1lbnRzLy4vc3JjL3RlbXBsYXRlcy9odG1sL21haW5fbWVudV9wdXJyb3Nob3AuaHRtbCIsIndlYnBhY2s6Ly9lbGRhcnlhLWVuaGFuY2VtZW50cy8uL3NyYy90ZW1wbGF0ZXMvaHRtbC9tYXJrZXRfaGlzdG9yeS5odG1sIiwid2VicGFjazovL2VsZGFyeWEtZW5oYW5jZW1lbnRzLy4vc3JjL3RlbXBsYXRlcy9odG1sL21hc3NfbWFya19idXR0b24uaHRtbCIsIndlYnBhY2s6Ly9lbGRhcnlhLWVuaGFuY2VtZW50cy8uL3NyYy90ZW1wbGF0ZXMvaHRtbC9vdXRmaXRfdGh1bWJzLmh0bWwiLCJ3ZWJwYWNrOi8vZWxkYXJ5YS1lbmhhbmNlbWVudHMvLi9zcmMvdGVtcGxhdGVzL2h0bWwvcHJvZmlsZV9jb250YWN0X2FjdGlvbi5odG1sIiwid2VicGFjazovL2VsZGFyeWEtZW5oYW5jZW1lbnRzLy4vc3JjL3RlbXBsYXRlcy9odG1sL3JlbmFtZV9mYXZvdXJpdGVfb3V0Zml0X2ZsYXZyLmh0bWwiLCJ3ZWJwYWNrOi8vZWxkYXJ5YS1lbmhhbmNlbWVudHMvLi9zcmMvdGVtcGxhdGVzL2h0bWwvc2V0dGluZ3MuaHRtbCIsIndlYnBhY2s6Ly9lbGRhcnlhLWVuaGFuY2VtZW50cy8uL3NyYy90ZW1wbGF0ZXMvaHRtbC93aXNobGlzdF9idXR0b24uaHRtbCIsIndlYnBhY2s6Ly9lbGRhcnlhLWVuaGFuY2VtZW50cy8uL3NyYy90ZW1wbGF0ZXMvaHRtbC93aXNobGlzdF9zZXR0aW5ncy5odG1sIiwid2VicGFjazovL2VsZGFyeWEtZW5oYW5jZW1lbnRzLy4vc3JjL2FqYXgvYWpheF9zZWFyY2gudHMiLCJ3ZWJwYWNrOi8vZWxkYXJ5YS1lbmhhbmNlbWVudHMvLi9zcmMvYWpheC9idXkudHMiLCJ3ZWJwYWNrOi8vZWxkYXJ5YS1lbmhhbmNlbWVudHMvLi9zcmMvYWpheC9jYXB0dXJlX2VuZC50cyIsIndlYnBhY2s6Ly9lbGRhcnlhLWVuaGFuY2VtZW50cy8uL3NyYy9hamF4L2NoYW5nZV9yZWdpb24udHMiLCJ3ZWJwYWNrOi8vZWxkYXJ5YS1lbmhhbmNlbWVudHMvLi9zcmMvYWpheC9leHBsb3JhdGlvbl9yZXN1bHRzLnRzIiwid2VicGFjazovL2VsZGFyeWEtZW5oYW5jZW1lbnRzLy4vc3JjL2FwaS9tZXRhLnRzIiwid2VicGFjazovL2VsZGFyeWEtZW5oYW5jZW1lbnRzLy4vc3JjL2FwaS9yZXN1bHQuZW51bS50cyIsIndlYnBhY2s6Ly9lbGRhcnlhLWVuaGFuY2VtZW50cy8uL3NyYy9hcHBlYXJhbmNlL2FwcGVhcmFuY2VfdWkudHMiLCJ3ZWJwYWNrOi8vZWxkYXJ5YS1lbmhhbmNlbWVudHMvLi9zcmMvYXBwZWFyYW5jZS9kYXRhX3NldC50cyIsIndlYnBhY2s6Ly9lbGRhcnlhLWVuaGFuY2VtZW50cy8uL3NyYy9hcHBlYXJhbmNlL2RyZXNzaW5nX2V4cGVyaWVuY2UudHMiLCJ3ZWJwYWNrOi8vZWxkYXJ5YS1lbmhhbmNlbWVudHMvLi9zcmMvYXBwZWFyYW5jZS9lbnVtcy9hcHBlYXJhbmNlX2NhdGVnb3J5X2NvZGUuZW51bS50cyIsIndlYnBhY2s6Ly9lbGRhcnlhLWVuaGFuY2VtZW50cy8uL3NyYy9hcHBlYXJhbmNlL2Zha2VfZmF2b3VyaXRlcy50cyIsIndlYnBhY2s6Ly9lbGRhcnlhLWVuaGFuY2VtZW50cy8uL3NyYy9hcHBlYXJhbmNlL2Zhdm91cml0ZXNfYWN0aW9ucy50cyIsIndlYnBhY2s6Ly9lbGRhcnlhLWVuaGFuY2VtZW50cy8uL3NyYy9hcHBlYXJhbmNlL2hpZGRlbi50cyIsIndlYnBhY2s6Ly9lbGRhcnlhLWVuaGFuY2VtZW50cy8uL3NyYy9hcHBlYXJhbmNlL3dhcmRyb2JlLnRzIiwid2VicGFjazovL2VsZGFyeWEtZW5oYW5jZW1lbnRzLy4vc3JjL2Nhcm91c2VsL2Nhcm91c2VsX2JlZW1vb3ZfYW5ub3lhbmNlcy50cyIsIndlYnBhY2s6Ly9lbGRhcnlhLWVuaGFuY2VtZW50cy8uL3NyYy9jYXJvdXNlbC9jYXJvdXNlbF9kb3dubG9hZF9mYWNlLnRzIiwid2VicGFjazovL2VsZGFyeWEtZW5oYW5jZW1lbnRzLy4vc3JjL2Nhcm91c2VsL2Nhcm91c2VsX2Rvd25sb2FkX2d1YXJkaWFuLnRzIiwid2VicGFjazovL2VsZGFyeWEtZW5oYW5jZW1lbnRzLy4vc3JjL2Nhcm91c2VsL2Nhcm91c2VsX2VsZGFyeWFfZW5oYW5jZW1lbnRzLnRzIiwid2VicGFjazovL2VsZGFyeWEtZW5oYW5jZW1lbnRzLy4vc3JjL2Nhcm91c2VsL2Nhcm91c2VsX3Rha2VvdmVyLnRzIiwid2VicGFjazovL2VsZGFyeWEtZW5oYW5jZW1lbnRzLy4vc3JjL2NoZWF0X2NvZGVzLnRzIiwid2VicGFjazovL2VsZGFyeWEtZW5oYW5jZW1lbnRzLy4vc3JjL2NvbnNvbGUudHMiLCJ3ZWJwYWNrOi8vZWxkYXJ5YS1lbmhhbmNlbWVudHMvLi9zcmMvZG93bmxvYWQtY2FudmFzLnRzIiwid2VicGFjazovL2VsZGFyeWEtZW5oYW5jZW1lbnRzLy4vc3JjL2R1cmF0aW9uLnRzIiwid2VicGFjazovL2VsZGFyeWEtZW5oYW5jZW1lbnRzLy4vc3JjL2VsZGFyeWEvanF1ZXJ5LnRzIiwid2VicGFjazovL2VsZGFyeWEtZW5oYW5jZW1lbnRzLy4vc3JjL2VsZGFyeWFfdXRpbC50cyIsIndlYnBhY2s6Ly9lbGRhcnlhLWVuaGFuY2VtZW50cy8uL3NyYy9pMThuL2VuLnRzIiwid2VicGFjazovL2VsZGFyeWEtZW5oYW5jZW1lbnRzLy4vc3JjL2kxOG4vZnIudHMiLCJ3ZWJwYWNrOi8vZWxkYXJ5YS1lbmhhbmNlbWVudHMvLi9zcmMvaTE4bi90cmFuc2xhdGUudHMiLCJ3ZWJwYWNrOi8vZWxkYXJ5YS1lbmhhbmNlbWVudHMvLi9zcmMvaW5kZXhlZF9kYi9kYXRhYmFzZXMuZW51bS50cyIsIndlYnBhY2s6Ly9lbGRhcnlhLWVuaGFuY2VtZW50cy8uL3NyYy9pbmRleGVkX2RiL2ZpZWxkcy5lbnVtLnRzIiwid2VicGFjazovL2VsZGFyeWEtZW5oYW5jZW1lbnRzLy4vc3JjL2luZGV4ZWRfZGIvaW5kZXhlZF9kYi50cyIsIndlYnBhY2s6Ly9lbGRhcnlhLWVuaGFuY2VtZW50cy8uL3NyYy9pbmRleGVkX2RiL3RhYmxlcy5lbnVtLnRzIiwid2VicGFjazovL2VsZGFyeWEtZW5oYW5jZW1lbnRzLy4vc3JjL2xvY2FsX3N0b3JhZ2UvbG9jYWxfc3RvcmFnZS5lbnVtLnRzIiwid2VicGFjazovL2VsZGFyeWEtZW5oYW5jZW1lbnRzLy4vc3JjL2xvY2FsX3N0b3JhZ2UvbG9jYWxfc3RvcmFnZS50cyIsIndlYnBhY2s6Ly9lbGRhcnlhLWVuaGFuY2VtZW50cy8uL3NyYy9tYXJrZXRwbGFjZS9lbnVtcy9ib2R5X2xvY2F0aW9uLmVudW0udHMiLCJ3ZWJwYWNrOi8vZWxkYXJ5YS1lbmhhbmNlbWVudHMvLi9zcmMvbWFya2V0cGxhY2UvZW51bXMvY2F0ZWdvcnkuZW51bS50cyIsIndlYnBhY2s6Ly9lbGRhcnlhLWVuaGFuY2VtZW50cy8uL3NyYy9tYXJrZXRwbGFjZS9lbnVtcy9ndWFyZC5lbnVtLnRzIiwid2VicGFjazovL2VsZGFyeWEtZW5oYW5jZW1lbnRzLy4vc3JjL21hcmtldHBsYWNlL2VudW1zL3Jhcml0eS5lbnVtLnRzIiwid2VicGFjazovL2VsZGFyeWEtZW5oYW5jZW1lbnRzLy4vc3JjL21hcmtldHBsYWNlL2VudW1zL3R5cGUuZW51bS50cyIsIndlYnBhY2s6Ly9lbGRhcnlhLWVuaGFuY2VtZW50cy8uL3NyYy9tYXJrZXRwbGFjZS9tYXJrZXRwbGFjZV9oYW5kbGVycy50cyIsIndlYnBhY2s6Ly9lbGRhcnlhLWVuaGFuY2VtZW50cy8uL3NyYy9taWdyYXRlLnRzIiwid2VicGFjazovL2VsZGFyeWEtZW5oYW5jZW1lbnRzLy4vc3JjL21pbmlnYW1lcy9lbWlsZS50cyIsIndlYnBhY2s6Ly9lbGRhcnlhLWVuaGFuY2VtZW50cy8uL3NyYy9taW5pZ2FtZXMvZmxhcHB5LnRzIiwid2VicGFjazovL2VsZGFyeWEtZW5oYW5jZW1lbnRzLy4vc3JjL21pbmlnYW1lcy9oYXRjaGxpbmdzLnRzIiwid2VicGFjazovL2VsZGFyeWEtZW5oYW5jZW1lbnRzLy4vc3JjL21pbmlnYW1lcy9wZWdnbGUudHMiLCJ3ZWJwYWNrOi8vZWxkYXJ5YS1lbmhhbmNlbWVudHMvLi9zcmMvb3V0Zml0LnRzIiwid2VicGFjazovL2VsZGFyeWEtZW5oYW5jZW1lbnRzLy4vc3JjL3BldC9leHBsb3JhdGlvbi1oaXN0b3J5LnRzIiwid2VicGFjazovL2VsZGFyeWEtZW5oYW5jZW1lbnRzLy4vc3JjL3BldC9leHBsb3JhdGlvbi13YXRjaGVyLnRzIiwid2VicGFjazovL2VsZGFyeWEtZW5oYW5jZW1lbnRzLy4vc3JjL3BldC9leHBsb3JhdGlvbi50cyIsIndlYnBhY2s6Ly9lbGRhcnlhLWVuaGFuY2VtZW50cy8uL3NyYy9wZXQvbWFwX2xvY2F0aW9uX2RhdGFzZXQudHMiLCJ3ZWJwYWNrOi8vZWxkYXJ5YS1lbmhhbmNlbWVudHMvLi9zcmMvcGV0L21hcmtfY29udGV4dC50cyIsIndlYnBhY2s6Ly9lbGRhcnlhLWVuaGFuY2VtZW50cy8uL3NyYy9wZXQvbWFzc19tYXJrLnRzIiwid2VicGFjazovL2VsZGFyeWEtZW5oYW5jZW1lbnRzLy4vc3JjL3BldC9taW5pbWFwX2RhdGFzZXQudHMiLCJ3ZWJwYWNrOi8vZWxkYXJ5YS1lbmhhbmNlbWVudHMvLi9zcmMvc2Vzc2lvbl9zdG9yYWdlL3Nlc3Npb25fc3RvcmFnZS5lbnVtLnRzIiwid2VicGFjazovL2VsZGFyeWEtZW5oYW5jZW1lbnRzLy4vc3JjL3Nlc3Npb25fc3RvcmFnZS9zZXNzaW9uX3N0b3JhZ2UudHMiLCJ3ZWJwYWNrOi8vZWxkYXJ5YS1lbmhhbmNlbWVudHMvLi9zcmMvc2Vzc2lvbl9zdG9yYWdlL3Rha2VvdmVyX2FjdGlvbi5lbnVtLnRzIiwid2VicGFjazovL2VsZGFyeWEtZW5oYW5jZW1lbnRzLy4vc3JjL3Rha2VvdmVyL2JyYWluLnRzIiwid2VicGFjazovL2VsZGFyeWEtZW5oYW5jZW1lbnRzLy4vc3JjL3Rha2VvdmVyL2NsYXNzZXMvYWN0aW9uLnRzIiwid2VicGFjazovL2VsZGFyeWEtZW5oYW5jZW1lbnRzLy4vc3JjL3Rha2VvdmVyL2NsYXNzZXMvYnV5X2FjdGlvbi50cyIsIndlYnBhY2s6Ly9lbGRhcnlhLWVuaGFuY2VtZW50cy8uL3NyYy90YWtlb3Zlci9jbGFzc2VzL2RhaWx5X2FjdGlvbi50cyIsIndlYnBhY2s6Ly9lbGRhcnlhLWVuaGFuY2VtZW50cy8uL3NyYy90YWtlb3Zlci9jbGFzc2VzL2V4cGxvcmF0aW9uX2FjdGlvbi50cyIsIndlYnBhY2s6Ly9lbGRhcnlhLWVuaGFuY2VtZW50cy8uL3NyYy90YWtlb3Zlci9jbGFzc2VzL21pbmlnYW1lX2FjdGlvbi50cyIsIndlYnBhY2s6Ly9lbGRhcnlhLWVuaGFuY2VtZW50cy8uL3NyYy90YWtlb3Zlci9jbGFzc2VzL3dhaXRfYWN0aW9uLnRzIiwid2VicGFjazovL2VsZGFyeWEtZW5oYW5jZW1lbnRzLy4vc3JjL3Rha2VvdmVyL2NsaWNrLnRzIiwid2VicGFjazovL2VsZGFyeWEtZW5oYW5jZW1lbnRzLy4vc3JjL3Rha2VvdmVyL2V4cGxvcmF0aW9uX3N0YXR1cy5lbnVtLnRzIiwid2VicGFjazovL2VsZGFyeWEtZW5oYW5jZW1lbnRzLy4vc3JjL3RzX3V0aWwudHMiLCJ3ZWJwYWNrOi8vZWxkYXJ5YS1lbmhhbmNlbWVudHMvLi9zcmMvdWkvYXVjdGlvbnMudHMiLCJ3ZWJwYWNrOi8vZWxkYXJ5YS1lbmhhbmNlbWVudHMvLi9zcmMvdWkvY2Fyb3VzZWwudHMiLCJ3ZWJwYWNrOi8vZWxkYXJ5YS1lbmhhbmNlbWVudHMvLi9zcmMvdWkvZmF2b3VyaXRlcy50cyIsIndlYnBhY2s6Ly9lbGRhcnlhLWVuaGFuY2VtZW50cy8uL3NyYy91aS9ob21lX2NvbnRlbnQudHMiLCJ3ZWJwYWNrOi8vZWxkYXJ5YS1lbmhhbmNlbWVudHMvLi9zcmMvdWkvbWFsbC50cyIsIndlYnBhY2s6Ly9lbGRhcnlhLWVuaGFuY2VtZW50cy8uL3NyYy91aS9tYXJrZXQudHMiLCJ3ZWJwYWNrOi8vZWxkYXJ5YS1lbmhhbmNlbWVudHMvLi9zcmMvdWkvbWVudS50cyIsIndlYnBhY2s6Ly9lbGRhcnlhLWVuaGFuY2VtZW50cy8uL3NyYy91aS9wZXQudHMiLCJ3ZWJwYWNrOi8vZWxkYXJ5YS1lbmhhbmNlbWVudHMvLi9zcmMvdWkvcHJvZmlsZS50cyIsIndlYnBhY2s6Ly9lbGRhcnlhLWVuaGFuY2VtZW50cy8uL3NyYy91aS9wdXJyb19zaG9wLnRzIiwid2VicGFjazovL2VsZGFyeWEtZW5oYW5jZW1lbnRzLy4vc3JjL3VpL3NldHRpbmdzLnRzIiwid2VicGFjazovL2VsZGFyeWEtZW5oYW5jZW1lbnRzLy4vc3JjL3VpL3RvcF9iYXIudHMiLCJ3ZWJwYWNrOi8vZWxkYXJ5YS1lbmhhbmNlbWVudHMvLi9zcmMvdWkvd2lzaGxpc3QudHMiLCJ3ZWJwYWNrOi8vZWxkYXJ5YS1lbmhhbmNlbWVudHMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZWxkYXJ5YS1lbmhhbmNlbWVudHMvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vZWxkYXJ5YS1lbmhhbmNlbWVudHMvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2VsZGFyeWEtZW5oYW5jZW1lbnRzL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vZWxkYXJ5YS1lbmhhbmNlbWVudHMvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9lbGRhcnlhLWVuaGFuY2VtZW50cy8uL3NyYy9tYWluLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIFRPRE86IGluY2x1ZGluZyB0aGVzZSBpbiBibG9iLXV0aWwudHMgY2F1c2VzIHR5cGVkb2MgdG8gZ2VuZXJhdGUgZG9jcyBmb3IgdGhlbSxcbi8vIGV2ZW4gd2l0aCAtLWV4Y2x1ZGVQcml2YXRlIMKvXFxfKOODhClfL8KvXG4vKiogQHByaXZhdGUgKi9cbmZ1bmN0aW9uIGxvYWRJbWFnZShzcmMsIGNyb3NzT3JpZ2luKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgdmFyIGltZyA9IG5ldyBJbWFnZSgpO1xuICAgICAgICBpZiAoY3Jvc3NPcmlnaW4pIHtcbiAgICAgICAgICAgIGltZy5jcm9zc09yaWdpbiA9IGNyb3NzT3JpZ2luO1xuICAgICAgICB9XG4gICAgICAgIGltZy5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXNvbHZlKGltZyk7XG4gICAgICAgIH07XG4gICAgICAgIGltZy5vbmVycm9yID0gcmVqZWN0O1xuICAgICAgICBpbWcuc3JjID0gc3JjO1xuICAgIH0pO1xufVxuLyoqIEBwcml2YXRlICovXG5mdW5jdGlvbiBpbWdUb0NhbnZhcyhpbWcpIHtcbiAgICB2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgY2FudmFzLndpZHRoID0gaW1nLndpZHRoO1xuICAgIGNhbnZhcy5oZWlnaHQgPSBpbWcuaGVpZ2h0O1xuICAgIC8vIGNvcHkgdGhlIGltYWdlIGNvbnRlbnRzIHRvIHRoZSBjYW52YXNcbiAgICB2YXIgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGNvbnRleHQuZHJhd0ltYWdlKGltZywgMCwgMCwgaW1nLndpZHRoLCBpbWcuaGVpZ2h0LCAwLCAwLCBpbWcud2lkdGgsIGltZy5oZWlnaHQpO1xuICAgIHJldHVybiBjYW52YXM7XG59XG5cbi8qIGdsb2JhbCBQcm9taXNlLCBJbWFnZSwgQmxvYiwgRmlsZVJlYWRlciwgYXRvYiwgYnRvYSxcbiAgIEJsb2JCdWlsZGVyLCBNU0Jsb2JCdWlsZGVyLCBNb3pCbG9iQnVpbGRlciwgV2ViS2l0QmxvYkJ1aWxkZXIsIHdlYmtpdFVSTCAqL1xuLyoqXG4gKiBTaGltIGZvclxuICogW2BuZXcgQmxvYigpYF0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0Jsb2IuQmxvYilcbiAqIHRvIHN1cHBvcnRcbiAqIFtvbGRlciBicm93c2VycyB0aGF0IHVzZSB0aGUgZGVwcmVjYXRlZCBgQmxvYkJ1aWxkZXJgIEFQSV0oaHR0cDovL2Nhbml1c2UuY29tL2Jsb2IpLlxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogYGBganNcbiAqIHZhciBteUJsb2IgPSBibG9iVXRpbC5jcmVhdGVCbG9iKFsnaGVsbG8gd29ybGQnXSwge3R5cGU6ICd0ZXh0L3BsYWluJ30pO1xuICogYGBgXG4gKlxuICogQHBhcmFtIHBhcnRzIC0gY29udGVudCBvZiB0aGUgQmxvYlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB1c3VhbGx5IGB7dHlwZTogbXlDb250ZW50VHlwZX1gLFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICB5b3UgY2FuIGFsc28gcGFzcyBhIHN0cmluZyBmb3IgdGhlIGNvbnRlbnQgdHlwZVxuICogQHJldHVybnMgQmxvYlxuICovXG5mdW5jdGlvbiBjcmVhdGVCbG9iKHBhcnRzLCBwcm9wZXJ0aWVzKSB7XG4gICAgcGFydHMgPSBwYXJ0cyB8fCBbXTtcbiAgICBwcm9wZXJ0aWVzID0gcHJvcGVydGllcyB8fCB7fTtcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHByb3BlcnRpZXMgPSB7IHR5cGU6IHByb3BlcnRpZXMgfTsgLy8gaW5mZXIgY29udGVudCB0eXBlXG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBuZXcgQmxvYihwYXJ0cywgcHJvcGVydGllcyk7XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChlLm5hbWUgIT09ICdUeXBlRXJyb3InKSB7XG4gICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBCdWlsZGVyID0gdHlwZW9mIEJsb2JCdWlsZGVyICE9PSAndW5kZWZpbmVkJ1xuICAgICAgICAgICAgPyBCbG9iQnVpbGRlciA6IHR5cGVvZiBNU0Jsb2JCdWlsZGVyICE9PSAndW5kZWZpbmVkJ1xuICAgICAgICAgICAgPyBNU0Jsb2JCdWlsZGVyIDogdHlwZW9mIE1vekJsb2JCdWlsZGVyICE9PSAndW5kZWZpbmVkJ1xuICAgICAgICAgICAgPyBNb3pCbG9iQnVpbGRlciA6IFdlYktpdEJsb2JCdWlsZGVyO1xuICAgICAgICB2YXIgYnVpbGRlciA9IG5ldyBCdWlsZGVyKCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFydHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGJ1aWxkZXIuYXBwZW5kKHBhcnRzW2ldKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYnVpbGRlci5nZXRCbG9iKHByb3BlcnRpZXMudHlwZSk7XG4gICAgfVxufVxuLyoqXG4gKiBTaGltIGZvclxuICogW2BVUkwuY3JlYXRlT2JqZWN0VVJMKClgXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvVVJMLmNyZWF0ZU9iamVjdFVSTClcbiAqIHRvIHN1cHBvcnQgYnJvd3NlcnMgdGhhdCBvbmx5IGhhdmUgdGhlIHByZWZpeGVkXG4gKiBgd2Via2l0VVJMYCAoZS5nLiBBbmRyb2lkIDw0LjQpLlxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogYGBganNcbiAqIHZhciBteVVybCA9IGJsb2JVdGlsLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSBibG9iXG4gKiBAcmV0dXJucyB1cmxcbiAqL1xuZnVuY3Rpb24gY3JlYXRlT2JqZWN0VVJMKGJsb2IpIHtcbiAgICByZXR1cm4gKHR5cGVvZiBVUkwgIT09ICd1bmRlZmluZWQnID8gVVJMIDogd2Via2l0VVJMKS5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG59XG4vKipcbiAqIFNoaW0gZm9yXG4gKiBbYFVSTC5yZXZva2VPYmplY3RVUkwoKWBdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9VUkwucmV2b2tlT2JqZWN0VVJMKVxuICogdG8gc3VwcG9ydCBicm93c2VycyB0aGF0IG9ubHkgaGF2ZSB0aGUgcHJlZml4ZWRcbiAqIGB3ZWJraXRVUkxgIChlLmcuIEFuZHJvaWQgPDQuNCkuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiBgYGBqc1xuICogYmxvYlV0aWwucmV2b2tlT2JqZWN0VVJMKG15VXJsKTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB1cmxcbiAqL1xuZnVuY3Rpb24gcmV2b2tlT2JqZWN0VVJMKHVybCkge1xuICAgIHJldHVybiAodHlwZW9mIFVSTCAhPT0gJ3VuZGVmaW5lZCcgPyBVUkwgOiB3ZWJraXRVUkwpLnJldm9rZU9iamVjdFVSTCh1cmwpO1xufVxuLyoqXG4gKiBDb252ZXJ0IGEgYEJsb2JgIHRvIGEgYmluYXJ5IHN0cmluZy5cbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqIGBgYGpzXG4gKiBibG9iVXRpbC5ibG9iVG9CaW5hcnlTdHJpbmcoYmxvYikudGhlbihmdW5jdGlvbiAoYmluYXJ5U3RyaW5nKSB7XG4gKiAgIC8vIHN1Y2Nlc3NcbiAqIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAqICAgLy8gZXJyb3JcbiAqIH0pO1xuICogYGBgXG4gKlxuICogQHBhcmFtIGJsb2JcbiAqIEByZXR1cm5zIFByb21pc2UgdGhhdCByZXNvbHZlcyB3aXRoIHRoZSBiaW5hcnkgc3RyaW5nXG4gKi9cbmZ1bmN0aW9uIGJsb2JUb0JpbmFyeVN0cmluZyhibG9iKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgICAgIHZhciBoYXNCaW5hcnlTdHJpbmcgPSB0eXBlb2YgcmVhZGVyLnJlYWRBc0JpbmFyeVN0cmluZyA9PT0gJ2Z1bmN0aW9uJztcbiAgICAgICAgcmVhZGVyLm9ubG9hZGVuZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSByZWFkZXIucmVzdWx0IHx8ICcnO1xuICAgICAgICAgICAgaWYgKGhhc0JpbmFyeVN0cmluZykge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXNvbHZlKGFycmF5QnVmZmVyVG9CaW5hcnlTdHJpbmcocmVzdWx0KSk7XG4gICAgICAgIH07XG4gICAgICAgIHJlYWRlci5vbmVycm9yID0gcmVqZWN0O1xuICAgICAgICBpZiAoaGFzQmluYXJ5U3RyaW5nKSB7XG4gICAgICAgICAgICByZWFkZXIucmVhZEFzQmluYXJ5U3RyaW5nKGJsb2IpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmVhZGVyLnJlYWRBc0FycmF5QnVmZmVyKGJsb2IpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG4vKipcbiAqIENvbnZlcnQgYSBiYXNlNjQtZW5jb2RlZCBzdHJpbmcgdG8gYSBgQmxvYmAuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiBgYGBqc1xuICogdmFyIGJsb2IgPSBibG9iVXRpbC5iYXNlNjRTdHJpbmdUb0Jsb2IoYmFzZTY0U3RyaW5nKTtcbiAqIGBgYFxuICogQHBhcmFtIGJhc2U2NCAtIGJhc2U2NC1lbmNvZGVkIHN0cmluZ1xuICogQHBhcmFtIHR5cGUgLSB0aGUgY29udGVudCB0eXBlIChvcHRpb25hbClcbiAqIEByZXR1cm5zIEJsb2JcbiAqL1xuZnVuY3Rpb24gYmFzZTY0U3RyaW5nVG9CbG9iKGJhc2U2NCwgdHlwZSkge1xuICAgIHZhciBwYXJ0cyA9IFtiaW5hcnlTdHJpbmdUb0FycmF5QnVmZmVyKGF0b2IoYmFzZTY0KSldO1xuICAgIHJldHVybiB0eXBlID8gY3JlYXRlQmxvYihwYXJ0cywgeyB0eXBlOiB0eXBlIH0pIDogY3JlYXRlQmxvYihwYXJ0cyk7XG59XG4vKipcbiAqIENvbnZlcnQgYSBiaW5hcnkgc3RyaW5nIHRvIGEgYEJsb2JgLlxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogYGBganNcbiAqIHZhciBibG9iID0gYmxvYlV0aWwuYmluYXJ5U3RyaW5nVG9CbG9iKGJpbmFyeVN0cmluZyk7XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0gYmluYXJ5IC0gYmluYXJ5IHN0cmluZ1xuICogQHBhcmFtIHR5cGUgLSB0aGUgY29udGVudCB0eXBlIChvcHRpb25hbClcbiAqIEByZXR1cm5zIEJsb2JcbiAqL1xuZnVuY3Rpb24gYmluYXJ5U3RyaW5nVG9CbG9iKGJpbmFyeSwgdHlwZSkge1xuICAgIHJldHVybiBiYXNlNjRTdHJpbmdUb0Jsb2IoYnRvYShiaW5hcnkpLCB0eXBlKTtcbn1cbi8qKlxuICogQ29udmVydCBhIGBCbG9iYCB0byBhIGJpbmFyeSBzdHJpbmcuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiBgYGBqc1xuICogYmxvYlV0aWwuYmxvYlRvQmFzZTY0U3RyaW5nKGJsb2IpLnRoZW4oZnVuY3Rpb24gKGJhc2U2NFN0cmluZykge1xuICogICAvLyBzdWNjZXNzXG4gKiB9KS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG4gKiAgIC8vIGVycm9yXG4gKiB9KTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSBibG9iXG4gKiBAcmV0dXJucyBQcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2l0aCB0aGUgYmluYXJ5IHN0cmluZ1xuICovXG5mdW5jdGlvbiBibG9iVG9CYXNlNjRTdHJpbmcoYmxvYikge1xuICAgIHJldHVybiBibG9iVG9CaW5hcnlTdHJpbmcoYmxvYikudGhlbihidG9hKTtcbn1cbi8qKlxuICogQ29udmVydCBhIGRhdGEgVVJMIHN0cmluZ1xuICogKGUuZy4gYCdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHLi4uJ2ApXG4gKiB0byBhIGBCbG9iYC5cbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqIGBgYGpzXG4gKiB2YXIgYmxvYiA9IGJsb2JVdGlsLmRhdGFVUkxUb0Jsb2IoZGF0YVVSTCk7XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0gZGF0YVVSTCAtIGRhdGFVUkwtZW5jb2RlZCBzdHJpbmdcbiAqIEByZXR1cm5zIEJsb2JcbiAqL1xuZnVuY3Rpb24gZGF0YVVSTFRvQmxvYihkYXRhVVJMKSB7XG4gICAgdmFyIHR5cGUgPSBkYXRhVVJMLm1hdGNoKC9kYXRhOihbXjtdKykvKVsxXTtcbiAgICB2YXIgYmFzZTY0ID0gZGF0YVVSTC5yZXBsYWNlKC9eW14sXSssLywgJycpO1xuICAgIHZhciBidWZmID0gYmluYXJ5U3RyaW5nVG9BcnJheUJ1ZmZlcihhdG9iKGJhc2U2NCkpO1xuICAgIHJldHVybiBjcmVhdGVCbG9iKFtidWZmXSwgeyB0eXBlOiB0eXBlIH0pO1xufVxuLyoqXG4gKiBDb252ZXJ0IGEgYEJsb2JgIHRvIGEgZGF0YSBVUkwgc3RyaW5nXG4gKiAoZS5nLiBgJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0cuLi4nYCkuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiBgYGBqc1xuICogdmFyIGRhdGFVUkwgPSBibG9iVXRpbC5ibG9iVG9EYXRhVVJMKGJsb2IpO1xuICogYGBgXG4gKlxuICogQHBhcmFtIGJsb2JcbiAqIEByZXR1cm5zIFByb21pc2UgdGhhdCByZXNvbHZlcyB3aXRoIHRoZSBkYXRhIFVSTCBzdHJpbmdcbiAqL1xuZnVuY3Rpb24gYmxvYlRvRGF0YVVSTChibG9iKSB7XG4gICAgcmV0dXJuIGJsb2JUb0Jhc2U2NFN0cmluZyhibG9iKS50aGVuKGZ1bmN0aW9uIChiYXNlNjRTdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuICdkYXRhOicgKyBibG9iLnR5cGUgKyAnO2Jhc2U2NCwnICsgYmFzZTY0U3RyaW5nO1xuICAgIH0pO1xufVxuLyoqXG4gKiBDb252ZXJ0IGFuIGltYWdlJ3MgYHNyY2AgVVJMIHRvIGEgZGF0YSBVUkwgYnkgbG9hZGluZyB0aGUgaW1hZ2UgYW5kIHBhaW50aW5nXG4gKiBpdCB0byBhIGBjYW52YXNgLlxuICpcbiAqIE5vdGU6IHRoaXMgd2lsbCBjb2VyY2UgdGhlIGltYWdlIHRvIHRoZSBkZXNpcmVkIGNvbnRlbnQgdHlwZSwgYW5kIGl0XG4gKiB3aWxsIG9ubHkgcGFpbnQgdGhlIGZpcnN0IGZyYW1lIG9mIGFuIGFuaW1hdGVkIEdJRi5cbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiBgYGBqc1xuICogYmxvYlV0aWwuaW1nU3JjVG9EYXRhVVJMKCdodHRwOi8vbXlzaXRlLmNvbS9pbWcucG5nJykudGhlbihmdW5jdGlvbiAoZGF0YVVSTCkge1xuICogICAvLyBzdWNjZXNzXG4gKiB9KS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG4gKiAgIC8vIGVycm9yXG4gKiB9KTtcbiAqIGBgYFxuICpcbiAqIGBgYGpzXG4gKiBibG9iVXRpbC5pbWdTcmNUb0RhdGFVUkwoJ2h0dHA6Ly9zb21lLW90aGVyLXNpdGUuY29tL2ltZy5qcGcnLCAnaW1hZ2UvanBlZycsXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgJ0Fub255bW91cycsIDEuMCkudGhlbihmdW5jdGlvbiAoZGF0YVVSTCkge1xuICogICAvLyBzdWNjZXNzXG4gKiB9KS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG4gKiAgIC8vIGVycm9yXG4gKiB9KTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSBzcmMgLSBpbWFnZSBzcmNcbiAqIEBwYXJhbSB0eXBlIC0gdGhlIGNvbnRlbnQgdHlwZSAob3B0aW9uYWwsIGRlZmF1bHRzIHRvICdpbWFnZS9wbmcnKVxuICogQHBhcmFtIGNyb3NzT3JpZ2luIC0gZm9yIENPUlMtZW5hYmxlZCBpbWFnZXMsIHNldCB0aGlzIHRvXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0Fub255bW91cycgdG8gYXZvaWQgXCJ0YWludGVkIGNhbnZhc1wiIGVycm9yc1xuICogQHBhcmFtIHF1YWxpdHkgLSBhIG51bWJlciBiZXR3ZWVuIDAgYW5kIDEgaW5kaWNhdGluZyBpbWFnZSBxdWFsaXR5XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiB0aGUgcmVxdWVzdGVkIHR5cGUgaXMgJ2ltYWdlL2pwZWcnIG9yICdpbWFnZS93ZWJwJ1xuICogQHJldHVybnMgUHJvbWlzZSB0aGF0IHJlc29sdmVzIHdpdGggdGhlIGRhdGEgVVJMIHN0cmluZ1xuICovXG5mdW5jdGlvbiBpbWdTcmNUb0RhdGFVUkwoc3JjLCB0eXBlLCBjcm9zc09yaWdpbiwgcXVhbGl0eSkge1xuICAgIHR5cGUgPSB0eXBlIHx8ICdpbWFnZS9wbmcnO1xuICAgIHJldHVybiBsb2FkSW1hZ2Uoc3JjLCBjcm9zc09yaWdpbikudGhlbihpbWdUb0NhbnZhcykudGhlbihmdW5jdGlvbiAoY2FudmFzKSB7XG4gICAgICAgIHJldHVybiBjYW52YXMudG9EYXRhVVJMKHR5cGUsIHF1YWxpdHkpO1xuICAgIH0pO1xufVxuLyoqXG4gKiBDb252ZXJ0IGEgYGNhbnZhc2AgdG8gYSBgQmxvYmAuXG4gKlxuICogRXhhbXBsZXM6XG4gKlxuICogYGBganNcbiAqIGJsb2JVdGlsLmNhbnZhc1RvQmxvYihjYW52YXMpLnRoZW4oZnVuY3Rpb24gKGJsb2IpIHtcbiAqICAgLy8gc3VjY2Vzc1xuICogfSkuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICogICAvLyBlcnJvclxuICogfSk7XG4gKiBgYGBcbiAqXG4gKiBNb3N0IGJyb3dzZXJzIHN1cHBvcnQgY29udmVydGluZyBhIGNhbnZhcyB0byBib3RoIGAnaW1hZ2UvcG5nJ2AgYW5kIGAnaW1hZ2UvanBlZydgLiBZb3UgbWF5XG4gKiBhbHNvIHdhbnQgdG8gdHJ5IGAnaW1hZ2Uvd2VicCdgLCB3aGljaCB3aWxsIHdvcmsgaW4gc29tZSBicm93c2VycyBsaWtlIENocm9tZSAoYW5kIGluIG90aGVyIGJyb3dzZXJzLCB3aWxsIGp1c3QgZmFsbCBiYWNrIHRvIGAnaW1hZ2UvcG5nJ2ApOlxuICpcbiAqIGBgYGpzXG4gKiBibG9iVXRpbC5jYW52YXNUb0Jsb2IoY2FudmFzLCAnaW1hZ2Uvd2VicCcpLnRoZW4oZnVuY3Rpb24gKGJsb2IpIHtcbiAqICAgLy8gc3VjY2Vzc1xuICogfSkuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICogICAvLyBlcnJvclxuICogfSk7XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0gY2FudmFzIC0gSFRNTENhbnZhc0VsZW1lbnRcbiAqIEBwYXJhbSB0eXBlIC0gdGhlIGNvbnRlbnQgdHlwZSAob3B0aW9uYWwsIGRlZmF1bHRzIHRvICdpbWFnZS9wbmcnKVxuICogQHBhcmFtIHF1YWxpdHkgLSBhIG51bWJlciBiZXR3ZWVuIDAgYW5kIDEgaW5kaWNhdGluZyBpbWFnZSBxdWFsaXR5XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiB0aGUgcmVxdWVzdGVkIHR5cGUgaXMgJ2ltYWdlL2pwZWcnIG9yICdpbWFnZS93ZWJwJ1xuICogQHJldHVybnMgUHJvbWlzZSB0aGF0IHJlc29sdmVzIHdpdGggdGhlIGBCbG9iYFxuICovXG5mdW5jdGlvbiBjYW52YXNUb0Jsb2IoY2FudmFzLCB0eXBlLCBxdWFsaXR5KSB7XG4gICAgaWYgKHR5cGVvZiBjYW52YXMudG9CbG9iID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgICAgICAgICAgY2FudmFzLnRvQmxvYihyZXNvbHZlLCB0eXBlLCBxdWFsaXR5KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZGF0YVVSTFRvQmxvYihjYW52YXMudG9EYXRhVVJMKHR5cGUsIHF1YWxpdHkpKSk7XG59XG4vKipcbiAqIENvbnZlcnQgYW4gaW1hZ2UncyBgc3JjYCBVUkwgdG8gYSBgQmxvYmAgYnkgbG9hZGluZyB0aGUgaW1hZ2UgYW5kIHBhaW50aW5nXG4gKiBpdCB0byBhIGBjYW52YXNgLlxuICpcbiAqIE5vdGU6IHRoaXMgd2lsbCBjb2VyY2UgdGhlIGltYWdlIHRvIHRoZSBkZXNpcmVkIGNvbnRlbnQgdHlwZSwgYW5kIGl0XG4gKiB3aWxsIG9ubHkgcGFpbnQgdGhlIGZpcnN0IGZyYW1lIG9mIGFuIGFuaW1hdGVkIEdJRi5cbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiBgYGBqc1xuICogYmxvYlV0aWwuaW1nU3JjVG9CbG9iKCdodHRwOi8vbXlzaXRlLmNvbS9pbWcucG5nJykudGhlbihmdW5jdGlvbiAoYmxvYikge1xuICogICAvLyBzdWNjZXNzXG4gKiB9KS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG4gKiAgIC8vIGVycm9yXG4gKiB9KTtcbiAqIGBgYFxuICpcbiAqIGBgYGpzXG4gKiBibG9iVXRpbC5pbWdTcmNUb0Jsb2IoJ2h0dHA6Ly9zb21lLW90aGVyLXNpdGUuY29tL2ltZy5qcGcnLCAnaW1hZ2UvanBlZycsXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgJ0Fub255bW91cycsIDEuMCkudGhlbihmdW5jdGlvbiAoYmxvYikge1xuICogICAvLyBzdWNjZXNzXG4gKiB9KS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG4gKiAgIC8vIGVycm9yXG4gKiB9KTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSBzcmMgLSBpbWFnZSBzcmNcbiAqIEBwYXJhbSB0eXBlIC0gdGhlIGNvbnRlbnQgdHlwZSAob3B0aW9uYWwsIGRlZmF1bHRzIHRvICdpbWFnZS9wbmcnKVxuICogQHBhcmFtIGNyb3NzT3JpZ2luIC0gZm9yIENPUlMtZW5hYmxlZCBpbWFnZXMsIHNldCB0aGlzIHRvXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0Fub255bW91cycgdG8gYXZvaWQgXCJ0YWludGVkIGNhbnZhc1wiIGVycm9yc1xuICogQHBhcmFtIHF1YWxpdHkgLSBhIG51bWJlciBiZXR3ZWVuIDAgYW5kIDEgaW5kaWNhdGluZyBpbWFnZSBxdWFsaXR5XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiB0aGUgcmVxdWVzdGVkIHR5cGUgaXMgJ2ltYWdlL2pwZWcnIG9yICdpbWFnZS93ZWJwJ1xuICogQHJldHVybnMgUHJvbWlzZSB0aGF0IHJlc29sdmVzIHdpdGggdGhlIGBCbG9iYFxuICovXG5mdW5jdGlvbiBpbWdTcmNUb0Jsb2Ioc3JjLCB0eXBlLCBjcm9zc09yaWdpbiwgcXVhbGl0eSkge1xuICAgIHR5cGUgPSB0eXBlIHx8ICdpbWFnZS9wbmcnO1xuICAgIHJldHVybiBsb2FkSW1hZ2Uoc3JjLCBjcm9zc09yaWdpbikudGhlbihpbWdUb0NhbnZhcykudGhlbihmdW5jdGlvbiAoY2FudmFzKSB7XG4gICAgICAgIHJldHVybiBjYW52YXNUb0Jsb2IoY2FudmFzLCB0eXBlLCBxdWFsaXR5KTtcbiAgICB9KTtcbn1cbi8qKlxuICogQ29udmVydCBhbiBgQXJyYXlCdWZmZXJgIHRvIGEgYEJsb2JgLlxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogYGBganNcbiAqIHZhciBibG9iID0gYmxvYlV0aWwuYXJyYXlCdWZmZXJUb0Jsb2IoYXJyYXlCdWZmLCAnYXVkaW8vbXBlZycpO1xuICogYGBgXG4gKlxuICogQHBhcmFtIGJ1ZmZlclxuICogQHBhcmFtIHR5cGUgLSB0aGUgY29udGVudCB0eXBlIChvcHRpb25hbClcbiAqIEByZXR1cm5zIEJsb2JcbiAqL1xuZnVuY3Rpb24gYXJyYXlCdWZmZXJUb0Jsb2IoYnVmZmVyLCB0eXBlKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUJsb2IoW2J1ZmZlcl0sIHR5cGUpO1xufVxuLyoqXG4gKiBDb252ZXJ0IGEgYEJsb2JgIHRvIGFuIGBBcnJheUJ1ZmZlcmAuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiBgYGBqc1xuICogYmxvYlV0aWwuYmxvYlRvQXJyYXlCdWZmZXIoYmxvYikudGhlbihmdW5jdGlvbiAoYXJyYXlCdWZmKSB7XG4gKiAgIC8vIHN1Y2Nlc3NcbiAqIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAqICAgLy8gZXJyb3JcbiAqIH0pO1xuICogYGBgXG4gKlxuICogQHBhcmFtIGJsb2JcbiAqIEByZXR1cm5zIFByb21pc2UgdGhhdCByZXNvbHZlcyB3aXRoIHRoZSBgQXJyYXlCdWZmZXJgXG4gKi9cbmZ1bmN0aW9uIGJsb2JUb0FycmF5QnVmZmVyKGJsb2IpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICAgICAgcmVhZGVyLm9ubG9hZGVuZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSByZWFkZXIucmVzdWx0IHx8IG5ldyBBcnJheUJ1ZmZlcigwKTtcbiAgICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgfTtcbiAgICAgICAgcmVhZGVyLm9uZXJyb3IgPSByZWplY3Q7XG4gICAgICAgIHJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcihibG9iKTtcbiAgICB9KTtcbn1cbi8qKlxuICogQ29udmVydCBhbiBgQXJyYXlCdWZmZXJgIHRvIGEgYmluYXJ5IHN0cmluZy5cbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqIGBgYGpzXG4gKiB2YXIgbXlTdHJpbmcgPSBibG9iVXRpbC5hcnJheUJ1ZmZlclRvQmluYXJ5U3RyaW5nKGFycmF5QnVmZilcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSBidWZmZXIgLSBhcnJheSBidWZmZXJcbiAqIEByZXR1cm5zIGJpbmFyeSBzdHJpbmdcbiAqL1xuZnVuY3Rpb24gYXJyYXlCdWZmZXJUb0JpbmFyeVN0cmluZyhidWZmZXIpIHtcbiAgICB2YXIgYmluYXJ5ID0gJyc7XG4gICAgdmFyIGJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoYnVmZmVyKTtcbiAgICB2YXIgbGVuZ3RoID0gYnl0ZXMuYnl0ZUxlbmd0aDtcbiAgICB2YXIgaSA9IC0xO1xuICAgIHdoaWxlICgrK2kgPCBsZW5ndGgpIHtcbiAgICAgICAgYmluYXJ5ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZXNbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gYmluYXJ5O1xufVxuLyoqXG4gKiBDb252ZXJ0IGEgYmluYXJ5IHN0cmluZyB0byBhbiBgQXJyYXlCdWZmZXJgLlxuICpcbiAqIGBgYGpzXG4gKiB2YXIgbXlCdWZmZXIgPSBibG9iVXRpbC5iaW5hcnlTdHJpbmdUb0FycmF5QnVmZmVyKGJpbmFyeVN0cmluZylcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSBiaW5hcnkgLSBiaW5hcnkgc3RyaW5nXG4gKiBAcmV0dXJucyBhcnJheSBidWZmZXJcbiAqL1xuZnVuY3Rpb24gYmluYXJ5U3RyaW5nVG9BcnJheUJ1ZmZlcihiaW5hcnkpIHtcbiAgICB2YXIgbGVuZ3RoID0gYmluYXJ5Lmxlbmd0aDtcbiAgICB2YXIgYnVmID0gbmV3IEFycmF5QnVmZmVyKGxlbmd0aCk7XG4gICAgdmFyIGFyciA9IG5ldyBVaW50OEFycmF5KGJ1Zik7XG4gICAgdmFyIGkgPSAtMTtcbiAgICB3aGlsZSAoKytpIDwgbGVuZ3RoKSB7XG4gICAgICAgIGFycltpXSA9IGJpbmFyeS5jaGFyQ29kZUF0KGkpO1xuICAgIH1cbiAgICByZXR1cm4gYnVmO1xufVxuXG5leHBvcnQgeyBjcmVhdGVCbG9iLCBjcmVhdGVPYmplY3RVUkwsIHJldm9rZU9iamVjdFVSTCwgYmxvYlRvQmluYXJ5U3RyaW5nLCBiYXNlNjRTdHJpbmdUb0Jsb2IsIGJpbmFyeVN0cmluZ1RvQmxvYiwgYmxvYlRvQmFzZTY0U3RyaW5nLCBkYXRhVVJMVG9CbG9iLCBibG9iVG9EYXRhVVJMLCBpbWdTcmNUb0RhdGFVUkwsIGNhbnZhc1RvQmxvYiwgaW1nU3JjVG9CbG9iLCBhcnJheUJ1ZmZlclRvQmxvYiwgYmxvYlRvQXJyYXlCdWZmZXIsIGFycmF5QnVmZmVyVG9CaW5hcnlTdHJpbmcsIGJpbmFyeVN0cmluZ1RvQXJyYXlCdWZmZXIgfTtcbiIsIi8qXG4gKiAgQ29weXJpZ2h0IDIwMTEgVHdpdHRlciwgSW5jLlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuKGZ1bmN0aW9uIChIb2dhbikge1xuICAvLyBTZXR1cCByZWdleCAgYXNzaWdubWVudHNcbiAgLy8gcmVtb3ZlIHdoaXRlc3BhY2UgYWNjb3JkaW5nIHRvIE11c3RhY2hlIHNwZWNcbiAgdmFyIHJJc1doaXRlc3BhY2UgPSAvXFxTLyxcbiAgICAgIHJRdW90ID0gL1xcXCIvZyxcbiAgICAgIHJOZXdsaW5lID0gIC9cXG4vZyxcbiAgICAgIHJDciA9IC9cXHIvZyxcbiAgICAgIHJTbGFzaCA9IC9cXFxcL2csXG4gICAgICByTGluZVNlcCA9IC9cXHUyMDI4LyxcbiAgICAgIHJQYXJhZ3JhcGhTZXAgPSAvXFx1MjAyOS87XG5cbiAgSG9nYW4udGFncyA9IHtcbiAgICAnIyc6IDEsICdeJzogMiwgJzwnOiAzLCAnJCc6IDQsXG4gICAgJy8nOiA1LCAnISc6IDYsICc+JzogNywgJz0nOiA4LCAnX3YnOiA5LFxuICAgICd7JzogMTAsICcmJzogMTEsICdfdCc6IDEyXG4gIH07XG5cbiAgSG9nYW4uc2NhbiA9IGZ1bmN0aW9uIHNjYW4odGV4dCwgZGVsaW1pdGVycykge1xuICAgIHZhciBsZW4gPSB0ZXh0Lmxlbmd0aCxcbiAgICAgICAgSU5fVEVYVCA9IDAsXG4gICAgICAgIElOX1RBR19UWVBFID0gMSxcbiAgICAgICAgSU5fVEFHID0gMixcbiAgICAgICAgc3RhdGUgPSBJTl9URVhULFxuICAgICAgICB0YWdUeXBlID0gbnVsbCxcbiAgICAgICAgdGFnID0gbnVsbCxcbiAgICAgICAgYnVmID0gJycsXG4gICAgICAgIHRva2VucyA9IFtdLFxuICAgICAgICBzZWVuVGFnID0gZmFsc2UsXG4gICAgICAgIGkgPSAwLFxuICAgICAgICBsaW5lU3RhcnQgPSAwLFxuICAgICAgICBvdGFnID0gJ3t7JyxcbiAgICAgICAgY3RhZyA9ICd9fSc7XG5cbiAgICBmdW5jdGlvbiBhZGRCdWYoKSB7XG4gICAgICBpZiAoYnVmLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdG9rZW5zLnB1c2goe3RhZzogJ190JywgdGV4dDogbmV3IFN0cmluZyhidWYpfSk7XG4gICAgICAgIGJ1ZiA9ICcnO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpbmVJc1doaXRlc3BhY2UoKSB7XG4gICAgICB2YXIgaXNBbGxXaGl0ZXNwYWNlID0gdHJ1ZTtcbiAgICAgIGZvciAodmFyIGogPSBsaW5lU3RhcnQ7IGogPCB0b2tlbnMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgaXNBbGxXaGl0ZXNwYWNlID1cbiAgICAgICAgICAoSG9nYW4udGFnc1t0b2tlbnNbal0udGFnXSA8IEhvZ2FuLnRhZ3NbJ192J10pIHx8XG4gICAgICAgICAgKHRva2Vuc1tqXS50YWcgPT0gJ190JyAmJiB0b2tlbnNbal0udGV4dC5tYXRjaChySXNXaGl0ZXNwYWNlKSA9PT0gbnVsbCk7XG4gICAgICAgIGlmICghaXNBbGxXaGl0ZXNwYWNlKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBpc0FsbFdoaXRlc3BhY2U7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZmlsdGVyTGluZShoYXZlU2VlblRhZywgbm9OZXdMaW5lKSB7XG4gICAgICBhZGRCdWYoKTtcblxuICAgICAgaWYgKGhhdmVTZWVuVGFnICYmIGxpbmVJc1doaXRlc3BhY2UoKSkge1xuICAgICAgICBmb3IgKHZhciBqID0gbGluZVN0YXJ0LCBuZXh0OyBqIDwgdG9rZW5zLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgaWYgKHRva2Vuc1tqXS50ZXh0KSB7XG4gICAgICAgICAgICBpZiAoKG5leHQgPSB0b2tlbnNbaisxXSkgJiYgbmV4dC50YWcgPT0gJz4nKSB7XG4gICAgICAgICAgICAgIC8vIHNldCBpbmRlbnQgdG8gdG9rZW4gdmFsdWVcbiAgICAgICAgICAgICAgbmV4dC5pbmRlbnQgPSB0b2tlbnNbal0udGV4dC50b1N0cmluZygpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0b2tlbnMuc3BsaWNlKGosIDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICghbm9OZXdMaW5lKSB7XG4gICAgICAgIHRva2Vucy5wdXNoKHt0YWc6J1xcbid9KTtcbiAgICAgIH1cblxuICAgICAgc2VlblRhZyA9IGZhbHNlO1xuICAgICAgbGluZVN0YXJ0ID0gdG9rZW5zLmxlbmd0aDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjaGFuZ2VEZWxpbWl0ZXJzKHRleHQsIGluZGV4KSB7XG4gICAgICB2YXIgY2xvc2UgPSAnPScgKyBjdGFnLFxuICAgICAgICAgIGNsb3NlSW5kZXggPSB0ZXh0LmluZGV4T2YoY2xvc2UsIGluZGV4KSxcbiAgICAgICAgICBkZWxpbWl0ZXJzID0gdHJpbShcbiAgICAgICAgICAgIHRleHQuc3Vic3RyaW5nKHRleHQuaW5kZXhPZignPScsIGluZGV4KSArIDEsIGNsb3NlSW5kZXgpXG4gICAgICAgICAgKS5zcGxpdCgnICcpO1xuXG4gICAgICBvdGFnID0gZGVsaW1pdGVyc1swXTtcbiAgICAgIGN0YWcgPSBkZWxpbWl0ZXJzW2RlbGltaXRlcnMubGVuZ3RoIC0gMV07XG5cbiAgICAgIHJldHVybiBjbG9zZUluZGV4ICsgY2xvc2UubGVuZ3RoIC0gMTtcbiAgICB9XG5cbiAgICBpZiAoZGVsaW1pdGVycykge1xuICAgICAgZGVsaW1pdGVycyA9IGRlbGltaXRlcnMuc3BsaXQoJyAnKTtcbiAgICAgIG90YWcgPSBkZWxpbWl0ZXJzWzBdO1xuICAgICAgY3RhZyA9IGRlbGltaXRlcnNbMV07XG4gICAgfVxuXG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBpZiAoc3RhdGUgPT0gSU5fVEVYVCkge1xuICAgICAgICBpZiAodGFnQ2hhbmdlKG90YWcsIHRleHQsIGkpKSB7XG4gICAgICAgICAgLS1pO1xuICAgICAgICAgIGFkZEJ1ZigpO1xuICAgICAgICAgIHN0YXRlID0gSU5fVEFHX1RZUEU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHRleHQuY2hhckF0KGkpID09ICdcXG4nKSB7XG4gICAgICAgICAgICBmaWx0ZXJMaW5lKHNlZW5UYWcpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBidWYgKz0gdGV4dC5jaGFyQXQoaSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHN0YXRlID09IElOX1RBR19UWVBFKSB7XG4gICAgICAgIGkgKz0gb3RhZy5sZW5ndGggLSAxO1xuICAgICAgICB0YWcgPSBIb2dhbi50YWdzW3RleHQuY2hhckF0KGkgKyAxKV07XG4gICAgICAgIHRhZ1R5cGUgPSB0YWcgPyB0ZXh0LmNoYXJBdChpICsgMSkgOiAnX3YnO1xuICAgICAgICBpZiAodGFnVHlwZSA9PSAnPScpIHtcbiAgICAgICAgICBpID0gY2hhbmdlRGVsaW1pdGVycyh0ZXh0LCBpKTtcbiAgICAgICAgICBzdGF0ZSA9IElOX1RFWFQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHRhZykge1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzdGF0ZSA9IElOX1RBRztcbiAgICAgICAgfVxuICAgICAgICBzZWVuVGFnID0gaTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0YWdDaGFuZ2UoY3RhZywgdGV4dCwgaSkpIHtcbiAgICAgICAgICB0b2tlbnMucHVzaCh7dGFnOiB0YWdUeXBlLCBuOiB0cmltKGJ1ZiksIG90YWc6IG90YWcsIGN0YWc6IGN0YWcsXG4gICAgICAgICAgICAgICAgICAgICAgIGk6ICh0YWdUeXBlID09ICcvJykgPyBzZWVuVGFnIC0gb3RhZy5sZW5ndGggOiBpICsgY3RhZy5sZW5ndGh9KTtcbiAgICAgICAgICBidWYgPSAnJztcbiAgICAgICAgICBpICs9IGN0YWcubGVuZ3RoIC0gMTtcbiAgICAgICAgICBzdGF0ZSA9IElOX1RFWFQ7XG4gICAgICAgICAgaWYgKHRhZ1R5cGUgPT0gJ3snKSB7XG4gICAgICAgICAgICBpZiAoY3RhZyA9PSAnfX0nKSB7XG4gICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNsZWFuVHJpcGxlU3RhY2hlKHRva2Vuc1t0b2tlbnMubGVuZ3RoIC0gMV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBidWYgKz0gdGV4dC5jaGFyQXQoaSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmaWx0ZXJMaW5lKHNlZW5UYWcsIHRydWUpO1xuXG4gICAgcmV0dXJuIHRva2VucztcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsZWFuVHJpcGxlU3RhY2hlKHRva2VuKSB7XG4gICAgaWYgKHRva2VuLm4uc3Vic3RyKHRva2VuLm4ubGVuZ3RoIC0gMSkgPT09ICd9Jykge1xuICAgICAgdG9rZW4ubiA9IHRva2VuLm4uc3Vic3RyaW5nKDAsIHRva2VuLm4ubGVuZ3RoIC0gMSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gdHJpbShzKSB7XG4gICAgaWYgKHMudHJpbSkge1xuICAgICAgcmV0dXJuIHMudHJpbSgpO1xuICAgIH1cblxuICAgIHJldHVybiBzLnJlcGxhY2UoL15cXHMqfFxccyokL2csICcnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRhZ0NoYW5nZSh0YWcsIHRleHQsIGluZGV4KSB7XG4gICAgaWYgKHRleHQuY2hhckF0KGluZGV4KSAhPSB0YWcuY2hhckF0KDApKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDEsIGwgPSB0YWcubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBpZiAodGV4dC5jaGFyQXQoaW5kZXggKyBpKSAhPSB0YWcuY2hhckF0KGkpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8vIHRoZSB0YWdzIGFsbG93ZWQgaW5zaWRlIHN1cGVyIHRlbXBsYXRlc1xuICB2YXIgYWxsb3dlZEluU3VwZXIgPSB7J190JzogdHJ1ZSwgJ1xcbic6IHRydWUsICckJzogdHJ1ZSwgJy8nOiB0cnVlfTtcblxuICBmdW5jdGlvbiBidWlsZFRyZWUodG9rZW5zLCBraW5kLCBzdGFjaywgY3VzdG9tVGFncykge1xuICAgIHZhciBpbnN0cnVjdGlvbnMgPSBbXSxcbiAgICAgICAgb3BlbmVyID0gbnVsbCxcbiAgICAgICAgdGFpbCA9IG51bGwsXG4gICAgICAgIHRva2VuID0gbnVsbDtcblxuICAgIHRhaWwgPSBzdGFja1tzdGFjay5sZW5ndGggLSAxXTtcblxuICAgIHdoaWxlICh0b2tlbnMubGVuZ3RoID4gMCkge1xuICAgICAgdG9rZW4gPSB0b2tlbnMuc2hpZnQoKTtcblxuICAgICAgaWYgKHRhaWwgJiYgdGFpbC50YWcgPT0gJzwnICYmICEodG9rZW4udGFnIGluIGFsbG93ZWRJblN1cGVyKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0lsbGVnYWwgY29udGVudCBpbiA8IHN1cGVyIHRhZy4nKTtcbiAgICAgIH1cblxuICAgICAgaWYgKEhvZ2FuLnRhZ3NbdG9rZW4udGFnXSA8PSBIb2dhbi50YWdzWyckJ10gfHwgaXNPcGVuZXIodG9rZW4sIGN1c3RvbVRhZ3MpKSB7XG4gICAgICAgIHN0YWNrLnB1c2godG9rZW4pO1xuICAgICAgICB0b2tlbi5ub2RlcyA9IGJ1aWxkVHJlZSh0b2tlbnMsIHRva2VuLnRhZywgc3RhY2ssIGN1c3RvbVRhZ3MpO1xuICAgICAgfSBlbHNlIGlmICh0b2tlbi50YWcgPT0gJy8nKSB7XG4gICAgICAgIGlmIChzdGFjay5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nsb3NpbmcgdGFnIHdpdGhvdXQgb3BlbmVyOiAvJyArIHRva2VuLm4pO1xuICAgICAgICB9XG4gICAgICAgIG9wZW5lciA9IHN0YWNrLnBvcCgpO1xuICAgICAgICBpZiAodG9rZW4ubiAhPSBvcGVuZXIubiAmJiAhaXNDbG9zZXIodG9rZW4ubiwgb3BlbmVyLm4sIGN1c3RvbVRhZ3MpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOZXN0aW5nIGVycm9yOiAnICsgb3BlbmVyLm4gKyAnIHZzLiAnICsgdG9rZW4ubik7XG4gICAgICAgIH1cbiAgICAgICAgb3BlbmVyLmVuZCA9IHRva2VuLmk7XG4gICAgICAgIHJldHVybiBpbnN0cnVjdGlvbnM7XG4gICAgICB9IGVsc2UgaWYgKHRva2VuLnRhZyA9PSAnXFxuJykge1xuICAgICAgICB0b2tlbi5sYXN0ID0gKHRva2Vucy5sZW5ndGggPT0gMCkgfHwgKHRva2Vuc1swXS50YWcgPT0gJ1xcbicpO1xuICAgICAgfVxuXG4gICAgICBpbnN0cnVjdGlvbnMucHVzaCh0b2tlbik7XG4gICAgfVxuXG4gICAgaWYgKHN0YWNrLmxlbmd0aCA+IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignbWlzc2luZyBjbG9zaW5nIHRhZzogJyArIHN0YWNrLnBvcCgpLm4pO1xuICAgIH1cblxuICAgIHJldHVybiBpbnN0cnVjdGlvbnM7XG4gIH1cblxuICBmdW5jdGlvbiBpc09wZW5lcih0b2tlbiwgdGFncykge1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gdGFncy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGlmICh0YWdzW2ldLm8gPT0gdG9rZW4ubikge1xuICAgICAgICB0b2tlbi50YWcgPSAnIyc7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGlzQ2xvc2VyKGNsb3NlLCBvcGVuLCB0YWdzKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSB0YWdzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgaWYgKHRhZ3NbaV0uYyA9PSBjbG9zZSAmJiB0YWdzW2ldLm8gPT0gb3Blbikge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzdHJpbmdpZnlTdWJzdGl0dXRpb25zKG9iaikge1xuICAgIHZhciBpdGVtcyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgIGl0ZW1zLnB1c2goJ1wiJyArIGVzYyhrZXkpICsgJ1wiOiBmdW5jdGlvbihjLHAsdCxpKSB7JyArIG9ialtrZXldICsgJ30nKTtcbiAgICB9XG4gICAgcmV0dXJuIFwieyBcIiArIGl0ZW1zLmpvaW4oXCIsXCIpICsgXCIgfVwiO1xuICB9XG5cbiAgZnVuY3Rpb24gc3RyaW5naWZ5UGFydGlhbHMoY29kZU9iaikge1xuICAgIHZhciBwYXJ0aWFscyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBjb2RlT2JqLnBhcnRpYWxzKSB7XG4gICAgICBwYXJ0aWFscy5wdXNoKCdcIicgKyBlc2Moa2V5KSArICdcIjp7bmFtZTpcIicgKyBlc2MoY29kZU9iai5wYXJ0aWFsc1trZXldLm5hbWUpICsgJ1wiLCAnICsgc3RyaW5naWZ5UGFydGlhbHMoY29kZU9iai5wYXJ0aWFsc1trZXldKSArIFwifVwiKTtcbiAgICB9XG4gICAgcmV0dXJuIFwicGFydGlhbHM6IHtcIiArIHBhcnRpYWxzLmpvaW4oXCIsXCIpICsgXCJ9LCBzdWJzOiBcIiArIHN0cmluZ2lmeVN1YnN0aXR1dGlvbnMoY29kZU9iai5zdWJzKTtcbiAgfVxuXG4gIEhvZ2FuLnN0cmluZ2lmeSA9IGZ1bmN0aW9uKGNvZGVPYmosIHRleHQsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gXCJ7Y29kZTogZnVuY3Rpb24gKGMscCxpKSB7IFwiICsgSG9nYW4ud3JhcE1haW4oY29kZU9iai5jb2RlKSArIFwiIH0sXCIgKyBzdHJpbmdpZnlQYXJ0aWFscyhjb2RlT2JqKSArICBcIn1cIjtcbiAgfVxuXG4gIHZhciBzZXJpYWxObyA9IDA7XG4gIEhvZ2FuLmdlbmVyYXRlID0gZnVuY3Rpb24odHJlZSwgdGV4dCwgb3B0aW9ucykge1xuICAgIHNlcmlhbE5vID0gMDtcbiAgICB2YXIgY29udGV4dCA9IHsgY29kZTogJycsIHN1YnM6IHt9LCBwYXJ0aWFsczoge30gfTtcbiAgICBIb2dhbi53YWxrKHRyZWUsIGNvbnRleHQpO1xuXG4gICAgaWYgKG9wdGlvbnMuYXNTdHJpbmcpIHtcbiAgICAgIHJldHVybiB0aGlzLnN0cmluZ2lmeShjb250ZXh0LCB0ZXh0LCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5tYWtlVGVtcGxhdGUoY29udGV4dCwgdGV4dCwgb3B0aW9ucyk7XG4gIH1cblxuICBIb2dhbi53cmFwTWFpbiA9IGZ1bmN0aW9uKGNvZGUpIHtcbiAgICByZXR1cm4gJ3ZhciB0PXRoaXM7dC5iKGk9aXx8XCJcIik7JyArIGNvZGUgKyAncmV0dXJuIHQuZmwoKTsnO1xuICB9XG5cbiAgSG9nYW4udGVtcGxhdGUgPSBIb2dhbi5UZW1wbGF0ZTtcblxuICBIb2dhbi5tYWtlVGVtcGxhdGUgPSBmdW5jdGlvbihjb2RlT2JqLCB0ZXh0LCBvcHRpb25zKSB7XG4gICAgdmFyIHRlbXBsYXRlID0gdGhpcy5tYWtlUGFydGlhbHMoY29kZU9iaik7XG4gICAgdGVtcGxhdGUuY29kZSA9IG5ldyBGdW5jdGlvbignYycsICdwJywgJ2knLCB0aGlzLndyYXBNYWluKGNvZGVPYmouY29kZSkpO1xuICAgIHJldHVybiBuZXcgdGhpcy50ZW1wbGF0ZSh0ZW1wbGF0ZSwgdGV4dCwgdGhpcywgb3B0aW9ucyk7XG4gIH1cblxuICBIb2dhbi5tYWtlUGFydGlhbHMgPSBmdW5jdGlvbihjb2RlT2JqKSB7XG4gICAgdmFyIGtleSwgdGVtcGxhdGUgPSB7c3Viczoge30sIHBhcnRpYWxzOiBjb2RlT2JqLnBhcnRpYWxzLCBuYW1lOiBjb2RlT2JqLm5hbWV9O1xuICAgIGZvciAoa2V5IGluIHRlbXBsYXRlLnBhcnRpYWxzKSB7XG4gICAgICB0ZW1wbGF0ZS5wYXJ0aWFsc1trZXldID0gdGhpcy5tYWtlUGFydGlhbHModGVtcGxhdGUucGFydGlhbHNba2V5XSk7XG4gICAgfVxuICAgIGZvciAoa2V5IGluIGNvZGVPYmouc3Vicykge1xuICAgICAgdGVtcGxhdGUuc3Vic1trZXldID0gbmV3IEZ1bmN0aW9uKCdjJywgJ3AnLCAndCcsICdpJywgY29kZU9iai5zdWJzW2tleV0pO1xuICAgIH1cbiAgICByZXR1cm4gdGVtcGxhdGU7XG4gIH1cblxuICBmdW5jdGlvbiBlc2Mocykge1xuICAgIHJldHVybiBzLnJlcGxhY2UoclNsYXNoLCAnXFxcXFxcXFwnKVxuICAgICAgICAgICAgLnJlcGxhY2UoclF1b3QsICdcXFxcXFxcIicpXG4gICAgICAgICAgICAucmVwbGFjZShyTmV3bGluZSwgJ1xcXFxuJylcbiAgICAgICAgICAgIC5yZXBsYWNlKHJDciwgJ1xcXFxyJylcbiAgICAgICAgICAgIC5yZXBsYWNlKHJMaW5lU2VwLCAnXFxcXHUyMDI4JylcbiAgICAgICAgICAgIC5yZXBsYWNlKHJQYXJhZ3JhcGhTZXAsICdcXFxcdTIwMjknKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNob29zZU1ldGhvZChzKSB7XG4gICAgcmV0dXJuICh+cy5pbmRleE9mKCcuJykpID8gJ2QnIDogJ2YnO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlUGFydGlhbChub2RlLCBjb250ZXh0KSB7XG4gICAgdmFyIHByZWZpeCA9IFwiPFwiICsgKGNvbnRleHQucHJlZml4IHx8IFwiXCIpO1xuICAgIHZhciBzeW0gPSBwcmVmaXggKyBub2RlLm4gKyBzZXJpYWxObysrO1xuICAgIGNvbnRleHQucGFydGlhbHNbc3ltXSA9IHtuYW1lOiBub2RlLm4sIHBhcnRpYWxzOiB7fX07XG4gICAgY29udGV4dC5jb2RlICs9ICd0LmIodC5ycChcIicgKyAgZXNjKHN5bSkgKyAnXCIsYyxwLFwiJyArIChub2RlLmluZGVudCB8fCAnJykgKyAnXCIpKTsnO1xuICAgIHJldHVybiBzeW07XG4gIH1cblxuICBIb2dhbi5jb2RlZ2VuID0ge1xuICAgICcjJzogZnVuY3Rpb24obm9kZSwgY29udGV4dCkge1xuICAgICAgY29udGV4dC5jb2RlICs9ICdpZih0LnModC4nICsgY2hvb3NlTWV0aG9kKG5vZGUubikgKyAnKFwiJyArIGVzYyhub2RlLm4pICsgJ1wiLGMscCwxKSwnICtcbiAgICAgICAgICAgICAgICAgICAgICAnYyxwLDAsJyArIG5vZGUuaSArICcsJyArIG5vZGUuZW5kICsgJyxcIicgKyBub2RlLm90YWcgKyBcIiBcIiArIG5vZGUuY3RhZyArICdcIikpeycgK1xuICAgICAgICAgICAgICAgICAgICAgICd0LnJzKGMscCwnICsgJ2Z1bmN0aW9uKGMscCx0KXsnO1xuICAgICAgSG9nYW4ud2Fsayhub2RlLm5vZGVzLCBjb250ZXh0KTtcbiAgICAgIGNvbnRleHQuY29kZSArPSAnfSk7Yy5wb3AoKTt9JztcbiAgICB9LFxuXG4gICAgJ14nOiBmdW5jdGlvbihub2RlLCBjb250ZXh0KSB7XG4gICAgICBjb250ZXh0LmNvZGUgKz0gJ2lmKCF0LnModC4nICsgY2hvb3NlTWV0aG9kKG5vZGUubikgKyAnKFwiJyArIGVzYyhub2RlLm4pICsgJ1wiLGMscCwxKSxjLHAsMSwwLDAsXCJcIikpeyc7XG4gICAgICBIb2dhbi53YWxrKG5vZGUubm9kZXMsIGNvbnRleHQpO1xuICAgICAgY29udGV4dC5jb2RlICs9ICd9Oyc7XG4gICAgfSxcblxuICAgICc+JzogY3JlYXRlUGFydGlhbCxcbiAgICAnPCc6IGZ1bmN0aW9uKG5vZGUsIGNvbnRleHQpIHtcbiAgICAgIHZhciBjdHggPSB7cGFydGlhbHM6IHt9LCBjb2RlOiAnJywgc3Viczoge30sIGluUGFydGlhbDogdHJ1ZX07XG4gICAgICBIb2dhbi53YWxrKG5vZGUubm9kZXMsIGN0eCk7XG4gICAgICB2YXIgdGVtcGxhdGUgPSBjb250ZXh0LnBhcnRpYWxzW2NyZWF0ZVBhcnRpYWwobm9kZSwgY29udGV4dCldO1xuICAgICAgdGVtcGxhdGUuc3VicyA9IGN0eC5zdWJzO1xuICAgICAgdGVtcGxhdGUucGFydGlhbHMgPSBjdHgucGFydGlhbHM7XG4gICAgfSxcblxuICAgICckJzogZnVuY3Rpb24obm9kZSwgY29udGV4dCkge1xuICAgICAgdmFyIGN0eCA9IHtzdWJzOiB7fSwgY29kZTogJycsIHBhcnRpYWxzOiBjb250ZXh0LnBhcnRpYWxzLCBwcmVmaXg6IG5vZGUubn07XG4gICAgICBIb2dhbi53YWxrKG5vZGUubm9kZXMsIGN0eCk7XG4gICAgICBjb250ZXh0LnN1YnNbbm9kZS5uXSA9IGN0eC5jb2RlO1xuICAgICAgaWYgKCFjb250ZXh0LmluUGFydGlhbCkge1xuICAgICAgICBjb250ZXh0LmNvZGUgKz0gJ3Quc3ViKFwiJyArIGVzYyhub2RlLm4pICsgJ1wiLGMscCxpKTsnO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAnXFxuJzogZnVuY3Rpb24obm9kZSwgY29udGV4dCkge1xuICAgICAgY29udGV4dC5jb2RlICs9IHdyaXRlKCdcIlxcXFxuXCInICsgKG5vZGUubGFzdCA/ICcnIDogJyArIGknKSk7XG4gICAgfSxcblxuICAgICdfdic6IGZ1bmN0aW9uKG5vZGUsIGNvbnRleHQpIHtcbiAgICAgIGNvbnRleHQuY29kZSArPSAndC5iKHQudih0LicgKyBjaG9vc2VNZXRob2Qobm9kZS5uKSArICcoXCInICsgZXNjKG5vZGUubikgKyAnXCIsYyxwLDApKSk7JztcbiAgICB9LFxuXG4gICAgJ190JzogZnVuY3Rpb24obm9kZSwgY29udGV4dCkge1xuICAgICAgY29udGV4dC5jb2RlICs9IHdyaXRlKCdcIicgKyBlc2Mobm9kZS50ZXh0KSArICdcIicpO1xuICAgIH0sXG5cbiAgICAneyc6IHRyaXBsZVN0YWNoZSxcblxuICAgICcmJzogdHJpcGxlU3RhY2hlXG4gIH1cblxuICBmdW5jdGlvbiB0cmlwbGVTdGFjaGUobm9kZSwgY29udGV4dCkge1xuICAgIGNvbnRleHQuY29kZSArPSAndC5iKHQudCh0LicgKyBjaG9vc2VNZXRob2Qobm9kZS5uKSArICcoXCInICsgZXNjKG5vZGUubikgKyAnXCIsYyxwLDApKSk7JztcbiAgfVxuXG4gIGZ1bmN0aW9uIHdyaXRlKHMpIHtcbiAgICByZXR1cm4gJ3QuYignICsgcyArICcpOyc7XG4gIH1cblxuICBIb2dhbi53YWxrID0gZnVuY3Rpb24obm9kZWxpc3QsIGNvbnRleHQpIHtcbiAgICB2YXIgZnVuYztcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IG5vZGVsaXN0Lmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgZnVuYyA9IEhvZ2FuLmNvZGVnZW5bbm9kZWxpc3RbaV0udGFnXTtcbiAgICAgIGZ1bmMgJiYgZnVuYyhub2RlbGlzdFtpXSwgY29udGV4dCk7XG4gICAgfVxuICAgIHJldHVybiBjb250ZXh0O1xuICB9XG5cbiAgSG9nYW4ucGFyc2UgPSBmdW5jdGlvbih0b2tlbnMsIHRleHQsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICByZXR1cm4gYnVpbGRUcmVlKHRva2VucywgJycsIFtdLCBvcHRpb25zLnNlY3Rpb25UYWdzIHx8IFtdKTtcbiAgfVxuXG4gIEhvZ2FuLmNhY2hlID0ge307XG5cbiAgSG9nYW4uY2FjaGVLZXkgPSBmdW5jdGlvbih0ZXh0LCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIFt0ZXh0LCAhIW9wdGlvbnMuYXNTdHJpbmcsICEhb3B0aW9ucy5kaXNhYmxlTGFtYmRhLCBvcHRpb25zLmRlbGltaXRlcnMsICEhb3B0aW9ucy5tb2RlbEdldF0uam9pbignfHwnKTtcbiAgfVxuXG4gIEhvZ2FuLmNvbXBpbGUgPSBmdW5jdGlvbih0ZXh0LCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgdmFyIGtleSA9IEhvZ2FuLmNhY2hlS2V5KHRleHQsIG9wdGlvbnMpO1xuICAgIHZhciB0ZW1wbGF0ZSA9IHRoaXMuY2FjaGVba2V5XTtcblxuICAgIGlmICh0ZW1wbGF0ZSkge1xuICAgICAgdmFyIHBhcnRpYWxzID0gdGVtcGxhdGUucGFydGlhbHM7XG4gICAgICBmb3IgKHZhciBuYW1lIGluIHBhcnRpYWxzKSB7XG4gICAgICAgIGRlbGV0ZSBwYXJ0aWFsc1tuYW1lXS5pbnN0YW5jZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgICB9XG5cbiAgICB0ZW1wbGF0ZSA9IHRoaXMuZ2VuZXJhdGUodGhpcy5wYXJzZSh0aGlzLnNjYW4odGV4dCwgb3B0aW9ucy5kZWxpbWl0ZXJzKSwgdGV4dCwgb3B0aW9ucyksIHRleHQsIG9wdGlvbnMpO1xuICAgIHJldHVybiB0aGlzLmNhY2hlW2tleV0gPSB0ZW1wbGF0ZTtcbiAgfVxufSkodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnID8gZXhwb3J0cyA6IEhvZ2FuKTtcbiIsIi8qXG4gKiAgQ29weXJpZ2h0IDIwMTEgVHdpdHRlciwgSW5jLlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLy8gVGhpcyBmaWxlIGlzIGZvciB1c2Ugd2l0aCBOb2RlLmpzLiBTZWUgZGlzdC8gZm9yIGJyb3dzZXIgZmlsZXMuXG5cbnZhciBIb2dhbiA9IHJlcXVpcmUoJy4vY29tcGlsZXInKTtcbkhvZ2FuLlRlbXBsYXRlID0gcmVxdWlyZSgnLi90ZW1wbGF0ZScpLlRlbXBsYXRlO1xuSG9nYW4udGVtcGxhdGUgPSBIb2dhbi5UZW1wbGF0ZTtcbm1vZHVsZS5leHBvcnRzID0gSG9nYW47XG4iLCIvKlxuICogIENvcHlyaWdodCAyMDExIFR3aXR0ZXIsIEluYy5cbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbnZhciBIb2dhbiA9IHt9O1xuXG4oZnVuY3Rpb24gKEhvZ2FuKSB7XG4gIEhvZ2FuLlRlbXBsYXRlID0gZnVuY3Rpb24gKGNvZGVPYmosIHRleHQsIGNvbXBpbGVyLCBvcHRpb25zKSB7XG4gICAgY29kZU9iaiA9IGNvZGVPYmogfHwge307XG4gICAgdGhpcy5yID0gY29kZU9iai5jb2RlIHx8IHRoaXMucjtcbiAgICB0aGlzLmMgPSBjb21waWxlcjtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIHRoaXMudGV4dCA9IHRleHQgfHwgJyc7XG4gICAgdGhpcy5wYXJ0aWFscyA9IGNvZGVPYmoucGFydGlhbHMgfHwge307XG4gICAgdGhpcy5zdWJzID0gY29kZU9iai5zdWJzIHx8IHt9O1xuICAgIHRoaXMuYnVmID0gJyc7XG4gIH1cblxuICBIb2dhbi5UZW1wbGF0ZS5wcm90b3R5cGUgPSB7XG4gICAgLy8gcmVuZGVyOiByZXBsYWNlZCBieSBnZW5lcmF0ZWQgY29kZS5cbiAgICByOiBmdW5jdGlvbiAoY29udGV4dCwgcGFydGlhbHMsIGluZGVudCkgeyByZXR1cm4gJyc7IH0sXG5cbiAgICAvLyB2YXJpYWJsZSBlc2NhcGluZ1xuICAgIHY6IGhvZ2FuRXNjYXBlLFxuXG4gICAgLy8gdHJpcGxlIHN0YWNoZVxuICAgIHQ6IGNvZXJjZVRvU3RyaW5nLFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoY29udGV4dCwgcGFydGlhbHMsIGluZGVudCkge1xuICAgICAgcmV0dXJuIHRoaXMucmkoW2NvbnRleHRdLCBwYXJ0aWFscyB8fCB7fSwgaW5kZW50KTtcbiAgICB9LFxuXG4gICAgLy8gcmVuZGVyIGludGVybmFsIC0tIGEgaG9vayBmb3Igb3ZlcnJpZGVzIHRoYXQgY2F0Y2hlcyBwYXJ0aWFscyB0b29cbiAgICByaTogZnVuY3Rpb24gKGNvbnRleHQsIHBhcnRpYWxzLCBpbmRlbnQpIHtcbiAgICAgIHJldHVybiB0aGlzLnIoY29udGV4dCwgcGFydGlhbHMsIGluZGVudCk7XG4gICAgfSxcblxuICAgIC8vIGVuc3VyZVBhcnRpYWxcbiAgICBlcDogZnVuY3Rpb24oc3ltYm9sLCBwYXJ0aWFscykge1xuICAgICAgdmFyIHBhcnRpYWwgPSB0aGlzLnBhcnRpYWxzW3N5bWJvbF07XG5cbiAgICAgIC8vIGNoZWNrIHRvIHNlZSB0aGF0IGlmIHdlJ3ZlIGluc3RhbnRpYXRlZCB0aGlzIHBhcnRpYWwgYmVmb3JlXG4gICAgICB2YXIgdGVtcGxhdGUgPSBwYXJ0aWFsc1twYXJ0aWFsLm5hbWVdO1xuICAgICAgaWYgKHBhcnRpYWwuaW5zdGFuY2UgJiYgcGFydGlhbC5iYXNlID09IHRlbXBsYXRlKSB7XG4gICAgICAgIHJldHVybiBwYXJ0aWFsLmluc3RhbmNlO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIHRlbXBsYXRlID09ICdzdHJpbmcnKSB7XG4gICAgICAgIGlmICghdGhpcy5jKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gY29tcGlsZXIgYXZhaWxhYmxlLlwiKTtcbiAgICAgICAgfVxuICAgICAgICB0ZW1wbGF0ZSA9IHRoaXMuYy5jb21waWxlKHRlbXBsYXRlLCB0aGlzLm9wdGlvbnMpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXRlbXBsYXRlKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICAvLyBXZSB1c2UgdGhpcyB0byBjaGVjayB3aGV0aGVyIHRoZSBwYXJ0aWFscyBkaWN0aW9uYXJ5IGhhcyBjaGFuZ2VkXG4gICAgICB0aGlzLnBhcnRpYWxzW3N5bWJvbF0uYmFzZSA9IHRlbXBsYXRlO1xuXG4gICAgICBpZiAocGFydGlhbC5zdWJzKSB7XG4gICAgICAgIC8vIE1ha2Ugc3VyZSB3ZSBjb25zaWRlciBwYXJlbnQgdGVtcGxhdGUgbm93XG4gICAgICAgIGlmICghcGFydGlhbHMuc3RhY2tUZXh0KSBwYXJ0aWFscy5zdGFja1RleHQgPSB7fTtcbiAgICAgICAgZm9yIChrZXkgaW4gcGFydGlhbC5zdWJzKSB7XG4gICAgICAgICAgaWYgKCFwYXJ0aWFscy5zdGFja1RleHRba2V5XSkge1xuICAgICAgICAgICAgcGFydGlhbHMuc3RhY2tUZXh0W2tleV0gPSAodGhpcy5hY3RpdmVTdWIgIT09IHVuZGVmaW5lZCAmJiBwYXJ0aWFscy5zdGFja1RleHRbdGhpcy5hY3RpdmVTdWJdKSA/IHBhcnRpYWxzLnN0YWNrVGV4dFt0aGlzLmFjdGl2ZVN1Yl0gOiB0aGlzLnRleHQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRlbXBsYXRlID0gY3JlYXRlU3BlY2lhbGl6ZWRQYXJ0aWFsKHRlbXBsYXRlLCBwYXJ0aWFsLnN1YnMsIHBhcnRpYWwucGFydGlhbHMsXG4gICAgICAgICAgdGhpcy5zdGFja1N1YnMsIHRoaXMuc3RhY2tQYXJ0aWFscywgcGFydGlhbHMuc3RhY2tUZXh0KTtcbiAgICAgIH1cbiAgICAgIHRoaXMucGFydGlhbHNbc3ltYm9sXS5pbnN0YW5jZSA9IHRlbXBsYXRlO1xuXG4gICAgICByZXR1cm4gdGVtcGxhdGU7XG4gICAgfSxcblxuICAgIC8vIHRyaWVzIHRvIGZpbmQgYSBwYXJ0aWFsIGluIHRoZSBjdXJyZW50IHNjb3BlIGFuZCByZW5kZXIgaXRcbiAgICBycDogZnVuY3Rpb24oc3ltYm9sLCBjb250ZXh0LCBwYXJ0aWFscywgaW5kZW50KSB7XG4gICAgICB2YXIgcGFydGlhbCA9IHRoaXMuZXAoc3ltYm9sLCBwYXJ0aWFscyk7XG4gICAgICBpZiAoIXBhcnRpYWwpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcGFydGlhbC5yaShjb250ZXh0LCBwYXJ0aWFscywgaW5kZW50KTtcbiAgICB9LFxuXG4gICAgLy8gcmVuZGVyIGEgc2VjdGlvblxuICAgIHJzOiBmdW5jdGlvbihjb250ZXh0LCBwYXJ0aWFscywgc2VjdGlvbikge1xuICAgICAgdmFyIHRhaWwgPSBjb250ZXh0W2NvbnRleHQubGVuZ3RoIC0gMV07XG5cbiAgICAgIGlmICghaXNBcnJheSh0YWlsKSkge1xuICAgICAgICBzZWN0aW9uKGNvbnRleHQsIHBhcnRpYWxzLCB0aGlzKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhaWwubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29udGV4dC5wdXNoKHRhaWxbaV0pO1xuICAgICAgICBzZWN0aW9uKGNvbnRleHQsIHBhcnRpYWxzLCB0aGlzKTtcbiAgICAgICAgY29udGV4dC5wb3AoKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gbWF5YmUgc3RhcnQgYSBzZWN0aW9uXG4gICAgczogZnVuY3Rpb24odmFsLCBjdHgsIHBhcnRpYWxzLCBpbnZlcnRlZCwgc3RhcnQsIGVuZCwgdGFncykge1xuICAgICAgdmFyIHBhc3M7XG5cbiAgICAgIGlmIChpc0FycmF5KHZhbCkgJiYgdmFsLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgdmFsID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdmFsID0gdGhpcy5tcyh2YWwsIGN0eCwgcGFydGlhbHMsIGludmVydGVkLCBzdGFydCwgZW5kLCB0YWdzKTtcbiAgICAgIH1cblxuICAgICAgcGFzcyA9ICEhdmFsO1xuXG4gICAgICBpZiAoIWludmVydGVkICYmIHBhc3MgJiYgY3R4KSB7XG4gICAgICAgIGN0eC5wdXNoKCh0eXBlb2YgdmFsID09ICdvYmplY3QnKSA/IHZhbCA6IGN0eFtjdHgubGVuZ3RoIC0gMV0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcGFzcztcbiAgICB9LFxuXG4gICAgLy8gZmluZCB2YWx1ZXMgd2l0aCBkb3R0ZWQgbmFtZXNcbiAgICBkOiBmdW5jdGlvbihrZXksIGN0eCwgcGFydGlhbHMsIHJldHVybkZvdW5kKSB7XG4gICAgICB2YXIgZm91bmQsXG4gICAgICAgICAgbmFtZXMgPSBrZXkuc3BsaXQoJy4nKSxcbiAgICAgICAgICB2YWwgPSB0aGlzLmYobmFtZXNbMF0sIGN0eCwgcGFydGlhbHMsIHJldHVybkZvdW5kKSxcbiAgICAgICAgICBkb01vZGVsR2V0ID0gdGhpcy5vcHRpb25zLm1vZGVsR2V0LFxuICAgICAgICAgIGN4ID0gbnVsbDtcblxuICAgICAgaWYgKGtleSA9PT0gJy4nICYmIGlzQXJyYXkoY3R4W2N0eC5sZW5ndGggLSAyXSkpIHtcbiAgICAgICAgdmFsID0gY3R4W2N0eC5sZW5ndGggLSAxXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgbmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBmb3VuZCA9IGZpbmRJblNjb3BlKG5hbWVzW2ldLCB2YWwsIGRvTW9kZWxHZXQpO1xuICAgICAgICAgIGlmIChmb3VuZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjeCA9IHZhbDtcbiAgICAgICAgICAgIHZhbCA9IGZvdW5kO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YWwgPSAnJztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHJldHVybkZvdW5kICYmICF2YWwpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXJldHVybkZvdW5kICYmIHR5cGVvZiB2YWwgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBjdHgucHVzaChjeCk7XG4gICAgICAgIHZhbCA9IHRoaXMubXYodmFsLCBjdHgsIHBhcnRpYWxzKTtcbiAgICAgICAgY3R4LnBvcCgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdmFsO1xuICAgIH0sXG5cbiAgICAvLyBmaW5kIHZhbHVlcyB3aXRoIG5vcm1hbCBuYW1lc1xuICAgIGY6IGZ1bmN0aW9uKGtleSwgY3R4LCBwYXJ0aWFscywgcmV0dXJuRm91bmQpIHtcbiAgICAgIHZhciB2YWwgPSBmYWxzZSxcbiAgICAgICAgICB2ID0gbnVsbCxcbiAgICAgICAgICBmb3VuZCA9IGZhbHNlLFxuICAgICAgICAgIGRvTW9kZWxHZXQgPSB0aGlzLm9wdGlvbnMubW9kZWxHZXQ7XG5cbiAgICAgIGZvciAodmFyIGkgPSBjdHgubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgdiA9IGN0eFtpXTtcbiAgICAgICAgdmFsID0gZmluZEluU2NvcGUoa2V5LCB2LCBkb01vZGVsR2V0KTtcbiAgICAgICAgaWYgKHZhbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghZm91bmQpIHtcbiAgICAgICAgcmV0dXJuIChyZXR1cm5Gb3VuZCkgPyBmYWxzZSA6IFwiXCI7XG4gICAgICB9XG5cbiAgICAgIGlmICghcmV0dXJuRm91bmQgJiYgdHlwZW9mIHZhbCA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHZhbCA9IHRoaXMubXYodmFsLCBjdHgsIHBhcnRpYWxzKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHZhbDtcbiAgICB9LFxuXG4gICAgLy8gaGlnaGVyIG9yZGVyIHRlbXBsYXRlc1xuICAgIGxzOiBmdW5jdGlvbihmdW5jLCBjeCwgcGFydGlhbHMsIHRleHQsIHRhZ3MpIHtcbiAgICAgIHZhciBvbGRUYWdzID0gdGhpcy5vcHRpb25zLmRlbGltaXRlcnM7XG5cbiAgICAgIHRoaXMub3B0aW9ucy5kZWxpbWl0ZXJzID0gdGFncztcbiAgICAgIHRoaXMuYih0aGlzLmN0KGNvZXJjZVRvU3RyaW5nKGZ1bmMuY2FsbChjeCwgdGV4dCkpLCBjeCwgcGFydGlhbHMpKTtcbiAgICAgIHRoaXMub3B0aW9ucy5kZWxpbWl0ZXJzID0gb2xkVGFncztcblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG5cbiAgICAvLyBjb21waWxlIHRleHRcbiAgICBjdDogZnVuY3Rpb24odGV4dCwgY3gsIHBhcnRpYWxzKSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmRpc2FibGVMYW1iZGEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdMYW1iZGEgZmVhdHVyZXMgZGlzYWJsZWQuJyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5jLmNvbXBpbGUodGV4dCwgdGhpcy5vcHRpb25zKS5yZW5kZXIoY3gsIHBhcnRpYWxzKTtcbiAgICB9LFxuXG4gICAgLy8gdGVtcGxhdGUgcmVzdWx0IGJ1ZmZlcmluZ1xuICAgIGI6IGZ1bmN0aW9uKHMpIHsgdGhpcy5idWYgKz0gczsgfSxcblxuICAgIGZsOiBmdW5jdGlvbigpIHsgdmFyIHIgPSB0aGlzLmJ1ZjsgdGhpcy5idWYgPSAnJzsgcmV0dXJuIHI7IH0sXG5cbiAgICAvLyBtZXRob2QgcmVwbGFjZSBzZWN0aW9uXG4gICAgbXM6IGZ1bmN0aW9uKGZ1bmMsIGN0eCwgcGFydGlhbHMsIGludmVydGVkLCBzdGFydCwgZW5kLCB0YWdzKSB7XG4gICAgICB2YXIgdGV4dFNvdXJjZSxcbiAgICAgICAgICBjeCA9IGN0eFtjdHgubGVuZ3RoIC0gMV0sXG4gICAgICAgICAgcmVzdWx0ID0gZnVuYy5jYWxsKGN4KTtcblxuICAgICAgaWYgKHR5cGVvZiByZXN1bHQgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBpZiAoaW52ZXJ0ZWQpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0ZXh0U291cmNlID0gKHRoaXMuYWN0aXZlU3ViICYmIHRoaXMuc3Vic1RleHQgJiYgdGhpcy5zdWJzVGV4dFt0aGlzLmFjdGl2ZVN1Yl0pID8gdGhpcy5zdWJzVGV4dFt0aGlzLmFjdGl2ZVN1Yl0gOiB0aGlzLnRleHQ7XG4gICAgICAgICAgcmV0dXJuIHRoaXMubHMocmVzdWx0LCBjeCwgcGFydGlhbHMsIHRleHRTb3VyY2Uuc3Vic3RyaW5nKHN0YXJ0LCBlbmQpLCB0YWdzKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG5cbiAgICAvLyBtZXRob2QgcmVwbGFjZSB2YXJpYWJsZVxuICAgIG12OiBmdW5jdGlvbihmdW5jLCBjdHgsIHBhcnRpYWxzKSB7XG4gICAgICB2YXIgY3ggPSBjdHhbY3R4Lmxlbmd0aCAtIDFdO1xuICAgICAgdmFyIHJlc3VsdCA9IGZ1bmMuY2FsbChjeCk7XG5cbiAgICAgIGlmICh0eXBlb2YgcmVzdWx0ID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3QoY29lcmNlVG9TdHJpbmcocmVzdWx0LmNhbGwoY3gpKSwgY3gsIHBhcnRpYWxzKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LFxuXG4gICAgc3ViOiBmdW5jdGlvbihuYW1lLCBjb250ZXh0LCBwYXJ0aWFscywgaW5kZW50KSB7XG4gICAgICB2YXIgZiA9IHRoaXMuc3Vic1tuYW1lXTtcbiAgICAgIGlmIChmKSB7XG4gICAgICAgIHRoaXMuYWN0aXZlU3ViID0gbmFtZTtcbiAgICAgICAgZihjb250ZXh0LCBwYXJ0aWFscywgdGhpcywgaW5kZW50KTtcbiAgICAgICAgdGhpcy5hY3RpdmVTdWIgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgfTtcblxuICAvL0ZpbmQgYSBrZXkgaW4gYW4gb2JqZWN0XG4gIGZ1bmN0aW9uIGZpbmRJblNjb3BlKGtleSwgc2NvcGUsIGRvTW9kZWxHZXQpIHtcbiAgICB2YXIgdmFsO1xuXG4gICAgaWYgKHNjb3BlICYmIHR5cGVvZiBzY29wZSA9PSAnb2JqZWN0Jykge1xuXG4gICAgICBpZiAoc2NvcGVba2V5XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHZhbCA9IHNjb3BlW2tleV07XG5cbiAgICAgIC8vIHRyeSBsb29rdXAgd2l0aCBnZXQgZm9yIGJhY2tib25lIG9yIHNpbWlsYXIgbW9kZWwgZGF0YVxuICAgICAgfSBlbHNlIGlmIChkb01vZGVsR2V0ICYmIHNjb3BlLmdldCAmJiB0eXBlb2Ygc2NvcGUuZ2V0ID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdmFsID0gc2NvcGUuZ2V0KGtleSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVNwZWNpYWxpemVkUGFydGlhbChpbnN0YW5jZSwgc3VicywgcGFydGlhbHMsIHN0YWNrU3Vicywgc3RhY2tQYXJ0aWFscywgc3RhY2tUZXh0KSB7XG4gICAgZnVuY3Rpb24gUGFydGlhbFRlbXBsYXRlKCkge307XG4gICAgUGFydGlhbFRlbXBsYXRlLnByb3RvdHlwZSA9IGluc3RhbmNlO1xuICAgIGZ1bmN0aW9uIFN1YnN0aXR1dGlvbnMoKSB7fTtcbiAgICBTdWJzdGl0dXRpb25zLnByb3RvdHlwZSA9IGluc3RhbmNlLnN1YnM7XG4gICAgdmFyIGtleTtcbiAgICB2YXIgcGFydGlhbCA9IG5ldyBQYXJ0aWFsVGVtcGxhdGUoKTtcbiAgICBwYXJ0aWFsLnN1YnMgPSBuZXcgU3Vic3RpdHV0aW9ucygpO1xuICAgIHBhcnRpYWwuc3Vic1RleHQgPSB7fTsgIC8vaGVoZS4gc3Vic3RleHQuXG4gICAgcGFydGlhbC5idWYgPSAnJztcblxuICAgIHN0YWNrU3VicyA9IHN0YWNrU3VicyB8fCB7fTtcbiAgICBwYXJ0aWFsLnN0YWNrU3VicyA9IHN0YWNrU3VicztcbiAgICBwYXJ0aWFsLnN1YnNUZXh0ID0gc3RhY2tUZXh0O1xuICAgIGZvciAoa2V5IGluIHN1YnMpIHtcbiAgICAgIGlmICghc3RhY2tTdWJzW2tleV0pIHN0YWNrU3Vic1trZXldID0gc3Vic1trZXldO1xuICAgIH1cbiAgICBmb3IgKGtleSBpbiBzdGFja1N1YnMpIHtcbiAgICAgIHBhcnRpYWwuc3Vic1trZXldID0gc3RhY2tTdWJzW2tleV07XG4gICAgfVxuXG4gICAgc3RhY2tQYXJ0aWFscyA9IHN0YWNrUGFydGlhbHMgfHwge307XG4gICAgcGFydGlhbC5zdGFja1BhcnRpYWxzID0gc3RhY2tQYXJ0aWFscztcbiAgICBmb3IgKGtleSBpbiBwYXJ0aWFscykge1xuICAgICAgaWYgKCFzdGFja1BhcnRpYWxzW2tleV0pIHN0YWNrUGFydGlhbHNba2V5XSA9IHBhcnRpYWxzW2tleV07XG4gICAgfVxuICAgIGZvciAoa2V5IGluIHN0YWNrUGFydGlhbHMpIHtcbiAgICAgIHBhcnRpYWwucGFydGlhbHNba2V5XSA9IHN0YWNrUGFydGlhbHNba2V5XTtcbiAgICB9XG5cbiAgICByZXR1cm4gcGFydGlhbDtcbiAgfVxuXG4gIHZhciByQW1wID0gLyYvZyxcbiAgICAgIHJMdCA9IC88L2csXG4gICAgICByR3QgPSAvPi9nLFxuICAgICAgckFwb3MgPSAvXFwnL2csXG4gICAgICByUXVvdCA9IC9cXFwiL2csXG4gICAgICBoQ2hhcnMgPSAvWyY8PlxcXCJcXCddLztcblxuICBmdW5jdGlvbiBjb2VyY2VUb1N0cmluZyh2YWwpIHtcbiAgICByZXR1cm4gU3RyaW5nKCh2YWwgPT09IG51bGwgfHwgdmFsID09PSB1bmRlZmluZWQpID8gJycgOiB2YWwpO1xuICB9XG5cbiAgZnVuY3Rpb24gaG9nYW5Fc2NhcGUoc3RyKSB7XG4gICAgc3RyID0gY29lcmNlVG9TdHJpbmcoc3RyKTtcbiAgICByZXR1cm4gaENoYXJzLnRlc3Qoc3RyKSA/XG4gICAgICBzdHJcbiAgICAgICAgLnJlcGxhY2UockFtcCwgJyZhbXA7JylcbiAgICAgICAgLnJlcGxhY2Uockx0LCAnJmx0OycpXG4gICAgICAgIC5yZXBsYWNlKHJHdCwgJyZndDsnKVxuICAgICAgICAucmVwbGFjZShyQXBvcywgJyYjMzk7JylcbiAgICAgICAgLnJlcGxhY2UoclF1b3QsICcmcXVvdDsnKSA6XG4gICAgICBzdHI7XG4gIH1cblxuICB2YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24oYSkge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYSkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gIH07XG5cbn0pKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJyA/IGV4cG9ydHMgOiBIb2dhbik7XG4iLCJ2YXIgSCA9IHJlcXVpcmUoXCJob2dhbi5qc1wiKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7IHZhciBUID0gbmV3IEguVGVtcGxhdGUoe2NvZGU6IGZ1bmN0aW9uIChjLHAsaSkgeyB2YXIgdD10aGlzO3QuYihpPWl8fFwiXCIpO3QuYihcIjxsaVwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgaWQ9XFxcImFwcGVhcmFuY2UtaXRlbS1cIik7dC5iKHQudih0LmYoXCJpdGVtaWRcIixjLHAsMCkpKTt0LmIoXCJcXFwiXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICBjbGFzcz1cXFwiYXBwZWFyYW5jZS1pdGVtIGdyb3VwLVwiKTt0LmIodC52KHQuZihcImdyb3VwXCIsYyxwLDApKSk7dC5iKFwiXFxcIlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgZGF0YS1pdGVtaWQ9XFxcIlwiKTt0LmIodC52KHQuZihcIml0ZW1pZFwiLGMscCwwKSkpO3QuYihcIlxcXCJcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIGRhdGEtbmFtZT1cXFwiXCIpO3QuYih0LnYodC5mKFwibmFtZVwiLGMscCwwKSkpO3QuYihcIlxcXCJcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIGRhdGEtcmFyaXR5PVxcXCJcIik7dC5iKHQudih0LmYoXCJyYXJpdHlcIixjLHAsMCkpKTt0LmIoXCJcXFwiXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICBkYXRhLXJhcml0eW5hbWU9XFxcIlwiKTt0LmIodC52KHQuZihcInJhcml0eW5hbWVcIixjLHAsMCkpKTt0LmIoXCJcXFwiXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgPGRpdiBjbGFzcz1cXFwicmFyaXR5LW1hcmtlci1cIik7dC5iKHQudih0LmYoXCJyYXJpdHlcIixjLHAsMCkpKTt0LmIoXCJcXFwiPjwvZGl2PlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgPGltZyBjbGFzcz1cXFwiYXBwZWFyYW5jZS1pdGVtLWljb25cXFwiIHNyYz1cXFwiXCIpO3QuYih0LnYodC5mKFwiaWNvblwiLGMscCwwKSkpO3QuYihcIlxcXCIgLz5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCI8L2xpPlwiKTt0LmIoXCJcXG5cIik7cmV0dXJuIHQuZmwoKTsgfSxwYXJ0aWFsczoge30sIHN1YnM6IHsgIH19LCBcIjxsaVxcbiAgaWQ9XFxcImFwcGVhcmFuY2UtaXRlbS17e2l0ZW1pZH19XFxcIlxcbiAgY2xhc3M9XFxcImFwcGVhcmFuY2UtaXRlbSBncm91cC17e2dyb3VwfX1cXFwiXFxuICBkYXRhLWl0ZW1pZD1cXFwie3tpdGVtaWR9fVxcXCJcXG4gIGRhdGEtbmFtZT1cXFwie3tuYW1lfX1cXFwiXFxuICBkYXRhLXJhcml0eT1cXFwie3tyYXJpdHl9fVxcXCJcXG4gIGRhdGEtcmFyaXR5bmFtZT1cXFwie3tyYXJpdHluYW1lfX1cXFwiXFxuPlxcbiAgPGRpdiBjbGFzcz1cXFwicmFyaXR5LW1hcmtlci17e3Jhcml0eX19XFxcIj48L2Rpdj5cXG4gIDxpbWcgY2xhc3M9XFxcImFwcGVhcmFuY2UtaXRlbS1pY29uXFxcIiBzcmM9XFxcInt7aWNvbn19XFxcIiAvPlxcbjwvbGk+XFxuXCIsIEgpO3JldHVybiBUOyB9KCk7IiwidmFyIEggPSByZXF1aXJlKFwiaG9nYW4uanNcIik7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkgeyB2YXIgVCA9IG5ldyBILlRlbXBsYXRlKHtjb2RlOiBmdW5jdGlvbiAoYyxwLGkpIHsgdmFyIHQ9dGhpczt0LmIoaT1pfHxcIlwiKTt0LmIoXCI8ZGl2XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICBpZD1cXFwiZWUtY2F0ZWdvcnlcXFwiXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICBjbGFzcz1cXFwiYXBwZWFyYW5jZS1pdGVtcy1jYXRlZ29yeSBhY3RpdmVcXFwiXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICBkYXRhLWNhdGVnb3J5PVxcXCJcIik7dC5iKHQudih0LmYoXCJjYXRlZ29yeVwiLGMscCwwKSkpO3QuYihcIlxcXCJcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIGRhdGEtY2F0ZWdvcnlpZD1cXFwiXCIpO3QuYih0LnYodC5mKFwiY2F0ZWdvcnlpZFwiLGMscCwwKSkpO3QuYihcIlxcXCJcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCI+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICA8c3R5bGU+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICNlZS1pdGVtcyB7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgc2Nyb2xsYmFyLWNvbG9yOiBkYXJrO1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIHNjcm9sbGJhci13aWR0aDogdGhpbjtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgfVwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgPC9zdHlsZT5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIDx1bFwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICBjbGFzcz1cXFwiYXBwZWFyYW5jZS1pdGVtcy1saXN0XFxcIlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICBpZD1cXFwiZWUtaXRlbXNcXFwiXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgIHN0eWxlPVxcXCJtYXgtaGVpZ2h0OiBjYWxjKDEwMHZoIC0gNTY1cHgpXFxcIlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICBcIik7dC5iKHQudCh0LmYoXCJpdGVtc1wiLGMscCwwKSkpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICA8L3VsPlwiKTt0LmIoXCJcXG5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIDwhLS0gSW5mbyAtLT5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIDxkaXYgaWQ9XFxcImVlLWluZm9cXFwiIGNsYXNzPVxcXCJhcHBlYXJhbmNlLWl0ZW1zLWluZm9cXFwiPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICA8ZGl2IGNsYXNzPVxcXCJhcHBlYXJhbmNlLWluZm8tdGlwc1xcXCI+PC9kaXY+XCIpO3QuYihcIlxcblwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICA8aDMgY2xhc3M9XFxcImFwcGVhcmFuY2UtaXRlbS1pbmZvLW5hbWVcXFwiPjwvaDM+XCIpO3QuYihcIlxcblwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICA8ZGl2IGNsYXNzPVxcXCJhcHBlYXJhbmNlLWl0ZW0taW5mby1ndWFyZFxcXCI+PC9kaXY+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgIDxkaXYgY2xhc3M9XFxcImFwcGVhcmFuY2UtaXRlbS1pbmZvLXJhcml0eVxcXCI+PC9kaXY+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgIDxkaXYgY2xhc3M9XFxcImFwcGVhcmFuY2UtaXRlbS1pbmZvLWJ1dHRvbnNcXFwiPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIDxkaXYgY2xhc3M9XFxcImFwcGVhcmFuY2UtZm9yd2FyZCBubC1idXR0b25cXFwiPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgICAgXCIpO3QuYih0LnYodC5kKFwidHJhbnNsYXRlLmFwcGVhcmFuY2UuYnV0dG9ucy5mb3J3YXJkXCIsYyxwLDApKSk7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICA8L2Rpdj5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICA8ZGl2IGNsYXNzPVxcXCJhcHBlYXJhbmNlLWJhY2t3YXJkIG5sLWJ1dHRvblxcXCI+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgICBcIik7dC5iKHQudih0LmQoXCJ0cmFuc2xhdGUuYXBwZWFyYW5jZS5idXR0b25zLmJhY2t3YXJkXCIsYyxwLDApKSk7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICA8L2Rpdj5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgPC9kaXY+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICA8L2Rpdj5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCI8L2Rpdj5cIik7dC5iKFwiXFxuXCIpO3JldHVybiB0LmZsKCk7IH0scGFydGlhbHM6IHt9LCBzdWJzOiB7ICB9fSwgXCI8ZGl2XFxuICBpZD1cXFwiZWUtY2F0ZWdvcnlcXFwiXFxuICBjbGFzcz1cXFwiYXBwZWFyYW5jZS1pdGVtcy1jYXRlZ29yeSBhY3RpdmVcXFwiXFxuICBkYXRhLWNhdGVnb3J5PVxcXCJ7e2NhdGVnb3J5fX1cXFwiXFxuICBkYXRhLWNhdGVnb3J5aWQ9XFxcInt7Y2F0ZWdvcnlpZH19XFxcIlxcbj5cXG4gIDxzdHlsZT5cXG4gICAgI2VlLWl0ZW1zIHtcXG4gICAgICBzY3JvbGxiYXItY29sb3I6IGRhcms7XFxuICAgICAgc2Nyb2xsYmFyLXdpZHRoOiB0aGluO1xcbiAgICB9XFxuICA8L3N0eWxlPlxcbiAgPHVsXFxuICAgIGNsYXNzPVxcXCJhcHBlYXJhbmNlLWl0ZW1zLWxpc3RcXFwiXFxuICAgIGlkPVxcXCJlZS1pdGVtc1xcXCJcXG4gICAgc3R5bGU9XFxcIm1heC1oZWlnaHQ6IGNhbGMoMTAwdmggLSA1NjVweClcXFwiXFxuICA+XFxuICAgIHt7e2l0ZW1zfX19XFxuICA8L3VsPlxcblxcbiAgPCEtLSBJbmZvIC0tPlxcbiAgPGRpdiBpZD1cXFwiZWUtaW5mb1xcXCIgY2xhc3M9XFxcImFwcGVhcmFuY2UtaXRlbXMtaW5mb1xcXCI+XFxuICAgIDxkaXYgY2xhc3M9XFxcImFwcGVhcmFuY2UtaW5mby10aXBzXFxcIj48L2Rpdj5cXG5cXG4gICAgPGgzIGNsYXNzPVxcXCJhcHBlYXJhbmNlLWl0ZW0taW5mby1uYW1lXFxcIj48L2gzPlxcblxcbiAgICA8ZGl2IGNsYXNzPVxcXCJhcHBlYXJhbmNlLWl0ZW0taW5mby1ndWFyZFxcXCI+PC9kaXY+XFxuICAgIDxkaXYgY2xhc3M9XFxcImFwcGVhcmFuY2UtaXRlbS1pbmZvLXJhcml0eVxcXCI+PC9kaXY+XFxuICAgIDxkaXYgY2xhc3M9XFxcImFwcGVhcmFuY2UtaXRlbS1pbmZvLWJ1dHRvbnNcXFwiPlxcbiAgICAgIDxkaXYgY2xhc3M9XFxcImFwcGVhcmFuY2UtZm9yd2FyZCBubC1idXR0b25cXFwiPlxcbiAgICAgICAge3t0cmFuc2xhdGUuYXBwZWFyYW5jZS5idXR0b25zLmZvcndhcmR9fVxcbiAgICAgIDwvZGl2PlxcbiAgICAgIDxkaXYgY2xhc3M9XFxcImFwcGVhcmFuY2UtYmFja3dhcmQgbmwtYnV0dG9uXFxcIj5cXG4gICAgICAgIHt7dHJhbnNsYXRlLmFwcGVhcmFuY2UuYnV0dG9ucy5iYWNrd2FyZH19XFxuICAgICAgPC9kaXY+XFxuICAgIDwvZGl2PlxcbiAgPC9kaXY+XFxuPC9kaXY+XFxuXCIsIEgpO3JldHVybiBUOyB9KCk7IiwidmFyIEggPSByZXF1aXJlKFwiaG9nYW4uanNcIik7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkgeyB2YXIgVCA9IG5ldyBILlRlbXBsYXRlKHtjb2RlOiBmdW5jdGlvbiAoYyxwLGkpIHsgdmFyIHQ9dGhpczt0LmIoaT1pfHxcIlwiKTt0LmIoXCI8ZGl2XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICBpZD1cXFwiYXBwZWFyYW5jZS1pdGVtcy1ncm91cC1cIik7dC5iKHQudih0LmYoXCJncm91cFwiLGMscCwwKSkpO3QuYihcIlxcXCJcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIGNsYXNzPVxcXCJhcHBlYXJhbmNlLWl0ZW1zLWNhdGVnb3J5XFxcIlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgZGF0YS1jYXRlZ29yeWlkPVxcXCJcIik7dC5iKHQudih0LmYoXCJjYXRlZ29yeWlkXCIsYyxwLDApKSk7dC5iKFwiXFxcIlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgZGF0YS1jYXRlZ29yeT1cXFwiXCIpO3QuYih0LnYodC5mKFwiY2F0ZWdvcnlcIixjLHAsMCkpKTt0LmIoXCJcXFwiXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgPHVsIGNsYXNzPVxcXCJhcHBlYXJhbmNlLWl0ZW1zLWxpc3RcXFwiPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICBcIik7dC5iKHQudCh0LmYoXCJpdGVtc1wiLGMscCwwKSkpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICA8L3VsPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIjwvZGl2PlwiKTt0LmIoXCJcXG5cIik7cmV0dXJuIHQuZmwoKTsgfSxwYXJ0aWFsczoge30sIHN1YnM6IHsgIH19LCBcIjxkaXZcXG4gIGlkPVxcXCJhcHBlYXJhbmNlLWl0ZW1zLWdyb3VwLXt7Z3JvdXB9fVxcXCJcXG4gIGNsYXNzPVxcXCJhcHBlYXJhbmNlLWl0ZW1zLWNhdGVnb3J5XFxcIlxcbiAgZGF0YS1jYXRlZ29yeWlkPVxcXCJ7e2NhdGVnb3J5aWR9fVxcXCJcXG4gIGRhdGEtY2F0ZWdvcnk9XFxcInt7Y2F0ZWdvcnl9fVxcXCJcXG4+XFxuICA8dWwgY2xhc3M9XFxcImFwcGVhcmFuY2UtaXRlbXMtbGlzdFxcXCI+XFxuICAgIHt7e2l0ZW1zfX19XFxuICA8L3VsPlxcbjwvZGl2PlxcblwiLCBIKTtyZXR1cm4gVDsgfSgpOyIsInZhciBIID0gcmVxdWlyZShcImhvZ2FuLmpzXCIpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHsgdmFyIFQgPSBuZXcgSC5UZW1wbGF0ZSh7Y29kZTogZnVuY3Rpb24gKGMscCxpKSB7IHZhciB0PXRoaXM7dC5iKGk9aXx8XCJcIik7dC5iKFwiPGRpdlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgaWQ9XFxcIm1hcmtldHBsYWNlLWl0ZW1EZXRhaWwtaW5mby1hdXRvYnV5XFxcIlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgc3R5bGU9XFxcInRleHQtYWxpZ246IGNlbnRlcjsgbWFyZ2luOiAyMHB4IGF1dG9cXFwiXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgPGRpdiBjbGFzcz1cXFwibmwtYnV0dG9uXFxcIj5cIik7dC5iKHQudih0LmQoXCJ0cmFuc2xhdGUubWFya2V0LmFkZF90b193aXNobGlzdC50aXRsZVwiLGMscCwwKSkpO3QuYihcIjwvZGl2PlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIjwvZGl2PlwiKTt0LmIoXCJcXG5cIik7cmV0dXJuIHQuZmwoKTsgfSxwYXJ0aWFsczoge30sIHN1YnM6IHsgIH19LCBcIjxkaXZcXG4gIGlkPVxcXCJtYXJrZXRwbGFjZS1pdGVtRGV0YWlsLWluZm8tYXV0b2J1eVxcXCJcXG4gIHN0eWxlPVxcXCJ0ZXh0LWFsaWduOiBjZW50ZXI7IG1hcmdpbjogMjBweCBhdXRvXFxcIlxcbj5cXG4gIDxkaXYgY2xhc3M9XFxcIm5sLWJ1dHRvblxcXCI+e3t0cmFuc2xhdGUubWFya2V0LmFkZF90b193aXNobGlzdC50aXRsZX19PC9kaXY+XFxuPC9kaXY+XFxuXCIsIEgpO3JldHVybiBUOyB9KCk7IiwidmFyIEggPSByZXF1aXJlKFwiaG9nYW4uanNcIik7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkgeyB2YXIgVCA9IG5ldyBILlRlbXBsYXRlKHtjb2RlOiBmdW5jdGlvbiAoYyxwLGkpIHsgdmFyIHQ9dGhpczt0LmIoaT1pfHxcIlwiKTt0LmIoXCI8aDE+XCIpO3QuYih0LnYodC5kKFwidHJhbnNsYXRlLm1hcmtldC5hZGRfdG9fd2lzaGxpc3QudGl0bGVcIixjLHAsMCkpKTt0LmIoXCI8L2gxPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIjxwPlwiKTt0LmIodC52KHQuZChcInRyYW5zbGF0ZS5tYXJrZXQuYWRkX3RvX3dpc2hsaXN0LnRleHRcIixjLHAsMCkpKTt0LmIoXCI8L3A+XCIpO3QuYihcIlxcblwiKTtyZXR1cm4gdC5mbCgpOyB9LHBhcnRpYWxzOiB7fSwgc3ViczogeyAgfX0sIFwiPGgxPnt7dHJhbnNsYXRlLm1hcmtldC5hZGRfdG9fd2lzaGxpc3QudGl0bGV9fTwvaDE+XFxuPHA+e3t0cmFuc2xhdGUubWFya2V0LmFkZF90b193aXNobGlzdC50ZXh0fX08L3A+XFxuXCIsIEgpO3JldHVybiBUOyB9KCk7IiwidmFyIEggPSByZXF1aXJlKFwiaG9nYW4uanNcIik7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkgeyB2YXIgVCA9IG5ldyBILlRlbXBsYXRlKHtjb2RlOiBmdW5jdGlvbiAoYyxwLGkpIHsgdmFyIHQ9dGhpczt0LmIoaT1pfHxcIlwiKTt0LmIoXCI8aDE+XCIpO3QuYih0LnYodC5kKFwidHJhbnNsYXRlLm1hbGwuYWRkX3RvX3dpc2hsaXN0LnRpdGxlXCIsYyxwLDApKSk7dC5iKFwiPC9oMT5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCI8cD5cIik7dC5iKHQudih0LmQoXCJ0cmFuc2xhdGUubWFsbC5hZGRfdG9fd2lzaGxpc3QudGV4dFwiLGMscCwwKSkpO3QuYihcIjwvcD5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCI8cCBzdHlsZT1cXFwiZm9udC1zaXplOiAxNHB4XFxcIj48ZW0+XCIpO3QuYih0LnYodC5kKFwidHJhbnNsYXRlLm1hbGwuYWRkX3RvX3dpc2hsaXN0Lm5vdGVcIixjLHAsMCkpKTt0LmIoXCI8L2VtPjwvcD5cIik7dC5iKFwiXFxuXCIpO3JldHVybiB0LmZsKCk7IH0scGFydGlhbHM6IHt9LCBzdWJzOiB7ICB9fSwgXCI8aDE+e3t0cmFuc2xhdGUubWFsbC5hZGRfdG9fd2lzaGxpc3QudGl0bGV9fTwvaDE+XFxuPHA+e3t0cmFuc2xhdGUubWFsbC5hZGRfdG9fd2lzaGxpc3QudGV4dH19PC9wPlxcbjxwIHN0eWxlPVxcXCJmb250LXNpemU6IDE0cHhcXFwiPjxlbT57e3RyYW5zbGF0ZS5tYWxsLmFkZF90b193aXNobGlzdC5ub3RlfX08L2VtPjwvcD5cXG5cIiwgSCk7cmV0dXJuIFQ7IH0oKTsiLCJ2YXIgSCA9IHJlcXVpcmUoXCJob2dhbi5qc1wiKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7IHZhciBUID0gbmV3IEguVGVtcGxhdGUoe2NvZGU6IGZ1bmN0aW9uIChjLHAsaSkgeyB2YXIgdD10aGlzO3QuYihpPWl8fFwiXCIpO3QuYihcIjxidXR0b25cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIGlkPVxcXCJhdXRvLWV4cGxvcmUtYnV0dG9uXFxcIlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgY2xhc3M9XFxcIm5sLWJ1dHRvbiBcIik7aWYodC5zKHQuZihcImFjdGl2ZVwiLGMscCwxKSxjLHAsMCw2NSw3MSxcInt7IH19XCIpKXt0LnJzKGMscCxmdW5jdGlvbihjLHAsdCl7dC5iKFwiYWN0aXZlXCIpO30pO2MucG9wKCk7fXQuYihcIlxcXCJcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIGRhdGEtaWQ9XFxcIlwiKTt0LmIodC52KHQuZihcImxvY2F0aW9uSWRcIixjLHAsMCkpKTt0LmIoXCJcXFwiXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICBkYXRhLW1hcGlkPVxcXCJcIik7dC5iKHQudih0LmYoXCJyZWdpb25JZFwiLGMscCwwKSkpO3QuYihcIlxcXCJcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCI+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICBcIik7dC5iKHQudih0LmQoXCJ0cmFuc2xhdGUucGV0LmF1dG9fZXhwbG9yZVwiLGMscCwwKSkpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiPC9idXR0b24+XCIpO3QuYihcIlxcblwiKTtyZXR1cm4gdC5mbCgpOyB9LHBhcnRpYWxzOiB7fSwgc3ViczogeyAgfX0sIFwiPGJ1dHRvblxcbiAgaWQ9XFxcImF1dG8tZXhwbG9yZS1idXR0b25cXFwiXFxuICBjbGFzcz1cXFwibmwtYnV0dG9uIHt7I2FjdGl2ZX19YWN0aXZle3svYWN0aXZlfX1cXFwiXFxuICBkYXRhLWlkPVxcXCJ7e2xvY2F0aW9uSWR9fVxcXCJcXG4gIGRhdGEtbWFwaWQ9XFxcInt7cmVnaW9uSWR9fVxcXCJcXG4+XFxuICB7e3RyYW5zbGF0ZS5wZXQuYXV0b19leHBsb3JlfX1cXG48L2J1dHRvbj5cXG5cIiwgSCk7cmV0dXJuIFQ7IH0oKTsiLCJ2YXIgSCA9IHJlcXVpcmUoXCJob2dhbi5qc1wiKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7IHZhciBUID0gbmV3IEguVGVtcGxhdGUoe2NvZGU6IGZ1bmN0aW9uIChjLHAsaSkgeyB2YXIgdD10aGlzO3QuYihpPWl8fFwiXCIpO3QuYihcIjxhXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICBpZD1cXFwiXCIpO3QuYih0LnYodC5mKFwiaWRcIixjLHAsMCkpKTt0LmIoXCJcXFwiXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICBjbGFzcz1cXFwiY2Fyb3VzZWwtbmV3cyBjYXJvdXNlbC1lZVxcXCJcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIGhyZWY9XFxcIlxcXCJcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIHN0eWxlPVxcXCJiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCIpO3QuYih0LnYodC5mKFwiYmFja2dyb3VuZEltYWdlXCIsYyxwLDApKSk7dC5iKFwiKVxcXCJcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCI+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICA8ZGl2PlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICA8aDQ+XCIpO3QuYih0LnYodC5mKFwiaDRcIixjLHAsMCkpKTt0LmIoXCI8L2g0PlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICA8aDU+XCIpO3QuYih0LnYodC5mKFwiaDVcIixjLHAsMCkpKTt0LmIoXCI8L2g1PlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICA8cD5cIik7dC5iKHQudih0LmYoXCJwXCIsYyxwLDApKSk7dC5iKFwiPC9wPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgPC9kaXY+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiPC9hPlwiKTt0LmIoXCJcXG5cIik7cmV0dXJuIHQuZmwoKTsgfSxwYXJ0aWFsczoge30sIHN1YnM6IHsgIH19LCBcIjxhXFxuICBpZD1cXFwie3tpZH19XFxcIlxcbiAgY2xhc3M9XFxcImNhcm91c2VsLW5ld3MgY2Fyb3VzZWwtZWVcXFwiXFxuICBocmVmPVxcXCJcXFwiXFxuICBzdHlsZT1cXFwiYmFja2dyb3VuZC1pbWFnZTogdXJsKHt7YmFja2dyb3VuZEltYWdlfX0pXFxcIlxcbj5cXG4gIDxkaXY+XFxuICAgIDxoND57e2g0fX08L2g0PlxcbiAgICA8aDU+e3toNX19PC9oNT5cXG4gICAgPHA+e3twfX08L3A+XFxuICA8L2Rpdj5cXG48L2E+XFxuXCIsIEgpO3JldHVybiBUOyB9KCk7IiwidmFyIEggPSByZXF1aXJlKFwiaG9nYW4uanNcIik7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkgeyB2YXIgVCA9IG5ldyBILlRlbXBsYXRlKHtjb2RlOiBmdW5jdGlvbiAoYyxwLGkpIHsgdmFyIHQ9dGhpczt0LmIoaT1pfHxcIlwiKTt0LmIoXCI8aDE+XCIpO3QuYih0LnYodC5kKFwidHJhbnNsYXRlLm1hcmtldC5jaGFuZ2VfcHJpY2UudGl0bGVcIixjLHAsMCkpKTt0LmIoXCI8L2gxPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIjxwPlwiKTt0LmIodC52KHQuZChcInRyYW5zbGF0ZS5tYXJrZXQuY2hhbmdlX3ByaWNlLnRleHRcIixjLHAsMCkpKTt0LmIoXCI8L3A+XCIpO3QuYihcIlxcblwiKTtyZXR1cm4gdC5mbCgpOyB9LHBhcnRpYWxzOiB7fSwgc3ViczogeyAgfX0sIFwiPGgxPnt7dHJhbnNsYXRlLm1hcmtldC5jaGFuZ2VfcHJpY2UudGl0bGV9fTwvaDE+XFxuPHA+e3t0cmFuc2xhdGUubWFya2V0LmNoYW5nZV9wcmljZS50ZXh0fX08L3A+XFxuXCIsIEgpO3JldHVybiBUOyB9KCk7IiwidmFyIEggPSByZXF1aXJlKFwiaG9nYW4uanNcIik7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkgeyB2YXIgVCA9IG5ldyBILlRlbXBsYXRlKHtjb2RlOiBmdW5jdGlvbiAoYyxwLGkpIHsgdmFyIHQ9dGhpczt0LmIoaT1pfHxcIlwiKTt0LmIoXCI8aDE+XCIpO3QuYih0LnYodC5kKFwidHJhbnNsYXRlLmFjY291bnQuY29uZmlybV9yZXNldF90aXRsZVwiLGMscCwwKSkpO3QuYihcIjwvaDE+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiPHA+XCIpO3QuYih0LnQodC5kKFwidHJhbnNsYXRlLmFjY291bnQuY29uZmlybV9yZXNldF9jb250ZW50XCIsYyxwLDApKSk7dC5iKFwiPC9wPlwiKTt0LmIoXCJcXG5cIik7cmV0dXJuIHQuZmwoKTsgfSxwYXJ0aWFsczoge30sIHN1YnM6IHsgIH19LCBcIjxoMT57e3RyYW5zbGF0ZS5hY2NvdW50LmNvbmZpcm1fcmVzZXRfdGl0bGV9fTwvaDE+XFxuPHA+e3t7dHJhbnNsYXRlLmFjY291bnQuY29uZmlybV9yZXNldF9jb250ZW50fX19PC9wPlxcblwiLCBIKTtyZXR1cm4gVDsgfSgpOyIsInZhciBIID0gcmVxdWlyZShcImhvZ2FuLmpzXCIpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHsgdmFyIFQgPSBuZXcgSC5UZW1wbGF0ZSh7Y29kZTogZnVuY3Rpb24gKGMscCxpKSB7IHZhciB0PXRoaXM7dC5iKGk9aXx8XCJcIik7dC5iKFwiPGgxPlwiKTt0LmIodC52KHQuZChcInRyYW5zbGF0ZS5hcHBlYXJhbmNlLmZhdm91cml0ZXMuc2F2ZV9vdXRmaXQudGl0bGVcIixjLHAsMCkpKTt0LmIoXCI8L2gxPlwiKTt0LmIoXCJcXG5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCI8cD5cIik7dC5iKHQudCh0LmQoXCJ0cmFuc2xhdGUuYXBwZWFyYW5jZS5mYXZvdXJpdGVzLnNhdmVfb3V0Zml0LnNhdmVkX2xvY2FsbHlcIixjLHAsMCkpKTt0LmIoXCI8L3A+XCIpO3QuYihcIlxcblwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIjxiciAvPlwiKTt0LmIoXCJcXG5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCI8cD5cIik7dC5iKHQudCh0LmQoXCJ0cmFuc2xhdGUuYXBwZWFyYW5jZS5mYXZvdXJpdGVzLnNhdmVfb3V0Zml0LmdvdG9fYWNjb3VudFwiLGMscCwwKSkpO3QuYihcIjwvcD5cIik7dC5iKFwiXFxuXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiPGlucHV0XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICBpZD1cXFwiY2hvb3NlLW5hbWVcXFwiXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICBtYXhsZW5ndGg9XFxcIjMwXFxcIlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgbWlubGVuZ3RoPVxcXCIxXFxcIlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgcGxhY2Vob2xkZXI9XFxcIlwiKTt0LmIodC52KHQuZChcInRyYW5zbGF0ZS5hcHBlYXJhbmNlLmZhdm91cml0ZXMuc2F2ZV9vdXRmaXQucGxhY2Vob2xkZXJcIixjLHAsMCkpKTt0LmIoXCJcXFwiXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiLz5cIik7dC5iKFwiXFxuXCIpO3JldHVybiB0LmZsKCk7IH0scGFydGlhbHM6IHt9LCBzdWJzOiB7ICB9fSwgXCI8aDE+e3t0cmFuc2xhdGUuYXBwZWFyYW5jZS5mYXZvdXJpdGVzLnNhdmVfb3V0Zml0LnRpdGxlfX08L2gxPlxcblxcbjxwPnt7e3RyYW5zbGF0ZS5hcHBlYXJhbmNlLmZhdm91cml0ZXMuc2F2ZV9vdXRmaXQuc2F2ZWRfbG9jYWxseX19fTwvcD5cXG5cXG48YnIgLz5cXG5cXG48cD57e3t0cmFuc2xhdGUuYXBwZWFyYW5jZS5mYXZvdXJpdGVzLnNhdmVfb3V0Zml0LmdvdG9fYWNjb3VudH19fTwvcD5cXG5cXG48aW5wdXRcXG4gIGlkPVxcXCJjaG9vc2UtbmFtZVxcXCJcXG4gIG1heGxlbmd0aD1cXFwiMzBcXFwiXFxuICBtaW5sZW5ndGg9XFxcIjFcXFwiXFxuICBwbGFjZWhvbGRlcj1cXFwie3t0cmFuc2xhdGUuYXBwZWFyYW5jZS5mYXZvdXJpdGVzLnNhdmVfb3V0Zml0LnBsYWNlaG9sZGVyfX1cXFwiXFxuLz5cXG5cIiwgSCk7cmV0dXJuIFQ7IH0oKTsiLCJ2YXIgSCA9IHJlcXVpcmUoXCJob2dhbi5qc1wiKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7IHZhciBUID0gbmV3IEguVGVtcGxhdGUoe2NvZGU6IGZ1bmN0aW9uIChjLHAsaSkgeyB2YXIgdD10aGlzO3QuYihpPWl8fFwiXCIpO3QuYihcIjxkaXYgaWQ9XFxcImhpc3RvcnktY29udGFpbmVyXFxcIiBzdHlsZT1cXFwid2lkdGg6IDEwMCVcXFwiPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgPHN0eWxlPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAuaGlzdG9yeS1hY3Rpb25zIHtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICBtYXJnaW4tYm90dG9tOiAxZW07XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgIH1cIik7dC5iKFwiXFxuXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICNkZWxldGUtaGlzdG9yeSB7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgbWFyZ2luLXJpZ2h0OiAxZW07XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgIH1cIik7dC5iKFwiXFxuXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgIC5oZWxwLWljb24ge1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIGJhY2tncm91bmQtY29sb3I6ICMwMjkxZjY7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgYm9yZGVyLXJhZGl1czogNTAlO1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIGJveC1zaGFkb3c6IG5vbmU7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgY29sb3I6ICNmZmY7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgZm9udC1zaXplOiAyNnB4O1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIGZvbnQtd2VpZ2h0OiBib2xkO1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIGhlaWdodDogMjNweDtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICBsaW5lLWhlaWdodDogMjBweDtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICBwYWRkaW5nOiAwO1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICB3aWR0aDogMjNweDtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgfVwiKTt0LmIoXCJcXG5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgLmhpc3RvcnktbWVzc2FnZSB7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjcpO1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIGJvcmRlci1yYWRpdXM6IDFlbTtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICBtYXJnaW46IDFlbTtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICBwYWRkaW5nOiAxZW07XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgIH1cIik7dC5iKFwiXFxuXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgIC5oaXN0b3J5LXJvdyB7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgZGlzcGxheTogZmxleDtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICBmbGV4LXdyYXA6IHdyYXA7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgaGVpZ2h0OiA0NjVweDtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICBtYXJnaW4tcmlnaHQ6IDFlbTtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICBvdmVyZmxvdy15OiBhdXRvO1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIHNjcm9sbGJhci1jb2xvcjogZGFyaztcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICBzY3JvbGxiYXItd2lkdGg6IHRoaW47XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgIH1cIik7dC5iKFwiXFxuXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgIC5yZXN1bHQtY2FyZCB7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgYm9yZGVyLXJhZGl1czogMWVtO1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIGJveC1zaGFkb3c6IDAgMCA1cHggMnB4IHJnYmEoMCwgMCwgMCwgMC4zKTtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICBoZWlnaHQ6IDIwNXB4O1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIG1hcmdpbjogMC41ZW07XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgcGFkZGluZzogMC41ZW07XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIHdpZHRoOiAxMjhweDtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgfVwiKTt0LmIoXCJcXG5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgLnJlc3VsdC1pbWFnZSB7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgYm9yZGVyLXJhZGl1czogMWVtO1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIGJveC1zaGFkb3c6IDAgMCA0cHggMCByZ2JhKDAsIDAsIDAsIDAuMTIpLFwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgICAgMCAycHggNHB4IDJweCByZ2JhKDAsIDAsIDAsIDAuMDgpO1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIGhlaWdodDogMTAwcHg7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIHRvcDogLTAuOGVtO1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIHdpZHRoOiAxMDBweDtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgfVwiKTt0LmIoXCJcXG5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgLnJlc3VsdC1jb250ZW50LWNvbHVtbiB7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgZGlzcGxheTogZmxleDtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIGhlaWdodDogMTAzcHg7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICB9XCIpO3QuYihcIlxcblwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAucmVzdWx0LW5hbWUge1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIC13ZWJraXQtYm94LW9yaWVudDogdmVydGljYWw7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgLXdlYmtpdC1saW5lLWNsYW1wOiAzO1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIGNvbG9yOiByZ2IoNTIsIDU2LCAxMTEpO1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIGRpc3BsYXk6IC13ZWJraXQtYm94O1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIGZsZXgtZ3JvdzogMTtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICBmb250LXNpemU6IDE2cHg7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgZm9udC13ZWlnaHQ6IGJvbGQ7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgbWFyZ2luLXRvcDogLTAuMmVtO1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIG92ZXJmbG93OiBoaWRkZW47XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgIH1cIik7dC5iKFwiXFxuXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgIC5yZXN1bHQtbG9jYXRpb24ge1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICB9XCIpO3QuYihcIlxcblwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAucmVzdWx0LWRhdGUge1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIGNvbG9yOiAjZmI4OTAwO1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIGZvbnQtc2l6ZTogMTNweDtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICBmb250LXdlaWdodDogYm9sZDtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgfVwiKTt0LmIoXCJcXG5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgLnJlc3VsdC1pY29ucyB7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgbWFyZ2luLXRvcDogMC41ZW07XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgIH1cIik7dC5iKFwiXFxuXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgIC5yZXN1bHQtY291bnQge1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIGJhY2tncm91bmQ6ICNmZmZmZmY7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgYm9yZGVyLXJhZGl1czogMTAwJTtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICBib3JkZXI6IDFweCBzb2xpZCAjMDBjZGZiO1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgY29sb3I6ICMzZWMwZDc7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIGZvbnQtZmFtaWx5OiBcXFwiQWxlZ3JleWEgU2FucyBTQ1xcXCIsIHNhbnMtc2VyaWY7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgZm9udC1zaXplOiAxOHB4O1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIGZvbnQtd2VpZ2h0OiA4MDA7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgaGVpZ2h0OiAyOXB4O1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIGxpbmUtaGVpZ2h0OiAyN3B4O1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICB1c2VyLXNlbGVjdDogbm9uZTtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICB3aWR0aDogMjlweDtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgfVwiKTt0LmIoXCJcXG5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgLmhpc3RvcnktdHJhZGFibGUge1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIGJhY2tncm91bmQtY29sb3I6ICM2NjY7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgYm9yZGVyLXJhZGl1czogMjVweDtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICBib3JkZXI6IDFweCBzb2xpZCAjYjliOWI5O1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIGNvbG9yOiAjZmZmZmZmO1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICBmb250LWZhbWlseTogXFxcIlRlbXAgTWVudVxcXCIsIHNlcmlmO1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIGZvbnQtc2l6ZTogMTNweDtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICBoZWlnaHQ6IDE1cHg7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgbGluZS1oZWlnaHQ6IDE1cHg7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIHdpZHRoOiAxNXB4O1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICB9XCIpO3QuYihcIlxcblwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAuaWNvbi1zcGFjZXIge1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICB3aWR0aDogMC4xZW07XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgIH1cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIDwvc3R5bGU+XCIpO3QuYihcIlxcblwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgPGRpdiBjbGFzcz1cXFwiaGlzdG9yeS1hY3Rpb25zXFxcIj5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgPGJ1dHRvbiBpZD1cXFwiZGVsZXRlLWhpc3RvcnlcXFwiIGNsYXNzPVxcXCJubC1idXR0b25cXFwiPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIFwiKTt0LmIodC52KHQuZChcInRyYW5zbGF0ZS5wZXQuZGVsZXRlX2hpc3RvcnlcIixjLHAsMCkpKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICA8L2J1dHRvbj5cIik7dC5iKFwiXFxuXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgIDxzcGFuIGNsYXNzPVxcXCJ0b29sdGlwXFxcIj5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICA8c3BhbiBjbGFzcz1cXFwibmwtYnV0dG9uIGhlbHAtaWNvblxcXCI+Pzwvc3Bhbj5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICA8ZGl2IGNsYXNzPVxcXCJ0b29sdGlwLWNvbnRlbnRcXFwiPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgICAgPHA+XCIpO3QuYih0LnQodC5kKFwidHJhbnNsYXRlLnBldC5zYXZlZF9sb2NhbGx5XCIsYyxwLDApKSk7dC5iKFwiPC9wPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgICAgPHA+XCIpO3QuYih0LnQodC5kKFwidHJhbnNsYXRlLnBldC5nb3RvX2FjY291bnRcIixjLHAsMCkpKTt0LmIoXCI8L3A+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgPC9kaXY+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgIDwvc3Bhbj5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIDwvZGl2PlwiKTt0LmIoXCJcXG5cIik7dC5iKFwiXFxuXCIgKyBpKTtpZighdC5zKHQuZihcImhpc3RvcnlcIixjLHAsMSksYyxwLDEsMCwwLFwiXCIpKXt0LmIoXCIgIDxwIGNsYXNzPVxcXCJoaXN0b3J5LW1lc3NhZ2VcXFwiPlwiKTt0LmIodC52KHQuZChcInRyYW5zbGF0ZS5wZXQuZW1wdHlfaGlzdG9yeVwiLGMscCwwKSkpO3QuYihcIjwvcD5cIik7dC5iKFwiXFxuXCIgKyBpKTt9O3QuYihcIlxcblwiICsgaSk7dC5iKFwiICA8ZGl2IGNsYXNzPVxcXCJoaXN0b3J5LXJvd1xcXCI+XCIpO3QuYihcIlxcblwiICsgaSk7aWYodC5zKHQuZihcImhpc3RvcnlcIixjLHAsMSksYyxwLDAsMzIzMCwzOTIwLFwie3sgfX1cIikpe3QucnMoYyxwLGZ1bmN0aW9uKGMscCx0KXt0LmIoXCIgICAgPGRpdiBjbGFzcz1cXFwicmVzdWx0LWNhcmRcXFwiPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIDxhIGhyZWY9XFxcIlwiKTt0LmIodC52KHQuZihcIndlYl9oZFwiLGMscCwwKSkpO3QuYihcIlxcXCIgdGFyZ2V0PVxcXCJfYmxhbmtcXFwiPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgICAgPGltZyBjbGFzcz1cXFwicmVzdWx0LWltYWdlXFxcIiBzcmM9XFxcIlwiKTt0LmIodC52KHQuZihcImljb25cIixjLHAsMCkpKTt0LmIoXCJcXFwiIC8+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgPC9hPlwiKTt0LmIoXCJcXG5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICA8ZGl2IGNsYXNzPVxcXCJyZXN1bHQtY29udGVudC1jb2x1bW5cXFwiPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgICAgPGRpdiBjbGFzcz1cXFwicmVzdWx0LW5hbWVcXFwiPlwiKTt0LmIodC52KHQuZihcIm5hbWVcIixjLHAsMCkpKTt0LmIoXCI8L2Rpdj5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICAgIDxkaXYgY2xhc3M9XFxcInJlc3VsdC1sb2NhdGlvblxcXCI+XCIpO3QuYih0LnYodC5mKFwibG9jYXRpb25OYW1lXCIsYyxwLDApKSk7dC5iKFwiPC9kaXY+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgICA8ZGl2IGNsYXNzPVxcXCJyZXN1bHQtZGF0ZVxcXCI+XCIpO3QuYih0LnYodC5mKFwiZGF0ZVwiLGMscCwwKSkpO3QuYihcIjwvZGl2PlwiKTt0LmIoXCJcXG5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICAgIDxkaXYgY2xhc3M9XFxcInJlc3VsdC1pY29uc1xcXCI+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgICAgIFwiKTtpZih0LnModC5mKFwiY291bnRcIixjLHAsMSksYyxwLDAsMzYyMywzNjY2LFwie3sgfX1cIikpe3QucnMoYyxwLGZ1bmN0aW9uKGMscCx0KXt0LmIoXCI8c3BhbiBjbGFzcz1cXFwicmVzdWx0LWNvdW50XFxcIj5cIik7dC5iKHQudih0LmYoXCJjb3VudFwiLGMscCwwKSkpO3QuYihcIjwvc3Bhbj5cIik7fSk7Yy5wb3AoKTt9dC5iKFwiXFxuXCIgKyBpKTtpZih0LnModC5mKFwiY291bnRcIixjLHAsMSksYyxwLDAsMzY5NywzNzc2LFwie3sgfX1cIikpe3QucnMoYyxwLGZ1bmN0aW9uKGMscCx0KXtpZih0LnModC5mKFwidHJhZGFibGVcIixjLHAsMSksYyxwLDAsMzcxMCwzNzYzLFwie3sgfX1cIikpe3QucnMoYyxwLGZ1bmN0aW9uKGMscCx0KXt0LmIoXCIgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaWNvbi1zcGFjZXJcXFwiPjwvZGl2PlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgICAgICBcIik7fSk7Yy5wb3AoKTt9fSk7Yy5wb3AoKTt9dC5iKFwiIFwiKTtpZih0LnModC5mKFwidHJhZGFibGVcIixjLHAsMSksYyxwLDAsMzgwMCwzODYzLFwie3sgfX1cIikpe3QucnMoYyxwLGZ1bmN0aW9uKGMscCx0KXt0LmIoXCI8c3BhbiBjbGFzcz1cXFwiaGlzdG9yeS10cmFkYWJsZVxcXCJcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICAgICAgICA+7qCCPC9zcGFuXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgICAgID5cIik7fSk7Yy5wb3AoKTt9dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICAgIDwvZGl2PlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIDwvZGl2PlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICA8L2Rpdj5cIik7dC5iKFwiXFxuXCIgKyBpKTt9KTtjLnBvcCgpO310LmIoXCIgIDwvZGl2PlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIjwvZGl2PlwiKTt0LmIoXCJcXG5cIik7cmV0dXJuIHQuZmwoKTsgfSxwYXJ0aWFsczoge30sIHN1YnM6IHsgIH19LCBcIjxkaXYgaWQ9XFxcImhpc3RvcnktY29udGFpbmVyXFxcIiBzdHlsZT1cXFwid2lkdGg6IDEwMCVcXFwiPlxcbiAgPHN0eWxlPlxcbiAgICAuaGlzdG9yeS1hY3Rpb25zIHtcXG4gICAgICBtYXJnaW4tYm90dG9tOiAxZW07XFxuICAgIH1cXG5cXG4gICAgI2RlbGV0ZS1oaXN0b3J5IHtcXG4gICAgICBtYXJnaW4tcmlnaHQ6IDFlbTtcXG4gICAgfVxcblxcbiAgICAuaGVscC1pY29uIHtcXG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDI5MWY2O1xcbiAgICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcXG4gICAgICBib3gtc2hhZG93OiBub25lO1xcbiAgICAgIGNvbG9yOiAjZmZmO1xcbiAgICAgIGZvbnQtc2l6ZTogMjZweDtcXG4gICAgICBmb250LXdlaWdodDogYm9sZDtcXG4gICAgICBoZWlnaHQ6IDIzcHg7XFxuICAgICAgbGluZS1oZWlnaHQ6IDIwcHg7XFxuICAgICAgcGFkZGluZzogMDtcXG4gICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICAgICAgd2lkdGg6IDIzcHg7XFxuICAgIH1cXG5cXG4gICAgLmhpc3RvcnktbWVzc2FnZSB7XFxuICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjcpO1xcbiAgICAgIGJvcmRlci1yYWRpdXM6IDFlbTtcXG4gICAgICBtYXJnaW46IDFlbTtcXG4gICAgICBwYWRkaW5nOiAxZW07XFxuICAgIH1cXG5cXG4gICAgLmhpc3Rvcnktcm93IHtcXG4gICAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICAgIGZsZXgtd3JhcDogd3JhcDtcXG4gICAgICBoZWlnaHQ6IDQ2NXB4O1xcbiAgICAgIG1hcmdpbi1yaWdodDogMWVtO1xcbiAgICAgIG92ZXJmbG93LXk6IGF1dG87XFxuICAgICAgc2Nyb2xsYmFyLWNvbG9yOiBkYXJrO1xcbiAgICAgIHNjcm9sbGJhci13aWR0aDogdGhpbjtcXG4gICAgfVxcblxcbiAgICAucmVzdWx0LWNhcmQge1xcbiAgICAgIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xcbiAgICAgIGJvcmRlci1yYWRpdXM6IDFlbTtcXG4gICAgICBib3gtc2hhZG93OiAwIDAgNXB4IDJweCByZ2JhKDAsIDAsIDAsIDAuMyk7XFxuICAgICAgaGVpZ2h0OiAyMDVweDtcXG4gICAgICBtYXJnaW46IDAuNWVtO1xcbiAgICAgIHBhZGRpbmc6IDAuNWVtO1xcbiAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gICAgICB3aWR0aDogMTI4cHg7XFxuICAgIH1cXG5cXG4gICAgLnJlc3VsdC1pbWFnZSB7XFxuICAgICAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XFxuICAgICAgYm9yZGVyLXJhZGl1czogMWVtO1xcbiAgICAgIGJveC1zaGFkb3c6IDAgMCA0cHggMCByZ2JhKDAsIDAsIDAsIDAuMTIpLFxcbiAgICAgICAgMCAycHggNHB4IDJweCByZ2JhKDAsIDAsIDAsIDAuMDgpO1xcbiAgICAgIGhlaWdodDogMTAwcHg7XFxuICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgICAgIHRvcDogLTAuOGVtO1xcbiAgICAgIHdpZHRoOiAxMDBweDtcXG4gICAgfVxcblxcbiAgICAucmVzdWx0LWNvbnRlbnQtY29sdW1uIHtcXG4gICAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgICAgaGVpZ2h0OiAxMDNweDtcXG4gICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XFxuICAgIH1cXG5cXG4gICAgLnJlc3VsdC1uYW1lIHtcXG4gICAgICAtd2Via2l0LWJveC1vcmllbnQ6IHZlcnRpY2FsO1xcbiAgICAgIC13ZWJraXQtbGluZS1jbGFtcDogMztcXG4gICAgICBjb2xvcjogcmdiKDUyLCA1NiwgMTExKTtcXG4gICAgICBkaXNwbGF5OiAtd2Via2l0LWJveDtcXG4gICAgICBmbGV4LWdyb3c6IDE7XFxuICAgICAgZm9udC1zaXplOiAxNnB4O1xcbiAgICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xcbiAgICAgIG1hcmdpbi10b3A6IC0wLjJlbTtcXG4gICAgICBvdmVyZmxvdzogaGlkZGVuO1xcbiAgICB9XFxuXFxuICAgIC5yZXN1bHQtbG9jYXRpb24ge1xcbiAgICB9XFxuXFxuICAgIC5yZXN1bHQtZGF0ZSB7XFxuICAgICAgY29sb3I6ICNmYjg5MDA7XFxuICAgICAgZm9udC1zaXplOiAxM3B4O1xcbiAgICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xcbiAgICB9XFxuXFxuICAgIC5yZXN1bHQtaWNvbnMge1xcbiAgICAgIG1hcmdpbi10b3A6IDAuNWVtO1xcbiAgICB9XFxuXFxuICAgIC5yZXN1bHQtY291bnQge1xcbiAgICAgIGJhY2tncm91bmQ6ICNmZmZmZmY7XFxuICAgICAgYm9yZGVyLXJhZGl1czogMTAwJTtcXG4gICAgICBib3JkZXI6IDFweCBzb2xpZCAjMDBjZGZiO1xcbiAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICAgICAgY29sb3I6ICMzZWMwZDc7XFxuICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcbiAgICAgIGZvbnQtZmFtaWx5OiBcXFwiQWxlZ3JleWEgU2FucyBTQ1xcXCIsIHNhbnMtc2VyaWY7XFxuICAgICAgZm9udC1zaXplOiAxOHB4O1xcbiAgICAgIGZvbnQtd2VpZ2h0OiA4MDA7XFxuICAgICAgaGVpZ2h0OiAyOXB4O1xcbiAgICAgIGxpbmUtaGVpZ2h0OiAyN3B4O1xcbiAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gICAgICB1c2VyLXNlbGVjdDogbm9uZTtcXG4gICAgICB3aWR0aDogMjlweDtcXG4gICAgfVxcblxcbiAgICAuaGlzdG9yeS10cmFkYWJsZSB7XFxuICAgICAgYmFja2dyb3VuZC1jb2xvcjogIzY2NjtcXG4gICAgICBib3JkZXItcmFkaXVzOiAyNXB4O1xcbiAgICAgIGJvcmRlcjogMXB4IHNvbGlkICNiOWI5Yjk7XFxuICAgICAgY29sb3I6ICNmZmZmZmY7XFxuICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcbiAgICAgIGZvbnQtZmFtaWx5OiBcXFwiVGVtcCBNZW51XFxcIiwgc2VyaWY7XFxuICAgICAgZm9udC1zaXplOiAxM3B4O1xcbiAgICAgIGhlaWdodDogMTVweDtcXG4gICAgICBsaW5lLWhlaWdodDogMTVweDtcXG4gICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICAgICAgd2lkdGg6IDE1cHg7XFxuICAgIH1cXG5cXG4gICAgLmljb24tc3BhY2VyIHtcXG4gICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxuICAgICAgd2lkdGg6IDAuMWVtO1xcbiAgICB9XFxuICA8L3N0eWxlPlxcblxcbiAgPGRpdiBjbGFzcz1cXFwiaGlzdG9yeS1hY3Rpb25zXFxcIj5cXG4gICAgPGJ1dHRvbiBpZD1cXFwiZGVsZXRlLWhpc3RvcnlcXFwiIGNsYXNzPVxcXCJubC1idXR0b25cXFwiPlxcbiAgICAgIHt7dHJhbnNsYXRlLnBldC5kZWxldGVfaGlzdG9yeX19XFxuICAgIDwvYnV0dG9uPlxcblxcbiAgICA8c3BhbiBjbGFzcz1cXFwidG9vbHRpcFxcXCI+XFxuICAgICAgPHNwYW4gY2xhc3M9XFxcIm5sLWJ1dHRvbiBoZWxwLWljb25cXFwiPj88L3NwYW4+XFxuICAgICAgPGRpdiBjbGFzcz1cXFwidG9vbHRpcC1jb250ZW50XFxcIj5cXG4gICAgICAgIDxwPnt7e3RyYW5zbGF0ZS5wZXQuc2F2ZWRfbG9jYWxseX19fTwvcD5cXG4gICAgICAgIDxwPnt7e3RyYW5zbGF0ZS5wZXQuZ290b19hY2NvdW50fX19PC9wPlxcbiAgICAgIDwvZGl2PlxcbiAgICA8L3NwYW4+XFxuICA8L2Rpdj5cXG5cXG4gIHt7Xmhpc3Rvcnl9fVxcbiAgPHAgY2xhc3M9XFxcImhpc3RvcnktbWVzc2FnZVxcXCI+e3t0cmFuc2xhdGUucGV0LmVtcHR5X2hpc3Rvcnl9fTwvcD5cXG4gIHt7L2hpc3Rvcnl9fVxcblxcbiAgPGRpdiBjbGFzcz1cXFwiaGlzdG9yeS1yb3dcXFwiPlxcbiAgICB7eyNoaXN0b3J5fX1cXG4gICAgPGRpdiBjbGFzcz1cXFwicmVzdWx0LWNhcmRcXFwiPlxcbiAgICAgIDxhIGhyZWY9XFxcInt7d2ViX2hkfX1cXFwiIHRhcmdldD1cXFwiX2JsYW5rXFxcIj5cXG4gICAgICAgIDxpbWcgY2xhc3M9XFxcInJlc3VsdC1pbWFnZVxcXCIgc3JjPVxcXCJ7e2ljb259fVxcXCIgLz5cXG4gICAgICA8L2E+XFxuXFxuICAgICAgPGRpdiBjbGFzcz1cXFwicmVzdWx0LWNvbnRlbnQtY29sdW1uXFxcIj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcInJlc3VsdC1uYW1lXFxcIj57e25hbWV9fTwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwicmVzdWx0LWxvY2F0aW9uXFxcIj57e2xvY2F0aW9uTmFtZX19PC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJyZXN1bHQtZGF0ZVxcXCI+e3tkYXRlfX08L2Rpdj5cXG5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcInJlc3VsdC1pY29uc1xcXCI+XFxuICAgICAgICAgIHt7I2NvdW50fX08c3BhbiBjbGFzcz1cXFwicmVzdWx0LWNvdW50XFxcIj57e2NvdW50fX08L3NwYW4+e3svY291bnR9fVxcbiAgICAgICAgICB7eyNjb3VudH19e3sjdHJhZGFibGV9fVxcbiAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpY29uLXNwYWNlclxcXCI+PC9kaXY+XFxuICAgICAgICAgIHt7L3RyYWRhYmxlfX17ey9jb3VudH19IHt7I3RyYWRhYmxlfX08c3BhbiBjbGFzcz1cXFwiaGlzdG9yeS10cmFkYWJsZVxcXCJcXG4gICAgICAgICAgICA+7qCCPC9zcGFuXFxuICAgICAgICAgID57ey90cmFkYWJsZX19XFxuICAgICAgICA8L2Rpdj5cXG4gICAgICA8L2Rpdj5cXG4gICAgPC9kaXY+XFxuICAgIHt7L2hpc3Rvcnl9fVxcbiAgPC9kaXY+XFxuPC9kaXY+XFxuXCIsIEgpO3JldHVybiBUOyB9KCk7IiwidmFyIEggPSByZXF1aXJlKFwiaG9nYW4uanNcIik7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkgeyB2YXIgVCA9IG5ldyBILlRlbXBsYXRlKHtjb2RlOiBmdW5jdGlvbiAoYyxwLGkpIHsgdmFyIHQ9dGhpczt0LmIoaT1pfHxcIlwiKTt0LmIoXCI8c3R5bGU+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAuY3JlYXRlZC1vdXRmaXQtcG9wdXAgLmZsYXZyLW91dGVyIC5mbGF2ci1tZXNzYWdlOjphZnRlciB7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgIGJhY2tncm91bmQtaW1hZ2U6IHVybChcIik7dC5iKHQudih0LmYoXCJ1cmxcIixjLHAsMCkpKTt0LmIoXCIpO1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICBiYWNrZ3JvdW5kLXNpemU6IGNvbnRhaW47XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICB9XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiPC9zdHlsZT5cIik7dC5iKFwiXFxuXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiPGgxPlwiKTt0LmIodC52KHQuZihcIm5hbWVcIixjLHAsMCkpKTt0LmIoXCI8L2gxPlwiKTt0LmIoXCJcXG5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCI8cD5cIik7dC5iKHQudCh0LmQoXCJ0cmFuc2xhdGUuYXBwZWFyYW5jZS5mYXZvdXJpdGVzLmNsaWNrX291dGZpdC5zYXZlZF9sb2NhbGx5XCIsYyxwLDApKSk7dC5iKFwiPC9wPlwiKTt0LmIoXCJcXG5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCI8YnIgLz5cIik7dC5iKFwiXFxuXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiPHA+XCIpO3QuYih0LnQodC5kKFwidHJhbnNsYXRlLmFwcGVhcmFuY2UuZmF2b3VyaXRlcy5jbGlja19vdXRmaXQuZ290b19hY2NvdW50XCIsYyxwLDApKSk7dC5iKFwiPC9wPlwiKTt0LmIoXCJcXG5cIik7cmV0dXJuIHQuZmwoKTsgfSxwYXJ0aWFsczoge30sIHN1YnM6IHsgIH19LCBcIjxzdHlsZT5cXG4gIC5jcmVhdGVkLW91dGZpdC1wb3B1cCAuZmxhdnItb3V0ZXIgLmZsYXZyLW1lc3NhZ2U6OmFmdGVyIHtcXG4gICAgYmFja2dyb3VuZC1pbWFnZTogdXJsKHt7dXJsfX0pO1xcbiAgICBiYWNrZ3JvdW5kLXNpemU6IGNvbnRhaW47XFxuICB9XFxuPC9zdHlsZT5cXG5cXG48aDE+e3tuYW1lfX08L2gxPlxcblxcbjxwPnt7e3RyYW5zbGF0ZS5hcHBlYXJhbmNlLmZhdm91cml0ZXMuY2xpY2tfb3V0Zml0LnNhdmVkX2xvY2FsbHl9fX08L3A+XFxuXFxuPGJyIC8+XFxuXFxuPHA+e3t7dHJhbnNsYXRlLmFwcGVhcmFuY2UuZmF2b3VyaXRlcy5jbGlja19vdXRmaXQuZ290b19hY2NvdW50fX19PC9wPlxcblwiLCBIKTtyZXR1cm4gVDsgfSgpOyIsInZhciBIID0gcmVxdWlyZShcImhvZ2FuLmpzXCIpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHsgdmFyIFQgPSBuZXcgSC5UZW1wbGF0ZSh7Y29kZTogZnVuY3Rpb24gKGMscCxpKSB7IHZhciB0PXRoaXM7dC5iKGk9aXx8XCJcIik7dC5iKFwiPGJ1dHRvbiBpZD1cXFwiXCIpO3QuYih0LnYodC5mKFwiaWRcIixjLHAsMCkpKTt0LmIoXCJcXFwiIGNsYXNzPVxcXCJubC1idXR0b24gZmF2b3JpdGVzLWFjdGlvbi1lZVxcXCI+XCIpO3QuYih0LnYodC5mKFwidGV4dFwiLGMscCwwKSkpO3QuYihcIjwvYnV0dG9uPlwiKTt0LmIoXCJcXG5cIik7cmV0dXJuIHQuZmwoKTsgfSxwYXJ0aWFsczoge30sIHN1YnM6IHsgIH19LCBcIjxidXR0b24gaWQ9XFxcInt7aWR9fVxcXCIgY2xhc3M9XFxcIm5sLWJ1dHRvbiBmYXZvcml0ZXMtYWN0aW9uLWVlXFxcIj57e3RleHR9fTwvYnV0dG9uPlxcblwiLCBIKTtyZXR1cm4gVDsgfSgpOyIsInZhciBIID0gcmVxdWlyZShcImhvZ2FuLmpzXCIpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHsgdmFyIFQgPSBuZXcgSC5UZW1wbGF0ZSh7Y29kZTogZnVuY3Rpb24gKGMscCxpKSB7IHZhciB0PXRoaXM7dC5iKGk9aXx8XCJcIik7dC5iKFwiPGltZ1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgc3JjPVxcXCJcIik7dC5iKHQudih0LmYoXCJpY29uXCIsYyxwLDApKSk7dC5iKFwiXFxcIlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgYWx0PVxcXCJcIik7dC5iKHQudih0LmYoXCJuYW1lXCIsYyxwLDApKSk7dC5iKFwiXFxcIlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgaGVpZ2h0PVxcXCIyMVxcXCJcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIHN0eWxlPVxcXCJkaXNwbGF5OiBpbmxpbmUtYmxvY2s7IG1hcmdpbjogLTJweCBhdXRvXFxcIlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIi8+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKHQudCh0LmYoXCJtZXNzYWdlXCIsYyxwLDApKSk7dC5iKFwiXFxuXCIpO3JldHVybiB0LmZsKCk7IH0scGFydGlhbHM6IHt9LCBzdWJzOiB7ICB9fSwgXCI8aW1nXFxuICBzcmM9XFxcInt7aWNvbn19XFxcIlxcbiAgYWx0PVxcXCJ7e25hbWV9fVxcXCJcXG4gIGhlaWdodD1cXFwiMjFcXFwiXFxuICBzdHlsZT1cXFwiZGlzcGxheTogaW5saW5lLWJsb2NrOyBtYXJnaW46IC0ycHggYXV0b1xcXCJcXG4vPlxcbnt7e21lc3NhZ2V9fX1cXG5cIiwgSCk7cmV0dXJuIFQ7IH0oKTsiLCJ2YXIgSCA9IHJlcXVpcmUoXCJob2dhbi5qc1wiKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7IHZhciBUID0gbmV3IEguVGVtcGxhdGUoe2NvZGU6IGZ1bmN0aW9uIChjLHAsaSkgeyB2YXIgdD10aGlzO3QuYihpPWl8fFwiXCIpO3QuYihcIjxsaVwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgaWQ9XFxcImhlYWRlci10YWtlb3ZlclxcXCJcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIHRpdGxlPVxcXCJcIik7dC5iKHQudih0LmQoXCJ0cmFuc2xhdGUuaG9tZS50YWtlb3ZlclwiLGMscCwwKSkpO3QuYihcIlxcXCJcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIHN0eWxlPVxcXCJ0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gZWFzZS1pbi1vdXQgMjAwbXM7IGN1cnNvcjogcG9pbnRlclxcXCJcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIG9uTW91c2VPdmVyPVxcXCJ0aGlzLnN0eWxlLnRyYW5zZm9ybT0nc2NhbGUoMS4zKSdcXFwiXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICBvbk1vdXNlT3V0PVxcXCJ0aGlzLnN0eWxlLnRyYW5zZm9ybT0nc2NhbGUoMSknXFxcIlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIj5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIDxhPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICA8aW1nXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgc3JjPVxcXCIvc3RhdGljL2ltZy9uZXctbGF5b3V0L2hvbWUvY29ubmVjdGVkL2xvY2sucG5nXFxcIlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIGFsdD1cXFwiXCIpO3QuYih0LnYodC5kKFwidHJhbnNsYXRlLmhvbWUudGFrZW92ZXJcIixjLHAsMCkpKTt0LmIoXCJcXFwiXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgc3R5bGU9XFxcImZpbHRlcjogY29udHJhc3QoMCUpIGJyaWdodG5lc3MoMjAwJSkgXCIpO2lmKCF0LnModC5mKFwidGFrZW92ZXJcIixjLHAsMSksYyxwLDEsMCwwLFwiXCIpKXt0LmIoXCJvcGFjaXR5KDApXCIpO307dC5iKFwiXFxcIlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIGhlaWdodD1cXFwiMjFcXFwiXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgIC8+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICA8L2E+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiPC9saT5cIik7dC5iKFwiXFxuXCIpO3JldHVybiB0LmZsKCk7IH0scGFydGlhbHM6IHt9LCBzdWJzOiB7ICB9fSwgXCI8bGlcXG4gIGlkPVxcXCJoZWFkZXItdGFrZW92ZXJcXFwiXFxuICB0aXRsZT1cXFwie3t0cmFuc2xhdGUuaG9tZS50YWtlb3Zlcn19XFxcIlxcbiAgc3R5bGU9XFxcInRyYW5zaXRpb246IHRyYW5zZm9ybSBlYXNlLWluLW91dCAyMDBtczsgY3Vyc29yOiBwb2ludGVyXFxcIlxcbiAgb25Nb3VzZU92ZXI9XFxcInRoaXMuc3R5bGUudHJhbnNmb3JtPSdzY2FsZSgxLjMpJ1xcXCJcXG4gIG9uTW91c2VPdXQ9XFxcInRoaXMuc3R5bGUudHJhbnNmb3JtPSdzY2FsZSgxKSdcXFwiXFxuPlxcbiAgPGE+XFxuICAgIDxpbWdcXG4gICAgICBzcmM9XFxcIi9zdGF0aWMvaW1nL25ldy1sYXlvdXQvaG9tZS9jb25uZWN0ZWQvbG9jay5wbmdcXFwiXFxuICAgICAgYWx0PVxcXCJ7e3RyYW5zbGF0ZS5ob21lLnRha2VvdmVyfX1cXFwiXFxuICAgICAgc3R5bGU9XFxcImZpbHRlcjogY29udHJhc3QoMCUpIGJyaWdodG5lc3MoMjAwJSkge3tedGFrZW92ZXJ9fW9wYWNpdHkoMCl7ey90YWtlb3Zlcn19XFxcIlxcbiAgICAgIGhlaWdodD1cXFwiMjFcXFwiXFxuICAgIC8+XFxuICA8L2E+XFxuPC9saT5cXG5cIiwgSCk7cmV0dXJuIFQ7IH0oKTsiLCJ2YXIgSCA9IHJlcXVpcmUoXCJob2dhbi5qc1wiKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7IHZhciBUID0gbmV3IEguVGVtcGxhdGUoe2NvZGU6IGZ1bmN0aW9uIChjLHAsaSkgeyB2YXIgdD10aGlzO3QuYihpPWl8fFwiXCIpO3QuYihcIjxhXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICBpZD1cXFwiaG9tZS1cIik7dC5iKHQudih0LmYoXCJpZFwiLGMscCwwKSkpO3QuYihcIlxcXCJcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIGNsYXNzPVxcXCJob21lLWNvbnRlbnQtdGlsZSBob21lLWNvbnRlbnQtc21hbGwgaG9tZS1jb250ZW50LXNtYWxsLWVlXFxcIlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgaHJlZj1cXFwiXCIpO3QuYih0LnYodC5mKFwiaHJlZlwiLGMscCwwKSkpO3QuYihcIlxcXCJcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIHN0eWxlPVxcXCJiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCIpO3QuYih0LnYodC5mKFwiYmFja2dyb3VuZEltYWdlXCIsYyxwLDApKSk7dC5iKFwiKTtcXFwiXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgPGg0PlwiKTt0LmIodC52KHQuZihcImg0XCIsYyxwLDApKSk7dC5iKFwiPC9oND5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCI8L2E+XCIpO3QuYihcIlxcblwiKTtyZXR1cm4gdC5mbCgpOyB9LHBhcnRpYWxzOiB7fSwgc3ViczogeyAgfX0sIFwiPGFcXG4gIGlkPVxcXCJob21lLXt7aWR9fVxcXCJcXG4gIGNsYXNzPVxcXCJob21lLWNvbnRlbnQtdGlsZSBob21lLWNvbnRlbnQtc21hbGwgaG9tZS1jb250ZW50LXNtYWxsLWVlXFxcIlxcbiAgaHJlZj1cXFwie3tocmVmfX1cXFwiXFxuICBzdHlsZT1cXFwiYmFja2dyb3VuZC1pbWFnZTogdXJsKHt7YmFja2dyb3VuZEltYWdlfX0pO1xcXCJcXG4+XFxuICA8aDQ+e3toNH19PC9oND5cXG48L2E+XFxuXCIsIEgpO3JldHVybiBUOyB9KCk7IiwidmFyIEggPSByZXF1aXJlKFwiaG9nYW4uanNcIik7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkgeyB2YXIgVCA9IG5ldyBILlRlbXBsYXRlKHtjb2RlOiBmdW5jdGlvbiAoYyxwLGkpIHsgdmFyIHQ9dGhpczt0LmIoaT1pfHxcIlwiKTt0LmIoXCI8bGkgY2xhc3M9XFxcIm1haW4tbWVudS1cIik7dC5iKHQudih0LmYoXCJjbGFzc1wiLGMscCwwKSkpO3QuYihcIiBtYWluLW1lbnUtZWVcXFwiPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgPGEgaHJlZj1cXFwiXCIpO3QuYih0LnYodC5mKFwiaHJlZlwiLGMscCwwKSkpO3QuYihcIlxcXCI+XCIpO3QuYih0LnYodC5mKFwidGV4dFwiLGMscCwwKSkpO3QuYihcIjwvYT5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCI8L2xpPlwiKTt0LmIoXCJcXG5cIik7cmV0dXJuIHQuZmwoKTsgfSxwYXJ0aWFsczoge30sIHN1YnM6IHsgIH19LCBcIjxsaSBjbGFzcz1cXFwibWFpbi1tZW51LXt7Y2xhc3N9fSBtYWluLW1lbnUtZWVcXFwiPlxcbiAgPGEgaHJlZj1cXFwie3tocmVmfX1cXFwiPnt7dGV4dH19PC9hPlxcbjwvbGk+XFxuXCIsIEgpO3JldHVybiBUOyB9KCk7IiwidmFyIEggPSByZXF1aXJlKFwiaG9nYW4uanNcIik7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkgeyB2YXIgVCA9IG5ldyBILlRlbXBsYXRlKHtjb2RlOiBmdW5jdGlvbiAoYyxwLGkpIHsgdmFyIHQ9dGhpczt0LmIoaT1pfHxcIlwiKTt0LmIoXCI8bGkgY2xhc3M9XFxcIm1haW4tbWVudS1wdXJyb3Nob3BcXFwiPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgPGEgaHJlZj1cXFwiL21hbGwvcHVycm9zaG9wXFxcIj5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgPGltZ1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIGhlaWdodD1cXFwiMjBcXFwiXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgc3JjPVxcXCIvYXNzZXRzL2ltZy9pdGVtL2NvbnN1bWFibGUvYjY0N2Q1NGFmZDZiMDQzNTNlMTI5MjE5ODEwNTEyZjUucG5nXFxcIlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIHN0eWxlPVxcXCJ2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlXFxcIlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAvPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICBQdXJybydTaG9wXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICA8L2E+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiPC9saT5cIik7dC5iKFwiXFxuXCIpO3JldHVybiB0LmZsKCk7IH0scGFydGlhbHM6IHt9LCBzdWJzOiB7ICB9fSwgXCI8bGkgY2xhc3M9XFxcIm1haW4tbWVudS1wdXJyb3Nob3BcXFwiPlxcbiAgPGEgaHJlZj1cXFwiL21hbGwvcHVycm9zaG9wXFxcIj5cXG4gICAgPGltZ1xcbiAgICAgIGhlaWdodD1cXFwiMjBcXFwiXFxuICAgICAgc3JjPVxcXCIvYXNzZXRzL2ltZy9pdGVtL2NvbnN1bWFibGUvYjY0N2Q1NGFmZDZiMDQzNTNlMTI5MjE5ODEwNTEyZjUucG5nXFxcIlxcbiAgICAgIHN0eWxlPVxcXCJ2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlXFxcIlxcbiAgICAvPlxcbiAgICBQdXJybydTaG9wXFxuICA8L2E+XFxuPC9saT5cXG5cIiwgSCk7cmV0dXJuIFQ7IH0oKTsiLCJ2YXIgSCA9IHJlcXVpcmUoXCJob2dhbi5qc1wiKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7IHZhciBUID0gbmV3IEguVGVtcGxhdGUoe2NvZGU6IGZ1bmN0aW9uIChjLHAsaSkgeyB2YXIgdD10aGlzO3QuYihpPWl8fFwiXCIpO3QuYihcIjxzdHlsZT5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIC8qICNtYXJrZXRwbGFjZS1hYnN0cmFjdC1wdXJjaGFzZXMgYW5kICNtYXJrZXRwbGFjZS1hYnN0cmFjdC1zYWxlcyB3ZXJlXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICByZS13cml0dGVuIHRvIHRhcmdldCAjcHVyY2hhc2UtaGlzdG9yeSBhbmQgI3NhbGUtaGlzdG9yeS4gKi9cIik7dC5iKFwiXFxuXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAjcHVyY2hhc2UtaGlzdG9yeSxcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICNzYWxlLWhpc3Rvcnkge1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICBoZWlnaHQ6IDYwMHB4O1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgIHdpZHRoOiAzNjBweDtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICB2ZXJ0aWNhbC1hbGlnbjogdG9wO1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgfVwiKTt0LmIoXCJcXG5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICNzYWxlLWhpc3RvcnkgLmFic3RyYWN0LWFjdGlvbnMsXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAjcHVyY2hhc2UtaGlzdG9yeSAuYWJzdHJhY3QtYWN0aW9ucyB7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgdG9wOiAtNDBweDtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgZGlzcGxheTogZmxleDtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgIGhlaWdodDogODBweDtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIH1cIik7dC5iKFwiXFxuXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAjc2FsZS1oaXN0b3J5IC5hYnN0cmFjdC10aW1lLFwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgI3B1cmNoYXNlLWhpc3RvcnkgLmFic3RyYWN0LXRpbWUge1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICBwb3NpdGlvbjogc3RhdGljO1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICBkaXNwbGF5OiBpbmxpbmU7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgIGhlaWdodDogYXV0bztcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgY29sb3I6ICNmYjg5MDA7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgIGZvbnQtd2VpZ2h0OiBib2xkO1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICBmb250LXNpemU6IDEzcHg7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICB9XCIpO3QuYihcIlxcblwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgI3B1cmNoYXNlLWhpc3Rvcnkge1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICBtYXJnaW4tcmlnaHQ6IDgwcHg7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICB9XCIpO3QuYihcIlxcblwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgI3B1cmNoYXNlLWhpc3Rvcnk6YmVmb3JlIHtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgY29udGVudDogXFxcIlxcXCI7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgdG9wOiAxMjBweDtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgcmlnaHQ6IC00MnB4O1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICBib3JkZXItcmlnaHQ6IHNvbGlkIDJweCAjYWFhO1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICBoZWlnaHQ6IDMyMHB4O1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgfVwiKTt0LmIoXCJcXG5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIC8qIEN1c3RvbSBmaXhlcyB0byB0aGUgbGF5b3V0ICovXCIpO3QuYihcIlxcblwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgI3B1cmNoYXNlLWhpc3RvcnkgbGkge1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICBtYXJnaW4tbGVmdDogNHB4O1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICBtYXJnaW4tcmlnaHQ6IDRweDtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIH1cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCI8L3N0eWxlPlwiKTt0LmIoXCJcXG5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCI8IS0tIFB1cmNoYXNlcyAtLT5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCI8ZGl2IGNsYXNzPVxcXCJtYXJrZXRwbGFjZS1hYnN0cmFjdFxcXCIgaWQ9XFxcInB1cmNoYXNlLWhpc3RvcnlcXFwiPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgPGgyIGNsYXNzPVxcXCJzZWN0aW9uLXN1YnRpdGxlXFxcIj5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgXCIpO3QuYih0LnYodC5kKFwidHJhbnNsYXRlLm1hcmtldC5hdWN0aW9ucy5wdXJjaGFzZV9oaXN0b3J5XCIsYyxwLDApKSk7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIDwvaDI+XCIpO3QuYihcIlxcblwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgPHVsPlwiKTt0LmIoXCJcXG5cIiArIGkpO2lmKHQucyh0LmYoXCJwdXJjaGFzZXNcIixjLHAsMSksYyxwLDAsMTI0OCwyNTA5LFwie3sgfX1cIikpe3QucnMoYyxwLGZ1bmN0aW9uKGMscCx0KXt0LmIoXCIgICAgPGxpXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgZGF0YS1pdGVtaWQ9XFxcIlwiKTt0LmIodC52KHQuZihcIml0ZW1pZFwiLGMscCwwKSkpO3QuYihcIlxcXCJcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICBjbGFzcz1cXFwibWFya2V0cGxhY2UtYWJzdHJhY3QgbWFya2V0cGxhY2UtYXVjdGlvbnMtaXRlbSBtYXJrZXRwbGFjZS1zYWxlcy1pdGVtXFxcIlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICA+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgPCEtLSBJY29uIC0tPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIDxkaXYgY2xhc3M9XFxcImFic3RyYWN0LWljb25cXFwiPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgICAgPGltZyBzcmM9XFxcIlwiKTt0LmIodC52KHQuZihcImljb25cIixjLHAsMCkpKTt0LmIoXCJcXFwiIC8+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgPC9kaXY+XCIpO3QuYihcIlxcblwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIDwhLS0gUHJpY2VzIC0tPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIDxkaXYgY2xhc3M9XFxcImFic3RyYWN0LWNvbnRhaW5lclxcXCI+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgICA8ZGl2IGNsYXNzPVxcXCJhYnN0cmFjdC1uYW1lXFxcIj5cIik7dC5iKHQudih0LmYoXCJuYW1lXCIsYyxwLDApKSk7dC5iKFwiPC9kaXY+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgICA8ZGl2IGNsYXNzPVxcXCJhYnN0cmFjdC1jb250ZW50XFxcIj5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYWJzdHJhY3QtY3VycmVudFByaWNlXFxcIj5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICAgICAgICBcIik7aWYodC5zKHQuZihcImN1cnJlbnRQcmljZVwiLGMscCwxKSxjLHAsMCwxNzAyLDE4NzEsXCJ7eyB9fVwiKSl7dC5ycyhjLHAsZnVuY3Rpb24oYyxwLHQpe3QuYihcIiBcIik7dC5iKHQudih0LmQoXCJ0cmFuc2xhdGUubWFya2V0LmF1Y3Rpb25zLmN1cnJlbnRfcHJpY2VcIixjLHAsMCkpKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJwcmljZS1pdGVtXFxcIj5cIik7dC5iKHQudih0LmQoXCJjdXJyZW50UHJpY2UucHJpY2VcIixjLHAsMCkpKTt0LmIoXCI8L3NwYW4+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgICAgICAgPHNwYW4gY2xhc3M9XFxcIm1hYW5hLWljb25cXFwiPjwvc3Bhbj5cIik7dC5iKFwiXFxuXCIgKyBpKTt9KTtjLnBvcCgpO310LmIoXCIgICAgICAgICAgICA8YnIgLz5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICAgICAgICBcIik7aWYodC5zKHQuZihcImJ1eU5vd1ByaWNlXCIsYyxwLDEpLGMscCwwLDE5MzYsMjEwNCxcInt7IH19XCIpKXt0LnJzKGMscCxmdW5jdGlvbihjLHAsdCl7dC5iKFwiIFwiKTt0LmIodC52KHQuZChcInRyYW5zbGF0ZS5tYXJrZXQuYXVjdGlvbnMuYnV5X25vd19wcmljZVwiLGMscCwwKSkpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgICAgICAgPHNwYW4gY2xhc3M9XFxcInByaWNlLWl0ZW1cXFwiPlwiKTt0LmIodC52KHQuZChcImJ1eU5vd1ByaWNlLnByaWNlXCIsYyxwLDApKSk7dC5iKFwiPC9zcGFuPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJtYWFuYS1pY29uXFxcIj48L3NwYW4+XCIpO3QuYihcIlxcblwiICsgaSk7fSk7Yy5wb3AoKTt9dC5iKFwiICAgICAgICAgIDwvZGl2PlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgICAgPC9kaXY+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgPC9kaXY+XCIpO3QuYihcIlxcblwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIDwhLS0gQWN0aW9ucyAtLT5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICA8ZGl2IGNsYXNzPVxcXCJhYnN0cmFjdC1hY3Rpb25zXFxcIj5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICAgIDxkaXYgY2xhc3M9XFxcImFic3RyYWN0LXRpbWVcXFwiPlwiKTt0LmIodC52KHQuZihcImRhdGVcIixjLHAsMCkpKTt0LmIoXCI8L2Rpdj5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICAgIDxkaXZcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICAgICAgY2xhc3M9XFxcIm5sLWJ1dHRvbiBubC1idXR0b24tc20gbWFya2V0cGxhY2UtaXRlbURldGFpbC1jYW5jZWwgZGVsZXRlLWJ1dHRvblxcXCJcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICAgICAgZGF0YS1pdGVtaWQ9XFxcIlwiKTt0LmIodC52KHQuZihcIml0ZW1pZFwiLGMscCwwKSkpO3QuYihcIlxcXCJcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICAgID5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICAgICAgXCIpO3QuYih0LnYodC5kKFwidHJhbnNsYXRlLm1hcmtldC5hdWN0aW9ucy5kZWxldGVcIixjLHAsMCkpKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgICAgPC9kaXY+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgPC9kaXY+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgIDwvbGk+XCIpO3QuYihcIlxcblwiICsgaSk7fSk7Yy5wb3AoKTt9dC5iKFwiICA8L3VsPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIjwvZGl2PlwiKTt0LmIoXCJcXG5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCI8IS0tIFNhbGVzIC0tPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIjxkaXYgY2xhc3M9XFxcIm1hcmtldHBsYWNlLWFic3RyYWN0XFxcIiBpZD1cXFwic2FsZS1oaXN0b3J5XFxcIj5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIDxoMiBjbGFzcz1cXFwic2VjdGlvbi1zdWJ0aXRsZVxcXCI+XCIpO3QuYih0LnYodC5kKFwidHJhbnNsYXRlLm1hcmtldC5hdWN0aW9ucy5zYWxlc19oaXN0b3J5XCIsYyxwLDApKSk7dC5iKFwiPC9oMj5cIik7dC5iKFwiXFxuXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICA8dWw+XCIpO3QuYihcIlxcblwiICsgaSk7aWYodC5zKHQuZihcInNhbGVzXCIsYyxwLDEpLGMscCwwLDI3MTAsMzg1NixcInt7IH19XCIpKXt0LnJzKGMscCxmdW5jdGlvbihjLHAsdCl7dC5iKFwiICAgIDxsaSBjbGFzcz1cXFwibWFya2V0cGxhY2UtYWJzdHJhY3QgbWFya2V0cGxhY2Utc2FsZXMtaXRlbVxcXCI+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgPCEtLSBJY29uIC0tPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIDxkaXYgY2xhc3M9XFxcImFic3RyYWN0LWljb25cXFwiPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgICAgPGltZyBzcmM9XFxcIlwiKTt0LmIodC52KHQuZihcImljb25cIixjLHAsMCkpKTt0LmIoXCJcXFwiIC8+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgPC9kaXY+XCIpO3QuYihcIlxcblwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIDwhLS0gUHJpY2VzIC0tPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIDxkaXYgY2xhc3M9XFxcImFic3RyYWN0LWNvbnRhaW5lclxcXCI+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgICA8ZGl2IGNsYXNzPVxcXCJhYnN0cmFjdC1uYW1lXFxcIj5cIik7dC5iKHQudih0LmYoXCJuYW1lXCIsYyxwLDApKSk7dC5iKFwiPC9kaXY+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgICA8ZGl2IGNsYXNzPVxcXCJhYnN0cmFjdC1jb250ZW50XFxcIj5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYWJzdHJhY3QtY3VycmVudFByaWNlXFxcIj5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICAgICAgICBcIik7aWYodC5zKHQuZihcImN1cnJlbnRQcmljZVwiLGMscCwxKSxjLHAsMCwzMDk2LDMyNTksXCJ7eyB9fVwiKSl7dC5ycyhjLHAsZnVuY3Rpb24oYyxwLHQpe3QuYihcIiBcIik7dC5iKHQudih0LmQoXCJ0cmFuc2xhdGUubWFya2V0LmF1Y3Rpb25zLmN1cnJlbnRfcHJpY2VcIixjLHAsMCkpKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJwcmljZS1pdGVtXFxcIj5cIik7dC5iKHQudih0LmYoXCJjdXJyZW50UHJpY2VcIixjLHAsMCkpKTt0LmIoXCI8L3NwYW4+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgICAgICAgPHNwYW4gY2xhc3M9XFxcIm1hYW5hLWljb25cXFwiPjwvc3Bhbj5cIik7dC5iKFwiXFxuXCIgKyBpKTt9KTtjLnBvcCgpO310LmIoXCIgICAgICAgICAgICA8YnIgLz5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICAgICAgICBcIik7aWYodC5zKHQuZihcImJ1eU5vd1ByaWNlXCIsYyxwLDEpLGMscCwwLDMzMjQsMzQ4NixcInt7IH19XCIpKXt0LnJzKGMscCxmdW5jdGlvbihjLHAsdCl7dC5iKFwiIFwiKTt0LmIodC52KHQuZChcInRyYW5zbGF0ZS5tYXJrZXQuYXVjdGlvbnMuYnV5X25vd19wcmljZVwiLGMscCwwKSkpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgICAgICAgPHNwYW4gY2xhc3M9XFxcInByaWNlLWl0ZW1cXFwiPlwiKTt0LmIodC52KHQuZihcImJ1eU5vd1ByaWNlXCIsYyxwLDApKSk7dC5iKFwiPC9zcGFuPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJtYWFuYS1pY29uXFxcIj48L3NwYW4+XCIpO3QuYihcIlxcblwiICsgaSk7fSk7Yy5wb3AoKTt9dC5iKFwiICAgICAgICAgIDwvZGl2PlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgICAgPC9kaXY+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgPC9kaXY+XCIpO3QuYihcIlxcblwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIDwhLS0gQWN0aW9ucyAtLT5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICA8ZGl2IGNsYXNzPVxcXCJhYnN0cmFjdC1hY3Rpb25zXFxcIj5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICAgIDxkaXYgY2xhc3M9XFxcImFic3RyYWN0LXRpbWVcXFwiPlwiKTt0LmIodC52KHQuZihcImRhdGVcIixjLHAsMCkpKTt0LmIoXCI8L2Rpdj5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICAgIDxkaXZcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICAgICAgY2xhc3M9XFxcIm5sLWJ1dHRvbiBubC1idXR0b24tc20gbWFya2V0cGxhY2UtaXRlbURldGFpbC1jYW5jZWwgZGVsZXRlLWJ1dHRvblxcXCJcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICAgID5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICAgICAgXCIpO3QuYih0LnYodC5kKFwidHJhbnNsYXRlLm1hcmtldC5hdWN0aW9ucy5kZWxldGVcIixjLHAsMCkpKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgICAgPC9kaXY+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgPC9kaXY+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgIDwvbGk+XCIpO3QuYihcIlxcblwiICsgaSk7fSk7Yy5wb3AoKTt9dC5iKFwiICA8L3VsPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIjwvZGl2PlwiKTt0LmIoXCJcXG5cIik7cmV0dXJuIHQuZmwoKTsgfSxwYXJ0aWFsczoge30sIHN1YnM6IHsgIH19LCBcIjxzdHlsZT5cXG4gIC8qICNtYXJrZXRwbGFjZS1hYnN0cmFjdC1wdXJjaGFzZXMgYW5kICNtYXJrZXRwbGFjZS1hYnN0cmFjdC1zYWxlcyB3ZXJlXFxuICByZS13cml0dGVuIHRvIHRhcmdldCAjcHVyY2hhc2UtaGlzdG9yeSBhbmQgI3NhbGUtaGlzdG9yeS4gKi9cXG5cXG4gICNwdXJjaGFzZS1oaXN0b3J5LFxcbiAgI3NhbGUtaGlzdG9yeSB7XFxuICAgIGhlaWdodDogNjAwcHg7XFxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gICAgd2lkdGg6IDM2MHB4O1xcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxuICAgIHZlcnRpY2FsLWFsaWduOiB0b3A7XFxuICB9XFxuXFxuICAjc2FsZS1oaXN0b3J5IC5hYnN0cmFjdC1hY3Rpb25zLFxcbiAgI3B1cmNoYXNlLWhpc3RvcnkgLmFic3RyYWN0LWFjdGlvbnMge1xcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICAgIHRvcDogLTQwcHg7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xcbiAgICBoZWlnaHQ6IDgwcHg7XFxuICB9XFxuXFxuICAjc2FsZS1oaXN0b3J5IC5hYnN0cmFjdC10aW1lLFxcbiAgI3B1cmNoYXNlLWhpc3RvcnkgLmFic3RyYWN0LXRpbWUge1xcbiAgICBwb3NpdGlvbjogc3RhdGljO1xcbiAgICBkaXNwbGF5OiBpbmxpbmU7XFxuICAgIGhlaWdodDogYXV0bztcXG4gICAgY29sb3I6ICNmYjg5MDA7XFxuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xcbiAgICBmb250LXNpemU6IDEzcHg7XFxuICB9XFxuXFxuICAjcHVyY2hhc2UtaGlzdG9yeSB7XFxuICAgIG1hcmdpbi1yaWdodDogODBweDtcXG4gIH1cXG5cXG4gICNwdXJjaGFzZS1oaXN0b3J5OmJlZm9yZSB7XFxuICAgIGNvbnRlbnQ6IFxcXCJcXFwiO1xcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICAgIHRvcDogMTIwcHg7XFxuICAgIHJpZ2h0OiAtNDJweDtcXG4gICAgYm9yZGVyLXJpZ2h0OiBzb2xpZCAycHggI2FhYTtcXG4gICAgaGVpZ2h0OiAzMjBweDtcXG4gIH1cXG5cXG4gIC8qIEN1c3RvbSBmaXhlcyB0byB0aGUgbGF5b3V0ICovXFxuXFxuICAjcHVyY2hhc2UtaGlzdG9yeSBsaSB7XFxuICAgIG1hcmdpbi1sZWZ0OiA0cHg7XFxuICAgIG1hcmdpbi1yaWdodDogNHB4O1xcbiAgfVxcbjwvc3R5bGU+XFxuXFxuPCEtLSBQdXJjaGFzZXMgLS0+XFxuPGRpdiBjbGFzcz1cXFwibWFya2V0cGxhY2UtYWJzdHJhY3RcXFwiIGlkPVxcXCJwdXJjaGFzZS1oaXN0b3J5XFxcIj5cXG4gIDxoMiBjbGFzcz1cXFwic2VjdGlvbi1zdWJ0aXRsZVxcXCI+XFxuICAgIHt7dHJhbnNsYXRlLm1hcmtldC5hdWN0aW9ucy5wdXJjaGFzZV9oaXN0b3J5fX1cXG4gIDwvaDI+XFxuXFxuICA8dWw+XFxuICAgIHt7I3B1cmNoYXNlc319XFxuICAgIDxsaVxcbiAgICAgIGRhdGEtaXRlbWlkPVxcXCJ7e2l0ZW1pZH19XFxcIlxcbiAgICAgIGNsYXNzPVxcXCJtYXJrZXRwbGFjZS1hYnN0cmFjdCBtYXJrZXRwbGFjZS1hdWN0aW9ucy1pdGVtIG1hcmtldHBsYWNlLXNhbGVzLWl0ZW1cXFwiXFxuICAgID5cXG4gICAgICA8IS0tIEljb24gLS0+XFxuICAgICAgPGRpdiBjbGFzcz1cXFwiYWJzdHJhY3QtaWNvblxcXCI+XFxuICAgICAgICA8aW1nIHNyYz1cXFwie3tpY29ufX1cXFwiIC8+XFxuICAgICAgPC9kaXY+XFxuXFxuICAgICAgPCEtLSBQcmljZXMgLS0+XFxuICAgICAgPGRpdiBjbGFzcz1cXFwiYWJzdHJhY3QtY29udGFpbmVyXFxcIj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImFic3RyYWN0LW5hbWVcXFwiPnt7bmFtZX19PC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJhYnN0cmFjdC1jb250ZW50XFxcIj5cXG4gICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYWJzdHJhY3QtY3VycmVudFByaWNlXFxcIj5cXG4gICAgICAgICAgICB7eyNjdXJyZW50UHJpY2V9fSB7e3RyYW5zbGF0ZS5tYXJrZXQuYXVjdGlvbnMuY3VycmVudF9wcmljZX19XFxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XFxcInByaWNlLWl0ZW1cXFwiPnt7Y3VycmVudFByaWNlLnByaWNlfX08L3NwYW4+XFxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XFxcIm1hYW5hLWljb25cXFwiPjwvc3Bhbj5cXG4gICAgICAgICAgICB7ey9jdXJyZW50UHJpY2V9fVxcbiAgICAgICAgICAgIDxiciAvPlxcbiAgICAgICAgICAgIHt7I2J1eU5vd1ByaWNlfX0ge3t0cmFuc2xhdGUubWFya2V0LmF1Y3Rpb25zLmJ1eV9ub3dfcHJpY2V9fVxcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJwcmljZS1pdGVtXFxcIj57e2J1eU5vd1ByaWNlLnByaWNlfX08L3NwYW4+XFxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XFxcIm1hYW5hLWljb25cXFwiPjwvc3Bhbj5cXG4gICAgICAgICAgICB7ey9idXlOb3dQcmljZX19XFxuICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgPC9kaXY+XFxuICAgICAgPC9kaXY+XFxuXFxuICAgICAgPCEtLSBBY3Rpb25zIC0tPlxcbiAgICAgIDxkaXYgY2xhc3M9XFxcImFic3RyYWN0LWFjdGlvbnNcXFwiPlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiYWJzdHJhY3QtdGltZVxcXCI+e3tkYXRlfX08L2Rpdj5cXG4gICAgICAgIDxkaXZcXG4gICAgICAgICAgY2xhc3M9XFxcIm5sLWJ1dHRvbiBubC1idXR0b24tc20gbWFya2V0cGxhY2UtaXRlbURldGFpbC1jYW5jZWwgZGVsZXRlLWJ1dHRvblxcXCJcXG4gICAgICAgICAgZGF0YS1pdGVtaWQ9XFxcInt7aXRlbWlkfX1cXFwiXFxuICAgICAgICA+XFxuICAgICAgICAgIHt7dHJhbnNsYXRlLm1hcmtldC5hdWN0aW9ucy5kZWxldGV9fVxcbiAgICAgICAgPC9kaXY+XFxuICAgICAgPC9kaXY+XFxuICAgIDwvbGk+XFxuICAgIHt7L3B1cmNoYXNlc319XFxuICA8L3VsPlxcbjwvZGl2PlxcblxcbjwhLS0gU2FsZXMgLS0+XFxuPGRpdiBjbGFzcz1cXFwibWFya2V0cGxhY2UtYWJzdHJhY3RcXFwiIGlkPVxcXCJzYWxlLWhpc3RvcnlcXFwiPlxcbiAgPGgyIGNsYXNzPVxcXCJzZWN0aW9uLXN1YnRpdGxlXFxcIj57e3RyYW5zbGF0ZS5tYXJrZXQuYXVjdGlvbnMuc2FsZXNfaGlzdG9yeX19PC9oMj5cXG5cXG4gIDx1bD5cXG4gICAge3sjc2FsZXN9fVxcbiAgICA8bGkgY2xhc3M9XFxcIm1hcmtldHBsYWNlLWFic3RyYWN0IG1hcmtldHBsYWNlLXNhbGVzLWl0ZW1cXFwiPlxcbiAgICAgIDwhLS0gSWNvbiAtLT5cXG4gICAgICA8ZGl2IGNsYXNzPVxcXCJhYnN0cmFjdC1pY29uXFxcIj5cXG4gICAgICAgIDxpbWcgc3JjPVxcXCJ7e2ljb259fVxcXCIgLz5cXG4gICAgICA8L2Rpdj5cXG5cXG4gICAgICA8IS0tIFByaWNlcyAtLT5cXG4gICAgICA8ZGl2IGNsYXNzPVxcXCJhYnN0cmFjdC1jb250YWluZXJcXFwiPlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiYWJzdHJhY3QtbmFtZVxcXCI+e3tuYW1lfX08L2Rpdj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImFic3RyYWN0LWNvbnRlbnRcXFwiPlxcbiAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJhYnN0cmFjdC1jdXJyZW50UHJpY2VcXFwiPlxcbiAgICAgICAgICAgIHt7I2N1cnJlbnRQcmljZX19IHt7dHJhbnNsYXRlLm1hcmtldC5hdWN0aW9ucy5jdXJyZW50X3ByaWNlfX1cXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwicHJpY2UtaXRlbVxcXCI+e3tjdXJyZW50UHJpY2V9fTwvc3Bhbj5cXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwibWFhbmEtaWNvblxcXCI+PC9zcGFuPlxcbiAgICAgICAgICAgIHt7L2N1cnJlbnRQcmljZX19XFxuICAgICAgICAgICAgPGJyIC8+XFxuICAgICAgICAgICAge3sjYnV5Tm93UHJpY2V9fSB7e3RyYW5zbGF0ZS5tYXJrZXQuYXVjdGlvbnMuYnV5X25vd19wcmljZX19XFxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XFxcInByaWNlLWl0ZW1cXFwiPnt7YnV5Tm93UHJpY2V9fTwvc3Bhbj5cXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwibWFhbmEtaWNvblxcXCI+PC9zcGFuPlxcbiAgICAgICAgICAgIHt7L2J1eU5vd1ByaWNlfX1cXG4gICAgICAgICAgPC9kaXY+XFxuICAgICAgICA8L2Rpdj5cXG4gICAgICA8L2Rpdj5cXG5cXG4gICAgICA8IS0tIEFjdGlvbnMgLS0+XFxuICAgICAgPGRpdiBjbGFzcz1cXFwiYWJzdHJhY3QtYWN0aW9uc1xcXCI+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJhYnN0cmFjdC10aW1lXFxcIj57e2RhdGV9fTwvZGl2PlxcbiAgICAgICAgPGRpdlxcbiAgICAgICAgICBjbGFzcz1cXFwibmwtYnV0dG9uIG5sLWJ1dHRvbi1zbSBtYXJrZXRwbGFjZS1pdGVtRGV0YWlsLWNhbmNlbCBkZWxldGUtYnV0dG9uXFxcIlxcbiAgICAgICAgPlxcbiAgICAgICAgICB7e3RyYW5zbGF0ZS5tYXJrZXQuYXVjdGlvbnMuZGVsZXRlfX1cXG4gICAgICAgIDwvZGl2PlxcbiAgICAgIDwvZGl2PlxcbiAgICA8L2xpPlxcbiAgICB7ey9zYWxlc319XFxuICA8L3VsPlxcbjwvZGl2PlxcblwiLCBIKTtyZXR1cm4gVDsgfSgpOyIsInZhciBIID0gcmVxdWlyZShcImhvZ2FuLmpzXCIpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHsgdmFyIFQgPSBuZXcgSC5UZW1wbGF0ZSh7Y29kZTogZnVuY3Rpb24gKGMscCxpKSB7IHZhciB0PXRoaXM7dC5iKGk9aXx8XCJcIik7dC5iKFwiPGFcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIGlkPVxcXCJtYXNzLW1hcmtcXFwiXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICBjbGFzcz1cXFwibmwtYnV0dG9uXFxcIlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgc3R5bGU9XFxcIm1hcmdpbi1yaWdodDogMC42ZW07IG1hcmdpbi10b3A6IDAuNmVtXFxcIlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIj5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIDxpbWcgc3JjPVxcXCJcIik7dC5iKHQudih0LmYoXCJzcmNcIixjLHAsMCkpKTt0LmIoXCJcXFwiIGhlaWdodD1cXFwiMjBweFxcXCIgc3R5bGU9XFxcIm1hcmdpbjogLTVweCAwcHhcXFwiIC8+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICBcIik7dC5iKHQudih0LmYoXCJ0ZXh0Q29udGVudFwiLGMscCwwKSkpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiPC9hPlwiKTt0LmIoXCJcXG5cIik7cmV0dXJuIHQuZmwoKTsgfSxwYXJ0aWFsczoge30sIHN1YnM6IHsgIH19LCBcIjxhXFxuICBpZD1cXFwibWFzcy1tYXJrXFxcIlxcbiAgY2xhc3M9XFxcIm5sLWJ1dHRvblxcXCJcXG4gIHN0eWxlPVxcXCJtYXJnaW4tcmlnaHQ6IDAuNmVtOyBtYXJnaW4tdG9wOiAwLjZlbVxcXCJcXG4+XFxuICA8aW1nIHNyYz1cXFwie3tzcmN9fVxcXCIgaGVpZ2h0PVxcXCIyMHB4XFxcIiBzdHlsZT1cXFwibWFyZ2luOiAtNXB4IDBweFxcXCIgLz5cXG4gIHt7dGV4dENvbnRlbnR9fVxcbjwvYT5cXG5cIiwgSCk7cmV0dXJuIFQ7IH0oKTsiLCJ2YXIgSCA9IHJlcXVpcmUoXCJob2dhbi5qc1wiKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7IHZhciBUID0gbmV3IEguVGVtcGxhdGUoe2NvZGU6IGZ1bmN0aW9uIChjLHAsaSkgeyB2YXIgdD10aGlzO3QuYihpPWl8fFwiXCIpO3QuYihcIjxkaXYgaWQ9XFxcImVlLW91dGZpdC10aHVtYnNcXFwiPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgPHN0eWxlPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAjYXBwZWFyYW5jZS1pdGVtcy1jYXRlZ29yeS1mYXZvcml0ZXMgLnNsb3QuZWUtYXZhaWxhYmxlLXNsb3Qge1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIGJhY2tncm91bmQtaW1hZ2U6IHVybChodHRwczovL2dpdGxhYi5jb20vTmF0b0JvcmFtL2VsZGFyeWEtZW5oYW5jZW1lbnRzLy0vcmF3L21hc3Rlci9pbWFnZXMvYXZhaWxhYmxlLWZhdm9yaXRlLnBuZyk7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgYmFja2dyb3VuZC1wb3NpdGlvbjogLTE0cHggLTExcHg7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgYmFja2dyb3VuZC1zaXplOiAxNzFweCAyNDRweDtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICBib3JkZXItcmFkaXVzOiA0NHB4O1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIGJveC1zaGFkb3c6IDAgMCA0cHggNHB4IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC44KTtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgfVwiKTt0LmIoXCJcXG5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgI2FwcGVhcmFuY2UtaXRlbXMtY2F0ZWdvcnktZmF2b3JpdGVzIC5zbG90LmVlLWF2YWlsYWJsZS1zbG90OjphZnRlciB7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgYmFja2dyb3VuZDogdXJsKC9zdGF0aWMvaW1nL25ldy1sYXlvdXQvd2FyZHJvYmUvaWNvbi1wbHVzLnBuZyk7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgY29udGVudDogXFxcIiBcXFwiO1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIGZpbHRlcjogZHJvcC1zaGFkb3coMCAwIDZweCByZ2JhKDIzNywgMTIsIDI0NSwgMC45KSk7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgaGVpZ2h0OiA3MXB4O1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIGxlZnQ6IDUwJTtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICBvcGFjaXR5OiAwO1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICB0b3A6IDUwJTtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICB0cmFuc2l0aW9uOiBvcGFjaXR5IGVhc2UtaW4tb3V0IDEwMG1zO1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIHdpZHRoOiA2NnB4O1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICB9XCIpO3QuYihcIlxcblwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAjYXBwZWFyYW5jZS1pdGVtcy1jYXRlZ29yeS1mYXZvcml0ZXMgLnNsb3QuZWUtYXZhaWxhYmxlLXNsb3Q6aG92ZXI6OmFmdGVyLFwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAjYXBwZWFyYW5jZS1pdGVtcy1jYXRlZ29yeS1mYXZvcml0ZXMgLnNsb3QuZWUtb3V0Zml0LXRodW1iOmhvdmVyIHAge1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIG9wYWNpdHk6IDE7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgIH1cIik7dC5iKFwiXFxuXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICNhcHBlYXJhbmNlLWl0ZW1zLWNhdGVnb3J5LWZhdm9yaXRlcyAuc2xvdC5lZS1vdXRmaXQtdGh1bWIgaW1nIHtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICBib3JkZXItcmFkaXVzOiA0NHB4O1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIGhlaWdodDogMTAwJTtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICB3aWR0aDogMTAwJTtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgfVwiKTt0LmIoXCJcXG5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgI2FwcGVhcmFuY2UtaXRlbXMtY2F0ZWdvcnktZmF2b3JpdGVzIC5zbG90LmVlLW91dGZpdC10aHVtYiBwIHtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDAsIDAsIDAsIDAuNSk7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgY29sb3I6ICNmZmY7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgZm9udC1mYW1pbHk6IFxcXCJBbGVncmV5YSBTYW5zIFNDXFxcIiwgc2Fucy1zZXJpZjtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICBmb250LXNpemU6IDIycHg7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICBsZWZ0OiA1MCU7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgbGluZS1oZWlnaHQ6IDIycHg7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgb3BhY2l0eTogMDtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICBwYWRkaW5nOiAxMnB4IDA7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgcG9zaXRpb246IGFic29sdXRlO1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICB0b3A6IDUwJTtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICB0cmFuc2l0aW9uOiBvcGFjaXR5IGVhc2UtaW4tb3V0IDQwMG1zO1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIHdpZHRoOiAxMDAlO1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICB9XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICA8L3N0eWxlPlwiKTt0LmIoXCJcXG5cIik7dC5iKFwiXFxuXCIgKyBpKTtpZih0LnModC5mKFwib3V0Zml0c1wiLGMscCwxKSxjLHAsMCwxNjU0LDE3OTAsXCJ7eyB9fVwiKSl7dC5ycyhjLHAsZnVuY3Rpb24oYyxwLHQpe3QuYihcIiAgPGRpdiBjbGFzcz1cXFwic2xvdCBlZS1vdXRmaXQtdGh1bWJcXFwiIGRhdGEtYXJyYXktaW5kZXg9XFxcIlwiKTt0LmIodC52KHQuZihcImlkXCIsYyxwLDApKSk7dC5iKFwiXFxcIj5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgPGltZyBhbHQ9XFxcIlwiKTt0LmIodC52KHQuZihcIm5hbWVcIixjLHAsMCkpKTt0LmIoXCJcXFwiIHNyYz1cXFwiXCIpO3QuYih0LnYodC5mKFwidXJsXCIsYyxwLDApKSk7dC5iKFwiXFxcIiAvPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICA8cD5cIik7dC5iKHQudih0LmYoXCJuYW1lXCIsYyxwLDApKSk7dC5iKFwiPC9wPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgPC9kaXY+XCIpO3QuYihcIlxcblwiICsgaSk7fSk7Yy5wb3AoKTt9dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIDxkaXYgY2xhc3M9XFxcInNsb3QgZWUtYXZhaWxhYmxlLXNsb3RcXFwiPjwvZGl2PlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIjwvZGl2PlwiKTt0LmIoXCJcXG5cIik7cmV0dXJuIHQuZmwoKTsgfSxwYXJ0aWFsczoge30sIHN1YnM6IHsgIH19LCBcIjxkaXYgaWQ9XFxcImVlLW91dGZpdC10aHVtYnNcXFwiPlxcbiAgPHN0eWxlPlxcbiAgICAjYXBwZWFyYW5jZS1pdGVtcy1jYXRlZ29yeS1mYXZvcml0ZXMgLnNsb3QuZWUtYXZhaWxhYmxlLXNsb3Qge1xcbiAgICAgIGJhY2tncm91bmQtaW1hZ2U6IHVybChodHRwczovL2dpdGxhYi5jb20vTmF0b0JvcmFtL2VsZGFyeWEtZW5oYW5jZW1lbnRzLy0vcmF3L21hc3Rlci9pbWFnZXMvYXZhaWxhYmxlLWZhdm9yaXRlLnBuZyk7XFxuICAgICAgYmFja2dyb3VuZC1wb3NpdGlvbjogLTE0cHggLTExcHg7XFxuICAgICAgYmFja2dyb3VuZC1zaXplOiAxNzFweCAyNDRweDtcXG4gICAgICBib3JkZXItcmFkaXVzOiA0NHB4O1xcbiAgICAgIGJveC1zaGFkb3c6IDAgMCA0cHggNHB4IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC44KTtcXG4gICAgfVxcblxcbiAgICAjYXBwZWFyYW5jZS1pdGVtcy1jYXRlZ29yeS1mYXZvcml0ZXMgLnNsb3QuZWUtYXZhaWxhYmxlLXNsb3Q6OmFmdGVyIHtcXG4gICAgICBiYWNrZ3JvdW5kOiB1cmwoL3N0YXRpYy9pbWcvbmV3LWxheW91dC93YXJkcm9iZS9pY29uLXBsdXMucG5nKTtcXG4gICAgICBjb250ZW50OiBcXFwiIFxcXCI7XFxuICAgICAgZmlsdGVyOiBkcm9wLXNoYWRvdygwIDAgNnB4IHJnYmEoMjM3LCAxMiwgMjQ1LCAwLjkpKTtcXG4gICAgICBoZWlnaHQ6IDcxcHg7XFxuICAgICAgbGVmdDogNTAlO1xcbiAgICAgIG9wYWNpdHk6IDA7XFxuICAgICAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgICAgIHRvcDogNTAlO1xcbiAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xcbiAgICAgIHRyYW5zaXRpb246IG9wYWNpdHkgZWFzZS1pbi1vdXQgMTAwbXM7XFxuICAgICAgd2lkdGg6IDY2cHg7XFxuICAgIH1cXG5cXG4gICAgI2FwcGVhcmFuY2UtaXRlbXMtY2F0ZWdvcnktZmF2b3JpdGVzIC5zbG90LmVlLWF2YWlsYWJsZS1zbG90OmhvdmVyOjphZnRlcixcXG4gICAgI2FwcGVhcmFuY2UtaXRlbXMtY2F0ZWdvcnktZmF2b3JpdGVzIC5zbG90LmVlLW91dGZpdC10aHVtYjpob3ZlciBwIHtcXG4gICAgICBvcGFjaXR5OiAxO1xcbiAgICB9XFxuXFxuICAgICNhcHBlYXJhbmNlLWl0ZW1zLWNhdGVnb3J5LWZhdm9yaXRlcyAuc2xvdC5lZS1vdXRmaXQtdGh1bWIgaW1nIHtcXG4gICAgICBib3JkZXItcmFkaXVzOiA0NHB4O1xcbiAgICAgIGhlaWdodDogMTAwJTtcXG4gICAgICB3aWR0aDogMTAwJTtcXG4gICAgfVxcblxcbiAgICAjYXBwZWFyYW5jZS1pdGVtcy1jYXRlZ29yeS1mYXZvcml0ZXMgLnNsb3QuZWUtb3V0Zml0LXRodW1iIHAge1xcbiAgICAgIGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMC41KTtcXG4gICAgICBjb2xvcjogI2ZmZjtcXG4gICAgICBmb250LWZhbWlseTogXFxcIkFsZWdyZXlhIFNhbnMgU0NcXFwiLCBzYW5zLXNlcmlmO1xcbiAgICAgIGZvbnQtc2l6ZTogMjJweDtcXG4gICAgICBmb250LXdlaWdodDogNzAwO1xcbiAgICAgIGxlZnQ6IDUwJTtcXG4gICAgICBsaW5lLWhlaWdodDogMjJweDtcXG4gICAgICBvcGFjaXR5OiAwO1xcbiAgICAgIHBhZGRpbmc6IDEycHggMDtcXG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgICAgIHRvcDogNTAlO1xcbiAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xcbiAgICAgIHRyYW5zaXRpb246IG9wYWNpdHkgZWFzZS1pbi1vdXQgNDAwbXM7XFxuICAgICAgd2lkdGg6IDEwMCU7XFxuICAgIH1cXG4gIDwvc3R5bGU+XFxuXFxuICB7eyNvdXRmaXRzfX1cXG4gIDxkaXYgY2xhc3M9XFxcInNsb3QgZWUtb3V0Zml0LXRodW1iXFxcIiBkYXRhLWFycmF5LWluZGV4PVxcXCJ7e2lkfX1cXFwiPlxcbiAgICA8aW1nIGFsdD1cXFwie3tuYW1lfX1cXFwiIHNyYz1cXFwie3t1cmx9fVxcXCIgLz5cXG4gICAgPHA+e3tuYW1lfX08L3A+XFxuICA8L2Rpdj5cXG4gIHt7L291dGZpdHN9fVxcblxcbiAgPGRpdiBjbGFzcz1cXFwic2xvdCBlZS1hdmFpbGFibGUtc2xvdFxcXCI+PC9kaXY+XFxuPC9kaXY+XFxuXCIsIEgpO3JldHVybiBUOyB9KCk7IiwidmFyIEggPSByZXF1aXJlKFwiaG9nYW4uanNcIik7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkgeyB2YXIgVCA9IG5ldyBILlRlbXBsYXRlKHtjb2RlOiBmdW5jdGlvbiAoYyxwLGkpIHsgdmFyIHQ9dGhpczt0LmIoaT1pfHxcIlwiKTt0LmIoXCI8bGkgaWQ9XFxcIlwiKTt0LmIodC52KHQuZihcImlkXCIsYyxwLDApKSk7dC5iKFwiXFxcIiBjbGFzcz1cXFwicHJvZmlsZS1jb250YWN0LWFjdGlvbi1lZVxcXCI+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICA8c3BhbiBjbGFzcz1cXFwibmwtYnV0dG9uIG5sLWJ1dHRvbi1zbVxcXCI+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgIDxkaXYgY2xhc3M9XFxcImFjdGlvbi1kZXNjcmlwdGlvblxcXCI+XCIpO3QuYih0LnYodC5mKFwiYWN0aW9uRGVzY3JpcHRpb25cIixjLHAsMCkpKTt0LmIoXCI8L2Rpdj5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIDwvc3Bhbj5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCI8L2xpPlwiKTt0LmIoXCJcXG5cIik7cmV0dXJuIHQuZmwoKTsgfSxwYXJ0aWFsczoge30sIHN1YnM6IHsgIH19LCBcIjxsaSBpZD1cXFwie3tpZH19XFxcIiBjbGFzcz1cXFwicHJvZmlsZS1jb250YWN0LWFjdGlvbi1lZVxcXCI+XFxuICA8c3BhbiBjbGFzcz1cXFwibmwtYnV0dG9uIG5sLWJ1dHRvbi1zbVxcXCI+XFxuICAgIDxkaXYgY2xhc3M9XFxcImFjdGlvbi1kZXNjcmlwdGlvblxcXCI+e3thY3Rpb25EZXNjcmlwdGlvbn19PC9kaXY+XFxuICA8L3NwYW4+XFxuPC9saT5cXG5cIiwgSCk7cmV0dXJuIFQ7IH0oKTsiLCJ2YXIgSCA9IHJlcXVpcmUoXCJob2dhbi5qc1wiKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7IHZhciBUID0gbmV3IEguVGVtcGxhdGUoe2NvZGU6IGZ1bmN0aW9uIChjLHAsaSkgeyB2YXIgdD10aGlzO3QuYihpPWl8fFwiXCIpO3QuYihcIjxzdHlsZT5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIC5jcmVhdGVkLW91dGZpdC1wb3B1cCAuZmxhdnItb3V0ZXIgLmZsYXZyLW1lc3NhZ2U6OmFmdGVyIHtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgYmFja2dyb3VuZC1pbWFnZTogdXJsKFwiKTt0LmIodC52KHQuZihcInVybFwiLGMscCwwKSkpO3QuYihcIik7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgIGJhY2tncm91bmQtc2l6ZTogY29udGFpbjtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIH1cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCI8L3N0eWxlPlwiKTt0LmIoXCJcXG5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCI8aDE+XCIpO3QuYih0LnQodC5mKFwidGl0bGVcIixjLHAsMCkpKTt0LmIoXCI8L2gxPlwiKTt0LmIoXCJcXG5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCI8cD5cIik7dC5iKHQudCh0LmQoXCJ0cmFuc2xhdGUuYXBwZWFyYW5jZS5mYXZvdXJpdGVzLmNsaWNrX291dGZpdC5zYXZlZF9sb2NhbGx5XCIsYyxwLDApKSk7dC5iKFwiPC9wPlwiKTt0LmIoXCJcXG5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCI8YnIgLz5cIik7dC5iKFwiXFxuXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiPHA+XCIpO3QuYih0LnQodC5kKFwidHJhbnNsYXRlLmFwcGVhcmFuY2UuZmF2b3VyaXRlcy5jbGlja19vdXRmaXQuZ290b19hY2NvdW50XCIsYyxwLDApKSk7dC5iKFwiPC9wPlwiKTt0LmIoXCJcXG5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCI8aW5wdXRcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIGlkPVxcXCJjaG9vc2UtbmFtZVxcXCJcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIG1heGxlbmd0aD1cXFwiMzBcXFwiXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICBtaW5sZW5ndGg9XFxcIjFcXFwiXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICBwbGFjZWhvbGRlcj1cXFwiXCIpO3QuYih0LnYodC5mKFwibmFtZVwiLGMscCwwKSkpO3QuYihcIlxcXCJcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIHZhbHVlPVxcXCJcIik7dC5iKHQudih0LmYoXCJuYW1lXCIsYyxwLDApKSk7dC5iKFwiXFxcIlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIi8+XCIpO3QuYihcIlxcblwiKTtyZXR1cm4gdC5mbCgpOyB9LHBhcnRpYWxzOiB7fSwgc3ViczogeyAgfX0sIFwiPHN0eWxlPlxcbiAgLmNyZWF0ZWQtb3V0Zml0LXBvcHVwIC5mbGF2ci1vdXRlciAuZmxhdnItbWVzc2FnZTo6YWZ0ZXIge1xcbiAgICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoe3t1cmx9fSk7XFxuICAgIGJhY2tncm91bmQtc2l6ZTogY29udGFpbjtcXG4gIH1cXG48L3N0eWxlPlxcblxcbjxoMT57e3t0aXRsZX19fTwvaDE+XFxuXFxuPHA+e3t7dHJhbnNsYXRlLmFwcGVhcmFuY2UuZmF2b3VyaXRlcy5jbGlja19vdXRmaXQuc2F2ZWRfbG9jYWxseX19fTwvcD5cXG5cXG48YnIgLz5cXG5cXG48cD57e3t0cmFuc2xhdGUuYXBwZWFyYW5jZS5mYXZvdXJpdGVzLmNsaWNrX291dGZpdC5nb3RvX2FjY291bnR9fX08L3A+XFxuXFxuPGlucHV0XFxuICBpZD1cXFwiY2hvb3NlLW5hbWVcXFwiXFxuICBtYXhsZW5ndGg9XFxcIjMwXFxcIlxcbiAgbWlubGVuZ3RoPVxcXCIxXFxcIlxcbiAgcGxhY2Vob2xkZXI9XFxcInt7bmFtZX19XFxcIlxcbiAgdmFsdWU9XFxcInt7bmFtZX19XFxcIlxcbi8+XFxuXCIsIEgpO3JldHVybiBUOyB9KCk7IiwidmFyIEggPSByZXF1aXJlKFwiaG9nYW4uanNcIik7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkgeyB2YXIgVCA9IG5ldyBILlRlbXBsYXRlKHtjb2RlOiBmdW5jdGlvbiAoYyxwLGkpIHsgdmFyIHQ9dGhpczt0LmIoaT1pfHxcIlwiKTt0LmIoXCI8ZGl2IGNsYXNzPVxcXCJhY2NvdW50LW1pc2MtYmxvYyBhY2NvdW50LWVlLWJsb2MgYmxvY1xcXCI+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICA8IS0tXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICA8c3R5bGU+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgIHRhYmxlIHtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICB3aWR0aDogMTAwJTtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgfVwiKTt0LmIoXCJcXG5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgdGgge1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIHRleHQtYWxpZ246IHN0YXJ0O1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIHBhZGRpbmc6IDFlbTtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgfVwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgPC9zdHlsZT5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIC0tPlwiKTt0LmIoXCJcXG5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIDwhLS0gU2V0dGluZ3MgLS0+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICA8aDIgY2xhc3M9XFxcInNlY3Rpb24tdGl0bGVcXFwiPlwiKTt0LmIodC52KHQuZChcInRyYW5zbGF0ZS5hY2NvdW50LmVuaGFuY2VtZW50c1wiLGMscCwwKSkpO3QuYihcIjwvaDI+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICA8dWwgY2xhc3M9XFxcImFjY291bnQtbWlzYy1hY3Rpb25zXFxcIj5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgPGxpXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgaWQ9XFxcImVlLWRlYnVnLWVuYWJsZWRcXFwiXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgY2xhc3M9XFxcIm5sLWJ1dHRvbiBubC1idXR0b24tc20gXCIpO2lmKHQucyh0LmYoXCJkZWJ1Z1wiLGMscCwxKSxjLHAsMCwzOTIsMzk4LFwie3sgfX1cIikpe3QucnMoYyxwLGZ1bmN0aW9uKGMscCx0KXt0LmIoXCJhY3RpdmVcIik7fSk7Yy5wb3AoKTt9dC5iKFwiXFxcIlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIHRpdGxlPVxcXCJcIik7dC5iKHQudih0LmQoXCJ0cmFuc2xhdGUuYWNjb3VudC5kZWJ1Z190b29sdGlwXCIsYyxwLDApKSk7dC5iKFwiXFxcIlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICA+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgXCIpO3QuYih0LnYodC5kKFwidHJhbnNsYXRlLmFjY291bnQuZGVidWdcIixjLHAsMCkpKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICA8L2xpPlwiKTt0LmIoXCJcXG5cIiArIGkpO2lmKHQucyh0LmYoXCJ1bmxvY2tlZFwiLGMscCwxKSxjLHAsMCw1MjcsMTAzMCxcInt7IH19XCIpKXt0LnJzKGMscCxmdW5jdGlvbihjLHAsdCl7dC5iKFwiICAgIDxsaVwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIGlkPVxcXCJlZS1taW5pZ2FtZXMtZW5hYmxlZFxcXCJcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICBjbGFzcz1cXFwibmwtYnV0dG9uIG5sLWJ1dHRvbi1zbSBcIik7aWYodC5zKHQuZihcIm1pbmlnYW1lc1wiLGMscCwxKSxjLHAsMCw2MTgsNjI0LFwie3sgfX1cIikpe3QucnMoYyxwLGZ1bmN0aW9uKGMscCx0KXt0LmIoXCJhY3RpdmVcIik7fSk7Yy5wb3AoKTt9dC5iKFwiXFxcIlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICA+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgXCIpO3QuYih0LnYodC5kKFwidHJhbnNsYXRlLmFjY291bnQubWluaWdhbWVzXCIsYyxwLDApKSk7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgPC9saT5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgPGxpXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgaWQ9XFxcImVlLWV4cGxvcmF0aW9ucy1lbmFibGVkXFxcIlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIGNsYXNzPVxcXCJubC1idXR0b24gbmwtYnV0dG9uLXNtIFwiKTtpZih0LnModC5mKFwiZXhwbG9yYXRpb25zXCIsYyxwLDEpLGMscCwwLDc5MCw3OTYsXCJ7eyB9fVwiKSl7dC5ycyhjLHAsZnVuY3Rpb24oYyxwLHQpe3QuYihcImFjdGl2ZVwiKTt9KTtjLnBvcCgpO310LmIoXCJcXFwiXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgID5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICBcIik7dC5iKHQudih0LmQoXCJ0cmFuc2xhdGUuYWNjb3VudC5leHBsb3JhdGlvbnNcIixjLHAsMCkpKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICA8L2xpPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICA8bGlcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICBpZD1cXFwiZWUtbWFya2V0LWVuYWJsZWRcXFwiXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgY2xhc3M9XFxcIm5sLWJ1dHRvbiBubC1idXR0b24tc20gXCIpO2lmKHQucyh0LmYoXCJtYXJrZXRcIixjLHAsMSksYyxwLDAsOTU2LDk2MixcInt7IH19XCIpKXt0LnJzKGMscCxmdW5jdGlvbihjLHAsdCl7dC5iKFwiYWN0aXZlXCIpO30pO2MucG9wKCk7fXQuYihcIlxcXCJcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIFwiKTt0LmIodC52KHQuZChcInRyYW5zbGF0ZS5hY2NvdW50Lm1hcmtldFwiLGMscCwwKSkpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgIDwvbGk+XCIpO3QuYihcIlxcblwiICsgaSk7fSk7Yy5wb3AoKTt9dC5iKFwiICAgIDxsaSBpZD1cXFwiZWUtaW1wb3J0XFxcIiBjbGFzcz1cXFwibmwtYnV0dG9uIG5sLWJ1dHRvbi1zbVxcXCI+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgXCIpO3QuYih0LnYodC5kKFwidHJhbnNsYXRlLmFjY291bnQuaW1wb3J0XCIsYyxwLDApKSk7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgPC9saT5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgPGxpIGlkPVxcXCJlZS1leHBvcnRcXFwiIGNsYXNzPVxcXCJubC1idXR0b24gbmwtYnV0dG9uLXNtXFxcIj5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICBcIik7dC5iKHQudih0LmQoXCJ0cmFuc2xhdGUuYWNjb3VudC5leHBvcnRcIixjLHAsMCkpKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICA8L2xpPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICA8bGkgaWQ9XFxcImVlLWRlbGV0ZS1leHBsb3JhdGlvbnNcXFwiIGNsYXNzPVxcXCJubC1idXR0b24gbmwtYnV0dG9uLXNtXFxcIj5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICBcIik7dC5iKHQudih0LmQoXCJ0cmFuc2xhdGUuYWNjb3VudC5kZWxldGVfZXhwbG9yYXRpb25zXCIsYyxwLDApKSk7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgPC9saT5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgPGxpIGlkPVxcXCJlZS1yZXNldFxcXCIgY2xhc3M9XFxcIm5sLWJ1dHRvbiBubC1idXR0b24tc21cXFwiPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIFwiKTt0LmIodC52KHQuZChcInRyYW5zbGF0ZS5hY2NvdW50LnJlc2V0XCIsYyxwLDApKSk7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgPC9saT5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIDwvdWw+XCIpO3QuYihcIlxcblwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgPCEtLSBFeHBsb3JhdGlvbnNcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIDxoMyBjbGFzcz1cXFwic2VjdGlvbi10aXRsZVxcXCI+RXhwbG9yYXRpb25zPC9oMz5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIDx0YWJsZT5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgPHRoZWFkPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIDx0aD5Mb2NhdGlvbjwvdGg+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgPHRoPkRlbGV0ZTwvdGg+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgIDwvdGhlYWQ+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgIDx0Ym9keT5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICA8dGQ+Um9jazwvdGQ+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgPHRkPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgICAgPGRpdiBjbGFzcz1cXFwibmwtYnV0dG9uIG5sLWJ1dHRvbi1zbVxcXCI+RGVsZXRlPC9kaXY+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgPC90ZD5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgPC90Ym9keT5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIDwvdGFibGU+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAtLT5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCI8L2Rpdj5cIik7dC5iKFwiXFxuXCIpO3JldHVybiB0LmZsKCk7IH0scGFydGlhbHM6IHt9LCBzdWJzOiB7ICB9fSwgXCI8ZGl2IGNsYXNzPVxcXCJhY2NvdW50LW1pc2MtYmxvYyBhY2NvdW50LWVlLWJsb2MgYmxvY1xcXCI+XFxuICA8IS0tXFxuICA8c3R5bGU+XFxuICAgIHRhYmxlIHtcXG4gICAgICB3aWR0aDogMTAwJTtcXG4gICAgfVxcblxcbiAgICB0aCB7XFxuICAgICAgdGV4dC1hbGlnbjogc3RhcnQ7XFxuICAgICAgcGFkZGluZzogMWVtO1xcbiAgICB9XFxuICA8L3N0eWxlPlxcbiAgLS0+XFxuXFxuICA8IS0tIFNldHRpbmdzIC0tPlxcbiAgPGgyIGNsYXNzPVxcXCJzZWN0aW9uLXRpdGxlXFxcIj57e3RyYW5zbGF0ZS5hY2NvdW50LmVuaGFuY2VtZW50c319PC9oMj5cXG4gIDx1bCBjbGFzcz1cXFwiYWNjb3VudC1taXNjLWFjdGlvbnNcXFwiPlxcbiAgICA8bGlcXG4gICAgICBpZD1cXFwiZWUtZGVidWctZW5hYmxlZFxcXCJcXG4gICAgICBjbGFzcz1cXFwibmwtYnV0dG9uIG5sLWJ1dHRvbi1zbSB7eyNkZWJ1Z319YWN0aXZle3svZGVidWd9fVxcXCJcXG4gICAgICB0aXRsZT1cXFwie3t0cmFuc2xhdGUuYWNjb3VudC5kZWJ1Z190b29sdGlwfX1cXFwiXFxuICAgID5cXG4gICAgICB7e3RyYW5zbGF0ZS5hY2NvdW50LmRlYnVnfX1cXG4gICAgPC9saT5cXG4gICAge3sjdW5sb2NrZWR9fVxcbiAgICA8bGlcXG4gICAgICBpZD1cXFwiZWUtbWluaWdhbWVzLWVuYWJsZWRcXFwiXFxuICAgICAgY2xhc3M9XFxcIm5sLWJ1dHRvbiBubC1idXR0b24tc20ge3sjbWluaWdhbWVzfX1hY3RpdmV7ey9taW5pZ2FtZXN9fVxcXCJcXG4gICAgPlxcbiAgICAgIHt7dHJhbnNsYXRlLmFjY291bnQubWluaWdhbWVzfX1cXG4gICAgPC9saT5cXG4gICAgPGxpXFxuICAgICAgaWQ9XFxcImVlLWV4cGxvcmF0aW9ucy1lbmFibGVkXFxcIlxcbiAgICAgIGNsYXNzPVxcXCJubC1idXR0b24gbmwtYnV0dG9uLXNtIHt7I2V4cGxvcmF0aW9uc319YWN0aXZle3svZXhwbG9yYXRpb25zfX1cXFwiXFxuICAgID5cXG4gICAgICB7e3RyYW5zbGF0ZS5hY2NvdW50LmV4cGxvcmF0aW9uc319XFxuICAgIDwvbGk+XFxuICAgIDxsaVxcbiAgICAgIGlkPVxcXCJlZS1tYXJrZXQtZW5hYmxlZFxcXCJcXG4gICAgICBjbGFzcz1cXFwibmwtYnV0dG9uIG5sLWJ1dHRvbi1zbSB7eyNtYXJrZXR9fWFjdGl2ZXt7L21hcmtldH19XFxcIlxcbiAgICA+XFxuICAgICAge3t0cmFuc2xhdGUuYWNjb3VudC5tYXJrZXR9fVxcbiAgICA8L2xpPlxcbiAgICB7ey91bmxvY2tlZH19XFxuICAgIDxsaSBpZD1cXFwiZWUtaW1wb3J0XFxcIiBjbGFzcz1cXFwibmwtYnV0dG9uIG5sLWJ1dHRvbi1zbVxcXCI+XFxuICAgICAge3t0cmFuc2xhdGUuYWNjb3VudC5pbXBvcnR9fVxcbiAgICA8L2xpPlxcbiAgICA8bGkgaWQ9XFxcImVlLWV4cG9ydFxcXCIgY2xhc3M9XFxcIm5sLWJ1dHRvbiBubC1idXR0b24tc21cXFwiPlxcbiAgICAgIHt7dHJhbnNsYXRlLmFjY291bnQuZXhwb3J0fX1cXG4gICAgPC9saT5cXG4gICAgPGxpIGlkPVxcXCJlZS1kZWxldGUtZXhwbG9yYXRpb25zXFxcIiBjbGFzcz1cXFwibmwtYnV0dG9uIG5sLWJ1dHRvbi1zbVxcXCI+XFxuICAgICAge3t0cmFuc2xhdGUuYWNjb3VudC5kZWxldGVfZXhwbG9yYXRpb25zfX1cXG4gICAgPC9saT5cXG4gICAgPGxpIGlkPVxcXCJlZS1yZXNldFxcXCIgY2xhc3M9XFxcIm5sLWJ1dHRvbiBubC1idXR0b24tc21cXFwiPlxcbiAgICAgIHt7dHJhbnNsYXRlLmFjY291bnQucmVzZXR9fVxcbiAgICA8L2xpPlxcbiAgPC91bD5cXG5cXG4gIDwhLS0gRXhwbG9yYXRpb25zXFxuICA8aDMgY2xhc3M9XFxcInNlY3Rpb24tdGl0bGVcXFwiPkV4cGxvcmF0aW9uczwvaDM+XFxuICA8dGFibGU+XFxuICAgIDx0aGVhZD5cXG4gICAgICA8dGg+TG9jYXRpb248L3RoPlxcbiAgICAgIDx0aD5EZWxldGU8L3RoPlxcbiAgICA8L3RoZWFkPlxcbiAgICA8dGJvZHk+XFxuICAgICAgPHRkPlJvY2s8L3RkPlxcbiAgICAgIDx0ZD5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcIm5sLWJ1dHRvbiBubC1idXR0b24tc21cXFwiPkRlbGV0ZTwvZGl2PlxcbiAgICAgIDwvdGQ+XFxuICAgIDwvdGJvZHk+XFxuICA8L3RhYmxlPlxcbiAgLS0+XFxuPC9kaXY+XFxuXCIsIEgpO3JldHVybiBUOyB9KCk7IiwidmFyIEggPSByZXF1aXJlKFwiaG9nYW4uanNcIik7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkgeyB2YXIgVCA9IG5ldyBILlRlbXBsYXRlKHtjb2RlOiBmdW5jdGlvbiAoYyxwLGkpIHsgdmFyIHQ9dGhpczt0LmIoaT1pfHxcIlwiKTt0LmIoXCI8YSBpZD1cXFwid2lzaGxpc3QtYnV0dG9uXFxcIiBjbGFzcz1cXFwibmwtYnV0dG9uXFxcIj5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIFwiKTt0LmIodC52KHQuZChcInRyYW5zbGF0ZS5tYXJrZXQud2lzaGxpc3QudGl0bGVcIixjLHAsMCkpKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIjwvYT5cIik7dC5iKFwiXFxuXCIpO3JldHVybiB0LmZsKCk7IH0scGFydGlhbHM6IHt9LCBzdWJzOiB7ICB9fSwgXCI8YSBpZD1cXFwid2lzaGxpc3QtYnV0dG9uXFxcIiBjbGFzcz1cXFwibmwtYnV0dG9uXFxcIj5cXG4gIHt7dHJhbnNsYXRlLm1hcmtldC53aXNobGlzdC50aXRsZX19XFxuPC9hPlxcblwiLCBIKTtyZXR1cm4gVDsgfSgpOyIsInZhciBIID0gcmVxdWlyZShcImhvZ2FuLmpzXCIpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHsgdmFyIFQgPSBuZXcgSC5UZW1wbGF0ZSh7Y29kZTogZnVuY3Rpb24gKGMscCxpKSB7IHZhciB0PXRoaXM7dC5iKGk9aXx8XCJcIik7dC5iKFwiPHN0eWxlPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgLnJlc2V0LWFsbCB7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgIG1hcmdpbi1ib3R0b206IDFlbTtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIH1cIik7dC5iKFwiXFxuXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICB0YWJsZSB7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgIHRleHQtYWxpZ246IGNlbnRlcjtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgd2lkdGg6IDEwMCU7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICB9XCIpO3QuYihcIlxcblwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgLnRleHQtcGFkZGluZyB7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgIHBhZGRpbmc6IDAuMjVlbTtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIH1cIik7dC5iKFwiXFxuXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAuYWN0aW9uLXBpY3RvIHtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgaGVpZ2h0OiA1MHB4O1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICB3aWR0aDogNTBweDtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgY3Vyc29yOiBwb2ludGVyO1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgfVwiKTt0LmIoXCJcXG5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIC5hY3Rpb24tcGljdG86aG92ZXI6bm90KC5kaXNhYmxlZCksXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAuZWRpdC1wcmljZTpob3ZlciB7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgIGFuaW1hdGlvbjogYnV0dG9uLWJvdW5jZSAzMDBtcyBsaW5lYXIgZm9yd2FyZHM7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgIGZpbHRlcjogYnJpZ2h0bmVzcygxLjA1KSBjb250cmFzdCgxLjEpO1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgfVwiKTt0LmIoXCJcXG5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIC5yb3cge1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICBkaXNwbGF5OiBmbGV4O1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIH1cIik7dC5iKFwiXFxuXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAuZWRpdC1wcmljZSB7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgIGN1cnNvcjogcG9pbnRlcjtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIH1cIik7dC5iKFwiXFxuXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICBpbWcuZGlzYWJsZWQge1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICBmaWx0ZXI6IGdyYXlzY2FsZSgxKTtcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIH1cIik7dC5iKFwiXFxuXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAuaXRlbS1pY29uLWNvbnRhaW5lciB7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgcG9zaXRpb246IHJlbGF0aXZlO1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgfVwiKTt0LmIoXCJcXG5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIC5pdGVtLWljb24ge1wiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICB3aWR0aDogMTAwcHg7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgIGhlaWdodDogMTAwcHg7XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICB9XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiPC9zdHlsZT5cIik7dC5iKFwiXFxuXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiPGJ1dHRvbiBjbGFzcz1cXFwibmwtYnV0dG9uIHJlc2V0LWFsbFxcXCI+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICBcIik7dC5iKHQudih0LmQoXCJ0cmFuc2xhdGUubWFya2V0Lndpc2hsaXN0LnJlc2V0X2FsbFwiLGMscCwwKSkpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiPC9idXR0b24+XCIpO3QuYihcIlxcblwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIjx0YWJsZT5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIDx0aGVhZD5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgPHRyPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIDx0aD5cIik7dC5iKHQudih0LmQoXCJ0cmFuc2xhdGUubWFya2V0Lndpc2hsaXN0Lmljb25cIixjLHAsMCkpKTt0LmIoXCI8L3RoPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIDx0aD5cIik7dC5iKHQudih0LmQoXCJ0cmFuc2xhdGUubWFya2V0Lndpc2hsaXN0Lm5hbWVcIixjLHAsMCkpKTt0LmIoXCI8L3RoPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIDx0aD5cIik7dC5iKHQudih0LmQoXCJ0cmFuc2xhdGUubWFya2V0Lndpc2hsaXN0LnByaWNlXCIsYyxwLDApKSk7dC5iKFwiPC90aD5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICA8dGg+XCIpO3QuYih0LnYodC5kKFwidHJhbnNsYXRlLm1hcmtldC53aXNobGlzdC5zdGF0dXNcIixjLHAsMCkpKTt0LmIoXCI8L3RoPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIDx0aD5cIik7dC5iKHQudih0LmQoXCJ0cmFuc2xhdGUubWFya2V0Lndpc2hsaXN0LmFjdGlvbnNcIixjLHAsMCkpKTt0LmIoXCI8L3RoPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICA8L3RyPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgPC90aGVhZD5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgIDx0Ym9keT5cIik7dC5iKFwiXFxuXCIgKyBpKTtpZih0LnModC5mKFwid2lzaGxpc3RcIixjLHAsMSksYyxwLDAsMTEzNywyNjU3LFwie3sgfX1cIikpe3QucnMoYyxwLGZ1bmN0aW9uKGMscCx0KXt0LmIoXCIgICAgPHRyIGNsYXNzPVxcXCJtYXJrZXRwbGFjZS1hYnN0cmFjdFxcXCIgZGF0YS1pY29uPVxcXCJcIik7dC5iKHQudih0LmYoXCJpY29uXCIsYyxwLDApKSk7dC5iKFwiXFxcIj5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICA8IS0tIEljb24gLS0+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgPHRkPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgICAgPGRpdiBjbGFzcz1cXFwiaXRlbS1pY29uLWNvbnRhaW5lclxcXCI+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgICAgIDxpbWcgY2xhc3M9XFxcIml0ZW0taWNvblxcXCIgc3JjPVxcXCJcIik7dC5iKHQudih0LmYoXCJpY29uXCIsYyxwLDApKSk7dC5iKFwiXFxcIiBhbHQ9XFxcIlwiKTt0LmIodC52KHQuZihcIm5hbWVcIixjLHAsMCkpKTt0LmIoXCJcXFwiIC8+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInJhcml0eS1tYXJrZXItXCIpO3QuYih0LnYodC5mKFwicmFyaXR5XCIsYyxwLDApKSk7dC5iKFwiXFxcIj48L2Rpdj5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICAgIDwvZGl2PlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIDwvdGQ+XCIpO3QuYihcIlxcblwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIDwhLS0gTmFtZSAtLT5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICA8dGQgY2xhc3M9XFxcInRleHQtcGFkZGluZ1xcXCI+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgICA8ZGl2IGNsYXNzPVxcXCJhYnN0cmFjdC1uYW1lXFxcIj5cIik7dC5iKHQudih0LmYoXCJuYW1lXCIsYyxwLDApKSk7dC5iKFwiPC9kaXY+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgICA8ZGl2IGNsYXNzPVxcXCJhYnN0cmFjdC10eXBlXFxcIj5cIik7dC5iKHQudih0LmYoXCJhYnN0cmFjdFR5cGVcIixjLHAsMCkpKTt0LmIoXCI8L2Rpdj5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICA8L3RkPlwiKTt0LmIoXCJcXG5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICA8IS0tIFByaWNlIC0tPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIDx0ZCBjbGFzcz1cXFwidGV4dC1wYWRkaW5nXFxcIj5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICAgIDxkaXZcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICAgICAgY2xhc3M9XFxcImVkaXQtcHJpY2Ugcm93XFxcIlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgICAgICB0aXRsZT1cXFwiXCIpO3QuYih0LnYodC5kKFwidHJhbnNsYXRlLm1hcmtldC53aXNobGlzdC5jaGFuZ2VfcHJpY2VcIixjLHAsMCkpKTt0LmIoXCJcXFwiXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgICA+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJwcmljZS1pdGVtXFxcIj5cIik7dC5iKHQudih0LmYoXCJwcmljZVwiLGMscCwwKSkpO3QuYihcIjwvc3Bhbj5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICAgICAgPHNwYW4gY2xhc3M9XFxcIm1hYW5hLWljb25cXFwiIGFsdD1cXFwibWFhbmFzXFxcIj48L3NwYW4+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgICA8L2Rpdj5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICA8L3RkPlwiKTt0LmIoXCJcXG5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICA8IS0tIEVycm9yIC0tPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIDx0ZCBjbGFzcz1cXFwidGV4dC1wYWRkaW5nXFxcIj5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICAgIDxwIGNsYXNzPVxcXCJlcnJvclxcXCI+XCIpO3QuYih0LnYodC5mKFwiZXJyb3JcIixjLHAsMCkpKTt0LmIoXCI8L3A+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgPC90ZD5cIik7dC5iKFwiXFxuXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgPCEtLSBBY3Rpb25zIC0tPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgIDx0ZD5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICAgIDxkaXYgY2xhc3M9XFxcInJvd1xcXCI+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgICAgIDxpbWdcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICAgICAgICBjbGFzcz1cXFwiYWN0aW9uLXBpY3RvIHJlc2V0LWl0ZW0tc3RhdHVzIFwiKTtpZighdC5zKHQuZihcImVycm9yXCIsYyxwLDEpLGMscCwxLDAsMCxcIlwiKSl7dC5iKFwiZGlzYWJsZWRcIik7fTt0LmIoXCJcXFwiXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgICAgICAgc3JjPVxcXCIvc3RhdGljL2ltZy9uZXctbGF5b3V0L3dhcmRyb2JlL3Jlc2V0LWJ0bi5wbmdcXFwiXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgICAgICAgdGl0bGU9XFxcIlwiKTt0LmIodC52KHQuZChcInRyYW5zbGF0ZS5tYXJrZXQud2lzaGxpc3QucmVzZXRfdG9vbHRpcFwiLGMscCwwKSkpO3QuYihcIlxcXCJcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICAgICAgICBhbHQ9XFxcIlwiKTt0LmIodC52KHQuZChcInRyYW5zbGF0ZS5tYXJrZXQud2lzaGxpc3QucmVzZXRcIixjLHAsMCkpKTt0LmIoXCJcXFwiXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgICAgIC8+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgICAgIDxpbWdcIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICAgICAgICBjbGFzcz1cXFwiYWN0aW9uLXBpY3RvIGRlbGV0ZS13aXNobGlzdC1pdGVtXFxcIlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgICAgICAgIHNyYz1cXFwiL3N0YXRpYy9pbWcvbmV3LWxheW91dC93YXJkcm9iZS9kZWxldGUucG5nXFxcIlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgICAgICAgIHRpdGxlPVxcXCJcIik7dC5iKHQudih0LmQoXCJ0cmFuc2xhdGUubWFya2V0Lndpc2hsaXN0LmRlbGV0ZV90b29sdGlwXCIsYyxwLDApKSk7dC5iKFwiXFxcIlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICAgICAgICAgIGFsdD1cXFwiXCIpO3QuYih0LnYodC5kKFwidHJhbnNsYXRlLm1hcmtldC53aXNobGlzdC5kZWxldGVcIixjLHAsMCkpKTt0LmIoXCJcXFwiXCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgICAgIC8+XCIpO3QuYihcIlxcblwiICsgaSk7dC5iKFwiICAgICAgICA8L2Rpdj5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCIgICAgICA8L3RkPlwiKTt0LmIoXCJcXG5cIiArIGkpO3QuYihcIiAgICA8L3RyPlwiKTt0LmIoXCJcXG5cIiArIGkpO30pO2MucG9wKCk7fXQuYihcIiAgPC90Ym9keT5cIik7dC5iKFwiXFxuXCIgKyBpKTt0LmIoXCI8L3RhYmxlPlwiKTt0LmIoXCJcXG5cIik7cmV0dXJuIHQuZmwoKTsgfSxwYXJ0aWFsczoge30sIHN1YnM6IHsgIH19LCBcIjxzdHlsZT5cXG4gIC5yZXNldC1hbGwge1xcbiAgICBtYXJnaW4tYm90dG9tOiAxZW07XFxuICB9XFxuXFxuICB0YWJsZSB7XFxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gICAgd2lkdGg6IDEwMCU7XFxuICB9XFxuXFxuICAudGV4dC1wYWRkaW5nIHtcXG4gICAgcGFkZGluZzogMC4yNWVtO1xcbiAgfVxcblxcbiAgLmFjdGlvbi1waWN0byB7XFxuICAgIGhlaWdodDogNTBweDtcXG4gICAgd2lkdGg6IDUwcHg7XFxuICAgIGN1cnNvcjogcG9pbnRlcjtcXG4gIH1cXG5cXG4gIC5hY3Rpb24tcGljdG86aG92ZXI6bm90KC5kaXNhYmxlZCksXFxuICAuZWRpdC1wcmljZTpob3ZlciB7XFxuICAgIGFuaW1hdGlvbjogYnV0dG9uLWJvdW5jZSAzMDBtcyBsaW5lYXIgZm9yd2FyZHM7XFxuICAgIGZpbHRlcjogYnJpZ2h0bmVzcygxLjA1KSBjb250cmFzdCgxLjEpO1xcbiAgfVxcblxcbiAgLnJvdyB7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgfVxcblxcbiAgLmVkaXQtcHJpY2Uge1xcbiAgICBjdXJzb3I6IHBvaW50ZXI7XFxuICB9XFxuXFxuICBpbWcuZGlzYWJsZWQge1xcbiAgICBmaWx0ZXI6IGdyYXlzY2FsZSgxKTtcXG4gIH1cXG5cXG4gIC5pdGVtLWljb24tY29udGFpbmVyIHtcXG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICB9XFxuXFxuICAuaXRlbS1pY29uIHtcXG4gICAgd2lkdGg6IDEwMHB4O1xcbiAgICBoZWlnaHQ6IDEwMHB4O1xcbiAgfVxcbjwvc3R5bGU+XFxuXFxuPGJ1dHRvbiBjbGFzcz1cXFwibmwtYnV0dG9uIHJlc2V0LWFsbFxcXCI+XFxuICB7e3RyYW5zbGF0ZS5tYXJrZXQud2lzaGxpc3QucmVzZXRfYWxsfX1cXG48L2J1dHRvbj5cXG5cXG48dGFibGU+XFxuICA8dGhlYWQ+XFxuICAgIDx0cj5cXG4gICAgICA8dGg+e3t0cmFuc2xhdGUubWFya2V0Lndpc2hsaXN0Lmljb259fTwvdGg+XFxuICAgICAgPHRoPnt7dHJhbnNsYXRlLm1hcmtldC53aXNobGlzdC5uYW1lfX08L3RoPlxcbiAgICAgIDx0aD57e3RyYW5zbGF0ZS5tYXJrZXQud2lzaGxpc3QucHJpY2V9fTwvdGg+XFxuICAgICAgPHRoPnt7dHJhbnNsYXRlLm1hcmtldC53aXNobGlzdC5zdGF0dXN9fTwvdGg+XFxuICAgICAgPHRoPnt7dHJhbnNsYXRlLm1hcmtldC53aXNobGlzdC5hY3Rpb25zfX08L3RoPlxcbiAgICA8L3RyPlxcbiAgPC90aGVhZD5cXG4gIDx0Ym9keT5cXG4gICAge3sjd2lzaGxpc3R9fVxcbiAgICA8dHIgY2xhc3M9XFxcIm1hcmtldHBsYWNlLWFic3RyYWN0XFxcIiBkYXRhLWljb249XFxcInt7aWNvbn19XFxcIj5cXG4gICAgICA8IS0tIEljb24gLS0+XFxuICAgICAgPHRkPlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiaXRlbS1pY29uLWNvbnRhaW5lclxcXCI+XFxuICAgICAgICAgIDxpbWcgY2xhc3M9XFxcIml0ZW0taWNvblxcXCIgc3JjPVxcXCJ7e2ljb259fVxcXCIgYWx0PVxcXCJ7e25hbWV9fVxcXCIgLz5cXG4gICAgICAgICAgPGRpdiBjbGFzcz1cXFwicmFyaXR5LW1hcmtlci17e3Jhcml0eX19XFxcIj48L2Rpdj5cXG4gICAgICAgIDwvZGl2PlxcbiAgICAgIDwvdGQ+XFxuXFxuICAgICAgPCEtLSBOYW1lIC0tPlxcbiAgICAgIDx0ZCBjbGFzcz1cXFwidGV4dC1wYWRkaW5nXFxcIj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImFic3RyYWN0LW5hbWVcXFwiPnt7bmFtZX19PC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJhYnN0cmFjdC10eXBlXFxcIj57e2Fic3RyYWN0VHlwZX19PC9kaXY+XFxuICAgICAgPC90ZD5cXG5cXG4gICAgICA8IS0tIFByaWNlIC0tPlxcbiAgICAgIDx0ZCBjbGFzcz1cXFwidGV4dC1wYWRkaW5nXFxcIj5cXG4gICAgICAgIDxkaXZcXG4gICAgICAgICAgY2xhc3M9XFxcImVkaXQtcHJpY2Ugcm93XFxcIlxcbiAgICAgICAgICB0aXRsZT1cXFwie3t0cmFuc2xhdGUubWFya2V0Lndpc2hsaXN0LmNoYW5nZV9wcmljZX19XFxcIlxcbiAgICAgICAgPlxcbiAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwicHJpY2UtaXRlbVxcXCI+e3twcmljZX19PC9zcGFuPlxcbiAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwibWFhbmEtaWNvblxcXCIgYWx0PVxcXCJtYWFuYXNcXFwiPjwvc3Bhbj5cXG4gICAgICAgIDwvZGl2PlxcbiAgICAgIDwvdGQ+XFxuXFxuICAgICAgPCEtLSBFcnJvciAtLT5cXG4gICAgICA8dGQgY2xhc3M9XFxcInRleHQtcGFkZGluZ1xcXCI+XFxuICAgICAgICA8cCBjbGFzcz1cXFwiZXJyb3JcXFwiPnt7ZXJyb3J9fTwvcD5cXG4gICAgICA8L3RkPlxcblxcbiAgICAgIDwhLS0gQWN0aW9ucyAtLT5cXG4gICAgICA8dGQ+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJyb3dcXFwiPlxcbiAgICAgICAgICA8aW1nXFxuICAgICAgICAgICAgY2xhc3M9XFxcImFjdGlvbi1waWN0byByZXNldC1pdGVtLXN0YXR1cyB7e15lcnJvcn19ZGlzYWJsZWR7ey9lcnJvcn19XFxcIlxcbiAgICAgICAgICAgIHNyYz1cXFwiL3N0YXRpYy9pbWcvbmV3LWxheW91dC93YXJkcm9iZS9yZXNldC1idG4ucG5nXFxcIlxcbiAgICAgICAgICAgIHRpdGxlPVxcXCJ7e3RyYW5zbGF0ZS5tYXJrZXQud2lzaGxpc3QucmVzZXRfdG9vbHRpcH19XFxcIlxcbiAgICAgICAgICAgIGFsdD1cXFwie3t0cmFuc2xhdGUubWFya2V0Lndpc2hsaXN0LnJlc2V0fX1cXFwiXFxuICAgICAgICAgIC8+XFxuICAgICAgICAgIDxpbWdcXG4gICAgICAgICAgICBjbGFzcz1cXFwiYWN0aW9uLXBpY3RvIGRlbGV0ZS13aXNobGlzdC1pdGVtXFxcIlxcbiAgICAgICAgICAgIHNyYz1cXFwiL3N0YXRpYy9pbWcvbmV3LWxheW91dC93YXJkcm9iZS9kZWxldGUucG5nXFxcIlxcbiAgICAgICAgICAgIHRpdGxlPVxcXCJ7e3RyYW5zbGF0ZS5tYXJrZXQud2lzaGxpc3QuZGVsZXRlX3Rvb2x0aXB9fVxcXCJcXG4gICAgICAgICAgICBhbHQ9XFxcInt7dHJhbnNsYXRlLm1hcmtldC53aXNobGlzdC5kZWxldGV9fVxcXCJcXG4gICAgICAgICAgLz5cXG4gICAgICAgIDwvZGl2PlxcbiAgICAgIDwvdGQ+XFxuICAgIDwvdHI+XFxuICAgIHt7L3dpc2hsaXN0fX1cXG4gIDwvdGJvZHk+XFxuPC90YWJsZT5cXG5cIiwgSCk7cmV0dXJuIFQ7IH0oKTsiLCJpbXBvcnQgeyBCb2R5TG9jYXRpb24gfSBmcm9tIFwiLi4vbWFya2V0cGxhY2UvZW51bXMvYm9keV9sb2NhdGlvbi5lbnVtXCJcbmltcG9ydCB7IENhdGVnb3J5TnVtYmVyIH0gZnJvbSBcIi4uL21hcmtldHBsYWNlL2VudW1zL2NhdGVnb3J5LmVudW1cIlxuaW1wb3J0IHsgR3VhcmQgfSBmcm9tIFwiLi4vbWFya2V0cGxhY2UvZW51bXMvZ3VhcmQuZW51bVwiXG5pbXBvcnQgeyBSYXJpdHkgfSBmcm9tIFwiLi4vbWFya2V0cGxhY2UvZW51bXMvcmFyaXR5LmVudW1cIlxuaW1wb3J0IHsgVHlwZSB9IGZyb20gXCIuLi9tYXJrZXRwbGFjZS9lbnVtcy90eXBlLmVudW1cIlxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYWpheFNlYXJjaChkYXRhOiB7XG4gIHR5cGU/OiBUeXBlXG4gIGJvZHlMb2NhdGlvbj86IEJvZHlMb2NhdGlvblxuICBjYXRlZ29yeT86IENhdGVnb3J5TnVtYmVyXG4gIHJhcml0eT86IFJhcml0eVxuICBwcmljZT86IG51bWJlciB8IFwiXCJcbiAgZ3VhcmQ/OiBHdWFyZFxuICAvKiogUGFnZSBudW1iZXIsIGluZGV4ZWQgYnkgMSAqL1xuICBwYWdlOiBudW1iZXJcbiAgbmFtZT86IHN0cmluZ1xufSk6IFByb21pc2U8c3RyaW5nPiB7XG4gIGRhdGEgPSB7XG4gICAgLi4ue1xuICAgICAgdHlwZTogVHlwZS5BbGwsXG4gICAgICBib2R5TG9jYXRpb246IEJvZHlMb2NhdGlvbi5BbGwsXG4gICAgICBjYXRlZ29yeTogQ2F0ZWdvcnlOdW1iZXIuYWxsLFxuICAgICAgcmFyaXR5OiBSYXJpdHkuYWxsLFxuICAgICAgcHJpY2U6IFwiXCIsXG4gICAgICBndWFyZDogR3VhcmQuYW55LFxuICAgICAgcGFnZTogMSxcbiAgICAgIG5hbWU6IFwiXCIsXG4gICAgfSxcbiAgICAuLi5kYXRhLFxuICB9XG5cbiAgY29uc3QgSVRFTVNfUEVSX1BBR0UgPSA4XG4gIHJldHVybiAoYXdhaXQgJC5nZXQoXCIvbWFya2V0cGxhY2UvYWpheF9zZWFyY2hcIiwge1xuICAgIC4uLmRhdGEsXG4gICAgZnJvbTogKGRhdGEucGFnZSAtIDEpICogSVRFTVNfUEVSX1BBR0UsXG4gICAgdG86IElURU1TX1BFUl9QQUdFLFxuICB9KSkgYXMgc3RyaW5nXG59XG4iLCJpbXBvcnQgdHlwZSB7IFBhY2tldCB9IGZyb20gXCIuLi9hcGkvcGFja2V0XCJcbmltcG9ydCB7IExvY2FsU3RvcmFnZSB9IGZyb20gXCIuLi9sb2NhbF9zdG9yYWdlL2xvY2FsX3N0b3JhZ2VcIlxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYnV5KGl0ZW1JZDogbnVtYmVyKTogUHJvbWlzZTxQYWNrZXQ8XCJcIj4+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgIHZvaWQgJC5wb3N0KFxuICAgICAgXCIvbWFya2V0cGxhY2UvYnV5XCIsXG4gICAgICB7IGlkOiBpdGVtSWQgfSxcbiAgICAgIChqc29uOiBQYWNrZXQ8XCJcIj4pOiB2b2lkID0+IHtcbiAgICAgICAgTG9jYWxTdG9yYWdlLm1ldGEgPSBqc29uLm1ldGFcbiAgICAgICAgcmVzb2x2ZShqc29uKVxuXG4gICAgICAgIGlmIChqc29uLnJlc3VsdCAhPT0gXCJzdWNjZXNzXCIpIHtcbiAgICAgICAgICAkLmZsYXZyTm90aWYoanNvbi5kYXRhKVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgXCJqc29uXCJcbiAgICApXG4gIH0pXG59XG4iLCJpbXBvcnQgdHlwZSB7IEV4cGxvcmF0aW9uUmVzdWx0c0RhdGEgfSBmcm9tIFwiLi4vYXBpL2V4cGxvcmF0aW9uX3Jlc3VsdHNfZGF0YVwiXG5pbXBvcnQgdHlwZSB7IFBhY2tldCB9IGZyb20gXCIuLi9hcGkvcGFja2V0XCJcbmltcG9ydCB7IExvY2FsU3RvcmFnZSB9IGZyb20gXCIuLi9sb2NhbF9zdG9yYWdlL2xvY2FsX3N0b3JhZ2VcIlxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY2FwdHVyZUVuZCgpOiBQcm9taXNlPFBhY2tldDxFeHBsb3JhdGlvblJlc3VsdHNEYXRhPj4ge1xuICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgdm9pZCAkLnBvc3QoXG4gICAgICBcIi9wZXQvY2FwdHVyZS9lbmRcIixcbiAgICAgIChqc29uOiBQYWNrZXQ8RXhwbG9yYXRpb25SZXN1bHRzRGF0YT4pOiB2b2lkID0+IHtcbiAgICAgICAgTG9jYWxTdG9yYWdlLm1ldGEgPSBqc29uLm1ldGFcbiAgICAgICAgcmVzb2x2ZShqc29uKVxuXG4gICAgICAgIGlmIChqc29uLnJlc3VsdCAhPT0gXCJzdWNjZXNzXCIpIHtcbiAgICAgICAgICAkLmZsYXZyTm90aWYoanNvbi5kYXRhKVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICB9XG4gICAgKVxuICB9KVxufVxuIiwiaW1wb3J0IHR5cGUgeyBDaGFuZ2VSZWdpb25EYXRhIH0gZnJvbSBcIi4uL2FwaS9jaGFuZ2VfcmVnaW9uX2RhdGFcIlxuaW1wb3J0IHR5cGUgeyBQYWNrZXQgfSBmcm9tIFwiLi4vYXBpL3BhY2tldFwiXG5pbXBvcnQgeyBMb2NhbFN0b3JhZ2UgfSBmcm9tIFwiLi4vbG9jYWxfc3RvcmFnZS9sb2NhbF9zdG9yYWdlXCJcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNoYW5nZVJlZ2lvbihcbiAgbmV3UmVnaW9uSWQ6IG51bWJlclxuKTogUHJvbWlzZTxQYWNrZXQ8Q2hhbmdlUmVnaW9uRGF0YT4+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlPFBhY2tldDxDaGFuZ2VSZWdpb25EYXRhPj4oKHJlc29sdmUpOiB2b2lkID0+IHtcbiAgICB2b2lkICQucG9zdChcbiAgICAgIFwiL3BldC9jaGFuZ2VSZWdpb25cIixcbiAgICAgIHsgbmV3UmVnaW9uSWQgfSxcbiAgICAgIChqc29uOiBQYWNrZXQ8Q2hhbmdlUmVnaW9uRGF0YT4pOiB2b2lkID0+IHtcbiAgICAgICAgTG9jYWxTdG9yYWdlLm1ldGEgPSBqc29uLm1ldGFcbiAgICAgICAgcmVzb2x2ZShqc29uKVxuXG4gICAgICAgIGlmIChqc29uLnJlc3VsdCAhPT0gXCJzdWNjZXNzXCIpIHtcbiAgICAgICAgICAkLmZsYXZyTm90aWYoanNvbi5kYXRhKVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgY3VycmVudFJlZ2lvbiA9IGpzb24uZGF0YS5jdXJyZW50UmVnaW9uXG5cbiAgICAgICAgcGVuZGluZ1RyZWFzdXJlSHVudExvY2F0aW9uID1cbiAgICAgICAgICB0eXBlb2YganNvbi5kYXRhLnBlbmRpbmdUcmVhc3VyZUh1bnRMb2NhdGlvbiA9PT0gXCJ1bmRlZmluZWRcIlxuICAgICAgICAgICAgPyBudWxsXG4gICAgICAgICAgICA6IGpzb24uZGF0YS5wZW5kaW5nVHJlYXN1cmVIdW50TG9jYXRpb25cblxuICAgICAgICB0aW1lTGVmdEV4cGxvcmF0aW9uID1cbiAgICAgICAgICB0eXBlb2YganNvbi5kYXRhLnRpbWVMZWZ0RXhwbG9yYXRpb24gPT09IFwidW5kZWZpbmVkXCJcbiAgICAgICAgICAgID8gbnVsbFxuICAgICAgICAgICAgOiBqc29uLmRhdGEudGltZUxlZnRFeHBsb3JhdGlvblxuICAgICAgfVxuICAgIClcbiAgfSlcbn1cbiIsImltcG9ydCB0eXBlIHsgRXhwbG9yYXRpb25SZXN1bHRzRGF0YSB9IGZyb20gXCIuLi9hcGkvZXhwbG9yYXRpb25fcmVzdWx0c19kYXRhXCJcbmltcG9ydCB0eXBlIHsgUGFja2V0IH0gZnJvbSBcIi4uL2FwaS9wYWNrZXRcIlxuaW1wb3J0IHsgTG9jYWxTdG9yYWdlIH0gZnJvbSBcIi4uL2xvY2FsX3N0b3JhZ2UvbG9jYWxfc3RvcmFnZVwiXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBleHBsb3JhdGlvblJlc3VsdHMoKTogUHJvbWlzZTxcbiAgUGFja2V0PEV4cGxvcmF0aW9uUmVzdWx0c0RhdGE+XG4+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlPFBhY2tldDxFeHBsb3JhdGlvblJlc3VsdHNEYXRhPj4oKHJlc29sdmUpOiB2b2lkID0+IHtcbiAgICB2b2lkICQucG9zdChcbiAgICAgIFwiL3BldC9leHBsb3JhdGlvblJlc3VsdHNcIixcbiAgICAgIChqc29uOiBQYWNrZXQ8RXhwbG9yYXRpb25SZXN1bHRzRGF0YT4pOiB2b2lkID0+IHtcbiAgICAgICAgTG9jYWxTdG9yYWdlLm1ldGEgPSBqc29uLm1ldGFcbiAgICAgICAgcmVzb2x2ZShqc29uKVxuXG4gICAgICAgIGlmIChqc29uLnJlc3VsdCAhPT0gXCJzdWNjZXNzXCIpIHtcbiAgICAgICAgICAkLmZsYXZyTm90aWYoanNvbi5kYXRhKVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICB9XG4gICAgKVxuICB9KVxufVxuIiwiZXhwb3J0IGludGVyZmFjZSBNZXRhIHtcbiAgZXZlbnQ6IE1ldGFFdmVudFxuICBtZXNzYWdlOiBNZXNzYWdlXG4gIG5vdGlmaWNhdGlvbnM6IE5vdGlmaWNhdGlvbnNcbiAgcGV0OiBQZXRcbiAgcGxheWVyOiBQbGF5ZXJcbiAgcHVycm9zaG9wOiBQdXJyb3Nob3Bcbn1cblxudHlwZSBNZXRhRXZlbnQgPSBcImVhc3RlclwiIHwgbnVsbFxuXG5pbnRlcmZhY2UgTWVzc2FnZSB7XG4gIHVucmVhZDogc3RyaW5nXG59XG5cbmludGVyZmFjZSBQZXQge1xuICAvKiogRXhwbG9yYXRpb24gaXMgZmluaXNoZWQgKi9cbiAgZXhwbG9yYXRpb246IGJvb2xlYW5cbiAgcG9ydHJhaXQ6IHN0cmluZ1xufVxuXG5pbnRlcmZhY2UgUGxheWVyIHtcbiAgZGFpbHlNYWFuYTogYm9vbGVhblxuICBnb2xkOiBDdXJyZW5jeVxuICBsZWdhY3lDdXJyZW5jeTogQ3VycmVuY3lcbiAgbWFhbmE6IEN1cnJlbmN5XG4gIHB1cnJvcGFzczogUHVycm9wYXNzXG4gIHVucmVhZE5ld3M6IG51bGxcbiAgeHA6IFhQXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ3VycmVuY3kge1xuICBjaGFuZ2U6IENoYW5nZVxuICB0ZXh0OiBzdHJpbmdcbiAgdmFsdWU6IG51bWJlclxufVxuXG5pbnRlcmZhY2UgQ2hhbmdlIHtcbiAgdGV4dDogc3RyaW5nXG4gIHZhbHVlOiBudW1iZXJcbn1cblxuaW50ZXJmYWNlIFB1cnJvcGFzcyB7XG4gIGNoYW5nZTogQ2hhbmdlXG4gIHRleHQ6IHN0cmluZ1xuICB2YWx1ZTogc3RyaW5nXG59XG5cbmludGVyZmFjZSBYUCB7XG4gIGdvYWw6IG51bWJlclxuICBsZXZlbDogbnVtYmVyXG4gIHZhbHVlOiBudW1iZXJcbn1cblxuaW50ZXJmYWNlIFB1cnJvc2hvcCB7XG4gIHN0YXR1czogUHVycm9zaG9wU3RhdHVzXG59XG5cbmludGVyZmFjZSBOb3RpZmljYXRpb25zIHtcbiAgZGlzcGxheVRpbWU6IG51bWJlclxuICBtZXNzYWdlOiBzdHJpbmdcbiAgdHlwZTogc3RyaW5nXG59XG5cbmV4cG9ydCBlbnVtIFB1cnJvc2hvcFN0YXR1cyB7XG4gIGRpc2FibGVkID0gXCJkaXNhYmxlZFwiLFxuICBlbmFibGVkID0gXCJlbmFibGVkXCIsXG59XG4iLCJleHBvcnQgZW51bSBSZXN1bHQge1xuICBlcnJvciA9IFwiZXJyb3JcIixcbiAgc3VjY2VzcyA9IFwic3VjY2Vzc1wiLFxufVxuIiwiaW1wb3J0IHdhcmRyb2JlIGZyb20gXCIuL3dhcmRyb2JlXCJcblxuZXhwb3J0IGZ1bmN0aW9uIGxvYWRBcHBlYXJhbmNlVUkoKTogdm9pZCB7XG4gIHNldHVwQmFja2dyb3VuZCgpXG4gIHNldHVwTGVmdFBhbmVsKClcbiAgc2V0dXBSaWdodFBhbmVsKClcblxuICBpZiAod2FyZHJvYmUuYXZhaWxhYmxlSXRlbXMpIGF2YWlsYWJsZUl0ZW1zID0gd2FyZHJvYmUuYXZhaWxhYmxlSXRlbXNcbiAgZWxzZSB3YXJkcm9iZS5hdmFpbGFibGVJdGVtcyA9IGF2YWlsYWJsZUl0ZW1zXG59XG5cbmZ1bmN0aW9uIHNldHVwQmFja2dyb3VuZCgpOiB2b2lkIHtcbiAgY29uc3QgYmFja2dyb3VuZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEltYWdlRWxlbWVudD4oXG4gICAgXCIjYXZhdGFyLWJhY2tncm91bmQgaW1nXCJcbiAgKVxuICBpZiAoYmFja2dyb3VuZCkge1xuICAgIGJhY2tncm91bmQuc3R5bGUuZmlsdGVyID0gXCJ1bnNldFwiXG4gICAgYmFja2dyb3VuZC5zdHlsZS5oZWlnaHQgPSBcInVuc2V0XCJcbiAgICBiYWNrZ3JvdW5kLnN0eWxlLm1hc2sgPVxuICAgICAgXCJsaW5lYXItZ3JhZGllbnQodG8gcmlnaHQsIGJsYWNrIDUwJSwgdHJhbnNwYXJlbnQgMTAwJSlcIlxuICAgIGJhY2tncm91bmQuc3R5bGUubWluSGVpZ2h0ID0gXCIxMDB2aFwiXG4gICAgYmFja2dyb3VuZC5zdHlsZS5taW5XaWR0aCA9IFwiNTB2d1wiXG4gICAgYmFja2dyb3VuZC5zdHlsZS5wb3NpdGlvbiA9IFwiZml4ZWRcIlxuICAgIGJhY2tncm91bmQuc3R5bGUudHJhbnNmb3JtID0gXCJ1bnNldFwiXG4gICAgYmFja2dyb3VuZC5zdHlsZS53aWR0aCA9IFwidW5zZXRcIlxuICB9XG59XG5cbmZ1bmN0aW9uIHNldHVwUmlnaHRQYW5lbCgpOiB2b2lkIHtcbiAgY29uc3QgcmlnaHRQYW5lbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXBwZWFyYW5jZS1yaWdodFwiKVxuICBpZiAocmlnaHRQYW5lbCkgcmlnaHRQYW5lbC5zdHlsZS5wYWRkaW5nVG9wID0gXCI4MHB4XCJcbn1cblxuZnVuY3Rpb24gc2V0dXBMZWZ0UGFuZWwoKTogdm9pZCB7XG4gIGNvbnN0IHByZXZpZXdPdXRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXBwZWFyYW5jZS1wcmV2aWV3LW91dGVyXCIpXG4gIGlmIChwcmV2aWV3T3V0ZXIpIHtcbiAgICBwcmV2aWV3T3V0ZXIuc3R5bGUucGFkZGluZyA9IFwiMHB4XCJcbiAgfVxuXG4gIGNvbnN0IHByZXZpZXcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFwcGVhcmFuY2UtcHJldmlld1wiKVxuICBpZiAocHJldmlldykge1xuICAgIHByZXZpZXcuc3R5bGUubGVmdCA9IFwiMFwiXG4gICAgcHJldmlldy5zdHlsZS5wb3NpdGlvbiA9IFwiZml4ZWRcIlxuICAgIHByZXZpZXcuc3R5bGUudG9wID0gXCJjYWxjKDUwJSAtIHZhcigtLXRvcGJhci1oZWlnaHQpKVwiXG4gICAgcHJldmlldy5zdHlsZS50cmFuc2Zvcm0gPSBcInRyYW5zbGF0ZVkoLTUwJSlcIlxuICB9XG5cbiAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MQ2FudmFzRWxlbWVudD4oXG4gICAgXCIjYXBwZWFyYW5jZS1wcmV2aWV3IGNhbnZhc1wiXG4gIClcbiAgaWYgKGNhbnZhcykge1xuICAgIGNhbnZhcy5zdHlsZS5tYXhIZWlnaHQgPSBcIjEwMHZoXCJcbiAgICBjYW52YXMuc3R5bGUubWF4V2lkdGggPSBcIjUwdndcIlxuICB9XG59XG4iLCJpbXBvcnQgeyB0cmltSWNvbiB9IGZyb20gXCIuLi9lbGRhcnlhX3V0aWxcIlxuaW1wb3J0IHR5cGUgeyBBcHBlYXJhbmNlQ2F0ZWdvcnkgfSBmcm9tIFwiLi4vdGVtcGxhdGVzL2ludGVyZmFjZXMvYXBwZWFyYW5jZV9jYXRlZ29yeVwiXG5pbXBvcnQgdHlwZSB7IEFwcGVhcmFuY2VHcm91cCB9IGZyb20gXCIuLi90ZW1wbGF0ZXMvaW50ZXJmYWNlcy9hcHBlYXJhbmNlX2dyb3VwXCJcbmltcG9ydCB0eXBlIHsgQXBwZWFyYW5jZUl0ZW0gfSBmcm9tIFwiLi4vdGVtcGxhdGVzL2ludGVyZmFjZXMvYXBwZWFyYW5jZV9pdGVtXCJcbmltcG9ydCB0eXBlIHsgQXBwZWFyYW5jZUNhdGVnb3J5Q29kZSB9IGZyb20gXCIuL2VudW1zL2FwcGVhcmFuY2VfY2F0ZWdvcnlfY29kZS5lbnVtXCJcblxuZXhwb3J0IGZ1bmN0aW9uIGNhdGVnb3J5Q29udGFpbmVyRGF0YVNldChcbiAgY2F0ZWdvcnlDb250YWluZXI6IEhUTUxEaXZFbGVtZW50XG4pOiBBcHBlYXJhbmNlQ2F0ZWdvcnkgfCB1bmRlZmluZWQge1xuICBjb25zdCB7IGNhdGVnb3J5aWQsIGNhdGVnb3J5LCBjYXRlZ29yeW5hbWUgfSA9IGNhdGVnb3J5Q29udGFpbmVyLmRhdGFzZXRcbiAgaWYgKCFjYXRlZ29yeWlkIHx8ICFjYXRlZ29yeSB8fCAhY2F0ZWdvcnluYW1lKSByZXR1cm5cbiAgcmV0dXJuIHtcbiAgICBjYXRlZ29yeWlkOiBOdW1iZXIoY2F0ZWdvcnlpZCksXG4gICAgY2F0ZWdvcnk6IGNhdGVnb3J5IGFzIEFwcGVhcmFuY2VDYXRlZ29yeUNvZGUsXG4gICAgY2F0ZWdvcnluYW1lLFxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjYXRlZ29yeUdyb3VwRGF0YVNldChcbiAgZ3JvdXBJdGVtOiBIVE1MTElFbGVtZW50LFxuICBhcHBlYXJhbmNlQ2F0ZWdvcnk6IEFwcGVhcmFuY2VDYXRlZ29yeVxuKTogQXBwZWFyYW5jZUdyb3VwIHwgdW5kZWZpbmVkIHtcbiAgY29uc3QgeyBpdGVtaWQsIGdyb3VwLCBuYW1lLCByYXJpdHksIHJhcml0eW5hbWUgfSA9IGdyb3VwSXRlbS5kYXRhc2V0XG4gIGlmICghaXRlbWlkIHx8ICFncm91cCB8fCAhbmFtZSB8fCAhcmFyaXR5IHx8ICFyYXJpdHluYW1lKSByZXR1cm5cbiAgcmV0dXJuIHtcbiAgICAuLi5hcHBlYXJhbmNlQ2F0ZWdvcnksXG4gICAgaXRlbWlkOiBOdW1iZXIoaXRlbWlkKSxcbiAgICBncm91cDogTnVtYmVyKGdyb3VwKSxcbiAgICBuYW1lLFxuICAgIHJhcml0eSxcbiAgICByYXJpdHluYW1lLFxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpdGVtRGF0YVNldChcbiAgbGk6IEhUTUxMSUVsZW1lbnQsXG4gIGFwcGVhcmFuY2VHcm91cDogQXBwZWFyYW5jZUdyb3VwXG4pOiBBcHBlYXJhbmNlSXRlbSB8IHVuZGVmaW5lZCB7XG4gIGNvbnN0IHsgaXRlbWlkLCBuYW1lLCByYXJpdHksIHJhcml0eW5hbWUgfSA9IGxpLmRhdGFzZXRcbiAgY29uc3QgaWNvbiA9IGxpLnF1ZXJ5U2VsZWN0b3IoXCJpbWdcIik/LnNyY1xuICBpZiAoIWl0ZW1pZCB8fCAhbmFtZSB8fCAhcmFyaXR5IHx8ICFyYXJpdHluYW1lIHx8ICFpY29uKSByZXR1cm5cblxuICByZXR1cm4ge1xuICAgIC4uLmFwcGVhcmFuY2VHcm91cCxcbiAgICBpdGVtaWQ6IE51bWJlcihpdGVtaWQpLFxuICAgIG5hbWUsXG4gICAgcmFyaXR5LFxuICAgIHJhcml0eW5hbWUsXG4gICAgaWNvbjogdHJpbUljb24oaWNvbiksXG4gIH1cbn1cbiIsImltcG9ydCB0eXBlIHsgVGVtcGxhdGUgfSBmcm9tIFwiaG9nYW4uanNcIlxuaW1wb3J0IHsgdHJhbnNsYXRlIH0gZnJvbSBcIi4uL2kxOG4vdHJhbnNsYXRlXCJcbmltcG9ydCB7IGlzRW51bSB9IGZyb20gXCIuLi90c191dGlsXCJcbmltcG9ydCB7IGxvYWRGYXZvdXJpdGVzIH0gZnJvbSBcIi4uL3VpL2Zhdm91cml0ZXNcIlxuaW1wb3J0IHsgbG9hZEFwcGVhcmFuY2VVSSB9IGZyb20gXCIuL2FwcGVhcmFuY2VfdWlcIlxuaW1wb3J0IHtcbiAgY2F0ZWdvcnlDb250YWluZXJEYXRhU2V0LFxuICBjYXRlZ29yeUdyb3VwRGF0YVNldCxcbiAgaXRlbURhdGFTZXQsXG59IGZyb20gXCIuL2RhdGFfc2V0XCJcbmltcG9ydCB7IEFwcGVhcmFuY2VDYXRlZ29yeUNvZGUgfSBmcm9tIFwiLi9lbnVtcy9hcHBlYXJhbmNlX2NhdGVnb3J5X2NvZGUuZW51bVwiXG5pbXBvcnQgeyBvcGVuQ2F0ZWdvcnksIG9wZW5Hcm91cCB9IGZyb20gXCIuL2Zhdm91cml0ZXNfYWN0aW9uc1wiXG5pbXBvcnQgeyBsb2FkSGlkZGVuQ2F0ZWdvcnksIHVubG9hZEhpZGRlbkNhdGVnb3JpZXMgfSBmcm9tIFwiLi9oaWRkZW5cIlxuaW1wb3J0IHdhcmRyb2JlIGZyb20gXCIuL3dhcmRyb2JlXCJcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxvYWREcmVzc2luZ0V4cGVyaWVuY2UoKTogUHJvbWlzZTx2b2lkPiB7XG4gIGlmICghbG9jYXRpb24ucGF0aG5hbWUuc3RhcnRzV2l0aChcIi9wbGF5ZXIvYXBwZWFyYW5jZVwiKSkgcmV0dXJuXG5cbiAgaGFuZGxlZENhdGVnb3JpZXMuY2xlYXIoKVxuICBsb2FkaW5nID0gZmFsc2VcblxuICBsb2FkQXBwZWFyYW5jZVVJKClcblxuICAvLyBTZXR1cCBjYXRlZ29yaWVzXG4gIGZvciAoY29uc3QgbGkgb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MTElFbGVtZW50PihcbiAgICBcIiN3YXJkcm9iZS1tZW51PmxpLCAjYXBwZWFyYW5jZS1pdGVtcy1jYXRlZ29yaWVzIGxpXCJcbiAgKSkge1xuICAgIGNvbnN0IHsgY2F0ZWdvcnkgfSA9IGxpLmRhdGFzZXRcbiAgICBpZiAoIWlzRW51bShjYXRlZ29yeSwgQXBwZWFyYW5jZUNhdGVnb3J5Q29kZSkpIGNvbnRpbnVlXG5cbiAgICBzd2l0Y2ggKGNhdGVnb3J5KSB7XG4gICAgICBjYXNlIEFwcGVhcmFuY2VDYXRlZ29yeUNvZGUuYmFja2dyb3VuZDpcbiAgICAgICAgbGkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+XG4gICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlZS1jYXRlZ29yeVwiKT8ucmVtb3ZlKClcbiAgICAgICAgKVxuICAgICAgICBjb250aW51ZVxuICAgICAgY2FzZSBBcHBlYXJhbmNlQ2F0ZWdvcnlDb2RlLmZhdm9yaXRlczpcbiAgICAgICAgbGkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVlLWNhdGVnb3J5XCIpPy5yZW1vdmUoKVxuICAgICAgICAgIHZvaWQgaGFuZGxlQ2F0ZWdvcnkoY2F0ZWdvcnkpXG4gICAgICAgIH0pXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICBjYXNlIEFwcGVhcmFuY2VDYXRlZ29yeUNvZGUuYXR0aWM6XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBsaS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAgIGRvY3VtZW50XG4gICAgICAgICAgICAuZ2V0RWxlbWVudEJ5SWQoXCJhcHBlYXJhbmNlLWl0ZW1zLWNhdGVnb3J5LWZhdm9yaXRlc1wiKVxuICAgICAgICAgICAgPy5yZW1vdmUoKVxuICAgICAgICAgIC8vIHZvaWQgaGFuZGxlQ2F0ZWdvcnkoY2F0ZWdvcnkpXG4gICAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDEwMDApKVxuICAvLyBhd2FpdCBsb2FkQmFja2dyb3VuZCgpXG59XG5cbi8qKlxuICogR2V0IHRoZSBjYXRlZ29yeSBjb250YWluZXIgZm9yIHRoZSBjbGlja2VkIGNhdGVnb3J5IGFuZCBsb2FkIGl0cyBncm91cHNcbiAqIEByZXR1cm5zIENhdGVnb3J5IGNvbnRhaW5lclxuICovXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVDYXRlZ29yeShcbiAgY2F0ZWdvcnk6IEFwcGVhcmFuY2VDYXRlZ29yeUNvZGVcbik6IFByb21pc2U8SFRNTERpdkVsZW1lbnQgfCBudWxsPiB7XG4gIGNvbnN0IGFwcGVhcmFuY2VJdGVtcyA9XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRGl2RWxlbWVudD4oXCIjYXBwZWFyYW5jZS1pdGVtc1wiKVxuICBpZiAoIWFwcGVhcmFuY2VJdGVtcykgcmV0dXJuIG51bGxcblxuICBjb25zdCBvbGRDYXRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxEaXZFbGVtZW50PihcbiAgICBgI2FwcGVhcmFuY2UtaXRlbXMtY2F0ZWdvcnktJHtjYXRlZ29yeX1gXG4gIClcblxuICBpZiAob2xkQ2F0Q29udGFpbmVyKSB7XG4gICAgYXdhaXQgb25BcHBlYXJhbmNlSXRlbXNDYXRlZ29yeShjYXRlZ29yeSwgYXBwZWFyYW5jZUl0ZW1zLCBvbGRDYXRDb250YWluZXIpXG4gICAgcmV0dXJuIG9sZENhdENvbnRhaW5lclxuICB9XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgIG5ldyBNdXRhdGlvbk9ic2VydmVyKChfLCBvYnNlcnZlcikgPT4ge1xuICAgICAgY29uc3QgbmV3Q2F0Q29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRGl2RWxlbWVudD4oXG4gICAgICAgIGAjYXBwZWFyYW5jZS1pdGVtcy1jYXRlZ29yeS0ke2NhdGVnb3J5fWBcbiAgICAgIClcbiAgICAgIGlmICghbmV3Q2F0Q29udGFpbmVyKSByZXR1cm5cbiAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKVxuXG4gICAgICB2b2lkIChhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgICAgIGF3YWl0IG9uQXBwZWFyYW5jZUl0ZW1zQ2F0ZWdvcnkoXG4gICAgICAgICAgY2F0ZWdvcnksXG4gICAgICAgICAgYXBwZWFyYW5jZUl0ZW1zLFxuICAgICAgICAgIG5ld0NhdENvbnRhaW5lclxuICAgICAgICApXG4gICAgICAgIHJlc29sdmUobmV3Q2F0Q29udGFpbmVyKVxuICAgICAgfSkoKVxuICAgIH0pLm9ic2VydmUoYXBwZWFyYW5jZUl0ZW1zLCB7IGNoaWxkTGlzdDogdHJ1ZSB9KVxuICB9KVxufVxuXG5hc3luYyBmdW5jdGlvbiBvbkFwcGVhcmFuY2VJdGVtc0NhdGVnb3J5KFxuICBjYXRlZ29yeTogQXBwZWFyYW5jZUNhdGVnb3J5Q29kZSxcbiAgYXBwZWFyYW5jZUl0ZW1zOiBIVE1MRGl2RWxlbWVudCxcbiAgY2F0ZWdvcnlDb250YWluZXI6IEhUTUxEaXZFbGVtZW50XG4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgaWYgKGNhdGVnb3J5ID09PSBBcHBlYXJhbmNlQ2F0ZWdvcnlDb2RlLmZhdm9yaXRlcykgbG9hZEZhdm91cml0ZXMoKVxuICBlbHNlIHtcbiAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMjIwKSlcbiAgICBsb2FkRWVJdGVtcyhhcHBlYXJhbmNlSXRlbXMsIGNhdGVnb3J5Q29udGFpbmVyKVxuICAgIGF3YWl0IGhhbmRsZUdyb3VwcyhjYXRlZ29yeUNvbnRhaW5lcilcbiAgfVxufVxuXG5mdW5jdGlvbiBsb2FkRWVJdGVtcyhcbiAgYXBwZWFyYW5jZUl0ZW1zOiBIVE1MRGl2RWxlbWVudCxcbiAgY2F0ZWdvcnlDb250YWluZXI6IEhUTUxEaXZFbGVtZW50XG4pOiBIVE1MRGl2RWxlbWVudCB8IG51bGwge1xuICAvLyBHZXQgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGN1cnJlbnQgY2F0ZWdvcnlcbiAgY29uc3QgYXBwZWFyYW5jZUNhdGVnb3J5ID0gY2F0ZWdvcnlDb250YWluZXJEYXRhU2V0KGNhdGVnb3J5Q29udGFpbmVyKVxuICBpZiAoIWFwcGVhcmFuY2VDYXRlZ29yeSkgcmV0dXJuIG51bGxcbiAgd2FyZHJvYmUuc2V0Q2F0ZWdvcnkoYXBwZWFyYW5jZUNhdGVnb3J5KVxuICBjYXRlZ29yeUNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpXG4gIGNhdGVnb3J5Q29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIlxuXG4gIC8vIFNldHVwIGFwcGVhcmFuY2VfaXRlbXNfY2F0ZWdvcnlcbiAgY29uc3QgdGVtcGxhdGU6IFRlbXBsYXRlID0gcmVxdWlyZShcIi4uL3RlbXBsYXRlcy9odG1sL2FwcGVhcmFuY2VfaXRlbXNfY2F0ZWdvcnkuaHRtbFwiKVxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVlLWNhdGVnb3J5XCIpPy5yZW1vdmUoKVxuICBhcHBlYXJhbmNlSXRlbXMuaW5zZXJ0QWRqYWNlbnRIVE1MKFxuICAgIFwiYmVmb3JlZW5kXCIsXG4gICAgdGVtcGxhdGUucmVuZGVyKHsgLi4uYXBwZWFyYW5jZUNhdGVnb3J5LCB0cmFuc2xhdGUgfSlcbiAgKVxuXG4gIGNvbnN0IGVlSXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxEaXZFbGVtZW50PihcIiNlZS1pdGVtc1wiKVxuICBpZiAoIWVlSXRlbXMpIHJldHVybiBudWxsXG4gIGVlSXRlbXMuZGF0YXNldC5jYXRlZ29yeWlkID0gYXBwZWFyYW5jZUNhdGVnb3J5LmNhdGVnb3J5aWQudG9TdHJpbmcoKVxuICBlZUl0ZW1zLmRhdGFzZXQuY2F0ZWdvcnkgPSBhcHBlYXJhbmNlQ2F0ZWdvcnkuY2F0ZWdvcnlcbiAgZWVJdGVtcy5kYXRhc2V0LmNhdGVnb3J5bmFtZSA9IGFwcGVhcmFuY2VDYXRlZ29yeS5jYXRlZ29yeW5hbWVcbiAgcmV0dXJuIGVlSXRlbXNcbn1cblxuY29uc3QgaGFuZGxlZENhdGVnb3JpZXMgPSBuZXcgU2V0PEFwcGVhcmFuY2VDYXRlZ29yeUNvZGU+KClcblxuLyoqIExvYWQgZWFjaCBncm91cHMgc3luY2hyb25vdXNseSBhbmQgYWRkIHRoZW0gdG8gYSBjdXN0b20gY29udGFpbmVyLiAqL1xuYXN5bmMgZnVuY3Rpb24gaGFuZGxlR3JvdXBzKGNhdGVnb3J5Q29udGFpbmVyOiBIVE1MRGl2RWxlbWVudCk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBhcHBlYXJhbmNlQ2F0ZWdvcnkgPSBjYXRlZ29yeUNvbnRhaW5lckRhdGFTZXQoY2F0ZWdvcnlDb250YWluZXIpXG4gIGlmICghYXBwZWFyYW5jZUNhdGVnb3J5KSByZXR1cm5cbiAgd2FyZHJvYmUuc2V0Q2F0ZWdvcnkoYXBwZWFyYW5jZUNhdGVnb3J5KVxuICBjYXRlZ29yeUNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpXG4gIGNhdGVnb3J5Q29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIlxuXG4gIGNvbnN0IGhhbmRsZWQgPSBoYW5kbGVkQ2F0ZWdvcmllcy5oYXMoYXBwZWFyYW5jZUNhdGVnb3J5LmNhdGVnb3J5KVxuICBoYW5kbGVkQ2F0ZWdvcmllcy5hZGQoYXBwZWFyYW5jZUNhdGVnb3J5LmNhdGVnb3J5KVxuXG4gIGxvYWRIaWRkZW5DYXRlZ29yeShhcHBlYXJhbmNlQ2F0ZWdvcnkuY2F0ZWdvcnkpXG4gIGZvciAoY29uc3QgbGkgb2YgY2F0ZWdvcnlDb250YWluZXIucXVlcnlTZWxlY3RvckFsbDxIVE1MTElFbGVtZW50PihcbiAgICBcImxpLmFwcGVhcmFuY2UtaXRlbS1ncm91cFwiXG4gICkpIHtcbiAgICBjb25zdCBhcHBlYXJhbmNlR3JvdXAgPSBjYXRlZ29yeUdyb3VwRGF0YVNldChsaSwgYXBwZWFyYW5jZUNhdGVnb3J5KVxuICAgIGlmICghYXBwZWFyYW5jZUdyb3VwPy5ncm91cCkgYnJlYWtcbiAgICB3YXJkcm9iZS5zZXRHcm91cChhcHBlYXJhbmNlR3JvdXApXG5cbiAgICBpZiAoXG4gICAgICAhZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgYCNhcHBlYXJhbmNlLWl0ZW1zLWdyb3VwLSR7YXBwZWFyYW5jZUdyb3VwLmdyb3VwfWBcbiAgICAgICkgJiZcbiAgICAgICFoYW5kbGVkXG4gICAgICAvLyAmJiAhbG9hZEhpZGRlbkdyb3VwKGFwcGVhcmFuY2VHcm91cC5ncm91cClcbiAgICApXG4gICAgICBhd2FpdCBvcGVuR3JvdXAoYXBwZWFyYW5jZUdyb3VwLmdyb3VwKVxuXG4gICAgY29uc3QgZGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRGl2RWxlbWVudD4oXG4gICAgICBgI2FwcGVhcmFuY2UtaXRlbXMtZ3JvdXAtJHthcHBlYXJhbmNlR3JvdXAuZ3JvdXB9YFxuICAgIClcbiAgICBpZiAoIWRpdikgYnJlYWtcbiAgICBkaXYuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKVxuXG4gICAgY29uc3Qgc2NyaXB0ID0gZGl2LnF1ZXJ5U2VsZWN0b3IoXCJzY3JpcHRcIikgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1pbXBsaWVkLWV2YWxcbiAgICBpZiAoc2NyaXB0KSBzZXRUaW1lb3V0KHNjcmlwdC5pbm5lckhUTUwsIDApXG5cbiAgICBjb25zdCBvdXRlckhUTUwgPSBBcnJheS5mcm9tKFxuICAgICAgZGl2LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTExJRWxlbWVudD4oXCJsaS5hcHBlYXJhbmNlLWl0ZW1cIilcbiAgICApXG4gICAgICAubWFwKGxpID0+IHtcbiAgICAgICAgY29uc3QgYXBwZWFyYW5jZUl0ZW0gPSBpdGVtRGF0YVNldChsaSwgYXBwZWFyYW5jZUdyb3VwKVxuICAgICAgICBpZiAoIWFwcGVhcmFuY2VJdGVtPy5pY29uKSByZXR1cm4gbGkub3V0ZXJIVE1MXG5cbiAgICAgICAgbGkuZGF0YXNldC5jYXRlZ29yeWlkID0gYXBwZWFyYW5jZUl0ZW0uY2F0ZWdvcnlpZC50b1N0cmluZygpXG4gICAgICAgIGxpLmRhdGFzZXQuY2F0ZWdvcnkgPSBhcHBlYXJhbmNlSXRlbS5jYXRlZ29yeVxuICAgICAgICBsaS5kYXRhc2V0LmNhdGVnb3J5bmFtZSA9IGFwcGVhcmFuY2VJdGVtLmNhdGVnb3J5bmFtZVxuICAgICAgICBsaS5kYXRhc2V0Lmdyb3VwID0gYXBwZWFyYW5jZUl0ZW0uZ3JvdXAudG9TdHJpbmcoKVxuICAgICAgICB3YXJkcm9iZS5zZXRJdGVtKGFwcGVhcmFuY2VJdGVtKVxuXG4gICAgICAgIHJldHVybiBsaS5vdXRlckhUTUxcbiAgICAgIH0pXG4gICAgICAuam9pbihcIlxcblwiKVxuICAgIHdhcmRyb2JlLmF2YWlsYWJsZUl0ZW1zID0gYXZhaWxhYmxlSXRlbXNcblxuICAgIGRpdi5yZW1vdmUoKVxuXG4gICAgY29uc3QgYWN0aXZlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgIGAjd2FyZHJvYmUtbWVudSBsaVtkYXRhLWNhdGVnb3J5PVwiJHthcHBlYXJhbmNlR3JvdXAuY2F0ZWdvcnl9XCJdLmFjdGl2ZWBcbiAgICApXG5cbiAgICBpZiAoYWN0aXZlKSB7XG4gICAgICBkb2N1bWVudFxuICAgICAgICAucXVlcnlTZWxlY3RvcjxIVE1MRGl2RWxlbWVudD4oXCIjZWUtaXRlbXNcIilcbiAgICAgICAgPy5pbnNlcnRBZGphY2VudEhUTUwoXCJiZWZvcmVlbmRcIiwgb3V0ZXJIVE1MKVxuXG4gICAgICBpbml0aWFsaXplU2VsZWN0ZWRJdGVtcygpXG4gICAgICBpbml0aWFsaXplSGlkZGVuQ2F0ZWdvcmllcygpXG4gICAgfSBlbHNlIGlmIChoYW5kbGVkKSBicmVha1xuICB9XG5cbiAgaWYgKCFoYW5kbGVkKSBoYW5kbGVkQ2F0ZWdvcmllcy5kZWxldGUoYXBwZWFyYW5jZUNhdGVnb3J5LmNhdGVnb3J5KVxuICB1bmxvYWRIaWRkZW5DYXRlZ29yaWVzKClcbn1cblxubGV0IGxvYWRpbmcgPSBmYWxzZVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbG9hZEJhY2tncm91bmQoKTogUHJvbWlzZTx2b2lkPiB7XG4gIGlmIChsb2FkaW5nKSByZXR1cm5cbiAgbG9hZGluZyA9IHRydWVcbiAgbGV0IHN1Y2Nlc3MgPSB0cnVlXG5cbiAgY29uc3QgY2F0ZWdvcmllcyA9IFtcbiAgICBBcHBlYXJhbmNlQ2F0ZWdvcnlDb2RlLnVuZGVyd2VhcixcbiAgICBBcHBlYXJhbmNlQ2F0ZWdvcnlDb2RlLnNraW4sXG4gICAgQXBwZWFyYW5jZUNhdGVnb3J5Q29kZS50YXRvbyxcbiAgICBBcHBlYXJhbmNlQ2F0ZWdvcnlDb2RlLm1vdXRoLFxuICAgIEFwcGVhcmFuY2VDYXRlZ29yeUNvZGUuZXllLFxuICAgIEFwcGVhcmFuY2VDYXRlZ29yeUNvZGUuaGFpcixcbiAgICBBcHBlYXJhbmNlQ2F0ZWdvcnlDb2RlLnNvY2ssXG4gICAgQXBwZWFyYW5jZUNhdGVnb3J5Q29kZS5zaG9lLFxuICAgIEFwcGVhcmFuY2VDYXRlZ29yeUNvZGUucGFudHMsXG4gICAgQXBwZWFyYW5jZUNhdGVnb3J5Q29kZS5oYW5kQWNjZXNzb3J5LFxuICAgIEFwcGVhcmFuY2VDYXRlZ29yeUNvZGUudG9wLFxuICAgIEFwcGVhcmFuY2VDYXRlZ29yeUNvZGUuY29hdCxcbiAgICBBcHBlYXJhbmNlQ2F0ZWdvcnlDb2RlLmdsb3ZlLFxuICAgIEFwcGVhcmFuY2VDYXRlZ29yeUNvZGUubmVja2xhY2UsXG4gICAgQXBwZWFyYW5jZUNhdGVnb3J5Q29kZS5kcmVzcyxcbiAgICBBcHBlYXJhbmNlQ2F0ZWdvcnlDb2RlLmhhdCxcbiAgICBBcHBlYXJhbmNlQ2F0ZWdvcnlDb2RlLmZhY2VBY2Nlc3NvcnksXG4gICAgQXBwZWFyYW5jZUNhdGVnb3J5Q29kZS5iZWx0LFxuICAgIEFwcGVhcmFuY2VDYXRlZ29yeUNvZGUuYW1iaWVudCxcbiAgXVxuXG4gIGNvbnN0IHRlbXBsYXRlOiBUZW1wbGF0ZSA9IHJlcXVpcmUoXCIuLi90ZW1wbGF0ZXMvaHRtbC9mbGF2cl9ub3RpZi9pY29uX21lc3NhZ2UuaHRtbFwiKVxuXG4gIGZvciAoY29uc3QgY2F0ZWdvcnkgb2YgY2F0ZWdvcmllcykge1xuICAgIGlmICghbG9jYXRpb24ucGF0aG5hbWUuc3RhcnRzV2l0aChcIi9wbGF5ZXIvYXBwZWFyYW5jZVwiKSkge1xuICAgICAgc3VjY2VzcyA9IGZhbHNlXG4gICAgICBicmVha1xuICAgIH1cblxuICAgIGNvbnN0IGFjdGl2ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICBgI3dhcmRyb2JlLW1lbnUgbGlbZGF0YS1jYXRlZ29yeT1cIiR7Y2F0ZWdvcnl9XCJdLmFjdGl2ZWBcbiAgICApXG4gICAgaWYgKGFjdGl2ZSkgY29udGludWVcblxuICAgIGNvbnN0IGNhdGVnb3J5Q29udGFpbmVyID0gYXdhaXQgb3BlbkNhdGVnb3J5KGNhdGVnb3J5KVxuICAgIGlmICghY2F0ZWdvcnlDb250YWluZXIpIHtcbiAgICAgIHN1Y2Nlc3MgPSBmYWxzZVxuICAgICAgYnJlYWtcbiAgICB9XG5cbiAgICBsZXQgZmluaXNoZWQgPSBmYWxzZVxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgaWYgKCFmaW5pc2hlZClcbiAgICAgICAgJC5mbGF2ck5vdGlmKFxuICAgICAgICAgIHRlbXBsYXRlLnJlbmRlcih7XG4gICAgICAgICAgICBpY29uOiBgL3N0YXRpYy9pbWcvbWFsbC9jYXRlZ29yaWVzLyR7Y2F0ZWdvcnl9LnBuZ2AsXG4gICAgICAgICAgICBtZXNzYWdlOiB0cmFuc2xhdGUuYXBwZWFyYW5jZS5sb2FkaW5nKFxuICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxMSUVsZW1lbnQ+KFxuICAgICAgICAgICAgICAgIGAjd2FyZHJvYmUtbWVudSBsaVtkYXRhLWNhdGVnb3J5PVwiJHtjYXRlZ29yeX1cIl1gXG4gICAgICAgICAgICAgICk/LmRhdGFzZXQuY2F0ZWdvcnluYW1lID8/IGNhdGVnb3J5XG4gICAgICAgICAgICApLFxuICAgICAgICAgIH0pXG4gICAgICAgIClcbiAgICB9LCAxMDAwKVxuXG4gICAgYXdhaXQgaGFuZGxlR3JvdXBzKGNhdGVnb3J5Q29udGFpbmVyKVxuICAgIGZpbmlzaGVkID0gdHJ1ZVxuICB9XG5cbiAgaWYgKHN1Y2Nlc3MpICQuZmxhdnJOb3RpZih0cmFuc2xhdGUuYXBwZWFyYW5jZS5sb2FkZWQpXG4gIGxvYWRpbmcgPSBmYWxzZVxufVxuIiwiZXhwb3J0IGVudW0gQXBwZWFyYW5jZUNhdGVnb3J5Q29kZSB7XG4gIGF0dGljID0gXCJhdHRpY1wiLFxuICBmYXZvcml0ZXMgPSBcImZhdm9yaXRlc1wiLFxuICB1bmRlcndlYXIgPSBcInVuZGVyd2VhclwiLFxuICBza2luID0gXCJza2luXCIsXG4gIHRhdG9vID0gXCJ0YXRvb1wiLFxuICBtb3V0aCA9IFwibW91dGhcIixcbiAgZXllID0gXCJleWVcIixcbiAgaGFpciA9IFwiaGFpclwiLFxuICBzb2NrID0gXCJzb2NrXCIsXG4gIHNob2UgPSBcInNob2VcIixcbiAgcGFudHMgPSBcInBhbnRzXCIsXG4gIGhhbmRBY2Nlc3NvcnkgPSBcImhhbmRBY2Nlc3NvcnlcIixcbiAgdG9wID0gXCJ0b3BcIixcbiAgY29hdCA9IFwiY29hdFwiLFxuICBnbG92ZSA9IFwiZ2xvdmVcIixcbiAgbmVja2xhY2UgPSBcIm5lY2tsYWNlXCIsXG4gIGRyZXNzID0gXCJkcmVzc1wiLFxuICBoYXQgPSBcImhhdFwiLFxuICBmYWNlQWNjZXNzb3J5ID0gXCJmYWNlQWNjZXNzb3J5XCIsXG4gIGJhY2tncm91bmQgPSBcImJhY2tncm91bmRcIixcbiAgYmVsdCA9IFwiYmVsdFwiLFxuICBhbWJpZW50ID0gXCJhbWJpZW50XCIsXG59XG4iLCJpbXBvcnQgdHlwZSB7IFRlbXBsYXRlIH0gZnJvbSBcImhvZ2FuLmpzXCJcbmltcG9ydCB7IHRyYW5zbGF0ZSB9IGZyb20gXCIuLi9pMThuL3RyYW5zbGF0ZVwiXG5pbXBvcnQgaW5kZXhlZF9kYiBmcm9tIFwiLi4vaW5kZXhlZF9kYi9pbmRleGVkX2RiXCJcbmltcG9ydCB7IHBhcnNlQXZhdGFyIH0gZnJvbSBcIi4uL291dGZpdFwiXG5pbXBvcnQgeyBsb2FkRmFrZUZhdm91cml0ZXMgfSBmcm9tIFwiLi4vdWkvZmF2b3VyaXRlc1wiXG5pbXBvcnQgeyB3ZWFyT3V0Zml0IH0gZnJvbSBcIi4vZmF2b3VyaXRlc19hY3Rpb25zXCJcbmltcG9ydCB0eXBlIHsgRmF2b3VyaXRlT3V0Zml0IH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9mYXZvdXJpdGVfb3V0Zml0XCJcbmltcG9ydCB0eXBlIHsgUGFyc2FibGVJdGVtIH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9wYXJzYWJsZV9pdGVtXCJcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNhdmVGYXZvdXJpdGUoKTogUHJvbWlzZTxGYXZvdXJpdGVPdXRmaXQgfCBudWxsPiB7XG4gIGNvbnN0IGZhdm91cml0ZSA9IGF3YWl0IHNob3dPdXRmaXQoKVxuICBpZiAoZmF2b3VyaXRlKSBhd2FpdCBsb2FkRmFrZUZhdm91cml0ZXMoKVxuICByZXR1cm4gZmF2b3VyaXRlXG59XG5cbmFzeW5jIGZ1bmN0aW9uIGRlbGV0ZUZhdm91cml0ZShmYXZvdXJpdGU6IEZhdm91cml0ZU91dGZpdCk6IFByb21pc2U8dm9pZD4ge1xuICBhd2FpdCBpbmRleGVkX2RiLmRlbGV0ZUZhdm91cml0ZU91dGZpdChmYXZvdXJpdGUpXG4gIGF3YWl0IGxvYWRGYWtlRmF2b3VyaXRlcygpXG59XG5cbmFzeW5jIGZ1bmN0aW9uIHNob3dPdXRmaXQoKTogUHJvbWlzZTxGYXZvdXJpdGVPdXRmaXQgfCBudWxsPiB7XG4gIGNvbnN0IHRlbXBsYXRlOiBUZW1wbGF0ZSA9IHJlcXVpcmUoXCIuLi90ZW1wbGF0ZXMvaHRtbC9jcmVhdGVkX291dGZpdF9mbGF2ci5odG1sXCIpXG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT5cbiAgICAkLmZsYXZyKHtcbiAgICAgIGNvbnRlbnQ6IHRlbXBsYXRlLnJlbmRlcih7IHRyYW5zbGF0ZSB9KSxcbiAgICAgIG9uQnVpbGQ6ICRjb250YWluZXIgPT4ge1xuICAgICAgICAkY29udGFpbmVyLmFkZENsYXNzKFwibmV3LWxheW91dC1wb3B1cFwiKVxuICAgICAgICAkY29udGFpbmVyLmFkZENsYXNzKFwiY3JlYXRlZC1vdXRmaXQtcG9wdXBcIilcblxuICAgICAgICBjb25zdCBzYXZlQnV0dG9uID1cbiAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxCdXR0b25FbGVtZW50PignW3JlbD1cImJ0bi1zYXZlXCJdJylcbiAgICAgICAgaWYgKCFzYXZlQnV0dG9uKSByZXR1cm5cblxuICAgICAgICBkb2N1bWVudFxuICAgICAgICAgIC5xdWVyeVNlbGVjdG9yPEhUTUxJbnB1dEVsZW1lbnQ+KFwiI2Nob29zZS1uYW1lXCIpXG4gICAgICAgICAgPy5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgZXZlbnQgPT4ge1xuICAgICAgICAgICAgaWYgKGV2ZW50LmtleSA9PT0gXCJFbnRlclwiKSBzYXZlQnV0dG9uLmNsaWNrKClcblxuICAgICAgICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTElucHV0RWxlbWVudD4oXCIjY2hvb3NlLW5hbWVcIik/LnZhbHVlKVxuICAgICAgICAgICAgICBzYXZlQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoXCJkaXNhYmxlZFwiKVxuICAgICAgICAgICAgZWxzZSBzYXZlQnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJkaXNhYmxlZFwiKVxuICAgICAgICAgIH0pXG5cbiAgICAgICAgc2F2ZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwibmwtYnV0dG9uXCIsIFwibmwtYnV0dG9uLWxnXCIsIFwiZGlzYWJsZWRcIilcbiAgICAgIH0sXG4gICAgICBidXR0b25zOiB7XG4gICAgICAgIGNsb3NlOiB7XG4gICAgICAgICAgdGV4dDogXCJcIixcbiAgICAgICAgICBzdHlsZTogXCJjbG9zZVwiLFxuICAgICAgICAgIGFjdGlvbjogKCkgPT4ge1xuICAgICAgICAgICAgcmVzb2x2ZShudWxsKVxuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBzYXZlOiB7XG4gICAgICAgICAgdGV4dDogdHJhbnNsYXRlLmFwcGVhcmFuY2UuZmF2b3VyaXRlcy5zYXZlX291dGZpdC5zYXZlLFxuICAgICAgICAgIHN0eWxlOiBcImRlZmF1bHRcIixcbiAgICAgICAgICBhY3Rpb246ICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG5hbWUgPVxuICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxJbnB1dEVsZW1lbnQ+KFwiI2Nob29zZS1uYW1lXCIpPy52YWx1ZVxuICAgICAgICAgICAgaWYgKCFuYW1lKSByZXR1cm4gZmFsc2VcblxuICAgICAgICAgICAgY29uc3QgYXZhdGFyID0gU2FjaGEuQXZhdGFyLmF2YXRhcnNbXCIjYXBwZWFyYW5jZS1wcmV2aWV3XCJdXG4gICAgICAgICAgICBpZiAoIWF2YXRhcikgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICBjb25zdCBpdGVtcyA9IHBhcnNlQXZhdGFyKGF2YXRhcilcblxuICAgICAgICAgICAgdm9pZCBzYXZlQWN0aW9uKG5hbWUsIGl0ZW1zKS50aGVuKHJlc29sdmUpXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pXG4gIClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNob3dGYXZvdXJpdGUoZmF2b3VyaXRlOiBGYXZvdXJpdGVPdXRmaXQpOiB2b2lkIHtcbiAgY29uc3QgdGVtcGxhdGU6IFRlbXBsYXRlID0gcmVxdWlyZShcIi4uL3RlbXBsYXRlcy9odG1sL2Zhdm91cml0ZV9vdXRmaXRfZmxhdnIuaHRtbFwiKVxuXG4gICQuZmxhdnIoe1xuICAgIGNvbnRlbnQ6IHRlbXBsYXRlLnJlbmRlcih7IC4uLmZhdm91cml0ZSwgdHJhbnNsYXRlIH0pLFxuICAgIG9uQnVpbGQ6ICRjb250YWluZXIgPT4ge1xuICAgICAgJGNvbnRhaW5lci5hZGRDbGFzcyhcIm5ldy1sYXlvdXQtcG9wdXBcIilcbiAgICAgICRjb250YWluZXIuYWRkQ2xhc3MoXCJjcmVhdGVkLW91dGZpdC1wb3B1cFwiKVxuICAgIH0sXG4gICAgYnV0dG9uczoge1xuICAgICAgY2xvc2U6IHtcbiAgICAgICAgdGV4dDogXCJcIixcbiAgICAgICAgc3R5bGU6IFwiY2xvc2VcIixcbiAgICAgICAgYWN0aW9uOiAoKSA9PiB0cnVlLFxuICAgICAgfSxcbiAgICAgIGRlbGV0ZToge1xuICAgICAgICB0ZXh0OiB0cmFuc2xhdGUuYXBwZWFyYW5jZS5mYXZvdXJpdGVzLmNsaWNrX291dGZpdC5kZWxldGUsXG4gICAgICAgIHN0eWxlOiBcImRlZmF1bHRcIixcbiAgICAgICAgYWN0aW9uOiAoKSA9PiB7XG4gICAgICAgICAgdm9pZCBkZWxldGVGYXZvdXJpdGUoZmF2b3VyaXRlKVxuICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgd2Vhcjoge1xuICAgICAgICB0ZXh0OiB0cmFuc2xhdGUuYXBwZWFyYW5jZS5mYXZvdXJpdGVzLmNsaWNrX291dGZpdC53ZWFyLFxuICAgICAgICBzdHlsZTogXCJkZWZhdWx0XCIsXG4gICAgICAgIGFjdGlvbjogKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGF2YXRhciA9IFNhY2hhLkF2YXRhci5hdmF0YXJzW1wiI2FwcGVhcmFuY2UtcHJldmlld1wiXVxuICAgICAgICAgIGlmICghYXZhdGFyKSByZXR1cm4gZmFsc2VcblxuICAgICAgICAgIHZvaWQgKGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+XG4gICAgICAgICAgICB3ZWFyT3V0Zml0KGF2YXRhciwgZmF2b3VyaXRlLml0ZW1zKSkoKVxuXG4gICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICByZW5hbWU6IHtcbiAgICAgICAgdGV4dDogdHJhbnNsYXRlLmFwcGVhcmFuY2UuZmF2b3VyaXRlcy5yZW5hbWVfb3V0Zml0LmJ1dHRvbixcbiAgICAgICAgc3R5bGU6IFwiZGVmYXVsdFwiLFxuICAgICAgICBhY3Rpb246ICgpID0+IHtcbiAgICAgICAgICBzZXRUaW1lb3V0KFxuICAgICAgICAgICAgKCkgPT5cbiAgICAgICAgICAgICAgdm9pZCBzaG93UmVuYW1lRmF2b3VyaXRlKGZhdm91cml0ZSkudGhlbihmYXZvdXJpdGUgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChmYXZvdXJpdGUpIHZvaWQgbG9hZEZha2VGYXZvdXJpdGVzKClcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICA4MDBcbiAgICAgICAgICApXG5cbiAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9KVxufVxuXG5hc3luYyBmdW5jdGlvbiBzYXZlQWN0aW9uKFxuICBuYW1lOiBzdHJpbmcsXG4gIGl0ZW1zOiBQYXJzYWJsZUl0ZW1bXVxuKTogUHJvbWlzZTxGYXZvdXJpdGVPdXRmaXQ+IHtcbiAgY29uc3QgYmxvYiA9IGF3YWl0IG5ldyBQcm9taXNlPEJsb2I+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBkb2N1bWVudFxuICAgICAgLnF1ZXJ5U2VsZWN0b3I8SFRNTENhbnZhc0VsZW1lbnQ+KFwiI2FwcGVhcmFuY2UtcHJldmlldyBjYW52YXNcIilcbiAgICAgID8udG9CbG9iKFxuICAgICAgICBibG9iID0+IHtcbiAgICAgICAgICBpZiAoYmxvYikgcmVzb2x2ZShibG9iKVxuICAgICAgICAgIGVsc2UgcmVqZWN0KFwiQmxvYiBkb2Vzbid0IGV4aXN0LlwiKVxuICAgICAgICB9LFxuICAgICAgICBcImltYWdlL3BuZ1wiLFxuICAgICAgICAxXG4gICAgICApXG4gIH0pXG5cbiAgY29uc3QgZmF2b3VyaXRlID0gYXdhaXQgaW5kZXhlZF9kYi5hZGRGYXZvdXJpdGVPdXRmaXQoeyBpdGVtcywgbmFtZSwgYmxvYiB9KVxuICByZXR1cm4geyAuLi5mYXZvdXJpdGUsIHVybDogVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKSB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzaG93UmVuYW1lRmF2b3VyaXRlKFxuICBmYXZvdXJpdGU6IEZhdm91cml0ZU91dGZpdFxuKTogUHJvbWlzZTxGYXZvdXJpdGVPdXRmaXQgfCBudWxsPiB7XG4gIGNvbnN0IHRlbXBsYXRlOiBUZW1wbGF0ZSA9IHJlcXVpcmUoXCIuLi90ZW1wbGF0ZXMvaHRtbC9yZW5hbWVfZmF2b3VyaXRlX291dGZpdF9mbGF2ci5odG1sXCIpXG4gIGNvbnN0IHJlbmRlcmVkID0gdGVtcGxhdGUucmVuZGVyKHtcbiAgICAuLi5mYXZvdXJpdGUsXG4gICAgdGl0bGU6IHRyYW5zbGF0ZS5hcHBlYXJhbmNlLmZhdm91cml0ZXMucmVuYW1lX291dGZpdC50aXRsZShmYXZvdXJpdGUubmFtZSksXG4gICAgdHJhbnNsYXRlLFxuICB9KVxuXG4gIHJldHVybiBuZXcgUHJvbWlzZTxGYXZvdXJpdGVPdXRmaXQgfCBudWxsPihyZXNvbHZlID0+IHtcbiAgICAkLmZsYXZyKHtcbiAgICAgIGNvbnRlbnQ6IHJlbmRlcmVkLFxuICAgICAgb25CdWlsZDogJGNvbnRhaW5lciA9PiB7XG4gICAgICAgICRjb250YWluZXIuYWRkQ2xhc3MoXCJuZXctbGF5b3V0LXBvcHVwXCIpXG4gICAgICAgICRjb250YWluZXIuYWRkQ2xhc3MoXCJjcmVhdGVkLW91dGZpdC1wb3B1cFwiKVxuXG4gICAgICAgIGNvbnN0IHJlbmFtZUJ1dHRvbiA9XG4gICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MQnV0dG9uRWxlbWVudD4oJ1tyZWw9XCJidG4tcmVuYW1lXCJdJylcbiAgICAgICAgaWYgKCFyZW5hbWVCdXR0b24pIHJldHVyblxuXG4gICAgICAgIGRvY3VtZW50XG4gICAgICAgICAgLnF1ZXJ5U2VsZWN0b3I8SFRNTElucHV0RWxlbWVudD4oXCIjY2hvb3NlLW5hbWVcIilcbiAgICAgICAgICA/LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBldmVudCA9PiB7XG4gICAgICAgICAgICBpZiAoZXZlbnQua2V5ID09PSBcIkVudGVyXCIpIHJlbmFtZUJ1dHRvbi5jbGljaygpXG5cbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxJbnB1dEVsZW1lbnQ+KFwiI2Nob29zZS1uYW1lXCIpPy52YWx1ZSlcbiAgICAgICAgICAgICAgcmVuYW1lQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoXCJkaXNhYmxlZFwiKVxuICAgICAgICAgICAgZWxzZSByZW5hbWVCdXR0b24uY2xhc3NMaXN0LmFkZChcImRpc2FibGVkXCIpXG4gICAgICAgICAgfSlcblxuICAgICAgICByZW5hbWVCdXR0b24uY2xhc3NMaXN0LmFkZChcIm5sLWJ1dHRvblwiLCBcIm5sLWJ1dHRvbi1sZ1wiLCBcImRpc2FibGVkXCIpXG4gICAgICB9LFxuICAgICAgYnV0dG9uczoge1xuICAgICAgICBjbG9zZToge1xuICAgICAgICAgIHRleHQ6IFwiXCIsXG4gICAgICAgICAgc3R5bGU6IFwiY2xvc2VcIixcbiAgICAgICAgICBhY3Rpb246ICgpID0+IHtcbiAgICAgICAgICAgIHJlc29sdmUobnVsbClcbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgcmVuYW1lOiB7XG4gICAgICAgICAgdGV4dDogdHJhbnNsYXRlLmFwcGVhcmFuY2UuZmF2b3VyaXRlcy5yZW5hbWVfb3V0Zml0LmJ1dHRvbixcbiAgICAgICAgICBzdHlsZTogXCJkZWZhdWx0XCIsXG4gICAgICAgICAgYWN0aW9uOiAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBuYW1lID1cbiAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MSW5wdXRFbGVtZW50PihcIiNjaG9vc2UtbmFtZVwiKT8udmFsdWVcbiAgICAgICAgICAgIGlmICghbmFtZSkgcmV0dXJuIGZhbHNlXG5cbiAgICAgICAgICAgIHZvaWQgaW5kZXhlZF9kYlxuICAgICAgICAgICAgICAudXBkYXRlRmF2b3VyaXRlT3V0Zml0KHsgLi4uZmF2b3VyaXRlLCBuYW1lIH0pXG4gICAgICAgICAgICAgIC50aGVuKHJlc29sdmUpXG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSlcbiAgfSlcbn1cbiIsImltcG9ydCB0eXBlIHsgQXZhdGFyIH0gZnJvbSBcIi4uL2VsZGFyeWEvYXZhdGFyXCJcbmltcG9ydCB0eXBlIHsgSXRlbSB9IGZyb20gXCIuLi9lbGRhcnlhL2l0ZW1cIlxuaW1wb3J0IHsgdHJhbnNsYXRlIH0gZnJvbSBcIi4uL2kxOG4vdHJhbnNsYXRlXCJcbmltcG9ydCB7IGV4cG9ydE91dGZpdCB9IGZyb20gXCIuLi9vdXRmaXRcIlxuaW1wb3J0IHR5cGUgeyBQYXJzYWJsZUl0ZW0gfSBmcm9tIFwiLi9pbnRlcmZhY2VzL3BhcnNhYmxlX2l0ZW1cIlxuXG5leHBvcnQgZnVuY3Rpb24gZXhwb3J0UHJldmlldygpOiB2b2lkIHtcbiAgZXhwb3J0T3V0Zml0KFwiI2FwcGVhcmFuY2UtcHJldmlld1wiKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaW1wb3J0T3V0Zml0KCk6IHZvaWQge1xuICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKVxuICBpbnB1dC5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwiZmlsZVwiKVxuICBpbnB1dC5zZXRBdHRyaWJ1dGUoXCJhY2NlcHRcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpXG4gIGlucHV0LmNsaWNrKClcblxuICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgZXZlbnQgPT4ge1xuICAgIGlmICghZXZlbnQudGFyZ2V0KSByZXR1cm5cbiAgICBjb25zdCBmaWxlcyA9IChldmVudC50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCkuZmlsZXNcbiAgICBpZiAoIWZpbGVzKSByZXR1cm5cbiAgICBjb25zdCBmaWxlID0gZmlsZXNbMF1cbiAgICBpZiAoIWZpbGUpIHJldHVyblxuICAgIHZvaWQgZmlsZS50ZXh0KCkudGhlbihhc3luYyB2YWx1ZSA9PiB7XG4gICAgICBpZiAoIXZhbHVlKSByZXR1cm5cblxuICAgICAgY29uc3Qgb3V0Zml0OiBQYXJzYWJsZUl0ZW1bXSA9IEpTT04ucGFyc2UodmFsdWUpXG4gICAgICBjb25zdCBhdmF0YXIgPSBTYWNoYS5BdmF0YXIuYXZhdGFyc1tcIiNhcHBlYXJhbmNlLXByZXZpZXdcIl1cbiAgICAgIGlmICghYXZhdGFyKSByZXR1cm5cblxuICAgICAgYXdhaXQgd2Vhck91dGZpdChhdmF0YXIsIG91dGZpdClcbiAgICB9KVxuICB9KVxufVxuXG5mdW5jdGlvbiByZW1vdmVDbG90aGVzKCk6IHZvaWQge1xuICBjb25zdCBhdmF0YXIgPSBTYWNoYS5BdmF0YXIuYXZhdGFyc1tcIiNhcHBlYXJhbmNlLXByZXZpZXdcIl1cbiAgaWYgKCFhdmF0YXIpIHJldHVyblxuXG4gIGZvciAobGV0IGkgPSBhdmF0YXIuY2hpbGRyZW4ubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBjb25zdCBpdGVtUmVuZGVyID0gYXZhdGFyLmNoaWxkcmVuW2ldXG4gICAgaWYgKCFpdGVtUmVuZGVyKSBjb250aW51ZVxuXG4gICAgY29uc3QgaXRlbSA9IGl0ZW1SZW5kZXIuZ2V0SXRlbSgpXG4gICAgaWYgKFNhY2hhLkF2YXRhci5yZW1vdmVJdGVtRnJvbUFsbEF2YXRhcnMoaXRlbSkpIHtcbiAgICAgICQoYCNhcHBlYXJhbmNlLWl0ZW0tJHtpdGVtLl9pZH1gKS5yZW1vdmVDbGFzcyhcInNlbGVjdGVkXCIpXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBvcGVuR3JvdXAoZ3JvdXA6IG51bWJlcik6IFByb21pc2U8SFRNTERpdkVsZW1lbnQgfCBudWxsPiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZTxIVE1MRGl2RWxlbWVudCB8IG51bGw+KChyZXNvbHZlKTogdm9pZCA9PiB7XG4gICAgY29uc3QgZ3JvdXBDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxEaXZFbGVtZW50PihcbiAgICAgIGAjYXBwZWFyYW5jZS1pdGVtcy1ncm91cC0ke2dyb3VwfWBcbiAgICApXG4gICAgaWYgKGdyb3VwQ29udGFpbmVyKSByZXR1cm4gcmVzb2x2ZShncm91cENvbnRhaW5lcilcblxuICAgIGNvbnN0IGF2YXRhciA9IFNhY2hhLkF2YXRhci5hdmF0YXJzW1wiI2FwcGVhcmFuY2UtcHJldmlld1wiXVxuICAgIGlmICghYXZhdGFyKSByZXR1cm4gcmVzb2x2ZShudWxsKVxuXG4gICAgdm9pZCAkLmdldChcbiAgICAgIGAvcGxheWVyL29wZW5Hcm91cC8ke2dyb3VwfWAsXG4gICAgICB7IHdvcm5JdGVtczogYXZhdGFyLmdldEl0ZW1zVG9TYXZlKCkgfSxcbiAgICAgICh2aWV3OiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICAgICAgJCh2aWV3KS5oaWRlKCkuYXBwZW5kVG8oXCIjYXBwZWFyYW5jZS1pdGVtc1wiKVxuICAgICAgICByZXNvbHZlKFxuICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTERpdkVsZW1lbnQ+KFxuICAgICAgICAgICAgYCNhcHBlYXJhbmNlLWl0ZW1zLWdyb3VwLSR7Z3JvdXB9YFxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgfVxuICAgIClcbiAgfSlcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG9wZW5DYXRlZ29yeShcbiAgY2F0ZWdvcnk6IHN0cmluZ1xuKTogUHJvbWlzZTxIVE1MRGl2RWxlbWVudCB8IG51bGw+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlPEhUTUxEaXZFbGVtZW50IHwgbnVsbD4oKHJlc29sdmUpOiB2b2lkID0+IHtcbiAgICBjb25zdCBjYXRlZ29yeUNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTERpdkVsZW1lbnQ+KFxuICAgICAgYCNhcHBlYXJhbmNlLWl0ZW1zLWNhdGVnb3J5LSR7Y2F0ZWdvcnl9YFxuICAgIClcbiAgICBpZiAoY2F0ZWdvcnlDb250YWluZXIpIHJldHVybiByZXNvbHZlKGNhdGVnb3J5Q29udGFpbmVyKVxuXG4gICAgdm9pZCAkLnBvc3QoYC9wbGF5ZXIvb3BlbkNhdGVnb3J5LyR7Y2F0ZWdvcnl9YCwgKHZpZXc6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgICAgJCh2aWV3KS5oaWRlKCkuYXBwZW5kVG8oXCIjYXBwZWFyYW5jZS1pdGVtc1wiKVxuICAgICAgcmVzb2x2ZShcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRGl2RWxlbWVudD4oXG4gICAgICAgICAgYCNhcHBlYXJhbmNlLWl0ZW1zLWNhdGVnb3J5LSR7Y2F0ZWdvcnl9YFxuICAgICAgICApXG4gICAgICApXG4gICAgfSlcbiAgfSlcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdlYXJPdXRmaXQoXG4gIGF2YXRhcjogQXZhdGFyLFxuICBvdXRmaXQ6IFBhcnNhYmxlSXRlbVtdXG4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgJC5mbGF2ck5vdGlmKHRyYW5zbGF0ZS5hcHBlYXJhbmNlLmZhdm91cml0ZXMuaW1wb3J0aW5nKVxuXG4gIC8vIEdldCBhbGwgY2F0ZWdvcmllc1xuICBjb25zdCBjYXRlZ29yaWVzID0gbmV3IFNldDxzdHJpbmc+KClcbiAgZm9yIChjb25zdCBjbG90aGluZyBvZiBvdXRmaXQpXG4gICAgaWYgKCFhdmFpbGFibGVJdGVtc1tjbG90aGluZy5pZF0pIGNhdGVnb3JpZXMuYWRkKGNsb3RoaW5nLnR5cGUpXG5cbiAgLy8gT3BlbiBhbGwgY2F0ZWdvcmllc1xuICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICBBcnJheS5mcm9tKGNhdGVnb3JpZXMudmFsdWVzKCkpLm1hcChhc3luYyBjYXRlZ29yeSA9PlxuICAgICAgb3BlbkNhdGVnb3J5KGNhdGVnb3J5KVxuICAgIClcbiAgKVxuXG4gIC8vIEdldCBhbGwgZ3JvdXBzXG4gIGNvbnN0IGdyb3VwcyA9IG5ldyBTZXQ8bnVtYmVyPigpXG4gIGZvciAoY29uc3QgY2xvdGhpbmcgb2Ygb3V0Zml0KVxuICAgIGlmIChcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWdyb3VwPVwiJHtjbG90aGluZy5ncm91cH1cIl1gKSAmJlxuICAgICAgIWF2YWlsYWJsZUl0ZW1zW2Nsb3RoaW5nLmlkXVxuICAgIClcbiAgICAgIGdyb3Vwcy5hZGQoY2xvdGhpbmcuZ3JvdXApXG5cbiAgLy8gT3BlbiBhbGwgZ3JvdXBzXG4gIGF3YWl0IFByb21pc2UuYWxsKFxuICAgIEFycmF5LmZyb20oZ3JvdXBzLnZhbHVlcygpKS5tYXAoYXN5bmMgZ3JvdXAgPT4gb3Blbkdyb3VwKGdyb3VwKSlcbiAgKVxuXG4gIC8vIEdldCB0aGUgaXRlbXMgZnJvbSBgYXZhaWxhYmxlSXRlbXNgXG4gIGNvbnN0IHdvcm5JdGVtczogSXRlbVtdID0gW11cbiAgZm9yIChjb25zdCBjbG90aGluZyBvZiBvdXRmaXQpIHtcbiAgICBjb25zdCBpdGVtID0gYXZhaWxhYmxlSXRlbXNbY2xvdGhpbmcuaWRdXG4gICAgaWYgKGl0ZW0pIHdvcm5JdGVtcy5wdXNoKGl0ZW0pXG4gIH1cblxuICByZW1vdmVDbG90aGVzKClcbiAgYXZhdGFyLmFkZEl0ZW1zKHdvcm5JdGVtcylcbiAgaW5pdGlhbGl6ZVNlbGVjdGVkSXRlbXMoKVxuICBpbml0aWFsaXplSGlkZGVuQ2F0ZWdvcmllcygpXG5cbiAgY29uc3QgYXZhdGFyQWN0aW9ucyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXZhdGFyLWFjdGlvbnNcIilcbiAgaWYgKGF2YXRhckFjdGlvbnMpIGF2YXRhckFjdGlvbnMuc3R5bGUuZGlzcGxheSA9IFwiaW5pdGlhbFwiXG5cbiAgJC5mbGF2ck5vdGlmKHRyYW5zbGF0ZS5hcHBlYXJhbmNlLmZhdm91cml0ZXMuaW1wb3J0ZWQpXG59XG4iLCJpbXBvcnQgdHlwZSB7IFRlbXBsYXRlIH0gZnJvbSBcImhvZ2FuLmpzXCJcbmltcG9ydCB0eXBlIHsgQXBwZWFyYW5jZUNhdGVnb3J5IH0gZnJvbSBcIi4uL3RlbXBsYXRlcy9pbnRlcmZhY2VzL2FwcGVhcmFuY2VfY2F0ZWdvcnlcIlxuaW1wb3J0IHR5cGUgeyBBcHBlYXJhbmNlR3JvdXAgfSBmcm9tIFwiLi4vdGVtcGxhdGVzL2ludGVyZmFjZXMvYXBwZWFyYW5jZV9ncm91cFwiXG5pbXBvcnQgd2FyZHJvYmUgZnJvbSBcIi4vd2FyZHJvYmVcIlxuXG5leHBvcnQgZnVuY3Rpb24gdW5sb2FkSGlkZGVuQ2F0ZWdvcmllcygpOiB2b2lkIHtcbiAgY29uc3QgaGlkZGVuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MRGl2RWxlbWVudD4oXG4gICAgXCIjYXBwZWFyYW5jZS1pdGVtcyAuYXBwZWFyYW5jZS1pdGVtcy1jYXRlZ29yeTpub3QoLmFjdGl2ZSk6bm90KFtkYXRhLWNhdGVnb3J5bmFtZV0pLCAjYXBwZWFyYW5jZS1pdGVtcyBzY3JpcHQsIGJvZHk+c2NyaXB0XCJcbiAgKVxuICBmb3IgKGNvbnN0IGRpdiBvZiBoaWRkZW4pIHtcbiAgICBkaXYucmVtb3ZlKClcbiAgfVxufVxuXG4vKipcbiAqIFBsYWNlIHRoZSBzYXZlZCBncm91cHMgb24gdGhlIERPTSBhcyBpZiBpdCB3YXMgRWxkYXJ5YSBkb2luZyBpdC5cbiAqIEByZXR1cm5zIHRoZSBhc3NvY2lhdGVkIGBBcHBlYXJhbmNlQ2F0ZWdvcnlgIGlmIGl0J3MgZm91bmQgaW4gdGhlIHdhcmRyb2JlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbG9hZEhpZGRlbkNhdGVnb3J5KGNvZGU6IHN0cmluZyk6IEFwcGVhcmFuY2VDYXRlZ29yeSB8IG51bGwge1xuICBjb25zdCBjYXRlZ29yeSA9IHdhcmRyb2JlLmdldENhdGVnb3JpZXMoKS5maW5kKGMgPT4gYy5jYXRlZ29yeSA9PT0gY29kZSlcbiAgaWYgKCFjYXRlZ29yeSkgcmV0dXJuIG51bGxcblxuICBjb25zdCBncm91cHMgPSB3YXJkcm9iZS5nZXRDYXRlZ29yeUdyb3VwcyhjYXRlZ29yeS5jYXRlZ29yeWlkKVxuICBjb25zdCBpdGVtVGVtcGxhdGU6IFRlbXBsYXRlID0gcmVxdWlyZShcIi4uL3RlbXBsYXRlcy9odG1sL2FwcGVhcmFuY2VfaXRlbS5odG1sXCIpXG4gIGNvbnN0IGdyb3VwVGVtcGxhdGU6IFRlbXBsYXRlID0gcmVxdWlyZShcIi4uL3RlbXBsYXRlcy9odG1sL2FwcGVhcmFuY2VfaXRlbXNfZ3JvdXAuaHRtbFwiKVxuICBkb2N1bWVudFxuICAgIC5xdWVyeVNlbGVjdG9yPEhUTUxEaXZFbGVtZW50PihcIiNhcHBlYXJhbmNlLWl0ZW1zXCIpXG4gICAgPy5pbnNlcnRBZGphY2VudEhUTUwoXG4gICAgICBcImJlZm9yZWVuZFwiLFxuICAgICAgZ3JvdXBzXG4gICAgICAgIC5tYXAoZ3JvdXAgPT5cbiAgICAgICAgICBncm91cFRlbXBsYXRlLnJlbmRlcih7XG4gICAgICAgICAgICAuLi5ncm91cCxcbiAgICAgICAgICAgIGl0ZW1zOiB3YXJkcm9iZVxuICAgICAgICAgICAgICAuZ2V0SXRlbXMoZ3JvdXAuZ3JvdXApXG4gICAgICAgICAgICAgIC5tYXAoaXRlbSA9PiBpdGVtVGVtcGxhdGUucmVuZGVyKGl0ZW0pKVxuICAgICAgICAgICAgICAuam9pbihcIlxcblwiKSxcbiAgICAgICAgICB9KVxuICAgICAgICApXG4gICAgICAgIC5qb2luKFwiXFxuXCIpXG4gICAgKVxuICByZXR1cm4gY2F0ZWdvcnlcbn1cblxuLyoqXG4gKiBMb2FkIHRoZSBzYXZlZCBncm91cCBvbiB0aGUgRE9NIGFzIGlmIGl0IHdhcyBFbGRhcnlhIGRvaW5nIGl0LlxuICogQHJldHVybnMgdGhlIGFzc29jaWF0ZWQgYEFwcGVhcmFuY2VHcm91cGAgaWYgaXQncyBmb3VuZCBpbiB0aGUgd2FyZHJvYmUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsb2FkSGlkZGVuR3JvdXAoaWQ6IG51bWJlcik6IEFwcGVhcmFuY2VHcm91cCB8IG51bGwge1xuICBjb25zdCBncm91cCA9IHdhcmRyb2JlLmdldEdyb3VwKGlkKVxuICBpZiAoIWdyb3VwKSByZXR1cm4gbnVsbFxuXG4gIGNvbnN0IGl0ZW1UZW1wbGF0ZTogVGVtcGxhdGUgPSByZXF1aXJlKFwiLi4vdGVtcGxhdGVzL2h0bWwvYXBwZWFyYW5jZV9pdGVtLmh0bWxcIilcbiAgY29uc3QgZ3JvdXBUZW1wbGF0ZTogVGVtcGxhdGUgPSByZXF1aXJlKFwiLi4vdGVtcGxhdGVzL2h0bWwvYXBwZWFyYW5jZV9pdGVtc19ncm91cC5odG1sXCIpXG4gIGRvY3VtZW50XG4gICAgLnF1ZXJ5U2VsZWN0b3I8SFRNTERpdkVsZW1lbnQ+KFwiI2FwcGVhcmFuY2UtaXRlbXNcIilcbiAgICA/Lmluc2VydEFkamFjZW50SFRNTChcbiAgICAgIFwiYmVmb3JlZW5kXCIsXG4gICAgICBncm91cFRlbXBsYXRlLnJlbmRlcih7XG4gICAgICAgIC4uLmdyb3VwLFxuICAgICAgICBpdGVtczogd2FyZHJvYmVcbiAgICAgICAgICAuZ2V0SXRlbXMoZ3JvdXAuZ3JvdXApXG4gICAgICAgICAgLm1hcChpdGVtID0+IGl0ZW1UZW1wbGF0ZS5yZW5kZXIoaXRlbSkpXG4gICAgICAgICAgLmpvaW4oXCJcXG5cIiksXG4gICAgICB9KVxuICAgIClcbiAgcmV0dXJuIGdyb3VwXG59XG4iLCJpbXBvcnQgdHlwZSB7IEl0ZW0gfSBmcm9tIFwiLi4vZWxkYXJ5YS9pdGVtXCJcbmltcG9ydCB0eXBlIHsgQXBwZWFyYW5jZUNhdGVnb3J5IH0gZnJvbSBcIi4uL3RlbXBsYXRlcy9pbnRlcmZhY2VzL2FwcGVhcmFuY2VfY2F0ZWdvcnlcIlxuaW1wb3J0IHR5cGUgeyBBcHBlYXJhbmNlR3JvdXAgfSBmcm9tIFwiLi4vdGVtcGxhdGVzL2ludGVyZmFjZXMvYXBwZWFyYW5jZV9ncm91cFwiXG5pbXBvcnQgdHlwZSB7IEFwcGVhcmFuY2VJdGVtIH0gZnJvbSBcIi4uL3RlbXBsYXRlcy9pbnRlcmZhY2VzL2FwcGVhcmFuY2VfaXRlbVwiXG5cbmNsYXNzIFdhcmRyb2JlIHtcbiAgcHJpdmF0ZSByZWFkb25seSBjYXRlZ29yaWVzOiBSZWNvcmQ8bnVtYmVyLCBBcHBlYXJhbmNlQ2F0ZWdvcnk+ID0ge31cblxuICBwcml2YXRlIHJlYWRvbmx5IGdyb3VwczogUmVjb3JkPG51bWJlciwgQXBwZWFyYW5jZUdyb3VwPiA9IHt9XG5cbiAgcHJpdmF0ZSByZWFkb25seSBpdGVtczogUmVjb3JkPG51bWJlciwgQXBwZWFyYW5jZUl0ZW0+ID0ge31cblxuICBhdmFpbGFibGVJdGVtcz86IFJlY29yZDxudW1iZXIsIEl0ZW0+XG5cbiAgZ2V0Q2F0ZWdvcmllcygpOiBBcHBlYXJhbmNlQ2F0ZWdvcnlbXSB7XG4gICAgcmV0dXJuIE9iamVjdC52YWx1ZXModGhpcy5jYXRlZ29yaWVzKVxuICB9XG5cbiAgZ2V0Q2F0ZWdvcnkoaWQ6IG51bWJlcik6IEFwcGVhcmFuY2VDYXRlZ29yeSB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuY2F0ZWdvcmllc1tpZF1cbiAgfVxuXG4gIGdldENhdGVnb3J5R3JvdXBzKGNhdGVnb3J5aWQ6IG51bWJlcik6IEFwcGVhcmFuY2VHcm91cFtdIHtcbiAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyh0aGlzLmdyb3VwcykuZmlsdGVyKFxuICAgICAgZ3JvdXAgPT4gZ3JvdXAuY2F0ZWdvcnlpZCA9PT0gY2F0ZWdvcnlpZFxuICAgIClcbiAgfVxuXG4gIGdldEdyb3VwKGlkOiBudW1iZXIpOiBBcHBlYXJhbmNlR3JvdXAgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLmdyb3Vwc1tpZF1cbiAgfVxuXG4gIGdldEdyb3VwcygpOiBBcHBlYXJhbmNlR3JvdXBbXSB7XG4gICAgcmV0dXJuIE9iamVjdC52YWx1ZXModGhpcy5ncm91cHMpXG4gIH1cblxuICBnZXRJdGVtKGlkOiBudW1iZXIpOiBBcHBlYXJhbmNlSXRlbSB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuaXRlbXNbaWRdXG4gIH1cblxuICBnZXRJdGVtcyhncm91cDogbnVtYmVyKTogQXBwZWFyYW5jZUl0ZW1bXSB7XG4gICAgcmV0dXJuIE9iamVjdC52YWx1ZXModGhpcy5pdGVtcykuZmlsdGVyKGl0ZW0gPT4gaXRlbS5ncm91cCA9PT0gZ3JvdXApXG4gIH1cblxuICBzZXRDYXRlZ29yeShjYXRlZ29yeTogQXBwZWFyYW5jZUNhdGVnb3J5KTogdm9pZCB7XG4gICAgdGhpcy5jYXRlZ29yaWVzW2NhdGVnb3J5LmNhdGVnb3J5aWRdID0gY2F0ZWdvcnlcbiAgfVxuXG4gIHNldEdyb3VwKGdyb3VwOiBBcHBlYXJhbmNlR3JvdXApOiB2b2lkIHtcbiAgICB0aGlzLmdyb3Vwc1tncm91cC5ncm91cF0gPSBncm91cFxuICB9XG5cbiAgc2V0SXRlbShpdGVtOiBBcHBlYXJhbmNlSXRlbSk6IHZvaWQge1xuICAgIHRoaXMuaXRlbXNbaXRlbS5pdGVtaWRdID0gaXRlbVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBXYXJkcm9iZSgpXG4iLCJpbXBvcnQgeyB0cmFuc2xhdGUgfSBmcm9tIFwiLi4vaTE4bi90cmFuc2xhdGVcIlxuaW1wb3J0IHR5cGUgeyBDYXJvdXNlbE5ld3MgfSBmcm9tIFwiLi4vdGVtcGxhdGVzL2ludGVyZmFjZXMvY2Fyb3VzZWxfbmV3c1wiXG5cbmV4cG9ydCBjb25zdCBjYXJvdXNlbEJlZW1vb3ZBbm5veWFuY2VzOiBDYXJvdXNlbE5ld3MgPSB7XG4gIGJhY2tncm91bmRJbWFnZTpcbiAgICBcImh0dHBzOi8vZ2l0bGFiLmNvbS9OYXRvQm9yYW0vZWxkYXJ5YS1lbmhhbmNlbWVudHMvLS9yYXcvbWFzdGVyL2ltYWdlcy9jYXJvdXNlbF9iZWVtb292X2Fubm95YW5jZXMucG5nXCIsXG4gIGg0OiB0cmFuc2xhdGUuY2Fyb3VzZWwuYmVlbW9vdl9hbm5veWFuY2VzLnRpdGxlLFxuICBocmVmOiBcImh0dHBzOi8vZ2l0bGFiLmNvbS9OYXRvQm9yYW0vQmVlbW9vdi1Bbm5veWFuY2VzXCIsXG4gIGlkOiBcImNhcm91c2VsLWJlZW1vb3YtYW5ub3lhbmNlc1wiLFxuICBwOiB0cmFuc2xhdGUuY2Fyb3VzZWwuYmVlbW9vdl9hbm5veWFuY2VzLnN1YnRpdGxlLFxufVxuIiwiaW1wb3J0IHsgdHJhbnNsYXRlIH0gZnJvbSBcIi4uL2kxOG4vdHJhbnNsYXRlXCJcbmltcG9ydCB0eXBlIHsgQ2Fyb3VzZWxOZXdzIH0gZnJvbSBcIi4uL3RlbXBsYXRlcy9pbnRlcmZhY2VzL2Nhcm91c2VsX25ld3NcIlxuXG5leHBvcnQgY29uc3QgY2Fyb3VzZWxEb3dubG9hZEZhY2U6IENhcm91c2VsTmV3cyA9IHtcbiAgYmFja2dyb3VuZEltYWdlOlxuICAgIFwiaHR0cHM6Ly9naXRsYWIuY29tL05hdG9Cb3JhbS9lbGRhcnlhLWVuaGFuY2VtZW50cy8tL3Jhdy9tYXN0ZXIvaW1hZ2VzL2Nhcm91c2VsX2Rvd25sb2FkX2ZhY2UucG5nXCIsXG4gIGlkOiBcImNhcm91c2VsLWRvd25sb2FkLWZhY2VcIixcbiAgaDQ6IHRyYW5zbGF0ZS5jYXJvdXNlbC5kb3dubG9hZF9mYWNlLnRpdGxlLFxuICBwOiB0cmFuc2xhdGUuY2Fyb3VzZWwuZG93bmxvYWRfZmFjZS5zdWJ0aXRsZSxcbn1cbiIsImltcG9ydCB7IHRyYW5zbGF0ZSB9IGZyb20gXCIuLi9pMThuL3RyYW5zbGF0ZVwiXG5pbXBvcnQgdHlwZSB7IENhcm91c2VsTmV3cyB9IGZyb20gXCIuLi90ZW1wbGF0ZXMvaW50ZXJmYWNlcy9jYXJvdXNlbF9uZXdzXCJcblxuZXhwb3J0IGNvbnN0IGNhcm91c2VsRG93bmxvYWRHdWFyZGlhbjogQ2Fyb3VzZWxOZXdzID0ge1xuICBiYWNrZ3JvdW5kSW1hZ2U6XG4gICAgXCJodHRwczovL2dpdGxhYi5jb20vTmF0b0JvcmFtL2VsZGFyeWEtZW5oYW5jZW1lbnRzLy0vcmF3L21hc3Rlci9pbWFnZXMvY2Fyb3VzZWxfZG93bmxvYWRfZ3VhcmRpYW4ucG5nXCIsXG4gIGlkOiBcImNhcm91c2VsLWRvd25sb2FkLWd1YXJkaWFuXCIsXG4gIGg0OiB0cmFuc2xhdGUuY2Fyb3VzZWwuZG93bmxvYWRfZ3VhcmRpYW4udGl0bGUsXG4gIHA6IHRyYW5zbGF0ZS5jYXJvdXNlbC5kb3dubG9hZF9ndWFyZGlhbi5zdWJ0aXRsZSxcbn1cbiIsImltcG9ydCB7IHRyYW5zbGF0ZSB9IGZyb20gXCIuLi9pMThuL3RyYW5zbGF0ZVwiXG5pbXBvcnQgdHlwZSB7IENhcm91c2VsTmV3cyB9IGZyb20gXCIuLi90ZW1wbGF0ZXMvaW50ZXJmYWNlcy9jYXJvdXNlbF9uZXdzXCJcblxuZXhwb3J0IGNvbnN0IGNhcm91c2VsRUU6IENhcm91c2VsTmV3cyA9IHtcbiAgYmFja2dyb3VuZEltYWdlOlxuICAgIFwiaHR0cHM6Ly9naXRsYWIuY29tL05hdG9Cb3JhbS9lbGRhcnlhLWVuaGFuY2VtZW50cy8tL3Jhdy9tYXN0ZXIvaW1hZ2VzL2Nhcm91c2VsX2VsZGFyeWFfZW5oYW5jZW1lbnRzLnBuZ1wiLFxuICBoNDogdHJhbnNsYXRlLmNhcm91c2VsLmVsZGFyeWFfZW5oYW5jZW1lbnRzLnRpdGxlLFxuICBocmVmOiBHTS5pbmZvLnNjcmlwdC5uYW1lc3BhY2UsXG4gIGlkOiBcImNhcm91c2VsLWVsZGFyeWEtZW5oYW5jZW1lbnRzXCIsXG4gIHA6IHRyYW5zbGF0ZS5jYXJvdXNlbC5lbGRhcnlhX2VuaGFuY2VtZW50cy5zdWJ0aXRsZSxcbn1cbiIsImltcG9ydCB7IHRyYW5zbGF0ZSB9IGZyb20gXCIuLi9pMThuL3RyYW5zbGF0ZVwiXG5pbXBvcnQgdHlwZSB7IENhcm91c2VsTmV3cyB9IGZyb20gXCIuLi90ZW1wbGF0ZXMvaW50ZXJmYWNlcy9jYXJvdXNlbF9uZXdzXCJcblxuZXhwb3J0IGNvbnN0IGNhcm91c2VsVGFrZW92ZXI6IENhcm91c2VsTmV3cyA9IHtcbiAgYmFja2dyb3VuZEltYWdlOlxuICAgIFwiaHR0cHM6Ly9naXRsYWIuY29tL05hdG9Cb3JhbS9lbGRhcnlhLWVuaGFuY2VtZW50cy8tL3Jhdy9tYXN0ZXIvaW1hZ2VzL2Nhcm91c2VsX3Rha2VvdmVyLnBuZ1wiLFxuICBpZDogXCJjYXJvdXNlbC10YWtlb3ZlclwiLFxuICBoNDogdHJhbnNsYXRlLmNhcm91c2VsLnRha2VvdmVyLnRpdGxlLFxuICBwOiB0cmFuc2xhdGUuY2Fyb3VzZWwudGFrZW92ZXIuc3VidGl0bGUsXG59XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55ICovXG4vKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW5zYWZlLW1lbWJlci1hY2Nlc3MgKi9cbmltcG9ydCB7IENvbnNvbGUgfSBmcm9tIFwiLi9jb25zb2xlXCJcbmltcG9ydCB7IExvY2FsU3RvcmFnZSB9IGZyb20gXCIuL2xvY2FsX3N0b3JhZ2UvbG9jYWxfc3RvcmFnZVwiXG5cbmV4cG9ydCBmdW5jdGlvbiBsb2FkQ2hlYXRDb2RlcygpOiB2b2lkIHtcbiAgLy8gY29uc3QgY2hlYXRlZCA9IHdpbmRvdyBhcyB1bmtub3duIGFzIENoZWF0ZWRXaW5kb3dcbiAgOyh3aW5kb3cgYXMgdW5rbm93biBhcyBDaGVhdGVkV2luZG93KS51bmxvY2tFbmhhbmNlbWVudHMgPSB1bmxvY2tFbmhhbmNlbWVudHNcbiAgOyh3aW5kb3cgYXMgdW5rbm93biBhcyBDaGVhdGVkV2luZG93KS5sb2NrRW5oYW5jZW1lbnRzID0gbG9ja0VuaGFuY2VtZW50c1xufVxuXG5hc3luYyBmdW5jdGlvbiB1bmxvY2tFbmhhbmNlbWVudHMoKTogUHJvbWlzZTx2b2lkPiB7XG4gIExvY2FsU3RvcmFnZS51bmxvY2tlZCA9IHRydWVcbiAgQ29uc29sZS5pbmZvKFwiVW5sb2NrZWQgZW5oYW5jZW1lbnRzLlwiKVxuICBhd2FpdCByZWxvYWQoKVxufVxuXG5hc3luYyBmdW5jdGlvbiBsb2NrRW5oYW5jZW1lbnRzKCk6IFByb21pc2U8dm9pZD4ge1xuICBMb2NhbFN0b3JhZ2UudW5sb2NrZWQgPSBmYWxzZVxuICBDb25zb2xlLmluZm8oXCJMb2NrZWQgZW5oYW5jZW1lbnRzLlwiKVxuICBhd2FpdCByZWxvYWQoKVxufVxuXG5hc3luYyBmdW5jdGlvbiByZWxvYWQoKTogUHJvbWlzZTx2b2lkPiB7XG4gIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDAwKSlcbiAgQ29uc29sZS5sb2coXCJSZWxvYWRpbmcuLi5cIilcbiAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDEwMDApKVxuICBsb2NhdGlvbi5yZWxvYWQoKVxufVxuXG5pbnRlcmZhY2UgQ2hlYXRlZFdpbmRvdyBleHRlbmRzIFdpbmRvdyB7XG4gIHVubG9ja0VuaGFuY2VtZW50czogKCkgPT4gUHJvbWlzZTx2b2lkPlxuICBsb2NrRW5oYW5jZW1lbnRzOiAoKSA9PiBQcm9taXNlPHZvaWQ+XG59XG4iLCJpbXBvcnQgeyBMb2NhbFN0b3JhZ2UgfSBmcm9tIFwiLi9sb2NhbF9zdG9yYWdlL2xvY2FsX3N0b3JhZ2VcIlxuXG5leHBvcnQgY2xhc3MgQ29uc29sZSB7XG4gIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IGNvbnNvbGUgPSBjb25zb2xlXG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgZ2V0IGRlYnVnZ2luZygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gTG9jYWxTdG9yYWdlLmRlYnVnXG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBnZXQgdGltZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiBuZXcgRGF0ZSgpLnRvTG9jYWxlVGltZVN0cmluZygpXG4gIH1cblxuICBzdGF0aWMgYXNzZXJ0KFxuICAgIHZhbHVlOiB1bmtub3duLFxuICAgIG1lc3NhZ2U6IHN0cmluZyxcbiAgICAuLi5vcHRpb25hbFBhcmFtczogdW5rbm93bltdXG4gICk6IHZvaWQge1xuICAgIGlmICghdGhpcy5kZWJ1Z2dpbmcpIHJldHVyblxuICAgIHRoaXMuY29uc29sZS5hc3NlcnQodmFsdWUsIC4uLnRoaXMuZm9ybWF0KG1lc3NhZ2UpLCAuLi5vcHRpb25hbFBhcmFtcylcbiAgfVxuXG4gIHN0YXRpYyBkZWJ1ZyhtZXNzYWdlOiBzdHJpbmcsIC4uLm9wdGlvbmFsUGFyYW1zOiB1bmtub3duW10pOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuZGVidWdnaW5nKSByZXR1cm5cbiAgICB0aGlzLmNvbnNvbGUuZGVidWcoLi4udGhpcy5mb3JtYXQobWVzc2FnZSksIC4uLm9wdGlvbmFsUGFyYW1zKVxuICB9XG5cbiAgc3RhdGljIGVycm9yKG1lc3NhZ2U6IHN0cmluZywgLi4ub3B0aW9uYWxQYXJhbXM6IHVua25vd25bXSk6IHZvaWQge1xuICAgIHRoaXMuY29uc29sZS5lcnJvciguLi50aGlzLmZvcm1hdChtZXNzYWdlKSwgLi4ub3B0aW9uYWxQYXJhbXMpXG4gIH1cblxuICBzdGF0aWMgaW5mbyhtZXNzYWdlOiBzdHJpbmcsIC4uLm9wdGlvbmFsUGFyYW1zOiB1bmtub3duW10pOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuZGVidWdnaW5nKSByZXR1cm5cbiAgICB0aGlzLmNvbnNvbGUuaW5mbyguLi50aGlzLmZvcm1hdChtZXNzYWdlKSwgLi4ub3B0aW9uYWxQYXJhbXMpXG4gIH1cblxuICBzdGF0aWMgbG9nKG1lc3NhZ2U6IHN0cmluZywgLi4ub3B0aW9uYWxQYXJhbXM6IHVua25vd25bXSk6IHZvaWQge1xuICAgIGlmICghdGhpcy5kZWJ1Z2dpbmcpIHJldHVyblxuICAgIHRoaXMuY29uc29sZS5sb2coLi4udGhpcy5mb3JtYXQobWVzc2FnZSksIC4uLm9wdGlvbmFsUGFyYW1zKVxuICB9XG5cbiAgc3RhdGljIHdhcm4obWVzc2FnZTogc3RyaW5nLCAuLi5vcHRpb25hbFBhcmFtczogdW5rbm93bltdKTogdm9pZCB7XG4gICAgdGhpcy5jb25zb2xlLndhcm4oLi4udGhpcy5mb3JtYXQobWVzc2FnZSksIC4uLm9wdGlvbmFsUGFyYW1zKVxuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgZm9ybWF0KG1lc3NhZ2U6IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gW1xuICAgICAgYCVjWyVjJHt0aGlzLnRpbWV9JWNdYCxcbiAgICAgIFwiY29sb3I6Izk3NDJjMlwiLFxuICAgICAgXCJjb2xvcjpub25lXCIsXG4gICAgICBcImNvbG9yOiM5NzQyYzJcIixcbiAgICAgIG1lc3NhZ2UsXG4gICAgXVxuICB9XG59XG4iLCJpbXBvcnQgeyBDb25zb2xlIH0gZnJvbSBcIi4vY29uc29sZVwiXG5pbXBvcnQgeyB0cmFuc2xhdGUgfSBmcm9tIFwiLi9pMThuL3RyYW5zbGF0ZVwiXG5cbmZ1bmN0aW9uIGRvd25sb2FkQ2FudmFzKGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQsIG5hbWU6IHN0cmluZyk6IHZvaWQge1xuICBjYW52YXMudG9CbG9iKFxuICAgIGJsb2IgPT4ge1xuICAgICAgaWYgKCFibG9iKSB7XG4gICAgICAgIENvbnNvbGUuZXJyb3IoXCJDYW52YXMgaXMgZW1wdHlcIilcbiAgICAgICAgJC5mbGF2ck5vdGlmKHRyYW5zbGF0ZS5lcnJvci5kb3dubG9hZENhbnZhcylcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHVybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYilcblxuICAgICAgY29uc3QgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpXG4gICAgICBhLnNldEF0dHJpYnV0ZShcImhyZWZcIiwgdXJsKVxuICAgICAgYS5zZXRBdHRyaWJ1dGUoXCJkb3dubG9hZFwiLCBgJHtuYW1lfS5wbmdgKVxuICAgICAgYS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCJcblxuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChhKVxuICAgICAgYS5jbGljaygpXG4gICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGEpXG5cbiAgICAgIFVSTC5yZXZva2VPYmplY3RVUkwodXJsKVxuICAgIH0sXG4gICAgXCJpbWFnZS9wbmdcIixcbiAgICAxXG4gIClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRvd25sb2FkRmFjZSgpOiB2b2lkIHtcbiAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MQ2FudmFzRWxlbWVudD4oXG4gICAgXCIjYXZhdGFyLW1lbnUtY29udGFpbmVyIGNhbnZhc1wiXG4gIClcbiAgaWYgKCFjYW52YXMpIHtcbiAgICBDb25zb2xlLndhcm4oXCJDb3VsZG4ndCBmaW5kIHRoZSBndWFyZGlhbidzIGZhY2UuXCIpXG4gICAgcmV0dXJuXG4gIH1cblxuICBkb3dubG9hZENhbnZhcyhjYW52YXMsIFwiZmFjZVwiKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZG93bmxvYWRHdWFyZGlhbigpOiB2b2lkIHtcbiAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MQ2FudmFzRWxlbWVudD4oXG4gICAgXCIjaG9tZS1hdmF0YXItcGxheWVyIGNhbnZhc1wiXG4gIClcbiAgaWYgKCFjYW52YXMpIHtcbiAgICBDb25zb2xlLndhcm4oXCJDb3VsZG4ndCBmaW5kIHRoZSBndWFyZGlhbi5cIilcbiAgICByZXR1cm5cbiAgfVxuXG4gIGRvd25sb2FkQ2FudmFzKGNhbnZhcywgZ2V0TmFtZSgpID8/IFwiZ3VhcmRpYW5cIilcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRvd25sb2FkQXBwZWFyYW5jZSgpOiB2b2lkIHtcbiAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MQ2FudmFzRWxlbWVudD4oXG4gICAgXCIjYXBwZWFyYW5jZS1wcmV2aWV3IGNhbnZhc1wiXG4gIClcbiAgaWYgKCFjYW52YXMpIHtcbiAgICBDb25zb2xlLndhcm4oXCJDb3VsZG4ndCBmaW5kIHRoZSBndWFyZGlhbi5cIilcbiAgICByZXR1cm5cbiAgfVxuXG4gIGRvd25sb2FkQ2FudmFzKGNhbnZhcywgZ2V0TmFtZSgpID8/IFwiZ3VhcmRpYW5cIilcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRvd25sb2FkUHJvZmlsZSgpOiB2b2lkIHtcbiAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MQ2FudmFzRWxlbWVudD4oXG4gICAgXCIucGxheWVyUHJvZmlsZUF2YXRhciBjYW52YXNcIlxuICApXG4gIGNvbnN0IHRpdGxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MSGVhZGluZ0VsZW1lbnQ+KFxuICAgIFwiI21haW4tc2VjdGlvbiAuc2VjdGlvbi10aXRsZVwiXG4gIClcbiAgaWYgKCFjYW52YXMgfHwgIXRpdGxlKSByZXR1cm5cblxuICBkb3dubG9hZENhbnZhcyhjYW52YXMsIHRpdGxlLnRleHRDb250ZW50Py50cmltKCkgPz8gXCJndWFyZGlhblwiKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TmFtZSgpOiBzdHJpbmcgfCBudWxsIHtcbiAgcmV0dXJuIChcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2F2YXRhci1tZW51LWNvbnRhaW5lci1vdXRlcj5wXCIpPy50ZXh0Q29udGVudCA/P1xuICAgIG51bGxcbiAgKVxufVxuIiwiZXhwb3J0IGVudW0gRHVyYXRpb25Vbml0IHtcbiAgbWlsbGlzZWNvbmQgPSAxLFxuICBzZWNvbmQgPSAxMDAwICogbWlsbGlzZWNvbmQsXG4gIG1pbnV0ZSA9IDYwICogc2Vjb25kLFxuICBob3VyID0gNjAgKiBtaW51dGUsXG4gIGRheSA9IDI0ICogaG91cixcbiAgd2VlayA9IDcgKiBkYXksXG5cbiAgeWVhciA9ICgzNjUgKyAxIC8gNCAtIDEgLyAxMDAgKyAxIC8gNDAwKSAqIGRheSxcbiAgZGVjYWRlID0gMTAgKiB5ZWFyLFxuICBjZW50dXJ5ID0gMTAgKiBkZWNhZGUsXG4gIG1pbGxlbm5pdW0gPSAxMCAqIGNlbnR1cnksXG5cbiAgLy8gR2VvbG9naWMgdGltZSBzY2FsZVxuICBhZ2UgPSAxMCAqIG1pbGxlbm5pdW0sXG4gIHN1YmVwb2NoID0gMTAgKiBhZ2UsXG4gIGVwb2NoID0gMTAgKiBzdWJlcG9jaCxcbiAgcGVyaW9kID0gMTAgKiBlcG9jaCxcbiAgZXJhID0gMTAgKiBwZXJpb2QsXG4gIGVvbiA9IDEwICogZXJhLFxuXG4gIC8vIE5vbiBzZXF1aXR1clxuICBtb250aCA9IHllYXIgLyAxMixcbn1cblxuZXhwb3J0IGNsYXNzIER1cmF0aW9uIHtcbiAgY29uc3RydWN0b3IocmVhZG9ubHkgdmFsdWU6IG51bWJlciwgcmVhZG9ubHkgdW5pdDogRHVyYXRpb25Vbml0KSB7fVxuXG4gIGRpdmlkZShkdXJhdGlvbjogRHVyYXRpb24pOiBEdXJhdGlvbiB7XG4gICAgcmV0dXJuIG5ldyBEdXJhdGlvbih0aGlzLnZhbHVlIC8gZHVyYXRpb24udG8odGhpcy51bml0KS52YWx1ZSwgdGhpcy51bml0KVxuICB9XG5cbiAgbWludXMoZHVyYXRpb246IER1cmF0aW9uKTogRHVyYXRpb24ge1xuICAgIHJldHVybiBuZXcgRHVyYXRpb24odGhpcy52YWx1ZSAtIGR1cmF0aW9uLnRvKHRoaXMudW5pdCkudmFsdWUsIHRoaXMudW5pdClcbiAgfVxuXG4gIG11bHRpcGx5KGR1cmF0aW9uOiBEdXJhdGlvbik6IER1cmF0aW9uIHtcbiAgICByZXR1cm4gbmV3IER1cmF0aW9uKHRoaXMudmFsdWUgKiBkdXJhdGlvbi50byh0aGlzLnVuaXQpLnZhbHVlLCB0aGlzLnVuaXQpXG4gIH1cblxuICBwbHVzKGR1cmF0aW9uOiBEdXJhdGlvbik6IER1cmF0aW9uIHtcbiAgICByZXR1cm4gbmV3IER1cmF0aW9uKHRoaXMudmFsdWUgKyBkdXJhdGlvbi50byh0aGlzLnVuaXQpLnZhbHVlLCB0aGlzLnVuaXQpXG4gIH1cblxuICB0byh1bml0OiBEdXJhdGlvblVuaXQpOiBEdXJhdGlvbiB7XG4gICAgcmV0dXJuIG5ldyBEdXJhdGlvbigodGhpcy52YWx1ZSAqIHRoaXMudW5pdCkgLyB1bml0LCB1bml0KVxuICB9XG59XG4iLCIvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVudXNlZC12YXJzXG5pbnRlcmZhY2UgSlF1ZXJ5U3RhdGljIHtcbiAgZmxhdnI6IChkYXRhOiBmbGF2clBhcmFtcykgPT4gdm9pZFxuICBmbGF2ck5vdGlmOiAoXG4gICAgY29udGVudDogc3RyaW5nIHwgdW5rbm93bixcbiAgICBvcHRpb25zPzogUmVjb3JkPHN0cmluZywgdW5rbm93bj4sXG4gICAgaWQ/OiBudW1iZXIsXG4gICAgZm9yY2U/OiBib29sZWFuXG4gICkgPT4gdm9pZFxufVxuXG5pbnRlcmZhY2UgZmxhdnJQYXJhbXMge1xuICAvKiogQW5pbWF0ZS5jc3MgKi9cbiAgYW5pbWF0ZUNsb3Npbmc/OiBcImZhZGVPdXRcIiB8IFwiZmFkZU91dFVwXCJcbiAgLyoqIEFuaW1hdGUuY3NzICovXG4gIGFuaW1hdGVFbnRyYW5jZT86IFwiZmFkZUluXCIgfCBcImZhZGVJbkRvd25cIlxuICAvKiogQnV0dG9ucyBhcmUga2V5LXZhbHVlIHBhaXJzIHdoZXJlIHRoZSBrZXkgaXMgdGhlICAqL1xuICBidXR0b25zPzogUmVjb3JkPFxuICAgIHN0cmluZyxcbiAgICB7XG4gICAgICBzdHlsZT86IFwiY2xvc2VcIiB8IFwiZGVmYXVsdFwiXG4gICAgICB0ZXh0Pzogc3RyaW5nXG4gICAgICBhZGRDbGFzcz86IHN0cmluZ1xuICAgICAgLyoqIEByZXR1cm5zIHdoZXRoZXIgdGhlIHBvcHVwIHNob3VsZCBjbG9zZSAqL1xuICAgICAgYWN0aW9uPzogKCRjb250YWluZXI6IEpRdWVyeSkgPT4gYm9vbGVhblxuICAgIH1cbiAgPlxuICAvKiogSFRNTCBjb250ZW50IG9mIHRoZSBmbGF2ciAqL1xuICBjb250ZW50Pzogc3RyaW5nXG4gIC8qKiBUeXBlIG9mIGRpYWxvZy4gKi9cbiAgZGlhbG9nPzogXCJhbGVydFwiIHwgXCJjb25maXJtXCIgfCBcImZvcm1cIiB8IFwicHJvbXB0XCJcbiAgb25CdWlsZD86ICgkY29udGFpbmVyOiBKUXVlcnkpID0+IHZvaWRcbiAgb25DYW5jZWw/OiAoKSA9PiB2b2lkXG4gIG9uQ29uZmlybT86ICgpID0+IHZvaWRcbiAgb25TaG93PzogKCkgPT4gdm9pZFxuICBwcm9tcHQ/OiB7XG4gICAgLyoqIERlZmF1bHQgdmFsdWUgKi9cbiAgICB2YWx1ZTogc3RyaW5nXG4gIH1cblxuICB0aXRsZT86IHN0cmluZ1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIHRyaW1JY29uKGljb246IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IHRpbGRlID0gaWNvbi5sYXN0SW5kZXhPZihcIn5cIilcbiAgY29uc3QgZG90ID0gaWNvbi5sYXN0SW5kZXhPZihcIi5cIilcbiAgaWYgKHRpbGRlID09PSAtMSB8fCBkb3QgPT09IC0xKSByZXR1cm4gaWNvblxuXG4gIHJldHVybiBpY29uLnN1YnN0cmluZygwLCB0aWxkZSkgKyBpY29uLnN1YnN0cmluZyhkb3QpXG59XG4iLCJpbXBvcnQgdHlwZSB7IFRyYW5zbGF0aW9uIH0gZnJvbSBcIi4vdHJhbnNsYXRpb25cIlxuXG5leHBvcnQgY29uc3QgZW46IFRyYW5zbGF0aW9uID0ge1xuICBob21lOiB7XG4gICAgZm9ydW06IFwiRm9ydW1cIixcbiAgICB0YWtlb3ZlcjogXCJUYWtlb3ZlclwiLFxuICB9LFxuICB0YWtlb3Zlcjoge1xuICAgIGJvdWdodDogKG5hbWUsIHByaWNlKSA9PlxuICAgICAgYEJvdWdodCA8c3Ryb25nPiR7bmFtZX08L3N0cm9uZz4gZm9yIDxzdHJvbmcgY2xhc3M9XCJwcmljZS1pdGVtXCI+JHtwcmljZX08L3N0cm9uZz4gPHNwYW4gY2xhc3M9XCJtYWFuYS1pY29uXCIgYWx0PVwibWFhbmFzXCI+PC9zcGFuPi5gLFxuICAgIGRpc2FibGVkOiBcIlRha2VvdmVyIG1vZGUgZGlzYWJsZWQuXCIsXG4gICAgZW5hYmxlZDogXCJUYWtlb3ZlciBtb2RlIGVuYWJsZWQuIFBsZWFzZSBkbyBub3QgaW50ZXJhY3Qgd2l0aCB0aGlzIHRhYi5cIixcbiAgfSxcbiAgY2Fyb3VzZWw6IHtcbiAgICBiZWVtb292X2Fubm95YW5jZXM6IHtcbiAgICAgIHRpdGxlOiBcIkJlZW1vb3YgQW5ub3lhbmNlc1wiLFxuICAgICAgc3VidGl0bGU6IFwiQmxvY2sgc29tZSBvZiBFbGRhcnlhJ3MgYW5ub3lhbmNlcy5cIixcbiAgICB9LFxuICAgIGRvd25sb2FkX2ZhY2U6IHtcbiAgICAgIHRpdGxlOiBcIkRvd25sb2FkIHlvdXIgZ3VhcmRpYW4ncyBmYWNlIVwiLFxuICAgICAgc3VidGl0bGU6IFwiQ2xpY2sgaGVyZSB0byBkb3dubG9hZCB5b3VyIGd1YXJkaWFuJ3MgZmFjZS5cIixcbiAgICB9LFxuICAgIGRvd25sb2FkX2d1YXJkaWFuOiB7XG4gICAgICB0aXRsZTogXCJEb3dubG9hZCB5b3VyIGd1YXJkaWFuIVwiLFxuICAgICAgc3VidGl0bGU6IFwiQ2xpY2sgaGVyZSB0byBkb3dubG9hZCB5b3VyIGd1YXJkaWFuLlwiLFxuICAgIH0sXG4gICAgZWxkYXJ5YV9lbmhhbmNlbWVudHM6IHtcbiAgICAgIHRpdGxlOiBgJHtHTS5pbmZvLnNjcmlwdC5uYW1lfSB2JHtHTS5pbmZvLnNjcmlwdC52ZXJzaW9ufWAsXG4gICAgICBzdWJ0aXRsZTogR00uaW5mby5zY3JpcHQuZGVzY3JpcHRpb24sXG4gICAgfSxcbiAgICB0YWtlb3Zlcjoge1xuICAgICAgZGlzYWJsZV90YWtlb3ZlcjogXCJEaXNhYmxlIFRha2VvdmVyXCIsXG4gICAgICBlbmFibGVfdGFrZW92ZXI6IFwiRW5hYmxlIFRha2VvdmVyXCIsXG4gICAgICBzdWJ0aXRsZTogXCJHaXZlIHVwIHRoaXMgdGFiIHRvIHBlcmZvcm0gYXV0b21hdGVkIGFjdGlvbnMuXCIsXG4gICAgICB0aXRsZTogXCJUYWtlb3ZlclwiLFxuICAgIH0sXG4gIH0sXG4gIG1pbmlnYW1lczoge1xuICAgIHBsYXllZF9mb3I6IChuYW1lLCBtYWFuYXMpID0+XG4gICAgICBgUGxheWVkIDxzdHJvbmc+JHtuYW1lfTwvc3Ryb25nPiBmb3IgPHN0cm9uZyBjbGFzcz1cInByaWNlLWl0ZW1cIj4ke21hYW5hc308L3N0cm9uZz4gPHNwYW4gY2xhc3M9XCJtYWFuYS1pY29uXCIgYWx0PVwibWFhbmFzXCI+PC9zcGFuPiBlYXJuZWQuYCxcbiAgICBwbGF5ZWQ6IG5hbWUgPT4gYFBsYXllZCA8c3Ryb25nPiR7bmFtZX08L3N0cm9uZz4uYCxcbiAgICBwbGF5aW5nOiBuYW1lID0+IGBQbGF5aW5nIDxzdHJvbmc+JHtuYW1lfTwvc3Ryb25nPi4uLmAsXG4gIH0sXG4gIGFwcGVhcmFuY2U6IHtcbiAgICBidXR0b25zOiB7XG4gICAgICBiYWNrd2FyZDogXCJNb3ZlIGJhY2tcIixcbiAgICAgIGZvcndhcmQ6IFwiQnJpbmcgZm9yd2FyZFwiLFxuICAgIH0sXG4gICAgZmF2b3VyaXRlczoge1xuICAgICAgYnV0dG9uczoge1xuICAgICAgICBkb3dubG9hZDogXCJEb3dubG9hZCBQTkdcIixcbiAgICAgICAgZXhwb3J0OiBcIkV4cG9ydFwiLFxuICAgICAgICBpbXBvcnQ6IFwiSW1wb3J0XCIsXG4gICAgICB9LFxuICAgICAgY2xpY2tfb3V0Zml0OiB7XG4gICAgICAgIGRlbGV0ZTogXCJEZWxldGVcIixcbiAgICAgICAgZ290b19hY2NvdW50OiBgVG8gdHJhbnNmZXIgeW91ciA8c3Ryb25nPiR7R00uaW5mby5zY3JpcHQubmFtZX08L3N0cm9uZz4gZmF2b3VyaXRlIG91dGZpdHMgdG8gYW5vdGhlciBicm93c2VyLCBleHBvcnQgeW91ciBzZXR0aW5ncyBpbiB0aGUgPGEgaHJlZj1cIi91c2VyL2FjY291bnRcIiBzdHlsZT1cInRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1wiPm15Jm5ic3A7YWNjb3VudDwvYT4gcGFnZS5gLFxuICAgICAgICBzYXZlZF9sb2NhbGx5OiBgVGFrZSBub3RlIHRoYXQgdGhpcyBvdXRmaXQgaXMgc2F2ZWQgaW4gPHN0cm9uZz4ke0dNLmluZm8uc2NyaXB0Lm5hbWV9PC9zdHJvbmc+JyBzZXR0aW5ncyBhbmQgd2FzIG5vdCBzZW50IHRvIEVsZGFyeWEncyBzZXJ2ZXJzLmAsXG4gICAgICAgIHdlYXI6IFwiV2VhclwiLFxuICAgICAgfSxcbiAgICAgIGltcG9ydGVkOiBcIkltcG9ydGVkIG91dGZpdCFcIixcbiAgICAgIGltcG9ydGluZzogXCJJbXBvcnRpbmcgb3V0Zml0LiBQbGVhc2Ugd2FpdC4uLlwiLFxuICAgICAgcmVuYW1lX291dGZpdDoge1xuICAgICAgICB0aXRsZTogKG5hbWU6IHN0cmluZykgPT4gYFJlbmFtZSA8c3Ryb25nPiR7bmFtZX08L3N0cm9uZz5gLFxuICAgICAgICBidXR0b246IFwiUmVuYW1lXCIsXG4gICAgICB9LFxuICAgICAgc2F2ZV9vdXRmaXQ6IHtcbiAgICAgICAgZ290b19hY2NvdW50OiBgVG8gdHJhbnNmZXIgeW91ciA8c3Ryb25nPiR7R00uaW5mby5zY3JpcHQubmFtZX08L3N0cm9uZz4gZmF2b3VyaXRlIG91dGZpdHMgdG8gYW5vdGhlciBicm93c2VyLCBleHBvcnQgeW91ciBzZXR0aW5ncyBpbiB0aGUgPGEgaHJlZj1cIi91c2VyL2FjY291bnRcIiBzdHlsZT1cInRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1wiPm15Jm5ic3A7YWNjb3VudDwvYT4gcGFnZS5gLFxuICAgICAgICBwbGFjZWhvbGRlcjogXCJOYW1lLi4uXCIsXG4gICAgICAgIHNhdmU6IFwiU2F2ZVwiLFxuICAgICAgICBzYXZlZF9sb2NhbGx5OiBgVGFrZSBub3RlIHRoYXQgdGhpcyBvdXRmaXQgd2lsbCBvbmx5IGJlIHNhdmVkIHdpdGhpbiA8c3Ryb25nPiR7R00uaW5mby5zY3JpcHQubmFtZX08L3N0cm9uZz4nIHNldHRpbmdzIGFuZCB3aWxsIG5vdCBiZSBzZW50IHRvIEVsZGFyeWEncyBzZXJ2ZXJzLmAsXG4gICAgICAgIHRpdGxlOiBcIlNhdmUgb3V0Zml0XCIsXG4gICAgICB9LFxuICAgIH0sXG4gICAgbG9hZGVkOiBcIlRoZSB3YXJkcm9iZSBpcyBsb2FkZWQuXCIsXG4gICAgbG9hZGluZzogKGNhdGVnb3J5bmFtZTogc3RyaW5nKSA9PlxuICAgICAgYExvYWRpbmcgPHN0cm9uZz4ke2NhdGVnb3J5bmFtZX08L3N0cm9uZz4uLi5gLFxuICB9LFxuICBtYXJrZXQ6IHtcbiAgICBhZGRfdG9fd2lzaGxpc3Q6IHtcbiAgICAgIGFkZGVkX3RvX3dpc2hsaXN0OiAobmFtZSwgcHJpY2UpID0+XG4gICAgICAgIGBBZGRlZCA8c3Ryb25nPiR7bmFtZX08L3N0cm9uZz4gZm9yIDxzdHJvbmcgY2xhc3M9XCJwcmljZS1pdGVtXCI+JHtwcmljZX08L3N0cm9uZz4gPHNwYW4gY2xhc3M9XCJtYWFuYS1pY29uXCIgYWx0PVwibWFhbmFzXCI+PC9zcGFuPiB0byB0aGUgd2lzaGxpc3QuYCxcbiAgICAgIGludmFsaWRfcHJpY2U6IFwiVGhpcyBpcyBub3QgYSB2YWxpZCBwcmljZS5cIixcbiAgICAgIHNhdmU6IFwiU2F2ZVwiLFxuICAgICAgdGV4dDogXCJIb3cgbWFueSBtYWFuYXMgZG8geW91IHdpc2ggdG8gb2ZmZXIgdG8gYWNxdWlyZSB0aGlzIGl0ZW0/XCIsXG4gICAgICB0aXRsZTogXCJBZGQgdG8gd2lzaGxpc3RcIixcbiAgICB9LFxuICAgIGF1Y3Rpb25zOiB7XG4gICAgICBidXlfbm93X3ByaWNlOiBcIkJ1eSBub3cgcHJpY2UgOlwiLFxuICAgICAgY3VycmVudF9wcmljZTogXCJDdXJyZW50IHByaWNlIDpcIixcbiAgICAgIGRlbGV0ZTogXCJEZWxldGVcIixcbiAgICAgIHB1cmNoYXNlX2hpc3Rvcnk6IFwiUHVyY2hhc2UgaGlzdG9yeVwiLFxuICAgICAgc2FsZXNfaGlzdG9yeTogXCJTYWxlcyBoaXN0b3J5XCIsXG4gICAgICBkYXRlX3RpbWVfZm9ybWF0OiBuZXcgSW50bC5EYXRlVGltZUZvcm1hdChcImVuLUdCXCIsIHtcbiAgICAgICAgbWludXRlOiBcIjItZGlnaXRcIixcbiAgICAgICAgaG91cjogXCIyLWRpZ2l0XCIsXG4gICAgICAgIGRheTogXCJudW1lcmljXCIsXG4gICAgICAgIG1vbnRoOiBcImxvbmdcIixcbiAgICAgICAgeWVhcjogXCJudW1lcmljXCIsXG4gICAgICB9KSxcbiAgICB9LFxuICAgIGNoYW5nZV9wcmljZToge1xuICAgICAgY2hhbmdlZF9wcmljZTogKG5hbWUsIHByaWNlKSA9PlxuICAgICAgICBgQ2hhbmdlZCA8c3Ryb25nPiR7bmFtZX08L3N0cm9uZz4ncyBwcmljZSBmb3IgPHN0cm9uZyBjbGFzcz1cInByaWNlLWl0ZW1cIj4ke3ByaWNlfTwvc3Ryb25nPiA8c3BhbiBjbGFzcz1cIm1hYW5hLWljb25cIiBhbHQ9XCJtYWFuYXNcIj48L3NwYW4+LmAsXG4gICAgICBpbnZhbGlkX3ByaWNlOiBcIlRoaXMgaXMgbm90IGEgdmFsaWQgcHJpY2UuXCIsXG4gICAgICBzYXZlOiBcIlNhdmVcIixcbiAgICAgIHRleHQ6IFwiSG93IG1hbnkgbWFhbmFzIGRvIHlvdSB3aXNoIHRvIG9mZmVyIHRvIGFjcXVpcmUgdGhpcyBpdGVtP1wiLFxuICAgICAgdGl0bGU6IFwiQ2hhbmdlIHByaWNlXCIsXG4gICAgfSxcbiAgICB3aXNobGlzdDoge1xuICAgICAgYWN0aW9uczogXCJBY3Rpb25zXCIsXG4gICAgICBhc3Npc3RhbmNlOiBgT24gdGhpcyBwYWdlLCB5b3UgY2FuIG9yZ2FuaXplIHlvdXIgd2lzaGxpc3QgYW5kIGNoZWNrIHRoZSBzdGF0dXMgb2YgeW91ciB3aXNoZWQgaXRlbXMuIFBsZWFzZSBub3RlIHRoYXQgeW91ciB3aXNobGlzdCBpcyBzYXZlZCBsb2NhbGx5IGluIDxzdHJvbmc+JHtHTS5pbmZvLnNjcmlwdC5uYW1lfTwvc3Ryb25nPicgc2V0dGluZ3MgYW5kIGlzIG5vdCBzZW50IHRvIEVsZGFyeWEncyBzZXJ2ZXJzLiBUbyB0cmFuc2ZlciB5b3VyIHdpc2hsaXN0IHRvIGFub3RoZXIgYnJvd3NlciwgZXhwb3J0IHlvdXIgc2V0dGluZ3MgaW4gdGhlIDxhIGhyZWY9XCIvdXNlci9hY2NvdW50XCIgc3R5bGU9XCJ0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTtcIj5teSZuYnNwO2FjY291bnQ8L2E+IHBhZ2UuYCxcbiAgICAgIGNoYW5nZV9wcmljZTogXCJDaGFuZ2UgcHJpY2VcIixcbiAgICAgIGRlbGV0ZV90b29sdGlwOiBcIlJlbW92ZSBmcm9tIHdpc2hsaXN0XCIsXG4gICAgICBkZWxldGU6IFwiRGVsZXRlXCIsXG4gICAgICBpY29uOiBcIkljb25cIixcbiAgICAgIG5hbWU6IFwiTmFtZVwiLFxuICAgICAgcHJpY2U6IFwiUHJpY2VcIixcbiAgICAgIHJlc2V0X2FsbDogXCJSZXNldCBhbGwgc3RhdHVzZXNcIixcbiAgICAgIHJlc2V0X3Rvb2x0aXA6IFwiUmVzZXQgdGhlIGVycm9yIHN0YXR1c1wiLFxuICAgICAgcmVzZXQ6IFwiUmVzZXRcIixcbiAgICAgIHN0YXR1czogXCJTdGF0dXNcIixcbiAgICAgIHRpdGxlOiBcIldpc2hsaXN0XCIsXG4gICAgfSxcbiAgfSxcbiAgYWNjb3VudDoge1xuICAgIGNhbmNlbDogXCJDYW5jZWxcIixcbiAgICBjb25maXJtX3Jlc2V0X2NvbnRlbnQ6IGBBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gcmVzZXQgeW91ciA8c3Ryb25nPiR7R00uaW5mby5zY3JpcHQubmFtZX08L3N0cm9uZz4gc2V0dGluZ3M/IFlvdXIgZnJlZSBzYXZlZCBmYXZvcml0ZSBvdXRmaXRzLCB3aXNobGlzdCwgZXhwbG9yYXRpb24gYW5kIG1hcmtldCBoaXN0b3J5LCBhbmQgbWFya2VkIGV4cGxvcmF0aW9uIHBvaW50cyB3aWxsIGJlIGVyYXNlZC4gWW91IHdpbGwgYWxzbyBuZWVkIHRvIHJlLWVuYWJsZSBhbGwgdGhlIGRlc2lyZWQgc2V0dGluZ3MuYCxcbiAgICBjb25maXJtX3Jlc2V0X3RpdGxlOiBcIkVyYXNlIHNldHRpbmdzXCIsXG4gICAgY29uZmlybTogXCJSZXNldFwiLFxuICAgIGRlYnVnX3Rvb2x0aXA6IFwiRW5hYmxlcyBvciBkaXNhYmxlcyBsb2dnaW5nLlwiLFxuICAgIGRlYnVnOiBcIkRlYnVnXCIsXG4gICAgZGVsZXRlX2V4cGxvcmF0aW9uczogXCJEZWxldGUgYWxsIGV4cGxvcmF0aW9uIHBvaW50c1wiLFxuICAgIGVuaGFuY2VtZW50czogXCJFbmhhbmNlbWVudHNcIixcbiAgICBleHBsb3JhdGlvbnNfZGVsZXRlZDogXCJZb3VyIG1hcmtlZCBleHBsb3JhdGlvbiBwb2ludHMgd2VyZSBkZWxldGVkLlwiLFxuICAgIGV4cGxvcmF0aW9uczogXCJFeHBsb3JhdGlvbnNcIixcbiAgICBleHBvcnQ6IFwiRXhwb3J0IHNldHRpbmdzXCIsXG4gICAgaW1wb3J0OiBcIkltcG9ydCBzZXR0aW5nc1wiLFxuICAgIGltcG9ydGVkOiBcIkltcG9ydGVkIHNldHRpbmdzIVwiLFxuICAgIG1hcmtldDogXCJNYXJrZXRcIixcbiAgICBtaW5pZ2FtZXM6IFwiTWluaWdhbWVzXCIsXG4gICAgcmVzZXQ6IFwiUmVzZXRcIixcbiAgfSxcbiAgcGV0OiB7XG4gICAgYXV0b19leHBsb3JlOiBcIkhpZ2hsaWdodFwiLFxuICAgIGRhdGVfdGltZV9mb3JtYXQ6IG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KFwiZW4tR0JcIiwge1xuICAgICAgbWludXRlOiBcIjItZGlnaXRcIixcbiAgICAgIGhvdXI6IFwiMi1kaWdpdFwiLFxuICAgICAgZGF5OiBcIm51bWVyaWNcIixcbiAgICAgIG1vbnRoOiBcImxvbmdcIixcbiAgICAgIHllYXI6IFwibnVtZXJpY1wiLFxuICAgIH0pLFxuICAgIGRlbGV0ZV9oaXN0b3J5OiBcIkRlbGV0ZSBoaXN0b3J5XCIsXG4gICAgZGVsZXRpbmdfbWFya2VyczogXCJEZWxldGluZyBtYXJrZXJzLi4uXCIsXG4gICAgZW1wdHlfaGlzdG9yeTpcbiAgICAgIFwiWW91ciBleHBsb3JhdGlvbiBoaXN0b3J5IGlzIGVtcHR5LiBJdCB3aWxsIGF1dG9tYXRpY2FsbHkgZmlsbCB1cCBhcyB5b3VyIGZhbWlsaWFyIGZpbmRzIGl0ZW1zIHdoaWxlIGV4cGxvcmluZy5cIixcbiAgICBnb3RvX2FjY291bnQ6IGBUbyB0cmFuc2ZlciB5b3VyIGV4cGxvcmF0aW9uIGhpc3RvcnkgdG8gYW5vdGhlciBicm93c2VyLCBleHBvcnQgeW91ciBzZXR0aW5ncyBmcm9tIHRoZSA8ZW0+bXkmbmJzcDthY2NvdW50PC9lbT4gcGFnZS5gLFxuICAgIGhpc3Rvcnk6IFwiSGlzdG9yeVwiLFxuICAgIG1hcmtfYWxsOiBcIk1hcmsgdGhpcyByZWdpb25cIixcbiAgICBzYXZlZF9sb2NhbGx5OiBgUGxlYXNlIG5vdGUgdGhhdCB5b3VyIGV4cGxvcmF0aW9uIGhpc3RvcnkgaXMgc2F2ZWQgbG9jYWxseSBpbiA8c3Ryb25nPiR7R00uaW5mby5zY3JpcHQubmFtZX08L3N0cm9uZz4nIHNldHRpbmdzIGFuZCB3YXMgbm90IHNlbnQgdG8gRWxkYXJ5YSdzIHNlcnZlcnMuYCxcbiAgICB1bm1hcmtfYWxsOiBcIlVubWFyayB0aGlzIHJlZ2lvblwiLFxuICB9LFxuICBwcm9maWxlOiB7XG4gICAgZXhwb3J0X291dGZpdDogXCJFeHBvcnQgb3V0Zml0XCIsXG4gICAgZG93bmxvYWRfb3V0Zml0OiBcIkRvd25sb2FkIFBOR1wiLFxuICB9LFxuICBlcnJvcjoge1xuICAgIGRvd25sb2FkQ2FudmFzOiBcIlRoZXJlIHdhcyBhbiBlcnJvciB3aGlsZSBjcmVhdGluZyB0aGUgaW1hZ2UuXCIsXG4gICAgbG9uZ0xvYWRpbmc6XG4gICAgICBcIkVsZGFyeWEgaXMgdGFraW5nIHRvbyBsb25nIHRvIGxvYWQuIFJldHJ5aW5nIGluIDEwIHNlY29uZHMuLi5cIixcbiAgfSxcbiAgbWFsbDoge1xuICAgIGFkZF90b193aXNobGlzdDoge1xuICAgICAgdGl0bGU6IFwiQWRkIHRvIG1hcmtldCB3aXNobGlzdFwiLFxuICAgICAgdGV4dDogXCJIb3cgbWFueSBtYWFuYXMgZG8geW91IHdpc2ggdG8gb2ZmZXIgdG8gYWNxdWlyZSB0aGlzIGl0ZW0/XCIsXG4gICAgICBub3RlOiBcIlBsZWFzZSBub3RlIHRoYXQgdGhlIGl0ZW1zIGFkZGVkIGZyb20gdGhlIG1hbGwgd2lsbCBub3QgbmVjZXNzYXJpbHkgYmUgYXZhaWxhYmxlIGF0IHRoZSBtYXJrZXQuXCIsXG4gICAgfSxcbiAgfSxcbn1cblxuT2JqZWN0LmZyZWV6ZShlbilcbiIsImltcG9ydCB0eXBlIHsgVHJhbnNsYXRpb24gfSBmcm9tIFwiLi90cmFuc2xhdGlvblwiXG5cbmV4cG9ydCBjb25zdCBmcjogVHJhbnNsYXRpb24gPSB7XG4gIGhvbWU6IHtcbiAgICBmb3J1bTogXCJGb3J1bVwiLFxuICAgIHRha2VvdmVyOiBcIlRha2VvdmVyXCIsXG4gIH0sXG4gIHRha2VvdmVyOiB7XG4gICAgYm91Z2h0OiAobmFtZSwgcHJpY2UpID0+XG4gICAgICBgQWNoZXTDqSA8c3Ryb25nPiR7bmFtZX08L3N0cm9uZz4gcG91ciA8c3Ryb25nIGNsYXNzPVwicHJpY2UtaXRlbVwiPiR7cHJpY2V9PC9zdHJvbmc+IDxzcGFuIGNsYXNzPVwibWFhbmEtaWNvblwiIGFsdD1cIm1hYW5hc1wiPjwvc3Bhbj4uYCxcbiAgICBkaXNhYmxlZDogXCJUYWtlb3ZlciBkw6lzYWN0aXbDqS5cIixcbiAgICBlbmFibGVkOiBcIlRha2VvdmVyIGFjdGl2w6kuIMOJdml0ZSBkJ2ludMOpcmFnaXIgYXZlYyBjZXQgb25nbGV0LlwiLFxuICB9LFxuICBjYXJvdXNlbDoge1xuICAgIGJlZW1vb3ZfYW5ub3lhbmNlczoge1xuICAgICAgdGl0bGU6IFwiQmVlbW9vdiBBbm5veWFuY2VzXCIsXG4gICAgICBzdWJ0aXRsZTogXCJCbG9xdWUgY2VydGFpbnMgaXJyaXRhbnRzIGQnRWxkYXJ5YS5cIixcbiAgICB9LFxuICAgIGRvd25sb2FkX2ZhY2U6IHtcbiAgICAgIHRpdGxlOiBcIlTDqWzDqWNoYXJnZSBsZSB2aXNhZ2UgZGUgdGEgZ2FyZGllbm5lIVwiLFxuICAgICAgc3VidGl0bGU6IFwiQ2xpcXVlIGljaSBwb3VyIHTDqWzDqWNoYXJnZXIgbGUgdmlzYWdlIGRlIHRhIGdhcmRpZW5uZS5cIixcbiAgICB9LFxuICAgIGRvd25sb2FkX2d1YXJkaWFuOiB7XG4gICAgICB0aXRsZTogXCJUw6lsw6ljaGFyZ2UgdGEgZ2FyZGllbm5lIVwiLFxuICAgICAgc3VidGl0bGU6IFwiQ2xpcXVlIGljaSBwb3VyIHTDqWzDqWNoYXJnZXIgdGEgZ2FyZGllbm5lLlwiLFxuICAgIH0sXG4gICAgZWxkYXJ5YV9lbmhhbmNlbWVudHM6IHtcbiAgICAgIHRpdGxlOiBgJHtHTS5pbmZvLnNjcmlwdC5uYW1lfSB2JHtHTS5pbmZvLnNjcmlwdC52ZXJzaW9ufWAsXG4gICAgICBzdWJ0aXRsZTogXCJBbcOpbGlvcmUgbCdleHDDqXJpZW5jZSB1dGlsaXNhdGV1ciBkJ0VsZGFyeWEuXCIsXG4gICAgfSxcbiAgICB0YWtlb3Zlcjoge1xuICAgICAgZGlzYWJsZV90YWtlb3ZlcjogXCJEw6lzYWN0aXZlIGxlIHRha2VvdmVyXCIsXG4gICAgICBlbmFibGVfdGFrZW92ZXI6IFwiQWN0aXZlIGxlIHRha2VvdmVyXCIsXG4gICAgICBzdWJ0aXRsZTogXCJMYWlzc2UgY2V0IG9uZ2xldCBwZXJmb3JtZXIgZGVzIGFjdGlvbnMgYXV0b21hdGlxdWVzLlwiLFxuICAgICAgdGl0bGU6IFwiVGFrZW92ZXJcIixcbiAgICB9LFxuICB9LFxuICBtaW5pZ2FtZXM6IHtcbiAgICBwbGF5ZWRfZm9yOiAobmFtZTogc3RyaW5nLCBtYWFuYXM6IG51bWJlcikgPT5cbiAgICAgIGBBIGpvdcOpIMOgIDxzdHJvbmc+JHtuYW1lfTwvc3Ryb25nPiBwb3VyIDxzdHJvbmcgY2xhc3M9XCJwcmljZS1pdGVtXCI+JHttYWFuYXN9PC9zdHJvbmc+IDxzcGFuIGNsYXNzPVwibWFhbmEtaWNvblwiIGFsdD1cIm1hYW5hc1wiPjwvc3Bhbj4gZ2FnbsOpcy5gLFxuICAgIHBsYXllZDogKG5hbWU6IHN0cmluZykgPT4gYEEgam91w6kgw6AgPHN0cm9uZz4ke25hbWV9PC9zdHJvbmc+LmAsXG4gICAgcGxheWluZzogKG5hbWU6IHN0cmluZykgPT4gYEpvdWUgw6AgPHN0cm9uZz4ke25hbWV9PC9zdHJvbmc+Li4uYCxcbiAgfSxcbiAgYXBwZWFyYW5jZToge1xuICAgIGJ1dHRvbnM6IHtcbiAgICAgIGJhY2t3YXJkOiBcIlZlcnMgbCdhcnJpw6hyZVwiLFxuICAgICAgZm9yd2FyZDogXCJWZXJzIGwnYXZhbnRcIixcbiAgICB9LFxuICAgIGZhdm91cml0ZXM6IHtcbiAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgZG93bmxvYWQ6IFwiVMOpbMOpY2hhcmdlciBsZSBQTkdcIixcbiAgICAgICAgZXhwb3J0OiBcIkV4cG9ydGVyXCIsXG4gICAgICAgIGltcG9ydDogXCJJbXBvcnRlclwiLFxuICAgICAgfSxcbiAgICAgIGNsaWNrX291dGZpdDoge1xuICAgICAgICBkZWxldGU6IFwiU3VwcHJpbWVyXCIsXG4gICAgICAgIGdvdG9fYWNjb3VudDogYFBvdXIgdHJhbnNmw6lyZXIgdGVzIHRlbnVlcyBmYXZvcml0ZXMgZCc8c3Ryb25nPiR7R00uaW5mby5zY3JpcHQubmFtZX08L3N0cm9uZz4gdmVycyB1biBhdXRyZSBuYXZpZ2F0ZXVyLCBleHBvcnRlIHRlcyBwYXJhbcOodHJlcyDDoCBwYXJ0aXIgZGUgbGEgcGFnZSA8YSBocmVmPVwiL3VzZXIvYWNjb3VudFwiIHN0eWxlPVwidGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XCI+bW9uJm5ic3A7Y29tcHRlPC9hPi5gLFxuICAgICAgICBzYXZlZF9sb2NhbGx5OiBgUHJlbmRzIG5vdGUgcXVlIGNldHRlIHRlbnVlIGVzdCBzYXV2ZWdhcmTDqWUgbG9jYWxlbWVudCBkYW5zIGxlcyBwYXJhbcOodHJlcyBkJzxzdHJvbmc+JHtHTS5pbmZvLnNjcmlwdC5uYW1lfTwvc3Ryb25nPiBldCBuJ2EgcGFzIMOpdMOpIGVudm95w6llIGF1eCBzZXJ2ZXVycyBkJ0VsZGFyeWEuYCxcbiAgICAgICAgd2VhcjogXCJQb3J0ZXJcIixcbiAgICAgIH0sXG4gICAgICBpbXBvcnRlZDogXCJJbXBvcnRhdGlvbiByw6l1c3NpZSFcIixcbiAgICAgIGltcG9ydGluZzogXCJJbXBvcnRhdGlvbiBlbiBjb3Vycy4uLlwiLFxuICAgICAgcmVuYW1lX291dGZpdDoge1xuICAgICAgICBidXR0b246IFwiUmVub21tZXJcIixcbiAgICAgICAgdGl0bGU6IChuYW1lOiBzdHJpbmcpID0+IGBSZW5vbW1lciA8c3Ryb25nPiR7bmFtZX08L3N0cm9uZz5gLFxuICAgICAgfSxcbiAgICAgIHNhdmVfb3V0Zml0OiB7XG4gICAgICAgIGdvdG9fYWNjb3VudDogYFBvdXIgdHJhbnNmw6lyZXIgdGVzIHRlbnVlcyBmYXZvcml0ZXMgZCc8c3Ryb25nPiR7R00uaW5mby5zY3JpcHQubmFtZX08L3N0cm9uZz4gdmVycyB1biBhdXRyZSBuYXZpZ2F0ZXVyLCBleHBvcnRlIHRlcyBwYXJhbcOodHJlcyDDoCBwYXJ0aXIgZGUgbGEgcGFnZSA8YSBocmVmPVwiL3VzZXIvYWNjb3VudFwiIHN0eWxlPVwidGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XCI+bW9uJm5ic3A7Y29tcHRlPC9hPi5gLFxuICAgICAgICBwbGFjZWhvbGRlcjogXCJOb20uLi5cIixcbiAgICAgICAgc2F2ZTogXCJTYXV2ZWdhcmRlclwiLFxuICAgICAgICBzYXZlZF9sb2NhbGx5OiBgUHJlbmRzIG5vdGUgcXVlIGNldHRlIHRlbnVlIHNlcmEgc2F1dmVnYXJkw6llIGxvY2FsZW1lbnQgZGFucyBsZXMgcGFyYW3DqHRyZXMgZCc8c3Ryb25nPiR7R00uaW5mby5zY3JpcHQubmFtZX08L3N0cm9uZz4gZXQgbmUgc2VyYSBwYXMgZW52b3nDqWUgYXV4IHNlcnZldXJzIGQnRWxkYXJ5YS5gLFxuICAgICAgICB0aXRsZTogXCJTYXV2ZWdhcmRlciBjZXR0ZSB0ZW51ZVwiLFxuICAgICAgfSxcbiAgICB9LFxuICAgIGxvYWRlZDogXCJMZSBjaGFyZ2VtZW50IGRlIGxhIGdhcmRlLXJvYmUgZXN0IHRlcm1pbsOpLlwiLFxuICAgIGxvYWRpbmc6IChjYXRlZ29yeW5hbWU6IHN0cmluZykgPT5cbiAgICAgIGBDaGFyZ2VtZW50IGRlIDxzdHJvbmc+JHtjYXRlZ29yeW5hbWV9PC9zdHJvbmc+Li4uYCxcbiAgfSxcbiAgbWFya2V0OiB7XG4gICAgYWRkX3RvX3dpc2hsaXN0OiB7XG4gICAgICBhZGRlZF90b193aXNobGlzdDogKG5hbWU6IHN0cmluZywgcHJpY2U6IG51bWJlcikgPT5cbiAgICAgICAgYEFqb3V0w6kgPHN0cm9uZz4ke25hbWV9PC9zdHJvbmc+IHBvdXIgPHN0cm9uZyBjbGFzcz1cInByaWNlLWl0ZW1cIj4ke3ByaWNlfTwvc3Ryb25nPiA8c3BhbiBjbGFzcz1cIm1hYW5hLWljb25cIiBhbHQ9XCJtYWFuYXNcIj48L3NwYW4+IMOgIGxhIGxpc3RlIGRlIHNvdWhhaXRzLmAsXG4gICAgICBpbnZhbGlkX3ByaWNlOiBcIkNlIHByaXggbidlc3QgcGFzIHZhbGlkZS5cIixcbiAgICAgIHNhdmU6IFwiU2F1dmVnYXJkZXJcIixcbiAgICAgIHRleHQ6IFwiQ29tYmllbiBkZSBtYWFuYXMgc291aGFpdGVzLXR1IG9mZnJpciBwb3VyIGFjcXXDqXJpciBjZXQgaXRlbT9cIixcbiAgICAgIHRpdGxlOiBcIkFqb3V0ZXIgw6AgbGEgbGlzdGUgZGUgc291aGFpdFwiLFxuICAgIH0sXG4gICAgYXVjdGlvbnM6IHtcbiAgICAgIGJ1eV9ub3dfcHJpY2U6IFwiQWNoYXQgaW1tw6lkaWF0IDpcIixcbiAgICAgIGN1cnJlbnRfcHJpY2U6IFwiTWlzZSBhY3R1ZWxsZSA6XCIsXG4gICAgICBkZWxldGU6IFwiU3VwcHJpbWVyXCIsXG4gICAgICBwdXJjaGFzZV9oaXN0b3J5OiBcIkhpc3RvcmlxdWUgZCdhY2hhdFwiLFxuICAgICAgc2FsZXNfaGlzdG9yeTogXCJIaXN0b3JpcXVlIGRlIHZlbnRlXCIsXG4gICAgICBkYXRlX3RpbWVfZm9ybWF0OiBuZXcgSW50bC5EYXRlVGltZUZvcm1hdChcImZyLUNBXCIsIHtcbiAgICAgICAgbWludXRlOiBcIjItZGlnaXRcIixcbiAgICAgICAgaG91cjogXCIyLWRpZ2l0XCIsXG4gICAgICAgIGRheTogXCJudW1lcmljXCIsXG4gICAgICAgIG1vbnRoOiBcImxvbmdcIixcbiAgICAgICAgeWVhcjogXCJudW1lcmljXCIsXG4gICAgICB9KSxcbiAgICB9LFxuICAgIGNoYW5nZV9wcmljZToge1xuICAgICAgY2hhbmdlZF9wcmljZTogKG5hbWU6IHN0cmluZywgcHJpY2U6IG51bWJlcikgPT5cbiAgICAgICAgYENoYW5nw6kgbGUgcHJpeCBkZSA8c3Ryb25nPiR7bmFtZX08L3N0cm9uZz4gcG91ciA8c3Ryb25nIGNsYXNzPVwicHJpY2UtaXRlbVwiPiR7cHJpY2V9PC9zdHJvbmc+IDxzcGFuIGNsYXNzPVwibWFhbmEtaWNvblwiIGFsdD1cIm1hYW5hc1wiPjwvc3Bhbj4uYCxcbiAgICAgIGludmFsaWRfcHJpY2U6IFwiQ2UgcHJpeCBuJ2VzdCBwYXMgdmFsaWRlLlwiLFxuICAgICAgc2F2ZTogXCJTYXV2ZWdhcmRlclwiLFxuICAgICAgdGV4dDogXCJDb21iaWVuIGRlIG1hYW5hcyBzb3VoYWl0ZXMtdHUgb2ZmcmlyIHBvdXIgYWNxdcOpcmlyIGNldCBpdGVtP1wiLFxuICAgICAgdGl0bGU6IFwiQ2hhbmdlciBsZSBwcml4XCIsXG4gICAgfSxcbiAgICB3aXNobGlzdDoge1xuICAgICAgYWN0aW9uczogXCJBY3Rpb25zXCIsXG4gICAgICBhc3Npc3RhbmNlOiBgU3VyIGNldHRlIHBhZ2UsIHR1IHBldXggb3JnYW5pc2VyIHRhIGxpc3RlIGRlIHNvdWhhaXRzIGV0IHbDqXJpZmllciBsZSBzdGF0dXQgZGUgdGVzIGFydGljbGVzIHNvdWhhaXTDqXMuIFByZW5kcyBub3RlIHF1ZSB0YSBsaXN0ZSBkZSBzb3VoYWl0cyBlc3Qgc2F1dmVnYXJkw6llIGxvY2FsZW1lbnQgZGFucyBsZXMgcGFyYW3DqHRyZXMgZCc8c3Ryb25nPiR7R00uaW5mby5zY3JpcHQubmFtZX08L3N0cm9uZz4gZXQgbidlc3QgcGFzIGVudm95w6llIGF1eCBzZXJ2ZXVycyBkJ0VsZGFyeWEuIFBvdXIgdHJhbnNmw6lyZXIgdGEgbGlzdGUgZGUgc291aGFpdHMgdmVycyB1biBhdXRyZSBuYXZpZ2F0ZXVyLCBleHBvcnRlLWxhIMOgIHBhcnRpciBkZSBsYSBwYWdlIDxhIGhyZWY9XCIvdXNlci9hY2NvdW50XCIgc3R5bGU9XCJ0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTtcIj5tb24mbmJzcDtjb21wdGU8L2E+LmAsXG4gICAgICBjaGFuZ2VfcHJpY2U6IFwiQ2hhbmdlciBsZSBwcml4XCIsXG4gICAgICBkZWxldGVfdG9vbHRpcDogXCJSZXRpcmVyIGRlIGxhIGxpc3RlIGRlIHNvdWhhaXRzXCIsXG4gICAgICBkZWxldGU6IFwiU3VwcHJpbWVyXCIsXG4gICAgICBpY29uOiBcIkljw7RuZVwiLFxuICAgICAgbmFtZTogXCJOb21cIixcbiAgICAgIHByaWNlOiBcIlByaXhcIixcbiAgICAgIHJlc2V0X2FsbDogXCJSw6lpbml0aWFsaXNlciB0b3V0IGxlcyBzdGF0dXRzXCIsXG4gICAgICByZXNldF90b29sdGlwOiBcIlLDqWluaXRpYWxpc2VyIGwnw6l0YXQgZCdlcnJldXJcIixcbiAgICAgIHJlc2V0OiBcIlLDqWluaXRpYWxpc2VyXCIsXG4gICAgICBzdGF0dXM6IFwiU3RhdHV0XCIsXG4gICAgICB0aXRsZTogXCJMaXN0ZSBkZSBzb3VoYWl0c1wiLFxuICAgIH0sXG4gIH0sXG4gIGFjY291bnQ6IHtcbiAgICBjYW5jZWw6IFwiQW5udWxlclwiLFxuICAgIGNvbmZpcm1fcmVzZXRfY29udGVudDogYFZldXgtdHUgdnJhaW1lbnQgcsOpaW5pdGlhbGlzZXIgdGVzIHBhcmFtw6h0cmVzIGQnPHN0cm9uZz4ke0dNLmluZm8uc2NyaXB0Lm5hbWV9PC9zdHJvbmc+PyBUZXMgdGVudWVzIGZhdm9yaXRlcyBlbnJlZ2lzdHLDqWVzIGdyYXR1aXRlbWVudCwgdGEgbGlzdGUgZGUgc291aGFpdCwgdG9uIGhpc3RvcmlxdWUgZCdleHBsb3JhdGlvbiBldCBkdSBtYXJjaMOpIGFpbnNpIHF1ZSB0ZXMgcG9pbnRzIGQnZXhwbG9yYXRpb25zIG1hcnF1w6lzIHNlcm9udCBlZmZhY8Opcy4gVHUgZGV2cmFzIMOpZ2FsZW1lbnQgcsOpYWN0aXZlciB0b3VzIGxlcyBwYXJhbcOodHJlcyBkw6lzaXLDqXMuYCxcbiAgICBjb25maXJtX3Jlc2V0X3RpdGxlOiBcIlN1cHByaW1lciBsZXMgcGFyYW3DqHRyZXNcIixcbiAgICBjb25maXJtOiBcIlLDqWluaXRpYWxpc2VyXCIsXG4gICAgZGVidWdfdG9vbHRpcDogXCJBY3RpdmUgb3UgZMOpc2FjdGl2ZSBsYSBqb3VybmFsaXNhdGlvbi5cIixcbiAgICBkZWJ1ZzogXCJEw6lib2dhZ2VcIixcbiAgICBkZWxldGVfZXhwbG9yYXRpb25zOiBcIlN1cHByaW1lciB0b3VzIGxlcyBwb2ludHMgZCdleHBsb3JhdGlvblwiLFxuICAgIGVuaGFuY2VtZW50czogXCJBbcOpbGlvcmF0aW9uc1wiLFxuICAgIGV4cGxvcmF0aW9uc19kZWxldGVkOiBcIlRlcyBwb2ludHMgZCdleHBsb3JhdGlvbiBtYXJxdcOpcyBvbnQgw6l0w6kgc3VwcHJpbcOpcy5cIixcbiAgICBleHBsb3JhdGlvbnM6IFwiRXhwbG9yYXRpb25zXCIsXG4gICAgZXhwb3J0OiBcIkV4cG9ydGVyIGxlcyBwYXJhbcOodHJlc1wiLFxuICAgIGltcG9ydDogXCJJbXBvcnRlciBsZXMgcGFyYW3DqHRyZXNcIixcbiAgICBpbXBvcnRlZDogXCJQYXJhbcOodHJlcyBpbXBvcnTDqXNcIixcbiAgICBtYXJrZXQ6IFwiTWFyY2jDqVwiLFxuICAgIG1pbmlnYW1lczogXCJNaW5pLWpldXhcIixcbiAgICByZXNldDogXCJSw6lpbml0aWFsaXNlclwiLFxuICB9LFxuICBwZXQ6IHtcbiAgICBhdXRvX2V4cGxvcmU6IFwiTWFycXVlclwiLFxuICAgIGRhdGVfdGltZV9mb3JtYXQ6IG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KFwiZnItQ0FcIiwge1xuICAgICAgbWludXRlOiBcIjItZGlnaXRcIixcbiAgICAgIGhvdXI6IFwiMi1kaWdpdFwiLFxuICAgICAgZGF5OiBcIm51bWVyaWNcIixcbiAgICAgIG1vbnRoOiBcImxvbmdcIixcbiAgICAgIHllYXI6IFwibnVtZXJpY1wiLFxuICAgIH0pLFxuICAgIGRlbGV0ZV9oaXN0b3J5OiBcIk5ldHRveWVyIGwnaGlzdG9yaXF1ZVwiLFxuICAgIGRlbGV0aW5nX21hcmtlcnM6IFwiU3VwcHJlc3Npb24gZGVzIG1hcnF1ZXVycy4uLlwiLFxuICAgIGVtcHR5X2hpc3Rvcnk6XG4gICAgICBcIlRvbiBoaXN0b3JpcXVlIGQnZXhwbG9yYXRpb24gZXN0IHZpZGUuIElsIHNlIHJlbXBsaXJhIGF1dG9tYXRpcXVlbWVudCDDoCBtZXN1cmUgcXVlIHRvbiBmYW1pbGllciB0cm91dmVyYSBkZXMgaXRlbXMgZW4gZXhwbG9yYXRpb24uXCIsXG4gICAgZ290b19hY2NvdW50OlxuICAgICAgXCJQb3VyIHRyYW5zZsOpcmVyIHRvbiBoaXN0b3JpcXVlIGQnZXhwbG9yYXRpb25zIHZlcnMgdW4gYXV0cmUgbmF2aWdhdGV1ciwgZXhwb3J0ZSB0ZXMgcGFyYW3DqHRyZXMgw6AgcGFydGlyIGRlIGxhIHBhZ2UgPGVtPm1vbiBjb21wdGU8L2VtPi5cIixcbiAgICBoaXN0b3J5OiBcIkhpc3RvcmlxdWVcIixcbiAgICBtYXJrX2FsbDogXCJNYXJxdWVyIGNldHRlIGNhcnRlXCIsXG4gICAgc2F2ZWRfbG9jYWxseTogYFByZW5kcyBub3RlIHF1ZSB0b24gaGlzdG9yaXF1ZSBkJ2V4cGxvcmF0aW9ucyBlc3Qgc2F1dmVnYXJkw6kgbG9jYWxlbWVudCBkYW5zIGxlcyBwYXJhbcOodHJlcyBkJzxzdHJvbmc+JHtHTS5pbmZvLnNjcmlwdC5uYW1lfTwvc3Ryb25nPiBldCBuJ2EgcGFzIMOpdMOpIGVudm95w6kgYXV4IHNlcnZldXJzIGQnRWxkYXJ5YS5gLFxuICAgIHVubWFya19hbGw6IFwiRMOpLW1hcnF1ZXIgY2V0dGUgY2FydGVcIixcbiAgfSxcbiAgcHJvZmlsZToge1xuICAgIGV4cG9ydF9vdXRmaXQ6IFwiRXhwb3J0ZXIgbGEgdGVudWVcIixcbiAgICBkb3dubG9hZF9vdXRmaXQ6IFwiVMOpbMOpY2hhcmdlciBsZSBQTkdcIixcbiAgfSxcbiAgZXJyb3I6IHtcbiAgICBkb3dubG9hZENhbnZhczpcbiAgICAgIFwiVW5lIGVycmV1ciBlc3Qgc3VydmVudWUgbG9ycyBkdSB0w6lsw6ljaGFyZ2VtZW50IGRlIGwnaW1hZ2UuXCIsXG4gICAgbG9uZ0xvYWRpbmc6XG4gICAgICBcIkVsZGFyeWEgcHJlbmQgdHJvcCBkZSB0ZW1wcyDDoCBjaGFyZ2VyLiBOb3V2ZWxsZSB0ZW50YXRpdmUgZGFucyAxMCBzZWNvbmRlcy4uLlwiLFxuICB9LFxuICBtYWxsOiB7XG4gICAgYWRkX3RvX3dpc2hsaXN0OiB7XG4gICAgICB0aXRsZTogXCJBam91dGVyIMOgIGxhIGxpc3RlIGRlIHNvdWhhaXQgZHUgbWFyY2jDqVwiLFxuICAgICAgdGV4dDogXCJDb21iaWVuIGRlIG1hYW5hcyBzb3VoYWl0ZXMtdHUgb2ZmcmlyIHBvdXIgYWNxdcOpcmlyIGNldCBpdGVtP1wiLFxuICAgICAgbm90ZTogXCJQcmVuZHMgbm90ZSBxdWUgbGVzIGl0ZW1zIGFqb3V0w6lzIMOgIHBhcnRpciBkZSBsYSBib3V0aXF1ZSBuZSBzZXJvbnQgcGFzIG7DqWNlc3NhaXJlbWVudCBkaXNwb25pYmxlcyBhdSBtYXJjaMOpLlwiLFxuICAgIH0sXG4gIH0sXG59XG5cbk9iamVjdC5mcmVlemUoZnIpXG4iLCJpbXBvcnQgeyBlbiB9IGZyb20gXCIuL2VuXCJcbmltcG9ydCB7IGZyIH0gZnJvbSBcIi4vZnJcIlxuaW1wb3J0IHR5cGUgeyBUcmFuc2xhdGlvbiB9IGZyb20gXCIuL3RyYW5zbGF0aW9uXCJcblxuZnVuY3Rpb24gdHJhbnNsYXRpb24oKTogVHJhbnNsYXRpb24ge1xuICBpZiAobG9jYXRpb24uaG9zdG5hbWUuZW5kc1dpdGgoXCIuY29tLmJyXCIpKSByZXR1cm4gZW5cbiAgaWYgKGxvY2F0aW9uLmhvc3RuYW1lLmVuZHNXaXRoKFwiLmRlXCIpKSByZXR1cm4gZW5cbiAgaWYgKGxvY2F0aW9uLmhvc3RuYW1lLmVuZHNXaXRoKFwiLmVzXCIpKSByZXR1cm4gZW5cbiAgaWYgKGxvY2F0aW9uLmhvc3RuYW1lLmVuZHNXaXRoKFwiLmh1XCIpKSByZXR1cm4gZW5cbiAgaWYgKGxvY2F0aW9uLmhvc3RuYW1lLmVuZHNXaXRoKFwiLml0XCIpKSByZXR1cm4gZW5cbiAgaWYgKGxvY2F0aW9uLmhvc3RuYW1lLmVuZHNXaXRoKFwiLnBsXCIpKSByZXR1cm4gZW5cbiAgaWYgKGxvY2F0aW9uLmhvc3RuYW1lLmVuZHNXaXRoKFwiLnJ1XCIpKSByZXR1cm4gZW5cbiAgaWYgKGxvY2F0aW9uLmhvc3RuYW1lLmVuZHNXaXRoKFwiLmNvbVwiKSkgcmV0dXJuIGVuXG4gIGlmIChsb2NhdGlvbi5ob3N0bmFtZS5lbmRzV2l0aChcIi5mclwiKSkgcmV0dXJuIGZyXG4gIGVsc2UgcmV0dXJuIGVuXG59XG5cbmV4cG9ydCBjb25zdCB0cmFuc2xhdGUgPSB0cmFuc2xhdGlvbigpXG4iLCJleHBvcnQgZW51bSBEYXRhYmFzZXMge1xuICBlbGRhcnlhX2VuaGFuY2VtZW50cyA9IFwiZWxkYXJ5YV9lbmhhbmNlbWVudHNcIixcbn1cbiIsImV4cG9ydCBlbnVtIEZpZWxkcyB7XG4gIGJsb2IgPSBcImJsb2JcIixcbiAgaWQgPSBcImlkXCIsXG4gIGl0ZW1zID0gXCJpdGVtc1wiLFxuICBuYW1lID0gXCJuYW1lXCIsXG59XG4iLCJpbXBvcnQgdHlwZSB7XG4gIEZhdm91cml0ZU91dGZpdCxcbiAgTmV3RmF2b3VyaXRlT3V0Zml0LFxufSBmcm9tIFwiLi4vYXBwZWFyYW5jZS9pbnRlcmZhY2VzL2Zhdm91cml0ZV9vdXRmaXRcIlxuaW1wb3J0IHsgQ29uc29sZSB9IGZyb20gXCIuLi9jb25zb2xlXCJcbmltcG9ydCB7IERhdGFiYXNlcyB9IGZyb20gXCIuL2RhdGFiYXNlcy5lbnVtXCJcbmltcG9ydCB7IEZpZWxkcyB9IGZyb20gXCIuL2ZpZWxkcy5lbnVtXCJcbmltcG9ydCB7IFRhYmxlcyB9IGZyb20gXCIuL3RhYmxlcy5lbnVtXCJcblxuY2xhc3MgSW5kZXhlZERCIHtcbiAgcHJpdmF0ZSBkYj86IElEQkRhdGFiYXNlXG4gIHByaXZhdGUgcmVhZG9ubHkgdmVyc2lvbiA9IDFcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBjb25zdCByZXF1ZXN0ID0gaW5kZXhlZERCLm9wZW4oRGF0YWJhc2VzLmVsZGFyeWFfZW5oYW5jZW1lbnRzLCB0aGlzLnZlcnNpb24pXG4gICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSAoKTogSURCRGF0YWJhc2UgPT4gKHRoaXMuZGIgPSByZXF1ZXN0LnJlc3VsdClcbiAgICByZXF1ZXN0Lm9udXBncmFkZW5lZWRlZCA9IGZ1bmN0aW9uICh0aGlzOiBJREJPcGVuREJSZXF1ZXN0KTogdm9pZCB7XG4gICAgICBjb25zdCBkYjogSURCRGF0YWJhc2UgPSB0aGlzLnJlc3VsdFxuXG4gICAgICBjb25zdCBvYmplY3RTdG9yZSA9IGRiLmNyZWF0ZU9iamVjdFN0b3JlKFRhYmxlcy5mYXZvdXJpdGVfb3V0Zml0cywge1xuICAgICAgICBrZXlQYXRoOiBcImlkXCIsXG4gICAgICAgIGF1dG9JbmNyZW1lbnQ6IHRydWUsXG4gICAgICB9KVxuXG4gICAgICBvYmplY3RTdG9yZS5jcmVhdGVJbmRleChGaWVsZHMuYmxvYiwgXCJibG9iXCIsIHsgdW5pcXVlOiBmYWxzZSB9KVxuICAgICAgb2JqZWN0U3RvcmUuY3JlYXRlSW5kZXgoRmllbGRzLml0ZW1zLCBcIml0ZW1zXCIsIHsgdW5pcXVlOiBmYWxzZSB9KVxuICAgICAgb2JqZWN0U3RvcmUuY3JlYXRlSW5kZXgoRmllbGRzLm5hbWUsIFwibmFtZVwiLCB7IHVuaXF1ZTogZmFsc2UgfSlcbiAgICB9XG4gICAgcmVxdWVzdC5vbmVycm9yID0gKCk6IHZvaWQgPT5cbiAgICAgIENvbnNvbGUuZXJyb3IoXCJFcnJvciB3aGVuIG9wZW5pbmcgdGhlIGluZGV4ZWREQlwiLCByZXF1ZXN0LmVycm9yKVxuICAgIHJlcXVlc3Qub25ibG9ja2VkID0gKCk6IHZvaWQgPT5cbiAgICAgIENvbnNvbGUuZXJyb3IoXCJCbG9ja2VkIGZyb20gb3BlbmluZyB0aGUgaW5kZXhlZERCXCIsIHJlcXVlc3QuZXJyb3IpXG4gIH1cblxuICAvKiogQHJldHVybnMgYSBuZXcgYEZhdm91cml0ZU91dGZpdGAgd2l0aCB0aGUgYGtleWAgcHJvcGVydHkgc2V0LiAqL1xuICBhc3luYyBhZGRGYXZvdXJpdGVPdXRmaXQoXG4gICAgZmF2b3VyaXRlOiBOZXdGYXZvdXJpdGVPdXRmaXRcbiAgKTogUHJvbWlzZTxGYXZvdXJpdGVPdXRmaXQ+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk6IHZvaWQgPT4ge1xuICAgICAgaWYgKCF0aGlzLmRiKSByZXR1cm4gcmVqZWN0KClcblxuICAgICAgY29uc3QgcmVxdWVzdCA9IHRoaXMuZGJcbiAgICAgICAgLnRyYW5zYWN0aW9uKFtUYWJsZXMuZmF2b3VyaXRlX291dGZpdHNdLCBcInJlYWR3cml0ZVwiKVxuICAgICAgICAub2JqZWN0U3RvcmUoVGFibGVzLmZhdm91cml0ZV9vdXRmaXRzKVxuICAgICAgICAuYWRkKGZhdm91cml0ZSlcblxuICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgIC4uLmZhdm91cml0ZSxcbiAgICAgICAgICB1cmw6IFVSTC5jcmVhdGVPYmplY3RVUkwoZmF2b3VyaXRlLmJsb2IpLFxuICAgICAgICAgIGlkOiBOdW1iZXIocmVxdWVzdC5yZXN1bHQpLFxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBhc3luYyB1cGRhdGVGYXZvdXJpdGVPdXRmaXQoXG4gICAgZmF2b3VyaXRlOiBGYXZvdXJpdGVPdXRmaXRcbiAgKTogUHJvbWlzZTxGYXZvdXJpdGVPdXRmaXQ+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk6IHZvaWQgPT4ge1xuICAgICAgaWYgKCF0aGlzLmRiKSByZXR1cm4gcmVqZWN0KClcblxuICAgICAgY29uc3QgcmVxdWVzdCA9IHRoaXMuZGJcbiAgICAgICAgLnRyYW5zYWN0aW9uKFtUYWJsZXMuZmF2b3VyaXRlX291dGZpdHNdLCBcInJlYWR3cml0ZVwiKVxuICAgICAgICAub2JqZWN0U3RvcmUoVGFibGVzLmZhdm91cml0ZV9vdXRmaXRzKVxuICAgICAgICAucHV0KGZhdm91cml0ZSlcblxuICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgIC4uLmZhdm91cml0ZSxcbiAgICAgICAgICBpZDogTnVtYmVyKHJlcXVlc3QucmVzdWx0KSxcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgYXN5bmMgY2xlYXJGYXZvdXJpdGVPdXRmaXRzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KTogdm9pZCA9PiB7XG4gICAgICBpZiAoIXRoaXMuZGIpIHJldHVybiByZWplY3QoKVxuXG4gICAgICBjb25zdCByZXF1ZXN0ID0gdGhpcy5kYlxuICAgICAgICAudHJhbnNhY3Rpb24oW1RhYmxlcy5mYXZvdXJpdGVfb3V0Zml0c10sIFwicmVhZHdyaXRlXCIpXG4gICAgICAgIC5vYmplY3RTdG9yZShUYWJsZXMuZmF2b3VyaXRlX291dGZpdHMpXG4gICAgICAgIC5jbGVhcigpXG5cbiAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gKCk6IHZvaWQgPT4gcmVzb2x2ZSgpXG4gICAgfSlcbiAgfVxuXG4gIGFzeW5jIGRlbGV0ZUZhdm91cml0ZU91dGZpdChmYXZvdXJpdGU6IEZhdm91cml0ZU91dGZpdCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KTogdm9pZCA9PiB7XG4gICAgICBpZiAoIXRoaXMuZGIpIHJldHVybiByZWplY3QoKVxuXG4gICAgICBjb25zdCByZXF1ZXN0ID0gdGhpcy5kYlxuICAgICAgICAudHJhbnNhY3Rpb24oW1RhYmxlcy5mYXZvdXJpdGVfb3V0Zml0c10sIFwicmVhZHdyaXRlXCIpXG4gICAgICAgIC5vYmplY3RTdG9yZShUYWJsZXMuZmF2b3VyaXRlX291dGZpdHMpXG4gICAgICAgIC5kZWxldGUoZmF2b3VyaXRlLmlkKVxuXG4gICAgICByZXF1ZXN0Lm9uc3VjY2VzcyA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgcmVzb2x2ZSgpXG4gICAgICAgIGlmIChmYXZvdXJpdGUudXJsKSBVUkwucmV2b2tlT2JqZWN0VVJMKGZhdm91cml0ZS51cmwpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGFzeW5jIGdldEZhdm91cml0ZU91dGZpdChpZDogbnVtYmVyKTogUHJvbWlzZTxGYXZvdXJpdGVPdXRmaXQ+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk6IHZvaWQgPT4ge1xuICAgICAgaWYgKCF0aGlzLmRiKSByZXR1cm4gcmVqZWN0KClcblxuICAgICAgY29uc3QgcmVxdWVzdCA9IHRoaXMuZGJcbiAgICAgICAgLnRyYW5zYWN0aW9uKFtUYWJsZXMuZmF2b3VyaXRlX291dGZpdHNdLCBcInJlYWRvbmx5XCIpXG4gICAgICAgIC5vYmplY3RTdG9yZShUYWJsZXMuZmF2b3VyaXRlX291dGZpdHMpXG4gICAgICAgIC5nZXQoaWQpXG5cbiAgICAgIGNvbnN0IGZhdm91cml0ZTogRmF2b3VyaXRlT3V0Zml0ID0gcmVxdWVzdC5yZXN1bHRcblxuICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSAoKTogdm9pZCA9PlxuICAgICAgICByZXNvbHZlKHsgLi4uZmF2b3VyaXRlLCB1cmw6IFVSTC5jcmVhdGVPYmplY3RVUkwoZmF2b3VyaXRlLmJsb2IpIH0pXG4gICAgfSlcbiAgfVxuXG4gIGFzeW5jIGdldEZhdm91cml0ZU91dGZpdHMoKTogUHJvbWlzZTxGYXZvdXJpdGVPdXRmaXRbXT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KTogdm9pZCA9PiB7XG4gICAgICBpZiAoIXRoaXMuZGIpIHJldHVybiByZWplY3QoXCJObyBkYXRhYmFzZVwiKVxuXG4gICAgICBjb25zdCByZXF1ZXN0ID0gdGhpcy5kYlxuICAgICAgICAudHJhbnNhY3Rpb24oW1RhYmxlcy5mYXZvdXJpdGVfb3V0Zml0c10sIFwicmVhZG9ubHlcIilcbiAgICAgICAgLm9iamVjdFN0b3JlKFRhYmxlcy5mYXZvdXJpdGVfb3V0Zml0cylcbiAgICAgICAgLmdldEFsbCgpXG5cbiAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gKCk6IHZvaWQgPT5cbiAgICAgICAgcmVzb2x2ZShcbiAgICAgICAgICByZXF1ZXN0LnJlc3VsdC5tYXA8RmF2b3VyaXRlT3V0Zml0PigoZmF2b3VyaXRlOiBGYXZvdXJpdGVPdXRmaXQpID0+ICh7XG4gICAgICAgICAgICAuLi5mYXZvdXJpdGUsXG4gICAgICAgICAgICB1cmw6IFVSTC5jcmVhdGVPYmplY3RVUkwoZmF2b3VyaXRlLmJsb2IpLFxuICAgICAgICAgIH0pKVxuICAgICAgICApXG4gICAgfSlcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgSW5kZXhlZERCKClcbiIsImV4cG9ydCBlbnVtIFRhYmxlcyB7XG4gIGZhdm91cml0ZV9vdXRmaXRzID0gXCJmYXZvdXJpdGVfb3V0Zml0c1wiLFxufVxuIiwiZXhwb3J0IGVudW0gTG9jYWxTdG9yYWdlS2V5IHtcbiAgYXV0b0V4cGxvcmVMb2NhdGlvbnMgPSBcImF1dG9FeHBsb3JlTG9jYXRpb25zXCIsXG4gIGRlYnVnID0gXCJkZWJ1Z1wiLFxuICBleHBsb3JhdGlvbkhpc3RvcnkgPSBcImV4cGxvcmF0aW9uSGlzdG9yeVwiLFxuICBleHBsb3JhdGlvbnMgPSBcImV4cGxvcmF0aW9uc1wiLFxuICBtYXJrZXQgPSBcIm1hcmtldFwiLFxuICBtZXRhID0gXCJtZXRhXCIsXG4gIG1pbmlnYW1lcyA9IFwibWluaWdhbWVzXCIsXG4gIHB1cmNoYXNlcyA9IFwicHVyY2hhc2VzXCIsXG4gIHNhbGVzID0gXCJzYWxlc1wiLFxuICB1bmxvY2tlZCA9IFwidW5sb2NrZWRcIixcbiAgdmVyc2lvbiA9IFwidmVyc2lvblwiLFxuICB3aXNobGlzdCA9IFwid2lzaGxpc3RcIixcbn1cbiIsImltcG9ydCB7IGJhc2U2NFN0cmluZ1RvQmxvYiwgYmxvYlRvQmFzZTY0U3RyaW5nIH0gZnJvbSBcImJsb2ItdXRpbFwiXG5pbXBvcnQgdHlwZSB7IE1ldGEgfSBmcm9tIFwiLi4vYXBpL21ldGFcIlxuaW1wb3J0IHR5cGUgeyBOZXdGYXZvdXJpdGVPdXRmaXQgfSBmcm9tIFwiLi4vYXBwZWFyYW5jZS9pbnRlcmZhY2VzL2Zhdm91cml0ZV9vdXRmaXRcIlxuaW1wb3J0IGluZGV4ZWRfZGIgZnJvbSBcIi4uL2luZGV4ZWRfZGIvaW5kZXhlZF9kYlwiXG5pbXBvcnQgdHlwZSB7IE1hcmtldEVudHJ5IH0gZnJvbSBcIi4uL21hcmtldHBsYWNlL2ludGVyZmFjZXMvbWFya2V0X2VudHJ5XCJcbmltcG9ydCB0eXBlIHsgU2V0dGluZ3MgfSBmcm9tIFwiLi4vdGVtcGxhdGVzL2ludGVyZmFjZXMvc2V0dGluZ3NcIlxuaW1wb3J0IHR5cGUgeyBBdXRvRXhwbG9yZUxvY2F0aW9uIH0gZnJvbSBcIi4vYXV0b19leHBsb3JlX2xvY2F0aW9uXCJcbmltcG9ydCB0eXBlIHsgRXhwbG9yYXRpb25SZXN1bHQgfSBmcm9tIFwiLi9leHBsb3JhdGlvbl9yZXN1bHRcIlxuaW1wb3J0IHR5cGUgeyBFeHBvcnRhYmxlRmF2b3VyaXRlIH0gZnJvbSBcIi4vZXhwb3J0YWJsZV9mYXZvdXJpdGVcIlxuaW1wb3J0IHsgTG9jYWxTdG9yYWdlS2V5IH0gZnJvbSBcIi4vbG9jYWxfc3RvcmFnZS5lbnVtXCJcbmltcG9ydCB0eXBlIHsgU2FsZSB9IGZyb20gXCIuL3NhbGVcIlxuaW1wb3J0IHR5cGUgeyBXaXNoZWRJdGVtIH0gZnJvbSBcIi4vd2lzaGVkX2l0ZW1cIlxuXG5leHBvcnQgY2xhc3MgTG9jYWxTdG9yYWdlIHtcbiAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgbG9jYWxTdG9yYWdlID0gbG9jYWxTdG9yYWdlXG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgc3RhdGljIGdldCBhdXRvRXhwbG9yZUxvY2F0aW9ucygpOiBBdXRvRXhwbG9yZUxvY2F0aW9uW10ge1xuICAgIHJldHVybiB0aGlzLmdldEl0ZW08QXV0b0V4cGxvcmVMb2NhdGlvbltdPihcbiAgICAgIExvY2FsU3RvcmFnZUtleS5hdXRvRXhwbG9yZUxvY2F0aW9ucyxcbiAgICAgIFtdXG4gICAgKVxuICB9XG5cbiAgc3RhdGljIHNldCBhdXRvRXhwbG9yZUxvY2F0aW9ucyhsb2NhdGlvbnM6IEF1dG9FeHBsb3JlTG9jYXRpb25bXSkge1xuICAgIHRoaXMuc2V0SXRlbShMb2NhbFN0b3JhZ2VLZXkuYXV0b0V4cGxvcmVMb2NhdGlvbnMsIGxvY2F0aW9ucylcbiAgfVxuXG4gIHN0YXRpYyBnZXQgZGVidWcoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0SXRlbTxib29sZWFuPihMb2NhbFN0b3JhZ2VLZXkuZGVidWcsIGZhbHNlKVxuICB9XG5cbiAgc3RhdGljIHNldCBkZWJ1ZyhlbmFibGVkOiBib29sZWFuKSB7XG4gICAgdGhpcy5zZXRJdGVtKExvY2FsU3RvcmFnZUtleS5kZWJ1ZywgZW5hYmxlZClcbiAgfVxuXG4gIHN0YXRpYyBnZXQgZXhwbG9yYXRpb25IaXN0b3J5KCk6IEV4cGxvcmF0aW9uUmVzdWx0W10ge1xuICAgIHJldHVybiB0aGlzLmdldEl0ZW08RXhwbG9yYXRpb25SZXN1bHRbXT4oXG4gICAgICBMb2NhbFN0b3JhZ2VLZXkuZXhwbG9yYXRpb25IaXN0b3J5LFxuICAgICAgW11cbiAgICApXG4gIH1cblxuICBzdGF0aWMgc2V0IGV4cGxvcmF0aW9uSGlzdG9yeShleHBsb3JhdGlvbkhpc3Rvcnk6IEV4cGxvcmF0aW9uUmVzdWx0W10pIHtcbiAgICB0aGlzLnNldEl0ZW0oTG9jYWxTdG9yYWdlS2V5LmV4cGxvcmF0aW9uSGlzdG9yeSwgZXhwbG9yYXRpb25IaXN0b3J5KVxuICB9XG5cbiAgc3RhdGljIGdldCBleHBsb3JhdGlvbnMoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0SXRlbTxib29sZWFuPihMb2NhbFN0b3JhZ2VLZXkuZXhwbG9yYXRpb25zLCBmYWxzZSlcbiAgfVxuXG4gIHN0YXRpYyBzZXQgZXhwbG9yYXRpb25zKGVuYWJsZWQ6IGJvb2xlYW4pIHtcbiAgICB0aGlzLnNldEl0ZW0oTG9jYWxTdG9yYWdlS2V5LmV4cGxvcmF0aW9ucywgZW5hYmxlZClcbiAgfVxuXG4gIHN0YXRpYyBnZXQgbWFya2V0KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmdldEl0ZW08Ym9vbGVhbj4oTG9jYWxTdG9yYWdlS2V5Lm1hcmtldCwgZmFsc2UpXG4gIH1cblxuICBzdGF0aWMgc2V0IG1hcmtldChlbmFibGVkOiBib29sZWFuKSB7XG4gICAgdGhpcy5zZXRJdGVtKExvY2FsU3RvcmFnZUtleS5tYXJrZXQsIGVuYWJsZWQpXG4gIH1cblxuICBzdGF0aWMgZ2V0IG1ldGEoKTogTWV0YSB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLmdldEl0ZW08TWV0YSB8IG51bGw+KExvY2FsU3RvcmFnZUtleS5tZXRhLCBudWxsKVxuICB9XG5cbiAgc3RhdGljIHNldCBtZXRhKG1ldGE6IE1ldGEgfCBudWxsKSB7XG4gICAgdGhpcy5zZXRJdGVtKExvY2FsU3RvcmFnZUtleS5tZXRhLCBtZXRhKVxuICB9XG5cbiAgc3RhdGljIGdldCBtaW5pZ2FtZXMoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0SXRlbTxib29sZWFuPihMb2NhbFN0b3JhZ2VLZXkubWluaWdhbWVzLCBmYWxzZSlcbiAgfVxuXG4gIHN0YXRpYyBzZXQgbWluaWdhbWVzKGVuYWJsZWQ6IGJvb2xlYW4pIHtcbiAgICB0aGlzLnNldEl0ZW0oTG9jYWxTdG9yYWdlS2V5Lm1pbmlnYW1lcywgZW5hYmxlZClcbiAgfVxuXG4gIHN0YXRpYyBnZXQgcHVyY2hhc2VzKCk6IE1hcmtldEVudHJ5W10ge1xuICAgIHJldHVybiB0aGlzLmdldEl0ZW08TWFya2V0RW50cnlbXT4oTG9jYWxTdG9yYWdlS2V5LnB1cmNoYXNlcywgW10pXG4gIH1cblxuICBzdGF0aWMgc2V0IHB1cmNoYXNlcyhlbnRyeTogTWFya2V0RW50cnlbXSkge1xuICAgIHRoaXMuc2V0SXRlbShMb2NhbFN0b3JhZ2VLZXkucHVyY2hhc2VzLCBlbnRyeSlcbiAgfVxuXG4gIHN0YXRpYyBnZXQgc2FsZXMoKTogU2FsZVtdIHtcbiAgICByZXR1cm4gdGhpcy5nZXRJdGVtPFNhbGVbXT4oTG9jYWxTdG9yYWdlS2V5LnNhbGVzLCBbXSlcbiAgfVxuXG4gIHN0YXRpYyBzZXQgc2FsZXMoc2FsZTogU2FsZVtdKSB7XG4gICAgdGhpcy5zZXRJdGVtKExvY2FsU3RvcmFnZUtleS5zYWxlcywgc2FsZSlcbiAgfVxuXG4gIHN0YXRpYyBnZXQgdW5sb2NrZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0SXRlbTxib29sZWFuPihMb2NhbFN0b3JhZ2VLZXkudW5sb2NrZWQsIGZhbHNlKVxuICB9XG5cbiAgc3RhdGljIHNldCB1bmxvY2tlZCh1bmxvY2tlZDogYm9vbGVhbikge1xuICAgIHRoaXMuc2V0SXRlbShMb2NhbFN0b3JhZ2VLZXkudW5sb2NrZWQsIHVubG9ja2VkKVxuICB9XG5cbiAgc3RhdGljIGdldCB2ZXJzaW9uKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0SXRlbTxzdHJpbmc+KExvY2FsU3RvcmFnZUtleS52ZXJzaW9uLCBcIlwiKVxuICB9XG5cbiAgc3RhdGljIHNldCB2ZXJzaW9uKHZlcnNpb246IHN0cmluZykge1xuICAgIHRoaXMuc2V0SXRlbShMb2NhbFN0b3JhZ2VLZXkudmVyc2lvbiwgdmVyc2lvbilcbiAgfVxuXG4gIHN0YXRpYyBnZXQgd2lzaGxpc3QoKTogV2lzaGVkSXRlbVtdIHtcbiAgICByZXR1cm4gdGhpcy5nZXRJdGVtPFdpc2hlZEl0ZW1bXT4oTG9jYWxTdG9yYWdlS2V5Lndpc2hsaXN0LCBbXSlcbiAgfVxuXG4gIHN0YXRpYyBzZXQgd2lzaGxpc3QobG9jYXRpb25zOiBXaXNoZWRJdGVtW10pIHtcbiAgICB0aGlzLnNldEl0ZW0oTG9jYWxTdG9yYWdlS2V5Lndpc2hsaXN0LCBsb2NhdGlvbnMpXG4gIH1cblxuICBzdGF0aWMgYXN5bmMgZ2V0U2V0dGluZ3MoKTogUHJvbWlzZTxTZXR0aW5ncz4ge1xuICAgIHJldHVybiB7XG4gICAgICBhdXRvRXhwbG9yZUxvY2F0aW9uczogdGhpcy5hdXRvRXhwbG9yZUxvY2F0aW9ucyxcbiAgICAgIGRlYnVnOiB0aGlzLmRlYnVnLFxuICAgICAgZXhwbG9yYXRpb25IaXN0b3J5OiB0aGlzLmV4cGxvcmF0aW9uSGlzdG9yeSxcbiAgICAgIGV4cGxvcmF0aW9uczogdGhpcy5leHBsb3JhdGlvbnMsXG4gICAgICBmYXZvdXJpdGVzOiBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgKFxuICAgICAgICAgIGF3YWl0IGluZGV4ZWRfZGIuZ2V0RmF2b3VyaXRlT3V0Zml0cygpXG4gICAgICAgICkubWFwPFByb21pc2U8RXhwb3J0YWJsZUZhdm91cml0ZT4+KGFzeW5jIGZhdm91cml0ZSA9PiAoe1xuICAgICAgICAgIGlkOiBmYXZvdXJpdGUuaWQsXG4gICAgICAgICAgbmFtZTogZmF2b3VyaXRlLm5hbWUsXG4gICAgICAgICAgaXRlbXM6IGZhdm91cml0ZS5pdGVtcyxcbiAgICAgICAgICBiYXNlNjQ6IGF3YWl0IGJsb2JUb0Jhc2U2NFN0cmluZyhmYXZvdXJpdGUuYmxvYiksXG4gICAgICAgIH0pKVxuICAgICAgKSxcbiAgICAgIG1hcmtldDogdGhpcy5tYXJrZXQsXG4gICAgICBtaW5pZ2FtZXM6IHRoaXMubWluaWdhbWVzLFxuICAgICAgdW5sb2NrZWQ6IHRoaXMudW5sb2NrZWQsXG4gICAgICB2ZXJzaW9uOiB0aGlzLnZlcnNpb24sXG4gICAgICB3aXNobGlzdDogdGhpcy53aXNobGlzdCxcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgYXN5bmMgc2V0U2V0dGluZ3Moc2V0dGluZ3M6IFNldHRpbmdzKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5hdXRvRXhwbG9yZUxvY2F0aW9ucyA9IHNldHRpbmdzLmF1dG9FeHBsb3JlTG9jYXRpb25zXG4gICAgdGhpcy5kZWJ1ZyA9IHNldHRpbmdzLmRlYnVnXG4gICAgdGhpcy5leHBsb3JhdGlvbkhpc3RvcnkgPSBzZXR0aW5ncy5leHBsb3JhdGlvbkhpc3RvcnlcbiAgICB0aGlzLmV4cGxvcmF0aW9ucyA9IHNldHRpbmdzLmV4cGxvcmF0aW9uc1xuICAgIHRoaXMubWFya2V0ID0gc2V0dGluZ3MubWFya2V0XG4gICAgdGhpcy5taW5pZ2FtZXMgPSBzZXR0aW5ncy5taW5pZ2FtZXNcbiAgICB0aGlzLnVubG9ja2VkID0gc2V0dGluZ3MudW5sb2NrZWRcbiAgICB0aGlzLnZlcnNpb24gPSBzZXR0aW5ncy52ZXJzaW9uXG4gICAgdGhpcy53aXNobGlzdCA9IHNldHRpbmdzLndpc2hsaXN0XG5cbiAgICBhd2FpdCBpbmRleGVkX2RiLmNsZWFyRmF2b3VyaXRlT3V0Zml0cygpXG4gICAgZm9yIChjb25zdCBmYXZvdXJpdGUgb2Ygc2V0dGluZ3MuZmF2b3VyaXRlcy5tYXA8TmV3RmF2b3VyaXRlT3V0Zml0PihcbiAgICAgIGZhdm91cml0ZSA9PiAoe1xuICAgICAgICBuYW1lOiBmYXZvdXJpdGUubmFtZSxcbiAgICAgICAgaXRlbXM6IGZhdm91cml0ZS5pdGVtcyxcbiAgICAgICAgYmxvYjogYmFzZTY0U3RyaW5nVG9CbG9iKGZhdm91cml0ZS5iYXNlNjQpLFxuICAgICAgfSlcbiAgICApKSB7XG4gICAgICB2b2lkIGluZGV4ZWRfZGIuYWRkRmF2b3VyaXRlT3V0Zml0KGZhdm91cml0ZSlcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgYXN5bmMgcmVzZXRTZXR0aW5ncygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLmF1dG9FeHBsb3JlTG9jYXRpb25zID0gW11cbiAgICB0aGlzLmRlYnVnID0gZmFsc2VcbiAgICB0aGlzLmV4cGxvcmF0aW9uSGlzdG9yeSA9IFtdXG4gICAgdGhpcy5leHBsb3JhdGlvbnMgPSBmYWxzZVxuICAgIHRoaXMubWFya2V0ID0gZmFsc2VcbiAgICB0aGlzLm1pbmlnYW1lcyA9IGZhbHNlXG4gICAgdGhpcy51bmxvY2tlZCA9IGZhbHNlXG4gICAgdGhpcy52ZXJzaW9uID0gXCJcIlxuICAgIHRoaXMud2lzaGxpc3QgPSBbXVxuICAgIGF3YWl0IGluZGV4ZWRfZGIuY2xlYXJGYXZvdXJpdGVPdXRmaXRzKClcbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIGdldEl0ZW08VD4oa2V5OiBMb2NhbFN0b3JhZ2VLZXksIGZhbGxiYWNrOiBUKTogVCB7XG4gICAgcmV0dXJuIChKU09OLnBhcnNlKFxuICAgICAgdGhpcy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpID8/IEpTT04uc3RyaW5naWZ5KGZhbGxiYWNrKVxuICAgICkgPz8gZmFsbGJhY2spIGFzIFRcbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIHNldEl0ZW08VD4oa2V5OiBMb2NhbFN0b3JhZ2VLZXksIHZhbHVlOiBUKTogdm9pZCB7XG4gICAgdGhpcy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KHZhbHVlKSlcbiAgfVxufVxuIiwiZXhwb3J0IGVudW0gQm9keUxvY2F0aW9uIHtcbiAgQWxsID0gXCJcIixcbiAgVW5kZXJ3ZWFyID0gMSxcbiAgU2tpbnMgPSAyLFxuICBUYXR0b29zID0gMjAsXG4gIE1vdXRocyA9IDIxLFxuICBFeWVzID0gMyxcbiAgSGFpciA9IDQsXG4gIFNvY2tzID0gNSxcbiAgU2hvZXMgPSA2LFxuICBQYW50cyA9IDcsXG4gIEhhbmRBY2Nlc3NvcmllcyA9IDgsXG4gIFRvcHMgPSA5LFxuICBDb2F0cyA9IDEwLFxuICBHbG92ZXMgPSAxMSxcbiAgTmVja2xhY2VzID0gMTIsXG4gIERyZXNzZXMgPSAxMyxcbiAgSGF0cyA9IDE0LFxuICBGYWNlQWNjZXNzb3JpZXMgPSAxNSxcbiAgRnVuZHMgPSAxNixcbiAgQmVsdHMgPSAxOCxcbiAgQXRtb3NwaGVyZXMgPSAxOSxcbn1cbiIsImltcG9ydCB7IFR5cGUgfSBmcm9tIFwiLi90eXBlLmVudW1cIlxuXG5leHBvcnQgZW51bSBDYXRlZ29yeVN0cmluZyB7XG4gIGFsbCA9IFwiXCIsXG4gIGZvb2QgPSBcImZvb2RcIixcbiAgYWxjaGVteSA9IFwiYWxjaGVteVwiLFxuICB1dGlsaXR5ID0gXCJ1dGlsaXR5XCIsXG4gIHRhbWUgPSBcInRhbWVcIixcbn1cblxuZXhwb3J0IGVudW0gQ2F0ZWdvcnlOdW1iZXIge1xuICBhbGwgPSBDYXRlZ29yeVN0cmluZy5hbGwsXG4gIGZvb2QgPSAxLFxuICBhbGNoZW15ID0gVHlwZS5Db25zdW1hYmxlLFxuICB1dGlsaXR5ID0gMyxcbiAgdGFtZSA9IDQsXG59XG4iLCJleHBvcnQgZW51bSBHdWFyZCB7XG4gIGFueSA9IFwiXCIsXG4gIGxpZ2h0ID0gMSxcbiAgb2JzaWRpYW4sXG4gIGFic3ludGhlLFxuICBzaGFkb3csXG59XG4iLCJleHBvcnQgZW51bSBSYXJpdHkge1xuICBhbGwgPSBcIlwiLFxuICBjb21tb24gPSBcImNvbW1vblwiLFxuICByYXJlID0gXCJyYXJlXCIsXG4gIGVwaWMgPSBcImVwaWNcIixcbiAgbGVnZW5kYXJ5ID0gXCJsZWdlbmRhcnlcIixcbiAgZXZlbnQgPSBcImV2ZW50XCIsXG59XG4iLCJleHBvcnQgZW51bSBUeXBlIHtcbiAgQWxsID0gXCJcIixcbiAgQmFnID0gXCJCYWdcIixcbiAgQ29uc3VtYWJsZSA9IFwiQ29uc3VtYWJsZVwiLFxuICBFZ2dJdGVtID0gXCJFZ2dJdGVtXCIsXG4gIFBsYXllcldlYXJhYmxlSXRlbSA9IFwiUGxheWVyV2VhcmFibGVJdGVtXCIsXG4gIFF1ZXN0SXRlbSA9IFwiUXVlc3RJdGVtXCIsXG59XG4iLCJpbXBvcnQgeyBDb25zb2xlIH0gZnJvbSBcIi4uL2NvbnNvbGVcIlxuaW1wb3J0IHsgdHJpbUljb24gfSBmcm9tIFwiLi4vZWxkYXJ5YV91dGlsXCJcbmltcG9ydCB7IFJhcml0eSB9IGZyb20gXCIuL2VudW1zL3Jhcml0eS5lbnVtXCJcbmltcG9ydCB0eXBlIHsgQnV5Tm93UHJpY2UgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL2J1eV9ub3dfcHJpY2VcIlxuaW1wb3J0IHR5cGUgeyBDdXJyZW50UHJpY2UgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL2N1cnJlbnRfcHJpY2VcIlxuaW1wb3J0IHR5cGUgeyBNYXJrZXRFbnRyeSB9IGZyb20gXCIuL2ludGVyZmFjZXMvbWFya2V0X2VudHJ5XCJcbmltcG9ydCB0eXBlIHsgTWFya2V0RW50cnlEYXRhU2V0IH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9tYXJrZXRfZW50cnlfZGF0YV9zZXRcIlxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SXRlbURldGFpbHMobGk6IEhUTUxMSUVsZW1lbnQpOiBNYXJrZXRFbnRyeSB8IG51bGwge1xuICBjb25zdCBkYXRhc2V0ID0gbGkuZGF0YXNldCBhcyB1bmtub3duIGFzIE1hcmtldEVudHJ5RGF0YVNldFxuICBjb25zdCBuYW1lID0gbGkucXVlcnlTZWxlY3RvcjxIVE1MRGl2RWxlbWVudD4oXCIuYWJzdHJhY3QtbmFtZVwiKT8uaW5uZXJUZXh0XG4gIGNvbnN0IGFic3RyYWN0VHlwZSA9XG4gICAgbGkucXVlcnlTZWxlY3RvcjxIVE1MRGl2RWxlbWVudD4oXCIuYWJzdHJhY3QtdHlwZVwiKT8uaW5uZXJUZXh0XG4gIGNvbnN0IHNyYyA9IGxpLnF1ZXJ5U2VsZWN0b3I8SFRNTEltYWdlRWxlbWVudD4oXCIuYWJzdHJhY3QtaWNvbiBpbWdcIik/LnNyY1xuXG4gIGNvbnN0IHJhcml0eTogUmFyaXR5ID1cbiAgICBSYXJpdHlbXG4gICAgICAobGlcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgICAgXCIucmFyaXR5LW1hcmtlci1jb21tb24sIC5yYXJpdHktbWFya2VyLXJhcmUsIC5yYXJpdHktbWFya2VyLWVwaWMsIC5yYXJpdHktbWFya2VyLWxlZ2VuZGFyeSwgLnJhcml0eS1tYXJrZXItZXZlbnRcIlxuICAgICAgICApXG4gICAgICAgID8uY2xhc3NOYW1lLnNwbGl0KFwicmFyaXR5LW1hcmtlci1cIilbMV0gPz8gXCJcIikgYXMga2V5b2YgdHlwZW9mIFJhcml0eVxuICAgIF1cblxuICBjb25zdCBjdXJyZW50UHJpY2UgPSBsaS5xdWVyeVNlbGVjdG9yPEhUTUxJbWFnZUVsZW1lbnQ+KFxuICAgIFwiLnByaWNlLWl0ZW1bZGF0YS1iaWRzXVwiXG4gICk/LmRhdGFzZXQgYXMgdW5rbm93biBhcyBDdXJyZW50UHJpY2VcblxuICBjb25zdCBidXlOb3dQcmljZSA9IGxpLnF1ZXJ5U2VsZWN0b3I8SFRNTEltYWdlRWxlbWVudD4oXG4gICAgXCIucHJpY2UtaXRlbTpub3QoW2RhdGEtYmlkc10pXCJcbiAgKT8uZGF0YXNldCBhcyB1bmtub3duIGFzIEJ1eU5vd1ByaWNlXG5cbiAgaWYgKCFzcmMgfHwgIW5hbWUpIHtcbiAgICBDb25zb2xlLndhcm4oXCJJbmNvbXBsZXRlIG1hcmtldCBlbnRyeVwiLCBsaSlcbiAgICByZXR1cm4gbnVsbFxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5kYXRhc2V0LFxuICAgIGljb246IHRyaW1JY29uKHNyYyksXG4gICAgcmFyaXR5LFxuICAgIG5hbWUsXG4gICAgYWJzdHJhY3RUeXBlLFxuICAgIGJ1eU5vd1ByaWNlLFxuICAgIGN1cnJlbnRQcmljZSxcbiAgICBkYXRlOiBuZXcgRGF0ZSgpLFxuICB9XG59XG4iLCJpbXBvcnQgeyBMb2NhbFN0b3JhZ2UgfSBmcm9tIFwiLi9sb2NhbF9zdG9yYWdlL2xvY2FsX3N0b3JhZ2VcIlxuXG5leHBvcnQgZnVuY3Rpb24gbWlncmF0ZSgpOiB2b2lkIHtcbiAgc3dpdGNoIChMb2NhbFN0b3JhZ2UudmVyc2lvbikge1xuICAgIGNhc2UgR00uaW5mby5zY3JpcHQudmVyc2lvbjpcbiAgICAgIHJldHVyblxuXG4gICAgY2FzZSBcIlwiOlxuICAgICAgaW5zdGFsbGVkKClcbiAgICAgIGJyZWFrXG5cbiAgICBkZWZhdWx0OlxuICAgICAgc3dpdGNoIChHTS5pbmZvLnNjcmlwdC52ZXJzaW9uKSB7XG4gICAgICAgIGNhc2UgXCIxLjIuMFwiOlxuICAgICAgICAgIHYxXzJfMCgpXG4gICAgICAgICAgYnJlYWtcblxuICAgICAgICBjYXNlIFwiMS4yLjlcIjpcbiAgICAgICAgICB2MV8yXzkoKVxuICAgICAgICAgIGJyZWFrXG5cbiAgICAgICAgY2FzZSBcIjEuMi4xMFwiOlxuICAgICAgICAgIHYxXzJfMTAoKVxuICAgICAgICAgIGJyZWFrXG5cbiAgICAgICAgY2FzZSBcIjEuMi4xM1wiOlxuICAgICAgICAgIHYxXzJfMTMoKVxuICAgICAgICAgIGJyZWFrXG5cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBpbnN0YWxsZWQoKVxuICAgICAgICAgIGJyZWFrXG4gICAgICB9XG4gIH1cblxuICBMb2NhbFN0b3JhZ2UudmVyc2lvbiA9IEdNLmluZm8uc2NyaXB0LnZlcnNpb25cbn1cblxuZnVuY3Rpb24gaW5zdGFsbGVkKCk6IHZvaWQge1xuICAkLmZsYXZyTm90aWYoYCR7bmFtZSgpfSAke3ZlcnNpb24oKX0gaW5zdGFsbGVkIWApXG59XG5cbmZ1bmN0aW9uIG5hbWUoKTogc3RyaW5nIHtcbiAgcmV0dXJuIGA8c3Ryb25nPiR7R00uaW5mby5zY3JpcHQubmFtZX08L3N0cm9uZz5gXG59XG5cbmZ1bmN0aW9uIHZlcnNpb24oKTogc3RyaW5nIHtcbiAgcmV0dXJuIGB2PHN0cm9uZz4ke0dNLmluZm8uc2NyaXB0LnZlcnNpb259PC9zdHJvbmc+YFxufVxuXG5mdW5jdGlvbiB2MV8yXzAoKTogdm9pZCB7XG4gIExvY2FsU3RvcmFnZS5zYWxlcyA9IFtdXG4gICQuZmxhdnJOb3RpZihgVXBkYXRlZCB0byAke3ZlcnNpb24oKX0uIFlvdXIgc2FsZXMgaGlzdG9yeSB3YXMgZXJhc2VkLmApXG59XG5cbmZ1bmN0aW9uIHYxXzJfOSgpOiB2b2lkIHtcbiAgJC5mbGF2ck5vdGlmKFxuICAgIGBVcGRhdGVkIHRvICR7dmVyc2lvbigpfS4gVGhlIHdpc2hsaXN0IGhhcyBiZWVuIGltcHJvdmVkIHRvIHNvcnQgYnkgY2F0ZWdvcnkvdHlwZS9uYW1lLCBidXQgeW91ciB3aXNoZWQgaXRlbXMgZG8gbm90IGhhdmUgYSB0eXBlLiBZb3UgY2FuIGFkZCB0eXBlcyBieSByZS1hZGRpbmcgdGhlIGl0ZW1zIHZpYSB0aGUgbWFya2V0LmBcbiAgKVxufVxuXG5mdW5jdGlvbiB2MV8yXzEwKCk6IHZvaWQge1xuICAkLmZsYXZyTm90aWYoXG4gICAgYFVwZGF0ZWQgdG8gJHt2ZXJzaW9uKCl9LiBUaGUgd2lzaGxpc3QgaGFzIGJlZW4gaW1wcm92ZWQgdG8gc29ydCBieSBjYXRlZ29yeS90eXBlL3Jhcml0eS9uYW1lLCBidXQgeW91ciB3aXNoZWQgaXRlbXMgZG8gbm90IGhhdmUgYSByYXJpdHkuIFlvdSBjYW4gYWRkIHJhcml0aWVzIGJ5IHJlLWFkZGluZyB0aGUgaXRlbXMgdmlhIHRoZSBtYXJrZXQuYFxuICApXG59XG5cbmZ1bmN0aW9uIHYxXzJfMTMoKTogdm9pZCB7XG4gICQuZmxhdnJOb3RpZihcbiAgICBgVXBkYXRlZCB0byAke3ZlcnNpb24oKX0uIFRoZSBlbmhhbmNlZCBkcmVzc2luZyBleHBlcmllbmNlIHdhcyBkaXNhYmxlZC5gXG4gIClcbn1cbiIsImltcG9ydCB0eXBlIHsgVGVtcGxhdGUgfSBmcm9tIFwiaG9nYW4uanNcIlxuaW1wb3J0IHR5cGUgeyBHZXRQcml6ZXNEYXRhIH0gZnJvbSBcIi4uL2FwaS9nZXRfcHJpemVzX2RhdGFcIlxuaW1wb3J0IHR5cGUgeyBQYWNrZXQgfSBmcm9tIFwiLi4vYXBpL3BhY2tldFwiXG5pbXBvcnQgdHlwZSB7IFN0YXJ0R2FtZURhdGEgfSBmcm9tIFwiLi4vYXBpL3N0YXJ0X2dhbWVfZGF0YVwiXG5pbXBvcnQgXCIuLi9lbGRhcnlhL2pxdWVyeVwiXG5pbXBvcnQgeyB0cmFuc2xhdGUgfSBmcm9tIFwiLi4vaTE4bi90cmFuc2xhdGVcIlxuaW1wb3J0IHsgZmxhcHB5IH0gZnJvbSBcIi4vZmxhcHB5XCJcbmltcG9ydCB7IGhhdGNobGluZ3MgfSBmcm9tIFwiLi9oYXRjaGxpbmdzXCJcbmltcG9ydCB0eXBlIHsgTWluaWdhbWUgfSBmcm9tIFwiLi9taW5pZ2FtZVwiXG5pbXBvcnQgeyBwZWdnbGUgfSBmcm9tIFwiLi9wZWdnbGVcIlxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcGxheVBlZ2dsZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgcmV0dXJuIHBsYXkocGVnZ2xlKVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcGxheUZsYXBweSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgcmV0dXJuIHBsYXkoZmxhcHB5KVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcGxheUhhdGNobGluZ3MoKTogUHJvbWlzZTx2b2lkPiB7XG4gIHJldHVybiBwbGF5KGhhdGNobGluZ3MpXG59XG5cbmFzeW5jIGZ1bmN0aW9uIHBsYXkobWluaWdhbWU6IE1pbmlnYW1lKTogUHJvbWlzZTx2b2lkPiB7XG4gIC8vIERpc2FibGUgYnV0dG9uc1xuICBhd2FpdCBuZXcgUHJvbWlzZTxib29sZWFuPihyZXNvbHZlID0+IHtcbiAgICBjb25zdCBpbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgIGNvbnN0IGJ1dHRvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxCdXR0b25FbGVtZW50PihcbiAgICAgICAgXCIubWluaWdhbWVzLXJ1bGVzIC5mbGF2ci1idXR0b25cIlxuICAgICAgKVxuXG4gICAgICBpZiAoYnV0dG9ucy5sZW5ndGgpIHtcbiAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbClcblxuICAgICAgICBmb3IgKGNvbnN0IGJ1dHRvbiBvZiBidXR0b25zKSB7XG4gICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJkaXNhYmxlZFwiKVxuICAgICAgICB9XG5cbiAgICAgICAgcmVzb2x2ZSh0cnVlKVxuICAgICAgfVxuICAgIH0sIDI1MClcbiAgfSlcblxuICBjb25zdCBqc29uID0gYXdhaXQgZXhlY3V0ZShtaW5pZ2FtZSlcblxuICBjb25zdCB0ZW1wbGF0ZTogVGVtcGxhdGUgPSByZXF1aXJlKFwiLi4vdGVtcGxhdGVzL2h0bWwvZmxhdnJfbm90aWYvaWNvbl9tZXNzYWdlLmh0bWxcIilcbiAgJC5mbGF2ck5vdGlmKFxuICAgIHRlbXBsYXRlLnJlbmRlcih7XG4gICAgICAuLi5taW5pZ2FtZSxcbiAgICAgIG1lc3NhZ2U6IHRyYW5zbGF0ZS5taW5pZ2FtZXMucGxheWluZyhtaW5pZ2FtZS5uYW1lKSxcbiAgICB9KVxuICApXG5cbiAgY29uc3QgZ2FtZVRva2VuID0ganNvbi5kYXRhXG4gIGNvbnN0IHNjb3JlID0gcmFuZG9tSW50KG1pbmlnYW1lLnNjb3JlTWluLCBtaW5pZ2FtZS5zY29yZU1heClcbiAgY29uc3QgZW5jX3Rva2VuID0geG9yRW5jb2RlKGdhbWVUb2tlbiwgc2NvcmUudG9TdHJpbmcoKSlcbiAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PlxuICAgIHNldFRpbWVvdXQocmVzb2x2ZSwgcmFuZG9tSW50KG1pbmlnYW1lLmRlbGF5TWluLCBtaW5pZ2FtZS5kZWxheU1heCkpXG4gIClcblxuICBhd2FpdCBnZXRQcml6ZXMobWluaWdhbWUsIGdhbWVUb2tlbiwgc2NvcmUpXG4gIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCByYW5kb21JbnQoMTAwMCwgMzAwMCkpKVxuXG4gIGF3YWl0IHNlbmQoZW5jX3Rva2VuLCBzY29yZSwgbWluaWdhbWUubmFtZS50b0xvd2VyQ2FzZSgpKVxuICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgcmFuZG9tSW50KDEwMDAsIDMwMDApKSlcbn1cblxuZnVuY3Rpb24gcmFuZG9tSW50KG1pbjogbnVtYmVyLCBtYXg6IG51bWJlcik6IG51bWJlciB7XG4gIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkgKyBtaW4pXG59XG5cbmFzeW5jIGZ1bmN0aW9uIGV4ZWN1dGUobWluaWdhbWU6IE1pbmlnYW1lKTogUHJvbWlzZTxQYWNrZXQ8U3RhcnRHYW1lRGF0YT4+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlPFBhY2tldDxTdGFydEdhbWVEYXRhPj4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGlmICh0eXBlb2YgUmVjYXB0Y2hhICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICBSZWNhcHRjaGEuZXhlY3V0ZShcbiAgICAgICAgYG1pbmlnYW1lU3RhcnQke21pbmlnYW1lLm5hbWV9YCxcbiAgICAgICAgKHRva2VuKTogdm9pZCA9PlxuICAgICAgICAgIHZvaWQgc3RhcnRHYW1lKG1pbmlnYW1lLCB0b2tlbikudGhlbihyZXNvbHZlKS5jYXRjaChyZWplY3QpXG4gICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIHZvaWQgc3RhcnRHYW1lKG1pbmlnYW1lKS50aGVuKHJlc29sdmUpLmNhdGNoKHJlamVjdClcbiAgICB9XG4gIH0pXG59XG5cbmFzeW5jIGZ1bmN0aW9uIHN0YXJ0R2FtZShcbiAgbWluaWdhbWU6IE1pbmlnYW1lLFxuICByZWNhcHRjaGFUb2tlbj86IHN0cmluZ1xuKTogUHJvbWlzZTxQYWNrZXQ8U3RhcnRHYW1lRGF0YT4+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlPFBhY2tldDxTdGFydEdhbWVEYXRhPj4oXG4gICAgKHJlc29sdmUsIHJlamVjdCkgPT5cbiAgICAgIHZvaWQgJC5hamF4KHtcbiAgICAgICAgdXJsOiBcIi9taW5pZ2FtZXMvYWpheF9zdGFydEdhbWVcIixcbiAgICAgICAgdHlwZTogXCJwb3N0XCIsXG4gICAgICAgIGRhdGFUeXBlOiBcImpzb25cIixcbiAgICAgICAgZGF0YTogcmVjYXB0Y2hhVG9rZW5cbiAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgZ2FtZTogbWluaWdhbWUubmFtZS50b0xvd2VyQ2FzZSgpLFxuICAgICAgICAgICAgICByZWNhcHRjaGFUb2tlbjogcmVjYXB0Y2hhVG9rZW4sXG4gICAgICAgICAgICB9XG4gICAgICAgICAgOiB7XG4gICAgICAgICAgICAgIGdhbWU6IG1pbmlnYW1lLm5hbWUudG9Mb3dlckNhc2UoKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIHN1Y2Nlc3M6IChqc29uOiBQYWNrZXQ8U3RhcnRHYW1lRGF0YT4pOiB2b2lkID0+IHtcbiAgICAgICAgICByZXNvbHZlKGpzb24pXG4gICAgICAgIH0sXG4gICAgICAgIGVycm9yOiAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgcmVqZWN0KClcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gIClcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0UHJpemVzKFxuICBtaW5pZ2FtZTogTWluaWdhbWUsXG4gIGdhbWVUb2tlbjogc3RyaW5nLFxuICBzY29yZTogbnVtYmVyXG4pOiBQcm9taXNlPFBhY2tldDxHZXRQcml6ZXNEYXRhPj4ge1xuICByZXR1cm4gbmV3IFByb21pc2U8UGFja2V0PEdldFByaXplc0RhdGE+PihcbiAgICAocmVzb2x2ZSk6IHZvaWQgPT5cbiAgICAgIHZvaWQgJC5wb3N0KFxuICAgICAgICBcIi9taW5pZ2FtZXMvYWpheF9nZXRQcml6ZXNcIixcbiAgICAgICAgeyBnYW1lOiBtaW5pZ2FtZS5uYW1lLnRvTG93ZXJDYXNlKCksIHNjb3JlOiBzY29yZSB9LFxuICAgICAgICAoanNvbjogUGFja2V0PEdldFByaXplc0RhdGE+KTogdm9pZCA9PiB7XG4gICAgICAgICAgcmVzb2x2ZShqc29uKVxuXG4gICAgICAgICAgaWYgKGpzb24ucmVzdWx0ID09PSBcInN1Y2Nlc3NcIikge1xuICAgICAgICAgICAgY29uc3QgdGVtcGxhdGU6IFRlbXBsYXRlID0gcmVxdWlyZShcIi4uL3RlbXBsYXRlcy9odG1sL2ZsYXZyX25vdGlmL2ljb25fbWVzc2FnZS5odG1sXCIpXG5cbiAgICAgICAgICAgICQuZmxhdnJOb3RpZihcbiAgICAgICAgICAgICAgdGVtcGxhdGUucmVuZGVyKHtcbiAgICAgICAgICAgICAgICAuLi5taW5pZ2FtZSxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB0cmFuc2xhdGUubWluaWdhbWVzLnBsYXllZF9mb3IoXG4gICAgICAgICAgICAgICAgICBtaW5pZ2FtZS5uYW1lLFxuICAgICAgICAgICAgICAgICAganNvbi5kYXRhLm1hYW5hXG4gICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIClcbiAgICAgICAgICB9IGVsc2UgJC5mbGF2ck5vdGlmKGpzb24uZGF0YSlcbiAgICAgICAgfSxcbiAgICAgICAgXCJqc29uXCJcbiAgICAgICkuZmFpbCgoKSA9PlxuICAgICAgICBzZXRUaW1lb3V0KCgpOiB2b2lkID0+IHtcbiAgICAgICAgICByZXNvbHZlKGdldFByaXplcyhtaW5pZ2FtZSwgZ2FtZVRva2VuLCBzY29yZSkpXG4gICAgICAgIH0sIHJhbmRvbUludCgxMDAwLCAzMDAwKSlcbiAgICAgIClcbiAgKVxufVxuXG4vKipcbiAqIFPDqWN1cmlzYXRpb24gZGUgbCdlbnZvaSBkdSBzY29yZVxuICogQmFzw6kgc3VyIGwnZW5jb2RhZ2UgWE9SIDogaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9YT1JfY2lwaGVyXG4gKiBFZmZlY3R1ZSB1biBYT1IgYml0IMOgIGJpdCBlbnRyZSB1bmUgY2hhaW5lIGV0IHVuZSBjbMOpXG4gKi9cbmZ1bmN0aW9uIHhvckVuY29kZShzdHI6IHN0cmluZywga2V5OiBzdHJpbmcpOiBzdHJpbmcge1xuICAvLyBBc3N1cmUgcXVlIGxlcyBkZXV4IHBhcmFtw6h0cmVzIHNvaWVudCBkZXMgY2hhaW5lcyBkZSBjYXJhY3TDqHJlXG4gIHN0ciA9IHN0ci50b1N0cmluZygpXG4gIGtleSA9IGtleS50b1N0cmluZygpXG5cbiAgLyoqIEVuY29kYWdlIFhPUiAqL1xuICBsZXQgeG9yID0gXCJcIlxuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvcHJlZmVyLWZvci1vZlxuICBmb3IgKGxldCBpID0gMDsgaSA8IHN0ci5sZW5ndGg7ICsraSkge1xuICAgIGxldCB0bXAgPSBzdHJbaV1cbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IGtleS5sZW5ndGg7ICsraikge1xuICAgICAgdG1wID0gU3RyaW5nLmZyb21DaGFyQ29kZSh0bXAhLmNoYXJDb2RlQXQoMCkgXiBrZXkuY2hhckNvZGVBdChqKSlcbiAgICB9XG4gICAgeG9yICs9IHRtcFxuICB9XG5cbiAgLy8gUmVudm9pZSBsZSByw6lzdWx0YXQgZW4gZW5jb2RhbnQgbGVzIGNhcmFjdMOocmVzIHNww6ljaWF1eCBwb3V2YW50IHBvc2VyIHByb2Jsw6htZSAoXFxuIHBhciBleGVtcGxlKVxuICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHhvcilcbn1cblxuYXN5bmMgZnVuY3Rpb24gc2VuZChcbiAgZW5jX3Rva2VuOiBzdHJpbmcsXG4gIHNjb3JlOiBudW1iZXIsXG4gIGdhbWU6IHN0cmluZ1xuKTogUHJvbWlzZTx2b2lkPiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICBpZiAodHlwZW9mIFJlY2FwdGNoYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgUmVjYXB0Y2hhLmV4ZWN1dGUoXG4gICAgICAgIFwibWluaWdhbWVTYXZlXCIgKyBnYW1lLFxuICAgICAgICAocmVjYXB0Y2hhVG9rZW4pOiB2b2lkID0+XG4gICAgICAgICAgdm9pZCBzYXZlU2NvcmUoZW5jX3Rva2VuLCBzY29yZSwgZ2FtZSwgcmVjYXB0Y2hhVG9rZW4pLnRoZW4ocmVzb2x2ZSlcbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgdm9pZCBzYXZlU2NvcmUoZW5jX3Rva2VuLCBzY29yZSwgZ2FtZSkudGhlbihyZXNvbHZlKVxuICAgIH1cbiAgfSlcbn1cblxuYXN5bmMgZnVuY3Rpb24gc2F2ZVNjb3JlKFxuICBlbmNfdG9rZW46IHN0cmluZyxcbiAgc2NvcmU6IG51bWJlcixcbiAgZ2FtZTogc3RyaW5nLFxuICByZWNhcHRjaGFUb2tlbj86IHN0cmluZ1xuKTogUHJvbWlzZTx2b2lkPiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICBjb25zdCB0b2tlbiA9IGRlY29kZVVSSUNvbXBvbmVudChlbmNfdG9rZW4pXG5cbiAgICB2b2lkICQuYWpheCh7XG4gICAgICB0eXBlOiBcInBvc3RcIixcbiAgICAgIHVybDogXCIvbWluaWdhbWVzL2FqYXhfc2F2ZVNjb3JlXCIsXG4gICAgICBkYXRhOiByZWNhcHRjaGFUb2tlblxuICAgICAgICA/IHtcbiAgICAgICAgICAgIHRva2VuOiB0b2tlbixcbiAgICAgICAgICAgIHNjb3JlOiBzY29yZSxcbiAgICAgICAgICAgIGdhbWU6IGdhbWUsXG4gICAgICAgICAgICByZWNhcHRjaGFUb2tlbjogcmVjYXB0Y2hhVG9rZW4sXG4gICAgICAgICAgfVxuICAgICAgICA6IHtcbiAgICAgICAgICAgIHRva2VuOiB0b2tlbixcbiAgICAgICAgICAgIHNjb3JlOiBzY29yZSxcbiAgICAgICAgICAgIGdhbWU6IGdhbWUsXG4gICAgICAgICAgfSxcbiAgICAgIHN1Y2Nlc3M6ICgpOiB2b2lkID0+IHtcbiAgICAgICAgcmVzb2x2ZSgpXG4gICAgICB9LFxuICAgICAgZXJyb3I6ICgpID0+XG4gICAgICAgIHNldFRpbWVvdXQoKCk6IHZvaWQgPT4ge1xuICAgICAgICAgIHJlc29sdmUoc2F2ZVNjb3JlKGVuY190b2tlbiwgc2NvcmUsIGdhbWUpKVxuICAgICAgICB9LCByYW5kb21JbnQoMTAwMCwgMzAwMCkpLFxuICAgIH0pXG4gIH0pXG59XG4iLCJpbXBvcnQgdHlwZSB7IE1pbmlnYW1lIH0gZnJvbSBcIi4vbWluaWdhbWVcIlxuXG5leHBvcnQgY29uc3QgZmxhcHB5OiBNaW5pZ2FtZSA9IHtcbiAgbmFtZTogXCJGbGFwcHlcIixcbiAgc2NvcmVNaW46IDE4MCxcbiAgc2NvcmVNYXg6IDIwMCxcbiAgZGVsYXlNaW46IDYwXzAwMCxcbiAgZGVsYXlNYXg6IDcwXzAwMCxcbiAgYnV0dG9uU2VsZWN0b3I6ICcubWluaWdhbWUtc3RhcnQgW2hyZWY9XCIvbWluaWdhbWVzL2J1YmJsdGVtcGxlXCJdIC5ubC1idXR0b24nLFxuICBpY29uOiBcIi9zdGF0aWMvaW1nL25ldy1sYXlvdXQvbWluaWdhbWVzL2ljb25fYnViYmxldGVtcGxlLnBuZ1wiLFxufVxuIiwiaW1wb3J0IHR5cGUgeyBNaW5pZ2FtZSB9IGZyb20gXCIuL21pbmlnYW1lXCJcblxuZXhwb3J0IGNvbnN0IGhhdGNobGluZ3M6IE1pbmlnYW1lID0ge1xuICBuYW1lOiBcIkhhdGNobGluZ3NcIixcbiAgc2NvcmVNaW46IDE4LFxuICBzY29yZU1heDogMjAsXG4gIGRlbGF5TWluOiAzMF8wMDAsXG4gIGRlbGF5TWF4OiAzMF8wMDAsXG4gIGJ1dHRvblNlbGVjdG9yOiAnLm1pbmlnYW1lLXN0YXJ0IFtocmVmPVwiL21pbmlnYW1lcy9jb2Nvb25pbnBpY2tcIl0gLm5sLWJ1dHRvbicsXG4gIGljb246IFwiL3N0YXRpYy9pbWcvbmV3LWxheW91dC9taW5pZ2FtZXMvaWNvbl9jb2NvbmlucGljay5wbmdcIixcbn1cbiIsImltcG9ydCB0eXBlIHsgTWluaWdhbWUgfSBmcm9tIFwiLi9taW5pZ2FtZVwiXG5cbmV4cG9ydCBjb25zdCBwZWdnbGU6IE1pbmlnYW1lID0ge1xuICBuYW1lOiBcIlBlZ2dsZVwiLFxuICBzY29yZU1pbjogOSxcbiAgc2NvcmVNYXg6IDEwLFxuICBkZWxheU1pbjogMTBfMDAwLFxuICBkZWxheU1heDogMjBfMDAwLFxuICBidXR0b25TZWxlY3RvcjogJy5taW5pZ2FtZS1zdGFydCBbaHJlZj1cIi9taW5pZ2FtZXMvZ2VtYm9tYlwiXSAubmwtYnV0dG9uJyxcbiAgaWNvbjogXCIvc3RhdGljL2ltZy9uZXctbGF5b3V0L21pbmlnYW1lcy9pY29uX2dlbWJvbWIucG5nXCIsXG59XG4iLCJpbXBvcnQgdHlwZSB7IFBhcnNhYmxlSXRlbSB9IGZyb20gXCIuL2FwcGVhcmFuY2UvaW50ZXJmYWNlcy9wYXJzYWJsZV9pdGVtXCJcbmltcG9ydCB0eXBlIHsgQXZhdGFyIH0gZnJvbSBcIi4vZWxkYXJ5YS9hdmF0YXJcIlxuXG5leHBvcnQgZnVuY3Rpb24gZXhwb3J0T3V0Zml0KHNlbGVjdG9yOiBzdHJpbmcsIG5hbWUgPSBcIm91dGZpdFwiKTogdm9pZCB7XG4gIGNvbnN0IGF2YXRhciA9IFNhY2hhLkF2YXRhci5hdmF0YXJzW3NlbGVjdG9yXVxuICBpZiAoIWF2YXRhcikgcmV0dXJuXG5cbiAgY29uc3Qgb3V0Zml0ID0gcGFyc2VBdmF0YXIoYXZhdGFyKVxuXG4gIGNvbnN0IGhyZWYgPVxuICAgIFwiZGF0YTp0ZXh0L2pzb247Y2hhcnNldD11dGYtOCxcIiArXG4gICAgZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KG91dGZpdCwgdW5kZWZpbmVkLCAyKSlcblxuICBjb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIilcbiAgYS5zZXRBdHRyaWJ1dGUoXCJocmVmXCIsIGhyZWYpXG4gIGEuc2V0QXR0cmlidXRlKFwiZG93bmxvYWRcIiwgYCR7bmFtZX0uanNvbmApXG4gIGEuY2xpY2soKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VBdmF0YXIoYXZhdGFyOiBBdmF0YXIpOiBQYXJzYWJsZUl0ZW1bXSB7XG4gIHJldHVybiBhdmF0YXIuY2hpbGRyZW4ubWFwKGNoaWxkID0+IHtcbiAgICBjb25zdCBpdGVtID0gY2hpbGQuZ2V0SXRlbSgpXG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiBpdGVtLl9pZCxcbiAgICAgIGdyb3VwOiBpdGVtLl9ncm91cCxcbiAgICAgIG5hbWU6IGl0ZW0uX25hbWUsXG4gICAgICBpbWFnZTogaXRlbS5faW1hZ2UsXG4gICAgICB0eXBlOiBpdGVtLl90eXBlLFxuICAgICAgY2F0ZWdvcnlJZDogaXRlbS5fY2F0ZWdvcnlJZCxcbiAgICAgIGhpZGRlbkNhdGVnb3JpZXM6IE9iamVjdC52YWx1ZXMoaXRlbS5faGlkZGVuQ2F0ZWdvcmllcyksXG4gICAgICBhbmltYXRpb25EYXRhOiBpdGVtLl9hbmltYXRpb25EYXRhLFxuICAgICAgbG9ja2VkOiBpdGVtLl9sb2NrZWQsXG4gICAgfVxuICB9KVxufVxuIiwiaW1wb3J0IHR5cGUgeyBUZW1wbGF0ZSB9IGZyb20gXCJob2dhbi5qc1wiXG5pbXBvcnQgeyBDb25zb2xlIH0gZnJvbSBcIi4uL2NvbnNvbGVcIlxuaW1wb3J0IHsgdHJhbnNsYXRlIH0gZnJvbSBcIi4uL2kxOG4vdHJhbnNsYXRlXCJcbmltcG9ydCB7IExvY2FsU3RvcmFnZSB9IGZyb20gXCIuLi9sb2NhbF9zdG9yYWdlL2xvY2FsX3N0b3JhZ2VcIlxuaW1wb3J0IHsgbGlzdGVuVHJlYXN1cmVIdW50IH0gZnJvbSBcIi4vZXhwbG9yYXRpb24td2F0Y2hlclwiXG5cbmV4cG9ydCBmdW5jdGlvbiBsb2FkRXhwbG9yYXRpb25IaXN0b3J5KCk6IHZvaWQge1xuICBsb2FkSGlzdG9yeUJ1dHRvbigpXG4gIGxpc3RlblRyZWFzdXJlSHVudCgpXG59XG5cbmZ1bmN0aW9uIGxvYWRIaXN0b3J5QnV0dG9uKCk6IHZvaWQge1xuICBjb25zdCBoaXN0b3J5QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIilcbiAgaGlzdG9yeUJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwibmwtYnV0dG9uXCIsIFwibmwtYnV0dG9uLWJhY2tcIilcbiAgaGlzdG9yeUJ1dHRvbi5zdHlsZS5tYXJnaW5SaWdodCA9IFwiMC42ZW1cIlxuICBoaXN0b3J5QnV0dG9uLnRleHRDb250ZW50ID0gdHJhbnNsYXRlLnBldC5oaXN0b3J5XG4gIGhpc3RvcnlCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIG9uQ2xpY2tIaXN0b3J5KVxuXG4gIGRvY3VtZW50XG4gICAgLmdldEVsZW1lbnRCeUlkKFwiZWUtYnV0dG9ucy1yb3dcIilcbiAgICA/Lmluc2VydEFkamFjZW50RWxlbWVudChcImJlZm9yZWVuZFwiLCBoaXN0b3J5QnV0dG9uKVxufVxuXG5mdW5jdGlvbiBvbkNsaWNrSGlzdG9yeSgpOiB2b2lkIHtcbiAgaGlkZVBldCgpXG4gIGhpZGVFeHBsb3JhdGlvbigpXG4gIG1ha2VIaXN0b3J5KClcbiAgc2hvd0hpc3RvcnkoKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gb25DbGlja1BldCgpOiB2b2lkIHtcbiAgaGlkZUhpc3RvcnkoKVxuICBzaG93UGV0KClcbn1cblxuZnVuY3Rpb24gaGlkZVBldCgpOiB2b2lkIHtcbiAgY29uc3QgbmFtZUNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmFtZS1jb250YWluZXJcIilcbiAgY29uc3QgaW5mb0NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5mb3MtY29udGFpbmVyXCIpXG4gIGNvbnN0IHBldEltYWdlQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwZXQtaW1hZ2UtY29udGFpbmVyXCIpXG5cbiAgaWYgKCFuYW1lQ29udGFpbmVyIHx8ICFpbmZvQ29udGFpbmVyIHx8ICFwZXRJbWFnZUNvbnRhaW5lcilcbiAgICByZXR1cm4gQ29uc29sZS5lcnJvcihcIlRoZSBwZXQgZGlzcGxheSB3YXMgZGFtYWdlZC5cIiwge1xuICAgICAgbmFtZUNvbnRhaW5lcixcbiAgICAgIGluZm9Db250YWluZXIsXG4gICAgICBwZXRJbWFnZUNvbnRhaW5lcixcbiAgICB9KVxuXG4gIG5hbWVDb250YWluZXIuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiXG4gIGluZm9Db250YWluZXIuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiXG4gIHBldEltYWdlQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIlxufVxuXG5mdW5jdGlvbiBzaG93UGV0KCk6IHZvaWQge1xuICBjb25zdCBuYW1lQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYW1lLWNvbnRhaW5lclwiKVxuICBjb25zdCBpbmZvQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbmZvcy1jb250YWluZXJcIilcbiAgY29uc3QgcGV0SW1hZ2VDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBldC1pbWFnZS1jb250YWluZXJcIilcblxuICBpZiAoIW5hbWVDb250YWluZXIgfHwgIWluZm9Db250YWluZXIgfHwgIXBldEltYWdlQ29udGFpbmVyKVxuICAgIHJldHVybiBDb25zb2xlLmVycm9yKFwiVGhlIHBldCBkaXNwbGF5IHdhcyBkYW1hZ2VkLlwiLCB7XG4gICAgICBuYW1lQ29udGFpbmVyLFxuICAgICAgaW5mb0NvbnRhaW5lcixcbiAgICAgIHBldEltYWdlQ29udGFpbmVyLFxuICAgIH0pXG5cbiAgbmFtZUNvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gXCJcIlxuICBpbmZvQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSBcIlwiXG4gIHBldEltYWdlQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSBcIlwiXG59XG5cbmZ1bmN0aW9uIHNob3dIaXN0b3J5KCk6IHZvaWQge1xuICBjb25zdCBoaXN0b3J5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJoaXN0b3J5LWNvbnRhaW5lclwiKVxuICBpZiAoIWhpc3RvcnkpIHJldHVyblxuICBoaXN0b3J5LnN0eWxlLmRpc3BsYXkgPSBcIlwiXG59XG5cbmZ1bmN0aW9uIGhpZGVIaXN0b3J5KCk6IHZvaWQge1xuICBjb25zdCBoaXN0b3J5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJoaXN0b3J5LWNvbnRhaW5lclwiKVxuICBpZiAoIWhpc3RvcnkpIHJldHVyblxuICBoaXN0b3J5LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIlxufVxuXG5mdW5jdGlvbiBoaWRlRXhwbG9yYXRpb24oKTogdm9pZCB7XG4gIGRvY3VtZW50XG4gICAgLmdldEVsZW1lbnRCeUlkKFwibWFpbi1zZWN0aW9uXCIpXG4gICAgPy5jbGFzc0xpc3QucmVtb3ZlKFwidHJlYXN1cmUtaHVudC1pbnRlcmZhY2Utb3BlblwiKVxufVxuXG5mdW5jdGlvbiBtYWtlSGlzdG9yeSgpOiB2b2lkIHtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJoaXN0b3J5LWNvbnRhaW5lclwiKT8ucmVtb3ZlKClcbiAgY29uc3QgdGVtcGxhdGU6IFRlbXBsYXRlID0gcmVxdWlyZShcIi4uL3RlbXBsYXRlcy9odG1sL2V4cGxvcmF0aW9uX2hpc3RvcnkuaHRtbFwiKVxuXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGVmdC1jb250YWluZXJcIik/Lmluc2VydEFkamFjZW50SFRNTChcbiAgICBcImJlZm9yZWVuZFwiLFxuICAgIHRlbXBsYXRlLnJlbmRlcih7XG4gICAgICB0cmFuc2xhdGUsXG4gICAgICBoaXN0b3J5OiBMb2NhbFN0b3JhZ2UuZXhwbG9yYXRpb25IaXN0b3J5Lm1hcChoaXN0b3J5ID0+ICh7XG4gICAgICAgIC4uLmhpc3RvcnksXG4gICAgICAgIGRhdGU6IHRyYW5zbGF0ZS5wZXQuZGF0ZV90aW1lX2Zvcm1hdC5mb3JtYXQobmV3IERhdGUoaGlzdG9yeS5kYXRlKSksXG4gICAgICAgIHdlYl9oZDogaGlzdG9yeS5pY29uICYmIHRvV2ViSGQoaGlzdG9yeS5pY29uKSxcbiAgICAgIH0pKSxcbiAgICB9KVxuICApXG5cbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZWxldGUtaGlzdG9yeVwiKT8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICBMb2NhbFN0b3JhZ2UuZXhwbG9yYXRpb25IaXN0b3J5ID0gW11cbiAgICBtYWtlSGlzdG9yeSgpXG4gIH0pXG59XG5cbmZ1bmN0aW9uIHRvV2ViSGQoaWNvbjogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIGljb24ucmVwbGFjZShcImljb25cIiwgXCJ3ZWJfaGRcIilcbn1cbiIsImltcG9ydCB7IENvbnNvbGUgfSBmcm9tIFwiLi4vY29uc29sZVwiXG5pbXBvcnQgeyB0cmltSWNvbiB9IGZyb20gXCIuLi9lbGRhcnlhX3V0aWxcIlxuaW1wb3J0IHR5cGUgeyBFeHBsb3JhdGlvblJlc3VsdCB9IGZyb20gXCIuLi9sb2NhbF9zdG9yYWdlL2V4cGxvcmF0aW9uX3Jlc3VsdFwiXG5pbXBvcnQgeyBMb2NhbFN0b3JhZ2UgfSBmcm9tIFwiLi4vbG9jYWxfc3RvcmFnZS9sb2NhbF9zdG9yYWdlXCJcblxuZXhwb3J0IGZ1bmN0aW9uIGxpc3RlblRyZWFzdXJlSHVudCgpOiB2b2lkIHtcbiAgY29uc3QgcmVzdWx0T3ZlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjdHJlYXN1cmUtaHVudC1yZXN1bHQtb3ZlcmxheVwiKVxuICBpZiAoIXJlc3VsdE92ZXJsYXkpXG4gICAgcmV0dXJuIENvbnNvbGUuZXJyb3IoXCJUaGVyZSBpcyBubyByZXN1bHQgb3ZlcmxheS5cIiwgcmVzdWx0T3ZlcmxheSlcblxuICBuZXcgTXV0YXRpb25PYnNlcnZlcigoKSA9PiB7XG4gICAgQ29uc29sZS5sb2coXCJNdXRhdGlvbiBpblwiLCByZXN1bHRPdmVybGF5KVxuICAgIGlmICghcmVzdWx0T3ZlcmxheS5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmVcIikpIHJldHVyblxuXG4gICAgY29uc3QgcmVzdWx0cyA9IGdldFJlc3VsdHMoKVxuICAgIGlmIChyZXN1bHRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuXG4gICAgQ29uc29sZS5sb2coXCJSZXN1bHRzOlwiLCByZXN1bHRzKVxuXG4gICAgTG9jYWxTdG9yYWdlLmV4cGxvcmF0aW9uSGlzdG9yeSA9IFtcbiAgICAgIC4uLnJlc3VsdHMsXG4gICAgICAuLi5Mb2NhbFN0b3JhZ2UuZXhwbG9yYXRpb25IaXN0b3J5LFxuICAgIF1cbiAgfSkub2JzZXJ2ZShyZXN1bHRPdmVybGF5LCB7XG4gICAgYXR0cmlidXRlRmlsdGVyOiBbXCJjbGFzc1wiXSxcbiAgfSlcbn1cblxuZnVuY3Rpb24gZ2V0UmVzdWx0cygpOiBFeHBsb3JhdGlvblJlc3VsdFtdIHtcbiAgY29uc3QgbG9jYXRpb25OYW1lID0gZG9jdW1lbnRcbiAgICAucXVlcnlTZWxlY3RvcihcIiN0aC1hZ2FpbiBzdHJvbmdcIilcbiAgICA/LnRleHRDb250ZW50Py50cmltKClcbiAgY29uc3Qgbm93ID0gbmV3IERhdGUoKVxuXG4gIHJldHVybiBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIudGgtcmVzdWx0XCIpKS5tYXAocmVzdWx0ID0+IHtcbiAgICBjb25zdCBpbWcgPSByZXN1bHQucXVlcnlTZWxlY3RvcjxIVE1MSW1hZ2VFbGVtZW50PihcImltZy50aC1yZXN1bHQtaW1nXCIpXG5cbiAgICByZXR1cm4ge1xuICAgICAgY291bnQ6IHJlc3VsdC5xdWVyeVNlbGVjdG9yKFwiLnJlc291cmNlLWNvdW50XCIpPy50ZXh0Q29udGVudD8udHJpbSgpLFxuICAgICAgZGF0ZTogbm93LFxuICAgICAgaWNvbjogaW1nID8gdHJpbUljb24oaW1nLnNyYykgOiB1bmRlZmluZWQsXG4gICAgICBsb2NhdGlvbk5hbWUsXG4gICAgICBuYW1lOiByZXN1bHQucXVlcnlTZWxlY3RvcihcIi50b29sdGlwLWNvbnRlbnQgaDNcIik/LnRleHRDb250ZW50Py50cmltKCksXG4gICAgICB0cmFkYWJsZTogQm9vbGVhbihyZXN1bHQucXVlcnlTZWxlY3RvcihcIi50cmFkYWJsZVwiKSksXG4gICAgfVxuICB9KVxufVxuIiwiaW1wb3J0IHR5cGUgeyBUZW1wbGF0ZSB9IGZyb20gXCJob2dhbi5qc1wiXG5pbXBvcnQgeyBjaGFuZ2VSZWdpb24gfSBmcm9tIFwiLi4vYWpheC9jaGFuZ2VfcmVnaW9uXCJcbmltcG9ydCB7IFJlc3VsdCB9IGZyb20gXCIuLi9hcGkvcmVzdWx0LmVudW1cIlxuaW1wb3J0IHsgQ29uc29sZSB9IGZyb20gXCIuLi9jb25zb2xlXCJcbmltcG9ydCB0eXBlIHsgTWFwUmVnaW9uIH0gZnJvbSBcIi4uL2VsZGFyeWEvY3VycmVudF9yZWdpb25cIlxuaW1wb3J0IHsgdHJhbnNsYXRlIH0gZnJvbSBcIi4uL2kxOG4vdHJhbnNsYXRlXCJcbmltcG9ydCB0eXBlIHsgQXV0b0V4cGxvcmVMb2NhdGlvbiB9IGZyb20gXCIuLi9sb2NhbF9zdG9yYWdlL2F1dG9fZXhwbG9yZV9sb2NhdGlvblwiXG5pbXBvcnQgeyBMb2NhbFN0b3JhZ2UgfSBmcm9tIFwiLi4vbG9jYWxfc3RvcmFnZS9sb2NhbF9zdG9yYWdlXCJcbmltcG9ydCB0eXBlIHsgQXV0b0V4cGxvcmVCdXR0b24gfSBmcm9tIFwiLi4vdGVtcGxhdGVzL2ludGVyZmFjZXMvYXV0b19leHBsb3JlX2J1dHRvblwiXG5cbmV4cG9ydCBmdW5jdGlvbiBsb2FkTWFya2VycygpOiB2b2lkIHtcbiAgY29uc3QgYXV0b0V4cGxvcmVMb2NhdGlvbnMgPSBMb2NhbFN0b3JhZ2UuYXV0b0V4cGxvcmVMb2NhdGlvbnNcblxuICBmb3IgKGNvbnN0IGRpdiBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxEaXZFbGVtZW50PihcbiAgICBcIi5tYXAtbG9jYXRpb25bZGF0YS1pZF1cIlxuICApKSB7XG4gICAgY29uc3QgbG9jYXRpb25JZCA9IE51bWJlcihkaXYuZ2V0QXR0cmlidXRlKFwiZGF0YS1pZFwiKSlcbiAgICBpZiAoIWxvY2F0aW9uSWQpIGNvbnRpbnVlXG5cbiAgICBsb2FkUGljdG9NYXAoYXV0b0V4cGxvcmVMb2NhdGlvbnMsIGRpdilcblxuICAgIGRpdi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT5cbiAgICAgIG5ldyBNdXRhdGlvbk9ic2VydmVyKFxuICAgICAgICAoXzogTXV0YXRpb25SZWNvcmRbXSwgb2JzZXJ2ZXI6IE11dGF0aW9uT2JzZXJ2ZXIpOiB2b2lkID0+IHtcbiAgICAgICAgICBhZGRBdXRvRXhwbG9yZUJ1dHRvbihsb2NhdGlvbklkLCBvYnNlcnZlcilcbiAgICAgICAgfVxuICAgICAgKS5vYnNlcnZlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFwLWxvY2F0aW9uLXByZXZpZXdcIikgYXMgTm9kZSwge1xuICAgICAgICBhdHRyaWJ1dGVzOiB0cnVlLFxuICAgICAgfSlcbiAgICApXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbG9hZE1hcmtlcnMoKTogdm9pZCB7XG4gIGNvbnN0IGF1dG9FeHBsb3JlTG9jYXRpb25zID0gTG9jYWxTdG9yYWdlLmF1dG9FeHBsb3JlTG9jYXRpb25zXG5cbiAgZm9yIChjb25zdCBkaXYgb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MRGl2RWxlbWVudD4oXG4gICAgXCIubWFwLWxvY2F0aW9uW2RhdGEtaWRdXCJcbiAgKSkge1xuICAgIGNvbnN0IGxvY2F0aW9uSWQgPSBOdW1iZXIoZGl2LmdldEF0dHJpYnV0ZShcImRhdGEtaWRcIikpXG4gICAgaWYgKCFsb2NhdGlvbklkKSBjb250aW51ZVxuXG4gICAgbG9hZFBpY3RvTWFwKGF1dG9FeHBsb3JlTG9jYXRpb25zLCBkaXYpXG4gIH1cbn1cblxuZnVuY3Rpb24gYWRkQXV0b0V4cGxvcmVCdXR0b24oXG4gIGxvY2F0aW9uSWQ6IG51bWJlcixcbiAgb2JzZXJ2ZXI/OiBNdXRhdGlvbk9ic2VydmVyXG4pOiB2b2lkIHtcbiAgY29uc3QgYnV0dG9uc0NvbnRhaW5lciA9XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRGl2RWxlbWVudD4oXCIjYnV0dG9ucy1jb250YWluZXJcIilcbiAgaWYgKCFidXR0b25zQ29udGFpbmVyKSByZXR1cm5cbiAgb2JzZXJ2ZXI/LmRpc2Nvbm5lY3QoKVxuXG4gIC8vIFBhcmFtZXRlcnMgdG8gYmUgaW5qZWN0ZWQgaW50byB0aGUgdGVtcGxhdGVcbiAgY29uc3QgY29udGV4dDogQXV0b0V4cGxvcmVCdXR0b24gPSB7XG4gICAgbG9jYXRpb25JZCxcbiAgICBhY3RpdmU6IExvY2FsU3RvcmFnZS5hdXRvRXhwbG9yZUxvY2F0aW9ucy5zb21lKFxuICAgICAgc2F2ZWQgPT4gc2F2ZWQubG9jYXRpb24uaWQgPT09IGxvY2F0aW9uSWRcbiAgICApLFxuICAgIHJlZ2lvbklkOiBOdW1iZXIoXG4gICAgICBkb2N1bWVudFxuICAgICAgICAucXVlcnlTZWxlY3RvcihcIi5taW5pbWFwLmN1cnJlbnRbZGF0YS1tYXBpZF1cIilcbiAgICAgICAgPy5nZXRBdHRyaWJ1dGUoXCJkYXRhLW1hcGlkXCIpXG4gICAgKSxcbiAgfVxuXG4gIC8vIEFkZCB0aGUgYXV0byBleHBsb3JlIGJ1dHRvblxuICBidXR0b25zQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXCIjYXV0by1leHBsb3JlLWJ1dHRvblwiKT8ucmVtb3ZlKClcbiAgY29uc3QgYXV0b0V4cGxvcmVUZW1wbGF0ZTogVGVtcGxhdGUgPSByZXF1aXJlKFwiLi4vdGVtcGxhdGVzL2h0bWwvYXV0b19leHBsb3JlX2J1dHRvbi5odG1sXCIpXG4gIGJ1dHRvbnNDb250YWluZXIuaW5zZXJ0QWRqYWNlbnRIVE1MKFxuICAgIFwiYmVmb3JlZW5kXCIsXG4gICAgYXV0b0V4cGxvcmVUZW1wbGF0ZS5yZW5kZXIoeyAuLi5jb250ZXh0LCB0cmFuc2xhdGUgfSlcbiAgKVxuXG4gIC8vIEJpbmQgYGF1dG9FeHBsb3JlYCBhbmQgYGxvYWRQaWN0b01hcHNgXG4gIGJ1dHRvbnNDb250YWluZXJcbiAgICAucXVlcnlTZWxlY3RvcjxIVE1MQnV0dG9uRWxlbWVudD4oXCIjYXV0by1leHBsb3JlLWJ1dHRvblwiKVxuICAgID8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgIENvbnNvbGUuZGVidWcoXCJDbGlja2VkIG9uICNhdXRvLWV4cGxvcmUtYnV0dG9uLlwiLCBjb250ZXh0KVxuICAgICAgdm9pZCBtYXJrTG9jYXRpb24oY29udGV4dCkudGhlbihsb2FkUGljdG9NYXBzKVxuICAgIH0pXG5cbiAgdm9pZCBkaXNhYmxlRXhwbG9yZShjb250ZXh0KVxufVxuXG5hc3luYyBmdW5jdGlvbiBkaXNhYmxlRXhwbG9yZShjb250ZXh0OiBBdXRvRXhwbG9yZUJ1dHRvbik6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBlbnRyeSA9IGF3YWl0IGdldEF1dG9FeHBsb3JlRW50cnkoY29udGV4dC5yZWdpb25JZCwgY29udGV4dC5sb2NhdGlvbklkKVxuICBpZiAoIWVudHJ5KSByZXR1cm5cblxuICBpZiAocGV0RW5lcmd5IDwgTnVtYmVyKGVudHJ5LmxvY2F0aW9uLmVuZXJneVJlcXVpcmVkKSlcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImV4cGxvcmUtYnV0dG9uXCIpPy5jbGFzc0xpc3QuYWRkKFwiZGlzYWJsZWRcIilcbn1cblxuYXN5bmMgZnVuY3Rpb24gbWFya0xvY2F0aW9uKGNvbnRleHQ6IEF1dG9FeHBsb3JlQnV0dG9uKTogUHJvbWlzZTx2b2lkPiB7XG4gIGlmIChjb250ZXh0LmFjdGl2ZSkge1xuICAgIGNvbnN0IGZpbHRlcmVkTG9jYXRpb25zID0gTG9jYWxTdG9yYWdlLmF1dG9FeHBsb3JlTG9jYXRpb25zLmZpbHRlcihcbiAgICAgIHNhdmVkID0+IHNhdmVkLmxvY2F0aW9uLmlkICE9PSBjb250ZXh0LmxvY2F0aW9uSWRcbiAgICApXG4gICAgTG9jYWxTdG9yYWdlLmF1dG9FeHBsb3JlTG9jYXRpb25zID0gZmlsdGVyZWRMb2NhdGlvbnNcbiAgICBhZGRBdXRvRXhwbG9yZUJ1dHRvbihjb250ZXh0LmxvY2F0aW9uSWQpXG4gICAgcmV0dXJuXG4gIH1cblxuICBjb25zdCBuZXdBdXRvRXhwbG9yZSA9IGF3YWl0IGdldEF1dG9FeHBsb3JlRW50cnkoXG4gICAgY29udGV4dC5yZWdpb25JZCxcbiAgICBjb250ZXh0LmxvY2F0aW9uSWRcbiAgKVxuICBpZiAoIW5ld0F1dG9FeHBsb3JlKSB7XG4gICAgQ29uc29sZS5lcnJvcihcbiAgICAgIGBDb3VsZCBub3QgZ2VuZXJhdGUgYW4gYXV0byBleHBsb3JlIGVudHJ5IGZvciBsb2NhdGlvbiAjJHtjb250ZXh0LmxvY2F0aW9uSWR9LmAsXG4gICAgICBjb250ZXh0XG4gICAgKVxuICAgIHJldHVyblxuICB9XG5cbiAgY29uc3QgbmV3TG9jYXRpb25zID0gTG9jYWxTdG9yYWdlLmF1dG9FeHBsb3JlTG9jYXRpb25zXG4gIG5ld0xvY2F0aW9ucy5wdXNoKG5ld0F1dG9FeHBsb3JlKVxuICBMb2NhbFN0b3JhZ2UuYXV0b0V4cGxvcmVMb2NhdGlvbnMgPSBuZXdMb2NhdGlvbnNcbiAgYWRkQXV0b0V4cGxvcmVCdXR0b24oY29udGV4dC5sb2NhdGlvbklkKVxufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRBdXRvRXhwbG9yZUVudHJ5KFxuICByZWdpb25JZDogbnVtYmVyLFxuICBsb2NhdGlvbklkOiBudW1iZXJcbik6IFByb21pc2U8QXV0b0V4cGxvcmVMb2NhdGlvbiB8IG51bGw+IHtcbiAgY29uc3QgcmVnaW9uID0gYXdhaXQgZ2V0UmVnaW9uKHJlZ2lvbklkKVxuICBpZiAoIXJlZ2lvbikge1xuICAgIENvbnNvbGUuZXJyb3IoYENvdWxkIG5vdCBnZXQgcmVnaW9uICMke3JlZ2lvbklkfS5gKVxuICAgIHJldHVybiBudWxsXG4gIH1cblxuICBjb25zdCBsb2NhdGlvbiA9IHJlZ2lvbi5sb2NhdGlvbnMuZmluZChsb2NhdGlvbiA9PiBsb2NhdGlvbi5pZCA9PT0gbG9jYXRpb25JZClcbiAgaWYgKCFsb2NhdGlvbikge1xuICAgIENvbnNvbGUuZXJyb3IoXG4gICAgICBgQ291bGQgbm90IGdldCBsb2NhdGlvbiAjJHtsb2NhdGlvbklkfSBpbiAke3JlZ2lvbi5uYW1lfS5gLFxuICAgICAgcmVnaW9uXG4gICAgKVxuICAgIHJldHVybiBudWxsXG4gIH1cblxuICByZXR1cm4ge1xuICAgIGxvY2F0aW9uLFxuICAgIHJlZ2lvbixcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0UmVnaW9uKGlkOiBudW1iZXIpOiBQcm9taXNlPE1hcFJlZ2lvbiB8IG51bGw+IHtcbiAgaWYgKGlkLnRvU3RyaW5nKCkgPT09IGN1cnJlbnRSZWdpb24uaWQpIHJldHVybiBjdXJyZW50UmVnaW9uXG5cbiAgY29uc3QganNvbiA9IGF3YWl0IGNoYW5nZVJlZ2lvbihpZClcbiAgaWYgKGpzb24ucmVzdWx0ID09PSBSZXN1bHQuc3VjY2VzcykgcmV0dXJuIGpzb24uZGF0YS5jdXJyZW50UmVnaW9uXG5cbiAgcmV0dXJuIG51bGxcbn1cblxuZnVuY3Rpb24gbG9hZFBpY3RvTWFwcygpOiB2b2lkIHtcbiAgY29uc3QgYXV0b0V4cGxvcmVMb2NhdGlvbnMgPSBMb2NhbFN0b3JhZ2UuYXV0b0V4cGxvcmVMb2NhdGlvbnNcbiAgZm9yIChjb25zdCBkaXYgb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MRGl2RWxlbWVudD4oXG4gICAgXCIubWFwLWxvY2F0aW9uW2RhdGEtaWRdXCJcbiAgKSkge1xuICAgIGxvYWRQaWN0b01hcChhdXRvRXhwbG9yZUxvY2F0aW9ucywgZGl2KVxuICB9XG59XG5cbmZ1bmN0aW9uIGxvYWRQaWN0b01hcChcbiAgYXV0b0V4cGxvcmVMb2NhdGlvbnM6IEF1dG9FeHBsb3JlTG9jYXRpb25bXSxcbiAgZGl2OiBIVE1MRGl2RWxlbWVudFxuKTogdm9pZCB7XG4gIGNvbnN0IG1hcExvY2F0aW9uID0gZGl2LmdldEF0dHJpYnV0ZShcImRhdGEtaWRcIilcbiAgaWYgKCFtYXBMb2NhdGlvbikgcmV0dXJuXG5cbiAgZGl2LnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGF1dG9FeHBsb3JlTG9jYXRpb25zLnNvbWUoXG4gICAgc2F2ZWQgPT4gc2F2ZWQubG9jYXRpb24uaWQgPT09IE51bWJlcihtYXBMb2NhdGlvbilcbiAgKVxuICAgID8gXCJ1cmwoL3N0YXRpYy9pbWcvbmV3LWxheW91dC9wZXQvaWNvbnMvcGljdG9fbWFwX2V4cGxvLnBuZylcIlxuICAgIDogXCJ1cmwoL3N0YXRpYy9pbWcvbmV3LWxheW91dC9wZXQvaWNvbnMvcGljdG9fbWFwLnBuZylcIlxufVxuIiwiZXhwb3J0IGludGVyZmFjZSBNYXBMb2NhdGlvbkRhdGFzZXQge1xuICBpZDogbnVtYmVyXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRNYXBMb2NhdGlvbkRhdGFzZXQoZGl2OiBIVE1MRGl2RWxlbWVudCk6IE1hcExvY2F0aW9uRGF0YXNldCB7XG4gIGNvbnN0IGRhdGFzZXQgPSBkaXYuZGF0YXNldFxuICByZXR1cm4ge1xuICAgIGlkOiBOdW1iZXIoZGF0YXNldC5pZCksXG4gIH1cbn1cbiIsImltcG9ydCB7IHRyYW5zbGF0ZSB9IGZyb20gXCIuLi9pMThuL3RyYW5zbGF0ZVwiXG5cbmludGVyZmFjZSBNYXJrQ29udGV4dCB7XG4gIHNyYzogc3RyaW5nXG4gIHRleHRDb250ZW50OiBzdHJpbmdcbn1cblxuZXhwb3J0IGNvbnN0IG1hcmtBbGxDb250ZXh0OiBNYXJrQ29udGV4dCA9IHtcbiAgc3JjOiBcImh0dHBzOi8vZ2l0bGFiLmNvbS9OYXRvQm9yYW0vZWxkYXJ5YS1lbmhhbmNlbWVudHMvLS9yYXcvbWFzdGVyL2ltYWdlcy9waWN0b19tYXBfZXhwbG8ucG5nXCIsXG4gIHRleHRDb250ZW50OiB0cmFuc2xhdGUucGV0Lm1hcmtfYWxsLFxufVxuXG5leHBvcnQgY29uc3QgdW5tYXJrQWxsQ29udGV4dDogTWFya0NvbnRleHQgPSB7XG4gIHNyYzogXCJodHRwczovL2dpdGxhYi5jb20vTmF0b0JvcmFtL2VsZGFyeWEtZW5oYW5jZW1lbnRzLy0vcmF3L21hc3Rlci9pbWFnZXMvcGljdG9fbWFwLnBuZ1wiLFxuICB0ZXh0Q29udGVudDogdHJhbnNsYXRlLnBldC51bm1hcmtfYWxsLFxufVxuIiwiaW1wb3J0IHR5cGUgeyBUZW1wbGF0ZSB9IGZyb20gXCJob2dhbi5qc1wiXG5pbXBvcnQgeyBDb25zb2xlIH0gZnJvbSBcIi4uL2NvbnNvbGVcIlxuaW1wb3J0IHR5cGUgeyBNYXBSZWdpb24gfSBmcm9tIFwiLi4vZWxkYXJ5YS9jdXJyZW50X3JlZ2lvblwiXG5pbXBvcnQgeyBMb2NhbFN0b3JhZ2UgfSBmcm9tIFwiLi4vbG9jYWxfc3RvcmFnZS9sb2NhbF9zdG9yYWdlXCJcbmltcG9ydCB7IGdldFJlZ2lvbiwgcmVsb2FkTWFya2VycyB9IGZyb20gXCIuL2V4cGxvcmF0aW9uXCJcbmltcG9ydCB7IGdldE1hcExvY2F0aW9uRGF0YXNldCB9IGZyb20gXCIuL21hcF9sb2NhdGlvbl9kYXRhc2V0XCJcbmltcG9ydCB7IG1hcmtBbGxDb250ZXh0LCB1bm1hcmtBbGxDb250ZXh0IH0gZnJvbSBcIi4vbWFya19jb250ZXh0XCJcbmltcG9ydCB7IGdldE1pbmltYXBEYXRhc2V0IH0gZnJvbSBcIi4vbWluaW1hcF9kYXRhc2V0XCJcblxuZXhwb3J0IGZ1bmN0aW9uIGxvYWRNYXNzTWFyaygpOiB2b2lkIHtcbiAgdm9pZCBzZXR1cE1hc3NNYXJrQnV0dG9uKClcbiAgaGFuZGxlQ2xpY2tNaW5pbWFwcygpXG59XG5cbmFzeW5jIGZ1bmN0aW9uIHNldHVwTWFzc01hcmtCdXR0b24oKTogUHJvbWlzZTx2b2lkPiB7XG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFzcy1tYXJrXCIpPy5yZW1vdmUoKVxuXG4gIGNvbnN0IG1hcmtlZCA9IGhhc1NvbWVNYXJrZWQoKVxuICBjb25zdCB0ZW1wbGF0ZTogVGVtcGxhdGUgPSByZXF1aXJlKFwiLi4vdGVtcGxhdGVzL2h0bWwvbWFzc19tYXJrX2J1dHRvbi5odG1sXCIpXG4gIGNvbnN0IHJlbmRlcmVkID0gdGVtcGxhdGUucmVuZGVyKG1hcmtlZCA/IHVubWFya0FsbENvbnRleHQgOiBtYXJrQWxsQ29udGV4dClcblxuICBkb2N1bWVudFxuICAgIC5nZXRFbGVtZW50QnlJZChcImVlLWJ1dHRvbnMtcm93XCIpXG4gICAgPy5pbnNlcnRBZGphY2VudEhUTUwoXCJiZWZvcmVlbmRcIiwgcmVuZGVyZWQpXG5cbiAgY29uc3QgaWQgPSBnZXRDdXJyZW50UmVnaW9uSWQoKVxuICBpZiAoIWlkKSByZXR1cm5cbiAgY29uc3QgcmVnaW9uID0gYXdhaXQgZ2V0UmVnaW9uKGlkKVxuICBpZiAoIXJlZ2lvbikgcmV0dXJuXG5cbiAgY29uc3QgaW5zZXJ0ZWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1hc3MtbWFya1wiKVxuICBpbnNlcnRlZD8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+XG4gICAgbWFya2VkID8gdm9pZCB1bm1hcmtSZWdpb24ocmVnaW9uKSA6IHZvaWQgbWFya1JlZ2lvbihyZWdpb24pXG4gIClcbn1cblxuZnVuY3Rpb24gaGFuZGxlQ2xpY2tNaW5pbWFwcygpOiB2b2lkIHtcbiAgZm9yIChjb25zdCBtaW5pbWFwIG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTERpdkVsZW1lbnQ+KFwiLm1pbmltYXBcIikpXG4gICAgbWluaW1hcC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gaGFuZGxlQ2xpY2tNaW5pbWFwKG1pbmltYXApKVxufVxuXG4vKiogV2FpdCBmb3IgdGhlIG1pbmltYXAgdG8gY2hhbmdlIHRoZW4gcmVsb2FkIHRoZSBtYXNzIG1hcmsgYnV0dG9uICovXG5mdW5jdGlvbiBoYW5kbGVDbGlja01pbmltYXAoZGl2OiBIVE1MRGl2RWxlbWVudCk6IHZvaWQge1xuICBjb25zdCBkYXRhc2V0ID0gZ2V0TWluaW1hcERhdGFzZXQoZGl2KVxuICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21pbmltYXBzLWNvbnRhaW5lclwiKVxuICBpZiAoIWNvbnRhaW5lcilcbiAgICByZXR1cm4gQ29uc29sZS5lcnJvcihcIkNvdWxkbid0IGdldCAjbWluaW1hcHMtY29udGFpbmVyXCIsIGNvbnRhaW5lcilcblxuICBuZXcgTXV0YXRpb25PYnNlcnZlcigobXV0YXRpb25zLCBvYnNlcnZlcikgPT4ge1xuICAgIGNvbnN0IGZvdW5kID0gbXV0YXRpb25zLmZpbmQoXG4gICAgICBtdXRhdGlvbiA9PlxuICAgICAgICBtdXRhdGlvbi50YXJnZXQgaW5zdGFuY2VvZiBIVE1MRGl2RWxlbWVudCAmJlxuICAgICAgICBtdXRhdGlvbi50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwibWluaW1hcFwiKSAmJlxuICAgICAgICBtdXRhdGlvbi50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiY3VycmVudFwiKSAmJlxuICAgICAgICBnZXRNaW5pbWFwRGF0YXNldChtdXRhdGlvbi50YXJnZXQpLm1hcGlkID09PSBkYXRhc2V0Lm1hcGlkXG4gICAgKVxuXG4gICAgaWYgKGZvdW5kKSB7XG4gICAgICBvYnNlcnZlci5kaXNjb25uZWN0KClcbiAgICAgIHZvaWQgc2V0dXBNYXNzTWFya0J1dHRvbigpXG4gICAgfVxuICB9KS5vYnNlcnZlKGNvbnRhaW5lciwge1xuICAgIGF0dHJpYnV0ZXM6IHRydWUsXG4gICAgc3VidHJlZTogdHJ1ZSxcbiAgfSlcbn1cblxuZnVuY3Rpb24gaGFzU29tZU1hcmtlZCgpOiBib29sZWFuIHtcbiAgY29uc3QgYXV0b0V4cGxvcmVMb2NhdGlvbnMgPSBMb2NhbFN0b3JhZ2UuYXV0b0V4cGxvcmVMb2NhdGlvbnNcblxuICByZXR1cm4gQXJyYXkuZnJvbShcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxEaXZFbGVtZW50PihcbiAgICAgIFwiI21hcC1sb2NhdGlvbnMtY29udGFpbmVyIC5tYXAtbG9jYXRpb25cIlxuICAgIClcbiAgKS5zb21lKGxvY2F0aW9uID0+IHtcbiAgICBjb25zdCBkYXRhc2V0ID0gZ2V0TWFwTG9jYXRpb25EYXRhc2V0KGxvY2F0aW9uKVxuXG4gICAgcmV0dXJuIGF1dG9FeHBsb3JlTG9jYXRpb25zLnNvbWUoXG4gICAgICBhdXRvTG9jYXRpb24gPT4gZGF0YXNldC5pZCA9PT0gYXV0b0xvY2F0aW9uLmxvY2F0aW9uLmlkXG4gICAgKVxuICB9KVxufVxuXG5hc3luYyBmdW5jdGlvbiBtYXJrUmVnaW9uKHJlZ2lvbjogTWFwUmVnaW9uKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IGF1dG9FeHBsb3JlTG9jYXRpb25zID0gTG9jYWxTdG9yYWdlLmF1dG9FeHBsb3JlTG9jYXRpb25zXG4gIGF1dG9FeHBsb3JlTG9jYXRpb25zLnB1c2goXG4gICAgLi4ucmVnaW9uLmxvY2F0aW9uc1xuICAgICAgLmZpbHRlcihcbiAgICAgICAgbmV3TG9jYXRpb24gPT5cbiAgICAgICAgICAhYXV0b0V4cGxvcmVMb2NhdGlvbnMuZmluZChcbiAgICAgICAgICAgIGF1dG9Mb2NhdGlvbiA9PiBhdXRvTG9jYXRpb24ubG9jYXRpb24uaWQgPT09IG5ld0xvY2F0aW9uLmlkXG4gICAgICAgICAgKVxuICAgICAgKVxuICAgICAgLm1hcChuZXdMb2NhdGlvbiA9PiAoeyBsb2NhdGlvbjogbmV3TG9jYXRpb24sIHJlZ2lvbjogcmVnaW9uIH0pKVxuICApXG5cbiAgTG9jYWxTdG9yYWdlLmF1dG9FeHBsb3JlTG9jYXRpb25zID0gYXV0b0V4cGxvcmVMb2NhdGlvbnNcbiAgYXdhaXQgc2V0dXBNYXNzTWFya0J1dHRvbigpXG4gIHJlbG9hZE1hcmtlcnMoKVxufVxuXG5hc3luYyBmdW5jdGlvbiB1bm1hcmtSZWdpb24ocmVnaW9uOiBNYXBSZWdpb24pOiBQcm9taXNlPHZvaWQ+IHtcbiAgTG9jYWxTdG9yYWdlLmF1dG9FeHBsb3JlTG9jYXRpb25zID0gTG9jYWxTdG9yYWdlLmF1dG9FeHBsb3JlTG9jYXRpb25zLmZpbHRlcihcbiAgICBhdXRvTG9jYXRpb24gPT5cbiAgICAgICFyZWdpb24ubG9jYXRpb25zLmZpbmQoXG4gICAgICAgIGxvY2F0aW9uID0+IGxvY2F0aW9uLmlkID09PSBhdXRvTG9jYXRpb24ubG9jYXRpb24uaWRcbiAgICAgIClcbiAgKVxuXG4gIGF3YWl0IHNldHVwTWFzc01hcmtCdXR0b24oKVxuICByZWxvYWRNYXJrZXJzKClcbn1cblxuZnVuY3Rpb24gZ2V0Q3VycmVudFJlZ2lvbklkKCk6IG51bWJlciB8IG51bGwge1xuICBjb25zdCBkaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxEaXZFbGVtZW50PihcIi5taW5pbWFwLmN1cnJlbnRcIilcbiAgaWYgKCFkaXYpIHJldHVybiBOdW1iZXIoY3VycmVudFJlZ2lvbi5pZClcbiAgcmV0dXJuIE51bWJlcihnZXRNaW5pbWFwRGF0YXNldChkaXYpLm1hcGlkKVxufVxuIiwiZXhwb3J0IGludGVyZmFjZSBNaW5pbWFwRGF0YXNldCB7XG4gIG1hcGlkOiBudW1iZXJcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE1pbmltYXBEYXRhc2V0KGRpdjogSFRNTERpdkVsZW1lbnQpOiBNaW5pbWFwRGF0YXNldCB7XG4gIHJldHVybiB7XG4gICAgbWFwaWQ6IE51bWJlcihkaXYuZGF0YXNldC5tYXBpZCksXG4gIH1cbn1cbiIsImV4cG9ydCBlbnVtIFNlc3Npb25TdG9yYWdlS2V5IHtcbiAgYWN0aW9uID0gXCJhY3Rpb25cIixcbiAgZXhwbG9yYXRpb25zRG9uZSA9IFwiZXhwbG9yYXRpb25zRG9uZVwiLFxuICBtaW5pZ2FtZXNEb25lID0gXCJtaW5pZ2FtZXNEb25lXCIsXG4gIHNlbGVjdGVkTG9jYXRpb24gPSBcInNlbGVjdGVkTG9jYXRpb25cIixcbiAgdGFrZW92ZXIgPSBcInRha2VvdmVyXCIsXG4gIHdpc2hsaXN0ID0gXCJ3aXNobGlzdFwiLFxuICBzdW1tZXJHYW1lRG9uZSA9IFwic3VtbWVyR2FtZURvbmVcIixcbn1cbiIsImltcG9ydCB0eXBlIHsgQXV0b0V4cGxvcmVMb2NhdGlvbiB9IGZyb20gXCIuLi9sb2NhbF9zdG9yYWdlL2F1dG9fZXhwbG9yZV9sb2NhdGlvblwiXG5pbXBvcnQgdHlwZSB7IFdpc2hlZEl0ZW0gfSBmcm9tIFwiLi4vbG9jYWxfc3RvcmFnZS93aXNoZWRfaXRlbVwiXG5pbXBvcnQgeyBTZXNzaW9uU3RvcmFnZUtleSB9IGZyb20gXCIuL3Nlc3Npb25fc3RvcmFnZS5lbnVtXCJcbmltcG9ydCB0eXBlIHsgVGFrZW92ZXJBY3Rpb24gfSBmcm9tIFwiLi90YWtlb3Zlcl9hY3Rpb24uZW51bVwiXG5cbmV4cG9ydCBjbGFzcyBTZXNzaW9uU3RvcmFnZSB7XG4gIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IHNlc3Npb25TdG9yYWdlID0gc2Vzc2lvblN0b3JhZ2VcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKCkge31cblxuICBzdGF0aWMgZ2V0IGFjdGlvbigpOiBUYWtlb3ZlckFjdGlvbiB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLmdldEl0ZW0oU2Vzc2lvblN0b3JhZ2VLZXkuYWN0aW9uLCBudWxsKVxuICB9XG5cbiAgc3RhdGljIHNldCBhY3Rpb24oYWN0aW9uOiBUYWtlb3ZlckFjdGlvbiB8IG51bGwpIHtcbiAgICB0aGlzLnNldEl0ZW0oU2Vzc2lvblN0b3JhZ2VLZXkuYWN0aW9uLCBhY3Rpb24pXG4gIH1cblxuICBzdGF0aWMgZ2V0IGV4cGxvcmF0aW9uc0RvbmUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0SXRlbShTZXNzaW9uU3RvcmFnZUtleS5leHBsb3JhdGlvbnNEb25lLCBmYWxzZSlcbiAgfVxuXG4gIHN0YXRpYyBzZXQgZXhwbG9yYXRpb25zRG9uZShkb25lOiBib29sZWFuKSB7XG4gICAgdGhpcy5zZXRJdGVtKFNlc3Npb25TdG9yYWdlS2V5LmV4cGxvcmF0aW9uc0RvbmUsIGRvbmUpXG4gIH1cblxuICBzdGF0aWMgZ2V0IG1pbmlnYW1lc0RvbmUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0SXRlbShTZXNzaW9uU3RvcmFnZUtleS5taW5pZ2FtZXNEb25lLCBmYWxzZSlcbiAgfVxuXG4gIHN0YXRpYyBzZXQgbWluaWdhbWVzRG9uZShkb25lOiBib29sZWFuKSB7XG4gICAgdGhpcy5zZXRJdGVtKFNlc3Npb25TdG9yYWdlS2V5Lm1pbmlnYW1lc0RvbmUsIGRvbmUpXG4gIH1cblxuICBzdGF0aWMgZ2V0IHN1bW1lckdhbWVEb25lKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmdldEl0ZW0oU2Vzc2lvblN0b3JhZ2VLZXkuc3VtbWVyR2FtZURvbmUsIGZhbHNlKVxuICB9XG5cbiAgc3RhdGljIHNldCBzdW1tZXJHYW1lRG9uZShkb25lOiBib29sZWFuKSB7XG4gICAgdGhpcy5zZXRJdGVtKFNlc3Npb25TdG9yYWdlS2V5LnN1bW1lckdhbWVEb25lLCBkb25lKVxuICB9XG5cbiAgc3RhdGljIGdldCBzZWxlY3RlZExvY2F0aW9uKCk6IEF1dG9FeHBsb3JlTG9jYXRpb24gfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5nZXRJdGVtKFNlc3Npb25TdG9yYWdlS2V5LnNlbGVjdGVkTG9jYXRpb24sIG51bGwpXG4gIH1cblxuICBzdGF0aWMgc2V0IHNlbGVjdGVkTG9jYXRpb24oc2VsZWN0ZWQ6IEF1dG9FeHBsb3JlTG9jYXRpb24gfCBudWxsKSB7XG4gICAgdGhpcy5zZXRJdGVtKFNlc3Npb25TdG9yYWdlS2V5LnNlbGVjdGVkTG9jYXRpb24sIHNlbGVjdGVkKVxuICB9XG5cbiAgc3RhdGljIGdldCB0YWtlb3ZlcigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5nZXRJdGVtKFNlc3Npb25TdG9yYWdlS2V5LnRha2VvdmVyLCBmYWxzZSlcbiAgfVxuXG4gIHN0YXRpYyBzZXQgdGFrZW92ZXIoZW5hYmxlZDogYm9vbGVhbikge1xuICAgIHRoaXMuc2V0SXRlbShTZXNzaW9uU3RvcmFnZUtleS50YWtlb3ZlciwgZW5hYmxlZClcbiAgfVxuXG4gIHN0YXRpYyBnZXQgd2lzaGxpc3QoKTogV2lzaGVkSXRlbVtdIHtcbiAgICByZXR1cm4gdGhpcy5nZXRJdGVtKFNlc3Npb25TdG9yYWdlS2V5Lndpc2hsaXN0LCBbXSlcbiAgfVxuXG4gIHN0YXRpYyBzZXQgd2lzaGxpc3Qod2lzaGxpc3Q6IFdpc2hlZEl0ZW1bXSkge1xuICAgIHRoaXMuc2V0SXRlbShTZXNzaW9uU3RvcmFnZUtleS53aXNobGlzdCwgd2lzaGxpc3QpXG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBnZXRJdGVtPFQ+KGtleTogU2Vzc2lvblN0b3JhZ2VLZXksIGZhbGxiYWNrOiBUKTogVCB7XG4gICAgcmV0dXJuIChKU09OLnBhcnNlKFxuICAgICAgdGhpcy5zZXNzaW9uU3RvcmFnZS5nZXRJdGVtKGtleSkgPz8gSlNPTi5zdHJpbmdpZnkoZmFsbGJhY2spXG4gICAgKSA/PyBmYWxsYmFjaykgYXMgVFxuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgc2V0SXRlbTxUPihrZXk6IFNlc3Npb25TdG9yYWdlS2V5LCB2YWx1ZTogVCk6IHZvaWQge1xuICAgIHRoaXMuc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KHZhbHVlKSlcbiAgfVxufVxuIiwiZXhwb3J0IGVudW0gVGFrZW92ZXJBY3Rpb24ge1xuICBkYWlseSA9IFwiZGFpbHlcIixcbiAgbWluaWdhbWVzID0gXCJtaW5pZ2FtZXNcIixcbiAgZXhwbG9yYXRpb25zID0gXCJleHBsb3JhdGlvbnNcIixcbiAgYXVjdGlvbnMgPSBcImF1Y3Rpb25zXCIsXG4gIGJ1eSA9IFwiYnV5XCIsXG4gIC8vIHNlbGwsXG4gIHN1bW1lckdhbWUgPSBcInN1bW1lckdhbWVcIixcbiAgd2FpdCA9IFwid2FpdFwiLFxufVxuIiwiaW1wb3J0IHsgQ29uc29sZSB9IGZyb20gXCIuLi9jb25zb2xlXCJcbmltcG9ydCB7IHRyYW5zbGF0ZSB9IGZyb20gXCIuLi9pMThuL3RyYW5zbGF0ZVwiXG5pbXBvcnQgeyBMb2NhbFN0b3JhZ2UgfSBmcm9tIFwiLi4vbG9jYWxfc3RvcmFnZS9sb2NhbF9zdG9yYWdlXCJcbmltcG9ydCB7IFNlc3Npb25TdG9yYWdlIH0gZnJvbSBcIi4uL3Nlc3Npb25fc3RvcmFnZS9zZXNzaW9uX3N0b3JhZ2VcIlxuaW1wb3J0IHR5cGUgeyBUYWtlb3ZlckFjdGlvbiB9IGZyb20gXCIuLi9zZXNzaW9uX3N0b3JhZ2UvdGFrZW92ZXJfYWN0aW9uLmVudW1cIlxuaW1wb3J0IHsgbG9hZFRvcEJhciB9IGZyb20gXCIuLi91aS90b3BfYmFyXCJcbmltcG9ydCB0eXBlIHsgQWN0aW9uIH0gZnJvbSBcIi4vY2xhc3Nlcy9hY3Rpb25cIlxuaW1wb3J0IGJ1eUFjdGlvbiBmcm9tIFwiLi9jbGFzc2VzL2J1eV9hY3Rpb25cIlxuaW1wb3J0IGRhaWx5QWN0aW9uIGZyb20gXCIuL2NsYXNzZXMvZGFpbHlfYWN0aW9uXCJcbmltcG9ydCBleHBsb3JhdGlvbkFjdGlvbiBmcm9tIFwiLi9jbGFzc2VzL2V4cGxvcmF0aW9uX2FjdGlvblwiXG5pbXBvcnQgbWluaWdhbWVBY3Rpb24gZnJvbSBcIi4vY2xhc3Nlcy9taW5pZ2FtZV9hY3Rpb25cIlxuaW1wb3J0IHdhaXRBY3Rpb24gZnJvbSBcIi4vY2xhc3Nlcy93YWl0X2FjdGlvblwiXG5cbi8qKiBBdXRvbWF0ZWQgZW50cnkgcG9pbnQgb2YgdGhlIHRha2VvdmVyLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxvYWRUYWtlb3ZlcigpOiB2b2lkIHtcbiAgaWYgKFNlc3Npb25TdG9yYWdlLnRha2VvdmVyICYmIExvY2FsU3RvcmFnZS51bmxvY2tlZCkgdm9pZCB0YWtlb3ZlcigpXG59XG5cbi8qKiBNYW51YWwgZW50cnkgcG9pbnQgb2YgdGhlIHRha2VvdmVyLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRvZ2dsZVRha2VvdmVyKCk6IHZvaWQge1xuICByZXNldFRha2VvdmVyKClcbiAgU2Vzc2lvblN0b3JhZ2UudGFrZW92ZXIgPSAhU2Vzc2lvblN0b3JhZ2UudGFrZW92ZXJcblxuICBpZiAoIUxvY2FsU3RvcmFnZS51bmxvY2tlZCkge1xuICAgIFNlc3Npb25TdG9yYWdlLnRha2VvdmVyID0gZmFsc2VcbiAgICByZXR1cm5cbiAgfVxuXG4gIGxvYWRUb3BCYXIoKVxuICBpZiAoU2Vzc2lvblN0b3JhZ2UudGFrZW92ZXIpICQuZmxhdnJOb3RpZih0cmFuc2xhdGUudGFrZW92ZXIuZW5hYmxlZClcbiAgZWxzZSAkLmZsYXZyTm90aWYodHJhbnNsYXRlLnRha2VvdmVyLmRpc2FibGVkKVxuXG4gIHZvaWQgdGFrZW92ZXIoKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVzZXRUYWtlb3ZlcigpOiB2b2lkIHtcbiAgU2Vzc2lvblN0b3JhZ2UuYWN0aW9uID0gbnVsbFxuICBTZXNzaW9uU3RvcmFnZS5leHBsb3JhdGlvbnNEb25lID0gZmFsc2VcbiAgU2Vzc2lvblN0b3JhZ2UubWluaWdhbWVzRG9uZSA9IGZhbHNlXG4gIFNlc3Npb25TdG9yYWdlLnNlbGVjdGVkTG9jYXRpb24gPSBudWxsXG4gIFNlc3Npb25TdG9yYWdlLnN1bW1lckdhbWVEb25lID0gZmFsc2VcbiAgU2Vzc2lvblN0b3JhZ2Uud2lzaGxpc3QgPSBbXVxufVxuXG5hc3luYyBmdW5jdGlvbiB0YWtlb3ZlcigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgaWYgKCFTZXNzaW9uU3RvcmFnZS50YWtlb3ZlcikgcmV0dXJuXG4gIGlmIChkYWlseUFjdGlvbi5jb25kaXRpb24oKSkgYXdhaXQgZGFpbHlBY3Rpb24ucGVyZm9ybSgpXG5cbiAgY29uc3QgYWN0aW9uID0gYWN0aW9ucy5maW5kKGFjdGlvbiA9PiBhY3Rpb24ua2V5ID09PSBTZXNzaW9uU3RvcmFnZS5hY3Rpb24pXG4gIGlmIChhY3Rpb24/LmNvbmRpdGlvbigpKSB7XG4gICAgQ29uc29sZS5pbmZvKFwiQWN0aW9uOlwiLCBhY3Rpb24ua2V5KVxuXG4gICAgaWYgKGF3YWl0IGFjdGlvbi5wZXJmb3JtKCkpIHJldHVyblxuICB9XG5cbiAgY2hhbmdlQWN0aW9uKClcbiAgdm9pZCB0YWtlb3ZlcigpXG59XG5cbmNvbnN0IGFjdGlvbnM6IEFjdGlvbltdID0gW1xuICBleHBsb3JhdGlvbkFjdGlvbixcbiAgYnV5QWN0aW9uLFxuICBtaW5pZ2FtZUFjdGlvbixcbiAgd2FpdEFjdGlvbixcbl1cblxuZnVuY3Rpb24gY2hhbmdlQWN0aW9uKCk6IFRha2VvdmVyQWN0aW9uIHtcbiAgY29uc3QgbmV4dCA9XG4gICAgYWN0aW9ucy5maW5kSW5kZXgoYWN0aW9uID0+IGFjdGlvbi5rZXkgPT09IFNlc3Npb25TdG9yYWdlLmFjdGlvbikgKyAxXG5cbiAgcmV0dXJuIChTZXNzaW9uU3RvcmFnZS5hY3Rpb24gPVxuICAgIGFjdGlvbnNbbmV4dCA+PSBhY3Rpb25zLmxlbmd0aCA/IDAgOiBuZXh0XSEua2V5KVxufVxuIiwiaW1wb3J0IHR5cGUgeyBUYWtlb3ZlckFjdGlvbiB9IGZyb20gXCIuLi8uLi9zZXNzaW9uX3N0b3JhZ2UvdGFrZW92ZXJfYWN0aW9uLmVudW1cIlxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQWN0aW9uIHtcbiAgLyoqIEtleSBieSB3aGljaCB0aGUgYFNlc3Npb25TdG9yYWdlYCBjYW4gcmVmZXJlbmNlIHRoaXMgYWN0aW9uLiAqL1xuICBhYnN0cmFjdCByZWFkb25seSBrZXk6IFRha2VvdmVyQWN0aW9uXG5cbiAgLyoqIERldGVybWluZXMgaWYgdGhpcyBhY3Rpb24gY2FuIGJlIHBlcmZvcm1lZCBkdXJpbmcgYSB0YWtlb3Zlci4gKi9cbiAgYWJzdHJhY3QgY29uZGl0aW9uKCk6IGJvb2xlYW5cblxuICAvKipcbiAgICogUGVyZm9ybXMgdGhlIGFjdGlvbiBhbmQgcmV0dXJucyBgdHJ1ZWAgaWYgaXQgaGFzIHNvbWV0aGluZyBlbHNlIHRvIGRvIG9yXG4gICAqIGBmYWxzZWAgaWYgdGhpcyBhY3Rpb24gaXMgZmluaXNoZWQgZXhlY3V0aW5nLlxuICAgKi9cbiAgYWJzdHJhY3QgcGVyZm9ybSgpOiBQcm9taXNlPGJvb2xlYW4+XG59XG4iLCJpbXBvcnQgdHlwZSB7IFRlbXBsYXRlIH0gZnJvbSBcImhvZ2FuLmpzXCJcbmltcG9ydCB7IGFqYXhTZWFyY2ggfSBmcm9tIFwiLi4vLi4vYWpheC9hamF4X3NlYXJjaFwiXG5pbXBvcnQgeyBidXkgfSBmcm9tIFwiLi4vLi4vYWpheC9idXlcIlxuaW1wb3J0IHsgQ29uc29sZSB9IGZyb20gXCIuLi8uLi9jb25zb2xlXCJcbmltcG9ydCB7IHRyYW5zbGF0ZSB9IGZyb20gXCIuLi8uLi9pMThuL3RyYW5zbGF0ZVwiXG5pbXBvcnQgeyBMb2NhbFN0b3JhZ2UgfSBmcm9tIFwiLi4vLi4vbG9jYWxfc3RvcmFnZS9sb2NhbF9zdG9yYWdlXCJcbmltcG9ydCB0eXBlIHsgV2lzaGVkSXRlbSB9IGZyb20gXCIuLi8uLi9sb2NhbF9zdG9yYWdlL3dpc2hlZF9pdGVtXCJcbmltcG9ydCB0eXBlIHsgTWFya2V0RW50cnkgfSBmcm9tIFwiLi4vLi4vbWFya2V0cGxhY2UvaW50ZXJmYWNlcy9tYXJrZXRfZW50cnlcIlxuaW1wb3J0IHsgZ2V0SXRlbURldGFpbHMgfSBmcm9tIFwiLi4vLi4vbWFya2V0cGxhY2UvbWFya2V0cGxhY2VfaGFuZGxlcnNcIlxuaW1wb3J0IHsgVGFrZW92ZXJBY3Rpb24gfSBmcm9tIFwiLi4vLi4vc2Vzc2lvbl9zdG9yYWdlL3Rha2VvdmVyX2FjdGlvbi5lbnVtXCJcbmltcG9ydCB7IEFjdGlvbiB9IGZyb20gXCIuL2FjdGlvblwiXG5cbmNsYXNzIEJ1eUFjdGlvbiBleHRlbmRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IGtleSA9IFRha2VvdmVyQWN0aW9uLmJ1eVxuXG4gIHByaXZhdGUgZ2V0IGN1cnJlbnRNYWFuYSgpOiBudW1iZXIge1xuICAgIHJldHVybiBOdW1iZXIoXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxBbmNob3JFbGVtZW50PihcIiNjdXJyZW5jeS1tYWFuYVwiKT8uZGF0YXNldFxuICAgICAgICAubWFhbmFcbiAgICApXG4gIH1cblxuICBjb25kaXRpb24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIExvY2FsU3RvcmFnZS5tYXJrZXQgJiYgQm9vbGVhbihMb2NhbFN0b3JhZ2Uud2lzaGxpc3QubGVuZ3RoKVxuICB9XG5cbiAgYXN5bmMgcGVyZm9ybSgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBpZiAobG9jYXRpb24ucGF0aG5hbWUgIT09IFwiL21hcmtldHBsYWNlXCIpIHtcbiAgICAgIHBhZ2VMb2FkKFwiL21hcmtldHBsYWNlXCIpXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIGNvbnN0IGljb25NZXNzYWdlOiBUZW1wbGF0ZSA9IHJlcXVpcmUoXCIuLi8uLi90ZW1wbGF0ZXMvaHRtbC9mbGF2cl9ub3RpZi9pY29uX21lc3NhZ2UuaHRtbFwiKVxuICAgIGZvciAoY29uc3Qgd2lzaGVkIG9mIExvY2FsU3RvcmFnZS53aXNobGlzdCkge1xuICAgICAgLy8gQ2xvdGhlcyBtaWdodCBiZSBhIHNwZWNpYWwgZXhjZXB0aW9uLiBJZiB0aGV5IGFyZSwgdGhlbiBjaGVjayBmb3JcbiAgICAgIC8vIGB3aXNoZWQudHlwZSA9PT0gVHlwZS5QbGF5ZXJXZWFyYWJsZUl0ZW1gLlxuICAgICAgaWYgKHdpc2hlZC5lcnJvcikge1xuICAgICAgICBDb25zb2xlLndhcm4oYFNraXBwZWQgXCIke3dpc2hlZC5uYW1lfVwiYCwgd2lzaGVkKVxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuICAgICAgQ29uc29sZS5pbmZvKGBTZWFyY2hpbmcgZm9yIFwiJHt3aXNoZWQubmFtZX1cImAsIHdpc2hlZClcblxuICAgICAgLyoqIFNlYXJjaCBpbiBlYWNoIHBhZ2VzIHVudGlsIHRoZSBhbW91bnQgb2YgaXRlbXMgaXMgbGVzcyB0aGFuIDggKi9cbiAgICAgIGxldCBhbW91bnQgPSA4XG4gICAgICBmb3JwYWdlOiBmb3IgKGxldCBwYWdlID0gMTsgYW1vdW50ID09PSA4OyBwYWdlKyspIHtcbiAgICAgICAgbGV0IHJlc3VsdHM6IE1hcmtldEVudHJ5W10gPSBbXVxuICAgICAgICB0cnkge1xuICAgICAgICAgIHJlc3VsdHMgPSBhd2FpdCB0aGlzLnNlYXJjaCh3aXNoZWQsIHBhZ2UpXG4gICAgICAgIH0gY2F0Y2ggKGU6IHVua25vd24pIHtcbiAgICAgICAgICBjb25zdCBlcnJvciA9IGUgYXMgSlF1ZXJ5WEhSXG4gICAgICAgICAgQ29uc29sZS5lcnJvcihgRmFpbGVkIHRvIHNlYXJjaCBmb3IgXCIke3dpc2hlZC5uYW1lfVwiYCwgZXJyb3IpXG4gICAgICAgICAgdGhpcy5zZXRFcnJvcih3aXNoZWQuaWNvbiwgYCR7ZXJyb3Iuc3RhdHVzVGV4dH1gKVxuICAgICAgICAgIGJyZWFrIGZvcnBhZ2VcbiAgICAgICAgfVxuXG4gICAgICAgIGFtb3VudCA9IHJlc3VsdHMubGVuZ3RoXG4gICAgICAgIENvbnNvbGUubG9nKGBGb3VuZCAke2Ftb3VudH0gcmVzdWx0c2AsIHJlc3VsdHMpXG5cbiAgICAgICAgY29uc3Qgd2FudGVkID0gcmVzdWx0cy5maWx0ZXIoXG4gICAgICAgICAgcmVzdWx0ID0+XG4gICAgICAgICAgICByZXN1bHQuaWNvbiA9PT0gd2lzaGVkLmljb24gJiZcbiAgICAgICAgICAgIHJlc3VsdC5idXlOb3dQcmljZSAmJlxuICAgICAgICAgICAgTnVtYmVyKHJlc3VsdC5idXlOb3dQcmljZS5wcmljZSkgPD0gd2lzaGVkLnByaWNlICYmXG4gICAgICAgICAgICBOdW1iZXIocmVzdWx0LmJ1eU5vd1ByaWNlLnByaWNlKSA8PSB0aGlzLmN1cnJlbnRNYWFuYVxuICAgICAgICApXG4gICAgICAgIGZvciAoY29uc3QgcmVzdWx0IG9mIHdhbnRlZCkge1xuICAgICAgICAgIGlmICghKGF3YWl0IHRoaXMuYnV5KHJlc3VsdCkpKSBicmVhayBmb3JwYWdlXG5cbiAgICAgICAgICBMb2NhbFN0b3JhZ2UucHVyY2hhc2VzID0gW1xuICAgICAgICAgICAgcmVzdWx0LFxuICAgICAgICAgICAgLi4uTG9jYWxTdG9yYWdlLnB1cmNoYXNlcy5maWx0ZXIoXG4gICAgICAgICAgICAgIHB1cmNoYXNlID0+IHB1cmNoYXNlLml0ZW1pZCAhPT0gcmVzdWx0Lml0ZW1pZFxuICAgICAgICAgICAgKSxcbiAgICAgICAgICBdXG5cbiAgICAgICAgICBDb25zb2xlLmluZm8oXG4gICAgICAgICAgICBgQm91Z2h0IFwiJHtyZXN1bHQubmFtZX1cIiBmb3IgJHtOdW1iZXIoXG4gICAgICAgICAgICAgIHJlc3VsdC5idXlOb3dQcmljZT8ucHJpY2VcbiAgICAgICAgICAgICl9IG1hYW5hcy5gLFxuICAgICAgICAgICAgcmVzdWx0XG4gICAgICAgICAgKVxuXG4gICAgICAgICAgJC5mbGF2ck5vdGlmKFxuICAgICAgICAgICAgaWNvbk1lc3NhZ2UucmVuZGVyKHtcbiAgICAgICAgICAgICAgLi4ucmVzdWx0LFxuICAgICAgICAgICAgICBtZXNzYWdlOiB0cmFuc2xhdGUudGFrZW92ZXIuYm91Z2h0KFxuICAgICAgICAgICAgICAgIHJlc3VsdC5uYW1lLFxuICAgICAgICAgICAgICAgIE51bWJlcihyZXN1bHQuYnV5Tm93UHJpY2U/LnByaWNlKVxuICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIC8qKlxuICAgKiBQdXJjaGFzZSBhbiBpdGVtIGZyb20gdGhlIG1hcmtldC5cbiAgICogQHJldHVybnMgd2hldGhlciB0aGUgaXRlbSB3YXMgc3VjY2Vzc2Z1bGx5IHB1cmNoYXNlZC5cbiAgICovXG4gIHByaXZhdGUgYXN5bmMgYnV5KHJlc3VsdDogTWFya2V0RW50cnkpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBqc29uID0gYXdhaXQgYnV5KE51bWJlcihyZXN1bHQuaXRlbWlkKSlcbiAgICBDb25zb2xlLmVycm9yKGBGYWlsZWQgdG8gYnV5IFwiJHtyZXN1bHQubmFtZX1cImAsIHJlc3VsdCwganNvbilcbiAgICBpZiAoanNvbi5yZXN1bHQgIT09IFwic3VjY2Vzc1wiKSB0aGlzLnNldEVycm9yKHJlc3VsdC5pY29uLCBqc29uLmRhdGEpXG4gICAgcmV0dXJuIGpzb24ucmVzdWx0ID09PSBcInN1Y2Nlc3NcIlxuICB9XG5cbiAgLyoqIFNlYXJjaCBmb3IgYSB3aXNoZWQgaXRlbSBvbiBhIHNwZWNpZmljIHBhZ2UgdXNpbmcgdGhlIGl0ZW0ncyBuYW1lLiAqL1xuICBwcml2YXRlIGFzeW5jIHNlYXJjaCh3aXNoZWQ6IFdpc2hlZEl0ZW0sIHBhZ2UgPSAxKTogUHJvbWlzZTxNYXJrZXRFbnRyeVtdPiB7XG4gICAgLy8gUHV0IHRoZSBuYW1lIG9mIHRoZSBpdGVtIGluIHRoZSBmaWx0ZXJcbiAgICBjb25zdCBmaWx0ZXJJdGVtTmFtZSA9XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxJbnB1dEVsZW1lbnQ+KFwiI2ZpbHRlci1pdGVtTmFtZVwiKVxuICAgIGlmIChmaWx0ZXJJdGVtTmFtZSkgZmlsdGVySXRlbU5hbWUudmFsdWUgPSB3aXNoZWQubmFtZVxuXG4gICAgLy8gU2hvdyB0aGUgcmVzdWx0cyBvZiB0aGUgc2VhcmNoXG4gICAgY29uc3QgbWFya2V0cGxhY2VTZWFyY2hJdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICBcIi5tYXJrZXRwbGFjZS1zZWFyY2gtaXRlbXNcIlxuICAgIClcbiAgICBpZiAoIW1hcmtldHBsYWNlU2VhcmNoSXRlbXMpIHJldHVybiBbXVxuICAgIG1hcmtldHBsYWNlU2VhcmNoSXRlbXMuaW5uZXJIVE1MID0gYXdhaXQgYWpheFNlYXJjaCh7XG4gICAgICBuYW1lOiB3aXNoZWQubmFtZSxcbiAgICAgIHBhZ2UsXG4gICAgfSlcblxuICAgIHJldHVybiBBcnJheS5mcm9tKFxuICAgICAgbWFya2V0cGxhY2VTZWFyY2hJdGVtcy5xdWVyeVNlbGVjdG9yQWxsPEhUTUxMSUVsZW1lbnQ+KFxuICAgICAgICBcIi5tYXJrZXRwbGFjZS1zZWFyY2gtaXRlbVwiXG4gICAgICApXG4gICAgKVxuICAgICAgLm1hcChnZXRJdGVtRGV0YWlscylcbiAgICAgIC5maWx0ZXI8TWFya2V0RW50cnk+KChpdGVtKTogaXRlbSBpcyBNYXJrZXRFbnRyeSA9PiBpdGVtICE9PSBudWxsKVxuICB9XG5cbiAgLyoqIFNldCB0aGUgYFdpc2hlZEl0ZW0uZXJyb3JgIHByb3BlcnR5IHdpdGhvdXQgcmVvcmRlcmluZyB0aGUgd2lzaGxpc3QuICovXG4gIHByaXZhdGUgc2V0RXJyb3IoaWNvbjogc3RyaW5nLCBlcnJvcjogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3Qgd2lzaGxpc3QgPSBMb2NhbFN0b3JhZ2Uud2lzaGxpc3RcbiAgICBjb25zdCBpbmRleCA9IHdpc2hsaXN0LmZpbmRJbmRleChpdGVtID0+IGl0ZW0uaWNvbiA9PT0gaWNvbilcbiAgICBjb25zdCBlbnRyeSA9IHdpc2hsaXN0W2luZGV4XVxuICAgIGlmICghZW50cnkpIHJldHVyblxuXG4gICAgZW50cnkuZXJyb3IgPSBlcnJvclxuICAgIExvY2FsU3RvcmFnZS53aXNobGlzdCA9IFtcbiAgICAgIC4uLndpc2hsaXN0LnNsaWNlKHVuZGVmaW5lZCwgaW5kZXgpLFxuICAgICAgZW50cnksXG4gICAgICAuLi53aXNobGlzdC5zbGljZShpbmRleCArIDEsIHVuZGVmaW5lZCksXG4gICAgXVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBCdXlBY3Rpb24oKVxuIiwiaW1wb3J0IHsgVGFrZW92ZXJBY3Rpb24gfSBmcm9tIFwiLi4vLi4vc2Vzc2lvbl9zdG9yYWdlL3Rha2VvdmVyX2FjdGlvbi5lbnVtXCJcbmltcG9ydCB7IHJlc2V0VGFrZW92ZXIgfSBmcm9tIFwiLi4vYnJhaW5cIlxuaW1wb3J0IHsgY2xpY2sgfSBmcm9tIFwiLi4vY2xpY2tcIlxuaW1wb3J0IHR5cGUgeyBBY3Rpb24gfSBmcm9tIFwiLi9hY3Rpb25cIlxuXG5jbGFzcyBEYWlseUFjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IGtleSA9IFRha2VvdmVyQWN0aW9uLmRhaWx5XG5cbiAgLyoqIENoZWNrcyBpZiB0aGUgZGFpbHkgbWFhbmEgZ2lmdCBpZiB0aGVyZS4gKi9cbiAgY29uZGl0aW9uKCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGRhaWx5R2lmdENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGFpbHktZ2lmdC1jb250YWluZXJcIilcbiAgICByZXR1cm4gKFxuICAgICAgISFkYWlseUdpZnRDb250YWluZXIgJiZcbiAgICAgIGdldENvbXB1dGVkU3R5bGUoZGFpbHlHaWZ0Q29udGFpbmVyKS5kaXNwbGF5ICE9PSBcIm5vbmVcIlxuICAgIClcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGljayBvbiB0aGUgZGFpbHkgbWFhbmEgZ2lmdC5cbiAgICogQHJldHVybnMgYGZhbHNlYC4gVGhpcyBhY3Rpb24gZG9lcyBub3QgcGVyZm9ybSBtZWFuaW5nZnVsIGFjdGlvbnMgb24gdGhlXG4gICAqIHBhZ2UuXG4gICAqL1xuICBhc3luYyBwZXJmb3JtKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IGRhaWx5R2lmdENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGFpbHktZ2lmdC1jb250YWluZXJcIilcbiAgICBpZiAoXG4gICAgICAhZGFpbHlHaWZ0Q29udGFpbmVyIHx8XG4gICAgICBnZXRDb21wdXRlZFN0eWxlKGRhaWx5R2lmdENvbnRhaW5lcikuZGlzcGxheSA9PT0gXCJub25lXCJcbiAgICApIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIGRhaWx5R2lmdENvbnRhaW5lci5jbGljaygpXG4gICAgYXdhaXQgY2xpY2s8SFRNTEJ1dHRvbkVsZW1lbnQ+KFwiLmZpcnN0LWNvbm5leGlvbiAuZmxhdnItYnV0dG9uLmRlZmF1bHRcIilcblxuICAgIHJlc2V0VGFrZW92ZXIoKVxuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBEYWlseUFjdGlvbigpXG4iLCJpbXBvcnQgdHlwZSB7IFRlbXBsYXRlIH0gZnJvbSBcImhvZ2FuLmpzXCJcbmltcG9ydCB7IGNhcHR1cmVFbmQgfSBmcm9tIFwiLi4vLi4vYWpheC9jYXB0dXJlX2VuZFwiXG5pbXBvcnQgeyBjaGFuZ2VSZWdpb24gfSBmcm9tIFwiLi4vLi4vYWpheC9jaGFuZ2VfcmVnaW9uXCJcbmltcG9ydCB7IGV4cGxvcmF0aW9uUmVzdWx0cyB9IGZyb20gXCIuLi8uLi9hamF4L2V4cGxvcmF0aW9uX3Jlc3VsdHNcIlxuaW1wb3J0IHsgUmVzdWx0IH0gZnJvbSBcIi4uLy4uL2FwaS9yZXN1bHQuZW51bVwiXG5pbXBvcnQgeyBDb25zb2xlIH0gZnJvbSBcIi4uLy4uL2NvbnNvbGVcIlxuaW1wb3J0IHsgRHVyYXRpb25Vbml0IH0gZnJvbSBcIi4uLy4uL2R1cmF0aW9uXCJcbmltcG9ydCB0eXBlIHsgTWFwUmVnaW9uLCBTZWFzb24gfSBmcm9tIFwiLi4vLi4vZWxkYXJ5YS9jdXJyZW50X3JlZ2lvblwiXG5pbXBvcnQgdHlwZSB7IFBlbmRpbmdUcmVhc3VyZUh1bnRMb2NhdGlvbiB9IGZyb20gXCIuLi8uLi9lbGRhcnlhL3RyZWFzdXJlXCJcbmltcG9ydCB7IHRyYW5zbGF0ZSB9IGZyb20gXCIuLi8uLi9pMThuL3RyYW5zbGF0ZVwiXG5pbXBvcnQgdHlwZSB7IEF1dG9FeHBsb3JlTG9jYXRpb24gfSBmcm9tIFwiLi4vLi4vbG9jYWxfc3RvcmFnZS9hdXRvX2V4cGxvcmVfbG9jYXRpb25cIlxuaW1wb3J0IHsgTG9jYWxTdG9yYWdlIH0gZnJvbSBcIi4uLy4uL2xvY2FsX3N0b3JhZ2UvbG9jYWxfc3RvcmFnZVwiXG5pbXBvcnQgeyBTZXNzaW9uU3RvcmFnZSB9IGZyb20gXCIuLi8uLi9zZXNzaW9uX3N0b3JhZ2Uvc2Vzc2lvbl9zdG9yYWdlXCJcbmltcG9ydCB7IFRha2VvdmVyQWN0aW9uIH0gZnJvbSBcIi4uLy4uL3Nlc3Npb25fc3RvcmFnZS90YWtlb3Zlcl9hY3Rpb24uZW51bVwiXG5pbXBvcnQgeyBjbGljaywgY2xpY2tFbGVtZW50LCB3YWl0T2JzZXJ2ZSB9IGZyb20gXCIuLi9jbGlja1wiXG5pbXBvcnQgeyBFeHBsb3JhdGlvblN0YXR1cyB9IGZyb20gXCIuLi9leHBsb3JhdGlvbl9zdGF0dXMuZW51bVwiXG5pbXBvcnQgdHlwZSB7IFN0YXJ0RXhwbG9yYXRpb24gfSBmcm9tIFwiLi4vc3RhcnRfZXhwbG9yYXRpb25cIlxuaW1wb3J0IHsgQWN0aW9uIH0gZnJvbSBcIi4vYWN0aW9uXCJcblxuY2xhc3MgRXhwbG9yYXRpb25BY3Rpb24gZXh0ZW5kcyBBY3Rpb24ge1xuICByZWFkb25seSBrZXkgPSBUYWtlb3ZlckFjdGlvbi5leHBsb3JhdGlvbnNcblxuICBwcml2YXRlIGdldCBnbG9iYWxzKCk6IHtcbiAgICBjdXJyZW50UmVnaW9uOiBNYXBSZWdpb25cbiAgICBwZW5kaW5nVHJlYXN1cmVIdW50TG9jYXRpb246IFBlbmRpbmdUcmVhc3VyZUh1bnRMb2NhdGlvbiB8IG51bGxcbiAgICB0aW1lTGVmdEV4cGxvcmF0aW9uOiBudW1iZXIgfCBudWxsXG4gIH0ge1xuICAgIHJldHVybiB7IGN1cnJlbnRSZWdpb24sIHBlbmRpbmdUcmVhc3VyZUh1bnRMb2NhdGlvbiwgdGltZUxlZnRFeHBsb3JhdGlvbiB9XG4gIH1cblxuICBjb25kaXRpb24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIChcbiAgICAgIExvY2FsU3RvcmFnZS5leHBsb3JhdGlvbnMgJiZcbiAgICAgICFTZXNzaW9uU3RvcmFnZS5leHBsb3JhdGlvbnNEb25lICYmXG4gICAgICAhIUxvY2FsU3RvcmFnZS5hdXRvRXhwbG9yZUxvY2F0aW9ucy5sZW5ndGhcbiAgICApXG4gIH1cblxuICBhc3luYyBwZXJmb3JtKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGlmIChsb2NhdGlvbi5wYXRobmFtZSAhPT0gXCIvcGV0XCIpIHtcbiAgICAgIHBhZ2VMb2FkKFwiL3BldFwiKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBhd2FpdCB0aGlzLm9wZW5DdXJyZW50UmVnaW9uKClcbiAgICBjb25zdCBzdGF0dXMgPSB0aGlzLmdldEV4cGxvcmF0aW9uU3RhdHVzKClcbiAgICBDb25zb2xlLmxvZyhcIkV4cGxvcmF0aW9uIHN0YXR1czpcIiwgRXhwbG9yYXRpb25TdGF0dXNbc3RhdHVzXSlcbiAgICBzd2l0Y2ggKHN0YXR1cykge1xuICAgICAgY2FzZSBFeHBsb3JhdGlvblN0YXR1cy5pZGxlOlxuICAgICAgICBpZiAoIShhd2FpdCB0aGlzLnN0YXJ0RXhwbG9yYXRpb24oKSkuc2VsZWN0ZWQpXG4gICAgICAgICAgU2Vzc2lvblN0b3JhZ2UuZXhwbG9yYXRpb25zRG9uZSA9IHRydWVcbiAgICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgICAgIGNhc2UgRXhwbG9yYXRpb25TdGF0dXMucGVuZGluZzpcbiAgICAgICAgcmV0dXJuIChhd2FpdCB0aGlzLndhaXRFeHBsb3JhdGlvbigpKSAmJiB0aGlzLnBlcmZvcm0oKVxuXG4gICAgICBjYXNlIEV4cGxvcmF0aW9uU3RhdHVzLnJlc3VsdDpcbiAgICAgICAgYXdhaXQgdGhpcy5lbmRFeHBsb3JhdGlvbigpXG4gICAgICAgIHJldHVybiB0aGlzLnBlcmZvcm0oKVxuXG4gICAgICBjYXNlIEV4cGxvcmF0aW9uU3RhdHVzLmNhcHR1cmU6XG4gICAgICAgIGF3YWl0IHRoaXMuZW5kQ2FwdHVyZSgpXG4gICAgICAgIHJldHVybiB0aGlzLnBlcmZvcm0oKVxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIG9wZW5DdXJyZW50UmVnaW9uKCk6IFByb21pc2U8SFRNTERpdkVsZW1lbnQgfCBudWxsPiB7XG4gICAgaWYgKCFwZW5kaW5nVHJlYXN1cmVIdW50TG9jYXRpb24pIHJldHVybiBudWxsXG4gICAgcmV0dXJuIGNsaWNrPEhUTUxEaXZFbGVtZW50PihcbiAgICAgIGAubWluaW1hcFtkYXRhLW1hcGlkPVwiJHtwZW5kaW5nVHJlYXN1cmVIdW50TG9jYXRpb24uTWFwUmVnaW9uX2lkfVwiXWBcbiAgICApXG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGNsaWNrRXhwbG9yZSgpOiBQcm9taXNlPEhUTUxCdXR0b25FbGVtZW50PiB7XG4gICAgcmV0dXJuIGNsaWNrKFwiI2V4cGxvcmUtYnV0dG9uXCIpXG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGNsaWNrTG9jYXRpb24oXG4gICAgc2VsZWN0ZWQ6IEF1dG9FeHBsb3JlTG9jYXRpb25cbiAgKTogUHJvbWlzZTxIVE1MRGl2RWxlbWVudD4ge1xuICAgIHJldHVybiBjbGljazxIVE1MRGl2RWxlbWVudD4oXG4gICAgICBgLm1hcC1sb2NhdGlvbltkYXRhLWlkPVwiJHtzZWxlY3RlZC5sb2NhdGlvbi5pZH1cIl1gXG4gICAgKVxuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBjbGlja1JlZ2lvbihcbiAgICBzZWxlY3RlZDogQXV0b0V4cGxvcmVMb2NhdGlvblxuICApOiBQcm9taXNlPEhUTUxEaXZFbGVtZW50IHwgbnVsbD4ge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWluaW1hcHMtY29udGFpbmVyXCIpXG4gICAgaWYgKCFjb250YWluZXIpIHtcbiAgICAgIENvbnNvbGUubG9nKFwiQ291bGRuJ3QgZmluZCAjbWluaW1hcHMtY29udGFpbmVyOlwiLCBjb250YWluZXIpXG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cblxuICAgIGNvbnN0IGRpdiA9IGF3YWl0IHdhaXRPYnNlcnZlPEhUTUxEaXZFbGVtZW50PihcbiAgICAgIGNvbnRhaW5lcixcbiAgICAgIGAubWluaW1hcFtkYXRhLW1hcGlkPVwiJHtzZWxlY3RlZC5yZWdpb24uaWR9XCJdYFxuICAgIClcbiAgICBpZiAoIWRpdikge1xuICAgICAgLy8gQ2xlYXJpbmcgaW52YWxpZCByZWdpb25zIGlzIHVzZWZ1bCB0byByZW1vdmUgZmluaXNoZWQgZXZlbnRzLlxuICAgICAgY29uc3QgdGVtcGxhdGU6IFRlbXBsYXRlID0gcmVxdWlyZShcIi4uLy4uL3RlbXBsYXRlcy9odG1sL2ZsYXZyX25vdGlmL2ljb25fbWVzc2FnZS5odG1sXCIpXG4gICAgICAkLmZsYXZyTm90aWYoXG4gICAgICAgIHRlbXBsYXRlLnJlbmRlcih7XG4gICAgICAgICAgaWNvbjogXCIvc3RhdGljL2ltZy9uZXctbGF5b3V0L3BldC9pY29ucy9waWN0b19tYXAucG5nXCIsXG4gICAgICAgICAgbWVzc2FnZTogdHJhbnNsYXRlLnBldC5kZWxldGluZ19tYXJrZXJzLFxuICAgICAgICB9KVxuICAgICAgKVxuXG4gICAgICBMb2NhbFN0b3JhZ2UuYXV0b0V4cGxvcmVMb2NhdGlvbnMgPVxuICAgICAgICBMb2NhbFN0b3JhZ2UuYXV0b0V4cGxvcmVMb2NhdGlvbnMuZmlsdGVyKFxuICAgICAgICAgIHNhdmVkID0+IHNhdmVkLnJlZ2lvbi5pZCAhPT0gc2VsZWN0ZWQucmVnaW9uLmlkXG4gICAgICAgIClcblxuICAgICAgQ29uc29sZS53YXJuKFwiQ291bGQgbm90IGZpbmQgcmVnaW9uXCIsIHNlbGVjdGVkLnJlZ2lvbilcbiAgICAgIHBhZ2VMb2FkKFwiL3BldFwiKVxuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG5cbiAgICBDb25zb2xlLmRlYnVnKFwiQ2xpY2tpbmcgb24gcmVnaW9uXCIsIGRpdilcbiAgICBhd2FpdCBjbGlja0VsZW1lbnQoZGl2KVxuICAgIHJldHVybiBkaXZcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgY2xpY2tTZWFzb24oKTogUHJvbWlzZTxIVE1MSW1hZ2VFbGVtZW50PiB7XG4gICAgcmV0dXJuIGNsaWNrPEhUTUxJbWFnZUVsZW1lbnQ+KFwiI2NyeXN0YWwtaW1hZ2VzLWNvbnRhaW5lclwiKVxuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBlbmRDYXB0dXJlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRyeSB7XG4gICAgICB2b2lkIG5ldyBBdWRpbyhcbiAgICAgICAgXCIvc3RhdGljL2V2ZW50LzIwMjEvbXVzaWMvc291bmRzL21pc3Npb24tY29tcGxldGUubXAzXCJcbiAgICAgICkucGxheSgpXG4gICAgfSBjYXRjaCAoZTogdW5rbm93bikge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWVtcHR5XG4gICAgfVxuXG4gICAgYXdhaXQgY2xpY2s8SFRNTEJ1dHRvbkVsZW1lbnQ+KFwiI29wZW4tY2FwdHVyZS1pbnRlcmZhY2VcIilcbiAgICBhd2FpdCBjbGljazxIVE1MQnV0dG9uRWxlbWVudD4oXCIjY2FwdHVyZS1idXR0b25cIilcbiAgICBhd2FpdCBjbGljazxIVE1MQnV0dG9uRWxlbWVudD4oXCIjY2xvc2UtcmVzdWx0XCIpXG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGVuZEV4cGxvcmF0aW9uKCk6IFByb21pc2U8SFRNTERpdkVsZW1lbnQ+IHtcbiAgICByZXR1cm4gY2xpY2soXCIjY2xvc2UtcmVzdWx0XCIpXG4gIH1cblxuICBwcml2YXRlIGdldEN1cnJlbnRTZWFzb24oKTogU2Vhc29uIHwgbnVsbCB7XG4gICAgY29uc3Qgc2Vhc29uID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keVwiKT8uY2xhc3NMaXN0ID8/IFtdKVxuICAgICAgLmZpbmQoYyA9PiBjLnN0YXJ0c1dpdGgoXCJzZWFzb24tXCIpKVxuICAgICAgPy5yZXBsYWNlKFwic2Vhc29uLVwiLCBcIlwiKVxuXG4gICAgaWYgKHRoaXMuaXNTZWFzb24oc2Vhc29uKSkgcmV0dXJuIHNlYXNvblxuICAgIGVsc2UgcmV0dXJuIG51bGxcbiAgfVxuXG4gIHByaXZhdGUgaXNTZWFzb24oc2Vhc29uOiB1bmtub3duKTogc2Vhc29uIGlzIFNlYXNvbiB7XG4gICAgcmV0dXJuIFtcInMxXCIsIFwiczJcIl0uc29tZShzID0+IHMgPT09IHNlYXNvbilcbiAgfVxuXG4gIHByaXZhdGUgZ2V0RXhwbG9yYXRpb25TdGF0dXMoKTogRXhwbG9yYXRpb25TdGF0dXMge1xuICAgIGlmIChcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIFwiI3RyZWFzdXJlLWh1bnQtcmVzdWx0LW92ZXJsYXkuYWN0aXZlICNvcGVuLWNhcHR1cmUtaW50ZXJmYWNlXCJcbiAgICAgICkgfHxcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY2FwdHVyZS1pbnRlcmZhY2Utb3V0ZXIuYWN0aXZlXCIpXG4gICAgKSB7XG4gICAgICByZXR1cm4gRXhwbG9yYXRpb25TdGF0dXMuY2FwdHVyZVxuICAgIH0gZWxzZSBpZiAoXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3BlbmRpbmctbWFwLWxvY2F0aW9uLWRhdGEtb3V0ZXIuYWN0aXZlXCIpIHx8XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21hcC1jb250YWluZXIucGVuZGluZ1wiKVxuICAgICkge1xuICAgICAgcmV0dXJuIEV4cGxvcmF0aW9uU3RhdHVzLnBlbmRpbmdcbiAgICB9IGVsc2UgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjdHJlYXN1cmUtaHVudC1yZXN1bHQtb3ZlcmxheS5hY3RpdmVcIikpXG4gICAgICByZXR1cm4gRXhwbG9yYXRpb25TdGF0dXMucmVzdWx0XG4gICAgcmV0dXJuIEV4cGxvcmF0aW9uU3RhdHVzLmlkbGVcbiAgfVxuXG4gIHByaXZhdGUgZ2V0TG93ZXN0RW5lcmd5TG9jYXRpb24oKTogQXV0b0V4cGxvcmVMb2NhdGlvbiB7XG4gICAgcmV0dXJuIExvY2FsU3RvcmFnZS5hdXRvRXhwbG9yZUxvY2F0aW9ucy5yZWR1Y2UoKGxvd2VzdCwgcGxhY2UpID0+XG4gICAgICBOdW1iZXIocGxhY2UubG9jYXRpb24uZW5lcmd5UmVxdWlyZWQpIDxcbiAgICAgIE51bWJlcihsb3dlc3QubG9jYXRpb24uZW5lcmd5UmVxdWlyZWQpXG4gICAgICAgID8gcGxhY2VcbiAgICAgICAgOiBsb3dlc3RcbiAgICApXG4gIH1cblxuICBwcml2YXRlIGdldFNlbGVjdGVkTG9jYXRpb24oKTogQXV0b0V4cGxvcmVMb2NhdGlvbiB8IG51bGwge1xuICAgIGxldCBzZWxlY3RlZCA9IFNlc3Npb25TdG9yYWdlLnNlbGVjdGVkTG9jYXRpb25cbiAgICBpZiAoIXNlbGVjdGVkKSB7XG4gICAgICBzZWxlY3RlZCA9IHRoaXMuc2VsZWN0TG9jYXRpb24oKVxuICAgICAgU2Vzc2lvblN0b3JhZ2Uuc2VsZWN0ZWRMb2NhdGlvbiA9IHNlbGVjdGVkXG4gICAgfVxuXG4gICAgcmV0dXJuIHNlbGVjdGVkXG4gIH1cblxuICBwcml2YXRlIHNlbGVjdExvY2F0aW9uKCk6IEF1dG9FeHBsb3JlTG9jYXRpb24gfCBudWxsIHtcbiAgICBjb25zdCBhZmZvcmRhYmxlID0gTG9jYWxTdG9yYWdlLmF1dG9FeHBsb3JlTG9jYXRpb25zLmZpbHRlcihcbiAgICAgIHNhdmVkID0+IE51bWJlcihzYXZlZC5sb2NhdGlvbi5lbmVyZ3lSZXF1aXJlZCkgPD0gcGV0RW5lcmd5XG4gICAgKVxuXG4gICAgY29uc3QgbWluaW11bUVuZXJneSA9IHRoaXMuZ2V0TG93ZXN0RW5lcmd5TG9jYXRpb24oKVxuICAgIGNvbnN0IG5vdERlYWRFbmQgPSBhZmZvcmRhYmxlLmZpbHRlcihcbiAgICAgIHBsYWNlID0+XG4gICAgICAgIHBldEVuZXJneSAtIE51bWJlcihwbGFjZS5sb2NhdGlvbi5lbmVyZ3lSZXF1aXJlZCkgPj1cbiAgICAgICAgTnVtYmVyKG1pbmltdW1FbmVyZ3kubG9jYXRpb24uZW5lcmd5UmVxdWlyZWQpXG4gICAgKVxuICAgIGlmIChub3REZWFkRW5kLmxlbmd0aClcbiAgICAgIHJldHVybiBub3REZWFkRW5kW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG5vdERlYWRFbmQubGVuZ3RoKV0gPz8gbnVsbFxuXG4gICAgY29uc3Qgc2FtZUVuZXJneSA9IGFmZm9yZGFibGUuZmlsdGVyKFxuICAgICAgcGxhY2UgPT4gTnVtYmVyKHBsYWNlLmxvY2F0aW9uLmVuZXJneVJlcXVpcmVkKSA9PT0gcGV0RW5lcmd5XG4gICAgKVxuICAgIGlmIChzYW1lRW5lcmd5Lmxlbmd0aClcbiAgICAgIHJldHVybiBzYW1lRW5lcmd5W01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHNhbWVFbmVyZ3kubGVuZ3RoKV0gPz8gbnVsbFxuXG4gICAgcmV0dXJuIGFmZm9yZGFibGVbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogYWZmb3JkYWJsZS5sZW5ndGgpXSA/PyBudWxsXG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHN0YXJ0RXhwbG9yYXRpb24oKTogUHJvbWlzZTxTdGFydEV4cGxvcmF0aW9uPiB7XG4gICAgY29uc3Qgc2VsZWN0ZWQgPSB0aGlzLmdldFNlbGVjdGVkTG9jYXRpb24oKVxuICAgIGlmICghc2VsZWN0ZWQpIHJldHVybiB7IGV4cGxvcmluZzogZmFsc2UsIHNlbGVjdGVkIH1cbiAgICBDb25zb2xlLmluZm8oXCJFeHBsb3JpbmdcIiwgc2VsZWN0ZWQpXG5cbiAgICAvLyBHbyB0byBzZWFzb25cbiAgICBpZiAoXG4gICAgICBzZWxlY3RlZC5yZWdpb24uc2Vhc29uICYmXG4gICAgICB0aGlzLmdldEN1cnJlbnRTZWFzb24oKSAhPT0gc2VsZWN0ZWQucmVnaW9uLnNlYXNvblxuICAgICkge1xuICAgICAgYXdhaXQgdGhpcy5jbGlja1NlYXNvbigpXG4gICAgICByZXR1cm4geyBleHBsb3Jpbmc6IGZhbHNlLCBzZWxlY3RlZCB9XG4gICAgfVxuXG4gICAgLy8gR28gdG8gcmVnaW9uXG4gICAgYXdhaXQgdGhpcy5jbGlja1JlZ2lvbihzZWxlY3RlZClcblxuICAgIC8vIEdvIHRvIGxvY2F0aW9uXG4gICAgYXdhaXQgdGhpcy5jbGlja0xvY2F0aW9uKHNlbGVjdGVkKVxuICAgIGF3YWl0IHRoaXMuY2xpY2tFeHBsb3JlKClcblxuICAgIFNlc3Npb25TdG9yYWdlLnNlbGVjdGVkTG9jYXRpb24gPSBudWxsXG4gICAgcmV0dXJuIHsgZXhwbG9yaW5nOiB0cnVlLCBzZWxlY3RlZCB9XG4gIH1cblxuICAvKipcbiAgICogV2FpdCBmb3IgdXAgdG8gMTAgbWludXRlcy5cbiAgICogQHJldHVybnMgd2hldGhlciB0aGUgZXhwbG9yYXRpb24gaXMgZmluaXNoZWQuXG4gICAqL1xuICBwcml2YXRlIGFzeW5jIHdhaXRFeHBsb3JhdGlvbihcbiAgICBzZWxlY3RlZD86IEF1dG9FeHBsb3JlTG9jYXRpb25cbiAgKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgZG9jdW1lbnRcbiAgICAgIC5xdWVyeVNlbGVjdG9yPEhUTUxEaXZFbGVtZW50PihcbiAgICAgICAgYC5taW5pbWFwW2RhdGEtbWFwaWQ9XCIke3NlbGVjdGVkPy5yZWdpb24uaWQgPz8gY3VycmVudFJlZ2lvbi5pZH1cIl1gXG4gICAgICApXG4gICAgICA/LmNsaWNrKClcblxuICAgIGxldCBtcyA9IDMgKiBEdXJhdGlvblVuaXQuc2Vjb25kXG4gICAgaWYgKHNlbGVjdGVkKSBtcyArPSBzZWxlY3RlZC5sb2NhdGlvbi50aW1lVG9FeHBsb3JlICogRHVyYXRpb25Vbml0Lm1pbnV0ZVxuICAgIGVsc2UgaWYgKHRpbWVMZWZ0RXhwbG9yYXRpb24gJiYgdGltZUxlZnRFeHBsb3JhdGlvbiA+IDApXG4gICAgICBtcyArPSB0aW1lTGVmdEV4cGxvcmF0aW9uICogRHVyYXRpb25Vbml0LnNlY29uZFxuICAgIGVsc2UgaWYgKFxuICAgICAgIXBlbmRpbmdUcmVhc3VyZUh1bnRMb2NhdGlvbiAmJlxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtYXAtY29udGFpbmVyLnBlbmRpbmdcIilcbiAgICApIHtcbiAgICAgIGNvbnN0IGpzb24gPSBhd2FpdCBleHBsb3JhdGlvblJlc3VsdHMoKVxuICAgICAgaWYgKGpzb24ucmVzdWx0ICE9PSBSZXN1bHQuc3VjY2VzcykgcmV0dXJuIGZhbHNlXG5cbiAgICAgIGNvbnN0IGNhcHR1cmUgPSBqc29uLmRhdGEucmVzdWx0cy5maW5kKFxuICAgICAgICByZXN1bHQgPT4gcmVzdWx0LnR5cGUgPT09IFwiY2FwdHVyZVwiXG4gICAgICApXG4gICAgICBpZiAoIWNhcHR1cmUpIHJldHVybiBmYWxzZVxuICAgICAgYXdhaXQgY2FwdHVyZUVuZCgpXG5cbiAgICAgIC8vIFJlbG9hZGluZyBpcyB0aGUgb25seSBwb3NzaWJsZSBhY3Rpb24gaWYgdGhlIGV4cGxvcmF0aW9uIGZpbmlzaGVkIGluIGFcbiAgICAgIC8vIGRpZmZlcmVudCByZWdpb24uXG4gICAgICBDb25zb2xlLmVycm9yKFxuICAgICAgICBcIlJlbG9hZGluZyBiZWNhdXNlIHRoZSBleHBsb3JhdGlvbiBpcyBpbiBhbm90aGVyIHJlZ2lvbi5cIixcbiAgICAgICAgdGhpcy5nbG9iYWxzXG4gICAgICApXG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgRHVyYXRpb25Vbml0Lm1pbnV0ZSkpXG4gICAgICBwYWdlTG9hZChcIi9wZXRcIilcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgaWYgKG1zID4gMTAgKiBEdXJhdGlvblVuaXQubWludXRlKSByZXR1cm4gZmFsc2VcblxuICAgIENvbnNvbGUubG9nKFxuICAgICAgYFdhaXRpbmcgZm9yIHRoZSBleHBsb3JhdGlvbiB0byBlbmQgaW4gJHtNYXRoLmNlaWwoXG4gICAgICAgIG1zIC8gRHVyYXRpb25Vbml0LnNlY29uZFxuICAgICAgKX0gc2Vjb25kcy4uLmAsXG4gICAgICB0aGlzLmdsb2JhbHNcbiAgICApXG4gICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKSlcbiAgICBhd2FpdCBjaGFuZ2VSZWdpb24oTnVtYmVyKHNlbGVjdGVkPy5yZWdpb24uaWQgPz8gY3VycmVudFJlZ2lvbi5pZCkpXG5cbiAgICBpZiAoXG4gICAgICB0aGlzLmdldEV4cGxvcmF0aW9uU3RhdHVzKCkgPT09IEV4cGxvcmF0aW9uU3RhdHVzLnBlbmRpbmcgJiZcbiAgICAgIHRpbWVMZWZ0RXhwbG9yYXRpb24gJiZcbiAgICAgIHRpbWVMZWZ0RXhwbG9yYXRpb24gPCAwXG4gICAgKSB7XG4gICAgICBDb25zb2xlLmluZm8oXG4gICAgICAgIFwiUmVsb2FkaW5nIGJlY2F1c2UgdGhlIHRpbWVyIGlzIGRlc3luY2hyb25pc2VkLlwiLFxuICAgICAgICB0aGlzLmdsb2JhbHNcbiAgICAgIClcbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBEdXJhdGlvblVuaXQuc2Vjb25kKSlcbiAgICAgIHBhZ2VMb2FkKFwiL3BldFwiKVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IEV4cGxvcmF0aW9uQWN0aW9uKClcbiIsImltcG9ydCB7IENvbnNvbGUgfSBmcm9tIFwiLi4vLi4vY29uc29sZVwiXG5pbXBvcnQgeyBMb2NhbFN0b3JhZ2UgfSBmcm9tIFwiLi4vLi4vbG9jYWxfc3RvcmFnZS9sb2NhbF9zdG9yYWdlXCJcbmltcG9ydCB7IHBsYXlGbGFwcHksIHBsYXlIYXRjaGxpbmdzLCBwbGF5UGVnZ2xlIH0gZnJvbSBcIi4uLy4uL21pbmlnYW1lcy9lbWlsZVwiXG5pbXBvcnQgeyBmbGFwcHkgfSBmcm9tIFwiLi4vLi4vbWluaWdhbWVzL2ZsYXBweVwiXG5pbXBvcnQgeyBoYXRjaGxpbmdzIH0gZnJvbSBcIi4uLy4uL21pbmlnYW1lcy9oYXRjaGxpbmdzXCJcbmltcG9ydCB0eXBlIHsgTWluaWdhbWUgfSBmcm9tIFwiLi4vLi4vbWluaWdhbWVzL21pbmlnYW1lXCJcbmltcG9ydCB7IHBlZ2dsZSB9IGZyb20gXCIuLi8uLi9taW5pZ2FtZXMvcGVnZ2xlXCJcbmltcG9ydCB7IFNlc3Npb25TdG9yYWdlIH0gZnJvbSBcIi4uLy4uL3Nlc3Npb25fc3RvcmFnZS9zZXNzaW9uX3N0b3JhZ2VcIlxuaW1wb3J0IHsgVGFrZW92ZXJBY3Rpb24gfSBmcm9tIFwiLi4vLi4vc2Vzc2lvbl9zdG9yYWdlL3Rha2VvdmVyX2FjdGlvbi5lbnVtXCJcbmltcG9ydCB0eXBlIHsgQWN0aW9uIH0gZnJvbSBcIi4vYWN0aW9uXCJcblxuY2xhc3MgTWluaWdhbWVBY3Rpb24gaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSBrZXkgPSBUYWtlb3ZlckFjdGlvbi5taW5pZ2FtZXNcblxuICBjb25kaXRpb24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIExvY2FsU3RvcmFnZS5taW5pZ2FtZXMgJiYgIVNlc3Npb25TdG9yYWdlLm1pbmlnYW1lc0RvbmVcbiAgfVxuXG4gIC8qKiBEZXRlcm1pbmVzIGlmIHRoZSBtaW5pZ2FtZXMgc2hvdWxkIGJlIHBsYXllZCByaWdodCBub3cuXG4gICAqIEByZXR1cm5zIHdoZXRoZXIgdGhlIG1pbmlnYW1lcyBhcmUgY3VycmVudGx5IGJlaW5nIHBsYXllZC5cbiAgICovXG4gIGFzeW5jIHBlcmZvcm0oKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgc3dpdGNoIChsb2NhdGlvbi5wYXRobmFtZSkge1xuICAgICAgY2FzZSBcIi9taW5pZ2FtZXNcIjoge1xuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgNzUwKSlcbiAgICAgICAgY29uc3QgcGxheWluZyA9XG4gICAgICAgICAgdGhpcy5vcGVuTWluaWdhbWUocGVnZ2xlKSB8fFxuICAgICAgICAgIHRoaXMub3Blbk1pbmlnYW1lKGZsYXBweSkgfHxcbiAgICAgICAgICB0aGlzLm9wZW5NaW5pZ2FtZShoYXRjaGxpbmdzKVxuXG4gICAgICAgIGlmICghcGxheWluZykge1xuICAgICAgICAgIFNlc3Npb25TdG9yYWdlLm1pbmlnYW1lc0RvbmUgPSB0cnVlXG4gICAgICAgICAgZG9jdW1lbnRcbiAgICAgICAgICAgIC5xdWVyeVNlbGVjdG9yPEhUTUxCdXR0b25FbGVtZW50PihcbiAgICAgICAgICAgICAgJy5taW5pZ2FtZXMtcnVsZXMgW3JlbD1cImJ0bi1jYW5jZWxcIl0nXG4gICAgICAgICAgICApXG4gICAgICAgICAgICA/LmNsaWNrKClcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwbGF5aW5nXG4gICAgICB9XG5cbiAgICAgIGNhc2UgXCIvbWluaWdhbWVzL2dlbWJvbWJcIjpcbiAgICAgICAgYXdhaXQgcGxheVBlZ2dsZSgpXG4gICAgICAgIGJyZWFrXG5cbiAgICAgIGNhc2UgXCIvbWluaWdhbWVzL2J1YmJsdGVtcGxlXCI6XG4gICAgICAgIGF3YWl0IHBsYXlGbGFwcHkoKVxuICAgICAgICBicmVha1xuXG4gICAgICBjYXNlIFwiL21pbmlnYW1lcy9jb2Nvb25pbnBpY2tcIjpcbiAgICAgICAgYXdhaXQgcGxheUhhdGNobGluZ3MoKVxuICAgICAgICBicmVha1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBwYWdlTG9hZChcIi9taW5pZ2FtZXNcIilcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBwYWdlTG9hZChcIi9taW5pZ2FtZXNcIilcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgLyoqIENsaWNrIG9uIGEgbWluaWdhbWUncyBsaW5rLiBAcmV0dXJucyB3aGV0aGVyIHRoZSBtaW5pZ2FtZSB3YXMgb3BlbmVkLiAqL1xuICBwcml2YXRlIG9wZW5NaW5pZ2FtZShtaW5pZ2FtZTogTWluaWdhbWUpOiBib29sZWFuIHtcbiAgICBjb25zdCBzdGFydCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTFNwYW5FbGVtZW50PihcbiAgICAgIG1pbmlnYW1lLmJ1dHRvblNlbGVjdG9yXG4gICAgKVxuXG4gICAgQ29uc29sZS5kZWJ1ZyhgJHttaW5pZ2FtZS5uYW1lfSdzIGJ1dHRvbjpgLCBzdGFydClcbiAgICBpZiAoIXN0YXJ0KSByZXR1cm4gZmFsc2VcblxuICAgIHN0YXJ0LmNsaWNrKClcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBNaW5pZ2FtZUFjdGlvbigpXG4iLCJpbXBvcnQgeyBDb25zb2xlIH0gZnJvbSBcIi4uLy4uL2NvbnNvbGVcIlxuaW1wb3J0IHsgVGFrZW92ZXJBY3Rpb24gfSBmcm9tIFwiLi4vLi4vc2Vzc2lvbl9zdG9yYWdlL3Rha2VvdmVyX2FjdGlvbi5lbnVtXCJcbmltcG9ydCB7IEFjdGlvbiB9IGZyb20gXCIuL2FjdGlvblwiXG5cbmNsYXNzIFdhaXRBY3Rpb24gZXh0ZW5kcyBBY3Rpb24ge1xuICByZWFkb25seSBrZXkgPSBUYWtlb3ZlckFjdGlvbi53YWl0XG5cbiAgY29uZGl0aW9uKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICBhc3luYyBwZXJmb3JtKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIENvbnNvbGUubG9nKGBXYWl0aW5nIGZvciAxMCBtaW51dGVzLi4uYClcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZTxib29sZWFuPihyZXNvbHZlID0+XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHJlc29sdmUoZmFsc2UpLCAxMCAqIDYwICogMTAwMClcbiAgICApXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IFdhaXRBY3Rpb24oKVxuIiwiLyoqIENsaWNrIG9uIGFuIGVsZW1lbnQgYWZ0ZXIgd2FpdGluZyBmb3IgaXRzIHNlbGVjdG9yLCBob3ZlcmluZyBpdCBhbmQgd2FpdGluZ1xuICogZm9yIGl0cyBwb3RlbnRpYWwgYW5pbWF0aW9ucy5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNsaWNrPFQgZXh0ZW5kcyBIVE1MRWxlbWVudD4oXG4gIHNlbGVjdG9yOiBzdHJpbmdcbik6IFByb21pc2U8VD4ge1xuICByZXR1cm4gbmV3IFByb21pc2U8VD4ocmVzb2x2ZSA9PiB7XG4gICAgY29uc3QgaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxUPihzZWxlY3RvcilcbiAgICAgIGlmICghZWxlbWVudCkgcmV0dXJuXG4gICAgICBjbGVhckludGVydmFsKGludGVydmFsKVxuICAgICAgdm9pZCBjbGlja0VsZW1lbnQoZWxlbWVudCkudGhlbigoKSA9PiByZXNvbHZlKGVsZW1lbnQpKVxuICAgIH0sIDgwMClcbiAgfSlcbn1cblxuLyoqIENsaWNrIG9uIGFuIGVsZW1lbnQgYWZ0ZXIgaG92ZXJpbmcgaXQgYW5kIHdhaXRpbmcgZm9yIHBvc3NpYmxlXG4gKiBhbmltYXRpb25zLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY2xpY2tFbGVtZW50KGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogUHJvbWlzZTx2b2lkPiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPihyZXNvbHZlID0+IHtcbiAgICAvLyBTb21lIGVsZW1lbnRzIGRvbid0IGhhdmUgdGhlaXIgY2xpY2sgaGFuZGxlcnMgcmVhZHkgdW50aWwgdGhleSdyZVxuICAgIC8vIGhvdmVyZWQuXG4gICAgY29uc3QgbW91c2VFdmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KFwiTW91c2VFdmVudFwiKVxuICAgIG1vdXNlRXZlbnQuaW5pdEV2ZW50KFwibW91c2VvdmVyXCIpXG4gICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KG1vdXNlRXZlbnQpXG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGVsZW1lbnQuY2xpY2soKVxuICAgICAgcmVzb2x2ZSgpXG4gICAgfSwgODAwKVxuICB9KVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2FpdDxUIGV4dGVuZHMgSFRNTEVsZW1lbnQ+KFxuICBzZWxlY3Rvcjogc3RyaW5nXG4pOiBQcm9taXNlPFQ+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlPFQ+KHJlc29sdmUgPT4ge1xuICAgIGNvbnN0IGludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8VD4oc2VsZWN0b3IpXG4gICAgICBpZiAoIWVsZW1lbnQpIHJldHVyblxuXG4gICAgICBjbGVhckludGVydmFsKGludGVydmFsKVxuICAgICAgcmVzb2x2ZShlbGVtZW50KVxuICAgIH0sIDgwMClcbiAgfSlcbn1cblxuLyoqXG4gKiBVc2VzIGEgYE11dGF0aW9uT2JzZXJ2ZXJgIHRvIHdhaXQgZm9yIGFuIGBIVE1MRWxlbWVudGAgaW5zaWRlIGFub3RoZXJcbiAqIGBIVE1MRWxlbWVudGAuIFRpbWVvdXRzIGFmdGVyIDJzIGJ5IGRlZmF1bHQsIGF0IHdoaWNoIHBvaW50IHRoZXJlJ3MgcHJvYmFibHlcbiAqIGEgZGVlcGVyIHByb2JsZW0gZ29pbmcgb24uXG4gKiBAcGFyYW0gY29udGFpbmVyIFRoZSBjb250YWluZXIgdG8gb2JzZXJ2ZSBhbmQgZmluZCB0aGUgYEhUTUxFbGVtZW50YCBpblxuICogQHBhcmFtIHNlbGVjdG9yIFRoZSBhcmd1bWVudCBmb3IgYGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yPFQ+KHNlbGVjdG9yKWBcbiAqIEByZXR1cm5zIFRoZSBmaXJzdCBlbGVtZW50IHRoYXQgaXMgYSBkZXNjZW5kYW50IG9mIGBjb250YWluZXJgIHRoYXQgbWF0Y2hlc1xuICogYHNlbGVjdG9yYCBvciBgbnVsbGAgYWZ0ZXIgdGhlIGB0aW1lb3V0YCBkZWxheS5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdhaXRPYnNlcnZlPFQgZXh0ZW5kcyBIVE1MRWxlbWVudD4oXG4gIGNvbnRhaW5lcjogRWxlbWVudCxcbiAgc2VsZWN0b3I6IHN0cmluZyxcbiAgbXMgPSAyMDAwXG4pOiBQcm9taXNlPFQgfCBudWxsPiB7XG4gIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZTxUIHwgbnVsbD4ocmVzb2x2ZSA9PiB7XG4gICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihcbiAgICAgIChfbXV0YXRpb25zOiBNdXRhdGlvblJlY29yZFtdLCBvYnNlcnZlcjogTXV0YXRpb25PYnNlcnZlcikgPT5cbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgY29uc3QgZWxlbWVudCA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yPFQ+KHNlbGVjdG9yKVxuICAgICAgICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KClcbiAgICAgICAgICAgIHJlc29sdmUoZWxlbWVudClcbiAgICAgICAgICB9XG4gICAgICAgIH0sIDEpXG4gICAgKVxuXG4gICAgb2JzZXJ2ZXIub2JzZXJ2ZShjb250YWluZXIsIHsgY2hpbGRMaXN0OiB0cnVlIH0pXG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKVxuICAgICAgcmVzb2x2ZShjb250YWluZXIucXVlcnlTZWxlY3RvcjxUPihzZWxlY3RvcikpXG4gICAgfSwgbXMpXG4gIH0pXG5cbiAgcmV0dXJuIHByb21pc2Vcbn1cbiIsImV4cG9ydCBlbnVtIEV4cGxvcmF0aW9uU3RhdHVzIHtcbiAgaWRsZSxcbiAgcmVzdWx0LFxuICBjYXB0dXJlLFxuICBwZW5kaW5nLFxufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGlzRW51bTxUIGV4dGVuZHMgUmVjb3JkPG51bWJlciB8IHN0cmluZyB8IHN5bWJvbCwgdW5rbm93bj4+KFxuICB2YWx1ZTogdW5rbm93bixcbiAgZW51bWVyYXRpb246IFRcbik6IHZhbHVlIGlzIFRba2V5b2YgVF0ge1xuICByZXR1cm4gT2JqZWN0LnZhbHVlcyhlbnVtZXJhdGlvbikuaW5jbHVkZXModmFsdWUpXG59XG4iLCJpbXBvcnQgdHlwZSB7IFRlbXBsYXRlIH0gZnJvbSBcImhvZ2FuLmpzXCJcbmltcG9ydCB7IHRyYW5zbGF0ZSB9IGZyb20gXCIuLi9pMThuL3RyYW5zbGF0ZVwiXG5pbXBvcnQgeyBMb2NhbFN0b3JhZ2UgfSBmcm9tIFwiLi4vbG9jYWxfc3RvcmFnZS9sb2NhbF9zdG9yYWdlXCJcbmltcG9ydCB0eXBlIHsgTWFya2V0SGlzdG9yeSB9IGZyb20gXCIuLi90ZW1wbGF0ZXMvaW50ZXJmYWNlcy9tYXJrZXRfaGlzdG9yeVwiXG5cbmV4cG9ydCBmdW5jdGlvbiBsb2FkQXVjdGlvbnMoKTogdm9pZCB7XG4gIGlmIChsb2NhdGlvbi5wYXRobmFtZSAhPT0gXCIvbWFya2V0cGxhY2UvYXVjdGlvbnNcIikgcmV0dXJuXG5cbiAgY29uc3QgbWFya2V0cGxhY2VBY3RpdmVBdWN0aW9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTERpdkVsZW1lbnQ+KFxuICAgIFwiI21hcmtldHBsYWNlLWFjdGl2ZS1hdWN0aW9uc1wiXG4gIClcbiAgaWYgKCFtYXJrZXRwbGFjZUFjdGl2ZUF1Y3Rpb25zKSByZXR1cm5cblxuICBjb25zdCBsYXlvdXQyY29sID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRGl2RWxlbWVudD4oXG4gICAgXCIubWFya2V0cGxhY2UtbWFpbi1jb250YWluZXIgI2xheW91dC0yY29sXCJcbiAgKVxuICBpZiAobGF5b3V0MmNvbCkgbGF5b3V0MmNvbC5zdHlsZS5vdmVyZmxvd1ggPSBcInZpc2libGVcIlxuXG4gIGxvYWRIaXN0b3J5KG1hcmtldHBsYWNlQWN0aXZlQXVjdGlvbnMpXG59XG5cbmZ1bmN0aW9uIGxvYWRIaXN0b3J5KG1hcmtldHBsYWNlQWN0aXZlQXVjdGlvbnM6IEhUTUxEaXZFbGVtZW50KTogdm9pZCB7XG4gIG1hcmtldHBsYWNlQWN0aXZlQXVjdGlvbnMucXVlcnlTZWxlY3RvcihcInN0eWxlXCIpPy5yZW1vdmUoKVxuICBtYXJrZXRwbGFjZUFjdGl2ZUF1Y3Rpb25zLnF1ZXJ5U2VsZWN0b3IoXCIjcHVyY2hhc2UtaGlzdG9yeVwiKT8ucmVtb3ZlKClcbiAgbWFya2V0cGxhY2VBY3RpdmVBdWN0aW9ucy5xdWVyeVNlbGVjdG9yKFwiI3NhbGUtaGlzdG9yeVwiKT8ucmVtb3ZlKClcblxuICBjb25zdCB0ZW1wbGF0ZTogVGVtcGxhdGUgPSByZXF1aXJlKFwiLi4vdGVtcGxhdGVzL2h0bWwvbWFya2V0X2hpc3RvcnkuaHRtbFwiKVxuICBjb25zdCBoaXN0b3J5OiBNYXJrZXRIaXN0b3J5ID0ge1xuICAgIHB1cmNoYXNlczogTG9jYWxTdG9yYWdlLnB1cmNoYXNlcy5tYXAocHVyY2hhc2UgPT4gKHtcbiAgICAgIC4uLnB1cmNoYXNlLFxuICAgICAgZGF0ZTogdHJhbnNsYXRlLm1hcmtldC5hdWN0aW9ucy5kYXRlX3RpbWVfZm9ybWF0LmZvcm1hdChcbiAgICAgICAgbmV3IERhdGUocHVyY2hhc2UuZGF0ZSlcbiAgICAgICksXG4gICAgfSkpLFxuICAgIHNhbGVzOiBMb2NhbFN0b3JhZ2Uuc2FsZXMubWFwKHNhbGUgPT4gKHtcbiAgICAgIC4uLnNhbGUsXG4gICAgICBkYXRlOiB0cmFuc2xhdGUubWFya2V0LmF1Y3Rpb25zLmRhdGVfdGltZV9mb3JtYXQuZm9ybWF0KFxuICAgICAgICBuZXcgRGF0ZShzYWxlLmRhdGUpXG4gICAgICApLFxuICAgIH0pKSxcbiAgfVxuXG4gIG1hcmtldHBsYWNlQWN0aXZlQXVjdGlvbnMuaW5zZXJ0QWRqYWNlbnRIVE1MKFxuICAgIFwiYmVmb3JlZW5kXCIsXG4gICAgdGVtcGxhdGUucmVuZGVyKHsgLi4uaGlzdG9yeSwgdHJhbnNsYXRlIH0pXG4gIClcblxuICBmb3IgKGNvbnN0IHB1cmNoYXNlIG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTExJRWxlbWVudD4oXG4gICAgXCIjcHVyY2hhc2UtaGlzdG9yeSAubWFya2V0cGxhY2UtYXVjdGlvbnMtaXRlbVwiXG4gICkpIHtcbiAgICBjb25zdCBpdGVtaWQgPSBwdXJjaGFzZS5kYXRhc2V0Lml0ZW1pZFxuICAgIHB1cmNoYXNlLnF1ZXJ5U2VsZWN0b3IoXCIuZGVsZXRlLWJ1dHRvblwiKT8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgIExvY2FsU3RvcmFnZS5wdXJjaGFzZXMgPSBMb2NhbFN0b3JhZ2UucHVyY2hhc2VzLmZpbHRlcihcbiAgICAgICAgcHVyY2hhc2UgPT4gcHVyY2hhc2UuaXRlbWlkICE9PSBpdGVtaWRcbiAgICAgIClcblxuICAgICAgbG9hZEhpc3RvcnkobWFya2V0cGxhY2VBY3RpdmVBdWN0aW9ucylcbiAgICB9KVxuICB9XG5cbiAgZm9yIChjb25zdCBzYWxlIG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTExJRWxlbWVudD4oXG4gICAgXCIjc2FsZS1oaXN0b3J5IC5tYXJrZXRwbGFjZS1zYWxlcy1pdGVtXCJcbiAgKSkge1xuICAgIGNvbnN0IGljb24gPSBzYWxlLnF1ZXJ5U2VsZWN0b3I8SFRNTEltYWdlRWxlbWVudD4oXCIuYWJzdHJhY3QtaWNvbiBpbWdcIik/LnNyY1xuICAgIHNhbGUucXVlcnlTZWxlY3RvcihcIi5kZWxldGUtYnV0dG9uXCIpPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgTG9jYWxTdG9yYWdlLnNhbGVzID0gTG9jYWxTdG9yYWdlLnNhbGVzLmZpbHRlcihzYWxlID0+IHNhbGUuaWNvbiAhPT0gaWNvbilcblxuICAgICAgbG9hZEhpc3RvcnkobWFya2V0cGxhY2VBY3RpdmVBdWN0aW9ucylcbiAgICB9KVxuICB9XG59XG4iLCJpbXBvcnQgdHlwZSB7IFRlbXBsYXRlIH0gZnJvbSBcImhvZ2FuLmpzXCJcbmltcG9ydCB7IGNhcm91c2VsQmVlbW9vdkFubm95YW5jZXMgfSBmcm9tIFwiLi4vY2Fyb3VzZWwvY2Fyb3VzZWxfYmVlbW9vdl9hbm5veWFuY2VzXCJcbmltcG9ydCB7IGNhcm91c2VsRG93bmxvYWRGYWNlIH0gZnJvbSBcIi4uL2Nhcm91c2VsL2Nhcm91c2VsX2Rvd25sb2FkX2ZhY2VcIlxuaW1wb3J0IHsgY2Fyb3VzZWxEb3dubG9hZEd1YXJkaWFuIH0gZnJvbSBcIi4uL2Nhcm91c2VsL2Nhcm91c2VsX2Rvd25sb2FkX2d1YXJkaWFuXCJcbmltcG9ydCB7IGNhcm91c2VsRUUgfSBmcm9tIFwiLi4vY2Fyb3VzZWwvY2Fyb3VzZWxfZWxkYXJ5YV9lbmhhbmNlbWVudHNcIlxuaW1wb3J0IHsgY2Fyb3VzZWxUYWtlb3ZlciB9IGZyb20gXCIuLi9jYXJvdXNlbC9jYXJvdXNlbF90YWtlb3ZlclwiXG5pbXBvcnQgeyBkb3dubG9hZEZhY2UsIGRvd25sb2FkR3VhcmRpYW4gfSBmcm9tIFwiLi4vZG93bmxvYWQtY2FudmFzXCJcbmltcG9ydCB7IHRyYW5zbGF0ZSB9IGZyb20gXCIuLi9pMThuL3RyYW5zbGF0ZVwiXG5pbXBvcnQgeyBMb2NhbFN0b3JhZ2UgfSBmcm9tIFwiLi4vbG9jYWxfc3RvcmFnZS9sb2NhbF9zdG9yYWdlXCJcbmltcG9ydCB7IFNlc3Npb25TdG9yYWdlIH0gZnJvbSBcIi4uL3Nlc3Npb25fc3RvcmFnZS9zZXNzaW9uX3N0b3JhZ2VcIlxuaW1wb3J0IHsgdG9nZ2xlVGFrZW92ZXIgfSBmcm9tIFwiLi4vdGFrZW92ZXIvYnJhaW5cIlxuXG5leHBvcnQgZnVuY3Rpb24gbG9hZENhcm91c2VsKCk6IHZvaWQge1xuICBjb25zdCBjYXJvdXNlbElubmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjYXJvdXNlbC1pbm5lclwiKVxuICBpZiAoIWNhcm91c2VsSW5uZXIgfHwgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jYXJvdXNlbC1lZVwiKSkge1xuICAgIHJldHVyblxuICB9XG5cbiAgLy8gSW1wb3J0IGNhcm91c2VsIHRlbXBsYXRlXG4gIGNvbnN0IHRlbXBsYXRlOiBUZW1wbGF0ZSA9IHJlcXVpcmUoXCIuLi90ZW1wbGF0ZXMvaHRtbC9jYXJvdXNlbF9uZXdzLmh0bWxcIilcblxuICBjb25zdCBjb250ZXh0cyA9IFtcbiAgICAvLyBJbnRyb1xuICAgIGNhcm91c2VsRUUsXG5cbiAgICAvLyBGZWF0dXJlc1xuICAgIC4uLigoTG9jYWxTdG9yYWdlLm1pbmlnYW1lcyB8fFxuICAgICAgTG9jYWxTdG9yYWdlLmV4cGxvcmF0aW9ucyB8fFxuICAgICAgTG9jYWxTdG9yYWdlLm1hcmtldCkgJiZcbiAgICBMb2NhbFN0b3JhZ2UudW5sb2NrZWRcbiAgICAgID8gW2Nhcm91c2VsVGFrZW92ZXJdXG4gICAgICA6IFtdKSxcbiAgICBjYXJvdXNlbERvd25sb2FkR3VhcmRpYW4sXG4gICAgY2Fyb3VzZWxEb3dubG9hZEZhY2UsXG5cbiAgICAvLyBBZHNcbiAgICBjYXJvdXNlbEJlZW1vb3ZBbm5veWFuY2VzLFxuICBdXG5cbiAgLy8gQWRkIGVudHJpZXMgdG8gdGhlIGNhcm91c2VsXG4gIGNhcm91c2VsSW5uZXIuaW5zZXJ0QWRqYWNlbnRIVE1MKFxuICAgIFwiYmVmb3JlZW5kXCIsXG4gICAgY29udGV4dHMubWFwKGJhbm5lciA9PiB0ZW1wbGF0ZS5yZW5kZXIoYmFubmVyKSkuam9pbihcIlxcblwiKVxuICApXG5cbiAgLy8gQWRkIGxpbmtzXG4gIGZvciAoY29uc3QgY2Fyb3VzZWwgb2YgY29udGV4dHMpIHtcbiAgICBpZiAoIWNhcm91c2VsLmhyZWYpIGNvbnRpbnVlXG5cbiAgICBjb25zdCBlbGVtZW50ID0gY2Fyb3VzZWxJbm5lci5xdWVyeVNlbGVjdG9yKGAjJHtjYXJvdXNlbC5pZH1gKVxuICAgIGlmICghZWxlbWVudCkgY29udGludWVcblxuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgIGlmIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2ZVwiKSkgb3BlbihjYXJvdXNlbC5ocmVmLCBcIl9ibGFua1wiKVxuICAgIH0pXG4gIH1cblxuICAvLyBBZGQgY2xpY2sgZXZlbnRzXG5cbiAgZG9jdW1lbnRcbiAgICAuZ2V0RWxlbWVudEJ5SWQoY2Fyb3VzZWxEb3dubG9hZEZhY2UuaWQpXG4gICAgPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZG93bmxvYWRGYWNlKVxuXG4gIGRvY3VtZW50XG4gICAgLmdldEVsZW1lbnRCeUlkKGNhcm91c2VsRG93bmxvYWRHdWFyZGlhbi5pZClcbiAgICA/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBkb3dubG9hZEd1YXJkaWFuKVxuXG4gIGNvbnN0IHRha2VvdmVyQW5jaG9yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY2Fyb3VzZWxUYWtlb3Zlci5pZClcbiAgdGFrZW92ZXJBbmNob3I/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgdG9nZ2xlVGFrZW92ZXIoKVxuICAgIHRha2VvdmVyVGl0bGUodGFrZW92ZXJBbmNob3IpXG4gIH0pXG5cbiAgaWYgKHRha2VvdmVyQW5jaG9yKSB0YWtlb3ZlclRpdGxlKHRha2VvdmVyQW5jaG9yKVxufVxuXG5mdW5jdGlvbiB0YWtlb3ZlclRpdGxlKHRha2VvdmVyQW5jaG9yOiBIVE1MRWxlbWVudCk6IHZvaWQge1xuICBjb25zdCB0YWtlb3Zlckg0ID0gdGFrZW92ZXJBbmNob3IucXVlcnlTZWxlY3RvcihcImg0XCIpXG4gIGlmICh0YWtlb3Zlckg0KSB7XG4gICAgdGFrZW92ZXJINC5pbm5lclRleHQgPSBTZXNzaW9uU3RvcmFnZS50YWtlb3ZlclxuICAgICAgPyB0cmFuc2xhdGUuY2Fyb3VzZWwudGFrZW92ZXIuZGlzYWJsZV90YWtlb3ZlclxuICAgICAgOiB0cmFuc2xhdGUuY2Fyb3VzZWwudGFrZW92ZXIuZW5hYmxlX3Rha2VvdmVyXG4gIH1cbn1cbiIsImltcG9ydCB0eXBlIHsgVGVtcGxhdGUgfSBmcm9tIFwiaG9nYW4uanNcIlxuaW1wb3J0IHsgc2F2ZUZhdm91cml0ZSwgc2hvd0Zhdm91cml0ZSB9IGZyb20gXCIuLi9hcHBlYXJhbmNlL2Zha2VfZmF2b3VyaXRlc1wiXG5pbXBvcnQgeyBleHBvcnRQcmV2aWV3LCBpbXBvcnRPdXRmaXQgfSBmcm9tIFwiLi4vYXBwZWFyYW5jZS9mYXZvdXJpdGVzX2FjdGlvbnNcIlxuaW1wb3J0IHsgQ29uc29sZSB9IGZyb20gXCIuLi9jb25zb2xlXCJcbmltcG9ydCB7IGRvd25sb2FkQXBwZWFyYW5jZSB9IGZyb20gXCIuLi9kb3dubG9hZC1jYW52YXNcIlxuaW1wb3J0IHsgdHJhbnNsYXRlIH0gZnJvbSBcIi4uL2kxOG4vdHJhbnNsYXRlXCJcbmltcG9ydCBpbmRleGVkX2RiIGZyb20gXCIuLi9pbmRleGVkX2RiL2luZGV4ZWRfZGJcIlxuaW1wb3J0IHsgd2FpdE9ic2VydmUgfSBmcm9tIFwiLi4vdGFrZW92ZXIvY2xpY2tcIlxuaW1wb3J0IHR5cGUgeyBGYXZvdXJpdGVzQWN0aW9uIH0gZnJvbSBcIi4uL3RlbXBsYXRlcy9pbnRlcmZhY2VzL2Zhdm91cml0ZXNfYWN0aW9uXCJcblxuZXhwb3J0IGZ1bmN0aW9uIGxvYWRGYXZvdXJpdGVzKCk6IHZvaWQge1xuICBpZiAoIWxvY2F0aW9uLnBhdGhuYW1lLnN0YXJ0c1dpdGgoXCIvcGxheWVyL2FwcGVhcmFuY2UvZmF2b3JpdGVzXCIpKSByZXR1cm5cblxuICBsb2FkRmF2b3VyaXRlc0FjdGlvbnMoKVxuICB2b2lkIGxvYWRGYWtlRmF2b3VyaXRlcygpXG59XG5cbmZ1bmN0aW9uIGxvYWRGYXZvdXJpdGVzQWN0aW9ucygpOiB2b2lkIHtcbiAgY29uc3QgYWN0aW9ucyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmF2b3JpdGVzLWFjdGlvbnNcIilcbiAgaWYgKCFhY3Rpb25zIHx8IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZmF2b3JpdGVzLWFjdGlvbi1lZVwiKSkgcmV0dXJuXG5cbiAgY29uc3QgYWN0aW9uVGVtcGxhdGU6IFRlbXBsYXRlID0gcmVxdWlyZShcIi4uL3RlbXBsYXRlcy9odG1sL2Zhdm91cml0ZXNfYWN0aW9uLmh0bWxcIilcblxuICBjb25zdCBpbXBvcnRBY3Rpb246IEZhdm91cml0ZXNBY3Rpb24gPSB7XG4gICAgaWQ6IFwiaW1wb3J0LW91dGZpdFwiLFxuICAgIHRleHQ6IHRyYW5zbGF0ZS5hcHBlYXJhbmNlLmZhdm91cml0ZXMuYnV0dG9ucy5pbXBvcnQsXG4gIH1cbiAgY29uc3QgZXhwb3J0QWN0aW9uOiBGYXZvdXJpdGVzQWN0aW9uID0ge1xuICAgIGlkOiBcImV4cG9ydC1vdXRmaXRcIixcbiAgICB0ZXh0OiB0cmFuc2xhdGUuYXBwZWFyYW5jZS5mYXZvdXJpdGVzLmJ1dHRvbnMuZXhwb3J0LFxuICB9XG4gIGNvbnN0IGRvd25sb2FkQWN0aW9uOiBGYXZvdXJpdGVzQWN0aW9uID0ge1xuICAgIGlkOiBcImRvd25sb2FkLW91dGZpdFwiLFxuICAgIHRleHQ6IHRyYW5zbGF0ZS5hcHBlYXJhbmNlLmZhdm91cml0ZXMuYnV0dG9ucy5kb3dubG9hZCxcbiAgfVxuXG4gIGFjdGlvbnMuaW5zZXJ0QWRqYWNlbnRIVE1MKFxuICAgIFwiYmVmb3JlZW5kXCIsXG4gICAgYWN0aW9uVGVtcGxhdGUucmVuZGVyKGltcG9ydEFjdGlvbikgK1xuICAgICAgYWN0aW9uVGVtcGxhdGUucmVuZGVyKGV4cG9ydEFjdGlvbikgK1xuICAgICAgYWN0aW9uVGVtcGxhdGUucmVuZGVyKGRvd25sb2FkQWN0aW9uKVxuICApXG5cbiAgZG9jdW1lbnRcbiAgICAuZ2V0RWxlbWVudEJ5SWQoaW1wb3J0QWN0aW9uLmlkKVxuICAgID8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGltcG9ydE91dGZpdClcblxuICBkb2N1bWVudFxuICAgIC5nZXRFbGVtZW50QnlJZChleHBvcnRBY3Rpb24uaWQpXG4gICAgPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZXhwb3J0UHJldmlldylcblxuICBkb2N1bWVudFxuICAgIC5nZXRFbGVtZW50QnlJZChkb3dubG9hZEFjdGlvbi5pZClcbiAgICA/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBkb3dubG9hZEFwcGVhcmFuY2UpXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsb2FkRmFrZUZhdm91cml0ZXMoKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IGFwcGVhcmFuY2VJdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYXBwZWFyYW5jZS1pdGVtc1wiKVxuICBpZiAoIWFwcGVhcmFuY2VJdGVtcykge1xuICAgIENvbnNvbGUuZXJyb3IoXCJDb3VsZG4ndCBhY2Nlc3MgI2FwcGVhcmFuY2UtaXRlbXNcIiwgYXBwZWFyYW5jZUl0ZW1zKVxuICAgIHJldHVyblxuICB9XG5cbiAgY29uc3QgdGh1bWJzID0gYXdhaXQgd2FpdE9ic2VydmUoXG4gICAgYXBwZWFyYW5jZUl0ZW1zLFxuICAgIFwiI2FsbC1vdXRmaXQtdGh1bWJzIC5tQ1NCX2NvbnRhaW5lclwiLFxuICAgIDMwMDBcbiAgKVxuICBpZiAoIXRodW1icykge1xuICAgIENvbnNvbGUuZXJyb3IoXCJDb3VsZG4ndCBhY2Nlc3MgI2FsbC1vdXRmaXQtdGh1bWJzXCIsIHRodW1icylcbiAgICByZXR1cm5cbiAgfVxuXG4gIGNvbnN0IHRlbXBsYXRlOiBUZW1wbGF0ZSA9IHJlcXVpcmUoXCIuLi90ZW1wbGF0ZXMvaHRtbC9vdXRmaXRfdGh1bWJzLmh0bWxcIilcblxuICBjb25zdCBmYXZvdXJpdGVzID0gYXdhaXQgaW5kZXhlZF9kYi5nZXRGYXZvdXJpdGVPdXRmaXRzKClcblxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2VlLW91dGZpdC10aHVtYnNcIik/LnJlbW92ZSgpXG4gIHRodW1icy5pbnNlcnRBZGphY2VudEhUTUwoXG4gICAgXCJiZWZvcmVlbmRcIixcbiAgICB0ZW1wbGF0ZS5yZW5kZXIoeyBvdXRmaXRzOiBmYXZvdXJpdGVzIH0pXG4gIClcblxuICBkb2N1bWVudFxuICAgIC5xdWVyeVNlbGVjdG9yKFwiLmVlLWF2YWlsYWJsZS1zbG90XCIpXG4gICAgPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCk6IHZvaWQgPT4gdm9pZCBzYXZlRmF2b3VyaXRlKCkpXG5cbiAgZm9yIChjb25zdCBkaXYgb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MRGl2RWxlbWVudD4oXG4gICAgXCIuZWUtb3V0Zml0LXRodW1iXCJcbiAgKSkge1xuICAgIGRpdi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgY29uc3QgZmF2b3VyaXRlID0gZmF2b3VyaXRlcy5maW5kKFxuICAgICAgICBmYXZvdXJpdGUgPT4gZmF2b3VyaXRlLmlkID09PSBOdW1iZXIoZGl2LmRhdGFzZXQuYXJyYXlJbmRleClcbiAgICAgIClcbiAgICAgIGlmICghZmF2b3VyaXRlKSByZXR1cm5cblxuICAgICAgc2hvd0Zhdm91cml0ZShmYXZvdXJpdGUpXG4gICAgfSlcbiAgfVxufVxuIiwiaW1wb3J0IHR5cGUgeyBUZW1wbGF0ZSB9IGZyb20gXCJob2dhbi5qc1wiXG5pbXBvcnQgeyB0cmFuc2xhdGUgfSBmcm9tIFwiLi4vaTE4bi90cmFuc2xhdGVcIlxuaW1wb3J0IHR5cGUgeyBIb21lQ29udGVudFNtYWxsIH0gZnJvbSBcIi4uL3RlbXBsYXRlcy9pbnRlcmZhY2VzL2hvbWVfY29udGVudF9zbWFsbFwiXG5cbmV4cG9ydCBmdW5jdGlvbiBsb2FkSG9tZUNvbnRlbnQoKTogdm9pZCB7XG4gIGNvbnN0IGhvbWVDb250ZW50U21hbGxzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJob21lLWNvbnRlbnQtc21hbGxzXCIpXG4gIGlmIChcbiAgICAhaG9tZUNvbnRlbnRTbWFsbHMgfHxcbiAgICBob21lQ29udGVudFNtYWxscy5xdWVyeVNlbGVjdG9yKFwiLmhvbWUtY29udGVudC1zbWFsbC1lZVwiKVxuICApXG4gICAgcmV0dXJuXG5cbiAgLy8gUmVtb3ZlIGJhbmtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJob21lLWJhbmtcIik/LnJlbW92ZSgpXG5cbiAgLy8gQWRkIGZvcnVtXG4gIGNvbnN0IHNtYWxsVGVtcGxhdGU6IFRlbXBsYXRlID0gcmVxdWlyZShcIi4uL3RlbXBsYXRlcy9odG1sL2hvbWVfY29udGVudF9zbWFsbC5odG1sXCIpXG4gIGNvbnN0IHNtYWxsQ29udGVudDogSG9tZUNvbnRlbnRTbWFsbCA9IHtcbiAgICBiYWNrZ3JvdW5kSW1hZ2U6XG4gICAgICBcIi9hc3NldHMvaW1nL21pbmlnYW1lcy90cmVhc3VyZWh1bnQvYTQ4YmJjNGU0ODQ5NzQ1ZWJlNmRiY2Y1MzEzZWIzZjAuanBnXCIsXG4gICAgaDQ6IHRyYW5zbGF0ZS5ob21lLmZvcnVtLFxuICAgIGhyZWY6IFwiL2ZvcnVtXCIsXG4gICAgaWQ6IFwiZm9ydW1cIixcbiAgfVxuXG4gIGhvbWVDb250ZW50U21hbGxzLmluc2VydEFkamFjZW50SFRNTChcbiAgICBcImJlZm9yZWVuZFwiLFxuICAgIHNtYWxsVGVtcGxhdGUucmVuZGVyKHNtYWxsQ29udGVudClcbiAgKVxufVxuIiwiaW1wb3J0IHR5cGUgeyBUZW1wbGF0ZSB9IGZyb20gXCJob2dhbi5qc1wiXG5pbXBvcnQgeyB0cmltSWNvbiB9IGZyb20gXCIuLi9lbGRhcnlhX3V0aWxcIlxuaW1wb3J0IHsgdHJhbnNsYXRlIH0gZnJvbSBcIi4uL2kxOG4vdHJhbnNsYXRlXCJcbmltcG9ydCB7IExvY2FsU3RvcmFnZSB9IGZyb20gXCIuLi9sb2NhbF9zdG9yYWdlL2xvY2FsX3N0b3JhZ2VcIlxuaW1wb3J0IHR5cGUgeyBXaXNoZWRJdGVtIH0gZnJvbSBcIi4uL2xvY2FsX3N0b3JhZ2Uvd2lzaGVkX2l0ZW1cIlxuaW1wb3J0IHR5cGUgeyBEYXRhUHJvZHVjdCB9IGZyb20gXCIuLi9tYWxsL2RhdGFfcHJvZHVjdFwiXG5pbXBvcnQgdHlwZSB7IE1hbGxFbnRyeSB9IGZyb20gXCIuLi9tYWxsL21hbGxfZW50cnlcIlxuaW1wb3J0IHsgUmFyaXR5IH0gZnJvbSBcIi4uL21hcmtldHBsYWNlL2VudW1zL3Jhcml0eS5lbnVtXCJcblxuZXhwb3J0IGZ1bmN0aW9uIGxvYWRNYWxsKCk6IHZvaWQge1xuICBpZiAoIWxvY2F0aW9uLnBhdGhuYW1lLnN0YXJ0c1dpdGgoXCIvbWFsbFwiKSkgcmV0dXJuXG5cbiAgZm9yIChjb25zdCBsaSBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxMSUVsZW1lbnQ+KFwiW2RhdGEtcHJvZHVjdF1cIikpXG4gICAgbGkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IGFkZFdpc2hsaXN0QnV0dG9uKGxpKSlcbn1cblxuZnVuY3Rpb24gYWRkV2lzaGxpc3RCdXR0b24obGk6IEhUTUxMSUVsZW1lbnQpOiB2b2lkIHtcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNhZGQtdG8td2lzaGxpc3RcIik/LnJlbW92ZSgpXG5cbiAgZG9jdW1lbnRcbiAgICAucXVlcnlTZWxlY3RvcihcIiNtYWxsLXByb2R1Y3REZXRhaWwtaW5mb1wiKVxuICAgID8uaW5zZXJ0QWRqYWNlbnRIVE1MKFxuICAgICAgXCJiZWZvcmVlbmRcIixcbiAgICAgIFwiPGJ1dHRvbiBpZD0nYWRkLXRvLXdpc2hsaXN0JyBjbGFzcz0nbmwtYnV0dG9uJyBzdHlsZT0nbWFyZ2luOiAyMHB4IGF1dG8gMDsgbWluLXdpZHRoOiAyMDBweDsnPkFkZCB0byBtYXJrZXQgd2lzaGxpc3Q8L2J1dHRvbj5cIlxuICAgIClcblxuICBjb25zdCBtYXhRdWFudGl0eSA9IGxpLnF1ZXJ5U2VsZWN0b3I8SFRNTFNwYW5FbGVtZW50PihcIi5pdGVtLW1heFF1YW50aXR5XCIpXG5cbiAgY29uc3QgbWFsbEVudHJ5OiBNYWxsRW50cnkgPSB7XG4gICAgcHJvZHVjdDogSlNPTi5wYXJzZShsaS5kYXRhc2V0LnByb2R1Y3QhKSBhcyBEYXRhUHJvZHVjdCxcbiAgICBpY29uOiB0cmltSWNvbihcbiAgICAgIGxpLnF1ZXJ5U2VsZWN0b3I8SFRNTEltYWdlRWxlbWVudD4oXCJpbWcubWFsbC1wcm9kdWN0LWljb25cIikhLnNyY1xuICAgICksXG4gICAgcmFyaXR5OlxuICAgICAgUmFyaXR5W1xuICAgICAgICAobGlcbiAgICAgICAgICAucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICAgIFwiLnJhcml0eS1tYXJrZXItY29tbW9uLCAucmFyaXR5LW1hcmtlci1yYXJlLCAucmFyaXR5LW1hcmtlci1lcGljLCAucmFyaXR5LW1hcmtlci1sZWdlbmRhcnksIC5yYXJpdHktbWFya2VyLWV2ZW50XCJcbiAgICAgICAgICApXG4gICAgICAgICAgPy5jbGFzc05hbWUuc3BsaXQoXCJyYXJpdHktbWFya2VyLVwiKVsxXSA/PyBcIlwiKSBhcyBrZXlvZiB0eXBlb2YgUmFyaXR5XG4gICAgICBdLFxuICAgIG1heFF1YW50aXR5OiBtYXhRdWFudGl0eSA/IE51bWJlcihtYXhRdWFudGl0eS5pbm5lclRleHQpIDogdW5kZWZpbmVkLFxuICAgIGFic3RyYWN0VHlwZTpcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTERpdkVsZW1lbnQ+KFxuICAgICAgICBcIiNtYWxsLW1lbnUgLnRvb2x0aXAuYWN0aXZlIC50b29sdGlwLWNvbnRlbnRcIlxuICAgICAgKT8uaW5uZXJUZXh0ID8/IFwiXCIsXG4gIH1cblxuICBkb2N1bWVudFxuICAgIC5xdWVyeVNlbGVjdG9yKFwiI2FkZC10by13aXNobGlzdFwiKVxuICAgID8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IGFkZFRvV2lzaGxpc3RGbGF2cihtYWxsRW50cnkpKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYWRkVG9XaXNobGlzdEZsYXZyKG1hbGxFbnRyeTogTWFsbEVudHJ5KTogdm9pZCB7XG4gIGNvbnN0IHRlbXBsYXRlOiBUZW1wbGF0ZSA9IHJlcXVpcmUoXCIuLi90ZW1wbGF0ZXMvaHRtbC9hdXRvX2J1eV9mbGF2cl9tYWxsLmh0bWxcIilcblxuICAkLmZsYXZyKHtcbiAgICBjb250ZW50OiB0ZW1wbGF0ZS5yZW5kZXIoeyB0cmFuc2xhdGUgfSksXG4gICAgYnV0dG9uczoge1xuICAgICAgY2xvc2U6IHsgc3R5bGU6IFwiY2xvc2VcIiB9LFxuICAgICAgc2F2ZToge1xuICAgICAgICBhY3Rpb246ICgpID0+IHNhdmUobWFsbEVudHJ5KSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBkaWFsb2c6IFwicHJvbXB0XCIsXG4gICAgcHJvbXB0OiB7XG4gICAgICB2YWx1ZTogXCJcIixcbiAgICB9LFxuICAgIG9uQnVpbGQ6ICRjb250YWluZXIgPT4ge1xuICAgICAgJGNvbnRhaW5lci5hZGRDbGFzcyhcIm5ldy1sYXlvdXQtcG9wdXBcIilcblxuICAgICAgZG9jdW1lbnRcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3I8SFRNTElucHV0RWxlbWVudD4oXCIuZmxhdnItcHJvbXB0XCIpXG4gICAgICAgID8uYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsICh7IGtleSB9KSA9PiB7XG4gICAgICAgICAgaWYgKGtleSAhPT0gXCJFbnRlclwiKSByZXR1cm5cbiAgICAgICAgICBzYXZlKG1hbGxFbnRyeSlcbiAgICAgICAgfSlcbiAgICB9LFxuICB9KVxufVxuXG5mdW5jdGlvbiBzYXZlKG1hbGxFbnRyeTogTWFsbEVudHJ5KTogYm9vbGVhbiB7XG4gIGNvbnN0IHByaWNlID0gTnVtYmVyKFxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTElucHV0RWxlbWVudD4oXCIuZmxhdnItcHJvbXB0XCIpPy52YWx1ZS50cmltKClcbiAgKVxuICBpZiAoIXByaWNlIHx8IHByaWNlIDw9IDApIHtcbiAgICAkLmZsYXZyTm90aWYodHJhbnNsYXRlLm1hcmtldC5hZGRfdG9fd2lzaGxpc3QuaW52YWxpZF9wcmljZSlcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIGNvbnN0IHdpc2hsaXN0ID0gTG9jYWxTdG9yYWdlLndpc2hsaXN0LmZpbHRlcihcbiAgICB3aXNobGlzdEVudHJ5ID0+IHdpc2hsaXN0RW50cnkuaWNvbiAhPT0gbWFsbEVudHJ5Lmljb25cbiAgKVxuICBjb25zdCB3aXNoZWQ6IFdpc2hlZEl0ZW0gPSB7XG4gICAgLi4ubWFsbEVudHJ5LFxuICAgIC4uLm1hbGxFbnRyeS5wcm9kdWN0LFxuICAgIHByaWNlLFxuICB9XG4gIHdpc2hsaXN0LnB1c2god2lzaGVkKVxuXG4gIHdpc2hsaXN0LnNvcnQoKGEsIGIpID0+IHtcbiAgICBjb25zdCB0eXBlQ29tcGFyZSA9IGEudHlwZS5sb2NhbGVDb21wYXJlKGIudHlwZSlcbiAgICBpZiAodHlwZUNvbXBhcmUgIT09IDApIHJldHVybiB0eXBlQ29tcGFyZVxuXG4gICAgY29uc3QgYWJzdHJhY3RUeXBlQ29tcGFyZSA9IChhLmFic3RyYWN0VHlwZSA/PyBcIlwiKS5sb2NhbGVDb21wYXJlKFxuICAgICAgYi5hYnN0cmFjdFR5cGUgPz8gXCJcIlxuICAgIClcbiAgICBpZiAoYWJzdHJhY3RUeXBlQ29tcGFyZSAhPT0gMCkgcmV0dXJuIGFic3RyYWN0VHlwZUNvbXBhcmVcblxuICAgIGNvbnN0IHJhcml0eUNvbXBhcmUgPVxuICAgICAgT2JqZWN0LmtleXMoUmFyaXR5KS5pbmRleE9mKGEucmFyaXR5ID8/IFwiXCIpIC1cbiAgICAgIE9iamVjdC5rZXlzKFJhcml0eSkuaW5kZXhPZihiLnJhcml0eSA/PyBcIlwiKVxuICAgIGlmIChyYXJpdHlDb21wYXJlICE9PSAwKSByZXR1cm4gcmFyaXR5Q29tcGFyZVxuXG4gICAgcmV0dXJuIGEubmFtZS5sb2NhbGVDb21wYXJlKGIubmFtZSlcbiAgfSlcblxuICBMb2NhbFN0b3JhZ2Uud2lzaGxpc3QgPSB3aXNobGlzdFxuXG4gIGNvbnN0IHRlbXBsYXRlOiBUZW1wbGF0ZSA9IHJlcXVpcmUoXCIuLi90ZW1wbGF0ZXMvaHRtbC9mbGF2cl9ub3RpZi9pY29uX21lc3NhZ2UuaHRtbFwiKVxuICAkLmZsYXZyTm90aWYoXG4gICAgdGVtcGxhdGUucmVuZGVyKHtcbiAgICAgIC4uLndpc2hlZCxcbiAgICAgIG1lc3NhZ2U6IHRyYW5zbGF0ZS5tYXJrZXQuYWRkX3RvX3dpc2hsaXN0LmFkZGVkX3RvX3dpc2hsaXN0KFxuICAgICAgICB3aXNoZWQubmFtZSxcbiAgICAgICAgd2lzaGVkLnByaWNlXG4gICAgICApLFxuICAgIH0pXG4gIClcbiAgcmV0dXJuIHRydWVcbn1cbiIsImltcG9ydCB0eXBlIHsgVGVtcGxhdGUgfSBmcm9tIFwiaG9nYW4uanNcIlxuaW1wb3J0IHsgdHJhbnNsYXRlIH0gZnJvbSBcIi4uL2kxOG4vdHJhbnNsYXRlXCJcbmltcG9ydCB7IExvY2FsU3RvcmFnZSB9IGZyb20gXCIuLi9sb2NhbF9zdG9yYWdlL2xvY2FsX3N0b3JhZ2VcIlxuaW1wb3J0IHR5cGUgeyBXaXNoZWRJdGVtIH0gZnJvbSBcIi4uL2xvY2FsX3N0b3JhZ2Uvd2lzaGVkX2l0ZW1cIlxuaW1wb3J0IHsgUmFyaXR5IH0gZnJvbSBcIi4uL21hcmtldHBsYWNlL2VudW1zL3Jhcml0eS5lbnVtXCJcbmltcG9ydCB0eXBlIHsgTWFya2V0RW50cnkgfSBmcm9tIFwiLi4vbWFya2V0cGxhY2UvaW50ZXJmYWNlcy9tYXJrZXRfZW50cnlcIlxuaW1wb3J0IHsgZ2V0SXRlbURldGFpbHMgfSBmcm9tIFwiLi4vbWFya2V0cGxhY2UvbWFya2V0cGxhY2VfaGFuZGxlcnNcIlxuXG5sZXQgbWFya2V0T2JzZXJ2ZXI6IE11dGF0aW9uT2JzZXJ2ZXIgfCBudWxsXG5cbmV4cG9ydCBmdW5jdGlvbiBsb2FkTWFya2V0KCk6IHZvaWQge1xuICBtYXJrZXRPYnNlcnZlcj8uZGlzY29ubmVjdCgpXG4gIG1hcmtldE9ic2VydmVyID0gbnVsbFxuXG4gIGlmIChsb2NhdGlvbi5wYXRobmFtZSAhPT0gXCIvbWFya2V0cGxhY2VcIikgcmV0dXJuXG5cbiAgLy8gYC5tYXJrZXRwbGFjZS1zZWFyY2gtaXRlbXNgIGlzIHRoZSBjb250YWluZXIgd2hvc2UgSFRNTCBjb250ZW50IGlzIGJlaW5nXG4gIC8vIHJlcGxhY2VkIG9uIGV2ZXJ5IGFjdGlvbi5cbiAgY29uc3Qgc2VhcmNoSXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxVTGlzdEVsZW1lbnQ+KFxuICAgIFwiLm1hcmtldHBsYWNlLXNlYXJjaC1pdGVtc1wiXG4gIClcbiAgaWYgKCFzZWFyY2hJdGVtcykgcmV0dXJuXG5cbiAgbWFya2V0T2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihsb2FkV2lzaGxpc3QpXG4gIG1hcmtldE9ic2VydmVyLm9ic2VydmUoc2VhcmNoSXRlbXMsIHtcbiAgICBjaGlsZExpc3Q6IHRydWUsXG4gIH0pXG5cbiAgbG9hZFdpc2hsaXN0KClcbn1cblxuZnVuY3Rpb24gbG9hZFdpc2hsaXN0KCk6IHZvaWQge1xuICBmb3IgKGNvbnN0IGxpIG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTExJRWxlbWVudD4oXG4gICAgXCIubWFya2V0cGxhY2UtYWJzdHJhY3RcIlxuICApKSB7XG4gICAgbGkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+XG4gICAgICBuZXcgTXV0YXRpb25PYnNlcnZlcihcbiAgICAgICAgKF86IE11dGF0aW9uUmVjb3JkW10sIG9ic2VydmVyOiBNdXRhdGlvbk9ic2VydmVyKTogdm9pZCA9PiB7XG4gICAgICAgICAgY29uc3QgbWFya2V0RW50cnkgPSBnZXRJdGVtRGV0YWlscyhsaSlcbiAgICAgICAgICBpZiAoIW1hcmtldEVudHJ5KSByZXR1cm5cblxuICAgICAgICAgIGFkZFdpc2hpc3RCdXR0b24obWFya2V0RW50cnksIG9ic2VydmVyKVxuICAgICAgICB9XG4gICAgICApLm9ic2VydmUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYXJrZXRwbGFjZS16b29tXCIpIGFzIE5vZGUsIHtcbiAgICAgICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgICAgfSlcbiAgICApXG4gIH1cbn1cblxuZnVuY3Rpb24gYWRkV2lzaGlzdEJ1dHRvbihcbiAgbWFya2V0RW50cnk6IE1hcmtldEVudHJ5LFxuICBvYnNlcnZlcj86IE11dGF0aW9uT2JzZXJ2ZXJcbik6IHZvaWQge1xuICBjb25zdCBidXR0b25zQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRGl2RWxlbWVudD4oXG4gICAgXCIjbWFya2V0cGxhY2UtaXRlbURldGFpbFwiXG4gIClcbiAgaWYgKCFidXR0b25zQ29udGFpbmVyKSByZXR1cm5cbiAgb2JzZXJ2ZXI/LmRpc2Nvbm5lY3QoKVxuICBoaWphY2tCdXlCdXR0b25zKG1hcmtldEVudHJ5KVxuXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFya2V0cGxhY2UtaXRlbURldGFpbC1pbmZvLWF1dG9idXlcIik/LnJlbW92ZSgpXG4gIGNvbnN0IGJ1dHRvblRlbXBsYXRlOiBUZW1wbGF0ZSA9IHJlcXVpcmUoXCIuLi90ZW1wbGF0ZXMvaHRtbC9hdXRvX2J1eV9idXR0b24uaHRtbFwiKVxuICBidXR0b25zQ29udGFpbmVyLmluc2VydEFkamFjZW50SFRNTChcbiAgICBcImJlZm9yZWVuZFwiLFxuICAgIGJ1dHRvblRlbXBsYXRlLnJlbmRlcih7IHRyYW5zbGF0ZSB9KVxuICApXG5cbiAgYnV0dG9uc0NvbnRhaW5lclxuICAgIC5xdWVyeVNlbGVjdG9yPEhUTUxEaXZFbGVtZW50PihcIiNtYXJrZXRwbGFjZS1pdGVtRGV0YWlsLWluZm8tYXV0b2J1eVwiKVxuICAgID8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IGFkZFRvV2lzaGxpc3RGbGF2cihtYXJrZXRFbnRyeSkpXG59XG5cbmZ1bmN0aW9uIGFkZFRvV2lzaGxpc3RGbGF2cihtYXJrZXRFbnRyeTogTWFya2V0RW50cnkpOiB2b2lkIHtcbiAgY29uc3QgdGVtcGxhdGU6IFRlbXBsYXRlID0gcmVxdWlyZShcIi4uL3RlbXBsYXRlcy9odG1sL2F1dG9fYnV5X2ZsYXZyLmh0bWxcIilcblxuICAkLmZsYXZyKHtcbiAgICBjb250ZW50OiB0ZW1wbGF0ZS5yZW5kZXIoeyB0cmFuc2xhdGUgfSksXG4gICAgYnV0dG9uczoge1xuICAgICAgY2xvc2U6IHsgc3R5bGU6IFwiY2xvc2VcIiB9LFxuICAgICAgc2F2ZToge1xuICAgICAgICBhY3Rpb246ICgpID0+IHNhdmUobWFya2V0RW50cnkpLFxuICAgICAgfSxcbiAgICB9LFxuICAgIGRpYWxvZzogXCJwcm9tcHRcIixcbiAgICBwcm9tcHQ6IHtcbiAgICAgIHZhbHVlOiBcIlwiLFxuICAgIH0sXG4gICAgb25CdWlsZDogJGNvbnRhaW5lciA9PiB7XG4gICAgICAkY29udGFpbmVyLmFkZENsYXNzKFwibmV3LWxheW91dC1wb3B1cFwiKVxuXG4gICAgICBkb2N1bWVudFxuICAgICAgICAucXVlcnlTZWxlY3RvcjxIVE1MSW5wdXRFbGVtZW50PihcIi5mbGF2ci1wcm9tcHRcIilcbiAgICAgICAgPy5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgKHsga2V5IH0pID0+IHtcbiAgICAgICAgICBpZiAoa2V5ICE9PSBcIkVudGVyXCIpIHJldHVyblxuICAgICAgICAgIHNhdmUobWFya2V0RW50cnkpXG4gICAgICAgIH0pXG4gICAgfSxcbiAgfSlcbn1cblxuZnVuY3Rpb24gc2F2ZShtYXJrZXRFbnRyeTogTWFya2V0RW50cnkpOiBib29sZWFuIHtcbiAgY29uc3QgcHJpY2UgPSBOdW1iZXIoXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MSW5wdXRFbGVtZW50PihcIi5mbGF2ci1wcm9tcHRcIik/LnZhbHVlLnRyaW0oKVxuICApXG4gIGlmICghcHJpY2UgfHwgcHJpY2UgPD0gMCkge1xuICAgICQuZmxhdnJOb3RpZih0cmFuc2xhdGUubWFya2V0LmFkZF90b193aXNobGlzdC5pbnZhbGlkX3ByaWNlKVxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgY29uc3Qgd2lzaGxpc3QgPSBMb2NhbFN0b3JhZ2Uud2lzaGxpc3QuZmlsdGVyKFxuICAgIHdpc2hsaXN0RW50cnkgPT4gd2lzaGxpc3RFbnRyeS5pY29uICE9PSBtYXJrZXRFbnRyeS5pY29uXG4gIClcbiAgY29uc3Qgd2lzaGVkOiBXaXNoZWRJdGVtID0geyAuLi5tYXJrZXRFbnRyeSwgcHJpY2UgfVxuICB3aXNobGlzdC5wdXNoKHdpc2hlZClcblxuICB3aXNobGlzdC5zb3J0KChhLCBiKSA9PiB7XG4gICAgY29uc3QgdHlwZUNvbXBhcmUgPSBhLnR5cGUubG9jYWxlQ29tcGFyZShiLnR5cGUpXG4gICAgaWYgKHR5cGVDb21wYXJlICE9PSAwKSByZXR1cm4gdHlwZUNvbXBhcmVcblxuICAgIGNvbnN0IGFic3RyYWN0VHlwZUNvbXBhcmUgPSAoYS5hYnN0cmFjdFR5cGUgPz8gXCJcIikubG9jYWxlQ29tcGFyZShcbiAgICAgIGIuYWJzdHJhY3RUeXBlID8/IFwiXCJcbiAgICApXG4gICAgaWYgKGFic3RyYWN0VHlwZUNvbXBhcmUgIT09IDApIHJldHVybiBhYnN0cmFjdFR5cGVDb21wYXJlXG5cbiAgICBjb25zdCByYXJpdHlDb21wYXJlID1cbiAgICAgIE9iamVjdC5rZXlzKFJhcml0eSkuaW5kZXhPZihhLnJhcml0eSA/PyBcIlwiKSAtXG4gICAgICBPYmplY3Qua2V5cyhSYXJpdHkpLmluZGV4T2YoYi5yYXJpdHkgPz8gXCJcIilcbiAgICBpZiAocmFyaXR5Q29tcGFyZSAhPT0gMCkgcmV0dXJuIHJhcml0eUNvbXBhcmVcblxuICAgIHJldHVybiBhLm5hbWUubG9jYWxlQ29tcGFyZShiLm5hbWUpXG4gIH0pXG5cbiAgTG9jYWxTdG9yYWdlLndpc2hsaXN0ID0gd2lzaGxpc3RcblxuICBjb25zdCB0ZW1wbGF0ZTogVGVtcGxhdGUgPSByZXF1aXJlKFwiLi4vdGVtcGxhdGVzL2h0bWwvZmxhdnJfbm90aWYvaWNvbl9tZXNzYWdlLmh0bWxcIilcbiAgJC5mbGF2ck5vdGlmKFxuICAgIHRlbXBsYXRlLnJlbmRlcih7XG4gICAgICAuLi53aXNoZWQsXG4gICAgICBtZXNzYWdlOiB0cmFuc2xhdGUubWFya2V0LmFkZF90b193aXNobGlzdC5hZGRlZF90b193aXNobGlzdChcbiAgICAgICAgd2lzaGVkLm5hbWUsXG4gICAgICAgIHdpc2hlZC5wcmljZVxuICAgICAgKSxcbiAgICB9KVxuICApXG4gIHJldHVybiB0cnVlXG59XG5cbmZ1bmN0aW9uIGhpamFja0J1eUJ1dHRvbnMobWFya2V0RW50cnk6IE1hcmtldEVudHJ5KTogdm9pZCB7XG4gIGRvY3VtZW50XG4gICAgLnF1ZXJ5U2VsZWN0b3IoXCIubWFya2V0cGxhY2UtaXRlbURldGFpbC1idXlcIilcbiAgICA/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICBhZGRQdXJjaGFzZShtYXJrZXRFbnRyeSlcbiAgICB9KVxufVxuXG5mdW5jdGlvbiBhZGRQdXJjaGFzZShtYXJrZXRFbnRyeTogTWFya2V0RW50cnkpOiB2b2lkIHtcbiAgTG9jYWxTdG9yYWdlLnB1cmNoYXNlcyA9IFtcbiAgICBtYXJrZXRFbnRyeSxcbiAgICAuLi5Mb2NhbFN0b3JhZ2UucHVyY2hhc2VzLmZpbHRlcihcbiAgICAgIHB1cmNoYXNlID0+IHB1cmNoYXNlLml0ZW1pZCAhPT0gbWFya2V0RW50cnkuaXRlbWlkXG4gICAgKSxcbiAgXVxufVxuIiwiaW1wb3J0IHR5cGUgeyBUZW1wbGF0ZSB9IGZyb20gXCJob2dhbi5qc1wiXG5pbXBvcnQgeyB0cmFuc2xhdGUgfSBmcm9tIFwiLi4vaTE4bi90cmFuc2xhdGVcIlxuaW1wb3J0IHR5cGUgeyBNYWluTWVudSB9IGZyb20gXCIuLi90ZW1wbGF0ZXMvaW50ZXJmYWNlcy9tYWluX21lbnVcIlxuXG5leHBvcnQgZnVuY3Rpb24gbG9hZE1lbnUoKTogdm9pZCB7XG4gIGNvbnN0IG1lbnVJbm5lclJpZ2h0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtZW51LWlubmVyLXJpZ2h0XCIpXG4gIGlmICghbWVudUlubmVyUmlnaHQgfHwgbWVudUlubmVyUmlnaHQucXVlcnlTZWxlY3RvcihcIi5tYWluLW1lbnUtZWVcIikpIHJldHVyblxuXG4gIC8vIFJlbW92ZSBiYW5rXG4gIG1lbnVJbm5lclJpZ2h0LnF1ZXJ5U2VsZWN0b3IoXCIubWFpbi1tZW51LWJhbmtcIik/LnJlbW92ZSgpXG5cbiAgLy8gQWRkIEZvcnVtXG4gIGNvbnN0IG1lbnVUZW1wbGF0ZTogVGVtcGxhdGUgPSByZXF1aXJlKFwiLi4vdGVtcGxhdGVzL2h0bWwvbWFpbl9tZW51Lmh0bWxcIilcbiAgY29uc3QgbWFpbk1lbnVGb3J1bTogTWFpbk1lbnUgPSB7XG4gICAgY2xhc3M6IFwiZm9ydW1cIixcbiAgICBocmVmOiBcIi9mb3J1bVwiLFxuICAgIHRleHQ6IHRyYW5zbGF0ZS5ob21lLmZvcnVtLFxuICB9XG5cbiAgbWVudUlubmVyUmlnaHQuaW5zZXJ0QWRqYWNlbnRIVE1MKFxuICAgIFwiYmVmb3JlZW5kXCIsXG4gICAgbWVudVRlbXBsYXRlLnJlbmRlcihtYWluTWVudUZvcnVtKVxuICApXG59XG4iLCJpbXBvcnQgeyBDb25zb2xlIH0gZnJvbSBcIi4uL2NvbnNvbGVcIlxuaW1wb3J0IHsgbG9hZE1hcmtlcnMgfSBmcm9tIFwiLi4vcGV0L2V4cGxvcmF0aW9uXCJcbmltcG9ydCB7IGxvYWRFeHBsb3JhdGlvbkhpc3RvcnksIG9uQ2xpY2tQZXQgfSBmcm9tIFwiLi4vcGV0L2V4cGxvcmF0aW9uLWhpc3RvcnlcIlxuaW1wb3J0IHsgbG9hZE1hc3NNYXJrIH0gZnJvbSBcIi4uL3BldC9tYXNzX21hcmtcIlxuXG5sZXQgcGV0T2JzZXJ2ZXI6IE11dGF0aW9uT2JzZXJ2ZXIgfCBudWxsXG5cbmZ1bmN0aW9uIGxvYWRFeHBsb3JhdGlvbnMoKTogdm9pZCB7XG4gIHBldE9ic2VydmVyPy5kaXNjb25uZWN0KClcbiAgcGV0T2JzZXJ2ZXIgPSBudWxsXG5cbiAgLyoqIGAucGFnZS1tYWluLWNvbnRhaW5lcmAgY2hhbmdlcyBiYWNrZ3JvdW5kIGRlcGVuZGluZyBvbiB0aGUgY3VycmVudGx5IHNlbGVjdGVkIHJlZ2lvbi4gKi9cbiAgY29uc3QgbWFpbkNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTERpdkVsZW1lbnQ+KFxuICAgIFwiLnBhZ2UtbWFpbi1jb250YWluZXJcIlxuICApXG4gIGlmICghbWFpbkNvbnRhaW5lcikgcmV0dXJuXG5cbiAgcGV0T2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihsb2FkRXhwbG9yYXRpb25zKVxuICBwZXRPYnNlcnZlci5vYnNlcnZlKG1haW5Db250YWluZXIsIHtcbiAgICBhdHRyaWJ1dGVzOiB0cnVlLFxuICB9KVxuXG4gIGxvYWRNYXJrZXJzKClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvYWRQZXQoKTogdm9pZCB7XG4gIGlmIChsb2NhdGlvbi5wYXRobmFtZSAhPT0gXCIvcGV0XCIpIHJldHVyblxuICBleHRlbmRSaWdodENvbnRhaW5lcigpXG4gIGNyZWF0ZUJ1dHRvblJvdygpXG5cbiAgbG9hZEV4cGxvcmF0aW9ucygpXG4gIGxvYWRFeHBsb3JhdGlvbkhpc3RvcnkoKVxuICBsb2FkTWFzc01hcmsoKVxufVxuXG5mdW5jdGlvbiBjcmVhdGVCdXR0b25Sb3coKTogdm9pZCB7XG4gIGNvbnN0IGNsb3NlRXhwbG9yYXRpb25CdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxBbmNob3JFbGVtZW50PihcbiAgICBcIiNjbG9zZS10cmVhc3VyZS1odW50LWludGVyZmFjZVwiXG4gIClcbiAgaWYgKCFjbG9zZUV4cGxvcmF0aW9uQnV0dG9uKVxuICAgIHJldHVybiBDb25zb2xlLmVycm9yKFwiQ291bGRuJ3QgZmluZCAjY2xvc2UtdHJlYXN1cmUtaHVudC1pbnRlcmZhY2UuXCIpXG5cbiAgY2xvc2VFeHBsb3JhdGlvbkJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJpbmxpbmUtYmxvY2tcIlxuICBjbG9zZUV4cGxvcmF0aW9uQnV0dG9uLnN0eWxlLm1hcmdpblJpZ2h0ID0gXCIwLjZlbVwiXG4gIGNsb3NlRXhwbG9yYXRpb25CdXR0b24uc3R5bGUucG9zaXRpb24gPSBcInJlbGF0aXZlXCJcbiAgY2xvc2VFeHBsb3JhdGlvbkJ1dHRvbi5zdHlsZS5yaWdodCA9IFwiMFwiXG4gIGNsb3NlRXhwbG9yYXRpb25CdXR0b24uc3R5bGUudG9wID0gXCIwXCJcbiAgY2xvc2VFeHBsb3JhdGlvbkJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgb25DbGlja1BldClcblxuICBjb25zdCByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpXG4gIHJvdy5pZCA9IFwiZWUtYnV0dG9ucy1yb3dcIlxuICByb3cuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KFwiYmVmb3JlZW5kXCIsIGNsb3NlRXhwbG9yYXRpb25CdXR0b24pXG5cbiAgZG9jdW1lbnRcbiAgICAucXVlcnlTZWxlY3RvcjxIVE1MRGl2RWxlbWVudD4oXCIjcmlnaHQtY29udGFpbmVyLWlubmVyXCIpXG4gICAgPy5pbnNlcnRBZGphY2VudEVsZW1lbnQoXCJhZnRlcmJlZ2luXCIsIHJvdylcbn1cblxuZnVuY3Rpb24gZXh0ZW5kUmlnaHRDb250YWluZXIoKTogdm9pZCB7XG4gIGNvbnN0IHJpZ2h0Q29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyaWdodC1jb250YWluZXJcIilcbiAgaWYgKCFyaWdodENvbnRhaW5lcilcbiAgICByZXR1cm4gQ29uc29sZS53YXJuKFwiQ291bGRuJ3QgZmluZCAjcmlnaHQtY29udGFpbmVyXCIsIHJpZ2h0Q29udGFpbmVyKVxuXG4gIHJpZ2h0Q29udGFpbmVyLnN0eWxlLmhlaWdodCA9IFwiNDBlbVwiXG59XG4iLCJpbXBvcnQgdHlwZSB7IFRlbXBsYXRlIH0gZnJvbSBcImhvZ2FuLmpzXCJcbmltcG9ydCB7IGRvd25sb2FkUHJvZmlsZSB9IGZyb20gXCIuLi9kb3dubG9hZC1jYW52YXNcIlxuaW1wb3J0IHsgdHJhbnNsYXRlIH0gZnJvbSBcIi4uL2kxOG4vdHJhbnNsYXRlXCJcbmltcG9ydCB7IGV4cG9ydE91dGZpdCB9IGZyb20gXCIuLi9vdXRmaXRcIlxuaW1wb3J0IHR5cGUgeyBQcm9maWxlQ29udGFjdEFjdGlvbiB9IGZyb20gXCIuLi90ZW1wbGF0ZXMvaW50ZXJmYWNlcy9wcm9maWxlX2NvbnRhY3RfYWN0aW9uXCJcblxuZXhwb3J0IGZ1bmN0aW9uIGxvYWRQcm9maWxlKCk6IHZvaWQge1xuICBjb25zdCBwcm9maWxlQ29udGFjdEFjdGlvbnMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgICBcInByb2ZpbGUtY29udGFjdC1hY3Rpb25zXCJcbiAgKVxuICBpZiAoXG4gICAgIXByb2ZpbGVDb250YWN0QWN0aW9ucyB8fFxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucHJvZmlsZS1jb250YWN0LWFjdGlvbi1lZVwiKVxuICApIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIGNvbnN0IHRlbXBsYXRlOiBUZW1wbGF0ZSA9IHJlcXVpcmUoXCIuLi90ZW1wbGF0ZXMvaHRtbC9wcm9maWxlX2NvbnRhY3RfYWN0aW9uLmh0bWxcIilcblxuICBjb25zdCBwcm9maWxlQWN0aW9uRXhwb3J0OiBQcm9maWxlQ29udGFjdEFjdGlvbiA9IHtcbiAgICBpZDogXCJwcm9maWxlLWNvbnRhY3QtYWN0aW9uLWV4cG9ydFwiLFxuICAgIGFjdGlvbkRlc2NyaXB0aW9uOiB0cmFuc2xhdGUucHJvZmlsZS5leHBvcnRfb3V0Zml0LFxuICB9XG4gIGNvbnN0IHByb2ZpbGVBY3Rpb25Eb3dubG9hZDogUHJvZmlsZUNvbnRhY3RBY3Rpb24gPSB7XG4gICAgaWQ6IFwicHJvZmlsZS1jb250YWN0LWFjdGlvbi1kb3dubG9hZFwiLFxuICAgIGFjdGlvbkRlc2NyaXB0aW9uOiB0cmFuc2xhdGUucHJvZmlsZS5kb3dubG9hZF9vdXRmaXQsXG4gIH1cblxuICAvLyBBZGQgZW50cmllc1xuICBwcm9maWxlQ29udGFjdEFjdGlvbnMuaW5zZXJ0QWRqYWNlbnRIVE1MKFxuICAgIFwiYmVmb3JlZW5kXCIsXG4gICAgdGVtcGxhdGUucmVuZGVyKHByb2ZpbGVBY3Rpb25FeHBvcnQpXG4gIClcbiAgcHJvZmlsZUNvbnRhY3RBY3Rpb25zLmluc2VydEFkamFjZW50SFRNTChcbiAgICBcImJlZm9yZWVuZFwiLFxuICAgIHRlbXBsYXRlLnJlbmRlcihwcm9maWxlQWN0aW9uRG93bmxvYWQpXG4gIClcblxuICAvLyBBZGQgY2xpY2sgZXZlbnRzXG4gIGRvY3VtZW50XG4gICAgLmdldEVsZW1lbnRCeUlkKHByb2ZpbGVBY3Rpb25FeHBvcnQuaWQpXG4gICAgPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZXhwb3J0UHJvZmlsZSlcbiAgZG9jdW1lbnRcbiAgICAuZ2V0RWxlbWVudEJ5SWQocHJvZmlsZUFjdGlvbkRvd25sb2FkLmlkKVxuICAgID8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGRvd25sb2FkUHJvZmlsZSlcbn1cblxuZnVuY3Rpb24gZXhwb3J0UHJvZmlsZSgpOiB2b2lkIHtcbiAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxIZWFkaW5nRWxlbWVudD4oXG4gICAgXCIjbWFpbi1zZWN0aW9uIC5zZWN0aW9uLXRpdGxlXCJcbiAgKVxuXG4gIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhTYWNoYS5BdmF0YXIuYXZhdGFycykuZmlsdGVyKGtleSA9PlxuICAgIGtleS5zdGFydHNXaXRoKFwiI3BsYXllclByb2ZpbGVBdmF0YXJcIilcbiAgKVxuXG4gIGZvciAoY29uc3Qga2V5IG9mIGtleXMpIHtcbiAgICBleHBvcnRPdXRmaXQoa2V5LCB0aXRsZT8udGV4dENvbnRlbnQ/LnRyaW0oKSlcbiAgfVxufVxuIiwiaW1wb3J0IHR5cGUgeyBUZW1wbGF0ZSB9IGZyb20gXCJob2dhbi5qc1wiXG5pbXBvcnQgeyBQdXJyb3Nob3BTdGF0dXMgfSBmcm9tIFwiLi4vYXBpL21ldGFcIlxuaW1wb3J0IHsgTG9jYWxTdG9yYWdlIH0gZnJvbSBcIi4uL2xvY2FsX3N0b3JhZ2UvbG9jYWxfc3RvcmFnZVwiXG5cbi8qKiBTaG93cyBhIFB1cnJvJ1Nob3AgYnV0dG9uIGluIHRoZSBtYWluIG1lbnUgd2hlbiBpdCdzIGF2YWlsYWJsZS4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsb2FkUHVycm9TaG9wKCk6IHZvaWQge1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1haW4tbWVudS1wdXJyb3Nob3BcIik/LnJlbW92ZSgpXG5cbiAgLy8gQSBidWcgaW4gV2ViUGFjayBwcmV2ZW50cyB1c2luZyBgTG9jYWxTdG9yYWdlLm1ldGE/LnB1cnJvc2hvcC5zdGF0dXNgLlxuICBpZiAoXG4gICAgTG9jYWxTdG9yYWdlLm1ldGEgPT09IG51bGwgfHxcbiAgICBMb2NhbFN0b3JhZ2UubWV0YS5wdXJyb3Nob3Auc3RhdHVzICE9PSBQdXJyb3Nob3BTdGF0dXMuZW5hYmxlZFxuICApXG4gICAgcmV0dXJuXG5cbiAgY29uc3QgdGVtcGxhdGU6IFRlbXBsYXRlID0gcmVxdWlyZShcIi4uL3RlbXBsYXRlcy9odG1sL21haW5fbWVudV9wdXJyb3Nob3AuaHRtbFwiKVxuICBkb2N1bWVudFxuICAgIC5nZXRFbGVtZW50QnlJZChcIm1lbnUtaW5uZXItbGVmdFwiKVxuICAgID8uaW5zZXJ0QWRqYWNlbnRIVE1MKFwiYWZ0ZXJiZWdpblwiLCB0ZW1wbGF0ZS5yZW5kZXIoe30pKVxufVxuIiwiaW1wb3J0IHR5cGUgeyBUZW1wbGF0ZSB9IGZyb20gXCJob2dhbi5qc1wiXG5pbXBvcnQgeyBnZXROYW1lIH0gZnJvbSBcIi4uL2Rvd25sb2FkLWNhbnZhc1wiXG5pbXBvcnQgeyB0cmFuc2xhdGUgfSBmcm9tIFwiLi4vaTE4bi90cmFuc2xhdGVcIlxuaW1wb3J0IHsgTG9jYWxTdG9yYWdlIH0gZnJvbSBcIi4uL2xvY2FsX3N0b3JhZ2UvbG9jYWxfc3RvcmFnZVwiXG5pbXBvcnQgdHlwZSB7IFNldHRpbmdzIH0gZnJvbSBcIi4uL3RlbXBsYXRlcy9pbnRlcmZhY2VzL3NldHRpbmdzXCJcblxuLyoqIENyZWF0ZXMgdGhlIFVJIGZvciB0aGUgc2V0dGluZ3MgaW4gdGhlIGFjY291bnQgcGFnZS4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsb2FkU2V0dGluZ3MoKTogdm9pZCB7XG4gIGNvbnN0IGFjY291bnRSaWdodCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYWNjb3VudC1yaWdodCBkaXZcIilcbiAgaWYgKCFhY2NvdW50UmlnaHQgfHwgYWNjb3VudFJpZ2h0LnF1ZXJ5U2VsZWN0b3IoXCIuYWNjb3VudC1lZS1ibG9jXCIpKSByZXR1cm5cblxuICBjb25zdCBzZXR0aW5nczogUGFydGlhbDxTZXR0aW5ncz4gPSB7XG4gICAgZGVidWc6IExvY2FsU3RvcmFnZS5kZWJ1ZyxcbiAgICBleHBsb3JhdGlvbnM6IExvY2FsU3RvcmFnZS5leHBsb3JhdGlvbnMsXG4gICAgbWFya2V0OiBMb2NhbFN0b3JhZ2UubWFya2V0LFxuICAgIG1pbmlnYW1lczogTG9jYWxTdG9yYWdlLm1pbmlnYW1lcyxcbiAgICB1bmxvY2tlZDogTG9jYWxTdG9yYWdlLnVubG9ja2VkLFxuICB9XG4gIGNvbnN0IHNldHRpbmdzVGVtcGxhdGU6IFRlbXBsYXRlID0gcmVxdWlyZShcIi4uL3RlbXBsYXRlcy9odG1sL3NldHRpbmdzLmh0bWxcIilcbiAgY29uc3QgcmVuZGVyZWQgPSBzZXR0aW5nc1RlbXBsYXRlLnJlbmRlcih7IC4uLnNldHRpbmdzLCB0cmFuc2xhdGUgfSlcbiAgYWNjb3VudFJpZ2h0Lmluc2VydEFkamFjZW50SFRNTChcImJlZm9yZWVuZFwiLCByZW5kZXJlZClcblxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVlLWRlYnVnLWVuYWJsZWRcIik/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgTG9jYWxTdG9yYWdlLmRlYnVnID0gIUxvY2FsU3RvcmFnZS5kZWJ1Z1xuICAgIHJlbG9hZFNldHRpbmdzKClcbiAgfSlcblxuICBpZiAoTG9jYWxTdG9yYWdlLnVubG9ja2VkKSB7XG4gICAgZG9jdW1lbnRcbiAgICAgIC5nZXRFbGVtZW50QnlJZChcImVlLW1pbmlnYW1lcy1lbmFibGVkXCIpXG4gICAgICA/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIExvY2FsU3RvcmFnZS5taW5pZ2FtZXMgPSAhTG9jYWxTdG9yYWdlLm1pbmlnYW1lc1xuICAgICAgICByZWxvYWRTZXR0aW5ncygpXG4gICAgICB9KVxuXG4gICAgZG9jdW1lbnRcbiAgICAgIC5nZXRFbGVtZW50QnlJZChcImVlLWV4cGxvcmF0aW9ucy1lbmFibGVkXCIpXG4gICAgICA/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIExvY2FsU3RvcmFnZS5leHBsb3JhdGlvbnMgPSAhTG9jYWxTdG9yYWdlLmV4cGxvcmF0aW9uc1xuICAgICAgICByZWxvYWRTZXR0aW5ncygpXG4gICAgICB9KVxuXG4gICAgZG9jdW1lbnRcbiAgICAgIC5nZXRFbGVtZW50QnlJZChcImVlLW1hcmtldC1lbmFibGVkXCIpXG4gICAgICA/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIExvY2FsU3RvcmFnZS5tYXJrZXQgPSAhTG9jYWxTdG9yYWdlLm1hcmtldFxuICAgICAgICByZWxvYWRTZXR0aW5ncygpXG4gICAgICB9KVxuXG4gICAgZG9jdW1lbnRcbiAgICAgIC5nZXRFbGVtZW50QnlJZChcImVlLWRlbGV0ZS1leHBsb3JhdGlvbnNcIilcbiAgICAgID8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgTG9jYWxTdG9yYWdlLmF1dG9FeHBsb3JlTG9jYXRpb25zID0gW11cblxuICAgICAgICBjb25zdCB0ZW1wbGF0ZTogVGVtcGxhdGUgPSByZXF1aXJlKFwiLi4vdGVtcGxhdGVzL2h0bWwvZmxhdnJfbm90aWYvaWNvbl9tZXNzYWdlLmh0bWxcIilcbiAgICAgICAgY29uc3QgcmVuZGVyZWQgPSB0ZW1wbGF0ZS5yZW5kZXIoe1xuICAgICAgICAgIGljb246IFwiL3N0YXRpYy9pbWcvbmV3LWxheW91dC9wZXQvaWNvbnMvcGljdG9fbWFwLnBuZ1wiLFxuICAgICAgICAgIG1lc3NhZ2U6IHRyYW5zbGF0ZS5hY2NvdW50LmV4cGxvcmF0aW9uc19kZWxldGVkLFxuICAgICAgICB9KVxuICAgICAgICAkLmZsYXZyTm90aWYocmVuZGVyZWQpXG4gICAgICB9KVxuICB9XG5cbiAgZG9jdW1lbnRcbiAgICAuZ2V0RWxlbWVudEJ5SWQoXCJlZS1pbXBvcnRcIilcbiAgICA/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBpbXBvcnRTZXR0aW5ncylcblxuICBkb2N1bWVudFxuICAgIC5nZXRFbGVtZW50QnlJZChcImVlLWV4cG9ydFwiKVxuICAgID8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHZvaWQgZXhwb3J0U2V0dGluZ3MoKSlcblxuICBkb2N1bWVudFxuICAgIC5nZXRFbGVtZW50QnlJZChcImVlLXJlc2V0XCIpXG4gICAgPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY29uZmlybVJlc2V0U2V0dGluZ3MpXG59XG5cbmZ1bmN0aW9uIHJlbG9hZFNldHRpbmdzKCk6IHZvaWQge1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxEaXZFbGVtZW50PihcIi5hY2NvdW50LWVlLWJsb2NcIik/LnJlbW92ZSgpXG4gIGxvYWRTZXR0aW5ncygpXG59XG5cbmZ1bmN0aW9uIGltcG9ydFNldHRpbmdzKCk6IHZvaWQge1xuICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKVxuICBpbnB1dC5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwiZmlsZVwiKVxuICBpbnB1dC5zZXRBdHRyaWJ1dGUoXCJhY2NlcHRcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpXG4gIGlucHV0LmNsaWNrKClcblxuICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgZXZlbnQgPT4ge1xuICAgIGlmICghZXZlbnQudGFyZ2V0KSByZXR1cm5cbiAgICBjb25zdCBmaWxlcyA9IChldmVudC50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCkuZmlsZXNcbiAgICBpZiAoIWZpbGVzKSByZXR1cm5cbiAgICBjb25zdCBmaWxlID0gZmlsZXNbMF1cbiAgICBpZiAoIWZpbGUpIHJldHVyblxuICAgIHZvaWQgZmlsZS50ZXh0KCkudGhlbihhc3luYyB2YWx1ZSA9PiB7XG4gICAgICBpZiAoIXZhbHVlKSByZXR1cm5cblxuICAgICAgY29uc3QgcGFyc2VkOiBTZXR0aW5ncyA9IEpTT04ucGFyc2UodmFsdWUpXG4gICAgICBhd2FpdCBMb2NhbFN0b3JhZ2Uuc2V0U2V0dGluZ3MocGFyc2VkKVxuXG4gICAgICByZWxvYWRTZXR0aW5ncygpXG4gICAgICAkLmZsYXZyTm90aWYodHJhbnNsYXRlLmFjY291bnQuaW1wb3J0ZWQpXG4gICAgfSlcbiAgfSlcbn1cblxuYXN5bmMgZnVuY3Rpb24gZXhwb3J0U2V0dGluZ3MoKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IGhyZWYgPVxuICAgIFwiZGF0YTp0ZXh0L2pzb247Y2hhcnNldD11dGYtOCxcIiArXG4gICAgZW5jb2RlVVJJQ29tcG9uZW50KFxuICAgICAgSlNPTi5zdHJpbmdpZnkoYXdhaXQgTG9jYWxTdG9yYWdlLmdldFNldHRpbmdzKCksIG51bGwsIDIpXG4gICAgKVxuXG4gIGNvbnN0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKVxuICBhLnNldEF0dHJpYnV0ZShcImhyZWZcIiwgaHJlZilcbiAgYS5zZXRBdHRyaWJ1dGUoXG4gICAgXCJkb3dubG9hZFwiLFxuICAgIGAke2dldE5hbWUoKSA/PyBcImVsZGFyeWEtZW5oYW5jZW1lbnRzXCJ9LXNldHRpbmdzLmpzb25gXG4gIClcbiAgYS5jbGljaygpXG59XG5cbmZ1bmN0aW9uIGNvbmZpcm1SZXNldFNldHRpbmdzKCk6IHZvaWQge1xuICBjb25zdCB0ZW1wbGF0ZTogVGVtcGxhdGUgPSByZXF1aXJlKFwiLi4vdGVtcGxhdGVzL2h0bWwvY29uZmlybV9yZXNldF9zZXR0aW5ncy5odG1sXCIpXG4gIGNvbnN0IHJlbmRlcmVkID0gdGVtcGxhdGUucmVuZGVyKHsgdHJhbnNsYXRlIH0pXG5cbiAgJC5mbGF2cih7XG4gICAgY29udGVudDogcmVuZGVyZWQsXG4gICAgZGlhbG9nOiBcImNvbmZpcm1cIixcbiAgICBidXR0b25zOiB7XG4gICAgICBjbG9zZTogeyBzdHlsZTogXCJjbG9zZVwiIH0sXG4gICAgICBjYW5jZWw6IHtcbiAgICAgICAgdGV4dDogdHJhbnNsYXRlLmFjY291bnQuY2FuY2VsLFxuICAgICAgICBhY3Rpb246ICgpID0+IHRydWUsXG4gICAgICB9LFxuICAgICAgY29uZmlybToge1xuICAgICAgICB0ZXh0OiB0cmFuc2xhdGUuYWNjb3VudC5jb25maXJtLFxuICAgICAgICBhY3Rpb246ICgpID0+IHtcbiAgICAgICAgICB2b2lkIHJlc2V0U2V0dGluZ3MoKVxuICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgb25CdWlsZDogJGNvbnRhaW5lciA9PiB7XG4gICAgICAkY29udGFpbmVyLmFkZENsYXNzKFwibmV3LWxheW91dC1wb3B1cCB2YWNhdGlvblwiKVxuICAgIH0sXG4gIH0pXG59XG5cbmFzeW5jIGZ1bmN0aW9uIHJlc2V0U2V0dGluZ3MoKTogUHJvbWlzZTx2b2lkPiB7XG4gIGF3YWl0IExvY2FsU3RvcmFnZS5yZXNldFNldHRpbmdzKClcbiAgcGFnZUxvYWQobG9jYXRpb24ucGF0aG5hbWUpXG59XG4iLCJpbXBvcnQgdHlwZSB7IFRlbXBsYXRlIH0gZnJvbSBcImhvZ2FuLmpzXCJcbmltcG9ydCB7IHRyYW5zbGF0ZSB9IGZyb20gXCIuLi9pMThuL3RyYW5zbGF0ZVwiXG5pbXBvcnQgeyBMb2NhbFN0b3JhZ2UgfSBmcm9tIFwiLi4vbG9jYWxfc3RvcmFnZS9sb2NhbF9zdG9yYWdlXCJcbmltcG9ydCB7IFNlc3Npb25TdG9yYWdlIH0gZnJvbSBcIi4uL3Nlc3Npb25fc3RvcmFnZS9zZXNzaW9uX3N0b3JhZ2VcIlxuaW1wb3J0IHsgdG9nZ2xlVGFrZW92ZXIgfSBmcm9tIFwiLi4vdGFrZW92ZXIvYnJhaW5cIlxuXG5leHBvcnQgZnVuY3Rpb24gbG9hZFRvcEJhcigpOiB2b2lkIHtcbiAgY29uc3QgaGVhZGVyUmlnaHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhlYWRlci1yaWdodFwiKVxuICBpZiAoIWhlYWRlclJpZ2h0KSByZXR1cm5cblxuICBjb25zdCBoZWFkZXJUYWtlb3ZlciA9IGhlYWRlclJpZ2h0LnF1ZXJ5U2VsZWN0b3IoXCIjaGVhZGVyLXRha2VvdmVyXCIpXG4gIGlmIChoZWFkZXJUYWtlb3ZlcikgaGVhZGVyVGFrZW92ZXIucmVtb3ZlKClcbiAgZWxzZSBsb2FkTGlua3MoKVxuXG4gIGlmIChcbiAgICAoTG9jYWxTdG9yYWdlLm1pbmlnYW1lcyB8fFxuICAgICAgTG9jYWxTdG9yYWdlLmV4cGxvcmF0aW9ucyB8fFxuICAgICAgTG9jYWxTdG9yYWdlLm1hcmtldCkgJiZcbiAgICBMb2NhbFN0b3JhZ2UudW5sb2NrZWRcbiAgKSB7XG4gICAgY29uc3QgdGVtcGxhdGU6IFRlbXBsYXRlID0gcmVxdWlyZShcIi4uL3RlbXBsYXRlcy9odG1sL2hlYWRlcl90YWtlb3Zlci5odG1sXCIpXG4gICAgaGVhZGVyUmlnaHQuaW5zZXJ0QWRqYWNlbnRIVE1MKFxuICAgICAgXCJhZnRlcmJlZ2luXCIsXG4gICAgICB0ZW1wbGF0ZS5yZW5kZXIoeyB0YWtlb3ZlcjogU2Vzc2lvblN0b3JhZ2UudGFrZW92ZXIsIHRyYW5zbGF0ZSB9KVxuICAgIClcblxuICAgIGhlYWRlclJpZ2h0XG4gICAgICAucXVlcnlTZWxlY3RvcihcIiNoZWFkZXItdGFrZW92ZXJcIilcbiAgICAgID8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRvZ2dsZVRha2VvdmVyKVxuICB9XG59XG5cbmZ1bmN0aW9uIGxvYWRMaW5rcygpOiB2b2lkIHtcbiAgY29uc3QgaGVhZGVyUHJvZmlsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaGVhZGVyLXByb2ZpbGVcIik/LmZpcnN0Q2hpbGRcbiAgaWYgKGhlYWRlclByb2ZpbGU/LnRleHRDb250ZW50KSB7XG4gICAgY29uc3QgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpXG4gICAgYS5ocmVmID0gXCIvcGxheWVyL3Byb2ZpbGVcIlxuICAgIGEuc3R5bGUuY29sb3IgPSBcInZhcigtLXRleHQtY29sb3IpXCJcbiAgICBhLnN0eWxlLmZvbnRGYW1pbHkgPSAnXCJBbGVncmV5YSBTYW5zXCIsIHNhbnMtc2VyaWYnXG4gICAgYS5zdHlsZS5mb250V2VpZ2h0ID0gXCJ1bnNldFwiXG4gICAgYS50ZXh0Q29udGVudCA9IGhlYWRlclByb2ZpbGUudGV4dENvbnRlbnQudHJpbSgpXG5cbiAgICBjb25zdCBwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIilcbiAgICBwLmluc2VydEFkamFjZW50RWxlbWVudChcImJlZm9yZWVuZFwiLCBhKVxuXG4gICAgaGVhZGVyUHJvZmlsZS5yZXBsYWNlV2l0aChwKVxuICB9XG5cbiAgY29uc3QgYXZhdGFyVGl0bGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2F2YXRhci1tZW51LWNvbnRhaW5lci1vdXRlcj5wXCIpXG4gIGlmIChhdmF0YXJUaXRsZT8udGV4dENvbnRlbnQpXG4gICAgYXZhdGFyVGl0bGUuaW5uZXJIVE1MID0gYDxhIGhyZWY9XCIvcGxheWVyL3Byb2ZpbGVcIiBzdHlsZT1cImNvbG9yOiAjRkZGRkZGOyBmb250LXNpemU6IDIzcHg7IGZvbnQtd2VpZ2h0OiA5MDA7IHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XCI+JHthdmF0YXJUaXRsZS50ZXh0Q29udGVudC50cmltKCl9PC9hPmBcblxuICBkb2N1bWVudFxuICAgIC5xdWVyeVNlbGVjdG9yKFwiI2F2YXRhci1tZW51LWNvbnRhaW5lcj5jYW52YXNcIilcbiAgICA/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiBwYWdlTG9hZChcIi9wbGF5ZXIvYXBwZWFyYW5jZVwiKSlcbn1cbiIsImltcG9ydCB0eXBlIHsgVGVtcGxhdGUgfSBmcm9tIFwiaG9nYW4uanNcIlxuaW1wb3J0IHsgQ29uc29sZSB9IGZyb20gXCIuLi9jb25zb2xlXCJcbmltcG9ydCB7IHRyYW5zbGF0ZSB9IGZyb20gXCIuLi9pMThuL3RyYW5zbGF0ZVwiXG5pbXBvcnQgeyBMb2NhbFN0b3JhZ2UgfSBmcm9tIFwiLi4vbG9jYWxfc3RvcmFnZS9sb2NhbF9zdG9yYWdlXCJcbmltcG9ydCB0eXBlIHsgV2lzaGxpc3RTZXR0aW5ncyB9IGZyb20gXCIuLi90ZW1wbGF0ZXMvaW50ZXJmYWNlcy93aXNobGlzdF9zZXR0aW5nc1wiXG5cbmV4cG9ydCBmdW5jdGlvbiBsb2FkV2lzaGxpc3QoKTogdm9pZCB7XG4gIGNvbnN0IG1hcmtldHBsYWNlTWVudSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFya2V0cGxhY2UtbWVudVwiKVxuICBpZiAoIW1hcmtldHBsYWNlTWVudSkgcmV0dXJuXG5cbiAgaWYgKCFtYXJrZXRwbGFjZU1lbnUucXVlcnlTZWxlY3RvcihcIiN3aXNobGlzdC1idXR0b25cIikpIHtcbiAgICBmb3IgKGNvbnN0IGEgb2YgbWFya2V0cGxhY2VNZW51LnF1ZXJ5U2VsZWN0b3JBbGwoXCJhXCIpKSB7XG4gICAgICBhLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PlxuICAgICAgICBwYWdlTG9hZChhLmhyZWYsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHRydWUpXG4gICAgICApXG4gICAgfVxuICB9XG5cbiAgbWFya2V0cGxhY2VNZW51LnF1ZXJ5U2VsZWN0b3IoXCIjd2lzaGxpc3QtYnV0dG9uXCIpPy5yZW1vdmUoKVxuICBjb25zdCB3aXNobGlzdEJ1dHRvblRlbXBsYXRlOiBUZW1wbGF0ZSA9IHJlcXVpcmUoXCIuLi90ZW1wbGF0ZXMvaHRtbC93aXNobGlzdF9idXR0b24uaHRtbFwiKVxuICBtYXJrZXRwbGFjZU1lbnUuaW5zZXJ0QWRqYWNlbnRIVE1MKFxuICAgIFwiYmVmb3JlZW5kXCIsXG4gICAgd2lzaGxpc3RCdXR0b25UZW1wbGF0ZS5yZW5kZXIoeyB0cmFuc2xhdGUgfSlcbiAgKVxuXG4gIG1hcmtldHBsYWNlTWVudVxuICAgIC5xdWVyeVNlbGVjdG9yPEhUTUxBbmNob3JFbGVtZW50PihcIiN3aXNobGlzdC1idXR0b25cIilcbiAgICA/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBpbnNlcnRXaXNobGlzdClcbn1cblxuZnVuY3Rpb24gaW5zZXJ0V2lzaGxpc3QoKTogdm9pZCB7XG4gIC8vIEFzc2lzdGFuY2VcbiAgY29uc3QgYXNzaXN0YW5jZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWFya2V0cGxhY2UtYXNzaXN0YW5jZVwiKVxuICBpZiAoYXNzaXN0YW5jZSkgYXNzaXN0YW5jZS5pbm5lckhUTUwgPSB0cmFuc2xhdGUubWFya2V0Lndpc2hsaXN0LmFzc2lzdGFuY2VcblxuICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxBbmNob3JFbGVtZW50PihcIiN3aXNobGlzdC1idXR0b25cIilcbiAgaWYgKCFidXR0b24pIHJldHVybiBDb25zb2xlLmVycm9yKFwiV2lzaGxpc3QgYnV0dG9uIG5vdCBmb3VuZFwiLCBidXR0b24pXG5cbiAgLy8gTWVudVxuICBkb2N1bWVudFxuICAgIC5xdWVyeVNlbGVjdG9yKFwiI21hcmtldHBsYWNlLW1lbnUgLmFjdGl2ZVwiKVxuICAgID8uY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKVxuICBidXR0b24uY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKVxuXG4gIC8vIEZpbHRlcnNcbiAgY29uc3QgZmlsdGVycyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFya2V0cGxhY2UtZmlsdGVyc1wiKVxuICBpZiAoZmlsdGVycykgZmlsdGVycy5pbm5lckhUTUwgPSBcIlwiXG5cbiAgLy8gQ29udGVudFxuICBjb25zdCB3aXNobGlzdFRlbXBsYXRlOiBUZW1wbGF0ZSA9IHJlcXVpcmUoXCIuLi90ZW1wbGF0ZXMvaHRtbC93aXNobGlzdF9zZXR0aW5ncy5odG1sXCIpXG4gIGNvbnN0IGNvbnRhaW5lciA9XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tYXJrZXRwbGFjZS1jb250YWluZXJcIikgPz9cbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1hcmtldHBsYWNlLWFjdGl2ZS1hdWN0aW9uc1wiKSA/P1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFya2V0cGxhY2UtaXRlbXNGb3JTYWxlXCIpXG4gIGlmICghY29udGFpbmVyKVxuICAgIHJldHVybiBDb25zb2xlLmVycm9yKFwiVGhlIHdpc2hsaXN0IGNhbm5vdCBiZSBwbGFjZWRcIiwgY29udGFpbmVyKVxuXG4gIGNvbnN0IHdpc2hsaXN0Q29udGV4dDogV2lzaGxpc3RTZXR0aW5ncyA9IHtcbiAgICB3aXNobGlzdDogTG9jYWxTdG9yYWdlLndpc2hsaXN0LFxuICB9XG4gIGNvbnRhaW5lci5pbm5lckhUTUwgPSB3aXNobGlzdFRlbXBsYXRlLnJlbmRlcih7XG4gICAgLi4ud2lzaGxpc3RDb250ZXh0LFxuICAgIHRyYW5zbGF0ZSxcbiAgfSlcblxuICAvLyBCdXR0b25zXG4gIGZvciAoY29uc3QgdHIgb2YgY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0clwiKSkge1xuICAgIGNvbnN0IGljb24gPSB0ci5kYXRhc2V0Lmljb25cbiAgICBpZiAoIWljb24pIGNvbnRpbnVlXG5cbiAgICAvLyBSZXNldCBzdGF0dXNcbiAgICBjb25zdCByZXNldCA9IHRyLnF1ZXJ5U2VsZWN0b3IoXCIucmVzZXQtaXRlbS1zdGF0dXNcIilcbiAgICBpZiAocmVzZXQpXG4gICAgICByZXNldC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICByZXNldFN0YXR1cyhpY29uKVxuICAgICAgICBpbnNlcnRXaXNobGlzdCgpXG4gICAgICB9KVxuXG4gICAgLy8gRGVsZXRlIGl0ZW0gZnJvbSB3aXNobGlzdFxuICAgIGNvbnN0IGRlbGV0ZUJ1dHRvbiA9IHRyLnF1ZXJ5U2VsZWN0b3IoXCIuZGVsZXRlLXdpc2hsaXN0LWl0ZW1cIilcbiAgICBpZiAoZGVsZXRlQnV0dG9uKVxuICAgICAgZGVsZXRlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIGRlbGV0ZUl0ZW0oaWNvbilcbiAgICAgICAgaW5zZXJ0V2lzaGxpc3QoKVxuICAgICAgfSlcblxuICAgIC8vIENoYW5nZSBwcmljZVxuICAgIGNvbnN0IGVkaXRQcmljZSA9IHRyLnF1ZXJ5U2VsZWN0b3IoXCIuZWRpdC1wcmljZVwiKVxuICAgIGlmIChlZGl0UHJpY2UpXG4gICAgICBlZGl0UHJpY2UuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgXCJjbGlja1wiLFxuICAgICAgICAoKSA9PiB2b2lkIGNoYW5nZVByaWNlKGljb24pLnRoZW4oaW5zZXJ0V2lzaGxpc3QpXG4gICAgICApXG4gIH1cblxuICAvLyBSZXNldCBzdGF0dXNlc1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnJlc2V0LWFsbFwiKT8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHJlc2V0U3RhdHVzZXMpXG59XG5cbmZ1bmN0aW9uIHJlc2V0U3RhdHVzKGljb246IHN0cmluZyk6IHZvaWQge1xuICBjb25zdCB3aXNobGlzdCA9IExvY2FsU3RvcmFnZS53aXNobGlzdFxuICBjb25zdCBpbmRleCA9IHdpc2hsaXN0LmZpbmRJbmRleChpdGVtID0+IGl0ZW0uaWNvbiA9PT0gaWNvbilcbiAgY29uc3QgZW50cnkgPSB3aXNobGlzdFtpbmRleF1cbiAgaWYgKCFlbnRyeSkgcmV0dXJuXG5cbiAgZGVsZXRlIGVudHJ5LmVycm9yXG4gIExvY2FsU3RvcmFnZS53aXNobGlzdCA9IFtcbiAgICAuLi53aXNobGlzdC5zbGljZSh1bmRlZmluZWQsIGluZGV4KSxcbiAgICBlbnRyeSxcbiAgICAuLi53aXNobGlzdC5zbGljZShpbmRleCArIDEsIHVuZGVmaW5lZCksXG4gIF1cbn1cblxuZnVuY3Rpb24gZGVsZXRlSXRlbShpY29uOiBzdHJpbmcpOiB2b2lkIHtcbiAgTG9jYWxTdG9yYWdlLndpc2hsaXN0ID0gTG9jYWxTdG9yYWdlLndpc2hsaXN0LmZpbHRlcihcbiAgICBpdGVtID0+IGl0ZW0uaWNvbiAhPT0gaWNvblxuICApXG59XG5cbmFzeW5jIGZ1bmN0aW9uIGNoYW5nZVByaWNlKGljb246IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCB0ZW1wbGF0ZTogVGVtcGxhdGUgPSByZXF1aXJlKFwiLi4vdGVtcGxhdGVzL2h0bWwvY2hhbmdlX3ByaWNlX2ZsYXZyLmh0bWxcIilcblxuICBjb25zdCB3aXNobGlzdCA9IExvY2FsU3RvcmFnZS53aXNobGlzdFxuICBjb25zdCBpbmRleCA9IHdpc2hsaXN0LmZpbmRJbmRleChpdGVtID0+IGl0ZW0uaWNvbiA9PT0gaWNvbilcbiAgY29uc3QgZW50cnkgPSB3aXNobGlzdFtpbmRleF1cbiAgaWYgKCFlbnRyeSkgcmV0dXJuXG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICQuZmxhdnIoe1xuICAgICAgY29udGVudDogdGVtcGxhdGUucmVuZGVyKHsgdHJhbnNsYXRlIH0pLFxuICAgICAgZGlhbG9nOiBcInByb21wdFwiLFxuICAgICAgcHJvbXB0OiB7XG4gICAgICAgIHZhbHVlOiBlbnRyeS5wcmljZS50b1N0cmluZygpLFxuICAgICAgfSxcbiAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgY2xvc2U6IHtcbiAgICAgICAgICBzdHlsZTogXCJjbG9zZVwiLFxuICAgICAgICAgIGFjdGlvbjogKCkgPT4ge1xuICAgICAgICAgICAgcmVzb2x2ZSgpXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHNhdmU6IHtcbiAgICAgICAgICBhY3Rpb246ICgpID0+IHNhdmUoaWNvbiwgcmVzb2x2ZSksXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgb25CdWlsZDogJGNvbnRhaW5lciA9PiB7XG4gICAgICAgICRjb250YWluZXIuYWRkQ2xhc3MoXCJuZXctbGF5b3V0LXBvcHVwXCIpXG5cbiAgICAgICAgZG9jdW1lbnRcbiAgICAgICAgICAucXVlcnlTZWxlY3RvcjxIVE1MSW5wdXRFbGVtZW50PihcIi5mbGF2ci1wcm9tcHRcIilcbiAgICAgICAgICA/LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCAoeyBrZXkgfSkgPT4ge1xuICAgICAgICAgICAgaWYgKGtleSAhPT0gXCJFbnRlclwiKSByZXR1cm5cbiAgICAgICAgICAgIHNhdmUoaWNvbiwgcmVzb2x2ZSlcbiAgICAgICAgICB9KVxuICAgICAgfSxcbiAgICB9KVxuICB9KVxufVxuXG5mdW5jdGlvbiBzYXZlKGljb246IHN0cmluZywgcmVzb2x2ZTogKCkgPT4gdm9pZCk6IGJvb2xlYW4ge1xuICBjb25zdCB3aXNobGlzdCA9IExvY2FsU3RvcmFnZS53aXNobGlzdFxuICBjb25zdCBpbmRleCA9IHdpc2hsaXN0LmZpbmRJbmRleChpdGVtID0+IGl0ZW0uaWNvbiA9PT0gaWNvbilcbiAgY29uc3QgZW50cnkgPSB3aXNobGlzdFtpbmRleF1cbiAgaWYgKCFlbnRyeSkgcmV0dXJuIGZhbHNlXG5cbiAgY29uc3QgcHJpY2UgPSBOdW1iZXIoXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MSW5wdXRFbGVtZW50PihcIi5mbGF2ci1wcm9tcHRcIik/LnZhbHVlLnRyaW0oKVxuICApXG4gIGlmICghcHJpY2UgfHwgcHJpY2UgPD0gMCkge1xuICAgICQuZmxhdnJOb3RpZih0cmFuc2xhdGUubWFya2V0LmNoYW5nZV9wcmljZS5pbnZhbGlkX3ByaWNlKVxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgZW50cnkucHJpY2UgPSBwcmljZVxuICBMb2NhbFN0b3JhZ2Uud2lzaGxpc3QgPSBbXG4gICAgLi4ud2lzaGxpc3Quc2xpY2UodW5kZWZpbmVkLCBpbmRleCksXG4gICAgZW50cnksXG4gICAgLi4ud2lzaGxpc3Quc2xpY2UoaW5kZXggKyAxLCB1bmRlZmluZWQpLFxuICBdXG5cbiAgY29uc3QgdGVtcGxhdGU6IFRlbXBsYXRlID0gcmVxdWlyZShcIi4uL3RlbXBsYXRlcy9odG1sL2ZsYXZyX25vdGlmL2ljb25fbWVzc2FnZS5odG1sXCIpXG4gICQuZmxhdnJOb3RpZihcbiAgICB0ZW1wbGF0ZS5yZW5kZXIoe1xuICAgICAgLi4uZW50cnksXG4gICAgICBtZXNzYWdlOiB0cmFuc2xhdGUubWFya2V0LmNoYW5nZV9wcmljZS5jaGFuZ2VkX3ByaWNlKFxuICAgICAgICBlbnRyeS5uYW1lLFxuICAgICAgICBlbnRyeS5wcmljZVxuICAgICAgKSxcbiAgICB9KVxuICApXG5cbiAgcmVzb2x2ZSgpXG4gIHJldHVybiB0cnVlXG59XG5cbmZ1bmN0aW9uIHJlc2V0U3RhdHVzZXMoKTogdm9pZCB7XG4gIExvY2FsU3RvcmFnZS53aXNobGlzdCA9IExvY2FsU3RvcmFnZS53aXNobGlzdC5tYXAoaXRlbSA9PiB7XG4gICAgZGVsZXRlIGl0ZW0uZXJyb3JcbiAgICByZXR1cm4gaXRlbVxuICB9KVxuXG4gIGluc2VydFdpc2hsaXN0KClcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBsb2FkRHJlc3NpbmdFeHBlcmllbmNlIH0gZnJvbSBcIi4vYXBwZWFyYW5jZS9kcmVzc2luZ19leHBlcmllbmNlXCJcbmltcG9ydCB7IGxvYWRDaGVhdENvZGVzIH0gZnJvbSBcIi4vY2hlYXRfY29kZXNcIlxuaW1wb3J0IHsgQ29uc29sZSB9IGZyb20gXCIuL2NvbnNvbGVcIlxuaW1wb3J0IHsgdHJhbnNsYXRlIH0gZnJvbSBcIi4vaTE4bi90cmFuc2xhdGVcIlxuaW1wb3J0IHsgbWlncmF0ZSB9IGZyb20gXCIuL21pZ3JhdGVcIlxuaW1wb3J0IHsgbG9hZFRha2VvdmVyIH0gZnJvbSBcIi4vdGFrZW92ZXIvYnJhaW5cIlxuaW1wb3J0IHsgbG9hZEF1Y3Rpb25zIH0gZnJvbSBcIi4vdWkvYXVjdGlvbnNcIlxuaW1wb3J0IHsgbG9hZENhcm91c2VsIH0gZnJvbSBcIi4vdWkvY2Fyb3VzZWxcIlxuaW1wb3J0IHsgbG9hZEZhdm91cml0ZXMgfSBmcm9tIFwiLi91aS9mYXZvdXJpdGVzXCJcbmltcG9ydCB7IGxvYWRIb21lQ29udGVudCB9IGZyb20gXCIuL3VpL2hvbWVfY29udGVudFwiXG5pbXBvcnQgeyBsb2FkTWFsbCB9IGZyb20gXCIuL3VpL21hbGxcIlxuaW1wb3J0IHsgbG9hZE1hcmtldCB9IGZyb20gXCIuL3VpL21hcmtldFwiXG5pbXBvcnQgeyBsb2FkTWVudSB9IGZyb20gXCIuL3VpL21lbnVcIlxuaW1wb3J0IHsgbG9hZFBldCB9IGZyb20gXCIuL3VpL3BldFwiXG5pbXBvcnQgeyBsb2FkUHJvZmlsZSB9IGZyb20gXCIuL3VpL3Byb2ZpbGVcIlxuaW1wb3J0IHsgbG9hZFB1cnJvU2hvcCB9IGZyb20gXCIuL3VpL3B1cnJvX3Nob3BcIlxuaW1wb3J0IHsgbG9hZFNldHRpbmdzIH0gZnJvbSBcIi4vdWkvc2V0dGluZ3NcIlxuaW1wb3J0IHsgbG9hZFRvcEJhciB9IGZyb20gXCIuL3VpL3RvcF9iYXJcIlxuaW1wb3J0IHsgbG9hZFdpc2hsaXN0IH0gZnJvbSBcIi4vdWkvd2lzaGxpc3RcIlxuXG4vLyBsb2FkSlMoXCJodHRwczovL3VucGtnLmNvbS9ob2dhbi5qcy9kaXN0L3RlbXBsYXRlLTMuMC4yLm1pbi5qc1wiLCB0cnVlKTtcblxuZnVuY3Rpb24gbG9hZCgpOiB2b2lkIHtcbiAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb250YWluZXJcIilcbiAgaWYgKCFjb250YWluZXIpIHtcbiAgICAkLmZsYXZyTm90aWYodHJhbnNsYXRlLmVycm9yLmxvbmdMb2FkaW5nKVxuICAgIENvbnNvbGUuZXJyb3IoXCIjY29udGFpbmVyIGNvdWxkbid0IGJlIGZvdW5kOlwiLCBjb250YWluZXIpXG4gICAgcmV0dXJuIHZvaWQgc2V0VGltZW91dChsb2FkLCAxMF8wMDApXG4gIH1cblxuICBtaWdyYXRlKClcbiAgbG9hZFVJKClcbiAgb2JzZXJ2ZSgpXG5cbiAgQ29uc29sZS5sb2coYCR7R00uaW5mby5zY3JpcHQubmFtZX0gdiR7R00uaW5mby5zY3JpcHQudmVyc2lvbn0gbG9hZGVkLmApXG4gIGxvYWRUYWtlb3ZlcigpXG59XG5cbmZ1bmN0aW9uIGxvYWRVSSgpOiB2b2lkIHtcbiAgbG9hZE1lbnUoKVxuICBsb2FkQ2Fyb3VzZWwoKVxuICBsb2FkSG9tZUNvbnRlbnQoKVxuICBsb2FkRmF2b3VyaXRlcygpXG4gIGxvYWRQcm9maWxlKClcbiAgbG9hZFBldCgpXG4gIGxvYWRNYXJrZXQoKVxuICBsb2FkV2lzaGxpc3QoKVxuICBsb2FkVG9wQmFyKClcbiAgbG9hZEF1Y3Rpb25zKClcbiAgbG9hZFB1cnJvU2hvcCgpXG4gIGxvYWRNYWxsKClcbiAgbG9hZENoZWF0Q29kZXMoKVxuICBsb2FkU2V0dGluZ3MoKVxuXG4gIC8vIEVsZGFyeWEgaXMgY3Jhc2hpbmcgd2hlbiBvcGVuaW5nIGdyb3Vwcy5cbiAgLy8gVE9ETzogSGFuZGxlIGVycm9ycyBhbmQgc3RvcCB0aGUgbG9hZGluZyBwcm9jZXNzLlxuICB2b2lkIGxvYWREcmVzc2luZ0V4cGVyaWVuY2UoKVxufVxuXG5mdW5jdGlvbiBvYnNlcnZlKCk6IHZvaWQge1xuICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbnRhaW5lclwiKVxuICBuZXcgTXV0YXRpb25PYnNlcnZlcihyZWxvYWQpLm9ic2VydmUoY29udGFpbmVyIGFzIE5vZGUsIHsgY2hpbGRMaXN0OiB0cnVlIH0pXG59XG5cbmZ1bmN0aW9uIHJlbG9hZCgpOiB2b2lkIHtcbiAgbG9hZFVJKClcbiAgbG9hZFRha2VvdmVyKClcbn1cblxuQ29uc29sZS5sb2coXCJMb2FkaW5nLi4uXCIpXG5pZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJjb21wbGV0ZVwiKSBsb2FkKClcbmVsc2Ugd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsICgpID0+IGxvYWQoKSlcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==