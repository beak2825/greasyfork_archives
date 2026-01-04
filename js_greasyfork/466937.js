// ==UserScript==
// @name         PROGRESS LEARNING DARK-MODE
// @namespace    http://tampermonkey.net/
// @version      v1.7
// @description  Newer USATESTPREP DarkMode
// @author       Cracko298
// @license      Apache 2.0
// @match        https://app.progresslearning.com/*/assignment/activity/*
// @match        https://app.progresslearning.com/*/assignments
// @match        https://app.progresslearning.com/*/profile#!
// @match        https://app.progresslearning.com/*/profile
// @icon         https://lh5.googleusercontent.com/M7L1UR97DlbTsMpGPPcr6pWpj2mxbgt7rNQyFySkzaguUZmyuvU9mButw8UhN1uZFVqPvirrY3cd3997ntBhXzs=w1280
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466937/PROGRESS%20LEARNING%20DARK-MODE.user.js
// @updateURL https://update.greasyfork.org/scripts/466937/PROGRESS%20LEARNING%20DARK-MODE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    function tempAlert(msg, duration) {
        sleep(900).then(() => {
            var el = document.createElement("div");
            el.setAttribute("style", "position:absolute;top:2.5%;left:20%;background-color:white");
            el.innerHTML = msg;
            setTimeout(function(){
                el.parentNode.removeChild(el);
            }, duration);
            document.body.appendChild(el);
        });
    }

    tempAlert("Created By: Cracko298", 3000);

    function temps(msg, duration) {
        sleep(900).then(() => {
            var el = document.createElement("div");
            el.setAttribute("style", "position:absolute;top:7.5%;left:20%;background-color:white");
            el.innerHTML = msg;
            setTimeout(function(){
                el.parentNode.removeChild(el);
            }, duration);
            document.body.appendChild(el);
        });
    }

    temps("GitHub Page: https://github.com/Cracko298", 3000)

    function replaceClassNames(element) {
        element.classList.replace('bg-white', 'bg-black');
        element.classList.replace('bg-gray-50', 'bg-black');
        element.classList.replace('bg-gray-200', 'bg-black');
        element.classList.replace('text-gray-700', 'text-white');
        element.classList.replace('bg-gray-100', 'bg-black');
        element.classList.replace('text-gray-800', 'text-white');
        element.classList.replace('bg-primary-violet', 'bg-black');
        element.classList.replace('bg-gray-700','bg-black');
        element.classList.replace('border-blues','border-black');
        element.classList.replace('text-black-333','text-white');
        element.classList.add('lrn-author-item-toolbar-shown', 'bg-black');
        element.classList.add('text-white');
        element.classList.add('bg-black', 'has-top-left-region', 'has-top-right-region', 'has-bottom-region', 'has-items-region', 'has-menu-region', 'has-visible-bottom-region');
        var parentElement = document.querySelector('.app-layout');
        var subElements = parentElement.querySelectorAll('*');
subElements.forEach(function(subElement) {
  subElement.style.color = 'white'; // Set the text color to white
  subElement.style.backgroundColor = 'transparent'; // Reset the background color if needed
  // Reset any other styles that you don't want to modify

});

        // Add class "text-white" to element with the text "Graded Work"
        if (element.textContent === 'Graded Work') {
            element.classList.add('text-white');
        }
    }

    function checkAndReplace() {
        const elements = document.querySelectorAll('.lrn_question, .text-black-333, .border-blues, .bg-white, .bg-gray-50, .bg-gray-200, .text-gray-700, .bg-gray-100, .text-gray-800, .app-layout, .bg-primary-violet, .bg-gray-700, .lrn-author-item-content-wrapper');
        elements.forEach(replaceClassNames);
    }

    const observer = new MutationObserver(checkAndReplace);
    observer.observe(document.documentElement, { childList: true, subtree: true });

    checkAndReplace();
})();
