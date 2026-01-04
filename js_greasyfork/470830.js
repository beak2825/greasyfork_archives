// ==UserScript==
// @name         Useless Things Series: Random Redirector
// @version      1.0
// @description  Redirects you to a random website for fun and exploration.
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @namespace https://greasyfork.org/users/1126616
// @downloadURL https://update.greasyfork.org/scripts/470830/Useless%20Things%20Series%3A%20Random%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/470830/Useless%20Things%20Series%3A%20Random%20Redirector.meta.js
// ==/UserScript==

// Configuration
let redirectionProbability = 1; // Initial probability of redirection (1 = 100% chance)
const redirectionInterval = 5000; // Time interval in milliseconds (5 seconds)

// Adjust the probability of redirection
function adjustRedirectionProbability(probability) {
    redirectionProbability = probability;
}

// Generate a random URL to redirect to
function generateRandomUrl() {
    // List of websites
    const listWebsites = [
        "https://www.google.com",
        "https://www.youtube.com",
        "https://www.facebook.com",
        "https://www.twitter.com",
        "https://www.instagram.com",
        "https://www.linkedin.com",
        "https://www.pinterest.com",
        "https://www.reddit.com",
        "https://www.tumblr.com",
        "https://www.snapchat.com",
        "https://www.tiktok.com",
        "https://www.netflix.com",
        "https://www.amazon.com",
        "https://www.ebay.com",
        "https://www.apple.com",
        "https://www.microsoft.com",
        "https://www.wikipedia.org",
        "https://www.yahoo.com",
        "https://www.bing.com",
        "https://www.twitch.tv",
        "https://www.y8.com",
        "https://www.friv.com",
        "https://www.agame.com",
        "https://www.kongregate.com",
        "https://www.miniclip.com",
        "https://www.addictinggames.com",
        "https://www.poki.com",
        "https://www.crazygames.com",
        "https://www.gamesgames.com",
        "https://www.arkadium.com"
        // Add more websites here
    ];

    const randomIndex = Math.floor(Math.random() * listWebsites.length);
    return listWebsites[randomIndex];
}

// Redirect to a random website
function redirectToRandomWebsite() {
    const randomUrl = generateRandomUrl();
    window.location.href = randomUrl;
}

// Activate the redirection at the specified interval
setInterval(() => {
    if (Math.random() < redirectionProbability) {
        redirectToRandomWebsite();
    }
}, redirectionInterval);

// Additional Functions
function enableRedirection() {
    redirectionProbability = 1;
}

function disableRedirection() {
    redirectionProbability = 0;
}

function adjustRedirectionInterval(interval) {
    redirectionInterval = interval;
}

function uselessFunction1() {
    console.log("This is a useless function.");
}

function uselessFunction2() {
    console.log("Another useless function.");
}

function usefulFunction1() {
    console.log("This is a useful function.");
}

function usefulFunction2() {
    console.log("Another useful function.");
}

// Example usage:
// enableRedirection(); // Uncomment this line to enable redirection
// disableRedirection(); // Uncomment this line to disable redirection
// adjustRedirectionInterval(10000); // Uncomment this line to adjust the redirection interval (in milliseconds)
// uselessFunction1(); // Uncomment this line to invoke the useless function 1
// uselessFunction2(); // Uncomment this line to invoke the useless function 2
// usefulFunction1(); // Uncomment this line to invoke the useful function 1
// usefulFunction2(); // Uncomment this line to invoke the useful function 2
