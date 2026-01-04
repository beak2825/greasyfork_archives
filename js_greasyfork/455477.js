// ==UserScript==
// @name         xss攻击
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  xssAttack
// @author       v-wei
// @match        *://39.107.82.92:18080/520/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @include      *://39.107.82.92:18080/520/index.html/*
// @include      *://39.107.82.92:18080/*
// @grant        none
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/455477/xss%E6%94%BB%E5%87%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/455477/xss%E6%94%BB%E5%87%BB.meta.js
// ==/UserScript==
(function () {
    'use strict';
    // Your code here...
    var removeNodes = function (head) {
        let arr = []
        // debugger
        for (let index = 0; index < head.length; index) {
            if (head[index] > head[index + 1]) {
                arr.push(head[index])
            }
        }
        return arr;
    };
    console.log(removeNodes([5, 2, 13, 3, 8]))
})();


