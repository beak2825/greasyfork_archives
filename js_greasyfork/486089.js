// ==UserScript==
// @name          whatwg-mimetype-umd
// @namespace     flomk.userscripts
// @version       4.0.0
// @description   Code - github/jsdom/whatwg-mimetype
// @match         *
// @license       MIT
// ==/UserScript==

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.whatwgMimetype = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
    "use strict";
    const {
      asciiLowercase,
      solelyContainsHTTPTokenCodePoints,
      soleyContainsHTTPQuotedStringTokenCodePoints
    } = require("./utils.js");
    
    module.exports = class MIMETypeParameters {
      constructor(map) {
        this._map = map;
      }
    
      get size() {
        return this._map.size;
      }
    
      get(name) {
        name = asciiLowercase(String(name));
        return this._map.get(name);
      }
    
      has(name) {
        name = asciiLowercase(String(name));
        return this._map.has(name);
      }
    
      set(name, value) {
        name = asciiLowercase(String(name));
        value = String(value);
    
        if (!solelyContainsHTTPTokenCodePoints(name)) {
          throw new Error(`Invalid MIME type parameter name "${name}": only HTTP token code points are valid.`);
        }
        if (!soleyContainsHTTPQuotedStringTokenCodePoints(value)) {
          throw new Error(`Invalid MIME type parameter value "${value}": only HTTP quoted-string token code points are ` +
                          `valid.`);
        }
    
        return this._map.set(name, value);
      }
    
      clear() {
        this._map.clear();
      }
    
      delete(name) {
        name = asciiLowercase(String(name));
        return this._map.delete(name);
      }
    
      forEach(callbackFn, thisArg) {
        this._map.forEach(callbackFn, thisArg);
      }
    
      keys() {
        return this._map.keys();
      }
    
      values() {
        return this._map.values();
      }
    
      entries() {
        return this._map.entries();
      }
    
      [Symbol.iterator]() {
        return this._map[Symbol.iterator]();
      }
    };
    
    },{"./utils.js":4}],2:[function(require,module,exports){
    "use strict";
    const {
      removeLeadingAndTrailingHTTPWhitespace,
      removeTrailingHTTPWhitespace,
      isHTTPWhitespaceChar,
      solelyContainsHTTPTokenCodePoints,
      soleyContainsHTTPQuotedStringTokenCodePoints,
      asciiLowercase,
      collectAnHTTPQuotedString
    } = require("./utils.js");
    
    module.exports = input => {
      input = removeLeadingAndTrailingHTTPWhitespace(input);
    
      let position = 0;
      let type = "";
      while (position < input.length && input[position] !== "/") {
        type += input[position];
        ++position;
      }
    
      if (type.length === 0 || !solelyContainsHTTPTokenCodePoints(type)) {
        return null;
      }
    
      if (position >= input.length) {
        return null;
      }
    
      // Skips past "/"
      ++position;
    
      let subtype = "";
      while (position < input.length && input[position] !== ";") {
        subtype += input[position];
        ++position;
      }
    
      subtype = removeTrailingHTTPWhitespace(subtype);
    
      if (subtype.length === 0 || !solelyContainsHTTPTokenCodePoints(subtype)) {
        return null;
      }
    
      const mimeType = {
        type: asciiLowercase(type),
        subtype: asciiLowercase(subtype),
        parameters: new Map()
      };
    
      while (position < input.length) {
        // Skip past ";"
        ++position;
    
        while (isHTTPWhitespaceChar(input[position])) {
          ++position;
        }
    
        let parameterName = "";
        while (position < input.length && input[position] !== ";" && input[position] !== "=") {
          parameterName += input[position];
          ++position;
        }
        parameterName = asciiLowercase(parameterName);
    
        if (position < input.length) {
          if (input[position] === ";") {
            continue;
          }
    
          // Skip past "="
          ++position;
        }
    
        let parameterValue = null;
        if (input[position] === "\"") {
          [parameterValue, position] = collectAnHTTPQuotedString(input, position);
    
          while (position < input.length && input[position] !== ";") {
            ++position;
          }
        } else {
          parameterValue = "";
          while (position < input.length && input[position] !== ";") {
            parameterValue += input[position];
            ++position;
          }
    
          parameterValue = removeTrailingHTTPWhitespace(parameterValue);
    
          if (parameterValue === "") {
            continue;
          }
        }
    
        if (parameterName.length > 0 &&
            solelyContainsHTTPTokenCodePoints(parameterName) &&
            soleyContainsHTTPQuotedStringTokenCodePoints(parameterValue) &&
            !mimeType.parameters.has(parameterName)) {
          mimeType.parameters.set(parameterName, parameterValue);
        }
      }
    
      return mimeType;
    };
    
    },{"./utils.js":4}],3:[function(require,module,exports){
    "use strict";
    const { solelyContainsHTTPTokenCodePoints } = require("./utils.js");
    
    module.exports = mimeType => {
      let serialization = `${mimeType.type}/${mimeType.subtype}`;
    
      if (mimeType.parameters.size === 0) {
        return serialization;
      }
    
      for (let [name, value] of mimeType.parameters) {
        serialization += ";";
        serialization += name;
        serialization += "=";
    
        if (!solelyContainsHTTPTokenCodePoints(value) || value.length === 0) {
          value = value.replace(/(["\\])/ug, "\\$1");
          value = `"${value}"`;
        }
    
        serialization += value;
      }
    
      return serialization;
    };
    
    },{"./utils.js":4}],4:[function(require,module,exports){
    "use strict";
    
    exports.removeLeadingAndTrailingHTTPWhitespace = string => {
      return string.replace(/^[ \t\n\r]+/u, "").replace(/[ \t\n\r]+$/u, "");
    };
    
    exports.removeTrailingHTTPWhitespace = string => {
      return string.replace(/[ \t\n\r]+$/u, "");
    };
    
    exports.isHTTPWhitespaceChar = char => {
      return char === " " || char === "\t" || char === "\n" || char === "\r";
    };
    
    exports.solelyContainsHTTPTokenCodePoints = string => {
      return /^[-!#$%&'*+.^_`|~A-Za-z0-9]*$/u.test(string);
    };
    
    exports.soleyContainsHTTPQuotedStringTokenCodePoints = string => {
      return /^[\t\u0020-\u007E\u0080-\u00FF]*$/u.test(string);
    };
    
    exports.asciiLowercase = string => {
      return string.replace(/[A-Z]/ug, l => l.toLowerCase());
    };
    
    // This variant only implements it with the extract-value flag set.
    exports.collectAnHTTPQuotedString = (input, position) => {
      let value = "";
    
      position++;
    
      while (true) {
        while (position < input.length && input[position] !== "\"" && input[position] !== "\\") {
          value += input[position];
          ++position;
        }
    
        if (position >= input.length) {
          break;
        }
    
        const quoteOrBackslash = input[position];
        ++position;
    
        if (quoteOrBackslash === "\\") {
          if (position >= input.length) {
            value += "\\";
            break;
          }
    
          value += input[position];
          ++position;
        } else {
          break;
        }
      }
    
      return [value, position];
    };
    
    },{}],"whatwg-mimetype":[function(require,module,exports){
    "use strict";
    const MIMETypeParameters = require("./mime-type-parameters.js");
    const parse = require("./parser.js");
    const serialize = require("./serializer.js");
    const {
      asciiLowercase,
      solelyContainsHTTPTokenCodePoints
    } = require("./utils.js");
    
    module.exports = class MIMEType {
      constructor(string) {
        string = String(string);
        const result = parse(string);
        if (result === null) {
          throw new Error(`Could not parse MIME type string "${string}"`);
        }
    
        this._type = result.type;
        this._subtype = result.subtype;
        this._parameters = new MIMETypeParameters(result.parameters);
      }
    
      static parse(string) {
        try {
          return new this(string);
        } catch (e) {
          return null;
        }
      }
    
      get essence() {
        return `${this.type}/${this.subtype}`;
      }
    
      get type() {
        return this._type;
      }
    
      set type(value) {
        value = asciiLowercase(String(value));
    
        if (value.length === 0) {
          throw new Error("Invalid type: must be a non-empty string");
        }
        if (!solelyContainsHTTPTokenCodePoints(value)) {
          throw new Error(`Invalid type ${value}: must contain only HTTP token code points`);
        }
    
        this._type = value;
      }
    
      get subtype() {
        return this._subtype;
      }
    
      set subtype(value) {
        value = asciiLowercase(String(value));
    
        if (value.length === 0) {
          throw new Error("Invalid subtype: must be a non-empty string");
        }
        if (!solelyContainsHTTPTokenCodePoints(value)) {
          throw new Error(`Invalid subtype ${value}: must contain only HTTP token code points`);
        }
    
        this._subtype = value;
      }
    
      get parameters() {
        return this._parameters;
      }
    
      toString() {
        // The serialize function works on both "MIME type records" (i.e. the results of parse) and on this class, since
        // this class's interface is identical.
        return serialize(this);
      }
    
      isJavaScript({ prohibitParameters = false } = {}) {
        switch (this._type) {
          case "text": {
            switch (this._subtype) {
              case "ecmascript":
              case "javascript":
              case "javascript1.0":
              case "javascript1.1":
              case "javascript1.2":
              case "javascript1.3":
              case "javascript1.4":
              case "javascript1.5":
              case "jscript":
              case "livescript":
              case "x-ecmascript":
              case "x-javascript": {
                return !prohibitParameters || this._parameters.size === 0;
              }
              default: {
                return false;
              }
            }
          }
          case "application": {
            switch (this._subtype) {
              case "ecmascript":
              case "javascript":
              case "x-ecmascript":
              case "x-javascript": {
                return !prohibitParameters || this._parameters.size === 0;
              }
              default: {
                return false;
              }
            }
          }
          default: {
            return false;
          }
        }
      }
      isXML() {
        return (this._subtype === "xml" && (this._type === "text" || this._type === "application")) ||
               this._subtype.endsWith("+xml");
      }
      isHTML() {
        return this._subtype === "html" && this._type === "text";
      }
    };
    
    },{"./mime-type-parameters.js":1,"./parser.js":2,"./serializer.js":3,"./utils.js":4}]},{},[])("whatwg-mimetype")
});