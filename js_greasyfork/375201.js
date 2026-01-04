// ==UserScript==
// @name         Hide Reddit Side Bar
// @namespace    reddit.com/u/pm_all_ahri_art
// @version      1.3
// @description  Hide the reddit sidebar with a simple button beside logout button
// @author       u/pm_all_ahri_art
// @include        *://*.reddit.com/*
// @grant        metadata
//Adapted from Reddit hide sidebar script by u/GoldenSights
// @downloadURL https://update.greasyfork.org/scripts/375201/Hide%20Reddit%20Side%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/375201/Hide%20Reddit%20Side%20Bar.meta.js
// ==/UserScript==
function togglesidebar()
{
    var sidebar = document.querySelector(".side");
    if (sidebar.style.overflow == "hidden")
    {
        sidebar.style.height = "";
        sidebar.style.width = "";
        sidebar.style.overflow = "visible";
    }
    else
    {
        sidebar.style.height = "19px";
        sidebar.style.width = "46px";
        sidebar.style.overflow = "hidden";
    }
}

var togglebutton = document.createElement("button");
var toggletext = document.createTextNode("Hidebar");
togglebutton.appendChild(toggletext);

togglebutton.addEventListener("click", togglesidebar);
togglebutton.style.fontSize = "10px";
togglebutton.style.left = "4px";
togglebutton.style.color = "#000";

var headerThing = document.querySelector("#header");
var botRight = headerThing.querySelector("#header-bottom-right");
var separatorThing = botRight.querySelector(".logout.hover");

botRight.appendChild(togglebutton);
separatorThing.append(" | ");

if (window.innerWidth < 1081){
	togglesidebar();
}

var beta_btn = document.getElementById('redesign-beta-optin-btn');
if (beta_btn) {
    beta_btn.parentNode.removeChild(beta_btn);
}

var verify_email = document.getElementsByClassName("emailverificationbar");
if (verify_email) {
    verify_email[0].remove();
}
/*GM_addStyle ( `
// @grant        GM_addStyle
    .redesign-beta-optin {
        width: 0px;
        visibility: hidden;
        padding: 0px;
    }
` );*/