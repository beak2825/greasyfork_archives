// ==UserScript==
// @name         FLVS Navbar Changer
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Changes the Navbar height between 0, or original height
// @author       cat-loaf
// @match        https://learn.flvs.net/*
// @icon         https://www.google.com/s2/favicons?domain=flvs.net
// @downloadURL https://update.greasyfork.org/scripts/430989/FLVS%20Navbar%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/430989/FLVS%20Navbar%20Changer.meta.js
// ==/UserScript==

// Uploaded on GreasyFork, https://greasyfork.org/en/scripts/430989-flvs-navbar-changer

(function() {
    'use strict';

    function setCookie(c_name, value, expiredays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate()+expiredays);
        document.cookie = c_name + "=" + escape(value) + ((expiredays==null) ?
            "" :
            ";expires="+exdate.toUTCString());
    }
    function getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    function checkCookie() {
        if (getCookie("navac")=="true") {
            navb.style.height="0px";
            console.log("navac was true, setting navbar to 0px");
        } else if (getCookie("navac")=="false") {
            navb.style.height=originHeight;
            console.log("navac was false, setting navbar to original height");
        } else {
            console.error("An error occured while getting the navac cookie");
        }
    }
    
    
    window.onload = (event) => {
        console.log('page is fully loaded');
        checkCookie();
    };

    let navb = document.getElementsByClassName("navbar")[0];
    let originHeight = navb.style.height;

    let btn = document.createElement("button");
    btn.innerHTML = "Minimize Navbar";
    btn.onclick = function () {
        navb.style.height="0px";
        setCookie("navac", true, null);
        console.log("Navbar changed to 0px height | session cookie navac set to true");
    };

    let btn2 = document.createElement("button");
    btn2.innerHTML = "Maximize Navbar";
    btn2.onclick = function () {
        navb.style.height = originHeight;
        setCookie("navac", false, null);
        console.log("Navbar returned to original height | session cookie navac set to false");
    };
    
    
    navb.appendChild(btn);
    navb.appendChild(btn2);
})();