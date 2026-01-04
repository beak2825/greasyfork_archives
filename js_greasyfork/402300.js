// ==UserScript==
// @name         "Animated" (GIF) Skin for Balz.io
// @version      1.0
// @description  Changes skin every 0.5 seconds.
// @author       Ninja (ninja#8886)
// @match        https://balz.io
// @run-at       document-end
// @grant        none
// @namespace https://greasyfork.org/users/546815
// @downloadURL https://update.greasyfork.org/scripts/402300/%22Animated%22%20%28GIF%29%20Skin%20for%20Balzio.user.js
// @updateURL https://update.greasyfork.org/scripts/402300/%22Animated%22%20%28GIF%29%20Skin%20for%20Balzio.meta.js
// ==/UserScript==

/**
> Why am I sharing this with everyone?
I'm tired of people begging for it tbh. And other people shouldn't be selling it.

> Can I make it faster than 0.5 seconds?
Yes, but that creates more lag for and also spams the api. So it's not a good idea.


Also mess with the code if you want to. Maybe you'll learn something. If you have any questions/problems feel free to DM me.
ninja#8886
*/



// Stores the skins. You can replace/add/remove as many as you want.
// Just make sure each row starts with " and ends with ",
// example of format "url",
const skins = localStorage.skins = [
    "https://i.imgur.com/qFuwev8.jpg",
    "https://i.imgur.com/9jBWu9z.jpg",
    "https://i.imgur.com/KJLT37P.jpg",
    "https://i.imgur.com/UBETLzT.jpg",
];

// Used to keep track of which skin to use.
let index = 0;

// Runs the function every half second.
setInterval(async () => {
    // Increase index so it doesn't keep showing the same skin.
    index ++;

    // Bring the index back to zero if it goes past the number of skins.
    if (index > skins.length) index = 0;

    // Get the "sessionID" stored in localStorage
    const session = localStorage.getItem("balz.session");

    // Send a HTTP request to balz.io with the skin we want.
    await fetch("https://balz.io/api/skin", {
        method: "POST",
        headers: {
            "content-type": "application/json",
            session: session.substr(1, session.length-2), // Trim the parenthesis (") from the front and end of the sessionID.
        },
        body: JSON.stringify({skin: skins[index]})
    });
}, 500);