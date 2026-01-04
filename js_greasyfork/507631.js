// ==UserScript==
// @name         [iqRPG]删除验证码和失效BOSS
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  删除验证码和失效BOSS
// @author       Truth_Light
// @license      Truth_Light
// @match        https://test.iqrpg.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507631/%5BiqRPG%5D%E5%88%A0%E9%99%A4%E9%AA%8C%E8%AF%81%E7%A0%81%E5%92%8C%E5%A4%B1%E6%95%88BOSS.user.js
// @updateURL https://update.greasyfork.org/scripts/507631/%5BiqRPG%5D%E5%88%A0%E9%99%A4%E9%AA%8C%E8%AF%81%E7%A0%81%E5%92%8C%E5%A4%B1%E6%95%88BOSS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var checkAndRemoveCaptcha = function() {
        var captchaElement = document.querySelector(".overlay").parentNode;
        if (captchaElement) {
            captchaElement.remove();
            clearInterval(captchaInterval);
        }
    };

    var checkAndRemoveBossElements = function() {
        var bossListElement = document.querySelector(".boss-container");
        if (bossListElement) {
            var childElements = bossListElement.children;
            for (var i = 0; i < childElements.length; i++) {
                var secondDiv = childElements[i].querySelector('div:nth-child(2) > div:first-child');

                if (secondDiv) {
                    var widthStyle = secondDiv.style.width;
                    var widthPercentage = parseFloat(widthStyle);

                    if (widthPercentage < 11) {
                        childElements[i].remove();
                    }
                }
            }
        }
    };
    var captchaInterval = setInterval(checkAndRemoveCaptcha, 100);
    var bossInterval = setInterval(checkAndRemoveBossElements, 100);
})();
