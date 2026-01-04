// ==UserScript==
// @name        Toggle Sidebar in Fextralife
// @namespace   Zharay Scripting
// @match       https://*.fextralife.com/*
// @grant       none
// @version     1.2
// @author      Zharay
// @description Adds a toggle button at the top left of fextralife pages that will show/hide the side menu.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/441078/Toggle%20Sidebar%20in%20Fextralife.user.js
// @updateURL https://update.greasyfork.org/scripts/441078/Toggle%20Sidebar%20in%20Fextralife.meta.js
// ==/UserScript==

var bIsToggled = true;

// Not dynamic? So grabbing globals.
var sidewrapper = document.getElementById("sidebar-wrapper"),
    displayType = sidewrapper.style.display;
var wrapper = document.getElementById("wrapper"),
    paddingLeft = wrapper.style.paddingLeft;

// Setup toggle button
var tglNode = document.createElement ('div');
tglNode.innerHTML = '<button id="sideTgl" type="button" class="btn btn-default">Toggle Sidebar</button>';
tglNode.setAttribute ('id', 'myContainer');
tglNode.setAttribute ('style', 'position:fixed;z-index=999;top:0;left:0');

function toggleSideMenu (zEvent) {
    // Get latest dynamic style of the menu div.
    var menu = document.getElementById('fex-menu-fixed'),
        style = window.getComputedStyle(menu),
        display = style.getPropertyValue('display');

    // If the menu is display none, it likely has the old side menu.
    if (display == "none") {
        bIsToggled = !bIsToggled;
    }
    else { // If it is block, then the new drop-down menu is likely being used.
        bIsToggled = true;
    }
    console.log(bIsToggled);

    sidewrapper.style.display = (bIsToggled ? displayType : "none");
    wrapper.style.paddingLeft = (bIsToggled ? paddingLeft : "0px");
}

(function() {
    if (sidewrapper) {
        // Hide sidebar and add listener.
        toggleSideMenu();
        window.addEventListener("resize", function() { setTimeout(toggleSideMenu, 100); });

        // Add toggle button
        document.body.appendChild (tglNode);
        document.getElementById ("sideTgl").addEventListener ( "click", toggleSideMenu, false );
    }
}) ();