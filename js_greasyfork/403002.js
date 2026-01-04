// ==UserScript==
// @name         Prnt.sc: Add 'Next screenshot' and 'Previous screenshot' buttons
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  Adds 'Next screenshot' and 'Previous screenshot' buttons to screenshots uploaded to https://prnt.sc/ (Lightshot) so the user can cycle through the screenshots uploaded to the website.
// @author       SUM1
// @icon         https://i.imgur.com/iua3iZq.png
// @match        https://prnt.sc/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403002/Prntsc%3A%20Add%20%27Next%20screenshot%27%20and%20%27Previous%20screenshot%27%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/403002/Prntsc%3A%20Add%20%27Next%20screenshot%27%20and%20%27Previous%20screenshot%27%20buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (/^https?:\/\/prnt.sc\/\w{1,9}\/?$/.test(document.URL)) { //                                           Check if we're on a prnt.sc screenshot URL. If we are,
        let style = 'padding:5px 10px;border:1px solid #000;border-radius:5px;margin:3px;cursor:pointer;'; // declare a variable for the style of the buttons;
        let styleHover = style + 'border-color:#545;color:#545;'; //                                          declare a variable for the style of the buttons while hovering over them;
        let styleMouseDown = style + 'background-color:#ccc;'; //                                             declare a variable for the style of the buttons while clicking them.

        let prevButton = document.createElement('button'); //                                                 Create the 'Previous screenshot' button.
        prevButton.innerHTML = '← Previous screenshot'; //                                                    Create its text.
        prevButton.setAttribute('onclick', 'window.location.href = (parseInt(window.location.href.substring(window.location.href.search(/.sc\\//) + 4), 36) - 1).toString(36)'); // Set its function for when clicking it. The function takes the URL's alphanumerical string (which is in base 36; all digits and letters), subtracts 1 from it then takes the user to the new URL.
        prevButton.style = style; //                                                                          Set its style to the previously declared style.
        prevButton.onmouseenter = function(){prevButton.style = styleHover;}; //                              Set its style to change to the previously declared hover style when the mouse hovers over it.
        prevButton.onmouseleave = function(){prevButton.style = style;}; //                                   Set its style to change back when the user moves the mouse away.
        prevButton.onmousedown = function(){prevButton.style = styleMouseDown;}; //                           Set its style to change to the previously declared mousedown style when the user clicks the button.
        prevButton.onmouseup = function(){prevButton.style = style;}; //                                      Set its style to change back when the user releases the mouse button.
        document.body.insertBefore(prevButton, document.querySelector('div.image-constrain')); //             Add the button to the webpage, above the screenshot.

        let nextButton = document.createElement('button'); //                                                 Create the 'Next screenshot' button.
        nextButton.innerHTML = 'Next screenshot →'; //                                                        Create its text.
        nextButton.setAttribute('onclick', 'window.location.href = (parseInt(window.location.href.substring(window.location.href.search(/.sc\\//) + 4), 36) + 1).toString(36)'); // Set its function for when clicking it. The function takes the URL's alphanumerical string (which is in base 36; all digits and letters), adds 1 to it then takes the user to the new URL.
        nextButton.style = style; //                                                                          Set its style to the previously declared style.
        nextButton.onmouseenter = function(){nextButton.style = styleHover;}; //                              Set its style to change to the previously declared hover style when the mouse hovers over it.
        nextButton.onmouseleave = function(){nextButton.style = style;}; //                                   Set its style to change back when the user releases the mouse button.
        nextButton.onmousedown = function(){nextButton.style = styleMouseDown;}; //                           Set its style to change to the previously declared mousedown style when the user clicks the button.
        nextButton.onmouseup = function(){nextButton.style = style;}; //                                      Set its style to change back when the user releases the mouse button.
        document.body.insertBefore(nextButton, document.querySelector('div.image-constrain')); //             Add the button to the webpage, above the screenshot.
    }
})();
