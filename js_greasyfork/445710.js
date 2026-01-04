// ==UserScript==
// @name         Return to residency
// @namespace    https://greasyfork.org/en/users/2402-n-tsvetkov
// @version      0.6
// @description  Return to residency after some time. Claim daily rewards, claim weekly rewards.
// @author       Nikolai Tsvetkov
// @match        https://www.erepublik.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=erepublik.com
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/445710/Return%20to%20residency.user.js
// @updateURL https://update.greasyfork.org/scripts/445710/Return%20to%20residency.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (window.top != window.self) {
        return;
    }
    var returnIn = 5e3 * 60;
    var pageRefresh = 5e3 * 60;
    var homePage = window.Environment.isOnHomepage || false;
    var erepublik = window.erepublik || {};
    var lang = erepublik.settings.culture;
    var O = erepublik.citizen || {};
    var H = O.residence;
    var t = window.csrfToken;
    var e = localStorage.notInResidence || 0;
    var dailiesToClaim;

    function returnToResidence(countryId, regionId) {
        localStorage.notInResidence = 0;
        var body = "_token=" + t + "&battleId=0&toCountryId=" + countryId + "&inRegionId=" + regionId;
        fetch("/" + lang + "/main/travel/", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            credentials: "same-origin",
            body: body,
        })
            .then(() => {
            location.reload();
        });
    }

    function getRewards() {
        setTimeout(() => {
            var collectAll = document.querySelector('.collectAll');
            console.log(collectAll);
            if (collectAll) {
                collectAll.click();
            }
        }, 5e3);
    }

    function collectDailies() {
        if (O.dailiesToCollect > 0) {
            setTimeout(function() {
                document.querySelector("#dailyMissionsPopupTrigger").click();
                setTimeout(function() {
                    let timer = setInterval((dailiesToClaim) => {
                        let claimButton = document.querySelector(".claimButton");
                        if (claimButton) {
                            setTimeout(() => {
                                claimButton.click();
                            }, 1e3);
                        } else {
                            clearInterval(timer);
                            let closeButton = document.querySelector(".closeButton");
                            closeButton && setTimeout(() => closeButton.click(), 5e3);
                        }
                    }, 1e3);
                }, 1e3);
            }, 1e3);
        }
    }

    if (homePage) {
        console.log('home');
        getRewards();
        collectDailies();
        if (H.hasResidence && O.regionLocationId != H.regionId) {
            var now = Date.now();
            if (e == 0) {
                localStorage.notInResidence = now;
            } else {
                if ((now - e) >= returnIn) {
                    returnToResidence(H.countryId, H.regionId)
                }
            }
        } else {
            localStorage.notInResidence = 0;
        }

        setTimeout(() => location.reload(), pageRefresh)
    }

})();