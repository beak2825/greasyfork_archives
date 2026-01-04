// ==UserScript==
// @name         ZTM sidebar toggle
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add a button to toggle the sidebar in the ZTM academy coureses platform
// @author       Alejandro Eyquem
// @match        https://academy.zerotomastery.io/courses/*/lectures/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zerotomastery.io
// @grant        GM_addStyle
// @licence      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/474102/ZTM%20sidebar%20toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/474102/ZTM%20sidebar%20toggle.meta.js
// ==/UserScript==

function hideElements(navBar){
    navBar.style.visibility = "hidden";
    navBar.style.width = "0px";
    GM_addStyle('.course-mainbar { margin-left: 0px }');
}

function showElements(navBar){
    navBar.style.visibility = "visible";
    navBar.style.width = "350px";

    //test
    GM_addStyle('.course-mainbar { margin-left: 350px }');
}

function toggleStatus(navBar){
    let visible = localStorage.getItem("navBarVisibility");
    if(!visible || visible === "hidden") {
        console.log("showing");
        showElements(navBar);
        localStorage.setItem("navBarVisibility", "visible");
    }
    else {
        console.log("hiding");
        hideElements(navBar);
        localStorage.setItem("navBarVisibility", "hidden");
    }
}

(function() {
    'use strict';
    let navBar = document.getElementById("courseSidebar");
    toggleStatus(navBar);

    let newBtn = document.createElement("BUTTON");
    let controlBar = document.getElementsByClassName("lecture-left")[0];
    newBtn.id = "toggle-sidebar";
    newBtn.onclick = () => toggleStatus(navBar);

    controlBar.appendChild(newBtn);
})();
