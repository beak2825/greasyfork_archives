// ==UserScript==
// @name         YouTube Video Aspect Ratio Resizer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Resize YouTube player based on selected aspect ratio
// @author       Your Name
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/515528/YouTube%20Video%20Aspect%20Ratio%20Resizer.user.js
// @updateURL https://update.greasyfork.org/scripts/515528/YouTube%20Video%20Aspect%20Ratio%20Resizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to set the player size based on the aspect ratio
    function setPlayerSize(aspectRatio) {
        const player = document.querySelector('.html5-video-player');
        if (player) {
            player.style.width = '100%';
            switch (aspectRatio) {
                case '21:9':
                    player.style.height = 'calc(100vw / (21/9))';
                    break;
                case '16:9':
                    player.style.height = 'calc(100vw / (16/9))';
                    break;
                case '4:3':
                    player.style.height = 'calc(100vw / (4/3))';
                    break;
                case '1:1':
                    player.style.height = '100vw';
                    break;
                case '9:16':
                    player.style.width = '100vh';
                    player.style.height = 'calc(100vh * (9/16))';
                    break;
                default:
                    break;
            }
        }
    }

    // Create a button to select aspect ratio
    function createAspectRatioButton(aspectRatio) {
        const button = document.createElement('button');
        button.innerText = aspectRatio;
        button.style.margin = '5px';
        button.style.padding = '10px';
        button.style.backgroundColor = '#ff0000';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';

        button.addEventListener('click', () => {
            setPlayerSize(aspectRatio);
        });

        return button;
    }

    // Create a controls container
    function createControls() {
        const controls = document.createElement('div');
        controls.style.position = 'absolute';
        controls.style.top = '10px';
        controls.style.right = '10px';
        controls.style.zIndex = '1000';
        controls.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        controls.style.padding = '10px';
        controls.style.borderRadius = '5px';

        const aspectRatios = ['21:9', '16:9', '4:3', '1:1', '9:16'];
        aspectRatios.forEach(ratio => {
            controls.appendChild(createAspectRatioButton(ratio));
        });

        document.body.appendChild(controls);
    }

    // Create controls when the page is fully loaded
    window.addEventListener('load', () => {
        createControls();
    });
})();
