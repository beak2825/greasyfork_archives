// ==UserScript==
// @name         Excellence Reminder
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Reminds you of TUMs excellence in random intervals
// @author       https://github.com/jaylann
// @match        *://*.tum.de/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/478901/Excellence%20Reminder.user.js
// @updateURL https://update.greasyfork.org/scripts/478901/Excellence%20Reminder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // List of MP3 files
    const audioFiles = [
        'https://cdn.jsdelivr.net/gh/jaylann/TUMScripts@main/assets/Tum_Voice_Line%20(9).mp3',
        'https://cdn.jsdelivr.net/gh/jaylann/TUMScripts@main/assets/Tum_Voice_Line%20(8).mp3',
        'https://cdn.jsdelivr.net/gh/jaylann/TUMScripts@main/assets/Tum_Voice_Line%20(7).mp3',
        'https://cdn.jsdelivr.net/gh/jaylann/TUMScripts@main/assets/Tum_Voice_Line%20(6).mp3',
        'https://cdn.jsdelivr.net/gh/jaylann/TUMScripts@main/assets/Tum_Voice_Line%20(5).mp3',
        'https://cdn.jsdelivr.net/gh/jaylann/TUMScripts@main/assets/Tum_Voice_Line%20(4).mp3',
        'https://cdn.jsdelivr.net/gh/jaylann/TUMScripts@main/assets/Tum_Voice_Line%20(3).mp3',
        'https://cdn.jsdelivr.net/gh/jaylann/TUMScripts@main/assets/Tum_Voice_Line%20(2).mp3',
        'https://cdn.jsdelivr.net/gh/jaylann/TUMScripts@main/assets/Tum_Voice_Line%20(1).mp3'
    ];

    // List of PNG files
    const imageFiles = [
        'https://cdn.jsdelivr.net/gh/jaylann/TUMScripts@main/assets/Hofmann%20(1).png',
        'https://cdn.jsdelivr.net/gh/jaylann/TUMScripts@main/assets/Hofmann%20(2).png',
        'https://cdn.jsdelivr.net/gh/jaylann/TUMScripts@main/assets/Hofmann%20(3).png',
        'https://cdn.jsdelivr.net/gh/jaylann/TUMScripts@main/assets/Hofmann%20(4).png',
        'https://cdn.jsdelivr.net/gh/jaylann/TUMScripts@main/assets/Hofmann%20(5).png',
        'https://cdn.jsdelivr.net/gh/jaylann/TUMScripts@main/assets/Hofmann%20(6).png',
        'https://cdn.jsdelivr.net/gh/jaylann/TUMScripts@main/assets/Hofmann%20(7).png'
    ];

    // Function to play random audio file and show image
    // Function to convert image to data URL
    const imgToDataURL = (url, callback) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
            const reader = new FileReader();
            reader.onloadend = function() {
                callback(reader.result);
            };
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    };

    // Function to play random audio file and show image
    const playRandomAudioImage = () => {
    const randomAudioIndex = Math.floor(Math.random() * audioFiles.length);
    const randomImageIndex = Math.floor(Math.random() * imageFiles.length);
    const audio = new Audio(audioFiles[randomAudioIndex]);

    imgToDataURL(imageFiles[randomImageIndex], (dataURL) => {
        const image = new Image();
        image.src = dataURL;
        image.style.position = 'absolute';
        image.style.opacity = '0';
        image.style.transition = 'opacity 1s';

       image.onload = () => {
            // Randomly size the image between 1/8 and 1 times the website's width and height
            const minSize = 0.125; // 1/8
            const maxSize = 1; // 1 times
            const randomWidthFraction = Math.random() * (maxSize - minSize) + minSize;
            const randomHeightFraction = Math.random() * (maxSize - minSize) + minSize;
            const randomWidth = window.innerWidth * randomWidthFraction;
            const randomHeight = window.innerHeight * randomHeightFraction;

            image.width = randomWidth;
            image.height = randomHeight;

            // Randomly position the image on the website
            const maxWidth = window.innerWidth - image.width;
            const maxHeight = window.innerHeight - image.height;
            const randomLeft = Math.floor(Math.random() * (maxWidth + 1));
            const randomTop = Math.floor(Math.random() * (maxHeight + 1));

            image.style.left = randomLeft + 'px';
            image.style.top = randomTop + 'px';

            document.body.appendChild(image);
        };

        audio.addEventListener('play', () => {
            image.style.opacity = '1';
        });

        audio.addEventListener('ended', () => {
            image.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(image);
            }, 2000);
        });

        audio.play();
    });
};

    // Function to start playing audio at random intervals
    const startRandomAudioImagePlayer = () => {
    // Initial delay between 20 and 60 seconds
    const initialDelay = Math.floor(Math.random() * (60 - 20 + 1)) + 20;
    setTimeout(() => {
        playRandomAudioImage();

        // Subsequent delays between 60 seconds and 10 minutes
        const minInterval = 60 * 1000; // 60 seconds
        const maxInterval = 10 * 60 * 1000; // 10 minutes
        const randomInterval = () => Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval;
        setInterval(playRandomAudioImage, randomInterval());
    }, initialDelay * 1000);
};

    // Start playing audio at random intervals
    startRandomAudioImagePlayer();
})();
