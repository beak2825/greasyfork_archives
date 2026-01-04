// ==UserScript==
// @name         Autodarts Bermuda Manual Input Target-Board Size Fix
// @version      0.1
// @description  Sets max height for the displayed board with the currently needed target in game mode Bermuda so it doesn't get cut off
// @author       dotty-dev
// @license      MIT
// @match        https://play.autodarts.io/matches/*
// @namespace    https://greasyfork.org/en/users/913506-dotty-dev
// @downloadURL https://update.greasyfork.org/scripts/487530/Autodarts%20Bermuda%20Manual%20Input%20Target-Board%20Size%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/487530/Autodarts%20Bermuda%20Manual%20Input%20Target-Board%20Size%20Fix.meta.js
// ==/UserScript==
/*jshint esversion: 6 */

(function() {
    'use strict';

    document.head.insertAdjacentHTML("beforeend",`
    <style>
      .css-yl5j1j svg{
        max-height: 100%;
      }
    </style>
    `);

})()