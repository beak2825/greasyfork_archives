// ==UserScript==
// @name         Triage Fixes
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fixes and Enhances for Triage
// @author       Phisherman
// @match        https://mytriage.com/* //Change this to your Triage domain name or IP address
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387635/Triage%20Fixes.user.js
// @updateURL https://update.greasyfork.org/scripts/387635/Triage%20Fixes.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url = document.URL;
    var domain = window.location.hostname
    //Unchecks the Share Rule checkbox
    if(url.search(/\/rules\//i)!=-1){
        document.getElementById('activate').onclick = function() {
        document.getElementById("rule_shareable").click();
        }
    }
    //Automatically switch to the advanced editor for new rules
    if(url.search(/\/rules\/new\?/i)==-1){
        window.location.href="https://" + domain + "/rules/new?editor=advanced";
    }
})();