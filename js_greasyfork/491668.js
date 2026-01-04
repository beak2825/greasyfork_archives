// ==UserScript==
// @name         Copy URL Button in BBCode Format (obsolete)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add buttons to copy topic and post URLs
// @author       kloob
// @match        *://www.gaiaonline.com/forum/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491668/Copy%20URL%20Button%20in%20BBCode%20Format%20%28obsolete%29.user.js
// @updateURL https://update.greasyfork.org/scripts/491668/Copy%20URL%20Button%20in%20BBCode%20Format%20%28obsolete%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Load Font Awesome
    const faStylesheet = document.createElement('link');
    faStylesheet.rel = 'stylesheet';
    faStylesheet.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css';
    document.head.appendChild(faStylesheet);

    // Function to copy BBCode to clipboard
    function copyBBCode(url, button) {
        const bbCode = `[url]${url}[/url]`;
        navigator.clipboard.writeText(bbCode).then(function() {
            console.log('BBCode copied to clipboard: ' + bbCode);
            button.innerHTML = '<i class="fa-solid fa-check" style="color: #007d16;"></i>';
            button.disabled = true; // Disable the button
        }, function(err) {
            console.error('Could not copy text: ', err);
        });
    }

    // Function to add buttons for topics
    function addTopicButtons() {
        document.querySelectorAll('#thread_title a').forEach(topic => {
            if (!topic.nextElementSibling || !topic.nextElementSibling.classList.contains('copy-btn')) {
                const button = document.createElement('button');
                button.innerHTML = '<i class="fa-solid fa-link" style="color: #000000;"></i>';
                button.className = 'copy-btn';
                button.style.marginLeft = '5px';
                button.addEventListener('click', function() {
                    const topicUrl = window.location.origin + topic.getAttribute('href');
                    copyBBCode(topicUrl, button);
                });
                topic.parentNode.insertBefore(button, topic.nextSibling);
            }
        });
    }

    // Function to copy Post BBCode to clipboard
    function copyPostBBCode(url, button) {
        const bbCode = `[url]${url}[/url]`;
        navigator.clipboard.writeText(bbCode).then(function() {
            console.log('Post BBCode copied to clipboard: ' + bbCode);
            button.innerHTML = '<i class="fa-solid fa-check" style="color: #007d16;"></i>';
            button.disabled = true;
        }, function(err) {
            console.error('Could not copy text: ', err);
        });
    }

    // Function to add buttons for posts
    function addPostButtons() {
        document.querySelectorAll('.post-directlink a').forEach(postLink => {
            const button = document.createElement('button');
            button.innerHTML = '<i class="fa-solid fa-link" style="color: #000000;"></i>';
            button.className = 'copy-btn';
            button.style.marginLeft = '5px';
            button.addEventListener('click', function() {
                const postUrl = window.location.origin + postLink.getAttribute('href');
                copyPostBBCode(postUrl, button);
            });
            postLink.parentNode.appendChild(button);
        });
    }

    // Wait for the DOM to fully load
    if (document.readyState === "loading") {
        document.addEventListener('DOMContentLoaded', function() {
            addTopicButtons();
            addPostButtons();
        });
    } else {
        // DOM already loaded
        addTopicButtons();
        addPostButtons();
    }
})();
