// ==UserScript==
// @name        Disable Polymer YouTube Improved
// @description Disabled the new 2017 YouTube Redesign (polymer) from appearing on page load.
// @author      Jason Maggiacomo
// @license     MIT
// @version     1.1
// @match       *://*.youtube.com/*
// @run-at      document-start
// @grant       none
// @namespace https://greasyfork.org/users/307480
// @downloadURL https://update.greasyfork.org/scripts/384687/Disable%20Polymer%20YouTube%20Improved.user.js
// @updateURL https://update.greasyfork.org/scripts/384687/Disable%20Polymer%20YouTube%20Improved.meta.js
// ==/UserScript==

function start() {
    var cookie = getPref(),
        pref = "f6=8";
    if(cookie === "fIsAlreadySet") {
        return;
    } else if(cookie !== "noPref"){
        for(var i = 0; i < cookie.length; ++i) {
            pref = pref + "&" + cookie[i].key + "=" + cookie[i].value;
        }
    }
    changePref(pref);
}
    
function changePref(values) {
    var d = new Date();
    d.setTime(d.getTime() + (100*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = "PREF=" + values + ";" + expires + ";domain=.youtube.com;hostonly=false;path=/";
    location.reload();
}

function getPref() {
    var cookie = document.cookie,
        splitC = cookie.split(";");
    for(var i = 0; i < splitC.length; ++i) {
        if(splitC[i].trim().indexOf("PREF") === 0) {
            if(splitC[i].trim().indexOf("f6=8") > -1) {
                return "fIsAlreadySet";
            }
            var c = [],
                splitValues = splitC[i].substring(5).split("&");
            for(var k = 0; k < splitValues.length; ++k) {
                var splitV = splitValues[k].split("=");
                if(splitV[0] !== "f6") {
                    var kv = {};
                    kv.key = splitV[0];
                    kv.value = splitV[1];
                    c.push(kv);
                }
            }
            return c;
        }
    }
    return "noPref";
}
start();