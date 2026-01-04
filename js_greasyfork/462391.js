// ==UserScript==
// @name         Bing Chat Sidebar
// @name:zh-CN   Bing Chat 侧边栏
// @namespace    https://zyf722.github.io
// @version      1.0
// @icon         https://www.bing.com/sa/simg/favicon-trans-bg-blue-mg.ico
// @description  Add a resizable Bing Chat sidebar to Google search results page
// @description:zh-CN  将 Bing Chat 侧边栏添加到任何网页
// @author       MaxAlex, aka zyf722
// @match        https://www.google.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462391/Bing%20Chat%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/462391/Bing%20Chat%20Sidebar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Config Data
    const defaultHide = GM_getValue("defaultHide", true);

    // Create a container
    const container = document.createElement("div");
    container.style.cssText = `position: fixed; top: 50px; right: ${ defaultHide ? "-400px" : "0"}; width: 450px; height: 100%; padding: 10px; `;

    // Create a container for the sidebar
    const sidebar = document.createElement("div");
    sidebar.style.cssText = `position: fixed; top: 50px; right: ${ defaultHide ? "-400px" : "0"}; width: 400px; height: 100%; background-color: #f2f2f2; padding: 10px; border-left: 1px solid #ddd; overflow-y: scroll; cursor: col-resize;`;

    // Create an iframe element to load the sidebar content
    const iframe = document.createElement("iframe");
    //iframe.src = "https://www.example.org";
    iframe.src = "https://edgeservices.bing.com/edgediscover/query?lightschemeovr=1&FORM=SHORUN&udscs=1&udsnav=1&features=udssydinternal&clientscopes=windowheader,coauthor,chat,&udsframed=1";
    iframe.style.cssText = "width: 100%; height: 90%; border: none;";

    // Create a toggle button
    const button = document.createElement("button");
    button.style.cssText = "position: relative; top: 50%; left: 0; width: 48px; height: 48px; background-color: #f2f2f2; border: 1px solid #ddd; cursor: pointer; border-radius: 70%; transform: translate(-50%, -50%); -webkit-filter: drop-shadow( 0 3px 2px rgba(0, 0, 0, .2)); filter: drop-shadow( 0 3px 2px rgba(0, 0, 0, .2));";
    button.innerHTML = '<svg viewBox="0 0 36 36" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"><image width="36" height="36" xlink:href="https://upload.wikimedia.org/wikipedia/commons/9/9c/Bing_Fluent_Logo.svg"/></svg>';
    container.appendChild(button);

    // Define a function for toggling the sidebar
    const toggleSidebar = () => {
        if (hide == true) {
            sidebar.style.transition = "all 0.2s ease-in-out";
            container.style.transition = "all 0.2s ease-in-out";
            container.style.right = "0";
            sidebar.style.right = "0";
            hide = false;
        } else {
            sidebar.style.transition = "all 0.2s ease-in-out";
            container.style.transition = "all 0.2s ease-in-out";
            container.style.right = `-${currentWidth}px`;
            sidebar.style.right = `-${currentWidth}px`;
            hide = true;
        }
    };

    // Add an event listener for when the button is clicked
    button.addEventListener("click", e => {
        e.preventDefault();
        toggleSidebar();
    });

    // Append the iframe to the sidebar container
    sidebar.appendChild(iframe);

    // Add the sidebar to the page
    container.appendChild(sidebar);
    document.body.appendChild(container);

    // Initialize variables for tracking mouse movements
    let startX = 0;
    let startWidth = 0;
    let currentWidth = parseInt(sidebar.style.width)
    let hide = defaultHide;

    // Add an event listener for when the resize handle is clicked
    sidebar.addEventListener("mousedown", e => {
        e.preventDefault();
        startX = e.clientX;
        startWidth = parseInt(document.defaultView.getComputedStyle(sidebar).width, 10);
        document.documentElement.addEventListener("mousemove", onMouseMove);
        document.documentElement.addEventListener("mouseup", onMouseUp);

        // set sidebar transition
        sidebar.style.transition = "none";
        container.style.transition = "none";
    });

    // Define the function that handles mouse movements
    const onMouseMove = e => {
        const newWidth = startWidth - (e.clientX - startX);
        sidebar.style.width = `${newWidth}px`;
        container.style.width = `${newWidth+50}px`;
        currentWidth = parseInt(sidebar.style.width)
    };

    // Define the function that handles mouse release
    const onMouseUp = e => {
        document.documentElement.removeEventListener("mousemove", onMouseMove);
        document.documentElement.removeEventListener("mouseup", onMouseUp);
    };

    // Config
    GM_registerMenuCommand("侧边栏是否默认隐藏："+(defaultHide ? "✅ 隐藏" : "❌ 展开"), () => {
        GM_setValue("defaultHide", !defaultHide);
    })
})();
