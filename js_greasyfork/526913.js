// ==UserScript==
// @name         Enhanced YouTube Userscript with Themes, Decorations, Button Animations, and Timer
// @namespace    http://tampermonkey.net/
// @version      3.8
// @description  Adds multiple features including ad skipping, mute toggle, captions toggle, playback speed control, and more with a moveable and fixed GUI for YouTube. Includes notifications for feature toggles, theme decorations, button animations, and a video timer. Press Shift + S to hide/show the menu.
// @author       Wadawg117
// @match        https://www.youtube.com/*
// @icon         https://www.youtube.com/s/desktop/fa72b5c3/img/favicon_32x32.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526913/Enhanced%20YouTube%20Userscript%20with%20Themes%2C%20Decorations%2C%20Button%20Animations%2C%20and%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/526913/Enhanced%20YouTube%20Userscript%20with%20Themes%2C%20Decorations%2C%20Button%20Animations%2C%20and%20Timer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the main container for the GUI
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '50%';
    container.style.left = '50%';
    container.style.width = '300px'; // Slightly larger width
    container.style.height = 'auto'; // Adjust height automatically based on content
    container.style.transform = 'translate(-50%, -50%)'; // Center the container
    container.style.zIndex = '1000';
    container.style.padding = '10px'; // Slightly larger padding
    container.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    container.style.border = '2px solid #ff0000';
    container.style.borderRadius = '10px';
    container.style.color = '#ffffff';
    container.style.display = 'grid';
    container.style.gridTemplateColumns = 'repeat(2, auto)';
    container.style.gap = '10px';
    container.style.cursor = 'move';

    // Create the notification popup container
    const popupContainer = document.createElement('div');
    popupContainer.style.position = 'fixed';
    popupContainer.style.bottom = '20px';
    popupContainer.style.right = '20px';
    popupContainer.style.padding = '10px';
    popupContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    popupContainer.style.border = '2px solid #ff0000';
    popupContainer.style.borderRadius = '10px';
    popupContainer.style.color = '#ffffff';
    popupContainer.style.display = 'none';
    popupContainer.style.zIndex = '1001';

    // Append the popup container to the body
    document.body.appendChild(popupContainer);

    // Function to show the notification popup
    const showPopup = (message) => {
        popupContainer.innerText = message;
        popupContainer.style.display = 'block';
        setTimeout(() => {
            popupContainer.style.display = 'none';
        }, 2000);
    };

    // Create buttons for different features
    const createButton = (label, onClick) => {
        const button = document.createElement('button');
        button.innerText = label;
        button.style.padding = '5px';
        button.style.backgroundColor = '#ff0000';
        button.style.color = '#ffffff';
        button.style.border = '1px solid #000000'; // Black outline
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.transition = 'transform 0.2s';
        button.addEventListener('click', () => {
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
                onClick();
            }, 200);
        });
        return button;
    };

    // Feature functions
    const toggleComments = () => {
        const commentsSection = document.getElementById('comments');
        if (commentsSection) {
            const isHidden = commentsSection.style.display === 'none';
            commentsSection.style.display = isHidden ? '' : 'none';
            showPopup(isHidden ? 'Turned on Comments' : 'Turned off Comments');
        }
    };

    const toggleDescription = () => {
        const descriptionSection = document.querySelector('#meta-contents');
        if (descriptionSection) {
            const isHidden = descriptionSection.style.display === 'none';
            descriptionSection.style.display = isHidden ? '' : 'none';
            showPopup(isHidden ? 'Turned on Description' : 'Turned off Description');
        }
    };

    const toggleRelatedVideos = () => {
        const relatedVideosSection = document.querySelector('#related');
        if (relatedVideosSection) {
            const isHidden = relatedVideosSection.style.display === 'none';
            relatedVideosSection.style.display = isHidden ? '' : 'none';
            showPopup(isHidden ? 'Turned on Related Videos' : 'Turned off Related Videos');
        }
    };

    const skipAds = () => {
        const adSkipButton = document.querySelector('.ytp-ad-skip-button');
        if (adSkipButton) {
            adSkipButton.click();
            showPopup('Skipped Ad');
        } else {
            showPopup('No ad found');
        }
    };

    const toggleMute = () => {
        const muteButton = document.querySelector('.ytp-mute-button');
        if (muteButton) {
            const isMuted = document.querySelector('video').muted;
            muteButton.click();
            showPopup(isMuted ? 'Turned off Mute' : 'Turned on Mute');
        }
    };

    const toggleCaptions = () => {
        const captionsButton = document.querySelector('.ytp-subtitles-button');
        if (captionsButton) {
            captionsButton.click();
            showPopup('Toggled Captions');
        }
    };

    const increasePlaybackSpeed = () => {
        const video = document.querySelector('video');
        if (video) {
            video.playbackRate = Math.min(video.playbackRate + 0.25, 2);
            showPopup(`Playback Speed: ${video.playbackRate.toFixed(2)}x`);
        }
    };

    const decreasePlaybackSpeed = () => {
        const video = document.querySelector('video');
        if (video) {
            video.playbackRate = Math.max(video.playbackRate - 0.25, 0.25);
            showPopup(`Playback Speed: ${video.playbackRate.toFixed(2)}x`);
        }
    };

    const resetPlaybackSpeed = () => {
        const video = document.querySelector('video');
        if (video) {
            video.playbackRate = 1.0;
            showPopup('Playback Speed Reset to 1.0x');
        }
    };

    // Theme changer function
    const changeTheme = (theme) => {
        removeExistingDecorations();
        switch (theme) {
            case '0':
                container.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                container.style.border = '2px solid #ff0000';
                addDefaultDecoration();
                showPopup('Default theme activated');
                break;
            case '1':
                container.style.backgroundColor = 'rgba(255, 0, 127, 0.8)';
                container.style.border = '2px solid #ff69b4';
                addValentineDecoration();
                showPopup('Valentine theme activated');
                break;
            case '2':
                container.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
                container.style.border = '2px solid #ff0000';
                addYouTubeDecoration();
                showPopup('YouTube theme activated');
                break;
            case '3':
                container.style.backgroundColor = 'rgba(255, 165, 0, 0.8)';
                container.style.border = '2px solid #ffa500';
                addHalloweenDecoration();
                showPopup('Halloween theme activated');
                break;
            case '4':
                container.style.backgroundColor = 'rgba(0, 128, 0, 0.8)';
                container.style.border = '2px solid #008000';
                addChristmasDecoration();
                showPopup('Christmas theme activated');
                break;
        }
    };

    // Add decorations for each theme
    const addDefaultDecoration = () => {
        // No decorations for default theme
    };

    const addValentineDecoration = () => {
        for (let i = 0; i < 10; i++) {
            const heart = document.createElement('div');
            heart.innerHTML = '❤️';
            heart.classList.add('decoration');
            heart.style.position = 'fixed';
            heart.style.left = `${Math.random() * 100}%`;
            heart.style.top = `${Math.random() * 100}%`;
            heart.style.animation = 'float 5s infinite';
            heart.style.fontSize = '24px';
            heart.style.zIndex = '1000';
            document.body.appendChild(heart);
        }
    };

    const addYouTubeDecoration = () => {
        for (let i = 0; i < 10; i++) {
            const youtubeIcon = document.createElement('div');
            youtubeIcon.innerHTML = '🎥';
            youtubeIcon.classList.add('decoration');
            youtubeIcon.style.position = 'fixed';
            youtubeIcon.style.left = `${Math.random() * 100}%`;
            youtubeIcon.style.top = `${Math.random() * 100}%`;
            youtubeIcon.style.animation = 'float 5s infinite';
            youtubeIcon.style.fontSize = '24px';
            youtubeIcon.style.zIndex = '1000';
            document.body.appendChild(youtubeIcon);
        }
    };

    const addHalloweenDecoration = () => {
        for (let i = 0; i < 10; i++) {
            const pumpkin = document.createElement('div');
            pumpkin.innerHTML = '🎃';
            pumpkin.classList.add('decoration');
            pumpkin.style.position = 'fixed';
            pumpkin.style.left = `${Math.random() * 100}%`;
            pumpkin.style.top = `${Math.random() * 100}%`;
            pumpkin.style.animation = 'float 5s infinite';
            pumpkin.style.fontSize = '24px';
            pumpkin.style.zIndex = '1000';
            document.body.appendChild(pumpkin);
        }
    };

    const addChristmasDecoration = () => {
        for (let i = 0; i < 10; i++) {
            const snowflake = document.createElement('div');
            snowflake.innerHTML = '❄️';
            snowflake.classList.add('decoration');
            snowflake.style.position = 'fixed';
            snowflake.style.left = `${Math.random() * 100}%`;
            snowflake.style.top = `${Math.random() * 100}%`;
            snowflake.style.animation = 'float 5s infinite';
            snowflake.style.fontSize = '24px';
            snowflake.style.zIndex = '1000';
            document.body.appendChild(snowflake);
        }
    };

    // Remove existing decorations
    const removeExistingDecorations = () => {
        const decorations = document.querySelectorAll('.decoration');
        decorations.forEach(deco => {
            deco.remove();
        });
    };

    // Create the theme slider
    const createThemeSlider = () => {
        const sliderContainer = document.createElement('div');
        sliderContainer.style.gridColumn = 'span 2';
        sliderContainer.style.display = 'flex';
        sliderContainer.style.flexDirection = 'column';
        sliderContainer.style.alignItems = 'center';
        sliderContainer.style.marginTop = '10px';

        const sliderLabel = document.createElement('label');
        sliderLabel.innerText = 'Select Theme:';
        sliderLabel.style.marginBottom = '5px';
        sliderContainer.appendChild(sliderLabel);

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '0';
        slider.max = '4';
        slider.value = '0';
        slider.style.width = '100%';
        slider.oninput = (e) => changeTheme(e.target.value);
        sliderContainer.appendChild(slider);

        const themeNames = ['Default', 'Valentine', 'YouTube', 'Halloween', 'Christmas'];
        const themeName = document.createElement('div');
        themeName.innerText = themeNames[slider.value];
        sliderContainer.appendChild(themeName);

        slider.addEventListener('input', (e) => {
            themeName.innerText = themeNames[e.target.value];
        });

        // Prevent dragging when interacting with the slider
        slider.addEventListener('mousedown', (e) => {
            e.stopPropagation();
        });

        return sliderContainer;
    };

    // Create the video timer
    const createVideoTimer = () => {
        const timer = document.createElement('div');
        timer.style.position = 'fixed';
        timer.style.top = '10px';
        timer.style.left = '10px';
        timer.style.padding = '10px'; // Increased padding for larger size
        timer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        timer.style.color = '#ffffff';
        timer.style.borderRadius = '5px';
        timer.style.fontSize = '16px'; // Increased font size
        timer.style.zIndex = '1000';
        document.body.appendChild(timer);

        const updateTimer = () => {
            const video = document.querySelector('video');
            if (video) {
                const timeLeft = video.duration - video.currentTime;
                const minutes = Math.floor(timeLeft / 60);
                const seconds = Math.floor(timeLeft % 60);
                timer.innerText = `Time Left: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            } else {
                timer.innerText = 'Time Left: --:--';
            }
            requestAnimationFrame(updateTimer);
        };

        updateTimer();
    };

    // Append buttons to the container
    const buttons = [
        { label: 'Toggle Comments', action: toggleComments },
        { label: 'Toggle Description', action: toggleDescription },
        { label: 'Toggle Related Videos', action: toggleRelatedVideos },
        { label: 'Skip Ads', action: skipAds },
        { label: 'Toggle Mute', action: toggleMute },
        { label: 'Toggle Captions', action: toggleCaptions },
        { label: 'Increase Speed', action: increasePlaybackSpeed },
        { label: 'Decrease Speed', action: decreasePlaybackSpeed },
        { label: 'Reset Speed', action: resetPlaybackSpeed }
    ];

    buttons.forEach(button => {
        container.appendChild(createButton(button.label, button.action));
    });

    container.appendChild(createThemeSlider());

    // Make the container moveable
    let isMouseDown = false;
    let offsetX, offsetY;

    container.addEventListener('mousedown', (e) => {
        isMouseDown = true;
        offsetX = e.clientX - container.getBoundingClientRect().left;
        offsetY = e.clientY - container.getBoundingClientRect().top;
        container.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (isMouseDown) {
            container.style.left = `${e.clientX - offsetX}px`;
            container.style.top = `${e.clientY - offsetY}px`;
            container.style.transform = ''; // Remove the centering transform
        }
    });

    document.addEventListener('mouseup', () => {
        isMouseDown = false;
        container.style.cursor = 'move';
    });

    // Append the container to the body
    document.body.appendChild(container);

    // Create and append the video timer
    createVideoTimer();

    // Keyboard shortcut to hide/show the menu
    let isMenuVisible = true;
    document.addEventListener('keydown', (e) => {
        if (e.shiftKey && e.key === 'S') {
            isMenuVisible = !isMenuVisible;
            container.style.display = isMenuVisible ? 'grid' : 'none';
        }
    });

    // Add CSS for floating animation
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes float {
            0% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
})();