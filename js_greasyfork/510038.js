// ==UserScript==
// @name         Drawaria.online AI Helper
// @namespace    http://tampermonkey.net/
// @version      2024-09-24
// @description  An advanced AI helper for Drawaria.online game
// @author       YouTubeDrawaria
// @match        https://drawaria.online*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510038/Drawariaonline%20AI%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/510038/Drawariaonline%20AI%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create AI icon
    const aiIcon = document.createElement('img');
    aiIcon.src = 'https://drawaria.online/avatar/cache/04628a90-cb3a-11ea-987f-fdc7163f6a11.jpg';
    aiIcon.style.position = 'absolute';
    aiIcon.style.bottom = '20px';
    aiIcon.style.right = '20px';
    aiIcon.style.width = '50px';
    aiIcon.style.cursor = 'pointer';
    aiIcon.style.zIndex = '9999';
    document.body.appendChild(aiIcon);

    // Menu container
    const menu = document.createElement('div');
    menu.style.position = 'absolute';
    menu.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    menu.style.border = '1px solid #fff';
    menu.style.borderRadius = '10px';
    menu.style.padding = '10px';
    menu.style.color = 'white';
    menu.style.width = '200px';
    menu.style.display = 'none';
    menu.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
    document.body.appendChild(menu);

    // Options for the menu
    const options = [
        'Help', 'Chat', 'Play Music', 'Love', 'Rotate',
        'Video', 'Icon', 'Color', 'Subscribe', 'Draw for me'
    ];

    // Create buttons for each option
    options.forEach(option => {
        const btn = document.createElement('button');
        btn.innerText = option;
        btn.style.display = 'block';
        btn.style.margin = '5px 0';
        btn.style.width = '100%';
        btn.style.padding = '5px';
        btn.style.backgroundColor = '#007bff';
        btn.style.border = 'none';
        btn.style.color = 'white';
        btn.style.borderRadius = '5px';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '14px';
        btn.onmouseover = () => btn.style.backgroundColor = '#0056b3';
        btn.onmouseout = () => btn.style.backgroundColor = '#007bff';
        menu.appendChild(btn);

        // Handle clicks for each button
        btn.addEventListener('click', () => handleOption(option));
    });

    // Show/hide menu when clicking the AI icon and make it follow the icon
    aiIcon.addEventListener('click', () => {
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
        menu.style.top = (aiIcon.getBoundingClientRect().top - menu.offsetHeight) + 'px';
        menu.style.left = aiIcon.getBoundingClientRect().left + 'px';
    });

    // Handle the behavior for each menu option
    function handleOption(option) {
        switch(option) {
            case 'Help':
                alert("AI Helper: I'm here to assist you with tips on tools, game objectives, and more.");
                break;
            case 'Chat':
                let chatMessage = prompt("AI Helper: What do you want to ask me?");
                if (chatMessage) {
                    alert(`AI Helper: You asked "${chatMessage}". Here's my response...`);
                }
                break;
            case 'Play Music':
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'audio/*';
                input.onchange = (event) => {
                    const file = event.target.files[0];
                    if (file) {
                        const audio = new Audio(URL.createObjectURL(file));
                        audio.play();
                    }
                };
                input.click();
                break;
            case 'Love':
                for (let i = 0; i < 10; i++) {
                    const heartEmoji = document.createElement('span');
                    heartEmoji.innerText = '❤️';
                    heartEmoji.style.position = 'absolute';
                    heartEmoji.style.bottom = (Math.random() * 100) + 'px';
                    heartEmoji.style.right = (Math.random() * 100) + 'px';
                    heartEmoji.style.transition = 'all 1s ease-out';
                    document.body.appendChild(heartEmoji);
                    setTimeout(() => {
                        heartEmoji.style.left = aiIcon.getBoundingClientRect().left + 'px';
                        heartEmoji.style.top = aiIcon.getBoundingClientRect().top + 'px';
                    }, 100);
                    setTimeout(() => heartEmoji.remove(), 2000);
                }
                break;
            case 'Rotate':
                aiIcon.style.transition = 'transform 1s';
                aiIcon.style.transform = 'rotate(360deg)';
                setTimeout(() => aiIcon.style.transform = 'rotate(0deg)', 1000);
                break;
            case 'Video':
                const inputVideo = document.createElement('input');
                inputVideo.type = 'file';
                inputVideo.accept = 'video/*';
                inputVideo.onchange = (event) => {
                    const file = event.target.files[0];
                    if (file) {
                        const video = document.createElement('video');
                        video.src = URL.createObjectURL(file);
                        video.controls = true;
                        video.style.position = 'absolute';
                        video.style.top = '50%';
                        video.style.left = '50%';
                        video.style.transform = 'translate(-50%, -50%)';
                        document.body.appendChild(video);
                        video.play();
                    }
                };
                inputVideo.click();
                break;
            case 'Icon':
                const inputIcon = document.createElement('input');
                inputIcon.type = 'file';
                inputIcon.accept = 'image/*';
                inputIcon.onchange = (event) => {
                    const file = event.target.files[0];
                    if (file) {
                        aiIcon.src = URL.createObjectURL(file);
                    }
                };
                inputIcon.click();
                break;
            case 'Color':
                const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
                menu.style.backgroundColor = randomColor;
                break;
            case 'Subscribe':
                window.open('https://www.youtube.com/@YouTubeDrawaria', '_blank');
                break;
            case 'Draw for me':
                aiIcon.style.cursor = 'crosshair';
                document.addEventListener('mousemove', draw);
                setTimeout(() => {
                    aiIcon.style.cursor = 'pointer';
                    document.removeEventListener('mousemove', draw);
                }, 5000); // Stop drawing after 5 seconds
                break;
            default:
                break;
        }
    }

    // Drawing function
    function draw(event) {
        const dot = document.createElement('div');
        dot.style.position = 'absolute';
        dot.style.width = '5px';
        dot.style.height = '5px';
        dot.style.backgroundColor = 'black';
        dot.style.borderRadius = '50%';
        dot.style.left = event.pageX + 'px';
        dot.style.top = event.pageY + 'px';
        document.body.appendChild(dot);
    }

    // Allow dragging the AI icon around the screen
    aiIcon.onmousedown = function(event) {
        let shiftX = event.clientX - aiIcon.getBoundingClientRect().left;
        let shiftY = event.clientY - aiIcon.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
            aiIcon.style.left = pageX - shiftX + 'px';
            aiIcon.style.top = pageY - shiftY + 'px';

            // Move the menu along with the icon
            if (menu.style.display === 'block') {
                menu.style.top = (aiIcon.getBoundingClientRect().top - menu.offsetHeight) + 'px';
                menu.style.left = aiIcon.getBoundingClientRect().left + 'px';
            }
        }

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);

        aiIcon.onmouseup = function() {
            document.removeEventListener('mousemove', onMouseMove);
            aiIcon.onmouseup = null;
        };
    };

    aiIcon.ondragstart = function() {
        return false;
    };

})();