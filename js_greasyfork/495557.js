// ==UserScript==
// @name         CSDN 1-Click Downloader
// @namespace    https://github.com/ySpica
// @version      1.2
// @description  1-Click Download CSDN pages to PDF
// @author       Spica Yeung
// @connect      www.csdn.net
// @match        https://blog.csdn.net/*/article/details/*
// @icon         none
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495557/CSDN%201-Click%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/495557/CSDN%201-Click%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a wrapper div for hover detection
    const hoverArea = document.createElement('div');
    hoverArea.style.position = 'fixed';
    hoverArea.style.left = '0';
    hoverArea.style.bottom = '0';
    hoverArea.style.width = '100px'; // Hover area width
    hoverArea.style.height = '100px'; // Hover area height
    hoverArea.style.zIndex = 999;
    hoverArea.style.background = 'transparent';
    document.body.appendChild(hoverArea);

    // Add a button to the page
    const button = document.createElement('button');
    button.textContent = '↡';
    button.style.position = 'fixed';
    button.style.left = '10px';
    button.style.bottom = '10px';
    button.style.zIndex = 1000;
    button.style.padding = '7.5px 15px';
    button.style.fontSize = '1.5em';
    button.style.background = 'white';
    button.style.border = '1px solid #ccc';
    button.style.cursor = 'pointer';
    button.style.display = 'none';
    document.body.appendChild(button);

    // Show the button when hovering over the hover area
    hoverArea.onmouseover = function() {
        button.style.display = 'block';
    };

    // Hide the button when not hovering over the button or the hover area
    hoverArea.onmouseout = function() {
        if (!button.matches(':hover')) {
            button.style.display = 'none';
        }
    };

    button.onmouseout = function() {
        if (!hoverArea.matches(':hover')) {
            button.style.display = 'none';
        }
    };

    button.onclick = function() {
        button.style.display = 'none'; // Hide the button after clicking
        $("#side").remove();
        $("#comment_title, #comment_list, #comment_bar, #comment_form, .announce, #ad_cen, #ad_bot").remove();
        $(".nav_top_2011, #header, #navigator").remove();
        $(".p4course_target, .comment-box, .recommend-box, #csdn-toolbar, #tool-box").remove();
        $("aside").remove();
        $(".tool-box").remove();
        $("#toolBarBox").remove();
        $("main").css('display', 'block');
        $("main").css('float', 'none');
        $(".option-box").remove();
        $("body").css('min-width', '0');
        window.print();
    };
})();