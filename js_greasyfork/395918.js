// ==UserScript==
// @name         SatySlidePageRouting
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       Chenyu
// @match        http://bytes.usc.edu/cs585/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395918/SatySlidePageRouting.user.js
// @updateURL https://update.greasyfork.org/scripts/395918/SatySlidePageRouting.meta.js
// ==/UserScript==

setTimeout(function() {
    'use strict';

    document.getElementById("clockHolder").style.display = "none";

    if (window.nextSlide === undefined) {
        console.log("This page does not have slidy.js. ");
        return;
    }

    let oldPrevioudSlide = previousSlide;
    let oldNextSlide = nextSlide;

    function setSlideNum() {
        console.log("setSlideNum");
        if (!document.location.href.includes("#?")) {
            document.location.href += "#?";
        }
        if (document.location.href.includes("slidenum=")) {
            document.location.href = document.location.href.replace(/slidenum=[0-9]+/, "slidenum=" + slidenum);
        } else {
            let optionalAnd = document.location.href.includes("&") ? "&" : "";
            document.location.href += optionalAnd + "slidenum=" + slidenum;
        }
    }

    window.previousSlide = function (arg, modified) {
        console.log(arg, modified);
        oldPrevioudSlide(arg);

        if (modified === false) return;
        setSlideNum();
    }

    window.nextSlide = function (arg, modified) {
        console.log(arg, modified);
        oldNextSlide(arg);

        if (modified === false) return;
        setSlideNum();
    }

    function getUrlVars() {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            vars[key] = value;
        });
        return vars;
    }

    let slidenumParam = getUrlVars()["slidenum"]

    if (slidenumParam === undefined) {
       return;
    }

    let urlSlidenum = parseInt(slidenumParam);
    console.log({urlSlidenum});
    for (let i = 0; i < urlSlidenum; i++) {
        nextSlide(true, false);
    }

}, 1500);