// Userscript Utils library
//
// Some useful utilities for userscript development.
//
// https://greasyfork.org/scripts/391648-userscript-utils
// Copyright (C) 2019, Guido Villa
//
// For information/instructions on user scripts, see:
// https://greasyfork.org/help/installing-user-scripts
//
// To use this library in a userscript you must add to script header:
  // @require https://greasyfork.org/scripts/391648/code/userscript-utils.js
  // @grant   GM_xmlhttpRequest  (only if using UU.GM_xhR)
  // @grant   GM_getValue        (only if using UU.GM_getObject)
  // @grant   GM_setValue        (only if using UU.GM_setObject)
  // @grant   GM_deleteValue     (only if using UU.GM_deleteObject)
//
// --------------------------------------------------------------------
//
// ==UserScript==
// @namespace       https://greasyfork.org/users/373199-guido-villa
// @exclude         *
//
// ==UserLibrary==
// @name            Userscript Utils
// @description     Some useful utilities for userscript development
// @version         1.1
// @author          guidovilla
// @date            01.11.2019
// @copyright       2019, Guido Villa (https://greasyfork.org/users/373199-guido-villa)
// @license         GPL-3.0-or-later
// @homepageURL     https://greasyfork.org/scripts/391648-userscript-utils
// @supportURL      https://gitlab.com/gv-browser/userscripts/issues
// @contributionURL https://tinyurl.com/gv-donate-99
// @attribution     Trevor Dixon (https://stackoverflow.com/users/711902/trevor-dixon)
// ==/UserScript==
//
// ==/UserLibrary==
//
// --------------------------------------------------------------------
//
// To-do (priority: [H]igh, [M]edium, [L]ow):
//   - [H] GM_xhR: remove workaround responseXML2 and make responseXML work
//   - [M] make a strict RFC 4180 compliant CSV parse method version
//   - [M] add other functions
//
// Changelog:
// ----------
// 2019.11.01 [1.1] Add GM storage for objs, getCSVheader, cumulative timers
//                  Add implements() and make checkProperty() private
//                  Name change, backward compatible
// 2019.10.27 [1.0] First version
// 2019.10.26 [0.1] First test version, private use only
//
// --------------------------------------------------------------------

/* jshint esversion: 6, laxbreak: true, -W008, supernew: true */
/* exported UU, Library_Version_USERSCRIPT_UTILS */

const Library_Version_USERSCRIPT_UTILS = '1.1';

/* How to use this library

This library instantitates an UU object with utility variables and methods:

- me: script name as returned by GM_info

- isUndef(p): check if p is undefined

- implements(object, interfaceDef):
  check if passed object "implements" given interface, by checking name and
  type of its properties. Arguments:
  - object: the object to be tested
  - interfaceDef: array of properties to be checked, each represented by
    an object with:
    - name [mandatory]: the name of the property to be checked
    - type [mandatory]: the type of the property, as returned by typeof
    - optional: boolean, if true the property is optional (if not specified
                it is assumed to be false)
  Return true/false, and log error for each missing/mismatched property.

Logging:
- le(...args): like console.error, prepending the script name
- lw(...args): like console.warn, prepending the script name
- li(...args): like console.info, prepending the script name
- ld(...args): like console.debug, prepending the script name

Storage for objects:
- GM_setObject(name, value): wrapper around GM_setValue for storing objects,
  applies serialization before saving.
- GM_getObject(name, defaultValue): wrapper around GM_getValue for retrieving
  stringified objects, applies deserialization and returns a proper object.
- GM_deleteObject(name): just another name for GM_deleteValue (offered only
  for name consistency).

CSV:
- parseCSV(csv): simple CSV parsing function, by Trevor Dixon (see below)
  Take a CSV string as input and return an array of rows, each containing
  an array of fields.
  NOTE: it is not strict in RFC 4180 compliance as it handles unquoted
  double quotes inside a field (this is not allowed in the RFC specifications).
- getCSVheader(csvData): return a header object from a parsed CSV.
  The header works as an index: there is a property for each CSV field, with
  the array index of that field as value.
  E.g.: { 'name': 0, 'date': 1, 'value': 2 } means that the CSV has two fields,
  the first is "name", the second is "date", the third is "value".

Promise-wrapped setTimeout:
- wait(waitTime, result)
  return a Promise to wait for "waitTime" ms, then resolve with value "result"
- thenWait(waitTime)
  like wait(), to be used inside a Promise.then(). Passes through the
  received fulfillment value.

Promise-wrapped GM_xmlhttpRequest:
- GM_xhR(method, url, purpose, opts): GM_xmlhttpRequest wrapped in a Promise.
  Return a Promise resolving with the GM_xmlhttpRequest response, or failing
  with an error message (which is also logged). Arguments:
  - mathod: HTTP method (GET, POST, ...)
  - url: URL to call
  - purpose: string describing XHR call (for error logging and reporting)
  - opts: details to be passed to GM_xmlhttpRequest; the following properties
    will be ignored:
    - method, url: overwritten by function arguments
    - onload: overwritten to resolve the Promise
    - onabort, onerror, ontimeout: overwritten to reject the Promise
    if no context is specified, purpose is passed as context

Cumulative timers:
these timers can be started and stopped multiple times, their time always
adding up (unless reset):
- startTimer(timer, force): create/start a timer with given "timer" name. If
  timer is already running, log error and do nothing if "force" is false (the
  default), or cancel the timer restart it if "force" is true.
- stopTimer(timer): stop running timer with given "timer" name
- cancelTimer(timer): stop a timer without recording time from last start
- resetTimer(timer): reset a timer to zero, stopping it if needed
- getTimer(timer): get time for a timer. Work if either running or stopped
*/


