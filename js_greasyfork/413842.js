// ==UserScript==
// @name         Facebook Ad Preferences Cleaner
// @namespace    https://www.facebook.com/ds/preferences/
// @version      1.01
// @description  Automatically removes Facebook Ad "preferences" upon loading https://www.facebook.com/ds/preferences/
// @author       JustSomeGuy
// @include      https://www.facebook.com/ds/preferences/
// @grant        none
// @license      MIT
// @donation     https://www.paypal.com/paypalme/iappreciateyoutoo
// @downloadURL https://update.greasyfork.org/scripts/413842/Facebook%20Ad%20Preferences%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/413842/Facebook%20Ad%20Preferences%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function () {
        openContainer();
        removeInterests();
    });

    var removeInterests = setInterval(function() {
        var removeDiv = getDivContainer();
        if (typeof removeDiv !== 'undefined') {
            seeMore();
            removeDiv.click();
        } else {
            clearInterval(removeInterests);
            console.log(getCategory());
            if (getCategory() !== "Removed interests") {
                location.reload();
            }
        }
    }, 250);


    function getDivContainer() {
        var baseLoc = document.getElementsByTagName('iframe')[0];
        var containerMap = [1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1];
        baseLoc = baseLoc.contentWindow.document;
        for (var i = 0, len = containerMap.length; i < len; i++) {
            baseLoc = baseLoc.childNodes[containerMap[i]];
        }
        for (var i = 0, len = baseLoc.children.length; i < len; i++) {
            if (baseLoc.childNodes[i].childNodes[0].childNodes[0].childNodes[0].childNodes[1].innerHTML == "Remove") {
                return baseLoc.childNodes[i].childNodes[0].childNodes[0].childNodes[0].childNodes[0];
            }
        }
    }

    function getCategory() {
        var categoryLoc = document.getElementsByTagName('iframe')[0];
        var containerMap = [1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        categoryLoc = categoryLoc.contentWindow.document;

        for (var i = 0, len = containerMap.length; i < len; i++) {
            categoryLoc = categoryLoc.childNodes[containerMap[i]];
        }
        return categoryLoc.innerHTML;
    }

    function seeMore() {
        var baseLoc = document.getElementsByTagName('iframe')[0];
        var containerMap = [1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 2];

        baseLoc = baseLoc.contentWindow.document;
        for (var i = 0, len = containerMap.length; i < len; i++) {
            baseLoc = baseLoc.childNodes[containerMap[i]];
        }

        setTimeout(function() {
            if (typeof(baseLoc) == 'undefined' || baseLoc == null) {
                return;
            } else {
                baseLoc.click();
                seeMore();
            }
        }, 100);
    }

    function openContainer() {
        var baseLoc = document.getElementsByTagName('iframe')[0];
        var containerMap = [1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1];
        baseLoc = baseLoc.contentWindow.document;
        for (var i = 0, len = containerMap.length; i < len; i++) {
            baseLoc = baseLoc.childNodes[containerMap[i]];
        }

        if (baseLoc.parentNode.childNodes[2].classList.contains('hidden_elem')) {
            baseLoc.click();
        }
    }
})();
