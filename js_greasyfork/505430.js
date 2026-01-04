// ==UserScript==
// @name         YouTube Modernizer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Modernize YouTube UI with custom CSS and animations
// @author       YourName
// @match        *://www.youtube.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/505430/YouTube%20Modernizer.user.js
// @updateURL https://update.greasyfork.org/scripts/505430/YouTube%20Modernizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add custom CSS
    GM_addStyle(`
        /* General Styling */
        body {
            font-family: 'Roboto', sans-serif;
            background-color: #181818; /* Dark background */
        }
        
        /* Header styling */
        #container.ytd-masthead {
            background-color: #202020; /* Darker header */
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
            transition: background-color 0.3s ease;
        }
        
        /* Header hover effect */
        #container.ytd-masthead:hover {
            background-color: #292929; /* Slightly lighter on hover */
        }
        
        /* Video thumbnails */
        #thumbnail.ytd-thumbnail {
            border-radius: 10px;
            overflow: hidden;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        /* Thumbnail hover effect */
        #thumbnail.ytd-thumbnail:hover {
            transform: scale(1.05);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        
        /* Video titles */
        #video-title.ytd-video-renderer {
            color: #fff;
            font-weight: bold;
            transition: color 0.3s ease;
        }
        
        /* Video title hover effect */
        #video-title.ytd-video-renderer:hover {
            color: #ff0000; /* Change color on hover */
        }
        
        /* Sidebar menu */
        #sections.ytd-guide-renderer {
            background-color: #202020;
            padding: 10px;
            border-radius: 10px;
        }
        
        /* Sidebar item hover */
        #sections.ytd-guide-renderer a {
            color: #ccc;
            transition: color 0.3s ease, background-color 0.3s ease;
            padding: 10px;
            border-radius: 5px;
        }
        
        #sections.ytd-guide-renderer a:hover {
            color: #fff;
            background-color: #292929;
        }
        
        /* Footer */
        #footer {
            background-color: #181818;
            color: #ccc;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #292929;
            transition: background-color 0.3s ease;
        }
        
        #footer a {
            color: #fff;
            text-decoration: underline;
            transition: color 0.3s ease;
        }
        
        #footer a:hover {
            color: #ff0000;
        }
    `);

    // Add custom JavaScript for animations or interactivity if needed
    // Example: Add a fade-in effect to the page content
    document.addEventListener('DOMContentLoaded', function() {
        document.querySelector('body').style.opacity = '0';
        document.querySelector('body').style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            document.querySelector('body').style.opacity = '1';
        }, 100);
    });

})();
