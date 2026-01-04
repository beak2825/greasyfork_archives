// ==UserScript==
// @name         Stake.com Crash Bot
// @description  Bot that automates Stake.com crash game to place a bet every 2 minutes.
// @match        https://stake.com/casino/games/crash
// @version      1.0
// @author       beautifulbran
// @license      MIT
// @namespace https://greasyfork.org/users/1427010
// @downloadURL https://update.greasyfork.org/scripts/524770/Stakecom%20Crash%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/524770/Stakecom%20Crash%20Bot.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2024 beautifulbran

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/


setInterval(function() {
    // Use a query selector for the new button class or unique attributes
    const betButton = document.querySelector("button[data-testid='bet-button']");

    if (betButton) {
        betButton.click(); // Click the button if it exists
    } else {
        console.log("Bet button not found. Check if the page structure has changed.");
    }
}, 120000); // Execute every 2 minutes (120,000 ms)