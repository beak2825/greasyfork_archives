// ==UserScript==
// @name         RandInt-Getter
// @namespace    http://greasyfork.org/
// @version      0.1
// @description  get a stochastic integer in range
// @author       Cosil.C
// @grant        unsafeWindow
// @license      GPLv3
// ==/UserScript==

/**
 * @description get a stochastic integer in range
 * @param exp pattern: [|(  -*  \d+  ,  -*  \d+  )|]
 * @returns a stochastic integer with type number in range
 */
unsafeWindow.getRandInt = (exp) => {
    if ('string' != typeof exp) {
        throw 'Expression param error: the param inputed must be a string';
    }
    if (!/[\[\(]\s*-{0,1}\s*\d+\s*,\s*-{0,1}\s*\d+\s*[\]\)]/.test(exp)) {
        throw 'Expression syntax error';
    }
    let res;
    exp.replace(/([\[\(])\s*(-{0,1}\s*\d+)\s*,\s*(-{0,1}\s*\d+)\s*([\]\)])/g, (rs, $1, $2, $3, $4) => {
        let left = $1.charCodeAt(),
            min = parseInt($2.replace(/\s+/, '')),
            max = parseInt($3.replace(/\s+/, '')),
            right = $4.charCodeAt();
        if (min > max) {
            throw `Expression param error: cause ${min} > ${max}`;
        } else if (right - left == 1 && max <= min + 1) {
            throw `Expression param error: cause range is '(' and ')' but can't found any integer between ${min} and ${max}`;
        } else {
            res = min + Math.floor(Math.random() * (max - min + (right == left + 2 ? 1 : right == left + 1 ? -1 : 0))) + (left == 40 ? 1 : 0);
        }
    })
    return res;
}