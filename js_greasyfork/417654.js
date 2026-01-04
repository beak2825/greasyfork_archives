// ==UserScript==
// @name         Anti Anti-debugger
// @namespace    http://tampermonkey.net/
// @version      0.0.4
// @description  Stops most anti debugging implementations by JavaScript obfuscaters, forked from ww's code.https://ohmycoding.com/201903/Javascript-Anti-Anti-debugger-Code-Protection/
// @author       Sasha
// @match        *://www.ting22.com/*
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/417654/Anti%20Anti-debugger.user.js
// @updateURL https://update.greasyfork.org/scripts/417654/Anti%20Anti-debugger.meta.js
// ==/UserScript==

(function() {
    var _constructor = unsafeWindow.Function.prototype.constructor;
    // Hook Function.prototype.constructor
    unsafeWindow.Function.prototype.constructor = function() {
        var fnContent = arguments[0];
        if (fnContent) {
            if (fnContent.includes('debugger')) { // An anti-debugger is attempting to stop debugging
                var caller = Function.prototype.constructor.caller; // Non-standard hack to get the function caller
                var callerContent = caller.toString();
                if (callerContent.includes(/\bdebugger\b/gi)) { // Eliminate all debugger statements from the caller, if any
                    callerContent = callerContent.replace(/\bdebugger\b/gi, ''); // Remove all debugger expressions
                    eval('caller = ' + callerContent); // Replace the function
                }
                return (function () {});
            }
        }
        // Execute the normal function constructor if nothing unusual is going on
        return _constructor.apply(this, arguments);
    };
    setInterval(_constructor,1);
})();