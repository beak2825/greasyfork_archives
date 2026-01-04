// ==UserScript==
// @name         My Profile Link
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      0.2.1
// @description  Adds a link to profile in nav bar
// @author       cass_per
// @match        https://spacehey.com/*
// @match        https://blog.spacehey.com/*
// @match        https://forum.spacehey.com/*
// @match        https://groups.spacehey.com/*
// @match        https://layouts.spacehey.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spacehey.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468335/My%20Profile%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/468335/My%20Profile%20Link.meta.js
// ==/UserScript==

var id = "YOUR ID HERE";
var user="YOUR USER HERE";
// can leave user blank if you have id as url (default option)

const navi = document.getElementsByTagName("nav")[0].getElementsByClassName("links")[0];

var link = document.createElement("li");
link.innerHTML = "<a href='https://spacehey.com/profile?id="+ id +"'>&nbsp;Me</a>";

navi.prepend(link);

var home = navi.getElementsByTagName("li")[1];
navi.prepend(home);

var cur = window.location.href;
if (cur == "https://spacehey.com/profile?id="+ id || cur == "https://spacehey.com/"+ user) {
    home.classList.remove("active");
    link.classList.add("active");
}