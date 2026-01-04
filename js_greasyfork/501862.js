// ==UserScript==
// @name         GreasyFork Media Preview
// @author       NWP
// @description  Automatically show media previews (video, audio, images, gifs) on GreasyFork links. It supports: .mp3, .wav, .flac, .aac, .ogg, .m4a, .wma, .alac, .aiff, .amr, .mp4, .webm, .ogv, .avi, .mov, .mkv, .flv, .wmv, .m4v, .3gp, .jpg, .jpeg, .png, .bmp, .svg, .gif, .apng, .webp
// @namespace    https://greasyfork.org/users/877912
// @version      0.1
// @license      MIT
// @match        *://greasyfork.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501862/GreasyFork%20Media%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/501862/GreasyFork%20Media%20Preview.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const audioFormats = ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a', '.wma', '.alac', '.aiff', '.amr'];
    const videoFormats = ['.mp4', '.webm', '.ogv', '.avi', '.mov', '.mkv', '.flv', '.wmv', '.m4v', '.3gp'];
    const imageFormats = ['.jpg', '.jpeg', '.png', '.bmp', '.svg'];
    const gifFormats = ['.gif', '.apng', '.webp'];

    function createMediaElement(url) {
        let media;
        if (audioFormats.some(format => url.endsWith(format))) {
            media = document.createElement('audio');
            media.src = url;
            media.controls = true;
            media.autoplay = false;
            media.loop = true;
            media.muted = false;
            media.classList.add('added-by-script');
        } else if (videoFormats.some(format => url.endsWith(format))) {
            media = document.createElement('video');
            media.src = url;
            media.style.width = '20rem';
            media.style.height = '15rem';
            media.controls = true;
            media.autoplay = false;
            media.loop = true;
            media.muted = false;
            media.classList.add('added-by-script');
        } else if (gifFormats.some(format => url.endsWith(format))) {
            media = document.createElement('div');
            media.style.display = 'flex';
            media.style.flexDirection = 'column';
            media.style.alignItems = 'flex-start';
            media.style.width = '20rem';
            media.style.height = 'auto';
            media.style.marginBottom = '0.625rem';

            const img = document.createElement('img');
            img.src = url;
            img.style.width = '20rem';
            img.style.height = '15rem';
            img.classList.add('added-by-script');
            img.dataset.pausedSrc = url;
            img.dataset.playing = 'false';
            img.style.display = 'none';

            const canvas = document.createElement('canvas');
            canvas.style.width = '20rem';
            canvas.style.height = '15rem';
            media.appendChild(canvas);

            const ctx = canvas.getContext('2d');
            const gif = new Image();
            gif.src = url;
            gif.onload = function() {
                ctx.drawImage(gif, 0, 0, canvas.width, canvas.height);
            };

            const playButton = document.createElement('button');
            playButton.innerText = 'Play';
            playButton.style.display = 'block';
            playButton.style.marginTop = '0.625rem';
            playButton.style.alignSelf = 'flex-start';

            playButton.onclick = function(event) {
                event.preventDefault();
                if (img.dataset.playing === 'true') {
                    img.style.display = 'none';
                    canvas.style.display = 'block';
                    img.dataset.playing = 'false';
                    playButton.innerText = 'Play';
                } else {
                    img.style.display = 'block';
                    canvas.style.display = 'none';
                    img.dataset.playing = 'true';
                    playButton.innerText = 'Stop';
                }
            };

            media.appendChild(img);
            media.appendChild(playButton);
            media.classList.add('added-by-script');
        } else if (imageFormats.some(format => url.endsWith(format))) {
            media = document.createElement('img');
            media.src = url;
            media.style.width = '20rem';
            media.style.height = '15rem';
            media.classList.add('added-by-script');
        }
        return media;
    }

    function showMediaPreviews(container) {
        const mediaLinks = container.querySelectorAll(
            audioFormats.map(format => `a[href$="${format}"]`)
            .concat(videoFormats.map(format => `a[href$="${format}"]`))
            .concat(imageFormats.map(format => `a[href$="${format}"]`))
            .concat(gifFormats.map(format => `a[href$="${format}"]`))
            .join(', ')
        );
        mediaLinks.forEach(link => {
            if (!link.dataset.processed) {
                const media = createMediaElement(link.href);
                if (media) {
                    const paragraph = document.createElement('p');
                    paragraph.appendChild(media);
                    link.parentNode.insertBefore(paragraph, link.nextSibling);
                    link.dataset.processed = 'true';
                }
            }
        });
    }

    function initializeMediaPreviews() {
        const additionalInfo = document.querySelector('#additional-info');
        if (additionalInfo) {
            showMediaPreviews(additionalInfo);
        }

        const previewResults = document.querySelectorAll('.preview-results.user-content[style*="display: block"]');
        previewResults.forEach(container => {
            showMediaPreviews(container);
        });
    }

    window.onload = function() {
        initializeMediaPreviews();
    };

    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.attributeName === 'style' && mutation.target.style.display === 'block') {
                showMediaPreviews(mutation.target);
            }
        });
    });

    document.querySelectorAll('.preview-results.user-content').forEach(container => {
        observer.observe(container, { attributes: true, attributeFilter: ['style'] });
    });

})();