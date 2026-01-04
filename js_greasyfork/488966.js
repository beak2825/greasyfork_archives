// ==UserScript==
// @name         南玻e学
// @namespace    http://tampermonkey.net/
// @version      2024-02-28
// @description  倍率学习!
// @author       木木
// @license MIT
// @match        https://studysmart365.csgholding.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488966/%E5%8D%97%E7%8E%BBe%E5%AD%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/488966/%E5%8D%97%E7%8E%BBe%E5%AD%A6.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const originSetItem = window.localStorage.setItem;
    window.localStorage.setItem = function (key, value) {
        if (key.startsWith("studyTime")) {
            let studyTimeJson = JSON.parse(value);
            studyTimeJson.data[0].duration *= 10;
            value = JSON.stringify(studyTimeJson);
        }
        return originSetItem.call(this, key, value);
    };


})();
