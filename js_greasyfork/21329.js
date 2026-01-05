"use strict";

/**
 * Created by Nb on 12/7/2016.
 * Transpiled from ES6 to ES5 by Babel.
 */

// ==UserScript==
// @name         MovieTV Slash Redirect
// @name:zh-CN   随缘旧域名重定向
// @name:zh-TW   隨緣舊域名重定向
// @namespace    NB-Kevin
// @version      0.1
// @description  Redirect old address.
// @description:zh-CN 重定向旧域名到 mtslash.org。
// @description:zh-TW 重定向舊域名 mtslash.org。
// @author       Nb/Kevin
// @match        http://*/*
// @match        https://*/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/21329/MovieTV%20Slash%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/21329/MovieTV%20Slash%20Redirect.meta.js
// ==/UserScript==

var OLD_ADDRESS = "www.movietvslash.com";
var ANOTHER_OLD_ADDRESS = "www.mtslash.com";
var NEW_ADDRESS = "www.mtslash.org";

/**
 * Convert a node list to array.
 * @returns {Array.<HTMLElement>}
 */
NodeList.prototype.toArray = function () {
    var that = this;
    return Array.prototype.slice.call(that);
};

var currentAddress = location.href.split('//')[1];
if (currentAddress.startsWith(OLD_ADDRESS) || currentAddress.startsWith(ANOTHER_OLD_ADDRESS)) {
    // Check whether current page is of the old address and
    // redirect if so.
    var targetAddress = location.href.replace(OLD_ADDRESS, NEW_ADDRESS).replace(ANOTHER_OLD_ADDRESS, NEW_ADDRESS);
    console.log("Redirecting to " + targetAddress + "...");
    location.replace(targetAddress);
} else {
    // otherwise check all href link and replace them with new address
    addEventListener('load', function (event) {
        var targetElements = document.querySelectorAll("[href*=\"" + OLD_ADDRESS + "\"]").toArray().concat(document.querySelectorAll("[href*=\"" + ANOTHER_OLD_ADDRESS + "\"]").toArray());
        targetElements.forEach(function (element) {
            var newAddress = element.getAttribute('href').replace(OLD_ADDRESS, NEW_ADDRESS).replace(ANOTHER_OLD_ADDRESS, NEW_ADDRESS);
            console.log("Redirecting " + element.getAttribute('href') + " to " + newAddress + "...");
            element.setAttribute('href', newAddress);
        });
    });
}