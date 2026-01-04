// ==UserScript==
// @name        Dev stuff
// @namespace   Violentmonkey Scripts
// @match       https://*/*
// @grant       none
// @version     0.3
// @author      Shaun Mitchell
// @description 7/29/2024, 8:57:58 PM
// ==/UserScript==

var circularCounter = 10000;
unsafeWindow.circularCounter = circularCounter;

function mapToStyle(styles) {
  return Object.entries(styles)
    .map(([key, value]) => `${key}: ${value};`)
    .join(' ');
}

class Debugger {
    // Set the default name to the name of the loaded script
    static name = GM.info.script.name;
    static level = "debug";
    static levels = ["debug", "info", "warn", "error"];
    static styles = {
        debug: {
            "color": "grey",
        },
        info: {
            "color": "cyan"
        },
        warn: {
            "color": "yellow",
            "font-weight": "bold"
        },
        error: {
            "background-color": "red",
            "color": "black",
            "font-weight": "bold",
            "font-size": "1.1em"
        }
    }

    static setLevel(level) {
        this.level = level;
    }

    static isValidLevel(level) {
        let cur_index = -1;
        let lvl_index = -1;

        for (let i = 0; i < this.levels.length; i++) {
            let l = this.levels[i];
            if (l == this.level) {
                cur_index = i;
            }
            if (l == level) {
                lvl_index = i;
            }
            if (cur_index > -1 && lvl_index > -1) {
                break;
            }
        }

        return lvl_index >= cur_index;
    }

    static log(level, ...args) {
        if (this.isValidLevel(level)) {
            const timestamp = new Date().toISOString().replace("T", " ").replace(/\..*/, "")
            const style = mapToStyle(this.styles[level]);
            console[level](`%c[${this.name}.${level} | ${timestamp}]`, style, ...args);
        }
    }

    static debug(...args) { this.log("debug", ...args) }
    static info(...args) { this.log("info", ...args) }
    static warn(...args) { this.log("warn", ...args) }
    static error(...args) { this.log("error", ...args) }
}

function debug(...args) { Debugger.debug(...args) }
function info(...args) { Debugger.info(...args) }
function warn(...args) { Debugger.warn(...args) }
function error(...args) { Debugger.error(...args) }

function getFunctionArgs(func) {
    return func.toString().match(/[^)]+(\([^)]+\))/);
}

// attribution:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value
function getCircularReplacer() {
    const ancestors = [];
    let i = 0;
    Debugger.info("returning circular replacer");
    return function(key, value) {
        unsafeWindow.lastKey = key;
        unsafeWindow.lastValue = value;

        i += 1;
        if (i % unsafeWindow.circularCounter === (unsafeWindow.circularCounter-1)) {
            Debugger.info(`processing key ${i}`, key);
        }
        const valueType = typeof value;

        if (valueType !== "object" || value === null) {
            return value;
        }
        if (valueType === "function") {
            console.info(`skipping function ${key}`);
            return `[Function ${key}]`;
        }
        if (valueType === "object") {
            const protoName = value.__proto__.constructor.name;
            // Skip anything except arrays and associative arrays and ''
            if (protoName !== "Object" && protoName !== "Array" && protoName !== '') {
                console.info(`skipping object ${key} ${value.__proto__}`);
                return `[${value.__proto__.constructor.name} ${key}]`
            }
        }

        // `this` is the object that value is contained in,
        // i.e., its direct parent.
        while (ancestors.length > 0 && ancestors.at(-1) !== this) {
            ancestors.pop();
        }

        if (ancestors.includes(value)) {
            return "[Circular]";
        }

        ancestors.push(value);
        return value;
    };
}

function asyncStringify(str, indent) {
  return new Promise((resolve, reject) => {
    resolve(JSON.stringify(str, getCircularReplacer(), " ".repeat(indent)));
  });
}

function downloadObjectJSON(object, filename, indent) {
    const default_filename = "object-blob.js.json";
    const default_indent = 4;

    // Allow for intelligent argument parsing for, e.g.: `downloadObjectBlob(foo, indent=4)`
    args = [object, filename, indent];
    filename = undefined;
    indent = undefined;
    for (const arg of args) {
        switch (typeof arg) {
            case 'number':
                indent = arg;
                break;
            case 'string':
                filename = arg;
                break;
            case 'object':
                object = arg;
                break;
            case 'undefined':
                break;
            default:
                error(`error: unexpected type for ${arg}`);
                return null
        }
    }
    if (filename === undefined) { filename = default_filename }
    if (indent === undefined) { indent = default_indent }
    asyncStringify(object, indent)
        .then(function (text) {
            downloadBlob(text, filename)
        })
        .catch(function (reason) {
            unsafeWindow.reason = reason;
            Debugger.error("download failed", reason);
        })
}

function downloadBlob(text, filename) {
    info(`downloading text=${text.length} bytes, filename=${filename}`)
    blob = new Blob([text]);
    debug(`blob=<Blob size=${blob.size}>, filename=${filename}`);
    var a = window.document.createElement('a');
    a.href = window.URL.createObjectURL(blob, {type: 'text/json'});
    a.download = filename;

    // Append anchor to body.
    document.body.appendChild(a);
    a.dispatchEvent(new MouseEvent('click'));

    // Remove anchor from body
    document.body.removeChild(a);
}

/* Export stuff */

unsafeWindow.mapToStyle = mapToStyle;
unsafeWindow.Debugger = Debugger;
unsafeWindow.getCircularReplacer = getCircularReplacer;
unsafeWindow.downloadObjectJSON = downloadObjectJSON;
unsafeWindow.asyncStringify = asyncStringify;
unsafeWindow.downloadBlob = downloadBlob;
unsafeWindow.debug = debug;
unsafeWindow.info = info;
unsafeWindow.warn = warn;
unsafeWindow.error = error;
unsafeWindow.getFunctionArgs = getFunctionArgs;