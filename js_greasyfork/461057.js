// ==UserScript==
// @name         LateLog - Simple storage-based Log Library
// @namespace    satology.latelog
// @version      0.2
// @description  Simple library to log to the storage, granting the possibility of viewing the log after the URL changes
// @author       satology
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// ==/UserScript==

var LateLog = (function() {
    'use strict';
    const latelog_getDateTimeString = (date = new Date()) => `${('' + date.getUTCFullYear()).slice(-2)}-${('0' + date.getUTCMonth()).slice(-2)}-${('0' + date.getUTCDate()).slice(-2)} ${('0' + date.getUTCHours()).slice(-2)}:${('0' + date.getUTCMinutes()).slice(-2)}:${('0' + date.getUTCSeconds()).slice(-2)}`;

    class Storage {
        constructor(prefix = '', config = {}) {
            this.prefix = prefix;
            this.config = config;
        }

        write(key, value, parseIt = false) {
            GM_setValue(this.prefix + key, parseIt ? JSON.stringify(value) : value);
        }

        read(key, parseIt = false) {
            let value = GM_getValue(this.prefix + key);
            if(value && parseIt) {
                value = JSON.parse(value);
            }
            return value;
        }
    }

    class LateLog {
        constructor(options = {}) {
            if(!this._isValidSetup(options)) return;
            this.storage = new Storage();
            this.options = {
                level: 5,
                maxLines: 200,
                addTimestamp: true,
                printWhileLogging: false,
                // showDisplayButton: true,
                ...options
            };
            this._init();
        }

        _isValidSetup(options) {
            if(! (typeof GM_getValue === "function" &&
                  typeof GM_setValue === "function" &&
                  typeof GM_registerMenuCommand === "function") ) {
                console.warn(
                    `LateLog cannot be initialized - At least one off the following @grant is missing in your script:
@grant        GM_getValue
@grant        GM_setValue
@grant        GM_registerMenuCommand`);
                return false;
            }
            // TODO: validate options
            return true;
        }

        _init() {
            let that = this;
            GM_registerMenuCommand('View log', function(evt) {
                console.log('Printing LateLog');
                that.display();
            });
            return true;
        }

        _write(msg, msgLevel = 1) {
            if (this.options.level < msgLevel) {
                return;
            }

            let log = this.storage.read('log', true);
            log = log ? log : [];

            if (msg === null) {
                msg = 'null';
            }
            if (msg === undefined) {
                msg = 'undefined';
            }

            let savable = {
                lvl: msgLevel
            };
            if (this.options.addTimestamp) {
                savable.ts = `${latelog_getDateTimeString()}`;
            }
            if (msg instanceof Error) {
                savable.msg = msg.toString();
            } else if (typeof(msg) == 'object') {
                savable.msg = JSON.stringify(msg);
                savable.parse = true;
            } else {
                savable.msg = msg;
            }
            log.push(savable);

            if(log.length > this.options.maxLines) {
                log.splice(0, log.length - this.options.maxLines);
            }

            this.storage.write('log', log, true);
            this._formatPrint(savable);
        }

        _getPrintFn(level) {
            switch(level) {
                case 1:
                    return console.log;
                case 2:
                    return console.info;
                case 3:
                    return console.debug;
                case 4:
                    return console.warn;
                case 5:
                    return console.error;
                default:
                    return console.log;
            }
        }

        _formatPrint(x) {
            if (x.parse) {
                try {
                    x.msg = JSON.parse(x.msg);
                } catch (err) {}
                if (this.options.addTimestamp) {
                    this._getPrintFn(x.lvl)(`${x.ts}:`);
                }
                this._getPrintFn(x.lvl)(x.msg);
            } else {
                this._getPrintFn(x.lvl)(`${this.options.addTimestamp ? x.ts + ' ' : ''} ${x.msg}`);
            }
        }

        clear() { this.storage.write('log', [], true); }

        display() {
            let log = this.storage.read('log', true);
            if(!log) {
                console.log('LateLog - Nothing to show')
                return;
            }

            log.forEach(x => {
                this._formatPrint(x);
            });
        }

        log(msg) { this._write(msg, 1); }

        info(msg) { this._write(msg, 2); }

        debug(msg) { this._write(msg, 3); }

        warn(msg) { this._write(msg, 4); }

        error(msg) { this._write(msg, 5); }
    }
    return LateLog;
})();
