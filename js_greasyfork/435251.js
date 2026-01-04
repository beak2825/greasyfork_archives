// ==UserScript==
// @name         No Code November
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       You
// @description  禁止做题
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435251/No%20Code%20November.user.js
// @updateURL https://update.greasyfork.org/scripts/435251/No%20Code%20November.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const domains = [
        "leetcode.com",
        "codeforces.com",
        "codewars.com",
        "topcoder.com",
        "coderbyte.com",
        "projecteuler.net",
        "hackerrank.com",
        "codechef.com",
        "exercism.org"
    ]

    domains.forEach((d) => {
        if(document.domain.indexOf(d) > -1) {
            location.href = "about:blank"
        }
    })

    // Your code here...
})();