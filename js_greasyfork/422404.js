// ==UserScript==
// @name         CSDN Fucker
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Fuck up all shit on CSDN
// @author       LYUJ
// @match        https://blog.csdn.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422404/CSDN%20Fucker.user.js
// @updateURL https://update.greasyfork.org/scripts/422404/CSDN%20Fucker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // solve the folding problems
    var folding = document.querySelector("main")
    if(folding != null){
        folding.querySelector(".article_content").setAttribute("style", "none")
    }
    // fuck up the adv
    var adv = document.querySelector(".csdn-toolbar")
    if(adv != null){
        adv.remove()
    }
    // Fuck up the black mask shit
    var darkMask = document.getElementsByClassName('mask-dark')
    if(darkMask != null){
        darkMask[0].remove()
    }
    // Expand comments and fuck up the expand button
    var comments = document.getElementsByClassName('comment-list-box')
    if(comments != null){
        comments[0].setAttribute("style", "none")
    }
    var expandShit = document.getElementById('btnMoreComment')
    if(expandShit != null){
        expandShit.parentElement.remove()
    }
})();