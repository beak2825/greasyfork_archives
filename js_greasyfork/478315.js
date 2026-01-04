// ==UserScript==
// @name         Chain Timer Enhancer
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Increase the size and move an element with class "bar-descr___muXn5" to the top of the page
// @author       Omanpx [1906686] & Flav [2499383]
// @license      MIT
// @match        https://www.torn.com/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/478315/Chain%20Timer%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/478315/Chain%20Timer%20Enhancer.meta.js
// ==/UserScript==

(function (window, $) {
    'use strict';

    // Define requirements
    // These are user ID ranges that should cover players between 15 and 400 days old
    const minID = 2800000;
    const maxID = 3100000;
    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Define the CSS rule to increase the size
    // Edit the font-size parameter to increase the size of the timer
    const sizeRule = `
        .bar-timeleft___B9RGV {
            font-size: 80px !important; // You can adjust the size as needed
            cursor:pointer;
        }
    `;

    // Create a <style> element and append it to the <head>
    const sizeStyleElement = document.createElement('style');
    sizeStyleElement.textContent = sizeRule;
    document.head.appendChild(sizeStyleElement);

    // Find the element with the class "bar-descr___muXn5"
    const element = document.querySelector('.bar-timeleft___B9RGV');
    if (element) {
        // Move the element to the top of the page
        element.style.position = 'fixed';
        element.style.top = '80px';
        element.style.right = '10px';
        element.style.background = "green";
        element.style.color = "black";

		// Add a click event listener to open Google in a new tab
		element.addEventListener('click', function() {
			let randID = getRandomNumber(minID,maxID);
			let profileLink = `https://www.torn.com/profiles.php?XID=${randID}`;
			// Comment this line and uncomment the one below it if you want the profile to open in a new tab
			window.location.href = profileLink;
		});

        var config = { characterData: true, attributes: false, childList: false, subtree: true };
        var observer = new MutationObserver((list) => {
            //console.log(list[0].target.textContent);
			var timeArray = list[0].target.textContent.split(":");
			var minutes = timeArray[timeArray.length-2];
			if(parseInt(minutes) > 3)
				list[0].target.parentElement.style.backgroundColor = "green";
			else if(parseInt(minutes) > 2)
				list[0].target.parentElement.style.backgroundColor = "orange";
			else if(parseInt(minutes) >= 0)
				list[0].target.parentElement.style.backgroundColor = "red";
            list[0].target.parentElement.style.position = 'fixed';
            list[0].target.parentElement.style.top = '80px';
            list[0].target.parentElement.style.right = '10px';
            list[0].target.parentElement.style.color = "black";
        });
        observer.observe(element, config);

    }
})(unsafeWindow, unsafeWindow.jQuery);