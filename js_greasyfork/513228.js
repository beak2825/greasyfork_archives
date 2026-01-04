// ==UserScript==
// @name         Dapiya Floater Video Generator
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Simple webm video generation script for https://dapiya.top/satellite/floater/
// @author       Dapiya
// @match        *://*.dapiya.top/satellite/floater/*
// @grant        none
// @require      https://unpkg.com/@ffmpeg/ffmpeg@0.11.6/dist/ffmpeg.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513228/Dapiya%20Floater%20Video%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/513228/Dapiya%20Floater%20Video%20Generator.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    function addMainPageMP4Button() {
        if (!document.getElementById('MainCreateMP4Button')) {
            const mp4Button = document.createElement('button');
            mp4Button.innerText = 'Create MP4 from Images';
            mp4Button.className = 'btn btn-primary';
            mp4Button.id = 'MainCreateMP4Button';
            mp4Button.style.margin = '20px';
            mp4Button.style.position = 'fixed';
            mp4Button.style.top = '20px';
            mp4Button.style.right = '20px';
            mp4Button.addEventListener('click', async () => {
                console.log('MP4 button clicked, showing options dialog...');
                const imageInfo = getImageInfo();
                if (imageInfo) {
                    console.log('Image info:', imageInfo);
                    const options = await showOptionsDialog();
                    if (options) {
                        await generateMP4FromImageInfo(imageInfo, options);
                    }
                } else {
                    alert('Could not determine storm name and data type. Please ensure the image is loaded on the page.');
                }
            });
            document.body.appendChild(mp4Button);
        }
    }

    function getImageInfo() {
        const imgElement = document.querySelector('img[src*="_"][src$=".png"]:not([src*="Dapiya"])');
        console.log('Found image element:', imgElement);
        if (imgElement) {
            const srcParts = imgElement.src.split('/').pop().split('.');
            console.log('Image source parts:', srcParts);
            if (srcParts.length >= 2) {
                const [nameAndType] = srcParts;
                const [stormName, dataType] = nameAndType.split('_');
                if (stormName && dataType) {
                    return {
                        stormName: stormName,
                        dataType: dataType
                    };
                }
            }
        }
        console.error('Could not determine storm name and data type.');
        return null;
    }

    function showOptionsDialog() {
    return new Promise((resolve) => {
        const dialog = document.createElement('div');
        dialog.style.position = 'fixed';
        dialog.style.left = '50%';
        dialog.style.top = '50%';
        dialog.style.transform = 'translate(-50%, -50%)';
        dialog.style.backgroundColor = 'white';
        dialog.style.padding = '20px';
        dialog.style.border = '1px solid black';
        dialog.style.zIndex = '1000';

        dialog.innerHTML = `
            <h2>Video Generation Options</h2>
            <label>Number of images: <input type="number" id="numImages" value="20" min="1" max="2000"></label><br><br>
            <label>Frame rate: <input type="number" id="frameRate" value="5" min="1" max="60"></label><br><br>
            <label>Bitrate (kbps): <input type="number" id="bitrate" value="2000" min="500" max="16000"></label><br><br>
            <button id="generateButton">Generate Video</button>
            <button id="cancelButton">Cancel</button>
        `;

        document.body.appendChild(dialog);

        document.getElementById('generateButton').addEventListener('click', () => {
            const numImages = parseInt(document.getElementById('numImages').value);
            const frameRate = parseInt(document.getElementById('frameRate').value);
            const bitrate = parseInt(document.getElementById('bitrate').value) * 1000; // Convert to bps
            document.body.removeChild(dialog);
            resolve({ numImages, frameRate, bitrate });
        });

        document.getElementById('cancelButton').addEventListener('click', () => {
            document.body.removeChild(dialog);
            resolve(null);
        });
    });
}

    async function getLatestImageUrls(stormName, dataType, numImages) {
    console.log(`Fetching image URLs for ${stormName} ${dataType}`);
    const baseUrl = `https://data.dapiya.top/history/${stormName}/${dataType}/`;
    const response = await fetch(baseUrl);
    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    const links = Array.from(doc.querySelectorAll('a'))
        .map(a => a.href)
        .filter(href => href.endsWith('.png') && href.includes(`${stormName}_${dataType}`))
        .sort((a, b) => b.localeCompare(a))  // Sort in descending order
        .slice(0, numImages)  // Take the first 'numImages' (which are the latest due to sorting)
        .reverse()  // Reverse to get chronological order
        .map(href => `${baseUrl}${href.split('/').pop()}`);
    console.log('Found image URLs:', links);
    return links;
}

    async function getImageDimensions(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve({ width: img.width, height: img.height });
            img.onerror = reject;
            img.src = url;
        });
    }

    async function generateMP4FromImageInfo(imageInfo, options) {
    try {
        const imageUrls = await getLatestImageUrls(imageInfo.stormName, imageInfo.dataType, options.numImages);
        console.log('Image URLs:', imageUrls);

        if (imageUrls.length === 0) {
            console.error('No image URLs found');
            return;
        }

        const dimensions = await getImageDimensions(imageUrls[0]);
        console.log('Image dimensions:', dimensions);

        const images = await Promise.all(imageUrls.map(async url => {
            const response = await fetch(url);
            const blob = await response.blob();
            return URL.createObjectURL(blob);
        }));

        console.log('Loaded images:', images);

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = dimensions.width;
        canvas.height = dimensions.height;

        const stream = canvas.captureStream(options.frameRate);
        const mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'video/webm',
            videoBitsPerSecond: options.bitrate
        });

        const chunks = [];
        mediaRecorder.ondataavailable = e => chunks.push(e.data);
        mediaRecorder.onstop = async () => {
            const webmBlob = new Blob(chunks, { type: 'video/webm' });
            const url = URL.createObjectURL(webmBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${imageInfo.stormName}_${imageInfo.dataType}_video.webm`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            console.log('WebM video generated and download triggered.');
        };

        mediaRecorder.start();

        for (let i = 0; i < images.length; i++) {
            await new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    if (i === images.length - 1) {
                        mediaRecorder.stop();
                    }
                    setTimeout(resolve, 1000 / options.frameRate);
                };
                img.src = images[i];
            });
        }

    } catch (error) {
        console.error('Error generating video from images:', error);
        console.error('Error stack:', error.stack);
    }
}

    addMainPageMP4Button();
})();