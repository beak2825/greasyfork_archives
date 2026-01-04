// ==UserScript==
// @name         Enhanced Overdrive Library Switcher
// @namespace    club.porcupine.gm_scripts.enhanced_overdrive_library_switcher
// @version      4
// @description  Don't lose your place when switching between partner libraries on Overdrive.
// @author       Sam Birch
// @license      MIT
// @icon         https://icons.duckduckgo.com/ip2/bpl.overdrive.com.ico
// @match        https://*.overdrive.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443341/Enhanced%20Overdrive%20Library%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/443341/Enhanced%20Overdrive%20Library%20Switcher.meta.js
// ==/UserScript==
// jshint esversion: 6
// jshint asi: true
(function() {
    'use strict'

    const pathSuffix = document.location.pathname.replace(new RegExp('^/.*?/content'), '')
    document.querySelectorAll('A.partnerLibraryLink').forEach(el => {
        el.pathname += pathSuffix
        el.search = document.location.search
        el.removeAttribute('target')
    })
    document.querySelector('#rla-dropdown').setAttribute('aria-autoclose', 'false')
}())
