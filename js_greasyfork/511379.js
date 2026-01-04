// ==UserScript==
// @name         /itr
// @version      10.70 /itr
// @description  guns.lol
// @author       guns.lol/itr
// @match        https://guns.lol/*
// @grant        none
// @namespace https://greasyfork.org/users/1372170
// @downloadURL https://update.greasyfork.org/scripts/511379/itr.user.js
// @updateURL https://update.greasyfork.org/scripts/511379/itr.meta.js
// ==/UserScript==

(function() {
    // Messages for guns.lol/itr
    var itrMsgs = [
        "sub2itr",
        "ITR ON TOP",
        "Bob - itr",
        "Bob",
        "ITR is W",
        "KING ITR",
        "guns.lol/itr"
    ];

    // Messages for guns.lol/*
    var otherMsgs = [
        "itr was here",
        "subscribe",
        "ittrrrr",
        "guns.lol/itr"
    ];

    // Ordered gradient colors (mixed light to dark)
    var colors = [
        // Reds (Light to Dark)
        "#FFCCCC", "#FF9999", "#FF6666", "#FF3333", "#FF0000", // Light Red to Dark Red
        // Oranges (Dark to Light)
        "#FF4D00", "#FF7F4D", "#FFA500", "#FFBF99", "#FFE5CC", // Dark Orange to Light Orange
        // Yellows (Light to Dark)
        "#FFFF66", "#FFFF99", "#FFFFCC", "#FFFF00", "#CCCC00", // Light Yellow to Dark Yellow
        // Greens (Light to Dark)
        "#E5FFE5", "#99E199", "#66CC66", "#33B533", "#008000", // Light Green to Dark Green
        // Blues (Light to Dark)
        "#E5E5FF", "#99CCFF", "#6699FF", "#3366FF", "#0000FF", // Light Blue to Dark Blue
        // Indigos (Light to Dark)
        "#B2A2EB", "#7F5CBB", "#6E3DAF", "#5D1E98", "#4B0082", // Light Indigo to Dark Indigo
        // Violets (Light to Dark)
        "#E5B2E5", "#D99BD9", "#C06DC0", "#A23FA2", "#921C92"  // Light Violet to Dark Violet
    ];

    var spamActive = false;
    var lastMsg = null;
    var colorIndex = 0; // Track the current color index
    var msgCount = 0; // Count messages to change color every 10
    var intervalId; // Store interval ID for spam control

    // Log random message function
    function logRandomMsg(msgs) {
        if (!spamActive) return; // Exit if spam is not active
        var shuffledMsgs = [...msgs];

        // Prevent repeating the last message
        if (lastMsg === shuffledMsgs[0]) {
            shuffledMsgs.push(shuffledMsgs.shift()); // Rotate the array
        }

        // Log messages in ordered colors
        shuffledMsgs.forEach(function(msg) {
            var color = colors[colorIndex % colors.length]; // Use current color
            console.log(`%c${msg}`, `color: ${color}; font-size: 16px;`);
            msgCount++; // Increment message count

            // Change color every 10 messages
            if (msgCount >= 10) {
                colorIndex++; // Move to next color
                msgCount = 0; // Reset message count
            }

            if (colorIndex >= colors.length) colorIndex = 0; // Reset to 0 if we've used all colors
        });

        lastMsg = shuffledMsgs[shuffledMsgs.length - 1];
    }

    // Start spamming messages function
    function startSpammingMsgs(msgs) {
        return setInterval(function() {
            logRandomMsg(msgs);
        }, 1000); // Logs every 1 second
    }

    function toggleSpam(state) {
        spamActive = state; // Set spam state
        if (spamActive) {
            intervalId = startSpammingMsgs(window.location.pathname === "/itr" ? itrMsgs : otherMsgs);
        } else {
            clearInterval(intervalId);
        }
    }

    // Monitor console input for the secret code
    console.log("Type 'madebyitr.stop(1)' to stop spam immediately.");
    console.log("Type 'madebyitr.stop(2)' to stop spam after 10 seconds.");
    console.log("Type 'madebyitr.spam(1)' to start spam immediately.");
    console.log("Type 'madebyitr.spam(2)' to start spam after 10 seconds.");

    // Create madebyitr object to manage spam
    const madebyitr = {
        stop: function(mode) {
            if (mode === 1) {
                toggleSpam(false); // Stop spam immediately
            } else if (mode === 2) {
                setTimeout(() => toggleSpam(false), 10000); // Stop spam after 10 seconds
            }
        },
        spam: function(mode) {
            if (mode === 1) {
                toggleSpam(true); // Start spam immediately
            } else if (mode === 2) {
                setTimeout(() => toggleSpam(true), 10000); // Start spam after 10 seconds
            }
        }
    };

    // Override the console to listen for specific input
    const originalConsoleLog = console.log;
    console.log = function(message) {
        originalConsoleLog.apply(console, arguments);
        // Check for commands and execute them
        try {
            if (message.startsWith("madebyitr.")) {
                eval(message); // Evaluate the command
            }
        } catch (e) {
            originalConsoleLog("Error: " + e.message); // Log any errors
        }
    };

    // Start the spam on page load
    if (window.location.pathname === "/itr") {
        toggleSpam(true); // Start spam immediately for /itr
    } else {
        toggleSpam(true); // Start spam immediately for other paths
    }
})();

