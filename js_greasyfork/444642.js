// ==UserScript==
// @name         SCORM CHEATER
// @namespace    https://myleo.rp.edu.sg/SCORM/Home/
// @version      0.4
// @description  Reveal all the answers!
// @author       SUPA HAKKA
// @match        https://myleo.rp.edu.sg/SPStorage/ShareFolder/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @run-at document-start
// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/444642/SCORM%20CHEATER.user.js
// @updateURL https://update.greasyfork.org/scripts/444642/SCORM%20CHEATER.meta.js
// ==/UserScript==


    let count = 0;
    const oldsplit = window.String.prototype.split; // Grab original function
    window.String.prototype.split = function(){ // Redefine the function
        if (typeof arguments.callee.caller.caller == 'function' && arguments.callee.caller.caller.toString().includes("reviewWithCorrectAnswers") && count == 0) {
            count = 1;
            let temp = arguments.callee.caller.caller.toString();
            const reg = /var c=[A-Za-z][A-Za-z]\(a\)\,d\=[A-Za-z][A-Za-z]\(c\.settings\(\)\)\;/
            temp = temp.replace(reg, 'return "reviewWithCorrectAnswers";');
            let newfunction = new Function(temp.substring(temp.indexOf('{')+1,temp.lastIndexOf('}')));
            newfunction();
            return;
        }
        return oldsplit.apply(this, arguments); // Use .apply to continue as normal
    }

