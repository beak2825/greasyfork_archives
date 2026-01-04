// ==UserScript==
// @name         hc-youtrack
// @namespace    http://tampermonkey.net/
// @version      2024-08-16
// @description  HC youtrack tool
// @author       Damao
// @match        http://www.youtrack.in.com:8222/*
// @icon         http://www.youtrack.in.com:8222/static/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/503809/hc-youtrack.user.js
// @updateURL https://update.greasyfork.org/scripts/503809/hc-youtrack.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const selector = ".app .app__container aside"

    const incr = (delta = 20) => {
        const ele = document.querySelector(selector)
        if (ele) {
            const current = getComputedStyle(ele).width
            ele.style.setProperty("--sidebar-width", `calc(${current} + ${delta}px)`)
        }
    }

    const decr = (delta = 20) => {
        const ele = document.querySelector(selector)
        if (ele) {
            const current = getComputedStyle(ele).width
            ele.style.setProperty("--sidebar-width", `calc(${current} - ${delta}px)`)
        }
    }

    document.addEventListener('keydown',(e)=>{
        if(e.altKey && e.keyCode === 187){
            incr(50)
        } else if(e.altKey && e.keyCode === 189){
            decr()
        }
    })

})();