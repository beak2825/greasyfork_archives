// ==UserScript==
// @name         Set Dark Mode Cookie
// @version      1.0
// @description  Copy of Get Me Old Youtube (http://greasyfork.org/en/scripts/32906) but sets cookie for Dark Mode instead
// @author       Drewski
// @match        *://www.youtube.com/*
// @exclude      *://www.youtube.com/tv*
// @exclude      *://www.youtube.com/embed/*
// @exclude      *://www.youtube.com/live_chat*
// @run-at       document-start
// @license      https://creativecommons.org/licenses/by-sa/4.0/
// @grant        none
// @namespace https://greasyfork.org/users/174749
// @downloadURL https://update.greasyfork.org/scripts/39461/Set%20Dark%20Mode%20Cookie.user.js
// @updateURL https://update.greasyfork.org/scripts/39461/Set%20Dark%20Mode%20Cookie.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function start() {
        var cookie = getPref(),
            pref = "f6=400";
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
                if(splitC[i].trim().indexOf("f6=400") > -1) {
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
})();