// ==UserScript==
// @name         Throttle POW v2
// @namespace    https://diep.io
// @version      2.0
// @description  Throttles POW to every 10 seconds
// @author       Binary
// @match        https://diep.io/*
// @grant        unsafeWindow
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/410964/Throttle%20POW%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/410964/Throttle%20POW%20v2.meta.js
// ==/UserScript==

const throttle = 10000;
(function() {
    var originalWorker = unsafeWindow.Worker;
    unsafeWindow.Worker = function(...args){
        var worker = new originalWorker(...args);
        var originalPostMessage = worker.postMessage;
        var previousPOWTime = 0;
        worker.postMessage = function(...args){
            setTimeout(()=>{
                originalPostMessage.apply(worker, args);
                previousPOWTime = Date.now();
            }, Math.max(0, previousPOWTime + throttle - Date.now()));
        };
        return worker;
    };
})();