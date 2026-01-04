// ==UserScript==
// @name         Remove Experimental / Deprecated Useless APIs
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  to remove useless APIs (either experimental or deprecated) like IdleDetector
// @author       CY Fung
// @match        https://*/*
// @match        http://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant               none
// @run-at              document-start
// @license             MIT
// @compatible          chrome
// @compatible          edge
// @compatible          firefox
// @compatible          safari
// @compatible          opera
// @unwrap
// @allFrames
// @inject-into page
// @downloadURL https://update.greasyfork.org/scripts/468412/Remove%20Experimental%20%20Deprecated%20Useless%20APIs.user.js
// @updateURL https://update.greasyfork.org/scripts/468412/Remove%20Experimental%20%20Deprecated%20Useless%20APIs.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (typeof IdleDetector === 'function') {
        try {
            IdleDetector = undefined;
        } catch (e) { }
        delete window.IdleDetector;
    }

    if (typeof webkitCancelAnimationFrame === 'function') {
        try {
            webkitCancelAnimationFrame = undefined;
        } catch (e) { }
        delete window.webkitCancelAnimationFrame;
    }

    if (typeof webkitRequestAnimationFrame === 'function') {
        try {
            webkitRequestAnimationFrame = undefined;
        } catch (e) { }
        delete window.webkitRequestAnimationFrame;
    }

    if (typeof styleMedia === 'function') {
        // This feature is deprecated/obsolete and should not be used.
        try {
            styleMedia = undefined;
        } catch (e) { }
        delete window.styleMedia;
    }

    if (typeof launchQueue === 'object') {
        // This feature is experimental. Use caution before using in production.
        try {
            launchQueue = undefined;
        } catch (e) { }
        delete window.launchQueue;
    }

    if (typeof webkitRequestFileSystem === 'function') {
        // This feature is deprecated/obsolete and should not be used.
        try {
            webkitRequestFileSystem = undefined;
        } catch (e) { }
        delete window.webkitRequestFileSystem;
    }

    if (typeof webkitResolveLocalFileSystemURL === 'function') {
        // This feature is non-standard and should not be used without careful consideration.
        try {
            webkitResolveLocalFileSystemURL = undefined;
        } catch (e) { }
        delete window.webkitResolveLocalFileSystemURL;
    }

    if (typeof VRDisplayEvent === 'function') {
        // This feature is deprecated/obsolete and should not be used.
        try {
            VRDisplayEvent = undefined;
        } catch (e) { }
        delete window.VRDisplayEvent;
    }

    if (typeof HTMLFrameSetElement === 'function') {
        // This feature is deprecated/obsolete and should not be used.
        try {
            HTMLFrameSetElement = undefined;
        } catch (e) { }
        delete window.HTMLFrameSetElement;
    }

    if (typeof CanMakePaymentEvent === 'function') {
        // This feature is experimental. Use caution before using in production.
        try {
            CanMakePaymentEvent = undefined;
        } catch (e) { }
        delete window.CanMakePaymentEvent;
    }


    if (typeof PositionSensorVRDevice === 'function') {
        // This feature is deprecated/obsolete and should not be used.
        try {
            PositionSensorVRDevice = undefined;
        } catch (e) { }
        delete window.PositionSensorVRDevice;
    }

    if (typeof PerformanceTiming === 'function') {
        // This feature is deprecated/obsolete and should not be used.
        try {
            PerformanceTiming = undefined;
        } catch (e) { }
        delete window.PerformanceTiming;
    }

    if (typeof navigation === 'function') {
        // This feature is experimental. Use caution before using in production.
        try {
            navigation = undefined;
        } catch (e) { }
        delete window.navigation;
    }




    /*

   let arr = ["navigation", "onsearch", "trustedTypes",
    "onappinstalled", "onbeforeinstallprompt", "onbeforexrselect", "oncancel", "oncontextlost", 
    "oncontextrestored", "onmousewheel", "onpointerrawupdate",
     "scheduler", "chrome", "credentialless", "launchQueue", 
     "onbeforematch", "onbeforetoggle", "originAgentCluster", 
     "oncontentvisibilityautostatechange", "openDatabase", "webkitRequestFileSystem", "webkitResolveLocalFileSystemURL"];

     */

    // Your code here...
})();