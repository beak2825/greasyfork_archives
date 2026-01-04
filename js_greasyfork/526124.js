// ==UserScript==
// @name         Mchl slays
// @namespace    http://tampermonkey.net/
// @version      12323213131.0
// @description  slayduckwpwpw
// @author       You
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526124/Mchl%20slays.user.js
// @updateURL https://update.greasyfork.org/scripts/526124/Mchl%20slays.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const slaydung = document.createElement('img');
    slaydung.src = `data:image/webp;base64,UklGRooDAABXRUJQVlA4WAoAAAAQAAAAKwAAHAAAQUxQSAYBAAABkGNr27FX7xPbdirbtl1lANYEnNaurJqVndatdWwbz3Pw6X1HEBETwJSCY1nHyunDBw+u96caM0yAcdRNXvqASNKIv56NBoJmPss/SC1+GnHQBjKfIGmIZ4mgARS+JY3floI670ek+YcSUANDqB29j1BjeUs8L2xUBHzlgiM6iiANudCPJGV5nOjARAkL+87pdw0oMGj4zImubOV0x34Rb2wEmdhvxP/OQSb9pwDYBFIGc7/50WNnKWY8i/ywA6T0DkjAlx5SIV9EwD74D4ZRBHpq95/9ExLydzUwBuW/xaBjPcZ0dkjQ73GMhXwVBQcBulAUutXXvydhf8Zl/RIH22dQHFoHVlA4IF4CAAAwDgCdASosAB0APm0ukUYkIqGhKqwAgA2JbAC7HYCNAeoD7M9IB+sfr/9ElksP7S2FJ9E5S36wbdXeCLc+9Z1AlQSEB6iucr6O/5/uD/yP+gf67gWv1PEN8j1Tz0e++teffIMKHFol+bRBzEE8KR+NQ7wVlldFpgOOSAD+nk+f6URKy10TmtrKAMOJM67d7+2BtVJXL0xDGJ8ki2m9L8ySUU4O/WD8Va3h6Ngguhg96cLc6E06U3/+AnKKBH2o6RH+18MA10kWLJQVAcSmPUtUWVgI7ESNJWwY/4C4x3nmpwIfuhA+vOfJK7y6vizrf59ei+XdEADfgoQDAo75lt63kSGUDUfyt1YEXyKprRj8zt25Xh3UflothR/9fHOf5+SqrRCeaCl5Z6NHn7xgOQg5s47Yn/knc1jbwEQCgATdz2xxXxuS0aFBe3aZv0xcU1iF57ryqpdhlLRQQPYogs0//1RpNRNUCvSB2wkqqTdDHe8f80R/INn+4Waw5/n9aBVt9I3aSUEy8+t/P/AN57eCg/fyhcV4cwuWaBP2BSQhq9KzjM2qEn3hC/gnEH8oYtul9p38nieC2+vYghgjmjYq/4Tv37jSYa4ZdKQTJKNWktfL+Hkk6e4of0SulEJR8YeZ6fvHHPzbPwzJ1WBdgmREFcJTmgwH8hUx18tkZJ+DhtHfKGN/X3DBf1hro4/VBoW4F7JbsJCMAAFHrJBLDftzX/P/n/4mDyddzfY73HQotWw41nrnPtlc8G5UVfHPNnXxBfgPPUJlHstzMCOKP2Mz5Xhyk8uvRfncACDGIAA=`;
    slaydung.width = 26;
    slaydung.height = 17;
    const heartIcon = document.querySelector('.icon8___j20PB');
    heartIcon.parentNode.insertBefore(slaydung, heartIcon.nextSibling);
})();

