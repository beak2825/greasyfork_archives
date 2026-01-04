// ==UserScript==
// @name         ExternallinkDoctor
// @namespace    gwentmaster@vivaldi.net
// @version      0.1
// @description  Convert external links to the raw link.
// @author       gwentmaster <gwentmaster@vivaldi.net>
// @match        *://juejin.cn/*
// @match        *://www.jianshu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434648/ExternallinkDoctor.user.js
// @updateURL https://update.greasyfork.org/scripts/434648/ExternallinkDoctor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let hostMap = {
        juejin: "juejin.cn",
        jianshu: "jianshu.com"
    };
    let doctorMap = {
        juejin: () => {
            document.querySelectorAll("a").forEach((a) => {
                let link = a.getAttribute("href");
                if (/.+\:\/\/link\.juejin\.cn\/?\?.*target=/.test(link)) {
                    let params = new URLSearchParams(new URL(link).search);
                    a.setAttribute("href", params.get("target"));
                }
            });
        },
        jianshu: () => {
            document.querySelectorAll("a").forEach((a) => {
                let link = a.getAttribute("href");
                if (/.+\:\/\/links.jianshu.com\/go\/?\?.*to=/.test(link)) {
                    let params = new URLSearchParams(new URL(link).search);
                    a.setAttribute("href", params.get("to"))
                }
            });
        }
    };

    let hostname = window.location.hostname;
    for (let site in hostMap) {
        if (hostname.indexOf(hostMap[site]) !== -1) {
            window.onload = doctorMap[site];
            break;
        }
    }

})();