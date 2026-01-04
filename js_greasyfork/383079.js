// ==UserScript==
// @name         Next, Previous, and play/pause key shortcuts for bandcamp
// @description  Allows the left and right keyboard arrows to be used to go to the previous and next songs on bandcamp.
// @author       Zach Saucier
// @namespace    https://zachsaucier.com/
// @version      1.2
// @match        https://bandcamp.com/*
// @match        https://*.bandcamp.com/*
// @downloadURL https://update.greasyfork.org/scripts/383079/Next%2C%20Previous%2C%20and%20playpause%20key%20shortcuts%20for%20bandcamp.user.js
// @updateURL https://update.greasyfork.org/scripts/383079/Next%2C%20Previous%2C%20and%20playpause%20key%20shortcuts%20for%20bandcamp.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('keydown', (event) => {
        console.log(event.code);
        switch(event.code) {
            case 'ArrowLeft':
                if(document.querySelector('.prev-icon'))
                    document.querySelector('.prev-icon').click();
                if(document.querySelector('.prevbutton'))
                    document.querySelector('.prevbutton').click();
                break;
            case 'ArrowRight':
                if(document.querySelector('.next-icon'))
                    document.querySelector('.next-icon').click();
                if(document.querySelector('.nextbutton'))
                    document.querySelector('.nextbutton').click();
                break;
            case 'Space':
                if(document.querySelector('.playpause'))
                   document.querySelector('.playpause').click();
                if(document.querySelector('.playbutton'))
                    document.querySelector('.playbutton').click();
                event.preventDefault();
                break;
        }
    }, false);
})();