// ==UserScript==
// @name         GitHub NBViewer Transfer
// @namespace    yuhuangmeng
// @version      1.0.0
// @description  Add buttons to open the current GitHub notebook in NBViewer and return from NBViewer to GitHub.
// @author       yuhuangmeng
// @homepageURL  https://greasyfork.org/zh-CN/users/1065289-yuhuangmeng
// @match        https://github.com/*
// @match        https://nbviewer.org/github/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534032/GitHub%20NBViewer%20Transfer.user.js
// @updateURL https://update.greasyfork.org/scripts/534032/GitHub%20NBViewer%20Transfer.meta.js
// ==/UserScript==

/**
 * TODO:
 * 1. 将两个按钮合并为一个按钮“Github/NBViewer Switcher”, 但在 github.com的点击按钮的功能是打开 nbviewer,在 nbviewer 网站按钮的功能是打开 github 仓库
 * 2. debug
 */


(function() {
    'use strict';

    // Function to get the current GitHub notebook URL
    function getGitHubURL() {
        const currentURL = window.location.href;
        if (currentURL.includes("github.com")) {
            return currentURL;
        }
        const parts = currentURL.split("/");
        const username = parts[parts.indexOf("github") + 1];
        const repo = parts[parts.indexOf("github") + 2];
        return `https://github.com/${username}/${repo}`;
    }

    // Function to add a button
    function addButton(text, onClick) {
        const button = document.createElement("a");
        button.innerHTML = text;
        button.className = "btn btn-sm";
        button.href = "#";
        button.style.marginRight = "10px";
        button.onclick = onClick;
        return button;
    }

    // Create a button to open in NBViewer
    const nbviewerButton = addButton("Open in NBViewer", function() {
        const notebookURL = getNotebookURL();
        window.open(notebookURL, "_blank");
    });

    // Create a button to return to GitHub
    const githubButton = addButton("Return to GitHub", function() {
        const githubURL = getGitHubURL();
        window.open(githubURL, "_blank");
    });

    // Create a container div for the buttons
    const buttonContainer = document.createElement("div");
    buttonContainer.appendChild(nbviewerButton);
    buttonContainer.appendChild(githubButton);

    // Add styles for positioning the button container
    buttonContainer.style.position = "fixed";
    buttonContainer.style.bottom = "10px";
    buttonContainer.style.right = "10px";
    buttonContainer.style.zIndex = "9999";

    // Add the button container to the document body
    document.body.appendChild(buttonContainer);

    // Function to get the current GitHub notebook URL
    function getNotebookURL() {
        const currentURL = window.location.href;
        const notebookURL = currentURL.replace("github.com", "nbviewer.org/github");
        return notebookURL;
    }
})();
