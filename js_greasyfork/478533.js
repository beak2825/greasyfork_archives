// ==UserScript==
// @name         Block Sub-Links
// @description  Removes all links and scripts with predefined domains on all sites.
// @author       HIDDEN-lo
// @version      1.0
// @match        *://*/*
// @match        *://akuma.moe/*
// @license MIT
// @run-at       document-start
// @namespace https://greasyfork.org/users/1206627
// @downloadURL https://update.greasyfork.org/scripts/478533/Block%20Sub-Links.user.js
// @updateURL https://update.greasyfork.org/scripts/478533/Block%20Sub-Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var blockedLinks = [
        'enquirysavagely.com',
        'janzuyejxmm.com',
        'fzkqshbim.com',
        'bootstrap.js',
        '2734478852/a.js',
        'googletagmanager.com',
        'jads.co',
        'hammer.js',
        'jquery.typeahead.min.js',
        'app.js',
        'reader.js',
        'betteradsystem.com',
        'window.adsbyjuicy',
        'betteradsystem.com',
        'adsco.re',
        'trackwilltrk.com',
        'adsbyjuicy',
        'onclickalgo.com'
    ];

    var blockedScriptContent = [
        'f128e7d4965281fb9bfdd3dbeb9285be',
        'betteradsystem.com',
        'adsbyjuicy',
        'gtag'
    ];

    function removeElement(element) {
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    };

    function checkBlocked() {
        // Checks each of the blockedLinks and sees if one matches the current page. If so, close the page.
        console.log('Checking for blocked links...');
        blockedLinks.forEach(function(link) {
            if (window.location.href.indexOf(link) > -1) {
                window.close();
                console.log('Removed redirect: ' + window.location.href);
            }
        });
    };

    function checkAndRemoveLinks() {
        console.log('Checking for blocked links...');
        var links = document.querySelectorAll('a');
        for (var i = 0; i < links.length; i++) {
            for (var j = 0; j < blockedLinks.length; j++) {
                if (links[i].href.includes(blockedLinks[j])) {
                    removeElement(links[i]);
                    console.log("Removed blocked link: " + links[i].href);
                }
            }
        }
    };

    function checkAndRemoveRedirects() {
        console.log('Checking for blocked redirects...');
        var metaRefreshTags = document.querySelectorAll('meta[http-equiv="refresh"]');
        for (var i = 0; i < metaRefreshTags.length; i++) {
            var content = metaRefreshTags[i].getAttribute('content');
            for (var j = 0; j < blockedLinks.length; j++) {
                if (content.includes(blockedLinks[j])) {
                    removeElement(metaRefreshTags[i]);
                    console.log("Removed blocked redirect: " + content);
                }
            }
        }
    };

    function checkAndRemoveScripts() {
        console.log('Checking for blocked scripts...');
        var scripts = document.querySelectorAll('script');
        for (var i = 0; i < scripts.length; i++) {
            var scriptSrc = scripts[i].getAttribute('src');
            var scriptContent = scripts[i].textContent || scripts[i].innerText;
    
            // Check the script's content and src attribute for blocked links and specific script content
            for (var j = 0; j < blockedLinks.length; j++) {
                if (scriptSrc && scriptSrc.includes(blockedLinks[j])) {
                    removeElement(scripts[i]);
                    console.log("Removed blocked script (by src): " + scriptSrc);
                } else if (scriptContent.includes(blockedScriptContent[j])) {
                    removeElement(scripts[i]);
                    console.log("Removed blocked script (by content): " + scriptContent);
                }
            }
        }
    };

    function checkAndRemoveIframes() {
        console.log('Checking for blocked iframes...');
        var iframes = document.querySelectorAll('iframe');
        for (var i = 0; i < iframes.length; i++) {
            var iframeSrc = iframes[i].getAttribute('src');
            for (var j = 0; j < blockedLinks.length; j++) {
                if (iframeSrc && iframeSrc.includes(blockedLinks[j])) {
                    removeElement(iframes[i]);
                    console.log("Removed blocked iframe: " + iframeSrc);
                }
            }
        }
    };



    // Check and remove links, redirects, and scripts on page load
    checkAll();
    function checkAll() {
        checkBlocked();
        checkAndRemoveLinks();
        checkAndRemoveRedirects();
        checkAndRemoveScripts();
        checkAndRemoveIframes();
    };

    // Timer to slow loops, as ads dont appear as ofter after a set time.
    var interval = 1000;

    function timerCounter() {
        if (interval <= 6000) {
            interval = interval + 200;
        }
    };
    
    function executeWithDynamicInterval() {
        timerCounter();
        checkAll();
        console.log("Interval: " + interval);
    
        setTimeout(executeWithDynamicInterval, interval);
    };

    executeWithDynamicInterval();
    

    document.addEventListener("DOMContentLoaded", function () {
        console.log('DOM loaded! Checking...');
        checkAll();
    });

    // Listen for DOM changes and check/remove links, redirects, and scripts again
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            console.log('Mutation detected! Removing...');
            checkAll();
        });
    });

    // Use a MutationObserver to detect dynamic script additions
    var scriptObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes) {
                console.log('Script Mutation Found! Checking...');
                for (var i = 0; i < mutation.addedNodes.length; i++) {
                    var addedNode = mutation.addedNodes[i];
                    if (addedNode.tagName === 'SCRIPT') {
                        console.log('Mutation detected! Removing...');
                        checkAll();
                    }
                }
            }
        });
    });

    observer.observe(document.body, { subtree: true, childList: true });
    scriptObserver.observe(document, { childList: true, subtree: true });

})();
