// ==UserScript==
// @name         iLog
// @namespace    https://www.ocrosoft.com/
// @version      0.1
// @description  Logger.
// @author       ocrosoft
// ==/UserScript==

// Log
function ILog() {
    this.prefix = '';

    this.v = function (value) {
        if (level <= this.LogLevel.Verbose) {
            console.log(this.prefix + value);
        }
    }

    this.i = function (info) {
        if (level <= this.LogLevel.Info) {
            console.info(this.prefix + info);
        }
    }

    this.w = function (warning) {
        if (level <= this.LogLevel.Warning) {
            console.warn(this.prefix + warning);
        }
    }

    this.e = function (error) {
        if (level <= this.LogLevel.Error) {
            console.error(this.prefix + error);
        }
    }
 
    this.d = function (element) {
        if (level <= this.LogLevel.Verbose) {
            console.log(element);
        }
    }

    this.setLogLevel = function (logLevel) {
        level = logLevel;
    }

    this.LogLevel = {
        Verbose: 0,
        Info: 1,
        Warning: 2,
        Error: 3,
    };

    let level = this.LogLevel.Verbose;
}
var iLog = new ILog();