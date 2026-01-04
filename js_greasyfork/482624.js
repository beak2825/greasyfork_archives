// ==UserScript==
// @name         pure WHU-China wiki (2023 only)
// @namespace    http://tampermonkey.net/pure-WHU-China-wiki
// @version      2023-12-19
// @description  Try to simplify our pages
// @author       AshleyW
// @match        https://2023.igem.wiki/whu-china/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482624/pure%20WHU-China%20wiki%20%282023%20only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/482624/pure%20WHU-China%20wiki%20%282023%20only%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelectorAll('div.header-bg')[0].style.setProperty("display","none");
    document.querySelectorAll('div.header-bg')[1].style.setProperty("display","none");
    document.querySelector('div.header-shapes').style.setProperty("display","none");
    document.querySelector('div.header-objects').style.setProperty("display","none");
    document.querySelector('div.page-title').style.setProperty("color","#ffa3d7");
    document.querySelector('div.page-title-cut').style.setProperty("display","none");
    document.querySelector('div.page-title-cut-2').style.setProperty("display","none");
    document.querySelector('div.scroll-to-cut').style.setProperty("display","none");
    document.querySelector("nav.navbar").style.setProperty("display","none");

    document.querySelector("div.side-nav").style.setProperty("display","none");
    document.querySelector("div.col-lg-9").style.setProperty("width","100%");

    document.querySelector("footer").style.setProperty("display","none");

    document.querySelector('div.page-title').style.setProperty("top","5VW");
    document.querySelector('section.page-content').style.setProperty("top","20vw");

    document.querySelector("div.back-to-top").style.setProperty("display","none");

    var hiddens = document.querySelectorAll("div.hidden-content");
    hiddens.forEach(hidden => {
        hidden.classList.add('unfold');
    })

    var hid_buttons = document.querySelectorAll("div.see-more-button")
    hid_buttons.forEach(hid_but => {
        hid_but.style.setProperty("display","none");
    })

    var less_buttons = document.querySelectorAll("div.see-less-button")
    less_buttons.forEach(less_but => {
        less_but.style.setProperty("display","none");
    })

    var prgfs = document.querySelectorAll("div.hidden-content.unfold p");
    prgfs.forEach(prgf =>{
        prgf.style.setProperty("font-weight","500")
    })



    // Your code here...
})();