// ==UserScript==
// @name        Better Nav Laravel Docs
// @namespace   Violentmonkey Scripts
// @match       https://laravel.com/docs/*
// @grant       none
// @version     1.0
// @author      Karom
// @license MIT
// @description 8/15/2024, 2:54:00 PM
// @downloadURL https://update.greasyfork.org/scripts/503712/Better%20Nav%20Laravel%20Docs.user.js
// @updateURL https://update.greasyfork.org/scripts/503712/Better%20Nav%20Laravel%20Docs.meta.js
// ==/UserScript==


toc = document.querySelector("#main-content > ul:nth-child(2)")

var newtoc = document.createElement('div');
newtoc.className = "parent-newtoc docs_main"
newtoc.style.position = 'sticky';
newtoc.style.top = '5rem';
newtoc.style.right = '2rem';
newtoc.style.zIndex = '2';
newtoc.style.height = 'calc(100vh - 7rem)';
newtoc.style.overflowY = 'auto';

newtoc.appendChild(document.createElement('h1'))

// Add content to the element if needed
// newtoc.textContent = 'TOC';

document.querySelector('.relative .relative').appendChild(newtoc)


document.querySelector('.parent-newtoc').appendChild(toc)
