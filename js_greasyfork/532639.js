// ==UserScript==
// @name         TW Data Tracer Stopper
// @namespace    AntiGameDataTracingTheWest
// @version      rev A.04
// @description  Inside Game tracing removal
// @author       Ercho
// @include      https://*.the-west.*/game.php*
// @icon         https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZamT6v3aOo2WjZHZ8-VgIuK_9vv0NOBklUQ&s
// @grant        none
// @license      license-MIT
// @downloadURL https://update.greasyfork.org/scripts/532639/TW%20Data%20Tracer%20Stopper.user.js
// @updateURL https://update.greasyfork.org/scripts/532639/TW%20Data%20Tracer%20Stopper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let d = setInterval(function(){
        Chat.Request.VarDec = function (){};
        GrafanaFaroWebSdk.browserMeta = {};
        GrafanaFaroWebSdk.faro = {};
        GrafanaFaroWebTracing.TracingInstrumentation = {};
        if(faro)
            for(key in faro)
                faro[key] = {}

    },100);
    setTimeout(function(){clearInterval(d)},5000);
})();