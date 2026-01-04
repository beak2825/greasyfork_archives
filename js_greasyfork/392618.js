// ==UserScript==
// @name         ESJ Bomber
// @namespace    https://mmis1000.me/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.esjzone.cc/detail/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392618/ESJ%20Bomber.user.js
// @updateURL https://update.greasyfork.org/scripts/392618/ESJ%20Bomber.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.createElement = new Proxy(document.createElement, {
        apply (target, thisArg, argumentsList) {
            if (argumentsList[0] === 'iframe') {
                return Reflect.apply(target, thisArg, ['template'])
            }

            return Reflect.apply(target, thisArg, argumentsList)
        }
    })
    // Your code here...
})();