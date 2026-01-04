// ==UserScript==
// @name         MDN good, W3Schools bad!
// @namespace    https://jonas.ninja/
// @version      1.0.0
// @description  A friendly reminder to web dev learners that W3Schools is not a good resource, whereas MDN is a great resource.
// @author       @iv_njonas
// @match        https://www.google.com/search?*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/39750/MDN%20good%2C%20W3Schools%20bad%21.user.js
// @updateURL https://update.greasyfork.org/scripts/39750/MDN%20good%2C%20W3Schools%20bad%21.meta.js
// ==/UserScript==
/* jshint asi: true, multistr: true */

(function() {
    'use strict';

    var styles = '\
a[href^="https://developer.mozilla.org/"]:not(.fl):after {\
    content: "GOOD RESOURCE ?";\
    display: inline-block;\
    margin-left: 12px;\
    padding: 2px 6px 0;\
    color: green;\
    background-color: lightgreen;\
    border: 1px solid green;\
}\
a[href^="https://www.w3schools.com/"]:not(.fl):after {\
    content: "TERRIBLE RESOURCE ?";\
    display: inline-block;\
    margin-left: 12px;\
    padding: 2px 6px 0;\
    color: firebrick;\
    background-color: orange;\
    border: 1px solid firebrick;\
}\
#res h3.r {\
    overflow: visible;\
}\
'
    GM_addStyle(styles)
})();