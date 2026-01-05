// ==UserScript==
// @name         Google: Link selector
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Allows you to select Google links with the keyboard
// @author       divide100
// @match        http*://www.google.ca/search?*
// @grant        GM_openInTab
// @require https://greasyfork.org/scripts/5679-wait-for-elements/code/Wait%20For%20Elements.js?version=46106
// @downloadURL https://update.greasyfork.org/scripts/13625/Google%3A%20Link%20selector.user.js
// @updateURL https://update.greasyfork.org/scripts/13625/Google%3A%20Link%20selector.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

var util = {
    log: function () {
        var args = [].slice.call(arguments);
        args.unshift('%c' + SCRIPT_NAME + ':', 'font-weight: bold;color: purple;');
        console.log.apply(console, args);
    },
    q: function(query, context) {
        return (context || document).querySelector(query);
    },
    qq: function(query, context) {
        return [].slice.call((context || document).querySelectorAll(query));
    }
};

var i = 0;
var results = util.qq('div.g', document.body);
results[i].style.border = "1px solid #4285f4";
results[i].style.borderRadius = "4px";

var SCRIPT_NAME = "Google Link Selector";

window.onkeypress = function(e) {
    switch(e.keyCode) {
            //w
        case 119:
            if(i > 0) {
                results[i--].style.border = "none";
            }
            break;
            //s
        case 115:
            if(i < results.length - 1) {
                results[i++].style.border = "none";
            }
            break;
            //enter
        case 13:
            if(e.shiftKey) {
                GM_openInTab(util.q('a', results[i]).href, false);
            }
            else {
                window.location.href = util.q('a', results[i]);
            }
            break;
    }
    results[i].style.border = "1px solid #4285f4";
    results[i].style.borderRadius = "4px";
    results[i].scrollIntoView();
};