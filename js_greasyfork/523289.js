// ==UserScript==
// @name         congstar.de Tealium: Switch to dev
// @namespace    http://tampermonkey.net/
// @version      2024-05-24
// @description  Alternativer Env Switcher für Congstar.de Wichtig: Diese Netzwerkblockierregel aktivieren  *congstar-web/prod/utag*
// @author       You
// @match        https://www.congstar.de/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=congstar.de
// @grant        none#
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/523289/congstarde%20Tealium%3A%20Switch%20to%20dev.user.js
// @updateURL https://update.greasyfork.org/scripts/523289/congstarde%20Tealium%3A%20Switch%20to%20dev.meta.js
// ==/UserScript==

(function() {
var current_env = "congstar_dev";
var congstar_utag_sync = {
    "congstar_dev" : "https://tags.tiqcdn.com/utag/congstar/congstar-web/dev/utag.sync.js",
    "congstar_prod" : "https://tags.tiqcdn.com/utag/congstar/congstar-web/prod/utag.sync.js",
}
var congstar_utag = {
    "congstar_dev" : "https://ts.congstar.de/congstar-web/dev/utag.js",
    "congstar_prod" : "https://ts.congstar.de/congstar-web/prod/utag.js",
}

if (current_env && current_env != "" && congstar_utag_sync[current_env] != undefined && congstar_utag[current_env] != undefined ) {
    console.log("LP Tealium Env Switcher: Loading: " + current_env)
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.charset = "UTF-8";
    script.src = congstar_utag_sync[current_env];
    head.appendChild(script);

    setTimeout(function() {
        (function(a,b,c,d,url=congstar_utag[current_env]){
            a=url
            b=document;c='script';d=b.createElement(c);d.src=a;d.type='text/java'+c;d.async=true;
            a=b.getElementsByTagName(c)[0];a.parentNode.insertBefore(d,a);
        })();

    }, 1000);

} else {
    console.log("LP Tealium Env Switcher failed")
}

})();