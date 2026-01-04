// ==UserScript==
// @name            Twitter Bookmark Shortcut
// @name:ja         Twitter ブックマークショートカットやつ
// @namespace       http://tampermonkey.net/
// @version         1.0.2
// @description     Add a bookmark shortcut to Twitter's home page
// @description:ja  サイドバーのリストにブックマークを追加します
// @author          Nogaccho
// @match           https://twitter.com/*
// @match           https://x.com/*
// @grant           none
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/489289/Twitter%20Bookmark%20Shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/489289/Twitter%20Bookmark%20Shortcut.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const checkNavBar = setInterval(() => {
        const navBar = document.querySelector('[role="navigation"]');
        if (navBar) {
            clearInterval(checkNavBar);
            addButton();
            updateButtonTextVisibility();
            window.addEventListener('resize', updateButtonTextVisibility);
        }
    }, 1000);

    function addButton() {
        const bookmarkButton = document.createElement('button');
        bookmarkButton.onclick = function() {
            window.open('https://twitter.com/i/bookmarks', '_self');
        };

        // CSS
        bookmarkButton.style.cssText = `
            -webkit-text-size-adjust: 100%;
            -webkit-tap-highlight-color: rgba(0,0,0,0);
            font-size: 19px;
            color-scheme: dark;
            scrollbar-color: rgb(92, 110, 126) rgb(30, 39, 50);
            pointer-events: auto;
            user-select: none;
            cursor: pointer;
            background-color: rgba(0,0,0,0.00);
            border: 0 solid black;
            box-sizing: border-box;
            display: flex;
            flex-basis: auto;
            flex-shrink: 0;
            list-style: none;
            margin: 0px;
            min-height: 0px;
            min-width: 0px;
            position: relative;
            text-decoration: none;
            z-index: 0;
            border-bottom-left-radius: 9999px;
            border-bottom-right-radius: 9999px;
            border-top-left-radius: 9999px;
            border-top-right-radius: 9999px;
            padding: 12px;
            justify-content: center;
            flex-direction: row;
            align-items: center;
            transition-property: background-color, box-shadow;
            max-width: 100%;
            transition-duration: 0.2s;
            color: #F7F9F9; /* Text color */
        `;
        bookmarkButton.onmouseover = function() {
            this.style.backgroundColor = '#2C3640';
        };
        bookmarkButton.onmouseout = function() {
            this.style.backgroundColor = 'rgba(0,0,0,0.00)';
        };

        // SVG
        const svgNS = "http://www.w3.org/2000/svg";
        const icon = document.createElementNS(svgNS, "svg");
        icon.setAttribute("viewBox", "0 0 24 24");
        icon.setAttribute("width", "20"); // Set the icon size
        icon.setAttribute("height", "20");
        icon.setAttribute("aria-hidden", "true");
        icon.setAttribute("class", "r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-vlxjld r-1q142lx r-1kihuf0 r-1472mwg r-mbgqwd r-lrsllp");
        icon.innerHTML = `<g><path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z"></path></g>`;
        bookmarkButton.appendChild(icon);

        // Text node for 'ブックマーク'
        const buttonText = document.createTextNode(' ブックマーク'); 
        bookmarkButton.appendChild(buttonText);

        // Append the button to the navigation bar
        const navBar = document.querySelector('[role="navigation"]');
        navBar.appendChild(bookmarkButton);
    }

    function updateButtonTextVisibility() {
        const bookmarkButton = document.querySelector('button');
        const buttonText = bookmarkButton.childNodes[1]; 
        if (window.innerWidth < 1295) {
            buttonText.nodeValue = ''; // Hide text
        } else {
            buttonText.nodeValue = ' ブックマーク'; 
        }
    }
})();
