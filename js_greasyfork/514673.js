// ==UserScript==
// @name         Enhanced Chain Timer with SoundCloud Alert
// @namespace    Apo
// @version      1.2
// @description  Make chain timer bigger, add color alerts for better visibility, and play SoundCloud audio at 2-minute mark
// @author       Apollyon
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @downloadURL https://update.greasyfork.org/scripts/514673/Enhanced%20Chain%20Timer%20with%20SoundCloud%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/514673/Enhanced%20Chain%20Timer%20with%20SoundCloud%20Alert.meta.js
// ==/UserScript==

function waitForElement(selector, callback) {
    const element = document.querySelector(selector);
    if (element) {
        callback(element);
    } else {
        setTimeout(() => waitForElement(selector, callback), 100);
    }
}

waitForElement(".speed___dFP2B", actionFunction);

function actionFunction(jNode) {
    'use strict';

    const barStats = document.querySelector(".bar-stats___E_LqA");
    const timeLeft = document.querySelector(".bar-timeleft___B9RGV");
    const speed = document.querySelector(".speed___dFP2B");
    const tickList = document.querySelector(".tick-list___McObN");

    barStats.style.display = "block";
    timeLeft.style.fontSize = "60px";
    timeLeft.style.height = "62px";
    speed.style.top = "unset";
    tickList.style.height = "8px";

    // Function to play SoundCloud audio
    function playSoundCloudAudio() {
        const soundCloudEmbed = document.createElement('iframe');
        soundCloudEmbed.width = "0";  // Set to 0 to hide the player
        soundCloudEmbed.height = "0";
        soundCloudEmbed.frameBorder = "no";
        soundCloudEmbed.allow = "autoplay";
        // Updated track ID
        soundCloudEmbed.src = "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1945356083&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false";

        // Append to body to trigger autoplay
        document.body.appendChild(soundCloudEmbed);

        // Optionally, remove the player after playing
        setTimeout(() => {
            document.body.removeChild(soundCloudEmbed);
        }, 30000); // Remove after 30 seconds (or adjust as needed)
    }

    // Function to update the timer style based on remaining time
    function updateTimerStyle() {
        const timeText = timeLeft.textContent;
        const [minutes, seconds] = timeText.split(":").map(Number);
        const totalSeconds = minutes * 60 + seconds;

        // Play SoundCloud audio when exactly at 2 minutes (120 seconds)
        if (totalSeconds === 120) {
            playSoundCloudAudio(); // Call to play SoundCloud audio
        }

        if (totalSeconds <= 300 && totalSeconds > 180) { // 5:00 to 3:01
            timeLeft.style.color = "green"; // Solid green
            timeLeft.style.animation = "none"; // No blinking
        } else if (totalSeconds <= 180 && totalSeconds > 150) { // 3:00 to 2:31
            timeLeft.style.color = "yellow";
            timeLeft.style.animation = "blinkYellow 1s infinite"; // Slower yellow blink
        } else if (totalSeconds <= 150 && totalSeconds > 90) { // 2:30 to 1:31
            timeLeft.style.color = "orange";
            timeLeft.style.animation = "blinkYellow 1s infinite"; // Slower orange blink
        } else if (totalSeconds <= 90) { // 1:30 and below
            timeLeft.style.color = "red";
            timeLeft.style.animation = "blinkRed 0.5s infinite"; // Faster red blink
        } else {
            timeLeft.style.color = ""; // Reset color
            timeLeft.style.animation = "none"; // Reset animation
        }
    }

    // Add blinking animations with CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes blinkYellow {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }

        @keyframes blinkRed {
            0% { opacity: 1; }
            50% { opacity: 0.3; }
            100% { opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    // Call updateTimerStyle immediately to set color instantly, then start interval
    updateTimerStyle();  // Initial call to show color immediately
    setInterval(updateTimerStyle, 1000); // Update the timer style every second
}
