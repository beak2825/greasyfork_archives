// ==UserScript==
// @name        JoyReactor Onion Links
// @description Ссылка на onion-зеркало в шапке и под постами
// @icon        http://joyreactor.cc/favicon.ico
// @namespace   https://github.com/qiwichupa/userscripts/blob/master/JoyReactor_Onion_Links
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @include     https://*.reactor.cc/*
// @include     https://joyreactor.cc/*
// @run-at      document-idle
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @version     20250801.1740
// @author      qiwichupa
// @run-at      document-end
// @license      CC-BY-SA-4.0
// @downloadURL https://update.greasyfork.org/scripts/499282/JoyReactor%20Onion%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/499282/JoyReactor%20Onion%20Links.meta.js
// ==/UserScript==

// waitForKeyElements https://raw.githubusercontent.com/CoeJoder/waitForKeyElements.js/refs/heads/master/waitForKeyElements.js
function waitForKeyElements(selectorOrFunction, callback, waitOnce, interval, maxIntervals) {
    if (typeof waitOnce === "undefined") {
        waitOnce = true;
    }
    if (typeof interval === "undefined") {
        interval = 300;
    }
    if (typeof maxIntervals === "undefined") {
        maxIntervals = -1;
    }
    if (typeof waitForKeyElements.namespace === "undefined") {
        waitForKeyElements.namespace = Date.now().toString();
    }
    var targetNodes = (typeof selectorOrFunction === "function")
            ? selectorOrFunction()
            : document.querySelectorAll(selectorOrFunction);

    var targetsFound = targetNodes && targetNodes.length > 0;
    if (targetsFound) {
        targetNodes.forEach(function(targetNode) {
            var attrAlreadyFound = `data-userscript-${waitForKeyElements.namespace}-alreadyFound`;
            var alreadyFound = targetNode.getAttribute(attrAlreadyFound) || false;
            if (!alreadyFound) {
                var cancelFound = callback(targetNode);
                if (cancelFound) {
                    targetsFound = false;
                }
                else {
                    targetNode.setAttribute(attrAlreadyFound, true);
                }
            }
        });
    }

    if (maxIntervals !== 0 && !(targetsFound && waitOnce)) {
        maxIntervals -= 1;
        setTimeout(function() {
            waitForKeyElements(selectorOrFunction, callback, waitOnce, interval, maxIntervals);
        }, interval);
    }
}



function actionFunction(jNode) {
    // Remove any existing onion links
    $('.onion-link').remove();
    
    // HEADER
    // Define the domain for the onion link
    var domain = 'http://reactorccdnf36aqvq34zbfzqyrcrpg3eyhilauovitrvmcjovsujmid.onion';

    // Create a new anchor element for the header link
    var headerLink = $('<a/>');

    // Create a span element to separate links
    var span = $('<span/>').text(' | ');

    // Set the href attribute of the header link to the onion link
    headerLink.attr('href', domain + window.location.href.replace(window.location.origin, ""));

    // Set the text of the header link
    headerLink.text('Onion');

    // Insert the new header link and span after the top logo
    $('.top_logo').after(headerLink.addClass('onion-link')).after(span.addClass('onion-link'));

    // POST LINKS
    //  (joyreactor.cc) Iterate over each div with the specified class
    $('.flex.gap-2.xl\\:gap-1').each(function() {
        const $div = $(this);

        // Find only the first anchor tag within the div
        $div.find('a:first').each(function() {
            // Get the original href of the first link
            const originalHref = $(this).attr('href');

            // Modify the href to point to the new onion domain
            const newDomain = domain;
            const newHref = originalHref.replace(/^(\/.*)/, `${newDomain}$1`);

            // Create a new link element for the post
            var $postLink = $('<a/>')
                .attr('href', newHref) // Set the href of the new link
                .text('Onion') // Set the text of the new link
                .addClass('onion-link'); // Add a class to the new link

            // Append the new link to the div
            $div.append($postLink);
        });
    });


    //  (joy.reactor.cc) Find all span elements with the class 'link_wr' and their anchor tags
    $('.link_wr').each(function() {
        const $span = $(this);

        // Find the anchor tag within the span
        const $link = $span.find('a.link:first');

        // Check if the link exists
        if ($link.length) {
            // Get the original href of the link
            const originalHref = $link.attr('href');

            // Modify the href to point to the new onion domain
            const newDomain = domain;
            const newHref = originalHref.replace(/^(\/.*)/, `${newDomain}$1`);

            // Create a new link element for the post
            var $postLink = $('<a/>')
                .attr('href', newHref) // Set the href of the new link
                .text('onion') // Set the text of the new link
                .addClass('onion-link'); // Add a class to the new link

            // Append the new link inside the span
            $span.append($postLink);
        }
    });
}

// Wait for the top logo element to be available and then execute actionFunction
waitForKeyElements("[class^=top_logo]", actionFunction);

// Set an interval to repeatedly execute actionFunction every 2000 milliseconds (2 seconds)
setInterval(actionFunction, 2000);
