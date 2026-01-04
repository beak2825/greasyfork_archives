// ==UserScript==
// @name         Nyaa.si DDL Search
// @namespace    http://tampermonkey.net/
// @version      2024-09-07
// @description  Adds an animetosho.org search button to nyaa.si
// @author       creeperkafasi
// @match        https://nyaa.si/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nyaa.si
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/507299/Nyaasi%20DDL%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/507299/Nyaasi%20DDL%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.pathname.startsWith("/view")) {
        let ddlLink = document.createElement("a")
        ddlLink.innerHTML = `<i class="fa fa-search fa-fw"></i>DDL`
        ddlLink.href = `https://animetosho.org/search?q=${document.querySelector("div.panel-heading > h3").innerText}`
        ddlLink.target = "_blank"
        document.querySelector("div.panel-footer").innerHTML += " or "
        document.querySelector("div.panel-footer").appendChild(ddlLink)
    }
    else if (window.location.pathname == "/") {
        document.querySelectorAll("tbody > tr").forEach(el=>{
            let ddlLink = document.createElement("a")
            ddlLink.innerHTML = `DDL`
            ddlLink.href = `https://animetosho.org/search?q=${el.children[1].innerText}`
            ddlLink.target = "_blank"
            el.children[2].appendChild(ddlLink)
            console.log(ddlLink)
        })
    }
})();