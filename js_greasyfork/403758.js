// ==UserScript==
// @name         Auto Kube Kube
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Play Kube Kube Automatically
// @author       Euroscam
// @match        https://kuku-kube.com/*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/403758/Auto%20Kube%20Kube.user.js
// @updateURL https://update.greasyfork.org/scripts/403758/Auto%20Kube%20Kube.meta.js
// ==/UserScript==
(function() {
    var script;

    jQuery('.play-btn').on('click', function() {
        setInterval(clickCubes, 10);
    });

    function clickCubes() {
        if (!parseInt(jQuery('span.time')[0].innerText) > 0) {
            clearInterval(script);
        }

        var count1 = 0
        var count2 = 0;

        var class1 = "";
        var class2 = "";

        jQuery('#box span').each(function() {
            var color = "" + jQuery(this).css('background-color') + "";
            if (count1 == 0 && count2 == 0) {
                count1++;
                class1 = color;
            } else {
                if (color === class1) {
                    count1++;
                } else {
                    count2++;
                    class2 = color;
                }
            }
        })

        if (count1 > count2) {
            jQuery('span[style*="' + class2 + '"]').click();
        } else {
            jQuery('span[style*="' + class1 + '"]').click();
        }
    }
})();