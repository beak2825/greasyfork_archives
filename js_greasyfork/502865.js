// ==UserScript==
// @name         Youtube subtitles
// @namespace    http://fqdeng.com
// @version      1.0.1
// @description  show the subtitels like lyrics plane
// @author       fqdeng
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502865/Youtube%20subtitles.user.js
// @updateURL https://update.greasyfork.org/scripts/502865/Youtube%20subtitles.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let draggableDiv = null;
    let contentDiv = null;
    let windowDiv = null;
    const textArea = document.createElement('textarea');

    function getVideoIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('v');
    }

    function isYouTubeVideoUrl() {
        var url = window.location.href;
        var pattern = /^https:\/\/www\.youtube\.com\/watch\?v=[\w-]+/;
        return pattern.test(url);
    }

    function onPageChanged() {
        console.log('url change');
        if (!isYouTubeVideoUrl()){
            if (draggableDiv){
                $(draggableDiv).hide()
            }
        }else{
            if (draggableDiv){
                $(draggableDiv).show()
            }
        }
        loadSubtitles();
    }

    function decodeHtmlEntities(text) {
        textArea.innerHTML = text;
        return textArea.value;
    }

    function updateSubtitleScroll(videoTime) {
        const subtitles = contentDiv.getElementsByTagName('div');
        let activeFound = false; // Track if the active subtitle has been found and highlighted

        for (let i = 0; i < subtitles.length; i++) {
            const subtitleData = subtitles[i].dataset;
            const start = parseFloat(subtitleData.start);
            const duration = parseFloat(subtitleData.dur);

            if (start <= videoTime && videoTime <= start + duration) {
                subtitles[i].style.backgroundColor = 'orange';
                subtitles[i].scrollIntoView({ behavior: 'smooth', block: 'center' });
                activeFound = true;
            } else {
                subtitles[i].style.backgroundColor = ''; // Reset background color for non-active subtitles
            }
        }

        // If no active subtitle is found (e.g., between subtitles), ensure all are reset
        if (!activeFound) {
            for (let i = 0; i < subtitles.length; i++) {
                subtitles[i].style.backgroundColor = '';
            }
        }
    }

    function setupVideoPlayerListener() {
        var player = document.getElementsByTagName("video")[0];
        if (player) {
            setInterval(() => {
                const currentTime = player.currentTime;
                updateSubtitleScroll(currentTime);
            }, 1000); // Update every second
        } else {
            setTimeout(setupVideoPlayerListener, 1000); // Retry after 1 second if player not ready
        }
    }


    function loadSubtitles() {
        // Clear existing subtitles
        contentDiv.innerHTML = ''; // Or use the loop method if preferred

        // Load and display subtitles
        renderSubtitles(getVideoIdFromUrl()).then(subtitles => {
            if (subtitles) {
                subtitles.forEach(subtitle => {
                    const subtitleDiv = document.createElement('div');
                    subtitleDiv.style.fontSize = '16px'; // Apply font size to each subtitle
                    subtitleDiv.style.lineHeight = '1.4';
                    subtitleDiv.style.marginBottom = '5px'; // Add space between subtitles
                    const startTime = parseFloat(subtitle.start).toFixed(2);
                    const duration = parseFloat(subtitle.dur).toFixed(2);
                    subtitleDiv.textContent = `${decodeHtmlEntities(subtitle.text)}`;
                    subtitleDiv.dataset.start = subtitle.start;
                    subtitleDiv.dataset.dur = subtitle.dur;
                    contentDiv.appendChild(subtitleDiv);
                });
            }
        });
    }


     function renderDragableDiv(){
        // Load jQuery UI CSS
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = 'https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css';
        document.head.appendChild(cssLink);

        // Function to save position and size to localStorage
        function savePositionAndSize(left, top, width, height) {
            localStorage.setItem('draggableSubtitlesPosition', JSON.stringify({ left, top, width, height }));
        }

        // Function to get position and size from localStorage
        function getPositionAndSize() {
            const savedPosition = localStorage.getItem('draggableSubtitlesPosition');
            return savedPosition ? JSON.parse(savedPosition) : { left: '859px', top: '83px', width: '384.891px', height: '436px' };
        }

        // Wait for the document to be ready
        $(document).ready(function() {
            // Get initial position and size from localStorage
            const initialPositionAndSize = getPositionAndSize();


            // Create draggable and resizable window elements
            draggableDiv = document.createElement('div');
            draggableDiv.id = 'draggableSubtitles';
            Object.assign(draggableDiv.style, {
                width: initialPositionAndSize.width,
                height: initialPositionAndSize.height,
                zIndex: 1000,
                padding: '0.5em',
                backgroundColor: '#f0f0f0',
                border: '1px solid #ccc',
                position: 'absolute',
                left: initialPositionAndSize.left,
                top: initialPositionAndSize.top,
            });
            //init then hide
            $(draggableDiv).hide();

            const headerDiv = document.createElement('div');
            headerDiv.className = 'header';
            Object.assign(headerDiv.style, {
                cursor: 'move',
                backgroundColor: '#ccc',
                padding: '10px',
                textAlign: 'center',
                fontWeight: 'bold'
            });
            headerDiv.textContent = 'Drag me';

            contentDiv = document.createElement('div');
            contentDiv.className = 'content';
            contentDiv.style.padding = '10px';

            windowDiv = document.createElement('div');
            Object.assign(windowDiv.style, {
                overflow: 'auto',
                position: 'absolute',
                width: '95%',
                height: '90%',
            });
            // Assemble the draggable and resizable window
            windowDiv.appendChild(contentDiv);

            draggableDiv.appendChild(headerDiv);
            draggableDiv.appendChild(windowDiv);

            // Append the draggable and resizable window to the body
            document.body.appendChild(draggableDiv);

            // Make the window draggable
            $('#draggableSubtitles').draggable({
                handle: '.header',
                stop: function(event, ui) {
                    const left = ui.position.left + 'px';
                    const top = ui.position.top + 'px';
                    const width = $('#draggableSubtitles').width() + 'px';
                    const height = $('#draggableSubtitles').height() + 'px';
                    savePositionAndSize(left, top, width, height);
                }
            });

            // Make the window resizable
            $('#draggableSubtitles').resizable({
                stop: function(event, ui) {
                    const left = ui.position.left + 'px';
                    const top = ui.position.top + 'px';
                    const width = ui.size.width + 'px';
                    const height = ui.size.height + 'px';
                    savePositionAndSize(left, top, width, height);
                }
            });


        });
   }

    // Function to load subtitles
    async function renderSubtitles(videoId) {
        try {

            if (!videoId) {
                console.error('Invalid YouTube URL');
                return;
            }

            // Fetch video page HTML
            const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`);
            const pageHtml = await response.text();

            // Extract player response JSON from the HTML
            const playerResponseRegex = /ytInitialPlayerResponse\s*=\s*(\{.*?\});/;
            const playerResponseMatch = pageHtml.match(playerResponseRegex);

            if (!playerResponseMatch) {
                console.error('Could not extract player response');
                return;
            }

            const playerResponse = JSON.parse(playerResponseMatch[1]);

            // Get subtitle tracks
            const captionTracks = playerResponse.captions?.playerCaptionsTracklistRenderer?.captionTracks;

            if (!captionTracks || captionTracks.length === 0) {
                console.error('No subtitles found for this video');
                return;
            }

            // Fetch subtitles for the first track
            const subtitleTrackUrl = captionTracks[0].baseUrl;
            const subtitlesResponse = await fetch(subtitleTrackUrl);
            const subtitlesXml = await subtitlesResponse.text();

            // Parse XML and extract subtitles
            const parser = new DOMParser();
            const subtitlesDoc = parser.parseFromString(subtitlesXml, 'text/xml');
            const texts = subtitlesDoc.getElementsByTagName('text');

            // existing code to fetch and parse subtitles...
            const subtitles = [];
            for (let i = 0; i < texts.length; i++) {
                const start = texts[i].getAttribute('start');
                const dur = texts[i].getAttribute('dur');
                let text = texts[i].textContent;
                text = decodeHtmlEntities(text); // Decode HTML entities here
                subtitles.push({ start, dur, text });
            }

            console.log('Subtitles:', subtitles);
            return subtitles;
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }

    function main(){
        renderDragableDiv();
        //handle youtube page changed event
        window.addEventListener('yt-page-data-updated', onPageChanged);
        setupVideoPlayerListener();
    }

    main();
})();