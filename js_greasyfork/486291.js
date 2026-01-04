// ==UserScript==
// @name         Infinite Craft Autosave - Deprecated
// @namespace    http://ow0.me/infinite
// @version      2727
// @description  Autosave script for Infinite Craft on neal.fun. Edit: Neal has added autosave for both elements and discoveries, if you have crafted a new item after then and the thing saved you do not need to use this script anymore. However, to save discoveries made before the change, you need to download the current version (2727) and reload the page once.
// @author       Ina'
// @match        https://neal.fun/*
// @icon         https://ow0.me/infinite/icon48.png
// @icon64       https://ow0.me/infinite/icon64.png
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @require      https://neal.fun/_nuxt/992eef7.js
// @require      https://neal.fun/_nuxt/dcc1889.js
// @run-at       document-idle
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/486291/Infinite%20Craft%20Autosave%20-%20Deprecated.user.js
// @updateURL https://update.greasyfork.org/scripts/486291/Infinite%20Craft%20Autosave%20-%20Deprecated.meta.js
// ==/UserScript==

// note - the icon may be moved to n-o.one

var yuri = () => {
    'use strict';
    console.log('establishing yuri');
    var that = unsafeWindow.$nuxt.$children[2].$children[0].$children[0];
    // load
    var savedElements = GM_getValue("elements", null);
    if (savedElements !== null) {
        that.elements = savedElements;
    }
    var savedDiscoveries = GM_getValue("discoveries", null);
    if (savedDiscoveries !== null) {
        that.discoveries = savedDiscoveries;
    }
    that.elements.forEach((x) => {
        if (that.discoveries.includes(x.text)) {
            x.discovered = true;
        }
    });
    // save
    var nealsave = that.saveItems;
    
    that.saveItems = () => {
        nealsave();
        GM_setValue('elements', that.elements);
        GM_setValue('discoveries', that.discoveries);
        console.log('yuri saved');
    };
    
    that.saveItems();
    console.log('yuri established');
}

window.addEventListener("load", yuri);