// ==UserScript==
// @name         Bypas ads Kuramanime
// @namespace    http://yu.net/
// @version      0.2
// @description  bypas ads kuramanime
// @author       You
// @match        https://kuramanime.pro/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kuramanime.pro
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481739/Bypas%20ads%20Kuramanime.user.js
// @updateURL https://update.greasyfork.org/scripts/481739/Bypas%20ads%20Kuramanime.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const floatAds = document.getElementById("teaser3");
    if(floatAds) floatAds.remove()

    const headerAds = document.querySelector("header.header ~ section")
    if(headerAds) headerAds.remove()


    function removeAnotherAds() {
        const anotherAds = document.querySelectorAll(".anime-ner")

        if(anotherAds.length == 0) {
            console.log("No ads")
            return
        }

        for(const element of anotherAds) {
            element.remove()
        }

        setTimeout(removeAnotherAds, 1000)
    }

    setTimeout(removeAnotherAds, 1000)
})();