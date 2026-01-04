// ==UserScript==
// @name         ExEv
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  (Ex)tended (Ev)ents - provides an API for some missing on-x events
// @author       github.com/akuankka128
// @match        http*://*/*
// @grant        none
// ==/UserScript==

/* jshint esversion: 6 */

(function(root) {
    'use strict';

    let events = new Map();
    events.on = (event, handler) => events.set(event, handler);
    events.off = event => events.delete(event);
    events.emit = (event, ...args) => {
        let e = events.get(event);
        if(!e) return false;
        e(...args);
        return true;
    };

    root.events = events;

    let observer = new MutationObserver(function(mutations) {
        mutations.forEach(m => {
            if(m.target instanceof HTMLHeadElement) {
                events.emit('headloaded');
                events.off('headloaded');
            } else if(m.target instanceof HTMLBodyElement) {
                events.emit('bodyloaded');
                events.off('bodyloaded');
            }
        });
    });

    observer.observe(document, {childList:true,subtree:true});
})(document);