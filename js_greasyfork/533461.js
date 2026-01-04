// ==UserScript==
// @name        Get OpenStreetMap Leaflet object
// @match       *://www.openstreetmap.org/*
// @match       *://www.opengeofiction.net/*
// @match       *://opengeofiction.net/*
// @version     1.1
// @author      CyrilSLi
// @description Get the Leaflet object of OpenStreetMap's website
// @license     MIT
// ==/UserScript==

unsafeWindow.userscriptMap = null;
const callbacks = [];
unsafeWindow.onOSMReady = function (fn) {
    if (typeof fn === 'function') {
        if (unsafeWindow.userscriptMap) {
            fn();
        } else {
            callbacks.push(fn);
        }
    } else {
        throw new Error("Parameter is not a function");
    }
};

if (typeof L !== "undefined" && typeof L.Map !== "undefined") {
    L.Map.addInitHook(function () {
        if (this._container && this._container.id === "map") {
            unsafeWindow.userscriptMap = this;
            while (callbacks.length > 0) {
                callbacks.shift()();
            }
        }
    });
}