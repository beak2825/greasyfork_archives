// ==UserScript==
// @name         V3 Accounts Nav
// @namespace    http://tampermonkey.net/
// @version      2025-07-13 2
// @description  Adds a basic navbar to V3 accounts page
// @author       IvyClaw24
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/542492/V3%20Accounts%20Nav.user.js
// @updateURL https://update.greasyfork.org/scripts/542492/V3%20Accounts%20Nav.meta.js
// ==/UserScript==

(function() {

    'use strict';
    function addNav() {
        //IMPORTANT
        var style = 1 //set to 1 for 2012-13 style
        //IMPORTANT END
        var ytAdmin = document.getElementById("yt-admin");
        var nav = document.createElement("div");
        const navStr = ["Video Manager","Video Editor","Subscriptions","Analytics"];
        const navLinks = ["/my_videos","/editor","/my_subscriptions","/analytics"];
        const navStr2 = [];
        const navLinks2 = [];
        var sel = 4; //placeholder in case VM gets added
        if (style == 1){
            navStr2.push("Settings");
            navLinks2.push("/account");
        } else {
            navStr.push("Settings");
            navLinks.push("/account");
        }
        nav.setAttribute("class","yt-nav yt-nav-dark");
        var navUl = document.createElement("ul");
        var navUl2 = document.createElement("ul");
        navUl2.setAttribute("class", "yt-nav-aside")
        var i;
        for (i=0; i < navStr.length; i++){
            let navLi = document.createElement("li");
            let navItem
            if (i == sel) {
                navItem = document.createElement("span");
                navLi.setAttribute("class","selected");
            } else {
                navItem = document.createElement("a");
                navItem.href = navLinks[i];
                navLi.setAttribute("class","");
            }
            navItem.setAttribute("class","yt-nav-item");
            navItem.innerText = navStr[i];
            navLi.appendChild(navItem);
            navUl.appendChild(navLi);
            console.log("appended");
        }
        if (style == 1){
            for (i=0; i < navStr2.length; i++){
                let navLi = document.createElement("li");
            let navItem
            if (i == sel - navStr.length) {
                navItem = document.createElement("span");
                navLi.setAttribute("class","subnav-secondary selected");
            } else {
                navItem = document.createElement("a");
                navItem.href = navLinks2[i];
                navLi.setAttribute("class","subnav-secondary");
            }
                navItem.setAttribute("class","yt-nav-item");
            navItem.innerText = navStr2[i];
            navLi.appendChild(navItem);
            navUl2.appendChild(navLi);
                nav.appendChild(navUl2);
            console.log("appended");
            }
        }
        nav.appendChild(navUl);
        console.log("Starting injection");
        if (ytAdmin && document.querySelector(".yt-nav") == null){
            ytAdmin.insertBefore(nav, ytAdmin.firstChild);
            console.log("Success")
            observer.disconnect();
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }
    const observer = new MutationObserver(addNav);

    observer.observe(document.body, { childList: true, subtree: true });

    addNav();
})();