// ==UserScript==
// @name Enhanced Audio Speed Controller with Time Info, Speed Highlight, Font Size Control, and Toggle
// @namespace http://tampermonkey.net/
// @version 3.3
// @description Adds time information (duration, currentTime, etc.), adjusts for playback speed, highlights the active speed button, toggle for hiding/showing the control panel, and font size control.
// @author You
// @match *://*/*
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/510326/Enhanced%20Audio%20Speed%20Controller%20with%20Time%20Info%2C%20Speed%20Highlight%2C%20Font%20Size%20Control%2C%20and%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/510326/Enhanced%20Audio%20Speed%20Controller%20with%20Time%20Info%2C%20Speed%20Highlight%2C%20Font%20Size%20Control%2C%20and%20Toggle.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let startTime = Date.now(); // Track the real-time start
    let isPanelVisible = true; // Track panel visibility
    let currentFontSize = 7; // Initial font size in pt

    const odIcon = '🕰️';
    const adIcon = '⏰';
    const ctIcon = '⌚';
    const pcIcon = '➗';
    const trIcon = '⏳';
    const wcIcon = '🕛';

    // Helper function to convert fractional minutes into hh:mm:ss format
    function convertToTimeFormat(minutes) {
        const totalSeconds = Math.floor(minutes * 60); // Convert minutes to seconds
        const hours = Math.floor(totalSeconds / 3600); // Calculate full hours
        const remainingSeconds = totalSeconds % 3600; // Remaining seconds after hours
        const mins = Math.floor(remainingSeconds / 60); // Full minutes
        const secs = remainingSeconds % 60; // Remaining seconds

        const formattedTime =
            (hours > 9 ? hours : '0' + hours) + ':' +
            (mins > 9 ? mins : '0' + mins) + ':' +
            (secs > 9 ? secs : '0' + secs);

        return formattedTime;
    }

    // Function to calculate and update time stats
    function updateTimeStats() {
        const audioElement = document.querySelector('audio');
        if (audioElement && audioElement.duration && !isNaN(audioElement.duration)) {
            const duration = audioElement.duration;
            const adjustedDuration = audioElement.duration / audioElement.playbackRate / 60;
            const currentTime = audioElement.currentTime;
            const playbackRate = audioElement.playbackRate;
            const currentTimeDisp = currentTime / 60 / playbackRate;
            const percentComplete = (currentTime / duration) * 100;

            const timeRemaining = (adjustedDuration - currentTimeDisp);
            const elapsedWallClockTime = (Date.now() - startTime) / 1000 / 60;

            document.getElementById('original-duration').innerHTML = `${odIcon}<br>${convertToTimeFormat(duration / 60)}`;
            document.getElementById('adjusted-duration').innerHTML = `${adIcon}<br>${convertToTimeFormat(adjustedDuration)}`;
            document.getElementById('current-time').innerHTML = `${ctIcon}<br>${convertToTimeFormat(currentTimeDisp)}`;
            document.getElementById('percent-complete').innerHTML = `<span class="rotate">${pcIcon}</span><br>${percentComplete.toFixed(2)}%`;
            document.getElementById('time-remaining').innerHTML = `${trIcon}<br>${convertToTimeFormat(timeRemaining)}`;
            document.getElementById('elapsed-wall-clock').innerHTML = `${wcIcon}<br>${convertToTimeFormat(elapsedWallClockTime)}`;
        }
    }

    // Function to create the control panel with buttons and time information
    function createControlPanel() {
        if (document.getElementById('audio-speed-control')) return;

        const controlDiv = document.createElement('div');
        controlDiv.id = 'audio-speed-control';
        controlDiv.style.position = 'fixed';
        controlDiv.style.top = '20%';
        controlDiv.style.right = '0';
        controlDiv.style.background = 'rgba(0, 0, 0, 0.05)';
        controlDiv.style.padding = '5px';
        controlDiv.style.borderRadius = '5px';
        controlDiv.style.zIndex = '999999';
        controlDiv.style.display = 'flex';
        controlDiv.style.flexDirection = 'column';
        controlDiv.style.fontSize = `${currentFontSize}pt`;
        controlDiv.style.transition = 'transform 0.5s ease';

        const timeStats = document.createElement('div');
        timeStats.style.marginBottom = '4px';
        timeStats.style.fontSize = '6pt';
        timeStats.style.color = 'black';
        timeStats.style.fontWeight = "bold";
        timeStats.style.textAlign = 'center';

        const timeStatsData = [
            { id: 'original-duration', label: odIcon },
            { id: 'adjusted-duration', label: adIcon },
            { id: 'current-time', label: ctIcon },
            { id: 'percent-complete', label: pcIcon },
            { id: 'time-remaining', label: trIcon },
            { id: 'elapsed-wall-clock', label: wcIcon }
        ];

        timeStatsData.forEach(stat => {
            const statDiv = document.createElement('div');
            statDiv.id = stat.id;
            statDiv.innerHTML = stat.label + "<br>--:--:--";
            timeStats.appendChild(statDiv);
        });

        controlDiv.appendChild(timeStats);

             // Create PLAY button
        const playButton = document.createElement('button');
        playButton.innerText = '▶'; // Label with play symbol
        playButton.style.padding = '3px 5px';
        playButton.style.marginBottom = '2px';
        playButton.style.backgroundColor = '#bada55';
        playButton.style.border = 'none';
        playButton.style.borderRadius = '3px';
        playButton.style.cursor = 'pointer';
        playButton.style.fontSize = '8px';
        playButton.style.fontWeight = 'bold';
        playButton.style.color = '#222';
        playButton.style.width = '36px';

        playButton.addEventListener('click', function () {
            const audioElement = document.querySelector('audio');
            if (audioElement) {
                let attempts = 25;
                audioElement.play(); // Initial attempt

                const playInterval = setInterval(() => {
                    if (attempts > 0) {
                        audioElement.play(); // Force play again
                        attempts--;
                    } else {
                        clearInterval(playInterval);
                    }
                }, 125);
            }
        });

        controlDiv.appendChild(playButton);

        // Create PAUSE button
        const pauseButton = document.createElement('button');
        pauseButton.innerText = '||'; // Label with pause symbol
        pauseButton.style.padding = '3px 5px';
        pauseButton.style.marginBottom = '2px';
        pauseButton.style.backgroundColor = '#bada55';
        pauseButton.style.border = 'none';
        pauseButton.style.borderRadius = '3px';
        pauseButton.style.cursor = 'pointer';
        pauseButton.style.fontSize = '8px';
        pauseButton.style.fontWeight = 'bold';
        pauseButton.style.color = '#222';
        pauseButton.style.width = '36px';

        pauseButton.addEventListener('click', function () {
            const audioElement = document.querySelector('audio');
            if (audioElement) {
                let attempts = 25;
                audioElement.pause(); // Initial attempt

                const pauseInterval = setInterval(() => {
                    if (attempts > 0) {
                        audioElement.pause(); // Force pause again
                        attempts--;
                    } else {
                        clearInterval(pauseInterval);
                    }
                }, 125);
            }
        });

        controlDiv.appendChild(pauseButton);

        /*
        // Ceate PAUoE button
        cst pauseButton = document.createElement('button');
        pauseButton.innerText = '||'; // Label with pause symbol
        pauseButton.style.padding = '3px 5px';
        pauseButton.style.marginBottom = '2px';
        pauseButton.style.backgroundColor = '#bada55';
        pauseButton.style.border = 'none';
        pauseButton.style.borderRadius = '3px';
        pauseButton.style.cursor = 'pointer';
        pauseButton.style.fontSize = '8px';
        = 'bold';
        = '#222';
');
            if (audioElement) {
                const targetState = audioElement.paused; // Determine the desired state

                function tryTogglePlayPause() {
                    if (targetState) {
                        audioElement.play().catch(error => {
                            console.error("Error playing audio:", error);
                            setTimeout(tryTogglePlayPause, 100);
                        });
                        pauseButton.innerText = '||';
                    } else {
                        audioElement.pause();
                        pauseButton.innerText = '▶';
                    }
                }

                tryTogglePlayPause(); // Initial attempt
                if (targetState) {
                    // If the target state is playing, schedule retries
                    setTimeout(tryTogglePlayPause, 100);
                }
            }
        });


// pauseButton.addEventListener('click', function () {
// const audioElement = document.querySelector('audio');
// if (audioElement) {
// if (audioElement.paused) {
// audioElement.play();
// pauseButton.innerText = '||';
// } else {
// audioElement.pause();
// pauseButton.innerText = '▶';
// }
// }
// });

       // controlDiv.appendChild(pauseButton);
       */

        const speeds = [1.0, 1.25, 1.5, 1.75, 2.0, 2.25, 2.5, 2.75, 3.0, 3.25, 3.5, 3.75, 4.0, 4.5, 5.0];
        let activeButton = null;

        speeds.forEach(speed => {
            const button = document.createElement('button');
            button.innerText = speed.toFixed(2);
            button.style.padding = '3px 5px';
            button.style.marginBottom = '2px';
            button.style.backgroundColor = '#bada55';
            button.style.border = 'none';
            button.style.borderRadius = '3px';
            button.style.cursor = 'pointer';
            button.style.fontSize = '8px';
            button.style.fontWeight = 'bold';
            button.style.color = '#222';
            button.style.width = '36px';

            function setActiveButton() {
                if (activeButton) {
                    activeButton.style.backgroundColor = '#bada55';
                    activeButton.style.color = '#222';
                    activeButton.style.fontWeight = 'normal';
                }
                button.style.backgroundColor = '#006400';
                button.style.color = '#fff';
                button.style.fontWeight = 'bold';
                activeButton = button;
            }

            button.addEventListener('click', function () {
                const audioElement = document.querySelector('audio');
                if (audioElement) {
                    audioElement.playbackRate = speed;
                    setActiveButton();
                }
            });

            controlDiv.appendChild(button);
        });

        const toggleButton = document.createElement('button');
        toggleButton.innerText = '◀';
        toggleButton.style.position = 'absolute';
        toggleButton.style.top = '5px';
        toggleButton.style.left = '-15px';
        toggleButton.style.backgroundColor = '#bada55';
        toggleButton.style.border = 'none';
        toggleButton.style.borderRadius = '20%';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.padding = '2px';
        toggleButton.style.zIndex = '1000';

        toggleButton.addEventListener('click', () => {
            if (isPanelVisible) {
                controlDiv.style.transform = 'translateX(100%)';
                toggleButton.innerText = '▶';
            } else {
                controlDiv.style.transform = 'translateX(0)';
                toggleButton.innerText = '◀';
            }
            isPanelVisible = !isPanelVisible;
        });

        controlDiv.appendChild(toggleButton);

        // Font size control
        const fontSizeControl = document.createElement('div');
        fontSizeControl.style.marginTop = '4px';

        const fontIncreaseButton = document.createElement('button');
        fontIncreaseButton.innerText = '⬆';
        fontIncreaseButton.style.margin = '2px';
        fontIncreaseButton.style.padding = '3px';
        fontIncreaseButton.style.cursor = 'pointer';

        fontIncreaseButton.addEventListener('click', () => {
            currentFontSize += 2;
            console.log("Size: " + currentFontSize);
            controlDiv.style.fontSize = `${currentFontSize}pt`;
        });

        const fontDecreaseButton = document.createElement('button');
        fontDecreaseButton.innerText = '⬇';
        fontDecreaseButton.style.margin = '2px';
        fontDecreaseButton.style.padding = '3px';
        fontDecreaseButton.style.cursor = 'pointer';

        fontDecreaseButton.addEventListener('click', () => {
            currentFontSize = Math.max(4, currentFontSize - 2); // Prevent font size from going too small
            controlDiv.style.fontSize = `${currentFontSize}pt`;
        });

        fontSizeControl.appendChild(fontIncreaseButton);
        fontSizeControl.appendChild(fontDecreaseButton);

        controlDiv.appendChild(fontSizeControl);

        document.body.appendChild(controlDiv);
    }

    const style = document.createElement('style');
    style.innerHTML = `
        .rotate {
            display: inline-block;
            transform: rotate(45deg); /* Rotates emoji */
        }
    `;
    document.head.appendChild(style);

    // Update the time stats periodically
    setInterval(updateTimeStats, 1000); // Update every second

    // Wait for the document to fully load and ensure audio element exists
    const observer = new MutationObserver((mutations, observer) => {
        const audioElement = document.querySelector('audio');
        if (audioElement) {
            console.log("Chapter duration:");
            console.log(audioElement.duration / 60);
            audioElement.addEventListener('loadedmetadata', () => {
                audioElement.playbackRate = 2.0; // Set default playback speed to 2.0
                createControlPanel();
                updateTimeStats();
            });
            observer.disconnect(); // Stop observing once the audio is found
        }
    });

    // Start observing the document for changes
    observer.observe(document, {
        childList: true,
        subtree: true
    });

})();