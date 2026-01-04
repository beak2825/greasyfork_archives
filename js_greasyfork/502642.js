// ==UserScript==
// @name         Cqmbo Client for YT! 1.1.8.1
// @namespace    http://tampermonkey.net/
// @version      1.1.8.1
// @description  Anti - Adblocker Removal, Download Video, Auto Like & More!
// @author       Cqmbo__
// @match        *://www.youtube.com/*
// @match        *://ytdl.canehill.info/*
// @icon     https://yt3.googleusercontent.com/ofXbHpiwGc4bYnwwljjZJo53E7JRODr-SG32NPV1W6QiUnGUtVAYDwTP2NMz2pUPGnt99Juh5w=s160-c-k-c0x00ffffff-no-rj
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502642/Cqmbo%20Client%20for%20YT%21%201181.user.js
// @updateURL https://update.greasyfork.org/scripts/502642/Cqmbo%20Client%20for%20YT%21%201181.meta.js
// ==/UserScript==

(function() {
    'use strict';

var removalInterval;
    var isRemoving = false;
    var removeAdsInterval
    var isRemovingAds = false;
    var autoLikeInterval;
    var isAutoLiking = false;
    var autoDislikeInterval;
    var isAutoDisliking = false;
    var repeatVideoInterval;
    var isRepeating = false;
    var autoSubscribeInterval;
    var isAutoSubscribing = false;
    var ishidden = false;

function toggleelements(){
    const elements = [
        'download-button',
        'screenshot-button',
        'thumbnail-button',
        'repeat-button',
        'youtubelabel',
        'youtubeinput',
        'auto-subscribe-button',
        'colored-ui-button',
        'auto-dislike-button',
        'auto-like-button',
        'removeads-button',
        'removal-button',
        'speed-button',
        ];

            elements.forEach(id => {
            const toggleableelement = document.getElementById(id);
            if (toggleableelement) {
                toggleableelement.style.display = toggleableelement.style.display === 'none' ? 'block' : 'none';
            }
        });
    }


    var toggleelementbutton = document.createElement('button');
    toggleelementbutton.id = 'toggle-element-button';
    toggleelementbutton.textContent = 'Hide Menu';
    toggleelementbutton.style.position = 'fixed';
    toggleelementbutton.style.top = '520px';
    toggleelementbutton.style.right = '10px';
    toggleelementbutton.style.zIndex = '10000';
    toggleelementbutton.title = 'Toggle Menu/Functions';

    toggleelementbutton.addEventListener('click', function() {
        if (!ishidden) {
            toggleelementbutton.textContent = 'Show Menu';
             toggleelements();
             ishidden = true;
        } else {
            toggleelementbutton.textContent = 'Hide Menu';
            toggleelements();
            ishidden = false;
        }
    });

    document.body.appendChild(toggleelementbutton);


    function startRemovingElement() {
        removalInterval = setInterval(function() {
            var element1 = document.querySelector('.style-scope.yt-playability-error-supported-renderers');
            if (element1) {
                element1.remove();
            }
        }, 100);
        isRemoving = true;
    }

    function stopRemovingElement() {
        clearInterval(removalInterval);
        isRemoving = false;
    }

    var removalButton = document.createElement('button');
    removalButton.id = 'removal-button';
    removalButton.textContent = 'Remove Anti-Adblocker (Disabled)';
    removalButton.style.position = 'fixed';
    removalButton.style.top = '160px';
    removalButton.style.right = '10px';
    removalButton.style.zIndex = '10000';
    removalButton.title = 'Remove Anti-Adblocker';

    removalButton.addEventListener('click', function() {
        if (!isRemoving) {
            removalButton.textContent = 'Remove Anti-Adblocker (Enabled)';
            startRemovingElement();
        } else {
            removalButton.textContent = 'Remove Anti-Adblocker (Disabled)';
            stopRemovingElement();
        }
    });

    document.body.appendChild(removalButton);



    var autoLikeButton = document.createElement('button');
    autoLikeButton.id = 'auto-like-button';
    autoLikeButton.textContent = 'Auto Like (Disabled)';
    autoLikeButton.style.position = 'fixed';
    autoLikeButton.style.top = '410px';
    autoLikeButton.style.right = '10px';
    autoLikeButton.style.zIndex = '10000';
    autoLikeButton.title = 'Automatically like video every 10 seconds';

    autoLikeButton.addEventListener('click', function() {
        if (!isAutoLiking) {
            autoLikeButton.textContent = 'Auto Like (Enabled)';
            startAutoLiking();
        } else {
            autoLikeButton.textContent = 'Auto Like (Disabled)';
            stopAutoLiking();
        }
    });

    document.body.appendChild(autoLikeButton);

    function startAutoLiking() {
        clickLikeButton(); // Click immediately when enabled
        autoLikeInterval = setInterval(clickLikeButton, 10000);
        isAutoLiking = true;
    }

    function stopAutoLiking() {
        clearInterval(autoLikeInterval);
        isAutoLiking = false;
    }


        function clickLikeButton() {
        var dislikeButton = document.querySelector('.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-button.yt-spec-button-shape-next--segmented-end');
        var likeButton = document.querySelector('.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-leading.yt-spec-button-shape-next--segmented-start');
        if (likeButton && likeButton.getAttribute('aria-pressed') === 'false' && !isAutoDisliking && dislikeButton && dislikeButton.getAttribute('aria-pressed') === 'false') {
            likeButton.click();
        }
        var ShortsdislikeButton = document.querySelector('[aria-label="Dislike this video"]');
        var ShortslikeButton = document.querySelector('.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-l.yt-spec-button-shape-next--icon-button');
        var DislikeButtonConfirmer = document.querySelector('.yt-spec-button-shape-next.yt-spec-button-shape-next--filled.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-l.yt-spec-button-shape-next--icon-button');
        if (ShortslikeButton && ShortslikeButton.getAttribute('aria-pressed') === 'false' && !isAutoDisliking && ShortsdislikeButton && !DislikeButtonConfirmer) {
            ShortslikeButton.click();
        }
    }

    var autoDislikeButton = document.createElement('button');
    autoDislikeButton.id = 'auto-dislike-button';
    autoDislikeButton.textContent = 'Auto Dislike (Disabled)';
    autoDislikeButton.style.position = 'fixed';
    autoDislikeButton.style.top = '500px';
    autoDislikeButton.style.right = '10px';
    autoDislikeButton.style.zIndex = '10000';
    autoDislikeButton.title = 'Automatically dislike video every 10 seconds';

    autoDislikeButton.addEventListener('click', function() {
        if (!isAutoDisliking) {
            autoDislikeButton.textContent = 'Auto Dislike (Enabled)';
            startAutoDisliking();
        } else {
            autoDislikeButton.textContent = 'Auto Dislike (Disabled)';
            stopAutoDisliking();
        }
    });

    document.body.appendChild(autoDislikeButton);

    function startAutoDisliking() {
        clickDislikeButton(); // Click immediately when enabled
        autoDislikeInterval = setInterval(clickDislikeButton, 10000);
        isAutoDisliking = true;
    }

    function stopAutoDisliking() {
        clearInterval(autoDislikeInterval);
        isAutoDisliking = false;
    }

    function clickDislikeButton() {
        var dislikeButton = document.querySelector('.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-button.yt-spec-button-shape-next--segmented-end');
        var likeButton = document.querySelector('.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-leading.yt-spec-button-shape-next--segmented-start');
        if (dislikeButton && dislikeButton.getAttribute('aria-pressed') === 'false' && !isAutoLiking && likeButton && likeButton.getAttribute('aria-pressed') === 'false') {
            dislikeButton.click();
        }
        var ShortsdislikeButton = document.querySelector('[aria-label="Dislike this video"]');
        var ShortslikeButton = document.querySelector('.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-l.yt-spec-button-shape-next--icon-button');
        var DislikeButtonConfirmer = document.querySelector('.yt-spec-button-shape-next.yt-spec-button-shape-next--filled.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-l.yt-spec-button-shape-next--icon-button');
        if (ShortsdislikeButton && !isAutoLiking && ShortslikeButton && ShortslikeButton.getAttribute('aria-pressed') === 'false' && !DislikeButtonConfirmer) {
            ShortsdislikeButton.click();
        }
    }

    var validButtons = true;
        // Create the screenshot button
    const screenshotButton = document.createElement('button');
    screenshotButton.id = 'screenshot-button';
    screenshotButton.title = 'Screenshot Video at Current Timestamp';
    screenshotButton.style.position = 'fixed';
    screenshotButton.style.top = '210px';
    screenshotButton.style.right = '10px';
    screenshotButton.style.zIndex = '10000';
    screenshotButton.style.backgroundColor = '#4caf50';
    screenshotButton.style.color = 'white';

    // Create and append the screenshot icon
    const screenshotIcon = document.createElement('img');
    screenshotIcon.src = 'https://github.com/Cqmbo1/Cqmbo1.github.io/blob/main/assets/screenshot2.png?raw=true';
    screenshotIcon.alt = 'Screenshot';
    screenshotIcon.style.width = '24px';
    screenshotIcon.style.height = '24px';
    screenshotIcon.style.top = '5%';
    screenshotButton.appendChild(screenshotIcon);

    // Create the thumbnail button
    const thumbnailButton = document.createElement('button');
    thumbnailButton.id = 'thumbnail-button';
    thumbnailButton.title = 'Download Video Thumbnail';
    thumbnailButton.style.position = 'fixed';
    thumbnailButton.style.top = '255px';
    thumbnailButton.style.right = '10px';
    thumbnailButton.style.zIndex = '10000';
    thumbnailButton.style.backgroundColor = '#ff5722';
    thumbnailButton.style.color = 'white';

    // Create and append the thumbnail icon
    const thumbnailIcon = document.createElement('img');
    thumbnailIcon.src = 'https://raw.githubusercontent.com/Cqmbo1/Cqmbo1.github.io/refs/heads/main/assets/R.png';
    thumbnailIcon.alt = 'Thumbnail';
    thumbnailIcon.style.width = '24px';
    thumbnailIcon.style.height = '24px';
    thumbnailButton.appendChild(thumbnailIcon);

    // Create the download button
    const downloadButton = document.createElement('button');
    downloadButton.id = 'download-button';
    downloadButton.title = 'Download Video';
    downloadButton.style.position = 'fixed';
    downloadButton.style.top = '300px';
    downloadButton.style.right = '10px';
    downloadButton.style.zIndex = '10000';
    downloadButton.style.backgroundColor = '#2196F3';
    downloadButton.style.color = 'white';

    // Create and append the download icon
    const downloadIcon = document.createElement('img');
    downloadIcon.src = 'https://raw.githubusercontent.com/Cqmbo1/Cqmbo1.github.io/refs/heads/main/assets/OIP%20(4).png';
    downloadIcon.alt = 'Download';
    downloadIcon.style.width = '24px';
    downloadIcon.style.height = '24px';
    downloadButton.appendChild(downloadIcon);


    // Create the speed button
    const speedButton = document.createElement('button');
    speedButton.id = 'speed-button';
    speedButton.title = 'Change speed of video';
    speedButton.style.position = 'fixed';
    speedButton.style.top = '345px';
    speedButton.style.right = '10px';
    speedButton.style.zIndex = '10000';
    speedButton.style.backgroundColor = '#Ffff00';
    speedButton.style.color = 'white';

    // Create and append the speed icon
    const speedIcon = document.createElement('img');
    speedIcon.src = 'https://raw.githubusercontent.com/Cqmbo1/Cqmbo1.github.io/refs/heads/main/assets/OIP%20(5).png';
    speedIcon.alt = 'Speed';
    speedIcon.style.width = '24px';
    speedIcon.style.height = '24px';
    speedButton.appendChild(speedIcon);


    function renderizarContenido() {
        if (validButtons) {
            validButtons = false;
            // Append the buttons to the body
            document.body.appendChild(screenshotButton);
            document.body.appendChild(thumbnailButton);
            document.body.appendChild(downloadButton);
            document.body.appendChild(speedButton);

            // Attach event listeners for buttons
            attachButtonListeners();
        }
    }

function attachButtonListeners() {
    const screenShotButton = document.getElementById('screenshot-button');
    if (screenShotButton) {
        screenShotButton.onclick = () => {
            const video = document.querySelector('video');
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imagenURL = canvas.toDataURL('image/png');
            const linkDownload = document.createElement('a');
            linkDownload.href = imagenURL;
            const titleVideo = document.querySelector('h1.style-scope.ytd-watch-metadata').innerText;
            linkDownload.download = `${video.currentTime.toFixed(0)}s_${titleVideo}.png`;
            linkDownload.click();
        };
    }

const downloadButton = document.getElementById('download-button');

if (downloadButton) {
    downloadButton.onclick = async () => {

        // 1. Fetch Y2Mate base URL from GitHub
        let baseUrl = "";
        try {
            const res = await fetch("https://raw.githubusercontent.com/Cqmbo1/CalculatorHelperThing/refs/heads/main/Link");
            baseUrl = (await res.text()).trim();
        } catch (e) {
            alert("Couldn't load Y2Mate link from GitHub.");
            return;
        }

        // 2. Fix YouTube Shorts → Watch
        let currentUrl = window.location.href;

        if (currentUrl.includes("/shorts/")) {
            currentUrl = currentUrl.replace("/shorts/", "/watch?v=");
        }

        const CutURL = new URLSearchParams(new URL(currentUrl).search);
        const videoId = CutURL.get("v");

        if (!videoId) {
            alert("No video ID found in the URL.");
            return;
        }

        // 3. Open new Y2Mate window using GitHub-configured base URL
        window.open(
            `${baseUrl}${videoId}`,
            "popUpWindow",
            "height=800,width=1000,left=50%,top=100,resizable=no,scrollbars=yes,toolbar=no,menubar=yes,location=no,directories=yes,status=no"
        );
    };
}


    const thumbnailButton = document.getElementById('thumbnail-button');
    if (thumbnailButton) {
        thumbnailButton.onclick = () => {
            let currentUrl = window.location.href;

            // Check if the URL contains 'shorts/' and replace it with 'watch?v='
            if (currentUrl.includes('/shorts/')) {
                currentUrl = currentUrl.replace('/shorts/', '/watch?v=');
            }

            const CutURL = new URLSearchParams(new URL(currentUrl).search);
            let enlace = CutURL.get('v');

            if (enlace) {
                const maxResImageUrl = `https://i1.ytimg.com/vi/${enlace}/maxresdefault.jpg`;
                const highQualityImageUrl = `https://i1.ytimg.com/vi/${enlace}/hqdefault.jpg`;

                fetchImage(maxResImageUrl)
                    .catch(() => fetchImage(highQualityImageUrl))
                    .catch((error) => {
                        alert('No image found');
                        console.error('Error getting image:', error);
                    });
            }
        };
    }
    var ans = '';
        const speedbutton = document.getElementById('speed-button');
    speedbutton.onclick = function () {
        ans = prompt('What is the speed of the video that you want? (1 is default)');
        if (ans === null || ans === "") {
        alert('Cancelled.');
        } else {
        document.getElementsByTagName('video')[0].playbackRate = Number(ans);
        }
    }
}

function fetchImage(imageUrl) {
    return fetch(imageUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.blob();
        })
        .then((blob) => {
            const imageSizeKB = blob.size / 1024;

            if (imageSizeKB >= 20) {
                window.open(
                    imageUrl,
                    'popUpWindow',
                    'height=500,width=400,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no,status=yes'
                );

                const imageUrlObject = URL.createObjectURL(blob);
                const linkDownload = document.createElement('a');
                linkDownload.href = imageUrlObject;
                const titleVideo = document.querySelector('h1.style-scope.ytd-watch-metadata').innerText;
                linkDownload.download = `thumbnail_${titleVideo}.jpg`;
                linkDownload.click();
            } else {
                alert('No image found');
                throw new Error('No image found');
            }
        });

}




    function observeDOM() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' && mutation.addedNodes.length) {
                    renderizarContenido();
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    observeDOM();

    var coloredElements = ['video-title', 'style-scope ytd-watch-metadata'];
    var whiteElements = ['primary'];

    const rainbowColors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'];

    let currentColor = 'black'; // Default color
    let savedCustomColor = 'black'; // Save custom color to restore it later
    let isCustomColorEnabled = false;
    let isRainbowEnabled = false;
    let isColoredUIEnabled = false;
    let rainbowFlashInterval;

    function toggleColoredUI() {
        const button = document.getElementById('colored-ui-button');
        if (!isColoredUIEnabled) {
            isColoredUIEnabled = true;
            button.textContent = 'Colored UI (Enabled)';
            createColoredUIDropdown();
            if (isCustomColorEnabled) {
                applyCustomColor(savedCustomColor);
            } else if (isRainbowEnabled) {
                startRainbowFlash();
            } else {
                applyCustomColor(currentColor);
            }
        } else {
            isColoredUIEnabled = false;
            button.textContent = 'Colored UI (Disabled)';
            removeColoredUIDropdown();
            applyCustomColor('black');
            stopRainbowFlash();
        }
    }

    function createColoredUIDropdown() {
        const dropdown = document.createElement('div');
        dropdown.id = 'colored-ui-dropdown';
        dropdown.style.position = 'fixed';
        dropdown.style.top = '360px';
        dropdown.style.right = '10px';
        dropdown.style.zIndex = '10000';

        const label = document.createElement('div');
        label.textContent = 'Select Color:';
        dropdown.appendChild(label);

        const defaultOption = createOptionElement('Black (Default)', 'black');
        const customOption = createOptionElement('Custom Color', 'custom');
        const rainbowOption = createOptionElement('Rainbow Flash', 'rainbow');
        const dropdownMenu = document.createElement('select');
        dropdownMenu.id = 'colored-ui-dropdown-menu';
        dropdownMenu.appendChild(defaultOption);
        dropdownMenu.appendChild(customOption);
        dropdownMenu.appendChild(rainbowOption);
        dropdown.appendChild(dropdownMenu);

        if (isCustomColorEnabled) {
            dropdownMenu.value = 'custom';
        } else if (isRainbowEnabled) {
            dropdownMenu.value = 'rainbow';
        } else {
            dropdownMenu.value = currentColor;
        }

        dropdownMenu.addEventListener('change', function() {
            const selectedColor = this.value;
            if (selectedColor === 'custom') {
                isCustomColorEnabled = true;
                stopRainbowFlash();
                openCustomColorPicker();
            } else if (selectedColor === 'rainbow') {
                isRainbowEnabled = true;
                isCustomColorEnabled = false;
                startRainbowFlash();
            } else {
                isCustomColorEnabled = false;
                stopRainbowFlash();
                applyCustomColor(selectedColor);
            }
        });

        document.body.appendChild(dropdown);
    }

    function removeColoredUIDropdown() {
        const dropdown = document.getElementById('colored-ui-dropdown');
        if (dropdown) {
            dropdown.remove();
        }
    }

    function createOptionElement(text, value) {
        const option = document.createElement('option');
        option.text = text;
        option.value = value;
        return option;
    }

    function openCustomColorPicker() {
        if (document.getElementById('custom-color-picker')) {
            return;
        }

        const customColorPicker = document.createElement('input');
        customColorPicker.type = 'color';
        customColorPicker.id = 'custom-color-picker';
        customColorPicker.style.position = 'fixed';
        customColorPicker.style.top = '395px';
        customColorPicker.style.right = '10px';
        customColorPicker.style.zIndex = '10000';

        customColorPicker.addEventListener('input', function() {
            const selectedColor = this.value;
            currentColor = selectedColor;
            savedCustomColor = selectedColor;
            applyCustomColor(selectedColor);
        });

        document.body.appendChild(customColorPicker);
    }

    function applyCustomColor(color) {
        coloredElements.forEach(elementId => {
            const elements = document.getElementsByClassName(elementId);
            for (let element of elements) {
                element.style.color = color;
            }
        });

        whiteElements.forEach(elementId => {
            const elements = document.getElementsByClassName(elementId);
            for (let element of elements) {
                element.style.color = (isColoredUIEnabled && (isCustomColorEnabled || isRainbowEnabled)) ? color : 'white';
            }
        });

        currentColor = color;
    }

    function startRainbowFlash() {
        if (rainbowFlashInterval) {
            clearInterval(rainbowFlashInterval);
        }
        let currentIndex = 0;

        rainbowFlashInterval = setInterval(() => {
            const currentColor = rainbowColors[currentIndex];
            applyCustomColor(currentColor);
            currentIndex = (currentIndex + 1) % rainbowColors.length;
        }, 500);
    }

    function stopRainbowFlash() {
        clearInterval(rainbowFlashInterval);
        isRainbowEnabled = false;
        if (!isColoredUIEnabled) {
            applyCustomColor('black');
        } else if (isCustomColorEnabled) {
            applyCustomColor(savedCustomColor);
        } else {
            applyCustomColor(currentColor);
        }
    }

    function toggleElement() {
        const elementToToggle = [
            'custom-color-picker'
        ];

        elementToToggle.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = element.style.display === 'none' ? 'block' : 'none';
            }
        });
    }

    function createColoredUIButton() {
        if (document.getElementById('colored-ui-button')) {
            return;
        }

        const button = document.createElement('button');
        button.id = 'colored-ui-button';
        button.textContent = 'Colored UI (Disabled)';
        button.style.position = 'fixed';
        button.style.top = '480px';
        button.style.right = '10px';
        button.title = 'Color Selected Elements';
        button.style.zIndex = '10000';

        button.addEventListener('click', toggleElement);
        button.addEventListener('click', toggleColoredUI);

        document.body.appendChild(button);
    }

    createColoredUIButton();

    // New background function
    function createBackgroundFunctionality() {
        const youtubeLabel = document.createElement('label');
        youtubeLabel.textContent = 'Background Image:';
        youtubeLabel.style.position = 'fixed';
        youtubeLabel.style.top = '430px';
        youtubeLabel.style.right = '10px';
        youtubeLabel.style.zIndex = '10000';
        youtubeLabel.id = 'youtubelabel';
        youtubeLabel.style.color = 'red';

        const youtubeInput = document.createElement('input');
        youtubeInput.type = 'text';
        youtubeInput.placeholder = 'Paste image URL here...';
        youtubeInput.style.position = 'fixed';
        youtubeInput.style.top = '460px';
        youtubeInput.style.right = '10px';
        youtubeInput.style.zIndex = '10000';
        youtubeInput.id = 'youtubeinput';

        youtubeInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                const url = youtubeInput.value;
                console.log('URL Entered:', url); // Debugging line
                if (url) {
                    setBackground(url);
                } else {
                    clearBackground();
                }
            }
        });

        document.body.appendChild(youtubeLabel);
        document.body.appendChild(youtubeInput);
    }

    function setBackground(url) {
        const primaryInner = document.getElementById('primary-inner');
        console.log('Setting background for primary-inner with URL:', url); // Debugging line
        if (primaryInner) {
            primaryInner.style.backgroundImage = `url(${url})`;
            primaryInner.style.backgroundSize = 'cover';
            primaryInner.style.backgroundPosition = 'center';
        }
    }

    function clearBackground() {
        const primaryInner = document.getElementById('primary-inner');
        console.log('Clearing background for primary-inner'); // Debugging line
        if (primaryInner) {
            primaryInner.style.backgroundImage = '';
        }
    }

    createBackgroundFunctionality();

    var autoSubscribeButton = document.createElement('button');
    autoSubscribeButton.id = 'auto-subscribe-button';
    autoSubscribeButton.textContent = 'Auto Subscribe (Disabled)';
    autoSubscribeButton.style.position = 'fixed';
    autoSubscribeButton.style.top = '120px';
    autoSubscribeButton.style.right = '10px';
    autoSubscribeButton.style.zIndex = '10000';
    autoSubscribeButton.title = 'Automatically subscribe to channels';

    autoSubscribeButton.addEventListener('click', function() {
        if (!isAutoSubscribing) {
            autoSubscribeButton.textContent = 'Auto Subscribe (Enabled)';
            startAutoSubscribing();
        } else {
            autoSubscribeButton.textContent = 'Auto Subscribe (Disabled)';
            stopAutoSubscribing();
        }
    });

    document.body.appendChild(autoSubscribeButton);

    function startAutoSubscribing() {
        clickSubscribeButton(); // Click immediately when enabled
        autoSubscribeInterval = setInterval(clickSubscribeButton, 10000);
        isAutoSubscribing = true;
    }

    function stopAutoSubscribing() {
        clearInterval(autoSubscribeInterval);
        isAutoSubscribing = false;
    }

    function clickSubscribeButton() {
        var subscribeButton = document.querySelector('[aria-label^="Subscribe to"]');
        if (subscribeButton && subscribeButton.textContent.includes('Subscribe')) {
            subscribeButton.click();
        }
    }

    if (location.hostname === 'ytdl.canehill.info') {
                window.onload = function () {
        // Remove all <center> elements
document.querySelectorAll("center").forEach(el => el.remove());

// Target patterns
const sUrlPattern = "window.sUrl = 'https://serv1.canehill.info'";
const aUrlPattern = "var aUrl = ['https://ads.azaleyahgroup.co.za/12']";

// Process script tags
document.querySelectorAll("script").forEach(script => {
  const text = script.textContent || "";

  if (text.includes(sUrlPattern)) {
    script.textContent = text.replace(
      sUrlPattern,
      "window.sUrl = 'undefined'"
    );
  }

  if (text.includes(aUrlPattern)) {
    script.textContent = text.replace(
      aUrlPattern,
      "var aUrl = ['undefined']"
    );
  }
});

window.open = function () {
  console.log("Blocked window.open()");
  return null;
};


    const elements = [
        'download-button',
        'screenshot-button',
        'thumbnail-button',
        'repeat-button',
        'youtubelabel',
        'youtubeinput',
        'auto-subscribe-button',
        'colored-ui-button',
        'auto-dislike-button',
        'auto-like-button',
        'removeads-button',
        'removal-button',
        'speed-button',
        'toggle-element-button',
        ];

            elements.forEach(id => {
            const toggleableelement = document.getElementById(id);
            if (toggleableelement) {
                toggleableelement.remove();
            }
        });
    }
    }

})();