window.UU = new (function() {
    'use strict';
    var self = this;



    // the name of the running script
    this.me = GM_info.script.name;



    // check if argument is undefined
    this.isUndef = function(p) {
        return (typeof p === 'undefined');
    };



    // Check if object "object" has property "property" of type "type".
    // If property is "optional" (default false), it is only checked for type
    // Used to test if object "implements" a specific interface
    function checkProperty(object, property, type, optional = false) {

        if (self.isUndef(object[property])) {
            if (optional) return true;

            self.le('Invalid object: missing property "' + property + '" of type "' + type + '"');
            return false;
        }
        if (typeof object[property] !== type) {
            self.le('Invalid object: ' + (optional ? 'optional ' : '') + 'property "' + property + '" must be of type "' + type + '"');
            return false;
        }
        return true;
    }

    // check if passed object "implements" given interface, by checking name
    // and type of its properties.
    this.implements = function(object, interfaceDef) {
        var valid = true;
        try {
            // check is not stopped at first error, so all problems are logged
            interfaceDef.forEach(function(prop) {
                valid = valid && checkProperty(object, prop.name, prop.type, prop.optional);
            });
        } catch(err) {
            self.le('Error while testing object:', object,
                    'for interface:', interfaceDef, 'Error:', err);
        }
        return valid;
    };



    // logging
    var bracketMe = '[' + this.me + ']';
    this.le = function(...args) { console.error(bracketMe, ...args); };
    this.lw = function(...args) { console.warn (bracketMe, ...args); };
    this.li = function(...args) { console.info (bracketMe, ...args); };
    this.ld = function(...args) { console.debug(bracketMe, ...args); };



    // storage for objects
    // setter...
    this.GM_setObject = function(name, value) {
        var jsonData;
        try {
            jsonData = JSON.stringify(value);
            GM_setValue(name, jsonData);
        } catch(err) {
            self.le('Error serializing object to save in storage. Name:', name, '- Object:', value, '- Error:', err);
        }
    };

    // ...and getter
    this.GM_getObject = function(name, defaultValue) {
        var jsonData = GM_getValue(name);
        if (jsonData) {
            try {
                return JSON.parse(jsonData);
            } catch(err) {
                self.le('Error parsing object retrieved from storage. Name:', name, '- Object:', jsonData, '- Error:', err);
            }
        } else return defaultValue;
    };

    // deleteObject offered only for name consistency
    this.GM_deleteObject = function(name) {
        // the wrapping inside a function is needed otherwise you would need to
        // @grant GM_deleteValue even if not using it
        GM_deleteValue(name);
    };



    // Simple, compact and fast CSV parsing function, by Trevor Dixon:
    // https://stackoverflow.com/a/14991797
    // take a CSV as input and return an array of arrays (rows, fields)
    /* eslint-disable max-statements, max-statements-per-line, max-len */
    this.parseCSV = function(csv) {
        var arr = [];
        var quote = false;  // true means we're inside a quoted field

        // iterate over each character, keep track of current row and column (of the returned array)
        var row, col, c;
        for (row = col = c = 0; c < csv.length; c++) {
            var cc = csv[c], nc = csv[c+1];        // current character, next character
            arr[row] = arr[row] || [];             // create a new row if necessary
            arr[row][col] = arr[row][col] || '';   // create a new column (start with empty string) if necessary

            // If the current character is a quotation mark, and we're inside a
            // quoted field, and the next character is also a quotation mark,
            // add a quotation mark to the current column and skip the next character
            if (cc == '"' && quote && nc == '"') { arr[row][col] += cc; ++c; continue; }

            // If it's just one quotation mark, begin/end quoted field
            if (cc == '"') { quote = !quote; continue; }

            // If it's a comma and we're not in a quoted field, move on to the next column
            if (cc == ',' && !quote) { ++col; continue; }

            // If it's a newline (CRLF) and we're not in a quoted field, skip the next character
            // and move on to the next row and move to column 0 of that new row
            if (cc == '\r' && nc == '\n' && !quote) { ++row; col = 0; ++c; continue; }

            // If it's a newline (LF or CR) and we're not in a quoted field,
            // move on to the next row and move to column 0 of that new row
            if (cc == '\n' && !quote) { ++row; col = 0; continue; }
            if (cc == '\r' && !quote) { ++row; col = 0; continue; }

            // Otherwise, append the current character to the current column
            arr[row][col] += cc;
        }
        return arr;
    };
    /* eslint-enable max-statements, max-statements-per-line, max-len */

    // return a header object from a parsed CSV
    this.getCSVheader = function(csvData) {
        var header = csvData[0], fields = {};
        for (var i = 0; i < header.length; i++) fields[header[i]] = i;
        return fields;
    };



    // setTimeout wrapped in a Promise
    this.wait = function(waitTime, result) {
        return new Promise(function(resolve, _I_reject) {
            setTimeout(resolve, waitTime, result);
        });
    };

    // setTimeout wrapped in a Promise, if called iside "then"
    this.thenWait = function(waitTime) {
        return (function(result) { return self.wait(waitTime, result); });
    };



    // handle download error in a Promise-enhanced GM_xmlhttpRequest
    function xhrError(rejectFunc, response, method, url, purpose, reason) {
        var m = purpose + ' - HTTP ' + method + ' error' + (reason ? ' (' + reason + ')' : '') + ': '
              + response.status + (response.statusText ? ' - ' + response.statusText : '');
        self.le(m, 'URL: ' + url, 'Response:', response);
        rejectFunc(m);
    }
    function xhrErrorFunc(rejectFunc, method, url, purpose, reason) {
        return (function(resp) {
            xhrError(rejectFunc, resp, method, url, purpose, reason);
        });
    }


    // wrap GM_xmlhttpRequest in a Promise
    // returns a Promise resolving with the GM_xmlhttpRequest response
    this.GM_xhR = function(method, url, purpose, opts) {
        return new Promise(function(resolve, reject) {
            var details = opts || {};
            details.method = method;
            details.url    = url;
            details.onload = function(response) {
                if (response.status !== 200) xhrError(reject, response, method, url, purpose);
//                else resolve(response);
                else {
                    if (details.responseType === 'document') {
                        try {
                            const d = document.implementation.createHTMLDocument().documentElement;
                            d.innerHTML = response.responseText;
                            response.responseXML2 = d;
                        } catch(e) {
                            xhrError(reject, response, method, url, purpose, e);
                        }
                    }
                    resolve(response);
                }
            };
            details.onabort   = xhrErrorFunc(reject, method, url, purpose, 'abort');
            details.onerror   = xhrErrorFunc(reject, method, url, purpose, 'error');
            details.ontimeout = xhrErrorFunc(reject, method, url, purpose, 'timeout');
            if (self.isUndef(details.synchronous)) details.synchronous = false;
            if (self.isUndef(details.context))     details.context     = purpose;
            GM_xmlhttpRequest(details);
        });
    };



    // cumulative timers
    var timers = {};
    // create/start a timer
    this.startTimer = function(timer, force = false) {
        timers[timer]       = timers[timer] || { 'time': 0, 'start': null };
        if (timers[timer].start !== null) {
            if (force) self.cancelTimer(timer);
            else {
                self.le('Timer already running:', timer);
                return;
            }
        }
        timers[timer].start = performance.now();
    };

    // stop a running timer
    this.stopTimer = function(timer) {
        var stop = performance.now();
        if (!timers[timer] || timers[timer].start === null) {
            self.le('No running timer specified with name', timer);
            return;
        }
        timers[timer].time += stop - timers[timer].start;
        timers[timer].start = null;
        return timers[timer].time;
    };

    // stop a timer without recording time
    this.cancelTimer = function(timer) {
        if (!timers[timer]) {
            self.le('No timer specified with name', timer);
            return;
        }
        timers[timer].start = null;
    };

    // reset a timer to zero, stopping it if needed
    this.resetTimer = function(timer) {
        if (!timers[timer]) {
            self.le('No timer specified with name', timer);
            return;
        }
        timers[timer] = { 'time': 0, 'start': null };
    };

    // get time for a (possibly running) timer
    this.getTimer = function(timer) {
        var now = performance.now();
        if (!timers[timer]) {
            self.le('No timer specified with name', timer);
            return;
        }
        return timers[timer].time
               + (timers[timer].start != null ? now - timers[timer].start : 0);
    };



})();
