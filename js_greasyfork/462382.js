// ==UserScript==
// @name         Fextralife Remove Twitch and Fix Layout
// @namespace    https://gitlab.com/Dwyriel
// @version      1.4.0
// @description  Removes twitch stream and fix layout for better readability and usability.
// @author       Dwyriel
// @license      MIT
// @match        https://*.fextralife.com/*
// @grant        none
// @homepageURL  https://gitlab.com/Dwyriel/Greasyfork-Scripts
// @downloadURL https://update.greasyfork.org/scripts/462382/Fextralife%20Remove%20Twitch%20and%20Fix%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/462382/Fextralife%20Remove%20Twitch%20and%20Fix%20Layout.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const formMinMargin = 8, formMaxMargin = 60 - formMinMargin;
    const desktopWidth = 1200, largeMobile = 600, buggyNavbarBreakpoint = 1218;

    const containerFluid = document.querySelector(".container-fluid.fex-bg-image");
    const fexMainContainer = document.querySelector(".fex-main-sidebar-container");
    const fexMain = document.querySelector(".fex-main");
    const sticky = document.querySelector(".sticky");
    const navbar = document.querySelector(".navbar");
    const wikiHeader = document.querySelector(".wiki-header-container");
    const navbarMenux = document.getElementById("navMenux");
    const pageChunk = document.querySelector(".page-chunk");
    const form = document.getElementById("form-header");
    const discussionNew = document.getElementById("discussions-new").parentNode;

    const removeStreamAndSidebar = () => {
        document.getElementById("sidebar-wrapper")?.remove();
        document.getElementsByClassName("side-bar-right")[0]?.remove();
        document.getElementById("fextrastream")?.remove();
    };

    //makes the main content look good on bigger screens and remove the giant spacing on the upper part
    const oneShotFixes = () => {
        fexMain.style = "max-width: 1024px;";
        form.style = "max-height: 60px; margin-top: 0px;";
        sticky.style.top = "80px";
        navbarMenux.style.overflowY = "auto";
    };

    //UPDATE: They finally fixed the problem below, leaving code here in case it gets messed up in the near future
    //navbar won't show up when width is between 1200 and 1218 otherwise
    const navbarFix = (windowWidth) => {
        navbar.style = windowWidth > desktopWidth && windowWidth < buggyNavbarBreakpoint ? "display: block !important" : "";
    };

    //Bunch of small changes to make it look more consistent
    const smallSpacingFixes = (windowWidth) => {
        discussionNew.style.setProperty("padding", "0px", "important");
        fexMainContainer.style.padding = "0px";
        containerFluid.style.padding = "0px";
        let marginSize = "0px";
        if (windowWidth > desktopWidth) {
            marginSize = "auto";
            sticky.style.position = "absolute";
            pageChunk.style.marginLeft = "0px";
            form.style.height = `${formMaxMargin}px`;
        }
        else {
            sticky.style.position = "sticky";
            wikiHeader.style.marginTop = "11rem";
            form.style.height = `${formMinMargin}px`;
        }
        fexMain.style.marginLeft = marginSize;
        fexMain.style.marginRight = marginSize;
    };

    //function to be called every 'resize' event
    const fixLayout = () => {
        let windowWidth = window.innerWidth;
        //navbarFix(windowWidth);
        smallSpacingFixes(windowWidth);
    };

    removeStreamAndSidebar();
    oneShotFixes();
    fixLayout();
    window.addEventListener('resize', () => fixLayout());
})();