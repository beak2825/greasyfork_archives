// ==UserScript==
// @name         PWA title bar colorizer
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Force focus and blur colors for PWA title bars
// @author       Rayke
// @match https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439794/PWA%20title%20bar%20colorizer.user.js
// @updateURL https://update.greasyfork.org/scripts/439794/PWA%20title%20bar%20colorizer.meta.js
// ==/UserScript==


// This script makes PWA title bars act the same way as a normal window by changing 
// color when they gain/lose focus.  You can define the focus/blur colors below
//
// As usual this does not work with Spotify.  They are waging a war on UI friendly desktop
// applications even when it comes to their PWA.  They actively make sure it is the color
// they want.
(function () {
    'use strict';

    var firstSet = false;
    var focusColor = "#096900";
    var blurColor = "#414141";

    function getMetaNode(metaName) {
        const metaTags = document.getElementsByTagName('meta');

        for (let i = 0; i < metaTags.length; i++) {
            if (metaTags[i].getAttribute('name') === metaName) {
                return metaTags[i];
            }
        }

        return null;
    }

    function setThemeColor(color) {
        var node = getMetaNode("theme-color");

        if (null !== node) {
            node.setAttribute('content', color);
        }

        return;
    }

    const observer = new MutationObserver((mutationsList, observer) => {

        if (firstSet) {
            return;
        }

        setThemeColor(focusColor);

        firstSet = true;
    });

    var observerTarget = getMetaNode("theme-color");

    if (null !== observerTarget) {

        window.onblur = () => {
            setThemeColor(blurColor);
        };
    
        window.onfocus = () => {
            setThemeColor(focusColor);
        };
    
        window.onload = () => {
            setThemeColor(focusColor);
        }
    
    
        // Watch for changes to meta theme-color
        observer.observe(observerTarget,
            {
                attributes: true,
                childList: false,
                subtree: false
            }
        );
    }

})();