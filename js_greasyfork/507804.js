// ==UserScript==
// @name         西安交大视频助手
// @namespace    https://niceasiv.cn
// @version      0.1
// @description  西安交大网课助手，可以调整倍速
// @author       NiceAsiv
// @match        https://vpahw.xjtu.edu.cn/video/*
// @icon         http://vi.xjtu.edu.cn/img/fastdown1.png
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507804/%E8%A5%BF%E5%AE%89%E4%BA%A4%E5%A4%A7%E8%A7%86%E9%A2%91%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/507804/%E8%A5%BF%E5%AE%89%E4%BA%A4%E5%A4%A7%E8%A7%86%E9%A2%91%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
 'use strict';

    // Function to create and insert the speed selector and auto next button
    function addControls() {
        // Create the container for the controls
        var container = document.createElement('div');
        container.id = 'custom-controls-container';
        container.style.position = 'fixed';
        container.style.top = '10px';
        container.style.right = '10px';
        container.style.padding = '10px';
        container.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        container.style.color = 'white';
        container.style.borderRadius = '5px';
        container.style.zIndex = '1000';

        // Create the label for the speed selector
        var speedLabel = document.createElement('label');
        speedLabel.innerText = '播放倍速: ';
        speedLabel.style.marginRight = '10px';

        // Create the select element for speed options
        var speedSelect = document.createElement('select');
        var speeds = [1, 2, 4, 5, 6, 7, 8];

        speeds.forEach(function(speed) {
            var option = document.createElement('option');
            option.value = speed;
            option.innerText = speed + 'x';
            option.style.color = 'black';  // Set the text color for options
            speedSelect.appendChild(option);
        });

        // Add an event listener to change the playback speed
        speedSelect.addEventListener('change', function() {
            var videoElement = document.querySelector('video');
            if (videoElement) {
                videoElement.playbackRate = parseFloat(speedSelect.value);
                speedSelect.value = videoElement.playbackRate; // Update the select value
            }
        });

        // Create the auto next checkbox
        var autoNextLabel = document.createElement('label');
        autoNextLabel.innerText = '自动播放';
        autoNextLabel.style.marginLeft = '10px';

        var autoNextCheckbox = document.createElement('input');
        autoNextCheckbox.type = 'checkbox';
        autoNextCheckbox.style.marginLeft = '5px';

        // Append the speed label, speed select, and auto next checkbox to the container
        container.appendChild(speedLabel);
        container.appendChild(speedSelect);
        container.appendChild(autoNextLabel);
        container.appendChild(autoNextCheckbox);

        // Append the container to the body
        document.body.appendChild(container);

        // Create the toggle button
        var toggleButton = document.createElement('button');
        toggleButton.innerText = 'Show/Hide Controls';
        toggleButton.style.position = 'fixed';
        toggleButton.style.top = '60px';
        toggleButton.style.right = '10px';
        toggleButton.style.padding = '10px';
        toggleButton.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        toggleButton.style.color = 'white';
        toggleButton.style.borderRadius = '5px';
        toggleButton.style.zIndex = '1000';
        toggleButton.style.border = 'none';
        toggleButton.style.cursor = 'pointer';

        // Add an event listener to the toggle button
        toggleButton.addEventListener('click', function() {
            if (container.style.display === 'none') {
                container.style.display = 'block';
            } else {
                container.style.display = 'none';
            }
        });

        // Append the toggle button to the body
        document.body.appendChild(toggleButton);

        // Function to go to the next chapter
        function goToNextChapter() {
            var chapters = Array.from(document.querySelectorAll('.list-none li'));
            var currentIndex = chapters.findIndex(chapter => chapter.querySelector('.ck-video video'));
            if (currentIndex !== -1 && currentIndex < chapters.length - 1) {
                chapters[currentIndex + 1].querySelector('div').click();
            }
        }

        // Observe changes to the playback time
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                var tempTime = document.querySelector('.ck-tempTime').innerText;
                var times = tempTime.split('/');
                if (times[0] === times[1]) {
                    if (autoNextCheckbox.checked) {
                        goToNextChapter();
                    }
                }
            });
        });

        var targetNode = document.querySelector('.ck-tempTime');
        if (targetNode) {
            observer.observe(targetNode, { childList: true, subtree: true });
        }
    }

    // Wait for the page to load
    window.addEventListener('load', function() {
        var checkExist = setInterval(function() {
            if (document.querySelector('video')) {
                clearInterval(checkExist);
                addControls();
            }
        }, 100); // check every 100ms
    });
})();