// ==UserScript==
// @name         Youtrack My Agile Board
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Replace "Доски Agile" link with link to only your tasks.
// @author       Buzanov Viktor
// @match        https://youtrack.plan365.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411925/Youtrack%20My%20Agile%20Board.user.js
// @updateURL https://update.greasyfork.org/scripts/411925/Youtrack%20My%20Agile%20Board.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const myBoardUrl = "https://youtrack.plan365.org/agiles/94-209/95-334?query=%23%7B%D0%9D%D0%B0%D0%B7%D0%BD%D0%B0%D1%87%D0%B5%D0%BD%D0%BD%D1%8B%D0%B5%20%D0%BD%D0%B0%20%D0%BC%D0%B5%D0%BD%D1%8F%7D%20";
    function findLinkElement() {
        const className = "ring-link ring-link_pseudo";
        var linkElements = document.getElementsByClassName(className);
        for (var elem of linkElements) {
            console.log(elem.href)
            if (elem.href.indexOf("agiles") !== -1) {
                return elem;
            }
        }
    }
    const interval = setInterval(function() {
        var linkElement = findLinkElement()
        if (linkElement) {
            linkElement.href = myBoardUrl;
            clearInterval(interval);
        }
    }, 100);
})();