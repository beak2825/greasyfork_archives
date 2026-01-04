// ==UserScript==
// @name         general-functions
// @namespace    general-functions-1
// @version      0.1
// @description  general functions for private-use script
// @license      MIT
// @match        https://google.com
// @downloadURL https://update.greasyfork.org/scripts/446923/general-functions.user.js
// @updateURL https://update.greasyfork.org/scripts/446923/general-functions.meta.js
// ==/UserScript==

function string_contains_substrings(mystring, list_of_substrs) {
    for (let substr of list_of_substrs) {
        if (mystring.includes(substr)) {
            return true;
        }
    }
    return false;
}
