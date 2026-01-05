// ==UserScript==
// @name         freebmd marriage locator search helper
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  freebmd marriage locator search helper description
// @author       You
// @match        http://www.freebmd.org.uk/cgi/search.pl
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25143/freebmd%20marriage%20locator%20search%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/25143/freebmd%20marriage%20locator%20search%20helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var targetSelector = '[href^="javascript:gopage"]';
    var targetList = document.querySelectorAll('[href^="javascript:gopage"]');
    var redirectURL = 'http://www.marriage-locator.co.uk/cgi-bin/ML_search.cgi?year={year}&qtr={qtr}&vol={vol}&page={page}';
    var stringMapping = {
        0: '{year}',
        1: '{qtr}',
        3: '{vol}',
        4: '{page}'
    };

    for (var i = 0; i < targetList.length; i++) {
        var tr = closestByTagName(targetList[i], 'TR');
        var hrefContent = targetList[i].getAttribute("href");
        var regExp = /\(([^)]+)\)/;
        var params = regExp.exec(hrefContent);
        var paramsArray = params[1].split(',');
        var url = redirectURL;
        
        for (var key in stringMapping) {
            url = url.replace(stringMapping[key], paramsArray[key]);
        }
        url = url.split("'").join("");

        var buttonContainer = document.createElement("td");
        buttonContainer.innerHTML = '<a href="' + url + '" target="_blank">Find Marriage</a>';
        var linkTag = buttonContainer.querySelector("a");
        // You can edit stylesheet here, buttonContainer is the td contains the <a> tag
        buttonContainer.style["padding"] = "5px";
        buttonContainer.style["background-color"] = "#cc9999";
        // linkTag is the text
        linkTag.style["color"] = "#000";
        tr.appendChild(buttonContainer);
    }

    function closestByTagName(el, tagName) {
        while (el.tagName != tagName) {
            el = el.parentNode;
            if (!el) {
                return null;
            }
        }
        return el;
    }
})();