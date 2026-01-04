// ==UserScript==
// @name         Avoid Winning
// @namespace    http://tampermonkey.net/
// @version      2025-02-07
// @description  Change another winner if one of selected names is the winner (if possible, in case all objects in the race are excluded)
// @author       kaizisntme
// @license      MIT
// @match        https://www.online-stopwatch.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=online-stopwatch.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526206/Avoid%20Winning.user.js
// @updateURL https://update.greasyfork.org/scripts/526206/Avoid%20Winning.meta.js
// ==/UserScript==

// In line 31, add your excluded names (add "" for name in lowercase, just a number for no.) seperated by commas, example: ["me", 1, 2, "me2"]

(function() {
    'use strict';

    Number.prototype.toLowerCase=function() { return parseInt(this); }
    Array.prototype.shuffle=function()
    {
        var i = this.length, j, temp;
        if ( i === 0 ) return this;

        while ( --i )
        {
            //j = Math.floor( Math.getRandomArbitrary() * ( i + 1 ));
            j = Math.getRandomArbitrary(0,i);
            temp = this[i];
            this[i] = this[j];
            this[j] = temp;
        }
        const excludes = ["me"]; // CONFIG HERE!!!
        if(this[0] && this[0].instance) {
            let arr = [];
            this.forEach((a, i) => {
                arr[i] = {...a, name: a.name.toLowerCase()};
            });
            if(excludes.includes(arr[0].name)) {
                const winners = arr.filter(a => !excludes.includes(a.name))
                const new_winner = winners[0] || arr[0];
                const idx = arr.indexOf(new_winner);
                temp = this[0];
                this[0] = this[idx];
                this[idx] = temp;
            }
        }
        return this;
    }
})();