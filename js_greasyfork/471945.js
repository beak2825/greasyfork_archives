// ==UserScript==
// @name         Fandm User Rights Changer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Allows you to change UserRights on Fandm.
// @author       Your Name
// @match        https://www.fandm.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471945/Fandm%20User%20Rights%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/471945/Fandm%20User%20Rights%20Changer.meta.js
// ==/UserScript==

(function() {
    // Function to change UserRights
    function changeUserRights(username, newRights) {
        // Replace the following code with the logic to change UserRights on Fandm
        // You may need to interact with the website's API or DOM elements
        console.log(`Changing UserRights of ${username} to ${newRights}`);
        // Your code here...
    }

    // Usage example:
    const targetUsername = 'exampleUser'; // Replace with the username of the user you want to modify
    const newRights = 'admin'; // Replace with the new UserRights you want to assign (e.g., 'user', 'moderator', 'admin', etc.)

    // Call the function to change UserRights
    changeUserRights(targetUsername, newRights);
})();
