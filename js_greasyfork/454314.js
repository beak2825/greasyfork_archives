// ==UserScript==
// @name         字节云日志查询不眼瞎
// @namespace    https://imnerd.org
// @version      0.11
// @description  对日志查询中输出的 JSON 字符串重新序列化带换行版，看日志再也不痛苦啦！
// @author       lizheming
// @match        cloud.bytedance.net/argos/*
// @match        cloud-boe.bytedance.net/argos/*
// @match        cloud-hl.bytedance.net/argos/*
// @match        cloud-i18n.bytedance.net/argos/*
// @match        cloud.tiktok-usts.net/argos/*
// @match        cloud-ttp-us.bytedance.net/argos/*
// @icon         data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTI4cHgiIGhlaWdodD0iMTI4cHgiIHZpZXdCb3g9IjAgMCAxMjggMTI4IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCA1Ny4xICg4MzA4OCkgLSBodHRwczovL3NrZXRjaC5jb20gLS0+CiAgICA8dGl0bGU+5YiH54mHPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGcgaWQ9Iumhtemdoi0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0ieHRyYWNlLemTvui3r+i/vei4qiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoOS4wMDAwMDAsIDUuMDAwMDAwKSIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPHBhdGggZD0iTTgwLjY3NTY3NTcsNjEuODg4MTk4OCBDODIuOTQ1OTQ1OSw2NS40NjU4Mzg2IDg3LjE2MjE2MjIsNjcuODUwOTMxOCA5Mi4wMjcwMjY5LDY3Ljg1MDkzMTYgQzk5LjE2MjE2Miw2Ny44NTA5MzE2IDEwNSw2Mi40ODQ0NzIgMTA1LDU1LjkyNTQ2NTggQzEwNSw0OS4zNjY0NTk2IDk5LjE2MjE2MjIsNDQgOTIuMDI3MDI2OSw0NCBDODQuODkxODkxNyw0NCA3OS4wNTQwNTQsNDkuMzY2NDU5NiA3OS4wNTQwNTQsNTUuOTI1NDY1OCBDNzkuMDU0MDU0LDU2LjgxOTg3NTggNzkuMDU0MDU0LDU3LjcxNDI4NTcgNzkuMzc4Mzc4Myw1OC42MDg2OTU2IEw3MC42MjE2MjE1LDYyLjQ4NDQ3MiBDNjguMzUxMzUxMyw1OC45MDY4MzIyIDYzLjgxMDgxMDcsNTYuNTIxNzM5IDU4Ljk0NTk0NTgsNTUuOTI1NDY1OCBMNTguOTQ1OTQ1OCw2MS41OTAwNjIxIEw1NS4zNzgzNzg0LDYxLjU5MDA2MjEgTDU1LjM3ODM3ODQsNTUuOTI1NDY1OCBDNTAuNTEzNTEzNSw1Ni41MjE3MzkyIDQ2LjI5NzI5NzMsNTguOTA2ODMyMiA0NC4wMjcwMjcsNjIuMTg2MzM1NCBMMzQuNjIxNjIxNSw1OC4wMTI0MjIzIEwzMyw2MC45OTM3ODg5IEw0Mi40MDU0MDUzLDY1LjE2NzcwMTggQzQxLjc1Njc1NjYsNjYuOTU2NTIxNyA0MS40MzI0MzIzLDY4LjQ0NzIwNSA0MS40MzI0MzIzLDcwLjIzNjAyNDggQzQxLjQzMjQzMjMsNzIuMDI0ODQ0NyA0MS43NTY3NTY2LDczLjUxNTUyOCA0Mi40MDU0MDUzLDc1LjMwNDM0NzkgTDM1LjU5NDU5NDUsNzguMjg1NzE0MyBMMzMsNzkuNDc4MjYwOCBMMzQuNjIxNjIxNSw4Mi40NTk2Mjc0IEw0NC4wMjcwMjcsNzguMjg1NzE0MyBDNDUsNzkuNzc2Mzk3NiA0Ni4yOTcyOTcyLDgwLjk2ODk0NDEgNDcuOTE4OTE4OSw4Mi4xNjE0OTA3IEM1MC4xODkxODkxLDgzLjY1MjE3MzkgNTIuNzgzNzgzNyw4NC41NDY1ODM5IDU1LjM3ODM3ODQsODQuODQ0NzIwNSBMNTUuMzc4Mzc4NCw4MC4zNzI2NzA4IEw1OC45NDU5NDU4LDgwLjM3MjY3MDggTDU4Ljk0NTk0NTgsODUuMTQyODU3MiBDNjIuMTg5MTg5LDg0Ljg0NDcyMDYgNjUuNDMyNDMyNCw4My4zNTQwMzczIDY4LjAyNzAyNyw4MS4yNjcwODA3IEM2OSw4MC4zNzI2NzA4IDY5Ljk3Mjk3Myw3OS40NzgyNjA4IDcwLjYyMTYyMTUsNzguMjg1NzE0MyBMNzguNDA1NDA1Myw4MS44NjMzNTQxIEw3OS43MDI3MDI3LDgyLjQ1OTYyNzQgQzc5LjM3ODM3ODQsODMuMzU0MDM3MyA3OS4zNzgzNzg0LDgzLjk1MDMxMDcgNzkuMzc4Mzc4Myw4NC44NDQ3MjA1IEM3OS4zNzgzNzgzLDg4LjcyMDQ5NjggODIuOTQ1OTQ1OSw5MiA4Ny4xNjIxNjIxLDkyIEM5MS4zNzgzNzgyLDkyIDk0Ljk0NTk0NTgsODguNzIwNDk2OCA5NC45NDU5NDU4LDg0Ljg0NDcyMDUgQzk0Ljk0NTk0NTgsODAuOTY4OTQ0MSA5MS4wNTQwNTQsNzcuMzkxMzA0NCA4Ni41MTM1MTM1LDc3LjM5MTMwNDQgQzg0LjI0MzI0MzMsNzcuMzkxMzA0NCA4Mi4yOTcyOTczLDc4LjI4NTcxNDMgODEsNzkuNDc4MjYwOCBMNzEuNTk0NTk0NSw3NS4zMDQzNDc5IEM3MS45MTg5MTg4LDc1LjAwNjIxMTMgNzEuOTE4OTE4OCw3NC40MDk5Mzc5IDcxLjkxODkxODksNzMuODEzNjY0NiBDNzIuMjQzMjQzMiw3Mi42MjExMTgxIDcyLjU2NzU2NzYsNzEuNzI2NzA4MSA3Mi41Njc1Njc1LDcwLjUzNDE2MTQgQzcyLjU2NzU2NzUsNjkuMzQxNjE0OSA3Mi4yNDMyNDMyLDY4LjE0OTA2ODIgNzEuOTE4OTE4OSw2Ni45NTY1MjE3IEM3MS45MTg5MTg5LDY2LjY1ODM4NTEgNzEuNTk0NTk0Niw2Ni4wNjIxMTE4IDcxLjU5NDU5NDUsNjUuNzYzOTc1MiBMODAuNjc1Njc1Nyw2MS44ODgxOTg4IEw4MC42NzU2NzU3LDYxLjg4ODE5ODggWiIgaWQ9Iui3r+W+hCIgZmlsbD0iIzU5RTJENiI+PC9wYXRoPgogICAgICAgICAgICA8cGF0aCBkPSJNNTguODc1LDk4LjkwOTA5MDkgTDU4Ljg3NSw4OCBMNTUuNDM3NSw4OCBMNTUuNDM3NSw5OC45MDkwOTA5IEM1MC43NSw5OS41MTUxNTE2IDQ3LDEwMy40NTQ1NDUgNDcsMTA4LjMwMzAzIEM0NywxMTMuNDU0NTQ1IDUxLjM3NSwxMTggNTcsMTE4IEM2Mi4zMTI1LDExOCA2NywxMTMuNzU3NTc2IDY3LDEwOC4zMDMwMyBDNjYuNjg3NTAwMSwxMDMuNzU3NTc2IDYzLjI1LDk5LjgxODE4MTggNTguODc1LDk4LjkwOTA5MDkgTDU4Ljg3NSw5OC45MDkwOTA5IFoiIGlkPSLot6/lvoQiIGZpbGw9IiMxMkQyREEiPjwvcGF0aD4KICAgICAgICAgICAgPHBhdGggZD0iTTMwLjA3NDA3NDEsODEgTDE5LjQ4MTQ4MTUsODUuNTcxNDI4NiBDMTguMTk3NTMwOSw4NC4xNDI4NTcyIDE1Ljk1MDYxNzIsODMuMjg1NzE0MyAxMy43MDM3MDM3LDgzLjI4NTcxNDMgQzkuNTMwODY0MjUsODMuMjg1NzE0MyA2LDg2LjQyODU3MTUgNiw5MC4xNDI4NTcyIEM2LDkzLjg1NzE0MjggOS41MzA4NjQyNSw5NyAxMy43MDM3MDM3LDk3IEMxNy44NzY1NDMyLDk3IDIxLjQwNzQwNzQsOTMuODU3MTQyOCAyMS40MDc0MDc0LDkwLjE0Mjg1NzIgTDIxLjQwNzQwNzQsODguNzE0Mjg1NyBMMzIsODMuODU3MTQyOSBMMzAuMDc0MDc0MSw4MSBMMzAuMDc0MDc0MSw4MSBaIiBpZD0i6Lev5b6EIiBmaWxsPSIjMDBDMUNBIj48L3BhdGg+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0yMy4zMDA5NzA4LDU2IEwzMC40NDY2MDE5LDU5LjYgTDMyLDU2LjYgTDI0LjU0MzY4OTMsNTIuNjk5OTk5OSBDMjQuODU0MzY4OSw1MS43OTk5OTk5IDI0Ljg1NDM2ODksNTAuODk5OTk5OSAyNC44NTQzNjg5LDUwIEMyNC44NTQzNjg5LDQzLjQgMTkuMjYyMTM1OSwzOCAxMi40MjcxODQ1LDM4IEM1LjU5MjIzMzE0LDM4IDAsNDMuNCAwLDUwIEMwLDU2LjU5OTk5OTkgNS41OTIyMzI5OSw2MiAxMi40MjcxODQ1LDYyIEMxNy4wODczNzg3LDYyIDIxLjEyNjIxMzYsNTkuNiAyMy4zMDA5NzA4LDU2IEwyMy4zMDA5NzA4LDU2IFoiIGlkPSLot6/lvoQiIGZpbGw9IiMxRDhFRkEiPjwvcGF0aD4KICAgICAgICAgICAgPHBhdGggZD0iTTU1LjY5MDkwOTEsMzEuMDczNDQ2NCBMNTUuNjkwOTA5MSw1MCBMNTkuMjkwOTA5MSw1MCBMNTkuMjkwOTA5MSwzMS4wNzM0NDY0IEM2OC4xMjcyNzI3LDMwLjIyNTk4ODcgNzUsMjMuNzI4ODEzNiA3NSwxNS41MzY3MjMzIEM3NSw3LjA2MjE0Njk4IDY2LjgxODE4MTksMCA1NywwIEM0Ny4xODE4MTgzLDAgMzksNy4wNjIxNDY4NSAzOSwxNS41MzY3MjMzIEMzOS4zMjcyNzI3LDIzLjcyODgxMzcgNDYuNTI3MjcyOCwzMC4yMjU5ODg3IDU1LjY5MDkwOTEsMzEuMDczNDQ2NCBaIiBpZD0i6Lev5b6EIiBmaWxsPSIjMjM1MEE3Ij48L3BhdGg+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454314/%E5%AD%97%E8%8A%82%E4%BA%91%E6%97%A5%E5%BF%97%E6%9F%A5%E8%AF%A2%E4%B8%8D%E7%9C%BC%E7%9E%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/454314/%E5%AD%97%E8%8A%82%E4%BA%91%E6%97%A5%E5%BF%97%E6%9F%A5%E8%AF%A2%E4%B8%8D%E7%9C%BC%E7%9E%8E.meta.js
// ==/UserScript==
const JSONBigInt = (function () {
  var BigNumber = BigInt;

  // regexpxs extracted from
  // (c) BSD-3-Clause
  // https://github.com/fastify/secure-json-parse/graphs/contributors and https://github.com/hapijs/bourne/graphs/contributors

  const suspectProtoRx =
    /(?:_|\\u005[Ff])(?:_|\\u005[Ff])(?:p|\\u0070)(?:r|\\u0072)(?:o|\\u006[Ff])(?:t|\\u0074)(?:o|\\u006[Ff])(?:_|\\u005[Ff])(?:_|\\u005[Ff])/;
  const suspectConstructorRx =
    /(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)/;

  /*
      json_parse.js
      2012-06-20
      Public Domain.
      NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
      This file creates a json_parse function.
      During create you can (optionally) specify some behavioural switches
          require('json-bigint')(options)
              The optional options parameter holds switches that drive certain
              aspects of the parsing process:
              * options.strict = true will warn about duplicate-key usage in the json.
                The default (strict = false) will silently ignore those and overwrite
                values for keys that are in duplicate use.
      The resulting function follows this signature:
          json_parse(text, reviver)
              This method parses a JSON text to produce an object or array.
              It can throw a SyntaxError exception.
              The optional reviver parameter is a function that can filter and
              transform the results. It receives each of the keys and values,
              and its return value is used instead of the original value.
              If it returns what it received, then the structure is not modified.
              If it returns undefined then the member is deleted.
              Example:
              // Parse the text. Values that look like ISO date strings will
              // be converted to Date objects.
              myData = json_parse(text, function (key, value) {
                  var a;
                  if (typeof value === 'string') {
                      a =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                      if (a) {
                          return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                              +a[5], +a[6]));
                      }
                  }
                  return value;
              });
      This is a reference implementation. You are free to copy, modify, or
      redistribute.
      This code should be minified before deployment.
      See http://javascript.crockford.com/jsmin.html
      USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
      NOT CONTROL.
  */

  /*members "", "\"", "\/", "\\", at, b, call, charAt, f, fromCharCode,
      hasOwnProperty, message, n, name, prototype, push, r, t, text
  */

  var json_parse = function (options) {
    'use strict';

    // This is a function that can parse a JSON text, producing a JavaScript
    // data structure. It is a simple, recursive descent parser. It does not use
    // eval or regular expressions, so it can be used as a model for implementing
    // a JSON parser in other languages.

    // We are defining the function inside of another function to avoid creating
    // global variables.

    // Default options one can override by passing options to the parse()
    var _options = {
      strict: false, // not being strict means do not generate syntax errors for "duplicate key"
      storeAsString: false, // toggles whether the values should be stored as BigNumber (default) or a string
      alwaysParseAsBig: false, // toggles whether all numbers should be Big
      useNativeBigInt: false, // toggles whether to use native BigInt instead of bignumber.js
      protoAction: 'error',
      constructorAction: 'error',
    };

    // If there are options, then use them to override the default _options
    if (options !== undefined && options !== null) {
      if (options.strict === true) {
        _options.strict = true;
      }
      if (options.storeAsString === true) {
        _options.storeAsString = true;
      }
      _options.alwaysParseAsBig =
        options.alwaysParseAsBig === true ? options.alwaysParseAsBig : false;
      _options.useNativeBigInt =
        options.useNativeBigInt === true ? options.useNativeBigInt : false;

      if (typeof options.constructorAction !== 'undefined') {
        if (
          options.constructorAction === 'error' ||
          options.constructorAction === 'ignore' ||
          options.constructorAction === 'preserve'
        ) {
          _options.constructorAction = options.constructorAction;
        } else {
          throw new Error(
            `Incorrect value for constructorAction option, must be "error", "ignore" or undefined but passed ${options.constructorAction}`
          );
        }
      }

      if (typeof options.protoAction !== 'undefined') {
        if (
          options.protoAction === 'error' ||
          options.protoAction === 'ignore' ||
          options.protoAction === 'preserve'
        ) {
          _options.protoAction = options.protoAction;
        } else {
          throw new Error(
            `Incorrect value for protoAction option, must be "error", "ignore" or undefined but passed ${options.protoAction}`
          );
        }
      }
    }

    var at, // The index of the current character
      ch, // The current character
      escapee = {
        '"': '"',
        '\\': '\\',
        '/': '/',
        b: '\b',
        f: '\f',
        n: '\n',
        r: '\r',
        t: '\t',
      },
      text,
      error = function (m) {
        // Call error when something is wrong.

        throw {
          name: 'SyntaxError',
          message: m,
          at: at,
          text: text,
        };
      },
      next = function (c) {
        // If a c parameter is provided, verify that it matches the current character.

        if (c && c !== ch) {
          error("Expected '" + c + "' instead of '" + ch + "'");
        }

        // Get the next character. When there are no more characters,
        // return the empty string.

        ch = text.charAt(at);
        at += 1;
        return ch;
      },
      number = function () {
        // Parse a number value.

        var number,
          string = '';

        if (ch === '-') {
          string = '-';
          next('-');
        }
        while (ch >= '0' && ch <= '9') {
          string += ch;
          next();
        }
        if (ch === '.') {
          string += '.';
          while (next() && ch >= '0' && ch <= '9') {
            string += ch;
          }
        }
        if (ch === 'e' || ch === 'E') {
          string += ch;
          next();
          if (ch === '-' || ch === '+') {
            string += ch;
            next();
          }
          while (ch >= '0' && ch <= '9') {
            string += ch;
            next();
          }
        }
        number = +string;
        if (!isFinite(number)) {
          error('Bad number');
        } else {
          if (Number.isSafeInteger(number))
            return !_options.alwaysParseAsBig
              ? number
              : _options.useNativeBigInt
              ? BigInt(number)
              : new BigNumber(number);
          // Number with fractional part should be treated as number(double) including big integers in scientific notation, i.e 1.79e+308
          else
            return _options.storeAsString
              ? string
              : /[\.eE]/.test(string)
              ? number
              : _options.useNativeBigInt
              ? BigInt(string)
              : new BigNumber(string);
        }
      },
      string = function () {
        // Parse a string value.

        var hex,
          i,
          string = '',
          uffff;

        // When parsing for string values, we must look for " and \ characters.

        if (ch === '"') {
          var startAt = at;
          while (next()) {
            if (ch === '"') {
              if (at - 1 > startAt) string += text.substring(startAt, at - 1);
              next();
              return string;
            }
            if (ch === '\\') {
              if (at - 1 > startAt) string += text.substring(startAt, at - 1);
              next();
              if (ch === 'u') {
                uffff = 0;
                for (i = 0; i < 4; i += 1) {
                  hex = parseInt(next(), 16);
                  if (!isFinite(hex)) {
                    break;
                  }
                  uffff = uffff * 16 + hex;
                }
                string += String.fromCharCode(uffff);
              } else if (typeof escapee[ch] === 'string') {
                string += escapee[ch];
              } else {
                break;
              }
              startAt = at;
            }
          }
        }
        error('Bad string');
      },
      white = function () {
        // Skip whitespace.

        while (ch && ch <= ' ') {
          next();
        }
      },
      word = function () {
        // true, false, or null.

        switch (ch) {
          case 't':
            next('t');
            next('r');
            next('u');
            next('e');
            return true;
          case 'f':
            next('f');
            next('a');
            next('l');
            next('s');
            next('e');
            return false;
          case 'n':
            next('n');
            next('u');
            next('l');
            next('l');
            return null;
        }
        error("Unexpected '" + ch + "'");
      },
      value, // Place holder for the value function.
      array = function () {
        // Parse an array value.

        var array = [];

        if (ch === '[') {
          next('[');
          white();
          if (ch === ']') {
            next(']');
            return array; // empty array
          }
          while (ch) {
            array.push(value());
            white();
            if (ch === ']') {
              next(']');
              return array;
            }
            next(',');
            white();
          }
        }
        error('Bad array');
      },
      object = function () {
        // Parse an object value.

        var key,
          object = Object.create(null);

        if (ch === '{') {
          next('{');
          white();
          if (ch === '}') {
            next('}');
            return object; // empty object
          }
          while (ch) {
            key = string();
            white();
            next(':');
            if (
              _options.strict === true &&
              Object.hasOwnProperty.call(object, key)
            ) {
              error('Duplicate key "' + key + '"');
            }

            if (suspectProtoRx.test(key) === true) {
              if (_options.protoAction === 'error') {
                error('Object contains forbidden prototype property');
              } else if (_options.protoAction === 'ignore') {
                value();
              } else {
                object[key] = value();
              }
            } else if (suspectConstructorRx.test(key) === true) {
              if (_options.constructorAction === 'error') {
                error('Object contains forbidden constructor property');
              } else if (_options.constructorAction === 'ignore') {
                value();
              } else {
                object[key] = value();
              }
            } else {
              object[key] = value();
            }

            white();
            if (ch === '}') {
              next('}');
              return object;
            }
            next(',');
            white();
          }
        }
        error('Bad object');
      };

    value = function () {
      // Parse a JSON value. It could be an object, an array, a string, a number,
      // or a word.

      white();
      switch (ch) {
        case '{':
          return object();
        case '[':
          return array();
        case '"':
          return string();
        case '-':
          return number();
        default:
          return ch >= '0' && ch <= '9' ? number() : word();
      }
    };

    // Return the json_parse function. It will have access to all of the above
    // functions and variables.

    return function (source, reviver) {
      var result;

      text = source + '';
      at = 0;
      ch = ' ';
      result = value();
      white();
      if (ch) {
        error('Syntax error');
      }

      // If there is a reviver function, we recursively walk the new structure,
      // passing each name/value pair to the reviver function for possible
      // transformation, starting with a temporary root object that holds the result
      // in an empty key. If there is not a reviver function, we simply return the
      // result.

      return typeof reviver === 'function'
        ? (function walk(holder, key) {
            var k,
              v,
              value = holder[key];
            if (value && typeof value === 'object') {
              Object.keys(value).forEach(function (k) {
                v = walk(value, k);
                if (v !== undefined) {
                  value[k] = v;
                } else {
                  delete value[k];
                }
              });
            }
            return reviver.call(holder, key, value);
          })({ '': result }, '')
        : result;
    };
  };
  const json_stringify = (function () {
    'use strict';

    function f(n) {
      // Format integers to have at least two digits.
      return n < 10 ? '0' + n : n;
    }

    var cx =
        /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
      escapable =
        /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
      gap,
      indent,
      meta = {
        // table of character substitutions
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"': '\\"',
        '\\': '\\\\',
      },
      rep;

    function quote(string) {
      // If the string contains no control characters, no quote characters, and no
      // backslash characters, then we can safely slap some quotes around it.
      // Otherwise we must also replace the offending characters with safe escape
      // sequences.

      escapable.lastIndex = 0;
      return escapable.test(string)
        ? '"' +
            string.replace(escapable, function (a) {
              var c = meta[a];
              return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) +
            '"'
        : '"' + string + '"';
    }

    function str(key, holder) {
      // Produce a string from holder[key].

      var i, // The loop counter.
        k, // The member key.
        v, // The member value.
        length,
        mind = gap,
        partial,
        value = holder[key],
        isBigNumber = value != null && typeof value === 'bigint';

      // If the value has a toJSON method, call it to obtain a replacement value.

      if (
        value &&
        typeof value === 'object' &&
        typeof value.toJSON === 'function'
      ) {
        value = value.toJSON(key);
      }

      // If we were called with a replacer function, then call the replacer to
      // obtain a replacement value.

      if (typeof rep === 'function') {
        value = rep.call(holder, key, value);
      }

      // What happens next depends on the value's type.

      switch (typeof value) {
        case 'string':
          if (isBigNumber) {
            return value;
          } else {
            return quote(value);
          }

        case 'number':
          // JSON numbers must be finite. Encode non-finite numbers as null.

          return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':
        case 'bigint':
          // If the value is a boolean or null, convert it to a string. Note:
          // typeof null does not produce 'null'. The case is included here in
          // the remote chance that this gets fixed someday.

          return String(value);

        // If the type is 'object', we might be dealing with an object or an array or
        // null.

        case 'object':
          // Due to a specification blunder in ECMAScript, typeof null is 'object',
          // so watch out for that case.

          if (!value) {
            return 'null';
          }

          // Make an array to hold the partial results of stringifying this object value.

          gap += indent;
          partial = [];

          // Is the value an array?

          if (Object.prototype.toString.apply(value) === '[object Array]') {
            // The value is an array. Stringify every element. Use null as a placeholder
            // for non-JSON values.

            length = value.length;
            for (i = 0; i < length; i += 1) {
              partial[i] = str(i, value) || 'null';
            }

            // Join all of the elements together, separated with commas, and wrap them in
            // brackets.

            v =
              partial.length === 0
                ? '[]'
                : gap
                ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                : '[' + partial.join(',') + ']';
            gap = mind;
            return v;
          }

          // If the replacer is an array, use it to select the members to be stringified.

          if (rep && typeof rep === 'object') {
            length = rep.length;
            for (i = 0; i < length; i += 1) {
              if (typeof rep[i] === 'string') {
                k = rep[i];
                v = str(k, value);
                if (v) {
                  partial.push(quote(k) + (gap ? ': ' : ':') + v);
                }
              }
            }
          } else {
            // Otherwise, iterate through all of the keys in the object.

            Object.keys(value).forEach(function (k) {
              var v = str(k, value);
              if (v) {
                partial.push(quote(k) + (gap ? ': ' : ':') + v);
              }
            });
          }

          // Join all of the member texts together, separated with commas,
          // and wrap them in braces.

          v =
            partial.length === 0
              ? '{}'
              : gap
              ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
              : '{' + partial.join(',') + '}';
          gap = mind;
          return v;
      }
    }

    return function (value, replacer, space) {
      // The stringify method takes a value and an optional replacer, and an optional
      // space parameter, and returns a JSON text. The replacer can be a function
      // that can replace values, or an array of strings that will select the keys.
      // A default replacer method can be provided. Use of the space parameter can
      // produce text that is more easily readable.

      var i;
      gap = '';
      indent = '';

      // If the space parameter is a number, make an indent string containing that
      // many spaces.

      if (typeof space === 'number') {
        for (i = 0; i < space; i += 1) {
          indent += ' ';
        }

        // If the space parameter is a string, it will be used as the indent string.
      } else if (typeof space === 'string') {
        indent = space;
      }

      // If there is a replacer, it must be a function or an array.
      // Otherwise, throw an error.

      rep = replacer;
      if (
        replacer &&
        typeof replacer !== 'function' &&
        (typeof replacer !== 'object' || typeof replacer.length !== 'number')
      ) {
        throw new Error('JSON.stringify');
      }

      // Make a fake root object containing our value under the key of ''.
      // Return the result of stringifying the value.

      return str('', { '': value });
    };
  })();

  return {
    parse: json_parse({ useNativeBigInt: true }),
    stringify: json_stringify,
  };
})();

function stringifyLog(logText) {
    let depth = 0;
    const texts = [];
    let text = '';
    for(let i = 0; i < logText.length; i++) {
        if(logText[i] === '{' && logText.slice(i).match(/^{\\*("|\})/)) {
            depth += 1;
            text += logText[i];
        } else if(logText[i] === '}' && depth > 0) {
            depth -= 1;
            text += logText[i];
        } else if(depth > 0) {
            text += logText[i];
        }

        if (depth === 0 && text) {
            function parse(text) {
                try {
                    const data = typeof text === 'string' ? JSONBigInt.parse(text) : text;
                    if (typeof data !== 'object') {
                        return data;
                    }
                    for(let i in data) {
                        data[i] = parse(data[i]);
                    }
                    return data;
                } catch(e) {
                    return text;
                }
            }
            function stringify(text) {
                const ret = parse(text);
                if (typeof ret === 'string') {
                    return ret;
                }
                return JSONBigInt.stringify(ret, null, '┆\t');
            }
            texts.push({ raw: text, stringify: stringify(text) });
            text = '';
        }
    }

    if (texts.length) {
        texts.forEach(({ raw, stringify }) => {
            if (raw === stringify) { return; }
            logText = logText.replace(raw, stringify);
        });
    }
    return logText;
}

function submitFormat(response) {
    const resultData = JSON.parse(response.data.result);
    resultData.forEach(psm => {
        if(!Array.isArray(psm.logs)) {
            return;
        }
        psm.logs = psm.logs.map(stringifyLog);
    });
    response.data.result = JSON.stringify(resultData);
    return response;
}

function listNewFormat(response) {
    if (!Array.isArray(response?.data?.structLogs)) {
        return response;
    }
    response.data.structLogs.forEach(log => {
        if (!log?.message) {
            return;
        }
        log.message = stringifyLog(log.message);
    });
    return response;
}

function QueryTraceFormat(response) {
    if (!Array.isArray(response?.data?.items)) {
        return response;
    }
    response.data.items.forEach(item => {
        if(!Array.isArray(item.value)) {
            return;
        }
        item.value.forEach(log => {
            if (!log.text && !Array.isArray(log.kv_list)) {
                return;
            }
            log.text = stringifyLog(log.text);
            if (Array.isArray(log.kv_list)) {
                const idx = log.kv_list.findIndex(({key}) => key === '_msg');
                if (idx !== -1) {
                    log.kv_list[idx].value = stringifyLog(log.kv_list[idx].value);
                }
            }

        });
    });
    return response;
}

(function () {
    XMLHttpRequest.prototype._open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (...args) {
        const [ method, url ] = args;
        const matchUrls = {
            'byted.org/dispatch/trace_search/v2/search_task/submit': submitFormat,
            'byted.org/dispatch/key_word_search/v2/result/list_new': listNewFormat,
            'byted.org/streamlog/platform/microservice/v1/query/trace': QueryTraceFormat,
            'byted.org/dispatch/trace_search/v2/search_task/get_by_id': QueryTraceFormat,
        };
        const matchUrl = Object.keys(matchUrls).find(matchUrl => url.includes(matchUrl));
        if (!matchUrl) {
            return this._open(...args);
        }

        this.addEventListener("readystatechange", function() {
            if (this.readyState !== 4) return;
            let response = this.response;
            try {
                response = JSON.parse(response);
            } catch(e) {};
            console.log('debug:', response);

            response = matchUrls[matchUrl](response);

            Object.defineProperty(this, 'response', {
                get() {
                    return response;
                }
            });
            Object.defineProperty(this, 'responseText', {
                get() {
                    return JSON.stringify(response);
                }
            });
        }, false);

        return this._open(...args);
    };
})();