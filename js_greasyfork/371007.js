// ==UserScript==
// @name         Vertix Script
// @namespace    http://vertix.io/*
// @version      0.2
// @description  A script created by /u/ReelablePenny14. Script published to make it popular.
// @author       /u/ReelablePenny14, published to make popular.
// @match        http://vertix.io/*
// @grant        GM_addStyle
 
'use strict';
 
GM_addStyle(`
    #mainTitleText {
        width: 100%;
        color: #1EB656;
        font-size: 100px;
        text-align: center;
        text-shadow: 0 1px 0 #ff0000, 0 2px 0 #ff3300, 0 3px 0 #ffff00, 0 4px 0 #726767, 0 5px 0 #009900;
        -webkit-animation: rainbow 4s linear infinite;
        -moz-animation: rainbow 4s linear infinite;
        animation: rainbow 4s linear infinite;
    }
`);
 
GM_addStyle(`
    @keyframes rainbow {
        0% { color: red; }
        14% { color: orange; }
        28% { color: yellow; }
        42% { color: green; }
        56% { color: blue; }
        70% { color: #4B0082; }
        84% { color: purple; }
    }
`);
 
GM_addStyle(`
    @-webkit-keyframes rainbow  {
        0% { color: red; }
        14% { color: orange; }
        28% { color: yellow; }
        52% { color: green; }
        46% { color: blue; }
        70% { color: #4B0082; }
        84% { color: purple; }
    }
`);
 
// @downloadURL https://update.greasyfork.org/scripts/371007/Vertix%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/371007/Vertix%20Script.meta.js
// ==/UserScript==

// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files
// (the "Software"), to deal in the Software without restriction,
// including without limitation the rights to use, copy, modify, merge,
// publish, distribute, sublicense, and/or sell copies of the Software, and
// to permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
// 
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
// CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
// TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

(function() {
    document.title = "Penny.io";
    
    var title = document.getElementById('mainTitleText');
    title.innerHTML = 'Penny.io';
    
    var startButton = document.getElementById('startButton');
    startButton.innerHTML = 'Start Game';
    var leaderButton = document.getElementById('leaderButton');
    leaderButton.innerHTML = 'Leaderboard';
    var settingsButton = document.getElementById('settingsButton');
    settingsButton.innerHTML = 'Settings';
    var instructionButton = document.getElementById('instructionButton');
    instructionButton.innerHTML = 'How to Play';

    var other = document.getElementsByClassName('menuHeader');
    other[0].innerHTML = 'Click below to support';
    
    })();