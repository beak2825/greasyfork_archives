

    // ==UserScript==
    // @name         Automatic Quetre Redirect
    // @namespace    https://kolektiva.social/@helios97
    // @version      1.0
    // @description  Uses Farside to automatically redirect to working instance of Quetre
    // @author       Helios97
    // @license      GNU GPLv3


    // @match        https://quetre.iket.me/*
    // @match        https://quora.vern.cc/*
    // @match        https://quetre.pussthecat.org/*
    // @match        https://quetre.tokhmi.xyz/*
    // @match        https://quetre.projectsegfau.lt/*
    // @match        https://quetre.odyssey346.dev/*
    // @match        https://quetre.privacydev.net/*
    // @match        https://ask.habedieeh.re/*
    // @match        https://quetre.blackdrgn.nl/*
    // @match        https://quetre.lunar.icu/*
    // @match        https://que.wilbvr.me/*
    // @match        https://quora.femboy.hu/*
    // @match        https://questions.whateveritworks.org/*
    // @match        https://quetre.fascinated.cc/*
    // @match        https://quetre.frontendfriendly.xyz/*

    // @grant        none
    // @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/472101/Automatic%20Quetre%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/472101/Automatic%20Quetre%20Redirect.meta.js
    // ==/UserScript==

    // Credit to https://greasyfork.org/en/scripts/470863-automatic-libreddit-quota-redirector where automatic redirection is implemented for libreddit.
    // Credit to https://farside.link/ for all the heavy lifting of identifying a working instance


function main() {
    const errorlength = document.getElementsByClassName("error__code").length
    if (errorlength == 0) return;
    console.log('Redirecting to new Quetre Instance')
    location.replace('https://farside.link/quetre/' + window.location.pathname);
}

main()
