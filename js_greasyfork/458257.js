// ==UserScript==
// @name         Show Only C-Drama
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Tries to remove all but C-Drama from iq.com when browsing
// @author       pfn0#0001
// @license      MIT
// @match        https://www.iq.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=iq.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458257/Show%20Only%20C-Drama.user.js
// @updateURL https://update.greasyfork.org/scripts/458257/Show%20Only%20C-Drama.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener("load", x => {
        document.querySelectorAll("[class=intl-mod-vip-ad-wrap]").forEach(x => x.parentNode.parentNode.removeChild(x.parentNode));
        var f = document.querySelector(".qrcode-wrap");
        if (f) {
            f.parentNode.removeChild(f);
        }
        f = document.querySelector(".vip-tag");
        if (f) {
            f.parentNode.removeChild(f);
        }
        f = Array.prototype.filter.call(document.getElementsByTagName("H2"), x => x.textContent == "PRIDE Selection")[0];
        if (f) {
            f.parentNode.parentNode.removeChild(f.parentNode);
        }
        Array.prototype.filter.call(document.querySelectorAll(".slide-item-wrap"),
                                    i => i[Object.getOwnPropertyNames(i)
                                           .filter(x => x.startsWith("__reactProps"))[0]].children.props.item.categoryTagList.indexOf("Chinese Mainland") == -1)
            .forEach(e => e.parentNode.removeChild(e))
    }, true);
})();