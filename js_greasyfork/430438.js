// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  v3core v3 core v3cores v3mods v3 mod v3cv v3 cv v3tube v3 mods v3material v3 material v3interface v3mods210529
// @author       You
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/430438/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/430438/New%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var timeout = 1000;//is too much anyway
function ensureCfgIsSet(timeout) {
    var start = Date.now();
    return new Promise(waitForCfg);
    function waitForCfg(resolve, reject) {
        if (window.yt && window.yt.config_){
            resolve(window.yt.config_);}
        else if (timeout && (Date.now() - start) >= timeout){
            reject(new Error("timeout"));}
        else{
            setTimeout(waitForCfg.bind(this, resolve, reject), 5);}
    }
}
ensureCfgIsSet(timeout).then(function(){
    console.log("yt.config_ was set!");
    //window.yt.config_.INNERTUBE_CONTEXT_CLIENT_VERSION = "1.20210519.01.00";
});
})();