// ==UserScript==
// @name         Friend Adder
// @namespace    http://yourwebsite.com
// @version      1.0
// @description  Automatically adds friends
// @author       Your Name
// @match        https://www.camwhores.tv/
// @match        https://www.camwhores.tv/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531910/Friend%20Adder.user.js
// @updateURL https://update.greasyfork.org/scripts/531910/Friend%20Adder.meta.js
// ==/UserScript==

// Replace with actual user IDs
const currentUserId = 17635959;       // Your test user
const friendUserId = 108321;        // The user to add as a friend

fetch('/api/add-friend', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    // Include authentication token or cookies if required
  },
  body: JSON.stringify({
    userId: currentUserId,
    friendId: friendUserId
  })
})
.then(res => res.json())
.then(data => console.log('Friend added:', data))
.catch(err => console.error('Error adding friend:', err));
